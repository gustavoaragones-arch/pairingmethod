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

Proven across seven domains (Protein, Cheese, Vegetables, Fungi, Herb & Spice, Grain & Starch, Fruit):

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

### BOTAN-001 — Botanical Ownership Rule

When the same botanical species produces multiple culinary ingredients, governance decides whether they are **one canonical entity with aliases** or **separate canonical culinary ingredients** based on **culinary identity**, not botanical identity alone.

**First codified:** Herb & Spice FOOD-07A · **Applies** when botanical lineage and culinary identity diverge (for example, cilantro leaf vs coriander seed; dill leaf vs dill seed). Domain governance documents frozen decisions; the rule is suite-wide.

### PROC-001 — Processing Ownership Rule

When an ingredient exists in multiple culinary processing states, governance decides whether a processed form is a **new canonical culinary ingredient** or merely a **preparation state / alias**.

The decision follows **culinary identity**, not manufacturing process alone.

| Separate canonical entities | Alias / preparation state only |
|----------------------------|--------------------------------|
| Wheat → Wheat Flour | Ground Black Pepper → alias on Black Pepper |
| Rice → Rice Flour | Ground Cinnamon → alias on Cinnamon |
| Corn → Cornmeal → Cornstarch (by processing level) | Rolled Oats / Quick Oats → aliases on Oats (default) |
| Potato (Vegetable) → Potato Starch (Grain & Starch) | Instant Rice → alias on Rice (default) |

**Introduced:** Grain & Starch FOOD-08A · **Applies** suite-wide to all domains where processing affects culinary identity (including future Sweet Flavor, Sauces & Condiments, and Protein Refinement phases).

### STARCH-001 — Functional Pairing Rule

Wine pairing decisions must follow the ingredient's **culinary function** in the finished dish, not the ingredient's botanical origin or processing history.

| Pairing basis | Examples |
|---------------|----------|
| Culinary function in context | Plain rice → neutral pairing profile; semolina → durum/pasta identity |
| No thickening-only affinity | Cornstarch, potato starch → no wine affinity from slurry function alone |
| No processing inheritance | Potato Starch does not inherit from Potato (Vegetable); wheat flour pairs by dough context, not whole wheat berry |

**Introduced:** Grain & Starch FOOD-08E · **Applies** to wine pairing layers (FOOD-XXE) across all domains where an ingredient's kitchen role diverges from its botanical or manufacturing source.

### FRUIT-001 — Processing Ownership Rule (Fruit)

When a fruit exists in multiple culinary processing states, governance decides whether a processed form is a **new canonical culinary ingredient** or merely a **preparation state / alias**, following **culinary identity** — not manufacturing process alone.

| Separate canonical entities | Alias / preparation state only |
|----------------------------|--------------------------------|
| Grape → Raisin → Golden Raisin → Sultanas | Color or cultivar splits on aliases |
| Plum → Prune | Fresh vs dried when kitchen behavior diverges |
| Coconut → Desiccated Coconut → Coconut Milk | Distinct culinary roles per form |

**Introduced:** Fruit FOOD-09A · **Applies** to catalog, runtime, editorial, and wine pairing layers for the Fruit domain and informs cross-domain discipline suite-wide.

### FRUIT-PAIR-001 — Culinary Role Pairing Rule

Wine recommendations for fruit ingredients must follow the fruit's **culinary role as an ingredient**, not simply its botanical origin or sweetness.

| Pairing basis | Examples |
|---------------|----------|
| Culinary role in context | Lemon → acidity and freshness; raisin → dried-fruit profile |
| Processed-form identity | Coconut milk → rich creamy applications; coconut → fresh tropical use |
| No processing inheritance | Raisin does not inherit fresh grape pairings; prune pairs to braise context, not fresh plum |

**Introduced:** Fruit FOOD-09E · **Applies** to wine pairing layers where processed fruit forms retain distinct kitchen identities per FRUIT-001.

---

## Ontology Lifecycle (Suite Standard)

Every published domain follows the **identical six-phase lifecycle**. Phase prefixes differ by domain (`FOOD-02`/`ONTOLOGY-02` for Protein, `FOOD-04` for Cheese, `FOOD-05` for Vegetable, `FOOD-06` for Fungi, `FOOD-07` for Herb & Spice, `FOOD-08` for Grain & Starch, `FOOD-09` for Fruit) but the stages are the same:

| Stage | Letter | Scope |
|-------|--------|-------|
| Governance | A | Frozen contract — no entities |
| Catalog | B | SSOT population + audit |
| Runtime | C | Deterministic structural + intrinsic similarity |
| Editorial | D | Curated relationships (separate artifact) |
| Wine Pairings | E | Curated pairings (separate artifact) |
| Publication | F | Platform consumption only — no artifact editing |

**No domain-specific lifecycle exceptions** exist among the seven published domains.

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

| Metric | v1.0.0 | v1.1.0 | v1.2.0 | v1.3.0 | v1.4.0 | v1.5.0 | v1.6.0 |
|--------|--------|--------|--------|--------|--------|--------|--------|
| Published ontology domains | 1 | 2 | 3 | 4 | 5 | 6 | **7** |
| Canonical entities (leaf) | 207 | 411 | 485 | 528 | 641 | 717 | **836** |
| Runtime relationship edges (cumulative) | ~36,000 | ~80,000 | ~85,000 | ~85,500+ | ~91,900 | ~93,800 | **~97,900** |
| Editorial relationship edges (cumulative) | ~40 | ~125 | ~280 | ~370 | ~650 | ~840 | **~1,175** |
| Wine pairing relationships (cumulative) | ~30 | ~100 | ~220 | ~300 | ~520 | ~700 | **~960** |
| Publication lifecycle reuse | 100% | 100% | 100% | 100% | 100% | 100% | **100%** |
| Platform modifications required | 0 | 0 | 0 | 0 | 0 | 0 | **0** |

*Edge counts are measured from certified runtime artifacts at release time (structural + intrinsic similarity layers for runtime; editorial and wine layers reported separately).*

**Certified totals at v1.4.0 (exact):** runtime structural 91,912 · editorial 650 · wine pairings 522 · leaf entities 641.

**Certified totals at v1.5.0 (exact):** runtime structural 93,829 · editorial 842 · wine pairings 696 · leaf entities 717.

**Certified totals at v1.6.0 (exact):** runtime structural 97,856 · editorial 1,175 · wine pairings 961 · leaf entities 836.

---

## v1.6.0 — Fruit

**Tag:** `food-ontology-suite-v1.6.0`  
**Commit:** FOOD-09F — Publish Fruit Ontology  
**Date:** July 19, 2026

### Published domains

| Domain | Catalog version | Leaf entities | Publication paths |
|--------|-----------------|---------------|-------------------|
| Protein Foods | 1.0.0 | 207 | `/foods/` |
| Cheeses | 1.0.0 | 204 | `/cheeses/` |
| Vegetables | 1.0.0 | 74 | `/vegetables/` |
| Fungi | 1.0.0 | 43 | `/fungi/` |
| Herb & Spice | 1.0.0 | 113 | `/herbs-spices/` |
| Grain & Starch | 1.0.0 | 76 | `/grains-starches/` |
| Fruit | 1.0.0 | 119 | `/fruits/` |

**Suite total:** 836 canonical leaf entities · 127 new fruit pages (119 leaf + 7 groups + 1 category hub)

### FOOD-09 release certification

| Metric | FOOD-09 |
|--------|--------:|
| Canonical fruit entities | 119 |
| Runtime relationships | 4,027 |
| Editorial relationships | 333 |
| Wine relationships | 265 |
| Publication pages | 127 |
| Platform modifications required | 0 |
| Shared publication pipeline reused | 100% |

### Milestone significance

FOOD-09F validates the generalized publication platform across a **seventh independent domain** with zero architectural modification. FRUIT-001 processing ownership and FRUIT-PAIR-001 culinary-role pairing governance were absorbed entirely within the knowledge layer — including distinct pairing profiles for grape/raisin, plum/prune, and coconut form families.

### Platform status at v1.6.0

Publication architecture, runtime architecture, certification pipeline, deployment pipeline, and the six-phase governance lifecycle remain **feature-complete and frozen**. Architectural changes require exceptional justification.

### Next planned work

**SUITE-STAB-04** stabilization checkpoint (completed — see below), then **FOOD-10 — Nut & Seed Ontology** (from tag `food-ontology-suite-v1.6.0`; see POSTER_COVERAGE.md).

---

## SUITE-STAB-04 — Food Ontology Suite Stabilization (Post-v1.6.0)

**Date:** July 20, 2026  
**Baseline tag:** `food-ontology-suite-v1.6.0`  
**Type:** Governance audit — not a versioned release  
**Overall result:** **PASS**

Post-v1.6.0 checkpoint certifying that the publication platform successfully absorbed a seventh domain (119 leaf entities · 4,027 runtime edges) without architectural drift. No runtime, catalog, relationship, publication, or platform code changes were made in this audit.

| Audit | Scope | Result |
|-------|-------|--------|
| 1 — Release Metrics Reconciliation | v1.6.0 cumulative totals vs certified runtime artifacts | **PASS** |
| 2 — Seven-Domain Architecture Audit | Declarative integration via `food-domain-config.js`, per-domain render modules, shared template | **PASS** |
| 3 — Knowledge Layer Consistency | Complete four-layer model (runtime, editorial, wine, publication) across all seven domains | **PASS** |
| 4 — Cross-Domain Ownership Audit | CANON-001, CANON-002, BOTAN-001, PROC-001, STARCH-001, FRUIT-001, FRUIT-PAIR-001 | **PASS** |
| 5 — Forward Reference Audit | Canonical-ID forward references; unresolved targets limited to future planned domains | **PASS** |

**Platform modifications identified:** 0

### Audit 1 — Release metrics reconciliation

Certified edge counts measured from `data/runtime/*-relationships.json` at tag `food-ontology-suite-v1.6.0`:

| Domain | Leaf entities | Runtime | Editorial | Wine |
|--------|-------------:|--------:|----------:|-----:|
| Protein Foods | 207 | 35,734 | 40 | 29 |
| Cheeses | 204 | 44,858 | 85 | 70 |
| Vegetables | 74 | 4,405 | 158 | 117 |
| Fungi | 43 | 531 | 87 | 82 |
| Herb & Spice | 113 | 6,384 | 280 | 224 |
| Grain & Starch | 76 | 1,917 | 192 | 174 |
| Fruit | 119 | 4,027 | 333 | 265 |
| **Suite total** | **836** | **97,856** | **1,175** | **961** |

All v1.6.0 suite metrics reconcile exactly against certified artifacts. Fruit per-domain release summary (`reports/fruit-release-certification-report.json`) matches independently (119 leaf · 4,027 runtime · 333 editorial · 265 wine · 127 publication pages).

### Audit 2 — Seven-domain architecture audit

| Domain | Config registry | Render module | Shared template | Platform audit |
|--------|-----------------|---------------|-----------------|----------------|
| Protein Foods | `PROTEIN_DOMAIN` | `taxonomy-protein-food-render.js` | `protein-entity-template.html` | Published pre-audit era |
| Cheeses | `CHEESE_DOMAIN` | `taxonomy-cheese-render.js` | same | Published pre-audit era |
| Vegetables | `VEGETABLE_DOMAIN` | `taxonomy-vegetable-render.js` | same | Published pre-audit era |
| Fungi | `FUNGI_DOMAIN` | `taxonomy-fungi-render.js` | same | 0 modifications · 100% reuse |
| Herb & Spice | `HERB_SPICE_DOMAIN` | `taxonomy-herb-spice-render.js` | same | 0 modifications · 100% reuse |
| Grain & Starch | `GRAIN_STARCH_DOMAIN` | `taxonomy-grain-starch-render.js` | same | 0 modifications · 100% reuse |
| Fruit | `FRUIT_DOMAIN` | `taxonomy-fruit-render.js` | same | 0 modifications · 100% reuse |

FOOD-09F integrated Fruit through declarative domain configuration and a domain-specific render module only. `lib/food-publication/html.js` registers all seven domains in `DEFAULT_RENDER_EXPORTS`. No changes to shared publication stage runners in `lib/food-publication/*` were required beyond the Fruit render export mapping added at FOOD-09F.

Each published domain exposes the same nine thin wrapper scripts delegating to shared stage runners:

`projections → pages → schema → links → search-index → certify-publication → html → sitemap → certify-release`

| Domain | `publish:*` | `release:*` | Release certification |
|--------|-------------|-------------|---------------------|
| Protein Foods | ✓ | ✓ | PASS |
| Cheeses | ✓ | ✓ | PASS |
| Vegetables | ✓ | ✓ | PASS |
| Fungi | ✓ | ✓ | PASS |
| Herb & Spice | ✓ | ✓ | PASS |
| Grain & Starch | ✓ | ✓ | PASS |
| Fruit | ✓ | ✓ | PASS |

`lib/deployment-config.js` registers all seven domains. `release:food-ontology` includes Fruit.

### Audit 3 — Knowledge layer consistency

Every published domain implements the complete four-layer knowledge model with separate runtime artifacts and certified publication consumption:

| Layer | Artifact pattern | Modified at publication? |
|-------|------------------|--------------------------|
| Runtime (Level 1–2) | `data/runtime/{domain}-relationships.json` | Never |
| Editorial (Level 3) | `data/runtime/{domain}-editorial-relationships.json` | Never |
| Wine pairings (Level 4) | `data/runtime/{domain}-wine-relationships.json` | Never |
| Publication | Projections · pages · schema · links · search · HTML · sitemap | Read-only assembly |

All seven domains: runtime + editorial + wine artifacts present · release certification **PASS** · no architectural divergence from the suite lifecycle standard.

Fruit is the largest domain published to date (119 leaf entities) and confirms the four-layer model scales without platform changes.

### Audit 4 — Cross-domain ownership audit

| Rule | Documented in §Suite Architecture | Exercised in published domains |
|------|-------------------------------------|--------------------------------|
| CANON-001 | ✓ | Catalog audit — all domains with FOOD-XXB audit scripts |
| CANON-002 | ✓ | Catalog audit — Fungi · Herb & Spice · Grain & Starch · Fruit |
| BOTAN-001 | ✓ | Herb & Spice catalog · editorial · wine (cilantro/coriander · dill leaf/seed) |
| PROC-001 | ✓ | Grain & Starch · Fruit catalog · runtime · editorial · wine · publication |
| STARCH-001 | ✓ | Grain & Starch wine pairing seed · mapper validation |
| FRUIT-001 | ✓ (added at STAB-04) | Fruit catalog · runtime · editorial · wine · publication |
| FRUIT-PAIR-001 | ✓ (added at STAB-04) | Fruit wine pairing seed · mapper validation |

| Ownership check | Result |
|-----------------|--------|
| FRUIT-001 processing families (grape/raisin, plum/prune, coconut forms) | **PASS** — distinct entities and distinct pairing profiles across all four knowledge layers |
| PROC-001 processing families (Grain & Starch) | **PASS** — unchanged from SUITE-STAB-03 |
| BOTAN-001 botanical ownership (Herb & Spice) | **PASS** — unchanged from SUITE-STAB-03 |
| Cross-domain ingredient ownership (mustard, fennel) | **PASS** — unchanged from SUITE-STAB-03 |
| Tomato · pumpkin · rhubarb · olive absent from Fruit catalog (cross-domain discipline) | **PASS** — per FRUIT governance |

### Audit 5 — Forward reference audit

| Check | Result |
|-------|--------|
| Cross-domain editorial edges use structured canonical IDs (no slug-only targets) | **PASS** — 0 slug-based forward references |
| Resolved references to published domain entities | **PASS** — 1,104 edges |
| Forward references to future planned domains | **PASS** — 17 edges (`food.ingredient.*`, `food.nut.*`, `food.seed.*`, etc.) |
| Legacy fruit namespace shortcuts (`food.fruit.{slug}`) | **PASS** — 3 edges; semantically map to published Fruit canonical IDs post-FOOD-09 (e.g. `food.fruit.grape` → `food.fruit.berries.grape`) |
| Cross-domain namespace aliases to published domains (`food.herb.*`, `food.spice.*`, `food.protein.*`, `food.cheese.*`) | **PASS** — intentional Tier C forward-reference pattern unchanged since SUITE-STAB-02; all seven domains certify publication with **PASS** |
| Entity duplication via forward reference | **PASS** — none detected |

**Next work:** **FOOD-10A — Nut & Seed Ontology Governance**

---

## v1.5.0 — Grain & Starch

**Tag:** `food-ontology-suite-v1.5.0`  
**Commit:** FOOD-08F — Publish Grain & Starch Ontology through shared platform  
**Date:** July 19, 2026

### Published domains

| Domain | Catalog version | Leaf entities | Publication paths |
|--------|-----------------|---------------|-------------------|
| Protein Foods | 1.0.0 | 207 | `/foods/` |
| Cheeses | 1.0.0 | 204 | `/cheeses/` |
| Vegetables | 1.0.0 | 74 | `/vegetables/` |
| Fungi | 1.0.0 | 43 | `/fungi/` |
| Herb & Spice | 1.0.0 | 113 | `/herbs-spices/` |
| Grain & Starch | 1.0.0 | 76 | `/grains-starches/` |

**Suite total:** 717 canonical leaf entities · 81 new grain & starch pages (76 leaf + 4 groups + 1 category hub)

### FOOD-08 release certification

| Metric | FOOD-08 |
|--------|--------:|
| Canonical grain & starch entities | 76 |
| Runtime relationships | 1,917 |
| Editorial relationships | 192 |
| Wine relationships | 174 |
| Publication pages | 81 |
| Platform modifications required | 0 |
| Shared publication pipeline reused | 100% |

### Milestone significance

FOOD-08F validates the generalized publication platform across a **sixth independent domain** with zero architectural modification. PROC-001 processing ownership and STARCH-001 functional pairing governance were absorbed entirely within the knowledge layer — including cross-domain discipline such as omitting Potato from Tier C editorial forward references until the Vegetable catalog canonically includes it.

### Platform status at v1.5.0

Publication architecture, runtime architecture, certification pipeline, deployment pipeline, and the six-phase governance lifecycle remain **feature-complete and frozen**. Architectural changes require exceptional justification.

### Next planned work

**SUITE-STAB-03** stabilization checkpoint (completed — see below), then **FOOD-09 — Fruit Ontology** (from tag `food-ontology-suite-v1.5.0`; see POSTER_COVERAGE.md).

---

## SUITE-STAB-03 — Food Ontology Suite Stabilization (Post-v1.5.0)

**Date:** July 19, 2026  
**Baseline tag:** `food-ontology-suite-v1.5.0`  
**Type:** Governance audit — not a versioned release  
**Overall result:** **PASS**

Post-v1.5.0 checkpoint certifying that the publication platform successfully absorbed a sixth domain (76 leaf entities · 1,917 runtime edges) without architectural drift. No runtime, catalog, relationship, publication, or platform code changes were made in this audit.

| Audit | Scope | Result |
|-------|-------|--------|
| 1 — Release Metrics Reconciliation | v1.5.0 cumulative totals vs certified runtime artifacts | **PASS** |
| 2 — Domain Configuration Review | Declarative integration via `food-domain-config.js`, per-domain render modules, shared template | **PASS** |
| 3 — Publication Pipeline Review | Identical 9-stage publication · certification · release flow across all six domains | **PASS** |
| 4 — Cross-Domain Reference Audit | Canonical-ID forward references; PROC-001 / STARCH-001 ownership boundaries | **PASS** |
| 5 — Suite Governance Documentation | CANON-001, CANON-002, BOTAN-001, PROC-001, STARCH-001 in §Suite Architecture | **PASS** |

**Platform modifications identified:** 0

### Audit 1 — Release metrics reconciliation

Certified edge counts measured from `data/runtime/*-relationships.json` at tag `food-ontology-suite-v1.5.0`:

| Domain | Leaf entities | Runtime | Editorial | Wine |
|--------|-------------:|--------:|----------:|-----:|
| Protein Foods | 207 | 35,734 | 40 | 29 |
| Cheeses | 204 | 44,858 | 85 | 70 |
| Vegetables | 74 | 4,405 | 158 | 117 |
| Fungi | 43 | 531 | 87 | 82 |
| Herb & Spice | 113 | 6,384 | 280 | 224 |
| Grain & Starch | 76 | 1,917 | 192 | 174 |
| **Suite total** | **717** | **93,829** | **842** | **696** |

All v1.5.0 suite metrics reconcile exactly against certified artifacts. Grain & Starch per-domain release summary (`reports/grain-starch-release-certification-report.json`) matches independently.

### Audit 2 — Domain configuration review

| Domain | Config registry | Render module | Shared template | Platform audit |
|--------|-----------------|---------------|-----------------|----------------|
| Protein Foods | `PROTEIN_DOMAIN` | `taxonomy-protein-food-render.js` | `protein-entity-template.html` | Published pre-audit era |
| Cheeses | `CHEESE_DOMAIN` | `taxonomy-cheese-render.js` | same | Published pre-audit era |
| Vegetables | `VEGETABLE_DOMAIN` | `taxonomy-vegetable-render.js` | same | Published pre-audit era |
| Fungi | `FUNGI_DOMAIN` | `taxonomy-fungi-render.js` | same | 0 modifications · 100% reuse |
| Herb & Spice | `HERB_SPICE_DOMAIN` | `taxonomy-herb-spice-render.js` | same | 0 modifications · 100% reuse |
| Grain & Starch | `GRAIN_STARCH_DOMAIN` | `taxonomy-grain-starch-render.js` | same | 0 modifications · 100% reuse |

FOOD-08F integrated Grain & Starch through declarative domain configuration and a domain-specific render module only. No changes to shared publication engines in `lib/food-publication/*`.

### Audit 3 — Publication pipeline review

Each published domain exposes the same nine thin wrapper scripts delegating to shared stage runners:

`projections → pages → schema → links → search-index → certify-publication → html → sitemap → certify-release`

| Domain | `publish:*` | `release:*` | Stage runner imports verified |
|--------|-------------|-------------|-------------------------------|
| Protein Foods | ✓ | ✓ | ✓ |
| Cheeses | ✓ | ✓ | ✓ |
| Vegetables | ✓ | ✓ | ✓ |
| Fungi | ✓ | ✓ | ✓ |
| Herb & Spice | ✓ | ✓ | ✓ |
| Grain & Starch | ✓ | ✓ | ✓ |

`lib/deployment-config.js` registers all six domains. `release:food-ontology` includes Grain & Starch.

### Audit 4 — Cross-domain reference audit

| Check | Result |
|-------|--------|
| Cross-domain editorial edges use canonical IDs only | **PASS** — Tier C grain-starch forward references verified; no slug-based targets |
| PROC-001 processing ownership (Grain & Starch) | **PASS** — wheat/wheat-flour/corn/cornmeal/cornstarch and potato-starch remain distinct entities with distinct pairing profiles |
| Potato vegetable omission (Grain & Starch Tier C) | **PASS** — no forward reference to unpublished Potato vegetable entity; Potato Starch retained in-domain |
| BOTAN-001 botanical ownership (Herb & Spice) | **PASS** — unchanged from SUITE-STAB-02 |
| Cross-domain ingredient ownership (mustard, fennel) | **PASS** — unchanged from SUITE-STAB-02 |
| Forward references to unpublished domains (`food.fruit.*`, etc.) | **PASS** — canonical-ID forward references only; no entity duplication |

### Audit 5 — Suite governance documentation

| Rule | Documented in §Suite Architecture | Exercised in FOOD-08 |
|------|-------------------------------------|----------------------|
| CANON-001 | ✓ | Catalog audit |
| CANON-002 | ✓ | Catalog audit |
| BOTAN-001 | ✓ | Referenced suite-wide |
| PROC-001 | ✓ | Catalog · runtime · editorial · wine · publication |
| STARCH-001 | ✓ (added at STAB-03) | Wine pairing seed · mapper validation |

**Next work:** **FOOD-09A — Fruit Ontology Governance**

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

**FOOD-08 — Grain & Starch Ontology** (completed — see v1.5.0).

---

## SUITE-STAB-02 — Food Ontology Suite Stabilization (Post-v1.4.0)

**Date:** July 19, 2026  
**Baseline tag:** `food-ontology-suite-v1.4.0`  
**Type:** Governance audit — not a versioned release  
**Overall result:** **PASS**

Post-v1.4.0 checkpoint certifying that the publication platform successfully absorbed a significantly larger ontology (113 leaf entities · 6,384 runtime edges) without architectural drift. No runtime, catalog, relationship, publication, or platform code changes were made in this audit.

| Audit | Scope | Result |
|-------|-------|--------|
| 1 — Release Metrics Reconciliation | v1.4.0 cumulative totals vs certified runtime artifacts | **PASS** |
| 2 — Domain Configuration Review | Declarative integration via `food-domain-config.js`, per-domain render modules, shared template | **PASS** |
| 3 — Publication Pipeline Review | Identical 9-stage publication · certification · release flow across all five domains | **PASS** |
| 4 — Cross-Domain Reference Audit | Canonical-ID forward references; BOTAN-001 / fungi ownership policies unchanged | **PASS** |

**Platform modifications identified:** 0

### Audit 1 — Release metrics reconciliation

Certified edge counts measured from `data/runtime/*-relationships.json` at tag `food-ontology-suite-v1.4.0`:

| Domain | Leaf entities | Runtime | Editorial | Wine |
|--------|-------------:|--------:|----------:|-----:|
| Protein Foods | 207 | 35,734 | 40 | 29 |
| Cheeses | 204 | 44,858 | 85 | 70 |
| Vegetables | 74 | 4,405 | 158 | 117 |
| Fungi | 43 | 531 | 87 | 82 |
| Herb & Spice | 113 | 6,384 | 280 | 224 |
| **Suite total** | **641** | **91,912** | **650** | **522** |

All v1.4.0 suite metrics reconcile exactly against certified artifacts. Herb & Spice per-domain release summary (`reports/herb-spice-release-certification-report.json`) matches independently.

### Audit 2 — Domain configuration review

| Domain | Config registry | Render module | Shared template | Platform audit |
|--------|-----------------|---------------|-----------------|----------------|
| Protein Foods | `PROTEIN_DOMAIN` | `taxonomy-protein-food-render.js` | `protein-entity-template.html` | Published pre-audit era |
| Cheeses | `CHEESE_DOMAIN` | `taxonomy-cheese-render.js` | same | Published pre-audit era |
| Vegetables | `VEGETABLE_DOMAIN` | `taxonomy-vegetable-render.js` | same | Published pre-audit era |
| Fungi | `FUNGI_DOMAIN` | `taxonomy-fungi-render.js` | same | 0 modifications · 100% reuse |
| Herb & Spice | `HERB_SPICE_DOMAIN` | `taxonomy-herb-spice-render.js` | same | 0 modifications · 100% reuse |

FOOD-07F integrated Herb & Spice through declarative domain configuration and a domain-specific render module only. No changes to shared publication engines in `lib/food-publication/*`.

### Audit 3 — Publication pipeline review

Each published domain exposes the same nine thin wrapper scripts delegating to shared stage runners:

`projections → pages → schema → links → search-index → certify-publication → html → sitemap → certify-release`

| Domain | `publish:*` | `release:*` | Stage runner imports verified |
|--------|-------------|-------------|-------------------------------|
| Protein Foods | ✓ | ✓ | ✓ |
| Cheeses | ✓ | ✓ | ✓ |
| Vegetables | ✓ | ✓ | ✓ |
| Fungi | ✓ | ✓ | ✓ |
| Herb & Spice | ✓ | ✓ | ✓ |

`lib/deployment-config.js` registers all five domains. `release:food-ontology` includes Herb & Spice.

### Audit 4 — Cross-domain reference audit

| Check | Result |
|-------|--------|
| Cross-domain editorial edges use canonical IDs only | **PASS** — 252 cross-namespace editorial edges; no slug-based or duplicate-entity references |
| BOTAN-001 botanical ownership (Herb & Spice) | **PASS** — cilantro/coriander-seed and dill/dill-seed remain distinct entities with distinct pairing profiles |
| Cross-domain ingredient ownership (mustard, fennel) | **PASS** — mustard greens and fennel bulb in Vegetable; mustard seed and fennel seed in Herb & Spice |
| Protein `mushrooms` legacy group | **Deferred** — compatibility retained; canonical ownership transferred to Fungi; ID migration deferred to FOOD-14 per frozen policy |
| Forward references to unpublished domains (`food.fruit.*`, etc.) | **PASS** — canonical-ID forward references only; no entity duplication |

**Next work:** **FOOD-08A — Grain & Starch Ontology Governance** (completed — see FOOD-08B gate).

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
├── v1.4.0  + Herb & Spice
└── v1.5.0  + Grain & Starch   ← current production milestone

Master Roadmap
└── PLAN-01  (POSTER_COVERAGE.md)
```
