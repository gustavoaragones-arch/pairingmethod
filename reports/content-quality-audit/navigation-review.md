# Navigation, Linking & Crawlability Review (Second Rerun — post AQ-02B)

Combined score: Internal Linking 78/100 (was 40 → 48 → 78), Navigation Quality 75/100 (was 27 → 29 → 75).

This category moved the least across AQ-02A and the most across AQ-02B — exactly the inverse of Thin Content's pattern, and exactly what should happen when two remediation phases target genuinely different defects.

## Finding 1 (RESOLVED): food-domain hub pages now exist

Previously: all 11 `/foods/`, `/fruits/`, etc. paths 404'd, confirmed across three separate checks in two prior audits. Now: 10 of 11 resolve — confirmed directly, `fruits/index.html` exists, loads, opens with genuine narrative (its own category's `summary`), lists every group, and links to every sibling domain plus `/ingredients/`. Cheese is the correct exception (`published: false`); its hub is built in `dist/` and ready the moment that domain goes live.

**Why this matters more than a simple "page added":** this was the single most-cited defect across both prior audits — the first thing a first-time visitor or reviewer would hit clicking the primary nav. It's gone.

## Finding 2 (RESOLVED): no single navigational entry point into the food ontology

Previously: nothing tied the 11 food domains together; a visitor on a fruit page had no way to discover the site also covers vegetables, cheeses, or sauces short of already knowing the URL. Now: `/ingredients/` lists every published domain with entity/group counts, and is linked from every domain hub, every leaf/group/category page's nav, and 25 core/dish/seasonal static pages (verified directly on `index.html`, `wine-with-steak.html`, and others). This is genuinely new capability, not a restoration of something broken — no prior version of the site had this.

## Finding 3 (RESOLVED): search excluded the entire food ontology

Previously: `assets/js/semantic-entry.js` indexed wine-side entities only; none of ~1,250 food-ontology pages were reachable via the site's own search box. Now: `assets/js/food-ontology-search-index.js` adds 1,038 leaf/group/category entities (full census verified — every published domain's every tier), imported additively alongside the existing wine-side modules (which were not modified).

## Finding 4 (RESOLVED): sitemap coverage was incomplete and non-deterministic

Previously: root `sitemap.xml` referenced 1 of 11 domains at AQ-01's original measurement (incidentally improved to 10 of 11 as an AQ-02A side effect, but the underlying mechanism — merging into whatever history happened to exist — was never actually fixed). Now: sitemap.xml is rebuilt from scratch every run from the same published-domain registry driving navigation and search. Confirmed deterministic by running the generator twice and diffing output. Domain hub pages and `/ingredients/`, which had no sitemap entry at all under any prior state, are now included.

**One risk surfaced, not fixed:** a pre-existing, unrelated legacy script (`npm run generate:sitemap`) would overwrite this deterministic sitemap.xml with an incompatible flat format if ever run. Documented in `reports/sitemap-certification.json`; not removed (out of this phase's scope — unrelated legacy tooling).

## Finding 5 (RESOLVED): 51 pages were unreachable via any internal link

This is new since the first rerun — neither AQ-01 nor AQ-01R found it, because neither did an actual link-graph crawl of the live site. AQ-02B's reachability check (breadth-first from `/ingredients/` and `/`, following only hrefs present in the real HTML) found 51 published protein-domain pages — all deprecated entities (mushrooms, legumes, grains, nuts filed under the old protein taxonomy) — with zero incoming links from anywhere on the site. Root cause: their parent group's runtime member list is correctly empty (they've migrated to their canonical domain at the ontology layer), which orphaned the still-published deprecated HTML pages. Fixed by generating `_redirects` entries directly from each entity's own `canonical_publication_path` field (already present in the catalog, previously unused) — confirmed `/foods/almonds` → `/nut-seeds/almond/` resolves. Re-running the same crawl afterward: 0 orphans.

## Finding 6 (UNCHANGED): glossary hub naming collision

`/terms.html` is still the legal Terms & Conditions page; the wine-descriptor glossary (`/terms/`) still has no true top-level index, and the breadcrumb parent for every descriptor page still points at one arbitrary category rather than a real listing. This is a wine-education-tier navigation issue, outside both AQ-02A's and AQ-02B's stated scope (food-ontology publication and food-domain navigation infrastructure, respectively). Unchanged across all three measurements.

## Finding 7 (UNCHANGED): leaf-level cross-domain linking

Still working correctly, as found in both prior audits: ingredient pages link out to relevant wine styles, techniques, and descriptors beyond their own taxonomy branch, and those links resolve.

## Summary table

| Issue | AQ-01 | AQ-01R (post A) | AQ-01R2 (post B) |
|---|---|---|---|
| Domain-hub 404s | Critical | UNCHANGED | **RESOLVED** (10/11) |
| No unified food-ontology entry point | (not identified as distinct finding) | — | **RESOLVED** (new: /ingredients/) |
| Site search excludes food domains | Major | UNCHANGED | **RESOLVED** (1,038 entities) |
| Sitemap coverage/determinism | Critical | IMPROVED (incidental) | **RESOLVED** (deterministic, by design) |
| 51 orphaned deprecated pages | (not found — no crawl performed) | — | **RESOLVED** (found and fixed same phase) |
| Glossary naming collision | Major | UNCHANGED | UNCHANGED |
| Leaf-level cross-domain linking | — | UNCHANGED (working) | UNCHANGED (working) |
