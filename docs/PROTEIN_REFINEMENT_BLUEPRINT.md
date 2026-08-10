# FOOD-14A — Protein Refinement Blueprint

**Phase:** FOOD-14A — Protein Refinement Blueprint  
**Status:** **Frozen v1.0.0** (companion to [`PROTEIN_REFINEMENT_GOVERNANCE.md`](PROTEIN_REFINEMENT_GOVERNANCE.md))  
**Suite baseline:** Food Ontology Suite v2.0.0 · tag `food-ontology-suite-v2.0.0`  
**Catalog SSOT:** [`data/protein-food-catalog.json`](../data/protein-food-catalog.json)  
**Original blueprint:** [`PROTEIN_TAXONOMY_BLUEPRINT.md`](PROTEIN_TAXONOMY_BLUEPRINT.md) (ONTOLOGY-02A — superseded for refinement planning by this document)

---

## 1. Domain & Namespace

| Field | Value |
|-------|-------|
| Domain key | `protein` |
| Namespace prefix | `food.protein.{group}.{slug}` |
| Publication paths | `/foods/`, `/groups/`, `/categories/` (unchanged) |
| Hierarchy | 3 levels — category → group → food (unchanged) |

FOOD-14 refines the existing domain. It does **not** create a new domain key or publication route.

---

## 2. Refinement Objectives

| Objective | Phase | Priority |
|-----------|-------|----------|
| Resolve legacy duplicate groups | FOOD-14B | **Critical** |
| Close poster seafood gaps | FOOD-14B | High |
| Close poster cured-meat gaps | FOOD-14B | High |
| Enable cross-domain editorial | FOOD-14D | High |
| Expand wine pairings with suite context | FOOD-14E | Medium |
| Re-publish with certification | FOOD-14F | Required |

---

## 3. Current Published Structure

### Categories (3 — frozen)

| Category | Role |
|----------|------|
| `animal-proteins` | Mammals, poultry, game, cured forms |
| `seafood` | Fin-fish, crustaceans, mollusks, cephalopods |
| `plant-based-proteins` | Legacy plant/fungi groups targeted for deprecation |

### Groups (16 — baseline)

| Group | Entities | Refinement status |
|-------|--------:|-------------------|
| `beef` | — | Stable — minor additions possible |
| `pork` | — | Stable — cured-meat consolidation |
| `lamb` | — | Stable |
| `veal` | — | Stable |
| `poultry` | — | Stable |
| `wild-game` | — | Stable |
| `fin-fish` | — | **Refine** — poster gap closure |
| `crustaceans` | — | **Refine** — poster gap closure |
| `mollusks` | — | **Refine** — poster gap closure |
| `cephalopods` | — | **Refine** — poster gap closure |
| `cured-meat` | — | **Proposed** — new group for poster closure |
| `mushrooms` | 12 | **Deprecate** — canonical owner: Fungi |
| `legumes` | — | **Deprecate** — canonical owner: Legume |
| `soy-foods` | — | **Deprecate** — canonical owner: Legume |
| `nuts-seeds` | 12 | **Deprecate** — canonical owner: Nut & Seed |
| `grains-wheat-protein` | 8 | **Deprecate** (except seitan) — canonical owner: Grain & Starch |

*Exact per-group entity counts remain in catalog SSOT until FOOD-14B reconciliation.*

---

## 4. Ownership Reconciliation Plan (FOOD-14B)

### 4.0 Migration map artifact (required)

FOOD-14B must produce **`data/protein-migration-map.json`** — the machine-readable SSOT for all ownership transfers. Runtime validation, editorial migration, wine migration, publication redirects, and regression audits consume this single artifact.

Example entry:

```json
{
  "legacy_id": "food.protein.mushrooms.cremini",
  "canonical_id": "food.fungi.cultivated-mushrooms.cremini",
  "status": "deprecated",
  "redirect": true,
  "governance_rule": "PROTEIN-001"
}
```

| Field | Required | Purpose |
|-------|----------|---------|
| `legacy_id` | Yes | Deprecated `food.protein.*` ID |
| `canonical_id` | Yes | Canonical owner ID in target domain |
| `status` | Yes | `"deprecated"` during migration window |
| `redirect` | Yes | Whether FOOD-14F must certify URL redirect |
| `governance_rule` | Yes | Governing rule (e.g. `PROTEIN-001`) |

Deprecated entities follow **PROTEIN-005** — excluded from runtime, editorial, and wine generation; retained only for catalog compatibility metadata and redirect certification.

### 4.1 Fungi — mushrooms group

| Legacy Protein ID | Canonical Fungi ID | Action |
|-------------------|-------------------|--------|
| `food.protein.mushrooms.cremini` | `food.fungi.cultivated-mushrooms.cremini` | Deprecate protein; reference fungi |
| `food.protein.mushrooms.portobello` | `food.fungi.cultivated-mushrooms.portobello` | Deprecate protein; reference fungi |
| `food.protein.mushrooms.shiitake` | `food.fungi.cultivated-mushrooms.shiitake` | Deprecate protein; reference fungi |
| *(remaining 9 mushroom entities)* | `food.fungi.*` equivalents | Map per FOOD-14B audit |

**Policy:** [`FUNGI_GOVERNANCE.md`](FUNGI_GOVERNANCE.md) §10 — migration execution deferred to FOOD-14.

### 4.2 Legume — legumes + soy-foods groups

| Legacy Protein scope | Canonical owner | Action |
|----------------------|-----------------|--------|
| `food.protein.legumes.*` | `food.legume.*` | Deprecate; editorial forward refs |
| `food.protein.soy-foods.*` | `food.legume.*` | Deprecate; editorial forward refs |

**Policy:** [`LEGUME_GOVERNANCE.md`](LEGUME_GOVERNANCE.md) §9.

### 4.3 Nut & Seed — nuts-seeds group

| Legacy Protein scope | Canonical owner | Action |
|----------------------|-----------------|--------|
| `food.protein.nuts-seeds.*` | `food.nut-seed.*` | Deprecate; editorial forward refs |

### 4.4 Grain & Starch — grains-wheat-protein group

| Entity | Owner | Action |
|--------|-------|--------|
| `food.protein.grains-wheat-protein.seitan` | **Protein** (canonical) | **Retain** |
| Other grains-wheat-protein entities | `food.grain-starch.*` | Deprecate; editorial forward refs |

**Policy:** [`GRAIN_STARCH_GOVERNANCE.md`](GRAIN_STARCH_GOVERNANCE.md) §10.

### 4.5 Cross-domain domains (reference only — no migration into Protein)

| Domain | Protein relationship |
|--------|---------------------|
| Herb & Spice | Reference `food.herb-spice.*` — never duplicate spices |
| Fruit | Reference `food.fruit.*` — never duplicate fruits |
| Vegetable | Reference `food.vegetable.*` — never duplicate vegetables |
| Cheese | Reference `food.cheese.*` — never duplicate cheeses |
| Sauce & Condiment | Reference `food.sauce-condiment.*` — never duplicate sauces |
| Sweet Flavor | Reference `food.sweet-flavor.*` — never duplicate sweeteners |

---

## 5. Poster Coverage Closure Targets (FOOD-14B)

From [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) — currently **Partial**:

### Seafood refinement

| Poster concept | Representative entities | Current status |
|----------------|------------------------|----------------|
| Fish | tuna, cod, trout, bass | Partial — `fin-fish` group exists |
| Lobster & Shellfish | prawn, crab, langoustine | Partial — `crustaceans`, `cephalopods` |
| Mollusks | oyster, mussel, clam | Partial — `mollusks` group exists |

### Cured meat refinement

| Poster concept | Representative entities | Current status |
|----------------|------------------------|----------------|
| Cured Meat | salami, prosciutto, bacon | Partial — bacon/pancetta/ham exist; salami/prosciutto gaps |

FOOD-14B defines the exact entity additions and group assignments. FOOD-14A does not pre-populate entities.

---

## 6. Inclusion Criteria (refinement)

An entity belongs in refined Protein when:

| Criterion | Examples |
|-----------|----------|
| **Protein-forward pairing subject** | Beef cuts, fin-fish, shellfish, cured meats |
| **Animal or seafood culinary identity** | Poultry, game, cephalopods |
| **Wheat-protein preparation (exception)** | Seitan |
| **Poster meat/seafood row coverage** | Entities listed in POSTER_COVERAGE |

---

## 7. Exclusion Criteria (refinement)

An entity does **not** belong in Protein when:

| Criterion | Canonical owner |
|-----------|-----------------|
| Fungi | Fungi domain |
| Legumes and soy | Legume domain |
| Nuts and seeds | Nut & Seed domain |
| Grains (except seitan) | Grain & Starch domain |
| Vegetables | Vegetable domain |
| Herbs and spices | Herb & Spice domain |
| Fruits | Fruit domain |
| Cheeses | Cheese domain |
| Sauces and condiments | Sauce & Condiment domain |
| Sweeteners and cocoa | Sweet Flavor domain |
| Composed dishes | Not an ingredient ontology subject |
| Preparations (as entities) | `preparation.*` ontology — referenced editorially |

---

## 8. Intrinsic Metadata (baseline — unchanged in FOOD-14A)

Protein leaf entities retain the 14+ intrinsic fields frozen at ONTOLOGY-02A:

`food_category`, `species`, `scientific_name`, `cut_type`, `anatomical_cut`, `bone_state`, `plant_part`, `processing_state`, `fat_content`, `primary_cooking_methods`, and related vocabularies.

FOOD-14B may add refinement-specific metadata fields (e.g., `cured_form`, `seafood_class`) only if approved in catalog schema amendment with audit coverage.

---

## 9. Editorial Refinement Plan (FOOD-14D)

| Current state | Target state |
|---------------|--------------|
| 40 editorial edges | Representative scale aligned with peer domains |
| `crossDomainTargets: []` | `commonly_served_with` enabled |
| Intra-domain + `preparation.*` only | Cross-domain canonical ID references |
| Obsolete forward references | Replaced with canonical IDs |

Relationship types (existing): `similar_to`, `substitutes_for`, `shares_culinary_role`, `commonly_prepared_as`.

New cross-domain pattern: `commonly_served_with` → `food.{domain}.*` targets.

---

## 10. Wine Pairing Refinement Plan (FOOD-14E)

| Current state | Target state |
|---------------|--------------|
| 29 wine edges | Expanded, suite-context-aware coverage |
| `pairs_with_style` vocabulary | Retained unless migration approved |
| No sauce/sweet cross-awareness | Editorial pairing context where relevant |

Potential improvements:

- Sauce-aware pairings referencing `food.sauce-condiment.*`
- Sweet-flavor interaction awareness
- Condiment influence on pairing confidence
- Refined confidence and pairing-method metadata

---

## 11. Runtime Normalization Plan (FOOD-14C)

| Objective | Detail |
|-----------|--------|
| Deterministic rebuild | Full runtime certification PASS |
| Deprecated entity exclusion | Legacy groups removed from structural generation |
| Index normalization | Alias and lookup indexes reflect FOOD-14B catalog |
| Consolidated loader | Optional alignment with Legume/Sauce consolidated artifact pattern |
| Layer separation | Editorial and wine remain outside runtime bootstrap |

Baseline: 35,734 runtime relationships at v2.0.0.

---

## 12. Publication Paths (FOOD-14F — unchanged)

| Page type | Path | Expected count (baseline) |
|-----------|------|--------------------------:|
| Leaf | `/foods/{slug}/` | 207 → TBD post-14B |
| Group | `/groups/{slug}/` | 16 → TBD post-14B |
| Category | `/categories/{slug}/` | 3 |
| **Total** | | **226 → TBD post-14B** |

Publication reuses `PROTEIN_DOMAIN` render module and shared stage runners. Redirect policy applies for any retired slugs per PROTEIN-002.

---

## 13. Expected Suite Impact (post-FOOD-14F)

| Metric | v2.0.0 baseline | Expected direction |
|--------|----------------:|-------------------|
| Published domains | 11 | Unchanged |
| Protein leaf entities | 207 | Modest net change (deprecations + additions) |
| Editorial edges | 40 | Increase — cross-domain coverage |
| Wine edges | 29 | Increase — suite-aware refinement |
| Publication pages | 226 | Adjust with entity set |
| Platform modifications | — | 0 (declarative config only) |

**Suite tag target:** `food-ontology-suite-v2.1.0`

The primary value is **harmonization quality**, not entity count growth.

---

## 14. Governance Rules Summary

| Rule | Summary |
|------|---------|
| **PROTEIN-001** | Canonical owner wins; reference by ID |
| **PROTEIN-002** | URL and ID stability unless migrated |
| **PROTEIN-003** | Seafood taxonomy toward poster granularity |
| **PROTEIN-004** | Cured meat identity in Protein |
| **PROTEIN-005** | Canonical deprecation lifecycle — deterministic layer exclusion |
| **PROTEIN-PAIR-001** | Wine pairing refinement with suite context |
| **PLAN-01** | Cross-domain references by canonical ID only |

---

## 15. Approval

| Role | Status | Date |
|------|--------|------|
| FOOD-14A Blueprint | **Frozen v1.0.0** | August 9, 2026 |
| FOOD-14B Migration map | Required: `data/protein-migration-map.json` | — |
| FOOD-14B Ownership reconciliation | Pending approval | — |
