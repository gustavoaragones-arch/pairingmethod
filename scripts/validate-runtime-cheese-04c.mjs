#!/usr/bin/env node
/**
 * FOOD-04C.2 — Runtime validator for cheese bootstrap artifacts.
 * Structural verification only: no catalog writes, no repairs, no relationships.
 *
 * Run: node scripts/validate-runtime-cheese-04c.mjs
 * Output: reports/runtime-validator-report.json
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
  compileCheeseRuntime,
} from "./bootstrap-cheese-catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/cheese-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/runtime-validator-report.json");

const ARTIFACT_BUILDERS = {
  "cheese-bootstrap.json": (built) => built.bootstrapDoc,
  "cheese-categories.json": (built) => built.categoriesOut,
  "cheese-groups.json": (built) => built.groupsOut,
  "cheese-indexes.json": (built) => built.indexesDoc,
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
  const { category_to_groups, group_to_category, group_to_cheeses, cheese_to_group } = bootstrap.hierarchy;

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
    for (const cheeseSlug of group.cheese_slugs) {
      if (!bySlug[cheeseSlug]) {
        errors.push(`Hierarchy: group ${group.slug} references missing cheese slug ${cheeseSlug}`);
      }
    }
    const expectedIds = group.cheese_slugs.map((s) => bySlug[s]).filter(Boolean).sort();
    if (JSON.stringify(group.cheese_ids) !== JSON.stringify(expectedIds)) {
      errors.push(`Hierarchy: group ${group.slug} cheese_ids mismatch cheese_slugs`);
    }
    const indexedCheeses = group_to_cheeses[group.slug] ?? [];
    if (JSON.stringify(indexedCheeses) !== JSON.stringify(expectedIds)) {
      errors.push(`Hierarchy: group ${group.slug} bootstrap cheese list mismatch`);
    }
    if (group_to_category[group.slug] !== group.parent_category) {
      errors.push(`Hierarchy: group ${group.slug} parent_category mismatch in bootstrap`);
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: group"))) passed += 1;

  for (const [cheeseSlug, parentGroup] of Object.entries(cheese_to_group)) {
    if (!bySlug[cheeseSlug]) {
      errors.push(`Hierarchy: cheese_to_group references unknown slug ${cheeseSlug}`);
      continue;
    }
    if (!groupSlugs.has(parentGroup)) {
      errors.push(`Hierarchy: cheese ${cheeseSlug} parent group ${parentGroup} missing`);
      continue;
    }
    const ref = byId[bySlug[cheeseSlug]];
    if (ref.parent_group !== parentGroup) {
      errors.push(`Hierarchy: cheese ${cheeseSlug} parent_group ${ref.parent_group} != index ${parentGroup}`);
    }
    const group = groups.find((g) => g.slug === parentGroup);
    if (group && !group.cheese_slugs.includes(cheeseSlug)) {
      errors.push(`Hierarchy: reciprocal failure — ${cheeseSlug} not in group ${parentGroup} cheese_slugs`);
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: cheese") || e.startsWith("Hierarchy: reciprocal"))) {
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

function validateMilkSource({ byMilkSource, byId, bootstrap, errors, checks }) {
  let passed = 0;

  for (const [milkSource, ids] of Object.entries(byMilkSource)) {
    for (const id of ids) {
      if (!byId[id]) errors.push(`Milk source: ${milkSource} references missing entity ${id}`);
      else if (byId[id].milk_source !== milkSource) {
        errors.push(`Milk source: ${id} indexed under ${milkSource} but entity milk_source is ${byId[id].milk_source}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Milk source:") && e.includes("references"))) passed += 1;

  for (const [id, ref] of Object.entries(byId)) {
    const bucket = byMilkSource[ref.milk_source] ?? [];
    if (!bucket.includes(id)) {
      errors.push(`Milk source: entity ${id} milk_source ${ref.milk_source} missing from by_milk_source`);
    }
  }
  if (!errors.some((e) => e.startsWith("Milk source: entity"))) passed += 1;

  checks.milk_source = passed;
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

function validateCrossIndex({ bootstrap, groups, bySlug, byId, byMilkSource, vocabularyIndex, errors, checks }) {
  let passed = 0;
  const allIds = new Set(Object.keys(byId));

  for (const group of groups) {
    for (const id of group.cheese_ids) {
      const ref = byId[id];
      if (!ref) {
        errors.push(`Cross-index: group ${group.slug} cheese_id ${id} missing from by_id`);
        continue;
      }
      if (bySlug[ref.slug] !== id) errors.push(`Cross-index: group cheese ${id} by_slug mismatch`);
      if (bootstrap.hierarchy.cheese_to_group[ref.slug] !== group.slug) {
        errors.push(`Cross-index: group ${group.slug} cheese ${ref.slug} hierarchy mismatch`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Cross-index: group"))) passed += 1;

  for (const ids of Object.values(byMilkSource)) {
    for (const id of ids) {
      if (!allIds.has(id)) errors.push(`Cross-index: by_milk_source entity ${id} missing from by_id`);
    }
  }
  if (!errors.some((e) => e.startsWith("Cross-index: by_milk_source"))) passed += 1;

  for (const field of VOCAB_FIELDS) {
    for (const ids of Object.values(vocabularyIndex[field] ?? {})) {
      for (const id of ids) {
        if (!allIds.has(id)) {
          errors.push(`Cross-index: vocabulary ${field} entity ${id} missing from by_id`);
        }
        const groupSlug = byId[id]?.parent_group;
        const hierarchyGroup = bootstrap.hierarchy.cheese_to_group[byId[id]?.slug];
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
  const nsCategory = byNamespace["food.cheese"] ?? [];

  if (JSON.stringify(nsCategory) !== JSON.stringify(categoryIds.sort())) {
    errors.push("Namespace: food.cheese namespace mismatch with categories");
  } else passed += 1;

  for (const group of groups) {
    const expected = group.cheese_ids.sort();
    const actual = byNamespace[group.id] ?? [];
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      errors.push(`Namespace: ${group.id} namespace mismatch with group cheese_ids`);
    }
  }
  if (!errors.some((e) => e.startsWith("Namespace:") && e.includes("namespace mismatch"))) passed += 1;

  for (const ids of Object.values(byNamespace)) {
    for (const id of ids) {
      if (id === "food.cheese") continue;
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
  const rebuilt = compileCheeseRuntime(catalog);

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
    milk_source: 0,
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
      phase: "FOOD-04C.2",
      domain: "cheese",
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

  const bootstrap = loaded["cheese-bootstrap.json"];
  const categories = loaded["cheese-categories.json"];
  const groups = loaded["cheese-groups.json"];
  const indexes = loaded["cheese-indexes.json"];
  const byId = indexes.by_id;
  const bySlug = indexes.by_slug;
  const byMilkSource = indexes.by_milk_source;
  const byScientificName = indexes.by_scientific_name;
  const byNamespace = indexes.by_namespace;
  const vocabularyIndex = indexes.vocabulary;

  validateIdentity({ byId, bySlug, errors, checks });
  validateHierarchy({ bootstrap, categories, groups, bySlug, byId, errors, checks });
  validateMilkSource({ byMilkSource, byId, bootstrap, errors, checks });
  validateScientificName({ byScientificName, byId, errors, checks });
  validateVocabulary({ vocabularyIndex, byId, errors, checks });
  validateCrossIndex({ bootstrap, groups, bySlug, byId, byMilkSource, vocabularyIndex, errors, checks });
  validateNamespace({ byNamespace, categories, groups, byId, errors, checks });
  validateDeterminism(loaded, errors, checks);

  const overall = errors.length === 0 ? "PASS" : "FAIL";
  const report = {
    phase: "FOOD-04C.2",
    domain: "cheese",
    catalog_version: bootstrap.meta?.catalog_version ?? null,
    overall_result: overall,
    errors,
    warnings,
    artifacts: ARTIFACTS.map((name) => `data/runtime/${name}`),
    metrics: {
      "Runtime artifacts checked": ARTIFACTS.length,
      "Identity checks": checks.identity,
      "Hierarchy checks": checks.hierarchy,
      "Milk source checks": checks.milk_source,
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
