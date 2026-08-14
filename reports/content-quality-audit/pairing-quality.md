# Pairing Quality Review (Rerun — AQ-01R)

## Score: 65/100 (was 48/100, +17)

This is the category where AQ-02A's actual mechanism — publish an explanation before a link list — maps most directly onto AQ-01's specific diagnostic question: "or merely 'X pairs well because...'?" Rerunning that exact test now gives a different answer for most of the site.

## Tier B (ingredient pages, ~1,166 pages): the core finding is resolved

AQ-01's example was `/nut-seeds/almond/`, whose entire pairing content was:

> `<h2>Primary wine styles</h2><ul><li><a href="/styles/chenin-blanc/">chenin blanc</a></li></ul>`

Re-reading the same page now:

> **Wine Pairing Explanation**
> Almond is a canonical marzipan and crusts ingredient — tree nut use in marzipan and crusts cooking pairs with Almondine whites, dry Sherry, and light Pinot Noir.
> *Primary wine styles:* chenin blanc
> *Alternative wine styles:* sherry

That's a direct fix of the exact gap AQ-01 identified — the "X pairs well because..." is now present, specific (names Sherry and Almondine, not just "a white wine"), and appears immediately above the links it explains. The same pattern holds on every domain spot-checked: `fungi/chanterelle/` ("classic in French cream sauces and autumn dishes that love Chardonnay and Pinot Noir"), `sauce-condiments/chimichurri/` (explains the sauce's role before listing dry rosé), `grains-starches/buckwheat/` ("distinctive pseudocereal character pairs with Champagne, Muscadet, and mineral-driven whites").

**Sauce-condiment's richer taxonomy is now visible where it wasn't before.** AQ-01 noted this domain has a differentiated pairing model (primary / classic / contrasting / regional / wines-to-avoid) unlike the flat primary+alternative pattern elsewhere, but that richness was invisible because none of it rendered with explanation. It's now genuinely useful: chimichurri's page groups its pairing links under these distinct labels beneath the rationale sentence.

**What's still a gap in this tier.** The rationale is one sentence per entity, not adjusted for preparation the way the dish guides are (AQ-01's `wine-with-steak.html` example distinguishes grilled ribeye from filet mignon from pepper-crusted; no ingredient page does anything like this). And where a page's underlying relationship data is empty or wrong (the béarnaise/coconut case — see `eeat-analysis.md`), the new, better-presented section doesn't catch it; it just presents the same unsourced claim more convincingly.

## Tier A (dish-specific guides, 11–13 pages): unchanged, re-confirmed

`wine-with-steak.html` is untouched — same Quick Answer / Sommelier Verdict / Wines to Avoid / Preparation Variations structure AQ-01 praised, same unexplained "Pairing Strength: 95%" scores, same dead "View Bottle" links. This remains the site's strongest pairing content and the ceiling this rerun measures Tier B against.

## What "good" looks like now vs. the AQ-01 target

AQ-01's recommendation was specific and testable: "if `/nut-seeds/almond/`'s 'Primary wine styles' section were followed by its own unrendered summary sentence, the page would go from a bare link to a genuine, specific pairing explanation." That is exactly what happened, verified directly rather than assumed. The remaining gap between Tier B and Tier A is depth (one general sentence vs. cut-and-preparation-specific reasoning), not presence (explained vs. unexplained) — a materially smaller problem than the one AQ-01 identified.

## Summary

| Sub-area | AQ-01 | AQ-01R | Change |
|---|---|---|---|
| Specificity | Strong in Tier A; absent in Tier B | Strong in Tier A; present but general in Tier B | Improved |
| Culinary grounding | Strong in Tier A; absent in Tier B | Strong in Tier A; present in Tier B | Improved |
| Educational value | Strong in Tier A; zero in Tier B | Strong in Tier A; real but shallow in Tier B | Improved |
| Actionability | Strong in Tier A, undercut by dead links; zero in Tier B | Same in Tier A; present in Tier B | Improved |
| Accuracy of what's shown | Sound in Tier A; one confirmed defect in Tier B | Unchanged in both tiers | No change |
| Numeric confidence claims | Unsupported, both tiers | Unchanged | No change |
