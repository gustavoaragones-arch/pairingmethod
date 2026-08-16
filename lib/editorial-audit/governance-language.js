/**
 * AQ-07B — Governance-Language Purge Audit.
 *
 * Detects internal ontology/runtime/governance vocabulary leaking into
 * consumer-facing narrative fields. Per the ticket's own instruction, this
 * does not blindly prohibit every regex hit — each term has a documented
 * classification rule distinguishing forbidden internal usage from a
 * hypothetical legitimate consumer usage, and every hit is reported with
 * surrounding context so a forbidden/legitimate call is auditable, not a
 * silent regex verdict.
 *
 * Read-only. Detection only — this module does not rewrite anything;
 * AQ-07C consumes its output.
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

const NARRATIVE_FIELDS = ["summary", "seo_description", "beginner_notes", "origin_context", "introduction"];

// Mirrors lib/food-publication/narrative.js's NARRATIVE_FIELDS exactly — a
// field only actually reaches a consumer if it's in this tier's extraction
// list. "introduction" is not extracted for leaf entities, so a raw
// catalog entity that happens to carry an "introduction" key at leaf tier
// is dead data (confirmed: 163 leaf entities across sweet-flavor and
// sauce-condiment carry a byte-identical, unrendered duplicate of
// `summary` under this key) — real, but a catalog-hygiene matter, not a
// consumer-facing prose leak, and out of AQ-07's stated scope.
const RENDERED_FIELDS_BY_TIER = {
  leaf: new Set(["summary", "beginner_notes", "faq", "seo_description", "origin_context"]),
  group: new Set(["summary", "introduction", "beginner_notes", "faq", "seo_description"]),
  category: new Set(["summary", "introduction", "seo_description"]),
};

/**
 * Each term's classification rule. `alwaysForbidden: true` means this term
 * has no plausible legitimate consumer-facing use in food/wine prose — any
 * match is a leak. `alwaysForbidden: false` terms require the surrounding
 * context to be checked against `legitimateIf` before classifying; matches
 * are reported either way, with a `requiresReview` flag instead of an
 * automatic verdict.
 */
const TERMS = [
  { term: "canonical", pattern: /\bcanonical\b/i, alwaysForbidden: true, reason: "Internal data-modeling term (CANON-001) — no natural culinary meaning." },
  { term: "canonical entity", pattern: /\bcanonical entity\b/i, alwaysForbidden: true, reason: "Internal ontology-modeling phrase." },
  { term: "ontology", pattern: /\bontology\b/i, alwaysForbidden: true, reason: "Internal architecture term; a reader has no use for this word." },
  { term: "ontology entity", pattern: /\bontology entity\b/i, alwaysForbidden: true, reason: "Internal architecture phrase." },
  {
    term: "runtime",
    pattern: /\bruntime\b/i,
    alwaysForbidden: false,
    reason: "Internal publication-layer term in this codebase's usage, but theoretically could appear in an unrelated general-English sense.",
    legitimateIf: "Never observed in this catalog's actual usage — flagged for review, not auto-classified, per the ticket's instruction against blind prohibition.",
  },
  { term: "editorial layer", pattern: /\beditorial layer\b/i, alwaysForbidden: true, reason: "Internal architecture-layer name." },
  {
    term: "migration",
    pattern: /\bmigration\b/i,
    alwaysForbidden: false,
    reason: "Internal catalog/ID-migration term in this codebase's usage, but 'migration' has a genuine, unrelated culinary/biological meaning (e.g. migratory fish species) that would be entirely legitimate.",
    legitimateIf: "Context describes an animal's seasonal movement (e.g. salmon migration), not a data/ID migration.",
  },
  { term: "migration map", pattern: /\bmigration map\b/i, alwaysForbidden: true, reason: "Specifically the internal data.protein-migration-map.json artifact name — no legitimate consumer-facing sense." },
  { term: "deprecated ID", pattern: /\bdeprecated id\b/i, alwaysForbidden: true, reason: "Internal identifier-lifecycle term." },
  { term: "namespace", pattern: /\bnamespace\b/i, alwaysForbidden: true, reason: "Internal identifier-structure term." },
  { term: "relationship layer", pattern: /\brelationship layer\b/i, alwaysForbidden: true, reason: "Internal architecture-layer name." },
  { term: "SSOT", pattern: /\bSSOT\b/i, alwaysForbidden: true, reason: "Internal acronym, never consumer-appropriate." },
  { term: "source of truth", pattern: /\bsource of truth\b/i, alwaysForbidden: true, reason: "Internal data-architecture phrase; no natural culinary equivalent." },
  { term: "runtime-active", pattern: /\bruntime-active\b/i, alwaysForbidden: true, reason: "Internal publication-status term." },
  { term: "publication layer", pattern: /\bpublication layer\b/i, alwaysForbidden: true, reason: "Internal architecture-layer name." },
];

function scanEntity(entity, domainId, tier) {
  const hits = [];
  for (const field of NARRATIVE_FIELDS) {
    const value = entity[field];
    if (typeof value !== "string" || !value) continue;
    for (const termDef of TERMS) {
      if (termDef.pattern.test(value)) {
        const match = value.match(termDef.pattern);
        const idx = match.index;
        const context = value.slice(Math.max(0, idx - 40), idx + match[0].length + 40);
        const renders = RENDERED_FIELDS_BY_TIER[tier]?.has(field) ?? false;
        hits.push({
          domain: domainId,
          tier,
          entity_id: entity.id,
          field,
          term: termDef.term,
          context: `...${context}...`,
          classification: termDef.alwaysForbidden ? "forbidden_internal_usage" : "requires_review",
          reason: termDef.reason,
          renders_to_consumer: renders,
        });
      }
    }
  }
  return hits;
}

export function auditGovernanceLanguage(root) {
  const allHits = [];
  const perDomain = {};

  for (const [domainId, relPath, leafKey, groupKey, catKey] of CATALOG_SPECS) {
    const catalog = readJson(`${root}/${relPath}`);
    const domainHits = [];
    for (const [tier, key] of [["leaf", leafKey], ["group", groupKey], ["category", catKey]]) {
      for (const entity of catalog[key] ?? []) {
        domainHits.push(...scanEntity(entity, domainId, tier));
      }
    }
    if (domainHits.length) perDomain[domainId] = domainHits;
    allHits.push(...domainHits);
  }

  const rendered = allHits.filter((h) => h.renders_to_consumer);
  const deadField = allHits.filter((h) => !h.renders_to_consumer);
  const forbiddenRendered = rendered.filter((h) => h.classification === "forbidden_internal_usage");
  const requiresReview = allHits.filter((h) => h.classification === "requires_review");

  const termTally = {};
  for (const hit of rendered) {
    termTally[hit.term] = (termTally[hit.term] ?? 0) + 1;
  }

  const affectedEntityIds = new Set(rendered.map((h) => `${h.domain}:${h.tier}:${h.entity_id}`));
  const deadFieldEntityIds = new Set(deadField.map((h) => `${h.domain}:${h.tier}:${h.entity_id}`));

  return {
    phase: "AQ-07B",
    title: "Governance-Language Purge Audit",
    terms_checked: TERMS.map((t) => ({ term: t.term, always_forbidden: t.alwaysForbidden, reason: t.reason })),
    total_hits_all_fields: allHits.length,
    consumer_facing_rendered_hits: rendered.length,
    dead_field_unrendered_hits: deadField.length,
    dead_field_note:
      "163 hits (sweet-flavor + sauce-condiment leaf entities' stray `introduction` key, byte-identical to `summary`) never reach any consumer surface — `introduction` is not in leaf tier's rendered-field list (lib/food-publication/narrative.js NARRATIVE_FIELDS.leaf), confirmed by cross-referencing the render pipeline, not assumed. Real catalog-hygiene duplication, but out of AQ-07's consumer-facing-prose scope — not counted in the remediation target below.",
    forbidden_internal_usage_count: forbiddenRendered.length,
    requires_review_count: requiresReview.length,
    distinct_entities_affected: affectedEntityIds.size,
    distinct_entities_with_dead_field_duplication: deadFieldEntityIds.size,
    term_tally_consumer_facing: termTally,
    per_domain_hit_counts: Object.fromEntries(
      Object.entries(perDomain).map(([k, v]) => [k, v.filter((h) => h.renders_to_consumer).length])
    ),
    all_hits: allHits,
    requires_review_hits: requiresReview,
    target: "zero unjustified internal governance terminology in consumer-facing (rendered) prose",
    current_status: forbiddenRendered.length === 0 ? "PASS" : "FAIL — remediation required in AQ-07C",
  };
}
