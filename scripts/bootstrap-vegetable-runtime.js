#!/usr/bin/env node
/**
 * FOOD-05C.1 — Bootstrap vegetable catalog into runtime indexes.
 * Read-only compiler: never modifies data/vegetable-catalog.json.
 *
 * Run: node scripts/bootstrap-vegetable-runtime.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/vegetable-catalog.json");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const REPORT_PATH = path.join(ROOT, "reports/vegetable-runtime-bootstrap-report.json");

const VOCAB_FIELDS = [
  "culinary_group",
  "culinary_role",
  "plant_part",
  "flavor_intensity",
  "texture",
  "moisture_class",
  "seasonality",
];

const VOCAB = {
  culinary_group: new Set(["alliums", "green_vegetables", "root_vegetables", "nightshades"]),
  culinary_role: new Set([
    "primary", "aromatic", "leafy", "cruciferous", "root", "fruit_vegetable",
    "bulb", "stem", "flower", "pod",
  ]),
  plant_part: new Set([
    "leaf", "stem", "bulb", "root", "tuber", "flower", "pod", "fruit_vegetable", "mixed",
  ]),
  flavor_intensity: new Set(["mild", "moderate", "bold", "pungent"]),
  texture: new Set(["crisp", "tender", "fibrous", "succulent", "dense", "leafy"]),
  moisture_class: new Set(["high", "medium", "low"]),
  seasonality: new Set(["spring", "summer", "fall", "winter", "year_round", "mixed"]),
};

const ARTIFACTS = [
  "vegetable-bootstrap.json",
  "vegetable-categories.json",
  "vegetable-groups.json",
  "vegetable-indexes.json",
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

function serializeRuntime(data) {
  return `${JSON.stringify(sortKeysDeep(data), null, 2)}\n`;
}

function writeJson(filePath, data) {
  const text = serializeRuntime(data);
  fs.writeFileSync(filePath, text, "utf8");
  return text;
}

function requireAuditPass() {
  const result = spawnSync("node", ["scripts/catalog-audit-vegetable-05b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function vegetableRef(vegetable) {
  return {
    id: vegetable.id,
    slug: vegetable.slug,
    display_name: vegetable.display_name,
    parent_group: vegetable.parent_group,
    scientific_name: vegetable.scientific_name,
    culinary_group: vegetable.culinary_group,
    culinary_role: vegetable.culinary_role,
    plant_part: vegetable.plant_part,
    flavor_intensity: vegetable.flavor_intensity,
    texture: vegetable.texture,
    moisture_class: vegetable.moisture_class,
    seasonality: vegetable.seasonality,
    origin_context: vegetable.origin_context ?? "",
    catalog_version: vegetable.catalog_version,
    food_ontology_version: vegetable.food_ontology_version,
  };
}

function fieldValue(vegetable, field) {
  if (field === "origin_context") return vegetable.origin_context ?? "";
  return vegetable[field];
}

function validateForBootstrap(catalog) {
  const errors = [];
  const ids = new Set();
  const slugs = new Set();
  const groupSlugs = new Set(catalog.groups.map((g) => g.slug));
  const categorySlugs = new Set(catalog.categories.map((c) => c.slug));

  for (const vegetable of catalog.vegetables) {
    if (ids.has(vegetable.id)) errors.push(`Duplicate id: ${vegetable.id}`);
    ids.add(vegetable.id);
    if (slugs.has(vegetable.slug)) errors.push(`Duplicate slug: ${vegetable.slug}`);
    slugs.add(vegetable.slug);
    if (!groupSlugs.has(vegetable.parent_group)) {
      errors.push(`Broken hierarchy: ${vegetable.slug} parent_group ${vegetable.parent_group}`);
    }

    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(vegetable, field);
      if (val === undefined || val === null) {
        errors.push(`${vegetable.slug}: missing ${field}`);
      } else if (VOCAB[field] && !VOCAB[field].has(val)) {
        errors.push(`${vegetable.slug}: invalid ${field} "${val}"`);
      }
    }

    if (!vegetable.scientific_name || !vegetable.scientific_name.includes(" ")) {
      errors.push(`${vegetable.slug}: invalid or missing scientific_name`);
    }
    if (!Array.isArray(vegetable.flavor_profile) || vegetable.flavor_profile.length > 0) {
      errors.push(`${vegetable.slug}: flavor_profile must be empty array in FOOD-05C`);
    }
    if (!vegetable.external_ids || typeof vegetable.external_ids !== "object") {
      errors.push(`${vegetable.slug}: missing external_ids object`);
    }
  }

  for (const g of catalog.groups) {
    if (!categorySlugs.has(g.parent_category)) {
      errors.push(`Group ${g.slug} orphan parent_category`);
    }
    const vegetables = catalog.vegetables
      .filter((v) => v.parent_group === g.slug)
      .map((v) => v.slug);
    for (const s of g.child_slugs) {
      if (!vegetables.includes(s)) errors.push(`Group ${g.slug} missing vegetable ${s}`);
    }
  }

  return errors;
}

function buildVocabularyIndex(vegetables) {
  const index = Object.fromEntries(VOCAB_FIELDS.map((f) => [f, {}]));
  for (const vegetable of vegetables) {
    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(vegetable, field);
      const key = val ?? "";
      if (!index[field][key]) index[field][key] = [];
      index[field][key].push(vegetable.id);
    }
  }
  for (const field of VOCAB_FIELDS) {
    for (const key of Object.keys(index[field])) {
      index[field][key].sort();
    }
  }
  return index;
}

function buildNamespaceLookup(categories, groups, vegetables) {
  const byNamespace = {
    "food.vegetable": categories.map((c) => c.id).sort(),
  };
  for (const group of groups) {
    byNamespace[group.id] = vegetables
      .filter((v) => v.parent_group === group.slug)
      .map((v) => v.id)
      .sort();
  }
  return byNamespace;
}

function bootstrap(catalog) {
  const vegetables = [...catalog.vegetables].sort((a, b) => a.id.localeCompare(b.id));
  const groups = [...catalog.groups].sort((a, b) => a.slug.localeCompare(b.slug));
  const categories = [...catalog.categories].sort((a, b) => a.slug.localeCompare(b.slug));

  const byId = {};
  const bySlug = {};
  const byCulinaryRole = {};
  const byDisplayName = {};
  const byScientificName = {};

  for (const vegetable of vegetables) {
    byId[vegetable.id] = vegetableRef(vegetable);
    bySlug[vegetable.slug] = vegetable.id;

    if (!byCulinaryRole[vegetable.culinary_role]) byCulinaryRole[vegetable.culinary_role] = [];
    byCulinaryRole[vegetable.culinary_role].push(vegetable.id);

    const nameKey = vegetable.display_name.trim().toLowerCase();
    if (!byDisplayName[nameKey]) byDisplayName[nameKey] = [];
    byDisplayName[nameKey].push(vegetable.id);

    if (vegetable.scientific_name) {
      if (!byScientificName[vegetable.scientific_name]) byScientificName[vegetable.scientific_name] = [];
      byScientificName[vegetable.scientific_name].push(vegetable.id);
    }
  }

  for (const key of Object.keys(byCulinaryRole)) byCulinaryRole[key].sort();
  for (const key of Object.keys(byDisplayName)) byDisplayName[key].sort();
  for (const key of Object.keys(byScientificName)) byScientificName[key].sort();

  const categoryToGroups = {};
  const groupToCategory = {};
  const groupToVegetables = {};
  const vegetableToGroup = {};

  for (const cat of categories) {
    categoryToGroups[cat.slug] = [...cat.child_slugs].sort();
  }

  for (const group of groups) {
    groupToCategory[group.slug] = group.parent_category;
    const childIds = group.child_slugs
      .map((slug) => bySlug[slug])
      .filter(Boolean)
      .sort();
    groupToVegetables[group.slug] = childIds;
  }

  for (const vegetable of vegetables) {
    vegetableToGroup[vegetable.slug] = vegetable.parent_group;
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
    vegetable_slugs: [...group.child_slugs].sort(),
    vegetable_ids: group.child_slugs.map((s) => bySlug[s]).sort(),
  }));

  const vocabularyIndex = buildVocabularyIndex(vegetables);
  const byNamespace = buildNamespaceLookup(categories, groups, vegetables);

  const bootstrapDoc = {
    meta: {
      domain: "vegetable",
      source: "data/vegetable-catalog.json",
      catalog_version: catalog.meta.catalog_version,
      food_ontology_version: catalog.meta.food_ontology_version,
      entity_count: vegetables.length,
      group_count: groups.length,
      category_count: categories.length,
      bootstrapped_at: catalog.meta.catalog_version,
      phase: "FOOD-05C.1",
      runtime_stability_levels: {
        level_1_structural: "hierarchy only — belongs_to_*, group_contains, category_contains",
        level_2_intrinsic_similarity: "shares_* from intrinsic metadata — FOOD-05C.3",
        level_3_editorial: "reserved FOOD-05D — not generated in runtime bootstrap",
      },
    },
    hierarchy: {
      category_to_groups: categoryToGroups,
      group_to_category: groupToCategory,
      group_to_vegetables: groupToVegetables,
      vegetable_to_group: vegetableToGroup,
    },
  };

  const indexesDoc = {
    meta: {
      domain: "vegetable",
      catalog_version: catalog.meta.catalog_version,
      phase: "FOOD-05C.1",
    },
    by_id: byId,
    by_slug: bySlug,
    by_namespace: byNamespace,
    by_display_name: byDisplayName,
    by_scientific_name: byScientificName,
    by_culinary_role: byCulinaryRole,
    vocabulary: vocabularyIndex,
  };

  return {
    bootstrapDoc,
    categoriesOut,
    groupsOut,
    indexesDoc,
    stats: {
      categories: categoriesOut.length,
      groups: groupsOut.length,
      vegetables: vegetables.length,
      culinary_roles: Object.keys(byCulinaryRole).length,
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
      phase: "FOOD-05C.1",
      domain: "vegetable",
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
  writeJson(path.join(RUNTIME_DIR, ARTIFACTS[0]), built.bootstrapDoc);
  writeJson(path.join(RUNTIME_DIR, ARTIFACTS[1]), built.categoriesOut);
  writeJson(path.join(RUNTIME_DIR, ARTIFACTS[2]), built.groupsOut);
  writeJson(path.join(RUNTIME_DIR, ARTIFACTS[3]), built.indexesDoc);

  const catalogMtimeAfter = fs.statSync(CATALOG_PATH).mtimeMs;
  if (catalogMtimeBefore !== catalogMtimeAfter) {
    throw new Error("Bootstrap modified catalog file timestamp — aborting");
  }

  const report = {
    phase: "FOOD-05C.1",
    domain: "vegetable",
    catalog_version: catalog.meta.catalog_version,
    overall_result: "PASS",
    bootstrap_errors: [],
    metrics: {
      "Categories indexed": built.stats.categories,
      "Groups indexed": built.stats.groups,
      "Vegetables indexed": built.stats.vegetables,
      "Culinary roles indexed": built.stats.culinary_roles,
      "Runtime artifacts": built.stats.runtime_artifacts,
      "Bootstrap errors": 0,
    },
    artifacts: ARTIFACTS.map((name) => `data/runtime/${name}`),
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${REPORT_PATH}`);
}

export {
  ARTIFACTS,
  VOCAB_FIELDS,
  VOCAB,
  fieldValue,
  sortKeysDeep,
  serializeRuntime,
  bootstrap as compileVegetableRuntime,
};

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
