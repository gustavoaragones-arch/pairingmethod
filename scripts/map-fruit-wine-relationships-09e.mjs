#!/usr/bin/env node
/**
 * FOOD-09E — Wine pairing layer for fruit ontology.
 * Curated editorial pairing knowledge — not derived from flavor_profile or usage_intensity.
 * Does not modify catalog, runtime indexes, structural, or editorial layers.
 *
 * Run: node scripts/map-fruit-wine-relationships-09e.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-fruit-runtime.js";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { listWinemakingTechniqueEntries } from "../lib/taxonomy-winemaking-technique.js";
import { PAIRING_CURATED } from "./fruit-wine-seed-09e.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/fruit-catalog.json");
const STRUCTURAL_PATH = path.join(RUNTIME_DIR, "fruit-relationships.json");
const EDITORIAL_PATH = path.join(RUNTIME_DIR, "fruit-editorial-relationships.json");
const OUTPUT_PATH = path.join(RUNTIME_DIR, "fruit-wine-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/fruit-wine-relationship-report.json");
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

const TYPE_COUNT_TARGETS = {
  pairs_with_style: { min: 115, max: 135 },
  also_pairs_with_style: { min: 55, max: 75 },
  pairs_with_descriptor: { min: 35, max: 50 },
  pairs_with_technique: { min: 25, max: 40 },
  total: { min: 230, max: 300 },
};

const FRUIT001_PAIRING_FAMILIES = [
  ["grape", "raisin", "golden-raisin", "sultanas"],
  ["plum", "prune"],
  ["coconut", "desiccated-coconut", "coconut-milk"],
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

function loadFruitInputs() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const indexes = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "fruit-indexes.json"), "utf8")
  );
  const editorial = JSON.parse(fs.readFileSync(EDITORIAL_PATH, "utf8"));
  const structural = JSON.parse(fs.readFileSync(STRUCTURAL_PATH, "utf8"));
  return { catalog, slugMap: indexes.by_slug, editorial, structural };
}

function resolveFruitId(slugMap, slug) {
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

function validateFruit001PairingRule(entries) {
  const errors = [];
  const bySlug = Object.fromEntries(
    FRUIT001_PAIRING_FAMILIES.flat().map((slug) => [slug, entries.filter((e) => e.source === slug)])
  );

  for (const family of FRUIT001_PAIRING_FAMILIES) {
    const signatures = family.map((slug) => ({
      slug,
      signature: pairingSignature(bySlug[slug] ?? []),
    }));
    for (let i = 0; i < signatures.length; i += 1) {
      for (let j = i + 1; j < signatures.length; j += 1) {
        const a = signatures[i];
        const b = signatures[j];
        if (a.signature && a.signature === b.signature) {
          errors.push(
            `FRUIT-001: identical pairing profile forbidden between ${a.slug} and ${b.slug}`
          );
        }
      }
    }
  }

  return errors;
}

function validateFruitPair001Rule(entries) {
  const errors = [];
  const roleChecks = [
    { slug: "lemon", terms: ["acid", "fresh", "citrus", "finishing"] },
    { slug: "raisin", terms: ["dried", "tagine", "baking", "dried-grape"] },
    { slug: "coconut-milk", terms: ["cream", "curry", "rich"] },
    { slug: "coconut", terms: ["tropical", "fresh"] },
    { slug: "prune", terms: ["braise", "slow-cook", "glaze"] },
  ];

  for (const entry of entries) {
    const evidence = entry.evidence.toLowerCase();
    if (!evidence.includes("fruit-pair-001")) {
      errors.push(
        `FRUIT-PAIR-001: ${entry.source} pairing evidence must cite FRUIT-PAIR-001 culinary role rule`
      );
    }
  }

  for (const { slug, terms } of roleChecks) {
    const styleEntries = entries.filter(
      (entry) => entry.source === slug && entry.relationship.endsWith("_style")
    );
    for (const entry of styleEntries) {
      const evidence = entry.evidence.toLowerCase();
      if (!terms.some((term) => evidence.includes(term))) {
        errors.push(
          `FRUIT-PAIR-001: ${slug} pairing must cite ${terms.join("/")} culinary function`
        );
      }
    }
  }

  return errors;
}

export function mapFruitWineRelationships({ slugMap, catalog, wine }) {
  const fruit001SeedErrors = validateFruit001PairingRule(PAIRING_CURATED);
  const fruitPair001SeedErrors = validateFruitPair001Rule(PAIRING_CURATED);
  if (fruit001SeedErrors.length || fruitPair001SeedErrors.length) {
    throw new Error([...fruit001SeedErrors, ...fruitPair001SeedErrors].join("\n"));
  }

  const fruitIds = new Set(Object.values(slugMap));
  const edges = [];
  const seen = new Set();

  for (const entry of PAIRING_CURATED) {
    const sourceId = resolveFruitId(slugMap, entry.source);
    if (!sourceId) {
      throw new Error(`Unknown fruit slug: ${entry.source}`);
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

  const fruitsLinked = new Set(edges.map((e) => e.source));
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
      phase: "FOOD-09E",
      domain: "fruit",
      version: EDGE_VERSION,
      catalog_version: catalog.meta?.catalog_version ?? null,
      layer: "wine_pairing",
      pairing_philosophy:
        "Curated editorial pairing knowledge for fruit — FRUIT-PAIR-001 pairs by culinary role as an ingredient, not botanical origin or sweetness alone.",
      culinary_role_pairing_rule:
        "FRUIT-PAIR-001: wine pairing follows the fruit's culinary role — lemon for acidity, raisin for dried-fruit profile, coconut milk for creamy applications, prune for slow-cooked braises.",
      fruit001_ownership_rule:
        "FRUIT-001: processing-derived canonical entities retain distinct pairing profiles and must not inherit wine relationships from source crops.",
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
        "data/fruit-catalog.json",
        "data/runtime/fruit-indexes.json",
        "data/runtime/fruit-editorial-relationships.json",
        "data/wine-style-catalog.json",
        "data/wine-taxonomy.json",
        "data/winemaking-technique-catalog.json",
        "scripts/fruit-wine-seed-09e.js",
      ],
    },
    edges,
    stats: {
      fruits_linked: fruitsLinked.size,
      wine_styles_linked: stylesLinked.size,
      descriptor_links: descriptorLinks,
      technique_links: techniqueLinks,
      pairing_edges: edges.length,
      relationship_type_counts: typeCounts,
    },
    fruitIds,
  };
}

function validatePairing(output, wine, fruitIds, structural, editorial) {
  const errors = [];
  const seen = new Set();
  const forbidden = new Set([
    ...structural.edges.map(edgeKey),
    ...editorial.edges.map(edgeKey),
  ]);
  let duplicates = 0;
  let missingFruit = 0;
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

    if (!fruitIds.has(edge.source)) {
      missingFruit += 1;
      errors.push(`Missing fruit entity: ${edge.source}`);
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

  for (const [type, target] of Object.entries(TYPE_COUNT_TARGETS)) {
    if (type === "total") {
      if (output.edges.length < target.min || output.edges.length > target.max) {
        errors.push(
          `Edge count ${output.edges.length} outside FOOD-09E target ${target.min}-${target.max}`
        );
      }
      continue;
    }
    const count = output.stats.relationship_type_counts[type] ?? 0;
    if (count < target.min || count > target.max) {
      errors.push(`${type}: ${count} edges outside FOOD-09E target ${target.min}-${target.max}`);
    }
  }

  return { errors, duplicates, missingFruit, missingWine, pendingReview };
}

function main() {
  const { catalog, slugMap, editorial, structural } = loadFruitInputs();
  const wine = loadWineOntology();
  const output = mapFruitWineRelationships({ slugMap, catalog, wine });
  const validation = validatePairing(
    output,
    wine,
    output.fruitIds,
    structural,
    editorial
  );

  const rebuilt = mapFruitWineRelationships({ slugMap, catalog, wine });
  const determinismPass =
    serializeRuntime({ meta: output.meta, edges: output.edges }) ===
    serializeRuntime({ meta: rebuilt.meta, edges: rebuilt.edges });

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-09E",
      domain: "fruit",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      metrics: {
        "Fruit entities linked": output.stats.fruits_linked,
        "Wine styles linked": output.stats.wine_styles_linked,
        "Descriptor links": output.stats.descriptor_links,
        "Technique links": output.stats.technique_links,
        "Pairing edges": output.stats.pairing_edges,
        "Duplicate edges": validation.duplicates,
        "Missing fruit entities": validation.missingFruit,
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
    phase: "FOOD-09E",
    domain: "fruit",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    validation_errors: [],
    output: "data/runtime/fruit-wine-relationships.json",
    metrics: {
      "Fruit entities linked": output.stats.fruits_linked,
      "Wine styles linked": output.stats.wine_styles_linked,
      "Descriptor links": output.stats.descriptor_links,
      "Technique links": output.stats.technique_links,
      "Pairing edges": output.stats.pairing_edges,
      "Pending review edges": validation.pendingReview,
      "Duplicate edges": 0,
      "Missing fruit entities": 0,
      "Missing wine references": 0,
      "Invalid ontology references": 0,
      Determinism: "PASS",
      "Deterministic ordering": "PASS",
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
    pairing_tiers: PAIRING_TIERS,
    culinary_role_pairing_rule: output.meta.culinary_role_pairing_rule,
    fruit001_ownership_rule: output.meta.fruit001_ownership_rule,
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
