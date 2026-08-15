# AQ-05 — Search Representation Governance

**Phase:** AQ-05 — Google Search Quality & Rich Results Certification
**Adopted:** 2026-08-15
**Status:** **SEARCH-001 in effect**
**Scope:** The search-facing surface of publication — sitemaps, robots.txt, canonical URLs, redirects, navigation, internal linking, and the metadata (title/description) Google and other search systems read. Does not modify, and is not a substitute for, `docs/SEMANTIC_PUBLICATION_GOVERNANCE.md` (SEMANTIC-001), any domain governance document, or the suite-wide catalog rules in `FOOD_ONTOLOGY_SUITE_RELEASES.md`.

---

## Why this document exists

AQ-04 established that the *semantic* projection of governed knowledge (JSON-LD) must never alter or invent meaning. AQ-05 asked the adjacent question: does the *search-facing* projection — the parts of publication specifically aimed at how Google and other search systems discover, understand, and surface the site — hold to the same standard?

It largely already did (AQ-05A-D certified crawlability, indexability, structured data, and search quality all clean), but the process surfaced one concrete governance-relevant risk worth codifying against: `scripts/promote-food-release-deploy01.mjs`'s default arguments and the underlying `buildUnifiedSitemapIndex` in `lib/food-publication/deploy.js` are not aware of the `published: true/false` flag that gates a domain's visibility everywhere else in the publication stack (navigation, search index, the AQ-02B2 sitemap registry). Run with its own defaults, it would silently reintroduce the unpublished cheese domain into the live `sitemap.xml` — a search-facing artifact asserting something the rest of the platform deliberately does not assert (see `reports/aq-04-summary.md`'s "out-of-band finding" for the incident that surfaced this). That is exactly the shape of error SEARCH-001 exists to prevent: a search-facing artifact drifting out of sync with what the platform actually publishes.

## SEARCH-001 — Search Representation Rule

> Search representations are projections of governed publication. Search-facing artifacts (sitemaps, canonicals, structured data, navigation, internal linking, and metadata) must faithfully represent the published knowledge platform. They must improve discoverability and understanding without altering or inventing knowledge. Where search-specific optimizations would conflict with governed meaning, governed meaning takes precedence.

**What this requires in practice**, drawn directly from how AQ-05 applied it:

1. **A search artifact's scope must match the platform's actual publication scope.** `published: true/false` is the single source of truth for what's discoverable (established in AQ-02B1). Any script that generates a search-facing artifact — sitemap, redirect list, navigation entry — must derive its domain list from that flag (via `listPublishedDomainIds()`), not from a hardcoded or manually-passed list that can drift out of sync with it. `scripts/promote-food-release-deploy01.mjs`'s default arguments are flagged as not yet compliant with this rule; fixing it is out of AQ-05's scope (a DEPLOY-01-era code change, not a search-representation-governance document) but is now a documented, named violation a future ticket can act on.
2. **Never optimize for a Google feature that isn't documented and current.** AQ-05C's FAQPage and SearchAction findings are the concrete precedent: both would have been "best practice" by outdated SEO folklore, and both are actually either SERP-inert (FAQ, as of 2026-05-07) or entirely nonexistent (SearchAction, as of November 2024) in real, current Google Search. Before adding any search-facing markup or optimization, verify it against Google Search Central's current documentation — not a cached assumption from a prior audit, not general SEO convention.
3. **Search-facing metadata must trace to governed content, the same discipline SEMANTIC-001 requires for JSON-LD.** AQ-04B's fix (using the authored `seo_description` catalog field instead of a generic template for both the `<meta>` tag and every JSON-LD `description` property) is the working example: one governed field, one authored value, feeding every search-facing surface identically — not three independently-drifting descriptions.
4. **Where search convenience would require inventing or reinterpreting knowledge, don't.** AQ-05D's internal-competition analysis on AQ-03's 8 unresolved canonical-identity variety-pairs is the concrete case: even though consolidating "clementine" into "mandarin" might read as tidier for search, no such consolidation was made or recommended, because the catalog itself has not resolved that question. A search-facing decision does not get to resolve a catalog-governance question by default.

## Standing verification

`scripts/verify-google-crawlability.mjs`, `scripts/verify-google-indexability.mjs`, and `scripts/verify-google-rich-results.mjs` (in `lib/search-audit/`) are reusable, not one-time audit scripts. Re-running them after any future change to sitemaps, redirects, canonicalization, or structured data is the mechanical way to confirm SEARCH-001 still holds — the same pattern `lib/schema-audit/` established for SEMANTIC-001 and `lib/catalog-audit/` established for the catalog-governance rules.

## Relationship to existing governance

SEARCH-001 sits one layer downstream of SEMANTIC-001 (`docs/SEMANTIC_PUBLICATION_GOVERNANCE.md`), which itself sits downstream of the suite's catalog-governance rules. The layering is now: catalog governance (what things mean) → publication (how people read it) → semantic publication (how machines parse it) → search representation (how search systems discover and surface it). Each layer may translate the layer below it into its own vocabulary or format, but none may invent or reinterpret what the layer below it says. If a future search-specific requirement (a new Google feature, a new sitemap convention) would require asserting something the catalog or semantic layer doesn't support, SEARCH-001 is the rule that says: fix it at the layer that's actually wrong, or omit — never patch it over at the search-representation layer alone.
