# Wine Ontology v2.0

**Certification Phase:** ONTOLOGY-01F  
**Certification Date:** July 16, 2026  
**Certification Status:** CERTIFIED WITH MINOR ISSUES  
**Machine-readable report:** [`reports/wine-ontology-certification.json`](../reports/wine-ontology-certification.json)

---

## Executive Summary

PairingMethod declares **Wine Ontology v2.0** — the first stable, production-ready release of its wine knowledge graph.

This milestone completes Phase I of the PairingMethod ontology program. Seven major wine domains are represented, connected, searchable, and published. The graph contains **401 entities**, **4,321 typed relationships**, and **110 evidence annotations**, with zero orphan entities and zero broken edges.

Wine Ontology v2.0 is certified as the stable foundation for the **Culinary Ontology Program**, beginning with ONTOLOGY-02A (Proteins).

Certification passed with minor follow-up items: evidence coverage remains below the 5% aspirational target, and a subset of editorial fields (beginner notes, FAQs) are incomplete in specific domains. None of these block release.

---

## Scope

Wine Ontology v2.0 covers the full wine knowledge surface required for semantic pairing, explainable reasoning, and public reference pages:

| Domain | Entity Type | Entities | Pages |
|--------|-------------|----------|------:|
| Descriptors | `descriptor` | 187 | 187 |
| Descriptor Categories | `descriptor_category` | 12 | 12 |
| Wine Styles | `wine_style` | 28 | 28 |
| Wine Regions | `wine_region` | 51 | 51 |
| Grape Varieties | `grape_variety` | 5 | — |
| Serving & Service | `wine_serving` | 40 | 40 |
| Winemaking Techniques | `winemaking_technique` | 60 | 60 |
| Wine Faults | `wine_fault` | 30 | 30 |

Grape varieties function as high-degree graph hubs (linked from styles, regions, and serving) rather than standalone reference pages. This is intentional for v2.0.

**Total first-class entities:** 401  
**Total published ontology URLs:** 443 (including 12 category hubs)

---

## Supported Domains

### Descriptors (187 + 12 categories)

The sensory vocabulary of wine — aroma, flavor, structure, texture, and fault-adjacent terms. Organized in a 12-category taxonomy with hierarchical `child_of`, `related_descriptor`, and `opposite_descriptor` relationships.

### Wine Styles (28)

Tier-1 style archetypes (e.g. Cabernet Sauvignon, Champagne, Nebbiolo) with full typed edges to descriptors, regions, grapes, and serving recommendations.

### Wine Regions (51)

Country and appellation nodes with geographic hierarchy (`child_of`), regional descriptor expression (`commonly_expresses`, `typical_of_region`), and cross-links to styles and techniques.

### Grape Varieties (5)

Foundational varieties — Cabernet Sauvignon, Chardonnay, Pinot Noir, Riesling, Sauvignon Blanc — serving as the highest-degree nodes in the graph.

### Serving & Service (40)

Temperature, glassware, decanting, cellaring, and service-error entities with `recommended_for` edges to styles and `related_descriptor` links to sensory outcomes.

### Winemaking Techniques (60)

Production methods from maceration through aging, filtration, and sparkling production, connected via `creates_descriptor`, `reduces_descriptor`, `common_in`, and `associated_with`.

### Wine Faults (30)

Fault entities with cause, prevention, and severity metadata, linked to descriptors they create or reduce and to regions/techniques where they commonly occur.

---

## Entity Statistics

| Metric | Value |
|--------|------:|
| Total entities | 401 |
| Descriptor nodes | 187 |
| Category / group nodes | 22 |
| First-class catalog entities | 214 |
| Entities with FAQ | 179 (85.6% of catalog entities) |
| Entities with structured data | 209 |
| Orphan entities | 0 |

### Entity Distribution

```
Descriptors     ████████████████████████████████████████  187 (46.6%)
Techniques      ███████████████                            60 (15.0%)
Regions         █████████████                              51 (12.7%)
Serving         ██████████                                 40 (10.0%)
Faults          ████████                                   30 (7.5%)
Styles          ███████                                    28 (7.0%)
Grapes          █                                           5 (1.2%)
```

---

## Relationship Statistics

| Metric | Value |
|--------|------:|
| Canonical relationship types | 53 |
| Explicit typed edges | 4,321 |
| Edges with inferred reverse | 6,855 |
| Anonymous edges remaining | 0 |
| Average relationships / entity | 9.8 |
| Graph density | 10.78 |
| Broken graph edges | 0 |

### Top Relationship Types

| Type | Count | Role |
|------|------:|------|
| `common_in` | 614 | Technique/fault → region |
| `associated_with` | 560 | Cross-entity association |
| `similar_to` | 365 | Similarity clusters |
| `related_descriptor` | 361 | Serving → descriptor |
| `commonly_expresses` | 306 | Region → descriptor |
| `creates_descriptor` | 239 | Technique/fault → descriptor |
| `child_of` | 226 | Hierarchy |
| `common_in_region` | 192 | Descriptor → region |
| `recommended_for` | 189 | Serving → style |
| `confused_with` | 178 | Disambiguation |

### Highest-Degree Entities

| Entity | Type | Degree |
|--------|------|-------:|
| Pinot Noir | grape_variety | 208 |
| Chardonnay | grape_variety | 186 |
| Cabernet Sauvignon | grape_variety | 158 |
| Crisp | descriptor | 137 |
| Cabernet Sauvignon | wine_style | 121 |
| France | wine_region | 111 |

### Reverse-Link Completeness

| Link Pair | Forward | Reverse |
|-----------|--------:|--------:|
| Style → Region | 90 | 90 |
| Style → Serving | 112 | 404 |
| Serving → Descriptor | 110 | — |
| Serving → Region | 109 | — |
| Serving → Grape | 68 | — |

All style–region links maintain bidirectional parity. Serving recommendations are asymmetric by design (many serving entities recommend for fewer styles).

---

## Evidence Statistics

| Metric | Value |
|--------|------:|
| Total evidence annotations | 110 |
| Evidence coverage | 2.56% |
| Average evidence / entity | 0.27 |
| High-confidence annotations | 79 |
| Medium-confidence annotations | 31 |

### Evidence by Domain

| Domain | Annotations |
|--------|----------:|
| Winemaking Techniques | 44 |
| Wine Faults | 40 |
| Wine Styles | 15 |
| Wine Regions | 5 |
| Serving & Service | 2 |
| Descriptors | 0 |
| Grape Varieties | 0 |

Evidence is concentrated on fault and technique relationships where explainable reasoning adds the most pairing value. Expanding evidence coverage is a post-v2.0 enrichment goal, not a release blocker.

---

## Knowledge Density Summary

| Metric | Value |
|--------|------:|
| Total entities | 401 |
| Total typed relationships | 4,321 |
| Total evidence annotations | 110 |
| Average relationships / entity | 9.8 |
| Average evidence / entity | 0.27 |
| Cross-domain relationships | 4,321 |
| Graph density | 10.78 |
| Connected components | 1 |
| Orphan entities | 0 |
| Fully connected entities | 61.9% |

### Density by Domain

| Domain | Entities | Typed Edges | Avg Edges / Entity |
|--------|--------:|------------:|-------------------:|
| Wine Styles | 28 | 597 | 21.32 |
| Wine Faults | 30 | 622 | 20.73 |
| Winemaking Techniques | 60 | 1,074 | 17.90 |
| Wine Regions | 51 | 901 | 17.67 |
| Serving & Service | 40 | 511 | 12.78 |
| Grape Varieties | 5 | 38 | 7.60 |
| Descriptors | 187 | 578 | 3.09 |

Catalog entities (styles, regions, techniques, faults, serving) average **17.9 edges per entity**. Descriptor nodes are intentionally sparser — they serve as leaf vocabulary connected through hierarchy and opposition rather than as relationship hubs.

### Cross-Domain Enrichment (ONTOLOGY-01E)

Wine Faults enriched existing entities without adding new entity types:

| Pre-existing Domain | Entities Enriched |
|--------------------|------------------:|
| Wine Regions | 25 |
| Descriptors | 26 |
| Winemaking Techniques | 21 |
| Wine Styles | 17 |
| Serving & Service | 11 |
| Grape Varieties | 5 |

---

## Explainable Reasoning Capabilities

Wine Ontology v2.0 enables the pairing engine and public pages to answer *why* — not just *what*:

- **Typed traversal** — 53 canonical relationship types with validation and reverse inference
- **Evidence-backed claims** — 110 annotations with confidence levels and cited reason entities
- **Fault reasoning** — `creates_descriptor` and `reduces_descriptor` edges explain sensory outcomes
- **Technique reasoning** — `common_in`, `creates_descriptor`, and `associated_with` connect production to taste
- **Serving reasoning** — `recommended_for` and `related_descriptor` explain service choices
- **Regional reasoning** — `commonly_expresses` and `typical_of_region` ground style in place
- **Disambiguation** — `confused_with` and `similar_to` resolve ambiguous terms (e.g. Champagne region vs. style)
- **Graph maturity** — single connected component, 0.018 ms/lookup traversal benchmark

---

## Current Limitations

1. **Evidence coverage (2.56%)** — Below the 5% aspirational target. Sufficient for fault and technique explanations; broader annotation is planned.
2. **Grape variety pages** — Five varieties are graph hubs only; no dedicated `/grapes/` reference pages in v2.0.
3. **Editorial gaps** — 51 regions and 40 serving entities lack `beginner_notes`; 30 winemaking techniques lack FAQ entries.
4. **Descriptor structured data** — Descriptor pages use BreadcrumbList and FAQPage on category hubs; individual descriptor pages predate the WebPage schema pattern used by catalog entities.
5. **Weakly connected nodes** — 135 semantic graph nodes have degree &lt; 5, predominantly peripheral descriptor vocabulary.
6. **Marketing language** — One instance flagged (`nebbiolo` — "unforgettable" in marketing copy check).

These are documented follow-ups for **Wine Ontology v2.1** (maintenance release), not certification blockers. They do not delay the Culinary Ontology Program.

---

## Platform Version

| Component | Version | Status |
|-----------|---------|--------|
| Ontology Foundation | v1.0 | Frozen |
| Wine Ontology (knowledge) | v1.6 → **v2.0** | Certified |
| Foundation SSOT | `data/wine-taxonomy.json` v2.0.0 | Active |
| Relationship types | 53 canonical | Stable |
| Validation suite | 01E, 01D, 01C.6, KNOWLEDGE-04 | All passed |

### Governance

| Document | Status |
|----------|--------|
| [`ONTOLOGY_CHANGELOG.md`](ONTOLOGY_CHANGELOG.md) | Complete |
| [`ONTOLOGY_SPECIFICATION.md`](ONTOLOGY_SPECIFICATION.md) | Authoritative |
| [`EDITORIAL_STANDARDS.md`](EDITORIAL_STANDARDS.md) | Active |

---

## Culinary Ontology Program

With Wine Ontology v2.0 certified, PairingMethod enters the Culinary Ontology Program. Each project follows the same frozen-foundation pattern: new catalogs, typed edges, evidence, pages, and search — without modifying Ontology Foundation v1.0.

Wine Ontology v2.1 (editorial and density improvements) proceeds as a parallel maintenance track and does not block culinary development.

| Project | Domain | Entity Type |
|---------|--------|-------------|
| ONTOLOGY-02A | Proteins | `protein` |
| ONTOLOGY-02B | Cooking Techniques | `cooking_method` |
| ONTOLOGY-02C | Sauces | `sauce` |
| ONTOLOGY-02D | Ingredients | `vegetable`, `fruit`, `mushroom` |
| ONTOLOGY-02E | Herbs & Spices | `herb`, `spice` |
| ONTOLOGY-02F | Cheeses | `cheese` |
| ONTOLOGY-02G | Cuisines | `cuisine` |

Cross-domain relationships (Wine ↔ Culinary) will activate pairing reasoning across both ontologies. Culinary Ontology will use version scheme **v2.x** to distinguish it from the completed Wine Ontology v2.0 knowledge release.

---

## Certification Decision

**CERTIFIED WITH MINOR ISSUES**

Wine Ontology v2.0 is approved for production and as the stable foundation for Culinary Ontology development.

### Follow-Up Items (Wine Ontology v2.1 — Non-Blocking)

1. Raise evidence coverage toward 5% — prioritize style–descriptor and region–style relationships
2. Add `beginner_notes` to 51 region and 40 serving entities
3. Add FAQ entries to 30 winemaking technique entities
4. Consider dedicated grape variety reference pages in a future wine enrichment phase
5. Review 135 low-degree descriptor nodes for optional relationship enrichment
6. Remove marketing language from Nebbiolo style copy
7. Resolve duplicate SEO title: "Wine Served Too Warm — Signs & Fixes" (`too-warm`, `served-too-warm`)

---

*This document is the public milestone declaration for Wine Ontology v2.0. For implementation history, see [`ONTOLOGY_CHANGELOG.md`](ONTOLOGY_CHANGELOG.md). For the authoritative contract, see [`ONTOLOGY_SPECIFICATION.md`](ONTOLOGY_SPECIFICATION.md).*
