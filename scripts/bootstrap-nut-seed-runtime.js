#!/usr/bin/env node
/**
 * FOOD-10C.1 — Bootstrap nut-seed catalog into runtime indexes.
 * Read-only compiler: never modifies data/nut-seed-catalog.json.
 *
 * Run: node scripts/bootstrap-nut-seed-runtime.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/nut-seed-catalog.json");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const REPORT_PATH = path.join(ROOT, "reports/nut-seed-runtime-bootstrap-report.json");

const VOCAB_FIELDS = ["culinary_group", "usage_intensity"];

const VOCAB = {
  culinary_group: new Set([
    "tree_nuts",
    "peanuts",
    "edible_seeds",
    "seed_spices",
    "nut_products",
    "seed_products",
  ]),
  usage_intensity: new Set(["primary", "accent", "luxury"]),
};

const RESERVED_PROFILE_FIELDS = ["flavor_profile", "texture_profile", "aroma_profile"];

const ARTIFACTS = [
  "nut-seed-bootstrap.json",
  "nut-seed-categories.json",
  "nut-seed-groups.json",
  "nut-seed-indexes.json",
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
  const result = spawnSync("node", ["scripts/catalog-audit-nut-seed-10b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function nutSeedRef(entity) {
  return {
    id: entity.id,
    slug: entity.slug,
    display_name: entity.display_name,
    parent_group: entity.parent_group,
    parent_category: entity.parent_category,
    scientific_name: entity.scientific_name,
    culinary_group: entity.culinary_group,
    usage_intensity: entity.usage_intensity,
    origin_context: entity.origin_context ?? "",
    catalog_version: entity.catalog_version,
    food_ontology_version: entity.food_ontology_version,
  };
}

function fieldValue(entity, field) {
  if (field === "origin_context") return entity.origin_context ?? "";
  return entity[field];
}

function validateForBootstrap(catalog) {
  const errors = [];
  const ids = new Set();
  const slugs = new Set();
  const groupSlugs = new Set(catalog.groups.map((g) => g.slug));
  const categorySlugs = new Set(catalog.categories.map((c) => c.slug));
  const nutSeeds = catalog.nut_seeds ?? [];

  for (const entity of nutSeeds) {
    if (ids.has(entity.id)) errors.push(`Duplicate id: ${entity.id}`);
    ids.add(entity.id);
    if (slugs.has(entity.slug)) errors.push(`Duplicate slug: ${entity.slug}`);
    slugs.add(entity.slug);
    if (!groupSlugs.has(entity.parent_group)) {
      errors.push(`Broken hierarchy: ${entity.slug} parent_group ${entity.parent_group}`);
    }
    if (entity.parent_category !== "nut-seed") {
      errors.push(`${entity.slug}: parent_category must be nut-seed`);
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
        errors.push(`${entity.slug}: ${field} must be empty array in FOOD-10C`);
      }
    }

    if (!entity.external_ids || typeof entity.external_ids !== "object") {
      errors.push(`${entity.slug}: missing external_ids object`);
    }
  }

  for (const g of catalog.groups) {
    if (!categorySlugs.has(g.parent_category)) {
      errors.push(`Group ${g.slug} orphan parent_category`);
    }
    const groupEntities = nutSeeds.filter((h) => h.parent_group === g.slug).map((f) => f.slug);
    for (const s of g.child_slugs) {
      if (!groupEntities.includes(s)) errors.push(`Group ${g.slug} missing entity ${s}`);
    }
  }

  return errors;
}

function buildVocabularyIndex(nutSeeds) {
  const index = Object.fromEntries(VOCAB_FIELDS.map((f) => [f, {}]));
  for (const entity of nutSeeds) {
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

function buildNamespaceLookup(categories, groups, nutSeeds) {
  const byNamespace = {
    "food.nut-seed": categories.map((c) => c.id).sort(),
  };
  for (const group of groups) {
    byNamespace[group.id] = nutSeeds
      .filter((h) => h.parent_group === group.slug)
      .map((h) => h.id)
      .sort();
  }
  return byNamespace;
}

function bootstrap(catalog) {
  const nutSeeds = [...(catalog.nut_seeds ?? [])].sort((a, b) => a.id.localeCompare(b.id));
  const groups = [...catalog.groups].sort((a, b) => a.slug.localeCompare(b.slug));
  const categories = [...catalog.categories].sort((a, b) => a.slug.localeCompare(b.slug));

  const byId = {};
  const bySlug = {};
  const byUsageIntensity = {};
  const byGroup = {};
  const byDisplayName = {};
  const byScientificName = {};

  for (const entity of nutSeeds) {
    byId[entity.id] = nutSeedRef(entity);
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
  const groupToNutSeeds = {};
  const nutSeedToGroup = {};

  for (const cat of categories) {
    categoryToGroups[cat.slug] = [...cat.child_slugs].sort();
  }

  for (const group of groups) {
    groupToCategory[group.slug] = group.parent_category;
    const childIds = group.child_slugs
      .map((slug) => bySlug[slug])
      .filter(Boolean)
      .sort();
    groupToNutSeeds[group.slug] = childIds;
  }

  for (const entity of nutSeeds) {
    nutSeedToGroup[entity.slug] = entity.parent_group;
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
    nut_seed_slugs: [...group.child_slugs].sort(),
    nut_seed_ids: group.child_slugs.map((s) => bySlug[s]).sort(),
  }));

  const vocabularyIndex = buildVocabularyIndex(nutSeeds);
  const byNamespace = buildNamespaceLookup(categories, groups, nutSeeds);

  const bootstrapDoc = {
    meta: {
      domain: "nut-seed",
      source: "data/nut-seed-catalog.json",
      catalog_version: catalog.meta.catalog_version,
      food_ontology_version: catalog.meta.food_ontology_version,
      entity_count: nutSeeds.length,
      group_count: groups.length,
      category_count: categories.length,
      bootstrapped_at: catalog.meta.catalog_version,
      phase: "FOOD-10C.1",
      runtime_projection_principle:
        "Runtime artifacts are projections, never sources of truth — catalog is authoritative",
      runtime_stability_levels: {
        level_1_structural: "hierarchy only — belongs_to_*, group_contains, category_contains",
        level_2_intrinsic_similarity: "shares_usage_intensity, shares_scientific_name — FOOD-10C.3",
        level_3_editorial: "reserved FOOD-10D — not generated in runtime bootstrap",
      },
    },
    hierarchy: {
      category_to_groups: categoryToGroups,
      group_to_category: groupToCategory,
      group_to_nut_seeds: groupToNutSeeds,
      nut_seed_to_group: nutSeedToGroup,
    },
  };

  const indexesDoc = {
    meta: {
      domain: "nut-seed",
      catalog_version: catalog.meta.catalog_version,
      phase: "FOOD-10C.1",
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
      nut_seeds: nutSeeds.length,
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
      phase: "FOOD-10C.1",
      domain: "nut-seed",
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
    phase: "FOOD-10C.1",
    domain: "nut-seed",
    catalog_version: catalog.meta.catalog_version,
    overall_result: "PASS",
    bootstrap_errors: [],
    metrics: {
      "Categories indexed": built.stats.categories,
      "Groups indexed": built.stats.groups,
      "Nut & seed entities indexed": built.stats.nut_seeds,
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
  bootstrap as compileNutSeedRuntime,
};

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
