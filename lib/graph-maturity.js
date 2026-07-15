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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

export function computeGraphMaturity(taxonomy) {
  const reverseIndex = buildRegionReverseIndex();
  const styles = listWineStyleEntries();
  const regions = listWineRegionEntries();
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

  for (const desc of descriptors) {
    const rel =
      (desc.related_terms?.length ?? 0) +
      (desc.opposite_terms?.length ?? 0) +
      (desc.parent ? 1 : 0);
    totalRelationships += rel;
    entityDegrees.push({ kind: "descriptor", slug: desc.slug, degree: rel });
  }

  const totalEntities =
    descriptors.length + styles.length + regions.length + grapes.length;

  const withFaq =
    styles.filter((s) => s.faq?.length).length +
    regions.filter((r) => r.faq?.length).length;

  const orphans = entityDegrees.filter((e) => e.degree === 0 && e.kind !== "descriptor");
  const fullyConnected = entityDegrees.filter((e) => e.degree >= 5);

  const styleRegionLinks = styles.reduce(
    (n, s) => n + (s.typical_regions?.length ?? 0),
    0
  );
  const regionStyleReverse = Object.values(reverseIndex).reduce((n, arr) => n + arr.length, 0);

  return {
    total_entities: totalEntities,
    total_relationships: totalRelationships,
    average_relationships_per_entity:
      totalEntities > 0 ? Number((totalRelationships / totalEntities).toFixed(1)) : 0,
    entities_with_faq: withFaq,
    entities_with_structured_data: styles.length + regions.length,
    reverse_relationship_coverage: {
      style_to_region_links: styleRegionLinks,
      region_to_style_reverse: regionStyleReverse,
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

  for (const style of listWineStyleEntries()) {
    for (const r of style.typical_regions ?? []) {
      if (!regionSlugs.has(r)) broken.push(`style:${style.slug} → region:${r}`);
    }
    for (const d of style.typical_descriptors ?? []) {
      if (!taxonomy.nodes[d]) broken.push(`style:${style.slug} → descriptor:${d}`);
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

  return broken;
}
