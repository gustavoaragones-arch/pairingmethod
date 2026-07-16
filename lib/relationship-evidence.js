/**
 * ONTOLOGY-01C.6 — Relationship evidence validation, resolution, and summaries.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "./taxonomy.js";
import { loadGrapeCatalog } from "./taxonomy-grape.js";
import { listWineStyleEntries } from "./taxonomy-wine-style.js";
import { listWineRegionEntries } from "./taxonomy-wine-region.js";
import { listWineServingEntries } from "./taxonomy-wine-serving.js";
import { listWinemakingTechniqueEntries } from "./taxonomy-winemaking-technique.js";
import { CONFIDENCE_LEVELS, REASON_ENTITY_KINDS } from "./relationship-evidence-types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVIDENCE_PATH = path.join(__dirname, "..", "data", "relationship-evidence.json");

let _cache = null;
let _entityIndex = null;

export function loadRelationshipEvidence() {
  if (!_cache) {
    _cache = JSON.parse(fs.readFileSync(EVIDENCE_PATH, "utf8"));
  }
  return _cache;
}

export function relationshipEdgeKey(edge) {
  const source = edge.source ?? edge.source_slug;
  const sourceKind = edge.source_kind;
  const type = edge.type;
  const target = edge.target;
  const targetKind = edge.target_kind;
  return `${sourceKind}:${source}|${type}|${targetKind}:${target}`;
}

function buildEntityIndex(taxonomy) {
  const index = new Map();

  const add = (kind, slug, name) => {
    if (!slug) return;
    index.set(`${kind}:${slug}`, { kind, slug, name: name ?? slug });
  };

  for (const node of Object.values(taxonomy.nodes)) {
    const kind = node.entity_type ?? node.type;
    add(kind === "descriptor" ? "descriptor" : kind, node.slug, node.name);
  }

  for (const g of loadGrapeCatalog().grapes) add("grape_variety", g.slug, g.name);
  for (const s of listWineStyleEntries()) add("wine_style", s.slug, s.name);
  for (const r of listWineRegionEntries()) add("wine_region", r.slug, r.name);
  for (const e of listWineServingEntries()) add("wine_serving", e.slug, e.name);
  for (const t of listWinemakingTechniqueEntries()) add("winemaking_technique", t.slug, t.name);

  for (const style of listWineStyleEntries()) {
    for (const item of style.food_pairings ?? []) {
      if (item.slug) add("pairing", item.slug, item.label ?? item.slug);
    }
  }
  for (const region of listWineRegionEntries()) {
    for (const item of region.food_pairings ?? []) {
      if (typeof item === "object" && item.slug) add("pairing", item.slug, item.label ?? item.slug);
    }
  }

  return index;
}

export function getEntityIndex(taxonomy) {
  if (!_entityIndex) {
    _entityIndex = buildEntityIndex(taxonomy ?? loadTaxonomy());
  }
  return _entityIndex;
}

export function resetEntityIndex() {
  _entityIndex = null;
}

/**
 * @param {unknown} evidence
 */
export function normalizeEvidence(evidence) {
  if (!evidence || typeof evidence !== "object") return null;
  const out = {};
  if (Array.isArray(evidence.reason) && evidence.reason.length) {
    out.reason = evidence.reason.map(normalizeReasonRef).filter(Boolean);
  }
  if (evidence.confidence) out.confidence = String(evidence.confidence).toLowerCase();
  if (evidence.notes && String(evidence.notes).trim()) out.notes = String(evidence.notes).trim();
  return Object.keys(out).length ? out : null;
}

function normalizeReasonRef(ref) {
  if (!ref) return null;
  if (typeof ref === "string") return { kind: null, slug: ref };
  if (typeof ref === "object" && ref.slug) {
    return { kind: ref.kind ?? null, slug: ref.slug, text: ref.text ?? null };
  }
  return null;
}

function inferReasonKind(slug, taxonomy, entityIndex) {
  if (entityIndex.has(`descriptor:${slug}`)) return "descriptor";
  if (entityIndex.has(`wine_style:${slug}`)) return "wine_style";
  if (entityIndex.has(`wine_region:${slug}`)) return "wine_region";
  if (entityIndex.has(`wine_serving:${slug}`)) return "wine_serving";
  if (entityIndex.has(`grape_variety:${slug}`)) return "grape_variety";
  if (taxonomy.nodes[slug]) {
    const node = taxonomy.nodes[slug];
    if (node.entity_type === "descriptor" || node.type === "descriptor") return "descriptor";
    return node.entity_type ?? node.type;
  }
  return null;
}

/**
 * @param {ReturnType<typeof normalizeEvidence>} evidence
 * @param {{ source: string, source_kind: string, target: string, target_kind: string }} edge
 * @param {{ taxonomy?: object }} [options]
 */
export function validateEvidence(evidence, edge, options = {}) {
  const errors = [];
  if (!evidence) return errors;

  const taxonomy = options.taxonomy ?? loadTaxonomy();
  const entityIndex = getEntityIndex(taxonomy);

  if (evidence.confidence && !CONFIDENCE_LEVELS.includes(evidence.confidence)) {
    errors.push(`invalid confidence: ${evidence.confidence}`);
  }

  const seenReasons = new Set();
  for (const ref of evidence.reason ?? []) {
    const slug = ref.slug;
    if (!slug) {
      errors.push("reason entry missing slug");
      continue;
    }
    if (seenReasons.has(slug)) errors.push(`duplicate reason: ${slug}`);
    seenReasons.add(slug);

    if (slug === edge.source || slug === edge.target) {
      errors.push(`self-referential reason: ${slug}`);
    }

    const kind = ref.kind ?? inferReasonKind(slug, taxonomy, entityIndex);
    if (!kind && !ref.text) {
      errors.push(`orphan reason entity: ${slug}`);
      continue;
    }
    if (kind && !REASON_ENTITY_KINDS.includes(kind) && kind !== "descriptor_group") {
      errors.push(`unsupported reason kind: ${kind}`);
    }
    if (kind && !entityIndex.has(`${kind}:${slug}`) && !taxonomy.nodes[slug]) {
      errors.push(`unknown reason entity: ${kind}:${slug}`);
    }
  }

  return errors;
}

/**
 * @param {ReturnType<typeof normalizeEvidence>} evidence
 * @param {{ taxonomy?: object }} [options]
 */
export function resolveReasonEntities(evidence, options = {}) {
  if (!evidence?.reason?.length) return [];
  const taxonomy = options.taxonomy ?? loadTaxonomy();
  const entityIndex = getEntityIndex(taxonomy);

  return evidence.reason.map((ref) => {
    const kind = ref.kind ?? inferReasonKind(ref.slug, taxonomy, entityIndex);
    const indexed = kind ? entityIndex.get(`${kind}:${ref.slug}`) : null;
    const node = taxonomy.nodes[ref.slug];
    return {
      kind: kind ?? "unknown",
      slug: ref.slug,
      name: indexed?.name ?? node?.name ?? ref.slug.replace(/-/g, " "),
      text: ref.text ?? null,
      resolved: Boolean(indexed || node),
    };
  });
}

/**
 * @param {{ type: string, target: string, target_kind: string, evidence?: object }} edge
 */
export function summarizeRelationshipEvidence(edge, options = {}) {
  const evidence = edge.evidence;
  if (!evidence) return null;

  const reasons = resolveReasonEntities(evidence, options);
  const reasonLabels = reasons.map((r) => r.name).join(" → ");
  const confidence = evidence.confidence ?? "unspecified";

  return {
    relationship: edge.type,
    target: edge.target,
    target_kind: edge.target_kind,
    confidence,
    reason_chain: reasonLabels || null,
    reasons,
    notes: evidence.notes ?? null,
    summary: reasonLabels
      ? `${edge.type} → ${edge.target} because ${reasonLabels} (${confidence} confidence)`
      : `${edge.type} → ${edge.target} (${confidence} confidence)`,
  };
}

function evidenceLookupMap() {
  const map = new Map();
  for (const row of loadRelationshipEvidence().annotations ?? []) {
    const key = relationshipEdgeKey(row);
    map.set(key, normalizeEvidence(row.evidence));
  }
  return map;
}

/**
 * Attach optional evidence from SSOT to semantic edges.
 *
 * @param {Array<Record<string, unknown>>} edges
 */
export function applyRelationshipEvidence(edges) {
  const lookup = evidenceLookupMap();
  return edges.map((edge) => {
    const evidence = lookup.get(relationshipEdgeKey(edge));
    if (!evidence) return edge;
    return { ...edge, evidence };
  });
}

/**
 * @param {Array<Record<string, unknown>>} edges
 * @param {{ taxonomy?: object }} [options]
 */
export function validateRelationshipEvidence(edges, options = {}) {
  const errors = [];
  const lookup = evidenceLookupMap();
  const edgeKeys = new Set(edges.filter((e) => !e.inferred).map(relationshipEdgeKey));

  for (const [key, evidence] of lookup) {
    if (!edgeKeys.has(key)) errors.push(`orphan evidence (no matching edge): ${key}`);
    const parts = key.split("|");
    if (parts.length !== 3) {
      errors.push(`invalid evidence key format: ${key}`);
      continue;
    }
    const [sourcePart, type, targetPart] = parts;
    const [sourceKind, source] = sourcePart.split(":");
    const [targetKind, target] = targetPart.split(":");
    const edge = { source, source_kind: sourceKind, type, target, target_kind: targetKind, evidence };
    for (const msg of validateEvidence(evidence, edge, options)) {
      errors.push(`${key} → ${msg}`);
    }
  }

  for (const edge of edges) {
    if (!edge.evidence || edge.inferred) continue;
    for (const msg of validateEvidence(edge.evidence, edge, options)) {
      errors.push(`${relationshipEdgeKey(edge)} → ${msg}`);
    }
  }

  return errors;
}

/**
 * @param {Array<Record<string, unknown>>} edges
 */
export function computeEvidenceStats(edges) {
  const explicit = edges.filter((e) => !e.inferred);
  const withEvidence = explicit.filter((e) => e.evidence);
  const withoutEvidence = explicit.length - withEvidence.length;

  const byConfidence = { high: 0, medium: 0, low: 0, unspecified: 0 };
  const reasonEntityCounts = {};

  for (const edge of withEvidence) {
    const c = edge.evidence?.confidence;
    if (c && byConfidence[c] !== undefined) byConfidence[c] += 1;
    else byConfidence.unspecified += 1;

    for (const ref of edge.evidence?.reason ?? []) {
      const slug = typeof ref === "string" ? ref : ref.slug;
      if (!slug) continue;
      reasonEntityCounts[slug] = (reasonEntityCounts[slug] ?? 0) + 1;
    }
  }

  const cited = Object.entries(reasonEntityCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([slug, count]) => ({ slug, count }));

  return {
    relationships_with_evidence: withEvidence.length,
    relationships_without_evidence: withoutEvidence,
    evidence_coverage_pct:
      explicit.length > 0
        ? Number(((withEvidence.length / explicit.length) * 100).toFixed(2))
        : 0,
    confidence_distribution: byConfidence,
    most_cited_reason_entities: cited.slice(0, 10),
    unique_reason_entities: cited.length,
  };
}

export function findEvidenceAnnotation(sourceKind, source, type, targetKind, target) {
  const key = `${sourceKind}:${source}|${type}|${targetKind}:${target}`;
  return evidenceLookupMap().get(key) ?? null;
}
