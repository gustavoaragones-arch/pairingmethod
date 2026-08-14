/**
 * KNOWLEDGE-02+ — Shared HTML renderers for taxonomy category & descriptor pages.
 */

import {
  aggregateAssociated,
  collectCategoryDescriptors,
  collectCategoryGroups,
  countInternalRelationships,
  frequentSearchTerms,
  getCategoryMeta,
  getCategoryNode,
  getScaleForCategory,
  relatedCategories,
  shortDefinition,
} from "./taxonomy.js";
import {
  grapeUrl,
  pairingUrl,
  termCategoryUrl,
  taxonomyNodeHref,
  termUrl,
} from "./public-url.js";

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugifyHeading(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ------------------------------------------------------------------------
 * AQ-02A — Shared publication (educational reference) renderer helpers.
 *
 * These functions are the platform's single implementation of "narrative
 * before metadata": every ontology domain renderer composes pages from
 * these helpers instead of re-implementing HTML generation. A field with
 * publication intent (summary, beginner_notes, faq, origin_context, ...)
 * either renders through one of these helpers, or the helper gracefully
 * omits its section when the field is absent — never a placeholder,
 * never an empty <section>.
 * ---------------------------------------------------------------------- */

/** Generic narrative <section> wrapper — the one place a narrative section's markup shell is defined. */
export function renderNarrativeSection(id, heading, innerHtml, sectionClass = "") {
  if (!innerHtml) return "";
  const classes = ["term-entity-section", "narrative-section", sectionClass].filter(Boolean).join(" ");
  const headingId = `${slugifyHeading(id)}-heading`;
  return `<section class="${classes}" aria-labelledby="${headingId}">
<h2 id="${headingId}">${escapeHtml(heading)}</h2>
${innerHtml}
</section>`;
}

/** Splits authored free text into paragraphs (blank-line separated) and "- " bullet lists. */
export function renderNarrativeText(text) {
  const paragraphs = String(text)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      const isList = lines.length > 1 && lines.every((l) => /^[-*]\s+/.test(l));
      if (isList) {
        const items = lines.map((l) => `<li>${escapeHtml(l.replace(/^[-*]\s+/, ""))}</li>`).join("");
        return `<ul class="narrative-list">${items}</ul>`;
      }
      return `<p>${escapeHtml(block)}</p>`;
    })
    .join("\n");
}

/**
 * Component 1 — Executive Summary. Renders `narrative.summary` in the
 * site's existing prominent "quick answer" treatment. Never hidden when
 * summary is present; gracefully omitted (no empty section) when absent.
 */
export function renderSummary(narrative, heading = "Executive Summary") {
  const text = narrative?.summary;
  if (!text) return "";
  return `<section class="direct-answer narrative-summary" aria-label="${escapeHtml(heading)}">
<h2>${escapeHtml(heading)}</h2>
<p>${escapeHtml(text)}</p>
</section>`;
}

/**
 * Component 5 — Educational introduction. The page's actual lead narrative
 * block: it is what makes sure a reader never lands on raw metadata first.
 * Renders the same `summary` field as renderSummary() but is the one the
 * page assembler calls at the top of the page — renderSummary() remains
 * available as a distinct, separately-callable component (per the platform
 * spec) for domains that later author a genuinely separate short teaser;
 * calling both today over identical data would produce the exact
 * duplicated-paragraph pattern flagged in the AQ-01 audit, so the
 * orchestrator uses exactly one of the two per page.
 */
export function renderEducationalIntroduction(name, narrative, heading = "About This Entry") {
  const text = narrative?.summary;
  if (!text) return "";
  return `<section class="direct-answer narrative-summary narrative-intro" aria-label="${escapeHtml(heading)}">
<h2>${escapeHtml(heading)}</h2>
<p>${escapeHtml(text)}</p>
</section>`;
}

/** Component 2 — Beginner Guide. Authored `beginner_notes` only; supports multiple paragraphs and lists. */
export function renderBeginnerGuide(narrative, heading = "Beginner Guide") {
  const text = narrative?.beginner_notes;
  if (!text) return "";
  return renderNarrativeSection("beginner-guide", heading, renderNarrativeText(text), "narrative-beginner");
}

/**
 * Component 3 — FAQ. Authored catalog `faq` array only. Never template-generated.
 *
 * Some authored FAQ sets include a "What is X?" answer that is byte-identical
 * to the entity's `summary` (already rendered once, at the top of the page,
 * by renderEducationalIntroduction()). Rendering it a second time here would
 * be exactly the duplicated-paragraph pattern flagged in the AQ-01 audit, so
 * a question whose answer exactly matches the already-shown summary is
 * skipped — every other authored question still renders normally, and a
 * question is only ever dropped for being a literal restatement, never for
 * its content being "similar."
 */
export function renderFAQ(narrative, heading = "FAQ") {
  const faq = narrative?.faq;
  if (!Array.isArray(faq) || !faq.length) return "";
  const summary = narrative?.summary;
  const rows = faq
    .map((item) => {
      const q = item.q ?? item.question;
      const a = item.a ?? item.answer;
      if (!q || !a) return "";
      if (summary && a === summary) return "";
      return `<dt>${escapeHtml(q)}</dt><dd>${escapeHtml(a)}</dd>`;
    })
    .filter(Boolean)
    .join("");
  if (!rows) return "";
  return renderNarrativeSection("faq", heading, `<dl class="term-entity-faq-list">${rows}</dl>`, "narrative-faq");
}

/** Regional Context — from authored `origin_context`. Omitted when absent (most entities today). */
export function renderRegionalContext(narrative, heading = "Regional Context") {
  const text = narrative?.origin_context;
  if (!text) return "";
  return renderNarrativeSection("regional-context", heading, `<p>${escapeHtml(text)}</p>`, "narrative-regional");
}

/**
 * Component 4 — Wine Pairing Explanation. Replaces a bare "Primary Wine Styles"
 * link list with an explained one, so the reader always leaves understanding
 * the mechanism rather than an unexplained name.
 *
 * Explanation sourcing: pass `opts.explanation` explicitly. When a future
 * catalog phase adds a relationship-specific "why" string for a given
 * pairing, prefer that. Today the platform has exactly one authored
 * narrative paragraph per entity (`summary`), and renderEducationalIntroduction()
 * already surfaces it once, prominently, at the top of the page — repeating
 * the identical paragraph again here would reproduce the near-duplicate-
 * paragraph pattern the AQ-01 audit flagged (e.g. grapes.html), so this
 * function does NOT silently fall back to `summary` on its own; callers
 * that have no distinct explanation simply omit `opts.explanation`, and the
 * section renders as a clearly-labeled, already-contextualized link group
 * instead of a bare, unexplained list.
 */
export function renderWinePairingExplanation(name, narrative, linkGroups, opts = {}) {
  const groups = (linkGroups ?? []).filter((g) => g.links?.length);
  if (!groups.length) return "";

  const heading = opts.heading ?? "Wine Pairing Explanation";
  const explanation = opts.explanation;
  const explanationHtml = explanation
    ? `<p class="wine-pairing-rationale">${escapeHtml(explanation)}</p>`
    : "";

  const groupsHtml = groups
    .map((g) => {
      const heading3 = `<h3>${escapeHtml(g.title)}</h3>`;
      return `<div class="wine-pairing-group">${heading3}${renderLinkList(g.links)}</div>`;
    })
    .join("\n");

  return renderNarrativeSection(
    "wine-pairing-explanation",
    heading,
    `${explanationHtml}\n${groupsHtml}`,
    "narrative-pairing"
  );
}

/** Common Culinary Uses — upgrades the "commonly served with" link list into a labeled narrative-tier section. */
export function renderCommonCulinaryUses(narrative, linkGroups, opts = {}) {
  const groups = (linkGroups ?? []).filter((g) => g.links?.length);
  if (!groups.length) return "";
  const heading = opts.heading ?? "Common Culinary Uses";
  const groupsHtml = groups
    .map((g) => {
      const label = groups.length > 1 ? `<h3>${escapeHtml(g.title)}</h3>` : "";
      return `<div class="culinary-use-group">${label}${renderLinkList(g.links)}</div>`;
    })
    .join("\n");
  return renderNarrativeSection("common-culinary-uses", heading, groupsHtml, "narrative-culinary-uses");
}

/**
 * Component: Knowledge Cards. A small, visually distinct card grid for the
 * handful of characteristic facts worth surfacing prominently — a lighter
 * alternative to a definition table, reusing the site's existing descriptor
 * card styling. Cards with no value are skipped; the section is omitted
 * entirely when no cards have data.
 */
export function renderKnowledgeCards(cards, heading = "At a Glance") {
  const populated = (cards ?? []).filter((c) => c.value);
  if (!populated.length) return "";
  const cardsHtml = populated
    .map(
      (c) => `<article class="term-category-card knowledge-card">
<h3 class="term-category-card-title">${escapeHtml(c.label)}</h3>
<p class="term-category-card-def">${escapeHtml(c.value)}</p>
</article>`
    )
    .join("");
  return renderNarrativeSection(
    "knowledge-cards",
    heading,
    `<div class="term-category-card-grid knowledge-card-grid">${cardsHtml}</div>`,
    "narrative-knowledge-cards"
  );
}

/** Shared link-list rendering, used by both narrative sections and the metadata-tier link sections below. */
export function renderNavLinkItem(link) {
  if (link.href?.startsWith("/")) {
    return `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.title)}</a></li>`;
  }
  return `<li>${escapeHtml(link.title)}</li>`;
}

export function renderLinkList(links) {
  if (!links?.length) return "";
  return `<ul class="term-entity-link-list">${links.map(renderNavLinkItem).join("")}</ul>`;
}

/** Metadata-tier link section (Related Ingredients / Related Wines / Descriptors / Techniques / member lists). */
export function renderMetaLinkSection(title, links, sectionClass = "term-entity-link-section") {
  if (!links?.length) return "";
  const headingId = `${slugifyHeading(title)}-heading`;
  return `<section class="term-entity-section ${sectionClass}" aria-labelledby="${headingId}">
<h2 id="${headingId}">${escapeHtml(title)}</h2>
${renderLinkList(links)}
</section>`;
}

function formatCharacteristicValue(value) {
  if (Array.isArray(value)) {
    if (!value.length) return null;
    return value.map((item) => String(item).replace(/-/g, " ")).join(", ");
  }
  if (value === undefined || value === null || value === "") return null;
  return String(value).replace(/-/g, " ").replace(/_/g, " ");
}

export function renderDefinitionList(entries, listClass = "term-entity-characteristics-list") {
  if (!entries.length) return "";
  const rows = entries
    .map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`)
    .join("");
  return `<dl class="${listClass}">${rows}</dl>`;
}

/** Metadata-tier definition block (Scientific Classification / Taxonomy). Formats and skips empty values. */
export function renderCharacteristicsBlock(title, characteristics, labelMap, sectionClass, listClass) {
  const entries = [];
  for (const [key, label] of Object.entries(labelMap)) {
    if (!(key in characteristics)) continue;
    const formatted = formatCharacteristicValue(characteristics[key]);
    if (formatted) entries.push([label, formatted]);
  }
  if (!entries.length) return "";

  const headingId = `${slugifyHeading(title)}-heading`;
  return `<section class="term-entity-section ${sectionClass}" aria-labelledby="${headingId}">
<h2 id="${headingId}">${escapeHtml(title)}</h2>
${renderDefinitionList(entries, listClass)}
</section>`;
}

export function renderOverviewRows(rows, listClass) {
  const entries = rows.filter(([, value]) => value);
  if (!entries.length) return "";
  return renderDefinitionList(entries, listClass);
}

export function renderBreadcrumb(items) {
  const parts = items.map((item, i) => {
    if (i === items.length - 1) {
      return `<span>${escapeHtml(item.label)}</span>`;
    }
    return `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`;
  });
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${parts.join(" &gt; ")}</nav>`;
}

function renderTreeNode(taxonomy, slug, depth = 0) {
  const node = taxonomy.nodes[slug];
  if (!node) return "";

  if (node.type === "descriptor") {
    return `<li class="taxonomy-tree-leaf"><a href="${termUrl(slug)}">${escapeHtml(node.name)}</a></li>`;
  }

  const childLis = (node.children ?? [])
    .map((child) => renderTreeNode(taxonomy, child, depth + 1))
    .filter(Boolean)
    .join("");

  if (!childLis) return "";

  const label =
    node.type === "group"
      ? `<span class="taxonomy-tree-group" id="${escapeHtml(slug)}">${escapeHtml(node.name)}</span>`
      : `<a href="${termCategoryUrl(slug)}">${escapeHtml(node.name)}</a>`;

  return `<li class="taxonomy-tree-branch taxonomy-tree-depth-${depth}">
    ${label}
    <ul class="taxonomy-tree-children">${childLis}</ul>
  </li>`;
}

/** Hierarchy tree — groups and descriptors; skips scale-only flat descriptors when scale section exists. */
export function renderHierarchyTree(taxonomy, categorySlug, scaleSlugs = new Set()) {
  const catNode = getCategoryNode(taxonomy, categorySlug);
  if (!catNode) return "";

  const topChildren = (catNode.children ?? []).filter((slug) => {
    const n = taxonomy.nodes[slug];
    if (!n) return false;
    if (n.type === "group") return true;
    if (n.type === "descriptor" && scaleSlugs.has(slug)) return false;
    return n.type === "descriptor";
  });

  const items = topChildren.map((slug) => renderTreeNode(taxonomy, slug)).filter(Boolean).join("");
  if (!items) return "";

  return `<section class="term-category-section term-category-hierarchy" aria-labelledby="hierarchy-heading">
<h2 id="hierarchy-heading">Hierarchy</h2>
<ul class="taxonomy-tree taxonomy-tree-root">${items}</ul>
</section>`;
}

export function renderScale(taxonomy, categorySlug) {
  const scale = getScaleForCategory(taxonomy, categorySlug);
  if (!scale?.ordered_slugs?.length) return "";

  const items = scale.ordered_slugs
    .map((slug, i) => {
      const node = taxonomy.nodes[slug];
      if (!node) return "";
      const arrow = i < scale.ordered_slugs.length - 1 ? `<span class="taxonomy-scale-arrow" aria-hidden="true">↓</span>` : "";
      return `<li class="taxonomy-scale-step">
        <a href="${termUrl(slug)}" class="taxonomy-scale-link">${escapeHtml(node.name)}</a>
        ${arrow}
      </li>`;
    })
    .filter(Boolean)
    .join("");

  return `<section class="term-category-section term-category-scale" aria-labelledby="scale-heading">
<h2 id="scale-heading">${escapeHtml(scale.name)}</h2>
<ol class="taxonomy-scale">${items}</ol>
</section>`;
}

export function renderDescriptorCard(taxonomy, descriptor) {
  const related = (descriptor.related_terms ?? [])
    .slice(0, 4)
    .map((s) => taxonomy.nodes[s])
    .filter(Boolean);

  const relatedHtml = related.length
    ? `<ul class="term-category-card-related">${related
        .map((r) => `<li><a href="${taxonomyNodeHref(r)}">${escapeHtml(r.name)}</a></li>`)
        .join("")}</ul>`
    : "";

  const catMeta = getCategoryMeta(taxonomy, descriptor.category);

  return `<article class="term-category-card">
<h3 class="term-category-card-title"><a href="${termUrl(descriptor.slug)}">${escapeHtml(descriptor.name)}</a></h3>
<p class="term-category-card-def">${escapeHtml(shortDefinition(descriptor.definition))}</p>
<p class="term-category-card-meta">${escapeHtml(catMeta?.name ?? descriptor.category)}</p>
${relatedHtml}
<p class="term-category-card-cta"><a href="${termUrl(descriptor.slug)}">Read definition →</a></p>
</article>`;
}

export function renderDescriptorGrid(taxonomy, categorySlug) {
  const descriptors = collectCategoryDescriptors(taxonomy, categorySlug);
  if (!descriptors.length) return "";

  const cards = descriptors.map((d) => renderDescriptorCard(taxonomy, d)).join("");

  return `<section class="term-category-section term-category-descriptors" aria-labelledby="descriptors-heading">
<h2 id="descriptors-heading">All descriptors <span class="term-category-count">(${descriptors.length})</span></h2>
<div class="term-category-card-grid">${cards}</div>
</section>`;
}

function linkList(items, hrefFn, labelFn) {
  if (!items.length) return "";
  return `<ul class="term-category-link-list">${items
    .map((item) => {
      const href = hrefFn(item);
      const label = labelFn(item);
      return `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`;
    })
    .join("")}</ul>`;
}

export function buildCategoryPageContext(taxonomy, categorySlug, options = {}) {
  const { winesCatalog = [], glossaryHubHref } = options;
  const meta = getCategoryMeta(taxonomy, categorySlug);
  const catNode = getCategoryNode(taxonomy, categorySlug);
  if (!meta || !catNode) return null;

  const descriptors = collectCategoryDescriptors(taxonomy, categorySlug);
  const groups = collectCategoryGroups(taxonomy, categorySlug);
  const descriptorSlugs = new Set(descriptors.map((d) => d.slug));
  const scale = getScaleForCategory(taxonomy, categorySlug);
  const scaleSlugs = new Set(scale?.ordered_slugs ?? []);

  const winesFromCatalog = winesCatalog.filter((w) => {
    const descs = Object.values(w.descriptors ?? {}).flat();
    return descs.some((s) => descriptorSlugs.has(s));
  });

  const associatedWines = [
    ...aggregateAssociated(taxonomy, categorySlug, "associated_wines"),
    ...winesFromCatalog.map((w) => w.id),
  ];
  const uniqueWineIds = [...new Set(associatedWines)];

  const associatedFoods = aggregateAssociated(taxonomy, categorySlug, "associated_foods");
  const associatedPairings = aggregateAssociated(taxonomy, categorySlug, "associated_pairings");

  const relatedCats = relatedCategories(taxonomy, categorySlug);
  const frequent = frequentSearchTerms(taxonomy, categorySlug);
  const internalRelations = countInternalRelationships(taxonomy, categorySlug);

  const stats = {
    descriptorCount: descriptors.length,
    subcategoryCount: groups.length,
    internalRelationships: internalRelations,
    grapeVarietyCount: uniqueWineIds.length,
  };

  const title = `${meta.name} Wine Descriptors — Glossary & Pairing Guide`;
  const metaDescription = shortDefinition(meta.introduction, 28);

  const whyMatters = `Understanding ${meta.name.toLowerCase()} descriptors helps you read tasting notes, choose wine for a specific dish, and speak the same vocabulary sommeliers use on the floor. ${meta.introduction}`;

  const overview = meta.introduction;

  const faq = [
    {
      question: `What is ${meta.name.toLowerCase()} in wine?`,
      answer: meta.introduction,
    },
    {
      question: `How many ${meta.name.toLowerCase()} descriptors are in the Pairing Method glossary?`,
      answer: `This category includes ${stats.descriptorCount} structured descriptors${stats.subcategoryCount ? ` organized into ${stats.subcategoryCount} sub-families` : ""}, each with definitions, relationships, and pairing context.`,
    },
    {
      question: `Why does ${meta.name.toLowerCase()} matter for food pairing?`,
      answer: whyMatters,
    },
  ];

  const seeAlso = [
    ...relatedCats.map((c) => ({ href: termCategoryUrl(c.slug), label: c.name })),
    ...frequent.slice(0, 4).map((f) => ({ href: termUrl(f.slug), label: f.name })),
  ];

  return {
    categorySlug,
    meta,
    catNode,
    title,
    metaDescription,
    whyMatters,
    overview,
    stats,
    scale,
    scaleSlugs,
    descriptors,
    relatedCats,
    frequent,
    faq,
    seeAlso,
    winesFromCatalog,
    uniqueWineIds,
    associatedFoods,
    associatedPairings,
    glossaryHubHref,
  };
}

export function renderCategorySections(taxonomy, ctx) {
  const sections = [];

  sections.push(`<header class="term-category-hero">
<p class="term-category-label" style="--category-color:${escapeHtml(ctx.meta.color)}">${escapeHtml(ctx.meta.name)}</p>
<h1>${escapeHtml(ctx.meta.name)} wine descriptors</h1>
<p class="term-category-intro">${escapeHtml(ctx.meta.introduction)}</p>
</header>`);

  sections.push(`<section class="term-category-section term-category-stats" aria-label="Category statistics">
<ul class="term-category-stats-list">
<li><strong>${ctx.stats.descriptorCount}</strong> descriptors</li>
${ctx.stats.subcategoryCount ? `<li><strong>${ctx.stats.subcategoryCount}</strong> subcategories</li>` : ""}
<li><strong>${ctx.stats.internalRelationships}</strong> internal relationships</li>
${ctx.stats.grapeVarietyCount ? `<li>Typical in <strong>${ctx.stats.grapeVarietyCount}</strong> grape varieties</li>` : ""}
</ul>
</section>`);

  sections.push(`<section class="term-category-section term-category-why" aria-labelledby="why-heading">
<h2 id="why-heading">Why this category matters</h2>
<p>${escapeHtml(ctx.whyMatters)}</p>
</section>`);

  sections.push(`<section class="term-category-section term-category-overview" aria-labelledby="overview-heading">
<h2 id="overview-heading">Category overview</h2>
<p>${escapeHtml(ctx.overview)}</p>
</section>`);

  const scaleHtml = renderScale(taxonomy, ctx.categorySlug);
  if (scaleHtml) sections.push(scaleHtml);

  const treeHtml = renderHierarchyTree(taxonomy, ctx.categorySlug, ctx.scaleSlugs);
  if (treeHtml) sections.push(treeHtml);

  const gridHtml = renderDescriptorGrid(taxonomy, ctx.categorySlug);
  if (gridHtml) sections.push(gridHtml);

  if (ctx.winesFromCatalog.length) {
    sections.push(`<section class="term-category-section term-category-wines" aria-labelledby="wines-heading">
<h2 id="wines-heading">Common wines</h2>
${linkList(
  ctx.winesFromCatalog,
  (w) => grapeUrl(w.grapePageSlug ?? w.id),
  (w) => w.name
)}
</section>`);
  }

  if (ctx.associatedFoods.length) {
    sections.push(`<section class="term-category-section term-category-foods" aria-labelledby="foods-heading">
<h2 id="foods-heading">Common foods</h2>
${linkList(
  ctx.associatedFoods,
  (f) => (f.startsWith("wine-") ? pairingUrl(f) : termUrl(f)),
  (f) => f.replace(/-/g, " ")
)}
</section>`);
  }

  if (ctx.associatedPairings.length) {
    sections.push(`<section class="term-category-section term-category-pairings" aria-labelledby="pairings-heading">
<h2 id="pairings-heading">Related pairing guides</h2>
${linkList(
  ctx.associatedPairings,
  (p) => pairingUrl(p),
  (p) => p.replace(/-/g, " ")
)}
</section>`);
  }

  if (ctx.relatedCats.length) {
    sections.push(`<section class="term-category-section term-category-related-cats" aria-labelledby="related-cats-heading">
<h2 id="related-cats-heading">Related categories</h2>
<ul class="term-category-pill-list">${ctx.relatedCats
  .map(
    (c) =>
      `<li><a href="${termCategoryUrl(c.slug)}" class="term-category-pill" style="--category-color:${escapeHtml(getCategoryMeta(taxonomy, c.slug)?.color ?? "#666")}">${escapeHtml(c.name)}</a></li>`
  )
  .join("")}</ul>
</section>`);
  }

  if (ctx.frequent.length) {
    sections.push(`<section class="term-category-section term-category-frequent" aria-labelledby="frequent-heading">
<h2 id="frequent-heading">Frequently searched terms</h2>
<ul class="term-category-pill-list">${ctx.frequent
  .map((f) => `<li><a href="${termUrl(f.slug)}" class="term-category-pill term-category-pill-term">${escapeHtml(f.name)}</a></li>`)
  .join("")}</ul>
</section>`);
  }

  if (ctx.faq.length) {
    sections.push(`<section class="term-category-section term-category-faq" aria-labelledby="faq-heading">
<h2 id="faq-heading">FAQ</h2>
<dl class="term-category-faq-list">${ctx.faq
  .map(
    (item) =>
      `<dt>${escapeHtml(item.question)}</dt><dd>${escapeHtml(item.answer)}</dd>`
  )
  .join("")}
</dl>
</section>`);
  }

  if (ctx.seeAlso.length) {
    const unique = [];
    const seen = new Set();
    for (const item of ctx.seeAlso) {
      if (seen.has(item.href)) continue;
      seen.add(item.href);
      unique.push(item);
    }
    if (unique.length) {
      sections.push(`<section class="term-category-section term-category-see-also" aria-labelledby="see-also-heading">
<h2 id="see-also-heading">See also</h2>
<ul class="term-category-link-list">${unique
  .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
  .join("")}</ul>
</section>`);
    }
  }

  return sections.join("\n\n");
}

export function buildCategoryJsonLd(taxonomy, ctx, pageUrl) {
  const items = ctx.descriptors.map((d, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: d.name,
    url: new URL(termUrl(d.slug), pageUrl).href,
  }));

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${ctx.meta.name} Wine Descriptors`,
      description: ctx.meta.introduction,
      url: pageUrl,
      isPartOf: {
        "@type": "WebSite",
        name: "Pairing Method",
        url: "https://pairingmethod.com/",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://pairingmethod.com/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Wine Terms",
          item: new URL(ctx.glossaryHubHref, pageUrl).href,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: ctx.meta.name,
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${ctx.meta.name} descriptors`,
      numberOfItems: items.length,
      itemListElement: items,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: ctx.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];
}
