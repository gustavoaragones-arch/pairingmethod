/**
 * ONTOLOGY-01C.5 — Canonical relationship type SSOT loader and validators.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "..", "data", "relationship-types.json");

let _cache = null;

export function loadRelationshipTypes() {
  if (!_cache) {
    _cache = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  }
  return _cache;
}

export function listRelationshipTypeIds() {
  return loadRelationshipTypes().types.map((t) => t.id);
}

export function relationshipTypeById(id) {
  return loadRelationshipTypes().types.find((t) => t.id === id) ?? null;
}

export function isValidRelationshipType(id) {
  return Boolean(relationshipTypeById(id));
}

export function getReverseType(id) {
  const def = relationshipTypeById(id);
  return def?.reverse ?? null;
}

export function isSymmetricType(id) {
  const def = relationshipTypeById(id);
  return Boolean(def?.symmetric);
}

/**
 * @param {string} typeId
 * @param {string} sourceKind
 * @param {string} targetKind
 */
export function isAllowedRelationship(typeId, sourceKind, targetKind) {
  const def = relationshipTypeById(typeId);
  if (!def) return false;
  const sources = def.allowed_sources ?? [];
  const targets = def.allowed_targets ?? [];
  return sources.includes(sourceKind) && targets.includes(targetKind);
}

/**
 * @typedef {{ type: string, target: string, target_kind: string, source_field?: string, inferred?: boolean }} TypedEdge
 */

/**
 * @param {{ type: string, target: string, target_kind: string }} edge
 * @param {string} sourceKind
 */
export function validateTypedEdge(edge, sourceKind) {
  const errors = [];
  if (!edge?.type) errors.push("missing relationship type");
  else if (!isValidRelationshipType(edge.type)) errors.push(`unknown relationship type: ${edge.type}`);
  else if (!isAllowedRelationship(edge.type, sourceKind, edge.target_kind)) {
    errors.push(`illegal relationship: ${sourceKind} --${edge.type}--> ${edge.target_kind}`);
  }
  if (!edge?.target) errors.push("missing target");
  if (!edge?.target_kind) errors.push("missing target_kind");
  return errors;
}

/**
 * Build reverse edge for a typed relationship when defined.
 *
 * @param {{ source: string, source_kind: string, type: string, target: string, target_kind: string }} edge
 * @returns {{ source: string, source_kind: string, type: string, target: string, target_kind: string, inferred: true } | null}
 */
export function inferReverseEdge(edge) {
  const reverseType = getReverseType(edge.type);
  if (!reverseType || !isValidRelationshipType(reverseType)) return null;
  if (isSymmetricType(edge.type)) {
    return {
      source: edge.target,
      source_kind: edge.target_kind,
      type: reverseType,
      target: edge.source,
      target_kind: edge.source_kind,
      inferred: true,
    };
  }
  if (!isAllowedRelationship(reverseType, edge.target_kind, edge.source_kind)) return null;
  return {
    source: edge.target,
    source_kind: edge.target_kind,
    type: reverseType,
    target: edge.source,
    target_kind: edge.source_kind,
    inferred: true,
  };
}

/**
 * Deduplicate typed edges by source+type+target.
 *
 * @param {TypedEdge[]} edges
 */
export function dedupeTypedEdges(edges) {
  const seen = new Set();
  const out = [];
  for (const e of edges) {
    const key = `${e.type}|${e.target}|${e.target_kind}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}

/**
 * Validate a batch of semantic edges including reverse and duplicate rules.
 *
 * @param {Array<{ source: string, source_kind: string, type: string, target: string, target_kind: string, inferred?: boolean }>} edges
 */
export function validateSemanticEdges(edges) {
  const errors = [];
  const seen = new Set();
  const explicit = new Set();
  const reverseRequired = new Set(
    loadRelationshipTypes().types.filter((t) => t.requires_reverse).map((t) => t.id)
  );
  const reversePresent = new Set();

  for (const edge of edges) {
    if (edge.inferred) continue;
    const key = `${edge.source_kind}:${edge.source}|${edge.type}|${edge.target_kind}:${edge.target}`;
    if (seen.has(key)) errors.push(`duplicate semantic edge: ${key}`);
    seen.add(key);
    explicit.add(key);

    for (const msg of validateTypedEdge(edge, edge.source_kind)) {
      errors.push(`${edge.source_kind}:${edge.source} → ${msg}`);
    }

    const rev = inferReverseEdge(edge);
    if (rev) {
      const revKey = `${rev.source_kind}:${rev.source}|${rev.type}|${rev.target_kind}:${rev.target}`;
      reversePresent.add(revKey);
      if (explicit.has(revKey)) reversePresent.add(`${edge.source_kind}:${edge.source}|${edge.type}|${edge.target_kind}:${edge.target}`);
    }
  }

  for (const edge of edges) {
    if (edge.inferred) continue;
    if (!reverseRequired.has(edge.type)) continue;
    const rev = inferReverseEdge(edge);
    if (!rev) continue;
    const revKey = `${rev.source_kind}:${rev.source}|${rev.type}|${rev.target_kind}:${rev.target}`;
    const hasReverse =
      explicit.has(revKey) ||
      reversePresent.has(revKey) ||
      edges.some(
        (e) =>
          e.source === rev.source &&
          e.source_kind === rev.source_kind &&
          e.type === rev.type &&
          e.target === rev.target &&
          e.target_kind === rev.target_kind
      );
    if (!hasReverse) {
      errors.push(
        `missing reverse edge for ${edge.source_kind}:${edge.source} --${edge.type}--> ${edge.target_kind}:${edge.target}`
      );
    }
  }

  return errors;
}

/**
 * Detect cycles in hierarchy relationship types.
 *
 * @param {Array<{ source: string, source_kind: string, type: string, target: string, target_kind: string }>} edges
 */
export function detectHierarchyCycles(edges) {
  const hierarchyTypes = new Set(["parent_of", "child_of", "contains", "contained_in"]);
  const parentMap = new Map();

  for (const edge of edges) {
    if (!hierarchyTypes.has(edge.type)) continue;
    const childKey = `${edge.source_kind}:${edge.source}`;
    const parentKey = `${edge.target_kind}:${edge.target}`;
    if (edge.type === "parent_of" || edge.type === "contains") {
      parentMap.set(`${edge.target_kind}:${edge.target}`, `${edge.source_kind}:${edge.source}`);
      continue;
    }
    parentMap.set(childKey, parentKey);
  }

  const cycles = [];
  for (const start of parentMap.keys()) {
    const visited = new Set();
    let current = start;
    while (parentMap.has(current)) {
      if (visited.has(current)) {
        cycles.push(`hierarchy cycle at ${current}`);
        break;
      }
      visited.add(current);
      current = parentMap.get(current);
    }
  }
  return cycles;
}

export function relationshipTypeIndex() {
  return Object.fromEntries(loadRelationshipTypes().types.map((t) => [t.id, t]));
}
