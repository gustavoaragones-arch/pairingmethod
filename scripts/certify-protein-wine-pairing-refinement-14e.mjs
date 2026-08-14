#!/usr/bin/env node
/**
 * FOOD-14E Stage 4 — Wine pairing refinement certification.
 * Output: reports/protein-wine-pairing-refinement-14e.json
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  createProteinWinePairingRefinementContext,
  validateRefinedPairing,
} from "../lib/pairing/proteinWinePairingRefinement.js";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { listWinemakingTechniqueEntries } from "../lib/taxonomy-winemaking-technique.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "reports/protein-wine-pairing-refinement-14e.json");
const BASELINE_PATH = path.join(ROOT, "reports/protein-wine-pairing-refinement-14e-baseline.json");

const RUNTIME_ARTIFACTS_14C = [
  "data/runtime/protein-food-index.json",
  "data/runtime/protein-food-categories.json",
  "data/runtime/protein-food-groups.json",
  "data/runtime/protein-food-id-map.json",
  "data/runtime/protein-food-slug-map.json",
  "data/runtime/protein-food-species-map.json",
  "data/runtime/protein-food-vocabulary-index.json",
  "data/runtime/protein-food-relationships.json",
];

function sha256(relativePath) {
  const absolute = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolute)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex");
}

function loadJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function loadWineOntology() {
  const taxonomy = loadTaxonomy();
  return {
    styleIds: new Set(listWineStyleEntries().map((entry) => entry.slug)),
    descriptorIds: new Set(
      Object.values(taxonomy.nodes)
        .filter((node) => node.type === "descriptor")
        .map((node) => node.slug)
    ),
    techniqueIds: new Set(listWinemakingTechniqueEntries().map((entry) => entry.slug)),
  };
}

function main() {
  const errors = [];
  const baseline = fs.existsSync(BASELINE_PATH)
    ? JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"))
    : null;

  for (const relativePath of RUNTIME_ARTIFACTS_14C) {
    const expected = baseline?.runtime_14c_hashes?.[relativePath] ?? baseline?.immutable_hashes?.[relativePath];
    const actual = sha256(relativePath);
    if (expected && actual !== expected) {
      errors.push(`Runtime artifact modified: ${relativePath}`);
    }
  }

  const editorialPath = "data/runtime/protein-food-editorial-relationships.json";
  const editorialModified =
    baseline?.editorial_hash &&
    sha256(editorialPath) !== baseline.editorial_hash;
  if (editorialModified) {
    errors.push("Editorial artifacts modified during FOOD-14E");
  }

  const publicationPaths = [
    "data/pages/protein-food-pages.json",
    "data/generated/protein-food-pages.json",
    "data/schema/protein-food-schema.json",
    "data/navigation/protein-food-links.json",
    "data/search/protein-food-search-index.json",
  ];
  const publicationModified = publicationPaths.some(
    (relativePath) =>
      baseline?.immutable_hashes?.[relativePath] &&
      sha256(relativePath) !== baseline.immutable_hashes[relativePath]
  );
  if (publicationModified) {
    errors.push("Publication artifacts modified during FOOD-14E");
  }

  const { resolver } = createProteinWinePairingRefinementContext(ROOT);
  const pairing = loadJson("data/runtime/protein-food-wine-relationships.json");
  const idMap = loadJson("data/runtime/protein-food-id-map.json");
  const structural = loadJson("data/runtime/protein-food-relationships.json");
  const editorial = loadJson("data/runtime/protein-food-editorial-relationships.json");
  const inventory = loadJson("reports/protein-wine-pairing-inventory-14e.json");
  const wine = loadWineOntology();

  const validation = validateRefinedPairing({
    output: pairing,
    resolver,
    idMap,
    structural,
    editorial,
    wine,
  });

  if (validation.errors.length > 0) {
    errors.push(...validation.errors);
  }

  const certification = {
    phase: "FOOD-14E",
    stage: 4,
    inventory_totals: inventory.classifications ?? inventory.metrics,
    remapped_relationships: pairing.meta?.refinement?.remapped_edges ?? inventory.metrics?.["Remap required"] ?? 0,
    duplicate_statistics: {
      duplicates_before_collapse: pairing.meta?.refinement?.duplicates_before_collapse ?? 0,
      duplicates_removed: pairing.meta?.refinement?.duplicates_removed ?? 0,
      final_unique_edge_count: pairing.meta?.edge_count ?? pairing.edges.length,
    },
    canonical_verification: {
      deprecated_endpoints_remaining: validation.deprecatedEndpoints,
      orphan_references: validation.orphanReferences,
      retained_entities_verified: validation.retainedVerified,
    },
    runtime_modified: errors.some((error) => error.startsWith("Runtime artifact modified")),
    editorial_modified: editorialModified,
    publication_modified: publicationModified,
    pairing_edge_count: pairing.edges.length,
    overall: errors.length === 0 ? "PASS" : "FAIL",
    errors,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(certification, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(certification, null, 2));
  console.log(`Certification: ${OUTPUT_PATH}`);

  if (certification.overall !== "PASS") {
    console.error(errors.join("\n"));
    process.exit(1);
  }
}

main();
