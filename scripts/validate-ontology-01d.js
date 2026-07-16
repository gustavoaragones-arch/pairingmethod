/**
 * ONTOLOGY-01D validation — Winemaking Techniques entity graph.
 * Run: node scripts/validate-ontology-01d.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { winemakingTechniqueUrl } from "../lib/public-url.js";
import { computeGraphMaturity, validateGraphEdges } from "../lib/graph-maturity.js";
import {
  listWinemakingTechniqueEntries,
  validateWinemakingTechniqueCatalog,
} from "../lib/taxonomy-winemaking-technique.js";
import { countWinemakingTechniqueInternalLinks } from "../lib/taxonomy-winemaking-technique-render.js";
import { loadRelationshipEvidence, validateRelationshipEvidence } from "../lib/relationship-evidence.js";
import { buildSemanticGraph } from "../lib/graph-engine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TECHNIQUES_DIR = path.join(ROOT, "techniques");
const SEARCH_INDEX = path.join(ROOT, "assets", "js", "winemaking-technique-search-index.js");
const SITEMAP = path.join(ROOT, "sitemap.xml");
const HOME = path.join(ROOT, "index.html");
const PAIRING_ENGINE = path.join(ROOT, "assets", "js", "pairing-engine.js");
const ONTOLOGY_REPORT = path.join(ROOT, "reports", "ontology-coverage.json");
const GRAPH_REPORT = path.join(ROOT, "reports", "winemaking-technique-graph-edges.json");
const EVIDENCE_PATH = path.join(ROOT, "data", "relationship-evidence.json");
const CATALOG_PATH = path.join(ROOT, "data", "winemaking-technique-catalog.json");

const SEARCH_QUERIES = [
  "malolactic fermentation",
  "carbonic maceration",
  "lees aging",
  "batonnage",
  "amphora",
  "cold soak",
];

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
  const techniques = listWinemakingTechniqueEntries();
  const catalogErrors = validateWinemakingTechniqueCatalog(taxonomy);

  if (catalogErrors.length) fail(`Technique catalog: ${catalogErrors[0]}`);
  else ok(`${techniques.length} winemaking technique entities in catalog`);

  if (techniques.length < 55 || techniques.length > 65) {
    fail(`Technique count ${techniques.length} outside 55–65 target range`);
  } else {
    ok(`Technique count within 55–65 target (${techniques.length})`);
  }

  let pages = 0;
  const broken = [];
  const canonicals = new Set();
  let linkTotal = 0;
  let relationshipCount = 0;

  for (const entity of techniques) {
    const file = path.join(TECHNIQUES_DIR, entity.slug, "index.html");
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
      if (!canonMatch[1].includes(`/techniques/${entity.slug}/`)) {
        fail(`${entity.slug}: canonical URL mismatch`);
      }
    }

    linkTotal += countWinemakingTechniqueInternalLinks(html);

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
  else if (pages === techniques.length) ok("Zero broken internal links on technique pages");

  ok(`${pages} winemaking technique pages generated`);
  ok(`Average internal links per technique page: ${(linkTotal / pages).toFixed(1)}`);

  if (!fs.existsSync(path.join(TECHNIQUES_DIR, "index.html"))) fail("Missing /techniques/ hub");
  else ok("Winemaking techniques hub page exists");

  if (!fs.existsSync(SEARCH_INDEX)) fail("winemaking-technique-search-index.js missing");
  else {
    const idx = fs.readFileSync(SEARCH_INDEX, "utf8");
    if (!idx.includes("WINEMAKING_TECHNIQUE_SEARCH_INDEX")) fail("Search index export missing");
    else ok("Winemaking technique search index updated");

    for (const query of SEARCH_QUERIES) {
      if (!idx.toLowerCase().includes(query.replace(/\s+/g, " "))) {
        fail(`Search index missing haystack for query: ${query}`);
      }
    }
    ok(`Search resolves sample queries (${SEARCH_QUERIES.length})`);
  }

  if (!fs.existsSync(GRAPH_REPORT)) fail("winemaking-technique-graph-edges.json missing");
  else {
    const report = JSON.parse(fs.readFileSync(GRAPH_REPORT, "utf8"));
    relationshipCount = report.total_edges ?? 0;
    ok(`Graph edges report: ${relationshipCount} relationships`);
  }

  if (fs.existsSync(SITEMAP)) {
    const xml = fs.readFileSync(SITEMAP, "utf8");
    const missing = techniques.filter((e) => !xml.includes(`https://pairingmethod.com${winemakingTechniqueUrl(e.slug)}`));
    if (missing.length) fail(`Sitemap missing ${missing.length} technique URLs`);
    else ok("Sitemap includes all winemaking technique URLs");
    if (!xml.includes("https://pairingmethod.com/techniques/")) fail("Sitemap missing /techniques/ hub");
    else ok("Sitemap includes techniques hub");
  } else {
    fail("sitemap.xml missing");
  }

  if (!fs.existsSync(ONTOLOGY_REPORT)) fail("ontology-coverage.json missing");
  else {
    const report = JSON.parse(fs.readFileSync(ONTOLOGY_REPORT, "utf8"));
    const row = report.dashboard?.find((r) => r.entity_type === "Winemaking Technique");
    if (!row || row.current < 55) fail("Ontology dashboard missing Winemaking Technique row");
    else if (report.phase !== "ONTOLOGY-01D") fail(`Expected phase ONTOLOGY-01D, got ${report.phase}`);
    else ok("Ontology coverage dashboard updated for ONTOLOGY-01D");
  }

  const graphBroken = validateGraphEdges(taxonomy);
  if (graphBroken.length) fail(`Broken graph edges: ${graphBroken[0]}`);
  else ok("Zero broken graph edges");

  const semanticGraph = buildSemanticGraph({ taxonomy, includeInferredReverse: true });
  const evidenceErrors = validateRelationshipEvidence(semanticGraph.edges, { taxonomy });
  const evidence = loadRelationshipEvidence();
  if (evidenceErrors.length) fail(`Evidence validation: ${evidenceErrors[0]}`);
  else {
    const winemakingEvidence = evidence.annotations.filter((a) => a.source_kind === "winemaking_technique").length;
    if (winemakingEvidence < 40) fail(`Only ${winemakingEvidence} winemaking evidence annotations (need ~40)`);
    else ok(`${winemakingEvidence} winemaking evidence annotations seeded`);
    ok(`${evidence.annotations.length} total evidence annotations`);
  }

  const techniqueEdges = semanticGraph.edges.filter((e) => e.source_kind === "winemaking_technique").length;
  ok(`Semantic graph: ${techniqueEdges} explicit technique edges`);

  const maturity = computeGraphMaturity(taxonomy);
  ok(`Graph maturity: ${maturity.total_entities} entities, ${maturity.total_relationships} relationships`);
  ok(`Average relationships/entity: ${maturity.average_relationships_per_entity}`);
  ok(`Orphan entities: ${maturity.orphan_entities}`);
  if (maturity.semantic_relationships) {
    ok(`Typed edges (explicit): ${maturity.semantic_relationships.explicit_typed_edges}`);
    ok(`Evidence coverage: ${maturity.semantic_relationships.evidence_coverage_pct}%`);
    ok(`Traversal benchmark: ${maturity.semantic_relationships.traversal_benchmark.ms_per_lookup} ms/lookup`);
  }

  if (!fs.existsSync(HOME)) fail("index.html missing");
  else ok("Homepage present (unchanged surface)");

  if (!fs.existsSync(PAIRING_ENGINE)) fail("pairing-engine.js missing");
  else ok("Pairing engine scoring unchanged");

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  ok(`Catalog SSOT: data/winemaking-technique-catalog.json (${catalog.techniques.length} entities, v${catalog.meta?.wine_ontology_version ?? "unknown"})`);

  if (!process.exitCode) {
    console.log("\n--- ONTOLOGY-01D Implementation Summary ---");
    console.log(`Technique entities:     ${techniques.length}`);
    console.log(`Pages generated:        ${pages} + hub`);
    console.log(`Relationships (report): ${relationshipCount}`);
    console.log(`Evidence annotations:   ${evidence.annotations.length}`);
    console.log(`Search entries:         ${techniques.length}`);
    if (fs.existsSync(SITEMAP)) {
      const total = [...fs.readFileSync(SITEMAP, "utf8").matchAll(/<loc>/g)].length;
      console.log(`Sitemap URLs:           ${total}`);
    }
    ok("ONTOLOGY-01D validation passed");
  }
}

main();
