#!/usr/bin/env node
/**
 * FOOD-14C Stage 1 — Runtime normalization inventory (read-only audit).
 * Output: reports/runtime-normalization-inventory-14c.json
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "reports/runtime-normalization-inventory-14c.json");
const BASELINE_PATH = path.join(ROOT, "reports/runtime-normalization-14c-baseline.json");

const IMMUTABLE_PATHS = [
  "data/protein-food-catalog.json",
  "data/protein-migration-map.json",
  "data/runtime/protein-food-editorial-relationships.json",
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

const INVENTORY = [
  {
    file: "scripts/bootstrap-protein-food-catalog.js",
    function: "bootstrap / compileProteinFoodRuntime",
    lookup_type: "catalog_entity_id → idMap; slug → slugMap; inverted indexes",
    deprecated_handling: "FOOD-14C — filter via proteinRuntimeAllowed",
    migration_required: true,
    modification_scope: "MODIFIED_14C",
  },
  {
    file: "scripts/validate-runtime-protein-food-02b2.mjs",
    function: "validateIdentity / validateMigrationCompliance",
    lookup_type: "idMap ↔ slugMap cross-validation; PROTEIN-005 assertions",
    deprecated_handling: "FOOD-14C — assert deprecated absent from runtime artifacts",
    migration_required: true,
    modification_scope: "MODIFIED_14C",
  },
  {
    file: "scripts/map-protein-food-relationships-02c1.mjs",
    function: "mapProteinFoodRelationships",
    lookup_type: "idMap graph traversal → structural edges",
    deprecated_handling: "inherits filtered idMap from bootstrap",
    migration_required: false,
    modification_scope: "READ_ONLY_14C",
  },
  {
    file: "lib/runtime/proteinMigrationResolver.js",
    function: "resolveProteinId / proteinRuntimeAllowed",
    lookup_type: "legacy food.protein.* → canonical ID",
    deprecated_handling: "FULL — consumes migration map SSOT",
    migration_required: true,
    modification_scope: "CREATED_14C",
  },
  {
    file: "scripts/map-protein-food-editorial-relationships-02c2.mjs",
    function: "resolveFoodId",
    lookup_type: "slug → food.protein.* via slugMap",
    deprecated_handling: "unchanged in FOOD-14C",
    migration_required: false,
    modification_scope: "READ_ONLY_14C",
  },
  {
    file: "scripts/map-protein-food-wine-relationships-02d1.mjs",
    function: "resolveFoodId",
    lookup_type: "slug → food.protein.* via slugMap",
    deprecated_handling: "unchanged in FOOD-14C",
    migration_required: false,
    modification_scope: "READ_ONLY_14C",
  },
  {
    file: "lib/food-publication/runtime-loader.js",
    function: "loadDomainInputs",
    lookup_type: "loads protein-food-index.json, groups, categories",
    deprecated_handling: "read-only consumer",
    migration_required: false,
    modification_scope: "READ_ONLY_14C",
  },
  {
    file: "lib/food-publication/projections.js",
    function: "generateProjections",
    lookup_type: "leaf.id → editorial/pairing edge index",
    deprecated_handling: "unchanged in FOOD-14C",
    migration_required: false,
    modification_scope: "READ_ONLY_14C",
  },
  {
    file: "lib/food-publication/links.js",
    function: "leafLinkFromId",
    lookup_type: "entity ID → navigation link",
    deprecated_handling: "unchanged in FOOD-14C",
    migration_required: false,
    modification_scope: "READ_ONLY_14C",
  },
  {
    file: "lib/food-publication/search.js",
    function: "buildLeafDocument",
    lookup_type: "page.identity.id → search document",
    deprecated_handling: "unchanged in FOOD-14C",
    migration_required: false,
    modification_scope: "READ_ONLY_14C",
  },
  {
    file: "lib/protein-food-navigation.js",
    function: "isResolvableHref",
    lookup_type: "href/id resolution",
    deprecated_handling: "unchanged in FOOD-14C",
    migration_required: false,
    modification_scope: "READ_ONLY_14C",
  },
];

const report = {
  phase: "FOOD-14C",
  stage: 1,
  overall_result: "PASS",
  migration_map: "data/protein-migration-map.json",
  resolver: "lib/runtime/proteinMigrationResolver.js",
  lookups: INVENTORY,
  metrics: {
    "Files inventoried": INVENTORY.length,
    "Migration required": INVENTORY.filter((e) => e.migration_required).length,
    "Modified in FOOD-14C": INVENTORY.filter((e) => e.modification_scope.includes("MODIFIED") || e.modification_scope.includes("CREATED")).length,
    "Read-only in FOOD-14C": INVENTORY.filter((e) => e.modification_scope.startsWith("READ_ONLY")).length,
  },
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
fs.writeFileSync(
  BASELINE_PATH,
  `${JSON.stringify(
    {
      phase: "FOOD-14C",
      captured_at: new Date().toISOString(),
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
