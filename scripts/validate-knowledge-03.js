/**
 * KNOWLEDGE-03 validation — descriptor entity pages.
 * Run: node scripts/validate-knowledge-03.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listDescriptorNodes } from "../lib/taxonomy-descriptor.js";
import { publicPath, termUrl } from "../lib/public-url.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SITEMAP = path.join(ROOT, "sitemap.xml");
const TERMS_DIR = path.join(ROOT, "terms");
const SEARCH_INDEX = path.join(ROOT, "assets", "js", "taxonomy-search-index.js");
const SCALE_CATEGORIES = ["body", "acidity", "tannin"];
const SKIP_PREFIXES = ["/assets/", "mailto:", "tel:"];
const SEARCH_QUERIES = ["graphite", "lavender", "petrol", "grippy", "angular", "austere"];

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

function extractScaleRail(html) {
  const start = html.indexOf('class="taxonomy-scale-rail"');
  if (start < 0) return "";
  const olStart = html.lastIndexOf("<ol", start);
  const end = html.indexOf("</ol>", start);
  return end < 0 ? "" : html.slice(olStart, end);
}

function categoryPageHtml(slug) {
  const file = path.join(TERMS_DIR, slug, "index.html");
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function main() {
  const taxonomy = loadTaxonomy();
  const descriptors = listDescriptorNodes(taxonomy);
  const descriptorSlugs = new Set(descriptors.map((d) => d.slug));
  const broken = [];
  const orphans = [];
  const missing = [];
  const badUrls = [];

  for (const desc of descriptors) {
    const file = path.join(TERMS_DIR, `${desc.slug}.html`);
    if (!fs.existsSync(file)) {
      missing.push(desc.slug);
      continue;
    }

    const html = fs.readFileSync(file, "utf8");
    const publicRoute = publicPath(`terms/${desc.slug}.html`);

    if (!html.includes("DefinedTerm")) fail(`${desc.slug}: missing DefinedTerm JSON-LD`);
    if (!html.includes("BreadcrumbList")) fail(`${desc.slug}: missing BreadcrumbList JSON-LD`);
    if (!html.includes("Wine Terms")) fail(`${desc.slug}: missing Wine Terms breadcrumb`);
    if (html.includes('href="/terms/') && html.match(/href="\/terms\/[^"]+\.html"/)) {
      badUrls.push(desc.slug);
    }

    const catHtml = categoryPageHtml(desc.category);
    if (!catHtml.includes(termUrl(desc.slug))) {
      orphans.push(desc.slug);
    }

    if (desc.scale) {
      const rail = extractScaleRail(html);
      if (!rail) {
        fail(`${desc.slug}: scale descriptor missing scale rail`);
      } else if (!rail.includes("is-current")) {
        fail(`${desc.slug}: scale rail missing current highlight`);
      } else {
        const scale = taxonomy.scales.find((s) => s.id === desc.scale.id);
        if (scale) {
          let lastPos = -1;
          for (const termSlug of scale.ordered_slugs) {
            const pos = rail.indexOf(`href="${termUrl(termSlug)}"`);
            if (pos < 0) fail(`${desc.slug}: scale rail missing ${termSlug}`);
            else if (pos < lastPos) fail(`${desc.slug}: scale rail order wrong at ${termSlug}`);
            else lastPos = pos;
          }
        }
      }
    }

    for (const href of extractHrefs(html)) {
      if (href.startsWith("http") || href.startsWith("//") || href.startsWith("#")) continue;
      if (SKIP_PREFIXES.some((p) => href.startsWith(p))) continue;
      if (!fs.existsSync(hrefToFile(href))) {
        broken.push({ page: desc.slug, href });
      }
    }
  }

  if (missing.length) {
    fail(`Missing ${missing.length} descriptor pages (e.g. ${missing.slice(0, 5).join(", ")})`);
  } else {
    ok(`${descriptors.length} descriptor entity pages generated`);
  }

  if (orphans.length) {
    fail(`${orphans.length} orphan descriptor pages not linked from category hub`);
  } else {
    ok("Zero orphan descriptor pages");
  }

  if (broken.length) {
    for (const b of broken.slice(0, 10)) {
      fail(`Broken link on ${b.page}: ${b.href}`);
    }
    if (broken.length > 10) fail(`...and ${broken.length - 10} more broken links`);
  } else {
    ok("Zero broken internal links on descriptor pages");
  }

  if (badUrls.length) {
    fail(`${badUrls.length} descriptor pages use .html internal term URLs`);
  } else {
    ok("Extensionless term URLs only");
  }

  // KNOWLEDGE-02 pending links should be resolved
  const pending = new Set();
  for (const category of taxonomy.categories) {
    const html = categoryPageHtml(category.slug);
    for (const href of extractHrefs(html)) {
      const m = href.match(/^\/terms\/([a-z0-9-]+)$/);
      if (m && descriptorSlugs.has(m[1]) && !fs.existsSync(path.join(TERMS_DIR, `${m[1]}.html`))) {
        pending.add(m[1]);
      }
    }
  }
  if (pending.size) {
    fail(`${pending.size} unresolved descriptor links from category hubs remain`);
  } else {
    ok("All KNOWLEDGE-02 descriptor links resolved");
  }

  if (!fs.existsSync(SEARCH_INDEX)) {
    fail("taxonomy-search-index.js missing — run npm run generate:term-descriptors");
  } else {
    const idx = fs.readFileSync(SEARCH_INDEX, "utf8");
    for (const q of SEARCH_QUERIES) {
      if (!idx.toLowerCase().includes(`"${q}"`) && !idx.toLowerCase().includes(q)) {
        fail(`Search index missing query coverage for "${q}"`);
      }
    }
    ok("Search index updated with descriptor entities");
  }

  if (fs.existsSync(SITEMAP)) {
    const sitemap = fs.readFileSync(SITEMAP, "utf8");
    let missingSitemap = 0;
    for (const desc of descriptors) {
      const url = `https://pairingmethod.com${termUrl(desc.slug)}`;
      if (!sitemap.includes(url)) {
        missingSitemap += 1;
        if (missingSitemap <= 3) fail(`Sitemap missing ${url}`);
      }
    }
    if (missingSitemap) {
      fail(`Sitemap missing ${missingSitemap} descriptor URLs — run npm run generate:sitemap`);
    } else {
      ok("Sitemap includes all descriptor entity URLs");
    }
  } else {
    fail("sitemap.xml missing");
  }

  const legacyFlat = [
    "acidity",
    "body",
    "tannin",
    "oak",
    "black-fruit",
    "red-fruit",
    "citrus",
    "stone-fruit",
    "tropical-fruit",
    "melon",
  ];
  const legacyPresent = legacyFlat.filter((slug) =>
    fs.existsSync(path.join(TERMS_DIR, `${slug}.html`))
  );
  if (legacyPresent.length) {
    fail(`Legacy flat term pages still present: ${legacyPresent.join(", ")}`);
  } else {
    ok("Legacy flat term pages retired");
  }

  const redirectsPath = path.join(ROOT, "_redirects");
  if (!fs.existsSync(redirectsPath)) {
    fail("_redirects missing — legacy term URLs need 301 redirects");
  } else {
    const redirects = fs.readFileSync(redirectsPath, "utf8");
    const missingRedirects = legacyFlat.filter((slug) => !redirects.includes(`/terms/${slug} `));
    if (missingRedirects.length) {
      fail(`_redirects missing legacy term redirects: ${missingRedirects.join(", ")}`);
    } else {
      ok("Legacy term redirects configured");
    }
  }

  if (!fs.existsSync(path.join(ROOT, "assets", "js", "pairing-engine.js"))) {
    fail("pairing-engine.js missing");
  } else {
    ok("Pairing engine assets intact");
  }

  if (!fs.existsSync(path.join(ROOT, "index.html"))) {
    fail("index.html missing");
  } else {
    const home = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    if (!home.includes("term-search-input")) fail("Homepage search missing");
    else ok("Homepage intact");
  }

  for (const slug of SCALE_CATEGORIES) {
    const html = categoryPageHtml(slug);
    if (!html.includes('<ol class="taxonomy-scale">')) {
      fail(`${slug} category hub scale section missing`);
    }
  }
  ok("Category hub scale navigation intact");

  if (!process.exitCode) ok("KNOWLEDGE-03 validation passed");
}

main();
