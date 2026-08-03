#!/usr/bin/env node
/**
 * FOOD-12C — Compile sweet-flavor catalog into consolidated runtime graph.
 * Read-only compiler: never modifies data/sweet-flavor-catalog.json.
 *
 * Run: node scripts/build-sweet-flavor-runtime-12c.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/sweet-flavor-catalog.json");
const RUNTIME_PATH = path.join(ROOT, "data/runtime/sweet-flavor-runtime.json");
const REPORT_PATH = path.join(ROOT, "reports/sweet-flavor-runtime-report.json");

const EDGE_VERSION = "1.0";

const VOCAB_FIELDS = ["culinary_group", "usage_intensity"];

const VOCAB = {
  culinary_group: new Set([
    "sugars",
    "syrups",
    "honey_bee_products",
    "natural_sweeteners",
    "alternative_sweeteners",
    "cocoa_chocolate_ingredients",
  ]),
  usage_intensity: new Set(["primary", "accent", "luxury"]),
};

const RESERVED_PROFILE_FIELDS = ["flavor_profile", "texture_profile", "aroma_profile"];

export const RUNTIME_STABILITY_LEVELS = {
  level_1_structural: [
    "belongs_to_group",
    "belongs_to_category",
    "group_contains",
    "category_contains",
  ],
  level_2_intrinsic_similarity: ["shares_usage_intensity", "shares_scientific_name"],
  level_3_editorial: [
    "similar_to",
    "substitutes_for",
    "commonly_served_with",
    "similar_sweet_flavors",
  ],
};

const HIERARCHY_RELATIONSHIPS = RUNTIME_STABILITY_LEVELS.level_1_structural;
const METADATA_RELATIONSHIPS = RUNTIME_STABILITY_LEVELS.level_2_intrinsic_similarity;
const ALL_RELATIONSHIP_TYPES = [...HIERARCHY_RELATIONSHIPS, ...METADATA_RELATIONSHIPS];

const METADATA_FIELDS = {
  shares_usage_intensity: "usage_intensity",
  shares_scientific_name: "scientific_name",
};

export function sortKeysDeep(value) {
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

export function serializeRuntime(data) {
  return `${JSON.stringify(sortKeysDeep(data), null, 2)}\n`;
}

function writeJson(filePath, data) {
  const text = serializeRuntime(data);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
  return text;
}

function requireAuditPass() {
  const result = spawnSync("node", ["scripts/catalog-audit-sweet-flavor-12b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Runtime build blocked: catalog audit did not pass.\n${err}`);
  }
}

export function fieldValue(entity, field) {
  if (field === "origin_context") return entity.origin_context ?? "";
  return entity[field];
}

function normalizeAlias(value) {
  return value.trim().toLowerCase();
}

function sweetFlavorRef(entity) {
  return {
    id: entity.id,
    slug: entity.slug,
    display_name: entity.display_name,
    parent_group: entity.parent_group,
    parent_category: entity.parent_category,
    scientific_name: entity.scientific_name,
    culinary_group: entity.culinary_group,
    usage_intensity: entity.usage_intensity,
    aliases: [...(entity.aliases ?? [])].sort(),
    common_names: [...(entity.common_names ?? [])].sort(),
    origin_context: entity.origin_context ?? "",
    catalog_version: entity.catalog_version,
    food_ontology_version: entity.food_ontology_version,
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

function groupEntitiesByField(entities, field) {
  const buckets = {};
  for (const entity of entities) {
    const value = entity[field] ?? "";
    if (value === "" || value === "none") continue;
    if (!buckets[value]) buckets[value] = [];
    buckets[value].push(entity.id);
  }
  return buckets;
}

function buildVocabularyIndex(sweetFlavors) {
  const index = Object.fromEntries(VOCAB_FIELDS.map((f) => [f, {}]));
  for (const entity of sweetFlavors) {
    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(entity, field);
      const key = val ?? "";
      if (!index[field][key]) index[field][key] = [];
      index[field][key].push(entity.id);
    }
  }
  for (const field of VOCAB_FIELDS) {
    for (const key of Object.keys(index[field])) {
      index[field][key].sort();
    }
  }
  return index;
}

function buildAliasIndex(sweetFlavors) {
  const byAlias = {};
  for (const entity of sweetFlavors) {
    const aliasKeys = new Set();
    for (const alias of entity.aliases ?? []) {
      aliasKeys.add(normalizeAlias(alias));
    }
    for (const name of entity.common_names ?? []) {
      aliasKeys.add(normalizeAlias(name));
    }
    for (const key of aliasKeys) {
      if (!key) continue;
      if (!byAlias[key]) byAlias[key] = [];
      if (!byAlias[key].includes(entity.id)) byAlias[key].push(entity.id);
    }
  }
  for (const key of Object.keys(byAlias)) {
    byAlias[key].sort();
  }
  return byAlias;
}

function buildNamespaceLookup(categories, groups, sweetFlavors) {
  const byNamespace = {
    "food.sweet-flavor": categories.map((c) => c.id).sort(),
  };
  for (const group of groups) {
    byNamespace[group.id] = sweetFlavors
      .filter((h) => h.parent_group === group.slug)
      .map((h) => h.id)
      .sort();
  }
  return byNamespace;
}

function mapRelationships({ categories, groups, byId }) {
  const edges = [];
  const seen = new Set();
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const groupBySlug = Object.fromEntries(groups.map((g) => [g.slug, g]));
  const entities = Object.values(byId);

  for (const entity of entities) {
    const group = groupBySlug[entity.parent_group];
    if (!group) continue;

    addEdge(edges, seen, makeEdge(entity.id, "belongs_to_group", group.id, "structural"));

    const category = categoryBySlug[group.parent_category];
    if (category) {
      addEdge(edges, seen, makeEdge(entity.id, "belongs_to_category", category.id, "structural"));
    }
  }

  for (const group of groups) {
    const category = categoryBySlug[group.parent_category];
    if (category) {
      addEdge(edges, seen, makeEdge(group.id, "belongs_to_category", category.id, "structural"));
      addEdge(edges, seen, makeEdge(category.id, "category_contains", group.id, "structural"));
    }
    for (const entityId of group.sweet_flavor_ids) {
      addEdge(edges, seen, makeEdge(group.id, "group_contains", entityId, "structural"));
    }
  }

  for (const [relationship, field] of Object.entries(METADATA_FIELDS)) {
    const buckets = groupEntitiesByField(entities, field);
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

  const level1Count = edges.filter((e) => e.stability_level === "structural").length;
  const level2Count = edges.filter((e) => e.stability_level === "intrinsic_similarity").length;

  return {
    meta: {
      phase: "FOOD-12C",
      domain: "sweet-flavor",
      version: EDGE_VERSION,
      runtime_stability_levels: RUNTIME_STABILITY_LEVELS,
      relationship_types: ALL_RELATIONSHIP_TYPES.filter((type) => relationshipTypeCounts[type] > 0),
      edge_count: edges.length,
      level_1_structural_edges: level1Count,
      level_2_intrinsic_similarity_edges: level2Count,
      level_3_editorial_edges: 0,
    },
    edges,
    stats: {
      relationship_types: ALL_RELATIONSHIP_TYPES.filter((type) => relationshipTypeCounts[type] > 0)
        .length,
      total_edges: edges.length,
      level_1_structural_edges: level1Count,
      level_2_intrinsic_similarity_edges: level2Count,
      relationship_type_counts: relationshipTypeCounts,
    },
  };
}

export function compileSweetFlavorRuntime(catalog) {
  const sweetFlavors = [...(catalog.sweet_flavors ?? [])].sort((a, b) => a.id.localeCompare(b.id));
  const groups = [...catalog.groups].sort((a, b) => a.slug.localeCompare(b.slug));
  const categories = [...catalog.categories].sort((a, b) => a.slug.localeCompare(b.slug));

  const byId = {};
  const bySlug = {};
  const byUsageIntensity = {};
  const byGroup = {};
  const byDisplayName = {};
  const byScientificName = {};

  for (const entity of sweetFlavors) {
    byId[entity.id] = sweetFlavorRef(entity);
    bySlug[entity.slug] = entity.id;

    if (!byUsageIntensity[entity.usage_intensity]) byUsageIntensity[entity.usage_intensity] = [];
    byUsageIntensity[entity.usage_intensity].push(entity.id);

    if (!byGroup[entity.parent_group]) byGroup[entity.parent_group] = [];
    byGroup[entity.parent_group].push(entity.id);

    const nameKey = entity.display_name.trim().toLowerCase();
    if (!byDisplayName[nameKey]) byDisplayName[nameKey] = [];
    byDisplayName[nameKey].push(entity.id);

    if (entity.scientific_name) {
      if (!byScientificName[entity.scientific_name]) byScientificName[entity.scientific_name] = [];
      byScientificName[entity.scientific_name].push(entity.id);
    }
  }

  for (const key of Object.keys(byUsageIntensity)) byUsageIntensity[key].sort();
  for (const key of Object.keys(byGroup)) byGroup[key].sort();
  for (const key of Object.keys(byDisplayName)) byDisplayName[key].sort();
  for (const key of Object.keys(byScientificName)) byScientificName[key].sort();

  const categoryToGroups = {};
  const groupToCategory = {};
  const groupToSweetFlavors = {};
  const sweetFlavorToGroup = {};

  for (const cat of categories) {
    categoryToGroups[cat.slug] = [...cat.child_slugs].sort();
  }

  for (const group of groups) {
    groupToCategory[group.slug] = group.parent_category;
    const childIds = group.child_slugs
      .map((slug) => bySlug[slug])
      .filter(Boolean)
      .sort();
    groupToSweetFlavors[group.slug] = childIds;
  }

  for (const entity of sweetFlavors) {
    sweetFlavorToGroup[entity.slug] = entity.parent_group;
  }

  const categoriesOut = categories.map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    group_slugs: [...cat.child_slugs].sort(),
  }));

  const groupsOut = groups.map((group) => ({
    id: group.id,
    slug: group.slug,
    name: group.name,
    parent_category: group.parent_category,
    culinary_group: group.culinary_group,
    sweet_flavor_slugs: [...group.child_slugs].sort(),
    sweet_flavor_ids: group.child_slugs.map((s) => bySlug[s]).sort(),
  }));

  const vocabularyIndex = buildVocabularyIndex(sweetFlavors);
  const byNamespace = buildNamespaceLookup(categories, groups, sweetFlavors);
  const byAlias = buildAliasIndex(sweetFlavors);

  const relationships = mapRelationships({
    categories: categoriesOut,
    groups: groupsOut,
    byId,
  });

  return {
    meta: {
      domain: "sweet-flavor",
      source: "data/sweet-flavor-catalog.json",
      catalog_version: catalog.meta.catalog_version,
      food_ontology_version: catalog.meta.food_ontology_version,
      entity_count: sweetFlavors.length,
      group_count: groups.length,
      category_count: categories.length,
      bootstrapped_at: catalog.meta.catalog_version,
      phase: "FOOD-12C",
      runtime_projection_principle:
        "Runtime artifacts are projections, never sources of truth — catalog is authoritative",
      runtime_stability_levels: {
        level_1_structural: "hierarchy only — belongs_to_*, group_contains, category_contains",
        level_2_intrinsic_similarity: "shares_usage_intensity, shares_scientific_name",
        level_3_editorial: "reserved FOOD-12D — not generated in runtime compile",
      },
    },
    categories: categoriesOut,
    groups: groupsOut,
    hierarchy: {
      category_to_groups: categoryToGroups,
      group_to_category: groupToCategory,
      group_to_sweet_flavors: groupToSweetFlavors,
      sweet_flavor_to_group: sweetFlavorToGroup,
    },
    indexes: {
      by_id: byId,
      by_slug: bySlug,
      by_namespace: byNamespace,
      by_display_name: byDisplayName,
      by_scientific_name: byScientificName,
      by_usage_intensity: byUsageIntensity,
      by_group: byGroup,
      by_alias: byAlias,
      vocabulary: vocabularyIndex,
    },
    relationships,
  };
}

function validateForBuild(catalog) {
  const errors = [];
  const ids = new Set();
  const slugs = new Set();
  const groupSlugs = new Set(catalog.groups.map((g) => g.slug));
  const sweetFlavors = catalog.sweet_flavors ?? [];

  for (const entity of sweetFlavors) {
    if (ids.has(entity.id)) errors.push(`Duplicate id: ${entity.id}`);
    ids.add(entity.id);
    if (slugs.has(entity.slug)) errors.push(`Duplicate slug: ${entity.slug}`);
    slugs.add(entity.slug);
    if (!groupSlugs.has(entity.parent_group)) {
      errors.push(`Broken hierarchy: ${entity.slug} parent_group ${entity.parent_group}`);
    }
    if (entity.parent_category !== "sweet-flavor") {
      errors.push(`${entity.slug}: parent_category must be sweet-flavor`);
    }

    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(entity, field);
      if (val === undefined || val === null) {
        errors.push(`${entity.slug}: missing ${field}`);
      } else if (VOCAB[field] && !VOCAB[field].has(val)) {
        errors.push(`${entity.slug}: invalid ${field} "${val}"`);
      }
    }

    if (!entity.scientific_name || !entity.scientific_name.includes(" ")) {
      errors.push(`${entity.slug}: invalid or missing scientific_name`);
    }

    for (const field of RESERVED_PROFILE_FIELDS) {
      if (!Array.isArray(entity[field]) || entity[field].length > 0) {
        errors.push(`${entity.slug}: ${field} must be empty array in FOOD-12C`);
      }
    }
  }

  return errors;
}

function main() {
  requireAuditPass();

  const catalogMtimeBefore = fs.statSync(CATALOG_PATH).mtimeMs;
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));

  const buildErrors = validateForBuild(catalog);
  if (buildErrors.length > 0) {
    const report = {
      phase: "FOOD-12C",
      domain: "sweet-flavor",
      overall_result: "FAIL",
      build_errors: buildErrors,
      metrics: { "Build errors": buildErrors.length },
    };
    writeJson(REPORT_PATH, report);
    console.error(buildErrors.join("\n"));
    process.exit(1);
  }

  const runtime = compileSweetFlavorRuntime(catalog);
  writeJson(RUNTIME_PATH, runtime);

  const catalogMtimeAfter = fs.statSync(CATALOG_PATH).mtimeMs;
  if (catalogMtimeBefore !== catalogMtimeAfter) {
    throw new Error("Runtime build modified catalog file timestamp — aborting");
  }

  const report = {
    phase: "FOOD-12C",
    domain: "sweet-flavor",
    catalog_version: catalog.meta.catalog_version,
    overall_result: "PASS",
    build_errors: [],
    output: "data/runtime/sweet-flavor-runtime.json",
    metrics: {
      "Categories indexed": runtime.categories.length,
      "Groups indexed": runtime.groups.length,
      "Sweet flavor entities indexed": runtime.meta.entity_count,
      "Structural edges": runtime.relationships.stats.level_1_structural_edges,
      "Intrinsic edges": runtime.relationships.stats.level_2_intrinsic_similarity_edges,
      "Editorial edges": 0,
      "Total edges": runtime.relationships.stats.total_edges,
      "Alias index keys": Object.keys(runtime.indexes.by_alias).length,
      "Build errors": 0,
    },
    relationship_type_counts: runtime.relationships.stats.relationship_type_counts,
    runtime_stability_levels: RUNTIME_STABILITY_LEVELS,
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Runtime: ${RUNTIME_PATH}`);
  console.log(`Report: ${REPORT_PATH}`);
}

export {
  VOCAB_FIELDS,
  VOCAB,
  RESERVED_PROFILE_FIELDS,
  ALL_RELATIONSHIP_TYPES,
  RUNTIME_PATH,
  CATALOG_PATH,
};

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
