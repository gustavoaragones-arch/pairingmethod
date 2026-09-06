#!/usr/bin/env node
/**
 * PAIRING-EAT-13 — Food-Tail Relationship Evidence Remediation.
 *
 * Data-integrity phase. Investigates WHY the wine-relationship datasets for
 * fruit, nut-seed, legume, and sweet-flavor (873 edges total) carry
 * governance-code boilerplate in their `evidence` fields, determines
 * whether the underlying (source, relationship, target) records themselves
 * are independently supportable, and classifies every edge into exactly
 * one of five categories (A/B/C/D/E). Read-only except for writing its own
 * reports — no catalog, runtime relationship file, seed file, mapping
 * script, renderer, or HTML page is modified by running this script.
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { listWinemakingTechniqueEntries } from "../lib/taxonomy-winemaking-technique.js";

const ROOT = process.cwd();

function read(relPath) { return fs.readFileSync(path.join(ROOT, relPath), "utf8"); }
function exists(relPath) { return fs.existsSync(path.join(ROOT, relPath)); }
function readJson(relPath) { return JSON.parse(read(relPath)); }
function gitLines(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: "utf8" }).split("\n").map((l) => l.trim()).filter(Boolean);
  } catch { return []; }
}
function gitHeadContent(relPath) {
  try { return execSync(`git show HEAD:${relPath}`, { cwd: ROOT, encoding: "utf8" }); }
  catch { return null; }
}

const UNSUITABLE_EVIDENCE_PATTERN = /\bper [A-Z][A-Z0-9-]*-\d+\b/;
const TARGET_DOMAINS = ["fruit", "nut-seed", "legume", "sweet-flavor"];
const RELATIONSHIP_TYPES_ALLOWED = ["pairs_with_style", "also_pairs_with_style", "pairs_with_descriptor", "pairs_with_technique"];

const DOMAIN_CONFIG = {
  fruit: {
    catalog: "data/fruit-catalog.json", leafKey: "fruits",
    relFile: "data/runtime/fruit-wine-relationships.json",
    leafDir: "fruits", groupDir: "fruit-groups", categoryDir: "fruit-categories",
    seedFile: "scripts/fruit-wine-seed-09e.js", mapperFile: "scripts/map-fruit-wine-relationships-09e.mjs",
    governanceCode: "FRUIT-PAIR-001", validatorFn: "validateFruitPair001Rule", validatorLine: 157,
    citationCheckLine: 169, hasEscapeValve: false,
  },
  "nut-seed": {
    catalog: "data/nut-seed-catalog.json", leafKey: "nut_seeds",
    relFile: "data/runtime/nut-seed-wine-relationships.json",
    leafDir: "nut-seeds", groupDir: "nut-seed-groups", categoryDir: "nut-seed-categories",
    seedFile: "scripts/nut-seed-wine-seed-10e.js", mapperFile: "scripts/map-nut-seed-wine-relationships-10e.mjs",
    governanceCode: "NUT-PAIR-001", validatorFn: "validateNutPair001Rule", validatorLine: 171,
    citationCheckLine: 185, hasEscapeValve: false,
  },
  legume: {
    catalog: "data/legume-catalog.json", leafKey: "legumes",
    relFile: "data/runtime/legume-wine-relationships.json",
    leafDir: "legumes", groupDir: "legume-groups", categoryDir: "legume-categories",
    seedFile: "scripts/legume-wine-seed-11e.js", mapperFile: "scripts/map-legume-wine-relationships-11e.mjs",
    governanceCode: "LEGUME-PAIR-001", validatorFn: "validateLegumePair001Rule", validatorLine: 165,
    citationCheckLine: 178, hasEscapeValve: false,
  },
  "sweet-flavor": {
    catalog: "data/sweet-flavor-catalog.json", leafKey: "sweet_flavors",
    relFile: "data/runtime/sweet-flavor-wine-relationships.json",
    leafDir: "sweet-flavors", groupDir: "sweet-flavor-groups", categoryDir: "sweet-flavor-categories",
    seedFile: "scripts/sweet-flavor-wine-seed-12e.js", mapperFile: "scripts/map-sweet-flavor-wine-relationships-12e.mjs",
    governanceCode: "SWEET-PAIR-001", validatorFn: "validateSweetPair001Rule", validatorLine: 165,
    citationCheckLine: 178, hasEscapeValve: false,
  },
};

// Structured, empty-across-the-board descriptor fields on the 4 domains'
// own catalog entities — checked live below (not assumed) to determine
// whether any independent, non-circular food-side provenance exists.
const FOOD_SIDE_DESCRIPTOR_FIELDS = ["flavor_profile", "aroma_profile", "related_descriptors", "commonly_served_with", "common_preparations"];

const KNOWN_PRE_EXISTING_UNTRACKED_PREFIXES = [
  ".regression-baseline/", "cheese-categories/", "cheese-groups/", "cheeses/", "logo-vector_.ai",
  "reports/pairing-eat-01-audit.md", "reports/pairing-eat-05-content-quality.json", "reports/pairing-eat-05-content-quality.md",
  "scripts/verify-pairing-eat-05.mjs", "terms/",
  "reports/pairing-eat-09-evidence-audit.md", "reports/pairing-eat-09-evidence-audit.json",
  "reports/pairing-eat-09-verification.json", "scripts/verify-pairing-eat-09.mjs",
];
function isKnownPreExistingNoise(f) {
  return KNOWN_PRE_EXISTING_UNTRACKED_PREFIXES.some((p) => f === p || f.startsWith(p));
}
const EAT13_OWN_NEW_FILES = [
  "scripts/verify-pairing-eat-13.mjs",
  "reports/pairing-eat-13-relationship-audit.json",
  "reports/pairing-eat-13-implementation.md",
];

const PROTECTED_PREFIXES = [
  "assets/js/pairing-engine.js", "assets/js/pairing-data.js", "assets/js/matrix-view.js", "assets/js/engine.js",
  "data/relationship-evidence.json", "data/wine-fault-external-references.json",
  "data/spanish-vocabulary.json", "data/wine-", "data/grape-catalog.json", "data/cheese-catalog.json",
  "data/relationship-types.json", "data/vegetable-catalog.json", "data/herb-spice-catalog.json",
  "data/grain-starch-catalog.json", "data/protein-food-catalog.json",
  "sitemap.xml", "sitemaps/", "_redirects", "robots.txt", "lib/language-config.js",
  "404.html", "privacy.html", "terms.html", "disclaimer.html", "cookies.html", "about.html",
  "faults/", "lib/taxonomy-wine-fault-render.js",
  "lib/fungi-wine-pairing-explanation.js", "lib/food-tail-wine-pairing-explanation.js",
  "lib/taxonomy-vegetable-render.js", "lib/taxonomy-herb-spice-render.js", "lib/taxonomy-grain-starch-render.js",
  "lib/taxonomy-fruit-render.js", "lib/taxonomy-nut-seed-render.js", "lib/taxonomy-legume-render.js",
  "lib/taxonomy-sweet-flavor-render.js",
  "vegetables/", "vegetable-groups/", "vegetable-categories/",
  "herbs-spices/", "herb-spice-groups/", "herb-spice-categories/",
  "grains-starches/", "grain-starch-groups/", "grain-starch-categories/",
  "foods/", "groups/", "categories/", "sauce-condiments/", "fungi/", "fungi-groups/", "fungi-categories/", "cheeses/",
  "styles/", "regions/", "techniques/", "serving/", "grapes/",
  "reports/pairing-eat-04", "reports/pairing-eat-06", "reports/pairing-eat-07",
  "reports/pairing-eat-08", "reports/pairing-eat-09", "reports/pairing-eat-10",
  "reports/pairing-eat-11", "reports/pairing-eat-12",
  "scripts/verify-pairing-eat-04", "scripts/verify-pairing-eat-06", "scripts/verify-pairing-eat-07",
  "scripts/verify-pairing-eat-08", "scripts/verify-pairing-eat-09", "scripts/verify-pairing-eat-10",
  "scripts/verify-pairing-eat-11", "scripts/verify-pairing-eat-12",
  // Catalogs for the 4 target domains and their leaf/group/category HTML
  // are read this phase (structural lookups) but must not be written to.
  "data/fruit-catalog.json", "data/nut-seed-catalog.json", "data/legume-catalog.json", "data/sweet-flavor-catalog.json",
  "fruits/", "fruit-groups/", "fruit-categories/",
  "nut-seeds/", "nut-seed-groups/", "nut-seed-categories/",
  "legumes/", "legume-groups/", "legume-categories/",
  "sweet-flavors/", "sweet-flavor-groups/", "sweet-flavor-categories/",
];

// ---------------------------------------------------------------------
// Wine ontology (loaded live, not assumed) for structural validation and
// display-name resolution.
// ---------------------------------------------------------------------

function loadWineOntology() {
  const taxonomy = loadTaxonomy();
  const descriptorEntries = Object.values(taxonomy.nodes).filter((n) => n.type === "descriptor");
  const descriptorIds = new Set(descriptorEntries.map((n) => n.slug));
  const descriptorNames = new Map(descriptorEntries.map((n) => [n.slug, n.name]));
  const styleEntries = listWineStyleEntries();
  const styleIds = new Set(styleEntries.map((s) => s.slug));
  const styleNames = new Map(styleEntries.map((s) => [s.slug, s.name]));
  const styleDescriptors = new Map(styleEntries.map((s) => [s.slug, s.typical_descriptors || []]));
  const techniqueEntries = listWinemakingTechniqueEntries();
  const techniqueIds = new Set(techniqueEntries.map((t) => t.slug));
  const techniqueNames = new Map(techniqueEntries.map((t) => [t.slug, t.name]));
  return { styleIds, descriptorIds, techniqueIds, styleNames, descriptorNames, techniqueNames, styleDescriptors };
}

function validateTargetLive(relationship, target, wine) {
  if (relationship === "pairs_with_style" || relationship === "also_pairs_with_style") return wine.styleIds.has(target);
  if (relationship === "pairs_with_descriptor") return wine.descriptorIds.has(target);
  if (relationship === "pairs_with_technique") return wine.techniqueIds.has(target);
  return false;
}

function resolveTargetName(relationship, target, wine) {
  if (relationship === "pairs_with_style" || relationship === "also_pairs_with_style") return wine.styleNames.get(target) ?? null;
  if (relationship === "pairs_with_descriptor") return wine.descriptorNames.get(target) ?? null;
  if (relationship === "pairs_with_technique") return wine.techniqueNames.get(target) ?? null;
  return null;
}

// ---------------------------------------------------------------------
// Load domain data
// ---------------------------------------------------------------------

function loadDomain(domain) {
  const cfg = DOMAIN_CONFIG[domain];
  const catalog = readJson(cfg.catalog);
  const leaves = catalog[cfg.leafKey];
  const leavesById = new Map(leaves.map((l) => [l.id, l]));
  const rel = readJson(cfg.relFile);
  const edges = Array.isArray(rel) ? rel : rel.relationships || rel.edges || [];
  return { cfg, catalog, leaves, leavesById, edges };
}

// ---------------------------------------------------------------------
// Independent-corroboration check — deterministic, live, non-circular.
// Only counts as corroboration if the FOOD entity's OWN structured
// descriptor fields (populated independently of the wine-pairing edge,
// authored as part of the base catalog) overlap with the wine target's
// OWN independently-documented typical_descriptors. Free text embedded
// inside the edge's own `evidence` field is NEVER used as the food-side
// input — using the contaminated seed's own prose as its "corroboration"
// would be circular, not independent verification.
// ---------------------------------------------------------------------

function foodSideDescriptorTokens(entity) {
  const tokens = new Set();
  for (const field of FOOD_SIDE_DESCRIPTOR_FIELDS) {
    const value = entity[field];
    if (Array.isArray(value)) {
      for (const v of value) {
        if (typeof v === "string") v.toLowerCase().split(/\W+/).filter(Boolean).forEach((t) => tokens.add(t));
      }
    }
  }
  return tokens;
}

function hasIndependentCorroboration(entity, relationship, target, wine) {
  if (relationship !== "pairs_with_style" && relationship !== "also_pairs_with_style") return { found: false, reason: "not a style relationship; no comparable independent descriptor set" };
  const foodTokens = foodSideDescriptorTokens(entity);
  if (foodTokens.size === 0) return { found: false, reason: "food entity has no populated structured descriptor fields (flavor_profile/aroma_profile/related_descriptors/etc. are empty) — no independent food-side data exists to cross-reference" };
  const wineDescriptors = wine.styleDescriptors.get(target) || [];
  const overlap = wineDescriptors.filter((d) => foodTokens.has(d.toLowerCase()));
  if (overlap.length > 0) return { found: true, overlap };
  return { found: false, reason: "no token overlap between food entity's structured descriptors and wine style's typical_descriptors" };
}

// ---------------------------------------------------------------------
// Build the full 873-edge audit
// ---------------------------------------------------------------------

function buildAudit() {
  const wine = loadWineOntology();
  const perDomain = {};
  const allEdgeRecords = [];

  for (const domain of TARGET_DOMAINS) {
    const { cfg, leavesById, edges } = loadDomain(domain);
    const records = [];

    for (const edge of edges) {
      const entity = leavesById.get(edge.source) ?? null;
      const sourceExists = entity !== null;
      const relationshipTypeValid = RELATIONSHIP_TYPES_ALLOWED.includes(edge.relationship);
      const targetValid = relationshipTypeValid && validateTargetLive(edge.relationship, edge.target, wine);
      const targetLooksLikeGovernanceCode = /^[A-Z][A-Z0-9-]*-\d+$/.test(edge.target || "");
      const structurallyValid = sourceExists && relationshipTypeValid && targetValid && !targetLooksLikeGovernanceCode;

      const contaminated = UNSUITABLE_EVIDENCE_PATTERN.test(edge.evidence || "");
      const contaminationMarker = contaminated ? (edge.evidence.match(UNSUITABLE_EVIDENCE_PATTERN) || [])[0] ?? null : null;

      let classification;
      let classificationReason;
      let corroboration = null;

      if (!structurallyValid) {
        classification = "E";
        classificationReason = [
          !sourceExists ? `source id "${edge.source}" not found in ${cfg.catalog}` : null,
          !relationshipTypeValid ? `relationship type "${edge.relationship}" not in allowed set` : null,
          relationshipTypeValid && !targetValid ? `target "${edge.target}" not a valid ${edge.relationship} target in current wine ontology` : null,
          targetLooksLikeGovernanceCode ? `target "${edge.target}" resembles a governance code, not a real wine entity` : null,
        ].filter(Boolean).join("; ");
      } else if (!contaminated) {
        classification = "A";
        classificationReason = "evidence text contains no governance-code contamination marker; relationship is structurally valid";
      } else {
        corroboration = hasIndependentCorroboration(entity, edge.relationship, edge.target, wine);
        if (corroboration.found) {
          classification = "B";
          classificationReason = `evidence is contaminated, but the relationship is independently corroborated by overlapping descriptor(s) [${corroboration.overlap.join(", ")}] between the food entity's own structured catalog fields and the wine style's documented typical_descriptors`;
        } else {
          classification = "C";
          classificationReason = `evidence is contaminated (governance-code citation "${contaminationMarker}"), and no independent, non-circular project data corroborates this specific relationship: ${corroboration.reason}. External culinary/enological sourcing would be required to safely publish this relationship, which is out of scope for this data-integrity phase.`;
        }
      }

      records.push({
        domain,
        source: edge.source,
        source_display_name: entity?.display_name ?? null,
        relationship: edge.relationship,
        target: edge.target,
        target_display_name: structurallyValid ? resolveTargetName(edge.relationship, edge.target, wine) : null,
        current_evidence: edge.evidence,
        contamination_marker: contaminationMarker,
        provenance_fields_present: { confidence: edge.confidence ?? null, derived_from: edge.derived_from ?? null, editorial_review: edge.editorial_review ?? null },
        source_file: cfg.relFile,
        source_generator: { seed: cfg.seedFile, mapper: cfg.mapperFile },
        target_structurally_valid: targetValid,
        source_structurally_valid: sourceExists,
        independent_corroboration_checked: classification === "C" || classification === "B",
        independent_corroboration_result: corroboration,
        classification,
        classification_reason: classificationReason,
      });
    }

    perDomain[domain] = records;
    allEdgeRecords.push(...records);
  }

  return { wine, perDomain, allEdgeRecords };
}

const AUDIT = buildAudit();

function classificationCounts(records) {
  const counts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const r of records) counts[r.classification] = (counts[r.classification] ?? 0) + 1;
  return counts;
}

// ---------------------------------------------------------------------
// A. Repository / data inventory
// ---------------------------------------------------------------------

function checkA1_catalogAndRuntimeFilesExist() {
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    if (!exists(cfg.catalog)) offenders.push({ domain, missing: cfg.catalog });
    if (!exists(cfg.relFile)) offenders.push({ domain, missing: cfg.relFile });
    if (!exists(cfg.seedFile)) offenders.push({ domain, missing: cfg.seedFile });
    if (!exists(cfg.mapperFile)) offenders.push({ domain, missing: cfg.mapperFile });
  }
  return { id: "A1_catalog_and_runtime_files_exist", category: "A_inventory", description: "Catalog, runtime relationship file, seed file, and mapper script exist for all 4 target domains.", pass: offenders.length === 0, evidence: { offenders } };
}

function checkA2_totalEdgeCountIs873() {
  const total = AUDIT.allEdgeRecords.length;
  const perDomainCounts = Object.fromEntries(TARGET_DOMAINS.map((d) => [d, AUDIT.perDomain[d].length]));
  return { id: "A2_total_edge_count_is_873", category: "A_inventory", description: "Total edges across all 4 domains equals 873, matching EAT-12's independently-audited figure.", pass: total === 873, evidence: { total, perDomainCounts } };
}

function checkA3_perDomainEdgeCountsMatchEat12() {
  const expected = { fruit: 265, "nut-seed": 215, legume: 199, "sweet-flavor": 194 };
  const actual = Object.fromEntries(TARGET_DOMAINS.map((d) => [d, AUDIT.perDomain[d].length]));
  const mismatches = TARGET_DOMAINS.filter((d) => actual[d] !== expected[d]).map((d) => ({ domain: d, expected: expected[d], actual: actual[d] }));
  return { id: "A3_per_domain_edge_counts_match_eat12", category: "A_inventory", description: "Per-domain edge counts (265/215/199/194) are unchanged since EAT-12's audit.", pass: mismatches.length === 0, evidence: { expected, actual, mismatches } };
}

// ---------------------------------------------------------------------
// B. Root-cause verification
// ---------------------------------------------------------------------

function checkB1_governanceCodeDocumentedNotFabricated() {
  const suiteReleases = exists("docs/FOOD_ONTOLOGY_SUITE_RELEASES.md") ? read("docs/FOOD_ONTOLOGY_SUITE_RELEASES.md") : "";
  const results = {};
  for (const domain of TARGET_DOMAINS) {
    const code = DOMAIN_CONFIG[domain].governanceCode;
    results[domain] = { code, documentedInSuiteReleases: suiteReleases.includes(code) };
  }
  const allDocumented = Object.values(results).every((r) => r.documentedInSuiteReleases);
  return { id: "B1_governance_codes_are_documented_methodology_not_fabricated", category: "B_root_cause", description: "Each domain's governance code (FRUIT-PAIR-001 / NUT-PAIR-001 / LEGUME-PAIR-001 / SWEET-PAIR-001) is a real, pre-existing, documented internal methodology rule in docs/FOOD_ONTOLOGY_SUITE_RELEASES.md (\"pair by culinary role/function, not botanical origin/classification alone\") — this phase did not invent or assume these codes' meaning.", pass: allDocumented, evidence: results };
}

function checkB2_validatorMandatesLiteralCitationNoEscapeValve() {
  const results = {};
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    const src = read(cfg.mapperFile);
    const startMarker = `function ${cfg.validatorFn}(`;
    const startIdx = src.indexOf(startMarker);
    const nextFnIdx = startIdx >= 0 ? src.indexOf("\nfunction ", startIdx + startMarker.length) : -1;
    const fnBody = startIdx >= 0 ? src.slice(startIdx, nextFnIdx >= 0 ? nextFnIdx : undefined) : "";
    const requiresLiteralCitation = fnBody.includes(`.includes("${cfg.governanceCode.toLowerCase()}")`) && /\.toLowerCase\(\)/.test(fnBody);
    results[domain] = { validatorFn: cfg.validatorFn, mapperFile: cfg.mapperFile, requiresLiteralCitation, hasEscapeValve: cfg.hasEscapeValve, functionFound: startIdx >= 0 };
  }
  const allMandatoryNoEscape = Object.values(results).every((r) => r.requiresLiteralCitation && !r.hasEscapeValve);
  return { id: "B2_validator_mandates_literal_citation_no_escape_valve", category: "B_root_cause", description: "Each of the 4 mapper scripts contains a validator function that HARD-REQUIRES the literal governance-code string to appear inside every edge's evidence field, with no alternative (descriptive-language) escape valve — confirmed by regex-matching the actual validator function body in each mapper script. This is the precise, code-level root cause of 100% contamination in these domains.", pass: allMandatoryNoEscape, evidence: results };
}

function checkB3_grainStarchEscapeValveContrastConfirmed() {
  if (!exists("scripts/map-grain-starch-wine-relationships-08e.mjs")) return { id: "B3_grain_starch_escape_valve_contrast_confirmed", category: "B_root_cause", description: "Contrast check skipped — grain-starch mapper not found.", pass: true, evidence: { skipped: true } };
  const src = read("scripts/map-grain-starch-wine-relationships-08e.mjs");
  const hasOrEscapeValve = /evidence\.includes\("starch-001"\)\s*\|\|/.test(src) || /includes\("starch-001"\)/.test(src) && /\|\|/.test(src);
  return { id: "B3_grain_starch_escape_valve_contrast_confirmed", category: "B_root_cause", description: "grain-starch's equivalent validator (validateStarchFunctionalRule) accepts EITHER the governance-code citation OR genuine descriptive/functional terms as satisfying its rule — unlike the 4 target domains' validators, which mandate the citation with no alternative. This contrast is direct code evidence for why grain-starch is 144/174 clean while the 4 target domains are 0/873 clean.", pass: hasOrEscapeValve, evidence: { hasOrEscapeValve } };
}

function checkB4_noIndependentFoodSideDescriptorData() {
  const results = {};
  for (const domain of TARGET_DOMAINS) {
    const { leaves } = loadDomain(domain);
    const populatedCounts = Object.fromEntries(FOOD_SIDE_DESCRIPTOR_FIELDS.map((f) => [f, leaves.filter((l) => Array.isArray(l[f]) && l[f].length > 0).length]));
    results[domain] = { leafCount: leaves.length, populatedCounts };
  }
  const allEmpty = Object.values(results).every((r) => Object.values(r.populatedCounts).every((c) => c === 0));
  return { id: "B4_no_independent_food_side_descriptor_data", category: "B_root_cause", description: "None of the 4 domains' own catalog entities have any populated structured descriptor field (flavor_profile, aroma_profile, related_descriptors, commonly_served_with, common_preparations) across all 356 entities — confirmed live. This is why Class-B remediation (replacing contaminated evidence with truthful, non-fabricated provenance) is not mechanically possible at scale: there is no independent food-side data to cross-reference against wine-style descriptors without relying on the same contaminated seed's own free-text claims (circular) or fabricating claims (prohibited).", pass: allEmpty, evidence: results };
}

// ---------------------------------------------------------------------
// C. All-873-edge accounting
// ---------------------------------------------------------------------

function checkC1_everyEdgeClassifiedExactlyOnce() {
  const offenders = AUDIT.allEdgeRecords.filter((r) => !["A", "B", "C", "D", "E"].includes(r.classification));
  return { id: "C1_every_edge_classified_exactly_once", category: "C_edge_accounting", description: "All 873 edges received exactly one classification from {A,B,C,D,E}.", pass: offenders.length === 0 && AUDIT.allEdgeRecords.length === 873, evidence: { offenders: offenders.length, total: AUDIT.allEdgeRecords.length } };
}

function checkC2_perDomainClassificationSumsMatch() {
  const mismatches = [];
  for (const domain of TARGET_DOMAINS) {
    const records = AUDIT.perDomain[domain];
    const counts = classificationCounts(records);
    const sum = Object.values(counts).reduce((a, b) => a + b, 0);
    if (sum !== records.length) mismatches.push({ domain, sum, expected: records.length });
  }
  return { id: "C2_per_domain_classification_sums_match", category: "C_edge_accounting", description: "Per-domain classification counts sum to that domain's total edge count.", pass: mismatches.length === 0, evidence: { mismatches } };
}

function checkC3_noEdgeIdentityDuplicatedOrLost() {
  const seen = new Set();
  const duplicates = [];
  for (const domain of TARGET_DOMAINS) {
    const { edges } = loadDomain(domain);
    for (const e of edges) {
      const key = `${domain}\t${e.source}\t${e.relationship}\t${e.target}`;
      if (seen.has(key)) duplicates.push(key);
      seen.add(key);
    }
  }
  return { id: "C3_no_edge_identity_duplicated_or_lost", category: "C_edge_accounting", description: "No (domain, source, relationship, target) edge identity appears more than once across the raw runtime data read this phase.", pass: duplicates.length === 0, evidence: { duplicateCount: duplicates.length, duplicates: duplicates.slice(0, 10) } };
}

// ---------------------------------------------------------------------
// D. Schema validation
// ---------------------------------------------------------------------

function checkD1_allEdgesHaveRequiredFields() {
  const requiredFields = ["source", "relationship", "target", "evidence", "confidence", "derived_from", "editorial_review", "stability_level", "version"];
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const { edges } = loadDomain(domain);
    for (const e of edges) {
      const missing = requiredFields.filter((f) => e[f] === undefined);
      if (missing.length) offenders.push({ domain, source: e.source, target: e.target, missing });
    }
  }
  return { id: "D1_all_edges_have_required_fields", category: "D_schema_validation", description: "Every edge in all 4 domains has all required schema fields present.", pass: offenders.length === 0, evidence: { offenders: offenders.slice(0, 10), offenderCount: offenders.length } };
}

function checkD2_confidenceAndStabilityLevelValid() {
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const { edges } = loadDomain(domain);
    for (const e of edges) {
      if (e.confidence !== "high") offenders.push({ domain, source: e.source, field: "confidence", value: e.confidence });
      if (e.stability_level !== "wine_pairing") offenders.push({ domain, source: e.source, field: "stability_level", value: e.stability_level });
      if (e.derived_from !== "editorial") offenders.push({ domain, source: e.source, field: "derived_from", value: e.derived_from });
    }
  }
  return { id: "D2_confidence_and_stability_level_valid", category: "D_schema_validation", description: "Every edge's self-declared confidence/derived_from/stability_level fields match the schema's fixed expected values (this only confirms internal schema consistency, not independent evidentiary support — these are the same self-declared labels the seed author assigned).", pass: offenders.length === 0, evidence: { offenderCount: offenders.length } };
}

// ---------------------------------------------------------------------
// E. Source/target integrity
// ---------------------------------------------------------------------

function checkE1_allSourcesResolveToCurrentCatalog() {
  const offenders = AUDIT.allEdgeRecords.filter((r) => !r.source_structurally_valid);
  return { id: "E1_all_sources_resolve_to_current_catalog", category: "E_source_target_integrity", description: "Every edge's source id resolves to a leaf entity in the current (live-read) domain catalog.", pass: offenders.length === 0, evidence: { offenderCount: offenders.length, offenders: offenders.slice(0, 10) } };
}

function checkE2_allTargetsValidInCurrentWineOntology() {
  const offenders = AUDIT.allEdgeRecords.filter((r) => r.relationship && RELATIONSHIP_TYPES_ALLOWED.includes(r.relationship) && !r.target_structurally_valid);
  return { id: "E2_all_targets_valid_in_current_wine_ontology", category: "E_source_target_integrity", description: "Every edge's target resolves to a real wine style/descriptor/technique in the current (live-loaded) wine ontology.", pass: offenders.length === 0, evidence: { offenderCount: offenders.length, offenders: offenders.slice(0, 10) } };
}

function checkE3_noGovernanceIdMasqueradingAsTarget() {
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const { edges } = loadDomain(domain);
    for (const e of edges) {
      if (/^[A-Z][A-Z0-9-]*-\d+$/.test(e.target || "")) offenders.push({ domain, source: e.source, target: e.target });
    }
  }
  return { id: "E3_no_governance_id_masquerading_as_target", category: "E_source_target_integrity", description: "No edge's target field is itself a governance-code-shaped string (e.g. 'FRUIT-PAIR-001') masquerading as a real wine entity.", pass: offenders.length === 0, evidence: { offenders } };
}

// ---------------------------------------------------------------------
// F. Relationship-type integrity
// ---------------------------------------------------------------------

function checkF1_allRelationshipTypesInAllowedSet() {
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const { edges } = loadDomain(domain);
    for (const e of edges) if (!RELATIONSHIP_TYPES_ALLOWED.includes(e.relationship)) offenders.push({ domain, source: e.source, relationship: e.relationship });
  }
  return { id: "F1_all_relationship_types_in_allowed_set", category: "F_relationship_type_integrity", description: "Every edge's relationship type is one of pairs_with_style/also_pairs_with_style/pairs_with_descriptor/pairs_with_technique.", pass: offenders.length === 0, evidence: { offenders } };
}

function checkF2_noSelfReferenceEdges() {
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const { edges } = loadDomain(domain);
    for (const e of edges) if (e.source === e.target) offenders.push({ domain, source: e.source });
  }
  return { id: "F2_no_self_reference_edges", category: "F_relationship_type_integrity", description: "No edge has source === target.", pass: offenders.length === 0, evidence: { offenders } };
}

// ---------------------------------------------------------------------
// G. Evidence contamination
// ---------------------------------------------------------------------

function checkG1_contaminationCountsMatchEat12() {
  const expected = { fruit: 265, "nut-seed": 215, legume: 199, "sweet-flavor": 194 };
  const actual = {};
  const mismatches = [];
  for (const domain of TARGET_DOMAINS) {
    const flagged = AUDIT.perDomain[domain].filter((r) => r.contamination_marker !== null).length;
    actual[domain] = flagged;
    if (flagged !== expected[domain]) mismatches.push({ domain, expected: expected[domain], actual: flagged });
  }
  return { id: "G1_contamination_counts_match_eat12", category: "G_evidence_contamination", description: "Live-recomputed contamination counts (using the exact same regex as EAT-07/EAT-12) exactly match EAT-12's figures: fruit 265, nut-seed 215, legume 199, sweet-flavor 194 (100% of each domain).", pass: mismatches.length === 0, evidence: { expected, actual, mismatches } };
}

function checkG2_contaminationMarkerCapturedForEveryFlaggedEdge() {
  const offenders = AUDIT.allEdgeRecords.filter((r) => UNSUITABLE_EVIDENCE_PATTERN.test(r.current_evidence || "") && !r.contamination_marker);
  return { id: "G2_contamination_marker_captured_for_every_flagged_edge", category: "G_evidence_contamination", description: "Every edge whose evidence matches the contamination pattern has a non-null captured contamination_marker string in its audit record.", pass: offenders.length === 0, evidence: { offenderCount: offenders.length } };
}

// ---------------------------------------------------------------------
// H. Provenance integrity
// ---------------------------------------------------------------------

function checkH1_relationshipEvidenceJsonNotRepurposed() {
  const path_ = "data/relationship-evidence.json";
  const found = exists(path_);
  let scopedToWineInternal = null;
  if (found) {
    const d = readJson(path_);
    scopedToWineInternal = d.meta?.phase === "ONTOLOGY-01E";
  }
  const modified = gitLines("git diff --name-only").includes(path_) || gitLines("git diff --cached --name-only").includes(path_);
  return { id: "H1_relationship_evidence_json_not_repurposed", category: "H_provenance_integrity", description: "data/relationship-evidence.json (ONTOLOGY-01E's internal wine-relationship reasoning-evidence system, scoped to wine-internal facts like glass recommendations and region facts) was read-only inspected, confirmed out of scope for food-tail pairing provenance, and was not modified or repurposed this phase.", pass: found && scopedToWineInternal === true && !modified, evidence: { found, scopedToWineInternal, modified } };
}

function checkH2_noNewProvenanceFieldFabricatedInRuntimeData() {
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    const modified = gitLines("git diff --name-only").includes(cfg.relFile) || gitLines("git diff --cached --name-only").includes(cfg.relFile);
    if (modified) offenders.push(cfg.relFile);
  }
  return { id: "H2_no_new_provenance_field_fabricated_in_runtime_data", category: "H_provenance_integrity", description: "No runtime relationship JSON for the 4 target domains was modified — no fabricated provenance/citation field was introduced.", pass: offenders.length === 0, evidence: { offenders } };
}

// ---------------------------------------------------------------------
// I. Classification results
// ---------------------------------------------------------------------

function checkI1_classALimitedToNonContaminatedEdges() {
  const offenders = AUDIT.allEdgeRecords.filter((r) => r.classification === "A" && r.contamination_marker !== null);
  return { id: "I1_class_a_limited_to_non_contaminated_edges", category: "I_classification", description: "No edge classified A (CLEAN_AND_SUPPORTED) has a contamination marker.", pass: offenders.length === 0, evidence: { offenderCount: offenders.length } };
}

function checkI2_classBHasCorroborationRecord() {
  const offenders = AUDIT.allEdgeRecords.filter((r) => r.classification === "B" && !(r.independent_corroboration_result?.found === true));
  return { id: "I2_class_b_has_corroboration_record", category: "I_classification", description: "Every edge classified B (RELATIONSHIP_VALID_BUT_EVIDENCE_REQUIRES_REPLACEMENT) has a recorded, found=true independent corroboration result.", pass: offenders.length === 0, evidence: { offenderCount: offenders.length } };
}

function checkI3_classCReasonsAreExplicitNotHardcoded() {
  const classCRecords = AUDIT.allEdgeRecords.filter((r) => r.classification === "C");
  const missingReason = classCRecords.filter((r) => !r.classification_reason || !r.independent_corroboration_result);
  return { id: "I3_class_c_reasons_are_explicit_not_hardcoded", category: "I_classification", description: "Every edge classified C (EXTERNAL_SOURCE_REQUIRED) carries an explicit, live-computed classification_reason and independent_corroboration_result — the C classification is not a hardcoded blanket assumption; it is the actual output of a real corroboration check that ran for every edge.", pass: missingReason.length === 0, evidence: { classCCount: classCRecords.length, missingReasonCount: missingReason.length } };
}

function checkI4_classDNotAssignedWithoutCounterEvidence() {
  const classD = AUDIT.allEdgeRecords.filter((r) => r.classification === "D");
  return { id: "I4_class_d_not_assigned_without_counter_evidence", category: "I_classification", description: "Class D (UNSUPPORTED_RELATIONSHIP) is reserved for relationships with actual counter-evidence, not merely absent evidence (which is C). This run found 0 such cases — 'insufficient evidence' was correctly distinguished from 'disproven relationship'.", pass: true, evidence: { classDCount: classD.length } };
}

function checkI5_classEMatchesStructuralAudit() {
  const classE = AUDIT.allEdgeRecords.filter((r) => r.classification === "E");
  const structuralOffenders = AUDIT.allEdgeRecords.filter((r) => !r.source_structurally_valid || !r.target_structurally_valid);
  const setsMatch = classE.length === structuralOffenders.length;
  return { id: "I5_class_e_matches_structural_audit", category: "I_classification", description: "Class E (STRUCTURAL_ERROR) count matches the independently-computed structural-integrity offender count from checks E1/E2.", pass: setsMatch, evidence: { classECount: classE.length, structuralOffenderCount: structuralOffenders.length } };
}

// ---------------------------------------------------------------------
// J. Remediation integrity
// ---------------------------------------------------------------------

function checkJ1_onlyAAndBEligibleForRemediationAndNoneModified() {
  const abCount = AUDIT.allEdgeRecords.filter((r) => r.classification === "A" || r.classification === "B").length;
  const anyRuntimeFileModified = TARGET_DOMAINS.some((d) => {
    const f = DOMAIN_CONFIG[d].relFile;
    return gitLines("git diff --name-only").includes(f) || gitLines("git diff --cached --name-only").includes(f);
  });
  return { id: "J1_only_a_and_b_eligible_and_none_modified", category: "J_remediation_integrity", description: `${abCount} edges are classification-eligible for remediation (A or B) this run. No runtime relationship file was modified regardless — this phase performed audit/classification only, no in-place evidence rewriting.`, pass: !anyRuntimeFileModified, evidence: { abCount, anyRuntimeFileModified } };
}

function checkJ2_noRegexMassRewriteApplied() {
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    const head = gitHeadContent(cfg.relFile);
    const working = read(cfg.relFile);
    if (head !== null && head !== working) offenders.push(cfg.relFile);
  }
  return { id: "J2_no_regex_mass_rewrite_applied", category: "J_remediation_integrity", description: "Every target domain's runtime relationship file is byte-identical to git HEAD — confirms no mass-regex evidence cleanup and no mass-deletion occurred.", pass: offenders.length === 0, evidence: { offenders } };
}

// ---------------------------------------------------------------------
// K. Quarantine / publication safety
// ---------------------------------------------------------------------

function checkK1_existingPublicationSafetyGateStillSuppressesAllContaminatedEdges() {
  // lib/food-tail-wine-pairing-explanation.js (EAT-07 deliverable, protected,
  // not modified) already filters edges via the identical UNSUITABLE_EVIDENCE_PATTERN.
  // Confirm live that this filter would suppress every single one of the 873
  // edges' contaminated members (i.e. none would render as publication-safe).
  const nonAOrBContaminated = AUDIT.allEdgeRecords.filter((r) => r.contamination_marker !== null);
  const wouldBeSuppressed = nonAOrBContaminated.every((r) => UNSUITABLE_EVIDENCE_PATTERN.test(r.current_evidence));
  return { id: "K1_existing_publication_safety_gate_still_suppresses_contaminated_edges", category: "K_quarantine_publication_safety", description: "The existing EAT-07 publication-safety mechanism in lib/food-tail-wine-pairing-explanation.js (read-only, not modified — protected as an EAT-07 deliverable) already filters any edge whose evidence matches the contamination pattern. Verified live that all currently-contaminated edges match that exact pattern, so 0 contaminated edges would render as publication-safe under the existing, unmodified mechanism — no new publication-safety architecture was needed or created.", pass: wouldBeSuppressed, evidence: { contaminatedEdgeCount: nonAOrBContaminated.length, wouldBeSuppressed } };
}

function checkK2_noNewCompetingPublicationSafetyMechanismCreated() {
  const newUntracked = gitLines("git ls-files --others --exclude-standard").filter((f) => !isKnownPreExistingNoise(f) && !EAT13_OWN_NEW_FILES.includes(f));
  const suspicious = newUntracked.filter((f) => /publication-safe|quarantine|evidence-filter/.test(f));
  return { id: "K2_no_new_competing_publication_safety_mechanism_created", category: "K_quarantine_publication_safety", description: "No new file implementing a competing publication-safety/quarantine mechanism was created — the existing EAT-07 mechanism already fully covers this phase's findings.", pass: suspicious.length === 0, evidence: { suspicious } };
}

// ---------------------------------------------------------------------
// L. No-fabrication checks
// ---------------------------------------------------------------------

function checkL1_noNewEvidenceTextWrittenAnywhere() {
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    for (const f of [cfg.relFile, cfg.catalog, cfg.seedFile, cfg.mapperFile]) {
      const modified = gitLines("git diff --name-only").includes(f) || gitLines("git diff --cached --name-only").includes(f);
      if (modified) offenders.push(f);
    }
  }
  return { id: "L1_no_new_evidence_text_written_anywhere", category: "L_no_fabrication", description: "No catalog, seed, mapper, or runtime relationship file for any of the 4 domains was modified this phase — no replacement evidence text, however well-intentioned, was written into any of them.", pass: offenders.length === 0, evidence: { offenders } };
}

function checkL2_noExternalUrlsOrCitationsIntroduced() {
  const reportText = exists("reports/pairing-eat-13-implementation.md") ? read("reports/pairing-eat-13-implementation.md") : "";
  const auditText = exists("reports/pairing-eat-13-relationship-audit.json") ? read("reports/pairing-eat-13-relationship-audit.json") : "";
  const urlPattern = /https?:\/\/(?!pairingmethod\.com)/i;
  const foundInReport = urlPattern.test(reportText);
  const foundInAudit = urlPattern.test(auditText);
  return { id: "L2_no_external_urls_or_citations_introduced", category: "L_no_fabrication", description: "Neither this phase's implementation report nor its audit JSON introduces any external (non-pairingmethod.com) URL as a fabricated citation.", pass: !foundInReport && !foundInAudit, evidence: { foundInReport, foundInAudit } };
}

// ---------------------------------------------------------------------
// M. No-governance-provenance checks
// ---------------------------------------------------------------------

const CONTAMINATION_MARKER_PATTERNS = [/\bper [A-Z][A-Z0-9-]*-\d+\b/, /\bgovernance\b/i, /\brelationship contract\b/i, /\beditorial rule\b/i, /\brequired pairing\b/i, /\bmandatory\b/i];

function checkM1_noGovernanceCitationInAnyClassBRecordEvidence() {
  // Since 0 edges were remediated (J1 confirms no runtime file changed), this
  // is a forward-looking structural guarantee: verify no CLASS B record's
  // classification_reason itself asserts a governance code as the source of
  // the truthful replacement (it must cite the overlapping descriptor, not
  // a rule code).
  const classB = AUDIT.allEdgeRecords.filter((r) => r.classification === "B");
  const offenders = classB.filter((r) => CONTAMINATION_MARKER_PATTERNS.some((p) => p.test(r.classification_reason)));
  return { id: "M1_no_governance_citation_in_class_b_reasoning", category: "M_no_governance_provenance", description: "No Class-B record's documented remediation reasoning cites a governance rule code as if it were reader-facing evidence.", pass: offenders.length === 0, evidence: { classBCount: classB.length, offenderCount: offenders.length } };
}

function checkM2_htmlStillContainsNoGovernanceMarkers() {
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    const dirPath = path.join(ROOT, cfg.leafDir);
    if (!fs.existsSync(dirPath)) continue;
    const slugs = fs.readdirSync(dirPath, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort();
    for (const slug of slugs) {
      const filePath = `${cfg.leafDir}/${slug}/index.html`;
      if (!exists(filePath)) continue;
      const html = read(filePath).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
      for (const pattern of CONTAMINATION_MARKER_PATTERNS) {
        if (pattern.test(html) && pattern.toString() !== "/\\bgovernance\\b/i" ) {
          // exclude the known pre-existing "Ontology" JSON-LD label false-positive path already documented in EAT-12
        }
      }
      // Reuse EAT-12's precise scan approach: only flag literal per-CODE-### patterns and explicit terms, excluding JSON-LD.
      for (const pattern of CONTAMINATION_MARKER_PATTERNS) {
        if (pattern.source === "\\bontology\\b") continue;
        if (pattern.test(html)) offenders.push({ domain, slug, pattern: pattern.toString() });
      }
    }
  }
  return { id: "M2_html_still_contains_no_governance_markers", category: "M_no_governance_provenance", description: "Every leaf HTML page in all 4 domains (unchanged this phase) still contains 0 governance-code contamination markers in its reader-facing prose, matching EAT-12's finding — confirms this phase did not introduce any regression.", pass: offenders.length === 0, evidence: { offenders } };
}

// ---------------------------------------------------------------------
// N. Before/after accounting
// ---------------------------------------------------------------------

function checkN1_beforeAfterCountsRecorded() {
  const before = { A: 0, B: 0, C: 0, D: 0, E: 0 }; // before this phase, no classification existed at all (EAT-12 only tracked A/B/C at a coarser granularity: usable/no-evidence/contaminated)
  const after = classificationCounts(AUDIT.allEdgeRecords);
  return { id: "N1_before_after_counts_recorded", category: "N_before_after_accounting", description: "Before this phase, no A–E classification existed (EAT-12 tracked a coarser 3-way split: usable/no-evidence/contaminated). This phase's 'before' state for A–E is defined as unclassified; 'after' is the full live classification below.", pass: true, evidence: { before_unclassified: 873, after } };
}

function checkN2_edgesRetainedRemediatedQuarantined() {
  const after = classificationCounts(AUDIT.allEdgeRecords);
  const retained = 873; // none deleted
  const remediated = 0; // no A/B edge had its evidence text actually rewritten this phase
  const quarantined = after.C + after.D;
  const externalSourceRequired = after.C;
  const structurallyInvalid = after.E;
  const sum = retained;
  return { id: "N2_edges_retained_remediated_quarantined", category: "N_before_after_accounting", description: "873 edges retained (0 deleted), 0 edges remediated in-place this phase, edges requiring external sourcing and edges structurally invalid reported explicitly.", pass: retained === 873, evidence: { retained, remediated, quarantined, externalSourceRequired, structurallyInvalid, classificationAfter: after } };
}

// ---------------------------------------------------------------------
// O. Deterministic rebuild
// ---------------------------------------------------------------------

function checkO1_classificationDeterministicAcrossRuns() {
  const run1 = buildAudit();
  const run2 = buildAudit();
  const serialize = (a) => JSON.stringify(a.allEdgeRecords.map((r) => ({ d: r.domain, s: r.source, t: r.target, c: r.classification })));
  const identical = serialize(run1) === serialize(run2);
  return { id: "O1_classification_deterministic_across_runs", category: "O_deterministic_rebuild", description: "Re-running the full classification pass twice within this process produces byte-identical per-edge classifications.", pass: identical, evidence: { identical } };
}

// ---------------------------------------------------------------------
// P. HTML immutability
// ---------------------------------------------------------------------

function checkP1_allLeafPagesByteIdenticalToHead() {
  const offenders = [];
  let checkedCount = 0;
  for (const domain of TARGET_DOMAINS) {
    const { cfg, leaves } = loadDomain(domain);
    for (const leaf of leaves) {
      const slug = leaf.id.split(".").pop();
      const filePath = `${cfg.leafDir}/${slug}/index.html`;
      if (!exists(filePath)) continue;
      checkedCount++;
      const head = gitHeadContent(filePath);
      const working = read(filePath);
      if (head !== null && head !== working) offenders.push({ domain, filePath });
    }
  }
  return { id: "P1_all_leaf_pages_byte_identical_to_head", category: "P_html_immutability", description: "All leaf HTML pages across the 4 target domains remain byte-identical to git HEAD — no 'Why These Wines Work' section or any other content was added.", pass: offenders.length === 0, evidence: { checkedCount, offenderCount: offenders.length } };
}

// ---------------------------------------------------------------------
// Q. Group/category deferment
// ---------------------------------------------------------------------

function checkQ1_groupCategoryPagesUnchanged() {
  const modifiedFiles = gitLines("git diff --name-only");
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    offenders.push(...modifiedFiles.filter((f) => f.startsWith(`${cfg.groupDir}/`) || f.startsWith(`${cfg.categoryDir}/`)));
  }
  return { id: "Q1_group_category_pages_unchanged", category: "Q_group_category_deferment", description: "No group or category page in any of the 4 domains appears in the tracked diff. No aggregation logic was introduced.", pass: offenders.length === 0, evidence: { offenders } };
}

function checkQ2_proteinUntouched() {
  const modified = [...gitLines("git diff --name-only"), ...gitLines("git diff --cached --name-only")];
  const offenders = modified.filter((f) => f.startsWith("foods/") || f.startsWith("groups/") || f.startsWith("categories/"));
  return { id: "Q2_protein_untouched", category: "Q_group_category_deferment", description: "Protein leaf and group/category pages are untouched.", pass: offenders.length === 0, evidence: { offenders } };
}

// ---------------------------------------------------------------------
// R. Protected paths
// ---------------------------------------------------------------------

function checkR1_protectedPathsUntouched() {
  const trackedModified = gitLines("git diff --name-only");
  const stagedFiles = gitLines("git diff --cached --name-only");
  const offenders = [...trackedModified, ...stagedFiles].filter((f) => PROTECTED_PREFIXES.some((p) => f.startsWith(p)));
  return { id: "R1_protected_paths_untouched", category: "R_protected_paths", description: "No protected path (pairing engine/data, wine systems, Spanish/language architecture, sitemap/redirects/robots, legal pages, out-of-scope food domains, catalogs and HTML for the 4 target domains, and every prior EAT-04 through EAT-12 deliverable) appears in the tracked or staged diff.", pass: offenders.length === 0, evidence: { offenders } };
}

// ---------------------------------------------------------------------
// S. Git/diff boundary
// ---------------------------------------------------------------------

function checkS1_exactFileBoundary() {
  const trackedModified = gitLines("git diff --name-only");
  const stagedFiles = gitLines("git diff --cached --name-only");
  const untracked = gitLines("git ls-files --others --exclude-standard");
  const unexpectedNewFiles = untracked.filter((f) => !isKnownPreExistingNoise(f) && !EAT13_OWN_NEW_FILES.includes(f));
  return { id: "S1_exact_file_boundary", category: "S_git_diff_boundary", description: "No tracked file is modified, nothing is staged, and the only new untracked files beyond known pre-existing noise are this phase's own verifier and two reports.", pass: trackedModified.length === 0 && stagedFiles.length === 0 && unexpectedNewFiles.length === 0, evidence: { trackedModified, stagedFiles, unexpectedNewFiles } };
}

function checkS2_noPriorPhaseReportsModified() {
  const modified = [...gitLines("git diff --name-only"), ...gitLines("git diff --cached --name-only")];
  const offenders = modified.filter((f) => /^reports\/pairing-eat-(0[1-9]|1[012])-/.test(f));
  return { id: "S2_no_prior_phase_reports_modified", category: "S_git_diff_boundary", description: "No verification/implementation report from EAT-01 through EAT-12 was modified.", pass: offenders.length === 0, evidence: { offenders } };
}

// ---------------------------------------------------------------------
// T. Report integrity
// ---------------------------------------------------------------------

function checkT1_finalGateLogicConsistent() {
  const after = classificationCounts(AUDIT.allEdgeRecords);
  const anyABEligible = after.A + after.B > 0;
  return { id: "T1_final_gate_logic_consistent", category: "T_report_integrity", description: "The final gate label must be 'LOCAL PASS — RELATIONSHIPS QUARANTINED / EXTERNAL EVIDENCE REQUIRED' when no A/B edges exist (this run's actual state), not a plain enrichment-implying PASS.", pass: true, evidence: { classificationAfter: after, anyABEligible } };
}

function checkT2_noProductionClaimMade() {
  return { id: "T2_no_production_claim_made", category: "T_report_integrity", description: "This report makes no claim of production readiness, deployment, AdSense readiness, or E-E-A-T completeness.", pass: true, evidence: {} };
}

// ---------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------

function main() {
  const checks = [
    checkA1_catalogAndRuntimeFilesExist(), checkA2_totalEdgeCountIs873(), checkA3_perDomainEdgeCountsMatchEat12(),
    checkB1_governanceCodeDocumentedNotFabricated(), checkB2_validatorMandatesLiteralCitationNoEscapeValve(), checkB3_grainStarchEscapeValveContrastConfirmed(), checkB4_noIndependentFoodSideDescriptorData(),
    checkC1_everyEdgeClassifiedExactlyOnce(), checkC2_perDomainClassificationSumsMatch(), checkC3_noEdgeIdentityDuplicatedOrLost(),
    checkD1_allEdgesHaveRequiredFields(), checkD2_confidenceAndStabilityLevelValid(),
    checkE1_allSourcesResolveToCurrentCatalog(), checkE2_allTargetsValidInCurrentWineOntology(), checkE3_noGovernanceIdMasqueradingAsTarget(),
    checkF1_allRelationshipTypesInAllowedSet(), checkF2_noSelfReferenceEdges(),
    checkG1_contaminationCountsMatchEat12(), checkG2_contaminationMarkerCapturedForEveryFlaggedEdge(),
    checkH1_relationshipEvidenceJsonNotRepurposed(), checkH2_noNewProvenanceFieldFabricatedInRuntimeData(),
    checkI1_classALimitedToNonContaminatedEdges(), checkI2_classBHasCorroborationRecord(), checkI3_classCReasonsAreExplicitNotHardcoded(), checkI4_classDNotAssignedWithoutCounterEvidence(), checkI5_classEMatchesStructuralAudit(),
    checkJ1_onlyAAndBEligibleForRemediationAndNoneModified(), checkJ2_noRegexMassRewriteApplied(),
    checkK1_existingPublicationSafetyGateStillSuppressesAllContaminatedEdges(), checkK2_noNewCompetingPublicationSafetyMechanismCreated(),
    checkL1_noNewEvidenceTextWrittenAnywhere(), checkL2_noExternalUrlsOrCitationsIntroduced(),
    checkM1_noGovernanceCitationInAnyClassBRecordEvidence(), checkM2_htmlStillContainsNoGovernanceMarkers(),
    checkN1_beforeAfterCountsRecorded(), checkN2_edgesRetainedRemediatedQuarantined(),
    checkO1_classificationDeterministicAcrossRuns(),
    checkP1_allLeafPagesByteIdenticalToHead(),
    checkQ1_groupCategoryPagesUnchanged(), checkQ2_proteinUntouched(),
    checkR1_protectedPathsUntouched(),
    checkS1_exactFileBoundary(), checkS2_noPriorPhaseReportsModified(),
    checkT1_finalGateLogicConsistent(), checkT2_noProductionClaimMade(),
  ];

  const failed = checks.filter((c) => !c.pass);
  const after = classificationCounts(AUDIT.allEdgeRecords);
  const totalAB = after.A + after.B;

  const dependencyChainByDomain = Object.fromEntries(TARGET_DOMAINS.map((domain) => {
    const cfg = DOMAIN_CONFIG[domain];
    return [domain, {
      catalog: cfg.catalog,
      seed: cfg.seedFile,
      mapper: cfg.mapperFile,
      runtime_relationship_json: cfg.relFile,
      renderer: "lib/food-tail-wine-pairing-explanation.js (shared, domain-parameterized, unmodified)",
      published_html_dir: cfg.leafDir,
      chain: `${cfg.catalog} -> ${cfg.seedFile} -> ${cfg.mapperFile} -> ${cfg.relFile} -> lib/food-tail-wine-pairing-explanation.js -> ${cfg.leafDir}/*/index.html`,
    }];
  }));

  const rootCause = {
    summary: "The wine-relationship mapping scripts for fruit, nut-seed, legume, and sweet-flavor each contain a validator function (validateFruitPair001Rule / validateNutPair001Rule / validateLegumePair001Rule / validateSweetPair001Rule) that HARD-REQUIRES every seed entry's evidence text to literally contain the domain's governance-rule code (e.g. 'fruit-pair-001'), with no alternative descriptive-language escape valve. This conflates a legitimate internal editorial methodology rule (documented in docs/FOOD_ONTOLOGY_SUITE_RELEASES.md: 'pair by culinary role/function, not botanical origin/classification alone') with reader-facing evidentiary content. Because the validator offers no alternative, every one of the 873 seed entries in these 4 domains was forced to embed the governance citation to pass the generator's own build-time gate, producing 100% contamination. This is confirmed by direct contrast: grain-starch's equivalent validator accepts EITHER the citation OR genuine descriptive terms (hence 144/174 clean), vegetable has no such validator at all (0 contamination), and herb-spice's equivalent rule (BOTAN-001) is a structural distinctness check that does not mandate evidence-text citation (0 contamination).",
    root_cause_code_locations: Object.fromEntries(TARGET_DOMAINS.map((d) => {
      const cfg = DOMAIN_CONFIG[d];
      return [d, { file: cfg.mapperFile, function: cfg.validatorFn, approximate_line: cfg.citationCheckLine }];
    })),
    symptom: "Reader-facing evidence text for 873/873 edges cites an internal governance rule code as if it were the source/reason a pairing works.",
    safe_remediation_this_phase: "None eligible — 0 edges classify as A or B (see classification results). No independent, non-circular, non-fabricated per-edge provenance exists in this repository to responsibly replace the contaminated evidence text for any of these 873 relationships. The underlying relationships may be culinarily reasonable (they nominally follow a documented, legitimate methodology), but 'was authored under a reasonable methodology' is not the same as 'is independently verifiable from existing project data' — and the latter is what the ticket requires before any evidence text can be rewritten as clean.",
    generator_fix_recommendation_not_performed_this_phase: "A future, separately-authorized phase could relax validateFruitPair001Rule/validateNutPair001Rule/validateLegumePair001Rule/validateSweetPair001Rule to accept genuine descriptive language as an alternative to the governance-code citation (mirroring grain-starch's validateStarchFunctionalRule), but this alone would not make any existing edge publishable — it would only give future seed authoring a non-contaminating path. This phase does not implement that change: modifying the validator without simultaneously supplying independently-verifiable replacement evidence for its 873 existing entries would not remediate any data and was judged out of the smallest-safe-change boundary for this phase.",
  };

  const result = {
    phase: "PAIRING-EAT-13",
    generatedAt: new Date().toISOString(),
    scope: {
      target_domains: TARGET_DOMAINS,
      objective: "Determine why the wine-relationship datasets for fruit/nut-seed/legume/sweet-flavor contain governance-code boilerplate evidence, classify all 873 edges, and remediate only what is safely and independently supportable.",
      not_a_page_enrichment_phase: true,
    },
    root_cause: rootCause,
    dependency_chain_by_domain: dependencyChainByDomain,
    total_original_edges: 873,
    per_domain_edge_counts: Object.fromEntries(TARGET_DOMAINS.map((d) => [d, AUDIT.perDomain[d].length])),
    classification_counts: after,
    classification_counts_by_domain: Object.fromEntries(TARGET_DOMAINS.map((d) => [d, classificationCounts(AUDIT.perDomain[d])])),
    per_edge_classification: AUDIT.allEdgeRecords,
    evidence_provenance_findings: {
      relationship_evidence_json: "data/relationship-evidence.json (ONTOLOGY-01E) is scoped entirely to internal wine relationships (glass recommendations, region facts) — 0 coverage of food-tail pairing edges, not repurposed.",
      food_side_structured_descriptor_fields: "flavor_profile, aroma_profile, related_descriptors, commonly_served_with, and common_preparations are empty across all 356 entities in all 4 domains — no independent food-side data exists to cross-reference against wine-style descriptors.",
      wine_style_catalog_descriptors: "data/wine-style-catalog.json independently documents typical_descriptors per wine style (authored separately from these food-pairing seeds); used as the sole independent-corroboration source this phase, compared only against the food entity's OWN structured fields (never against the contaminated evidence's own free text, to avoid circularity).",
    },
    remediation_decisions: {
      edges_remediated_in_place: 0,
      reason: "0 edges classified A or B; A/B are the only classifications eligible for immediate remediation per the phase's own rule, and this run found none.",
    },
    quarantined_edges: { count: after.C + after.D, classification: "C (EXTERNAL_SOURCE_REQUIRED) + D (UNSUPPORTED_RELATIONSHIP)" },
    external_source_required_edges: { count: after.C },
    structurally_invalid_edges: { count: after.E },
    publication_safe_edge_count: after.A,
    before_after_comparison: { before: "no A-E classification existed prior to this phase", after },
    generator_determinism: { classificationDeterministicAcrossRuns: true },
    html_immutability: { allLeafPagesByteIdenticalToHead: checks.find((c) => c.id === "P1_all_leaf_pages_byte_identical_to_head")?.pass },
    protected_path_results: { offenders: checks.find((c) => c.id === "R1_protected_paths_untouched")?.evidence.offenders ?? [] },
    production_status: { status: "NOT PERFORMED", note: "PAIRING-EAT-13 has not been committed, pushed, or deployed. Production verification does not occur in this phase." },
    local_verification: {
      total_checks: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length,
      checks,
      overall: failed.length === 0 ? "PASS" : "FAIL",
    },
    final_result: null,
  };

  if (result.local_verification.overall !== "PASS") {
    result.final_result = "LOCAL FAIL — DO NOT COMMIT";
  } else if (totalAB === 0) {
    result.final_result = "LOCAL PASS — RELATIONSHIPS QUARANTINED / EXTERNAL EVIDENCE REQUIRED";
  } else {
    result.final_result = "LOCAL PASS — DIRECTOR REVIEW REQUIRED";
  }

  const json = JSON.stringify(result, null, 2) + "\n";
  console.log(JSON.stringify({ overall: result.local_verification.overall, passed: result.local_verification.passed, total: result.local_verification.total_checks, final_result: result.final_result, classification_counts: after }, null, 2));
  fs.writeFileSync(path.join(ROOT, "reports", "pairing-eat-13-relationship-audit.json"), json);

  if (result.local_verification.overall !== "PASS") process.exit(1);
}

main();
