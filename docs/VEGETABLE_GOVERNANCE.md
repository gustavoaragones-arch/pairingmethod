# FOOD-05A — Vegetable Ontology Governance

**Phase:** FOOD-05A — Vegetable Ontology Governance  
**Freeze Date:** July 18, 2026  
**Status:** **Vegetable Governance Frozen v1.0.0**  
**SSOT:** [`data/vegetable-catalog.json`](../data/vegetable-catalog.json)  
**Taxonomy:** [`VEGETABLE_TAXONOMY_BLUEPRINT.md`](VEGETABLE_TAXONOMY_BLUEPRINT.md)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)  
**Platform:** Food Ontology Platform v1.0.0 (frozen — domain contract only)  
**Suite baseline:** Food Ontology Suite v1.1.0 · tag `food-ontology-suite-v1.1.0`

---

## Executive Summary

PairingMethod declares **Vegetable Ontology Governance v1.0.0** — the authoritative governance layer for the **Vegetable Ontology** within Food Ontology Suite expansion toward v1.2.0.

This milestone establishes the canonical catalog shell, **Canonical Culinary Groups**, immutable identity rules, controlled vocabularies, cross-domain reference policy, and audit requirements. **No vegetable entities exist yet.** No runtime artifacts, publication artifacts, or platform changes are created in this phase.

Vegetable is the **third consumer** of the multi-domain publication platform (after Protein Foods and Cheeses). Publication reuses the shared platform via domain configuration in FOOD-05F — no platform modifications.

**Governance status:** Frozen. Entity population begins only after explicit approval to proceed with FOOD-05B.

---

## Domain Independence Principle

Every new ontology domain is evaluated against four questions **before implementation**. This principle is operational from FOOD-05 onward and complements PLAN-01 governance rules.

| Question | If **yes** | If **no** |
|----------|------------|-----------|
| **Does this require a new ontology domain?** | FOOD-XX lifecycle (governance → publication) | Extend an existing domain |
| **Is this intrinsic knowledge?** | Catalog + runtime (structural layer) | Editorial or wine-pairing layer |
| **Is this computational reasoning?** | Pairing Engine (ENGINE-XX) | Never ontology |
| **Does this require a platform change?** | Burden of proof is **extremely high** | Domain additions alone never justify platform modification |

### Platform vs domain (PLAN-01)

> **Platform changes require architectural justification. Domain additions do not.**

### Cross-domain references (PLAN-01)

> **Ontology domains may reference entities in other domains only through canonical ontology IDs. They must never duplicate another domain's intrinsic data.**

The Vegetable Ontology is the **first domain** to document cross-domain participation explicitly in governance (see §9).

---

## 1. Version

| Field | Value |
|-------|-------|
| Domain | Vegetable |
| Governance version | **v1.0.0** |
| JSON `catalog_version` | `1.0.0` |
| `food_ontology_version` (target suite) | `1.2.0` (upon FOOD-05F publication) |
| `platform_version` | `1.0.0` (frozen) |
| `wine_ontology_version` (reference) | `2.0` |
| `ontology_foundation_version` | `1.0.0` |
| Phase | FOOD-05A (governance only) |

### Version streams

| Stream | Meaning |
|--------|---------|
| Platform `1.0.0` | Publication infrastructure — frozen |
| `vegetable-catalog` `1.0.0` | Vegetable domain data contract |
| Food Ontology Suite `1.2.0` | Target suite release when Vegetable publishes (FOOD-05F) |

---

## 2. Architectural Scope

### Allowed artifacts (FOOD-05A only)

| Artifact | Purpose |
|----------|---------|
| `data/vegetable-catalog.json` | Catalog SSOT — schema, metadata, hub entities, empty `vegetables` |
| `docs/VEGETABLE_TAXONOMY_BLUEPRINT.md` | Canonical taxonomy definition |
| `docs/VEGETABLE_GOVERNANCE.md` | This document |

### Explicitly excluded from FOOD-05A

- Runtime artifacts (bootstrap, indexes, graph edges)
- Publication artifacts (HTML, sitemaps, search indexes)
- Generators, validators, certification scripts
- Deployment logic or **any** platform code changes

### Domain contract compliance

| Contract element | Vegetable binding |
|------------------|-------------------|
| Catalog SSOT | `data/vegetable-catalog.json` |
| Three-level hierarchy | `vegetable_category` → `vegetable_group` → `vegetable` |
| Immutable ontology IDs | `food.vegetable.{group}.{slug}` |
| Controlled vocabularies | Frozen in catalog `schema` |
| Relationship placeholders | Empty arrays until FOOD-05D/E |
| Publication | Shared platform + domain config in FOOD-05F |

---

## 3. Canonical Culinary Groups

Vegetable taxonomy is **culinary**, not botanical. This is a deliberate organizing principle aligned with the Wine Folly inspiration poster and PairingMethod's pairing reasoning model.

### Governing concept

**Canonical Culinary Groups** are the authoritative top-level subdivisions of the Vegetable Ontology. They answer: *"How does this ingredient behave in the kitchen and at the table?"* — not *"What is its plant family?"*

Contributors, users, and automated systems will naturally ask why tomatoes appear here as vegetables while potatoes do not. This section is the canonical answer.

| Culinary question | Governance answer |
|-------------------|-------------------|
| Why is tomato a vegetable here? | Poster **Nightshades** row; culinary usage in savory pairings — not botanical fruit/vegetable debate |
| Why are potatoes excluded? | Poster **Starch** row → **Grain & Starch Ontology** (FOOD-08) |
| Why are mushrooms excluded? | Poster **Fungi** row → **Fungi Ontology** (FOOD-06) |
| Why are herbs excluded? | Poster **Herbs & Spices** → **Herb & Spice Ontology** (FOOD-07) |
| What about leafy greens vs stems vs bulbs? | Encoded in intrinsic `plant_part` and group membership — not separate ontology domains in v1 |

### Frozen groups (FOOD-05 v1) — **immutable**

These four **Canonical Culinary Groups** are a **frozen controlled vocabulary**. They must **not** be renamed, merged, split, or supplemented with peer groups in v1 unless a future governance amendment documents a compelling architectural reason and accepts migration cost (ID retirement, publication URL stability, cross-domain edge updates).

| Display name (immutable) | Slug (immutable) | Group ID (immutable) | Poster alignment |
|--------------------------|------------------|----------------------|------------------|
| **Alliums** | `alliums` | `food.vegetable.alliums` | Alliums |
| **Green Vegetables** | `green-vegetables` | `food.vegetable.green-vegetables` | Green Vegetables |
| **Root Vegetables** | `root-vegetables` | `food.vegetable.root-vegetables` | Root Vegetables & Squash |
| **Nightshades** | `nightshades` | `food.vegetable.nightshades` | Nightshades |

**Expansion policy:** Future growth occurs **inside** these groups (new leaf entities), not by adding new peer groups. Navigation, publication URLs, and cross-domain relationships depend on this stability.

Squash and carrot-class roots belong in **Root Vegetables**. Fine-grained splits within a group use intrinsic metadata (`plant_part`, `culinary_role`) — not new hierarchy levels.

### Future culinary parts (informational)

The ontology will eventually reference authoritative entities spanning leafy greens, stems, bulbs, roots, tubers, flowers, pods, and fruit-vegetables — **within** these four groups and via intrinsic `plant_part`, not via additional v1 groups.

---

## 4. Namespace & Identity Model

### Namespace

Reserve: **`food.vegetable.*`**

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.vegetable` | `food.vegetable` |
| Group | `food.vegetable.{group}` | `food.vegetable.nightshades` |
| Vegetable | `food.vegetable.{group}.{slug}` | `food.vegetable.nightshades.tomato` |

Shorthand IDs such as `food.vegetable.tomato` are **not valid**.

### ID encoding principle

Group segments in IDs mirror Protein and Cheese conventions. The four culinary groups are frozen for v1. Reclassification across groups is exceptional and requires ID retirement — same tradeoff documented in Cheese governance.

### Identity contract (every `vegetable` entity)

```json
{
  "id": "",
  "slug": "",
  "display_name": "",
  "scientific_name": "",
  "external_ids": {},
  "catalog_version": "1.0.0",
  "food_ontology_version": "1.2.0"
}
```

### Identity rules

| Field | Rule |
|-------|------|
| `id` | **Immutable.** Never changed. IDs never recycled. |
| `slug` | May change for SEO. Ontology ID unchanged. |
| `display_name` | May change. Editorial/display only. |
| `scientific_name` | **Required.** Primary botanical species for the edible plant — see §6. |
| `external_ids` | **Required object.** May be `{}` when unpopulated. |

---

## 5. Domain Boundaries & Exclusions

### In scope (FOOD-05)

Poster **Vegetable** section only:

- Alliums
- Green Vegetables
- Root Vegetables & Squash (culinary roots; **excluding potato-class starches**)
- Nightshades

### Explicitly out of scope

| Concept | Owner domain | Phase |
|---------|--------------|-------|
| Mushrooms / culinary fungi | Fungi Ontology | FOOD-06 |
| Herbs & spices (basil, pepper, chili) | Herb & Spice Ontology | FOOD-07 |
| Potato, sweet potato, yucca, taro | Grain & Starch Ontology | FOOD-08 |
| Fruits (dessert / sweet context) | Fruit Ontology | FOOD-09 |
| Legumes (beans, peas, lentils) | Legume Ontology | FOOD-11 |
| Sauces & condiments | Sauce & Condiment Ontology | FOOD-13 |

Cross-references to these domains are permitted in editorial layers. Intrinsic duplication is forbidden.

---

## 5.1 Canonical Entity Rule (FOOD-05B+)

Each leaf entity represents a **canonical culinary ingredient** — not every botanical cultivar, color variant, or commercial trade name.

| Include | Do not include (use `aliases` instead) |
|---------|----------------------------------------|
| Garlic | Elephant garlic as separate entity when same culinary role |
| Onion | Red onion, white onion, yellow onion, sweet onion, Vidalia onion |
| Bell pepper | Red bell pepper, orange bell pepper, yellow bell pepper |
| Tomato | Cherry tomato, grape tomato, Roma tomato |

**Variety and color splits** become `aliases`, common names, or editorial references — never new ontology entities. This keeps the catalog compact, stable, and extensible.

**Entity quality over count:** The blueprint target of ~70–120 entities is a planning range, not a quota. A disciplined canonical catalog of 83 entities is preferable to 120 inflated with duplicate varieties.

FOOD-05B catalog audit enforces this rule via slug and display-name heuristics.

---

## 6. Scientific Naming

`scientific_name` stores the **primary botanical species** of the edible plant (e.g. `Solanum lycopersicum` for tomato, `Allium sativum` for garlic).

| Rule | Detail |
|------|--------|
| One canonical entity per culinary ingredient | Cultivar, color, and commercial variety names are **aliases**, not separate entities — see §5.1 |
| Not taxonomy driver | Botanical family informs metadata; **Canonical Culinary Group** drives hierarchy |
| Nullable on hubs | Category and group hubs use `""` |

---

## 7. Intrinsic Metadata (Frozen Vocabulary)

All vocabularies below are frozen in FOOD-05A. New values require a governance amendment and catalog audit update.

### Required fields (every `vegetable` entity)

| Field | Purpose |
|-------|---------|
| `culinary_group` | Aligns to immutable Canonical Culinary Group |
| `culinary_role` | Primary culinary function in pairing context — see §7.1 |
| `plant_part` | Edible structure — see catalog `schema.controlled_vocabularies.plant_part` |
| `flavor_intensity` | Overall intensity: `mild` · `moderate` · `bold` · `pungent` |
| `texture` | `crisp` · `tender` · `fibrous` · `succulent` · `dense` · `leafy` |
| `moisture_class` | `high` · `medium` · `low` |
| `seasonality` | `spring` · `summer` · `fall` · `winter` · `year_round` · `mixed` |
| `origin_context` | Nullable ISO region hint or `""` for global staples |

### Optional fields (schema reserved — FOOD-05B)

| Field | Purpose |
|-------|---------|
| `flavor_profile` | Array of flavor characteristic tags — see §7.2. **Vocabulary frozen; do not populate in FOOD-05B.** |

### §7.1 `culinary_role` (required)

Intrinsic culinary function — **not** Pairing Engine reasoning. Supports search, publication filtering, and future ENGINE milestones.

| Value | Typical use |
|-------|-------------|
| `primary` | Plate-center or bulk vegetable |
| `aromatic` | Flavor base (garlic, onion) |
| `leafy` | Leaf-dominant greens |
| `cruciferous` | Brassica-family green character |
| `root` | Underground root crops |
| `fruit_vegetable` | Botanic fruit, culinary vegetable (tomato, eggplant) |
| `bulb` | Bulb structures (onion, fennel bulb) |
| `stem` | Stalk/stem crops (celery, asparagus) |
| `flower` | Flower-head vegetables (cauliflower, broccoli florets) |
| `pod` | Podded vegetables (green bean, pea pod) |

FOOD-05B may populate a subset while the vocabulary remains fully frozen.

### §7.2 `flavor_profile` (reserved vocabulary)

Array field on each `vegetable` entity. Controlled values (multi-select):

`sweet` · `earthy` · `bitter` · `peppery` · `sulfurous` · `grassy` · `vegetal` · `nutty` · `umami` · `pungent`

| Rule | Detail |
|------|--------|
| FOOD-05B | Leave `flavor_profile: []` on all entities — vocabulary only |
| FOOD-05C+ | Population permitted when curation standards exist |
| Cross-domain | Same vocabulary pattern will extend to future food domains |

This prevents schema revision when the Pairing Engine begins using flavor characteristics.

---

## 8. Relationship Placeholders

All relationship arrays **present and empty** (`[]`) until FOOD-05D/E:

| Array | Layer |
|-------|-------|
| `typical_descriptors` | Editorial / descriptor refs |
| `similar_vegetables` | Editorial `similar_to` |
| `substitutions` | Editorial `substitutes_for` |
| `commonly_served_with` | Editorial cross-domain (Protein, Cheese, Sauce IDs) |
| `wine_pairings` | Wine pairing (FOOD-05E) |
| `avoid_wine_pairings` | Wine pairing |
| `related_styles` | Wine pairing |
| `related_descriptors` | Wine pairing |
| `related_techniques` | Wine pairing |
| `common_preparations` | Cross-domain prep refs |

---

## 9. Cross-Domain Reference Policy

The Vegetable Ontology **does not own** relationships to other domains. It **participates** in them through canonical IDs at the editorial and pairing layers.

### Example: Garlic (`food.vegetable.alliums.garlic`)

| Target domain | Relationship types (FOOD-05D/E) | Vegetable owns intrinsic? |
|---------------|----------------------------------|---------------------------|
| Herbs & Spice | None in v1 (garlic is intrinsic here) | Yes — allium identity |
| Protein | `commonly_served_with` → `food.protein.*` | No — edge only |
| Cheese | `commonly_served_with` → `food.cheese.*` | No — edge only |
| Wine | `pairs_with_style`, `pairs_with_descriptor`, … | No — edge only |
| Sauces | `commonly_served_with` → future `food.sauce.*` | No — edge only |

### Rules

1. **Forward references** to not-yet-published domains are allowed in editorial edges (same pattern as Cheese → `food.fruit.*`).
2. **Never embed** another domain's intrinsic fields on a vegetable entity.
3. **Never duplicate** protein, cheese, or herb entities inside the vegetable catalog.
4. Structural edges (`belongs_to_group`, `belongs_to_category`) remain **intra-domain only**.

---

## 10. Frozen Suite Expansion Order

Post–v1.1.0 domain sequence (ontology expansion only — platform frozen):

| Phase | Ontology |
|-------|----------|
| FOOD-05 | **Vegetable Ontology** ← current |
| FOOD-06 | Fungi Ontology |
| FOOD-07 | Herb & Spice Ontology |
| FOOD-08 | Grain & Starch Ontology |
| FOOD-09 | Fruit Ontology |
| FOOD-10 | Nut & Seed Ontology |
| FOOD-11 | Legume Ontology |
| FOOD-12 | Sweet Flavor Ontology |
| FOOD-13 | Sauce & Condiment Ontology |
| FOOD-14 | Protein Refinement |
| ENGINE-01 | Pairing Engine |
| ENGINE-02 | Weighting Engine |
| ENGINE-03 | Meal Composer |

Ontology completeness precedes inference investment. ENGINE milestones consume certified ontology data — they never become ontology domains.

---

## 11. Milestone Lifecycle (FOOD-05)

| Milestone | Scope |
|-----------|-------|
| **FOOD-05A** | Governance (this document) — **frozen** |
| **FOOD-05B** | Catalog population — **complete** |
| **FOOD-05C** | Runtime compilation & structural relationships — **current** |
| FOOD-05D | Editorial relationships |
| FOOD-05E | Wine pairing relationships |
| FOOD-05F | Publication through shared platform |

---

## 11.1 Runtime Stability Levels (FOOD-05C)

The vegetable runtime explicitly distinguishes three relationship classes. FOOD-05C generates **Level 1 and Level 2 only**.

### Level 1 — Structural (deterministic)

Generated solely from catalog hierarchy. Reproducible from intrinsic catalog data alone.

| Relationship | Direction |
|--------------|-----------|
| `belongs_to_group` | vegetable → group |
| `belongs_to_category` | vegetable / group → category |
| `group_contains` | group → vegetable |
| `category_contains` | category → group |

### Level 2 — Intrinsic similarity (deterministic)

Generated from shared intrinsic metadata. No editorial judgment.

| Relationship | Source field |
|--------------|--------------|
| `shares_culinary_role` | `culinary_role` |
| `shares_plant_part` | `plant_part` |
| `shares_texture` | `texture` |
| `shares_moisture_class` | `moisture_class` |
| `shares_flavor_intensity` | `flavor_intensity` |
| `shares_seasonality` | `seasonality` |
| `shares_scientific_name` | `scientific_name` |
| `shares_flavor_profile` | `flavor_profile` *(reserved — not generated until populated post-FOOD-05B)* |

`shares_culinary_role` receives first-class treatment because `culinary_role` is a governed intrinsic attribute (e.g. garlic ↔ onion ↔ shallot as `aromatic`; broccoli ↔ cauliflower as `cruciferous`).

### Level 3 — Editorial (FOOD-05D+)

**Not generated in FOOD-05C.** Requires human curation.

| Relationship | Layer |
|--------------|-------|
| `similar_to` | Editorial |
| `substitutes_for` | Editorial |
| `commonly_served_with` | Editorial cross-domain |

### Runtime rule

FOOD-05C consumes **intrinsic catalog data only**. It must never infer substitutions, recipes, preparation techniques, wine pairings, or nutritional equivalence.

---

## 12. Success Criterion

Each FOOD-05 milestone succeeds when it adds **authoritative culinary knowledge** to the suite while leaving **Platform v1.0.0 unchanged**.

Guiding question (from PLAN-01):

> Does this increase the Food Ontology Suite's coverage of the knowledge represented by the poster, or extend it beyond what a static poster can do?

---

## 13. Approval Gate

| Gate | Requirement |
|------|-------------|
| FOOD-05A → FOOD-05B | Governance frozen; catalog shell validated; no platform diff |
| FOOD-05B → FOOD-05C | Catalog audit PASS |
| FOOD-05F → Suite v1.2.0 | Publication + release certification PASS for Vegetable domain |

**Next step:** FOOD-05B — Vegetable catalog population (upon approval).
