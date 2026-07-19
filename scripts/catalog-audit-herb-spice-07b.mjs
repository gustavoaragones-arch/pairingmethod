#!/usr/bin/env node
/**
 * FOOD-07B — Herb & Spice Catalog Audit
 * Certification-quality validation before FOOD-07C runtime bootstrap.
 *
 * Run: node scripts/catalog-audit-herb-spice-07b.mjs
 * Output: reports/herb-spice-catalog-audit.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "../data/herb-spice-catalog.json");
const REPORT_PATH = path.join(__dirname, "../reports/herb-spice-catalog-audit.json");

const VOCAB = {
  culinary_group: new Set([
    "fresh_herbs",
    "dried_herbs",
    "whole_spices",
    "ground_blended_spices",
  ]),
  usage_intensity: new Set(["primary", "accent", "luxury"]),
};

const GROUP_TO_CULINARY_GROUP = {
  "fresh-herbs": "fresh_herbs",
  "dried-herbs": "dried_herbs",
  "whole-spices": "whole_spices",
  "ground-blended-spices": "ground_blended_spices",
};

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

const INTRINSIC_FIELDS = [
  "culinary_group",
  "usage_intensity",
  "flavor_profile",
  "texture_profile",
  "aroma_profile",
  "origin_context",
];

const REQUIRED_HERB_SPICE_FIELDS = [
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
  "summary",
  "seo_title",
  "seo_description",
  ...RELATIONSHIP_ARRAYS,
];

const ALLOWED_HERB_SPICE_KEYS = new Set([
  ...REQUIRED_HERB_SPICE_FIELDS,
  "beginner_notes",
  "faq",
]);

const ID_PATTERN = /^food\.herb\.[a-z0-9-]+\.[a-z0-9-]+$/;
const GROUP_ID_PATTERN = /^food\.herb\.[a-z0-9-]+$/;
const CATEGORY_ID_PATTERN = /^food\.herb$/;

const CANONICAL_SLUG_PREFIXES = [
  "ground-",
  "fresh-",
  "dried-",
  "sweet-",
  "garden-",
  "ceylon-",
  "vietnamese-cinnamon",
  "kashmiri-saffron",
  "tellicherry-",
  "malabar-",
];

const CANONICAL_ALLOWED_SLUGS = new Set([
  "vietnamese-coriander",
  "fresh-herbs",
  "dried-herbs",
]);

const CANONICAL_BLOCKED_SLUGS = new Set([
  "ground-black-pepper",
  "fresh-basil",
  "dried-basil",
  "sweet-basil",
  "garden-basil",
  "ceylon-cinnamon",
  "vietnamese-cinnamon",
  "mustard-greens",
  "fennel-bulb",
  "ground-cinnamon",
  "ground-cumin",
  "ground-nutmeg",
  "ground-clove",
  "crushed-red-pepper",
]);

const CANONICAL_DISPLAY_PATTERNS = [
  /^Ground Black Pepper$/i,
  /^Fresh Basil$/i,
  /^Dried Basil$/i,
  /^Sweet Basil$/i,
  /^Ceylon Cinnamon$/i,
  /^Mustard Greens$/i,
  /^Fennel Bulb$/i,
];

const REGIONAL_ONLY_SLUG_PREFIXES = [
  "kashmiri-",
  "malabar-",
  "tellicherry-",
  "muntok-",
  "ceylon-",
  "vietnamese-",
];

const REGIONAL_ONLY_ALLOWED_SLUGS = new Set([
  "kashmiri-chili",
  "vietnamese-coriander",
]);

const REGIONAL_ONLY_BLOCKED_SLUGS = new Set([
  "kashmiri-saffron",
  "tellicherry-pepper",
  "malabar-pepper",
]);

const BOTANICAL_REQUIRED = [
  { slug: "cilantro", parent_group: "fresh-herbs" },
  { slug: "coriander-seed", parent_group: "whole-spices" },
  { slug: "dill", parent_group: "fresh-herbs" },
  { slug: "dill-seed", parent_group: "whole-spices" },
];

const BOTANICAL_FORBIDDEN = [
  { slug: "mustard-greens", reason: "owned by Vegetable Ontology (FOOD-05)" },
  { slug: "fennel-bulb", reason: "owned by Vegetable Ontology (FOOD-05)" },
];

const MIN_SUMMARY_LENGTH = 80;
const MIN_ENTITY_COUNT = 80;
const MAX_ENTITY_COUNT = 120;

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
  const botanicalOwnershipViolations = [];

  const actualCount = catalog.herb_spices.length;
  if (catalog.meta.entity_count !== actualCount) {
    identityErrors.push(`meta.entity_count ${catalog.meta.entity_count} !== actual ${actualCount}`);
  }
  if (!catalog.meta.catalog_version) {
    identityErrors.push("meta.catalog_version missing");
  }
  if (catalog.meta.phase !== "FOOD-07B") {
    identityErrors.push(`meta.phase must be FOOD-07B (got ${catalog.meta.phase})`);
  }
  if (actualCount < MIN_ENTITY_COUNT || actualCount > MAX_ENTITY_COUNT) {
    identityErrors.push(
      `entity count ${actualCount} outside FOOD-07B target ${MIN_ENTITY_COUNT}-${MAX_ENTITY_COUNT}`
    );
  }

  const ids = new Set();
  const slugs = new Set();
  for (const entity of catalog.herb_spices) {
    if (ids.has(entity.id)) identityErrors.push(`Duplicate id: ${entity.id}`);
    ids.add(entity.id);
    if (!ID_PATTERN.test(entity.id)) identityErrors.push(`Invalid id format: ${entity.id}`);
    if (slugs.has(entity.slug)) identityErrors.push(`Duplicate slug: ${entity.slug}`);
    slugs.add(entity.slug);
    if (entity.catalog_version !== "1.0.0") {
      identityErrors.push(`${entity.slug}: catalog_version must be 1.0.0`);
    }
    if (entity.food_ontology_version !== "1.4.0") {
      identityErrors.push(`${entity.slug}: food_ontology_version must be 1.4.0`);
    }

    if (CANONICAL_BLOCKED_SLUGS.has(entity.slug)) {
      canonicalEntityViolations.push(
        `${entity.slug}: blocked preparation or cross-domain slug (CANON-001 / Botanical Ownership)`
      );
    }
    for (const prefix of CANONICAL_SLUG_PREFIXES) {
      if (CANONICAL_ALLOWED_SLUGS.has(entity.slug)) break;
      if (entity.slug.startsWith(prefix)) {
        canonicalEntityViolations.push(`${entity.slug}: slug prefix "${prefix}" suggests split entity`);
        break;
      }
    }
    for (const pattern of CANONICAL_DISPLAY_PATTERNS) {
      if (pattern.test(entity.display_name)) {
        canonicalEntityViolations.push(
          `${entity.slug}: display_name "${entity.display_name}" violates CANON-001`
        );
        break;
      }
    }

    if (REGIONAL_ONLY_BLOCKED_SLUGS.has(entity.slug)) {
      globalRecognitionViolations.push(`${entity.slug}: regional commercial product slug (CANON-002)`);
    }
    for (const prefix of REGIONAL_ONLY_SLUG_PREFIXES) {
      if (REGIONAL_ONLY_ALLOWED_SLUGS.has(entity.slug)) break;
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
  }

  for (const req of BOTANICAL_REQUIRED) {
    if (!catalog.herb_spices.some((e) => e.slug === req.slug && e.parent_group === req.parent_group)) {
      botanicalOwnershipViolations.push(
        `Missing required entity ${req.slug} in ${req.parent_group} (Botanical Ownership Rule)`
      );
    }
  }
  for (const forbidden of BOTANICAL_FORBIDDEN) {
    if (catalog.herb_spices.some((e) => e.slug === forbidden.slug)) {
      botanicalOwnershipViolations.push(
        `${forbidden.slug}: ${forbidden.reason}`
      );
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
    const childEntities = catalog.herb_spices.filter((h) => h.parent_group === g.slug);
    if (childEntities.length === 0) hierarchyErrors.push(`Group ${g.slug} has no herb_spices`);
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

  for (const entity of catalog.herb_spices) {
    for (const key of Object.keys(entity)) {
      if (!ALLOWED_HERB_SPICE_KEYS.has(key)) {
        unexpectedKeys.push(`${entity.slug}: unexpected key "${key}"`);
      }
    }

    for (const field of REQUIRED_HERB_SPICE_FIELDS) {
      if (!(field in entity)) metadataGaps.push(`${entity.slug}: missing ${field}`);
    }

    if (entity.entity_type !== "herb_spice") {
      metadataGaps.push(`${entity.slug}: entity_type must be herb_spice`);
    }
    if (entity.parent_category !== "herb") {
      metadataGaps.push(`${entity.slug}: parent_category must be herb`);
    }

    if (!groupBySlug.has(entity.parent_group)) {
      hierarchyErrors.push(`Herb/spice ${entity.slug} orphan parent_group ${entity.parent_group}`);
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
          metadataGaps.push(`${entity.slug}: ${field} must be empty in FOOD-07B`);
        }
        continue;
      }
      if (!VOCAB[field]?.has(entity[field])) {
        vocabularyViolations.push(`${entity.slug}: invalid ${field} "${entity[field]}"`);
      }
    }

    if (!entity.scientific_name) {
      metadataGaps.push(`${entity.slug}: scientific_name missing`);
    } else if (entity.scientific_name.length < 5 || !entity.scientific_name.includes(" ")) {
      scientificIssues.push(
        `${entity.slug}: scientific_name must include a space "${entity.scientific_name}"`
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
        metadataGaps.push(`${entity.slug}: ${field} must be empty in FOOD-07B`);
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
    botanicalOwnershipViolations,
    actualCount,
  };
}

function evaluateRules(ctx) {
  const rules = [
    {
      id: "META-001",
      name: "meta.entity_count matches herb_spices length",
      severity: "required",
      evaluate: () =>
        ctx.identityErrors.filter((e) => e.startsWith("meta.entity_count")).length === 0
          ? { status: "pass" }
          : { status: "fail", messages: ctx.identityErrors.filter((e) => e.startsWith("meta.entity_count")) },
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
      name: "entity count within FOOD-07B target (80-120)",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.identityErrors.filter((e) => e.startsWith("entity count"));
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
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
      name: "Botanical Ownership Rule — frozen cross-form and cross-domain decisions",
      severity: "required",
      evaluate: () =>
        ctx.botanicalOwnershipViolations.length
          ? { status: "fail", messages: ctx.botanicalOwnershipViolations }
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
      name: "stable herb_spice ID format",
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
      name: "every herb_spice belongs to exactly one valid group",
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
            e.includes("has no herb_spices")
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
          ? { status: "fail", messages: ctx.vocabularyViolations.slice(0, 20), truncated: ctx.vocabularyViolations.length > 20 }
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
      name: "required intrinsic field coverage on every herb_spice",
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
        ctx.aliasConflicts.length
          ? { status: "fail", messages: ctx.aliasConflicts }
          : { status: "pass" },
    },
    {
      id: "SCHEMA-001",
      name: "no unexpected keys on herb_spice entities",
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

  const uniqueScientific = new Set(catalog.herb_spices.map((h) => h.scientific_name).filter(Boolean));
  const completeness = ctx.metadataGaps.length === 0 ? "100%" : "incomplete";

  return {
    audited_at: new Date().toISOString().slice(0, 10),
    phase: "FOOD-07B",
    domain: "herb-spice",
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
      herb_spices: catalog.herb_spices.length,
      scientific_names: uniqueScientific.size,
      vocabulary_violations: ctx.vocabularyViolations.length,
      canonical_entity_violations: ctx.canonicalEntityViolations.length,
      global_recognition_violations: ctx.globalRecognitionViolations.length,
      botanical_ownership_violations: ctx.botanicalOwnershipViolations.length,
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
      "Herb & spice entities": catalog.herb_spices.length,
      "Scientific names": uniqueScientific.size,
      "Vocabulary violations": ctx.vocabularyViolations.length,
      "Canonical entity violations": ctx.canonicalEntityViolations.length,
      "Global recognition violations": ctx.globalRecognitionViolations.length,
      "Botanical ownership violations": ctx.botanicalOwnershipViolations.length,
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
      botanical_ownership_violations: ctx.botanicalOwnershipViolations,
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
