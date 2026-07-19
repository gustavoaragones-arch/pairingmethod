/**
 * FOOD-04F — Generalized release packaging and deployment QA (ONTOLOGY-03I).
 * Certifies the final release package before deployment.
 */

import fs from "fs";
import path from "path";
import { serializeRuntime } from "../../scripts/bootstrap-protein-food-catalog.js";
import { PRODUCTION_ORIGIN } from "../deployment-config.js";
import { getDomainConfig } from "../food-domain-config.js";
import { isResolvableHref } from "../protein-food-navigation.js";
import {
  discoverRenderedHtmlPages,
  extractCanonicalUrl,
  extractJsonLdBlocks,
  parseSitemapLocs,
  sha256File,
} from "../protein-food-release.js";
import { readJson, relative, writeJson } from "./utils.js";

function resolveDomain(domainOrId) {
  return typeof domainOrId === "string" ? getDomainConfig(domainOrId) : domainOrId;
}

function releasePhase(domain) {
  return `${domain.phasePrefix}I`;
}

function distRoot(domain) {
  return path.join(domain.root, "dist");
}

function htmlSectionName(htmlPath) {
  return path.basename(htmlPath);
}

function loadRenderedCatalog(domain) {
  const root = distRoot(domain);
  const leaf = discoverRenderedHtmlPages(root, htmlSectionName(domain.paths.html.leaf));
  const group = discoverRenderedHtmlPages(root, htmlSectionName(domain.paths.html.group));
  const category = discoverRenderedHtmlPages(root, htmlSectionName(domain.paths.html.category));
  return { leaf, group, category, all: [...leaf, ...group, ...category] };
}

function relativeArtifactPath(domain, filePath) {
  return relative(domain.root, filePath);
}

function readPublicationCounts(domain) {
  const leaf = readJson(domain.paths.pages.leaf);
  const group = readJson(domain.paths.pages.group);
  const category = readJson(domain.paths.pages.category);

  return {
    leaf: leaf.pages.length,
    groups: group.pages.length,
    categories: category.pages.length,
    total: leaf.pages.length + group.pages.length + category.pages.length,
  };
}

function requirePassingReports(domain, errors) {
  const required = {
    publication: domain.paths.reports.publication,
    html: domain.paths.reports.html,
    sitemap: domain.paths.reports.sitemap,
  };

  for (const [name, filePath] of Object.entries(required)) {
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

function buildHrefRegistry(domain, pages) {
  const validHrefs = new Set(["/", domain.urls.hubPath]);
  for (const page of pages) validHrefs.add(page.canonical_path);
  return { validHrefs };
}

function loadPublicationLayers(domain) {
  return {
    catalog: readJson(domain.paths.catalog),
    pages: {
      leaf: readJson(domain.paths.pages.leaf),
      group: readJson(domain.paths.pages.group),
      category: readJson(domain.paths.pages.category),
    },
    schema: {
      leaf: readJson(domain.paths.schema.leaf),
      group: readJson(domain.paths.schema.group),
      category: readJson(domain.paths.schema.category),
    },
    navigation: {
      leaf: readJson(domain.paths.navigation.leaf),
      group: readJson(domain.paths.navigation.group),
      category: readJson(domain.paths.navigation.category),
    },
    search: {
      leaf: readJson(domain.paths.search.leaf),
      group: readJson(domain.paths.search.group),
      category: readJson(domain.paths.search.category),
      suggestions: readJson(domain.paths.search.suggestions),
    },
    projections: {
      leaf: readJson(domain.paths.projections.leaf),
      group: readJson(domain.paths.projections.group),
      category: readJson(domain.paths.projections.category),
    },
  };
}

function validateHtmlLayer(domain, rendered, layers, errors) {
  const pageByPath = new Map();
  for (const page of [
    ...layers.pages.leaf.pages,
    ...layers.pages.group.pages,
    ...layers.pages.category.pages,
  ]) {
    pageByPath.set(page.canonical_path, page);
  }

  const seenPaths = new Set();
  for (const item of rendered.all) {
    const html = fs.readFileSync(item.filePath, "utf8");
    const canonical = extractCanonicalUrl(html);
    const pagePath = canonical?.replace(PRODUCTION_ORIGIN, "");
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

  if (rendered.all.length !== domain.expectedCounts.total) {
    errors.push(`Expected ${domain.expectedCounts.total} HTML pages, found ${rendered.all.length}`);
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
    ...layers.schema.leaf.schemas.map((s) => [s.canonical_path, s]),
    ...layers.schema.group.schemas.map((s) => [s.canonical_path, s]),
    ...layers.schema.category.schemas.map((s) => [s.canonical_path, s]),
  ]);

  for (const item of rendered.all) {
    const html = fs.readFileSync(item.filePath, "utf8");
    const canonical = extractCanonicalUrl(html);
    const pagePath = canonical?.replace(PRODUCTION_ORIGIN, "");
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
    ...layers.navigation.leaf.link_sets,
    ...layers.navigation.group.link_sets,
    ...layers.navigation.category.link_sets,
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

function validateSearchLayer(domain, layers, errors) {
  const leafDocs = layers.search.leaf.documents.length;
  const groupDocs = layers.search.group.documents.length;
  const categoryDocs = layers.search.category.documents.length;
  const suggestions = layers.search.suggestions.suggestions.length;

  if (leafDocs !== domain.expectedCounts.leaf) {
    errors.push(`Leaf search document count mismatch: ${leafDocs}`);
  }
  if (groupDocs !== domain.expectedCounts.groups) {
    errors.push(`Group search document count mismatch: ${groupDocs}`);
  }
  if (categoryDocs !== domain.expectedCounts.categories) {
    errors.push(`Category search document count mismatch: ${categoryDocs}`);
  }
  if (suggestions !== domain.expectedCounts.total) {
    errors.push(`Suggestion count mismatch: ${suggestions}`);
  }
}

function validateSitemapLayer(domain, rendered, errors) {
  const sitemapFiles = [
    domain.paths.sitemaps.leaf,
    domain.paths.sitemaps.group,
    domain.paths.sitemaps.category,
  ];

  if (!fs.existsSync(domain.paths.sitemaps.index)) {
    errors.push(`Missing ${relative(domain.root, domain.paths.sitemaps.index)}`);
  }
  if (!fs.existsSync(domain.paths.sitemaps.crawlManifest)) {
    errors.push(`Missing ${relative(domain.root, domain.paths.sitemaps.crawlManifest)}`);
  }

  const allLocs = [];
  const locSet = new Set();
  for (const file of sitemapFiles) {
    if (!fs.existsSync(file)) {
      errors.push(`Missing sitemap: ${relative(domain.root, file)}`);
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

function validatePublicationChain(domain, layers, rendered, errors) {
  const entities = [
    ...layers.catalog[domain.catalogKeys.leaf].map((entry) => ({ id: entry.id, kind: "leaf" })),
    ...layers.catalog[domain.catalogKeys.groups].map((entry) => ({ id: entry.id, kind: "group" })),
    ...layers.catalog[domain.catalogKeys.categories].map((entry) => ({ id: entry.id, kind: "category" })),
  ];

  const projectionById = new Map([
    ...layers.projections.leaf.projections.map((p) => [p.identity.id, p]),
    ...layers.projections.group.projections.map((p) => [p.identity.id, p]),
    ...layers.projections.category.projections.map((p) => [p.identity.id, p]),
  ]);

  const pageByProjection = new Map();
  for (const page of [
    ...layers.pages.leaf.pages,
    ...layers.pages.group.pages,
    ...layers.pages.category.pages,
  ]) {
    pageByProjection.set(page.projection_id, page);
  }

  const schemaByPath = new Map([
    ...layers.schema.leaf.schemas.map((s) => [s.canonical_path, s]),
    ...layers.schema.group.schemas.map((s) => [s.canonical_path, s]),
    ...layers.schema.category.schemas.map((s) => [s.canonical_path, s]),
  ]);

  const navByPath = new Map([
    ...layers.navigation.leaf.link_sets.map((n) => [n.canonical_path, n]),
    ...layers.navigation.group.link_sets.map((n) => [n.canonical_path, n]),
    ...layers.navigation.category.link_sets.map((n) => [n.canonical_path, n]),
  ]);

  const searchDocByPath = new Map([
    ...layers.search.leaf.documents.map((d) => [d.canonical_path, d]),
    ...layers.search.group.documents.map((d) => [d.canonical_path, d]),
    ...layers.search.category.documents.map((d) => [d.canonical_path, d]),
  ]);

  const htmlByCanonical = new Map();
  for (const item of rendered.all) {
    const html = fs.readFileSync(item.filePath, "utf8");
    const canonical = extractCanonicalUrl(html);
    const pathKey = canonical?.replace(PRODUCTION_ORIGIN, "");
    if (pathKey) htmlByCanonical.set(pathKey, item);
  }

  const sitemapFiles = [
    domain.paths.sitemaps.leaf,
    domain.paths.sitemaps.group,
    domain.paths.sitemaps.category,
  ];
  const sitemapLocs = new Set(
    sitemapFiles
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

function buildChecksums(domain) {
  const artifacts = domain.publicationArtifacts;
  const checksums = {};

  for (const [key, value] of Object.entries(artifacts)) {
    if (Array.isArray(value)) {
      checksums[key] = {};
      for (const fullPath of value) {
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          const relPath = relativeArtifactPath(domain, fullPath);
          checksums[key][relPath] = sha256File(fullPath);
        }
      }
      continue;
    }

    if (fs.existsSync(value) && fs.statSync(value).isFile()) {
      checksums[key] = sha256File(value);
    }
  }

  return checksums;
}

function buildReleaseManifest(domain, layers, certification) {
  const rel = (filePath) => relativeArtifactPath(domain, filePath);
  const artifacts = domain.publicationArtifacts;

  return {
    release_version: layers.catalog.meta?.food_ontology_version ?? "1.0",
    generated_at: new Date().toISOString(),
    publication: domain.publicationId,
    domain: domain.id,
    catalog_version: layers.catalog.meta?.catalog_version ?? "unknown",
    artifacts: {
      catalog: rel(artifacts.catalog),
      runtime: artifacts.runtime.map(rel),
      relationships: artifacts.relationships.map(rel),
      projections: artifacts.projections.map(rel),
      pages: artifacts.pages.map(rel),
      schema: artifacts.schema.map(rel),
      navigation: artifacts.navigation.map(rel),
      search: artifacts.search.map(rel),
      html: artifacts.html.map(rel),
      sitemaps: artifacts.sitemaps.map(rel),
    },
    pages: readPublicationCounts(domain),
    certification,
    checksums: buildChecksums(domain),
  };
}

export function runCertifyReleaseStage(domainOrId) {
  const domain = resolveDomain(domainOrId);
  const errors = [];
  const warnings = [];

  requirePassingReports(domain, errors);

  const artifactPaths = [
    domain.paths.pages.leaf,
    domain.paths.pages.group,
    domain.paths.pages.category,
    domain.paths.schema.leaf,
    domain.paths.schema.group,
    domain.paths.schema.category,
    domain.paths.navigation.leaf,
    domain.paths.navigation.group,
    domain.paths.navigation.category,
    domain.paths.search.leaf,
    domain.paths.search.group,
    domain.paths.search.category,
    domain.paths.search.suggestions,
    domain.paths.sitemaps.leaf,
    domain.paths.sitemaps.group,
    domain.paths.sitemaps.category,
  ];

  for (const filePath of artifactPaths) {
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing release artifact: ${relative(domain.root, filePath)}`);
    }
  }

  const rendered = loadRenderedCatalog(domain);
  const layers = loadPublicationLayers(domain);
  const registry = buildHrefRegistry(domain, [
    ...layers.pages.leaf.pages,
    ...layers.pages.group.pages,
    ...layers.pages.category.pages,
  ]);

  validateHtmlLayer(domain, rendered, layers, errors);
  validateJsonLdLayer(rendered, layers, errors);
  const brokenLinks = validateNavigationLayer(layers, registry, errors);
  validateSearchLayer(domain, layers, errors);
  const sitemapUrls = validateSitemapLayer(domain, rendered, errors);
  validatePublicationChain(domain, layers, rendered, errors);

  const certification = errors.length === 0 ? "PASS" : "FAIL";
  const report = {
    phase: releasePhase(domain),
    domain: domain.id,
    overall_result: certification,
    deployment_gate: true,
    validation_errors: errors,
    warnings,
    metrics: {
      "HTML pages": rendered.all.length,
      "Broken navigation links": brokenLinks,
      "Sitemap URLs": sitemapUrls,
      "Search suggestions": layers.search.suggestions.suggestions.length,
      "Publication entities": domain.expectedCounts.total,
      "Validation errors": errors.length,
      "Overall result": certification,
    },
    outputs: [
      relative(domain.root, domain.paths.releaseManifest),
      relative(domain.root, domain.paths.reports.release),
    ],
  };

  if (domain.platformAudit) {
    report.platform_audit = {
      platform_modifications_required: domain.platformAudit.platformModificationsRequired,
      shared_publication_pipeline_reused_percent:
        domain.platformAudit.sharedPublicationPipelineReusePercent,
      overall: "PASS",
    };
  }

  if (domain.releaseSummary) {
    report.release_summary = domain.releaseSummary;
  }

  if (certification === "FAIL") {
    writeJson(domain.paths.reports.release, report);
    console.error(errors.join("\n"));
    process.exit(1);
  }

  const manifest = buildReleaseManifest(domain, layers, certification);
  writeJson(domain.paths.releaseManifest, manifest);
  writeJson(domain.paths.reports.release, report);

  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Manifest: ${domain.paths.releaseManifest}`);
  console.log(`Report: ${domain.paths.reports.release}`);

  return report;
}
