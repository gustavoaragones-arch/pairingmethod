# FOOD-14A — Protein Refinement Governance

**Phase:** FOOD-14A — Protein Refinement Governance  
**Freeze Date:** August 9, 2026  
**Status:** **Protein Refinement Governance Frozen v1.0.0**  
**SSOT:** [`data/protein-food-catalog.json`](../data/protein-food-catalog.json)  
**Blueprint:** [`PROTEIN_REFINEMENT_BLUEPRINT.md`](PROTEIN_REFINEMENT_BLUEPRINT.md)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)  
**Platform:** Food Ontology Platform v1.0.0 (frozen — domain contract only)  
**Suite baseline:** Food Ontology Suite v2.0.0 · tag `food-ontology-suite-v2.0.0`

---

## Executive Summary

PairingMethod declares **Protein Refinement Governance v1.0.0** — the authoritative governance layer for **FOOD-14 Protein Refinement**, the final ontology-focused phase of the Food Ontology Suite expansion.

Unlike FOOD-01 through FOOD-13, FOOD-14 does **not** introduce a new ontology domain. It refines and harmonizes the **original Protein Foods ontology** now that eleven published domains surround it with canonical ownership, frozen governance rules, and a mature four-layer knowledge architecture.

FOOD-14 closes historical compromises that were necessary before later domains existed: duplicated plant and fungi groups inside Protein, sparse cross-domain editorial references, poster-level seafood and cured-meat gaps, and wine pairings that predate sauce-aware and sweet-flavor-aware pairing intelligence.

This milestone establishes the refinement contract, **backward compatibility guarantees**, **migration policy**, **ownership transfer rules**, **deprecation policy**, and domain rules **PROTEIN-001** through **PROTEIN-005** and **PROTEIN-PAIR-001**.

**No catalog entity modifications occur in FOOD-14A.** No runtime artifacts, editorial edges, wine edges, publication artifacts, or platform changes are created in this phase.

Protein Foods remains the **first published domain** and will be **re-published** through the existing shared publication pipeline in FOOD-14F — no platform redesign.

**Governance status:** Frozen. Ownership reconciliation begins only after explicit approval to proceed with FOOD-14B.

---

## Refinement Principle

FOOD-14 is a **quality and consistency release**, not a domain expansion release.

| Dimension | FOOD-01–13 (new domain) | FOOD-14 (refinement) |
|-----------|-------------------------|----------------------|
| Primary goal | Add canonical ingredient family | Harmonize published Protein with suite |
| Catalog change | Populate new SSOT | Reconcile ownership; close poster gaps |
| Entity count delta | Substantial growth expected | Modest net change expected |
| Platform change | Declarative registration only | Declarative registration only |
| Publication | New routes | Existing `/foods/` routes refreshed |
| Value metric | Coverage breadth | Cross-domain correctness |

The suite value at FOOD-14 completion is **eliminating historical compromises**, not maximizing entity counts.

---

## Domain Independence Principle

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — Domain Independence Principle.

Every refinement decision is evaluated against four questions **before implementation**. **No modifications in FOOD-14A.**

| Question | If **yes** | If **no** |
|----------|------------|-----------|
| **Does this require a new ontology domain?** | Stop — FOOD-14 does not add domains | Continue refinement within Protein |
| **Is this intrinsic knowledge?** | Catalog + runtime (structural layer) | Editorial or wine-pairing layer |
| **Is this computational reasoning?** | Pairing Engine (ENGINE-XX) | Never ontology |
| **Does this require a platform change?** | Burden of proof is **extremely high** | Refinement uses existing publication pipeline |

### Cross-domain references (PLAN-01)

> **Ontology domains may reference entities in other domains only through canonical ontology IDs. They must never duplicate another domain's intrinsic data.**

FOOD-14 enforces this rule retroactively across Protein editorial and wine layers.

---

## 1. Version

| Field | Value |
|-------|-------|
| Domain | Protein Foods (refinement of published v1.0.0) |
| Governance version | **v1.0.0** |
| JSON `catalog_version` | `2.0.0` (baseline; may increment at FOOD-14B if catalog amendments required) |
| `food_ontology_version` (target suite) | `2.1.0` (upon FOOD-14F re-publication) |
| `platform_version` | `1.0.0` (frozen) |
| `wine_ontology_version` (reference) | `2.0` |
| `ontology_foundation_version` | `1.0.0` |
| Phase | FOOD-14A (governance only) |
| Regression baseline | tag `food-ontology-suite-v2.0.0` · commit FOOD-13F |

---

## 2. Architectural Scope

### Allowed artifacts (FOOD-14A only)

| Artifact | Purpose |
|----------|---------|
| `docs/PROTEIN_REFINEMENT_GOVERNANCE.md` | This document |
| `docs/PROTEIN_REFINEMENT_BLUEPRINT.md` | Refinement taxonomy and migration blueprint |

### Explicitly excluded from FOOD-14A

- Catalog entity modifications
- Runtime artifacts (bootstrap, indexes, graph edges)
- Editorial or wine pairing relationship changes
- Publication artifacts (HTML, sitemaps, search indexes)
- Generators, validators, certification scripts
- Platform modifications

### Domain contract compliance

Protein Foods remains a registered consumer of the multi-domain publication platform via `PROTEIN_DOMAIN` in `lib/food-domain-config.js`. FOOD-14F reuses the shared pipeline — no protein-specific stage runners.

---

## 3. Published Baseline (certified at v2.0.0)

| Metric | Certified value | Source |
|--------|----------------:|--------|
| Leaf entities | 207 | `data/protein-food-catalog.json` |
| Groups | 16 | catalog |
| Categories | 3 | catalog |
| Publication pages | 226 | release certification |
| Runtime relationships | 35,734 | `data/runtime/protein-food-relationships.json` |
| Editorial relationships | 40 | `data/runtime/protein-food-editorial-relationships.json` |
| Wine relationships | 29 | `data/runtime/protein-food-wine-relationships.json` |
| Publication paths | `/foods/`, `/groups/`, `/categories/` | unchanged |

FOOD-14 phases may change these metrics modestly. FOOD-14A establishes the **before** snapshot for regression comparison.

---

## 4. Refinement Boundaries

### In scope

| Area | FOOD-14 objective |
|------|-------------------|
| **Ownership reconciliation** | Protein references canonical IDs; legacy duplicate groups deprecated |
| **Seafood taxonomy** | Refine `fin-fish`, `crustaceans`, `mollusks`, `cephalopods` toward poster granularity |
| **Cured meat identity** | Close poster gap for salami, prosciutto, and related cured forms |
| **Cross-domain editorial** | Enable and populate `commonly_served_with` and related forward references |
| **Wine pairing refinement** | Expand pairings using sauce-aware, sweet-flavor-aware suite context |
| **Runtime normalization** | Deterministic rebuild; optional consolidated loader alignment |
| **Publication refresh** | Re-publish through existing pipeline with certification |

### Out of scope

| Area | Rationale |
|------|-----------|
| New ontology domains | FOOD-14 is the final ontology phase |
| Platform redesign | Shared pipeline is feature-complete |
| Recipe or dish taxonomy | ENGINE / editorial scope, not catalog |
| Breaking published URLs without migration plan | PROTEIN-002 |
| Duplicating intrinsic data from FOOD-05–13 domains | PLAN-01 |
| Pairing Engine logic | ENGINE roadmap |

---

## 5. Backward Compatibility Guarantees

| Guarantee | Policy |
|-----------|--------|
| **Published URL stability** | Existing `/foods/{slug}/` URLs remain valid through FOOD-14 unless an explicit migration and redirect plan is approved in FOOD-14B |
| **Immutable IDs during compatibility window** | `food.protein.*` IDs are not retired until canonical replacement and redirect policy is documented |
| **Regression baseline** | `food-ontology-suite-v2.0.0` remains the certified recovery point throughout FOOD-14 |
| **Deterministic rebuild** | Every FOOD-14 compile phase must produce deterministic artifacts |
| **Layer separation** | Catalog, runtime, editorial, and wine layers remain independently versioned |
| **No silent cross-domain duplication** | Intrinsic fields from other domains are never copied onto protein entities |

---

## 6. Migration Policy

FOOD-14 executes deferred migrations documented across the suite since FOOD-06.

| Policy | Detail |
|--------|--------|
| **Canonical owner wins** | When Protein and another domain claim the same culinary concept, the later canonical domain owns intrinsic knowledge |
| **Compatibility aliases permitted** | Protein may retain editorial references or aliases during transition |
| **Migration is explicit** | Every ID transfer requires a documented mapping table in FOOD-14B |
| **Machine-readable migration map** | `data/protein-migration-map.json` is the SSOT for all ID transfers — consumed by runtime, editorial, wine, publication, and audit scripts |
| **No orphan edges** | Editorial and wine edges referencing migrated IDs must be updated in FOOD-14D/E |
| **Publication follows migration** | FOOD-14F runs only after 14B–14E certification PASS |
| **Rollback point** | `food-ontology-suite-v2.0.0` |

### Deferred migrations (frozen in peer domain governance)

| Legacy Protein scope | Canonical owner | Policy source |
|----------------------|-----------------|---------------|
| `mushrooms` group (12 entities) | Fungi (`food.fungi.*`) | [`FUNGI_GOVERNANCE.md`](FUNGI_GOVERNANCE.md) §10 |
| `legumes` + `soy-foods` groups (22 entities) | Legume (`food.legume.*`) | [`LEGUME_GOVERNANCE.md`](LEGUME_GOVERNANCE.md) §9 |
| `nuts-seeds` group (12 entities) | Nut & Seed (`food.nut-seed.*`) | `data/nut-seed-catalog.json` meta |
| `grains-wheat-protein` group (8 entities) | Grain & Starch (`food.grain-starch.*`) | [`GRAIN_STARCH_GOVERNANCE.md`](GRAIN_STARCH_GOVERNANCE.md) §10 |

**Exception:** Seitan (`food.protein.grains-wheat-protein.seitan`) remains canonical in Protein per Grain & Starch governance — cross-reference only, not migration.

---

## 7. Deprecation Policy

Deprecation lifecycle is governed by **PROTEIN-005** (§12). Summary by phase:

| Stage | Action |
|-------|--------|
| **FOOD-14A** | Identify deprecated groups and entities; no removals |
| **FOOD-14B** | Mark deprecated entities in catalog metadata; populate `data/protein-migration-map.json` |
| **FOOD-14C–14E** | Exclude deprecated entities from runtime, editorial, and wine generation per PROTEIN-005 |
| **FOOD-14F** | Publication reflects final entity set; redirects certified for compatibility URLs |

Deprecated protein entities must not generate structural runtime edges, new editorial edges, or new wine edges. Compatibility is limited to catalog metadata, URL redirects, and migration-map entries until explicit removal by future governance amendment.

---

## 8. Suite Governance Rules Applied to Refinement

FOOD-14 applies the full suite governance lineage retroactively to Protein:

| Rule | Application in FOOD-14 |
|------|------------------------|
| **CANON-001** | One canonical owner per culinary concept |
| **BOTAN-001** | Botanical identity references use canonical species fields |
| **PROC-001** | Processing splits defer to owning domain when processing defines identity |
| **FRUIT-001** | Fruit entities reference `food.fruit.*`, not protein duplicates |
| **NUT-001 / LEGUME-002** | Nuts, seeds, legumes reference canonical domain IDs |
| **SAUCE-001 / SAUCE-PAIR-001** | Sauce pairings reference `food.sauce-condiment.*`; pair by culinary function |
| **SWEET-001 / SWEET-PAIR-001** | Sweet interactions reference `food.sweet-flavor.*` editorially |

---

## 9. PROTEIN-001 — Ownership Transfer Rule

**Introduced:** FOOD-14A · **Exercised** in FOOD-14B ownership reconciliation.

> When a culinary concept is canonically owned by another published domain, Protein must reference that domain's canonical ID and must not retain duplicate intrinsic identity.

| Requirement | Detail |
|-------------|--------|
| Canonical reference | Editorial edges use `food.{domain}.*` IDs |
| No intrinsic duplication | Flavor, texture, species, and processing fields are not copied |
| Deprecation path | Legacy protein IDs marked deprecated before removal |
| Seitan exception | Wheat-protein preparation stays in Protein |

---

## 10. PROTEIN-002 — Compatibility & URL Stability Rule

**Introduced:** FOOD-14A · **Enforced** in FOOD-14B and FOOD-14F.

> Published Protein URLs and IDs remain stable unless an approved migration plan provides explicit redirects and certification.

| Requirement | Detail |
|-------------|--------|
| URL continuity | `/foods/{slug}/` preserved or redirected |
| ID immutability | `food.protein.*` IDs not changed in place |
| Migration documentation | Mapping table required for every retired entity |
| Certification | Redirect and link validation in FOOD-14F release certification |

---

## 11. PROTEIN-003 — Seafood Taxonomy Rule

**Introduced:** FOOD-14A · **Exercised** in FOOD-14B catalog refinement.

> Seafood entities in Protein must reflect poster-level granularity across fin-fish, crustaceans, mollusks, and cephalopods without duplicating entities owned by other domains.

| Poster target | Current Protein groups | Refinement objective |
|---------------|-------------------------|----------------------|
| Fish (tuna, cod, trout, bass) | `fin-fish` | Close poster gaps; normalize naming |
| Lobster & Shellfish (prawn, crab, langoustine) | `crustaceans`, `cephalopods` | Poster-level entity coverage |
| Mollusks (oyster, mussel, clam) | `mollusks` | Poster-level entity coverage |

Seafood refinement adds or normalizes entities **within Protein** — it does not create a new seafood domain.

---

## 12. PROTEIN-004 — Cured Meat Identity Rule

**Introduced:** FOOD-14A · **Exercised** in FOOD-14B catalog refinement.

> Cured and preserved meat forms with established culinary identity belong in Protein when the pairing subject is the cured product itself, not a composed dish or sauce.

| Canonical in Protein | Not canonical in Protein |
|----------------------|--------------------------|
| Bacon, pancetta, ham (existing) | Burgers, sandwiches, composed plates |
| Prosciutto, salami (poster gaps) | Marinades, rubs, sauce preparations |
| Smoked/cured fish products | Recipe-level preparations |

A dedicated **cured-meat** group may be introduced in FOOD-14B to close poster coverage.

---

## 13. PROTEIN-005 — Canonical Deprecation Lifecycle

**Introduced:** FOOD-14A · **Enforced** in FOOD-14B through FOOD-14F.

> A migrated Protein entity has a deterministic deprecation lifecycle. Its participation in each knowledge layer is explicit — no ambiguity about whether deprecated entities continue in runtime or editorial compilation.

| Layer / artifact | Deprecated entity behavior |
|------------------|----------------------------|
| **Catalog** | Present **only** as compatibility metadata during the migration window (`deprecated: true`, `canonical_id` forward reference) |
| **Runtime (L1+L2)** | **Excluded** from structural and intrinsic edge generation |
| **Editorial (L3)** | **Excluded** from new editorial edge generation as source or target |
| **Wine (L4)** | **Excluded** from new wine edge generation as source or target |
| **Publication** | Retained **only** for URL compatibility and redirect certification |
| **Migration map** | Entry required in `data/protein-migration-map.json` with `status: "deprecated"` |
| **Removal** | Catalog entry removed **only** after an explicit future governance amendment |

This rule makes deprecation deterministic across all FOOD-14 compile phases and prevents deprecated entities from silently re-entering runtime or relationship graphs.

---

## 14. PROTEIN-PAIR-001 — Wine Pairing Refinement Rule

**Introduced:** FOOD-14A · **Exercised** in FOOD-14E.

> Protein wine pairings must leverage the completed suite context — referencing canonical wine style IDs and incorporating sauce, condiment, and sweet-flavor cross-domain awareness editorially where pairing intelligence requires it.

| Dimension | Policy |
|-----------|--------|
| Wine IDs | Canonical wine style catalog slugs only |
| Cross-domain pairing context | Editorial references to sauce/sweet domains; no intrinsic duplication |
| Confidence | Explicit confidence and pairing method on every edge |
| Layer isolation | Wine edges do not modify structural taxonomy |
| Expansion target | Meaningful increase from 29 baseline edges without artificial inflation |

Existing `pairs_with_style` vocabulary remains for Protein unless a migration to FOOD-13E-style vocabulary is explicitly approved in FOOD-14E governance addendum.

---

## 15. Editorial Layer Expansion Policy

Protein currently has `crossDomainTargets: []` — unlike all ten peer domains published at v2.0.0.

| FOOD-14D objective | Detail |
|--------------------|--------|
| Enable cross-domain editorial | Add `commonly_served_with` to `crossDomainTargets` |
| Remove obsolete forward references | Replace temporary or broken references |
| Normalize substitutions | Align with suite editorial patterns |
| Expand edge scale | Target representative coverage comparable to peer domains |
| Preserve preparation refs | Existing `preparation.*` editorial targets remain valid |

FOOD-14D does not modify runtime structural edges.

---

## 16. Lifecycle & Next Phases

| Phase | Scope | Entity changes |
|-------|-------|----------------|
| **FOOD-14A** (this document) | Governance freeze | **None** |
| FOOD-14B | Ownership reconciliation + catalog amendments + `data/protein-migration-map.json` | Yes — governed by PROTEIN-001–005 |
| FOOD-14C | Runtime normalization + certification | Recompile only |
| FOOD-14D | Editorial refinement | Editorial layer only |
| FOOD-14E | Wine pairing refinement | Wine layer only |
| FOOD-14F | Publication refresh via shared platform | Read-only consumption |

**Next work:** FOOD-14B — Ownership reconciliation (pending explicit approval).

---

## 17. Expected Suite Milestone (post-FOOD-14F)

Completion of FOOD-14 produces **Food Ontology Suite v2.1.0** — eleven fully harmonized ontology domains with Protein aligned to all subsequent governance rules.

| Expected outcome | Detail |
|------------------|--------|
| Published domains | 11 (unchanged) |
| Cross-domain references | Canonical IDs only |
| Protein quality | Historical compromises eliminated |
| Platform | Unchanged shared pipeline |
| Next roadmap phase | ENGINE (reasoning and pairing engine development) |

---

## Approval

| Role | Status | Date |
|------|--------|------|
| FOOD-14A Governance | **Frozen v1.0.0** | August 9, 2026 |
| FOOD-14B Catalog reconciliation | Pending approval | — |
