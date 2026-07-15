/**
 * KNOWLEDGE-02+ — Load and query wine-taxonomy.json (single source of truth).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TAXONOMY_PATH = path.join(__dirname, "..", "data", "wine-taxonomy.json");

/** @typedef {import('./taxonomy-types.js').Taxonomy} Taxonomy */
/** @typedef {import('./taxonomy-types.js').TaxonomyNode} TaxonomyNode */

let _cache = null;

export function loadTaxonomy() {
  if (_cache) return _cache;
  const raw = fs.readFileSync(TAXONOMY_PATH, "utf8");
  _cache = JSON.parse(raw);
  return _cache;
}

export function getCategoryMeta(taxonomy, categorySlug) {
  return taxonomy.categories.find((c) => c.slug === categorySlug) ?? null;
}

export function getCategoryNode(taxonomy, categorySlug) {
  const node = taxonomy.nodes[categorySlug];
  if (!node || node.type !== "category") return null;
  return node;
}

export function getScaleForCategory(taxonomy, categorySlug) {
  return taxonomy.scales.find((s) => s.category === categorySlug) ?? null;
}

/** All descriptor nodes belonging to a category (deduped). */
export function collectCategoryDescriptors(taxonomy, categorySlug) {
  const seen = new Set();
  const out = [];

  const add = (slug) => {
    if (seen.has(slug)) return;
    const node = taxonomy.nodes[slug];
    if (!node || node.type !== "descriptor") return;
    if (node.category !== categorySlug) return;
    seen.add(slug);
    out.push(node);
  };

  const catNode = getCategoryNode(taxonomy, categorySlug);
  if (catNode) {
    const walk = (slug) => {
      const node = taxonomy.nodes[slug];
      if (!node) return;
      if (node.type === "descriptor") add(slug);
      else if (node.type === "group" || node.type === "category") {
        for (const child of node.children ?? []) walk(child);
      }
    };
    for (const child of catNode.children ?? []) walk(child);
  }

  for (const node of Object.values(taxonomy.nodes)) {
    if (node.type === "descriptor" && node.category === categorySlug) add(node.slug);
  }

  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/** Group nodes directly under a category. */
export function collectCategoryGroups(taxonomy, categorySlug) {
  const catNode = getCategoryNode(taxonomy, categorySlug);
  if (!catNode) return [];
  return (catNode.children ?? [])
    .map((slug) => taxonomy.nodes[slug])
    .filter((n) => n?.type === "group")
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Count internal graph edges among descriptors in this category. */
export function countInternalRelationships(taxonomy, categorySlug) {
  const slugs = new Set(collectCategoryDescriptors(taxonomy, categorySlug).map((d) => d.slug));
  let n = 0;
  for (const slug of slugs) {
    const node = taxonomy.nodes[slug];
    for (const rel of [...(node.related_terms ?? []), ...(node.opposite_terms ?? [])]) {
      if (slugs.has(rel)) n += 1;
    }
  }
  return n;
}

/** Related categories ranked by cross-category descriptor edges. */
export function relatedCategories(taxonomy, categorySlug, limit = 6) {
  const counts = new Map();
  for (const desc of collectCategoryDescriptors(taxonomy, categorySlug)) {
    for (const rel of [...(desc.related_terms ?? []), ...(desc.opposite_terms ?? [])]) {
      const relNode = taxonomy.nodes[rel];
      if (!relNode || relNode.category === categorySlug) continue;
      counts.set(relNode.category, (counts.get(relNode.category) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => taxonomy.nodes[slug])
    .filter(Boolean);
}

export function aggregateAssociated(taxonomy, categorySlug, field) {
  const seen = new Set();
  const out = [];
  for (const desc of collectCategoryDescriptors(taxonomy, categorySlug)) {
    for (const item of desc[field] ?? []) {
      if (!seen.has(item)) {
        seen.add(item);
        out.push(item);
      }
    }
  }
  return out;
}

/** Top search aliases / labels for "frequently searched" section. */
export function frequentSearchTerms(taxonomy, categorySlug, limit = 10) {
  const descriptors = collectCategoryDescriptors(taxonomy, categorySlug);
  const scored = descriptors.map((d) => ({
    slug: d.slug,
    name: d.name,
    score:
      (d.related_terms?.length ?? 0) +
      (d.opposite_terms?.length ?? 0) +
      (d.search_aliases?.length ?? 0),
  }));
  return scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, limit);
}

export function shortDefinition(text, maxWords = 18) {
  const words = String(text ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}…`;
}

export function glossaryHubSlug(taxonomy) {
  const sorted = [...taxonomy.categories].sort((a, b) => a.name.localeCompare(b.name));
  return sorted[0]?.slug ?? "body";
}
