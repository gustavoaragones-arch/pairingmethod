#!/usr/bin/env node
/**
 * FOOD-14D Stages 2–4 — Canonical editorial remapping, duplicate collapse, validation.
 * Output: data/runtime/protein-food-editorial-relationships.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import {
  createProteinEditorialRefinementContext,
  refineProteinEditorialRelationships,
  validateRefinedEditorial,
} from "../lib/editorial/proteinEditorialRefinement.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const INPUT_PATH = path.join(RUNTIME_DIR, "protein-food-editorial-relationships.json");
const OUTPUT_PATH = INPUT_PATH;
const REPORT_PATH = path.join(ROOT, "reports/protein-editorial-refinement-report.json");

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

function main() {
  const { resolver } = createProteinEditorialRefinementContext(ROOT);
  const editorial = JSON.parse(fs.readFileSync(INPUT_PATH, "utf8"));
  const idMap = JSON.parse(fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-id-map.json"), "utf8"));
  const index = JSON.parse(fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-index.json"), "utf8"));
  const structural = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-relationships.json"), "utf8")
  );

  const refined = refineProteinEditorialRelationships({
    editorial,
    resolver,
    idMap,
    catalogVersion: index.meta?.catalog_version ?? editorial.meta?.catalog_version,
  });

  const validation = validateRefinedEditorial({
    output: refined,
    resolver,
    idMap,
    structural,
  });

  const determinismPass =
    serializeRuntime({ meta: refined.meta, edges: refined.edges }) ===
    serializeRuntime({
      meta: refineProteinEditorialRelationships({
        editorial,
        resolver,
        idMap,
        catalogVersion: index.meta?.catalog_version ?? editorial.meta?.catalog_version,
      }).meta,
      edges: refineProteinEditorialRelationships({
        editorial,
        resolver,
        idMap,
        catalogVersion: index.meta?.catalog_version ?? editorial.meta?.catalog_version,
      }).edges,
    });

  const overall =
    validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-14D",
      overall_result: "FAIL",
      errors: validation.errors,
      metrics: {
        "Editorial edges": refined.stats.total_edges,
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
    phase: "FOOD-14D",
    overall_result: "PASS",
    output: "data/runtime/protein-food-editorial-relationships.json",
    metrics: {
      "Edges before": editorial.edges.length,
      "Edges after": refined.stats.total_edges,
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
  console.log(`Editorial relationships: ${OUTPUT_PATH}`);
  console.log(`Report: ${REPORT_PATH}`);
}

main();
