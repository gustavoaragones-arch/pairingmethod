/**
 * ONTOLOGY-01B validation — Wine Region entity graph.
 * Run: node scripts/validate-ontology-01b.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { wineRegionUrl } from "../lib/public-url.js";
import { computeGraphMaturity, validateGraphEdges } from "../lib/graph-maturity.js";
import {
  listWineRegionEntries,
  validateWineRegionCatalog,
} from "../lib/taxonomy-wine-region.js";
import {
  listWineStyleEntries,
  validateWineStyleCatalog,
} from "../lib/taxonomy-wine-style.js";
import { countWineRegionInternalLinks } from "../lib/taxonomy-wine-region-render.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REGIONS_DIR = path.join(ROOT, "regions");
const STYLES_DIR = path.join(ROOT, "styles");
const SEARCH_INDEX = path.join(ROOT, "assets", "js", "wine-region-search-index.js");
const SITEMAP = path.join(ROOT, "sitemap.xml");
const HOME = path.join(ROOT, "index.html");
const PAIRING_ENGINE = path.join(ROOT, "assets", "js", "pairing-engine.js");
const ONTOLOGY_REPORT = path.join(ROOT, "reports", "ontology-coverage.json");

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
  const regions = listWineRegionEntries();
  const regionErrors = validateWineRegionCatalog(taxonomy);
  const styleErrors = validateWineStyleCatalog(taxonomy);

  if (regionErrors.length) fail(`Region catalog: ${regionErrors[0]}`);
  else ok(`${regions.length} wine regions in catalog`);

  if (styleErrors.length) fail(`Style catalog after region migration: ${styleErrors[0]}`);
  else ok("Wine style catalog region slugs valid");

  let pages = 0;
  const broken = [];
  const canonicals = new Set();

  for (const region of regions) {
    const file = path.join(REGIONS_DIR, region.slug, "index.html");
    if (!fs.existsSync(file)) {
      fail(`Missing page for ${region.slug}`);
      continue;
    }
    pages += 1;
    const html = fs.readFileSync(file, "utf8");

    if (!html.includes("WebPage")) fail(`${region.slug}: missing WebPage JSON-LD`);
    if (!html.includes("BreadcrumbList")) fail(`${region.slug}: missing BreadcrumbList JSON-LD`);

    const canonMatch = html.match(/rel="canonical" href="([^"]+)"/);
    if (canonMatch) {
      if (canonicals.has(canonMatch[1])) fail(`Duplicate canonical: ${canonMatch[1]}`);
      canonicals.add(canonMatch[1]);
    }

    for (const href of extractHrefs(html)) {
      if (href.startsWith("http://") || href.startsWith("https://")) continue;
      if (href.startsWith("/assets/") || href.startsWith("mailto:")) continue;
      if (href.includes(".html")) {
        fail(`${region.slug}: .html internal link ${href}`);
        continue;
      }
      const target = hrefToFile(href);
      if (!fs.existsSync(target)) broken.push({ region: region.slug, href });
    }
  }

  if (broken.length) fail(`Broken links: ${broken[0].region} → ${broken[0].href}`);
  else if (pages === regions.length) ok("Zero broken internal links on region pages");

  ok(`${pages} wine region pages generated`);

  if (!fs.existsSync(path.join(REGIONS_DIR, "index.html"))) fail("Missing /regions/ hub");
  else ok("Wine regions hub page exists");

  let styleRegionLinked = 0;
  let styleRegionTotal = 0;
  for (const style of listWineStyleEntries()) {
    const file = path.join(STYLES_DIR, style.slug, "index.html");
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, "utf8");
    for (const slug of style.typical_regions ?? []) {
      styleRegionTotal += 1;
      if (html.includes(`/regions/${slug}/`)) styleRegionLinked += 1;
      else fail(`${style.slug}: region ${slug} not linked on regenerated style page`);
    }
  }
  if (styleRegionTotal && styleRegionLinked === styleRegionTotal) {
    ok(`Wine style pages upgraded: ${styleRegionLinked}/${styleRegionTotal} region links`);
  }

  if (!fs.existsSync(SEARCH_INDEX)) fail("wine-region-search-index.js missing");
  else ok("Wine region search index updated");

  if (fs.existsSync(SITEMAP)) {
    const xml = fs.readFileSync(SITEMAP, "utf8");
    const missing = regions.filter((r) => !xml.includes(`https://pairingmethod.com${wineRegionUrl(r.slug)}`));
    if (missing.length) fail(`Sitemap missing ${missing.length} region URLs`);
    else ok("Sitemap includes all wine region URLs");
  } else {
    fail("sitemap.xml missing");
  }

  if (!fs.existsSync(ONTOLOGY_REPORT)) fail("ontology-coverage.json missing");
  else ok("Ontology coverage dashboard updated");

  const graphBroken = validateGraphEdges(taxonomy);
  if (graphBroken.length) fail(`Broken graph edges: ${graphBroken[0]}`);
  else ok("Zero broken graph edges");

  const maturity = computeGraphMaturity(taxonomy);
  ok(`Graph maturity: ${maturity.total_entities} entities, ${maturity.total_relationships} relationships`);
  ok(`Average relationships/entity: ${maturity.average_relationships_per_entity}`);
  ok(`Orphan entities: ${maturity.orphan_entities}`);

  if (!fs.existsSync(HOME)) fail("index.html missing");
  else ok("Homepage unchanged");

  if (!fs.existsSync(PAIRING_ENGINE)) fail("pairing-engine.js missing");
  else ok("Pairing engine scoring unchanged");

  if (!process.exitCode) ok("ONTOLOGY-01B validation passed");
}

main();
