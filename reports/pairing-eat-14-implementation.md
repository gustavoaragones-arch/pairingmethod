# PAIRING-EAT-14 — Implementation Report

Food-Tail Pairing Evidence Research & Provenance Architecture. Research and
architecture phase — no publication, no remediation, no HTML change.

## 1. Scope

Determine whether the 873 EAT-13-quarantined food→wine relationships
(fruit 265, nut-seed 215, legume 199, sweet-flavor 194 — all Class C,
EXTERNAL_SOURCE_REQUIRED) can be supported with genuine external evidence
at a quality level appropriate for Pairing Method. Establish a source
hierarchy, an evidence policy, a provenance data architecture, and a
future (not-yet-implemented) validator contract. Test all of it against a
deterministic 20-edge pilot sample spanning all 4 domains before any mass
remediation is authorized. No catalog, runtime relationship data, HTML,
pairing engine, or prior-phase deliverable was touched.

## 2. Root Cause (recap, not re-derived)

Unchanged from EAT-13: the four mapper validators
(`validateFruitPair001Rule` / `validateNutPair001Rule` /
`validateLegumePair001Rule` / `validateSweetPair001Rule`) require the
governance rule code to appear literally inside the reader-facing
`evidence` field. This phase treats that as settled and does not
re-investigate it — it works one layer downstream: given that the
evidence text is unusable, what would genuine replacement evidence
actually require?

## 3. Sample Design

A fixed, deterministic 20-edge list (5 per domain), documented with an
explicit selection rationale per edge, covering — per domain — one
obvious/high-confidence pairing, one moderately intuitive pairing, one
less-obvious/difficult pairing, and one edge whose target wine style
diverges meaningfully from the domain's other samples (a fortified or
sparkling wine, contrasted against the more common still/light-white
targets). The full list, with rationale, is in
`reports/pairing-eat-14-evidence-research.json`'s `sample_relationships`.
Examples: Apple→Chenin Blanc (obvious), Avocado→Sauvignon Blanc
(moderate), Bergamot→Albariño (less obvious), Açaí→Pinot Noir
(less-obvious + target-divergent test), Banana Chips→Port
(target-divergent, fortified).

## 4. Sample Results

| Domain | Edge | Target | Final Status |
|---|---|---|---|
| fruit | Apple | Chenin Blanc | SUPPORTED_EXPLICIT |
| fruit | Avocado | Sauvignon Blanc | SUPPORTED_EXPLICIT |
| fruit | Bergamot | Albariño | INSUFFICIENT_EVIDENCE |
| fruit | Açaí | Pinot Noir | **CONTRADICTED** |
| fruit | Banana Chips | Port | INSUFFICIENT_EVIDENCE |
| nut-seed | Almond | Sherry | SUPPORTED_EXPLICIT |
| nut-seed | Chestnut | Nebbiolo | SUPPORTED_CONTEXTUAL |
| nut-seed | Baru Nut | Pinot Noir | INSUFFICIENT_EVIDENCE |
| nut-seed | Egusi Seed | Gewürztraminer | INSUFFICIENT_EVIDENCE |
| nut-seed | Almond Flour | Champagne | SUPPORTED_CONTEXTUAL |
| legume | Fava Bean | Sangiovese | SUPPORTED_EXPLICIT |
| legume | Cannellini Bean | Pinot Grigio | SUPPORTED_EXPLICIT |
| legume | Black Gram | Syrah/Shiraz | INSUFFICIENT_EVIDENCE |
| legume | Coral Lentil | Gewürztraminer | SUPPORTED_CONTEXTUAL |
| legume | Chickpea Flour | Champagne | INSUFFICIENT_EVIDENCE |
| sweet-flavor | Cacao Powder | Port | SUPPORTED_EXPLICIT |
| sweet-flavor | Clover Honey | Moscato | SUPPORTED_CONTEXTUAL |
| sweet-flavor | Carob Powder | Chenin Blanc | INSUFFICIENT_EVIDENCE |
| sweet-flavor | Birch Sugar | Gewürztraminer | INSUFFICIENT_EVIDENCE |
| sweet-flavor | Beet Sugar | Prosecco | INSUFFICIENT_EVIDENCE |

**Tally (preliminary, n=20):** 6 SUPPORTED_EXPLICIT (30%), 4
SUPPORTED_CONTEXTUAL (20%), 9 INSUFFICIENT_EVIDENCE (45%), 1 CONTRADICTED
(5%), 0 UNRESOLVED.

Two findings worth flagging specifically:

- **Açaí→Pinot Noir is CONTRADICTED**, not merely unsupported. The only
  external source found (a commercial pairing-tool page) explicitly
  recommends Prosecco, off-dry Riesling, or tart Rosé for açaí bowls, and
  its reasoning explicitly favors lighter/sparkling wines over an earthy
  red. Notably, this matches the *same edge's own secondary relationship*
  (`also_pairs_with_style: prosecco`) — suggesting the seed's secondary
  claim may be better-supported than its primary one, an asymmetry worth
  preserving for any future remediation pass.
- **Beet Sugar→Prosecco is a claim-matching hazard**, not just missing
  evidence. Every source found discusses beet-the-root-vegetable in
  savory salads with Prosecco — a completely different catalog entity
  from beet sugar, the refined commodity sweetener. This is the clearest
  illustration in the pilot of why claim-matching must verify exact
  entity identity, not just keyword co-occurrence.

## 5. Source Hierarchy

Four tiers defined (full detail with authority/editorial-control/
specificity/independence/permanence/explicit-vs-implied dimensions in the
JSON's `source_hierarchy`): **Tier 1** (professional wine/culinary
institutions, e.g. Wine Spectator, Le Cordon Bleu, a regional wine-trade
regulatory council); **Tier 2** (established professional publications,
e.g. Wine Folly, Wine Enthusiast); **Tier 3** (named-author editorial
blogs — this pilot's most reliable source for niche foods, e.g. the
almond/sherry pairing verified via a named, dated author); **Tier 4**
(commercial/algorithmic pairing tools, forums, unsourced lists — used
only as diagnostic/corroborating context, never as sole evidence). A key
finding: **tier alone does not guarantee an explicit statement** — a
directly-fetched Tier-1 source (Wine Spectator, chocolate/Port) turned
out to use contextual reasoning rather than a bare declarative sentence,
while a Tier-3 source (a named wine blogger) gave the cleanest, most
directly quotable explicit statement in the entire pilot (almond/sherry).
Tier assignment does not substitute for reading the actual sentence.

## 6. Evidence Policy

Five claim-match categories defined (EXPLICIT_PAIRING,
STRONG_CONTEXTUAL_SUPPORT, INDIRECT_SUPPORT,
COINCIDENTAL_CO_OCCURRENCE, UNSUPPORTED). Only EXPLICIT_PAIRING qualifies
automatically; STRONG_CONTEXTUAL_SUPPORT qualifies only with documented
bridging reasoning (used for 4 of this pilot's 20 edges, each with an
explicit caveat naming the bridging gap — e.g. almond flour vs. a
finished almond-flour dessert); INDIRECT_SUPPORT/
COINCIDENTAL_CO_OCCURRENCE/UNSUPPORTED never qualify. Every
SUPPORTED_EXPLICIT edge in this pilot had 2+ independently-titled
corroborating sources found, even though only one was recorded as the
primary `source_record` per edge.

## 7. Provenance Architecture

Designed shape: `relationship → relationship_evidence_record(s) →
source_record(s)`, deliberately mirroring the existing
`data/relationship-evidence.json` (ONTOLOGY-01E) pattern rather than
inventing a new one — extended to a new evidence domain (food-tail
pairings), not repurposing or modifying that existing wine-internal file.
Supports one-relationship-to-many-sources, one-source-to-many-
relationships, source-level metadata, claim-level matching, evidence
strength, research status, and reviewer/research dates. **Not
implemented this phase** — no runtime file was created or populated; this
is a design, validated only against the pilot's actual data shape (the
20-record `source_records` array in the JSON conforms to the proposed
18-field schema, checked structurally by the verifier).

## 8. Governance vs. Evidence

Explicitly documented as two separate questions: governance answers "why
is this relationship allowed to exist in the ontology" (a methodology
constraint); evidence answers "what independent evidence supports this
specific claim" (reader-trust). EAT-13's root cause — the validator
conflating the two — is recapped as the concrete cautionary example this
architecture must prevent from recurring.

## 9. Circularity Controls

Eight categories of disqualified "evidence" are explicitly listed
(contaminated seed text, generated explanations, governance codes, bare
edge existence, non-independent catalog descriptions, generated HTML,
AI-generated claims — including this phase's own search summaries, which
is why every claim was checked against quoted source text and re-fetched
where possible — and artifact-citing-artifact chains). The wine-style
catalog's `typical_descriptors` were judged usable as an EAT-13
cross-reference (authored independently, pre-dating this pairing content)
but were never used as sole evidence in this phase without an external
source.

## 10. Validator Findings

The exact validator design that caused EAT-13's contamination was
identified in that prior phase (hard-coded literal citation requirement,
no escape valve) and is not re-investigated here. This phase instead
specifies the **future** validator contract: five states
(`evidence_required`, `evidence_present`, `evidence_verified`,
`evidence_insufficient`, `quarantined`), fail-closed by design (a
relationship leaves quarantine only when explicitly `evidence_verified`;
every other state renders identically to quarantined). **Not implemented
this phase** — the pilot's own 45%-insufficient/5%-contradicted finding
shows the population isn't ready for a validator rewrite with nothing
real to validate against, and implementing one now would risk exactly
the "weaken validation to make existing relationships pass" outcome this
phase was explicitly told not to produce.

## 11. Scalability Assessment

**Preliminary — 20 of 873 edges (2.3%).** Roughly 1.5 tool calls/edge
this pilot (search + selective direct-fetch verification); several
fetch attempts against wine-education/publication domains returned HTTP
403, adding real friction beyond raw claim-finding. Source availability
is uneven by domain: well-known ingredients tied to a strong regional
culinary tradition (fava bean, cannellini bean, almond, chocolate) had
the best coverage; niche/regional or refined-commodity ingredients
(baru nut, egusi seed, birch sugar, carob powder) had essentially none.
Multiple independent sources were typically available for the strongest
(explicit) claims, but a meaningful share of even well-known ingredients
required a documented bridging judgment call. Scaling this manual
process to all 873 edges would require an estimated 1,300+ search/fetch
operations plus edge-by-edge human review of ambiguous claim-matching
cases — feasible only as a phased, prioritized effort, not a single bulk
pass. **Selective, permanent retention-in-quarantine for a meaningful
fraction of the 873 population is likely necessary**, not merely a
temporary state pending more research effort.

## 12. Retention Policy Recommendation

Three policies evaluated (full comparison table in the JSON's
`retention_policy_recommendation`):

- **Policy A** (explicit-only): highest trust, but this pilot's 30%
  explicit rate suggests it would quarantine most of the 873 population
  indefinitely.
- **Policy B** (explicit or strong contextual): raises the publishable
  fraction to this pilot's 55%, at the cost of requiring real, documented
  editorial judgment per contextual edge.
- **Policy C (recommended)** — hybrid by relationship type: hold
  `pairs_with_style` (the primary, most reader-visible claim) to the
  strict Policy-A bar, while `pairs_with_descriptor`/`pairs_with_technique`
  claims (lower-stakes, more mechanically checkable against existing wine
  ontology data) could use a documented Policy-B contextual bar.

This is a recommendation for Director decision, chosen because it
targets this pilot's actual observed failure modes — not because it is
the easiest to implement (Policy A is simpler to implement but too
conservative at this population's evidence-availability level; Policy B
is easier than C but applies the same, more permissive bar uniformly
regardless of claim visibility).

## 13. Determinism

The verifier was run multiple times; the sample list, source records
(excluding `accessed_date`), source hierarchy, and evidence policy are
byte-identical across runs (only `generatedAt`/`accessed_date` differ, as
expected and explicitly documented timestamp fields).

## 14. HTML Immutability

All leaf HTML pages across all 4 target domains remain byte-identical to
git HEAD — confirmed by direct comparison, not assumed.

## 15. Group/Category Deferment

Not applicable to modify this phase (no group/category work was in
scope); confirmed no group/category file appears in the diff.

## 16. Protected-Path Audit

Verified via `git diff`/`git diff --cached` against a protected-prefix
list covering the pairing engine/data, all 4 domains' catalogs and
runtime relationship files, the four mapper scripts, wine/Spanish/
language/sitemap/redirect architecture, legal pages, and every prior
EAT-04 through EAT-13 deliverable. **Zero offenders.**

## 17. Files Created

- `scripts/verify-pairing-eat-14.mjs` (new verifier, 45 checks)
- `reports/pairing-eat-14-evidence-research.json` (new, generated by the verifier)
- `reports/pairing-eat-14-implementation.md` (this file)

## 18. Files Modified

None.

## 19. Production Status

Not performed. No commit, push, deploy, or production HTTP certification
occurred this phase.

## 20. Final Recommendation

**LOCAL PASS — DIRECTOR REVIEW REQUIRED (RESEARCH & ARCHITECTURE ONLY, NO
PUBLICATION AUTHORIZED).** All 45 verifier checks pass. This phase
demonstrated a working, honest evidence-research methodology on a real
20-edge sample: it found genuine explicit support for 6 edges, contextual
support requiring documented judgment calls for 4, honest insufficiency
for 9, and one genuine contradiction — including catching a claim-
matching hazard (beet sugar vs. beet vegetable) and a source that
oversold itself relative to its actual wording (a search snippet implying
more than a direct fetch confirmed). No relationship was published, no
evidence was fabricated, no validator was weakened or broadly rewritten,
and no protected system was touched. The methodology is demonstrated at
pilot scale only — scaling to all 873 edges, and deciding a retention
policy, remain Director decisions.

Do not commit. Do not push. Do not deploy. Awaiting Director review.
