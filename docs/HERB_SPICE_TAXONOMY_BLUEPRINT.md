# FOOD-07A — Herb & Spice Ontology Taxonomy Blueprint

**Status:** **Approved for governance freeze** (July 19, 2026)  
**Parent:** [`HERB_SPICE_GOVERNANCE.md`](HERB_SPICE_GOVERNANCE.md)  
**Catalog SSOT:** [`data/herb-spice-catalog.json`](../data/herb-spice-catalog.json) (empty `herb_spices` — populate in FOOD-07B)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)

This document defines the **Herb & Spice Ontology taxonomy** independently of catalog population. Approve this blueprint before adding entities to `herb-spice-catalog.json`.

---

## 1. Domain & Namespace

| Field | Value |
|-------|-------|
| Domain name | **Herb & Spice Ontology** |
| Domain framing | **Culinary herbs and spices** — not botanical taxonomy; not medicinal products |
| Domain key | `herb-spice` |
| Namespace | `food.herb.*` |
| Platform version | `1.0.0` (frozen) |
| Target suite version | `1.4.0` (upon FOOD-07F) |
| Catalog version | `1.0.0` |

### ID examples

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.herb` | `food.herb` |
| Group | `food.herb.{group}` | `food.herb.fresh-herbs` |
| Herb / Spice | `food.herb.{group}.{slug}` | `food.herb.fresh-herbs.basil` |

Shorthand IDs such as `food.herb.basil` are **not valid**. Existing suite forward references use the full three-segment pattern at publication time (e.g. `food.herb.fresh-herbs.basil`).

---

## 2. Canonical Culinary Groups

Groups are **culinary usage forms**, not plant families. See [`HERB_SPICE_GOVERNANCE.md`](HERB_SPICE_GOVERNANCE.md) §3.

```text
Herbs & Spices (herb)
├── Fresh Herbs (fresh-herbs)
├── Dried Herbs (dried-herbs)
├── Whole Spices (whole-spices)
└── Ground & Blended Spices (ground-blended-spices)
```

---

## 3. Hierarchy

Exactly three levels in FOOD-07:

```text
herb_spice_category
    ↓
herb_spice_group              ← Canonical Culinary Group
    ↓
herb_spice                    ← leaf entity
```

Regional trade names, grind sizes, and cultivar labels are `aliases` or `common_names` — not nested sub-groups. Similarity uses editorial relationships (`similar_herb_spices`, `substitutions`), not hierarchy.

---

## 4. Canonical Culinary Groups (4) — immutable

These names, slugs, and group IDs are **frozen controlled vocabularies**. Do not rename. Expand inside groups only.

| Slug | Name | Group ID | `culinary_group` | Planning target |
|------|------|----------|------------------|----------------:|
| `fresh-herbs` | Fresh Herbs | `food.herb.fresh-herbs` | `fresh_herbs` | 20–35 |
| `dried-herbs` | Dried Herbs | `food.herb.dried-herbs` | `dried_herbs` | 15–25 |
| `whole-spices` | Whole Spices | `food.herb.whole-spices` | `whole_spices` | 20–30 |
| `ground-blended-spices` | Ground & Blended Spices | `food.herb.ground-blended-spices` | `ground_blended_spices` | 25–35 |

**Grand total target (FOOD-07B):** **80–120** canonical culinary herbs and spices

Counts are planning targets for authoritative global coverage — not hard caps. **Entity quality over count.**

### Representative entities (planning — not exhaustive)

| Group | Examples |
|-------|----------|
| Fresh Herbs | basil, cilantro, parsley, dill, mint, tarragon, chives |
| Dried Herbs | oregano, thyme, rosemary, bay leaf, sage, marjoram |
| Whole Spices | black pepper, cinnamon, coriander seed, cumin seed, cardamom, cloves, star anise |
| Ground & Blended Spices | paprika, turmeric, chili powder, garam masala, curry powder, five spice |

**Excluded from this domain:** medicinal-only botanicals; teas; supplements; extracts; essential oils; ornamental plants.

---

## 5. Inclusion Criteria

A culinary herb or spice qualifies when it meets **all** of:

1. **Culinary ingredient identity** — recognized as a savory culinary herb, spice, or widely used spice blend worldwide or in major regional cuisines.
2. **Pairing relevance** — aroma, heat, bitterness, or seasoning character materially affects wine pairing.
3. **Taxonomic fit** — maps unambiguously to one Canonical Culinary Group (usage form).
4. **Immutable ID assignability** — permanent `food.herb.{group}.{slug}` without collision.
5. **Intrinsic metadata completeness** — all required fields populated from authoritative sources.
6. **Canonical Entity Rule (CANON-001)** — see [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture; one entity per canonical culinary ingredient (§5 enforcement in [`HERB_SPICE_GOVERNANCE.md`](HERB_SPICE_GOVERNANCE.md)).
7. **Botanical Ownership Rule** — when multiple forms exist, §10 governance decisions apply before entity assignment.

---

## 6. Exclusion Criteria

| Exclude | Rationale |
|---------|-----------|
| Medicinal-only botanicals | Not culinary ingredient scope |
| Teas | Beverage domain — not savory herb/spice ingredients |
| Supplements | Not culinary ingredients |
| Extracts and essential oils | Processed products — out of scope |
| Ornamental plants | Not culinary ingredients |
| Prepared hot sauces and condiments | Sauce & Condiment Ontology (FOOD-13) |
| Botanical family classification | Not hierarchy driver |

| Route elsewhere | Owner |
|-----------------|-------|
| Vegetables (garlic, onion, mustard greens, fennel bulb) | FOOD-05 Vegetable Ontology |
| Fungi | FOOD-06 Fungi Ontology |
| Nuts & seeds (poster row) | FOOD-10 Nut & Seed Ontology |
| Legumes | FOOD-11 Legume Ontology |
| Sauces & condiments | FOOD-13 Sauce & Condiment Ontology |

---

## 7. Intrinsic Metadata Summary

See [`HERB_SPICE_GOVERNANCE.md`](HERB_SPICE_GOVERNANCE.md) §7 for frozen vocabularies.

| Field | FOOD-07B |
|-------|----------|
| `culinary_group` | Required — immutable group alignment |
| `usage_intensity` | Required — `primary` · `accent` · `luxury` (suite vocabulary unchanged) |
| `parent_group` / `parent_category` | Required — group slug + `herb` category |
| `aliases`, `common_names` | Required arrays — may be `[]` |
| `flavor_profile` | Reserved — `[]` only in FOOD-07B |
| `texture_profile` | Reserved — `[]` only in FOOD-07B |
| `aroma_profile` | Reserved — `[]` only in FOOD-07B |
| `scientific_name` | Required — primary botanical species for culinary identity |

### `usage_intensity` examples (intrinsic — never inferred)

| Entity | Group | `usage_intensity` |
|--------|-------|-------------------|
| Basil | Fresh Herbs | `primary` |
| Thyme | Dried Herbs | `accent` |
| Saffron | Whole Spices | `luxury` |
| Black Pepper | Whole Spices | `accent` |
| Garam Masala | Ground & Blended Spices | `accent` |

---

## 8. Botanical Ownership (FOOD-07A freeze)

See [`HERB_SPICE_GOVERNANCE.md`](HERB_SPICE_GOVERNANCE.md) §10 for the full rule and frozen decisions.

Summary for catalog population:

| Case | FOOD-07B assignment |
|------|---------------------|
| Cilantro vs coriander seed | Separate entities in Fresh Herbs and Whole Spices |
| Dill leaf vs dill seed | Separate entities |
| Mustard greens vs mustard seed | Greens → Vegetable; seed → Whole Spices |
| Fennel bulb vs fennel seed | Bulb → Vegetable; seed → Whole Spices |
| Whole vs ground black pepper | One entity (Black Pepper); ground as alias |

---

## 9. Cross-Domain Relationships (FOOD-07D/E)

Herb & Spice entities participate in cross-domain edges; they do not own foreign intrinsic data.

| Relationship | Typical targets | Layer |
|--------------|-----------------|-------|
| `commonly_served_with` | `food.vegetable.*`, `food.protein.*`, `food.cheese.*`, `food.fungi.*` | Editorial |
| `similar_to` | `food.herb.*` | Editorial |
| `substitutes_for` | `food.herb.*` | Editorial |
| `pairs_with_style` | Wine style slugs | Pairing |
| `pairs_with_descriptor` | Descriptor slugs | Pairing |
| `pairs_with_technique` | Technique slugs | Pairing |

**FOOD-07 demonstration:** Editorial Tier C should populate representative cross-domain edges (e.g. basil ↔ tomato, thyme ↔ mushroom) using canonical IDs only.

Example:

```text
food.herb.fresh-herbs.basil
  commonly_served_with → food.vegetable.nightshades.tomato
  commonly_served_with → food.cheese.fresh.mozzarella

food.herb.dried-herbs.thyme
  commonly_served_with → food.fungi.wild-mushrooms.porcini
  commonly_served_with → food.protein.beef.brisket
```

---

## 10. Publication (FOOD-07F preview)

Publication consumes shared platform domain configuration — **no platform code changes**.

| Artifact prefix | Example |
|-----------------|---------|
| Public URL path | `/herbs/` or `/herb-spices/` (domain config in FOOD-07F) |
| Group hub | `/herb-groups/fresh-herbs/` |
| Entity page | `/herbs/fresh-herbs/basil/` |

Exact URL scheme is finalized in FOOD-07F domain configuration — not in FOOD-07A.

---

## 11. Poster Alignment

Poster **Herbs & Spices** rows map to FOOD-07:

| Poster row | Primary group(s) |
|------------|------------------|
| Herbs | Fresh Herbs, Dried Herbs |
| Black Pepper | Whole Spices |
| Red Pepper | Whole Spices, Ground & Blended Spices |
| Hot & Spicy | Ground & Blended Spices (prepared hot sauces → FOOD-13) |
| Baking Spices | Whole Spices, Ground & Blended Spices |
| Exotic & Aromatic Spices | Whole Spices, Ground & Blended Spices |

Poster rows **Nuts & Seeds** and **Beans & Peas** route to FOOD-10 and FOOD-11 — not FOOD-07.

---

## 12. Approval

| Milestone | Status |
|-----------|--------|
| FOOD-07A taxonomy blueprint | **Frozen** |
| FOOD-07B catalog population | Pending approval |

**Next:** FOOD-07B — populate `herb_spices[]` with ~80–120 canonical entities per inclusion criteria and §10 Botanical Ownership Rule.
