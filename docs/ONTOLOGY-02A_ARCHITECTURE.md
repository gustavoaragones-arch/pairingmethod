# ONTOLOGY-02A — Architecture & Entity Specification

**Program:** Food Ontology  
**Project:** 02A — Protein Foods  
**Status:** Pre-implementation (architecture only)  
**Platform:** Ontology Foundation v1.0 (frozen) · Wine Ontology v2.0 (certified)

This document defines the architectural plan for the first Food Ontology domain. No implementation should begin until this specification is reviewed and accepted.

---

## 1. Purpose

PairingMethod is an **ontology-driven knowledge platform** whose first application is a wine pairing engine. ONTOLOGY-02A begins the **Food Ontology** — not a page-building exercise, but an entity graph expansion.

The design question for every culinary project is:

> **What entities belong in the food ontology?**

Pages, search indexes, structured data, generators, and internal links are **outputs** of the ontology — not the design target.

---

## 2. Platform Context

| Layer | Version | Status |
|-------|---------|--------|
| Ontology Foundation | v1.0 | Frozen — entity model, 53 relationship types, evidence layer, graph engine |
| Wine Ontology | v2.0 | Certified — 401 entities, 4,321 typed edges, 1 connected component, 0 orphans |
| Food Ontology | v1.0 (planned) | Not started — 02A Protein Foods is the first project |

ONTOLOGY-02A must consume Ontology Foundation v1.0 unchanged except for **blocker-only SSOT extensions** (entity type registration, relationship vocabulary expansion) documented in Section 7.

---

## 3. Food Ontology Program

**Food Ontology** is the knowledge program. Individual projects expand specific culinary domains on the shared semantic graph.

Every project independently satisfies the [Domain Completion Rule](ONTOLOGY_CHANGELOG.md#maintenance-rules) and the [Cross-Domain Connectivity Rule](ONTOLOGY_CHANGELOG.md#cross-domain-connectivity-rule) before the next project begins.

### Conceptual Domain Hierarchy

The Food Ontology comprises these knowledge domains:

```text
Food Ontology
├── Protein Foods        (02A)
├── Ingredients          (02C)
├── Herbs & Spices       (02D)
├── Cheeses              (02F)
├── Sauces               (02E)
├── Cooking Techniques   (02B)
├── Cuisines             (02G)
└── Dishes               (02H)
```

This is the long-term semantic map. Implementation order follows dependency constraints (see Roadmap).

### Implementation Roadmap

| Project | Domain | Rationale |
|---------|--------|-----------|
| **ONTOLOGY-02A** | Protein Foods | Foundational food entities; biological hierarchy |
| **ONTOLOGY-02B** | Cooking Techniques | Maillard, braising, grilling — descriptor-producing processes |
| **ONTOLOGY-02C** | Ingredients | Atomic culinary components — **must precede sauces** |
| **ONTOLOGY-02D** | Herbs & Spices | Aromatic and heat elements |
| **ONTOLOGY-02E** | Sauces | Compositional — mostly `contains` relationships to ingredients |
| **ONTOLOGY-02F** | Cheeses | Fermented dairy with regional and texture taxonomy |
| **ONTOLOGY-02G** | Cuisines | Regional culinary traditions |
| **ONTOLOGY-02H** | Dishes | Convergence nodes — protein foods + ingredients + sauces + techniques + cuisine |

### Why Ingredients Precede Sauces

A sauce is not atomic. Béarnaise contains butter, tarragon, shallot, and egg yolk. Pesto contains basil, garlic, pine nuts, parmesan, and olive oil.

If ingredients exist first, sauces become **mostly relationships**. If sauces come first, knowledge is duplicated.

### Why Dishes Come Last

A dish is a high-value reasoning node that connects everything:

```text
Beef Wellington
    ├── protein_food: beef tenderloin
    ├── technique: roasting, pastry
    ├── sauce: duxelles, red wine reduction
    ├── cuisine: British / French
    ├── descriptors: rich, umami, buttery
    └── wine_style: full-bodied red
```

Dishes require protein foods, techniques, ingredients, sauces, and cuisines to already exist in the graph.

---

## 4. Semantic Precision — Foods, Not Biochemical Proteins

The ontology models **foods**, not biochemical proteins.

| Example | What it is | What it is not |
|---------|------------|----------------|
| Ribeye | A protein **food** | A protein molecule |
| Chicken Breast | A protein **food** | A biochemical compound |
| Salmon Fillet | A protein **food** | A nutrient category |
| Tofu | A protein **food** | An abstract macronutrient |

### Program Name vs Entity Type

| Layer | Term | Meaning |
|-------|------|---------|
| Program | Food Ontology | The knowledge program |
| Project | 02A — Protein Foods | The first domain (protein-rich foods) |
| Entity types | `protein_category`, `protein_group`, `protein_food` | Ontology semantics |

The leaf entity type is **`protein_food`**, not `protein`. This avoids semantic collisions:

- `contains_protein` (biochemical composition) means something very different from
- `is_a_protein_food` (culinary classification via `child_of` hierarchy)

The legacy `protein` entity type registered in the foundation model is **superseded** by `protein_food` for all 02A leaf entities. Do not create leaf entities with `entity_type: "protein"`.

### Future Dual Classification

When Ingredients ship (02C), the same food item may appear in multiple roles:

```text
Chicken Breast
    ├── protein_food  (when the subject is the main protein on the plate)
    └── ingredient    (when the subject is a component in a sauce or dish)
```

Separating `protein_food` from `ingredient` makes this dual context expressible without equating food cuts with abstract ingredients or biochemical proteins.

---

## 5. ONTOLOGY-02A Scope

### Target

| Metric | Target |
|--------|--------|
| First-class `protein_food` entities | **120–180** |
| Hierarchy depth | 3 levels (category → group → food) |
| Connected components | 1 (integrate with Wine Ontology graph) |
| Orphan entities | 0 |
| Search coverage | ≥ 99% |
| Structured data coverage | ≥ 99% |

### Design Principle

Mirror the descriptor taxonomy pattern that succeeded in Wine Ontology v1.1:

```text
protein_category  →  protein_group  →  protein_food
     (hub)              (hub)              (entity page)
```

This is the same structural insight as `descriptor_category → descriptor_group → descriptor`.

---

## 6. Protein Foods Taxonomy

### Top-Level Categories (2)

| Slug | Name | Role |
|------|------|------|
| `animal-protein` | Animal Protein Foods | Meat, poultry, game, seafood |
| `plant-protein` | Plant Protein Foods | Legumes, soy, seitan, nuts |

### Groups & Entities (Tier 1 launch set)

Target **~15 groups** and **~120–180 leaf entities**. The table below defines the launch taxonomy. Leaf counts are approximate targets for catalog bootstrap.

#### Animal Protein Foods

| Group | Slug | Example Leaf Entities (`protein_food`) |
|-------|------|------------------------------------------|
| **Beef** | `beef` | ribeye, striploin, tenderloin, brisket, flank, chuck, short-rib, sirloin, round, oxtail, beef-cheek |
| **Pork** | `pork` | belly, loin, shoulder, tenderloin, ham, chop, rib, sausage-meat |
| **Lamb** | `lamb` | leg, rack, shoulder, shank, chop, ground-lamb |
| **Veal** | `veal` | cutlet, shank, chop, tenderloin |
| **Poultry** | `poultry` | chicken-breast, chicken-thigh, chicken-wing, duck-breast, duck-leg, turkey-breast, quail |
| **Game** | `game` | venison, rabbit, pheasant, squab, wild-boar |
| **White Fish** | `white-fish` | cod, halibut, sole, flounder, sea-bass, snapper, haddock, turbot |
| **Oily Fish** | `oily-fish` | salmon, tuna, mackerel, sardine, anchovy, trout, herring |
| **Shellfish** | `shellfish` | shrimp, lobster, crab, mussels, clams, oysters, scallops, langoustine |
| **Cephalopod** | `cephalopod` | squid, octopus, cuttlefish |

#### Plant Protein Foods

| Group | Slug | Example Leaf Entities (`protein_food`) |
|-------|------|------------------------------------------|
| **Soy & Alternates** | `soy-protein` | tofu, tempeh, seitan, edamame |
| **Legumes** | `legumes` | lentils, chickpeas, black-beans, kidney-beans, cannellini-beans |
| **Nuts & Seeds** | `nuts-seeds` | almonds, walnuts, cashews, pumpkin-seeds (protein-forward foods) |

### Hierarchy Rules

1. Every **`protein_food`** has exactly one `child_of` parent group.
2. Every **`protein_group`** has exactly one `child_of` parent category.
3. Categories are hub pages only — they do not participate in pairing edges directly.
4. Groups may carry summary editorial content and act as browse hubs.
5. Cross-group similarity (e.g. ribeye ↔ lamb rack) uses `similar_to`, not hierarchy.

### Slug Conventions

- Lowercase, hyphenated: `chicken-breast`, `short-rib`
- Group slugs are singular domain nouns: `beef`, `shellfish`
- Category slugs: `animal-protein`, `plant-protein`
- No slug may collide with wine entity slugs (validate at bootstrap)

---

## 7. Entity Schema

### New Entity Types (blocker — register before implementation)

| Entity Type | Domain | Description | Page Pattern |
|-------------|--------|-------------|--------------|
| `protein_category` | culinary | Top-level browse hub (Animal, Plant) | `/proteins/{slug}/` |
| `protein_group` | culinary | Mid-level hub (Beef, Seafood, Legumes) | `/proteins/{slug}/` |
| `protein_food` | culinary | First-class pairing food (Ribeye, Salmon, Tofu) | `/proteins/{slug}/` |

Registration targets: `lib/entity-model.js`, `data/wine-taxonomy.json` meta.supported_entity_types (global registry), ontology coverage dashboard.

### Catalog SSOT

**Primary file:** `data/protein-food-catalog.json`

```jsonc
{
  "meta": {
    "phase": "ONTOLOGY-02A",
    "tier": 1,
    "catalog_version": "1.0.0",
    "entity_type": "protein_food",
    "description": "Tier 1 Food Ontology — protein food entities with biological hierarchy.",
    "entity_count": 0,
    "food_ontology_version": "1.0",
    "wine_ontology_version": "2.0",
    "ontology_foundation_version": "1.0.0"
  },
  "categories": [],
  "groups": [],
  "protein_foods": []
}
```

Every catalog is versioned independently. `catalog_version` tracks schema and content revisions for migrations and validation. `food_ontology_version` tracks knowledge program releases; `wine_ontology_version` records the wine graph the food catalog was built against.

### Ontology Identity Rule

Every ontology entity must have **three distinct identities**:

| Identity | Field | Purpose | Mutable? |
|----------|-------|---------|----------|
| Ontology ID | `id` | Permanent graph identity | ❌ Never |
| Slug | `slug` | Public URL / SEO | ✅ Yes |
| Display Name | `name` | Human-readable label | ✅ Yes |

Example:

```jsonc
{
  "id": "food.protein.beef.ribeye",
  "slug": "ribeye",
  "name": "Ribeye Steak"
}
```

If the display name changes to "Boneless Ribeye Steak" or the slug changes to `boneless-ribeye`, the ontology `id` **never changes**. Graph edges, evidence annotations, and external references remain stable.

This distinction becomes critical as the graph grows to thousands of entities.

### Reserved Fields (all entity levels)

| Field | Requirement | Purpose |
|-------|-------------|---------|
| `scientific_name` | Required on `protein_food`; `""` if unknown | Nutrition, sustainability, regional naming, multilingual |
| `external_ids` | Required; `{}` if empty | External integrations separate from ontology IDs |

```jsonc
"external_ids": {}

// Future example:
"external_ids": {
  "wikidata": "Q12345",
  "usda_fooddata": "...",
  "gbif": "...",
  "itis": "..."
}
```

Do not store external system identifiers in `id` or `slug`. Ontology IDs are PairingMethod-native and permanent.

### Required Fields — All Nodes

| Field | Requirement |
|-------|-------------|
| `id` | **Stable ontology identifier** — permanent, never changes on slug rename (see §7.1) |
| `slug` | URL-safe identifier; unique within entity type; may change for SEO |
| `name` | Display name |
| `entity_type` | `protein_category`, `protein_group`, or `protein_food` |
| `domain` | `culinary` |
| `summary` | 2–4 sentences, pairing-relevant |
| `scientific_name` | On `protein_food` only; `""` if unknown |
| `external_ids` | Object; `{}` if empty — reserved for wikidata, USDA, GBIF, ITIS, etc. |

### 7.1 Stable Ontology Identifiers

See **Ontology Identity Rule** above. Every entity carries `id` (immutable), `slug` (mutable URL key), and `name` (mutable display label).

#### ID Format

```text
food.protein.{group}.{entity}
```

| Entity Level | Pattern | Examples |
|--------------|---------|----------|
| Category | `food.protein.{category}` | `food.protein.animal`, `food.protein.plant` |
| Group | `food.protein.{group}` | `food.protein.beef`, `food.protein.shellfish` |
| Food | `food.protein.{group}.{entity}` | `food.protein.beef.ribeye`, `food.protein.pork.belly`, `food.protein.seafood.salmon`, `food.protein.plant.tofu` |

Rules:

1. IDs are lowercase, dot-separated, immutable once assigned.
2. IDs do not appear in public URLs — slugs do.
3. Graph edges, evidence, and internal references use `id` where stability matters; slugs remain the public lookup key for pages and search.
4. Validation must reject duplicate IDs across the full ontology (wine + food).

#### Example Catalog Entry

```jsonc
{
  "id": "food.protein.beef.ribeye",
  "slug": "ribeye",
  "name": "Ribeye",
  "entity_type": "protein_food",
  "domain": "culinary",
  "parent_group": "beef",
  "scientific_name": "Bos taurus",
  "external_ids": {},
  "summary": "..."
}
```

### Required Fields — `protein_food` Entities

| Field | Requirement |
|-------|-------------|
| `parent_group` | Slug of parent `protein_group` |
| `scientific_name` | Binomial or common scientific name; **empty string `""` if unknown** (field reserved — do not omit) |
| `external_ids` | Object; **`{}` if empty** (field reserved — do not omit) |
| `aliases` | Search aliases (e.g. "NY strip" → striploin) |
| `fat_content` | `lean` \| `moderate` \| `rich` |
| `texture` | Primary texture descriptor slugs (e.g. tender, firm, flaky) |
| `typical_descriptors` | Descriptor slugs the food commonly expresses or pairs with |
| `wine_pairings` | Slugs of `wine_style` entities with tier (`primary` \| `secondary`) |
| `avoid_wine_pairings` | Wine styles or contexts to avoid |
| `similar_foods` | Substitute / similarity slugs (other `protein_food` entities) |
| `beginner_notes` | Plain-language explainer |
| `faq` | ≥ 2 Q&A pairs |
| `seo_title` | Unique, no marketing language |
| `seo_description` | 150–160 characters |

### Optional Fields — `protein_food` Entities

| Field | Purpose |
|-------|---------|
| `cooking_affinities` | Reserved for 02B — cooking method slugs |
| `sauce_affinities` | Reserved for 02E — sauce slugs |
| `cuisine_context` | Reserved for 02G — cuisine slugs |
| `evidence_refs` | Relationship evidence annotation IDs |

### Hub Fields — `protein_category` / `protein_group`

| Field | Requirement |
|-------|-------------|
| `introduction` | Category/group overview |
| `child_slugs` | Ordered list of child group or protein_food slugs |
| `seo_title`, `seo_description` | Required |
| `faq` | ≥ 2 for groups; optional for categories |

---

## 8. Relationship Mapping

**Rule:** Reuse existing canonical types wherever they accurately express the meaning. Introduce new types only for genuine semantic gaps.

### Proposed Mappings (02A)

| Intent | Canonical Type | Direction | Notes |
|--------|----------------|-----------|-------|
| Hierarchy (group → category) | `child_of` | group → category | **Extend** allowed_sources/targets to protein food types |
| Hierarchy (food → group) | `child_of` | protein_food → group | Same extension |
| Wine pairing | `pairs_best_with` | wine_style → protein_food | **Extend** allowed_targets to `protein_food` |
| Wine pairing (reverse) | `pairs_with` | protein_food ↔ wine_style | Symmetric exploration paths |
| Avoid pairing | `avoid_pairing_with` | wine_style → protein_food | **Extend** allowed_targets |
| Sensory character | `typically_exhibits` | protein_food → descriptor | **Extend** allowed_sources to `protein_food` |
| Similar substitute | `similar_to` | protein_food ↔ protein_food | **Extend** allowed_sources/targets |
| Alternative cut | `substitute_for` | protein_food → protein_food | **Extend** for culinary entities |
| Cross-association | `associated_with` | protein_food ↔ wine_region, etc. | General association |
| Enhances wine | `enhances` | protein_food → descriptor | Fat content softens tannin reasoning |
| Contrasts | `contrasts_with` | protein_food ↔ wine_style | **Extend** targets if needed |
| Balances | `balances` | wine_style → protein_food | Acid/fat balance reasoning |

### Reserved for Future Projects (do not implement in 02A)

| Intent | Likely Type | Project |
|--------|-------------|---------|
| Sauce composition | `contains` | 02E — sauce → ingredient |
| Cooking method affinity | `influences` / `influenced_by` | 02B |
| Cuisine tradition | `common_in` / regional pattern | 02G |
| Dish composition | `contains` (dish → protein_food, ingredient, sauce) | 02H |
| Dual food role | `associated_with` or typed reification | 02C — protein_food ↔ ingredient |

### SSOT Vocabulary Extensions (blocker checklist)

Before bootstrap, update `data/relationship-types.json`:

1. `child_of` / `parent_of` — add `protein_category`, `protein_group`, `protein_food`
2. `typically_exhibits` — add `protein_food` to allowed_sources
3. `similar_to` — add `protein_food` to allowed_sources/targets
4. `substitute_for` — add `protein_food` to allowed_sources/targets
5. `pairs_with` / `pairs_best_with` / `avoid_pairing_with` — add `protein_food` to allowed targets
6. `enhances`, `balances`, `contrasts_with` — add `protein_food` where culinary sources/targets apply
7. `confused_with` — add `protein_food` for disambiguation (e.g. tuna vs tuna steak)

No new canonical relationship types are required for 02A if the above extensions are applied.

---

## 9. Evidence Model

Follow the Wine Ontology evidence pattern established in ONTOLOGY-01C.6.

### 02A Evidence Priorities

| Relationship | Evidence Rationale | Target Count |
|--------------|-------------------|-------------|
| `pairs_best_with` (style → protein_food) | Core pairing claims | 40–60 |
| `typically_exhibits` (protein_food → descriptor) | Sensory reasoning | 30–50 |
| `enhances` (protein_food → descriptor) | Tannin-fat, acid-richness mechanics | 20–30 |
| `avoid_pairing_with` | Counterexample reasoning | 10–15 |

### Evidence Schema

Reuse `data/relationship-evidence.json` annotation format:

```jsonc
{
  "source_kind": "protein_food",
  "source": "ribeye",
  "relationship": "pairs_best_with",
  "target_kind": "wine_style",
  "target": "cabernet-sauvignon",
  "confidence": "high",
  "reason_entities": ["firm", "structured", "full-bodied"],
  "rationale": "High marbling and fat in ribeye bind with Cabernet tannin, softening astringency."
}
```

### Confidence Guidelines

| Level | When to use |
|-------|-------------|
| `high` | Classical pairing principle (tannin + fat, acid + richness) |
| `medium` | Widely accepted but context-dependent |
| `low` | Emerging or style-variant (avoid in 02A launch set) |

---

## 10. Implementation Lifecycle

Every Food Ontology project follows this sequence — **no shortcuts**:

```text
protein-food-catalog.json   (SSOT — begin here)
        ↓
bootstrap
        ↓
validator
        ↓
relationship mapper
        ↓
generator
        ↓
pages
        ↓
search
        ↓
knowledge density report
        ↓
certification
```

The Wine Ontology proved this lifecycle works. Do not generate pages, search indexes, or structured data before the catalog and typed relationships exist.

### Planned Artifacts

| Artifact | Path |
|----------|------|
| Catalog SSOT | `data/protein-food-catalog.json` |
| Bootstrap catalog | `scripts/bootstrap-protein-food-catalog.js` |
| Bootstrap evidence | `scripts/bootstrap-protein-food-evidence.js` |
| Lib context | `lib/taxonomy-protein-food.js` |
| Lib render | `lib/taxonomy-protein-food-render.js` |
| Typed edges | `lib/typed-edges.js` (extend) |
| Generator | `scripts/generate-protein-foods.js` |
| Template | `templates/protein-food-template.html` |
| Validation | `scripts/validate-ontology-02a.js` |
| Search index | `assets/js/protein-food-search-index.js` |
| Graph report | `reports/protein-food-graph-edges.json` |
| Certification | `reports/food-ontology-02a-certification.json` |
| Public URL helper | `lib/public-url.js` (`proteinFoodUrl`) |
| Semantic entry | `assets/js/semantic-entry.js` (wire search) |

### Protected Surfaces (must not change)

- `index.html` — homepage
- `assets/js/pairing-engine.js` — scoring logic
- Ontology Foundation primitives — no new relationship types without gap analysis

---

## 11. Knowledge Density Targets

Based on Wine Ontology domain integration benchmarks:

| Metric | Minimum Target | Aspirational |
|--------|---------------|--------------|
| Typed edges (protein foods domain) | 800 | 1,200+ |
| Avg edges / protein_food entity | 8.0 | 12.0+ |
| Cross-domain edges (protein_food ↔ wine) | 200 | 400+ |
| Evidence annotations | 50 | 100+ |
| Evidence coverage | 3% | 5% |
| Graph density (post-02A) | ≥ 11.0 | ≥ 12.0 |
| Connected components | 1 | 1 |
| Orphan entities | 0 | 0 |
| Fully connected protein_food entities | 60% | 75% |

---

## 12. Cross-Domain Connectivity Rule

Every new Food Ontology entity must connect to **at least one Wine Ontology entity** before domain certification.

Domains may be internally complete but **must not be externally isolated**. The Food Ontology exists to enrich and explain wine pairing through explicit, traversable relationships — not as a standalone culinary encyclopedia.

### Required Wine Ontology Connections (02A)

Every `protein_food` launch entity must connect through at least one of:

- `pairs_best_with` / `pairs_with` → `wine_style`
- `typically_exhibits` → `descriptor`
- `enhances` / `balances` → `descriptor` or `wine_style`

### Certification Enforcement

| Condition | Result |
|-----------|--------|
| Entity has ≥ 1 typed edge to wine domain | Pass |
| Entity has 0 typed edges to wine domain | **Certification blocker** |
| Entire food domain forms separate connected component | **Certification blocker** |

This rule applies to all Food Ontology projects (02A–02H), not only Protein Foods.

---

## 13. Explainability Coverage (Certification Metric)

Starting with the Food Ontology, every domain certification report must include **Explainability Coverage** — the percentage of pairing recommendations explainable entirely through ontology paths.

### Definition

A pairing recommendation is **explainable** when there exists a validated typed path from the food entity to the recommended wine style using only canonical relationships and (optionally) evidence annotations.

### Example Path

```text
Ribeye (protein_food)
    → typically_exhibits → rich, fatty
    → enhances → tannin perception reduction
Cabernet Sauvignon (wine_style)
    → typically_exhibits → firm, structured
    → pairs_best_with → ribeye
```

### Certification Metrics

| Metric | Description |
|--------|-------------|
| **Explainable recommendation paths** | % of catalog pairing claims with a complete ontology path |
| **Avg reasoning depth** | Mean number of hops in explainable paths |
| **Longest validated reasoning chain** | Maximum path length with evidence at each hop |
| **Cross-domain reasoning coverage** | % of paths that cross culinary ↔ wine domain boundary |

### 02A Targets

| Metric | Target |
|--------|--------|
| Explainable recommendation paths | ≥ 80% of `wine_pairings` catalog entries |
| Avg reasoning depth | ≥ 3 hops |
| Longest validated chain | ≥ 5 hops |
| Cross-domain reasoning coverage | 100% (all protein_food–wine paths cross domain) |

---

## 14. Certification Criteria

02A is complete when Domain Completion Rule, Cross-Domain Connectivity Rule, and Explainability Coverage targets are all met.

| Criterion | Requirement |
|-----------|-------------|
| Major concepts represented | 120–180 protein_food entities across 2 categories, ~15 groups |
| Single connected component | Protein foods graph connects to Wine Ontology |
| Zero orphan entities | Validated by `validate-ontology-02a.js` |
| Cross-domain connectivity | Every protein_food connects to ≥ 1 wine entity |
| Search coverage | ≥ 99% |
| Structured data coverage | ≥ 99% (WebPage, BreadcrumbList, FAQPage) |
| Editorial audit | No blocking issues per `EDITORIAL_STANDARDS.md` |
| Certification report | `reports/food-ontology-02a-certification.json` |
| Public milestone document | `docs/FOOD_ONTOLOGY_V1.md` (or 02A section therein) |
| Explainability coverage | Meets Section 13 targets |
| Homepage unchanged | Verified |
| Pairing engine unchanged | Verified |

---

## 15. Long-Term Reasoning Vision

02A is the entry point for cross-domain explainable pairing:

```text
Ribeye (protein_food)
    ↓ commonly_cooked_by [02B]
Cooking Technique (grilled)
    ↓ creates_descriptor [02B → descriptor]
Maillard / char / smoke descriptors
    ↓ balances [cross-domain]
Wine Style (cabernet-sauvignon)
    ↓ recommended_temperature [wine]
Serving (room-temperature)
    ↓
Recommended Pairing (explainable)
```

This chain is difficult to build without a coherent ontology. Wine Ontology v2.0 created the prerequisites; Food Ontology compounds them.

---

## 16. Out of Scope for 02A

- Cooking technique entities (02B)
- Ingredient entities (02C)
- Sauce composition (02E)
- Cuisine or dish entities (02G, 02H)
- Pairing engine scoring changes
- New canonical relationship types (unless gap analysis proves necessary)
- Leaf entities with `entity_type: "protein"` (use `protein_food`)
- Grape variety reference pages
- Wine Ontology v2.1 editorial fixes (parallel maintenance track)

---

## 17. Document Index

| Document | Role |
|----------|------|
| This specification | 02A architecture and entity plan |
| [`ONTOLOGY_SPECIFICATION.md`](ONTOLOGY_SPECIFICATION.md) | Foundation contract |
| [`ONTOLOGY_CHANGELOG.md`](ONTOLOGY_CHANGELOG.md) | Historical record |
| [`EDITORIAL_STANDARDS.md`](EDITORIAL_STANDARDS.md) | Authoring quality |
| [`WINE_ONTOLOGY_V2.md`](WINE_ONTOLOGY_V2.md) | Certified wine milestone |

---

*Review this specification before writing implementation code. The first line of ONTOLOGY-02A code is `data/protein-food-catalog.json` — not a page template.*
