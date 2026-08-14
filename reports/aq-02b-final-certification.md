# AQ-02B — Trust & Navigation Completion — Final Certification

**Date:** 2026-08-14
**Scope:** Navigation, relationship integrity, sitemap coverage, and discoverability, converted from ad hoc fixes into certified, registry-driven platform capabilities.
**Predecessor:** AQ-02A (Publication Completion Architecture) — narrative rendering across all 11 food domains.

## Verdict

**Certified.** All four milestones passed their own verification before being committed. Every check in this document was independently re-derived from live files, not read back from a script's self-reported success — including two real mistakes this process caught in itself (see "What this process caught," below).

## Navigation completeness

10 of 11 published food domains now have a working hub page (previously 0 of 11 — every `/foods/`, `/fruits/`, etc. path 404'd). A new `/ingredients/` master directory lists all published domains and is linked from every domain hub and from 25 core, dish-specific, and seasonal-guide static pages, so there is exactly one navigational entry point into the food ontology that every page type agrees on. Cheese remains correctly excluded from all of this (its `published` flag is `false`), while its hub is staged in `dist/` for whenever that domain goes live — a one-flag flip, not new engineering.

**Verified:** full census (not sampling) of 962 leaf pages confirms a resolvable Foods-nav target and an Ingredients-directory link on every one; all 25 static pages checked directly. See `reports/navigation-certification.json`.

## Search completeness

The homepage search box previously indexed wine-side entities only (styles, regions, descriptors, techniques, faults, grapes) — none of the food ontology was searchable. It now additionally indexes every published domain's leaf, group, and category entities, built from the search-index artifacts each domain's own publication pipeline already generates.

**Verified:** 1,038/1,038 expected entities (full census) appear in the generated search asset; wine-side search modules were not modified, only imported alongside. See `reports/search-certification.json`.

## Sitemap completeness

The root `sitemap.xml` previously depended on undocumented merge history and, at the start of this initiative, referenced only 1 of 11 domains. It's now rebuilt deterministically every run from the same published-domain registry driving navigation and search — no merge state, no manual registration. Domain hub pages and `/ingredients/` (which had no sitemap entry at all) are now included via a registry-driven, idempotent block in `sitemaps/site-pages.xml`.

**Verified:** 31/31 expected sitemap-index entries present; all 10 published domains covered; cheese correctly absent; generator output diffed across repeated runs and confirmed byte-identical (timestamps aside). A pre-existing, unrelated legacy script that would corrupt this if run was identified and documented, not silently left as a risk. See `reports/sitemap-certification.json`.

## Relationship provenance

Every relationship rendered on every published leaf page (4,140 checked) was independently verified against each domain's own runtime edge files — not against the label already stamped on the data, against the actual source files. Zero relationships were found without provenance. 1,692 wine-side relationship targets (styles, descriptors, techniques) were separately verified to be real, existing entities — zero unknown targets.

This process also corrected a real error in the two prior audits (AQ-01, AQ-01R): both had flagged `/sauce-condiments/bearnaise/`'s "coconut" relationship as the site's clearest example of unsourced content, because the catalog's denormalized snapshot field for that relationship is empty. It isn't unsourced — the actual runtime edge file has a fully documented, approved editorial relationship with a specific evidence string. The prior audits checked the wrong data layer. That correction is recorded in full in `reports/relationship-provenance.json` and will be reflected in the next audit rerun.

## Publication integrity

A real breadth-first crawl of the live site, starting from `/ingredients/` and `/` and following only hrefs actually present in the HTML, found 51 genuinely orphaned pages — every protein-domain entity marked deprecated in favor of a canonical page elsewhere. Their parent group's own runtime member list is correctly empty (they've migrated), which left the deprecated HTML pages published but linked from nowhere. This is now resolved: all 51 already carried a `canonical_publication_path` in their catalog record, so a registry-driven redirect generator (`lib/food-publication/redirect-registry.js`) produces the missing `_redirects` entries directly from that field. **Orphan count: 51 → 0.**

A knowledge-integrity scan (detection only — publication never edits a catalog) found 213 genuine findings: 204 cheese entities whose `scientific_name` field holds their source milk animal's binomial rather than a valid designation for the cheese itself (the confirmed AQ-01 finding, now measured as a full census), and 9 winter-squash-family vegetables filed under a root-vegetables group despite being botanically fruit-vegetables — generalizing the single chayote example from AQ-01/AQ-01R into a full systemic pattern. Neither was fixed here; both are catalog-layer findings for a future editorial pass, correctly out of scope for a publication-integrity phase.

**Verified:** see `reports/internal-link-certification.json` and `reports/publication-integrity-certification.json`.

## What this process caught in itself

Two real mistakes were found and corrected before being reported, both worth stating plainly rather than hiding:

1. **A false-positive detection rule.** The first version of the scientific-name check flagged 43 protein-domain beef cuts (ribeye, tenderloin, etc.) for carrying `scientific_name: "Bos taurus"` — which is correct, not an error, since a ribeye literally is *Bos taurus* tissue. The rule was rescoped to derived-product domains (cheese) before being reported.
2. **A false-positive provenance rule.** The relationship provenance verifier initially flagged 40 protein-domain wine-pairing edges as unprovenanced because they use `derived_from: "pairing"` rather than `"editorial"`. Every one traced to a real runtime edge — "pairing" is simply protein's own vocabulary for the same canonical source every other domain calls "editorial." The rule was corrected to accept both labels; the vocabulary inconsistency itself is noted for a future documentation pass, not treated as a defect.

Both were caught by verifying against the actual underlying data before writing the finding down, the same discipline this phase applied to catch AQ-01/AQ-01R's bearnaise error in the first place.

## Regression

Verified after every one of the 4 milestones, not just at the end: `git status` diffed against every catalog root (`data/*.json`), `data/runtime/`, `docs/`, `lib/editorial/`, `lib/runtime/`, `lib/publication/`, every `lib/taxonomy-wine-*.js`/`taxonomy-descriptor*.js`/`taxonomy-grape*.js`/`taxonomy-pairing*.js` file, and the entire wine-education content tree (`terms/`, `faults/`, `techniques/`, `serving/`, `regions/`, `styles/`, `grapes/`). Zero changes outside the publication layer at any point across all 4 milestones.

## Platform infrastructure delivered

Eight reusable modules, all registry-driven off `food-domain-config.js`'s `published` flag rather than hardcoded per-domain lists: `NavigationRegistry`, a domain hub generator, the `/ingredients/` directory generator, `SearchRegistry`, `SitemapRegistry`, `RelationshipProvenanceVerifier`, `PublicationIntegrityVerifier` (reachability + knowledge integrity), and `RedirectRegistry`. A future domain that sets `published: true` inherits a working hub page, sitemap coverage, search indexing, relationship-provenance checking, and redirect generation — none of that requires touching any of these eight files again.

## Remaining issues (not in scope for AQ-02B, carried forward)

- 204 cheese `scientific_name` mislabels and 9 vegetable taxonomy-drift findings — catalog-layer, need an editorial pass, not a publication fix.
- The legacy `npm run generate:sitemap` script would corrupt the new sitemapindex if ever run — flagged, not removed (unrelated legacy tooling, out of scope).
- Cheese domain remains unpublished to root — a go-live decision, not an engineering gap; everything needed is staged.
- `seo_description` still isn't wired into the `<meta>` description tag (an AQ-01R Priority 4 item, unaddressed by AQ-02B's scope).

## Overall certification: PASS
