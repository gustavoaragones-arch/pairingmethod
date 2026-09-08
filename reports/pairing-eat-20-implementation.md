# PAIRING-EAT-20 — Human Review & Evidence Policy Decision Gate

## 1. Status

**LOCAL PASS — DIRECTOR REVIEW REQUIRED** (policy gate only; no publication authorized).

82/82 verifier checks pass (deterministic across consecutive runs). **0/2 `evidence_verified`. 0/2 `publication_safe`.**

## 2. Human reviewer availability

**Not available.** This execution environment has no genuine independent human reviewer participating out-of-band. `reviewer_id = null` and `review_date = null` on both records — correctly, without fabrication.

## 3. Reviewer workflow result

The full workflow was documented and partially exercised:

| Step | EAT-20 result |
|---|---|
| Research evidence | EAT-19 sources carried forward — **no new research** |
| Source verification | Unchanged from EAT-19 closed baseline |
| Claim / bridge / target validation | Policy decisions recorded for Avocado bridge and Watermelon target |
| Researcher record | `researcher_id: eat20-policy-gate`, `research_date: 2026-09-08` |
| Independent human review | **BLOCKED** — prerequisite unmet |
| `reviewer_id` + `review_date` | Not set |
| `EP.evaluateEvidenceVerifiedEligibility()` | 0/2 pass |
| `EP.isPublicationSafe()` | 0/2 pass |

Human review confirms evidence against established policy; it does not silently create new policy.

## 4. Exact two-candidate cohort

| Food | Wine target | Runtime slug |
|---|---|---|
| Avocado | Sauvignon Blanc | `sauvignon-blanc` |
| Watermelon | Dry Rosé | `dry-rose` |

Apple, Grapefruit, Fig, and Fava Bean remain excluded per closed EAT-19 Director decision.

## 5. Avocado result

**DEFERRED** — strong evidence remains; policy and human-review gates block `evidence_verified`.

| Field | Value |
|---|---|
| Outcome | DEFERRED |
| Claim type | EXPLICIT_PAIRING |
| Bridge type | DISH_DERIVED |
| Qualifying directly verified sources | 2 (E18-02, E19-01) |
| `documented_bridge_rule` | null |
| `reviewer_id` | null |
| `evidence_verified` (live EP) | **false** |
| `publication_safe` | **false** |

Even with a hypothetical distinct human reviewer, `EP.evaluateEvidenceVerifiedEligibility()` still rejects Avocado because `DISH_DERIVED` requires a `documented_bridge_rule` (EAT-15).

## 6. Avocado bridge-policy decision

| Question | Answer |
|---|---|
| Bridge type | DISH_DERIVED |
| Evidence scope | Avocado **dishes** (E18-02); **guacamole** (E19-01) |
| Bridge rule required? | **Yes** (EAT-15 authoritative) |
| Bridge rule already exists? | **No** in project policy or provenance records |
| New rule proposed? | **Yes** — PROPOSED-AVO-BRIDGE-01 (documented) |
| Rule adopted? | **No** |
| `evidence_verified` | false |
| `publication_safe` | false |

**Proposed rule text (NOT ADOPTED):**

> PROPOSED-AVO-BRIDGE-01 (NOT ADOPTED): Bridge DISH_DERIVED evidence to `food.fruit.tropical-fruits.avocado` only when a qualifying source explicitly names guacamole as the paired dish AND cites avocado fat/creaminess as the stated pairing driver for the recommended wine. Excludes: raw avocado alone; generic "avocado dishes"; avocado toast; avocado salad; avocado-based sauces; dishes where avocado is one of several co-primary components (e.g. guacamole+salsa combo articles) unless the source isolates avocado as the driver.

**Why not adopted (not overbroad):**

- Still excludes E18-02's "avocado dishes" phrasing without a named dish.
- Guacamole ≠ avocado toast ≠ avocado salad ≠ raw avocado.
- E19-01 pairs guacamole **and salsa** — multi-component context.
- A rejected overbroad alternative ("all dishes containing ingredient map to ingredient") was explicitly **not** approved.

**Director-policy conclusion:** Evidence remains strong but policy does not yet permit verification for the canonical raw avocado entity.

## 7. Watermelon result

**DEFERRED** — human-review gate blocked; target-specificity policy unresolved.

| Field | Value |
|---|---|
| Outcome | DEFERRED |
| Claim type | EXPLICIT_PAIRING |
| Bridge type | EXACT_ENTITY (food entity scope via E18-04) |
| Qualifying directly verified sources | 2 (E18-04, E19-05) |
| `reviewer_id` | null |
| `evidence_verified` (live EP) | **false** (missing reviewer) |
| `publication_safe` | **false** |

With a hypothetical distinct human reviewer, `EP.evaluateEvidenceVerifiedEligibility()` **would pass** for Watermelon (bridge/claim/source gates OK). EAT-20 target policy still documents that **dry-rose** runtime target is not fully justified by existing evidence without a Director-adopted taxonomy bridge rule.

## 8. Watermelon target-specificity decision

| Question | Answer |
|---|---|
| Exact entity status | EXACT_ENTITY for watermelon itself (E18-04) |
| Generic rosé evidence | E18-04 — "rosé wines" with watermelon; **not** "dry rosé" |
| Dry rosé evidence | E19-05 — "dry Rosé de Provence AOC" in **salad dish context** |
| Dish-context limitation | E19-05 is for watermelon feta salad, not isolated raw watermelon |
| Wine taxonomy | `rose` and `dry-rose` are **distinct catalog slugs**; linked via `related_styles`/`substitutes` |
| Catalog taxonomy suitable for evidence bridge without Director decision? | **No** |
| Editorial alias promoted? | **No** — `lib/editorial-audit/wine-narrative.js` remains AQ-07D prose only |
| New evidence rule proposed? | PROPOSED-WM-TARGET-01 (NOT ADOPTED) |
| Rule adopted? | **No** |
| Policy outcome code | **C** — generic rosé at entity scope; dry rosé only in dish context |
| Runtime target changed? | **No** — remains `dry-rose` |
| `evidence_verified` | false (no reviewer) |
| `publication_safe` | false |

**Director-policy conclusion:** Existing evidence does **not** silently equate generic rosé with the specific runtime target `dry-rose`. Catalog editorial content (FAQ, related_styles) is not an evidence-provenance bridge unless explicitly promoted by Director decision.

## 9. Source verification summary

All sources reused from EAT-19 closed baseline. **Zero new sources added.**

| ID | Verification | Role |
|---|---|---|
| E18-02, E19-01 | SOURCE_DIRECTLY_VERIFIED | Avocado qualifying |
| E18-04, E19-05 | SOURCE_DIRECTLY_VERIFIED | Watermelon qualifying |
| E17-02, E17-07 | SOURCE_SNIPPET_ONLY | HTTP 403 — not upgraded |
| E19-02, E19-03, E19-04 | SOURCE_DIRECTLY_VERIFIED but RETAILER | Recorded, excluded from qualifying count |

## 10. Source independence summary

- **Avocado:** Natalie MacLean + Food Republic — distinct publishers, URLs, not syndicated duplicates.
- **Watermelon:** BestWinePair + perfectpairings.wine — distinct publishers.
- PairingMethod.com and runtime JSON were not used as evidence.

## 11. Claim types

Both candidates: **EXPLICIT_PAIRING**.

## 12. Bridge types

| Candidate | Bridge type |
|---|---|
| Avocado | DISH_DERIVED |
| Watermelon | EXACT_ENTITY |

## 13. Evidence strength

Both: **`explicit_multi_source`** — derived via `EP.computeExpectedEvidenceStrength()`, not manually assigned.

## 14. Contradiction status

Both: **`none`**.

## 15. Name-echo results

Both: **`name_echo_risk: false`**, live-computed via `EP.detectNameEcho()`. `name_echo_reviewed: false` (no reviewer).

## 16. Evidence eligibility results

| Candidate | `EP.evaluateEvidenceVerifiedEligibility()` | Primary blockers |
|---|---|---|
| Avocado | **false** | Missing `documented_bridge_rule`; null `reviewer_id` |
| Watermelon | **false** | null `reviewer_id` |
| Watermelon (hypothetical reviewer) | **true** | EP only — target policy gap remains documented separately |

## 17. Publication safety results

Both: **`EP.isPublicationSafe()` → false** (`relationship_status: evidence_present`).

## 18. Provenance result

- Used existing EAT-16 architecture and live EP functions.
- **EAT-16 committed store unchanged** (4 source + 4 relationship seed records).
- No simulated human-review event written to provenance store.
- EAT-20 records use `eat20:` relationship IDs with `_eat20_meta` in verification JSON only.

## 19. EAT-16 preservation

`lib/food-tail-evidence-provenance.js` byte-identical to git HEAD. Seed provenance JSON unchanged.

## 20. EAT-19 preservation

EAT-19 artifacts preserved **byte-for-byte**:

- `reports/pairing-eat-19-verification.json`
- `scripts/verify-pairing-eat-19.mjs`
- `reports/pairing-eat-19-implementation.md`

Historical EAT-19 conclusions not rewritten.

## 21. 873-edge preservation

873 food-tail runtime edges unchanged.

## 22. Runtime preservation

All four `data/runtime/*-wine-relationships.json` files byte-identical to git HEAD.

## 23. HTML/page preservation

`fruits/avocado/index.html` and `fruits/watermelon/index.html` byte-identical to HEAD. No "Why These Wines Work" injection.

## 24. Renderer/mapper non-wiring

`lib/food-tail-wine-pairing-explanation.js`, `assets/js/pairing-engine.js` unchanged. Provenance gate not wired into publication.

## 25. Verifier count

**82** meaningful checks (`scripts/verify-pairing-eat-20.mjs`).

## 26. Failed checks

**0** (82/82 PASS).

## 27. Exact files changed

| File | Action |
|---|---|
| `scripts/verify-pairing-eat-20.mjs` | Created |
| `reports/pairing-eat-20-verification.json` | Generated |
| `reports/pairing-eat-20-implementation.md` | Created |

No other files modified. EAT-19, EAT-16 store, runtime, HTML, renderer protected paths untouched.

## 28. Git status

EAT-20 deliverables are local untracked files alongside prior local EAT-18/EAT-19 artifacts. **Not committed. Not pushed.**

## 29. Production status

**NOT PERFORMED** — no deploy per EAT-20 scope.

## 30. Strategic recommendation

| Dimension | EAT-20 outcome |
|---|---|
| **Policy resolved** | **Partially** — bridge and target questions analyzed; proposed rules documented; **none adopted** |
| **Evidence verified** | **0/2** — human review externally blocked; Avocado also blocked by missing bridge rule |
| **Publication safe** | **0/2** — separate gate |
| **Publication authorized** | **No** |

**Recommended next steps (Director decisions, not automatic):**

1. **Human review:** Obtain a genuine out-of-band reviewer (`reviewer_id` distinct from `researcher_id`, with `review_date`) who independently confirms the 12-point review checklist against cited sources.
2. **Avocado:** Either adopt a narrow, auditable DISH_DERIVED bridge rule (Director policy act) or accept indefinite deferral for the raw avocado entity.
3. **Watermelon:** Either adopt an evidence-layer rosé→dry-rose taxonomy bridge rule, change the runtime target in a future authorized phase, or accept deferral for `dry-rose` specifically despite strong generic rosé evidence.
4. **Publication:** Remains a separate future phase — do not wire provenance into renderer until explicitly authorized.

**Important:** Policy resolution, evidence verification, publication safety, and publication authorization are **not synonymous**. EAT-20 succeeded by documenting truthful blockers rather than lowering the evidence bar.
