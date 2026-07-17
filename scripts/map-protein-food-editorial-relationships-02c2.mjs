#!/usr/bin/env node
/**
 * ONTOLOGY-02C.2 — Editorial culinary relationship mapper for protein foods.
 * Curated, evidence-backed semantics — separate from structural relationships.
 * Does not modify catalog, runtime indexes, or structural relationship layer.
 *
 * Run: node scripts/map-protein-food-editorial-relationships-02c2.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/protein-food-catalog.json");
const STRUCTURAL_PATH = path.join(RUNTIME_DIR, "protein-food-relationships.json");
const OUTPUT_PATH = path.join(RUNTIME_DIR, "protein-food-editorial-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/editorial-relationship-report.json");
const EDGE_VERSION = "1.0";

const EDITORIAL_RELATIONSHIP_TYPES = [
  "similar_to",
  "substitutes_for",
  "commonly_prepared_as",
  "shares_culinary_role",
];

const SYMMETRIC_TYPES = new Set(["similar_to", "shares_culinary_role"]);

const PREPARATION_IDS = new Set([
  "preparation.barbecue",
  "preparation.bake",
  "preparation.braise",
  "preparation.grill",
  "preparation.pan-seared",
  "preparation.poach",
  "preparation.roast",
  "preparation.smoke",
  "preparation.stir-fry",
]);

/**
 * Curated v1 editorial edges (slug references resolved at map time).
 * @type {Array<{ relationship: string, source: string, target: string, confidence: string, evidence: string }>}
 */
const EDITORIAL_CURATED = [
  // —— Similarity ——
  {
    relationship: "similar_to",
    source: "ribeye",
    target: "striploin",
    confidence: "high",
    evidence: "Both are premium beef steak cuts with comparable grilling applications and eating quality.",
  },
  {
    relationship: "similar_to",
    source: "lamb-loin",
    target: "pork-loin",
    confidence: "high",
    evidence: "Both are lean center-loin roasts used interchangeably for roast or chop preparations.",
  },
  {
    relationship: "similar_to",
    source: "chicken-breast",
    target: "turkey-breast",
    confidence: "high",
    evidence: "Lean poultry breast cuts with similar mild flavor and quick-cooking behavior.",
  },
  {
    relationship: "similar_to",
    source: "salmon-fillet",
    target: "trout-fillet",
    confidence: "high",
    evidence: "Fatty fish fillets commonly prepared with the same pan-sear or oven methods.",
  },
  {
    relationship: "similar_to",
    source: "cod-fillet",
    target: "halibut-fillet",
    confidence: "high",
    evidence: "Mild white fish fillets used in similar baked and pan-fried preparations.",
  },
  {
    relationship: "similar_to",
    source: "flank-steak",
    target: "skirt-steak",
    confidence: "high",
    evidence: "Thin beef cuts from the plate/flank area, commonly marinated and grilled or seared.",
  },
  {
    relationship: "similar_to",
    source: "tenderloin",
    target: "pork-tenderloin",
    confidence: "high",
    evidence: "Very tender center cuts suited to quick high-heat cooking across beef and pork.",
  },
  {
    relationship: "similar_to",
    source: "chuck-roast",
    target: "pork-shoulder",
    confidence: "high",
    evidence: "Collagen-rich braising cuts that become tender with long moist-heat cooking.",
  },
  {
    relationship: "similar_to",
    source: "bacon",
    target: "pancetta",
    confidence: "high",
    evidence: "Cured pork belly products used for rendering fat and savory depth in cooking.",
  },
  {
    relationship: "similar_to",
    source: "shrimp",
    target: "prawn",
    confidence: "high",
    evidence: "Shellfish with comparable size, texture, and sauté or grill applications.",
  },

  // —— Substitution ——
  {
    relationship: "substitutes_for",
    source: "ground-turkey",
    target: "ground-beef",
    confidence: "high",
    evidence: "Commonly substituted in recipes for similar texture with lower fat content.",
  },
  {
    relationship: "substitutes_for",
    source: "ground-chicken",
    target: "ground-beef",
    confidence: "high",
    evidence: "Lean ground poultry commonly used where recipes call for ground beef.",
  },
  {
    relationship: "substitutes_for",
    source: "tempeh",
    target: "ground-beef",
    confidence: "high",
    evidence: "Fermented soy protein crumbled as a plant-based ground meat alternative.",
  },
  {
    relationship: "substitutes_for",
    source: "seitan",
    target: "chicken-breast",
    confidence: "high",
    evidence: "Wheat protein with a firm chew used as a chicken breast alternative in many recipes.",
  },
  {
    relationship: "substitutes_for",
    source: "textured-vegetable-protein",
    target: "ground-beef",
    confidence: "high",
    evidence: "Rehydrated TVP is a standard plant-based substitute for crumbled ground beef.",
  },
  {
    relationship: "substitutes_for",
    source: "mycoprotein-grounds",
    target: "ground-beef",
    confidence: "high",
    evidence: "Mycoprotein crumbles are formulated as a direct ground beef substitute.",
  },
  {
    relationship: "substitutes_for",
    source: "turkey-breast",
    target: "chicken-breast",
    confidence: "high",
    evidence: "Lean poultry breast cuts substituted in sandwiches, salads, and roasting.",
  },

  // —— Preparation affinity ——
  {
    relationship: "commonly_prepared_as",
    source: "brisket",
    target: "preparation.barbecue",
    confidence: "high",
    evidence: "Brisket is a canonical low-and-slow barbecue cut across many culinary traditions.",
  },
  {
    relationship: "commonly_prepared_as",
    source: "salmon-fillet",
    target: "preparation.pan-seared",
    confidence: "high",
    evidence: "Salmon fillets are routinely pan-seared to crisp the skin and keep the center moist.",
  },
  {
    relationship: "commonly_prepared_as",
    source: "tofu-firm",
    target: "preparation.stir-fry",
    confidence: "high",
    evidence: "Firm tofu is a staple stir-fry protein that holds shape over high heat.",
  },
  {
    relationship: "commonly_prepared_as",
    source: "ribeye",
    target: "preparation.grill",
    confidence: "high",
    evidence: "Ribeye is widely prepared on the grill to render marbling and develop crust.",
  },
  {
    relationship: "commonly_prepared_as",
    source: "chicken-breast",
    target: "preparation.roast",
    confidence: "high",
    evidence: "Whole or portioned chicken breast is a standard oven-roast poultry preparation.",
  },
  {
    relationship: "commonly_prepared_as",
    source: "pork-belly",
    target: "preparation.braise",
    confidence: "high",
    evidence: "Pork belly is commonly braised to render fat and tenderize connective tissue.",
  },
  {
    relationship: "commonly_prepared_as",
    source: "chuck-roast",
    target: "preparation.braise",
    confidence: "high",
    evidence: "Chuck roast is a classic pot roast and braise cut for moist-heat cooking.",
  },
  {
    relationship: "commonly_prepared_as",
    source: "whole-chicken",
    target: "preparation.roast",
    confidence: "high",
    evidence: "Whole chicken is a foundational roast preparation across home and restaurant cooking.",
  },
  {
    relationship: "commonly_prepared_as",
    source: "duck-breast",
    target: "preparation.pan-seared",
    confidence: "high",
    evidence: "Duck breast is typically scored and pan-seared to render fat and crisp the skin.",
  },
  {
    relationship: "commonly_prepared_as",
    source: "lamb-leg",
    target: "preparation.roast",
    confidence: "high",
    evidence: "Bone-in or boneless lamb leg is a standard holiday and Sunday roast cut.",
  },
  {
    relationship: "commonly_prepared_as",
    source: "cod-fillet",
    target: "preparation.bake",
    confidence: "high",
    evidence: "Cod fillets are commonly oven-baked as a mild, flaky white fish preparation.",
  },
  {
    relationship: "commonly_prepared_as",
    source: "shrimp",
    target: "preparation.stir-fry",
    confidence: "high",
    evidence: "Shrimp is a common stir-fry protein in many Asian and fusion cuisines.",
  },
  {
    relationship: "commonly_prepared_as",
    source: "bacon",
    target: "preparation.pan-seared",
    confidence: "high",
    evidence: "Bacon strips are routinely pan-seared or skillet-rendered before other uses.",
  },

  // —— Culinary family ——
  {
    relationship: "shares_culinary_role",
    source: "ribeye",
    target: "striploin",
    confidence: "high",
    evidence: "Both serve as premium center-cut steak options on steakhouse and grill menus.",
  },
  {
    relationship: "shares_culinary_role",
    source: "salmon-fillet",
    target: "trout-fillet",
    confidence: "high",
    evidence: "Both function as fatty fish fillet mains in similar menu and home-cook contexts.",
  },
  {
    relationship: "shares_culinary_role",
    source: "chickpeas",
    target: "lentils",
    confidence: "high",
    evidence: "Both are staple legume proteins in soups, stews, salads, and plant-forward cooking.",
  },
  {
    relationship: "shares_culinary_role",
    source: "black-beans",
    target: "kidney-beans",
    confidence: "high",
    evidence: "Both are common stewing beans in chili, rice bowls, and Latin-inspired dishes.",
  },
  {
    relationship: "shares_culinary_role",
    source: "bacon",
    target: "pancetta",
    confidence: "high",
    evidence: "Both provide cured pork fat and savory depth as flavoring or supporting ingredients.",
  },
  {
    relationship: "shares_culinary_role",
    source: "shrimp",
    target: "prawn",
    confidence: "high",
    evidence: "Both fill the same shellfish protein role in appetizers, pastas, and stir-fries.",
  },
  {
    relationship: "shares_culinary_role",
    source: "ground-beef",
    target: "ground-pork",
    confidence: "high",
    evidence: "Both are bulk ground proteins used in meatballs, sauces, and mixed-meat formulations.",
  },
  {
    relationship: "shares_culinary_role",
    source: "chicken-thigh",
    target: "turkey-thigh",
    confidence: "high",
    evidence: "Both are dark-meat poultry cuts suited to roasting, braising, and longer cooking.",
  },
  {
    relationship: "shares_culinary_role",
    source: "tenderloin",
    target: "veal-tenderloin",
    confidence: "high",
    evidence: "Both are ultra-tender center cuts used for quick-cook medallions and fine dining mains.",
  },
  {
    relationship: "shares_culinary_role",
    source: "halibut-fillet",
    target: "sea-bass-fillet",
    confidence: "high",
    evidence: "Both are firm white fish fillets used as premium mild fish entrée options.",
  },
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

function loadInputs() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const index = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-index.json"), "utf8")
  );
  const slugMap = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-slug-map.json"), "utf8")
  );
  const structural = JSON.parse(fs.readFileSync(STRUCTURAL_PATH, "utf8"));
  return { catalog, index, slugMap, structural };
}

function resolveFoodId(slugMap, slug) {
  return slugMap[slug] ?? null;
}

function canonicalPair(source, target) {
  return source.localeCompare(target) <= 0
    ? [source, target]
    : [target, source];
}

export function mapProteinFoodEditorialRelationships({ slugMap, catalog, index }) {
  const foodIds = new Set(Object.values(slugMap));
  const edges = [];
  const seen = new Set();

  for (const entry of EDITORIAL_CURATED) {
    const sourceId = resolveFoodId(slugMap, entry.source);
    if (!sourceId) {
      throw new Error(`Unknown source slug: ${entry.source}`);
    }

    let targetId = entry.target;
    if (entry.relationship === "commonly_prepared_as") {
      if (!PREPARATION_IDS.has(entry.target)) {
        throw new Error(`Unknown preparation id: ${entry.target}`);
      }
    } else {
      targetId = resolveFoodId(slugMap, entry.target);
      if (!targetId) {
        throw new Error(`Unknown target slug: ${entry.target}`);
      }
    }

    let source = sourceId;
    let target = targetId;

    if (SYMMETRIC_TYPES.has(entry.relationship)) {
      [source, target] = canonicalPair(sourceId, targetId);
    }

    const edge = {
      source,
      relationship: entry.relationship,
      target,
      confidence: entry.confidence,
      derived_from: "editorial",
      evidence: entry.evidence,
      version: EDGE_VERSION,
    };

    const key = edgeKey(edge);
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push(edge);
  }

  edges.sort((a, b) => edgeKey(a).localeCompare(edgeKey(b)));

  const typeCounts = Object.fromEntries(
    EDITORIAL_RELATIONSHIP_TYPES.map((type) => [type, 0])
  );
  for (const edge of edges) {
    typeCounts[edge.relationship] = (typeCounts[edge.relationship] ?? 0) + 1;
  }

  const usedTypes = EDITORIAL_RELATIONSHIP_TYPES.filter((type) => typeCounts[type] > 0);

  return {
    meta: {
      phase: "ONTOLOGY-02C.2",
      version: EDGE_VERSION,
      catalog_version: catalog.meta?.catalog_version ?? null,
      layer: "editorial",
      relationship_types: usedTypes,
      edge_count: edges.length,
      inputs: [
        "data/protein-food-catalog.json",
        "data/runtime/protein-food-index.json",
        "data/runtime/protein-food-relationships.json",
      ],
    },
    edges,
    stats: {
      relationship_types: usedTypes.length,
      total_edges: edges.length,
      relationship_type_counts: typeCounts,
    },
    entityIds: foodIds,
  };
}

function validateEditorial(output, structural, entityIds) {
  const errors = [];
  const seen = new Set();
  const structuralKeys = new Set(structural.edges.map(edgeKey));
  let duplicates = 0;
  let missingEntities = 0;
  let conflicts = 0;

  for (const edge of output.edges) {
    const key = edgeKey(edge);
    if (seen.has(key)) {
      duplicates += 1;
      errors.push(`Duplicate editorial edge: ${key}`);
    }
    seen.add(key);

    if (edge.source === edge.target) {
      errors.push(`Self-reference: ${key}`);
    }

    if (!entityIds.has(edge.source)) {
      missingEntities += 1;
      errors.push(`Missing source entity: ${edge.source}`);
    }

    if (edge.relationship === "commonly_prepared_as") {
      if (!PREPARATION_IDS.has(edge.target)) {
        missingEntities += 1;
        errors.push(`Invalid preparation target: ${edge.target}`);
      }
    } else if (!entityIds.has(edge.target)) {
      missingEntities += 1;
      errors.push(`Missing target entity: ${edge.target}`);
    }

    if (structuralKeys.has(key)) {
      conflicts += 1;
      errors.push(`Conflicts with structural relationship: ${key}`);
    }

    if (edge.derived_from !== "editorial") {
      errors.push(`Invalid derived_from on ${key}`);
    }
    if (!edge.evidence || !edge.evidence.trim()) {
      errors.push(`Missing evidence on ${key}`);
    }
    if (!EDITORIAL_RELATIONSHIP_TYPES.includes(edge.relationship)) {
      errors.push(`Unknown relationship type: ${edge.relationship}`);
    }
  }

  return { errors, duplicates, missingEntities, conflicts };
}

function main() {
  const { catalog, index, slugMap, structural } = loadInputs();
  const output = mapProteinFoodEditorialRelationships({ slugMap, catalog, index });
  const validation = validateEditorial(output, structural, output.entityIds);
  const determinismPass =
    serializeRuntime({ meta: output.meta, edges: output.edges }) ===
    serializeRuntime({
      meta: mapProteinFoodEditorialRelationships({ slugMap, catalog, index }).meta,
      edges: mapProteinFoodEditorialRelationships({ slugMap, catalog, index }).edges,
    });

  const overall =
    validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "ONTOLOGY-02C.2",
      overall_result: "FAIL",
      errors: validation.errors,
      metrics: {
        "Editorial relationship types": output.stats.relationship_types,
        "Editorial edges": output.stats.total_edges,
        "Duplicate edges": validation.duplicates,
        "Missing entities": validation.missingEntities,
        Conflicts: validation.conflicts,
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
    phase: "ONTOLOGY-02C.2",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    errors: [],
    output: "data/runtime/protein-food-editorial-relationships.json",
    metrics: {
      "Editorial relationship types": output.stats.relationship_types,
      "Editorial edges": output.stats.total_edges,
      "Duplicate edges": 0,
      "Missing entities": 0,
      Conflicts: 0,
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Editorial relationships: ${OUTPUT_PATH}`);
  console.log(`Report: ${REPORT_PATH}`);
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
