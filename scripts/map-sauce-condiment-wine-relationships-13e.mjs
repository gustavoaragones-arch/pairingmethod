#!/usr/bin/env node
/**
 * FOOD-13E — Wine pairing layer for sauce-condiment ontology.
 * Independent Level 4 graph — does not modify catalog, runtime, or editorial layers.
 *
 * Run: node scripts/map-sauce-condiment-wine-relationships-13e.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./build-sauce-condiment-runtime-13c.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { PAIRING_CURATED } from "./sauce-condiment-wine-seed-13e.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_PATH = path.join(ROOT, "data/runtime/sauce-condiment-runtime.json");
const EDITORIAL_PATH = path.join(ROOT, "data/runtime/sauce-condiment-editorial-relationships.json");
const OUTPUT_PATH = path.join(ROOT, "data/runtime/sauce-condiment-wine-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/sauce-condiment-wine-report.json");
const EDGE_VERSION = "1.0";

const PAIRING_RELATIONSHIP_TYPES = [
  "pairs_with_wine",
  "classic_pairing",
  "avoid_with_wine",
  "contrasting_pairing",
  "regional_pairing",
];

const VALID_CONFIDENCE = new Set(["high", "medium", "low"]);
const VALID_PAIRING_STRENGTH = new Set(["excellent", "good", "moderate", "caution"]);
const VALID_PAIRING_METHOD = new Set([
  "contrast",
  "complement",
  "bridge",
  "cut",
  "regional",
  "classic",
  "avoid",
]);
const VALID_EDITORIAL_REVIEW = new Set(["approved", "pending"]);

const TYPE_COUNT_TARGETS = {
  pairs_with_wine: { min: 90, max: 90 },
  classic_pairing: { min: 40, max: 55 },
  contrasting_pairing: { min: 25, max: 35 },
  regional_pairing: { min: 15, max: 25 },
  avoid_with_wine: { min: 8, max: 15 },
  total: { min: 180, max: 220 },
};

const SAUCE001_FORBIDDEN_PAIRING_FAMILIES = [
  ["bechamel", "sauce-mornay"],
  ["veloute", "sauce-mornay"],
  ["espagnole", "demi-glace"],
  ["tomato-mother-sauce", "marinara-sauce"],
];

const GROUP_SLUGS = [
  "mother-sauces",
  "table-sauces",
  "condiments",
  "fermented-sauces-pastes",
  "oil-based-sauces-dressings",
  "savory-spreads-pastes",
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
  const styleIds = new Set(listWineStyleEntries().map((s) => s.slug ?? s.id));
  return { styleIds };
}

function loadSauceCondimentInputs() {
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

function resolveSauceCondimentId(slugMap, slug) {
  return slugMap[slug] ?? null;
}

function validateWineTarget(target, wine) {
  return wine.styleIds.has(target);
}

function pairingSignature(entries) {
  return entries
    .map((entry) => `${entry.relationship}\t${entry.target}`)
    .sort()
    .join("\n");
}

function validateSauce001PairingRule(entries) {
  const errors = [];
  const bySlug = Object.fromEntries(
    SAUCE001_FORBIDDEN_PAIRING_FAMILIES.flat().map((slug) => [
      slug,
      entries.filter((e) => e.source === slug),
    ])
  );

  for (const family of SAUCE001_FORBIDDEN_PAIRING_FAMILIES) {
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
            `SAUCE-001: identical pairing profile forbidden between ${a.slug} and ${b.slug}`
          );
        }
      }
    }
  }
  return errors;
}

function validateSaucePair001Rule(entries) {
  const errors = [];
  for (const entry of entries) {
    if (!entry.evidence.toLowerCase().includes("sauce-pair-001")) {
      errors.push(
        `SAUCE-PAIR-001: ${entry.source} pairing evidence must cite SAUCE-PAIR-001 culinary function rule`
      );
    }
  }
  return errors;
}

export function mapSauceCondimentWineRelationships({ slugMap, runtime, wine }) {
  const sauce001Errors = validateSauce001PairingRule(PAIRING_CURATED);
  const saucePair001Errors = validateSaucePair001Rule(PAIRING_CURATED);
  if (sauce001Errors.length || saucePair001Errors.length) {
    throw new Error([...sauce001Errors, ...saucePair001Errors].join("\n"));
  }

  const sauceCondimentIds = new Set(Object.values(slugMap));
  const edges = [];
  const seen = new Set();
  const groupCoverage = Object.fromEntries(GROUP_SLUGS.map((g) => [g, new Set()]));

  for (const entry of PAIRING_CURATED) {
    const sourceId = resolveSauceCondimentId(slugMap, entry.source);
    if (!sourceId) {
      throw new Error(`Unknown sauce-condiment slug: ${entry.source}`);
    }
    if (!validateWineTarget(entry.target, wine)) {
      throw new Error(`Unknown wine ontology ID: ${entry.target} for ${entry.source}`);
    }

    const ref = runtime.indexes.by_id[sourceId];
    if (ref?.parent_group && groupCoverage[ref.parent_group]) {
      groupCoverage[ref.parent_group].add(sourceId);
    }

    const edge = {
      source: sourceId,
      relationship: entry.relationship,
      target: entry.target,
      confidence: entry.confidence,
      pairing_strength: entry.pairing_strength,
      pairing_method: entry.pairing_method,
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

  const entitiesLinked = new Set(edges.map((e) => e.source));
  const winesLinked = new Set(edges.map((e) => e.target));

  const typeCounts = Object.fromEntries(
    PAIRING_RELATIONSHIP_TYPES.map((type) => [type, 0])
  );
  for (const edge of edges) {
    typeCounts[edge.relationship] = (typeCounts[edge.relationship] ?? 0) + 1;
  }

  const groupCoverageCounts = Object.fromEntries(
    GROUP_SLUGS.map((group) => [group, groupCoverage[group]?.size ?? 0])
  );

  return {
    meta: {
      phase: "FOOD-13E",
      domain: "sauce-condiment",
      version: EDGE_VERSION,
      catalog_version: runtime.meta?.catalog_version ?? null,
      layer: "wine_pairing",
      pairing_philosophy:
        "Curated editorial wine pairing knowledge for sauces and condiments — SAUCE-PAIR-001 pairs by culinary function in finished dish context.",
      governance_rules: {
        WINE001:
          "Wine relationships may never modify or imply structural taxonomy — pairing layer is independent.",
        WINE002: "Pairings reference canonical wine ontology IDs (wine style catalog) only.",
        WINE003: "Pairings are directional from food entity to wine entity.",
        WINE004:
          "Multiple wines permitted per food entity with independent confidence and pairing method.",
        WINE005: "No transitive inference — food-wine edges do not imply food-food relationships.",
        SAUCE001:
          "Mother sauces and direct classical derivatives retain distinct pairing profiles.",
        SAUCE002:
          "Cross-domain composition references use canonical IDs — pairing does not duplicate ingredient metadata.",
        SAUCE_PAIR001:
          "Pair by culinary function — acidity, fat, fermentation, emulsification, umami, richness — not raw ingredient identity.",
      },
      relationship_types: PAIRING_RELATIONSHIP_TYPES.filter((t) => typeCounts[t] > 0),
      edge_count: edges.length,
      group_coverage: groupCoverageCounts,
      scope_exclusions: [
        "recipes",
        "finished_dishes",
        "meal_composition",
        "multi_ingredient_reasoning",
        "preparation_algorithms",
        "runtime_structural_edges",
        "editorial_relationships",
        "transitive_inference",
        "popularity_rankings",
      ],
      inputs: [
        "data/sauce-condiment-catalog.json",
        "data/runtime/sauce-condiment-runtime.json",
        "data/runtime/sauce-condiment-editorial-relationships.json",
        "data/wine-style-catalog.json",
        "scripts/sauce-condiment-wine-seed-13e.js",
      ],
    },
    edges,
    stats: {
      sauce_condiments_linked: entitiesLinked.size,
      wine_styles_linked: winesLinked.size,
      pairing_edges: edges.length,
      relationship_type_counts: typeCounts,
      group_coverage: groupCoverageCounts,
      confidence_distribution: Object.fromEntries(
        [...VALID_CONFIDENCE].map((level) => [
          level,
          edges.filter((e) => e.confidence === level).length,
        ])
      ),
    },
    sauceCondimentIds,
  };
}

function validatePairing(output, wine, sauceCondimentIds, structural, editorial, entityCount) {
  const errors = [];
  const seen = new Set();
  const forbidden = new Set([
    ...structural.edges.map(edgeKey),
    ...editorial.edges.map(edgeKey),
  ]);
  let duplicates = 0;
  let missingEntity = 0;
  let missingWine = 0;
  let pendingReview = 0;
  let missingPrimary = 0;
  let schemaViolations = 0;

  if (output.stats.sauce_condiments_linked !== entityCount) {
    errors.push(
      `Catalog coverage: ${output.stats.sauce_condiments_linked}/${entityCount} entities linked`
    );
  }

  const primaryBySource = new Map();
  for (const edge of output.edges) {
    if (edge.relationship === "pairs_with_wine") {
      primaryBySource.set(edge.source, edge);
    }
  }
  for (const id of sauceCondimentIds) {
    if (!primaryBySource.has(id)) {
      missingPrimary += 1;
      errors.push(`Missing primary pairs_with_wine for entity ${id}`);
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

    if (!sauceCondimentIds.has(edge.source)) {
      missingEntity += 1;
      errors.push(`Missing sauce-condiment entity: ${edge.source}`);
    }
    if (!edge.evidence?.trim()) {
      schemaViolations += 1;
      errors.push(`Missing evidence: ${key}`);
    }
    if (!VALID_CONFIDENCE.has(edge.confidence)) {
      schemaViolations += 1;
      errors.push(`Invalid confidence: ${key}`);
    }
    if (!VALID_PAIRING_STRENGTH.has(edge.pairing_strength)) {
      schemaViolations += 1;
      errors.push(`Invalid pairing_strength: ${key}`);
    }
    if (!VALID_PAIRING_METHOD.has(edge.pairing_method)) {
      schemaViolations += 1;
      errors.push(`Invalid pairing_method: ${key}`);
    }
    if (edge.derived_from !== "editorial") {
      schemaViolations += 1;
      errors.push(`Invalid derived_from: ${key}`);
    }
    if (edge.stability_level !== "wine_pairing") {
      schemaViolations += 1;
      errors.push(`Invalid stability_level: ${key}`);
    }
    if (!VALID_EDITORIAL_REVIEW.has(edge.editorial_review)) {
      schemaViolations += 1;
      errors.push(`Invalid editorial_review: ${key}`);
    }
    if (edge.editorial_review === "pending") {
      pendingReview += 1;
    }
    if (!validateWineTarget(edge.target, wine)) {
      missingWine += 1;
      errors.push(`Invalid wine ontology reference: ${edge.target}`);
    }
    if (forbidden.has(key)) {
      errors.push(`Conflicts with prior layer: ${key}`);
    }
    if (!PAIRING_RELATIONSHIP_TYPES.includes(edge.relationship)) {
      errors.push(`Unsupported relationship: ${edge.relationship}`);
    }
    if (edge.target.startsWith("food.")) {
      errors.push(`WINE-002: target must be wine ontology ID, not food ID: ${edge.target}`);
    }
  }

  for (const [type, target] of Object.entries(TYPE_COUNT_TARGETS)) {
    if (type === "total") {
      if (output.edges.length < target.min || output.edges.length > target.max) {
        errors.push(
          `Edge count ${output.edges.length} outside FOOD-13E target ${target.min}-${target.max}`
        );
      }
      continue;
    }
    const count = output.stats.relationship_type_counts[type] ?? 0;
    if (count < target.min || count > target.max) {
      errors.push(`${type}: ${count} edges outside FOOD-13E target ${target.min}-${target.max}`);
    }
  }

  return {
    errors,
    duplicates,
    missingEntity,
    missingWine,
    pendingReview,
    missingPrimary,
    schemaViolations,
  };
}

function main() {
  const { slugMap, runtime, structural, editorial, entityCount } = loadSauceCondimentInputs();
  const wine = loadWineOntology();
  const output = mapSauceCondimentWineRelationships({ slugMap, runtime, wine });
  const validation = validatePairing(
    output,
    wine,
    output.sauceCondimentIds,
    structural,
    editorial,
    entityCount
  );

  const rebuilt = mapSauceCondimentWineRelationships({ slugMap, runtime, wine });
  const determinismPass =
    serializeRuntime({ meta: output.meta, edges: output.edges }) ===
    serializeRuntime({ meta: rebuilt.meta, edges: rebuilt.edges });

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-13E",
      domain: "sauce-condiment",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      metrics: {
        "Sauce & condiment entities linked": output.stats.sauce_condiments_linked,
        "Wine styles linked": output.stats.wine_styles_linked,
        "Pairing edges": output.stats.pairing_edges,
        "Duplicate edges": validation.duplicates,
        "Missing entities": validation.missingEntity,
        "Missing wine references": validation.missingWine,
        "Missing primary pairings": validation.missingPrimary,
        "Schema violations": validation.schemaViolations,
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
    phase: "FOOD-13E",
    domain: "sauce-condiment",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    validation_errors: [],
    output: "data/runtime/sauce-condiment-wine-relationships.json",
    metrics: {
      "Sauce & condiment entities linked": output.stats.sauce_condiments_linked,
      "Wine styles linked": output.stats.wine_styles_linked,
      "Pairing edges": output.stats.pairing_edges,
      "Pending review edges": validation.pendingReview,
      "Duplicate edges": 0,
      "Missing entities": 0,
      "Missing wine references": 0,
      "Missing primary pairings": 0,
      "Schema violations": 0,
      "Orphan entities": 0,
      Determinism: "PASS",
      "Deterministic ordering": "PASS",
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
    group_coverage: output.stats.group_coverage,
    confidence_distribution: output.stats.confidence_distribution,
    governance_rules: output.meta.governance_rules,
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
