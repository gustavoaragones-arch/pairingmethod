# FOOD-06A — Fungi Ontology Governance

**Phase:** FOOD-06A — Fungi Ontology Governance  
**Freeze Date:** July 18, 2026  
**Status:** **Fungi Governance Frozen v1.0.0**  
**SSOT:** [`data/fungi-catalog.json`](../data/fungi-catalog.json)  
**Taxonomy:** [`FUNGI_TAXONOMY_BLUEPRINT.md`](FUNGI_TAXONOMY_BLUEPRINT.md)  
**Roadmap:** [`POSTER_COVERAGE.md`](POSTER_COVERAGE.md) (PLAN-01)  
**Platform:** Food Ontology Platform v1.0.0 (frozen — domain contract only)  
**Suite baseline:** Food Ontology Suite v1.2.0 · tag `food-ontology-suite-v1.2.0`

---

## Executive Summary

PairingMethod declares **Fungi Ontology Governance v1.0.0** — the authoritative governance layer for the **Fungi Ontology** within Food Ontology Suite expansion toward v1.3.0.

This domain is **not** a mushroom list. It is the authoritative ontology for **culinary fungi** — edible fungi used as culinary ingredients worldwide. The project models **ingredients**, not biology.

This milestone establishes the canonical catalog shell, **Canonical Culinary Groups**, immutable identity rules, the new intrinsic attribute `usage_intensity`, controlled vocabularies, cross-domain reference policy, and **Protein migration policy**. **No fungus entities exist yet.** No runtime artifacts, publication artifacts, or platform changes are created in this phase.

Fungi is the **fourth consumer** of the multi-domain publication platform (after Protein Foods, Cheeses, and Vegetables). Publication reuses the shared platform via domain configuration in FOOD-06F — no platform modifications.

**Governance status:** Frozen. Entity population begins only after explicit approval to proceed with FOOD-06B.

---

## Domain Independence Principle

Every new ontology domain is evaluated against four questions **before implementation**. This principle is operational from FOOD-05 onward and complements PLAN-01 governance rules. **No modifications in FOOD-06A.**

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

FOOD-06 is the first domain to **formalize canonical ownership transfer** from Protein Foods while deferring ID migration — see §10.

---

## 1. Version

| Field | Value |
|-------|-------|
| Domain | Fungi (culinary fungi) |
| Governance version | **v1.0.0** |
| JSON `catalog_version` | `1.0.0` |
| `food_ontology_version` (target suite) | `1.3.0` (upon FOOD-06F publication) |
| `platform_version` | `1.0.0` (frozen) |
| `wine_ontology_version` (reference) | `2.0` |
| `ontology_foundation_version` | `1.0.0` |
| Phase | FOOD-06A (governance only) |

### Version streams

| Stream | Meaning |
|--------|---------|
| Platform `1.0.0` | Publication infrastructure — frozen |
| `fungi-catalog` `1.0.0` | Fungi domain data contract |
| Food Ontology Suite `1.3.0` | Target suite release when Fungi publishes (FOOD-06F) |

---

## 2. Architectural Scope

### Allowed artifacts (FOOD-06A only)

| Artifact | Purpose |
|----------|---------|
| `data/fungi-catalog.json` | Catalog SSOT — schema, metadata, hub entities, empty `fungi` |
| `docs/FUNGI_TAXONOMY_BLUEPRINT.md` | Canonical taxonomy definition |
| `docs/FUNGI_GOVERNANCE.md` | This document |

### Explicitly excluded from FOOD-06A

- Runtime artifacts (bootstrap, indexes, graph edges)
- Publication artifacts (HTML, sitemaps, search indexes)
- Generators, validators, certification scripts
- Deployment logic or **any** platform code changes
- Editorial relationships (FOOD-06D)
- Wine pairings (FOOD-06E)

### Domain contract compliance

| Contract element | Fungi binding |
|------------------|---------------|
| Catalog SSOT | `data/fungi-catalog.json` |
| Three-level hierarchy | `fungi_category` → `fungi_group` → `fungus` |
| Immutable ontology IDs | `food.fungi.{group}.{slug}` |
| Controlled vocabularies | Frozen in catalog `schema` |
| Relationship placeholders | Empty arrays until FOOD-06D/E |
| Publication | Shared platform + domain config in FOOD-06F |

---

## 3. Canonical Culinary Groups

Fungi taxonomy is **culinary**, not mycological. This is a deliberate organizing principle: the ontology answers *"How does this fungus behave in the kitchen and at the table?"* — not *"What is its fungal family?"*

Unlike Vegetables (poster-aligned groups), Fungi groups are defined by **culinary role and market context**, not poster rows.

### Frozen groups (FOOD-06 v1) — **immutable**

These four **Canonical Culinary Groups** are a **frozen controlled vocabulary**. Display names, slugs, and group IDs must **not** be renamed, merged, split, or supplemented with peer groups in v1 unless a future governance amendment documents a compelling architectural reason and accepts migration cost.

| Display name (immutable) | Slug (immutable) | Group ID (immutable) | `culinary_group` |
|--------------------------|------------------|----------------------|------------------|
| **Cultivated Mushrooms** | `cultivated-mushrooms` | `food.fungi.cultivated-mushrooms` | `cultivated_mushrooms` |
| **Wild Mushrooms** | `wild-mushrooms` | `food.fungi.wild-mushrooms` | `wild_mushrooms` |
| **Truffles** | `truffles` | `food.fungi.truffles` | `truffles` |
| **Specialty Fungi** | `specialty-fungi` | `food.fungi.specialty-fungi` | `specialty_fungi` |

**Expansion policy:** Future growth occurs **inside** these groups (new leaf entities), not by adding new peer groups.

---

## 4. Namespace & Identity Model

### Namespace

Reserve: **`food.fungi.*`**

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.fungi` | `food.fungi` |
| Group | `food.fungi.{group}` | `food.fungi.wild-mushrooms` |
| Fungus | `food.fungi.{group}.{slug}` | `food.fungi.wild-mushrooms.porcini` |

Shorthand IDs such as `food.fungi.porcini` are **not valid**.

### Identity contract (every `fungus` entity)

Governance requires these identity and intrinsic fields (catalog uses `id` as canonical ID):

```json
{
  "id": "",
  "slug": "",
  "display_name": "",
  "scientific_name": "",
  "parent_group": "",
  "parent_category": "fungi",
  "culinary_group": "",
  "usage_intensity": "",
  "aliases": [],
  "common_names": [],
  "external_ids": {},
  "catalog_version": "1.0.0",
  "food_ontology_version": "1.3.0"
}
```

### Identity rules

| Field | Rule |
|-------|------|
| `id` | **Immutable canonical ID.** Never changed. IDs never recycled. |
| `slug` | May change for SEO. Ontology ID unchanged. |
| `display_name` | May change. Editorial/display only. |
| `scientific_name` | **Required.** Primary species for culinary identity — see §6. |
| `parent_group` | Required — group slug (maps to governance "group") |
| `parent_category` | Required — always `fungi` (maps to governance "category") |
| `external_ids` | **Required object.** May be `{}` when unpopulated. |

---

## 5. Domain Boundaries & Exclusions

### In scope

- Edible fungi used as culinary ingredients worldwide
- Globally recognized culinary fungi
- Commercially important fungi (cultivated and wild)

### Explicitly out of scope

| Concept | Rationale |
|---------|-----------|
| Poisonous / toxic fungi | Not culinary ingredients |
| Medicinal-only fungi | Out of culinary scope unless commonly used as food |
| Ecological classification | Not pairing-relevant |
| Scientific taxonomy beyond identity | Mycological families inform metadata only; **Canonical Culinary Group** drives hierarchy |

### Routed to other domains

| Concept | Owner domain | Phase |
|---------|--------------|-------|
| Vegetables | Vegetable Ontology | FOOD-05 |
| Herbs & spices | Herb & Spice Ontology | FOOD-07 |
| Protein legacy `mushrooms` group | Fungi (canonical); Protein (compatibility until FOOD-14) | FOOD-06 / FOOD-14 |
| Sauces & condiments | Sauce & Condiment Ontology | FOOD-13 |

Cross-references to these domains are permitted in editorial layers. Intrinsic duplication is forbidden.

---

## 5.1 Canonical Entity Rule — CANON-001

Each leaf entity represents a **canonical culinary ingredient** — not every commercial trade name, color variant, or size grade.

| Include | Do not include (use `aliases` or `common_names`) |
|---------|-----------------------------------------------------|
| Button Mushroom | White Button Mushroom, Brown Button Mushroom, Baby Bella |
| Portobello | Large Portobello, Mini Portobello |
| Black Truffle | Perigord Black Truffle as separate entity when same culinary role |

**Distinct culinary identities** (e.g. Button Mushroom vs Cremini vs Portobello) may be separate canonical entities when kitchen behavior and pairing context genuinely diverge — governed in FOOD-06B curation, not by commercial labeling alone.

**Entity quality over count:** The blueprint target of **35–60** entities is a planning range, not a quota.

FOOD-06B catalog audit enforces CANON-001 via slug and display-name heuristics.

### §5.2 CANON-002 — Global culinary recognition (FOOD-06B+)

Each canonical fungus must represent a **globally recognizable culinary ingredient**, not merely a regional commercial product.

| Include | Do not include |
|---------|----------------|
| Porcini | Oregon-only truffle cultivar as separate entity |
| Black Truffle | Perigord Black Truffle as separate entity (alias on Black Truffle) |
| Button Mushroom | White Button Mushroom as separate entity (alias on Button Mushroom) |

FOOD-06B catalog audit enforces CANON-002 via regional slug heuristics and minimum summary quality.

---

## 6. Scientific Naming

`scientific_name` stores the **primary species** associated with the canonical culinary ingredient (e.g. `Boletus edulis` for porcini, `Tuber magnatum` for white truffle).

| Rule | Detail |
|------|--------|
| One canonical entity per culinary fungus | Trade names and size grades are **aliases**, not separate entities — see §5.1 |
| Not taxonomy driver | Mycological family informs metadata; **Canonical Culinary Group** drives hierarchy |
| Nullable on hubs | Category and group hubs use `""` |

---

## 7. Intrinsic Metadata (Frozen Vocabulary)

All vocabularies below are frozen in FOOD-06A. New values require a governance amendment and catalog audit update.

### Required fields (every `fungus` entity)

| Field | Purpose |
|-------|---------|
| `culinary_group` | Aligns to immutable Canonical Culinary Group |
| `usage_intensity` | Culinary prominence in dish composition — see §7.1 |
| `parent_group` | Group slug — required |
| `parent_category` | Category slug — always `fungi` |
| `aliases` | Trade names, regional variants — array, may be `[]` |
| `common_names` | Common culinary names — array, may be `[]` |
| `origin_context` | Nullable ISO region hint or `""` for global staples |

**No editorial content** in FOOD-06B catalog entities.

### Reserved fields (schema frozen — FOOD-06B)

| Field | Purpose |
|-------|---------|
| `flavor_profile` | Array — vocabulary frozen; **`[]` only in FOOD-06B** |
| `texture_profile` | Array — vocabulary frozen; **`[]` only in FOOD-06B** |
| `aroma_profile` | Array — vocabulary frozen; **`[]` only in FOOD-06B** |

Same pattern as Vegetable `flavor_profile` reservation in FOOD-05A.

### §7.1 `usage_intensity` (required — new intrinsic attribute)

Culinary prominence in dish composition — **intrinsic only**. Never inferred from price, rarity, or pairing data. Never used to derive wine pairings algorithmically in FOOD-06E.

| Value | Meaning | Examples |
|-------|---------|----------|
| `primary` | Substantial plate ingredient | Button Mushroom |
| `accent` | Supporting umami, texture, or aroma | Porcini, Wood Ear |
| `luxury` | Rare, high-cost, pairing-defining | White Truffle, Black Truffle |

Future Pairing Engine and meal composition (ENGINE-02/03) may consume `usage_intensity` alongside Vegetable `culinary_role`.

Controlled vocabulary is **immutable** in catalog `schema.controlled_vocabularies.usage_intensity`.

---

## 8. Relationship Placeholders

All relationship arrays **present and empty** (`[]`) until FOOD-06D/E:

| Array | Layer |
|-------|-------|
| `typical_descriptors` | Editorial / descriptor refs |
| `similar_fungi` | Editorial `similar_to` |
| `substitutions` | Editorial `substitutes_for` |
| `commonly_served_with` | Editorial cross-domain (Vegetable, Protein, Cheese, Herb IDs) |
| `wine_pairings` | Wine pairing (FOOD-06E) |
| `avoid_wine_pairings` | Wine pairing |
| `related_styles` | Wine pairing |
| `related_descriptors` | Wine pairing |
| `related_techniques` | Wine pairing |
| `common_preparations` | Cross-domain prep refs |

---

## 9. Cross-Domain Reference Policy

The Fungi Ontology **does not own** relationships to other domains. It **participates** in them through canonical IDs at the editorial and pairing layers.

### Example: Porcini (`food.fungi.wild-mushrooms.porcini`)

| Target domain | Relationship types (FOOD-06D/E) | Fungi owns intrinsic? |
|---------------|----------------------------------|------------------------|
| Vegetables | `commonly_served_with` → `food.vegetable.*` | No — edge only |
| Herbs | `commonly_served_with` → `food.herb.*` (forward ref) | No — edge only |
| Protein | `commonly_served_with` → `food.protein.*` | No — edge only |
| Cheese | `commonly_served_with` → `food.cheese.*` | No — edge only |
| Wine | `pairs_with_style`, `pairs_with_descriptor`, … | No — edge only |

### Rules

1. **Forward references** to not-yet-published domains are allowed in editorial edges.
2. **Never embed** another domain's intrinsic fields on a fungus entity.
3. **Never duplicate** vegetable, protein, cheese, or herb entities inside the fungi catalog.
4. Structural edges (`belongs_to_group`, `belongs_to_category`) remain **intra-domain only**.

FOOD-06D should exercise meaningful cross-domain editorial graph edges at representative scale.

---

## 10. Protein Migration Policy

Several fungi currently exist in **Protein Foods** as edible items (`food.protein.mushrooms.*`, 12 entities in the `mushrooms` group).

This policy is **frozen in FOOD-06A** and is a governance milestone beyond adding a new domain: it distinguishes **culinary ontology ownership** from **canonical ID ownership across the suite**.

| Policy | Detail |
|--------|--------|
| **Canonical culinary owner** | Fungi Ontology (`food.fungi.*`) |
| **During FOOD-06 (06A–06F)** | **No Protein IDs are broken, retired, or migrated** |
| **Protein compatibility** | Protein Foods may retain compatibility aliases, references, or editorial notes where needed |
| **Migration execution** | Deferred to **FOOD-14 Protein Refinement** |
| **FOOD-06B** | Assigns new authoritative `food.fungi.*` IDs without requiring immediate Protein catalog changes |

Rationale: preserve stable published Protein URLs and graph references while establishing Fungi as the authoritative domain for culinary fungi knowledge.

---

## 11. Milestone Lifecycle (FOOD-06)

| Milestone | Scope |
|-----------|-------|
| **FOOD-06A** | Governance (this document) — **frozen** |
| **FOOD-06B** | Catalog population — **complete** |
| **FOOD-06C** | Runtime compilation & structural relationships — **complete** |
| **FOOD-06D** | Editorial relationships — **complete** |
| **FOOD-06E** | Wine pairing relationships — **complete** |
| **FOOD-06F** | Publication through shared platform — **complete** |
| Suite v1.3.0 | Food Ontology Suite with Protein, Cheese, Vegetables, and Fungi published |

The six-stage lifecycle is **identical** to FOOD-04, FOOD-05, and Protein — no additions.

---

## 11.0 Runtime Projection Principle (Suite-wide)

Formalized at FOOD-06C across all Food Ontology domains:

> **Runtime artifacts are projections, never sources of truth.**

| Rule | Detail |
|------|--------|
| Catalogs are authoritative | `data/*-catalog.json` is the SSOT for intrinsic knowledge |
| Runtime is regenerated | `data/runtime/*` is always recompiled from catalog — never hand-edited |
| Editorial layers are separate | FOOD-XXD/E artifacts do not modify runtime bootstrap outputs |
| Publication consumes runtime | FOOD-XXF reads runtime + editorial + pairing layers — not catalogs directly |

This principle has been followed in practice since Protein FOOD-02C. FOOD-06C makes it explicit to prevent future contributors from treating generated runtime JSON as editable data.

---

## 11.1 Runtime Stability Levels (FOOD-06C)

The fungi runtime explicitly distinguishes three relationship classes. FOOD-06C generates **Level 1 and Level 2 only**.

### Runtime rule (FOOD-06C)

The runtime must **not** infer substitutions, culinary similarity beyond governed intrinsic attributes, preparation methods, recipes, wine pairings, or regional cuisine. Those belong to FOOD-06D/E or the Pairing Engine.

### Level 1 — Structural (deterministic)

Generated solely from catalog hierarchy.

| Relationship | Direction |
|--------------|-----------|
| `belongs_to_group` | fungus → group |
| `belongs_to_category` | fungus / group → category |
| `group_contains` | group → fungus |
| `category_contains` | category → group |

### Level 2 — Intrinsic similarity (deterministic)

Generated from shared intrinsic metadata. No editorial judgment.

| Relationship | Source field |
|--------------|--------------|
| `shares_usage_intensity` | `usage_intensity` |
| `shares_scientific_name` | `scientific_name` |

**Not generated from reserved arrays:** `flavor_profile`, `texture_profile`, `aroma_profile` remain empty by design until a future governed enrichment phase.

Do not generate `shares_flavor_profile`, `shares_texture_profile`, or `shares_aroma_profile` while those fields are empty.

### Level 3 — Editorial (FOOD-06D+)

**Not generated in FOOD-06C.** Requires human curation and documented evidence.

| Relationship | Editorial tier | Layer |
|--------------|----------------|-------|
| `similar_to` | **A** | Editorial |
| `substitutes_for` | **A** | Editorial |
| `commonly_served_with` (intra-domain) | **B** | Editorial |
| `commonly_served_with` (cross-domain forward ref) | **C** | Editorial |

Editorial edge contract matches FOOD-05D: `confidence`, `derived_from: "editorial"`, `evidence`, `editorial_review`, `editorial_tier`, `stability_level: "editorial"`.

### Association Rule (FOOD-06D)

Editorial edges describe **ingredient compatibility**, not dish composition.

| Good | Avoid |
|------|-------|
| Porcini → Onion | Risotto |
| Shiitake → Garlic | Pasta |
| Truffle → Parmigiano Reggiano | Pizza |

The ontology models ingredients, not recipes or finished dishes. Fungi are often ingredient amplifiers rather than primary ingredients — cross-domain edges should reference canonical ingredient IDs only.

---

## 11.2 Wine Pairing Layer (FOOD-06E)

Wine pairings are a **distinct curated knowledge layer** — not derived from `usage_intensity`, `flavor_profile`, or other intrinsic metadata.

| Type | Relationship | Purpose |
|------|--------------|---------|
| Primary | `pairs_with_style` | Preferred wine style |
| Secondary | `also_pairs_with_style` | Strong alternatives |
| Descriptor | `pairs_with_descriptor` | Pairing driven by wine descriptor vocabulary |
| Technique | `pairs_with_technique` | Preparation-sensitive cases — use sparingly |

### Pairing philosophy (FOOD-06E)

Pairings describe the **fungus itself**, not dishes made from it. Fungi often pair through earthiness, umami, and richness rather than sweetness or acidity alone.

### Truffle Rule (FOOD-06E)

Because truffles are aromatic ingredients rather than bulk ingredients:

- Descriptor pairings emphasize **aroma compatibility**
- Avoid recommending overpowering wines solely because they are prestigious
- White truffle → elegant, aromatic, structured wines (e.g. Nebbiolo, Champagne)
- Black truffle → fuller-bodied, earthy reds (e.g. Syrah) — culinary rationale, not reputation-driven

Validation: no orphan wine IDs, no duplicate pairings, canonical wine references only, `confidence`, `evidence`, `editorial_review: "approved"`, `derived_from: "editorial"`.

---

## 12. FOOD-06B Targets (blueprint only)

| Target | Range |
|--------|------:|
| Total canonical fungi | **35–60** |
| Cultivated Mushrooms | 12–20 |
| Wild Mushrooms | 10–18 |
| Truffles | 2–4 |
| Specialty Fungi | 8–15 |

Optimize for **authoritative coverage** rather than hitting a number.

---

## 13. Frozen Suite Expansion Order

Post–v1.2.0 domain sequence (ontology expansion only — platform frozen):

| Phase | Ontology |
|-------|----------|
| FOOD-06 | **Fungi Ontology** ← current |
| FOOD-07 | Herb & Spice Ontology |
| FOOD-08 | Grain & Starch Ontology |
| FOOD-09 | Fruit Ontology |
| FOOD-10 | Nut & Seed Ontology |
| FOOD-11 | Legume Ontology |
| FOOD-12 | Sweet Flavor Ontology |
| FOOD-13 | Sauce & Condiment Ontology |
| FOOD-14 | Protein Refinement (includes fungi ID migration) |
| ENGINE-01 | Pairing Engine |
| ENGINE-02 | Weighting Engine |
| ENGINE-03 | Meal Composer |

---

## 14. Success Criteria

FOOD-06A succeeds when:

1. Governance, blueprint, and catalog shell exist with **zero** leaf entities.
2. Four Canonical Culinary Groups are frozen with immutable names, slugs, and IDs.
3. `usage_intensity` vocabulary is frozen (`primary` · `accent` · `luxury`).
4. Reserved profile vocabularies exist but are **not populated**.
5. CANON-001 is documented and referenced in catalog schema.
6. Protein migration policy is frozen without breaking existing Protein IDs.
7. **No** runtime, publication, relationship, pairing, or platform artifacts are created.

Guiding question (from PLAN-01):

> Does this milestone add **authoritative culinary knowledge** to the suite while leaving **Platform v1.0.0 unchanged**?

FOOD-06A: **Yes** — governance only.

---

## 15. Approval

| Milestone | Status |
|-----------|--------|
| FOOD-06A governance freeze | **Approved — July 18, 2026** |
| Proceed to FOOD-06B | Pending explicit approval |

Each FOOD-06 milestone succeeds when it adds **authoritative culinary knowledge** to the suite while leaving **Platform v1.0.0 unchanged**.
