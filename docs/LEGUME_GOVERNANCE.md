# FOOD-11A — Legume Ontology Governance

**Phase:** FOOD-11A — Legume Ontology Governance  
**Freeze Date:** July 20, 2026  
**Status:** **Legume Governance Frozen v1.0.0**  
**SSOT:** [`data/legume-catalog.json`](../data/legume-catalog.json)  
**Taxonomy:** [`LEGUME_TAXONOMY_BLUEPRINT.md`](LEGUME_TAXONOMY_BLUEPRINT.md)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)  
**Platform:** Food Ontology Platform v1.0.0 (frozen — domain contract only)  
**Suite baseline:** Food Ontology Suite v1.7.0 · tag `food-ontology-suite-v1.7.0`

---

## Executive Summary

PairingMethod declares **Legume Ontology Governance v1.0.0** — the authoritative governance layer for the **Legume Ontology** within Food Ontology Suite expansion toward v1.8.0.

This domain is **not** botanical taxonomy, cultivar catalogs, commercial branding, prepared meals, snack foods, or beverages. It is the authoritative ontology for **culinary legumes, pulses, beans, peas, lentils, chickpeas, and legume-derived ingredients** used as distinct culinary ingredients worldwide. The project models **ingredients**, not hummus platters, dal bowls, or canned convenience meals.

FOOD-11 resolves one of the suite's last major ownership boundaries by establishing legumes as an **independent culinary ontology** while preserving the separation already defined for the Nut & Seed domain (peanut remains exclusively Nut & Seed). By introducing **LEGUME-001** alongside **LEGUME-002**, the suite formalizes ownership of beans, peas, lentils, chickpeas, and soy-based ingredients while extending the established processing model to fermented and transformed legume products such as tofu and tempeh — continuing the governance lineage of BOTAN-001, PROC-001, FRUIT-001, and NUT-001 without platform modification.

This milestone establishes the canonical catalog shell, **Canonical Culinary Groups**, immutable identity rules, the intrinsic attribute `usage_intensity`, controlled vocabularies, cross-domain reference policy, and the domain rules **LEGUME-001** and **LEGUME-002**.

**No legume entities exist yet.** No runtime artifacts, publication artifacts, or platform changes are created in this phase.

Legume will be the **ninth consumer** of the multi-domain publication platform. Publication will reuse the shared platform via domain configuration in FOOD-11F — no platform modifications.

**Governance status:** Frozen. Entity population begins only after explicit approval to proceed with FOOD-11B.

---

## Domain Independence Principle

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — Domain Independence Principle.

Every new ontology domain is evaluated against four questions **before implementation**. **No modifications in FOOD-11A.**

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
| Domain | Legume (culinary legumes, pulses, and legume-derived ingredients) |
| Governance version | **v1.0.0** |
| JSON `catalog_version` | `1.0.0` |
| `food_ontology_version` (target suite) | `1.8.0` (upon FOOD-11F publication) |
| `platform_version` | `1.0.0` (frozen) |
| `wine_ontology_version` (reference) | `2.0` |
| `ontology_foundation_version` | `1.0.0` |
| Phase | FOOD-11A (governance only) |

---

## 2. Architectural Scope

### Allowed artifacts (FOOD-11A only)

| Artifact | Purpose |
|----------|---------|
| `data/legume-catalog.json` | Catalog SSOT — schema, metadata, hub entities, empty `legumes` |
| `docs/LEGUME_TAXONOMY_BLUEPRINT.md` | Canonical taxonomy definition |
| `docs/LEGUME_GOVERNANCE.md` | This document |

### Explicitly excluded from FOOD-11A

- Runtime artifacts (bootstrap, indexes, graph edges)
- Publication artifacts (HTML, sitemaps, search indexes)
- Generators, validators, certification scripts
- Deployment logic or **any** platform code changes
- Editorial relationships (FOOD-11D)
- Wine pairings (FOOD-11E)
- Catalog population (FOOD-11B)

### Domain contract compliance

| Contract element | Legume binding |
|------------------|----------------|
| Catalog SSOT | `data/legume-catalog.json` |
| Three-level hierarchy | `legume_category` → `legume_group` → `legume` |
| Immutable ontology IDs | `food.legume.{group}.{slug}` |
| Controlled vocabularies | Frozen in catalog `schema` |
| Relationship placeholders | Empty arrays until FOOD-11D/E |
| Publication | Shared platform + domain config in FOOD-11F |

---

## 3. Canonical Culinary Groups

Legume taxonomy is **culinary**, not botanical. Groups answer *"What is this ingredient's culinary identity and form?"* — not *"What is its plant family?"*

### Frozen groups (FOOD-11 v1) — **immutable**

These six **Canonical Culinary Groups** are a **frozen controlled vocabulary**. Display names, slugs, and group IDs must **not** be renamed, merged, split, or supplemented with peer groups in v1 unless a future governance amendment documents a compelling architectural reason and accepts migration cost.

| Display name (immutable) | Slug (immutable) | Group ID (immutable) | `culinary_group` |
|--------------------------|------------------|----------------------|------------------|
| **Beans** | `beans` | `food.legume.beans` | `beans` |
| **Peas** | `peas` | `food.legume.peas` | `peas` |
| **Lentils** | `lentils` | `food.legume.lentils` | `lentils` |
| **Chickpeas** | `chickpeas` | `food.legume.chickpeas` | `chickpeas` |
| **Other Legumes** | `other-legumes` | `food.legume.other-legumes` | `other_legumes` |
| **Legume Products** | `legume-products` | `food.legume.legume-products` | `legume_products` |

**Expansion policy:** Future growth occurs **inside** these groups (new leaf entities), not by adding new peer groups.

---

## 4. Namespace & Identity Model

### Namespace

Reserve: **`food.legume.*`**

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.legume` | `food.legume` |
| Group | `food.legume.{group}` | `food.legume.beans` |
| Legume | `food.legume.{group}.{slug}` | `food.legume.beans.kidney-bean` |

Shorthand IDs such as `food.legume.kidney-bean` (without group segment) are **not valid**.

### Identity contract (every `legume` entity)

```json
{
  "id": "",
  "slug": "",
  "display_name": "",
  "scientific_name": "",
  "parent_group": "",
  "parent_category": "legume",
  "culinary_group": "",
  "usage_intensity": "",
  "aliases": [],
  "common_names": [],
  "external_ids": {},
  "catalog_version": "1.0.0",
  "food_ontology_version": "1.8.0"
}
```

---

## 5. Domain Boundaries

### Included

| Include | Examples |
|---------|----------|
| Dried beans | kidney bean, black bean, pinto bean, navy bean, cannellini bean |
| Fresh culinary legumes | green pea, snow pea, snap pea, fava bean (when whole legume identity governs) |
| Lentils | green lentil, red lentil, brown lentil, black lentil |
| Peas | green pea, split pea (when governed as pea identity) |
| Chickpeas | chickpea, split chickpea |
| Split legumes | split peas, split lentils (when distinct culinary identity governs per LEGUME-002) |
| Bean flours | bean flour, fava flour (when globally significant) |
| Chickpea flour | besan / chickpea flour |
| Soy-derived products | tofu, tempeh, miso — **when governance assigns ownership here** (see §9) |

### Excluded

| Exclude | Rationale |
|---------|-----------|
| Botanical taxonomy and cultivars | Not culinary ingredient scope |
| Commercial brands and snack products | Not ingredient ontology |
| Prepared meals and composed dishes | Not ingredient ontology |
| Sprouts | Distinct culinary identity — reserved; not populated in v1 unless governance amendment |
| Beverages | Beverage domain |
| Legume **oils** | Not savory ingredient scope in v1 |
| Peanut | **Nut & Seed (FOOD-10)** — exclusive ownership per NUT-001 |
| Protein-catalog legacy group placeholders | Superseded at Legume publication — cross-reference by canonical ID only |

**Soybean note:** Canonical ownership is **provisionally assigned to Legume** in FOOD-11A. FOOD-11B catalog audit must confirm soybean placement in **Other Legumes** before population. Future governance may reassign only through documented amendment — not silent duplication.

---

## 6. Suite Governance Rules (continued)

FOOD-11A continues all suite rules without redefinition. Authoritative definitions live in [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture.

| Rule | ID | FOOD-11A application |
|------|-----|----------------------|
| Canonical Entity Rule | CANON-001 | One canonical culinary legume per ingredient identity |
| Global Culinary Recognition Rule | CANON-002 | Globally recognizable legumes before regional trade names |
| Botanical Ownership Rule | BOTAN-001 | Culinary identity over botanical classification |
| Processing Ownership Rule | PROC-001 | Processing that changes culinary identity → separate entity — complements LEGUME-002 |
| Culinary Form Ownership Rule | FRUIT-001 | Referenced for cross-domain discipline; does not govern Legume ownership |
| Culinary Classification Rule | NUT-001 | Referenced — peanut remains Nut & Seed; legumes do not reclassify peanut |
| Processed Product Rule | NUT-002 | Referenced as suite processing baseline — LEGUME-002 extends for legume domain |

---

## 7. LEGUME-001 — Culinary Ownership Rule

**Introduced:** FOOD-11A · **Applies** to Legume catalog grouping and canonical ownership; **does not override** cross-domain ownership decisions in §9.

> Canonical **ownership and group assignment** follow **established culinary ingredient identity**, not botanical taxonomy alone.

### Ownership examples (frozen)

| Ingredient | Botanical note | Culinary group | Rationale |
|------------|----------------|----------------|-----------|
| Kidney Bean | Phaseolus vulgaris | **Beans** | Standard dried bean culinary identity |
| Chickpea | Cicer arietinum | **Chickpeas** | Distinct chickpea culinary family |
| Lentil | Lens culinaris | **Lentils** | Pulse identity separate from beans |
| Green Pea | Pisum sativum | **Peas** | Fresh and dried pea culinary identity |
| Soybean | Glycine max | **Other Legumes** | Provisional — primary whole soy culinary identity |
| Peanut | Legume botanically | **Not Legume** | Owned exclusively by Nut & Seed (NUT-001) |

LEGUME-001 governs **which immutable group** receives an entity and **which domain owns** the canonical ingredient. It does **not** permit duplicating entities owned by another domain.

---

## 8. LEGUME-002 — Processed Product Rule

**Introduced:** FOOD-11A · **Applies** to Legume catalog, editorial, and wine layers; extends PROC-001 for legume-derived forms.

> A processed legume becomes a **separate canonical ingredient** only when it possesses an **independent culinary identity**. The determining factor is **independent culinary function**, not preparation method alone.

### Separate canonical entities (default freeze)

| Whole form | Processed form | Group assignment | Rationale |
|------------|----------------|------------------|-----------|
| Chickpea | Chickpea Flour | Legume Products | Distinct besan and coating function |
| Soybean | Tofu | Legume Products | Independent fermented/coagulated identity |
| Soybean | Tempeh | Legume Products | Independent fermented cake identity |
| Soybean | Miso | Legume Products | Independent fermented paste identity — if assigned here |

### Aliases or preparation states only (default freeze)

| Entity | Treatment |
|--------|-----------|
| Cooked Chickpeas | Alias on Chickpea |
| Split Peas | Alias on Green Pea or separate entity only if FOOD-11B audit documents distinct culinary identity |
| Mashed Beans | Alias on governing bean entity |
| Canned Beans | Alias on governing dried bean entity (default) |

---

## 9. Cross-Domain Ownership

Canonical ownership must remain **unique** across the suite. Legume does not duplicate intrinsic data from other domains.

| Ingredient / concept | Owner domain | Notes |
|----------------------|--------------|-------|
| Peanut | **Nut & Seed (FOOD-10)** | `food.nut-seed.peanuts.peanut` — not Legume |
| Soybean | **Legume (FOOD-11)** | Provisional — `food.legume.other-legumes.soybean` at FOOD-11B |
| Chickpea Flour | **Legume (FOOD-11)** | Legume Products — distinct from whole chickpea |
| Tofu | **Legume (FOOD-11)** | Legume Products |
| Tempeh | **Legume (FOOD-11)** | Legume Products |
| Miso | **Legume (FOOD-11)** | Legume Products — if populated; not duplicated in Sauce domain v1 |
| Mustard Seed | Herb & Spice (FOOD-07) | Remains in Herb & Spice |
| Sesame | Nut & Seed (FOOD-10) | Not a legume culinary identity |
| Wheat · Rice · bean starches as grain products | Grain & Starch (FOOD-08) | Cross-reference only when applicable |
| Protein catalog `legumes` / `soy` groups | Protein Foods (FOOD-02) | Legacy placement — superseded by Legume canonical IDs at publication |

Cross-domain references use **canonical ontology IDs only** — never duplicated intrinsic fields.

---

## 10. Required Intrinsic Fields

Every leaf entity requires these fields at FOOD-11B population (see catalog `schema` for full contract):

| Field | Rule |
|-------|------|
| `id` | Immutable canonical ID — `food.legume.{group}.{slug}` |
| `slug` | URL-safe identifier — mutable for SEO; ID unchanged |
| `display_name` | Human-readable name — mutable |
| `scientific_name` | Required — primary species or `Multiple species` for blends |
| `parent_group` | Required — group slug |
| `parent_category` | Required — always `legume` |
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
| `primary` | Staple prominence — defines dish character (e.g., lentil in dal, black bean in stew) |
| `accent` | Supporting role — garnish, side pulse, or background legume note |
| `luxury` | Premium or specialty prominence — heirloom beans, specialty fermented soy products in finishing contexts |

---

## 12. Reserved Attributes

The following fields are **required on every leaf entity** but remain **empty arrays through FOOD-11B**:

| Field | Populate from |
|-------|---------------|
| `flavor_profile` | FOOD-11C runtime curation standards (post-FOOD-11B) |
| `texture_profile` | FOOD-11C runtime curation standards (post-FOOD-11B) |
| `aroma_profile` | FOOD-11C runtime curation standards (post-FOOD-11B) |

Controlled vocabularies for these fields are frozen in FOOD-11A catalog `schema` — do not populate values until post-FOOD-11B curation standards are approved.

---

## 13. FOOD-11B Target

**Target:** approximately **70–95** canonical ingredients.

Coverage prioritizes **globally significant culinary legumes** before regional specialties. Entity quality over count.

See [`LEGUME_TAXONOMY_BLUEPRINT.md`](LEGUME_TAXONOMY_BLUEPRINT.md) for per-group planning targets.

---

## 14. Lifecycle & Next Phases

| Phase | Scope |
|-------|-------|
| **FOOD-11A** (this document) | Governance freeze — no entities |
| FOOD-11B | Catalog population + audit |
| FOOD-11C | Runtime compile |
| FOOD-11D | Editorial relationships |
| FOOD-11E | Wine pairings |
| FOOD-11F | Publication via shared platform |

**Next work:** FOOD-11B — Populate Legume Ontology catalog (pending explicit approval).
