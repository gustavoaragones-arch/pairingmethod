# Recommended Improvements (Second Rerun — post AQ-02B)

Same standard throughout: every recommendation is justified on reader usefulness, originality, trust, or navigability grounds, not ranking. Two full remediation phases are done; this reprioritizes what's left using the same impact/scope logic used to rank the original list.

## Done — AQ-02A, verified in the first rerun

Publishing already-authored content across all 11 food domains (1,252 pages). Complete, unaffected by AQ-02B.

## Done — AQ-02B, verified in this rerun

- Domain-hub navigation (10 of 11 domains, was 0)
- A unified `/ingredients/` entry point into the food ontology
- Site search coverage for the food ontology (1,038 entities, was 0)
- Deterministic, complete sitemap coverage
- 51 orphaned deprecated pages, now redirected
- Relationship provenance verified site-wide (0 unsupported relationships found — and one false accuracy finding from the prior two audits retracted)
- The group/category `introduction` narrative-completion gap (TC-09)

## Priority 1 (was AQ-01R Priority 4, elevated) — Reduce templated language in the wine-education tier

**Unchanged finding, now the clearest remaining content-quality gap.** With the food-ontology tier's templating resolved (AQ-02A) and navigation's broken-link pattern resolved (AQ-02B), the wine-education tier's "Why this category matters" noun-swap sentence and the leftover "is the best if the dish is smoky for X" phrasing are now the single most detector-visible template signature left on the site — re-confirmed verbatim this pass on `terms/oak/index.html`, `wine-with-grilled-steak.html`, and `wine-with-smoked-pork.html`.

**Why this is a content-quality fix:** a repeated sentence shell across ~15 descriptor categories, tripled within each page's own FAQ, reads as scaled/templated content regardless of how good the surrounding definitions are — and a literal unedited template variable ("is the best if the dish is smoky for X") is exactly the kind of seam a human reviewer or an AI-content detector is trained to catch.

**Estimated effort:** Low-moderate — this is editorial rewriting on a bounded set of pages (a dozen-ish category hubs, two dish-page templates), not an architecture change.

## Priority 2 — RETRACTED 2026-08-14, replaced

~~Cheese `scientific_name` mislabeling (204 entities)~~ and ~~squash-family taxonomy drift (9 entities)~~ are both retracted in full. AQ-03 verified both against this project's own governance documents — `docs/CHEESE_GOVERNANCE.md` §5 (scientific_name is milk-source-only for cheese, by design; 0/204 mismatches) and `docs/VEGETABLE_GOVERNANCE.md` (squash belongs in "Root Vegetables & Squash," by design; 0/9 deviations) — and found neither was ever a defect. No editorial action is needed on either. See `reports/aq-03-retraction-notice.md`.

**What replaces it — genuine candidates from AQ-03's canonical-identity audit.** 8 variety-pair entities share a common name with a sibling canonical entity in a way that may indicate accidental concept fragmentation (or may be correctly modeled — this audit doesn't resolve the call): mandarin/clementine/tangerine/satsuma, sweet-cherry/black-cherry, cranberry-bean/borlotti-bean, lime/key-lime, millet/proso-millet, panela/piloncillo. A separate, smaller item: `marionberry`'s `scientific_name` is incomplete relative to its 5 sibling Rubus-family entries (a data-completeness gap, not a mislabel). See `reports/catalog-canonical-identity.json` and `reports/catalog-scientific-identity-audit.json`.

**Estimated effort:** Low-moderate — the variety-pair candidates require a domain-expert culinary/botanical judgment call (merge vs. keep distinct) this audit cannot make; the marionberry gap is a single-field data-sourcing task.

## Priority 3 (carried over from AQ-01R Priority 4, unchanged) — Small trust and consistency fixes

- Wire `seo_description` into the `<meta>` description tag — still generic/templated in every food-ontology page's `<head>` despite the page body now having genuinely good content.
- Fix or remove the four dead "View Bottle" (`href="#"`) links on Template A dish pages.
- Remove or explain the unexplained "Pairing Strength: XX%" scores.
- Reconcile the Disclaimer's "Canada and the United States" with the Organization schema's Wyoming-only description.
- Retire or fix the legacy `npm run generate:sitemap` script, which would silently corrupt the new deterministic sitemap.xml if ever run (documented risk, not yet neutralized).

**Estimated effort:** Low, individually.

## Priority 4 (new, surfaced by this rerun) — Decide the cheese go-live

Cheese is now fully staged: content renders correctly (AQ-02A), a hub page exists in `dist/` (AQ-02B1), and nothing else in the pipeline is blocking it. The only remaining step is a publish decision (flip `published: true` in `food-domain-config.js` and run the same promotion/registry pipeline every other domain already went through) — the scientific-name concern that previously gated this is retracted (AQ-03), so there is no longer a known data issue blocking go-live.

---

## Final assessment, second rerun edition

### Would this likely pass a manual AdSense quality review today?
**More plausibly than either prior measurement, still not a confident yes.** See `adsense-readiness.md`. Both structural defects that drove "no" verdicts in the first two audits — thin content at scale, broken primary navigation — are resolved and independently verified. What's left (templated wine-education language, dead dish-page links, two catalog findings) is real but narrow and specific rather than site-wide.

### Biggest remaining weaknesses, in order of impact (second rerun)
1. Wine-education-tier templated language — the clearest remaining AI-content-detection signature (Priority 1).
2. 8 variety-naming candidates and 1 data-completeness gap surfaced by AQ-03, none confirmed as defects, awaiting editorial judgment (Priority 2).
3. A small cluster of dead links and unexplained numeric claims, unchanged since AQ-01 (Priority 3).

### What two remediation phases demonstrate about the original diagnosis
AQ-01 diagnosed a content-publication gap and a navigation/trust gap as two separate structural problems. Both turned out to be true, and both turned out to have concrete, scoped, verifiable fixes rather than requiring a rewrite: AQ-02A published what was already authored; AQ-02B built registry-driven navigation, search, sitemap, and provenance infrastructure that a future domain inherits automatically. The overall score moved from 38 (Bronze) to 66 (Silver) across two phases, entirely through mechanical, verified fixes — no new editorial voice was invented at any point, and the one accuracy claim this audit itself got wrong was caught and corrected in the same process that found everything else.
