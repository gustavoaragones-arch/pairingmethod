/**
 * FOOD-04F — Generalized sitemap and crawl manifest generator (ONTOLOGY-03H).
 * Deployment metadata only — reads certified HTML from dist/.
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { absoluteUrl } from "../public-url.js";
import { getDomainConfig } from "../food-domain-config.js";
import {
  SITEMAP_DEFAULTS,
  buildSitemapIndex,
  buildUrlEntry,
  buildUrlSet,
  extractCanonicalUrl,
  parseSitemapLocs,
} from "../protein-food-release.js";
import { readJson, relative, writeJson } from "./utils.js";

const SITEMAP_PRIORITY_KIND = {
  leaf: "food",
  group: "group",
  category: "category",
};

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
}

function resolveDomain(domainOrId) {
  return typeof domainOrId === "string" ? getDomainConfig(domainOrId) : domainOrId;
}

function requireHtmlRender(domain) {
  const result = spawnSync("npm", ["run", domain.htmlPrerequisiteScript], {
    cwd: domain.root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "HTML rendering failed";
    console.error("Sitemap generation blocked: HTML rendering did not pass.");
    console.error(err);
    process.exit(1);
  }

  if (!fs.existsSync(domain.paths.reports.html)) {
    console.error(`Sitemap generation blocked: ${domain.paths.reports.html} missing.`);
    process.exit(1);
  }

  const report = readJson(domain.paths.reports.html);
  if (report.overall_result !== "PASS") {
    console.error(`Sitemap generation blocked: ${domain.paths.reports.html} is not PASS.`);
    process.exit(1);
  }
}

function discoverRenderedHtmlPages(htmlDir, kind) {
  if (!fs.existsSync(htmlDir)) return [];

  const distSegment = path.basename(htmlDir);
  const pages = [];

  for (const ent of fs.readdirSync(htmlDir, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const indexFile = path.join(htmlDir, ent.name, "index.html");
    if (!fs.existsSync(indexFile)) continue;
    pages.push({
      kind,
      slug: ent.name,
      filePath: indexFile,
      relativePath: path.join("dist", distSegment, ent.name, "index.html").replace(/\\/g, "/"),
    });
  }

  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
}

function loadRenderedCatalog(domain) {
  const leaf = discoverRenderedHtmlPages(domain.paths.html.leaf, "leaf");
  const group = discoverRenderedHtmlPages(domain.paths.html.group, "group");
  const category = discoverRenderedHtmlPages(domain.paths.html.category, "category");
  return { leaf, group, category, all: [...leaf, ...group, ...category] };
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

function sitemapPublicPath(filePath, domain) {
  return `/${relative(domain.root, filePath).replace(/\\/g, "/")}`;
}

function buildChildSitemapConfig(domain) {
  return [
    {
      key: "leaf",
      file: domain.paths.sitemaps.leaf,
      locPath: sitemapPublicPath(domain.paths.sitemaps.leaf, domain),
      pages: (catalog) => catalog.leaf,
    },
    {
      key: "group",
      file: domain.paths.sitemaps.group,
      locPath: sitemapPublicPath(domain.paths.sitemaps.group, domain),
      pages: (catalog) => catalog.group,
    },
    {
      key: "category",
      file: domain.paths.sitemaps.category,
      locPath: sitemapPublicPath(domain.paths.sitemaps.category, domain),
      pages: (catalog) => catalog.category,
    },
  ];
}

function buildChildSitemap(pages, kind, lastmod) {
  const priorityKey = SITEMAP_PRIORITY_KIND[kind] ?? kind;
  const priority = SITEMAP_DEFAULTS.priorities[priorityKey];

  return pages.map((page) => {
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
}

function parseSitemapIndexEntries(xml) {
  const entries = new Map();
  const pattern =
    /<sitemap>\s*<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?\s*<\/sitemap>/g;
  let match = pattern.exec(xml);
  while (match) {
    entries.set(match[1], match[2] ?? null);
    match = pattern.exec(xml);
  }
  return entries;
}

function mergeSitemapIndex(existingXml, childConfigs, lastmod) {
  const entries = existingXml ? parseSitemapIndexEntries(existingXml) : new Map();
  const domainLocPaths = new Set(childConfigs.map((child) => absoluteUrl(child.locPath)));

  for (const loc of [...entries.keys()]) {
    if (domainLocPaths.has(loc)) {
      entries.delete(loc);
    }
  }

  for (const child of childConfigs) {
    entries.set(absoluteUrl(child.locPath), lastmod);
  }

  const indexEntries = [...entries.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([loc, entryLastmod]) =>
        `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${entryLastmod ?? lastmod}</lastmod>
  </sitemap>`
    );

  return buildSitemapIndex(indexEntries);
}

function readExistingCrawlManifest(domain) {
  const manifestPath = domain.paths.sitemaps.crawlManifest;
  if (!fs.existsSync(manifestPath)) return null;
  try {
    return readJson(manifestPath);
  } catch {
    return null;
  }
}

function buildCrawlManifest(domain, lastmod, publicationCounts, htmlCount, existing) {
  const publicationEntry = {
    pages: publicationCounts,
    artifacts: {
      html: htmlCount,
      schema: publicationCounts.total,
      navigation: publicationCounts.total,
      search: publicationCounts.total,
    },
  };

  if (existing?.publications && typeof existing.publications === "object") {
    return {
      version: existing.version ?? "1.0",
      generated_at: lastmod,
      publications: {
        ...existing.publications,
        [domain.publicationId]: publicationEntry,
      },
    };
  }

  if (existing?.publication && !existing.publications) {
    const publications = {};
    if (existing.publication !== domain.publicationId) {
      publications[existing.publication] = {
        pages: existing.pages ?? {},
        artifacts: existing.artifacts ?? {},
      };
    }
    publications[domain.publicationId] = publicationEntry;
    return {
      version: existing.version ?? "1.0",
      generated_at: lastmod,
      publications,
    };
  }

  return {
    version: "1.0",
    generated_at: lastmod,
    publications: {
      [domain.publicationId]: publicationEntry,
    },
  };
}

function generateSitemapArtifacts(domain, lastmod) {
  const catalog = loadRenderedCatalog(domain);
  const childConfigs = buildChildSitemapConfig(domain);

  const entryGroups = {};
  const childXml = {};

  for (const child of childConfigs) {
    const pages = child.pages(catalog);
    const entries = buildChildSitemap(pages, child.key, lastmod);
    entryGroups[child.key] = entries;
    childXml[child.key] = buildUrlSet(entries.map((item) => item.entry));
  }

  const existingIndex = fs.existsSync(domain.paths.sitemaps.index)
    ? fs.readFileSync(domain.paths.sitemaps.index, "utf8")
    : null;
  const sitemapIndex = mergeSitemapIndex(existingIndex, childConfigs, lastmod);

  const publicationCounts = readPublicationCounts(domain);
  const existingManifest = readExistingCrawlManifest(domain);
  const crawlManifest = buildCrawlManifest(
    domain,
    lastmod,
    publicationCounts,
    catalog.all.length,
    existingManifest
  );

  return {
    catalog,
    childConfigs,
    entryGroups,
    childXml,
    sitemapIndex,
    crawlManifest,
    publicationCounts,
  };
}

function validateSitemapArtifacts(domain, generated) {
  const errors = [];
  const allCanonicals = new Set();
  let duplicateUrls = 0;
  let missingPages = 0;

  const groups = [
    { name: "leaf", pages: generated.catalog.leaf, entries: generated.entryGroups.leaf },
    { name: "group", pages: generated.catalog.group, entries: generated.entryGroups.group },
    {
      name: "category",
      pages: generated.catalog.category,
      entries: generated.entryGroups.category,
    },
  ];

  for (const group of groups) {
    if (group.pages.length !== group.entries.length) {
      errors.push(`${group.name} sitemap entry count mismatch`);
    }
  }

  for (const entryGroup of Object.values(generated.entryGroups)) {
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

  const expected = domain.expectedCounts;
  if (generated.catalog.leaf.length !== expected.leaf) {
    errors.push(`Expected ${expected.leaf} leaf pages`);
  }
  if (generated.catalog.group.length !== expected.groups) {
    errors.push(`Expected ${expected.groups} group pages`);
  }
  if (generated.catalog.category.length !== expected.categories) {
    errors.push(`Expected ${expected.categories} category pages`);
  }

  const publicationEntry = generated.crawlManifest.publications[domain.publicationId];
  if (!publicationEntry) {
    errors.push("Crawl manifest missing publication entry");
  } else {
    if (publicationEntry.pages.total !== generated.catalog.all.length) {
      errors.push("Crawl manifest page total does not match rendered HTML count");
    }
    if (publicationEntry.artifacts.html !== generated.catalog.all.length) {
      errors.push("Crawl manifest html count does not match rendered output");
    }

    const renderedCounts = {
      leaf: generated.catalog.leaf.length,
      groups: generated.catalog.group.length,
      categories: generated.catalog.category.length,
      total: generated.catalog.all.length,
    };

    if (JSON.stringify(renderedCounts) !== JSON.stringify(publicationEntry.pages)) {
      errors.push("Crawl manifest page counts do not match rendered output");
    }
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

function sitemapOutputs(domain) {
  return [
    domain.paths.sitemaps.index,
    domain.paths.sitemaps.leaf,
    domain.paths.sitemaps.group,
    domain.paths.sitemaps.category,
    domain.paths.sitemaps.crawlManifest,
  ].map((filePath) => relative(domain.root, filePath));
}

export function runSitemapStage(domainOrId) {
  const domain = resolveDomain(domainOrId);
  requireHtmlRender(domain);

  const lastmod = new Date().toISOString();
  const generated = generateSitemapArtifacts(domain, lastmod);
  const validation = validateSitemapArtifacts(domain, generated);

  const firstPass = packageOutputs(generated);
  const secondPass = packageOutputs(generateSitemapArtifacts(domain, lastmod));
  let determinismPass =
    firstPass.sitemapIndex === secondPass.sitemapIndex &&
    firstPass.childXml.leaf === secondPass.childXml.leaf &&
    firstPass.childXml.group === secondPass.childXml.group &&
    firstPass.childXml.category === secondPass.childXml.category &&
    JSON.stringify(firstPass.crawlManifest) === JSON.stringify(secondPass.crawlManifest);

  if (!determinismPass) {
    validation.errors.push("Determinism check failed: sitemap regeneration mismatch");
  }

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  const metrics = {
    "Sitemap index": 1,
    "Leaf sitemap entries": generated.entryGroups.leaf.length,
    "Group sitemap entries": generated.entryGroups.group.length,
    "Category sitemap entries": generated.entryGroups.category.length,
    "Duplicate URLs": overall === "PASS" ? 0 : validation.duplicateUrls,
    "Missing pages": overall === "PASS" ? 0 : validation.missingPages,
    "Validation errors": overall === "PASS" ? 0 : validation.errors.length,
    "Deterministic regeneration": determinismPass ? "PASS" : "FAIL",
    "Overall result": overall,
  };

  if (overall === "PASS") {
    metrics["Indexed URLs"] =
      parseSitemapLocs(firstPass.childXml.leaf).length +
      parseSitemapLocs(firstPass.childXml.group).length +
      parseSitemapLocs(firstPass.childXml.category).length;
  }

  const report = {
    phase: `${domain.phasePrefix}H`,
    domain: domain.id,
    overall_result: overall,
    validation_errors: overall === "PASS" ? [] : validation.errors,
    outputs: overall === "PASS" ? sitemapOutputs(domain) : undefined,
    metrics,
  };

  if (overall === "FAIL") {
    writeJson(domain.paths.reports.sitemap, report);
    console.error(validation.errors.join("\n"));
    process.exit(1);
  }

  writeText(domain.paths.sitemaps.index, firstPass.sitemapIndex);
  writeText(domain.paths.sitemaps.leaf, firstPass.childXml.leaf);
  writeText(domain.paths.sitemaps.group, firstPass.childXml.group);
  writeText(domain.paths.sitemaps.category, firstPass.childXml.category);
  writeJson(domain.paths.sitemaps.crawlManifest, firstPass.crawlManifest);
  writeJson(domain.paths.reports.sitemap, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${domain.paths.reports.sitemap}`);
  return report;
}
