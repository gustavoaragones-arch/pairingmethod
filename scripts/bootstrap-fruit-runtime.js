#!/usr/bin/env node
/**
 * FOOD-09C.1 — Bootstrap fruit catalog into runtime indexes.
 * Read-only compiler: never modifies data/fruit-catalog.json.
 *
 * Run: node scripts/bootstrap-fruit-runtime.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/fruit-catalog.json");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const REPORT_PATH = path.join(ROOT, "reports/fruit-runtime-bootstrap-report.json");

const VOCAB_FIELDS = ["culinary_group", "usage_intensity"];

const VOCAB = {
  culinary_group: new Set(["pomes", "stone_fruits", "citrus", "berries", "tropical_fruits", "melons", "processed_fruits"]),
  usage_intensity: new Set(["primary", "accent", "luxury"]),
};

const RESERVED_PROFILE_FIELDS = ["flavor_profile", "texture_profile", "aroma_profile"];

const ARTIFACTS = [
  "fruit-bootstrap.json",
  "fruit-categories.json",
  "fruit-groups.json",
  "fruit-indexes.json",
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
  const result = spawnSync("node", ["scripts/catalog-audit-fruit-09b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function fruitRef(fruit) {
  return {
    id: fruit.id,
    slug: fruit.slug,
    display_name: fruit.display_name,
    parent_group: fruit.parent_group,
    parent_category: fruit.parent_category,
    scientific_name: fruit.scientific_name,
    culinary_group: fruit.culinary_group,
    usage_intensity: fruit.usage_intensity,
    origin_context: fruit.origin_context ?? "",
    catalog_version: fruit.catalog_version,
    food_ontology_version: fruit.food_ontology_version,
  };
}

function fieldValue(fruit, field) {
  if (field === "origin_context") return fruit.origin_context ?? "";
  return fruit[field];
}

function validateForBootstrap(catalog) {
  const errors = [];
  const ids = new Set();
  const slugs = new Set();
  const groupSlugs = new Set(catalog.groups.map((g) => g.slug));
  const categorySlugs = new Set(catalog.categories.map((c) => c.slug));

  for (const fruit of catalog.fruits) {
    if (ids.has(fruit.id)) errors.push(`Duplicate id: ${fruit.id}`);
    ids.add(fruit.id);
    if (slugs.has(fruit.slug)) errors.push(`Duplicate slug: ${fruit.slug}`);
    slugs.add(fruit.slug);
    if (!groupSlugs.has(fruit.parent_group)) {
      errors.push(`Broken hierarchy: ${fruit.slug} parent_group ${fruit.parent_group}`);
    }
    if (fruit.parent_category !== "fruit") {
      errors.push(`${fruit.slug}: parent_category must be fruit`);
    }

    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(fruit, field);
      if (val === undefined || val === null) {
        errors.push(`${fruit.slug}: missing ${field}`);
      } else if (VOCAB[field] && !VOCAB[field].has(val)) {
        errors.push(`${fruit.slug}: invalid ${field} "${val}"`);
      }
    }

    if (!fruit.scientific_name || !fruit.scientific_name.includes(" ")) {
      errors.push(`${fruit.slug}: invalid or missing scientific_name`);
    }

    for (const field of RESERVED_PROFILE_FIELDS) {
      if (!Array.isArray(fruit[field]) || fruit[field].length > 0) {
        errors.push(`${fruit.slug}: ${field} must be empty array in FOOD-09C`);
      }
    }

    if (!fruit.external_ids || typeof fruit.external_ids !== "object") {
      errors.push(`${fruit.slug}: missing external_ids object`);
    }
  }

  for (const g of catalog.groups) {
    if (!categorySlugs.has(g.parent_category)) {
      errors.push(`Group ${g.slug} orphan parent_category`);
    }
    const fruites = catalog.fruits
      .filter((h) => h.parent_group === g.slug)
      .map((f) => f.slug);
    for (const s of g.child_slugs) {
      if (!fruites.includes(s)) errors.push(`Group ${g.slug} missing fruit ${s}`);
    }
  }

  return errors;
}

function buildVocabularyIndex(fruites) {
  const index = Object.fromEntries(VOCAB_FIELDS.map((f) => [f, {}]));
  for (const fruit of fruites) {
    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(fruit, field);
      const key = val ?? "";
      if (!index[field][key]) index[field][key] = [];
      index[field][key].push(fruit.id);
    }
  }
  for (const field of VOCAB_FIELDS) {
    for (const key of Object.keys(index[field])) {
      index[field][key].sort();
    }
  }
  return index;
}

function buildNamespaceLookup(categories, groups, fruites) {
  const byNamespace = {
    "food.fruit": categories.map((c) => c.id).sort(),
  };
  for (const group of groups) {
    byNamespace[group.id] = fruites
      .filter((h) => h.parent_group === group.slug)
      .map((h) => h.id)
      .sort();
  }
  return byNamespace;
}

function bootstrap(catalog) {
  const fruites = [...catalog.fruits].sort((a, b) => a.id.localeCompare(b.id));
  const groups = [...catalog.groups].sort((a, b) => a.slug.localeCompare(b.slug));
  const categories = [...catalog.categories].sort((a, b) => a.slug.localeCompare(b.slug));

  const byId = {};
  const bySlug = {};
  const byUsageIntensity = {};
  const byGroup = {};
  const byDisplayName = {};
  const byScientificName = {};

  for (const fruit of fruites) {
    byId[fruit.id] = fruitRef(fruit);
    bySlug[fruit.slug] = fruit.id;

    if (!byUsageIntensity[fruit.usage_intensity]) byUsageIntensity[fruit.usage_intensity] = [];
    byUsageIntensity[fruit.usage_intensity].push(fruit.id);

    if (!byGroup[fruit.parent_group]) byGroup[fruit.parent_group] = [];
    byGroup[fruit.parent_group].push(fruit.id);

    const nameKey = fruit.display_name.trim().toLowerCase();
    if (!byDisplayName[nameKey]) byDisplayName[nameKey] = [];
    byDisplayName[nameKey].push(fruit.id);

    if (fruit.scientific_name) {
      if (!byScientificName[fruit.scientific_name]) byScientificName[fruit.scientific_name] = [];
      byScientificName[fruit.scientific_name].push(fruit.id);
    }
  }

  for (const key of Object.keys(byUsageIntensity)) byUsageIntensity[key].sort();
  for (const key of Object.keys(byGroup)) byGroup[key].sort();
  for (const key of Object.keys(byDisplayName)) byDisplayName[key].sort();
  for (const key of Object.keys(byScientificName)) byScientificName[key].sort();

  const categoryToGroups = {};
  const groupToCategory = {};
  const groupToGrainStarches = {};
  const fruitToGroup = {};

  for (const cat of categories) {
    categoryToGroups[cat.slug] = [...cat.child_slugs].sort();
  }

  for (const group of groups) {
    groupToCategory[group.slug] = group.parent_category;
    const childIds = group.child_slugs
      .map((slug) => bySlug[slug])
      .filter(Boolean)
      .sort();
    groupToGrainStarches[group.slug] = childIds;
  }

  for (const fruit of fruites) {
    fruitToGroup[fruit.slug] = fruit.parent_group;
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
    fruit_slugs: [...group.child_slugs].sort(),
    fruit_ids: group.child_slugs.map((s) => bySlug[s]).sort(),
  }));

  const vocabularyIndex = buildVocabularyIndex(fruites);
  const byNamespace = buildNamespaceLookup(categories, groups, fruites);

  const bootstrapDoc = {
    meta: {
      domain: "fruit",
      source: "data/fruit-catalog.json",
      catalog_version: catalog.meta.catalog_version,
      food_ontology_version: catalog.meta.food_ontology_version,
      entity_count: fruites.length,
      group_count: groups.length,
      category_count: categories.length,
      bootstrapped_at: catalog.meta.catalog_version,
      phase: "FOOD-09C.1",
      runtime_projection_principle:
        "Runtime artifacts are projections, never sources of truth — catalog is authoritative",
      runtime_stability_levels: {
        level_1_structural: "hierarchy only — belongs_to_*, group_contains, category_contains",
        level_2_intrinsic_similarity: "shares_usage_intensity, shares_scientific_name — FOOD-09C.3",
        level_3_editorial: "reserved FOOD-09D — not generated in runtime bootstrap",
      },
    },
    hierarchy: {
      category_to_groups: categoryToGroups,
      group_to_category: groupToCategory,
      group_to_fruits: groupToGrainStarches,
      fruit_to_group: fruitToGroup,
    },
  };

  const indexesDoc = {
    meta: {
      domain: "fruit",
      catalog_version: catalog.meta.catalog_version,
      phase: "FOOD-09C.1",
    },
    by_id: byId,
    by_slug: bySlug,
    by_namespace: byNamespace,
    by_display_name: byDisplayName,
    by_scientific_name: byScientificName,
    by_usage_intensity: byUsageIntensity,
    by_group: byGroup,
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
      fruits: fruites.length,
      usage_intensities: Object.keys(byUsageIntensity).length,
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
      phase: "FOOD-09C.1",
      domain: "fruit",
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
    phase: "FOOD-09C.1",
    domain: "fruit",
    catalog_version: catalog.meta.catalog_version,
    overall_result: "PASS",
    bootstrap_errors: [],
    metrics: {
      "Categories indexed": built.stats.categories,
      "Groups indexed": built.stats.groups,
      "Fruit entities indexed": built.stats.fruits,
      "Usage intensities indexed": built.stats.usage_intensities,
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
  RESERVED_PROFILE_FIELDS,
  fieldValue,
  sortKeysDeep,
  serializeRuntime,
  bootstrap as compileFruitRuntime,
};

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
