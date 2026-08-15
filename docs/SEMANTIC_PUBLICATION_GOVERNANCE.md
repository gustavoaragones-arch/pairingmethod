# AQ-04 — Semantic Publication Governance

**Phase:** AQ-04 — Structured Data & Semantic Publishing
**Adopted:** 2026-08-15
**Status:** **SEMANTIC-001 in effect**
**Scope:** The semantic publication layer only (`lib/food-publication/schema.js`, `lib/protein-food-schema.js`, and every JSON-LD block they emit). Does not modify, and is not a substitute for, any domain governance document (`CHEESE_GOVERNANCE.md`, `VEGETABLE_GOVERNANCE.md`, `PROTEIN_REFINEMENT_GOVERNANCE.md`, etc.) or the suite-wide rules in `FOOD_ONTOLOGY_SUITE_RELEASES.md` (CANON-001, BOTAN-001, PROC-001, and their domain-specific extensions).

---

## Why this document exists

AQ-03 (Knowledge Integrity Certification) established that the catalog is authoritative on scientific identity and taxonomy. AQ-04 (Structured Data & Semantic Publishing) asked the adjacent question: is the *machine-readable projection* of that catalog equally trustworthy?

It was not, in one specific, concrete way: every cheese leaf page emitted `{"@type": "Taxon", "name": "Bos taurus", ...}` — a direct claim that the page's subject IS the species *Bos taurus* — because the schema builder read `scientific_name` the same way for all 11 domains, without checking that cheese's own governance (`CHEESE_GOVERNANCE.md` §5) defines that field differently there. The catalog was never wrong; the projection of it was. AQ-04B corrected this (see `reports/semantic-integrity.json`).

That failure mode — a generic, domain-agnostic serialization rule producing an inaccurate claim for one domain's exception — is exactly the shape of error SEMANTIC-001 exists to prevent going forward, the same way CANON-001/BOTAN-001/PROC-001 exist to prevent their own recurring failure shapes at the catalog layer.

## SEMANTIC-001 — Semantic Projection Rule

> Machine-readable representations are projections of governed knowledge. Semantic publication may translate ontology into external vocabularies (such as Schema.org), but it must never alter, invent, or reinterpret ontology meaning. Where no accurate semantic mapping exists, omission is preferred over approximation.

**What this requires in practice**, drawn directly from how AQ-04 applied it:

1. **Every emitted property must trace to a governed field** — not to a plausible-sounding default. Before mapping a catalog field to a schema.org property, check whether every domain that field appears in means the same thing by it (the cheese `scientific_name` case: 10 domains, one meaning; 1 domain, a different one).
2. **Where a domain has a documented exception, the serializer must know about it.** A schema builder that is "domain-agnostic" for simplicity is only safe if the field it's serializing is genuinely domain-agnostic in meaning. `lib/food-publication/schema.js`'s `DERIVED_PRODUCT_DOMAINS` set (currently `{cheese}`) is the concrete mechanism — new domains with their own field-meaning exceptions extend that set, they don't get a parallel special case.
3. **When schema.org has no property that accurately fits, omit rather than force a nearby-but-wrong one.** AQ-04D reviewed this directly for the site's editorial/wine-pairing relationship graph: `Product.isRelatedTo` doesn't apply (these entities are typed `DefinedTerm`, not `Product`), and `mentions`/`about` would flatten several distinct, typed relationships into one undifferentiated property. Both were rejected in favor of omission. See `reports/semantic-integrity.json` (AQ-04D section) for the full reasoning trail — that reasoning, not just the conclusion, is what future decisions of this kind should match.
4. **Verify the mapping, don't assume it.** AQ-04C's ontology-mapping verifier checks that every `DefinedTerm`/`DefinedTermSet` identifier equals its catalog canonical id, every `isPartOf` hierarchy reference matches the entity's actual catalog parent, and every `hasPart` cross-reference matches the referenced entity's own current name — mechanically, across the full 1,166-entity suite, not spot-checked. A future change to the publication layer should be checked the same way before being trusted.

## Standing verification

`scripts/verify-ontology-mapping.mjs`, `scripts/verify-jsonld-validation.mjs`, and `scripts/verify-jsonld-coverage.mjs` (in `lib/schema-audit/`) are not one-time audit scripts — they are reusable, and `scripts/verify-jsonld-validation.mjs` specifically carries a standing regression guard (`checkTaxonRegression`) asserting that no derived-product domain ever re-emits `Taxon`. Re-running them after any future change to the semantic publication layer is the mechanical way to confirm SEMANTIC-001 still holds, the same way `verify-taxonomy.mjs` and `verify-scientific-identity.mjs` (AQ-03) confirm the catalog layer still holds its own invariants.

## Relationship to existing governance

SEMANTIC-001 sits one layer downstream of the suite's catalog-governance rules (CANON-001, BOTAN-001, PROC-001, and their domain extensions, all in `FOOD_ONTOLOGY_SUITE_RELEASES.md`) and one layer downstream of domain governance documents (`CHEESE_GOVERNANCE.md` §5, `VEGETABLE_GOVERNANCE.md`, etc.). It does not restate or supersede any of them — it constrains how the layer that reads them may translate what they say into `https://schema.org` vocabulary. If a future domain's governance document defines a field with unusual semantics (the way cheese's `scientific_name` does), SEMANTIC-001 is the rule that requires the publication layer to know about it before serializing it, not the rule that decides what the field means.
