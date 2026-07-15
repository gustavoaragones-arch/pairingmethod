/**
 * KNOWLEDGE-03 — Descriptor entity page HTML renderers.
 */

import {
  renderDescriptorPillList,
  renderRelatedContentBlock,
} from "./taxonomy-chips-render.js";
import { grapeUrl, pairingUrl, termCategoryUrl, taxonomyNodeHref, termUrl } from "./public-url.js";
import { escapeHtml, renderBreadcrumb } from "./taxonomy-render.js";

function linkList(items, hrefFn, labelFn) {
  if (!items.length) return "";
  return `<ul class="term-entity-link-list">${items
    .map((item) => {
      const href = hrefFn(item);
      const label = labelFn(item);
      return `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`;
    })
    .join("")}</ul>`;
}

function pillList(items, hrefFn, labelFn, extraClass = "") {
  if (!items.length) return "";
  return `<ul class="term-entity-pill-list">${items
    .map((item) => {
      const href = hrefFn(item);
      const label = labelFn(item);
      return `<li><a href="${escapeHtml(href)}" class="term-entity-pill ${extraClass}">${escapeHtml(label)}</a></li>`;
    })
    .join("")}</ul>`;
}

export function renderDescriptorBreadcrumb(taxonomy, ctx) {
  const items = [
    { label: "Home", href: "/" },
    { label: "Wine Terms", href: ctx.glossaryHubHref },
    {
      label: ctx.catMeta?.name ?? ctx.node.category,
      href: termCategoryUrl(ctx.node.category),
    },
    { label: ctx.node.name, href: "#" },
  ];
  return renderBreadcrumb(items);
}

/** Vertical taxonomy path (category → group → descriptor). */
export function renderTaxonomyPath(taxonomy, ctx) {
  const segments = ctx.path.filter((n) => n.type !== "descriptor" || n.slug === ctx.node.slug);
  if (segments.length < 2) return "";

  const lines = segments.map((n, i) => {
    const isLast = i === segments.length - 1;
    const arrow = isLast ? "" : `<span class="taxonomy-path-arrow" aria-hidden="true">↓</span>`;
    if (isLast) {
      return `<div class="taxonomy-path-step taxonomy-path-current"><span>${escapeHtml(n.name)}</span>${arrow}</div>`;
    }
    const href =
      n.type === "category"
        ? termCategoryUrl(n.slug)
        : n.type === "group"
          ? termCategoryUrl(n.category) + `#${n.slug}`
          : termUrl(n.slug);
    return `<div class="taxonomy-path-step"><a href="${escapeHtml(href)}">${escapeHtml(n.name)}</a>${arrow}</div>`;
  });

  return `<section class="term-entity-section term-entity-path" aria-labelledby="path-heading">
<h2 id="path-heading">Position inside its category</h2>
<div class="taxonomy-path">${lines.join("")}</div>
</section>`;
}

/** Scale rail with current descriptor highlighted. */
export function renderDescriptorScaleRail(taxonomy, ctx) {
  if (!ctx.scaleCtx) return "";

  const { scale, position } = ctx.scaleCtx;
  const items = scale.ordered_slugs
    .map((slug) => {
      const n = taxonomy.nodes[slug];
      if (!n) return "";
      const isCurrent = slug === ctx.node.slug;
      const dot = isCurrent
        ? `<span class="scale-rail-dot is-current" aria-current="true">●</span>`
        : `<span class="scale-rail-dot">○</span>`;
      const cls = isCurrent ? " taxonomy-scale-rail-item is-current" : " taxonomy-scale-rail-item";
      return `<li class="${cls.trim()}">${dot}<a href="${termUrl(slug)}">${escapeHtml(n.name)}</a></li>`;
    })
    .filter(Boolean)
    .join("");

  return `<section class="term-entity-section term-entity-scale-rail" aria-labelledby="scale-rail-heading">
<h2 id="scale-rail-heading">${escapeHtml((scale.name || "").replace(/ Scale$/i, "") || scale.name)}</h2>
<ol class="taxonomy-scale-rail" start="1">${items}</ol>
<p class="term-entity-scale-position">Position <strong>${position + 1}</strong> of ${scale.ordered_slugs.length} on the ${escapeHtml(ctx.catMeta?.name ?? scale.category)} scale.</p>
</section>`;
}

export function renderEntityNavigation(ctx) {
  const { previous, next } = ctx.nav;
  if (!previous && !next) return "";

  const prevHtml = previous
    ? `<a class="term-entity-nav-prev" href="${termUrl(previous.slug)}">← ${escapeHtml(previous.name)}</a>`
    : `<span class="term-entity-nav-prev is-empty"></span>`;
  const nextHtml = next
    ? `<a class="term-entity-nav-next" href="${termUrl(next.slug)}">${escapeHtml(next.name)} →</a>`
    : `<span class="term-entity-nav-next is-empty"></span>`;

  return `<nav class="term-entity-nav" aria-label="Descriptor navigation">
${prevHtml}
${nextHtml}
</nav>`;
}

export function renderDescriptorSections(taxonomy, ctx) {
  const sections = [];
  const color = ctx.catMeta?.color ?? "#7a2d3b";

  sections.push(`<header class="term-entity-hero">
<p class="term-entity-label" style="--category-color:${escapeHtml(color)}">${escapeHtml(ctx.catMeta?.name ?? ctx.node.category)}</p>
<h1>${escapeHtml(ctx.node.name)}</h1>
</header>`);

  sections.push(`<section class="term-entity-section term-entity-definition" aria-labelledby="def-heading">
<h2 id="def-heading">Definition</h2>
<div class="definition-box"><p>${escapeHtml(ctx.node.definition)}</p></div>
</section>`);

  if (ctx.whyMatters) {
    sections.push(`<section class="term-entity-section term-entity-why" aria-labelledby="why-heading">
<h2 id="why-heading">Why this matters in wine</h2>
<p>${escapeHtml(ctx.whyMatters)}</p>
</section>`);
  }

  if (ctx.node.examples?.length) {
    sections.push(`<section class="term-entity-section term-entity-examples" aria-labelledby="examples-heading">
<h2 id="examples-heading">Typical aromas, flavors &amp; texture</h2>
${linkList(
  ctx.node.examples,
  () => "#",
  (e) => e
).replace(/href="#"/g, 'href="#" class="term-entity-example"')}
</section>`);
    // Fix examples - they're text not links
    sections.pop();
    sections.push(`<section class="term-entity-section term-entity-examples" aria-labelledby="examples-heading">
<h2 id="examples-heading">Typical aromas, flavors &amp; texture</h2>
<ul class="term-entity-link-list">${ctx.node.examples.map((e) => `<li>${escapeHtml(e)}</li>`).join("")}</ul>
</section>`);
  }

  const pathHtml = renderTaxonomyPath(taxonomy, ctx);
  if (pathHtml) sections.push(pathHtml);

  const parentNode = taxonomy.nodes[ctx.node.parent];
  if (parentNode && parentNode.type === "group") {
    sections.push(`<section class="term-entity-section term-entity-parent" aria-labelledby="parent-heading">
<h2 id="parent-heading">Parent</h2>
<p><a href="${termCategoryUrl(parentNode.category)}#${escapeHtml(parentNode.slug)}" class="term-entity-parent-link">${escapeHtml(parentNode.name)}</a></p>
</section>`);
  } else if (parentNode && parentNode.type === "descriptor") {
    sections.push(`<section class="term-entity-section term-entity-parent" aria-labelledby="parent-heading">
<h2 id="parent-heading">Parent</h2>
<p><a href="${termUrl(parentNode.slug)}" class="term-entity-parent-link">${escapeHtml(parentNode.name)}</a></p>
</section>`);
  }

  const scaleHtml = renderDescriptorScaleRail(taxonomy, ctx);
  if (scaleHtml) sections.push(scaleHtml);

  if (ctx.catMeta) {
    sections.push(`<section class="term-entity-section term-entity-parent-cat" aria-labelledby="parent-cat-heading">
<h2 id="parent-cat-heading">Parent category</h2>
<p><a href="${termCategoryUrl(ctx.node.category)}" class="term-entity-parent-link" style="--category-color:${escapeHtml(color)}">${escapeHtml(ctx.catMeta.name)}</a> — ${escapeHtml(shortCategoryIntro(ctx.catMeta.introduction))}</p>
</section>`);
  }

  if (ctx.siblings.length) {
    sections.push(`<section class="term-entity-section term-entity-siblings" aria-labelledby="siblings-heading">
<h2 id="siblings-heading">Sibling descriptors</h2>
${pillList(ctx.siblings, (n) => taxonomyNodeHref(n), (n) => n.name, "term-entity-pill-term")}</section>`);
  }

  if (ctx.related.length) {
    sections.push(`<section class="term-entity-section term-entity-related" aria-labelledby="related-heading">
<h2 id="related-heading">Related descriptors</h2>
${pillList(ctx.related, (n) => taxonomyNodeHref(n), (n) => n.name, "term-entity-pill-term")}</section>`);
  }

  if (ctx.opposites.length) {
    sections.push(`<section class="term-entity-section term-entity-opposites" aria-labelledby="opposites-heading">
<h2 id="opposites-heading">Opposite descriptors</h2>
${pillList(ctx.opposites, (n) => taxonomyNodeHref(n), (n) => n.name, "term-entity-pill-opposite")}</section>`);
  }

  if (ctx.scaleCtx?.nearby?.length) {
    const nearby = ctx.scaleCtx.nearby.filter((n) => n.slug !== ctx.node.slug);
    if (nearby.length) {
      sections.push(`<section class="term-entity-section term-entity-nearby-scale" aria-labelledby="nearby-scale-heading">
<h2 id="nearby-scale-heading">Nearby on the scale</h2>
${pillList(nearby, (n) => taxonomyNodeHref(n), (n) => n.name, "term-entity-pill-term")}</section>`);
    }
  }

  if (ctx.sameCategory.length) {
    sections.push(`<section class="term-entity-section term-entity-same-cat" aria-labelledby="same-cat-heading">
<h2 id="same-cat-heading">More in ${escapeHtml(ctx.catMeta?.name ?? ctx.node.category)}</h2>
${pillList(
  ctx.sameCategory.slice(0, 8),
  (n) => taxonomyNodeHref(n),
  (n) => n.name,
  "term-entity-pill-term"
)}</section>`);
  }

  if (ctx.children.length) {
    sections.push(`<section class="term-entity-section term-entity-children" aria-labelledby="children-heading">
<h2 id="children-heading">Child descriptors</h2>
${pillList(ctx.children, (n) => taxonomyNodeHref(n), (n) => n.name, "term-entity-pill-term")}</section>`);
  }

  if (ctx.pairingSlugs.length || ctx.grapes.length) {
    const appearsIn = [
      ...ctx.grapes.map((w) => ({
        href: grapeUrl(w.grapePageSlug ?? w.id),
        label: w.name,
      })),
      ...ctx.pairingSlugs.map((p) => ({
        href: pairingUrl(p),
        label: formatPairingLabel(p),
      })),
    ];
    if (appearsIn.length) {
      sections.push(`<section class="term-entity-section term-entity-appears-in" aria-labelledby="appears-in-heading">
<h2 id="appears-in-heading">Appears in</h2>
<ul class="term-entity-link-list">${appearsIn
  .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
  .join("")}
</ul>
</section>`);
    }
  }

  if (ctx.foods.length) {
    sections.push(`<section class="term-entity-section term-entity-foods" aria-labelledby="foods-heading">
<h2 id="foods-heading">Common food pairings</h2>
<ul class="term-entity-link-list">${ctx.foods.map((f) => `<li>${escapeHtml(formatFoodLabel(f))}</li>`).join("")}</ul>
</section>`);
  }

  if (ctx.confused.length) {
    sections.push(`<section class="term-entity-section term-entity-confused" aria-labelledby="confused-heading">
<h2 id="confused-heading">Frequently confused with</h2>
${pillList(ctx.confused, (n) => taxonomyNodeHref(n), (n) => n.name, "term-entity-pill-confused")}</section>`);
  }

  if (ctx.relatedContent?.length) {
    sections.push(renderRelatedContentBlock(ctx.relatedContent));
  }

  if (ctx.faq.length) {
    sections.push(`<section class="term-entity-section term-entity-faq" aria-labelledby="faq-heading">
<h2 id="faq-heading">FAQ</h2>
<dl class="term-entity-faq-list">${ctx.faq
  .map((item) => `<dt>${escapeHtml(item.question)}</dt><dd>${escapeHtml(item.answer)}</dd>`)
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
      sections.push(`<section class="term-entity-section term-entity-see-also" aria-labelledby="see-also-heading">
<h2 id="see-also-heading">See also</h2>
<ul class="term-entity-link-list">${unique
  .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
  .join("")}</ul>
</section>`);
    }
  }

  sections.push(renderEntityNavigation(ctx));

  return sections.join("\n\n");
}

function shortCategoryIntro(text, max = 22) {
  const words = String(text ?? "").trim().split(/\s+/);
  if (words.length <= max) return words.join(" ");
  return `${words.slice(0, max).join(" ")}…`;
}

function formatFoodLabel(f) {
  if (typeof f !== "string") return String(f);
  return f.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatPairingLabel(slug) {
  return slug
    .replace(/^wine-with-/, "Wine with ")
    .replace(/^wine-for-/, "Wine for ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function buildDescriptorJsonLd(ctx, pageUrl) {
  const blocks = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: ctx.node.name,
      description: ctx.node.definition,
      url: pageUrl,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Pairing Method Wine Knowledge Graph",
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
          name: ctx.catMeta?.name ?? ctx.node.category,
          item: new URL(termCategoryUrl(ctx.node.category), pageUrl).href,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: ctx.node.name,
          item: pageUrl,
        },
      ],
    },
  ];

  if (ctx.faq.length) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: ctx.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return blocks;
}

export function countInternalLinks(html) {
  const hrefs = [...html.matchAll(/href="(\/[^"#?]+)"/g)].map((m) => m[1]);
  return hrefs.length;
}
