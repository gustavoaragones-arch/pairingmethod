# FOOD-09A — Fruit Ontology Governance

**Phase:** FOOD-09A — Fruit Ontology Governance  
**Freeze Date:** July 19, 2026  
**Status:** **Fruit Governance Frozen v1.0.0**  
**SSOT:** [`data/fruit-catalog.json`](../data/fruit-catalog.json)  
**Taxonomy:** [`FRUIT_TAXONOMY_BLUEPRINT.md`](FRUIT_TAXONOMY_BLUEPRINT.md)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)  
**Platform:** Food Ontology Platform v1.0.0 (frozen — domain contract only)  
**Suite baseline:** Food Ontology Suite v1.5.0 · tag `food-ontology-suite-v1.5.0`

---

## Executive Summary

PairingMethod declares **Fruit Ontology Governance v1.0.0** — the authoritative governance layer for the **Fruit Ontology** within Food Ontology Suite expansion toward v1.6.0.

This domain is **not** horticulture, cultivar taxonomy, orchard management, or commercial branding. It is the authoritative ontology for **culinary fruits, berries, citrus, melons, and fruit-derived ingredients** used worldwide in cooking. The project models **ingredients**, not beverages, desserts, prepared foods, or flavored products.

FOOD-09 is the **first ontology where BOTAN-001, PROC-001, and a new domain rule (FRUIT-001) intersect extensively**. Groups encode **culinary identity and culinary form** (pome, stone fruit, citrus, berry, tropical, melon, processed fruit) — not botanical families alone.

This milestone establishes the canonical catalog shell, **Canonical Culinary Groups**, immutable identity rules, the intrinsic attribute `usage_intensity`, controlled vocabularies, cross-domain reference policy, and the **Culinary Form Ownership Rule (FRUIT-001)**.

**No fruit entities exist yet.** No runtime artifacts, publication artifacts, or platform changes are created in this phase.

Fruit will be the **seventh consumer** of the multi-domain publication platform. Publication will reuse the shared platform via domain configuration in FOOD-09F — no platform modifications.

**Governance status:** Frozen. Entity population begins only after explicit approval to proceed with FOOD-09B.

---

## Domain Independence Principle

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — Domain Independence Principle.

Every new ontology domain is evaluated against four questions **before implementation**. **No modifications in FOOD-09A.**

| Question | If **yes** | If **no** |
|----------|------------|-----------|
| **Does this require a new ontology domain?** | FOOD-XX lifecycle (governance → publication) | Extend an existing domain |
| **Is this intrinsic knowledge?** | Catalog + runtime (structural layer) | Editorial or wine-pairing layer |
| **Is this computational reasoning?** | Pairing Engine (ENGINE-XX) | Never ontology |
| **Does this require a platform change?** | Burden of proof is **extremely high** | Domain additions alone never justify platform modification |

### Platform vs domain (PLAN-01)

> **Platform changes require architectural justification. Domain additions do not.**

### Cross-domain references (PLAN-01)

> **Ontology domains may reference entities in other domains only through canonical ontology IDs. They must never duplicate another domain's intrinsic data.**

---

## 1. Version

| Field | Value |
|-------|-------|
| Domain | Fruit (culinary fruits, berries, and fruit-derived ingredients) |
| Governance version | **v1.0.0** |
| JSON `catalog_version` | `1.0.0` |
| `food_ontology_version` (target suite) | `1.6.0` (upon FOOD-09F publication) |
| `platform_version` | `1.0.0` (frozen) |
| `wine_ontology_version` (reference) | `2.0` |
| `ontology_foundation_version` | `1.0.0` |
| Phase | FOOD-09A (governance only) |

### Version streams

| Stream | Meaning |
|--------|---------|
| Platform `1.0.0` | Publication infrastructure — frozen |
| `fruit-catalog` `1.0.0` | Fruit domain data contract |
| Food Ontology Suite `1.6.0` | Target suite release when Fruit publishes (FOOD-09F) |

---

## 2. Architectural Scope

### Allowed artifacts (FOOD-09A only)

| Artifact | Purpose |
|----------|---------|
| `data/fruit-catalog.json` | Catalog SSOT — schema, metadata, hub entities, empty `fruits` |
| `docs/FRUIT_TAXONOMY_BLUEPRINT.md` | Canonical taxonomy definition |
| `docs/FRUIT_GOVERNANCE.md` | This document |

### Explicitly excluded from FOOD-09A

- Runtime artifacts (bootstrap, indexes, graph edges)
- Publication artifacts (HTML, sitemaps, search indexes)
- Generators, validators, certification scripts
- Deployment logic or **any** platform code changes
- Editorial relationships (FOOD-09D)
- Wine pairings (FOOD-09E)
- Catalog population (FOOD-09B)

### Domain contract compliance

| Contract element | Fruit binding |
|------------------|---------------|
| Catalog SSOT | `data/fruit-catalog.json` |
| Three-level hierarchy | `fruit_category` → `fruit_group` → `fruit` |
| Immutable ontology IDs | `food.fruit.{group}.{slug}` |
| Controlled vocabularies | Frozen in catalog `schema` |
| Relationship placeholders | Empty arrays until FOOD-09D/E |
| Publication | Shared platform + domain config in FOOD-09F |

---

## 3. Canonical Culinary Groups

Fruit taxonomy is **culinary**, not botanical. Groups answer *"What is this ingredient's culinary identity and form?"* — not *"What is its plant family?"*

### Frozen groups (FOOD-09 v1) — **immutable**

These seven **Canonical Culinary Groups** are a **frozen controlled vocabulary**. Display names, slugs, and group IDs must **not** be renamed, merged, split, or supplemented with peer groups in v1 unless a future governance amendment documents a compelling architectural reason and accepts migration cost.

| Display name (immutable) | Slug (immutable) | Group ID (immutable) | `culinary_group` |
|--------------------------|------------------|----------------------|------------------|
| Pomes | `pomes` | `food.fruit.pomes` | `pomes` |
| Stone Fruits | `stone-fruits` | `food.fruit.stone-fruits` | `stone_fruits` |
| Citrus | `citrus` | `food.fruit.citrus` | `citrus` |
| Berries | `berries` | `food.fruit.berries` | `berries` |
| Tropical Fruits | `tropical-fruits` | `food.fruit.tropical-fruits` | `tropical_fruits` |
| Melons | `melons` | `food.fruit.melons` | `melons` |
| Processed Fruits | `processed-fruits` | `food.fruit.processed-fruits` | `processed_fruits` |

---

## 4. Domain Boundaries

### Included

| Include | Examples |
|---------|----------|
| Fresh culinary fruits | apple, pear, peach, lemon, strawberry, mango, watermelon |
| Berries (culinary class) | strawberry, raspberry, blueberry, blackberry, cranberry |
| Citrus | lemon, lime, orange, grapefruit, yuzu |
| Melons | watermelon, cantaloupe, honeydew |
| Dried fruits with distinct culinary identity | raisin, prune, date, fig (dried), apricot (dried) |
| Fruit purées with canonical ingredient status | apple purée, mango purée (when governed as distinct) |
| Fruit pastes with canonical ingredient status | date paste, quince paste (when governed as distinct) |
| Coconut and governed derivatives | fresh coconut; desiccated coconut and coconut milk per FRUIT-001 |

### Excluded

| Exclude | Rationale |
|---------|-----------|
| Horticulture and cultivar taxonomy | Not culinary ingredient scope |
| Orchards and commercial brands | Not ingredient ontology |
| Juices and fruit beverages | Beverage domain |
| Jams, preserves, compotes | Prepared food / Sweet Flavor (FOOD-12) |
| Wines, cider, perry | Beverage domain |
| Desserts and candies | Prepared food domain |
| Flavored products | Not canonical ingredient |
| Tomato | Vegetable Ontology — see §10 |
| Olive (fresh) | Reserved — see §10 |

---

## 5. Suite Governance Rules (continued)

FOOD-09A continues all suite rules without redefinition. Authoritative definitions live in [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture.

| Rule | ID | FOOD-09A application |
|------|-----|----------------------|
| Canonical Entity Rule | CANON-001 | One canonical culinary fruit per ingredient identity |
| Global Culinary Recognition Rule | CANON-002 | Globally recognizable fruits before regional cultivars |
| Botanical Ownership Rule | BOTAN-001 | Culinary identity over botanical classification |
| Processing Ownership Rule | PROC-001 | Processing that changes culinary identity → separate entity |
| Functional Pairing Rule | STARCH-001 | Suite wine rule — not expected to affect Fruit ownership; referenced for completeness |

---

## 6. FRUIT-001 — Culinary Form Ownership Rule

**Introduced:** FOOD-09A · **Applies** to Fruit catalog, editorial, and wine layers; informs cross-domain fruit-derived ingredients in later domains (especially FOOD-12 Sweet Flavor).

> A processed fruit becomes a **separate canonical ingredient** only when it has an **established, independent culinary identity**. The deciding factor is **culinary identity**, not preparation method alone.

### Separate canonical entities (default freeze)

| Fresh form | Processed form | Group assignment | Rationale |
|------------|----------------|------------------|-----------|
| Grape | Raisin | Processed Fruits | Independent dried-fruit identity in cooking and pairing |
| Plum | Prune | Processed Fruits | Distinct sweet-savory dried identity |
| Coconut | Desiccated Coconut | Processed Fruits | Distinct baking and garnish identity (if audit confirms) |
| Coconut | Coconut Milk | Processed Fruits or reserved | Governed separately if culinary function is ingredient, not beverage |

### Aliases or preparation states only (default freeze)

| Entity | Treatment |
|--------|-----------|
| Sliced Apple | Alias / preparation on Apple |
| Diced Mango | Alias / preparation on Mango |
| Zested Lemon | Alias / preparation on Lemon |
| Orange Segments | Alias / preparation on Orange |

PROC-001 and FRUIT-001 operate together: PROC-001 governs whether processing creates a new entity; FRUIT-001 requires that the processed form has **independent culinary identity** before a separate canonical entity is assigned.

---

## 7. Required Intrinsic Fields

Suite-standard intrinsic fields apply to every leaf entity at FOOD-09B population:

| Field | Requirement |
|-------|-------------|
| `id` | Immutable `food.fruit.{group}.{slug}` |
| `slug` | URL-safe identifier |
| `display_name` | Canonical culinary name |
| `scientific_name` | Primary species or `Multiple species` |
| `culinary_group` | Aligns to frozen group vocabulary |
| `parent_group` / `parent_category` | Group slug + `fruit` |
| `usage_intensity` | `primary` · `accent` · `luxury` |
| `aliases` | Required array — may be `[]` |
| `common_names` | Required array — may be `[]` |

### `usage_intensity` (unchanged suite vocabulary)

| Value | Meaning |
|-------|---------|
| `primary` | Defines dish character (e.g. apple in tarte tatin) |
| `accent` | Supporting fruit note (e.g. lemon zest) |
| `luxury` | Rare or prestige fruit context |

### Reserved attributes (empty through FOOD-09B)

| Field | FOOD-09B rule |
|-------|---------------|
| `flavor_profile` | `[]` only |
| `texture_profile` | `[]` only |
| `aroma_profile` | `[]` only |

Vocabularies for these fields are frozen in catalog `schema` but not populated until post-FOOD-09B curation standards.

---

## 8. FOOD-09B Population Target

| Metric | Target |
|--------|-------:|
| Canonical fruit entities | **100–140** |
| Priority | Globally significant culinary fruits before regional cultivars |
| Quality bar | Entity quality over count — CANON-001 and CANON-002 enforced |

Planning distribution by group is defined in [`FRUIT_TAXONOMY_BLUEPRINT.md`](FRUIT_TAXONOMY_BLUEPRINT.md) §4.

---

## 9. Cross-Domain Ownership (frozen)

Canonical ownership must remain **unique** across the suite. FOOD-09A freezes the following decisions:

| Ingredient | Owner domain | Canonical ID pattern | Notes |
|------------|--------------|----------------------|-------|
| Tomato | **Vegetable** (FOOD-05) | `food.vegetable.*` | Botanical fruit, culinary vegetable — **do not duplicate** in Fruit |
| Avocado | **Fruit** (FOOD-09) | `food.fruit.tropical-fruits.avocado` | Not assigned in Vegetable catalog; explicit Fruit ownership at FOOD-09B |
| Olive (fresh) | **Reserved** | — | Not yet canonically assigned; defer to future governance — **do not populate** in FOOD-09B without amendment |
| Coconut | **Fruit** (FOOD-09) | `food.fruit.tropical-fruits.coconut` | Derivatives governed by FRUIT-001 + PROC-001 |
| Grape (fresh) | **Fruit** (FOOD-09) | `food.fruit.*.grape` | Resolves existing cheese forward refs (`food.fruit.grape`) |
| Raisin | **Fruit** (FOOD-09) | `food.fruit.processed-fruits.raisin` | Separate from Grape per FRUIT-001 |
| Mustard greens | Vegetable | `food.vegetable.*` | Unchanged from SUITE-STAB-02 |
| Mustard seed | Herb & Spice | `food.herb.*` | Unchanged from SUITE-STAB-02 |

Cross-domain editorial edges (FOOD-09D) may reference canonical IDs in other domains. They must never duplicate foreign intrinsic metadata.

---

## 10. Lifecycle Gate

| Phase | Scope | Status after FOOD-09A |
|-------|-------|---------------------|
| FOOD-09A | Governance freeze | **Complete** |
| FOOD-09B | Catalog population + audit | **Blocked** until explicit approval |
| FOOD-09C | Runtime | Not started |
| FOOD-09D | Editorial | Not started |
| FOOD-09E | Wine pairings | Not started |
| FOOD-09F | Publication | Not started |

**Next gate:** Explicit approval to proceed with **FOOD-09B — Populate Fruit Ontology catalog**.

---

## 11. Governance Note

The Fruit ontology is the first domain where **BOTAN-001**, **PROC-001**, and **FRUIT-001** intersect extensively. Freezing ownership decisions in FOOD-09A provides a consistent framework for later domains — particularly **Sweet Flavor (FOOD-12)**, where fruit-derived ingredients will create additional cross-domain relationships without requiring platform architecture changes.

---

## References

- [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) — Suite Architecture (CANON-001, CANON-002, BOTAN-001, PROC-001, STARCH-001)
- [`FRUIT_TAXONOMY_BLUEPRINT.md`](FRUIT_TAXONOMY_BLUEPRINT.md) — Taxonomy blueprint
- [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) — PLAN-01 roadmap
- [`data/fruit-catalog.json`](../data/fruit-catalog.json) — Catalog SSOT shell
