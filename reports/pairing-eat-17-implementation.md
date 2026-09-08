# PAIRING-EAT-17 — Implementation Report

Selective Food-Tail Evidence Research & Qualification. Primary objective:
determine whether selectively researching the highest-value quarantined
relationships materially improves Google AdSense submission readiness —
not to rescue all 873 relationships as an academic exercise.

## 1. Scope

Built a deterministic prioritization model over all 356 quarantined
food-tail entities from real, existing project data; selected a bounded
26-relationship research cohort (24 `pairs_with_style` across 6 entities
× 4 domains, plus 2 `pairs_with_descriptor` edges added specifically for
real name-echo coverage); researched every cohort relationship via live
web search; validated every finding against the EAT-16 provenance
architecture's real exported functions; measured real page-level content
baselines using the exact EAT-05 methodology. The 873 quarantined runtime
relationships, all HTML, the renderer, the pairing engine, the mappers,
and publication wiring are all untouched.

## 2. Prioritization Methodology

Deterministic tier = f(usage_intensity, domain content-opportunity
weight), both drawn from real, existing project data:

- **usage_intensity** — a real catalog field (`primary`/`accent`/`luxury`)
  present on every one of the 356 entities. Weighted 3/2/1.
- **Domain content-opportunity weight** — derived from EAT-05's own
  measured `avgSubstantiveWords` per leaf-page family (live cross-checked
  against `reports/pairing-eat-05-content-quality.json`, check `A03`):
  nut-seed (52) and fruit (54) are the two thinnest → weight 3; legume
  (60) → weight 2; sweet-flavor (67, the least thin, though still
  YELLOW/P2) → weight 1.

`PRIORITY_A` requires both weights at maximum (3+3); `PRIORITY_B` ≥4;
`PRIORITY_C` ≥3; `DEFERRED` otherwise. No fabricated score, no traffic or
popularity data invented — every input is a real field already present
in the repository.

**Live tier distribution (356 entities):** PRIORITY_A 46, PRIORITY_B 251,
PRIORITY_C 56, DEFERRED 3. PRIORITY_A exists only for fruit and nut-seed
(the domain-opportunity weight structurally caps legume and sweet-flavor
below A regardless of usage_intensity) — an honest, non-engineered
consequence of the real EAT-05 numbers, not a target.

## 3. Selected Cohort

26 relationships, deliberately below the 40-relationship target:

| Domain | Entities (relationship → target) |
|---|---|
| fruit | Apple→Chenin Blanc, Avocado→Sauvignon Blanc, Blueberry→Pinot Noir, Grapefruit→Albariño, Fig→Port, Watermelon→Dry Rosé |
| nut-seed | Almond→Chenin Blanc, Chestnut→Nebbiolo, Egusi Seed→Gewürztraminer, Tahini→Sherry, Peanut→Gewürztraminer, Almond Flour→Champagne |
| legume | Fava Bean→Sangiovese, Tofu→Pinot Grigio, Miso→Sherry, Black Gram→Syrah/Shiraz, Chickpea→Dry Rosé, Red Lentil→Gewürztraminer |
| sweet-flavor | Honey→Gewürztraminer, Clover Honey→Moscato, Maple Syrup→Riesling, Natural Cocoa Powder→Pinot Noir, Molasses→Port, Beet Sugar→Prosecco |
| supplemental (descriptor, name-echo coverage) | Cacao Powder→chocolate, Honey→honeyed |

**Cohort-size rationale (why 26, not 40):** every one of the 24
`pairs_with_style` entities was selected from the live-computed
PRIORITY_A tier (fruit, nut-seed) or the top usage_intensity="primary"
PRIORITY_B entities (legume, sweet-flavor — no PRIORITY_A tier exists
structurally for these domains). Critically, **no cohort size changes the
outcome ceiling this phase**: no relationship can reach `evidence_verified`
regardless of how many are researched, because no second reviewer exists
(§17). Given that hard ceiling, the responsible use of research effort was
a moderately-sized, maximally-diversified cohort (6 culinary groups
represented per domain where possible, 6 distinct wine targets per
domain, a deliberate mix of obvious and difficult cases) rather than
mechanically filling a 40-relationship quota. The 2 supplemental
descriptor edges were added because **all 24 style-relationship targets
structurally produce `name_echo_risk=false`** (wine style/grape names
like "Chenin Blanc" essentially never share tokens with food names,
unlike wine descriptor words like "chocolate"/"honeyed") — without this
deliberate addition, the cohort would have zero real name-echo coverage,
violating ticket Step 6's explicit requirement.

Selection preceded research throughout (ticket Step 25): every cohort
entry's `selection_rationale` is recorded in the verifier before any
finding is attached, and 7 of the 26 relationships deliberately reuse
already-known EAT-14/15/16 findings (Avocado, Fava Bean, Chestnut, Almond
Flour, Clover Honey, Red Lentil, Beet Sugar) specifically to test
consistency under this phase's stricter methodology, not to inflate
yield with "easy" results.

## 4. Domain Distribution

6 entities per domain for the 24-entity primary cohort (verified: no
domain exceeds half the cohort; every domain spans ≥2 culinary groups).

## 5. Research Methodology

For each cohort relationship: identified the exact food entity and wine
target from live catalog/ontology data; searched for direct evidence via
WebSearch; classified claim type (5 EAT-15 values), bridge type (6
EAT-15/16 values), source tier (1–4) and type (7 EAT-15 values), source
verification state (honestly `SOURCE_SNIPPET_ONLY` for all 23 real
sources found — no source was independently re-fetched and confirmed
this phase, so none is marked `SOURCE_DIRECTLY_VERIFIED`); computed
`name_echo_risk` via the real `EP.detectNameEcho()`; recorded caveats.
4 relationships (Egusi Seed, Black Gram, Red Lentil, Beet Sugar) returned
no usable source at all — each carries an honest `SOURCE_UNVERIFIED`
placeholder source record (the same pattern EAT-16 established for its
own S08 record) rather than being silently dropped.

## 6. Evidence Results

23 of 26 relationships produced at least one real source; 3 produced
none (Egusi Seed, Black Gram, Beet Sugar — Red Lentil produced a
placeholder too but is counted among the 23 for having *some* recorded
research trail, though its claim_type/status reflect insufficiency).
**Zero relationships reached `evidence_verified`. Zero are
publication-safe.** This is not a limitation of this cohort's research
quality — it is structural: no second reviewer exists this phase, so no
`pairs_with_style` (or any type, under the unified bar) record can ever
reach `evidence_verified` regardless of source strength.

## 7. Claim-Type Distribution

| Claim type | Count |
|---|---|
| EXPLICIT_PAIRING | 6 |
| STRONG_CONTEXTUAL_SUPPORT | 15 |
| INDIRECT_SUPPORT | 2 (both supplemental name-echo cases) |
| COINCIDENTAL_CO_OCCURRENCE | 1 (Beet Sugar) |
| UNSUPPORTED | 2 (Egusi Seed, Black Gram) |

## 8. Bridge-Type Distribution

| Bridge type | Count |
|---|---|
| EXACT_ENTITY | 11 |
| DISH_DERIVED | 6 |
| PREPARATION_DERIVED | 5 |
| CATEGORY_DERIVED | 3 |
| ATTRIBUTE_DERIVED | 1 |

Notably, only 11/26 (42%) are exact-entity — the majority of even the
"contextually supported" findings are bridged through a dish or
preparation, not the raw catalog entity itself, and none of those has a
`documented_bridge_rule`, so none can reach `evidence_verified` on bridge
grounds even where the claim itself is strong.

## 9. Source-Tier Distribution

Tier 1: 1 · Tier 2: 10 · Tier 3: 10 · Tier 4: 2 · null (honest
placeholders, no source found): 4. The fruit domain skewed toward
stronger (Tier 1–2) sources; nut-seed and sweet-flavor relied more on
Tier 3–4 (producer/retailer) sources requiring corroboration scrutiny.

## 10. Verification-State Distribution

SOURCE_SNIPPET_ONLY: 23 · SOURCE_UNVERIFIED (honest placeholders): 4.
Zero SOURCE_DIRECTLY_VERIFIED or SOURCE_ARCHIVED_VERIFIED — this phase
did not perform direct-fetch re-verification (a deliberate, disclosed
scope/effort tradeoff for this pilot cohort, consistent with EAT-15's
own second pilot).

## 11. Contradiction Results

Zero `CONTRADICTION_SIGNAL`, zero `CONTRADICTED` findings in this
cohort. No contradiction was manufactured to demonstrate the mechanism —
that mechanism was already proven with real data in EAT-14 (açaí) and
EAT-15 (coconut, borlotti-bean).

## 12. Name-Echo Results

2 of 26 records show `name_echo_risk=true` (both supplemental descriptor
cases — Cacao Powder→chocolate, Honey→honeyed — live-recomputed via
`EP.detectNameEcho()`, matching EAT-15/16B's established findings). All
24 `pairs_with_style` records correctly show `false`. This confirms
name-echo risk is structurally concentrated in `pairs_with_descriptor`/
`pairs_with_technique` relationships, not `pairs_with_style` — an
important, honestly-reported finding for scoping any future descriptor-
focused research phase.

## 13. Provenance Results

All 26 relationship_evidence_records and 27 source_records (23 real + 4
placeholders) pass live schema and reference validation via the actual
EAT-16 exported functions (`validateRelationshipEvidenceRecordSchema`,
`validateRelationshipEvidenceRecordReferences`, `validateSourceRecord`).
Every `evidence_strength` value is derived (never independently set) via
`computeExpectedEvidenceStrength()`. Records live only in
`reports/pairing-eat-17-research.json` — the existing EAT-16 store
(`data/evidence-provenance/*.json`, 4 records) was not merged into or
modified; it retains exactly its EAT-16-established content (verified
live, check `N06`).

## 14. Reviewer Status

`researcher_id="eat17-cohort-research"` for all 26 records;
`reviewer_id=null` for all 26. No second human/distinct reviewer exists
in this environment this phase — this is stated plainly, not glossed
over, and is the direct reason nothing reaches `evidence_verified`
regardless of research quality.

## 15. AdSense Page-Value Assessment

| Classification | Count | Basis |
|---|---|---|
| HIGH_PAGE_VALUE | 6 | EXPLICIT_PAIRING + EXACT_ENTITY only (Apple, Avocado, Grapefruit, Fig, Watermelon, Fava Bean) |
| MODERATE_PAGE_VALUE | 15 | STRONG_CONTEXTUAL_SUPPORT — real reasoning, but bridged through a dish/preparation/category |
| LOW_PAGE_VALUE | 5 | No usable claim (Egusi Seed, Black Gram, Beet Sugar, and the 2 name-echo cases) |

"Evidence found" is explicitly NOT equated with "AdSense value
improved" (verified live, check `R02`): all 15 STRONG_CONTEXTUAL_SUPPORT
records are capped at MODERATE even though a real source exists for
each, because their reasoning is one step removed from the raw catalog
entity and would require an editorial bridging decision this phase does
not make.

## 16. Page-Level Impact Assessment

Measured live, using the exact EAT-05 substantive-word extraction
methodology, for all 25 unique cohort-entity pages (24 style-cohort
entities + Cacao Powder). Current baseline ranges 52–79 substantive
words per page (consistent with EAT-05's own family-level averages of
52–67). **Zero pages currently contain a "Why These Wines Work" section**
(verified live, check `S03`) — confirming no content was injected and
these are the true current-state baselines. No content was added to any
page this phase; this is a measurement of opportunity, not a delivered
improvement.

## 17. EAT-05 Measurement Comparison

The `eat05_*` functions in this phase's verifier reproduce the exact
methodology (strip tags → extract `<main>` → extract `p/li/dd/dt/h2/h3`
paragraphs ≥20 chars → word count) established in EAT-07A/EAT-13, with
no new word-counting approach invented (verified live, checks `T01`/`T02`).
Measured baselines are consistent with EAT-05's own family-level
averages, cross-validating both measurements independently.

## 18. Research Efficiency

- 26 relationships researched (24 primary cohort + 2 name-echo
  supplements).
- ~19 fresh WebSearch queries performed this phase; 7 relationships
  reused already-known EAT-14/15/16 findings (re-confirmed or
  cross-referenced rather than blindly copied), reducing redundant
  research effort by roughly 27%.
- 23/26 (88%) produced at least one usable source; 3/26 (12%) produced
  none after reasonable searching, and research was correctly halted
  rather than extended indefinitely (per ticket Step 21).
- 6/26 (23%) reached the strongest tier (EXPLICIT_PAIRING + EXACT_ENTITY
  = HIGH_PAGE_VALUE) — a genuinely useful, non-trivial yield, but a
  minority.
- Zero relationships reached `evidence_verified` or publication-eligible
  status. This is not solely a reviewer-assignment problem: every source
  gathered this phase is `SOURCE_SNIPPET_ONLY` or `SOURCE_UNVERIFIED`,
  so direct/archived source verification is an additional, separate gate
  that has not yet been attempted for any record — meaning **research
  yield and publication readiness are currently decoupled** for two
  independent reasons (unverified sources AND no distinct reviewer), a
  fact any future phase must resolve before further research effort
  translates into actual page content.

## 19. Unsupported / Insufficient Relationships

Egusi Seed→Gewürztraminer, Black Gram→Syrah/Shiraz (both UNSUPPORTED,
no source at all), Beet Sugar→Prosecco (COINCIDENTAL_CO_OCCURRENCE,
entity mismatch), Red Lentil→Gewürztraminer (STRONG_CONTEXTUAL_SUPPORT
but no citable source, `evidence_insufficient`). All 4 are honest
negative findings, consistent with prior EAT-14/15 results for 3 of the
4 (independent re-confirmation, not first-time discovery).

## 20. What Should Remain Quarantined

All 26 researched relationships remain quarantined (none reached
`evidence_verified` or publication-safe status) — and by extension all
873 relationships remain quarantined, exactly as before this phase. The
4 UNSUPPORTED/COINCIDENTAL findings above are the strongest candidates
for eventual `deprecated_unsupported` marking in a future phase, though
that determination requires the CONTRADICTED threshold (§11), which none
of these meets (absence of evidence, not counter-evidence).

## 21. What Could Eventually Qualify

**Correction per Director review:** the wording below has been revised
from an earlier draft that overstated how close these 6 relationships
are to publication. The corrected finding is:

Six relationships/entities are the strongest candidates for future
evidence verification and potential publication: Apple, Avocado,
Grapefruit, Fig, Watermelon, and Fava Bean (the 6 records combining
`claim_type: EXPLICIT_PAIRING` with `bridge_type: EXACT_ENTITY`). **They
are not publication-ready yet.** Their current evidence remains
`SOURCE_SNIPPET_ONLY` — none of the 26 sources gathered this phase is
`SOURCE_DIRECTLY_VERIFIED` or `SOURCE_ARCHIVED_VERIFIED` — and they
still require, before any could reach `evidence_verified`:

1. direct or archived source (re-)verification (an actual fetch/confirm
   of the source content, not a search-snippet summary);
2. exact-claim re-confirmation against that verified source text;
3. source sufficiency under the EAT-15 policy (2 independent sources
   preferred; a single source qualifies only under the narrow
   high-quality exception);
4. the applicable independent second-reviewer approval (`reviewer_id`
   distinct from `researcher_id`, per EAT-16 §7);
5. re-confirmation that name-echo/bridge checks remain satisfied; and
6. a final, live `evidence_verified` eligibility recomputation via
   `EP.evaluateEvidenceVerifiedEligibility()`.

These 6 are correctly the strongest, most defensible starting point for
that work — but "strongest candidate" and "publication-ready" are
different claims, and this report must not conflate them.

**The full status pipeline, for clarity:** `research lead` →
`evidence_present` (a source was found and recorded) →
`evidence_verified` (all EAT-15/16 gates pass, including direct/archived
verification and second-reviewer approval) → `publication_safe`
(`isPublicationSafe()` returns true AND publication is actually wired
into the renderer, which it is not this phase). All 26 of this phase's
records currently sit at `evidence_present` or `evidence_insufficient` —
none has advanced past the first arrow.

## 22. Does Selective Research Materially Improve AdSense Readiness?

**Not yet, and not automatically.** This phase demonstrates that
selective research CAN surface genuinely strong, differentiated,
non-generic research leads (6/26 = 23% HIGH_PAGE_VALUE) — a real,
positive signal. But research alone does not move the needle on AdSense
readiness: every one of those leads still sits at `evidence_present`,
not `evidence_verified`, and none is `publication_safe`. Advancing even
the strongest leads requires direct/archived source verification and a
genuine independent second-review workflow — neither of which this phase
performed or was scoped to perform — plus, separately, a future,
authorized phase to wire `isPublicationSafe()` into the renderer and add
real content to pages. EAT-17's output is a decision-support artifact,
not a page-value improvement — consistent with the ticket's own
instruction not to conflate "evidence found" with "AdSense value
improved."

## 23. Recommendation for Next Phase

**Correction per Director review:** the highest-leverage next step is
**not** simply "assign a reviewer" — it is a combined verification-and-
review workflow, since none of the 26 sources gathered this phase has
been directly or archivally verified either. The corrected
recommendation:

The highest-leverage next step is not additional broad research. It is
to directly verify the strongest existing evidence candidates (the 6
EXPLICIT_PAIRING + EXACT_ENTITY records — Apple, Avocado, Grapefruit,
Fig, Watermelon, Fava Bean) and establish the required independent
second-review workflow. Further research should remain paused until this
verification/reviewer bottleneck is resolved.

This is **Director-designated PAIRING-EAT-18 — Selective Evidence
Verification & Human Review**, not a continuation of broad research:

- **Do not** launch another 26- or 40-relationship research cohort. The
  4 UNSUPPORTED/COINCIDENTAL findings from this phase, and the broader
  pattern they represent (niche/`accent`/`luxury`-usage entities in the
  weaker domains), should be deprioritized from any future cohort in any
  case — but that is a secondary point next to the verification/reviewer
  bottleneck.
- **Do** focus the next phase on moving the 6 strongest leads through
  the full pipeline — `research lead` → `evidence_present` (already
  reached) → direct/archived source verification → independent
  second-reviewer approval → `evidence_verified` → (a later, separately
  authorized phase for) `publication_safe` — without inventing a
  reviewer identity to shortcut that chain.
- If the verification/reviewer bottleneck cannot be resolved, further
  food-tail evidence research has low marginal payoff regardless of
  volume (nothing can publish either way), and the Director should
  consider whether the final AdSense readiness audit should proceed on
  the strength of the other closed EAT phases (EAT-01 through EAT-16)
  while food-tail relationship qualification is treated as a longer-term,
  non-blocking enhancement.

**Do not recommend indefinite or broader research.** The structural
verification/reviewer gap means research volume and publication
readiness are currently decoupled; scaling this cohort to 40, 100, or
all 873 would not change that — the bottleneck is downstream of research,
not upstream of it.

## 24. Files Changed

None modified. Three new files created:

- `scripts/verify-pairing-eat-17.mjs` (new verifier, 97 checks)
- `reports/pairing-eat-17-research.json` (new, generated by the verifier)
- `reports/pairing-eat-17-implementation.md` (this file)

`data/evidence-provenance/*.json` (the EAT-16 store) was read but not
modified — confirmed live (check `N06`).

## 25. Git Status

Clean except known pre-existing noise (including EAT-16's own still-
untracked `data/evidence-provenance/` files) plus this phase's 3 new
files. Zero tracked modifications, zero staged files.

## 26. Production Status

Not performed. No commit, push, deploy, or production certification. No
runtime relationship, HTML, engine, mapper, or publication file was
modified (confirmed via 97/97 checks including full byte-identity
verification against HEAD for all protected paths).

## 27. Commit/Push Status

Not performed, per explicit instruction. Awaiting Director review.
