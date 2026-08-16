# AQ-07 — Editorial Narrative Quality — Final Certification

**Date:** 2026-08-15
**Mission:** Make the consumer-facing editorial prose read as human-authored culinary reference content, not internal ontology output or repeated templates — starting from AQ-06B's finding and expanding it wherever direct review found more.

## Overall certification: PASS — Editorial Narrative Quality

## Before

| Metric | Value |
|---|---|
| Affected leaf entities (AQ-06B's original "canonical" scan) | 328 / 1,166 |
| Affected leaf entities (AQ-07B's fuller scan, all narrative fields, "canonical" + "ontology") | 335 / 1,166 |
| Affected groups | 56 / 73 → 73 / 73 once protein's raw-field-name leaks were found by manual review |
| Affected categories | 10 / 13 → 13 / 13, same reason |
| Governance-terminology hits (consumer-facing) | 999 across 402 distinct entities |
| Legume wine-conclusion repetition | 75 / 75 entities ended with the identical clause regardless of which legume |
| SEO description impact | Identical to summary — the templated text reached the live `<meta name="description">` tag and every JSON-LD description property |

The headline example: *"Adzuki Bean is a canonical Japanese and East Asian sweet and savory bean ingredient — other legumes use in global pulse cooking pairs with earthy reds, aromatic whites, and spice-friendly rosé."* Grammatically broken, carrying leaked internal jargon ("canonical"), and ending in a wine conclusion identical across all 75 legumes regardless of which one.

## After

| Metric | Value |
|---|---|
| Remaining governance terminology (consumer-facing) | 0 |
| Remaining template constructions (critical/high) | 0 |
| Remaining repeated wine conclusions where profiles differ | 0, across all 4 originally-affected domains |
| Remaining grammatical defects (critical/high/medium/low) | 0 |
| Remaining intentional shared prose | 163 dead, never-rendered leaf-tier `introduction` field duplicates (catalog hygiene, not a live defect) + 1 legitimate scientific-binomial echo |

The same entity now: *"Adzuki beans are small, deep-red Japanese and East Asian beans with a naturally sweet, nutty flavor that lends itself to both savory dishes and desserts like red bean paste — that sweetness makes an off-dry Gewürztraminer a natural match."* Grammatically clean, no internal jargon, and the wine conclusion (Gewürztraminer) traces to adzuki bean's own governed `pairs_with_style` relationship — not a generic default shared with every other legume.

## Coverage

| Scope | Coverage |
|---|---|
| Leaf entities rewritten | 335 / 1,166 |
| Groups rewritten | 73 / 73 |
| Categories rewritten | 13 / 13 |
| SEO descriptions certified | 1,252 / 1,252 |
| Legume wine narratives verified against real relationship data | 75 / 75 |
| Domains regenerated and republished | 11 / 11 (10 promoted; cheese correctly withheld, unpublished) |

## Quality gates — all passed

- **Governance language:** 0 unjustified internal governance terms remain in consumer-facing prose.
- **Grammar:** 0 critical grammatical defects.
- **Narrative:** 0 high-severity generic/template prose remains.
- **Legume wine narratives:** entity-specific everywhere underlying pairing profiles differ (legume, nut-seed, sweet-flavor, sauce-condiment all verified, 0 collapsed groups).
- **SEO descriptions:** 100% of published pages have valid, consumer-facing descriptions (1,252/1,252).
- **Unsupported claims:** 0 newly introduced.
- **Architecture:** 0 unintended ontology/runtime/editorial/wine/governance changes — verified at every one of the 8 milestones via `git status`/`git diff` before each commit.
- **Publication:** all 11 domains regenerate deterministically (AQ-07G).
- **Regression:** AQ-02B, AQ-04, and AQ-05 certification checks all re-run fresh and remain clean.

## What this phase found beyond its own starting point

Two things are worth stating plainly, in the spirit this whole audit chain has held to since AQ-02B3's béarnaise correction:

1. **AQ-07B's 14-term scanner undercounted the real problem.** Manual review during remediation found raw snake_case field names (`plant_part`, `edible_structure`, `fungal_body`) and untracked architecture phrases ("intrinsic metadata," "graph relationships") concentrated in protein's 17 groups and 3 categories — none of them matched by the original term list. The single worst instance found in this entire initiative was cheese's group-tier introduction text, identical across all 9 groups: *"canonical entities with frozen intrinsic metadata for classification and identity."* All fixed to the same standard as everything else.
2. **A real, previously-unknown, site-wide bug was found and fixed as a side effect.** AQ-07E's grammar audit surfaced a truncation-logic defect in how `seo_description` was derived from `summary` — cutting at the wrong word boundary could orphan a fragment mid-word or leave a double space before the ellipsis. Fixing it and regenerating `seo_description` from the already-correct `summary` text touched 478 entities, the large majority in domains this initiative never set out to remediate (fruit: 112, herb-spice: 93, protein: 100, grain-starch: 71) — a genuine quality improvement to pages that were never part of the original finding.

Neither of these was invented work — both were caught by building real, adversarial verification tools and reading their output carefully, the same discipline that has now caught something real in every one of AQ-02 through AQ-07.

## Handoff to AQ-06R

AQ-07 does not re-certify AdSense readiness. **Editorial Narrative Quality: PASS.** The next, separate step — re-running the AdSense reviewer simulation against this now-improved live publication — belongs to AQ-06R, which will independently verify against the AQ-06 baseline this initiative was built to answer.
