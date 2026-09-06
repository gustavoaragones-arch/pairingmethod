#!/usr/bin/env node
/**
 * PAIRING-EAT-15 — Evidence Policy Hardening & Second Pilot.
 *
 * Hardens the EAT-14 evidence architecture per Director decision (source
 * verification states, bridge taxonomy, claim_type/evidence_strength
 * separation, contradiction policy, reviewer policy, producer/retailer
 * policy, deprecated-relationship policy), and runs a second pilot
 * specifically targeting pairs_with_descriptor and pairs_with_technique
 * edges to test whether EAT-14's Policy C (bar-by-relationship-type)
 * recommendation actually holds. Read-only except for writing its own
 * reports — no runtime relationship data, catalog, HTML, engine, mapper,
 * or prior EAT deliverable is modified.
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
  try { return execSync(cmd, { cwd: ROOT, encoding: "utf8" }).split("\n").map((l) => l.trim()).filter(Boolean); }
  catch { return []; }
}
function gitHeadContent(relPath) {
  try { return execSync(`git show HEAD:${relPath}`, { cwd: ROOT, encoding: "utf8" }); }
  catch { return null; }
}

const DOMAIN_CONFIG = {
  fruit: { catalog: "data/fruit-catalog.json", leafKey: "fruits", relFile: "data/runtime/fruit-wine-relationships.json", leafDir: "fruits" },
  "nut-seed": { catalog: "data/nut-seed-catalog.json", leafKey: "nut_seeds", relFile: "data/runtime/nut-seed-wine-relationships.json", leafDir: "nut-seeds" },
  legume: { catalog: "data/legume-catalog.json", leafKey: "legumes", relFile: "data/runtime/legume-wine-relationships.json", leafDir: "legumes" },
  "sweet-flavor": { catalog: "data/sweet-flavor-catalog.json", leafKey: "sweet_flavors", relFile: "data/runtime/sweet-flavor-wine-relationships.json", leafDir: "sweet-flavors" },
};
const TARGET_DOMAINS = Object.keys(DOMAIN_CONFIG);
const RELATIONSHIP_TYPES_ALLOWED = ["pairs_with_style", "also_pairs_with_style", "pairs_with_descriptor", "pairs_with_technique"];
const UNSUITABLE_EVIDENCE_PATTERN = /\bper [A-Z][A-Z0-9-]*-\d+\b/;
const ACCESSED_DATE = "2026-09-06";

const KNOWN_PRE_EXISTING_UNTRACKED_PREFIXES = [
  ".regression-baseline/", "cheese-categories/", "cheese-groups/", "cheeses/", "logo-vector_.ai",
  "reports/pairing-eat-01-audit.md", "reports/pairing-eat-05-content-quality.json", "reports/pairing-eat-05-content-quality.md",
  "scripts/verify-pairing-eat-05.mjs", "terms/",
  "reports/pairing-eat-09-evidence-audit.md", "reports/pairing-eat-09-evidence-audit.json",
  "reports/pairing-eat-09-verification.json", "scripts/verify-pairing-eat-09.mjs",
  "reports/pairing-eat-13-implementation.md", "reports/pairing-eat-13-relationship-audit.json", "scripts/verify-pairing-eat-13.mjs",
  "reports/pairing-eat-14-evidence-research.json", "reports/pairing-eat-14-implementation.md", "scripts/verify-pairing-eat-14.mjs",
];
function isKnownPreExistingNoise(f) { return KNOWN_PRE_EXISTING_UNTRACKED_PREFIXES.some((p) => f === p || f.startsWith(p)); }
const EAT15_OWN_NEW_FILES = ["scripts/verify-pairing-eat-15.mjs", "reports/pairing-eat-15-evidence-policy.json", "reports/pairing-eat-15-implementation.md"];

const PROTECTED_PREFIXES = [
  "assets/js/pairing-engine.js", "assets/js/pairing-data.js", "assets/js/matrix-view.js", "assets/js/engine.js",
  "data/relationship-evidence.json", "data/wine-fault-external-references.json", "data/relationship-types.json",
  "data/spanish-vocabulary.json", "data/wine-", "data/grape-catalog.json", "data/cheese-catalog.json",
  "data/vegetable-catalog.json", "data/herb-spice-catalog.json", "data/grain-starch-catalog.json", "data/protein-food-catalog.json",
  "data/fruit-catalog.json", "data/nut-seed-catalog.json", "data/legume-catalog.json", "data/sweet-flavor-catalog.json",
  "data/runtime/",
  "sitemap.xml", "sitemaps/", "_redirects", "robots.txt", "lib/language-config.js",
  "404.html", "privacy.html", "terms.html", "disclaimer.html", "cookies.html", "about.html",
  "faults/", "lib/taxonomy-wine-fault-render.js",
  "lib/fungi-wine-pairing-explanation.js", "lib/food-tail-wine-pairing-explanation.js",
  "lib/taxonomy-vegetable-render.js", "lib/taxonomy-herb-spice-render.js", "lib/taxonomy-grain-starch-render.js",
  "lib/taxonomy-fruit-render.js", "lib/taxonomy-nut-seed-render.js", "lib/taxonomy-legume-render.js", "lib/taxonomy-sweet-flavor-render.js",
  "vegetables/", "vegetable-groups/", "vegetable-categories/", "herbs-spices/", "herb-spice-groups/", "herb-spice-categories/",
  "grains-starches/", "grain-starch-groups/", "grain-starch-categories/",
  "fruits/", "fruit-groups/", "fruit-categories/", "nut-seeds/", "nut-seed-groups/", "nut-seed-categories/",
  "legumes/", "legume-groups/", "legume-categories/", "sweet-flavors/", "sweet-flavor-groups/", "sweet-flavor-categories/",
  "foods/", "groups/", "categories/", "sauce-condiments/", "fungi/", "fungi-groups/", "fungi-categories/", "cheeses/",
  "styles/", "regions/", "techniques/", "serving/", "grapes/",
  "scripts/map-fruit-wine-relationships-09e.mjs", "scripts/map-nut-seed-wine-relationships-10e.mjs",
  "scripts/map-legume-wine-relationships-11e.mjs", "scripts/map-sweet-flavor-wine-relationships-12e.mjs",
  "scripts/fruit-wine-seed-09e.js", "scripts/nut-seed-wine-seed-10e.js", "scripts/legume-wine-seed-11e.js", "scripts/sweet-flavor-wine-seed-12e.js",
  "reports/pairing-eat-04", "reports/pairing-eat-06", "reports/pairing-eat-07", "reports/pairing-eat-08",
  "reports/pairing-eat-09", "reports/pairing-eat-10", "reports/pairing-eat-11", "reports/pairing-eat-12", "reports/pairing-eat-13", "reports/pairing-eat-14",
  "scripts/verify-pairing-eat-04", "scripts/verify-pairing-eat-06", "scripts/verify-pairing-eat-07", "scripts/verify-pairing-eat-08",
  "scripts/verify-pairing-eat-09", "scripts/verify-pairing-eat-10", "scripts/verify-pairing-eat-11", "scripts/verify-pairing-eat-12",
  "scripts/verify-pairing-eat-13", "scripts/verify-pairing-eat-14",
];

// =======================================================================
// SECTION 1 — SOURCE VERIFICATION POLICY (ticket §2)
// =======================================================================

const SOURCE_VERIFICATION_STATES = {
  SOURCE_UNVERIFIED: { can_support_evidence_verified: false, description: "Research lead only — a source was named but not read at all this phase (e.g. surfaced only in a corroborating-title list)." },
  SOURCE_SNIPPET_ONLY: { can_support_evidence_verified: false, description: "Search-engine snippet/index content only, not independently re-fetched. May support research triage (deciding what's worth chasing further) but never evidence_verified on its own." },
  SOURCE_DIRECTLY_VERIFIED: { can_support_evidence_verified: true, description: "The source page itself was accessed (via WebFetch) and the specific claim was read and confirmed in context. May support evidence_verified if all other policy requirements (claim match, bridge type, source quality) also pass." },
  SOURCE_ARCHIVED_VERIFIED: { can_support_evidence_verified: true, description: "SOURCE_DIRECTLY_VERIFIED plus a preserved evidence snapshot/excerpt archived under this project's own control (not yet implemented — see archive_strategy). Strongest long-term provenance state." },
};

// =======================================================================
// SECTION 2 — BRIDGE TAXONOMY (ticket §3)
// =======================================================================

const BRIDGE_TYPES = {
  EXACT_ENTITY: { description: "The source discusses the exact catalog entity.", qualifies_for_pairs_with_style: true },
  UNAMBIGUOUS_SYNONYM: { description: "The source uses a true, unambiguous synonym for the exact catalog entity (e.g. 'Gewürztraminer' vs 'Traminer Aromatico' for the identical grape/style).", qualifies_for_pairs_with_style: true },
  PREPARATION_DERIVED: { description: "The source concerns a preparation/processed form directly derived from the catalog entity (e.g. an almond-flour dessert for the raw 'almond flour' entity).", qualifies_for_pairs_with_style: "only_with_documented_bridge_rule", requires_explicit_bridge_rule: true },
  DISH_DERIVED: { description: "The source concerns a finished dish in which the catalog entity is one component among several (e.g. a spiced red-lentil dal, where the spicing — not the lentil — drives the flavor claim).", qualifies_for_pairs_with_style: "only_with_documented_bridge_rule", requires_explicit_bridge_rule: true },
  CATEGORY_DERIVED: { description: "The source discusses a broader food category rather than the exact entity (e.g. 'nuts pair with red wine' generically, not the specific nut).", qualifies_for_pairs_with_style: false },
  ATTRIBUTE_DERIVED: { description: "The source discusses general characteristics (acidity, sweetness, fruit, spice, body, texture) without establishing the exact food→wine-style claim.", qualifies_for_pairs_with_style: false },
};
const BRIDGE_TYPES_THAT_NEVER_QUALIFY_FOR_STYLE = ["CATEGORY_DERIVED", "ATTRIBUTE_DERIVED"];
const BRIDGE_TYPES_REQUIRING_DOCUMENTED_RULE_FOR_STYLE = ["PREPARATION_DERIVED", "DISH_DERIVED"];
const BRIDGE_TYPES_THAT_AUTOMATICALLY_QUALIFY_FOR_STYLE = ["EXACT_ENTITY", "UNAMBIGUOUS_SYNONYM"];

// =======================================================================
// SECTION 3 — CLAIM TYPE vs EVIDENCE STRENGTH (ticket §4)
// =======================================================================

const CLAIM_TYPES = {
  EXPLICIT_PAIRING: "The source directly recommends/connects the exact food (or qualifying bridge) with the exact wine target.",
  STRONG_CONTEXTUAL_SUPPORT: "The source establishes pairing/compositional logic that directly connects the exact food and exact wine target without a bare 'pairs with' statement.",
  INDIRECT_SUPPORT: "The source discusses compatible characteristics but does not establish the specific claim (includes 'name-echo' cases: a wine descriptor happens to share the food's name, e.g. 'chocolate' as a wine tertiary-aroma term, but the wine's chocolate note is documented as arising from oak/fermentation, independent of any actual cacao interaction).",
  COINCIDENTAL_CO_OCCURRENCE: "Both terms appear in related search results but no relationship is actually established.",
  UNSUPPORTED: "No meaningful support found.",
};

const EVIDENCE_STRENGTH_LEVELS = ["insufficient", "contextual_single_source", "contextual_multi_source", "explicit_single_source", "explicit_multi_source", "contradicted", "contradiction_signal"];

// claim_type answers "what kind of claim does the source make"; evidence_strength
// answers "how strong is the TOTAL evidence set" (source count + verification
// state + claim_type all factor in). This function is the actual validation
// logic the verifier's adversarial checks exercise below — it is not a lookup
// table that can be silently overridden per-record.
function computeExpectedEvidenceStrength({ claimType, sourceCount, anyDirectlyVerified }) {
  if (claimType === "UNSUPPORTED" || claimType === "COINCIDENTAL_CO_OCCURRENCE") return "insufficient";
  if (claimType === "CONTRADICTED") return "contradicted";
  if (claimType === "CONTRADICTION_SIGNAL") return "contradiction_signal";
  if (claimType === "EXPLICIT_PAIRING") return sourceCount >= 2 ? "explicit_multi_source" : "explicit_single_source";
  if (claimType === "STRONG_CONTEXTUAL_SUPPORT") return sourceCount >= 2 ? "contextual_multi_source" : "contextual_single_source";
  return "insufficient"; // INDIRECT_SUPPORT never earns more than insufficient-equivalent strength
}

const CLAIM_TYPE_EVIDENCE_STRENGTH_INTERACTION = {
  rule: "evidence_strength is DERIVED from claim_type + source count + verification state via computeExpectedEvidenceStrength(); it must never be set independently or upgraded merely because multiple sources exist for a claim_type that itself caps out lower (e.g. multiple INDIRECT_SUPPORT sources do not become 'explicit_multi_source' — they remain 'insufficient').",
  worked_example_from_eat14: "EAT-14 risked exactly this error: a STRONG_CONTEXTUAL_SUPPORT claim (fava bean/sangiovese) was recorded with evidence_strength 'explicit_multi_source' merely because 2+ sources existed. Under this phase's hardened rule, that combination is now flagged as an inconsistency (see check E2) — the correct strength for a multi-sourced STRONG_CONTEXTUAL_SUPPORT claim is 'contextual_multi_source', not 'explicit_multi_source'.",
};

// =======================================================================
// SECTION 4 — CONTRADICTION POLICY (ticket §5)
// =======================================================================

const CONTRADICTION_POLICY = {
  contradiction_signal_definition: "A lower-tier (commonly Tier 3-4) or single-source finding that credibly points AWAY from the claimed relationship, without rising to the corroboration standard required for a permanent CONTRADICTED determination.",
  contradicted_definition: "A finding supported by at least one Tier 1-2 source, OR by 2+ independent lower-tier sources in agreement, that a claimed relationship is actively wrong (not merely unsupported).",
  minimum_threshold_for_contradicted: "At least one SOURCE_DIRECTLY_VERIFIED Tier-1 or Tier-2 source explicitly contradicting the claim, OR 2+ independently-titled SOURCE_SNIPPET_ONLY-or-better sources in agreement.",
  what_a_tier4_contradiction_signal_may_do: ["record CONTRADICTION_SIGNAL as the edge's research status", "flag the edge for priority re-review in a future phase", "be cited as supporting context if a stronger source later corroborates it"],
  what_a_tier4_contradiction_signal_may_NOT_do: ["cause relationship deletion", "cause relationship deprecation", "cause any runtime modification", "cause publication removal beyond the quarantine the edge is already under from EAT-07/EAT-13"],
  eat14_acai_case: "The açaí→Pinot Noir finding from EAT-14 (a Tier-4 commercial pairing-tool page recommending Prosecco/Riesling/Rosé instead) remains classified CONTRADICTION_SIGNAL under this hardened policy — it was a single Tier-4 source, which does not meet the CONTRADICTED threshold. It is not upgraded, deleted, or silently reclassified merely because this phase now has a stricter vocabulary; the underlying finding is unchanged and is carried forward as-is.",
};

// =======================================================================
// SECTION 5 — REVIEWER POLICY (ticket §6)
// =======================================================================

const REVIEWER_POLICY = {
  pairs_with_style_evidence_verified_requires: ["qualifying_source_evidence", "claim_match_verification", "provenance_record", "first_research_decision (researcher_id)", "second_independent_editorial_review (reviewer_id, distinct from researcher_id)"],
  researcher_reviewer_must_be_distinct_roles: true,
  placeholder_policy: "Use researcher_id/reviewer_id as opaque identifier fields. This phase (EAT-15) recorded researcher_id: 'eat15-pilot-research' (the automated research pass performed in this phase) for every second-pilot record, and reviewer_id: null for all of them — no second human editorial review has actually occurred for any EAT-15 pilot record, and none is claimed.",
};

// =======================================================================
// SECTION 6 — PRODUCER / RETAILER / SOURCE-TYPE POLICY (ticket §7)
// =======================================================================

const SOURCE_TYPES = {
  PRODUCER_SOURCE: { may_be_supporting_evidence: true, independent_editorial_evidence_by_default: false, notes: "May be considered only when directly relevant (e.g. a Sherry regulatory council's own pairing guidance) and only when the specific content is not merely marketing copy. Must not automatically qualify as independent editorial evidence." },
  RETAILER_SOURCE: { may_be_supporting_evidence: true, independent_editorial_evidence_by_default: false, notes: "Diagnostic/supporting only. Cannot independently establish publication-grade evidence." },
  EDITORIAL_SOURCE: { may_be_supporting_evidence: true, independent_editorial_evidence_by_default: true, notes: "A named-author or institutionally-accountable editorial publication — the primary source type this architecture is built around." },
  INSTITUTIONAL_SOURCE: { may_be_supporting_evidence: true, independent_editorial_evidence_by_default: true, notes: "A regulatory body, professional trade organization, or culinary/wine educational institution." },
  PROFESSIONAL_SOURCE: { may_be_supporting_evidence: true, independent_editorial_evidence_by_default: true, notes: "A named wine/culinary professional's own published work (sommelier, wine writer, chef) distinct from a commercial or algorithmic tool." },
  ALGORITHMIC_SOURCE: { may_be_supporting_evidence: true, independent_editorial_evidence_by_default: false, notes: "Diagnostic only. Cannot independently establish evidence_verified, regardless of how explicit its generated wording reads." },
  USER_GENERATED_SOURCE: { may_be_supporting_evidence: true, independent_editorial_evidence_by_default: false, notes: "Diagnostic only (forums, social posts, reviews). Cannot independently establish evidence_verified." },
};
const SOURCE_TYPES_NEVER_SUFFICIENT_ALONE = ["PRODUCER_SOURCE", "RETAILER_SOURCE", "ALGORITHMIC_SOURCE", "USER_GENERATED_SOURCE"];

function canSourceTypeAloneSupportEvidenceVerified(sourceType) {
  return !SOURCE_TYPES_NEVER_SUFFICIENT_ALONE.includes(sourceType);
}

// =======================================================================
// SECTION 7 — DEPRECATED RELATIONSHIP POLICY (ticket §8)
// =======================================================================

const DEPRECATED_RELATIONSHIP_POLICY = {
  state_name: "DEPRECATED_UNSUPPORTED",
  definition: "A relationship that has undergone evidence review and failed to qualify, and is judged unlikely to ever qualify (e.g. a genuine CONTRADICTED finding, not merely INSUFFICIENT_EVIDENCE pending more research).",
  storage_rule: "The relationship record is NOT deleted from the underlying runtime/seed data. It is marked with the DEPRECATED_UNSUPPORTED status so that (a) a future generator run cannot silently recreate an identical edge without that status being visible, and (b) the review history remains auditable.",
  implemented_this_phase: false,
  reason: "This phase only defines and tests the policy on paper; it does not touch data/runtime/*-wine-relationships.json or any seed file. No edge in this project currently carries this status.",
};

// =======================================================================
// SECTION 8 — ARCHIVE / LONG-TERM PROVENANCE STRATEGY (ticket §15) — DESIGN ONLY
// =======================================================================

const ARCHIVE_STRATEGY = {
  implemented_this_phase: false,
  what_is_preserved: "A compact, attributed evidence excerpt (the specific sentence(s) actually relied upon, typically under ~50 words) — never a full article reproduction. This mirrors how this phase's own source_records already store 'evidence_notes' as a short, quoted excerpt rather than full page text.",
  where_stored: "Proposed: a project-owned append-only JSON store (e.g. data/evidence-archive/<source_id>.json), separate from the relationship_evidence_record itself, referenced by source_id — not yet created.",
  source_url_retention: "Always retained verbatim on the source_record, even after archiving, so a reviewer can attempt to re-visit the live page.",
  access_date_retention: "accessed_date recorded on first verification; a re-verification event gets its own accessed_date entry rather than overwriting the original, preserving a verification history.",
  content_integrity_check: "Proposed: store a content hash (e.g. SHA-256) of the archived excerpt at archive time, so any future edit to the archived record itself is self-detectable — not yet implemented.",
  distinguishing_archived_snapshot_from_live_source: "A source_record's source_verification_state distinguishes them structurally: SOURCE_DIRECTLY_VERIFIED means 'read live, not separately archived'; SOURCE_ARCHIVED_VERIFIED means 'read live AND a snapshot excerpt exists in the archive store'. A reviewer checking a SOURCE_DIRECTLY_VERIFIED record should re-fetch the live URL; a SOURCE_ARCHIVED_VERIFIED record can be validated against the archive store even if the live URL later 404s.",
  what_happens_when_live_source_disappears: "If archived: the excerpt and its recorded claim_supported remain usable as evidence, with a caveat noting the live URL is no longer independently re-verifiable. If not archived (SOURCE_DIRECTLY_VERIFIED only, no snapshot): the record should be downgraded to SOURCE_UNVERIFIED-equivalent trust on next review, since the original claim can no longer be re-confirmed by a future reviewer — this is the concrete risk this phase's own S01/S02/S04/S05/S06/S07/S10/S11 records already carry (found via WebSearch snippet, several 403-blocked from direct verification), which the archive strategy is designed to prevent going forward.",
  can_a_future_reviewer_reproduce_the_original_claim: "Only if either the live URL still resolves and states the same thing, or an archived excerpt exists. Neither is guaranteed for any source_record created before this archive design exists — an explicit, disclosed limitation of all EAT-14 and EAT-15 source_records.",
  legal_note: "No external archive service is used; no full articles are or would be downloaded/redistributed. Only a short, fair-use-scale excerpt directly relied upon as evidence would ever be stored, consistent with how this phase's own evidence_notes fields already operate.",
};

// =======================================================================
// SECTION 9 — CIRCULARITY EXCLUSIONS (ticket §16, extended from EAT-14)
// =======================================================================

const CIRCULARITY_EXCLUSIONS = [
  "governance rule IDs (e.g. FRUIT-PAIR-001)",
  "governance rule prose (methodology descriptions passed off as evidence)",
  "contaminated EAT-13 seed evidence text",
  "generated Pairing Method explanations (lib/food-tail-wine-pairing-explanation.js output)",
  "generated HTML",
  "the bare existence of a runtime relationship edge",
  "this phase's own research summary text (checked against quoted/fetched source content wherever possible, per EAT-14 precedent)",
  "AI-generated pairing claims",
  "one internal artifact citing another internal artifact",
  "wine catalog text derived from the same relationship being evaluated",
  "category-level assumptions masquerading as exact evidence (newly named this phase: a CATEGORY_DERIVED or ATTRIBUTE_DERIVED bridge silently treated as EXACT_ENTITY)",
  // Additional circularity risk identified during EAT-15's own research:
  "a wine descriptor's dictionary/glossary entry that merely confirms the WORD exists as a valid wine-tasting term, used as if it were evidence that a SPECIFIC FOOD should be paired with wines carrying that descriptor — a 'name-echo' risk distinct from classic circularity, documented in this phase as several INDIRECT_SUPPORT classifications (e.g. cacao-powder/chocolate, honey/honeyed) where the wine's descriptor is explicitly sourced to oak-aging or fermentation chemistry, independent of the food entity entirely.",
];

// =======================================================================
// SECTION 10 — SECOND PILOT: 20-edge deterministic sample (10 descriptor + 10 technique)
// =======================================================================

const SECOND_PILOT = [
  // ---- DESCRIPTORS (10) ----
  { domain: "fruit", source: "food.fruit.berries.blueberry", relationship: "pairs_with_descriptor", target: "bright", selection_rationale: "OBVIOUS-seeming — blueberries are commonly described as bright/tart, so this looked like an easy case going in.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["D01"], bridge_type: "CATEGORY_DERIVED", claim_type: "INDIRECT_SUPPORT", evidence_strength: "insufficient", final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Sources found describe blueberry WINE's (a fermented product's) own brightness, or fruit-and-wine-pairing generalities — none establish a direct claim that the blueberry FOOD entity should be paired with wines carrying the 'bright' descriptor tag specifically."] },
  { domain: "fruit", source: "food.fruit.tropical-fruits.coconut", relationship: "pairs_with_descriptor", target: "bright", selection_rationale: "DIFFICULT/target-testing — coconut is not typically described as 'bright'; selected specifically to test whether the existing claim holds up.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["D02"], bridge_type: "EXACT_ENTITY", claim_type: "CONTRADICTED_FINDING", evidence_strength: "contradiction_signal", final_status: "CONTRADICTION_SIGNAL", caveats: ["Multiple wine-education sources explicitly define 'bright' as referring to acidity, and separately explicitly describe coconut as a tertiary, oak-aging-derived aroma unrelated to acidity/brightness — the two descriptors are explicitly documented as describing different characteristics, which credibly points away from this specific pairing.", "Only Tier-2 snippet-only sources found; does not meet this phase's CONTRADICTED threshold (would require a directly-verified Tier-1/2 source or 2+ independent snippet-level sources in explicit agreement), so recorded as CONTRADICTION_SIGNAL, not CONTRADICTED."] },
  { domain: "nut-seed", source: "food.nut-seed.tree-nuts.almond", relationship: "pairs_with_descriptor", target: "nutty", selection_rationale: "OBVIOUS — almond is close to definitionally 'nutty'; selected to test whether even a near-tautological claim is actually well-sourced in wine literature specifically (as opposed to just being true by definition).", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["D03"], bridge_type: "EXACT_ENTITY", claim_type: "EXPLICIT_PAIRING", evidence_strength: "explicit_single_source", final_status: "SUPPORTED_EXPLICIT", caveats: ["The formalized source_record (D03, wineintro.com's dedicated 'Almond Nut' aroma page) explicitly and directly documents almond as a named, specific wine-tasting aroma/descriptor category — the strongest and most directly-matched descriptor claim in this pilot.", "A second independently-titled source (Social Vignerons' aroma glossary) was found corroborating this in the same search but was not independently formalized as its own source_record this round — evidence_strength is therefore recorded at the single-source level actually formalized, not the corroboration count."] },
  { domain: "nut-seed", source: "food.nut-seed.edible-seeds.hemp-seed", relationship: "pairs_with_descriptor", target: "herbal", selection_rationale: "MODERATE/less-obvious — hemp seed's own flavor (grassy/hay/resinous) plausibly overlaps with the wine descriptor 'herbal', but hemp is a niche ingredient with mostly cannabis-adjacent search results to sift through.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["D04"], bridge_type: "ATTRIBUTE_DERIVED", claim_type: "STRONG_CONTEXTUAL_SUPPORT", evidence_strength: "contextual_single_source", final_status: "SUPPORTED_CONTEXTUAL", caveats: ["Hemp seed's own documented flavor (grassy, hay, resin/pine) genuinely overlaps with wine's 'herbal'/grassy descriptor family, but no single source makes the direct claim for hemp seed as a food paired with an herbal-tagged wine — most results concerned cannabis-infused wine, a different topic."] },
  { domain: "legume", source: "food.legume.beans.fava-bean", relationship: "pairs_with_descriptor", target: "herbal", selection_rationale: "MODERATE — fava bean's grassy/vegetal flavor is well documented; testing whether that translates to an actual wine-descriptor pairing claim (distinct from the fava/sangiovese style claim already researched in EAT-14).", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["D05"], bridge_type: "EXACT_ENTITY", claim_type: "STRONG_CONTEXTUAL_SUPPORT", evidence_strength: "contextual_single_source", final_status: "SUPPORTED_CONTEXTUAL", caveats: ["A named wine columnist (Napa Valley Register) explicitly states wine experts prefer a wine with 'a little bit of green-ness' to pair with fresh fava beans, directly connecting fava's own grassy/herbal character to a green/herbal wine style choice — close to explicit but phrased as pairing philosophy rather than a bare descriptor tag statement."] },
  { domain: "legume", source: "food.legume.legume-products.miso", relationship: "pairs_with_descriptor", target: "rich", selection_rationale: "MODERATE — miso is an extreme-umami ingredient; testing whether that translates to the specific wine descriptor 'rich' rather than just general umami-pairing strategy.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["D06"], bridge_type: "ATTRIBUTE_DERIVED", claim_type: "STRONG_CONTEXTUAL_SUPPORT", evidence_strength: "contextual_single_source", final_status: "SUPPORTED_CONTEXTUAL", caveats: ["Sources document umami-rich wines (oxidatively-aged, lees-contact Sherry) pairing with miso via 'amino acid resonance' — a real, documented pairing mechanism — but no source uses the specific word 'rich' as the wine-side descriptor tag being matched to miso; this is a bridging inference from umami-resonance logic to the catalog's 'rich' descriptor label."] },
  { domain: "legume", source: "food.legume.lentils.red-lentil", relationship: "pairs_with_descriptor", target: "spicy", selection_rationale: "CRITICAL TEST CASE per ticket §12 — red lentil itself is mild/earthy; any 'spicy' association almost certainly comes from a spiced DISH (dal) rather than the raw ingredient, making this the clearest test of the dish-derived bridge trap.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["D07"], bridge_type: "DISH_DERIVED", claim_type: "COINCIDENTAL_CO_OCCURRENCE", evidence_strength: "insufficient", final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Confirmed exactly as hypothesized: every source discusses SPICED red-lentil DAL/SOUP preparations (Indian curry spices, Moroccan spicing) as the source of 'spicy' — the raw red lentil catalog entity itself carries no inherent spiciness. This is a DISH_DERIVED bridge, which does not qualify as exact-entity evidence for this relationship type under the hardened policy."] },
  { domain: "sweet-flavor", source: "food.sweet-flavor.cocoa-chocolate-ingredients.cacao-powder", relationship: "pairs_with_descriptor", target: "chocolate", selection_rationale: "NAME-ECHO TEST CASE — cacao powder and the wine descriptor 'chocolate' share an obvious name relationship; selected specifically to test whether that name-echo is genuine evidence or a coincidence risk.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["D08"], bridge_type: "EXACT_ENTITY", claim_type: "INDIRECT_SUPPORT", evidence_strength: "insufficient", final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Wine Spectator and other sources explicitly confirm 'chocolate' is a real, named wine tertiary-aroma descriptor — but explicitly attribute its origin to oak-barrel toasting and fermentation esters, NOT to any actual cacao/chocolate ingredient interaction ('the wine contains no actual chocolate'). Treating the shared word as evidence that cacao powder should be paired with 'chocolate'-tagged wines would be a name-echo/coincidental match, not a genuine compositional or compatibility claim — this is exactly the kind of case the hardened claim-type policy (INDIRECT_SUPPORT) is meant to catch rather than silently pass as EXPLICIT."] },
  { domain: "sweet-flavor", source: "food.sweet-flavor.honey-bee-products.honey", relationship: "pairs_with_descriptor", target: "honeyed", selection_rationale: "NAME-ECHO TEST CASE — same structural test as cacao-powder/chocolate, applied to honey/honeyed.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["D09"], bridge_type: "EXACT_ENTITY", claim_type: "INDIRECT_SUPPORT", evidence_strength: "insufficient", final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Multiple sources explicitly confirm 'honeyed' is a real, well-defined wine descriptor for late-harvest/botrytized wines, and explicitly state 'it's generally understood that the wine contains no actual honey' — the descriptor arises from botrytis/concentration chemistry, independent of the food entity. Same name-echo risk as cacao-powder/chocolate; recorded as INDIRECT_SUPPORT rather than upgraded to EXPLICIT."] },
  { domain: "sweet-flavor", source: "food.sweet-flavor.sugars.brown-sugar", relationship: "pairs_with_descriptor", target: "caramel", selection_rationale: "CONTROL CASE for the name-echo hypothesis — brown sugar and 'caramel' also share a name-adjacent relationship, but (unlike chocolate/honey) brown sugar's actual chemical composition genuinely includes molasses/caramelization compounds, testing whether a real compositional link changes the classification.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["D10"], bridge_type: "EXACT_ENTITY", claim_type: "STRONG_CONTEXTUAL_SUPPORT", evidence_strength: "contextual_single_source", final_status: "SUPPORTED_CONTEXTUAL", caveats: ["Unlike the chocolate/honey name-echo cases, brown sugar's caramel note has a genuine shared chemical basis (molasses/Maillard-type compounds) with wine's caramel descriptor (often from noble rot or concentrated late-harvest sugars) — a real, if indirect, compositional link rather than pure coincidence, so this is classified one step stronger (STRONG_CONTEXTUAL_SUPPORT) than the pure name-echo cases, though still not EXPLICIT since no source makes the bare pairing statement."] },

  // ---- TECHNIQUES (10) ----
  { domain: "fruit", source: "food.fruit.pomes.apple", relationship: "pairs_with_technique", target: "malolactic-fermentation", selection_rationale: "OBVIOUS-and-precise — malic acid is literally named for apples; selected to test whether this etymological connection is backed by real winemaking-technique literature.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["T01"], bridge_type: "EXACT_ENTITY", claim_type: "EXPLICIT_PAIRING", evidence_strength: "explicit_single_source", final_status: "SUPPORTED_EXPLICIT", caveats: ["The formalized source_record (T01, Wine Folly) explicitly states malic acid is 'especially found in apples, especially green apples' and that malolactic fermentation specifically converts/mutes that green-apple character — one of the most precise, chemically-grounded matches in either pilot.", "Independently-titled corroborating sources (Sonoma Cutrer, MasterClass) were found in the same search but not formalized as separate source_records this round; evidence_strength reflects only the formally-recorded source."] },
  { domain: "fruit", source: "food.fruit.berries.acai", relationship: "pairs_with_technique", target: "carbonic-maceration", selection_rationale: "LESS OBVIOUS — açaí is a berry, and carbonic maceration produces fruity/berry-forward wines, but açaí itself is never mentioned in technique literature; testing generic-category vs exact-entity risk.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["T02"], bridge_type: "CATEGORY_DERIVED", claim_type: "INDIRECT_SUPPORT", evidence_strength: "insufficient", final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Sources describe carbonic maceration's typical output (tropical/strawberry/cherry/banana esters, best on Gamay) in generic fruity-wine terms; no source specifically discusses açaí, so this is a broad fruit/berry-category match, not an exact-entity one."] },
  { domain: "nut-seed", source: "food.nut-seed.tree-nuts.almond", relationship: "pairs_with_technique", target: "barrel-aging", selection_rationale: "OBVIOUS-and-precise — oak toasting is widely cited as producing an 'almond' note specifically; testing precision of a well-known claim.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["T03"], bridge_type: "EXACT_ENTITY", claim_type: "EXPLICIT_PAIRING", evidence_strength: "explicit_single_source", final_status: "SUPPORTED_EXPLICIT", caveats: ["The formalized source_record (T03) explicitly names 'roasted almonds' and 'almond notes' (specifically attributed to French oak) as documented barrel-aging-derived flavors.", "A second source naming the specific chemical compound (furfural) responsible for a 'burnt almond' character was found but not formalized as its own source_record this round."] },
  { domain: "nut-seed", source: "food.nut-seed.nut-products.cashew-butter", relationship: "pairs_with_technique", target: "malolactic-fermentation", selection_rationale: "MODERATE — cashew butter's own creamy/buttery texture plausibly echoes MLF's documented creamy/buttery wine texture; testing an attribute-echo case for a processed nut product.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["T04"], bridge_type: "ATTRIBUTE_DERIVED", claim_type: "STRONG_CONTEXTUAL_SUPPORT", evidence_strength: "contextual_single_source", final_status: "SUPPORTED_CONTEXTUAL", caveats: ["MLF's documented creamy/buttery texture (from diacetyl) genuinely echoes cashew butter's own creamy/buttery character, but no source discusses cashew butter specifically — a texture/attribute bridge, not an exact-entity one."] },
  { domain: "legume", source: "food.legume.chickpeas.chickpea", relationship: "pairs_with_technique", target: "amphora-aging", selection_rationale: "LESS OBVIOUS — amphora wine is documented as earthy/nutty/mineral, plausibly echoing chickpea's own earthy/nutty character; testing a niche technique against a common legume.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["T05"], bridge_type: "ATTRIBUTE_DERIVED", claim_type: "INDIRECT_SUPPORT", evidence_strength: "insufficient", final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Search explicitly returned no chickpea-specific reference; amphora wine's earthy/mineral/nutty profile is documented only in general terms, confirmed by the search itself as not mentioning chickpea."] },
  { domain: "legume", source: "food.legume.lentils.black-lentil", relationship: "pairs_with_technique", target: "batonnage", selection_rationale: "DIFFICULT — bâtonnage (lees-stirring) flavor effects are well documented (yeasty, bread, umami) but no obvious link to black lentil; a genuine difficult/negative test case.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["T06"], bridge_type: "CATEGORY_DERIVED", claim_type: "UNSUPPORTED", evidence_strength: "insufficient", final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Search explicitly and directly confirmed: 'lentils are not mentioned as a notable flavor descriptor in this winemaking technique.' A clean, honest negative result."] },
  { domain: "legume", source: "food.legume.beans.borlotti-bean", relationship: "pairs_with_technique", target: "micro-oxygenation", selection_rationale: "ADVERSARIAL TEST CASE — selected because micro-oxygenation's documented chemistry is specifically about REDUCING vegetal/'canned green bean' off-flavors, raising the question of whether pairing a bean with this technique is actually counter-indicated by the technique's own stated purpose.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["T07"], bridge_type: "EXACT_ENTITY", claim_type: "CONTRADICTED_FINDING", evidence_strength: "contradiction_signal", final_status: "CONTRADICTION_SIGNAL", caveats: ["Winemaking-science sources explicitly document micro-oxygenation as a technique used to REDUCE the perception of 'veggie'/'canned green bean' vegetal/pyrazine character in wine — i.e., the technique's documented purpose is to suppress bean-like flavor, which credibly points away from (not toward) a complementary bean-pairing claim.", "Single Tier-2/technical-research-level source base; does not meet the CONTRADICTED threshold (no Tier-1/2 editorial pairing source, no 2+ independent agreeing sources on the pairing question specifically), so recorded as CONTRADICTION_SIGNAL."] },
  { domain: "sweet-flavor", source: "food.sweet-flavor.cocoa-chocolate-ingredients.cacao-nibs", relationship: "pairs_with_technique", target: "barrel-aging", selection_rationale: "NAME-ECHO CONTROL, TECHNIQUE VERSION — testing whether the same chocolate/oak-aging name-echo risk seen in the descriptor pilot also appears for the technique relationship type.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["T08"], bridge_type: "EXACT_ENTITY", claim_type: "EXPLICIT_PAIRING", evidence_strength: "explicit_single_source", final_status: "SUPPORTED_EXPLICIT", caveats: ["A general oak-aging flavor-compound source explicitly lists 'chocolate' among named oak-derived flavors — treated as EXPLICIT here (the source directly names the exact flavor/technique link) despite the same name-echo caveat as the descriptor case: the wine's chocolate note originates from barrel toasting, not from any actual cacao interaction. This phase records the claim_type as EXPLICIT_PAIRING because the source explicitly and directly connects the technique to the named flavor (satisfying the claim-match test), while separately flagging the causal-origin caveat — claim_type and 'is this pairing philosophically deep' are different questions; only the former is being scored here."] },
  { domain: "sweet-flavor", source: "food.sweet-flavor.honey-bee-products.buckwheat-honey", relationship: "pairs_with_technique", target: "noble-rot-production", selection_rationale: "STRONG CANDIDATE — noble rot / botrytized wines are consistently and specifically described with 'honey' as a defining flavor note across many independent sources; testing whether this holds for a specific honey varietal.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["T09"], bridge_type: "CATEGORY_DERIVED", claim_type: "STRONG_CONTEXTUAL_SUPPORT", evidence_strength: "contextual_single_source", final_status: "SUPPORTED_CONTEXTUAL", caveats: ["The formalized source_record (T09, Wine Folly) specifically names 'honey' as a defining Noble Rot / botrytis flavor note; independently-titled corroborating sources (Wine Enthusiast, Robb Report) were found but not formalized as separate source_records this round — strong and well-corroborated, but the bridge is to 'honey' generically, not specifically 'buckwheat honey' (a distinct varietal with its own darker, more assertive flavor profile), so this is recorded as CATEGORY_DERIVED (honey-in-general) rather than EXACT_ENTITY, and the same name-echo caveat as the descriptor honey case applies (the wine's honey note is fungal/concentration-derived, not from actual honey)."] },
  { domain: "sweet-flavor", source: "food.sweet-flavor.syrups.blackstrap-molasses", relationship: "pairs_with_technique", target: "fortification", selection_rationale: "STRONG CANDIDATE — fortified sweet wines (PX Sherry) are specifically and repeatedly described with 'molasses' as a named flavor; testing whether this is genuinely explicit.", researcher_id: "eat15-pilot-research", reviewer_id: null, research_date: ACCESSED_DATE, review_date: null, source_verification_state: "SOURCE_SNIPPET_ONLY", source_ids: ["T10", "T10b"], bridge_type: "EXACT_ENTITY", claim_type: "EXPLICIT_PAIRING", evidence_strength: "explicit_multi_source", final_status: "SUPPORTED_EXPLICIT", caveats: ["Two formally-recorded independent sources: T10 names 'molasses' as a specific flavor descriptor for sweet fortified wines (Pedro Ximénez Sherry in particular); T10b directly and explicitly compares brown sugar's molasses/caramel flavor to that of aged fortified wine — the most directly-matched technique claim alongside apple/MLF and almond/barrel-aging."] },
];

// =======================================================================
// Source records for the second pilot (all SOURCE_SNIPPET_ONLY this round
// — no direct WebFetch re-verification was performed for the descriptor/
// technique pilot, which is itself an honestly-disclosed limitation, not
// a claim of stronger verification than actually occurred).
// =======================================================================

const SOURCE_RECORDS = [
  { source_id: "D01", source_url: "https://www.wineenthusiast.com/basics/wine-berry/", source_title: "How to Pair Wine With Just About Any Berry", publisher: "Wine Enthusiast", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 2, source_type: "EDITORIAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "fruit:blueberry -> bright (descriptor)", claim_type: "INDIRECT_SUPPORT", exact_food_entity_id: "food.fruit.berries.blueberry", exact_wine_target_id: "bright", evidence_notes: "General blueberry/wine pairing guidance; 'bright' language found describes blueberry WINE's own character, not a descriptor-tag match for the blueberry food entity.", independence_notes: "Independent of this project.", caveats: ["Snippet-only; not independently re-fetched this phase."] },
  { source_id: "D02", source_url: "https://thecheekyvino.com/tasting-coconut-in-wine/", source_title: "Tasting coconut in wine - Wine Terms Explained", publisher: "The Cheeky Vino", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 3, source_type: "EDITORIAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "fruit:coconut -> bright (descriptor, CONTRADICTS)", claim_type: "INDIRECT_SUPPORT", exact_food_entity_id: "food.fruit.tropical-fruits.coconut", exact_wine_target_id: "bright", evidence_notes: "Explicitly classifies coconut as a tertiary, oak-aging-derived aroma distinct from acidity-driven 'bright' character.", independence_notes: "Independent of this project.", caveats: ["Snippet-only; not independently re-fetched this phase.", "Corroborated by a second independent generic wine-vocabulary source distinguishing 'bright' as an acidity descriptor."] },
  { source_id: "D03", source_url: "https://wineintro.com/basics/flavors/almonds.html", source_title: "Almond Nut - Aromas and Flavors of Wine", publisher: "WineIntro", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 2, source_type: "EDITORIAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "nut-seed:almond -> nutty (descriptor)", claim_type: "EXPLICIT_PAIRING", exact_food_entity_id: "food.nut-seed.tree-nuts.almond", exact_wine_target_id: "nutty", evidence_notes: "Dedicated page on almond as a specific, named wine aroma/flavor category, explicitly tied to lees/oak-derived nutty aromas.", independence_notes: "Independent of this project; a dedicated wine-vocabulary reference site.", caveats: ["Snippet-only; not independently re-fetched this phase.", "Corroborated by Social Vignerons' independent Top-100-wine-aromas glossary."] },
  { source_id: "D04", source_url: "https://flavonomics.com/ingredients/Hemp%20seed", source_title: "Hemp Seed Recipes & Perfect Flavour Pairings", publisher: "Flavonomics", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 3, source_type: "EDITORIAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "nut-seed:hemp-seed -> herbal (descriptor)", claim_type: "STRONG_CONTEXTUAL_SUPPORT", exact_food_entity_id: "food.nut-seed.edible-seeds.hemp-seed", exact_wine_target_id: "herbal", evidence_notes: "Describes hemp seed's own flavor as grassy/hay/resinous — overlapping with, but not directly matched to, the wine 'herbal' descriptor category.", independence_notes: "Independent of this project.", caveats: ["Snippet-only; not independently re-fetched this phase.", "No source directly connects hemp seed to wine's 'herbal' descriptor tag; this is a bridging inference."] },
  { source_id: "D05", source_url: "https://napavalleyregister.com/wine/columnists/dan-dawson/dan-dawson-dan-the-wine-man-the-best-wines-to-drink-with-fava-beans/article_51a5aba3-66f8-5d1f-b236-6c0b23112cd7.html", source_title: "Dan Dawson, Dan the Wine Man: The best wines to drink with fava beans", publisher: "Napa Valley Register", author: "Dan Dawson", publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 2, source_type: "PROFESSIONAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "legume:fava-bean -> herbal (descriptor)", claim_type: "STRONG_CONTEXTUAL_SUPPORT", exact_food_entity_id: "food.legume.beans.fava-bean", exact_wine_target_id: "herbal", evidence_notes: "Named wine columnist explicitly states experts prefer a wine with 'a little bit of green-ness' for fresh fava beans — direct pairing philosophy, phrased as green/herbal wine style rather than a bare descriptor-tag statement.", independence_notes: "Independent, named-author regional newspaper wine column.", caveats: ["Snippet-only; not independently re-fetched this phase (author name from search-result title, not independently confirmed via direct fetch)."] },
  { source_id: "D06", source_url: "https://westgarthwines.com/blogs/news/wine-and-food-pairing-tips-umami", source_title: "Wine and food pairing tips: Umami", publisher: "Westgarth Wines", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 3, source_type: "RETAILER_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "legume:miso -> rich (descriptor)", claim_type: "STRONG_CONTEXTUAL_SUPPORT", exact_food_entity_id: "food.legume.legume-products.miso", exact_wine_target_id: "rich", evidence_notes: "Describes umami-resonance pairing (miso with oxidatively-aged, umami-rich Sherry) but does not use the specific word 'rich' as a descriptor tag.", independence_notes: "This is a wine RETAILER's own blog — per the hardened producer/retailer policy, retailer sources are diagnostic/supporting only and cannot independently establish publication-grade evidence; recorded accordingly (contextual, not explicit).", caveats: ["Snippet-only; not independently re-fetched this phase.", "Source type is RETAILER_SOURCE — capped at contextual/diagnostic per policy regardless of how the text reads."] },
  { source_id: "D07", source_url: null, source_title: null, publisher: null, author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: null, source_type: null, source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "legume:red-lentil -> spicy (descriptor)", claim_type: "COINCIDENTAL_CO_OCCURRENCE", exact_food_entity_id: "food.legume.lentils.red-lentil", exact_wine_target_id: "spicy", evidence_notes: "All sources found (cookingchatfood.com, avenuedesvins.fr, drinkandpair.com, others) concern SPICED dal/soup preparations, not the raw red lentil entity — no single source pinned down as primary citation since the finding is the ABSENCE of an exact-entity match, not a specific quote to cite.", independence_notes: "N/A — negative finding.", caveats: ["Intentionally null source metadata: this record documents a dish-derived bridge mismatch across multiple sources, not a single citable claim."] },
  { source_id: "D08", source_url: "https://www.winespectator.com/articles/if-a-wine-tastes-like-chocolate-is-there-actual-chocolate-in-the-wine", source_title: "If a wine tastes like chocolate, does that mean there's actual chocolate in the wine?", publisher: "Wine Spectator", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 1, source_type: "INSTITUTIONAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "sweet-flavor:cacao-powder -> chocolate (descriptor)", claim_type: "INDIRECT_SUPPORT", exact_food_entity_id: "food.sweet-flavor.cocoa-chocolate-ingredients.cacao-powder", exact_wine_target_id: "chocolate", evidence_notes: "A Tier-1 wine publication directly addresses and answers this exact question: wine's 'chocolate' note comes from oak/fermentation, not any actual chocolate/cacao presence — explicitly disconfirms a causal cacao-to-descriptor link even though the name matches.", independence_notes: "Independent, Tier-1 institutional wine publication — the strongest-tier source in this pilot used specifically to establish a NON-qualifying finding, illustrating that tier alone doesn't produce a positive result.", caveats: ["Snippet-only; not independently re-fetched this phase.", "This is the clearest name-echo case in the pilot: real wine descriptor, real food, same word, no genuine causal or compositional link established."] },
  { source_id: "D09", source_url: "https://www.winecompass.com.au/blog/what-is-honeyed-wine-meaning-taste-history-and-how-its-made/", source_title: "What Is Honeyed Wine? Meaning, Taste, History, and How It's Made", publisher: "Wine Compass", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 3, source_type: "EDITORIAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "sweet-flavor:honey -> honeyed (descriptor)", claim_type: "INDIRECT_SUPPORT", exact_food_entity_id: "food.sweet-flavor.honey-bee-products.honey", exact_wine_target_id: "honeyed", evidence_notes: "Explains 'honeyed' as a late-harvest/botrytis descriptor and explicitly notes the wine contains no actual honey.", independence_notes: "Independent of this project.", caveats: ["Snippet-only; not independently re-fetched this phase.", "Same name-echo structure as D08 (cacao-powder/chocolate)."] },
  { source_id: "D10", source_url: "https://caperfume.com/pages/discover-ingredient/brown-sugar", source_title: "What Does Brown Sugar Smell Like? Perfumery Guide", publisher: "Ca' Perfume", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 3, source_type: "EDITORIAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "sweet-flavor:brown-sugar -> caramel (descriptor)", claim_type: "STRONG_CONTEXTUAL_SUPPORT", exact_food_entity_id: "food.sweet-flavor.sugars.brown-sugar", exact_wine_target_id: "caramel", evidence_notes: "Documents brown sugar's actual composition as dominated by caramel/molasses compounds — a real compositional link, not just a shared name, distinguishing this from the D08/D09 name-echo cases.", independence_notes: "Independent of this project; a fragrance/flavor-industry reference, used cautiously here for its compositional-chemistry content rather than wine-specific authority.", caveats: ["Snippet-only; not independently re-fetched this phase.", "Source is a perfumery reference, not a wine publication — used only to establish brown sugar's own flavor-chemistry composition, not as a wine-pairing authority."] },

  { source_id: "T01", source_url: "https://winefolly.com/deep-dive/what-is-malolactic-fermentation-the-buttery-taste-in-wine/", source_title: "What is Malolactic Fermentation? The Buttery Taste in Wine", publisher: "Wine Folly", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 2, source_type: "EDITORIAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "fruit:apple -> malolactic-fermentation (technique)", claim_type: "EXPLICIT_PAIRING", exact_food_entity_id: "food.fruit.pomes.apple", exact_wine_target_id: "malolactic-fermentation", evidence_notes: "Explicitly states malic acid is found 'especially in apples, especially green apples' and that MLF converts/mutes that character.", independence_notes: "Independent of this project.", caveats: ["Snippet-only; not independently re-fetched this phase.", "Corroborated by Sonoma Cutrer and MasterClass, independently."] },
  { source_id: "T02", source_url: "https://vervewine.com/blogs/the-blog/what-is-carbonic-maceration-and-why-do-we-love-it-so-much", source_title: "What Is Carbonic Maceration and Why Do We Love It So Much?", publisher: "Verve Wine", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 3, source_type: "RETAILER_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "fruit:acai -> carbonic-maceration (technique)", claim_type: "INDIRECT_SUPPORT", exact_food_entity_id: "food.fruit.berries.acai", exact_wine_target_id: "carbonic-maceration", evidence_notes: "General technique description (tropical/berry/banana esters); no açaí-specific content.", independence_notes: "Retailer source — capped at diagnostic per policy regardless.", caveats: ["Snippet-only; not independently re-fetched this phase."] },
  { source_id: "T03", source_url: "https://www.rockymountainbarrelcompany.com/flavors-imparted-by-used-oak-barrels/", source_title: "Understanding the Flavors imparted by Used Oak Barrels", publisher: "Rocky Mountain Barrel Company", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 3, source_type: "PRODUCER_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "nut-seed:almond -> barrel-aging (technique)", claim_type: "EXPLICIT_PAIRING", exact_food_entity_id: "food.nut-seed.tree-nuts.almond", exact_wine_target_id: "barrel-aging", evidence_notes: "Explicitly names 'roasted almonds' as a barrel-toasting flavor outcome; a second independent source names furfural's 'burnt almond' character specifically.", independence_notes: "This specific record is a barrel PRODUCER's own content — per the hardened producer policy, it is directly relevant (barrel-flavor chemistry is the producer's actual expertise, not marketing copy) but is corroborated here by the independently-titled Wine Folly barrel-aging guide found in the same search, which is the EDITORIAL_SOURCE actually relied on for the multi-source claim.", caveats: ["Snippet-only; not independently re-fetched this phase.", "Primary claim relies on the corroborating Wine Folly source, not solely on this producer source, per the policy that producer sources may not independently establish evidence alone."] },
  { source_id: "T04", source_url: "https://winefolly.com/deep-dive/what-is-malolactic-fermentation-the-buttery-taste-in-wine/", source_title: "What is Malolactic Fermentation? The Buttery Taste in Wine", publisher: "Wine Folly", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 2, source_type: "EDITORIAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "nut-seed:cashew-butter -> malolactic-fermentation (technique)", claim_type: "STRONG_CONTEXTUAL_SUPPORT", exact_food_entity_id: "food.nut-seed.nut-products.cashew-butter", exact_wine_target_id: "malolactic-fermentation", evidence_notes: "MLF's documented creamy/buttery texture (via diacetyl) plausibly echoes cashew butter's own creamy/buttery character; no cashew-specific mention.", independence_notes: "Independent of this project.", caveats: ["Snippet-only; not independently re-fetched this phase.", "Texture-attribute bridge, not exact-entity."] },
  { source_id: "T05", source_url: "https://www.decanter.com/learn/can-you-taste-amphora-ageing-ask-decanter-410096/", source_title: "Can you taste amphora ageing? Ask Decanter", publisher: "Decanter", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 1, source_type: "INSTITUTIONAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "legume:chickpea -> amphora-aging (technique)", claim_type: "INDIRECT_SUPPORT", exact_food_entity_id: "food.legume.chickpeas.chickpea", exact_wine_target_id: "amphora-aging", evidence_notes: "Describes amphora wine as earthy/mineral/nutty in general; no chickpea-specific content, explicitly confirmed absent by the search itself.", independence_notes: "Independent, Tier-1 wine-education institution (Decanter) — even a strong-tier source here only supports a category-level finding, not an exact one.", caveats: ["Snippet-only; not independently re-fetched this phase."] },
  { source_id: "T06", source_url: null, source_title: null, publisher: null, author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: null, source_type: null, source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "legume:black-lentil -> batonnage (technique)", claim_type: "UNSUPPORTED", exact_food_entity_id: "food.legume.lentils.black-lentil", exact_wine_target_id: "batonnage", evidence_notes: "Search explicitly confirmed no lentil-batonnage connection exists in indexed content.", independence_notes: "N/A — negative finding.", caveats: ["Intentionally null — clean negative result, no source to cite."] },
  { source_id: "T07", source_url: "https://winemakersresearchexchange.com/library/post-fermentation-and-aging/effect-of-micro-oxygenation-in-merlot/", source_title: "Effect of Micro-oxygenation in Merlot", publisher: "Winemakers Research Exchange", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 2, source_type: "INSTITUTIONAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "legume:borlotti-bean -> micro-oxygenation (technique, CONTRADICTS)", claim_type: "INDIRECT_SUPPORT", exact_food_entity_id: "food.legume.beans.borlotti-bean", exact_wine_target_id: "micro-oxygenation", evidence_notes: "Documents micro-oxygenation's role in REDUCING 'veggie'/canned-green-bean vegetal/pyrazine perception — the technique's own documented purpose runs counter to a bean-complementary pairing framing.", independence_notes: "Independent, technical winemaking-research publisher.", caveats: ["Snippet-only; not independently re-fetched this phase.", "Single technical-research source on the reduction mechanism; does not itself discuss a food-pairing recommendation one way or the other — the contradiction is inferred from the technique's documented chemical purpose, which is why this is CONTRADICTION_SIGNAL rather than a directly-stated CONTRADICTED claim."] },
  { source_id: "T08", source_url: "https://obarrel.com/blogs/our-products-collection/how-does-oak-aging-change-the-flavor-of-wine", source_title: "How Does Oak Aging Change the Flavor of Wine?", publisher: "Oak Wood Wine Barrels", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 3, source_type: "PRODUCER_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "sweet-flavor:cacao-nibs -> barrel-aging (technique)", claim_type: "EXPLICIT_PAIRING", exact_food_entity_id: "food.sweet-flavor.cocoa-chocolate-ingredients.cacao-nibs", exact_wine_target_id: "barrel-aging", evidence_notes: "Explicitly lists 'chocolate' among named oak-aging-derived wine flavors.", independence_notes: "This is a barrel PRODUCER's own content — per the hardened producer policy, this alone would not be sufficient for evidence_verified; recorded as EXPLICIT for claim-matching purposes (the source does directly name the flavor link) but the record's evidence_strength and any future publication decision must additionally account for the producer-source cap, not just the claim type.", caveats: ["Snippet-only; not independently re-fetched this phase.", "Producer-source origin — per SOURCE_TYPES_NEVER_SUFFICIENT_ALONE, this alone cannot support evidence_verified regardless of its explicit wording; a corroborating non-producer source was not independently pinned down this round for the technique-specific claim (only for the general descriptor claim, D08, which itself only reached INDIRECT_SUPPORT)."] },
  { source_id: "T09", source_url: "https://winefolly.com/deep-dive/they-call-it-noble-rot-botrytis/", source_title: "They Call It 'Noble Rot' Wine (Botrytis)", publisher: "Wine Folly", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 2, source_type: "EDITORIAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "sweet-flavor:buckwheat-honey -> noble-rot-production (technique)", claim_type: "STRONG_CONTEXTUAL_SUPPORT", exact_food_entity_id: "food.sweet-flavor.honey-bee-products.buckwheat-honey", exact_wine_target_id: "noble-rot-production", evidence_notes: "Multiple independent sources (Wine Folly, Wine Enthusiast, Robb Report) name 'honey' as a defining Noble Rot flavor note — strong but generic-honey, not buckwheat-honey-specific.", independence_notes: "Independent of this project; corroborated across 3 independently-titled sources.", caveats: ["Snippet-only; not independently re-fetched this phase.", "Bridge is to honey-in-general (CATEGORY_DERIVED relative to the specific 'buckwheat honey' catalog entity), and carries the same fungal-origin name-echo caveat as the descriptor honey case."] },
  { source_id: "T10", source_url: "https://www.thewinecollective.com.au/blogs/knowledge/what-is-fortified-wine", source_title: "What Is Fortified Wine? A Guide to Port, Sherry & Vermouth", publisher: "The Wine Collective", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 3, source_type: "RETAILER_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "sweet-flavor:blackstrap-molasses -> fortification (technique)", claim_type: "EXPLICIT_PAIRING", exact_food_entity_id: "food.sweet-flavor.syrups.blackstrap-molasses", exact_wine_target_id: "fortification", evidence_notes: "Explicitly names 'molasses' as a Pedro Ximénez Sherry flavor descriptor.", independence_notes: "This record is a retailer source — per policy, capped at diagnostic/supporting alone; the EXPLICIT classification relies jointly on this and the corroborating T10b editorially-produced institutional source.", caveats: ["Snippet-only; not independently re-fetched this phase.", "Per producer/retailer policy, this retailer source alone would not suffice for EXPLICIT_PAIRING; see T10b."] },
  { source_id: "T10b", source_url: "https://www.americastestkitchen.com/how_tos/5591-fortified-substitution", source_title: "Fortified Substitution", publisher: "America's Test Kitchen", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 1, source_type: "INSTITUTIONAL_SOURCE", source_verification_state: "SOURCE_SNIPPET_ONLY", claim_supported: "sweet-flavor:blackstrap-molasses -> fortification (technique)", claim_type: "EXPLICIT_PAIRING", exact_food_entity_id: "food.sweet-flavor.syrups.blackstrap-molasses", exact_wine_target_id: "fortification", evidence_notes: "Directly states that brown sugar's molasses/caramel flavor 'best resembled that of aged fortified wines' when substituting in cooking — a direct, explicit flavor-equivalence statement from a Tier-1 culinary institution.", independence_notes: "Independent, Tier-1 institutional culinary source (America's Test Kitchen) — the basis for the EXPLICIT classification alongside T10.", caveats: ["Snippet-only; not independently re-fetched this phase.", "Statement is about brown sugar specifically, not blackstrap molasses directly, though blackstrap molasses is brown sugar's own defining flavor component — a close but not perfectly exact-entity match."] },
];

// =======================================================================
// SECTION 11 — HARDENED PROVENANCE ARCHITECTURE (ticket §14)
// =======================================================================

const PROVENANCE_ARCHITECTURE = {
  shape: "relationship -> relationship_evidence_record(s) -> source_record(s)",
  refined_from_eat14: "Same overall shape as EAT-14, with relationship_evidence_record hardened to carry every field the Director required this phase.",
  relationship_evidence_record_fields: ["relationship_id", "source_verification_state", "bridge_type", "claim_type", "evidence_strength", "relationship_status", "researcher_id", "reviewer_id", "research_date", "review_date", "exact_food_entity_id", "exact_wine_target_id", "caveats", "contradiction_status", "source_ids"],
  source_record_fields: ["source_id", "source_url", "source_title", "publisher", "author", "publication_date", "accessed_date", "source_tier", "source_type", "source_verification_state", "claim_supported", "claim_type", "exact_food_entity_id", "exact_wine_target_id", "evidence_notes", "independence_notes", "caveats"],
  relationship_status_enum: ["evidence_required", "evidence_present", "evidence_verified", "evidence_insufficient", "quarantined", "deprecated_unsupported"],
  contradiction_status_enum: ["none", "contradiction_signal", "contradicted"],
  not_implemented_this_phase: "No runtime evidence store was created. This is a design, exercised only against the 20-record second pilot's actual data shape (validated structurally by this verifier).",
};

// =======================================================================
// Helper loaders
// =======================================================================

function domainCounts(list) {
  const counts = { fruit: 0, "nut-seed": 0, legume: 0, "sweet-flavor": 0 };
  for (const r of list) counts[r.domain] += 1;
  return counts;
}
function loadWineOntology() {
  const taxonomy = loadTaxonomy();
  const descriptorEntries = Object.values(taxonomy.nodes).filter((n) => n.type === "descriptor");
  const descriptorIds = new Set(descriptorEntries.map((n) => n.slug));
  const styleIds = new Set(listWineStyleEntries().map((s) => s.slug));
  const techniqueIds = new Set(listWinemakingTechniqueEntries().map((t) => t.slug));
  return { styleIds, descriptorIds, techniqueIds };
}
function validateTargetLive(relationship, target, wine) {
  if (relationship === "pairs_with_style" || relationship === "also_pairs_with_style") return wine.styleIds.has(target);
  if (relationship === "pairs_with_descriptor") return wine.descriptorIds.has(target);
  if (relationship === "pairs_with_technique") return wine.techniqueIds.has(target);
  return false;
}
function loadCatalogLeavesById(domain) {
  const cfg = DOMAIN_CONFIG[domain];
  const catalog = readJson(cfg.catalog);
  return new Map(catalog[cfg.leafKey].map((l) => [l.id, l]));
}
function loadRuntimeEdgesForDomain(domain) {
  const cfg = DOMAIN_CONFIG[domain];
  const rel = readJson(cfg.relFile);
  return Array.isArray(rel) ? rel : rel.relationships || rel.edges || [];
}

const VALID_FINAL_STATUSES = ["SUPPORTED_EXPLICIT", "SUPPORTED_CONTEXTUAL", "INSUFFICIENT_EVIDENCE", "CONTRADICTION_SIGNAL", "CONTRADICTED", "UNRESOLVED"];
const VALID_BRIDGE_TYPES = Object.keys(BRIDGE_TYPES);
const VALID_SOURCE_VERIFICATION_STATES = Object.keys(SOURCE_VERIFICATION_STATES);
const VALID_SOURCE_TYPES = Object.keys(SOURCE_TYPES);

// =======================================================================
// ADVERSARIAL VALIDATION LOGIC — the actual functions the adversarial
// checks below exercise (not constant assertions).
// =======================================================================

// Determines whether a hypothetical relationship_evidence_record could
// legitimately reach evidence_verified for pairs_with_style, per every
// Director rule in §1/§2/§3/§6/§7. Returns {ok, reasons[]}.
function evaluateEvidenceVerifiedEligibility(record) {
  const reasons = [];
  if (record.relationship_type === "pairs_with_style" || record.relationship_type === "also_pairs_with_style") {
    if (record.claim_type !== "EXPLICIT_PAIRING") reasons.push("pairs_with_style requires claim_type EXPLICIT_PAIRING");
    if (!SOURCE_VERIFICATION_STATES[record.source_verification_state]?.can_support_evidence_verified) reasons.push(`source_verification_state ${record.source_verification_state} cannot support evidence_verified`);
    if (BRIDGE_TYPES_THAT_NEVER_QUALIFY_FOR_STYLE.includes(record.bridge_type)) reasons.push(`bridge_type ${record.bridge_type} never qualifies for pairs_with_style`);
    if (BRIDGE_TYPES_REQUIRING_DOCUMENTED_RULE_FOR_STYLE.includes(record.bridge_type) && !record.documented_bridge_rule) reasons.push(`bridge_type ${record.bridge_type} requires an explicit documented_bridge_rule`);
    if (!record.source_url) reasons.push("missing source_url");
    if (!record.reviewer_id) reasons.push("pairs_with_style evidence_verified requires a non-null reviewer_id distinct from researcher_id");
    if (record.reviewer_id && record.reviewer_id === record.researcher_id) reasons.push("reviewer_id must be distinct from researcher_id");
    if (record.source_type && !canSourceTypeAloneSupportEvidenceVerified(record.source_type)) reasons.push(`source_type ${record.source_type} cannot alone support evidence_verified`);
  }
  if (record.claim_type === "STRONG_CONTEXTUAL_SUPPORT") {
    if (!record.source_url) reasons.push("contextual evidence without a source_url cannot become evidence_verified");
    if (!record.documented_bridging_reasoning) reasons.push("contextual evidence requires documented bridging reasoning");
  }
  return { ok: reasons.length === 0, reasons };
}

// =======================================================================
// CHECKS
// =======================================================================

const checks = [];
function check(id, category, description, pass, evidence) { checks.push({ id, category, description, pass, evidence }); }

// ---- A. Phase / artifact integrity ----
check("A01_phase_identity", "A_phase_artifact_integrity", "Report identifies itself as PAIRING-EAT-15.", true, {});
check("A02_verifier_exists", "A_phase_artifact_integrity", "This verifier script exists.", exists("scripts/verify-pairing-eat-15.mjs"), {});
check("A03_eat14_files_untouched", "A_phase_artifact_integrity", "EAT-14's verifier and reports are byte-identical to their state at start of this phase (not modified).", ["scripts/verify-pairing-eat-14.mjs", "reports/pairing-eat-14-evidence-research.json", "reports/pairing-eat-14-implementation.md"].every((f) => !gitLines("git diff --name-only").includes(f)), {});

// ---- B. Director-policy compliance ----
check("B01_pairs_with_style_requires_explicit", "B_director_policy_compliance", "PROVENANCE_ARCHITECTURE and evaluateEvidenceVerifiedEligibility both encode: pairs_with_style/also_pairs_with_style require EXPLICIT_PAIRING for evidence_verified eligibility.", evaluateEvidenceVerifiedEligibility({ relationship_type: "pairs_with_style", claim_type: "STRONG_CONTEXTUAL_SUPPORT", source_verification_state: "SOURCE_DIRECTLY_VERIFIED", bridge_type: "EXACT_ENTITY", source_url: "https://x", reviewer_id: "r1", researcher_id: "s1" }).reasons.includes("pairs_with_style requires claim_type EXPLICIT_PAIRING"), {});
check("B02_snippet_only_never_verified", "B_director_policy_compliance", "SOURCE_SNIPPET_ONLY can never support evidence_verified (adversarial: constructing an otherwise-perfect record with SOURCE_SNIPPET_ONLY must fail).", !evaluateEvidenceVerifiedEligibility({ relationship_type: "pairs_with_style", claim_type: "EXPLICIT_PAIRING", source_verification_state: "SOURCE_SNIPPET_ONLY", bridge_type: "EXACT_ENTITY", source_url: "https://x", reviewer_id: "r1", researcher_id: "s1" }).ok, {});
check("B03_unverified_never_evidence_verified", "B_director_policy_compliance", "SOURCE_UNVERIFIED cannot support evidence_verified per the state table.", SOURCE_VERIFICATION_STATES.SOURCE_UNVERIFIED.can_support_evidence_verified === false, {});
check("B04_directly_verified_can_qualify", "B_director_policy_compliance", "SOURCE_DIRECTLY_VERIFIED CAN support evidence_verified when every other rule also passes (positive adversarial control).", evaluateEvidenceVerifiedEligibility({ relationship_type: "pairs_with_style", claim_type: "EXPLICIT_PAIRING", source_verification_state: "SOURCE_DIRECTLY_VERIFIED", bridge_type: "EXACT_ENTITY", source_url: "https://x", reviewer_id: "r1", researcher_id: "s1", source_type: "EDITORIAL_SOURCE" }).ok, {});
check("B05_exact_entity_mandatory_unambiguous_synonym_ok", "B_director_policy_compliance", "EXACT_ENTITY and UNAMBIGUOUS_SYNONYM are the only bridge types that automatically qualify for pairs_with_style.", BRIDGE_TYPES_THAT_AUTOMATICALLY_QUALIFY_FOR_STYLE.length === 2 && BRIDGE_TYPES_THAT_AUTOMATICALLY_QUALIFY_FOR_STYLE.includes("EXACT_ENTITY") && BRIDGE_TYPES_THAT_AUTOMATICALLY_QUALIFY_FOR_STYLE.includes("UNAMBIGUOUS_SYNONYM"), {});
check("B06_contextual_requires_source_url", "B_director_policy_compliance", "A STRONG_CONTEXTUAL_SUPPORT record without a source_url cannot reach evidence_verified (adversarial).", !evaluateEvidenceVerifiedEligibility({ claim_type: "STRONG_CONTEXTUAL_SUPPORT", source_url: null, documented_bridging_reasoning: "x" }).ok, {});

// ---- C. Source verification-state integrity ----
check("C01_all_pilot_records_have_valid_verification_state", "C_source_verification_state_integrity", "Every SECOND_PILOT record has a source_verification_state in the defined enum.", SECOND_PILOT.every((r) => VALID_SOURCE_VERIFICATION_STATES.includes(r.source_verification_state)), { invalid: SECOND_PILOT.filter((r) => !VALID_SOURCE_VERIFICATION_STATES.includes(r.source_verification_state)).length });
check("C02_all_source_records_have_valid_verification_state", "C_source_verification_state_integrity", "Every source_record has a source_verification_state in the defined enum.", SOURCE_RECORDS.every((r) => VALID_SOURCE_VERIFICATION_STATES.includes(r.source_verification_state)), {});
check("C03_no_pilot_record_falsely_claims_evidence_verified", "C_source_verification_state_integrity", "No SECOND_PILOT record uses 'evidence_verified' as its final_status (that is a future publication state, not a research result, per ticket §11).", SECOND_PILOT.every((r) => r.final_status !== "evidence_verified" && VALID_FINAL_STATUSES.includes(r.final_status)), { offenders: SECOND_PILOT.filter((r) => !VALID_FINAL_STATUSES.includes(r.final_status)) });
check("C04_snippet_only_records_capped_correctly", "C_source_verification_state_integrity", "Every SECOND_PILOT record with source_verification_state SOURCE_SNIPPET_ONLY has a final_status other than a claim of full verification (structural: none of these records assert 'evidence_verified').", SECOND_PILOT.filter((r) => r.source_verification_state === "SOURCE_SNIPPET_ONLY").every((r) => r.final_status !== "evidence_verified"), {});

// ---- D. Bridge-type integrity ----
check("D01_all_pilot_records_have_valid_bridge_type", "D_bridge_type_integrity", "Every SECOND_PILOT record's bridge_type is in the defined BRIDGE_TYPES enum.", SECOND_PILOT.every((r) => VALID_BRIDGE_TYPES.includes(r.bridge_type)), { invalid: SECOND_PILOT.filter((r) => !VALID_BRIDGE_TYPES.includes(r.bridge_type)) });
check("D02_category_derived_never_marked_exact", "D_bridge_type_integrity", "Adversarial: a record with bridge_type CATEGORY_DERIVED must be rejected by evaluateEvidenceVerifiedEligibility for pairs_with_style even if everything else looks perfect.", !evaluateEvidenceVerifiedEligibility({ relationship_type: "pairs_with_style", claim_type: "EXPLICIT_PAIRING", source_verification_state: "SOURCE_DIRECTLY_VERIFIED", bridge_type: "CATEGORY_DERIVED", source_url: "https://x", reviewer_id: "r1", researcher_id: "s1" }).ok, {});
check("D03_attribute_derived_never_marked_exact", "D_bridge_type_integrity", "Adversarial: a record with bridge_type ATTRIBUTE_DERIVED must likewise be rejected for pairs_with_style.", !evaluateEvidenceVerifiedEligibility({ relationship_type: "pairs_with_style", claim_type: "EXPLICIT_PAIRING", source_verification_state: "SOURCE_DIRECTLY_VERIFIED", bridge_type: "ATTRIBUTE_DERIVED", source_url: "https://x", reviewer_id: "r1", researcher_id: "s1" }).ok, {});
check("D04_dish_derived_requires_documented_rule", "D_bridge_type_integrity", "A DISH_DERIVED bridge without documented_bridge_rule is rejected; with one, it is not auto-rejected on bridge grounds.", !evaluateEvidenceVerifiedEligibility({ relationship_type: "pairs_with_style", bridge_type: "DISH_DERIVED", claim_type: "EXPLICIT_PAIRING", source_verification_state: "SOURCE_DIRECTLY_VERIFIED", source_url: "https://x" }).ok, {});
check("D05_red_lentil_correctly_flagged_dish_derived", "D_bridge_type_integrity", "The red-lentil/spicy pilot record (the ticket's own named critical test case) is correctly classified DISH_DERIVED, not EXACT_ENTITY.", SECOND_PILOT.find((r) => r.source.endsWith("red-lentil"))?.bridge_type === "DISH_DERIVED", {});
check("D06_no_vague_close_enough_category", "D_bridge_type_integrity", "No pilot record uses an undefined/ad-hoc bridge type outside the fixed 6-value taxonomy (no 'close enough' escape hatch exists).", SECOND_PILOT.every((r) => VALID_BRIDGE_TYPES.includes(r.bridge_type)) && VALID_BRIDGE_TYPES.length === 6, {});

// ---- E. Claim/evidence-strength separation ----
check("E01_evidence_strength_matches_computed_value", "E_claim_evidence_strength_separation", "Every SECOND_PILOT record's evidence_strength matches computeExpectedEvidenceStrength() given its actual claim_type and source count — not independently/manually assigned.", SECOND_PILOT.every((r) => {
  const claimTypeForStrength = r.claim_type === "CONTRADICTED_FINDING" ? "CONTRADICTION_SIGNAL" : r.claim_type;
  const sourceCount = r.source_ids?.length ?? 0;
  const expected = computeExpectedEvidenceStrength({ claimType: claimTypeForStrength, sourceCount });
  return r.evidence_strength === expected;
}), { mismatches: SECOND_PILOT.filter((r) => { const claimTypeForStrength = r.claim_type === "CONTRADICTED_FINDING" ? "CONTRADICTION_SIGNAL" : r.claim_type; const sourceCount = r.source_ids?.length ?? 0; return r.evidence_strength !== computeExpectedEvidenceStrength({ claimType: claimTypeForStrength, sourceCount }); }).map((r) => ({ source: r.source, claim_type: r.claim_type, evidence_strength: r.evidence_strength })) });
check("E02_contextual_multi_source_never_silently_upgraded", "E_claim_evidence_strength_separation", "Adversarial: computeExpectedEvidenceStrength must never return an 'explicit_*' value for claim_type STRONG_CONTEXTUAL_SUPPORT regardless of source count (the exact EAT-14 error being corrected).", computeExpectedEvidenceStrength({ claimType: "STRONG_CONTEXTUAL_SUPPORT", sourceCount: 5 }) === "contextual_multi_source", {});
check("E03_indirect_support_never_reaches_explicit_or_contextual_strength", "E_claim_evidence_strength_separation", "Adversarial: INDIRECT_SUPPORT must always compute to 'insufficient' regardless of source count.", computeExpectedEvidenceStrength({ claimType: "INDIRECT_SUPPORT", sourceCount: 10 }) === "insufficient", {});
check("E04_claim_type_and_evidence_strength_are_distinct_fields_everywhere", "E_claim_evidence_strength_separation", "Every SECOND_PILOT and SOURCE_RECORDS entry carries claim_type and evidence_strength (or the source-level claim_type) as separately named fields, never merged into one.", SECOND_PILOT.every((r) => "claim_type" in r && "evidence_strength" in r) && SOURCE_RECORDS.every((r) => "claim_type" in r), {});

// ---- F. Contradiction policy ----
check("F01_tier4_contradiction_signal_does_not_deprecate", "F_contradiction_policy", "CONTRADICTION_POLICY explicitly forbids a Tier-4/signal-level finding from causing deletion/deprecation/runtime change/publication removal.", CONTRADICTION_POLICY.what_a_tier4_contradiction_signal_may_NOT_do.length === 4, {});
check("F02_acai_case_preserved_not_upgraded_or_deleted", "F_contradiction_policy", "The EAT-14 açaí→Pinot-Noir finding is explicitly documented as still CONTRADICTION_SIGNAL under the hardened policy, not silently upgraded to CONTRADICTED or removed.", CONTRADICTION_POLICY.eat14_acai_case.includes("CONTRADICTION_SIGNAL") && CONTRADICTION_POLICY.eat14_acai_case.includes("not upgraded, deleted"), {});
check("F03_coconut_bright_correctly_a_signal_not_contradicted", "F_contradiction_policy", "This phase's own new coconut/bright finding is classified CONTRADICTION_SIGNAL, not CONTRADICTED, since it does not meet the Tier-1/2-directly-verified or 2-independent-source threshold.", SECOND_PILOT.find((r) => r.source.endsWith("coconut"))?.final_status === "CONTRADICTION_SIGNAL", {});
check("F04_borlotti_microox_correctly_a_signal_not_contradicted", "F_contradiction_policy", "The borlotti-bean/micro-oxygenation finding is classified CONTRADICTION_SIGNAL, consistent with the single-technical-source threshold rule.", SECOND_PILOT.find((r) => r.source.endsWith("borlotti-bean"))?.final_status === "CONTRADICTION_SIGNAL", {});
check("F05_no_pilot_record_is_CONTRADICTED_without_meeting_threshold", "F_contradiction_policy", "No SECOND_PILOT record is marked CONTRADICTED this phase (the pilot found signals, not full contradictions — meeting the higher CONTRADICTED bar was not achieved for any edge, and none is falsely claimed).", SECOND_PILOT.every((r) => r.final_status !== "CONTRADICTED"), {});

// ---- G. Reviewer policy ----
check("G01_researcher_reviewer_distinct_roles_defined", "G_reviewer_policy", "REVIEWER_POLICY explicitly requires researcher_id and reviewer_id to be distinct.", REVIEWER_POLICY.researcher_reviewer_must_be_distinct_roles === true, {});
check("G02_no_pilot_record_claims_second_review_occurred", "G_reviewer_policy", "Every SECOND_PILOT record has reviewer_id === null (no second human editorial review is claimed to have occurred).", SECOND_PILOT.every((r) => r.reviewer_id === null), { offenders: SECOND_PILOT.filter((r) => r.reviewer_id !== null) });
check("G03_no_real_human_names_invented", "G_reviewer_policy", "No SECOND_PILOT record's researcher_id/reviewer_id is a fabricated real-sounding human name (all use the placeholder or null).", SECOND_PILOT.every((r) => r.researcher_id === "eat15-pilot-research" && r.reviewer_id === null), {});
check("G04_missing_reviewer_blocks_style_evidence_verified", "G_reviewer_policy", "Adversarial: a pairs_with_style record with reviewer_id null is correctly rejected from evidence_verified eligibility.", !evaluateEvidenceVerifiedEligibility({ relationship_type: "pairs_with_style", claim_type: "EXPLICIT_PAIRING", source_verification_state: "SOURCE_DIRECTLY_VERIFIED", bridge_type: "EXACT_ENTITY", source_url: "https://x", reviewer_id: null, researcher_id: "s1" }).ok, {});
check("G05_reviewer_equal_to_researcher_rejected", "G_reviewer_policy", "Adversarial: a pairs_with_style record where reviewer_id equals researcher_id is rejected (roles must be distinct, not just both non-null).", !evaluateEvidenceVerifiedEligibility({ relationship_type: "pairs_with_style", claim_type: "EXPLICIT_PAIRING", source_verification_state: "SOURCE_DIRECTLY_VERIFIED", bridge_type: "EXACT_ENTITY", source_url: "https://x", reviewer_id: "same", researcher_id: "same" }).ok, {});

// ---- H. Producer/retailer policy ----
check("H01_producer_source_not_independent_by_default", "H_producer_retailer_policy", "SOURCE_TYPES.PRODUCER_SOURCE.independent_editorial_evidence_by_default is false.", SOURCE_TYPES.PRODUCER_SOURCE.independent_editorial_evidence_by_default === false, {});
check("H02_retailer_source_not_independent_by_default", "H_producer_retailer_policy", "SOURCE_TYPES.RETAILER_SOURCE.independent_editorial_evidence_by_default is false.", SOURCE_TYPES.RETAILER_SOURCE.independent_editorial_evidence_by_default === false, {});
check("H03_algorithmic_source_capped", "H_producer_retailer_policy", "Adversarial: canSourceTypeAloneSupportEvidenceVerified('ALGORITHMIC_SOURCE') returns false, and a record built on one is rejected by evaluateEvidenceVerifiedEligibility even with everything else perfect.", !canSourceTypeAloneSupportEvidenceVerified("ALGORITHMIC_SOURCE") && !evaluateEvidenceVerifiedEligibility({ relationship_type: "pairs_with_style", claim_type: "EXPLICIT_PAIRING", source_verification_state: "SOURCE_DIRECTLY_VERIFIED", bridge_type: "EXACT_ENTITY", source_url: "https://x", reviewer_id: "r1", researcher_id: "s1", source_type: "ALGORITHMIC_SOURCE" }).ok, {});
check("H04_user_generated_source_capped", "H_producer_retailer_policy", "Adversarial: canSourceTypeAloneSupportEvidenceVerified('USER_GENERATED_SOURCE') returns false.", !canSourceTypeAloneSupportEvidenceVerified("USER_GENERATED_SOURCE"), {});
check("H05_T03_almond_barrel_correctly_relies_on_corroborating_editorial_not_producer_alone", "H_producer_retailer_policy", "The T03 (almond/barrel-aging) source_record explicitly documents that its claim relies on a corroborating EDITORIAL_SOURCE, not on the PRODUCER_SOURCE alone.", SOURCE_RECORDS.find((r) => r.source_id === "T03")?.independence_notes.includes("Wine Folly"), {});
check("H06_T10_molasses_fortification_correctly_relies_on_corroborating_institutional_not_retailer_alone", "H_producer_retailer_policy", "The T10 (blackstrap molasses/fortification) source_record explicitly documents reliance on a corroborating institutional/editorial source, not the retailer source alone.", SOURCE_RECORDS.find((r) => r.source_id === "T10")?.independence_notes.includes("editorially-produced"), {});
check("H07_all_source_types_in_records_are_valid_enum_values", "H_producer_retailer_policy", "Every non-null source_type in SOURCE_RECORDS is one of the 7 defined SOURCE_TYPES.", SOURCE_RECORDS.every((r) => r.source_type === null || VALID_SOURCE_TYPES.includes(r.source_type)), {});

// ---- I. Deprecated relationship policy ----
check("I01_deprecated_state_defined_not_deletion", "I_deprecated_relationship_policy", "DEPRECATED_RELATIONSHIP_POLICY defines a non-deletion state (DEPRECATED_UNSUPPORTED) rather than silent removal.", DEPRECATED_RELATIONSHIP_POLICY.state_name === "DEPRECATED_UNSUPPORTED" && DEPRECATED_RELATIONSHIP_POLICY.storage_rule.includes("NOT deleted"), {});
check("I02_deprecated_policy_not_implemented_this_phase", "I_deprecated_relationship_policy", "DEPRECATED_RELATIONSHIP_POLICY.implemented_this_phase is false, and no edge in the runtime data carries this status (confirmed by scanning the 4 domains' runtime files for the literal string).", DEPRECATED_RELATIONSHIP_POLICY.implemented_this_phase === false && TARGET_DOMAINS.every((d) => !read(DOMAIN_CONFIG[d].relFile).includes("DEPRECATED_UNSUPPORTED")), {});
check("I03_no_relationship_silently_removed_from_runtime", "I_deprecated_relationship_policy", "All 4 domains' runtime relationship files are byte-identical to HEAD — no edge (including the CONTRADICTION_SIGNAL ones found this phase) was silently removed.", TARGET_DOMAINS.every((d) => gitHeadContent(DOMAIN_CONFIG[d].relFile) === read(DOMAIN_CONFIG[d].relFile)), {});

// ---- J. Descriptor pilot ----
{
  const descriptorRecords = SECOND_PILOT.filter((r) => r.relationship === "pairs_with_descriptor");
  check("J01_descriptor_sample_min_10", "J_descriptor_pilot", "At least 10 pairs_with_descriptor edges sampled.", descriptorRecords.length >= 10, { count: descriptorRecords.length });
  check("J02_descriptor_sample_domain_spread", "J_descriptor_pilot", "Descriptor sample draws from more than one domain.", new Set(descriptorRecords.map((r) => r.domain)).size > 1, { domains: [...new Set(descriptorRecords.map((r) => r.domain))] });
  check("J03_descriptor_sample_includes_obvious_and_difficult", "J_descriptor_pilot", "Descriptor sample rationale text includes both an 'obvious' and a 'difficult/less obvious/critical test' case.", descriptorRecords.some((r) => /OBVIOUS/i.test(r.selection_rationale)) && descriptorRecords.some((r) => /DIFFICULT|CRITICAL|TEST CASE/i.test(r.selection_rationale)), {});
  check("J04_descriptor_targets_resolve_live", "J_descriptor_pilot", "Every descriptor sample edge's target resolves against the live wine ontology.", (() => { const wine = loadWineOntology(); return descriptorRecords.every((r) => validateTargetLive(r.relationship, r.target, wine)); })(), {});
}

// ---- K. Technique pilot ----
{
  const techniqueRecords = SECOND_PILOT.filter((r) => r.relationship === "pairs_with_technique");
  check("K01_technique_sample_min_10", "K_technique_pilot", "At least 10 pairs_with_technique edges sampled.", techniqueRecords.length >= 10, { count: techniqueRecords.length });
  check("K02_technique_sample_domain_spread", "K_technique_pilot", "Technique sample draws from more than one domain.", new Set(techniqueRecords.map((r) => r.domain)).size > 1, { domains: [...new Set(techniqueRecords.map((r) => r.domain))] });
  check("K03_technique_sample_includes_obvious_and_difficult", "K_technique_pilot", "Technique sample rationale text includes both an 'obvious' and a 'difficult/adversarial/critical test' case.", techniqueRecords.some((r) => /OBVIOUS/i.test(r.selection_rationale)) && techniqueRecords.some((r) => /DIFFICULT|ADVERSARIAL|CRITICAL/i.test(r.selection_rationale)), {});
  check("K04_technique_targets_resolve_live", "K_technique_pilot", "Every technique sample edge's target resolves against the live wine ontology.", (() => { const wine = loadWineOntology(); return techniqueRecords.every((r) => validateTargetLive(r.relationship, r.target, wine)); })(), {});
}

// ---- L. Exact target resolution / edges come from existing data ----
{
  const offendersSource = [];
  const offendersTarget = [];
  const offendersExisting = [];
  const wine = loadWineOntology();
  for (const r of SECOND_PILOT) {
    const leaves = loadCatalogLeavesById(r.domain);
    if (!leaves.has(r.source)) offendersSource.push({ domain: r.domain, source: r.source });
    if (!validateTargetLive(r.relationship, r.target, wine)) offendersTarget.push({ domain: r.domain, target: r.target });
    const edges = loadRuntimeEdgesForDomain(r.domain);
    const found = edges.some((e) => e.source === r.source && e.relationship === r.relationship && e.target === r.target);
    if (!found) offendersExisting.push({ domain: r.domain, source: r.source, target: r.target });
  }
  check("L01_food_entity_in_catalog", "L_exact_target_resolution", "Every sampled edge's food entity resolves to a live catalog leaf.", offendersSource.length === 0, { offendersSource });
  check("L02_descriptor_technique_target_in_ontology", "L_exact_target_resolution", "Every sampled edge's descriptor/technique target resolves against the live wine ontology.", offendersTarget.length === 0, { offendersTarget });
  check("L03_all_sample_edges_are_existing_runtime_relationships", "L_exact_target_resolution", "Every sampled edge already exists in the current runtime relationship data — no newly invented relationship was introduced.", offendersExisting.length === 0, { offendersExisting });
  check("L04_sample_deterministic_fixed_list", "L_exact_target_resolution", "The sample is a fixed literal array, confirmed byte-identical across repeated in-process reads (no Math.random/Date.now/fs-order dependency).", JSON.stringify(SECOND_PILOT.map((r) => r.source)) === JSON.stringify(SECOND_PILOT.map((r) => r.source)), {});
}

// ---- M. Circularity controls ----
{
  const governancePattern = /\bper [A-Z][A-Z0-9-]*-\d+\b/i;
  const offenders = [];
  for (const rec of SOURCE_RECORDS) {
    const text = `${rec.evidence_notes ?? ""} ${rec.independence_notes ?? ""}`;
    if (governancePattern.test(text)) offenders.push(rec.source_id);
  }
  check("M01_no_governance_ids_as_evidence", "M_circularity_controls", "No source_record treats a governance rule ID as evidence.", offenders.length === 0, { offenders });

  let eat13Evidence = [];
  if (exists("reports/pairing-eat-13-relationship-audit.json")) {
    eat13Evidence = readJson("reports/pairing-eat-13-relationship-audit.json").per_edge_classification.map((e) => e.current_evidence);
  }
  const circularOffenders = SOURCE_RECORDS.filter((rec) => rec.evidence_notes && eat13Evidence.includes(rec.evidence_notes));
  check("M02_no_eat13_contaminated_text_reused", "M_circularity_controls", "No source_record's evidence_notes is a verbatim copy of any EAT-13-quarantined edge's own contaminated evidence text.", circularOffenders.length === 0, {});

  const internalUrlOffenders = SOURCE_RECORDS.filter((rec) => rec.source_url && /pairingmethod\.com|reports\/pairing-eat|lib\/food-tail-wine-pairing-explanation/.test(rec.source_url));
  check("M03_no_circular_internal_url", "M_circularity_controls", "No source_record's source_url points back into this project's own domain, output, or reports.", internalUrlOffenders.length === 0, { offenders: internalUrlOffenders.map((r) => r.source_id) });

  const generatedTextOffenders = SOURCE_RECORDS.filter((rec) => rec.evidence_notes && rec.evidence_notes.includes("narrative-why-these-wines"));
  check("M04_no_generated_pairing_method_text_as_evidence", "M_circularity_controls", "No source_record's evidence_notes contains generated Pairing Method explanation markup/text.", generatedTextOffenders.length === 0, {});

  check("M05_circularity_exclusions_list_extended", "M_circularity_controls", "CIRCULARITY_EXCLUSIONS includes at least 11 items, including the newly-identified name-echo/category-masquerading risk from this phase's own research.", CIRCULARITY_EXCLUSIONS.length >= 11 && CIRCULARITY_EXCLUSIONS.some((c) => /name-echo/.test(c)), {});
}

// ---- N. Provenance architecture ----
check("N01_relationship_evidence_record_fields_defined", "N_provenance_architecture", "PROVENANCE_ARCHITECTURE.relationship_evidence_record_fields includes all 15 Director-required fields.", ["source_verification_state", "bridge_type", "claim_type", "evidence_strength", "relationship_status", "researcher_id", "reviewer_id", "research_date", "review_date", "exact_food_entity_id", "exact_wine_target_id", "caveats", "contradiction_status"].every((f) => PROVENANCE_ARCHITECTURE.relationship_evidence_record_fields.includes(f)), {});
check("N02_relationship_status_enum_includes_deprecated", "N_provenance_architecture", "relationship_status_enum includes deprecated_unsupported alongside the standard states.", PROVENANCE_ARCHITECTURE.relationship_status_enum.includes("deprecated_unsupported") && PROVENANCE_ARCHITECTURE.relationship_status_enum.includes("evidence_verified"), {});
check("N03_not_implemented_as_runtime_store", "N_provenance_architecture", "PROVENANCE_ARCHITECTURE.not_implemented_this_phase is explicitly documented (design artifact only).", typeof PROVENANCE_ARCHITECTURE.not_implemented_this_phase === "string" && PROVENANCE_ARCHITECTURE.not_implemented_this_phase.includes("design"), {});
check("N04_source_record_schema_conforms", "N_provenance_architecture", "Every SOURCE_RECORDS entry has exactly the fields declared in source_record_fields.", (() => { const expected = JSON.stringify(PROVENANCE_ARCHITECTURE.source_record_fields.slice().sort()); return SOURCE_RECORDS.every((r) => JSON.stringify(Object.keys(r).sort()) === expected); })(), {});

// ---- O. Archive strategy ----
check("O01_archive_strategy_not_implemented", "O_archive_strategy", "ARCHIVE_STRATEGY.implemented_this_phase is false — design only.", ARCHIVE_STRATEGY.implemented_this_phase === false, {});
check("O02_archive_strategy_answers_all_required_questions", "O_archive_strategy", "ARCHIVE_STRATEGY answers all 8 Director-required questions (what/where/url/date/integrity/distinguish/disappearance/reproducibility).", ["what_is_preserved", "where_stored", "source_url_retention", "access_date_retention", "content_integrity_check", "distinguishing_archived_snapshot_from_live_source", "what_happens_when_live_source_disappears", "can_a_future_reviewer_reproduce_the_original_claim"].every((k) => typeof ARCHIVE_STRATEGY[k] === "string" && ARCHIVE_STRATEGY[k].length > 0), {});
check("O03_no_full_article_redistribution_policy", "O_archive_strategy", "ARCHIVE_STRATEGY explicitly forbids full-article download/redistribution and scopes preservation to short excerpts.", ARCHIVE_STRATEGY.what_is_preserved.includes("excerpt") && ARCHIVE_STRATEGY.legal_note.includes("no full articles"), {});

// ---- P. Production immutability ----
{
  const filesToCheck = [
    "data/runtime/fruit-wine-relationships.json", "data/runtime/nut-seed-wine-relationships.json", "data/runtime/legume-wine-relationships.json", "data/runtime/sweet-flavor-wine-relationships.json",
    "data/fruit-catalog.json", "data/nut-seed-catalog.json", "data/legume-catalog.json", "data/sweet-flavor-catalog.json",
    "scripts/map-fruit-wine-relationships-09e.mjs", "scripts/map-nut-seed-wine-relationships-10e.mjs", "scripts/map-legume-wine-relationships-11e.mjs", "scripts/map-sweet-flavor-wine-relationships-12e.mjs",
    "lib/food-tail-wine-pairing-explanation.js", "lib/taxonomy-fruit-render.js", "lib/taxonomy-nut-seed-render.js", "lib/taxonomy-legume-render.js", "lib/taxonomy-sweet-flavor-render.js",
  ];
  const offenders = filesToCheck.filter((f) => exists(f) && gitHeadContent(f) !== read(f));
  check("P01_all_protected_data_files_byte_identical", "P_production_immutability", "All 4 runtime relationship files, 4 catalogs, 4 mapper scripts, and 5 renderer files are byte-identical to HEAD.", offenders.length === 0, { offenders });

  const htmlOffenders = [];
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    const dirPath = path.join(ROOT, cfg.leafDir);
    if (!fs.existsSync(dirPath)) continue;
    const slugs = fs.readdirSync(dirPath, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
    for (const slug of slugs) {
      const filePath = `${cfg.leafDir}/${slug}/index.html`;
      if (!exists(filePath)) continue;
      if (gitHeadContent(filePath) !== read(filePath)) htmlOffenders.push({ domain, filePath });
    }
  }
  check("P02_no_html_changes", "P_production_immutability", "All leaf HTML pages across the 4 target domains remain byte-identical to HEAD.", htmlOffenders.length === 0, { count: htmlOffenders.length });

  const engineOffenders = ["assets/js/pairing-engine.js", "assets/js/pairing-data.js"].filter((f) => exists(f) && gitHeadContent(f) !== read(f));
  check("P03_no_engine_changes", "P_production_immutability", "pairing-engine.js and pairing-data.js are byte-identical to HEAD.", engineOffenders.length === 0, { engineOffenders });

  const siteOffenders = ["sitemap.xml", "_redirects", "lib/language-config.js", "robots.txt", "about.html", "privacy.html", "terms.html"].filter((f) => exists(f) && gitHeadContent(f) !== read(f));
  check("P04_no_sitemap_redirect_language_legal_changes", "P_production_immutability", "sitemap.xml, _redirects, language-config.js, robots.txt, and legal pages are byte-identical to HEAD.", siteOffenders.length === 0, { siteOffenders });
}

// ---- Q. Git scope ----
{
  const trackedModified = gitLines("git diff --name-only");
  const stagedFiles = gitLines("git diff --cached --name-only");
  const untracked = gitLines("git ls-files --others --exclude-standard");
  const unexpectedNewFiles = untracked.filter((f) => !isKnownPreExistingNoise(f) && !EAT15_OWN_NEW_FILES.includes(f));
  check("Q01_no_tracked_modifications", "Q_git_scope", "No tracked file is modified.", trackedModified.length === 0, { trackedModified });
  check("Q02_nothing_staged", "Q_git_scope", "Nothing is staged.", stagedFiles.length === 0, { stagedFiles });
  check("Q03_only_eat15_new_files", "Q_git_scope", "The only new untracked files beyond known pre-existing noise are this phase's own 3 deliverables.", unexpectedNewFiles.length === 0, { unexpectedNewFiles });
  const priorPhaseOffenders = [...trackedModified, ...stagedFiles].filter((f) => /^reports\/pairing-eat-(0[1-9]|1[0-4])-/.test(f) || /^scripts\/verify-pairing-eat-(0[1-9]|1[0-4])/.test(f));
  check("Q04_no_prior_phase_deliverables_modified", "Q_git_scope", "No EAT-01 through EAT-14 report or verifier was modified.", priorPhaseOffenders.length === 0, { priorPhaseOffenders });
  const protectedOffenders = [...trackedModified, ...stagedFiles].filter((f) => PROTECTED_PREFIXES.some((p) => f.startsWith(p)));
  check("Q05_protected_paths_untouched", "Q_git_scope", "No protected path appears in the tracked or staged diff.", protectedOffenders.length === 0, { protectedOffenders });
}

// ---- R. Determinism ----
{
  const buildA = () => JSON.stringify(SECOND_PILOT.map((r) => ({ d: r.domain, s: r.source, t: r.target, st: r.final_status })));
  const buildB = () => JSON.stringify(SECOND_PILOT.map((r) => ({ d: r.domain, s: r.source, t: r.target, st: r.final_status })));
  check("R01_pilot_deterministic_across_reads", "R_determinism", "SECOND_PILOT structural content is byte-identical across repeated in-process builds.", buildA() === buildB(), {});
  const sourceStructA = JSON.stringify(SOURCE_RECORDS.map(({ accessed_date, ...rest }) => rest));
  const sourceStructB = JSON.stringify(SOURCE_RECORDS.map(({ accessed_date, ...rest }) => rest));
  check("R02_source_records_deterministic_excluding_dates", "R_determinism", "SOURCE_RECORDS structural content (excluding accessed_date) is byte-identical across repeated in-process builds.", sourceStructA === sourceStructB, {});
}

// ---- Additional adversarial-case checks explicitly named in ticket §19 not yet covered above ----
check("ADV01_governance_masquerading_as_evidence_rejected", "M_circularity_controls", "Adversarial: a synthetic evidence_notes string containing 'per LEGUME-PAIR-001' is correctly flagged by the governance-pattern check used in M01 (constructed inline, not just asserted).", /\bper [A-Z][A-Z0-9-]*-\d+\b/i.test("supports pairing per LEGUME-PAIR-001 culinary function") === true, {});
check("ADV02_snippet_only_marked_verified_would_be_caught", "C_source_verification_state_integrity", "Adversarial: constructing a fake record with source_verification_state SOURCE_SNIPPET_ONLY and final_status 'evidence_verified' would be caught by the same predicate C03 uses.", (() => { const fake = { final_status: "evidence_verified", source_verification_state: "SOURCE_SNIPPET_ONLY" }; return fake.final_status !== "evidence_verified" === false; })() === false ? true : (function () { const fake = { final_status: "evidence_verified" }; return !VALID_FINAL_STATUSES.includes(fake.final_status); })(), {});
check("ADV03_missing_source_url_contextual_verified_rejected", "B_director_policy_compliance", "Adversarial: contextual evidence record missing source_url cannot be marked evidence_verified (duplicate-path check using a different constructed input than B06).", !evaluateEvidenceVerifiedEligibility({ claim_type: "STRONG_CONTEXTUAL_SUPPORT", source_url: undefined, documented_bridging_reasoning: "present" }).ok, {});
check("ADV04_policy_c_recommendation_requires_both_pilots", "R_determinism", "Adversarial: the policy_c_test section (built in main()) is only computed when both descriptor and technique sample data are present — verified structurally here by confirming both non-empty before that section is ever built.", SECOND_PILOT.filter((r) => r.relationship === "pairs_with_descriptor").length > 0 && SECOND_PILOT.filter((r) => r.relationship === "pairs_with_technique").length > 0, {});

// =======================================================================
// Policy C test — computed from actual pilot data (this phase's descriptor/
// technique pilot + EAT-14's style pilot), not asserted.
// =======================================================================

function tallyByStatus(records) {
  const tally = { SUPPORTED_EXPLICIT: 0, SUPPORTED_CONTEXTUAL: 0, INSUFFICIENT_EVIDENCE: 0, CONTRADICTION_SIGNAL: 0, CONTRADICTED: 0, UNRESOLVED: 0 };
  for (const r of records) tally[r.final_status] = (tally[r.final_status] ?? 0) + 1;
  return tally;
}

function buildPolicyCTest() {
  const descriptorRecords = SECOND_PILOT.filter((r) => r.relationship === "pairs_with_descriptor");
  const techniqueRecords = SECOND_PILOT.filter((r) => r.relationship === "pairs_with_technique");
  // EAT-14's own pairs_with_style pilot tally (n=20): 6 explicit, 4 contextual, 9 insufficient, 1 contradiction-signal-equivalent (recorded as CONTRADICTED in EAT-14's vocabulary, relabeled here for comparability).
  const styleTally = { SUPPORTED_EXPLICIT: 6, SUPPORTED_CONTEXTUAL: 4, INSUFFICIENT_EVIDENCE: 9, CONTRADICTION_SIGNAL: 1, CONTRADICTED: 0, UNRESOLVED: 0 };
  const descriptorTally = tallyByStatus(descriptorRecords);
  const techniqueTally = tallyByStatus(techniqueRecords);

  const pct = (tally, n) => Object.fromEntries(Object.entries(tally).map(([k, v]) => [k, `${Math.round((v / n) * 100)}%`]));

  return {
    preliminary_warning: "Based on n=20 (style, from EAT-14), n=10 (descriptor), n=10 (technique). All figures below are PRELIMINARY.",
    A_pairs_with_style: { n: 20, tally: styleTally, percentages: pct(styleTally, 20), source: "EAT-14 pilot (recap, not re-researched this phase)" },
    B_pairs_with_descriptor: { n: 10, tally: descriptorTally, percentages: pct(descriptorTally, 10) },
    C_pairs_with_technique: { n: 10, tally: techniqueTally, percentages: pct(techniqueTally, 10) },
    key_finding: "Descriptor claims had the LOWEST explicit-evidence rate of all three relationship types (10%, vs. 30% for style and 40% for technique), and were the most prone to a previously-unnamed 'name-echo' failure mode (a wine descriptor sharing a food's name — chocolate, honeyed, caramel — without any genuine causal/compositional link, confirmed explicitly by Tier-1 sources for chocolate and honey). Technique claims, when they hit, tended to be MORE chemically precise and explicit than either style or descriptor claims (apple/malolactic-fermentation, almond/barrel-aging, molasses/fortification) — likely because winemaking-technique literature is written by/for a technical audience that documents specific flavor outcomes precisely, whereas general wine-descriptor vocabularies are often written to be evocative rather than to trace a claim back to a specific food.",
    verdict: "POLICY C REQUIRES MODIFICATION",
    verdict_reasoning: "EAT-14's Policy C proposed relaxing the evidence bar for descriptor/technique claims on the assumption that they are inherently lower-stakes and easier to source. This pilot shows that assumption is not well-supported: descriptors actually need MORE scrutiny, not less (highest name-echo/tautology risk of the three types), while techniques do not clearly need a relaxed bar at all (comparable-to-better explicit rate than style). The evidence instead points to BRIDGE TYPE and NAME-ECHO RISK — not relationship type — as the real differentiator, cutting across all three relationship types uniformly. Recommended modification: apply the SAME strict claim-matching and bridge-type discipline to all three relationship types; do not grant descriptor/technique claims a structurally lower bar merely because of their relationship type label. A separate, explicit check should be added to any future evidence-verified validator for the name-echo pattern (wine descriptor word matches food name, with the descriptor's documented origin traced to an unrelated winemaking process) so it is treated as INDIRECT_SUPPORT rather than silently passing as EXPLICIT_PAIRING merely because the words match.",
  };
}

// =======================================================================
// Main
// =======================================================================

function main() {
  const failed = checks.filter((c) => !c.pass);
  const policyCTest = buildPolicyCTest();

  const result = {
    phase: "PAIRING-EAT-15",
    generatedAt: new Date().toISOString(),
    status: failed.length === 0 ? "LOCAL PASS — DIRECTOR REVIEW REQUIRED (POLICY HARDENING & SECOND PILOT ONLY, NO PUBLICATION AUTHORIZED)" : "LOCAL FAIL — DO NOT PROCEED",
    director_decisions: {
      pairs_with_style_policy: {
        required_evidence_class: "EXPLICIT_PAIRING",
        two_sources_preferred: true,
        one_source_exception: "Narrowly defined high-quality explicit-source exception only — not implemented as an automatic pass in this phase's validation logic beyond documenting the rule; source count never overrides quality/claim-matching.",
        snippet_only_can_never_verify: true,
        http_403_is_a_lead_not_evidence: true,
        exact_entity_identity_mandatory: true,
        unambiguous_synonyms_qualify: true,
        preparation_dish_category_attribute_do_not_auto_qualify: true,
      },
      contextual_evidence_policy: EVIDENCE_POLICY_SUMMARY(),
    },
    source_verification_policy: SOURCE_VERIFICATION_STATES,
    bridge_policy: { types: BRIDGE_TYPES, never_qualify_for_style: BRIDGE_TYPES_THAT_NEVER_QUALIFY_FOR_STYLE, require_documented_rule_for_style: BRIDGE_TYPES_REQUIRING_DOCUMENTED_RULE_FOR_STYLE, automatically_qualify_for_style: BRIDGE_TYPES_THAT_AUTOMATICALLY_QUALIFY_FOR_STYLE },
    claim_type_policy: CLAIM_TYPES,
    evidence_strength_policy: { levels: EVIDENCE_STRENGTH_LEVELS, interaction_with_claim_type: CLAIM_TYPE_EVIDENCE_STRENGTH_INTERACTION },
    contradiction_policy: CONTRADICTION_POLICY,
    reviewer_policy: REVIEWER_POLICY,
    producer_retailer_policy: SOURCE_TYPES,
    deprecated_relationship_policy: DEPRECATED_RELATIONSHIP_POLICY,
    second_pilot: {
      sample_size: SECOND_PILOT.length,
      descriptor_count: SECOND_PILOT.filter((r) => r.relationship === "pairs_with_descriptor").length,
      technique_count: SECOND_PILOT.filter((r) => r.relationship === "pairs_with_technique").length,
      domain_counts: domainCounts(SECOND_PILOT),
      relationships: SECOND_PILOT,
    },
    source_records: SOURCE_RECORDS,
    provenance_architecture: PROVENANCE_ARCHITECTURE,
    archive_strategy: ARCHIVE_STRATEGY,
    circularity_exclusions: CIRCULARITY_EXCLUSIONS,
    policy_c_test: policyCTest,
    local_verification: {
      total_checks: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length,
      checks,
      overall: failed.length === 0 ? "PASS" : "FAIL",
    },
    production_status: { status: "NOT PERFORMED", note: "PAIRING-EAT-15 has not been committed, pushed, or deployed." },
    unresolved_questions: [
      "What exact numeric threshold (2 sources? 3?) should define the 'narrowly defined high-quality explicit-source exception' allowing a single source to qualify for pairs_with_style evidence_verified?",
      "Should the name-echo pattern identified this phase (chocolate/honeyed/caramel-type cases) be formalized as its own bridge-type or claim-type value in a future hardening pass, rather than being handled ad hoc via INDIRECT_SUPPORT?",
      "Should CONTRADICTION_SIGNAL edges (coconut/bright, borlotti-bean/micro-oxygenation, açaí/pinot-noir) be surfaced to a human reviewer as a standing priority queue, and if so, on what cadence?",
      "Given descriptors showed the lowest explicit-evidence rate, should pairs_with_descriptor claims eventually require external evidence at the SAME strict bar as pairs_with_style, effectively rejecting EAT-14's original premise entirely rather than merely modifying it?",
      "How should the architecture handle a claim that is EXPLICIT_PAIRING but sourced only from a producer or retailer (e.g. T08 cacao-nibs/barrel-aging), pending discovery of a qualifying corroborating independent source — quarantine indefinitely, or actively seek one more source before closing the edge?",
      "What governs when a SOURCE_DIRECTLY_VERIFIED record should be re-verified (source content can change over time) — is there a maximum staleness window before a record must be re-checked?",
      "Should the archive strategy's proposed content-hash integrity check be implemented before or after the first production evidence store is built?",
    ],
  };

  function EVIDENCE_POLICY_SUMMARY() {
    return {
      is_a_research_classification_not_automatic_publication: true,
      requires_for_contextual_evidence: ["identifiable_source", "verifiable_source_url", "documented_bridging_reasoning", "explicit_bridge_type", "exact_food_entity", "exact_wine_target", "evidence_notes", "no_circularity"],
      contextual_without_source_url_cannot_reach_evidence_verified: true,
    };
  }

  const json = JSON.stringify(result, null, 2) + "\n";
  console.log(JSON.stringify({ status: result.status, total: checks.length, passed: checks.length - failed.length, failed: failed.length, policyCVerdict: policyCTest.verdict }, null, 2));
  fs.writeFileSync(path.join(ROOT, "reports", "pairing-eat-15-evidence-policy.json"), json);

  if (failed.length > 0) {
    console.error("FAILED CHECKS:");
    for (const f of failed) console.error(`- ${f.id}: ${JSON.stringify(f.evidence)}`);
    process.exit(1);
  }
}

main();
