#!/usr/bin/env node
/**
 * FOOD-07B — Populate data/herb-spice-catalog.json from canonical seed data.
 * Intrinsic metadata only; relationships deferred to FOOD-07D/E.
 *
 * Run: node scripts/bootstrap-herb-spice-catalog.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  HERB_SPICE_SEED,
  GROUP_SLUGS,
  GROUP_TO_CULINARY_GROUP,
} from "./herb-spice-catalog-seed-07b.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/herb-spice-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/herb-spice-bootstrap-report.json");

const RELATIONSHIP_ARRAYS = [
  "typical_descriptors",
  "wine_pairings",
  "avoid_wine_pairings",
  "related_styles",
  "related_descriptors",
  "related_techniques",
  "similar_herb_spices",
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

function buildHerbSpice(seed) {
  const culinaryGroup = GROUP_TO_CULINARY_GROUP[seed.parent_group];
  const entity = {
    id: `food.herb.${seed.parent_group}.${seed.slug}`,
    slug: seed.slug,
    display_name: seed.display_name,
    entity_type: "herb_spice",
    domain: "culinary",
    parent_group: seed.parent_group,
    parent_category: "herb",
    scientific_name: seed.scientific_name,
    external_ids: {},
    catalog_version: "1.0.0",
    food_ontology_version: "1.4.0",
    culinary_group: culinaryGroup,
    usage_intensity: seed.usage_intensity,
    flavor_profile: [],
    texture_profile: [],
    aroma_profile: [],
    origin_context: seed.origin_context ?? "",
    aliases: seed.aliases ?? [],
    common_names: seed.common_names ?? [],
    summary: seed.summary,
    seo_title: `${seed.display_name} — Herb & Spice Ontology`,
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

  for (const seed of HERB_SPICE_SEED) {
    if (slugs.has(seed.slug)) errors.push(`Duplicate seed slug: ${seed.slug}`);
    slugs.add(seed.slug);
    if (!GROUP_SLUGS.includes(seed.parent_group)) {
      errors.push(`${seed.slug}: invalid parent_group ${seed.parent_group}`);
    }
    if (!seed.scientific_name?.includes(" ")) {
      errors.push(`${seed.slug}: scientific_name must include a space`);
    }
    if (!["primary", "accent", "luxury"].includes(seed.usage_intensity)) {
      errors.push(`${seed.slug}: invalid usage_intensity ${seed.usage_intensity}`);
    }
    if (!Array.isArray(seed.common_names)) {
      errors.push(`${seed.slug}: common_names must be array`);
    }
    if (!seed.summary || seed.summary.length < 80) {
      errors.push(`${seed.slug}: summary must be at least 80 characters (CANON-002)`);
    }
  }

  const requiredBotanical = [
    ["cilantro", "fresh-herbs"],
    ["coriander-seed", "whole-spices"],
    ["dill", "fresh-herbs"],
    ["dill-seed", "whole-spices"],
  ];
  for (const [slug, group] of requiredBotanical) {
    const match = HERB_SPICE_SEED.find((s) => s.slug === slug && s.parent_group === group);
    if (!match) {
      errors.push(`Botanical Ownership Rule: missing ${slug} in ${group}`);
    }
  }

  const forbidden = ["mustard-greens", "fennel-bulb", "ground-black-pepper", "fresh-basil", "dried-basil"];
  for (const slug of forbidden) {
    if (HERB_SPICE_SEED.some((s) => s.slug === slug)) {
      errors.push(`Forbidden slug under Botanical/CANON rules: ${slug}`);
    }
  }

  if (errors.length) {
    throw new Error(`Seed validation failed:\n${errors.join("\n")}`);
  }
}

function requireAuditPass() {
  const result = spawnSync("node", ["scripts/catalog-audit-herb-spice-07b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function updateGroupHubs(catalog, herbSpices) {
  const byGroup = Object.fromEntries(GROUP_SLUGS.map((g) => [g, []]));
  for (const entity of herbSpices) {
    byGroup[entity.parent_group].push(entity.slug);
  }

  for (const group of catalog.groups) {
    const childSlugs = byGroup[group.slug].sort();
    group.child_slugs = childSlugs;
    group.summary = `${group.name} — ${childSlugs.length} canonical herbs and spices in the Herb & Spice Ontology.`;
  }
}

function main() {
  validateSeed();

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const herbSpices = HERB_SPICE_SEED.map(buildHerbSpice).sort((a, b) => a.slug.localeCompare(b.slug));

  updateGroupHubs(catalog, herbSpices);

  catalog.herb_spices = herbSpices;
  catalog.meta = {
    ...catalog.meta,
    phase: "FOOD-07B",
    governance_status: "frozen",
    description:
      "Herb & Spice Ontology — canonical catalog populated (FOOD-07B). Intrinsic metadata only; relationships deferred to FOOD-07D/E.",
    entity_count: herbSpices.length,
    last_entity: herbSpices[herbSpices.length - 1]?.slug ?? null,
  };

  const countsByGroup = GROUP_SLUGS.reduce((acc, slug) => {
    acc[slug] = herbSpices.filter((h) => h.parent_group === slug).length;
    return acc;
  }, {});

  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(sortKeysDeep(catalog), null, 2)}\n`);

  requireAuditPass();

  const report = {
    generated_at: new Date().toISOString(),
    phase: "FOOD-07B",
    domain: "herb-spice",
    entity_count: herbSpices.length,
    counts_by_group: countsByGroup,
    catalog_path: "data/herb-spice-catalog.json",
    audit_script: "scripts/catalog-audit-herb-spice-07b.mjs",
    canonical_entity_rule: "CANON-001 — preparation and trade-name splits are aliases, not entities",
    global_recognition_rule: "CANON-002 — globally recognizable culinary ingredients only",
    botanical_ownership_rule: "Cilantro/coriander seed and dill/dill seed are separate canonical entities",
    profile_arrays_policy: "flavor_profile, texture_profile, aroma_profile reserved empty",
    relationship_policy: "all relationship arrays empty",
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  console.log(JSON.stringify(report, null, 2));
  console.log(`Catalog: ${CATALOG_PATH}`);
  console.log(`Report: ${REPORT_PATH}`);
}

main();
