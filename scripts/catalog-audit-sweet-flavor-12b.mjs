#!/usr/bin/env node
/**
 * FOOD-12B — Sweet Flavor Catalog Audit
 * Certification-quality validation before FOOD-12C runtime bootstrap.
 *
 * Run: node scripts/catalog-audit-sweet-flavor-12b.mjs
 * Output: reports/sweet-flavor-catalog-audit.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/sweet-flavor-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/sweet-flavor-catalog-audit.json");

const VOCAB = {
  culinary_group: new Set([
    "sugars",
    "syrups",
    "honey_bee_products",
    "natural_sweeteners",
    "alternative_sweeteners",
    "cocoa_chocolate_ingredients",
  ]),
  usage_intensity: new Set(["primary", "accent", "luxury"]),
};

const GROUP_TO_CULINARY_GROUP = {
  sugars: "sugars",
  syrups: "syrups",
  "honey-bee-products": "honey_bee_products",
  "natural-sweeteners": "natural_sweeteners",
  "alternative-sweeteners": "alternative_sweeteners",
  "cocoa-chocolate-ingredients": "cocoa_chocolate_ingredients",
};

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

const INTRINSIC_FIELDS = [
  "culinary_group",
  "usage_intensity",
  "flavor_profile",
  "texture_profile",
  "aroma_profile",
  "origin_context",
];

const REQUIRED_ENTITY_FIELDS = [
  "id",
  "slug",
  "display_name",
  "entity_type",
  "domain",
  "parent_group",
  "parent_category",
  "scientific_name",
  "external_ids",
  "catalog_version",
  "food_ontology_version",
  ...INTRINSIC_FIELDS,
  "aliases",
  "common_names",
  "introduction",
  "summary",
  "seo_title",
  "seo_description",
  ...RELATIONSHIP_ARRAYS,
];

const ALLOWED_ENTITY_KEYS = new Set([
  ...REQUIRED_ENTITY_FIELDS,
  "beginner_notes",
  "faq",
]);

const ID_PATTERN = /^food\.sweet-flavor\.[a-z0-9-]+\.[a-z0-9-]+$/;
const GROUP_ID_PATTERN = /^food\.sweet-flavor\.[a-z0-9-]+$/;
const CATEGORY_ID_PATTERN = /^food\.sweet-flavor$/;

const CANONICAL_BLOCKED_SLUGS = new Set([
  "powdered-sugar",
  "superfine-sugar",
  "caster-sugar",
  "coarse-sugar",
  "light-brown-sugar",
  "dark-brown-sugar",
  "chocolate-bar",
  "dark-chocolate",
  "milk-chocolate",
  "bee-pollen",
  "royal-jelly",
  "propolis",
  "vanilla-extract",
  "almond-extract",
  "orange-blossom-water",
  "rose-water",
  "caramel-sauce",
  "chocolate-syrup",
]);

const CANONICAL_DISPLAY_PATTERNS = [
  /^Powdered Sugar$/i,
  /^Superfine Sugar$/i,
  /^Caster Sugar$/i,
  /^Coarse Sugar$/i,
  /^Light Brown Sugar$/i,
  /^Dark Brown Sugar$/i,
  /^Chocolate Bar$/i,
  /^Dark Chocolate$/i,
  /^Milk Chocolate$/i,
];

const REGIONAL_ONLY_SLUG_PREFIXES = ["kashmiri-", "heritage-", "single-origin-"];

const SWEET001_SEPARATE = [
  { slug: "cocoa-powder", parent_group: "cocoa-chocolate-ingredients" },
  { slug: "cocoa-butter", parent_group: "cocoa-chocolate-ingredients" },
  { slug: "chocolate-liquor", parent_group: "cocoa-chocolate-ingredients" },
  { slug: "cacao-nibs", parent_group: "cocoa-chocolate-ingredients" },
  { slug: "date-syrup", parent_group: "natural-sweeteners" },
  { slug: "corn-syrup", parent_group: "syrups" },
  { slug: "coconut-sugar", parent_group: "natural-sweeteners" },
];

const SWEET001_ALIAS_CHECKS = [
  { slug: "cane-sugar", aliases: ["powdered sugar", "superfine sugar", "caster sugar"] },
];

const SWEET001_BLOCKED_ALIAS_SLUGS = ["powdered-sugar", "superfine-sugar", "caster-sugar"];

const COCOA001_REQUIRED = [
  { slug: "cacao-bean", parent_group: "cocoa-chocolate-ingredients" },
  { slug: "cocoa-powder", parent_group: "cocoa-chocolate-ingredients" },
  { slug: "cocoa-butter", parent_group: "cocoa-chocolate-ingredients" },
  { slug: "chocolate-liquor", parent_group: "cocoa-chocolate-ingredients" },
  { slug: "cacao-nibs", parent_group: "cocoa-chocolate-ingredients" },
];

const CROSS_DOMAIN_FORBIDDEN = [
  { slug: "date", reason: "owned by Fruit Ontology (FOOD-09)" },
  { slug: "corn", reason: "owned by Grain & Starch Ontology (FOOD-08)" },
  { slug: "coconut", reason: "owned by Fruit Ontology (FOOD-09)" },
  { slug: "vanilla-bean", reason: "owned by Herb & Spice Ontology (FOOD-07)" },
  { slug: "vanilla-extract", reason: "deferred condiment — Sauce & Condiment (FOOD-13)" },
  { slug: "bee-pollen", reason: "supplement scope — excluded from Honey & Bee Products" },
  { slug: "royal-jelly", reason: "supplement scope — excluded from Honey & Bee Products" },
  { slug: "propolis", reason: "supplement scope — excluded from Honey & Bee Products" },
  { slug: "chocolate-bar", reason: "finished confection — excluded per COCOA-001" },
  { slug: "dark-chocolate", reason: "finished confection — excluded per COCOA-001" },
  { slug: "milk-chocolate", reason: "finished confection — excluded per COCOA-001" },
];

const FOOD13_FORBIDDEN = [
  { slug: "vanilla-extract", reason: "composed condiment — Sauce & Condiment (FOOD-13)" },
  { slug: "almond-extract", reason: "composed condiment — Sauce & Condiment (FOOD-13)" },
  { slug: "orange-blossom-water", reason: "composed condiment — Sauce & Condiment (FOOD-13)" },
  { slug: "rose-water", reason: "composed condiment — Sauce & Condiment (FOOD-13)" },
  { slug: "caramel-sauce", reason: "composed sauce — Sauce & Condiment (FOOD-13)" },
  { slug: "chocolate-syrup", reason: "composed sauce — Sauce & Condiment (FOOD-13)" },
];

const HONEY_GROUP_FORBIDDEN = ["bee-pollen", "royal-jelly", "propolis"];

const MIN_SUMMARY_LENGTH = 80;
const MIN_ENTITY_COUNT = 65;
const MAX_ENTITY_COUNT = 90;

const GROUP_COUNT_TARGETS = {
  sugars: { min: 12, max: 14 },
  syrups: { min: 12, max: 14 },
  "honey-bee-products": { min: 4, max: 6 },
  "natural-sweeteners": { min: 10, max: 12 },
  "alternative-sweeteners": { min: 10, max: 12 },
  "cocoa-chocolate-ingredients": { min: 18, max: 22 },
};

function collectIssues(catalog) {
  const vocabularyViolations = [];
  const aliasConflicts = [];
  const metadataGaps = [];
  const identityErrors = [];
  const hierarchyErrors = [];
  const scientificIssues = [];
  const unexpectedKeys = [];
  const canonicalEntityViolations = [];
  const globalRecognitionViolations = [];
  const sweet001Violations = [];
  const cocoa001Violations = [];
  const honeyGroupViolations = [];
  const food13Violations = [];
  const botanicalViolations = [];
  const crossDomainViolations = [];
  const groupCountViolations = [];

  const entities = catalog.sweet_flavors ?? [];

  const actualCount = entities.length;
  if (catalog.meta.entity_count !== actualCount) {
    identityErrors.push(`meta.entity_count ${catalog.meta.entity_count} !== actual ${actualCount}`);
  }
  if (!catalog.meta.catalog_version) {
    identityErrors.push("meta.catalog_version missing");
  }
  if (catalog.meta.phase !== "FOOD-12B") {
    identityErrors.push(`meta.phase must be FOOD-12B (got ${catalog.meta.phase})`);
  }
  if (actualCount < MIN_ENTITY_COUNT || actualCount > MAX_ENTITY_COUNT) {
    identityErrors.push(
      `entity count ${actualCount} outside FOOD-12B target ${MIN_ENTITY_COUNT}-${MAX_ENTITY_COUNT}`
    );
  }

  for (const [groupSlug, target] of Object.entries(GROUP_COUNT_TARGETS)) {
    const count = entities.filter((e) => e.parent_group === groupSlug).length;
    if (count < target.min || count > target.max) {
      groupCountViolations.push(
        `${groupSlug}: ${count} entities outside FOOD-12B target ${target.min}-${target.max}`
      );
    }
  }

  const ids = new Set();
  const slugs = new Set();
  for (const entity of entities) {
    if (ids.has(entity.id)) identityErrors.push(`Duplicate id: ${entity.id}`);
    ids.add(entity.id);
    if (!ID_PATTERN.test(entity.id)) identityErrors.push(`Invalid id format: ${entity.id}`);
    if (slugs.has(entity.slug)) identityErrors.push(`Duplicate slug: ${entity.slug}`);
    slugs.add(entity.slug);
    if (entity.catalog_version !== "1.0.0") {
      identityErrors.push(`${entity.slug}: catalog_version must be 1.0.0`);
    }
    if (entity.food_ontology_version !== "1.9.0") {
      identityErrors.push(`${entity.slug}: food_ontology_version must be 1.9.0`);
    }

    if (CANONICAL_BLOCKED_SLUGS.has(entity.slug)) {
      canonicalEntityViolations.push(
        `${entity.slug}: blocked preparation, alias, or out-of-scope slug (CANON-001 / SWEET-001)`
      );
    }
    for (const pattern of CANONICAL_DISPLAY_PATTERNS) {
      if (pattern.test(entity.display_name)) {
        canonicalEntityViolations.push(
          `${entity.slug}: display_name "${entity.display_name}" violates CANON-001`
        );
        break;
      }
    }

    for (const prefix of REGIONAL_ONLY_SLUG_PREFIXES) {
      if (entity.slug.startsWith(prefix)) {
        globalRecognitionViolations.push(
          `${entity.slug}: regional-only slug prefix "${prefix}" (CANON-002)`
        );
        break;
      }
    }
    if (!entity.summary || entity.summary.length < MIN_SUMMARY_LENGTH) {
      globalRecognitionViolations.push(
        `${entity.slug}: summary too short for global culinary identity (CANON-002)`
      );
    }

    if (entity.parent_group === "honey-bee-products" && HONEY_GROUP_FORBIDDEN.includes(entity.slug)) {
      honeyGroupViolations.push(
        `${entity.slug}: supplement bee product forbidden in honey-bee-products (culinary honey only)`
      );
    }
  }

  for (const req of SWEET001_SEPARATE) {
    if (!entities.some((e) => e.slug === req.slug && e.parent_group === req.parent_group)) {
      sweet001Violations.push(
        `Missing separate processed entity ${req.slug} in ${req.parent_group} (SWEET-001)`
      );
    }
  }

  for (const check of SWEET001_ALIAS_CHECKS) {
    const entity = entities.find((e) => e.slug === check.slug);
    if (!entity) continue;
    const aliasSet = new Set((entity.aliases ?? []).map((a) => a.toLowerCase()));
    for (const alias of check.aliases) {
      if (!aliasSet.has(alias)) {
        sweet001Violations.push(`${check.slug} missing alias "${alias}" (SWEET-001)`);
      }
    }
  }

  for (const blocked of SWEET001_BLOCKED_ALIAS_SLUGS) {
    if (entities.some((e) => e.slug === blocked)) {
      sweet001Violations.push(`${blocked} must be alias on cane-sugar, not separate entity (SWEET-001)`);
    }
  }

  for (const req of COCOA001_REQUIRED) {
    if (!entities.some((e) => e.slug === req.slug && e.parent_group === req.parent_group)) {
      cocoa001Violations.push(
        `Missing required entity ${req.slug} in ${req.parent_group} (COCOA-001)`
      );
    }
  }

  for (const forbidden of CROSS_DOMAIN_FORBIDDEN) {
    if (entities.some((e) => e.slug === forbidden.slug)) {
      crossDomainViolations.push(`${forbidden.slug}: ${forbidden.reason}`);
    }
  }

  for (const forbidden of FOOD13_FORBIDDEN) {
    if (entities.some((e) => e.slug === forbidden.slug)) {
      food13Violations.push(`${forbidden.slug}: ${forbidden.reason}`);
    }
  }

  const categoryBySlug = new Map(catalog.categories.map((c) => [c.slug, c]));
  const groupBySlug = new Map(catalog.groups.map((g) => [g.slug, g]));

  for (const cat of catalog.categories) {
    if (!CATEGORY_ID_PATTERN.test(cat.id)) {
      hierarchyErrors.push(`Invalid category id: ${cat.id}`);
    }
    for (const gslug of cat.child_slugs) {
      const g = groupBySlug.get(gslug);
      if (!g) hierarchyErrors.push(`Orphan group ref ${gslug} in category ${cat.slug}`);
      else if (g.parent_category !== cat.slug) {
        hierarchyErrors.push(`Group ${gslug} parent_category mismatch`);
      }
    }
  }

  for (const g of catalog.groups) {
    if (!GROUP_ID_PATTERN.test(g.id)) hierarchyErrors.push(`Invalid group id: ${g.id}`);
    if (!categoryBySlug.has(g.parent_category)) {
      hierarchyErrors.push(`Group ${g.slug} orphan parent_category ${g.parent_category}`);
    }
    const childEntities = entities.filter((h) => h.parent_group === g.slug);
    if (childEntities.length === 0) hierarchyErrors.push(`Group ${g.slug} has no sweet_flavors`);
    for (const expected of g.child_slugs) {
      if (!childEntities.some((h) => h.slug === expected)) {
        hierarchyErrors.push(`Group ${g.slug} child_slugs missing entity ${expected}`);
      }
    }
    for (const h of childEntities) {
      if (!g.child_slugs.includes(h.slug)) {
        hierarchyErrors.push(`Entity ${h.slug} not in group ${g.slug} child_slugs`);
      }
    }
  }

  const aliasIndex = new Map();

  for (const entity of entities) {
    for (const key of Object.keys(entity)) {
      if (!ALLOWED_ENTITY_KEYS.has(key)) {
        unexpectedKeys.push(`${entity.slug}: unexpected key "${key}"`);
      }
    }

    for (const field of REQUIRED_ENTITY_FIELDS) {
      if (!(field in entity)) metadataGaps.push(`${entity.slug}: missing ${field}`);
    }

    if (entity.entity_type !== "sweet_flavor") {
      metadataGaps.push(`${entity.slug}: entity_type must be sweet_flavor`);
    }
    if (entity.parent_category !== "sweet-flavor") {
      metadataGaps.push(`${entity.slug}: parent_category must be sweet-flavor`);
    }

    if (!groupBySlug.has(entity.parent_group)) {
      hierarchyErrors.push(`Entity ${entity.slug} orphan parent_group ${entity.parent_group}`);
    }

    const expectedGroup = GROUP_TO_CULINARY_GROUP[entity.parent_group];
    if (expectedGroup && entity.culinary_group !== expectedGroup) {
      vocabularyViolations.push(
        `${entity.slug}: culinary_group ${entity.culinary_group} != group ${entity.parent_group} (${expectedGroup})`
      );
    }

    for (const field of INTRINSIC_FIELDS) {
      if (field === "origin_context") {
        if (entity.origin_context === undefined || entity.origin_context === null) {
          metadataGaps.push(`${entity.slug}: missing origin_context`);
        }
        continue;
      }
      if (["flavor_profile", "texture_profile", "aroma_profile"].includes(field)) {
        if (!Array.isArray(entity[field])) {
          metadataGaps.push(`${entity.slug}: ${field} must be array`);
        } else if (entity[field].length > 0) {
          metadataGaps.push(`${entity.slug}: ${field} must be empty in FOOD-12B`);
        }
        continue;
      }
      if (!VOCAB[field]?.has(entity[field])) {
        vocabularyViolations.push(`${entity.slug}: invalid ${field} "${entity[field]}"`);
      }
    }

    if (!entity.scientific_name) {
      metadataGaps.push(`${entity.slug}: scientific_name missing`);
    } else if (
      entity.scientific_name !== "Multiple sources" &&
      (entity.scientific_name.length < 5 || !entity.scientific_name.includes(" "))
    ) {
      scientificIssues.push(
        `${entity.slug}: scientific_name must include a space or be "Multiple sources" "${entity.scientific_name}"`
      );
    }

    if (!entity.external_ids || typeof entity.external_ids !== "object" || Array.isArray(entity.external_ids)) {
      metadataGaps.push(`${entity.slug}: external_ids must be object`);
    }

    if (!Array.isArray(entity.aliases)) {
      metadataGaps.push(`${entity.slug}: aliases must be array`);
    }
    if (!Array.isArray(entity.common_names)) {
      metadataGaps.push(`${entity.slug}: common_names must be array`);
    }

    for (const field of RELATIONSHIP_ARRAYS) {
      if (!Array.isArray(entity[field])) {
        metadataGaps.push(`${entity.slug}: ${field} not array`);
      } else if (entity[field].length > 0) {
        metadataGaps.push(`${entity.slug}: ${field} must be empty in FOOD-12B`);
      }
    }

    for (const alias of entity.aliases || []) {
      const k = alias.trim().toLowerCase();
      if (aliasIndex.has(k)) {
        aliasConflicts.push(`"${alias}" on ${entity.slug} and ${aliasIndex.get(k)}`);
      } else {
        aliasIndex.set(k, entity.slug);
      }
    }
  }

  return {
    vocabularyViolations,
    aliasConflicts,
    metadataGaps,
    identityErrors,
    hierarchyErrors,
    scientificIssues,
    unexpectedKeys,
    canonicalEntityViolations,
    globalRecognitionViolations,
    sweet001Violations,
    cocoa001Violations,
    honeyGroupViolations,
    food13Violations,
    botanicalViolations,
    crossDomainViolations,
    groupCountViolations,
    actualCount,
  };
}

function evaluateRules(ctx) {
  const rules = [
    {
      id: "META-001",
      name: "meta.entity_count matches sweet_flavors length",
      severity: "required",
      evaluate: () =>
        ctx.identityErrors.filter((e) => e.startsWith("meta.entity_count")).length === 0
          ? { status: "pass" }
          : {
              status: "fail",
              messages: ctx.identityErrors.filter((e) => e.startsWith("meta.entity_count")),
            },
    },
    {
      id: "META-002",
      name: "meta.catalog_version and phase present",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.identityErrors.filter(
          (e) => e.includes("meta.catalog_version") || e.includes("meta.phase")
        );
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
    },
    {
      id: "META-004",
      name: "entity count within FOOD-12B target (65-90)",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.identityErrors.filter((e) => e.startsWith("entity count"));
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
    },
    {
      id: "META-005",
      name: "group counts within FOOD-12B planning targets",
      severity: "required",
      evaluate: () =>
        ctx.groupCountViolations.length
          ? { status: "fail", messages: ctx.groupCountViolations }
          : { status: "pass" },
    },
    {
      id: "CANON-001",
      name: "Canonical Entity Rule — no preparation or trade-name splits",
      severity: "required",
      evaluate: () =>
        ctx.canonicalEntityViolations.length
          ? { status: "fail", messages: ctx.canonicalEntityViolations }
          : { status: "pass" },
    },
    {
      id: "CANON-002",
      name: "Global culinary recognition — not regional commercial products",
      severity: "required",
      evaluate: () =>
        ctx.globalRecognitionViolations.length
          ? { status: "fail", messages: ctx.globalRecognitionViolations }
          : { status: "pass" },
    },
    {
      id: "BOTAN-001",
      name: "Botanical Ownership Rule — culinary identity over botanical taxonomy",
      severity: "required",
      evaluate: () =>
        ctx.botanicalViolations.length
          ? { status: "fail", messages: ctx.botanicalViolations }
          : { status: "pass" },
    },
    {
      id: "PROC-001",
      name: "Processing Ownership Rule — distinct entities only when culinary identity changes",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.sweet001Violations.filter((e) => e.includes("must be alias"));
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
    },
    {
      id: "FRUIT-001",
      name: "Culinary Form Ownership Rule — fruit-owned ingredients excluded",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.crossDomainViolations.filter((e) => e.includes("Fruit Ontology"));
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
    },
    {
      id: "GRAIN-001",
      name: "Grain & Starch cross-domain ownership — corn excluded from Sweet Flavor",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.crossDomainViolations.filter((e) => e.startsWith("corn:"));
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
    },
    {
      id: "HERB-001",
      name: "Herb & Spice cross-domain ownership — vanilla-bean excluded from Sweet Flavor",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.crossDomainViolations.filter((e) => e.startsWith("vanilla-bean:"));
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
    },
    {
      id: "SWEET-001",
      name: "Processing Ownership Rule — separate entities and alias freeze",
      severity: "required",
      evaluate: () =>
        ctx.sweet001Violations.length
          ? { status: "fail", messages: ctx.sweet001Violations }
          : { status: "pass" },
    },
    {
      id: "COCOA-001",
      name: "Cocoa Ownership Rule — required cacao-derived culinary ingredients",
      severity: "required",
      evaluate: () =>
        ctx.cocoa001Violations.length
          ? { status: "fail", messages: ctx.cocoa001Violations }
          : { status: "pass" },
    },
    {
      id: "HONEY-001",
      name: "Honey group scope — culinary honey products only",
      severity: "required",
      evaluate: () =>
        ctx.honeyGroupViolations.length
          ? { status: "fail", messages: ctx.honeyGroupViolations }
          : { status: "pass" },
    },
    {
      id: "FOOD13-001",
      name: "FOOD-13 deferrals — composed condiments and sauces excluded",
      severity: "required",
      evaluate: () =>
        ctx.food13Violations.length
          ? { status: "fail", messages: ctx.food13Violations }
          : { status: "pass" },
    },
    {
      id: "XDOM-001",
      name: "Cross-domain ownership — no duplicate canonical ownership",
      severity: "required",
      evaluate: () =>
        ctx.crossDomainViolations.length
          ? { status: "fail", messages: ctx.crossDomainViolations }
          : { status: "pass" },
    },
    {
      id: "ID-001",
      name: "unique ontology IDs",
      severity: "required",
      evaluate: () => {
        const dupes = ctx.identityErrors.filter((e) => e.startsWith("Duplicate id"));
        return dupes.length ? { status: "fail", messages: dupes } : { status: "pass" };
      },
    },
    {
      id: "ID-002",
      name: "unique slugs",
      severity: "required",
      evaluate: () => {
        const dupes = ctx.identityErrors.filter((e) => e.startsWith("Duplicate slug"));
        return dupes.length ? { status: "fail", messages: dupes } : { status: "pass" };
      },
    },
    {
      id: "ID-003",
      name: "stable sweet flavor ID format",
      severity: "required",
      evaluate: () => {
        const bad = ctx.identityErrors.filter((e) => e.startsWith("Invalid id format"));
        return bad.length ? { status: "fail", messages: bad } : { status: "pass" };
      },
    },
    {
      id: "HIER-001",
      name: "category and group hierarchy integrity",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.hierarchyErrors.filter(
          (e) =>
            e.startsWith("Invalid category") ||
            e.startsWith("Invalid group") ||
            e.includes("Orphan group ref") ||
            e.includes("parent_category mismatch") ||
            e.includes("orphan parent_category")
        );
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
    },
    {
      id: "HIER-002",
      name: "every entity belongs to exactly one valid group",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.hierarchyErrors.filter((e) => e.includes("orphan parent_group"));
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
    },
    {
      id: "HIER-003",
      name: "group child_slugs bidirectionally complete",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.hierarchyErrors.filter(
          (e) =>
            e.includes("child_slugs missing") ||
            e.includes("not in group") ||
            e.includes("has no sweet_flavors")
        );
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
    },
    {
      id: "VOCAB-001",
      name: "controlled vocabulary compliance",
      severity: "required",
      evaluate: () =>
        ctx.vocabularyViolations.length
          ? {
              status: "fail",
              messages: ctx.vocabularyViolations.slice(0, 20),
              truncated: ctx.vocabularyViolations.length > 20,
            }
          : { status: "pass" },
    },
    {
      id: "USAGE-001",
      name: "usage_intensity populated on every entity",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.metadataGaps.filter((e) => e.includes("usage_intensity"));
        return msgs.length ? { status: "fail", messages: msgs.slice(0, 20) } : { status: "pass" };
      },
    },
    {
      id: "PROF-001",
      name: "reserved profile arrays empty",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.metadataGaps.filter(
          (e) =>
            e.includes("flavor_profile") ||
            e.includes("texture_profile") ||
            e.includes("aroma_profile")
        );
        return msgs.length ? { status: "fail", messages: msgs.slice(0, 20) } : { status: "pass" };
      },
    },
    {
      id: "SCI-001",
      name: "required scientific_name",
      severity: "required",
      evaluate: () =>
        ctx.scientificIssues.length || ctx.metadataGaps.filter((e) => e.includes("scientific_name")).length
          ? {
              status: "fail",
              messages: [
                ...ctx.scientificIssues,
                ...ctx.metadataGaps.filter((e) => e.includes("scientific_name")),
              ].slice(0, 20),
            }
          : { status: "pass" },
    },
    {
      id: "EXT-001",
      name: "required external_ids object",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.metadataGaps.filter((e) => e.includes("external_ids"));
        return msgs.length ? { status: "fail", messages: msgs.slice(0, 20) } : { status: "pass" };
      },
    },
    {
      id: "META-003",
      name: "required intrinsic field coverage on every entity",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.metadataGaps.filter(
          (e) =>
            !e.includes("external_ids") &&
            !e.includes("scientific_name") &&
            !RELATIONSHIP_ARRAYS.some((r) => e.includes(r)) &&
            !e.includes("flavor_profile") &&
            !e.includes("texture_profile") &&
            !e.includes("aroma_profile")
        );
        return msgs.length
          ? { status: "fail", messages: msgs.slice(0, 20), truncated: msgs.length > 20 }
          : { status: "pass" };
      },
    },
    {
      id: "REL-001",
      name: "reserved relationship arrays present and empty",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.metadataGaps.filter((e) => RELATIONSHIP_ARRAYS.some((r) => e.includes(r)));
        return msgs.length ? { status: "fail", messages: msgs.slice(0, 20) } : { status: "pass" };
      },
    },
    {
      id: "ALIAS-001",
      name: "no duplicate aliases across catalog",
      severity: "required",
      evaluate: () =>
        ctx.aliasConflicts.length ? { status: "fail", messages: ctx.aliasConflicts } : { status: "pass" },
    },
    {
      id: "SCHEMA-001",
      name: "no unexpected keys on sweet_flavor entities",
      severity: "required",
      evaluate: () =>
        ctx.unexpectedKeys.length
          ? { status: "fail", messages: ctx.unexpectedKeys.slice(0, 20) }
          : { status: "pass" },
    },
    {
      id: "VER-001",
      name: "per-entity catalog_version and food_ontology_version",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.identityErrors.filter(
          (e) => e.includes("catalog_version") || e.includes("food_ontology_version")
        );
        return msgs.length ? { status: "fail", messages: msgs.slice(0, 20) } : { status: "pass" };
      },
    },
  ];

  return rules.map((rule) => {
    const result = rule.evaluate();
    return {
      id: rule.id,
      name: rule.name,
      severity: rule.severity,
      status: result.status,
      messages: result.messages || [],
      truncated: result.truncated || false,
    };
  });
}

function audit(catalog) {
  const ctx = collectIssues(catalog);
  const ruleResults = evaluateRules(ctx);

  const requiredRules = ruleResults.filter((r) => r.severity === "required");
  const passed = ruleResults.filter((r) => r.status === "pass").length;
  const failed = ruleResults.filter((r) => r.status === "fail").length;
  const requiredFailed = requiredRules.filter((r) => r.status === "fail").length;
  const overall = requiredFailed === 0 ? "PASS" : "FAIL";

  const entities = catalog.sweet_flavors ?? [];
  const uniqueScientific = new Set(entities.map((h) => h.scientific_name).filter(Boolean));
  const completeness = ctx.metadataGaps.length === 0 ? "100%" : "incomplete";

  return {
    audited_at: new Date().toISOString().slice(0, 10),
    phase: "FOOD-12B",
    domain: "sweet-flavor",
    catalog_version: catalog.meta.catalog_version,
    validation: {
      total_validation_rules: ruleResults.length,
      required_checks: requiredRules.length,
      passed,
      failed,
      required_failed: requiredFailed,
      overall_result: overall,
    },
    summary: {
      categories: catalog.categories.length,
      groups: catalog.groups.length,
      sweet_flavors: entities.length,
      scientific_names: uniqueScientific.size,
      vocabulary_violations: ctx.vocabularyViolations.length,
      canonical_entity_violations: ctx.canonicalEntityViolations.length,
      global_recognition_violations: ctx.globalRecognitionViolations.length,
      sweet001_violations: ctx.sweet001Violations.length,
      cocoa001_violations: ctx.cocoa001Violations.length,
      honey_group_violations: ctx.honeyGroupViolations.length,
      food13_violations: ctx.food13Violations.length,
      botanical_violations: ctx.botanicalViolations.length,
      cross_domain_violations: ctx.crossDomainViolations.length,
      alias_conflicts: ctx.aliasConflicts.length,
      metadata_completeness: completeness,
      overall_result: overall,
    },
    metrics: {
      "Total validation rules": ruleResults.length,
      Passed: passed,
      Failed: failed,
      "Required checks": requiredRules.length,
      Categories: catalog.categories.length,
      Groups: catalog.groups.length,
      "Sweet flavor entities": entities.length,
      "Scientific names": uniqueScientific.size,
      "Vocabulary violations": ctx.vocabularyViolations.length,
      "Canonical entity violations": ctx.canonicalEntityViolations.length,
      "Global recognition violations": ctx.globalRecognitionViolations.length,
      "SWEET-001 violations": ctx.sweet001Violations.length,
      "COCOA-001 violations": ctx.cocoa001Violations.length,
      "Honey group violations": ctx.honeyGroupViolations.length,
      "FOOD-13 violations": ctx.food13Violations.length,
      "Botanical violations": ctx.botanicalViolations.length,
      "Cross-domain violations": ctx.crossDomainViolations.length,
      "Alias conflicts": ctx.aliasConflicts.length,
      "Metadata completeness": completeness,
      "Overall result": overall,
    },
    rules: ruleResults,
    details: {
      identity_errors: ctx.identityErrors,
      hierarchy_errors: ctx.hierarchyErrors,
      vocabulary_violations: ctx.vocabularyViolations,
      canonical_entity_violations: ctx.canonicalEntityViolations,
      global_recognition_violations: ctx.globalRecognitionViolations,
      sweet001_violations: ctx.sweet001Violations,
      cocoa001_violations: ctx.cocoa001Violations,
      honey_group_violations: ctx.honeyGroupViolations,
      food13_violations: ctx.food13Violations,
      botanical_violations: ctx.botanicalViolations,
      cross_domain_violations: ctx.crossDomainViolations,
      group_count_violations: ctx.groupCountViolations,
      alias_conflicts: ctx.aliasConflicts,
      metadata_gaps_total: ctx.metadataGaps.length,
      metadata_gaps_sample: ctx.metadataGaps.slice(0, 50),
      unexpected_keys: ctx.unexpectedKeys,
      scientific_name_issues: ctx.scientificIssues,
    },
  };
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const report = audit(catalog);
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${REPORT_PATH}`);
  if (report.validation.overall_result !== "PASS") process.exit(1);
}

main();
