/**
 * AQ-03C — Vocabulary + Canonical Identity Verifier.
 *
 * Vocabulary: checks catalog values against governance-documented frozen
 * enums, read directly rather than assumed (the vegetable domain uses
 * `culinary_role`/`flavor_intensity` instead of the suite-wide
 * `usage_intensity` vocabulary other domains share — confirmed from
 * docs/VEGETABLE_GOVERNANCE.md before being treated as a gap, not after).
 *
 * Canonical identity: verifies one-concept-to-one-canonical-entity across
 * the whole suite — global ID uniqueness, and a bounded alias-collision
 * scan (an entity's alias/common_name exactly matching another entity's
 * own canonical display name), which would suggest accidental concept
 * fragmentation. Reported as candidates for editorial review, consistent
 * with this phase's discipline of not asserting culinary judgment calls
 * as confirmed defects.
 */

import { readJson } from "../food-publication/utils.js";

const CATALOG_SPECS = [
  ["protein", "data/protein-food-catalog.json", "protein_foods"],
  ["cheese", "data/cheese-catalog.json", "cheeses"],
  ["fruit", "data/fruit-catalog.json", "fruits"],
  ["vegetable", "data/vegetable-catalog.json", "vegetables"],
  ["grain-starch", "data/grain-starch-catalog.json", "grain_starches"],
  ["legume", "data/legume-catalog.json", "legumes"],
  ["nut-seed", "data/nut-seed-catalog.json", "nut_seeds"],
  ["herb-spice", "data/herb-spice-catalog.json", "herb_spices"],
  ["sweet-flavor", "data/sweet-flavor-catalog.json", "sweet_flavors"],
  ["sauce-condiment", "data/sauce-condiment-catalog.json", "sauce_condiments"],
  ["fungi", "data/fungi-catalog.json", "fungi"],
];

const ALLOWED_USAGE_INTENSITY = new Set(["primary", "accent", "luxury"]);
// Domains confirmed (by direct governance read) to use the shared usage_intensity vocabulary.
const USAGE_INTENSITY_DOMAINS = new Set([
  "fruit", "grain-starch", "legume", "nut-seed", "herb-spice", "sweet-flavor", "sauce-condiment", "fungi",
]);

export function verifyVocabulary(root) {
  const findings = [];
  let totalChecked = 0;

  for (const domainId of USAGE_INTENSITY_DOMAINS) {
    const [, relPath, leafKey] = CATALOG_SPECS.find(([id]) => id === domainId);
    const catalog = readJson(`${root}/${relPath}`);
    for (const entity of catalog[leafKey] ?? []) {
      totalChecked += 1;
      if (!ALLOWED_USAGE_INTENSITY.has(entity.usage_intensity)) {
        findings.push({ type: "invalid_usage_intensity", domain: domainId, entity: entity.id, value: entity.usage_intensity ?? null });
      }
    }
  }

  return { totalChecked, findingCount: findings.length, findings, allConformant: findings.length === 0 };
}

export function verifyCanonicalIdentity(root) {
  const allIds = new Map(); // id -> [domain, slug]
  const allEntities = [];
  const duplicateIds = [];

  for (const [domainId, relPath, leafKey] of CATALOG_SPECS) {
    const catalog = readJson(`${root}/${relPath}`);
    for (const entity of catalog[leafKey] ?? []) {
      if (allIds.has(entity.id)) {
        duplicateIds.push({ id: entity.id, firstSeenIn: allIds.get(entity.id), duplicateIn: domainId });
      } else {
        allIds.set(entity.id, domainId);
      }
      allEntities.push({ domain: domainId, id: entity.id, displayName: entity.display_name ?? entity.name, aliases: entity.aliases ?? [], commonNames: entity.common_names ?? [] });
    }
  }

  // Bounded alias-collision scan: does entity A's alias/common_name exactly match
  // entity B's own canonical display name (case-insensitive), across different entities?
  const displayNameIndex = new Map();
  for (const e of allEntities) {
    if (e.displayName) displayNameIndex.set(e.displayName.toLowerCase(), e);
  }

  const aliasCollisions = [];
  for (const e of allEntities) {
    for (const alias of [...e.aliases, ...e.commonNames]) {
      const match = displayNameIndex.get(String(alias).toLowerCase());
      if (match && match.id !== e.id) {
        aliasCollisions.push({ entity: e.id, alias, collidesWithCanonicalEntity: match.id });
      }
    }
  }

  return {
    totalEntities: allEntities.length,
    duplicateIdCount: duplicateIds.length,
    duplicateIds,
    aliasCollisionCount: aliasCollisions.length,
    aliasCollisions,
    note: "Alias collisions are candidates for editorial review (do these represent one concept that should be merged, or two legitimately distinct entities that happen to share a common name?) — not asserted as defects.",
    canonicallyClean: duplicateIds.length === 0,
  };
}

export function runVocabularyAndCanonicalIdentityStage(root) {
  return {
    vocabulary: verifyVocabulary(root),
    canonicalIdentity: verifyCanonicalIdentity(root),
  };
}
