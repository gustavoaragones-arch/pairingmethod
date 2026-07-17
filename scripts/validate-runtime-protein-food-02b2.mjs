#!/usr/bin/env node
/**
 * ONTOLOGY-02B.2 — Runtime validator for protein food bootstrap artifacts.
 * Structural verification only: no catalog writes, no repairs, no relationships.
 *
 * Run: node scripts/validate-runtime-protein-food-02b2.mjs
 * Output: reports/runtime-validator-report.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  ARTIFACTS,
  VOCAB_FIELDS,
  VOCAB,
  PLANT_FUNGI_GROUPS,
  fieldValue,
  serializeRuntime,
  compileProteinFoodRuntime,
} from "./bootstrap-protein-food-catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/protein-food-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/runtime-validator-report.json");

const ARTIFACT_BUILDERS = {
  "protein-food-index.json": (built) => built.index,
  "protein-food-categories.json": (built) => built.categoriesOut,
  "protein-food-groups.json": (built) => built.groupsOut,
  "protein-food-id-map.json": (built) => built.idMap,
  "protein-food-slug-map.json": (built) => built.slugMap,
  "protein-food-species-map.json": (built) => built.speciesMap,
  "protein-food-vocabulary-index.json": (built) => built.vocabularyIndex,
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

function validateIdentity({ idMap, slugMap, errors, warnings, checks }) {
  let passed = 0;
  const ids = Object.keys(idMap);
  const slugs = Object.keys(slugMap);

  if (ids.length !== new Set(ids).size) {
    errors.push("Identity: duplicate ontology IDs in id map");
  } else {
    passed += 1;
  }

  if (slugs.length !== new Set(slugs).size) {
    errors.push("Identity: duplicate slugs in slug map");
  } else {
    passed += 1;
  }

  const slugToIdValues = Object.values(slugMap);
  if (slugToIdValues.length !== new Set(slugToIdValues).size) {
    errors.push("Identity: slug map resolves multiple slugs to the same ID inconsistently");
  } else {
    passed += 1;
  }

  for (const id of ids) {
    const ref = idMap[id];
    if (ref.id !== id) {
      errors.push(`Identity: id map entry ${id} has mismatched id field ${ref.id}`);
    }
    if (!slugMap[ref.slug]) {
      errors.push(`Identity: id map entry ${id} slug ${ref.slug} missing from slug map`);
    } else if (slugMap[ref.slug] !== id) {
      errors.push(`Identity: slug map ${ref.slug} points to ${slugMap[ref.slug]}, expected ${id}`);
    }
  }
  if (!errors.some((e) => e.startsWith("Identity: id map"))) passed += 1;

  for (const [slug, id] of Object.entries(slugMap)) {
    const ref = idMap[id];
    if (!ref) {
      errors.push(`Identity: slug ${slug} resolves to missing id ${id}`);
      continue;
    }
    if (ref.slug !== slug) {
      errors.push(`Identity: slug map ${slug} -> ${id} but entity slug is ${ref.slug}`);
    }
  }
  if (!errors.some((e) => e.startsWith("Identity: slug"))) passed += 1;

  if (ids.length !== slugToIdValues.length) {
    errors.push(`Identity: id map count ${ids.length} != slug map target count ${slugToIdValues.length}`);
  } else {
    passed += 1;
  }

  checks.identity = passed;
  return passed;
}

function validateHierarchy({ index, categories, groups, slugMap, idMap, errors, checks }) {
  let passed = 0;
  const groupSlugs = new Set(groups.map((g) => g.slug));
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const { category_to_groups, group_to_category, group_to_foods, food_to_group } = index.hierarchy;

  for (const cat of categories) {
    if (!categorySlugs.has(cat.slug)) {
      errors.push(`Hierarchy: unknown category ${cat.slug}`);
    }
    for (const groupSlug of cat.group_slugs) {
      if (!groupSlugs.has(groupSlug)) {
        errors.push(`Hierarchy: category ${cat.slug} references missing group ${groupSlug}`);
      }
    }
    const indexed = category_to_groups[cat.slug] ?? [];
    if (JSON.stringify([...indexed].sort()) !== JSON.stringify([...cat.group_slugs].sort())) {
      errors.push(`Hierarchy: category ${cat.slug} group_slugs mismatch with index`);
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: category"))) passed += 1;

  for (const group of groups) {
    for (const foodSlug of group.food_slugs) {
      if (!slugMap[foodSlug]) {
        errors.push(`Hierarchy: group ${group.slug} references missing food slug ${foodSlug}`);
      }
    }
    const expectedIds = group.food_slugs.map((s) => slugMap[s]).filter(Boolean).sort();
    if (JSON.stringify(group.food_ids) !== JSON.stringify(expectedIds)) {
      errors.push(`Hierarchy: group ${group.slug} food_ids mismatch food_slugs`);
    }
    const indexedFoods = group_to_foods[group.slug] ?? [];
    if (JSON.stringify(indexedFoods) !== JSON.stringify(expectedIds)) {
      errors.push(`Hierarchy: group ${group.slug} index food list mismatch`);
    }
    if (group_to_category[group.slug] !== group.parent_category) {
      errors.push(`Hierarchy: group ${group.slug} parent_category mismatch in index`);
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: group"))) passed += 1;

  for (const [foodSlug, parentGroup] of Object.entries(food_to_group)) {
    if (!slugMap[foodSlug]) {
      errors.push(`Hierarchy: food_to_group references unknown slug ${foodSlug}`);
      continue;
    }
    if (!groupSlugs.has(parentGroup)) {
      errors.push(`Hierarchy: food ${foodSlug} parent group ${parentGroup} missing`);
      continue;
    }
    const ref = idMap[slugMap[foodSlug]];
    if (ref.parent_group !== parentGroup) {
      errors.push(`Hierarchy: food ${foodSlug} parent_group ${ref.parent_group} != index ${parentGroup}`);
    }
    const group = groups.find((g) => g.slug === parentGroup);
    if (group && !group.food_slugs.includes(foodSlug)) {
      errors.push(`Hierarchy: reciprocal failure — ${foodSlug} not in group ${parentGroup} food_slugs`);
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: food") || e.startsWith("Hierarchy: reciprocal"))) {
    passed += 1;
  }

  for (const [catSlug, groupList] of Object.entries(category_to_groups)) {
    if (!categorySlugs.has(catSlug)) {
      errors.push(`Hierarchy: index category ${catSlug} not in categories artifact`);
    }
    for (const g of groupList) {
      if (group_to_category[g] !== catSlug) {
        errors.push(`Hierarchy: group ${g} parent ${group_to_category[g]} != category ${catSlug}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: index category"))) passed += 1;

  checks.hierarchy = passed;
  return passed;
}

function validateSpecies({ speciesMap, idMap, index, errors, checks }) {
  let passed = 0;

  for (const [species, ids] of Object.entries(speciesMap)) {
    for (const id of ids) {
      if (!idMap[id]) {
        errors.push(`Species: ${species} references missing entity ${id}`);
      } else if (idMap[id].species !== species) {
        errors.push(`Species: ${id} indexed under ${species} but entity species is ${idMap[id].species}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Species:") && e.includes("references"))) passed += 1;

  for (const [id, ref] of Object.entries(idMap)) {
    if (ref.species) {
      const bucket = speciesMap[ref.species] ?? [];
      if (!bucket.includes(id)) {
        errors.push(`Species: entity ${id} species ${ref.species} missing from species map`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Species: entity"))) passed += 1;

  const byScientific = index.lookup?.by_scientific_name ?? {};
  for (const [sciName, ids] of Object.entries(byScientific)) {
    for (const id of ids) {
      if (!idMap[id]) {
        errors.push(`Species: scientific name ${sciName} references missing entity ${id}`);
      } else if (idMap[id].scientific_name !== sciName) {
        errors.push(`Species: ${id} indexed under ${sciName} but entity has ${idMap[id].scientific_name}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Species: scientific"))) passed += 1;

  for (const [id, ref] of Object.entries(idMap)) {
    if (ref.scientific_name) {
      const bucket = byScientific[ref.scientific_name] ?? [];
      if (!bucket.includes(id)) {
        errors.push(`Species: entity ${id} scientific_name ${ref.scientific_name} missing from index`);
      }
    }
  }
  if (!errors.some((e) => e.includes("scientific_name") && e.includes("missing from index"))) {
    passed += 1;
  }

  checks.species = passed;
  return passed;
}

function validateVocabulary({ vocabularyIndex, idMap, errors, warnings, checks }) {
  let passed = 0;

  for (const field of VOCAB_FIELDS) {
    const fieldIndex = vocabularyIndex[field] ?? {};
    for (const [value, ids] of Object.entries(fieldIndex)) {
      if (!VOCAB[field].has(value)) {
        errors.push(`Vocabulary: unexpected ${field} value "${value}"`);
      }
      for (const id of ids) {
        if (!idMap[id]) {
          errors.push(`Vocabulary: ${field}/${value} references missing entity ${id}`);
        }
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Vocabulary: unexpected") || e.includes("references missing"))) {
    passed += 1;
  }

  for (const [id, ref] of Object.entries(idMap)) {
    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(ref, field);
      if ((field === "plant_part" || field === "edible_structure") && val === "" && !PLANT_FUNGI_GROUPS.has(ref.parent_group)) {
        const bucket = vocabularyIndex[field]?.[""] ?? [];
        if (bucket.includes(id)) {
          errors.push(`Vocabulary: animal entity ${id} should not appear in ${field} index`);
        }
        continue;
      }
      const bucket = vocabularyIndex[field]?.[val] ?? [];
      if (!bucket.includes(id)) {
        errors.push(`Vocabulary: entity ${id} missing from ${field} index key "${val}"`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Vocabulary: entity") || e.includes("should not appear"))) {
    passed += 1;
  }

  checks.vocabulary = passed;
  return passed;
}

function validateCrossIndex({ index, groups, slugMap, idMap, speciesMap, vocabularyIndex, errors, checks }) {
  let passed = 0;
  const allIds = new Set(Object.keys(idMap));

  for (const group of groups) {
    for (const id of group.food_ids) {
      const ref = idMap[id];
      if (!ref) {
        errors.push(`Cross-index: group ${group.slug} food_id ${id} missing from id map`);
        continue;
      }
      if (slugMap[ref.slug] !== id) {
        errors.push(`Cross-index: group food ${id} slug map mismatch`);
      }
      if (index.hierarchy.food_to_group[ref.slug] !== group.slug) {
        errors.push(`Cross-index: group ${group.slug} food ${ref.slug} hierarchy mismatch`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Cross-index: group"))) passed += 1;

  for (const ids of Object.values(speciesMap)) {
    for (const id of ids) {
      if (!allIds.has(id)) {
        errors.push(`Cross-index: species map entity ${id} missing from id map`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Cross-index: species"))) passed += 1;

  for (const field of VOCAB_FIELDS) {
    for (const ids of Object.values(vocabularyIndex[field] ?? {})) {
      for (const id of ids) {
        if (!allIds.has(id)) {
          errors.push(`Cross-index: vocabulary ${field} entity ${id} missing from id map`);
        }
        const groupSlug = idMap[id]?.parent_group;
        const hierarchyGroup = index.hierarchy.food_to_group[idMap[id]?.slug];
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

function validateDeterminism(loaded, errors, checks) {
  let passed = 0;
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const rebuilt = compileProteinFoodRuntime(catalog);

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
    species: 0,
    vocabulary: 0,
    cross_index: 0,
    determinism: 0,
  };

  let loaded;
  try {
    loaded = loadRuntimeArtifacts();
  } catch (err) {
    const report = {
      phase: "ONTOLOGY-02B.2",
      overall_result: "FAIL",
      errors: [err.message],
      warnings: [],
      metrics: {
        "Runtime artifacts checked": 0,
        "Identity checks": 0,
        "Hierarchy checks": 0,
        "Species checks": 0,
        "Vocabulary checks": 0,
        "Cross-index checks": 0,
        "Determinism checks": 0,
        Errors: 1,
        Warnings: 0,
        "Overall result": "FAIL",
      },
    };
    writeReport(report);
    console.error(err.message);
    process.exit(1);
  }

  const idMap = loaded["protein-food-id-map.json"];
  const slugMap = loaded["protein-food-slug-map.json"];
  const index = loaded["protein-food-index.json"];
  const categories = loaded["protein-food-categories.json"];
  const groups = loaded["protein-food-groups.json"];
  const speciesMap = loaded["protein-food-species-map.json"];
  const vocabularyIndex = loaded["protein-food-vocabulary-index.json"];

  validateIdentity({ idMap, slugMap, errors, warnings, checks });
  validateHierarchy({ index, categories, groups, slugMap, idMap, errors, checks });
  validateSpecies({ speciesMap, idMap, index, errors, checks });
  validateVocabulary({ vocabularyIndex, idMap, errors, warnings, checks });
  validateCrossIndex({ index, groups, slugMap, idMap, speciesMap, vocabularyIndex, errors, checks });
  validateDeterminism(loaded, errors, checks);

  const overall = errors.length === 0 ? "PASS" : "FAIL";
  const report = {
    phase: "ONTOLOGY-02B.2",
    catalog_version: index.meta?.catalog_version ?? null,
    overall_result: overall,
    errors,
    warnings,
    artifacts: ARTIFACTS.map((name) => `data/runtime/${name}`),
    metrics: {
      "Runtime artifacts checked": ARTIFACTS.length,
      "Identity checks": checks.identity,
      "Hierarchy checks": checks.hierarchy,
      "Species checks": checks.species,
      "Vocabulary checks": checks.vocabulary,
      "Cross-index checks": checks.cross_index,
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
