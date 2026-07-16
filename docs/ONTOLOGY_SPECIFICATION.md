# PairingMethod Ontology Specification

**Version:** Ontology Foundation v1.0 · Wine Ontology v2.0  
**Status:** Authoritative  
**SSOT:** `data/relationship-types.json`, `lib/entity-model.js`, domain catalogs  
**Food Ontology (planned):** [`ONTOLOGY-02A_ARCHITECTURE.md`](ONTOLOGY-02A_ARCHITECTURE.md)

This document defines **what is allowed** in the PairingMethod semantic ontology.

It is not a changelog. For historical knowledge evolution, see [`ONTOLOGY_CHANGELOG.md`](ONTOLOGY_CHANGELOG.md).

---

## 1. Purpose

The PairingMethod ontology is a typed knowledge graph connecting wine, culinary, and pairing concepts through canonical entities and semantic relationships.

| Document | Answers |
|----------|---------|
| **This specification** | What entity types exist? What relationships are legal? What do they mean? |
| [`ONTOLOGY_CHANGELOG.md`](ONTOLOGY_CHANGELOG.md) | When did the graph change? What was added? |
| `reports/ontology-coverage.json` | What is the current graph state? |

Only entity types and relationship types declared in this specification (and registered in SSOT) are valid. Illegal combinations are rejected by validation.

---

## 2. Domains

Every entity belongs to exactly one domain:

| Domain | Scope | Status |
|--------|-------|--------|
| `wine` | Descriptors, styles, regions, grapes, serving, techniques, faults | Active (v2.0 certified) |
| `culinary` | Proteins, cooking methods, ingredients, sauces, cuisines, dishes | Planned (**Food Ontology** Program) |
| `shared` | Cross-domain concepts (reserved) | Future |

Domain is inferred from `entity_type` when not explicitly set (`lib/entity-model.js`).

---

## 3. Entity Types

### 3.1 Required Fields

Every first-class entity **must** provide:

| Field | Requirement |
|-------|-------------|
| `id` | Stable internal identifier (taxonomy nodes) or equivalent unique key |
| `slug` | URL-safe canonical identifier; unique within entity type; may change for SEO |
| `entity_type` | One of the supported types below |
| `domain` | `wine`, `culinary`, or `shared` |

**Food Ontology IDs:** Culinary entities use dot-separated permanent identifiers (e.g. `food.protein.beef.ribeye`). Slugs serve URLs; IDs serve graph permanence. See [`ONTOLOGY-02A_ARCHITECTURE.md`](ONTOLOGY-02A_ARCHITECTURE.md) §7.1.

Catalog entities (styles, regions, serving, techniques) additionally carry editorial fields (`name`, `summary`, `faq`, etc.) defined per catalog schema. Generators read catalogs only — never hardcoded entity lists.

### 3.2 Wine Domain — Active

| Entity Type | Description | Count | SSOT |
|-------------|-------------|-------|------|
| `descriptor` | Sensory, structural, or stylistic tasting term | 187 | `data/wine-taxonomy.json` |
| `descriptor_category` | Top-level descriptor hub (Body, Fruit, Tannin, etc.) | 12 | `data/wine-taxonomy.json` |
| `descriptor_group` | Mid-level hierarchy node within a category | 10 | `data/wine-taxonomy.json` |
| `grape_variety` | Grape variety entity | 5 | Grape catalog |
| `wine_style` | Wine style entity (Tier 1 launch set) | 28 | `data/wine-style-catalog.json` |
| `wine_region` | Geographic wine region (country → appellation hierarchy) | 51 | `data/wine-region-catalog.json` |
| `wine_serving` | Serving temperature, glassware, decanting, cellaring, mistakes | 40 | `data/wine-serving-catalog.json` |
| `winemaking_technique` | Production technique entity | 60 | `data/winemaking-technique-catalog.json` |
| `wine_fault` | Causal wine fault entity (TCA, oxidation, brett, etc.) | 30 | `data/wine-fault-catalog.json` |

**Note:** `serving` and `glassware` are registered legacy types. All serving entities use `wine_serving` in practice (glassware is a serving family, not a separate entity class).

### 3.3 Culinary Domain — Planned (Food Ontology)

Architecture specification: [`ONTOLOGY-02A_ARCHITECTURE.md`](ONTOLOGY-02A_ARCHITECTURE.md)

| Entity Type | Description | Project |
|-------------|-------------|---------|
| `protein_category` | Top-level protein foods hub (Animal, Plant) | 02A |
| `protein_group` | Mid-level hub (Beef, Seafood, Legumes) | 02A |
| `protein_food` | First-class protein food entity (Ribeye, Salmon, Tofu) | 02A |
| `cooking_method` | Grilling, roasting, braising, frying, smoking | 02B |
| `vegetable`, `fruit`, `mushroom` | Ingredient entities | 02C |
| `herb`, `spice` | Herbs and spices | 02D |
| `sauce` | Compositional sauce entities | 02E |
| `cheese` | Cheese entities | 02F |
| `cuisine` | Regional culinary tradition | 02G |
| `dish` | Convergence entity (protein_food + ingredient + sauce + technique) | 02H |
| `food` | General food entity (reserved) | Future |

Culinary entity types are registered in the entity model but have **zero active instances** until the Food Ontology Program begins with ONTOLOGY-02A.

**Food catalog fields (02A):** `protein_food` entities require `scientific_name` (empty string if unknown — field reserved for future nutrition, sustainability, and multilingual use).

---

## 4. Relationship Types

### 4.1 Canonical SSOT

All relationship types are declared in `data/relationship-types.json`. **53 canonical types** are registered (Ontology Foundation v1.0).

No relationship type may be invented in application code, catalogs, or generators. New types require a foundation release and SSOT update.

Each relationship type defines:

| Property | Meaning |
|----------|---------|
| `id` | Canonical type identifier (snake_case) |
| `category` | Semantic grouping |
| `allowed_sources` | Legal source entity types |
| `allowed_targets` | Legal target entity types |
| `reverse` | Reverse relationship type (if any) |
| `requires_reverse` | Whether the reverse edge must exist |
| `symmetric` | Whether A→B implies B→A with same type |

Validation: `lib/relationship-model.js` → `isAllowedRelationship()`, `validateTypedEdge()`.

### 4.2 Relationship Categories

| Category | Types | Purpose |
|----------|-------|---------|
| Hierarchy | `parent_of`, `child_of`, `contains`, `contained_in` | Taxonomy and geography trees |
| Geography | `produced_in`, `located_in`, `originates_from` | Style/region placement |
| Wine Structure | `typically_has`, `typically_exhibits`, `commonly_displays`, `commonly_expresses` | Style/region → descriptor expression |
| Pairing | `pairs_with`, `pairs_best_with`, `avoid_pairing_with`, `enhances`, `enhanced_by`, `balances`, `balanced_by`, `contrasts_with` | Wine ↔ food pairing semantics |
| Serving | `recommended_glass`, `recommended_temperature`, `recommended_decanting`, `recommended_cellaring`, `recommended_aging`, `recommended_for`, `served_in`, `served_at`, `aged_by` | Style ↔ serving guidance |
| Descriptor | `creates_descriptor`, `reduces_descriptor`, `enhances_descriptor`, `related_descriptor`, `opposite_descriptor`, `confused_with`, `increases_perception_of` | Descriptor graph and production effects |
| Similarity | `similar_to`, `alternative_to`, `substitute_for` | Substitution and style similarity |
| Composition | `contains_grape`, `made_from`, `blend_component` | Style ↔ grape composition |
| Region | `typical_of_region`, `grown_in`, `common_in_region` | Region ↔ style/grape geography |
| Miscellaneous | `requires`, `influences`, `influenced_by`, `derived_from`, `associated_with`, `causes`, `caused_by`, `common_in`, `reduces` | Cross-cutting and future-ready semantics |

### 4.3 Complete Relationship Registry

| ID | Category | Symmetric | Reverse |
|----|----------|-----------|---------|
| `parent_of` | hierarchy | — | `child_of` |
| `child_of` | hierarchy | — | `parent_of` |
| `contains` | hierarchy | — | `contained_in` |
| `contained_in` | hierarchy | — | `contains` |
| `produced_in` | geography | — | `typical_of_region` |
| `located_in` | geography | — | `contains` |
| `originates_from` | geography | — | `associated_with` |
| `typically_has` | wine_structure | — | `associated_with` |
| `typically_exhibits` | wine_structure | — | `associated_with` |
| `commonly_displays` | wine_structure | — | `associated_with` |
| `commonly_expresses` | wine_structure | — | `associated_with` |
| `pairs_with` | pairing | ✓ | `pairs_with` |
| `pairs_best_with` | pairing | — | `pairs_with` |
| `avoid_pairing_with` | pairing | — | `associated_with` |
| `enhances` | pairing | — | `enhanced_by` |
| `enhanced_by` | pairing | — | `enhances` |
| `balances` | pairing | — | `balanced_by` |
| `balanced_by` | pairing | — | `balances` |
| `contrasts_with` | pairing | ✓ | `contrasts_with` |
| `recommended_glass` | serving | — | `recommended_for` |
| `recommended_temperature` | serving | — | `recommended_for` |
| `recommended_decanting` | serving | — | `recommended_for` |
| `recommended_cellaring` | serving | — | `recommended_for` |
| `recommended_aging` | serving | — | `recommended_for` |
| `recommended_for` | serving | — | `recommended_glass` |
| `served_in` | serving | — | `recommended_for` |
| `served_at` | serving | — | `recommended_for` |
| `aged_by` | serving | — | `recommended_for` |
| `creates_descriptor` | descriptor | — | `derived_from` |
| `reduces_descriptor` | descriptor | — | `enhances_descriptor` |
| `enhances_descriptor` | descriptor | — | `reduces_descriptor` |
| `related_descriptor` | descriptor | ✓ | `related_descriptor` |
| `opposite_descriptor` | descriptor | ✓ | `opposite_descriptor` |
| `confused_with` | descriptor | ✓ | `confused_with` |
| `increases_perception_of` | descriptor | — | `reduces_descriptor` |
| `similar_to` | similarity | ✓ | `similar_to` |
| `alternative_to` | similarity | ✓ | `alternative_to` |
| `substitute_for` | similarity | — | `alternative_to` |
| `contains_grape` | composition | — | `blend_component` |
| `made_from` | composition | — | `blend_component` |
| `blend_component` | composition | — | `contains_grape` |
| `typical_of_region` | region | — | `produced_in` |
| `grown_in` | region | — | `common_in_region` |
| `common_in_region` | region | — | `grown_in` |
| `requires` | miscellaneous | — | `associated_with` |
| `influences` | miscellaneous | — | `influenced_by` |
| `influenced_by` | miscellaneous | — | `influences` |
| `derived_from` | miscellaneous | — | `creates_descriptor` |
| `associated_with` | miscellaneous | ✓ | `associated_with` |
| `causes` | miscellaneous | — | `caused_by` |
| `caused_by` | miscellaneous | — | `causes` |
| `common_in` | miscellaneous | — | `typical_of_region` |
| `reduces` | miscellaneous | — | `enhances` |

---

## 5. Relationship Semantics

This section defines **meaning**, not just legality. When in doubt, consult `allowed_sources` / `allowed_targets` in the SSOT.

### 5.1 Wine Structure Relationships

**`typically_exhibits`** — A wine style or grape variety characteristically shows a descriptor in its profile.

- Source: `wine_style`, `grape_variety`
- Target: `descriptor`
- Example: Cabernet Sauvignon `typically_exhibits` → `firm`
- Use when: the descriptor is a defining structural or aromatic trait of the style.

**`commonly_expresses`** — A region characteristically produces wines showing a descriptor.

- Source: `wine_region`, `wine_style`
- Target: `descriptor`
- Example: Burgundy `commonly_expresses` → `elegant`
- Use when: the descriptor is associated with regional typicity, not a single style.

### 5.2 Production & Fault Relationships

**`creates_descriptor`** — A winemaking technique or fault actively produces or amplifies a sensory descriptor.

- Source: `winemaking_technique`, `wine_fault`
- Target: `descriptor`
- Example: Malolactic Fermentation `creates_descriptor` → `buttery`
- Use when: there is a causal production link.

**`reduces_descriptor`** — A technique or fault diminishes a descriptor's presence or perception.

- Source: `winemaking_technique`, `wine_fault`
- Target: `descriptor`
- Example: Cold stabilization `reduces_descriptor` → `hazy`
- Use when: the process suppresses or removes a characteristic.

**`common_in`** — A technique or fault is routinely practiced or observed in a style or region.

- Source: `winemaking_technique`, `wine_fault`
- Target: `wine_style`, `wine_region`
- Example: Carbonic maceration `common_in` → Beaujolais region
- Use when: geographic or stylistic prevalence — **not** sensory expression.

**`causes`** — A fault or technique directly causes another fault or descriptor effect.

- Source: `wine_fault`, `wine_serving`, `winemaking_technique`
- Target: `descriptor`, `wine_fault`

### 5.3 Serving Relationships

**`recommended_glass`**, **`recommended_temperature`**, **`recommended_decanting`**, **`recommended_cellaring`**, **`recommended_aging`** — A wine style has a specific serving recommendation.

- Source: `wine_style` only
- Target: `wine_serving` only
- Each type is specific. Do not use `associated_with` when a dedicated serving type applies.

**`recommended_for`** — A serving entity is appropriate for a wine style (reverse direction).

- Source: `wine_serving`
- Target: `wine_style`

### 5.4 Geography Relationships

**`produced_in`** — A wine style is made in a region.

- Source: `wine_style` → Target: `wine_region`
- Reverse: `typical_of_region`

**`common_in_region`** — A grape variety or serving practice is common in a region.

- Source: `wine_region`, `wine_serving`
- Target: `grape_variety`, `wine_serving`

### 5.5 Similarity & Substitution

**`similar_to`** — Entities share enough character to be compared or confused.

- Symmetric. Used for styles, regions, grapes, descriptors, techniques.
- Example: Nebbiolo `similar_to` → Sangiovese

**`substitute_for`** — A style can stand in for another in pairing or selection.

- Source/target: `wine_style` only
- Example: Merlot `substitute_for` → Cabernet Sauvignon

**`alternative_to`** — A grape or style is a viable alternative choice.

- Source/target: `wine_style`, `grape_variety`

### 5.6 Pairing Relationships

**`pairs_with`** — General pairing affinity (symmetric).

- Sources: `wine_style`, `wine_region`, `grape_variety`, `protein`, `food`
- Targets: `pairing`, `protein`, `food`, `wine_style`

**`pairs_best_with`** — Primary pairing recommendation (stronger than `pairs_with`).

- Source: `wine_style`, `wine_region`, `grape_variety`
- Target: `pairing`, `protein`, `food`

### 5.7 Distinguishing Commonly Confused Types

#### `typically_exhibits` vs `commonly_expresses` vs `creates_descriptor`

| Type | Direction | Meaning |
|------|-----------|---------|
| `typically_exhibits` | Style/grape → descriptor | The entity **characteristically shows** this trait |
| `commonly_expresses` | Region/style → descriptor | The entity **tends to produce** wines with this trait |
| `creates_descriptor` | Technique/fault → descriptor | The process **causally creates** this trait |

Cabernet Sauvignon `typically_exhibits` tannin. Burgundy `commonly_expresses` elegance. Malolactic fermentation `creates_descriptor` buttery notes. These are not interchangeable.

#### `associated_with` vs `common_in` vs `typically_exhibits`

| Type | Strength | Meaning |
|------|----------|---------|
| `typically_exhibits` | Strong, sensory | Defining trait of a style or grape |
| `common_in` | Geographic/stylistic prevalence | Technique or fault is routinely found in a style/region |
| `associated_with` | Weak, general | Loose co-occurrence without specific semantic commitment |

**Rule:** Use the most specific relationship type available. `associated_with` is a fallback when no dedicated type applies. Do not use `associated_with` when `recommended_glass`, `creates_descriptor`, or `common_in` is the correct semantic.

Examples:
- MLF → Chardonnay: `common_in` (prevalence), not `associated_with`
- MLF → buttery: `creates_descriptor`, not `associated_with`
- Bordeaux glass → Cabernet: via `recommended_glass` on the style, not `associated_with`

#### `similar_to` vs `confused_with` vs `substitute_for`

| Type | Meaning |
|------|---------|
| `similar_to` | Comparable character; may be stylistic kinship |
| `confused_with` | Frequently mistaken for one another (educational) |
| `substitute_for` | Practical replacement in pairing or selection |

---

## 6. Evidence Model

Typed relationships may optionally carry evidence (Architecture Rule #3).

### 6.1 Schema

```json
{
  "evidence": {
    "reason": [
      { "kind": "descriptor", "slug": "full-bodied" },
      { "kind": "descriptor", "slug": "firm" }
    ],
    "confidence": "high",
    "notes": ""
  }
}
```

All evidence fields are **optional**. Missing evidence is not an error.

### 6.2 Fields

| Field | Type | Requirement |
|-------|------|-------------|
| `reason` | Array of entity references | Preferred over free text. Each entry: `{ kind, slug }` |
| `confidence` | `high` \| `medium` \| `low` | Controlled vocabulary |
| `notes` | String | Free text only when no entity reference exists |

### 6.3 Valid Reason Entity Kinds

`descriptor`, `descriptor_group`, `wine_style`, `wine_region`, `wine_serving`, `grape_variety`, `pairing`, `winemaking_technique`, `wine_fault`

Evidence SSOT: `data/relationship-evidence.json`  
Helpers: `lib/relationship-evidence.js`

### 6.4 Rules

1. Evidence references ontology entities whenever possible.
2. Free text is reserved for `notes` when no entity exists.
3. Reason entities must resolve to existing graph nodes.
4. Self-referential reasons are forbidden.
5. Duplicate reason entries on a single edge are forbidden.

---

## 7. Graph Rules

These rules follow from relationship type constraints and validation logic. They are enforced at build time.

### 7.1 Structural Rules

1. **Only declared entity types are valid.** Unknown `entity_type` values fail validation.
2. **Only declared relationship types are valid.** Unknown `type` values fail validation.
3. **Source/target legality is enforced.** Every edge must pass `isAllowedRelationship(source, type, target)`.
4. **No duplicate explicit edges.** Same source + type + target may not appear twice.
5. **Required reverses must exist.** Types with `requires_reverse: true` must have their reverse edge present (explicit or inferred).
6. **No hierarchy cycles.** `parent_of`, `child_of`, `contains`, `contained_in` must not form loops.
7. **All edge targets must resolve.** Broken slugs fail graph validation (`validateGraphEdges()`).
8. **Orphan policy.** Catalog entities (styles, regions, serving, techniques) must have ≥1 graph edge. Descriptors are exempt from orphan checks (connected via taxonomy hierarchy).

### 7.2 Semantic Prohibitions

These are enforced by `allowed_sources` / `allowed_targets`:

| Prohibited | Why |
|------------|-----|
| Descriptors → regions (`produced_in`, `common_in`, etc.) | No relationship type allows `descriptor` as source to `wine_region` |
| Regions → `creates_descriptor` → descriptors | `creates_descriptor` sources are `winemaking_technique`, `wine_fault` only |
| Serving → `contains_grape` → grapes | Composition types source from `wine_style` only |
| Serving → `produced_in` → regions | Geography types source from `wine_style`, `grape_variety` |
| Grapes → `recommended_glass` → serving | Serving recommendation types source from `wine_style` only |
| Techniques → `pairs_with` → food | Pairing types require `wine_style`, `wine_region`, or `grape_variety` as wine-side sources |

When a desired connection is not supported, the correct action is to propose a new relationship type in a foundation release — not to misuse an existing type.

### 7.3 Graph-First Rule (Ontology Rule #1)

Every new domain must be **graph-first, never page-first**:

```
Entity schema → Catalog (SSOT) → Relationships → Validation → Generator → Pages → Search → Structured data
```

Pages are generated outputs. The catalog and relationship graph are the source of truth.

### 7.4 Architecture Freeze Rule

**Ontology Foundation v1.0 is frozen.**

Knowledge phases (01D, 01E, Phase II culinary) may:

- Add entities to existing catalogs
- Add relationships using existing canonical types
- Add evidence annotations
- Extend `allowed_sources` / `allowed_targets` when a new entity type requires existing relationship types (minimal SSOT vocabulary extension)

Knowledge phases may **not**:

- Introduce new relationship type categories without a foundation release
- Replace the graph engine, entity model, or evidence schema
- Modify pairing engine scoring logic during ontology expansion
- Create parallel knowledge systems outside the graph

---

## 8. Version Rules

PairingMethod versions platform and knowledge independently.

### 8.1 Ontology Foundation v1.x

Tracks semantic infrastructure:

- Entity model (`lib/entity-model.js`)
- Relationship model (`data/relationship-types.json`, `lib/relationship-model.js`)
- Evidence layer (`data/relationship-evidence.json`)
- Graph engine (`lib/graph-engine.js`)
- Runtime API (`lib/graph-runtime.js`)
- Validation framework (`scripts/validate-ontology-*.js`)
- Coverage dashboard (`scripts/ontology-coverage-report.js`)

**Current:** v1.0 — Frozen (01C.5 + 01C.6)

Foundation releases are rare. A v1.1 foundation release would require explicit architectural justification.

### 8.2 Wine Ontology v1.x

Tracks wine domain knowledge. Catalogs carry `wine_ontology_version` when applicable.

| Version | Milestone | Status |
|---------|-----------|--------|
| v1.1 | Descriptors (KNOWLEDGE-02/03/04) | Complete |
| v1.2 | Wine Styles (ONTOLOGY-01A) | Complete |
| v1.3 | Wine Regions (ONTOLOGY-01B) | Complete |
| v1.4 | Serving & Service (ONTOLOGY-01C) | Complete |
| v1.5 | Winemaking Techniques (ONTOLOGY-01D) | Complete |
| v1.6 | Wine Faults (ONTOLOGY-01E) | Planned |

### 8.3 Culinary Ontology v2.x

Culinary domain knowledge uses v2.x versioning to distinguish it from the wine domain. Not yet started.

### 8.4 Future Domains

Additional domains (e.g., spirits, beer, cheese-as-primary) receive independent semantic version tracks. They consume Ontology Foundation v1.0 unless a foundation upgrade is explicitly approved.

---

## 9. Knowledge Density Rules

Knowledge density measures how interconnected and useful the graph is — not merely how large.

### 9.1 Core Metrics

Computed by `lib/graph-maturity.js` → `reports/ontology-coverage.json`:

| Metric | Definition |
|--------|------------|
| **Total entities** | First-class catalog entities: descriptors + grapes + styles + regions + serving + techniques |
| **Total relationships** | Sum of domain graph edge counts (legacy bucket model) |
| **Explicit typed edges** | Count of canonical semantic edges before inferred reverses |
| **Graph density** | `explicit_typed_edges / total_entities` |
| **Avg relationships / entity** | `total_relationships / total_entities` |
| **Fully connected %** | Percentage of catalog entities with ≥5 graph edges |
| **Orphan entities** | Catalog entities with zero graph edges (excluding descriptor and serving exemptions) |
| **Broken graph edges** | Edges referencing non-existent target slugs |
| **Evidence coverage %** | `relationships_with_evidence / explicit_typed_edges` |

### 9.2 Quality Thresholds

Every ontology phase must maintain:

| Threshold | Requirement |
|-----------|-------------|
| Orphan entities | 0 |
| Broken graph edges | 0 |
| Anonymous edges | 0 (all relationships typed) |
| Validation errors | 0 |

### 9.3 Ontology Impact Report

Every phase must also report enrichment impact (see [`ONTOLOGY_CHANGELOG.md`](ONTOLOGY_CHANGELOG.md) maintenance rules):

- Existing entities enriched (new relationships on pre-existing entities)
- Cross-domain relationships added
- Graph connectivity change (fully-connected %, density delta)

---

## 10. Architecture Rules Summary

| Rule | Statement |
|------|-----------|
| **#1 Graph-first** | Entity → Catalog → Graph → Validation → Generator → Pages. Never page-first. |
| **#2 Relationships define meaning** | Entities define knowledge. Relationships define meaning. All types from SSOT. |
| **#3 Evidence is optional** | Relationships may optionally contain evidence. Entity references preferred over free text. |
| **Freeze** | Foundation v1.0 is frozen. Knowledge phases consume it; they do not replace it. |

---

## 11. SSOT File Index

| File | Purpose |
|------|---------|
| `data/wine-taxonomy.json` | Descriptor taxonomy (categories, groups, descriptors) |
| `data/wine-style-catalog.json` | Wine style entities |
| `data/wine-region-catalog.json` | Wine region entities |
| `data/wine-serving-catalog.json` | Serving & service entities |
| `data/winemaking-technique-catalog.json` | Winemaking technique entities |
| `data/relationship-types.json` | Canonical relationship type registry |
| `data/relationship-evidence.json` | Evidence annotation SSOT |
| `lib/entity-model.js` | Entity type and domain registry |
| `lib/relationship-model.js` | Relationship validation and reverse inference |
| `lib/typed-edges.js` | Catalog field → typed edge mapping |
| `lib/graph-engine.js` | Semantic graph builder and traversal |
| `lib/graph-runtime.js` | Consumer-facing traversal API |
| `lib/relationship-evidence.js` | Evidence validation and resolution |

---

## 12. Validation

Every ontology phase must pass its validation gate before release:

| Validator | Scope |
|-----------|-------|
| `validate:knowledge-04` | Descriptor graph integrity |
| `validate:ontology-01a` | Wine style entity graph |
| `validate:ontology-01b` | Wine region entity graph |
| `validate:ontology-01c` | Serving entity graph |
| `validate:ontology-01c5` | Semantic relationship layer |
| `validate:ontology-01c6` | Evidence layer |
| `validate:ontology-01d` | Winemaking technique entity graph |

A phase is not complete until:

1. All validators pass
2. `reports/ontology-coverage.json` is regenerated
3. [`ONTOLOGY_CHANGELOG.md`](ONTOLOGY_CHANGELOG.md) is updated
4. This specification is updated if new entity types or relationship types were added

---

## 13. Long-Term Documentation Set

Target documentation structure by end of Phase II:

```
docs/
├── README.md                      # Project overview
├── ONTOLOGY_CHANGELOG.md          # Knowledge evolution (history)
├── ONTOLOGY_SPECIFICATION.md      # This document (what is allowed)
├── ARCHITECTURE.md                # Platform architecture (planned)
├── GRAPH_MODEL.md                 # Entity model deep dive (planned)
├── RELATIONSHIP_REFERENCE.md      # Per-relationship reference (planned)
├── ENTITY_REFERENCE.md            # Per-entity-type reference (planned)
└── ROADMAP.md                     # Future phases (planned)
```

| Layer | Document | Question |
|-------|----------|----------|
| Project | README | What is PairingMethod? |
| Platform | ARCHITECTURE | How does the engine work? |
| Ontology | ONTOLOGY_SPECIFICATION | What is allowed? |
| History | ONTOLOGY_CHANGELOG | What changed? |
| Reference | ENTITY_REFERENCE, RELATIONSHIP_REFERENCE | What are the details of each type? |

---

*This specification is authoritative. When code and this document disagree, the SSOT files (`data/relationship-types.json`, domain catalogs, `lib/entity-model.js`) are the final arbiter — and this document must be updated to match.*
