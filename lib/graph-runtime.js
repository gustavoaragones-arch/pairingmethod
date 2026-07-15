/**
 * ONTOLOGY-01C.5 — Relationship-aware graph runtime (Node; UI-agnostic).
 *
 * Prepares semantic traversal for future browser codegen without changing pages.
 */

import { buildSemanticGraph, neighbors, outboundNeighbors, inboundNeighbors, entityKey, parseEntityKey, benchmarkEvidenceTraversal } from "./graph-engine.js";
import {
  summarizeRelationshipEvidence,
  resolveReasonEntities,
  findEvidenceAnnotation,
} from "./relationship-evidence.js";

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

function findOutboundEdge(kind, slug, type, targetKind, target) {
  const edges = outboundNeighbors(getSemanticGraph(), kind, slug, type);
  return edges.find((e) => e.target === target && e.target_kind === targetKind) ?? null;
}

export function getRelationshipEvidence(kind, slug, type, targetKind, target) {
  const edge = findOutboundEdge(kind, slug, type, targetKind, target);
  if (!edge?.evidence) return findEvidenceAnnotation(kind, slug, type, targetKind, target);
  return edge.evidence;
}

export function relationshipReason(kind, slug, type, targetKind, target, options = {}) {
  const evidence = getRelationshipEvidence(kind, slug, type, targetKind, target);
  if (!evidence) return [];
  return resolveReasonEntities(evidence, options);
}

export function relationshipConfidence(kind, slug, type, targetKind, target) {
  const evidence = getRelationshipEvidence(kind, slug, type, targetKind, target);
  return evidence?.confidence ?? null;
}

export function relationshipEvidenceSummary(kind, slug, type, targetKind, target, options = {}) {
  const edge = findOutboundEdge(kind, slug, type, targetKind, target);
  if (!edge) return null;
  return summarizeRelationshipEvidence(edge, options);
}

export function evidenceBenchmark(iterations = 3000) {
  return benchmarkEvidenceTraversal(getSemanticGraph(), iterations);
}

export { entityKey, parseEntityKey, buildSemanticGraph, neighbors, outboundNeighbors, inboundNeighbors };
