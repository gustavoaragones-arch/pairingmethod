# PAIRING-EAT-02 — P0 Remediation

## 1. Status

**BLOCKED**

Local implementation and deterministic verification pass. Production still serves the pre-remediation release, so the phase cannot pass until deployment and a fresh 51-URL census succeed.

## 2. Scope

Only the two accepted PAIRING-EAT-01 P0 findings were changed: removal of 15 dead “View Bottle” controls and completion of the 51 governed Protein redirects/sitemap exclusions.

## 3. P0-01 — View Bottle Remediation

### Affected Pages

- `wine-with-steak.html`
- `wine-with-chicken.html`
- `wine-with-salmon.html`
- `wine-for-bbq-ribs.html`
- `wine-for-thanksgiving-turkey.html`

### Before

Each page contained three `<a href="#" class="cta">View Bottle</a>` controls: 15 total. Repository searches found no production-ready bottle, retailer, product, or affiliate destination architecture.

### Remediation

Removed only the 15 nonfunctional anchors. Recommendation headings, style/region names, descriptions, cards, canonical tags, schema, and surrounding copy remain unchanged. No replacement URLs or commerce infrastructure were added.

### After

Local affected pages contain zero “View Bottle” text, zero dead bottle anchors, and zero empty CTA/button shells. Production currently retains 15 dead controls because this change has not been deployed.

### Verification

- Local deterministic HTML verification: 5/5 PASS.
- Local dead controls: 0/15.
- Production affected pages passing: 0/5.
- Production dead controls: 15/15.

## 4. P0-02 — Protein Migration Remediation

### Migration Source

`data/protein-migration-map.json` remains authoritative. It contains 51 migration records, all with `redirect_required: true`, exact legacy paths, and governed canonical targets.

### Redirect Implementation

`lib/food-publication/redirect-registry.js` now reads Protein redirects from the migration map and emits exact 301 rules for both the trailing-slash publication URL and its non-trailing-slash form. The governed block contains 102 exact rules for 51 migrations; no wildcard or namespace-wide redirect was added.

### Sitemap Implementation

`lib/food-publication/sitemap.js` excludes only Protein leaf slugs listed as `redirect_required` in the migration map. Both generated and deploy-tree Protein leaf sitemaps were regenerated. Legacy HTML artifacts were retained because the redirect layer owns compatibility; they are no longer advertised by the sitemap and will not serve as normal pages after deployment.

### Before/After Census

- Production sitemap URLs: 1,492 before; expected 1,441 after deployment of the 51 removals.
- Repository child-sitemap URLs (including unpublished cheese artifacts): 1,706 before; 1655 after locally.
- Protein leaf sitemap URLs: 210 before; 159 after locally.
- Redirect-required Protein sitemap URLs: 51 before; 0 after locally.
- Unrelated sitemap URL families changed: 0.

## 5. Complete 51-URL Redirect Verification

Production results are shown below. Local configuration/canonical verification is 51/51 PASS, but production remains on the prior release.

| # | Legacy URL | Target URL | Status | Location | Final Status | Hops | Sitemap Source Present | Result |
|---:|---|---|---:|---|---:|---:|---|---|
| 1 | `/foods/amaranth/` | `/grains-starches/amaranth/` | 200 | — | 200 | 0 | YES | FAIL |
| 2 | `/foods/barley/` | `/grains-starches/barley/` | 200 | — | 200 | 0 | YES | FAIL |
| 3 | `/foods/buckwheat/` | `/grains-starches/buckwheat/` | 200 | — | 200 | 0 | YES | FAIL |
| 4 | `/foods/farro/` | `/grains-starches/farro/` | 200 | — | 200 | 0 | YES | FAIL |
| 5 | `/foods/oats/` | `/grains-starches/oats/` | 200 | — | 200 | 0 | YES | FAIL |
| 6 | `/foods/quinoa/` | `/grains-starches/quinoa/` | 200 | — | 200 | 0 | YES | FAIL |
| 7 | `/foods/black-beans/` | `/legumes/black-bean/` | 200 | — | 200 | 0 | YES | FAIL |
| 8 | `/foods/black-lentils/` | `/legumes/black-lentil/` | 200 | — | 200 | 0 | YES | FAIL |
| 9 | `/foods/cannellini-beans/` | `/legumes/cannellini-bean/` | 200 | — | 200 | 0 | YES | FAIL |
| 10 | `/foods/chickpeas/` | `/legumes/chickpea/` | 200 | — | 200 | 0 | YES | FAIL |
| 11 | `/foods/green-lentils/` | `/legumes/green-lentil/` | 200 | — | 200 | 0 | YES | FAIL |
| 12 | `/foods/kidney-beans/` | `/legumes/kidney-bean/` | 200 | — | 200 | 0 | YES | FAIL |
| 13 | `/foods/lentils/` | `/legumes/green-lentil/` | 200 | — | 200 | 0 | YES | FAIL |
| 14 | `/foods/lima-beans/` | `/legumes/lima-bean/` | 200 | — | 200 | 0 | YES | FAIL |
| 15 | `/foods/navy-beans/` | `/legumes/navy-bean/` | 200 | — | 200 | 0 | YES | FAIL |
| 16 | `/foods/peas/` | `/legumes/green-pea/` | 200 | — | 200 | 0 | YES | FAIL |
| 17 | `/foods/pinto-beans/` | `/legumes/pinto-bean/` | 200 | — | 200 | 0 | YES | FAIL |
| 18 | `/foods/red-lentils/` | `/legumes/red-lentil/` | 200 | — | 200 | 0 | YES | FAIL |
| 19 | `/foods/button-mushroom/` | `/fungi/button-mushroom/` | 200 | — | 200 | 0 | YES | FAIL |
| 20 | `/foods/chanterelle/` | `/fungi/chanterelle/` | 200 | — | 200 | 0 | YES | FAIL |
| 21 | `/foods/cremini/` | `/fungi/cremini/` | 200 | — | 200 | 0 | YES | FAIL |
| 22 | `/foods/enoki/` | `/fungi/enoki/` | 200 | — | 200 | 0 | YES | FAIL |
| 23 | `/foods/king-oyster/` | `/fungi/king-oyster/` | 200 | — | 200 | 0 | YES | FAIL |
| 24 | `/foods/lions-mane/` | `/fungi/lions-mane/` | 200 | — | 200 | 0 | YES | FAIL |
| 25 | `/foods/maitake/` | `/fungi/maitake/` | 200 | — | 200 | 0 | YES | FAIL |
| 26 | `/foods/morel/` | `/fungi/morel/` | 200 | — | 200 | 0 | YES | FAIL |
| 27 | `/foods/oyster-mushroom/` | `/fungi/oyster-mushroom/` | 200 | — | 200 | 0 | YES | FAIL |
| 28 | `/foods/porcini/` | `/fungi/porcini/` | 200 | — | 200 | 0 | YES | FAIL |
| 29 | `/foods/portobello/` | `/fungi/portobello/` | 200 | — | 200 | 0 | YES | FAIL |
| 30 | `/foods/shiitake/` | `/fungi/shiitake/` | 200 | — | 200 | 0 | YES | FAIL |
| 31 | `/foods/almonds/` | `/nut-seeds/almond/` | 200 | — | 200 | 0 | YES | FAIL |
| 32 | `/foods/cashews/` | `/nut-seeds/cashew/` | 200 | — | 200 | 0 | YES | FAIL |
| 33 | `/foods/chia-seeds/` | `/nut-seeds/chia-seed/` | 200 | — | 200 | 0 | YES | FAIL |
| 34 | `/foods/flaxseed/` | `/nut-seeds/flaxseed/` | 200 | — | 200 | 0 | YES | FAIL |
| 35 | `/foods/hemp-seeds/` | `/nut-seeds/hemp-seed/` | 200 | — | 200 | 0 | YES | FAIL |
| 36 | `/foods/peanuts/` | `/nut-seeds/peanut/` | 200 | — | 200 | 0 | YES | FAIL |
| 37 | `/foods/pine-nuts/` | `/nut-seeds/pine-nut/` | 200 | — | 200 | 0 | YES | FAIL |
| 38 | `/foods/pistachios/` | `/nut-seeds/pistachio/` | 200 | — | 200 | 0 | YES | FAIL |
| 39 | `/foods/pumpkin-seeds/` | `/nut-seeds/pumpkin-seed/` | 200 | — | 200 | 0 | YES | FAIL |
| 40 | `/foods/sesame-seeds/` | `/nut-seeds/sesame/` | 200 | — | 200 | 0 | YES | FAIL |
| 41 | `/foods/sunflower-seeds/` | `/nut-seeds/sunflower-seed/` | 200 | — | 200 | 0 | YES | FAIL |
| 42 | `/foods/walnuts/` | `/nut-seeds/walnut/` | 200 | — | 200 | 0 | YES | FAIL |
| 43 | `/foods/edamame/` | `/legumes/soybean/` | 200 | — | 200 | 0 | YES | FAIL |
| 44 | `/foods/miso/` | `/legumes/miso/` | 200 | — | 200 | 0 | YES | FAIL |
| 45 | `/foods/natto/` | `/legumes/natto/` | 200 | — | 200 | 0 | YES | FAIL |
| 46 | `/foods/silken-tofu/` | `/legumes/tofu/` | 200 | — | 200 | 0 | YES | FAIL |
| 47 | `/foods/soy-curls/` | `/legumes/soy-curls/` | 200 | — | 200 | 0 | YES | FAIL |
| 48 | `/foods/soybeans/` | `/legumes/soybean/` | 200 | — | 200 | 0 | YES | FAIL |
| 49 | `/foods/tempeh/` | `/legumes/tempeh/` | 200 | — | 200 | 0 | YES | FAIL |
| 50 | `/foods/textured-vegetable-protein/` | `/legumes/textured-vegetable-protein/` | 200 | — | 200 | 0 | YES | FAIL |
| 51 | `/foods/tofu-firm/` | `/legumes/tofu/` | 200 | — | 200 | 0 | YES | FAIL |

## 6. Canonical Target Verification

- Local target files present: 51/51.
- Local targets self-canonicalize: 51/51.
- Local targets are indexable and present in intended publication sitemaps: 51/51.
- Production target HTTP/canonical PASS: 51/51.
- No target is itself a migration source.

## 7. Sitemap Verification

- Root Protein leaf sitemap valid generation: PASS.
- Deploy-tree Protein leaf sitemap valid generation: PASS.
- Local source removals: 51/51.
- Production source removals: 0/51.
- Local Protein count changed only by the 51 governed removals: 210 → 159.

## 8. Production Verification

- Verified: 51/51.
- Redirect PASS: 0/51.
- Sitemap sources removed: 0/51.
- Canonical targets PASS: 51/51.
- Redirect loops: 0.
- Homepage fallbacks: 0.
- Unexpected source HTTP 200 responses: 51.

**Production result: BLOCKED — corrected files are not deployed.**

## 9. Regression Tests

`scripts/verify-pairing-eat-02.mjs` verifies:

- exactly 51 migration records and 51 `redirect_required` entries;
- exact slash and non-slash redirect rules and targets;
- no target is a migration source and no configured loop;
- zero migration sources in root or deploy-tree Protein sitemaps;
- separate Protein deployment gates of 230 HTML artifacts and 179 sitemap URLs;
- all canonical targets exist, self-canonicalize, remain indexable, and remain sitemapped;
- zero dead bottle controls across all five affected pages;
- complete production status, Location, hop, final status, canonical, and sitemap census.

Local verifier result: **PASS**.

## 10. SEO / Schema Safety

The five affected canonical URLs are unchanged. Canonical target identity, robots metadata, JSON-LD, entity IDs, relationship data, pairing logic, and schema vocabulary were not modified. Only redirect publication behavior and Protein sitemap inclusion changed.

## 11. Visual QA

All five pages were rendered locally at 1440×900 and 390×844. Each retained three coherent recommendation cards, had no empty controls, and produced no horizontal overflow. Desktop and mobile inspection found no spacing artifact from anchor removal. No remediation-attributable browser error was observed.

## 12. Repository Diff

Expected tracked changes are limited to:

- five affected pairing HTML pages;
- `_redirects`;
- `lib/food-publication/redirect-registry.js`;
- `lib/food-publication/sitemap.js`;
- `lib/deployment-config.js`;
- `lib/food-publication/deploy.js`;
- `sitemaps/protein-food-pages.xml`;
- `dist/sitemaps/protein-food-pages.xml`.

Audit artifacts created:

- `scripts/verify-pairing-eat-02.mjs`;
- `reports/pairing-eat-02-verification.json`;
- `reports/pairing-eat-02-remediation.md`.

`git diff --check`: PASS. No protected ontology, runtime, editorial, wine-relationship, pairing-engine, Spanish, legal, schema, or advertising paths changed.

## 13. Pre-existing Untracked Files

The pre-existing `.regression-baseline/`, cheese directories, `logo-vector_.ai`, selected legacy `terms/*.html`, and `reports/pairing-eat-01-audit.md` were not modified or staged.

## 14. Explicit Non-Changes

No P1/P2/P3 remediation, 404/contact/ads.txt/Spanish/FAQ/authorship/citation/legal work, ontology/runtime/editorial/wine relationship changes, pairing scoring changes, UI redesign, AdSense/affiliate activation, commit, push, or deployment was performed.

## 15. Remaining P1/P2/P3 Findings

Deferred exactly as accepted in PAIRING-EAT-01:

- P1: unknown-route HTTP behavior; homepage FAQPage visibility; assessable human responsibility/expertise; lowest-depth programmatic review; percentage-score explanation.
- P2: sourcing/evidence policy; legal/privacy alignment; suite/publication-scope documentation; post-approval ad activation requirements.
- P3: contact/correction discoverability; trust-page/error-page polish.

## 16. Final Assessment

**BLOCKED**

The repository implementation passes locally, but production does not yet contain it. Under the Director’s criteria, production verification is mandatory; therefore PAIRING-EAT-02 remains BLOCKED pending deployment and rerun.
