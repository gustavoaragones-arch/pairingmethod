#!/usr/bin/env node
/**
 * FOOD-08E — Wine pairing layer for grain & starch ontology.
 * Curated editorial pairing knowledge — not derived from flavor_profile or usage_intensity.
 * Does not modify catalog, runtime indexes, structural, or editorial layers.
 *
 * Run: node scripts/map-grain-starch-wine-relationships-08e.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-grain-starch-runtime.js";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { listWinemakingTechniqueEntries } from "../lib/taxonomy-winemaking-technique.js";
import { PAIRING_CURATED } from "./grain-starch-wine-seed-08e.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/grain-starch-catalog.json");
const STRUCTURAL_PATH = path.join(RUNTIME_DIR, "grain-starch-relationships.json");
const EDITORIAL_PATH = path.join(RUNTIME_DIR, "grain-starch-editorial-relationships.json");
const OUTPUT_PATH = path.join(RUNTIME_DIR, "grain-starch-wine-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/grain-starch-wine-relationship-report.json");
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
  pairs_with_style: { min: 75, max: 90 },
  also_pairs_with_style: { min: 35, max: 50 },
  pairs_with_descriptor: { min: 20, max: 35 },
  pairs_with_technique: { min: 15, max: 25 },
  total: { min: 145, max: 200 },
};

const PROC_PAIRING_FAMILIES = [
  ["wheat", "wheat-flour", "whole-wheat-flour"],
  ["rice", "rice-flour"],
  ["corn", "cornmeal", "cornstarch"],
  ["oats", "oat-flour"],
  ["barley", "pearl-barley", "barley-flour"],
  ["rye", "rye-flour"],
  ["buckwheat", "buckwheat-flour"],
  ["quinoa", "quinoa-flour"],
  ["amaranth", "amaranth-flour"],
  ["millet", "millet-flour"],
  ["sorghum", "sorghum-flour"],
  ["teff", "teff-flour"],
  ["spelt", "spelt-flour"],
  ["potato-starch", "potato-flour"],
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

function loadGrainStarchInputs() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const indexes = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "grain-starch-indexes.json"), "utf8")
  );
  const editorial = JSON.parse(fs.readFileSync(EDITORIAL_PATH, "utf8"));
  const structural = JSON.parse(fs.readFileSync(STRUCTURAL_PATH, "utf8"));
  return { catalog, slugMap: indexes.by_slug, editorial, structural };
}

function resolveGrainStarchId(slugMap, slug) {
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

function validateProcessingPairingRule(entries) {
  const errors = [];
  const bySlug = Object.fromEntries(
    PROC_PAIRING_FAMILIES.flat().map((slug) => [slug, entries.filter((e) => e.source === slug)])
  );

  for (const family of PROC_PAIRING_FAMILIES) {
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
            `PROC-001: identical pairing profile forbidden between ${a.slug} and ${b.slug}`
          );
        }
      }
    }
  }

  return errors;
}

function validateStarchFunctionalRule(entries) {
  const errors = [];
  const thickenerOnly = new Set([
    "cornstarch",
    "potato-starch",
    "arrowroot-starch",
    "tapioca-starch",
    "wheat-starch",
    "rice-starch",
    "waxy-corn-starch",
    "waxy-rice-starch",
    "glutinous-rice-starch",
    "mung-bean-starch",
    "pea-starch",
    "sago-starch",
    "kudzu-starch",
    "water-chestnut-starch",
    "sweet-potato-starch",
    "taro-starch",
    "sorghum-starch",
    "chestnut-starch",
    "lotus-root-starch",
  ]);

  for (const entry of entries) {
    if (!thickenerOnly.has(entry.source)) continue;
    if (entry.relationship !== "pairs_with_style" && entry.relationship !== "also_pairs_with_style") {
      continue;
    }
    const evidence = entry.evidence.toLowerCase();
    const citesStarch001 =
      evidence.includes("starch-001") ||
      evidence.includes("functional") ||
      evidence.includes("thickening") ||
      evidence.includes("thickener") ||
      evidence.includes("neutral") ||
      evidence.includes("binder") ||
      evidence.includes("proc-001");
    if (!citesStarch001) {
      errors.push(
        `STARCH-001: ${entry.source} style pairing evidence must cite functional/thickening limitation`
      );
    }
  }

  const wheatFlour = entries.filter((e) => e.source === "wheat-flour" && e.relationship.endsWith("_style"));
  for (const entry of wheatFlour) {
    if (
      !entry.evidence.toLowerCase().includes("flour") &&
      !entry.evidence.toLowerCase().includes("dough") &&
      !entry.evidence.toLowerCase().includes("baked") &&
      !entry.evidence.toLowerCase().includes("pastry")
    ) {
      errors.push(`STARCH-001: wheat-flour pairing must cite baked/dough culinary function`);
    }
  }

  const semolina = entries.filter((e) => e.source === "semolina" && e.relationship.endsWith("_style"));
  for (const entry of semolina) {
    if (
      !entry.evidence.toLowerCase().includes("semolina") &&
      !entry.evidence.toLowerCase().includes("durum") &&
      !entry.evidence.toLowerCase().includes("pasta")
    ) {
      errors.push(`STARCH-001: semolina pairing must cite durum/pasta culinary identity`);
    }
  }

  return errors;
}

export function mapGrainStarchWineRelationships({ slugMap, catalog, wine }) {
  const procSeedErrors = validateProcessingPairingRule(PAIRING_CURATED);
  const starchSeedErrors = validateStarchFunctionalRule(PAIRING_CURATED);
  if (procSeedErrors.length || starchSeedErrors.length) {
    throw new Error([...procSeedErrors, ...starchSeedErrors].join("\n"));
  }

  const grainStarchIds = new Set(Object.values(slugMap));
  const edges = [];
  const seen = new Set();

  for (const entry of PAIRING_CURATED) {
    const sourceId = resolveGrainStarchId(slugMap, entry.source);
    if (!sourceId) {
      throw new Error(`Unknown grain or starch slug: ${entry.source}`);
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

  const grainStarchesLinked = new Set(edges.map((e) => e.source));
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
      phase: "FOOD-08E",
      domain: "grain-starch",
      version: EDGE_VERSION,
      catalog_version: catalog.meta?.catalog_version ?? null,
      layer: "wine_pairing",
      pairing_philosophy:
        "Curated editorial pairing knowledge for grains and starches — STARCH-001 pairs by culinary function in the finished dish, not botanical origin or processing history.",
      functional_pairing_rule:
        "STARCH-001: wine pairing follows the ingredient's culinary function — neutral rice base, dough-context flour, durum semolina identity, and no thickening-only starch affinity.",
      processing_ownership_rule:
        "PROC-001: processing-derived canonical entities retain distinct pairing profiles and must not inherit wine relationships from source crops.",
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
        "thickening_inference",
      ],
      inputs: [
        "data/grain-starch-catalog.json",
        "data/runtime/grain-starch-indexes.json",
        "data/runtime/grain-starch-editorial-relationships.json",
        "data/wine-style-catalog.json",
        "data/wine-taxonomy.json",
        "data/winemaking-technique-catalog.json",
        "scripts/grain-starch-wine-seed-08e.js",
      ],
    },
    edges,
    stats: {
      grain_starches_linked: grainStarchesLinked.size,
      wine_styles_linked: stylesLinked.size,
      descriptor_links: descriptorLinks,
      technique_links: techniqueLinks,
      pairing_edges: edges.length,
      relationship_type_counts: typeCounts,
    },
    grainStarchIds,
  };
}

function validatePairing(output, wine, grainStarchIds, structural, editorial) {
  const errors = [];
  const seen = new Set();
  const forbidden = new Set([
    ...structural.edges.map(edgeKey),
    ...editorial.edges.map(edgeKey),
  ]);
  let duplicates = 0;
  let missingGrainStarch = 0;
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

    if (!grainStarchIds.has(edge.source)) {
      missingGrainStarch += 1;
      errors.push(`Missing grain or starch entity: ${edge.source}`);
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
          `Edge count ${output.edges.length} outside FOOD-08E target ${target.min}-${target.max}`
        );
      }
      continue;
    }
    const count = output.stats.relationship_type_counts[type] ?? 0;
    if (count < target.min || count > target.max) {
      errors.push(`${type}: ${count} edges outside FOOD-08E target ${target.min}-${target.max}`);
    }
  }

  return { errors, duplicates, missingGrainStarch, missingWine, pendingReview };
}

function main() {
  const { catalog, slugMap, editorial, structural } = loadGrainStarchInputs();
  const wine = loadWineOntology();
  const output = mapGrainStarchWineRelationships({ slugMap, catalog, wine });
  const validation = validatePairing(
    output,
    wine,
    output.grainStarchIds,
    structural,
    editorial
  );

  const rebuilt = mapGrainStarchWineRelationships({ slugMap, catalog, wine });
  const determinismPass =
    serializeRuntime({ meta: output.meta, edges: output.edges }) ===
    serializeRuntime({ meta: rebuilt.meta, edges: rebuilt.edges });

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-08E",
      domain: "grain-starch",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      metrics: {
        "Grain & starch entities linked": output.stats.grain_starches_linked,
        "Wine styles linked": output.stats.wine_styles_linked,
        "Descriptor links": output.stats.descriptor_links,
        "Technique links": output.stats.technique_links,
        "Pairing edges": output.stats.pairing_edges,
        "Duplicate edges": validation.duplicates,
        "Missing grain or starch entities": validation.missingGrainStarch,
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
    phase: "FOOD-08E",
    domain: "grain-starch",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    validation_errors: [],
    output: "data/runtime/grain-starch-wine-relationships.json",
    metrics: {
      "Grain & starch entities linked": output.stats.grain_starches_linked,
      "Wine styles linked": output.stats.wine_styles_linked,
      "Descriptor links": output.stats.descriptor_links,
      "Technique links": output.stats.technique_links,
      "Pairing edges": output.stats.pairing_edges,
      "Pending review edges": validation.pendingReview,
      "Duplicate edges": 0,
      "Missing grain or starch entities": 0,
      "Missing wine references": 0,
      "Invalid ontology references": 0,
      Determinism: "PASS",
      "Deterministic ordering": "PASS",
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
    pairing_tiers: PAIRING_TIERS,
    functional_pairing_rule: output.meta.functional_pairing_rule,
    processing_ownership_rule: output.meta.processing_ownership_rule,
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
