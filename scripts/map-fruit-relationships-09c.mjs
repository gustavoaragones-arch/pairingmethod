#!/usr/bin/env node
/**
 * FOOD-09C.3 — Structural relationship mapper for fruit ontology.
 * Level 1 (structural) + Level 2 (intrinsic similarity) only — no editorial edges.
 *
 * Run: node scripts/map-fruit-relationships-09c.mjs
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { ARTIFACTS, serializeRuntime } from "./bootstrap-fruit-runtime.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const RELATIONSHIPS_PATH = path.join(RUNTIME_DIR, "fruit-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/fruit-relationship-mapper-report.json");
const EDGE_VERSION = "1.0";

const RUNTIME_STABILITY_LEVELS = {
  level_1_structural: [
    "belongs_to_group",
    "belongs_to_category",
    "group_contains",
    "category_contains",
  ],
  level_2_intrinsic_similarity: ["shares_usage_intensity", "shares_scientific_name"],
  level_3_editorial: ["similar_to", "substitutes_for", "commonly_served_with"],
};

const HIERARCHY_RELATIONSHIPS = RUNTIME_STABILITY_LEVELS.level_1_structural;
const METADATA_RELATIONSHIPS = RUNTIME_STABILITY_LEVELS.level_2_intrinsic_similarity;
const ALL_RELATIONSHIP_TYPES = [...HIERARCHY_RELATIONSHIPS, ...METADATA_RELATIONSHIPS];

const METADATA_FIELDS = {
  shares_usage_intensity: "usage_intensity",
  shares_scientific_name: "scientific_name",
};

const FORBIDDEN_EDITORIAL_TYPES = new Set(RUNTIME_STABILITY_LEVELS.level_3_editorial);

const FRUIT001_SEPARATED_PAIRS = [
  ["grape", "raisin"],
  ["plum", "prune"],
  ["coconut", "desiccated-coconut"],
  ["coconut", "coconut-milk"],
  ["desiccated-coconut", "coconut-milk"],
];

const CROSS_DOMAIN_FORBIDDEN_SLUGS = ["tomato", "pumpkin", "rhubarb", "olive"];

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

function requireRuntimeValidation() {
  const result = spawnSync("node", ["scripts/validate-runtime-fruit-09c.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Runtime validation failed";
    throw new Error(`Relationship mapper blocked: runtime validator did not pass.\n${err}`);
  }
}

function loadRuntime() {
  const loaded = {};
  for (const name of ARTIFACTS) {
    loaded[name] = JSON.parse(fs.readFileSync(path.join(RUNTIME_DIR, name), "utf8"));
  }
  return {
    bootstrap: loaded["fruit-bootstrap.json"],
    categories: loaded["fruit-categories.json"],
    groups: loaded["fruit-groups.json"],
    indexes: loaded["fruit-indexes.json"],
    byId: loaded["fruit-indexes.json"].by_id,
  };
}

function makeEdge(source, relationship, target, stabilityLevel) {
  return {
    source,
    relationship,
    target,
    confidence: "high",
    derived_from: "catalog",
    stability_level: stabilityLevel,
    version: EDGE_VERSION,
  };
}

function edgeKey(edge) {
  return `${edge.source}\t${edge.relationship}\t${edge.target}`;
}

function addEdge(edges, seen, edge) {
  if (edge.source === edge.target) return false;
  const key = edgeKey(edge);
  if (seen.has(key)) return false;
  seen.add(key);
  edges.push(edge);
  return true;
}

function addPairwiseShares(edges, seen, relationship, ids) {
  const sorted = [...ids].sort();
  for (let i = 0; i < sorted.length; i += 1) {
    for (let j = i + 1; j < sorted.length; j += 1) {
      addEdge(
        edges,
        seen,
        makeEdge(sorted[i], relationship, sorted[j], "intrinsic_similarity")
      );
    }
  }
}

function groupFruitsByField(fruites, field) {
  const buckets = {};
  for (const fruit of fruites) {
    const value = fruit[field] ?? "";
    if (value === "" || value === "none") continue;
    if (!buckets[value]) buckets[value] = [];
    buckets[value].push(fruit.id);
  }
  return buckets;
}

export function mapFruitRelationships(runtime) {
  const { bootstrap, categories, groups, byId } = runtime;
  const edges = [];
  const seen = new Set();

  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const groupBySlug = Object.fromEntries(groups.map((g) => [g.slug, g]));
  const fruites = Object.values(byId);

  for (const fruit of fruites) {
    const group = groupBySlug[fruit.parent_group];
    if (!group) continue;

    addEdge(edges, seen, makeEdge(fruit.id, "belongs_to_group", group.id, "structural"));

    const category = categoryBySlug[group.parent_category];
    if (category) {
      addEdge(edges, seen, makeEdge(fruit.id, "belongs_to_category", category.id, "structural"));
    }
  }

  for (const group of groups) {
    const category = categoryBySlug[group.parent_category];
    if (category) {
      addEdge(edges, seen, makeEdge(group.id, "belongs_to_category", category.id, "structural"));
      addEdge(edges, seen, makeEdge(category.id, "category_contains", group.id, "structural"));
    }
    for (const fruitId of group.fruit_ids) {
      addEdge(edges, seen, makeEdge(group.id, "group_contains", fruitId, "structural"));
    }
  }

  for (const [relationship, field] of Object.entries(METADATA_FIELDS)) {
    const buckets = groupFruitsByField(fruites, field);
    for (const ids of Object.values(buckets)) {
      if (ids.length >= 2) addPairwiseShares(edges, seen, relationship, ids);
    }
  }

  edges.sort((a, b) => edgeKey(a).localeCompare(edgeKey(b)));

  const relationshipTypeCounts = Object.fromEntries(
    ALL_RELATIONSHIP_TYPES.map((type) => [type, 0])
  );
  for (const edge of edges) {
    relationshipTypeCounts[edge.relationship] = (relationshipTypeCounts[edge.relationship] ?? 0) + 1;
  }

  const usedTypes = ALL_RELATIONSHIP_TYPES.filter((type) => relationshipTypeCounts[type] > 0);
  const level1Count = edges.filter((e) => e.stability_level === "structural").length;
  const level2Count = edges.filter((e) => e.stability_level === "intrinsic_similarity").length;

  return {
    meta: {
      phase: "FOOD-09C.3",
      domain: "fruit",
      version: EDGE_VERSION,
      catalog_version: bootstrap.meta?.catalog_version ?? null,
      source_artifacts: ARTIFACTS.map((name) => `data/runtime/${name}`),
      runtime_stability_levels: RUNTIME_STABILITY_LEVELS,
      relationship_types: usedTypes,
      edge_count: edges.length,
      level_1_structural_edges: level1Count,
      level_2_intrinsic_similarity_edges: level2Count,
      level_3_editorial_edges: 0,
    },
    edges,
    stats: {
      relationship_types: usedTypes.length,
      total_edges: edges.length,
      level_1_structural_edges: level1Count,
      level_2_intrinsic_similarity_edges: level2Count,
      relationship_type_counts: relationshipTypeCounts,
    },
  };
}

function validateRelationships(output, entityIds) {
  const errors = [];
  const seen = new Set();
  let duplicates = 0;
  let missingEntities = 0;

  for (const edge of output.edges) {
    const key = edgeKey(edge);
    if (seen.has(key)) {
      duplicates += 1;
      errors.push(`Duplicate edge: ${key}`);
    }
    seen.add(key);

    if (edge.source === edge.target) errors.push(`Self-reference: ${key}`);
    if (!entityIds.has(edge.source)) {
      missingEntities += 1;
      errors.push(`Missing source entity: ${edge.source}`);
    }
    if (!entityIds.has(edge.target)) {
      missingEntities += 1;
      errors.push(`Missing target entity: ${edge.target}`);
    }
    if (edge.confidence !== "high" || edge.derived_from !== "catalog" || edge.version !== EDGE_VERSION) {
      errors.push(`Invalid edge metadata: ${key}`);
    }
    if (FORBIDDEN_EDITORIAL_TYPES.has(edge.relationship)) {
      errors.push(`Editorial relationship forbidden in FOOD-09C: ${edge.relationship}`);
    }
    if (!ALL_RELATIONSHIP_TYPES.includes(edge.relationship)) {
      errors.push(`Unknown relationship type: ${edge.relationship}`);
    }
    if (!["structural", "intrinsic_similarity"].includes(edge.stability_level)) {
      errors.push(`Invalid stability_level on edge: ${key}`);
    }
  }

  return { errors, duplicates, missingEntities };
}

function validateFruit001OwnershipRuntime(output, byId, bySlug) {
  const errors = [];

  for (const slug of CROSS_DOMAIN_FORBIDDEN_SLUGS) {
    if (bySlug[slug]) {
      errors.push(`Cross-domain: forbidden runtime entity slug ${slug}`);
    }
  }

  if (!bySlug["avocado"]) {
    errors.push("Cross-domain: runtime missing avocado canonical entity");
  } else {
    const avocado = byId[bySlug["avocado"]];
    if (avocado && avocado.parent_group !== "tropical-fruits") {
      errors.push("Cross-domain: avocado must be in tropical-fruits");
    }
  }

  for (const [slugA, slugB] of FRUIT001_SEPARATED_PAIRS) {
    const idA = bySlug[slugA];
    const idB = bySlug[slugB];
    if (!idA) errors.push(`FRUIT-001: runtime missing entity slug ${slugA}`);
    if (!idB) errors.push(`FRUIT-001: runtime missing entity slug ${slugB}`);
    if (idA && idB) {
      if (idA === idB) {
        errors.push(`FRUIT-001: runtime collapsed ${slugA} and ${slugB} to one canonical ID`);
      }
      if (!byId[idA] || !byId[idB]) {
        errors.push(`FRUIT-001: runtime by_id missing separated pair ${slugA}/${slugB}`);
      }
    }
  }

  for (const edge of output.edges) {
    if (edge.source === edge.target) {
      errors.push(`FRUIT-001: self-referential edge ${edge.relationship} on ${edge.source}`);
    }
  }

  return errors;
}

function buildEntityIdSet(runtime) {
  const ids = new Set();
  for (const cat of runtime.categories) ids.add(cat.id);
  for (const group of runtime.groups) ids.add(group.id);
  for (const id of Object.keys(runtime.byId)) ids.add(id);
  return ids;
}

function main() {
  requireRuntimeValidation();

  const runtime = loadRuntime();
  runtime.indexes = {
    by_slug: JSON.parse(
      fs.readFileSync(path.join(RUNTIME_DIR, "fruit-indexes.json"), "utf8")
    ).by_slug,
  };
  const entityIds = buildEntityIdSet(runtime);
  const output = mapFruitRelationships(runtime);

  const validation = validateRelationships(output, entityIds);
  const fruit001Errors = validateFruit001OwnershipRuntime(
    output,
    runtime.byId,
    runtime.indexes.by_slug
  );
  const allErrors = [...validation.errors, ...fruit001Errors];
  const determinismPass =
    serializeRuntime(output) === serializeRuntime(mapFruitRelationships(runtime));

  const overall = allErrors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-09C.3",
      domain: "fruit",
      overall_result: "FAIL",
      errors: allErrors,
      metrics: {
        "Relationship types": output.stats.relationship_types,
        "Total edges": output.stats.total_edges,
        "Level 1 structural edges": output.stats.level_1_structural_edges,
        "Level 2 intrinsic similarity edges": output.stats.level_2_intrinsic_similarity_edges,
        "Duplicate edges": validation.duplicates,
        "Missing entities": validation.missingEntities,
        "FRUIT-001 violations": fruit001Errors.length,
        Determinism: determinismPass ? "PASS" : "FAIL",
        "Overall result": "FAIL",
      },
    };
    writeJson(REPORT_PATH, report);
    console.error(allErrors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(RELATIONSHIPS_PATH, output);

  const report = {
    phase: "FOOD-09C.3",
    domain: "fruit",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    errors: [],
    output: "data/runtime/fruit-relationships.json",
    metrics: {
      "Relationship types": output.stats.relationship_types,
      "Total edges": output.stats.total_edges,
      "Level 1 structural edges": output.stats.level_1_structural_edges,
      "Level 2 intrinsic similarity edges": output.stats.level_2_intrinsic_similarity_edges,
      "Level 3 editorial edges": 0,
      "Duplicate edges": 0,
      "Missing entities": 0,
      "FRUIT-001 violations": 0,
      Determinism: "PASS",
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
    runtime_stability_levels: RUNTIME_STABILITY_LEVELS,
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Relationships: ${RELATIONSHIPS_PATH}`);
  console.log(`Report: ${REPORT_PATH}`);
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
