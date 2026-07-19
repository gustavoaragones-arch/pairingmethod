#!/usr/bin/env node
/**
 * FOOD-07E — Wine pairing layer for herb & spice ontology.
 * Curated editorial pairing knowledge — not algorithmically derived from flavor_profile or usage_intensity.
 * Does not modify catalog, runtime indexes, structural, or editorial layers.
 *
 * Run: node scripts/map-herb-spice-wine-relationships-07e.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-herb-spice-runtime.js";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { listWinemakingTechniqueEntries } from "../lib/taxonomy-winemaking-technique.js";
import { PAIRING_CURATED } from "./herb-spice-wine-seed-07e.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/herb-spice-catalog.json");
const STRUCTURAL_PATH = path.join(RUNTIME_DIR, "herb-spice-relationships.json");
const EDITORIAL_PATH = path.join(RUNTIME_DIR, "herb-spice-editorial-relationships.json");
const OUTPUT_PATH = path.join(RUNTIME_DIR, "herb-spice-wine-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/herb-spice-wine-relationship-report.json");
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

const BOTANICAL_PAIRING_SLUGS = [
  ["cilantro", "coriander-seed"],
  ["dill", "dill-seed"],
];

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

function loadHerbSpiceInputs() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const indexes = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "herb-spice-indexes.json"), "utf8")
  );
  const editorial = JSON.parse(fs.readFileSync(EDITORIAL_PATH, "utf8"));
  const structural = JSON.parse(fs.readFileSync(STRUCTURAL_PATH, "utf8"));
  return { catalog, slugMap: indexes.by_slug, editorial, structural };
}

function resolveHerbSpiceId(slugMap, slug) {
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

function pairingSignature(entries) {
  return entries
    .map((entry) => `${entry.relationship}\t${entry.target}`)
    .sort()
    .join("\n");
}

function validateBotanicalPairingRule(entries) {
  const errors = [];
  const bySlug = Object.fromEntries(
    BOTANICAL_PAIRING_SLUGS.flatMap(([slugA, slugB]) => [
      [slugA, entries.filter((e) => e.source === slugA)],
      [slugB, entries.filter((e) => e.source === slugB)],
    ])
  );

  for (const [slugA, slugB] of BOTANICAL_PAIRING_SLUGS) {
    const sigA = pairingSignature(bySlug[slugA] ?? []);
    const sigB = pairingSignature(bySlug[slugB] ?? []);
    if (sigA && sigA === sigB) {
      errors.push(
        `Botanical Consistency Rule: identical pairing profile forbidden between ${slugA} and ${slugB}`
      );
    }
  }

  return errors;
}

export function mapHerbSpiceWineRelationships({ slugMap, catalog, wine }) {
  const botanicalSeedErrors = validateBotanicalPairingRule(PAIRING_CURATED);
  if (botanicalSeedErrors.length) {
    throw new Error(botanicalSeedErrors.join("\n"));
  }

  const herbSpiceIds = new Set(Object.values(slugMap));
  const edges = [];
  const seen = new Set();

  for (const entry of PAIRING_CURATED) {
    const sourceId = resolveHerbSpiceId(slugMap, entry.source);
    if (!sourceId) {
      throw new Error(`Unknown herb or spice slug: ${entry.source}`);
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

  const herbSpicesLinked = new Set(edges.map((e) => e.source));
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
      phase: "FOOD-07E",
      domain: "herb-spice",
      version: EDGE_VERSION,
      catalog_version: catalog.meta?.catalog_version ?? null,
      layer: "wine_pairing",
      pairing_philosophy:
        "Curated editorial pairing knowledge for herbs and spices — Dominant Flavor Rule pairs by culinary contribution, not botanical classification; ingredients, not recipes.",
      dominant_flavor_rule:
        "Evaluate the ingredient's dominant culinary contribution rather than botanical classification when assigning wine pairings.",
      botanical_consistency_rule:
        "BOTAN-001: cilantro/coriander-seed and dill/dill-seed retain distinct pairing profiles despite shared species origin.",
      pairing_tiers: PAIRING_TIERS,
      relationship_types: PAIRING_RELATIONSHIP_TYPES.filter((t) => typeCounts[t] > 0),
      edge_count: edges.length,
      scope_exclusions: [
        "recipes",
        "finished_dishes",
        "regional_cuisine",
        "meal_composition",
        "ingredient_weighting",
        "multi_ingredient_reasoning",
        "preparation_algorithms",
      ],
      inputs: [
        "data/herb-spice-catalog.json",
        "data/runtime/herb-spice-indexes.json",
        "data/runtime/herb-spice-editorial-relationships.json",
        "data/wine-style-catalog.json",
        "data/wine-taxonomy.json",
        "data/winemaking-technique-catalog.json",
        "scripts/herb-spice-wine-seed-07e.js",
      ],
    },
    edges,
    stats: {
      herb_spices_linked: herbSpicesLinked.size,
      wine_styles_linked: stylesLinked.size,
      descriptor_links: descriptorLinks,
      technique_links: techniqueLinks,
      pairing_edges: edges.length,
      relationship_type_counts: typeCounts,
    },
    herbSpiceIds,
  };
}

function validatePairing(output, wine, herbSpiceIds, structural, editorial) {
  const errors = [];
  const seen = new Set();
  const forbidden = new Set([
    ...structural.edges.map(edgeKey),
    ...editorial.edges.map(edgeKey),
  ]);
  let duplicates = 0;
  let missingHerbSpice = 0;
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

    if (!herbSpiceIds.has(edge.source)) {
      missingHerbSpice += 1;
      errors.push(`Missing herb or spice entity: ${edge.source}`);
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

  return { errors, duplicates, missingHerbSpice, missingWine, pendingReview };
}

function main() {
  const { catalog, slugMap, editorial, structural } = loadHerbSpiceInputs();
  const wine = loadWineOntology();
  const output = mapHerbSpiceWineRelationships({ slugMap, catalog, wine });
  const validation = validatePairing(
    output,
    wine,
    output.herbSpiceIds,
    structural,
    editorial
  );

  const rebuilt = mapHerbSpiceWineRelationships({ slugMap, catalog, wine });
  const determinismPass =
    serializeRuntime({ meta: output.meta, edges: output.edges }) ===
    serializeRuntime({ meta: rebuilt.meta, edges: rebuilt.edges });

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-07E",
      domain: "herb-spice",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      metrics: {
        "Herb & spice entities linked": output.stats.herb_spices_linked,
        "Wine styles linked": output.stats.wine_styles_linked,
        "Descriptor links": output.stats.descriptor_links,
        "Technique links": output.stats.technique_links,
        "Pairing edges": output.stats.pairing_edges,
        "Duplicate edges": validation.duplicates,
        "Missing herb or spice entities": validation.missingHerbSpice,
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
    phase: "FOOD-07E",
    domain: "herb-spice",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    validation_errors: [],
    output: "data/runtime/herb-spice-wine-relationships.json",
    metrics: {
      "Herb & spice entities linked": output.stats.herb_spices_linked,
      "Wine styles linked": output.stats.wine_styles_linked,
      "Descriptor links": output.stats.descriptor_links,
      "Technique links": output.stats.technique_links,
      "Pairing edges": output.stats.pairing_edges,
      "Pending review edges": validation.pendingReview,
      "Duplicate edges": 0,
      "Missing herb or spice entities": 0,
      "Missing wine references": 0,
      "Invalid ontology references": 0,
      Determinism: "PASS",
      "Deterministic ordering": "PASS",
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
    pairing_tiers: PAIRING_TIERS,
    dominant_flavor_rule: output.meta.dominant_flavor_rule,
    botanical_consistency_rule: output.meta.botanical_consistency_rule,
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
