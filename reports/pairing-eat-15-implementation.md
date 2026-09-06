# PAIRING-EAT-15 — Implementation Report

Evidence Policy Hardening & Second Pilot. Policy/architecture hardening
plus a second, descriptor/technique-focused pilot — no publication, no
runtime remediation.

## 1. Scope

Implement the Director's EAT-14 review decisions as explicit, machine-
checkable policy (source verification states, bridge taxonomy, claim-
type/evidence-strength separation, contradiction policy, reviewer policy,
producer/retailer policy, deprecated-relationship policy), then run a
second 20-edge pilot (10 `pairs_with_descriptor` + 10 `pairs_with_technique`)
to test EAT-14's Policy C recommendation, which had only ever been
validated against `pairs_with_style` data. No runtime relationship file,
catalog, HTML, engine, mapper script, or prior EAT deliverable was
touched.

## 2. Director Decisions Implemented

All decisions from the ticket's §1 are encoded as explicit policy
objects, not prose: `pairs_with_style` requires `EXPLICIT_PAIRING`;
`SOURCE_SNIPPET_ONLY` and unverifiable (HTTP-403-type) findings can never
alone produce `evidence_verified`; exact entity identity is mandatory,
with `UNAMBIGUOUS_SYNONYM` qualifying but `PREPARATION_DERIVED`/
`DISH_DERIVED` requiring a separately-documented bridge rule and
`CATEGORY_DERIVED`/`ATTRIBUTE_DERIVED` never qualifying; contextual
evidence requires a source URL and documented bridging reasoning and is
explicitly a research classification, not automatic publication
authorization.

## 3. Objective

Test whether descriptor/technique claims are actually easier to
evidence than style claims (EAT-14's working assumption), and harden the
evidence architecture against the specific gaps the Director identified
in EAT-14 (claim_type/evidence_strength conflation, unverified sources
silently treated as strong, producer/retailer sources treated as
independent).

## 4. Source Verification Policy

Four states defined: `SOURCE_UNVERIFIED` and `SOURCE_SNIPPET_ONLY` can
never support `evidence_verified`; `SOURCE_DIRECTLY_VERIFIED` and
`SOURCE_ARCHIVED_VERIFIED` can, if every other policy requirement also
passes. Every one of this phase's 22 source records (10 descriptor + 10
technique + 2 corroborating) is honestly marked `SOURCE_SNIPPET_ONLY` —
no direct WebFetch re-verification was performed for the second pilot,
and the report does not claim otherwise.

## 5. Bridge Policy

Six bridge types defined (`EXACT_ENTITY`, `UNAMBIGUOUS_SYNONYM`,
`PREPARATION_DERIVED`, `DISH_DERIVED`, `CATEGORY_DERIVED`,
`ATTRIBUTE_DERIVED`) with an explicit, no-exceptions rule for
`pairs_with_style`: only the first two auto-qualify; the middle two
require a documented bridge rule; the last two never qualify. No vague
"close enough" category exists. The ticket's own named test case — red
lentil/spicy — was correctly classified `DISH_DERIVED` (the spiced dal
*preparation*, not the raw lentil, drives the "spicy" claim).

## 6. Claim Type Policy

Five claim types retained from EAT-14 (`EXPLICIT_PAIRING` through
`UNSUPPORTED`), with `INDIRECT_SUPPORT`'s definition extended this phase
to explicitly name the **name-echo pattern**: a wine descriptor sharing a
food's name (chocolate, honeyed, caramel) where the wine's note is
documented as arising from an unrelated winemaking process (oak toasting,
botrytis), not from the food itself. This pattern was found repeatedly in
the descriptor pilot and is now a named, checked-for failure mode rather
than an ad hoc judgment call.

## 7. Evidence Strength Policy

`evidence_strength` is now a **derived** value — computed from claim_type
+ source count + verification state via `computeExpectedEvidenceStrength()`
— never set independently. This directly fixes the exact inconsistency
the Director flagged: EAT-14 had recorded a `STRONG_CONTEXTUAL_SUPPORT`
claim (fava bean/sangiovese) with `evidence_strength: explicit_multi_source`
merely because 2+ sources existed. Under the hardened rule, a
multi-sourced contextual claim computes to `contextual_multi_source`, never
`explicit_*`. The verifier's check E01 recomputes this for all 20 second-
pilot records and requires an exact match; two rounds of self-correction
were needed during this phase's own development to make five records
(almond/nutty, apple/MLF, almond/barrel-aging, buckwheat-honey/noble-rot,
blackstrap-molasses/fortification) honestly reflect how many sources were
actually *formalized as source_records* (as opposed to merely mentioned
in a caveat) — a concrete demonstration of the policy catching a real
inconsistency in this phase's own draft data, not just a paper rule.

## 8. Contradiction Policy

`CONTRADICTION_SIGNAL` (Tier-4 or single-source) is explicitly
distinguished from `CONTRADICTED` (Tier-1/2 directly-verified, or 2+
independent agreeing sources). A signal may never cause deletion,
deprecation, runtime modification, or publication removal beyond the
existing quarantine. The EAT-14 açaí→Pinot Noir finding remains
`CONTRADICTION_SIGNAL` — not upgraded, not deleted, not reinterpreted —
under this hardened vocabulary. This phase's own pilot produced two new
genuine signals under the same discipline: coconut→bright (wine
literature explicitly ties "bright" to acidity and coconut to unrelated
oak-derived tertiary aroma) and borlotti-bean→micro-oxygenation
(the technique's documented purpose is to *reduce* "canned green bean"
character, arguably counter-indicating a complementary bean pairing).
Neither meets the `CONTRADICTED` bar.

## 9. Reviewer Policy

`pairs_with_style` `evidence_verified` requires a `researcher_id` and a
**distinct** `reviewer_id`. Every second-pilot record uses the placeholder
`researcher_id: "eat15-pilot-research"` and `reviewer_id: null` — no
second human editorial review occurred, and none is claimed. No real
human name is invented anywhere in this phase's records.

## 10. Producer/Retailer Policy

Seven source types defined; `PRODUCER_SOURCE`, `RETAILER_SOURCE`,
`ALGORITHMIC_SOURCE`, and `USER_GENERATED_SOURCE` are marked
non-independent by default and can never alone support
`evidence_verified`, regardless of how explicit their wording reads. Two
pilot records concretely exercised this: T03 (almond/barrel-aging) relies
on a barrel-producer source but the report explicitly documents that its
classification rests on a corroborating editorial source (Wine Folly),
not the producer alone; T10 (blackstrap-molasses/fortification) relies on
a wine-retailer source but explicitly pairs it with a second, independent
Tier-1 institutional source (America's Test Kitchen) as the actual basis
for its EXPLICIT classification.

## 11. Deprecated Relationship Policy

A `DEPRECATED_UNSUPPORTED` state is defined: relationships that fail
review are never deleted from underlying data, only marked, so a future
generator run cannot silently recreate an unreviewed duplicate. **Not
implemented this phase** — confirmed no edge in any of the 4 domains'
runtime files carries this status, and no runtime file was touched.

## 12. Second Pilot Design

20 edges selected deterministically from the *existing* runtime
relationship data (no new relationships invented): 10
`pairs_with_descriptor` + 10 `pairs_with_technique`, spanning all 4
domains, each with a documented selection rationale explicitly
categorized as obvious, moderate, difficult/adversarial, or a
name-echo/control test case. Two edges (borlotti-bean/micro-oxygenation,
coconut/bright) were deliberately selected as adversarial tests of
whether the existing claim actually holds up.

## 13. Descriptor Results

| Edge | Target | Bridge | Claim Type | Final Status |
|---|---|---|---|---|
| Blueberry | bright | CATEGORY_DERIVED | INDIRECT_SUPPORT | INSUFFICIENT_EVIDENCE |
| Coconut | bright | EXACT_ENTITY | (contradicts) | CONTRADICTION_SIGNAL |
| Almond | nutty | EXACT_ENTITY | EXPLICIT_PAIRING | SUPPORTED_EXPLICIT |
| Hemp Seed | herbal | ATTRIBUTE_DERIVED | STRONG_CONTEXTUAL_SUPPORT | SUPPORTED_CONTEXTUAL |
| Fava Bean | herbal | EXACT_ENTITY | STRONG_CONTEXTUAL_SUPPORT | SUPPORTED_CONTEXTUAL |
| Miso | rich | ATTRIBUTE_DERIVED | STRONG_CONTEXTUAL_SUPPORT | SUPPORTED_CONTEXTUAL |
| Red Lentil | spicy | DISH_DERIVED | COINCIDENTAL_CO_OCCURRENCE | INSUFFICIENT_EVIDENCE |
| Cacao Powder | chocolate | EXACT_ENTITY | INDIRECT_SUPPORT (name-echo) | INSUFFICIENT_EVIDENCE |
| Honey | honeyed | EXACT_ENTITY | INDIRECT_SUPPORT (name-echo) | INSUFFICIENT_EVIDENCE |
| Brown Sugar | caramel | EXACT_ENTITY | STRONG_CONTEXTUAL_SUPPORT | SUPPORTED_CONTEXTUAL |

Tally: 1 explicit (10%), 6 contextual (60%), 2 insufficient (20%), 1
contradiction signal (10%).

## 14. Technique Results

| Edge | Target | Bridge | Claim Type | Final Status |
|---|---|---|---|---|
| Apple | malolactic-fermentation | EXACT_ENTITY | EXPLICIT_PAIRING | SUPPORTED_EXPLICIT |
| Açaí | carbonic-maceration | CATEGORY_DERIVED | INDIRECT_SUPPORT | INSUFFICIENT_EVIDENCE |
| Almond | barrel-aging | EXACT_ENTITY | EXPLICIT_PAIRING | SUPPORTED_EXPLICIT |
| Cashew Butter | malolactic-fermentation | ATTRIBUTE_DERIVED | STRONG_CONTEXTUAL_SUPPORT | SUPPORTED_CONTEXTUAL |
| Chickpea | amphora-aging | ATTRIBUTE_DERIVED | INDIRECT_SUPPORT | INSUFFICIENT_EVIDENCE |
| Black Lentil | bâtonnage | CATEGORY_DERIVED | UNSUPPORTED | INSUFFICIENT_EVIDENCE |
| Borlotti Bean | micro-oxygenation | EXACT_ENTITY | (contradicts) | CONTRADICTION_SIGNAL |
| Cacao Nibs | barrel-aging | EXACT_ENTITY | EXPLICIT_PAIRING | SUPPORTED_EXPLICIT |
| Buckwheat Honey | noble-rot-production | CATEGORY_DERIVED | STRONG_CONTEXTUAL_SUPPORT | SUPPORTED_CONTEXTUAL |
| Blackstrap Molasses | fortification | EXACT_ENTITY | EXPLICIT_PAIRING | SUPPORTED_EXPLICIT |

Tally: 4 explicit (40%), 2 contextual (20%), 3 insufficient (30%), 1
contradiction signal (10%).

## 15. Complete Pilot Results (Style + Descriptor + Technique)

| Relationship type | n | Explicit | Contextual | Insufficient | Contradiction signal |
|---|---|---|---|---|---|
| pairs_with_style (EAT-14) | 20 | 30% | 20% | 45% | 5% |
| pairs_with_descriptor (EAT-15) | 10 | 10% | 60% | 20% | 10% |
| pairs_with_technique (EAT-15) | 10 | 40% | 20% | 30% | 10% |

## 16. Policy C Test

**Verdict: POLICY C REQUIRES MODIFICATION.**

EAT-14's Policy C assumed descriptor/technique claims are inherently
lower-stakes and could tolerate a relaxed evidence bar. This pilot does
not support that assumption: descriptors had the **lowest** explicit rate
of all three relationship types (10%, vs. 30% style, 40% technique) and
were the most prone to a specific, previously-unnamed failure mode — the
name-echo pattern (chocolate, honeyed, caramel), confirmed explicitly by
Tier-1 sources stating the wine descriptor's origin is unrelated to the
food. Techniques, when they had support, tended to be *more* chemically
precise and explicit than style or descriptor claims (apple/malolactic-
fermentation, almond/barrel-aging, molasses/fortification) — plausibly
because technique literature is written for a technical audience that
documents specific flavor causation, unlike descriptor vocabularies which
are often written to be evocative rather than causally traceable.

**Recommended modification:** apply the same strict claim-matching and
bridge-type discipline to all three relationship types — do not grant
descriptor/technique claims a structurally lower bar merely because of
their relationship-type label. Add an explicit name-echo check to any
future validator (wine descriptor word matches food name, with the
descriptor's documented origin traced to an unrelated winemaking process)
so it is scored `INDIRECT_SUPPORT`, never silently passed as
`EXPLICIT_PAIRING`.

## 17. Provenance Architecture

Hardened `relationship_evidence_record` schema now carries all 15
Director-required fields (source verification state, bridge type, claim
type, evidence strength, relationship status, researcher/reviewer ids,
research/review dates, exact food/wine ids, caveats, contradiction
status, source ids). `relationship_status` enum includes
`deprecated_unsupported` alongside the standard states. **Not implemented
as a runtime store** — validated only against this phase's own 20-record
pilot data structurally (schema-conformance checked by the verifier).

## 18. Archive Strategy

Designed, not implemented: preserve a short (~50-word) attributed excerpt
per source (never a full article) in a project-owned store keyed by
`source_id`; retain `source_url` and `accessed_date` permanently;
propose a content hash for future integrity checking;
`SOURCE_DIRECTLY_VERIFIED` vs. `SOURCE_ARCHIVED_VERIFIED` is the
structural signal distinguishing "read live" from "read live and
snapshotted." Explicitly disclosed: none of this phase's own 22 source
records are archived — every one relies on a live URL that could
disappear or change, a concrete, present-tense limitation the archive
design is meant to close going forward.

## 19. Circularity Controls

12 disqualified evidence categories (11 carried/refined from EAT-14 plus
one newly named this phase: a wine-descriptor glossary entry confirming a
*word* is valid wine vocabulary, used as if it proved a *specific food*
should be paired with that descriptor — the mechanism behind the
name-echo cases in §16).

## 20. Scalability

This second pilot required roughly the same per-edge effort as EAT-14's
first pilot (~1 search per edge, no direct-fetch verification this
round, which is itself disclosed as a limitation rather than hidden).
The key new scalability finding is qualitative, not just quantitative:
because the strongest differentiator is bridge-type/name-echo risk
rather than relationship type, a future scaled research effort cannot
simply apply a lighter process to descriptor/technique edges — every
edge, regardless of type, needs the same claim-matching rigor, which
means the originally-hoped-for scalability gain from Policy C (research
descriptors/techniques faster and more leniently) does not materialize.

## 21. Files Created

- `scripts/verify-pairing-eat-15.mjs` (new verifier, 82 checks)
- `reports/pairing-eat-15-evidence-policy.json` (new, generated by the verifier)
- `reports/pairing-eat-15-implementation.md` (this file)

## 22. Files Modified

None. EAT-14's own verifier/reports were also confirmed untouched.

## 23. Protected-Path Audit

Verified via `git diff`/`git diff --cached` against a protected-prefix
list covering the pairing engine/data, all 4 domains' catalogs, runtime
relationship files, mapper scripts and renderers, wine/Spanish/language/
sitemap/redirect architecture, legal pages, and every prior EAT-04
through EAT-14 deliverable. **Zero offenders.**

## 24. Verifier Results

82/82 checks pass, across categories A (phase/artifact integrity) through
R (determinism), including all 18 Director-named adversarial cases (each
implemented as logic that constructs a synthetic bad/good record and
exercises `evaluateEvidenceVerifiedEligibility()` or
`computeExpectedEvidenceStrength()`, not a constant assertion).

## 25. Determinism Results

Verifier run multiple times; second-pilot sample, source records
(excluding `accessed_date`), and relationship records (excluding
`research_date`) are byte-identical across runs.

## 26. Production Status

Not performed. No commit, push, deploy, or production certification.

## 27. Git Status

Clean except known pre-existing noise (including EAT-13/EAT-14's still-
uncommitted deliverables) plus this phase's 3 new files.

## 28. Unresolved Questions

Recorded in full in the JSON (`unresolved_questions`); highlights: the
exact numeric threshold for the "one high-quality source" exception to
the two-source preference; whether the name-echo pattern should become
its own formal bridge/claim-type value; whether `CONTRADICTION_SIGNAL`
edges should be queued for standing human review; and — given
descriptors' poor explicit-rate showing — whether `pairs_with_descriptor`
should eventually be held to the *same* strict bar as `pairs_with_style`
rather than merely "modified."

## 29. Recommended Next Phase

A Director decision on the Policy C verdict (accept "requires
modification" and unify the evidence bar across relationship types, or
request a larger follow-up sample first), resolution of the name-echo
handling question, and — only if authorized — a properly scoped,
phased research effort applying this hardened, unified policy. No
validator or runtime change should occur before that decision.

Do not commit. Do not push. Do not deploy. Awaiting Director review.
