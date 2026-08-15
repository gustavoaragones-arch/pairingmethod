# Retraction Notice — Cheese Scientific-Name and Squash-Taxonomy Findings

**Date:** 2026-08-14
**Issued as part of:** AQ-03 — Knowledge Integrity Certification (formerly scoped as "AQ-03 — Catalog Accuracy Certification")

## What is being retracted

Two findings, reported as confirmed defects across the following documents, are retracted in full:

1. **"204 cheese entities carry their source milk animal's species binomial as their own `scientific_name`."** Reported in: `reports/content-quality-audit/entity-sampling.md`, `reports/content-quality-audit/eeat-analysis.md`, `reports/content-quality-audit/recommended-improvements.md`, `reports/content-quality-audit/overview.md`, `reports/content-quality-audit/overall-score.json`, `reports/publication-integrity-certification.json`, `reports/aq-02b-final-certification.md`, `reports/aq-02b-summary.json`.

2. **"9 winter-squash-family vegetables are filed under `root-vegetables` despite being botanically fruit-vegetables — a systemic taxonomy-drift pattern."** Reported in the same documents.

## Why

Both findings were produced by comparing catalog data against a generic external expectation (standard binomial-nomenclature conventions; standard botanical-taxonomy expectations) without first checking whether this project's own governance had already made — and documented — a different, intentional decision. It had, in both cases:

- `docs/CHEESE_GOVERNANCE.md` §5: *"`scientific_name` identifies milk source only — never cheese identity"* — with a frozen 4-entry mapping table (cow→*Bos taurus*, goat→*Capra hircus*, sheep→*Ovis aries*, buffalo→*Bubalus bubalis*). Verified directly: all 204 cheese entities conform to this table exactly, 0 mismatches (see `reports/catalog-scientific-identity-audit.json`).
- `docs/VEGETABLE_GOVERNANCE.md`: the group is named **"Root Vegetables & Squash"**, and states directly: *"Squash and carrot-class roots belong in Root Vegetables."* Verified directly: all 9 squash-family entities conform, and their `plant_part: "fruit_vegetable"` field correctly and separately records botanical reality — it was never in conflict with the group assignment, which is a deliberate culinary-grouping decision (see `reports/catalog-taxonomy-audit.json`).

## What this means for prior scores

`reports/content-quality-audit/overall-score.json`'s E-E-A-T Signals (66) and Entity Quality (66) scores, as last computed in AQ-01R2, cited these two findings as a partial offset against other improvements. That offset is retracted — the `basis` text for both categories in `overall-score.json` now marks it as such — but the numeric scores themselves are intentionally **not** recomputed here. Re-deriving a score outside a full, genuine rerun of AQ-01's methodology would be a re-estimate, not a measurement, which is exactly the discipline this audit chain has held to throughout (see the project's repeated "not a re-estimate" framing across AQ-01R and AQ-01R2). A formal AQ-01R3 rerun, if commissioned, would produce the correct updated figures; the current 66/66 should be read as a slight undercount pending that rerun, not as final.

## What replaces these findings

AQ-03 ran a genuine, governance-aware, full-census verification in place of the disproven claims:

- **Scientific identity** (`reports/catalog-scientific-identity-audit.json`): 1,165 of 1,166 entities (99.91%) fully conformant. One genuine, minor, non-systemic finding: `marionberry`'s `scientific_name` ("Rubus L. subgenus") is incomplete relative to its 5 sibling Rubus-family entries — flagged for editorial completion, not auto-corrected (the precise correct cultivar-parentage citation requires botanical sourcing this process is not positioned to assert).
- **Taxonomy** (`reports/catalog-taxonomy-audit.json`): 0 structural violations across all 1,166 entities; the 3 specific governance exceptions the suite documents by name (NUT-001 peanut grouping, BOTAN-001 cilantro/coriander and dill leaf/seed) were independently verified to be correctly implemented, not just assumed correct.
- **Vocabulary + canonical identity** (`reports/catalog-vocabulary-audit.json`, `reports/catalog-canonical-identity.json`): 0 vocabulary violations, 0 duplicate canonical IDs across the whole 1,166-entity suite. 34 raw alias collisions were triaged into three buckets: 13 are governed migration-compatibility aliases (not a finding — confirmed against `data/protein-migration-map.json`), 10 reflect likely-correct separate-entity modeling with imprecise `aliases`-field usage (recommended for a future governance clarification, not a data correction), and 8 are genuine variety-pair candidates (e.g. mandarin/clementine/tangerine/satsuma, cranberry-bean/borlotti-bean) left for a future editorial pass — explicitly not resolved by this process since doing so would require culinary/botanical judgment this audit should not substitute with assumption.

## The pattern, stated plainly

This is the third and fourth time this audit chain has caught its own false positive (after the béarnaise/coconut relationship in AQ-02B3, and two detection-rule false positives in AQ-02B4). Each time, the error had the same shape: checking data against a generic external expectation instead of the project's own authoritative source first. That failure mode is now the explicit design constraint for every verifier built in AQ-03 — see the "Rule 3" framing throughout `lib/catalog-audit/*.js`.
