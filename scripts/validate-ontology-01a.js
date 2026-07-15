/**
 * ONTOLOGY-01A validation — Wine Style entity graph.
 * Run: node scripts/validate-ontology-01a.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { wineStyleUrl } from "../lib/public-url.js";
import {
  listWineStyleEntries,
  validateWineStyleCatalog,
} from "../lib/taxonomy-wine-style.js";
import { countWineStyleInternalLinks } from "../lib/taxonomy-wine-style-render.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const STYLES_DIR = path.join(ROOT, "styles");
const SEARCH_INDEX = path.join(ROOT, "assets", "js", "wine-style-search-index.js");
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
  const styles = listWineStyleEntries();
  const catalogErrors = validateWineStyleCatalog(taxonomy);

  if (catalogErrors.length) {
    fail(`Catalog errors: ${catalogErrors.slice(0, 5).join("; ")}`);
  } else {
    ok(`${styles.length} wine styles in catalog`);
  }

  let pages = 0;
  const broken = [];
  const canonicals = new Set();

  for (const style of styles) {
    const file = path.join(STYLES_DIR, style.slug, "index.html");
    if (!fs.existsSync(file)) {
      fail(`Missing page for ${style.slug}`);
      continue;
    }
    pages += 1;
    const html = fs.readFileSync(file, "utf8");
    const route = wineStyleUrl(style.slug);

    if (!html.includes("WebPage")) fail(`${style.slug}: missing WebPage JSON-LD`);
    if (!html.includes("BreadcrumbList")) fail(`${style.slug}: missing BreadcrumbList JSON-LD`);
    if (!html.includes("wine-structure-bars")) fail(`${style.slug}: missing structure bars`);

    const canonMatch = html.match(/rel="canonical" href="([^"]+)"/);
    if (canonMatch) {
      if (canonicals.has(canonMatch[1])) fail(`Duplicate canonical: ${canonMatch[1]}`);
      canonicals.add(canonMatch[1]);
      if (!canonMatch[1].endsWith(`${route.slice(0, -1)}`) && !canonMatch[1].endsWith(route)) {
        fail(`${style.slug}: canonical mismatch ${canonMatch[1]}`);
      }
    }

    for (const href of extractHrefs(html)) {
      if (href.startsWith("http://") || href.startsWith("https://")) continue;
      if (href.startsWith("/assets/") || href.startsWith("mailto:")) continue;
      if (href.includes(".html")) {
        fail(`${style.slug}: .html internal link ${href}`);
        continue;
      }
      const target = hrefToFile(href);
      if (!fs.existsSync(target)) broken.push({ style: style.slug, href });
    }
  }

  if (broken.length) {
    fail(`Broken links (${broken.length}): ${broken[0].style} → ${broken[0].href}`);
  } else if (pages === styles.length) {
    ok("Zero broken internal links on wine style pages");
  }

  ok(`${pages} wine style pages generated`);

  if (!fs.existsSync(path.join(STYLES_DIR, "index.html"))) {
    fail("Missing /styles/ hub page");
  } else {
    ok("Wine styles hub page exists");
  }

  if (!fs.existsSync(SEARCH_INDEX)) {
    fail("wine-style-search-index.js missing");
  } else {
    const idx = fs.readFileSync(SEARCH_INDEX, "utf8");
    if (!idx.includes(`(${styles.length} styles)`)) {
      fail("Search index count mismatch");
    } else {
      ok("Wine style search index updated");
    }
  }

  if (fs.existsSync(SITEMAP)) {
    const xml = fs.readFileSync(SITEMAP, "utf8");
    const missing = styles.filter((s) => !xml.includes(`https://pairingmethod.com${wineStyleUrl(s.slug)}`));
    if (missing.length) fail(`Sitemap missing ${missing.length} style URLs`);
    else ok("Sitemap includes all wine style URLs");
  } else {
    fail("sitemap.xml missing — run npm run generate:sitemap");
  }

  if (!fs.existsSync(ONTOLOGY_REPORT)) {
    fail("ontology-coverage.json missing — run npm run ontology:coverage-report");
  } else {
    ok("Ontology coverage report present");
  }

  // Entity model on descriptor nodes unchanged
  const descSample = taxonomy.nodes.blackberry ?? taxonomy.nodes.firm;
  if (!descSample?.entity_type || descSample.entity_type !== "descriptor") {
    fail("Descriptor entity_type missing on sample node");
  } else {
    ok("Descriptor graph entity model intact");
  }

  if (!fs.existsSync(HOME)) fail("index.html missing");
  else ok("Homepage intact");

  if (!fs.existsSync(PAIRING_ENGINE)) fail("pairing-engine.js missing");
  else {
    const engine = fs.readFileSync(PAIRING_ENGINE, "utf8");
    if (engine.includes("WINE_STYLE_ENTITY")) {
      fail("Pairing engine scoring modified");
    } else {
      ok("Pairing engine scoring unchanged");
    }
  }

  if (!process.exitCode) ok("ONTOLOGY-01A validation passed");
}

main();
