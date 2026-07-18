/**
 * ONTOLOGY-03H/03I — Shared helpers for food ontology deployment artifacts.
 * Protein-specific exports preserved for backward compatibility.
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getProteinReleaseExports } from "./food-domain-config.js";

const proteinRelease = getProteinReleaseExports();

export const SITEMAP_DEFAULTS = Object.freeze({
  changefreq: "monthly",
  priorities: {
    food: 0.7,
    group: 0.75,
    category: 0.8,
  },
});

export const EXPECTED_COUNTS = proteinRelease.EXPECTED_COUNTS;
export const PUBLICATION_ARTIFACTS = proteinRelease.PUBLICATION_ARTIFACTS;

export function sha256File(filePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(filePath));
  return hash.digest("hex");
}

export function sha256Text(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function discoverRenderedHtmlPages(rootDir, section) {
  const baseDir = path.join(rootDir, section);
  if (!fs.existsSync(baseDir)) return [];

  const pages = [];
  for (const ent of fs.readdirSync(baseDir, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    const indexFile = path.join(baseDir, ent.name, "index.html");
    if (!fs.existsSync(indexFile)) continue;
    pages.push({
      kind: section.slice(0, -1),
      slug: ent.name,
      filePath: indexFile,
      relativePath: path.join("dist", section, ent.name, "index.html").replace(/\\/g, "/"),
    });
  }

  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
}

export function extractCanonicalUrl(html) {
  const match = html.match(/<link rel="canonical" href="([^"]+)"/);
  return match?.[1] ?? null;
}

export function extractJsonLdBlocks(html) {
  const blocks = [];
  const pattern = /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g;
  let match = pattern.exec(html);
  while (match) {
    blocks.push(JSON.parse(match[1]));
    match = pattern.exec(html);
  }
  return blocks;
}

export function loadRenderedCatalog(root, sections = ["foods", "groups", "categories"]) {
  const catalogs = {};
  for (const section of sections) {
    catalogs[section] = discoverRenderedHtmlPages(root, section);
  }
  const foods = catalogs.foods ?? [];
  const groups = catalogs.groups ?? [];
  const categories = catalogs.categories ?? [];
  return { foods, groups, categories, all: [...foods, ...groups, ...categories], catalogs };
}

export function readPublicationCounts(root, pagePaths = null) {
  const paths =
    pagePaths ??
    {
      leaf: path.join(root, "data/pages/protein-food-pages.json"),
      group: path.join(root, "data/pages/protein-group-pages.json"),
      category: path.join(root, "data/pages/protein-category-pages.json"),
    };

  const foods = JSON.parse(fs.readFileSync(paths.leaf, "utf8"));
  const groups = JSON.parse(fs.readFileSync(paths.group, "utf8"));
  const categories = JSON.parse(fs.readFileSync(paths.category, "utf8"));

  return {
    foods: foods.pages.length,
    groups: groups.pages.length,
    categories: categories.pages.length,
    total: foods.pages.length + groups.pages.length + categories.pages.length,
  };
}

export function buildUrlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

export function buildUrlSet(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n\n")}
</urlset>
`;
}

export function buildSitemapIndex(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n\n")}
</sitemapindex>
`;
}

export function parseSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}
