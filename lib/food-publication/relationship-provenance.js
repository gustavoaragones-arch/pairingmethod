/**
 * AQ-02B3 — Relationship Provenance Verifier.
 *
 * Rule 2: no published relationship may appear without provenance. Every
 * rendered relationship must trace to a runtime/editorial/wine edge file —
 * publication must never invent one.
 *
 * This independently re-derives provenance rather than trusting the
 * `derived_from` field already stamped onto each projection ref: it loads
 * every domain's own runtime relationship files (structural, editorial,
 * pairing) directly and checks that a matching edge actually exists for
 * every relationship the leaf pages render. The pipeline's own
 * certify:<domain>-publication step already does an equivalent check
 * during generation (and blocks the build if it fails) — this tool makes
 * that guarantee explicit, independently reportable, and re-runnable on
 * demand rather than implicit inside a build gate.
 */

import fs from "fs";
import { getDomainConfig, listPublishedDomainIds } from "../food-domain-config.js";
import { readJson } from "./utils.js";
import {
  loadProteinMigrationPublicationContext,
  foodEndpointIdsForLeaf,
} from "../publication/proteinMigrationPublication.js";

// "pairing" is protein's domain-specific label for what every other domain calls
// "editorial" on its wine-relationship edges — same canonical runtime source, different
// vocabulary. Both are accepted; the inconsistency itself is reported separately.
const CANONICAL_SOURCES = new Set(["editorial", "structural", "wine", "pairing"]);

/** Runtime relationship files come in two shapes across domains: a top-level `edges`
 * array (protein's structural/editorial/wine files) or a consolidated bootstrap file
 * with `relationships.edges` (every other domain's first file in the list). */
function extractEdges(data) {
  if (Array.isArray(data?.edges)) return data.edges;
  if (Array.isArray(data?.relationships?.edges)) return data.relationships.edges;
  return [];
}

function loadEdgeIndex(domain) {
  const bySourceRelTarget = new Set();
  for (const relPath of domain.paths.relationships) {
    if (!fs.existsSync(relPath)) continue;
    for (const e of extractEdges(readJson(relPath))) {
      bySourceRelTarget.add(`${e.source}\t${e.relationship}\t${e.target}`);
    }
  }
  return bySourceRelTarget;
}

/** Symmetric relationships (similar_to, same_family, ...) can legitimately be authored from either endpoint. */
function isTraceable(edgeIndex, sourceId, relationship, targetId) {
  return (
    edgeIndex.has(`${sourceId}\t${relationship}\t${targetId}`) ||
    edgeIndex.has(`${targetId}\t${relationship}\t${sourceId}`)
  );
}

export function verifyDomainProvenance(domain) {
  const edgeIndex = loadEdgeIndex(domain);
  const { projections } = readJson(domain.paths.projections.leaf);

  // Protein has deprecated entities whose editorial/wine edges are authored against
  // their canonical cross-domain id, not their legacy protein id — the same
  // migration-aware resolution projections.js itself uses during certification.
  const migration = domain.id === "protein" ? loadProteinMigrationPublicationContext(domain.root) : null;

  const violations = [];
  const evidenceSamples = [];
  let totalChecked = 0;

  for (const leaf of projections) {
    const sourceIds = migration ? foodEndpointIdsForLeaf(leaf.identity.id, migration.resolver) : [leaf.identity.id];
    const buckets = { ...leaf.editorial_context, ...leaf.wine_context };
    for (const [bucket, refs] of Object.entries(buckets)) {
      for (const ref of refs) {
        totalChecked += 1;
        const traced = sourceIds.some((sourceId) => isTraceable(edgeIndex, sourceId, ref.relationship, ref.target));
        const canonicalSource = CANONICAL_SOURCES.has(ref.derived_from);
        if (!traced || !canonicalSource) {
          violations.push({
            domain: domain.id,
            entity: leaf.identity.id,
            slug: leaf.identity.slug,
            bucket,
            relationship: ref.relationship,
            target: ref.target,
            derived_from: ref.derived_from ?? null,
            traced_to_runtime_edge: traced,
          });
        } else if (evidenceSamples.length < 3) {
          evidenceSamples.push({
            entity: leaf.identity.id,
            relationship: ref.relationship,
            target: ref.target,
            derived_from: ref.derived_from,
          });
        }
      }
    }
  }

  return { domain: domain.id, totalChecked, violationCount: violations.length, violations, evidenceSamples };
}

const WINE_BUCKET_KINDS = {
  primary_wine_styles: "style",
  alternative_wine_styles: "style",
  classic_wine_pairings: "style",
  contrasting_wine_pairings: "style",
  regional_wine_pairings: "style",
  wines_to_avoid: "style",
  wine_descriptors: "descriptor",
  descriptors: "descriptor",
  wine_techniques: "technique",
  techniques: "technique",
};

function loadWineEntityIndex(root) {
  const styles = new Set(readJson(`${root}/data/wine-style-catalog.json`).styles.map((s) => s.slug));
  const techniques = new Set(
    readJson(`${root}/data/winemaking-technique-catalog.json`).techniques.map((t) => t.slug)
  );
  const descriptors = new Set(Object.keys(readJson(`${root}/data/wine-taxonomy.json`).nodes));
  return { style: styles, technique: techniques, descriptor: descriptors };
}

/** Distinct from provenance: does the relationship's *target* correspond to a real wine-side entity at all? */
export function verifyTargetEntitiesExist(root) {
  const wineIndex = loadWineEntityIndex(root);
  const unknownTargets = [];
  let checked = 0;

  for (const id of listPublishedDomainIds()) {
    const domain = getDomainConfig(id, root);
    const { projections } = readJson(domain.paths.projections.leaf);
    for (const leaf of projections) {
      for (const [bucket, refs] of Object.entries(leaf.wine_context)) {
        const kind = WINE_BUCKET_KINDS[bucket];
        if (!kind) continue;
        for (const ref of refs) {
          checked += 1;
          if (!wineIndex[kind].has(ref.target)) {
            unknownTargets.push({ domain: id, entity: leaf.identity.id, bucket, kind, target: ref.target });
          }
        }
      }
    }
  }
  return { checked, unknownTargets, allTargetsKnown: unknownTargets.length === 0 };
}

export function runRelationshipProvenanceStage(root) {
  const results = listPublishedDomainIds().map((id) => verifyDomainProvenance(getDomainConfig(id, root)));
  const totalChecked = results.reduce((sum, r) => sum + r.totalChecked, 0);
  const totalViolations = results.reduce((sum, r) => sum + r.violationCount, 0);
  const targetExistence = verifyTargetEntitiesExist(root);
  return {
    results,
    totalChecked,
    totalViolations,
    allProvenanced: totalViolations === 0,
    targetExistence,
  };
}
