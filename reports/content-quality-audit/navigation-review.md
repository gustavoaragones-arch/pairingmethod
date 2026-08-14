# Navigation, Linking & Crawlability Review (Rerun — AQ-01R)

Combined score: Internal Linking 48/100 (was 40, +8), Navigation Quality 29/100 (was 27, +2).

This category moved the least of any in this rerun, and that's the expected, correct result: AQ-02A's stated scope was the food-ontology content renderers, and every finding below was either explicitly out of scope or only tangentially touched by regenerating pages in bulk.

## Finding 1: every food-domain hub page still 404s (Critical, UNCHANGED)

Re-checked directly against all 11 paths: `foods/`, `fruits/`, `vegetables/`, `grains-starches/`, `legumes/`, `nut-seeds/`, `herbs-spices/`, `sweet-flavors/`, `sauce-condiments/`, `fungi/`, `cheeses/` — every one still returns 404, no `index.html` and no flat fallback exists for any of them. Every one of the ~1,166 leaf pages (now content-rich) still carries a main-nav "Foods" link and breadcrumb root crumb pointing at these dead paths.

**This finding is proportionally more important now than in AQ-01.** Before AQ-02A, a visitor landing on a thin page had little reason to explore further regardless of whether the nav worked. Now that the pages themselves are worth reading, a visitor is more likely to want to browse "up" to see what else is in the domain — and hits the same 404 either way. Good content increases the cost of broken navigation; it doesn't offset it.

## Finding 2: cheese domain still not live (Critical, UNCHANGED by design)

`dist/cheeses/`, `dist/cheese-groups/`, `dist/cheese-categories/` are now fully rebuilt with the new architecture and pass certification, but remain unpromoted to root — a deliberate scope decision carried over from AQ-02A (publishing a previously-unpublished domain is a go-live decision, not a rendering fix). Unlike Finding 1, this is not a regression or an oversight; it's flagged here only so the "still not live" status is explicit in this rerun rather than assumed.

## Finding 3: glossary hub naming collision (Major, UNCHANGED)

`/terms.html` is still the legal Terms & Conditions page; `/terms/` (the wine-descriptor glossary) still has no true top-level index, and the breadcrumb parent for every descriptor page still points at one arbitrary category (`/terms/acidity/`) rather than a real listing. Entirely outside AQ-02A's scope (this is a wine-education-tier navigation issue, not a food-ontology rendering issue). Unchanged.

## Finding 4: sitemap discovery — genuinely improved, though not the primary target

`robots.txt` still points to `/sitemap.xml`. That file previously referenced only 4 of 34 sitemap files (the sauce-condiment set + site-pages), from whatever domain happened to be generated most recently. Because AQ-02A regenerated all 10 live food domains in the same session, and because each domain's sitemap-generation step append/merges into the shared `dist/sitemap.xml` rather than overwriting it, the root sitemap now references **30 of 34 files, covering 10 of 11 domains** — confirmed by direct inspection. Only cheese's 3 sitemap files are still absent, consistent with cheese not being promoted to root.

This is a real, verified improvement to crawlability, but it's worth being precise about its cause: it happened because regenerating 10 domains in one sitting incidentally exercised the existing (and previously under-exercised) merge behavior in the sitemap generator, not because AQ-02A set out to fix the sitemap-index gap AQ-01 identified. The underlying "sitemap.xml reflects whatever ran most recently rather than being deterministically complete" architecture is unchanged — a future single-domain publish (e.g., a small content fix to just `fruit`) could in principle narrow the sitemap back down, depending on how the merge logic actually works. This wasn't verified in this rerun and is worth a dedicated look before relying on the current 10/11 state persisting.

## Finding 5: leaf-level cross-linking — unchanged, still working correctly

Re-confirmed: `nut-seeds/almond/`, `fruits/marionberry/` and others still link out to relevant `/styles/`, `/techniques/`, `/terms/` pages beyond their own taxonomy branch, and those links still resolve. This was a positive finding in AQ-01 and remains one — AQ-02A's Wine Pairing Explanation section actually improves the presentation of these links slightly, by grouping them under contextual sub-headings (e.g., sauce-condiment's classic/contrasting/regional/avoid groups) instead of a flat list, though the underlying link set is unchanged.

## Finding 6: site search still excludes all food domains (Major, UNCHANGED)

`assets/js/semantic-entry.js` still builds its search index from wine-side data only. None of the now-content-rich ~1,250 food-ontology pages are reachable through the homepage search box. This is arguably the second-highest-leverage remaining gap after the domain-hub 404s: the site now has good content that a visitor arriving via the site's own search has no way to find.

## Finding 7: 51 duplicate pages still have no redirect (Major, UNCHANGED)

Unchanged from AQ-01 — see `thin-content-report.json` TC-02 and `eeat-analysis.md` for how this finding's character shifted (both copies are now well-written instead of both being thin, which doesn't fix the duplication, just changes what it looks like).

## Summary table

| Issue | AQ-01 Severity | Status | Notes |
|---|---|---|---|
| Domain-hub 404s | Critical | UNCHANGED | Now higher-cost given improved content behind the broken link |
| Cheese domain not live | Critical | UNCHANGED (by design) | Rebuilt, certified, not promoted — deliberate |
| No true glossary top-level hub | Major | UNCHANGED | Outside AQ-02A scope entirely |
| Sitemap coverage | Critical | IMPROVED (1→10 of 11 domains) | Incidental, mechanism not verified as durable |
| Leaf-level cross-domain linking | — | UNCHANGED (working) | Presentation slightly improved |
| Site search excludes food domains | Major | UNCHANGED | Now the second-highest-leverage gap |
| 51 duplicate pages, no redirect | Major | UNCHANGED | Character shifted, not resolved |
