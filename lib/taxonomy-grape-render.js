/**
 * KNOWLEDGE-04 — Grape page HTML sections.
 */

import { grapeUrl, pairingUrl, termUrl } from "./public-url.js";
import { escapeHtml } from "./taxonomy-render.js";
import {
  renderDescriptorPillList,
  renderRelatedContentBlock,
} from "./taxonomy-chips-render.js";

const BUCKET_LABELS = {
  fruit: "Fruit",
  earth: "Earth & mineral",
  spice: "Spice & oak",
  body: "Body",
  tannin: "Tannin",
  acidity: "Acidity",
};

export function renderGrapeSections(taxonomy, ctx) {
  const sections = [];
  const c = ctx.catalogEntry;

  sections.push(`<header class="term-entity-hero grape-entity-hero">
<h1>${escapeHtml(c.name)}</h1>
</header>`);

  sections.push(`<section class="direct-answer" aria-label="Quick answer">
<h2>Quick answer</h2>
<p>${escapeHtml(c.quickAnswer)}</p>
</section>`);

  sections.push(`<p class="definition-block"><strong>${escapeHtml(c.definition)}</strong></p>`);

  sections.push(`<section class="term-entity-section grape-structure" aria-labelledby="structure-heading">
<h2 id="structure-heading">Structural Profile</h2>
<table class="structure-table">
<tr><td>Body</td><td>${ctx.structure.body} / 5</td></tr>
<tr><td>Tannin</td><td>${ctx.structure.tannin} / 5</td></tr>
<tr><td>Acidity</td><td>${ctx.structure.acidity} / 5</td></tr>
<tr><td>Alcohol</td><td>${ctx.structure.alcohol} / 5</td></tr>
<tr><td>Sweetness</td><td>${ctx.structure.sweetness} / 5${ctx.structure.sweetness === 0 ? " (Dry)" : ""}</td></tr>
</table>
</section>`);

  const allSlugs = ctx.allDescriptorSlugs;
  if (allSlugs.length) {
    sections.push(`<section class="term-entity-section grape-profile" aria-labelledby="profile-heading">
<h2 id="profile-heading">Typical profile</h2>
${renderDescriptorPillList(taxonomy, allSlugs)}
</section>`);

    for (const bucket of ctx.descriptorBuckets) {
      if (!bucket.slugs.length) continue;
      const label = BUCKET_LABELS[bucket.key] ?? bucket.key;
      sections.push(`<section class="term-entity-section grape-profile-bucket" aria-labelledby="bucket-${bucket.key}">
<h3 id="bucket-${bucket.key}">${escapeHtml(label)}</h3>
${renderDescriptorPillList(taxonomy, bucket.slugs)}
</section>`);
    }
  }

  if (ctx.pairings.length || ctx.pairingLabels.length) {
    const pairingItems = [
      ...ctx.pairings.map(
        (p) => `<li><a href="${pairingUrl(p.slug)}">${escapeHtml(p.label)}</a></li>`
      ),
      ...ctx.pairingLabels.map((l) => `<li>${escapeHtml(l)}</li>`),
    ];
    sections.push(`<section class="term-entity-section grape-pairings" aria-labelledby="pairings-heading">
<h2 id="pairings-heading">Top pairings</h2>
<ul class="term-entity-link-list">${pairingItems.join("")}</ul>
</section>`);
  }

  if (c.regions) {
    sections.push(`<section class="term-entity-section"><h2>Key Regions</h2><p>${escapeHtml(c.regions)}</p></section>`);
  }
  if (c.price) {
    sections.push(`<section class="term-entity-section"><h2>Price Expectations</h2><p>${escapeHtml(c.price)}</p></section>`);
  }
  if (c.similar) {
    sections.push(`<section class="term-entity-section"><h2>Similar Wines</h2><p>${escapeHtml(c.similar)}</p></section>`);
  }

  if (ctx.related.length) {
    sections.push(renderRelatedContentBlock(ctx.related));
  }

  if (c.faqs?.length) {
    sections.push(`<section class="faq" aria-label="Frequently asked questions">
<h2>FAQ</h2>
${c.faqs
  .map(
    (f) => `<div class="faq-item"><h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p></div>`
  )
  .join("\n")}
</section>`);
  }

  return sections.join("\n\n");
}

export function buildGrapeJsonLd(ctx, pageUrl) {
  const faq = ctx.catalogEntry.faqs ?? [];
  const blocks = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: ctx.catalogEntry.name,
      description: ctx.metaDescription,
      url: pageUrl,
      author: { "@type": "Person", name: "Gustavo Aragones" },
      publisher: { "@type": "Organization", name: "Pairing Method" },
      mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    },
  ];
  if (faq.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return blocks;
}

export function renderGrapeBreadcrumb(name) {
  return `<nav class="breadcrumb" aria-label="Breadcrumb">
<a href="/">Home</a> &gt; <a href="/grapes">Grapes</a> &gt; <span>${escapeHtml(name)}</span>
</nav>`;
}
