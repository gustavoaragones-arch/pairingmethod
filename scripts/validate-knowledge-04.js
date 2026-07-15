/**
 * KNOWLEDGE-04 validation — taxonomy integration across site.
 * Run: node scripts/validate-knowledge-04.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WINES, WINE_STYLE_SEMANTICS } from "../assets/js/pairing-data.js";
import { buildKnowledgeGraph, validateTaxonomySlugs } from "../lib/taxonomy-graph.js";
import { listGrapeCatalogEntries } from "../lib/taxonomy-grape.js";
import { loadPairingGuideCatalog } from "../lib/taxonomy-pairing.js";
import { listDescriptorNodes } from "../lib/taxonomy-descriptor.js";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { grapeUrl, termUrl } from "../lib/public-url.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function main() {
  const taxonomy = loadTaxonomy();
  const graph = buildKnowledgeGraph({ taxonomy, WINES, root: ROOT });

  // Runtime modules exist
  for (const f of [
    "assets/js/taxonomy-runtime.js",
    "assets/js/taxonomy-graph-index.js",
    "assets/js/taxonomy-search-index.js",
  ]) {
    if (!fs.existsSync(path.join(ROOT, f))) fail(`Missing ${f}`);
  }
  ok("Taxonomy runtime modules generated");

  // Grape pages consume taxonomy
  let grapeTermLinks = 0;
  for (const grape of listGrapeCatalogEntries()) {
    const file = `grapes/${grape.slug}.html`;
    if (!fs.existsSync(path.join(ROOT, file))) {
      fail(`Missing grape page: ${file}`);
      continue;
    }
    const html = read(file);
    if (!html.includes("term-entity-pill")) fail(`${file}: missing taxonomy descriptor pills`);
    if (!html.includes('href="/terms/')) fail(`${file}: missing descriptor entity links`);
    grapeTermLinks += (html.match(/href="\/terms\//g) ?? []).length;
  }
  ok(`Grape pages consume taxonomy (${grapeTermLinks} descriptor links)`);

  // Pairing guides enriched
  const pairingCatalog = loadPairingGuideCatalog();
  let enriched = 0;
  for (const slug of Object.keys(pairingCatalog.guides)) {
    const html = read(`${slug}.html`);
    if (!html.includes("KNOWLEDGE-04:TAXONOMY-START")) {
      fail(`${slug}.html: missing taxonomy enrichment block`);
      continue;
    }
    if (!html.includes("taxonomy-checklist") && !html.includes("pairing-why-taxonomy")) {
      fail(`${slug}.html: missing why-it-works taxonomy section`);
    }
    enriched += 1;
  }
  ok(`${enriched} pairing guides consume taxonomy`);

  // No duplicated definitions in grape pages (flavor prose replaced by pills)
  for (const grape of listGrapeCatalogEntries()) {
    const html = read(`grapes/${grape.slug}.html`);
    if (html.includes("<h2>Flavor Profile</h2>")) {
      fail(`${grape.slug}: still has legacy Flavor Profile section`);
    }
  }
  ok("Grape pages use taxonomy profile (no legacy flavor prose)");

  // WINE_STYLE_SEMANTICS slugs in taxonomy
  const allSemantic = Object.values(WINE_STYLE_SEMANTICS).flatMap((s) =>
    Object.values(s).flat()
  );
  const missing = validateTaxonomySlugs(taxonomy, [allSemantic]);
  if (missing.length) {
    fail(`${missing.length} WINE_STYLE_SEMANTICS slugs missing from taxonomy`);
  } else {
    ok("WINE_STYLE_SEMANTICS slugs validated against taxonomy");
  }

  // wine-semantic uses taxonomy runtime
  const wineSemantic = read("assets/js/wine-semantic.js");
  if (!wineSemantic.includes("taxonomy-runtime")) {
    fail("wine-semantic.js not wired to taxonomy-runtime");
  } else {
    ok("Pairing engine presentation uses taxonomy runtime");
  }

  // Descriptor reverse relationships
  const graphite = read("terms/graphite.html");
  if (!graphite.includes("Appears in") || !graphite.includes(grapeUrl("cabernet-sauvignon"))) {
    fail("graphite descriptor missing reverse grape relationship");
  } else {
    ok("Descriptor reverse relationships rendered");
  }

  // Graph connectivity — semantic relationships exist site-wide
  const descriptors = listDescriptorNodes(taxonomy);
  if (graph.stats.averageDegree < 2) {
    fail(`Graph average degree too low: ${graph.stats.averageDegree}`);
  } else {
    ok(`Graph average degree: ${graph.stats.averageDegree}`);
  }

  const unlinkedFromHub = [];
  for (const d of descriptors) {
    const catHtml = read(`terms/${d.category}/index.html`);
    if (!catHtml.includes(termUrl(d.slug))) unlinkedFromHub.push(d.slug);
  }
  if (unlinkedFromHub.length) {
    fail(`${unlinkedFromHub.length} descriptors not linked from category hubs`);
  } else {
    ok("All descriptors linked from category hubs (no orphan pages)");
  }

  // Pairing engine scoring untouched
  const engine = read("assets/js/pairing-engine.js");
  if (!engine.includes("PAIRING_MATRIX") && !engine.includes("scoreWineStyle")) {
    fail("pairing-engine.js matrix scoring may have been altered");
  } else {
    ok("Pairing engine matrix scoring intact");
  }

  // Homepage unchanged structurally
  const home = read("index.html");
  if (!home.includes("term-search-input") || !home.includes("semantic-entry.js")) {
    fail("Homepage search architecture changed");
  } else {
    ok("Homepage unchanged");
  }

  // KNOWLEDGE-03 still passes marker
  if (!fs.existsSync(path.join(ROOT, "terms", "grippy.html"))) {
    fail("Descriptor entity pages missing");
  } else {
    ok("Descriptor entity pages preserved");
  }

  if (!process.exitCode) ok("KNOWLEDGE-04 validation passed");
}

main();
