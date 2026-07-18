/**
 * FOOD-04F — Generalized deployment promotion and verification (DEPLOY-01).
 */

import fs from "fs";
import path from "path";
import { escapeHtml } from "../taxonomy-render.js";
import {
  CACHE_POLICY,
  DEPLOYMENT_MANIFESTS,
  DOMAIN_DEPLOYMENTS,
  PRODUCTION_HOST,
  PRODUCTION_ORIGIN,
  resolveDomainDeployments,
} from "../deployment-config.js";
import {
  discoverRenderedHtmlPages,
  extractCanonicalUrl,
  extractJsonLdBlocks,
  parseSitemapLocs,
  sha256File,
} from "../protein-food-release.js";
import { readJson, writeJson } from "./utils.js";

const DEPLOY_REPORT_PATH = path.join(process.cwd(), "reports/deployment-report.json");
const REDIRECT_REPORT_PATH = path.join(process.cwd(), "reports/redirect-audit-report.json");
const PROMOTION_REPORT_PATH = path.join(process.cwd(), "reports/promotion-report.json");

function rootDir() {
  return process.cwd();
}

function joinRoot(...segments) {
  return path.join(rootDir(), ...segments);
}

function requireReleaseCertification(deployment) {
  const reportPath = joinRoot(deployment.reports.release);
  if (!fs.existsSync(reportPath)) {
    throw new Error(`Promotion blocked: release certification report missing for ${deployment.id}`);
  }
  const report = readJson(reportPath);
  if (report.overall_result !== "PASS") {
    throw new Error(`Promotion blocked: release certification did not pass for ${deployment.id}`);
  }
}

function removeDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  fs.rmSync(dirPath, { recursive: true, force: true });
}

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, ent.name);
    const destPath = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function countHtmlFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  let count = 0;
  for (const ent of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const indexFile = path.join(dirPath, ent.name, "index.html");
    if (fs.existsSync(indexFile)) count += 1;
  }
  return count;
}

function verifyByteIdentical(src, dest) {
  const errors = [];
  function walk(relativePath = "") {
    const srcDir = path.join(src, relativePath);
    for (const ent of fs.readdirSync(srcDir, { withFileTypes: true })) {
      const relPath = relativePath ? `${relativePath}/${ent.name}` : ent.name;
      const srcPath = path.join(src, relPath);
      const destPath = path.join(dest, relPath);
      if (ent.isDirectory()) {
        walk(relPath);
        continue;
      }
      if (!fs.existsSync(destPath)) {
        errors.push(`Missing promoted file: ${destPath}`);
        continue;
      }
      if (sha256File(srcPath) !== sha256File(destPath)) {
        errors.push(`Byte mismatch after promotion: ${relPath}`);
      }
    }
  }
  walk();
  return errors;
}

function ensureSitePagesSitemap() {
  const rootSitemap = joinRoot("sitemap.xml");
  const sitePagesPath = joinRoot("sitemaps/site-pages.xml");

  if (!fs.existsSync(rootSitemap)) {
    throw new Error("Root sitemap.xml missing");
  }

  const xml = fs.readFileSync(rootSitemap, "utf8");
  if (xml.includes("<urlset")) {
    fs.mkdirSync(path.dirname(sitePagesPath), { recursive: true });
    fs.writeFileSync(sitePagesPath, xml, "utf8");
    return { created: true, path: sitePagesPath };
  }

  if (!fs.existsSync(sitePagesPath)) {
    throw new Error("Expected sitemaps/site-pages.xml when root sitemap is already an index");
  }

  return { created: false, path: sitePagesPath };
}

function buildUnifiedSitemapIndex(deployments, lastmod) {
  const sitemapPaths = new Set(["sitemaps/site-pages.xml"]);
  for (const deployment of deployments) {
    for (const relPath of deployment.sitemapFiles) {
      sitemapPaths.add(relPath);
    }
  }

  const entries = [...sitemapPaths].sort().map((relPath) => `${PRODUCTION_ORIGIN}/${relPath}`);
  const body = entries
    .map(
      (loc) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    )
    .join("\n\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}

function validateRobotsTxt(errors) {
  const robotsPath = joinRoot("robots.txt");
  if (!fs.existsSync(robotsPath)) {
    errors.push("robots.txt missing");
    return errors;
  }

  const content = fs.readFileSync(robotsPath, "utf8");
  const sitemapLines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("Sitemap:"));

  if (sitemapLines.length !== 1) {
    errors.push(`robots.txt must contain exactly one Sitemap directive, found ${sitemapLines.length}`);
  }

  const expected = `Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml`;
  if (!sitemapLines.includes(expected)) {
    errors.push(`robots.txt sitemap must be ${expected}`);
  }

  if (content.includes("localhost") || content.includes("127.0.0.1")) {
    errors.push("robots.txt must not reference localhost");
  }

  return errors;
}

function promoteDistSitemaps() {
  const srcDir = joinRoot("dist/sitemaps");
  const destDir = joinRoot("sitemaps");
  fs.mkdirSync(destDir, { recursive: true });

  if (!fs.existsSync(srcDir)) {
    throw new Error("Missing dist/sitemaps directory");
  }

  for (const file of fs.readdirSync(srcDir)) {
    if (!file.endsWith(".xml")) continue;
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
  }
}

export function runPromoteStage(domains) {
  const deployments = resolveDomainDeployments(domains);
  const errors = [];
  const promoted = [];

  for (const deployment of deployments) {
    try {
      requireReleaseCertification(deployment);
    } catch (err) {
      errors.push(err.message);
    }
  }

  if (errors.length > 0) {
    writeJson(PROMOTION_REPORT_PATH, {
      phase: "DEPLOY-01",
      step: "promotion",
      overall_result: "FAIL",
      validation_errors: errors,
      promoted: [],
      metrics: { "Overall result": "FAIL" },
    });
    console.error(errors.join("\n"));
    process.exit(1);
  }

  const lastmod =
    readJson(joinRoot("dist/release-manifest.json")).generated_at ?? new Date().toISOString();

  for (const deployment of deployments) {
    for (const { source, target } of deployment.promotionPaths) {
      const src = joinRoot(source);
      const dest = joinRoot(target);

      if (!fs.existsSync(src)) {
        errors.push(`Missing certified source directory: ${source}`);
        continue;
      }

      removeDirectory(dest);
      copyDirectory(src, dest);
      errors.push(...verifyByteIdentical(src, dest));
      promoted.push({
        domain: deployment.id,
        source,
        target,
        html_files: countHtmlFiles(dest),
      });
    }
  }

  for (const { source, target } of DEPLOYMENT_MANIFESTS) {
    const src = joinRoot(source);
    const dest = joinRoot(target);
    if (!fs.existsSync(src)) {
      errors.push(`Missing certified manifest: ${source}`);
      continue;
    }
    fs.copyFileSync(src, dest);
    if (sha256File(src) !== sha256File(dest)) {
      errors.push(`Manifest byte mismatch: ${target}`);
    }
    promoted.push({ source, target, html_files: 0 });
  }

  try {
    promoteDistSitemaps();
    const sitePages = ensureSitePagesSitemap();
    const unifiedIndex = buildUnifiedSitemapIndex(deployments, lastmod);
    fs.writeFileSync(joinRoot("sitemap.xml"), unifiedIndex, "utf8");
    promoted.push({
      source: "dist/sitemaps + existing site sitemap",
      target: "sitemap.xml",
      html_files: 0,
      site_pages_sitemap: path.relative(rootDir(), sitePages.path),
    });
  } catch (err) {
    errors.push(err.message);
  }

  validateRobotsTxt(errors);

  const overall = errors.length === 0 ? "PASS" : "FAIL";
  const metrics = {
    "Promotion targets": promoted.length,
    "Validation errors": errors.length,
    "Overall result": overall,
  };

  for (const deployment of deployments) {
    for (const [layer, target] of [
      ["leaf", deployment.promotedTargets[0]],
      ["groups", deployment.promotedTargets[1]],
      ["categories", deployment.promotedTargets[2]],
    ]) {
      metrics[`${deployment.id} ${layer} pages promoted`] = countHtmlFiles(joinRoot(target));
    }
  }

  const report = {
    phase: "DEPLOY-01",
    step: "promotion",
    domains: deployments.map((deployment) => deployment.id),
    overall_result: overall,
    validation_errors: errors,
    promoted,
    metrics,
  };

  writeJson(PROMOTION_REPORT_PATH, report);

  if (overall === "FAIL") {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${PROMOTION_REPORT_PATH}`);
  return report;
}

function requirePassingReleaseGate(deployments, errors) {
  for (const deployment of deployments) {
    for (const [name, relPath] of Object.entries(deployment.reports)) {
      if (name === "promotion") continue;
      const filePath = joinRoot(relPath);
      if (!fs.existsSync(filePath)) {
        errors.push(`Missing required upstream report (${deployment.id}): ${name}`);
        continue;
      }
      const report = readJson(filePath);
      const result = report.overall_result ?? report.overall_certification;
      if (result !== "PASS") {
        errors.push(`Upstream report not PASS (${deployment.id}): ${name}`);
      }
    }
  }

  if (!fs.existsSync(PROMOTION_REPORT_PATH)) {
    errors.push("Missing promotion report — run prepare:deployment first");
    return;
  }
  if (readJson(PROMOTION_REPORT_PATH).overall_result !== "PASS") {
    errors.push("Promotion report not PASS");
  }
}

function countPromotedHtml(deployment) {
  function countSection(section) {
    const base = joinRoot(section);
    if (!fs.existsSync(base)) return 0;
    return fs
      .readdirSync(base, { withFileTypes: true })
      .filter(
        (ent) => ent.isDirectory() && fs.existsSync(path.join(base, ent.name, "index.html"))
      ).length;
  }

  const leaf = countSection(deployment.promotedTargets[0]);
  const groups = countSection(deployment.promotedTargets[1]);
  const categories = countSection(deployment.promotedTargets[2]);

  return {
    leaf,
    groups,
    categories,
    total: leaf + groups + categories,
  };
}

function discoverDistPages(deployment) {
  const distRoot = joinRoot("dist");
  const pages = [];
  for (const section of deployment.htmlDistSections) {
    pages.push(...discoverRenderedHtmlPages(distRoot, section));
  }
  return pages;
}

function validateStaticPublishing(deployments, errors) {
  const countsByDomain = {};

  for (const deployment of deployments) {
    const counts = countPromotedHtml(deployment);
    countsByDomain[deployment.id] = counts;
    const expected = deployment.expectedHtmlCounts;

    if (counts.leaf !== expected.leaf) {
      errors.push(
        `${deployment.id} leaf HTML count mismatch: expected ${expected.leaf}, got ${counts.leaf}`
      );
    }
    if (counts.groups !== expected.groups) {
      errors.push(
        `${deployment.id} group HTML count mismatch: expected ${expected.groups}, got ${counts.groups}`
      );
    }
    if (counts.categories !== expected.categories) {
      errors.push(
        `${deployment.id} category HTML count mismatch: expected ${expected.categories}, got ${counts.categories}`
      );
    }

    for (const page of discoverDistPages(deployment)) {
      const promotedPath = joinRoot(page.relativePath.replace(/^dist\//, ""));
      const distPath = joinRoot(page.relativePath);
      if (!fs.existsSync(promotedPath)) {
        errors.push(`Missing promoted page (${deployment.id}): ${promotedPath}`);
        continue;
      }
      if (sha256File(distPath) !== sha256File(promotedPath)) {
        errors.push(`Promoted HTML is not byte-identical to dist (${deployment.id}): ${page.relativePath}`);
      }
    }
  }

  return countsByDomain;
}

function parseRedirects() {
  const redirectsPath = joinRoot("_redirects");
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
      trailing_slash: "Canonical ontology URLs use trailing slashes.",
      apex_www: "Production host is apex domain pairingmethod.com.",
      https: "HTTP requests redirect to HTTPS via _redirects.",
    },
  };

  writeJson(REDIRECT_REPORT_PATH, report);
  return issues.length;
}

function validateCachePolicy(errors) {
  const headersPath = joinRoot("_headers");
  const policyPath = joinRoot("deploy/cache-policy.json");

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

function validateSitemaps(deployments, errors) {
  const indexPath = joinRoot("sitemap.xml");
  if (!fs.existsSync(indexPath)) {
    errors.push("Root sitemap.xml missing");
    return { verified: 0 };
  }

  const indexXml = fs.readFileSync(indexPath, "utf8");
  if (!indexXml.includes("<sitemapindex")) {
    errors.push("Root sitemap.xml must be a sitemap index after promotion");
  }

  const childPaths = new Set(["sitemaps/site-pages.xml"]);
  for (const deployment of deployments) {
    for (const relPath of deployment.sitemapFiles) {
      childPaths.add(relPath);
    }
  }

  let verified = 0;
  const allLocs = new Set();

  for (const relPath of [...childPaths].sort()) {
    const filePath = joinRoot(relPath);
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

  for (const deployment of deployments) {
    const domainLocs = deployment.sitemapFiles.flatMap((relPath) => {
      const filePath = joinRoot(relPath);
      if (!fs.existsSync(filePath)) return [];
      return parseSitemapLocs(fs.readFileSync(filePath, "utf8"));
    });

    if (domainLocs.length !== deployment.expectedHtmlCounts.total) {
      errors.push(
        `${deployment.id} sitemap URL count ${domainLocs.length} != ${deployment.expectedHtmlCounts.total}`
      );
    }
  }

  return { verified: allLocs.size };
}

function loadPageModels(deployment) {
  return {
    leaf: readJson(joinRoot(deployment.pageModelPaths.leaf)).pages,
    group: readJson(joinRoot(deployment.pageModelPaths.group)).pages,
    category: readJson(joinRoot(deployment.pageModelPaths.category)).pages,
  };
}

function loadNavigation(deployment) {
  return {
    leaf: readJson(joinRoot(deployment.navigationPaths.leaf)).link_sets,
    group: readJson(joinRoot(deployment.navigationPaths.group)).link_sets,
    category: readJson(joinRoot(deployment.navigationPaths.category)).link_sets,
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

function promotedHtmlExists(href) {
  const normalized = href.replace(/^\//, "").replace(/\/$/, "");
  return fs.existsSync(joinRoot(normalized, "index.html"));
}

function validateSmokeTests(deployments, errors) {
  let passed = 0;
  let total = 0;
  let brokenLinks = 0;

  for (const deployment of deployments) {
    const pages = loadPageModels(deployment);
    const navigation = loadNavigation(deployment);
    const navByPath = new Map([
      ...navigation.leaf.map((set) => [set.canonical_path, set]),
      ...navigation.group.map((set) => [set.canonical_path, set]),
      ...navigation.category.map((set) => [set.canonical_path, set]),
    ]);

    const samples = [
      ...deterministicSample(pages.leaf, deployment.smokeSampleSizes.leaf, "leaf").map((page) => ({
        page,
        rootDir: deployment.promotedTargets[0],
      })),
      ...deterministicSample(pages.group, deployment.smokeSampleSizes.groups, "group").map((page) => ({
        page,
        rootDir: deployment.promotedTargets[1],
      })),
      ...deterministicSample(pages.category, deployment.smokeSampleSizes.categories, "category").map(
        (page) => ({
          page,
          rootDir: deployment.promotedTargets[2],
        })
      ),
    ];

    for (const { page, rootDir: promotedRoot } of samples) {
      total += 1;
      const pageErrorCount = errors.length;
      const htmlPath = joinRoot(promotedRoot, page.slug, "index.html");
      if (!fs.existsSync(htmlPath)) {
        errors.push(`Smoke test missing HTML (${deployment.id}): ${page.canonical_path}`);
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
          const isInternal = deployment.internalUrlPrefixes.some((prefix) => link.href.startsWith(prefix));
          if (isInternal && !promotedHtmlExists(link.href)) {
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
  }

  return { passed, total, brokenLinks };
}

async function fetchStatus(url, redirect = "manual") {
  const response = await fetch(url, { redirect });
  return {
    status: response.status,
    contentType: response.headers.get("content-type") ?? "",
    finalUrl: response.url,
  };
}

async function validateLiveDeployment(deployments, errors, warnings) {
  const deployBaseUrl = (process.env.DEPLOY_BASE_URL ?? "").replace(/\/$/, "");
  if (!deployBaseUrl) {
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

  const robots = await fetchStatus(`${deployBaseUrl}/robots.txt`);
  if (robots.status !== 200) {
    errors.push(`Live robots.txt returned HTTP ${robots.status}`);
  } else if (!robots.contentType.includes("text/plain")) {
    warnings.push(`Live robots.txt content-type is ${robots.contentType}`);
  } else {
    robotsVerified = true;
  }

  const sitemap = await fetchStatus(`${deployBaseUrl}/sitemap.xml`);
  if (sitemap.status !== 200) {
    errors.push(`Live sitemap.xml returned HTTP ${sitemap.status}`);
  } else {
    sitemapVerified = true;
  }

  for (const deployment of deployments) {
    for (const child of deployment.sitemapFiles) {
      const result = await fetchStatus(`${deployBaseUrl}/${child}`);
      if (result.status !== 200) {
        errors.push(`Live ${child} returned HTTP ${result.status}`);
      }
    }
  }

  const httpProbe = await fetchStatus(`http://${PRODUCTION_HOST}${deployments[0].hubPath}`, "manual");
  if (![301, 302, 307, 308].includes(httpProbe.status)) {
    warnings.push(`HTTP probe for hub returned ${httpProbe.status} (expected redirect to HTTPS)`);
  }

  const samples = [
    ...deployments.flatMap((deployment) => deployment.liveSamples ?? []),
    "/robots.txt",
  ];

  for (const pathname of samples) {
    const url = `${deployBaseUrl}${pathname}`;
    const result = await fetchStatus(url);
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

export async function runVerifyDeployment(domains) {
  const deployments = resolveDomainDeployments(domains);
  const errors = [];
  const warnings = [];

  requirePassingReleaseGate(deployments, errors);

  const htmlCounts = validateStaticPublishing(deployments, errors);
  const robotsVerified = validateRobotsTxt(errors).length === 0;
  const redirectIssues = auditRedirects(errors, warnings);
  const cachePolicyVerified = validateCachePolicy(errors);
  const sitemapStats = validateSitemaps(deployments, errors);
  const smoke = validateSmokeTests(deployments, errors);
  const live = await validateLiveDeployment(deployments, errors, warnings);

  const overall = errors.length === 0 ? "PASS" : "FAIL";
  const totalHtml = Object.values(htmlCounts).reduce((sum, counts) => sum + counts.total, 0);

  const report = {
    phase: "DEPLOY-01",
    deployment_gate: true,
    domains: deployments.map((deployment) => deployment.id),
    deploy_base_url: process.env.DEPLOY_BASE_URL?.replace(/\/$/, "") || null,
    overall_result: overall,
    validation_errors: errors,
    warnings,
    metrics: {
      "HTML pages deployed": totalHtml,
      "Canonical URLs verified": live.canonical_urls_verified,
      "Robots.txt verified": process.env.DEPLOY_BASE_URL
        ? robotsVerified && live.robots_verified
        : robotsVerified,
      "Sitemap URLs verified": sitemapStats.verified,
      "Redirect issues": redirectIssues,
      "Broken links": smoke.brokenLinks,
      "Cache policy verified": cachePolicyVerified,
      "Smoke tests passed": `${smoke.passed}/${smoke.total}`,
      "Deployment status": overall,
      "Live verification": process.env.DEPLOY_BASE_URL ? "enabled" : "skipped",
    },
    outputs: [
      path.relative(rootDir(), DEPLOY_REPORT_PATH),
      path.relative(rootDir(), REDIRECT_REPORT_PATH),
    ],
  };

  writeJson(DEPLOY_REPORT_PATH, report);

  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${DEPLOY_REPORT_PATH}`);

  if (overall === "FAIL") {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  return report;
}

export { DOMAIN_DEPLOYMENTS };
