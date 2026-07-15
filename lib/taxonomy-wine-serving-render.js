/**
 * ONTOLOGY-01C — Wine Serving page HTML sections + JSON-LD.
 */

import { escapeHtml, renderBreadcrumb } from "./taxonomy-render.js";
import { renderDescriptorPillList, renderRelatedContentBlock } from "./taxonomy-chips-render.js";

const FAMILY_LABELS = {
  temperature: "Serving Temperature",
  glassware: "Glassware",
  decanting: "Decanting",
  cellaring: "Cellaring",
  aging: "Aging Potential",
  mistake: "Serving Mistake",
};

export function renderWineServingBreadcrumb(entityName) {
  return renderBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Serving & Service", href: "/serving/" },
    { label: entityName, href: "#" },
  ]);
}

export function renderWineServingSections(taxonomy, ctx) {
  const e = ctx.entity;
  const sections = [];
  const familyLabel = FAMILY_LABELS[e.family] ?? e.family;

  sections.push(`<header class="term-entity-hero wine-serving-hero">
<p class="term-entity-label">Wine Serving</p>
<h1>${escapeHtml(e.name)}</h1>
<p class="wine-serving-family">${escapeHtml(familyLabel)}</p>
</header>`);

  sections.push(`<section class="direct-answer wine-serving-summary" aria-label="Summary">
<p>${escapeHtml(e.summary)}</p>
</section>`);

  if (e.aliases?.length) {
    sections.push(`<p class="wine-serving-aliases"><strong>Also known as:</strong> ${escapeHtml(e.aliases.join(", "))}</p>`);
  }

  if (ctx.styles.length) {
    sections.push(`<section class="term-entity-section wine-serving-styles" aria-labelledby="styles-heading">
<h2 id="styles-heading">Recommended for wine styles</h2>
<ul class="term-entity-pill-list">${ctx.styles
  .map(
    (s) =>
      `<li><a href="${escapeHtml(s.href)}" class="term-entity-pill term-entity-pill-term">${escapeHtml(s.name)}</a></li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (ctx.grapes.length) {
    sections.push(`<section class="term-entity-section wine-serving-grapes" aria-labelledby="grapes-heading">
<h2 id="grapes-heading">Typical grape varieties</h2>
<ul class="term-entity-link-list">${ctx.grapes
  .map((g) =>
    g.href
      ? `<li><a href="${escapeHtml(g.href)}">${escapeHtml(g.name)}</a></li>`
      : `<li>${escapeHtml(g.name)}</li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (ctx.descriptors.length) {
    sections.push(`<section class="term-entity-section wine-serving-descriptors" aria-labelledby="descriptors-heading">
<h2 id="descriptors-heading">Related descriptors</h2>
${renderDescriptorPillList(taxonomy, ctx.descriptors.map((d) => d.slug))}
</section>`);
  }

  if (ctx.regions.length) {
    sections.push(`<section class="term-entity-section wine-serving-regions" aria-labelledby="regions-heading">
<h2 id="regions-heading">Related regions</h2>
<ul class="term-entity-link-list">${ctx.regions
  .map((r) => `<li><a href="${escapeHtml(r.href)}">${escapeHtml(r.name)}</a></li>`)
  .join("")}
</ul>
</section>`);
  }

  if (ctx.mistakes.length) {
    sections.push(`<section class="term-entity-section wine-serving-mistakes" aria-labelledby="mistakes-heading">
<h2 id="mistakes-heading">Common mistakes</h2>
<ul class="term-entity-pill-list">${ctx.mistakes
  .map(
    (m) =>
      `<li><a href="${escapeHtml(m.href)}" class="term-entity-pill term-entity-pill-opposite">${escapeHtml(m.name)}</a></li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (e.faq?.length) {
    sections.push(`<section class="term-entity-section wine-serving-faq" aria-labelledby="faq-heading">
<h2 id="faq-heading">FAQ</h2>
<dl class="term-entity-faq-list">${e.faq
  .map((item) => `<dt>${escapeHtml(item.q)}</dt><dd>${escapeHtml(item.a)}</dd>`)
  .join("")}
</dl>
</section>`);
  }

  if (ctx.relatedPages.length) {
    sections.push(renderRelatedContentBlock(ctx.relatedPages, "See also"));
  }

  return sections.join("\n\n");
}

export function buildWineServingJsonLd(ctx, pageUrl) {
  const e = ctx.entity;
  const blocks = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: e.name,
      description: ctx.metaDescription,
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
          name: "Serving & Service",
          item: "https://pairingmethod.com/serving/",
        },
        { "@type": "ListItem", position: 3, name: e.name, item: pageUrl },
      ],
    },
  ];

  if (e.faq?.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: e.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return blocks;
}

export function countWineServingInternalLinks(html) {
  return (html.match(/href="\/[^"]+"/g) ?? []).length;
}
