#!/usr/bin/env node
/**
 * ONTOLOGY-03H — Protein food sitemap and crawl manifest generator.
 * Deployment metadata only — reads certified HTML from dist/.
 *
 * Run: node scripts/generate-protein-food-sitemap-03h.mjs
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { absoluteUrl } from "../lib/public-url.js";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import {
  EXPECTED_COUNTS,
  SITEMAP_DEFAULTS,
  buildSitemapIndex,
  buildUrlEntry,
  buildUrlSet,
  extractCanonicalUrl,
  loadRenderedCatalog,
  parseSitemapLocs,
  readPublicationCounts,
} from "../lib/protein-food-release.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const REPORT_PATH = path.join(ROOT, "reports/sitemap-report.json");
const HTML_RENDER_REPORT = path.join(ROOT, "reports/html-render-report.json");

const OUTPUTS = {
  index: path.join(DIST_DIR, "sitemap.xml"),
  foods: path.join(DIST_DIR, "sitemaps/protein-food-pages.xml"),
  groups: path.join(DIST_DIR, "sitemaps/protein-group-pages.xml"),
  categories: path.join(DIST_DIR, "sitemaps/protein-category-pages.xml"),
  crawlManifest: path.join(DIST_DIR, "crawl-manifest.json"),
};

const CHILD_SITEMAPS = [
  { key: "foods", file: OUTPUTS.foods, locPath: "/sitemaps/protein-food-pages.xml" },
  { key: "groups", file: OUTPUTS.groups, locPath: "/sitemaps/protein-group-pages.xml" },
  {
    key: "categories",
    file: OUTPUTS.categories,
    locPath: "/sitemaps/protein-category-pages.xml",
  },
];

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, serializeRuntime(data), "utf8");
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
}

function requireHtmlRender() {
  const result = spawnSync("npm", ["run", "generate:protein-food-html"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "HTML rendering failed";
    console.error("Sitemap generation blocked: HTML rendering did not pass.");
    console.error(err);
    process.exit(1);
  }

  if (!fs.existsSync(HTML_RENDER_REPORT)) {
    console.error("Sitemap generation blocked: html-render-report.json missing.");
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(HTML_RENDER_REPORT, "utf8"));
  if (report.overall_result !== "PASS") {
    console.error("Sitemap generation blocked: html-render-report.json is not PASS.");
    process.exit(1);
  }
}

function buildChildSitemap(pages, kind, lastmod) {
  const priority = SITEMAP_DEFAULTS.priorities[kind];
  const entries = pages.map((page) => {
    const html = fs.readFileSync(page.filePath, "utf8");
    const canonical = extractCanonicalUrl(html);
    if (!canonical) {
      throw new Error(`Missing canonical URL: ${page.relativePath}`);
    }
    return {
      page,
      canonical,
      entry: buildUrlEntry({
        loc: canonical,
        lastmod,
        changefreq: SITEMAP_DEFAULTS.changefreq,
        priority,
      }),
    };
  });

  return entries;
}

function generateSitemapArtifacts(lastmod) {
  const catalog = loadRenderedCatalog(DIST_DIR);
  const foodEntries = buildChildSitemap(catalog.foods, "food", lastmod);
  const groupEntries = buildChildSitemap(catalog.groups, "group", lastmod);
  const categoryEntries = buildChildSitemap(catalog.categories, "category", lastmod);

  const childXml = {
    foods: buildUrlSet(foodEntries.map((item) => item.entry)),
    groups: buildUrlSet(groupEntries.map((item) => item.entry)),
    categories: buildUrlSet(categoryEntries.map((item) => item.entry)),
  };

  const indexEntries = CHILD_SITEMAPS.map((child) =>
    `  <sitemap>
    <loc>${absoluteUrl(child.locPath)}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
  );

  const sitemapIndex = buildSitemapIndex(indexEntries);
  const publicationCounts = readPublicationCounts(ROOT);
  const crawlManifest = {
    version: "1.0",
    publication: "protein-food-ontology",
    generated_at: lastmod,
    pages: publicationCounts,
    artifacts: {
      html: catalog.all.length,
      schema: publicationCounts.total,
      navigation: publicationCounts.total,
      search: publicationCounts.total,
    },
  };

  return {
    catalog,
    foodEntries,
    groupEntries,
    categoryEntries,
    childXml,
    sitemapIndex,
    crawlManifest,
    publicationCounts,
  };
}

function validateSitemapArtifacts(generated) {
  const errors = [];
  const allCanonicals = new Set();
  let duplicateUrls = 0;
  let missingPages = 0;

  const groups = [
    { name: "food", pages: generated.catalog.foods, entries: generated.foodEntries },
    { name: "group", pages: generated.catalog.groups, entries: generated.groupEntries },
    {
      name: "category",
      pages: generated.catalog.categories,
      entries: generated.categoryEntries,
    },
  ];

  for (const group of groups) {
    if (group.pages.length !== group.entries.length) {
      errors.push(`${group.name} sitemap entry count mismatch`);
    }
  }

  for (const entryGroup of [
    generated.foodEntries,
    generated.groupEntries,
    generated.categoryEntries,
  ]) {
    for (const item of entryGroup) {
      if (allCanonicals.has(item.canonical)) {
        duplicateUrls += 1;
        errors.push(`Duplicate sitemap URL: ${item.canonical}`);
      }
      allCanonicals.add(item.canonical);

      const html = fs.readFileSync(item.page.filePath, "utf8");
      const canonical = extractCanonicalUrl(html);
      if (canonical !== item.canonical) {
        errors.push(`Canonical mismatch for ${item.page.relativePath}`);
      }
    }
  }

  for (const page of generated.catalog.all) {
    const html = fs.readFileSync(page.filePath, "utf8");
    const canonical = extractCanonicalUrl(html);
    if (!canonical || !allCanonicals.has(canonical)) {
      missingPages += 1;
      errors.push(`Rendered page missing from sitemaps: ${page.relativePath}`);
    }
  }

  if (generated.catalog.foods.length !== EXPECTED_COUNTS.foods) {
    errors.push(`Expected ${EXPECTED_COUNTS.foods} food pages`);
  }
  if (generated.catalog.groups.length !== EXPECTED_COUNTS.groups) {
    errors.push(`Expected ${EXPECTED_COUNTS.groups} group pages`);
  }
  if (generated.catalog.categories.length !== EXPECTED_COUNTS.categories) {
    errors.push(`Expected ${EXPECTED_COUNTS.categories} category pages`);
  }

  if (generated.crawlManifest.pages.total !== generated.catalog.all.length) {
    errors.push("Crawl manifest page total does not match rendered HTML count");
  }
  if (generated.crawlManifest.artifacts.html !== generated.catalog.all.length) {
    errors.push("Crawl manifest html count does not match rendered output");
  }

  const renderedCounts = {
    foods: generated.catalog.foods.length,
    groups: generated.catalog.groups.length,
    categories: generated.catalog.categories.length,
    total: generated.catalog.all.length,
  };

  if (JSON.stringify(renderedCounts) !== JSON.stringify(generated.crawlManifest.pages)) {
    errors.push("Crawl manifest page counts do not match rendered output");
  }

  return { errors, duplicateUrls, missingPages };
}

function packageOutputs(generated) {
  return {
    sitemapIndex: generated.sitemapIndex,
    childXml: generated.childXml,
    crawlManifest: generated.crawlManifest,
  };
}

function main() {
  requireHtmlRender();

  const lastmod = new Date().toISOString();
  const generated = generateSitemapArtifacts(lastmod);
  const validation = validateSitemapArtifacts(generated);

  const firstPass = packageOutputs(generated);
  const secondPass = packageOutputs(generateSitemapArtifacts(lastmod));
  let determinismPass =
    firstPass.sitemapIndex === secondPass.sitemapIndex &&
    firstPass.childXml.foods === secondPass.childXml.foods &&
    firstPass.childXml.groups === secondPass.childXml.groups &&
    firstPass.childXml.categories === secondPass.childXml.categories &&
    serializeRuntime(firstPass.crawlManifest) === serializeRuntime(secondPass.crawlManifest);

  if (!determinismPass) {
    validation.errors.push("Determinism check failed: sitemap regeneration mismatch");
  }

  const overall =
    validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "ONTOLOGY-03H",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      outputs: Object.values(OUTPUTS).map((p) => path.relative(ROOT, p)),
      metrics: {
        "Sitemap index": 1,
        "Food sitemap entries": generated.foodEntries.length,
        "Group sitemap entries": generated.groupEntries.length,
        "Category sitemap entries": generated.categoryEntries.length,
        "Duplicate URLs": validation.duplicateUrls,
        "Missing pages": validation.missingPages,
        "Validation errors": validation.errors.length,
        "Deterministic regeneration": determinismPass ? "PASS" : "FAIL",
        "Overall result": "FAIL",
      },
    };
    writeJson(REPORT_PATH, report);
    console.error(validation.errors.join("\n"));
    process.exit(1);
  }

  writeText(OUTPUTS.index, firstPass.sitemapIndex);
  writeText(OUTPUTS.foods, firstPass.childXml.foods);
  writeText(OUTPUTS.groups, firstPass.childXml.groups);
  writeText(OUTPUTS.categories, firstPass.childXml.categories);
  writeJson(OUTPUTS.crawlManifest, firstPass.crawlManifest);

  const allLocs = [
    ...parseSitemapLocs(firstPass.childXml.foods),
    ...parseSitemapLocs(firstPass.childXml.groups),
    ...parseSitemapLocs(firstPass.childXml.categories),
  ];

  const report = {
    phase: "ONTOLOGY-03H",
    overall_result: "PASS",
    validation_errors: [],
    outputs: Object.values(OUTPUTS).map((p) => path.relative(ROOT, p)),
    metrics: {
      "Sitemap index": 1,
      "Food sitemap entries": generated.foodEntries.length,
      "Group sitemap entries": generated.groupEntries.length,
      "Category sitemap entries": generated.categoryEntries.length,
      "Duplicate URLs": 0,
      "Missing pages": 0,
      "Validation errors": 0,
      "Deterministic regeneration": "PASS",
      "Overall result": "PASS",
      "Indexed URLs": allLocs.length,
    },
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${REPORT_PATH}`);
}

main();
