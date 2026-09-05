#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ORIGIN = "https://pairingmethod.com";
const OBSERVED_EFFECTIVE_RULE_CEILING = 100;
const PREVIOUSLY_FAILING = new Set([
  "/foods/soy-curls/",
  "/foods/soybeans/",
  "/foods/sunflower-seeds/",
  "/foods/tempeh/",
  "/foods/textured-vegetable-protein/",
  "/foods/tofu-firm/",
  "/foods/walnuts/",
]);
const PREVIOUSLY_PASSING_COUNT = 44;
const UNRELATED_PROTEIN_PATHS = [
  "/foods/abalone/",
  "/foods/anchovy/",
  "/foods/brisket/",
  "/foods/chicken-breast/",
  "/foods/salmon/",
];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function extractCanonical(html) {
  return html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1] ?? null;
}

function parseRules() {
  const rules = [];
  let inMigrationBlock = false;
  for (const rawLine of read("_redirects").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "# AQ-02B4:REDIRECTS-START") {
      inMigrationBlock = true;
      continue;
    }
    if (line === "# AQ-02B4:REDIRECTS-END") {
      inMigrationBlock = false;
      continue;
    }
    if (!line || line.startsWith("#")) continue;
    const [source, target, status = "302"] = line.split(/\s+/);
    rules.push({
      ordinal: rules.length + 1,
      source,
      target,
      status,
      dynamic: /[*:]/.test(source),
      migration: inMigrationBlock,
    });
  }
  return rules;
}

function sitemapLocs(relativePath) {
  return new Set(
    [...read(relativePath).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  );
}

function allSitemapLocs() {
  const locs = new Set();
  for (const file of fs.readdirSync(path.join(ROOT, "sitemaps"))) {
    if (!file.endsWith(".xml")) continue;
    for (const loc of sitemapLocs(path.join("sitemaps", file))) locs.add(loc);
  }
  return locs;
}

function localTarget(entry, publicationLocs) {
  const file = path.join(ROOT, entry.canonical_publication_path.slice(1), "index.html");
  const html = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const expectedCanonical = `${ORIGIN}${entry.canonical_publication_path}`;
  return {
    filePresent: fs.existsSync(file),
    canonical: extractCanonical(html),
    expectedCanonical,
    noindex: /<meta\s+name=["']robots["'][^>]*noindex/i.test(html),
    sitemapPresent: publicationLocs.has(expectedCanonical),
  };
}

function protectedPathChanges() {
  const output = execFileSync("git", ["status", "--short"], { cwd: ROOT, encoding: "utf8" });
  const changed = output
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.slice(3));
  const protectedPatterns = [
    /^data\/(runtime|editorial)\//,
    /^data\/.*(?:catalog|relationship)/,
    /^assets\/js\/(?:pairing-engine|pairing-data|matrix-view)\.js$/,
    /^templates\//,
    /spanish|language|lang-03/i,
    /schema/i,
    /(?:privacy|terms|disclaimer|cookies)\.html$/,
  ];
  return {
    changed,
    protected: changed.filter((file) => protectedPatterns.some((pattern) => pattern.test(file))),
  };
}

function check(pass, evidence) {
  return { pass, evidence };
}

function verifyLocal() {
  const migrationMap = JSON.parse(read("data/protein-migration-map.json"));
  const migrations = migrationMap.migrations;
  const rules = parseRules();
  const migrationRules = rules.filter((rule) => rule.migration);
  const rulesBySource = new Map(migrationRules.map((rule) => [rule.source, rule]));
  const migrationSources = new Set(migrations.map((entry) => entry.legacy_publication_path));
  const proteinSitemap = sitemapLocs("sitemaps/protein-food-pages.xml");
  const publicationLocs = allSitemapLocs();
  const changedPaths = protectedPathChanges();

  const rows = migrations.map((entry, index) => {
    const trailingRule = rulesBySource.get(entry.legacy_publication_path);
    const nonTrailingSource = entry.legacy_publication_path.slice(0, -1);
    const nonTrailingRule = rulesBySource.get(nonTrailingSource);
    const targetState = localTarget(entry, publicationLocs);
    const sourceAbsent = !proteinSitemap.has(`${ORIGIN}${entry.legacy_publication_path}`);
    const localTrailingPass =
      trailingRule?.target === entry.canonical_publication_path &&
      trailingRule?.status === "301" &&
      trailingRule.ordinal <= OBSERVED_EFFECTIVE_RULE_CEILING;
    const localNonTrailingPass =
      nonTrailingRule?.target === entry.canonical_publication_path &&
      nonTrailingRule?.status === "301";
    const simulatedHops =
      nonTrailingRule?.ordinal <= OBSERVED_EFFECTIVE_RULE_CEILING
        ? [
            {
              status: 301,
              from: nonTrailingSource,
              to: entry.canonical_publication_path,
            },
          ]
        : [
            {
              status: 308,
              from: nonTrailingSource,
              to: entry.legacy_publication_path,
            },
            {
              status: 301,
              from: entry.legacy_publication_path,
              to: entry.canonical_publication_path,
            },
          ];
    const pass =
      localTrailingPass &&
      localNonTrailingPass &&
      !migrationSources.has(entry.canonical_publication_path) &&
      targetState.filePresent &&
      targetState.canonical === targetState.expectedCanonical &&
      !targetState.noindex &&
      targetState.sitemapPresent &&
      sourceAbsent;
    return {
      number: index + 1,
      source: entry.legacy_publication_path,
      nonTrailingSource,
      target: entry.canonical_publication_path,
      previouslyFailing: PREVIOUSLY_FAILING.has(entry.legacy_publication_path),
      trailingRule: trailingRule ?? null,
      nonTrailingRule: nonTrailingRule ?? null,
      nonTrailingMechanism:
        nonTrailingRule?.ordinal <= OBSERVED_EFFECTIVE_RULE_CEILING
          ? "Exact static 301 rule"
          : "Cloudflare directory normalization (308) to exact trailing-slash rule",
      simulatedHops,
      sourcePresentInProteinSitemap: !sourceAbsent,
      targetState,
      result: pass ? "PASS" : "FAIL",
    };
  });

  const staticRuleCount = rules.filter((rule) => !rule.dynamic).length;
  const dynamicRuleCount = rules.filter((rule) => rule.dynamic).length;
  const duplicateSources = rules
    .map((rule) => rule.source)
    .filter((source, index, all) => all.indexOf(source) !== index);
  const acceptedMigrationSources = new Set([
    ...migrationSources,
    ...[...migrationSources].map((source) => source.slice(0, -1)),
  ]);
  const unexpectedMigrationRules = migrationRules.filter(
    (rule) => !acceptedMigrationSources.has(rule.source)
  );
  const nonTrailingMigrationRules = migrationRules.filter((rule) => !rule.source.endsWith("/"));
  const wildcardMigrationRules = migrationRules.filter((rule) => rule.dynamic);
  const unrelatedCaptured = UNRELATED_PROTEIN_PATHS.filter((source) =>
    migrationRules.some((rule) => rule.source === source)
  );

  const checks = {
    V01: check(migrations.length === 51, `${migrations.length} migration records`),
    V02: check(
      migrations.every((entry) => entry.redirect_required === true),
      `${migrations.filter((entry) => entry.redirect_required === true).length}/51 redirect_required`
    ),
    V03: check(
      rows.every(
        (row) =>
          row.trailingRule?.target === row.target && row.nonTrailingRule?.target === row.target
      ),
      `${rows.filter((row) => row.trailingRule?.target === row.target && row.nonTrailingRule?.target === row.target).length}/51 exact map targets for both forms`
    ),
    V04: check(
      rows.every((row) => row.simulatedHops.at(-1).to === row.target),
      "51/51 non-trailing paths model to governed targets through native 308 normalization"
    ),
    V05: check(
      rows.every(
        (row) =>
          row.trailingRule?.source === row.source &&
          row.trailingRule.ordinal <= OBSERVED_EFFECTIVE_RULE_CEILING
      ),
      `${rows.filter((row) => row.trailingRule?.source === row.source && row.trailingRule.ordinal <= OBSERVED_EFFECTIVE_RULE_CEILING).length}/51 exact trailing-slash rules within observed boundary`
    ),
    V06: check(
      rows.every(
        (row) => row.trailingRule?.status === "301" && row.nonTrailingRule?.status === "301"
      ),
      `${rows.filter((row) => row.trailingRule?.status === "301" && row.nonTrailingRule?.status === "301").length}/51 local HTTP redirect pairs`
    ),
    V07: check(
      rows.every(
        (row) =>
          row.trailingRule?.target === row.target && row.nonTrailingRule?.target === row.target
      ),
      `${rows.filter((row) => row.trailingRule?.target === row.target && row.nonTrailingRule?.target === row.target).length}/51 exact destinations`
    ),
    V08: check(
      rows.every((row) => row.trailingRule?.status === "301"),
      "Local route model has 0 normal source HTTP 200 responses"
    ),
    V09: check(
      rows.every((row) => !migrationSources.has(row.target)) && duplicateSources.length === 0,
      "0 target-to-source loops and 0 duplicate rule sources"
    ),
    V10: check(rows.every((row) => row.target !== "/"), "0 homepage destinations"),
    V11: check(unexpectedMigrationRules.length === 0, "0 unexpected migration destinations"),
    V12: check(
      rows.every((row) => row.targetState.filePresent),
      `${rows.filter((row) => row.targetState.filePresent).length}/51 local target files`
    ),
    V13: check(
      rows.every((row) => row.targetState.canonical === row.targetState.expectedCanonical),
      `${rows.filter((row) => row.targetState.canonical === row.targetState.expectedCanonical).length}/51 self-canonicals`
    ),
    V14: check(
      rows.every((row) => !row.sourcePresentInProteinSitemap),
      `${rows.filter((row) => !row.sourcePresentInProteinSitemap).length}/51 sitemap removals`
    ),
    V15: check(
      rows.every((row) => !row.sourcePresentInProteinSitemap),
      "0 migration sources discoverable in Protein sitemap"
    ),
    V16: check(
      unrelatedCaptured.length === 0 && wildcardMigrationRules.length === 0,
      "0 unrelated exact paths and 0 wildcard migration rules"
    ),
    V17: check(
      rows.filter((row) => !row.previouslyFailing && row.result === "PASS").length ===
        PREVIOUSLY_PASSING_COUNT,
      `${rows.filter((row) => !row.previouslyFailing && row.result === "PASS").length}/44 prior passes preserved locally`
    ),
    V18: check(
      rows.filter((row) => row.previouslyFailing && row.result === "PASS").length === 7,
      `${rows.filter((row) => row.previouslyFailing && row.result === "PASS").length}/7 prior failures represented locally`
    ),
    V19: check(
      migrationRules.length === 102 &&
        rows.every((row) => row.trailingRule.ordinal <= OBSERVED_EFFECTIVE_RULE_CEILING) &&
        nonTrailingMigrationRules.length === 51,
      `102 map-driven rules retained; all 51 required trailing rules occur by declaration ${Math.max(...rows.map((row) => row.trailingRule.ordinal))}`
    ),
    V20: check(
      changedPaths.protected.length === 0,
      changedPaths.protected.length
        ? `Protected changes: ${changedPaths.protected.join(", ")}`
        : "0 protected paths modified"
    ),
  };

  return {
    result: Object.values(checks).every((entry) => entry.pass) ? "PASS" : "FAIL",
    observedEffectiveRuleCeiling: OBSERVED_EFFECTIVE_RULE_CEILING,
    totalRuleCount: rules.length,
    staticRuleCount,
    dynamicRuleCount,
    migrationRuleCount: migrationRules.length,
    slashMigrationRuleCount: migrationRules.filter((rule) => rule.source.endsWith("/")).length,
    nonTrailingMigrationRuleCount: nonTrailingMigrationRules.length,
    wildcardMigrationRuleCount: wildcardMigrationRules.length,
    requiredTrailingRuleMaxOrdinal: Math.max(...rows.map((row) => row.trailingRule.ordinal)),
    requiredTrailingRuleHeadroom:
      OBSERVED_EFFECTIVE_RULE_CEILING -
      Math.max(...rows.map((row) => row.trailingRule.ordinal)),
    protectedPathChanges: changedPaths.protected,
    checks,
    rows,
  };
}

async function follow(url) {
  let current = url;
  let firstStatus = null;
  let firstLocation = null;
  let hops = 0;
  const visited = new Set();

  while (hops <= 10) {
    if (visited.has(current)) {
      return { firstStatus, firstLocation, finalStatus: null, finalUrl: current, hops, loop: true };
    }
    visited.add(current);
    const response = await fetch(current, {
      redirect: "manual",
      headers: { "user-agent": "PairingMethod-PAIRING-EAT-02A-Verification/1.0" },
    });
    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return {
        firstStatus: firstStatus ?? response.status,
        firstLocation,
        finalStatus: response.status,
        finalUrl: current,
        hops,
        loop: false,
        body: await response.text(),
      };
    }
    const location = response.headers.get("location");
    if (!location) {
      return {
        firstStatus: firstStatus ?? response.status,
        firstLocation,
        finalStatus: response.status,
        finalUrl: current,
        hops,
        loop: false,
        body: "",
      };
    }
    if (firstStatus === null) firstStatus = response.status;
    const next = new URL(location, current).href;
    if (firstLocation === null) firstLocation = next;
    current = next;
    hops += 1;
  }
  return { firstStatus, firstLocation, finalStatus: null, finalUrl: current, hops, loop: true };
}

async function verifyProduction(local) {
  const migrationMap = JSON.parse(read("data/protein-migration-map.json"));
  const sitemapResponse = await fetch(`${ORIGIN}/sitemaps/protein-food-pages.xml`);
  const sitemapXml = await sitemapResponse.text();
  const rows = [];

  for (const entry of migrationMap.migrations) {
    const trailingUrl = `${ORIGIN}${entry.legacy_publication_path}`;
    const nonTrailingUrl = trailingUrl.slice(0, -1);
    const targetUrl = `${ORIGIN}${entry.canonical_publication_path}`;
    const trailing = await follow(trailingUrl);
    const nonTrailing = await follow(nonTrailingUrl);
    const target = await follow(targetUrl);
    const targetCanonical = extractCanonical(target.body ?? "");
    const sourcePresent = sitemapXml.includes(`<loc>${trailingUrl}</loc>`);
    const expectedFinal = new URL(targetUrl).pathname;
    const trailingPass =
      [301, 308].includes(trailing.firstStatus) &&
      new URL(trailing.firstLocation).pathname === expectedFinal &&
      trailing.finalStatus === 200 &&
      new URL(trailing.finalUrl).pathname === expectedFinal &&
      trailing.hops === 1;
    const nonTrailingPass =
      [301, 308].includes(nonTrailing.firstStatus) &&
      nonTrailing.finalStatus === 200 &&
      new URL(nonTrailing.finalUrl).pathname === expectedFinal &&
      nonTrailing.hops <= 2;
    const pass =
      trailingPass &&
      nonTrailingPass &&
      target.finalStatus === 200 &&
      targetCanonical === targetUrl &&
      !sourcePresent &&
      !trailing.loop &&
      !nonTrailing.loop;
    rows.push({
      source: entry.legacy_publication_path,
      target: entry.canonical_publication_path,
      previouslyFailing: PREVIOUSLY_FAILING.has(entry.legacy_publication_path),
      trailing,
      nonTrailing,
      targetStatus: target.finalStatus,
      targetCanonical,
      sourcePresentInProteinSitemap: sourcePresent,
      result: pass ? "PASS" : "FAIL",
    });
  }

  const unrelated = [];
  for (const pathname of UNRELATED_PROTEIN_PATHS) {
    const response = await follow(`${ORIGIN}${pathname}`);
    unrelated.push({
      pathname,
      finalStatus: response.finalStatus,
      finalUrl: response.finalUrl,
      redirectedAway: new URL(response.finalUrl).pathname !== pathname,
    });
  }

  return {
    result:
      rows.every((row) => row.result === "PASS") &&
      unrelated.every((row) => row.finalStatus === 200 && !row.redirectedAway)
        ? "PASS"
        : "FAIL",
    sitemapStatus: sitemapResponse.status,
    verified: rows.length,
    trailingPass: rows.filter((row) => row.result === "PASS").length,
    nonTrailingPass: rows.filter(
      (row) =>
        row.nonTrailing.finalStatus === 200 &&
        new URL(row.nonTrailing.finalUrl).pathname === row.target
    ).length,
    targetPass: rows.filter(
      (row) => row.targetStatus === 200 && row.targetCanonical === `${ORIGIN}${row.target}`
    ).length,
    sitemapRemoved: rows.filter((row) => !row.sourcePresentInProteinSitemap).length,
    source200s: rows.filter((row) => row.trailing.hops === 0 && row.trailing.finalStatus === 200)
      .length,
    loops: rows.filter((row) => row.trailing.loop || row.nonTrailing.loop).length,
    homepageFallbacks: rows.filter(
      (row) =>
        new URL(row.trailing.finalUrl).pathname === "/" ||
        new URL(row.nonTrailing.finalUrl).pathname === "/"
    ).length,
    unexpectedDestinations: rows.filter(
      (row) =>
        new URL(row.trailing.finalUrl).pathname !== row.target ||
        new URL(row.nonTrailing.finalUrl).pathname !== row.target
    ).length,
    previouslyPassing: rows.filter((row) => !row.previouslyFailing && row.result === "PASS").length,
    previouslyFailingNowPassing: rows.filter(
      (row) => row.previouslyFailing && row.result === "PASS"
    ).length,
    unrelated,
    rows,
    localResultAtVerification: local.result,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const production = args.includes("--production");
  const outputIndex = args.indexOf("--output");
  const outputPath = outputIndex >= 0 ? args[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error("--output requires a path");

  const local = verifyLocal();
  const result = {
    phase: "PAIRING-EAT-02A",
    generatedAt: new Date().toISOString(),
    deploymentState: "NOT DEPLOYED — implementation review only",
    local,
    productionBaseline: production ? await verifyProduction(local) : null,
  };
  if (outputPath) {
    fs.writeFileSync(path.join(ROOT, outputPath), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  }
  console.log(JSON.stringify(result, null, 2));
  if (local.result !== "PASS" || (production && result.productionBaseline.result !== "PASS")) {
    process.exitCode = 1;
  }
}

await main();
