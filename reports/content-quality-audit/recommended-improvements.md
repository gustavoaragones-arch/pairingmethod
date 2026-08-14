# Recommended Improvements (Rerun — AQ-01R)

Same standard as AQ-01: every recommendation here is justified on reader usefulness, originality, trust, or navigability grounds, not ranking. Priority 1 from AQ-01 is done; this rerun reprioritizes what's left using the same logic AQ-01 used to rank the original list — impact and mechanical scope, not effort.

## Done — AQ-02A, verified in this rerun

**Publish the content that had already been written.** Complete. 1,252 leaf/group/category pages across all 11 food domains now render authored `summary`, `beginner_notes`, and `faq` content that previously existed and never shipped. Verified independently in this rerun, not just taken from AQ-02A's own report.

## Priority 1 (was AQ-01 Priority 2) — Fix the broken domain-hub navigation

**Unchanged from AQ-01, now the single highest-leverage remaining item.** All 11 `/foods/`, `/fruits/`, etc. hub pages still 404. This is now more consequential than when AQ-01 first flagged it: the content behind those broken links is worth reaching, so the cost of the dead end is higher, not lower. The fix AQ-01 described is unchanged and still true: build a landing page per domain mirroring what `styles/index.html` or `faults/index.html` already do — list groups/categories with a short orienting paragraph. The now-live per-entity `summary`/`introduction` narrative gives this fix even better raw material than it had in AQ-01 (a domain hub could open with the domain's own catalog-level narrative, following exactly the pattern AQ-02A just proved out at the entity level).

**Estimated effort:** Low, and now lower than AQ-01 estimated — the narrative-rendering pattern, shared helpers, and page-model plumbing AQ-02A built for entity pages are directly reusable for a domain-hub page; this would mostly be a new page-generation script following an established pattern, not new design work.

## Priority 2 (was AQ-01 Priority 6, part of it) — Make the site's own search reach the content that's now worth finding

**New emphasis, same finding.** AQ-01 listed this as a smaller item; this rerun elevates it because the calculus changed. Before AQ-02A, the ~1,250 food-ontology pages weren't very valuable to find via search. Now they are, and none of them are reachable through the homepage search box, which indexes wine-side entities only.

**Why this is a content-quality fix, not an SEO fix:** A visitor who now lands on a genuinely useful buckwheat or chanterelle page has no way to search for the next one from the site's own search box — they'd have to leave and search externally, or already know a URL.

**Estimated effort:** Low-to-moderate — extend `assets/js/semantic-entry.js` to also load the food-ontology search indexes that already exist per domain (`data/search/*-search-index.json`), which were generated correctly throughout AQ-02A's pipeline runs and are sitting unused by the client-side search, the same shape of problem AQ-02A just solved for rendering.

## Priority 3 (carried over from AQ-01 Priority 5) — Audit rendered relationship claims against source data

**Unchanged, now more urgent for one specific instance.** The béarnaise/coconut relationship (see `eeat-analysis.md`) is now displayed more prominently and more credibly than before, without having become more accurate. AQ-01 found this via a small sample and flagged the scope beyond that one instance as unverified. This rerun recommends resolving that uncertainty before the cheese domain — the one domain with the richest narrative content and the most authored trust signals — goes live, since a similar unsourced-relationship defect there would now be harder to spot, not easier, precisely because the surrounding content is more polished.

**Estimated effort:** Low for the audit itself — a script comparing every leaf page's rendered "commonly served with"/wine-pairing links against that entity's own catalog record would surface every discrepancy in one pass, the same kind of verification AQ-02A's own QA report already does for narrative-field rendering.

## Priority 4 (carried over, unchanged in substance) — Small trust and consistency fixes

- Wire `seo_description` into the `<meta>` description tag now that the rendering pattern exists — currently the page body shows genuine narrative while the `<head>` still shows the AQ-01-flagged generic templated description. This is a small inconsistency worth closing precisely because it's now the odd one out.
- Add a redirect for the 51 duplicate `/foods/*` pages, or at minimum disclose the relationship between the deprecated and canonical page — now more valuable to fix since both pages read as more authoritative than before.
- Copy-edit the authored `summary`/`beginner_notes` fields before any further domain launches — the fava-bean grammar defect (thin-content-report.json TC-08) confirms this risk was real, not hypothetical.
- Wire the `introduction` field (group/category tier) into a render call, or explicitly document why it's intentionally unused — currently extracted and silently dropped, the one place AQ-02A's own Rule 2 isn't fully honored (thin-content-report.json TC-09).
- Fix or remove the dead "View Bottle" links and unexplained "Pairing Strength: XX%" scores on the dish-page templates — unchanged from AQ-01, still outstanding.
- Vary or remove the templated "Why this category matters" sentence and the leftover "is the best if the dish is smoky for X" phrasing in the wine-education tier — unchanged from AQ-01, still outstanding, and now the most detector-visible template signature left on the site since the food-ontology tier no longer has an equivalent.

**Estimated effort:** Low, individually, same as AQ-01 assessed.

---

## Final assessment, rerun edition

### Would this likely pass a manual AdSense quality review today?
**Not yet, but the reason narrowed from "most of the site reads as a database export" to "primary navigation is broken."** See `adsense-readiness.md`. The first is a much harder problem to fix credibly (it requires either a lot of writing or, as it turned out, a publication-architecture fix); the second is a small, well-scoped, mechanical fix that AQ-01 already fully specified before AQ-02A even started.

### Biggest remaining weaknesses, in order of impact (rerun)
1. Broken domain-hub navigation on ~1,166 now-worth-visiting pages (Priority 1).
2. Site search excludes the content that just became worth finding (Priority 2).
3. At least one unsourced relationship now displayed more credibly than its underlying data supports, with unknown scope beyond the one confirmed instance (Priority 3).
4. A cluster of smaller, previously-identified, still-untouched issues in the wine-education tier and the `<head>` metadata layer (Priority 4).

### What this rerun demonstrates about the original diagnosis
AQ-01 predicted that fixing the rendering gap would move Original Value, Helpful Content, Thin Content, and Pairing Quality substantially while leaving Navigation Quality and Internal Linking essentially where they were, because those categories depend on different mechanisms entirely. That's exactly what happened, measured directly rather than assumed: Thin Content moved +50, Navigation Quality moved +2. The next remediation phase has a clean, narrow target with a track record — the same "find the exact mechanical gap, fix it once, verify it lands" pattern AQ-02A just proved out — rather than a diffuse rewrite.
