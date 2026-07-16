/**
 * ONTOLOGY-01D — Winemaking Technique entity context from catalog + knowledge graph.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "./taxonomy.js";
import {
  grapeUrl,
  pairingUrl,
  winemakingTechniqueUrl,
  wineRegionUrl,
  wineServingUrl,
  wineStyleUrl,
} from "./public-url.js";
import { loadGrapeCatalog } from "./taxonomy-grape.js";
import { attachTypedEdges, buildWinemakingTypedEdges } from "./typed-edges.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "..", "data", "winemaking-technique-catalog.json");
const STYLE_CATALOG_PATH = path.join(__dirname, "..", "data", "wine-style-catalog.json");
const REGION_CATALOG_PATH = path.join(__dirname, "..", "data", "wine-region-catalog.json");
const SERVING_CATALOG_PATH = path.join(__dirname, "..", "data", "wine-serving-catalog.json");

export function loadWinemakingTechniqueCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
}

export function listWinemakingTechniqueEntries() {
  return loadWinemakingTechniqueCatalog().techniques ?? loadWinemakingTechniqueCatalog().entities ?? [];
}

export function winemakingTechniqueBySlug(slug) {
  return listWinemakingTechniqueEntries().find((e) => e.slug === slug) ?? null;
}

function listWineStyleEntriesFromCatalog() {
  return JSON.parse(fs.readFileSync(STYLE_CATALOG_PATH, "utf8")).styles;
}

function listWineRegionEntriesFromCatalog() {
  return JSON.parse(fs.readFileSync(REGION_CATALOG_PATH, "utf8")).regions;
}

function listWineServingEntriesFromCatalog() {
  return JSON.parse(fs.readFileSync(SERVING_CATALOG_PATH, "utf8")).entities;
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

function resolveTechniques(slugs) {
  const bySlug = Object.fromEntries(listWinemakingTechniqueEntries().map((t) => [t.slug, t]));
  return (slugs ?? [])
    .map((slug) => {
      const t = bySlug[slug];
      if (!t) return null;
      return { slug, name: t.name, href: winemakingTechniqueUrl(slug) };
    })
    .filter(Boolean);
}

function resolveServing(slugs) {
  const bySlug = Object.fromEntries(listWineServingEntriesFromCatalog().map((e) => [e.slug, e]));
  return (slugs ?? [])
    .map((slug) => {
      const e = bySlug[slug];
      if (!e) return null;
      return { slug, name: e.name, href: wineServingUrl(slug) };
    })
    .filter(Boolean);
}

export function buildWinemakingTechniqueGraphEdges(technique, taxonomy) {
  const creates = resolveDescriptors(taxonomy, technique.creates_descriptors);
  const reduces = resolveDescriptors(taxonomy, technique.reduces_descriptors);
  const styles = resolveStyles(technique.common_styles);
  const regions = resolveRegions(technique.common_regions);
  const grapes = resolveGrapes(technique.common_grapes).filter((g) => g.href);
  const related = resolveTechniques(technique.related_techniques);
  const opposites = resolveTechniques(technique.opposite_techniques);
  const serving = resolveServing(technique.serving_implications);

  return attachTypedEdges(
    {
      creates_descriptors: creates.map((d) => d.slug),
      reduces_descriptors: reduces.map((d) => d.slug),
      styles: styles.map((s) => s.slug),
      regions: regions.map((r) => r.slug),
      grapes: grapes.map((g) => g.slug),
      related_techniques: related.map((t) => t.slug),
      opposite_techniques: opposites.map((t) => t.slug),
      serving_implications: serving.map((s) => s.slug),
      edge_count:
        creates.length +
        reduces.length +
        styles.length +
        regions.length +
        grapes.length +
        related.length +
        opposites.length +
        serving.length,
    },
    buildWinemakingTypedEdges(technique),
    "winemaking_technique"
  );
}

export function buildWinemakingTechniquePageContext(technique, options = {}) {
  const taxonomy = options.taxonomy ?? loadTaxonomy();
  const creates = resolveDescriptors(taxonomy, technique.creates_descriptors);
  const reduces = resolveDescriptors(taxonomy, technique.reduces_descriptors);
  const styles = resolveStyles(technique.common_styles);
  const regions = resolveRegions(technique.common_regions);
  const grapes = resolveGrapes(technique.common_grapes);
  const related = resolveTechniques(technique.related_techniques);
  const opposites = resolveTechniques(technique.opposite_techniques);
  const serving = resolveServing(technique.serving_implications);
  const graphEdges = buildWinemakingTechniqueGraphEdges(technique, taxonomy);

  const relatedPages = [];
  const ontologyEntities = [];
  const seen = new Set();
  const add = (href, label) => {
    if (!href || seen.has(href)) return;
    seen.add(href);
    relatedPages.push({ href, label });
  };
  const addOntology = (href, label, kind) => {
    if (!href || seen.has(`onto:${href}`)) return;
    seen.add(`onto:${href}`);
    ontologyEntities.push({ href, label, kind });
  };

  for (const s of styles.slice(0, 5)) {
    add(s.href, s.name);
    addOntology(s.href, s.name, "Wine Style");
  }
  for (const r of regions.slice(0, 4)) {
    add(r.href, r.name);
    addOntology(r.href, r.name, "Wine Region");
  }
  for (const d of creates.slice(0, 4)) add(`/terms/${d.slug}`, d.name);
  for (const d of creates.slice(0, 4)) addOntology(`/terms/${d.slug}`, d.name, "Descriptor");
  for (const g of grapes.filter((x) => x.href).slice(0, 3)) addOntology(g.href, g.name, "Grape Variety");
  for (const t of related.slice(0, 4)) add(t.href, t.name);
  for (const srv of serving.slice(0, 3)) {
    add(srv.href, srv.name);
    addOntology(srv.href, srv.name, "Serving");
  }

  const title = technique.seo_title || `${technique.name} — Winemaking Technique`;
  const metaDescription = technique.seo_description || technique.summary.slice(0, 155);

  return {
    entity: technique,
    technique,
    creates,
    reduces,
    styles,
    regions,
    grapes,
    related,
    opposites,
    serving,
    relatedPages,
    ontologyEntities,
    graphEdges,
    title,
    metaDescription,
  };
}

export function validateWinemakingTechniqueCatalog(taxonomy) {
  const errors = [];
  const slugs = new Set(listWinemakingTechniqueEntries().map((t) => t.slug));
  const styleSlugs = new Set(listWineStyleEntriesFromCatalog().map((s) => s.slug));
  const regionSlugs = new Set(listWineRegionEntriesFromCatalog().map((r) => r.slug));
  const servingSlugs = new Set(listWineServingEntriesFromCatalog().map((s) => s.slug));
  const grapeSlugs = new Set(loadGrapeCatalog().grapes.map((g) => g.slug));

  for (const t of listWinemakingTechniqueEntries()) {
    if (t.entity_type !== "winemaking_technique") {
      errors.push(`${t.slug}: entity_type must be winemaking_technique`);
    }
    for (const d of [...(t.creates_descriptors ?? []), ...(t.reduces_descriptors ?? [])]) {
      const node = taxonomy.nodes[d];
      if (!node || (node.type !== "descriptor" && node.entity_type !== "descriptor")) {
        errors.push(`${t.slug}: unknown descriptor ${d}`);
      }
    }
    for (const s of t.common_styles ?? []) {
      if (!styleSlugs.has(s)) errors.push(`${t.slug}: unknown style ${s}`);
    }
    for (const r of t.common_regions ?? []) {
      if (!regionSlugs.has(r)) errors.push(`${t.slug}: unknown region ${r}`);
    }
    for (const g of t.common_grapes ?? []) {
      if (!grapeSlugs.has(g)) errors.push(`${t.slug}: unknown grape ${g}`);
    }
    for (const slug of [
      ...(t.related_techniques ?? []),
      ...(t.opposite_techniques ?? []),
    ]) {
      if (!slugs.has(slug)) errors.push(`${t.slug}: unknown technique ${slug}`);
    }
    for (const srv of t.serving_implications ?? []) {
      if (!servingSlugs.has(srv)) errors.push(`${t.slug}: unknown serving ${srv}`);
    }
  }
  return errors;
}
