# FOOD-04A — Cheese Taxonomy Blueprint

**Status:** **Approved for governance freeze** (July 17, 2026)  
**Parent:** [`CHEESE_GOVERNANCE.md`](CHEESE_GOVERNANCE.md)  
**Catalog SSOT:** [`data/cheese-catalog.json`](../data/cheese-catalog.json) (empty — populate per Section 6 in FOOD-04B)

This document defines the **cheese taxonomy** independently of catalog population. Review and approve this blueprint before adding entities to `cheese-catalog.json`.

The Cheese module is the **first consumer** of the Protein Food Ontology Platform v1.0.0 domain contract. No platform code changes are required for this domain.

---

## 1. Domain & Namespace

| Field | Value |
|-------|-------|
| Domain | `cheese` |
| Namespace | `food.cheese.*` |
| Platform version | `1.0.0` (frozen) |
| Food ontology data version | `1.1.0` |
| Catalog version | `1.0.0` |

### ID examples

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.cheese` | `food.cheese` |
| Group | `food.cheese.{group}` | `food.cheese.hard` |
| Cheese | `food.cheese.{group}.{slug}` | `food.cheese.hard.cheddar` |

Shorthand references such as `food.cheese.cheddar` are **not valid ontology IDs**. Canonical IDs always include the group segment to preserve hierarchy integrity and mirror the Protein Food contract (`food.protein.{group}.{slug}`).

---

## 2. Hierarchy

Exactly three levels — **no fourth level** in FOOD-04:

```text
cheese_category
    ↓
cheese_group
    ↓
cheese
```

Style variants, affinage expressions, and regional subtypes are `cheese` leaf entities — not nested sub-groups. Similarity uses editorial relationships (`similar_cheeses`, `substitutions`), not hierarchy.

```text
Cheeses (cheese)
├── Fresh (fresh)
├── Bloomy Rind (bloomy-rind)
├── Washed Rind (washed-rind)
├── Natural Rind (natural-rind)
├── Blue (blue)
├── Semi-Hard (semi-hard)
├── Hard (hard)
├── Pasta Filata (pasta-filata)
└── Brined (brined)
```

---

## 3. Top-Level Groups (9)

| Slug | Name | Ontology group ID | `cheese_category` value | Target entities |
|------|------|-------------------|-------------------------|----------------:|
| `fresh` | Fresh | `food.cheese.fresh` | `fresh` | 15–25 |
| `bloomy-rind` | Bloomy Rind | `food.cheese.bloomy-rind` | `bloomy_rind` | 20–30 |
| `washed-rind` | Washed Rind | `food.cheese.washed-rind` | `washed_rind` | 15–25 |
| `natural-rind` | Natural Rind | `food.cheese.natural-rind` | `natural_rind` | 20–30 |
| `blue` | Blue | `food.cheese.blue` | `blue` | 20–30 |
| `semi-hard` | Semi-Hard | `food.cheese.semi-hard` | `semi_hard` | 25–35 |
| `hard` | Hard | `food.cheese.hard` | `hard` | 30–40 |
| `pasta-filata` | Pasta Filata | `food.cheese.pasta-filata` | `pasta_filata` | 10–15 |
| `brined` | Brined | `food.cheese.brined` | `brined` | 10–15 |

**Grand total target (FOOD-04B):** **180–250** canonical cheeses

Counts are planning targets for balanced coverage — not hard caps. Certification evaluates taxonomy quality and connectivity, not whether the catalog stopped at an exact total.

---

## 4. Inclusion Criteria

A cheese qualifies for the canonical catalog when it meets **all** of the following:

1. **Recognized culinary identity** — the cheese has a stable name in wine-pairing and food reference literature.
2. **Pairing relevance** — fat, salt, acidity, umami, or aging character materially affects wine pairing reasoning.
3. **Taxonomic fit** — the cheese maps unambiguously to one of the nine groups.
4. **Immutable ID assignability** — a permanent `food.cheese.{group}.{slug}` can be assigned without collision.
5. **Intrinsic metadata completeness** — all required intrinsic fields (see [`CHEESE_GOVERNANCE.md`](CHEESE_GOVERNANCE.md) §4) can be populated from authoritative sources.

### Strong inclusion signals

- PDO / PGI / AOP protected designation
- Global distribution or benchmark status in its style (e.g. Parmigiano-Reggiano, Brie, Roquefort)
- Frequent appearance in sommelier pairing curricula

---

## 5. Exclusion Criteria

Exclude from v1 unless explicitly approved during FOOD-04B review:

| Exclusion | Rationale |
|-----------|-----------|
| **Processed cheeses** | American singles, cheese spreads, processed slices — limited pairing nuance; out of scope for v1 |
| **Brand-only products** | Marketing names without independent style identity |
| **Duplicate regional variants** | When a protected name already exists (prefer PDO entity over generic duplicate) |
| **Non-cheese dairy** | Butter, yogurt, cream — separate future domains |
| **Cheese blends without identity** | Generic "three-cheese blend" without canonical style |

### Processed cheese policy

**Processed cheeses are out of scope for Cheese Catalog v1.0** unless a compelling pairing-relevant exception is documented and approved. See `schema.processed_cheese_policy` in `cheese-catalog.json`.

---

## 6. Planned Population (FOOD-04B)

No entities are added during FOOD-04A. FOOD-04B will populate:

1. **One category hub** — `food.cheese` (Cheeses)
2. **Nine group hubs** — one per taxonomy group
3. **180–250 cheese leaf entities** — distributed per §3 targets

### Illustrative entities by group (non-exhaustive)

#### Fresh (`fresh`)

| Slug | Display name | Milk source (`scientific_name`) |
|------|--------------|-------------------------------|
| `mozzarella-fior-di-latte` | Mozzarella (Fior di Latte) | Bos taurus |
| `burrata` | Burrata | Bos taurus |
| `ricotta` | Ricotta | Bos taurus |
| `goat-cheese-fresh` | Fresh Goat Cheese | Capra hircus |
| `queso-fresco` | Queso Fresco | Bos taurus |

#### Bloomy Rind (`bloomy-rind`)

| Slug | Display name | Milk source |
|------|--------------|-------------|
| `brie-de-meaux` | Brie de Meaux | Bos taurus |
| `camembert-de-normandie` | Camembert de Normandie | Bos taurus |
| `coulommiers` | Coulommiers | Bos taurus |

#### Blue (`blue`)

| Slug | Display name | Milk source |
|------|--------------|-------------|
| `roquefort` | Roquefort | Ovis aries |
| `stilton` | Stilton | Bos taurus |
| `gorgonzola` | Gorgonzola | Bos taurus |

#### Hard (`hard`)

| Slug | Display name | Milk source |
|------|--------------|-------------|
| `cheddar` | Cheddar | Bos taurus |
| `parmigiano-reggiano` | Parmigiano-Reggiano | Bos taurus |
| `gruyere` | Gruyère | Bos taurus |
| `pecorino-romano` | Pecorino Romano | Ovis aries |
| `gouda` | Gouda | Bos taurus |

*(Full entity lists are defined during FOOD-04B catalog acquisition.)*

---

## 7. Scientific Naming (Milk Source)

Unlike Protein Foods, many cheeses share the same source species. **`scientific_name` identifies milk source only** — never cheese identity.

| Milk source | `scientific_name` |
|-------------|-------------------|
| Cow | `Bos taurus` |
| Goat | `Capra hircus` |
| Sheep | `Ovis aries` |
| Buffalo | `Bubalus bubalis` |

### Mixed-milk cheeses

Schema v1 supports a **single** `scientific_name` per entity. For mixed-milk cheeses:

- Use the **primary** milk source species in `scientific_name`
- Document secondary sources in `external_ids.milk_sources` (reserved namespace) or editorial `summary`
- Do **not** change platform schema in FOOD-04A

---

## 8. Future Expansion Notes

| Area | Policy |
|------|--------|
| **Processed cheeses** | Deferred to v1.1+ with explicit scope review |
| **Regional sub-appellations** | Use separate leaf entities when pairing character differs materially |
| **Aged variants** | Prefer intrinsic `aging_class` over duplicate entities unless aging transforms pairing character |
| **Wine pairings** | FOOD-04E — reuse existing pairing relationship layer |
| **Additional groups** | Require governance amendment; nine groups are frozen for v1.0 |

---

## 9. Domain Contract Compliance

This blueprint conforms to the **Protein Food Ontology Platform v1.0.0** domain contract:

| Contract element | Cheese implementation |
|------------------|----------------------|
| Immutable IDs | `food.cheese.{group}.{slug}` |
| Catalog SSOT | `data/cheese-catalog.json` |
| Controlled vocabularies | Frozen in catalog `schema` |
| Relationship placeholders | Empty arrays until FOOD-04D/E |
| Publication pipeline | Reuse 03A–03I + DEPLOY-01 unchanged |
| Bootstrap / validate / map | FOOD-04C — domain scripts conforming to contract |

If Cheese implementation requires modifying projection generators, HTML renderer, or certification logic, **stop and generalize the platform contract first** — do not clone and rename pipeline code.

---

## Approval

| Milestone | Status |
|-----------|--------|
| Taxonomy blueprint approved | ✅ FOOD-04A |
| Catalog populated | ⏳ FOOD-04B |
| Governance frozen | ✅ Cheese Governance Frozen v1.0.0 |
