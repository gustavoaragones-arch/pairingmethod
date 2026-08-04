# FOOD-13A — Sauce & Condiment Ontology Taxonomy Blueprint

**Status:** **Approved for governance freeze** (August 3, 2026)  
**Parent:** [`SAUCE_CONDIMENT_GOVERNANCE.md`](SAUCE_CONDIMENT_GOVERNANCE.md)  
**Catalog SSOT:** [`data/sauce-condiment-catalog.json`](../data/sauce-condiment-catalog.json) (empty `sauce_condiments` — populate in FOOD-13B)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)

This document defines the **Sauce & Condiment Ontology taxonomy** independently of catalog population. Approve this blueprint before adding entities to `sauce-condiment-catalog.json`.

---

## 1. Domain & Namespace

| Field | Value |
|-------|-------|
| Domain name | **Sauce & Condiment Ontology** |
| Domain framing | **Culinary sauces, condiments, spreads, emulsions, and fermented flavor bases** — not recipes, dishes, marinades as recipes, or brands |
| Domain key | `sauce-condiment` |
| Namespace | `food.sauce-condiment.*` |
| Platform version | `1.0.0` (frozen) |
| Target suite version | `2.0.0` (upon FOOD-13F) |
| Catalog version | `1.0.0` |

### ID examples

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.sauce-condiment` | `food.sauce-condiment` |
| Group | `food.sauce-condiment.{group}` | `food.sauce-condiment.table-sauces` |
| Sauce & Condiment | `food.sauce-condiment.{group}.{slug}` | `food.sauce-condiment.table-sauces.tomato-ketchup` |

Shorthand IDs such as `food.sauce-condiment.tomato-ketchup` are **not valid**.

---

## 2. Canonical Culinary Groups

Groups are **culinary function**, not geography or primary ingredient. See [`SAUCE_CONDIMENT_GOVERNANCE.md`](SAUCE_CONDIMENT_GOVERNANCE.md) §3.

```text
Sauces & Condiments (sauce-condiment)
├── Mother Sauces (mother-sauces)
├── Table Sauces (table-sauces)
├── Condiments (condiments)
├── Fermented Sauces & Pastes (fermented-sauces-pastes)
├── Oil-Based Sauces & Dressings (oil-based-sauces-dressings)
└── Savory Spreads & Pastes (savory-spreads-pastes)
```

---

## 3. Hierarchy

Exactly three levels in FOOD-13:

```text
sauce_condiment_category
    ↓
sauce_condiment_group              ← Canonical Culinary Group
    ↓
sauce_condiment                    ← leaf entity
```

Regional variants, heat levels, and brand trade names are `aliases` or `common_names` — not nested sub-groups unless SAUCE-001 documents distinct culinary identity. Similarity uses editorial relationships, not hierarchy.

---

## 4. Canonical Culinary Groups (6) — immutable

These names, slugs, and group IDs are **frozen controlled vocabularies**. Do not rename. Expand inside groups only.

| Slug | Name | Group ID | `culinary_group` | Planning target |
|------|------|----------|------------------|----------------:|
| `mother-sauces` | Mother Sauces | `food.sauce-condiment.mother-sauces` | `mother_sauces` | 8–10 |
| `table-sauces` | Table Sauces | `food.sauce-condiment.table-sauces` | `table_sauces` | 20–25 |
| `condiments` | Condiments | `food.sauce-condiment.condiments` | `condiments` | 18–22 |
| `fermented-sauces-pastes` | Fermented Sauces & Pastes | `food.sauce-condiment.fermented-sauces-pastes` | `fermented_sauces_pastes` | 14–18 |
| `oil-based-sauces-dressings` | Oil-Based Sauces & Dressings | `food.sauce-condiment.oil-based-sauces-dressings` | `oil_based_sauces_dressings` | 10–15 |
| `savory-spreads-pastes` | Savory Spreads & Pastes | `food.sauce-condiment.savory-spreads-pastes` | `savory_spreads_pastes` | 10–15 |

**Grand total target (FOOD-13B):** **80–110** canonical culinary sauce and condiment ingredients (~**90–100** expected with completeness bias)

Counts are planning targets for authoritative global coverage — not hard caps. **Entity quality over count.**

### Representative entities (planning — not exhaustive)

| Group | Examples |
|-------|----------|
| Mother Sauces | béchamel, velouté, espagnole, tomato mother sauce, hollandaise, mayonnaise |
| Table Sauces | tomato ketchup, barbecue sauce, Worcestershire sauce, pan gravy, cranberry sauce, caramel sauce, chocolate syrup |
| Condiments | Dijon mustard, whole-grain mustard, relish, prepared horseradish, vanilla extract, almond extract |
| Fermented Sauces & Pastes | soy sauce, fish sauce, gochujang, doubanjiang, hoisin sauce — miso/natto owned by Legume (reference only) |
| Oil-Based Sauces & Dressings | vinaigrette, pesto, aioli, ranch dressing, Caesar dressing, orange blossom water, rose water |
| Savory Spreads & Pastes | tapenade, anchovy paste, olive tapenade variants, compound savory spreads |

---

## 5. Inclusion Criteria

A sauce or condiment qualifies when it meets **all** of:

1. **Established culinary identity** — recognized globally or in major regional cuisines as a distinct sauce or condiment (SAUCE-001).
2. **Pairing relevance** — acidity, fat, fermentation, emulsification, umami, or richness materially affects wine pairing (SAUCE-PAIR-001).
3. **Taxonomic fit** — maps unambiguously to one Canonical Culinary Group.
4. **Immutable ID assignability** — permanent `food.sauce-condiment.{group}.{slug}` without collision.
5. **Intrinsic metadata completeness** — all required fields populated from authoritative sources.
6. **Canonical Entity Rule (CANON-001)** — see [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture.
7. **Global Culinary Recognition Rule (CANON-002)** — globally recognizable before regional variant splits.
8. **Composite Identity Rule (SAUCE-001)** — §7 governance identity test applies before entity assignment.
9. **Composition Ownership Rule (SAUCE-002)** — component ingredients referenced by canonical ID from owning domains.

---

## 6. Exclusion Criteria

| Exclude | Rationale |
|---------|-----------|
| Recipes and composed meals | Not ingredient ontology |
| Marinades as recipes | Recipe scope — out of domain v1 |
| Prepared dishes | Not ingredient ontology |
| Beverage concentrates | Out of domain v1 |
| Commercial brands | Not ingredient ontology |
| Ad-hoc composed sauces | Fail SAUCE-001 — garlic butter sauce, homemade burger sauce, spicy mayo with sriracha |
| Spice blends | Owned by Herb & Spice (FOOD-07) |

| Route elsewhere | Owner |
|-----------------|-------|
| Tomato (whole) | FOOD-05 Vegetable Ontology |
| Garlic, onion (whole) | FOOD-05 Vegetable Ontology |
| Basil, mustard seed (whole) | FOOD-07 Herb & Spice Ontology |
| Sugar, honey | FOOD-12 Sweet Flavor Ontology |
| Miso, natto, hummus | FOOD-11 Legume Ontology |
| Tahini, peanut butter | FOOD-10 Nut & Seed Ontology |
| Cane sugar, maple syrup | FOOD-12 Sweet Flavor Ontology |
| Olive oil | Deferred — future oil/fat domain or FOOD-13B decision |
| Vinegar (whole ingredient) | Deferred — FOOD-13B may assign if globally recognized condiment ingredient |

---

## 7. Intrinsic Metadata Summary

See [`SAUCE_CONDIMENT_GOVERNANCE.md`](SAUCE_CONDIMENT_GOVERNANCE.md) §11–13 for frozen vocabularies.

| Field | FOOD-13B |
|-------|----------|
| `culinary_group` | Required — immutable group alignment |
| `usage_intensity` | Required — `primary` · `accent` · `luxury` |
| `flavor_profile` | Required array — **empty** through FOOD-13B |
| `texture_profile` | Required array — **empty** through FOOD-13B |
| `aroma_profile` | Required array — **empty** through FOOD-13B |
| `scientific_name` | Required — species, product class, or `Multiple sources` |

---

## 8. Governance Rules Summary

| Rule | ID | Application |
|------|-----|-------------|
| Composite Identity Rule | **SAUCE-001** | Established culinary identity required — ad-hoc sauces excluded |
| Composition Ownership Rule | **SAUCE-002** | Reference owning domains by canonical ID — never duplicate intrinsic metadata |
| Culinary Function Pairing Rule | **SAUCE-PAIR-001** | Wine pairing by acidity, fat, fermentation, emulsification, umami, richness — FOOD-13E |
| Processing Ownership | PROC-001 | Suite baseline — SAUCE-001 extends for composite preparations |
| Canonical Entity | CANON-001 | One entity per established culinary identity |
| Global Recognition | CANON-002 | Global before regional variant splits |

Full definitions: [`SAUCE_CONDIMENT_GOVERNANCE.md`](SAUCE_CONDIMENT_GOVERNANCE.md) §6–10.

---

## 9. Publication Paths (FOOD-13F — planned)

| Page type | URL prefix (planned) |
|-----------|------------------------|
| Category hub | `/sauce-condiment-categories/sauce-condiment/` |
| Group hubs | `/sauce-condiment-groups/{slug}/` |
| Ingredient pages | `/sauce-condiments/{slug}/` |

Publication reuses the shared platform — no architectural changes at FOOD-13F.

---

## 10. Expected Suite Impact (post-FOOD-13F)

| Metric | Approximate |
|--------|------------:|
| Published domains | 11 |
| Canonical entities | ~1,155–1,185 |
| Runtime relationships | ~107,000+ |
| Editorial relationships | ~2,270+ |
| Wine relationships | ~1,750+ |
| Publication pages | ~1,230–1,260 |

Completion targets **Food Ontology Suite v2.0.0** — nearly complete poster ingredient coverage with FOOD-14 (Protein Refinement) as the final ontology-focused phase.

---

## 11. Approval

| Milestone | Status |
|-----------|--------|
| Taxonomy blueprint approved | **Yes** — August 3, 2026 |
| Governance frozen | **Yes** — FOOD-13A |
| Catalog population authorized | **Pending** — awaits FOOD-13B approval |
