# PairingMethod Ontology Changelog

This document records the evolution of the PairingMethod semantic ontology.

Unlike Git history, this changelog focuses on knowledge expansion rather than source code.

Each ontology release documents:

- new entity types
- new relationship types
- new evidence
- graph growth
- semantic capabilities
- major architectural milestones

Architecture (Ontology Foundation) and Knowledge (Wine Ontology, Culinary Ontology, etc.) are versioned independently.

---

## Versioning Policy

PairingMethod maintains two independent version tracks:

### Platform — Ontology Foundation v1.x

The frozen semantic infrastructure that powers all knowledge domains:

- entity model
- relationship model
- evidence layer
- graph engine
- runtime API
- validation framework
- coverage dashboard

Foundation releases change **how** knowledge is represented and traversed. They are rare, deliberate, and backward-compatible.

**Current status:** Ontology Foundation v1.0 — **Frozen**

### Knowledge — Domain Ontologies

Domain-specific knowledge versions expand **what** the graph knows:

| Domain | Version scheme | Current |
|--------|----------------|---------|
| Wine Ontology | v1.x → v2.x | **v2.0 Certified** (v2.1 maintenance planned) |
| Culinary Ontology | v2.x | Not started (**Food Ontology** Program) |
| Future domains | Independent semantic versions | Planned |

A knowledge release may add entities and relationships without changing foundation primitives. For example, ONTOLOGY-01D (Winemaking Techniques) added 60 entities and 1,074 typed edges while consuming Ontology Foundation v1.0 unchanged.

---

## Ontology Foundation v1.0

**Status:** Frozen  
**Phases:** KNOWLEDGE-04 (entity model), ONTOLOGY-01C.5 (semantic relationships), ONTOLOGY-01C.6 (evidence layer)  
**Commits:** `ec34e9c` (entity integration), `79ddcae` (semantic layer), `cbd2a21` (evidence layer)

### Entity Model

- Explicit `entity_type` and `domain` on all knowledge nodes
- Canonical SSOT: `data/wine-taxonomy.json` v2.0.0 (`meta.ontology: "entity_graph"`)
- Entity type registry: `lib/entity-model.js`
- 20 supported entity types defined (wine + culinary placeholders for future phases)
- Structural types: `category`, `group`, `descriptor`, `entity`

### Relationship Model

- 53 canonical relationship types in `data/relationship-types.json`
- Relationship validation and reverse inference: `lib/relationship-model.js`
- Typed edge migration from anonymous catalog fields: `lib/typed-edges.js`
- Categories: hierarchy, geography, wine structure, pairing, serving, descriptor, similarity, composition, future-ready (`causes`, `reduces`, `common_in`, etc.)

**Metrics at freeze (ONTOLOGY-01C.5):**

| Metric | Value |
|--------|-------|
| Canonical relationship types | 53 |
| Explicit typed edges | 2,625 |
| Total edges (with inferred reverses) | 4,423 |
| Anonymous edges remaining | 0 |
| Graph density (typed/entity) | 8.44 |
| Traversal benchmark | ~0.018 ms/lookup |

### Evidence Layer

- Optional `evidence` on typed relationships: `reason[]`, `confidence`, `notes`
- SSOT: `data/relationship-evidence.json`
- Helpers: `lib/relationship-evidence.js`, `lib/relationship-evidence-types.js`
- Architecture Rule #3: evidence references ontology entities whenever possible

**Metrics at freeze (ONTOLOGY-01C.6):**

| Metric | Value |
|--------|-------|
| Relationships with evidence | 26 |
| Relationships without evidence | 2,573 |
| Evidence coverage | 1.0% |
| Confidence distribution (high / medium / low) | 24 / 2 / 0 |
| Unique reason entities cited | 18 |

### Graph Engine

- Traversal API: `lib/graph-engine.js`
- `neighbors()`, `outboundNeighbors()`, `inboundNeighbors()`
- Semantic graph builder with inferred reverse edges
- Graph maturity computation: `lib/graph-maturity.js`

### Runtime API

- UI-agnostic consumer API: `lib/graph-runtime.js`
- `getNeighbors()`, `getOutbound()`, `getInbound()`, `findEntitiesByRelationship()`, `relationshipStats()`
- Prepared for browser codegen and future pairing intelligence

### Validation

| Script | Scope |
|--------|-------|
| `scripts/validate-knowledge-04.js` | Descriptor graph integrity |
| `scripts/validate-ontology-01c5.js` | Semantic relationship layer |
| `scripts/validate-ontology-01c6.js` | Evidence layer |
| Per-phase validators (`validate-ontology-01a` … `01d`) | Domain entity graphs |

### Coverage Dashboard

- `scripts/ontology-coverage-report.js` → `reports/ontology-coverage.json`
- Entity type targets vs. current counts
- Graph maturity: orphans, broken edges, density, connectivity
- Semantic relationship matrix by entity type
- Sitemap coverage by entity class

---

## Wine Ontology v1.1 — Descriptors

**Phases:** KNOWLEDGE-02 (category hubs), KNOWLEDGE-03 (descriptor entities), KNOWLEDGE-04 (graph integration)  
**Commit:** `ec34e9c` — *Build wine knowledge graph and integrate taxonomy across the site*

### What was added

- **187** first-class descriptor entities in `data/wine-taxonomy.json`
- **12** category hub pages (`/terms/{category}/`)
- **10** hierarchy groups (fruit subgroups, scale groups, etc.)
- **3** ordered scales (body, acidity, tannin)
- **187** descriptor entity pages (`/terms/{slug}`)
- Unified taxonomy search index (`assets/js/taxonomy-search-index.js`)
- Pairing engine, grape pages, and pairing guides wired to taxonomy SSOT

### New entity types

- `descriptor` (first-class pages)
- `descriptor_category` (hub pages)
- `descriptor_group` (hierarchy nodes)

### Relationships

Descriptor subgraph relationships (pre-typed-edge era, catalog-native):

- `parent` / `children` hierarchy
- `related_terms` → later migrated to `related_descriptor`
- `opposite_terms` → later migrated to `opposite_descriptor`
- Cross-links to grapes, foods, and pairing guides

### Metrics

| Metric | Value | Source |
|--------|-------|--------|
| Taxonomy nodes | 209 (12 / 10 / 187) | `reports/knowledge-graph-coverage.json` |
| First-class entities (descriptors + grapes) | 192 | 187 + 5 grape varieties |
| Semantic relationships | 914 | `reports/knowledge-graph-coverage.json` |
| Avg internal links / descriptor page | 63.1 | `reports/knowledge-graph-coverage.json` |
| Descriptor pages | 187 | Generated |
| Category hub pages | 12 | Generated |
| Search entities | 187 | `taxonomy-search-index.js` |
| Sitemap URLs | 239 | `reports/knowledge-graph-coverage.json` |
| Orphans | 0 | Phase validation |
| Broken edges | 0 | Phase validation |
| Evidence | — | Pre-evidence layer |

### Semantic capabilities unlocked

- Descriptor entity pages with full taxonomy navigation
- Category hubs as index views over the descriptor graph
- Homepage search resolves descriptors directly (e.g. graphite, grippy, austere)
- Pairing engine consumes descriptor knowledge instead of duplicated arrays

---

## Wine Ontology v1.2 — Wine Styles

**Phase:** ONTOLOGY-01A  
**Commit:** `ba5d56f` — *Introduce Wine Style entity graph*

### What was added

- **28** Tier 1 wine style entities in `data/wine-style-catalog.json`
- Style hub + **28** style pages at `/styles/{slug}/`
- Style search index (`assets/js/wine-style-search-index.js`)
- Graph edges to descriptors, grapes, and pairing guides
- Entity model v2.0.0 activated on all taxonomy nodes

### New entity type

- `wine_style`

### Relationships introduced (catalog fields → later typed)

- `typically_exhibits` (descriptors)
- `contains_grape` (grape varieties)
- `pairs_best_with` (pairing guides)
- `similar_to`, `substitute_for` (related styles)
- `typical_regions` (text, region-entity ready)

### Metrics

| Metric | Value | Source |
|--------|-------|--------|
| Entities | 220 | 187 descriptors + 5 grapes + 28 styles |
| Style graph edges | 356 | `reports/wine-style-graph-edges.json` |
| → Descriptor links | 169 | Style graph report |
| → Grape links | 9 | Style graph report |
| → Pairing guide links | 40 | Style graph report |
| Pages | 29 (hub + 28) | Generated |
| Search entities | 28 (+ 5 grapes) | `wine-style-search-index.js` |
| Sitemap URLs | 258 | `reports/ontology-coverage.json` @ `ba5d56f` |
| Avg internal links / style page | 35.4 | Phase implementation report |
| Orphans | — | Graph maturity not yet instrumented |
| Broken edges | — | Graph maturity not yet instrumented |
| Evidence | — | Pre-evidence layer |

### Semantic capabilities unlocked

- Wine Style as a first-class entity bridging descriptors and pairing intent
- Unified search: styles rank alongside descriptors and grapes
- Visual structure bars (body, tannin, acidity, alcohol, sweetness, oak)
- Style ↔ descriptor chips on every style page

---

## Wine Ontology v1.3 — Wine Regions

**Phase:** ONTOLOGY-01B  
**Commit:** `f070f59` — *Introduce Wine Region entity graph*

### What was added

- **51** Tier 1 wine region entities in `data/wine-region-catalog.json`
- Region hub + **51** region pages at `/regions/{slug}/`
- Hierarchical geography: Barolo → Piedmont → Italy
- **90/90** style `typical_regions` migrated from text to region slugs
- Region search index (`assets/js/wine-region-search-index.js`)
- Graph maturity dashboard introduced (`lib/graph-maturity.js`)

### New entity type

- `wine_region`

### Relationships introduced

- `produced_in` (style → region)
- `typical_of_region` (region → style, inferred reverse)
- `commonly_expresses` (region → descriptor)
- `common_in_region` (descriptor → region)
- `child_of` (region hierarchy)
- `pairs_with` (region → pairing guide)

### Metrics

| Metric | Value | Source |
|--------|-------|--------|
| Entities | 271 | `reports/ontology-coverage.json` @ `f070f59` |
| Relationships | 1,724 | `reports/ontology-coverage.json` @ `f070f59` |
| Region graph edges | 790 | `reports/wine-region-graph-edges.json` |
| Style ↔ region links | 90 bidirectional | Phase implementation report |
| Pages | 52 (hub + 51) | Generated |
| Search entities | 51 | `wine-region-search-index.js` |
| Sitemap URLs | 310 | `reports/ontology-coverage.json` @ `f070f59` |
| Avg relationships / entity | 6.4 | `reports/ontology-coverage.json` @ `f070f59` |
| Fully connected entities | 43.2% | `reports/ontology-coverage.json` @ `f070f59` |
| Orphans | 0 | `reports/ontology-coverage.json` @ `f070f59` |
| Broken edges | 0 | `reports/ontology-coverage.json` @ `f070f59` |
| Evidence | — | Pre-evidence layer |

### Semantic capabilities unlocked

- Geographic reasoning paths: Style → Region → Country → Descriptors
- Bidirectional style–region links on both entity page types
- Region-first search results (Bordeaux, Napa Valley, Piedmont)

---

## Wine Ontology v1.4 — Serving & Service

**Phase:** ONTOLOGY-01C  
**Commit:** `3774c72` — *Introduce Serving & Service entity graph*

### What was added

- **40** serving & service entities in `data/wine-serving-catalog.json`
- Serving hub + **40** serving pages at `/serving/{slug}/`
- Families: temperature (10), glassware (9), decanting (7), cellaring (4), aging potential (4), serving mistakes (6)
- **28/28** wine styles migrated to slug-based serving references
- Serving search index (`assets/js/wine-serving-search-index.js`)

### New entity type

- `wine_serving` (includes glassware, temperature, decanting, cellaring, mistakes)

### Relationships introduced

- `recommended_temperature`, `recommended_glass`, `recommended_decanting`, `recommended_cellaring` (style → serving)
- `recommended_for` (serving → style, inferred reverse)
- `associated_with` (serving ↔ descriptor, serving ↔ region, serving ↔ grape)
- `confused_with` (serving mistakes)

### Metrics

| Metric | Value | Source |
|--------|-------|--------|
| Entities | 311 | `reports/ontology-coverage.json` @ `3774c72` |
| Relationships | 2,236 | `reports/ontology-coverage.json` @ `3774c72` |
| Serving graph edges | 512 | `reports/wine-serving-graph-edges.json` |
| Style → serving links | 112 | Phase implementation report |
| Serving ↔ style (incl. reverse) | 404 | Phase implementation report |
| Pages | 41 (hub + 40) | Generated |
| Search entities | 40 | `wine-serving-search-index.js` |
| Sitemap URLs | 351 | `reports/ontology-coverage.json` @ `3774c72` |
| Avg relationships / entity | 7.2 | `reports/ontology-coverage.json` @ `3774c72` |
| Fully connected entities | 50.7% | `reports/ontology-coverage.json` @ `3774c72` |
| Orphans | 0 | `reports/ontology-coverage.json` @ `3774c72` |
| Broken edges | 0 | `reports/ontology-coverage.json` @ `3774c72` |
| Evidence | — | Pre-evidence layer |

### Semantic capabilities unlocked

- Every wine style page links to ontology-backed serving guidance
- Service reasoning: Style → recommended glass → descriptors (full-bodied, firm)
- Serving entity search (Bordeaux glass, decanting, drink now)

---

## Wine Ontology v1.5 — Winemaking Techniques

**Phase:** ONTOLOGY-01D  
**Commit:** `264cebe` — *Introduce Winemaking Technique entity graph*  
**Catalog version:** `wine_ontology_version: 1.5`

### What was added

- **60** winemaking technique entities in `data/winemaking-technique-catalog.json`
- Technique hub + **60** technique pages at `/techniques/{slug}/`
- Full production lifecycle coverage: fermentation, maceration, aging, fining, sparkling methods, etc.
- Technique search index (`assets/js/winemaking-technique-search-index.js`)
- **44** winemaking evidence annotations added to relationship evidence SSOT

### New entity type

- `winemaking_technique`

### Relationships consumed (existing canonical types)

| Catalog field | Canonical type |
|---------------|----------------|
| `creates_descriptors` | `creates_descriptor` |
| `reduces_descriptors` | `reduces_descriptor` |
| `common_styles`, `common_regions` | `common_in` |
| `common_grapes`, `serving_implications` | `associated_with` |
| `related_techniques` | `similar_to` |
| `opposite_techniques` | `confused_with` |

SSOT vocabulary extended (blocker only): `similar_to`, `confused_with`, and `associated_with` now allow `winemaking_technique` as source/target.

### Evidence

| Metric | Value |
|--------|-------|
| Total evidence annotations | 70 |
| Winemaking technique annotations | 44 |
| Other domains (style, region, descriptor, serving, grape) | 26 |
| Evidence coverage | 1.91% |
| Confidence (high / medium) | 51 / 19 |

### Metrics

| Metric | Before (01C.6) | After (01D) | Delta | Source |
|--------|----------------|-------------|-------|--------|
| Entities | 311 | **371** | +60 | `reports/ontology-coverage.json` |
| Legacy graph relationships | 2,236 | **3,310** | +1,074 | `reports/ontology-coverage.json` |
| Explicit typed edges | 2,625 | **3,699** | +1,074 | `reports/ontology-coverage.json` |
| Technique graph edges | — | **1,074** | — | `reports/winemaking-technique-graph-edges.json` |
| Evidence annotations | 26 | **70** | +44 | `data/relationship-evidence.json` |
| Pages | 351 | **412** | +61 | Sitemap |
| Technique pages | — | **61** (60 + hub) | +61 | Generated |
| Search entities | 311 | **371** | +60 | All search indexes |
| Sitemap URLs | 351 | **412** | +61 | `reports/ontology-coverage.json` |
| Avg relationships / entity | 7.2 | **8.9** | +1.7 | `reports/ontology-coverage.json` |
| Graph density | 8.44 | **9.97** | +1.53 | `reports/ontology-coverage.json` |
| Fully connected entities | 50.7% | **58.7%** | +8.0pp | `reports/ontology-coverage.json` |
| Orphans | 0 | **0** | — | `reports/ontology-coverage.json` |
| Broken edges | 0 | **0** | — | `reports/ontology-coverage.json` |
| Traversal benchmark | ~0.018 ms | **0.018 ms/lookup** | Stable | `reports/ontology-coverage.json` |

### Semantic capabilities unlocked

- Production reasoning paths: Technique → creates_descriptor → Style → pairs_with
- Example chain: Malolactic Fermentation → buttery → Chardonnay → creamy pairings
- Technique search (malolactic fermentation, carbonic maceration, lees aging, batonnage)
- Evidence-backed technique relationships with entity-referenced reasons

---

## Wine Ontology v1.6 — Wine Faults

**Phase:** ONTOLOGY-01E  
**Commit:** `fbd4fe8` — *Introduce Wine Fault entity graph*  
**Catalog version:** `wine_ontology_version: 1.6`

### What was added

- **30** wine fault entities in `data/wine-fault-catalog.json`
- Fault hub + **30** fault pages at `/faults/{slug}/`
- Fault search index (`assets/js/wine-fault-search-index.js`)
- **40** fault evidence annotations added to relationship evidence SSOT

### New entity type

- `wine_fault`

### Relationships consumed (existing canonical types)

| Catalog field | Canonical type |
|---------------|----------------|
| `creates_descriptors` | `creates_descriptor` |
| `reduces_descriptors` | `reduces_descriptor` |
| `common_styles`, `common_regions`, `common_techniques` | `common_in` |
| `related_faults`, `related_techniques` | `associated_with` |
| `confused_with_faults` | `confused_with` |

SSOT vocabulary extended (blocker only): `confused_with`, `similar_to`, and `associated_with` now allow `wine_fault` as source/target.

### Evidence

| Metric | Value |
|--------|-------|
| Total evidence annotations | 110 |
| Wine fault annotations | 40 |
| Other domains (technique, style, region, descriptor, serving, grape) | 70 |
| Evidence coverage | 2.56% |
| Confidence (high / medium) | 79 / 31 |

### Metrics

| Metric | Before (01D) | After (01E) | Delta | Source |
|--------|--------------|-------------|-------|--------|
| Entities | 371 | **401** | +30 | `reports/ontology-coverage.json` |
| Explicit typed edges | 3,699 | **4,321** | +622 | `reports/ontology-coverage.json` |
| Fault graph edges | — | **622** | — | `reports/wine-fault-graph-edges.json` |
| Evidence annotations | 70 | **110** | +40 | `data/relationship-evidence.json` |
| Pages | 412 | **443** | +31 | Sitemap |
| Fault pages | — | **31** (30 + hub) | +31 | Generated |
| Search entities | 371 | **401** | +30 | All search indexes |
| Sitemap URLs | 412 | **443** | +31 | `reports/ontology-coverage.json` |
| Avg relationships / entity | 8.9 | **9.8** | +0.9 | `reports/ontology-coverage.json` |
| Graph density | 9.97 | **10.78** | +0.81 | `reports/ontology-coverage.json` |
| Fully connected entities | 58.7% | **61.9%** | +3.2pp | `reports/ontology-coverage.json` |
| Connected components | 1 | **1** | — | `reports/wine-ontology-certification.json` |
| Orphans | 0 | **0** | — | `reports/ontology-coverage.json` |
| Broken edges | 0 | **0** | — | `reports/ontology-coverage.json` |

### Semantic capabilities unlocked

- Fault reasoning paths: Fault → creates_descriptor → Style → pairs_with
- Example chain: Brettanomyces → barnyard → Pinot Noir → earthy pairings
- Cross-domain enrichment: 105 pre-existing entities gained new fault relationships
- Fault search (brettanomyces, cork taint, oxidation, volatile acidity)

### Ontology Impact Report

| Domain | Entities enriched |
|--------|------------------:|
| Wine Regions | 25 |
| Descriptors | 26 |
| Winemaking Techniques | 21 |
| Wine Styles | 17 |
| Serving & Service | 11 |
| Grape Varieties | 5 |

---

## Wine Ontology v2.0 — Certified

**Phase:** ONTOLOGY-01F  
**Commit:** ONTOLOGY-01F — *Certify Wine Ontology v2.0*  
**Status:** **CERTIFIED WITH MINOR ISSUES**

This is a certification and release-gate phase — not a content expansion. No new entity types, relationship types, or generators were introduced.

### Certification decision

**CERTIFIED WITH MINOR ISSUES** — approved for production and as the stable foundation for the Food Ontology Program.

No blocking issues. Minor findings are editorial and density improvements, deferred to **Wine Ontology v2.1** (maintenance release).

### Deliverables

| Artifact | Path |
|----------|------|
| Machine-readable audit | `reports/wine-ontology-certification.json` |
| Public milestone document | `docs/WINE_ONTOLOGY_V2.md` |
| Reproducible audit runner | `scripts/wine-ontology-certification.js` |

### Certification metrics (authoritative)

| Metric | Value |
|--------|------:|
| Total entities | 401 |
| Explicit typed edges | 4,321 |
| Evidence annotations | 110 |
| Graph density | 10.78 |
| Connected components | **1** |
| Orphan entities | **0** |
| Broken graph edges | **0** |
| Search coverage | 100% |
| Fully connected entities | 61.9% |

### Density by domain (avg edges / entity)

| Domain | Avg edges / entity |
|--------|-------------------:|
| Wine Styles | 21.32 |
| Wine Faults | 20.73 |
| Winemaking Techniques | 17.90 |
| Wine Regions | 17.67 |
| Serving & Service | 12.78 |
| Grape Varieties | 7.60 |
| Descriptors | 3.09 |

### Minor issues (deferred to v2.1)

- Evidence coverage 2.56% (below 5% aspirational target)
- 135 nodes with degree &lt; 5 in semantic graph
- 51 regions and 40 serving entities missing `beginner_notes`
- 30 winemaking techniques missing FAQ entries
- Duplicate SEO title (`too-warm` / `served-too-warm`)
- One marketing-language flag (nebbiolo)
- Optional grape variety reference pages

### Validations passed

- `validate:ontology-01e`
- `validate:ontology-01d`
- `validate:ontology-01c6`
- `validate:knowledge-04`
- Homepage unchanged
- Pairing engine unchanged

---

## Wine Ontology v2.1 — Editorial & Density Improvements (planned)

**Status:** Maintenance release — not a blocker for Food Ontology Program

Planned improvements from ONTOLOGY-01F certification findings:

- Beginner notes completion (regions, serving)
- FAQ completion (winemaking techniques)
- Evidence expansion toward 5% coverage
- SEO deduplication and marketing-language cleanup
- Low-degree descriptor enrichment
- Optional grape variety reference pages

---

## Timeline

```text
KNOWLEDGE-02/03/04 — Descriptors (Wine Ontology v1.1)
        ↓
ONTOLOGY-01A — Wine Styles (v1.2)
        ↓
ONTOLOGY-01B — Wine Regions (v1.3)
        ↓
ONTOLOGY-01C — Serving & Service (v1.4)
        ↓
ONTOLOGY-01C.5 — Semantic Relationship Layer (Foundation v1.0)
        ↓
ONTOLOGY-01C.6 — Evidence Layer (Foundation v1.0)
        ↓
ONTOLOGY-01D — Winemaking Techniques (v1.5)
        ↓
ONTOLOGY-01E — Wine Faults (v1.6)
        ↓
ONTOLOGY-01F — Wine Ontology Certification (v2.0 Certified)
        ↓
Wine Ontology v2.1 — Editorial & Density Improvements (planned, maintenance)
        ↓
Food Ontology Program — 02A Protein Foods → 02H Dishes (planned)
        ↓
Pairing Intelligence (planned)
        ↓
Digital Sommelier (planned)
```

---

## Current State

**As of:** 2026-07-16 (post ONTOLOGY-01F — Wine Ontology v2.0 Certified)

### Ontology Foundation

| Component | Status |
|-----------|--------|
| Entity Model | Complete — Frozen |
| Relationship Model (53 types) | Complete — Frozen |
| Evidence Layer | Complete — Frozen |
| Graph Engine | Complete — Frozen |
| Runtime API | Complete — Frozen |
| Validation Framework | Complete — Frozen |
| Coverage Dashboard | Complete — Frozen |

**Ontology Foundation v1.0 — Complete.**

### Wine Ontology

| Entity Type | Count | Pages | Status |
|-------------|-------|-------|--------|
| Descriptors | 187 | 187 | Complete |
| Category Hubs | 12 | 12 | Complete |
| Grape Varieties | 5 | — | Complete (graph hubs) |
| Wine Styles | 28 | 28 | Complete |
| Wine Regions | 51 | 51 | Complete |
| Serving & Service | 40 | 40 | Complete |
| Winemaking Techniques | 60 | 60 | Complete |
| Wine Faults | 30 | 30 | Complete |

**Wine Ontology v2.0 — Certified.** Maintenance improvements planned for v2.1.

### Graph Summary (current)

| Metric | Value |
|--------|-------|
| Total entities | 401 |
| Explicit typed edges | 4,321 |
| Total edges (with inferred reverses) | 6,855 |
| Canonical relationship types | 53 |
| Evidence annotations | 110 |
| Evidence coverage | 2.56% |
| Graph density | 10.78 |
| Avg relationships / entity | 9.8 |
| Connected components | **1** |
| Fully connected entities | 61.9% |
| Orphan entities | **0** |
| Broken graph edges | **0** |
| Sitemap URLs | 443 |
| Unified search entities | 401 |

**Next milestone:** Food Ontology — ONTOLOGY-02A (Protein Foods) — see [`ONTOLOGY-02A_ARCHITECTURE.md`](ONTOLOGY-02A_ARCHITECTURE.md)

---

## Long-Term Vision

### Phase I — Wine Knowledge Platform (complete)

Wine Ontology v2.0 certified. All seven major wine domains represented in a single connected semantic graph.

### Food Ontology Program

PairingMethod expands from a wine knowledge platform into a **semantic knowledge platform**. The Food Ontology Program follows the same frozen-foundation pattern established by the Wine Ontology.

| Project | Domain | Notes |
|---------|--------|-------|
| ONTOLOGY-02A | Protein Foods | Biological hierarchy; 120–180 `protein_food` entities |
| ONTOLOGY-02B | Cooking Techniques | Maillard, braising, grilling |
| ONTOLOGY-02C | Ingredients | **Before sauces** — atomic components |
| ONTOLOGY-02D | Herbs & Spices | Aromatic and heat elements |
| ONTOLOGY-02E | Sauces | Compositional — mostly `contains` edges |
| ONTOLOGY-02F | Cheeses | Fermented dairy |
| ONTOLOGY-02G | Cuisines | Regional traditions |
| ONTOLOGY-02H | Dishes | Convergence nodes (protein_food + ingredient + sauce + technique + cuisine) |

Wine Ontology v2.1 maintenance (editorial and density improvements) proceeds in parallel — it does not block the Food Ontology Program.

**Architecture:** [`ONTOLOGY-02A_ARCHITECTURE.md`](ONTOLOGY-02A_ARCHITECTURE.md)

### Pairing Intelligence

Emerges from the existing graph — no new engine required:

- Explainable reasoning via semantic path traversal
- Graph traversal for pairing recommendations
- Confidence scoring from evidence layer
- Alternative recommendations and substitution engine
- Flavor-path visualization

Example reasoning path (future):

```text
Grilled Steak → High Maillard → Pairs with High Tannin → Cabernet Sauvignon → Napa Valley
```

### Digital Sommelier

- Natural-language reasoning over semantic paths
- Meal planner and multi-course pairing
- Wine discovery and cellar recommendations
- Seasonal suggestions

Every explanation sentence maps to a typed relationship traversal already in the graph.

---

## Maintenance Rules

### Domain Completion Rule

A domain is considered **complete** only when it satisfies **all** of the following:

1. All major concepts represented
2. Single connected component (graph integrates with existing ontology)
3. Zero orphan entities
4. Search coverage ≥ 99%
5. Structured data coverage ≥ 99%
6. Editorial audit passes without blocking issues
7. Certification report generated (`reports/wine-ontology-certification.json` or domain equivalent)
8. Public milestone document published (`docs/WINE_ONTOLOGY_V2.md` or domain equivalent)

This rule applies to every future ontology project in the Food Ontology Program and beyond.

### Cross-Domain Connectivity Rule

Every new Food Ontology entity must connect to **at least one Wine Ontology entity** before domain certification.

Domains may be internally complete but **must not be externally isolated**. The culinary ontology exists to enrich and explain wine pairing through explicit, traversable relationships — not as a standalone encyclopedia.

| Condition | Result |
|-----------|--------|
| Entity has ≥ 1 typed edge to wine domain | Pass |
| Entity has 0 typed edges to wine domain | Certification blocker |
| Food domain forms separate connected component | Certification blocker |

Applies to all Food Ontology projects (02A–02H). See [`ONTOLOGY-02A_ARCHITECTURE.md`](ONTOLOGY-02A_ARCHITECTURE.md) §12.

### Explainability Coverage (Food Ontology onward)

Starting with the Food Ontology, every domain certification report must also measure **explainability** — the percentage of pairing recommendations explainable entirely through ontology paths.

| Metric | Description |
|--------|-------------|
| Explainable recommendation paths | % of pairing claims with a complete typed path |
| Avg reasoning depth | Mean hops in explainable paths |
| Longest validated reasoning chain | Maximum evidenced path length |
| Cross-domain reasoning coverage | % of paths crossing culinary ↔ wine boundary |

See [`ONTOLOGY-02A_ARCHITECTURE.md`](ONTOLOGY-02A_ARCHITECTURE.md) §11 for targets and examples.

Every ontology phase **must** update this changelog before the phase is considered complete.

Every release entry **must** include:

1. **Entity count** — new and cumulative first-class entities
2. **Relationship count** — typed edges and domain-specific graph edges
3. **Evidence count** — annotations added and coverage percentage
4. **Knowledge density** — graph density, avg relationships/entity, connectivity
5. **Graph maturity** — orphans, broken edges, validation status
6. **Pages and search** — generated pages, search index coverage, sitemap growth

### Ontology Impact Report (required alongside Knowledge Density Report)

Starting with ONTOLOGY-01E, every phase implementation report must also include:

- **Existing entities enriched** — how many pre-existing entities gained new relationships
- **Cross-domain relationships added** — e.g. Wine ↔ Culinary (when applicable)
- **Graph connectivity changes** — reduction in isolated clusters, fully-connected percentage delta

### Authoritative sources

| Report | Path |
|--------|------|
| Ontology coverage dashboard | `reports/ontology-coverage.json` |
| Semantic relationship summary | `reports/semantic-relationship-summary.json` |
| Evidence summary | `reports/relationship-evidence-summary.json` |
| Domain graph edges | `reports/wine-*-graph-edges.json`, `reports/winemaking-technique-graph-edges.json` |
| Descriptor baseline | `reports/knowledge-graph-coverage.json` |

This file is the authoritative **historical record** of knowledge graph evolution. Git commits track code changes; this changelog tracks knowledge changes.

---

## Appendix — Entity Type Registry

Entity types defined in the foundation model (current utilization):

| Entity Type | Domain | Status |
|-------------|--------|--------|
| `descriptor` | wine | Active (187) |
| `descriptor_category` | wine | Active (12) |
| `descriptor_group` | wine | Active (10) |
| `grape_variety` | wine | Active (5) |
| `wine_style` | wine | Active (28) |
| `wine_region` | wine | Active (51) |
| `wine_serving` | wine | Active (40) |
| `winemaking_technique` | wine | Active (60) |
| `wine_fault` | wine | Active (30) |
| `glassware` | wine | Absorbed into `wine_serving` |
| `food` | culinary | Planned |
| `protein_food` | culinary | Planned (02A) |
| `protein_category` | culinary | Planned (02A) |
| `protein_group` | culinary | Planned (02A) |
| `protein` | culinary | Superseded by `protein_food` (02A) |
| `cooking_method` | culinary | Planned (02B) |
| `sauce` | culinary | Planned (02E) |
| `cheese` | culinary | Planned (02F) |
| `herb` | culinary | Planned (02D) |
| `spice` | culinary | Planned (02D) |
| `vegetable` | culinary | Planned (02C) |
| `fruit` | culinary | Planned (02C) |
| `mushroom` | culinary | Planned (02C) |
| `cuisine` | culinary | Planned (02G) |
| `dish` | culinary | Planned (02H) |
