/**
 * ONTOLOGY-01C — Wine Serving entity context from catalog + knowledge graph.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "./taxonomy.js";
import { grapeUrl, pairingUrl, wineRegionUrl, wineServingUrl, wineStyleUrl } from "./public-url.js";
import { loadGrapeCatalog } from "./taxonomy-grape.js";
import { attachTypedEdges, buildServingTypedEdges } from "./typed-edges.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "..", "data", "wine-serving-catalog.json");
const STYLE_CATALOG_PATH = path.join(__dirname, "..", "data", "wine-style-catalog.json");
const REGION_CATALOG_PATH = path.join(__dirname, "..", "data", "wine-region-catalog.json");

export function loadWineServingCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
}

export function listWineServingEntries() {
  return loadWineServingCatalog().entities;
}

export function wineServingBySlug(slug) {
  return listWineServingEntries().find((e) => e.slug === slug) ?? null;
}

function listWineStyleEntriesFromCatalog() {
  return JSON.parse(fs.readFileSync(STYLE_CATALOG_PATH, "utf8")).styles;
}

function listWineRegionEntriesFromCatalog() {
  return JSON.parse(fs.readFileSync(REGION_CATALOG_PATH, "utf8")).regions;
}

export function buildServingReverseIndex() {
  const servingToStyles = new Map();
  for (const style of listWineStyleEntriesFromCatalog()) {
    const slugs = Object.values(style.serving ?? {}).filter(Boolean);
    for (const slug of slugs) {
      if (!servingToStyles.has(slug)) servingToStyles.set(slug, new Set());
      servingToStyles.get(slug).add(style.slug);
    }
  }
  const out = {};
  for (const [serving, styles] of servingToStyles) {
    out[serving] = [...styles].sort();
  }
  return out;
}

const SERVING_LABELS = {
  temperature: "Serving temperature",
  glassware: "Glassware",
  decanting: "Decanting",
  cellaring: "Cellaring & aging",
};

export function resolveServingLinks(servingObj) {
  if (!servingObj) return [];
  const bySlug = Object.fromEntries(listWineServingEntries().map((e) => [e.slug, e]));
  return Object.entries(servingObj)
    .filter(([, slug]) => slug)
    .map(([key, slug]) => {
      const entity = bySlug[slug];
      return {
        key,
        slug,
        label: SERVING_LABELS[key] ?? key,
        name: entity?.name ?? slug.replace(/-/g, " "),
        href: entity ? wineServingUrl(slug) : null,
        family: entity?.family ?? null,
      };
    });
}

function resolveDescriptors(taxonomy, slugs) {
  return (slugs ?? [])
    .map((slug) => taxonomy.nodes[slug])
    .filter((n) => n?.entity_type === "descriptor" || n?.type === "descriptor");
}

function resolveGrapes(grapeSlugs) {
  const catalog = loadGrapeCatalog().grapes;
  const bySlug = Object.fromEntries(catalog.map((g) => [g.slug, g]));
  return (grapeSlugs ?? []).map((slug) => ({
    slug,
    name: bySlug[slug]?.name ?? slug.replace(/-/g, " "),
    href: bySlug[slug] ? grapeUrl(slug) : null,
  }));
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
  const bySlug = Object.fromEntries(listWineRegionEntriesFromCatalog().map((r) => [r.slug, r]));
  return (regionSlugs ?? [])
    .map((slug) => {
      const region = bySlug[slug];
      if (!region) return null;
      return { slug, name: region.name, href: wineRegionUrl(slug) };
    })
    .filter(Boolean);
}

function resolveServingEntities(slugs) {
  const bySlug = Object.fromEntries(listWineServingEntries().map((e) => [e.slug, e]));
  return (slugs ?? [])
    .map((slug) => {
      const entity = bySlug[slug];
      if (!entity) return null;
      return { slug, name: entity.name, href: wineServingUrl(slug), family: entity.family };
    })
    .filter(Boolean);
}

export function buildWineServingGraphEdges(entity, taxonomy, reverseIndex = {}) {
  const descriptors = resolveDescriptors(taxonomy, entity.related_descriptors);
  const grapes = resolveGrapes(entity.related_grapes).filter((g) => g.href);
  const stylesCatalog = resolveStyles(entity.related_styles);
  const stylesReverse = resolveStyles(reverseIndex[entity.slug] ?? []);
  const styleSlugs = new Set([
    ...stylesCatalog.map((s) => s.slug),
    ...stylesReverse.map((s) => s.slug),
    ...(entity.recommended_for ?? []),
  ]);
  const styles = resolveStyles([...styleSlugs]);
  const regions = resolveRegions(entity.related_regions);
  const mistakes = resolveServingEntities(entity.common_mistakes);

  return attachTypedEdges(
    {
      descriptors: descriptors.map((d) => d.slug),
      grapes: grapes.map((g) => g.slug),
      styles: styles.map((s) => s.slug),
      regions: regions.map((r) => r.slug),
      mistakes: mistakes.map((m) => m.slug),
      edge_count:
        descriptors.length +
        grapes.length +
        styles.length +
        regions.length +
        mistakes.length,
    },
    buildServingTypedEdges(entity, reverseIndex),
    "wine_serving"
  );
}

export function buildWineServingPageContext(entity, options = {}) {
  const taxonomy = options.taxonomy ?? loadTaxonomy();
  const reverseIndex = options.reverseIndex ?? buildServingReverseIndex();

  const descriptors = resolveDescriptors(taxonomy, entity.related_descriptors);
  const grapes = resolveGrapes(entity.related_grapes);
  const stylesCatalog = resolveStyles(entity.related_styles);
  const stylesReverse = resolveStyles(reverseIndex[entity.slug] ?? []);
  const recommended = resolveStyles(entity.recommended_for ?? []);
  const styleSlugs = new Set([
    ...stylesCatalog.map((s) => s.slug),
    ...stylesReverse.map((s) => s.slug),
    ...recommended.map((s) => s.slug),
  ]);
  const styles = resolveStyles([...styleSlugs]);
  const regions = resolveRegions(entity.related_regions);
  const mistakes = resolveServingEntities(entity.common_mistakes);
  const graphEdges = buildWineServingGraphEdges(entity, taxonomy, reverseIndex);

  const relatedPages = [];
  const seen = new Set();
  const add = (href, label) => {
    if (!href || seen.has(href)) return;
    seen.add(href);
    relatedPages.push({ href, label });
  };

  for (const s of styles.slice(0, 6)) add(s.href, s.name);
  for (const g of grapes.filter((x) => x.href).slice(0, 4)) add(g.href, g.name);
  for (const d of descriptors.slice(0, 4)) add(`/terms/${d.slug}`, d.name);
  for (const r of regions.slice(0, 3)) add(r.href, r.name);
  for (const m of mistakes.slice(0, 3)) add(m.href, m.name);

  const title = entity.seo_title || `${entity.name} — Wine Serving Guide`;
  const metaDescription = entity.seo_description || entity.summary.slice(0, 155);

  return {
    entity,
    descriptors,
    grapes,
    styles,
    regions,
    mistakes,
    relatedPages,
    graphEdges,
    title,
    metaDescription,
  };
}

export function validateWineServingCatalog(taxonomy) {
  const errors = [];
  const slugs = new Set(listWineServingEntries().map((e) => e.slug));
  const styleSlugs = new Set(listWineStyleEntriesFromCatalog().map((s) => s.slug));
  const regionSlugs = new Set(listWineRegionEntriesFromCatalog().map((r) => r.slug));

  for (const entity of listWineServingEntries()) {
    if (entity.entity_type !== "wine_serving") {
      errors.push(`${entity.slug}: entity_type must be wine_serving`);
    }
    for (const desc of entity.related_descriptors ?? []) {
      const node = taxonomy.nodes[desc];
      if (!node || (node.type !== "descriptor" && node.entity_type !== "descriptor")) {
        errors.push(`${entity.slug}: unknown descriptor ${desc}`);
      }
    }
    for (const slug of [
      ...(entity.related_styles ?? []),
      ...(entity.recommended_for ?? []),
    ]) {
      if (!styleSlugs.has(slug)) errors.push(`${entity.slug}: unknown style ${slug}`);
    }
    for (const slug of entity.related_regions ?? []) {
      if (!regionSlugs.has(slug)) errors.push(`${entity.slug}: unknown region ${slug}`);
    }
    for (const slug of entity.common_mistakes ?? []) {
      if (!slugs.has(slug)) errors.push(`${entity.slug}: unknown mistake ${slug}`);
    }
  }

  for (const style of listWineStyleEntriesFromCatalog()) {
    for (const slug of Object.values(style.serving ?? {})) {
      if (slug && !slugs.has(slug)) {
        errors.push(`style ${style.slug}: unknown serving entity ${slug}`);
      }
    }
  }

  return errors;
}

export function countServingCrossLinks() {
  const styles = listWineStyleEntriesFromCatalog();
  const entities = listWineServingEntries();
  let styleToServing = 0;
  for (const s of styles) styleToServing += Object.values(s.serving ?? {}).filter(Boolean).length;

  let servingToStyle = 0;
  let servingToDescriptor = 0;
  let servingToRegion = 0;
  let servingToGrape = 0;

  for (const e of entities) {
    servingToStyle += (e.related_styles?.length ?? 0) + (e.recommended_for?.length ?? 0);
    servingToDescriptor += e.related_descriptors?.length ?? 0;
    servingToRegion += e.related_regions?.length ?? 0;
    servingToGrape += e.related_grapes?.length ?? 0;
  }

  const reverse = buildServingReverseIndex();
  const servingToStyleReverse = Object.values(reverse).reduce((n, arr) => n + arr.length, 0);

  return {
    style_to_serving: styleToServing,
    serving_to_style: servingToStyle + servingToStyleReverse,
    serving_to_descriptor: servingToDescriptor,
    serving_to_region: servingToRegion,
    serving_to_grape: servingToGrape,
  };
}
