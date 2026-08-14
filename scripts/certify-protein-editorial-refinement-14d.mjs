#!/usr/bin/env node
/**
 * FOOD-14D Stage 5 — Editorial refinement certification.
 * Output: reports/protein-editorial-refinement-14d.json
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  buildEditorialInventory,
  createProteinEditorialRefinementContext,
  validateRefinedEditorial,
} from "../lib/editorial/proteinEditorialRefinement.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "reports/protein-editorial-refinement-14d.json");
const BASELINE_PATH = path.join(ROOT, "reports/protein-editorial-refinement-14d-baseline.json");

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

  const winePath = "data/runtime/protein-food-wine-relationships.json";
  const publicationPaths = [
    "data/pages/protein-food-pages.json",
    "data/generated/protein-food-pages.json",
    "data/schema/protein-food-schema.json",
    "data/navigation/protein-food-links.json",
    "data/search/protein-food-search-index.json",
  ];

  const wineModified =
    baseline?.immutable_hashes?.[winePath] &&
    sha256(winePath) !== baseline.immutable_hashes[winePath];
  const publicationModified = publicationPaths.some(
    (relativePath) =>
      baseline?.immutable_hashes?.[relativePath] &&
      sha256(relativePath) !== baseline.immutable_hashes[relativePath]
  );

  if (wineModified) errors.push("Wine artifacts modified during FOOD-14D");
  if (publicationModified) errors.push("Publication artifacts modified during FOOD-14D");

  const { resolver } = createProteinEditorialRefinementContext(ROOT);
  const editorial = loadJson("data/runtime/protein-food-editorial-relationships.json");
  const idMap = loadJson("data/runtime/protein-food-id-map.json");
  const structural = loadJson("data/runtime/protein-food-relationships.json");
  const inventory = loadJson("reports/protein-editorial-inventory-14d.json");

  const validation = validateRefinedEditorial({
    output: editorial,
    resolver,
    idMap,
    structural,
  });

  if (validation.errors.length > 0) {
    errors.push(...validation.errors);
  }

  const remappedEdges = editorial.edges.filter((edge) => {
    const classified = buildEditorialInventory([edge], resolver, idMap).entries[0];
    return classified.source_resolved !== edge.source || classified.target_resolved !== edge.target;
  }).length;

  const certification = {
    phase: "FOOD-14D",
    stage: 5,
    inventory_counts: inventory.classifications ?? inventory.metrics,
    remapped_edges: editorial.meta?.refinement?.remapped_edges ?? remappedEdges,
    duplicate_collapse: {
      duplicates_before_collapse: editorial.meta?.refinement?.duplicates_before_collapse ?? 0,
      duplicates_removed: editorial.meta?.refinement?.duplicates_removed ?? 0,
      final_unique_edge_count: editorial.meta?.edge_count ?? editorial.edges.length,
    },
    retained_entities_verified: validation.retainedVerified,
    deprecated_endpoints_remaining: validation.deprecatedEndpoints,
    runtime_modified: errors.some((error) => error.startsWith("Runtime artifact modified")),
    wine_modified: wineModified,
    publication_modified: publicationModified,
    editorial_edge_count: editorial.edges.length,
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
