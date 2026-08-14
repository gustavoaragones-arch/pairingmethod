# E-E-A-T Analysis (Rerun — AQ-01R)

## Score: 55/100 (was 52/100, +3)

## What changed

**One accuracy defect resolved, as a side effect.** AQ-01 flagged that cheese catalog entries populate a "Scientific name" field with the source animal's species binomial (Camembert → "Bos taurus"), a genuine mislabeling that would have misled a reader had it ever shipped. Cheese hadn't gone live at the time. It's now been rebuilt with the new architecture, and that specific field was replaced by "Milk source" in the new template — confirmed directly against `dist/cheeses/akawi/index.html`, which shows no "Scientific name" row anywhere. The mislabel is moot: not fixed at the data layer, but no longer capable of shipping.

**Narrative content adds genuine expertise/experience signal.** Where AQ-01 found ingredient pages with nothing beyond a fact table — no signal of anyone having thought about the entity — pages like `nut-seeds/almond/` now open with "Almond is a canonical marzipan and crusts ingredient — tree nut use in marzipan and crusts cooking pairs with Almondine whites, dry Sherry, and light Pinot Noir." That's a small but real experience signal: specific culinary use-cases, specific wine names, not generic filler.

## What's unchanged, re-verified directly

**The unsourced béarnaise/coconut relationship is still live — and arguably more visible now.** AQ-01's most significant single accuracy finding was that `/sauce-condiments/bearnaise/` displays "Commonly served with: coconut, steak sauce" despite that entity's own catalog record having an empty `commonly_served_with` array — meaning the relationship isn't traceable to curated data. Re-checked directly: still present, unchanged, and now rendered under a genuine "Common Culinary Uses" heading (upgraded from a bare unlabeled list) — which means a reader who trusts the new, better-presented sections more than they'd trust a bare list is *more* likely to take this specific unsourced claim at face value, not less. This is worth flagging explicitly: publishing narrative more prominently doesn't discriminate between sourced and unsourced content, so a data-integrity problem sitting underneath a better presentation layer becomes a slightly bigger trust risk, not a smaller one.

**Unsupported numeric claims are unchanged.** "Pairing Strength: 95%" and the pairing-matrix 0–100 scores still appear with no stated methodology anywhere on the site — these live in the dish-page templates, outside AQ-02A's scope.

**Duplicate content is unchanged, and now harder to distinguish by quality alone.** The 51 `/foods/*` pages marked deprecated in favor of canonical pages elsewhere still have no redirect. Before AQ-02A, both the deprecated and canonical version of e.g. "almonds" were equally thin — an obvious, if unexplained, near-duplicate. Now both versions are equally well-written (each was independently given its own narrative via the same rendering fix), which if anything makes the duplication a more sophisticated-looking problem: two well-produced pages describing the same entity, filed under two different taxonomies, with nothing on either page disclosing the relationship.

**The jurisdiction inconsistency is unchanged.** Disclaimer.html's "operated from Canada and the United States" still doesn't match the Organization schema/About page's Wyoming-only description — untouched, outside AQ-02A's scope entirely.

## What's still working, unchanged

Named authorship (Gustavo Aragones), the real operating entity (Albor Digital LLC, Wyoming, contact email), and the appropriately-scoped Disclaimer content are all exactly as AQ-01 found them — none of this was ever in question, and none of it changed.

## Net assessment

The trust foundation is unchanged and was never the problem. What moved is a single incidental fix (cheese mislabel) plus a genuine, if modest, uptick from having actual expertise-signaling content on pages that previously had none. What didn't move — and is now proportionally more important, since it's one of the few remaining E-E-A-T defects — is the unsourced béarnaise relationship, which this rerun specifically flags as a priority for the next remediation phase precisely because better presentation elsewhere has made it comparatively more conspicuous, not less.
