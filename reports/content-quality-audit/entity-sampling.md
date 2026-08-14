# Entity Sampling — Domain-by-Domain Notes (Rerun — AQ-01R)

Score: 60/100 (was 58/100, +2).

Re-sampling the same domains and entities AQ-01 covered. Data accuracy is a catalog-level property; AQ-02A changed rendering, not data, so this category moves the least of any in this rerun — exactly as expected, and confirmed rather than assumed.

## Food-ingredient domains

### foods/ (protein — deprecated, 210 pages)
**Status: thinness resolved, duplication unchanged.** `foods/almonds/` now renders genuine narrative ("Almonds are tree nut staple — snacking, romesco, and marzipan context. Nutty richness pairs with Sherry, oaky Chardonnay, and amontillado styles.") — this is the exact catalog summary AQ-01 quoted as existing-but-unpublished, now live. The canonical replacement `nut-seeds/almond/` also now renders its own (differently-worded) narrative. Both pages are equally polished and still describe the same entity under two taxonomies with no redirect and no disclosure — see thin-content-report.json TC-02.

### vegetables/ (74 pages)
**Status: thinness resolved, misclassification unchanged.** `vegetables/chayote/` now shows its catalog summary ("Chayote is a mild, pear-shaped squash for Latin American stews and slaw — lime, cilantro, and chili favor bright whites and beer.") — genuinely useful, accurate content. Re-checked: chayote's `parent_group` is still `root-vegetables` despite `plant_part: "fruit_vegetable"` — the taxonomy misclassification AQ-01 flagged is a catalog fact, untouched by a rendering fix, and is now arguably slightly more visible since the group's breadcrumb ("Home > Vegetables > Root Vegetables > Chayote") sits directly below a well-written paragraph that gives no indication anything is off.

### herbs-spices/ (113 pages)
**Status: thinness resolved, plausibility flag unchanged.** `herbs-spices/berbere/` now renders "Berbere is a fiery Ethiopian spice blend with chile, fenugreek, and ginger — its complex heat pairs with Ethiopian honey wine, Syrah, and bold spice-friendly reds" — specific and accurate. `herbs-spices/boldo/` (not re-verified line-by-line this pass, but its underlying catalog record is unchanged) still has the AQ-01-flagged mismatch between its richer unrendered — now rendered — summary and its sparse "pork loin" food-association link; the rendering fix means the more plausible connection (empanadas, Carmenère) is now visible where it wasn't, which is a genuine partial improvement worth noting even though the underlying link data wasn't touched.

### sauce-condiments/ (90 pages)
**Status: thinness resolved, unsourced-relationship finding unchanged and now more visible.** See `eeat-analysis.md` for the béarnaise/coconut detail — this is the one entity-level finding from AQ-01 that this rerun specifically flags as having gotten subtly worse in presentation terms, even though nothing about the underlying data changed.

### grains-starches/, legumes/, nut-seeds/, sweet-flavors/, fungi/
**Status: thinness resolved, no new accuracy issues found on re-sample.** `grains-starches/buckwheat/`, `nut-seeds/almond/`, `fungi/chanterelle/` all now show accurate, specific, well-written narrative content matching what AQ-01 found sitting unused in the catalog. `legumes/fava-bean/`'s narrative is now live including its grammar defect (see thin-content-report.json TC-08) — confirming AQ-01's prediction that publishing without a copy-edit pass would ship that defect as-is.

### cheeses/ (204 pages — still in dist/ only, not published to root)
**Status: thinness resolved, one mislabel resolved, richest domain confirmed.** `dist/cheeses/akawi/` now renders its summary, its `beginner_notes` ("Akawi is classified as brined cheese with cow milk source."), and its authored FAQ (with the de-duplication fix applied — see template-analysis.json). The AQ-01-flagged "Scientific name: Bos taurus" mislabel no longer renders anywhere on this page, confirmed directly — see eeat-analysis.md.

## Wine-education domains

**Status: entirely unchanged, re-confirmed on faults/acetobacter, faults/cork-taint, styles/riesling.** These domains were outside AQ-02A's scope. Definitions remain accurate and specific; no new issues found; no prior issues resolved, because none existed here.

## Net assessment

Where AQ-01 found rendering gaps, they're gone. Where AQ-01 found data-accuracy gaps (chayote, boldo, béarnaise, the fava-bean grammar defect), they're all still there, because a publication-architecture fix — by design and correctly, per AQ-02A's own regression rules — does not touch the catalog. The béarnaise finding is the one to prioritize next: it's the single AQ-01 entity-level finding that this rerun found to be *more* consequential after AQ-02A than before, purely as a side effect of the surrounding content getting more trustworthy-looking.
