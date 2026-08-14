#!/usr/bin/env node
/**
 * FOOD-14C Stage 7 — Runtime normalization certification.
 * Output: reports/runtime-normalization-14c.json
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createProteinMigrationResolver } from "../lib/runtime/proteinMigrationResolver.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const OUTPUT_PATH = path.join(ROOT, "reports/runtime-normalization-14c.json");
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

function sha256(filePath) {
  const absolute = path.join(ROOT, filePath);
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
  const immutableHashes = baseline?.immutable_hashes ?? Object.fromEntries(
    IMMUTABLE_PATHS.map((relativePath) => [relativePath, sha256(relativePath)])
  );

  const resolver = createProteinMigrationResolver(ROOT);
  const idMap = loadJson("data/runtime/protein-food-id-map.json");
  const slugMap = loadJson("data/runtime/protein-food-slug-map.json");
  const index = loadJson("data/runtime/protein-food-index.json");
  const relationships = fs.existsSync(path.join(RUNTIME_DIR, "protein-food-relationships.json"))
    ? loadJson("data/runtime/protein-food-relationships.json")
    : null;

  const idSet = new Set(Object.keys(idMap));
  const slugSet = new Set(Object.keys(slugMap));
  const activeIds = new Set(Object.values(idMap).map((ref) => ref.id));

  let normalizedCount = 0;
  for (const entry of resolver.map.migrations) {
    if (resolver.resolveProteinId(entry.legacy_id) !== entry.canonical_id) {
      errors.push(`Resolver: ${entry.legacy_id} did not normalize to ${entry.canonical_id}`);
    } else {
      normalizedCount += 1;
    }
    if (idSet.has(entry.legacy_id) || slugSet.has(entry.legacy_slug)) {
      errors.push(`PROTEIN-005: deprecated runtime node ${entry.legacy_id}`);
    }
  }

  const retainedPresent = resolver.map.retained.every((entry) => idSet.has(entry.protein_id));
  if (!retainedPresent) {
    errors.push("Retained entities missing from runtime id map");
  }

  const duplicateCanonicalInProteinRuntime = resolver.map.migrations.filter((entry) =>
    activeIds.has(entry.canonical_id)
  );
  if (duplicateCanonicalInProteinRuntime.length > 0) {
    errors.push(
      `Duplicate runtime entities: ${duplicateCanonicalInProteinRuntime.map((e) => e.canonical_id).join(", ")}`
    );
  }

  let deprecatedInStructural = 0;
  if (relationships?.edges) {
    const deprecatedIds = new Set(resolver.map.migrations.map((entry) => entry.legacy_id));
    for (const edge of relationships.edges) {
      if (deprecatedIds.has(edge.source) || deprecatedIds.has(edge.target)) {
        deprecatedInStructural += 1;
        errors.push(`PROTEIN-005: deprecated entity in structural edge ${edge.source} -> ${edge.target}`);
      }
    }
  }

  const editorialModified =
    sha256("data/runtime/protein-food-editorial-relationships.json") !==
    immutableHashes["data/runtime/protein-food-editorial-relationships.json"];
  const wineModified =
    sha256("data/runtime/protein-food-wine-relationships.json") !==
    immutableHashes["data/runtime/protein-food-wine-relationships.json"];
  const publicationModified = [
    "data/pages/protein-food-pages.json",
    "data/generated/protein-food-pages.json",
    "data/schema/protein-food-schema.json",
    "data/navigation/protein-food-links.json",
    "data/search/protein-food-search-index.json",
  ].some((relativePath) => sha256(relativePath) !== immutableHashes[relativePath]);

  if (editorialModified) errors.push("Editorial artifacts modified during FOOD-14C");
  if (wineModified) errors.push("Wine artifacts modified during FOOD-14C");
  if (publicationModified) errors.push("Publication artifacts modified during FOOD-14C");

  const catalogModified =
    sha256("data/protein-food-catalog.json") !== immutableHashes["data/protein-food-catalog.json"];
  const migrationMapModified =
    sha256("data/protein-migration-map.json") !== immutableHashes["data/protein-migration-map.json"];
  if (catalogModified) errors.push("Catalog modified during FOOD-14C");
  if (migrationMapModified) errors.push("Migration map modified during FOOD-14C");

  const certification = {
    phase: "FOOD-14C",
    stage: 7,
    migration_map_loaded: Boolean(resolver.map?.migrations?.length),
    resolver_active: typeof resolver.resolveProteinId === "function",
    deprecated_ids_normalized: normalizedCount,
    deprecated_ids_expected: resolver.migrationCount,
    canonical_ids_returned: normalizedCount === resolver.migrationCount,
    retained_entities_preserved: retainedPresent,
    retained_entities_expected: resolver.retainedCount,
    duplicate_runtime_entities: duplicateCanonicalInProteinRuntime.length,
    runtime_generation_skips_deprecated:
      deprecatedInStructural === 0 &&
      !resolver.map.migrations.some((entry) => idSet.has(entry.legacy_id)),
    runtime_active_entity_count: idSet.size,
    catalog_entity_count: index.meta?.catalog_entity_count ?? null,
    deprecated_excluded: index.meta?.deprecated_excluded ?? null,
    editorial_modified: editorialModified,
    wine_modified: wineModified,
    publication_modified: publicationModified,
    catalog_modified: catalogModified,
    migration_map_modified: migrationMapModified,
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
