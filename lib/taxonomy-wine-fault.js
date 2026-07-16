/**
 * ONTOLOGY-01E — Wine Fault entity context from catalog + knowledge graph.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "./taxonomy.js";
import {
  grapeUrl,
  winemakingTechniqueUrl,
  wineFaultUrl,
  wineRegionUrl,
  wineServingUrl,
  wineStyleUrl,
} from "./public-url.js";
import { loadGrapeCatalog } from "./taxonomy-grape.js";
import { listWinemakingTechniqueEntries } from "./taxonomy-winemaking-technique.js";
import { attachTypedEdges, buildWineFaultTypedEdges, resolveConfusedTargetKind } from "./typed-edges.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "..", "data", "wine-fault-catalog.json");
const STYLE_CATALOG_PATH = path.join(__dirname, "..", "data", "wine-style-catalog.json");
const REGION_CATALOG_PATH = path.join(__dirname, "..", "data", "wine-region-catalog.json");
const SERVING_CATALOG_PATH = path.join(__dirname, "..", "data", "wine-serving-catalog.json");

export function loadWineFaultCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
}

export function listWineFaultEntries() {
  return loadWineFaultCatalog().faults ?? loadWineFaultCatalog().entities ?? [];
}

export function wineFaultBySlug(slug) {
  return listWineFaultEntries().find((e) => e.slug === slug) ?? null;
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

function resolveFaults(slugs) {
  const bySlug = Object.fromEntries(listWineFaultEntries().map((f) => [f.slug, f]));
  return (slugs ?? [])
    .map((slug) => {
      const f = bySlug[slug];
      if (!f) return null;
      return { slug, name: f.name, href: wineFaultUrl(slug) };
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

function resolveConfused(slugs, taxonomy) {
  return (slugs ?? [])
    .map((slug) => {
      const kind = resolveConfusedTargetKind(slug, taxonomy);
      if (kind === "wine_fault") {
        const f = wineFaultBySlug(slug);
        return f ? { slug, name: f.name, href: wineFaultUrl(slug), kind: "Wine Fault" } : null;
      }
      if (kind === "winemaking_technique") {
        const t = listWinemakingTechniqueEntries().find((x) => x.slug === slug);
        return t ? { slug, name: t.name, href: winemakingTechniqueUrl(slug), kind: "Winemaking Technique" } : null;
      }
      if (kind === "descriptor") {
        const d = taxonomy.nodes[slug];
        return d ? { slug, name: d.name, href: `/terms/${slug}`, kind: "Descriptor" } : null;
      }
      return null;
    })
    .filter(Boolean);
}

export function buildWineFaultGraphEdges(fault, taxonomy) {
  const creates = resolveDescriptors(taxonomy, fault.creates_descriptors);
  const reduces = resolveDescriptors(taxonomy, fault.reduces_descriptors);
  const styles = resolveStyles(fault.common_styles);
  const regions = resolveRegions(fault.common_regions);
  const grapes = resolveGrapes(fault.common_grapes).filter((g) => g.href);
  const techniques = resolveTechniques(fault.related_techniques);
  const confused = resolveConfused(fault.commonly_confused_with, taxonomy);
  const serving = resolveServing(fault.serving_implications);

  return attachTypedEdges(
    {
      creates_descriptors: creates.map((d) => d.slug),
      reduces_descriptors: reduces.map((d) => d.slug),
      styles: styles.map((s) => s.slug),
      regions: regions.map((r) => r.slug),
      grapes: grapes.map((g) => g.slug),
      related_techniques: techniques.map((t) => t.slug),
      commonly_confused_with: confused.map((c) => c.slug),
      serving_implications: serving.map((s) => s.slug),
      edge_count:
        creates.length +
        reduces.length +
        styles.length +
        regions.length +
        grapes.length +
        techniques.length +
        confused.length +
        serving.length,
    },
    buildWineFaultTypedEdges(fault, taxonomy),
    "wine_fault"
  );
}

export function buildWineFaultPageContext(fault, options = {}) {
  const taxonomy = options.taxonomy ?? loadTaxonomy();
  const creates = resolveDescriptors(taxonomy, fault.creates_descriptors);
  const reduces = resolveDescriptors(taxonomy, fault.reduces_descriptors);
  const styles = resolveStyles(fault.common_styles);
  const regions = resolveRegions(fault.common_regions);
  const grapes = resolveGrapes(fault.common_grapes);
  const techniques = resolveTechniques(fault.related_techniques);
  const confused = resolveConfused(fault.commonly_confused_with, taxonomy);
  const serving = resolveServing(fault.serving_implications);
  const graphEdges = buildWineFaultGraphEdges(fault, taxonomy);

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
  for (const d of creates.slice(0, 4)) {
    add(`/terms/${d.slug}`, d.name);
    addOntology(`/terms/${d.slug}`, d.name, "Descriptor");
  }
  for (const g of grapes.filter((x) => x.href).slice(0, 3)) {
    addOntology(g.href, g.name, "Grape Variety");
  }
  for (const t of techniques.slice(0, 4)) {
    add(t.href, t.name);
    addOntology(t.href, t.name, "Winemaking Technique");
  }
  for (const c of confused.slice(0, 4)) {
    add(c.href, c.name);
    addOntology(c.href, c.name, c.kind);
  }
  for (const srv of serving.slice(0, 3)) {
    add(srv.href, srv.name);
    addOntology(srv.href, srv.name, "Serving");
  }

  const title = fault.seo_title || `${fault.name} — Wine Fault Guide`;
  const metaDescription = fault.seo_description || fault.summary.slice(0, 155);

  return {
    entity: fault,
    fault,
    creates,
    reduces,
    styles,
    regions,
    grapes,
    techniques,
    confused,
    serving,
    relatedPages,
    ontologyEntities,
    graphEdges,
    title,
    metaDescription,
  };
}

export function validateWineFaultCatalog(taxonomy) {
  const errors = [];
  const faultSlugs = new Set(listWineFaultEntries().map((f) => f.slug));
  const styleSlugs = new Set(listWineStyleEntriesFromCatalog().map((s) => s.slug));
  const regionSlugs = new Set(listWineRegionEntriesFromCatalog().map((r) => r.slug));
  const servingSlugs = new Set(listWineServingEntriesFromCatalog().map((s) => s.slug));
  const grapeSlugs = new Set(loadGrapeCatalog().grapes.map((g) => g.slug));
  const techniqueSlugs = new Set(listWinemakingTechniqueEntries().map((t) => t.slug));

  for (const f of listWineFaultEntries()) {
    if (f.entity_type !== "wine_fault") {
      errors.push(`${f.slug}: entity_type must be wine_fault`);
    }
    for (const d of [...(f.creates_descriptors ?? []), ...(f.reduces_descriptors ?? [])]) {
      const node = taxonomy.nodes[d];
      if (!node || (node.type !== "descriptor" && node.entity_type !== "descriptor")) {
        errors.push(`${f.slug}: unknown descriptor ${d}`);
      }
    }
    for (const s of f.common_styles ?? []) {
      if (!styleSlugs.has(s)) errors.push(`${f.slug}: unknown style ${s}`);
    }
    for (const r of f.common_regions ?? []) {
      if (!regionSlugs.has(r)) errors.push(`${f.slug}: unknown region ${r}`);
    }
    for (const g of f.common_grapes ?? []) {
      if (!grapeSlugs.has(g)) errors.push(`${f.slug}: unknown grape ${g}`);
    }
    for (const slug of f.related_techniques ?? []) {
      if (!techniqueSlugs.has(slug)) errors.push(`${f.slug}: unknown technique ${slug}`);
    }
    for (const srv of f.serving_implications ?? []) {
      if (!servingSlugs.has(srv)) errors.push(`${f.slug}: unknown serving ${srv}`);
    }
    for (const slug of f.commonly_confused_with ?? []) {
      const kind = resolveConfusedTargetKind(slug, taxonomy);
      if (!kind) errors.push(`${f.slug}: unknown confused_with target ${slug}`);
      if (kind === "wine_fault" && !faultSlugs.has(slug)) {
        errors.push(`${f.slug}: unknown fault ${slug}`);
      }
      if (kind === "winemaking_technique" && !techniqueSlugs.has(slug)) {
        errors.push(`${f.slug}: unknown technique ${slug}`);
      }
      if (kind === "descriptor" && !taxonomy.nodes[slug]) {
        errors.push(`${f.slug}: unknown descriptor ${slug}`);
      }
    }
  }
  return errors;
}
