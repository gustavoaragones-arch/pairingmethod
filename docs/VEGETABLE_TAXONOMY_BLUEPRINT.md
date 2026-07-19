# FOOD-05A — Vegetable Ontology Taxonomy Blueprint

**Status:** **Approved for governance freeze** (July 18, 2026)  
**Parent:** [`VEGETABLE_GOVERNANCE.md`](VEGETABLE_GOVERNANCE.md)  
**Catalog SSOT:** [`data/vegetable-catalog.json`](../data/vegetable-catalog.json) (empty `vegetables` — populate in FOOD-05B)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md)

This document defines the **Vegetable Ontology taxonomy** independently of catalog population. Approve this blueprint before adding entities to `vegetable-catalog.json`.

---

## 1. Domain & Namespace

| Field | Value |
|-------|-------|
| Domain name | **Vegetable Ontology** |
| Domain key | `vegetable` |
| Namespace | `food.vegetable.*` |
| Platform version | `1.0.0` (frozen) |
| Target suite version | `1.2.0` (upon FOOD-05F) |
| Catalog version | `1.0.0` |

### ID examples

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.vegetable` | `food.vegetable` |
| Group | `food.vegetable.{group}` | `food.vegetable.nightshades` |
| Vegetable | `food.vegetable.{group}.{slug}` | `food.vegetable.nightshades.tomato` |

---

## 2. Canonical Culinary Groups

Groups are **culinary**, not botanical. See [`VEGETABLE_GOVERNANCE.md`](VEGETABLE_GOVERNANCE.md) §3.

```text
Vegetables (vegetable)
├── Alliums (alliums)
├── Green Vegetables (green-vegetables)
├── Root Vegetables (root-vegetables)
└── Nightshades (nightshades)
```

---

## 3. Hierarchy

Exactly three levels in FOOD-05:

```text
vegetable_category
    ↓
vegetable_group          ← Canonical Culinary Group
    ↓
vegetable                ← leaf entity
```

Cultivar variants, regional names, and preparation forms are `vegetable` leaf entities — not nested sub-groups. Similarity uses editorial relationships (`similar_vegetables`, `substitutions`), not hierarchy.

---

## 4. Canonical Culinary Groups (4) — immutable

These names and slugs are **frozen controlled vocabularies**. Do not rename. Expand inside groups only.

| Slug | Name | Group ID | `culinary_group` | Poster row | Planning target |
|------|------|----------|------------------|------------|----------------:|
| `alliums` | Alliums | `food.vegetable.alliums` | `alliums` | Alliums | 15–25 |
| `green-vegetables` | Green Vegetables | `food.vegetable.green-vegetables` | `green_vegetables` | Green Vegetables | 25–40 |
| `root-vegetables` | Root Vegetables | `food.vegetable.root-vegetables` | `root_vegetables` | Root Vegetables & Squash | 20–35 |
| `nightshades` | Nightshades | `food.vegetable.nightshades` | `nightshades` | Nightshades | 10–20 |

**Grand total target (FOOD-05B):** **70–120** canonical vegetables

Counts are planning targets for balanced poster coverage — not hard caps.

### Representative entities (planning — not exhaustive)

| Group | Examples |
|-------|----------|
| Alliums | garlic, onion, shallot, leek, scallion, chive |
| Green Vegetables | kale, spinach, lettuce, green bean, asparagus, broccoli |
| Root Vegetables | carrot, beet, turnip, parsnip, butternut squash, delicata squash |
| Nightshades | tomato, eggplant, bell pepper, chili pepper (culinary vegetable context) |

**Excluded from this domain:** potato, sweet potato (FOOD-08); mushroom (FOOD-06); basil, black pepper (FOOD-07).

---

## 5. Inclusion Criteria

A vegetable qualifies when it meets **all** of:

1. **Culinary vegetable identity** — treated as a vegetable in pairing and recipe literature (poster-aligned).
2. **Pairing relevance** — flavor, texture, sulfur, bitterness, or acidity materially affects wine pairing.
3. **Taxonomic fit** — maps unambiguously to one Canonical Culinary Group.
4. **Immutable ID assignability** — permanent `food.vegetable.{group}.{slug}` without collision.
5. **Intrinsic metadata completeness** — all required fields populated from authoritative sources.

---

## 6. Exclusion Criteria

| Exclude | Route to |
|---------|----------|
| Culinary fungi | FOOD-06 Fungi Ontology |
| Fresh herbs & dried spices | FOOD-07 Herb & Spice Ontology |
| Potato, sweet potato, taro, yucca | FOOD-08 Grain & Starch Ontology |
| Sweet fruits (apple, berry, …) | FOOD-09 Fruit Ontology |
| Legumes (lentil, chickpea, …) | FOOD-11 Legume Ontology |
| Prepared sauces | FOOD-13 Sauce & Condiment Ontology |

---

## 7. Intrinsic Metadata Summary

See [`VEGETABLE_GOVERNANCE.md`](VEGETABLE_GOVERNANCE.md) §7 for frozen vocabularies.

| Field | FOOD-05B |
|-------|----------|
| `culinary_group` | Required — immutable group alignment |
| `culinary_role` | Required — subset of values populated in 05B is acceptable |
| `plant_part`, `flavor_intensity`, `texture`, `moisture_class`, `seasonality` | Required |
| `flavor_profile` | Reserved — `[]` only in FOOD-05B; vocabulary frozen |
| `scientific_name` | Required — botanical species |

---

## 8. Cross-Domain Relationships (FOOD-05D/E)

Vegetable entities participate in cross-domain edges; they do not own foreign intrinsic data.

| Relationship | Typical targets | Layer |
|--------------|-----------------|-------|
| `commonly_served_with` | `food.protein.*`, `food.cheese.*`, future `food.sauce.*` | Editorial |
| `similar_to` | `food.vegetable.*` | Editorial |
| `substitutes_for` | `food.vegetable.*` | Editorial |
| `pairs_with_style` | Wine style slugs | Pairing |
| `pairs_with_descriptor` | Descriptor slugs | Pairing |
| `pairs_with_technique` | Technique slugs | Pairing |

**First-domain demonstration:** FOOD-05D/E should populate representative cross-domain editorial edges (e.g. tomato ↔ cheese, garlic ↔ protein) using canonical IDs only.

---

## 9. Publication (FOOD-05F preview)

Publication consumes shared platform domain configuration:

| Artifact prefix | Example |
|-----------------|---------|
| Projections | `data/generated/vegetable-*.json` |
| Pages | `data/pages/vegetable-*.json` |
| HTML | `dist/vegetables/`, `dist/vegetable-groups/`, `dist/vegetable-categories/` |
| URLs | `/vegetables/{slug}/`, `/vegetable-groups/{slug}/` |

No platform code changes — domain descriptor only.

---

## 10. Population Plan (FOOD-05B)

1. Populate category + group hub entities (already in catalog shell).
2. Acquire authoritative vegetable list per Canonical Culinary Group.
3. Assign immutable IDs and intrinsic metadata.
4. Leave relationship arrays empty.
5. Run catalog audit before FOOD-05C.

**Approval required before FOOD-05B begins.**
