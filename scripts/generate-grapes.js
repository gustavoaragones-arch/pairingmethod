/**
 * KNOWLEDGE-04 — Generate grape pages from taxonomy graph + grape catalog.
 * Run: node scripts/generate-grapes.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WINES } from "../assets/js/pairing-data.js";
import { buildKnowledgeGraph } from "../lib/taxonomy-graph.js";
import { listGrapeCatalogEntries, buildGrapePageContext } from "../lib/taxonomy-grape.js";
import {
  buildGrapeJsonLd,
  renderGrapeBreadcrumb,
  renderGrapeSections,
} from "../lib/taxonomy-grape-render.js";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { canonicalUrl, ogUrl, publicPath } from "../lib/public-url.js";
import { fillTemplate, loadTemplate, SHARED_ROUTES } from "../lib/taxonomy-shell.js";
import { escapeHtml } from "../lib/taxonomy-render.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "grapes");
const TEMPLATE = "grape-template.html";

function assembleGrapePage({ template, ctx, bodySectionsHtml, jsonLd, publicRoute }) {
  const jsonLdBlock = jsonLd
    .map((obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`)
    .join("\n  ");

  return fillTemplate(template, {
    PAGE_TITLE: escapeHtml(ctx.title),
    META_DESCRIPTION: escapeHtml(ctx.metaDescription),
    CANONICAL_URL: canonicalUrl(publicRoute),
    OG_URL: ogUrl(publicRoute),
    OG_TITLE: escapeHtml(ctx.title),
    BREADCRUMB: renderGrapeBreadcrumb(ctx.catalogEntry.name),
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

function main() {
  const taxonomy = loadTaxonomy();
  const graph = buildKnowledgeGraph({ taxonomy, WINES, root: ROOT });
  const template = loadTemplate(TEMPLATE);
  let count = 0;

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const entry of listGrapeCatalogEntries()) {
    const ctx = buildGrapePageContext(entry, { taxonomy, graph });
    if (!ctx) {
      console.warn(`Skip grape: ${entry.wineId}`);
      continue;
    }

    const outFile = path.join(OUT_DIR, `${entry.slug}.html`);
    const publicRoute = publicPath(`grapes/${entry.slug}.html`);
    const pageUrl = `https://pairingmethod.com${publicRoute}`;
    const bodySectionsHtml = renderGrapeSections(taxonomy, ctx);
    const jsonLd = buildGrapeJsonLd(ctx, pageUrl);

    const html = assembleGrapePage({
      template,
      ctx,
      bodySectionsHtml,
      jsonLd,
      publicRoute,
    });

    fs.writeFileSync(outFile, html, "utf8");
    count += 1;
    console.log(`  /grapes/${entry.slug}`);
  }

  console.log(`Wrote ${count} grape pages under ${OUT_DIR}`);
}

main();
