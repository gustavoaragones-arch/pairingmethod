#!/usr/bin/env node
/**
 * FOOD-07C.1 — Bootstrap herb & spice catalog into runtime indexes.
 * Read-only compiler: never modifies data/herb-spice-catalog.json.
 *
 * Run: node scripts/bootstrap-herb-spice-runtime.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/herb-spice-catalog.json");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const REPORT_PATH = path.join(ROOT, "reports/herb-spice-runtime-bootstrap-report.json");

const VOCAB_FIELDS = ["culinary_group", "usage_intensity"];

const VOCAB = {
  culinary_group: new Set([
    "fresh_herbs",
    "dried_herbs",
    "whole_spices",
    "ground_blended_spices",
  ]),
  usage_intensity: new Set(["primary", "accent", "luxury"]),
};

const RESERVED_PROFILE_FIELDS = ["flavor_profile", "texture_profile", "aroma_profile"];

const ARTIFACTS = [
  "herb-spice-bootstrap.json",
  "herb-spice-categories.json",
  "herb-spice-groups.json",
  "herb-spice-indexes.json",
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
  const result = spawnSync("node", ["scripts/catalog-audit-herb-spice-07b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function herbSpiceRef(herbSpice) {
  return {
    id: herbSpice.id,
    slug: herbSpice.slug,
    display_name: herbSpice.display_name,
    parent_group: herbSpice.parent_group,
    parent_category: herbSpice.parent_category,
    scientific_name: herbSpice.scientific_name,
    culinary_group: herbSpice.culinary_group,
    usage_intensity: herbSpice.usage_intensity,
    origin_context: herbSpice.origin_context ?? "",
    catalog_version: herbSpice.catalog_version,
    food_ontology_version: herbSpice.food_ontology_version,
  };
}

function fieldValue(herbSpice, field) {
  if (field === "origin_context") return herbSpice.origin_context ?? "";
  return herbSpice[field];
}

function validateForBootstrap(catalog) {
  const errors = [];
  const ids = new Set();
  const slugs = new Set();
  const groupSlugs = new Set(catalog.groups.map((g) => g.slug));
  const categorySlugs = new Set(catalog.categories.map((c) => c.slug));

  for (const herbSpice of catalog.herb_spices) {
    if (ids.has(herbSpice.id)) errors.push(`Duplicate id: ${herbSpice.id}`);
    ids.add(herbSpice.id);
    if (slugs.has(herbSpice.slug)) errors.push(`Duplicate slug: ${herbSpice.slug}`);
    slugs.add(herbSpice.slug);
    if (!groupSlugs.has(herbSpice.parent_group)) {
      errors.push(`Broken hierarchy: ${herbSpice.slug} parent_group ${herbSpice.parent_group}`);
    }
    if (herbSpice.parent_category !== "herb") {
      errors.push(`${herbSpice.slug}: parent_category must be herb`);
    }

    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(herbSpice, field);
      if (val === undefined || val === null) {
        errors.push(`${herbSpice.slug}: missing ${field}`);
      } else if (VOCAB[field] && !VOCAB[field].has(val)) {
        errors.push(`${herbSpice.slug}: invalid ${field} "${val}"`);
      }
    }

    if (!herbSpice.scientific_name || !herbSpice.scientific_name.includes(" ")) {
      errors.push(`${herbSpice.slug}: invalid or missing scientific_name`);
    }

    for (const field of RESERVED_PROFILE_FIELDS) {
      if (!Array.isArray(herbSpice[field]) || herbSpice[field].length > 0) {
        errors.push(`${herbSpice.slug}: ${field} must be empty array in FOOD-07C`);
      }
    }

    if (!herbSpice.external_ids || typeof herbSpice.external_ids !== "object") {
      errors.push(`${herbSpice.slug}: missing external_ids object`);
    }
  }

  for (const g of catalog.groups) {
    if (!categorySlugs.has(g.parent_category)) {
      errors.push(`Group ${g.slug} orphan parent_category`);
    }
    const herbSpices = catalog.herb_spices.filter((h) => h.parent_group === g.slug).map((f) => f.slug);
    for (const s of g.child_slugs) {
      if (!herbSpices.includes(s)) errors.push(`Group ${g.slug} missing herb_spice ${s}`);
    }
  }

  return errors;
}

function buildVocabularyIndex(herbSpices) {
  const index = Object.fromEntries(VOCAB_FIELDS.map((f) => [f, {}]));
  for (const herbSpice of herbSpices) {
    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(herbSpice, field);
      const key = val ?? "";
      if (!index[field][key]) index[field][key] = [];
      index[field][key].push(herbSpice.id);
    }
  }
  for (const field of VOCAB_FIELDS) {
    for (const key of Object.keys(index[field])) {
      index[field][key].sort();
    }
  }
  return index;
}

function buildNamespaceLookup(categories, groups, herbSpices) {
  const byNamespace = {
    "food.herb": categories.map((c) => c.id).sort(),
  };
  for (const group of groups) {
    byNamespace[group.id] = herbSpices
      .filter((h) => h.parent_group === group.slug)
      .map((h) => h.id)
      .sort();
  }
  return byNamespace;
}

function bootstrap(catalog) {
  const herbSpices = [...catalog.herb_spices].sort((a, b) => a.id.localeCompare(b.id));
  const groups = [...catalog.groups].sort((a, b) => a.slug.localeCompare(b.slug));
  const categories = [...catalog.categories].sort((a, b) => a.slug.localeCompare(b.slug));

  const byId = {};
  const bySlug = {};
  const byUsageIntensity = {};
  const byGroup = {};
  const byDisplayName = {};
  const byScientificName = {};

  for (const herbSpice of herbSpices) {
    byId[herbSpice.id] = herbSpiceRef(herbSpice);
    bySlug[herbSpice.slug] = herbSpice.id;

    if (!byUsageIntensity[herbSpice.usage_intensity]) byUsageIntensity[herbSpice.usage_intensity] = [];
    byUsageIntensity[herbSpice.usage_intensity].push(herbSpice.id);

    if (!byGroup[herbSpice.parent_group]) byGroup[herbSpice.parent_group] = [];
    byGroup[herbSpice.parent_group].push(herbSpice.id);

    const nameKey = herbSpice.display_name.trim().toLowerCase();
    if (!byDisplayName[nameKey]) byDisplayName[nameKey] = [];
    byDisplayName[nameKey].push(herbSpice.id);

    if (herbSpice.scientific_name) {
      if (!byScientificName[herbSpice.scientific_name]) byScientificName[herbSpice.scientific_name] = [];
      byScientificName[herbSpice.scientific_name].push(herbSpice.id);
    }
  }

  for (const key of Object.keys(byUsageIntensity)) byUsageIntensity[key].sort();
  for (const key of Object.keys(byGroup)) byGroup[key].sort();
  for (const key of Object.keys(byDisplayName)) byDisplayName[key].sort();
  for (const key of Object.keys(byScientificName)) byScientificName[key].sort();

  const categoryToGroups = {};
  const groupToCategory = {};
  const groupToFungi = {};
  const herbSpiceToGroup = {};

  for (const cat of categories) {
    categoryToGroups[cat.slug] = [...cat.child_slugs].sort();
  }

  for (const group of groups) {
    groupToCategory[group.slug] = group.parent_category;
    const childIds = group.child_slugs
      .map((slug) => bySlug[slug])
      .filter(Boolean)
      .sort();
    groupToFungi[group.slug] = childIds;
  }

  for (const herbSpice of herbSpices) {
    herbSpiceToGroup[herbSpice.slug] = herbSpice.parent_group;
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
    herb_spice_slugs: [...group.child_slugs].sort(),
    herb_spice_ids: group.child_slugs.map((s) => bySlug[s]).sort(),
  }));

  const vocabularyIndex = buildVocabularyIndex(herbSpices);
  const byNamespace = buildNamespaceLookup(categories, groups, herbSpices);

  const bootstrapDoc = {
    meta: {
      domain: "herb-spice",
      source: "data/herb-spice-catalog.json",
      catalog_version: catalog.meta.catalog_version,
      food_ontology_version: catalog.meta.food_ontology_version,
      entity_count: herbSpices.length,
      group_count: groups.length,
      category_count: categories.length,
      bootstrapped_at: catalog.meta.catalog_version,
      phase: "FOOD-07C.1",
      runtime_projection_principle:
        "Runtime artifacts are projections, never sources of truth — catalog is authoritative",
      runtime_stability_levels: {
        level_1_structural: "hierarchy only — belongs_to_*, group_contains, category_contains",
        level_2_intrinsic_similarity:
          "shares_usage_intensity, shares_scientific_name — FOOD-07C.3",
        level_3_editorial: "reserved FOOD-07D — not generated in runtime bootstrap",
      },
    },
    hierarchy: {
      category_to_groups: categoryToGroups,
      group_to_category: groupToCategory,
      group_to_herb_spices: groupToFungi,
      herb_spice_to_group: herbSpiceToGroup,
    },
  };

  const indexesDoc = {
    meta: {
      domain: "herb-spice",
      catalog_version: catalog.meta.catalog_version,
      phase: "FOOD-07C.1",
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
      herb_spices: herbSpices.length,
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
      phase: "FOOD-07C.1",
      domain: "herb-spice",
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
    phase: "FOOD-07C.1",
    domain: "herb-spice",
    catalog_version: catalog.meta.catalog_version,
    overall_result: "PASS",
    bootstrap_errors: [],
    metrics: {
      "Categories indexed": built.stats.categories,
      "Groups indexed": built.stats.groups,
      "Herb & spice entities indexed": built.stats.herb_spices,
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
  bootstrap as compileHerbSpiceRuntime,
};

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
