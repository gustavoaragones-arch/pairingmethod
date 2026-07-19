# FOOD-06A — Fungi Ontology Taxonomy Blueprint

**Status:** **Approved for governance freeze** (July 18, 2026)  
**Parent:** [`FUNGI_GOVERNANCE.md`](FUNGI_GOVERNANCE.md)  
**Catalog SSOT:** [`data/fungi-catalog.json`](../data/fungi-catalog.json) (empty `fungi` — populate in FOOD-06B)  
**Pre-governance brief:** [`FUNGI_ONTOLOGY_BRIEF.md`](FUNGI_ONTOLOGY_BRIEF.md)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)

This document defines the **Fungi Ontology taxonomy** independently of catalog population. Approve this blueprint before adding entities to `fungi-catalog.json`.

---

## 1. Domain & Namespace

| Field | Value |
|-------|-------|
| Domain name | **Fungi Ontology** |
| Domain framing | **Culinary fungi** — not a mushroom list; not biological taxonomy |
| Domain key | `fungi` |
| Namespace | `food.fungi.*` |
| Platform version | `1.0.0` (frozen) |
| Target suite version | `1.3.0` (upon FOOD-06F) |
| Catalog version | `1.0.0` |

### ID examples

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.fungi` | `food.fungi` |
| Group | `food.fungi.{group}` | `food.fungi.wild-mushrooms` |
| Fungus | `food.fungi.{group}.{slug}` | `food.fungi.wild-mushrooms.porcini` |

Shorthand IDs such as `food.fungi.porcini` are **not valid**.

---

## 2. Canonical Culinary Groups

Groups are **culinary**, not mycological. See [`FUNGI_GOVERNANCE.md`](FUNGI_GOVERNANCE.md) §3.

Unlike Vegetables (poster-aligned rows), Fungi groups answer: *"How is this fungus used in the kitchen and at the table?"*

```text
Fungi (fungi)
├── Cultivated Mushrooms (cultivated-mushrooms)
├── Wild Mushrooms (wild-mushrooms)
├── Truffles (truffles)
└── Specialty Fungi (specialty-fungi)
```

---

## 3. Hierarchy

Exactly three levels in FOOD-06:

```text
fungi_category
    ↓
fungi_group              ← Canonical Culinary Group
    ↓
fungus                   ← leaf entity
```

Commercial trade names, color variants, and size grades are `aliases` or `common_names` — not nested sub-groups. Similarity uses editorial relationships (`similar_fungi`, `substitutions`), not hierarchy.

---

## 4. Canonical Culinary Groups (4) — immutable

These names, slugs, and group IDs are **frozen controlled vocabularies**. Do not rename. Expand inside groups only.

| Slug | Name | Group ID | `culinary_group` | Planning target |
|------|------|----------|------------------|----------------:|
| `cultivated-mushrooms` | Cultivated Mushrooms | `food.fungi.cultivated-mushrooms` | `cultivated_mushrooms` | 12–20 |
| `wild-mushrooms` | Wild Mushrooms | `food.fungi.wild-mushrooms` | `wild_mushrooms` | 10–18 |
| `truffles` | Truffles | `food.fungi.truffles` | `truffles` | 2–4 |
| `specialty-fungi` | Specialty Fungi | `food.fungi.specialty-fungi` | `specialty_fungi` | 8–15 |

**Grand total target (FOOD-06B):** **35–60** canonical culinary fungi

Counts are planning targets for authoritative global coverage — not hard caps. **Entity quality over count.**

### Representative entities (planning — not exhaustive)

| Group | Examples |
|-------|----------|
| Cultivated Mushrooms | button mushroom, cremini, portobello, shiitake, oyster, enoki, king oyster |
| Wild Mushrooms | chanterelle, morel, porcini, matsutake, black trumpet |
| Truffles | black truffle, white truffle |
| Specialty Fungi | wood ear, lion's mane, beech mushroom, nameko |

**Excluded from this domain:** poisonous fungi; medicinal-only fungi; mycological family classification as hierarchy.

---

## 5. Inclusion Criteria

A culinary fungus qualifies when it meets **all** of:

1. **Culinary fungus identity** — recognized as an edible culinary ingredient worldwide or in major regional cuisines.
2. **Pairing relevance** — umami, earthiness, luxury character, or texture materially affects wine pairing.
3. **Taxonomic fit** — maps unambiguously to one Canonical Culinary Group.
4. **Immutable ID assignability** — permanent `food.fungi.{group}.{slug}` without collision.
5. **Intrinsic metadata completeness** — all required fields populated from authoritative sources.
6. **Canonical Entity Rule (CANON-001)** — one entity per canonical culinary ingredient; color and size variants are `aliases`, not new entities.

---

## 6. Exclusion Criteria

| Exclude | Rationale |
|---------|-----------|
| Poisonous / toxic fungi | Not culinary ingredients |
| Medicinal-only fungi | Out of culinary scope unless commonly used as food |
| Ecological or mycological classification | Not pairing-relevant |
| Scientific taxonomy beyond identity | `scientific_name` only — not hierarchy driver |

| Route elsewhere | Owner |
|-----------------|-------|
| Vegetables | FOOD-05 Vegetable Ontology |
| Herbs & spices | FOOD-07 Herb & Spice Ontology |
| Protein `mushrooms` group (legacy) | Canonical ownership → Fungi; migration FOOD-14 |

---

## 7. Intrinsic Metadata Summary

See [`FUNGI_GOVERNANCE.md`](FUNGI_GOVERNANCE.md) §7 for frozen vocabularies.

| Field | FOOD-06B |
|-------|----------|
| `culinary_group` | Required — immutable group alignment |
| `usage_intensity` | Required — `primary` · `accent` · `luxury` |
| `parent_group` / `parent_category` | Required — group slug + `fungi` category |
| `aliases`, `common_names` | Required arrays — may be `[]` |
| `flavor_profile` | Reserved — `[]` only in FOOD-06B |
| `texture_profile` | Reserved — `[]` only in FOOD-06B |
| `aroma_profile` | Reserved — `[]` only in FOOD-06B |
| `scientific_name` | Required — primary species for culinary identity |

### `usage_intensity` examples (intrinsic — never inferred)

| Entity | `usage_intensity` |
|--------|-------------------|
| Button Mushroom | `primary` |
| Porcini | `accent` |
| White Truffle | `luxury` |

---

## 8. Cross-Domain Relationships (FOOD-06D/E)

Fungi entities participate in cross-domain edges; they do not own foreign intrinsic data.

| Relationship | Typical targets | Layer |
|--------------|-----------------|-------|
| `commonly_served_with` | `food.vegetable.*`, `food.protein.*`, `food.cheese.*`, `food.herb.*` | Editorial |
| `similar_to` | `food.fungi.*` | Editorial |
| `substitutes_for` | `food.fungi.*` | Editorial |
| `pairs_with_style` | Wine style slugs | Pairing |
| `pairs_with_descriptor` | Descriptor slugs | Pairing |
| `pairs_with_technique` | Technique slugs | Pairing |

**FOOD-06 demonstration:** Editorial Tier C should populate representative cross-domain edges (e.g. porcini ↔ onion, thyme, beef, parmigiano) using canonical IDs only.

Example:

```text
food.fungi.wild-mushrooms.porcini
  commonly_served_with → food.vegetable.alliums.onion
  commonly_served_with → food.herb.thyme
  commonly_served_with → food.protein.beef.brisket
  commonly_served_with → food.cheese.hard.parmigiano-reggiano
```

---

## 9. Protein Migration (FOOD-06A policy)

Several fungi currently exist in Protein Foods (`food.protein.mushrooms.*`) as edible protein items.

| Policy | Detail |
|--------|--------|
| **Canonical owner** | Fungi Ontology (`food.fungi.*`) |
| **During FOOD-06** | No Protein IDs are broken or retired |
| **Compatibility** | Protein may retain references or aliases where needed |
| **Migration execution** | Deferred to **FOOD-14 Protein Refinement** |

FOOD-06B may assign new `food.fungi.*` IDs without requiring immediate Protein catalog changes.

---

## 10. Publication (FOOD-06F preview)

Publication consumes shared platform domain configuration — **no platform code changes**.

| Artifact prefix | Example |
|-----------------|---------|
| Projections | `data/generated/fungi-*.json` |
| Pages | `data/pages/fungi-*.json` |
| HTML | `dist/fungi/`, `dist/fungi-groups/`, `dist/fungi-categories/` |
| URLs | `/fungi/{slug}/`, `/fungi-groups/{slug}/` |

Exact paths finalized in FOOD-06F domain descriptor only.

---

## 11. Population Plan (FOOD-06B)

1. Populate category + group hub entities (already in catalog shell).
2. Acquire authoritative culinary fungus list per Canonical Culinary Group.
3. Assign immutable IDs and intrinsic metadata — **CANON-001** applies.
4. Populate `usage_intensity` on every entity; leave reserved profile arrays empty.
5. Leave relationship arrays empty — no editorial, wine, or preparation logic.
6. Run catalog audit before FOOD-06C.

**FOOD-06A approved.** Catalog curation runs against the frozen FOOD-06A contract.
