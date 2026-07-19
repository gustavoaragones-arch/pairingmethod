#!/usr/bin/env node
/**
 * FOOD-05C.2 — Runtime validator for vegetable bootstrap artifacts.
 * Structural verification only: no catalog writes, no repairs, no relationships.
 *
 * Run: node scripts/validate-runtime-vegetable-05c.mjs
 * Output: reports/vegetable-runtime-validator-report.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  ARTIFACTS,
  VOCAB_FIELDS,
  VOCAB,
  fieldValue,
  serializeRuntime,
  compileVegetableRuntime,
} from "./bootstrap-vegetable-runtime.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/vegetable-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/vegetable-runtime-validator-report.json");

const ARTIFACT_BUILDERS = {
  "vegetable-bootstrap.json": (built) => built.bootstrapDoc,
  "vegetable-categories.json": (built) => built.categoriesOut,
  "vegetable-groups.json": (built) => built.groupsOut,
  "vegetable-indexes.json": (built) => built.indexesDoc,
};

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

function loadRuntimeArtifacts() {
  const loaded = {};
  for (const name of ARTIFACTS) {
    const filePath = path.join(RUNTIME_DIR, name);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing runtime artifact: data/runtime/${name}`);
    }
    loaded[name] = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  return loaded;
}

function validateIdentity({ byId, bySlug, errors, checks }) {
  let passed = 0;
  const ids = Object.keys(byId);
  const slugs = Object.keys(bySlug);

  if (ids.length !== new Set(ids).size) errors.push("Identity: duplicate ontology IDs in by_id");
  else passed += 1;

  if (slugs.length !== new Set(slugs).size) errors.push("Identity: duplicate slugs in by_slug");
  else passed += 1;

  const slugToIdValues = Object.values(bySlug);
  if (slugToIdValues.length !== new Set(slugToIdValues).size) {
    errors.push("Identity: by_slug resolves multiple slugs to the same ID inconsistently");
  } else passed += 1;

  for (const id of ids) {
    const ref = byId[id];
    if (ref.id !== id) errors.push(`Identity: by_id entry ${id} has mismatched id field ${ref.id}`);
    if (!bySlug[ref.slug]) errors.push(`Identity: by_id entry ${id} slug ${ref.slug} missing from by_slug`);
    else if (bySlug[ref.slug] !== id) {
      errors.push(`Identity: by_slug ${ref.slug} points to ${bySlug[ref.slug]}, expected ${id}`);
    }
  }
  if (!errors.some((e) => e.startsWith("Identity: by_id entry"))) passed += 1;

  for (const [slug, id] of Object.entries(bySlug)) {
    const ref = byId[id];
    if (!ref) {
      errors.push(`Identity: slug ${slug} resolves to missing id ${id}`);
      continue;
    }
    if (ref.slug !== slug) {
      errors.push(`Identity: by_slug ${slug} -> ${id} but entity slug is ${ref.slug}`);
    }
  }
  if (!errors.some((e) => e.startsWith("Identity: slug") || e.startsWith("Identity: by_slug"))) passed += 1;

  if (ids.length !== slugToIdValues.length) {
    errors.push(`Identity: by_id count ${ids.length} != by_slug target count ${slugToIdValues.length}`);
  } else passed += 1;

  checks.identity = passed;
  return passed;
}

function validateHierarchy({ bootstrap, categories, groups, bySlug, byId, errors, checks }) {
  let passed = 0;
  const groupSlugs = new Set(groups.map((g) => g.slug));
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const { category_to_groups, group_to_category, group_to_vegetables, vegetable_to_group } = bootstrap.hierarchy;

  for (const cat of categories) {
    for (const groupSlug of cat.group_slugs) {
      if (!groupSlugs.has(groupSlug)) {
        errors.push(`Hierarchy: category ${cat.slug} references missing group ${groupSlug}`);
      }
    }
    const indexed = category_to_groups[cat.slug] ?? [];
    if (JSON.stringify([...indexed].sort()) !== JSON.stringify([...cat.group_slugs].sort())) {
      errors.push(`Hierarchy: category ${cat.slug} group_slugs mismatch with bootstrap`);
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: category"))) passed += 1;

  for (const group of groups) {
    for (const vegetableSlug of group.vegetable_slugs) {
      if (!bySlug[vegetableSlug]) {
        errors.push(`Hierarchy: group ${group.slug} references missing vegetable slug ${vegetableSlug}`);
      }
    }
    const expectedIds = group.vegetable_slugs.map((s) => bySlug[s]).filter(Boolean).sort();
    if (JSON.stringify(group.vegetable_ids) !== JSON.stringify(expectedIds)) {
      errors.push(`Hierarchy: group ${group.slug} vegetable_ids mismatch vegetable_slugs`);
    }
    const indexedVegetables = group_to_vegetables[group.slug] ?? [];
    if (JSON.stringify(indexedVegetables) !== JSON.stringify(expectedIds)) {
      errors.push(`Hierarchy: group ${group.slug} bootstrap vegetable list mismatch`);
    }
    if (group_to_category[group.slug] !== group.parent_category) {
      errors.push(`Hierarchy: group ${group.slug} parent_category mismatch in bootstrap`);
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: group"))) passed += 1;

  for (const [vegetableSlug, parentGroup] of Object.entries(vegetable_to_group)) {
    if (!bySlug[vegetableSlug]) {
      errors.push(`Hierarchy: vegetable_to_group references unknown slug ${vegetableSlug}`);
      continue;
    }
    if (!groupSlugs.has(parentGroup)) {
      errors.push(`Hierarchy: vegetable ${vegetableSlug} parent group ${parentGroup} missing`);
      continue;
    }
    const ref = byId[bySlug[vegetableSlug]];
    if (ref.parent_group !== parentGroup) {
      errors.push(`Hierarchy: vegetable ${vegetableSlug} parent_group ${ref.parent_group} != index ${parentGroup}`);
    }
    const group = groups.find((g) => g.slug === parentGroup);
    if (group && !group.vegetable_slugs.includes(vegetableSlug)) {
      errors.push(`Hierarchy: reciprocal failure — ${vegetableSlug} not in group ${parentGroup} vegetable_slugs`);
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: vegetable") || e.startsWith("Hierarchy: reciprocal"))) {
    passed += 1;
  }

  for (const [catSlug, groupList] of Object.entries(category_to_groups)) {
    if (!categorySlugs.has(catSlug)) {
      errors.push(`Hierarchy: bootstrap category ${catSlug} not in categories artifact`);
    }
    for (const g of groupList) {
      if (group_to_category[g] !== catSlug) {
        errors.push(`Hierarchy: group ${g} parent ${group_to_category[g]} != category ${catSlug}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: bootstrap category"))) passed += 1;

  checks.hierarchy = passed;
  return passed;
}

function validateCulinaryRole({ byCulinaryRole, byId, errors, checks }) {
  let passed = 0;

  for (const [role, ids] of Object.entries(byCulinaryRole)) {
    for (const id of ids) {
      if (!byId[id]) errors.push(`Culinary role: ${role} references missing entity ${id}`);
      else if (byId[id].culinary_role !== role) {
        errors.push(`Culinary role: ${id} indexed under ${role} but entity culinary_role is ${byId[id].culinary_role}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Culinary role:") && e.includes("references"))) passed += 1;

  for (const [id, ref] of Object.entries(byId)) {
    const bucket = byCulinaryRole[ref.culinary_role] ?? [];
    if (!bucket.includes(id)) {
      errors.push(`Culinary role: entity ${id} culinary_role ${ref.culinary_role} missing from by_culinary_role`);
    }
  }
  if (!errors.some((e) => e.startsWith("Culinary role: entity"))) passed += 1;

  checks.culinary_role = passed;
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

function validateCrossIndex({ bootstrap, groups, bySlug, byId, byCulinaryRole, vocabularyIndex, errors, checks }) {
  let passed = 0;
  const allIds = new Set(Object.keys(byId));

  for (const group of groups) {
    for (const id of group.vegetable_ids) {
      const ref = byId[id];
      if (!ref) {
        errors.push(`Cross-index: group ${group.slug} vegetable_id ${id} missing from by_id`);
        continue;
      }
      if (bySlug[ref.slug] !== id) errors.push(`Cross-index: group vegetable ${id} by_slug mismatch`);
      if (bootstrap.hierarchy.vegetable_to_group[ref.slug] !== group.slug) {
        errors.push(`Cross-index: group ${group.slug} vegetable ${ref.slug} hierarchy mismatch`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Cross-index: group"))) passed += 1;

  for (const ids of Object.values(byCulinaryRole)) {
    for (const id of ids) {
      if (!allIds.has(id)) errors.push(`Cross-index: by_culinary_role entity ${id} missing from by_id`);
    }
  }
  if (!errors.some((e) => e.startsWith("Cross-index: by_culinary_role"))) passed += 1;

  for (const field of VOCAB_FIELDS) {
    for (const ids of Object.values(vocabularyIndex[field] ?? {})) {
      for (const id of ids) {
        if (!allIds.has(id)) {
          errors.push(`Cross-index: vocabulary ${field} entity ${id} missing from by_id`);
        }
        const groupSlug = byId[id]?.parent_group;
        const hierarchyGroup = bootstrap.hierarchy.vegetable_to_group[byId[id]?.slug];
        if (groupSlug && hierarchyGroup && groupSlug !== hierarchyGroup) {
          errors.push(`Cross-index: vocabulary/hierarchy parent mismatch for ${id}`);
        }
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Cross-index: vocabulary"))) passed += 1;

  checks.cross_index = passed;
  return passed;
}

function validateNamespace({ byNamespace, categories, groups, byId, errors, checks }) {
  let passed = 0;
  const categoryIds = categories.map((c) => c.id);
  const nsCategory = byNamespace["food.vegetable"] ?? [];

  if (JSON.stringify(nsCategory) !== JSON.stringify(categoryIds.sort())) {
    errors.push("Namespace: food.vegetable namespace mismatch with categories");
  } else passed += 1;

  for (const group of groups) {
    const expected = group.vegetable_ids.sort();
    const actual = byNamespace[group.id] ?? [];
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      errors.push(`Namespace: ${group.id} namespace mismatch with group vegetable_ids`);
    }
  }
  if (!errors.some((e) => e.startsWith("Namespace:") && e.includes("namespace mismatch"))) passed += 1;

  for (const ids of Object.values(byNamespace)) {
    for (const id of ids) {
      if (id === "food.vegetable") continue;
      if (!byId[id] && !categories.some((c) => c.id === id) && !groups.some((g) => g.id === id)) {
        errors.push(`Namespace: unknown entity ${id} in by_namespace`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Namespace: unknown"))) passed += 1;

  checks.namespace = passed;
  return passed;
}

function validateDeterminism(loaded, errors, checks) {
  let passed = 0;
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const rebuilt = compileVegetableRuntime(catalog);

  for (const name of ARTIFACTS) {
    const expected = serializeRuntime(loaded[name]);
    const actual = serializeRuntime(ARTIFACT_BUILDERS[name](rebuilt));
    if (expected !== actual) {
      errors.push(`Determinism: ${name} differs from catalog recompilation`);
    }
  }

  if (!errors.some((e) => e.startsWith("Determinism:"))) {
    passed = ARTIFACTS.length;
  }

  checks.determinism = passed;
  return passed;
}

function main() {
  const errors = [];
  const warnings = [];
  const checks = {
    identity: 0,
    hierarchy: 0,
    culinary_role: 0,
    scientific_name: 0,
    vocabulary: 0,
    cross_index: 0,
    namespace: 0,
    determinism: 0,
  };

  let loaded;
  try {
    loaded = loadRuntimeArtifacts();
  } catch (err) {
    const report = {
      phase: "FOOD-05C.2",
      domain: "vegetable",
      overall_result: "FAIL",
      errors: [err.message],
      warnings: [],
      metrics: {
        "Runtime artifacts checked": 0,
        Errors: 1,
        Warnings: 0,
        "Overall result": "FAIL",
      },
    };
    writeReport(report);
    console.error(err.message);
    process.exit(1);
  }

  const bootstrap = loaded["vegetable-bootstrap.json"];
  const categories = loaded["vegetable-categories.json"];
  const groups = loaded["vegetable-groups.json"];
  const indexes = loaded["vegetable-indexes.json"];
  const byId = indexes.by_id;
  const bySlug = indexes.by_slug;
  const byCulinaryRole = indexes.by_culinary_role;
  const byScientificName = indexes.by_scientific_name;
  const byNamespace = indexes.by_namespace;
  const vocabularyIndex = indexes.vocabulary;

  validateIdentity({ byId, bySlug, errors, checks });
  validateHierarchy({ bootstrap, categories, groups, bySlug, byId, errors, checks });
  validateCulinaryRole({ byCulinaryRole, byId, errors, checks });
  validateScientificName({ byScientificName, byId, errors, checks });
  validateVocabulary({ vocabularyIndex, byId, errors, checks });
  validateCrossIndex({ bootstrap, groups, bySlug, byId, byCulinaryRole, vocabularyIndex, errors, checks });
  validateNamespace({ byNamespace, categories, groups, byId, errors, checks });
  validateDeterminism(loaded, errors, checks);

  const overall = errors.length === 0 ? "PASS" : "FAIL";
  const report = {
    phase: "FOOD-05C.2",
    domain: "vegetable",
    catalog_version: bootstrap.meta?.catalog_version ?? null,
    overall_result: overall,
    errors,
    warnings,
    artifacts: ARTIFACTS.map((name) => `data/runtime/${name}`),
    metrics: {
      "Runtime artifacts checked": ARTIFACTS.length,
      "Identity checks": checks.identity,
      "Hierarchy checks": checks.hierarchy,
      "Culinary role checks": checks.culinary_role,
      "Scientific name checks": checks.scientific_name,
      "Vocabulary checks": checks.vocabulary,
      "Cross-index checks": checks.cross_index,
      "Namespace checks": checks.namespace,
      "Determinism checks": checks.determinism,
      Errors: errors.length,
      Warnings: warnings.length,
      "Overall result": overall,
    },
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
