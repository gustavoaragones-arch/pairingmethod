#!/usr/bin/env node
/**
 * FOOD-08B — Populate data/grain-starch-catalog.json from canonical seed data.
 * Intrinsic metadata only; relationships deferred to FOOD-08D/E.
 *
 * Run: node scripts/bootstrap-grain-starch-catalog.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  GRAIN_STARCH_SEED,
  GROUP_SLUGS,
  GROUP_TO_CULINARY_GROUP,
} from "./grain-starch-catalog-seed-08b.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/grain-starch-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/grain-starch-bootstrap-report.json");

const RELATIONSHIP_ARRAYS = [
  "typical_descriptors",
  "wine_pairings",
  "avoid_wine_pairings",
  "related_styles",
  "related_descriptors",
  "related_techniques",
  "similar_grain_starches",
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

function buildGrainStarch(seed) {
  const culinaryGroup = GROUP_TO_CULINARY_GROUP[seed.parent_group];
  const entity = {
    id: `food.grain.${seed.parent_group}.${seed.slug}`,
    slug: seed.slug,
    display_name: seed.display_name,
    entity_type: "grain_starch",
    domain: "culinary",
    parent_group: seed.parent_group,
    parent_category: "grain-starch",
    scientific_name: seed.scientific_name,
    external_ids: {},
    catalog_version: "1.0.0",
    food_ontology_version: "1.5.0",
    culinary_group: culinaryGroup,
    usage_intensity: seed.usage_intensity,
    flavor_profile: [],
    texture_profile: [],
    aroma_profile: [],
    origin_context: seed.origin_context ?? "",
    aliases: seed.aliases ?? [],
    common_names: seed.common_names ?? [],
    summary: seed.summary,
    seo_title: `${seed.display_name} — Grain & Starch Ontology`,
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

  for (const seed of GRAIN_STARCH_SEED) {
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

  const procRequired = [
    ["wheat", "whole-grains"],
    ["wheat-flour", "processed-grains"],
    ["rice", "whole-grains"],
    ["rice-flour", "processed-grains"],
    ["corn", "whole-grains"],
    ["cornmeal", "processed-grains"],
    ["cornstarch", "starches"],
    ["potato-starch", "starches"],
  ];
  for (const [slug, group] of procRequired) {
    const match = GRAIN_STARCH_SEED.find((s) => s.slug === slug && s.parent_group === group);
    if (!match) {
      errors.push(`PROC-001: missing ${slug} in ${group}`);
    }
  }

  const forbidden = [
    "potato",
    "sweet-corn",
    "mustard-seed",
    "soybean",
    "bread-flour",
    "cake-flour",
    "all-purpose-flour",
    "rolled-oats",
    "instant-rice",
    "ground-rice",
    "cassava-starch",
  ];
  for (const slug of forbidden) {
    if (GRAIN_STARCH_SEED.some((s) => s.slug === slug)) {
      errors.push(`Forbidden slug under PROC-001 / cross-domain rules: ${slug}`);
    }
  }

  const oats = GRAIN_STARCH_SEED.find((s) => s.slug === "oats");
  if (oats) {
    const aliasSet = new Set((oats.aliases ?? []).map((a) => a.toLowerCase()));
    for (const alias of ["rolled oats", "quick oats", "instant oats"]) {
      if (!aliasSet.has(alias)) {
        errors.push(`Oats must alias ${alias} per PROC-001`);
      }
    }
  }

  if (errors.length) {
    throw new Error(`Seed validation failed:\n${errors.join("\n")}`);
  }
}

function requireAuditPass() {
  const result = spawnSync("node", ["scripts/catalog-audit-grain-starch-08b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function updateGroupHubs(catalog, grainStarches) {
  const byGroup = Object.fromEntries(GROUP_SLUGS.map((g) => [g, []]));
  for (const entity of grainStarches) {
    byGroup[entity.parent_group].push(entity.slug);
  }

  for (const group of catalog.groups) {
    const childSlugs = byGroup[group.slug].sort();
    group.child_slugs = childSlugs;
    group.summary = `${group.name} — ${childSlugs.length} canonical grains and starches in the Grain & Starch Ontology.`;
  }
}

function main() {
  validateSeed();

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const grainStarches = GRAIN_STARCH_SEED.map(buildGrainStarch).sort((a, b) => a.slug.localeCompare(b.slug));

  updateGroupHubs(catalog, grainStarches);

  catalog.grain_starches = grainStarches;
  catalog.meta = {
    ...catalog.meta,
    phase: "FOOD-08B",
    governance_status: "frozen",
    description:
      "Grain & Starch Ontology — canonical catalog populated (FOOD-08B). Intrinsic metadata only; relationships deferred to FOOD-08D/E.",
    entity_count: grainStarches.length,
    last_entity: grainStarches[grainStarches.length - 1]?.slug ?? null,
  };

  const countsByGroup = GROUP_SLUGS.reduce((acc, slug) => {
    acc[slug] = grainStarches.filter((h) => h.parent_group === slug).length;
    return acc;
  }, {});

  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(sortKeysDeep(catalog), null, 2)}\n`);

  requireAuditPass();

  const report = {
    generated_at: new Date().toISOString(),
    phase: "FOOD-08B",
    domain: "grain-starch",
    entity_count: grainStarches.length,
    counts_by_group: countsByGroup,
    catalog_path: "data/grain-starch-catalog.json",
    audit_script: "scripts/catalog-audit-grain-starch-08b.mjs",
    canonical_entity_rule: "CANON-001 — preparation and trade-name splits are aliases, not entities",
    global_recognition_rule: "CANON-002 — globally recognizable culinary ingredients only",
    processing_ownership_rule: "PROC-001 — separate entities when processing changes culinary identity",
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
