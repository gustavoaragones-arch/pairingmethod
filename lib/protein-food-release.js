/**
 * ONTOLOGY-03H/03I — Shared helpers for protein food deployment artifacts.
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

export const SITEMAP_DEFAULTS = Object.freeze({
  changefreq: "monthly",
  priorities: {
    food: 0.7,
    group: 0.75,
    category: 0.8,
  },
});

export const EXPECTED_COUNTS = Object.freeze({
  foods: 207,
  groups: 16,
  categories: 3,
  total: 226,
});

export const PUBLICATION_ARTIFACTS = Object.freeze({
  catalog: "data/protein-food-catalog.json",
  runtime: [
    "data/runtime/protein-food-index.json",
    "data/runtime/protein-food-groups.json",
    "data/runtime/protein-food-categories.json",
  ],
  relationships: [
    "data/runtime/protein-food-relationships.json",
    "data/runtime/protein-food-editorial-relationships.json",
    "data/runtime/protein-food-wine-relationships.json",
  ],
  projections: [
    "data/generated/protein-food-pages.json",
    "data/generated/protein-group-pages.json",
    "data/generated/protein-category-pages.json",
  ],
  pages: [
    "data/pages/protein-food-pages.json",
    "data/pages/protein-group-pages.json",
    "data/pages/protein-category-pages.json",
  ],
  schema: [
    "data/schema/protein-food-schema.json",
    "data/schema/protein-group-schema.json",
    "data/schema/protein-category-schema.json",
  ],
  navigation: [
    "data/navigation/protein-food-links.json",
    "data/navigation/protein-group-links.json",
    "data/navigation/protein-category-links.json",
  ],
  search: [
    "data/search/protein-food-search-index.json",
    "data/search/protein-group-search-index.json",
    "data/search/protein-category-search-index.json",
    "data/search/protein-search-suggestions.json",
  ],
  html: ["dist/foods", "dist/groups", "dist/categories"],
  sitemaps: [
    "dist/sitemap.xml",
    "dist/sitemaps/protein-food-pages.xml",
    "dist/sitemaps/protein-group-pages.xml",
    "dist/sitemaps/protein-category-pages.xml",
    "dist/crawl-manifest.json",
  ],
});

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

export function loadRenderedCatalog(root) {
  const foods = discoverRenderedHtmlPages(root, "foods");
  const groups = discoverRenderedHtmlPages(root, "groups");
  const categories = discoverRenderedHtmlPages(root, "categories");
  return { foods, groups, categories, all: [...foods, ...groups, ...categories] };
}

export function readPublicationCounts(root) {
  const foods = JSON.parse(
    fs.readFileSync(path.join(root, "data/pages/protein-food-pages.json"), "utf8")
  );
  const groups = JSON.parse(
    fs.readFileSync(path.join(root, "data/pages/protein-group-pages.json"), "utf8")
  );
  const categories = JSON.parse(
    fs.readFileSync(path.join(root, "data/pages/protein-category-pages.json"), "utf8")
  );

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
