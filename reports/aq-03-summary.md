# AQ-03 — Knowledge Integrity Certification — Summary

**Date:** 2026-08-14
**Originally scoped as:** AQ-03 — Catalog Accuracy Certification (fix cheese `scientific_name`, fix squash classification)
**Renamed and reframed to:** AQ-03 — Knowledge Integrity Certification (prove whether systematic catalog errors actually exist), per explicit user decision after both headline premises were disproven during Phase 1 investigation.

## What happened, in order

1. The ticket's two motivating findings — 204 cheese entities' `scientific_name` "mislabeled" with their milk-source animal, and 9 squash-family entities "misfiled" under root-vegetables — were checked against this project's own governance documents before being acted on, per the ticket's own Rule 3 (never replace one assumption with another).
2. Both were disproven. `docs/CHEESE_GOVERNANCE.md` §5 documents `scientific_name` as milk-source-only for cheese, by explicit design. `docs/VEGETABLE_GOVERNANCE.md` names the group "Root Vegetables & Squash" and states squash belongs there, by explicit design. Executing the ticket's Phase 1/Phase 2 catalog edits as written would have broken working, governed, correct data.
3. This was surfaced transparently rather than silently skipped or blindly executed. The user's decision: retract the findings across every report that stated them as fact, rename the initiative, reframe its objective from "fix known errors" to "prove whether systematic errors exist," and run Phases 3–7 as a genuine, evidence-based sweep.
4. That retraction and that sweep are what this initiative delivered.

## Retraction

`reports/aq-03-retraction-notice.md` documents the retraction in full. It touches 9 files across three prior initiatives (AQ-01R2, AQ-02B4): `reports/content-quality-audit/{eeat-analysis,entity-sampling,recommended-improvements,overview,adsense-readiness}.md`, `reports/content-quality-audit/overall-score.json`, `reports/publication-integrity-certification.json`, `reports/aq-02b-final-certification.md`, `reports/aq-02b-summary.json`. In each, the false finding is preserved for historical record (never silently deleted) with an explicit retraction annotation and a pointer to the governance source and the replacement verification.

This is the fourth and fifth time this audit chain has caught its own false positive: béarnaise/coconut (AQ-02B3), 43 beef-cut and 40 wine-pairing-vocabulary false positives caught pre-publication (AQ-02B4 build), and now cheese/squash (AQ-03). Every instance shares the same root cause — checking data against a generic external expectation instead of this project's own authoritative governance first — and every instance was caught by the same discipline: verify before asserting.

## What Phases 3–7 actually found (governance-aware, full 1,166-entity census, all 11 domains)

| Phase | Scope | Entities checked | Confirmed defects | Report |
|---|---|---|---|---|
| AQ-03A | Scientific identity | 1,166 | 1 (data-completeness gap, not a mislabel) | `reports/catalog-scientific-identity-audit.json` |
| AQ-03B | Taxonomy / botanical classification | 1,166 | 0 | `reports/catalog-taxonomy-audit.json` |
| AQ-03C | Vocabulary conformance | 1,166 | 0 | `reports/catalog-vocabulary-audit.json` |
| AQ-03C | Canonical identity (duplicate IDs, alias collisions) | 1,166 | 0 duplicates; 34 raw alias collisions → 13 governed/expected, 10 likely-correct-modeling, 8 genuine editorial candidates | `reports/catalog-canonical-identity.json` |
| AQ-03D | Regeneration determinism | 11 domains recertified | 0 drift | `reports/catalog-accuracy-certification.json` |

**The one AQ-03A finding:** `marionberry`'s `scientific_name` ("Rubus L. subgenus") is incomplete relative to its 5 sibling Rubus-family entries. Flagged for editorial sourcing, not auto-corrected — the precise cultivar-parentage citation requires botanical sourcing this process should not assert on its own authority.

**The 8 AQ-03C canonical-identity candidates:** mandarin/clementine, mandarin/tangerine, mandarin/satsuma, sweet-cherry/black-cherry, cranberry-bean/borlotti-bean, lime/key-lime, millet/proso-millet, panela/piloncillo. Each may be legitimately distinct entities sharing a common name, or the same concept that should be consolidated — this audit does not resolve that judgment call (Rule 3), it surfaces the candidates for a future editorial pass with domain expertise.

## Regression

Zero catalog files were modified throughout AQ-03A–D. `git status` confirmed no changes to any `data/*-catalog.json`, `data/runtime/`, `docs/`, `lib/editorial/`, `lib/runtime/`, or wine-education content at any point. All 11 domains recertified PASS with 100% publication completeness — rerunning certification against the unchanged catalog produced zero drift, verifying Rule 2's regeneration guarantee.

## Overall result

**Certification: PASS.** The catalog layer is editorially authoritative on scientific identity and taxonomic classification specifically — both dimensions this initiative was built to examine — and structurally/vocabulary-clean suite-wide. It is not yet fully closed on canonical-identity precision: 8 variety-pair candidates and 10 processed-form alias-usage cases warrant a scoped future editorial pass, explicitly not resolved here since doing so would require culinary/botanical judgment rather than verification. See `reports/catalog-accuracy-certification.json` for the full success-criteria assessment against the original ticket's stated criteria.

## The larger point

This initiative's real deliverable isn't the zero-defect census — it's proof that the audit process itself catches its own errors before they cause damage. A ticket built around two specific, confident "fix this" findings was redirected, before a single catalog edit was made, into verifying whether those findings were even true. They weren't. That the process caught this on its own, disclosed it plainly, and let the user redirect the entire initiative's framing rather than quietly completing the originally-scoped work, is the actual certification result worth trusting.
