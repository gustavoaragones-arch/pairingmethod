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

Proven across four domains (Protein, Cheese, Vegetables, Fungi):

| Layer | Source | Modified at publication? |
|-------|--------|--------------------------|
| Level 1–2 runtime | Catalog projection | Never |
| Level 3 editorial | Curated seed | Never |
| Wine pairings | Curated seed | Never |
| Publication | Assembles all three | Read-only consumption |

Publication is the **only** phase that merges runtime, editorial, and wine layers into production pages.

---

## Suite Metrics (mandatory section)

Every suite release note includes this table. It reinforces the primary architectural achievement since Platform v1.0.0: **each new domain increases knowledge, not platform complexity.**

| Metric | v1.0.0 | v1.1.0 | v1.2.0 | v1.3.0 |
|--------|--------|--------|--------|--------|
| Published ontology domains | 1 | 2 | 3 | **4** |
| Canonical entities (leaf) | 207 | 411 | 485 | **528** |
| Runtime relationship edges (cumulative) | ~36,000 | ~80,000 | ~85,000 | **~85,500+** |
| Editorial relationship edges (cumulative) | ~40 | ~125 | ~280 | **~360+** |
| Wine pairing relationships (cumulative) | ~30 | ~100 | ~220 | **~300+** |
| Publication lifecycle reuse | 100% | 100% | 100% | **100%** |
| Platform modifications required | 0 | 0 | 0 | **0** |

*Edge counts are measured from certified runtime artifacts at release time (structural + intrinsic similarity layers for runtime; editorial and wine layers reported separately).*

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

**Suite Stabilization checkpoint**, then **FOOD-07 — Herb & Spice Ontology**.

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
└── v1.3.0  + Fungi   ← current production milestone

Master Roadmap
└── PLAN-01  (POSTER_COVERAGE.md)
```
