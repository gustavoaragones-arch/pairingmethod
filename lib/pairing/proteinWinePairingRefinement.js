/**
 * FOOD-14E — Protein wine pairing refinement against migration map + resolver.
 * Remaps deprecated Protein food sources to canonical cross-domain IDs only.
 */

import { createProteinMigrationResolver } from "../runtime/proteinMigrationResolver.js";
import {
  buildValidEndpointSets,
  edgeKey,
  isValidFoodEndpoint,
  resolveEditorialEndpoint as resolvePairingFoodEndpoint,
} from "../editorial/proteinEditorialRefinement.js";

export const PAIRING_RELATIONSHIP_TYPES = [
  "pairs_with_style",
  "also_pairs_with_style",
  "pairs_with_descriptor",
  "pairs_with_technique",
];

export const CONFIDENCE_LEVELS = new Set(["high", "medium"]);

export { edgeKey, resolvePairingFoodEndpoint };

export function resolvePairingEndpoint(id, resolver) {
  if (!id || typeof id !== "string") return id;
  if (!id.startsWith("food.")) return id;
  return resolver.resolveProteinId(id);
}

export function classifyPairingEdge(edge, resolver, idMap) {
  const sets = buildValidEndpointSets(resolver, idMap);
  const sourceResolved = resolvePairingEndpoint(edge.source, resolver);
  const targetResolved = resolvePairingEndpoint(edge.target, resolver);

  const sourceDeprecated =
    edge.source.startsWith("food.protein.") && resolver.isDeprecatedProtein(edge.source);
  const targetDeprecated =
    edge.target.startsWith("food.protein.") && resolver.isDeprecatedProtein(edge.target);

  let classification = "unchanged";
  if (sourceDeprecated || targetDeprecated) {
    classification = "deprecated";
  } else if (sourceResolved !== edge.source || targetResolved !== edge.target) {
    classification = "remap_required";
  }

  const sourceOrphan =
    edge.source.startsWith("food.") &&
    !isValidFoodEndpoint(sourceResolved, sets, resolver) &&
    !sourceDeprecated;
  const targetOrphan =
    edge.target.startsWith("food.") &&
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

export function buildPairingInventory(edges, resolver, idMap) {
  const entries = edges.map((edge) => classifyPairingEdge(edge, resolver, idMap));
  const remappedPreview = remapPairingEdges(edges, resolver);
  const { collapsed, duplicatesBeforeCollapse, duplicatesRemoved } = collapsePairingEdges(remappedPreview);

  const previewKeyCounts = remappedPreview.reduce((acc, edge) => {
    const key = edgeKey(edge);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  for (const entry of entries) {
    const key = edgeKey({
      source: entry.source_resolved,
      relationship: entry.relationship,
      target: entry.target_resolved,
    });
    if ((previewKeyCounts[key] ?? 0) > 1) {
      entry.classification =
        entry.classification === "unchanged" ? "duplicate_after_remap" : entry.classification;
    }
  }

  const counts = {
    canonical: 0,
    remap_required: 0,
    deprecated: 0,
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
      counts.deprecated += 1;
      counts.remap_required += 1;
      continue;
    }
    if (entry.source_resolved !== entry.source || entry.target_resolved !== entry.target) {
      counts.remap_required += 1;
      continue;
    }
    counts.canonical += 1;
  }

  return {
    entries,
    counts,
    remapped_edge_count: remappedPreview.length,
    collapsed_edge_count: collapsed.length,
    duplicates_before_collapse: duplicatesBeforeCollapse,
    duplicates_removed: duplicatesRemoved,
  };
}

export function remapPairingEdge(edge, resolver) {
  return {
    ...edge,
    source: resolvePairingEndpoint(edge.source, resolver),
    target: resolvePairingEndpoint(edge.target, resolver),
  };
}

export function remapPairingEdges(edges, resolver) {
  return edges.map((edge) => remapPairingEdge(edge, resolver));
}

export function collapsePairingEdges(edges) {
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

export function refineProteinWinePairingRelationships({
  pairing,
  resolver,
  idMap,
  catalogVersion,
}) {
  const inventoryBefore = buildPairingInventory(pairing.edges, resolver, idMap);
  const remapped = remapPairingEdges(pairing.edges, resolver);
  const { collapsed, duplicatesBeforeCollapse, duplicatesRemoved } = collapsePairingEdges(remapped);

  const usedTypes = PAIRING_RELATIONSHIP_TYPES.filter((type) =>
    collapsed.some((edge) => edge.relationship === type)
  );

  const typeCounts = Object.fromEntries(PAIRING_RELATIONSHIP_TYPES.map((type) => [type, 0]));
  for (const edge of collapsed) {
    typeCounts[edge.relationship] = (typeCounts[edge.relationship] ?? 0) + 1;
  }

  const foodsLinked = new Set(collapsed.map((edge) => edge.source));
  const stylesLinked = new Set(
    collapsed.filter((edge) => edge.relationship.endsWith("_style")).map((edge) => edge.target)
  );

  return {
    meta: {
      phase: "FOOD-14E",
      version: pairing.meta?.version ?? "1.0",
      catalog_version: catalogVersion ?? pairing.meta?.catalog_version ?? null,
      layer: "pairing",
      relationship_types: usedTypes,
      edge_count: collapsed.length,
      migration_map: "data/protein-migration-map.json",
      resolver: "lib/runtime/proteinMigrationResolver.js",
      inputs: [
        "data/protein-migration-map.json",
        "data/runtime/protein-food-wine-relationships.json",
        "data/runtime/protein-food-id-map.json",
        "lib/runtime/proteinMigrationResolver.js",
      ],
      refinement: {
        edges_before: pairing.edges.length,
        edges_after: collapsed.length,
        remapped_edges: inventoryBefore.counts.remap_required ?? 0,
        deprecated_endpoints_before: inventoryBefore.counts.deprecated ?? 0,
        duplicates_before_collapse: duplicatesBeforeCollapse,
        duplicates_removed: duplicatesRemoved,
      },
    },
    edges: collapsed,
    stats: {
      foods_linked: foodsLinked.size,
      wine_styles_linked: stylesLinked.size,
      descriptor_links: collapsed.filter((edge) => edge.relationship === "pairs_with_descriptor").length,
      technique_links: collapsed.filter((edge) => edge.relationship === "pairs_with_technique").length,
      pairing_edges: collapsed.length,
      relationship_type_counts: typeCounts,
      remapped_edges: pairing.edges.filter((edge, index) => {
        const mapped = remapped[index];
        return mapped.source !== edge.source || mapped.target !== edge.target;
      }).length,
      duplicates_before_collapse: duplicatesBeforeCollapse,
      duplicates_removed: duplicatesRemoved,
    },
    inventoryBefore,
  };
}

export function validateRefinedPairing({
  output,
  resolver,
  idMap,
  structural,
  editorial,
  wine,
}) {
  const errors = [];
  const sets = buildValidEndpointSets(resolver, idMap);
  const seen = new Set();
  const forbidden = new Set([
    ...(structural?.edges ?? []).map(edgeKey),
    ...(editorial?.edges ?? []).map(edgeKey),
  ]);

  let deprecatedEndpoints = 0;
  let orphanReferences = 0;
  let duplicates = 0;

  for (const edge of output.edges) {
    const key = edgeKey(edge);
    if (seen.has(key)) {
      duplicates += 1;
      errors.push(`Duplicate pairing edge: ${key}`);
    }
    seen.add(key);

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
      errors.push(`Invalid or orphan food source: ${edge.source}`);
    }

    if (edge.target.startsWith("food.") && !isValidFoodEndpoint(edge.target, sets, resolver)) {
      orphanReferences += 1;
      errors.push(`Invalid or orphan food target: ${edge.target}`);
    }

    if (!edge.evidence?.trim()) {
      errors.push(`Missing evidence: ${key}`);
    }
    if (!CONFIDENCE_LEVELS.has(edge.confidence)) {
      errors.push(`Invalid confidence: ${key}`);
    }
    if (edge.derived_from !== "pairing") {
      errors.push(`Invalid derived_from: ${key}`);
    }
    if (wine && !validateWineTarget(edge.relationship, edge.target, wine)) {
      errors.push(`Invalid wine target: ${edge.target}`);
    }
    if (forbidden.has(key)) {
      errors.push(`Conflicts with prior layer: ${key}`);
    }
    if (!PAIRING_RELATIONSHIP_TYPES.includes(edge.relationship)) {
      errors.push(`Unknown relationship: ${edge.relationship}`);
    }
  }

  for (const entry of resolver.map.retained) {
    for (const edge of output.edges) {
      if (edge.source === entry.protein_id && resolvePairingEndpoint(edge.source, resolver) !== edge.source) {
        errors.push(`Retained entity remapped unexpectedly: ${entry.protein_id}`);
      }
      if (edge.target === entry.protein_id && resolvePairingEndpoint(edge.target, resolver) !== edge.target) {
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

export function validateWineTarget(relationship, target, wine) {
  if (relationship === "pairs_with_style" || relationship === "also_pairs_with_style") {
    return wine.styleIds.has(target);
  }
  if (relationship === "pairs_with_descriptor") {
    return wine.descriptorIds.has(target);
  }
  if (relationship === "pairs_with_technique") {
    return wine.techniqueIds.has(target);
  }
  return false;
}

export function createProteinWinePairingRefinementContext(root) {
  const resolver = createProteinMigrationResolver(root);
  return { resolver };
}
