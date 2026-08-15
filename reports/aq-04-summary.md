# AQ-04 — Structured Data & Semantic Publishing — Summary

**Date:** 2026-08-15
**Mission:** Make PairingMethod's structured data as trustworthy as its ontology — a faithful machine-readable representation of governed knowledge that never invents semantics.

## What happened, in order

1. **AQ-04A — Schema Inventory.** Enumerated every JSON-LD block emitted across the food-ontology publication layer: 4,922 objects across 1,166 leaf, 73 group, and 13 category pages in all 11 domains, plus 10 hub pages and the `/ingredients/` directory. Documented, for every property, the exact catalog/projection field it originates from — not inferred, read directly from `lib/protein-food-schema.js` and `lib/food-publication/schema.js`. Two findings surfaced (`reports/schema-inventory.json`, FIND-01, FIND-02).
2. **AQ-04B — Semantic Corrections.** Both findings fixed:
   - **The cheese `Taxon` issue** (the specific investigation the ticket named): all 204 cheese leaf pages asserted `{"@type": "Taxon", "name": "Bos taurus", "url": ".../cheeses/abondance/"}`, directly claiming the page's subject IS the species *Bos taurus* — contradicting the same page's own `DefinedTerm` identity. Replaced with `{"@type": "PropertyValue", "name": "Milk source species", "value": "Bos taurus"}`, which states the real fact without asserting subject identity. Taxon is omitted entirely for cheese; unchanged and correct for the other 10 domains.
   - **The `description` property** ignored a 100%-coverage authored `seo_description` catalog field (1,166 leaf + 73 group + 13 category entities, every one of them, across all 11 domains) in favor of a generic name/group/category template. Now uses the authored field. This also closes AQ-01R's long-carried Priority 3/4 finding about the `<meta name="description">` tag — the same root cause fed both.
   - All 11 domains' pages/schema/HTML regenerated and recertified PASS; root-level promoted copies re-synced. Zero catalog/runtime/editorial/wine/governance files touched.
3. **AQ-04C — Ontology Mapping.** Built a dedicated verifier confirming every `DefinedTerm`/`DefinedTermSet` identifier matches its catalog canonical id, every `isPartOf` hierarchy reference matches the entity's actual parent, every `hasPart` cross-reference matches the referenced entity's current name, and every `@id` is globally unique. 6,066 checks, 0 issues.
4. **AQ-04D — Relationship Semantics.** Found 4,229 provenance-verified editorial/wine-pairing relationship instances exist in the page projections but are expressed in zero JSON-LD properties. Investigated three candidate schema.org properties (`Product.isRelatedTo`/`isSimilarTo`, `mentions`, `sameAs`) and rejected all three — wrong domain/range, vocabulary overload, or outright misrepresentation, respectively. Decision: omit, per Rule 4. The hierarchical/categorical relationships (which schema.org does model precisely for `DefinedTerm`) are already exposed correctly, verified in AQ-04C.
5. **AQ-04E — AI Consumption.** Assessed readiness across Google Search/Rich Results, Google Knowledge Graph, and LLM/AI-Overview browsing consumers. The Taxon fix specifically closes an entity-conflation risk a knowledge graph builder — not a human reader — could have hit. The description fix gives every consumer class one consistent, authored anchor sentence instead of a templated one. One residual, out-of-scope ambiguity noted: AQ-03's 8 unresolved canonical-identity candidates (e.g. mandarin/clementine) necessarily surface in the publication layer too, since publication faithfully projects the catalog.
6. **AQ-04F — Validation.** Built a deterministic internal JSON-LD validator (required properties per type, breadcrumb sequence integrity, absolute-URL well-formedness, canonical-host consistency, and a standing regression guard against Taxon ever reappearing on cheese). 4,718 objects checked, 0 issues. External validator.schema.org / Google Rich Results Test have no stable public API (confirmed directly) — not scripted against an undocumented one; recommended as a manual spot-check instead of a fabricated automated result.

## Deliverables

| File | Content |
|---|---|
| `reports/schema-inventory.json` | Every type/property/origin, 2 findings |
| `reports/semantic-integrity.json` | AQ-04B corrections + AQ-04C mapping results + AQ-04D relationship decision |
| `reports/jsonld-coverage.json` | Coverage stats confirming both fixes landed at 100%, domain-correct |
| `reports/schema-validation.json` | Structural validation, 0 issues, standing regression guard |
| `reports/schema-consumer-analysis.json` | Per-consumer-class readiness assessment |
| `reports/aq-04-final-certification.md` | Final certification with before/after comparison |
| `docs/SEMANTIC_PUBLICATION_GOVERNANCE.md` | SEMANTIC-001, permanent |

## An out-of-band finding, corrected in passing

Regenerating and re-promoting all 11 domains surfaced a latent bug unrelated to JSON-LD: `scripts/promote-food-release-deploy01.mjs`'s default domain list (`["protein", "cheese", "vegetable"]`) and `lib/food-publication/deploy.js`'s `buildUnifiedSitemapIndex` are pre-AQ-02B2 code that does not check `published: true` — running the promote script with `cheese` in its argument list (its own hardcoded default already does this) silently rebuilds `sitemap.xml` to include the unpublished cheese domain, undoing AQ-02B2's registry-driven, published-only sitemap fix. This was caught by diffing `sitemap.xml` before committing (3 new cheese `<loc>` entries appeared), reverted, and correctly regenerated via the AQ-02B2 script (`scripts/generate-sitemap-index.mjs`) instead — 0 cheese entries, only expected `lastmod` timestamp movement. Not fixed at the source (`lib/food-publication/deploy.js` is DEPLOY-01/AQ-02B-era code, out of scope for a semantic-publication phase), but flagged here since it is a real, latent, silently-triggerable regression risk: any future run of the promote script with its own default arguments would reintroduce this leak.

## Regression

Zero catalog, runtime, editorial, wine, or existing-governance files were modified. The only files changed: the semantic publication layer itself (`lib/food-publication/schema.js`, `lib/protein-food-schema.js`, `lib/food-publication/pages.js`), the generated publication artifacts that regenerate from it (`data/pages/*`, `data/schema/*`, `dist/`, and root-promoted HTML), the new `lib/schema-audit/` verifiers, and the new reports/governance addition listed above. Verified via `git status` against every protected path before every milestone commit.

## The bigger point

AQ-02 proved humans read the site correctly. AQ-03 proved the knowledge itself is correct. AQ-04 proves machines interpret it correctly — and, like AQ-03, it found its headline defect not by assuming the architecture was flawed, but by checking a specific, named claim (the cheese Taxon block) against the project's own governance, the same discipline that has now caught real errors five times across three initiatives. SEMANTIC-001 exists so the next domain added to this suite inherits that discipline structurally, rather than needing a sixth catch.
