/**
 * AQ-03B — Taxonomy / Botanical Classification Verifier.
 *
 * Rule 1 (catalogs are authoritative) applies with extra force here: the
 * squash-family finding this phase was built to "fix" turned out to be
 * exactly-as-governed (docs/VEGETABLE_GOVERNANCE.md names the group
 * "Root Vegetables & Squash" and says so directly). That failure mode —
 * flagging a documented culinary-grouping decision as if it were a
 * botanical-taxonomy error — is exactly what this verifier is built not
 * to repeat: candidate mismatches are reported as candidates requiring
 * editorial confirmation, never asserted as confirmed defects, unless
 * they violate an actual structural invariant (a dangling reference).
 */

import { readJson } from "../food-publication/utils.js";

const CATALOG_SPECS = [
  ["protein", "data/protein-food-catalog.json", "protein_foods", "groups", "categories"],
  ["cheese", "data/cheese-catalog.json", "cheeses", "groups", "categories"],
  ["fruit", "data/fruit-catalog.json", "fruits", "groups", "categories"],
  ["vegetable", "data/vegetable-catalog.json", "vegetables", "groups", "categories"],
  ["grain-starch", "data/grain-starch-catalog.json", "grain_starches", "groups", "categories"],
  ["legume", "data/legume-catalog.json", "legumes", "groups", "categories"],
  ["nut-seed", "data/nut-seed-catalog.json", "nut_seeds", "groups", "categories"],
  ["herb-spice", "data/herb-spice-catalog.json", "herb_spices", "groups", "categories"],
  ["sweet-flavor", "data/sweet-flavor-catalog.json", "sweet_flavors", "groups", "categories"],
  ["sauce-condiment", "data/sauce-condiment-catalog.json", "sauce_condiments", "groups", "categories"],
  ["fungi", "data/fungi-catalog.json", "fungi", "groups", "categories"],
];

/** Structural invariants — a violation here is a genuine defect regardless of any culinary judgment call. */
export function verifyStructuralIntegrity(root) {
  const violations = [];
  let totalEntities = 0;

  for (const [domainId, relPath, leafKey, groupKey, catKey] of CATALOG_SPECS) {
    const catalog = readJson(`${root}/${relPath}`);
    const leaves = catalog[leafKey] ?? [];
    const groups = catalog[groupKey] ?? [];
    const categories = catalog[catKey] ?? [];
    const groupSlugs = new Set(groups.map((g) => g.slug));
    const categorySlugs = new Set(categories.map((c) => c.slug));

    totalEntities += leaves.length;

    for (const leaf of leaves) {
      if (leaf.parent_group && !groupSlugs.has(leaf.parent_group)) {
        violations.push({ type: "dangling_parent_group", domain: domainId, entity: leaf.id, missing: leaf.parent_group });
      }
    }
    for (const group of groups) {
      if (group.parent_category && !categorySlugs.has(group.parent_category)) {
        violations.push({ type: "dangling_parent_category", domain: domainId, group: group.slug, missing: group.parent_category });
      }
    }
  }

  return { totalEntities, violationCount: violations.length, violations, structurallyClean: violations.length === 0 };
}

/**
 * A bounded heuristic scan: entities whose `plant_part`-equivalent field
 * name suggests a different botanical category than their group name.
 * This is intentionally advisory-only — every candidate must be checked
 * against domain governance before being treated as a finding, per the
 * squash lesson. Returned as candidates, not violations.
 */
export function scanClassificationCandidates(root) {
  const PART_VS_GROUP_HINTS = [
    { part: "root", groupHint: /leaf|leafy|herb/i },
    { part: "leaf", groupHint: /root|tuber/i },
    { part: "seed", groupHint: /leaf|fresh-herb/i },
  ];

  const candidates = [];
  for (const [domainId, relPath, leafKey] of CATALOG_SPECS) {
    const catalog = readJson(`${root}/${relPath}`);
    const leaves = catalog[leafKey] ?? [];
    for (const leaf of leaves) {
      const part = (leaf.plant_part ?? "").toLowerCase();
      if (!part) continue;
      for (const hint of PART_VS_GROUP_HINTS) {
        if (part.includes(hint.part) && hint.groupHint.test(leaf.parent_group ?? "")) {
          candidates.push({ domain: domainId, entity: leaf.id, plant_part: leaf.plant_part, parent_group: leaf.parent_group });
        }
      }
    }
  }
  return { candidateCount: candidates.length, candidates, note: "Advisory only — requires governance/editorial confirmation before being treated as a finding." };
}

export function runTaxonomyVerification(root) {
  const structural = verifyStructuralIntegrity(root);
  const candidates = scanClassificationCandidates(root);
  return { structural, candidates };
}
