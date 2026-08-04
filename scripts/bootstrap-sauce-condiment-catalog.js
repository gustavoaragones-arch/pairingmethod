#!/usr/bin/env node
/**
 * FOOD-13B — Populate data/sauce-condiment-catalog.json from canonical seed data.
 * Intrinsic metadata only; relationships deferred to FOOD-13D/E.
 *
 * Run: node scripts/bootstrap-sauce-condiment-catalog.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  SAUCE_CONDIMENT_SEED,
  GROUP_SLUGS,
  GROUP_TO_CULINARY_GROUP,
} from "./sauce-condiment-catalog-seed-13b.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/sauce-condiment-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/sauce-condiment-bootstrap-report.json");

const RELATIONSHIP_ARRAYS = [
  "typical_descriptors",
  "wine_pairings",
  "avoid_wine_pairings",
  "related_styles",
  "related_descriptors",
  "related_techniques",
  "similar_sauce_condiments",
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

function buildSauceCondiment(seed) {
  const culinaryGroup = GROUP_TO_CULINARY_GROUP[seed.parent_group];
  const entity = {
    id: `food.sauce-condiment.${seed.parent_group}.${seed.slug}`,
    slug: seed.slug,
    display_name: seed.display_name,
    entity_type: "sauce_condiment",
    domain: "culinary",
    parent_group: seed.parent_group,
    parent_category: "sauce-condiment",
    scientific_name: seed.scientific_name,
    external_ids: {},
    catalog_version: "1.0.0",
    food_ontology_version: "2.0.0",
    culinary_group: culinaryGroup,
    usage_intensity: seed.usage_intensity,
    flavor_profile: [],
    texture_profile: [],
    aroma_profile: [],
    introduction: seed.summary,
    aliases: seed.aliases ?? [],
    common_names: seed.common_names ?? [],
    summary: seed.summary,
    seo_title: `${seed.display_name} — Sauce & Condiment Ontology`,
    seo_description: seed.summary.length > 155 ? `${seed.summary.slice(0, 152)}...` : seed.summary,
  };

  for (const field of RELATIONSHIP_ARRAYS) {
    entity[field] = [];
  }
  if (!entity.typical_descriptors) entity.typical_descriptors = [];

  return entity;
}

function validateSeed() {
  const errors = [];
  const slugs = new Set();

  for (const seed of SAUCE_CONDIMENT_SEED) {
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

  const sauce001Required = [
    ["mayonnaise", "mother-sauces"],
    ["hollandaise", "mother-sauces"],
    ["soy-sauce", "fermented-sauces-pastes"],
    ["worcestershire-sauce", "table-sauces"],
    ["dijon-mustard", "condiments"],
    ["tomato-ketchup", "table-sauces"],
  ];
  for (const [slug, group] of sauce001Required) {
    const match = SAUCE_CONDIMENT_SEED.find((s) => s.slug === slug && s.parent_group === group);
    if (!match) errors.push(`SAUCE-001: missing ${slug} in ${group}`);
  }

  const food12Deferrals = [
    ["vanilla-extract", "condiments"],
    ["almond-extract", "condiments"],
    ["orange-blossom-water", "condiments"],
    ["rose-water", "condiments"],
    ["caramel-sauce", "table-sauces"],
    ["chocolate-syrup", "table-sauces"],
  ];
  for (const [slug, group] of food12Deferrals) {
    if (!SAUCE_CONDIMENT_SEED.some((s) => s.slug === slug && s.parent_group === group)) {
      errors.push(`FOOD-12 deferral: missing ${slug} in ${group}`);
    }
  }

  const soySauce = SAUCE_CONDIMENT_SEED.find((s) => s.slug === "soy-sauce");
  if (soySauce) {
    const aliasSet = new Set((soySauce.aliases ?? []).map((a) => a.toLowerCase()));
    for (const alias of ["tamari", "shoyu"]) {
      if (!aliasSet.has(alias)) {
        errors.push(`soy-sauce must alias "${alias}" per CANON-001`);
      }
    }
  }

  const forbidden = [
    "garlic-butter-sauce",
    "homemade-burger-sauce",
    "spicy-mayo-with-sriracha",
    "miso",
    "natto",
    "hummus",
    "tahini",
    "peanut-butter",
    "garam-masala",
    "curry-powder",
    "mustard-seed",
    "tomato",
    "garlic",
    "cane-sugar",
    "honey",
  ];
  for (const slug of forbidden) {
    if (SAUCE_CONDIMENT_SEED.some((s) => s.slug === slug)) {
      errors.push(`Forbidden slug under cross-domain / SAUCE-001 rules: ${slug}`);
    }
  }

  const countsByGroup = GROUP_SLUGS.reduce((acc, slug) => {
    acc[slug] = SAUCE_CONDIMENT_SEED.filter((s) => s.parent_group === slug).length;
    return acc;
  }, {});

  const groupTargets = {
    "mother-sauces": [8, 10],
    "table-sauces": [20, 25],
    condiments: [18, 22],
    "fermented-sauces-pastes": [14, 18],
    "oil-based-sauces-dressings": [10, 15],
    "savory-spreads-pastes": [10, 15],
  };
  for (const [group, [min, max]] of Object.entries(groupTargets)) {
    const count = countsByGroup[group] ?? 0;
    if (count < min || count > max) {
      errors.push(`${group}: ${count} entities outside FOOD-13B target ${min}-${max}`);
    }
  }

  if (SAUCE_CONDIMENT_SEED.length < 80 || SAUCE_CONDIMENT_SEED.length > 110) {
    errors.push(`Seed count ${SAUCE_CONDIMENT_SEED.length} outside FOOD-13B target 80-110`);
  }

  if (errors.length) {
    throw new Error(`Seed validation failed:\n${errors.join("\n")}`);
  }
}

function requireAuditPass() {
  const result = spawnSync("node", ["scripts/catalog-audit-sauce-condiment-13b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function updateGroupHubs(catalog, sauceCondiments) {
  const byGroup = Object.fromEntries(GROUP_SLUGS.map((g) => [g, []]));
  for (const entity of sauceCondiments) {
    byGroup[entity.parent_group].push(entity.slug);
  }

  for (const group of catalog.groups) {
    const childSlugs = byGroup[group.slug].sort();
    group.child_slugs = childSlugs;
    group.summary = `${group.name} — ${childSlugs.length} canonical sauce and condiment ingredients in the Sauce & Condiment Ontology.`;
  }
}

function main() {
  validateSeed();

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const sauceCondiments = SAUCE_CONDIMENT_SEED.map(buildSauceCondiment).sort((a, b) =>
    a.slug.localeCompare(b.slug)
  );

  updateGroupHubs(catalog, sauceCondiments);

  catalog.sauce_condiments = sauceCondiments;
  catalog.meta = {
    ...catalog.meta,
    phase: "FOOD-13B",
    governance_status: "frozen",
    description:
      "Sauce & Condiment Ontology — canonical catalog populated (FOOD-13B). Intrinsic metadata only; relationships deferred to FOOD-13D/E.",
    entity_count: sauceCondiments.length,
    last_entity: sauceCondiments[sauceCondiments.length - 1]?.slug ?? null,
  };

  const countsByGroup = GROUP_SLUGS.reduce((acc, slug) => {
    acc[slug] = sauceCondiments.filter((h) => h.parent_group === slug).length;
    return acc;
  }, {});

  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(sortKeysDeep(catalog), null, 2)}\n`);

  requireAuditPass();

  const report = {
    generated_at: new Date().toISOString(),
    phase: "FOOD-13B",
    domain: "sauce-condiment",
    entity_count: sauceCondiments.length,
    counts_by_group: countsByGroup,
    catalog_path: "data/sauce-condiment-catalog.json",
    audit_script: "scripts/catalog-audit-sauce-condiment-13b.mjs",
    canonical_entity_rule: "CANON-001 — regional variants and trade names are aliases, not entities",
    global_recognition_rule: "CANON-002 — globally recognizable culinary sauces and condiments only",
    composite_identity_rule: "SAUCE-001 — established culinary identity required; ad-hoc composed sauces excluded",
    composition_ownership_rule: "SAUCE-002 — component ingredients owned by other domains; reference by ID only",
    food12_integration_policy: "Vanilla extract, floral waters, caramel sauce, chocolate syrup owned here",
    legume_nut_seed_policy: "miso, hummus, tahini, peanut butter excluded — reference only",
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
