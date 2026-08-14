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
import { createProteinMigrationResolver } from "../lib/runtime/proteinMigrationResolver.js";

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
    "jowl", "tail", "claw", "tentacle", "fillet", "trim", "",
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
  const text = serializeRuntime(data);
  fs.writeFileSync(filePath, text, "utf8");
  return text;
}

function serializeRuntime(data) {
  return `${JSON.stringify(sortKeysDeep(data), null, 2)}\n`;
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

function validateForBootstrap(catalog, migrationResolver) {
  const resolver = migrationResolver ?? createProteinMigrationResolver(ROOT);
  const errors = [];
  const ids = new Set();
  const slugs = new Set();
  const groupSlugs = new Set(catalog.groups.map((g) => g.slug));
  const categorySlugs = new Set(catalog.categories.map((c) => c.slug));

  for (const food of catalog.protein_foods) {
    if (!resolver.proteinRuntimeAllowed(food.id)) {
      continue;
    }
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

function bootstrap(catalog, migrationResolver) {
  const resolver = migrationResolver ?? createProteinMigrationResolver(ROOT);
  const allFoods = [...catalog.protein_foods].sort((a, b) => a.id.localeCompare(b.id));
  const foods = allFoods.filter((food) => resolver.proteinRuntimeAllowed(food.id));
  const groups = [...catalog.groups].sort((a, b) => a.slug.localeCompare(b.slug));
  const categories = [...catalog.categories].sort((a, b) => a.slug.localeCompare(b.slug));
  const deprecatedExcluded = allFoods.length - foods.length;

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

  const groupsOut = groups.map((group) => {
    const activeSlugs = group.child_slugs.filter((slug) => slugMap[slug]).sort();
    return {
      id: group.id,
      slug: group.slug,
      name: group.name,
      parent_category: group.parent_category,
      food_category: group.food_category,
      food_slugs: activeSlugs,
      food_ids: activeSlugs.map((slug) => slugMap[slug]).sort(),
    };
  });

  const vocabularyIndex = buildVocabularyIndex(foods);

  const index = {
    meta: {
      source: "data/protein-food-catalog.json",
      catalog_version: catalog.meta.catalog_version,
      food_ontology_version: catalog.meta.food_ontology_version,
      entity_count: foods.length,
      catalog_entity_count: allFoods.length,
      deprecated_excluded: deprecatedExcluded,
      bootstrapped_at: catalog.meta.catalog_version,
      phase: "FOOD-14C",
      migration_map: "data/protein-migration-map.json",
      resolver: "lib/runtime/proteinMigrationResolver.js",
    },
    migration: {
      legacy_id_to_canonical: resolver.legacyIdToCanonicalIndex(),
      legacy_slug_to_canonical: resolver.legacySlugToCanonicalIndex(),
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
      catalog_foods: allFoods.length,
      deprecated_excluded: deprecatedExcluded,
      species: Object.keys(speciesMap).length,
      scientific_names: Object.keys(byScientificName).length,
      runtime_artifacts: ARTIFACTS.length,
    },
  };
}

function runProteinFoodBootstrap({ skipCatalogAudit = false } = {}) {
  if (!skipCatalogAudit) {
    requireAuditPass();
  }

  const catalogMtimeBefore = fs.statSync(CATALOG_PATH).mtimeMs;
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const resolver = createProteinMigrationResolver(ROOT);

  const bootstrapErrors = validateForBootstrap(catalog, resolver);
  if (bootstrapErrors.length > 0) {
    const report = {
      phase: skipCatalogAudit ? "FOOD-14C" : "ONTOLOGY-02B.1",
      overall_result: "FAIL",
      bootstrap_errors: bootstrapErrors,
      metrics: { "Bootstrap errors": bootstrapErrors.length },
    };
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    writeJson(REPORT_PATH, report);
    console.error(bootstrapErrors.join("\n"));
    process.exit(1);
  }

  const built = bootstrap(catalog, resolver);

  fs.mkdirSync(RUNTIME_DIR, { recursive: true });
  writeJson(path.join(RUNTIME_DIR, ARTIFACTS[0]), built.index);
  writeJson(path.join(RUNTIME_DIR, ARTIFACTS[1]), built.categoriesOut);
  writeJson(path.join(RUNTIME_DIR, ARTIFACTS[2]), built.groupsOut);
  writeJson(path.join(RUNTIME_DIR, ARTIFACTS[3]), built.idMap);
  writeJson(path.join(RUNTIME_DIR, ARTIFACTS[4]), built.slugMap);
  writeJson(path.join(RUNTIME_DIR, ARTIFACTS[5]), built.speciesMap);
  writeJson(path.join(RUNTIME_DIR, ARTIFACTS[6]), built.vocabularyIndex);

  const catalogMtimeAfter = fs.statSync(CATALOG_PATH).mtimeMs;
  if (catalogMtimeBefore !== catalogMtimeAfter) {
    throw new Error("Bootstrap modified catalog file timestamp — aborting");
  }

  const report = {
    phase: "FOOD-14C",
    catalog_version: catalog.meta.catalog_version,
    overall_result: "PASS",
    bootstrap_errors: [],
    metrics: {
      "Categories indexed": built.stats.categories,
      "Groups indexed": built.stats.groups,
      "Foods indexed": built.stats.foods,
      "Catalog foods": built.stats.catalog_foods,
      "Deprecated excluded": built.stats.deprecated_excluded,
      "Species indexed": built.stats.species,
      "Runtime artifacts": built.stats.runtime_artifacts,
      "Bootstrap errors": 0,
    },
    artifacts: ARTIFACTS.map((name) => `data/runtime/${name}`),
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${REPORT_PATH}`);
  return built;
}

function main() {
  runProteinFoodBootstrap();
}

export {
  ARTIFACTS,
  VOCAB_FIELDS,
  VOCAB,
  PLANT_FUNGI_GROUPS,
  fieldValue,
  sortKeysDeep,
  serializeRuntime,
  bootstrap as compileProteinFoodRuntime,
  runProteinFoodBootstrap,
};

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
