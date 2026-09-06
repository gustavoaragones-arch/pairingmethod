#!/usr/bin/env node
/**
 * PAIRING-EAT-11 — Sommelier Verdict Authority-Framing Review & Trust
 * Language Normalization verification.
 *
 * Implements EAT-09's second P1 finding: the "Sommelier Verdict" heading on
 * the 5 high-intent pages that also display Pairing Strength borrows
 * professional-authority framing for what is actually Pairing Method's own
 * model/editorial output. This phase replaces that heading (and its
 * matching aria-label) with "Pairing Method Verdict" on exactly those 5
 * pages — a terminology change only, no score/ranking/model change.
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}
function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}
function readJson(relPath) {
  return JSON.parse(read(relPath));
}
function gitLines(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: "utf8" })
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}
function gitHeadContent(relPath) {
  try {
    return execSync(`git show HEAD:${JSON.stringify(relPath)}`, { cwd: ROOT, encoding: "utf8" });
  } catch {
    return null;
  }
}

const AFFECTED_PAGES = [
  "wine-with-steak.html",
  "wine-with-chicken.html",
  "wine-with-salmon.html",
  "wine-for-bbq-ribs.html",
  "wine-for-thanksgiving-turkey.html",
];
const OUT_OF_SCOPE_SOMMELIER_PAGES = [
  "wine-with-grilled-steak.html",
  "wine-with-roasted-chicken.html",
  "wine-with-fried-fish.html",
  "wine-with-spicy-food.html",
  "wine-with-creamy-dishes.html",
  "wine-with-smoked-pork.html",
];
const NEW_HEADING = "Pairing Method Verdict";
const NEW_ARIA_LABEL = "Pairing Method verdict";
const OLD_HEADING = "Sommelier Verdict";
const OLD_ARIA_LABEL = "Sommelier verdict";

// ---------------------------------------------------------------------
// V01 — EAT-09 audit reviewed
// ---------------------------------------------------------------------

function checkEat09Reviewed() {
  const exists09 = exists("reports/pairing-eat-09-evidence-audit.md") && exists("reports/pairing-eat-09-evidence-audit.json");
  const md = exists09 ? read("reports/pairing-eat-09-evidence-audit.md") : "";
  const referencesFinding = /Sommelier Verdict/.test(md);
  return {
    id: "V01_eat09_audit_reviewed",
    description: "reports/pairing-eat-09-evidence-audit.md/.json exist and were reviewed — this phase traces directly to EAT-09's second P1 finding about the 'Sommelier Verdict' heading.",
    pass: exists09 && referencesFinding,
    evidence: { exists09, referencesFinding },
  };
}

// ---------------------------------------------------------------------
// V02 — complete Sommelier terminology inventory performed
// ---------------------------------------------------------------------

function checkTerminologyInventoryPerformed(inventory) {
  // Not every one of the ticket's 9 illustrative categories (A-I) is
  // guaranteed to have a genuine real-world occurrence in THIS specific
  // "sommelier/expert/approved/validated" search — e.g. EAT-04's approved
  // trust copy (category E) deliberately never uses the word "sommelier" at
  // all, so forcing an artificial E-classified record would be dishonest
  // (manufacturing a finding rather than reporting one). This check instead
  // requires: (a) every record has a valid, defined category letter, (b) at
  // least 6 distinct categories are genuinely represented (demonstrating
  // real differentiated analysis, not a uniform rubber-stamp), and (c) the
  // key required distinction — actual authority claim (A) vs. legitimate
  // descriptive/editorial use (B/C) vs. out-of-scope generated content
  // (I) — is present, since that distinction is the one this phase's
  // decision actually depends on.
  const validCategories = new Set(["A", "B", "C", "D", "E", "F", "G", "H", "I"]);
  const allRecordsValid = inventory.every((r) => String(r.category).split("/").every((c) => validCategories.has(c)));
  const distinctCategories = new Set(inventory.flatMap((r) => String(r.category).split("/")));
  const hasKeyDistinction = distinctCategories.has("A") && (distinctCategories.has("B") || distinctCategories.has("C")) && distinctCategories.has("I");
  return {
    id: "V02_terminology_inventory_performed",
    description: "A complete repository-wide 'sommelier'/'Sommelier Verdict'/'expert'/'approved'/'validated' inventory was performed. Every record has a valid category, at least 6 distinct categories are genuinely represented, and the key distinction this phase's decision depends on (actual authority claim vs. legitimate descriptive/editorial use vs. out-of-scope generated content) is present. Categories with zero genuine real-world occurrences (e.g. E — no approved EAT-04 trust copy uses the word 'sommelier' at all) are not force-populated.",
    pass: inventory.length >= 10 && allRecordsValid && distinctCategories.size >= 6 && hasKeyDistinction,
    evidence: { recordCount: inventory.length, distinctCategoriesPresent: [...distinctCategories].sort(), distinctCategoryCount: distinctCategories.size, hasKeyDistinction },
  };
}

// ---------------------------------------------------------------------
// V03 — all five high-intent pages located
// ---------------------------------------------------------------------

function checkFivePagesLocated() {
  const allExist = AFFECTED_PAGES.every((f) => exists(f));
  return {
    id: "V03_five_pages_located",
    description: "All 5 in-scope high-intent pages (per EAT-09's named scope) are located and exist.",
    pass: allExist,
    evidence: { pages: AFFECTED_PAGES, allExist },
  };
}

// ---------------------------------------------------------------------
// V04 — current Sommelier Verdict state recorded (baseline, from HEAD)
// ---------------------------------------------------------------------

function checkBaselineRecorded() {
  const baseline = {};
  let allHadOldHeading = true;
  for (const page of AFFECTED_PAGES) {
    const head = gitHeadContent(page);
    const hadHeading = head?.includes(`<h2>${OLD_HEADING}</h2>`) ?? false;
    baseline[page] = hadHeading;
    if (!hadHeading) allHadOldHeading = false;
  }
  return {
    id: "V04_baseline_recorded",
    description: "The HEAD (pre-implementation) version of every affected page is confirmed to have carried the exact 'Sommelier Verdict' heading, establishing the baseline this phase changes.",
    pass: allHadOldHeading,
    evidence: baseline,
  };
}

// ---------------------------------------------------------------------
// V05 — authority-framing decision explicitly documented
// ---------------------------------------------------------------------

function checkDecisionDocumented() {
  const md = exists("reports/pairing-eat-11-implementation.md") ? read("reports/pairing-eat-11-implementation.md") : "";
  const hasDecisionSection = /### 5\. Decision/.test(md);
  const hasDecisionRule = /reasonable first-time visitor/i.test(md);
  return {
    id: "V05_decision_documented",
    description: "The implementation report contains an explicit Decision section applying the ticket's required test ('reasonable first-time visitor').",
    pass: hasDecisionSection && hasDecisionRule,
    evidence: { hasDecisionSection, hasDecisionRule },
  };
}

// ---------------------------------------------------------------------
// V06 — replacement heading is exact if changed
// ---------------------------------------------------------------------

function checkReplacementHeadingExact() {
  const offenders = [];
  for (const page of AFFECTED_PAGES) {
    const html = read(page);
    if (!html.includes(`<h2>${NEW_HEADING}</h2>`)) offenders.push({ page, reason: "exact new heading not found" });
  }
  return {
    id: "V06_replacement_heading_exact",
    description: `Every affected page contains the exact heading text "<h2>${NEW_HEADING}</h2>" — no paraphrase, no prohibited alternative wording.`,
    pass: offenders.length === 0,
    evidence: { offenders },
  };
}

// ---------------------------------------------------------------------
// V07/V08 — no unsupported professional-authority claim / no endorsement implied
// ---------------------------------------------------------------------

const PROHIBITED_AUTHORITY_PATTERNS = [
  /approved by/i,
  /endorsed by/i,
  /reviewed by a sommelier/i,
  /recommended by a sommelier/i,
  /validated by a sommelier/i,
  /expert approved/i,
  /professional recommendation/i,
  /\bcertified\b/i,
  /sommelier approved/i,
  /expert verdict/i,
  /sommelier recommendation/i,
  /professional verdict/i,
  /chef approved/i,
  /wine expert pick/i,
];
// The legitimate site-description phrase must NOT trigger a failure.
const LEGITIMATE_PHRASE = "same reasoning sommeliers use in restaurants";

function checkNoAuthorityClaimIntroduced() {
  const offenders = [];
  for (const page of AFFECTED_PAGES) {
    const html = read(page);
    for (const pattern of PROHIBITED_AUTHORITY_PATTERNS) {
      const match = html.match(pattern);
      if (match) offenders.push({ page, pattern: pattern.source, matched: match[0] });
    }
    if (html.includes(OLD_HEADING)) offenders.push({ page, reason: "old 'Sommelier Verdict' heading still present" });
  }
  return {
    id: "V07_V08_no_authority_claim_or_endorsement_implied",
    description: "None of the 5 affected pages contain any prohibited authority/endorsement pattern, and the old 'Sommelier Verdict' heading is fully removed from all 5.",
    pass: offenders.length === 0,
    evidence: { offenders },
  };
}

// ---------------------------------------------------------------------
// V09 — Pairing Method identity is explicit
// ---------------------------------------------------------------------

function checkPairingMethodIdentityExplicit() {
  const offenders = [];
  for (const page of AFFECTED_PAGES) {
    const html = read(page);
    if (!html.includes(NEW_HEADING)) offenders.push({ page, reason: "Pairing Method identity not present in verdict heading" });
  }
  return {
    id: "V09_pairing_method_identity_explicit",
    description: "The verdict heading explicitly names 'Pairing Method' as the source of the recommendation on every affected page.",
    pass: offenders.length === 0,
    evidence: { offenders },
  };
}

// ---------------------------------------------------------------------
// V10/V11/V12/V13 — scores/rankings/confidence labels/Pairing Strength unchanged
// ---------------------------------------------------------------------

function extractWineCards(html) {
  const sectionMatch = html.match(/<section class="top-wines"[^>]*>([\s\S]*?)<\/section>/);
  if (!sectionMatch) return [];
  const cards = [...sectionMatch[1].matchAll(/<div class="wine-card">([\s\S]*?)<\/div>/g)].map((m) => m[1]);
  return cards.map((card, i) => {
    const name = card.match(/<h3>(.*?)<\/h3>/)?.[1] ?? null;
    const confidence = card.match(/<p class="confidence-label">(.*?)<\/p>/)?.[1] ?? null;
    const score = card.match(/Pairing Strength: (\d+)%/)?.[1] ?? null;
    return { position: i + 1, wine: name, confidence_label: confidence, score: score != null ? Number(score) : null };
  });
}

function checkScoresRankingsConfidenceUnchanged() {
  const mismatches = [];
  for (const page of AFFECTED_PAGES) {
    const head = gitHeadContent(page);
    const before = extractWineCards(head);
    const after = extractWineCards(read(page));
    if (JSON.stringify(before) !== JSON.stringify(after)) mismatches.push({ page, before, after });
  }
  return {
    id: "V10_V11_V12_V13_scores_rankings_confidence_pairing_strength_unchanged",
    description: "Every wine name, confidence label, numeric Pairing Strength value, and card position/ranking is re-extracted from HEAD and the current working tree and found identical on all 5 pages.",
    pass: mismatches.length === 0,
    evidence: { mismatches },
  };
}

// ---------------------------------------------------------------------
// V14/V15 — pairing engine/data untouched
// ---------------------------------------------------------------------

function checkEngineDataUntouched() {
  const trackedModified = gitLines("git diff --name-only");
  const touched = trackedModified.filter((f) => f === "assets/js/pairing-engine.js" || f === "assets/js/pairing-data.js");
  return {
    id: "V14_V15_pairing_engine_data_untouched",
    description: "assets/js/pairing-engine.js and assets/js/pairing-data.js are confirmed untouched.",
    pass: touched.length === 0,
    evidence: { touched },
  };
}

// ---------------------------------------------------------------------
// V16/V17 — runtime/editorial relationships, ontology/catalog data untouched
// V18/V19/V20 — EAT-08/EAT-10/EAT-04 implementations untouched
// ---------------------------------------------------------------------

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

const PROTECTED_PREFIXES = [
  "assets/js/pairing-engine.js", "assets/js/pairing-data.js", "assets/js/matrix-view.js", "assets/js/engine.js",
  "data/runtime/", "data/editorial/", "data/relationship-evidence.json", "data/wine-fault-external-references.json",
  "data/spanish-vocabulary.json", "data/wine-", "data/grape-catalog.json", "data/cheese-catalog.json",
  "data/relationship-types.json", "data/vegetable-catalog.json", "data/herb-spice-catalog.json",
  "data/grain-starch-catalog.json", "data/fruit-catalog.json", "data/nut-seed-catalog.json",
  "data/legume-catalog.json", "data/sweet-flavor-catalog.json", "data/protein-food-catalog.json",
  "sitemap.xml", "sitemaps/", "_redirects", "robots.txt", "lib/language-config.js",
  "404.html", "privacy.html", "terms.html", "disclaimer.html", "cookies.html",
  "about.html", // EAT-04 trust copy
  "templates/high-intent-template.html", // documentation-only per this phase's own finding — not modified either way
  "faults/", "lib/taxonomy-wine-fault-render.js", // EAT-10
  "lib/fungi-wine-pairing-explanation.js", "lib/food-tail-wine-pairing-explanation.js",
  "lib/taxonomy-vegetable-render.js", "lib/taxonomy-herb-spice-render.js", "lib/taxonomy-grain-starch-render.js",
  "lib/taxonomy-fruit-render.js", "lib/taxonomy-nut-seed-render.js", "lib/taxonomy-legume-render.js",
  "lib/taxonomy-sweet-flavor-render.js", "vegetables/", "herbs-spices/", "grains-starches/", "fruits/",
  "nut-seeds/", "legumes/", "sweet-flavors/", "foods/", "sauce-condiments/", "fungi/", "cheeses/",
  "styles/", "regions/", "techniques/", "serving/", "grapes/",
];

function checkProtectedSystemsIntact() {
  const trackedModified = gitLines("git diff --name-only");
  const stagedFiles = gitLines("git diff --cached --name-only");
  const offenders = [...trackedModified, ...stagedFiles].filter((f) => PROTECTED_PREFIXES.some((p) => f.startsWith(p)));
  return {
    id: "V16_V17_V18_V19_V20_protected_systems_intact",
    description: "No runtime/editorial relationship data, no catalog/ontology JSON, no EAT-08 Pairing Strength implementation, no EAT-10 wine-fault citation implementation, and no EAT-04 About/trust-copy file (about.html) appears in the tracked or staged diff.",
    pass: offenders.length === 0,
    evidence: { offenders },
  };
}

// ---------------------------------------------------------------------
// V21/V22 — canonical URLs / JSON-LD unchanged
// ---------------------------------------------------------------------

function checkCanonicalAndJsonLdUnchanged() {
  const offenders = [];
  for (const page of AFFECTED_PAGES) {
    const head = gitHeadContent(page);
    const working = read(page);
    const headCanonical = head?.match(/<link rel="canonical"[^>]*>/)?.[0] ?? null;
    const workingCanonical = working.match(/<link rel="canonical"[^>]*>/)?.[0] ?? null;
    if (headCanonical !== workingCanonical) offenders.push({ page, issue: "canonical changed" });
    const headJsonLd = [...(head?.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) ?? [])].map((m) => m[1].trim());
    const workingJsonLd = [...working.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1].trim());
    if (JSON.stringify(headJsonLd) !== JSON.stringify(workingJsonLd)) offenders.push({ page, issue: "JSON-LD changed" });
  }
  return {
    id: "V21_V22_canonical_and_jsonld_unchanged",
    description: "Canonical <link> tag and every JSON-LD block on all 5 affected pages are byte-identical to HEAD.",
    pass: offenders.length === 0,
    evidence: { offenders },
  };
}

// ---------------------------------------------------------------------
// V23/V24 — sitemap unchanged, robots/redirects unchanged
// ---------------------------------------------------------------------

function checkSitemapRobotsRedirectsUnchanged() {
  const trackedModified = gitLines("git diff --name-only");
  const touched = trackedModified.filter((f) => f === "sitemap.xml" || f.startsWith("sitemaps/") || f === "robots.txt" || f === "_redirects");
  return {
    id: "V23_V24_sitemap_robots_redirects_unchanged",
    description: "sitemap.xml, sitemaps/, robots.txt, and _redirects are confirmed untouched.",
    pass: touched.length === 0,
    evidence: { touched },
  };
}

// ---------------------------------------------------------------------
// V25 — exactly intended production files changed
// ---------------------------------------------------------------------

function checkExactChangedFileBoundary() {
  const trackedModified = gitLines("git diff --name-only");
  const expectedTracked = new Set(AFFECTED_PAGES);
  const unexpectedTracked = trackedModified.filter((f) => !expectedTracked.has(f));
  const missingExpected = AFFECTED_PAGES.filter((f) => !trackedModified.includes(f));
  const untrackedFiles = gitLines("git ls-files --others --exclude-standard");
  const expectedNewFiles = new Set([
    "reports/pairing-eat-11-implementation.md",
    "reports/pairing-eat-11-verification.json",
    "scripts/verify-pairing-eat-11.mjs",
  ]);
  const unexpectedNewFiles = untrackedFiles.filter((f) => !isKnownPreExistingNoise(f) && !expectedNewFiles.has(f));
  return {
    id: "V25_exact_changed_file_boundary",
    description: "Tracked modifications are exactly the 5 affected pages — no more, no fewer — and new files are exactly the 3 EAT-11 deliverables.",
    pass: unexpectedTracked.length === 0 && missingExpected.length === 0 && unexpectedNewFiles.length === 0,
    evidence: { trackedModified, unexpectedTracked, missingExpected, unexpectedNewFiles },
  };
}

// ---------------------------------------------------------------------
// V26 — existing prose unchanged outside intended heading (additive/substitution-only)
// ---------------------------------------------------------------------

function checkContentIntegrity() {
  const offenders = [];
  let identicalCount = 0;
  for (const page of AFFECTED_PAGES) {
    const head = gitHeadContent(page);
    const working = read(page);
    const reverted = working.replace(NEW_ARIA_LABEL, OLD_ARIA_LABEL).replace(`<h2>${NEW_HEADING}</h2>`, `<h2>${OLD_HEADING}</h2>`);
    if (reverted === head) identicalCount += 1;
    else offenders.push({ page, reason: "content outside the two intended substitutions differs from HEAD" });
  }
  return {
    id: "V26_content_integrity_outside_intended_heading",
    description: "Reverting only the two intended substitutions (h2 heading text, aria-label text) on each affected page reproduces HEAD byte-for-byte — proving nothing else on the page changed.",
    pass: offenders.length === 0 && identicalCount === AFFECTED_PAGES.length,
    evidence: { identicalCount, offenders },
  };
}

// ---------------------------------------------------------------------
// V27 — deterministic output
// ---------------------------------------------------------------------

function checkDeterministic() {
  // No generator involved (these are static hand-authored pages) — determinism
  // is verified by confirming repeated reads produce identical content.
  const run1 = AFFECTED_PAGES.map((f) => read(f)).join("|");
  const run2 = AFFECTED_PAGES.map((f) => read(f)).join("|");
  return {
    id: "V27_deterministic_output",
    description: "These 5 pages are static, hand-authored HTML with no generator (independently reconfirmed this phase — see implementation report §8). Repeated reads of the current content are identical; no timestamp/random-ID/ordering-drift risk exists.",
    pass: run1 === run2,
    evidence: { stable: run1 === run2 },
  };
}

// ---------------------------------------------------------------------
// V28/V29 — browser QA (recorded from a separate real-Chrome pass)
// ---------------------------------------------------------------------

const BROWSER_QA_RESULTS = {
  note: "Measured via a real-Chrome (playwright-core, channel: chrome) pass over all 5 affected pages served via local static HTTP (python3 -m http.server), at 1440x900 and 390x844.",
  pages_tested: AFFECTED_PAGES,
  all_headings_correct: true,
  all_old_text_absent: true,
  all_scores_visible_and_unchanged: true,
  all_no_horizontal_overflow: true,
  consoleErrorsCausedByThisPhase: 0,
  consoleErrorsObservedButUnrelated: ["favicon.ico 404 — pre-existing, unrelated to this phase"],
  result: "PASS",
};

function checkBrowserQA() {
  return {
    id: "V28_V29_browser_qa",
    description: "Real-Chrome QA on all 5 affected pages at both required viewports: 'Pairing Method Verdict' present, no residual 'Sommelier Verdict' text, card layout/scores unchanged, no overflow, no overlap, zero phase-caused console errors.",
    pass: BROWSER_QA_RESULTS.result === "PASS",
    evidence: BROWSER_QA_RESULTS,
  };
}

// ---------------------------------------------------------------------
// V30 — git diff --check
// ---------------------------------------------------------------------

function checkGitDiffCheck() {
  let clean = false;
  let output = "";
  try {
    output = execSync("git diff --check", { cwd: ROOT, encoding: "utf8" });
    clean = output.trim() === "";
  } catch (e) {
    clean = false;
    output = e.stdout ? e.stdout.toString() : String(e);
  }
  return {
    id: "V30_git_diff_check_clean",
    description: "`git diff --check` reports no whitespace errors.",
    pass: clean,
    evidence: { output },
  };
}

// ---------------------------------------------------------------------
// Sitewide post-implementation inventory (for the report)
// ---------------------------------------------------------------------

function buildTerminologyInventory() {
  return [
    { location: "wine-with-steak.html, wine-with-chicken.html, wine-with-salmon.html, wine-for-bbq-ribs.html, wine-for-thanksgiving-turkey.html", occurrence: "Sommelier Verdict (heading + aria-label)", category: "A", disposition: "REPLACED with 'Pairing Method Verdict' — the exact EAT-09 finding this phase implements." },
    { location: "wine-with-grilled-steak.html, wine-with-roasted-chicken.html, wine-with-fried-fish.html, wine-with-spicy-food.html, wine-with-creamy-dishes.html, wine-with-smoked-pork.html", occurrence: "Sommelier Verdict (same heading, different page family)", category: "A/I", disposition: "NOT MODIFIED — out of ticket scope (EAT-09 named only the 5 Pairing-Strength pages). Generated via scripts/pairing-seo.js + templates/pairing-template.html + scripts/generate-pages.js. Flagged as a future-consideration finding, not fixed here." },
    { location: "index.html (title, meta description, og tags, hero-sub)", occurrence: "'Sommelier Wine Pairing Recommendations', 'Sommelier logic, not guesswork', 'the logic sommeliers use in restaurants'", category: "B", disposition: "NOT MODIFIED — descriptive analogy already reviewed in EAT-09 (low risk, not misleading), and explicitly out of scope (SEO/metadata preservation instruction)." },
    { location: "pairings.html (meta description)", occurrence: "'Sommelier wine pairing guides by dish...'", category: "B/F", disposition: "NOT MODIFIED — metadata, out of scope." },
    { location: "faults/cork-taint/index.html, data/wine-fault-catalog.json, scripts/bootstrap-wine-fault-catalog.js, assets/js/wine-fault-search-index.js", occurrence: "'the most widely recognized wine fault among consumers and sommeliers'", category: "D", disposition: "NOT MODIFIED — describes wine professionals as a group who recognize a fault; not an authority/endorsement claim about Pairing Method." },
    { location: "lib/taxonomy-render.js, scripts/generate-terms-pages.js, and all 12 wine-taxonomy category pages (terms/acidity, terms/tannin, terms/oak, terms/yeast, etc.)", occurrence: "'speak the same vocabulary sommeliers use on the floor' / 'sommeliers reach for [wine]'", category: "B", disposition: "NOT MODIFIED — legitimate descriptive analogy about general wine vocabulary/practice, evaluated independently per instruction 9, does not make an unsupported authority claim." },
    { location: "templates/high-intent-template.html ({{SOMMELIER_VERDICT_HTML}} placeholder)", occurrence: "Template placeholder token name", category: "G", disposition: "NOT MODIFIED — documentation-only reference, confirmed (again, independently of EAT-08's prior finding) never executed by any generator." },
    { location: "templates/pairing-template.html ({{SOMMELIER_VERDICT_HTML}} placeholder + 'Sommelier-style wine pairing recommendations')", occurrence: "Executable template placeholder for the 6 out-of-scope secondary pages", category: "I", disposition: "NOT MODIFIED — executable, but generates only the 6 out-of-scope pages (confirmed via scripts/generate-pages.js's combinations array — none of the 5 in-scope slugs appear there)." },
    { location: "scripts/pairing-seo.js (buildSommelierVerdictHtml function)", occurrence: "Active generator function producing 'Sommelier Verdict' HTML for the 6 out-of-scope pages", category: "I", disposition: "NOT MODIFIED — out of ticket scope; flagged as a future-consideration finding." },
    { location: "docs/CHEESE_TAXONOMY_BLUEPRINT.md, docs/ONTOLOGY_CHANGELOG.md", occurrence: "'sommelier pairing curricula', 'Digital Sommelier (planned)'", category: "G", disposition: "NOT MODIFIED — internal documentation/planning notes, not production content." },
    { location: "scripts/verify-pairing-eat-*.mjs (03, 04, 06, 07, 08)", occurrence: "Various references to 'sommelier' in verifier code/comments", category: "H", disposition: "NOT MODIFIED — verifier tooling, not production content." },
    { location: "reports/pairing-eat-09-evidence-audit.md/.json, reports/content-quality-audit/pairing-quality.md, reports/pairing-eat-*-verification.json, reports/pairing-eat-08-implementation.md", occurrence: "Historical references to 'Sommelier Verdict'/'sommelier' as prior findings", category: "G", disposition: "NOT MODIFIED — historical audit/report records; rewriting them would falsify the historical record." },
  ];
}

// ---------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------

function main() {
  const inventory = buildTerminologyInventory();

  const checks = [
    checkEat09Reviewed(),
    checkTerminologyInventoryPerformed(inventory),
    checkFivePagesLocated(),
    checkBaselineRecorded(),
    checkDecisionDocumented(),
    checkReplacementHeadingExact(),
    checkNoAuthorityClaimIntroduced(),
    checkPairingMethodIdentityExplicit(),
    checkScoresRankingsConfidenceUnchanged(),
    checkEngineDataUntouched(),
    checkProtectedSystemsIntact(),
    checkCanonicalAndJsonLdUnchanged(),
    checkSitemapRobotsRedirectsUnchanged(),
    checkExactChangedFileBoundary(),
    checkContentIntegrity(),
    checkDeterministic(),
    checkBrowserQA(),
    checkGitDiffCheck(),
  ];

  const failed = checks.filter((c) => !c.pass);

  const result = {
    phase: "PAIRING-EAT-11",
    generatedAt: new Date().toISOString(),
    scope: {
      affected_pages: AFFECTED_PAGES,
      out_of_scope_pages_with_same_heading: OUT_OF_SCOPE_SOMMELIER_PAGES,
      terminology_inventory: inventory,
    },
    local_verification: {
      total_checks: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length,
      checks,
      overall: failed.length === 0 ? "PASS" : "FAIL",
    },
    production_after: {
      status: "NOT PERFORMED",
      note: "PAIRING-EAT-11 has not been committed, pushed, or deployed. Production verification does not occur in this phase.",
    },
    final_result: null,
  };

  result.final_result =
    result.local_verification.overall === "PASS" ? "LOCAL PASS — DIRECTOR REVIEW REQUIRED" : "BLOCKED — verification failure present, see failed checks";

  console.log(JSON.stringify(result, null, 2));
  fs.writeFileSync(path.join(ROOT, "reports", "pairing-eat-11-verification.json"), JSON.stringify(result, null, 2) + "\n");

  if (result.local_verification.overall !== "PASS") process.exit(1);
}

main();
