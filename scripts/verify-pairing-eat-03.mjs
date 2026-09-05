#!/usr/bin/env node
/**
 * PAIRING-EAT-03 — P1 Route Integrity & FAQ Structured-Data Verification.
 * Hardened per PAIRING-EAT-03A (verification/reporting layer only — no
 * implementation change): /ads.txt reclassified as UNPUBLISHED_SPECIAL_ENDPOINT,
 * explicit expected-production route matrix added, protected-path detection
 * split into tracked/staged/untracked evidence, FAQ parity counts made
 * explicit, and the 404 check description now states plainly that it proves
 * a structural prerequisite only, never HTTP-status behavior.
 *
 * Read-only except for writing its own report. Verifies:
 *   P1-A: no homepage-200 fallback for unknown/unpublished routes (via a
 *         top-level 404.html that disables Cloudflare Pages' default SPA
 *         fallback), no wildcard/catch-all redirect or rewrite introduced,
 *         existing redirects/routes untouched.
 *   P1-B: homepage FAQPage JSON-LD entries have exact, visible counterparts
 *         in the homepage DOM, and vice versa.
 *
 * Local-only: this script cannot exercise Cloudflare Pages' actual edge
 * routing (that requires a live deploy). Where genuine HTTP-status
 * evidence is unavailable locally, this script says so explicitly rather
 * than asserting it. A `--production-before` flag additionally fetches the
 * CURRENTLY DEPLOYED (pre-EAT-03) production site read-only, to document
 * baseline bug reproduction; it never deploys anything.
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const ORIGIN = "https://pairingmethod.com";

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

// ---------------------------------------------------------------------
// Route inventory
// ---------------------------------------------------------------------

const ROUTE_INVENTORY = [
  { url: "/", class: "VALID_PUBLISHED_ROUTE", localFile: "index.html" },
  { url: "/about", class: "VALID_PUBLISHED_ROUTE", localFile: "about.html" },
  { url: "/pairings", class: "VALID_PUBLISHED_ROUTE", localFile: "pairings.html" },
  { url: "/nut-seeds/almond/", class: "VALID_PUBLISHED_ROUTE", localFile: "nut-seeds/almond/index.html" },
  { url: "/styles/riesling/", class: "VALID_PUBLISHED_ROUTE", localFile: "styles/riesling/index.html" },
  { url: "/terms/minerality", class: "VALID_PUBLISHED_ROUTE", localFile: "terms/minerality.html" },
  { url: "/robots.txt", class: "VALID_SPECIAL_ENDPOINT", localFile: "robots.txt" },
  { url: "/sitemap.xml", class: "VALID_SPECIAL_ENDPOINT", localFile: "sitemap.xml" },
  {
    url: "/ads.txt",
    class: "UNPUBLISHED_SPECIAL_ENDPOINT",
    localFile: "ads.txt",
    note: "No local ads.txt file exists before AdSense approval, and none should be fabricated — it requires a real publisher ID that does not exist yet. This is a correct, intentional absence, not a gap. It must never fall through to homepage HTML 200; intended production behavior is a genuine 404, identical to any other nonexistent resource.",
  },
  { url: "/foods/almonds/", class: "REDIRECT", localFile: null, redirectTarget: "/nut-seeds/almond/" },
  { url: "/terms/tannin", class: "REDIRECT", localFile: null, redirectTarget: "/terms/tannin/" },
  { url: "/es/", class: "UNPUBLISHED_RESERVED_ROUTE", localFile: null, note: "Spanish registered as vocabulary data (LANG-01/LANG-02) but explicitly published:false — see docs/LANGUAGE_GOVERNANCE.md. No /es/ directory exists." },
  { url: "/cheeses/brie-de-meaux/", class: "UNPUBLISHED_RESERVED_ROUTE", localFile: null, note: "Cheese domain built but published:false in lib/food-domain-config.js. Local-only untracked artifacts exist at cheeses/brie-de-meaux/ but are never committed, so are absent from the deployed repository entirely." },
  { url: "/contact", class: "UNKNOWN_NONEXISTENT_ROUTE", localFile: null, note: "Not a published route in this repository. Per the ticket, this phase does not invent a contact page — it must follow correct unpublished/unknown behavior (404), same as any nonexistent path." },
  { url: "/definitely-not-a-real-page-9f2c3", class: "UNKNOWN_NONEXISTENT_ROUTE", localFile: null },
  { url: "/definitely-not-a-real-page-9f2c3/", class: "UNKNOWN_NONEXISTENT_ROUTE", localFile: null },
];

// Explicit intended production HTTP behavior per route class. This is a
// specification only — it records what production SHOULD do, not evidence
// that it does. Actual HTTP-status confirmation requires a live deploy
// (see production_after in the report).
const EXPECTED_PRODUCTION_BEHAVIOR_BY_CLASS = {
  VALID_PUBLISHED_ROUTE: { expectedStatus: 200, expectedHomepageContent: false, note: "Serves its own real content." },
  VALID_SPECIAL_ENDPOINT: { expectedStatus: 200, expectedHomepageContent: false, note: "Endpoint-specific response (e.g. text/plain for robots.txt, application/xml for sitemap.xml) — not HTML homepage content." },
  REDIRECT: { expectedStatus: 301, expectedHomepageContent: false, note: "Redirects (301) to its governed target per _redirects; the target itself then serves 200." },
  UNPUBLISHED_RESERVED_ROUTE: { expectedStatus: 404, expectedHomepageContent: false, note: "Intentionally not published (e.g. Spanish, cheese) — must 404, must never silently serve homepage content." },
  UNKNOWN_NONEXISTENT_ROUTE: { expectedStatus: 404, expectedHomepageContent: false, note: "No published route exists at this path — must 404, must never silently serve homepage content." },
  UNPUBLISHED_SPECIAL_ENDPOINT: {
    expectedStatus: 404,
    expectedContentType: "null-or-not-applicable",
    expectedHomepageContent: false,
    note: "Correctly absent pre-approval special endpoint (currently only /ads.txt). No fabricated file, no fabricated publisher ID — the correct production behavior for a resource that legitimately does not exist yet is a genuine 404, never homepage HTML 200.",
  },
};

function checkRouteInventoryStructural() {
  const rows = ROUTE_INVENTORY.map((route) => {
    const fileExists = route.localFile ? exists(route.localFile) : null;
    let pass;
    if (route.class === "VALID_PUBLISHED_ROUTE") pass = fileExists === true;
    else if (route.class === "VALID_SPECIAL_ENDPOINT") pass = fileExists === true;
    else if (route.class === "UNPUBLISHED_SPECIAL_ENDPOINT") pass = fileExists === false;
    else if (route.class === "REDIRECT") pass = read("_redirects").includes(route.url) || read("_redirects").includes(route.url.replace(/\/$/, ""));
    else if (route.class === "UNPUBLISHED_RESERVED_ROUTE") {
      if (route.url === "/es/") pass = !exists("es");
      else if (route.url.startsWith("/cheeses/")) pass = !exists("cheeses/brie-de-meaux/index.html") || !isTrackedInGit("cheeses/brie-de-meaux/index.html");
      else pass = true;
    } else if (route.class === "UNKNOWN_NONEXISTENT_ROUTE") pass = fileExists !== true;
    const expected = EXPECTED_PRODUCTION_BEHAVIOR_BY_CLASS[route.class];
    return {
      ...route,
      fileExistsLocally: fileExists,
      structuralCheckPass: pass,
      expectedProduction: route.url === "/ads.txt" ? { expectedStatus: 404, expectedContentType: "null-or-not-applicable", expectedHomepageContent: false } : expected,
    };
  });
  return {
    id: "route_inventory_structural",
    description: "Every route in the inventory has a local file-presence state consistent with its declared class (existence proves VALID_PUBLISHED_ROUTE/VALID_SPECIAL_ENDPOINT; absence proves UNKNOWN/UNPUBLISHED/UNPUBLISHED_SPECIAL_ENDPOINT are not accidentally published). This check proves local file-presence state only — it does NOT prove production HTTP-status behavior; see production_after.",
    pass: rows.every((r) => r.structuralCheckPass),
    rows,
    expectedProductionBehaviorByClass: EXPECTED_PRODUCTION_BEHAVIOR_BY_CLASS,
  };
}

function isTrackedInGit(relPath) {
  try {
    execSync(`git ls-files --error-unmatch ${JSON.stringify(relPath)}`, { cwd: ROOT, stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------
// P1-A: 404.html presence / correctness, no catch-all introduced
// ---------------------------------------------------------------------

function check404PageExists() {
  const p = "404.html";
  const fileExists = exists(p);
  let hasNoindex = false;
  let hasHomepageCanonical = false;
  let hasTitle = false;
  if (fileExists) {
    const content = read(p);
    hasNoindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(content);
    hasHomepageCanonical = /<link\s+rel=["']canonical["']\s+href=["']https:\/\/pairingmethod\.com\/?["']/i.test(content);
    hasTitle = /<title>[^<]+<\/title>/i.test(content);
  }
  return {
    id: "P1A_404_page_structural_prerequisite",
    description:
      "STRUCTURAL PREREQUISITE ONLY: a top-level 404.html exists, is noindex, has its own title, and does not carry a canonical pointing back at the homepage. Per Cloudflare Pages' documented behavior, this file's presence is what DISABLES the default SPA-fallback-to-index.html mechanism — but this check only confirms the file is present and correctly authored. It does NOT execute a request against Cloudflare's edge and does NOT prove actual HTTP-status behavior in production. Local verification cannot certify HTTP status; only a post-deployment production check (see production_after) can confirm unmatched routes actually return 404 rather than 200.",
    pass: fileExists && hasNoindex && hasTitle && !hasHomepageCanonical,
    evidence: { fileExists, hasNoindex, hasTitle, hasHomepageCanonical },
    provesProductionHttpStatus: false,
  };
}

function checkNoCatchAllRedirectIntroduced() {
  const redirects = read("_redirects");
  const lines = redirects.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#"));
  const catchAllPatterns = [/^\/\*\s+\/index\.html\b/, /^\/\*\s+\/\s+200\b/, /^\/:[a-z]+\s+\/index\.html\b/i];
  const offenders = lines.filter((l) => catchAllPatterns.some((p) => p.test(l.trim())));
  return {
    id: "P1A_no_new_catchall_redirect",
    description: "No wildcard catch-all redirect/rewrite to index.html (e.g. `/* /index.html 200`) exists in _redirects.",
    pass: offenders.length === 0,
    evidence: { offenders },
  };
}

function checkNoRoutesJsonOrMiddlewareIntroduced() {
  const offenders = [];
  if (exists("_routes.json")) offenders.push("_routes.json");
  if (exists("functions")) offenders.push("functions/ (Pages Functions directory)");
  if (exists("_worker.js")) offenders.push("_worker.js");
  return {
    id: "P1A_no_new_routing_framework",
    description: "No new routing framework/mechanism (_routes.json, functions/, _worker.js) was introduced — the fix uses only Cloudflare Pages' existing static-site 404.html convention.",
    pass: offenders.length === 0,
    evidence: { offenders },
  };
}

function checkRedirectsFileUnchanged() {
  let diff = "";
  try {
    diff = execSync("git diff --name-only -- _redirects", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    diff = "ERROR";
  }
  return {
    id: "P1A_redirects_file_unchanged",
    description: "_redirects is byte-identical to HEAD — P1-A's fix does not touch existing redirect rules.",
    pass: diff === "",
    evidence: { gitDiffNameOnly: diff },
  };
}

// ---------------------------------------------------------------------
// P1-B: homepage FAQ JSON-LD <-> visible DOM parity
// ---------------------------------------------------------------------

function extractJsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1])
  );
}

function extractVisibleFaqItems(html) {
  const faqSectionMatch = html.match(/<section class="faq"[^>]*>([\s\S]*?)<\/section>/);
  if (!faqSectionMatch) return [];
  const section = faqSectionMatch[1];
  return [...section.matchAll(/<div class="faq-item">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<\/div>/g)].map(
    (m) => ({ question: m[1].trim(), answer: m[2].trim() })
  );
}

function checkFaqParity() {
  const html = read("index.html");
  const jsonLdBlocks = extractJsonLdBlocks(html);
  const faqPageBlocks = jsonLdBlocks.filter((b) => b["@type"] === "FAQPage");
  const visibleItems = extractVisibleFaqItems(html);

  const noDuplicateFaqPageBlocks = faqPageBlocks.length <= 1;
  const jsonLdEntries = faqPageBlocks.length === 1 ? faqPageBlocks[0].mainEntity : [];

  const jsonLdQuestions = jsonLdEntries.map((e) => e.name);
  const visibleQuestions = visibleItems.map((i) => i.question);

  const entriesWithoutVisibleCounterpart = jsonLdEntries.filter((e) => {
    const match = visibleItems.find((v) => v.question === e.name);
    return !match || match.answer !== e.acceptedAnswer.text;
  });

  const visibleWithoutJsonLdCounterpart = visibleItems.filter((v) => {
    const match = jsonLdEntries.find((e) => e.name === v.question);
    return !match || match.acceptedAnswer.text !== v.answer;
  });

  const pass =
    faqPageBlocks.length === 1 &&
    noDuplicateFaqPageBlocks &&
    entriesWithoutVisibleCounterpart.length === 0 &&
    visibleWithoutJsonLdCounterpart.length === 0 &&
    jsonLdEntries.length > 0;

  const jsonLdFaqCount = jsonLdEntries.length;
  const visibleFaqCount = visibleItems.length;
  const unmatchedJsonLdCount = entriesWithoutVisibleCounterpart.length;
  const unmatchedVisibleCount = visibleWithoutJsonLdCounterpart.length;
  const matchedFaqCount = jsonLdFaqCount - unmatchedJsonLdCount;

  return {
    id: "P1B_faq_jsonld_visible_parity",
    description: "Homepage FAQPage JSON-LD exists exactly once, every JSON-LD question+answer has an exact visible DOM counterpart (question text and answer text both match), and every visible FAQ item has a JSON-LD counterpart — zero entries on either side without a match.",
    pass,
    evidence: {
      faqPageBlockCount: faqPageBlocks.length,
      jsonLdQuestions,
      visibleQuestions,
      jsonLdFaqCount,
      visibleFaqCount,
      matchedFaqCount,
      unmatchedJsonLdCount,
      unmatchedVisibleCount,
      entriesWithoutVisibleCounterpart: entriesWithoutVisibleCounterpart.map((e) => e.name),
      visibleWithoutJsonLdCounterpart: visibleWithoutJsonLdCounterpart.map((v) => v.question),
    },
  };
}

function checkUnrelatedSchemaIntact() {
  const html = read("index.html");
  const jsonLdBlocks = extractJsonLdBlocks(html);
  const types = jsonLdBlocks.map((b) => b["@type"]);
  const hasOrganization = types.includes("Organization");
  const hasWebSite = types.includes("WebSite");
  const organizationBlock = jsonLdBlocks.find((b) => b["@type"] === "Organization");
  const orgIntact =
    hasOrganization &&
    organizationBlock.name === "Pairing Method" &&
    organizationBlock.parentOrganization?.name === "Albor Digital LLC" &&
    organizationBlock.contactPoint?.email === "contact@pairingmethod.com";
  return {
    id: "P1B_unrelated_schema_intact",
    description: "Organization and WebSite JSON-LD blocks remain present and unmodified — only FAQPage was touched.",
    pass: hasOrganization && hasWebSite && orgIntact,
    evidence: { types, orgIntact },
  };
}

// ---------------------------------------------------------------------
// Protected-path audit (git diff against HEAD)
// ---------------------------------------------------------------------

const PROTECTED_PREFIXES = [
  "data/runtime/",
  "data/editorial/",
  "data/spanish-vocabulary.json",
  "data/wine-",
  "data/grape-catalog.json",
  "data/cheese-catalog.json",
  "assets/js/pairing-engine.js",
  "assets/js/pairing-data.js",
  "assets/js/engine.js",
  "assets/js/matrix-view.js",
  "lib/language-",
  "sitemap.xml",
  "sitemaps/",
  "privacy.html",
  "terms.html",
  "disclaimer.html",
  "cookies.html",
];

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

function checkProtectedPathsUntouched() {
  // Precise, separated evidence — never conflates tracked EAT-03 changes
  // with pre-existing untracked noise the way a raw `git status --porcelain`
  // scan would.
  const trackedModifiedFiles = gitLines("git diff --name-only");
  const stagedFiles = gitLines("git diff --cached --name-only");
  const untrackedFiles = gitLines("git ls-files --others --exclude-standard");

  const protectedOffenders = [...trackedModifiedFiles, ...stagedFiles].filter((f) =>
    PROTECTED_PREFIXES.some((p) => f.startsWith(p))
  );

  return {
    id: "protected_paths_untouched",
    description:
      "No protected file (ontology/runtime/editorial/wine data, pairing engine, Spanish system, sitemap, legal pages) is modified (tracked) or staged. Evaluated ONLY against the actual EAT-03 tracked/staged diff — pre-existing untracked noise is reported separately below and is never treated as an EAT-03 modification, never evaluated against the protected-prefix list, and never deleted or altered by this check.",
    pass: protectedOffenders.length === 0,
    evidence: {
      trackedModifiedFiles,
      stagedFiles,
      untrackedFiles,
      protectedOffenders,
    },
  };
}

// ---------------------------------------------------------------------
// Production (read-only, BEFORE any EAT-03 deploy) — documents baseline
// ---------------------------------------------------------------------

async function fetchStatus(url) {
  try {
    const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "PairingMethod-EAT-03-Verification/1.0" } });
    const body = await res.text();
    const isHomepage = /<title>Sommelier Wine Pairing Recommendations \| Pairing Method<\/title>/.test(body);
    return { status: res.status, isHomepageContent: isHomepage, contentType: res.headers.get("content-type") };
  } catch (e) {
    return { status: null, error: String(e) };
  }
}

async function verifyProductionBefore() {
  const targets = [
    "/definitely-not-a-real-page-9f2c3",
    "/contact",
    "/ads.txt",
    "/es/",
    "/cheeses/brie-de-meaux/",
  ];
  const rows = [];
  for (const t of targets) {
    const r = await fetchStatus(`${ORIGIN}${t}`);
    rows.push({ url: t, ...r });
  }
  return {
    note: "Read-only fetch of the CURRENTLY DEPLOYED production site (pre-EAT-03, commit 549b5240) — documents the baseline bug this phase fixes. No deployment was performed to gather this evidence.",
    rows,
    baselineBugConfirmed: rows.some((r) => r.status === 200 && r.isHomepageContent),
  };
}

// ---------------------------------------------------------------------
// Deferred findings — explicitly NOT fixed in this phase (out of file scope)
// ---------------------------------------------------------------------

const DEFERRED_FINDINGS = [
  {
    file: "lib/search-audit/rich-results.js",
    finding: "FAQPage description text still references 3 authored Q&A pairs, including the removed authorship question ('Who writes the content').",
    currentState: "Homepage now intentionally contains 2 visible/JSON-LD FAQ entries, not 3.",
    disposition: "Stale descriptive metadata only — this is static prose, not a computed assertion, so it does not fail any check. Deferred to a separate maintenance cleanup. NOT modified in this phase.",
  },
  {
    file: "lib/search-audit/crawlability.js",
    finding: "soft_404_check hardcodes the claim that Cloudflare Pages' default behavior (absent a custom 404.html) already returned a genuine 404 status, not a soft-404.",
    currentState: "Authoritative Cloudflare Pages documentation (fetched directly, not assumed) confirms the OPPOSITE was true absent a 404.html: Cloudflare treats the site as an SPA and serves index.html with HTTP 200 for any unmatched path. This pre-existing incorrect assumption is very likely why this module's report diverged from live production evidence, as PAIRING-EAT-01 itself noted.",
    disposition: "Correction deferred until production 404 behavior is certified post-deployment. NOT modified in this phase — outside this ticket's authorized file scope (scripts/verify-pairing-eat-03.mjs and reports/pairing-eat-03-verification.json only).",
  },
];

// ---------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const includeProductionBefore = args.includes("--production-before");

  const checks = [
    checkRouteInventoryStructural(),
    check404PageExists(),
    checkNoCatchAllRedirectIntroduced(),
    checkNoRoutesJsonOrMiddlewareIntroduced(),
    checkRedirectsFileUnchanged(),
    checkFaqParity(),
    checkUnrelatedSchemaIntact(),
    checkProtectedPathsUntouched(),
  ];

  const failed = checks.filter((c) => !c.pass);

  const result = {
    phase: "PAIRING-EAT-03",
    generatedAt: new Date().toISOString(),
    local_verification: {
      total_checks: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length,
      checks,
      overall: failed.length === 0 ? "PASS" : "FAIL",
    },
    production_before: null,
    production_after: {
      status: "NOT PERFORMED",
      note: "PAIRING-EAT-03 has not been deployed. Per Director instruction, production verification of the fix must occur only after deployment. Do not treat this script's local PASS as a production certification.",
    },
    deferred_findings: DEFERRED_FINDINGS,
    final_result: null,
  };

  if (includeProductionBefore) {
    result.production_before = await verifyProductionBefore();
  }

  result.final_result = result.local_verification.overall === "PASS" ? "LOCAL PASS — PRODUCTION VERIFICATION PENDING DEPLOYMENT" : "FAIL";

  console.log(JSON.stringify(result, null, 2));
  fs.writeFileSync(path.join(ROOT, "reports", "pairing-eat-03-verification.json"), JSON.stringify(result, null, 2) + "\n");

  if (result.local_verification.overall !== "PASS") process.exit(1);
}

main();
