# Entity Sampling — Domain-by-Domain Notes (Second Rerun — post AQ-02B)

Score: 66/100 (was 58 → 60 → 66).

## The bearnaise correction (see eeat-analysis.md for full detail)

**Retracted:** the claim that bearnaise's "coconut" relationship is unsourced. It has full documented provenance in `data/runtime/sauce-condiment-editorial-relationships.json` (confidence: high, derived_from: editorial, editorial_review: approved, with a specific evidence string). AQ-01 and the first AQ-01R rerun both checked the wrong data layer (the catalog's empty `commonly_served_with` snapshot field) and reported this as the site's clearest unsourced-content example across two audits. It wasn't. This entry should be read as correcting, not supplementing, the prior version of this document.

## What AQ-02B's full-census checks confirmed, that prior sampling could only suggest

**Taxonomy drift generalized.** AQ-01 sampled one entity (chayote) and found it filed under `root-vegetables` despite being botanically a fruit-vegetable. This rerun's whole-domain scan confirms the same pattern on 9 entities: acorn squash, butternut squash, chayote, delicata squash, hubbard squash, kabocha squash, pumpkin, spaghetti squash, and zucchini — essentially the entire winter/summer squash family is filed under root-vegetables in this catalog. This is now understood to be a systemic categorization choice (or error) affecting a whole botanical family, not an isolated mistake. Detection only — no catalog file was modified, consistent with Rule 4 (publication consumes, never edits, knowledge).

**Cheese mislabeling confirmed at full scale.** All 204 cheese entities (not a sample) carry their source milk animal's species binomial (Bos taurus, Capra hircus, Ovis aries) as their own `scientific_name` field. Still not live — cheese remains unpublished to root. This is the same finding AQ-01 made from a smaller sample; nothing has changed about its truth, only about how completely it's now measured.

**Referential integrity verified, not assumed.** 0 duplicate slugs, 0 orphaned parent-group references, 0 orphaned parent-category references across all 11 domains' catalogs — a check neither prior audit performed.

**Relationship provenance verified at full scale.** 4,140 rendered relationships across all 10 published domains independently checked against real runtime edge files: 0 without provenance. 1,692 wine-side relationship targets (styles, descriptors, techniques) checked against the actual wine catalogs: 0 unknown/dangling targets.

## What's unchanged from the first rerun

Everything else in the original entity-sampling findings holds: fruits, herbs-spices, grains-starches, legumes, nut-seeds, sweet-flavors, and fungi domains all show accurate, specific, well-written narrative content (rendered by AQ-02A, unaffected by AQ-02B). The wine-education domains (faults, techniques, styles) remain accurate and specific, untouched by either remediation phase — verified again this pass on `faults/acetobacter`, `faults/cork-taint`, `styles/riesling`.

## Net assessment

This pass's contribution to entity/data-accuracy understanding isn't new defects — it's a more honest and complete picture of the defects that already existed, plus the retraction of one that didn't. The catalog layer has exactly two outstanding, well-scoped findings (cheese mislabeling, squash misclassification) and a verified-clean referential-integrity and relationship-provenance record everywhere else.
