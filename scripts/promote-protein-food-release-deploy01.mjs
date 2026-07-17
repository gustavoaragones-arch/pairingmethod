#!/usr/bin/env node
/**
 * DEPLOY-01 — Promote certified protein food release to production site root.
 * Byte-copies dist/ artifacts without regenerating ontology output.
 *
 * Run: node scripts/promote-protein-food-release-deploy01.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import {
  DEPLOYMENT_MANIFESTS,
  PRODUCTION_ORIGIN,
  PROMOTION_PATHS,
  PROTEIN_SITEMAPS,
  REQUIRED_REPORTS,
} from "../lib/deployment-config.js";
import { sha256File } from "../lib/protein-food-release.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORT_PATH = path.join(ROOT, "reports/promotion-report.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, serializeRuntime(data), "utf8");
}

function requireReleaseCertification() {
  const reportPath = path.join(ROOT, REQUIRED_REPORTS.release);
  if (!fs.existsSync(reportPath)) {
    console.error("Promotion blocked: release certification report missing.");
    process.exit(1);
  }
  const report = readJson(reportPath);
  if (report.overall_result !== "PASS") {
    console.error("Promotion blocked: release certification did not pass.");
    process.exit(1);
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
  function walk(relative = "") {
    const srcDir = path.join(src, relative);
    const destDir = path.join(dest, relative);
    for (const ent of fs.readdirSync(srcDir, { withFileTypes: true })) {
      const relPath = relative ? `${relative}/${ent.name}` : ent.name;
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

function ensureSitePagesSitemap(lastmod) {
  const rootSitemap = path.join(ROOT, "sitemap.xml");
  const sitePagesPath = path.join(ROOT, "sitemaps/site-pages.xml");

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

function buildUnifiedSitemapIndex(lastmod) {
  const entries = [
    `${PRODUCTION_ORIGIN}/sitemaps/site-pages.xml`,
    ...PROTEIN_SITEMAPS.map((relPath) => `${PRODUCTION_ORIGIN}/${relPath}`),
  ];

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

function validateRobotsTxt() {
  const robotsPath = path.join(ROOT, "robots.txt");
  const errors = [];
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

function promoteProteinSitemaps() {
  const srcDir = path.join(ROOT, "dist/sitemaps");
  const destDir = path.join(ROOT, "sitemaps");
  fs.mkdirSync(destDir, { recursive: true });

  for (const file of fs.readdirSync(srcDir)) {
    if (!file.endsWith(".xml")) continue;
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
  }
}

function main() {
  requireReleaseCertification();

  const errors = [];
  const promoted = [];
  const lastmod =
    readJson(path.join(ROOT, "dist/release-manifest.json")).generated_at ??
    new Date().toISOString();

  for (const { source, target } of PROMOTION_PATHS) {
    const src = path.join(ROOT, source);
    const dest = path.join(ROOT, target);

    if (!fs.existsSync(src)) {
      errors.push(`Missing certified source directory: ${source}`);
      continue;
    }

    removeDirectory(dest);
    copyDirectory(src, dest);
    errors.push(...verifyByteIdentical(src, dest));
    promoted.push({
      source,
      target,
      html_files: countHtmlFiles(dest),
    });
  }

  for (const { source, target } of DEPLOYMENT_MANIFESTS) {
    const src = path.join(ROOT, source);
    const dest = path.join(ROOT, target);
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
    promoteProteinSitemaps();
    const sitePages = ensureSitePagesSitemap(lastmod);
    const unifiedIndex = buildUnifiedSitemapIndex(lastmod);
    fs.writeFileSync(path.join(ROOT, "sitemap.xml"), unifiedIndex, "utf8");
    promoted.push({
      source: "dist/sitemaps + existing site sitemap",
      target: "sitemap.xml",
      html_files: 0,
      site_pages_sitemap: path.relative(ROOT, sitePages.path),
    });
  } catch (err) {
    errors.push(err.message);
  }

  errors.push(...validateRobotsTxt());

  const overall = errors.length === 0 ? "PASS" : "FAIL";
  const report = {
    phase: "DEPLOY-01",
    step: "promotion",
    overall_result: overall,
    validation_errors: errors,
    promoted,
    metrics: {
      "Promotion targets": promoted.length,
      "Food pages promoted": countHtmlFiles(path.join(ROOT, "foods")),
      "Group pages promoted": countHtmlFiles(path.join(ROOT, "groups")),
      "Category pages promoted": countHtmlFiles(path.join(ROOT, "categories")),
      "Validation errors": errors.length,
      "Overall result": overall,
    },
  };

  writeJson(REPORT_PATH, report);

  if (overall === "FAIL") {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${REPORT_PATH}`);
}

main();
