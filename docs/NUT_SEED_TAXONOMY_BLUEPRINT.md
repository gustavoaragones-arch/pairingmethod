# FOOD-10A — Nut & Seed Ontology Taxonomy Blueprint

**Status:** **Approved for governance freeze** (July 20, 2026)  
**Parent:** [`NUT_SEED_GOVERNANCE.md`](NUT_SEED_GOVERNANCE.md)  
**Catalog SSOT:** [`data/nut-seed-catalog.json`](../data/nut-seed-catalog.json) (empty `nut_seeds` — populate in FOOD-10B)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)

This document defines the **Nut & Seed Ontology taxonomy** independently of catalog population. Approve this blueprint before adding entities to `nut-seed-catalog.json`.

---

## 1. Domain & Namespace

| Field | Value |
|-------|-------|
| Domain name | **Nut & Seed Ontology** |
| Domain framing | **Culinary nuts, edible seeds, and nut/seed-derived ingredients** — not botanical taxonomy; not snack products or prepared foods |
| Domain key | `nut-seed` |
| Namespace | `food.nut-seed.*` |
| Platform version | `1.0.0` (frozen) |
| Target suite version | `1.7.0` (upon FOOD-10F) |
| Catalog version | `1.0.0` |

### ID examples

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.nut-seed` | `food.nut-seed` |
| Group | `food.nut-seed.{group}` | `food.nut-seed.tree-nuts` |
| Nut / Seed | `food.nut-seed.{group}.{slug}` | `food.nut-seed.tree-nuts.almond` |

Shorthand IDs such as `food.nut-seed.almond` are **not valid**.

---

## 2. Canonical Culinary Groups

Groups are **culinary identity and culinary form**, not botanical families. See [`NUT_SEED_GOVERNANCE.md`](NUT_SEED_GOVERNANCE.md) §3.

```text
Nuts & Seeds (nut-seed)
├── Tree Nuts (tree-nuts)
├── Peanuts (peanuts)
├── Edible Seeds (edible-seeds)
├── Seed Spices (seed-spices)
├── Nut Products (nut-products)
└── Seed Products (seed-products)
```

---

## 3. Hierarchy

Exactly three levels in FOOD-10:

```text
nut_seed_category
    ↓
nut_seed_group              ← Canonical Culinary Group
    ↓
nut_seed                    ← leaf entity
```

Commercial roast levels, salt variants, and trade names are `aliases` or `common_names` — not nested sub-groups. Similarity uses editorial relationships (`similar_nuts_seeds`, `substitutions`), not hierarchy.

---

## 4. Canonical Culinary Groups (6) — immutable

These names, slugs, and group IDs are **frozen controlled vocabularies**. Do not rename. Expand inside groups only.

| Slug | Name | Group ID | `culinary_group` | Planning target |
|------|------|----------|------------------|----------------:|
| `tree-nuts` | Tree Nuts | `food.nut-seed.tree-nuts` | `tree_nuts` | 18–28 |
| `peanuts` | Peanuts | `food.nut-seed.peanuts` | `peanuts` | 4–8 |
| `edible-seeds` | Edible Seeds | `food.nut-seed.edible-seeds` | `edible_seeds` | 20–30 |
| `seed-spices` | Seed Spices | `food.nut-seed.seed-spices` | `seed_spices` | 6–12 |
| `nut-products` | Nut Products | `food.nut-seed.nut-products` | `nut_products` | 12–18 |
| `seed-products` | Seed Products | `food.nut-seed.seed-products` | `seed_products` | 8–14 |

**Grand total target (FOOD-10B):** **80–110** canonical culinary nuts, seeds, and governed nut/seed-derived ingredients

Counts are planning targets for authoritative global coverage — not hard caps. **Entity quality over count.**

### Representative entities (planning — not exhaustive)

| Group | Examples |
|-------|----------|
| Tree Nuts | almond, walnut, pecan, hazelnut, pistachio, cashew, macadamia, pine nut, brazil nut |
| Peanuts | peanut |
| Edible Seeds | sesame, sunflower seed, pumpkin seed, flaxseed, chia seed, hemp seed |
| Seed Spices | nigella, caraway seed, celery seed (when seed identity governs) |
| Nut Products | almond flour, almond butter, peanut butter, hazelnut meal |
| Seed Products | tahini, sesame paste |

**Excluded from Seed Spices:** mustard seed, cumin seed, coriander seed, and other whole spices owned by Herb & Spice (FOOD-07).

---

## 5. Inclusion Criteria

A nut or seed qualifies when it meets **all** of:

1. **Culinary ingredient identity** — recognized as a culinary nut, edible seed, or governed nut/seed-derived ingredient worldwide or in major regional cuisines.
2. **Pairing relevance** — fat, texture, roast character, or seed spice notes materially affect wine pairing.
3. **Taxonomic fit** — maps unambiguously to one Canonical Culinary Group per NUT-001.
4. **Immutable ID assignability** — permanent `food.nut-seed.{group}.{slug}` without collision.
5. **Intrinsic metadata completeness** — all required fields populated from authoritative sources.
6. **Canonical Entity Rule (CANON-001)** — see [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture.
7. **Global Culinary Recognition Rule (CANON-002)** — globally recognizable before regional trade-name splits.
8. **Processed Product Rule (NUT-002)** — §8 governance decisions apply before entity assignment.

---

## 6. Exclusion Criteria

| Exclude | Rationale |
|---------|-----------|
| Botanical taxonomy and cultivars | Not culinary ingredient scope |
| Commercial brands and snack products | Not ingredient ontology |
| Candy, trail mix, breakfast products | Prepared food domain |
| Beverages and plant milks | Beverage domain — reserved |
| Nut and seed oils | Out of domain v1 |
| Prepared foods | Not ingredient ontology |

| Route elsewhere | Owner |
|-----------------|-------|
| Coconut · desiccated coconut · coconut milk | FOOD-09 Fruit Ontology |
| Peanut (protein catalog legacy) | FOOD-10 Nut & Seed — supersedes Protein `nuts-seeds` group references at publication |
| Soybean · lentil · chickpea | FOOD-11 Legume Ontology |
| Mustard seed · cumin · coriander seed | FOOD-07 Herb & Spice Ontology |
| Honey · chocolate | FOOD-12 Sweet Flavor Ontology |
| Wheat flour · rice flour | FOOD-08 Grain & Starch Ontology |

---

## 7. Intrinsic Metadata Summary

See [`NUT_SEED_GOVERNANCE.md`](NUT_SEED_GOVERNANCE.md) §10–12 for frozen vocabularies.

| Field | FOOD-10B |
|-------|----------|
| `culinary_group` | Required — immutable group alignment |
| `usage_intensity` | Required — `primary` · `accent` · `luxury` |
| `flavor_profile` | Required array — **empty** through FOOD-10B |
| `texture_profile` | Required array — **empty** through FOOD-10B |
| `aroma_profile` | Required array — **empty** through FOOD-10B |
| `scientific_name` | Required |

---

## 8. Governance Rules Summary

| Rule | ID | Application |
|------|-----|-------------|
| Culinary Classification Rule | **NUT-001** | Group assignment by culinary identity — peanut in Peanuts group |
| Processed Product Rule | **NUT-002** | Separate entities for flour, butter, tahini; aliases for chopped/toasted forms |
| Processing Ownership | PROC-001 | Suite baseline — NUT-002 extends for nut/seed domain |
| Botanical Ownership | BOTAN-001 | Suite baseline — NUT-001 extends for culinary grouping |
| Culinary Form Ownership | FRUIT-001 | Cross-domain reference only — coconut remains Fruit |

Full definitions: [`NUT_SEED_GOVERNANCE.md`](NUT_SEED_GOVERNANCE.md) §6–9.

---

## 9. Publication Paths (FOOD-10F — planned)

| Page type | URL prefix (planned) |
|-----------|------------------------|
| Category hub | `/nut-seed-categories/nut-seed/` |
| Group hubs | `/nut-seed-groups/{slug}/` |
| Ingredient pages | `/nuts-seeds/{slug}/` |

Publication reuses the shared platform — no architectural changes at FOOD-10F.

---

## 10. Approval

| Milestone | Status |
|-----------|--------|
| Taxonomy blueprint approved | ✓ July 20, 2026 |
| Governance frozen (FOOD-10A) | ✓ |
| Catalog population (FOOD-10B) | Pending explicit approval |
