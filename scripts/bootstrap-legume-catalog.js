#!/usr/bin/env node
/**
 * FOOD-11B — Populate data/legume-catalog.json from canonical seed data.
 * Intrinsic metadata only; relationships deferred to FOOD-11D/E.
 *
 * Run: node scripts/bootstrap-legume-catalog.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  LEGUME_SEED,
  GROUP_SLUGS,
  GROUP_TO_CULINARY_GROUP,
} from "./legume-catalog-seed-11b.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/legume-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/legume-bootstrap-report.json");

const RELATIONSHIP_ARRAYS = [
  "typical_descriptors",
  "wine_pairings",
  "avoid_wine_pairings",
  "related_styles",
  "related_descriptors",
  "related_techniques",
  "similar_legumes",
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

function buildLegume(seed) {
  const culinaryGroup = GROUP_TO_CULINARY_GROUP[seed.parent_group];
  const entity = {
    id: `food.legume.${seed.parent_group}.${seed.slug}`,
    slug: seed.slug,
    display_name: seed.display_name,
    entity_type: "legume",
    domain: "culinary",
    parent_group: seed.parent_group,
    parent_category: "legume",
    scientific_name: seed.scientific_name,
    external_ids: {},
    catalog_version: "1.0.0",
    food_ontology_version: "1.8.0",
    culinary_group: culinaryGroup,
    usage_intensity: seed.usage_intensity,
    flavor_profile: [],
    texture_profile: [],
    aroma_profile: [],
    origin_context: seed.origin_context ?? "",
    aliases: seed.aliases ?? [],
    common_names: seed.common_names ?? [],
    summary: seed.summary,
    seo_title: `${seed.display_name} — Legume Ontology`,
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

  for (const seed of LEGUME_SEED) {
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
    if (!seed.summary || seed.summary.length < 80) {
      errors.push(`${seed.slug}: summary must be at least 80 characters (CANON-002)`);
    }
  }

  const legume001Required = [
    ["kidney-bean", "beans"],
    ["green-pea", "peas"],
    ["chickpea", "chickpeas"],
    ["green-lentil", "lentils"],
    ["soybean", "other-legumes"],
  ];
  for (const [slug, group] of legume001Required) {
    const match = LEGUME_SEED.find((s) => s.slug === slug && s.parent_group === group);
    if (!match) errors.push(`LEGUME-001: missing ${slug} in ${group}`);
  }

  if (LEGUME_SEED.some((s) => s.slug === "peanut")) {
    errors.push("NUT-001 / cross-domain: peanut must not appear in Legume catalog");
  }

  const legume002Separate = [
    "chickpea-flour",
    "tofu",
    "tempeh",
    "miso",
    "soy-flour",
  ];
  for (const slug of legume002Separate) {
    if (!LEGUME_SEED.some((s) => s.slug === slug)) {
      errors.push(`LEGUME-002: missing separate processed entity ${slug}`);
    }
  }

  const aliasChecks = [
    ["chickpea", ["cooked chickpeas"]],
    ["black-bean", ["mashed black beans"]],
    ["green-pea", ["split peas"]],
    ["red-lentil", ["split red lentils"]],
    ["soybean", ["edamame", "boiled soybeans"]],
    ["tofu", ["firm tofu", "silken tofu"]],
  ];
  for (const [slug, requiredAliases] of aliasChecks) {
    const entity = LEGUME_SEED.find((s) => s.slug === slug);
    if (!entity) continue;
    const aliasSet = new Set((entity.aliases ?? []).map((a) => a.toLowerCase()));
    for (const alias of requiredAliases) {
      if (!aliasSet.has(alias)) {
        errors.push(`${slug} must alias "${alias}" per LEGUME-002`);
      }
    }
  }

  const forbidden = [
    "peanut",
    "sesame",
    "mustard-seed",
    "soy-milk",
    "soy-sauce",
    "soy-sauce-paste",
    "coconut",
    "edamame",
    "firm-tofu",
    "silken-tofu",
    "cooked-chickpeas",
    "mashed-black-beans",
    "split-pea",
    "hummus",
  ];
  for (const slug of forbidden) {
    if (LEGUME_SEED.some((s) => s.slug === slug)) {
      errors.push(`Forbidden slug under cross-domain / LEGUME-002 rules: ${slug}`);
    }
  }

  const countsByGroup = GROUP_SLUGS.reduce((acc, slug) => {
    acc[slug] = LEGUME_SEED.filter((s) => s.parent_group === slug).length;
    return acc;
  }, {});

  const groupTargets = {
    beans: [24, 30],
    peas: [8, 12],
    lentils: [8, 12],
    chickpeas: [3, 6],
    "other-legumes": [10, 15],
    "legume-products": [15, 20],
  };
  for (const [group, [min, max]] of Object.entries(groupTargets)) {
    const count = countsByGroup[group] ?? 0;
    if (count < min || count > max) {
      errors.push(`${group}: ${count} entities outside FOOD-11B target ${min}-${max}`);
    }
  }

  if (LEGUME_SEED.length < 70 || LEGUME_SEED.length > 95) {
    errors.push(`Seed count ${LEGUME_SEED.length} outside FOOD-11B target 70-95`);
  }

  if (errors.length) {
    throw new Error(`Seed validation failed:\n${errors.join("\n")}`);
  }
}

function requireAuditPass() {
  const result = spawnSync("node", ["scripts/catalog-audit-legume-11b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function updateGroupHubs(catalog, legumes) {
  const byGroup = Object.fromEntries(GROUP_SLUGS.map((g) => [g, []]));
  for (const entity of legumes) {
    byGroup[entity.parent_group].push(entity.slug);
  }

  for (const group of catalog.groups) {
    const childSlugs = byGroup[group.slug].sort();
    group.child_slugs = childSlugs;
    group.summary = `${group.name} — ${childSlugs.length} canonical legume ingredients in the Legume Ontology.`;
  }
}

function main() {
  validateSeed();

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const legumes = LEGUME_SEED.map(buildLegume).sort((a, b) => a.slug.localeCompare(b.slug));

  updateGroupHubs(catalog, legumes);

  catalog.legumes = legumes;
  catalog.meta = {
    ...catalog.meta,
    phase: "FOOD-11B",
    governance_status: "frozen",
    description:
      "Legume Ontology — canonical catalog populated (FOOD-11B). Intrinsic metadata only; relationships deferred to FOOD-11D/E.",
    entity_count: legumes.length,
    last_entity: legumes[legumes.length - 1]?.slug ?? null,
  };

  const countsByGroup = GROUP_SLUGS.reduce((acc, slug) => {
    acc[slug] = legumes.filter((h) => h.parent_group === slug).length;
    return acc;
  }, {});

  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(sortKeysDeep(catalog), null, 2)}\n`);

  requireAuditPass();

  const report = {
    generated_at: new Date().toISOString(),
    phase: "FOOD-11B",
    domain: "legume",
    entity_count: legumes.length,
    counts_by_group: countsByGroup,
    catalog_path: "data/legume-catalog.json",
    audit_script: "scripts/catalog-audit-legume-11b.mjs",
    canonical_entity_rule: "CANON-001 — preparation and trade-name splits are aliases, not entities",
    global_recognition_rule: "CANON-002 — globally recognizable culinary ingredients only",
    botanical_ownership_rule: "BOTAN-001 — culinary identity over botanical taxonomy",
    processing_ownership_rule: "PROC-001 — separate entities when processing changes culinary identity",
    culinary_ownership_rule: "LEGUME-001 — canonical ownership by established culinary identity",
    processed_product_rule: "LEGUME-002 — separate entities only for independent culinary identity",
    nut_classification_rule: "NUT-001 — peanut remains Nut & Seed; not duplicated here",
    soy_product_policy: "Tofu, tempeh, miso, soy flour in Legume Products; soy milk and soy sauce excluded",
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
