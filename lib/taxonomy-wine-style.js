/**
 * ONTOLOGY-01A — Wine Style entity context from catalog + knowledge graph.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WINES } from "../assets/js/pairing-data.js";
import { buildKnowledgeGraph } from "./taxonomy-graph.js";
import { loadTaxonomy } from "./taxonomy.js";
import { grapeUrl, pairingUrl, wineRegionUrl, wineStyleUrl } from "./public-url.js";
import { loadGrapeCatalog } from "./taxonomy-grape.js";
import { resolveServingLinks } from "./taxonomy-wine-serving.js";
import { attachTypedEdges, buildStyleTypedEdges } from "./typed-edges.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "..", "data", "wine-style-catalog.json");
const REGION_CATALOG_PATH = path.join(__dirname, "..", "data", "wine-region-catalog.json");

export function loadWineStyleCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
}

export function listWineStyleEntries() {
  return loadWineStyleCatalog().styles;
}

export function wineStyleBySlug(slug) {
  return listWineStyleEntries().find((s) => s.slug === slug) ?? null;
}

function listWineRegionEntriesFromCatalog() {
  return JSON.parse(fs.readFileSync(REGION_CATALOG_PATH, "utf8")).regions;
}

export function resolveRegionLinks(regionSlugs) {
  const bySlug = Object.fromEntries(listWineRegionEntriesFromCatalog().map((r) => [r.slug, r]));
  return (regionSlugs ?? []).map((slug) => {
    const region = bySlug[slug];
    return {
      slug,
      name: region?.name ?? slug.replace(/-/g, " "),
      href: region ? wineRegionUrl(slug) : null,
    };
  });
}

export function grapeCatalogSlugSet() {
  return new Set(loadGrapeCatalog().grapes.map((g) => g.slug));
}

function formatPairingLabel(slug) {
  return slug
    .replace(/^wine-with-/, "Wine with ")
    .replace(/^wine-for-/, "Wine for ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeStructure(raw = {}) {
  const keys = ["body", "tannin", "acidity", "alcohol", "sweetness", "oak"];
  const out = {};
  for (const key of keys) {
    const v = Number(raw[key] ?? 0);
    out[key] = Math.max(0, Math.min(5, Number.isFinite(v) ? v : 0));
  }
  return out;
}

function resolveDescriptors(taxonomy, slugs) {
  return (slugs ?? [])
    .map((slug) => taxonomy.nodes[slug])
    .filter((n) => n?.entity_type === "descriptor" || n?.type === "descriptor");
}

function resolveGrapes(style, grapeSlugs) {
  const catalog = loadGrapeCatalog().grapes;
  const bySlug = Object.fromEntries(catalog.map((g) => [g.slug, g]));
  return (style.primary_grapes ?? []).map((entry) => {
    const slug = typeof entry === "string" ? entry : entry.slug;
    const name = typeof entry === "string" ? entry.replace(/-/g, " ") : entry.name;
    const catalogEntry = bySlug[slug];
    return {
      slug,
      name: catalogEntry?.name ?? name ?? slug,
      href: catalogEntry ? grapeUrl(slug) : null,
    };
  });
}

function resolveStyleLinks(styles, slugField = "slug") {
  const bySlug = Object.fromEntries(listWineStyleEntries().map((s) => [s.slug, s]));
  return (styles ?? [])
    .map((entry) => {
      const slug = typeof entry === "string" ? entry : entry[slugField];
      const style = bySlug[slug];
      if (!style) return null;
      return { slug, name: style.name, href: wineStyleUrl(slug) };
    })
    .filter(Boolean);
}

function resolvePairings(style) {
  const items = [];
  const seen = new Set();

  for (const item of style.food_pairings ?? []) {
    const slug = item.slug;
    const key = slug ?? item.label;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({
      tier: item.tier ?? "primary",
      slug: slug ?? null,
      label: item.label ?? (slug ? formatPairingLabel(slug) : key),
      href: slug ? pairingUrl(slug) : null,
    });
  }

  return items;
}

export function buildWineStyleGraphEdges(style, taxonomy, options = {}) {
  const grapeSlugs = grapeCatalogSlugSet();
  const descriptors = resolveDescriptors(taxonomy, style.typical_descriptors);
  const grapes = resolveGrapes(style, grapeSlugs);
  const pairings = resolvePairings(style).filter((p) => p.href);
  const related = resolveStyleLinks(style.related_styles);
  const substitutes = resolveStyleLinks(style.substitutes);

  return attachTypedEdges(
    {
      descriptors: descriptors.map((d) => d.slug),
      grapes: grapes.filter((g) => g.href).map((g) => g.slug),
      pairings: pairings.map((p) => p.slug),
      related_styles: related.map((r) => r.slug),
      substitutes: substitutes.map((s) => s.slug),
      edge_count:
        descriptors.length +
        grapes.filter((g) => g.href).length +
        pairings.length +
        related.length +
        substitutes.length,
    },
    buildStyleTypedEdges(style),
    "wine_style"
  );
}

export function buildWineStylePageContext(style, options = {}) {
  const taxonomy = options.taxonomy ?? loadTaxonomy();
  const graph = options.graph ?? buildKnowledgeGraph({ taxonomy, WINES, root: options.root });
  const structure = normalizeStructure(style.structure);
  const descriptors = resolveDescriptors(taxonomy, style.typical_descriptors);
  const grapes = resolveGrapes(style, grapeCatalogSlugSet());
  const pairings = resolvePairings(style);
  const relatedStyles = resolveStyleLinks(style.related_styles);
  const substitutes = resolveStyleLinks(style.substitutes);
  const graphEdges = buildWineStyleGraphEdges(style, taxonomy);
  const regions = resolveRegionLinks(style.typical_regions ?? []);
  const servingLinks = resolveServingLinks(style.serving);

  const primaryPairings = pairings.filter((p) => p.tier === "primary");
  const secondaryPairings = pairings.filter((p) => p.tier !== "primary");

  const relatedPages = [];
  const seenRelated = new Set();

  const addRelated = (href, label, kind) => {
    if (!href || seenRelated.has(href)) return;
    seenRelated.add(href);
    relatedPages.push({ href, label, kind });
  };

  for (const d of descriptors.slice(0, 6)) {
    addRelated(`/terms/${d.slug}`, d.name, "descriptor");
  }
  for (const g of grapes.filter((x) => x.href).slice(0, 4)) {
    addRelated(g.href, g.name, "grape");
  }
  for (const reg of regions.filter((x) => x.href).slice(0, 4)) {
    addRelated(reg.href, reg.name, "wine_region");
  }
  for (const srv of servingLinks.filter((x) => x.href).slice(0, 4)) {
    addRelated(srv.href, srv.name, "wine_serving");
  }
  for (const p of pairings.filter((x) => x.href).slice(0, 5)) {
    addRelated(p.href, p.label, "pairing");
  }
  for (const r of relatedStyles.slice(0, 4)) {
    addRelated(r.href, r.name, "wine_style");
  }

  const title = style.seo_title || `${style.name} — Wine Style Guide & Food Pairing`;
  const metaDescription =
    style.seo_description || style.summary.slice(0, 155);

  return {
    style,
    structure,
    descriptors,
    grapes,
    pairings,
    primaryPairings,
    secondaryPairings,
    avoidPairings: style.avoid_pairings ?? [],
    relatedStyles,
    substitutes,
    relatedPages,
    graphEdges,
    regions,
    servingLinks,
    servingNotes: style.serving_notes ?? "",
    title,
    metaDescription,
    graph,
  };
}

export function validateWineStyleCatalog(taxonomy) {
  const errors = [];
  const slugs = new Set();

  for (const style of listWineStyleEntries()) {
    if (slugs.has(style.slug)) errors.push(`Duplicate style slug: ${style.slug}`);
    slugs.add(style.slug);

    if (style.entity_type !== "wine_style") {
      errors.push(`${style.slug}: entity_type must be wine_style`);
    }
    if (style.domain !== "wine") {
      errors.push(`${style.slug}: domain must be wine`);
    }

    for (const desc of style.typical_descriptors ?? []) {
      const node = taxonomy.nodes[desc];
      if (!node || (node.type !== "descriptor" && node.entity_type !== "descriptor")) {
        errors.push(`${style.slug}: unknown descriptor ${desc}`);
      }
    }

    for (const reg of style.typical_regions ?? []) {
      const slug = typeof reg === "string" ? reg : reg.slug;
      if (!listWineRegionEntriesFromCatalog().some((r) => r.slug === slug)) {
        errors.push(`${style.slug}: unknown region ${slug}`);
      }
    }

    for (const rel of [...(style.related_styles ?? []), ...(style.substitutes ?? [])]) {
      const slug = typeof rel === "string" ? rel : rel.slug;
      if (!slugs.has(slug) && !listWineStyleEntries().some((s) => s.slug === slug)) {
        // defer cross-ref check to second pass
      }
    }
  }

  for (const style of listWineStyleEntries()) {
    for (const rel of [...(style.related_styles ?? []), ...(style.substitutes ?? [])]) {
      const slug = typeof rel === "string" ? rel : rel.slug;
      if (!wineStyleBySlug(slug)) {
        errors.push(`${style.slug}: references unknown style ${slug}`);
      }
    }
  }

  return errors;
}
