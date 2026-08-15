# AQ-06 — Publisher & Monetization Governance

**Phase:** AQ-06 — Google AdSense Readiness Certification
**Adopted:** 2026-08-15
**Status:** **PUBLISHER-001 in effect**
**Scope:** Publisher-facing and monetization-adjacent representation of the platform — ad placement, publisher policy compliance, and any future advertising/monetization implementation. Does not modify, and is not a substitute for, `docs/SEARCH_REPRESENTATION_GOVERNANCE.md` (SEARCH-001), `docs/SEMANTIC_PUBLICATION_GOVERNANCE.md` (SEMANTIC-001), any domain governance document, or the suite-wide catalog rules in `FOOD_ONTOLOGY_SUITE_RELEASES.md`.

---

## Why this document exists

AQ-05 established that the site's search-facing projection faithfully represents governed publication without distorting it for search convenience. AQ-06 asked the adjacent question: would the site's *publisher-facing* posture — its readiness to carry advertising, and its standing under Google's publisher policies — hold to the same standard once monetized?

It largely does (AQ-06A found zero policy violations), but AQ-06B surfaced a finding worth codifying against directly: a real, quantified content-quality gap (templated, internal-jargon-leaking prose across 328 leaf entities in 4 domains) exists in the exact same content that would sit alongside future ads. That gap is not a policy violation and does not block AdSense approval on its own — but it is precisely the kind of thing that matters more, not less, once a page carries advertising: a page with weak content and an ad on it reads very differently to both a reviewer and a real visitor than the same weak content with no ad at all. PUBLISHER-001 exists to make that relationship explicit and permanent, not something each future monetization decision has to re-derive.

## PUBLISHER-001 — Publisher & Monetization Rule

> Publisher-facing representations are projections of governed publication. Monetization, advertising, and publisher optimizations must never compromise knowledge quality, user trust, or policy compliance. Where monetization objectives conflict with governed publication or user benefit, publication integrity takes precedence.

**What this requires in practice**, drawn directly from how AQ-06 applied it:

1. **Ad placement follows content, never the reverse.** AQ-06D certified layout readiness (consistent section boundaries, no intrusive elements) precisely because the existing publication-layer template architecture already produces natural, well-separated content blocks — ads should be placed into that existing structure, never used as a reason to restructure content shorter, thinner, or more fragmented than the governed narrative actually is.
2. **A content-quality finding is not resolved by adding monetization elsewhere.** The AQ-06B template-leak finding (328 leaf entities across 4 domains) is real and unresolved. PUBLISHER-001 makes explicit what was implicit in AQ-06's own scope restriction: fixing that finding requires editorial work at the catalog layer, not a publisher-side workaround (e.g., simply not placing ads on the affected pages would reduce risk but wouldn't fix the underlying quality gap, and is not a substitute for actually addressing it).
3. **Trust and disclosure obligations are permanent, not one-time approval gates.** AQ-06A found the cookie policy already forward-declares an "Advertising" category and AQ-06D found no consent mechanism yet exists to back that declaration operationally. PUBLISHER-001 treats this the way SEARCH-001 treats sitemap accuracy: a standing requirement to keep in sync with actual behavior, checked before any future monetization change ships — not a box ticked once at AdSense approval time and then ignored.
4. **Never let a monetization deadline compress a review into optimism.** AQ-06's own final certification chose "Ready after minor fixes" over an unqualified "Ready," specifically because Rule 2 (evaluate the site as a complete publication) means a real, quantified risk doesn't disappear just because most of the site is strong. PUBLISHER-001 generalizes that discipline: publication integrity is evaluated on its own evidence, not adjusted upward because a submission is pending.

## Standing verification

`scripts/detect-template-leak.mjs` (in `lib/adsense-audit/`) is reusable, not a one-time audit script — the same reproducible-verifier pattern `lib/schema-audit/` and `lib/search-audit/` established for SEMANTIC-001 and SEARCH-001. Re-running it after any future catalog content addition is the mechanical way to confirm new entities don't reintroduce the same template-leak pattern this phase found and diagnosed but could not fix within its own scope.

## Relationship to existing governance

PUBLISHER-001 sits at the outermost layer of the chain this repository has now built: catalog governance (what things mean) → publication (how people read it) → semantic publication (how machines parse it) → search representation (how search systems discover it) → publisher/monetization representation (how the site carries advertising without compromising any of the above). Each layer may add its own concerns — ad placement, consent mechanisms, publisher policy compliance — but none may resolve a problem that actually lives in a layer beneath it by patching over it at the outer layer. The AQ-06B finding is the concrete proof this rule is not hypothetical: it is a catalog-layer content problem, correctly diagnosed at the publisher-review layer, and correctly left unfixed here for the layer where it actually belongs to address.
