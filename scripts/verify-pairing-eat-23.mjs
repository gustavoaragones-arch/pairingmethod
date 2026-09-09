#!/usr/bin/env node
/**
 * PAIRING-EAT-23 / EAT-23A — Final AdSense Submission Readiness Audit
 * Fail-closed verifier — every PASS requires predicate === true.
 * AUDIT ONLY — no application modifications.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { getDomainConfig } from "../lib/food-domain-config.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ORIGIN = "https://pairingmethod.com";
const PRODUCTION_SHA = "2e65685ee251b0898a05f6a0a2b8dda1a45122d6";
const JSON_REPORT = path.join(ROOT, "reports/pairing-eat-23-verification.json");
const ALLOWED_TRACKED = new Set([
  "scripts/verify-pairing-eat-23.mjs",
  "reports/pairing-eat-23-verification.json",
  "reports/pairing-eat-23-implementation.md",
]);

const PROTECTED_GLOB = [
  "assets/js/pairing-engine.js",
  "assets/js/pairing-data.js",
  "assets/js/matrix-view.js",
  "lib/food-tail-evidence-provenance.js",
  "lib/food-tail-wine-pairing-explanation.js",
  "data/fruit-catalog.json",
  "data/legume-catalog.json",
  "sitemap.xml",
  "robots.txt",
  "_redirects",
  "index.html",
  "about.html",
  "privacy.html",
  "terms.html",
  "disclaimer.html",
  "404.html",
  "scripts/pairing-seo.js",
  "wine-with-grilled-steak.html",
  "wine-with-roasted-chicken.html",
  "wine-with-fried-fish.html",
  "wine-with-spicy-food.html",
  "wine-with-creamy-dishes.html",
  "wine-with-smoked-pork.html",
];

const GENERATED_SIX = [
  "wine-with-grilled-steak.html",
  "wine-with-roasted-chicken.html",
  "wine-with-fried-fish.html",
  "wine-with-spicy-food.html",
  "wine-with-creamy-dishes.html",
  "wine-with-smoked-pork.html",
];

const EAT11_FIVE = [
  "wine-with-steak.html",
  "wine-with-chicken.html",
  "wine-with-salmon.html",
  "wine-for-bbq-ribs.html",
  "wine-for-thanksgiving-turkey.html",
];

const FOOD_TAIL_DIRS = ["fruits", "legumes", "nut-seeds", "sweet-flavors"];
const GOV_RE = /\bper [A-Z][A-Z0-9-]*-\d+\b/;
const MIN_LIVE_WORDS = 25;

const CANONICAL_FIXTURES = {
  "index.html": "https://pairingmethod.com/",
  "about.html": "https://pairingmethod.com/about",
  "fruits/avocado/index.html": "https://pairingmethod.com/fruits/avocado/",
  "wine-with-steak.html": "https://pairingmethod.com/wine-with-steak",
};

const EXCLUDED_HTML_PREFIXES = [
  "cheeses/",
  "cheese-groups/",
  "cheese-categories/",
  "dist/cheeses/",
  "dist/cheese-groups/",
  "dist/cheese-categories/",
  "reports/",
];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}
function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}
function sha256(rel) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");
}
function collectProtectedHashes() {
  const hashes = {};
  for (const rel of PROTECTED_GLOB) {
    if (exists(rel)) hashes[rel] = sha256(rel);
  }
  for (const f of fs.readdirSync(path.join(ROOT, "data/runtime"))) {
    if (f.endsWith(".json")) hashes[`data/runtime/${f}`] = sha256(`data/runtime/${f}`);
  }
  return hashes;
}
function locsFromXml(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function extractMainHtml(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  return main.replace(/<header[\s\S]*?<\/header>/gi, " ").replace(/<footer[\s\S]*?<\/footer>/gi, " ").replace(/<nav[\s\S]*?<\/nav>/gi, " ");
}
function substantiveWords(html) {
  const paras = [...extractMainHtml(html).matchAll(/<(p|li|dd|dt|h2|h3)[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((m) => stripTags(m[2]).trim())
    .filter((t) => t.length >= 20);
  return paras.join(" ").split(/\s+/).filter(Boolean).length;
}
function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : "";
}
function extractCanonical(html) {
  return html.match(/rel="canonical" href="([^"]+)"/)?.[1] ?? "";
}
function isHomepageFallback(html) {
  return /Pairing Method home/i.test(html) && !/<h1/i.test(html);
}
function curlStatus(url, follow = true) {
  try {
    const args = ["-sI", "-o", "/dev/null", "-w", "%{http_code}"];
    if (follow) args.push("-L");
    args.push(url);
    return Number(execFileSync("curl", args, { encoding: "utf8", timeout: 20000 }).trim());
  } catch {
    return null;
  }
}
function curlBody(url) {
  try {
    return execFileSync("curl", ["-sL", "-A", "PAIRING-EAT-23-audit", url], { encoding: "utf8", timeout: 30000 });
  } catch {
    return null;
  }
}
function pathnameHash(url) {
  return crypto.createHash("md5").update(url).digest("hex").slice(0, 8);
}
function isExcludedPublishedHtml(rel) {
  return EXCLUDED_HTML_PREFIXES.some((p) => rel.startsWith(p));
}

const checks = [];
const materialBlockers = [];
const nonMaterialNotes = [];

/** Fail-closed: PASS only when condition is strictly true. */
function assertPass(condition, id, category, description, evidence = {}, method = "AUTOMATED", severity = "P1") {
  if (condition === true) {
    checks.push({ id, category, description, result: "PASS", method, evidence });
    return true;
  }
  checks.push({ id, category, description, result: "FAIL", method, evidence: { ...evidence, predicate: false } });
  materialBlockers.push({ id, severity, description, evidence });
  return false;
}

function assertEq(actual, expected, id, category, description, evidence = {}, method = "AUTOMATED", severity = "P1") {
  return assertPass(actual === expected, id, category, description, { ...evidence, actual, expected }, method, severity);
}

function manual(id, category, description, evidence = {}) {
  checks.push({ id, category, description, result: "MANUAL_REVIEW_REQUIRED", method: "MANUAL_REVIEW", evidence });
}

/** P2: record observed fact only; policy interpretation is Director-facing, not verifier-proven. */
function observeP2(id, category, description, observedFact, directorNote) {
  const evidence = {
    observed_fact: observedFact,
    director_classification_note: directorNote,
    verifier_proves_materiality: false,
  };
  checks.push({ id, category, description, result: "NON_MATERIAL_NOTE", method: "DIRECTOR_CLASSIFICATION", evidence });
  nonMaterialNotes.push({ id, description, evidence });
}

function runAudit() {
  checks.length = 0;
  materialBlockers.length = 0;
  nonMaterialNotes.length = 0;

  const PROTECTED_HASHES_START = collectProtectedHashes();

  // --- Baseline SHA (explicit triple equality) ---
  const head = execSync("git rev-parse HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  const originMain = execSync("git rev-parse origin/main", { cwd: ROOT, encoding: "utf8" }).trim();
  assertEq(head, PRODUCTION_SHA, "BASE_head_equals_production_sha", "baseline", "git HEAD === PRODUCTION_SHA.");
  assertEq(originMain, PRODUCTION_SHA, "BASE_origin_main_equals_production_sha", "baseline", "origin/main === PRODUCTION_SHA.");
  assertEq(head, originMain, "BASE_head_equals_origin_main", "baseline", "HEAD === origin/main.");

  // --- Core live HTTP ---
  const CORE_LIVE = [
    { path: "/", label: "homepage", expected: 200 },
    { path: "/about", label: "about", expected: 200 },
    { path: "/privacy", label: "privacy", expected: 200 },
    { path: "/terms", label: "terms", expected: 200 },
    { path: "/disclaimer", label: "disclaimer", expected: 200 },
    { path: "/pairings/", label: "pairings_hub", expected: 200 },
    { path: "/wine-with-steak/", label: "steak_guide", expected: 200 },
    { path: "/wine-with-chicken/", label: "chicken_guide", expected: 200 },
    { path: "/wine-with-salmon/", label: "salmon_guide", expected: 200 },
    { path: "/wine-for-bbq-ribs/", label: "bbq_ribs", expected: 200 },
    { path: "/wine-for-thanksgiving-turkey/", label: "thanksgiving", expected: 200 },
    { path: "/robots.txt", label: "robots", expected: 200 },
    { path: "/sitemap.xml", label: "sitemap", expected: 200 },
  ];
  for (const t of CORE_LIVE) {
    const url = `${ORIGIN}${t.path}`;
    const status = curlStatus(url);
    assertEq(status, t.expected, `HTTP_${t.label}`, "live_production_http", `${url} returns ${t.expected}.`, { url }, "LIVE_HTTP");
  }

  // --- Representative live pages ---
  const REP_LIVE = [
    { path: "/foods/salmon-fillet/", domain: "protein" },
    { path: "/vegetables/asparagus/", domain: "vegetable" },
    { path: "/herbs-spices/basil/", domain: "herb_spice" },
    { path: "/grains-starches/quinoa/", domain: "grain_starch" },
    { path: "/fruits/avocado/", domain: "fruit" },
    { path: "/nut-seeds/walnut/", domain: "nut_seed" },
    { path: "/legumes/chickpea/", domain: "legume" },
    { path: "/sweet-flavors/honey/", domain: "sweet_flavor" },
    { path: "/fungi/shiitake/", domain: "fungi" },
    { path: "/styles/pinot-noir/", domain: "wine_style" },
    { path: "/faults/cork-taint/", domain: "wine_fault" },
    { path: "/grapes/pinot-noir", domain: "grape" },
    { path: "/techniques/carbonic-maceration/", domain: "technique" },
    { path: "/regions/burgundy/", domain: "region" },
    { path: "/seasonal-wine-guides", domain: "seasonal" },
    { path: "/terms/tannin/", domain: "term" },
  ];
  for (const t of REP_LIVE) {
    const url = `${ORIGIN}${t.path}`;
    const status = curlStatus(url);
    assertEq(status, 200, `HTTP_rep_${t.domain}`, "live_production_http", `Representative ${t.domain} returns 200.`, { url }, "LIVE_HTTP");
    const body = curlBody(url);
    const title = body ? extractTitle(body) : "";
    const canonical = body ? extractCanonical(body) : "";
    const words = body ? substantiveWords(body) : 0;
    assertPass(title.length > 0, `CONTENT_rep_${t.domain}_title`, "live_content_quality", `${t.path} title non-empty.`, { url, titleLength: title.length }, "LIVE_HTTP");
    assertPass(canonical.length > 0, `CONTENT_rep_${t.domain}_canonical`, "live_content_quality", `${t.path} canonical present.`, { url, canonical }, "LIVE_HTTP");
    assertPass(words >= MIN_LIVE_WORDS, `CONTENT_rep_${t.domain}_substance`, "live_content_quality", `${t.path} substantive words >= ${MIN_LIVE_WORDS}.`, { url, words, threshold: MIN_LIVE_WORDS }, "LIVE_HTTP");
    assertPass(!(body && isHomepageFallback(body)), `CONTENT_rep_${t.domain}_no_fallback`, "live_content_quality", `${t.path} not homepage fallback.`, { url }, "LIVE_HTTP");
  }

  // --- Alias routes ---
  for (const t of [
    { path: "/pairing-guides/", expected: 404, note: "Hub at /pairings/" },
    { path: "/contact", expected: 404, note: "Contact via mailto on legal pages" },
  ]) {
    const status = curlStatus(`${ORIGIN}${t.path}`);
    assertEq(status, t.expected, `HTTP_alias_${t.path.replace(/\//g, "_")}`, "live_production_http", `${t.path} returns ${t.expected}.`, { note: t.note }, "LIVE_HTTP");
  }

  // --- Error routes (HTTP predicate honest; ads.txt non-blocking is Director classification) ---
  const ERROR_ROUTES = [
    { path: "/this-route-does-not-exist-eat23", expected: 404 },
    { path: "/contact-invalid-test", expected: 404 },
    { path: "/es/", expected: 404 },
    { path: "/cheeses/", expected: 404 },
    { path: "/ads.txt", expected: 404 },
  ];
  for (const t of ERROR_ROUTES) {
    const status = curlStatus(`${ORIGIN}${t.path}`);
    assertEq(status, t.expected, `ERR_${pathnameHash(t.path)}`, "error_route_behavior", `${t.path} returns ${t.expected}.`, {
      ads_txt_intentionally_inactive: t.path === "/ads.txt",
    }, "LIVE_HTTP");
  }

  // --- Sitemap / publication ---
  const sitemapIndex = read("sitemap.xml");
  const childSitemapLocs = locsFromXml(sitemapIndex);
  let sitemapUrlTotal = 0;
  const allSitemapUrls = childSitemapLocs.flatMap((loc) => {
    const rel = loc.replace(`${ORIGIN}/`, "");
    if (!exists(rel)) return [];
    const urls = locsFromXml(read(rel));
    sitemapUrlTotal += urls.length;
    return urls;
  });
  const cheeseInIndex = childSitemapLocs.filter((u) => /cheese/i.test(u)).length;
  const esInSitemap = allSitemapUrls.filter((u) => /\/es\//.test(u)).length;
  const duplicateSitemapUrls = allSitemapUrls.length - new Set(allSitemapUrls).size;

  assertEq(childSitemapLocs.length, 31, "INV_sitemap_children", "publication_integrity", "Child sitemap count === 31.", { childSitemapLocs: childSitemapLocs.length });
  assertEq(sitemapUrlTotal, 1441, "INV_sitemap_urls", "publication_integrity", "Total sitemap URLs === 1441.", { sitemapUrlTotal });
  assertEq(cheeseInIndex, 0, "INV_no_cheese_sitemap", "publication_integrity", "Zero cheese child sitemaps in index.", { cheeseInIndex });
  assertEq(esInSitemap, 0, "INV_no_es_sitemap", "publication_integrity", "Zero /es/ URLs in sitemap union.", { esInSitemap });
  assertEq(duplicateSitemapUrls, 0, "SMAP_no_duplicates", "publication_integrity", "Zero duplicate sitemap URLs.", { duplicateSitemapUrls });

  const robots = read("robots.txt");
  assertPass(robots.includes("Sitemap: https://pairingmethod.com/sitemap.xml"), "ROBOTS_sitemap_ref", "publication_integrity", "robots.txt sitemap directive present.", { present: robots.includes("Sitemap: https://pairingmethod.com/sitemap.xml") });
  assertPass(/^Allow: \//m.test(robots), "ROBOTS_allow_root", "publication_integrity", "robots.txt allows root.", { present: /^Allow: \//m.test(robots) });

  const prodRobots = curlBody(`${ORIGIN}/robots.txt`);
  const prodSitemap = curlBody(`${ORIGIN}/sitemap.xml`);
  assertPass(prodRobots === robots, "SMAP_live_robots_match", "publication_integrity", "Production robots.txt === repo.", { match: prodRobots === robots }, "LIVE_HTTP");
  assertPass(prodSitemap === sitemapIndex, "SMAP_live_sitemap_match", "publication_integrity", "Production sitemap.xml === repo.", { match: prodSitemap === sitemapIndex }, "LIVE_HTTP");

  for (const [rel, expectedCanon] of Object.entries(CANONICAL_FIXTURES)) {
    const actual = extractCanonical(read(rel));
    assertEq(actual, expectedCanon, `CANON_${rel.replace(/[/.]/g, "_")}`, "publication_integrity", `${rel} canonical matches fixture.`, { actual, expectedCanon });
  }

  // --- EAT-05 samples ---
  const EAT05_SAMPLES = [
    { name: "fruit", sample: "fruits/avocado/index.html", minWords: 40 },
    { name: "fungi", sample: "fungi/button-mushroom/index.html", minWords: 80 },
    { name: "vegetable", sample: "vegetables/asparagus/index.html", minWords: 40 },
    { name: "protein", sample: "foods/salmon-fillet/index.html", minWords: 80 },
    { name: "wine_style", sample: "styles/pinot-noir/index.html", minWords: 60 },
    { name: "grain", sample: "grains-starches/quinoa/index.html", minWords: 40 },
    { name: "herb", sample: "herbs-spices/basil/index.html", minWords: 40 },
    { name: "legume", sample: "legumes/chickpea/index.html", minWords: 40 },
  ];
  for (const fam of EAT05_SAMPLES) {
    const html = read(fam.sample);
    const words = substantiveWords(html);
    const title = extractTitle(html);
    const canonical = extractCanonical(html);
    assertPass(words >= fam.minWords, `EAT05_${fam.name}_words`, "content_quality", `${fam.sample} words >= ${fam.minWords}.`, { words, minWords: fam.minWords });
    assertPass(title.length > 0, `EAT05_${fam.name}_title`, "content_quality", `${fam.sample} has title.`, { titleLength: title.length });
    assertPass(canonical.length > 0, `EAT05_${fam.name}_canonical`, "content_quality", `${fam.sample} has canonical.`, { canonical });
    assertPass(!isHomepageFallback(html), `EAT05_${fam.name}_no_fallback`, "content_quality", `${fam.sample} not homepage fallback.`, { file: fam.sample });
  }

  assertPass(!exists("es"), "CONTENT_no_spanish_dir", "content_quality", "No /es/ directory.", { esDirExists: exists("es") });
  assertPass(getDomainConfig("cheese").published === false, "CONTENT_no_cheese_published", "content_quality", "Cheese domain unpublished.", { published: getDomainConfig("cheese").published });

  // --- Legal / trust ---
  const disclaimer = read("disclaimer.html");
  const privacy = read("privacy.html");
  const terms = read("terms.html");
  const about = read("about.html");
  const indexHtml = read("index.html");

  assertPass(/registered in the State of Wyoming, United States/i.test(disclaimer), "LEGAL_disclaimer_wyoming", "trust_legal", "Disclaimer Wyoming operator wording.", { matched: /registered in the State of Wyoming, United States/i.test(disclaimer) });
  assertPass(!/operated from Canada and the United States/i.test(disclaimer), "LEGAL_disclaimer_no_canada_us", "trust_legal", "Disclaimer lacks Canada/US contradiction.", { matched: /operated from Canada and the United States/i.test(disclaimer) });
  assertPass(/This Privacy Policy applies to Pairing Method/i.test(privacy), "LEGAL_privacy_intro", "trust_legal", "Privacy intro corrected.", { matched: /This Privacy Policy applies to Pairing Method/i.test(privacy) });
  assertPass(!privacy.includes("These terms apply"), "LEGAL_privacy_no_terms_intro", "trust_legal", "Privacy lacks Terms-style intro.", { containsWrongIntro: privacy.includes("These terms apply") });
  assertPass(/contact@pairingmethod\.com/.test(terms), "LEGAL_terms_contact", "trust_legal", "Terms contact email.", { matched: /contact@pairingmethod\.com/.test(terms) });
  assertPass(/contact@pairingmethod\.com/.test(about), "LEGAL_about_contact", "trust_legal", "About contact email.", { matched: /contact@pairingmethod\.com/.test(about) });
  assertPass(/contact@pairingmethod\.com/.test(privacy), "LEGAL_privacy_contact", "trust_legal", "Privacy contact email.", { matched: /contact@pairingmethod\.com/.test(privacy) });

  for (const heading of ["How Pairing Method Is Built", "Our Approach", "Who Operates Pairing Method", "Editorial Transparency"]) {
    assertPass(about.includes(heading), `TRUST_about_${heading.replace(/\s+/g, "_")}`, "trust_legal", `About contains '${heading}'.`, { heading, present: about.includes(heading) });
  }
  assertPass(/"addressRegion": "Wyoming"/.test(disclaimer), "TRUST_org_schema_wyoming", "trust_legal", "Disclaimer Organization schema Wyoming.", { matched: /"addressRegion": "Wyoming"/.test(disclaimer) });
  assertPass(/AI-Generated Content/i.test(disclaimer), "TRUST_ai_disclosure", "trust_legal", "Disclaimer AI section.", { matched: /AI-Generated Content/i.test(disclaimer) });
  for (const p of ["privacy.html", "terms.html", "disclaimer.html"]) {
    assertPass(/2026/.test(read(p)), `LEGAL_${p}_dated`, "trust_legal", `${p} has 2026 date.`, { matched: /2026/.test(read(p)) });
  }

  // --- Live legal ---
  const liveDisclaimer = curlBody(`${ORIGIN}/disclaimer`);
  const livePrivacy = curlBody(`${ORIGIN}/privacy`);
  assertPass(Boolean(liveDisclaimer && /registered in the State of Wyoming, United States/i.test(liveDisclaimer)), "LIVE_LEGAL_disclaimer_wyoming", "live_trust_legal", "Production disclaimer Wyoming.", {}, "LIVE_HTTP");
  assertPass(Boolean(livePrivacy && /This Privacy Policy applies to Pairing Method/i.test(livePrivacy)), "LIVE_LEGAL_privacy_intro", "live_trust_legal", "Production privacy intro.", {}, "LIVE_HTTP");
  assertPass(Boolean(livePrivacy && !livePrivacy.includes("These terms apply")), "LIVE_LEGAL_privacy_no_terms", "live_trust_legal", "Production privacy lacks wrong intro.", {}, "LIVE_HTTP");

  // --- Authority framing ---
  for (const p of GENERATED_SIX) {
    const html = read(p);
    assertPass(html.includes("Pairing Method Verdict"), `AUTH_${p}_pmv`, "authority_framing", `${p} Pairing Method Verdict present.`, { present: html.includes("Pairing Method Verdict") });
    assertPass(!html.includes("<h2>Sommelier Verdict</h2>"), `AUTH_${p}_no_som_h2`, "authority_framing", `${p} lacks Sommelier Verdict h2.`, { present: html.includes("<h2>Sommelier Verdict</h2>") });
  }
  for (const p of EAT11_FIVE) {
    const html = read(p);
    assertPass(html.includes("Pairing Method Verdict"), `AUTH_${p}_pmv`, "authority_framing", `${p} Pairing Method Verdict present.`, { present: html.includes("Pairing Method Verdict") });
  }
  const sommelierH2Count = [...GENERATED_SIX, ...EAT11_FIVE].filter((p) => read(p).includes("<h2>Sommelier Verdict</h2>")).length;
  assertEq(sommelierH2Count, 0, "AUTH_zero_sommelier_verdict_h2", "authority_framing", "Zero Sommelier Verdict h2 across scoped guides.", { sommelierH2Count });

  const badPersonSchema = /"@type": "Person"/.test(about) && /reviewer|sommelier/i.test(about);
  assertPass(!badPersonSchema, "AUTH_no_person_reviewer_schema", "authority_framing", "No Person reviewer schema on About.", { badPersonSchema });

  for (const p of GENERATED_SIX) {
    const slug = p.replace(".html", "");
    const body = curlBody(`${ORIGIN}/${slug}`);
    assertPass(Boolean(body && body.includes("Pairing Method Verdict")), `LIVE_AUTH_${slug}_pmv`, "live_authority_framing", `Production ${slug} PMV.`, {}, "LIVE_HTTP");
    assertPass(Boolean(body && !body.includes("<h2>Sommelier Verdict</h2>")), `LIVE_AUTH_${slug}_no_som`, "live_authority_framing", `Production ${slug} no Sommelier h2.`, {}, "LIVE_HTTP");
  }

  // --- P2 observed facts (Director classification separate) ---
  observeP2(
    "P2_HOME_01_sommelier_title",
    "p2_review",
    "Homepage title/meta references Sommelier.",
    { titleContainsSommelier: /Sommelier/i.test(extractTitle(indexHtml)) },
    "Director classifies as non-material: descriptive methodology SEO framing, not credentialed human endorsement claim.",
  );
  observeP2(
    "P2_QUAR_01_unfiltered_links",
    "p2_review",
    "Food-tail pages may list wine-style links from unfiltered runtime graph.",
    { evidenceProseSuppressedByEAT07: true, whyTheseWinesSectionsInHtml: 0 },
    "Director classifies as non-material while EAT-07 prose quarantine remains active.",
  );
  observeP2(
    "P2_LEGAL_03_boilerplate",
    "p2_review",
    "Disclaimer §4 contains shared Albor market-data boilerplate.",
    { section4ContainsMarketDataLanguage: /market data|rental indices|comparative statistics/i.test(disclaimer) },
    "Director classifies as non-material; operator identity and AI disclosure remain clear.",
  );

  // --- Quarantine ---
  let ftPages = 0;
  let ftWhy = 0;
  let ftGov = 0;
  for (const dir of FOOD_TAIL_DIRS) {
    for (const ent of fs.readdirSync(path.join(ROOT, dir))) {
      const p = path.join(dir, ent, "index.html");
      if (!exists(p)) continue;
      ftPages += 1;
      const html = read(p);
      if (/Why These Wines Work/i.test(html)) ftWhy += 1;
      if (GOV_RE.test(html)) ftGov += 1;
    }
  }
  assertPass(ftPages >= 350, "QZ_food_tail_pages", "quarantine_safety", "Food-tail pages >= 350.", { ftPages, min: 350 });
  assertEq(ftWhy, 0, "QZ_zero_why_sections", "quarantine_safety", "Why These Wines Work count === 0.", { ftWhy });
  assertEq(ftGov, 0, "QZ_zero_governance_html", "quarantine_safety", "Governance string count === 0.", { ftGov });

  let runtimeTotal = 0;
  for (const d of ["fruit", "nut-seed", "legume", "sweet-flavor"]) {
    const rel = JSON.parse(read(`data/runtime/${d}-wine-relationships.json`));
    runtimeTotal += (Array.isArray(rel) ? rel : rel.relationships || rel.edges || []).length;
  }
  assertEq(runtimeTotal, 873, "QZ_873_runtime_edges", "quarantine_safety", "Runtime edge total === 873.", { runtimeTotal });

  for (const dir of FOOD_TAIL_DIRS) {
    const sample = path.join(dir, fs.readdirSync(path.join(ROOT, dir))[0], "index.html");
    if (!exists(sample)) continue;
    const slug = dir.replace(/-/g, "_");
    const hasWhy = /Why These Wines Work/i.test(read(sample));
    assertPass(!hasWhy, `QZ_live_${slug}_no_why`, "quarantine_safety", `${sample} lacks Why These Wines Work.`, { hasWhy });
  }

  // --- Policy risk (spot checks, not exhaustive certification) ---
  const rootHtmlAdsHits = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html") && /adsbygoogle|googlesyndication/i.test(read(f))).length;
  assertEq(rootHtmlAdsHits, 0, "POLICY_no_adsbygoogle_root", "policy_risk", "Root HTML adsbygoogle hits === 0.", { rootHtmlAdsHits });
  assertPass(!/document\.write\(|eval\(|\.exe["']/i.test(indexHtml), "POLICY_no_malware_patterns", "policy_risk", "Homepage lacks malware patterns.", { matched: /document\.write\(|eval\(|\.exe["']/i.test(indexHtml) });
  assertPass(!/casino|buy viagra|firearms dealer/i.test(indexHtml), "POLICY_no_prohibited_homepage", "policy_risk", "Homepage lacks prohibited category signals.", { matched: /casino|buy viagra|firearms dealer/i.test(indexHtml) });

  // --- AdSense inactive ---
  assertPass(!exists("ads.txt"), "ADS_no_local_ads_txt", "adsense_state", "ads.txt absent locally.", { exists: exists("ads.txt") });
  assertPass(!/ca-pub-/i.test(indexHtml), "ADS_no_publisher_id", "adsense_state", "No ca-pub in index.", { matched: /ca-pub-/i.test(indexHtml) });
  const adPlaceholderCount = GENERATED_SIX.filter((p) => /ad-slot|adsbygoogle|advertisement/i.test(read(p))).length;
  assertEq(adPlaceholderCount, 0, "ADS_no_ad_placeholders", "adsense_state", "Ad placeholders in six guides === 0.", { adPlaceholderCount });

  // --- Structured data ---
  assertPass(indexHtml.includes('"@type": "FAQPage"'), "SCHEMA_home_faqpage", "structured_data", "Homepage FAQPage JSON-LD.", { present: indexHtml.includes('"@type": "FAQPage"') });
  assertPass(indexHtml.includes('"@type": "WebSite"'), "SCHEMA_home_website", "structured_data", "Homepage WebSite JSON-LD.", { present: indexHtml.includes('"@type": "WebSite"') });
  for (const rel of ["index.html", "about.html", "fruits/avocado/index.html", "styles/pinot-noir/index.html", "wine-with-steak.html"]) {
    const html = read(rel);
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
    let parseErrors = 0;
    for (const b of blocks) {
      try {
        JSON.parse(b);
      } catch {
        parseErrors += 1;
      }
    }
    assertEq(parseErrors, 0, `SCHEMA_json_valid_${rel.replace(/[/.]/g, "_")}`, "structured_data", `${rel} JSON-LD parse errors === 0.`, { blocks: blocks.length, parseErrors });
    const hasOrg = /"@type": "Organization"/.test(html);
    const wyOk = !hasOrg || /"addressRegion": "Wyoming"/.test(html);
    assertPass(wyOk, `SCHEMA_org_wyoming_${rel.replace(/[/.]/g, "_")}`, "structured_data", `${rel} Organization Wyoming when org present.`, { hasOrg, wyOk });
  }

  // --- Cheese link quarantine in published HTML ---
  let cheeseLinkPages = 0;
  function walkHtml(dir) {
    if (!exists(dir)) return;
    for (const ent of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, ent.name);
      if (ent.isDirectory()) walkHtml(rel);
      else if (ent.name.endsWith(".html") && !isExcludedPublishedHtml(rel)) {
        if (read(rel).includes('href="/cheeses/')) cheeseLinkPages += 1;
      }
    }
  }
  walkHtml(".");
  assertEq(cheeseLinkPages, 0, "LINK_no_cheese_in_published", "publication_integrity", "Published HTML pages linking /cheeses/ === 0.", { cheeseLinkPages });

  // --- Wine faults ---
  for (const slug of ["cork-taint", "brettanomyces"]) {
    const html = read(`faults/${slug}/index.html`);
    const notes = [...html.matchAll(/class="wine-fault-source-note"/g)].length;
    const disclaimerOk = /does not evaluate or validate Pairing Method/i.test(html);
    assertEq(notes, 1, `FAULT_${slug}_one_note`, "content_quality", `${slug} exactly one source note.`, { notes });
    assertPass(disclaimerOk, `FAULT_${slug}_disclaimer`, "content_quality", `${slug} non-endorsement disclaimer.`, { disclaimerOk });
  }

  // --- EAT-20 ---
  if (exists("reports/pairing-eat-20-verification.json")) {
    const eat20 = JSON.parse(read("reports/pairing-eat-20-verification.json"));
    assertEq(eat20.evidence_verified_count, 0, "E20_evidence_verified_zero", "evidence_provenance", "EAT-20 evidence_verified_count === 0.", { actual: eat20.evidence_verified_count });
    assertEq(eat20.publication_safe_count, 0, "E20_publication_safe_zero", "evidence_provenance", "EAT-20 publication_safe_count === 0.", { actual: eat20.publication_safe_count });
  }

  // --- Sitemap live samples ---
  for (const url of allSitemapUrls.filter((_, i) => i % 240 === 0).slice(0, 6)) {
    const status = curlStatus(url);
    assertEq(status, 200, `SMAP_live_${pathnameHash(url)}`, "live_production_http", `Sitemap sample 200: ${url}`, { url }, "LIVE_HTTP");
  }

  manual("BQA_chrome_desktop_mobile", "browser_qa", "Real Chrome desktop 1440×900 and mobile 390×844 (§4). Verifier does NOT perform visual inspection.", {
    pages: ["/", "/wine-with-steak/", "/foods/salmon-fillet/", "/terms/tannin/", "/faults/cork-taint/", "/disclaimer"],
    viewports: ["1440x900", "390x844"],
    evidence_location: "reports/pairing-eat-23-implementation.md § Browser / Manual Checks",
  });

  // --- No modification proof ---
  const PROTECTED_HASHES_END = collectProtectedHashes();
  const hashDrift = Object.keys(PROTECTED_HASHES_START).filter((k) => PROTECTED_HASHES_START[k] !== PROTECTED_HASHES_END[k]);
  assertEq(hashDrift.length, 0, "NO_MOD_protected_hashes", "no_modification", "Protected hash drift === 0.", { hashDrift });

  const trackedModified = execSync("git diff --name-only", { cwd: ROOT, encoding: "utf8" }).trim().split("\n").filter(Boolean);
  const unexpectedTracked = trackedModified.filter((f) => !ALLOWED_TRACKED.has(f));
  assertEq(unexpectedTracked.length, 0, "NO_MOD_git_tracked", "no_modification", "Only EAT-23 audit files tracked-modified.", { trackedModified, unexpectedTracked });

  // --- Final gate (computed, not hard-coded) ---
  const failed = checks.filter((c) => c.result === "FAIL");
  const p0 = materialBlockers.filter((b) => b.severity === "P0").length;
  const p1 = materialBlockers.filter((b) => b.severity === "P1").length;
  const materialCount = materialBlockers.length;
  const hasManual = checks.some((c) => c.result === "MANUAL_REVIEW_REQUIRED");
  const notVerifiedLive = checks.filter((c) => c.result === "NOT_VERIFIED" && c.category === "live_production_http").length;

  let finalClassification;
  if (p0 > 0 || p1 > 0 || materialCount > 0) {
    finalClassification = "C. BLOCKED — MATERIAL REMEDIATION REQUIRED";
  } else if (notVerifiedLive >= 5) {
    finalClassification = "D. INSUFFICIENT EVIDENCE — DO NOT AUTHORIZE";
  } else if (nonMaterialNotes.length > 0 || hasManual) {
    finalClassification = "B. READY WITH NON-MATERIAL NOTES — SUBMISSION AUTHORIZED";
  } else {
    finalClassification = "A. READY — SUBMISSION AUTHORIZED";
  }

  const submissionAuthorized = finalClassification.startsWith("A.") || finalClassification.startsWith("B.");

  return {
    phase: "PAIRING-EAT-23A",
    hardening: "EAT-23A fail-closed predicate model",
    generatedAt: new Date().toISOString(),
    production_sha: PRODUCTION_SHA,
    status: hashDrift.length > 0 ? "AUDIT FAIL — PROTECTED PATH DRIFT" : failed.length === 0 ? "AUDIT PASS — DIRECTOR REVIEW REQUIRED" : "AUDIT FAIL — MATERIAL BLOCKERS",
    final_classification: finalClassification,
    adsense_submission_authorized: submissionAuthorized,
    material_blockers: { P0: p0, P1: p1, total: materialCount, items: materialBlockers },
    non_material_notes: nonMaterialNotes,
    p2_methodology: {
      observed_fact: "Recorded by verifier as deterministic predicate or inventory count.",
      policy_interpretation: "Documented in director_classification_note; not objectively proven by script.",
      director_classification: "Final submission authorization requires Director review of P2 notes.",
    },
    google_policy_basis: [
      "https://support.google.com/adsense/answer/9724",
      "https://support.google.com/adsense/answer/7299563",
      "https://support.google.com/adsense/answer/12176698",
      "https://support.google.com/adsense/answer/48182",
      "https://support.google.com/adsense/answer/10502938",
      "https://support.google.com/adsense/answer/12131223",
      "https://support.google.com/adsense/answer/12171612",
    ],
    activation_separation: {
      authorized_now: submissionAuthorized ? ["AdSense account/site submission (#1)"] : [],
      not_authorized: ["ads.txt configuration (#4)", "ad-code activation (#5)", "live ad serving (#6)"],
      post_approval: "Configure ads.txt and insert ad code only after Google approval.",
    },
    local_verification: {
      total_checks: checks.length,
      passed: checks.filter((c) => c.result === "PASS").length,
      failed: failed.length,
      manual: checks.filter((c) => c.result === "MANUAL_REVIEW_REQUIRED").length,
      not_verified: checks.filter((c) => c.result === "NOT_VERIFIED").length,
      non_material_notes: checks.filter((c) => c.result === "NON_MATERIAL_NOTE").length,
      checks,
    },
    commit_push_deploy: { committed: false, pushed: false, deployed: false },
    hashDrift,
    failed,
  };
}

const result = runAudit();
fs.mkdirSync(path.dirname(JSON_REPORT), { recursive: true });
fs.writeFileSync(JSON_REPORT, JSON.stringify(result, null, 2) + "\n");

console.log(JSON.stringify({
  phase: result.phase,
  status: result.status,
  final_classification: result.final_classification,
  checks: `${result.local_verification.passed}/${result.local_verification.total_checks} PASS, ${result.failed.length} FAIL`,
  material_blockers: result.material_blockers.total,
  adsense_submission_authorized: result.adsense_submission_authorized,
}, null, 2));

if (result.hashDrift.length > 0 || result.failed.length > 0) {
  if (result.hashDrift.length > 0) console.error("PROTECTED DRIFT:", result.hashDrift);
  if (result.failed.length > 0) console.error("FAILED:", result.failed.map((f) => f.id));
  process.exit(1);
}
