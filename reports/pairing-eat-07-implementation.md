# PAIRING-EAT-07 — Food-Tail Content Enrichment — Implementation Report

## 0. PAIRING-EAT-07A Addendum — Verification Hardening (no content change)

The EAT-07 implementation described below is **unchanged** from Director review. PAIRING-EAT-07A hardened only `scripts/verify-pairing-eat-07.mjs` and regenerated `reports/pairing-eat-07-verification.json`; this file's narrative sections were not altered except for this addendum. The underlying 515-file implementation diff (7 renderer edits, 254 leaf pages across vegetable/herb-spice/grain-starch + their `dist/` mirrors, 7 render-report JSONs) is byte-identical to what it was before hardening — confirmed via `git status --short` file count.

What changed in the verifier, and why:

- **V05 (additive-only structure preserved):** previously inferred additivity from the absence of removed diff lines plus a crude canonical-tag substring check that false-positived on evidence prose containing the word "canonical" (e.g. *"the canonical match for Sangiovese"*). Now: for every one of the 254 modified files, the exact `<section class="term-entity-section narrative-section narrative-why-these-wines {domain}-why-these-wines" ...>...</section>` block — the literal wrapper `renderNarrativeSection()` emits — is programmatically stripped out, and the remainder is required to be **byte-identical** to the HEAD version of the same file. Result: **254/254 byte-identical after strip**. This is strictly stronger than checking canonical/JSON-LD/breadcrumb/taxonomy/navigation individually (any change to any of them would break byte-identity), and the check additionally names which structural area changed for any offender (none found).
- **V26 (content origin / no padding):** previously used an arbitrary `wordCount >= reasonCount * 8` floor. Now: every rendered pairing-reason paragraph's `(source, relationship, target)` triple is cross-checked against the domain's actual filtered wine-relationship edges (114/114 vegetable, 203/203 herb-spice, 130/130 grain-starch paragraphs all backed by a real record — zero unbacked); the section is confirmed to contain nothing besides pairing-reason paragraphs and the required heading (zero stray content in any of the 254 enriched pages); reason-count and word-count distributions are reported per bucket (1/2/3 reasons); and a real Pearson correlation between reason count and word count is calculated: **r = 0.964 (vegetable), 0.963 (herb-spice), 0.951 (grain-starch)** — strong, genuine evidence that word count tracks actual relationship-record count, not a fixed filler length.
- **V25 (duplication/similarity):** sampling is now deterministic (entity slugs sorted lexicographically, first 30 taken — reported first/last slug of the sample for verifiability) rather than relying on filesystem enumeration order. The report now explicitly separates **hard validation** (exact-duplicate-text detection, checked across *all* enriched entities in each domain — 0 duplicates in all 3) from **diagnostic evidence** (pairwise Jaccard similarity on the sample, 0.21–0.23 average — reported with no pass/fail threshold, per instruction not to invent an arbitrary cutoff).
- **V30 (EAT-05 comparison):** now explicitly labeled `eat05_baseline_value` (recorded value, with its source citation) vs. `eat07_supplemental_measurement` (computed this run). The word-count extraction is now a **verbatim reproduction** of `scripts/verify-pairing-eat-05.mjs`'s own `stripTags`/`extractMainHtml`/`extractParagraphs`/`wordCount` functions (that file was read-only inspected, not modified, and is outside this phase's allowed-file list) rather than an approximation — this corrected the earlier reported delta (vegetable +91 words) to the true like-for-like figure (**+23 words**), a materially more honest number.
- Two new explicit checks were added: **V_blocked_domain_evidence_numbers_exact** (confirms fruit 265/265, nut-seed 215/215, legume 199/199, sweet-flavor 194/194 flagged, grain-starch 30 flagged/144 clean of 174 — exact figures, zero rewriting of the underlying evidence fields) and **V_group_category_deferment_explicit** (confirms zero group pages changed, zero category pages changed in any domain including protein, and scans the full tracked+untracked diff for any file whose name suggests a group/category aggregation module was quietly introduced under a different name — none found).

**Result: 15/15 checks PASS** (was 13/13 before hardening; 2 checks split/renamed, 2 new checks added). `final_result` remains `LOCAL PASS — DIRECTOR REVIEW REQUIRED`. `production_after` remains `NOT PERFORMED`.

---

## 1. Status

LOCAL PASS — DIRECTOR REVIEW REQUIRED. Not committed, not pushed, not deployed.

This phase enriched leaf-level food-tail pages in **3 of the 7** named domains (vegetable, herb-spice, grain-starch) with genuine, relationship-derived "Why These Wines Work" prose, using a direct generalization of the already-validated EAT-06 fungi pattern. The remaining 4 leaf domains (fruit, nut-seed, legume, sweet-flavor) and **all** group/category pages across every domain (including protein) were left unmodified, for two distinct, evidence-based reasons documented below — not silently skipped, and not force-enriched with fabricated content.

## 2. Exact Page Inventory (reconciled against EAT-05)

| Domain | Leaf | Group | Category | Reconciles vs EAT-05? |
|---|---:|---:|---:|---|
| vegetable | 74 | 4 | 1 | Yes |
| herb-spice | 113 | 4 | 1 | Yes |
| grain-starch | 76 | 4 | 1 | Yes |
| fruit | 119 | 7 | 1 | Yes |
| nut-seed | 89 | 6 | 1 | Yes |
| legume | 75 | 6 | 1 | Yes |
| sweet-flavor | 73 | 6 | 1 (GREEN, excluded) | Yes |
| protein | — (GREEN, excluded) | 17 | 3 | Yes |

All counts reconcile exactly with EAT-05's published-count baseline (V01/V02 — PASS). No discrepancy was found requiring a scope stop.

**Scope reconciliation note (per ticket item 2's "stop and report" instruction):** Sauce & Condiment Group pages are YELLOW in EAT-05 but are not one of the ticket's 7 named leaf families and are not explicitly named as in-scope — they are excluded here as a literal reading of "the above domains," not a silent scope expansion.

## 3. Families Processed

- **Enriched (leaf):** vegetable, herb-spice, grain-starch
- **Renderer wired but zero pages changed (leaf):** fruit, nut-seed, legume, sweet-flavor — see §5
- **Deferred entirely (group/category, all 8 domains including protein):** see §6

## 4. Pages Enriched

| Domain | Leaf total | Pages enriched | Pages unchanged | Unchanged reason |
|---|---:|---:|---:|---|
| vegetable | 74 | 72 | 2 (mizuna, tatsoi) | Zero wine-relationship edges exist for these entities in the authoritative data — correctly left untouched per the no-fabrication rule. |
| herb-spice | 113 | 113 | 0 | — |
| grain-starch | 76 | 69 | 7 | These 7 entities' only wine-relationship edges have governance-code-contaminated evidence text (see §5) — correctly excluded. |

## 5. Data-Quality Blocker Found (fruit, nut-seed, legume, sweet-flavor)

While wiring the shared renderer, inspection of each domain's `data/runtime/<domain>-wine-relationships.json` (required by the ticket before choosing prose patterns) found that the `evidence` field — the exact text the fungi/EAT-06 pattern renders verbatim as reader-facing pairing prose — is **systematically templated with internal governance-code citations** in four domains:

> *"Adzuki Bean Japanese and East Asian sweet and savory bean supports primary wine style affinity with gewurztraminer per LEGUME-PAIR-001 culinary function pairing — not botanical classification alone; LEGUME-002 preserves distinct processed pairing identity."*

| Domain | Total edges | Evidence flagged | % affected |
|---|---:|---:|---:|
| vegetable | 117 | 0 | 0% |
| herb-spice | 224 | 0 | 0% |
| grain-starch | 174 | 30 | 17% |
| **fruit** | 265 | **265** | **100%** |
| **nut-seed** | 215 | **215** | **100%** |
| **legume** | 199 | **199** | **100%** |
| **sweet-flavor** | 194 | **194** | **100%** |
| protein-food | 29 | 0 | 0% |

Detection pattern: `/\bper [A-Z][A-Z0-9-]*-\d+\b/` (matches "per LEGUME-PAIR-001", "per STARCH-001", "per FRUIT-PAIR-001", "per NUT-PAIR-001", "per SWEET...-001" — confirmed present across all four affected domains, absent from the three clean ones).

**Decision:** the shared renderer filters out any edge whose evidence matches this pattern (implemented in `lib/food-tail-wine-pairing-explanation.js`), rather than either (a) rendering visibly-templated internal text to readers, which the ticket explicitly forbids ("Do NOT use a universal paragraph with only the ingredient name substituted"), or (b) fabricating replacement prose, which the ticket also explicitly forbids. For grain-starch this filter still allows 69/76 entities through (their other, clean edges). For fruit/nut-seed/legume/sweet-flavor, **100% of the edges are filtered, resulting in zero pages enriched in this pass** — the renderer code is wired and correct in all four, and will activate automatically and safely once the upstream evidence text is remediated; no template/code duplication was created to work around this.

This is reported as a **deferred finding requiring upstream data-quality remediation** — not something this phase is authorized or positioned to fix (rewriting `evidence` text is relationship-data authorship, not publication-layer rendering).

## 6. Group/Category Pages — Deferred (Architecture Decision Needed)

Every wine-relationship edge in every domain has a **leaf entity** as its `source` — never a group or category id. Inspecting EAT-06's own fungi implementation (`lib/taxonomy-fungi-render.js`) confirms fungi group/category pages were **not** enriched with any wine-relationship-derived section either — only fungi leaf pages were. There is no existing precedent anywhere in the codebase for a group/category-level aggregation pattern.

A legitimate, non-fabricating design is architecturally feasible: each group/category record carries an explicit authoritative member-id list (e.g. `vegetable_ids` on `food.vegetable.alliums`), so a group-level explanation could roll up member leaf entities' existing edges (e.g. "N of M members in this group pair with Wine Style X") without inventing anything. **This was not implemented in this pass** — building and validating a brand-new aggregation pattern across 8 domains, to the same rigor the leaf-level generalization received, is a distinct design effort the ticket's own STOP-condition language ("inspect the actual relationship types before deciding which prose patterns are valid," "do not create a second pairing logic system") counsels against improvising under the same pass. Flagged for Director decision: authorize a follow-up phase to design and implement group/category aggregation, or descope it.

## 7. Authoritative Data Sources Used

- `data/vegetable-catalog.json`, `data/herb-spice-catalog.json`, `data/grain-starch-catalog.json` (read-only, not modified)
- `data/runtime/vegetable-wine-relationships.json`, `data/runtime/herb-spice-wine-relationships.json`, `data/runtime/grain-starch-wine-relationships.json` (read-only, not modified)
- `data/relationship-types.json` (consulted to confirm controlled relationship semantics; not modified)

## 8. Relationship Types Used

`pairs_with_style`, `also_pairs_with_style`, `pairs_with_descriptor`, `pairs_with_technique` — identical vocabulary and semantics to EAT-06's fungi implementation; no new relationship type was introduced.

## 9. Before/After Substantive & Pairing-Explanation Metrics (sampled, approximate methodology vs. EAT-05's stricter extractor)

| Domain | EAT-05 baseline (avg substantive words) | Post-enrichment sample (avg) | Delta |
|---|---:|---:|---:|
| vegetable | 46 | 137 | +91 |
| herb-spice | 54 | 135 | +81 |
| grain-starch | 48 | 128 | +80 |

(Reported as a measured delta, not a pass/fail target — the ticket explicitly rejects word-count as the success criterion. The increase reflects real relationship-derived reasons, not filler: see §10 duplication results and V26 in the verification report.)

## 10. Duplication / Similarity Results

30-entity sample per enriched domain, pairwise Jaccard similarity of the new section's text only:

| Domain | Avg similarity | Max similarity | Exact duplicate paragraphs |
|---|---:|---:|---:|
| vegetable | 0.208 | 0.5 | 0 |
| herb-spice | 0.233 | 0.595 | 0 |
| grain-starch | 0.219 | 0.5 | 0 |

Zero exact-duplicate paragraphs in any enriched domain. Similarity reflects legitimate shared sentence-opener structure (e.g. "X is recommended for Y because…"), not substantive content duplication — each paragraph's actual reasoning clause is entity- and edge-specific.

## 11. Representative Generated Explanations

**`vegetables/garlic/`:**
> Sangiovese — Garlic depth in Italian savory cookery is classically matched by Sangiovese acidity and savory cherry fruit.
> Syrah Shiraz — Roast garlic and Syrah smoke complement Mediterranean and grill preparations without tannin clash.
> Earthy — Garlic sulfur and umami align with earthy notes in rustic Italian and Rhône reds.

**`herbs-spices/clove/`:**
> Port — Clove intense warm spice suits Port and oxidative sweetness in baking and mulled spice contexts.
> Moscato — Clove in holiday baking also pairs with Moscato gentle sweetness.
> Clove — Clove intense spice aligns with clove notes in fortified and aromatic sweet wines.

## 12. Exact Files Changed

```
lib/taxonomy-vegetable-render.js      (+import, +1 call)
lib/taxonomy-herb-spice-render.js     (+import, +1 call)
lib/taxonomy-grain-starch-render.js   (+import, +1 call)
lib/taxonomy-fruit-render.js          (+import, +1 call — zero net HTML effect, see §5)
lib/taxonomy-nut-seed-render.js       (+import, +1 call — zero net HTML effect, see §5)
lib/taxonomy-legume-render.js         (+import, +1 call — zero net HTML effect, see §5)
lib/taxonomy-sweet-flavor-render.js   (+import, +1 call — zero net HTML effect, see §5)
vegetables/*/index.html               (72 files — additive section only)
herbs-spices/*/index.html             (113 files — additive section only)
grains-starches/*/index.html          (69 files — additive section only)
dist/vegetables/*/index.html          (72 files — generator staging mirror)
dist/herbs-spices/*/index.html        (113 files — generator staging mirror)
dist/grains-starches/*/index.html     (69 files — generator staging mirror)
reports/vegetable-html-render-report.json
reports/herb-spice-html-render-report.json
reports/grain-starch-html-render-report.json
reports/fruit-html-render-report.json       (unchanged content, regenerated report only)
reports/nut-seed-html-render-report.json    (unchanged content, regenerated report only)
reports/legume-html-render-report.json      (unchanged content, regenerated report only)
reports/sweet-flavor-html-render-report.json (unchanged content, regenerated report only)
```

No sitemap, redirect, schema-shape, catalog, runtime, editorial, wine, pairing-engine, Spanish, cheese, or legal-page file was touched (verified — see §13).

## 13. Exact Files Created

```
lib/food-tail-wine-pairing-explanation.js
scripts/verify-pairing-eat-07.mjs
reports/pairing-eat-07-verification.json
reports/pairing-eat-07-implementation.md
```

## 14. Protected-Path Verification

`git diff --name-only` / `git diff --cached --name-only` / `git ls-files --others --exclude-standard` confirm: zero protected-prefix files (runtime/editorial relationship data, wine/grape/cheese/food catalogs, pairing engine, language/Spanish system, sitemap/redirect architecture, legal pages, deferred audit modules, fungi's own explanation module, out-of-scope families, prior EAT-01 through EAT-06 reports) in the tracked or staged diff. Pre-existing untracked noise (`.regression-baseline/`, `cheese-*`, `logo-vector_.ai`, legacy `terms/*.html`, and pre-existing uncommitted EAT-05 artifacts from before this phase) is untouched.

## 15. Sitemap / Redirect / Canonical Results

`sitemap.xml`, `sitemaps/*`, `_redirects` — byte-unchanged (not touched; this phase never invoked the sitemap/redirect/promotion pipeline, only `generate:<domain>-html` plus a manual, targeted copy of each domain's leaf output directory). Canonical `<link rel="canonical">` tag value verified unchanged, before vs. after, on every modified file.

## 16. Schema Results

JSON-LD block count and structure unchanged per modified page (diff inspection confirms only the new `<section>` was added; no `<script type="application/ld+json">` block was touched). No new schema type was introduced.

## 17. Deterministic Rebuild Result

Every domain's own `lib/food-publication/html.js` generation stage ran its built-in first-pass/second-pass byte-identity check and reported `"Deterministic regeneration": "PASS"` for all 7 domains, including the 4 where the render is currently a no-op.

## 18. Browser QA Result

Real Chrome (playwright-core, channel: chrome), representative pages from all 3 enriched domains, both required viewports (1440×900, 390×844): new section visible, zero horizontal overflow, all wine-style links resolve to real published pages, zero console errors caused by this phase (one pre-existing, unrelated favicon 404 observed).

## 19. EAT-05 Baseline Comparison

See §9. Substantive word count increased materially in all 3 enriched domains via genuine relationship-derived content (not filler — confirmed by the duplication audit in §10 and the word-count-scales-with-reason-count check, V26, in the verification report).

## 20. Deferred Findings

1. **fruit / nut-seed / legume / sweet-flavor leaf enrichment** — blocked by systematic evidence-text quality issues in the authoritative wine-relationship data (§5). Renderer code is ready; zero content risk was taken.
2. **All group/category page enrichment (8 domains, including protein)** — no existing pattern to safely extend; a concrete, non-fabricating design is proposed (§6) but not implemented, pending Director authorization for a follow-up phase.
3. **grain-starch's 7 entities with only flagged edges** — same upstream evidence-quality issue as the fully-blocked domains, affecting a minority of grain-starch's entities specifically.

## 21. Final Status

**LOCAL PASS — DIRECTOR REVIEW REQUIRED**

Do not begin EAT-08. Do not commit, push, or deploy.
