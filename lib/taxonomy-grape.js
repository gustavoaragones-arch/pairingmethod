/**
 * KNOWLEDGE-04 — Grape page context from taxonomy graph.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WINES } from "../assets/js/pairing-data.js";
import { buildKnowledgeGraph, buildRelatedContent, flattenWineDescriptors } from "./taxonomy-graph.js";
import {
  GRAPE_PAGE_SLUG,
  winesCatalogFromPairingData,
} from "./taxonomy-descriptor.js";
import { loadTaxonomy } from "./taxonomy.js";
import { grapeUrl, pairingUrl } from "./public-url.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "..", "data", "grape-catalog.json");

export function loadGrapeCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
}

export function wineById(wineId) {
  return WINES.find((w) => w.id === wineId) ?? null;
}

export function buildGrapePageContext(catalogEntry, options = {}) {
  const taxonomy = options.taxonomy ?? loadTaxonomy();
  const graph = options.graph ?? buildKnowledgeGraph({ taxonomy, WINES });
  const wine = wineById(catalogEntry.wineId);
  if (!wine) return null;

  const grapeSlug = catalogEntry.slug;
  const descriptorBuckets = flattenWineDescriptors(wine).map((bucket) => ({
    key: bucket.key,
    slugs: bucket.slugs.filter((s) => taxonomy.nodes[s]?.type === "descriptor"),
    labels: bucket.slugs
      .filter((s) => taxonomy.nodes[s]?.type === "descriptor")
      .map((s) => taxonomy.nodes[s].name),
  }));

  const allDescriptorSlugs = descriptorBuckets.flatMap((b) => b.slugs);

  const pairings = [
    ...(catalogEntry.pairings ?? []),
    ...(graph.reverse.grapeToPairings[grapeSlug] ?? [])
      .filter((p) => !(catalogEntry.pairings ?? []).some((x) => x.slug === p))
      .map((p) => ({ slug: p, label: formatPairingLabel(p) })),
  ];

  const related = buildRelatedContent(graph, { type: "grape", slug: grapeSlug }, 10);

  const title = `${catalogEntry.name} Wine Guide`;
  const metaDescription = catalogEntry.quickAnswer.slice(0, 155);

  return {
    catalogEntry,
    wine,
    grapeSlug,
    descriptorBuckets,
    allDescriptorSlugs,
    pairings,
    pairingLabels: catalogEntry.pairingLabels ?? [],
    related,
    title,
    metaDescription,
    structure: catalogEntry.structure ?? {
      body: wine.body,
      tannin: wine.tannin,
      acidity: wine.acidity,
      alcohol: 3,
      sweetness: wine.sweetness ?? 0,
    },
  };
}

function formatPairingLabel(slug) {
  return slug
    .replace(/^wine-with-/, "Wine with ")
    .replace(/^wine-for-/, "Wine for ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function listGrapeCatalogEntries() {
  return loadGrapeCatalog().grapes;
}

export { GRAPE_PAGE_SLUG, winesCatalogFromPairingData };
