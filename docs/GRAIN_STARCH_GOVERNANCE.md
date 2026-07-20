# FOOD-08A — Grain & Starch Ontology Governance

**Phase:** FOOD-08A — Grain & Starch Ontology Governance  
**Freeze Date:** July 19, 2026  
**Status:** **Grain & Starch Governance Frozen v1.0.0**  
**SSOT:** [`data/grain-starch-catalog.json`](../data/grain-starch-catalog.json)  
**Taxonomy:** [`GRAIN_STARCH_TAXONOMY_BLUEPRINT.md`](GRAIN_STARCH_TAXONOMY_BLUEPRINT.md)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)  
**Platform:** Food Ontology Platform v1.0.0 (frozen — domain contract only)  
**Suite baseline:** Food Ontology Suite v1.4.0 · tag `food-ontology-suite-v1.4.0`

---

## Executive Summary

PairingMethod declares **Grain & Starch Ontology Governance v1.0.0** — the authoritative governance layer for the **Grain & Starch Ontology** within Food Ontology Suite expansion toward v1.5.0.

This domain is **not** crop science, agricultural taxonomy, or milling technology. It is the authoritative ontology for **culinary grains, pseudocereals, starches, and staple grain-derived ingredients** used worldwide in cooking. The project models **ingredients**, not prepared foods, commercial brands, or beverage products.

FOOD-08 is the **first ontology where processing level can fundamentally change culinary identity**. Groups encode **culinary identity and processing level** (whole grain, pseudocereal, processed grain form, isolated starch) — not botanical family alone.

This milestone establishes the canonical catalog shell, **Canonical Culinary Groups**, immutable identity rules, the intrinsic attribute `usage_intensity`, controlled vocabularies, cross-domain reference policy, and the **Processing Ownership Rule (PROC-001)** — a suite-level governance rule introduced here for consistent processing decisions across all future domains.

**No grain or starch entities exist yet.** No runtime artifacts, publication artifacts, or platform changes are created in this phase.

Grain & Starch will be the **sixth consumer** of the multi-domain publication platform. Publication will reuse the shared platform via domain configuration in FOOD-08F — no platform modifications.

**Governance status:** Frozen. Entity population begins only after explicit approval to proceed with FOOD-08B.

---

## Domain Independence Principle

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — Domain Independence Principle.

Every new ontology domain is evaluated against four questions **before implementation**. **No modifications in FOOD-08A.**

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
| Domain | Grain & Starch (culinary grains, pseudocereals, starches, staple grain forms) |
| Governance version | **v1.0.0** |
| JSON `catalog_version` | `1.0.0` |
| `food_ontology_version` (target suite) | `1.5.0` (upon FOOD-08F publication) |
| `platform_version` | `1.0.0` (frozen) |
| `wine_ontology_version` (reference) | `2.0` |
| `ontology_foundation_version` | `1.0.0` |
| Phase | FOOD-08A (governance only) |

### Version streams

| Stream | Meaning |
|--------|---------|
| Platform `1.0.0` | Publication infrastructure — frozen |
| `grain-starch-catalog` `1.0.0` | Grain & Starch domain data contract |
| Food Ontology Suite `1.5.0` | Target suite release when Grain & Starch publishes (FOOD-08F) |

---

## 2. Architectural Scope

### Allowed artifacts (FOOD-08A only)

| Artifact | Purpose |
|----------|---------|
| `data/grain-starch-catalog.json` | Catalog SSOT — schema, metadata, hub entities, empty `grain_starches` |
| `docs/GRAIN_STARCH_TAXONOMY_BLUEPRINT.md` | Canonical taxonomy definition |
| `docs/GRAIN_STARCH_GOVERNANCE.md` | This document |

### Explicitly excluded from FOOD-08A

- Runtime artifacts (bootstrap, indexes, graph edges)
- Publication artifacts (HTML, sitemaps, search indexes)
- Generators, validators, certification scripts
- Deployment logic or **any** platform code changes
- Editorial relationships (FOOD-08D)
- Wine pairings (FOOD-08E)
- Catalog population (FOOD-08B)

### Domain contract compliance

| Contract element | Grain & Starch binding |
|------------------|------------------------|
| Catalog SSOT | `data/grain-starch-catalog.json` |
| Three-level hierarchy | `grain_starch_category` → `grain_starch_group` → `grain_starch` |
| Immutable ontology IDs | `food.grain.{group}.{slug}` |
| Controlled vocabularies | Frozen in catalog `schema` |
| Relationship placeholders | Empty arrays until FOOD-08D/E |
| Publication | Shared platform + domain config in FOOD-08F |

---

## 3. Canonical Culinary Groups

Grain & Starch taxonomy is **culinary**, not botanical. Groups answer *"What is this ingredient's culinary identity and processing level?"* — not *"What is its crop family?"*

### Frozen groups (FOOD-08 v1) — **immutable**

These four **Canonical Culinary Groups** are a **frozen controlled vocabulary**. Display names, slugs, and group IDs must **not** be renamed, merged, split, or supplemented with peer groups in v1 unless a future governance amendment documents a compelling architectural reason and accepts migration cost.

| Display name (immutable) | Slug (immutable) | Group ID (immutable) | `culinary_group` |
|--------------------------|------------------|----------------------|------------------|
| **Whole Grains** | `whole-grains` | `food.grain.whole-grains` | `whole_grains` |
| **Pseudocereals** | `pseudocereals` | `food.grain.pseudocereals` | `pseudocereals` |
| **Processed Grains** | `processed-grains` | `food.grain.processed-grains` | `processed_grains` |
| **Starches** | `starches` | `food.grain.starches` | `starches` |

**Expansion policy:** Future growth occurs **inside** these groups (new leaf entities), not by adding new peer groups.

The same botanical species may appear in **more than one group** when culinary processing creates a genuinely distinct ingredient (for example, whole rice vs rice flour) — see §9 Processing Ownership Rule (PROC-001).

---

## 4. Namespace & Identity Model

### Namespace

Reserve: **`food.grain.*`**

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.grain` | `food.grain` |
| Group | `food.grain.{group}` | `food.grain.whole-grains` |
| Grain / Starch | `food.grain.{group}.{slug}` | `food.grain.whole-grains.rice` |

Shorthand IDs such as `food.grain.rice` (without group segment) are **not valid**.

### Identity contract (every `grain_starch` entity)

Governance requires these identity and intrinsic fields (catalog uses `id` as canonical ID):

```json
{
  "id": "",
  "slug": "",
  "display_name": "",
  "scientific_name": "",
  "parent_group": "",
  "parent_category": "grain-starch",
  "culinary_group": "",
  "usage_intensity": "",
  "aliases": [],
  "common_names": [],
  "external_ids": {},
  "catalog_version": "1.0.0",
  "food_ontology_version": "1.5.0"
}
```

### Identity rules

| Field | Rule |
|-------|------|
| `id` | **Immutable canonical ID.** Never changed. IDs never recycled. |
| `slug` | May change for SEO. Ontology ID unchanged. |
| `display_name` | May change. Editorial/display only. |
| `scientific_name` | **Required.** Primary botanical species or `Multiple species` for blends — see §6. |
| `parent_group` | Required — group slug |
| `parent_category` | Required — always `grain-starch` |
| `external_ids` | **Required object.** May be `{}` when unpopulated. |

---

## 5. Domain Boundaries & Exclusions

### In scope

- Globally recognized **cereal grains** (rice, wheat, barley, rye, oats, corn, millet, sorghum, etc.)
- **Pseudocereals** used as staple grains (quinoa, buckwheat, amaranth, etc.)
- **Culinary starches** as canonical ingredients (cornstarch, potato starch, tapioca starch, etc.)
- **Staple grain-derived ingredients** where the processed form is a canonical culinary ingredient (wheat flour, rice flour, cornmeal, polenta meal when governed as ingredient not dish)
- **Flours** that function as canonical culinary ingredients — not every commercial milling SKU

### Explicitly out of scope

| Concept | Rationale |
|---------|-----------|
| Crop science / agricultural varieties | Not culinary ingredient ontology |
| Milling technology and equipment | Not ingredient scope |
| Commercial brands and product lines | Use `aliases` on canonical entities |
| **Breads** | Prepared food — outside ingredient ontology |
| **Noodles and pasta** | Prepared food — outside ingredient ontology |
| **Breakfast cereals** | Prepared/processed food product |
| **Pastries and baked goods** | Prepared food |
| **Beer and distilled spirits** | Beverage domain — not savory staple ingredient scope |
| **Prepared dishes** | Ontology models ingredients, not recipes |

### Routed to other domains

| Concept | Owner domain | Phase |
|---------|--------------|-------|
| Potato (whole tuber) | Vegetable Ontology | FOOD-05 |
| Sweet corn (fresh vegetable use) | Vegetable Ontology | FOOD-05 (when governed) |
| Mustard seed | Herb & Spice Ontology | FOOD-07 |
| Soybean | Legume Ontology | FOOD-11 |
| Nuts & seeds (non-staple poster row) | Nut & Seed Ontology | FOOD-10 |
| Sauces and condiments | Sauce & Condiment Ontology | FOOD-13 |
| Protein foods | Protein Foods Ontology | FOOD-01 / FOOD-14 |

Cross-references to these domains are permitted in editorial layers. Intrinsic duplication is forbidden.

---

## 5.1 Canonical Entity Rule — CANON-001

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — CANON-001.

Each leaf entity represents a **canonical culinary ingredient** — not every regional trade name, mill extraction grade, or commercial flour blend unless kitchen behavior genuinely diverges.

| Canonical entity | Aliases only (not separate entities) |
|------------------|--------------------------------------|
| Rice | Long-Grain Rice, Short-Grain Rice, Jasmine Rice (when same canonical culinary role) |
| Wheat | Hard Red Wheat, Soft White Wheat (when governed as aliases on Wheat) |
| Oats | Rolled Oats, Quick Oats, Instant Oats (preparation states — alias unless PROC-001 assigns separate identity) |
| Wheat Flour | Bread Flour, Cake Flour, All-Purpose Flour (aliases **unless** FOOD-08B governance curation determines distinct canonical culinary identities) |
| Cornstarch | Corn Starch, Maize Starch |

**Entity quality over count:** The blueprint target of **70–100** entities is a planning range, not a quota.

FOOD-08B catalog audit will enforce CANON-001 via slug and display-name heuristics.

### §5.2 CANON-002 — Global culinary recognition (FOOD-08B+)

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — CANON-002.

Each canonical grain or starch must represent a **globally recognizable culinary ingredient**, not merely a regional commercial milling product or single-producer SKU.

| Include | Do not include |
|---------|----------------|
| Barley | Single-farm heritage cultivar as separate entity |
| Rice Flour | One regional mill brand as separate entity |
| Quinoa | Single-color trade split as separate entity when culinary role is identical |

FOOD-08B catalog audit will enforce CANON-002 via regional slug heuristics and minimum summary quality.

---

## 6. Scientific Naming

`scientific_name` stores the **primary botanical species** associated with the canonical culinary ingredient (e.g. `Oryza sativa` for rice, `Triticum aestivum` for wheat).

| Rule | Detail |
|------|--------|
| One canonical entity per culinary ingredient | Regional names and milling grades are **aliases** unless PROC-001 assigns separate identity |
| Not taxonomy driver | Botanical family informs metadata; **Canonical Culinary Group** drives hierarchy |
| Nullable on hubs | Category and group hubs use `""` |
| Blended or multi-species ingredients | Use `Multiple species` when no single species defines culinary identity |
| Starch from non-grain source | Species of source plant when known (e.g. `Solanum tuberosum` for potato starch) |

---

## 7. Intrinsic Metadata (Frozen Vocabulary)

All vocabularies below are frozen in FOOD-08A. New values require a governance amendment and catalog audit update.

### Required fields (every `grain_starch` entity)

| Field | Purpose |
|-------|---------|
| `culinary_group` | Aligns to immutable Canonical Culinary Group |
| `usage_intensity` | Culinary prominence in dish composition — see §7.1 |
| `parent_group` | Group slug — required |
| `parent_category` | Category slug — always `grain-starch` |
| `aliases` | Trade names, milling grades, regional variants — array, may be `[]` |
| `common_names` | Common culinary names — array, may be `[]` |
| `origin_context` | Nullable ISO region hint or `""` for global staples |

**No editorial content** in FOOD-08B catalog entities.

### Reserved fields (schema frozen — empty in FOOD-08B)

| Field | Purpose |
|-------|---------|
| `flavor_profile` | Array — vocabulary frozen; **`[]` only in FOOD-08B** |
| `texture_profile` | Array — vocabulary frozen; **`[]` only in FOOD-08B** |
| `aroma_profile` | Array — vocabulary frozen; **`[]` only in FOOD-08B** |

Same reservation pattern as Vegetable, Fungi, and Herb & Spice ontologies.

### §7.1 `usage_intensity` (required)

Culinary prominence in dish composition — **intrinsic only**. Never inferred from price, rarity, or pairing data.

| Value | Meaning | Examples |
|-------|---------|----------|
| `primary` | Defining structure or base of dish composition | Rice in pilaf; pasta flour in fresh pasta dough context; polenta base |
| `accent` | Supporting starch, thickener, or coating | Cornstarch slurry; breadcrumb starch; accent grain garnish |
| `luxury` | Rare or pairing-defining specialty grain | Heritage varietal when globally recognized as distinct canonical ingredient |

Controlled vocabulary is **immutable** — reuse suite values `primary` · `accent` · `luxury` unchanged. **No new values.**

---

## 8. Relationship Placeholders

All relationship arrays **present and empty** (`[]`) until FOOD-08D/E:

| Array | Layer |
|-------|-------|
| `typical_descriptors` | Editorial / descriptor refs |
| `similar_grain_starches` | Editorial `similar_to` |
| `substitutions` | Editorial `substitutes_for` |
| `commonly_served_with` | Editorial cross-domain |
| `wine_pairings` | Wine pairing (FOOD-08E) |
| `avoid_wine_pairings` | Wine pairing |
| `related_styles` | Wine pairing |
| `related_descriptors` | Wine pairing |
| `related_techniques` | Wine pairing |
| `common_preparations` | Cross-domain prep refs |

---

## 9. Processing Ownership Rule — PROC-001

**Authoritative suite definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — PROC-001.

PROC-001 is **introduced in FOOD-08A** and applies suite-wide. It answers:

> Does a processed form represent a **new canonical culinary ingredient** or merely a **preparation state / alias**?

The decision follows **culinary identity**, not manufacturing process or botanical lineage alone. Once frozen in catalog population, the decision is **immutable**.

### Decision criteria

| Signal | Favor separate canonical entities | Favor one entity + aliases |
|--------|-----------------------------------|----------------------------|
| Culinary role in dish | Materially different (whole grain base vs flour binder vs isolated starch) | Same role, different grind or cook time |
| Texture and pairing context | Divergent wine and preparation pairing rationale | Preparation variant only |
| Market identity | Distinct global ingredient SKUs (rice vs rice flour) | Bread flour vs all-purpose on one wheat flour identity |
| Group placement | Belongs in different Canonical Culinary Group | Same group, different alias |

### Frozen governance decisions (FOOD-08A)

These decisions apply before FOOD-08B catalog population and must not be reversed without a governance amendment:

| Source / context | Culinary forms | Governance decision | Canonical owner |
|------------------|----------------|---------------------|-----------------|
| *Triticum* spp. | Whole grain vs wheat flour | **Separate entities** — distinct culinary identity and group | Wheat → Whole Grains; Wheat Flour → Processed Grains |
| *Oryza sativa* | Whole rice vs rice flour | **Separate entities** | Rice → Whole Grains; Rice Flour → Processed Grains |
| *Zea mays* | Whole dried corn vs cornmeal vs cornstarch | **Separate entities by processing level** | Corn → Whole Grains; Cornmeal → Processed Grains; Cornstarch → Starches |
| *Solanum tuberosum* | Potato tuber vs potato starch | **Separate ownership across domains** | Potato → Vegetable Ontology; Potato Starch → Starches |
| *Piper nigrum* | Whole vs ground pepper | **One entity + alias** (Herb & Spice) | Black Pepper — ground as alias |
| *Cinnamomum* spp. | Stick vs ground cinnamon | **One entity + alias** (Herb & Spice) | Cinnamon — ground as alias |
| Oats | Rolled / quick / instant | **One entity + aliases** (default) — unless FOOD-08B curation documents divergent canonical identity | Oats → Whole Grains |

### Flour alias policy (FOOD-08B gate)

Bread Flour, Cake Flour, and All-Purpose Flour are **aliases on Wheat Flour by default**. FOOD-08B may assign separate canonical entities only when audit documents genuinely distinct culinary identity under PROC-001 and CANON-001 — not commercial labeling alone.

---

## 10. Cross-Domain Ownership

Canonical ownership must be **unique** across the suite. The Grain & Starch Ontology **must not** duplicate entities owned by other domains.

### Frozen cross-domain ownership (FOOD-08A)

| Ingredient | Culinary form | Owner domain | Notes |
|------------|---------------|--------------|-------|
| Potato | Whole tuber | Vegetable (FOOD-05) | Starch derivative owned here |
| Potato Starch | Isolated starch | Grain & Starch — Starches | PROC-001 cross-domain split |
| Corn | Field/dried grain staple | Grain & Starch — Whole Grains | Distinct from sweet corn vegetable use |
| Sweet corn | Fresh vegetable | Vegetable (FOOD-05) | When governed in vegetable catalog |
| Mustard seed | Whole spice | Herb & Spice (FOOD-07) | Not a staple grain |
| Soybean | Legume | Legume (FOOD-11) | Future domain |
| Sweet potato | Starchy tuber | Vegetable (FOOD-05) | Not a cereal grain |
| Vital wheat gluten / seitan base | Wheat protein | Protein Foods (FOOD-01) | Protein angle — cross-reference only |

### Cross-domain reference policy

1. **Forward references** to any published or unpublished domain are allowed in editorial edges (ID-only).
2. **Never embed** another domain's intrinsic fields on a grain/starch entity.
3. **Never duplicate** vegetable, protein, herb/spice, or other domain entities inside the grain-starch catalog.
4. Structural edges (`belongs_to_group`, `belongs_to_category`) remain **intra-domain only**.

---

## 11. Runtime Principles

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Runtime Projection Principle, §Knowledge layer separation, and §Runtime stability levels.

FOOD-08C will follow the same three-level runtime model established by prior domains — structural edges from hierarchy, intrinsic similarity from governed metadata, editorial edges deferred to FOOD-08D. **No changes to suite runtime principles in FOOD-08A.**

---

## 12. Lifecycle

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) and prior domain governance (FOOD-04 through FOOD-07).

The standard **six-phase ontology lifecycle** applies unchanged:

| Phase | FOOD-08 milestone |
|-------|-------------------|
| A | Governance (this document) — **frozen** |
| B | Catalog population |
| C | Runtime compilation & structural relationships |
| D | Editorial relationships |
| E | Wine pairing relationships |
| F | Publication through shared platform |

Suite target **v1.5.0** tags upon FOOD-08F publication.

---

## 13. FOOD-08B Targets (blueprint only)

| Target | Range |
|--------|------:|
| Total canonical grains & starches | **70–100** |
| Whole Grains | 15–25 |
| Pseudocereals | 8–15 |
| Processed Grains | 20–30 |
| Starches | 12–20 |

Coverage prioritizes **globally significant staple ingredients** over exhaustive regional milling variants.

---

## 14. Success Criteria

FOOD-08A succeeds when:

1. `data/grain-starch-catalog.json` exists with frozen schema, four hub groups, empty `grain_starches`, and governance metadata.
2. This document and [`GRAIN_STARCH_TAXONOMY_BLUEPRINT.md`](GRAIN_STARCH_TAXONOMY_BLUEPRINT.md) are approved and frozen.
3. Four Canonical Culinary Groups are immutable in catalog `schema.controlled_vocabularies`.
4. `usage_intensity` reuses suite vocabulary unchanged (`primary` · `accent` · `luxury`).
5. Reserved intrinsic arrays (`flavor_profile`, `texture_profile`, `aroma_profile`) are schema-frozen and empty until post-FOOD-08B enrichment.
6. Processing Ownership Rule (PROC-001) decisions are documented and frozen (§9).
7. Cross-domain ownership boundaries are documented and frozen (§10).
8. No runtime, editorial, wine, publication, or platform artifacts exist.

---

## 15. Approval

| Role | Status | Date |
|------|--------|------|
| Governance freeze | **Approved** | 2026-07-19 |
| FOOD-08B catalog population | Pending explicit approval | — |

**Next milestone:** FOOD-08B — Populate Grain & Starch Ontology catalog (~70–100 canonical ingredients).
