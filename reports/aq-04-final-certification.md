# AQ-04 — Structured Data & Semantic Publishing — Final Certification

**Date:** 2026-08-15
**Scope:** Semantic publication layer only (`lib/food-publication/schema.js`, `lib/protein-food-schema.js`, `lib/food-publication/pages.js`). No catalog, runtime, editorial, wine, or existing-governance file was modified.

## Overall certification: PASS

## JSON-LD coverage

| Tier | Pages | With JSON-LD | Coverage |
|---|---|---|---|
| Leaf | 1,166 | 1,166 | 100% |
| Group | 73 | 73 | 100% |
| Category | 13 | 13 | 100% |

Source: `reports/jsonld-coverage.json`.

## Schema accuracy

| Check | Result |
|---|---|
| Structural validation (required properties, breadcrumb integrity, absolute URLs, context/type presence) | 4,718/4,718 objects, 0 issues |
| Ontology mapping (identifier, hierarchy, cross-reference fidelity) | 6,066/6,066 checks, 0 issues |
| Global `@id` uniqueness | 4,460/4,460 unique |
| Taxon regression guard (no derived-product domain re-emits Taxon) | 0/204 cheese pages, clean |

Source: `reports/schema-validation.json`, `reports/semantic-integrity.json`.

## Property traceability

Every property emitted by the leaf/group/category schema builders traces to a named catalog or projection field — documented per-property in `reports/schema-inventory.json`'s `property_origins` map, built by reading the builder source directly rather than inferred from output. No property is populated from a literal invented at serialization time except the small set of static, intentional stubs (`WebSite`, per-domain `DefinedTermSet` ontology labels) that describe the site itself, not an entity.

## Semantic integrity

Two corrections applied (`reports/semantic-integrity.json`):

1. **Cheese `Taxon` misrepresentation** — 204 pages asserted the page's subject IS the milk-source species. Replaced with an accurate `PropertyValue`; Taxon omitted entirely for cheese, unchanged for the other 10 domains (962 pages).
2. **`description` property ignored authored content** — 1,252 pages (100% of leaf/group/category) used a generic template despite a fully-authored `seo_description` field existing for every one of them. Now uses the authored field.

Zero confirmed defects remain. One category of relationship (editorial/wine-pairing, 4,229 instances) is deliberately not mapped to JSON-LD — see Remaining Intentional Limitations.

## AI-consumption assessment

Assessed for Google Search/Rich Results, Google Knowledge Graph, and LLM/AI-Overview browsing consumers (`reports/schema-consumer-analysis.json`). Headline findings:

- The Taxon fix removes a specific entity-conflation risk: a knowledge-graph builder reading the pre-fix JSON-LD could have concluded a cheese page's subject was the milk-source species itself, contradicting the page's own declared identity. This risk was invisible to human readers (who never see raw JSON-LD) but real for machine consumers.
- The description fix gives every consumer class — search snippet, knowledge graph, LLM browsing/citation — one consistent, authored anchor sentence per entity instead of a templated one, closing a gap that also affected the human-visible `<meta>` tag (AQ-01R Priority 3/4, unresolved since that audit).
- No rich-result types are claimed that this content doesn't qualify for (no Recipe/Product/FAQPage markup) — correct omission, not a gap.

## Before / after comparison

| Dimension | Before AQ-04 | After AQ-04 |
|---|---|---|
| Cheese leaf pages asserting `@type: Taxon` | 204/204 (100%, all inaccurate) | 0/204 |
| Cheese leaf pages with accurate milk-source attribute | 0/204 | 204/204 (`PropertyValue`) |
| Leaf/group/category pages with authored (non-template) description | 0/1,252 | 1,252/1,252 |
| `<meta name="description">` reflects authored content | No (generic template, all domains) | Yes (all domains) |
| Ontology-mapping issues (identifier/hierarchy/cross-reference) | Not previously measured | 0/6,066 |
| Structural validation issues | Not previously measured | 0/4,718 |
| Relationship data exposed in JSON-LD | 0 (undocumented gap) | 0 (documented, deliberate omission with rejected-alternatives rationale) |

The last row is unchanged in outcome but changed in kind: before AQ-04, the absence of relationship schema was simply unexamined; after, it is a recorded decision with three specific alternatives considered and rejected, reviewable and revisable by a future ticket.

## Remaining intentional limitations

1. **No relationship-type schema** (`same_family`, `commonly_served_with`, `pairs_with_style`, etc.). Schema.org has no property correctly scoped to `DefinedTerm` for these relationship types without misrepresenting them. Revisiting this would require either a schema.org extension-vocabulary decision or re-typing entities as `Product` — both materially larger scope changes than this ticket. See `reports/semantic-integrity.json` AQ-04D section.
2. **8 canonical-identity candidates from AQ-03** (e.g. mandarin/clementine/tangerine/satsuma) remain unresolved at the catalog layer and therefore surface identically in the publication layer — publication faithfully projects the catalog (Rule 1) and does not attempt to resolve a catalog-layer ambiguity on its own authority.
3. **External validator spot-checks** (validator.schema.org, Google Rich Results Test) were not run programmatically — both are JavaScript SPAs with no documented public API (confirmed directly, not assumed). The internal structural validator is the certification evidence; a manual spot-check with a handful of representative URLs is recommended as a follow-up, not claimed as done here.
4. **`promote-food-release-deploy01.mjs` sitemap leak (found, avoided, not fixed at source).** Its default domain list includes the unpublished `cheese` domain, and the underlying `buildUnifiedSitemapIndex` in `lib/food-publication/deploy.js` doesn't check `published: true` — running it as documented silently reintroduces cheese into the live sitemap.xml, undoing AQ-02B2's fix. Caught by diff before this certification's commit; corrected by using the registry-driven `scripts/generate-sitemap-index.mjs` instead. The underlying script is unfixed (out of scope: DEPLOY-01/AQ-02B-era code, not semantic publication) — a live, silently-triggerable regression risk for a future deploy.
5. **Wine-education tier and static pages** (~2,700+ JSON-LD blocks) were out of scope for AQ-04, consistent with the domain boundary AQ-02B and AQ-03 held to. Not audited, not claimed clean.

## Governance

`docs/SEMANTIC_PUBLICATION_GOVERNANCE.md` — **SEMANTIC-001** adopted: machine-readable representations are projections of governed knowledge; semantic publication may translate ontology into external vocabularies but must never alter, invent, or reinterpret ontology meaning; where no accurate mapping exists, omission is preferred over approximation. A new, standalone file — no existing governance document was modified.

## Together with AQ-02 and AQ-03

- **AQ-02:** the knowledge is findable and its provenance is verified.
- **AQ-03:** the knowledge itself is correct.
- **AQ-04:** machines interpret it correctly.

Three independent guarantees, each verified by evidence gathered specifically to test it, not assumed from the others holding.
