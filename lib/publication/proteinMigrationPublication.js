/**
 * FOOD-14F — Publication consumption of protein migration map.
 * Read-only helpers for projections and certification; no ownership logic.
 */

import { createProteinMigrationResolver } from "../runtime/proteinMigrationResolver.js";

export function loadProteinMigrationPublicationContext(root) {
  const resolver = createProteinMigrationResolver(root);
  const canonicalIds = new Set(resolver.map.migrations.map((entry) => entry.canonical_id));
  const legacyByCanonical = Object.fromEntries(
    resolver.map.migrations.map((entry) => [entry.canonical_id, entry.legacy_id])
  );
  return { resolver, canonicalIds, legacyByCanonical };
}

export function foodEndpointIdsForLeaf(leafId, resolver) {
  const ids = [leafId];
  const canonical = resolver.resolveProteinId(leafId);
  if (canonical !== leafId) ids.push(canonical);
  return ids;
}

export function collectEdgesForLeaf(leafId, bySource, resolver) {
  const seen = new Set();
  const edges = [];
  for (const id of foodEndpointIdsForLeaf(leafId, resolver)) {
    for (const edge of bySource[id] ?? []) {
      const key = `${edge.source}\t${edge.relationship}\t${edge.target}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push(edge);
    }
  }
  return edges;
}

export function isValidProteinPublicationFoodEndpoint(id, leafIds, canonicalIds, prepPrefix) {
  if (prepPrefix && id.startsWith(prepPrefix)) return true;
  if (leafIds.has(id)) return true;
  return canonicalIds.has(id);
}
