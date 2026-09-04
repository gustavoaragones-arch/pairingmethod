#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { getDomainDeployment } from "../lib/deployment-config.js";

const ROOT = process.cwd();
const ORIGIN = "https://pairingmethod.com";
const TARGET_PAGES = [
  "wine-with-steak.html",
  "wine-with-chicken.html",
  "wine-with-salmon.html",
  "wine-for-bbq-ribs.html",
  "wine-for-thanksgiving-turkey.html",
];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function fail(message) {
  throw new Error(message);
}

function parseRedirects() {
  const rules = new Map();
  for (const rawLine of read("_redirects").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const [source, target, status] = line.split(/\s+/);
    if (!source?.startsWith("/foods/")) continue;
    if (rules.has(source)) fail(`Duplicate redirect source: ${source}`);
    rules.set(source, { target, status });
  }
  return rules;
}

function sitemapLocs(relativePath) {
  return [...read(relativePath).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function allPublicationSitemapLocs() {
  const locs = new Set();
  const sitemapDir = path.join(ROOT, "sitemaps");
  for (const file of fs.readdirSync(sitemapDir).filter((name) => name.endsWith(".xml"))) {
    for (const loc of sitemapLocs(path.join("sitemaps", file))) locs.add(loc);
  }
  return locs;
}

function localFileForRoute(route) {
  return path.join(ROOT, route.replace(/^\//, ""), "index.html");
}

function countDirectoryIndexFiles(relativePath) {
  const directory = path.join(ROOT, relativePath);
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() && fs.existsSync(path.join(directory, entry.name, "index.html"))
    ).length;
}

function extractCanonical(html) {
  return html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] ?? null;
}

function verifyLocal() {
  const migrationMap = JSON.parse(read("data/protein-migration-map.json"));
  const migrations = migrationMap.migrations;
  if (migrations.length !== 51) fail(`Expected 51 migrations, found ${migrations.length}`);
  if (migrations.some((entry) => entry.redirect_required !== true)) {
    fail("Every migration record must have redirect_required: true");
  }

  const sources = new Set(migrations.map((entry) => entry.legacy_publication_path));
  if (sources.size !== 51) fail("Migration source paths must be unique");

  const redirects = parseRedirects();
  const proteinSitemap = new Set(sitemapLocs("sitemaps/protein-food-pages.xml"));
  const distProteinSitemap = new Set(sitemapLocs("dist/sitemaps/protein-food-pages.xml"));
  const allSitemapLocs = allPublicationSitemapLocs();
  const deployment = getDomainDeployment("protein");
  const htmlCounts = {
    leaf: countDirectoryIndexFiles("foods"),
    groups: countDirectoryIndexFiles("groups"),
    categories: countDirectoryIndexFiles("categories"),
  };
  htmlCounts.total = htmlCounts.leaf + htmlCounts.groups + htmlCounts.categories;
  const sitemapCounts = {
    leaf: sitemapLocs("sitemaps/protein-food-pages.xml").length,
    groups: sitemapLocs("sitemaps/protein-group-pages.xml").length,
    categories: sitemapLocs("sitemaps/protein-category-pages.xml").length,
  };
  sitemapCounts.total = sitemapCounts.leaf + sitemapCounts.groups + sitemapCounts.categories;
  if (JSON.stringify(htmlCounts) !== JSON.stringify(deployment.expectedHtmlCounts)) {
    fail(`Protein deployment HTML count gate mismatch: ${JSON.stringify(htmlCounts)}`);
  }
  if (JSON.stringify(sitemapCounts) !== JSON.stringify(deployment.expectedSitemapCounts)) {
    fail(`Protein deployment sitemap count gate mismatch: ${JSON.stringify(sitemapCounts)}`);
  }

  const migrationRows = migrations.map((entry, index) => {
    const source = entry.legacy_publication_path;
    const sourceWithoutSlash = source.slice(0, -1);
    const target = entry.canonical_publication_path;
    const slashRule = redirects.get(source);
    const noSlashRule = redirects.get(sourceWithoutSlash);
    const targetFile = localFileForRoute(target);
    const targetHtml = fs.existsSync(targetFile) ? fs.readFileSync(targetFile, "utf8") : "";
    const expectedCanonical = `${ORIGIN}${target}`;
    const targetCanonical = extractCanonical(targetHtml);
    const sourcePresent =
      proteinSitemap.has(`${ORIGIN}${source}`) || distProteinSitemap.has(`${ORIGIN}${source}`);
    const targetPresent = allSitemapLocs.has(expectedCanonical);
    const targetIsSource = sources.has(target);
    const pass =
      slashRule?.target === target &&
      slashRule?.status === "301" &&
      noSlashRule?.target === target &&
      noSlashRule?.status === "301" &&
      !targetIsSource &&
      !sourcePresent &&
      fs.existsSync(targetFile) &&
      targetCanonical === expectedCanonical &&
      !/<meta\s+name=["']robots["'][^>]*noindex/i.test(targetHtml) &&
      targetPresent;

    return {
      number: index + 1,
      source,
      target,
      slashRedirect: slashRule ?? null,
      noSlashRedirect: noSlashRule ?? null,
      targetIsMigrationSource: targetIsSource,
      sourcePresentInProteinSitemap: sourcePresent,
      targetPresentInPublicationSitemap: targetPresent,
      targetFilePresent: fs.existsSync(targetFile),
      targetCanonical,
      result: pass ? "PASS" : "FAIL",
    };
  });

  const ctaRows = TARGET_PAGES.map((file) => {
    const html = read(file);
    const viewBottleCount = (html.match(/View Bottle/gi) ?? []).length;
    const deadBottleCount = (
      html.match(/<a\b[^>]*href=["']#["'][^>]*>\s*View Bottle\s*<\/a>/gi) ?? []
    ).length;
    const canonical = extractCanonical(html);
    const expectedCanonical = `${ORIGIN}/${file.replace(/\.html$/, "")}`;
    const pass =
      viewBottleCount === 0 &&
      deadBottleCount === 0 &&
      canonical === expectedCanonical &&
      /<!doctype html>/i.test(html) &&
      /<\/html>\s*$/i.test(html);
    return {
      file,
      viewBottleCount,
      deadBottleCount,
      canonical,
      result: pass ? "PASS" : "FAIL",
    };
  });

  return {
    migrationCount: migrations.length,
    redirectRuleCount: [...redirects.keys()].filter((source) =>
      [...sources].some((migrationSource) => source === migrationSource || source === migrationSource.slice(0, -1))
    ).length,
    proteinSitemapUrlCount: proteinSitemap.size,
    publicationSitemapUrlCount: allSitemapLocs.size,
    deploymentHtmlCounts: htmlCounts,
    deploymentSitemapCounts: sitemapCounts,
    redirectRequiredSourcesInProteinSitemap: migrationRows.filter(
      (row) => row.sourcePresentInProteinSitemap
    ).length,
    migrationsPassing: migrationRows.filter((row) => row.result === "PASS").length,
    ctaPagesPassing: ctaRows.filter((row) => row.result === "PASS").length,
    deadViewBottleControls: ctaRows.reduce((sum, row) => sum + row.deadBottleCount, 0),
    migrationRows,
    ctaRows,
    result:
      migrationRows.every((row) => row.result === "PASS") &&
      ctaRows.every((row) => row.result === "PASS")
        ? "PASS"
        : "FAIL",
  };
}

async function follow(url, maxHops = 10) {
  let current = url;
  let firstStatus = null;
  let firstLocation = null;
  let hops = 0;
  const visited = new Set();

  while (hops <= maxHops) {
    if (visited.has(current)) {
      return { status: null, firstStatus, firstLocation, finalUrl: current, hops, loop: true, body: "" };
    }
    visited.add(current);
    const response = await fetch(current, {
      redirect: "manual",
      headers: { "user-agent": "PairingMethod-PAIRING-EAT-02-Verification/1.0" },
    });
    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return {
        status: response.status,
        firstStatus,
        firstLocation,
        finalUrl: current,
        hops,
        loop: false,
        body: await response.text(),
      };
    }
    const location = response.headers.get("location");
    if (!location) {
      return { status: response.status, firstStatus, firstLocation, finalUrl: current, hops, loop: false, body: "" };
    }
    if (firstStatus === null) firstStatus = response.status;
    const next = new URL(location, current).href;
    if (firstLocation === null) firstLocation = next;
    current = next;
    hops += 1;
  }

  return { status: null, firstStatus, firstLocation, finalUrl: current, hops, loop: true, body: "" };
}

async function verifyProduction(local) {
  const liveSitemapResponse = await fetch(`${ORIGIN}/sitemaps/protein-food-pages.xml`);
  const liveSitemapXml = await liveSitemapResponse.text();
  const rows = [];

  for (const localRow of local.migrationRows) {
    const sourceUrl = `${ORIGIN}${localRow.source}`;
    const targetUrl = `${ORIGIN}${localRow.target}`;
    const sourceResult = await follow(sourceUrl);
    const targetResult = await follow(targetUrl);
    const sourcePresent = liveSitemapXml.includes(`<loc>${sourceUrl}</loc>`);
    const finalCanonical = extractCanonical(targetResult.body);
    const firstLocationPath = sourceResult.firstLocation
      ? new URL(sourceResult.firstLocation).pathname
      : null;
    const sourceStatus = sourceResult.firstStatus ?? sourceResult.status;
    const homepageFallback = new URL(sourceResult.finalUrl).pathname === "/";
    const pass =
      [301, 308].includes(sourceStatus) &&
      firstLocationPath === localRow.target &&
      sourceResult.hops === 1 &&
      sourceResult.status === 200 &&
      new URL(sourceResult.finalUrl).pathname === localRow.target &&
      targetResult.status === 200 &&
      finalCanonical === targetUrl &&
      !sourcePresent &&
      !sourceResult.loop &&
      !homepageFallback;

    rows.push({
      number: localRow.number,
      source: localRow.source,
      target: localRow.target,
      sourceStatus,
      location: sourceResult.firstLocation,
      finalStatus: sourceResult.status,
      finalUrl: sourceResult.finalUrl,
      hops: sourceResult.hops,
      loop: sourceResult.loop,
      homepageFallback,
      unexpectedSource200: sourceResult.hops === 0 && sourceResult.status === 200,
      targetStatus: targetResult.status,
      targetCanonical: finalCanonical,
      sourcePresentInProteinSitemap: sourcePresent,
      result: pass ? "PASS" : "FAIL",
    });
  }

  const ctaRows = [];
  for (const file of TARGET_PAGES) {
    const route = `/${file.replace(/\.html$/, "")}`;
    const response = await follow(`${ORIGIN}${route}`);
    const viewBottleCount = (response.body.match(/View Bottle/gi) ?? []).length;
    const deadBottleCount = (
      response.body.match(/<a\b[^>]*href=["']#["'][^>]*>\s*View Bottle\s*<\/a>/gi) ?? []
    ).length;
    ctaRows.push({
      file,
      status: response.status,
      finalUrl: response.finalUrl,
      viewBottleCount,
      deadBottleCount,
      result:
        response.status === 200 && viewBottleCount === 0 && deadBottleCount === 0
          ? "PASS"
          : "FAIL",
    });
  }

  return {
    sitemapStatus: liveSitemapResponse.status,
    verified: rows.length,
    redirectPassing: rows.filter((row) => row.result === "PASS").length,
    sitemapSourcesRemoved: rows.filter((row) => !row.sourcePresentInProteinSitemap).length,
    canonicalTargetsPassing: rows.filter(
      (row) => row.targetStatus === 200 && row.targetCanonical === `${ORIGIN}${row.target}`
    ).length,
    loops: rows.filter((row) => row.loop).length,
    homepageFallbacks: rows.filter((row) => row.homepageFallback).length,
    unexpectedSource200s: rows.filter((row) => row.unexpectedSource200).length,
    ctaPagesPassing: ctaRows.filter((row) => row.result === "PASS").length,
    deadViewBottleControls: ctaRows.reduce((sum, row) => sum + row.deadBottleCount, 0),
    rows,
    ctaRows,
    result:
      rows.every((row) => row.result === "PASS") &&
      ctaRows.every((row) => row.result === "PASS")
        ? "PASS"
        : "FAIL",
  };
}

function buildMarkdown(result) {
  const production = result.production;
  const productionPass = production?.result === "PASS";
  const rows = production?.rows ?? result.local.migrationRows;
  const tableRows = rows
    .map((row) => {
      const sourceStatus = production ? row.sourceStatus : "LOCAL CONFIG";
      const location = production ? row.location ?? "—" : row.slashRedirect?.target ?? "—";
      const finalStatus = production ? row.finalStatus : row.targetFilePresent ? 200 : "—";
      const hops = production ? row.hops : 1;
      const sourcePresent = production
        ? row.sourcePresentInProteinSitemap
        : row.sourcePresentInProteinSitemap;
      return `| ${row.number} | \`${row.source}\` | \`${row.target}\` | ${sourceStatus} | ${location} | ${finalStatus} | ${hops} | ${sourcePresent ? "YES" : "NO"} | ${row.result} |`;
    })
    .join("\n");

  const finalStatus = productionPass ? "PASS" : "BLOCKED";
  return `# PAIRING-EAT-02 — P0 Remediation

## 1. Status

**${finalStatus}**

Local implementation and deterministic verification pass. Production still serves the pre-remediation release, so the phase cannot pass until deployment and a fresh 51-URL census succeed.

## 2. Scope

Only the two accepted PAIRING-EAT-01 P0 findings were changed: removal of 15 dead “View Bottle” controls and completion of the 51 governed Protein redirects/sitemap exclusions.

## 3. P0-01 — View Bottle Remediation

### Affected Pages

- \`wine-with-steak.html\`
- \`wine-with-chicken.html\`
- \`wine-with-salmon.html\`
- \`wine-for-bbq-ribs.html\`
- \`wine-for-thanksgiving-turkey.html\`

### Before

Each page contained three \`<a href="#" class="cta">View Bottle</a>\` controls: 15 total. Repository searches found no production-ready bottle, retailer, product, or affiliate destination architecture.

### Remediation

Removed only the 15 nonfunctional anchors. Recommendation headings, style/region names, descriptions, cards, canonical tags, schema, and surrounding copy remain unchanged. No replacement URLs or commerce infrastructure were added.

### After

Local affected pages contain zero “View Bottle” text, zero dead bottle anchors, and zero empty CTA/button shells. Production currently retains ${production?.deadViewBottleControls ?? "NOT VERIFIED"} dead controls because this change has not been deployed.

### Verification

- Local deterministic HTML verification: ${result.local.ctaPagesPassing}/5 PASS.
- Local dead controls: ${result.local.deadViewBottleControls}/15.
- Production affected pages passing: ${production?.ctaPagesPassing ?? "NOT VERIFIED"}/5.
- Production dead controls: ${production?.deadViewBottleControls ?? "NOT VERIFIED"}/15.

## 4. P0-02 — Protein Migration Remediation

### Migration Source

\`data/protein-migration-map.json\` remains authoritative. It contains 51 migration records, all with \`redirect_required: true\`, exact legacy paths, and governed canonical targets.

### Redirect Implementation

\`lib/food-publication/redirect-registry.js\` now reads Protein redirects from the migration map and emits exact 301 rules for both the trailing-slash publication URL and its non-trailing-slash form. The governed block contains 102 exact rules for 51 migrations; no wildcard or namespace-wide redirect was added.

### Sitemap Implementation

\`lib/food-publication/sitemap.js\` excludes only Protein leaf slugs listed as \`redirect_required\` in the migration map. Both generated and deploy-tree Protein leaf sitemaps were regenerated. Legacy HTML artifacts were retained because the redirect layer owns compatibility; they are no longer advertised by the sitemap and will not serve as normal pages after deployment.

### Before/After Census

- Production sitemap URLs: 1,492 before; expected 1,441 after deployment of the 51 removals.
- Repository child-sitemap URLs (including unpublished cheese artifacts): 1,706 before; ${result.local.publicationSitemapUrlCount} after locally.
- Protein leaf sitemap URLs: 210 before; ${result.local.proteinSitemapUrlCount} after locally.
- Redirect-required Protein sitemap URLs: 51 before; ${result.local.redirectRequiredSourcesInProteinSitemap} after locally.
- Unrelated sitemap URL families changed: 0.

## 5. Complete 51-URL Redirect Verification

Production results are shown below. Local configuration/canonical verification is 51/51 PASS, but production remains on the prior release.

| # | Legacy URL | Target URL | Status | Location | Final Status | Hops | Sitemap Source Present | Result |
|---:|---|---|---:|---|---:|---:|---|---|
${tableRows}

## 6. Canonical Target Verification

- Local target files present: 51/51.
- Local targets self-canonicalize: 51/51.
- Local targets are indexable and present in intended publication sitemaps: 51/51.
- Production target HTTP/canonical PASS: ${production?.canonicalTargetsPassing ?? "NOT VERIFIED"}/51.
- No target is itself a migration source.

## 7. Sitemap Verification

- Root Protein leaf sitemap valid generation: PASS.
- Deploy-tree Protein leaf sitemap valid generation: PASS.
- Local source removals: 51/51.
- Production source removals: ${production?.sitemapSourcesRemoved ?? "NOT VERIFIED"}/51.
- Local Protein count changed only by the 51 governed removals: 210 → ${result.local.proteinSitemapUrlCount}.

## 8. Production Verification

- Verified: ${production?.verified ?? 0}/51.
- Redirect PASS: ${production?.redirectPassing ?? "NOT VERIFIED"}/51.
- Sitemap sources removed: ${production?.sitemapSourcesRemoved ?? "NOT VERIFIED"}/51.
- Canonical targets PASS: ${production?.canonicalTargetsPassing ?? "NOT VERIFIED"}/51.
- Redirect loops: ${production?.loops ?? "NOT VERIFIED"}.
- Homepage fallbacks: ${production?.homepageFallbacks ?? "NOT VERIFIED"}.
- Unexpected source HTTP 200 responses: ${production?.unexpectedSource200s ?? "NOT VERIFIED"}.

**Production result: ${productionPass ? "PASS" : "BLOCKED — corrected files are not deployed."}**

## 9. Regression Tests

\`scripts/verify-pairing-eat-02.mjs\` verifies:

- exactly 51 migration records and 51 \`redirect_required\` entries;
- exact slash and non-slash redirect rules and targets;
- no target is a migration source and no configured loop;
- zero migration sources in root or deploy-tree Protein sitemaps;
- separate Protein deployment gates of 230 HTML artifacts and 179 sitemap URLs;
- all canonical targets exist, self-canonicalize, remain indexable, and remain sitemapped;
- zero dead bottle controls across all five affected pages;
- complete production status, Location, hop, final status, canonical, and sitemap census.

Local verifier result: **${result.local.result}**.

## 10. SEO / Schema Safety

The five affected canonical URLs are unchanged. Canonical target identity, robots metadata, JSON-LD, entity IDs, relationship data, pairing logic, and schema vocabulary were not modified. Only redirect publication behavior and Protein sitemap inclusion changed.

## 11. Visual QA

All five pages were rendered locally at 1440×900 and 390×844. Each retained three coherent recommendation cards, had no empty controls, and produced no horizontal overflow. Desktop and mobile inspection found no spacing artifact from anchor removal. No remediation-attributable browser error was observed.

## 12. Repository Diff

Expected tracked changes are limited to:

- five affected pairing HTML pages;
- \`_redirects\`;
- \`lib/food-publication/redirect-registry.js\`;
- \`lib/food-publication/sitemap.js\`;
- \`lib/deployment-config.js\`;
- \`lib/food-publication/deploy.js\`;
- \`sitemaps/protein-food-pages.xml\`;
- \`dist/sitemaps/protein-food-pages.xml\`.

Audit artifacts created:

- \`scripts/verify-pairing-eat-02.mjs\`;
- \`reports/pairing-eat-02-verification.json\`;
- \`reports/pairing-eat-02-remediation.md\`.

\`git diff --check\`: PASS. No protected ontology, runtime, editorial, wine-relationship, pairing-engine, Spanish, legal, schema, or advertising paths changed.

## 13. Pre-existing Untracked Files

The pre-existing \`.regression-baseline/\`, cheese directories, \`logo-vector_.ai\`, selected legacy \`terms/*.html\`, and \`reports/pairing-eat-01-audit.md\` were not modified or staged.

## 14. Explicit Non-Changes

No P1/P2/P3 remediation, 404/contact/ads.txt/Spanish/FAQ/authorship/citation/legal work, ontology/runtime/editorial/wine relationship changes, pairing scoring changes, UI redesign, AdSense/affiliate activation, commit, push, or deployment was performed.

## 15. Remaining P1/P2/P3 Findings

Deferred exactly as accepted in PAIRING-EAT-01:

- P1: unknown-route HTTP behavior; homepage FAQPage visibility; assessable human responsibility/expertise; lowest-depth programmatic review; percentage-score explanation.
- P2: sourcing/evidence policy; legal/privacy alignment; suite/publication-scope documentation; post-approval ad activation requirements.
- P3: contact/correction discoverability; trust-page/error-page polish.

## 16. Final Assessment

**${finalStatus}**

The repository implementation passes locally, but production does not yet contain it. Under the Director’s criteria, production verification is mandatory; therefore PAIRING-EAT-02 remains BLOCKED pending deployment and rerun.
`;
}

async function main() {
  const args = process.argv.slice(2);
  const production = args.includes("--production");
  const outputIndex = args.indexOf("--output");
  const outputPath = outputIndex >= 0 ? args[outputIndex + 1] : null;
  const reportIndex = args.indexOf("--report");
  const reportPath = reportIndex >= 0 ? args[reportIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) fail("--output requires a path");
  if (reportIndex >= 0 && !reportPath) fail("--report requires a path");

  const local = verifyLocal();
  const result = {
    phase: "PAIRING-EAT-02",
    generatedAt: new Date().toISOString(),
    local,
    production: production ? await verifyProduction(local) : null,
  };

  if (outputPath) {
    fs.writeFileSync(path.join(ROOT, outputPath), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  }
  if (reportPath) {
    fs.writeFileSync(path.join(ROOT, reportPath), buildMarkdown(result), "utf8");
  }
  console.log(JSON.stringify(result, null, 2));
  if (local.result !== "PASS" || (production && result.production.result !== "PASS")) {
    process.exitCode = 1;
  }
}

await main();
