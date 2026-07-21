# FOOD-10A — Nut & Seed Ontology Governance

**Phase:** FOOD-10A — Nut & Seed Ontology Governance  
**Freeze Date:** July 20, 2026  
**Status:** **Nut & Seed Governance Frozen v1.0.0**  
**SSOT:** [`data/nut-seed-catalog.json`](../data/nut-seed-catalog.json)  
**Taxonomy:** [`NUT_SEED_TAXONOMY_BLUEPRINT.md`](NUT_SEED_TAXONOMY_BLUEPRINT.md)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)  
**Platform:** Food Ontology Platform v1.0.0 (frozen — domain contract only)  
**Suite baseline:** Food Ontology Suite v1.7.0 · tag `food-ontology-suite-v1.7.0`

---

## Executive Summary

PairingMethod declares **Nut & Seed Ontology Governance v1.0.0** — the authoritative governance layer for the **Nut & Seed Ontology** within Food Ontology Suite expansion toward v1.7.0.

This domain is **not** botanical taxonomy, cultivar catalogs, commercial branding, snack products, confectionery, or prepared foods. It is the authoritative ontology for **culinary nuts, edible seeds, and globally significant nut- and seed-derived ingredients** used in cooking worldwide. The project models **ingredients**, not trail mix, breakfast products, beverages, or oils.

FOOD-10 is the **first ontology where culinary classification intentionally diverges from botanical classification for a globally significant ingredient** (peanut). By introducing **NUT-001** alongside **NUT-002**, the suite gains a clear framework for distinguishing **culinary grouping** from **processing-based canonical identity**, extending BOTAN-001, PROC-001, and FRUIT-001 without platform modification.

This milestone establishes the canonical catalog shell, **Canonical Culinary Groups**, immutable identity rules, the intrinsic attribute `usage_intensity`, controlled vocabularies, cross-domain reference policy, and the domain rules **NUT-001** and **NUT-002**.

**No nut or seed entities exist yet.** No runtime artifacts, publication artifacts, or platform changes are created in this phase.

Nut & Seed will be the **eighth consumer** of the multi-domain publication platform. Publication will reuse the shared platform via domain configuration in FOOD-10F — no platform modifications.

**Governance status:** Frozen. Entity population begins only after explicit approval to proceed with FOOD-10B.

---

## Domain Independence Principle

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — Domain Independence Principle.

Every new ontology domain is evaluated against four questions **before implementation**. **No modifications in FOOD-10A.**

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
| Domain | Nut & Seed (culinary nuts, edible seeds, and nut/seed-derived ingredients) |
| Governance version | **v1.0.0** |
| JSON `catalog_version` | `1.0.0` |
| `food_ontology_version` (target suite) | `1.7.0` (upon FOOD-10F publication) |
| `platform_version` | `1.0.0` (frozen) |
| `wine_ontology_version` (reference) | `2.0` |
| `ontology_foundation_version` | `1.0.0` |
| Phase | FOOD-10A (governance only) |

---

## 2. Architectural Scope

### Allowed artifacts (FOOD-10A only)

| Artifact | Purpose |
|----------|---------|
| `data/nut-seed-catalog.json` | Catalog SSOT — schema, metadata, hub entities, empty `nut_seeds` |
| `docs/NUT_SEED_TAXONOMY_BLUEPRINT.md` | Canonical taxonomy definition |
| `docs/NUT_SEED_GOVERNANCE.md` | This document |

### Explicitly excluded from FOOD-10A

- Runtime artifacts (bootstrap, indexes, graph edges)
- Publication artifacts (HTML, sitemaps, search indexes)
- Generators, validators, certification scripts
- Deployment logic or **any** platform code changes
- Editorial relationships (FOOD-10D)
- Wine pairings (FOOD-10E)
- Catalog population (FOOD-10B)

### Domain contract compliance

| Contract element | Nut & Seed binding |
|------------------|-------------------|
| Catalog SSOT | `data/nut-seed-catalog.json` |
| Three-level hierarchy | `nut_seed_category` → `nut_seed_group` → `nut_seed` |
| Immutable ontology IDs | `food.nut-seed.{group}.{slug}` |
| Controlled vocabularies | Frozen in catalog `schema` |
| Relationship placeholders | Empty arrays until FOOD-10D/E |
| Publication | Shared platform + domain config in FOOD-10F |

---

## 3. Canonical Culinary Groups

Nut & Seed taxonomy is **culinary**, not botanical. Groups answer *"What is this ingredient's culinary identity and form?"* — not *"What is its plant family?"*

### Frozen groups (FOOD-10 v1) — **immutable**

These six **Canonical Culinary Groups** are a **frozen controlled vocabulary**. Display names, slugs, and group IDs must **not** be renamed, merged, split, or supplemented with peer groups in v1 unless a future governance amendment documents a compelling architectural reason and accepts migration cost.

| Display name (immutable) | Slug (immutable) | Group ID (immutable) | `culinary_group` |
|--------------------------|------------------|----------------------|------------------|
| **Tree Nuts** | `tree-nuts` | `food.nut-seed.tree-nuts` | `tree_nuts` |
| **Peanuts** | `peanuts` | `food.nut-seed.peanuts` | `peanuts` |
| **Edible Seeds** | `edible-seeds` | `food.nut-seed.edible-seeds` | `edible_seeds` |
| **Seed Spices** | `seed-spices` | `food.nut-seed.seed-spices` | `seed_spices` |
| **Nut Products** | `nut-products` | `food.nut-seed.nut-products` | `nut_products` |
| **Seed Products** | `seed-products` | `food.nut-seed.seed-products` | `seed_products` |

**Expansion policy:** Future growth occurs **inside** these groups (new leaf entities), not by adding new peer groups.

---

## 4. Namespace & Identity Model

### Namespace

Reserve: **`food.nut-seed.*`**

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.nut-seed` | `food.nut-seed` |
| Group | `food.nut-seed.{group}` | `food.nut-seed.tree-nuts` |
| Nut / Seed | `food.nut-seed.{group}.{slug}` | `food.nut-seed.tree-nuts.almond` |

Shorthand IDs such as `food.nut-seed.almond` (without group segment) are **not valid**.

### Identity contract (every `nut_seed` entity)

```json
{
  "id": "",
  "slug": "",
  "display_name": "",
  "scientific_name": "",
  "parent_group": "",
  "parent_category": "nut-seed",
  "culinary_group": "",
  "usage_intensity": "",
  "aliases": [],
  "common_names": [],
  "external_ids": {},
  "catalog_version": "1.0.0",
  "food_ontology_version": "1.7.0"
}
```

---

## 5. Domain Boundaries

### Included

| Include | Examples |
|---------|----------|
| Whole culinary nuts | almond, walnut, pecan, hazelnut, pistachio, cashew, macadamia |
| Peanuts (culinary group) | peanut — despite botanical legume status |
| Edible seeds | sesame, sunflower seed, pumpkin seed, flaxseed, chia seed, poppy seed |
| Culinary nut flours | almond flour, hazelnut flour |
| Seed flours | sunflower seed flour (when globally significant) |
| Nut butters | almond butter, peanut butter, tahini (sesame paste) |
| Seed butters | tahini; other seed butters when governed as distinct |
| Nut meals | almond meal, ground walnuts (when distinct from flour identity) |

### Excluded

| Exclude | Rationale |
|---------|-----------|
| Botanical taxonomy and cultivars | Not culinary ingredient scope |
| Commercial brands and snack products | Not ingredient ontology |
| Candy and confectionery | Prepared food / Sweet Flavor (FOOD-12) |
| Trail mix and breakfast products | Prepared food — not canonical ingredient |
| Beverages | Beverage domain |
| Plant milks | Reserved — not populated unless governance later promotes them |
| Nut and seed **oils** | Not savory ingredient scope in v1 |
| Prepared foods | Ontology models ingredients, not recipes |

---

## 6. Suite Governance Rules (continued)

FOOD-10A continues all suite rules without redefinition. Authoritative definitions live in [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture.

| Rule | ID | FOOD-10A application |
|------|-----|----------------------|
| Canonical Entity Rule | CANON-001 | One canonical culinary nut or seed per ingredient identity |
| Global Culinary Recognition Rule | CANON-002 | Globally recognizable nuts and seeds before regional trade names |
| Botanical Ownership Rule | BOTAN-001 | Culinary identity over botanical classification — complements NUT-001 |
| Processing Ownership Rule | PROC-001 | Processing that changes culinary identity → separate entity — complements NUT-002 |
| Culinary Form Ownership Rule | FRUIT-001 | Referenced for cross-domain fruit-derived ingredients; does not govern Nut & Seed ownership |
| Functional Pairing Rule | STARCH-001 | Suite wine rule — referenced for completeness; FOOD-10E may introduce domain pairing rule |

---

## 7. NUT-001 — Culinary Classification Rule

**Introduced:** FOOD-10A · **Applies** to Nut & Seed catalog grouping only; **does not override canonical ownership** or cross-domain ownership decisions in §9.

> Canonical **group assignment** follows **established culinary identity**, not botanical taxonomy alone.

### Group assignment examples (frozen)

| Ingredient | Botanical note | Culinary group | Rationale |
|------------|----------------|----------------|-----------|
| Peanut | Legume | **Peanuts** | Globally classified as a nut in culinary practice |
| Almond | Tree nut | **Tree Nuts** | Standard culinary tree nut |
| Sesame | Seed | **Edible Seeds** | Seed used as garnish, paste, and oil source — flour/butter in Seed Products per NUT-002 |
| Sunflower Seed | Seed | **Edible Seeds** | Whole seed culinary identity |
| Walnut | Tree nut | **Tree Nuts** | Standard culinary tree nut |
| Poppy Seed | Seed | **Seed Spices** or **Edible Seeds** | Assign per FOOD-10B audit — mustard seed **not** eligible (Herb & Spice) |

NUT-001 governs **which immutable group** receives an entity. It does **not** permit duplicating entities owned by another domain.

---

## 8. NUT-002 — Processed Product Rule

**Introduced:** FOOD-10A · **Applies** to Nut & Seed catalog, editorial, and wine layers; extends PROC-001 for nut- and seed-derived forms.

> A processed nut or seed becomes a **separate canonical ingredient** only when it has an **independent culinary identity**. The determining factor is **independent culinary function**, not preparation method alone.

### Separate canonical entities (default freeze)

| Whole form | Processed form | Group assignment | Rationale |
|------------|----------------|------------------|-----------|
| Almond | Almond Flour | Nut Products | Distinct baking and coating function |
| Almond | Almond Butter | Nut Products | Distinct spread and sauce function |
| Peanut | Peanut Butter | Nut Products | Independent culinary identity |
| Sesame | Tahini | Seed Products | Distinct paste identity in Middle Eastern and global cuisines |

### Aliases or preparation states only (default freeze)

| Entity | Treatment |
|--------|-------------|
| Chopped Almond | Alias on Almond |
| Sliced Almond | Alias on Almond |
| Toasted Sesame Seeds | Alias on Sesame |
| Crushed Walnuts | Alias on Walnut |

---

## 9. Cross-Domain Ownership

Canonical ownership must remain **unique** across the suite. Nut & Seed does not duplicate intrinsic data from other domains.

| Ingredient / concept | Owner domain | Notes |
|----------------------|--------------|-------|
| Coconut (fresh) | Fruit (FOOD-09) | `food.fruit.tropical-fruits.coconut` |
| Desiccated Coconut · Coconut Milk | Fruit (FOOD-09) | FRUIT-001 processed forms |
| Peanut | **Nut & Seed (FOOD-10)** | Culinary Peanuts group — not Legume (FOOD-11) |
| Soybean | Legume (FOOD-11) | Reserved — not populated in Nut & Seed |
| Mustard Seed | Herb & Spice (FOOD-07) | Remains in Herb & Spice — not Seed Spices here |
| Pumpkin Seed | **Nut & Seed (FOOD-10)** | Edible Seeds |
| Sunflower Seed | **Nut & Seed (FOOD-10)** | Edible Seeds |
| Flaxseed | **Nut & Seed (FOOD-10)** | Edible Seeds |
| Chia Seed | **Nut & Seed (FOOD-10)** | Edible Seeds |
| Wheat · Rice flours | Grain & Starch (FOOD-08) | Not nut/seed flours |
| Honey · Chocolate | Sweet Flavor (FOOD-12) | Reserved |

Cross-domain references use **canonical ontology IDs only** — never duplicated intrinsic fields.

---

## 10. Required Intrinsic Fields

Every leaf entity requires these fields at FOOD-10B population (see catalog `schema` for full contract):

| Field | Rule |
|-------|------|
| `id` | Immutable canonical ID — `food.nut-seed.{group}.{slug}` |
| `slug` | URL-safe identifier — mutable for SEO; ID unchanged |
| `display_name` | Human-readable name — mutable |
| `scientific_name` | Required — primary species or `Multiple species` for blends |
| `parent_group` | Required — group slug |
| `parent_category` | Required — always `nut-seed` |
| `culinary_group` | Required — aligns to immutable group vocabulary |
| `usage_intensity` | Required — `primary` · `accent` · `luxury` |
| `aliases` | Required array — may be empty |
| `common_names` | Required array — may be empty |
| `external_ids` | Required object — may be `{}` |

---

## 11. usage_intensity

Reuse the suite standard **unchanged**:

| Value | Meaning |
|-------|---------|
| `primary` | Staple prominence — defines dish character (e.g., peanut in satay, almond flour in macarons) |
| `accent` | Supporting role — garnish, crust, or background nut/seed note |
| `luxury` | Premium or specialty prominence — macadamia, pine nut, specialty seed oils in finishing contexts |

---

## 12. Reserved Attributes

The following fields are **required on every leaf entity** but remain **empty arrays through FOOD-10B**:

| Field | Populate from |
|-------|---------------|
| `flavor_profile` | FOOD-10C runtime curation standards (post-FOOD-10B) |
| `texture_profile` | FOOD-10C runtime curation standards (post-FOOD-10B) |
| `aroma_profile` | FOOD-10C runtime curation standards (post-FOOD-10B) |

Controlled vocabularies for these fields are frozen in FOOD-10A catalog `schema` — do not populate values until post-FOOD-10B curation standards are approved.

---

## 13. FOOD-10B Target

**Target:** approximately **80–110** canonical ingredients.

Coverage prioritizes **globally significant culinary nuts and seeds** before regional or specialty products. Entity quality over count.

See [`NUT_SEED_TAXONOMY_BLUEPRINT.md`](NUT_SEED_TAXONOMY_BLUEPRINT.md) for per-group planning targets.

---

## 14. Lifecycle & Next Phases

| Phase | Scope |
|-------|-------|
| **FOOD-10A** (this document) | Governance freeze — no entities |
| FOOD-10B | Catalog population + audit |
| FOOD-10C | Runtime compile |
| FOOD-10D | Editorial relationships |
| FOOD-10E | Wine pairings |
| FOOD-10F | Publication via shared platform |

**Next work:** FOOD-10B — Populate Nut & Seed Ontology catalog (pending explicit approval).
