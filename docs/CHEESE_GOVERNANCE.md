# FOOD-04A — Cheese Governance

**Phase:** FOOD-04A — Cheese Governance  
**Freeze Date:** July 17, 2026  
**Status:** **Cheese Governance Frozen v1.0.0**  
**SSOT:** [`data/cheese-catalog.json`](../data/cheese-catalog.json)  
**Taxonomy:** [`CHEESE_TAXONOMY_BLUEPRINT.md`](CHEESE_TAXONOMY_BLUEPRINT.md)  
**Platform:** Protein Food Ontology Platform v1.0.0 (frozen — domain contract only)

---

## Executive Summary

PairingMethod declares **Cheese Governance v1.0.0** — the authoritative governance layer for the Cheese Ontology within Food Ontology Suite v1.1.0.

**Suite invariants:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture (Domain Independence, CANON-001, lifecycle standard).

**Lifecycle:** FOOD-04A (governance) → FOOD-04B (catalog) → FOOD-04C (runtime) → FOOD-04D (editorial) → FOOD-04E (wine) → FOOD-04F (publication) — **complete** at suite v1.1.0.

This milestone established the canonical catalog shell, immutable identity rules, controlled vocabularies, external identifier namespaces, and audit requirements. Cheese is the **first consumer** of the generalized multi-domain publication platform (FOOD-04F).

**Governance status:** Frozen at FOOD-04A. Domain complete through FOOD-04F publication.

---

## 1. Version

| Field | Value |
|-------|-------|
| Domain | Cheese |
| Governance version | **v1.0.0** |
| JSON `catalog_version` | `1.0.0` |
| `food_ontology_version` | `1.1.0` |
| `platform_version` | `1.0.0` (frozen) |
| `wine_ontology_version` (reference) | `2.0` |
| `ontology_foundation_version` | `1.0.0` |
| Phase | FOOD-04A (governance only) |

### Version streams

| Stream | Meaning |
|--------|---------|
| Platform `1.0.0` | Publication infrastructure — frozen; Cheese must not modify it |
| `cheese-catalog` `1.0.0` | Cheese domain data contract |
| `food_ontology_version` `1.1.0` | Food Ontology suite expansion (Cheese module) |

---

## 2. Architectural Scope

### Allowed artifacts (FOOD-04A only)

| Artifact | Purpose |
|----------|---------|
| `data/cheese-catalog.json` | Catalog SSOT — schema, metadata, empty entity collections |
| `docs/CHEESE_TAXONOMY_BLUEPRINT.md` | Canonical taxonomy definition |
| `docs/CHEESE_GOVERNANCE.md` | This document |

### Explicitly excluded from FOOD-04A

- Runtime artifacts (bootstrap, indexes, graph edges)
- Publication artifacts (HTML pages, sitemaps, search indexes)
- Generators, validators, certification scripts
- Deployment logic or platform code changes

### Domain contract compliance

Cheese conforms to the **Protein Food Ontology Platform v1.0.0** domain contract:

| Contract element | Cheese binding |
|------------------|----------------|
| Catalog SSOT | `data/cheese-catalog.json` |
| Three-level hierarchy | `cheese_category` → `cheese_group` → `cheese` |
| Immutable ontology IDs | `food.cheese.{group}.{slug}` |
| Controlled vocabularies | Frozen in catalog `schema` |
| Relationship placeholders | Empty arrays until FOOD-04D/E |
| Audit certification | Mirror Protein Food catalog audit |
| Publication | Reuse 03A–03I + DEPLOY-01 unchanged in FOOD-04F |

---

## 3. Namespace & Identity Model

### Namespace

Reserve: **`food.cheese.*`**

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.cheese` | `food.cheese` |
| Group | `food.cheese.{group}` | `food.cheese.hard` |
| Cheese | `food.cheese.{group}.{slug}` | `food.cheese.hard.cheddar` |

Shorthand IDs such as `food.cheese.cheddar` are **not valid**. The group segment is required — mirroring `food.protein.{group}.{slug}`.

### ID encoding principle (future domains)

**General rule:** An ontology ID should encode only information that is intended to be immutable. If there is any realistic possibility that an entity could be reclassified into another group, embedding the group in the ID makes reclassification costly — the ID cannot change, so a reclassified cheese would require a new entity ID and migration of all graph references.

**Cheese v1.0.0 tradeoff:** This domain deliberately includes the group segment (`food.cheese.{group}.{slug}`) because the nine-group taxonomy is frozen for v1 and is expected to be permanent. Reclassification across groups is treated as exceptional; it would require retiring the old ID and assigning a new one rather than mutating identity.

This mirrors the Protein Food convention but is a **documented tradeoff**, not an accidental pattern. Future domains should evaluate taxonomy stability before embedding group segments in immutable IDs. If group membership is uncertain, prefer a flatter ID (e.g. `food.cheese.{slug}`) and express group membership through hierarchy and intrinsic metadata only.

### Identity contract (every `cheese` entity)

Every cheese entity must contain:

```json
{
  "id": "",
  "slug": "",
  "display_name": "",
  "scientific_name": "",
  "external_ids": {},
  "catalog_version": "1.0.0",
  "food_ontology_version": "1.1.0"
}
```

### Identity rules

| Field | Rule |
|-------|------|
| `id` | **Immutable.** Once assigned, never changed. IDs are never recycled. |
| `slug` | May change for SEO. Ontology ID unchanged on slug migration. |
| `display_name` | May change. Editorial/display only. |
| `scientific_name` | **Required.** Milk source species only — see §5. |
| `external_ids` | **Required object.** May be `{}` when unpopulated. |
| `catalog_version` | Per-entity catalog schema version. |
| `food_ontology_version` | Per-entity food ontology suite version. |

Hub entities (`cheese_category`, `cheese_group`) use a subset plus hub fields (`introduction`, `child_slugs`, etc.) documented in `cheese-catalog.json` → `schema.entity_types`.

---

## 4. Intrinsic Metadata (Frozen Vocabulary)

All intrinsic fields are frozen before catalog population. New values require a governance amendment and catalog audit update.

### Required fields (every `cheese` entity)

| Field | Nullability | Extension policy |
|-------|-------------|------------------|
| `cheese_category` | Required | FOOD-04A amendment + audit update |
| `milk_source` | Required | Governance amendment |
| `aging_class` | Required | Governance amendment |
| `texture` | Required | Governance amendment |
| `moisture_class` | Required | Governance amendment |
| `rind_type` | Required | Governance amendment |
| `pasteurization` | Required | Governance amendment |
| `origin_country` | Nullable | ISO 3166-1 alpha-2; regional subdivisions via `external_ids` |
| `protected_status` | Required | Governance amendment |

### `cheese_category`

Aligned to taxonomy group. Nine values — frozen for v1:

`fresh` · `bloomy_rind` · `washed_rind` · `natural_rind` · `blue` · `semi_hard` · `hard` · `pasta_filata` · `brined`

### `milk_source`

`cow` · `goat` · `sheep` · `buffalo` · `mixed`

### `aging_class`

`unaged` · `short_aged` · `medium_aged` · `long_aged` · `extra_aged`

### `texture`

`soft` · `semi_soft` · `firm` · `hard` · `crumbly` · `creamy` · `granular` · `elastic`

### `moisture_class`

`high` · `medium` · `low` · `extra_low`

### `rind_type`

`none` · `bloomy` · `washed` · `natural` · `blue` · `wax` · `cloth` · `leaf_wrapped` · `smoked`

### `pasteurization`

`raw` · `pasteurized` · `thermalized` · `mixed` · `unknown`

### `origin_country`

ISO 3166-1 alpha-2 country code, or empty string `""` for style-generic cheeses without a single geographic origin.

### `protected_status`

`none` · `PDO` · `PGI` · `AOP` · `TSG` · `other` · `pending_documentation`

---

## 5. Scientific Naming (Milk Source)

Unlike Protein Foods, many cheeses share the same source species. **`scientific_name` identifies milk source only** — never cheese identity.

| Milk source | `scientific_name` |
|-------------|-------------------|
| Cow | `Bos taurus` |
| Goat | `Capra hircus` |
| Sheep | `Ovis aries` |
| Buffalo | `Bubalus bubalis` |

### Mixed-milk limitation (v1)

Schema v1 supports a **single** `scientific_name` per entity. For mixed-milk cheeses:

1. Use the **primary** milk source species in `scientific_name`
2. Set `milk_source` to `mixed`
3. Document secondary sources in `external_ids.milk_sources` (reserved namespace) or editorial `summary`

Do **not** change platform schema in FOOD-04A. Document the limitation; extend in a future governance amendment if required.

---

## 6. External Identifiers

Reserved namespaces — populate in FOOD-04B+:

| Namespace | Key | Format | Required |
|-----------|-----|--------|----------|
| Wikidata | `wikidata` | Q-number string | No |
| Wikipedia | `wikipedia` | Article title or URL slug | No |
| Open Food Facts | `open_food_facts` | Barcode or OFF product id | No (deferred) |
| PDO / PGI / AOP registry | `pdo_registry` | Official registry identifier | No |
| Mixed-milk sources | `milk_sources` | Array of `milk_source` values | No |

Governance only in FOOD-04A. No external IDs are populated until catalog acquisition.

---

## 7. Relationship Placeholders

All relationship arrays must be **present and empty** (`[]`) on every `cheese` entity until relationship mapping (FOOD-04D/E):

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
| `related_techniques` | Related winemaking/culinary techniques |
| `similar_cheeses` | `similar_to` |
| `substitutions` | `substitute_for` |
| `serving_styles` | Service context |
| `common_preparations` | Cross-domain prep |
| `common_cuisines` | Cuisine context |

---

## 8. Taxonomy (Summary)

Nine top-level groups — see [`CHEESE_TAXONOMY_BLUEPRINT.md`](CHEESE_TAXONOMY_BLUEPRINT.md) for full hierarchy, inclusion/exclusion criteria, and entity targets.

| Group | Slug | Target entities |
|-------|------|----------------:|
| Fresh | `fresh` | 15–25 |
| Bloomy Rind | `bloomy-rind` | 20–30 |
| Washed Rind | `washed-rind` | 15–25 |
| Natural Rind | `natural-rind` | 20–30 |
| Blue | `blue` | 20–30 |
| Semi-Hard | `semi-hard` | 25–35 |
| Hard | `hard` | 30–40 |
| Pasta Filata | `pasta-filata` | 10–15 |
| Brined | `brined` | 10–15 |

**Grand total target (FOOD-04B):** 180–250 canonical cheeses

### Out of scope (v1)

**Processed cheeses** are excluded unless a compelling pairing-relevant exception is approved during FOOD-04B review. See `schema.processed_cheese_policy` in `cheese-catalog.json`.

---

## 9. Audit Rules

Certification requirements mirror Protein Food catalog audit (ONTOLOGY-02A.A). Required checks:

| Check | Description |
|-------|-------------|
| `unique_ids` | No duplicate ontology IDs |
| `unique_slugs` | No duplicate slugs within catalog |
| `immutable_identity` | IDs conform to pattern and are never recycled |
| `required_scientific_name` | Present and from allowed milk-source species list |
| `required_external_ids_object` | `external_ids` object present on every entity |
| `schema_version_validation` | `catalog_version` and `food_ontology_version` match governance |
| `controlled_vocabulary_validation` | All intrinsic fields use frozen vocabularies |
| `hierarchy_integrity` | Category → group → cheese parent references valid |
| `alias_uniqueness` | Aliases globally unique (case-insensitive) |
| `metadata_completeness` | All required fields populated |
| `relationship_arrays_present_and_empty` | Placeholder arrays present; empty until FOOD-04D/E |
| `entity_count_matches_meta` | `meta.entity_count` matches actual collection length |
| `id_pattern_compliance` | IDs match `entity_id_pattern` / `group_id_pattern` / `category_id_pattern` |
| `group_parent_category_alignment` | Groups reference valid parent category |
| `cheese_parent_group_alignment` | Cheeses reference valid parent group |

### Advisory checks (non-blocking)

| Check | Description |
|-------|-------------|
| `origin_country_population_coverage` | Geographic origin documented where applicable |
| `protected_status_documentation` | PDO/PGI/AOP status aligned with registry |
| `external_ids_enrichment` | Wikidata/Wikipedia/registry IDs populated |
| `mixed_milk_documentation` | Secondary milk sources documented for mixed cheeses |

Audit script implementation is deferred to FOOD-04C. Rules are frozen here for FOOD-04B population guidance.

---

## 10. Change Policy

### Allowed in future catalog versions

- **Add** new `cheese` entities with new ontology IDs
- **Add** new groups (requires governance amendment — nine groups frozen for v1)
- **Update** display names, slugs, aliases, editorial fields
- **Populate** reserved relationship arrays (FOOD-04D/E)
- **Populate** external identifiers (FOOD-04B+)
- **Extend** controlled vocabularies (with documented governance amendment)

### Immutable

- **Ontology IDs** — once assigned, never change
- **Governance baseline** — v1.0.0 certification counts recorded in §11 for regression comparison

### Slug migration

Slug changes are permitted for SEO but require:

1. Documented migration note in ontology changelog
2. Redirect map in generator layer (when pages exist in FOOD-04F)
3. Ontology ID unchanged

### Controlled vocabulary additions

New values for any intrinsic field require:

1. Amendment to this document and `cheese-catalog.json` schema
2. Update to domain audit script (FOOD-04C)
3. Re-run catalog audit before merge

### Bootstrap contract (FOOD-04C+)

Bootstrap **must not modify** `cheese-catalog.json`. The catalog is **immutable input**. Bootstrap parses, normalizes, indexes, and emits derived artifacts only. All generated outputs must be reproducible from the catalog SSOT.

---

## 11. Certification Baseline

Permanent reference for Cheese Governance v1.0.0 audits and regression checks.

| Baseline metric | v1.0.0 value |
|-----------------|-------------|
| Categories | 0 (shell — 1 planned) |
| Groups | 0 (shell — 9 planned) |
| Cheeses | **0** |
| Governance status | Frozen |
| Platform modifications | **0** |
| Vocabulary violations | N/A (no entities) |
| Metadata completeness | N/A (no entities) |

Entity counts will be updated at FOOD-04B catalog freeze.

---

## 12. Lifecycle Position

```text
cheese-catalog.json          ✅ Governance shell (0 entities)
        ↓
CHEESE_TAXONOMY_BLUEPRINT    ✅ Approved
        ↓
CHEESE_GOVERNANCE            ✅ Frozen v1.0.0 (this document)
        ↓
catalog population           ⏳ FOOD-04B (blocked until approval)
        ↓
catalog audit                ⏳ FOOD-04C
        ↓
bootstrap + validator        ⏳ FOOD-04C
        ↓
relationship mapper          ⏳ FOOD-04D/E
        ↓
publication (reuse platform) ⏳ FOOD-04F
```

---

## 13. Success Criteria (FOOD-04A)

This phase succeeds when:

- [x] Governance documents are complete
- [x] Empty catalog is established (`categories: []`, `groups: []`, `cheeses: []`)
- [x] Namespaces are reserved (`food.cheese.*`)
- [x] Controlled vocabularies are frozen
- [x] Audit rules are documented
- [x] **No platform code, generators, validators, publication logic, or deployment logic modified**

---

## Related Documents

| Document | Role |
|----------|------|
| [`CHEESE_TAXONOMY_BLUEPRINT.md`](CHEESE_TAXONOMY_BLUEPRINT.md) | Approved taxonomy blueprint |
| [`data/cheese-catalog.json`](../data/cheese-catalog.json) | Catalog SSOT and schema contract |
| [`FOOD_PROTEIN_CATALOG_V1.md`](FOOD_PROTEIN_CATALOG_V1.md) | Reference governance pattern (Protein Food) |
| [`PROTEIN_TAXONOMY_BLUEPRINT.md`](PROTEIN_TAXONOMY_BLUEPRINT.md) | Reference taxonomy pattern |
| [`ONTOLOGY-02A_ARCHITECTURE.md`](ONTOLOGY-02A_ARCHITECTURE.md) | Platform domain contract origin |

---

*Cheese Governance v1.0.0 is frozen. No cheese entities may be added until governance is approved and FOOD-04B is explicitly authorized.*
