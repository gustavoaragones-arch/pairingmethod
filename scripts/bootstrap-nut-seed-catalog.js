#!/usr/bin/env node
/**
 * FOOD-10B — Populate data/nut-seed-catalog.json from canonical seed data.
 * Intrinsic metadata only; relationships deferred to FOOD-10D/E.
 *
 * Run: node scripts/bootstrap-nut-seed-catalog.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  NUT_SEED_SEED,
  GROUP_SLUGS,
  GROUP_TO_CULINARY_GROUP,
} from "./nut-seed-catalog-seed-10b.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/nut-seed-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/nut-seed-bootstrap-report.json");

const RELATIONSHIP_ARRAYS = [
  "typical_descriptors",
  "wine_pairings",
  "avoid_wine_pairings",
  "related_styles",
  "related_descriptors",
  "related_techniques",
  "similar_nuts_seeds",
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

function buildNutSeed(seed) {
  const culinaryGroup = GROUP_TO_CULINARY_GROUP[seed.parent_group];
  const entity = {
    id: `food.nut-seed.${seed.parent_group}.${seed.slug}`,
    slug: seed.slug,
    display_name: seed.display_name,
    entity_type: "nut_seed",
    domain: "culinary",
    parent_group: seed.parent_group,
    parent_category: "nut-seed",
    scientific_name: seed.scientific_name,
    external_ids: {},
    catalog_version: "1.0.0",
    food_ontology_version: "1.7.0",
    culinary_group: culinaryGroup,
    usage_intensity: seed.usage_intensity,
    flavor_profile: [],
    texture_profile: [],
    aroma_profile: [],
    origin_context: seed.origin_context ?? "",
    aliases: seed.aliases ?? [],
    common_names: seed.common_names ?? [],
    summary: seed.summary,
    seo_title: `${seed.display_name} — Nut & Seed Ontology`,
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

  for (const seed of NUT_SEED_SEED) {
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
    if (!Array.isArray(seed.aliases ?? [])) {
      errors.push(`${seed.slug}: aliases must be array`);
    }
    if (!Array.isArray(seed.common_names ?? [])) {
      errors.push(`${seed.slug}: common_names must be array`);
    }
    if (!seed.summary || seed.summary.length < 80) {
      errors.push(`${seed.slug}: summary must be at least 80 characters (CANON-002)`);
    }
  }

  const nut001Required = [
    ["peanut", "peanuts"],
    ["almond", "tree-nuts"],
    ["sesame", "edible-seeds"],
    ["pumpkin-seed", "edible-seeds"],
    ["sunflower-seed", "edible-seeds"],
  ];
  for (const [slug, group] of nut001Required) {
    const match = NUT_SEED_SEED.find((s) => s.slug === slug && s.parent_group === group);
    if (!match) {
      errors.push(`NUT-001: missing ${slug} in ${group}`);
    }
  }

  const peanut = NUT_SEED_SEED.find((s) => s.slug === "peanut");
  if (peanut && peanut.parent_group !== "peanuts") {
    errors.push("BOTAN-001 / NUT-001: peanut must be in peanuts group, not botanical tree-nuts");
  }

  const nut002Separate = ["almond-flour", "almond-butter", "peanut-butter", "tahini", "hazelnut-flour"];
  for (const slug of nut002Separate) {
    if (!NUT_SEED_SEED.some((s) => s.slug === slug)) {
      errors.push(`NUT-002: missing separate processed entity ${slug}`);
    }
  }

  const aliasChecks = [
    ["almond", ["chopped almond", "sliced almond"]],
    ["sesame", ["toasted sesame seeds"]],
    ["pistachio", ["crushed pistachios"]],
    ["flaxseed", ["ground flaxseed"]],
    ["walnut", ["crushed walnuts"]],
  ];
  for (const [slug, requiredAliases] of aliasChecks) {
    const entity = NUT_SEED_SEED.find((s) => s.slug === slug);
    if (!entity) continue;
    const aliasSet = new Set((entity.aliases ?? []).map((a) => a.toLowerCase()));
    for (const alias of requiredAliases) {
      if (!aliasSet.has(alias)) {
        errors.push(`${slug} must alias "${alias}" per NUT-002`);
      }
    }
  }

  const forbidden = [
    "coconut",
    "soybean",
    "mustard-seed",
    "nigella-seed",
    "caraway-seed",
    "celery-seed",
    "chopped-almond",
    "sliced-almond",
    "toasted-sesame-seeds",
    "crushed-pistachios",
    "ground-flaxseed",
  ];
  for (const slug of forbidden) {
    if (NUT_SEED_SEED.some((s) => s.slug === slug)) {
      errors.push(`Forbidden slug under cross-domain / NUT-002 rules: ${slug}`);
    }
  }

  if (NUT_SEED_SEED.length < 80 || NUT_SEED_SEED.length > 110) {
    errors.push(`Seed count ${NUT_SEED_SEED.length} outside FOOD-10B target 80-110`);
  }

  if (errors.length) {
    throw new Error(`Seed validation failed:\n${errors.join("\n")}`);
  }
}

function requireAuditPass() {
  const result = spawnSync("node", ["scripts/catalog-audit-nut-seed-10b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function updateGroupHubs(catalog, nutSeeds) {
  const byGroup = Object.fromEntries(GROUP_SLUGS.map((g) => [g, []]));
  for (const entity of nutSeeds) {
    byGroup[entity.parent_group].push(entity.slug);
  }

  for (const group of catalog.groups) {
    const childSlugs = byGroup[group.slug].sort();
    group.child_slugs = childSlugs;
    group.summary = `${group.name} — ${childSlugs.length} canonical nut and seed ingredients in the Nut & Seed Ontology.`;
  }
}

function main() {
  validateSeed();

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const nutSeeds = NUT_SEED_SEED.map(buildNutSeed).sort((a, b) => a.slug.localeCompare(b.slug));

  updateGroupHubs(catalog, nutSeeds);

  catalog.nut_seeds = nutSeeds;
  catalog.meta = {
    ...catalog.meta,
    phase: "FOOD-10B",
    governance_status: "frozen",
    description:
      "Nut & Seed Ontology — canonical catalog populated (FOOD-10B). Intrinsic metadata only; relationships deferred to FOOD-10D/E.",
    entity_count: nutSeeds.length,
    last_entity: nutSeeds[nutSeeds.length - 1]?.slug ?? null,
  };

  const countsByGroup = GROUP_SLUGS.reduce((acc, slug) => {
    acc[slug] = nutSeeds.filter((h) => h.parent_group === slug).length;
    return acc;
  }, {});

  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(sortKeysDeep(catalog), null, 2)}\n`);

  requireAuditPass();

  const report = {
    generated_at: new Date().toISOString(),
    phase: "FOOD-10B",
    domain: "nut-seed",
    entity_count: nutSeeds.length,
    counts_by_group: countsByGroup,
    catalog_path: "data/nut-seed-catalog.json",
    audit_script: "scripts/catalog-audit-nut-seed-10b.mjs",
    canonical_entity_rule: "CANON-001 — preparation and trade-name splits are aliases, not entities",
    global_recognition_rule: "CANON-002 — globally recognizable culinary ingredients only",
    botanical_ownership_rule: "BOTAN-001 — culinary identity over botanical taxonomy",
    processing_ownership_rule: "PROC-001 — separate entities when processing changes culinary identity",
    culinary_classification_rule: "NUT-001 — group assignment follows culinary identity",
    processed_product_rule: "NUT-002 — separate entities only for independent culinary identity",
    culinary_form_ownership_rule: "FRUIT-001 — cross-domain fruit ownership referenced for coconut exclusion",
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
