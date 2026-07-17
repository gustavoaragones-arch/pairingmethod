#!/usr/bin/env node
/**
 * ONTOLOGY-03I — Protein food release packaging and deployment QA.
 * Certifies the final release package before deployment.
 *
 * Run: node scripts/certify-protein-food-release-03i.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import { isResolvableHref } from "../lib/protein-food-navigation.js";
import {
  EXPECTED_COUNTS,
  PUBLICATION_ARTIFACTS,
  extractCanonicalUrl,
  extractJsonLdBlocks,
  loadRenderedCatalog,
  parseSitemapLocs,
  readPublicationCounts,
  sha256File,
} from "../lib/protein-food-release.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const REPORT_PATH = path.join(ROOT, "reports/release-certification-report.json");
const MANIFEST_PATH = path.join(DIST_DIR, "release-manifest.json");

const REQUIRED_REPORTS = {
  publication: path.join(ROOT, "reports/publication-certification-report.json"),
  html: path.join(ROOT, "reports/html-render-report.json"),
  sitemap: path.join(ROOT, "reports/sitemap-report.json"),
};

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, serializeRuntime(data), "utf8");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function requirePassingReports(errors) {
  for (const [name, filePath] of Object.entries(REQUIRED_REPORTS)) {
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing required report: ${name}`);
      continue;
    }
    const report = readJson(filePath);
    const result = report.overall_result ?? report.overall_certification;
    if (result !== "PASS") {
      errors.push(`Required report not PASS: ${name}`);
    }
  }
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

function buildHrefRegistry(pages) {
  const validHrefs = new Set(["/", "/foods/"]);
  for (const page of pages) validHrefs.add(page.canonical_path);
  return { validHrefs };
}

function loadPublicationLayers() {
  return {
    catalog: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.catalog)),
    pages: {
      foods: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.pages[0])),
      groups: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.pages[1])),
      categories: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.pages[2])),
    },
    schema: {
      foods: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.schema[0])),
      groups: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.schema[1])),
      categories: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.schema[2])),
    },
    navigation: {
      foods: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.navigation[0])),
      groups: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.navigation[1])),
      categories: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.navigation[2])),
    },
    search: {
      foods: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.search[0])),
      groups: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.search[1])),
      categories: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.search[2])),
      suggestions: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.search[3])),
    },
    projections: {
      foods: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.projections[0])),
      groups: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.projections[1])),
      categories: readJson(path.join(ROOT, PUBLICATION_ARTIFACTS.projections[2])),
    },
  };
}

function validateHtmlLayer(rendered, layers, errors) {
  const pageByPath = new Map();
  for (const page of [
    ...layers.pages.foods.pages,
    ...layers.pages.groups.pages,
    ...layers.pages.categories.pages,
  ]) {
    pageByPath.set(page.canonical_path, page);
  }

  const seenPaths = new Set();
  for (const item of rendered.all) {
    const html = fs.readFileSync(item.filePath, "utf8");
    const canonical = extractCanonicalUrl(html);
    const pagePath = canonical?.replace("https://pairingmethod.com", "");
    const page = pageByPath.get(pagePath);

    if (!page) {
      errors.push(`HTML page without view model: ${item.relativePath}`);
      continue;
    }

    if (seenPaths.has(item.relativePath)) {
      errors.push(`Duplicate HTML path: ${item.relativePath}`);
    }
    seenPaths.add(item.relativePath);

    if (canonical !== page.metadata.canonical) {
      errors.push(`HTML canonical mismatch: ${item.slug}`);
    }
  }

  if (rendered.all.length !== EXPECTED_COUNTS.total) {
    errors.push(`Expected ${EXPECTED_COUNTS.total} HTML pages, found ${rendered.all.length}`);
  }

  for (const page of pageByPath.values()) {
    const match = rendered.all.find((item) => {
      const html = fs.readFileSync(item.filePath, "utf8");
      return extractCanonicalUrl(html) === page.metadata.canonical;
    });
    if (!match) {
      errors.push(`Missing HTML page for view model: ${page.canonical_path}`);
    }
  }
}

function validateJsonLdLayer(rendered, layers, errors) {
  const schemaByPath = new Map([
    ...layers.schema.foods.schemas.map((s) => [s.canonical_path, s]),
    ...layers.schema.groups.schemas.map((s) => [s.canonical_path, s]),
    ...layers.schema.categories.schemas.map((s) => [s.canonical_path, s]),
  ]);

  for (const item of rendered.all) {
    const html = fs.readFileSync(item.filePath, "utf8");
    const canonical = extractCanonicalUrl(html);
    const pagePath = canonical?.replace("https://pairingmethod.com", "");
    const schema = schemaByPath.get(pagePath);

    if (!schema) {
      errors.push(`Missing schema for HTML page: ${item.slug}`);
      continue;
    }

    const extracted = extractJsonLdBlocks(html);
    if (!extracted.length) {
      errors.push(`HTML missing embedded JSON-LD: ${item.slug}`);
    }
    if (serializeRuntime(extracted) !== serializeRuntime(schema.json_ld)) {
      errors.push(`JSON-LD mismatch on page: ${item.slug}`);
    }
  }
}

function validateNavigationLayer(layers, registry, errors) {
  let brokenLinks = 0;
  const allLinkSets = [
    ...layers.navigation.foods.link_sets,
    ...layers.navigation.groups.link_sets,
    ...layers.navigation.categories.link_sets,
  ];

  for (const linkSet of allLinkSets) {
    for (const link of collectNavigationLinks(linkSet)) {
      if (!link.href?.startsWith("/")) continue;
      if (!isResolvableHref(link.href, registry)) {
        brokenLinks += 1;
        errors.push(`${linkSet.slug}: broken navigation link ${link.href}`);
      }
    }
  }

  return brokenLinks;
}

function validateSearchLayer(layers, errors) {
  const foodDocs = layers.search.foods.documents.length;
  const groupDocs = layers.search.groups.documents.length;
  const categoryDocs = layers.search.categories.documents.length;
  const suggestions = layers.search.suggestions.suggestions.length;

  if (foodDocs !== EXPECTED_COUNTS.foods) {
    errors.push(`Food search document count mismatch: ${foodDocs}`);
  }
  if (groupDocs !== EXPECTED_COUNTS.groups) {
    errors.push(`Group search document count mismatch: ${groupDocs}`);
  }
  if (categoryDocs !== EXPECTED_COUNTS.categories) {
    errors.push(`Category search document count mismatch: ${categoryDocs}`);
  }
  if (suggestions !== EXPECTED_COUNTS.total) {
    errors.push(`Suggestion count mismatch: ${suggestions}`);
  }
}

function validateSitemapLayer(rendered, errors) {
  const sitemapFiles = [
    path.join(DIST_DIR, "sitemaps/protein-food-pages.xml"),
    path.join(DIST_DIR, "sitemaps/protein-group-pages.xml"),
    path.join(DIST_DIR, "sitemaps/protein-category-pages.xml"),
  ];

  if (!fs.existsSync(path.join(DIST_DIR, "sitemap.xml"))) {
    errors.push("Missing dist/sitemap.xml");
  }
  if (!fs.existsSync(path.join(DIST_DIR, "crawl-manifest.json"))) {
    errors.push("Missing dist/crawl-manifest.json");
  }

  const allLocs = [];
  const locSet = new Set();
  for (const file of sitemapFiles) {
    if (!fs.existsSync(file)) {
      errors.push(`Missing sitemap: ${path.relative(ROOT, file)}`);
      continue;
    }
    const locs = parseSitemapLocs(fs.readFileSync(file, "utf8"));
    allLocs.push(...locs);
    for (const loc of locs) {
      if (locSet.has(loc)) errors.push(`Duplicate sitemap URL: ${loc}`);
      locSet.add(loc);
    }
  }

  for (const item of rendered.all) {
    const html = fs.readFileSync(item.filePath, "utf8");
    const canonical = extractCanonicalUrl(html);
    if (!canonical || !locSet.has(canonical)) {
      errors.push(`Sitemap missing rendered page: ${item.relativePath}`);
    }
  }

  if (allLocs.length !== rendered.all.length) {
    errors.push(`Sitemap URL count ${allLocs.length} does not match rendered pages ${rendered.all.length}`);
  }

  return allLocs.length;
}

function validatePublicationChain(layers, rendered, errors) {
  const entities = [
    ...layers.catalog.protein_foods.map((f) => ({ id: f.id, kind: "food" })),
    ...layers.catalog.groups.map((g) => ({ id: g.id, kind: "group" })),
    ...layers.catalog.categories.map((c) => ({ id: c.id, kind: "category" })),
  ];

  const projectionById = new Map([
    ...layers.projections.foods.projections.map((p) => [p.identity.id, p]),
    ...layers.projections.groups.projections.map((p) => [p.identity.id, p]),
    ...layers.projections.categories.projections.map((p) => [p.identity.id, p]),
  ]);

  const pageByProjection = new Map();
  for (const page of [
    ...layers.pages.foods.pages,
    ...layers.pages.groups.pages,
    ...layers.pages.categories.pages,
  ]) {
    pageByProjection.set(page.projection_id, page);
  }

  const schemaByPath = new Map([
    ...layers.schema.foods.schemas.map((s) => [s.canonical_path, s]),
    ...layers.schema.groups.schemas.map((s) => [s.canonical_path, s]),
    ...layers.schema.categories.schemas.map((s) => [s.canonical_path, s]),
  ]);

  const navByPath = new Map([
    ...layers.navigation.foods.link_sets.map((n) => [n.canonical_path, n]),
    ...layers.navigation.groups.link_sets.map((n) => [n.canonical_path, n]),
    ...layers.navigation.categories.link_sets.map((n) => [n.canonical_path, n]),
  ]);

  const searchDocByPath = new Map([
    ...layers.search.foods.documents.map((d) => [d.canonical_path, d]),
    ...layers.search.groups.documents.map((d) => [d.canonical_path, d]),
    ...layers.search.categories.documents.map((d) => [d.canonical_path, d]),
  ]);

  const htmlByCanonical = new Map();
  for (const item of rendered.all) {
    const html = fs.readFileSync(item.filePath, "utf8");
    const canonical = extractCanonicalUrl(html);
    const pathKey = canonical?.replace("https://pairingmethod.com", "");
    if (pathKey) htmlByCanonical.set(pathKey, item);
  }

  const sitemapLocs = new Set(
    [
      path.join(DIST_DIR, "sitemaps/protein-food-pages.xml"),
      path.join(DIST_DIR, "sitemaps/protein-group-pages.xml"),
      path.join(DIST_DIR, "sitemaps/protein-category-pages.xml"),
    ]
      .filter((file) => fs.existsSync(file))
      .flatMap((file) => parseSitemapLocs(fs.readFileSync(file, "utf8")))
  );

  for (const entity of entities) {
    const projection = projectionById.get(entity.id);
    if (!projection) errors.push(`Chain broken at projection: ${entity.id}`);

    const page = pageByProjection.get(entity.id);
    if (!page) {
      errors.push(`Chain broken at page: ${entity.id}`);
      continue;
    }

    if (!schemaByPath.has(page.canonical_path)) {
      errors.push(`Chain broken at schema: ${entity.id}`);
    }
    if (!navByPath.has(page.canonical_path)) {
      errors.push(`Chain broken at navigation: ${entity.id}`);
    }
    if (!searchDocByPath.has(page.canonical_path)) {
      errors.push(`Chain broken at search: ${entity.id}`);
    }
    if (!htmlByCanonical.has(page.canonical_path)) {
      errors.push(`Chain broken at HTML: ${entity.id}`);
    }

    const absoluteCanonical = page.metadata.canonical;
    if (!sitemapLocs.has(absoluteCanonical)) {
      errors.push(`Chain broken at sitemap: ${entity.id}`);
    }
  }
}

function buildChecksums() {
  const checksums = {};
  for (const [key, value] of Object.entries(PUBLICATION_ARTIFACTS)) {
    if (Array.isArray(value)) {
      checksums[key] = {};
      for (const relPath of value) {
        const fullPath = path.join(ROOT, relPath);
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          checksums[key][relPath] = sha256File(fullPath);
        }
      }
      continue;
    }

    const fullPath = path.join(ROOT, value);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      checksums[key] = sha256File(fullPath);
    }
  }
  return checksums;
}

function buildReleaseManifest(layers, certification) {
  const generatedAt = new Date().toISOString();
  return {
    release_version: layers.catalog.meta?.food_ontology_version ?? "1.0",
    generated_at: generatedAt,
    publication: "protein-food-ontology",
    catalog_version: layers.catalog.meta?.catalog_version ?? "unknown",
    artifacts: {
      catalog: PUBLICATION_ARTIFACTS.catalog,
      runtime: PUBLICATION_ARTIFACTS.runtime,
      relationships: PUBLICATION_ARTIFACTS.relationships,
      projections: PUBLICATION_ARTIFACTS.projections,
      pages: PUBLICATION_ARTIFACTS.pages,
      schema: PUBLICATION_ARTIFACTS.schema,
      navigation: PUBLICATION_ARTIFACTS.navigation,
      search: PUBLICATION_ARTIFACTS.search,
      html: PUBLICATION_ARTIFACTS.html,
      sitemaps: PUBLICATION_ARTIFACTS.sitemaps,
    },
    pages: readPublicationCounts(ROOT),
    certification,
    checksums: buildChecksums(),
  };
}

function main() {
  const errors = [];
  const warnings = [];

  requirePassingReports(errors);

  for (const relPath of [
    ...PUBLICATION_ARTIFACTS.pages,
    ...PUBLICATION_ARTIFACTS.schema,
    ...PUBLICATION_ARTIFACTS.navigation,
    ...PUBLICATION_ARTIFACTS.search,
    ...PUBLICATION_ARTIFACTS.sitemaps,
  ]) {
    if (!fs.existsSync(path.join(ROOT, relPath))) {
      errors.push(`Missing release artifact: ${relPath}`);
    }
  }

  const rendered = loadRenderedCatalog(DIST_DIR);
  const layers = loadPublicationLayers();
  const registry = buildHrefRegistry([
    ...layers.pages.foods.pages,
    ...layers.pages.groups.pages,
    ...layers.pages.categories.pages,
  ]);

  validateHtmlLayer(rendered, layers, errors);
  validateJsonLdLayer(rendered, layers, errors);
  const brokenLinks = validateNavigationLayer(layers, registry, errors);
  validateSearchLayer(layers, errors);
  const sitemapUrls = validateSitemapLayer(rendered, errors);
  validatePublicationChain(layers, rendered, errors);

  const certification = errors.length === 0 ? "PASS" : "FAIL";
  const manifest = buildReleaseManifest(layers, certification);

  const report = {
    phase: "ONTOLOGY-03I",
    overall_result: certification,
    deployment_gate: true,
    validation_errors: errors,
    warnings,
    metrics: {
      "HTML pages": rendered.all.length,
      "Broken navigation links": brokenLinks,
      "Sitemap URLs": sitemapUrls,
      "Search suggestions": layers.search.suggestions.suggestions.length,
      "Publication entities": EXPECTED_COUNTS.total,
      "Validation errors": errors.length,
      "Overall result": certification,
    },
    outputs: [
      "dist/release-manifest.json",
      "reports/release-certification-report.json",
    ],
  };

  if (certification === "FAIL") {
    writeJson(REPORT_PATH, report);
    console.error(errors.join("\n"));
    process.exit(1);
  }

  writeJson(MANIFEST_PATH, manifest);
  writeJson(REPORT_PATH, report);

  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Manifest: ${MANIFEST_PATH}`);
  console.log(`Report: ${REPORT_PATH}`);
}

main();
