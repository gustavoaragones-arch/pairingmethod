/**
 * ONTOLOGY-01C.5 — Map catalog fields to canonical typed semantic edges.
 */

import { loadTaxonomy } from "./taxonomy.js";
import { listDescriptorNodes } from "./taxonomy-descriptor.js";
import { loadGrapeCatalog } from "./taxonomy-grape.js";
import { dedupeTypedEdges } from "./relationship-model.js";
import { listWineStyleEntries } from "./taxonomy-wine-style.js";
import {
  buildRegionReverseIndex,
  listWineRegionEntries,
} from "./taxonomy-wine-region.js";
import {
  buildServingReverseIndex,
  listWineServingEntries,
} from "./taxonomy-wine-serving.js";
import { listWinemakingTechniqueEntries } from "./taxonomy-winemaking-technique.js";
import { listWineFaultEntries } from "./taxonomy-wine-fault.js";

const SERVING_RELATIONSHIP_BY_KEY = {
  temperature: "recommended_temperature",
  glassware: "recommended_glass",
  decanting: "recommended_decanting",
  cellaring: "recommended_cellaring",
};

function slugFromValue(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.slug ?? null;
}

function slugsFromArray(arr) {
  return (arr ?? []).map(slugFromValue).filter(Boolean);
}

/**
 * @param {string} sourceKind
 * @param {TypedEdge[]} typedEdges
 * @param {Record<string, unknown>} legacyBuckets
 */
export function attachTypedEdges(legacyBuckets, typedEdges, sourceKind) {
  const deduped = dedupeTypedEdges(typedEdges);
  return {
    ...legacyBuckets,
    typed_edges: deduped,
    typed_edge_count: deduped.length,
    source_kind: sourceKind,
  };
}

export function buildStyleTypedEdges(style) {
  const edges = [];

  for (const slug of slugsFromArray(style.typical_descriptors)) {
    edges.push({ type: "typically_exhibits", target: slug, target_kind: "descriptor", source_field: "typical_descriptors" });
  }

  for (const grape of style.primary_grapes ?? []) {
    const slug = slugFromValue(grape);
    if (slug) edges.push({ type: "contains_grape", target: slug, target_kind: "grape_variety", source_field: "primary_grapes" });
  }

  for (const item of style.food_pairings ?? []) {
    const slug = item.slug;
    if (!slug) continue;
    const type = item.tier === "primary" ? "pairs_best_with" : "pairs_with";
    edges.push({ type, target: slug, target_kind: "pairing", source_field: "food_pairings" });
  }

  for (const slug of slugsFromArray(style.related_styles)) {
    edges.push({ type: "similar_to", target: slug, target_kind: "wine_style", source_field: "related_styles" });
  }

  for (const slug of slugsFromArray(style.substitutes)) {
    edges.push({ type: "substitute_for", target: slug, target_kind: "wine_style", source_field: "substitutes" });
  }

  for (const slug of slugsFromArray(style.typical_regions)) {
    edges.push({ type: "produced_in", target: slug, target_kind: "wine_region", source_field: "typical_regions" });
  }

  for (const [key, slug] of Object.entries(style.serving ?? {})) {
    if (!slug) continue;
    const type = SERVING_RELATIONSHIP_BY_KEY[key];
    if (type) edges.push({ type, target: slug, target_kind: "wine_serving", source_field: `serving.${key}` });
  }

  return dedupeTypedEdges(edges);
}

export function buildRegionTypedEdges(region, reverseIndex = {}) {
  const edges = [];

  for (const slug of slugsFromArray(region.typical_descriptors)) {
    edges.push({ type: "commonly_expresses", target: slug, target_kind: "descriptor", source_field: "typical_descriptors" });
  }

  for (const slug of slugsFromArray(region.typical_grapes)) {
    edges.push({ type: "common_in_region", target: slug, target_kind: "grape_variety", source_field: "typical_grapes" });
  }

  for (const slug of slugsFromArray(region.typical_styles)) {
    edges.push({ type: "typical_of_region", target: slug, target_kind: "wine_style", source_field: "typical_styles" });
  }

  for (const slug of slugsFromArray(reverseIndex[region.slug])) {
    edges.push({
      type: "typical_of_region",
      target: slug,
      target_kind: "wine_style",
      source_field: "reverse:style.typical_regions",
      inferred: true,
    });
  }

  if (region.parent_region) {
    edges.push({
      type: "child_of",
      target: region.parent_region,
      target_kind: "wine_region",
      source_field: "parent_region",
    });
  }

  for (const slug of slugsFromArray(region.subregions)) {
    edges.push({ type: "contains", target: slug, target_kind: "wine_region", source_field: "subregions" });
  }

  for (const slug of slugsFromArray(region.related_regions)) {
    edges.push({ type: "similar_to", target: slug, target_kind: "wine_region", source_field: "related_regions" });
  }

  for (const item of region.food_pairings ?? []) {
    const slug = typeof item === "string" ? null : item.slug;
    if (slug) edges.push({ type: "pairs_with", target: slug, target_kind: "pairing", source_field: "food_pairings" });
  }

  return dedupeTypedEdges(edges);
}

export function buildServingTypedEdges(entity, reverseIndex = {}) {
  const edges = [];

  for (const slug of slugsFromArray(entity.related_descriptors)) {
    edges.push({ type: "related_descriptor", target: slug, target_kind: "descriptor", source_field: "related_descriptors" });
  }

  for (const slug of slugsFromArray(entity.related_grapes)) {
    edges.push({ type: "associated_with", target: slug, target_kind: "grape_variety", source_field: "related_grapes" });
  }

  const styleSlugs = new Set([
    ...slugsFromArray(entity.related_styles),
    ...slugsFromArray(entity.recommended_for),
    ...slugsFromArray(reverseIndex[entity.slug]),
  ]);

  for (const slug of styleSlugs) {
    edges.push({ type: "recommended_for", target: slug, target_kind: "wine_style", source_field: "related_styles|recommended_for|reverse" });
  }

  for (const slug of slugsFromArray(entity.related_regions)) {
    edges.push({ type: "associated_with", target: slug, target_kind: "wine_region", source_field: "related_regions" });
  }

  for (const slug of slugsFromArray(entity.common_mistakes)) {
    edges.push({ type: "confused_with", target: slug, target_kind: "wine_serving", source_field: "common_mistakes" });
  }

  return dedupeTypedEdges(edges);
}

export function buildWinemakingTypedEdges(technique) {
  const edges = [];

  for (const slug of slugsFromArray(technique.creates_descriptors)) {
    edges.push({ type: "creates_descriptor", target: slug, target_kind: "descriptor", source_field: "creates_descriptors" });
  }
  for (const slug of slugsFromArray(technique.reduces_descriptors)) {
    edges.push({ type: "reduces_descriptor", target: slug, target_kind: "descriptor", source_field: "reduces_descriptors" });
  }
  for (const slug of slugsFromArray(technique.common_styles)) {
    edges.push({ type: "common_in", target: slug, target_kind: "wine_style", source_field: "common_styles" });
  }
  for (const slug of slugsFromArray(technique.common_regions)) {
    edges.push({ type: "common_in", target: slug, target_kind: "wine_region", source_field: "common_regions" });
  }
  for (const slug of slugsFromArray(technique.common_grapes)) {
    edges.push({ type: "associated_with", target: slug, target_kind: "grape_variety", source_field: "common_grapes" });
  }
  for (const slug of slugsFromArray(technique.related_techniques)) {
    edges.push({ type: "similar_to", target: slug, target_kind: "winemaking_technique", source_field: "related_techniques" });
  }
  for (const slug of slugsFromArray(technique.opposite_techniques)) {
    edges.push({ type: "confused_with", target: slug, target_kind: "winemaking_technique", source_field: "opposite_techniques" });
  }
  for (const slug of slugsFromArray(technique.serving_implications)) {
    edges.push({ type: "associated_with", target: slug, target_kind: "wine_serving", source_field: "serving_implications" });
  }

  return dedupeTypedEdges(edges);
}

export function resolveConfusedTargetKind(slug, taxonomy) {
  if (listWineFaultEntries().some((f) => f.slug === slug)) return "wine_fault";
  if (listWinemakingTechniqueEntries().some((t) => t.slug === slug)) return "winemaking_technique";
  const node = taxonomy?.nodes?.[slug];
  if (node && (node.type === "descriptor" || node.entity_type === "descriptor")) return "descriptor";
  return null;
}

export function buildWineFaultTypedEdges(fault, taxonomy) {
  const edges = [];

  for (const slug of slugsFromArray(fault.creates_descriptors)) {
    edges.push({ type: "creates_descriptor", target: slug, target_kind: "descriptor", source_field: "creates_descriptors" });
  }
  for (const slug of slugsFromArray(fault.reduces_descriptors)) {
    edges.push({ type: "reduces_descriptor", target: slug, target_kind: "descriptor", source_field: "reduces_descriptors" });
  }
  for (const slug of slugsFromArray(fault.common_styles)) {
    edges.push({ type: "common_in", target: slug, target_kind: "wine_style", source_field: "common_styles" });
  }
  for (const slug of slugsFromArray(fault.common_regions)) {
    edges.push({ type: "common_in", target: slug, target_kind: "wine_region", source_field: "common_regions" });
  }
  for (const slug of slugsFromArray(fault.common_grapes)) {
    edges.push({ type: "associated_with", target: slug, target_kind: "grape_variety", source_field: "common_grapes" });
  }
  for (const slug of slugsFromArray(fault.related_techniques)) {
    edges.push({ type: "associated_with", target: slug, target_kind: "winemaking_technique", source_field: "related_techniques" });
  }
  for (const slug of slugsFromArray(fault.serving_implications)) {
    edges.push({ type: "associated_with", target: slug, target_kind: "wine_serving", source_field: "serving_implications" });
  }
  for (const slug of slugsFromArray(fault.commonly_confused_with)) {
    const targetKind = resolveConfusedTargetKind(slug, taxonomy);
    if (targetKind) {
      edges.push({ type: "confused_with", target: slug, target_kind: targetKind, source_field: "commonly_confused_with" });
    }
  }

  return dedupeTypedEdges(edges);
}

export function buildDescriptorTypedEdges(descriptor, taxonomy) {
  const edges = [];

  if (descriptor.parent) {
    const parentNode = taxonomy?.nodes?.[descriptor.parent];
    const parentKind =
      parentNode?.entity_type === "descriptor_group" || parentNode?.type === "group"
        ? "descriptor_group"
        : "descriptor_group";
    edges.push({
      type: "child_of",
      target: descriptor.parent,
      target_kind: parentKind,
      source_field: "parent",
    });
  }

  for (const slug of slugsFromArray(descriptor.related_terms)) {
    edges.push({ type: "related_descriptor", target: slug, target_kind: "descriptor", source_field: "related_terms" });
  }

  for (const slug of slugsFromArray(descriptor.opposite_terms)) {
    edges.push({ type: "opposite_descriptor", target: slug, target_kind: "descriptor", source_field: "opposite_terms" });
  }

  return dedupeTypedEdges(edges);
}

export function buildGrapeTypedEdges(grape, knowledgeGraph) {
  const edges = [];
  const slug = grape.slug;
  const descriptors = knowledgeGraph?.reverse?.grapeToDescriptors?.[slug] ?? [];
  for (const desc of descriptors) {
    edges.push({ type: "typically_exhibits", target: desc, target_kind: "descriptor", source_field: "knowledge_graph" });
  }
  const pairings = knowledgeGraph?.reverse?.grapeToPairings?.[slug] ?? [];
  for (const pairing of pairings) {
    edges.push({ type: "pairs_with", target: pairing, target_kind: "pairing", source_field: "knowledge_graph" });
  }
  return dedupeTypedEdges(edges);
}

/**
 * Collect all explicit semantic edges across the ontology.
 *
 * @param {{ taxonomy?: object, knowledgeGraph?: object }} [options]
 */
export function collectAllTypedEdges(options = {}) {
  const taxonomy = options.taxonomy ?? loadTaxonomy();
  const regionReverse = options.regionReverse ?? buildRegionReverseIndex();
  const servingReverse = options.servingReverse ?? buildServingReverseIndex();
  const knowledgeGraph = options.knowledgeGraph ?? null;
  const semantic = [];

  for (const style of listWineStyleEntries()) {
    const source = style.slug;
    for (const edge of buildStyleTypedEdges(style)) {
      semantic.push({
        source,
        source_kind: "wine_style",
        ...edge,
      });
    }
  }

  for (const region of listWineRegionEntries()) {
    const source = region.slug;
    for (const edge of buildRegionTypedEdges(region, regionReverse)) {
      semantic.push({
        source,
        source_kind: "wine_region",
        ...edge,
      });
    }
  }

  for (const entity of listWineServingEntries()) {
    const source = entity.slug;
    for (const edge of buildServingTypedEdges(entity, servingReverse)) {
      semantic.push({
        source,
        source_kind: "wine_serving",
        ...edge,
      });
    }
  }

  for (const technique of listWinemakingTechniqueEntries()) {
    const source = technique.slug;
    for (const edge of buildWinemakingTypedEdges(technique)) {
      semantic.push({
        source,
        source_kind: "winemaking_technique",
        ...edge,
      });
    }
  }

  const taxonomyForFaults = options.taxonomy ?? loadTaxonomy();
  for (const fault of listWineFaultEntries()) {
    const source = fault.slug;
    for (const edge of buildWineFaultTypedEdges(fault, taxonomyForFaults)) {
      semantic.push({
        source,
        source_kind: "wine_fault",
        ...edge,
      });
    }
  }

  for (const descriptor of listDescriptorNodes(taxonomy)) {
    const source = descriptor.slug;
    for (const edge of buildDescriptorTypedEdges(descriptor, taxonomy)) {
      semantic.push({
        source,
        source_kind: "descriptor",
        ...edge,
      });
    }
  }

  if (knowledgeGraph) {
    for (const grape of loadGrapeCatalog().grapes) {
      const source = grape.slug;
      for (const edge of buildGrapeTypedEdges(grape, knowledgeGraph)) {
        semantic.push({
          source,
          source_kind: "grape_variety",
          ...edge,
        });
      }
    }
  }

  return semantic;
}

/**
 * Count relationship types and build entity×relationship matrix.
 *
 * @param {ReturnType<typeof collectAllTypedEdges>} edges
 */
export function summarizeTypedEdges(edges) {
  const byType = {};
  const matrix = {};

  for (const edge of edges) {
    byType[edge.type] = (byType[edge.type] ?? 0) + 1;
    if (!matrix[edge.source_kind]) matrix[edge.source_kind] = {};
    matrix[edge.source_kind][edge.type] = (matrix[edge.source_kind][edge.type] ?? 0) + 1;
  }

  const sorted = Object.entries(byType).sort((a, b) => b[1] - a[1]);
  return {
    relationship_type_counts: byType,
    total_typed_edges: edges.length,
    most_common_relationships: sorted.slice(0, 10).map(([type, count]) => ({ type, count })),
    least_used_relationships: sorted.filter(([, c]) => c > 0).slice(-10).map(([type, count]) => ({ type, count })),
    entity_type_relationship_matrix: matrix,
  };
}
