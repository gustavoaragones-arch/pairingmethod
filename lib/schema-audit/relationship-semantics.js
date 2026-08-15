/**
 * AQ-04D — Relationship Semantics Review.
 *
 * Every editorial/wine-pairing relationship rendered on a page already has
 * verified provenance (AQ-02B3: 0/4,140 unsupported). The question here is
 * narrower: should any of that relationship data also be expressed as
 * JSON-LD, for machine consumers rather than human readers?
 *
 * This module inventories what relationship data exists in the page
 * projections (read-only) and records why it is deliberately NOT mapped
 * into JSON-LD, per Rule 2 (never overload vocabulary) and Rule 4 (omit
 * rather than misrepresent) — schema.org has no property, correctly scoped
 * to DefinedTerm, that represents "same taxonomic family," "commonly served
 * with," or "pairs with wine style/descriptor" without either using the
 * wrong domain/range (Product-scoped isRelatedTo/isSimilarTo on a
 * DefinedTerm-typed entity) or flattening a specific, typed relationship
 * into a generic one (mentions, about) that loses the relationship type.
 */

import { getDomainConfig, listDomainIds } from "../food-domain-config.js";
import { readJson } from "../food-publication/utils.js";

const HIERARCHICAL_RELATIONSHIPS_STATUS = {
  description:
    "Categorical/hierarchical relationships (leaf-to-group, group-to-category, breadcrumb ancestry) ARE already expressed in JSON-LD, via isPartOf/hasPart/breadcrumb — and verified accurate in AQ-04C (0 issues across 1,166 isPartOf checks and 1,188 hasPart cross-reference checks). These are the one relationship type schema.org models precisely for DefinedTerm/DefinedTermSet, and this layer already uses it correctly.",
};

const CONSIDERED_AND_REJECTED = [
  {
    property: "Product.isRelatedTo / Product.isSimilarTo",
    verdict: "rejected",
    reason:
      "Correctly scoped for 'same family as' / 'substitute for' relationships, but domain/range is Product, not DefinedTerm. This layer models food entities as DefinedTerm (an ontological concept) deliberately, not Product (a commercial item) — re-typing every entity to unlock this property is a much larger, separate semantic decision than a relationship-exposure fix, out of scope here.",
  },
  {
    property: "CreativeWork.mentions (on the WebPage)",
    verdict: "rejected",
    reason:
      "Technically valid (the page's editorial content does discuss the related entity), but flattens 4 distinct, precisely-typed relationships (same_family, commonly_served_with, similar_cheeses, substitutions, plus the wine-side pairs_with_style/pairs_with_descriptor/pairs_with_technique) into one generic, undifferentiated property. A machine consumer reading `mentions` cannot recover which relationship type it was — that loses information Rule 2 (never overload vocabulary) exists to protect.",
  },
  {
    property: "sameAs",
    verdict: "rejected — would misrepresent",
    reason:
      "Explicitly reserved for identity equivalence (this entity IS that entity, e.g. a Wikidata link). 'Cheddar and aged-cheddar are in the same family' or 'bearnaise is commonly served with coconut' are not identity claims. Using sameAs here would be a direct Rule 4 violation, not a gray area.",
  },
];

function countRelationships(pages) {
  const counts = {};
  for (const page of pages) {
    for (const [bucket, refs] of Object.entries(page.related_foods ?? {})) {
      if (Array.isArray(refs) && refs.length) {
        counts[bucket] = (counts[bucket] ?? 0) + refs.length;
      }
    }
    for (const [bucket, refs] of Object.entries(page.wine_pairing_summary ?? {})) {
      if (Array.isArray(refs) && refs.length) {
        const key = `wine.${bucket}`;
        counts[key] = (counts[key] ?? 0) + refs.length;
      }
    }
  }
  return counts;
}

export function reviewRelationshipSemantics(root) {
  const domainIds = listDomainIds();
  const perDomain = {};
  const totals = {};

  for (const domainId of domainIds) {
    const domain = getDomainConfig(domainId);
    const leafPages = readJson(domain.paths.pages.leaf).pages;
    const counts = countRelationships(leafPages);
    perDomain[domainId] = counts;
    for (const [bucket, n] of Object.entries(counts)) {
      totals[bucket] = (totals[bucket] ?? 0) + n;
    }
  }

  const totalRelationshipInstances = Object.values(totals).reduce((a, b) => a + b, 0);

  return {
    phase: "AQ-04D",
    title: "Relationship Semantics Review",
    finding:
      `${totalRelationshipInstances} editorial/wine-pairing relationship instances exist in the published page projections (all independently provenance-verified in AQ-02B3), rendered for human readers, and currently expressed in zero JSON-LD properties.`,
    hierarchical_relationships: HIERARCHICAL_RELATIONSHIPS_STATUS,
    non_hierarchical_relationships: {
      status: "deliberately not mapped to JSON-LD",
      relationship_instance_totals: totals,
      total_instances: totalRelationshipInstances,
      per_domain: perDomain,
      considered_and_rejected: CONSIDERED_AND_REJECTED,
      decision:
        "Per Rule 4 (omit rather than misrepresent), no new JSON-LD property is added for these relationships in AQ-04. The verified relationship graph remains fully accessible to human readers via the rendered 'Related' sections. A future ticket could revisit this specifically as a Product-typing or schema.org extension-vocabulary decision — that is a materially bigger scope change than a relationship-exposure fix and should be evaluated on its own, not folded into a semantic-integrity certification.",
    },
  };
}
