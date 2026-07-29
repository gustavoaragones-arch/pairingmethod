#!/usr/bin/env node
/**
 * FOOD-11E — Wine pairing layer for legume ontology.
 * Curated editorial pairing knowledge — not derived from flavor_profile or usage_intensity.
 * Does not modify catalog, runtime graph, structural, or editorial layers.
 *
 * Run: node scripts/map-legume-wine-relationships-11e.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./build-legume-runtime-11c.js";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { listWinemakingTechniqueEntries } from "../lib/taxonomy-winemaking-technique.js";
import { PAIRING_CURATED } from "./legume-wine-seed-11e.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_PATH = path.join(ROOT, "data/runtime/legume-runtime.json");
const EDITORIAL_PATH = path.join(ROOT, "data/runtime/legume-editorial-relationships.json");
const OUTPUT_PATH = path.join(ROOT, "data/runtime/legume-wine-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/legume-wine-relationship-report.json");
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
  pairs_with_style: { min: 75, max: 75 },
  also_pairs_with_style: { min: 50, max: 60 },
  pairs_with_descriptor: { min: 30, max: 40 },
  pairs_with_technique: { min: 25, max: 35 },
  total: { min: 180, max: 210 },
};

const LEGUME002_PAIRING_FAMILIES = [
  ["chickpea", "chickpea-flour"],
  ["soybean", "tofu", "tempeh", "miso", "soy-flour", "natto", "textured-vegetable-protein", "soy-curls", "fermented-black-bean"],
  ["black-bean", "black-bean-flour"],
  ["fava-bean", "fava-bean-flour"],
  ["green-lentil", "lentil-flour"],
  ["red-lentil", "red-lentil-flour"],
  ["green-pea", "pea-flour"],
  ["mung-bean", "mung-bean-flour"],
  ["white-bean", "white-bean-flour"],
  ["lupin-bean", "lupin-flour"],
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

function loadLegumeInputs() {
  const runtime = JSON.parse(fs.readFileSync(RUNTIME_PATH, "utf8"));
  const editorial = JSON.parse(fs.readFileSync(EDITORIAL_PATH, "utf8"));
  return {
    runtime,
    slugMap: runtime.indexes.by_slug,
    structural: runtime.relationships,
    editorial,
    catalogVersion: runtime.meta.catalog_version,
    entityCount: runtime.meta.entity_count,
  };
}

function resolveLegumeId(slugMap, slug) {
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

function validateLegume002PairingRule(entries) {
  const errors = [];
  const bySlug = Object.fromEntries(
    LEGUME002_PAIRING_FAMILIES.flat().map((slug) => [slug, entries.filter((e) => e.source === slug)])
  );

  for (const family of LEGUME002_PAIRING_FAMILIES) {
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
            `LEGUME-002: identical pairing profile forbidden between ${a.slug} and ${b.slug}`
          );
        }
      }
    }
  }

  return errors;
}

function validateLegumePair001Rule(entries) {
  const errors = [];
  const roleChecks = [
    { slug: "chickpea-flour", terms: ["baking", "besan", "flatbread", "batter"] },
    { slug: "tofu", terms: ["neutral", "protein", "curd", "soy"] },
    { slug: "tempeh", terms: ["fermented", "savory", "grill", "cake"] },
    { slug: "miso", terms: ["fermented", "umami", "paste", "soup"] },
    { slug: "natto", terms: ["fermented", "specialty", "breakfast", "soybean"] },
    { slug: "chickpea", terms: ["stew", "chickpea", "mediterranean", "salad"] },
    { slug: "soybean", terms: ["soybean", "edamame", "whole", "asian"] },
  ];

  for (const entry of entries) {
    if (!entry.evidence.toLowerCase().includes("legume-pair-001")) {
      errors.push(
        `LEGUME-PAIR-001: ${entry.source} pairing evidence must cite LEGUME-PAIR-001 culinary function rule`
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
          `LEGUME-PAIR-001: ${slug} pairing must cite ${terms.join("/")} culinary function`
        );
      }
    }
  }

  return errors;
}

function validateLegume001Grouping(slugMap, runtime) {
  const errors = [];
  const assignments = [
    { slug: "kidney-bean", group: "beans" },
    { slug: "green-pea", group: "peas" },
    { slug: "chickpea", group: "chickpeas" },
    { slug: "soybean", group: "other-legumes" },
  ];
  const byId = runtime.indexes.by_id;
  for (const { slug, group } of assignments) {
    const id = slugMap[slug];
    if (!id) {
      errors.push(`LEGUME-001: runtime missing canonical entity ${slug}`);
      continue;
    }
    const ref = byId[id];
    if (ref && ref.parent_group !== group) {
      errors.push(`LEGUME-001: ${slug} must remain in ${group}`);
    }
  }
  return errors;
}

export function mapLegumeWineRelationships({ slugMap, runtime, wine }) {
  const legume002SeedErrors = validateLegume002PairingRule(PAIRING_CURATED);
  const legumePair001SeedErrors = validateLegumePair001Rule(PAIRING_CURATED);
  const legume001Errors = validateLegume001Grouping(slugMap, runtime);
  if (legume002SeedErrors.length || legumePair001SeedErrors.length || legume001Errors.length) {
    throw new Error(
      [...legume002SeedErrors, ...legumePair001SeedErrors, ...legume001Errors].join("\n")
    );
  }

  const legumeIds = new Set(Object.values(slugMap));
  const edges = [];
  const seen = new Set();

  for (const entry of PAIRING_CURATED) {
    const sourceId = resolveLegumeId(slugMap, entry.source);
    if (!sourceId) {
      throw new Error(`Unknown legume slug: ${entry.source}`);
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

  const legumesLinked = new Set(edges.map((e) => e.source));
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
      phase: "FOOD-11E",
      domain: "legume",
      version: EDGE_VERSION,
      catalog_version: runtime.meta?.catalog_version ?? null,
      layer: "wine_pairing",
      pairing_philosophy:
        "Curated editorial pairing knowledge for legumes — LEGUME-PAIR-001 pairs by culinary function, not botanical classification alone.",
      culinary_role_pairing_rule:
        "LEGUME-PAIR-001: wine pairing follows the ingredient's independent culinary role — chickpea flour for baking, tofu for neutral protein, tempeh for fermented savory, miso for fermented umami, natto for fermented specialty applications.",
      legume002_ownership_rule:
        "LEGUME-002: processed canonical entities retain distinct pairing profiles and must not inherit wine relationships from whole legume forms.",
      legume001_classification_rule:
        "LEGUME-001: culinary group assignment remains authoritative in pairing semantics — soybean in Other Legumes, chickpea in Chickpeas, peanut excluded from Legume domain.",
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
        "substitutions",
      ],
      inputs: [
        "data/legume-catalog.json",
        "data/runtime/legume-runtime.json",
        "data/runtime/legume-editorial-relationships.json",
        "data/wine-style-catalog.json",
        "data/wine-taxonomy.json",
        "data/winemaking-technique-catalog.json",
        "scripts/legume-wine-seed-11e.js",
      ],
    },
    edges,
    stats: {
      legumes_linked: legumesLinked.size,
      wine_styles_linked: stylesLinked.size,
      descriptor_links: descriptorLinks,
      technique_links: techniqueLinks,
      pairing_edges: edges.length,
      relationship_type_counts: typeCounts,
    },
    legumeIds,
  };
}

function validatePairing(output, wine, legumeIds, structural, editorial, entityCount) {
  const errors = [];
  const seen = new Set();
  const forbidden = new Set([
    ...structural.edges.map(edgeKey),
    ...editorial.edges.map(edgeKey),
  ]);
  let duplicates = 0;
  let missingLegume = 0;
  let missingWine = 0;
  let pendingReview = 0;
  let missingPrimary = 0;

  if (output.stats.legumes_linked !== entityCount) {
    errors.push(
      `Catalog coverage: ${output.stats.legumes_linked}/${entityCount} entities linked`
    );
  }

  const primaryBySource = new Map();
  for (const edge of output.edges) {
    if (edge.relationship === "pairs_with_style") {
      primaryBySource.set(edge.source, edge);
    }
  }
  for (const id of legumeIds) {
    if (!primaryBySource.has(id)) {
      missingPrimary += 1;
      errors.push(`Missing primary pairs_with_style for entity ${id}`);
    }
  }

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

    if (!legumeIds.has(edge.source)) {
      missingLegume += 1;
      errors.push(`Missing legume entity: ${edge.source}`);
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
          `Edge count ${output.edges.length} outside FOOD-11E target ${target.min}-${target.max}`
        );
      }
      continue;
    }
    const count = output.stats.relationship_type_counts[type] ?? 0;
    if (count < target.min || count > target.max) {
      errors.push(`${type}: ${count} edges outside FOOD-11E target ${target.min}-${target.max}`);
    }
  }

  return { errors, duplicates, missingLegume, missingWine, pendingReview, missingPrimary };
}

function main() {
  const { slugMap, runtime, structural, editorial, entityCount } = loadLegumeInputs();
  const wine = loadWineOntology();
  const output = mapLegumeWineRelationships({ slugMap, runtime, wine });
  const validation = validatePairing(
    output,
    wine,
    output.legumeIds,
    structural,
    editorial,
    entityCount
  );

  const rebuilt = mapLegumeWineRelationships({ slugMap, runtime, wine });
  const determinismPass =
    serializeRuntime({ meta: output.meta, edges: output.edges }) ===
    serializeRuntime({ meta: rebuilt.meta, edges: rebuilt.edges });

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-11E",
      domain: "legume",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      metrics: {
        "Legume entities linked": output.stats.legumes_linked,
        "Wine styles linked": output.stats.wine_styles_linked,
        "Descriptor links": output.stats.descriptor_links,
        "Technique links": output.stats.technique_links,
        "Pairing edges": output.stats.pairing_edges,
        "Duplicate edges": validation.duplicates,
        "Missing legume entities": validation.missingLegume,
        "Missing wine references": validation.missingWine,
        "Missing primary pairings": validation.missingPrimary,
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
    phase: "FOOD-11E",
    domain: "legume",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    validation_errors: [],
    output: "data/runtime/legume-wine-relationships.json",
    metrics: {
      "Legume entities linked": output.stats.legumes_linked,
      "Wine styles linked": output.stats.wine_styles_linked,
      "Descriptor links": output.stats.descriptor_links,
      "Technique links": output.stats.technique_links,
      "Pairing edges": output.stats.pairing_edges,
      "Pending review edges": validation.pendingReview,
      "Duplicate edges": 0,
      "Missing legume entities": 0,
      "Missing wine references": 0,
      "Missing primary pairings": 0,
      "Invalid ontology references": 0,
      Determinism: "PASS",
      "Deterministic ordering": "PASS",
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
    pairing_tiers: PAIRING_TIERS,
    culinary_role_pairing_rule: output.meta.culinary_role_pairing_rule,
    legume002_ownership_rule: output.meta.legume002_ownership_rule,
    legume001_classification_rule: output.meta.legume001_classification_rule,
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
