# PAIRING-EAT-16 — Implementation Report

Evidence Provenance & Validator Implementation. Infrastructure/policy
implementation only — no evidence research, no runtime remediation, no
publication.

## 1. Scope

Implement the relationship → relationship_evidence_record → source_record
provenance architecture EAT-15 designed but did not build, and a
fail-closed validator enforcing the full EAT-15 evidence policy (source
verification states, bridge taxonomy, unified claim-type/evidence-strength
rules, contradiction policy, reviewer policy, producer/retailer policy,
deprecated-relationship policy, name-echo risk detection). The 873
EAT-13-quarantined runtime edges are untouched and remain fully
quarantined; this phase does not research, verify, remediate, or publish
any of them.

## 2. Policy Source

EAT-15 is treated as authoritative throughout, per the Director's
instruction. Where EAT-14 and EAT-15 differ (e.g. EAT-14's S09 record
carrying an inconsistent `evidence_strength`), EAT-15's derivation rule
governs — reflected in how this phase's new store re-expresses that
record (see §17), without editing the EAT-14 report file itself.

## 3. Provenance Architecture

Implemented exactly as designed in EAT-15:
`relationship → relationship_evidence_record(s) → source_record(s)`.
Storage is two project-owned JSON files under `data/evidence-provenance/`
— no database, no external service, no runtime network request. Each
`relationship_evidence_record` carries all 15+ Director-required fields
(`relationship_id`, `exact_food_entity_id`, `exact_wine_target_id`,
`relationship_type`, `source_ids`, `source_verification_state`,
`bridge_type`, `documented_bridge_rule`, `claim_type`, `evidence_strength`,
`relationship_status`, `researcher_id`, `reviewer_id`, `research_date`,
`review_date`, `caveats`, `contradiction_status`, `name_echo_risk`,
`name_echo_reviewed`); each `source_record` carries the full Director-
specified schema (`source_id`, `source_url`, `title`, `publisher`,
`author`, `publication_date`, `source_tier`, `source_type`,
`verification_state`, `accessed_date`, `archive_status`,
`archive_reference`, `content_hash`, `notes`).

## 4. Source Model

Four verification states (`SOURCE_UNVERIFIED`, `SOURCE_SNIPPET_ONLY`,
`SOURCE_DIRECTLY_VERIFIED`, `SOURCE_ARCHIVED_VERIFIED`) with an explicit
`can_support_evidence_verified` flag per state — only the last two can
ever contribute to `evidence_verified`. Seven source types
(`PRODUCER_SOURCE`, `RETAILER_SOURCE`, `EDITORIAL_SOURCE`,
`INSTITUTIONAL_SOURCE`, `PROFESSIONAL_SOURCE`, `ALGORITHMIC_SOURCE`,
`USER_GENERATED_SOURCE`), four of which can never alone establish
`evidence_verified` regardless of wording quality.

## 5. Status Model

Six statuses (`evidence_required`, `evidence_present`,
`evidence_verified`, `evidence_insufficient`, `quarantined`,
`deprecated_unsupported`) with an explicit transition table
(`canTransition`) — no arbitrary jumps. `evidence_required` cannot reach
`evidence_verified` directly; every transition into `evidence_verified`
re-runs the full eligibility gate live (not a cached/trusted flag); every
transition into `deprecated_unsupported` requires `contradiction_status
=== "contradicted"` (a mere signal is insufficient); `deprecated_unsupported`
is terminal (no outbound transitions). `quarantined` is reachable as a
fallback from every active state.

## 6. Claim Model

The five EAT-15 claim types are unchanged and unified across all three
relationship types — `evidence_verified` requires `EXPLICIT_PAIRING`
regardless of whether the relationship is `pairs_with_style`,
`pairs_with_descriptor`, or `pairs_with_technique`, directly implementing
the Director's rule #2 ("the relationship type does not lower the
evidence bar") and EAT-15's own "Policy C requires modification" verdict.

## 7. Bridge Model

Six bridge types. `EXACT_ENTITY`/`UNAMBIGUOUS_SYNONYM` auto-qualify;
`PREPARATION_DERIVED`/`DISH_DERIVED` require a non-empty
`documented_bridge_rule` to qualify (its absence is not a schema error —
a record can legitimately sit at `evidence_present` with an undocumented
preparation bridge — but it does block `evidence_verified` eligibility);
`CATEGORY_DERIVED`/`ATTRIBUTE_DERIVED` never qualify, full stop.

## 8. Evidence-Strength Derivation

`computeExpectedEvidenceStrength({claimType, sourceCount,
contradictionStatus})` is the single source of truth — `evidence_strength`
is never an independently-trusted field. `validateRelationshipEvidenceRecordSchema`
recomputes and compares against the stored value for every record, failing
closed on any drift. This directly fixes the exact inconsistency the
Director named: `claim_type: STRONG_CONTEXTUAL_SUPPORT` can never compute
to `explicit_multi_source`, regardless of source count.

## 9. Contradiction Handling

`CONTRADICTION_SIGNAL` (lower-tier/single-source) vs. `CONTRADICTED`
(Tier-1/2 directly-verified, or 2+ independent lower-tier sources
agreeing) remain distinct. `canTransition` enforces that only
`contradicted` — never `contradiction_signal` alone — can move a record
to `deprecated_unsupported`, directly implementing rule #10.

## 10. Reviewer Policy

`evaluateEvidenceVerifiedEligibility` requires a non-null `reviewer_id`
distinct from `researcher_id` for every relationship type (unified per
rule #2 — not scoped only to `pairs_with_style`, since the Director's
"evidence rigor is unified" rule forbids a type-based carve-out anywhere
in the eligibility gate). No fabricated reviewer exists anywhere in this
phase's data — all four seeded real records correctly carry
`reviewer_id: null`.

## 11. Name-Echo Handling

Implemented as a boolean risk flag (`name_echo_risk`, computed via
`detectNameEcho()`), not a new enum value, per the Director's explicit
instruction. A record with `name_echo_risk: true` is blocked from
`evidence_verified` unless `name_echo_reviewed: true` — an explicit,
separate acknowledgment that a reviewer examined the underlying causal
claim rather than accepting a word match at face value.

## 12. Producer/Retailer Handling

`SOURCE_TYPES_NEVER_SUFFICIENT_ALONE` = `PRODUCER_SOURCE`,
`RETAILER_SOURCE`, `ALGORITHMIC_SOURCE`, `USER_GENERATED_SOURCE`. The
eligibility gate requires at least one attached source whose type is
*not* in this set; a record backed solely by a producer/retailer/
algorithmic/user-generated source is rejected regardless of how explicit
its wording reads (fixture `FAIL_producer_only_evidence_attempting_verification`
confirms this against the actual function, not a constant).

## 13. Deprecated Relationship Handling

`deprecated_unsupported` is a real status value, never a deletion. The
underlying relationship record is retained in the store. `isPublicationSafe()`
returns `false` for every status except `evidence_verified` (with
`contradiction_status === "none"`), so a `deprecated_unsupported` record
is structurally guaranteed non-publishable. Not applied to any real
relationship this phase — no record reached `contradicted`.

## 14. Legacy Compatibility

`data/relationship-evidence.json` (ONTOLOGY-01C.6, wine-internal
evidence: glass recommendations, region facts) is untouched, confirmed
byte-identical to HEAD, and its own `meta.phase` field
(`"ONTOLOGY-01E"`) is checked live to confirm it remains scoped to
wine-internal facts. The new module
(`lib/food-tail-evidence-provenance.js`) does not import
`lib/relationship-evidence.js` or `lib/relationship-evidence-types.js` —
confirmed by direct source-text inspection, not just naming convention.

## 15. Mapper Protection

The four contaminated mapper scripts
(`scripts/map-{fruit,nut-seed,legume,sweet-flavor}-wine-relationships-
{09e,10e,11e,12e}.mjs`) were inspected but **not modified**, and their
existing (flawed) validators were **not removed**. Rationale: the new
provenance architecture is a structurally independent overlay — any
future edge seeking `evidence_verified` status must pass through
`lib/food-tail-evidence-provenance.js`'s validator, which never accepts a
governance-ID citation as evidence, regardless of what a mapper's own
internal QA gate requires. Editing the mapper's `validate*Pair001Rule()`
functions was judged unnecessary for this phase's architecture to
function, and touching a protected path without a concrete requirement
would violate the "smallest safe change" discipline established since
EAT-13. This is a recommendation deferred to a future, separately-
authorized phase, not a decision made here.

**Explicit clarification (EAT-16A):** the new provenance layer is the
authoritative *future* evidence-validation architecture, but it has **not
yet replaced the mapper execution path** and has **not yet become the
live publication gate**. Concretely and unambiguously:
- Mapper protection remains **deferred** — the mappers' own governance-
  citation validators still exist, unedited, and still run exactly as
  before if the mapper scripts are ever re-executed (they were not
  re-executed this phase or EAT-16A).
- Publication integration remains **deferred** — `isPublicationSafe()`
  is defined and tested (§16) but is not called from
  `lib/food-tail-wine-pairing-explanation.js` or anywhere else in the
  live rendering path (confirmed by source-text scan, check `H05`, not
  merely a byte-identical-to-HEAD comparison).
- All 873 EAT-13-quarantined edges **remain quarantined** under the
  pre-existing EAT-07 evidence-text filter, unaffected by anything in
  this phase.
- No existing mapper output was regenerated, and no runtime relationship
  file changed (confirmed: `J01`/`J02`/`J03`, and the 29-file hash
  baseline in §20 shows zero drift).

## 16. Publication Safety

`isPublicationSafe(record)` is defined and tested (returns `false` for
every non-`evidence_verified` status, and `false` even for
`evidence_verified` if `contradiction_status !== "none"`) but is **not**
wired into `lib/food-tail-wine-pairing-explanation.js` — confirmed
byte-identical to HEAD. Publication behavior is unchanged; the predicate
exists for a future phase to integrate.

## 17. Test Fixtures

19 deterministic fixtures (3 PASS + 16 FAIL, exactly as specified),
hardened in EAT-16A: **18 are `real_validator` coverage** (each declares
an explicit `expectedFunction` — `evaluateEvidenceVerifiedEligibility`,
`canTransition`, `validateRelationshipEvidenceRecordSchema`,
`validateRelationshipEvidenceRecordReferences`,
`containsGovernanceIdAsEvidence`, or `isPublicationSafe` — resolved
dynamically by name from the EP module and invoked; there is no code
path by which a fixture could silently call a different function than
the one it declares), and **1 is honestly labeled `policy_unit`**
("circular source URL" — `isCircularSourceUrl()` is a verifier-local
convenience helper, not exported from `lib/food-tail-evidence-provenance.js`,
mirroring the same pattern already used in EAT-13/14/15's own verifiers;
it is not claimed as production-validator coverage it does not have).
Check `N02` independently re-invokes every `real_validator` fixture's
declared function a second time and requires the result to still satisfy
the fixture's own assertion — proving genuine execution, not merely a
plausible `kind` label. Additionally, the store is seeded with 4 real,
historical EAT-14 pilot records (originally S05, S08, S09, S10),
preserving their exact original lessons:

- **S05 → preparation-bridge gap** (almond flour vs. a finished almond-
  flour dessert): re-expressed with `bridge_type: PREPARATION_DERIVED`,
  `documented_bridge_rule: null` — correctly ineligible.
- **S08 → missing URL**: re-expressed with a dedicated `EAT14-S08` source
  record carrying `source_url: null` and `verification_state:
  SOURCE_UNVERIFIED` — the new architecture computes `relationship_status:
  evidence_insufficient` for this record, honestly stricter than EAT-14's
  own softer "SUPPORTED_CONTEXTUAL" label (EAT-14's file is untouched;
  this is a new, independent computation, not a rewrite).
- **S09 → the exact claim_type/evidence_strength inconsistency**: EAT-14
  recorded `claim_type: STRONG_CONTEXTUAL_SUPPORT` alongside
  `evidence_strength: explicit_multi_source`. The re-expressed record in
  the new store corrects this to the derived value
  (`contextual_single_source`), with the discrepancy explicitly
  documented in the record's own caveats. Check `B06` confirms this
  correction is live-recomputed, not hardcoded.
- **S10 → dish-derived/contextual-inference gap** (honey drizzled on
  other foods, not a standalone entity): re-expressed with `bridge_type:
  DISH_DERIVED`.

All 4 are confirmed (check `B04`/`B05`) to correctly compute as **not**
eligible for `evidence_verified` under the hardened architecture — none
is claimed to be "fully verified merely because it exists."

## 18. Deterministic Behavior

Verifier run multiple times; provenance-store JSON and eligibility
recomputation are byte-identical across runs (excluding `generatedAt`).

## 19. Protected-Path Audit

Verified via `git diff`/`git diff --cached` against the full protected-
prefix list (pairing engine/data, all 4 catalogs and runtime relationship
files, all 4 mapper/seed scripts, `lib/relationship-evidence*.js`,
`lib/food-tail-wine-pairing-explanation.js`, wine/Spanish/language/
sitemap/redirect architecture, legal pages, every prior EAT-04 through
EAT-15 deliverable). **Zero offenders.**

## 20. Before/After Inventory

29 protected files (4 runtime relationship files, 4 catalogs,
`pairing-engine.js`, `pairing-data.js`, `sitemap.xml`, `_redirects`,
`language-config.js`, `spanish-vocabulary.json`, 6 legal/robots pages,
`data/relationship-evidence.json`, `data/relationship-types.json`, 4
mapper scripts, `food-tail-wine-pairing-explanation.js`, and 4 sample
HTML pages across all 4 domains) were SHA-256 hashed before and after
implementation. **All 29 hashes match exactly — zero drift.**

## 21. Exact Files Changed

None modified. Five new files/directories created:

- `lib/food-tail-evidence-provenance.js` (new validator/policy module)
- `data/evidence-provenance/source-records.json` (new store, 4 seeded records)
- `data/evidence-provenance/relationship-evidence-records.json` (new store, 4 seeded records)
- `scripts/verify-pairing-eat-16.mjs` (new verifier, 72 checks)
- `reports/pairing-eat-16-verification.json` (new, generated by the verifier)
- `reports/pairing-eat-16-implementation.md` (this file)

## 22. Production Status

Not performed. No commit, push, deploy, or production certification.

## 23. Limitations

- **DISCOVERED THIS PASS, NOT FIXED (per EAT-16A's explicit "stop and
  report, do not silently patch" instruction):** `detectNameEcho()`
  performs exact substantive-token overlap only. It does **not** detect
  the two real EAT-15 motivating name-echo examples verbatim —
  `detectNameEcho("Cacao Powder", "Chocolate")` and
  `detectNameEcho("Honey", "Honeyed")` both return `false`, because
  neither pair shares an exact token (no stemming or synonym awareness).
  It correctly detects exact-word-overlap cases (e.g. a food name that
  literally contains the wine descriptor's own word). This is reported
  as an open item for a future, separately-authorized phase's Director
  decision — the provenance module was deliberately **not** modified
  during this verifier-hardening pass. Check `E01D` in the hardened
  verifier documents this behavior truthfully (a passing check confirms
  the limitation is present and disclosed, not that it is acceptable or
  resolved).
- The provenance store contains only 4 historical records (re-expressed,
  not newly researched) — it does not yet cover any meaningful fraction
  of the 873-edge population, by design.
- `isPublicationSafe()` is defined but not wired into the renderer — no
  future-facing publication behavior actually changed yet.
- The mapper scripts' own flawed governance-citation validator was left
  unmodified — the new architecture supersedes it going forward for
  anything routed through the new validator, but the old mapper gate
  itself still exists in the codebase unchanged.
- The archive strategy (content-hash integrity, excerpt storage) designed
  in EAT-15 remains unimplemented — `archive_status: "not_archived"` and
  `content_hash: null` for all 4 seeded sources.
- No second human reviewer exists for any record in the store — the
  reviewer-distinctness rule is enforced but has never actually been
  exercised by a real second reviewer.

## 24. Unresolved Director Decisions

- Should the mapper scripts' `validate*Pair001Rule()` functions be
  updated in a future phase to stop requiring literal governance-code
  citations, now that an independent, authoritative validator exists?
- Should `isPublicationSafe()` be wired into
  `lib/food-tail-wine-pairing-explanation.js` now, or held until a
  meaningful number of real `evidence_verified` records exist?
- Who serves as `reviewer_id` in practice — is a second-pass automated
  research run acceptable, or does this require an actual human editorial
  reviewer?
- Should the 4 seeded historical records be formally reclassified in
  EAT-14's own report (out of scope for this phase, which explicitly
  preserves EAT-14 as historical and unedited), or does the new store's
  independent computation suffice as the authoritative correction?
- When (if ever) should the archive strategy be implemented, given the
  source-instability risk already documented in EAT-14/15?

Do not commit. Do not push. Do not deploy. Awaiting Director review.

---

## Addendum — PAIRING-EAT-16A Verifier Hardening

Following Director review, EAT-16's architecture was **accepted** and its
implementation **accepted provisionally**; the verifier was found to
require hardening before commit. Only
`scripts/verify-pairing-eat-16.mjs`, `reports/pairing-eat-16-verification.json`,
and this file changed — `lib/food-tail-evidence-provenance.js` and
`data/evidence-provenance/*.json` were **not modified**.

- **N02 fixed:** previously only checked `fixture.kind` membership in a
  list. Now every fixture declares `coverage` (`real_validator` or
  `policy_unit`) and, for `real_validator`, an `expectedFunction` that is
  resolved by name from the `EP` module and independently re-invoked by
  `N02` itself — proving genuine execution rather than a plausible label.
- **E01 fixed:** the conditional escape-hatch (`cond ? assertion : true`)
  is replaced by four independent, unconditional checks (`E01A`–`E01D`).
  `E01D` honestly documents a genuine limitation discovered in
  `detectNameEcho()` (see §23) rather than hiding it behind the old
  ternary.
- **16 FAIL fixtures reclassified:** 15 are `real_validator`; 1 (circular
  source URL) is `policy_unit`, explicitly disclosed as such via
  `reason_not_real_validator`. "Unknown relationship ID" and "dangling
  entity reference" — previously conflated into one fixture — are now
  two distinct fixtures matching the original ticket's list exactly.
- **New check `H05`:** a source-text scan (not a byte-identical
  comparison) proves `lib/food-tail-wine-pairing-explanation.js` contains
  no reference to `food-tail-evidence-provenance`, `isPublicationSafe(`,
  or `evaluateEvidenceVerifiedEligibility(`.
- **Mapper status clarified** (§15 addendum above): mapper protection,
  publication integration, and the 873-edge quarantine are all explicitly
  stated as still deferred — nothing in EAT-16 or EAT-16A enforces
  production publication.
- **Result:** 75/75 checks pass (up from 72), all 29 protected-file
  hashes confirmed unchanged before and after, determinism reconfirmed,
  file boundary confirmed as exactly the 3 permitted files.

No policy, enum, schema, or derivation rule was changed. No provenance
module or store file was modified. No commit, push, or deploy occurred.

---

## Addendum 2 — PAIRING-EAT-16B Name-Echo Validator Hardening

**Previous EAT-16A result:** 75/75 checks pass, with `detectNameEcho()`
explicitly disclosed as unable to detect the two real EAT-15 motivating
cases (cacao powder → chocolate, honey → honeyed).

**New final check count:** 84/84 checks pass (up from 75; net +9 for the
hardened name-echo suite, replacing the prior 4-check E01A–D series with
a 13-check E01–E13 series, plus renumbering the two pre-existing
eligibility-gate checks to E14/E15 to avoid an ID collision).

### Matching semantics implemented

`detectNameEcho(foodEntityName, wineTargetName)` recognizes exactly three
deterministic classes, evaluated in order, each independently
explainable — no fuzzy matching, no edit-distance threshold, no
embeddings, no external NLP library:

- **Class A — exact token overlap** (pre-existing, unchanged): any
  substantive word shared verbatim between the food name and the wine
  target name (e.g. `"Almond"` vs. `"Almond"`).
- **Class B — single "-ed" derivational suffix**: a new,
  general, symmetric rule recognizing exactly one English derivational
  pattern — a descriptor formed by appending "-ed" to a plain noun (the
  same pattern as "flavor" → "flavored"). Implemented in
  `isEdSuffixDerivation()`, requiring the stripped stem to be at least 3
  letters to avoid trivial-fragment matches. This is what makes `"Honey"`
  vs. `"Honeyed"` resolve to `true`.
- **Class C — documented wine-descriptor alias, optionally bridged by
  one recognized ingredient synonym**: a new `WINE_DESCRIPTOR_ALIASES`
  table, populated **verbatim from the wine ontology's own existing
  `search_aliases` field** on the `chocolate` (`["chocolate", "cocoa",
  "mocha"]`) and `honeyed` (`["honeyed", "honey"]`) descriptor entries
  (confirmed by direct inspection of `lib/taxonomy.js`'s loaded data
  during this phase — not invented), combined with a single, explicitly
  justified `INGREDIENT_SYNONYMS` entry (`cacao` → `cocoa`, a real
  same-substance English synonym pair, not a general dictionary). This
  table is deliberately reproduced as a small static constant (not a live
  taxonomy import) to keep the function pure, dependency-free, and
  deterministic — and deliberately limited to only the two descriptors
  implicated in known EAT-15 findings, to avoid overgeneralizing
  name-echo risk across the full wine-descriptor vocabulary.

### How "cacao powder → chocolate" is detected

Food tokens `{cacao, powder}` are expanded via `INGREDIENT_SYNONYMS` to
`{cacao, powder, cocoa}`. The wine target `"Chocolate"` tokenizes to
`{chocolate}`, whose `WINE_DESCRIPTOR_ALIASES` entry is `{chocolate,
cocoa, mocha}`. `"cocoa"` appears in both expanded sets → `true`. No
hardcoded `if food === "cacao powder"` special case exists; the same
general alias/synonym mechanism would apply to any future food whose
name contains "cacao" or "cocoa" against any future descriptor whose
alias list includes either term.

### How "honey → honeyed" is detected

Two independent mechanisms agree: (1) Class B's `-ed` suffix rule
directly recognizes `"honeyed"` as `"honey" + "ed"`; (2) Class C's alias
table separately recognizes it, since `honeyed`'s real `search_aliases`
already include `"honey"`. Both were verified to independently reproduce
`true` for this pair (see report §"Matching semantics" and verifier
checks `E03`/`E06`).

### Boolean contract confirmed

`detectNameEcho()` is confirmed (check `E13`) to return a strict
`boolean` — `typeof result === "boolean"` — for both a positive and a
negative call; never a string, object, `null`, `undefined`, or numeric
score.

### Positive cases tested (all invoke the real `EP.detectNameEcho()`)

1. `("Almond", "Almond")` → `true` — exact token overlap (E01).
2. `("Honey", "Honeyed")` → `true` — morphological derivation, the exact
   EAT-15 motivating case (E03).
3. `("Cacao Powder", "Chocolate")` → `true` — alias + ingredient synonym,
   the exact second EAT-15 motivating case (E05).
4. `("Honey", "Honeyed")` reproduced via the alias table alone,
   cross-validating mechanism (2) above (E06).
5. Case normalization: `("HONEY", "honeyed")` → `true` (E11).
6. Punctuation normalization: `("Honey!", "Honeyed,")` → `true` (E12).

### Negative cases tested (all invoke the real `EP.detectNameEcho()`)

1. `("Apple", "Chenin Blanc")` → `false` — no token relationship (E02).
2. `("Fava Bean", "Aged")` → `false` — the `-ed` suffix rule does not
   falsely fire on an unrelated word that happens to end in "-ed" (E04).
3. `("Miso", "Rich")` → `false` — unrelated pair (E07).
4. `("Fava Bean", "Earthy")` → `false` — second independent unrelated
   pair (E08).
5. `("Chickpea", "Nebbiolo")` → `false` — no meaningful lexical
   relationship at all (E09).
6. `("Blueberry", "Bright")` → `false` — **the required "semantically
   related but not name-derived" case**, drawn directly from a real
   EAT-15 descriptor-pilot edge (blueberry is genuinely, conceptually
   associated with "bright" wines in culinary/wine literature) — proving
   the detector does not overgeneralize conceptual/culinary relatedness
   into a name-echo flag (E10).

### `name_echo_risk` remains a boolean risk signal — confirmed unchanged

No new claim type, evidence-strength level, or relationship-status value
was introduced. `RELATIONSHIP_STATUSES`, `CLAIM_TYPES`,
`EVIDENCE_STRENGTH_LEVELS`, `BRIDGE_TYPES`, `SOURCE_VERIFICATION_STATES`,
`SOURCE_TYPES`, the contradiction policy, the reviewer-distinctness
requirement, the producer/retailer restrictions, and the deprecated-
relationship policy are all byte-identical to their EAT-16/16A form
(confirmed: this phase's only code diff is inside the `detectNameEcho()`
region of `lib/food-tail-evidence-provenance.js` — no other exported
symbol's implementation changed). `name_echo_risk === true` still only
feeds into the existing `evaluateEvidenceVerifiedEligibility()` gate
(checks `E14`/`E15`, unchanged in substance, renumbered to avoid an ID
collision with the new E-series) — it still requires
`name_echo_reviewed === true` to proceed, and does not by itself set
`evidence_insufficient` or `quarantined`.

### Regression / architecture-preservation confirmation

- All 19 EAT-16 fixtures (3 PASS + 16 FAIL) re-run unchanged in structure
  (18 `real_validator`, 1 `policy_unit`); `N02` independently re-verifies
  every fixture's declared function a second time — all still pass.
- All 4 historical EAT-14 provenance records remain `evidence_verified`
  count **0** and publication-safe count **0** (checks `B04`, `H03`) —
  none was promoted merely because name-echo detection improved, exactly
  as required.
- `H05`'s source-text scan of `lib/food-tail-wine-pairing-explanation.js`
  still confirms zero references to the provenance module,
  `isPublicationSafe(`, or `evaluateEvidenceVerifiedEligibility(` —
  publication remains unwired.
- Runtime edge count is still exactly **873** (check `J02`); all 4
  runtime relationship files, all 4 catalogs, both engine files, both
  seed/mapper file sets, `data/relationship-evidence.json`, the renderer,
  sitemap, redirects, language config, Spanish vocabulary, and legal
  pages remain in the 29-file SHA-256 baseline with **zero drift**
  (re-verified before and after this phase).
- Verifier run twice: output byte-identical excluding `generatedAt`.

### Exact files changed this phase

- `lib/food-tail-evidence-provenance.js` — `detectNameEcho()` hardened;
  two new small constants (`WINE_DESCRIPTOR_ALIASES`,
  `INGREDIENT_SYNONYMS`) and one new helper (`isEdSuffixDerivation()`)
  added in the same region. No other exported function changed.
- `scripts/verify-pairing-eat-16.mjs` — E01A–D replaced with E01–E15 (13
  new/rewritten name-echo checks + 2 renumbered eligibility-gate checks).
- `reports/pairing-eat-16-verification.json` — regenerated by the
  verifier (84 checks).
- `reports/pairing-eat-16-implementation.md` — this addendum.

`data/evidence-provenance/source-records.json` and
`.../relationship-evidence-records.json` were **not modified** (confirmed
by file-modification-time inspection predating this phase's start).

### Remaining limitations

- `WINE_DESCRIPTOR_ALIASES` and `INGREDIENT_SYNONYMS` are small, manually
  curated static tables, not a live reference into the wine ontology —
  if a descriptor's real `search_aliases` are edited in the ontology in
  the future, this module's copy would not automatically stay in sync.
  This tradeoff was chosen deliberately to keep `detectNameEcho()` pure
  and dependency-free, and is disclosed rather than hidden.
- Coverage is intentionally narrow: only two descriptors
  (`chocolate`, `honeyed`) have alias entries, and only one ingredient
  synonym (`cacao`↔`cocoa`) is recognized. Other potential name-echo
  cases elsewhere in the 873-edge population are not yet covered and
  would require an explicit, individually-justified addition to these
  tables in a future phase — this module does not claim broader
  synonym/stemming coverage than what is actually implemented.
- The single `-ed` suffix rule is the only morphological pattern
  recognized; other English derivational patterns (e.g. "-y", "-like")
  are not covered.

### Production / commit status

Not performed. No commit, push, deploy, or production certification
occurred. `git status --short` shows only this phase's touched files
plus the same pre-existing untracked noise as before; `git diff --check`
and `git diff --stat` against tracked files are both empty (this phase
touches only currently-untracked EAT-16 deliverables).

**Recommendation: PAIRING-EAT-16 is ready for Director review and
closure.** The one substantive gap identified at EAT-16A review
(`detectNameEcho()` failing its own motivating cases) is now resolved,
verified through real function execution (not reimplemented logic),
regression-tested against all prior EAT-16/16A guarantees, and disclosed
honestly where residual scope limitations remain.
