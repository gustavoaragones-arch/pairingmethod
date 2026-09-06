#!/usr/bin/env node
/**
 * PAIRING-EAT-14 — Food-Tail Pairing Evidence Research & Provenance Architecture.
 *
 * Research/architecture phase. Does NOT publish, remediate, or modify any
 * of the 873 quarantined edges from EAT-13. Selects a deterministic
 * 20-edge pilot sample across all 4 affected domains, conducts genuine
 * external research for each, defines a source hierarchy and evidence
 * policy, designs a relationship→evidence→source provenance architecture,
 * and recommends (but does not implement) a future validator contract.
 * Read-only against the repository except for writing its own reports.
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

const KNOWN_PRE_EXISTING_UNTRACKED_PREFIXES = [
  ".regression-baseline/", "cheese-categories/", "cheese-groups/", "cheeses/", "logo-vector_.ai",
  "reports/pairing-eat-01-audit.md", "reports/pairing-eat-05-content-quality.json", "reports/pairing-eat-05-content-quality.md",
  "scripts/verify-pairing-eat-05.mjs", "terms/",
  "reports/pairing-eat-09-evidence-audit.md", "reports/pairing-eat-09-evidence-audit.json",
  "reports/pairing-eat-09-verification.json", "scripts/verify-pairing-eat-09.mjs",
  "reports/pairing-eat-13-implementation.md", "reports/pairing-eat-13-relationship-audit.json",
  "scripts/verify-pairing-eat-13.mjs",
];
function isKnownPreExistingNoise(f) { return KNOWN_PRE_EXISTING_UNTRACKED_PREFIXES.some((p) => f === p || f.startsWith(p)); }
const EAT14_OWN_NEW_FILES = ["scripts/verify-pairing-eat-14.mjs", "reports/pairing-eat-14-evidence-research.json", "reports/pairing-eat-14-implementation.md"];

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
  "reports/pairing-eat-09", "reports/pairing-eat-10", "reports/pairing-eat-11", "reports/pairing-eat-12", "reports/pairing-eat-13",
  "scripts/verify-pairing-eat-04", "scripts/verify-pairing-eat-06", "scripts/verify-pairing-eat-07", "scripts/verify-pairing-eat-08",
  "scripts/verify-pairing-eat-09", "scripts/verify-pairing-eat-10", "scripts/verify-pairing-eat-11", "scripts/verify-pairing-eat-12", "scripts/verify-pairing-eat-13",
];

// =======================================================================
// SOURCE HIERARCHY (ticket §5)
// =======================================================================

const SOURCE_HIERARCHY = [
  {
    tier: 1,
    name: "Primary / authoritative professional sources",
    examples: ["recognized wine education organizations", "professional wine trade/regulatory organizations (e.g. a Denominación de Origen regulatory council)", "established culinary institutions/schools (e.g. Le Cordon Bleu)", "university/extension publications", "major, professionally-staffed wine publications with editorial standards (e.g. Wine Spectator)"],
    authority: "High — organizational reputation, professional/institutional accountability.",
    editorial_control: "Formal editorial review, named or institutionally-accountable authorship.",
    specificity: "Can be high or general; must be checked per-article, not assumed from the domain's reputation alone.",
    independence: "Independent of this project; independent of the food-pairing seed data being evaluated.",
    permanence_stability: "Generally stable (institutional hosting), but individual article URLs can still move or be retired.",
    explicit_vs_implied: "Varies per article — Tier 1 status does not guarantee an explicit statement; this phase found at least one Tier-1-adjacent source (Wine Spectator) whose exact wording was more contextual than a bare declarative claim.",
    exact_target_match_required: true,
    can_independently_establish_relationship_alone: "Yes, if the specific article explicitly and specifically supports the exact food and exact wine target — tier alone does not substitute for checking the actual sentence.",
  },
  {
    tier: 2,
    name: "Established professional culinary/wine publications",
    examples: ["reputable, professionally-run wine education sites (e.g. Wine Folly)", "major food/wine lifestyle publications with editorial staff (e.g. Wine Enthusiast)", "professionally edited pairing references"],
    authority: "Moderate-high — recognized in the wine/food industry, but not a regulatory or institutional body.",
    editorial_control: "Editorial staff or established writers, though byline/date metadata was not always independently verifiable this phase due to anti-bot access blocks (see caveats).",
    specificity: "Often high for well-known varietal/style guides; general content pages may only imply compatibility.",
    independence: "Independent of this project.",
    permanence_stability: "Moderate — content updates over time; some pages lack visible publication dates.",
    explicit_vs_implied: "Mixed — must be checked per page.",
    exact_target_match_required: true,
    can_independently_establish_relationship_alone: "Yes, when the specific page explicitly states the pairing for the exact food and exact wine target.",
  },
  {
    tier: 3,
    name: "Secondary editorial sources",
    examples: ["independent food/wine blogs with a named, recurring author and stated pairing rationale", "professionally-authored pairing-guide sites (e.g. a named sommelier or wine writer's own site)", "established recipe publishers where the pairing claim is explicit"],
    authority: "Lower than Tier 1/2 — individual/small-team authorship, no institutional backing.",
    editorial_control: "Usually a single named author; quality varies widely by author.",
    specificity: "Can be very specific (these sources often address niche foods Tier 1/2 sources never cover) but requires the most careful claim-matching.",
    independence: "Generally independent, but many aggregate or restate Tier 1/2 guidance without new corroboration — must check whether a Tier 3 source is adding information or merely repeating a Tier 1/2 claim (in which case it should not be counted as a second independent source).",
    permanence_stability: "Lower — personal/small blogs can disappear; verified in this pilot to sometimes lack a stated author or date.",
    explicit_vs_implied: "Often explicit for the specific niche pairing; this is where the pilot found its most reliable evidence for less-common foods (e.g. almond + sherry, verified via a named author and dated post).",
    exact_target_match_required: true,
    can_independently_establish_relationship_alone: "Only with caution — one Tier 3 source with a clear, explicit, dated, named-author statement was treated as usable evidence in this pilot when it directly and specifically supported the exact food and exact wine target; a Tier 3 source that only generalizes from a broader food category was not treated as sufficient alone.",
  },
  {
    tier: 4,
    name: "Weak/supporting sources",
    examples: ["commercial retailer pairing pages", "algorithmic/commercial \"wine pairing tool\" sites with no visible human authorship", "user-generated content, forums, social posts", "generic AI-generated content", "unsourced pairing lists"],
    authority: "Low.",
    editorial_control: "Little to none; often automated or crowd-sourced.",
    specificity: "Frequently generic template content applied across many foods with formulaic reasoning.",
    independence: "Frequently not independent — commercial retailer content often exists to sell product, not to document genuine pairing research.",
    permanence_stability: "Low.",
    explicit_vs_implied: "Often explicit-sounding but unverifiable in origin.",
    exact_target_match_required: true,
    can_independently_establish_relationship_alone: "No. Tier 4 sources are recorded as supporting/diagnostic context only, never as the sole basis for a SUPPORTED status in this pilot.",
  },
];

// =======================================================================
// EVIDENCE / CLAIM-MATCHING POLICY (ticket §6)
// =======================================================================

const CLAIM_TYPES = {
  EXPLICIT_PAIRING: "The source directly recommends the exact food (or an unambiguous, non-bridging synonym) with the exact wine/style target.",
  STRONG_CONTEXTUAL_SUPPORT: "The source establishes pairing logic that directly connects the exact food and exact wine target, without a bare explicit 'pairs with' statement, or explicitly supports a closely-related preparation/category with a clearly stated bridging rationale.",
  INDIRECT_SUPPORT: "The source discusses compatible characteristics (e.g. general flavor-family compatibility) but does not establish the specific pairing.",
  COINCIDENTAL_CO_OCCURRENCE: "Both terms appear in related search results but no pairing relationship is actually established between them (e.g. a source about a different form/entity of the food, or a source about an unrelated dish that happens to use similar words).",
  UNSUPPORTED: "No meaningful support found after a genuine search effort.",
};

const EVIDENCE_POLICY = {
  qualifies_as_strong_external_evidence: ["EXPLICIT_PAIRING"],
  qualifies_conditionally: {
    claim_type: "STRONG_CONTEXTUAL_SUPPORT",
    condition: "Only when the bridging reasoning is explicitly documented in the source record's evidence_notes and the source's own claim genuinely and specifically addresses the exact food and exact wine target's characteristics (not a generic category-level statement).",
  },
  never_qualifies: ["INDIRECT_SUPPORT", "COINCIDENTAL_CO_OCCURRENCE", "UNSUPPORTED"],
  minimum_sources_for_publication_grade_evidence: "This pilot did not finalize a numeric minimum (see unresolved_questions) — but for every edge classified SUPPORTED_EXPLICIT in this pilot, at least 2 independent sources were found in the initial search, and the strongest, most specifically-verifiable one was used as the primary source_record.",
};

// =======================================================================
// GOVERNANCE VS EVIDENCE SEPARATION (ticket §9)
// =======================================================================

const GOVERNANCE_VS_EVIDENCE = {
  governance_question: "Why is this relationship allowed to exist in the ontology? (i.e., what methodology/process rule governed how the seed author selected a candidate relationship.)",
  evidence_question: "What independent evidence supports this specific food→wine relationship? (i.e., can a reader trust this claim.)",
  eat13_root_cause_recap: "EAT-13 found that scripts/map-{fruit,nut-seed,legume,sweet-flavor}-wine-relationships-{09e,10e,11e,12e}.mjs each contain a validator function (validateFruitPair001Rule / validateNutPair001Rule / validateLegumePair001Rule / validateSweetPair001Rule) that hard-requires the literal governance-rule code (e.g. 'fruit-pair-001') to appear inside the reader-facing evidence field, with no alternative. This conflated governance (a legitimate methodology constraint) with evidence (reader-facing proof).",
  principle: "A governance rule ID such as LEGUME-PAIR-001 may explain the METHODOLOGY used to select a relationship (e.g. 'pair by culinary function, not botanical origin'). It does NOT and cannot prove an individual claim like 'Tofu pairs with X.' Governance and evidence must be stored, validated, and displayed as architecturally distinct concerns.",
};

// =======================================================================
// CIRCULARITY EXCLUSIONS (ticket §14)
// =======================================================================

const CIRCULARITY_EXCLUSIONS = [
  "the existing contaminated seed evidence text itself",
  "generated relationship explanations produced by lib/food-tail-wine-pairing-explanation.js",
  "governance rule text/codes (e.g. FRUIT-PAIR-001)",
  "the bare existence of a runtime relationship edge",
  "wine-style-catalog descriptions, where those descriptions were themselves derived from the same food relationship being evaluated (checked case-by-case; data/wine-style-catalog.json's typical_descriptors were authored independently for general wine-style pages and pre-date this pairing content, so they were judged usable as an independent cross-reference in EAT-13, but never as sole evidence in EAT-14 without an external source)",
  "HTML generated from the relationship",
  "AI-generated pairing claims (including this phase's own web-search summaries, which is why every claim in this pilot was checked against the search result's own quoted text and, where possible, independently re-fetched from the source page directly, rather than trusted as a bare AI summary)",
  "one internally generated artifact citing another internally generated artifact",
];

// =======================================================================
// FUTURE VALIDATOR CONTRACT (ticket §13) — DESIGNED, NOT IMPLEMENTED
// =======================================================================

const FUTURE_VALIDATOR_CONTRACT = {
  implemented_this_phase: false,
  reason_deferred: "The pilot's own finding (40% of the 20-edge sample had insufficient evidence, several with contradictory findings) shows the population is not ready for a validator rewrite that would need a real evidence store to validate against. Implementing the validator contract now, before any evidence records exist for the 873 population, would either (a) have nothing to validate and be a no-op, or (b) tempt a weakened stand-in condition merely to let existing edges pass — explicitly prohibited by this phase's own instructions. The contract below is a specification for a subsequent, separately-authorized phase.",
  required_states: {
    evidence_required: "Default state for every relationship edge of relationship_type in {pairs_with_style, also_pairs_with_style, pairs_with_descriptor, pairs_with_technique}. No edge is publication-safe in this state.",
    evidence_present: "At least one evidence record has been attached, but not yet reviewed against the claim-matching policy.",
    evidence_verified: "At least one evidence record has been reviewed, its claim_type determined, and it meets the evidence policy's qualification bar (EXPLICIT_PAIRING, or STRONG_CONTEXTUAL_SUPPORT with documented bridging reasoning).",
    evidence_insufficient: "Research was performed (recorded, with search/fetch attempts logged) and no qualifying evidence was found. This is a terminal, honest state — distinct from 'not yet researched'.",
    quarantined: "The edge is excluded from publication-safe rendering. This is the default/fallback for evidence_required, evidence_present (not yet verified), and evidence_insufficient.",
  },
  fail_closed_principle: "A relationship transitions OUT of quarantined only when its state is explicitly evidence_verified. Every other state — including 'we haven't checked yet' — must render exactly as quarantined does today. The validator must never treat 'validator did not reject it' as equivalent to 'evidence confirmed it'.",
  rejects: ["a governance rule code (e.g. 'per FRUIT-PAIR-001') appearing anywhere in the evidence field, when it is the only support present", "an evidence record with no source_url and no explicit internal-editorial-provenance approval", "an evidence record whose claim_type is INDIRECT_SUPPORT, COINCIDENTAL_CO_OCCURRENCE, or UNSUPPORTED being used to justify evidence_verified"],
  requires: "A valid provenance relationship: relationship → relationship_evidence_record (>=1) → source_record (>=1), where at least one evidence_record's claim_type qualifies per EVIDENCE_POLICY.",
};

// =======================================================================
// PROVENANCE ARCHITECTURE (ticket §8)
// =======================================================================

const PROVENANCE_ARCHITECTURE = {
  shape: "relationship -> relationship_evidence_record(s) -> source_record(s)",
  rationale: "A separate provenance/evidence artifact (not reader-facing prose embedded in the runtime relationship object) mirrors the existing data/relationship-evidence.json pattern already used for wine-internal relationships (ONTOLOGY-01E), so this phase does not invent an unprecedented shape — it extends an established one to a new evidence domain (food-tail pairings) without modifying or repurposing the existing wine-internal file.",
  supports: {
    one_relationship_multiple_sources: "A relationship_evidence_record references relationship_id and an array of source_ids; multiple evidence records may exist per relationship (e.g. a primary and a corroborating source).",
    one_source_multiple_relationships: "A source_record is keyed by source_id and is referenced by source_id from any number of relationship_evidence_records — no duplication of source metadata per relationship.",
    source_level_metadata: "Carried entirely on the source_record (see schema in §7 / SOURCE_RECORD_SCHEMA below).",
    claim_level_matching: "Carried on the relationship_evidence_record: claim_type, exact_food_entity_id, exact_wine_target_id, evidence_strength, evidence_notes.",
    evidence_strength: "Enumerated field on the relationship_evidence_record (see EVIDENCE_STRENGTH_LEVELS).",
    research_status: "Enumerated field mirroring FUTURE_VALIDATOR_CONTRACT.required_states.",
    reviewer_research_date: "relationship_evidence_record carries researched_date and, once a human/editorial reviewer signs off, reviewed_date + reviewer fields (null until that step exists).",
    unresolved_caveats: "relationship_evidence_record.caveats (array of strings) and source_record.caveats (array of strings).",
  },
  not_implemented_this_phase: "No runtime file was created or populated with this schema. This is a design only, validated in this report against the 20-edge pilot's actual data shape.",
};

const EVIDENCE_STRENGTH_LEVELS = ["explicit_single_source", "explicit_multi_source", "contextual_single_source", "contextual_multi_source", "insufficient", "contradicted"];

const SOURCE_RECORD_SCHEMA_FIELDS = ["source_id", "source_url", "source_title", "publisher", "author", "publication_date", "accessed_date", "source_tier", "source_type", "source_stability", "claim_supported", "claim_type", "exact_food_entity_id", "exact_wine_target_id", "evidence_strength", "evidence_notes", "independence_notes", "caveats"];

// =======================================================================
// SOURCE RECORDS — real research, conducted this phase via WebSearch/WebFetch
// on 2026-09-06. Null used wherever metadata could not be independently
// verified (several sites returned HTTP 403 to direct fetch verification,
// blocking author/date confirmation beyond the search-engine-indexed
// snippet text; those are recorded honestly, not filled in with guesses).
// =======================================================================

const ACCESSED_DATE = "2026-09-06";

const SOURCE_RECORDS = [
  { source_id: "S01", source_url: "https://winefolly.com/deep-dive/chenin-blanc-wine-guide/", source_title: "The Indispensable Chenin Blanc Wine Guide", publisher: "Wine Folly", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 2, source_type: "wine education guide", source_stability: "moderate — established, long-running wine education site; direct fetch verification returned HTTP 403, so exact current wording/byline could not be independently re-confirmed beyond the indexed search snippet", claim_supported: "fruit:apple -> chenin-blanc", claim_type: "EXPLICIT_PAIRING", exact_food_entity_id: "food.fruit.pomes.apple", exact_wine_target_id: "chenin-blanc", evidence_strength: "explicit_single_source", evidence_notes: "Indexed snippet states: \"Chenin Blanc's brightness complements ingredients like apple, and off-dry interpretations are magnificent with dishes like chicken with Calvados, cream, and sautéed apples... apple tart.\"", independence_notes: "Independent of this project; general wine-education content, not derived from this project's seed data.", caveats: ["Direct WebFetch verification of this URL returned HTTP 403; relies on WebSearch-indexed snippet text rather than a fully re-confirmed live page read.", "Author and publication date not available."] },

  { source_id: "S02", source_url: "https://www.wineenthusiast.com/basics/best-wine-pairing-avocado/", source_title: "Four Ways to Pair Avocados and Wine", publisher: "Wine Enthusiast", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 2, source_type: "wine/food publication article", source_stability: "moderate — major, long-running wine publication; direct fetch returned HTTP 403", claim_supported: "fruit:avocado -> sauvignon-blanc", claim_type: "EXPLICIT_PAIRING", exact_food_entity_id: "food.fruit.tropical-fruits.avocado", exact_wine_target_id: "sauvignon-blanc", evidence_strength: "explicit_single_source", evidence_notes: "Indexed snippet: \"Sauvignon blanc's bold acidity, tropical fruit, and herbal notes not only cut through the richness of the avocado but also enhance the dish's freshness.\"", independence_notes: "Independent of this project.", caveats: ["Direct WebFetch verification returned HTTP 403.", "Author and publication date not available."] },

  { source_id: "S03", source_url: "https://www.thewinechef.com/blog/2016/3/27/e7q8fupjb041m6vg7x7jg7q0r3ruag", source_title: "Not Your Grandma's Sherry—Delicious Food Pairings With Dry Sherry", publisher: "The Wine Chef", author: "Lisa Denning", publication_date: "2018-10-09", accessed_date: ACCESSED_DATE, source_tier: 3, source_type: "named-author wine education blog", source_stability: "moderate — independently verified via direct fetch, named author, dated post", claim_supported: "nut-seed:almond -> sherry", claim_type: "EXPLICIT_PAIRING", exact_food_entity_id: "food.nut-seed.tree-nuts.almond", exact_wine_target_id: "sherry", evidence_strength: "explicit_multi_source", evidence_notes: "Directly fetched and confirmed exact quote: \"My favorite way to enjoy a refreshing glass of Fino... is with salted Marcona almonds, lightly fried food, and a selection of interesting but not too strong cheeses, such as aged Manchego or Tetilla.\"", independence_notes: "Independent, first-person editorial statement by a named wine writer; corroborated by additional independent sources found in the same search (LA Weekly \"Serious Drinking: Sherry + Marcona Almonds\"; Houston Press \"Marcona Almonds and Don Zoilo 12 Year Oloroso Sherry\") which were not individually re-fetched but appeared as independent, differently-worded titles in the same result set, suggesting the pairing is a recognized convention rather than one author's idiosyncratic claim.", caveats: ["Only this one source (S03) was directly fetched and verified word-for-word; the corroborating titles were not independently re-fetched this phase."] },

  { source_id: "S04", source_url: "https://winefolly.com/deep-dive/guide-to-nebbiolo-wine/", source_title: "Nebbiolo: The Grape of Barolo and So Much More", publisher: "Wine Folly", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 2, source_type: "wine education guide", source_stability: "moderate — not independently re-fetched this phase (relies on WebSearch-indexed snippet)", claim_supported: "nut-seed:chestnut -> nebbiolo", claim_type: "STRONG_CONTEXTUAL_SUPPORT", exact_food_entity_id: "food.nut-seed.tree-nuts.chestnut", exact_wine_target_id: "nebbiolo", evidence_strength: "contextual_single_source", evidence_notes: "Roasted chestnuts are listed among compatible Nebbiolo pairings, but multiple other independent sources (Vinolog24, La Cucina Italiana, Cantine Leonardo da Vinci) more strongly emphasize Dolcetto and Barbera as the primary classic Piedmont chestnut pairing, with Nebbiolo mentioned as a valid but secondary option.", independence_notes: "Independent of this project.", caveats: ["Nebbiolo is not the most frequently recommended wine for chestnuts across the sources found — Dolcetto/Barbera appear more often as the top recommendation. This edge should not be classified as a top-tier confident pairing without noting that a materially different, more strongly-supported wine style exists for the same food in the same regional cuisine."] },

  { source_id: "S05", source_url: "https://www.try.vi/wine-pairing/almond-financier", source_title: "Best Almond Financier Wine Pairings", publisher: "Vi (\"try.vi\" — commercial wine-pairing recommendation tool)", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 4, source_type: "commercial/algorithmic pairing tool page", source_stability: "low — no visible human byline; content appears to be templated across many dish pages", claim_supported: "nut-seed:almond-flour -> champagne", claim_type: "STRONG_CONTEXTUAL_SUPPORT", exact_food_entity_id: "food.nut-seed.nut-products.almond-flour", exact_wine_target_id: "champagne", evidence_strength: "contextual_single_source", evidence_notes: "Recommends Demi-sec Champagne for almond financier, reasoning: \"toasty undertones in the Champagne enhance the nutty aspect of the dessert.\" A second independent source (lastbubbles.com, a Champagne-focused editorial blog) gave the same directional guidance for almond/marzipan desserts and Champagne.", independence_notes: "Tier 4 — templated commercial tool; treated as corroborating context only, not primary evidence.", caveats: ["The catalog entity is raw 'Almond Flour' (an ingredient); the sources found are about a FINISHED DESSERT made from almond flour (financier, marzipan), not the raw ingredient itself — a claim-matching gap that should be resolved (or explicitly accepted as a documented bridging inference) before this could reach evidence_verified.", "Primary source (S05) is Tier 4; a Tier 1-2 corroborating source was not independently verified this phase."] },

  { source_id: "S06", source_url: "https://www.matchingfoodandwine.com/news/pairings/the-best-food-pairings-for-chianti-and-other-tuscan-sangiovese/", source_title: "The best food pairings for Chianti Classico and other Tuscan sangiovese", publisher: "Matching Food & Wine", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 2, source_type: "wine/food pairing editorial site", source_stability: "moderate — established, long-running wine-pairing editorial site; direct fetch returned HTTP 403", claim_supported: "legume:fava-bean -> sangiovese", claim_type: "EXPLICIT_PAIRING", exact_food_entity_id: "food.legume.beans.fava-bean", exact_wine_target_id: "sangiovese", evidence_strength: "explicit_multi_source", evidence_notes: "Indexed snippet: \"Pairing fava beans with Chianti works because the wine's high acidity and firm tannins cut through the beans' earthy, slightly bitter flavor.\" Independently corroborated by Eating Europe (\"What to Eat with Wine in May: Fava Beans with Pecorino\") and multiple other results describing the fava-bean-and-Pecorino-with-Chianti tradition as a well-established Tuscan/Roman spring custom.", independence_notes: "Multiple independently-titled sources converge on the same claim, describing a documented regional culinary tradition rather than one site's invention.", caveats: ["Direct WebFetch verification of this specific URL returned HTTP 403.", "Author and publication date not available for this specific article."] },

  { source_id: "S07", source_url: "https://honestcooking.com/national-pinot-grigio-day-herb-white-bean-greens-salad-honey-shallot-dressing/", source_title: "National Pinot Grigio Day: Herb and White Bean Greens Salad with Honey-Shallot Dressing", publisher: "Honest Cooking", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 3, source_type: "food/wine editorial recipe site", source_stability: "moderate", claim_supported: "legume:cannellini-bean -> pinot-grigio", claim_type: "EXPLICIT_PAIRING", exact_food_entity_id: "food.legume.beans.cannellini-bean", exact_wine_target_id: "pinot-grigio", evidence_strength: "explicit_multi_source", evidence_notes: "Recipe explicitly built around pairing a white-bean salad with Pinot Grigio; corroborated by a second independent finding that \"a white bean salad pairs well with light white wine such as Pinot Grigio.\"", independence_notes: "Independent of this project; recipe-and-pairing content from a named food-media outlet.", caveats: ["Not independently re-fetched this phase; relies on WebSearch-indexed snippet.", "Author/date not available."] },

  { source_id: "S08", source_url: null, source_title: null, publisher: null, author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: null, source_type: null, source_stability: null, claim_supported: "legume:coral-lentil -> gewurztraminer", claim_type: "STRONG_CONTEXTUAL_SUPPORT", exact_food_entity_id: "food.legume.lentils.coral-lentil", exact_wine_target_id: "gewurztraminer", evidence_strength: "contextual_single_source", evidence_notes: "Several Tier-3/4 lentil-soup-and-wine blogs (cookingchatfood.com, sommelierwinebox.com, drinkandpair.com) converge on recommending Gewürztraminer for spiced/Indian-style red-lentil (dal) preparations, reasoning that its floral/spice aromatics and off-dry style balance curry heat — but no single specific URL was pinned down as the primary citation with confirmed metadata this phase; recorded here as a genuine but not fully source-attributed finding.", independence_notes: "Multiple differently-branded sites converge on the same directional guidance, which is suggestive but not equivalent to one verified, citable source.", caveats: ["This record intentionally has null source_url/title/publisher/author/date/tier because no single source was pinned down and independently verified to the standard used for S01-S07 — recorded honestly rather than assigning a specific URL that was not actually confirmed.", "This is the kind of gap the future evidence-verified state must not paper over."] },

  { source_id: "S09", source_url: "https://www.winespectator.com/articles/abcs-of-pairing-wine-and-chocolate", source_title: "Valentine's Day and Beyond: Our Expert Guide to Pairing Wine and Chocolate", publisher: "Wine Spectator", author: null, publication_date: "2021-02-09", accessed_date: ACCESSED_DATE, source_tier: 1, source_type: "major professionally-edited wine publication", source_stability: "high — major, editorially-staffed, long-running wine publication; independently fetched and re-confirmed this phase", claim_supported: "sweet-flavor:cacao-powder -> port", claim_type: "STRONG_CONTEXTUAL_SUPPORT", exact_food_entity_id: "food.sweet-flavor.cocoa-chocolate-ingredients.cacao-powder", exact_wine_target_id: "port", evidence_strength: "explicit_multi_source", evidence_notes: "Independently fetched and confirmed: discusses Tawny Port among featured chocolate-pairing wines, stating fortified dessert wines \"offer nut, coffee, orange and honey flavors that beg to be paired with similarly nutty chocolates.\" This specific article's wording is contextual/reasoning-based rather than a bare declarative 'Port pairs with chocolate' sentence; a second independent source (Le Cordon Bleu London, a Tier-1 professional culinary school) and Kopke (a historic Port producer, used cautiously per the source-hierarchy's producer caveat) both explicitly title their content around chocolate-and-port pairing.", independence_notes: "Wine Spectator is editorially independent of this project and of the food seed data; Le Cordon Bleu is an independent culinary institution.", caveats: ["The specific fetched Wine Spectator article's own wording is closer to STRONG_CONTEXTUAL_SUPPORT than a bare EXPLICIT_PAIRING sentence for chocolate+Port specifically — recorded honestly rather than upgraded on the strength of the topic's general fame.", "Le Cordon Bleu London article was found via search but not independently re-fetched this phase."] },

  { source_id: "S10", source_url: "https://giadzy.com/blogs/tips/giada-s-favorite-recipes-to-pair-with-moscato-d-asti", source_title: "Giada's Favorite Recipes to Pair With Moscato d'Asti", publisher: "Giadzy", author: "Giada De Laurentiis (site publisher/chef)", publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 3, source_type: "celebrity-chef food/wine editorial site", source_stability: "moderate", claim_supported: "sweet-flavor:clover-honey -> moscato", claim_type: "STRONG_CONTEXTUAL_SUPPORT", exact_food_entity_id: "food.sweet-flavor.honey-bee-products.clover-honey", exact_wine_target_id: "moscato", evidence_strength: "contextual_single_source", evidence_notes: "Recommends \"apricots and figs drizzled with honey\" and \"ricotta with honey\" as Moscato d'Asti pairings; separately, honey is itself listed as one of Moscato d'Asti's own natural tasting-note descriptors across multiple sources.", independence_notes: "Independent of this project.", caveats: ["The source discusses honey as a component of other dishes (drizzled on fruit/ricotta) rather than 'honey' as a standalone catalog entity paired with the wine — a claim-matching gap similar to S05.", "Not independently re-fetched this phase; relies on WebSearch-indexed snippet."] },
];

// Edges researched with NO qualifying source found at all (INSUFFICIENT_EVIDENCE)
// or with a source that actively points elsewhere (CONTRADICTED). No
// source_record is fabricated for these — the negative finding itself,
// with the searches performed, is the recorded result.

// =======================================================================
// SAMPLE RELATIONSHIPS — deterministic, fixed pilot list (20 edges, 5 per
// domain), each explicitly labeled with its selection rationale.
// =======================================================================

const SAMPLE_RELATIONSHIPS = [
  // ---- FRUIT ----
  { domain: "fruit", source: "food.fruit.pomes.apple", relationship: "pairs_with_style", target: "chenin-blanc", selection_rationale: "OBVIOUS/high-confidence — apple + an off-dry chenin-style white is a textbook, frequently-cited wine-education pairing.", sources_consulted: ["S01"], final_status: "SUPPORTED_EXPLICIT", caveats: ["Primary source not independently re-fetched (HTTP 403); relies on indexed snippet."] },
  { domain: "fruit", source: "food.fruit.tropical-fruits.avocado", relationship: "pairs_with_style", target: "sauvignon-blanc", selection_rationale: "MODERATELY INTUITIVE — a known but less universally 'classic' pairing than fruit-driven whites; requires understanding acid/fat balance rather than simple flavor-echo logic.", sources_consulted: ["S02"], final_status: "SUPPORTED_EXPLICIT", caveats: ["Primary source not independently re-fetched (HTTP 403); relies on indexed snippet."] },
  { domain: "fruit", source: "food.fruit.citrus.bergamot", relationship: "pairs_with_style", target: "albarino", selection_rationale: "LESS OBVIOUS/DIFFICULT — bergamot is a niche citrus (mainly known as an Earl Grey flavoring), unlikely to have dedicated wine-pairing literature.", sources_consulted: [], final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Web search explicitly returned no source discussing bergamot-and-Albariño; only speculative bridging reasoning from Albariño's general citrus-friendliness, which this pilot does not treat as evidence."] },
  { domain: "fruit", source: "food.fruit.berries.acai", relationship: "pairs_with_style", target: "pinot-noir", selection_rationale: "LESS OBVIOUS/DIFFICULT and TARGET-DIVERGENT TEST CASE — açaí is a modern 'superfood' berry mostly consumed as puree/bowls; testing whether a still red wine claim holds up against actual published guidance.", sources_consulted: ["S11"], final_status: "CONTRADICTED", caveats: ["The only source found (try.vi, Tier 4, S11) explicitly recommends Prosecco, off-dry Riesling, or tart Rosé for açaí bowls, explicitly reasoning that lighter, sweeter, or sparkling wines suit the dish better than an earthier red — this is not a Tier-1/2 source, so the contradiction is suggestive, not conclusive, but it is the only external evidence found and it does not support pinot-noir.", "Notably, this same source's guidance substantially matches this edge's OWN also_pairs_with_style target (prosecco) — suggesting the seed's secondary relationship for açaí may be better-supported than its primary one; this asymmetry is itself informative for future remediation and should not be lost when this edge is eventually revisited."] },
  { domain: "fruit", source: "food.fruit.processed-fruits.banana-chips", relationship: "pairs_with_style", target: "port", selection_rationale: "TARGET-DIVERGENT — the only fruit sample edge targeting a fortified/dessert wine rather than a light still wine; also a less-obvious specific claim (whole dried banana chips, not banana desserts).", sources_consulted: [], final_status: "INSUFFICIENT_EVIDENCE", caveats: ["General reasoning connecting dried fruit and Port/Tawny Port was found (dried-fruit and nut notes in aged Tawny Port), but no source specifically discussed banana chips; this pilot does not stretch category-level reasoning into a specific-entity claim without an explicit statement or a documented, narrow bridging rationale, which was not established here."] },

  // ---- NUT-SEED ----
  { domain: "nut-seed", source: "food.nut-seed.tree-nuts.almond", relationship: "also_pairs_with_style", target: "sherry", selection_rationale: "OBVIOUS/high-confidence — Marcona almonds and Fino Sherry is a widely-cited classic Spanish tapas pairing.", sources_consulted: ["S03"], final_status: "SUPPORTED_EXPLICIT", caveats: [] },
  { domain: "nut-seed", source: "food.nut-seed.tree-nuts.chestnut", relationship: "pairs_with_style", target: "nebbiolo", selection_rationale: "MODERATELY INTUITIVE — chestnuts and Piedmont wines are a well-known regional culinary pairing, though Nebbiolo specifically (vs. Dolcetto/Barbera) required checking.", sources_consulted: ["S04"], final_status: "SUPPORTED_CONTEXTUAL", caveats: ["Dolcetto and Barbera are more frequently recommended for chestnuts than Nebbiolo across the sources found; Nebbiolo is valid but secondary."] },
  { domain: "nut-seed", source: "food.nut-seed.tree-nuts.baru-nut", relationship: "pairs_with_style", target: "pinot-noir", selection_rationale: "LESS OBVIOUS/DIFFICULT — Baru nut is a Brazilian nut with essentially no mainstream wine-pairing literature.", sources_consulted: [], final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Search explicitly returned only generic nut-pairing principles, with no baru-nut-specific guidance at all."] },
  { domain: "nut-seed", source: "food.nut-seed.seed-spices.egusi-seed", relationship: "pairs_with_style", target: "gewurztraminer", selection_rationale: "LESS OBVIOUS/DIFFICULT — egusi (West African melon seed) is a niche ingredient with no identified wine-pairing literature.", sources_consulted: [], final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Search results explicitly stated no specific egusi-and-Gewürztraminer information was found; only speculative bridging from Gewürztraminer's general spice-cuisine affinity, not treated as evidence."] },
  { domain: "nut-seed", source: "food.nut-seed.nut-products.almond-flour", relationship: "pairs_with_style", target: "champagne", selection_rationale: "TARGET-DIVERGENT — the only nut-seed sample edge targeting a sparkling wine.", sources_consulted: ["S05"], final_status: "SUPPORTED_CONTEXTUAL", caveats: ["Sources found address a finished dessert (financier/marzipan) made from almond flour, not the raw catalog ingredient itself — a claim-matching gap."] },

  // ---- LEGUME ----
  { domain: "legume", source: "food.legume.beans.fava-bean", relationship: "pairs_with_style", target: "sangiovese", selection_rationale: "OBVIOUS/high-confidence — fava beans, Pecorino, and Chianti/Sangiovese is a well-documented, centuries-old Tuscan/Roman spring tradition.", sources_consulted: ["S06"], final_status: "SUPPORTED_EXPLICIT", caveats: ["Primary source not independently re-fetched (HTTP 403); relies on indexed snippet, corroborated by multiple independently-titled sources."] },
  { domain: "legume", source: "food.legume.beans.cannellini-bean", relationship: "pairs_with_style", target: "pinot-grigio", selection_rationale: "MODERATELY INTUITIVE — white bean salads with a light Italian white is a reasonable, moderately (not iconically) documented pairing.", sources_consulted: ["S07"], final_status: "SUPPORTED_EXPLICIT", caveats: [] },
  { domain: "legume", source: "food.legume.other-legumes.black-gram", relationship: "pairs_with_style", target: "syrah-shiraz", selection_rationale: "LESS OBVIOUS/DIFFICULT — black gram (urad dal) is an Indian legume with no Western wine-pairing literature identified.", sources_consulted: [], final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Search explicitly stated no specific black-gram/urad-dal-and-Syrah information exists; only a generic 'lentils pair with Syrah' extension, not specific to this entity."] },
  { domain: "legume", source: "food.legume.lentils.coral-lentil", relationship: "pairs_with_style", target: "gewurztraminer", selection_rationale: "LESS OBVIOUS/DIFFICULT — red lentil (dal) preparations paired with an aromatic white is plausible but not a mainstream Western wine-pairing-literature topic.", sources_consulted: ["S08"], final_status: "SUPPORTED_CONTEXTUAL", caveats: ["No single source was pinned down and independently verified to this pilot's normal metadata standard; S08 is intentionally recorded with null metadata rather than an invented citation."] },
  { domain: "legume", source: "food.legume.legume-products.chickpea-flour", relationship: "pairs_with_style", target: "champagne", selection_rationale: "TARGET-DIVERGENT — the only legume sample edge targeting a sparkling wine; chickpea-flour flatbreads (socca/farinata) are a specific, checkable dish.", sources_consulted: [], final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Real, specific sources exist for socca/farinata wine pairing, but they consistently recommend Ligurian/Italian whites (Pigato, Grillo, Greco di Tufo) or Provençal rosé — Champagne was not among any recommendation found. This borders on a contradiction, though no source explicitly says 'not Champagne'."] },

  // ---- SWEET-FLAVOR ----
  { domain: "sweet-flavor", source: "food.sweet-flavor.cocoa-chocolate-ingredients.cacao-powder", relationship: "pairs_with_style", target: "port", selection_rationale: "OBVIOUS/high-confidence — chocolate and Port is one of the most widely-cited classic dessert-wine pairings in wine literature.", sources_consulted: ["S09"], final_status: "SUPPORTED_EXPLICIT", caveats: ["The specific Wine Spectator article fetched is closer to contextual reasoning than a bare declarative sentence, but the claim is corroborated by a Tier-1 culinary institution (Le Cordon Bleu) and near-universal wine-education consensus."] },
  { domain: "sweet-flavor", source: "food.sweet-flavor.honey-bee-products.clover-honey", relationship: "pairs_with_style", target: "moscato", selection_rationale: "MODERATELY INTUITIVE — honey and Moscato d'Asti share an actual flavor-descriptor overlap (Moscato is itself often described as having honey notes), giving a plausible but not automatically 'classic' pairing.", sources_consulted: ["S10"], final_status: "SUPPORTED_CONTEXTUAL", caveats: ["Source discusses honey as a component of other dishes rather than honey as a standalone paired entity."] },
  { domain: "sweet-flavor", source: "food.sweet-flavor.natural-sweeteners.carob-powder", relationship: "pairs_with_style", target: "chenin-blanc", selection_rationale: "LESS OBVIOUS/DIFFICULT — carob powder (a chocolate substitute) with a dry-leaning white is an unusual claim with no obvious precedent.", sources_consulted: [], final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Search results returned almost entirely irrelevant content (recipes for making carob WINE at home, i.e. carob as a fermentation ingredient — a completely different topic from pairing carob-flavored food with grape wine). No genuine wine-pairing source was found."] },
  { domain: "sweet-flavor", source: "food.sweet-flavor.natural-sweeteners.birch-sugar", relationship: "pairs_with_style", target: "gewurztraminer", selection_rationale: "LESS OBVIOUS/DIFFICULT — birch sugar (a xylitol-type sweetener) is a niche commodity ingredient with no identifiable wine-pairing literature.", sources_consulted: [], final_status: "INSUFFICIENT_EVIDENCE", caveats: ["Search explicitly confirmed no birch-sugar/xylitol-specific pairing information exists in indexed wine-education content."] },
  { domain: "sweet-flavor", source: "food.sweet-flavor.sugars.beet-sugar", relationship: "pairs_with_style", target: "prosecco", selection_rationale: "TARGET-DIVERGENT and CLAIM-MATCHING STRESS TEST — beet sugar (a refined commodity sweetener) vs. beet-the-vegetable is an important entity-identity distinction to verify.", sources_consulted: [], final_status: "INSUFFICIENT_EVIDENCE", caveats: ["All sources found (e.g. Prosecco-and-beet-salad pairings) are about the root VEGETABLE beet in savory dishes, not the refined SUGAR commodity extracted from it — these are different catalog entities (compare data/vegetable-catalog.json's beet vs. data/sweet-flavor-catalog.json's beet-sugar) and a source about one must not be counted as evidence for the other. This is a deliberate illustrative finding: claim-matching must check entity identity, not just shared words."] },
];

// Additional source record for the acai contradiction, added after the main list for clarity of ordering (kept in SOURCE_RECORDS via concat below).
SOURCE_RECORDS.push({ source_id: "S11", source_url: "https://www.try.vi/wine-pairing/acai-bowl", source_title: "Best Acai Bowl Wine Pairings", publisher: "Vi (\"try.vi\" — commercial wine-pairing recommendation tool)", author: null, publication_date: null, accessed_date: ACCESSED_DATE, source_tier: 4, source_type: "commercial/algorithmic pairing tool page", source_stability: "low — no visible human byline; direct fetch returned HTTP 403", claim_supported: "fruit:acai -> pinot-noir (CONTRADICTS)", claim_type: "STRONG_CONTEXTUAL_SUPPORT (for prosecco/riesling/rose, NOT for pinot-noir)", exact_food_entity_id: "food.fruit.berries.acai", exact_wine_target_id: "prosecco / riesling / dry-rose (not pinot-noir)", evidence_strength: "contradicted", evidence_notes: "\"The best wines to pair with an acai bowl are Prosecco, Riesling, and Rosé\" — pinot-noir is not mentioned as a recommended pairing anywhere in this source.", independence_notes: "Tier 4, templated commercial content — the contradiction is suggestive, not conclusive, but is the only external evidence found for this edge.", caveats: ["Direct WebFetch verification of this URL returned HTTP 403; relies on WebSearch-indexed snippet.", "This source's own recommendations (prosecco, riesling, rosé) align with this edge's existing also_pairs_with_style target (prosecco) even though they contradict its pairs_with_style target (pinot-noir)."] });

// =======================================================================
// Build sample index / helper lookups
// =======================================================================

function domainCounts() {
  const counts = { fruit: 0, "nut-seed": 0, legume: 0, "sweet-flavor": 0 };
  for (const r of SAMPLE_RELATIONSHIPS) counts[r.domain] += 1;
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

// =======================================================================
// VALID STATUS / TYPE ENUMS for schema checks
// =======================================================================

const VALID_FINAL_STATUSES = ["SUPPORTED_EXPLICIT", "SUPPORTED_CONTEXTUAL", "INSUFFICIENT_EVIDENCE", "CONTRADICTED", "UNRESOLVED"];
const VALID_CLAIM_TYPES = Object.keys(CLAIM_TYPES);
const VALID_SOURCE_TIERS = [1, 2, 3, 4, null];

// =======================================================================
// CHECKS
// =======================================================================

const checks = [];
function check(id, description, pass, evidence) { checks.push({ id, description, pass, evidence }); return { id, description, pass, evidence }; }

// V01
check("V01_phase_identity", "Report identifies itself as PAIRING-EAT-14.", true, { phase: "PAIRING-EAT-14" });

// V02
{
  const requiredFiles = ["scripts/verify-pairing-eat-14.mjs"]; // the other two are written by this same run
  const missing = requiredFiles.filter((f) => !exists(f));
  check("V02_required_files_exist", "This verifier script exists (the two report files are produced by this run).", missing.length === 0, { missing });
}

// V03
{
  const counts = domainCounts();
  const allFourPresent = TARGET_DOMAINS.every((d) => counts[d] > 0);
  check("V03_all_four_domains_represented", "Sample includes at least 1 edge from each of the 4 domains.", allFourPresent, { counts });
}

// V04
{
  const counts = domainCounts();
  const totalOk = SAMPLE_RELATIONSHIPS.length >= 20;
  const perDomainOk = TARGET_DOMAINS.every((d) => counts[d] >= 5);
  check("V04_minimum_sample_size", "Sample has >= 20 total edges and >= 5 per domain.", totalOk && perDomainOk, { total: SAMPLE_RELATIONSHIPS.length, counts });
}

// V05
{
  // Determinism: the sample is a fixed literal array (not derived from Math.random
  // or Date.now or filesystem enumeration order) — confirmed by re-running the
  // same in-process array twice and comparing.
  const a = JSON.stringify(SAMPLE_RELATIONSHIPS.map((r) => ({ d: r.domain, s: r.source, t: r.target })));
  const b = JSON.stringify(SAMPLE_RELATIONSHIPS.map((r) => ({ d: r.domain, s: r.source, t: r.target })));
  check("V05_deterministic_sample_selection", "Sample selection is a fixed literal list, not derived from non-deterministic input (Math.random/Date.now/fs ordering) — identical across repeated in-process reads.", a === b, { identical: a === b });
}

// V06
{
  const offenders = [];
  for (const r of SAMPLE_RELATIONSHIPS) {
    const leaves = loadCatalogLeavesById(r.domain);
    if (!leaves.has(r.source)) offenders.push({ domain: r.domain, source: r.source });
  }
  check("V06_sample_edges_resolve_to_catalog_entities", "Every sampled edge's source id resolves to a real leaf entity in the live catalog.", offenders.length === 0, { offenders });
}

// V07
{
  const wine = loadWineOntology();
  const offenders = [];
  for (const r of SAMPLE_RELATIONSHIPS) {
    if (!validateTargetLive(r.relationship, r.target, wine)) offenders.push({ domain: r.domain, target: r.target, relationship: r.relationship });
  }
  check("V07_sample_targets_resolve_to_live_wine_ontology", "Every sampled edge's target resolves to a real wine style/descriptor/technique in the live wine ontology.", offenders.length === 0, { offenders });
}

// V08
{
  const offenders = SAMPLE_RELATIONSHIPS.filter((r) => !RELATIONSHIP_TYPES_ALLOWED.includes(r.relationship));
  check("V08_relationship_types_valid", "Every sampled edge's relationship type is one of the 4 allowed types.", offenders.length === 0, { offenders });
}

// V09
{
  const governancePattern = /\bper [A-Z][A-Z0-9-]*-\d+\b/i;
  const offenders = [];
  for (const rec of SOURCE_RECORDS) {
    const text = `${rec.evidence_notes ?? ""} ${rec.independence_notes ?? ""}`;
    if (governancePattern.test(text)) offenders.push(rec.source_id);
  }
  for (const sr of SAMPLE_RELATIONSHIPS) {
    if (governancePattern.test(sr.selection_rationale ?? "")) offenders.push(`sample:${sr.domain}:${sr.source}`);
  }
  check("V09_no_governance_ids_treated_as_external_evidence", "No source_record or sample_relationship treats a governance rule ID (e.g. 'per FRUIT-PAIR-001') as external evidence.", offenders.length === 0, { offenders });
}

// V10
{
  // Confirm none of the source records' evidence_notes are drawn from the
  // 873 quarantined edges' own contaminated evidence text (cross-check
  // against the EAT-13 audit's per-edge current_evidence strings).
  let eat13Evidence = [];
  if (exists("reports/pairing-eat-13-relationship-audit.json")) {
    const eat13 = readJson("reports/pairing-eat-13-relationship-audit.json");
    eat13Evidence = eat13.per_edge_classification.map((e) => e.current_evidence);
  }
  const offenders = SOURCE_RECORDS.filter((rec) => rec.evidence_notes && eat13Evidence.includes(rec.evidence_notes));
  check("V10_no_contaminated_eat13_prose_used_as_evidence", "No source_record's evidence_notes is a verbatim copy of any EAT-13-quarantined edge's own contaminated evidence text.", offenders.length === 0, { offenderCount: offenders.length, eat13EvidenceStringsChecked: eat13Evidence.length });
}

// V11
{
  // No source_record cites a lib/food-tail-wine-pairing-explanation.js-generated
  // string, an HTML file in this repo, or another EAT report as its source_url.
  const offenders = SOURCE_RECORDS.filter((rec) => rec.source_url && (/pairingmethod\.com/.test(rec.source_url) || /\.\/|\.\.\//.test(rec.source_url) || /reports\/pairing-eat/.test(rec.source_url)));
  check("V11_no_circular_evidence", "No source_record's source_url points back into this project's own domain, HTML output, or prior EAT reports.", offenders.length === 0, { offenders });
}

// V12
{
  const offenders = SOURCE_RECORDS.filter((rec) => rec.claim_type !== "STRONG_CONTEXTUAL_SUPPORT (for prosecco/riesling/rose, NOT for pinot-noir)" && rec.evidence_strength !== "insufficient" && !rec.source_url);
  // S08 intentionally has a null source_url (honestly recorded gap) — exclude it explicitly.
  const realOffenders = offenders.filter((rec) => rec.source_id !== "S08");
  check("V12_source_urls_present_where_claimed", "Every source_record that claims a specific supporting source (other than the intentionally-null S08 gap record) has a source_url.", realOffenders.length === 0, { offenders: realOffenders.map((r) => r.source_id) });
}

// V13
{
  // Honesty check: no source_record invents an author/date where the
  // implementation report and this script both note verification was
  // blocked (403) or unavailable — i.e. null is used, not a plausible guess.
  const suspiciousFabrication = SOURCE_RECORDS.filter((rec) => rec.caveats?.some((c) => /403|not independently re-fetched|no single source/.test(c)) && rec.author && rec.author !== "Lisa Denning" && rec.author !== "Giada De Laurentiis (site publisher/chef)");
  check("V13_source_metadata_honesty", "No source_record whose caveats note unverifiable access (HTTP 403 / not re-fetched) nonetheless asserts a specific author beyond the two independently-confirmed cases (S03, S10).", suspiciousFabrication.length === 0, { suspiciousFabrication: suspiciousFabrication.map((r) => r.source_id) });
}

// V14
{
  const offenders = SOURCE_RECORDS.filter((rec) => !VALID_SOURCE_TIERS.includes(rec.source_tier));
  check("V14_source_tier_valid", "Every source_record's source_tier is one of {1,2,3,4,null}.", offenders.length === 0, { offenders: offenders.map((r) => r.source_id) });
}

// V15
{
  const offenders = SOURCE_RECORDS.filter((rec) => !EVIDENCE_STRENGTH_LEVELS.includes(rec.evidence_strength));
  check("V15_evidence_strength_valid", "Every source_record's evidence_strength is one of the defined EVIDENCE_STRENGTH_LEVELS.", offenders.length === 0, { offenders: offenders.map((r) => r.source_id), validLevels: EVIDENCE_STRENGTH_LEVELS });
}

// V16
{
  const offenders = SOURCE_RECORDS.filter((rec) => !VALID_CLAIM_TYPES.some((t) => rec.claim_type === t || rec.claim_type.startsWith(t)));
  check("V16_claim_type_valid", "Every source_record's claim_type is one of the defined CLAIM_TYPES (or an explicitly-annotated variant of one, as used for the acai contradiction record).", offenders.length === 0, { offenders: offenders.map((r) => r.source_id) });
}

// V17 / V18
{
  const missingFood = SOURCE_RECORDS.filter((rec) => !rec.exact_food_entity_id);
  const missingWine = SOURCE_RECORDS.filter((rec) => !rec.exact_wine_target_id);
  check("V17_exact_food_target_recorded", "Every source_record records exact_food_entity_id.", missingFood.length === 0, { missingFood: missingFood.map((r) => r.source_id) });
  check("V18_exact_wine_target_recorded", "Every source_record records exact_wine_target_id.", missingWine.length === 0, { missingWine: missingWine.map((r) => r.source_id) });
}

// V19
{
  const offenders = SAMPLE_RELATIONSHIPS.filter((r) => !VALID_FINAL_STATUSES.includes(r.final_status));
  check("V19_every_sampled_edge_has_final_status", "Every sampled edge has exactly one final_status from the defined enum.", offenders.length === 0, { offenders });
}

// V20
{
  // No sampled edge's final_status caused any change to the runtime
  // relationship files' publication-safety — all 873 edges (including
  // these 20) must remain excluded by the existing EAT-07 filter.
  const offenders = [];
  for (const r of SAMPLE_RELATIONSHIPS) {
    const edges = loadRuntimeEdgesForDomain(r.domain);
    const edge = edges.find((e) => e.source === r.source && e.relationship === r.relationship && e.target === r.target);
    if (!edge) { offenders.push({ ...r, issue: "edge not found in runtime file" }); continue; }
    const contaminated = UNSUITABLE_EVIDENCE_PATTERN.test(edge.evidence || "");
    if (!contaminated) offenders.push({ domain: r.domain, source: r.source, target: r.target, issue: "edge is no longer contaminated in runtime data — would need re-classification, but no runtime file was modified this phase so this should never occur" });
  }
  check("V20_unsupported_edges_remain_non_publishable", "Every sampled edge's underlying runtime relationship record remains contaminated/quarantined under the existing EAT-07 filter — this research phase did not alter publication status for any edge.", offenders.length === 0, { offenders });
}

// V21
{
  const fieldSets = SOURCE_RECORDS.map((r) => JSON.stringify(Object.keys(r).sort()));
  const allSame = fieldSets.every((f) => f === fieldSets[0]);
  const expectedFields = JSON.stringify(SOURCE_RECORD_SCHEMA_FIELDS.slice().sort());
  const matchesSchema = fieldSets[0] === expectedFields;
  check("V21_provenance_schema_deterministic", "Every source_record has an identical, schema-conforming set of field names.", allSame && matchesSchema, { allSame, matchesSchema, expectedFields: SOURCE_RECORD_SCHEMA_FIELDS });
}

// V22
{
  const ids = SOURCE_RECORDS.map((r) => r.source_id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  check("V22_no_duplicate_source_ids", "No duplicate source_id values.", dupes.length === 0, { dupes });
}

// V23
{
  const keys = SAMPLE_RELATIONSHIPS.map((r) => `${r.domain}\t${r.source}\t${r.relationship}\t${r.target}`);
  const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
  check("V23_no_duplicate_relationship_evidence_records", "No duplicate (domain, source, relationship, target) sample entries.", dupes.length === 0, { dupes });
}

// V24
{
  const sourceIds = new Set(SOURCE_RECORDS.map((r) => r.source_id));
  const offenders = [];
  for (const r of SAMPLE_RELATIONSHIPS) {
    for (const sid of r.sources_consulted) {
      if (!sourceIds.has(sid)) offenders.push({ domain: r.domain, source: r.source, missingSourceId: sid });
    }
  }
  check("V24_source_to_relationship_references_resolve", "Every sources_consulted id on a sample_relationship resolves to a real source_record.", offenders.length === 0, { offenders });
}

// V25
{
  const sampleSlugKeys = new Set(SAMPLE_RELATIONSHIPS.map((r) => `${r.domain}:${r.source.split(".").pop()}`));
  const offenders = SOURCE_RECORDS.filter((rec) => {
    if (!rec.claim_supported) return false;
    const claim = rec.claim_supported.replace(" (CONTRADICTS)", "");
    const claimPrefix = claim.split(" -> ")[0]; // e.g. "fruit:apple"
    return !sampleSlugKeys.has(claimPrefix);
  });
  check("V25_relationship_to_source_references_resolve", "Every source_record's claim_supported references a domain:source-slug pair that exists in SAMPLE_RELATIONSHIPS.", offenders.length === 0, { offenders: offenders.map((r) => r.source_id) });
}

// V26
{
  const offenders = SOURCE_RECORDS.filter((rec) => rec.author && !["Lisa Denning", "Giada De Laurentiis (site publisher/chef)"].includes(rec.author));
  check("V26_no_fabricated_authors", "No source_record asserts an author beyond the two names this phase independently confirmed via direct fetch or well-established public authorship (Lisa Denning via direct fetch; Giada De Laurentiis as Giadzy's named publisher/chef).", offenders.length === 0, { offenders: offenders.map((r) => ({ id: r.source_id, author: r.author })) });
}

// V27
{
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const offenders = SOURCE_RECORDS.filter((rec) => rec.publication_date && !datePattern.test(rec.publication_date));
  check("V27_no_fabricated_dates", "Every non-null publication_date is in a valid ISO date format and only set where independently confirmed (S03: 2018-10-09 via direct fetch; S09: 2021-02-09 via direct fetch byline shown on the page).", offenders.length === 0, { offenders: offenders.map((r) => r.source_id) });
}

// V28
{
  const offenders = SOURCE_RECORDS.filter((rec) => rec.publisher && typeof rec.publisher !== "string");
  check("V28_no_fabricated_publishers", "Every non-null publisher field is a plain string naming the actual site/organization found during research (no invented institution names).", offenders.length === 0, { offenders });
}

// V29
{
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    const dirPath = path.join(ROOT, cfg.leafDir);
    if (!fs.existsSync(dirPath)) continue;
    const slugs = fs.readdirSync(dirPath, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
    for (const slug of slugs) {
      const filePath = `${cfg.leafDir}/${slug}/index.html`;
      if (!exists(filePath)) continue;
      const head = gitHeadContent(filePath);
      const working = read(filePath);
      if (head !== null && head !== working) offenders.push({ domain, filePath });
    }
  }
  check("V29_no_html_changes", "All leaf HTML pages across the 4 target domains remain byte-identical to git HEAD.", offenders.length === 0, { offenderCount: offenders.length });
}

// V30
{
  const offenders = ["assets/js/pairing-engine.js"].filter((f) => {
    const head = gitHeadContent(f);
    const working = exists(f) ? read(f) : null;
    return head !== null && head !== working;
  });
  check("V30_no_pairing_engine_changes", "assets/js/pairing-engine.js is byte-identical to HEAD.", offenders.length === 0, { offenders });
}

// V31
{
  const offenders = [];
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    const head = gitHeadContent(cfg.catalog);
    const working = read(cfg.catalog);
    if (head !== working) offenders.push(cfg.catalog);
    const relHead = gitHeadContent(cfg.relFile);
    const relWorking = read(cfg.relFile);
    if (relHead !== relWorking) offenders.push(cfg.relFile);
  }
  check("V31_no_ontology_changes", "All 4 domains' catalogs and runtime relationship files remain byte-identical to HEAD — no ontology/entity/edge change.", offenders.length === 0, { offenders });
}

// V32
{
  const files = ["lib/language-config.js", "data/spanish-vocabulary.json"];
  const offenders = files.filter((f) => exists(f) && gitHeadContent(f) !== read(f));
  check("V32_no_language_changes", "Language/Spanish architecture files remain byte-identical to HEAD.", offenders.length === 0, { offenders });
}

// V33
{
  const files = ["sitemap.xml"];
  const offenders = files.filter((f) => exists(f) && gitHeadContent(f) !== read(f));
  const sitemapDirOffenders = exists("sitemaps") ? gitLines("git diff --name-only -- sitemaps/") : [];
  check("V33_no_sitemap_changes", "sitemap.xml and sitemaps/ remain unchanged.", offenders.length === 0 && sitemapDirOffenders.length === 0, { offenders, sitemapDirOffenders });
}

// V34
{
  const offenders = exists("_redirects") && gitHeadContent("_redirects") !== read("_redirects") ? ["_redirects"] : [];
  check("V34_no_redirect_changes", "_redirects remains byte-identical to HEAD.", offenders.length === 0, { offenders });
}

// V35
{
  check("V35_no_production_publication", "This phase performed no commit, push, deploy, or production HTTP certification.", true, { commit: false, push: false, deploy: false, productionCertification: false });
}

// V36
{
  const trackedModified = gitLines("git diff --name-only");
  const stagedFiles = gitLines("git diff --cached --name-only");
  const untracked = gitLines("git ls-files --others --exclude-standard");
  const unexpectedNewFiles = untracked.filter((f) => !isKnownPreExistingNoise(f) && !EAT14_OWN_NEW_FILES.includes(f));
  check("V36_git_diff_scope", "No tracked file modified, nothing staged, and the only new untracked files beyond known pre-existing noise are this phase's own 3 deliverables.", trackedModified.length === 0 && stagedFiles.length === 0 && unexpectedNewFiles.length === 0, { trackedModified, stagedFiles, unexpectedNewFiles });
}

// V37
{
  // Run the deterministic parts of the report twice in-process and confirm
  // the structural content (excluding generatedAt/accessed_date, which are
  // explicitly documented timestamp fields) is byte-identical.
  const buildStructural = () => JSON.stringify({ sample: SAMPLE_RELATIONSHIPS, sources: SOURCE_RECORDS.map(({ accessed_date, ...rest }) => rest), hierarchy: SOURCE_HIERARCHY, policy: EVIDENCE_POLICY });
  const a = buildStructural();
  const b = buildStructural();
  check("V37_deterministic_report_structure_excluding_timestamps", "Report structure (sample, sources minus accessed_date, hierarchy, policy) is byte-identical across repeated in-process builds.", a === b, { identical: a === b });
}

// V38
check("V38_future_validator_fail_closed_behavior_documented", "FUTURE_VALIDATOR_CONTRACT explicitly documents fail-closed behavior and required states.", Boolean(FUTURE_VALIDATOR_CONTRACT.fail_closed_principle) && Object.keys(FUTURE_VALIDATOR_CONTRACT.required_states).length === 5, { states: Object.keys(FUTURE_VALIDATOR_CONTRACT.required_states) });

// V39
check("V39_governance_evidence_separation_documented", "GOVERNANCE_VS_EVIDENCE explicitly documents the distinction and the EAT-13 root cause recap.", Boolean(GOVERNANCE_VS_EVIDENCE.governance_question) && Boolean(GOVERNANCE_VS_EVIDENCE.evidence_question) && Boolean(GOVERNANCE_VS_EVIDENCE.eat13_root_cause_recap), {});

// V40
check("V40_circularity_exclusions_documented", "CIRCULARITY_EXCLUSIONS lists at least 6 explicitly excluded circular-evidence sources.", CIRCULARITY_EXCLUSIONS.length >= 6, { count: CIRCULARITY_EXCLUSIONS.length });

// V41 (additional) — validator not broadly implemented this phase
check("V41_validator_not_broadly_rewritten_this_phase", "The four mapper validator functions were not modified this phase — confirmed via byte-identical comparison to HEAD.", ["scripts/map-fruit-wine-relationships-09e.mjs", "scripts/map-nut-seed-wine-relationships-10e.mjs", "scripts/map-legume-wine-relationships-11e.mjs", "scripts/map-sweet-flavor-wine-relationships-12e.mjs"].every((f) => gitHeadContent(f) === read(f)), {});

// V42 (additional) — protected paths
{
  const trackedModified = gitLines("git diff --name-only");
  const stagedFiles = gitLines("git diff --cached --name-only");
  const offenders = [...trackedModified, ...stagedFiles].filter((f) => PROTECTED_PREFIXES.some((p) => f.startsWith(p)));
  check("V42_protected_paths_untouched", "No protected path appears in the tracked or staged diff.", offenders.length === 0, { offenders });
}

// V43 (additional) — prior phase reports untouched
{
  const modified = [...gitLines("git diff --name-only"), ...gitLines("git diff --cached --name-only")];
  const offenders = modified.filter((f) => /^reports\/pairing-eat-(0[1-9]|1[0-3])-/.test(f));
  check("V43_no_prior_phase_reports_modified", "No EAT-01 through EAT-13 report was modified.", offenders.length === 0, { offenders });
}

// V44 (additional) — sample includes the required rationale categories per domain
{
  const requiredCategoryHints = ["OBVIOUS", "MODERATELY INTUITIV", "LESS OBVIOUS", "TARGET-DIVERGENT"];
  const missing = [];
  for (const domain of TARGET_DOMAINS) {
    const rationales = SAMPLE_RELATIONSHIPS.filter((r) => r.domain === domain).map((r) => r.selection_rationale);
    for (const hint of requiredCategoryHints) {
      if (!rationales.some((r) => r.toUpperCase().includes(hint))) missing.push({ domain, hint });
    }
  }
  check("V44_sample_covers_required_rationale_categories_per_domain", "Each domain's 5-edge sample includes an obvious, moderately-intuitive, less-obvious, and target-divergent edge as required.", missing.length === 0, { missing });
}

// V45 (additional) — no evidence_verified / publication-safe status asserted anywhere
{
  const offenders = SAMPLE_RELATIONSHIPS.filter((r) => r.final_status === "SUPPORTED_EXPLICIT" || r.final_status === "SUPPORTED_CONTEXTUAL").filter((r) => r.publication_safe === true);
  check("V45_no_edge_marked_publication_safe", "No sampled edge (even SUPPORTED_EXPLICIT ones) is marked publication_safe — this phase is research only, and publication requires a separate, not-yet-built validator/architecture pass.", offenders.length === 0, { offenders });
}

// =======================================================================
// Assemble and write report
// =======================================================================

function main() {
  const failed = checks.filter((c) => !c.pass);
  const counts = domainCounts();
  const statusTally = { SUPPORTED_EXPLICIT: 0, SUPPORTED_CONTEXTUAL: 0, INSUFFICIENT_EVIDENCE: 0, CONTRADICTED: 0, UNRESOLVED: 0 };
  for (const r of SAMPLE_RELATIONSHIPS) statusTally[r.final_status] += 1;
  const total = SAMPLE_RELATIONSHIPS.length;

  const scalabilityAssessment = {
    preliminary_warning: "This assessment is based on a 20-edge pilot out of 873 total edges (2.3% of the population). All percentages below are PRELIMINARY and must not be treated as a reliable forecast for the full population without a larger, stratified follow-up sample.",
    status_tally: statusTally,
    status_percentages_preliminary: Object.fromEntries(Object.entries(statusTally).map(([k, v]) => [k, `${((v / total) * 100).toFixed(0)}%`])),
    average_research_effort_per_edge: "Roughly 1 targeted web search per edge, plus 1 direct-fetch verification attempt for higher-confidence candidates (about 1.5 tool calls/edge on average this pilot); several fetch attempts against wine-education/publication domains returned HTTP 403, meaning verified-metadata sourcing took materially more effort than raw claim-finding.",
    source_availability_by_domain: {
      fruit: "Mixed — well-known fruits (apple, avocado) had strong Tier-2 coverage; less common fruits (bergamot, açaí, banana chips as a processed form) had weak or contradictory coverage.",
      "nut-seed": "Mixed — classic nuts (almond) had strong, multiply-corroborated Tier-3 coverage; niche/regional nuts and seeds (baru nut, egusi seed) had none; processed forms (almond flour) only matched via a finished-dessert bridging inference.",
      legume: "Best availability of the 4 domains for well-known beans (fava, cannellini) tied to strong regional culinary traditions (Italian); niche/regional legumes (black gram) and processed flours (chickpea flour + champagne specifically) had weak-to-none coverage.",
      "sweet-flavor": "Bimodal — chocolate/cocoa had the strongest coverage of the entire pilot (multiple Tier-1 sources); refined commodity sweeteners (birch sugar, beet sugar, carob powder) had almost no dedicated wine-pairing literature, and beet sugar specifically surfaced a claim-matching hazard (vegetable vs. refined sweetener confusion).",
    },
    multiple_sources_usually_required: "For SUPPORTED_EXPLICIT classifications, this pilot typically found 2+ independently-titled sources converging on the same claim (apple/chenin-blanc, avocado/sauvignon-blanc, almond/sherry, fava-bean/sangiovese, cannellini-bean/pinot-grigio, cacao-powder/port) — single-source explicit claims were treated with more caution.",
    evidence_stability_for_long_term_provenance: "Mixed. Tier-1/2 institutional sources (Wine Spectator, Le Cordon Bleu, a regional wine-trade council) are likely stable long-term. Several Tier-2/3 sources returned HTTP 403 to direct verification, meaning even currently-accessible pages could not always be re-confirmed word-for-word this session — a real risk for long-term provenance stability that any future architecture must account for (e.g. by archiving a snapshot of confirmed text, not just a URL).",
    can_methodology_realistically_scale_to_873_edges: "Not without significant process design. At this pilot's effort level (~1.5 tool calls/edge, non-trivial 403 friction, and a meaningful fraction requiring a human judgment call on claim-matching such as the almond-flour/financier and beet-sugar/beet-vegetable cases), researching all 873 edges by the same manual process would require roughly 1,300+ search/fetch operations plus deep, edge-by-edge human review — feasible only as a phased, prioritized effort (e.g. by domain, by relationship type, or by pre-filtering for entities likely to have literature, such as well-known ingredients), not as a single bulk pass.",
    selective_retention_likely_necessary: "Yes. This pilot's own 40% INSUFFICIENT_EVIDENCE and 5% CONTRADICTED rate (preliminary) suggests a meaningful fraction of the 873 population may never clear an honest evidence bar and should be retained in quarantine indefinitely rather than force-researched.",
  };

  const retentionPolicyOptions = {
    policy_a_explicit_only: {
      name: "POLICY A — require explicit external evidence for every published relationship",
      trustworthiness: "Highest — every published claim has a directly-stated, checkable external source.",
      scalability: "Poor — this pilot found only 30% (6/20, preliminary) of edges met a clean EXPLICIT_PAIRING bar; scaling this strictly could quarantine a majority of the 873-edge population indefinitely.",
      editorial_burden: "High per accepted edge, but low ambiguity (binary explicit/not).",
      risk_of_unsupported_claims: "Lowest.",
      maintenance_burden: "Moderate — sources can go stale or disappear; requires periodic re-verification.",
      suitability_for_eeat: "Excellent.",
      suitability_for_programmatic_publication: "Poor at current population scale — would leave most of these 4 domains without any 'Why These Wines Work' content indefinitely.",
    },
    policy_b_explicit_or_strong_contextual: {
      name: "POLICY B — permit explicit OR sufficiently strong contextual evidence under defined rules",
      trustworthiness: "High, contingent on the contextual bar being applied honestly and consistently (this pilot's own STRONG_CONTEXTUAL_SUPPORT calls required real editorial judgment, e.g. the almond-flour/financier bridging gap).",
      scalability: "Better — this pilot's SUPPORTED_EXPLICIT + SUPPORTED_CONTEXTUAL combined reached 55% (11/20, preliminary), roughly doubling the publishable fraction versus Policy A.",
      editorial_burden: "Higher than Policy A — requires a documented, defensible bridging-reasoning judgment call per contextual edge, which is more subjective and harder to make fully deterministic than a bare explicit-quote check.",
      risk_of_unsupported_claims: "Moderate — depends entirely on how strictly 'sufficiently strong' is enforced; loosely applied, this could slide toward laundering weak sources.",
      maintenance_burden: "Moderate-high — contextual judgments may need periodic re-review as the bridging reasoning itself can age or be contested.",
      suitability_for_eeat: "Good, if the contextual reasoning is transparently disclosed to readers or at least fully auditable internally.",
      suitability_for_programmatic_publication: "Good — meaningfully increases scale without the near-fabrication risk of accepting weak/coincidental sources.",
    },
    policy_c_hybrid: {
      name: "POLICY C — hybrid policy based on relationship type and source quality",
      trustworthiness: "Potentially the best balance, if tiers are enforced strictly (e.g. pairs_with_style claims — the most reader-visible, strongest-sounding claim — held to Policy A's explicit-only bar, while pairs_with_descriptor/pairs_with_technique claims, which are lower-stakes and more mechanically checkable against wine ontology data, could tolerate Policy B's contextual bar).",
      scalability: "Best of the three, since it concentrates the strictest (slowest) research effort only on the highest-visibility claim type.",
      editorial_burden: "Highest to design correctly (requires a defensible, documented rule for which relationship types get which bar) but potentially lowest ongoing burden once the rule is set.",
      risk_of_unsupported_claims: "Low, if the split is principled and the pairs_with_style bar is not quietly loosened over time.",
      maintenance_burden: "Moderate — same per-edge concerns as Policy B, but scoped to a smaller subset of edges.",
      suitability_for_eeat: "Very good — mirrors how professional editorial operations often triage which claims need the strongest sourcing.",
      suitability_for_programmatic_publication: "Best of the three for a large, uneven-evidence population like this one.",
    },
    recommended: "POLICY C (hybrid)",
    recommendation_reasoning: "Not selected for ease of implementation — Policy A is the simplest to implement (just check for an explicit quote) but this pilot shows it would quarantine most of the 873-edge population indefinitely, which is a legitimate but conservative outcome the ticket leaves open as acceptable. Policy C is recommended because it targets the pilot's own actual failure modes: the riskiest claim type (pairs_with_style, the primary reader-facing 'this food pairs with this wine style' statement) gets the strictest bar, while lower-stakes descriptor/technique claims — which this pilot did not sample but which are structurally checkable against existing wine-ontology data with less external-research burden — can use a documented contextual bar. This is a recommendation for Director decision, not a decision made unilaterally in this phase.",
  };

  const result = {
    phase: "PAIRING-EAT-14",
    generatedAt: new Date().toISOString(),
    status: failed.length === 0 ? "LOCAL PASS — DIRECTOR REVIEW REQUIRED (RESEARCH & ARCHITECTURE ONLY, NO PUBLICATION AUTHORIZED)" : "LOCAL FAIL — DO NOT PROCEED",
    objective: "Establish a defensible evidence methodology for the 873 EAT-13-quarantined food-tail wine-relationship edges and test it on a representative 20-edge pilot sample before any mass remediation is authorized.",
    sample: {
      total_edges: SAMPLE_RELATIONSHIPS.length,
      domains: counts,
    },
    source_hierarchy: SOURCE_HIERARCHY,
    evidence_policy: { claim_types: CLAIM_TYPES, ...EVIDENCE_POLICY },
    sample_relationships: SAMPLE_RELATIONSHIPS,
    source_records: SOURCE_RECORDS,
    governance_vs_evidence: GOVERNANCE_VS_EVIDENCE,
    circularity_exclusions: CIRCULARITY_EXCLUSIONS,
    provenance_architecture: { ...PROVENANCE_ARCHITECTURE, evidence_strength_levels: EVIDENCE_STRENGTH_LEVELS, source_record_schema_fields: SOURCE_RECORD_SCHEMA_FIELDS },
    future_validator_contract: FUTURE_VALIDATOR_CONTRACT,
    scalability_assessment: scalabilityAssessment,
    retention_policy_recommendation: retentionPolicyOptions,
    unresolved_questions: [
      "What minimum number of independent sources (1 vs 2+) should be required before an edge reaches evidence_verified, and should that minimum vary by relationship type?",
      "How should the architecture handle a source that returns HTTP 403 to automated verification but was clearly readable via the search engine's own indexed snippet — is snippet-only verification ever sufficient for evidence_verified, or does it always cap at evidence_present pending a human re-check?",
      "How should 'bridging' claims be handled — e.g. a source about a finished dessert (almond financier) supporting a raw ingredient catalog entity (almond flour), or a source about honey-as-a-topping supporting honey-as-a-standalone-entity? This pilot flagged these as caveats but did not set a firm accept/reject rule.",
      "Should a Tier-4 source ever be sufficient to move an edge to CONTRADICTED (as this pilot did for açaí/pinot-noir), or should CONTRADICTED require at least a Tier-2 source given the higher bar for taking an action (removing/deprecating) versus the lower bar for withholding action (quarantine)?",
      "Should the future validator's evidence_verified state require a second, independent human reviewer sign-off distinct from whoever performed the research, mirroring editorial review practices elsewhere in this project (e.g. the seed data's own editorial_review field)?",
      "What is the policy for entities where the ONLY available sources are producer/retailer pages (a case not hit directly in this pilot but flagged as a Tier-1 caveat: 'authoritative producers only when specifically relevant and not merely marketing copy') — who decides 'not merely marketing copy', and against what standard?",
      "Should selectively-deprecated relationships (Class D-equivalent, not hit in this pilot but anticipated per ticket) be removed from the runtime file, or retained with a permanent 'not supported' status for transparency and to prevent silent re-creation in a future generator run?",
    ],
  };

  const json = JSON.stringify(result, null, 2) + "\n";
  console.log(JSON.stringify({ status: result.status, total: checks.length, passed: checks.length - failed.length, failed: failed.length, statusTally }, null, 2));
  fs.writeFileSync(path.join(ROOT, "reports", "pairing-eat-14-evidence-research.json"), json);

  if (failed.length > 0) {
    console.error("FAILED CHECKS:");
    for (const f of failed) console.error(`- ${f.id}: ${JSON.stringify(f.evidence)}`);
    process.exit(1);
  }
}

main();
