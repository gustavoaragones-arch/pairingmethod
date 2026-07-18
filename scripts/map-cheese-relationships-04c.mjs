#!/usr/bin/env node
/**
 * FOOD-04C.3 — Structural relationship mapper for cheese ontology.
 * Declarative enrichment only: reads validated runtime indexes, emits relationship edges.
 * Does not modify catalog or runtime indexes.
 *
 * Run: node scripts/map-cheese-relationships-04c.mjs
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { ARTIFACTS, serializeRuntime } from "./bootstrap-cheese-catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const RELATIONSHIPS_PATH = path.join(RUNTIME_DIR, "cheese-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/relationship-mapper-report.json");
const EDGE_VERSION = "1.0";

const HIERARCHY_RELATIONSHIPS = [
  "belongs_to_group",
  "belongs_to_category",
  "group_contains",
  "category_contains",
];

const METADATA_RELATIONSHIPS = [
  "shares_milk_source",
  "shares_texture",
  "shares_rind_type",
  "shares_moisture_class",
  "shares_aging_class",
  "shares_protected_status",
];

const ALL_RELATIONSHIP_TYPES = [...HIERARCHY_RELATIONSHIPS, ...METADATA_RELATIONSHIPS];

const METADATA_FIELDS = {
  shares_milk_source: "milk_source",
  shares_texture: "texture",
  shares_rind_type: "rind_type",
  shares_moisture_class: "moisture_class",
  shares_aging_class: "aging_class",
  shares_protected_status: "protected_status",
};

const SKIP_EMPTY_FOR = new Set([]);

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
  const result = spawnSync("node", ["scripts/validate-runtime-cheese-04c.mjs"], {
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
    bootstrap: loaded["cheese-bootstrap.json"],
    categories: loaded["cheese-categories.json"],
    groups: loaded["cheese-groups.json"],
    indexes: loaded["cheese-indexes.json"],
    byId: loaded["cheese-indexes.json"].by_id,
  };
}

function makeEdge(source, relationship, target) {
  return {
    source,
    relationship,
    target,
    confidence: "high",
    derived_from: "catalog",
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
      addEdge(edges, seen, makeEdge(sorted[i], relationship, sorted[j]));
    }
  }
}

function groupCheesesByField(cheeses, field, skipEmpty) {
  const buckets = {};
  for (const cheese of cheeses) {
    const value = cheese[field] ?? "";
    if (skipEmpty && (value === "" || value === "none")) continue;
    if (!buckets[value]) buckets[value] = [];
    buckets[value].push(cheese.id);
  }
  return buckets;
}

export function mapCheeseRelationships(runtime) {
  const { bootstrap, categories, groups, byId } = runtime;
  const edges = [];
  const seen = new Set();

  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const groupBySlug = Object.fromEntries(groups.map((g) => [g.slug, g]));
  const cheeses = Object.values(byId);

  for (const cheese of cheeses) {
    const group = groupBySlug[cheese.parent_group];
    if (!group) continue;

    addEdge(edges, seen, makeEdge(cheese.id, "belongs_to_group", group.id));

    const category = categoryBySlug[group.parent_category];
    if (category) {
      addEdge(edges, seen, makeEdge(cheese.id, "belongs_to_category", category.id));
    }
  }

  for (const group of groups) {
    const category = categoryBySlug[group.parent_category];
    if (category) {
      addEdge(edges, seen, makeEdge(group.id, "belongs_to_category", category.id));
      addEdge(edges, seen, makeEdge(category.id, "category_contains", group.id));
    }
    for (const cheeseId of group.cheese_ids) {
      addEdge(edges, seen, makeEdge(group.id, "group_contains", cheeseId));
    }
  }

  for (const [relationship, field] of Object.entries(METADATA_FIELDS)) {
    const skipEmpty = SKIP_EMPTY_FOR.has(relationship);
    const buckets = groupCheesesByField(cheeses, field, skipEmpty);
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

  return {
    meta: {
      phase: "FOOD-04C.3",
      domain: "cheese",
      version: EDGE_VERSION,
      catalog_version: bootstrap.meta?.catalog_version ?? null,
      source_artifacts: ARTIFACTS.map((name) => `data/runtime/${name}`),
      relationship_types: usedTypes,
      edge_count: edges.length,
    },
    edges,
    stats: {
      relationship_types: usedTypes.length,
      total_edges: edges.length,
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

    if (edge.source === edge.target) {
      errors.push(`Self-reference: ${key}`);
    }
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
    if (!ALL_RELATIONSHIP_TYPES.includes(edge.relationship)) {
      errors.push(`Unknown relationship type: ${edge.relationship}`);
    }
  }

  return { errors, duplicates, missingEntities };
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
  const entityIds = buildEntityIdSet(runtime);
  const output = mapCheeseRelationships(runtime);

  const validation = validateRelationships(output, entityIds);
  const determinismPass = serializeRuntime(output) === serializeRuntime(mapCheeseRelationships(runtime));

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-04C.3",
      domain: "cheese",
      overall_result: "FAIL",
      errors: validation.errors,
      metrics: {
        "Relationship types": output.stats.relationship_types,
        "Total edges": output.stats.total_edges,
        "Duplicate edges": validation.duplicates,
        "Missing entities": validation.missingEntities,
        Determinism: determinismPass ? "PASS" : "FAIL",
        "Overall result": "FAIL",
      },
    };
    writeJson(REPORT_PATH, report);
    console.error(validation.errors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(RELATIONSHIPS_PATH, output);

  const report = {
    phase: "FOOD-04C.3",
    domain: "cheese",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    errors: [],
    output: "data/runtime/cheese-relationships.json",
    metrics: {
      "Relationship types": output.stats.relationship_types,
      "Total edges": output.stats.total_edges,
      "Duplicate edges": 0,
      "Missing entities": 0,
      Determinism: "PASS",
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
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
