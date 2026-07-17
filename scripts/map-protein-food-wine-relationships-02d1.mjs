#!/usr/bin/env node
/**
 * ONTOLOGY-02D.1 — Wine pairing knowledge foundation for protein foods.
 * Third independent semantic layer: derived_from = pairing.
 * Does not modify catalog, runtime indexes, structural, or editorial layers.
 *
 * Run: node scripts/map-protein-food-wine-relationships-02d1.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { listWinemakingTechniqueEntries } from "../lib/taxonomy-winemaking-technique.js";
import { listWineRegionEntries } from "../lib/taxonomy-wine-region.js";
import { listWineServingEntries } from "../lib/taxonomy-wine-serving.js";
import { listWineFaultEntries } from "../lib/taxonomy-wine-fault.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/protein-food-catalog.json");
const STRUCTURAL_PATH = path.join(RUNTIME_DIR, "protein-food-relationships.json");
const EDITORIAL_PATH = path.join(RUNTIME_DIR, "protein-food-editorial-relationships.json");
const OUTPUT_PATH = path.join(RUNTIME_DIR, "protein-food-wine-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/wine-pairing-foundation-report.json");
const EDGE_VERSION = "1.0";

const PAIRING_RELATIONSHIP_TYPES = [
  "pairs_with_style",
  "also_pairs_with_style",
  "pairs_with_descriptor",
  "pairs_with_technique",
];

const CONFIDENCE_LEVELS = new Set(["high", "medium"]);

/**
 * Curated v1 wine pairing edges (food slug + wine ontology target slug).
 * @type {Array<{ relationship: string, source: string, target: string, confidence: string, evidence: string }>}
 */
const PAIRING_CURATED = [
  // —— Beef ——
  {
    relationship: "pairs_with_style",
    source: "ribeye",
    target: "cabernet-sauvignon",
    confidence: "high",
    evidence: "Rich marbling and protein fat balance firm tannic structure in full-bodied reds.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "ribeye",
    target: "syrah-shiraz",
    confidence: "high",
    evidence: "Peppery, smoky Syrah complements charred crust and savory depth of grilled steak.",
  },
  {
    relationship: "pairs_with_style",
    source: "brisket",
    target: "syrah-shiraz",
    confidence: "high",
    evidence: "Smoke and spice in slow-cooked brisket align with bold, peppery red wine profiles.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "brisket",
    target: "zinfandel",
    confidence: "high",
    evidence: "Jammy fruit and moderate tannin support barbecue sweetness and rendered fat.",
  },
  {
    relationship: "pairs_with_style",
    source: "tenderloin",
    target: "pinot-noir",
    confidence: "high",
    evidence: "Lean, tender beef benefits from lower tannin and bright acidity in Pinot Noir.",
  },
  {
    relationship: "pairs_with_technique",
    source: "brisket",
    target: "barrel-aging",
    confidence: "high",
    evidence: "Oak-influenced wines echo smoke and spice common in barbecue brisket preparations.",
  },

  // —— Pork ——
  {
    relationship: "pairs_with_style",
    source: "pork-belly",
    target: "riesling",
    confidence: "high",
    evidence: "High fat pork belly is balanced by aromatic acidity and slight sweetness in Riesling.",
  },
  {
    relationship: "pairs_with_style",
    source: "pork-chop",
    target: "pinot-noir",
    confidence: "high",
    evidence: "Moderate-weight pork chop pairs with silky tannin and red fruit in Pinot Noir.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "pork-chop",
    target: "chardonnay",
    confidence: "medium",
    evidence: "Lightly oaked Chardonnay complements mild pork flavor without overpowering texture.",
  },

  // —— Lamb ——
  {
    relationship: "pairs_with_style",
    source: "lamb-rack",
    target: "cabernet-sauvignon",
    confidence: "high",
    evidence: "Gamey lamb fat and herb crust stand up to structured Cabernet tannins.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "lamb-rack",
    target: "syrah-shiraz",
    confidence: "high",
    evidence: "Syrah pepper and smoke notes align with roasted lamb and common herb seasonings.",
  },
  {
    relationship: "pairs_with_descriptor",
    source: "lamb-rack",
    target: "black-pepper",
    confidence: "high",
    evidence: "Lamb's savory character commonly echoes black pepper notes found in Syrah and Cabernet.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "lamb-leg",
    target: "grenache",
    confidence: "medium",
    evidence: "Medium-bodied Grenache offers soft tannin for longer-cooked, milder lamb roasts.",
  },

  // —— Poultry ——
  {
    relationship: "pairs_with_style",
    source: "chicken-breast",
    target: "chardonnay",
    confidence: "high",
    evidence: "Mild, lean poultry pairs with medium-bodied white wine and restrained oak.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "chicken-breast",
    target: "pinot-noir",
    confidence: "medium",
    evidence: "Light red Pinot Noir suits simply prepared chicken without overwhelming delicate texture.",
  },
  {
    relationship: "pairs_with_style",
    source: "chicken-thigh",
    target: "pinot-noir",
    confidence: "high",
    evidence: "Higher fat dark poultry benefits from earthy, moderate-tannin Pinot Noir.",
  },

  // —— Salmon ——
  {
    relationship: "pairs_with_style",
    source: "salmon-fillet",
    target: "pinot-noir",
    confidence: "high",
    evidence: "Fatty salmon texture pairs with low-tannin red wine and bright acidity.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "salmon-fillet",
    target: "chardonnay",
    confidence: "high",
    evidence: "Richer salmon preparations align with fuller-bodied, lightly oaked Chardonnay.",
  },
  {
    relationship: "pairs_with_descriptor",
    source: "salmon-fillet",
    target: "lemon",
    confidence: "high",
    evidence: "Citrus aromatics in white and rosé wines complement salmon's natural richness.",
  },

  // —— Tuna ——
  {
    relationship: "pairs_with_style",
    source: "tuna-steak",
    target: "pinot-noir",
    confidence: "medium",
    evidence: "Seared tuna's meaty texture can carry light red wine with moderate tannin.",
  },
  {
    relationship: "pairs_with_style",
    source: "tuna-loin",
    target: "albarino",
    confidence: "high",
    evidence: "Delicate tuna loin favors high-acidity, minimally oaked coastal whites.",
  },
  {
    relationship: "pairs_with_technique",
    source: "tuna-loin",
    target: "stainless-steel-aging",
    confidence: "high",
    evidence: "Unoaked, stainless-aged whites preserve delicate fish aroma without wood masking.",
  },

  // —— Mushrooms ——
  {
    relationship: "pairs_with_style",
    source: "shiitake",
    target: "pinot-noir",
    confidence: "high",
    evidence: "Earthy mushroom umami pairs with forest-floor notes common in Pinot Noir.",
  },
  {
    relationship: "pairs_with_descriptor",
    source: "shiitake",
    target: "earthy",
    confidence: "high",
    evidence: "Mushroom savoriness aligns with earthy descriptors in Pinot Noir and aged Nebbiolo.",
  },
  {
    relationship: "pairs_with_style",
    source: "portobello",
    target: "syrah-shiraz",
    confidence: "high",
    evidence: "Meaty portobello caps support peppery, medium-plus body Syrah profiles.",
  },

  // —— Tofu ——
  {
    relationship: "pairs_with_style",
    source: "tofu-firm",
    target: "riesling",
    confidence: "high",
    evidence: "Neutral tofu protein absorbs sauce; aromatic Riesling acidity cuts soy and spice.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "tofu-firm",
    target: "gewurztraminer",
    confidence: "medium",
    evidence: "Floral Gewürztraminer complements common ginger-garlic stir-fry aromatics with tofu.",
  },

  // —— Tempeh ——
  {
    relationship: "pairs_with_style",
    source: "tempeh",
    target: "gewurztraminer",
    confidence: "medium",
    evidence: "Fermented, nutty tempeh aligns with aromatic whites and subtle spice notes.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "tempeh",
    target: "pinot-grigio",
    confidence: "medium",
    evidence: "Light, crisp Pinot Grigio suits grilled tempeh without competing with umami.",
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

function loadWineOntology() {
  const taxonomy = loadTaxonomy();
  const descriptorIds = new Set(
    Object.values(taxonomy.nodes)
      .filter((n) => n.type === "descriptor")
      .map((n) => n.slug)
  );
  const styleIds = new Set(listWineStyleEntries().map((s) => s.slug));
  const techniqueIds = new Set(listWinemakingTechniqueEntries().map((t) => t.slug));
  const regionIds = new Set(listWineRegionEntries().map((r) => r.slug));
  const servingIds = new Set(listWineServingEntries().map((s) => s.slug));
  const faultIds = new Set(listWineFaultEntries().map((f) => f.slug));

  return {
    styleIds,
    descriptorIds,
    techniqueIds,
    regionIds,
    servingIds,
    faultIds,
  };
}

function loadFoodInputs() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const index = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-index.json"), "utf8")
  );
  const slugMap = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-slug-map.json"), "utf8")
  );
  const editorial = JSON.parse(fs.readFileSync(EDITORIAL_PATH, "utf8"));
  const structural = JSON.parse(fs.readFileSync(STRUCTURAL_PATH, "utf8"));
  return { catalog, index, slugMap, editorial, structural };
}

function resolveFoodId(slugMap, slug) {
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

export function mapProteinFoodWineRelationships({ slugMap, catalog, index, wine }) {
  const foodIds = new Set(Object.values(slugMap));
  const edges = [];
  const seen = new Set();

  for (const entry of PAIRING_CURATED) {
    const sourceId = resolveFoodId(slugMap, entry.source);
    if (!sourceId) {
      throw new Error(`Unknown food slug: ${entry.source}`);
    }
    if (!validateTarget(entry.relationship, entry.target, wine)) {
      throw new Error(`Unknown wine target: ${entry.target} for ${entry.relationship}`);
    }

    const edge = {
      source: sourceId,
      relationship: entry.relationship,
      target: entry.target,
      confidence: entry.confidence,
      derived_from: "pairing",
      evidence: entry.evidence,
      version: EDGE_VERSION,
    };

    const key = edgeKey(edge);
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push(edge);
  }

  edges.sort((a, b) => edgeKey(a).localeCompare(edgeKey(b)));

  const foodsLinked = new Set(edges.map((e) => e.source));
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
      phase: "ONTOLOGY-02D.1",
      version: EDGE_VERSION,
      catalog_version: catalog.meta?.catalog_version ?? null,
      layer: "pairing",
      relationship_types: PAIRING_RELATIONSHIP_TYPES.filter((t) => typeCounts[t] > 0),
      edge_count: edges.length,
      inputs: [
        "data/protein-food-catalog.json",
        "data/runtime/protein-food-index.json",
        "data/runtime/protein-food-editorial-relationships.json",
        "data/wine-style-catalog.json",
        "data/wine-taxonomy.json",
        "data/winemaking-technique-catalog.json",
        "data/wine-region-catalog.json",
        "data/wine-serving-catalog.json",
        "data/wine-fault-catalog.json",
      ],
    },
    edges,
    stats: {
      foods_linked: foodsLinked.size,
      wine_styles_linked: stylesLinked.size,
      descriptor_links: descriptorLinks,
      technique_links: techniqueLinks,
      pairing_edges: edges.length,
      relationship_type_counts: typeCounts,
    },
    foodIds,
  };
}

function validatePairing(output, wine, foodIds, structural, editorial) {
  const errors = [];
  const seen = new Set();
  const forbidden = new Set([
    ...structural.edges.map(edgeKey),
    ...editorial.edges.map(edgeKey),
  ]);
  let duplicates = 0;

  for (const edge of output.edges) {
    const key = edgeKey(edge);
    if (seen.has(key)) {
      duplicates += 1;
      errors.push(`Duplicate pairing edge: ${key}`);
    }
    seen.add(key);

    if (!foodIds.has(edge.source)) {
      errors.push(`Missing food entity: ${edge.source}`);
    }
    if (!edge.evidence?.trim()) {
      errors.push(`Missing evidence: ${key}`);
    }
    if (!CONFIDENCE_LEVELS.has(edge.confidence)) {
      errors.push(`Invalid confidence: ${key}`);
    }
    if (edge.derived_from !== "pairing") {
      errors.push(`Invalid derived_from: ${key}`);
    }
    if (!validateTarget(edge.relationship, edge.target, wine)) {
      errors.push(`Invalid wine target: ${edge.target}`);
    }
    if (forbidden.has(key)) {
      errors.push(`Conflicts with prior layer: ${key}`);
    }
    if (!PAIRING_RELATIONSHIP_TYPES.includes(edge.relationship)) {
      errors.push(`Unknown relationship: ${edge.relationship}`);
    }
  }

  return { errors, duplicates };
}

function main() {
  const { catalog, index, slugMap, editorial, structural } = loadFoodInputs();
  const wine = loadWineOntology();
  const output = mapProteinFoodWineRelationships({ slugMap, catalog, index, wine });
  const validation = validatePairing(
    output,
    wine,
    output.foodIds,
    structural,
    editorial
  );

  const determinismPass =
    serializeRuntime({ meta: output.meta, edges: output.edges }) ===
    serializeRuntime({
      meta: mapProteinFoodWineRelationships({ slugMap, catalog, index, wine }).meta,
      edges: mapProteinFoodWineRelationships({ slugMap, catalog, index, wine }).edges,
    });

  const overall =
    validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "ONTOLOGY-02D.1",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      metrics: {
        "Foods linked": output.stats.foods_linked,
        "Wine styles linked": output.stats.wine_styles_linked,
        "Descriptor links": output.stats.descriptor_links,
        "Technique links": output.stats.technique_links,
        "Pairing edges": output.stats.pairing_edges,
        "Validation errors": validation.errors.length,
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
    phase: "ONTOLOGY-02D.1",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    validation_errors: [],
    output: "data/runtime/protein-food-wine-relationships.json",
    metrics: {
      "Foods linked": output.stats.foods_linked,
      "Wine styles linked": output.stats.wine_styles_linked,
      "Descriptor links": output.stats.descriptor_links,
      "Technique links": output.stats.technique_links,
      "Pairing edges": output.stats.pairing_edges,
      "Validation errors": 0,
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
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
