# AdSense Readiness Assessment (Rerun — AQ-01R)

## Verdict

**Still not ready, but the reason has narrowed.** Before AQ-02A, the dominant risk was that a majority of live pages read as auto-assembled fact tables — a close match to AdSense's "scaled/low-value content" language. That risk is resolved. What's left is a smaller set of specific, previously-identified defects — most importantly, primary navigation that 404s on every one of ~1,166 pages — that would still surface in a manual review, just for a different and more narrowly scoped reason.

## What changed

**Resolved: the low-value-content signature.** Re-opening `/fruits/marionberry/`, `/nut-seeds/almond/`, `/herbs-spices/berbere/`, `/grains-starches/buckwheat/`, and `/sauce-condiments/chimichurri/` directly, each now shows a genuine, specific opening paragraph and a pairing rationale before any reference table. This was the AQ-01 finding most likely to trigger a policy flag on its own, given it affected roughly 70% of the site's published page count. It no longer does.

**Resolved: the "unfinished domain" signal from cheese's mislabeled scientific-name field.** Not something a reviewer would have seen yet (cheese isn't live), but worth noting since it removes a defect that would have shipped if cheese goes live as-is.

**Improved, not resolved: crawl discoverability.** `robots.txt` → `sitemap.xml` now references 10 of 11 food-domain sitemap sets instead of 1. Google's own indexing of the site's genuinely improved content is now far more complete than it was three hours ago.

## What's unchanged, and why it still matters

**1. Broken primary navigation (now the single largest remaining risk).** Every one of the ~1,166 leaf pages still carries a main-nav "Foods" link and breadcrumb root crumb pointing at a URL that 404s — re-verified directly against all 11 domain-hub paths. This is now proportionally more damaging than before AQ-02A, not less: a reviewer who previously might have bounced off thin content before ever testing the nav will now read a genuinely decent page, form a positive impression, then hit a dead link on the very next click. That sequence — good content, then a broken basic mechanism — reads as an unfinished or poorly maintained site, which is its own trust signal independent of content quality.

**2. Duplicate/near-duplicate content without disclosure (unchanged).** The 51 deprecated `/foods/*` pages marked internally as duplicates of canonical pages elsewhere are still live with no redirect — and now, because AQ-02A's fix applies to both the deprecated and canonical page, both versions show equally good narrative content. This is a subtle regression in one specific sense: before AQ-02A, both copies were equally thin, which is bad but at least not confusable; now both copies are equally good, which makes the duplication itself more visible to anyone who lands on both (e.g. via two different search results) and notices they're reading the same page twice under different URLs and different framing (one calls it a "Protein Food," the other a "Nut & Seed").

**3. Non-functional monetization-adjacent elements (unchanged).** The four dead "View Bottle" (`href="#"`) links on Template A dish pages are exactly where AQ-01 found them — untouched, since AQ-02A's scope was the food-ontology renderers, not the dish-page templates.

**4. Templated/boilerplate language in the wine-education tier (unchanged).** The "Why this category matters" noun-swap template and the literal leftover-template phrase "is the best if the dish is smoky for X" are both still live, re-confirmed verbatim. A reviewer trained to spot AI-assisted or scaled content would still find this signature — it just no longer sits alongside the food-ontology thin-content pattern, so it reads as an isolated quirk rather than a site-wide pattern.

**5. Search excludes most of the site (unchanged).** None of the ~1,250 food-ontology pages — now genuinely worth finding — are reachable through the site's own search box.

## What would NOT need to change (unchanged from AQ-01, still true)

The wine-education core (terms, faults, techniques, serving, regions, styles, dish guides) remains specific, accurate, and appropriately scoped. If this were the entire site, it would plausibly pass manual review on originality and helpfulness grounds today — the same conclusion AQ-01 reached, since none of this tier changed.

## Bottom line

The highest-leverage single fix identified in AQ-01 has been made, verified, and measured: it moved this category from 34 to 52. The next highest-leverage fix is now unambiguous and was already scoped in AQ-01's `navigation-review.md` before AQ-02A even started — repair the 11 domain-hub pages so the site's primary navigation resolves. That fix is smaller in surface area than AQ-02A was (11 pages to build, not ~1,250 to re-render) and would plausibly move AdSense Readiness and Navigation Quality by a comparable margin, for a fraction of the engineering effort AQ-02A required.
