/**
 * ONTOLOGY-01B — Wine Region entity context from catalog + knowledge graph.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "./taxonomy.js";
import { grapeUrl, pairingUrl, wineRegionUrl, wineStyleUrl } from "./public-url.js";
import { loadGrapeCatalog } from "./taxonomy-grape.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "..", "data", "wine-region-catalog.json");
const STYLE_CATALOG_PATH = path.join(__dirname, "..", "data", "wine-style-catalog.json");

function listWineStyleEntriesFromCatalog() {
  return JSON.parse(fs.readFileSync(STYLE_CATALOG_PATH, "utf8")).styles;
}

export function loadWineRegionCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
}

export function listWineRegionEntries() {
  return loadWineRegionCatalog().regions;
}

export function wineRegionBySlug(slug) {
  return listWineRegionEntries().find((r) => r.slug === slug) ?? null;
}

export function buildRegionReverseIndex() {
  const regionToStyles = new Map();
  for (const style of listWineStyleEntriesFromCatalog()) {
    for (const slug of style.typical_regions ?? []) {
      if (!regionToStyles.has(slug)) regionToStyles.set(slug, new Set());
      regionToStyles.get(slug).add(style.slug);
    }
  }
  const out = {};
  for (const [region, styles] of regionToStyles) {
    out[region] = [...styles].sort();
  }
  return out;
}

function resolveDescriptors(taxonomy, slugs) {
  return (slugs ?? [])
    .map((slug) => taxonomy.nodes[slug])
    .filter((n) => n?.entity_type === "descriptor" || n?.type === "descriptor");
}

function resolveGrapes(grapeSlugs) {
  const catalog = loadGrapeCatalog().grapes;
  const bySlug = Object.fromEntries(catalog.map((g) => [g.slug, g]));
  return (grapeSlugs ?? []).map((slug) => {
    const entry = bySlug[slug];
    return {
      slug,
      name: entry?.name ?? slug.replace(/-/g, " "),
      href: entry ? grapeUrl(slug) : null,
    };
  });
}

function resolveStyles(styleSlugs) {
  const bySlug = Object.fromEntries(listWineStyleEntriesFromCatalog().map((s) => [s.slug, s]));
  return (styleSlugs ?? [])
    .map((slug) => {
      const style = bySlug[slug];
      if (!style) return null;
      return { slug, name: style.name, href: wineStyleUrl(slug) };
    })
    .filter(Boolean);
}

function resolveRegions(regionSlugs) {
  const bySlug = Object.fromEntries(listWineRegionEntries().map((r) => [r.slug, r]));
  return (regionSlugs ?? [])
    .map((slug) => {
      const region = bySlug[slug];
      if (!region) return null;
      return { slug, name: region.name, href: wineRegionUrl(slug) };
    })
    .filter(Boolean);
}

function resolvePairings(region) {
  return (region.food_pairings ?? []).map((item) => {
    if (typeof item === "string") return { label: item, href: null };
    return {
      label: item.label ?? item.slug,
      href: item.slug ? pairingUrl(item.slug) : null,
    };
  });
}

export function resolveRegionLinks(regionSlugs) {
  return resolveRegions(regionSlugs);
}

export function buildWineRegionGraphEdges(region, taxonomy, reverseIndex = {}) {
  const descriptors = resolveDescriptors(taxonomy, region.typical_descriptors);
  const grapes = resolveGrapes(region.typical_grapes).filter((g) => g.href);
  const stylesFromCatalog = resolveStyles(region.typical_styles);
  const stylesFromReverse = resolveStyles(reverseIndex[region.slug] ?? []);
  const styleSlugs = new Set([
    ...stylesFromCatalog.map((s) => s.slug),
    ...stylesFromReverse.map((s) => s.slug),
  ]);
  const styles = resolveStyles([...styleSlugs]);
  const parent = region.parent_region ? resolveRegions([region.parent_region]) : [];
  const subregions = resolveRegions(region.subregions ?? []);
  const related = resolveRegions(region.related_regions ?? []);
  const pairings = resolvePairings(region).filter((p) => p.href);

  return {
    descriptors: descriptors.map((d) => d.slug),
    grapes: grapes.map((g) => g.slug),
    styles: styles.map((s) => s.slug),
    parent: parent.map((p) => p.slug),
    subregions: subregions.map((s) => s.slug),
    related_regions: related.map((r) => r.slug),
    pairings: pairings.map((p) => p.label),
    edge_count:
      descriptors.length +
      grapes.length +
      styles.length +
      parent.length +
      subregions.length +
      related.length +
      pairings.length,
  };
}

export function buildWineRegionPageContext(region, options = {}) {
  const taxonomy = options.taxonomy ?? loadTaxonomy();
  const reverseIndex = options.reverseIndex ?? buildRegionReverseIndex();

  const descriptors = resolveDescriptors(taxonomy, region.typical_descriptors);
  const grapes = resolveGrapes(region.typical_grapes);
  const stylesCatalog = resolveStyles(region.typical_styles);
  const stylesReverse = resolveStyles(reverseIndex[region.slug] ?? []);
  const styleSlugs = new Set([
    ...stylesCatalog.map((s) => s.slug),
    ...stylesReverse.map((s) => s.slug),
  ]);
  const styles = resolveStyles([...styleSlugs]);
  const parentRegion = region.parent_region
    ? resolveRegions([region.parent_region])[0] ?? null
    : null;
  const subregions = resolveRegions(region.subregions ?? []);
  const relatedRegions = resolveRegions(region.related_regions ?? []);
  const pairings = resolvePairings(region);
  const graphEdges = buildWineRegionGraphEdges(region, taxonomy, reverseIndex);

  const relatedPages = [];
  const seen = new Set();
  const add = (href, label) => {
    if (!href || seen.has(href)) return;
    seen.add(href);
    relatedPages.push({ href, label });
  };

  if (parentRegion?.href) add(parentRegion.href, parentRegion.name);
  for (const s of styles.slice(0, 5)) add(s.href, s.name);
  for (const g of grapes.filter((x) => x.href).slice(0, 4)) add(g.href, g.name);
  for (const d of descriptors.slice(0, 4)) add(`/terms/${d.slug}`, d.name);
  for (const r of relatedRegions.slice(0, 3)) add(r.href, r.name);

  const title = region.seo_title || `${region.name} — Wine Region Guide`;
  const metaDescription = region.seo_description || region.summary.slice(0, 155);

  return {
    region,
    descriptors,
    grapes,
    styles,
    parentRegion,
    subregions,
    relatedRegions,
    pairings,
    relatedPages,
    graphEdges,
    title,
    metaDescription,
  };
}

export function validateWineRegionCatalog(taxonomy) {
  const errors = [];
  const slugs = new Set();

  for (const region of listWineRegionEntries()) {
    if (slugs.has(region.slug)) errors.push(`Duplicate region slug: ${region.slug}`);
    slugs.add(region.slug);

    if (region.entity_type !== "wine_region") {
      errors.push(`${region.slug}: entity_type must be wine_region`);
    }
    if (region.type !== "entity") {
      errors.push(`${region.slug}: type must be entity`);
    }

    for (const desc of region.typical_descriptors ?? []) {
      const node = taxonomy.nodes[desc];
      if (!node || (node.type !== "descriptor" && node.entity_type !== "descriptor")) {
        errors.push(`${region.slug}: unknown descriptor ${desc}`);
      }
    }

    for (const slug of region.typical_styles ?? []) {
      if (!listWineStyleEntriesFromCatalog().some((s) => s.slug === slug)) {
        errors.push(`${region.slug}: unknown style ${slug}`);
      }
    }
  }

  for (const region of listWineRegionEntries()) {
    if (region.parent_region && !wineRegionBySlug(region.parent_region)) {
      errors.push(`${region.slug}: unknown parent ${region.parent_region}`);
    }
    for (const sub of region.subregions ?? []) {
      if (!wineRegionBySlug(sub)) errors.push(`${region.slug}: unknown subregion ${sub}`);
    }
    for (const rel of region.related_regions ?? []) {
      if (!wineRegionBySlug(rel)) errors.push(`${region.slug}: unknown related region ${rel}`);
    }
  }

  return errors;
}
