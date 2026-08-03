# FOOD-12A — Sweet Flavor Ontology Governance

**Phase:** FOOD-12A — Sweet Flavor Ontology Governance  
**Freeze Date:** August 2, 2026  
**Status:** **Sweet Flavor Governance Frozen v1.0.0**  
**SSOT:** [`data/sweet-flavor-catalog.json`](../data/sweet-flavor-catalog.json)  
**Taxonomy:** [`SWEET_FLAVOR_TAXONOMY_BLUEPRINT.md`](SWEET_FLAVOR_TAXONOMY_BLUEPRINT.md)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)  
**Platform:** Food Ontology Platform v1.0.0 (frozen — domain contract only)  
**Suite baseline:** Food Ontology Suite v1.8.0 · tag `food-ontology-suite-v1.8.0`

---

## Executive Summary

PairingMethod declares **Sweet Flavor Ontology Governance v1.0.0** — the authoritative governance layer for the **Sweet Flavor Ontology** within Food Ontology Suite expansion toward v1.9.0.

This domain is **not** dessert taxonomy, confectionery catalogs, commercial branding, beverage menus, recipes, or finished dishes. It is the authoritative ontology for **culinary sweeteners, syrups, honey products, natural and alternative sweeteners, and cocoa or chocolate ingredients** used as distinct culinary ingredients worldwide. The project models **ingredients**, not crème brûlée, candy bars, or sweet cocktails.

FOOD-12 completes the poster's sweetness layer after nine ingredient-family domains at v1.8.0. By introducing **SWEET-001** alongside **SWEET-PAIR-001**, the suite formalizes ownership of crystalline sugars, pourable syrups, bee products, plant-derived sweeteners, alternative sweeteners, and cacao-derived ingredients while extending PROC-001 into sweet ingredients — continuing the governance lineage of FRUIT-001, NUT-002, and LEGUME-002 without platform modification.

This milestone establishes the canonical catalog shell, **Canonical Culinary Groups**, immutable identity rules, the intrinsic attribute `usage_intensity`, controlled vocabularies, cross-domain reference policy, and the domain rules **SWEET-001**, **COCOA-001**, and **SWEET-PAIR-001**.

**No sweet flavor entities exist yet.** No runtime artifacts, publication artifacts, or platform changes are created in this phase.

Sweet Flavor will be the **tenth consumer** of the multi-domain publication platform. Publication will reuse the shared platform via domain configuration in FOOD-12F — no platform modifications.

**Governance status:** Frozen. Entity population begins only after explicit approval to proceed with FOOD-12B.

---

## Domain Independence Principle

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — Domain Independence Principle.

Every new ontology domain is evaluated against four questions **before implementation**. **No modifications in FOOD-12A.**

| Question | If **yes** | If **no** |
|----------|------------|-----------|
| **Does this require a new ontology domain?** | FOOD-XX lifecycle (governance → publication) | Extend an existing domain |
| **Is this intrinsic knowledge?** | Catalog + runtime (structural layer) | Editorial or wine-pairing layer |
| **Is this computational reasoning?** | Pairing Engine (ENGINE-XX) | Never ontology |
| **Does this require a platform change?** | Burden of proof is **extremely high** | Domain additions alone never justify platform modification |

### Cross-domain references (PLAN-01)

> **Ontology domains may reference entities in other domains only through canonical ontology IDs. They must never duplicate another domain's intrinsic data.**

---

## 1. Version

| Field | Value |
|-------|-------|
| Domain | Sweet Flavor (culinary sweeteners and sweet flavor ingredients) |
| Governance version | **v1.0.0** |
| JSON `catalog_version` | `1.0.0` |
| `food_ontology_version` (target suite) | `1.9.0` (upon FOOD-12F publication) |
| `platform_version` | `1.0.0` (frozen) |
| `wine_ontology_version` (reference) | `2.0` |
| `ontology_foundation_version` | `1.0.0` |
| Phase | FOOD-12A (governance only) |

---

## 2. Architectural Scope

### Allowed artifacts (FOOD-12A only)

| Artifact | Purpose |
|----------|---------|
| `data/sweet-flavor-catalog.json` | Catalog SSOT — schema, metadata, hub entities, empty `sweet_flavors` |
| `docs/SWEET_FLAVOR_TAXONOMY_BLUEPRINT.md` | Canonical taxonomy definition |
| `docs/SWEET_FLAVOR_GOVERNANCE.md` | This document |

### Explicitly excluded from FOOD-12A

- Runtime artifacts (bootstrap, indexes, graph edges)
- Publication artifacts (HTML, sitemaps, search indexes)
- Generators, validators, certification scripts
- Deployment logic or **any** platform code changes
- Editorial relationships (FOOD-12D)
- Wine pairings (FOOD-12E)
- Catalog population (FOOD-12B)

### Domain contract compliance

| Contract element | Sweet Flavor binding |
|------------------|---------------------|
| Catalog SSOT | `data/sweet-flavor-catalog.json` |
| Three-level hierarchy | `sweet_flavor_category` → `sweet_flavor_group` → `sweet_flavor` |
| Immutable ontology IDs | `food.sweet-flavor.{group}.{slug}` |
| Controlled vocabularies | Frozen in catalog `schema` |
| Relationship placeholders | Empty arrays until FOOD-12D/E |
| Publication | Shared platform + domain config in FOOD-12F |

---

## 3. Canonical Culinary Groups

Sweet Flavor taxonomy is **culinary**, not dessert-focused. Groups answer *"What is this ingredient's sweetener identity and culinary form?"* — not *"What dessert category does it appear in?"*

### Frozen groups (FOOD-12 v1) — **immutable**

These six **Canonical Culinary Groups** are a **frozen controlled vocabulary**. Display names, slugs, and group IDs must **not** be renamed, merged, split, or supplemented with peer groups in v1 unless a future governance amendment documents a compelling architectural reason and accepts migration cost.

| Display name (immutable) | Slug (immutable) | Group ID (immutable) | `culinary_group` |
|--------------------------|------------------|----------------------|------------------|
| **Sugars** | `sugars` | `food.sweet-flavor.sugars` | `sugars` |
| **Syrups** | `syrups` | `food.sweet-flavor.syrups` | `syrups` |
| **Honey & Bee Products** | `honey-bee-products` | `food.sweet-flavor.honey-bee-products` | `honey_bee_products` |
| **Natural Sweeteners** | `natural-sweeteners` | `food.sweet-flavor.natural-sweeteners` | `natural_sweeteners` |
| **Alternative Sweeteners** | `alternative-sweeteners` | `food.sweet-flavor.alternative-sweeteners` | `alternative_sweeteners` |
| **Cocoa & Chocolate Ingredients** | `cocoa-chocolate-ingredients` | `food.sweet-flavor.cocoa-chocolate-ingredients` | `cocoa_chocolate_ingredients` |

**Expansion policy:** Future growth occurs **inside** these groups (new leaf entities), not by adding new peer groups.

**Honey & Bee Products scope:** This group covers **culinary sweeteners only** — honey and comb honey. Bee pollen, royal jelly, and propolis are **intentionally excluded** from FOOD-12 v1 because they are supplement-oriented products rather than mainstream culinary sweetener ingredients.

---

## 4. Namespace & Identity Model

### Namespace

Reserve: **`food.sweet-flavor.*`**

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.sweet-flavor` | `food.sweet-flavor` |
| Group | `food.sweet-flavor.{group}` | `food.sweet-flavor.sugars` |
| Sweet Flavor | `food.sweet-flavor.{group}.{slug}` | `food.sweet-flavor.sugars.cane-sugar` |

Shorthand IDs such as `food.sweet-flavor.cane-sugar` (without group segment) are **not valid**.

### Identity contract (every `sweet_flavor` entity)

```json
{
  "id": "",
  "slug": "",
  "display_name": "",
  "scientific_name": "",
  "parent_group": "",
  "parent_category": "sweet-flavor",
  "culinary_group": "",
  "usage_intensity": "",
  "aliases": [],
  "common_names": [],
  "external_ids": {},
  "catalog_version": "1.0.0",
  "food_ontology_version": "1.9.0"
}
```

---

## 5. Domain Boundaries

### Included

| Include | Examples |
|---------|----------|
| Crystalline sugars | cane sugar, beet sugar, palm sugar, brown sugar |
| Pourable syrups | maple syrup, molasses, corn syrup, golden syrup |
| Honey products | honey, comb honey |
| Plant-derived sweeteners | agave, date syrup, monk fruit sweetener |
| Alternative sweeteners | erythritol, xylitol, allulose, stevia |
| Cocoa and chocolate ingredients | cocoa powder, cocoa butter, cacao nibs, chocolate liquor |

### Excluded

| Exclude | Rationale |
|---------|-----------|
| Finished desserts and composed dishes | Not ingredient ontology |
| Candy and confectionery products | Not ingredient ontology |
| Beverages and sweet drinks | Beverage scope — out of domain v1 |
| Coffee and tea as beverages | Beverage scope — out of domain v1 |
| Commercial brands and product lines | Not ingredient ontology |
| Recipes | Not ingredient ontology |
| Composed sauces and extracts | **FOOD-13** — see §10 FOOD-13 deferrals |

**Coffee note:** Roasted coffee as a beverage ingredient is excluded from Sweet Flavor v1. Coffee as a culinary pairing context may be referenced editorially from other domains; canonical coffee ownership is deferred to FOOD-13 or a future beverage governance amendment.

---

## 6. Suite Governance Rules (continued)

FOOD-12A continues all suite rules without redefinition. Authoritative definitions live in [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture.

| Rule | ID | FOOD-12A application |
|------|-----|----------------------|
| Canonical Entity Rule | CANON-001 | One canonical culinary sweetener per ingredient identity |
| Global Culinary Recognition Rule | CANON-002 | Globally recognizable sweeteners before regional trade names |
| Botanical Ownership Rule | BOTAN-001 | Culinary identity over botanical classification |
| Processing Ownership Rule | PROC-001 | Processing that changes culinary identity → separate entity — SWEET-001 extends for sweet domain |
| Culinary Form Ownership Rule | FRUIT-001 | Referenced for cross-domain processed-form discipline |
| Processed Product Rule | NUT-002 · LEGUME-002 | Referenced as suite processing baseline — SWEET-001 extends for sweet domain |
| Cocoa Ownership Rule | COCOA-001 | Cacao agricultural form vs independent cocoa-derived culinary ingredients |

---

## 7. SWEET-001 — Processing Ownership Rule

**Introduced:** FOOD-12A · **Applies** to Sweet Flavor catalog, runtime, editorial, and wine layers; **extends** PROC-001 for sweet ingredients.

> Processing creates a **separate canonical ingredient** only when **culinary identity changes**. Granulation, milling, or refinement that does not change kitchen behavior remains an **alias** unless culinary identity diverges.

### Identity test (deterministic — FOOD-12B audit criterion)

A processed sweet ingredient becomes a **separate canonical entity** only if **any** of the following differ materially from its source ingredient:

| Criterion | Question |
|-----------|----------|
| **Culinary function** | Does the processed form serve a distinct role in finished dishes? |
| **Preparation behavior** | Does kitchen handling, dosing, or incorporation differ materially? |
| **Pairing behavior** | Would wine pairing recommendations diverge from the source ingredient per SWEET-PAIR-001? |

If **none** of the above differ materially, the processed form is an **alias** or preparation state — not a new canonical entity.

### Separate canonical entities (default freeze)

| Source / whole form | Processed form | Group assignment | Rationale |
|---------------------|----------------|------------------|-----------|
| Cacao | Cocoa Powder | Cocoa & Chocolate Ingredients | Distinct baking and fat-reduced identity |
| Cacao | Cocoa Butter | Cocoa & Chocolate Ingredients | Distinct fat-only culinary role |
| Cacao | Chocolate Liquor | Cocoa & Chocolate Ingredients | Distinct liquor/base identity |
| Cacao | Cacao Nibs | Cocoa & Chocolate Ingredients | Distinct crunchy/textural identity |
| Date (Fruit) | Date Syrup | Natural Sweeteners | Distinct pourable sweetener identity |
| Corn (Grain) | Corn Syrup | Syrups | Distinct syrup identity |
| Coconut (Fruit) | Coconut Sugar | Natural Sweeteners | Distinct crystalline sweetener identity |

### Aliases or preparation states only (default freeze)

| Entity | Treatment |
|--------|-----------|
| Powdered Sugar | Alias on governing sugar entity unless FOOD-12B audit documents distinct culinary identity |
| Superfine Sugar | Alias on governing sugar entity |
| Coarse Sugar | Alias on governing sugar entity |
| Light Brown Sugar / Dark Brown Sugar | Alias on Brown Sugar unless FOOD-12B audit documents distinct culinary identity per identity test |

---

## 8. COCOA-001 — Cocoa Ownership Rule

**Introduced:** FOOD-12A · **Applies** to Sweet Flavor catalog, runtime, editorial, and wine layers; **complements** SWEET-001 for cacao-derived ingredients.

> **Cocoa Bean** (or **Cacao Bean** as canonical agricultural ingredient) is the canonical whole agricultural form. **Cocoa Powder**, **Cocoa Butter**, **Chocolate Liquor**, and **Cacao Nibs** are **independent canonical culinary ingredients** under SWEET-001 when each satisfies the identity test. **Finished chocolate products** (bars, chips, couverture, confections) remain **outside FOOD-12** and are deferred until a future governance amendment if ever required.

| Form | FOOD-12 v1 treatment |
|------|------------------------|
| Cocoa Bean / Cacao Bean | Canonical agricultural ingredient — Cocoa & Chocolate Ingredients group |
| Cocoa Powder | Separate canonical entity |
| Cocoa Butter | Separate canonical entity |
| Chocolate Liquor | Separate canonical entity |
| Cacao Nibs | Separate canonical entity |
| Finished chocolate products | **Excluded** — not ingredient ontology v1 |

COCOA-001 governs **ownership and group assignment** for cacao-derived ingredients. It does **not** permit duplicating entities owned by another domain.

---

## 9. SWEET-PAIR-001 — Culinary Role Pairing Rule

**Introduced:** FOOD-12A · **Exercised** in FOOD-12E wine pairing seed and mapper validation.

> Wine recommendations for sweet flavor ingredients must follow the ingredient's **culinary role in the finished dish**, not sweetness intensity alone.

| Pairing basis | Examples |
|---------------|----------|
| Culinary role in context | Honey → floral glaze and finishing; molasses → braise and bake depth |
| Processed-form identity | Cocoa Powder → baking bitterness; Cocoa Butter → fat-rich confection base |
| No sweetness inheritance | Honey ≠ Maple Syrup; Molasses ≠ Brown Sugar; Cocoa Powder ≠ Cocoa Butter |

SWEET-PAIR-001 governs FOOD-12E only. It does **not** modify wine ontology structure or platform pairing logic.

---

## 10. Cross-Domain Ownership

Canonical ownership must remain **unique** across the suite. Sweet Flavor does not duplicate intrinsic data from other domains.

| Ingredient / concept | Owner domain | Notes |
|----------------------|--------------|-------|
| Date | **Fruit (FOOD-09)** | Whole fruit form |
| Date Syrup | **Sweet Flavor (FOOD-12)** | Processed sweetener per SWEET-001 |
| Corn | **Grain & Starch (FOOD-08)** | Whole grain form |
| Corn Syrup | **Sweet Flavor (FOOD-12)** | Processed syrup per SWEET-001 |
| Coconut | **Fruit (FOOD-09)** | Whole fruit / culinary coconut identity |
| Coconut Sugar | **Sweet Flavor (FOOD-12)** | Crystalline sweetener per SWEET-001 |
| Vanilla Bean | **Herb & Spice (FOOD-07)** | Whole spice form |
| Maple (tree sap context) | Cross-reference only | Maple Syrup owned here in Syrups group |
| Honey in cheese editorial edges | Cross-reference by ID | Existing Fruit/Cheese editorial graphs reference sweet contexts — Sweet Flavor provides canonical targets at publication |

### FOOD-13 deferrals (composed preparations — not primary ingredients)

The following are **explicitly deferred to FOOD-13 — Sauce & Condiment Ontology**. They are culinary preparations or condiments rather than primary sweet flavor ingredients:

| Deferred item | Rationale |
|---------------|-----------|
| Vanilla Extract | Extract — composed condiment |
| Almond Extract | Extract — composed condiment |
| Orange Blossom Water | Floral water — composed condiment |
| Rose Water | Floral water — composed condiment |
| Caramel Sauce | Composed sauce |
| Chocolate Syrup | Composed sauce / syrup product |

Sweet Flavor may **reference** FOOD-13 entities editorially by canonical ID after FOOD-13 publication. Sweet Flavor does **not** populate these as leaf entities in FOOD-12B.

Cross-domain references use **canonical ontology IDs only** — never duplicated intrinsic fields.

---

## 11. Required Intrinsic Fields

Every leaf entity requires these fields at FOOD-12B population (see catalog `schema` for full contract):

| Field | Rule |
|-------|------|
| `id` | Immutable canonical ID — `food.sweet-flavor.{group}.{slug}` |
| `slug` | URL-safe identifier — mutable for SEO; ID unchanged |
| `display_name` | Human-readable name — mutable |
| `scientific_name` | Required — primary source species, product class, or `Multiple sources` for blends |
| `parent_group` | Required — group slug |
| `parent_category` | Required — always `sweet-flavor` |
| `culinary_group` | Required — aligns to immutable group vocabulary |
| `usage_intensity` | Required — `primary` · `accent` · `luxury` |
| `aliases` | Required array — may be empty |
| `common_names` | Required array — may be empty |
| `external_ids` | Required object — may be `{}` |

---

## 12. usage_intensity

Reuse the suite standard **unchanged**:

| Value | Meaning |
|-------|---------|
| `primary` | Staple prominence — defines dish sweetness character (e.g., honey in glaze, cocoa in bake) |
| `accent` | Supporting role — finishing sweetness, background caramel note |
| `luxury` | Premium or specialty prominence — single-origin honey, specialty cacao nibs |

---

## 13. Reserved Attributes

The following fields are **required on every leaf entity** but remain **empty arrays through FOOD-12B**:

| Field | Populate from |
|-------|---------------|
| `flavor_profile` | FOOD-12C runtime curation standards (post-FOOD-12B) |
| `texture_profile` | FOOD-12C runtime curation standards (post-FOOD-12B) |
| `aroma_profile` | FOOD-12C runtime curation standards (post-FOOD-12B) |

Controlled vocabularies for these fields are frozen in FOOD-12A catalog `schema` — do not populate values until post-FOOD-12B curation standards are approved.

---

## 14. FOOD-12B Target

**Target:** approximately **65–90** canonical ingredients — **bias toward completeness** over minimum count.

Coverage prioritizes **globally significant culinary sweeteners** before regional specialties. Entity quality over count.

See [`SWEET_FLAVOR_TAXONOMY_BLUEPRINT.md`](SWEET_FLAVOR_TAXONOMY_BLUEPRINT.md) for per-group planning targets (~70–80 expected).

---

## 15. Lifecycle & Next Phases

| Phase | Scope |
|-------|-------|
| **FOOD-12A** (this document) | Governance freeze — no entities |
| FOOD-12B | Catalog population + audit |
| FOOD-12C | Runtime compile |
| FOOD-12D | Editorial relationships (~220–300 edges expected) |
| FOOD-12E | Wine pairings (~180–220 edges expected) |
| FOOD-12F | Publication via shared platform |

**Next work:** FOOD-12B — Populate Sweet Flavor Ontology catalog (pending explicit approval).
