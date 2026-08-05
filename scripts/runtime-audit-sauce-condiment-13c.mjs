#!/usr/bin/env node
/**
 * FOOD-13C — Runtime audit for consolidated sauce-condiment runtime graph.
 * Structural verification only: no catalog writes, no repairs, no editorial edges.
 *
 * Run: node scripts/runtime-audit-sauce-condiment-13c.mjs
 * Output: reports/sauce-condiment-runtime-report.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  VOCAB_FIELDS,
  VOCAB,
  fieldValue,
  serializeRuntime,
  compileSauceCondimentRuntime,
  ALL_RELATIONSHIP_TYPES,
  RUNTIME_STABILITY_LEVELS,
  RUNTIME_PATH,
  CATALOG_PATH,
} from "./build-sauce-condiment-runtime-13c.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORT_PATH = path.join(ROOT, "reports/sauce-condiment-runtime-report.json");

const FORBIDDEN_EDITORIAL_TYPES = new Set(RUNTIME_STABILITY_LEVELS.level_3_editorial);

const CANONICAL_BLOCKED_SLUGS = [
  "garlic-butter-sauce",
  "homemade-burger-sauce",
  "spicy-mayo-with-sriracha",
  "house-dressing",
  "brand-ketchup",
];

const SAUCE001_REQUIRED = [
  { slug: "mayonnaise", parent_group: "mother-sauces" },
  { slug: "hollandaise", parent_group: "mother-sauces" },
  { slug: "soy-sauce", parent_group: "fermented-sauces-pastes" },
  { slug: "worcestershire-sauce", parent_group: "table-sauces" },
  { slug: "dijon-mustard", parent_group: "condiments" },
  { slug: "tomato-ketchup", parent_group: "table-sauces" },
];

const FOOD12_REQUIRED = [
  { slug: "vanilla-extract", parent_group: "condiments" },
  { slug: "almond-extract", parent_group: "condiments" },
  { slug: "orange-blossom-water", parent_group: "condiments" },
  { slug: "rose-water", parent_group: "condiments" },
  { slug: "caramel-sauce", parent_group: "table-sauces" },
  { slug: "chocolate-syrup", parent_group: "table-sauces" },
];

const CROSS_DOMAIN_FORBIDDEN_SLUGS = [
  "miso",
  "natto",
  "hummus",
  "tahini",
  "peanut-butter",
  "garam-masala",
  "curry-powder",
  "mustard-seed",
  "tomato",
  "garlic",
  "cane-sugar",
  "honey",
];

const LEGUME_GROUP_FORBIDDEN = ["miso", "natto", "hummus"];

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

function writeReport(report) {
  const text = `${JSON.stringify(sortKeysDeep(report), null, 2)}\n`;
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, text, "utf8");
}

function loadRuntime() {
  if (!fs.existsSync(RUNTIME_PATH)) {
    throw new Error("Missing runtime artifact: data/runtime/sauce-condiment-runtime.json");
  }
  return JSON.parse(fs.readFileSync(RUNTIME_PATH, "utf8"));
}

function buildEntityIdSet(runtime) {
  const ids = new Set();
  for (const cat of runtime.categories) ids.add(cat.id);
  for (const group of runtime.groups) ids.add(group.id);
  for (const id of Object.keys(runtime.indexes.by_id)) ids.add(id);
  return ids;
}

function validateIdentity({ byId, bySlug, errors, checks }) {
  let passed = 0;
  const ids = Object.keys(byId);
  const slugs = Object.keys(bySlug);

  if (ids.length !== new Set(ids).size) errors.push("Identity: duplicate ontology IDs in by_id");
  else passed += 1;

  if (slugs.length !== new Set(slugs).size) errors.push("Identity: duplicate slugs in by_slug");
  else passed += 1;

  for (const id of ids) {
    const ref = byId[id];
    if (ref.id !== id) errors.push(`Identity: by_id entry ${id} has mismatched id field ${ref.id}`);
    if (!bySlug[ref.slug]) errors.push(`Identity: by_id entry ${id} slug ${ref.slug} missing from by_slug`);
    else if (bySlug[ref.slug] !== id) {
      errors.push(`Identity: by_slug ${ref.slug} points to ${bySlug[ref.slug]}, expected ${id}`);
    }
  }
  if (!errors.some((e) => e.startsWith("Identity: by_id entry"))) passed += 1;

  checks.identity = passed;
  return passed;
}

function validateHierarchy({ hierarchy, categories, groups, bySlug, byId, errors, checks }) {
  let passed = 0;
  const groupSlugs = new Set(groups.map((g) => g.slug));
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const { category_to_groups, group_to_category, group_to_sauce_condiments, sauce_condiment_to_group } =
    hierarchy;

  for (const cat of categories) {
    for (const groupSlug of cat.group_slugs) {
      if (!groupSlugs.has(groupSlug)) {
        errors.push(`Hierarchy: category ${cat.slug} references missing group ${groupSlug}`);
      }
    }
    const indexed = category_to_groups[cat.slug] ?? [];
    if (JSON.stringify([...indexed].sort()) !== JSON.stringify([...cat.group_slugs].sort())) {
      errors.push(`Hierarchy: category ${cat.slug} group_slugs mismatch with hierarchy index`);
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: category"))) passed += 1;

  for (const group of groups) {
    for (const entitySlug of group.sauce_condiment_slugs) {
      if (!bySlug[entitySlug]) {
        errors.push(`Hierarchy: group ${group.slug} references missing entity slug ${entitySlug}`);
      }
    }
    const expectedIds = group.sauce_condiment_slugs.map((s) => bySlug[s]).filter(Boolean).sort();
    if (JSON.stringify(group.sauce_condiment_ids) !== JSON.stringify(expectedIds)) {
      errors.push(`Hierarchy: group ${group.slug} sauce_condiment_ids mismatch sauce_condiment_slugs`);
    }
    const indexedEntities = group_to_sauce_condiments[group.slug] ?? [];
    if (JSON.stringify(indexedEntities) !== JSON.stringify(expectedIds)) {
      errors.push(`Hierarchy: group ${group.slug} hierarchy entity list mismatch`);
    }
    if (group_to_category[group.slug] !== group.parent_category) {
      errors.push(`Hierarchy: group ${group.slug} parent_category mismatch in hierarchy`);
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: group"))) passed += 1;

  for (const [entitySlug, parentGroup] of Object.entries(sauce_condiment_to_group)) {
    if (!bySlug[entitySlug]) {
      errors.push(`Hierarchy: sauce_condiment_to_group references unknown slug ${entitySlug}`);
      continue;
    }
    const ref = byId[bySlug[entitySlug]];
    if (ref.parent_group !== parentGroup) {
      errors.push(
        `Hierarchy: entity ${entitySlug} parent_group ${ref.parent_group} != index ${parentGroup}`
      );
    }
    const group = groups.find((g) => g.slug === parentGroup);
    if (group && !group.sauce_condiment_slugs.includes(entitySlug)) {
      errors.push(
        `Hierarchy: reciprocal failure — ${entitySlug} not in group ${parentGroup} sauce_condiment_slugs`
      );
    }
  }
  if (
    !errors.some(
      (e) => e.startsWith("Hierarchy: entity") || e.startsWith("Hierarchy: reciprocal")
    )
  ) {
    passed += 1;
  }

  for (const [catSlug, groupList] of Object.entries(category_to_groups)) {
    if (!categorySlugs.has(catSlug)) {
      errors.push(`Hierarchy: hierarchy category ${catSlug} not in categories artifact`);
    }
    for (const g of groupList) {
      if (group_to_category[g] !== catSlug) {
        errors.push(`Hierarchy: group ${g} parent ${group_to_category[g]} != category ${catSlug}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: hierarchy category"))) passed += 1;

  checks.hierarchy = passed;
  return passed;
}

function validateUsageIntensity({ byUsageIntensity, byId, errors, checks }) {
  let passed = 0;

  for (const [intensity, ids] of Object.entries(byUsageIntensity)) {
    for (const id of ids) {
      if (!byId[id]) errors.push(`Usage intensity: ${intensity} references missing entity ${id}`);
      else if (byId[id].usage_intensity !== intensity) {
        errors.push(
          `Usage intensity: ${id} indexed under ${intensity} but entity usage_intensity is ${byId[id].usage_intensity}`
        );
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Usage intensity:") && e.includes("references"))) passed += 1;

  for (const [id, ref] of Object.entries(byId)) {
    const bucket = byUsageIntensity[ref.usage_intensity] ?? [];
    if (!bucket.includes(id)) {
      errors.push(
        `Usage intensity: entity ${id} usage_intensity ${ref.usage_intensity} missing from by_usage_intensity`
      );
    }
  }
  if (!errors.some((e) => e.startsWith("Usage intensity: entity"))) passed += 1;

  checks.usage_intensity = passed;
  return passed;
}

function validateByGroup({ byGroup, byId, groups, errors, checks }) {
  let passed = 0;

  for (const group of groups) {
    const expected = group.sauce_condiment_ids.sort();
    const indexed = (byGroup[group.slug] ?? []).slice().sort();
    if (JSON.stringify(indexed) !== JSON.stringify(expected)) {
      errors.push(`By group: ${group.slug} index mismatch with group sauce_condiment_ids`);
    }
  }
  if (!errors.some((e) => e.startsWith("By group:"))) passed += 1;

  for (const [groupSlug, ids] of Object.entries(byGroup)) {
    for (const id of ids) {
      if (!byId[id]) errors.push(`By group: ${groupSlug} references missing entity ${id}`);
      else if (byId[id].parent_group !== groupSlug) {
        errors.push(`By group: ${id} indexed under ${groupSlug} but parent_group is ${byId[id].parent_group}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("By group:") && e.includes("references"))) passed += 1;

  checks.by_group = passed;
  return passed;
}

function validateScientificName({ byScientificName, byId, errors, checks }) {
  let passed = 0;

  for (const [sciName, ids] of Object.entries(byScientificName)) {
    for (const id of ids) {
      if (!byId[id]) errors.push(`Scientific: ${sciName} references missing entity ${id}`);
      else if (byId[id].scientific_name !== sciName) {
        errors.push(`Scientific: ${id} indexed under ${sciName} but entity has ${byId[id].scientific_name}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Scientific:") && e.includes("references"))) passed += 1;

  for (const [id, ref] of Object.entries(byId)) {
    if (ref.scientific_name) {
      const bucket = byScientificName[ref.scientific_name] ?? [];
      if (!bucket.includes(id)) {
        errors.push(`Scientific: entity ${id} scientific_name ${ref.scientific_name} missing from by_scientific_name`);
      }
    }
  }
  if (!errors.some((e) => e.includes("missing from by_scientific_name"))) passed += 1;

  checks.scientific_name = passed;
  return passed;
}

function validateVocabulary({ vocabularyIndex, byId, errors, checks }) {
  let passed = 0;

  for (const field of VOCAB_FIELDS) {
    const fieldIndex = vocabularyIndex[field] ?? {};
    for (const [value, ids] of Object.entries(fieldIndex)) {
      if (VOCAB[field] && !VOCAB[field].has(value)) {
        errors.push(`Vocabulary: unexpected ${field} value "${value}"`);
      }
      for (const id of ids) {
        if (!byId[id]) errors.push(`Vocabulary: ${field}/${value} references missing entity ${id}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Vocabulary: unexpected") || e.includes("references missing"))) {
    passed += 1;
  }

  for (const [id, ref] of Object.entries(byId)) {
    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(ref, field);
      const bucket = vocabularyIndex[field]?.[val] ?? [];
      if (!bucket.includes(id)) {
        errors.push(`Vocabulary: entity ${id} missing from ${field} index key "${val}"`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Vocabulary: entity"))) passed += 1;

  checks.vocabulary = passed;
  return passed;
}

function validateNamespace({ byNamespace, categories, groups, byId, errors, checks }) {
  let passed = 0;
  const categoryIds = categories.map((c) => c.id);
  const nsCategory = byNamespace["food.sauce-condiment"] ?? [];

  if (JSON.stringify(nsCategory) !== JSON.stringify(categoryIds.sort())) {
    errors.push("Namespace: food.sauce-condiment namespace mismatch with categories");
  } else passed += 1;

  for (const group of groups) {
    const expected = group.sauce_condiment_ids.sort();
    const actual = byNamespace[group.id] ?? [];
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      errors.push(`Namespace: ${group.id} namespace mismatch with group sauce_condiment_ids`);
    }
  }
  if (!errors.some((e) => e.startsWith("Namespace:") && e.includes("namespace mismatch"))) passed += 1;

  checks.namespace = passed;
  return passed;
}

function validateCatalogCoverage({ byId, entityCount, errors, checks }) {
  let passed = 0;
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const catalogIds = new Set((catalog.sauce_condiments ?? []).map((e) => e.id));
  const runtimeIds = new Set(Object.keys(byId));

  if (entityCount !== catalogIds.size) {
    errors.push(
      `Catalog coverage: runtime entity_count ${entityCount} != catalog count ${catalogIds.size}`
    );
  }

  for (const id of catalogIds) {
    if (!runtimeIds.has(id)) {
      errors.push(`Catalog coverage: catalog entity ${id} missing from runtime by_id`);
    }
  }
  for (const id of runtimeIds) {
    if (!catalogIds.has(id)) {
      errors.push(`Catalog coverage: runtime entity ${id} not in catalog`);
    }
  }
  if (!errors.some((e) => e.startsWith("Catalog coverage:"))) passed += 1;

  checks.catalog_coverage = passed;
  return passed;
}

function validateSauceCondimentGovernance({ byId, bySlug, errors, checks }) {
  let passed = 0;

  for (const slug of CROSS_DOMAIN_FORBIDDEN_SLUGS) {
    if (bySlug[slug]) {
      errors.push(`Cross-domain: forbidden runtime entity slug ${slug}`);
    }
  }

  for (const slug of CANONICAL_BLOCKED_SLUGS) {
    if (bySlug[slug]) {
      errors.push(`CANON-001: blocked slug ${slug} must not be a runtime entity`);
    }
  }

  for (const slug of LEGUME_GROUP_FORBIDDEN) {
    if (bySlug[slug]) {
      errors.push(`SAUCE-002: legume-owned slug ${slug} must not be a runtime entity`);
    }
  }

  for (const rule of SAUCE001_REQUIRED) {
    const id = bySlug[rule.slug];
    if (!id) {
      errors.push(`SAUCE-001: missing required entity ${rule.slug}`);
      continue;
    }
    const ref = byId[id];
    if (ref && ref.parent_group !== rule.parent_group) {
      errors.push(
        `SAUCE-001: ${rule.slug} must be in ${rule.parent_group}, got ${ref.parent_group}`
      );
    }
  }

  for (const rule of FOOD12_REQUIRED) {
    const id = bySlug[rule.slug];
    if (!id) {
      errors.push(`FOOD-12 integration: missing required entity ${rule.slug}`);
      continue;
    }
    const ref = byId[id];
    if (ref && ref.parent_group !== rule.parent_group) {
      errors.push(
        `FOOD-12 integration: ${rule.slug} must be in ${rule.parent_group}, got ${ref.parent_group}`
      );
    }
  }

  if (
    !errors.some(
      (e) =>
        e.startsWith("SAUCE-001") ||
        e.startsWith("SAUCE-002") ||
        e.startsWith("FOOD-12 integration") ||
        e.startsWith("CANON-001") ||
        e.startsWith("Cross-domain")
    )
  ) {
    passed += 1;
  }

  checks.sauce_condiment_governance = passed;
  return passed;
}

function validateRelationships({ relationships, entityIds, errors, checks }) {
  let passed = 0;
  const seen = new Set();
  let editorialCount = 0;

  if (relationships.meta.level_3_editorial_edges !== 0) {
    errors.push("Relationships: level_3_editorial_edges must be 0");
  }

  for (const edge of relationships.edges) {
    const key = `${edge.source}\t${edge.relationship}\t${edge.target}`;
    if (seen.has(key)) errors.push(`Relationships: duplicate edge ${key}`);
    seen.add(key);

    if (edge.source === edge.target) errors.push(`Relationships: self-reference ${key}`);
    if (!entityIds.has(edge.source)) errors.push(`Relationships: missing source entity ${edge.source}`);
    if (!entityIds.has(edge.target)) errors.push(`Relationships: missing target entity ${edge.target}`);
    if (edge.confidence !== "high" || edge.derived_from !== "catalog") {
      errors.push(`Relationships: invalid edge metadata ${key}`);
    }
    if (FORBIDDEN_EDITORIAL_TYPES.has(edge.relationship)) {
      editorialCount += 1;
      errors.push(`Relationships: editorial relationship forbidden: ${edge.relationship}`);
    }
    if (!ALL_RELATIONSHIP_TYPES.includes(edge.relationship)) {
      errors.push(`Relationships: unknown relationship type ${edge.relationship}`);
    }
    if (!["structural", "intrinsic_similarity"].includes(edge.stability_level)) {
      errors.push(`Relationships: invalid stability_level on ${key}`);
    }
  }

  if (editorialCount > 0) {
    errors.push(`Relationships: editorial edge count must be 0 (found ${editorialCount})`);
  } else passed += 1;

  if (!errors.some((e) => e.startsWith("Relationships: duplicate"))) passed += 1;
  if (!errors.some((e) => e.startsWith("Relationships: self-reference"))) passed += 1;
  if (!errors.some((e) => e.startsWith("Relationships: missing"))) passed += 1;

  checks.relationships = passed;
  return passed;
}

function validateOrphans({ relationships, byId, categories, groups, errors, checks }) {
  let passed = 0;
  const entityIds = new Set(Object.keys(byId));
  const connected = new Set();

  for (const edge of relationships.edges) {
    if (edge.relationship === "belongs_to_group" && entityIds.has(edge.source)) {
      connected.add(edge.source);
    }
  }

  for (const id of entityIds) {
    if (!connected.has(id)) {
      errors.push(`Orphans: entity ${id} missing belongs_to_group edge`);
    }
  }

  for (const group of groups) {
    const hasCategoryEdge = relationships.edges.some(
      (e) => e.source === group.id && e.relationship === "belongs_to_category"
    );
    if (!hasCategoryEdge) {
      errors.push(`Orphans: group ${group.slug} missing belongs_to_category edge`);
    }
  }

  for (const cat of categories) {
    const hasContains = relationships.edges.some(
      (e) => e.source === cat.id && e.relationship === "category_contains"
    );
    if (!hasContains) {
      errors.push(`Orphans: category ${cat.slug} missing category_contains edge`);
    }
  }

  if (!errors.some((e) => e.startsWith("Orphans:"))) passed += 1;

  checks.orphans = passed;
  return passed;
}

function validateIndexCompleteness({ indexes, errors, checks }) {
  let passed = 0;
  const required = [
    "by_id",
    "by_slug",
    "by_group",
    "by_namespace",
    "by_usage_intensity",
    "by_scientific_name",
    "by_alias",
    "vocabulary",
  ];

  for (const key of required) {
    if (!indexes[key] || typeof indexes[key] !== "object") {
      errors.push(`Indexes: missing required index ${key}`);
    }
  }
  if (!errors.some((e) => e.startsWith("Indexes: missing"))) passed += 1;

  checks.index_completeness = passed;
  return passed;
}

function validateDeterminism(runtime, errors, checks) {
  let passed = 0;
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const rebuilt = compileSauceCondimentRuntime(catalog);
  const expected = serializeRuntime(runtime);
  const actual = serializeRuntime(rebuilt);

  if (expected !== actual) {
    errors.push("Determinism: sauce-condiment-runtime.json differs from catalog recompilation");
  } else {
    passed += 1;
  }

  checks.determinism = passed;
  return passed;
}

function validateEditorialLayerSeparation({ relationships, errors, checks }) {
  let passed = 0;
  const editorialPath = path.join(ROOT, "data/runtime/sauce-condiment-editorial-relationships.json");

  if (relationships.meta.level_3_editorial_edges !== 0) {
    errors.push("Editorial layer: consolidated runtime must not contain editorial edges");
  } else {
    passed += 1;
  }

  const structuralKeys = new Set(
    relationships.edges.map((edge) => `${edge.source}\t${edge.relationship}\t${edge.target}`)
  );
  const editorialTypes = new Set([
    "similar_to",
    "substitutes_for",
    "commonly_served_with",
    "similar_sauce_condiments",
  ]);
  const forbiddenInRuntime = relationships.edges.filter((edge) =>
    editorialTypes.has(edge.relationship)
  );
  if (forbiddenInRuntime.length > 0) {
    errors.push(
      `Editorial layer: ${forbiddenInRuntime.length} editorial relationship types found in runtime graph`
    );
  } else {
    passed += 1;
  }

  if (fs.existsSync(editorialPath)) {
    const editorial = JSON.parse(fs.readFileSync(editorialPath, "utf8"));
    if (editorial.meta?.layer !== "editorial") {
      errors.push("Editorial layer: editorial artifact missing layer metadata");
    }
    let conflicts = 0;
    for (const edge of editorial.edges ?? []) {
      const key = `${edge.source}\t${edge.relationship}\t${edge.target}`;
      if (structuralKeys.has(key)) {
        conflicts += 1;
        errors.push(`Editorial layer: editorial edge conflicts with structural runtime edge ${key}`);
      }
    }
    if (conflicts === 0) passed += 1;
  } else {
    passed += 1;
  }

  checks.editorial_layer = passed;
  return passed;
}

function validateWinePairingLayerSeparation({ relationships, errors, checks }) {
  let passed = 0;
  const winePath = path.join(ROOT, "data/runtime/sauce-condiment-wine-relationships.json");

  if (relationships.meta.level_3_editorial_edges !== 0) {
    errors.push("Wine pairing layer: consolidated runtime must not contain editorial edges");
  } else {
    passed += 1;
  }

  const pairingTypes = new Set([
    "pairs_with_style",
    "also_pairs_with_style",
    "pairs_with_descriptor",
    "pairs_with_technique",
  ]);
  const forbiddenInRuntime = relationships.edges.filter((edge) => pairingTypes.has(edge.relationship));
  if (forbiddenInRuntime.length > 0) {
    errors.push(
      `Wine pairing layer: ${forbiddenInRuntime.length} wine pairing relationship types found in runtime graph`
    );
  } else {
    passed += 1;
  }

  if (fs.existsSync(winePath)) {
    const wine = JSON.parse(fs.readFileSync(winePath, "utf8"));
    if (wine.meta?.layer !== "wine_pairing") {
      errors.push("Wine pairing layer: wine artifact missing layer metadata");
    }
    const structuralKeys = new Set(
      relationships.edges.map((edge) => `${edge.source}\t${edge.relationship}\t${edge.target}`)
    );
    let conflicts = 0;
    for (const edge of wine.edges ?? []) {
      const key = `${edge.source}\t${edge.relationship}\t${edge.target}`;
      if (structuralKeys.has(key)) {
        conflicts += 1;
        errors.push(`Wine pairing layer: wine edge conflicts with structural runtime edge ${key}`);
      }
    }
    if (conflicts === 0) passed += 1;
  } else {
    passed += 1;
  }

  checks.wine_pairing_layer = passed;
  return passed;
}

function main() {
  const errors = [];
  const warnings = [];
  const checks = {
    identity: 0,
    hierarchy: 0,
    usage_intensity: 0,
    by_group: 0,
    scientific_name: 0,
    vocabulary: 0,
    namespace: 0,
    catalog_coverage: 0,
    sauce_condiment_governance: 0,
    relationships: 0,
    orphans: 0,
    index_completeness: 0,
    determinism: 0,
    editorial_layer: 0,
    wine_pairing_layer: 0,
  };

  let runtime;
  try {
    runtime = loadRuntime();
  } catch (err) {
    const report = {
      phase: "FOOD-13C",
      domain: "sauce-condiment",
      overall_result: "FAIL",
      errors: [err.message],
      warnings: [],
      metrics: {
        Errors: 1,
        Warnings: 0,
        "Overall result": "FAIL",
      },
    };
    writeReport(report);
    console.error(err.message);
    process.exit(1);
  }

  const { indexes, hierarchy, relationships, categories, groups, meta } = runtime;
  const byId = indexes.by_id;
  const bySlug = indexes.by_slug;
  const entityIds = buildEntityIdSet(runtime);

  validateIdentity({ byId, bySlug, errors, checks });
  validateHierarchy({ hierarchy, categories, groups, bySlug, byId, errors, checks });
  validateUsageIntensity({ byUsageIntensity: indexes.by_usage_intensity, byId, errors, checks });
  validateByGroup({ byGroup: indexes.by_group, byId, groups, errors, checks });
  validateScientificName({
    byScientificName: indexes.by_scientific_name,
    byId,
    errors,
    checks,
  });
  validateVocabulary({ vocabularyIndex: indexes.vocabulary, byId, errors, checks });
  validateNamespace({
    byNamespace: indexes.by_namespace,
    categories,
    groups,
    byId,
    errors,
    checks,
  });
  validateCatalogCoverage({ byId, entityCount: meta.entity_count, errors, checks });
  validateSauceCondimentGovernance({ byId, bySlug, errors, checks });
  validateRelationships({ relationships, entityIds, errors, checks });
  validateOrphans({ relationships, byId, categories, groups, errors, checks });
  validateIndexCompleteness({ indexes, errors, checks });
  validateDeterminism(runtime, errors, checks);
  validateEditorialLayerSeparation({ relationships, errors, checks });
  validateWinePairingLayerSeparation({ relationships, errors, checks });

  const overall = errors.length === 0 ? "PASS" : "FAIL";
  const report = {
    phase: "FOOD-13C",
    domain: "sauce-condiment",
    catalog_version: meta?.catalog_version ?? null,
    overall_result: overall,
    errors,
    warnings,
    output: "data/runtime/sauce-condiment-runtime.json",
    metrics: {
      "Runtime entity count": meta.entity_count,
      "Catalog entity count": Object.keys(byId).length,
      "Identity checks": checks.identity,
      "Hierarchy checks": checks.hierarchy,
      "Usage intensity checks": checks.usage_intensity,
      "By group checks": checks.by_group,
      "Scientific name checks": checks.scientific_name,
      "Vocabulary checks": checks.vocabulary,
      "Namespace checks": checks.namespace,
      "Catalog coverage checks": checks.catalog_coverage,
      "Sauce & condiment governance checks": checks.sauce_condiment_governance,
      "Relationship checks": checks.relationships,
      "Orphan checks": checks.orphans,
      "Index completeness checks": checks.index_completeness,
      "Determinism checks": checks.determinism,
      "Editorial layer checks": checks.editorial_layer,
      "Wine pairing layer checks": checks.wine_pairing_layer,
      "Structural edges": relationships.meta.level_1_structural_edges,
      "Intrinsic edges": relationships.meta.level_2_intrinsic_similarity_edges,
      "Editorial edges": relationships.meta.level_3_editorial_edges,
      Errors: errors.length,
      Warnings: warnings.length,
      "Overall result": overall,
    },
    relationship_type_counts: relationships.stats.relationship_type_counts,
    runtime_stability_levels: RUNTIME_STABILITY_LEVELS,
  };

  writeReport(report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${REPORT_PATH}`);

  if (overall === "FAIL") {
    console.error(errors.join("\n"));
    process.exit(1);
  }
}

main();
