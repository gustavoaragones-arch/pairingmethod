#!/usr/bin/env node
/**
 * FOOD-05B — Populate data/vegetable-catalog.json from canonical seed data.
 * Intrinsic metadata only; relationships deferred to FOOD-05D/E.
 *
 * Run: node scripts/bootstrap-vegetable-catalog.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  VEGETABLE_SEED,
  GROUP_SLUGS,
  GROUP_TO_CULINARY_GROUP,
} from "./vegetable-catalog-seed-05b.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/vegetable-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/vegetable-bootstrap-report.json");

const RELATIONSHIP_ARRAYS = [
  "typical_descriptors",
  "wine_pairings",
  "avoid_wine_pairings",
  "related_styles",
  "related_descriptors",
  "related_techniques",
  "similar_vegetables",
  "substitutions",
  "commonly_served_with",
  "common_preparations",
];

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

function buildVegetable(seed) {
  const culinaryGroup = GROUP_TO_CULINARY_GROUP[seed.parent_group];
  const entity = {
    id: `food.vegetable.${seed.parent_group}.${seed.slug}`,
    slug: seed.slug,
    display_name: seed.display_name,
    entity_type: "vegetable",
    domain: "culinary",
    parent_group: seed.parent_group,
    scientific_name: seed.scientific_name,
    external_ids: {},
    catalog_version: "1.0.0",
    food_ontology_version: "1.2.0",
    culinary_group: culinaryGroup,
    culinary_role: seed.culinary_role,
    plant_part: seed.plant_part,
    flavor_intensity: seed.flavor_intensity,
    flavor_profile: [],
    texture: seed.texture,
    moisture_class: seed.moisture_class,
    seasonality: seed.seasonality,
    origin_context: seed.origin_context ?? "",
    aliases: seed.aliases ?? [],
    summary: seed.summary,
    seo_title: `${seed.display_name} — Vegetable Ontology`,
    seo_description: seed.summary.length > 155 ? `${seed.summary.slice(0, 152)}...` : seed.summary,
  };

  for (const field of RELATIONSHIP_ARRAYS) {
    entity[field] = [];
  }

  return entity;
}

function validateSeed() {
  const errors = [];
  const slugs = new Set();

  for (const seed of VEGETABLE_SEED) {
    if (slugs.has(seed.slug)) errors.push(`Duplicate seed slug: ${seed.slug}`);
    slugs.add(seed.slug);
    if (!GROUP_SLUGS.includes(seed.parent_group)) {
      errors.push(`${seed.slug}: invalid parent_group ${seed.parent_group}`);
    }
    if (!seed.scientific_name?.includes(" ")) {
      errors.push(`${seed.slug}: scientific_name must be binomial`);
    }
  }

  if (errors.length) {
    throw new Error(`Seed validation failed:\n${errors.join("\n")}`);
  }
}

function requireAuditPass() {
  const result = spawnSync("node", ["scripts/catalog-audit-vegetable-05b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function updateGroupHubs(catalog, vegetables) {
  const byGroup = Object.fromEntries(GROUP_SLUGS.map((g) => [g, []]));
  for (const v of vegetables) {
    byGroup[v.parent_group].push(v.slug);
  }

  for (const group of catalog.groups) {
    const childSlugs = byGroup[group.slug].sort();
    group.child_slugs = childSlugs;
    group.summary = `${group.name} — ${childSlugs.length} canonical vegetables in the Vegetable Ontology.`;
  }
}

function main() {
  validateSeed();

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const vegetables = VEGETABLE_SEED.map(buildVegetable).sort((a, b) => a.slug.localeCompare(b.slug));

  updateGroupHubs(catalog, vegetables);

  catalog.vegetables = vegetables;
  catalog.meta = {
    ...catalog.meta,
    phase: "FOOD-05B",
    description:
      "Vegetable Ontology — canonical catalog populated (FOOD-05B). Intrinsic metadata only; relationships deferred to FOOD-05D/E.",
    entity_count: vegetables.length,
    last_entity: vegetables[vegetables.length - 1]?.slug ?? null,
  };

  const countsByGroup = GROUP_SLUGS.reduce((acc, slug) => {
    acc[slug] = vegetables.filter((v) => v.parent_group === slug).length;
    return acc;
  }, {});

  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(sortKeysDeep(catalog), null, 2)}\n`);

  requireAuditPass();

  const report = {
    generated_at: new Date().toISOString(),
    phase: "FOOD-05B",
    domain: "vegetable",
    entity_count: vegetables.length,
    counts_by_group: countsByGroup,
    catalog_path: "data/vegetable-catalog.json",
    audit_script: "scripts/catalog-audit-vegetable-05b.mjs",
    canonical_entity_rule: "cultivar and color variants are aliases, not entities",
    flavor_profile_policy: "reserved empty array",
    relationship_policy: "all relationship arrays empty",
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  console.log(JSON.stringify(report, null, 2));
  console.log(`Catalog: ${CATALOG_PATH}`);
  console.log(`Report: ${REPORT_PATH}`);
}

main();
