# FOOD-09A — Fruit Ontology Taxonomy Blueprint

**Status:** **Approved for governance freeze** (July 19, 2026)  
**Parent:** [`FRUIT_GOVERNANCE.md`](FRUIT_GOVERNANCE.md)  
**Catalog SSOT:** [`data/fruit-catalog.json`](../data/fruit-catalog.json) (empty `fruits` — populate in FOOD-09B)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)

This document defines the **Fruit Ontology taxonomy** independently of catalog population. Approve this blueprint before adding entities to `fruit-catalog.json`.

---

## 1. Domain & Namespace

| Field | Value |
|-------|-------|
| Domain name | **Fruit Ontology** |
| Domain framing | **Culinary fruits, berries, citrus, melons, and fruit-derived ingredients** — not horticulture; not beverages or prepared foods |
| Domain key | `fruit` |
| Namespace | `food.fruit.*` |
| Platform version | `1.0.0` (frozen) |
| Target suite version | `1.6.0` (upon FOOD-09F) |
| Catalog version | `1.0.0` |

### ID examples

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.fruit` | `food.fruit` |
| Group | `food.fruit.{group}` | `food.fruit.citrus` |
| Fruit | `food.fruit.{group}.{slug}` | `food.fruit.pomes.apple` |

Shorthand IDs such as `food.fruit.apple` are **not valid**.

---

## 2. Canonical Culinary Groups

Groups are **culinary identity and culinary form**, not botanical families. See [`FRUIT_GOVERNANCE.md`](FRUIT_GOVERNANCE.md) §3.

```text
Fruits (fruit)
├── Pomes (pomes)
├── Stone Fruits (stone-fruits)
├── Citrus (citrus)
├── Berries (berries)
├── Tropical Fruits (tropical-fruits)
├── Melons (melons)
└── Processed Fruits (processed-fruits)
```

---

## 3. Hierarchy

Exactly three levels in FOOD-09:

```text
fruit_category
    ↓
fruit_group                   ← Canonical Culinary Group
    ↓
fruit                         ← leaf entity
```

Regional cultivars, color splits, and commercial trade names are `aliases` or `common_names` — not nested sub-groups. Similarity uses editorial relationships (`similar_fruits`, `substitutions`), not hierarchy.

---

## 4. Canonical Culinary Groups (7) — immutable

These names, slugs, and group IDs are **frozen controlled vocabularies**. Do not rename. Expand inside groups only.

| Slug | Name | Group ID | `culinary_group` | Planning target |
|------|------|----------|------------------|----------------:|
| `pomes` | Pomes | `food.fruit.pomes` | `pomes` | 10–18 |
| `stone-fruits` | Stone Fruits | `food.fruit.stone-fruits` | `stone_fruits` | 15–22 |
| `citrus` | Citrus | `food.fruit.citrus` | `citrus` | 12–18 |
| `berries` | Berries | `food.fruit.berries` | `berries` | 15–22 |
| `tropical-fruits` | Tropical Fruits | `food.fruit.tropical-fruits` | `tropical_fruits` | 20–30 |
| `melons` | Melons | `food.fruit.melons` | `melons` | 6–10 |
| `processed-fruits` | Processed Fruits | `food.fruit.processed-fruits` | `processed_fruits` | 12–20 |

**Grand total target (FOOD-09B):** **100–140** canonical culinary fruits and fruit-derived ingredients

Counts are planning targets for authoritative global coverage — not hard caps. **Entity quality over count.**

### Representative entities (planning — not exhaustive)

| Group | Examples |
|-------|----------|
| Pomes | apple, pear, quince |
| Stone Fruits | peach, plum, cherry, apricot, nectarine |
| Citrus | lemon, lime, orange, grapefruit, yuzu, mandarin |
| Berries | strawberry, raspberry, blueberry, blackberry, cranberry |
| Tropical Fruits | mango, pineapple, papaya, banana, coconut, avocado, passion fruit |
| Melons | watermelon, cantaloupe, honeydew |
| Processed Fruits | raisin, prune, date, fig (dried), desiccated coconut |

**Excluded from this domain:** juices, jams, preserves, wines, cider, desserts, candies, flavored products.

---

## 5. Inclusion Criteria

A fruit qualifies when it meets **all** of:

1. **Culinary ingredient identity** — recognized as a culinary fruit, berry, or governed fruit-derived ingredient worldwide or in major regional cuisines.
2. **Pairing relevance** — acidity, sweetness, texture, or aroma materially affects wine pairing.
3. **Taxonomic fit** — maps unambiguously to one Canonical Culinary Group.
4. **Immutable ID assignability** — permanent `food.fruit.{group}.{slug}` without collision.
5. **Intrinsic metadata completeness** — all required fields populated from authoritative sources.
6. **Canonical Entity Rule (CANON-001)** — see [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture.
7. **Global Culinary Recognition Rule (CANON-002)** — globally recognizable before regional cultivar splits.
8. **Culinary Form Ownership Rule (FRUIT-001)** — §8 governance decisions apply before entity assignment.

---

## 6. Exclusion Criteria

| Exclude | Rationale |
|---------|-----------|
| Horticulture and cultivar taxonomy | Not culinary ingredient scope |
| Orchards and commercial brands | Not ingredient ontology |
| Juices and fruit beverages | Beverage domain |
| Jams, preserves, compotes | Prepared food / Sweet Flavor (FOOD-12) |
| Wines, cider, perry | Beverage domain |
| Desserts and candies | Prepared food domain |
| Flavored products | Not canonical ingredient |
| Tomato | Vegetable Ontology — culinary vegetable |
| Olive (fresh) | Reserved — not populated without governance amendment |

| Route elsewhere | Owner |
|-----------------|-------|
| Tomato | FOOD-05 Vegetable Ontology |
| Sweet corn (fresh) | FOOD-05 Vegetable Ontology |
| Nuts (almond, walnut) | FOOD-10 Nut & Seed Ontology |
| Honey | FOOD-12 Sweet Flavor Ontology |
| Chocolate | FOOD-12 Sweet Flavor Ontology |
| Grain starches | FOOD-08 Grain & Starch Ontology |

---

## 7. Intrinsic Metadata Summary

See [`FRUIT_GOVERNANCE.md`](FRUIT_GOVERNANCE.md) §7 for frozen vocabularies.

| Field | FOOD-09B |
|-------|----------|
| `culinary_group` | Required — immutable group alignment |
| `usage_intensity` | Required — `primary` · `accent` · `luxury` |
| `parent_group` / `parent_category` | Required — group slug + `fruit` |
| `aliases`, `common_names` | Required arrays — may be `[]` |
| `flavor_profile` | Reserved — `[]` only in FOOD-09B |
| `texture_profile` | Reserved — `[]` only in FOOD-09B |
| `aroma_profile` | Reserved — `[]` only in FOOD-09B |
| `scientific_name` | Required — primary species or `Multiple species` |

### `usage_intensity` examples (intrinsic — never inferred)

| Entity | Group | `usage_intensity` |
|--------|-------|-------------------|
| Apple | Pomes | `primary` |
| Lemon | Citrus | `accent` |
| Mango | Tropical Fruits | `primary` |
| Raisin | Processed Fruits | `accent` |
| Yuzu | Citrus | `luxury` |

---

## 8. Culinary Form Ownership (FRUIT-001 freeze)

See [`FRUIT_GOVERNANCE.md`](FRUIT_GOVERNANCE.md) §6 and [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §PROC-001.

Summary for catalog population:

| Case | FOOD-09B assignment |
|------|---------------------|
| Grape vs raisin | Separate entities — Citrus/Berries/Tropical (fresh grape group TBD at audit) and Processed Fruits |
| Plum vs prune | Separate entities — Stone Fruits and Processed Fruits |
| Coconut vs desiccated coconut | Separate entities if audit confirms distinct identity — Tropical Fruits and Processed Fruits |
| Coconut vs coconut milk | Govern per FRUIT-001 — separate only if independent culinary ingredient identity confirmed |
| Sliced / diced / zested forms | Aliases or `common_preparations` on fresh fruit entity |
| Red apple vs green apple | Aliases on Apple (CANON-001) |
| Tomato | **Excluded** — Vegetable domain |

---

## 9. Cross-Domain Relationships (FOOD-09D/E)

Fruit entities participate in cross-domain edges; they do not own foreign intrinsic data.

| Relationship | Typical targets | Layer |
|--------------|-----------------|-------|
| `commonly_served_with` | `food.protein.*`, `food.cheese.*`, `food.grain.*`, `food.vegetable.*` | Editorial |
| `similar_to` | `food.fruit.*` | Editorial |
| `substitutes_for` | `food.fruit.*` | Editorial |
| `pairs_with_style` | Wine style slugs | Pairing |
| `pairs_with_descriptor` | Descriptor slugs | Pairing |
| `pairs_with_technique` | Technique slugs | Pairing |

Example resolving existing forward references:

```text
food.cheese.bloomy-rind.brie-de-meaux
  commonly_served_with → food.fruit.grape        ← populated at FOOD-09B

food.fruit.pomes.apple
  commonly_served_with → food.cheese.aged.cheddar
  pairs_with_style → riesling
```

---

## 10. Publication Paths (FOOD-09F — planning only)

Publication is out of scope for FOOD-09A. Domain config in FOOD-09F will bind:

| Layer | Planned path |
|-------|--------------|
| Category hub | `/fruit-categories/fruit/` |
| Group hubs | `/fruit-groups/{slug}/` |
| Ingredient pages | `/fruits/{slug}/` |

Exact URL prefixes are finalized in FOOD-09F domain configuration — no platform changes expected.

---

## 11. Approval Gate

| Requirement | Status |
|-------------|--------|
| Governance document frozen | FOOD-09A |
| Taxonomy blueprint approved | This document |
| Catalog shell with empty `fruits` | `data/fruit-catalog.json` |
| Seven immutable groups defined | §4 |
| FRUIT-001 introduced | [`FRUIT_GOVERNANCE.md`](FRUIT_GOVERNANCE.md) §6 |
| Cross-domain ownership frozen | [`FRUIT_GOVERNANCE.md`](FRUIT_GOVERNANCE.md) §9 |
| Platform modifications | **0** |

**Proceed to FOOD-09B only after explicit approval.**
