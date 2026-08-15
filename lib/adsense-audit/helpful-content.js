/**
 * AQ-06B — Helpful Content Review: template-leak detection.
 *
 * Found during manual spot-checking (the "reviewer simulation" AQ-06F also
 * calls for), not by any prior audit's automated check — every previous
 * content-quality pass (AQ-01/AQ-01R/AQ-01R2, AQ-02A's own QA) verified
 * that a narrative `summary` field is PRESENT and RENDERED, not whether
 * its own sentence construction is templated. This module makes that
 * check reproducible and precise: it counts, per domain and per tier, how
 * many entities carry the literal internal-vocabulary word "canonical"
 * (a governance/data-modeling term — see CANON-001 in
 * FOOD_ONTOLOGY_SUITE_RELEASES.md — never appropriate in consumer-facing
 * prose) inside their authored summary/seo_description fields, which is
 * both a leaked-jargon signal and a reliable proxy for the broader
 * fill-in-the-blank template pattern found alongside it (verified by
 * direct reading, not just keyword-matching, in the accompanying report).
 *
 * Read-only. Does not modify any catalog field — that would require
 * editorial judgment about how to rewrite each sentence, explicitly out
 * of scope for a review-only phase, and catalogs are off-limits for AQ-06
 * regardless.
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

function hasLeak(entity, field) {
  const value = entity[field];
  return typeof value === "string" && /\bcanonical\b/i.test(value);
}

export function detectTemplateLeak(root) {
  const perDomain = {};
  const totals = { leaf: { affected: 0, total: 0 }, group: { affected: 0, total: 0 }, category: { affected: 0, total: 0 } };
  const noSupplementaryContentDomains = [];

  for (const [domainId, relPath, leafKey, groupKey, catKey] of CATALOG_SPECS) {
    const catalog = readJson(`${root}/${relPath}`);
    const leaf = catalog[leafKey] ?? [];
    const groups = catalog[groupKey] ?? [];
    const categories = catalog[catKey] ?? [];

    const leafAffected = leaf.filter((e) => hasLeak(e, "summary")).length;
    const groupAffected = groups.filter((e) => hasLeak(e, "summary")).length;
    const catAffected = categories.filter((e) => hasLeak(e, "summary")).length;
    const seoDescAffected = leaf.filter((e) => hasLeak(e, "seo_description")).length;

    const hasBeginnerNotes = leaf.some((e) => e.beginner_notes);
    const hasFaq = leaf.some((e) => e.faq);
    if (!hasBeginnerNotes && !hasFaq && leafAffected > 0) {
      noSupplementaryContentDomains.push(domainId);
    }

    perDomain[domainId] = {
      leaf: { affected: leafAffected, total: leaf.length },
      group: { affected: groupAffected, total: groups.length },
      category: { affected: catAffected, total: categories.length },
      seo_description_affected: seoDescAffected,
      has_supplementary_narrative_fields: hasBeginnerNotes || hasFaq,
    };

    totals.leaf.affected += leafAffected;
    totals.leaf.total += leaf.length;
    totals.group.affected += groupAffected;
    totals.group.total += groups.length;
    totals.category.affected += catAffected;
    totals.category.total += categories.length;
  }

  return {
    totals,
    per_domain: perDomain,
    domains_with_zero_supplementary_content: noSupplementaryContentDomains,
    methodology:
      "Detects the literal internal-vocabulary term \"canonical\" inside summary/seo_description fields, as a precise, reproducible proxy for the broader fill-in-the-blank template pattern confirmed by direct manual reading (see reports/helpful-content-review.json for the qualitative analysis this quantitative check supports).",
  };
}
