# FOOD-12A — Sweet Flavor Ontology Taxonomy Blueprint

**Status:** **Approved for governance freeze** (August 2, 2026)  
**Parent:** [`SWEET_FLAVOR_GOVERNANCE.md`](SWEET_FLAVOR_GOVERNANCE.md)  
**Catalog SSOT:** [`data/sweet-flavor-catalog.json`](../data/sweet-flavor-catalog.json) (empty `sweet_flavors` — populate in FOOD-12B)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)

This document defines the **Sweet Flavor Ontology taxonomy** independently of catalog population. Approve this blueprint before adding entities to `sweet-flavor-catalog.json`.

---

## 1. Domain & Namespace

| Field | Value |
|-------|-------|
| Domain name | **Sweet Flavor Ontology** |
| Domain framing | **Culinary sweeteners and sweet flavor ingredients** — not desserts, confectionery, beverages, or recipes |
| Domain key | `sweet-flavor` |
| Namespace | `food.sweet-flavor.*` |
| Platform version | `1.0.0` (frozen) |
| Target suite version | `1.9.0` (upon FOOD-12F) |
| Catalog version | `1.0.0` |

### ID examples

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.sweet-flavor` | `food.sweet-flavor` |
| Group | `food.sweet-flavor.{group}` | `food.sweet-flavor.sugars` |
| Sweet Flavor | `food.sweet-flavor.{group}.{slug}` | `food.sweet-flavor.sugars.cane-sugar` |

Shorthand IDs such as `food.sweet-flavor.cane-sugar` are **not valid**.

---

## 2. Canonical Culinary Groups

Groups are **culinary sweetener identity and culinary form**, not dessert categories. See [`SWEET_FLAVOR_GOVERNANCE.md`](SWEET_FLAVOR_GOVERNANCE.md) §3.

```text
Sweet Flavors (sweet-flavor)
├── Sugars (sugars)
├── Syrups (syrups)
├── Honey & Bee Products (honey-bee-products)
├── Natural Sweeteners (natural-sweeteners)
├── Alternative Sweeteners (alternative-sweeteners)
└── Cocoa & Chocolate Ingredients (cocoa-chocolate-ingredients)
```

---

## 3. Hierarchy

Exactly three levels in FOOD-12:

```text
sweet_flavor_category
    ↓
sweet_flavor_group              ← Canonical Culinary Group
    ↓
sweet_flavor                    ← leaf entity
```

Granulation variants, color grades, and trade names are `aliases` or `common_names` — not nested sub-groups unless SWEET-001 documents distinct culinary identity. Similarity uses editorial relationships, not hierarchy.

---

## 4. Canonical Culinary Groups (6) — immutable

These names, slugs, and group IDs are **frozen controlled vocabularies**. Do not rename. Expand inside groups only.

| Slug | Name | Group ID | `culinary_group` | Planning target |
|------|------|----------|------------------|----------------:|
| `sugars` | Sugars | `food.sweet-flavor.sugars` | `sugars` | 12–14 |
| `syrups` | Syrups | `food.sweet-flavor.syrups` | `syrups` | 12–14 |
| `honey-bee-products` | Honey & Bee Products | `food.sweet-flavor.honey-bee-products` | `honey_bee_products` | 4–6 |
| `natural-sweeteners` | Natural Sweeteners | `food.sweet-flavor.natural-sweeteners` | `natural_sweeteners` | 10–12 |
| `alternative-sweeteners` | Alternative Sweeteners | `food.sweet-flavor.alternative-sweeteners` | `alternative_sweeteners` | 10–12 |
| `cocoa-chocolate-ingredients` | Cocoa & Chocolate Ingredients | `food.sweet-flavor.cocoa-chocolate-ingredients` | `cocoa_chocolate_ingredients` | 18–22 |

**Grand total target (FOOD-12B):** **65–90** canonical culinary sweet flavor ingredients (~**70–80** expected with completeness bias)

Counts are planning targets for authoritative global coverage — not hard caps. **Entity quality over count.**

### Representative entities (planning — not exhaustive)

| Group | Examples |
|-------|----------|
| Sugars | cane sugar, beet sugar, palm sugar, brown sugar, muscovado sugar |
| Syrups | maple syrup, molasses, corn syrup, golden syrup, rice syrup |
| Honey & Bee Products | honey, comb honey — bee pollen, royal jelly, and propolis excluded (supplement scope) |
| Natural Sweeteners | agave, date syrup, monk fruit sweetener, coconut sugar |
| Alternative Sweeteners | erythritol, xylitol, allulose, stevia |
| Cocoa & Chocolate Ingredients | cocoa bean, cocoa powder, cocoa butter, cacao nibs, chocolate liquor |

---

## 5. Inclusion Criteria

A sweet flavor ingredient qualifies when it meets **all** of:

1. **Culinary ingredient identity** — recognized as a culinary sweetener or sweet flavor ingredient worldwide or in major regional cuisines.
2. **Pairing relevance** — sweetness character, acidity balance, bitterness, or fat content materially affects wine pairing.
3. **Taxonomic fit** — maps unambiguously to one Canonical Culinary Group per SWEET-001.
4. **Immutable ID assignability** — permanent `food.sweet-flavor.{group}.{slug}` without collision.
5. **Intrinsic metadata completeness** — all required fields populated from authoritative sources.
6. **Canonical Entity Rule (CANON-001)** — see [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture.
7. **Global Culinary Recognition Rule (CANON-002)** — globally recognizable before regional trade-name splits.
8. **Processing Ownership Rule (SWEET-001)** — §7 governance decisions and identity test apply before entity assignment.
9. **Cocoa Ownership Rule (COCOA-001)** — §8 governs cacao-derived ingredient ownership before entity assignment.

---

## 6. Exclusion Criteria

| Exclude | Rationale |
|---------|-----------|
| Finished desserts and composed dishes | Not ingredient ontology |
| Candy and confectionery products | Not ingredient ontology |
| Beverages and sweet drinks | Out of domain v1 |
| Commercial brands | Not ingredient ontology |
| Recipes | Not ingredient ontology |

| Route elsewhere | Owner |
|-----------------|-------|
| Date (whole) | FOOD-09 Fruit Ontology |
| Corn (whole) | FOOD-08 Grain & Starch Ontology |
| Coconut (whole) | FOOD-09 Fruit Ontology |
| Vanilla Bean | FOOD-07 Herb & Spice Ontology |
| Vanilla Extract · almond extract · orange blossom water · rose water · caramel sauce · chocolate syrup | FOOD-13 Sauces & Condiments — composed preparations deferred |
| Bee pollen · royal jelly · propolis | Excluded — supplement scope, not mainstream culinary sweeteners |
| Finished chocolate products | Excluded — deferred per COCOA-001 |
| Coffee beverages | Deferred — not Sweet Flavor v1 |
| Honey in legacy editorial shorthand | FOOD-12 Sweet Flavor — canonical targets at publication |

---

## 7. Intrinsic Metadata Summary

See [`SWEET_FLAVOR_GOVERNANCE.md`](SWEET_FLAVOR_GOVERNANCE.md) §11–13 for frozen vocabularies.

| Field | FOOD-12B |
|-------|----------|
| `culinary_group` | Required — immutable group alignment |
| `usage_intensity` | Required — `primary` · `accent` · `luxury` |
| `flavor_profile` | Required array — **empty** through FOOD-12B |
| `texture_profile` | Required array — **empty** through FOOD-12B |
| `aroma_profile` | Required array — **empty** through FOOD-12B |
| `scientific_name` | Required |

---

## 8. Governance Rules Summary

| Rule | ID | Application |
|------|-----|-------------|
| Processing Ownership Rule | **SWEET-001** | Identity test + separate entities when culinary identity changes; aliases for granulation variants |
| Cocoa Ownership Rule | **COCOA-001** | Cocoa bean agricultural form; independent cocoa-derived ingredients; finished chocolate excluded |
| Culinary Role Pairing Rule | **SWEET-PAIR-001** | Wine pairing by culinary role, not sweetness alone — FOOD-12E |
| Processing Ownership | PROC-001 | Suite baseline — SWEET-001 extends for sweet domain |
| Culinary Form Ownership | FRUIT-001 | Cross-domain processed-form discipline — date vs date syrup |
| Processed Product (suite) | NUT-002 · LEGUME-002 | Suite baseline reference |

Full definitions: [`SWEET_FLAVOR_GOVERNANCE.md`](SWEET_FLAVOR_GOVERNANCE.md) §6–10.

---

## 9. Publication Paths (FOOD-12F — planned)

| Page type | URL prefix (planned) |
|-----------|------------------------|
| Category hub | `/sweet-flavor-categories/sweet-flavor/` |
| Group hubs | `/sweet-flavor-groups/{slug}/` |
| Ingredient pages | `/sweet-flavors/{slug}/` |

Publication reuses the shared platform — no architectural changes at FOOD-12F.

---

## 10. Expected Suite Impact (post-FOOD-12F)

| Metric | Approximate |
|--------|------------:|
| Published domains | 10 |
| Canonical entities | 1,070–1,090 |
| Runtime relationships | ~105,000+ |
| Editorial relationships | ~2,000+ |
| Wine relationships | ~1,580+ |
| Publication pages | ~1,153–1,163 |

---

## 11. Approval

| Milestone | Status |
|-----------|--------|
| Taxonomy blueprint approved | **Yes** — August 2, 2026 |
| Governance frozen | **Yes** — FOOD-12A |
| Catalog population authorized | **Pending** — awaits FOOD-12B approval |
