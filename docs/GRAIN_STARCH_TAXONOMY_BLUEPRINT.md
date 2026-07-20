# FOOD-08A — Grain & Starch Ontology Taxonomy Blueprint

**Status:** **Approved for governance freeze** (July 19, 2026)  
**Parent:** [`GRAIN_STARCH_GOVERNANCE.md`](GRAIN_STARCH_GOVERNANCE.md)  
**Catalog SSOT:** [`data/grain-starch-catalog.json`](../data/grain-starch-catalog.json) (empty `grain_starches` — populate in FOOD-08B)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)

This document defines the **Grain & Starch Ontology taxonomy** independently of catalog population. Approve this blueprint before adding entities to `grain-starch-catalog.json`.

---

## 1. Domain & Namespace

| Field | Value |
|-------|-------|
| Domain name | **Grain & Starch Ontology** |
| Domain framing | **Culinary grains, pseudocereals, starches, and staple grain-derived ingredients** — not crop science; not prepared foods |
| Domain key | `grain-starch` |
| Namespace | `food.grain.*` |
| Platform version | `1.0.0` (frozen) |
| Target suite version | `1.5.0` (upon FOOD-08F) |
| Catalog version | `1.0.0` |

### ID examples

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.grain` | `food.grain` |
| Group | `food.grain.{group}` | `food.grain.whole-grains` |
| Grain / Starch | `food.grain.{group}.{slug}` | `food.grain.whole-grains.rice` |

Shorthand IDs such as `food.grain.rice` are **not valid**.

---

## 2. Canonical Culinary Groups

Groups are **culinary identity and processing level**, not botanical families. See [`GRAIN_STARCH_GOVERNANCE.md`](GRAIN_STARCH_GOVERNANCE.md) §3.

```text
Grains & Starches (grain-starch)
├── Whole Grains (whole-grains)
├── Pseudocereals (pseudocereals)
├── Processed Grains (processed-grains)
└── Starches (starches)
```

---

## 3. Hierarchy

Exactly three levels in FOOD-08:

```text
grain_starch_category
    ↓
grain_starch_group              ← Canonical Culinary Group
    ↓
grain_starch                    ← leaf entity
```

Regional trade names, mill grades, and cultivar labels are `aliases` or `common_names` — not nested sub-groups. Similarity uses editorial relationships (`similar_grain_starches`, `substitutions`), not hierarchy.

---

## 4. Canonical Culinary Groups (4) — immutable

These names, slugs, and group IDs are **frozen controlled vocabularies**. Do not rename. Expand inside groups only.

| Slug | Name | Group ID | `culinary_group` | Planning target |
|------|------|----------|------------------|----------------:|
| `whole-grains` | Whole Grains | `food.grain.whole-grains` | `whole_grains` | 15–25 |
| `pseudocereals` | Pseudocereals | `food.grain.pseudocereals` | `pseudocereals` | 8–15 |
| `processed-grains` | Processed Grains | `food.grain.processed-grains` | `processed_grains` | 20–30 |
| `starches` | Starches | `food.grain.starches` | `starches` | 12–20 |

**Grand total target (FOOD-08B):** **70–100** canonical culinary grains and starches

Counts are planning targets for authoritative global coverage — not hard caps. **Entity quality over count.**

### Representative entities (planning — not exhaustive)

| Group | Examples |
|-------|----------|
| Whole Grains | rice, wheat, barley, rye, oats, corn, millet, sorghum |
| Pseudocereals | quinoa, buckwheat, amaranth |
| Processed Grains | wheat flour, rice flour, cornmeal, semolina, polenta meal, bulgur |
| Starches | cornstarch, potato starch, tapioca starch, arrowroot starch, rice starch |

**Excluded from this domain:** breads, noodles, pasta, breakfast cereals, pastries, beer, spirits, prepared dishes.

---

## 5. Inclusion Criteria

A grain or starch qualifies when it meets **all** of:

1. **Culinary ingredient identity** — recognized as a staple grain, pseudocereal, processed grain form, or culinary starch worldwide or in major regional cuisines.
2. **Pairing relevance** — starch structure, texture, or grain character materially affects wine pairing.
3. **Taxonomic fit** — maps unambiguously to one Canonical Culinary Group (processing level and culinary identity).
4. **Immutable ID assignability** — permanent `food.grain.{group}.{slug}` without collision.
5. **Intrinsic metadata completeness** — all required fields populated from authoritative sources.
6. **Canonical Entity Rule (CANON-001)** — see [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture.
7. **Processing Ownership Rule (PROC-001)** — §8 governance decisions apply before entity assignment.

---

## 6. Exclusion Criteria

| Exclude | Rationale |
|---------|-----------|
| Breads, rolls, flatbreads | Prepared food — not ingredient ontology |
| Noodles and pasta | Prepared food |
| Breakfast cereals | Processed prepared food product |
| Pastries and baked goods | Prepared food |
| Beer, whiskey, sake | Beverage domain |
| Crop varieties and agronomic cultivars | Not culinary ingredient scope |
| Commercial brand flours | Aliases unless PROC-001 assigns distinct canonical identity |

| Route elsewhere | Owner |
|-----------------|-------|
| Potato (whole tuber) | FOOD-05 Vegetable Ontology |
| Sweet corn (fresh) | FOOD-05 Vegetable Ontology |
| Mustard seed | FOOD-07 Herb & Spice Ontology |
| Soybean | FOOD-11 Legume Ontology |
| Nuts & seeds (poster row) | FOOD-10 Nut & Seed Ontology |
| Sauces & condiments | FOOD-13 Sauce & Condiment Ontology |
| Vital wheat gluten / seitan | FOOD-01 Protein Foods (protein angle) |

---

## 7. Intrinsic Metadata Summary

See [`GRAIN_STARCH_GOVERNANCE.md`](GRAIN_STARCH_GOVERNANCE.md) §7 for frozen vocabularies.

| Field | FOOD-08B |
|-------|----------|
| `culinary_group` | Required — immutable group alignment |
| `usage_intensity` | Required — `primary` · `accent` · `luxury` (suite vocabulary unchanged) |
| `parent_group` / `parent_category` | Required — group slug + `grain-starch` category |
| `aliases`, `common_names` | Required arrays — may be `[]` |
| `flavor_profile` | Reserved — `[]` only in FOOD-08B |
| `texture_profile` | Reserved — `[]` only in FOOD-08B |
| `aroma_profile` | Reserved — `[]` only in FOOD-08B |
| `scientific_name` | Required — primary species or `Multiple species` |

### `usage_intensity` examples (intrinsic — never inferred)

| Entity | Group | `usage_intensity` |
|--------|-------|-------------------|
| Rice | Whole Grains | `primary` |
| Wheat Flour | Processed Grains | `primary` |
| Cornstarch | Starches | `accent` |
| Quinoa | Pseudocereals | `primary` |
| Tapioca Starch | Starches | `accent` |

---

## 8. Processing Ownership (PROC-001 freeze)

See [`GRAIN_STARCH_GOVERNANCE.md`](GRAIN_STARCH_GOVERNANCE.md) §9 and [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §PROC-001.

Summary for catalog population:

| Case | FOOD-08B assignment |
|------|---------------------|
| Wheat vs wheat flour | Separate entities — Whole Grains and Processed Grains |
| Rice vs rice flour | Separate entities |
| Corn vs cornmeal vs cornstarch | Separate entities across Whole Grains, Processed Grains, Starches |
| Potato vs potato starch | Potato → Vegetable; Potato Starch → Starches |
| Bread / cake / AP flour | Aliases on Wheat Flour (default) unless audit documents distinct identity |
| Rolled / quick / instant oats | Aliases on Oats (default) |
| Ground black pepper | Herb & Spice — alias on Black Pepper (not this domain) |

---

## 9. Cross-Domain Relationships (FOOD-08D/E)

Grain & Starch entities participate in cross-domain edges; they do not own foreign intrinsic data.

| Relationship | Typical targets | Layer |
|--------------|-----------------|-------|
| `commonly_served_with` | `food.protein.*`, `food.vegetable.*`, `food.cheese.*`, `food.herb.*` | Editorial |
| `similar_to` | `food.grain.*` | Editorial |
| `substitutes_for` | `food.grain.*` | Editorial |
| `pairs_with_style` | Wine style slugs | Pairing |
| `pairs_with_descriptor` | Descriptor slugs | Pairing |
| `pairs_with_technique` | Technique slugs | Pairing |

Example:

```text
food.grain.whole-grains.rice
  commonly_served_with → food.protein.poultry.chicken
  commonly_served_with → food.vegetable.alliums.garlic

food.grain.processed-grains.wheat-flour
  commonly_served_with → food.cheese.fresh.mozzarella

food.grain.starches.potato-starch
  commonly_served_with → food.protein.seafood.white-fish
```

---

## 10. Publication (FOOD-08F preview)

Publication consumes shared platform domain configuration — **no platform code changes**.

| Artifact prefix | Example (planning — finalized in FOOD-08F) |
|-----------------|---------------------------------------------|
| Public URL path | `/grains-starches/` or `/grain-starch/` (domain config in FOOD-08F) |
| Group hub | `/grain-starch-groups/whole-grains/` |
| Entity page | `/grains-starches/whole-grains/rice/` |

Exact URL scheme is finalized in FOOD-08F domain configuration — not in FOOD-08A.

---

## 11. Poster Alignment

Poster **Starch** rows map to FOOD-08 with PROC-001 and cross-domain ownership applied:

| Poster row | Primary group(s) | Notes |
|------------|------------------|-------|
| White Starches (flour, white rice, pasta, bread) | Whole Grains, Processed Grains, Starches | **Pasta and bread excluded** — prepared foods |
| Whole Wheat Grains (quinoa, farro, brown rice) | Whole Grains, Pseudocereals | |
| Sweet Starchy Vegetables (sweet potato, yucca, taro) | — | **Vegetable Ontology** (FOOD-05) — not grain domain |
| Potato | — | **Vegetable Ontology** (FOOD-05); **Potato Starch** → Starches |

Poster rows **Beans & Peas**, **Nuts & Seeds** route to FOOD-11 and FOOD-10 — not FOOD-08.

---

## 12. Approval

| Milestone | Status |
|-----------|--------|
| FOOD-08A taxonomy blueprint | **Frozen** |
| FOOD-08B catalog population | Pending approval |

**Next:** FOOD-08B — populate `grain_starches[]` with ~70–100 canonical entities per inclusion criteria and §8 Processing Ownership Rule (PROC-001).
