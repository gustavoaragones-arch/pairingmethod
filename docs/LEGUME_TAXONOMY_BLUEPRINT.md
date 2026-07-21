# FOOD-11A — Legume Ontology Taxonomy Blueprint

**Status:** **Approved for governance freeze** (July 20, 2026)  
**Parent:** [`LEGUME_GOVERNANCE.md`](LEGUME_GOVERNANCE.md)  
**Catalog SSOT:** [`data/legume-catalog.json`](../data/legume-catalog.json) (empty `legumes` — populate in FOOD-11B)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)

This document defines the **Legume Ontology taxonomy** independently of catalog population. Approve this blueprint before adding entities to `legume-catalog.json`.

---

## 1. Domain & Namespace

| Field | Value |
|-------|-------|
| Domain name | **Legume Ontology** |
| Domain framing | **Culinary legumes, pulses, and legume-derived ingredients** — not botanical taxonomy; not prepared meals or snack products |
| Domain key | `legume` |
| Namespace | `food.legume.*` |
| Platform version | `1.0.0` (frozen) |
| Target suite version | `1.8.0` (upon FOOD-11F) |
| Catalog version | `1.0.0` |

### ID examples

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.legume` | `food.legume` |
| Group | `food.legume.{group}` | `food.legume.beans` |
| Legume | `food.legume.{group}.{slug}` | `food.legume.beans.kidney-bean` |

Shorthand IDs such as `food.legume.kidney-bean` are **not valid**.

---

## 2. Canonical Culinary Groups

Groups are **culinary identity and culinary form**, not botanical families. See [`LEGUME_GOVERNANCE.md`](LEGUME_GOVERNANCE.md) §3.

```text
Legumes (legume)
├── Beans (beans)
├── Peas (peas)
├── Lentils (lentils)
├── Chickpeas (chickpeas)
├── Other Legumes (other-legumes)
└── Legume Products (legume-products)
```

---

## 3. Hierarchy

Exactly three levels in FOOD-11:

```text
legume_category
    ↓
legume_group              ← Canonical Culinary Group
    ↓
legume                    ← leaf entity
```

Canned variants, soak states, and trade names are `aliases` or `common_names` — not nested sub-groups. Similarity uses editorial relationships (`similar_legumes`, `substitutions`), not hierarchy.

---

## 4. Canonical Culinary Groups (6) — immutable

These names, slugs, and group IDs are **frozen controlled vocabularies**. Do not rename. Expand inside groups only.

| Slug | Name | Group ID | `culinary_group` | Planning target |
|------|------|----------|------------------|----------------:|
| `beans` | Beans | `food.legume.beans` | `beans` | 18–28 |
| `peas` | Peas | `food.legume.peas` | `peas` | 8–14 |
| `lentils` | Lentils | `food.legume.lentils` | `lentils` | 10–16 |
| `chickpeas` | Chickpeas | `food.legume.chickpeas` | `chickpeas` | 4–8 |
| `other-legumes` | Other Legumes | `food.legume.other-legumes` | `other_legumes` | 8–14 |
| `legume-products` | Legume Products | `food.legume.legume-products` | `legume_products` | 12–20 |

**Grand total target (FOOD-11B):** **70–95** canonical culinary legumes and governed legume-derived ingredients

Counts are planning targets for authoritative global coverage — not hard caps. **Entity quality over count.**

### Representative entities (planning — not exhaustive)

| Group | Examples |
|-------|----------|
| Beans | kidney bean, black bean, pinto bean, navy bean, cannellini bean, lima bean, fava bean |
| Peas | green pea, split pea, snow pea, black-eyed pea (when pea identity governs) |
| Lentils | green lentil, red lentil, brown lentil, black beluga lentil |
| Chickpeas | chickpea |
| Other Legumes | soybean, mung bean, adzuki bean, lupin bean |
| Legume Products | chickpea flour, tofu, tempeh, miso, bean flour |

**Excluded from Legume:** peanut (Nut & Seed), mustard seed (Herb & Spice), sesame (Nut & Seed).

---

## 5. Inclusion Criteria

A legume qualifies when it meets **all** of:

1. **Culinary ingredient identity** — recognized as a culinary legume, pulse, bean, pea, lentil, chickpea, or governed legume-derived ingredient worldwide or in major regional cuisines.
2. **Pairing relevance** — earthiness, starch, fermentation, or protein character materially affects wine pairing.
3. **Taxonomic fit** — maps unambiguously to one Canonical Culinary Group per LEGUME-001.
4. **Immutable ID assignability** — permanent `food.legume.{group}.{slug}` without collision.
5. **Intrinsic metadata completeness** — all required fields populated from authoritative sources.
6. **Canonical Entity Rule (CANON-001)** — see [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture.
7. **Global Culinary Recognition Rule (CANON-002)** — globally recognizable before regional trade-name splits.
8. **Processed Product Rule (LEGUME-002)** — §8 governance decisions apply before entity assignment.

---

## 6. Exclusion Criteria

| Exclude | Rationale |
|---------|-----------|
| Botanical taxonomy and cultivars | Not culinary ingredient scope |
| Commercial brands and snack products | Not ingredient ontology |
| Prepared meals and composed dishes | Not ingredient ontology |
| Sprouts | Reserved — distinct identity; not v1 unless governance amendment |
| Beverages and legume oils | Out of domain v1 |
| Prepared foods | Not ingredient ontology |

| Route elsewhere | Owner |
|-----------------|-------|
| Peanut | FOOD-10 Nut & Seed Ontology — NUT-001 |
| Sesame | FOOD-10 Nut & Seed Ontology |
| Mustard seed | FOOD-07 Herb & Spice Ontology |
| Coconut · fruit legumes misclassified as fruit | FOOD-09 Fruit Ontology (cross-domain discipline) |
| Honey · chocolate | FOOD-12 Sweet Flavor Ontology |
| Wheat flour · rice | FOOD-08 Grain & Starch Ontology |
| Protein catalog legacy `legumes` / `soy` leaves | FOOD-11 Legume — supersedes at publication |

---

## 7. Intrinsic Metadata Summary

See [`LEGUME_GOVERNANCE.md`](LEGUME_GOVERNANCE.md) §10–12 for frozen vocabularies.

| Field | FOOD-11B |
|-------|----------|
| `culinary_group` | Required — immutable group alignment |
| `usage_intensity` | Required — `primary` · `accent` · `luxury` |
| `flavor_profile` | Required array — **empty** through FOOD-11B |
| `texture_profile` | Required array — **empty** through FOOD-11B |
| `aroma_profile` | Required array — **empty** through FOOD-11B |
| `scientific_name` | Required |

---

## 8. Governance Rules Summary

| Rule | ID | Application |
|------|-----|-------------|
| Culinary Ownership Rule | **LEGUME-001** | Canonical ownership by culinary identity — kidney bean in Beans; peanut excluded |
| Processed Product Rule | **LEGUME-002** | Separate entities for chickpea flour, tofu, tempeh; aliases for cooked/mashed forms |
| Processing Ownership | PROC-001 | Suite baseline — LEGUME-002 extends for legume domain |
| Botanical Ownership | BOTAN-001 | Suite baseline — culinary identity over botanical taxonomy |
| Culinary Classification | NUT-001 | Cross-domain reference — peanut remains Nut & Seed |
| Processed Product (suite) | NUT-002 | Suite baseline reference |

Full definitions: [`LEGUME_GOVERNANCE.md`](LEGUME_GOVERNANCE.md) §6–9.

---

## 9. Publication Paths (FOOD-11F — planned)

| Page type | URL prefix (planned) |
|-----------|------------------------|
| Category hub | `/legume-categories/legume/` |
| Group hubs | `/legume-groups/{slug}/` |
| Ingredient pages | `/legumes/{slug}/` |

Publication reuses the shared platform — no architectural changes at FOOD-11F.

---

## 10. Approval

| Milestone | Status |
|-----------|--------|
| Taxonomy blueprint approved | ✓ July 20, 2026 |
| Governance frozen (FOOD-11A) | ✓ |
| Catalog population (FOOD-11B) | Pending explicit approval |
