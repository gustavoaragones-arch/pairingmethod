#!/usr/bin/env node
/**
 * FOOD-04C — Cheese Catalog Audit
 * Certification-quality validation before bootstrap.
 *
 * Run: node scripts/catalog-audit-cheese-04c.mjs
 * Output: reports/cheese-catalog-audit.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "../data/cheese-catalog.json");
const REPORT_PATH = path.join(__dirname, "../reports/cheese-catalog-audit.json");

const VOCAB = {
  cheese_category: new Set([
    "fresh", "bloomy_rind", "washed_rind", "natural_rind", "blue",
    "semi_hard", "hard", "pasta_filata", "brined",
  ]),
  milk_source: new Set(["cow", "goat", "sheep", "buffalo", "mixed"]),
  aging_class: new Set(["unaged", "short_aged", "medium_aged", "long_aged", "extra_aged"]),
  texture: new Set(["soft", "semi_soft", "firm", "hard", "crumbly", "creamy", "granular", "elastic"]),
  moisture_class: new Set(["high", "medium", "low", "extra_low"]),
  rind_type: new Set([
    "none", "bloomy", "washed", "natural", "blue", "wax", "cloth", "leaf_wrapped", "smoked",
  ]),
  pasteurization: new Set(["raw", "pasteurized", "thermalized", "mixed", "unknown"]),
  protected_status: new Set(["none", "PDO", "PGI", "AOP", "TSG", "other", "pending_documentation"]),
};

const SCIENTIFIC_NAMES = new Set(["Bos taurus", "Capra hircus", "Ovis aries", "Bubalus bubalis"]);

const RELATIONSHIP_ARRAYS = [
  "typical_descriptors",
  "wine_pairings",
  "avoid_wine_pairings",
  "related_styles",
  "related_descriptors",
  "related_regions",
  "related_serving",
  "related_techniques",
  "similar_cheeses",
  "substitutions",
  "serving_styles",
  "common_preparations",
  "common_cuisines",
];

const INTRINSIC_FIELDS = [
  "cheese_category",
  "milk_source",
  "aging_class",
  "texture",
  "moisture_class",
  "rind_type",
  "pasteurization",
  "origin_country",
  "protected_status",
];

const REQUIRED_CHEESE_FIELDS = [
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
  "aliases",
  ...INTRINSIC_FIELDS,
  "summary",
  "beginner_notes",
  "faq",
  "seo_title",
  "seo_description",
  ...RELATIONSHIP_ARRAYS,
];

const ALLOWED_CHEESE_KEYS = new Set(REQUIRED_CHEESE_FIELDS);

const ID_PATTERN = /^food\.cheese\.[a-z0-9-]+\.[a-z0-9-]+$/;
const GROUP_ID_PATTERN = /^food\.cheese\.[a-z0-9-]+$/;
const CATEGORY_ID_PATTERN = /^food\.cheese$/;

const GROUP_TO_CATEGORY = {
  fresh: "fresh",
  "bloomy-rind": "bloomy_rind",
  "washed-rind": "washed_rind",
  "natural-rind": "natural_rind",
  blue: "blue",
  "semi-hard": "semi_hard",
  hard: "hard",
  "pasta-filata": "pasta_filata",
  brined: "brined",
};

function collectIssues(catalog) {
  const vocabularyViolations = [];
  const aliasConflicts = [];
  const metadataGaps = [];
  const identityErrors = [];
  const hierarchyErrors = [];
  const scientificIssues = [];
  const unexpectedKeys = [];

  const actualCount = catalog.cheeses.length;
  if (catalog.meta.entity_count !== actualCount) {
    identityErrors.push(`meta.entity_count ${catalog.meta.entity_count} !== actual ${actualCount}`);
  }
  if (!catalog.meta.catalog_version) {
    identityErrors.push("meta.catalog_version missing");
  }

  const ids = new Set();
  const slugs = new Set();
  for (const cheese of catalog.cheeses) {
    if (ids.has(cheese.id)) identityErrors.push(`Duplicate id: ${cheese.id}`);
    ids.add(cheese.id);
    if (!ID_PATTERN.test(cheese.id)) identityErrors.push(`Invalid id format: ${cheese.id}`);
    if (slugs.has(cheese.slug)) identityErrors.push(`Duplicate slug: ${cheese.slug}`);
    slugs.add(cheese.slug);
    if (cheese.catalog_version !== "1.0.0") {
      identityErrors.push(`${cheese.slug}: catalog_version must be 1.0.0`);
    }
    if (cheese.food_ontology_version !== "1.1.0") {
      identityErrors.push(`${cheese.slug}: food_ontology_version must be 1.1.0`);
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
    const childCheeses = catalog.cheeses.filter((c) => c.parent_group === g.slug);
    if (childCheeses.length === 0) hierarchyErrors.push(`Group ${g.slug} has no cheeses`);
    for (const expected of g.child_slugs) {
      if (!childCheeses.some((c) => c.slug === expected)) {
        hierarchyErrors.push(`Group ${g.slug} child_slugs missing entity ${expected}`);
      }
    }
    for (const c of childCheeses) {
      if (!g.child_slugs.includes(c.slug)) {
        hierarchyErrors.push(`Entity ${c.slug} not in group ${g.slug} child_slugs`);
      }
    }
  }

  const aliasIndex = new Map();

  for (const cheese of catalog.cheeses) {
    for (const key of Object.keys(cheese)) {
      if (!ALLOWED_CHEESE_KEYS.has(key)) {
        unexpectedKeys.push(`${cheese.slug}: unexpected key "${key}"`);
      }
    }

    for (const field of REQUIRED_CHEESE_FIELDS) {
      if (!(field in cheese)) metadataGaps.push(`${cheese.slug}: missing ${field}`);
    }

    if (cheese.entity_type !== "cheese") {
      metadataGaps.push(`${cheese.slug}: entity_type must be cheese`);
    }

    if (!groupBySlug.has(cheese.parent_group)) {
      hierarchyErrors.push(`Cheese ${cheese.slug} orphan parent_group ${cheese.parent_group}`);
    }

    const expectedCategory = GROUP_TO_CATEGORY[cheese.parent_group];
    if (expectedCategory && cheese.cheese_category !== expectedCategory) {
      vocabularyViolations.push(
        `${cheese.slug}: cheese_category ${cheese.cheese_category} != group ${cheese.parent_group} (${expectedCategory})`
      );
    }

    for (const field of INTRINSIC_FIELDS) {
      if (field === "origin_country") {
        if (cheese.origin_country === undefined || cheese.origin_country === null) {
          metadataGaps.push(`${cheese.slug}: missing origin_country`);
        }
        continue;
      }
      if (!VOCAB[field]?.has(cheese[field])) {
        vocabularyViolations.push(`${cheese.slug}: invalid ${field} "${cheese[field]}"`);
      }
    }

    if (!cheese.scientific_name) {
      metadataGaps.push(`${cheese.slug}: scientific_name missing`);
    } else if (!SCIENTIFIC_NAMES.has(cheese.scientific_name)) {
      scientificIssues.push(`${cheese.slug}: invalid scientific_name "${cheese.scientific_name}"`);
    }

    if (!cheese.external_ids || typeof cheese.external_ids !== "object" || Array.isArray(cheese.external_ids)) {
      metadataGaps.push(`${cheese.slug}: external_ids must be object`);
    }

    for (const field of RELATIONSHIP_ARRAYS) {
      if (!Array.isArray(cheese[field])) {
        metadataGaps.push(`${cheese.slug}: ${field} not array`);
      } else if (cheese[field].length > 0) {
        metadataGaps.push(`${cheese.slug}: ${field} must be empty`);
      }
    }

    if (!Array.isArray(cheese.aliases)) {
      metadataGaps.push(`${cheese.slug}: aliases not array`);
    }
    if (!Array.isArray(cheese.faq) || cheese.faq.length < 2) {
      metadataGaps.push(`${cheese.slug}: faq < 2`);
    }

    for (const alias of cheese.aliases || []) {
      const k = alias.trim().toLowerCase();
      if (aliasIndex.has(k)) {
        aliasConflicts.push(`"${alias}" on ${cheese.slug} and ${aliasIndex.get(k)}`);
      } else {
        aliasIndex.set(k, cheese.slug);
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
    actualCount,
  };
}

function evaluateRules(ctx) {
  const rules = [
    {
      id: "META-001",
      name: "meta.entity_count matches cheeses length",
      severity: "required",
      evaluate: () =>
        ctx.identityErrors.filter((e) => e.startsWith("meta.entity_count")).length === 0
          ? { status: "pass" }
          : { status: "fail", messages: ctx.identityErrors.filter((e) => e.startsWith("meta.entity_count")) },
    },
    {
      id: "META-002",
      name: "meta.catalog_version present",
      severity: "required",
      evaluate: () =>
        ctx.identityErrors.includes("meta.catalog_version missing")
          ? { status: "fail", messages: ["meta.catalog_version missing"] }
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
      name: "stable cheese ID format",
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
      name: "every cheese belongs to exactly one valid group",
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
            e.includes("has no cheeses")
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
      id: "SCI-001",
      name: "required scientific_name (milk source species)",
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
      name: "required field coverage on every cheese",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.metadataGaps.filter(
          (e) => !e.includes("external_ids") && !e.includes("scientific_name") && !RELATIONSHIP_ARRAYS.some((r) => e.includes(r))
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
      name: "no unexpected keys on cheese entities",
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

  const uniqueScientific = new Set(catalog.cheeses.map((c) => c.scientific_name).filter(Boolean));
  const completeness = ctx.metadataGaps.length === 0 ? "100%" : "incomplete";

  return {
    audited_at: new Date().toISOString().slice(0, 10),
    phase: "FOOD-04C",
    domain: "cheese",
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
      cheeses: catalog.cheeses.length,
      scientific_names: uniqueScientific.size,
      vocabulary_violations: ctx.vocabularyViolations.length,
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
      Cheeses: catalog.cheeses.length,
      "Scientific names": uniqueScientific.size,
      "Vocabulary violations": ctx.vocabularyViolations.length,
      "Alias conflicts": ctx.aliasConflicts.length,
      "Metadata completeness": completeness,
      "Overall result": overall,
    },
    rules: ruleResults,
    details: {
      identity_errors: ctx.identityErrors,
      hierarchy_errors: ctx.hierarchyErrors,
      vocabulary_violations: ctx.vocabularyViolations,
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
