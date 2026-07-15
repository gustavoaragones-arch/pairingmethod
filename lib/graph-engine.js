/**
 * ONTOLOGY-01C.5 — Semantic graph engine with relationship-filtered traversal.
 */

import { loadTaxonomy } from "./taxonomy.js";
import { buildKnowledgeGraph } from "./taxonomy-graph.js";
import { inferReverseEdge, validateSemanticEdges, detectHierarchyCycles } from "./relationship-model.js";
import { collectAllTypedEdges, summarizeTypedEdges } from "./typed-edges.js";
import {
  buildRegionReverseIndex,
} from "./taxonomy-wine-region.js";
import {
  buildServingReverseIndex,
} from "./taxonomy-wine-serving.js";

export function entityKey(kind, slug) {
  return `${kind}:${slug}`;
}

export function parseEntityKey(key) {
  const idx = key.indexOf(":");
  if (idx < 0) return { kind: key, slug: "" };
  return { kind: key.slice(0, idx), slug: key.slice(idx + 1) };
}

/**
 * Build the full semantic graph with outbound and inbound indexes.
 *
 * @param {{ taxonomy?: object, WINES?: object, root?: string, includeInferredReverse?: boolean }} [options]
 */
export function buildSemanticGraph(options = {}) {
  const taxonomy = options.taxonomy ?? loadTaxonomy();
  const regionReverse = buildRegionReverseIndex();
  const servingReverse = buildServingReverseIndex();
  const knowledgeGraph = buildKnowledgeGraph({
    taxonomy,
    WINES: options.WINES,
    root: options.root,
  });

  const explicit = collectAllTypedEdges({
    taxonomy,
    regionReverse,
    servingReverse,
    knowledgeGraph,
  });

  const all = [...explicit];
  if (options.includeInferredReverse !== false) {
    for (const edge of explicit) {
      if (edge.inferred) continue;
      const rev = inferReverseEdge(edge);
      if (!rev) continue;
      const exists = all.some(
        (e) =>
          e.source === rev.source &&
          e.source_kind === rev.source_kind &&
          e.type === rev.type &&
          e.target === rev.target &&
          e.target_kind === rev.target_kind
      );
      if (!exists) all.push(rev);
    }
  }

  const outbound = new Map();
  const inbound = new Map();

  for (const edge of all) {
    const sourceKey = entityKey(edge.source_kind, edge.source);
    const targetKey = entityKey(edge.target_kind, edge.target);
    const record = { ...edge, source_key: sourceKey, target_key: targetKey };

    if (!outbound.has(sourceKey)) outbound.set(sourceKey, []);
    outbound.get(sourceKey).push(record);

    if (!inbound.has(targetKey)) inbound.set(targetKey, []);
    inbound.get(targetKey).push({ ...record, direction: "inbound" });
  }

  const summary = summarizeTypedEdges(explicit);
  const validationErrors = [
    ...validateSemanticEdges(all.filter((e) => !e.inferred)),
    ...detectHierarchyCycles(all),
  ];

  return {
    edges: all,
    explicit_edges: explicit,
    outbound,
    inbound,
    stats: {
      ...summary,
      explicit_edge_count: explicit.length,
      total_edge_count_with_inferred: all.length,
      entity_count: outbound.size,
      validation_errors: validationErrors,
    },
    knowledgeGraph,
  };
}

/**
 * Get neighbors of an entity, optionally filtered by relationship type.
 *
 * @param {ReturnType<typeof buildSemanticGraph>} graph
 * @param {string} kind
 * @param {string} slug
 * @param {string} [relationshipType]
 */
export function neighbors(graph, kind, slug, relationshipType) {
  const key = entityKey(kind, slug);
  const out = graph.outbound.get(key) ?? [];
  const inc = graph.inbound.get(key) ?? [];
  let combined = [
    ...out.map((e) => ({ direction: "outbound", ...e })),
    ...inc.map((e) => ({ direction: "inbound", ...e })),
  ];
  if (relationshipType) {
    combined = combined.filter((e) => e.type === relationshipType);
  }
  return combined;
}

/**
 * Outbound neighbors only.
 */
export function outboundNeighbors(graph, kind, slug, relationshipType) {
  const key = entityKey(kind, slug);
  let edges = graph.outbound.get(key) ?? [];
  if (relationshipType) edges = edges.filter((e) => e.type === relationshipType);
  return edges;
}

/**
 * Inbound neighbors only.
 */
export function inboundNeighbors(graph, kind, slug, relationshipType) {
  const key = entityKey(kind, slug);
  let edges = graph.inbound.get(key) ?? [];
  if (relationshipType) edges = edges.filter((e) => e.type === relationshipType);
  return edges;
}

/**
 * Benchmark relationship lookup performance.
 *
 * @param {ReturnType<typeof buildSemanticGraph>} graph
 * @param {number} [iterations]
 */
export function benchmarkTraversal(graph, iterations = 5000) {
  const keys = [...graph.outbound.keys()];
  if (!keys.length) {
    return { iterations: 0, ms_per_lookup: 0, keys_tested: 0 };
  }

  const types = [...new Set(graph.edges.map((e) => e.type))];
  const start = performance.now();

  for (let i = 0; i < iterations; i += 1) {
    const key = keys[i % keys.length];
    const { kind, slug } = parseEntityKey(key);
    const type = types[i % types.length];
    neighbors(graph, kind, slug, type);
  }

  const elapsed = performance.now() - start;
  return {
    iterations,
    ms_total: Number(elapsed.toFixed(3)),
    ms_per_lookup: Number((elapsed / iterations).toFixed(5)),
    keys_tested: keys.length,
    relationship_types_tested: types.length,
  };
}
