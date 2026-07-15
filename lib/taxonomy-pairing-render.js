/**
 * KNOWLEDGE-04 — Pairing guide taxonomy HTML sections.
 */

import { grapeUrl } from "./public-url.js";
import { escapeHtml } from "./taxonomy-render.js";
import { renderDescriptorChecklist, renderRelatedContentBlock } from "./taxonomy-chips-render.js";

export function renderPairingWhySection(taxonomy, ctx) {
  if (!ctx.why.descriptors.length) return "";

  const checklist = renderDescriptorChecklist(
    taxonomy,
    ctx.why.descriptors.map((d) => d.slug)
  );

  const grapeLine = ctx.primaryWine
    ? `<p class="pairing-recommended-grape">Recommended: <a href="${grapeUrl(ctx.grapeSlug)}">${escapeHtml(ctx.primaryWine.name)}</a></p>`
    : "";

  return `<section class="term-entity-section pairing-why-taxonomy" aria-labelledby="why-taxonomy-heading">
<h2 id="why-taxonomy-heading">Why it works</h2>
${grapeLine}
<p>${escapeHtml(ctx.why.intro)}</p>
${checklist}
</section>`;
}

export function renderPairingRelatedSection(ctx) {
  return renderRelatedContentBlock(ctx.related);
}
