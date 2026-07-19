#!/usr/bin/env node
/**
 * FOOD-06B — Fungi Catalog Audit
 * Certification-quality validation before FOOD-06C runtime bootstrap.
 *
 * Run: node scripts/catalog-audit-fungi-06b.mjs
 * Output: reports/fungi-catalog-audit.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "../data/fungi-catalog.json");
const REPORT_PATH = path.join(__dirname, "../reports/fungi-catalog-audit.json");

const VOCAB = {
  culinary_group: new Set([
    "cultivated_mushrooms",
    "wild_mushrooms",
    "truffles",
    "specialty_fungi",
  ]),
  usage_intensity: new Set(["primary", "accent", "luxury"]),
};

const GROUP_TO_CULINARY_GROUP = {
  "cultivated-mushrooms": "cultivated_mushrooms",
  "wild-mushrooms": "wild_mushrooms",
  truffles: "truffles",
  "specialty-fungi": "specialty_fungi",
};

const RELATIONSHIP_ARRAYS = [
  "typical_descriptors",
  "wine_pairings",
  "avoid_wine_pairings",
  "related_styles",
  "related_descriptors",
  "related_techniques",
  "similar_fungi",
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

const REQUIRED_FUNGUS_FIELDS = [
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

const ALLOWED_FUNGUS_KEYS = new Set([
  ...REQUIRED_FUNGUS_FIELDS,
  "beginner_notes",
  "faq",
]);

const ID_PATTERN = /^food\.fungi\.[a-z0-9-]+\.[a-z0-9-]+$/;
const GROUP_ID_PATTERN = /^food\.fungi\.[a-z0-9-]+$/;
const CATEGORY_ID_PATTERN = /^food\.fungi$/;

const CANONICAL_SLUG_PREFIXES = [
  "white-", "brown-", "baby-", "giant-", "golden-", "mini-", "large-",
  "red-", "yellow-", "perigord-", "alba-", "oregon-", "pecan-",
];

const CANONICAL_ALLOWED_SLUGS = new Set([
  "white-truffle",
  "black-truffle",
  "black-trumpet",
]);

const CANONICAL_BLOCKED_SLUGS = new Set([
  "white-button-mushroom",
  "brown-button-mushroom",
  "baby-bella",
  "giant-portobello",
  "golden-oyster-mushroom",
  "perigord-black-truffle",
  "alba-white-truffle",
  "white-truffle-alba",
  "brown-cap-mushroom",
  "mini-portobello",
]);

const CANONICAL_DISPLAY_PATTERNS = [
  /^White Button Mushroom$/i,
  /^Brown Button Mushroom$/i,
  /^Baby Bella$/i,
  /^Giant Portobello$/i,
  /^Golden Oyster Mushroom$/i,
  /^Perigord Black Truffle$/i,
  /^Alba White Truffle$/i,
];

/** CANON-002 — regional commercial products must not be separate canonical entities. */
const REGIONAL_ONLY_SLUG_PREFIXES = [
  "oregon-",
  "pecan-",
  "chinese-black-",
  "szechuan-",
  "yunnan-",
  "californian-",
  "tasmanian-",
];

const REGIONAL_ONLY_BLOCKED_SLUGS = new Set([
  "pecan-truffle",
  "oregon-black-truffle",
  "oregon-white-truffle",
  "chinese-black-truffle",
]);

const MIN_SUMMARY_LENGTH = 80;

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

  const actualCount = catalog.fungi.length;
  if (catalog.meta.entity_count !== actualCount) {
    identityErrors.push(`meta.entity_count ${catalog.meta.entity_count} !== actual ${actualCount}`);
  }
  if (!catalog.meta.catalog_version) {
    identityErrors.push("meta.catalog_version missing");
  }
  if (catalog.meta.phase !== "FOOD-06B") {
    identityErrors.push(`meta.phase must be FOOD-06B (got ${catalog.meta.phase})`);
  }

  const ids = new Set();
  const slugs = new Set();
  for (const fungus of catalog.fungi) {
    if (ids.has(fungus.id)) identityErrors.push(`Duplicate id: ${fungus.id}`);
    ids.add(fungus.id);
    if (!ID_PATTERN.test(fungus.id)) identityErrors.push(`Invalid id format: ${fungus.id}`);
    if (slugs.has(fungus.slug)) identityErrors.push(`Duplicate slug: ${fungus.slug}`);
    slugs.add(fungus.slug);
    if (fungus.catalog_version !== "1.0.0") {
      identityErrors.push(`${fungus.slug}: catalog_version must be 1.0.0`);
    }
    if (fungus.food_ontology_version !== "1.3.0") {
      identityErrors.push(`${fungus.slug}: food_ontology_version must be 1.3.0`);
    }

    if (CANONICAL_BLOCKED_SLUGS.has(fungus.slug)) {
      canonicalEntityViolations.push(
        `${fungus.slug}: blocked trade-name slug (use aliases on canonical entity)`
      );
    }
    for (const prefix of CANONICAL_SLUG_PREFIXES) {
      if (CANONICAL_ALLOWED_SLUGS.has(fungus.slug)) break;
      if (fungus.slug.startsWith(prefix)) {
        canonicalEntityViolations.push(`${fungus.slug}: slug prefix "${prefix}" suggests variety split`);
        break;
      }
    }
    for (const pattern of CANONICAL_DISPLAY_PATTERNS) {
      if (pattern.test(fungus.display_name)) {
        canonicalEntityViolations.push(
          `${fungus.slug}: display_name "${fungus.display_name}" violates CANON-001`
        );
        break;
      }
    }

    if (REGIONAL_ONLY_BLOCKED_SLUGS.has(fungus.slug)) {
      globalRecognitionViolations.push(
        `${fungus.slug}: regional commercial product slug (CANON-002)`
      );
    }
    for (const prefix of REGIONAL_ONLY_SLUG_PREFIXES) {
      if (fungus.slug.startsWith(prefix)) {
        globalRecognitionViolations.push(
          `${fungus.slug}: regional-only slug prefix "${prefix}" (CANON-002)`
        );
        break;
      }
    }
    if (!fungus.summary || fungus.summary.length < MIN_SUMMARY_LENGTH) {
      globalRecognitionViolations.push(
        `${fungus.slug}: summary too short for global culinary identity (CANON-002)`
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
    const childFungi = catalog.fungi.filter((f) => f.parent_group === g.slug);
    if (childFungi.length === 0) hierarchyErrors.push(`Group ${g.slug} has no fungi`);
    for (const expected of g.child_slugs) {
      if (!childFungi.some((f) => f.slug === expected)) {
        hierarchyErrors.push(`Group ${g.slug} child_slugs missing entity ${expected}`);
      }
    }
    for (const f of childFungi) {
      if (!g.child_slugs.includes(f.slug)) {
        hierarchyErrors.push(`Entity ${f.slug} not in group ${g.slug} child_slugs`);
      }
    }
  }

  const aliasIndex = new Map();

  for (const fungus of catalog.fungi) {
    for (const key of Object.keys(fungus)) {
      if (!ALLOWED_FUNGUS_KEYS.has(key)) {
        unexpectedKeys.push(`${fungus.slug}: unexpected key "${key}"`);
      }
    }

    for (const field of REQUIRED_FUNGUS_FIELDS) {
      if (!(field in fungus)) metadataGaps.push(`${fungus.slug}: missing ${field}`);
    }

    if (fungus.entity_type !== "fungus") {
      metadataGaps.push(`${fungus.slug}: entity_type must be fungus`);
    }
    if (fungus.parent_category !== "fungi") {
      metadataGaps.push(`${fungus.slug}: parent_category must be fungi`);
    }

    if (!groupBySlug.has(fungus.parent_group)) {
      hierarchyErrors.push(`Fungus ${fungus.slug} orphan parent_group ${fungus.parent_group}`);
    }

    const expectedGroup = GROUP_TO_CULINARY_GROUP[fungus.parent_group];
    if (expectedGroup && fungus.culinary_group !== expectedGroup) {
      vocabularyViolations.push(
        `${fungus.slug}: culinary_group ${fungus.culinary_group} != group ${fungus.parent_group} (${expectedGroup})`
      );
    }

    for (const field of INTRINSIC_FIELDS) {
      if (field === "origin_context") {
        if (fungus.origin_context === undefined || fungus.origin_context === null) {
          metadataGaps.push(`${fungus.slug}: missing origin_context`);
        }
        continue;
      }
      if (["flavor_profile", "texture_profile", "aroma_profile"].includes(field)) {
        if (!Array.isArray(fungus[field])) {
          metadataGaps.push(`${fungus.slug}: ${field} must be array`);
        } else if (fungus[field].length > 0) {
          metadataGaps.push(`${fungus.slug}: ${field} must be empty in FOOD-06B`);
        }
        continue;
      }
      if (!VOCAB[field]?.has(fungus[field])) {
        vocabularyViolations.push(`${fungus.slug}: invalid ${field} "${fungus[field]}"`);
      }
    }

    if (!fungus.scientific_name) {
      metadataGaps.push(`${fungus.slug}: scientific_name missing`);
    } else if (fungus.scientific_name.length < 5 || !fungus.scientific_name.includes(" ")) {
      scientificIssues.push(
        `${fungus.slug}: scientific_name must be binomial "${fungus.scientific_name}"`
      );
    }

    if (!fungus.external_ids || typeof fungus.external_ids !== "object" || Array.isArray(fungus.external_ids)) {
      metadataGaps.push(`${fungus.slug}: external_ids must be object`);
    }

    if (!Array.isArray(fungus.aliases)) {
      metadataGaps.push(`${fungus.slug}: aliases must be array`);
    }
    if (!Array.isArray(fungus.common_names)) {
      metadataGaps.push(`${fungus.slug}: common_names must be array`);
    }

    for (const field of RELATIONSHIP_ARRAYS) {
      if (!Array.isArray(fungus[field])) {
        metadataGaps.push(`${fungus.slug}: ${field} not array`);
      } else if (fungus[field].length > 0) {
        metadataGaps.push(`${fungus.slug}: ${field} must be empty in FOOD-06B`);
      }
    }

    for (const alias of fungus.aliases || []) {
      const k = alias.trim().toLowerCase();
      if (aliasIndex.has(k)) {
        aliasConflicts.push(`"${alias}" on ${fungus.slug} and ${aliasIndex.get(k)}`);
      } else {
        aliasIndex.set(k, fungus.slug);
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
    actualCount,
  };
}

function evaluateRules(ctx) {
  const rules = [
    {
      id: "META-001",
      name: "meta.entity_count matches fungi length",
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
      name: "Canonical Entity Rule — no trade-name or variety splits",
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
      name: "stable fungus ID format",
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
      name: "every fungus belongs to exactly one valid group",
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
            e.includes("has no fungi")
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
      name: "required intrinsic field coverage on every fungus",
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
      name: "no unexpected keys on fungus entities",
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

  const uniqueScientific = new Set(catalog.fungi.map((f) => f.scientific_name).filter(Boolean));
  const completeness = ctx.metadataGaps.length === 0 ? "100%" : "incomplete";

  return {
    audited_at: new Date().toISOString().slice(0, 10),
    phase: "FOOD-06B",
    domain: "fungi",
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
      fungi: catalog.fungi.length,
      scientific_names: uniqueScientific.size,
      vocabulary_violations: ctx.vocabularyViolations.length,
      canonical_entity_violations: ctx.canonicalEntityViolations.length,
      global_recognition_violations: ctx.globalRecognitionViolations.length,
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
      Fungi: catalog.fungi.length,
      "Scientific names": uniqueScientific.size,
      "Vocabulary violations": ctx.vocabularyViolations.length,
      "Canonical entity violations": ctx.canonicalEntityViolations.length,
      "Global recognition violations": ctx.globalRecognitionViolations.length,
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
