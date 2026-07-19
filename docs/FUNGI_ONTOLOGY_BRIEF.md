# FOOD-06 — Fungi Ontology (Pre-Governance Brief)

**Status:** Superseded by frozen governance — see [`FUNGI_GOVERNANCE.md`](FUNGI_GOVERNANCE.md) (FOOD-06A, July 18, 2026)  
**Opens from:** tag `food-ontology-suite-v1.2.0`  
**Next phase:** FOOD-06A — Governance  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)  
**Suite target:** Food Ontology Suite v1.3.0 (upon FOOD-06F publication)

---

## Executive distinction

The Fungi Ontology is **not** a "mushroom list."

It is the authoritative ontology for **culinary fungi** — edible fungi used as culinary ingredients worldwide.

PairingMethod models **ingredients**, not biology. Taxonomic, ecological, and medicinal classification belong outside this domain unless required for canonical identity.

---

## Domain scope

### In scope

Canonical edible fungi used as culinary ingredients worldwide.

### Explicitly excluded

| Exclusion | Rationale |
|-----------|-----------|
| Toxic fungi | Not culinary ingredients |
| Medicinal fungi unless commonly used as food | Out of culinary scope |
| Botanical taxonomy beyond identity needs | Culinary ontology, not mycology |
| Ecological classification | Not pairing-relevant |

### Relationship to Protein Foods

The Protein Foods catalog currently includes a `mushrooms` group (12 entities) as **fungi-as-protein**. FOOD-06 establishes the dedicated **Fungi Ontology** as the authoritative domain for culinary fungi. Migration or deduplication strategy will be defined in FOOD-06A governance — not in this brief.

---

## Canonical Culinary Groups (proposed — immutable at freeze)

Unlike Vegetables (poster-aligned groups), Fungi groups are **culinary**, not poster rows:

| Group slug (proposed) | Name | Examples |
|----------------------|------|----------|
| `cultivated-mushrooms` | Cultivated Mushrooms | Button, Cremini, Portobello, Shiitake, Oyster, Enoki, King Oyster |
| `wild-mushrooms` | Wild Mushrooms | Chanterelle, Morel, Porcini, Matsutake, Black Trumpet |
| `truffles` | Truffles | Black Truffle, White Truffle |
| `specialty-fungi` | Specialty Fungi | Wood Ear, Lion's Mane, Beech Mushroom, Nameko |

The ontology remains **culinary rather than taxonomic**. Cultivar and color variants (e.g. Cremini / Portobello) follow the **Canonical Entity Rule** established in FOOD-05 — aliases where appropriate, not duplicate entities unless culinary identity genuinely diverges (governance decision in 06A).

---

## New intrinsic attribute: `usage_intensity`

Vegetables introduced `culinary_role` (intrinsic culinary function). Fungi introduces a complementary governed attribute:

### Controlled vocabulary (proposed)

| Value | Meaning | Examples |
|-------|---------|----------|
| `primary` | Substantial ingredient in a dish | Button Mushroom |
| `accent` | Supporting umami or texture note | Wood Ear, Enoki |
| `luxury` | Rare, high-cost, pairing-defining | Truffle, Matsutake |

This attribute is **intrinsic metadata** — catalog + runtime only. It must not drive wine pairing algorithmically in FOOD-06E (editorial pairings remain curated).

Future Pairing Engine and meal composition (ENGINE-02/03) may consume `usage_intensity` alongside `culinary_role`.

---

## Cross-domain editorial graph

FOOD-06 is the first domain designed to exercise **meaningful cross-domain editorial relationships** at scale.

Example (Porcini):

```
commonly_served_with → food.vegetable.alliums.onion
commonly_served_with → food.herb.thyme          (forward reference)
commonly_served_with → food.protein.beef.brisket
commonly_served_with → food.cheese.hard.parmigiano-reggiano
```

**Policy:** The Fungi Ontology owns **only the relationship**. It does not duplicate intrinsic data from Vegetable, Herb, Protein, or Cheese domains. Forward references to unpublished domains are permitted (established in FOOD-05D).

---

## Why FOOD-06 matters

| Challenge | FOOD-06 exercise |
|-----------|-------------------|
| Biological vs culinary classification | Culinary groups + Canonical Entity Rule |
| Luxury / global naming | Truffle group + `usage_intensity: luxury` |
| Cross-domain pairing context | Editorial Tier C forward references |
| Non-plant produce template | First domain after Vegetables for remaining plant-based and specialty produce ontologies |

If FOOD-06 handles these well, FOOD-07 through FOOD-13 become substantially easier.

---

## Lifecycle (identical to FOOD-04 / FOOD-05)

| Phase | Deliverable |
|-------|-------------|
| **FOOD-06A** | Governance + taxonomy blueprint + catalog shell |
| **FOOD-06B** | Canonical catalog population |
| **FOOD-06C** | Runtime (structural + intrinsic similarity) |
| **FOOD-06D** | Editorial relationships |
| **FOOD-06E** | Wine pairing relationships (curated, not algorithmic) |
| **FOOD-06F** | Publication via shared platform (no platform work) |

**Platform modifications:** Not permitted without exceptional justification.

---

## Frozen master roadmap (post v1.2.0)

```
FOOD-06  Fungi Ontology              ← next
FOOD-07  Herb & Spice Ontology
FOOD-08  Grain & Starch Ontology
FOOD-09  Fruit Ontology
FOOD-10  Nut & Seed Ontology
FOOD-11  Legume Ontology
FOOD-12  Sweet Flavor Ontology
FOOD-13  Sauce & Condiment Ontology
FOOD-14  Protein Refinement
    ↓
ENGINE-01  Pairing Engine
ENGINE-02  Weighting Engine
ENGINE-03  Meal Composer
```

From v1.2.0 onward, primary work is **systematic creation of high-quality, governed culinary knowledge** — not software architecture.
