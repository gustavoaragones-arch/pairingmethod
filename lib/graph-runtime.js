/**
 * ONTOLOGY-01C.5 — Relationship-aware graph runtime (Node; UI-agnostic).
 *
 * Prepares semantic traversal for future browser codegen without changing pages.
 */

import { buildSemanticGraph, neighbors, outboundNeighbors, inboundNeighbors, entityKey, parseEntityKey } from "./graph-engine.js";

let _graph = null;

export function getSemanticGraph(options = {}) {
  if (!_graph || options.refresh) {
    _graph = buildSemanticGraph(options);
  }
  return _graph;
}

export function resetSemanticGraph() {
  _graph = null;
}

export function getNeighbors(kind, slug, relationshipType) {
  return neighbors(getSemanticGraph(), kind, slug, relationshipType);
}

export function getOutbound(kind, slug, relationshipType) {
  return outboundNeighbors(getSemanticGraph(), kind, slug, relationshipType);
}

export function getInbound(kind, slug, relationshipType) {
  return inboundNeighbors(getSemanticGraph(), kind, slug, relationshipType);
}

export function findEntitiesByRelationship(relationshipType, targetKind, targetSlug) {
  const graph = getSemanticGraph();
  const key = entityKey(targetKind, targetSlug);
  const inbound = graph.inbound.get(key) ?? [];
  return inbound
    .filter((e) => e.type === relationshipType)
    .map((e) => ({ kind: e.source_kind, slug: e.source, edge: e }));
}

export function relationshipStats() {
  return getSemanticGraph().stats;
}

export { entityKey, parseEntityKey, buildSemanticGraph, neighbors, outboundNeighbors, inboundNeighbors };
