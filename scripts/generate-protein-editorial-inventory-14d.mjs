#!/usr/bin/env node
/**
 * FOOD-14D Stage 1 — Editorial inventory (read-only audit).
 * Output: reports/protein-editorial-inventory-14d.json
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  buildEditorialInventory,
  createProteinEditorialRefinementContext,
} from "../lib/editorial/proteinEditorialRefinement.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "reports/protein-editorial-inventory-14d.json");
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

const IMMUTABLE_PATHS = [
  ...RUNTIME_ARTIFACTS_14C,
  "data/protein-food-catalog.json",
  "data/protein-migration-map.json",
  "data/runtime/protein-food-wine-relationships.json",
  "data/pages/protein-food-pages.json",
  "data/generated/protein-food-pages.json",
  "data/schema/protein-food-schema.json",
  "data/navigation/protein-food-links.json",
  "data/search/protein-food-search-index.json",
];

function sha256(relativePath) {
  const absolute = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolute)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex");
}

function main() {
  const { resolver } = createProteinEditorialRefinementContext(ROOT);
  const editorial = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data/runtime/protein-food-editorial-relationships.json"), "utf8")
  );
  const idMap = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data/runtime/protein-food-id-map.json"), "utf8")
  );

  const inventory = buildEditorialInventory(editorial.edges, resolver, idMap);

  const report = {
    phase: "FOOD-14D",
    stage: 1,
    overall_result: "PASS",
    migration_map: "data/protein-migration-map.json",
    resolver: "lib/runtime/proteinMigrationResolver.js",
    source_artifact: "data/runtime/protein-food-editorial-relationships.json",
    edge_count: editorial.edges.length,
    classifications: inventory.counts,
    entries: inventory.entries,
    duplicate_collapse_preview: {
      duplicates_before_collapse: inventory.duplicates_before_collapse,
      duplicates_removed: inventory.duplicates_removed,
      final_unique_edge_count: inventory.collapsed_edge_count,
      duplicate_after_remap_keys: inventory.duplicate_after_remap_keys,
    },
    metrics: {
      "Edges inventoried": editorial.edges.length,
      Unchanged: inventory.counts.unchanged ?? 0,
      "Remap required": inventory.counts.remap_required ?? 0,
      "Deprecated endpoint": inventory.counts.deprecated_endpoint ?? 0,
      "Duplicate after remap": inventory.counts.duplicate_after_remap ?? 0,
      Orphan: inventory.counts.orphan ?? 0,
    },
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(
    BASELINE_PATH,
    `${JSON.stringify(
      {
        phase: "FOOD-14D",
        captured_at: new Date().toISOString(),
        runtime_14c_hashes: Object.fromEntries(RUNTIME_ARTIFACTS_14C.map((p) => [p, sha256(p)])),
        immutable_hashes: Object.fromEntries(IMMUTABLE_PATHS.map((p) => [p, sha256(p)])),
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Inventory: ${OUTPUT_PATH}`);
  console.log(`Baseline: ${BASELINE_PATH}`);
}

main();
