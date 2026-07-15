/**
 * KNOWLEDGE-02 validation — category hub pages.
 * Run: node scripts/validate-knowledge-02.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { publicPath } from "../lib/public-url.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SITEMAP = path.join(ROOT, "sitemap.xml");
const TERMS_DIR = path.join(ROOT, "terms");

const SCALE_CATEGORIES = ["body", "acidity", "tannin"];
const SKIP_PREFIXES = ["/assets/", "mailto:", "tel:"];

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function warn(msg) {
  console.warn(`⚠ ${msg}`);
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

function existingTermSlugs() {
  const slugs = new Set();
  for (const ent of fs.readdirSync(TERMS_DIR, { withFileTypes: true })) {
    if (ent.isFile() && ent.name.endsWith(".html")) {
      slugs.add(ent.name.replace(/\.html$/, ""));
    }
  }
  return slugs;
}

function extractScaleSection(html) {
  const start = html.indexOf('<ol class="taxonomy-scale">');
  if (start < 0) return "";
  const end = html.indexOf("</ol>", start);
  return end < 0 ? "" : html.slice(start, end);
}

function main() {
  const taxonomy = loadTaxonomy();
  const taxonomySlugs = new Set(Object.keys(taxonomy.nodes));
  const termPages = existingTermSlugs();
  const expected = taxonomy.categories.map((c) => c.slug);
  const generated = [];
  const broken = [];
  const pendingTerms = new Set();

  for (const slug of expected) {
    const file = path.join(TERMS_DIR, slug, "index.html");
    if (!fs.existsSync(file)) {
      fail(`Missing category page: terms/${slug}/index.html`);
      continue;
    }
    generated.push(slug);
    const html = fs.readFileSync(file, "utf8");

    if (!html.includes("CollectionPage")) fail(`${slug}: missing CollectionPage JSON-LD`);
    if (!html.includes("BreadcrumbList")) fail(`${slug}: missing BreadcrumbList JSON-LD`);
    if (!html.includes("ItemList")) fail(`${slug}: missing ItemList JSON-LD`);
    if (!html.includes("Wine Terms")) fail(`${slug}: missing Wine Terms breadcrumb`);

    if (SCALE_CATEGORIES.includes(slug)) {
      const scaleBlock = extractScaleSection(html);
      if (!scaleBlock) {
        fail(`${slug}: missing ordered scale`);
      } else {
        const scale = taxonomy.scales.find((s) => s.category === slug);
        if (scale) {
          let lastPos = -1;
          for (const termSlug of scale.ordered_slugs) {
            const pos = scaleBlock.indexOf(`href="/terms/${termSlug}"`);
            if (pos < 0) fail(`${slug}: scale missing link to ${termSlug}`);
            else if (pos < lastPos) fail(`${slug}: scale order incorrect for ${termSlug}`);
            else lastPos = pos;
          }
        }
      }
    }

    if (slug === "fruit" && !html.includes("taxonomy-tree-group")) {
      fail("fruit: hierarchy tree missing group nodes");
    }

    for (const href of extractHrefs(html)) {
      if (href.startsWith("http") || href.startsWith("//") || href.startsWith("#")) continue;
      if (SKIP_PREFIXES.some((p) => href.startsWith(p))) continue;

      const filePath = hrefToFile(href);
      if (fs.existsSync(filePath)) continue;

      const termMatch = href.match(/^\/terms\/([a-z0-9-]+)$/);
      if (termMatch && taxonomySlugs.has(termMatch[1])) {
        if (!termPages.has(termMatch[1])) pendingTerms.add(termMatch[1]);
        continue;
      }

      const catMatch = href.match(/^\/terms\/([a-z0-9-]+)\/$/);
      if (catMatch && expected.includes(catMatch[1])) continue;

      broken.push({ page: slug, href, filePath });
    }
  }

  if (generated.length !== 12) {
    fail(`Expected 12 category pages, found ${generated.length}`);
  } else {
    ok("12 category hub pages generated");
  }

  if (broken.length) {
    for (const b of broken.slice(0, 10)) {
      fail(`Broken link on ${b.page}: ${b.href}`);
    }
    if (broken.length > 10) fail(`...and ${broken.length - 10} more broken links`);
  } else {
    ok("Zero broken structural links on category pages");
  }

  if (pendingTerms.size) {
    warn(
      `${pendingTerms.size} descriptor URLs referenced but not yet generated (KNOWLEDGE-03)`
    );
  } else {
    ok("All referenced descriptor pages exist");
  }

  if (fs.existsSync(SITEMAP)) {
    const sitemap = fs.readFileSync(SITEMAP, "utf8");
    for (const slug of expected) {
      const url = `https://pairingmethod.com/terms/${slug}/`;
      if (!sitemap.includes(url)) fail(`Sitemap missing ${url}`);
    }
    ok("Sitemap includes all category hub URLs");
  } else {
    fail("sitemap.xml missing — run npm run generate:sitemap");
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
    fail(`Legacy flat glossary pages still present: ${legacyPresent.join(", ")}`);
  } else {
    ok("Legacy flat glossary pages retired");
  }

  const redirectsPath = path.join(ROOT, "_redirects");
  if (!fs.existsSync(redirectsPath)) {
    fail("_redirects missing — legacy glossary URLs need 301 redirects");
  } else {
    const redirects = fs.readFileSync(redirectsPath, "utf8");
    const missingRedirects = legacyFlat.filter((slug) => !redirects.includes(`/terms/${slug} `));
    if (missingRedirects.length) {
      fail(`_redirects missing legacy glossary redirects: ${missingRedirects.join(", ")}`);
    } else {
      ok("Legacy glossary redirects configured");
    }
  }

  if (!process.exitCode) ok("KNOWLEDGE-02 validation passed");
}

main();
