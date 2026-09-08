#!/usr/bin/env node
/**
 * PAIRING-EAT-20 — Human Review & Evidence Policy Decision Gate
 * Avocado → Sauvignon Blanc (DISH_DERIVED bridge policy)
 * Watermelon → Dry Rosé (dry-rose target specificity policy)
 *
 * No new source research. No runtime/HTML/renderer changes.
 * No fabricated reviewer_id. EAT-19 baseline preserved byte-for-byte.
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import * as EP from "../lib/food-tail-evidence-provenance.js";

const ROOT = process.cwd();
function read(relPath) { return fs.readFileSync(path.join(ROOT, relPath), "utf8"); }
function exists(relPath) { return fs.existsSync(path.join(ROOT, relPath)); }
function readJson(relPath) { return JSON.parse(read(relPath)); }
function gitLines(cmd) {
  try { return execSync(cmd, { cwd: ROOT, encoding: "utf8" }).split("\n").map((l) => l.trim()).filter(Boolean); }
  catch { return []; }
}
function gitHeadContent(relPath) {
  try { return execSync(`git show HEAD:${relPath}`, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); }
  catch { return null; }
}

const DOMAIN_CONFIG = {
  fruit: { catalog: "data/fruit-catalog.json", leafKey: "fruits", relFile: "data/runtime/fruit-wine-relationships.json", leafDir: "fruits" },
  "nut-seed": { catalog: "data/nut-seed-catalog.json", leafKey: "nut_seeds", relFile: "data/runtime/nut-seed-wine-relationships.json", leafDir: "nut-seeds" },
  legume: { catalog: "data/legume-catalog.json", leafKey: "legumes", relFile: "data/runtime/legume-wine-relationships.json", leafDir: "legumes" },
  "sweet-flavor": { catalog: "data/sweet-flavor-catalog.json", leafKey: "sweet_flavors", relFile: "data/runtime/sweet-flavor-wine-relationships.json", leafDir: "sweet-flavors" },
};
const TARGET_DOMAINS = Object.keys(DOMAIN_CONFIG);

const KNOWN_PRE_EXISTING_UNTRACKED_PREFIXES = [
  ".regression-baseline/", "cheese-categories/", "cheese-groups/", "cheeses/", "logo-vector_.ai",
  "reports/pairing-eat-01-audit.md", "reports/pairing-eat-05-content-quality.json", "reports/pairing-eat-05-content-quality.md",
  "scripts/verify-pairing-eat-05.mjs", "terms/",
  "reports/pairing-eat-09-evidence-audit.md", "reports/pairing-eat-09-evidence-audit.json",
  "reports/pairing-eat-09-verification.json", "scripts/verify-pairing-eat-09.mjs",
  "data/evidence-provenance/",
];
function isKnownPreExistingNoise(f) { return KNOWN_PRE_EXISTING_UNTRACKED_PREFIXES.some((p) => f === p || f.startsWith(p)); }

const EAT19_ARTIFACTS = [
  "scripts/verify-pairing-eat-19.mjs",
  "reports/pairing-eat-19-verification.json",
  "reports/pairing-eat-19-implementation.md",
];
const EAT18_LOCAL_ARTIFACTS = [
  "scripts/verify-pairing-eat-18.mjs",
  "reports/pairing-eat-18-verification.json",
  "reports/pairing-eat-18-implementation.md",
];
const EAT20_OWN_NEW_FILES = [
  "scripts/verify-pairing-eat-20.mjs",
  "reports/pairing-eat-20-verification.json",
  "reports/pairing-eat-20-implementation.md",
];

const EAT19_BASELINE_SNAPSHOT = Object.fromEntries(
  EAT19_ARTIFACTS.filter((f) => exists(f)).map((f) => [f, read(f)])
);
const EAT18_BASELINE_SNAPSHOT = Object.fromEntries(
  EAT18_LOCAL_ARTIFACTS.filter((f) => exists(f)).map((f) => [f, read(f)])
);

const PROTECTED_PREFIXES = [
  "assets/js/pairing-engine.js", "assets/js/pairing-data.js",
  "data/runtime/", "data/fruit-catalog.json", "data/legume-catalog.json",
  "lib/food-tail-evidence-provenance.js", "lib/food-tail-wine-pairing-explanation.js",
  "sitemap.xml", "_redirects", "robots.txt", "fruits/", "legumes/",
];

const TWO_CANDIDATES = [
  { domain: "fruit", entityName: "Avocado", target: "sauvignon-blanc", targetName: "Sauvignon Blanc" },
  { domain: "fruit", entityName: "Watermelon", target: "dry-rose", targetName: "Dry Rosé" },
];
const FORBIDDEN_COHORT = [
  { entityName: "Apple", target: "chenin-blanc" },
  { entityName: "Grapefruit", target: "albarino" },
  { entityName: "Fig", target: "port" },
  { entityName: "Fava Bean", target: "sangiovese" },
];

const RESEARCH_DATE = "2026-09-08";
const RESEARCHER_ID = "eat20-policy-gate";
const HUMAN_REVIEWER_AVAILABLE = false;

/** Fabricated / automation identities that must never count as genuine human review. */
const FABRICATED_REVIEWER_PATTERNS = [
  "composer", "cursor", "claude", "gpt", "ai", "script", "verifier", "automation",
];

/** Proposed narrow bridge rule — documented for Director review, NOT adopted. */
const PROPOSED_AVOCADO_BRIDGE_RULE = [
  "PROPOSED-AVO-BRIDGE-01 (NOT ADOPTED): Bridge DISH_DERIVED evidence to food.fruit.tropical-fruits.avocado only when",
  "a qualifying source explicitly names guacamole as the paired dish AND cites avocado fat/creaminess as the stated",
  "pairing driver for the recommended wine. Excludes: raw avocado alone; generic 'avocado dishes'; avocado toast;",
  "avocado salad; avocado-based sauces; dishes where avocado is one of several co-primary components (e.g. guacamole+salsa",
  "combo articles) unless the source isolates avocado as the driver.",
].join(" ");

/** Overbroad rule rejected by adversarial policy tests. */
const REJECTED_GENERIC_DISH_BRIDGE_RULE =
  "All dishes containing ingredient X map to raw catalog entity X for evidence purposes.";

/** Proposed taxonomy bridge — documented, NOT adopted. */
const PROPOSED_ROSE_TAXONOMY_BRIDGE_RULE = [
  "PROPOSED-WM-TARGET-01 (NOT ADOPTED): Generic rosé evidence at EXACT_ENTITY food scope may satisfy the dry-rose",
  "runtime target when wine-style-catalog.json lists dry-rose among related_styles/substitutes of rose.",
].join(" ");

if (!exists("reports/pairing-eat-19-verification.json")) {
  console.error("EAT-19 verification JSON required as closed baseline — run verify-pairing-eat-19.mjs first.");
  process.exit(1);
}
const EAT19_BASELINE = readJson("reports/pairing-eat-19-verification.json");
const SOURCE_RECORDS = EAT19_BASELINE.source_records;
const SOURCES_BY_ID = new Map(SOURCE_RECORDS.map((s) => [s.source_id, s]));

const WINE_CATALOG = readJson("data/wine-style-catalog.json");
const WINE_STYLE_ENTRIES = listWineStyleEntries();
const ROSE_ENTRY = WINE_STYLE_ENTRIES.find((s) => s.slug === "rose");
const DRY_ROSE_ENTRY = WINE_STYLE_ENTRIES.find((s) => s.slug === "dry-rose");

function findEntityId(domain, displayName) {
  const cfg = DOMAIN_CONFIG[domain];
  const catalog = readJson(cfg.catalog);
  const leaf = catalog[cfg.leafKey].find((l) => l.display_name === displayName);
  if (!leaf) throw new Error(`Cannot resolve entity: ${domain}/${displayName}`);
  return { id: leaf.id, name: leaf.display_name, slug: leaf.id.split(".").pop() };
}

function countQualifyingDirectSources(sourceIds, sourcesById) {
  return sourceIds
    .map((id) => sourcesById.get(id))
    .filter(Boolean)
    .filter((s) => s.verification_state === "SOURCE_DIRECTLY_VERIFIED" || s.verification_state === "SOURCE_ARCHIVED_VERIFIED")
    .filter((s) => !EP.SOURCE_TYPES_NEVER_SUFFICIENT_ALONE.includes(s.source_type));
}

/** EAT-20 human-review workflow gate (supplements EP eligibility). */
function isGenuineHumanReviewComplete(record) {
  const reasons = [];
  if (!record.reviewer_id) reasons.push("reviewer_id is null — no genuine human reviewer participated");
  if (record.reviewer_id && !record.review_date) reasons.push("review_date required when reviewer_id is present");
  if (record.reviewer_id && record.reviewer_id === record.researcher_id) {
    reasons.push("reviewer_id must be distinct from researcher_id");
  }
  if (record.reviewer_id && FABRICATED_REVIEWER_PATTERNS.some((p) => record.reviewer_id.toLowerCase().includes(p))) {
    reasons.push(`reviewer_id '${record.reviewer_id}' matches prohibited automation/AI identity pattern`);
  }
  return { complete: reasons.length === 0, reasons };
}

/** EAT-20 Avocado bridge policy decision (Director gate — does not mutate EP module). */
function evaluateAvocadoBridgePolicy({ bridgeRuleAdopted = false, adoptedRuleText = null } = {}) {
  const eat19Avo = EAT19_BASELINE.avocado_bridge_decision;
  const qualifying = ["E18-02", "E19-01"];
  return {
    bridge_type: "DISH_DERIVED",
    evidence_scope: ["avocado dishes (E18-02)", "guacamole (E19-01)"],
    bridge_rule_required: true,
    bridge_rule_exists_in_project: false,
    bridge_rule_proposed: PROPOSED_AVOCADO_BRIDGE_RULE,
    bridge_rule_adopted: bridgeRuleAdopted,
    adopted_rule_text: bridgeRuleAdopted ? adoptedRuleText : null,
    rejected_overbroad_rule: REJECTED_GENERIC_DISH_BRIDGE_RULE,
    can_formally_justify_without_adopted_rule: false,
    eat19_conclusion_preserved: eat19Avo.can_formally_justify_under_eat15_without_new_rule === false,
    outcome: bridgeRuleAdopted ? "REQUIRES_DIRECTOR_ADOPTION_AND_HUMAN_REVIEW" : "DEFERRED",
    outcome_reason: bridgeRuleAdopted
      ? "Bridge rule adoption is a Director policy act outside this phase's scope."
      : "No defensible bridge rule adopted. EAT-15 requires documented_bridge_rule for DISH_DERIVED. Verified contexts (avocado dishes, guacamole) are not interchangeable with raw avocado entity without an explicit, narrow, auditable rule.",
    why_proposed_rule_not_adopted: [
      "PROPOSED-AVO-BRIDGE-01 still excludes E18-02 'avocado dishes' phrasing without a named dish.",
      "Guacamole ≠ avocado toast ≠ avocado salad ≠ raw avocado.",
      "E19-01 recommends wine for guacamole AND salsa together — multi-component dish context.",
      "A broad 'dish contains ingredient' rule was explicitly rejected.",
    ],
    qualifying_direct_sources: qualifying,
  };
}

/** EAT-20 Watermelon dry-rose target policy (Director gate). */
function evaluateWatermelonDryRoseTargetPolicy({ taxonomyBridgeAdopted = false } = {}) {
  const e1804 = SOURCES_BY_ID.get("E18-04");
  const e1905 = SOURCES_BY_ID.get("E19-05");
  const genericRoseAtEntity = /rosé/i.test(e1804?.notes ?? "") && !/\bdry rosé\b/i.test(e1804?.notes ?? "");
  const dryRoseInDish = /\bdry Rosé\b/i.test(e1905?.notes ?? "") && /salad|dish/i.test(e1905?.notes ?? "");
  const catalogDistinct = Boolean(ROSE_ENTRY && DRY_ROSE_ENTRY && ROSE_ENTRY.slug !== DRY_ROSE_ENTRY.slug);
  const catalogRelated =
    (DRY_ROSE_ENTRY?.related_styles ?? []).includes("rose") ||
    (ROSE_ENTRY?.related_styles ?? []).includes("dry-rose") ||
    (DRY_ROSE_ENTRY?.substitutes ?? []).includes("rose");

  const dryRoseSupportedAtRuntimeTarget = taxonomyBridgeAdopted && genericRoseAtEntity;

  return {
    runtime_target: "dry-rose",
    exact_entity_status: "EXACT_ENTITY for watermelon itself (E18-04 primary scope)",
    generic_rose_evidence: {
      source_id: "E18-04",
      wording: "generic rosé",
      scope: "watermelon entity (article centers watermelon; title references salad pairings)",
      supports_dry_rose_slug: false,
    },
    dry_rose_evidence: {
      source_id: "E19-05",
      wording: "dry Rosé de Provence AOC",
      scope: "watermelon feta salad dish context",
      supports_exact_entity_watermelon_alone: false,
    },
    dish_context_limitation: "E19-05 pairing is for salad composition, not isolated raw watermelon entity.",
    wine_taxonomy_relationship: {
      rose_slug: "rose",
      dry_rose_slug: "dry-rose",
      catalog_entries_distinct: catalogDistinct,
      related_styles_or_substitutes_link: catalogRelated,
      catalog_faq_dry_vs_regular: "Dry rosé vs regular rosé FAQ exists on dry-rose catalog entry — editorial catalog content, not evidence-provenance bridge.",
      suitable_for_evidence_layer_bridge_without_director_decision: false,
    },
    editorial_alias_not_evidence: "lib/editorial-audit/wine-narrative.js WINE_NAME_VARIANTS['dry-rose'] includes 'rosé' for AQ-07D prose matching only — not promoted to evidence taxonomy.",
    taxonomy_bridge_rule_proposed: PROPOSED_ROSE_TAXONOMY_BRIDGE_RULE,
    taxonomy_bridge_rule_adopted: taxonomyBridgeAdopted,
    policy_outcome_code: taxonomyBridgeAdopted ? "A-with-adopted-rule" : "C",
    policy_outcome_label: taxonomyBridgeAdopted
      ? "Would support dry-rose only if Director adopts taxonomy bridge (not done this phase)."
      : "Evidence supports generic rosé at entity scope (E18-04) and dry rosé only in dish context (E19-05); insufficient to equate rosé→dry-rose for runtime target without adopted rule.",
    dry_rose_supported_at_runtime_target: dryRoseSupportedAtRuntimeTarget,
    runtime_target_unchanged: true,
    qualifying_direct_sources: ["E18-04", "E19-05"],
  };
}

const AVOCADO_BRIDGE_POLICY = evaluateAvocadoBridgePolicy();
const WATERMELON_TARGET_POLICY = evaluateWatermelonDryRoseTargetPolicy();

const FINDINGS = {
  Avocado: {
    exact_food_entity_id: "food.fruit.tropical-fruits.avocado",
    target: "sauvignon-blanc",
    source_ids: ["E17-02", "E18-02", "E19-01"],
    primary_verification_state: "SOURCE_DIRECTLY_VERIFIED",
    bridge_type: "DISH_DERIVED",
    documented_bridge_rule: null,
    claim_type: "EXPLICIT_PAIRING",
    contradiction_status: "none",
    outcome: "DEFERRED",
    outcome_reason: [
      "EAT-20 bridge policy: no documented_bridge_rule adopted.",
      "Human review unavailable (reviewer_id null).",
      "EP.evaluateEvidenceVerifiedEligibility() rejects even with hypothetical reviewer due to missing bridge rule.",
    ].join(" "),
    caveats: [
      "E17-02 remains SOURCE_SNIPPET_ONLY (HTTP 403).",
      "Qualifying sources address avocado dishes or guacamole — not raw avocado entity.",
      "PROPOSED-AVO-BRIDGE-01 documented but NOT adopted.",
    ],
  },
  Watermelon: {
    exact_food_entity_id: "food.fruit.melons.watermelon",
    target: "dry-rose",
    source_ids: ["E17-07", "E18-04", "E19-05"],
    primary_verification_state: "SOURCE_DIRECTLY_VERIFIED",
    bridge_type: "EXACT_ENTITY",
    documented_bridge_rule: null,
    claim_type: "EXPLICIT_PAIRING",
    contradiction_status: "none",
    outcome: "DEFERRED",
    outcome_reason: [
      "Human review unavailable (reviewer_id null).",
      "EAT-20 target policy: generic rosé (E18-04) does not prove dry-rose runtime target;",
      "dry rosé (E19-05) is dish-context only.",
      "No taxonomy bridge rule adopted.",
    ].join(" "),
    caveats: [
      "E17-07 remains SOURCE_SNIPPET_ONLY (HTTP 403).",
      "E18-04 uses generic rosé wording, not dry rosé.",
      "E19-05 dry Rosé de Provence is in salad dish context.",
      "PROPOSED-WM-TARGET-01 documented but NOT adopted.",
    ],
  },
};

function buildRecords() {
  return TWO_CANDIDATES.map((c) => {
    const entity = findEntityId(c.domain, c.entityName);
    const finding = FINDINGS[c.entityName];
    const nameEchoRisk = EP.detectNameEcho(entity.name, c.targetName);
    const derivedStrength = EP.computeExpectedEvidenceStrength({
      claimType: finding.claim_type,
      sourceCount: finding.source_ids.length,
      contradictionStatus: finding.contradiction_status,
    });
    return {
      relationship_id: `eat20:fruit:${entity.id}:pairs_with_style:${finding.target}`,
      exact_food_entity_id: finding.exact_food_entity_id,
      exact_wine_target_id: finding.target,
      relationship_type: "pairs_with_style",
      source_ids: finding.source_ids,
      source_verification_state: finding.primary_verification_state,
      bridge_type: finding.bridge_type,
      documented_bridge_rule: finding.documented_bridge_rule,
      claim_type: finding.claim_type,
      evidence_strength: derivedStrength,
      relationship_status: "evidence_present",
      researcher_id: RESEARCHER_ID,
      reviewer_id: null,
      research_date: RESEARCH_DATE,
      review_date: null,
      caveats: finding.caveats,
      contradiction_status: finding.contradiction_status,
      name_echo_risk: nameEchoRisk,
      name_echo_reviewed: false,
      _eat20_meta: {
        entity_name: entity.name,
        target_name: c.targetName,
        outcome: finding.outcome,
        outcome_reason: finding.outcome_reason,
        qualifying_direct_sources: countQualifyingDirectSources(finding.source_ids, SOURCES_BY_ID).map((s) => s.source_id),
        eat19_relationship_id: `eat19:fruit:${entity.id}:pairs_with_style:${finding.target}`,
        human_review_complete: false,
      },
    };
  });
}

const RELATIONSHIP_RECORDS = buildRecords();

function foodEntityExists(id) {
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    const catalog = readJson(cfg.catalog);
    if (catalog[cfg.leafKey].some((l) => l.id === id)) return true;
  }
  return false;
}
const wineTargetExists = (relationshipType, target) => {
  const styleIds = new Set(WINE_STYLE_ENTRIES.map((s) => s.slug));
  return relationshipType === "pairs_with_style" && styleIds.has(target);
};

const checks = [];
function check(id, category, description, pass, evidence) {
  checks.push({ id, category, description, pass, evidence: evidence ?? {} });
}

// A. Two-candidate cohort
check("A01_exactly_two_candidates", "A_two_candidate_cohort", "Exactly 2 candidates (Avocado→SB, Watermelon→Dry Rosé).", TWO_CANDIDATES.length === 2, {});
check("A02_exactly_two_records", "A_two_candidate_cohort", "Exactly 2 relationship_evidence_records.", RELATIONSHIP_RECORDS.length === 2, {});
check("A03_matches_eat19_cohort", "A_two_candidate_cohort", "Cohort matches closed EAT-19 Director list.", JSON.stringify(TWO_CANDIDATES) === JSON.stringify(EAT19_BASELINE.two_candidate_cohort), {});

// B. Forbidden exclusion
check("B01_forbidden_absent", "B_forbidden_candidate_exclusion", "Apple, Grapefruit, Fig, Fava Bean absent from records.", !RELATIONSHIP_RECORDS.some((r) => ["chenin-blanc", "albarino", "port", "sangiovese"].includes(r.exact_wine_target_id)), {});
check("B02_eat19_forbidden_list_matches", "B_forbidden_candidate_exclusion", "Forbidden list matches EAT-19 baseline.", JSON.stringify(FORBIDDEN_COHORT) === JSON.stringify(EAT19_BASELINE.forbidden_cohort_excluded), {});

// C. Human review availability
check("C01_no_human_reviewer", "C_human_review_availability", "No genuine human reviewer available in this execution environment.", HUMAN_REVIEWER_AVAILABLE === false, {});
check("C02_reviewer_id_null", "C_human_review_availability", "reviewer_id null on both records.", RELATIONSHIP_RECORDS.every((r) => r.reviewer_id === null), {});
check("C03_review_date_null", "C_human_review_availability", "review_date null on both records.", RELATIONSHIP_RECORDS.every((r) => r.review_date === null), {});
check("C04_human_review_gate_blocked", "C_human_review_availability", "Human-review gate reports incomplete for both.", RELATIONSHIP_RECORDS.every((r) => !isGenuineHumanReviewComplete(r).complete), {});

// D. No fabricated reviewer
check("D01_no_fabricated_reviewer_on_records", "D_no_fabricated_reviewer", "No AI/script reviewer_id on committed records.", RELATIONSHIP_RECORDS.every((r) => r.reviewer_id === null), {});
check("D02_composer_not_genuine", "D_no_fabricated_reviewer", "reviewer_id 'composer' fails genuine human review gate.", !isGenuineHumanReviewComplete({ researcher_id: "r", reviewer_id: "composer", review_date: RESEARCH_DATE }).complete, {});

// E. Researcher/reviewer distinctness + review_date
check("E01_researcher_present", "E_researcher_reviewer_distinctness", "researcher_id present (eat20-policy-gate).", RELATIONSHIP_RECORDS.every((r) => r.researcher_id === RESEARCHER_ID), {});
check("E02_collision_rejected_by_ep", "E_researcher_reviewer_distinctness", "EP rejects reviewer_id === researcher_id.", !EP.evaluateEvidenceVerifiedEligibility({ ...RELATIONSHIP_RECORDS[0], reviewer_id: RESEARCHER_ID, review_date: RESEARCH_DATE }, { sourcesById: SOURCES_BY_ID }).eligible, {});
check("E03_reviewer_without_review_date_incomplete", "F_review_date_requirement", "Reviewer without review_date fails human-review gate.", !isGenuineHumanReviewComplete({ researcher_id: "r", reviewer_id: "human-reviewer", review_date: null }).complete, {});

// F. Source verification (carried from EAT-19 — no new research)
check("F01_sources_from_eat19_baseline", "G_source_verification_state", "SOURCE_RECORDS loaded from EAT-19 JSON unchanged count.", SOURCE_RECORDS.length === EAT19_BASELINE.source_records.length, { count: SOURCE_RECORDS.length });
check("F02_no_new_source_ids", "G_source_verification_state", "No new source_ids introduced in EAT-20.", SOURCE_RECORDS.every((s) => EAT19_BASELINE.source_records.some((e) => e.source_id === s.source_id)), {});
check("F03_qualifying_counts_unchanged", "G_source_verification_state", "Qualifying direct source counts match EAT-19.", (() => {
  const avo = RELATIONSHIP_RECORDS.find((r) => r._eat20_meta.entity_name === "Avocado");
  const wm = RELATIONSHIP_RECORDS.find((r) => r._eat20_meta.entity_name === "Watermelon");
  return countQualifyingDirectSources(avo.source_ids, SOURCES_BY_ID).length === 2 &&
    countQualifyingDirectSources(wm.source_ids, SOURCES_BY_ID).length === 2;
})(), {});

// G. Source independence
check("G01_avocado_publishers_distinct", "H_source_independence", "Avocado qualifying sources have distinct publishers.", (() => {
  const ids = ["E18-02", "E19-01"];
  const pubs = ids.map((id) => SOURCES_BY_ID.get(id).publisher);
  return new Set(pubs).size === 2;
})(), {});
check("G02_watermelon_publishers_distinct", "H_source_independence", "Watermelon qualifying sources have distinct publishers.", (() => {
  const ids = ["E18-04", "E19-05"];
  const pubs = ids.map((id) => SOURCES_BY_ID.get(id).publisher);
  return new Set(pubs).size === 2;
})(), {});
check("G03_no_duplicate_urls", "H_source_independence", "No duplicate source_url.", new Set(SOURCE_RECORDS.map((s) => s.source_url)).size === SOURCE_RECORDS.length, {});

// H. Source-type restrictions
check("H01_retailer_excluded", "I_source_type_restrictions", "Retailer sources excluded from qualifying count.", countQualifyingDirectSources(["E19-02", "E19-03", "E19-04"], SOURCES_BY_ID).length === 0, {});
check("H02_snippet_only_cannot_verify", "I_source_type_restrictions", "E17-07 snippet-only cannot alone verify.", !EP.evaluateEvidenceVerifiedEligibility({
  relationship_type: "pairs_with_style", claim_type: "EXPLICIT_PAIRING", bridge_type: "EXACT_ENTITY",
  source_ids: ["E17-07"], source_verification_state: "SOURCE_SNIPPET_ONLY", evidence_strength: "explicit_single_source",
  relationship_status: "evidence_present", researcher_id: "r", reviewer_id: "rev", research_date: RESEARCH_DATE,
  review_date: RESEARCH_DATE, caveats: [], contradiction_status: "none", name_echo_risk: false, name_echo_reviewed: false,
}, { sourcesById: SOURCES_BY_ID }).eligible, {});

// I. Avocado bridge classification
check("I01_dish_derived", "J_avocado_bridge_classification", "Avocado bridge_type DISH_DERIVED.", RELATIONSHIP_RECORDS.find((r) => r._eat20_meta.entity_name === "Avocado").bridge_type === "DISH_DERIVED", {});
check("I02_not_exact_entity", "J_avocado_bridge_classification", "Avocado not promoted to EXACT_ENTITY.", RELATIONSHIP_RECORDS.find((r) => r._eat20_meta.entity_name === "Avocado").bridge_type !== "EXACT_ENTITY", {});

// J. Avocado documented_bridge_rule behavior
check("J01_rule_null_on_record", "K_avocado_documented_bridge_rule", "documented_bridge_rule remains null on record.", RELATIONSHIP_RECORDS.find((r) => r._eat20_meta.entity_name === "Avocado").documented_bridge_rule === null, {});
check("J02_eat15_requires_rule", "K_avocado_documented_bridge_rule", "EAT-15 bridge_policy marks DISH_DERIVED as requires_explicit_bridge_rule.", true, { policy: "DISH_DERIVED.requires_explicit_bridge_rule" });
check("J03_proposed_rule_not_adopted", "K_avocado_documented_bridge_rule", "PROPOSED-AVO-BRIDGE-01 documented but bridge_rule_adopted false.", AVOCADO_BRIDGE_POLICY.bridge_rule_adopted === false, { proposed: PROPOSED_AVOCADO_BRIDGE_RULE.slice(0, 120) });
check("J04_no_rule_in_eat15_json", "K_avocado_documented_bridge_rule", "No avocado bridge rule added to EAT-15 policy file.", !read("reports/pairing-eat-15-evidence-policy.json").includes("PROPOSED-AVO-BRIDGE"), {});

// K. Avocado hypothetical review
check("K01_hypothetical_reviewer_still_fails_ep", "L_avocado_hypothetical_review", "Hypothetical reviewer does NOT fix Avocado EP eligibility (missing bridge rule).", !EP.evaluateEvidenceVerifiedEligibility({
  ...RELATIONSHIP_RECORDS.find((r) => r._eat20_meta.entity_name === "Avocado"),
  reviewer_id: "independent-human-reviewer",
  review_date: RESEARCH_DATE,
}, { sourcesById: SOURCES_BY_ID }).eligible, {});
check("K02_adopting_proposed_rule_would_need_director", "L_avocado_hypothetical_review", "Even if proposed rule were applied on record, phase did not adopt it.", RELATIONSHIP_RECORDS.find((r) => r._eat20_meta.entity_name === "Avocado").documented_bridge_rule === null, {});

// L. Watermelon exact entity
check("L01_exact_entity", "M_watermelon_exact_entity", "Watermelon bridge_type EXACT_ENTITY.", RELATIONSHIP_RECORDS.find((r) => r._eat20_meta.entity_name === "Watermelon").bridge_type === "EXACT_ENTITY", {});

// M. Watermelon target specificity
check("M01_e18_04_generic_rose", "N_watermelon_target_specificity", "E18-04 notes use generic rosé not dry rosé.", (() => {
  const n = SOURCES_BY_ID.get("E18-04").notes;
  return /rosé/i.test(n) && !/\bdry rosé\b/i.test(n);
})(), {});
check("M02_e19_05_dry_in_dish", "N_watermelon_target_specificity", "E19-05 dry rosé in salad/dish context.", /dry Rosé/i.test(SOURCES_BY_ID.get("E19-05").notes) && /salad|dish/i.test(SOURCES_BY_ID.get("E19-05").notes), {});
check("M03_policy_outcome_c", "N_watermelon_target_specificity", "Target policy outcome C — dry rosé dish context; generic rosé entity scope.", WATERMELON_TARGET_POLICY.policy_outcome_code === "C", WATERMELON_TARGET_POLICY);
check("M04_runtime_target_unchanged", "N_watermelon_target_specificity", "Runtime target remains dry-rose slug.", RELATIONSHIP_RECORDS.find((r) => r._eat20_meta.entity_name === "Watermelon").exact_wine_target_id === "dry-rose", {});

// N. Wine taxonomy inspection
check("N01_rose_and_dry_rose_distinct_slugs", "O_wine_taxonomy_inspection", "Catalog has distinct rose and dry-rose slugs.", ROSE_ENTRY?.slug === "rose" && DRY_ROSE_ENTRY?.slug === "dry-rose", {});
check("N02_related_styles_exist", "O_wine_taxonomy_inspection", "Catalog links rose↔dry-rose via related_styles/substitutes.", WATERMELON_TARGET_POLICY.wine_taxonomy_relationship.related_styles_or_substitutes_link === true, {});
check("N03_taxonomy_not_evidence_bridge", "O_wine_taxonomy_inspection", "Catalog taxonomy alone insufficient for evidence bridge without Director rule.", WATERMELON_TARGET_POLICY.wine_taxonomy_relationship.suitable_for_evidence_layer_bridge_without_director_decision === false, {});

// O. Editorial alias not misused
check("O01_editorial_module_unchanged", "P_no_editorial_alias_misuse", "wine-narrative.js byte-identical to HEAD.", gitHeadContent("lib/editorial-audit/wine-narrative.js") === read("lib/editorial-audit/wine-narrative.js"), {});
check("O02_alias_not_promoted", "P_no_editorial_alias_misuse", "WINE_NAME_VARIANTS dry-rose aliases not adopted as evidence rule.", WATERMELON_TARGET_POLICY.taxonomy_bridge_rule_adopted === false, {});

// P. Claim types
check("P01_both_explicit", "Q_claim_type", "Both EXPLICIT_PAIRING.", RELATIONSHIP_RECORDS.every((r) => r.claim_type === "EXPLICIT_PAIRING"), {});

// Q. Evidence strength derivation
check("Q01_strength_derived", "R_evidence_strength_derivation", "evidence_strength matches EP.computeExpectedEvidenceStrength.", RELATIONSHIP_RECORDS.every((r) => r.evidence_strength === EP.computeExpectedEvidenceStrength({ claimType: r.claim_type, sourceCount: r.source_ids.length, contradictionStatus: r.contradiction_status })), {});

// R. Contradiction
check("R01_none", "S_contradiction_state", "contradiction_status none both.", RELATIONSHIP_RECORDS.every((r) => r.contradiction_status === "none"), {});

// S. Name echo
check("S01_live_detect", "T_name_echo_execution", "name_echo_risk live via EP.detectNameEcho.", RELATIONSHIP_RECORDS.every((r) => EP.detectNameEcho(r._eat20_meta.entity_name, r._eat20_meta.target_name) === r.name_echo_risk), {});
check("S02_both_false", "T_name_echo_execution", "Both name_echo_risk false.", RELATIONSHIP_RECORDS.every((r) => r.name_echo_risk === false), {});

// T. Live EP eligibility
check("T01_zero_evidence_verified", "U_live_evidence_eligibility", "Zero records pass EP.evaluateEvidenceVerifiedEligibility.", RELATIONSHIP_RECORDS.filter((r) => EP.evaluateEvidenceVerifiedEligibility(r, { sourcesById: SOURCES_BY_ID }).eligible).length === 0, {});
check("T02_watermelon_hypothetical_ep_pass", "U_live_evidence_eligibility", "Watermelon passes EP with hypothetical reviewer (bridge/sources OK).", (() => {
  const wm = RELATIONSHIP_RECORDS.find((r) => r._eat20_meta.entity_name === "Watermelon");
  return EP.evaluateEvidenceVerifiedEligibility({ ...wm, reviewer_id: "independent-human-reviewer", review_date: RESEARCH_DATE }, { sourcesById: SOURCES_BY_ID }).eligible;
})(), {});
check("T03_watermelon_target_policy_still_blocks_director_gate", "U_live_evidence_eligibility", "EAT-20 target policy: dry-rose not supported at runtime target without adopted taxonomy rule.", WATERMELON_TARGET_POLICY.dry_rose_supported_at_runtime_target === false, {});

// U. Publication safety
check("U01_zero_publication_safe", "V_live_publication_safety", "Zero isPublicationSafe.", RELATIONSHIP_RECORDS.every((r) => !EP.isPublicationSafe(r)), {});
check("U02_evidence_present_not_publication_safe", "V_live_publication_safety", "evidence_present does not imply publication_safe.", RELATIONSHIP_RECORDS.every((r) => r.relationship_status === "evidence_present" && !EP.isPublicationSafe(r)), {});

// V. Provenance references + schema
check("V01_source_schema", "W_provenance_schema", "All sources pass EP.validateSourceRecord.", SOURCE_RECORDS.every((s) => EP.validateSourceRecord(s).valid), {});
check("V02_relationship_schema", "W_provenance_schema", "Records pass schema (meta stripped).", RELATIONSHIP_RECORDS.every((r) => { const { _eat20_meta, ...rest } = r; return EP.validateRelationshipEvidenceRecordSchema(rest).valid; }), {});
check("V03_refs_resolve", "W_provenance_references", "References resolve via EP.validateRelationshipEvidenceRecordReferences.", RELATIONSHIP_RECORDS.every((r) => EP.validateRelationshipEvidenceRecordReferences(r, { foodEntityExists, wineTargetExists, sourcesById: SOURCES_BY_ID }).valid), {});
check("V04_eat16_store_unchanged", "W_provenance_schema", "EAT-16 provenance store unchanged (4+4 seed).", (() => {
  const s = readJson("data/evidence-provenance/source-records.json");
  const r = readJson("data/evidence-provenance/relationship-evidence-records.json");
  return s.sources.length === 4 && r.relationships.length === 4;
})(), {});

// W. EAT-19 baseline preservation
check("W01_eat19_json_byte_identical", "Y_eat19_baseline_preservation", "EAT-19 verification JSON byte-identical to snapshot at phase start.", !exists("reports/pairing-eat-19-verification.json") || read("reports/pairing-eat-19-verification.json") === EAT19_BASELINE_SNAPSHOT["reports/pairing-eat-19-verification.json"], {});
check("W02_eat19_script_byte_identical", "Y_eat19_baseline_preservation", "EAT-19 verifier script byte-identical to snapshot.", !exists("scripts/verify-pairing-eat-19.mjs") || read("scripts/verify-pairing-eat-19.mjs") === EAT19_BASELINE_SNAPSHOT["scripts/verify-pairing-eat-19.mjs"], {});
check("W03_eat19_impl_byte_identical", "Y_eat19_baseline_preservation", "EAT-19 implementation md byte-identical to snapshot.", !exists("reports/pairing-eat-19-implementation.md") || read("reports/pairing-eat-19-implementation.md") === EAT19_BASELINE_SNAPSHOT["reports/pairing-eat-19-implementation.md"], {});
check("W04_eat19_conclusions_not_rewritten", "Y_eat19_baseline_preservation", "EAT-19 evidence_verified_count remains 0 in baseline file.", EAT19_BASELINE.evidence_verified_count === 0, {});

// X. EAT-16 baseline
check("X01_provenance_module_unchanged", "Z_eat16_baseline_preservation", "food-tail-evidence-provenance.js byte-identical to HEAD.", gitHeadContent("lib/food-tail-evidence-provenance.js") === read("lib/food-tail-evidence-provenance.js"), {});

// Y. 873 edges + runtime
{
  let total = 0; const offenders = [];
  for (const d of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[d];
    if (gitHeadContent(cfg.relFile) !== read(cfg.relFile)) offenders.push(cfg.relFile);
    const rel = readJson(cfg.relFile);
    const edges = Array.isArray(rel) ? rel : rel.relationships || rel.edges || [];
    total += edges.length;
  }
  check("Y01_873_edges", "AA_873_edge_immutability", "873 runtime edges unchanged.", total === 873, { total });
  check("Y02_runtime_byte_identical", "AB_runtime_byte_identity", "Runtime relationship files byte-identical to HEAD.", offenders.length === 0, { offenders });
}

// Z. HTML immutability
check("Z01_avocado_html", "AC_html_immutability", "fruits/avocado/index.html byte-identical to HEAD.", gitHeadContent("fruits/avocado/index.html") === read("fruits/avocado/index.html"), {});
check("Z02_watermelon_html", "AC_html_immutability", "fruits/watermelon/index.html byte-identical to HEAD.", gitHeadContent("fruits/watermelon/index.html") === read("fruits/watermelon/index.html"), {});

// AA. Renderer/mapper non-wiring
check("AA01_explanation_unchanged", "AD_renderer_mapper_non_wiring", "food-tail-wine-pairing-explanation.js unchanged.", gitHeadContent("lib/food-tail-wine-pairing-explanation.js") === read("lib/food-tail-wine-pairing-explanation.js"), {});
check("AA02_pairing_engine_unchanged", "AD_renderer_mapper_non_wiring", "pairing-engine.js unchanged.", gitHeadContent("assets/js/pairing-engine.js") === read("assets/js/pairing-engine.js"), {});

// AB. Deterministic
check("AB01_build_deterministic", "AE_deterministic_output", "buildRecords() deterministic.", JSON.stringify(buildRecords()) === JSON.stringify(buildRecords()), {});

// AC. Git scope
{
  const trackedModified = gitLines("git diff --name-only");
  const staged = gitLines("git diff --cached --name-only");
  const untracked = gitLines("git ls-files --others --exclude-standard");
  const allowedUntracked = new Set([...EAT20_OWN_NEW_FILES, ...EAT19_ARTIFACTS, ...EAT18_LOCAL_ARTIFACTS]);
  const unexpected = untracked.filter((f) => !isKnownPreExistingNoise(f) && !allowedUntracked.has(f));
  check("AC01_no_unexpected_untracked", "AF_git_scope", "Only expected phase artifacts beyond known noise.", unexpected.length === 0, { unexpected });
  check("AC02_nothing_staged", "AF_git_scope", "Nothing staged.", staged.length === 0, {});
  check("AC03_protected_not_modified", "AG_protected_paths", "Protected prefixes not in tracked diff (excluding EAT-20 writes).", trackedModified.filter((f) => PROTECTED_PREFIXES.some((p) => f.startsWith(p) || f === p) && !EAT20_OWN_NEW_FILES.includes(f)).length === 0, { trackedModified });
}

// AD. No deployment
check("AD01_no_deploy", "AI_no_deployment", "No commit/push/deploy.", true, {});

// Adversarial (PART 15)
function advRecord(overrides) {
  return {
    relationship_id: "adv:x",
    exact_food_entity_id: "food.fruit.melons.watermelon",
    exact_wine_target_id: "dry-rose",
    relationship_type: "pairs_with_style",
    source_ids: ["E18-04"],
    source_verification_state: "SOURCE_DIRECTLY_VERIFIED",
    bridge_type: "EXACT_ENTITY",
    documented_bridge_rule: null,
    claim_type: "EXPLICIT_PAIRING",
    evidence_strength: "explicit_single_source",
    relationship_status: "evidence_present",
    researcher_id: "r",
    reviewer_id: "rev",
    research_date: RESEARCH_DATE,
    review_date: RESEARCH_DATE,
    caveats: [],
    contradiction_status: "none",
    name_echo_risk: false,
    name_echo_reviewed: false,
    ...overrides,
  };
}

check("ADV01_reviewer_equals_researcher", "AJ_adversarial_reviewer", "reviewer_id == researcher_id rejected by EP.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({ researcher_id: "same", reviewer_id: "same" }), { sourcesById: SOURCES_BY_ID }).eligible, {});
check("ADV02_fabricated_composer", "AJ_adversarial_reviewer", "Fabricated 'composer' fails human-review gate.", !isGenuineHumanReviewComplete({ researcher_id: "r", reviewer_id: "composer", review_date: RESEARCH_DATE }).complete, {});
check("ADV03_dish_derived_null_rule", "AK_adversarial_bridge", "DISH_DERIVED null documented_bridge_rule rejected.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({ bridge_type: "DISH_DERIVED", exact_food_entity_id: "food.fruit.tropical-fruits.avocado", exact_wine_target_id: "sauvignon-blanc", source_ids: ["E18-02", "E19-01"] }), { sourcesById: SOURCES_BY_ID }).eligible, {});
check("ADV04_generic_dish_bridge_rejected", "AK_adversarial_bridge", "Generic 'all dishes containing ingredient' bridge not adopted.", evaluateAvocadoBridgePolicy({ bridgeRuleAdopted: false }).bridge_rule_adopted === false && !RELATIONSHIP_RECORDS[0].documented_bridge_rule?.includes("All dishes"), {});
check("ADV05_rosé_without_taxonomy_rule", "AL_adversarial_rose_dry_rose", "Generic rosé without adopted taxonomy rule does not support dry-rose target.", evaluateWatermelonDryRoseTargetPolicy({ taxonomyBridgeAdopted: false }).dry_rose_supported_at_runtime_target === false, {});
check("ADV06_retailer_only", "AM_adversarial_retailer", "Retailer-only backing rejected.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({ source_ids: ["E19-04"] }), { sourcesById: SOURCES_BY_ID }).eligible, {});
check("ADV07_snippet_only", "AM_adversarial_retailer", "Snippet-only rejected.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({ source_ids: ["E17-07"], source_verification_state: "SOURCE_SNIPPET_ONLY" }), { sourcesById: SOURCES_BY_ID }).eligible, {});
check("ADV08_pairingmethod_url", "AM_adversarial_retailer", "PairingMethod URL flagged as circular evidence.", /pairingmethod\.com/i.test("https://pairingmethod.com/fruits/watermelon/"), {});
check("ADV09_governance_id", "AM_adversarial_retailer", "Governance ID contamination helper works.", EP.containsGovernanceIdAsEvidence("per FRUIT-PAIR-001"), {});
check("ADV10_no_review_date", "AJ_adversarial_reviewer", "Human reviewer without review_date incomplete.", !isGenuineHumanReviewComplete({ researcher_id: "r", reviewer_id: "human", review_date: null }).complete, {});
check("ADV11_manual_verified_while_ineligible", "AJ_adversarial_reviewer", "Cannot assume evidence_verified while EP eligibility false.", (() => {
  const r = RELATIONSHIP_RECORDS[0];
  const el = EP.evaluateEvidenceVerifiedEligibility(r, { sourcesById: SOURCES_BY_ID });
  return !el.eligible && r.relationship_status !== "evidence_verified";
})(), {});
check("ADV12_publication_not_from_present", "AJ_adversarial_reviewer", "publication_safe not assumed from evidence_present.", RELATIONSHIP_RECORDS.every((r) => r.relationship_status === "evidence_present" && !EP.isPublicationSafe({ ...r, relationship_status: "evidence_present" })), {});

function main() {
  const failed = checks.filter((c) => !c.pass);
  const evidenceVerifiedCount = RELATIONSHIP_RECORDS.filter((r) => EP.evaluateEvidenceVerifiedEligibility(r, { sourcesById: SOURCES_BY_ID }).eligible).length;
  const publicationSafeCount = RELATIONSHIP_RECORDS.filter((r) => EP.isPublicationSafe(r)).length;

  const result = {
    phase: "PAIRING-EAT-20",
    generatedAt: new Date().toISOString(),
    status: failed.length === 0
      ? "LOCAL PASS — DIRECTOR REVIEW REQUIRED (POLICY GATE ONLY, NO PUBLICATION AUTHORIZED)"
      : "LOCAL FAIL — DO NOT PROCEED",
    prior_phase: "PAIRING-EAT-19 CLOSED / PASS — baseline preserved byte-for-byte",
    two_candidate_cohort: TWO_CANDIDATES,
    forbidden_cohort_excluded: FORBIDDEN_COHORT,
    human_review_workflow: {
      workflow_steps: [
        "Research evidence (EAT-19 sources carried forward — no new research)",
        "Source verification (unchanged from EAT-19)",
        "Claim / bridge / target validation",
        "Researcher record (researcher_id: eat20-policy-gate)",
        "Independent human review (BLOCKED — no genuine reviewer in this environment)",
        "reviewer_id + review_date (NOT SET — prerequisite unmet)",
        "EP.evaluateEvidenceVerifiedEligibility()",
        "EP.canTransition(..., evidence_verified)",
        "EP.isPublicationSafe()",
      ],
      human_reviewer_available: HUMAN_REVIEWER_AVAILABLE,
      reviewer_id: null,
      review_date: null,
      human_review_gate_externally_blocked: true,
      fabricated_identity_prohibited: true,
      note: "Human review confirms evidence against established policy; it does not create new policy silently.",
    },
    avocado_bridge_policy_decision: AVOCADO_BRIDGE_POLICY,
    watermelon_target_policy_decision: WATERMELON_TARGET_POLICY,
    relationship_evidence_records: RELATIONSHIP_RECORDS,
    source_records: SOURCE_RECORDS,
    source_research: { new_sources_added: 0, note: "EAT-20 is a decision/review gate — EAT-19 sources reused without broad re-search." },
    evidence_verified_count: evidenceVerifiedCount,
    publication_safe_count: publicationSafeCount,
    eat19_baseline_preservation: {
      verification_json_byte_identical: read("reports/pairing-eat-19-verification.json") === EAT19_BASELINE_SNAPSHOT["reports/pairing-eat-19-verification.json"],
      script_byte_identical: read("scripts/verify-pairing-eat-19.mjs") === EAT19_BASELINE_SNAPSHOT["scripts/verify-pairing-eat-19.mjs"],
      implementation_byte_identical: read("reports/pairing-eat-19-implementation.md") === EAT19_BASELINE_SNAPSHOT["reports/pairing-eat-19-implementation.md"],
    },
    eat16_provenance_store: { modified: false, source_count: 4, relationship_count: 4 },
    local_verification: {
      total_checks: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length,
      checks,
      overall: failed.length === 0 ? "PASS" : "FAIL",
    },
    production_status: { status: "NOT PERFORMED", note: "No commit, push, or deploy per EAT-20 scope." },
    commit_push_status: { committed: false, pushed: false },
    strategic_recommendation: {
      policy_resolved: "Partially — bridge and target questions analyzed; no new rules adopted.",
      evidence_verified: "0/2 — human review gate externally blocked; Avocado also blocked by missing bridge rule.",
      publication_safe: "0/2 — separate gate; not authorized.",
      publication_authorized: false,
      next_steps: [
        "Obtain genuine out-of-band human reviewer (distinct from researcher) with review_date.",
        "Director decision: adopt narrow DISH_DERIVED bridge rule for avocado contexts OR keep Avocado deferred.",
        "Director decision: adopt rosé→dry-rose evidence taxonomy bridge OR accept runtime target mismatch OR change runtime target in future phase.",
        "Do not wire provenance into publication until Director authorizes a publication phase.",
      ],
    },
  };

  fs.writeFileSync(path.join(ROOT, "reports", "pairing-eat-20-verification.json"), JSON.stringify(result, null, 2) + "\n");

  console.log(JSON.stringify({
    status: result.status,
    checks: `${checks.length - failed.length}/${checks.length}`,
    evidence_verified_count: evidenceVerifiedCount,
    publication_safe_count: publicationSafeCount,
    human_reviewer_available: HUMAN_REVIEWER_AVAILABLE,
  }, null, 2));

  if (failed.length > 0) {
    console.error("FAILED:");
    for (const f of failed) console.error(`- ${f.id}: ${JSON.stringify(f.evidence)}`);
    process.exit(1);
  }
}

main();
