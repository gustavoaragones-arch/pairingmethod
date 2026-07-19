#!/usr/bin/env node
/**
 * FOOD-05B — Vegetable Catalog Audit
 * Certification-quality validation before FOOD-05C runtime bootstrap.
 *
 * Run: node scripts/catalog-audit-vegetable-05b.mjs
 * Output: reports/vegetable-catalog-audit.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "../data/vegetable-catalog.json");
const REPORT_PATH = path.join(__dirname, "../reports/vegetable-catalog-audit.json");

const VOCAB = {
  culinary_group: new Set(["alliums", "green_vegetables", "root_vegetables", "nightshades"]),
  culinary_role: new Set([
    "primary", "aromatic", "leafy", "cruciferous", "root", "fruit_vegetable",
    "bulb", "stem", "flower", "pod",
  ]),
  plant_part: new Set([
    "leaf", "stem", "bulb", "root", "tuber", "flower", "pod", "fruit_vegetable", "mixed",
  ]),
  flavor_intensity: new Set(["mild", "moderate", "bold", "pungent"]),
  texture: new Set(["crisp", "tender", "fibrous", "succulent", "dense", "leafy"]),
  moisture_class: new Set(["high", "medium", "low"]),
  seasonality: new Set(["spring", "summer", "fall", "winter", "year_round", "mixed"]),
};

const GROUP_TO_CULINARY_GROUP = {
  alliums: "alliums",
  "green-vegetables": "green_vegetables",
  "root-vegetables": "root_vegetables",
  nightshades: "nightshades",
};

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

const INTRINSIC_FIELDS = [
  "culinary_group",
  "culinary_role",
  "plant_part",
  "flavor_intensity",
  "flavor_profile",
  "texture",
  "moisture_class",
  "seasonality",
  "origin_context",
];

const REQUIRED_VEGETABLE_FIELDS = [
  "id",
  "slug",
  "display_name",
  "entity_type",
  "domain",
  "parent_group",
  "scientific_name",
  "external_ids",
  "catalog_version",
  "food_ontology_version",
  ...INTRINSIC_FIELDS,
  "summary",
  "seo_title",
  "seo_description",
  ...RELATIONSHIP_ARRAYS,
];

const ALLOWED_VEGETABLE_KEYS = new Set([
  ...REQUIRED_VEGETABLE_FIELDS,
  "aliases",
  "beginner_notes",
  "faq",
]);

const ID_PATTERN = /^food\.vegetable\.[a-z0-9-]+\.[a-z0-9-]+$/;
const GROUP_ID_PATTERN = /^food\.vegetable\.[a-z0-9-]+$/;
const CATEGORY_ID_PATTERN = /^food\.vegetable$/;

/** Slug prefixes that indicate cultivar/color splits — forbidden as separate entities. */
const CANONICAL_SLUG_PREFIXES = [
  "red-", "white-", "yellow-", "orange-", "vidalia-", "pearl-",
  "cherry-", "grape-", "roma-", "beefsteak-", "heirloom-", "baby-",
];

const CANONICAL_BLOCKED_SLUGS = new Set([
  "red-onion", "white-onion", "yellow-onion", "sweet-onion", "vidalia-onion",
  "red-bell-pepper", "green-bell-pepper", "yellow-bell-pepper", "orange-bell-pepper",
  "cherry-tomato", "grape-tomato", "roma-tomato", "beefsteak-tomato",
  "pearl-onion", "cipollini-onion", "walla-walla-onion",
]);

const CANONICAL_DISPLAY_PATTERNS = [
  /^Red Onion$/i,
  /^White Onion$/i,
  /^Yellow Onion$/i,
  /^Sweet Onion$/i,
  /^Vidalia Onion$/i,
  /^Red Bell Pepper$/i,
  /^Green Bell Pepper$/i,
  /^Yellow Bell Pepper$/i,
  /^Orange Bell Pepper$/i,
  /^Cherry Tomato$/i,
  /^Grape Tomato$/i,
  /^Roma Tomato$/i,
];

function collectIssues(catalog) {
  const vocabularyViolations = [];
  const aliasConflicts = [];
  const metadataGaps = [];
  const identityErrors = [];
  const hierarchyErrors = [];
  const scientificIssues = [];
  const unexpectedKeys = [];
  const canonicalEntityViolations = [];

  const actualCount = catalog.vegetables.length;
  if (catalog.meta.entity_count !== actualCount) {
    identityErrors.push(`meta.entity_count ${catalog.meta.entity_count} !== actual ${actualCount}`);
  }
  if (!catalog.meta.catalog_version) {
    identityErrors.push("meta.catalog_version missing");
  }
  if (catalog.meta.phase !== "FOOD-05B") {
    identityErrors.push(`meta.phase must be FOOD-05B (got ${catalog.meta.phase})`);
  }

  const ids = new Set();
  const slugs = new Set();
  for (const vegetable of catalog.vegetables) {
    if (ids.has(vegetable.id)) identityErrors.push(`Duplicate id: ${vegetable.id}`);
    ids.add(vegetable.id);
    if (!ID_PATTERN.test(vegetable.id)) identityErrors.push(`Invalid id format: ${vegetable.id}`);
    if (slugs.has(vegetable.slug)) identityErrors.push(`Duplicate slug: ${vegetable.slug}`);
    slugs.add(vegetable.slug);
    if (vegetable.catalog_version !== "1.0.0") {
      identityErrors.push(`${vegetable.slug}: catalog_version must be 1.0.0`);
    }
    if (vegetable.food_ontology_version !== "1.2.0") {
      identityErrors.push(`${vegetable.slug}: food_ontology_version must be 1.2.0`);
    }

    if (CANONICAL_BLOCKED_SLUGS.has(vegetable.slug)) {
      canonicalEntityViolations.push(`${vegetable.slug}: blocked cultivar/variety slug (use aliases on canonical entity)`);
    }
    for (const prefix of CANONICAL_SLUG_PREFIXES) {
      if (vegetable.slug.startsWith(prefix)) {
        canonicalEntityViolations.push(`${vegetable.slug}: slug prefix "${prefix}" suggests variety split`);
        break;
      }
    }
    for (const pattern of CANONICAL_DISPLAY_PATTERNS) {
      if (pattern.test(vegetable.display_name)) {
        canonicalEntityViolations.push(`${vegetable.slug}: display_name "${vegetable.display_name}" violates Canonical Entity Rule`);
        break;
      }
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
    const childVegetables = catalog.vegetables.filter((v) => v.parent_group === g.slug);
    if (childVegetables.length === 0) hierarchyErrors.push(`Group ${g.slug} has no vegetables`);
    for (const expected of g.child_slugs) {
      if (!childVegetables.some((v) => v.slug === expected)) {
        hierarchyErrors.push(`Group ${g.slug} child_slugs missing entity ${expected}`);
      }
    }
    for (const v of childVegetables) {
      if (!g.child_slugs.includes(v.slug)) {
        hierarchyErrors.push(`Entity ${v.slug} not in group ${g.slug} child_slugs`);
      }
    }
  }

  const aliasIndex = new Map();

  for (const vegetable of catalog.vegetables) {
    for (const key of Object.keys(vegetable)) {
      if (!ALLOWED_VEGETABLE_KEYS.has(key)) {
        unexpectedKeys.push(`${vegetable.slug}: unexpected key "${key}"`);
      }
    }

    for (const field of REQUIRED_VEGETABLE_FIELDS) {
      if (!(field in vegetable)) metadataGaps.push(`${vegetable.slug}: missing ${field}`);
    }

    if (vegetable.entity_type !== "vegetable") {
      metadataGaps.push(`${vegetable.slug}: entity_type must be vegetable`);
    }

    if (!groupBySlug.has(vegetable.parent_group)) {
      hierarchyErrors.push(`Vegetable ${vegetable.slug} orphan parent_group ${vegetable.parent_group}`);
    }

    const expectedGroup = GROUP_TO_CULINARY_GROUP[vegetable.parent_group];
    if (expectedGroup && vegetable.culinary_group !== expectedGroup) {
      vocabularyViolations.push(
        `${vegetable.slug}: culinary_group ${vegetable.culinary_group} != group ${vegetable.parent_group} (${expectedGroup})`
      );
    }

    for (const field of INTRINSIC_FIELDS) {
      if (field === "origin_context") {
        if (vegetable.origin_context === undefined || vegetable.origin_context === null) {
          metadataGaps.push(`${vegetable.slug}: missing origin_context`);
        }
        continue;
      }
      if (field === "flavor_profile") {
        if (!Array.isArray(vegetable.flavor_profile)) {
          metadataGaps.push(`${vegetable.slug}: flavor_profile must be array`);
        } else if (vegetable.flavor_profile.length > 0) {
          metadataGaps.push(`${vegetable.slug}: flavor_profile must be empty in FOOD-05B`);
        }
        continue;
      }
      if (!VOCAB[field]?.has(vegetable[field])) {
        vocabularyViolations.push(`${vegetable.slug}: invalid ${field} "${vegetable[field]}"`);
      }
    }

    if (!vegetable.scientific_name) {
      metadataGaps.push(`${vegetable.slug}: scientific_name missing`);
    } else if (vegetable.scientific_name.length < 5 || !vegetable.scientific_name.includes(" ")) {
      scientificIssues.push(`${vegetable.slug}: scientific_name must be binomial "${vegetable.scientific_name}"`);
    }

    if (!vegetable.external_ids || typeof vegetable.external_ids !== "object" || Array.isArray(vegetable.external_ids)) {
      metadataGaps.push(`${vegetable.slug}: external_ids must be object`);
    }

    for (const field of RELATIONSHIP_ARRAYS) {
      if (!Array.isArray(vegetable[field])) {
        metadataGaps.push(`${vegetable.slug}: ${field} not array`);
      } else if (vegetable[field].length > 0) {
        metadataGaps.push(`${vegetable.slug}: ${field} must be empty in FOOD-05B`);
      }
    }

    for (const alias of vegetable.aliases || []) {
      const k = alias.trim().toLowerCase();
      if (aliasIndex.has(k)) {
        aliasConflicts.push(`"${alias}" on ${vegetable.slug} and ${aliasIndex.get(k)}`);
      } else {
        aliasIndex.set(k, vegetable.slug);
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
    actualCount,
  };
}

function evaluateRules(ctx) {
  const rules = [
    {
      id: "META-001",
      name: "meta.entity_count matches vegetables length",
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
      id: "CANON-001",
      name: "Canonical Entity Rule — no cultivar/variety splits",
      severity: "required",
      evaluate: () =>
        ctx.canonicalEntityViolations.length
          ? { status: "fail", messages: ctx.canonicalEntityViolations }
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
      name: "stable vegetable ID format",
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
      name: "every vegetable belongs to exactly one valid group",
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
            e.includes("has no vegetables")
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
      id: "ROLE-001",
      name: "culinary_role populated on every entity",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.metadataGaps.filter((e) => e.includes("culinary_role"));
        return msgs.length ? { status: "fail", messages: msgs.slice(0, 20) } : { status: "pass" };
      },
    },
    {
      id: "FLAV-001",
      name: "flavor_profile reserved and empty",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.metadataGaps.filter((e) => e.includes("flavor_profile"));
        return msgs.length ? { status: "fail", messages: msgs.slice(0, 20) } : { status: "pass" };
      },
    },
    {
      id: "SCI-001",
      name: "required botanical scientific_name",
      severity: "required",
      evaluate: () =>
        ctx.scientificIssues.length || ctx.metadataGaps.filter((e) => e.includes("scientific_name")).length
          ? {
              status: "fail",
              messages: [...ctx.scientificIssues, ...ctx.metadataGaps.filter((e) => e.includes("scientific_name"))].slice(0, 20),
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
      name: "required intrinsic field coverage on every vegetable",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.metadataGaps.filter(
          (e) =>
            !e.includes("external_ids") &&
            !e.includes("scientific_name") &&
            !RELATIONSHIP_ARRAYS.some((r) => e.includes(r)) &&
            !e.includes("flavor_profile")
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
      name: "no unexpected keys on vegetable entities",
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

  const uniqueScientific = new Set(catalog.vegetables.map((v) => v.scientific_name).filter(Boolean));
  const completeness = ctx.metadataGaps.length === 0 ? "100%" : "incomplete";

  return {
    audited_at: new Date().toISOString().slice(0, 10),
    phase: "FOOD-05B",
    domain: "vegetable",
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
      vegetables: catalog.vegetables.length,
      scientific_names: uniqueScientific.size,
      vocabulary_violations: ctx.vocabularyViolations.length,
      canonical_entity_violations: ctx.canonicalEntityViolations.length,
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
      Vegetables: catalog.vegetables.length,
      "Scientific names": uniqueScientific.size,
      "Vocabulary violations": ctx.vocabularyViolations.length,
      "Canonical entity violations": ctx.canonicalEntityViolations.length,
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
