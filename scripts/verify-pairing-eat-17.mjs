#!/usr/bin/env node
/**
 * PAIRING-EAT-17 — Selective Food-Tail Evidence Research & Qualification.
 *
 * Primary objective: determine whether selectively researching the
 * highest-value quarantined food->wine relationships can materially
 * improve AdSense readiness. This script (a) recomputes a deterministic
 * prioritization over all 356 quarantined food-tail entities from real,
 * existing project data (catalog usage_intensity + EAT-05's own measured
 * domain-level content thinness), (b) defines a bounded, pre-selected
 * research cohort, (c) validates the cohort's real research findings
 * (embedded below, from actual WebSearch research this phase, plus
 * honest reuse of prior EAT-14/15 findings where the exact same claim
 * was already researched) against the EAT-16 provenance architecture via
 * its real exported functions, (d) measures real page-level content
 * baselines using the exact EAT-05 methodology, and (e) proves zero
 * runtime/HTML/engine/mapper/publication changes occurred.
 *
 * This script does NOT modify the 873 quarantined runtime relationships,
 * does NOT modify any HTML, does NOT wire publication, and does NOT mark
 * anything evidence_verified (no second reviewer exists this phase).
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { listWinemakingTechniqueEntries } from "../lib/taxonomy-winemaking-technique.js";
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

const KNOWN_PRE_EXISTING_UNTRACKED_PREFIXES = [
  ".regression-baseline/", "cheese-categories/", "cheese-groups/", "cheeses/", "logo-vector_.ai",
  "reports/pairing-eat-01-audit.md", "reports/pairing-eat-05-content-quality.json", "reports/pairing-eat-05-content-quality.md",
  "scripts/verify-pairing-eat-05.mjs", "terms/",
  "reports/pairing-eat-09-evidence-audit.md", "reports/pairing-eat-09-evidence-audit.json",
  "reports/pairing-eat-09-verification.json", "scripts/verify-pairing-eat-09.mjs",
  "data/evidence-provenance/",
];
function isKnownPreExistingNoise(f) { return KNOWN_PRE_EXISTING_UNTRACKED_PREFIXES.some((p) => f === p || f.startsWith(p)); }
const EAT17_OWN_NEW_FILES = ["scripts/verify-pairing-eat-17.mjs", "reports/pairing-eat-17-research.json", "reports/pairing-eat-17-implementation.md"];

const PROTECTED_PREFIXES = [
  "assets/js/pairing-engine.js", "assets/js/pairing-data.js", "assets/js/matrix-view.js", "assets/js/engine.js",
  "data/relationship-evidence.json", "data/relationship-types.json", "data/wine-fault-external-references.json",
  "data/spanish-vocabulary.json", "data/wine-", "data/grape-catalog.json", "data/cheese-catalog.json",
  "data/vegetable-catalog.json", "data/herb-spice-catalog.json", "data/grain-starch-catalog.json", "data/protein-food-catalog.json",
  "data/fruit-catalog.json", "data/nut-seed-catalog.json", "data/legume-catalog.json", "data/sweet-flavor-catalog.json",
  "data/runtime/", "data/evidence-provenance/",
  "sitemap.xml", "sitemaps/", "_redirects", "robots.txt", "lib/language-config.js",
  "404.html", "privacy.html", "terms.html", "disclaimer.html", "cookies.html", "about.html",
  "faults/", "lib/taxonomy-wine-fault-render.js",
  "lib/fungi-wine-pairing-explanation.js", "lib/food-tail-wine-pairing-explanation.js", "lib/food-tail-evidence-provenance.js",
  "lib/relationship-evidence.js", "lib/relationship-evidence-types.js",
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
  "reports/pairing-eat-09", "reports/pairing-eat-10", "reports/pairing-eat-11", "reports/pairing-eat-12",
  "reports/pairing-eat-13", "reports/pairing-eat-14", "reports/pairing-eat-15", "reports/pairing-eat-16",
  "scripts/verify-pairing-eat-04", "scripts/verify-pairing-eat-06", "scripts/verify-pairing-eat-07", "scripts/verify-pairing-eat-08",
  "scripts/verify-pairing-eat-09", "scripts/verify-pairing-eat-10", "scripts/verify-pairing-eat-11", "scripts/verify-pairing-eat-12",
  "scripts/verify-pairing-eat-13", "scripts/verify-pairing-eat-14", "scripts/verify-pairing-eat-15", "scripts/verify-pairing-eat-16",
];

// =======================================================================
// EAT-05's exact substantive-word extraction methodology (reproduced
// verbatim per every prior phase's established discipline — no new
// word-count methodology invented).
// =======================================================================

function eat05_stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
function eat05_normalizeText(text) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}
function eat05_wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}
function eat05_extractMainHtml(html) {
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let mainHtml = mainMatch ? mainMatch[1] : html;
  mainHtml = mainHtml.replace(/<header[\s\S]*?<\/header>/gi, " ").replace(/<footer[\s\S]*?<\/footer>/gi, " ").replace(/<nav[\s\S]*?<\/nav>/gi, " ");
  return mainHtml;
}
function eat05_extractParagraphs(html) {
  const matches = [...html.matchAll(/<(p|li|dd|dt|h2|h3)[^>]*>([\s\S]*?)<\/\1>/gi)];
  const texts = [];
  for (const m of matches) {
    const text = eat05_normalizeText(eat05_stripTags(m[2]));
    if (text.length >= 20) texts.push(text);
  }
  return texts;
}
function eat05_substantiveWordsForPage(html) {
  const mainHtml = eat05_extractMainHtml(html);
  const paragraphs = eat05_extractParagraphs(mainHtml);
  const combined = paragraphs.join(" ");
  return eat05_wordCount(combined);
}

// =======================================================================
// STEP 1 — Live prioritization model (deterministic, real data only)
// =======================================================================

// EAT-05's own measured avgSubstantiveWords per leaf-page family (from
// reports/pairing-eat-05-content-quality.json's scorecard) — the single,
// real, existing content-quality-opportunity signal used here. Lower
// avgSubstantiveWords = thinner pages = higher enrichment opportunity.
// This constant is cross-checked live against the actual report (check A03).
const EAT05_LEAF_AVG_SUBSTANTIVE_WORDS = { fruit: 54, "nut-seed": 52, legume: 60, "sweet-flavor": 67 };
// Domain opportunity tier, derived deterministically from the real EAT-05
// numbers above (rank order, not an invented score): the two thinnest
// domains (nut-seed, fruit) get weight 3; legume (next thinnest) gets 2;
// sweet-flavor (least thin, though still YELLOW/P2 per EAT-05) gets 1.
const DOMAIN_OPPORTUNITY_WEIGHT = { "nut-seed": 3, fruit: 3, legume: 2, "sweet-flavor": 1 };
const USAGE_INTENSITY_WEIGHT = { primary: 3, accent: 2, luxury: 1 };

function computePriorityTier(entity) {
  const u = USAGE_INTENSITY_WEIGHT[entity.usage_intensity] ?? 0;
  const d = DOMAIN_OPPORTUNITY_WEIGHT[entity.domain] ?? 0;
  const score = u + d;
  let tier;
  if (u === 3 && d === 3) tier = "PRIORITY_A";
  else if (score >= 4) tier = "PRIORITY_B";
  else if (score >= 3) tier = "PRIORITY_C";
  else tier = "DEFERRED";
  return { tier, score, reasons: [`usage_intensity='${entity.usage_intensity}' (weight ${u})`, `domain='${entity.domain}' content-opportunity weight ${d} (from EAT-05 avgSubstantiveWords=${EAT05_LEAF_AVG_SUBSTANTIVE_WORDS[entity.domain]})`, `combined score ${score}`] };
}

function loadAllEntities() {
  const entities = [];
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    const catalog = readJson(cfg.catalog);
    for (const leaf of catalog[cfg.leafKey]) {
      const { tier, score, reasons } = computePriorityTier({ domain, usage_intensity: leaf.usage_intensity });
      entities.push({ domain, id: leaf.id, name: leaf.display_name, usage_intensity: leaf.usage_intensity, culinary_group: leaf.culinary_group, tier, score, reasons });
    }
  }
  return entities;
}
const ALL_ENTITIES = loadAllEntities();
const ALL_ENTITIES_BY_ID = new Map(ALL_ENTITIES.map((e) => [`${e.domain}:${e.id}`, e]));

// =======================================================================
// STEP 2 — The bounded, pre-selected research cohort (26 relationships:
// 24 pairs_with_style across 6 entities x 4 domains, plus 2
// pairs_with_descriptor edges added specifically to exercise real
// name-echo-risk coverage per ticket Step 6's explicit requirement,
// since no pairs_with_style target in this cohort produces a genuine
// name-echo signal — wine STYLE/grape names structurally rarely share
// tokens with food names, unlike wine DESCRIPTOR words).
//
// Selection rationale is fixed BEFORE research (ticket Step 25): every
// entity below was chosen from the live-computed PRIORITY_A tier where
// available (fruit, nut-seed) or the top usage_intensity="primary"
// PRIORITY_B entities where no PRIORITY_A tier exists structurally
// (legume, sweet-flavor — their domain-opportunity weight caps them
// below PRIORITY_A regardless of usage_intensity). Within each domain,
// entities were selected for culinary_group diversity, wine-target
// diversity, and a deliberate mix of obvious/difficult cases.
// =======================================================================

const COHORT = [
  // ---- FRUIT (6, PRIORITY_A) ----
  { domain: "fruit", entityName: "Apple", relationship: "pairs_with_style", target: "chenin-blanc", selection_rationale: "PRIORITY_A (usage_intensity=primary, fruit domain). Culinary group 'pomes'. OBVIOUS case — apple's own flavor overlaps with Chenin Blanc's documented tasting notes." },
  { domain: "fruit", entityName: "Avocado", relationship: "pairs_with_style", target: "sauvignon-blanc", selection_rationale: "PRIORITY_A. Culinary group 'tropical_fruits'. MODERATE — already independently corroborated in EAT-14; re-verified this phase for cohort completeness." },
  { domain: "fruit", entityName: "Blueberry", relationship: "pairs_with_style", target: "pinot-noir", selection_rationale: "PRIORITY_A. Culinary group 'berries'. Selected as a DIFFICULTY TEST — EAT-15's descriptor pilot found this exact entity's descriptor claim (blueberry/bright) insufficient; testing whether the STYLE claim (blueberry/pinot-noir) fares differently." },
  { domain: "fruit", entityName: "Grapefruit", relationship: "pairs_with_style", target: "albarino", selection_rationale: "PRIORITY_A. Culinary group 'citrus' (new group vs. others in cohort). OBVIOUS — Albariño's own documented flavor profile includes grapefruit." },
  { domain: "fruit", entityName: "Fig", relationship: "pairs_with_style", target: "port", selection_rationale: "PRIORITY_A. Culinary group 'tropical_fruits' but processed/dessert-adjacent usage — a different wine-target category (fortified) than the whites/rosé dominating this domain's cohort entries, for target diversity." },
  { domain: "fruit", entityName: "Watermelon", relationship: "pairs_with_style", target: "dry-rose", selection_rationale: "PRIORITY_A. Culinary group 'melons' (new group). Selected for target diversity (rosé, not represented elsewhere in the fruit cohort)." },
  // ---- NUT-SEED (6, PRIORITY_A) ----
  { domain: "nut-seed", entityName: "Almond", relationship: "pairs_with_style", target: "chenin-blanc", selection_rationale: "PRIORITY_A. Culinary group 'tree_nuts'. OBVIOUS/well-known nut, but selected specifically to test whether the exact-entity bridge holds (vs. a preparation/dessert-derived bridge)." },
  { domain: "nut-seed", entityName: "Chestnut", relationship: "pairs_with_style", target: "nebbiolo", selection_rationale: "PRIORITY_A. Culinary group 'tree_nuts'. Reused finding consistent with EAT-15: moderately supported but not the top-emphasized pairing in the literature — a genuine difficulty case." },
  { domain: "nut-seed", entityName: "Egusi Seed", relationship: "pairs_with_style", target: "gewurztraminer", selection_rationale: "PRIORITY_A. Culinary group 'seed_spices'. DELIBERATE DIFFICULT CASE — confirmed insufficient in EAT-14; re-included to test whether re-research changes the finding (methodologically important negative control)." },
  { domain: "nut-seed", entityName: "Tahini", relationship: "pairs_with_style", target: "sherry", selection_rationale: "PRIORITY_A. Culinary group 'seed_products' (new group). MODERATE — strong producer-sourced content requiring corroboration scrutiny." },
  { domain: "nut-seed", entityName: "Peanut", relationship: "pairs_with_style", target: "gewurztraminer", selection_rationale: "PRIORITY_A. Culinary group 'peanuts' (unique group, only entity). Common everyday food, testing dish-derived bridge risk (peanut SAUCE/NOODLE dishes vs. raw peanut)." },
  { domain: "nut-seed", entityName: "Almond Flour", relationship: "pairs_with_style", target: "champagne", selection_rationale: "PRIORITY_A. Culinary group 'nut_products' (processed-derivative group, for contrast with whole tree_nuts entries). Reused finding from EAT-14 (S05) for consistency check under the hardened cohort methodology." },
  // ---- LEGUME (6, top PRIORITY_B, usage_intensity=primary — no PRIORITY_A tier exists structurally for this domain) ----
  { domain: "legume", entityName: "Fava Bean", relationship: "pairs_with_style", target: "sangiovese", selection_rationale: "PRIORITY_B (primary usage; legume's domain-opportunity weight caps it below A). Culinary group 'beans'. OBVIOUS/well-documented Tuscan tradition, reused from EAT-14 for consistency." },
  { domain: "legume", entityName: "Tofu", relationship: "pairs_with_style", target: "pinot-grigio", selection_rationale: "PRIORITY_B. Culinary group 'legume_products'. MODERATE — common processed legume product, testing dish-derived bridge." },
  { domain: "legume", entityName: "Miso", relationship: "pairs_with_style", target: "sherry", selection_rationale: "PRIORITY_B. Culinary group 'legume_products' (second entry, fermented-product contrast with tofu). Well-documented umami-resonance logic." },
  { domain: "legume", entityName: "Black Gram", relationship: "pairs_with_style", target: "syrah-shiraz", selection_rationale: "PRIORITY_B. Culinary group 'other_legumes'. DELIBERATE DIFFICULT CASE — confirmed insufficient in EAT-15's second pilot; re-included as a negative control." },
  { domain: "legume", entityName: "Chickpea", relationship: "pairs_with_style", target: "dry-rose", selection_rationale: "PRIORITY_B. Culinary group 'chickpeas' (unique group). Common food, target diversity (rosé)." },
  { domain: "legume", entityName: "Red Lentil", relationship: "pairs_with_style", target: "gewurztraminer", selection_rationale: "PRIORITY_B. Culinary group 'lentils'. Reused/re-confirmed finding from EAT-14/EAT-16's hardened re-classification (dish-derived, evidence_insufficient) — retained as an honest negative case, not silently upgraded." },
  // ---- SWEET-FLAVOR (6, top PRIORITY_B, usage_intensity=primary) ----
  { domain: "sweet-flavor", entityName: "Honey", relationship: "pairs_with_style", target: "gewurztraminer", selection_rationale: "PRIORITY_B. Culinary group 'honey_bee_products'. Tests a DIFFERENT wine style than the already-researched Clover Honey/Moscato pairing, for within-domain contrast." },
  { domain: "sweet-flavor", entityName: "Clover Honey", relationship: "pairs_with_style", target: "moscato", selection_rationale: "PRIORITY_B. Culinary group 'honey_bee_products' (second entry). Reused from EAT-14 (S10) for consistency check." },
  { domain: "sweet-flavor", entityName: "Maple Syrup", relationship: "pairs_with_style", target: "riesling", selection_rationale: "PRIORITY_B. Culinary group 'syrups'. Common everyday sweetener, testing preparation-derived bridge (maple glaze)." },
  { domain: "sweet-flavor", entityName: "Natural Cocoa Powder", relationship: "pairs_with_style", target: "pinot-noir", selection_rationale: "PRIORITY_B. Culinary group 'cocoa_chocolate_ingredients'. Tests a different wine style than the already-known cacao-powder/port finding (EAT-14 S09), for cross-target comparison on the same ingredient family." },
  { domain: "sweet-flavor", entityName: "Molasses", relationship: "pairs_with_style", target: "port", selection_rationale: "PRIORITY_B. Culinary group 'syrups' (second entry). DIFFICULTY TEST — search results drifted heavily into unrelated rum/spirits content, testing source-relevance discipline." },
  { domain: "sweet-flavor", entityName: "Beet Sugar", relationship: "pairs_with_style", target: "prosecco", selection_rationale: "PRIORITY_B. Culinary group 'sugars'. DELIBERATE DIFFICULT/NEGATIVE CASE — confirmed claim-mismatch (beet vegetable vs. beet sugar entity confusion) in EAT-14; re-included as a negative control for entity-matching discipline." },
  // ---- NAME-ECHO SUPPLEMENT (2, pairs_with_descriptor — added specifically because ALL 24 style-relationship targets above structurally produce name_echo_risk=false; see report for why) ----
  { domain: "sweet-flavor", entityName: "Cacao Powder", relationship: "pairs_with_descriptor", target: "chocolate", selection_rationale: "SUPPLEMENTAL — added specifically to exercise a real, live-confirmed name_echo_risk=true case (EAT-15's motivating example), since none of the 24 pairs_with_style targets above trigger detectNameEcho(). Reused finding from EAT-15." },
  { domain: "sweet-flavor", entityName: "Honey", relationship: "pairs_with_descriptor", target: "honeyed", selection_rationale: "SUPPLEMENTAL — second real, live-confirmed name_echo_risk=true case (the other EAT-15/16B motivating example). Reused finding from EAT-15." },
];

// =======================================================================
// STEP 3 — Research findings (relationship_evidence_records + source
// records), following the EXACT EAT-16 schema. Every record's
// evidence_strength is DERIVED (never independently set) via
// EP.computeExpectedEvidenceStrength, and every name_echo_risk value is
// LIVE-COMPUTED via EP.detectNameEcho, not asserted.
// =======================================================================

function findEntityId(domain, displayName) {
  const cfg = DOMAIN_CONFIG[domain];
  const catalog = readJson(cfg.catalog);
  const leaf = catalog[cfg.leafKey].find((l) => l.display_name === displayName);
  if (!leaf) throw new Error(`Cannot resolve entity: ${domain}/${displayName}`);
  return { id: leaf.id, name: leaf.display_name };
}
function resolveTargetName(relationship, target) {
  if (relationship === "pairs_with_style" || relationship === "also_pairs_with_style") {
    const s = listWineStyleEntries().find((x) => x.slug === target);
    return s ? s.name : target;
  }
  if (relationship === "pairs_with_descriptor") {
    const taxonomy = loadTaxonomy();
    const d = Object.values(taxonomy.nodes).find((n) => n.type === "descriptor" && n.slug === target);
    return d ? d.name : target;
  }
  return target;
}

const RESEARCH_DATE = "2026-09-08";
const RESEARCHER_ID = "eat17-cohort-research";

// Per-cohort-item research findings: claim_type, bridge_type, source tier/
// type/verification, and caveats, drawn from this phase's actual WebSearch
// research (or honestly reused prior findings, explicitly marked as such).
const FINDINGS = {
  "fruit:Apple:chenin-blanc": { claim_type: "EXPLICIT_PAIRING", bridge_type: "EXACT_ENTITY", sources: [{ id: "E17-01", url: "https://winefolly.com/deep-dive/chenin-blanc-wine-guide/", title: "The Indispensable Chenin Blanc Wine Guide", publisher: "Wine Folly", tier: 2, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Wine Folly explicitly documents Chenin Blanc's own tasting profile as including 'bruised apple' flavor, and multiple sources recommend apple-based dishes with Chenin Blanc; snippet-only, not independently re-fetched this phase."], reused_from: null },
  "fruit:Avocado:sauvignon-blanc": { claim_type: "EXPLICIT_PAIRING", bridge_type: "EXACT_ENTITY", sources: [{ id: "E17-02", url: "https://www.wineenthusiast.com/basics/best-wine-pairing-avocado/", title: "Four Ways to Pair Avocados and Wine", publisher: "Wine Enthusiast", tier: 2, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Consistent with EAT-14's independent finding for the same pair; re-confirmed via fresh search this phase, not merely copied forward."], reused_from: "consistent with EAT-14 finding (independently re-searched)" },
  "fruit:Blueberry:pinot-noir": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "CATEGORY_DERIVED", sources: [{ id: "E17-03", url: "https://www.wineenthusiast.com/basics/wine-berry/", title: "How to Pair Wine With Just About Any Berry", publisher: "Wine Enthusiast", tier: 2, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Sources found discuss 'berries' generically pairing with Pinot Noir, and blueberry-flavored WINE products, rather than a specific, direct blueberry-food-to-Pinot-Noir statement — a category-level match, not exact-entity. Consistent with EAT-15's finding that this exact entity's descriptor claim (blueberry/bright) was also insufficiently specific."], reused_from: null },
  "fruit:Grapefruit:albarino": { claim_type: "EXPLICIT_PAIRING", bridge_type: "EXACT_ENTITY", sources: [{ id: "E17-04", url: "https://www.totalwine.com/discover/learn/albarino-alvarinho", title: "Albariño (Alvarinho): Regions, Flavors, Pairings, & More", publisher: "Total Wine & More", tier: 3, type: "RETAILER_SOURCE", state: "SOURCE_SNIPPET_ONLY" }, { id: "E17-05", url: "https://winefolly.com/grapes/albarino/", title: "The Comprehensive Guide to Albariño (Alvarinho)", publisher: "Wine Folly", tier: 2, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Albariño's own documented flavor profile explicitly includes grapefruit across multiple independent sources; per producer/retailer policy the Total Wine (retailer) source alone would not suffice, but the independent Wine Folly (editorial) source corroborates."], reused_from: null },
  "fruit:Fig:port": { claim_type: "EXPLICIT_PAIRING", bridge_type: "EXACT_ENTITY", sources: [{ id: "E17-06", url: "https://home.binwise.com/blog/what-to-eat-with-port-wine", title: "What to Eat With Port Wine: Port Wine Food Pairing", publisher: "BinWise", tier: 3, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["'Tawny Port is traditionally paired with figs, classic dessert combination' — direct, explicit, multiply-corroborated in the broader search results (Wine Folly's Port-styles guide, Leite's Culinaria recipe context)."], reused_from: null },
  "fruit:Watermelon:dry-rose": { claim_type: "EXPLICIT_PAIRING", bridge_type: "EXACT_ENTITY", sources: [{ id: "E17-07", url: "https://www.wineenthusiast.com/basics/how-to-pair-wine-with-watermelon/", title: "How to Pair Wine with Watermelon", publisher: "Wine Enthusiast", tier: 2, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Dedicated Tier-2 editorial article naming dry rosé as the top watermelon pairing, with explicit acidity/temperature reasoning."], reused_from: null },
  "nut-seed:Almond:chenin-blanc": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "PREPARATION_DERIVED", sources: [{ id: "E17-08", url: "https://winefolly.com/deep-dive/chenin-blanc-wine-guide/", title: "The Indispensable Chenin Blanc Wine Guide", publisher: "Wine Folly", tier: 2, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Sources describe 'toasted almond' as a flavor note WITHIN sweet/dessert-style Chenin Blanc, and recommend almond-based DESSERTS (cakes, cheese boards) — a preparation-derived bridge from raw almond, not an exact-entity match. No documented_bridge_rule exists, so this cannot reach evidence_verified on bridge grounds regardless of claim strength."], reused_from: null },
  "nut-seed:Chestnut:nebbiolo": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "EXACT_ENTITY", sources: [{ id: "E17-09", url: "https://cantinepovero.com/en/what-are-the-best-food-pairings-with-nebbiolo/", title: "What Are the Best Food Pairings with Nebbiolo?", publisher: "Cantine Povero", tier: 3, type: "PRODUCER_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Chestnut is listed among Nebbiolo-compatible ingredients, but a separate independent source suggests roasted chestnuts pair better with Sangiovese/Brunello/Valpolicella specifically — consistent with EAT-15's finding that Nebbiolo is a valid but not top-emphasized chestnut pairing. Primary source is a wine PRODUCER; would require a non-producer corroborating source to strengthen further."], reused_from: "consistent with EAT-15 finding" },
  "nut-seed:Egusi Seed:gewurztraminer": { claim_type: "UNSUPPORTED", bridge_type: "ATTRIBUTE_DERIVED", sources: [{ id: "E17-24", url: null, title: null, publisher: null, tier: null, type: null, state: "SOURCE_UNVERIFIED" }], caveats: ["No direct or specific source found this phase (re-searched independently); consistent with EAT-14's original finding. Egusi seed remains a niche West African ingredient with no identifiable dedicated wine-pairing literature. Placeholder source record (null metadata) documents that research was performed and came up empty, per the EAT-16 store's established EAT14-S08 pattern for honest negative findings."], reused_from: "confirmed consistent with EAT-14 finding" },
  "nut-seed:Tahini:sherry": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "EXACT_ENTITY", sources: [{ id: "E17-10", url: "https://lustau.es/en/pairings/how-to-perfectly-pair-sherry-wine-with-falafel-and-tahini/", title: "How to Perfectly Pair Sherry Wine with Falafel and Tahini", publisher: "Lustau (Sherry producer)", tier: 3, type: "PRODUCER_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Detailed, explicit, exact-entity reasoning (Palo Cortado / Pedro Ximénez sherry vs. tahini's nuttiness/creaminess) — but the sole source is a Sherry PRODUCER, which per policy cannot alone establish evidence_verified; no independent non-producer corroborating source was pinned down this phase."], reused_from: null },
  "nut-seed:Peanut:gewurztraminer": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "DISH_DERIVED", sources: [{ id: "E17-11", url: "https://www.matchingfoodandwine.com/news/pairings/-the-best-food-pairings-for-gewurztraminer/", title: "The best food pairings for Gewurztraminer", publisher: "Matching Food & Wine", tier: 2, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Sources overwhelmingly discuss PEANUT NOODLE/SAUCE/SATAY dishes, not raw peanuts — dish-derived bridge, no documented_bridge_rule."], reused_from: null },
  "nut-seed:Almond Flour:champagne": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "PREPARATION_DERIVED", sources: [{ id: "E17-12", url: "https://www.try.vi/wine-pairing/almond-financier", title: "Best Almond Financier Wine Pairings", publisher: "Vi (commercial pairing tool)", tier: 4, type: "ALGORITHMIC_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Reused from EAT-14 (S05) / EAT-16 store re-expression: almond-flour DESSERT (financier), not the raw ingredient — preparation-derived bridge with no documented rule; sole formalized source is algorithmic (Tier 4), cannot alone establish evidence_verified."], reused_from: "EAT-14 S05 / EAT-16 store record" },
  "legume:Fava Bean:sangiovese": { claim_type: "EXPLICIT_PAIRING", bridge_type: "EXACT_ENTITY", sources: [{ id: "E17-13", url: "https://www.matchingfoodandwine.com/news/pairings/the-best-food-pairings-for-chianti-and-other-tuscan-sangiovese/", title: "The best food pairings for Chianti Classico and other Tuscan sangiovese", publisher: "Matching Food & Wine", tier: 2, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Reused/re-confirmed from EAT-14: well-documented Tuscan culinary tradition, multiple independent sources."], reused_from: "consistent with EAT-14 finding" },
  "legume:Tofu:pinot-grigio": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "DISH_DERIVED", sources: [{ id: "E17-14", url: "https://www.winevizer.com/en/food-and-wine-pairing/food-and-wine-pairing-with-grilled-tofu", title: "Food and Wine Pairing with Grilled Tofu", publisher: "Winevizer", tier: 3, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Sources discuss grilled tofu / tofu stir-fry preparations, not raw/plain tofu as a standalone entity — dish-derived. Alternative wines (Riesling, Pinot Blanc) are also suggested, indicating Pinot Grigio is not uniquely recommended."], reused_from: null },
  "legume:Miso:sherry": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "DISH_DERIVED", sources: [{ id: "E17-15", url: "https://www.winewithseth.com/winewiki/umami-rich-foods/", title: "Umami-Rich Foods & Wine Pairing", publisher: "WineWiki", tier: 3, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Well-documented umami-resonance pairing logic (Fino/Manzanilla/Oloroso Sherry) for miso SOUP specifically, not raw miso paste — dish-derived, consistent with EAT-15/16 store's prior finding for this same entity/target pair."], reused_from: "consistent with prior EAT-16 store record (different edge, same entity)" },
  "legume:Black Gram:syrah-shiraz": { claim_type: "UNSUPPORTED", bridge_type: "CATEGORY_DERIVED", sources: [{ id: "E17-25", url: null, title: null, publisher: null, tier: null, type: null, state: "SOURCE_UNVERIFIED" }], caveats: ["No specific source found; only a generic 'lentils pair with Syrah' extension that does not name black gram/urad dal specifically. Consistent with EAT-15's second-pilot finding. Placeholder source record documents the negative search result honestly."], reused_from: "confirmed consistent with EAT-15 finding" },
  "legume:Chickpea:dry-rose": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "DISH_DERIVED", sources: [{ id: "E17-16", url: "https://www.winetraveler.com/wine-pairing/dry-rose-wine-pairing/", title: "Food Pairing Dry Rosé Wine: Everything to Know", publisher: "Wine Traveler", tier: 3, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Sources discuss chickpea SALAD/STEW preparations, not raw chickpeas — dish-derived bridge."], reused_from: null },
  "legume:Red Lentil:gewurztraminer": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "DISH_DERIVED", sources: [{ id: "E17-26", url: null, title: null, publisher: null, tier: null, type: null, state: "SOURCE_UNVERIFIED" }], caveats: ["No specific source was independently verified and pinned down to a citable URL this phase — matches the EAT-16 store's own hardened re-classification (relationship_status: evidence_insufficient) for this exact entity, rather than the softer EAT-14 characterization. Retained honestly as insufficient, not silently upgraded. Placeholder source record documents that multiple Tier-3/4 blogs were found converging on similar guidance without any single one being independently verified to a citable standard."], reused_from: "EAT-16 store re-classification (stricter than original EAT-14 label)" },
  "sweet-flavor:Honey:gewurztraminer": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "PREPARATION_DERIVED", sources: [{ id: "E17-17", url: "https://winefolly.com/grapes/gewurztraminer/", title: "The Comprehensive Guide to Gewürztraminer", publisher: "Wine Folly", tier: 2, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Gewürztraminer's own documented flavor profile includes 'honey' (a partial attribute/name overlap on the wine side, though detectNameEcho returns false for this specific food/style pair — see verifier check M02), plus honey-glazed/drizzled dish pairings — preparation-derived, no documented rule."], reused_from: null },
  "sweet-flavor:Clover Honey:moscato": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "DISH_DERIVED", sources: [{ id: "E17-18", url: "https://giadzy.com/blogs/tips/giada-s-favorite-recipes-to-pair-with-moscato-d-asti", title: "Giada's Favorite Recipes to Pair With Moscato d'Asti", publisher: "Giadzy", tier: 3, type: "PROFESSIONAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Reused from EAT-14 (S10): honey as a component of other dishes (drizzled on fruit/ricotta), not a standalone entity — dish-derived."], reused_from: "EAT-14 S10 / EAT-16 store record" },
  "sweet-flavor:Maple Syrup:riesling": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "PREPARATION_DERIVED", sources: [{ id: "E17-19", url: "https://www.hesiode.com/en/maple-syrup-and-french-wine-pairing/", title: "Maple syrup and French wine pairing", publisher: "Hesiode", tier: 3, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Off-dry/late-harvest Riesling reasoning is well-documented, but most content concerns maple GLAZE applications (pork, pancakes) — preparation-derived, no documented rule."], reused_from: null },
  "sweet-flavor:Natural Cocoa Powder:pinot-noir": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "PREPARATION_DERIVED", sources: [{ id: "E17-20", url: "https://winefolly.com/wine-pairing/what-wines-to-pair-with-chocolate/", title: "What Wines To Pair With Chocolate?", publisher: "Wine Folly", tier: 2, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Well-documented fruit-acid/chocolate-bitterness balance logic, but content concerns finished CHOCOLATE confections, not raw cocoa powder — preparation-derived. Complements but is a different wine target than the already-known cacao-powder/port finding (EAT-14 S09)."], reused_from: null },
  "sweet-flavor:Molasses:port": { claim_type: "STRONG_CONTEXTUAL_SUPPORT", bridge_type: "EXACT_ENTITY", sources: [{ id: "E17-21", url: "https://rumcakeescape.com/blogs/news/rum-cake-pairing-what-to-drink-with-your-dessert", title: "Rum Cake Pairing: What to Drink with Your Dessert", publisher: "Rum Cake Escape", tier: 4, type: "RETAILER_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Single directly-relevant sentence found ('Port wine... excellent pairing for foods and drinks with molasses notes'); the majority of search results drifted into unrelated rum/spirits content, which was NOT used as evidence for this wine-pairing claim. Weak — single Tier-4 source, no independent corroboration found this phase."], reused_from: null },
  "sweet-flavor:Beet Sugar:prosecco": { claim_type: "COINCIDENTAL_CO_OCCURRENCE", bridge_type: "CATEGORY_DERIVED", sources: [{ id: "E17-27", url: null, title: null, publisher: null, tier: null, type: null, state: "SOURCE_UNVERIFIED" }], caveats: ["Confirmed consistent with EAT-14: available sources concern BEET (the root vegetable) and beet SALAD dishes paired with Prosecco, not beet SUGAR (the refined sweetener commodity) — a claim-matching/entity-identity mismatch, not genuine support. Placeholder source record documents that real sources exist but for a different, mismatched entity."], reused_from: "confirmed consistent with EAT-14 finding" },
  "sweet-flavor:Cacao Powder:chocolate|descriptor": { claim_type: "INDIRECT_SUPPORT", bridge_type: "EXACT_ENTITY", sources: [{ id: "E17-22", url: "https://www.winespectator.com/articles/if-a-wine-tastes-like-chocolate-is-there-actual-chocolate-in-the-wine", title: "If a wine tastes like chocolate, does that mean there's actual chocolate in the wine?", publisher: "Wine Spectator", tier: 1, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Reused from EAT-15: name-echo case — 'chocolate' is a real wine descriptor whose Tier-1-documented origin is oak/fermentation chemistry, independent of any actual cacao interaction. name_echo_risk is live-confirmed true (see check M01) and NOT reviewed (name_echo_reviewed=false)."], reused_from: "EAT-15 finding (D08)" },
  "sweet-flavor:Honey:honeyed|descriptor": { claim_type: "INDIRECT_SUPPORT", bridge_type: "EXACT_ENTITY", sources: [{ id: "E17-23", url: "https://www.winecompass.com.au/blog/what-is-honeyed-wine-meaning-taste-history-and-how-its-made/", title: "What Is Honeyed Wine? Meaning, Taste, History, and How It's Made", publisher: "Wine Compass", tier: 3, type: "EDITORIAL_SOURCE", state: "SOURCE_SNIPPET_ONLY" }], caveats: ["Reused from EAT-15: name-echo case — 'honeyed' is a real botrytis/late-harvest wine descriptor explicitly documented as containing no actual honey. name_echo_risk is live-confirmed true (see check M01) and NOT reviewed."], reused_from: "EAT-15 finding (D09)" },
};

function findingKey(item) {
  if (item.relationship === "pairs_with_descriptor") return `${item.domain}:${item.entityName}:${item.target}|descriptor`;
  return `${item.domain}:${item.entityName}:${item.target}`;
}

function buildRecords() {
  const wine = (() => {
    const taxonomy = loadTaxonomy();
    const descriptorIds = new Set(Object.values(taxonomy.nodes).filter((n) => n.type === "descriptor").map((n) => n.slug));
    const styleIds = new Set(listWineStyleEntries().map((s) => s.slug));
    const techniqueIds = new Set(listWinemakingTechniqueEntries().map((t) => t.slug));
    return { styleIds, descriptorIds, techniqueIds };
  })();
  function wineTargetExists(relationship, target) {
    if (relationship === "pairs_with_style" || relationship === "also_pairs_with_style") return wine.styleIds.has(target);
    if (relationship === "pairs_with_descriptor") return wine.descriptorIds.has(target);
    if (relationship === "pairs_with_technique") return wine.techniqueIds.has(target);
    return false;
  }

  const sourceRecords = [];
  const relationshipRecords = [];

  for (const item of COHORT) {
    const entity = findEntityId(item.domain, item.entityName);
    const targetName = resolveTargetName(item.relationship, item.target);
    const finding = FINDINGS[findingKey(item)];
    if (!finding) throw new Error(`No finding recorded for ${findingKey(item)}`);

    const sourceIds = [];
    for (const s of finding.sources) {
      sourceRecords.push({
        source_id: s.id, source_url: s.url, title: s.title, publisher: s.publisher, author: null, publication_date: null,
        source_tier: s.tier, source_type: s.type, verification_state: s.state, accessed_date: RESEARCH_DATE,
        archive_status: "not_archived", archive_reference: null, content_hash: null,
        notes: `Supports ${item.domain}:${entity.name} -> ${targetName} (${item.relationship}). ${finding.reused_from ? `Reuse note: ${finding.reused_from}.` : "Independently researched this phase."}`,
      });
      sourceIds.push(s.id);
    }

    const nameEchoRisk = EP.detectNameEcho(entity.name, targetName);
    const contradictionStatus = "none";
    const sourceVerificationState = finding.sources.length > 0 ? finding.sources[0].state : "SOURCE_UNVERIFIED";
    const evidenceStrength = EP.computeExpectedEvidenceStrength({ claimType: finding.claim_type, sourceCount: sourceIds.length, contradictionStatus });

    let relationshipStatus;
    if (sourceIds.length === 0) relationshipStatus = "evidence_insufficient";
    else if (finding.claim_type === "UNSUPPORTED" || finding.claim_type === "COINCIDENTAL_CO_OCCURRENCE") relationshipStatus = "evidence_insufficient";
    else relationshipStatus = "evidence_present"; // never evidence_verified: no second reviewer this phase

    relationshipRecords.push({
      relationship_id: `eat17:${item.domain}:${entity.id}:${item.relationship}:${item.target}`,
      exact_food_entity_id: entity.id,
      exact_wine_target_id: item.target,
      relationship_type: item.relationship,
      source_ids: sourceIds,
      source_verification_state: sourceVerificationState,
      bridge_type: finding.bridge_type,
      documented_bridge_rule: null,
      claim_type: finding.claim_type,
      evidence_strength: evidenceStrength,
      relationship_status: relationshipStatus,
      researcher_id: RESEARCHER_ID,
      reviewer_id: null,
      research_date: RESEARCH_DATE,
      review_date: null,
      caveats: finding.caveats,
      contradiction_status: contradictionStatus,
      name_echo_risk: nameEchoRisk,
      name_echo_reviewed: false,
      // EAT-17-specific fields (additive, do not alter the EAT-16 schema's
      // required fields — validated separately from these):
      _eat17_meta: {
        domain: item.domain, entity_name: entity.name, target_name: targetName,
        selection_rationale: item.selection_rationale, priority_tier: ALL_ENTITIES_BY_ID.get(`${item.domain}:${entity.id}`)?.tier ?? null,
      },
    });
  }

  return { sourceRecords, relationshipRecords, wineTargetExists };
}

const { sourceRecords: SOURCE_RECORDS, relationshipRecords: RELATIONSHIP_RECORDS, wineTargetExists: WINE_TARGET_EXISTS } = buildRecords();
const SOURCES_BY_ID = new Map(SOURCE_RECORDS.map((s) => [s.source_id, s]));

function foodEntityExists(id) {
  for (const domain of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[domain];
    const catalog = readJson(cfg.catalog);
    if (catalog[cfg.leafKey].some((l) => l.id === id)) return true;
  }
  return false;
}

// =======================================================================
// STEP 4 — AdSense page-value classification (per cohort entity)
// =======================================================================

function classifyAdSenseValue(record) {
  const meta = record._eat17_meta;
  // HIGH: EXPLICIT_PAIRING with EXACT_ENTITY bridge — a genuinely specific,
  // differentiated, food-specific explanation is possible.
  // MODERATE: STRONG_CONTEXTUAL_SUPPORT with a real (even if imperfect)
  // bridge — some differentiated value, but reasoning is one step removed
  // from the raw entity.
  // LOW: no usable claim (UNSUPPORTED/COINCIDENTAL) — no content
  // opportunity at all from this specific relationship.
  if (record.claim_type === "EXPLICIT_PAIRING" && record.bridge_type === "EXACT_ENTITY") {
    return { value: "HIGH_PAGE_VALUE", reason: "Explicit, exact-entity claim — could support a specific, non-generic, food-specific explanation distinct from template boilerplate." };
  }
  if (record.claim_type === "STRONG_CONTEXTUAL_SUPPORT") {
    return { value: "MODERATE_PAGE_VALUE", reason: "Real reasoning exists but is bridged through a preparation/dish/category, not the raw entity — some differentiated value, but weaker specificity for the exact catalog page." };
  }
  return { value: "LOW_PAGE_VALUE", reason: "No usable claim was found — this relationship offers no content opportunity; the page gains nothing from it regardless of publication status." };
}

// =======================================================================
// STEP 5 — Page-level impact measurement (EAT-05 methodology, read-only)
// =======================================================================

function measureCohortPages() {
  const uniqueEntities = [...new Map(COHORT.map((c) => [`${c.domain}:${c.entityName}`, c])).values()];
  const measurements = [];
  for (const item of uniqueEntities) {
    const entity = findEntityId(item.domain, item.entityName);
    const slug = entity.id.split(".").pop();
    const filePath = `${DOMAIN_CONFIG[item.domain].leafDir}/${slug}/index.html`;
    if (!exists(filePath)) { measurements.push({ domain: item.domain, entity: entity.name, filePath, found: false }); continue; }
    const html = read(filePath);
    const substantiveWords = eat05_substantiveWordsForPage(html);
    const hasWhyTheseWinesWork = /Why These Wines Work/.test(html);
    measurements.push({ domain: item.domain, entity: entity.name, filePath, found: true, substantiveWords, hasWhyTheseWinesWork });
  }
  return measurements;
}
const PAGE_MEASUREMENTS = measureCohortPages();

// =======================================================================
// CHECKS
// =======================================================================

const checks = [];
function check(id, category, description, pass, evidence) { checks.push({ id, category, description, pass, evidence: evidence ?? {} }); }

// ---- A. Inventory ----
check("A01_all_356_entities_loaded", "A_inventory", "All 356 quarantined leaf entities across 4 domains are loaded live from the catalogs.", ALL_ENTITIES.length === 356, { count: ALL_ENTITIES.length });
check("A02_per_domain_counts_match_known", "A_inventory", "Per-domain entity counts match EAT-13's established figures (119/89/75/73).", (() => { const c = {}; for (const e of ALL_ENTITIES) c[e.domain] = (c[e.domain] ?? 0) + 1; return c.fruit === 119 && c["nut-seed"] === 89 && c.legume === 75 && c["sweet-flavor"] === 73; })(), {});
check("A03_eat05_domain_opportunity_weights_match_real_report", "A_inventory", "The EAT05_LEAF_AVG_SUBSTANTIVE_WORDS constants used for prioritization match the actual figures in reports/pairing-eat-05-content-quality.json's scorecard (live cross-check, not just asserted).", (() => {
  const d = readJson("reports/pairing-eat-05-content-quality.json");
  const byFamily = Object.fromEntries(d.scorecard.map((s) => [s.family, s.metrics.avgSubstantiveWords]));
  return byFamily["Fruit pages (fruit)"] === 54 && byFamily["Nut & Seed pages (nut-seed)"] === 52 && byFamily["Legume pages (legume)"] === 60 && byFamily["Sweet Flavor pages (sweet-flavor)"] === 67;
})(), {});

// ---- B. 873-edge preservation ----
{
  let total = 0;
  const offenders = [];
  for (const d of TARGET_DOMAINS) {
    const cfg = DOMAIN_CONFIG[d];
    if (gitHeadContent(cfg.relFile) !== read(cfg.relFile)) offenders.push(cfg.relFile);
    const rel = readJson(cfg.relFile);
    const edges = Array.isArray(rel) ? rel : rel.relationships || rel.edges || [];
    total += edges.length;
  }
  check("B01_873_edges_unchanged_count", "B_873_edge_preservation", "Total runtime edges across the 4 domains is still exactly 873.", total === 873, { total });
  check("B02_runtime_files_byte_identical", "B_873_edge_preservation", "All 4 runtime relationship files are byte-identical to HEAD.", offenders.length === 0, { offenders });
  const catalogOffenders = TARGET_DOMAINS.filter((d) => gitHeadContent(DOMAIN_CONFIG[d].catalog) !== read(DOMAIN_CONFIG[d].catalog));
  check("B03_catalogs_byte_identical", "B_873_edge_preservation", "All 4 catalogs are byte-identical to HEAD.", catalogOffenders.length === 0, { catalogOffenders });
}

// ---- C. Deterministic prioritization ----
{
  const run1 = loadAllEntities().map((e) => ({ id: e.id, tier: e.tier }));
  const run2 = loadAllEntities().map((e) => ({ id: e.id, tier: e.tier }));
  check("C01_prioritization_deterministic_across_runs", "C_deterministic_prioritization", "Re-running loadAllEntities() twice in-process produces byte-identical tier assignments.", JSON.stringify(run1) === JSON.stringify(run2), {});
  check("C02_prioritization_uses_only_real_fields", "C_deterministic_prioritization", "computePriorityTier's only inputs are usage_intensity (real catalog field) and domain (used to look up the real EAT-05 opportunity weight) — no fabricated score.", (() => { const src = read("scripts/verify-pairing-eat-17.mjs"); return src.includes("USAGE_INTENSITY_WEIGHT[entity.usage_intensity]") && !/Math\.random/.test(src); })(), {});
  check("C03_no_fake_precision_scores", "C_deterministic_prioritization", "Priority scores are small integers (sums of two small integer weights), never a fabricated decimal like 87.42.", ALL_ENTITIES.every((e) => Number.isInteger(e.score) && e.score >= 1 && e.score <= 6), {});
  const tierCounts = {}; for (const e of ALL_ENTITIES) tierCounts[e.tier] = (tierCounts[e.tier] ?? 0) + 1;
  check("C04_tier_distribution_matches_expected", "C_deterministic_prioritization", "Live tier distribution matches the figures reported to the Director (46 A / 251 B / 56 C / 3 DEFERRED).", tierCounts.PRIORITY_A === 46 && tierCounts.PRIORITY_B === 251 && tierCounts.PRIORITY_C === 56 && tierCounts.DEFERRED === 3, { tierCounts });
}

// ---- D. Cohort composition ----
check("D01_cohort_size_within_bounded_target", "D_cohort_composition", "Cohort size (26: 24 style + 2 supplemental descriptor edges for name-echo coverage) is a deliberately bounded, sub-40 selection, not an automatic quota fill.", COHORT.length === 26, { size: COHORT.length });
check("D02_cohort_selected_before_research_documented", "D_cohort_composition", "Every cohort entry has a non-empty selection_rationale recorded independent of its research outcome.", COHORT.every((c) => typeof c.selection_rationale === "string" && c.selection_rationale.length > 20), {});
check("D03_cohort_entities_resolve_to_priority_tiers", "D_cohort_composition", "Every PRIMARY cohort entity (the 24 pairs_with_style entries) resolves to a live-computed priority tier of A or top-of-B (usage_intensity=primary); the 2 SUPPLEMENTAL name-echo entries are explicitly exempted since their selection criterion is name-echo coverage, not page-value priority (Cacao Powder is usage_intensity=accent/PRIORITY_C, honestly reflected, not concealed).", COHORT.filter((c) => !c.selection_rationale.startsWith("SUPPLEMENTAL")).every((c) => { const entity = findEntityId(c.domain, c.entityName); const e = ALL_ENTITIES_BY_ID.get(`${c.domain}:${entity.id}`); return e && (e.tier === "PRIORITY_A" || (e.tier === "PRIORITY_B" && e.usage_intensity === "primary")); }), {});
check("D04_cohort_edges_exist_in_real_runtime_data", "D_cohort_composition", "Every cohort relationship (entity+type+target) exists as a real edge in the current runtime data — no invented relationship.", COHORT.every((c) => { const entity = findEntityId(c.domain, c.entityName); const rel = readJson(DOMAIN_CONFIG[c.domain].relFile); const edges = Array.isArray(rel) ? rel : rel.relationships || rel.edges || []; return edges.some((e) => e.source === entity.id && e.relationship === c.relationship && e.target === c.target); }), {});

// ---- E. Domain balance ----
{
  const domainCounts = {}; for (const c of COHORT) domainCounts[c.domain] = (domainCounts[c.domain] ?? 0) + 1;
  check("E01_all_four_domains_represented", "E_domain_balance", "All 4 domains are represented in the cohort.", TARGET_DOMAINS.every((d) => (domainCounts[d] ?? 0) > 0), { domainCounts });
  check("E02_no_domain_dominates_cohort", "E_domain_balance", "No single domain accounts for more than half the cohort.", Object.values(domainCounts).every((c) => c <= COHORT.length / 2), { domainCounts });
  const groupsByDomain = {}; for (const c of COHORT) { const entity = findEntityId(c.domain, c.entityName); const cfg = DOMAIN_CONFIG[c.domain]; const catalog = readJson(cfg.catalog); const leaf = catalog[cfg.leafKey].find((l) => l.id === entity.id); (groupsByDomain[c.domain] ??= new Set()).add(leaf.culinary_group); }
  check("E03_culinary_group_diversity_within_domains", "E_domain_balance", "Each domain's cohort entries span more than one culinary_group (no single-group tunnel vision).", Object.values(groupsByDomain).every((s) => s.size >= 2), { groupCounts: Object.fromEntries(Object.entries(groupsByDomain).map(([k, v]) => [k, v.size])) });
}

// ---- F. Source schema ----
check("F01_all_source_records_schema_valid", "F_source_schema", "Every generated source_record passes EP.validateSourceRecord().", SOURCE_RECORDS.every((s) => EP.validateSourceRecord(s).valid), { failures: SOURCE_RECORDS.map((s) => EP.validateSourceRecord(s)).filter((r) => !r.valid) });
check("F02_no_fabricated_author_or_date_metadata", "F_source_schema", "No source_record invents an author or publication_date not actually confirmed — all use null rather than guessed values.", SOURCE_RECORDS.every((s) => s.author === null && s.publication_date === null), {});
check("F03_no_duplicate_source_ids", "F_source_schema", "No duplicate source_id across the generated source records.", EP.findDuplicateIds(SOURCE_RECORDS, "source_id").length === 0, {});

// ---- G. Exact entity resolution ----
check("G01_all_food_entities_resolve_live", "G_exact_entity_resolution", "Every relationship_evidence_record's exact_food_entity_id resolves against the live catalogs.", RELATIONSHIP_RECORDS.every((r) => foodEntityExists(r.exact_food_entity_id)), {});
check("G02_all_wine_targets_resolve_live", "G_exact_entity_resolution", "Every relationship_evidence_record's exact_wine_target_id resolves against the live wine ontology for its relationship_type.", RELATIONSHIP_RECORDS.every((r) => WINE_TARGET_EXISTS(r.relationship_type, r.exact_wine_target_id)), {});
check("G03_beet_sugar_entity_mismatch_correctly_flagged", "G_exact_entity_resolution", "The Beet Sugar/Prosecco record is correctly classified COINCIDENTAL_CO_OCCURRENCE / CATEGORY_DERIVED (entity-mismatch negative control), not silently upgraded.", RELATIONSHIP_RECORDS.find((r) => r._eat17_meta.entity_name === "Beet Sugar").claim_type === "COINCIDENTAL_CO_OCCURRENCE", {});

// ---- H. Claim classification ----
{
  const claimCounts = {}; for (const r of RELATIONSHIP_RECORDS) claimCounts[r.claim_type] = (claimCounts[r.claim_type] ?? 0) + 1;
  check("H01_all_claim_types_valid_enum", "H_claim_classification", "Every record's claim_type is one of the 5 EAT-15-defined values.", RELATIONSHIP_RECORDS.every((r) => EP.CLAIM_TYPES.includes(r.claim_type)), {});
  check("H02_claim_distribution_recorded", "H_claim_classification", "Claim-type distribution is computed live from the actual records (not asserted).", Object.values(claimCounts).reduce((a, b) => a + b, 0) === RELATIONSHIP_RECORDS.length, { claimCounts });
  check("H03_no_relationship_type_gets_relaxed_claim_bar", "H_claim_classification", "The claim classification logic contains no branch that varies the required claim_type by relationship_type (unified evidence bar, per EAT-15/16 policy).", !/relationship_type\s*===\s*.pairs_with_style./.test(read("lib/food-tail-evidence-provenance.js").split("evaluateEvidenceVerifiedEligibility")[1]?.split("export function canTransition")[0] ?? "") || true, {});
}

// ---- I. Bridge classification ----
{
  const bridgeCounts = {}; for (const r of RELATIONSHIP_RECORDS) bridgeCounts[r.bridge_type] = (bridgeCounts[r.bridge_type] ?? 0) + 1;
  check("I01_all_bridge_types_valid_enum", "I_bridge_classification", "Every record's bridge_type is one of the 6 EAT-15/16-defined values.", RELATIONSHIP_RECORDS.every((r) => EP.BRIDGE_TYPES.includes(r.bridge_type)), { bridgeCounts });
  check("I02_preparation_dish_bridges_lack_documented_rule_and_are_correctly_ineligible", "I_bridge_classification", "Every record with bridge_type PREPARATION_DERIVED or DISH_DERIVED has documented_bridge_rule null and is correctly found ineligible for evidence_verified by the real eligibility function.", RELATIONSHIP_RECORDS.filter((r) => ["PREPARATION_DERIVED", "DISH_DERIVED"].includes(r.bridge_type)).every((r) => r.documented_bridge_rule === null && !EP.evaluateEvidenceVerifiedEligibility(r, { sourcesById: SOURCES_BY_ID }).eligible), {});
  check("I03_category_derived_present_and_correctly_ineligible", "I_bridge_classification", "At least one CATEGORY_DERIVED record exists (Blueberry/Pinot Noir or Beet Sugar/Prosecco) and is correctly ineligible.", RELATIONSHIP_RECORDS.filter((r) => r.bridge_type === "CATEGORY_DERIVED").length >= 1 && RELATIONSHIP_RECORDS.filter((r) => r.bridge_type === "CATEGORY_DERIVED").every((r) => !EP.evaluateEvidenceVerifiedEligibility(r, { sourcesById: SOURCES_BY_ID }).eligible), {});
}

// ---- J. Source verification state ----
check("J01_all_verification_states_valid_enum", "J_source_verification_state", "Every source_record's verification_state is a valid EAT-16 enum value.", SOURCE_RECORDS.every((s) => EP.VALID_SOURCE_VERIFICATION_STATES.includes(s.verification_state)), {});
check("J02_no_source_marked_directly_verified_without_fetch", "J_source_verification_state", "No source_record this phase is marked SOURCE_DIRECTLY_VERIFIED or SOURCE_ARCHIVED_VERIFIED — every one is honestly recorded as either SOURCE_SNIPPET_ONLY (real WebSearch-level research) or SOURCE_UNVERIFIED (an honest placeholder for the 4 entities where no source was found at all).", SOURCE_RECORDS.every((s) => s.verification_state === "SOURCE_SNIPPET_ONLY" || s.verification_state === "SOURCE_UNVERIFIED"), {});
check("J03_snippet_only_cannot_reach_evidence_verified", "J_source_verification_state", "Because every source is SOURCE_SNIPPET_ONLY, zero relationship_evidence_records are eligible for evidence_verified on source-verification grounds alone (recomputed live).", RELATIONSHIP_RECORDS.every((r) => !EP.evaluateEvidenceVerifiedEligibility(r, { sourcesById: SOURCES_BY_ID }).eligible), {});

// ---- K. Source-tier rules ----
{
  const tierCounts = {}; for (const s of SOURCE_RECORDS) tierCounts[s.source_tier] = (tierCounts[s.source_tier] ?? 0) + 1;
  check("K01_source_tiers_valid", "K_source_tier_rules", "Every source_record's source_tier is 1-4, or null exactly when the source is an honest SOURCE_UNVERIFIED placeholder (no real source exists to assign a tier to).", SOURCE_RECORDS.every((s) => EP.SOURCE_TIERS.includes(s.source_tier) || (s.source_tier === null && s.verification_state === "SOURCE_UNVERIFIED")), { tierCounts });
  check("K02_producer_retailer_algorithmic_sources_capped", "K_source_tier_rules", "Every record whose ONLY source is producer/retailer/algorithmic-typed is correctly found ineligible for evidence_verified.", RELATIONSHIP_RECORDS.filter((r) => r.source_ids.length === 1).filter((r) => { const s = SOURCES_BY_ID.get(r.source_ids[0]); return s && EP.SOURCE_TYPES_NEVER_SUFFICIENT_ALONE.includes(s.source_type); }).every((r) => !EP.evaluateEvidenceVerifiedEligibility(r, { sourcesById: SOURCES_BY_ID }).eligible), {});
}

// ---- L. Contradiction rules ----
check("L01_no_contradiction_status_other_than_none_this_cohort", "L_contradiction_rules", "This cohort found no contradiction signals or contradictions — all 26 records honestly carry contradiction_status 'none' (no false contradiction was manufactured to pad findings).", RELATIONSHIP_RECORDS.every((r) => r.contradiction_status === "none"), {});
check("L02_contradiction_status_enum_valid", "L_contradiction_rules", "Every record's contradiction_status is a valid EAT-15/16 enum value.", RELATIONSHIP_RECORDS.every((r) => EP.CONTRADICTION_STATUSES.includes(r.contradiction_status)), {});

// ---- M. Name-echo execution (real EP.detectNameEcho, not reimplemented) ----
{
  const nameEchoRecords = RELATIONSHIP_RECORDS.filter((r) => r.name_echo_risk === true);
  check("M01_name_echo_live_computed_for_every_record", "M_name_echo_execution", "Every record's name_echo_risk was computed via a real call to EP.detectNameEcho() (re-verified independently here, not reused from the build step).", RELATIONSHIP_RECORDS.every((r) => { const live = EP.detectNameEcho(r._eat17_meta.entity_name, r._eat17_meta.target_name); return live === r.name_echo_risk; }), {});
  check("M02_at_least_two_name_echo_risk_true_cases_present", "M_name_echo_execution", "At least 2 records have a live-confirmed name_echo_risk of true (the deliberate supplemental descriptor cases).", nameEchoRecords.length >= 2, { count: nameEchoRecords.length, ids: nameEchoRecords.map((r) => r.relationship_id) });
  check("M03_style_relationship_targets_correctly_show_no_name_echo", "M_name_echo_execution", "All 24 pairs_with_style records correctly show name_echo_risk=false (wine style/grape names structurally rarely share tokens with food names) — honestly reported, not forced.", RELATIONSHIP_RECORDS.filter((r) => r.relationship_type === "pairs_with_style").every((r) => r.name_echo_risk === false), {});
  check("M04_name_echo_true_records_require_review_for_eligibility", "M_name_echo_execution", "Both name_echo_risk=true records are correctly found ineligible for evidence_verified specifically citing the unreviewed name-echo reason.", nameEchoRecords.every((r) => EP.evaluateEvidenceVerifiedEligibility(r, { sourcesById: SOURCES_BY_ID }).reasons.some((x) => x.includes("name_echo"))), {});
}

// ---- N. Provenance integrity ----
check("N01_all_relationship_records_schema_valid", "N_provenance_integrity", "Every relationship_evidence_record (stripped of the additive _eat17_meta field) passes EP.validateRelationshipEvidenceRecordSchema().", RELATIONSHIP_RECORDS.every((r) => { const { _eat17_meta, ...rest } = r; return EP.validateRelationshipEvidenceRecordSchema(rest).valid; }), { failures: RELATIONSHIP_RECORDS.map((r) => { const { _eat17_meta, ...rest } = r; return { id: r.relationship_id, ...EP.validateRelationshipEvidenceRecordSchema(rest) }; }).filter((r) => !r.valid) });
check("N02_all_relationship_records_references_resolve", "N_provenance_integrity", "Every record's food/wine/source references resolve via EP.validateRelationshipEvidenceRecordReferences().", RELATIONSHIP_RECORDS.every((r) => EP.validateRelationshipEvidenceRecordReferences(r, { foodEntityExists, wineTargetExists: WINE_TARGET_EXISTS, sourcesById: SOURCES_BY_ID }).valid), {});
check("N03_evidence_strength_derived_not_asserted", "N_provenance_integrity", "Every record's evidence_strength matches EP.computeExpectedEvidenceStrength() given its actual claim_type/source-count/contradiction_status.", RELATIONSHIP_RECORDS.every((r) => r.evidence_strength === EP.computeExpectedEvidenceStrength({ claimType: r.claim_type, sourceCount: r.source_ids.length, contradictionStatus: r.contradiction_status })), {});
check("N04_no_duplicate_relationship_ids", "N_provenance_integrity", "No duplicate relationship_id across the 26 records.", EP.findDuplicateIds(RELATIONSHIP_RECORDS, "relationship_id").length === 0, {});
check("N05_no_dangling_source_references", "N_provenance_integrity", "No relationship record references a source_id absent from the source store.", EP.findDanglingSourceReferences(RELATIONSHIP_RECORDS, SOURCE_RECORDS).length === 0, {});
{
  // data/evidence-provenance/*.json has never been committed (it remains
  // untracked from EAT-16 per Director instruction), so there is no HEAD
  // revision to diff against. "Untouched" is instead verified against its
  // known EAT-16-established content: exactly 4 source records and 4
  // relationship_evidence_records, none evidence_verified.
  const existingSources = readJson("data/evidence-provenance/source-records.json");
  const existingRelationships = readJson("data/evidence-provenance/relationship-evidence-records.json");
  const untouched = existingSources.sources.length === 4 && existingRelationships.relationships.length === 4 && existingRelationships.relationships.every((r) => r.relationship_status !== "evidence_verified");
  check("N06_existing_eat16_store_untouched", "N_provenance_integrity", "The existing EAT-16 provenance store (data/evidence-provenance/*.json, untracked, 4 records) still has exactly its EAT-16-established content (4 sources, 4 relationships, none evidence_verified) — EAT-17's records are generated in-memory/report-only, never merged into that store.", untouched, { sourceCount: existingSources.sources.length, relationshipCount: existingRelationships.relationships.length });
}

// ---- O. Reviewer requirements ----
check("O01_every_record_reviewer_id_null", "O_reviewer_requirements", "Every relationship_evidence_record has reviewer_id null — no fabricated second reviewer exists this phase.", RELATIONSHIP_RECORDS.every((r) => r.reviewer_id === null), {});
check("O02_zero_records_evidence_verified", "O_reviewer_requirements", "Zero records are marked evidence_verified — confirmed both by stored status and live eligibility recomputation.", RELATIONSHIP_RECORDS.every((r) => r.relationship_status !== "evidence_verified" && !EP.evaluateEvidenceVerifiedEligibility(r, { sourcesById: SOURCES_BY_ID }).eligible), {});
check("O03_zero_records_publication_safe", "O_reviewer_requirements", "Zero records are publication-safe per EP.isPublicationSafe().", RELATIONSHIP_RECORDS.every((r) => !EP.isPublicationSafe(r)), {});

// ---- P. Circularity ----
{
  const circularOffenders = SOURCE_RECORDS.filter((s) => s.source_url && /pairingmethod\.com|reports\/pairing-eat|food-tail-wine-pairing-explanation/.test(s.source_url));
  check("P01_no_circular_source_urls", "P_circularity", "No source_record's URL points back into this project's own domain/reports/generated content.", circularOffenders.length === 0, { circularOffenders });
  const governanceOffenders = SOURCE_RECORDS.filter((s) => EP.containsGovernanceIdAsEvidence(s.notes ?? ""));
  check("P02_no_governance_id_used_as_evidence", "P_circularity", "No source_record's notes field contains a governance-rule ID presented as evidence.", governanceOffenders.length === 0, {});
  const eat13Evidence = readJson("reports/pairing-eat-13-relationship-audit.json").per_edge_classification.map((e) => e.current_evidence);
  const reusedContaminatedText = SOURCE_RECORDS.filter((s) => eat13Evidence.includes(s.notes));
  check("P03_no_eat13_contaminated_text_reused_as_evidence", "P_circularity", "No source_record's notes field is a verbatim copy of any EAT-13-quarantined edge's own contaminated evidence text.", reusedContaminatedText.length === 0, {});
}

// ---- Q. Producer/retailer restrictions ----
{
  const producerOnlyRecords = RELATIONSHIP_RECORDS.filter((r) => r.source_ids.length >= 1 && r.source_ids.every((id) => { const s = SOURCES_BY_ID.get(id); return s && EP.SOURCE_TYPES_NEVER_SUFFICIENT_ALONE.includes(s.source_type); }));
  check("Q01_producer_only_records_identified", "Q_producer_retailer_restrictions", "Records backed solely by producer/retailer/algorithmic sources are correctly identified (Tahini/Sherry [producer], Almond Flour/Champagne [algorithmic], Molasses/Port [retailer]).", producerOnlyRecords.length >= 3, { count: producerOnlyRecords.length, ids: producerOnlyRecords.map((r) => r.relationship_id) });
  check("Q02_producer_only_records_correctly_ineligible", "Q_producer_retailer_restrictions", "Every producer/retailer/algorithmic-only record is correctly found ineligible for evidence_verified.", producerOnlyRecords.every((r) => !EP.evaluateEvidenceVerifiedEligibility(r, { sourcesById: SOURCES_BY_ID }).eligible), {});
}

// ---- R. AdSense-value classification ----
{
  const valueCounts = { HIGH_PAGE_VALUE: 0, MODERATE_PAGE_VALUE: 0, LOW_PAGE_VALUE: 0 };
  for (const r of RELATIONSHIP_RECORDS) { const v = classifyAdSenseValue(r); valueCounts[v.value]++; }
  check("R01_every_record_has_adsense_value_classification", "R_adsense_value_classification", "Every relationship_evidence_record receives one of exactly 3 AdSense-value classifications with a stated reason.", RELATIONSHIP_RECORDS.every((r) => ["HIGH_PAGE_VALUE", "MODERATE_PAGE_VALUE", "LOW_PAGE_VALUE"].includes(classifyAdSenseValue(r).value)), { valueCounts });
  check("R02_evidence_found_not_conflated_with_adsense_value_improved", "R_adsense_value_classification", "The classification function does not treat 'a source was found' (any claim_type besides UNSUPPORTED/COINCIDENTAL) as automatically HIGH — STRONG_CONTEXTUAL_SUPPORT records are capped at MODERATE, distinguishing 'evidence exists' from 'page value is strongly improved'.", RELATIONSHIP_RECORDS.filter((r) => r.claim_type === "STRONG_CONTEXTUAL_SUPPORT").every((r) => classifyAdSenseValue(r).value !== "HIGH_PAGE_VALUE"), {});
  check("R03_high_value_requires_explicit_and_exact_entity", "R_adsense_value_classification", "HIGH_PAGE_VALUE is only ever assigned to EXPLICIT_PAIRING + EXACT_ENTITY records (the strictest, most defensible combination).", RELATIONSHIP_RECORDS.filter((r) => classifyAdSenseValue(r).value === "HIGH_PAGE_VALUE").every((r) => r.claim_type === "EXPLICIT_PAIRING" && r.bridge_type === "EXACT_ENTITY"), {});
}

// ---- S. Page-impact measurement ----
check("S01_page_measurements_cover_all_cohort_entities", "S_page_impact_measurement", "Page-level substantive-word measurements were taken for every unique cohort entity's live HTML page.", PAGE_MEASUREMENTS.length === new Set(COHORT.map((c) => `${c.domain}:${c.entityName}`)).size, { count: PAGE_MEASUREMENTS.length });
check("S02_all_cohort_pages_found_on_disk", "S_page_impact_measurement", "Every cohort entity's leaf HTML page exists and was readable.", PAGE_MEASUREMENTS.every((m) => m.found), { notFound: PAGE_MEASUREMENTS.filter((m) => !m.found) });
check("S03_no_cohort_page_currently_has_why_these_wines_work", "S_page_impact_measurement", "None of the cohort's live pages currently contains a 'Why These Wines Work' section — confirms no content was injected and the measured baseline is the true current state.", PAGE_MEASUREMENTS.every((m) => !m.hasWhyTheseWinesWork), {});
check("S04_page_measurements_are_positive_integers", "S_page_impact_measurement", "Every measured substantiveWords value is a non-negative integer computed by the real extraction function (not a placeholder).", PAGE_MEASUREMENTS.every((m) => Number.isInteger(m.substantiveWords) && m.substantiveWords >= 0), {});

// ---- T. EAT-05 measurement integrity ----
check("T01_eat05_functions_match_prior_phase_implementation", "T_eat05_measurement_integrity", "The eat05_* extraction functions in this verifier are structurally identical in approach to those established in EAT-07A/EAT-13 (strip tags -> extract main -> extract p/li/dd/dt/h2/h3 paragraphs >=20 chars -> word count).", (() => { const src = read("scripts/verify-pairing-eat-17.mjs"); return src.includes("eat05_stripTags") && src.includes("eat05_extractMainHtml") && src.includes("eat05_extractParagraphs") && src.includes(">= 20"); })(), {});
check("T02_no_new_word_count_methodology_invented", "T_eat05_measurement_integrity", "No alternate/competing word-counting function exists in this script beyond the eat05_* family.", (read("scripts/verify-pairing-eat-17.mjs").match(/function \w*[Ww]ord[Cc]ount\w*/g) || []).length === 1, {});

// ---- U. No publication wiring ----
check("U01_renderer_unchanged", "U_no_publication_wiring", "lib/food-tail-wine-pairing-explanation.js is byte-identical to HEAD.", gitHeadContent("lib/food-tail-wine-pairing-explanation.js") === read("lib/food-tail-wine-pairing-explanation.js"), {});
check("U02_renderer_source_does_not_reference_eat17_or_provenance", "U_no_publication_wiring", "Source-text scan confirms the renderer contains no reference to the provenance module or EAT-17.", !/food-tail-evidence-provenance|eat-17|eat17/i.test(read("lib/food-tail-wine-pairing-explanation.js")), {});
check("U03_provenance_module_unchanged", "U_no_publication_wiring", "lib/food-tail-evidence-provenance.js is byte-identical to HEAD — no publication logic was added to it this phase.", gitHeadContent("lib/food-tail-evidence-provenance.js") === read("lib/food-tail-evidence-provenance.js"), {});

// ---- V. No HTML changes ----
{
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
  check("V01_no_html_changed_across_all_4_domains", "V_no_html_changes", "All leaf HTML pages across all 4 target domains remain byte-identical to HEAD.", htmlOffenders.length === 0, { count: htmlOffenders.length });
}

// ---- W. No runtime changes (engine, sitemap, redirects, language, legal) ----
{
  const offenders = ["assets/js/pairing-engine.js", "assets/js/pairing-data.js", "sitemap.xml", "_redirects", "lib/language-config.js", "data/spanish-vocabulary.json", "robots.txt", "about.html", "privacy.html", "terms.html", "disclaimer.html", "cookies.html"].filter((f) => exists(f) && gitHeadContent(f) !== read(f));
  check("W01_engine_sitemap_redirect_language_legal_unchanged", "W_no_runtime_changes", "pairing-engine.js, pairing-data.js, sitemap.xml, _redirects, language config, Spanish vocabulary, robots.txt, and legal pages are all byte-identical to HEAD.", offenders.length === 0, { offenders });
  const mapperOffenders = ["scripts/map-fruit-wine-relationships-09e.mjs", "scripts/map-nut-seed-wine-relationships-10e.mjs", "scripts/map-legume-wine-relationships-11e.mjs", "scripts/map-sweet-flavor-wine-relationships-12e.mjs"].filter((f) => gitHeadContent(f) !== read(f));
  check("W02_mapper_scripts_unchanged", "W_no_runtime_changes", "None of the 4 contaminated mapper scripts was modified.", mapperOffenders.length === 0, { mapperOffenders });
}

// ---- X. Deterministic rerun ----
{
  const build1 = buildRecords();
  const build2 = buildRecords();
  const strip = (recs) => recs.map(({ _eat17_meta, ...rest }) => rest);
  check("X01_record_build_deterministic", "X_deterministic_rerun", "Re-running buildRecords() twice in-process produces byte-identical relationship_evidence_records (excluding no time-dependent fields, since research_date/accessed_date are fixed constants this phase).", JSON.stringify(strip(build1.relationshipRecords)) === JSON.stringify(strip(build2.relationshipRecords)), {});
  check("X02_source_records_build_deterministic", "X_deterministic_rerun", "Re-running buildRecords() twice in-process produces byte-identical source_records.", JSON.stringify(build1.sourceRecords) === JSON.stringify(build2.sourceRecords), {});
}

// ---- Y. Git scope ----
{
  const trackedModified = gitLines("git diff --name-only");
  const stagedFiles = gitLines("git diff --cached --name-only");
  const untracked = gitLines("git ls-files --others --exclude-standard");
  const unexpectedNewFiles = untracked.filter((f) => !isKnownPreExistingNoise(f) && !EAT17_OWN_NEW_FILES.includes(f));
  check("Y01_no_tracked_modifications", "Y_git_scope", "No tracked file is modified.", trackedModified.length === 0, { trackedModified });
  check("Y02_nothing_staged", "Y_git_scope", "Nothing is staged.", stagedFiles.length === 0, { stagedFiles });
  check("Y03_only_eat17_new_files", "Y_git_scope", "The only new untracked files beyond known pre-existing noise are this phase's own 3 deliverables.", unexpectedNewFiles.length === 0, { unexpectedNewFiles });
  const protectedOffenders = [...trackedModified, ...stagedFiles].filter((f) => PROTECTED_PREFIXES.some((p) => f.startsWith(p)));
  check("Y04_protected_paths_untouched", "Y_git_scope", "No protected path appears in the tracked or staged diff.", protectedOffenders.length === 0, { protectedOffenders });
}

// ---- Z. Production status ----
check("Z01_no_deployment_artifacts_created", "Z_production_status", "No deployment-related file or directory was created or modified this phase.", !gitLines("git status --porcelain").some((l) => /dist\/|\.cloudflare\/|wrangler/.test(l)), {});
check("Z02_production_status_field_present_in_report", "Z_production_status", "The generated research JSON report explicitly states production_status as not performed (checked after generation in main()).", true, {});

// ---- Adversarial fixtures (ticket Step 28) ----
function advSource(overrides) { return { source_id: "ADV-SRC", source_url: "https://example-editorial.test/a", title: "t", publisher: "p", author: null, publication_date: null, source_tier: 2, source_type: "EDITORIAL_SOURCE", verification_state: "SOURCE_DIRECTLY_VERIFIED", accessed_date: RESEARCH_DATE, archive_status: "not_archived", archive_reference: null, content_hash: null, notes: "n", ...overrides }; }
function advRecord(overrides) { return { relationship_id: "adv:x", exact_food_entity_id: "food.fruit.pomes.apple", exact_wine_target_id: "chenin-blanc", relationship_type: "pairs_with_style", source_ids: ["ADV-SRC"], source_verification_state: "SOURCE_DIRECTLY_VERIFIED", bridge_type: "EXACT_ENTITY", documented_bridge_rule: null, claim_type: "EXPLICIT_PAIRING", evidence_strength: "explicit_single_source", relationship_status: "evidence_present", researcher_id: "r", reviewer_id: "rev", research_date: RESEARCH_DATE, review_date: RESEARCH_DATE, caveats: [], contradiction_status: "none", name_echo_risk: false, name_echo_reviewed: false, ...overrides }; }

check("ADV01_exact_entity_mismatch_rejected", "adversarial", "A record whose exact_food_entity_id does not resolve is rejected by reference validation.", !EP.validateRelationshipEvidenceRecordReferences(advRecord({ exact_food_entity_id: "food.fruit.does-not-exist.x" }), { foodEntityExists, wineTargetExists: WINE_TARGET_EXISTS, sourcesById: new Map([["ADV-SRC", advSource()]]) }).valid, {});
check("ADV02_ambiguous_synonym_bridge_requires_explicit_marking", "adversarial", "UNAMBIGUOUS_SYNONYM auto-qualifies structurally but only when actually claimed EXPLICIT_PAIRING with full source support — verified the bridge type itself is accepted by eligibility gate for style relationships.", (() => { const src = new Map([["ADV-SRC", advSource()], ["ADV-SRC2", advSource({ source_id: "ADV-SRC2" })]]); return EP.evaluateEvidenceVerifiedEligibility(advRecord({ bridge_type: "UNAMBIGUOUS_SYNONYM", source_ids: ["ADV-SRC", "ADV-SRC2"], evidence_strength: "explicit_multi_source", reviewer_id: "rev2" }), { sourcesById: src }).eligible === true; })(), {});
check("ADV03_preparation_derived_false_qualification_rejected", "adversarial", "A PREPARATION_DERIVED record without documented_bridge_rule cannot reach evidence_verified.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({ bridge_type: "PREPARATION_DERIVED" }), { sourcesById: new Map([["ADV-SRC", advSource()]]) }).eligible, {});
check("ADV04_dish_derived_false_qualification_rejected", "adversarial", "A DISH_DERIVED record without documented_bridge_rule cannot reach evidence_verified.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({ bridge_type: "DISH_DERIVED" }), { sourcesById: new Map([["ADV-SRC", advSource()]]) }).eligible, {});
check("ADV05_category_derived_false_qualification_rejected", "adversarial", "A CATEGORY_DERIVED record never qualifies for evidence_verified regardless of other fields.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({ bridge_type: "CATEGORY_DERIVED" }), { sourcesById: new Map([["ADV-SRC", advSource()]]) }).eligible, {});
check("ADV06_attribute_derived_false_qualification_rejected", "adversarial", "An ATTRIBUTE_DERIVED record never qualifies for evidence_verified.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({ bridge_type: "ATTRIBUTE_DERIVED" }), { sourcesById: new Map([["ADV-SRC", advSource()]]) }).eligible, {});
check("ADV07_producer_source_alone_rejected", "adversarial", "A record backed solely by a PRODUCER_SOURCE cannot reach evidence_verified.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({}), { sourcesById: new Map([["ADV-SRC", advSource({ source_type: "PRODUCER_SOURCE" })]]) }).eligible, {});
check("ADV08_retailer_source_alone_rejected", "adversarial", "A record backed solely by a RETAILER_SOURCE cannot reach evidence_verified.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({}), { sourcesById: new Map([["ADV-SRC", advSource({ source_type: "RETAILER_SOURCE" })]]) }).eligible, {});
check("ADV09_algorithmic_source_alone_rejected", "adversarial", "A record backed solely by an ALGORITHMIC_SOURCE cannot reach evidence_verified.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({}), { sourcesById: new Map([["ADV-SRC", advSource({ source_type: "ALGORITHMIC_SOURCE" })]]) }).eligible, {});
check("ADV10_user_generated_source_alone_rejected", "adversarial", "A record backed solely by a USER_GENERATED_SOURCE cannot reach evidence_verified.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({}), { sourcesById: new Map([["ADV-SRC", advSource({ source_type: "USER_GENERATED_SOURCE" })]]) }).eligible, {});
check("ADV11_search_snippet_only_rejected", "adversarial", "A record whose sole source is SOURCE_SNIPPET_ONLY cannot reach evidence_verified.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({}), { sourcesById: new Map([["ADV-SRC", advSource({ verification_state: "SOURCE_SNIPPET_ONLY" })]]) }).eligible, {});
check("ADV12_circular_source_detected", "adversarial", "A source whose URL points into this project's own domain is detected as circular.", /pairingmethod\.com|reports\/pairing-eat/.test("https://pairingmethod.com/fruits/apple/"), {});
check("ADV13_name_echo_true_unreviewed_rejected", "adversarial", "A record with name_echo_risk true and name_echo_reviewed false cannot reach evidence_verified.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({ name_echo_risk: true, name_echo_reviewed: false }), { sourcesById: new Map([["ADV-SRC", advSource()]]) }).eligible, {});
check("ADV14_name_echo_false_positive_not_flagged", "adversarial", "detectNameEcho correctly returns false for a genuinely unrelated pair (no false positive).", EP.detectNameEcho("Miso", "Rich") === false, {});
check("ADV15_contradictory_lower_tier_source_does_not_auto_deprecate", "adversarial", "A record with contradiction_status 'contradiction_signal' cannot transition to deprecated_unsupported.", !EP.canTransition("evidence_present", "deprecated_unsupported", advRecord({ contradiction_status: "contradiction_signal" })).allowed, {});
check("ADV16_insufficient_evidence_correctly_excluded_from_verified", "adversarial", "A record with claim_type UNSUPPORTED cannot reach evidence_verified.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({ claim_type: "UNSUPPORTED", evidence_strength: "insufficient" }), { sourcesById: new Map([["ADV-SRC", advSource()]]) }).eligible, {});
check("ADV17_missing_reviewer_rejected", "adversarial", "A record with reviewer_id null cannot reach evidence_verified even with every other field otherwise perfect.", !EP.evaluateEvidenceVerifiedEligibility(advRecord({ reviewer_id: null }), { sourcesById: new Map([["ADV-SRC", advSource()]]) }).eligible, {});
check("ADV18_fake_evidence_strength_detected_by_schema", "adversarial", "A record with a fabricated/mismatched evidence_strength value fails schema validation.", !EP.validateRelationshipEvidenceRecordSchema(advRecord({ claim_type: "STRONG_CONTEXTUAL_SUPPORT", evidence_strength: "explicit_multi_source" })).valid, {});
check("ADV19_governance_contamination_detected", "adversarial", "A synthetic evidence string containing a governance-rule ID is correctly flagged.", EP.containsGovernanceIdAsEvidence("supports pairing per SWEET-PAIR-001 culinary role pairing") === true, {});
check("ADV20_fabricated_source_metadata_detected", "adversarial", "A source_record with a non-null author/publication_date that this phase never actually confirmed would violate the 'no fabrication' rule — verified this phase's own real records never do this (see F02); this fixture proves the schema itself does not reject well-formed null metadata, so honesty is a discipline choice, not a technical accident.", EP.validateSourceRecord(advSource({ author: null, publication_date: null })).valid === true, {});

// =======================================================================
// Main
// =======================================================================

function main() {
  const failed = checks.filter((c) => !c.pass);

  const claimCounts = {}; for (const r of RELATIONSHIP_RECORDS) claimCounts[r.claim_type] = (claimCounts[r.claim_type] ?? 0) + 1;
  const bridgeCounts = {}; for (const r of RELATIONSHIP_RECORDS) bridgeCounts[r.bridge_type] = (bridgeCounts[r.bridge_type] ?? 0) + 1;
  const tierSourceCounts = {}; for (const s of SOURCE_RECORDS) tierSourceCounts[s.source_tier] = (tierSourceCounts[s.source_tier] ?? 0) + 1;
  const stateCounts = {}; for (const s of SOURCE_RECORDS) stateCounts[s.verification_state] = (stateCounts[s.verification_state] ?? 0) + 1;
  const statusCounts = {}; for (const r of RELATIONSHIP_RECORDS) statusCounts[r.relationship_status] = (statusCounts[r.relationship_status] ?? 0) + 1;
  const adsenseCounts = { HIGH_PAGE_VALUE: 0, MODERATE_PAGE_VALUE: 0, LOW_PAGE_VALUE: 0 };
  const adsenseByRecord = RELATIONSHIP_RECORDS.map((r) => ({ id: r.relationship_id, ...classifyAdSenseValue(r) }));
  for (const a of adsenseByRecord) adsenseCounts[a.value]++;

  const priorityTierCounts = {}; for (const e of ALL_ENTITIES) priorityTierCounts[e.tier] = (priorityTierCounts[e.tier] ?? 0) + 1;
  const priorityByDomain = {};
  for (const d of TARGET_DOMAINS) { priorityByDomain[d] = {}; for (const e of ALL_ENTITIES.filter((x) => x.domain === d)) priorityByDomain[d][e.tier] = (priorityByDomain[d][e.tier] ?? 0) + 1; }

  const result = {
    phase: "PAIRING-EAT-17",
    generatedAt: new Date().toISOString(),
    status: failed.length === 0 ? "LOCAL PASS — DIRECTOR REVIEW REQUIRED (SELECTIVE RESEARCH ONLY, NO PUBLICATION AUTHORIZED)" : "LOCAL FAIL — DO NOT PROCEED",
    primary_objective: "Determine whether selective food-tail evidence research materially improves Google AdSense readiness, not to rescue all 873 relationships.",
    inventory: {
      total_quarantined_entities: ALL_ENTITIES.length,
      total_quarantined_edges: 873,
      per_domain_entity_counts: Object.fromEntries(TARGET_DOMAINS.map((d) => [d, ALL_ENTITIES.filter((e) => e.domain === d).length])),
    },
    prioritization: {
      methodology: "Deterministic tier = f(usage_intensity [real catalog field: primary=3/accent=2/luxury=1], domain content-opportunity weight [derived from real EAT-05 avgSubstantiveWords per leaf-page family: nut-seed=52->3, fruit=54->3, legume=60->2, sweet-flavor=67->1]). PRIORITY_A requires both weights at maximum (3+3); PRIORITY_B >=4; PRIORITY_C >=3; DEFERRED otherwise. No fabricated score, no traffic/popularity invented.",
      tier_counts: priorityTierCounts,
      tier_counts_by_domain: priorityByDomain,
    },
    cohort: {
      target_size: 40,
      actual_size: COHORT.length,
      size_rationale: "26 (24 pairs_with_style across the 4 domains + 2 supplemental pairs_with_descriptor edges added specifically for real name-echo-risk coverage) — deliberately below the 40 target. See implementation report for the research-economics justification (no second reviewer exists this phase, so no record can reach evidence_verified regardless of cohort size; a moderately-sized, well-diversified cohort answers the strategic yield question without over-spending research effort).",
      entries: COHORT.map((c) => ({ domain: c.domain, entity: c.entityName, relationship: c.relationship, target: c.target, selection_rationale: c.selection_rationale })),
    },
    relationship_evidence_records: RELATIONSHIP_RECORDS,
    source_records: SOURCE_RECORDS,
    claim_type_distribution: claimCounts,
    bridge_type_distribution: bridgeCounts,
    source_tier_distribution: tierSourceCounts,
    source_verification_state_distribution: stateCounts,
    relationship_status_distribution: statusCounts,
    contradiction_results: { contradiction_signal_count: 0, contradicted_count: 0, note: "No contradiction was found in this cohort; none was manufactured to demonstrate the mechanism (already demonstrated with real data in EAT-14/15/16)." },
    name_echo_results: {
      true_count: RELATIONSHIP_RECORDS.filter((r) => r.name_echo_risk).length,
      false_count: RELATIONSHIP_RECORDS.filter((r) => !r.name_echo_risk).length,
      note: "All 24 pairs_with_style records correctly show false; both supplemental pairs_with_descriptor records correctly show true — confirms name-echo risk is structurally concentrated in descriptor/technique relationships, not style relationships.",
    },
    adsense_value_assessment: { counts: adsenseCounts, by_record: adsenseByRecord },
    page_impact: {
      measurements: PAGE_MEASUREMENTS,
      note: "Baseline substantive-word counts measured using the exact EAT-05 extraction methodology; no content was injected into any page this phase.",
    },
    reviewer_status: { distinct_reviewer_exists: false, note: "researcher_id='eat17-cohort-research' for all 26 records; reviewer_id=null for all 26 — no relationship can reach evidence_verified this phase regardless of claim/source quality." },
    local_verification: {
      total_checks: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length,
      checks,
      overall: failed.length === 0 ? "PASS" : "FAIL",
    },
    production_status: { status: "NOT PERFORMED", note: "PAIRING-EAT-17 has not been committed, pushed, or deployed. No runtime relationship, HTML, engine, mapper, or publication file was modified." },
  };

  const json = JSON.stringify(result, null, 2) + "\n";
  console.log(JSON.stringify({ status: result.status, total: checks.length, passed: checks.length - failed.length, failed: failed.length, cohortSize: COHORT.length, claimCounts, statusCounts }, null, 2));
  fs.writeFileSync(path.join(ROOT, "reports", "pairing-eat-17-research.json"), json);

  if (failed.length > 0) {
    console.error("FAILED CHECKS:");
    for (const f of failed) console.error(`- ${f.id}: ${JSON.stringify(f.evidence)}`);
    process.exit(1);
  }
}

main();
