/**
 * FOOD-14D — Protein editorial refinement against migration map + resolver.
 * Remaps deprecated Protein endpoints to canonical cross-domain IDs only.
 */

import { createProteinMigrationResolver } from "../runtime/proteinMigrationResolver.js";

export const EDITORIAL_RELATIONSHIP_TYPES = [
  "similar_to",
  "substitutes_for",
  "commonly_prepared_as",
  "shares_culinary_role",
];

export const SYMMETRIC_TYPES = new Set(["similar_to", "shares_culinary_role"]);

export const PREPARATION_IDS = new Set([
  "preparation.barbecue",
  "preparation.bake",
  "preparation.braise",
  "preparation.grill",
  "preparation.pan-seared",
  "preparation.poach",
  "preparation.roast",
  "preparation.smoke",
  "preparation.stir-fry",
]);

export function edgeKey(edge) {
  return `${edge.source}\t${edge.relationship}\t${edge.target}`;
}

export function canonicalPair(source, target) {
  return source.localeCompare(target) <= 0 ? [source, target] : [target, source];
}

export function resolveEditorialEndpoint(id, resolver) {
  if (!id || typeof id !== "string") return id;
  if (!id.startsWith("food.")) return id;
  return resolver.resolveProteinId(id);
}

export function buildValidEndpointSets(resolver, idMap) {
  const activeProteinIds = new Set(Object.keys(idMap));
  const canonicalIds = new Set(resolver.map.migrations.map((entry) => entry.canonical_id));
  const retainedIds = new Set(resolver.map.retained.map((entry) => entry.protein_id));
  return { activeProteinIds, canonicalIds, retainedIds };
}

export function isValidFoodEndpoint(id, { activeProteinIds, canonicalIds }, resolver) {
  if (!id.startsWith("food.")) return false;
  if (resolver.isDeprecatedProtein(id)) return false;
  if (activeProteinIds.has(id)) return true;
  return canonicalIds.has(id);
}

export function classifyEditorialEdge(edge, resolver, idMap) {
  const sets = buildValidEndpointSets(resolver, idMap);
  const sourceResolved = resolveEditorialEndpoint(edge.source, resolver);
  const targetResolved = resolveEditorialEndpoint(edge.target, resolver);

  const sourceDeprecated = edge.source.startsWith("food.protein.") && resolver.isDeprecatedProtein(edge.source);
  const targetDeprecated =
    edge.target.startsWith("food.protein.") && resolver.isDeprecatedProtein(edge.target);

  const sourceRemaps = sourceResolved !== edge.source;
  const targetRemaps = targetResolved !== edge.target;

  let classification = "unchanged";
  if (sourceDeprecated || targetDeprecated) {
    classification = "deprecated_endpoint";
  } else if (sourceRemaps || targetRemaps) {
    classification = "remap_required";
  }

  const sourceOrphan =
    edge.source.startsWith("food.") &&
    !isValidFoodEndpoint(sourceResolved, sets, resolver) &&
    !sourceDeprecated;
  const targetOrphan =
    edge.target.startsWith("food.") &&
    edge.relationship !== "commonly_prepared_as" &&
    !isValidFoodEndpoint(targetResolved, sets, resolver) &&
    !targetDeprecated;

  if (sourceOrphan || targetOrphan) {
    classification = "orphan";
  }

  return {
    relationship: edge.relationship,
    source: edge.source,
    target: edge.target,
    source_resolved: sourceResolved,
    target_resolved: targetResolved,
    classification,
    source_deprecated: sourceDeprecated,
    target_deprecated: targetDeprecated,
  };
}

export function buildEditorialInventory(edges, resolver, idMap) {
  const entries = edges.map((edge) => classifyEditorialEdge(edge, resolver, idMap));
  const remappedPreview = remapEditorialEdges(edges, resolver);
  const { collapsed, duplicatesBeforeCollapse, duplicatesRemoved } = collapseEditorialEdges(remappedPreview);

  const duplicateAfterRemapKeys = new Set();
  const previewKeys = remappedPreview.map(edgeKey);
  const previewKeyCounts = previewKeys.reduce((acc, key) => {
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  for (const entry of entries) {
    let source = entry.source_resolved;
    let target = entry.target_resolved;
    if (SYMMETRIC_TYPES.has(entry.relationship)) {
      [source, target] = canonicalPair(source, target);
    }
    const key = `${source}\t${entry.relationship}\t${target}`;
    if ((previewKeyCounts[key] ?? 0) > 1) {
      entry.classification =
        entry.classification === "unchanged" ? "duplicate_after_remap" : entry.classification;
      duplicateAfterRemapKeys.add(key);
    }
  }

  const counts = {
    unchanged: 0,
    remap_required: 0,
    deprecated_endpoint: 0,
    duplicate_after_remap: 0,
    orphan: 0,
  };

  for (const entry of entries) {
    if (entry.classification === "orphan") {
      counts.orphan += 1;
      continue;
    }
    if (entry.classification === "duplicate_after_remap") {
      counts.duplicate_after_remap += 1;
    }
    if (entry.source_deprecated || entry.target_deprecated) {
      counts.deprecated_endpoint += 1;
      counts.remap_required += 1;
      continue;
    }
    if (entry.source_resolved !== entry.source || entry.target_resolved !== entry.target) {
      counts.remap_required += 1;
      continue;
    }
    counts.unchanged += 1;
  }

  return {
    entries,
    counts,
    remapped_edge_count: remappedPreview.length,
    duplicate_after_remap_keys: [...duplicateAfterRemapKeys].sort(),
    collapsed_edge_count: collapsed.length,
    duplicates_before_collapse: duplicatesBeforeCollapse,
    duplicates_removed: duplicatesRemoved,
  };
}

export function remapEditorialEdge(edge, resolver) {
  let source = resolveEditorialEndpoint(edge.source, resolver);
  let target = resolveEditorialEndpoint(edge.target, resolver);

  if (SYMMETRIC_TYPES.has(edge.relationship)) {
    [source, target] = canonicalPair(source, target);
  }

  return {
    ...edge,
    source,
    target,
  };
}

export function remapEditorialEdges(edges, resolver) {
  return edges.map((edge) => remapEditorialEdge(edge, resolver));
}

export function collapseEditorialEdges(edges) {
  const sorted = [...edges].sort((a, b) => edgeKey(a).localeCompare(edgeKey(b)));
  const seen = new Set();
  const collapsed = [];
  let duplicatesBeforeCollapse = 0;

  for (const edge of sorted) {
    const key = edgeKey(edge);
    if (seen.has(key)) {
      duplicatesBeforeCollapse += 1;
      continue;
    }
    seen.add(key);
    collapsed.push(edge);
  }

  return {
    collapsed,
    duplicatesBeforeCollapse,
    duplicatesRemoved: sorted.length - collapsed.length,
  };
}

export function refineProteinEditorialRelationships({
  editorial,
  resolver,
  idMap,
  catalogVersion,
}) {
  const inventoryBefore = buildEditorialInventory(editorial.edges, resolver, idMap);
  const remapped = remapEditorialEdges(editorial.edges, resolver);
  const { collapsed, duplicatesBeforeCollapse, duplicatesRemoved } = collapseEditorialEdges(remapped);

  const usedTypes = EDITORIAL_RELATIONSHIP_TYPES.filter((type) =>
    collapsed.some((edge) => edge.relationship === type)
  );

  const typeCounts = Object.fromEntries(EDITORIAL_RELATIONSHIP_TYPES.map((type) => [type, 0]));
  for (const edge of collapsed) {
    typeCounts[edge.relationship] = (typeCounts[edge.relationship] ?? 0) + 1;
  }

  return {
    meta: {
      phase: "FOOD-14D",
      version: editorial.meta?.version ?? "1.0",
      catalog_version: catalogVersion ?? editorial.meta?.catalog_version ?? null,
      layer: "editorial",
      relationship_types: usedTypes,
      edge_count: collapsed.length,
      migration_map: "data/protein-migration-map.json",
      resolver: "lib/runtime/proteinMigrationResolver.js",
      inputs: [
        "data/protein-migration-map.json",
        "data/runtime/protein-food-editorial-relationships.json",
        "data/runtime/protein-food-id-map.json",
        "lib/runtime/proteinMigrationResolver.js",
      ],
      refinement: {
        edges_before: editorial.edges.length,
        edges_after: collapsed.length,
        remapped_edges: inventoryBefore.counts.remap_required ?? 0,
        deprecated_endpoints_before:
          (inventoryBefore.counts.deprecated_endpoint ?? 0) +
          (inventoryBefore.counts.remap_required ?? 0),
        duplicates_before_collapse: duplicatesBeforeCollapse,
        duplicates_removed: duplicatesRemoved,
      },
    },
    edges: collapsed,
    stats: {
      relationship_types: usedTypes.length,
      total_edges: collapsed.length,
      relationship_type_counts: typeCounts,
      remapped_edges: editorial.edges.filter((edge, index) => {
        const mapped = remapped[index];
        return mapped.source !== edge.source || mapped.target !== edge.target;
      }).length,
      duplicates_before_collapse: duplicatesBeforeCollapse,
      duplicates_removed: duplicatesRemoved,
    },
    inventoryBefore,
  };
}

export function validateRefinedEditorial({
  output,
  resolver,
  idMap,
  structural,
}) {
  const errors = [];
  const sets = buildValidEndpointSets(resolver, idMap);
  const seen = new Set();
  const structuralKeys = new Set((structural?.edges ?? []).map(edgeKey));

  let deprecatedEndpoints = 0;
  let orphanReferences = 0;
  let duplicates = 0;

  for (const edge of output.edges) {
    const key = edgeKey(edge);
    if (seen.has(key)) {
      duplicates += 1;
      errors.push(`Duplicate editorial edge: ${key}`);
    }
    seen.add(key);

    if (edge.source === edge.target) {
      errors.push(`Self-reference: ${key}`);
    }

    if (edge.source.startsWith("food.protein.") && resolver.isDeprecatedProtein(edge.source)) {
      deprecatedEndpoints += 1;
      errors.push(`Deprecated source endpoint: ${edge.source}`);
    }

    if (edge.target.startsWith("food.protein.") && resolver.isDeprecatedProtein(edge.target)) {
      deprecatedEndpoints += 1;
      errors.push(`Deprecated target endpoint: ${edge.target}`);
    }

    if (!isValidFoodEndpoint(edge.source, sets, resolver)) {
      orphanReferences += 1;
      errors.push(`Invalid or orphan source: ${edge.source}`);
    }

    if (edge.relationship === "commonly_prepared_as") {
      if (!PREPARATION_IDS.has(edge.target)) {
        orphanReferences += 1;
        errors.push(`Invalid preparation target: ${edge.target}`);
      }
    } else if (!isValidFoodEndpoint(edge.target, sets, resolver)) {
      orphanReferences += 1;
      errors.push(`Invalid or orphan target: ${edge.target}`);
    }

    if (structuralKeys.has(key)) {
      errors.push(`Conflicts with structural relationship: ${key}`);
    }

    if (edge.derived_from !== "editorial") {
      errors.push(`Invalid derived_from on ${key}`);
    }
    if (!edge.evidence || !String(edge.evidence).trim()) {
      errors.push(`Missing evidence on ${key}`);
    }
    if (!EDITORIAL_RELATIONSHIP_TYPES.includes(edge.relationship)) {
      errors.push(`Unknown relationship type: ${edge.relationship}`);
    }
  }

  for (const entry of resolver.map.retained) {
    const touching = output.edges.filter(
      (edge) => edge.source === entry.protein_id || edge.target === entry.protein_id
    );
    for (const edge of touching) {
      if (edge.source.startsWith("food.protein.") && edge.source !== entry.protein_id) continue;
      if (edge.target.startsWith("food.protein.") && edge.target !== entry.protein_id) continue;
      if (resolveEditorialEndpoint(edge.source, resolver) !== edge.source && edge.source === entry.protein_id) {
        errors.push(`Retained entity remapped unexpectedly: ${entry.protein_id}`);
      }
      if (resolveEditorialEndpoint(edge.target, resolver) !== edge.target && edge.target === entry.protein_id) {
        errors.push(`Retained entity remapped unexpectedly: ${entry.protein_id}`);
      }
    }
  }

  return {
    errors,
    deprecatedEndpoints,
    orphanReferences,
    duplicates,
    retainedVerified: !errors.some((error) => error.includes("Retained entity")),
  };
}

export function createProteinEditorialRefinementContext(root) {
  const resolver = createProteinMigrationResolver(root);
  return { resolver };
}
