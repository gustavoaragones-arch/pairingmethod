/**
 * KNOWLEDGE-02+ — Shared page shell for taxonomy-driven pages.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  canonicalUrl,
  ogUrl,
  publicPath,
  termCategoryUrl,
} from "./public-url.js";
import { escapeHtml, renderBreadcrumb } from "./taxonomy-render.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

export const SHARED_ROUTES = Object.freeze({
  home: publicPath("index.html"),
  pairings: publicPath("pairings.html"),
  grapes: publicPath("grapes.html"),
  seasonal: publicPath("seasonal-wine-guides.html"),
  matrix: publicPath("pairing-matrix.html"),
  about: publicPath("about.html"),
  privacy: publicPath("privacy.html"),
  termsOfService: publicPath("terms.html"),
});

export function fillTemplate(template, vars) {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(value ?? "");
  }
  return out;
}

export function loadTemplate(name) {
  const file = path.join(ROOT, "templates", name);
  return fs.readFileSync(file, "utf8");
}

export function renderCategoryBreadcrumb(categoryName, glossaryHubSlug) {
  return renderBreadcrumb([
    { label: "Home", href: SHARED_ROUTES.home },
    { label: "Wine Terms", href: termCategoryUrl(glossaryHubSlug) },
    { label: categoryName, href: "#" },
  ]);
}

export function assembleDescriptorPage({
  template,
  ctx,
  breadcrumbHtml,
  bodySectionsHtml,
  jsonLd,
  publicRoute,
}) {
  const pageCanonicalUrl = canonicalUrl(publicRoute);
  const pageOgUrl = ogUrl(publicRoute);
  const jsonLdBlock = jsonLd
    .map((obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`)
    .join("\n  ");

  return fillTemplate(template, {
    PAGE_TITLE: `${escapeHtml(ctx.title)} | Pairing Method`,
    META_DESCRIPTION: escapeHtml(ctx.metaDescription),
    CANONICAL_URL: pageCanonicalUrl,
    OG_URL: pageOgUrl,
    OG_TITLE: escapeHtml(ctx.title),
    CATEGORY_COLOR: ctx.catMeta?.color ?? "#7a2d3b",
    BREADCRUMB: breadcrumbHtml,
    BODY_SECTIONS: bodySectionsHtml,
    JSON_LD: jsonLdBlock,
    HOME: SHARED_ROUTES.home,
    PAIRINGS: SHARED_ROUTES.pairings,
    GRAPES: SHARED_ROUTES.grapes,
    SEASONAL: SHARED_ROUTES.seasonal,
    ABOUT: SHARED_ROUTES.about,
    MATRIX: SHARED_ROUTES.matrix,
    PRIVACY: SHARED_ROUTES.privacy,
    TERMS_OF_SERVICE: SHARED_ROUTES.termsOfService,
  });
}

export function assembleCategoryPage({
  template,
  ctx,
  breadcrumbHtml,
  bodySectionsHtml,
  jsonLd,
  publicRoute,
}) {
  const pageCanonicalUrl = canonicalUrl(publicRoute);
  const pageOgUrl = ogUrl(publicRoute);
  const jsonLdBlock = jsonLd
    .map((obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`)
    .join("\n  ");

  return fillTemplate(template, {
    PAGE_TITLE: `${escapeHtml(ctx.title)} | Pairing Method`,
    META_DESCRIPTION: escapeHtml(ctx.metaDescription),
    CANONICAL_URL: pageCanonicalUrl,
    OG_URL: pageOgUrl,
    OG_TITLE: escapeHtml(ctx.title),
    CATEGORY_COLOR: ctx.meta.color,
    BREADCRUMB: breadcrumbHtml,
    BODY_SECTIONS: bodySectionsHtml,
    JSON_LD: jsonLdBlock,
    HOME: SHARED_ROUTES.home,
    PAIRINGS: SHARED_ROUTES.pairings,
    GRAPES: SHARED_ROUTES.grapes,
    SEASONAL: SHARED_ROUTES.seasonal,
    ABOUT: SHARED_ROUTES.about,
    MATRIX: SHARED_ROUTES.matrix,
    PRIVACY: SHARED_ROUTES.privacy,
    TERMS_OF_SERVICE: SHARED_ROUTES.termsOfService,
  });
}
