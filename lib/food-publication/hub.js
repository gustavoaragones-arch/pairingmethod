/**
 * AQ-02B1 — Domain hub page generation.
 *
 * Fixes the AQ-01/AQ-01R Critical finding that every food-domain root path
 * (/foods/, /fruits/, etc.) 404s. Publication consumes, it doesn't create
 * knowledge (Rule 4): the hub's narrative comes from the domain's own
 * category-tier `summary` (already authored, already flowing through the
 * AQ-02A narrative pipeline), and its links come entirely from existing
 * group/category projections plus the NavigationRegistry — no new content
 * is invented here.
 */

import fs from "fs";
import path from "path";
import { escapeHtml, renderBreadcrumb } from "../taxonomy-render.js";
import { loadTemplate, fillTemplate, SHARED_ROUTES } from "../taxonomy-shell.js";
import { getSiblingDomainEntries, INGREDIENTS_DIRECTORY_PATH } from "./navigation-registry.js";
import { readJson, writeJson } from "./utils.js";

function loadProjections(domain) {
  return {
    groups: readJson(domain.paths.projections.group).projections,
    categories: readJson(domain.paths.projections.category).projections,
  };
}

function renderGroupList(domain, groups) {
  const items = groups
    .map((g) => {
      const href = `${domain.urls.groupPrefix}${g.identity.slug}/`;
      const blurb = g.narrative?.summary ? ` — ${escapeHtml(g.narrative.summary)}` : "";
      return `<li><a href="${escapeHtml(href)}">${escapeHtml(g.identity.name)}</a>${blurb}</li>`;
    })
    .join("");
  return `<section class="term-entity-section domain-hub-groups" aria-labelledby="groups-heading">
<h2 id="groups-heading">Explore ${escapeHtml(domain.entityLabels.leafPlural)}</h2>
<ul class="term-entity-link-list">${items}</ul>
</section>`;
}

function renderCategoryList(domain, categories) {
  if (categories.length < 2) return "";
  const items = categories
    .map((c) => {
      const href = `${domain.urls.categoryPrefix}${c.identity.slug}/`;
      return `<li><a href="${escapeHtml(href)}">${escapeHtml(c.identity.name)}</a></li>`;
    })
    .join("");
  return `<section class="term-entity-section domain-hub-categories" aria-labelledby="categories-heading">
<h2 id="categories-heading">Categories</h2>
<ul class="term-entity-link-list">${items}</ul>
</section>`;
}

function renderSiblingDomains(domain, root) {
  const siblings = getSiblingDomainEntries(domain.id, root);
  const items = siblings
    .map((s) => `<li><a href="${escapeHtml(s.hubPath)}">${escapeHtml(s.label)}</a></li>`)
    .join("");
  return `<section class="term-entity-section domain-hub-siblings" aria-labelledby="siblings-heading">
<h2 id="siblings-heading">Explore Other Food Domains</h2>
<ul class="term-entity-link-list">${items}<li><a href="${INGREDIENTS_DIRECTORY_PATH}">All food domains</a></li></ul>
</section>`;
}

export function buildHubBodySections(domain, root) {
  const { groups, categories } = loadProjections(domain);
  const primaryCategory = categories[0];
  const sections = [];

  sections.push(`<header class="term-entity-hero domain-hub-hero">
<p class="term-entity-label">Ingredient Directory</p>
<h1>${escapeHtml(domain.entityLabels.leafPlural)}</h1>
</header>`);

  if (primaryCategory?.narrative?.summary) {
    sections.push(`<section class="direct-answer narrative-summary narrative-intro" aria-label="About ${escapeHtml(domain.entityLabels.leafPlural)}">
<h2>About ${escapeHtml(domain.entityLabels.leafPlural)}</h2>
<p>${escapeHtml(primaryCategory.narrative.summary)}</p>
</section>`);
  }

  sections.push(renderCategoryList(domain, categories));
  sections.push(renderGroupList(domain, groups));
  sections.push(renderSiblingDomains(domain, root));

  return sections.filter(Boolean).join("\n");
}

function buildHubJsonLd(domain, canonicalUrl, groups) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: domain.entityLabels.leafPlural,
      url: canonicalUrl,
      isPartOf: { "@type": "WebSite", name: "Pairing Method", url: "https://pairingmethod.com/" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://pairingmethod.com/" },
        { "@type": "ListItem", position: 2, name: domain.entityLabels.leafPlural, item: canonicalUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${domain.entityLabels.leafPlural} groups`,
      numberOfItems: groups.length,
      itemListElement: groups.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: g.identity.name,
        url: new URL(`${domain.urls.groupPrefix}${g.identity.slug}/`, canonicalUrl).href,
      })),
    },
  ];
}

export function runHubStage(domain) {
  const { groups } = loadProjections(domain);
  const canonicalUrl = `https://pairingmethod.com${domain.urls.hubPath}`;
  const bodySections = buildHubBodySections(domain, domain.root);
  const jsonLd = buildHubJsonLd(domain, canonicalUrl, groups);
  const jsonLdBlock = jsonLd
    .map((obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`)
    .join("\n  ");

  const breadcrumb = renderBreadcrumb([
    { label: "Home", href: "/" },
    { label: domain.entityLabels.leafPlural, href: domain.urls.hubPath },
  ]);

  const template = loadTemplate(domain.render.template);
  const html = fillTemplate(template, {
    PAGE_TITLE: escapeHtml(`${domain.entityLabels.leafPlural} — Ingredient Directory`),
    META_DESCRIPTION: escapeHtml(
      `Explore ${domain.expectedCounts.leaf} ${domain.entityLabels.leafCount} across ${domain.expectedCounts.groups} groups, each with wine pairing guidance.`
    ),
    CANONICAL_URL: canonicalUrl,
    OG_URL: canonicalUrl,
    OG_TITLE: escapeHtml(domain.entityLabels.leafPlural),
    BREADCRUMB: breadcrumb,
    BODY_SECTIONS: bodySections,
    JSON_LD: jsonLdBlock,
    ENTITY_CLASS: "domain-hub-page",
    HOME: SHARED_ROUTES.home,
    FOODS: domain.urls.hubPath,
    INGREDIENTS: SHARED_ROUTES.ingredients,
    PAIRINGS: SHARED_ROUTES.pairings,
    GRAPES: SHARED_ROUTES.grapes,
    SEASONAL: SHARED_ROUTES.seasonal,
    ABOUT: SHARED_ROUTES.about,
    MATRIX: SHARED_ROUTES.matrix,
    PRIVACY: SHARED_ROUTES.privacy,
    TERMS_OF_SERVICE: SHARED_ROUTES.termsOfService,
  });

  const outFile = path.join(domain.paths.html.leaf, "index.html");
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html, "utf8");

  return { domain: domain.id, outFile, groupCount: groups.length };
}
