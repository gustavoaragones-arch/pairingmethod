# FOOD-13A — Sauce & Condiment Ontology Governance

**Phase:** FOOD-13A — Sauce & Condiment Ontology Governance  
**Freeze Date:** August 3, 2026  
**Status:** **Sauce & Condiment Governance Frozen v1.0.0**  
**SSOT:** [`data/sauce-condiment-catalog.json`](../data/sauce-condiment-catalog.json)  
**Taxonomy:** [`SAUCE_CONDIMENT_TAXONOMY_BLUEPRINT.md`](SAUCE_CONDIMENT_TAXONOMY_BLUEPRINT.md)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)  
**Platform:** Food Ontology Platform v1.0.0 (frozen — domain contract only)  
**Suite baseline:** Food Ontology Suite v1.9.0 · tag `food-ontology-suite-v1.9.0`

---

## Executive Summary

PairingMethod declares **Sauce & Condiment Ontology Governance v1.0.0** — the authoritative governance layer for the **Sauce & Condiment Ontology** within Food Ontology Suite expansion toward v2.0.0.

This domain is **not** recipe taxonomy, prepared-dish catalogs, commercial branding, beverage menus, or ad-hoc composed sauces without established culinary identity. It is the authoritative ontology for **culinary sauces, condiments, spreads, emulsions, seasoning pastes, and fermented flavor bases** used as distinct culinary ingredients worldwide. The project models **ingredients**, not burger recipes, marinade formulas, or brand-specific product lines.

FOOD-13 completes the poster's composed-flavor-carrier layer after ten ingredient-family domains at v1.9.0. By introducing **SAUCE-001**, **SAUCE-002**, and **SAUCE-PAIR-001**, the suite formalizes ownership of classical mother sauces, table sauces, condiments, fermented bases, oil-based dressings, and savory spreads while extending PROC-001 into composite culinary preparations — continuing the governance lineage of SWEET-001, LEGUME-002, and FRUIT-001 without platform modification.

This milestone establishes the canonical catalog shell, **Canonical Culinary Groups**, immutable identity rules, the intrinsic attribute `usage_intensity`, controlled vocabularies including `culinary_function`, cross-domain reference policy, and the domain rules **SAUCE-001**, **SAUCE-002**, and **SAUCE-PAIR-001**.

**No sauce or condiment entities exist yet.** No runtime artifacts, publication artifacts, or platform changes are created in this phase.

Sauce & Condiment will be the **eleventh consumer** of the multi-domain publication platform. Publication will reuse the shared platform via domain configuration in FOOD-13F — no platform modifications.

**Governance status:** Frozen. Entity population begins only after explicit approval to proceed with FOOD-13B.

---

## Domain Independence Principle

**Authoritative definition:** [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture — Domain Independence Principle.

Every new ontology domain is evaluated against four questions **before implementation**. **No modifications in FOOD-13A.**

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
| Domain | Sauce & Condiment (culinary sauces, condiments, and flavor carriers) |
| Governance version | **v1.0.0** |
| JSON `catalog_version` | `1.0.0` |
| `food_ontology_version` (target suite) | `2.0.0` (upon FOOD-13F publication) |
| `platform_version` | `1.0.0` (frozen) |
| `wine_ontology_version` (reference) | `2.0` |
| `ontology_foundation_version` | `1.0.0` |
| Phase | FOOD-13A (governance only) |

---

## 2. Architectural Scope

### Allowed artifacts (FOOD-13A only)

| Artifact | Purpose |
|----------|---------|
| `data/sauce-condiment-catalog.json` | Catalog SSOT — schema, metadata, hub entities, empty `sauce_condiments` |
| `docs/SAUCE_CONDIMENT_TAXONOMY_BLUEPRINT.md` | Canonical taxonomy definition |
| `docs/SAUCE_CONDIMENT_GOVERNANCE.md` | This document |

### Explicitly excluded from FOOD-13A

- Runtime artifacts (bootstrap, indexes, graph edges)
- Publication artifacts (HTML, sitemaps, search indexes)
- Generators, validators, certification scripts
- Deployment logic or **any** platform code changes
- Editorial relationships (FOOD-13D)
- Wine pairings (FOOD-13E)
- Catalog population (FOOD-13B)

### Domain contract compliance

| Contract element | Sauce & Condiment binding |
|------------------|---------------------------|
| Catalog SSOT | `data/sauce-condiment-catalog.json` |
| Three-level hierarchy | `sauce_condiment_category` → `sauce_condiment_group` → `sauce_condiment` |
| Immutable ontology IDs | `food.sauce-condiment.{group}.{slug}` |
| Controlled vocabularies | Frozen in catalog `schema` |
| Relationship placeholders | Empty arrays until FOOD-13D/E |
| Publication | Shared platform + domain config in FOOD-13F |

---

## 3. Canonical Culinary Groups

Sauce & Condiment taxonomy is **culinary function**, not geography or primary ingredient. Groups answer *"What is this ingredient's sauce or condiment role in the kitchen?"* — not *"What country does it come from?"* or *"What is its main ingredient?"*

### Frozen groups (FOOD-13 v1) — **immutable**

These six **Canonical Culinary Groups** are a **frozen controlled vocabulary**. Display names, slugs, and group IDs must **not** be renamed, merged, split, or supplemented with peer groups in v1 unless a future governance amendment documents a compelling architectural reason and accepts migration cost.

| Display name (immutable) | Slug (immutable) | Group ID (immutable) | `culinary_group` |
|--------------------------|------------------|----------------------|------------------|
| **Mother Sauces** | `mother-sauces` | `food.sauce-condiment.mother-sauces` | `mother_sauces` |
| **Table Sauces** | `table-sauces` | `food.sauce-condiment.table-sauces` | `table_sauces` |
| **Condiments** | `condiments` | `food.sauce-condiment.condiments` | `condiments` |
| **Fermented Sauces & Pastes** | `fermented-sauces-pastes` | `food.sauce-condiment.fermented-sauces-pastes` | `fermented_sauces_pastes` |
| **Oil-Based Sauces & Dressings** | `oil-based-sauces-dressings` | `food.sauce-condiment.oil-based-sauces-dressings` | `oil_based_sauces_dressings` |
| **Savory Spreads & Pastes** | `savory-spreads-pastes` | `food.sauce-condiment.savory-spreads-pastes` | `savory_spreads_pastes` |

**Expansion policy:** Future growth occurs **inside** these groups (new leaf entities), not by adding new peer groups.

**Fermented group scope:** This group covers **sauce and paste flavor bases** with established culinary identity as sauces or condiments — soy sauce, fish sauce, gochujang. Legume- and grain-derived ferments with primary ownership elsewhere (miso, tempeh, natto) are **referenced by canonical ID**, not duplicated.

---

## 4. Namespace & Identity Model

### Namespace

Reserve: **`food.sauce-condiment.*`**

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.sauce-condiment` | `food.sauce-condiment` |
| Group | `food.sauce-condiment.{group}` | `food.sauce-condiment.table-sauces` |
| Sauce & Condiment | `food.sauce-condiment.{group}.{slug}` | `food.sauce-condiment.table-sauces.tomato-ketchup` |

Shorthand IDs such as `food.sauce-condiment.tomato-ketchup` (without group segment) are **not valid**.

### Identity contract (every `sauce_condiment` entity)

```json
{
  "id": "",
  "slug": "",
  "display_name": "",
  "scientific_name": "",
  "parent_group": "",
  "parent_category": "sauce-condiment",
  "culinary_group": "",
  "usage_intensity": "",
  "aliases": [],
  "common_names": [],
  "external_ids": {},
  "catalog_version": "1.0.0",
  "food_ontology_version": "2.0.0"
}
```

---

## 5. Domain Boundaries

### Included

| Include | Examples |
|---------|----------|
| Classical mother sauces | béchamel, velouté, espagnole, tomato mother sauce, hollandaise, mayonnaise |
| Table and finishing sauces | ketchup, barbecue sauce, Worcestershire sauce, pan gravy |
| Table condiments | Dijon mustard, relish, prepared mustard pastes |
| Fermented flavor bases | soy sauce, fish sauce, gochujang, doubanjiang |
| Oil-based sauces and dressings | vinaigrette, pesto, aioli, ranch dressing |
| Savory spreads and pastes | tapenade, anchovy paste, compound savory spreads |
| Deferred from Sweet Flavor (FOOD-12) | vanilla extract, almond extract, orange blossom water, rose water, caramel sauce, chocolate syrup |

### Excluded

| Exclude | Rationale |
|---------|-----------|
| Recipes and composed meals | Not ingredient ontology |
| Marinades as recipes | Recipe scope — out of domain v1 |
| Prepared dishes | Not ingredient ontology |
| Beverage concentrates | Beverage scope — out of domain v1 |
| Commercial brands and product lines | Not ingredient ontology |
| Spice blends owned by Herb & Spice | garam masala, curry powder, five-spice — FOOD-07 ownership |
| Primary sweeteners | FOOD-12 Sweet Flavor ownership |
| Whole vegetables, fruits, legumes, nuts | Respective domain ownership — reference only |
| Ad-hoc composed sauces | Fail SAUCE-001 composite identity test |

**Coffee note:** Roasted coffee as a beverage ingredient remains excluded from Sauce & Condiment v1. Coffee as a culinary pairing context may be referenced editorially; canonical coffee ownership is deferred to a future beverage governance amendment.

---

## 6. Suite Governance Rules (continued)

FOOD-13A continues all suite rules without redefinition. Authoritative definitions live in [`FOOD_ONTOLOGY_SUITE_RELEASES.md`](FOOD_ONTOLOGY_SUITE_RELEASES.md) §Suite Architecture.

| Rule | ID | FOOD-13A application |
|------|-----|----------------------|
| Canonical Entity Rule | CANON-001 | One canonical culinary sauce or condiment per established identity |
| Global Culinary Recognition Rule | CANON-002 | Globally recognizable sauces before regional variants |
| Botanical Ownership Rule | BOTAN-001 | Culinary identity over botanical classification |
| Processing Ownership Rule | PROC-001 | Processing that changes culinary identity → separate entity — SAUCE-001 extends for composite sauces |
| Composite Identity Rule | SAUCE-001 | Established culinary identity required — not ingredient lists alone |
| Composition Ownership Rule | SAUCE-002 | Reference other domains by ID — never duplicate intrinsic metadata |
| Culinary Role Pairing (Sweet) | SWEET-PAIR-001 | Referenced for cross-domain pairing discipline |

---

## 7. SAUCE-001 — Composite Identity Rule

**Introduced:** FOOD-13A · **Applies** to Sauce & Condiment catalog, runtime, editorial, and wine layers; **extends** PROC-001 and CANON-001 for composite culinary preparations.

> A sauce or condiment becomes a **canonical ontology entity** only when it has an **established culinary identity independent of its ingredient list**. Ad-hoc combinations, recipe-specific variants, and brand formulations without global culinary recognition are **not** canonical entities.

### Identity test (deterministic — FOOD-13B audit criterion)

A preparation qualifies as a **canonical sauce or condiment entity** only if **all** of the following are true:

| Criterion | Question |
|-----------|----------|
| **Established culinary identity** | Is the preparation recognized globally or in major regional cuisines as a distinct sauce or condiment? |
| **Independent kitchen role** | Does it function as a reusable culinary ingredient — not a one-off recipe component? |
| **Pairing relevance** | Does its acidity, fat, fermentation, emulsification, umami, or richness materially affect wine pairing per SAUCE-PAIR-001? |

If **any** criterion fails, the preparation is **excluded** or deferred — not cataloged as a leaf entity.

### Canonical entities (examples — planning reference)

| Entity | Group | Rationale |
|--------|-------|-----------|
| Mayonnaise | Mother Sauces | Established emulsion mother sauce |
| Hollandaise | Mother Sauces | Classical emulsion mother sauce |
| Soy Sauce | Fermented Sauces & Pastes | Global fermented flavor base |
| Worcestershire Sauce | Table Sauces | Established table sauce identity |
| Dijon Mustard | Condiments | Established condiment identity |
| Tomato Ketchup | Table Sauces | Established table sauce identity |

### Not canonical (default freeze)

| Preparation | Treatment |
|-------------|-----------|
| Garlic Butter Sauce | **Excluded** — ad-hoc composed sauce without established independent identity |
| Homemade Burger Sauce | **Excluded** — recipe-specific variant |
| Spicy Mayo with Sriracha | **Excluded** — ad-hoc derivative without canonical identity |
| House Dressing | **Excluded** — restaurant-specific formulation |
| Brand-specific ketchup variants | **Excluded** — commercial product lines |

Regional style variants of **established canonical identities** (e.g., whole-grain mustard vs Dijon) are evaluated per CANON-002 and the identity test — default to aliases unless kitchen behavior diverges materially.

---

## 8. SAUCE-002 — Composition Ownership Rule

**Introduced:** FOOD-13A · **Applies** to Sauce & Condiment catalog, runtime, editorial, and wine layers.

> **Ingredient ownership never transfers.** Sauce and condiment entities **reference** canonical IDs from other domains for component ingredients. They **never duplicate** intrinsic metadata (scientific names, flavor profiles, usage intensities) owned elsewhere.

### Reference pattern (example — Tomato Ketchup)

| Component concept | Owner domain | Reference type |
|-------------------|--------------|----------------|
| Tomato | Vegetable (FOOD-05) | Editorial / composition reference by canonical ID |
| Sugar | Sweet Flavor (FOOD-12) | Editorial / composition reference by canonical ID |
| Vinegar | **Deferred** — vinegar ownership pending future domain or FOOD-13B decision | Forward reference if needed |
| Spices | Herb & Spice (FOOD-07) | Reference individual spices — not spice blends unless owned here |

SAUCE-002 governs **metadata boundaries**, not whether a sauce entity exists. Tomato Ketchup is canonical under SAUCE-001; its composition is expressed through cross-domain references in editorial layers (FOOD-13D), not by redefining tomato or sugar entities.

### Cross-domain ownership table

| Ingredient | Owner domain | Notes |
|------------|--------------|-------|
| Tomato | **Vegetable (FOOD-05)** | Whole vegetable form |
| Garlic | **Vegetable (FOOD-05)** | Allium form |
| Basil | **Herb & Spice (FOOD-07)** | Fresh herb form |
| Sugar | **Sweet Flavor (FOOD-12)** | Crystalline sweetener |
| Honey | **Sweet Flavor (FOOD-12)** | Bee product sweetener |
| Soybean | **Legume (FOOD-11)** | Whole legume form |
| Miso | **Legume (FOOD-11)** | Fermented legume product — reference, not duplicate |
| Tahini | **Nut & Seed (FOOD-10)** | Seed paste — reference, not duplicate |
| Mustard Seed | **Herb & Spice (FOOD-07)** | Whole spice form |
| Olive Oil | **Deferred** | Future oil/fat domain or FOOD-13B governance decision |
| Vinegar | **Deferred** | FOOD-13B may assign canonical vinegar entities if globally recognized as condiment ingredients |

---

## 9. SAUCE-PAIR-001 — Culinary Function Pairing Rule

**Introduced:** FOOD-13A · **Exercised** in FOOD-13E wine pairing seed and mapper validation.

> Wine recommendations for sauce and condiment ingredients must follow the preparation's **culinary function** in the finished dish — not simply its dominant ingredient.

| Pairing dimension | Examples |
|-------------------|----------|
| **Acidity** | Vinaigrette → bright salad and seafood contexts; tomato-based sauces → acid-forward pairings |
| **Fat** | Hollandaise → rich emulsion pairings; aioli → fat-coating applications |
| **Fermentation** | Soy sauce → umami depth; fish sauce → fermented savor pairings |
| **Emulsification** | Mayonnaise → emulsion-stable contexts; hollandaise → butter-rich pairings |
| **Umami** | Worcestershire → savory depth; miso-adjacent ferments referenced editorially |
| **Richness** | Demi-glace → reduction richness; pan gravy → roast context |

| Anti-pattern | Rationale |
|--------------|-----------|
| Pairing ketchup like fresh tomato | Ketchup pairs by sweet-acid table-sauce function, not raw tomato |
| Pairing mayonnaise like whole egg | Mayonnaise pairs by emulsion fat identity |
| Inheriting soy sauce pairings from soybean | Fermented umami function dominates |

SAUCE-PAIR-001 governs FOOD-13E only. It does **not** modify wine ontology structure or platform pairing logic.

### Wine Pairing Layer Governance (WINE-001–005)

**Introduced:** FOOD-13E · **Enforced** in `scripts/map-sauce-condiment-wine-relationships-13e.mjs`.

| Rule | Requirement |
|------|-------------|
| **WINE-001** | Wine relationships may never modify or imply structural taxonomy — the pairing layer is independent of catalog and runtime graphs |
| **WINE-002** | Pairings must reference canonical wine ontology IDs only (wine style catalog slugs) |
| **WINE-003** | Pairings are directional from food entity → wine entity |
| **WINE-004** | Multiple wines are permitted per food entity with independent confidence and pairing method |
| **WINE-005** | No transitive inference — food→wine edges do not imply food↔food or wine↔wine relationships |

Allowed relationship types: `pairs_with_wine`, `classic_pairing`, `avoid_with_wine`, `contrasting_pairing`, `regional_pairing`.

Output artifact: `data/runtime/sauce-condiment-wine-relationships.json` — versioned independently from runtime and editorial layers.

---

## 10. Cross-Domain Ownership & FOOD-12 Integration

Canonical ownership must remain **unique** across the suite. Sauce & Condiment does not duplicate intrinsic data from other domains.

### Items deferred from Sweet Flavor (FOOD-12) — now owned here

| Item | Group assignment (planned) | Rationale |
|------|---------------------------|-----------|
| Vanilla Extract | Condiments or Oil-Based (FOOD-13B decision) | Composed flavor carrier |
| Almond Extract | Condiments | Composed flavor carrier |
| Orange Blossom Water | Condiments | Floral water condiment |
| Rose Water | Condiments | Floral water condiment |
| Caramel Sauce | Table Sauces | Composed sauce identity |
| Chocolate Syrup | Table Sauces | Composed sauce identity |

Sweet Flavor **references** these entities editorially by canonical ID after FOOD-13 publication. Sweet Flavor does **not** duplicate them.

### Herb & Spice boundary

| Include in FOOD-13 | Exclude — remain FOOD-07 |
|--------------------|---------------------------|
| Dijon Mustard (prepared condiment) | Mustard Seed (whole spice) |
| Prepared horseradish sauce | Horseradish root (vegetable/spice boundary — FOOD-13B audit) |
| Hot sauce (canonical identity) | Cayenne pepper (whole spice) |
| | Garam masala, curry powder, five-spice (spice blends) |

Cross-domain references use **canonical ontology IDs only** — never duplicated intrinsic fields.

---

## 11. Required Intrinsic Fields

Every leaf entity requires these fields at FOOD-13B population (see catalog `schema` for full contract):

| Field | Rule |
|-------|------|
| `id` | Immutable canonical ID — `food.sauce-condiment.{group}.{slug}` |
| `slug` | URL-safe identifier — mutable for SEO; ID unchanged |
| `display_name` | Human-readable name — mutable |
| `scientific_name` | Required — primary source species, product class, or `Multiple sources` for composite sauces |
| `parent_group` | Required — group slug |
| `parent_category` | Required — always `sauce-condiment` |
| `culinary_group` | Required — aligns to immutable group vocabulary |
| `usage_intensity` | Required — `primary` · `accent` · `luxury` |
| `aliases` | Required array — may be empty |
| `common_names` | Required array — may be empty |
| `external_ids` | Required object — may be `{}` |

---

## 12. usage_intensity

Reuse the suite standard **unchanged**:

| Value | Meaning |
|-------|---------|
| `primary` | Staple prominence — defines dish sauce character (e.g., tomato mother sauce in braise, soy sauce in stir-fry) |
| `accent` | Supporting role — finishing drizzle, background condiment |
| `luxury` | Premium or specialty prominence — truffle aioli, single-estate olive-based dressing |

---

## 13. Reserved Attributes

The following fields are **required on every leaf entity** but remain **empty arrays through FOOD-13B**:

| Field | Populate from |
|-------|---------------|
| `flavor_profile` | FOOD-13C runtime curation standards (post-FOOD-13B) |
| `texture_profile` | FOOD-13C runtime curation standards (post-FOOD-13B) |
| `aroma_profile` | FOOD-13C runtime curation standards (post-FOOD-13B) |

Controlled vocabularies for these fields are frozen in FOOD-13A catalog `schema` — do not populate values until post-FOOD-13B curation standards are approved.

The catalog also freezes `culinary_function` vocabulary for pairing audit context — populated from FOOD-13C onward.

---

## 14. FOOD-13B Target

**Target:** approximately **80–110** canonical ingredients — **bias toward completeness** over minimum count.

Coverage prioritizes **globally recognized culinary sauces and condiments** before regional variants. Entity quality over count.

See [`SAUCE_CONDIMENT_TAXONOMY_BLUEPRINT.md`](SAUCE_CONDIMENT_TAXONOMY_BLUEPRINT.md) for per-group planning targets.

---

## 15. Lifecycle & Next Phases

| Phase | Scope |
|-------|-------|
| **FOOD-13A** (this document) | Governance freeze — no entities |
| FOOD-13B | Catalog population + audit |
| FOOD-13C | Runtime compile |
| FOOD-13D | Editorial relationships (~220–300 edges expected) |
| FOOD-13E | Wine pairings (~180–220 edges expected) |
| FOOD-13F | Publication via shared platform |

**Next work:** FOOD-13B — Populate Sauce & Condiment Ontology catalog (pending explicit approval).

---

## 16. Expected Suite Milestone (post-FOOD-13F)

Completion of FOOD-13 produces **Food Ontology Suite v2.0.0** — the eleventh published ontology domain, completing nearly all major ingredient categories represented by the original Wine Folly pairing poster. **FOOD-14 (Protein Refinement)** remains the final ontology-focused phase before transitioning to the ENGINE roadmap.

| Metric | Approximate |
|--------|------------:|
| Published domains | 11 |
| Canonical entities | ~1,155–1,185 |
| Publication pages | ~1,230–1,260 |

Exact totals certified at FOOD-13F release time.
