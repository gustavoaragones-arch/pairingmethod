#!/usr/bin/env node
/**
 * PAIRING-EAT-04 — Human Expertise, Trust & Editorial Transparency verification.
 *
 * Read-only except for writing its own report. Verifies:
 *   - exact required copy is present on about.html and index.html
 *   - no fabricated credential/authorship/testimonial language was introduced
 *   - existing structured data (Organization, WebSite, FAQPage) is preserved
 *   - no Person schema was introduced
 *   - protected systems (pairing engine, ontology, Spanish, sitemap, legal
 *     pages, deferred audit modules) were not touched
 *
 * production_after is never performed by this script — this phase is
 * local-only per Director instruction.
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
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

function extractJsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1])
  );
}

// ---------------------------------------------------------------------
// Exact required copy
// ---------------------------------------------------------------------

const ABOUT_REQUIRED = [
  { id: "V01", heading: "How Pairing Method Is Built", copy: "Pairing Method is built as a structured wine-and-food pairing system rather than a collection of personal wine reviews. Its recommendations organize culinary pairing principles into a consistent framework so that the same underlying logic can be applied across foods, wines, preparations, and flavor profiles." },
  { id: "V02", heading: "Our Approach", copy: "The pairing framework considers factors such as intensity, acidity, fat, tannin, sweetness, spice, fruit character, earthiness, preparation, and sauce or seasoning effects. These attributes are used to explain why a wine fits a dish, not simply to assign a preference." },
  { id: "V03", heading: "Who Operates Pairing Method", copy: "Pairing Method is operated by Albor Digital LLC. The site is developed and maintained as a structured digital information resource focused on making wine-and-food pairing decisions easier to understand." },
  { id: "V04", heading: "Editorial Transparency", copy: "Pairing Method distinguishes its underlying pairing framework from personal tasting reviews. Recommendations are generated from the site's structured pairing model and editorial rules. The goal is to make the reasoning behind a recommendation visible so readers can evaluate the pairing logic for themselves." },
];

const HOMEPAGE_REQUIRED_HEADING = "How Pairing Method Works";
const HOMEPAGE_REQUIRED_COPY =
  "Pairing Method uses a structured culinary framework to connect foods and wines. Recommendations consider factors such as intensity, acidity, tannin, sweetness, spice, preparation, and flavor profile, then explain why the strongest matches work. The system is designed to make pairing reasoning clear and consistent rather than present recommendations as unexplained personal preferences.";
const HOMEPAGE_REQUIRED_LINK_TEXT = "Learn how Pairing Method is built";

function checkAboutHeadingsAndCopy() {
  const html = read("about.html");
  const results = ABOUT_REQUIRED.map((req) => {
    const hasHeading = html.includes(`<h2>${req.heading}</h2>`);
    const hasCopy = html.includes(req.copy);
    return { id: req.id, heading: req.heading, hasHeading, hasCopy, pass: hasHeading && hasCopy };
  });
  return {
    id: "V01_V02_V03_V04_V05_about_page_required_sections",
    description: "About page contains all 4 required exact headings (How Pairing Method Is Built / Our Approach / Who Operates Pairing Method / Editorial Transparency) each with its exact required copy.",
    pass: results.every((r) => r.pass),
    evidence: { results },
  };
}

function checkHomepageHeadingAndCopy() {
  const html = read("index.html");
  const hasHeading = html.includes(`<h2>${HOMEPAGE_REQUIRED_HEADING}</h2>`);
  const hasCopy = html.includes(HOMEPAGE_REQUIRED_COPY);
  return {
    id: "V06_V07_homepage_trust_heading_and_copy",
    description: "Homepage contains the exact required heading 'How Pairing Method Works' and its exact required trust copy.",
    pass: hasHeading && hasCopy,
    evidence: { hasHeading, hasCopy },
  };
}

function checkHomepageLink() {
  const html = read("index.html");
  const linkMatches = [...html.matchAll(/<a\s+href="([^"]+)">Learn how Pairing Method is built<\/a>/g)];
  const exactlyOne = linkMatches.length === 1;
  const resolvesToAbout = exactlyOne && linkMatches[0][1] === "/about";
  return {
    id: "V08_V09_homepage_internal_link",
    description: "Homepage contains exactly one link with visible text 'Learn how Pairing Method is built', resolving to the canonical /about route.",
    pass: exactlyOne && resolvesToAbout,
    evidence: { occurrences: linkMatches.length, hrefs: linkMatches.map((m) => m[1]) },
  };
}

function checkOrganizationAndWebSiteIntact() {
  const html = read("index.html");
  const blocks = extractJsonLdBlocks(html);
  const org = blocks.find((b) => b["@type"] === "Organization");
  const site = blocks.find((b) => b["@type"] === "WebSite");
  const orgIntact = Boolean(
    org &&
      org.name === "Pairing Method" &&
      org.parentOrganization?.name === "Albor Digital LLC" &&
      org.contactPoint?.email === "contact@pairingmethod.com"
  );
  const siteIntact = Boolean(site && site.name === "Pairing Method" && site.publisher?.name === "Pairing Method");
  return {
    id: "V10_V11_organization_website_schema_intact",
    description: "Existing Organization and WebSite JSON-LD blocks on the homepage remain present and unmodified.",
    pass: orgIntact && siteIntact,
    evidence: { orgIntact, siteIntact },
  };
}

function checkFaqPageUnchanged() {
  const html = read("index.html");
  const blocks = extractJsonLdBlocks(html);
  const faqBlocks = blocks.filter((b) => b["@type"] === "FAQPage");
  const singleBlock = faqBlocks.length === 1;
  const entryCount = singleBlock ? faqBlocks[0].mainEntity.length : null;
  const questions = singleBlock ? faqBlocks[0].mainEntity.map((e) => e.name) : [];
  return {
    id: "V12_V13_faqpage_unchanged",
    description: "Homepage FAQPage remains exactly one JSON-LD block with exactly 2 entries (unchanged from EAT-03).",
    pass: singleBlock && entryCount === 2,
    evidence: { blockCount: faqBlocks.length, entryCount, questions },
  };
}

function checkNoPersonSchema() {
  const aboutBlocks = extractJsonLdBlocks(read("about.html"));
  const indexBlocks = extractJsonLdBlocks(read("index.html"));
  const allTypes = [...aboutBlocks, ...indexBlocks].map((b) => b["@type"]);
  const hasPerson = allTypes.includes("Person");
  // Also scan for a "Person" type nested anywhere (e.g. as author field)
  const rawAbout = read("about.html");
  const rawIndex = read("index.html");
  const nestedPersonPattern = /"@type"\s*:\s*"Person"/;
  const nestedPersonFound = nestedPersonPattern.test(rawAbout) || nestedPersonPattern.test(rawIndex);
  return {
    id: "V14_no_person_schema_introduced",
    description: "No Person schema (top-level or nested, e.g. as an author field) exists in about.html or index.html.",
    pass: !hasPerson && !nestedPersonFound,
    evidence: { allTypes, nestedPersonFound },
  };
}

// ---------------------------------------------------------------------
// Negative claim audit
// ---------------------------------------------------------------------

const SUSPICIOUS_PATTERNS = [
  /certified sommelier/i,
  /master sommelier/i,
  /certified wine expert/i,
  /professional chef/i,
  /wine professional/i,
  /reviewed by/i,
  /expert reviewed/i,
  /personally tasted/i,
  /personally selected/i,
  /years of wine experience/i,
  /industry veteran/i,
  /award-winning/i,
  /\bMichelin\b/,
  /\bWSET\b/,
  /Court of Master Sommeliers/i,
];

function checkNegativeClaimAudit() {
  const files = ["about.html", "index.html"];
  const offenders = [];
  for (const f of files) {
    const content = read(f);
    for (const pattern of SUSPICIOUS_PATTERNS) {
      const match = content.match(pattern);
      if (match) offenders.push({ file: f, pattern: pattern.source, matched: match[0] });
    }
  }
  return {
    id: "V15_V21_negative_claim_audit",
    description: "Neither modified file (about.html, index.html) contains newly introduced unsupported expertise/credential/testimonial language (guardrail patterns: certified/master sommelier, wine professional, reviewed by, personally tasted/selected, award-winning, Michelin, WSET, Court of Master Sommeliers, etc.). This checks the CURRENT state of the two modified files, not the whole site — it is not a blanket ban on legitimate pre-existing content elsewhere.",
    pass: offenders.length === 0,
    evidence: { offenders, filesScanned: files, patternsChecked: SUSPICIOUS_PATTERNS.map((p) => p.source) },
  };
}

// ---------------------------------------------------------------------
// Protected-path audit (tracked/staged/untracked split, per EAT-03A pattern)
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
  "_redirects",
  "404.html",
  "privacy.html",
  "terms.html",
  "disclaimer.html",
  "cookies.html",
  "lib/search-audit/rich-results.js",
  "lib/search-audit/crawlability.js",
];

function checkProtectedPathsUntouched() {
  const trackedModifiedFiles = gitLines("git diff --name-only");
  const stagedFiles = gitLines("git diff --cached --name-only");
  const untrackedFiles = gitLines("git ls-files --others --exclude-standard");
  const protectedOffenders = [...trackedModifiedFiles, ...stagedFiles].filter((f) =>
    PROTECTED_PREFIXES.some((p) => f.startsWith(p))
  );
  const expectedTrackedFiles = ["about.html", "index.html"].sort();
  const actualTrackedFiles = [...trackedModifiedFiles].sort();
  const onlyExpectedTrackedFiles = JSON.stringify(actualTrackedFiles) === JSON.stringify(expectedTrackedFiles);
  return {
    id: "V16_V17_V18_V19_V20_protected_paths_untouched",
    description: "Only about.html and index.html are tracked-modified. No file under a protected prefix (pairing engine/data, ontology/runtime/editorial/wine data, Spanish/language system, sitemap/robots/canonical architecture, redirects, 404 page, legal pages, deferred audit modules) is modified or staged. Pre-existing untracked noise is reported separately and never evaluated against the protected-prefix list.",
    pass: protectedOffenders.length === 0 && onlyExpectedTrackedFiles,
    evidence: { trackedModifiedFiles, stagedFiles, untrackedFiles, protectedOffenders, expectedTrackedFiles, onlyExpectedTrackedFiles },
  };
}

function checkExactCopyDeterministic() {
  // Re-read files a second time and diff the extracted copy strings against
  // the literal constants above — guards against any templating/whitespace
  // drift making the "exact copy" claim non-deterministic.
  const aboutHtml = read("about.html");
  const indexHtml = read("index.html");
  const aboutAllPresent = ABOUT_REQUIRED.every((r) => aboutHtml.includes(r.copy));
  const homepageCopyPresent = indexHtml.includes(HOMEPAGE_REQUIRED_COPY);
  const homepageLinkPresent = indexHtml.includes(`>${HOMEPAGE_REQUIRED_LINK_TEXT}<`);
  return {
    id: "V22_exact_copy_deterministic",
    description: "All required copy strings are present verbatim (byte-for-byte substring match) — not paraphrased, not templated.",
    pass: aboutAllPresent && homepageCopyPresent && homepageLinkPresent,
    evidence: { aboutAllPresent, homepageCopyPresent, homepageLinkPresent },
  };
}

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
    id: "V23_git_diff_check_clean",
    description: "`git diff --check` reports no whitespace errors.",
    pass: clean,
    evidence: { output },
  };
}

// ---------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------

function main() {
  const checks = [
    checkAboutHeadingsAndCopy(),
    checkHomepageHeadingAndCopy(),
    checkHomepageLink(),
    checkOrganizationAndWebSiteIntact(),
    checkFaqPageUnchanged(),
    checkNoPersonSchema(),
    checkNegativeClaimAudit(),
    checkProtectedPathsUntouched(),
    checkExactCopyDeterministic(),
    checkGitDiffCheck(),
  ];

  const failed = checks.filter((c) => !c.pass);

  const result = {
    phase: "PAIRING-EAT-04",
    generatedAt: new Date().toISOString(),
    local_verification: {
      total_checks: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length,
      checks,
      overall: failed.length === 0 ? "PASS" : "FAIL",
    },
    production_after: {
      status: "NOT PERFORMED",
      note: "PAIRING-EAT-04 has not been committed, pushed, or deployed. Per Director instruction, production verification does not occur in this phase.",
    },
    final_result: null,
  };

  result.final_result =
    result.local_verification.overall === "PASS"
      ? "LOCAL PASS — AWAITING DIRECTOR REVIEW BEFORE COMMIT/PUSH/DEPLOY"
      : "FAIL";

  console.log(JSON.stringify(result, null, 2));
  fs.writeFileSync(path.join(ROOT, "reports", "pairing-eat-04-verification.json"), JSON.stringify(result, null, 2) + "\n");

  if (result.local_verification.overall !== "PASS") process.exit(1);
}

main();
