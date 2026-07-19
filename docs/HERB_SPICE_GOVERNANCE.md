# FOOD-07A — Herb & Spice Ontology Governance

**Phase:** FOOD-07A — Herb & Spice Ontology Governance  
**Freeze Date:** July 19, 2026  
**Status:** **Herb & Spice Governance Frozen v1.0.0**  
**SSOT:** [`data/herb-spice-catalog.json`](../data/herb-spice-catalog.json)  
**Taxonomy:** [`HERB_SPICE_TAXONOMY_BLUEPRINT.md`](HERB_SPICE_TAXONOMY_BLUEPRINT.md)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)  
**Platform:** Food Ontology Platform v1.0.0 (frozen — domain contract only)  
**Suite baseline:** Food Ontology Suite v1.3.0 · tag `food-ontology-suite-v1.3.0`

---

## Executive Summary

PairingMethod declares **Herb & Spice Ontology Governance v1.0.0** — the authoritative governance layer for the **Herb & Spice Ontology** within Food Ontology Suite expansion toward v1.4.0.

This domain is **not** a botanical reference. It is the authoritative ontology for **culinary herbs and culinary spices** — ingredients used worldwide in cooking. The project models **ingredients**, not botanical specimens, medicinal products, or ornamental plants.

FOOD-07 is the **first ontology that intentionally combines two closely related culinary domains** (herbs and spices) under one governance contract. Groups encode **culinary usage form** (fresh, dried, whole, ground/blended), not plant taxonomy.

This milestone establishes the canonical catalog shell, **Canonical Culinary Groups**, immutable identity rules, the intrinsic attribute `usage_intensity`, controlled vocabularies, cross-domain reference policy, and the **Botanical Ownership Rule** — a domain-specific clarification for when culinary identity diverges from botanical identity. **No herb or spice entities exist yet.** No runtime artifacts, publication artifacts, or platform changes are created in this phase.

Herb & Spice is the **fifth consumer** of the multi-domain publication platform (after Protein Foods, Cheeses, Vegetables, and Fungi). Publication reuses the shared platform via domain configuration in FOOD-07F — no platform modifications.

**Governance status:** Frozen. Entity population begins only after explicit approval to proceed with FOOD-07B.

---

## Domain Independence Principle

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — Domain Independence Principle.

Every new ontology domain is evaluated against four questions **before implementation**. This principle is operational from FOOD-05 onward and complements PLAN-01 governance rules. **No modifications in FOOD-07A.**

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

---

## 1. Version

| Field | Value |
|-------|-------|
| Domain | Herb & Spice (culinary herbs and spices) |
| Governance version | **v1.0.0** |
| JSON `catalog_version` | `1.0.0` |
| `food_ontology_version` (target suite) | `1.4.0` (upon FOOD-07F publication) |
| `platform_version` | `1.0.0` (frozen) |
| `wine_ontology_version` (reference) | `2.0` |
| `ontology_foundation_version` | `1.0.0` |
| Phase | FOOD-07A (governance only) |

### Version streams

| Stream | Meaning |
|--------|---------|
| Platform `1.0.0` | Publication infrastructure — frozen |
| `herb-spice-catalog` `1.0.0` | Herb & Spice domain data contract |
| Food Ontology Suite `1.4.0` | Target suite release when Herb & Spice publishes (FOOD-07F) |

---

## 2. Architectural Scope

### Allowed artifacts (FOOD-07A only)

| Artifact | Purpose |
|----------|---------|
| `data/herb-spice-catalog.json` | Catalog SSOT — schema, metadata, hub entities, empty `herb_spices` |
| `docs/HERB_SPICE_TAXONOMY_BLUEPRINT.md` | Canonical taxonomy definition |
| `docs/HERB_SPICE_GOVERNANCE.md` | This document |

### Explicitly excluded from FOOD-07A

- Runtime artifacts (bootstrap, indexes, graph edges)
- Publication artifacts (HTML, sitemaps, search indexes)
- Generators, validators, certification scripts
- Deployment logic or **any** platform code changes
- Editorial relationships (FOOD-07D)
- Wine pairings (FOOD-07E)
- Catalog population (FOOD-07B)

### Domain contract compliance

| Contract element | Herb & Spice binding |
|------------------|----------------------|
| Catalog SSOT | `data/herb-spice-catalog.json` |
| Three-level hierarchy | `herb_spice_category` → `herb_spice_group` → `herb_spice` |
| Immutable ontology IDs | `food.herb.{group}.{slug}` |
| Controlled vocabularies | Frozen in catalog `schema` |
| Relationship placeholders | Empty arrays until FOOD-07D/E |
| Publication | Shared platform + domain config in FOOD-07F |

---

## 3. Canonical Culinary Groups

Herb & Spice taxonomy is **culinary**, not botanical. Groups answer *"How is this ingredient used in the kitchen?"* — not *"What is its plant family?"*

Unlike Vegetables (poster-aligned rows), Herb & Spice groups encode **culinary usage form**: fresh leaf, dried leaf, whole spice, or ground/blended spice.

### Frozen groups (FOOD-07 v1) — **immutable**

These four **Canonical Culinary Groups** are a **frozen controlled vocabulary**. Display names, slugs, and group IDs must **not** be renamed, merged, split, or supplemented with peer groups in v1 unless a future governance amendment documents a compelling architectural reason and accepts migration cost.

| Display name (immutable) | Slug (immutable) | Group ID (immutable) | `culinary_group` |
|--------------------------|------------------|----------------------|------------------|
| **Fresh Herbs** | `fresh-herbs` | `food.herb.fresh-herbs` | `fresh_herbs` |
| **Dried Herbs** | `dried-herbs` | `food.herb.dried-herbs` | `dried_herbs` |
| **Whole Spices** | `whole-spices` | `food.herb.whole-spices` | `whole_spices` |
| **Ground & Blended Spices** | `ground-blended-spices` | `food.herb.ground-blended-spices` | `ground_blended_spices` |

**Expansion policy:** Future growth occurs **inside** these groups (new leaf entities), not by adding new peer groups.

The same botanical species may appear in **more than one group** when culinary usage form genuinely diverges (for example, fresh cilantro leaf vs coriander seed) — see §10 Botanical Ownership Rule.

---

## 4. Namespace & Identity Model

### Namespace

Reserve: **`food.herb.*`**

This namespace aligns with existing suite forward references (`food.herb.basil`, `food.herb.thyme`, etc.) in Vegetable and Fungi editorial layers. No ID migration is required when FOOD-07 publishes.

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.herb` | `food.herb` |
| Group | `food.herb.{group}` | `food.herb.whole-spices` |
| Herb / Spice | `food.herb.{group}.{slug}` | `food.herb.whole-spices.black-pepper` |

Shorthand IDs such as `food.herb.basil` (without group segment) are **not valid**.

### Identity contract (every `herb_spice` entity)

Governance requires these identity and intrinsic fields (catalog uses `id` as canonical ID):

```json
{
  "id": "",
  "slug": "",
  "display_name": "",
  "scientific_name": "",
  "parent_group": "",
  "parent_category": "herb",
  "culinary_group": "",
  "usage_intensity": "",
  "aliases": [],
  "common_names": [],
  "external_ids": {},
  "catalog_version": "1.0.0",
  "food_ontology_version": "1.4.0"
}
```

### Identity rules

| Field | Rule |
|-------|------|
| `id` | **Immutable canonical ID.** Never changed. IDs never recycled. |
| `slug` | May change for SEO. Ontology ID unchanged. |
| `display_name` | May change. Editorial/display only. |
| `scientific_name` | **Required.** Primary botanical species for culinary identity — see §6. |
| `parent_group` | Required — group slug |
| `parent_category` | Required — always `herb` |
| `external_ids` | **Required object.** May be `{}` when unpopulated. |

---

## 5. Domain Boundaries & Exclusions

### In scope

- Globally recognized **culinary herbs**
- Globally recognized **culinary spices**
- Widely used **spice blends** where the blend itself is a canonical ingredient (e.g. Garam Masala, Chinese Five Spice, Herbes de Provence)

### Explicitly out of scope

| Concept | Rationale |
|---------|-----------|
| Botanical taxonomy | Not pairing-relevant; `scientific_name` for identity only |
| Medicinal-only botanicals | Not culinary ingredient ontology |
| Teas | Beverage domain — not savory herb/spice ingredient scope |
| Dietary supplements | Not culinary ingredient ontology |
| Extracts and essential oils | Processing products — not whole herb/spice ingredients |
| Ornamental plants | Not culinary ingredients |

### Routed to other domains

| Concept | Owner domain | Phase |
|---------|--------------|-------|
| Vegetables (alliums, mustard greens, fennel bulb) | Vegetable Ontology | FOOD-05 |
| Fungi | Fungi Ontology | FOOD-06 |
| Nuts & seeds (as poster row) | Nut & Seed Ontology | FOOD-10 |
| Legumes | Legume Ontology | FOOD-11 |
| Sauces & condiments | Sauce & Condiment Ontology | FOOD-13 |
| Hot sauces and prepared condiments | Sauce & Condiment Ontology | FOOD-13 |

Cross-references to these domains are permitted in editorial layers. Intrinsic duplication is forbidden.

---

## 5.1 Canonical Entity Rule — CANON-001

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — CANON-001.

Each leaf entity represents a **canonical culinary ingredient** — not every regional trade name, preparation form, or grind size.

| Canonical entity | Aliases only (not separate entities) |
|------------------|--------------------------------------|
| Basil | Sweet Basil, Garden Basil |
| Cinnamon | Ceylon Cinnamon, Cassia Cinnamon (when same canonical culinary role) |
| Black Pepper | Tellicherry Pepper, Malabar Pepper |
| Paprika | Sweet Paprika, Hot Paprika (when governed as aliases on Paprika) |
| Garam Masala | — (blend is the canonical entity) |

| Preparation variants — aliases, not entities |
|---------------------------------------------|
| Ground Black Pepper → alias on Black Pepper |
| Ground Cinnamon → alias on Cinnamon (when same culinary identity) |

**Distinct culinary identities** may be separate canonical entities when kitchen behavior, usage form, and pairing context genuinely diverge — governed in FOOD-07B curation, not by commercial labeling alone. See §10 for botanical-form decisions frozen at governance.

**Entity quality over count:** The blueprint target of **80–120** entities is a planning range, not a quota.

FOOD-07B catalog audit enforces CANON-001 via slug and display-name heuristics.

### §5.2 CANON-002 — Global culinary recognition (FOOD-07B+)

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — CANON-002.

Each canonical herb or spice must represent a **globally recognizable culinary ingredient**, not merely a regional commercial product.

| Include | Do not include |
|---------|----------------|
| Thyme | Single-farm cultivar as separate entity |
| Turmeric | Regional powder grade as separate entity (alias on Turmeric) |
| Saffron | Kashmiri Saffron as separate entity when same culinary role (alias on Saffron) |

FOOD-07B catalog audit enforces CANON-002 via regional slug heuristics and minimum summary quality.

---

## 6. Scientific Naming

`scientific_name` stores the **primary botanical species** associated with the canonical culinary ingredient (e.g. `Ocimum basilicum` for basil, `Piper nigrum` for black pepper).

| Rule | Detail |
|------|--------|
| One canonical entity per culinary ingredient | Regional names and grind sizes are **aliases**, not separate entities — see §5.1 |
| Not taxonomy driver | Botanical family informs metadata; **Canonical Culinary Group** drives hierarchy |
| Nullable on hubs | Category and group hubs use `""` |
| Same species, different culinary forms | May map to **separate entities** when §10 Botanical Ownership Rule applies |

---

## 7. Intrinsic Metadata (Frozen Vocabulary)

All vocabularies below are frozen in FOOD-07A. New values require a governance amendment and catalog audit update.

### Required fields (every `herb_spice` entity)

| Field | Purpose |
|-------|---------|
| `culinary_group` | Aligns to immutable Canonical Culinary Group |
| `usage_intensity` | Culinary prominence in dish composition — see §7.1 |
| `parent_group` | Group slug — required |
| `parent_category` | Category slug — always `herb` |
| `aliases` | Trade names, regional variants — array, may be `[]` |
| `common_names` | Common culinary names — array, may be `[]` |
| `origin_context` | Nullable ISO region hint or `""` for global staples |

**No editorial content** in FOOD-07B catalog entities.

### Reserved fields (schema frozen — empty in FOOD-07B)

| Field | Purpose |
|-------|---------|
| `flavor_profile` | Array — vocabulary frozen; **`[]` only in FOOD-07B** |
| `texture_profile` | Array — vocabulary frozen; **`[]` only in FOOD-07B** |
| `aroma_profile` | Array — vocabulary frozen; **`[]` only in FOOD-07B** |

Same reservation pattern as Vegetable and Fungi ontologies.

### §7.1 `usage_intensity` (required)

Culinary prominence in dish composition — **intrinsic only**. Never inferred from price, rarity, or pairing data.

| Value | Meaning | Examples |
|-------|---------|----------|
| `primary` | Defining flavor in dish composition | Basil in pesto; cumin in curry base |
| `accent` | Supporting aroma, heat, or seasoning | Thyme; black pepper; oregano |
| `luxury` | Rare, high-cost, pairing-defining | Saffron; vanilla bean (if in scope) |

Controlled vocabulary is **immutable** — reuse suite values `primary` · `accent` · `luxury` unchanged. No new values.

---

## 8. Relationship Placeholders

All relationship arrays **present and empty** (`[]`) until FOOD-07D/E:

| Array | Layer |
|-------|-------|
| `typical_descriptors` | Editorial / descriptor refs |
| `similar_herb_spices` | Editorial `similar_to` |
| `substitutions` | Editorial `substitutes_for` |
| `commonly_served_with` | Editorial cross-domain |
| `wine_pairings` | Wine pairing (FOOD-07E) |
| `avoid_wine_pairings` | Wine pairing |
| `related_styles` | Wine pairing |
| `related_descriptors` | Wine pairing |
| `related_techniques` | Wine pairing |
| `common_preparations` | Cross-domain prep refs |

---

## 9. Cross-Domain Reference Policy

The Herb & Spice Ontology **does not own** relationships to other domains. It **participates** in them through canonical IDs at the editorial and pairing layers.

### Example: Basil (`food.herb.fresh-herbs.basil`)

| Target domain | Relationship types (FOOD-07D/E) | Herb & Spice owns intrinsic? |
|---------------|----------------------------------|------------------------------|
| Vegetables | `commonly_served_with` → `food.vegetable.*` | No — edge only |
| Protein | `commonly_served_with` → `food.protein.*` | No — edge only |
| Cheese | `commonly_served_with` → `food.cheese.*` | No — edge only |
| Fungi | `commonly_served_with` → `food.fungi.*` | No — edge only |
| Wine | `pairs_with_style`, `pairs_with_descriptor`, … | No — edge only |

### Rules

1. **Forward references** to any published or unpublished domain are allowed in editorial edges (ID-only).
2. **Never embed** another domain's intrinsic fields on a herb/spice entity.
3. **Never duplicate** vegetable, protein, cheese, or fungi entities inside the herb-spice catalog.
4. Structural edges (`belongs_to_group`, `belongs_to_category`) remain **intra-domain only**.

---

## 10. Botanical Ownership Rule

This rule is **unique to the Herb & Spice Ontology** and frozen in FOOD-07A. It governs when the same plant produces multiple culinary ingredients that may diverge in identity from botanical identity.

### Decision principle

When the same botanical species (or closely related cultivars) appears in multiple culinary forms, governance decides whether they are:

1. **One canonical entity with aliases** — same culinary identity across forms, or preparation variants only; or  
2. **Separate canonical culinary ingredients** — distinct culinary identity, aroma, usage, and pairing context.

The decision is based on **culinary identity**, not botanical identity. Once frozen in catalog population, the decision is **immutable**.

### Decision criteria

| Signal | Favor separate entities | Favor one entity + aliases |
|--------|-------------------------|------------------------------|
| Flavor/aroma profile | Materially different (leaf vs seed) | Same character, different grind |
| Typical usage | Different dish roles | Same role, different preparation |
| Market identity | Distinct ingredient SKUs globally | Trade names for same ingredient |
| Pairing context | Divergent wine pairing rationale | Preparation variant only |

### Frozen governance decisions (FOOD-07A)

These decisions apply before FOOD-07B catalog population and must not be reversed without a governance amendment:

| Botanical context | Culinary forms | Governance decision | Canonical owner |
|-------------------|----------------|---------------------|-----------------|
| *Coriandrum sativum* | Leaf (cilantro) vs seed (coriander) | **Separate entities** — distinct aroma, usage, pairing | Cilantro → Fresh Herbs; Coriander → Whole Spices |
| *Anethum graveolens* | Leaf vs seed | **Separate entities** | Dill → Fresh Herbs; Dill Seed → Whole Spices |
| *Brassica juncea* / mustard | Leaf vs seed | **Separate ownership across domains** | Mustard Greens → Vegetable Ontology (FOOD-05); Mustard Seed → Whole Spices |
| *Foeniculum vulgare* | Bulb vs seed | **Separate ownership across domains** | Fennel Bulb → Vegetable Ontology; Fennel Seed → Whole Spices |
| *Piper nigrum* | Whole vs ground pepper | **One entity** — Black Pepper in Whole Spices; Ground Black Pepper as alias | Whole Spices |
| *Cinnamomum* spp. | Stick vs ground | **One entity per canonical cinnamon** — regional types as aliases unless culinary identity diverges | Whole Spices or Ground & Blended per primary market form |

### Cross-domain boundary

When a plant part is canonically owned by another ontology (mustard greens, fennel bulb, garlic, onion), the Herb & Spice Ontology **must not** duplicate that entity. Cross-domain editorial edges reference the owning domain's canonical ID.

---

## 11. Runtime Principles

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Runtime Projection Principle, §Knowledge layer separation, and §Runtime stability levels.

FOOD-07C will follow the same three-level runtime model established by Protein, Vegetable, and Fungi — structural edges from hierarchy, intrinsic similarity from governed metadata, editorial edges deferred to FOOD-07D. **No changes to suite runtime principles in FOOD-07A.**

---

## 12. Lifecycle

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) and prior domain governance (FOOD-04 through FOOD-06).

The standard **six-phase ontology lifecycle** applies unchanged:

| Phase | FOOD-07 milestone |
|-------|-------------------|
| A | Governance (this document) — **frozen** |
| B | Catalog population |
| C | Runtime compilation & structural relationships |
| D | Editorial relationships |
| E | Wine pairing relationships |
| F | Publication through shared platform |

Suite target **v1.4.0** tags upon FOOD-07F publication.

---

## 13. FOOD-07B Targets (blueprint only)

| Target | Range |
|--------|------:|
| Total canonical herbs & spices | **80–120** |
| Fresh Herbs | 20–35 |
| Dried Herbs | 15–25 |
| Whole Spices | 20–30 |
| Ground & Blended Spices | 25–35 |

Coverage prioritizes **global culinary significance** over exhaustive regional variants.

---

## 14. Success Criteria

FOOD-07A succeeds when:

1. `data/herb-spice-catalog.json` exists with frozen schema, four hub groups, empty `herb_spices`, and governance metadata.
2. This document and [`HERB_SPICE_TAXONOMY_BLUEPRINT.md`](HERB_SPICE_TAXONOMY_BLUEPRINT.md) are approved and frozen.
3. Four Canonical Culinary Groups are immutable in catalog `schema.controlled_vocabularies`.
4. `usage_intensity` reuses suite vocabulary unchanged (`primary` · `accent` · `luxury`).
5. Reserved intrinsic arrays (`flavor_profile`, `texture_profile`, `aroma_profile`) are schema-frozen and empty until post-FOOD-07B enrichment.
6. Botanical Ownership Rule decisions are documented and frozen (§10).
7. No runtime, editorial, wine, publication, or platform artifacts exist.

---

## 15. Approval

| Role | Status | Date |
|------|--------|------|
| Governance freeze | **Approved** | 2026-07-19 |
| FOOD-07B catalog population | Pending explicit approval | — |

**Next milestone:** FOOD-07B — Populate Herb & Spice Ontology catalog (~80–120 canonical entities).
