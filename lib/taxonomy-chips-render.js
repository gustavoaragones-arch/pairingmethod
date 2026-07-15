/**
 * KNOWLEDGE-04 — Shared descriptor chip / link renderers (Node generators).
 */

import { descriptorLabel } from "./taxonomy-graph.js";
import { termUrl } from "./public-url.js";
import { escapeHtml } from "./taxonomy-render.js";

export function renderDescriptorLink(taxonomy, slug, className = "term-entity-pill term-entity-pill-term") {
  const node = taxonomy.nodes[slug];
  if (!node || node.type !== "descriptor") return escapeHtml(descriptorLabel(taxonomy, slug));
  return `<a href="${termUrl(slug)}" class="${className}">${escapeHtml(node.name)}</a>`;
}

export function renderDescriptorPillList(taxonomy, slugs, className = "term-entity-pill term-entity-pill-term") {
  const items = slugs
    .map((slug) => {
      const node = taxonomy.nodes[slug];
      if (!node) return "";
      return `<li>${renderDescriptorLink(taxonomy, slug, className)}</li>`;
    })
    .filter(Boolean);
  if (!items.length) return "";
  return `<ul class="term-entity-pill-list">${items.join("")}</ul>`;
}

export function renderDescriptorChecklist(taxonomy, slugs) {
  const items = slugs
    .map((slug) => {
      const node = taxonomy.nodes[slug];
      if (!node) return "";
      return `<li>✓ <a href="${termUrl(slug)}">${escapeHtml(node.name)}</a></li>`;
    })
    .filter(Boolean);
  if (!items.length) return "";
  return `<ul class="taxonomy-checklist">${items.join("")}</ul>`;
}

export function renderRelatedContentBlock(items, title = "You may also like") {
  if (!items.length) return "";
  return `<section class="term-entity-section term-entity-related-content" aria-labelledby="related-content-heading">
<h2 id="related-content-heading">${escapeHtml(title)}</h2>
<ul class="term-entity-link-list">${items
    .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
    .join("")}
</ul>
</section>`;
}
