# Food Protein Catalog v1.0

**Phase:** ONTOLOGY-02A — Catalog Freeze (02A.B)  
**Freeze Date:** July 17, 2026  
**SSOT:** [`data/protein-food-catalog.json`](../data/protein-food-catalog.json)  
**Catalog JSON version:** `2.0.0`  
**Audit report:** [`reports/protein-food-catalog-audit.json`](../reports/protein-food-catalog-audit.json)  
**Architecture:** [`ONTOLOGY-02A_ARCHITECTURE.md`](ONTOLOGY-02A_ARCHITECTURE.md)

---

## Executive Summary

PairingMethod declares **Food Protein Catalog v1.0** — the first stable, catalog-only release of the Food Ontology protein domain.

This milestone completes catalog acquisition for ONTOLOGY-02A. **207 canonical `protein_food` entities** are organized across **3 categories** and **16 groups**, with frozen identity schema, frozen controlled vocabularies, and **100% required metadata coverage**.

No graph edges, pages, generators, or search indexes exist yet. The catalog is the sole authoritative source until bootstrap begins.

**Audit status (02A.A):** PASS — 17 required checks passed, 0 failed, 1 advisory warning (mammal `species` backfill deferred).

---

## 1. Version

| Field | Value |
|-------|-------|
| Catalog name | Food Protein Catalog |
| Version | **v1.0** |
| JSON `catalog_version` | `2.0.0` |
| `food_ontology_version` | `1.0` |
| `wine_ontology_version` (reference) | `2.0` |
| `ontology_foundation_version` | `1.0.0` |
| Phase | ONTOLOGY-02A (catalog complete) |

---

## 2. Statistics

| Metric | Value |
|--------|------:|
| Categories | 3 |
| Groups | 16 |
| Protein foods (`protein_food`) | 207 |
| Unique scientific names | 86 |
| Controlled vocabularies | 8 |
| Intrinsic metadata fields (protein_food) | 14+ |
| Relationship placeholder arrays | 13 |
| Vocabulary violations | 0 |
| Alias conflicts | 0 |
| Metadata completeness | 100% |

### Categories

| Slug | Name | Groups |
|------|------|-------|
| `animal-protein` | Animal Protein Foods | 10 |
| `plant-protein` | Plant Protein Foods | 4 |
| `fungi-protein` | Fungi Protein Foods | 2 |

### Groups (16)

| Category | Group slug | Entities |
|----------|------------|----------:|
| Animal | `beef` | 23 |
| Animal | `pork` | 17 |
| Animal | `lamb` | 12 |
| Animal | `veal` | 8 |
| Animal | `poultry` | 22 |
| Animal | `wild-game` | 21 |
| Animal | `fin-fish` | 22 |
| Animal | `crustaceans` | 7 |
| Animal | `mollusks` | 8 |
| Animal | `cephalopods` | 8 |
| Plant | `legumes` | 12 |
| Plant | `soy-foods` | 10 |
| Plant | `grains-wheat-protein` | 8 |
| Plant | `nuts-seeds` | 12 |
| Fungi | `mushrooms` | 12 |
| Fungi | `mycoprotein` | 5 |

---

## 3. Frozen Schema

Every `protein_food` entity in v1.0 conforms to this contract. Hub entities (`protein_category`, `protein_group`) use a subset plus hub fields (`introduction`, `child_slugs`, etc.).

### Identity

| Field | Requirement | Mutable? |
|-------|-------------|----------|
| `id` | Stable ontology ID: `food.protein.{group}.{slug}` | ❌ Never |
| `slug` | URL-safe identifier, unique within catalog | ✅ SEO only |
| `name` | Display name | ✅ Yes |
| `entity_type` | `protein_food` | Fixed |
| `domain` | `culinary` | Fixed |

### Biological

| Field | Requirement |
|-------|-------------|
| `species` | Required on multi-species and plant/fungi groups; deferred on mammal groups (beef, pork, lamb, veal) in v1.0 |
| `scientific_name` | Binomial or accepted taxonomic name; required on every `protein_food` |

### Intrinsic metadata

| Field | Requirement |
|-------|-------------|
| `food_category` | `animal` \| `plant` \| `fungi` |
| `cut_type` | Approved vocabulary (see §4) |
| `anatomical_cut` | Approved vocabulary; `""` when not applicable |
| `plant_part` | Required on plant/fungi groups; `""` on fungi mushrooms |
| `edible_structure` | Required on plant/fungi groups |
| `processing_state` | Approved vocabulary |
| `fat_content` | `lean` \| `moderate` \| `rich` |
| `bone_state` | `bone_in` \| `boneless` \| `either` \| `not_applicable` |
| `primary_cooking_methods` | String array — intrinsic defaults, not ontology links |
| `recommended_doneness` | String array — intrinsic guidance only |

### Editorial (catalog phase)

| Field | Requirement |
|-------|-------------|
| `aliases` | Search aliases; globally unique (case-insensitive) |
| `external_ids` | Object; `{}` if empty |
| `summary` | Entity summary |
| `beginner_notes` | Plain-language explainer |
| `faq` | ≥ 2 Q&A pairs |
| `seo_title` | Unique |
| `seo_description` | 150–160 characters |

### Relationship placeholders (reserved — empty in v1.0)

All arrays must be present. All must be `[]` until relationship mapping (02B+).

| Array | Future mapping |
|-------|----------------|
| `texture` | Descriptor slugs |
| `typical_descriptors` | Descriptor slugs |
| `wine_pairings` | Editorial wine style tiers |
| `avoid_wine_pairings` | Editorial avoid list |
| `related_styles` | `pairs_best_with` / `pairs_with` |
| `related_descriptors` | `typically_exhibits` |
| `related_regions` | Regional context |
| `related_serving` | Wine serving |
| `related_techniques` | Cooking techniques (02B) |
| `similar_foods` | `similar_to` |
| `substitutes` | `substitute_for` |
| `common_preparations` | Cross-domain prep (02G) |
| `common_cuisines` | Cuisine context (02G) |

---

## 4. Controlled Vocabularies

Canonical contract for catalog audit (02A.A) and all future catalog versions. **New values require architecture approval.**

### `food_category`

`animal` · `plant` · `fungi`

### `cut_type`

| Value | Domain |
|-------|--------|
| `steak` | Terrestrial, game |
| `roast` | Terrestrial, game, poultry |
| `rib` | Terrestrial |
| `shank` | Terrestrial |
| `ground` | All muscle groups |
| `trim` | Cured, preserved |
| `organ` | Offal (deferred) |
| `whole` | Seafood, plant, fungi |
| `fillet` | Seafood |
| `portion` | Seafood, plant, fungi, mycoprotein |
| `tail` | Seafood |
| `claw` | Seafood |
| `tentacle` | Seafood, cephalopods |

### `anatomical_cut`

`rib` · `loin` · `sirloin` · `chuck` · `round` · `brisket` · `flank` · `plate` · `shank` · `neck` · `belly` · `shoulder` · `leg` · `breast` · `thigh` · `wing` · `jowl` · `tail` · `claw` · `tentacle` · `fillet` · `""` (empty string)

### `bone_state`

`bone_in` · `boneless` · `either` · `not_applicable`

### `fat_content`

`lean` · `moderate` · `rich`

### `processing_state`

`raw` · `fresh` · `cured` · `smoked` · `dried` · `fermented` · `cooked` · `prepared` · `ground` · `processed`

### `plant_part`

`seed` · `bean` · `legume` · `grain` · `kernel` · `nut` · `sprout` · `processed` · `""` (empty string)

### `edible_structure`

`fruit` · `seed` · `leaf` · `stem` · `root` · `tuber` · `bulb` · `flower` · `fungal_body` · `processed` · `""` (empty string)

---

## 5. Change Policy

### Allowed in future catalog versions

- **Add** new `protein_food` entities with new ontology IDs
- **Add** new groups (with architecture approval)
- **Update** display names, slugs, aliases, editorial fields
- **Populate** reserved relationship arrays (during 02B+ enrichment)
- **Extend** controlled vocabularies (with documented architecture amendment)

### Immutable

- **Ontology IDs** — once assigned, never change. Graph edges, evidence, and external references depend on ID stability.
- **Certification baseline counts** — v1.0 baseline recorded in §6 for regression comparison.

### Slug migration

Slug changes are permitted for SEO but require:

1. Documented migration note in [`ONTOLOGY_CHANGELOG.md`](ONTOLOGY_CHANGELOG.md)
2. Redirect map in generator layer (when pages exist)
3. Ontology ID unchanged

### Controlled vocabulary additions

New `cut_type`, `anatomical_cut`, `processing_state`, `plant_part`, or `edible_structure` values require:

1. Amendment to this document and `ONTOLOGY-02A_ARCHITECTURE.md`
2. Update to `scripts/catalog-audit-02aa.mjs` vocabulary sets
3. Re-run catalog audit before merge

### Bootstrap contract

The bootstrap phase **must not modify** `protein-food-catalog.json`. The catalog is **immutable input**. Bootstrap parses, normalizes, indexes, and emits derived artifacts only. All generated outputs must be reproducible from the catalog SSOT.

---

## 6. Certification Baseline

Permanent reference for Food Protein Catalog v1.0 audits and regression checks.

| Baseline metric | v1.0 value |
|-----------------|-----------|
| Categories | 3 |
| Groups | 16 |
| Protein foods | 207 |
| Catalog audit result | PASS |
| Required checks passed | 17 / 17 |
| Advisory warnings | 1 (mammal `species` backfill deferred) |
| Vocabulary violations | 0 |
| Alias conflicts | 0 |
| Metadata completeness | 100% |

### Advisory item (non-blocking)

**ADV-001:** 60 entities in mammal groups (`beef`, `pork`, `lamb`, `veal`) do not yet have a `species` field. This was intentionally deferred during catalog acquisition. Backfill may occur in v1.1 without changing ontology IDs.

---

## Lifecycle Position

```text
protein-food-catalog.json   ✅ v1.0 complete (207 entities)
        ↓
catalog audit (02A.A)       ✅ PASS
        ↓
catalog freeze (02A.B)      ✅ This document
        ↓
bootstrap                   ← NOT STARTED
        ↓
validator
        ↓
relationship mapper
        ↓
generator → pages → search → knowledge density → certification
```

---

## Related Documents

| Document | Role |
|----------|------|
| [`ONTOLOGY-02A_ARCHITECTURE.md`](ONTOLOGY-02A_ARCHITECTURE.md) | Entity specification, lifecycle, vocabularies |
| [`PROTEIN_TAXONOMY_BLUEPRINT.md`](PROTEIN_TAXONOMY_BLUEPRINT.md) | Approved taxonomy blueprint |
| [`WINE_ONTOLOGY_V2.md`](WINE_ONTOLOGY_V2.md) | Certified wine graph (upstream reference) |
| [`ONTOLOGY_CHANGELOG.md`](ONTOLOGY_CHANGELOG.md) | Program history |

---

*Food Protein Catalog v1.0 is frozen. Bootstrap and graph construction may begin only after explicit approval to proceed with implementation.*
