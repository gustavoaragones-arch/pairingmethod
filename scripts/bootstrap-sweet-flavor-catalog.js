#!/usr/bin/env node
/**
 * FOOD-12B — Populate data/sweet-flavor-catalog.json from canonical seed data.
 * Intrinsic metadata only; relationships deferred to FOOD-12D/E.
 *
 * Run: node scripts/bootstrap-sweet-flavor-catalog.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  SWEET_FLAVOR_SEED,
  GROUP_SLUGS,
  GROUP_TO_CULINARY_GROUP,
} from "./sweet-flavor-catalog-seed-12b.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/sweet-flavor-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/sweet-flavor-bootstrap-report.json");

const RELATIONSHIP_ARRAYS = [
  "typical_descriptors",
  "wine_pairings",
  "avoid_wine_pairings",
  "related_styles",
  "related_descriptors",
  "related_techniques",
  "similar_sweet_flavors",
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

function buildSweetFlavor(seed) {
  const culinaryGroup = GROUP_TO_CULINARY_GROUP[seed.parent_group];
  const entity = {
    id: `food.sweet-flavor.${seed.parent_group}.${seed.slug}`,
    slug: seed.slug,
    display_name: seed.display_name,
    entity_type: "sweet_flavor",
    domain: "culinary",
    parent_group: seed.parent_group,
    parent_category: "sweet-flavor",
    scientific_name: seed.scientific_name,
    external_ids: {},
    catalog_version: "1.0.0",
    food_ontology_version: "1.9.0",
    culinary_group: culinaryGroup,
    usage_intensity: seed.usage_intensity,
    flavor_profile: [],
    texture_profile: [],
    aroma_profile: [],
    origin_context: seed.origin_context ?? "",
    introduction: seed.summary,
    aliases: seed.aliases ?? [],
    common_names: seed.common_names ?? [],
    summary: seed.summary,
    seo_title: `${seed.display_name} — Sweet Flavor Ontology`,
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

  for (const seed of SWEET_FLAVOR_SEED) {
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

  const sweet001Required = [
    ["cane-sugar", "sugars"],
    ["maple-syrup", "syrups"],
    ["honey", "honey-bee-products"],
    ["date-syrup", "natural-sweeteners"],
    ["cocoa-powder", "cocoa-chocolate-ingredients"],
  ];
  for (const [slug, group] of sweet001Required) {
    const match = SWEET_FLAVOR_SEED.find((s) => s.slug === slug && s.parent_group === group);
    if (!match) errors.push(`SWEET-001: missing ${slug} in ${group}`);
  }

  const cocoa001Required = [
    "cacao-bean",
    "cocoa-powder",
    "cocoa-butter",
    "chocolate-liquor",
    "cacao-nibs",
  ];
  for (const slug of cocoa001Required) {
    if (
      !SWEET_FLAVOR_SEED.some(
        (s) => s.slug === slug && s.parent_group === "cocoa-chocolate-ingredients"
      )
    ) {
      errors.push(`COCOA-001: missing ${slug} in cocoa-chocolate-ingredients`);
    }
  }

  const caneSugar = SWEET_FLAVOR_SEED.find((s) => s.slug === "cane-sugar");
  if (caneSugar) {
    const aliasSet = new Set((caneSugar.aliases ?? []).map((a) => a.toLowerCase()));
    for (const alias of ["powdered sugar", "superfine sugar", "caster sugar"]) {
      if (!aliasSet.has(alias)) {
        errors.push(`cane-sugar must alias "${alias}" per SWEET-001`);
      }
    }
  }

  const forbidden = [
    "date",
    "corn",
    "coconut",
    "vanilla-bean",
    "vanilla-extract",
    "bee-pollen",
    "royal-jelly",
    "propolis",
    "chocolate-bar",
    "dark-chocolate",
    "milk-chocolate",
    "powdered-sugar",
    "caster-sugar",
    "superfine-sugar",
  ];
  for (const slug of forbidden) {
    if (SWEET_FLAVOR_SEED.some((s) => s.slug === slug)) {
      errors.push(`Forbidden slug under cross-domain / SWEET-001 rules: ${slug}`);
    }
  }

  const countsByGroup = GROUP_SLUGS.reduce((acc, slug) => {
    acc[slug] = SWEET_FLAVOR_SEED.filter((s) => s.parent_group === slug).length;
    return acc;
  }, {});

  const groupTargets = {
    sugars: [12, 14],
    syrups: [12, 14],
    "honey-bee-products": [4, 6],
    "natural-sweeteners": [10, 12],
    "alternative-sweeteners": [10, 12],
    "cocoa-chocolate-ingredients": [18, 22],
  };
  for (const [group, [min, max]] of Object.entries(groupTargets)) {
    const count = countsByGroup[group] ?? 0;
    if (count < min || count > max) {
      errors.push(`${group}: ${count} entities outside FOOD-12B target ${min}-${max}`);
    }
  }

  if (SWEET_FLAVOR_SEED.length < 65 || SWEET_FLAVOR_SEED.length > 90) {
    errors.push(`Seed count ${SWEET_FLAVOR_SEED.length} outside FOOD-12B target 65-90`);
  }

  if (errors.length) {
    throw new Error(`Seed validation failed:\n${errors.join("\n")}`);
  }
}

function requireAuditPass() {
  const result = spawnSync("node", ["scripts/catalog-audit-sweet-flavor-12b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function updateGroupHubs(catalog, sweetFlavors) {
  const byGroup = Object.fromEntries(GROUP_SLUGS.map((g) => [g, []]));
  for (const entity of sweetFlavors) {
    byGroup[entity.parent_group].push(entity.slug);
  }

  for (const group of catalog.groups) {
    const childSlugs = byGroup[group.slug].sort();
    group.child_slugs = childSlugs;
    group.summary = `${group.name} — ${childSlugs.length} canonical sweet flavor ingredients in the Sweet Flavor Ontology.`;
  }
}

function main() {
  validateSeed();

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const sweetFlavors = SWEET_FLAVOR_SEED.map(buildSweetFlavor).sort((a, b) =>
    a.slug.localeCompare(b.slug)
  );

  updateGroupHubs(catalog, sweetFlavors);

  catalog.sweet_flavors = sweetFlavors;
  catalog.meta = {
    ...catalog.meta,
    phase: "FOOD-12B",
    governance_status: "frozen",
    description:
      "Sweet Flavor Ontology — canonical catalog populated (FOOD-12B). Intrinsic metadata only; relationships deferred to FOOD-12D/E.",
    entity_count: sweetFlavors.length,
    last_entity: sweetFlavors[sweetFlavors.length - 1]?.slug ?? null,
  };

  const countsByGroup = GROUP_SLUGS.reduce((acc, slug) => {
    acc[slug] = sweetFlavors.filter((h) => h.parent_group === slug).length;
    return acc;
  }, {});

  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(sortKeysDeep(catalog), null, 2)}\n`);

  requireAuditPass();

  const report = {
    generated_at: new Date().toISOString(),
    phase: "FOOD-12B",
    domain: "sweet-flavor",
    entity_count: sweetFlavors.length,
    counts_by_group: countsByGroup,
    catalog_path: "data/sweet-flavor-catalog.json",
    audit_script: "scripts/catalog-audit-sweet-flavor-12b.mjs",
    canonical_entity_rule: "CANON-001 — granulation and trade-name splits are aliases, not entities",
    global_recognition_rule: "CANON-002 — globally recognizable culinary ingredients only",
    processing_ownership_rule: "SWEET-001 — separate entities when culinary identity changes",
    cocoa_ownership_rule: "COCOA-001 — cacao bean agricultural form; independent cocoa-derived ingredients",
    food13_deferral_policy: "Extracts and composed sauces deferred to FOOD-13",
    honey_scope_policy: "Honey and comb honey only; supplement bee products excluded",
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
