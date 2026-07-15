/**
 * ONTOLOGY-01B — Wine Region page HTML sections + JSON-LD.
 */

import { escapeHtml, renderBreadcrumb } from "./taxonomy-render.js";
import { renderDescriptorPillList, renderRelatedContentBlock } from "./taxonomy-chips-render.js";

export function renderWineRegionBreadcrumb(regionName) {
  return renderBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Wine Regions", href: "/regions/" },
    { label: regionName, href: "#" },
  ]);
}

export function renderWineRegionSections(taxonomy, ctx) {
  const r = ctx.region;
  const sections = [];

  sections.push(`<header class="term-entity-hero wine-region-hero">
<p class="term-entity-label">Wine Region</p>
<h1>${escapeHtml(r.name)}</h1>
<p class="wine-region-meta">${escapeHtml(r.country)}${r.classification ? ` · ${escapeHtml(r.classification)}` : ""}</p>
</header>`);

  sections.push(`<section class="direct-answer wine-region-summary" aria-label="Summary">
<p>${escapeHtml(r.summary)}</p>
</section>`);

  if (r.aliases?.length) {
    sections.push(`<p class="wine-region-aliases"><strong>Also known as:</strong> ${escapeHtml(r.aliases.join(", "))}</p>`);
  }

  const geoBits = [
    r.climate ? `<li><strong>Climate:</strong> ${escapeHtml(r.climate)}</li>` : "",
    r.soil?.length ? `<li><strong>Soils:</strong> ${escapeHtml(r.soil.join(", "))}</li>` : "",
    r.elevation ? `<li><strong>Elevation:</strong> ${escapeHtml(r.elevation)}</li>` : "",
  ].filter(Boolean);

  if (geoBits.length) {
    sections.push(`<section class="term-entity-section wine-region-geography" aria-labelledby="geo-heading">
<h2 id="geo-heading">Geographic context</h2>
<ul class="term-entity-link-list">${geoBits.join("")}</ul>
</section>`);
  }

  if (ctx.parentRegion) {
    sections.push(`<section class="term-entity-section wine-region-parent" aria-labelledby="parent-heading">
<h2 id="parent-heading">Parent region</h2>
<p><a href="${escapeHtml(ctx.parentRegion.href)}" class="term-entity-parent-link">${escapeHtml(ctx.parentRegion.name)}</a></p>
</section>`);
  }

  if (ctx.subregions.length) {
    sections.push(`<section class="term-entity-section wine-region-subregions" aria-labelledby="subregions-heading">
<h2 id="subregions-heading">Subregions</h2>
<ul class="term-entity-pill-list">${ctx.subregions
  .map(
    (s) =>
      `<li><a href="${escapeHtml(s.href)}" class="term-entity-pill term-entity-pill-term">${escapeHtml(s.name)}</a></li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (ctx.grapes.length) {
    sections.push(`<section class="term-entity-section wine-region-grapes" aria-labelledby="grapes-heading">
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

  if (ctx.styles.length) {
    sections.push(`<section class="term-entity-section wine-region-styles" aria-labelledby="styles-heading">
<h2 id="styles-heading">Typical wine styles</h2>
<ul class="term-entity-pill-list">${ctx.styles
  .map(
    (s) =>
      `<li><a href="${escapeHtml(s.href)}" class="term-entity-pill term-entity-pill-term">${escapeHtml(s.name)}</a></li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (ctx.descriptors.length) {
    sections.push(`<section class="term-entity-section wine-region-descriptors" aria-labelledby="descriptors-heading">
<h2 id="descriptors-heading">Typical descriptors</h2>
${renderDescriptorPillList(taxonomy, ctx.descriptors.map((d) => d.slug))}
</section>`);
  }

  if (ctx.pairings.length) {
    sections.push(`<section class="term-entity-section wine-region-pairings" aria-labelledby="pairings-heading">
<h2 id="pairings-heading">Food pairings</h2>
<ul class="term-entity-link-list">${ctx.pairings
  .map((p) =>
    p.href
      ? `<li><a href="${escapeHtml(p.href)}">${escapeHtml(p.label)}</a></li>`
      : `<li>${escapeHtml(p.label)}</li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (ctx.relatedRegions.length) {
    sections.push(`<section class="term-entity-section wine-region-related" aria-labelledby="related-heading">
<h2 id="related-heading">Related regions</h2>
<ul class="term-entity-pill-list">${ctx.relatedRegions
  .map(
    (reg) =>
      `<li><a href="${escapeHtml(reg.href)}" class="term-entity-pill term-entity-pill-term">${escapeHtml(reg.name)}</a></li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (r.faq?.length) {
    sections.push(`<section class="term-entity-section wine-region-faq" aria-labelledby="faq-heading">
<h2 id="faq-heading">FAQ</h2>
<dl class="term-entity-faq-list">${r.faq
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

export function buildWineRegionJsonLd(ctx, pageUrl) {
  const r = ctx.region;
  const blocks = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: r.name,
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
        { "@type": "ListItem", position: 2, name: "Wine Regions", item: "https://pairingmethod.com/regions/" },
        { "@type": "ListItem", position: 3, name: r.name, item: pageUrl },
      ],
    },
  ];

  if (r.faq?.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: r.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return blocks;
}

export function countWineRegionInternalLinks(html) {
  return (html.match(/href="\/[^"]+"/g) ?? []).length;
}
