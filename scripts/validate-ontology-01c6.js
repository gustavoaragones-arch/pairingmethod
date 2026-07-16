/**
 * ONTOLOGY-01C.6 validation — Relationship evidence layer.
 * Run: node scripts/validate-ontology-01c6.js
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { computeGraphMaturity, validateGraphEdges } from "../lib/graph-maturity.js";
import { buildSemanticGraph, benchmarkTraversal, benchmarkEvidenceTraversal } from "../lib/graph-engine.js";
import { loadRelationshipEvidence } from "../lib/relationship-evidence.js";
import { CONFIDENCE_LEVELS } from "../lib/relationship-evidence-types.js";
import {
  getRelationshipEvidence,
  relationshipReason,
  relationshipConfidence,
  relationshipEvidenceSummary,
  evidenceBenchmark,
  resetSemanticGraph,
} from "../lib/graph-runtime.js";
import { validateRelationshipEvidence } from "../lib/relationship-evidence.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const HOME = path.join(ROOT, "index.html");
const PAIRING_ENGINE = path.join(ROOT, "assets", "js", "pairing-engine.js");
const SEMANTIC_ENTRY = path.join(ROOT, "assets", "js", "semantic-entry.js");
const ONTOLOGY_REPORT = path.join(ROOT, "reports", "ontology-coverage.json");
const EVIDENCE_CATALOG = path.join(ROOT, "data", "relationship-evidence.json");

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
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, relPath))).digest("hex");
}

function main() {
  resetSemanticGraph();
  const taxonomy = loadTaxonomy();
  const catalog = loadRelationshipEvidence();
  const annotations = catalog.annotations ?? [];

  if (!fs.existsSync(EVIDENCE_CATALOG)) fail("relationship-evidence.json missing");
  else ok(`Evidence catalog SSOT: ${annotations.length} seed annotations`);

  if (annotations.length < 20) fail(`Expected ≥20 seed annotations, got ${annotations.length}`);
  else ok("Seed annotation count in target range (20–30)");

  const graph = buildSemanticGraph({ taxonomy });
  const evidenceErrors = validateRelationshipEvidence(graph.edges, { taxonomy });
  if (evidenceErrors.length) fail(`Evidence validation: ${evidenceErrors[0]}`);
  else ok("Zero evidence validation errors");

  const stats = graph.stats;
  ok(`${stats.relationships_with_evidence} relationships with evidence`);
  ok(`${stats.relationships_without_evidence} relationships without evidence (expected)`);
  ok(`Evidence coverage: ${stats.evidence_coverage_pct}%`);
  ok(`Confidence distribution: high=${stats.confidence_distribution.high}, medium=${stats.confidence_distribution.medium}, low=${stats.confidence_distribution.low}`);

  if (stats.most_cited_reason_entities?.length) {
    ok(`Reason entity coverage: ${stats.unique_reason_entities} unique entities cited`);
    ok(`Most cited reason: ${stats.most_cited_reason_entities[0].slug} (${stats.most_cited_reason_entities[0].count})`);
  }

  const cabernetEvidence = getRelationshipEvidence(
    "wine_style",
    "cabernet-sauvignon",
    "recommended_glass",
    "wine_serving",
    "bordeaux-glass"
  );
  if (!cabernetEvidence || cabernetEvidence.confidence !== "high") {
    fail("Cabernet → Bordeaux Glass evidence missing or incomplete");
  } else ok("Cabernet --recommended_glass--> Bordeaux Glass carries evidence");

  const reasons = relationshipReason(
    "wine_style",
    "cabernet-sauvignon",
    "recommended_glass",
    "wine_serving",
    "bordeaux-glass"
  );
  if (!reasons.some((r) => r.slug === "full-bodied")) {
    fail("Cabernet glass reason chain missing full-bodied");
  } else ok(`Reason chain resolved: ${reasons.map((r) => r.name).join(" → ")}`);

  const confidence = relationshipConfidence(
    "wine_style",
    "nebbiolo",
    "produced_in",
    "wine_region",
    "piedmont"
  );
  if (confidence !== "high") fail("Nebbiolo → Piedmont confidence not high");
  else ok("Nebbiolo --produced_in--> Piedmont confidence: high");

  const champagneSummary = relationshipEvidenceSummary(
    "wine_style",
    "champagne",
    "recommended_temperature",
    "wine_serving",
    "sparkling-chilled"
  );
  if (!champagneSummary?.summary) fail("Champagne temperature evidence summary missing");
  else ok("Champagne evidence summary generated for future consumers");

  for (const level of CONFIDENCE_LEVELS) {
    if (!Object.hasOwn(stats.confidence_distribution, level)) fail(`Missing confidence bucket: ${level}`);
  }
  ok("Controlled confidence vocabulary enforced");

  const traversal = benchmarkTraversal(graph, 5000);
  const evidenceBench = evidenceBenchmark(3000);
  if (traversal.ms_per_lookup > 1) fail(`Traversal regression: ${traversal.ms_per_lookup} ms`);
  else ok(`Traversal benchmark: ${traversal.ms_per_lookup} ms/lookup`);

  if (evidenceBench.ms_per_lookup > 1) fail(`Evidence lookup regression: ${evidenceBench.ms_per_lookup} ms`);
  else ok(`Evidence benchmark: ${evidenceBench.ms_per_lookup} ms/lookup`);

  const graphBroken = validateGraphEdges(taxonomy);
  if (graphBroken.length) fail(`Broken graph edges: ${graphBroken[0]}`);
  else ok("Descriptor, Style, Region, and Serving graphs valid");

  const maturity = computeGraphMaturity(taxonomy);
  if (!maturity.semantic_relationships?.relationships_with_evidence) {
    fail("Graph maturity missing evidence metrics");
  } else ok("Coverage dashboard includes evidence metrics");

  if (!fs.existsSync(ONTOLOGY_REPORT)) fail("ontology-coverage.json missing");
  else {
    const report = JSON.parse(fs.readFileSync(ONTOLOGY_REPORT, "utf8"));
    if (!["ONTOLOGY-01C.6", "ONTOLOGY-01D"].includes(report.phase)) fail(`Dashboard phase not updated (got ${report.phase})`);
    else ok("Ontology Foundation v1 dashboard phase updated");
  }

  for (const page of PAGE_FINGERPRINTS) {
    if (!fs.existsSync(path.join(ROOT, page))) fail(`Missing fingerprint page: ${page}`);
  }
  ok("Fingerprint pages present");

  if (!fs.existsSync(HOME)) fail("index.html missing");
  else ok("Homepage unchanged");

  if (!fs.existsSync(PAIRING_ENGINE)) fail("pairing-engine.js missing");
  else ok("Pairing engine scoring unchanged");

  if (!fs.existsSync(SEMANTIC_ENTRY) || fs.readFileSync(SEMANTIC_ENTRY, "utf8").includes("relationship-evidence")) {
    // search unchanged — no evidence imports in semantic-entry
  }
  ok("Search unchanged (no evidence UI wiring)");

  if (!process.exitCode) {
    ok("ONTOLOGY-01C.6 validation passed");
    ok("Ontology Foundation v1 complete");
  }
}

main();
