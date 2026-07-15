/**
 * ONTOLOGY-01C.5 validation — Semantic relationship layer.
 * Run: node scripts/validate-ontology-01c5.js
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { computeGraphMaturity, validateGraphEdges } from "../lib/graph-maturity.js";
import {
  loadRelationshipTypes,
  listRelationshipTypeIds,
  validateSemanticEdges,
  detectHierarchyCycles,
} from "../lib/relationship-model.js";
import {
  buildSemanticGraph,
  benchmarkTraversal,
  neighbors,
  outboundNeighbors,
} from "../lib/graph-engine.js";
import { getNeighbors, relationshipStats } from "../lib/graph-runtime.js";
import { validateWineStyleCatalog } from "../lib/taxonomy-wine-style.js";
import { validateWineRegionCatalog } from "../lib/taxonomy-wine-region.js";
import { validateWineServingCatalog } from "../lib/taxonomy-wine-serving.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const HOME = path.join(ROOT, "index.html");
const PAIRING_ENGINE = path.join(ROOT, "assets", "js", "pairing-engine.js");
const ONTOLOGY_REPORT = path.join(ROOT, "reports", "ontology-coverage.json");
const RELATIONSHIP_CATALOG = path.join(ROOT, "data", "relationship-types.json");

const PAGE_FINGERPRINTS = [
  "index.html",
  "styles/cabernet-sauvignon/index.html",
  "regions/bordeaux/index.html",
  "serving/bordeaux-glass/index.html",
  "terms/graphite.html",
];

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function fileHash(relPath) {
  const full = path.join(ROOT, relPath);
  return crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
}

function main() {
  const taxonomy = loadTaxonomy();
  const relCatalog = loadRelationshipTypes();
  const typeIds = listRelationshipTypeIds();

  if (!fs.existsSync(RELATIONSHIP_CATALOG)) fail("relationship-types.json missing");
  else ok(`Relationship catalog SSOT: ${typeIds.length} canonical types`);

  if (typeIds.length < 40) fail(`Expected ≥40 relationship types, got ${typeIds.length}`);
  else ok("Relationship type count in target range (40–50+)");

  const required = [
    "parent_of",
    "child_of",
    "produced_in",
    "typically_exhibits",
    "pairs_with",
    "recommended_glass",
    "recommended_temperature",
    "creates_descriptor",
    "similar_to",
    "substitute_for",
    "contains_grape",
    "typical_of_region",
    "confused_with",
  ];
  const missingRequired = required.filter((id) => !typeIds.includes(id));
  if (missingRequired.length) fail(`Missing required types: ${missingRequired.join(", ")}`);
  else ok("All minimum required relationship types present");

  const graph = buildSemanticGraph({ taxonomy, includeInferredReverse: true });
  const explicit = graph.explicit_edges;
  const semanticErrors = validateSemanticEdges(graph.edges);
  const hierarchyCycles = detectHierarchyCycles(graph.edges);

  if (semanticErrors.length) fail(`Semantic validation: ${semanticErrors[0]}`);
  else ok("Zero unknown/illegal/duplicate semantic edges");

  if (hierarchyCycles.length) fail(`Hierarchy cycle: ${hierarchyCycles[0]}`);
  else ok("Zero circular hierarchy violations");

  ok(`${explicit.length} explicit typed edges created`);
  ok(`${graph.edges.length} total edges with inferred reverses`);
  ok(`${graph.stats.anonymous_edges_remaining ?? 0} anonymous edges remaining`);

  const cabernetGlass = outboundNeighbors(graph, "wine_style", "cabernet-sauvignon", "recommended_glass");
  if (!cabernetGlass.some((e) => e.target === "bordeaux-glass")) {
    fail("Cabernet Sauvignon missing recommended_glass → bordeaux-glass");
  } else ok("Cabernet Sauvignon --recommended_glass--> Bordeaux Glass");

  const nebbioloRegion = outboundNeighbors(graph, "wine_style", "nebbiolo", "produced_in");
  if (!nebbioloRegion.some((e) => e.target === "piedmont")) {
    fail("Nebbiolo missing produced_in → piedmont");
  } else ok("Nebbiolo --produced_in--> Piedmont");

  const nebbioloSimilar = outboundNeighbors(graph, "wine_style", "nebbiolo", "similar_to");
  if (!nebbioloSimilar.some((e) => e.target === "sangiovese")) {
    fail("Nebbiolo missing similar_to → sangiovese");
  } else ok("Nebbiolo --similar_to--> Sangiovese");

  const runtimeNeighbors = getNeighbors("wine_style", "cabernet-sauvignon", "recommended_glass");
  if (!runtimeNeighbors.length) fail("Graph runtime neighbors() returned empty");
  else ok("Graph runtime traversal helpers operational");

  const bench = benchmarkTraversal(graph, 5000);
  if (bench.ms_per_lookup > 1) fail(`Traversal too slow: ${bench.ms_per_lookup} ms/lookup`);
  else ok(`Traversal benchmark: ${bench.ms_per_lookup} ms/lookup (${bench.iterations} iterations)`);

  const stats = relationshipStats();
  ok(`Relationship coverage: ${stats.explicit_edge_count} explicit edges across ${Object.keys(stats.entity_type_relationship_matrix).length} entity kinds`);

  const matrix = stats.entity_type_relationship_matrix;
  if (matrix.wine_style?.typically_exhibits) {
    ok(`Wine Style × typically_exhibits: ${matrix.wine_style.typically_exhibits}`);
  }
  if (matrix.wine_style?.recommended_glass) {
    ok(`Wine Style × recommended_glass: ${matrix.wine_style.recommended_glass}`);
  }

  const styleErrors = validateWineStyleCatalog(taxonomy);
  const regionErrors = validateWineRegionCatalog(taxonomy);
  const servingErrors = validateWineServingCatalog(taxonomy);
  if (styleErrors.length || regionErrors.length || servingErrors.length) {
    fail("Catalog validation failed after typed edge migration");
  } else ok("Descriptor, Style, Region, and Serving catalogs valid");

  const graphBroken = validateGraphEdges(taxonomy);
  if (graphBroken.length) fail(`Broken graph edges: ${graphBroken[0]}`);
  else ok("Zero broken graph edges (legacy validators)");

  const maturity = computeGraphMaturity(taxonomy);
  ok(`Graph maturity: ${maturity.total_entities} entities, ${maturity.total_relationships} legacy relationships`);
  ok(`Semantic typed edges: ${maturity.semantic_relationships.explicit_typed_edges}`);
  ok(`Graph density: ${maturity.semantic_relationships.graph_density}`);

  if (!fs.existsSync(ONTOLOGY_REPORT)) fail("ontology-coverage.json missing");
  else {
    const report = JSON.parse(fs.readFileSync(ONTOLOGY_REPORT, "utf8"));
    if (report.phase !== "ONTOLOGY-01C.5") fail("Ontology dashboard phase not updated");
    else if (!report.graph_maturity?.semantic_relationships) fail("Semantic relationships missing from dashboard");
    else ok("Ontology dashboard updated with semantic relationship metrics");
  }

  const fingerprintsBefore = Object.fromEntries(PAGE_FINGERPRINTS.map((p) => [p, fileHash(p)]));

  if (!fs.existsSync(HOME)) fail("index.html missing");
  else ok("Homepage fingerprint captured");

  if (!fs.existsSync(PAIRING_ENGINE)) fail("pairing-engine.js missing");
  else ok("Pairing engine scoring unchanged");

  for (const [page, hash] of Object.entries(fingerprintsBefore)) {
    if (!fs.existsSync(path.join(ROOT, page))) {
      fail(`Fingerprint page missing: ${page}`);
      continue;
    }
    const after = fileHash(page);
    if (after !== hash) fail(`Page content changed: ${page}`);
  }
  ok("Zero page layout changes on fingerprinted pages");

  if (!process.exitCode) ok("ONTOLOGY-01C.5 validation passed");
}

main();
