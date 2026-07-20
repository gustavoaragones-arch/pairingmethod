# Food Ontology Suite — Release Notes & Suite Metrics

**Purpose:** Quantitative release history for the Food Ontology Suite. Each suite tag documents published domains and cumulative knowledge growth — not platform complexity.

**Platform baseline:** v1.0.0 (frozen)  
**Canonical lifecycle:** Governance → Catalog → Runtime → Editorial → Wine Pairings → Publication

### Runtime Projection Principle (suite-wide)

Formalized at FOOD-06C:

> **Runtime artifacts are projections, never sources of truth.**

| Rule | Detail |
|------|--------|
| Catalogs are authoritative | `data/*-catalog.json` is the SSOT for intrinsic knowledge |
| Runtime is regenerated | `data/runtime/*` is always recompiled from catalog — never hand-edited |
| Editorial layers are separate | FOOD-XXD/E artifacts do not modify runtime bootstrap outputs |
| Publication consumes runtime | FOOD-XXF reads runtime + editorial + pairing layers — not catalogs directly |

This principle has been followed in practice since Protein FOOD-02C. FOOD-06C makes it explicit across all Food Ontology domains.

### Knowledge layer separation (suite-wide)

Proven across five domains (Protein, Cheese, Vegetables, Fungi, Herb & Spice):

| Layer | Source | Modified at publication? |
|-------|--------|--------------------------|
| Level 1–2 runtime | Catalog projection | Never |
| Level 3 editorial | Curated seed | Never |
| Wine pairings | Curated seed | Never |
| Publication | Assembles all three | Read-only consumption |

Publication is the **only** phase that merges runtime, editorial, and wine layers into production pages.

---

## Suite Architecture (Authoritative)

**Single source of truth** for cross-domain invariants. Domain governance and blueprints **reference** this section — they do not restate these rules differently.

### Domain Independence Principle

Operational from FOOD-04 onward (Cheese, Vegetable, Fungi); conceptually applied to Protein (pre-FOOD-0N naming).

Every new ontology domain is evaluated against four questions **before implementation**:

| Question | If **yes** | If **no** |
|----------|------------|-----------|
| **Does this require a new ontology domain?** | FOOD-0N lifecycle (governance → publication) | Extend an existing domain |
| **Is this intrinsic knowledge?** | Catalog + runtime (structural layer) | Editorial or wine-pairing layer |
| **Is this computational reasoning?** | Pairing Engine (ENGINE-XX) | Never ontology |
| **Does this require a platform change?** | Burden of proof is **extremely high** | Domain additions alone never justify platform modification |

Domain additions alone never justify platform modification.

### CANON-001 — Canonical Entity Rule

Each leaf entity represents **one canonical culinary ingredient** — not every botanical cultivar, color variant, commercial trade name, or regional commercial product.

| Include | Do not include (use `aliases` instead) |
|---------|----------------------------------------|
| Canonical ingredient recognized globally | Color or size splits (red onion, yellow onion) |
| Distinct culinary identity when kitchen behavior diverges | Regional commercial products without global recognition |
| One entity per canonical ingredient | Duplicate entities for trade names |

**First codified:** Vegetable FOOD-05A §5.1 · **Enforced in catalog audit** from FOOD-05B and FOOD-06B onward.

### CANON-002 — Global Culinary Recognition Rule

Catalog entities must represent **globally recognizable culinary ingredients**, not regional commercial products or niche trade names.

**Introduced:** Fungi FOOD-06B · **Applies** to all future FOOD-0N catalog population phases unless a governance amendment documents an exception.

---

## Ontology Lifecycle (Suite Standard)

Every published domain follows the **identical six-phase lifecycle**. Phase prefixes differ by domain (`FOOD-02`/`ONTOLOGY-02` for Protein, `FOOD-04` for Cheese, `FOOD-05` for Vegetable, `FOOD-06` for Fungi, `FOOD-07` for Herb & Spice) but the stages are the same:

| Stage | Letter | Scope |
|-------|--------|-------|
| Governance | A | Frozen contract — no entities |
| Catalog | B | SSOT population + audit |
| Runtime | C | Deterministic structural + intrinsic similarity |
| Editorial | D | Curated relationships (separate artifact) |
| Wine Pairings | E | Curated pairings (separate artifact) |
| Publication | F | Platform consumption only — no artifact editing |

**No domain-specific lifecycle exceptions** exist among the five published domains.

---

## Documentation Hierarchy

| Layer | Document | Responsibility |
|-------|----------|----------------|
| Vision | Poster inspiration (Wine Folly pairing method) | Original pairing vision |
| Roadmap | [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01) | Poster → ontology mapping, frozen roadmap |
| Suite | **This document** | Release history, cumulative metrics, suite architecture |
| Domain governance | `*_GOVERNANCE.md` | Frozen domain contract, vocabularies, policies |
| Domain blueprint | `*_TAXONOMY_BLUEPRINT.md` | Taxonomy targets, population plans |

Domain governance documents define **domain-specific** rules only. Suite-wide invariants live here.

---

## Suite Metrics (mandatory section)

Every suite release note includes this table. It reinforces the primary architectural achievement since Platform v1.0.0: **each new domain increases knowledge, not platform complexity.**

| Metric | v1.0.0 | v1.1.0 | v1.2.0 | v1.3.0 | v1.4.0 |
|--------|--------|--------|--------|--------|--------|
| Published ontology domains | 1 | 2 | 3 | 4 | **5** |
| Canonical entities (leaf) | 207 | 411 | 485 | 528 | **641** |
| Runtime relationship edges (cumulative) | ~36,000 | ~80,000 | ~85,000 | ~85,500+ | **~91,900** |
| Editorial relationship edges (cumulative) | ~40 | ~125 | ~280 | ~370 | **~650** |
| Wine pairing relationships (cumulative) | ~30 | ~100 | ~220 | ~300 | **~520** |
| Publication lifecycle reuse | 100% | 100% | 100% | 100% | **100%** |
| Platform modifications required | 0 | 0 | 0 | 0 | **0** |

*Edge counts are measured from certified runtime artifacts at release time (structural + intrinsic similarity layers for runtime; editorial and wine layers reported separately).*

**Certified totals at v1.4.0 (exact):** runtime structural 91,912 · editorial 650 · wine pairings 522 · leaf entities 641.

---

## v1.4.0 — Herb & Spice

**Tag:** `food-ontology-suite-v1.4.0`  
**Commit:** FOOD-07F — Publish Herb & Spice Ontology through shared platform  
**Date:** July 19, 2026

### Published domains

| Domain | Catalog version | Leaf entities | Publication paths |
|--------|-----------------|---------------|-------------------|
| Protein Foods | 1.0.0 | 207 | `/foods/` |
| Cheeses | 1.0.0 | 204 | `/cheeses/` |
| Vegetables | 1.0.0 | 74 | `/vegetables/` |
| Fungi | 1.0.0 | 43 | `/fungi/` |
| Herb & Spice | 1.0.0 | 113 | `/herbs-spices/` |

**Suite total:** 641 canonical leaf entities · 118 new herb & spice pages (113 leaf + 4 groups + 1 category hub)

### FOOD-07 release certification

| Metric | FOOD-07 |
|--------|--------:|
| Canonical herb & spice entities | 113 |
| Runtime relationships | 6,384 |
| Editorial relationships | 280 |
| Wine relationships | 224 |
| Publication pages | 118 |
| Platform modifications required | 0 |
| Shared publication pipeline reused | 100% |

### Milestone significance

FOOD-07F validates the generalized publication platform across a **fifth independent domain** with zero architectural modification — the largest single-domain leaf catalog added to date (113 entities). The Dominant Flavor Rule and BOTAN-001 botanical consistency constraints were absorbed entirely within the knowledge layer, without platform changes.

### Platform status at v1.4.0

Publication architecture, runtime architecture, certification pipeline, deployment pipeline, and the six-phase governance lifecycle remain **feature-complete and frozen**. Architectural changes require exceptional justification.

### Next planned work

**FOOD-08 — Potato & Starch Class Ontology** (from tag `food-ontology-suite-v1.4.0`).

---

## v1.3.0 — Fungi

**Tag:** `food-ontology-suite-v1.3.0`  
**Commit:** FOOD-06F — Publish Fungi Ontology through shared platform  
**Date:** July 18, 2026

### Published domains

| Domain | Catalog version | Leaf entities | Publication paths |
|--------|-----------------|---------------|-------------------|
| Protein Foods | 1.0.0 | 207 | `/foods/` |
| Cheeses | 1.0.0 | 204 | `/cheeses/` |
| Vegetables | 1.0.0 | 74 | `/vegetables/` |
| Fungi | 1.0.0 | 43 | `/fungi/` |

**Suite total:** 528 canonical leaf entities · 48 new fungi pages (43 leaf + 4 groups + 1 category hub)

### FOOD-06 release certification

| Metric | FOOD-06 |
|--------|--------:|
| Canonical fungi | 43 |
| Runtime relationships | 531 |
| Editorial relationships | 87 |
| Wine relationships | 82 |
| Publication pages | 48 |
| Platform modifications required | 0 |
| Shared publication pipeline reused | 100% |

### Milestone significance

FOOD-06F validates the generalized publication platform across a **fourth independent domain** with zero architectural modification. The knowledge layer separation (runtime · editorial · wine · publication) is now proven across four domains and should be treated as a permanent architectural invariant.

### Platform status at v1.3.0

Publication architecture, runtime architecture, certification pipeline, deployment pipeline, and the six-phase governance lifecycle remain **feature-complete and frozen**. Architectural changes require exceptional justification.

### Next planned work

**FOOD-07A — Herb & Spice Ontology Governance** (completed — see v1.4.0).

---

## SUITE-STAB-01 — Food Ontology Suite Stabilization (Post-v1.3.0)

**Date:** July 19, 2026  
**Baseline tag:** `food-ontology-suite-v1.3.0`  
**Type:** Governance audit — not a versioned release  
**Overall result:** **PASS**

Post-v1.3.0 checkpoint certifying that the Food Ontology Suite methodology remains internally consistent after four published domains. No runtime, catalog, relationship, publication, or code changes were made except documentation corrections noted below.

| Audit | Scope | Result |
|-------|-------|--------|
| 1 — Architectural Invariants | Runtime Projection, Knowledge Layer Separation, Domain Independence, CANON-001, CANON-002 | **PASS** — consolidated in §Suite Architecture (this document) |
| 2 — Lifecycle Consistency | Six-phase lifecycle across Protein, Cheese, Vegetable, Fungi | **PASS** — no domain exceptions |
| 3 — Documentation Hierarchy | Vision → POSTER_COVERAGE → Suite Releases → Governance → Blueprints | **PASS** — overlapping invariant text deduplicated |
| 4 — Cross-Domain Ownership | Canonical IDs, forward references, deferred migrations | **PASS** — Protein `mushrooms` → Fungi ownership deferred to FOOD-14 |
| 5 — Release Metrics | Cumulative metrics vs certified release summaries | **PASS** — reconciled (editorial ~370, wine ~300, runtime ~85,500) |
| 6 — Frozen Roadmap | FOOD-07 through ENGINE-03 sequence | **PASS** — unchanged |

**Platform modifications identified:** 0

**Next work:** **FOOD-07A — Herb & Spice Ontology Governance** (completed — see v1.4.0).

---

## v1.2.0 — Vegetables

**Tag:** `food-ontology-suite-v1.2.0`  
**Commit:** `8ac9af9` — FOOD-05F — Publish Vegetable Ontology through shared platform  
**Date:** July 18, 2026

### Published domains

| Domain | Catalog version | Leaf entities | Publication paths |
|--------|-----------------|---------------|-------------------|
| Protein Foods | 1.0.0 | 207 | `/foods/` |
| Cheeses | 1.0.0 | 204 | `/cheeses/` |
| Vegetables | 1.0.0 | 74 | `/vegetables/` |

**Suite total:** 485 canonical leaf entities · 79 new vegetable pages (74 leaf + 4 groups + 1 category hub)

### Milestone significance

FOOD-05F validates the generalized publication platform across a **third independent domain** with zero architectural modification. The six-phase ontology lifecycle is now proven and should be treated as canonical for all remaining FOOD-0N domains.

### Platform status at v1.2.0

Unless a future ontology exposes a genuine cross-domain requirement, the following are **feature-complete and frozen**:

- Publication architecture
- Runtime architecture
- Certification pipeline
- Deployment pipeline
- Governance lifecycle (six phases)

Architectural changes require exceptional justification.

### Next planned work

**FOOD-06 — Fungi Ontology** (from tag `food-ontology-suite-v1.2.0`). See [`FUNGI_ONTOLOGY_BRIEF.md`](FUNGI_ONTOLOGY_BRIEF.md).

---

## v1.1.0 — Cheeses

**Tag:** `food-ontology-suite-v1.1.0`  
**Commit:** `316b525` (FOOD-04F — generalized publication platform)

First multi-domain food ontology release. Introduced shared publication engine (`lib/food-publication/*`) and declarative domain configuration (`lib/food-domain-config.js`).

| Domain | Leaf entities |
|--------|---------------|
| Protein Foods | 207 |
| Cheeses | 204 |

---

## v1.0.0 — Protein Foods

**Tag:** `food-ontology-suite-v1.0.0`

First published food ontology domain. Established catalog SSOT, runtime compilation, editorial layer, wine pairings, and static publication for protein foods.

| Domain | Leaf entities |
|--------|---------------|
| Protein Foods | 207 |

---

## Project history

```
Platform
└── v1.0.0

Food Ontology Suite
├── v1.0.0  Protein Foods
├── v1.1.0  + Cheeses
├── v1.2.0  + Vegetables
├── v1.3.0  + Fungi
└── v1.4.0  + Herb & Spice   ← current production milestone

Master Roadmap
└── PLAN-01  (POSTER_COVERAGE.md)
```
