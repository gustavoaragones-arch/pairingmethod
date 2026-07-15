/**
 * KNOWLEDGE-03 — Descriptor entity queries (taxonomy SSOT).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  buildKnowledgeGraph,
  buildRelatedContent,
} from "./taxonomy-graph.js";
import {
  collectCategoryDescriptors,
  getCategoryMeta,
  getScaleForCategory,
  glossaryHubSlug,
  shortDefinition,
} from "./taxonomy.js";
import { grapeUrl, pairingUrl, termCategoryUrl, taxonomyNodeHref } from "./public-url.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const GRAPE_PAGE_SLUG = {
  cabernet: "cabernet-sauvignon",
  "pinot-noir": "pinot-noir",
  chardonnay: "chardonnay",
  "sauvignon-blanc": "sauvignon-blanc",
  riesling: "riesling",
};

export function listDescriptorNodes(taxonomy) {
  return Object.values(taxonomy.nodes)
    .filter((n) => n.type === "descriptor")
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Ancestor chain from category down to descriptor (groups + self). */
export function descriptorTaxonomyPath(taxonomy, slug) {
  const chain = [];
  let current = taxonomy.nodes[slug];
  if (!current) return chain;

  const visited = new Set();
  while (current && !visited.has(current.slug)) {
    visited.add(current.slug);
    chain.unshift(current);
    if (!current.parent) break;
    current = taxonomy.nodes[current.parent];
  }

  const cat = taxonomy.nodes[current?.category ?? slug];
  if (cat?.type === "category" && !chain.some((n) => n.slug === cat.slug)) {
    chain.unshift(cat);
  }

  return chain;
}

export function descriptorChildren(taxonomy, slug) {
  const node = taxonomy.nodes[slug];
  if (!node?.children?.length) return [];
  return node.children
    .map((s) => taxonomy.nodes[s])
    .filter((n) => n && (n.type === "descriptor" || n.type === "group"))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function descriptorSiblings(taxonomy, slug) {
  const node = taxonomy.nodes[slug];
  if (!node?.parent) {
    return collectCategoryDescriptors(taxonomy, node.category).filter((d) => d.slug !== slug);
  }
  const parent = taxonomy.nodes[node.parent];
  if (!parent) return [];
  return (parent.children ?? [])
    .filter((s) => s !== slug)
    .map((s) => taxonomy.nodes[s])
    .filter((n) => n?.type === "descriptor")
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function sameCategoryDescriptors(taxonomy, slug, limit = 12) {
  const node = taxonomy.nodes[slug];
  if (!node) return [];
  return collectCategoryDescriptors(taxonomy, node.category)
    .filter((d) => d.slug !== slug)
    .slice(0, limit);
}

export function scaleContext(taxonomy, slug) {
  const node = taxonomy.nodes[slug];
  if (!node?.scale) return null;
  const scale = getScaleForCategory(taxonomy, node.scale.id);
  if (!scale) return null;
  const position = scale.ordered_slugs.indexOf(slug);
  if (position < 0) return null;
  return {
    scale,
    position,
    previous: position > 0 ? taxonomy.nodes[scale.ordered_slugs[position - 1]] : null,
    next:
      position < scale.ordered_slugs.length - 1
        ? taxonomy.nodes[scale.ordered_slugs[position + 1]]
        : null,
    nearby: scale.ordered_slugs
      .slice(Math.max(0, position - 2), position + 3)
      .map((s) => taxonomy.nodes[s])
      .filter(Boolean),
  };
}

export function frequentlyConfusedWith(taxonomy, slug, limit = 8) {
  const node = taxonomy.nodes[slug];
  if (!node) return [];

  const exclude = new Set([
    slug,
    node.parent,
    ...(node.children ?? []),
    ...(node.related_terms ?? []),
    ...(node.opposite_terms ?? []),
  ].filter(Boolean));

  const picks = [];
  const seen = new Set();

  const add = (n) => {
    if (!n || seen.has(n.slug) || exclude.has(n.slug)) return;
    seen.add(n.slug);
    picks.push(n);
  };

  for (const rel of node.related_terms ?? []) {
    add(taxonomy.nodes[rel]);
  }

  for (const sib of descriptorSiblings(taxonomy, slug)) {
    add(sib);
  }

  const sameParent = node.parent ? descriptorSiblings(taxonomy, slug) : [];
  for (const s of sameParent) add(s);

  const sameCat = collectCategoryDescriptors(taxonomy, node.category);
  const scored = sameCat
    .filter((d) => !exclude.has(d.slug) && !seen.has(d.slug))
    .map((d) => {
      let score = 0;
      if (d.related_terms?.includes(slug)) score += 3;
      if (node.related_terms?.includes(d.slug)) score += 2;
      const shared = (node.related_terms ?? []).filter((r) => d.related_terms?.includes(r));
      score += shared.length;
      if (d.parent === node.parent && node.parent) score += 2;
      return { node: d, score };
    })
    .sort((a, b) => b.score - a.score || a.node.name.localeCompare(b.node.name));

  for (const { node: n } of scored) {
    add(n);
    if (picks.length >= limit) break;
  }

  return picks.slice(0, limit);
}

export function descriptorNavigation(taxonomy, slug) {
  const scaleCtx = scaleContext(taxonomy, slug);
  if (scaleCtx) {
    return { previous: scaleCtx.previous, next: scaleCtx.next, mode: "scale" };
  }
  const node = taxonomy.nodes[slug];
  const ordered = collectCategoryDescriptors(taxonomy, node.category);
  const idx = ordered.findIndex((d) => d.slug === slug);
  return {
    previous: idx > 0 ? ordered[idx - 1] : null,
    next: idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null,
    mode: "category",
  };
}

export function winesForDescriptor(winesCatalog, slug) {
  return winesCatalog.filter((w) => {
    const descs = Object.values(w.descriptors ?? {}).flat();
    return descs.includes(slug);
  });
}

export function grapesForDescriptor(taxonomyNode, winesCatalog, grapeNames = {}) {
  const seen = new Set();
  const out = [];

  const add = (id, name) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    out.push({
      id,
      name: name ?? grapeNames[id] ?? formatGrapeId(id),
      grapePageSlug: GRAPE_PAGE_SLUG[id] ?? id,
    });
  };

  for (const w of winesForDescriptor(winesCatalog, taxonomyNode.slug)) {
    add(w.id, w.name);
  }
  for (const id of taxonomyNode.associated_wines ?? []) {
    add(id, grapeNames[id]);
  }

  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function formatGrapeId(id) {
  return String(id)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

let _pairingIndex = null;

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
  }
  return index;
}

export function pairingGuidesForDescriptor(pairingIndex, slug, taxonomyNode) {
  const fromTaxonomy = taxonomyNode.associated_pairings ?? [];
  const fromScan = pairingIndex?.get(slug) ? [...pairingIndex.get(slug)] : [];
  return [...new Set([...fromTaxonomy, ...fromScan])].sort();
}

export function foodsForDescriptor(taxonomyNode, pairingSlugs) {
  const foods = [...(taxonomyNode.associated_foods ?? [])];
  for (const p of pairingSlugs) {
    const label = p.replace(/^wine-(with|for)-/, "").replace(/-/g, " ");
    if (label && !foods.includes(label)) foods.push(label);
  }
  return foods;
}

export function buildDescriptorPageContext(taxonomy, slug, options = {}) {
  const { winesCatalog = [], pairingIndex, glossaryHubHref, graph: graphIn } = options;
  const graph = graphIn ?? buildKnowledgeGraph({ taxonomy, winesCatalog });
  const node = taxonomy.nodes[slug];
  if (!node || node.type !== "descriptor") return null;

  const catMeta = getCategoryMeta(taxonomy, node.category);
  const path = descriptorTaxonomyPath(taxonomy, slug);
  const children = descriptorChildren(taxonomy, slug);
  const siblings = descriptorSiblings(taxonomy, slug);
  const related = (node.related_terms ?? []).map((s) => taxonomy.nodes[s]).filter(Boolean);
  const opposites = (node.opposite_terms ?? []).map((s) => taxonomy.nodes[s]).filter(Boolean);
  const confused = frequentlyConfusedWith(taxonomy, slug);
  const scaleCtx = scaleContext(taxonomy, slug);
  const nav = descriptorNavigation(taxonomy, slug);
  const sameCategory = sameCategoryDescriptors(taxonomy, slug, 10);

  const grapes = grapesForDescriptor(node, winesCatalog, options.grapeNames);

  const reverseGrapeSlugs = graph.reverse.descriptorToGrapes[slug] ?? [];
  for (const grapeSlug of reverseGrapeSlugs) {
    const existing = grapes.find((g) => (g.grapePageSlug ?? g.id) === grapeSlug);
    if (!existing) {
      grapes.push({
        id: grapeSlug,
        name: formatGrapeId(grapeSlug),
        grapePageSlug: grapeSlug,
      });
    }
  }
  grapes.sort((a, b) => a.name.localeCompare(b.name));

  const pairingSlugs = [
    ...new Set([
      ...pairingGuidesForDescriptor(pairingIndex, slug, node),
      ...(graph.reverse.descriptorToPairings[slug] ?? []),
    ]),
  ].sort();
  const foods = foodsForDescriptor(node, pairingSlugs);

  const title = node.seo_title || `${node.name} in Wine — Definition & Pairing Guide`;
  const metaDescription = node.seo_description || shortDefinition(node.definition, 28);

  const whyMatters =
    node.description ||
    `Understanding ${node.name.toLowerCase()} helps you read professional tasting notes and choose wine that matches your dish.`;

  const faq = [
    {
      question: `What does ${node.name.toLowerCase()} mean in wine?`,
      answer: node.definition,
    },
    {
      question: `Why does ${node.name.toLowerCase()} matter for pairing?`,
      answer: whyMatters,
    },
  ];
  if (related.length) {
    faq.push({
      question: `What is ${node.name.toLowerCase()} often confused with?`,
      answer: `Tasters often overlap ${node.name.toLowerCase()} with ${related
        .slice(0, 3)
        .map((r) => r.name.toLowerCase())
        .join(", ")}. Each descriptor has a distinct place in the wine vocabulary.`,
    });
  }

  const seeAlso = [
    { href: termCategoryUrl(node.category), label: catMeta?.name ?? node.category },
    ...related.slice(0, 3).map((r) => ({ href: taxonomyNodeHref(r), label: r.name })),
    ...opposites.slice(0, 2).map((r) => ({ href: taxonomyNodeHref(r), label: r.name })),
  ];

  const relatedContent = buildRelatedContent(graph, { type: "descriptor", slug }, 10);

  return {
    node,
    catMeta,
    path,
    children,
    siblings,
    related,
    opposites,
    confused,
    scaleCtx,
    nav,
    sameCategory,
    grapes,
    pairingSlugs,
    foods,
    title,
    metaDescription,
    whyMatters,
    faq,
    seeAlso,
    relatedContent,
    glossaryHubHref,
  };
}

export function winesCatalogFromPairingData(WINES) {
  return WINES.map((w) => ({
    ...w,
    grapePageSlug: GRAPE_PAGE_SLUG[w.id] ?? w.id,
  }));
}

export function defaultGlossaryHubHref(taxonomy) {
  return termCategoryUrl(glossaryHubSlug(taxonomy));
}
