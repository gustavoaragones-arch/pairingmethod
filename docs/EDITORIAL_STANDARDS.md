# PairingMethod Editorial Standards

**Version:** 1.0 (Ontology Foundation v1.0)  
**Status:** Authoritative  
**Scope:** Content quality and authoring — not software architecture

This document defines **how knowledge is written** in the PairingMethod ontology.

---

## 1. Purpose

Every entity in PairingMethod is educational content embedded in a semantic graph. These standards ensure that content remains accurate, consistent, and useful as the graph grows from hundreds to thousands of entities.

| Document | Governs |
|----------|---------|
| Project README | What PairingMethod is as a project |
| [`ONTOLOGY_SPECIFICATION.md`](ONTOLOGY_SPECIFICATION.md) | What entity types and relationships are **allowed** |
| [`ONTOLOGY_CHANGELOG.md`](ONTOLOGY_CHANGELOG.md) | **When** the knowledge graph changed |
| **This document** | **How** knowledge should be authored |

The specification defines structure. This document defines quality.

---

## 2. Writing Principles

These principles are permanent. They apply to every entity, every phase, and every contributor — human or AI.

### 2.1 Core Principles

1. **Educational, not promotional.** Explain wine and food; do not sell wine or imply superiority.
2. **Explain before recommending.** Readers should understand *why* before receiving *what*.
3. **Be precise rather than clever.** Clarity beats wordplay. Avoid vague superlatives.
4. **Prefer consistency over variety.** Use the same section patterns, tone, and terminology across entities of the same type.
5. **Avoid subjective marketing language.** Do not use: *world-class*, *must-try*, *unforgettable*, *perfect pairing*, *best wine ever*.
6. **Distinguish observation from recommendation.** State what a wine *shows* separately from what a reader *should do*.
7. **Prefer ontology relationships over duplicated prose.** If two entities share a link, express it as a graph relationship — not repeated copy on both pages.
8. **Every statement should improve understanding.** If a sentence does not teach, clarify, or connect, remove it.

### 2.2 Observation vs. Recommendation

| Type | Language | Example |
|------|----------|---------|
| Observation | Declarative, neutral | "Cabernet Sauvignon typically shows firm tannin and dark fruit." |
| Recommendation | Conditional, contextual | "With grilled steak, high tannin helps balance char and fat." |

Do not present recommendations as universal facts. Pairing guidance is contextual — note preparation, richness, and preference where relevant.

### 2.3 Graph Over Prose

When entity A relates to entity B:

- **Correct:** Link B in the catalog; render via graph relationship on A's page.
- **Incorrect:** Write "A is often associated with B" on both pages without a typed edge.

Duplicated prose creates drift. Relationships are the SSOT for connections.

---

## 3. Entity Standards

Every first-class entity must meet the completeness requirements for its type. Empty optional sections are omitted at render time — but required fields must be populated in the catalog or taxonomy SSOT.

### 3.1 Descriptor (`descriptor`)

**SSOT:** `data/wine-taxonomy.json`

| Field | Requirement |
|-------|-------------|
| `definition` | **Required.** One to three sentences. What the term means in wine tasting. |
| `description` / why it matters | **Required.** Why this descriptor affects pairing, structure, or style understanding. |
| `examples` | **Required when applicable.** Concrete wine styles, regions, or situations. May be empty only for abstract umbrella terms. |
| `related_terms` | **Required when relationships exist.** Maps to `related_descriptor` edges. |
| `opposite_terms` | **Required when applicable.** Maps to `opposite_descriptor` edges. |
| `parent` / category chain | **Required.** Every descriptor must sit in the taxonomy hierarchy. |
| `search_aliases` | **Recommended.** Common alternative names for search. |
| `seo_title` | **Required.** See §8.3. |
| `seo_description` | **Required.** See §8.3. |

**Definition quality:** A reader unfamiliar with the term should understand it without opening another page. Do not define a descriptor solely by referencing other descriptors without explanation.

**Example (good):**
> Graphite: Pencil-lead, mineral reduction — classic in structured Cabernet. Complements lean red meat and char.

**Example (poor):**
> Graphite: A really unique note that amazing wines sometimes have.

---

### 3.2 Descriptor Category (`descriptor_category`)

**SSOT:** `data/wine-taxonomy.json`

| Field | Requirement |
|-------|-------------|
| `definition` | **Required.** What this category covers in tasting vocabulary. |
| `intro` / why it matters | **Required.** Why this dimension matters for pairing or evaluation. |
| Hierarchy children | **Required.** Category must contain groups and/or descriptors. |
| Cross-category links | **Recommended.** Derived from graph, not hand-maintained duplicates. |

---

### 3.3 Grape Variety (`grape_variety`)

| Field | Requirement |
|-------|-------------|
| Summary | **Required.** Origin, character, and global significance. |
| Typical descriptors | **Required.** Linked descriptor slugs. |
| Typical regions | **Required.** Linked region slugs where applicable. |
| Related styles | **Required.** Styles where this grape is primary. |
| Pairing guidance | **Required.** Primary and secondary pairing directions. |
| FAQ | **Recommended.** 1–3 genuine beginner questions. |

---

### 3.4 Wine Style (`wine_style`)

**SSOT:** `data/wine-style-catalog.json`

| Field | Requirement |
|-------|-------------|
| `summary` | **Required.** 2–4 sentences: body, structure, character, pairing role. |
| Structure profile | **Required.** Body, tannin, acidity, alcohol, sweetness, oak (numeric 1–5 scale). |
| `typical_descriptors` | **Required.** Minimum 3 linked descriptors representing the style. |
| `primary_grapes` | **Required.** Linked grape slugs. |
| `typical_regions` | **Required.** Linked region slugs. |
| `serving` | **Required.** Temperature, glassware, decanting, cellaring as serving slugs. |
| Food pairings | **Required.** Primary and secondary tiers; avoid pairings as a single undifferentiated list. |
| `beginner_notes` | **Required.** One to two sentences for first-time explorers. |
| `faq` | **Required.** Minimum 2 questions addressing common confusion. |
| `related_styles` / `substitutes` | **Recommended.** Linked style slugs. |
| `seo_title` | **Required.** |
| `seo_description` | **Required.** |

**Summary quality:** Lead with structure (body, tannin, acidity), then character, then pairing role. Do not open with history or geography — that belongs on region pages.

---

### 3.5 Wine Region (`wine_region`)

**SSOT:** `data/wine-region-catalog.json`

| Field | Requirement |
|-------|-------------|
| `summary` | **Required.** Geographic identity and wine significance. |
| `classification` | **Required.** Country, region, subregion, or appellation. |
| `parent_region` | **Required when applicable.** Hierarchy must be acyclic. |
| `subregions` | **Required when applicable.** Child region slugs. |
| `climate` | **Required.** General climate character (not daily weather). |
| `typical_styles` | **Required.** Linked style slugs. |
| `typical_grapes` | **Required.** Linked grape slugs. |
| `typical_descriptors` | **Required.** Minimum 3 descriptors expressing regional typicity. |
| `food_pairings` | **Recommended.** Regional cuisine alignment. |
| `faq` | **Recommended.** Appellation law, naming, or geography questions. |
| `seo_title` | **Required.** |
| `seo_description` | **Required.** |

**Why it matters:** Every region page should answer: *Why does this place matter in wine?* Terroir, appellation history, or stylistic influence — stated factually.

---

### 3.6 Wine Serving (`wine_serving`)

**SSOT:** `data/wine-serving-catalog.json`

| Field | Requirement |
|-------|-------------|
| `name` | **Required.** Human-readable label. |
| `family` | **Required.** `temperature`, `glassware`, `decanting`, `cellaring`, `aging`, or `mistake`. |
| `summary` | **Required.** What this serving choice means and when it applies. |
| `recommended_for` | **Required.** Linked style slugs. |
| `related_descriptors` | **Recommended.** Descriptors that explain *why* this serving suits those styles. |
| `common_mistakes` | **Required for non-mistake families.** Linked mistake slugs where applicable. |
| `faq` | **Recommended.** |
| `seo_title` | **Required.** |
| `seo_description` | **Required.** |

Serving entities explain **service mechanics**, not wine character. Character belongs on style and descriptor pages.

---

### 3.7 Winemaking Technique (`winemaking_technique`)

**SSOT:** `data/winemaking-technique-catalog.json`

| Field | Requirement |
|-------|-------------|
| `summary` | **Required.** What the technique does in plain language. |
| `purpose` | **Required.** Why winemakers use it. |
| `process_stage` | **Required.** Where in production it occurs (e.g. fermentation, aging, finishing). |
| `classification` | **Required.** Grouping family (e.g. Primary Fermentation, Oak Aging). |
| `creates_descriptors` | **Required when applicable.** Linked descriptor slugs. |
| `reduces_descriptors` | **Required when applicable.** Linked descriptor slugs. |
| `common_styles` / `common_regions` | **Required when applicable.** Prevalence, not causation. |
| `related_techniques` | **Recommended.** Linked technique slugs. |
| `faq` | **Recommended.** |
| `seo_title` | **Required.** |
| `seo_description` | **Required.** |

**Effects vs. prevalence:** Descriptor changes are `creates_descriptor` / `reduces_descriptor`. Geographic or stylistic prevalence is `common_in`. Do not conflate them in prose.

---

### 3.8 Wine Fault (`wine_fault`) — Planned (ONTOLOGY-01E)

| Field | Requirement |
|-------|-------------|
| `summary` | **Required.** What the fault is and how it manifests. |
| `cause` | **Required.** Microbial, chemical, physical, or sensory origin. |
| `creates_descriptors` | **Required when applicable.** Sensory markers (e.g. musty, bruised apple). |
| `reduces_descriptor` | **Required when applicable.** Qualities the fault diminishes. |
| `common_in` | **Required when applicable.** Styles or regions where exposure is higher. |
| `avoided_by` | **Recommended.** Techniques or practices that prevent the fault. |
| `commonly_confused_with` | **Recommended.** Deliberate styles or traits mistaken for the fault. |
| `faq` | **Required.** Minimum 2 questions (detection, reversibility, severity). |
| Evidence | **Recommended** for causal claims. |

---

### 3.9 Culinary Entities — Planned (Phase II)

Future entity types (`protein`, `cooking_method`, `sauce`, `ingredient`, etc.) follow the same completeness standard:

| Requirement | Applies to all culinary entities |
|-------------|----------------------------------|
| Summary | What it is and why it matters for pairing |
| Structural traits | Fat, acid, heat, umami, sweetness where relevant |
| Graph relationships | Linked descriptors, techniques, and complementary entities |
| Pairing implications | Expressed via `pairs_with`, `enhances`, `balances` — not prose alone |
| FAQ | Minimum 1 genuine question |
| SEO fields | Same format rules as wine entities |

No domain-specific shortcuts. Culinary entities receive the same editorial rigor as wine entities.

---

## 4. Relationship Standards

Use the **most specific** relationship type available. See [`ONTOLOGY_SPECIFICATION.md`](ONTOLOGY_SPECIFICATION.md) §5 for legal constraints; this section defines editorial intent.

### 4.1 Decision Hierarchy

When connecting two entities, ask in order:

1. Is there a **dedicated relationship type** for this connection? → Use it.
2. Is this a **causal production effect**? → `creates_descriptor` or `reduces_descriptor`.
3. Is this **geographic or stylistic prevalence**? → `common_in` or `produced_in`.
4. Is this a **defining sensory trait**? → `typically_exhibits` or `commonly_expresses`.
5. Is this a **serving recommendation**? → `recommended_glass`, `recommended_temperature`, etc.
6. Is this a **pairing affinity**? → `pairs_with` or `pairs_best_with`.
7. Only if none of the above apply → `associated_with`.

**Never use `associated_with` when a specific type exists.**

---

### 4.2 `typically_exhibits`

**Use when:** A wine style or grape variety characteristically shows a descriptor in its profile.

| | |
|---|---|
| **Source** | `wine_style`, `grape_variety` |
| **Target** | `descriptor` |
| **Meaning** | Defining sensory trait |

✅ **Correct:** Cabernet Sauvignon `typically_exhibits` → `firm`  
✅ **Correct:** Riesling `typically_exhibits` → `crisp`  
❌ **Incorrect:** Burgundy region `typically_exhibits` → `elegant` (use `commonly_expresses`)  
❌ **Incorrect:** MLF `typically_exhibits` → `buttery` (use `creates_descriptor`)

---

### 4.3 `commonly_expresses`

**Use when:** A region (or occasionally a style) tends to produce wines showing a descriptor.

| | |
|---|---|
| **Source** | `wine_region`, `wine_style` |
| **Target** | `descriptor` |
| **Meaning** | Regional or collective typicity |

✅ **Correct:** Burgundy `commonly_expresses` → `elegant`  
✅ **Correct:** Marlborough `commonly_expresses` → `grapefruit`  
❌ **Incorrect:** Malolactic fermentation `commonly_expresses` → `buttery` (use `creates_descriptor`)

---

### 4.4 `creates_descriptor`

**Use when:** A winemaking technique or fault **causally produces** a sensory descriptor.

| | |
|---|---|
| **Source** | `winemaking_technique`, `wine_fault` |
| **Target** | `descriptor` |
| **Meaning** | Causal production link |

✅ **Correct:** Malolactic fermentation `creates_descriptor` → `buttery`  
✅ **Correct:** Oak aging `creates_descriptor` → `vanilla`  
✅ **Correct:** TCA (cork taint) `creates_descriptor` → `musty`  
❌ **Incorrect:** Chardonnay `creates_descriptor` → `buttery` (styles exhibit, not create)  
❌ **Incorrect:** MLF `creates_descriptor` → Chardonnay (wrong target type)

---

### 4.5 `reduces_descriptor`

**Use when:** A technique or fault **diminishes** a descriptor's presence or perception.

✅ **Correct:** Filtration `reduces_descriptor` → `hazy`  
✅ **Correct:** Oxidation `reduces_descriptor` → `fresh`  
❌ **Incorrect:** Cold soak `reduces_descriptor` → `tannic` (cold soak typically increases extraction — verify causality)

Only use when the reduction is established, not speculative.

---

### 4.6 `common_in`

**Use when:** A technique or fault is **routinely practiced or observed** in a style or region — without implying sensory causation.

| | |
|---|---|
| **Source** | `winemaking_technique`, `wine_fault` |
| **Target** | `wine_style`, `wine_region` |
| **Meaning** | Prevalence, not causation |

✅ **Correct:** Carbonic maceration `common_in` → Beaujolais  
✅ **Correct:** Malolactic fermentation `common_in` → Chardonnay  
❌ **Incorrect:** MLF `common_in` → `buttery` (wrong target — buttery is a descriptor, not a style)  
❌ **Incorrect:** Bordeaux `common_in` → Cabernet Sauvignon (use `typical_of_region` / `produced_in`)

---

### 4.7 `associated_with`

**Use when:** Two entities co-occur or relate loosely, and **no more specific type applies**.

| | |
|---|---|
| **Strength** | Weakest semantic commitment |
| **Rule** | Fallback only |

✅ **Correct:** A serving practice loosely linked to a grape variety where no dedicated type exists  
❌ **Incorrect:** MLF → Chardonnay (use `common_in`)  
❌ **Incorrect:** MLF → buttery (use `creates_descriptor`)  
❌ **Incorrect:** Cabernet → Bordeaux glass (use `recommended_glass` on the style)

**If you reach for `associated_with`, stop and check whether a dedicated type exists.**

---

### 4.8 `pairs_with` / `pairs_best_with`

**Use when:** Documenting food or pairing guide affinity.

| Type | Strength | Use |
|------|----------|-----|
| `pairs_best_with` | Primary recommendation | Top-tier pairing for the entity |
| `pairs_with` | General affinity | Secondary or symmetric pairing |

✅ **Correct:** Cabernet Sauvignon `pairs_best_with` → steak pairing guide  
✅ **Correct:** Pinot Noir `pairs_with` → roast chicken pairing guide  
❌ **Incorrect:** Cabernet `pairs_with` → `firm` (wrong target type — use `typically_exhibits`)  
❌ **Incorrect:** Every food match listed as `pairs_best_with` (reserve for primary pairings)

State pairing rationale in evidence or prose — fat/tannin binding, acid cut, weight matching — not "because it's delicious."

---

### 4.9 `recommended_glass` (and serving types)

**Use when:** A wine style has a specific serving recommendation.

✅ **Correct:** Cabernet Sauvignon `recommended_glass` → `bordeaux-glass`  
✅ **Correct:** Champagne `recommended_temperature` → `well-chilled`  
❌ **Incorrect:** Bordeaux glass `recommended_glass` → Cabernet (direction is style → serving)  
❌ **Incorrect:** Cabernet `associated_with` → `bordeaux-glass` (use dedicated serving type)

One serving type per slot per style: one glass, one temperature, one decanting, one cellaring.

---

## 5. Evidence Standards

Evidence enriches typed relationships with explainable support. It is always optional at the schema level — but editorially expected where claims benefit from justification.

### 5.1 Confidence Levels

| Level | When to use | Examples |
|-------|-------------|----------|
| **High** | Strongly established in wine education, production practice, or sensory science. Widely taught, reproducible. | Full-bodied reds → Bordeaux glass; MLF → buttery aroma; tannin binding with protein |
| **Medium** | Common and reasonable but context-dependent. Varies by producer, vintage, or preparation. | Region typicity descriptors; decanting duration; style substitution |
| **Low** | Emerging, disputed, anecdotal, or weakly supported. Use sparingly and note uncertainty in `notes`. | Experimental techniques; contested fault thresholds; niche pairing claims |

**Default to medium** when uncertain. Do not assign high confidence to subjective preference.

### 5.2 When Evidence Is Required (Editorially)

Evidence is **editorially required** when:

- A relationship would surprise an informed reader
- A causal claim links technique/fault → descriptor
- A serving recommendation lacks obvious structural justification
- A pairing recommendation contradicts conventional guidance

Evidence is **editorially optional** when:

- The relationship is widely self-evident (Champagne → well-chilled)
- The connection is definitional (descriptor hierarchy)
- The edge is purely navigational (`similar_to` between comparable styles)

Missing evidence is **never a validation error**. It is an editorial gap to close over time.

### 5.3 Reason Entities vs. Free Text

| Approach | When |
|----------|------|
| **Entity references** (`reason: [{ kind, slug }]`) | Always preferred. Cite descriptors, styles, or techniques that justify the relationship. |
| **Free text** (`notes`) | Only when no ontology entity captures the justification. |

✅ **Correct:**
```json
{
  "reason": [
    { "kind": "descriptor", "slug": "full-bodied" },
    { "kind": "descriptor", "slug": "firm" }
  ],
  "confidence": "high"
}
```

❌ **Incorrect:** A `reason` array of free-text strings when descriptor slugs exist.  
❌ **Incorrect:** Evidence citing non-existent entity slugs.

### 5.4 Evidence Quality Rules

1. Every reason entity must resolve in the graph.
2. No self-referential reasons (edge cannot cite itself).
3. No duplicate reasons on a single edge.
4. Confidence must be `high`, `medium`, or `low` — no other values.
5. Evidence supports the relationship; it does not replace the relationship.

---

## 6. Content Quality Checklist

Every ontology phase must satisfy this checklist before validation passes and the changelog is updated.

### 6.1 Entity Completeness

- [ ] All required fields populated per entity type (§3)
- [ ] Every entity has `slug`, `entity_type`, `domain`
- [ ] Summaries are 2–4 sentences (not one line, not six paragraphs)
- [ ] Definitions do not circularly reference undefined terms

### 6.2 Graph Integrity

- [ ] All relationships use canonical types from `data/relationship-types.json`
- [ ] Most specific relationship type chosen (§4)
- [ ] No orphan catalog entities (zero graph edges)
- [ ] No broken edge targets (slug must resolve)
- [ ] Bidirectional relationships are not manually duplicated

### 6.3 Evidence

- [ ] Causal and surprising claims have evidence where meaningful
- [ ] Confidence levels assigned honestly
- [ ] Reason entities cited over free text

### 6.4 FAQ Quality

- [ ] Questions address genuine beginner confusion — not keyword stuffing
- [ ] Answers are 1–3 sentences, self-contained
- [ ] Minimum count met per entity type (§3)
- [ ] No duplicate questions across entities in the same phase

### 6.5 SEO Consistency

- [ ] `seo_title` follows format patterns (§8.3)
- [ ] `seo_description` is 140–160 characters, descriptive, not promotional
- [ ] Titles do not duplicate across entities

### 6.6 Content Integrity

- [ ] No duplicate explanations across entities (link instead)
- [ ] No unsupported claims stated as fact
- [ ] No marketing language (§2.1)
- [ ] Observation separated from recommendation (§2.2)

---

## 7. Language Style

### 7.1 Voice and Tone

- **Use active voice.** "Malolactic fermentation converts malic acid" — not "Malic acid is converted."
- **Explain technical terms before using them.** First mention of MLF: "malolactic fermentation (MLF)." Subsequent mentions may abbreviate.
- **Keep definitions concise.** One to three sentences for definitions; expand in dedicated sections.
- **Avoid jargon unless defined.** Appellation, phenolic, autolytic — define on first use or link to a descriptor.
- **Maintain a neutral, educational tone.** Write as a knowledgeable instructor, not a salesperson.
- **Prefer reusable explanations over stylistic variation.** Two Cabernet summaries should follow the same structural pattern.

### 7.2 Words and Phrases to Avoid

| Avoid | Prefer |
|-------|--------|
| "Perfect pairing" | "Classic pairing" or "Traditional match" |
| "Must-try" / "Don't miss" | "Widely recommended" or "Common choice" |
| "Amazing" / "Incredible" / "Stunning" | Specific descriptors |
| "The best wine for…" | "A strong choice for…" or "Often paired with…" |
| "You will love…" | "This style typically appeals to…" |
| "World-class" / "Iconic" (unqualified) | Name the specific quality |

### 7.3 Inclusive and Accurate Language

- Acknowledge regional variation: "Classic Bordeaux blends **tend toward** firm tannin" — not "Bordeaux **is** tannic."
- Distinguish style from grape from region. Do not use interchangeably.
- Note when a practice is traditional vs. universal.

---

## 8. SEO Standards

SEO fields are editorial content. They must be consistent, accurate, and non-promotional.

### 8.1 General Rules

- Titles and descriptions must match page content.
- Do not keyword-stuff. One primary concept per title.
- Include the entity name in both `seo_title` and `seo_description`.
- Descriptions should stand alone as a useful summary in search results.

### 8.2 Description Length

- Target **140–160 characters** for `seo_description`.
- Minimum 100 characters. Maximum 180 characters.

### 8.3 Title Formats by Entity Type

| Entity Type | Format | Example |
|-------------|--------|---------|
| Descriptor | `{Name} in Wine — {Category} Descriptor & Pairing Guide` | Graphite in Wine — Inorganic Descriptor & Pairing Guide |
| Wine Style | `{Name} — Wine Style Guide, Profile & Food Pairing` | Cabernet Sauvignon — Wine Style Guide, Profile & Food Pairing |
| Wine Region | `{Name} — Guide to {Context}` | French Wine Regions — Guide to France's Appellations |
| Winemaking Technique | `{Name} — {Descriptive Subtitle}` | Malolactic Fermentation (MLF) — Butteriness in Wine |
| Wine Serving | `{Name} — {Purpose Phrase}` | Ice Cold Wine Serving Temperature |
| Wine Fault | `{Name} — Wine Fault Guide` | Cork Taint (TCA) — Wine Fault Guide |
| Culinary (future) | `{Name} — {Type} & Wine Pairing` | Beef — Protein & Wine Pairing |

---

## 9. Expansion Rules

All future ontology phases must follow these editorial standards without exception.

| Phase | Domain | Same standards apply |
|-------|--------|---------------------|
| ONTOLOGY-01E | Wine Faults | Yes — full entity, relationship, and evidence standards |
| ONTOLOGY-02A | Proteins | Yes |
| ONTOLOGY-02B | Cooking Techniques | Yes |
| ONTOLOGY-02C–02J | Sauces, Ingredients, Cuisines, etc. | Yes |

### 9.1 No Domain Shortcuts

- Do not ship culinary entities with summary-only stubs and no relationships.
- Do not create fault entities without causal descriptor links.
- Do not skip FAQ, SEO, or beginner notes to save time.
- Do not invent a new prose pattern per entity — follow the type template.

### 9.2 Phase Deliverables (Editorial)

Every ontology phase must produce:

1. Complete catalog entries per §3
2. Relationships per §4
3. Evidence per §5 where meaningful
4. Content quality checklist (§6) signed off
5. Changelog entry per [`ONTOLOGY_CHANGELOG.md`](ONTOLOGY_CHANGELOG.md) maintenance rules
6. Specification update only if new entity or relationship types were added

---

## 10. AI Authoring Guidelines

Cursor and other AI assistants contribute to ontology implementation. These rules prevent AI-generated drift.

### 10.1 Hard Rules

1. **Never invent relationship types.** Use only types in `data/relationship-types.json`.
2. **Never invent evidence.** Do not fabricate confidence levels, reason entities, or citations.
3. **Never invent entity slugs.** Every target must exist in the appropriate catalog or taxonomy.
4. **Prefer extending the graph over duplicating text.** Add relationships; do not copy prose across entities.
5. **Preserve SSOT.** Edit catalogs and taxonomy — not generated HTML pages.
6. **Preserve canonical terminology.** Use entity type names and relationship IDs exactly as registered.
7. **Respect Architecture Freeze Rule.** Do not modify Ontology Foundation primitives during knowledge phases.

### 10.2 AI Workflow

When AI assists an ontology phase:

```
1. Read ONTOLOGY_SPECIFICATION.md (what is allowed)
2. Read EDITORIAL_STANDARDS.md (how to write)
3. Read existing catalog entries for the entity type (pattern matching)
4. Propose catalog changes only — not generator or runtime changes
5. Run validation scripts
6. Update ONTOLOGY_CHANGELOG.md
```

### 10.3 AI Quality Checks

Before accepting AI-generated content, verify:

- [ ] No marketing language slipped in
- [ ] Relationship types are the most specific available
- [ ] No circular definitions
- [ ] SEO fields match format patterns
- [ ] Evidence reason slugs resolve in the graph
- [ ] Tone matches existing entities of the same type

---

## 11. Governance Completion

With this document, the Ontology Foundation v1.0 governance set is complete:

```
docs/
├── ONTOLOGY_CHANGELOG.md       ✅  history
├── ONTOLOGY_SPECIFICATION.md   ✅  contract (what is allowed)
└── EDITORIAL_STANDARDS.md      ✅  quality (how to write)
```

No additional foundational documentation should be created unless the platform itself changes (Ontology Foundation v2.0).

Future work returns entirely to **knowledge expansion**:

- ONTOLOGY-01E — Wine Faults
- ONTOLOGY-02A — Proteins
- ONTOLOGY-02B — Cooking Techniques
- …

---

## Appendix — Quick Reference Card

### Relationship Selection

```
Causal effect?        → creates_descriptor / reduces_descriptor
Defining trait?       → typically_exhibits / commonly_expresses
Prevalence?           → common_in / produced_in
Serving?              → recommended_glass / recommended_temperature / …
Pairing?              → pairs_best_with / pairs_with
Nothing specific?     → associated_with (last resort)
```

### Confidence Selection

```
Established fact?     → high
Context-dependent?    → medium
Disputed/emerging?    → low
```

### Content Tone

```
Educational ✅   Promotional ❌
Precise ✅       Clever ❌
Graph links ✅   Duplicated prose ❌
Observation ✅   Unqualified superlatives ❌
```

---

*This document is authoritative for editorial quality. When editorial practice and this document diverge, update this document — or correct the content.*
