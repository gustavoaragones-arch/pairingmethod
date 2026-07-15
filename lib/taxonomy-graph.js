/**
 * KNOWLEDGE-04 — Knowledge graph indexes and queries (taxonomy SSOT).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy, getCategoryMeta } from "./taxonomy.js";
import {
  GRAPE_PAGE_SLUG,
  listDescriptorNodes,
  winesCatalogFromPairingData,
} from "./taxonomy-descriptor.js";
import { grapeUrl, pairingUrl, termCategoryUrl, taxonomyNodeHref, termUrl } from "./public-url.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Future node types supported by the graph schema (Part 8). */
export const SUPPORTED_NODE_TYPES = Object.freeze([
  "category",
  "group",
  "descriptor",
  "wine_fault",
  "winemaking_technique",
  "wine_region",
  "grape_growing",
  "serving_temperature",
  "glassware",
  "food_ingredient",
  "cooking_technique",
]);

export function buildPairingGuideIndex(root) {
  const index = new Map();
  const files = fs
    .readdirSync(root)
    .filter((f) => f.startsWith("wine-") && f.endsWith(".html"));

  for (const file of files) {
    const slug = file.replace(/\.html$/, "");
    const html = fs.readFileSync(path.join(root, file), "utf8");
    const termRefs = [
      ...html.matchAll(/href="\/terms\/([a-z0-9-]+)"/g),
      ...html.matchAll(/data-term="([a-z0-9-]+)"/g),
    ];
    for (const m of termRefs) {
      const termSlug = m[1];
      if (!index.has(termSlug)) index.set(termSlug, new Set());
      index.get(termSlug).add(slug);
    }

    const grapeRefs = [...html.matchAll(/href="\/grapes\/([a-z0-9-]+)"/g)];
    for (const m of grapeRefs) {
      const grapeSlug = m[1];
      if (!index.has(`grape:${grapeSlug}`)) index.set(`grape:${grapeSlug}`, new Set());
      index.get(`grape:${grapeSlug}`).add(slug);
    }
  }
  return index;
}

/**
 * Build full knowledge graph indexes from taxonomy + runtime catalogs.
 * @param {{ taxonomy?: object, winesCatalog?: object[], root?: string }} [options]
 */
export function buildKnowledgeGraph(options = {}) {
  const taxonomy = options.taxonomy ?? loadTaxonomy();
  const winesCatalog =
    options.winesCatalog ??
    (options.WINES ? winesCatalogFromPairingData(options.WINES) : []);
  const root = options.root ?? path.join(__dirname, "..");
  const pairingIndex = buildPairingGuideIndex(root);

  const descriptors = Object.fromEntries(
    listDescriptorNodes(taxonomy).map((n) => [n.slug, n])
  );

  const reverse = {
    descriptorToGrapes: {},
    descriptorToPairings: {},
    grapeToDescriptors: {},
    pairingToDescriptors: {},
    grapeToPairings: {},
    pairingToGrapes: {},
  };

  for (const wine of winesCatalog) {
    const grapeSlug = wine.grapePageSlug ?? GRAPE_PAGE_SLUG[wine.id] ?? wine.id;
    const slugs = Object.values(wine.descriptors ?? {}).flat();
    reverse.grapeToDescriptors[grapeSlug] = [...new Set(slugs)].sort();

    for (const slug of slugs) {
      if (!reverse.descriptorToGrapes[slug]) reverse.descriptorToGrapes[slug] = new Set();
      reverse.descriptorToGrapes[slug].add(grapeSlug);
    }
  }

  for (const [termSlug, pairings] of pairingIndex.entries()) {
    if (termSlug.startsWith("grape:")) {
      const grapeSlug = termSlug.slice(6);
      reverse.grapeToPairings[grapeSlug] = [...pairings].sort();
      for (const p of pairings) {
        if (!reverse.pairingToGrapes[p]) reverse.pairingToGrapes[p] = new Set();
        reverse.pairingToGrapes[p].add(grapeSlug);
      }
      continue;
    }
    reverse.descriptorToPairings[termSlug] = [...pairings].sort();
    for (const p of pairings) {
      if (!reverse.pairingToDescriptors[p]) reverse.pairingToDescriptors[p] = new Set();
      reverse.pairingToDescriptors[p].add(termSlug);
    }
  }

  for (const key of Object.keys(reverse.descriptorToGrapes)) {
    reverse.descriptorToGrapes[key] = [...reverse.descriptorToGrapes[key]].sort();
  }
  for (const key of Object.keys(reverse.pairingToGrapes)) {
    reverse.pairingToGrapes[key] = [...reverse.pairingToGrapes[key]].sort();
  }
  for (const key of Object.keys(reverse.pairingToDescriptors)) {
    reverse.pairingToDescriptors[key] = [...reverse.pairingToDescriptors[key]].sort();
  }

  return {
    taxonomy,
    descriptors,
    winesCatalog,
    pairingIndex,
    reverse,
    stats: graphStats(taxonomy, reverse, winesCatalog),
  };
}

export function graphStats(taxonomy, reverse, winesCatalog) {
  const descriptorSlugs = listDescriptorNodes(taxonomy).map((d) => d.slug);
  const degrees = descriptorSlugs.map((slug) => {
    const grapes = reverse.descriptorToGrapes[slug]?.length ?? 0;
    const pairings = reverse.descriptorToPairings[slug]?.length ?? 0;
    const node = taxonomy.nodes[slug];
    const rel =
      (node?.related_terms?.length ?? 0) +
      (node?.opposite_terms?.length ?? 0) +
      (node?.children?.length ?? 0);
    return { slug, degree: grapes + pairings + rel };
  });

  degrees.sort((a, b) => b.degree - a.degree);

  return {
    descriptorCount: descriptorSlugs.length,
    grapeCount: winesCatalog.length,
    averageDegree:
      degrees.length > 0
        ? Number(
            (degrees.reduce((s, d) => s + d.degree, 0) / degrees.length).toFixed(1)
          )
        : 0,
    strongestNodes: degrees.slice(0, 10),
  };
}

export function descriptorExists(taxonomy, slug) {
  const node = taxonomy.nodes[slug];
  return Boolean(node && (node.type === "descriptor" || node.type === "category"));
}

export function getDescriptorNode(taxonomy, slug) {
  return taxonomy.nodes[slug] ?? null;
}

export function descriptorLabel(taxonomy, slug) {
  const node = taxonomy.nodes[slug];
  return node?.name ?? slug.replace(/-/g, " ");
}

/** Compact runtime record for browser modules. */
export function compactTaxonomyNodeRecord(taxonomy, slug) {
  const node = taxonomy.nodes[slug];
  if (!node) return null;
  const cat = getCategoryMeta(taxonomy, node.category ?? slug);

  if (node.type === "descriptor") {
    return {
      slug: node.slug,
      name: node.name,
      type: node.type,
      category: node.category,
      categoryName: cat?.name ?? node.category,
      definition: node.definition,
      description: node.description ?? node.definition,
      related: node.related_terms ?? [],
      opposite: node.opposite_terms ?? [],
      aliases: node.search_aliases ?? [],
      href: termUrl(slug),
      categoryHref: termCategoryUrl(node.category),
    };
  }

  if (node.type === "category") {
    return {
      slug: node.slug,
      name: node.name,
      type: node.type,
      category: node.slug,
      categoryName: node.name,
      definition: node.definition ?? cat?.introduction ?? "",
      description: node.description ?? cat?.introduction ?? "",
      related: [],
      opposite: [],
      aliases: node.search_aliases ?? [],
      href: termCategoryUrl(slug),
      categoryHref: termCategoryUrl(slug),
    };
  }

  if (node.type === "group") {
    return {
      slug: node.slug,
      name: node.name,
      type: node.type,
      category: node.category,
      categoryName: cat?.name ?? node.category,
      definition: node.definition ?? "",
      description: node.description ?? node.definition ?? "",
      related: node.children ?? [],
      opposite: [],
      aliases: node.search_aliases ?? [],
      href: `${termCategoryUrl(node.category)}#${node.slug}`,
      categoryHref: termCategoryUrl(node.category),
    };
  }

  return null;
}

export function compactDescriptorRecord(taxonomy, slug) {
  const rec = compactTaxonomyNodeRecord(taxonomy, slug);
  return rec?.type === "descriptor" ? rec : null;
}

export function buildRelatedContent(graph, entity, limit = 8) {
  const { taxonomy, reverse, winesCatalog } = graph;
  const items = [];
  const seen = new Set();

  const add = (href, label, kind) => {
    if (!href || seen.has(href)) return;
    seen.add(href);
    items.push({ href, label, kind });
  };

  if (entity.type === "descriptor") {
    for (const grapeSlug of reverse.descriptorToGrapes[entity.slug] ?? []) {
      const wine = winesCatalog.find(
        (w) => (w.grapePageSlug ?? GRAPE_PAGE_SLUG[w.id]) === grapeSlug
      );
      add(grapeUrl(grapeSlug), wine?.name ?? grapeSlug, "grape");
    }
    for (const p of reverse.descriptorToPairings[entity.slug] ?? []) {
      add(pairingUrl(p), formatPairingLabel(p), "pairing");
    }
    const node = taxonomy.nodes[entity.slug];
    for (const rel of node?.related_terms ?? []) {
      const n = taxonomy.nodes[rel];
      if (n) add(taxonomyNodeHref(n), n.name, "descriptor");
    }
    for (const opp of node?.opposite_terms ?? []) {
      const n = taxonomy.nodes[opp];
      if (n) add(taxonomyNodeHref(n), n.name, "descriptor");
    }
  }

  if (entity.type === "grape") {
    for (const slug of reverse.grapeToDescriptors[entity.slug] ?? []) {
      const n = taxonomy.nodes[slug];
      if (n) add(termUrl(slug), n.name, "descriptor");
    }
    for (const p of reverse.grapeToPairings[entity.slug] ?? []) {
      add(pairingUrl(p), formatPairingLabel(p), "pairing");
    }
    for (const w of winesCatalog) {
      const gs = w.grapePageSlug ?? GRAPE_PAGE_SLUG[w.id];
      if (gs !== entity.slug) continue;
      for (const slug of Object.values(w.descriptors ?? {}).flat()) {
        const n = taxonomy.nodes[slug];
        if (n) add(termUrl(slug), n.name, "descriptor");
      }
    }
  }

  if (entity.type === "pairing") {
    for (const slug of reverse.pairingToDescriptors[entity.slug] ?? []) {
      const n = taxonomy.nodes[slug];
      if (n) add(termUrl(slug), n.name, "descriptor");
    }
    for (const grapeSlug of reverse.pairingToGrapes[entity.slug] ?? []) {
      const wine = winesCatalog.find(
        (w) => (w.grapePageSlug ?? GRAPE_PAGE_SLUG[w.id]) === grapeSlug
      );
      add(grapeUrl(grapeSlug), wine?.name ?? grapeSlug, "grape");
    }
  }

  return items.slice(0, limit);
}

export function flattenWineDescriptors(wine) {
  const grouped = wine.descriptors ?? {};
  const order = ["fruit", "earth", "spice", "body", "tannin", "acidity"];
  const buckets = [];
  for (const key of order) {
    if (grouped[key]?.length) buckets.push({ key, slugs: grouped[key] });
  }
  for (const [key, slugs] of Object.entries(grouped)) {
    if (!order.includes(key) && slugs?.length) buckets.push({ key, slugs });
  }
  return buckets;
}

function formatPairingLabel(slug) {
  return slug
    .replace(/^wine-with-/, "Wine with ")
    .replace(/^wine-for-/, "Wine for ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function validateTaxonomySlugs(taxonomy, slugLists) {
  const missing = [];
  for (const slugs of slugLists) {
    for (const slug of slugs) {
      if (!taxonomy.nodes[slug]) missing.push(slug);
    }
  }
  return [...new Set(missing)];
}

/** @deprecated Use validateTaxonomySlugs */
export function validateDescriptorSlugs(taxonomy, slugLists) {
  return validateTaxonomySlugs(taxonomy, slugLists);
}
