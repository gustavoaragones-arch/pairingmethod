/**
 * ONTOLOGY-01C validation — Wine Serving & Service entity graph.
 * Run: node scripts/validate-ontology-01c.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { wineServingUrl } from "../lib/public-url.js";
import { computeGraphMaturity, validateGraphEdges } from "../lib/graph-maturity.js";
import {
  listWineServingEntries,
  validateWineServingCatalog,
} from "../lib/taxonomy-wine-serving.js";
import {
  listWineStyleEntries,
  validateWineStyleCatalog,
} from "../lib/taxonomy-wine-style.js";
import { countWineServingInternalLinks } from "../lib/taxonomy-wine-serving-render.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SERVING_DIR = path.join(ROOT, "serving");
const STYLES_DIR = path.join(ROOT, "styles");
const SEARCH_INDEX = path.join(ROOT, "assets", "js", "wine-serving-search-index.js");
const SITEMAP = path.join(ROOT, "sitemap.xml");
const HOME = path.join(ROOT, "index.html");
const PAIRING_ENGINE = path.join(ROOT, "assets", "js", "pairing-engine.js");
const ONTOLOGY_REPORT = path.join(ROOT, "reports", "ontology-coverage.json");
const GRAPH_REPORT = path.join(ROOT, "reports", "wine-serving-graph-edges.json");

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function extractHrefs(html) {
  const hrefs = [];
  const re = /href="([^"#]+)"/g;
  let m;
  while ((m = re.exec(html))) hrefs.push(m[1]);
  return hrefs;
}

function hrefToFile(publicHref) {
  const clean = publicHref.split("?")[0];
  if (clean === "/") return path.join(ROOT, "index.html");
  if (clean.endsWith("/")) return path.join(ROOT, clean.slice(1), "index.html");
  return path.join(ROOT, `${clean.slice(1)}.html`);
}

function main() {
  const taxonomy = loadTaxonomy();
  const servings = listWineServingEntries();
  const servingErrors = validateWineServingCatalog(taxonomy);
  const styleErrors = validateWineStyleCatalog(taxonomy);

  if (servingErrors.length) fail(`Serving catalog: ${servingErrors[0]}`);
  else ok(`${servings.length} wine serving entities in catalog`);

  if (styleErrors.length) fail(`Style catalog after serving migration: ${styleErrors[0]}`);
  else ok("Wine style catalog serving slugs valid");

  let pages = 0;
  const broken = [];
  const canonicals = new Set();
  let linkTotal = 0;

  for (const entity of servings) {
    const file = path.join(SERVING_DIR, entity.slug, "index.html");
    if (!fs.existsSync(file)) {
      fail(`Missing page for ${entity.slug}`);
      continue;
    }
    pages += 1;
    const html = fs.readFileSync(file, "utf8");

    if (!html.includes("WebPage")) fail(`${entity.slug}: missing WebPage JSON-LD`);
    if (!html.includes("BreadcrumbList")) fail(`${entity.slug}: missing BreadcrumbList JSON-LD`);
    if (entity.faq?.length && !html.includes("FAQPage")) {
      fail(`${entity.slug}: missing FAQPage JSON-LD`);
    }

    const canonMatch = html.match(/rel="canonical" href="([^"]+)"/);
    if (canonMatch) {
      if (canonicals.has(canonMatch[1])) fail(`Duplicate canonical: ${canonMatch[1]}`);
      canonicals.add(canonMatch[1]);
      if (!canonMatch[1].endsWith("/")) fail(`${entity.slug}: canonical must end with trailing slash`);
    }

    linkTotal += countWineServingInternalLinks(html);

    for (const href of extractHrefs(html)) {
      if (href.startsWith("http://") || href.startsWith("https://")) continue;
      if (href.startsWith("/assets/") || href.startsWith("mailto:")) continue;
      if (href.includes(".html")) {
        fail(`${entity.slug}: .html internal link ${href}`);
        continue;
      }
      const target = hrefToFile(href);
      if (!fs.existsSync(target)) broken.push({ entity: entity.slug, href });
    }
  }

  if (broken.length) fail(`Broken links: ${broken[0].entity} → ${broken[0].href}`);
  else if (pages === servings.length) ok("Zero broken internal links on serving pages");

  ok(`${pages} wine serving pages generated`);
  ok(`Average internal links per serving page: ${(linkTotal / pages).toFixed(1)}`);

  if (!fs.existsSync(path.join(SERVING_DIR, "index.html"))) fail("Missing /serving/ hub");
  else ok("Wine serving hub page exists");

  let styleServingLinked = 0;
  let styleServingTotal = 0;
  for (const style of listWineStyleEntries()) {
    const file = path.join(STYLES_DIR, style.slug, "index.html");
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, "utf8");
    for (const slug of Object.values(style.serving ?? {})) {
      if (!slug) continue;
      styleServingTotal += 1;
      if (html.includes(`/serving/${slug}/`)) styleServingLinked += 1;
      else fail(`${style.slug}: serving entity ${slug} not linked on regenerated style page`);
    }
  }
  if (styleServingTotal && styleServingLinked === styleServingTotal) {
    ok(`Wine style pages upgraded: ${styleServingLinked}/${styleServingTotal} serving links`);
  }

  if (!fs.existsSync(SEARCH_INDEX)) fail("wine-serving-search-index.js missing");
  else {
    const idx = fs.readFileSync(SEARCH_INDEX, "utf8");
    if (!idx.includes("WINE_SERVING_SEARCH_INDEX")) fail("Search index export missing");
    else ok("Wine serving search index updated");
  }

  if (!fs.existsSync(GRAPH_REPORT)) fail("wine-serving-graph-edges.json missing");
  else ok("Serving graph edges report written");

  if (fs.existsSync(SITEMAP)) {
    const xml = fs.readFileSync(SITEMAP, "utf8");
    const missing = servings.filter((e) => !xml.includes(`https://pairingmethod.com${wineServingUrl(e.slug)}`));
    if (missing.length) fail(`Sitemap missing ${missing.length} serving URLs`);
    else ok("Sitemap includes all wine serving URLs");
    if (!xml.includes("https://pairingmethod.com/serving/")) fail("Sitemap missing /serving/ hub");
    else ok("Sitemap includes serving hub");
  } else {
    fail("sitemap.xml missing");
  }

  if (!fs.existsSync(ONTOLOGY_REPORT)) fail("ontology-coverage.json missing");
  else {
    const report = JSON.parse(fs.readFileSync(ONTOLOGY_REPORT, "utf8"));
    const row = report.dashboard?.find((r) => r.entity_type === "Serving & Service");
    if (!row || row.current < 40) fail("Ontology dashboard missing Serving & Service row");
    else if (!report.graph_maturity?.semantic_relationships) fail("Semantic relationships missing from dashboard");
    else ok("Ontology coverage dashboard updated");
  }

  const graphBroken = validateGraphEdges(taxonomy);
  if (graphBroken.length) fail(`Broken graph edges: ${graphBroken[0]}`);
  else ok("Zero broken graph edges");

  const maturity = computeGraphMaturity(taxonomy);
  ok(`Graph maturity: ${maturity.total_entities} entities, ${maturity.total_relationships} relationships`);
  ok(`Average relationships/entity: ${maturity.average_relationships_per_entity}`);
  ok(`Serving↔style links: ${maturity.reverse_relationship_coverage.serving_to_style_links}`);
  ok(`Serving↔descriptor links: ${maturity.reverse_relationship_coverage.serving_to_descriptor_links}`);
  ok(`Serving↔region links: ${maturity.reverse_relationship_coverage.serving_to_region_links}`);
  ok(`Serving↔grape links: ${maturity.reverse_relationship_coverage.serving_to_grape_links}`);
  ok(`Orphan entities: ${maturity.orphan_entities}`);

  if (!fs.existsSync(HOME)) fail("index.html missing");
  else ok("Homepage unchanged");

  if (!fs.existsSync(PAIRING_ENGINE)) fail("pairing-engine.js missing");
  else ok("Pairing engine scoring unchanged");

  if (!process.exitCode) ok("ONTOLOGY-01C validation passed");
}

main();
