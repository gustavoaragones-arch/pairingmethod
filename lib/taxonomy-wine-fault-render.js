/**
 * ONTOLOGY-01E — Wine Fault page HTML sections + JSON-LD.
 */

import { escapeHtml, renderBreadcrumb } from "./taxonomy-render.js";
import { renderDescriptorPillList, renderRelatedContentBlock } from "./taxonomy-chips-render.js";

const SEVERITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function renderWineFaultBreadcrumb(name) {
  return renderBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Wine Faults", href: "/faults/" },
    { label: name, href: "#" },
  ]);
}

export function renderWineFaultSections(taxonomy, ctx) {
  const f = ctx.entity;
  const sections = [];

  sections.push(`<header class="term-entity-hero wine-fault-hero">
<p class="term-entity-label">Wine Fault</p>
<h1>${escapeHtml(f.name)}</h1>
<p class="wine-fault-classification">${escapeHtml(f.classification)}</p>
</header>`);

  sections.push(`<section class="direct-answer wine-fault-summary" aria-label="Summary">
<p>${escapeHtml(f.summary)}</p>
</section>`);

  if (f.aliases?.length) {
    sections.push(`<p class="wine-fault-aliases"><strong>Also known as:</strong> ${escapeHtml(f.aliases.join(", "))}</p>`);
  }

  if (f.severity) {
    const label = SEVERITY_LABELS[f.severity] ?? f.severity;
    sections.push(`<p class="wine-fault-severity"><strong>Typical severity:</strong> ${escapeHtml(label)}</p>`);
  }

  if (f.cause) {
    sections.push(`<section class="term-entity-section wine-fault-cause" aria-labelledby="cause-heading">
<h2 id="cause-heading">Cause</h2>
<p>${escapeHtml(f.cause)}</p>
</section>`);
  }

  if (f.how_it_occurs) {
    sections.push(`<section class="term-entity-section wine-fault-occurs" aria-labelledby="occurs-heading">
<h2 id="occurs-heading">How it occurs</h2>
<p>${escapeHtml(f.how_it_occurs)}</p>
</section>`);
  }

  if (f.prevention) {
    sections.push(`<section class="term-entity-section wine-fault-prevention" aria-labelledby="prevention-heading">
<h2 id="prevention-heading">Prevention</h2>
<p>${escapeHtml(f.prevention)}</p>
</section>`);
  }

  if (ctx.creates.length) {
    sections.push(`<section class="term-entity-section wine-fault-creates" aria-labelledby="creates-heading">
<h2 id="creates-heading">Descriptors created</h2>
${renderDescriptorPillList(taxonomy, ctx.creates.map((d) => d.slug))}
</section>`);
  }

  if (ctx.reduces.length) {
    sections.push(`<section class="term-entity-section wine-fault-reduces" aria-labelledby="reduces-heading">
<h2 id="reduces-heading">Descriptors reduced</h2>
${renderDescriptorPillList(taxonomy, ctx.reduces.map((d) => d.slug))}
</section>`);
  }

  if (ctx.confused.length) {
    sections.push(`<section class="term-entity-section wine-fault-confused" aria-labelledby="confused-heading">
<h2 id="confused-heading">Commonly confused with</h2>
<ul class="term-entity-link-list">${ctx.confused
  .map(
    (item) =>
      `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.name)}</a> <span class="term-entity-kind">${escapeHtml(item.kind)}</span></li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (ctx.styles.length) {
    sections.push(`<section class="term-entity-section wine-fault-styles" aria-labelledby="styles-heading">
<h2 id="styles-heading">Common wine styles</h2>
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
    sections.push(`<section class="term-entity-section wine-fault-grapes" aria-labelledby="grapes-heading">
<h2 id="grapes-heading">Common grape varieties</h2>
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

  if (ctx.regions.length) {
    sections.push(`<section class="term-entity-section wine-fault-regions" aria-labelledby="regions-heading">
<h2 id="regions-heading">Common regions</h2>
<ul class="term-entity-link-list">${ctx.regions
  .map((r) => `<li><a href="${escapeHtml(r.href)}">${escapeHtml(r.name)}</a></li>`)
  .join("")}
</ul>
</section>`);
  }

  if (ctx.techniques.length) {
    sections.push(`<section class="term-entity-section wine-fault-techniques" aria-labelledby="techniques-heading">
<h2 id="techniques-heading">Related winemaking techniques</h2>
<ul class="term-entity-pill-list">${ctx.techniques
  .map(
    (item) =>
      `<li><a href="${escapeHtml(item.href)}" class="term-entity-pill term-entity-pill-term">${escapeHtml(item.name)}</a></li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (ctx.serving.length) {
    sections.push(`<section class="term-entity-section wine-fault-serving" aria-labelledby="serving-heading">
<h2 id="serving-heading">Serving implications</h2>
<ul class="term-entity-link-list">${ctx.serving
  .map((s) => `<li><a href="${escapeHtml(s.href)}">${escapeHtml(s.name)}</a></li>`)
  .join("")}
</ul>
</section>`);
  }

  if (f.beginner_notes) {
    sections.push(`<section class="term-entity-section wine-fault-beginner" aria-labelledby="beginner-heading">
<h2 id="beginner-heading">Beginner explanation</h2>
<p>${escapeHtml(f.beginner_notes)}</p>
</section>`);
  }

  if (f.faq?.length) {
    sections.push(`<section class="term-entity-section wine-fault-faq" aria-labelledby="faq-heading">
<h2 id="faq-heading">FAQ</h2>
<dl class="term-entity-faq-list">${f.faq
  .map((item) => `<dt>${escapeHtml(item.q)}</dt><dd>${escapeHtml(item.a)}</dd>`)
  .join("")}
</dl>
</section>`);
  }

  if (ctx.ontologyEntities?.length) {
    sections.push(`<section class="term-entity-section wine-fault-ontology" aria-labelledby="ontology-heading">
<h2 id="ontology-heading">Related ontology entities</h2>
<ul class="term-entity-link-list">${ctx.ontologyEntities
  .map(
    (item) =>
      `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a> <span class="term-entity-kind">${escapeHtml(item.kind)}</span></li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (ctx.relatedPages.length) {
    sections.push(renderRelatedContentBlock(ctx.relatedPages, "See also"));
  }

  return sections.join("\n\n");
}

export function buildWineFaultJsonLd(ctx, pageUrl) {
  const f = ctx.entity;
  const blocks = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: f.name,
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
          name: "Wine Faults",
          item: "https://pairingmethod.com/faults/",
        },
        { "@type": "ListItem", position: 3, name: f.name, item: pageUrl },
      ],
    },
  ];

  if (f.faq?.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: f.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return blocks;
}

export function countWineFaultInternalLinks(html) {
  return (html.match(/href="\/[^"]+"/g) ?? []).length;
}
