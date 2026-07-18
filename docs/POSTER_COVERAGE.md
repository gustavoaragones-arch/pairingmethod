# PLAN-01 — Poster Coverage Matrix

**Phase:** PLAN-01 — Poster Coverage Matrix  
**Status:** Canonical implementation checklist  
**Production baseline:** Platform v1.0.0 · Food Ontology Suite v1.1.0 · Tag `food-ontology-suite-v1.1.0` (`316b525`)  
**Inspiration:** Wine Folly *Food & Wine Pairing Method* poster (original PairingMethod vision)

This document maps every concept from the inspiration poster to its implementation within the Food Ontology Platform. It is **documentation only** — no runtime, ontology, or publication changes.

---

## Section 1 — Current Platform

### Platform

| Field | Value |
|-------|-------|
| **Version** | v1.0.0 |
| **Status** | Frozen |
| **Git tag** | `v1.0.0` |

### Capabilities

| Capability | Status |
|------------|--------|
| Shared publication platform | ✓ |
| Multi-domain architecture | ✓ |
| Publication certification | ✓ |
| Release certification | ✓ |
| Deployment (DEPLOY-01) | ✓ |
| Runtime compilation | ✓ |
| Search indexes | ✓ |
| JSON-LD | ✓ |
| Navigation graphs | ✓ |
| Static HTML publishing | ✓ |
| Sitemap & crawl manifest | ✓ |

The platform consumes **domain configuration** (`lib/food-domain-config.js`) and shared publication stages (`lib/food-publication/*`). It does not encode domain-specific food knowledge.

---

## Section 2 — Food Ontology Suite

**Suite version:** v1.1.0  
**Suite tag:** `food-ontology-suite-v1.1.0`

| Domain | Version | Status | Entities (leaf) | Publication |
|--------|---------|--------|-----------------|-------------|
| Protein Foods | 1.0.0 | Complete | 207 | `/foods/` |
| Cheeses | 1.0.0 | Complete | 204 | `/cheeses/` |

**Suite total:** 411 published food entity pages + group/category hub pages.

### Related ontology (non-food)

| Domain | Version | Status | Notes |
|--------|---------|--------|-------|
| Wine Ontology | 2.0.0 | Complete | 401 entities; pairing targets for FOOD-04E / FOOD-05E |
| Pairing guides (legacy matrix) | — | Partial | `assets/js/pairing-engine.js` implements poster-style reasoning for homepage matrix |

---

## Section 3 — Poster Coverage Matrix

Legend for **Status**:

| Status | Meaning |
|--------|---------|
| **Complete** | Ontology domain published; poster concept fully represented at entity level |
| **Partial** | Some coverage exists; dedicated domain or refinement still planned |
| **Not Started** | No dedicated ontology domain yet |
| **Deferred** | Intentionally out of scope for food ontology; belongs to Pairing Engine or future prep taxonomy |
| **Superseded** | Platform capability replaces poster representation |

### Master matrix

| Poster Section | Poster Concept | Ontology Domain | Phase | Status | Notes |
|----------------|----------------|-----------------|-------|--------|-------|
| **Meat** | Red Meat (beef, lamb, venison) | Protein Foods | FOOD-02 | Complete | Groups: `beef`, `lamb`, `wild-game`, `veal` |
| **Meat** | Cured Meat (salami, prosciutto, bacon) | Protein Foods | FOOD-14 | Partial | Cured variants may exist as leaf entities; no dedicated cured-meat group |
| **Meat** | Pork | Protein Foods | FOOD-02 | Complete | Group: `pork` |
| **Meat** | Poultry (chicken, duck, turkey) | Protein Foods | FOOD-02 | Complete | Group: `poultry` |
| **Meat** | Fish (tuna, cod, trout, bass) | Protein Foods | FOOD-02 / FOOD-14 | Partial | Group: `fin-fish`; FOOD-14 refines seafood taxonomy |
| **Meat** | Lobster & Shellfish (prawn, crab, langoustine) | Protein Foods | FOOD-02 / FOOD-14 | Partial | Groups: `crustaceans`, `cephalopods` |
| **Meat** | Mollusks (oyster, mussel, clam) | Protein Foods | FOOD-02 / FOOD-14 | Partial | Group: `mollusks` |
| **Preparation** | Grilled or Barbecued | — | PREP-01 | Deferred | Not a food ontology domain; future preparation taxonomy |
| **Preparation** | Sautéed or Fried | — | PREP-01 | Deferred | |
| **Preparation** | Smoked | — | PREP-01 | Deferred | |
| **Preparation** | Roasted | — | PREP-01 | Deferred | |
| **Preparation** | Poached or Steamed | — | PREP-01 | Deferred | |
| **Dairy** | Soft Cheese & Cream (brie, mascarpone, crème fraîche) | Cheeses | FOOD-04 | Complete | Groups: `fresh`, `bloomy-rind`, `washed-rind`, `pasta-filata`, `brined` |
| **Dairy** | Pungent Cheese (blue, Gorgonzola, Stilton, Roquefort) | Cheeses | FOOD-04 | Complete | Group: `blue` (+ select washed-rind) |
| **Dairy** | Hard Cheese (cheddar, Pecorino, Manchego, Parmesan) | Cheeses | FOOD-04 | Complete | Groups: `hard`, `semi-hard`, `natural-rind` |
| **Vegetable** | Alliums (onion, shallot, garlic, scallion) | Vegetables | FOOD-05 | Not Started | Planned vegetable group |
| **Vegetable** | Green Vegetables (green bean, kale, lettuce) | Vegetables | FOOD-05 | Not Started | |
| **Vegetable** | Root Vegetables & Squash (turnip, butternut, pumpkin, carrot) | Vegetables | FOOD-05 | Not Started | |
| **Vegetable** | Nightshades (tomato, eggplant, bell pepper) | Vegetables | FOOD-05 | Not Started | |
| **Fungi** | Fungi / Mushrooms (crimini, maitake, chanterelle) | Fungi | FOOD-06 | Partial | Protein catalog includes `mushrooms` group (culinary fungi as protein); dedicated Fungi domain planned |
| **Herb & Spice** | Herbs (thyme, oregano, basil, tarragon) | Herbs & Spices | FOOD-07 | Not Started | |
| **Herb & Spice** | Black Pepper | Herbs & Spices | FOOD-07 | Not Started | |
| **Herb & Spice** | Red Pepper (ancho, Aleppo, chipotle, chili) | Herbs & Spices | FOOD-07 | Not Started | |
| **Herb & Spice** | Hot & Spicy (hot sauce, habanero, sichuan) | Herbs & Spices | FOOD-07 | Not Started | |
| **Herb & Spice** | Baking Spices (cinnamon, clove, allspice, mace) | Herbs & Spices | FOOD-07 | Not Started | |
| **Herb & Spice** | Exotic & Aromatic Spices (anise, turmeric, saffron, fennel, ginger) | Herbs & Spices | FOOD-07 | Not Started | |
| **Starch** | White Starches (flour, white rice, pasta, bread, tortillas) | Grains & Starches | FOOD-08 | Not Started | Protein catalog includes `grains-wheat-protein` (plant protein angle); starch domain is distinct |
| **Starch** | Whole Wheat Grains (quinoa, farro, brown rice) | Grains & Starches | FOOD-08 | Not Started | |
| **Starch** | Sweet Starchy Vegetables (sweet potato, yucca, taro) | Grains & Starches | FOOD-08 | Not Started | May cross-reference FOOD-05 nightshades/root where applicable |
| **Starch** | Potato | Grains & Starches | FOOD-08 | Not Started | |
| **Herb & Spice** | Nuts & Seeds (peanut, almond, pecan, sesame) | Nuts & Seeds | FOOD-10 | Partial | Protein catalog includes `nuts-seeds` group; dedicated domain planned |
| **Herb & Spice** | Beans & Peas (lentil, navy, pinto, chickpea) | Beans & Peas | FOOD-11 | Partial | Protein catalog includes `legumes` group; dedicated domain planned |
| **Sweet** | Fruit & Berries (strawberry, orange, apple, peach) | Fruits & Berries | FOOD-09 | Not Started | Cross-domain refs already used (e.g. cheese → `food.fruit.*`) |
| **Sweet** | Vanilla & Caramel (crème brûlée, ice cream) | Sweet Flavors | FOOD-12 | Not Started | Flavor/dessert domain, not whole dishes |
| **Sweet** | Chocolate & Coffee | Sweet Flavors | FOOD-12 | Not Started | |
| **Sauces** | *(not on poster)* | Sauces & Condiments | FOOD-13 | Not Started | Required for complete culinary ontology |
| **Wine** | Bold Red | Wine Ontology + Pairing Engine | WINE-01 / ENGINE | Partial | 28 published wine styles; poster **family** mapped in `pairing-engine.js` (`bold_red`) |
| **Wine** | Medium Red | Wine Ontology + Pairing Engine | WINE-01 / ENGINE | Partial | `medium_red` family |
| **Wine** | Light Red | Wine Ontology + Pairing Engine | WINE-01 / ENGINE | Partial | `light_red` family |
| **Wine** | Rosé | Wine Ontology + Pairing Engine | WINE-01 / ENGINE | Partial | `rose` family |
| **Wine** | Rich White | Wine Ontology + Pairing Engine | WINE-01 / ENGINE | Partial | `rich_white` family |
| **Wine** | Light White | Wine Ontology + Pairing Engine | WINE-01 / ENGINE | Partial | `light_white` family |
| **Wine** | Sparkling | Wine Ontology + Pairing Engine | WINE-01 / ENGINE | Partial | `sparkling` family |
| **Wine** | Sweet White | Wine Ontology + Pairing Engine | WINE-01 / ENGINE | Partial | `sweet_white` family |
| **Wine** | Dessert | Wine Ontology + Pairing Engine | WINE-01 / ENGINE | Partial | `dessert` family |

### Poster section summaries

#### Meat → Protein Foods (FOOD-02) — **Mostly Complete**

| Poster Concept | Phase | Status |
|----------------|-------|--------|
| Red Meat | FOOD-02 | Complete |
| Cured Meat | FOOD-14 | Partial |
| Pork | FOOD-02 | Complete |
| Poultry | FOOD-02 | Complete |
| Fish | FOOD-02 / FOOD-14 | Partial |
| Lobster & Shellfish | FOOD-02 / FOOD-14 | Partial |
| Mollusks | FOOD-02 / FOOD-14 | Partial |

#### Preparation — **Deferred** (PREP-01 or Pairing Engine context)

| Poster Concept | Phase | Status |
|----------------|-------|--------|
| Grilled or Barbecued | PREP-01 | Deferred |
| Sautéed or Fried | PREP-01 | Deferred |
| Smoked | PREP-01 | Deferred |
| Roasted | PREP-01 | Deferred |
| Poached or Steamed | PREP-01 | Deferred |

Protein entities encode `primary_cooking_methods` and editorial `commonly_prepared_as` → `preparation.*` refs. A full preparation taxonomy is not yet a first-class ontology domain.

#### Dairy → Cheeses (FOOD-04) — **Complete**

| Poster Concept | Cheese Groups (approx.) | Phase | Status |
|----------------|-------------------------|-------|--------|
| Soft Cheese & Cream | `fresh`, `bloomy-rind`, `washed-rind`, `pasta-filata`, `brined` | FOOD-04 | Complete |
| Pungent Cheese | `blue`, select `washed-rind` | FOOD-04 | Complete |
| Hard Cheese | `hard`, `semi-hard`, `natural-rind` | FOOD-04 | Complete |

Poster groupings are **pairing categories**, not identical to cheese taxonomy groups. Mapping is semantic, not one-to-one.

#### Vegetables (FOOD-05) — **Not Started**

| Poster Concept | Planned Phase | Status |
|----------------|---------------|--------|
| Alliums | FOOD-05 | Not Started |
| Green Vegetables | FOOD-05 | Not Started |
| Root Vegetables & Squash | FOOD-05 | Not Started |
| Nightshades | FOOD-05 | Not Started |

#### Fungi (FOOD-06) — **Partial**

| Poster Concept | Planned Phase | Status |
|----------------|---------------|--------|
| Fungi / Mushrooms | FOOD-06 | Partial — `mushrooms` exists in Protein Foods pending dedicated domain |

#### Herbs & Spices (FOOD-07) — **Not Started**

| Poster Concept | Planned Phase | Status |
|----------------|---------------|--------|
| Herbs | FOOD-07 | Not Started |
| Black Pepper | FOOD-07 | Not Started |
| Red Pepper | FOOD-07 | Not Started |
| Hot & Spicy | FOOD-07 | Not Started |
| Baking Spices | FOOD-07 | Not Started |
| Exotic & Aromatic Spices | FOOD-07 | Not Started |

#### Grains & Starches (FOOD-08) — **Not Started**

| Poster Concept | Planned Phase | Status |
|----------------|---------------|--------|
| White Starches | FOOD-08 | Not Started |
| Whole Wheat Grains | FOOD-08 | Not Started |
| Sweet Starchy Vegetables | FOOD-08 | Not Started |
| Potato | FOOD-08 | Not Started |

#### Fruits & Berries (FOOD-09) — **Not Started**

| Poster Concept | Planned Phase | Status |
|----------------|---------------|--------|
| Fruit | FOOD-09 | Not Started |
| Berries | FOOD-09 | Not Started |

#### Nuts & Seeds (FOOD-10) — **Partial**

| Poster Concept | Planned Phase | Status |
|----------------|---------------|--------|
| Nuts & Seeds | FOOD-10 | Partial — `nuts-seeds` in Protein Foods pending dedicated domain |

#### Beans & Peas (FOOD-11) — **Partial**

| Poster Concept | Planned Phase | Status |
|----------------|---------------|--------|
| Beans & Peas | FOOD-11 | Partial — `legumes` in Protein Foods pending dedicated domain |

#### Sweet Flavors (FOOD-12) — **Not Started**

| Poster Concept | Planned Phase | Status |
|----------------|---------------|--------|
| Vanilla & Caramel | FOOD-12 | Not Started |
| Chocolate & Coffee | FOOD-12 | Not Started |
| Fruit & Berries (sweet context) | FOOD-09 | Not Started |

#### Sauces & Condiments (FOOD-13) — **Not Started**

Not shown on the poster. Documented because complete culinary ontology requires composed flavor carriers (sauces, condiments, dressings) that anchor cross-domain pairings.

| Poster Concept | Planned Phase | Status |
|----------------|---------------|--------|
| Sauces & Condiments | FOOD-13 | Not Started |

#### Seafood refinement (FOOD-14) — **Partial**

Refines protein-catalog seafood groups (`fin-fish`, `crustaceans`, `mollusks`, `cephalopods`) toward poster-level granularity and cross-domain editorial completeness.

| Poster Concept | Planned Phase | Status |
|----------------|---------------|--------|
| Fish | FOOD-14 | Partial |
| Lobster & Shellfish | FOOD-14 | Partial |
| Mollusks | FOOD-14 | Partial |
| Cured Meat | FOOD-14 | Partial |

---

## Section 4 — Concepts Beyond the Poster

The ontology platform provides capabilities the static poster cannot represent:

| Capability | Platform artifact | Poster equivalent |
|------------|--------------------|--------------------|
| Canonical ontology IDs | `food.protein.*`, `food.cheese.*`, `wine.style.*` | Row/column labels only |
| Immutable governance | Frozen catalogs, audit scripts | None |
| Structural relationships | Runtime graph (belongs_to, shares_*) | Implicit grid adjacency |
| Editorial relationships | `similar_to`, `substitutes_for`, `same_family`, etc. | None |
| Wine pairing edges | `pairs_with_style`, `pairs_with_descriptor`, … | Dot matrix only |
| JSON-LD | `data/schema/*` | None |
| Static entity pages | `/foods/`, `/cheeses/`, `/styles/` | None |
| Search indexes | `data/search/*` | None |
| Schema validation | Catalog audit, runtime validators | None |
| Publication certification | ONTOLOGY-03F / FOOD-04F | None |
| Release certification | ONTOLOGY-03I | None |
| Deployment certification | DEPLOY-01 | None |
| Cross-domain references by ID | Editorial edges to other domains | Venn overlap (conceptual only) |
| Deterministic regeneration | Certification determinism checks | None |
| Multi-domain publication | Single platform, domain config | Single static chart |

---

## Section 5 — Superseded by the Platform

The poster is the **knowledge baseline**, not the **design limit**. The goal is not to reproduce the infographic exactly — the ontology platform intentionally exceeds it.

Several poster representations are already **superseded** by platform capabilities:

| Poster capability | Platform equivalent |
|-------------------|---------------------|
| Static food categories | Canonical ontology entities with immutable IDs |
| Static pairing chart | Typed relationship graph |
| Fixed wine categories (9 columns) | Full Wine Ontology with 28+ canonical style entities |
| Printed legend | Searchable ontology with JSON-LD |
| Static infographic | Certified, versioned publication pipeline |
| Visual grouping (rows/columns) | Cross-domain ontology references by ID |
| Single-page matrix | 411+ food entity pages + wine/regions/techniques |
| Informal “similar foods” | Editorial relationship types with evidence |
| Dot = pairing | `pairs_with_style`, confidence, and certification |

When evaluating future work, prefer **extending** the platform model over **replicating** poster mechanics. A domain milestone is successful when it adds authoritative knowledge to the suite — not when it recreates a row on the chart.

**Guiding question for every milestone:**

> Does this increase the Food Ontology Suite's coverage of the knowledge represented by the poster, or extend it beyond what a static poster can do?

---

## Section 6 — Poster Concepts Not Yet Implemented

These are **reasoning capabilities** illustrated on the poster, not ontology gaps:

| Poster capability | Description | Owner | Status |
|-------------------|-------------|-------|--------|
| **Multi-ingredient pairing** | Venn intersection of wine recommendations across ingredients (e.g. Mushroom Risotto) | Pairing Engine | Not Started |
| **Ingredient + preparation pairing** | Combine food category with prep method (e.g. Pepper Steak = Red Meat ∩ Black Pepper ∩ Grilled) | Pairing Engine | Partial — homepage matrix only |
| **Two-ingredient pairing** | Shared pairing across two food nodes (e.g. salad + blue cheese) | Pairing Engine | Not Started |
| **Advanced multi-axis pairing** | Four+ concept intersection (e.g. curry with shrimp) | Pairing Engine | Not Started |
| **Meal composition** | Full dish / menu reasoning | Pairing Engine | Not Started |
| **Intersection of wine recommendations** | Compute overlap of style sets from multiple food selections | Pairing Engine | Not Started |
| **Perfect vs good pairing dots** | Differentiate strong vs ideal matches | Pairing Engine | Partial — confidence tiers in matrix UI |

The legacy `assets/js/pairing-engine.js` implements a **simplified** version of the poster matrix for the homepage. It is not yet backed by the full ontology graph or certification pipeline.

---

## Section 7 — Pairing Engine Roadmap

The Pairing Engine **consumes** ontology data. It never becomes an ontology domain.

| Milestone | Scope | Depends on |
|-----------|-------|------------|
| **ENGINE-01** | Shared pairing computation — load food + wine edges; compute style recommendations from ontology | FOOD-05+ domains, existing wine edges |
| **ENGINE-02** | Weighting — confidence, contradiction penalties, preference tiers | ENGINE-01 |
| **ENGINE-03** | Meal Composer — multi-ingredient intersection matching poster Venn examples | ENGINE-02, broad food suite coverage |

Preparation methods (poster **Preparation** row) may integrate as ENGINE context or a future **PREP-01** preparation taxonomy — not as duplicate food entities.

---

## Section 8 — Governance Rules

Permanent project principles:

### Platform vs domain

> **Platform changes require architectural justification. Domain additions do not.**

New food domains supply authoritative catalog data and domain configuration. They must not duplicate publication, certification, or deployment infrastructure.

### Cross-domain references

> **Ontology domains may reference entities in other domains only through canonical ontology IDs. They must never duplicate another domain's intrinsic data.**

Examples:

- Protein → Vegetable: `food.vegetable.{group}.{slug}` — not embedded vegetable metadata
- Cheese → Fruit: `food.fruit.grape` (already in FOOD-04D editorial edges)
- Future Dish entities: compose references to Protein, Cheese, Vegetable, Herb, Sauce IDs

Each domain remains the **authoritative source** for its intrinsic fields. Relationships express culinary context across domains.

### Suite versioning

| Stream | Version | Changes when |
|--------|---------|--------------|
| Platform | v1.0.0 | Compiler, publication, certification, or deployment architecture changes |
| Individual food domain | v1.0.0 per domain | Domain catalog or governance revision |
| Food Ontology Suite | v1.1.0 → v1.2.0 … | New published domain added (+1 minor) |

---

## Section 9 — Definition of Complete Poster Coverage

**Poster Complete** is reached when:

1. **Every food category** on the poster has a corresponding **published ontology domain** (or is intentionally superseded by a richer domain split documented in this matrix).
2. **Every wine category column** on the poster is represented by certified ontology data **and** engine-level style-family mapping to published wine styles.
3. **Preparation taxonomy** is complete as a first-class reference layer (PREP-01 or equivalent) or formally integrated into the Pairing Engine with documented rules.
4. **Pairing Engine** implements multi-ingredient reasoning equivalent to the poster's Venn-diagram examples (ENGINE-03).
5. **All poster concepts** are either implemented, mapped to a planned phase with a target suite version, or explicitly marked **Superseded** with rationale.

Poster Complete is **not** the same as Platform v2.0 or suite v2.0. It is a **coverage milestone** tied to the original inspiration artifact.

---

## Project hierarchy

```
Vision (Poster)
        ↓
PLAN-01  (this document)
        ↓
Food Ontology Roadmap  (FOOD-05 … FOOD-14)
        ↓
Platform v1.0.0
        ↓
Implementation
```

---

## Master Roadmap (post PLAN-01)

```
PLAN-01  Poster Coverage Matrix          ← this document
    ↓
FOOD-05  Vegetables
FOOD-06  Fungi
FOOD-07  Herbs & Spices
FOOD-08  Grains & Starches
FOOD-09  Fruits & Berries
FOOD-10  Nuts & Seeds
FOOD-11  Beans & Peas
FOOD-12  Sweet Flavors
FOOD-13  Sauces & Condiments
FOOD-14  Seafood Refinement
    ↓
ENGINE-01  Shared Pairing Engine
ENGINE-02  Pairing Weighting
ENGINE-03  Meal Composer
```

Each FOOD-0N milestone follows the proven lifecycle:

**Governance → Catalog → Runtime → Editorial → Wine Pairing → Publication**

No additional platform phases unless a genuine architectural limitation is discovered.

---

## Coverage snapshot (v1.1.0)

| Poster area | Complete | Partial | Not Started | Deferred |
|-------------|----------|---------|-------------|----------|
| Meat | 4 | 4 | 0 | 0 |
| Preparation | 0 | 0 | 0 | 5 |
| Dairy | 3 | 0 | 0 | 0 |
| Vegetables | 0 | 0 | 4 | 0 |
| Fungi | 0 | 1 | 0 | 0 |
| Herbs & Spices | 0 | 0 | 6 | 0 |
| Starches | 0 | 0 | 4 | 0 |
| Nuts / Beans (poster placement) | 0 | 2 | 0 | 0 |
| Sweet | 0 | 0 | 3 | 0 |
| Sauces | 0 | 0 | 1 | 0 |
| Wine columns | 0 | 9 | 0 | 0 |

**Next planned work:** FOOD-05A — Vegetable governance (from tag `food-ontology-suite-v1.1.0`).
