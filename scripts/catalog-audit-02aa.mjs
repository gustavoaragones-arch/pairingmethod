#!/usr/bin/env node
/**
 * ONTOLOGY-02A.A — Protein Food Catalog Audit
 * Certification-quality validation before bootstrap.
 *
 * Run: node scripts/catalog-audit-02aa.mjs
 * Output: reports/protein-food-catalog-audit.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "../data/protein-food-catalog.json");
const REPORT_PATH = path.join(__dirname, "../reports/protein-food-catalog-audit.json");

const VOCAB = {
  food_category: new Set(["animal", "plant", "fungi"]),
  cut_type: new Set([
    "steak", "roast", "rib", "shank", "ground", "trim", "organ",
    "whole", "fillet", "portion", "tail", "claw", "tentacle",
  ]),
  anatomical_cut: new Set([
    "rib", "loin", "sirloin", "chuck", "round", "brisket", "flank", "plate",
    "shank", "neck", "belly", "shoulder", "leg", "breast", "thigh", "wing",
    "jowl", "tail", "claw", "tentacle", "fillet", "",
  ]),
  bone_state: new Set(["bone_in", "boneless", "either", "not_applicable"]),
  fat_content: new Set(["lean", "moderate", "rich"]),
  plant_part: new Set(["seed", "bean", "legume", "grain", "kernel", "nut", "sprout", "processed", ""]),
  edible_structure: new Set([
    "fruit", "seed", "leaf", "stem", "root", "tuber", "bulb", "flower", "fungal_body", "processed", "",
  ]),
  processing_state: new Set([
    "raw", "fresh", "cured", "smoked", "dried", "fermented", "cooked", "prepared", "ground", "processed",
  ]),
};

const SPECIES_REQUIRED_GROUPS = new Set([
  "poultry", "wild-game", "fin-fish", "crustaceans", "mollusks", "cephalopods",
  "legumes", "soy-foods", "grains-wheat-protein", "nuts-seeds", "mushrooms", "mycoprotein",
]);

const PLANT_FUNGI_GROUPS = new Set([
  "legumes", "soy-foods", "grains-wheat-protein", "nuts-seeds", "mushrooms", "mycoprotein",
]);

const MAMMAL_GROUPS = new Set(["beef", "pork", "lamb", "veal"]);

const RELATIONSHIP_ARRAYS = [
  "related_styles", "related_descriptors", "related_regions", "related_serving",
  "related_techniques", "similar_foods", "substitutes", "common_preparations", "common_cuisines",
];

const EMPTY_ARRAY_FIELDS = [
  "texture", "typical_descriptors", "wine_pairings", "avoid_wine_pairings", ...RELATIONSHIP_ARRAYS,
];

const REQUIRED_FOOD_FIELDS = [
  "id", "slug", "name", "entity_type", "domain", "parent_group", "food_category",
  "scientific_name", "external_ids", "aliases", "fat_content", "cut_type", "anatomical_cut",
  "bone_state", "primary_cooking_methods", "recommended_doneness", "processing_state",
  "summary", "beginner_notes", "faq", "seo_title", "seo_description",
  ...EMPTY_ARRAY_FIELDS,
];

const ALLOWED_FOOD_KEYS = new Set([
  ...REQUIRED_FOOD_FIELDS,
  "species", "plant_part", "edible_structure",
]);

const ID_PATTERN = /^food\.protein\.[a-z0-9-]+\.[a-z0-9-]+$/;
const GROUP_ID_PATTERN = /^food\.protein\.[a-z0-9-]+$/;
const CATEGORY_ID_PATTERN = /^food\.protein\.(animal|plant|fungi)$/;

function collectIssues(catalog) {
  const vocabularyViolations = [];
  const aliasConflicts = [];
  const metadataGaps = [];
  const identityErrors = [];
  const hierarchyErrors = [];
  const scientificIssues = [];
  const unexpectedKeys = [];

  const actualCount = catalog.protein_foods.length;
  if (catalog.meta.entity_count !== actualCount) {
    identityErrors.push(`meta.entity_count ${catalog.meta.entity_count} !== actual ${actualCount}`);
  }
  if (!catalog.meta.catalog_version) {
    identityErrors.push("meta.catalog_version missing");
  }

  const ids = new Set();
  const slugs = new Set();
  for (const food of catalog.protein_foods) {
    if (ids.has(food.id)) identityErrors.push(`Duplicate id: ${food.id}`);
    ids.add(food.id);
    if (!ID_PATTERN.test(food.id)) identityErrors.push(`Invalid id format: ${food.id}`);
    if (slugs.has(food.slug)) identityErrors.push(`Duplicate slug: ${food.slug}`);
    slugs.add(food.slug);
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

  const referencedGroups = new Set();
  for (const food of catalog.protein_foods) {
    referencedGroups.add(food.parent_group);
    if (!groupBySlug.has(food.parent_group)) {
      hierarchyErrors.push(`Food ${food.slug} orphan parent_group ${food.parent_group}`);
    }
  }

  for (const g of catalog.groups) {
    if (!GROUP_ID_PATTERN.test(g.id)) hierarchyErrors.push(`Invalid group id: ${g.id}`);
    if (!categoryBySlug.has(g.parent_category)) {
      hierarchyErrors.push(`Group ${g.slug} orphan parent_category ${g.parent_category}`);
    }
    const childFoods = catalog.protein_foods.filter((f) => f.parent_group === g.slug);
    if (childFoods.length === 0) hierarchyErrors.push(`Group ${g.slug} has no protein_foods`);
    for (const expected of g.child_slugs) {
      if (!childFoods.some((f) => f.slug === expected)) {
        hierarchyErrors.push(`Group ${g.slug} child_slugs missing entity ${expected}`);
      }
    }
    for (const f of childFoods) {
      if (!g.child_slugs.includes(f.slug)) {
        hierarchyErrors.push(`Entity ${f.slug} not in group ${g.slug} child_slugs`);
      }
    }
  }

  for (const gslug of referencedGroups) {
    if (!groupBySlug.has(gslug)) hierarchyErrors.push(`Referenced group ${gslug} not defined`);
  }

  for (const g of catalog.groups) {
    for (const cat of catalog.categories) {
      if (cat.child_slugs.includes(g.slug) && g.parent_category !== cat.slug) continue;
    }
  }

  const aliasIndex = new Map();
  const sciBySpecies = new Map();

  for (const food of catalog.protein_foods) {
    for (const key of Object.keys(food)) {
      if (!ALLOWED_FOOD_KEYS.has(key)) {
        unexpectedKeys.push(`${food.slug}: unexpected key "${key}"`);
      }
    }

    for (const field of REQUIRED_FOOD_FIELDS) {
      if (!(field in food)) metadataGaps.push(`${food.slug}: missing ${field}`);
    }

    if (food.entity_type !== "protein_food") {
      metadataGaps.push(`${food.slug}: entity_type must be protein_food`);
    }

    for (const field of ["food_category", "cut_type", "bone_state", "fat_content", "processing_state"]) {
      if (!VOCAB[field].has(food[field])) {
        vocabularyViolations.push(`${food.slug}: invalid ${field} "${food[field]}"`);
      }
    }

    if (!VOCAB.anatomical_cut.has(food.anatomical_cut)) {
      vocabularyViolations.push(`${food.slug}: invalid anatomical_cut "${food.anatomical_cut}"`);
    }

    if (SPECIES_REQUIRED_GROUPS.has(food.parent_group)) {
      if (!food.species || food.species === "") {
        metadataGaps.push(`${food.slug}: species required`);
      }
    }

    if (PLANT_FUNGI_GROUPS.has(food.parent_group)) {
      if (!("plant_part" in food)) metadataGaps.push(`${food.slug}: missing plant_part`);
      else if (!VOCAB.plant_part.has(food.plant_part)) {
        vocabularyViolations.push(`${food.slug}: invalid plant_part "${food.plant_part}"`);
      }
      if (!("edible_structure" in food)) metadataGaps.push(`${food.slug}: missing edible_structure`);
      else if (!VOCAB.edible_structure.has(food.edible_structure)) {
        vocabularyViolations.push(`${food.slug}: invalid edible_structure "${food.edible_structure}"`);
      }
      if (food.bone_state !== "not_applicable") {
        vocabularyViolations.push(`${food.slug}: plant/fungi bone_state must be not_applicable`);
      }
    }

    if (food.parent_group === "mushrooms" && food.edible_structure !== "fungal_body") {
      vocabularyViolations.push(`${food.slug}: mushrooms require edible_structure fungal_body`);
    }
    if (food.parent_group === "mycoprotein" && food.edible_structure !== "processed") {
      vocabularyViolations.push(`${food.slug}: mycoprotein requires edible_structure processed`);
    }

    if (!food.scientific_name && food.scientific_name !== "") {
      metadataGaps.push(`${food.slug}: scientific_name missing`);
    }

    if (food.species) {
      const prev = sciBySpecies.get(food.species);
      if (prev && prev !== food.scientific_name) {
        scientificIssues.push(
          `${food.slug}: species "${food.species}" scientific_name ${food.scientific_name}, expected ${prev}`
        );
      } else if (!prev) {
        sciBySpecies.set(food.species, food.scientific_name);
      }
    }

    for (const field of EMPTY_ARRAY_FIELDS) {
      if (!Array.isArray(food[field])) {
        metadataGaps.push(`${food.slug}: ${field} not array`);
      } else if (RELATIONSHIP_ARRAYS.includes(field) && food[field].length > 0) {
        metadataGaps.push(`${food.slug}: ${field} must be empty`);
      }
    }

    if (!Array.isArray(food.primary_cooking_methods) || food.primary_cooking_methods.length === 0) {
      metadataGaps.push(`${food.slug}: empty primary_cooking_methods`);
    }
    if (!Array.isArray(food.recommended_doneness) || food.recommended_doneness.length === 0) {
      metadataGaps.push(`${food.slug}: empty recommended_doneness`);
    }
    if (!Array.isArray(food.faq) || food.faq.length < 2) {
      metadataGaps.push(`${food.slug}: faq < 2`);
    }

    for (const alias of food.aliases || []) {
      const k = alias.trim().toLowerCase();
      if (aliasIndex.has(k)) {
        aliasConflicts.push(`"${alias}" on ${food.slug} and ${aliasIndex.get(k)}`);
      } else {
        aliasIndex.set(k, food.slug);
      }
    }
  }

  const mammalWithoutSpecies = catalog.protein_foods.filter(
    (f) => MAMMAL_GROUPS.has(f.parent_group) && (!f.species || f.species === "")
  );

  return {
    vocabularyViolations,
    aliasConflicts,
    metadataGaps,
    identityErrors,
    hierarchyErrors,
    scientificIssues,
    unexpectedKeys,
    mammalWithoutSpecies,
    actualCount,
  };
}

/** @typedef {"required" | "advisory" | "informational"} RuleSeverity */
/** @typedef {"pass" | "fail" | "warning" | "informational"} RuleStatus */

/**
 * Each rule is evaluated independently. Required failures block PASS.
 * Advisory failures become warnings. Informational rules never block PASS.
 */
function evaluateRules(ctx) {
  const rules = [
    {
      id: "META-001",
      name: "meta.entity_count matches protein_foods length",
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
      name: "stable protein_food ID format",
      severity: "required",
      evaluate: () => {
        const bad = ctx.identityErrors.filter((e) => e.startsWith("Invalid id format"));
        return bad.length ? { status: "fail", messages: bad } : { status: "pass" };
      },
    },
    {
      id: "HIER-001",
      name: "category ID format and group references",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.hierarchyErrors.filter(
          (e) => e.startsWith("Invalid category") || e.includes("Orphan group ref") || e.includes("parent_category mismatch")
        );
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
    },
    {
      id: "HIER-002",
      name: "group ID format and category parent",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.hierarchyErrors.filter(
          (e) => e.startsWith("Invalid group id") || e.includes("orphan parent_category")
        );
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
    },
    {
      id: "HIER-003",
      name: "every protein_food belongs to exactly one valid group",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.hierarchyErrors.filter((e) => e.includes("orphan parent_group") || e.includes("Referenced group"));
        return msgs.length ? { status: "fail", messages: msgs } : { status: "pass" };
      },
    },
    {
      id: "HIER-004",
      name: "group child_slugs bidirectionally complete",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.hierarchyErrors.filter(
          (e) => e.includes("child_slugs missing") || e.includes("not in group") || e.includes("has no protein_foods")
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
      id: "META-003",
      name: "species populated where required",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.metadataGaps.filter((e) => e.includes("species required"));
        return msgs.length ? { status: "fail", messages: msgs.slice(0, 20), truncated: msgs.length > 20 } : { status: "pass" };
      },
    },
    {
      id: "META-004",
      name: "plant/fungi botanical fields present and valid",
      severity: "required",
      evaluate: () => {
        const msgs = [
          ...ctx.metadataGaps.filter((e) => e.includes("plant_part") || e.includes("edible_structure")),
          ...ctx.vocabularyViolations.filter((e) => e.includes("plant/fungi") || e.includes("mushrooms") || e.includes("mycoprotein")),
        ];
        return msgs.length ? { status: "fail", messages: msgs.slice(0, 20) } : { status: "pass" };
      },
    },
    {
      id: "SCI-001",
      name: "scientific_name consistent per species key",
      severity: "required",
      evaluate: () =>
        ctx.scientificIssues.length
          ? { status: "fail", messages: ctx.scientificIssues }
          : { status: "pass" },
    },
    {
      id: "META-005",
      name: "required field coverage on every protein_food",
      severity: "required",
      evaluate: () => {
        const msgs = ctx.metadataGaps.filter(
          (e) => !e.includes("species required") && !e.includes("plant_part") && !e.includes("edible_structure")
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
      name: "no unexpected keys on protein_food entities",
      severity: "required",
      evaluate: () =>
        ctx.unexpectedKeys.length
          ? { status: "fail", messages: ctx.unexpectedKeys.slice(0, 20) }
          : { status: "pass" },
    },
    {
      id: "ADV-001",
      name: "mammal species field backfill (deferred to catalog audit follow-up)",
      severity: "advisory",
      evaluate: () => {
        const n = ctx.mammalWithoutSpecies.length;
        if (n === 0) return { status: "pass" };
        return {
          status: "warning",
          messages: [
            `${n} mammal-group entities without species field (beef, pork, lamb, veal) — deferred backfill, not blocking v1`,
          ],
        };
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
  const advisoryRules = ruleResults.filter((r) => r.severity === "advisory");
  const informationalRules = ruleResults.filter((r) => r.severity === "informational");

  const passed = ruleResults.filter((r) => r.status === "pass").length;
  const failed = ruleResults.filter((r) => r.status === "fail").length;
  const warnings = ruleResults.filter((r) => r.status === "warning").length;
  const informational = ruleResults.filter((r) => r.status === "informational").length;

  const requiredFailed = requiredRules.filter((r) => r.status === "fail").length;
  const overall = requiredFailed === 0 ? "PASS" : "FAIL";

  const uniqueScientific = new Set(
    catalog.protein_foods.map((f) => f.scientific_name).filter(Boolean)
  );

  const completeness = ctx.metadataGaps.length === 0 ? "100%" : "incomplete";

  return {
    audited_at: new Date().toISOString().slice(0, 10),
    phase: "ONTOLOGY-02A.A",
    catalog_version: catalog.meta.catalog_version,
    validation: {
      total_validation_rules: ruleResults.length,
      required_checks: requiredRules.length,
      advisory_checks: advisoryRules.length,
      informational_checks: informationalRules.length,
      passed,
      failed,
      warnings,
      informational,
      required_failed: requiredFailed,
      overall_result: overall,
    },
    summary: {
      categories: catalog.categories.length,
      groups: catalog.groups.length,
      protein_foods: catalog.protein_foods.length,
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
      Warnings: warnings,
      "Informational checks": informational,
      "Required checks": requiredRules.length,
      "Advisory checks": advisoryRules.length,
      Categories: catalog.categories.length,
      Groups: catalog.groups.length,
      "Protein foods": catalog.protein_foods.length,
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
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${REPORT_PATH}`);
  if (report.validation.overall_result !== "PASS") process.exit(1);
}

main();
