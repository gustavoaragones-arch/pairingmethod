# Entity Sampling — Domain-by-Domain Notes (Second Rerun — post AQ-02B)

Score: 66/100 (was 58 → 60 → 66).

## The bearnaise correction (see eeat-analysis.md for full detail)

**Retracted:** the claim that bearnaise's "coconut" relationship is unsourced. It has full documented provenance in `data/runtime/sauce-condiment-editorial-relationships.json` (confidence: high, derived_from: editorial, editorial_review: approved, with a specific evidence string). AQ-01 and the first AQ-01R rerun both checked the wrong data layer (the catalog's empty `commonly_served_with` snapshot field) and reported this as the site's clearest unsourced-content example across two audits. It wasn't. This entry should be read as correcting, not supplementing, the prior version of this document.

## What AQ-02B's full-census checks confirmed, that prior sampling could only suggest

**Taxonomy drift generalized — later retracted.** AQ-01 sampled one entity (chayote) and found it filed under `root-vegetables` despite being botanically a fruit-vegetable. AQ-02B4's whole-domain scan appeared to confirm the same pattern on 9 entities: acorn squash, butternut squash, chayote, delicata squash, hubbard squash, kabocha squash, pumpkin, spaghetti squash, and zucchini. **Retracted 2026-08-14:** `docs/VEGETABLE_GOVERNANCE.md` names this group "Root Vegetables & Squash" and states explicitly that squash belongs there — this is intentional, documented culinary grouping, not taxonomy drift. AQ-03 re-verified governance-aware and found 0/9 deviations from the documented rule. See `reports/aq-03-retraction-notice.md` and `reports/catalog-taxonomy-audit.json`.

**Cheese mislabeling claimed at full scale — later retracted.** AQ-02B4 reported that all 204 cheese entities carry their source milk animal's species binomial (Bos taurus, Capra hircus, Ovis aries) as their own `scientific_name` field, treating this as inherited from an AQ-01 finding at smaller sample size. **Retracted 2026-08-14:** `docs/CHEESE_GOVERNANCE.md` §5 documents `scientific_name` as milk-source-only for cheese by explicit design, not cheese taxonomic identity. AQ-03 re-verified all 204 entities against the governed 4-entry mapping table: 0 mismatches. See `reports/aq-03-retraction-notice.md` and `reports/catalog-scientific-identity-audit.json`.

**Referential integrity verified, not assumed.** 0 duplicate slugs, 0 orphaned parent-group references, 0 orphaned parent-category references across all 11 domains' catalogs — a check neither prior audit performed.

**Relationship provenance verified at full scale.** 4,140 rendered relationships across all 10 published domains independently checked against real runtime edge files: 0 without provenance. 1,692 wine-side relationship targets (styles, descriptors, techniques) checked against the actual wine catalogs: 0 unknown/dangling targets.

## What's unchanged from the first rerun

Everything else in the original entity-sampling findings holds: fruits, herbs-spices, grains-starches, legumes, nut-seeds, sweet-flavors, and fungi domains all show accurate, specific, well-written narrative content (rendered by AQ-02A, unaffected by AQ-02B). The wine-education domains (faults, techniques, styles) remain accurate and specific, untouched by either remediation phase — verified again this pass on `faults/acetobacter`, `faults/cork-taint`, `styles/riesling`.

## Net assessment

This pass's contribution to entity/data-accuracy understanding wasn't new defects — and, after AQ-03's retraction of the cheese and squash findings above, it wasn't real defects at all. The catalog layer has a verified-clean referential-integrity and relationship-provenance record across the board; AQ-03's own governance-aware sweep found one minor, non-systemic data-completeness gap (a single fruit cultivar's incomplete scientific_name) and 8 genuine variety-naming candidates for a future editorial pass — see `reports/catalog-accuracy-certification.json`.
