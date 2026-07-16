/**
 * ONTOLOGY-01D — Winemaking Technique page HTML sections + JSON-LD.
 */

import { escapeHtml, renderBreadcrumb } from "./taxonomy-render.js";
import { renderDescriptorPillList, renderRelatedContentBlock } from "./taxonomy-chips-render.js";

const STAGE_LABELS = {
  fermentation: "Fermentation",
  "post-fermentation": "Post-fermentation",
  maceration: "Maceration",
  pressing: "Pressing",
  aging: "Aging",
  stabilization: "Stabilization",
  sparkling: "Sparkling production",
  fortification: "Fortification",
  harvest: "Harvest",
  bottling: "Bottling",
};

function formatProcessStage(stage) {
  if (!stage) return "";
  return STAGE_LABELS[stage] ?? stage.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function renderWinemakingTechniqueBreadcrumb(name) {
  return renderBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Winemaking Techniques", href: "/techniques/" },
    { label: name, href: "#" },
  ]);
}

export function renderWinemakingTechniqueSections(taxonomy, ctx) {
  const t = ctx.entity;
  const sections = [];

  sections.push(`<header class="term-entity-hero winemaking-technique-hero">
<p class="term-entity-label">Winemaking Technique</p>
<h1>${escapeHtml(t.name)}</h1>
<p class="winemaking-technique-classification">${escapeHtml(t.classification)}</p>
</header>`);

  sections.push(`<section class="direct-answer winemaking-technique-summary" aria-label="Summary">
<p>${escapeHtml(t.summary)}</p>
</section>`);

  if (t.aliases?.length) {
    sections.push(`<p class="winemaking-technique-aliases"><strong>Also known as:</strong> ${escapeHtml(t.aliases.join(", "))}</p>`);
  }

  if (t.purpose) {
    sections.push(`<section class="term-entity-section winemaking-technique-purpose" aria-labelledby="purpose-heading">
<h2 id="purpose-heading">Purpose</h2>
<p>${escapeHtml(t.purpose)}</p>
</section>`);
  }

  if (t.process_stage) {
    sections.push(`<section class="term-entity-section winemaking-technique-stage" aria-labelledby="stage-heading">
<h2 id="stage-heading">Process stage</h2>
<p>${escapeHtml(formatProcessStage(t.process_stage))}</p>
</section>`);
  }

  if (t.used_for?.length) {
    sections.push(`<section class="term-entity-section winemaking-technique-how" aria-labelledby="how-heading">
<h2 id="how-heading">How it works</h2>
<ul class="term-entity-link-list">${t.used_for.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
</section>`);
  }

  if (ctx.styles.length) {
    sections.push(`<section class="term-entity-section winemaking-technique-styles" aria-labelledby="styles-heading">
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
    sections.push(`<section class="term-entity-section winemaking-technique-grapes" aria-labelledby="grapes-heading">
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
    sections.push(`<section class="term-entity-section winemaking-technique-regions" aria-labelledby="regions-heading">
<h2 id="regions-heading">Common regions</h2>
<ul class="term-entity-link-list">${ctx.regions
  .map((r) => `<li><a href="${escapeHtml(r.href)}">${escapeHtml(r.name)}</a></li>`)
  .join("")}
</ul>
</section>`);
  }

  if (ctx.creates.length) {
    sections.push(`<section class="term-entity-section winemaking-technique-creates" aria-labelledby="creates-heading">
<h2 id="creates-heading">Descriptors created</h2>
${renderDescriptorPillList(taxonomy, ctx.creates.map((d) => d.slug))}
</section>`);
  }

  if (ctx.reduces.length) {
    sections.push(`<section class="term-entity-section winemaking-technique-reduces" aria-labelledby="reduces-heading">
<h2 id="reduces-heading">Descriptors reduced</h2>
${renderDescriptorPillList(taxonomy, ctx.reduces.map((d) => d.slug))}
</section>`);
  }

  if (ctx.related.length) {
    sections.push(`<section class="term-entity-section winemaking-technique-related" aria-labelledby="related-heading">
<h2 id="related-heading">Related techniques</h2>
<ul class="term-entity-pill-list">${ctx.related
  .map(
    (item) =>
      `<li><a href="${escapeHtml(item.href)}" class="term-entity-pill term-entity-pill-term">${escapeHtml(item.name)}</a></li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (ctx.opposites.length) {
    sections.push(`<section class="term-entity-section winemaking-technique-opposites" aria-labelledby="opposites-heading">
<h2 id="opposites-heading">Opposite techniques</h2>
<ul class="term-entity-pill-list">${ctx.opposites
  .map(
    (item) =>
      `<li><a href="${escapeHtml(item.href)}" class="term-entity-pill term-entity-pill-opposite">${escapeHtml(item.name)}</a></li>`
  )
  .join("")}
</ul>
</section>`);
  }

  if (ctx.serving.length) {
    sections.push(`<section class="term-entity-section winemaking-technique-serving" aria-labelledby="serving-heading">
<h2 id="serving-heading">Serving implications</h2>
<ul class="term-entity-link-list">${ctx.serving
  .map((s) => `<li><a href="${escapeHtml(s.href)}">${escapeHtml(s.name)}</a></li>`)
  .join("")}
</ul>
</section>`);
  }

  if (t.beginner_notes) {
    sections.push(`<section class="term-entity-section winemaking-technique-beginner" aria-labelledby="beginner-heading">
<h2 id="beginner-heading">Beginner explanation</h2>
<p>${escapeHtml(t.beginner_notes)}</p>
</section>`);
  }

  if (t.faq?.length) {
    sections.push(`<section class="term-entity-section winemaking-technique-faq" aria-labelledby="faq-heading">
<h2 id="faq-heading">FAQ</h2>
<dl class="term-entity-faq-list">${t.faq
  .map((item) => `<dt>${escapeHtml(item.q)}</dt><dd>${escapeHtml(item.a)}</dd>`)
  .join("")}
</dl>
</section>`);
  }

  if (ctx.ontologyEntities?.length) {
    sections.push(`<section class="term-entity-section winemaking-technique-ontology" aria-labelledby="ontology-heading">
<h2 id="ontology-heading">Related ontology entities</h2>
<ul class="term-entity-link-list">${ctx.ontologyEntities
  .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a> <span class="term-entity-kind">${escapeHtml(item.kind)}</span></li>`)
  .join("")}
</ul>
</section>`);
  }

  if (ctx.relatedPages.length) {
    sections.push(renderRelatedContentBlock(ctx.relatedPages, "See also"));
  }

  return sections.join("\n\n");
}

export function buildWinemakingTechniqueJsonLd(ctx, pageUrl) {
  const t = ctx.entity;
  const blocks = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: t.name,
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
          name: "Winemaking Techniques",
          item: "https://pairingmethod.com/techniques/",
        },
        { "@type": "ListItem", position: 3, name: t.name, item: pageUrl },
      ],
    },
  ];

  if (t.faq?.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return blocks;
}

export function countWinemakingTechniqueInternalLinks(html) {
  return (html.match(/href="\/[^"]+"/g) ?? []).length;
}
