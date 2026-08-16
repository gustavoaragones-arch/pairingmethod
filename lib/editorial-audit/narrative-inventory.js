/**
 * AQ-07A — Editorial Narrative Inventory.
 *
 * Documents every authored narrative field, where it renders, and whether
 * it reaches machine-readable surfaces (meta description, JSON-LD) — the
 * ground truth AQ-07's later phases (governance-language purge, rewrite,
 * grammar audit) all build on. Read-only.
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

const CANONICAL_LEAK_PATTERN = /\bcanonical\b/i;

function fieldCoverage(entities, field) {
  return entities.filter((e) => {
    const v = e[field];
    if (Array.isArray(v)) return v.length > 0;
    return typeof v === "string" && v.trim().length > 0;
  }).length;
}

function leakCoverage(entities, field) {
  return entities.filter((e) => typeof e[field] === "string" && CANONICAL_LEAK_PATTERN.test(e[field])).length;
}

export function buildNarrativeInventory(root) {
  const perDomain = {};
  const fieldTotals = {
    summary: { leaf: 0, group: 0, category: 0, leaf_total: 0, group_total: 0, category_total: 0 },
    seo_description: { leaf: 0, leaf_total: 0 },
    beginner_notes: { leaf: 0, leaf_total: 0 },
    faq: { leaf: 0, leaf_total: 0 },
    origin_context: { leaf: 0, leaf_total: 0 },
    introduction: { group: 0, category: 0, group_total: 0, category_total: 0 },
  };
  const leakTotals = { leaf: 0, leaf_total: 0, group: 0, group_total: 0, category: 0, category_total: 0 };

  for (const [domainId, relPath, leafKey, groupKey, catKey] of CATALOG_SPECS) {
    const catalog = readJson(`${root}/${relPath}`);
    const leaf = catalog[leafKey] ?? [];
    const groups = catalog[groupKey] ?? [];
    const categories = catalog[catKey] ?? [];

    perDomain[domainId] = {
      leaf_total: leaf.length,
      group_total: groups.length,
      category_total: categories.length,
      summary: { leaf: fieldCoverage(leaf, "summary"), group: fieldCoverage(groups, "summary"), category: fieldCoverage(categories, "summary") },
      seo_description: { leaf: fieldCoverage(leaf, "seo_description") },
      beginner_notes: { leaf: fieldCoverage(leaf, "beginner_notes") },
      faq: { leaf: fieldCoverage(leaf, "faq") },
      origin_context: { leaf: fieldCoverage(leaf, "origin_context") },
      introduction: { group: fieldCoverage(groups, "introduction"), category: fieldCoverage(categories, "introduction") },
      governance_language_leak: {
        leaf_summary: leakCoverage(leaf, "summary"),
        leaf_seo_description: leakCoverage(leaf, "seo_description"),
        group_summary: leakCoverage(groups, "summary"),
        category_summary: leakCoverage(categories, "summary"),
      },
    };

    fieldTotals.summary.leaf += perDomain[domainId].summary.leaf;
    fieldTotals.summary.leaf_total += leaf.length;
    fieldTotals.summary.group += perDomain[domainId].summary.group;
    fieldTotals.summary.group_total += groups.length;
    fieldTotals.summary.category += perDomain[domainId].summary.category;
    fieldTotals.summary.category_total += categories.length;
    fieldTotals.seo_description.leaf += perDomain[domainId].seo_description.leaf;
    fieldTotals.seo_description.leaf_total += leaf.length;
    fieldTotals.beginner_notes.leaf += perDomain[domainId].beginner_notes.leaf;
    fieldTotals.beginner_notes.leaf_total += leaf.length;
    fieldTotals.faq.leaf += perDomain[domainId].faq.leaf;
    fieldTotals.faq.leaf_total += leaf.length;
    fieldTotals.origin_context.leaf += perDomain[domainId].origin_context.leaf;
    fieldTotals.origin_context.leaf_total += leaf.length;
    fieldTotals.introduction.group += perDomain[domainId].introduction.group;
    fieldTotals.introduction.group_total += groups.length;
    fieldTotals.introduction.category += perDomain[domainId].introduction.category;
    fieldTotals.introduction.category_total += categories.length;

    leakTotals.leaf += perDomain[domainId].governance_language_leak.leaf_summary;
    leakTotals.leaf_total += leaf.length;
    leakTotals.group += perDomain[domainId].governance_language_leak.group_summary;
    leakTotals.group_total += groups.length;
    leakTotals.category += perDomain[domainId].governance_language_leak.category_summary;
    leakTotals.category_total += categories.length;
  }

  return {
    phase: "AQ-07A",
    title: "Editorial Narrative Inventory",
    field_registry: {
      summary: {
        tier: "leaf, group, category",
        renderer_destination: "renderEducationalIntroduction() -> 'About This Entry' section, first content block on every page",
        reaches_meta_description: "no directly, but is the fallback source for page.metadata.description when seo_description is absent (never the case today — seo_description is 100% populated everywhere it's expected)",
        reaches_json_ld: "yes, only as the fallback described above",
        visible_in_main_body: true,
      },
      seo_description: {
        tier: "leaf, group, category",
        renderer_destination: "not directly rendered as visible body text anywhere",
        reaches_meta_description: "yes — primary source since AQ-04B (lib/food-publication/pages.js leafMetadata/groupMetadata/categoryMetadata)",
        reaches_json_ld: "yes — WebPage.description, DefinedTerm.description, CollectionPage.description, DefinedTermSet.description (AQ-04B)",
        visible_in_main_body: false,
        note: "This is the field AQ-07F must certify with the most scrutiny — it is the only narrative field that reaches machine-readable/SERP-facing surfaces directly.",
      },
      beginner_notes: {
        tier: "leaf only",
        renderer_destination: "renderBeginnerGuide() -> 'Beginner Guide' section",
        reaches_meta_description: false,
        reaches_json_ld: false,
        visible_in_main_body: true,
        coverage_note: "Populated only for protein and cheese domains — the other 9 domains have no beginner_notes field at all, meaning the leaf-tier narrative for those domains is 'summary' alone (plus faq where present, which is also protein/cheese-only).",
      },
      faq: {
        tier: "leaf only",
        renderer_destination: "renderFAQ() -> 'FAQ' section, de-duplicated against summary",
        reaches_meta_description: false,
        reaches_json_ld: false,
        visible_in_main_body: true,
        coverage_note: "Same protein/cheese-only coverage as beginner_notes.",
      },
      origin_context: {
        tier: "leaf only",
        renderer_destination: "renderRegionalContext() -> 'Regional Context' section, omitted when absent",
        reaches_meta_description: false,
        reaches_json_ld: false,
        visible_in_main_body: true,
        coverage_note: "Populated for vegetable (40/74) and 1 fruit entity only — absent from all 4 domains this initiative is scoped to (legume, nut-seed, sweet-flavor, sauce-condiment).",
      },
      introduction: {
        tier: "group, category",
        renderer_destination: "renderEducationalIntroduction() -> appended as a second paragraph after summary, when present and distinct from it",
        reaches_meta_description: false,
        reaches_json_ld: false,
        visible_in_main_body: true,
      },
      wine_pairing_explanation_rationale: {
        tier: "leaf",
        status: "capability exists, never populated by any current catalog field",
        renderer_destination: "renderWinePairingExplanation()'s opts.explanation parameter",
        reaches_meta_description: false,
        reaches_json_ld: false,
        visible_in_main_body: "would be, if populated",
        note: "No catalog field currently feeds this — every leaf page's 'Wine Pairing Explanation' section renders as a bare, unexplained link list. Deliberately not fed by `summary` (see code comment in lib/taxonomy-render.js, avoiding the AQ-01 duplicate-paragraph pattern). This is a real, distinct gap from the governance-language-leak finding, out of AQ-07's stated scope (which is corrective rewriting of existing leaked/templated fields, not adding a new narrative field) — noted here for completeness per the ticket's inventory instruction, not actioned in this initiative.",
      },
      common_culinary_uses_explanation: {
        tier: "leaf",
        status: "capability exists, never populated by any current catalog field",
        renderer_destination: "renderCommonCulinaryUses()",
        note: "Same status as wine_pairing_explanation_rationale above — bare link list only, no per-entity explanatory field exists.",
      },
    },
    field_totals: fieldTotals,
    governance_language_leak_totals: leakTotals,
    per_domain: perDomain,
    scope_confirmation: {
      description: "Confirms AQ-06B's counts exactly, as the starting baseline for AQ-07's remediation work.",
      leaf_affected: `${leakTotals.leaf} / ${leakTotals.leaf_total}`,
      group_affected: `${leakTotals.group} / ${leakTotals.group_total}`,
      category_affected: `${leakTotals.category} / ${leakTotals.category_total}`,
    },
  };
}
