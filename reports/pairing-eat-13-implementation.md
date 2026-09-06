# PAIRING-EAT-13 — Implementation Report

Food-Tail Relationship Evidence Remediation. A data-integrity phase, not a
page-enrichment phase.

## 1. Scope

Investigate exactly why the wine-relationship datasets for fruit,
nut-seed, legume, and sweet-flavor (356 leaf entities, 873 edges, 100%
contaminated per EAT-12) contain governance-code boilerplate in their
`evidence` fields; determine, edge by edge, whether the underlying
relationship (source, relationship type, target) is independently
supportable from existing authoritative project data; remediate only what
can be honestly and non-fabricatedly cleaned. No HTML, catalog identity,
pairing engine, scoring, ranking, or prior-phase deliverable was touched.
This phase does not attempt another page-copy enrichment pass and does not
bypass EAT-07's or EAT-12's blocking decisions — it investigates the layer
beneath them.

## 2. Root Cause

**The contamination is enforced by code, not accidental.** Each of the
four mapping scripts —
[`scripts/map-fruit-wine-relationships-09e.mjs`](scripts/map-fruit-wine-relationships-09e.mjs),
[`scripts/map-nut-seed-wine-relationships-10e.mjs`](scripts/map-nut-seed-wine-relationships-10e.mjs),
[`scripts/map-legume-wine-relationships-11e.mjs`](scripts/map-legume-wine-relationships-11e.mjs),
[`scripts/map-sweet-flavor-wine-relationships-12e.mjs`](scripts/map-sweet-flavor-wine-relationships-12e.mjs)
— contains a validator function
(`validateFruitPair001Rule` / `validateNutPair001Rule` /
`validateLegumePair001Rule` / `validateSweetPair001Rule`) that **hard-requires
every seed entry's `evidence` string to literally contain the domain's
governance-rule code** (e.g. `scripts/map-fruit-wine-relationships-09e.mjs:169`:
`if (!evidence.includes("fruit-pair-001")) errors.push(...)`), with **no
alternative escape valve**. If a seed entry's evidence text doesn't cite
the code, `mapXWineRelationships()` throws before any edge is ever built.

This is a genuine conflation of two distinct things:

- **FRUIT-PAIR-001 / NUT-PAIR-001 / LEGUME-PAIR-001 / SWEET-PAIR-001 are
  real, pre-existing, ratified internal methodology rules**, documented in
  `docs/FOOD_ONTOLOGY_SUITE_RELEASES.md` (e.g. "Wine recommendations for
  fruit ingredients must follow the fruit's culinary role as an
  ingredient, not simply its botanical origin or sweetness"). They are
  legitimate editorial-process guidelines governing *how* an author should
  choose a pairing.
- **The validator turned "cite this rule's code" into a substitute for
  reader-facing evidentiary text.** Compliance with an internal authoring
  methodology is not the same as evidence a reader can trust — but the
  validator makes the rule's code name the *only* accepted "evidence,"
  so every seed author who wanted to pass validation had no path except
  to embed it literally.

**Confirmed by direct contrast within this same repository:**

| Domain | Validator behavior | Result |
|---|---|---|
| vegetable | No evidence-citation-mandating validator exists at all | 0% contaminated |
| herb-spice | Has a distinctness rule (BOTAN-001) but it checks structural uniqueness, not evidence-text citation | 0% contaminated |
| grain-starch | `validateStarchFunctionalRule` accepts **either** the governance-code citation **or** genuine functional/descriptive terms (thickening, binder, neutral, etc.) | 30/174 (17%) contaminated |
| fruit / nut-seed / legume / sweet-flavor | Validator **mandates** the literal citation with **no alternative** | 873/873 (100%) contaminated |

This confirms the root cause is precisely localized: the four target
domains' validators are stricter (offer no escape valve) than
grain-starch's equivalent, and vegetable/herb-spice never adopted the
pattern at all.

**Safe remediation available this phase: none.** Even knowing the
methodology ("pair by culinary role, not botanical origin") does not tell
us *why* a specific entity (e.g. apricot) was assigned a specific wine
style (e.g. gewürztraminer) rather than any other plausible aromatic
white — that per-edge judgment call has no independent corroborating
record anywhere in this repository (see §5). Cleaning the evidence text
by simply deleting "per FRUIT-PAIR-001" without independent support would
create the false appearance of authoritative evidence — exactly what this
phase must not do.

**Recommendation, not performed this phase:** a future, separately
authorized phase could relax the four validators to accept genuine
descriptive language as an alternative to the citation (mirroring
grain-starch), giving future seed authoring a non-contaminating path.
This alone would not make any of the existing 873 edges publishable — it
only prevents recurrence. Modifying the validators without also being
able to supply independently-verifiable replacement evidence for their
existing entries would not remediate any data, so it was judged outside
this phase's "smallest safe change" boundary.

## 3. Dependency Chain

Identical shape across all 4 domains:

```
catalog (data/{domain}-catalog.json)
  → seed (scripts/{domain}-wine-seed-{09e,10e,11e,12e}.js — PAIRING_CURATED array)
  → mapper (scripts/map-{domain}-wine-relationships-{09e,10e,11e,12e}.mjs — validates + writes)
  → runtime relationship JSON (data/runtime/{domain}-wine-relationships.json)
  → renderer (lib/food-tail-wine-pairing-explanation.js — shared, domain-parameterized, unmodified)
  → published HTML (never reached for these 4 domains — renderer filters 100% of edges as unsuitable)
```

## 4. Full 873-Edge Audit

Every edge across all 4 domains was audited and classified. Per-edge
records (domain, source id + display name, relationship type, target id +
display name, current evidence, contamination marker, provenance fields,
source file, source generator, structural-validity flags, independent
corroboration check result, classification, classification reason) are in
`reports/pairing-eat-13-relationship-audit.json`'s `per_edge_classification`
array (873 entries).

| Domain | Edges audited |
|---|---|
| fruit | 265 |
| nut-seed | 215 |
| legume | 199 |
| sweet-flavor | 194 |
| **Total** | **873** |

Structural integrity (recomputed live, not assumed): every edge's
`source` resolves to a real leaf entity in the current catalog; every
edge's `target` resolves to a real wine style/descriptor/technique in the
current, live-loaded wine ontology; no relationship type falls outside
the 4 allowed types; no target is a governance-code string masquerading
as a real wine entity; no self-reference edges. **0 structural errors
found across all 873 edges.**

## 5. Evidence/Provenance Findings

Three sources were checked for independent, non-circular provenance:

1. **`data/relationship-evidence.json`** (ONTOLOGY-01E) — read-only
   inspected. Scoped entirely to internal wine-ontology relationships
   (e.g. wine-style → recommended glass, wine-style → produced-in
   region). **Zero coverage of food-tail pairing edges.** Confirmed out
   of scope and not repurposed, per the ticket's explicit instruction.
2. **The 4 domains' own catalogs' structured descriptor fields**
   (`flavor_profile`, `aroma_profile`, `related_descriptors`,
   `commonly_served_with`, `common_preparations`) — checked live across
   all 356 entities. **Every single field is empty on every single
   entity in all 4 domains.** There is no independent, structured
   food-side data anywhere in this repository to mechanically
   cross-reference against wine-style descriptors.
3. **`data/wine-style-catalog.json`'s own `typical_descriptors` per wine
   style** — this data is independently authored (for general wine-style
   pages, unrelated to and pre-dating these food-pairing seeds) and was
   used as the sole independent-corroboration source this phase. It was
   compared **only** against the food entity's own structured fields
   (which are empty, per #2) — never against the contaminated seed's own
   free-text prose, since using the contaminated source's own claims as
   its "corroboration" would be circular, not independent verification.

Because #2 is empty everywhere, the corroboration check in #3 could never
find a qualifying match: there is no independent food-side data point to
overlap against the wine side. This was verified by actually running the
check against all 873 edges (not assumed) — it returned "no independent
corroboration" for every one, honestly, because the data to find one
does not exist, not because the check was skipped.

## 6. Classification Results

All 873 edges, recomputed live this run (not hardcoded):

| Classification | fruit | nut-seed | legume | sweet-flavor | Total |
|---|---|---|---|---|---|
| A — CLEAN_AND_SUPPORTED | 0 | 0 | 0 | 0 | **0** |
| B — VALID_RELATIONSHIP, EVIDENCE_REQUIRES_REPLACEMENT | 0 | 0 | 0 | 0 | **0** |
| C — EXTERNAL_SOURCE_REQUIRED | 265 | 215 | 199 | 194 | **873** |
| D — UNSUPPORTED_RELATIONSHIP | 0 | 0 | 0 | 0 | **0** |
| E — STRUCTURAL_ERROR | 0 | 0 | 0 | 0 | **0** |

Every edge is Class C, not Class D: this phase found **no counter-evidence**
against any relationship — only an absence of independent corroborating
evidence. "Insufficient evidence" and "disproven relationship" are
different findings, and the audit preserves that distinction rather than
defaulting to the more severe label.

## 7. Remediation Performed

**None.** Per the phase's own rule, only Class A and Class B edges are
eligible for immediate remediation. This run found 0 edges in either
class, so 0 edges had their evidence text rewritten, 0 runtime
relationship files were modified, and 0 seed/mapper scripts were changed.
Confirmed: all 4 domains' `data/runtime/*-wine-relationships.json` files
are byte-identical to git HEAD.

## 8. Quarantined / Deferred Relationships

All 873 edges remain in place, unmodified — none were deleted, per the
explicit prohibition on mass-deletion. All 873 are quarantined from
publication (already, via the pre-existing EAT-07 filter — see §12), each
tagged Class C in this phase's audit as awaiting external evidence before
it can be responsibly published as supported.

## 9. External Source Requirements

All 873 edges require genuine external culinary/enological sourcing (or
newly-authored, independently-reviewed internal editorial provenance
distinct from the contaminated seed's own claims) before they can be
reclassified out of Class C. No such sourcing was performed this phase —
per Step 7, fabricating one was prohibited, and no verified external
research was introduced.

## 10. Before/After Accounting

Before this phase, no A–E classification existed — EAT-12 tracked a
coarser 3-way split (usable / no-evidence / contaminated evidence), all
356 entities landing in "contaminated." This phase's finer classification:

| Classification | Before (unclassified) | After |
|---|---|---|
| A | — | 0 |
| B | — | 0 |
| C | — | 873 |
| D | — | 0 |
| E | — | 0 |

Edges retained: 873. Edges remediated: 0. Edges quarantined: 873. Edges
requiring external sources: 873. Edges structurally invalid: 0.

## 11. Publication-Safety Gate

The existing EAT-07 mechanism in `lib/food-tail-wine-pairing-explanation.js`
(read-only inspected, **not modified** — it is a protected EAT-07
deliverable) already filters any edge whose evidence matches the
contamination pattern before rendering. Verified live: **every one of the
873 currently-contaminated edges matches that exact filter pattern**, so
0 would ever render as publication-safe under the existing, unmodified
mechanism. No new publication-safety architecture was needed or created —
the existing repository mechanism already fully serves this purpose, per
the ticket's own preference to not invent a new one when one already
fits.

## 12. Determinism

The full classification pass was run twice within the same process, and
the entire verifier script was run as four separate process invocations
across this session: all per-edge classifications are byte-identical
across runs (only the `generatedAt` timestamp differs, isolated to a
single top-level field).

## 13. HTML Immutability

All leaf HTML pages across all 4 domains were compared byte-for-byte
against `git show HEAD:<path>`: **all are byte-identical.** No page
received a "Why These Wines Work" section or any other change during
this phase.

## 14. Group/Category Deferment

No group or category page in any of the 4 domains appears in the tracked
diff. No aggregation logic was introduced. Protein leaf and group/category
pages are confirmed untouched.

## 15. Protected-Path Audit

Verified via `git diff --name-only` / `git diff --cached --name-only`
against a protected-prefix list covering the pairing engine/data, wine
systems, Spanish/language architecture, sitemap/redirects/robots.txt,
legal pages, out-of-scope food domains, the 4 target domains' own
catalogs and published HTML, and every EAT-04 through EAT-12 deliverable.
**Zero offenders.**

## 16. Files Changed

None modified. Three new files created:

- `scripts/verify-pairing-eat-13.mjs` (new verifier/audit script, 45 checks)
- `reports/pairing-eat-13-relationship-audit.json` (new, generated by the verifier)
- `reports/pairing-eat-13-implementation.md` (this file)

## 17. Git Status

`git status --porcelain` shows only the pre-existing untracked noise
already present at the start of this phase plus this phase's 3 new
files. Zero tracked files are modified. Zero files are staged.

## 18. Production Status

Not performed. This phase has not been committed, pushed, or deployed. No
production/live claim is made anywhere in this report or the audit JSON.

## 19. Final Recommendation

**LOCAL PASS — RELATIONSHIPS QUARANTINED / EXTERNAL EVIDENCE REQUIRED.**

All 45 verifier checks pass. The root cause of the contamination is now
precisely identified at the code level (a validator design flaw that
conflates internal-methodology-compliance with reader-facing evidence,
present in 4 domains, absent or escape-valved in 3 others). All 873 edges
were exhaustively re-audited; 0 qualify for immediate remediation because
no independent, non-fabricated provenance exists anywhere in this
repository to support any individual pairing choice beyond the seed
author's own unverified, self-declared "high confidence / approved"
labels. This is an honest finding of evidence scarcity, not a disproof of
the relationships and not a formatting problem to be papered over. No
data was deleted, no evidence was mass-rewritten, no fabricated citation
was introduced, and no protected system, HTML page, or prior-phase
deliverable was touched.

Do not commit. Do not push. Do not deploy. Awaiting Director review.
