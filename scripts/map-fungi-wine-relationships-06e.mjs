#!/usr/bin/env node
/**
 * FOOD-06E — Wine pairing layer for fungi ontology.
 * Curated editorial pairing knowledge — not algorithmically derived from usage_intensity or reserved profiles.
 * Does not modify catalog, runtime indexes, structural, or editorial layers.
 *
 * Run: node scripts/map-fungi-wine-relationships-06e.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-fungi-runtime.js";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { listWinemakingTechniqueEntries } from "../lib/taxonomy-winemaking-technique.js";
import { PAIRING_CURATED } from "./fungi-wine-pairing-seed-06e.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/fungi-catalog.json");
const STRUCTURAL_PATH = path.join(RUNTIME_DIR, "fungi-relationships.json");
const EDITORIAL_PATH = path.join(RUNTIME_DIR, "fungi-editorial-relationships.json");
const OUTPUT_PATH = path.join(RUNTIME_DIR, "fungi-wine-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/fungi-wine-relationship-report.json");
const EDGE_VERSION = "1.0";

const PAIRING_RELATIONSHIP_TYPES = [
  "pairs_with_style",
  "also_pairs_with_style",
  "pairs_with_descriptor",
  "pairs_with_technique",
];

const PAIRING_TIERS = {
  primary: "pairs_with_style",
  secondary: "also_pairs_with_style",
  descriptor: "pairs_with_descriptor",
  technique: "pairs_with_technique",
};

const VALID_EDITORIAL_REVIEW = new Set(["approved", "pending"]);

function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeysDeep(value[key]);
        return acc;
      }, {});
  }
  return value;
}

function writeJson(filePath, data) {
  const text = `${JSON.stringify(sortKeysDeep(data), null, 2)}\n`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
  return text;
}

function edgeKey(edge) {
  return `${edge.source}\t${edge.relationship}\t${edge.target}`;
}

function loadWineOntology() {
  const taxonomy = loadTaxonomy();
  const descriptorIds = new Set(
    Object.values(taxonomy.nodes)
      .filter((n) => n.type === "descriptor")
      .map((n) => n.slug)
  );
  const styleIds = new Set(listWineStyleEntries().map((s) => s.slug));
  const techniqueIds = new Set(listWinemakingTechniqueEntries().map((t) => t.slug));

  return { styleIds, descriptorIds, techniqueIds };
}

function loadFungiInputs() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const indexes = JSON.parse(fs.readFileSync(path.join(RUNTIME_DIR, "fungi-indexes.json"), "utf8"));
  const editorial = JSON.parse(fs.readFileSync(EDITORIAL_PATH, "utf8"));
  const structural = JSON.parse(fs.readFileSync(STRUCTURAL_PATH, "utf8"));
  return { catalog, slugMap: indexes.by_slug, editorial, structural };
}

function resolveFungusId(slugMap, slug) {
  return slugMap[slug] ?? null;
}

function validateTarget(relationship, target, wine) {
  if (relationship === "pairs_with_style" || relationship === "also_pairs_with_style") {
    return wine.styleIds.has(target);
  }
  if (relationship === "pairs_with_descriptor") {
    return wine.descriptorIds.has(target);
  }
  if (relationship === "pairs_with_technique") {
    return wine.techniqueIds.has(target);
  }
  return false;
}

export function mapFungiWineRelationships({ slugMap, catalog, wine }) {
  const fungusIds = new Set(Object.values(slugMap));
  const edges = [];
  const seen = new Set();

  for (const entry of PAIRING_CURATED) {
    const sourceId = resolveFungusId(slugMap, entry.source);
    if (!sourceId) {
      throw new Error(`Unknown fungus slug: ${entry.source}`);
    }
    if (!validateTarget(entry.relationship, entry.target, wine)) {
      throw new Error(`Unknown wine target: ${entry.target} for ${entry.relationship}`);
    }

    const edge = {
      source: sourceId,
      relationship: entry.relationship,
      target: entry.target,
      confidence: entry.confidence,
      derived_from: "editorial",
      stability_level: "wine_pairing",
      editorial_review: entry.editorial_review,
      evidence: entry.evidence,
      version: EDGE_VERSION,
    };

    const key = edgeKey(edge);
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push(edge);
  }

  edges.sort((a, b) => edgeKey(a).localeCompare(edgeKey(b)));

  const fungiLinked = new Set(edges.map((e) => e.source));
  const stylesLinked = new Set(
    edges.filter((e) => e.relationship.endsWith("_style")).map((e) => e.target)
  );
  const descriptorLinks = edges.filter((e) => e.relationship === "pairs_with_descriptor").length;
  const techniqueLinks = edges.filter((e) => e.relationship === "pairs_with_technique").length;

  const typeCounts = Object.fromEntries(
    PAIRING_RELATIONSHIP_TYPES.map((type) => [type, 0])
  );
  for (const edge of edges) {
    typeCounts[edge.relationship] = (typeCounts[edge.relationship] ?? 0) + 1;
  }

  return {
    meta: {
      phase: "FOOD-06E",
      domain: "fungi",
      version: EDGE_VERSION,
      catalog_version: catalog.meta?.catalog_version ?? null,
      layer: "wine_pairing",
      pairing_philosophy:
        "Curated editorial pairing knowledge for fungi — earthiness, umami, and richness; not derived from usage_intensity or reserved profile algorithms.",
      pairing_tiers: PAIRING_TIERS,
      relationship_types: PAIRING_RELATIONSHIP_TYPES.filter((t) => typeCounts[t] > 0),
      edge_count: edges.length,
      truffle_rule:
        "Truffle descriptor pairings emphasize aroma compatibility; avoid prestige-driven wine selection over culinary rationale.",
      scope_exclusions: [
        "recipes",
        "finished_dishes",
        "meal_composition",
        "ingredient_weighting",
        "multi_ingredient_reasoning",
        "preparation_algorithms",
      ],
      inputs: [
        "data/fungi-catalog.json",
        "data/runtime/fungi-indexes.json",
        "data/runtime/fungi-editorial-relationships.json",
        "data/wine-style-catalog.json",
        "data/wine-taxonomy.json",
        "data/winemaking-technique-catalog.json",
        "scripts/fungi-wine-pairing-seed-06e.js",
      ],
    },
    edges,
    stats: {
      fungi_linked: fungiLinked.size,
      wine_styles_linked: stylesLinked.size,
      descriptor_links: descriptorLinks,
      technique_links: techniqueLinks,
      pairing_edges: edges.length,
      relationship_type_counts: typeCounts,
    },
    fungusIds,
  };
}

function validatePairing(output, wine, fungusIds, structural, editorial) {
  const errors = [];
  const seen = new Set();
  const forbidden = new Set([
    ...structural.edges.map(edgeKey),
    ...editorial.edges.map(edgeKey),
  ]);
  let duplicates = 0;
  let missingFungus = 0;
  let missingWine = 0;
  let pendingReview = 0;

  for (const edge of output.edges) {
    const key = edgeKey(edge);
    if (seen.has(key)) {
      duplicates += 1;
      errors.push(`Duplicate pairing edge: ${key}`);
    }
    seen.add(key);

    if (edge.source === edge.target) {
      errors.push(`Self-reference: ${key}`);
    }

    if (!fungusIds.has(edge.source)) {
      missingFungus += 1;
      errors.push(`Missing fungus entity: ${edge.source}`);
    }
    if (!edge.evidence?.trim()) {
      errors.push(`Missing evidence: ${key}`);
    }
    if (edge.confidence !== "high") {
      errors.push(`Invalid confidence: ${key}`);
    }
    if (edge.derived_from !== "editorial") {
      errors.push(`Invalid derived_from: ${key}`);
    }
    if (edge.stability_level !== "wine_pairing") {
      errors.push(`Invalid stability_level: ${key}`);
    }
    if (!VALID_EDITORIAL_REVIEW.has(edge.editorial_review)) {
      errors.push(`Invalid editorial_review: ${key}`);
    }
    if (edge.editorial_review === "pending") {
      pendingReview += 1;
    }
    if (!validateTarget(edge.relationship, edge.target, wine)) {
      missingWine += 1;
      errors.push(`Invalid wine ontology reference: ${edge.target}`);
    }
    if (forbidden.has(key)) {
      errors.push(`Conflicts with prior layer: ${key}`);
    }
    if (!PAIRING_RELATIONSHIP_TYPES.includes(edge.relationship)) {
      errors.push(`Unknown relationship: ${edge.relationship}`);
    }
  }

  return { errors, duplicates, missingFungus, missingWine, pendingReview };
}

function main() {
  const { catalog, slugMap, editorial, structural } = loadFungiInputs();
  const wine = loadWineOntology();
  const output = mapFungiWineRelationships({ slugMap, catalog, wine });
  const validation = validatePairing(
    output,
    wine,
    output.fungusIds,
    structural,
    editorial
  );

  const rebuilt = mapFungiWineRelationships({ slugMap, catalog, wine });
  const determinismPass =
    serializeRuntime({ meta: output.meta, edges: output.edges }) ===
    serializeRuntime({ meta: rebuilt.meta, edges: rebuilt.edges });

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-06E",
      domain: "fungi",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      metrics: {
        "Fungi linked": output.stats.fungi_linked,
        "Wine styles linked": output.stats.wine_styles_linked,
        "Descriptor links": output.stats.descriptor_links,
        "Technique links": output.stats.technique_links,
        "Pairing edges": output.stats.pairing_edges,
        "Duplicate edges": validation.duplicates,
        "Missing fungus entities": validation.missingFungus,
        "Missing wine references": validation.missingWine,
        Determinism: determinismPass ? "PASS" : "FAIL",
        "Overall result": "FAIL",
      },
    };
    writeJson(REPORT_PATH, report);
    console.error(validation.errors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(OUTPUT_PATH, { meta: output.meta, edges: output.edges });

  const report = {
    phase: "FOOD-06E",
    domain: "fungi",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    validation_errors: [],
    output: "data/runtime/fungi-wine-relationships.json",
    metrics: {
      "Fungi linked": output.stats.fungi_linked,
      "Wine styles linked": output.stats.wine_styles_linked,
      "Descriptor links": output.stats.descriptor_links,
      "Technique links": output.stats.technique_links,
      "Pairing edges": output.stats.pairing_edges,
      "Pending review edges": validation.pendingReview,
      "Duplicate edges": 0,
      "Missing fungus entities": 0,
      "Missing wine references": 0,
      "Invalid ontology references": 0,
      Determinism: "PASS",
      "Deterministic ordering": "PASS",
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
    pairing_tiers: PAIRING_TIERS,
    truffle_rule: output.meta.truffle_rule,
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Wine pairing relationships: ${OUTPUT_PATH}`);
  console.log(`Report: ${REPORT_PATH}`);
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
