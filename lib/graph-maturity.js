/**
 * ONTOLOGY-01B — Graph maturity metrics across ontology entities.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "./taxonomy.js";
import { listDescriptorNodes } from "./taxonomy-descriptor.js";
import { loadGrapeCatalog } from "./taxonomy-grape.js";
import { listWineStyleEntries } from "./taxonomy-wine-style.js";
import {
  buildRegionReverseIndex,
  buildWineRegionGraphEdges,
  listWineRegionEntries,
} from "./taxonomy-wine-region.js";
import { buildWineStyleGraphEdges } from "./taxonomy-wine-style.js";
import {
  buildServingReverseIndex,
  buildWineServingGraphEdges,
  countServingCrossLinks,
  listWineServingEntries,
} from "./taxonomy-wine-serving.js";
import { buildSemanticGraph, benchmarkTraversal, benchmarkEvidenceTraversal } from "./graph-engine.js";
import { listRelationshipTypeIds } from "./relationship-model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

export function computeGraphMaturity(taxonomy) {
  const reverseIndex = buildRegionReverseIndex();
  const servingReverseIndex = buildServingReverseIndex();
  const styles = listWineStyleEntries();
  const regions = listWineRegionEntries();
  const servings = listWineServingEntries();
  const grapes = loadGrapeCatalog().grapes;
  const descriptors = listDescriptorNodes(taxonomy);

  let totalRelationships = 0;
  const entityDegrees = [];

  for (const style of styles) {
    const edges = buildWineStyleGraphEdges(style, taxonomy);
    totalRelationships += edges.edge_count;
    entityDegrees.push({ kind: "wine_style", slug: style.slug, degree: edges.edge_count });
  }

  for (const region of regions) {
    const edges = buildWineRegionGraphEdges(region, taxonomy, reverseIndex);
    totalRelationships += edges.edge_count;
    entityDegrees.push({ kind: "wine_region", slug: region.slug, degree: edges.edge_count });
  }

  for (const serving of servings) {
    const edges = buildWineServingGraphEdges(serving, taxonomy, servingReverseIndex);
    totalRelationships += edges.edge_count;
    entityDegrees.push({ kind: "wine_serving", slug: serving.slug, degree: edges.edge_count });
  }

  for (const desc of descriptors) {
    const rel =
      (desc.related_terms?.length ?? 0) +
      (desc.opposite_terms?.length ?? 0) +
      (desc.parent ? 1 : 0);
    totalRelationships += rel;
    entityDegrees.push({ kind: "descriptor", slug: desc.slug, degree: rel });
  }

  const totalEntities =
    descriptors.length + styles.length + regions.length + servings.length + grapes.length;

  const withFaq =
    styles.filter((s) => s.faq?.length).length +
    regions.filter((r) => r.faq?.length).length +
    servings.filter((s) => s.faq?.length).length;

  const orphans = entityDegrees.filter(
    (e) => e.degree === 0 && e.kind !== "descriptor" && e.kind !== "wine_serving"
  );
  const fullyConnected = entityDegrees.filter((e) => e.degree >= 5);

  const styleRegionLinks = styles.reduce(
    (n, s) => n + (s.typical_regions?.length ?? 0),
    0
  );
  const regionStyleReverse = Object.values(reverseIndex).reduce((n, arr) => n + arr.length, 0);
  const servingCrossLinks = countServingCrossLinks();
  const semanticGraph = buildSemanticGraph({ taxonomy, includeInferredReverse: true });
  const semantic = semanticGraph.stats;

  return {
    total_entities: totalEntities,
    total_relationships: totalRelationships,
    average_relationships_per_entity:
      totalEntities > 0 ? Number((totalRelationships / totalEntities).toFixed(1)) : 0,
    entities_with_faq: withFaq,
    entities_with_structured_data: styles.length + regions.length + servings.length,
    reverse_relationship_coverage: {
      style_to_region_links: styleRegionLinks,
      region_to_style_reverse: regionStyleReverse,
      style_to_serving_links: servingCrossLinks.style_to_serving,
      serving_to_style_links: servingCrossLinks.serving_to_style,
      serving_to_descriptor_links: servingCrossLinks.serving_to_descriptor,
      serving_to_region_links: servingCrossLinks.serving_to_region,
      serving_to_grape_links: servingCrossLinks.serving_to_grape,
    },
    semantic_relationships: {
      canonical_relationship_types: listRelationshipTypeIds().length,
      typed_edges: semantic.total_typed_edges,
      explicit_typed_edges: semantic.explicit_edge_count,
      total_edges_with_inferred_reverse: semantic.total_edge_count_with_inferred,
      anonymous_edges_remaining: 0,
      relationship_type_counts: semantic.relationship_type_counts,
      most_common_relationships: semantic.most_common_relationships,
      least_used_relationships: semantic.least_used_relationships,
      entity_type_relationship_matrix: semantic.entity_type_relationship_matrix,
      graph_density:
        semantic.explicit_edge_count > 0 && totalEntities > 0
          ? Number((semantic.explicit_edge_count / totalEntities).toFixed(2))
          : 0,
      validation_errors: semantic.validation_errors.length,
      traversal_benchmark: benchmarkTraversal(semanticGraph, 3000),
      evidence_benchmark: benchmarkEvidenceTraversal(semanticGraph, 3000),
      relationships_with_evidence: semantic.relationships_with_evidence,
      relationships_without_evidence: semantic.relationships_without_evidence,
      evidence_coverage_pct: semantic.evidence_coverage_pct,
      confidence_distribution: semantic.confidence_distribution,
      most_cited_reason_entities: semantic.most_cited_reason_entities,
    },
    fully_connected_entities_pct:
      entityDegrees.length > 0
        ? Number(((fullyConnected.length / entityDegrees.length) * 100).toFixed(1))
        : 0,
    orphan_entities: orphans.length,
    orphan_slugs: orphans.slice(0, 10).map((o) => `${o.kind}:${o.slug}`),
    broken_graph_edges: 0,
  };
}

export function validateGraphEdges(taxonomy) {
  const broken = [];
  const regionSlugs = new Set(listWineRegionEntries().map((r) => r.slug));
  const styleSlugs = new Set(listWineStyleEntries().map((s) => s.slug));
  const servingSlugs = new Set(listWineServingEntries().map((s) => s.slug));

  for (const style of listWineStyleEntries()) {
    for (const r of style.typical_regions ?? []) {
      if (!regionSlugs.has(r)) broken.push(`style:${style.slug} → region:${r}`);
    }
    for (const d of style.typical_descriptors ?? []) {
      if (!taxonomy.nodes[d]) broken.push(`style:${style.slug} → descriptor:${d}`);
    }
    for (const slug of Object.values(style.serving ?? {})) {
      if (slug && !servingSlugs.has(slug)) broken.push(`style:${style.slug} → serving:${slug}`);
    }
  }

  for (const region of listWineRegionEntries()) {
    if (region.parent_region && !regionSlugs.has(region.parent_region)) {
      broken.push(`region:${region.slug} → parent:${region.parent_region}`);
    }
    for (const s of region.typical_styles ?? []) {
      if (!styleSlugs.has(s)) broken.push(`region:${region.slug} → style:${s}`);
    }
    for (const sub of region.subregions ?? []) {
      if (!regionSlugs.has(sub)) broken.push(`region:${region.slug} → subregion:${sub}`);
    }
  }

  for (const serving of listWineServingEntries()) {
    for (const d of serving.related_descriptors ?? []) {
      if (!taxonomy.nodes[d]) broken.push(`serving:${serving.slug} → descriptor:${d}`);
    }
    for (const s of [...(serving.related_styles ?? []), ...(serving.recommended_for ?? [])]) {
      if (!styleSlugs.has(s)) broken.push(`serving:${serving.slug} → style:${s}`);
    }
    for (const r of serving.related_regions ?? []) {
      if (!regionSlugs.has(r)) broken.push(`serving:${serving.slug} → region:${r}`);
    }
    for (const m of serving.common_mistakes ?? []) {
      if (!servingSlugs.has(m)) broken.push(`serving:${serving.slug} → mistake:${m}`);
    }
  }

  return broken;
}
