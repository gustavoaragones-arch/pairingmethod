# E-E-A-T Analysis (Second Rerun — post AQ-02B)

## Score: 66/100 (was 52 → 55 → 66)

## A correction, stated plainly

Both AQ-01 and the first AQ-01R rerun cited `/sauce-condiments/bearnaise/`'s "Commonly served with: coconut, steak sauce" as this site's clearest example of an unsourced or fabricated relationship — the single most-repeated accuracy finding across two audits, and the basis for a "Priority 3" remediation recommendation. **That finding was wrong.** It was based on checking one field (the catalog's denormalized `commonly_served_with` snapshot, which is empty for bearnaise) rather than the actual source of truth. AQ-02B's relationship-provenance verifier traced the real rendered relationship to `data/runtime/sauce-condiment-editorial-relationships.json`, which contains:

```
source: bearnaise, relationship: commonly_served_with, target: coconut
confidence: high, derived_from: editorial, editorial_review: approved, editorial_tier: C
evidence: "Coconut pairs with sweet-spicy table sauces in tropical and Filipino service."
```

This is a fully documented, approved editorial relationship with a specific evidentiary claim attached. It may be a debatable culinary judgment (bearnaise's classical French identity makes a Filipino-service pairing note a genuinely unusual choice to foreground), but "unusual editorial judgment" and "unsourced/fabricated content" are different findings with very different implications for trust, and this site's actual behavior is the former, not the latter. The same verifier checked every other rendered relationship on the site — 4,140 in total — against the real runtime edge files and found zero without provenance. This is a meaningfully better trust picture than either prior audit reported, and it was reached by building and running an actual verification tool, not by re-asserting the original claim more confidently.

## What else changed

**Referential integrity is now verified, not assumed.** A knowledge-integrity scan found 0 duplicate slugs, 0 orphaned group-parent-category references, and 0 orphaned leaf-parent-group references across all 11 domains' catalogs. This wasn't checked in either prior audit.

**Two catalog findings were fully documented at census scale, then retracted entirely — a second correction, not just a first.** AQ-02B4 reported the cheese `scientific_name` field (source animal's binomial) as a mislabel across all 204 cheese entities, and the AQ-01/AQ-01R chayote taxonomy-drift finding as a 9-entity pattern across the whole winter-squash family. **Retracted 2026-08-14.** Both were checked against a generic external expectation instead of this project's own governance, the exact same failure mode as the bearnaise error above. `docs/CHEESE_GOVERNANCE.md` §5 documents `scientific_name` as milk-source-only for cheese by explicit design (0/204 mismatches against the governed table, verified). `docs/VEGETABLE_GOVERNANCE.md` names the group "Root Vegetables & Squash" and states squash belongs there explicitly (0/9 deviations, verified). Neither finding was ever real. Full detail in `reports/aq-03-retraction-notice.md`; the replacement, governance-aware verification is in `reports/catalog-scientific-identity-audit.json` and `reports/catalog-taxonomy-audit.json`.

**A methodological note worth including for its own sake:** building the provenance verifier initially produced 40 false-positive violations (protein-domain wine-pairing edges using `derived_from: "pairing"` instead of "editorial" — same real source, different vocabulary) and the knowledge-integrity scan initially flagged 43 false positives (protein-domain beef cuts correctly using "Bos taurus" as their scientific name, which is accurate for raw animal tissue, unlike cheese). Both were caught and corrected by checking the actual data before reporting a finding — the same discipline that caught the original bearnaise error. This is recorded not to inflate the count of "things found" but because a review process that catches its own false positives before publishing them is itself an E-E-A-T-relevant signal.

## What's unchanged

Named authorship, the real operating entity (Albor Digital LLC), appropriate disclaimers, and the site's core trust foundation are exactly as found in both prior audits — never in question, never touched.

Unsupported numeric claims ("Pairing Strength: 95%," the pairing-matrix scores) are unchanged — these live in the dish-page template, outside both remediation phases' scope. The Disclaimer/Organization-schema jurisdiction inconsistency (Canada vs. Wyoming-only) is unchanged.

## Net assessment

The trust foundation was never the problem, across any of the measurements. What moved this time is a genuine correction — the site's most-cited accuracy defect turns out not to be one — plus newly-verified referential integrity across the whole catalog layer. As of AQ-03, the cheese mislabel and squash misclassification are retracted too: both were also false. What remains open is narrower and more honest than any prior version of this report claimed — a single non-systemic data-completeness gap and 8 variety-naming candidates for a future editorial pass, not confirmed defects (see `reports/catalog-accuracy-certification.json`).
