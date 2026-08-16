/**
 * AQ-02B1 — /ingredients/ master directory page.
 *
 * The single site-wide entry point into the food ontology, listing every
 * published domain. Every domain hub links up to this page (see hub.js),
 * and the shared site nav links down to it, so there is exactly one
 * navigational path into the food ontology that all pages agree on
 * (Rule 3: navigation, search, sitemap, and internal links must agree).
 *
 * The only prose on this page is a single structural sentence describing
 * the directory itself (how many domains, how it's organized) — not a
 * knowledge claim about any ingredient or wine, consistent with Rule 4
 * ("publication never creates knowledge") and with the same pattern
 * already used on faults/index.html and styles/index.html.
 */

import fs from "fs";
import path from "path";
import { escapeHtml, renderBreadcrumb } from "../taxonomy-render.js";
import { loadTemplate, fillTemplate, SHARED_ROUTES } from "../taxonomy-shell.js";
import { getPublishedDomainEntries, INGREDIENTS_DIRECTORY_PATH } from "./navigation-registry.js";

const CANONICAL_URL = `https://pairingmethod.com${INGREDIENTS_DIRECTORY_PATH}`;

function buildBodySections(root) {
  const domains = getPublishedDomainEntries(root);
  const totalLeaf = domains.reduce((sum, d) => sum + d.leafCount, 0);

  const items = domains
    .map(
      (d) =>
        `<li><a href="${escapeHtml(d.hubPath)}">${escapeHtml(d.label)}</a> — ${d.leafCount} entries across ${d.groupCount} groups</li>`
    )
    .join("");

  return [
    `<header class="term-entity-hero domain-hub-hero">
<p class="term-entity-label">Ingredient Directory</p>
<h1>Ingredients</h1>
</header>`,
    `<section class="direct-answer narrative-summary narrative-intro" aria-label="About this directory">
<h2>About This Directory</h2>
<p>Pairing Method's ingredient library is organized into ${domains.length} published domains, covering ${totalLeaf} ingredients in total. Each domain groups its ingredients by culinary category and explains how they pair with wine.</p>
</section>`,
    `<section class="term-entity-section domain-hub-groups" aria-labelledby="domains-heading">
<h2 id="domains-heading">Food Domains</h2>
<ul class="term-entity-link-list">${items}</ul>
</section>`,
  ].join("\n");
}

function buildJsonLd(root) {
  const domains = getPublishedDomainEntries(root);
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Ingredients Directory",
      url: CANONICAL_URL,
      isPartOf: { "@type": "WebSite", name: "Pairing Method", url: "https://pairingmethod.com/" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://pairingmethod.com/" },
        { "@type": "ListItem", position: 2, name: "Ingredients", item: CANONICAL_URL },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Food domains",
      numberOfItems: domains.length,
      itemListElement: domains.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: d.label,
        url: new URL(d.hubPath, CANONICAL_URL).href,
      })),
    },
  ];
}

export function runIngredientsDirectoryStage(root) {
  const bodySections = buildBodySections(root);
  const jsonLd = buildJsonLd(root);
  const jsonLdBlock = jsonLd
    .map((obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`)
    .join("\n  ");

  const breadcrumb = renderBreadcrumb([
    { label: "Home", href: "/" },
    { label: "Ingredients", href: INGREDIENTS_DIRECTORY_PATH },
  ]);

  const template = loadTemplate("protein-entity-template.html");
  const html = fillTemplate(template, {
    PAGE_TITLE: "Ingredients Directory | Pairing Method",
    META_DESCRIPTION: "Browse every published food domain on Pairing Method — fruits, vegetables, proteins, grains, and more — each with wine pairing guidance.",
    CANONICAL_URL,
    OG_URL: CANONICAL_URL,
    OG_TITLE: "Ingredients Directory",
    BREADCRUMB: breadcrumb,
    BODY_SECTIONS: bodySections,
    JSON_LD: jsonLdBlock,
    ENTITY_CLASS: "ingredients-directory-page",
    HOME: SHARED_ROUTES.home,
    FOODS: INGREDIENTS_DIRECTORY_PATH,
    INGREDIENTS: INGREDIENTS_DIRECTORY_PATH,
    PAIRINGS: SHARED_ROUTES.pairings,
    GRAPES: SHARED_ROUTES.grapes,
    SEASONAL: SHARED_ROUTES.seasonal,
    ABOUT: SHARED_ROUTES.about,
    MATRIX: SHARED_ROUTES.matrix,
    PRIVACY: SHARED_ROUTES.privacy,
    TERMS_OF_SERVICE: SHARED_ROUTES.termsOfService,
  });

  const outFile = path.join(root, "dist", "ingredients", "index.html");
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html, "utf8");
  return { outFile, domainCount: getPublishedDomainEntries(root).length };
}
