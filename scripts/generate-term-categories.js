/**
 * KNOWLEDGE-02 — Generate category hub pages from wine-taxonomy.json only.
 * Run: node scripts/generate-term-categories.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WINES } from "../assets/js/pairing-data.js";
import { publicPath, termCategoryUrl } from "../lib/public-url.js";
import {
  glossaryHubSlug,
  loadTaxonomy,
} from "../lib/taxonomy.js";
import {
  buildCategoryJsonLd,
  buildCategoryPageContext,
  renderCategorySections,
} from "../lib/taxonomy-render.js";
import {
  assembleCategoryPage,
  loadTemplate,
  renderCategoryBreadcrumb,
} from "../lib/taxonomy-shell.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_BASE = path.join(ROOT, "terms");
const TEMPLATE = "term-category-template.html";

const GRAPE_PAGE_SLUG = {
  cabernet: "cabernet-sauvignon",
  "pinot-noir": "pinot-noir",
  chardonnay: "chardonnay",
  "sauvignon-blanc": "sauvignon-blanc",
  riesling: "riesling",
};

function winesForGenerator() {
  return WINES.map((w) => ({
    ...w,
    grapePageSlug: GRAPE_PAGE_SLUG[w.id] ?? w.id,
  }));
}

function main() {
  const taxonomy = loadTaxonomy();
  const template = loadTemplate(TEMPLATE);
  const hubSlug = glossaryHubSlug(taxonomy);
  const winesCatalog = winesForGenerator();
  let count = 0;

  for (const category of taxonomy.categories) {
    const ctx = buildCategoryPageContext(taxonomy, category.slug, {
      winesCatalog,
      glossaryHubHref: termCategoryUrl(hubSlug),
    });
    if (!ctx) {
      console.warn(`Skip missing category: ${category.slug}`);
      continue;
    }

    const outDir = path.join(OUT_BASE, category.slug);
    fs.mkdirSync(outDir, { recursive: true });

    const publicRoute = publicPath(`terms/${category.slug}/index.html`);
    const pageUrl = `https://pairingmethod.com${publicRoute}`;
    const breadcrumbHtml = renderCategoryBreadcrumb(ctx.meta.name, hubSlug);
    const bodySectionsHtml = renderCategorySections(taxonomy, ctx);
    const jsonLd = buildCategoryJsonLd(taxonomy, ctx, pageUrl);

    const html = assembleCategoryPage({
      template,
      ctx,
      breadcrumbHtml,
      bodySectionsHtml,
      jsonLd,
      publicRoute,
    });

    const outFile = path.join(outDir, "index.html");
    fs.writeFileSync(outFile, html, "utf8");
    count += 1;
    console.log(`  ${publicRoute}`);
  }

  console.log(`Wrote ${count} category hub pages under ${OUT_BASE}/`);
}

main();
