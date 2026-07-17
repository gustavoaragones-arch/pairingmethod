#!/usr/bin/env node
/**
 * DEPLOY-01 — Deployment verification for protein food production integration.
 * Validates promoted site artifacts locally and optionally against a live origin.
 *
 * Run: node scripts/verify-deployment-deploy01.mjs
 * Post-deploy: DEPLOY_BASE_URL=https://pairingmethod.com node scripts/verify-deployment-deploy01.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import { escapeHtml } from "../lib/taxonomy-render.js";
import {
  CACHE_POLICY,
  EXPECTED_HTML_COUNTS,
  PRODUCTION_ORIGIN,
  PRODUCTION_HOST,
  REQUIRED_REPORTS,
  SMOKE_SAMPLE_SIZES,
  productionUrl,
} from "../lib/deployment-config.js";
import {
  EXPECTED_COUNTS,
  extractCanonicalUrl,
  extractJsonLdBlocks,
  loadRenderedCatalog,
  parseSitemapLocs,
  sha256File,
} from "../lib/protein-food-release.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DEPLOY_REPORT_PATH = path.join(ROOT, "reports/deployment-report.json");
const REDIRECT_REPORT_PATH = path.join(ROOT, "reports/redirect-audit-report.json");

const DEPLOY_BASE_URL = (process.env.DEPLOY_BASE_URL ?? "").replace(/\/$/, "");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, serializeRuntime(data), "utf8");
}

function requirePassingReleaseGate(errors) {
  for (const [name, relPath] of Object.entries(REQUIRED_REPORTS)) {
    const filePath = path.join(ROOT, relPath);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing required upstream report: ${name}`);
      continue;
    }
    const report = readJson(filePath);
    const result = report.overall_result ?? report.overall_certification;
    if (result !== "PASS") {
      errors.push(`Upstream report not PASS: ${name}`);
    }
  }

  const promotionReport = path.join(ROOT, "reports/promotion-report.json");
  if (!fs.existsSync(promotionReport)) {
    errors.push("Missing promotion report — run prepare:deployment first");
    return;
  }
  if (readJson(promotionReport).overall_result !== "PASS") {
    errors.push("Promotion report not PASS");
  }
}

function countPromotedHtml() {
  function countSection(section) {
    const base = path.join(ROOT, section);
    if (!fs.existsSync(base)) return 0;
    return fs
      .readdirSync(base, { withFileTypes: true })
      .filter(
        (ent) => ent.isDirectory() && fs.existsSync(path.join(base, ent.name, "index.html"))
      ).length;
  }

  return {
    foods: countSection("foods"),
    groups: countSection("groups"),
    categories: countSection("categories"),
    total:
      countSection("foods") + countSection("groups") + countSection("categories"),
  };
}

function validateStaticPublishing(errors, warnings) {
  const counts = countPromotedHtml();
  if (counts.foods !== EXPECTED_HTML_COUNTS.foods) {
    errors.push(`Food HTML count mismatch: expected ${EXPECTED_HTML_COUNTS.foods}, got ${counts.foods}`);
  }
  if (counts.groups !== EXPECTED_HTML_COUNTS.groups) {
    errors.push(`Group HTML count mismatch: expected ${EXPECTED_HTML_COUNTS.groups}, got ${counts.groups}`);
  }
  if (counts.categories !== EXPECTED_HTML_COUNTS.categories) {
    errors.push(
      `Category HTML count mismatch: expected ${EXPECTED_HTML_COUNTS.categories}, got ${counts.categories}`
    );
  }

  const distCatalog = loadRenderedCatalog(path.join(ROOT, "dist"));
  for (const section of ["foods", "groups", "categories"]) {
    for (const page of distCatalog[section]) {
      const promotedPath = path.join(ROOT, page.relativePath.replace(/^dist\//, ""));
      const distPath = path.join(ROOT, page.relativePath);
      if (!fs.existsSync(promotedPath)) {
        errors.push(`Missing promoted page: ${promotedPath}`);
        continue;
      }
      if (sha256File(distPath) !== sha256File(promotedPath)) {
        errors.push(`Promoted HTML is not byte-identical to dist: ${page.relativePath}`);
      }
    }
  }

  return counts;
}

function validateRobotsTxt(errors) {
  const robotsPath = path.join(ROOT, "robots.txt");
  if (!fs.existsSync(robotsPath)) {
    errors.push("robots.txt missing");
    return false;
  }

  const content = fs.readFileSync(robotsPath, "utf8");
  const sitemapLines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("Sitemap:"));

  if (sitemapLines.length !== 1) {
    errors.push(`robots.txt must contain exactly one Sitemap directive`);
    return false;
  }

  const expected = `Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml`;
  if (!sitemapLines.includes(expected)) {
    errors.push(`robots.txt sitemap must reference ${expected}`);
    return false;
  }

  if (content.includes("localhost") || content.includes("127.0.0.1")) {
    errors.push("robots.txt contains non-production host reference");
    return false;
  }

  return true;
}

function parseRedirects() {
  const redirectsPath = path.join(ROOT, "_redirects");
  if (!fs.existsSync(redirectsPath)) return [];

  return fs
    .readFileSync(redirectsPath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [from, to, code] = line.split(/\s+/);
      return { from, to, code: code ?? "301" };
    });
}

function auditRedirects(errors, warnings) {
  const rules = parseRedirects();
  const issues = [];

  const graph = new Map();
  for (const rule of rules) {
    if (!rule.from || !rule.to) continue;
    if (!graph.has(rule.from)) graph.set(rule.from, []);
    graph.get(rule.from).push(rule.to);
  }

  function detectCycle(start) {
    const stack = [start];
    const visited = new Set();
    while (stack.length) {
      const node = stack.pop();
      if (visited.has(node)) return true;
      visited.add(node);
      for (const next of graph.get(node) ?? []) {
        if (next === start) return true;
        stack.push(next);
      }
    }
    return false;
  }

  for (const rule of rules) {
    if (rule.from.includes("localhost")) {
      issues.push(`Redirect references localhost: ${rule.from}`);
    }
    if (detectCycle(rule.from)) {
      issues.push(`Potential redirect loop involving: ${rule.from}`);
    }
  }

  const httpsRule = rules.find((rule) => rule.from.startsWith("http://"));
  if (!httpsRule) {
    warnings.push("No explicit HTTP to HTTPS redirect rule found in _redirects");
  }

  const trailingSlashLegacy = rules.filter(
    (rule) => rule.from.endsWith(".html") && !rule.to.endsWith("/")
  );
  if (trailingSlashLegacy.length) {
    warnings.push(`${trailingSlashLegacy.length} .html redirect targets omit trailing slash`);
  }

  issues.forEach((issue) => errors.push(issue));

  const report = {
    phase: "DEPLOY-01",
    overall_result: issues.length === 0 ? "PASS" : "FAIL",
    redirect_rules: rules.length,
    issues,
    warnings,
    policies: {
      trailing_slash: "Protein canonical URLs use trailing slashes (/foods/<slug>/).",
      apex_www: "Production host is apex domain pairingmethod.com.",
      https: "HTTP requests redirect to HTTPS via _redirects.",
    },
  };

  writeJson(REDIRECT_REPORT_PATH, report);
  return issues.length;
}

function validateCachePolicy(errors) {
  const headersPath = path.join(ROOT, "_headers");
  const policyPath = path.join(ROOT, "deploy/cache-policy.json");

  if (!fs.existsSync(headersPath)) {
    errors.push("_headers file missing");
    return false;
  }
  if (!fs.existsSync(policyPath)) {
    errors.push("deploy/cache-policy.json missing");
    return false;
  }

  const headers = fs.readFileSync(headersPath, "utf8");
  const policy = readJson(policyPath);

  const requiredControls = [
    CACHE_POLICY.immutable_assets.cache_control,
    CACHE_POLICY.mutable_publication.cache_control,
    CACHE_POLICY.html_pages.cache_control,
  ];

  for (const control of requiredControls) {
    if (!headers.includes(control)) {
      errors.push(`_headers missing cache policy: ${control}`);
    }
  }

  if (policy.immutable_assets.cache_control !== CACHE_POLICY.immutable_assets.cache_control) {
    errors.push("deploy/cache-policy.json immutable cache mismatch");
  }

  return true;
}

function validateSitemaps(errors) {
  const indexPath = path.join(ROOT, "sitemap.xml");
  if (!fs.existsSync(indexPath)) {
    errors.push("Root sitemap.xml missing");
    return { verified: 0 };
  }

  const indexXml = fs.readFileSync(indexPath, "utf8");
  if (!indexXml.includes("<sitemapindex")) {
    errors.push("Root sitemap.xml must be a sitemap index after promotion");
  }

  const childPaths = [
    "sitemaps/site-pages.xml",
    "sitemaps/protein-food-pages.xml",
    "sitemaps/protein-group-pages.xml",
    "sitemaps/protein-category-pages.xml",
  ];

  let verified = 0;
  const allLocs = new Set();

  for (const relPath of childPaths) {
    const filePath = path.join(ROOT, relPath);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing child sitemap: ${relPath}`);
      continue;
    }
    const locs = parseSitemapLocs(fs.readFileSync(filePath, "utf8"));
    verified += locs.length;
    for (const loc of locs) {
      if (allLocs.has(loc)) errors.push(`Duplicate sitemap URL: ${loc}`);
      allLocs.add(loc);
    }
  }

  const proteinLocs = [
    ...parseSitemapLocs(fs.readFileSync(path.join(ROOT, "sitemaps/protein-food-pages.xml"), "utf8")),
    ...parseSitemapLocs(fs.readFileSync(path.join(ROOT, "sitemaps/protein-group-pages.xml"), "utf8")),
    ...parseSitemapLocs(
      fs.readFileSync(path.join(ROOT, "sitemaps/protein-category-pages.xml"), "utf8")
    ),
  ];

  if (proteinLocs.length !== EXPECTED_COUNTS.total) {
    errors.push(`Protein sitemap URL count ${proteinLocs.length} != ${EXPECTED_COUNTS.total}`);
  }

  return { verified: allLocs.size, protein: proteinLocs.length };
}

function loadPageModels() {
  return {
    foods: readJson(path.join(ROOT, "data/pages/protein-food-pages.json")).pages,
    groups: readJson(path.join(ROOT, "data/pages/protein-group-pages.json")).pages,
    categories: readJson(path.join(ROOT, "data/pages/protein-category-pages.json")).pages,
  };
}

function loadNavigation() {
  return {
    foods: readJson(path.join(ROOT, "data/navigation/protein-food-links.json")).link_sets,
    groups: readJson(path.join(ROOT, "data/navigation/protein-group-links.json")).link_sets,
    categories: readJson(path.join(ROOT, "data/navigation/protein-category-links.json")).link_sets,
  };
}

function collectNavigationLinks(linkSet) {
  const links = [];
  for (const value of Object.values(linkSet?.sections ?? {})) {
    if (!value) continue;
    if (Array.isArray(value)) {
      links.push(...value);
      continue;
    }
    if (typeof value === "object" && value.href) links.push(value);
    if (typeof value === "object") {
      for (const nested of Object.values(value)) {
        if (nested?.href) links.push(nested);
      }
    }
  }
  return links;
}

function deterministicSample(items, count, seedPrefix) {
  return [...items]
    .sort((a, b) => `${seedPrefix}:${a.slug}`.localeCompare(`${seedPrefix}:${b.slug}`))
    .slice(0, count);
}

function validateSmokeTests(errors) {
  const pages = loadPageModels();
  const navigation = loadNavigation();
  const navByPath = new Map([
    ...navigation.foods.map((set) => [set.canonical_path, set]),
    ...navigation.groups.map((set) => [set.canonical_path, set]),
    ...navigation.categories.map((set) => [set.canonical_path, set]),
  ]);

  const samples = [
    ...deterministicSample(pages.foods, SMOKE_SAMPLE_SIZES.foods, "food").map((page) => ({
      page,
      rootDir: "foods",
    })),
    ...deterministicSample(pages.groups, SMOKE_SAMPLE_SIZES.groups, "group").map((page) => ({
      page,
      rootDir: "groups",
    })),
    ...deterministicSample(pages.categories, SMOKE_SAMPLE_SIZES.categories, "category").map(
      (page) => ({
        page,
        rootDir: "categories",
      })
    ),
  ];

  let passed = 0;
  let brokenLinks = 0;

  for (const { page, rootDir } of samples) {
    const pageErrorCount = errors.length;
    const htmlPath = path.join(ROOT, rootDir, page.slug, "index.html");
    if (!fs.existsSync(htmlPath)) {
      errors.push(`Smoke test missing HTML: ${page.canonical_path}`);
      continue;
    }

    const html = fs.readFileSync(htmlPath, "utf8");
    const canonical = extractCanonicalUrl(html);

    if (!html.includes("<!DOCTYPE html>")) errors.push(`${page.slug}: invalid HTML shell`);
    if (canonical !== page.metadata.canonical) errors.push(`${page.slug}: canonical mismatch`);
    if (!html.includes(page.metadata.title)) errors.push(`${page.slug}: missing title metadata`);
    if (!extractJsonLdBlocks(html).length) errors.push(`${page.slug}: missing JSON-LD`);

    for (const [index, crumb] of (page.breadcrumbs ?? []).entries()) {
      const isCurrent = index === page.breadcrumbs.length - 1;
      if (isCurrent) {
        if (!html.includes(`<span>${escapeHtml(crumb.label)}</span>`)) {
          errors.push(`${page.slug}: current breadcrumb label missing ${crumb.label}`);
        }
        continue;
      }
      if (crumb.href !== "/" && !html.includes(`href="${crumb.href}"`)) {
        errors.push(`${page.slug}: breadcrumb missing ${crumb.href}`);
      }
    }

    const linkSet = navByPath.get(page.canonical_path);
    for (const link of collectNavigationLinks(linkSet)) {
      if (link.href?.startsWith("/")) {
        if (!html.includes(`href="${link.href}"`)) {
          errors.push(`${page.slug}: navigation link missing ${link.href}`);
        }
        if (
          (link.href.startsWith("/foods/") ||
            link.href.startsWith("/groups/") ||
            link.href.startsWith("/categories/")) &&
          !fs.existsSync(
            path.join(
              ROOT,
              link.href.replace(/^\//, "").replace(/\/$/, ""),
              "index.html"
            )
          )
        ) {
          brokenLinks += 1;
          errors.push(`${page.slug}: broken internal link ${link.href}`);
        }
      } else if (!html.includes(link.title)) {
        errors.push(`${page.slug}: navigation title missing ${link.title}`);
      }
    }

    if (errors.length === pageErrorCount) {
      passed += 1;
    }
  }

  return { passed, total: samples.length, brokenLinks };
}

async function fetchStatus(url, redirect = "manual") {
  const response = await fetch(url, { redirect });
  return {
    status: response.status,
    contentType: response.headers.get("content-type") ?? "",
    finalUrl: response.url,
  };
}

async function validateLiveDeployment(errors, warnings) {
  if (!DEPLOY_BASE_URL) {
    warnings.push("DEPLOY_BASE_URL not set — skipping live HTTP verification");
    return {
      canonical_urls_verified: 0,
      robots_verified: false,
      sitemap_verified: false,
    };
  }

  let canonicalVerified = 0;
  let robotsVerified = false;
  let sitemapVerified = false;

  const robots = await fetchStatus(`${DEPLOY_BASE_URL}/robots.txt`);
  if (robots.status !== 200) {
    errors.push(`Live robots.txt returned HTTP ${robots.status}`);
  } else if (!robots.contentType.includes("text/plain")) {
    warnings.push(`Live robots.txt content-type is ${robots.contentType}`);
  } else {
    robotsVerified = true;
  }

  const sitemap = await fetchStatus(`${DEPLOY_BASE_URL}/sitemap.xml`);
  if (sitemap.status !== 200) {
    errors.push(`Live sitemap.xml returned HTTP ${sitemap.status}`);
  } else {
    sitemapVerified = true;
  }

  for (const child of [
    "sitemaps/protein-food-pages.xml",
    "sitemaps/protein-group-pages.xml",
    "sitemaps/protein-category-pages.xml",
  ]) {
    const result = await fetchStatus(`${DEPLOY_BASE_URL}/${child}`);
    if (result.status !== 200) {
      errors.push(`Live ${child} returned HTTP ${result.status}`);
    }
  }

  const httpProbe = await fetchStatus(`http://${PRODUCTION_HOST}/foods/`, "manual");
  if (![301, 302, 307, 308].includes(httpProbe.status)) {
    warnings.push(`HTTP probe for /foods/ returned ${httpProbe.status} (expected redirect to HTTPS)`);
  }

  const samples = [
    "/foods/brisket/",
    "/groups/beef/",
    "/categories/animal-protein/",
    "/robots.txt",
  ];

  for (const pathname of samples) {
    const result = await fetchStatus(`${DEPLOY_BASE_URL}${pathname}`);
    if (result.status !== 200) {
      errors.push(`Live URL ${pathname} returned HTTP ${result.status}`);
      continue;
    }
    canonicalVerified += 1;
  }

  return {
    canonical_urls_verified: canonicalVerified,
    robots_verified: robotsVerified,
    sitemap_verified: sitemapVerified,
  };
}

async function main() {
  const errors = [];
  const warnings = [];

  requirePassingReleaseGate(errors);

  const htmlCounts = validateStaticPublishing(errors, warnings);
  const robotsVerified = validateRobotsTxt(errors);
  const redirectIssues = auditRedirects(errors, warnings);
  const cachePolicyVerified = validateCachePolicy(errors);
  const sitemapStats = validateSitemaps(errors);
  const smoke = validateSmokeTests(errors);
  const live = await validateLiveDeployment(errors, warnings);

  const overall = errors.length === 0 ? "PASS" : "FAIL";

  const report = {
    phase: "DEPLOY-01",
    deployment_gate: true,
    deploy_base_url: DEPLOY_BASE_URL || null,
    overall_result: overall,
    validation_errors: errors,
    warnings,
    metrics: {
      "HTML pages deployed": htmlCounts.total,
      "Canonical URLs verified": live.canonical_urls_verified,
      "Robots.txt verified": DEPLOY_BASE_URL ? robotsVerified && live.robots_verified : robotsVerified,
      "Sitemap URLs verified": sitemapStats.verified,
      "Redirect issues": redirectIssues,
      "Broken links": smoke.brokenLinks,
      "Cache policy verified": cachePolicyVerified,
      "Smoke tests passed": `${smoke.passed}/${smoke.total}`,
      "Deployment status": overall,
      "Live verification": DEPLOY_BASE_URL ? "enabled" : "skipped",
    },
    outputs: [path.relative(ROOT, DEPLOY_REPORT_PATH), path.relative(ROOT, REDIRECT_REPORT_PATH)],
  };

  writeJson(DEPLOY_REPORT_PATH, report);

  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${DEPLOY_REPORT_PATH}`);

  if (overall === "FAIL") {
    console.error(errors.join("\n"));
    process.exit(1);
  }
}

main();
