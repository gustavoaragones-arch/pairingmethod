/**
 * KNOWLEDGE-04 — Pairing guide taxonomy enrichment.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WINE_STYLE_SEMANTICS, WINES } from "../assets/js/pairing-data.js";
import { buildKnowledgeGraph, buildRelatedContent } from "./taxonomy-graph.js";
import { loadTaxonomy } from "./taxonomy.js";
import { grapeUrl, pairingUrl } from "./public-url.js";
import { GRAPE_PAGE_SLUG, wineById } from "./taxonomy-grape.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "..", "data", "pairing-guide-catalog.json");

export function loadPairingGuideCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
}

export function buildPairingWhyItWorks(taxonomy, guideConfig) {
  const sem = WINE_STYLE_SEMANTICS[guideConfig.wineStyle];
  if (!sem) return { intro: guideConfig.whyIntro, descriptors: [] };

  const buckets = guideConfig.descriptorBuckets ?? ["tannin", "body", "acidity"];
  const descriptors = [];

  for (const bucket of buckets) {
    const slugs = (sem[bucket] ?? []).filter((s) => taxonomy.nodes[s]?.type === "descriptor");
    for (const slug of slugs.slice(0, 3)) {
      descriptors.push({ slug, bucket, node: taxonomy.nodes[slug] });
    }
  }

  return {
    intro: guideConfig.whyIntro,
    descriptors: descriptors.slice(0, 8),
    wineStyle: guideConfig.wineStyle,
  };
}

export function buildPairingGuideContext(slug, options = {}) {
  const catalog = options.catalog ?? loadPairingGuideCatalog();
  const guideConfig = catalog.guides[slug];
  if (!guideConfig) return null;

  const taxonomy = options.taxonomy ?? loadTaxonomy();
  const graph = options.graph ?? buildKnowledgeGraph({ taxonomy, WINES: options.WINES });
  const why = buildPairingWhyItWorks(taxonomy, guideConfig);
  const primaryWine = wineById(guideConfig.primaryWineId);
  const grapeSlug = primaryWine
    ? GRAPE_PAGE_SLUG[primaryWine.id] ?? primaryWine.id
    : null;

  const related = buildRelatedContent(graph, { type: "pairing", slug }, 10);

  return {
    slug,
    guideConfig,
    why,
    primaryWine,
    grapeSlug,
    related,
  };
}
