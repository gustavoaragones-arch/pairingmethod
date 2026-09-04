# LANG-01 — Language Governance

**Phase:** LANG-01 — Spanish Multilingual Architecture & Regional Vocabulary Governance
**Status:** Architecture and governance adopted. Spanish is **registered, not published.**
**Scope:** Establishes the language and Spanish regional-vocabulary architecture. Does not translate content, does not generate `/es/` pages, does not modify the ontology, publication pipeline, sitemap, or pairing engine.
**Registry:** `lib/language-config.js`
**Vocabulary schema:** `data/spanish-vocabulary.json`
**Standing verification:** `scripts/verify-language-governance-lang01.mjs`

This document uses **MUST** / **MUST NOT** / **SHOULD** / **SHOULD NOT** normatively. Where a rule is not yet enforced by code (because nothing implementing it exists yet), that is stated explicitly — this document is not permitted to describe enforcement that doesn't exist as if it does.

---

## 1. Supported Languages

PairingMethod supports exactly two languages:

1. **English (`en`)** — the existing, unprefixed, root-level publication. Unaffected by this phase.
2. **Spanish (`es`)** — registered in `lib/language-config.js`. **Not yet published.**

A future third language MUST be added the same way Spanish was: a new entry in the language registry, its own governance addendum, and its own architecture phase — never a silent code branch.

## 2. English Default Status

English **MUST** remain the default publication. `lib/language-config.js`'s `en` entry MUST have `isDefault: true`, and it MUST be the only entry with that flag. The unprefixed root URL space (`/foods/`, `/wine-with-steak`, etc.) MUST continue to mean English, unconditionally, for as long as English is the default.

## 3. Spanish Publication Status

Spanish MUST be treated as **registered but unpublished** until an explicit future phase sets `published: true` on the `es` entry. While `published` is `false`:

- No `/es/` directory or file MUST exist anywhere in the repository or in generated output.
- No sitemap MUST reference an `/es/` URL or a `sitemap-es.xml` file.
- No canonical, hreflang, or structured-data output MUST reference Spanish.

`scripts/verify-language-governance-lang01.mjs` checks all three of these directly against the filesystem, not just against the registry flag.

## 4. Spanish Regional Vocabulary Profiles

Spanish exposes exactly **five** regional vocabulary profiles, registered under `lib/language-config.js`'s `es.regionalProfiles`:

| id | label | role |
|---|---|---|
| `neutral` | Neutral Spanish | General Spanish fallback vocabulary — the fallback chain's root. |
| `mx` | Mexico | Mexican Spanish vocabulary profile. |
| `es` | Spain | Spain Spanish vocabulary profile. |
| `cl` | Chile | Chilean Spanish vocabulary profile. |
| `ca` | Central America | Central American Spanish vocabulary profile. |

A sixth profile, or the removal of one of these five, **MUST** be a governance decision recorded in an update to this document — never an unreviewed data addition.

## 5. Profile Identifiers — Explicit Disambiguation

`ca` **MUST** be read exclusively as the **Central America** Spanish vocabulary profile. It **MUST NOT** be interpreted as Canada, as an ISO 3166 country code, or as any kind of independent locale. These identifiers exist **only** inside `lib/language-config.js`'s `es.regionalProfiles` namespace; they have no relationship to, and MUST NOT be confused with, ISO country codes, IETF BCP 47 region subtags, or any other external identifier scheme. A regional profile id MUST NOT be reused as a URL segment, a locale tag, or a country-targeting signal anywhere in the codebase.

## 6. Distinction Between Language and Regional Vocabulary

A **language** (`en`, `es`) determines which publication a page belongs to — its own URL namespace, its own canonical identity, its own sitemap entry. A **regional vocabulary profile** (`neutral`, `mx`, `es`, `cl`, `ca`) determines which *preferred term* is used within the single Spanish publication for a given entity. Regional profiles:

- **MUST NOT** have their own URL namespace, canonical URL, sitemap, or publication path.
- **MUST NOT** be treated as independent locales.
- **MUST** remain terminology-selection metadata consumed inside the one `/es/` publication.

`scripts/verify-language-governance-lang01.mjs`'s `V5` check enforces this structurally: a regional profile object in the registry is only permitted to carry `id`, `label`, `description`, and `isFallbackRoot` — any URL-, sitemap-, or canonical-shaped field on a profile is a governance violation.

## 7. Entity Identity Rules

Entity identity **MUST** remain independent of language, region, translation, localized spelling, localized slug, and preferred regional terminology. A language-neutral ontology entity (e.g. `food.fruit.tropical-fruits.avocado`) **MUST** remain exactly one entity regardless of how many Spanish regional terms describe it (`aguacate` in neutral Spanish, `palta` in Chile). A regional vocabulary difference **MUST NOT**, under any circumstance, be used as justification to create a second entity, a second catalog record, or a second canonical id. This rule extends to every ontology entity type: foods, wines, grapes, techniques, descriptors, categories, and groups.

The vocabulary schema (`data/spanish-vocabulary.json`) enforces this at the data-contract level: every entry's `entity_id` field **MUST** reference an id that already exists in an existing `data/*-catalog.json` file. A vocabulary entry is a projection onto an existing id; it is never itself the source of one.

## 8. Preferred-Term Rules

For a given `(entity_id, language, region)` triple, there **MUST** be at most one **preferred term** — the term that SHOULD normally appear in generated Spanish copy for that entity in that regional profile. `preferred` **MUST** be a single string, never a list, never an object.

## 9. Alias Rules

**Aliases** are recognized alternative terms for the same entity in the same regional profile. Aliases exist for recognition, search terminology, vocabulary resolution, entity matching, and future localization/search features. An alias **MUST NOT** be automatically promoted into rendered copy merely because it exists — only the `preferred` term SHOULD appear in generated prose under normal conditions. `aliases` **MUST** be an array (possibly empty); it is a structurally distinct field from `preferred`, never merged with it.

## 10. Fallback Rules

The regional-vocabulary fallback chain **MUST** resolve in this order:

1. **Regional preferred term** — `(entity_id, es, <specific region>)`, if an entry exists.
2. **Neutral Spanish preferred term** — `(entity_id, es, neutral)`, if no regional-specific entry exists.
3. **Approved entity fallback** — the entity's existing, already-governed language-neutral display data (its English `display_name`), if no Spanish entry exists at all.

A regional term **MUST NOT** be invented or synthesized automatically. A regional synonym **MUST NOT** be auto-selected merely because it exists in some external wordlist — every regional preferred term **MUST** be explicitly, individually declared by an editorial decision recorded as a `data/spanish-vocabulary.json` entry. Most entities are expected to carry **zero** regional overrides and resolve entirely through step 2 or step 3 — a regional override MUST exist only where terminology genuinely differs and there is a documented reason to prefer the regional form (the entry's optional `notes` field).

## 11. URL Rules

The Spanish publication's URL namespace **MUST** be `/es/` and nothing else. Country-specific namespaces (`/es-mx/`, `/es-cl/`, `/es-es/`, `/es-gt/`, `/es-cr/`, or any other `/es-XX/` pattern) **MUST NOT** exist anywhere in the repository, in the publication pipeline, or in generated output. `scripts/verify-language-governance-lang01.mjs`'s `V6` check scans the repository tree directly for any such directory.

A localized slug (e.g. a future Spanish route for the `steak` pairing-guide entity, conceptually `/es/vino-con-bistec`) is **publication metadata** attached to an entity for a specific language — it **MUST NOT** redefine, alias, or fork entity identity. No localized slug is created or populated in LANG-01; this section documents the future rule only.

## 12. Canonical Rules

Each published language page **MUST** canonicalize to itself: an English page's canonical URL is its own English URL; a future Spanish page's canonical URL **MUST** be its own `/es/...` URL. A language MUST NOT canonicalize to a different language's URL. This rule is documented for the future; **no canonical output changes in LANG-01** — English canonical generation (`lib/public-url.js`'s `canonicalUrl()`) is untouched.

## 13. Hreflang Rules

A future Spanish page **MUST** support reciprocal `hreflang` annotations: `hreflang="es"` on the Spanish page pointing to itself and to the English equivalent, `hreflang="en"` on the English page pointing to itself and to the Spanish equivalent, and `hreflang="x-default"` designating the default-language (English) version for unmatched user locales. **No hreflang output is implemented or published in LANG-01.** This section is a documented future rule, not a present behavior.

## 14. Sitemap Rules

The future sitemap model **SHOULD** follow the same registry-driven pattern `lib/food-publication/sitemap-registry.js` already established for food domains: a language-specific sitemap output (conceptually `/sitemap-es.xml`), included in the root `/sitemap.xml` index only once Spanish is published, generated deterministically from the language registry's `published` flag — never hand-maintained, never merged additively with stale history. **No Spanish sitemap is generated in LANG-01.** The existing `/sitemap.xml` and every existing per-domain sitemap file **MUST** remain byte-identical in structure (aside from ordinary content-driven `lastmod` changes from unrelated work) — `V13` verifies no `/es/` or `sitemap-es` reference exists in the current sitemap.

## 15. Internal-Link Rules

A future localized internal link **MUST** resolve through this chain: **entity ID → current publication language → localized route**. Internal links **MUST NOT** store regional terminology as URL identity (a URL segment MUST NOT be built from a regional preferred term). The relationship graph that drives internal linking (the existing `data/runtime/*-editorial-relationships.json` and `*-wine-relationships.json` files) **MUST** remain the single, shared graph for both languages — a Spanish publication **MUST NOT** get its own duplicated relationship graph. The Spanish presentation layer, once built, consumes the same graph edges and resolves each edge's target entity to a localized route at render time; it does not fork the graph itself.

## 16. Pairing-Engine Language Neutrality

The pairing engine (`assets/js/pairing-engine.js`, `pairing-data.js`, `engine.js`, `matrix-view.js`) **MUST** continue to operate exclusively on entity IDs, structured attributes, relationship IDs, scoring values, and machine-readable statuses (e.g. `status = "ideal"`). It **MUST NOT** contain Spanish or regional vocabulary, a Spanish-language string literal, a language-selection conditional (`language`/`lang`/`locale` compared against `"es"`), or a regional-profile conditional (`region`/`profile` compared against any of the 5 approved profile ids, or a `switch`/`case` branch on one) anywhere in its source. `scripts/verify-language-governance-lang01.mjs`'s `V11` check scans these exact files for that full pattern set — not a single narrow example. A future localization layer translates presentation text **after** the engine has already produced its language-neutral result — it never reaches into the engine's own logic.

The ontology itself follows the identical principle: an entity's canonical `entity_id` (e.g. `avocado`) **MUST** remain the English-derived, language-neutral identifier permanently — it **MUST NOT** be replaced by, or exist in parallel as, a Spanish-language identifier (`aguacate`) at any layer the engine or catalog touches.

## 17. Structured-Data Localization Rules

A future localized JSON-LD output **MUST** be generated from the same underlying entity/publication data AQ-04 already established (see `docs/SEMANTIC_PUBLICATION_GOVERNANCE.md`, SEMANTIC-001) — only human-readable fields (`name`, `headline`, `description`, breadcrumb labels, FAQ text, and similar) may vary by language. Machine identity (`@id`, canonical entity references, `identifier`) **MUST** remain stable and **MUST NOT** be duplicated per language. **No Spanish JSON-LD is implemented or emitted in LANG-01** — this section documents the future rule only, and SEMANTIC-001's own principle (machine-readable representations are projections of governed knowledge, never a second source of truth) extends unmodified to the future multilingual case.

## 18. No Country-Specific Publication Rule

PairingMethod **MUST NOT** create country-specific Spanish publications, page sets, sitemaps, canonical-URL systems, ontology copies, pairing engines, scoring rules, or content databases. There is one Spanish publication. Regional terminology is a **localization/data concern** resolved inside that single publication via the vocabulary layer (§4–§10) — it is never grounds for forking the publication itself.

## 19. No Automatic Geolocation Rule

The architecture **MUST NOT** implement automatic geolocation, browser-language redirects, runtime language rewriting, or user-IP-based content rewriting. Language and regional-profile selection are explicit, deterministic, and — in whatever future mechanism selects a regional profile for a given render — SHOULD be a declared parameter (e.g. an explicit user or publication setting), never inferred from a request's origin. This is a hard architectural boundary, not a preference: LANG-01 introduces no runtime request-handling code at all, and any future phase that would add IP- or geolocation-based rewriting requires its own explicit governance decision, which this document does not pre-authorize.

## 20. No Duplicate Ontology Rule

The ontology (every `data/*-catalog.json` file, every `data/runtime/*` relationship file) **MUST** remain the single, shared source of truth for both English and Spanish. Spanish **MUST NOT** get a duplicated catalog, a duplicated runtime relationship graph, duplicated scoring logic, or a parallel ontology of any kind. The only Spanish-specific data artifact this architecture permits is the vocabulary layer itself (`data/spanish-vocabulary.json`), which is explicitly a thin projection *onto* the existing ontology, not a copy of it — enforced by §7's entity-identity rule, which `V7` currently certifies at the **schema-contract level** (the declared `entity_id` field contract requires an existing catalog reference). `V7` does not yet certify populated entries against live catalogs, because none exist to check (`entries: []`, by design in this phase) — that cross-reference check is explicitly deferred to the phase that first populates real entries, not silently assumed to already happen.

---

## Relationship to Existing Governance

LANG-01 sits alongside, not beneath or above, the governance chain this repository has already built: catalog governance (CANON-001 and its domain extensions) → publication (AQ-02) → semantic publication (SEMANTIC-001) → search representation (SEARCH-001) → publisher/monetization integrity (PUBLISHER-001). Language is an **orthogonal axis** to that chain, not a new layer inserted into it: every rule above is stated in terms of *how the existing chain extends to a second language*, not as a replacement for any of it. A future Spanish publication is expected to satisfy SEMANTIC-001 and SEARCH-001 in its own right, using the same entities, the same relationship graph, and the same catalog — projected through a language and, where declared, a regional vocabulary profile.
