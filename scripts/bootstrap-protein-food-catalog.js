#!/usr/bin/env node
/**
 * ONTOLOGY-02B.1 — Bootstrap protein food catalog into runtime indexes.
 * Read-only compiler: never modifies data/protein-food-catalog.json.
 *
 * Run: node scripts/bootstrap-protein-food-catalog.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/protein-food-catalog.json");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const REPORT_PATH = path.join(ROOT, "reports/bootstrap-report.json");

const VOCAB_FIELDS = [
  "food_category",
  "cut_type",
  "anatomical_cut",
  "bone_state",
  "plant_part",
  "edible_structure",
  "processing_state",
  "fat_content",
];

const VOCAB = {
  food_category: new Set(["animal", "plant", "fungi"]),
  cut_type: new Set([
    "steak", "roast", "rib", "shank", "ground", "trim", "organ",
    "whole", "fillet", "portion", "tail", "claw", "tentacle",
  ]),
  anatomical_cut: new Set([
    "rib", "loin", "sirloin", "chuck", "round", "brisket", "flank", "plate",
    "shank", "neck", "belly", "shoulder", "leg", "breast", "thigh", "wing",
    "jowl", "tail", "claw", "tentacle", "fillet", "",
  ]),
  bone_state: new Set(["bone_in", "boneless", "either", "not_applicable"]),
  fat_content: new Set(["lean", "moderate", "rich"]),
  plant_part: new Set(["seed", "bean", "legume", "grain", "kernel", "nut", "sprout", "processed", ""]),
  edible_structure: new Set([
    "fruit", "seed", "leaf", "stem", "root", "tuber", "bulb", "flower", "fungal_body", "processed", "",
  ]),
  processing_state: new Set([
    "raw", "fresh", "cured", "smoked", "dried", "fermented", "cooked", "prepared", "ground", "processed",
  ]),
};

const ARTIFACTS = [
  "protein-food-index.json",
  "protein-food-categories.json",
  "protein-food-groups.json",
  "protein-food-id-map.json",
  "protein-food-slug-map.json",
  "protein-food-species-map.json",
  "protein-food-vocabulary-index.json",
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
  fs.writeFileSync(filePath, text, "utf8");
  return text;
}

function requireAuditPass() {
  const result = spawnSync("node", ["scripts/catalog-audit-02aa.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function foodRef(food) {
  return {
    id: food.id,
    slug: food.slug,
    name: food.name,
    parent_group: food.parent_group,
    food_category: food.food_category,
    species: food.species ?? "",
    scientific_name: food.scientific_name,
    cut_type: food.cut_type,
    anatomical_cut: food.anatomical_cut,
    bone_state: food.bone_state,
    processing_state: food.processing_state,
    fat_content: food.fat_content,
    plant_part: food.plant_part ?? "",
    edible_structure: food.edible_structure ?? "",
  };
}

const PLANT_FUNGI_GROUPS = new Set([
  "legumes", "soy-foods", "grains-wheat-protein", "nuts-seeds", "mushrooms", "mycoprotein",
]);

function fieldValue(food, field) {
  if (field === "plant_part" || field === "edible_structure" || field === "anatomical_cut") {
    return food[field] ?? "";
  }
  return food[field];
}

function validateForBootstrap(catalog) {
  const errors = [];
  const ids = new Set();
  const slugs = new Set();
  const groupSlugs = new Set(catalog.groups.map((g) => g.slug));
  const categorySlugs = new Set(catalog.categories.map((c) => c.slug));

  for (const food of catalog.protein_foods) {
    if (ids.has(food.id)) errors.push(`Duplicate id: ${food.id}`);
    ids.add(food.id);
    if (slugs.has(food.slug)) errors.push(`Duplicate slug: ${food.slug}`);
    slugs.add(food.slug);
    if (!groupSlugs.has(food.parent_group)) {
      errors.push(`Broken hierarchy: ${food.slug} parent_group ${food.parent_group}`);
    }

    for (const field of ["food_category", "cut_type", "bone_state", "processing_state", "fat_content"]) {
      const val = food[field];
      if (val === undefined || val === null || val === "") {
        errors.push(`${food.slug}: missing ${field}`);
      } else if (!VOCAB[field].has(val)) {
        errors.push(`${food.slug}: invalid ${field} "${val}"`);
      }
    }

    const anatomical = food.anatomical_cut ?? "";
    if (!VOCAB.anatomical_cut.has(anatomical)) {
      errors.push(`${food.slug}: invalid anatomical_cut "${anatomical}"`);
    }

    if (PLANT_FUNGI_GROUPS.has(food.parent_group)) {
      for (const field of ["plant_part", "edible_structure"]) {
        const val = food[field] ?? "";
        if (!VOCAB[field].has(val)) {
          errors.push(`${food.slug}: invalid ${field} "${val}"`);
        }
      }
    }

    if (!food.scientific_name && food.scientific_name !== "") {
      errors.push(`${food.slug}: missing scientific_name`);
    }
  }

  for (const g of catalog.groups) {
    if (!categorySlugs.has(g.parent_category)) {
      errors.push(`Group ${g.slug} orphan parent_category`);
    }
    const foods = catalog.protein_foods.filter((f) => f.parent_group === g.slug).map((f) => f.slug);
    for (const s of g.child_slugs) {
      if (!foods.includes(s)) errors.push(`Group ${g.slug} missing food ${s}`);
    }
  }

  return errors;
}

function buildVocabularyIndex(foods) {
  const index = Object.fromEntries(VOCAB_FIELDS.map((f) => [f, {}]));
  for (const food of foods) {
    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(food, field);
      if ((field === "plant_part" || field === "edible_structure") && val === "" && !(field in food)) {
        continue;
      }
      const key = val ?? "";
      if (!index[field][key]) index[field][key] = [];
      index[field][key].push(food.id);
    }
  }
  for (const field of VOCAB_FIELDS) {
    for (const key of Object.keys(index[field])) {
      index[field][key].sort();
    }
  }
  return index;
}

function bootstrap(catalog) {
  const foods = [...catalog.protein_foods].sort((a, b) => a.id.localeCompare(b.id));
  const groups = [...catalog.groups].sort((a, b) => a.slug.localeCompare(b.slug));
  const categories = [...catalog.categories].sort((a, b) => a.slug.localeCompare(b.slug));

  const idMap = {};
  const slugMap = {};
  const speciesMap = {};
  const byName = {};
  const byScientificName = {};

  for (const food of foods) {
    idMap[food.id] = foodRef(food);
    slugMap[food.slug] = food.id;

    if (food.species) {
      if (!speciesMap[food.species]) speciesMap[food.species] = [];
      speciesMap[food.species].push(food.id);
    }

    const nameKey = food.name.trim().toLowerCase();
    if (!byName[nameKey]) byName[nameKey] = [];
    byName[nameKey].push(food.id);

    if (food.scientific_name) {
      if (!byScientificName[food.scientific_name]) byScientificName[food.scientific_name] = [];
      byScientificName[food.scientific_name].push(food.id);
    }
  }

  for (const key of Object.keys(speciesMap)) speciesMap[key].sort();
  for (const key of Object.keys(byName)) byName[key].sort();
  for (const key of Object.keys(byScientificName)) byScientificName[key].sort();

  const categoryToGroups = {};
  const groupToCategory = {};
  const groupToFoods = {};
  const foodToGroup = {};

  for (const cat of categories) {
    categoryToGroups[cat.slug] = [...cat.child_slugs].sort();
  }

  for (const group of groups) {
    groupToCategory[group.slug] = group.parent_category;
    const childIds = group.child_slugs
      .map((slug) => slugMap[slug])
      .filter(Boolean)
      .sort();
    groupToFoods[group.slug] = childIds;
  }

  for (const food of foods) {
    foodToGroup[food.slug] = food.parent_group;
  }

  const categoriesOut = categories.map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    name: cat.name,
    food_category: cat.food_category,
    group_slugs: [...cat.child_slugs].sort(),
  }));

  const groupsOut = groups.map((group) => ({
    id: group.id,
    slug: group.slug,
    name: group.name,
    parent_category: group.parent_category,
    food_category: group.food_category,
    food_slugs: [...group.child_slugs].sort(),
    food_ids: group.child_slugs.map((s) => slugMap[s]).sort(),
  }));

  const vocabularyIndex = buildVocabularyIndex(foods);

  const index = {
    meta: {
      source: "data/protein-food-catalog.json",
      catalog_version: catalog.meta.catalog_version,
      food_ontology_version: catalog.meta.food_ontology_version,
      entity_count: foods.length,
      bootstrapped_at: catalog.meta.catalog_version,
      phase: "ONTOLOGY-02B.1",
    },
    hierarchy: {
      category_to_groups: categoryToGroups,
      group_to_category: groupToCategory,
      group_to_foods: groupToFoods,
      food_to_group: foodToGroup,
    },
    lookup: {
      by_name: byName,
      by_scientific_name: byScientificName,
    },
  };

  return {
    index,
    categoriesOut,
    groupsOut,
    idMap,
    slugMap,
    speciesMap,
    vocabularyIndex,
    stats: {
      categories: categoriesOut.length,
      groups: groupsOut.length,
      foods: foods.length,
      species: Object.keys(speciesMap).length,
      scientific_names: Object.keys(byScientificName).length,
      runtime_artifacts: ARTIFACTS.length,
    },
  };
}

function main() {
  requireAuditPass();

  const catalogMtimeBefore = fs.statSync(CATALOG_PATH).mtimeMs;
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));

  const bootstrapErrors = validateForBootstrap(catalog);
  if (bootstrapErrors.length > 0) {
    const report = {
      phase: "ONTOLOGY-02B.1",
      overall_result: "FAIL",
      bootstrap_errors: bootstrapErrors,
      metrics: { "Bootstrap errors": bootstrapErrors.length },
    };
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    writeJson(REPORT_PATH, report);
    console.error(bootstrapErrors.join("\n"));
    process.exit(1);
  }

  const built = bootstrap(catalog);

  fs.mkdirSync(RUNTIME_DIR, { recursive: true });
  const written = {};
  written[ARTIFACTS[0]] = writeJson(path.join(RUNTIME_DIR, ARTIFACTS[0]), built.index);
  written[ARTIFACTS[1]] = writeJson(path.join(RUNTIME_DIR, ARTIFACTS[1]), built.categoriesOut);
  written[ARTIFACTS[2]] = writeJson(path.join(RUNTIME_DIR, ARTIFACTS[2]), built.groupsOut);
  written[ARTIFACTS[3]] = writeJson(path.join(RUNTIME_DIR, ARTIFACTS[3]), built.idMap);
  written[ARTIFACTS[4]] = writeJson(path.join(RUNTIME_DIR, ARTIFACTS[4]), built.slugMap);
  written[ARTIFACTS[5]] = writeJson(path.join(RUNTIME_DIR, ARTIFACTS[5]), built.speciesMap);
  written[ARTIFACTS[6]] = writeJson(
    path.join(RUNTIME_DIR, ARTIFACTS[6]),
    built.vocabularyIndex
  );

  const catalogMtimeAfter = fs.statSync(CATALOG_PATH).mtimeMs;
  if (catalogMtimeBefore !== catalogMtimeAfter) {
    throw new Error("Bootstrap modified catalog file timestamp — aborting");
  }

  const report = {
    phase: "ONTOLOGY-02B.1",
    catalog_version: catalog.meta.catalog_version,
    overall_result: "PASS",
    bootstrap_errors: [],
    metrics: {
      "Categories indexed": built.stats.categories,
      "Groups indexed": built.stats.groups,
      "Foods indexed": built.stats.foods,
      "Species indexed": built.stats.species,
      "Runtime artifacts": built.stats.runtime_artifacts,
      "Bootstrap errors": 0,
    },
    artifacts: ARTIFACTS.map((name) => `data/runtime/${name}`),
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${REPORT_PATH}`);
}

main();
