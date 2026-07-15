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
