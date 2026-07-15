/**
 * ONTOLOGY-01A — Wine Style page HTML sections + JSON-LD.
 */

import { grapeUrl, pairingUrl, wineStyleUrl } from "./public-url.js";
import { escapeHtml, renderBreadcrumb } from "./taxonomy-render.js";
import { renderDescriptorPillList, renderRelatedContentBlock } from "./taxonomy-chips-render.js";

const STRUCTURE_LABELS = {
  body: "Body",
  tannin: "Tannin",
  acidity: "Acidity",
  alcohol: "Alcohol",
  sweetness: "Sweetness",
  oak: "Oak influence",
};

export function renderStructureBars(structure) {
  const rows = Object.entries(STRUCTURE_LABELS)
    .map(([key, label]) => {
      const value = structure[key] ?? 0;
      const pct = Math.round((value / 5) * 100);
      return `<div class="wine-structure-bar">
  <span class="wine-structure-label">${escapeHtml(label)}</span>
  <span class="wine-structure-track" role="meter" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="5" aria-label="${escapeHtml(label)} ${value} of 5">
    <span class="wine-structure-fill" style="--fill:${pct}%"></span>
  </span>
  <span class="wine-structure-value">${value} / 5</span>
</div>`;
    })
    .join("\n");

  return `<section class="term-entity-section wine-style-structure" aria-labelledby="structure-heading">
<h2 id="structure-heading">Wine structure</h2>
<div class="wine-structure-bars">${rows}</div>
</section>`;
}

export function renderWineStyleBreadcrumb(styleName) {
  return renderBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Wine Styles", href: "/styles/" },
    { label: styleName, href: "#" },
  ]);
}

export function renderWineStyleSections(taxonomy, ctx) {
  const s = ctx.style;
  const sections = [];

  sections.push(`<header class="term-entity-hero wine-style-hero">
<p class="term-entity-label">Wine Style</p>
<h1>${escapeHtml(s.name)}</h1>
<p class="wine-style-classification">${escapeHtml(s.classification)}</p>
</header>`);

  sections.push(`<section class="direct-answer wine-style-summary" aria-label="Summary">
<p>${escapeHtml(s.summary)}</p>
</section>`);

  if (s.pronunciation) {
    sections.push(`<p class="wine-style-pronunciation"><strong>Pronunciation:</strong> ${escapeHtml(s.pronunciation)}</p>`);
  }

  if (s.aliases?.length) {
    sections.push(`<p class="wine-style-aliases"><strong>Also known as:</strong> ${escapeHtml(s.aliases.join(", "))}</p>`);
  }

  sections.push(renderStructureBars(ctx.structure));

  if (ctx.descriptors.length) {
    sections.push(`<section class="term-entity-section wine-style-descriptors" aria-labelledby="descriptors-heading">
<h2 id="descriptors-heading">Typical descriptors</h2>
${renderDescriptorPillList(taxonomy, ctx.descriptors.map((d) => d.slug))}
</section>`);
  }

  if (ctx.grapes.length) {
    sections.push(`<section class="term-entity-section wine-style-grapes" aria-labelledby="grapes-heading">
<h2 id="grapes-heading">Typical grapes</h2>
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

  if (ctx.regions?.length) {
    sections.push(`<section class="term-entity-section wine-style-regions" aria-labelledby="regions-heading">
<h2 id="regions-heading">Typical regions</h2>
<ul class="term-entity-link-list">${ctx.regions
  .map((r) =>
    r.href
      ? `<li><a href="${escapeHtml(r.href)}">${escapeHtml(r.name)}</a></li>`
      : `<li>${escapeHtml(r.name)}</li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (ctx.primaryPairings.length || ctx.secondaryPairings.length) {
    const renderTier = (items) =>
      items
        .map((p) =>
          p.href
            ? `<li><a href="${escapeHtml(p.href)}">${escapeHtml(p.label)}</a></li>`
            : `<li>${escapeHtml(p.label)}</li>`
        )
        .join("");

    sections.push(`<section class="term-entity-section wine-style-pairings" aria-labelledby="pairings-heading">
<h2 id="pairings-heading">Food pairings</h2>
${ctx.primaryPairings.length ? `<h3 class="wine-style-subhead">Primary</h3><ul class="term-entity-link-list">${renderTier(ctx.primaryPairings)}</ul>` : ""}
${ctx.secondaryPairings.length ? `<h3 class="wine-style-subhead">Secondary</h3><ul class="term-entity-link-list">${renderTier(ctx.secondaryPairings)}</ul>` : ""}
</section>`);
  }

  if (ctx.avoidPairings.length) {
    sections.push(`<section class="term-entity-section wine-style-avoid" aria-labelledby="avoid-heading">
<h2 id="avoid-heading">Foods to avoid</h2>
<ul class="term-entity-link-list">${ctx.avoidPairings.map((a) => `<li>${escapeHtml(a)}</li>`).join("")}</ul>
</section>`);
  }

  if (ctx.relatedStyles.length) {
    sections.push(`<section class="term-entity-section wine-style-related" aria-labelledby="related-styles-heading">
<h2 id="related-styles-heading">Similar styles</h2>
<ul class="term-entity-pill-list">${ctx.relatedStyles
  .map(
    (r) =>
      `<li><a href="${escapeHtml(r.href)}" class="term-entity-pill term-entity-pill-term">${escapeHtml(r.name)}</a></li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (ctx.substitutes.length) {
    sections.push(`<section class="term-entity-section wine-style-substitutes" aria-labelledby="substitutes-heading">
<h2 id="substitutes-heading">Substitutions</h2>
<p class="wine-style-substitute-intro">If you cannot find ${escapeHtml(s.name)}, try:</p>
<ul class="term-entity-pill-list">${ctx.substitutes
  .map(
    (r) =>
      `<li><a href="${escapeHtml(r.href)}" class="term-entity-pill term-entity-pill-term">${escapeHtml(r.name)}</a></li>`
  )
  .join("")}
</ul>
</section>`);
  }

  const servingBits = (ctx.servingLinks ?? [])
    .filter((s) => s.href)
    .map(
      (s) =>
        `<li><strong>${escapeHtml(s.label)}:</strong> <a href="${escapeHtml(s.href)}">${escapeHtml(s.name)}</a></li>`
    );

  if (ctx.servingNotes) {
    servingBits.push(`<li>${escapeHtml(ctx.servingNotes)}</li>`);
  }

  if (servingBits.length) {
    sections.push(`<section class="term-entity-section wine-style-serving" aria-labelledby="serving-heading">
<h2 id="serving-heading">Serving</h2>
<ul class="term-entity-link-list">${servingBits.join("")}</ul>
</section>`);
  }

  if (s.beginner_notes) {
    sections.push(`<section class="term-entity-section wine-style-beginner" aria-labelledby="beginner-heading">
<h2 id="beginner-heading">Beginner guide</h2>
<p>${escapeHtml(s.beginner_notes)}</p>
</section>`);
  }

  if (s.faq?.length) {
    sections.push(`<section class="term-entity-section wine-style-faq" aria-labelledby="faq-heading">
<h2 id="faq-heading">FAQ</h2>
<dl class="term-entity-faq-list">${s.faq
  .map((item) => `<dt>${escapeHtml(item.q)}</dt><dd>${escapeHtml(item.a)}</dd>`)
  .join("")}
</dl>
</section>`);
  }

  if (ctx.relatedPages.length) {
    sections.push(renderRelatedContentBlock(ctx.relatedPages, "Related pages"));
  }

  return sections.join("\n\n");
}

export function buildWineStyleJsonLd(ctx, pageUrl) {
  const s = ctx.style;
  const blocks = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: s.name,
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
        { "@type": "ListItem", position: 2, name: "Wine Styles", item: "https://pairingmethod.com/styles/" },
        { "@type": "ListItem", position: 3, name: s.name, item: pageUrl },
      ],
    },
  ];

  if (s.faq?.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: s.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return blocks;
}

export function countWineStyleInternalLinks(html) {
  return (html.match(/href="\/[^"]+"/g) ?? []).length;
}
