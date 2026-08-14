#!/usr/bin/env node
/**
 * FOOD-14E Stages 2–3 — Canonical wine pairing remapping, duplicate collapse, validation.
 * Output: data/runtime/protein-food-wine-relationships.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { listWinemakingTechniqueEntries } from "../lib/taxonomy-winemaking-technique.js";
import { listWineRegionEntries } from "../lib/taxonomy-wine-region.js";
import { listWineServingEntries } from "../lib/taxonomy-wine-serving.js";
import { listWineFaultEntries } from "../lib/taxonomy-wine-fault.js";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import {
  createProteinWinePairingRefinementContext,
  refineProteinWinePairingRelationships,
  validateRefinedPairing,
} from "../lib/pairing/proteinWinePairingRefinement.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const INPUT_PATH = path.join(RUNTIME_DIR, "protein-food-wine-relationships.json");
const OUTPUT_PATH = INPUT_PATH;
const REPORT_PATH = path.join(ROOT, "reports/protein-wine-pairing-refinement-report.json");

function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeysDeep(value[key]);
        return acc;
      }, {});
  }
  return value;
}

function writeJson(filePath, data) {
  const text = `${JSON.stringify(sortKeysDeep(data), null, 2)}\n`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
  return text;
}

function loadWineOntology() {
  const taxonomy = loadTaxonomy();
  const descriptorIds = new Set(
    Object.values(taxonomy.nodes)
      .filter((node) => node.type === "descriptor")
      .map((node) => node.slug)
  );

  return {
    styleIds: new Set(listWineStyleEntries().map((entry) => entry.slug)),
    descriptorIds,
    techniqueIds: new Set(listWinemakingTechniqueEntries().map((entry) => entry.slug)),
    regionIds: new Set(listWineRegionEntries().map((entry) => entry.slug)),
    servingIds: new Set(listWineServingEntries().map((entry) => entry.slug)),
    faultIds: new Set(listWineFaultEntries().map((entry) => entry.slug)),
  };
}

function main() {
  const { resolver } = createProteinWinePairingRefinementContext(ROOT);
  const pairing = JSON.parse(fs.readFileSync(INPUT_PATH, "utf8"));
  const idMap = JSON.parse(fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-id-map.json"), "utf8"));
  const index = JSON.parse(fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-index.json"), "utf8"));
  const structural = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-relationships.json"), "utf8")
  );
  const editorial = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-editorial-relationships.json"), "utf8")
  );
  const wine = loadWineOntology();

  const refined = refineProteinWinePairingRelationships({
    pairing,
    resolver,
    idMap,
    catalogVersion: index.meta?.catalog_version ?? pairing.meta?.catalog_version,
  });

  const validation = validateRefinedPairing({
    output: refined,
    resolver,
    idMap,
    structural,
    editorial,
    wine,
  });

  const rebuilt = refineProteinWinePairingRelationships({
    pairing,
    resolver,
    idMap,
    catalogVersion: index.meta?.catalog_version ?? pairing.meta?.catalog_version,
  });
  const determinismPass =
    serializeRuntime({ meta: refined.meta, edges: refined.edges }) ===
    serializeRuntime({ meta: rebuilt.meta, edges: rebuilt.edges });

  const overall =
    validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-14E",
      overall_result: "FAIL",
      errors: validation.errors,
      metrics: {
        "Pairing edges": refined.stats.pairing_edges,
        "Deprecated endpoints": validation.deprecatedEndpoints,
        "Orphan references": validation.orphanReferences,
        "Duplicate edges": validation.duplicates,
        Determinism: determinismPass ? "PASS" : "FAIL",
      },
    };
    writeJson(REPORT_PATH, report);
    console.error(validation.errors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(OUTPUT_PATH, { meta: refined.meta, edges: refined.edges });

  const report = {
    phase: "FOOD-14E",
    overall_result: "PASS",
    output: "data/runtime/protein-food-wine-relationships.json",
    metrics: {
      "Edges before": pairing.edges.length,
      "Edges after": refined.stats.pairing_edges,
      "Remapped edges": refined.stats.remapped_edges,
      "Duplicates before collapse": refined.stats.duplicates_before_collapse,
      "Duplicates removed": refined.stats.duplicates_removed,
      "Deprecated endpoints remaining": validation.deprecatedEndpoints,
      "Orphan references": validation.orphanReferences,
      "Retained entities verified": validation.retainedVerified,
      Determinism: "PASS",
    },
    relationship_type_counts: refined.stats.relationship_type_counts,
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Wine pairing relationships: ${OUTPUT_PATH}`);
  console.log(`Report: ${REPORT_PATH}`);
}

main();
