#!/usr/bin/env node
/**
 * FOOD-06C.1 — Bootstrap fungi catalog into runtime indexes.
 * Read-only compiler: never modifies data/fungi-catalog.json.
 *
 * Run: node scripts/bootstrap-fungi-runtime.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/fungi-catalog.json");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const REPORT_PATH = path.join(ROOT, "reports/fungi-runtime-bootstrap-report.json");

const VOCAB_FIELDS = ["culinary_group", "usage_intensity"];

const VOCAB = {
  culinary_group: new Set([
    "cultivated_mushrooms",
    "wild_mushrooms",
    "truffles",
    "specialty_fungi",
  ]),
  usage_intensity: new Set(["primary", "accent", "luxury"]),
};

const RESERVED_PROFILE_FIELDS = ["flavor_profile", "texture_profile", "aroma_profile"];

const ARTIFACTS = [
  "fungi-bootstrap.json",
  "fungi-categories.json",
  "fungi-groups.json",
  "fungi-indexes.json",
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
  const result = spawnSync("node", ["scripts/catalog-audit-fungi-06b.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function fungusRef(fungus) {
  return {
    id: fungus.id,
    slug: fungus.slug,
    display_name: fungus.display_name,
    parent_group: fungus.parent_group,
    parent_category: fungus.parent_category,
    scientific_name: fungus.scientific_name,
    culinary_group: fungus.culinary_group,
    usage_intensity: fungus.usage_intensity,
    origin_context: fungus.origin_context ?? "",
    catalog_version: fungus.catalog_version,
    food_ontology_version: fungus.food_ontology_version,
  };
}

function fieldValue(fungus, field) {
  if (field === "origin_context") return fungus.origin_context ?? "";
  return fungus[field];
}

function validateForBootstrap(catalog) {
  const errors = [];
  const ids = new Set();
  const slugs = new Set();
  const groupSlugs = new Set(catalog.groups.map((g) => g.slug));
  const categorySlugs = new Set(catalog.categories.map((c) => c.slug));

  for (const fungus of catalog.fungi) {
    if (ids.has(fungus.id)) errors.push(`Duplicate id: ${fungus.id}`);
    ids.add(fungus.id);
    if (slugs.has(fungus.slug)) errors.push(`Duplicate slug: ${fungus.slug}`);
    slugs.add(fungus.slug);
    if (!groupSlugs.has(fungus.parent_group)) {
      errors.push(`Broken hierarchy: ${fungus.slug} parent_group ${fungus.parent_group}`);
    }
    if (fungus.parent_category !== "fungi") {
      errors.push(`${fungus.slug}: parent_category must be fungi`);
    }

    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(fungus, field);
      if (val === undefined || val === null) {
        errors.push(`${fungus.slug}: missing ${field}`);
      } else if (VOCAB[field] && !VOCAB[field].has(val)) {
        errors.push(`${fungus.slug}: invalid ${field} "${val}"`);
      }
    }

    if (!fungus.scientific_name || !fungus.scientific_name.includes(" ")) {
      errors.push(`${fungus.slug}: invalid or missing scientific_name`);
    }

    for (const field of RESERVED_PROFILE_FIELDS) {
      if (!Array.isArray(fungus[field]) || fungus[field].length > 0) {
        errors.push(`${fungus.slug}: ${field} must be empty array in FOOD-06C`);
      }
    }

    if (!fungus.external_ids || typeof fungus.external_ids !== "object") {
      errors.push(`${fungus.slug}: missing external_ids object`);
    }
  }

  for (const g of catalog.groups) {
    if (!categorySlugs.has(g.parent_category)) {
      errors.push(`Group ${g.slug} orphan parent_category`);
    }
    const fungi = catalog.fungi.filter((f) => f.parent_group === g.slug).map((f) => f.slug);
    for (const s of g.child_slugs) {
      if (!fungi.includes(s)) errors.push(`Group ${g.slug} missing fungus ${s}`);
    }
  }

  return errors;
}

function buildVocabularyIndex(fungi) {
  const index = Object.fromEntries(VOCAB_FIELDS.map((f) => [f, {}]));
  for (const fungus of fungi) {
    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(fungus, field);
      const key = val ?? "";
      if (!index[field][key]) index[field][key] = [];
      index[field][key].push(fungus.id);
    }
  }
  for (const field of VOCAB_FIELDS) {
    for (const key of Object.keys(index[field])) {
      index[field][key].sort();
    }
  }
  return index;
}

function buildNamespaceLookup(categories, groups, fungi) {
  const byNamespace = {
    "food.fungi": categories.map((c) => c.id).sort(),
  };
  for (const group of groups) {
    byNamespace[group.id] = fungi
      .filter((f) => f.parent_group === group.slug)
      .map((f) => f.id)
      .sort();
  }
  return byNamespace;
}

function bootstrap(catalog) {
  const fungi = [...catalog.fungi].sort((a, b) => a.id.localeCompare(b.id));
  const groups = [...catalog.groups].sort((a, b) => a.slug.localeCompare(b.slug));
  const categories = [...catalog.categories].sort((a, b) => a.slug.localeCompare(b.slug));

  const byId = {};
  const bySlug = {};
  const byUsageIntensity = {};
  const byGroup = {};
  const byDisplayName = {};
  const byScientificName = {};

  for (const fungus of fungi) {
    byId[fungus.id] = fungusRef(fungus);
    bySlug[fungus.slug] = fungus.id;

    if (!byUsageIntensity[fungus.usage_intensity]) byUsageIntensity[fungus.usage_intensity] = [];
    byUsageIntensity[fungus.usage_intensity].push(fungus.id);

    if (!byGroup[fungus.parent_group]) byGroup[fungus.parent_group] = [];
    byGroup[fungus.parent_group].push(fungus.id);

    const nameKey = fungus.display_name.trim().toLowerCase();
    if (!byDisplayName[nameKey]) byDisplayName[nameKey] = [];
    byDisplayName[nameKey].push(fungus.id);

    if (fungus.scientific_name) {
      if (!byScientificName[fungus.scientific_name]) byScientificName[fungus.scientific_name] = [];
      byScientificName[fungus.scientific_name].push(fungus.id);
    }
  }

  for (const key of Object.keys(byUsageIntensity)) byUsageIntensity[key].sort();
  for (const key of Object.keys(byGroup)) byGroup[key].sort();
  for (const key of Object.keys(byDisplayName)) byDisplayName[key].sort();
  for (const key of Object.keys(byScientificName)) byScientificName[key].sort();

  const categoryToGroups = {};
  const groupToCategory = {};
  const groupToFungi = {};
  const fungusToGroup = {};

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

  for (const fungus of fungi) {
    fungusToGroup[fungus.slug] = fungus.parent_group;
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
    fungus_slugs: [...group.child_slugs].sort(),
    fungus_ids: group.child_slugs.map((s) => bySlug[s]).sort(),
  }));

  const vocabularyIndex = buildVocabularyIndex(fungi);
  const byNamespace = buildNamespaceLookup(categories, groups, fungi);

  const bootstrapDoc = {
    meta: {
      domain: "fungi",
      source: "data/fungi-catalog.json",
      catalog_version: catalog.meta.catalog_version,
      food_ontology_version: catalog.meta.food_ontology_version,
      entity_count: fungi.length,
      group_count: groups.length,
      category_count: categories.length,
      bootstrapped_at: catalog.meta.catalog_version,
      phase: "FOOD-06C.1",
      runtime_projection_principle:
        "Runtime artifacts are projections, never sources of truth — catalog is authoritative",
      runtime_stability_levels: {
        level_1_structural: "hierarchy only — belongs_to_*, group_contains, category_contains",
        level_2_intrinsic_similarity:
          "shares_usage_intensity, shares_scientific_name — FOOD-06C.3",
        level_3_editorial: "reserved FOOD-06D — not generated in runtime bootstrap",
      },
    },
    hierarchy: {
      category_to_groups: categoryToGroups,
      group_to_category: groupToCategory,
      group_to_fungi: groupToFungi,
      fungus_to_group: fungusToGroup,
    },
  };

  const indexesDoc = {
    meta: {
      domain: "fungi",
      catalog_version: catalog.meta.catalog_version,
      phase: "FOOD-06C.1",
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
      fungi: fungi.length,
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
      phase: "FOOD-06C.1",
      domain: "fungi",
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
    phase: "FOOD-06C.1",
    domain: "fungi",
    catalog_version: catalog.meta.catalog_version,
    overall_result: "PASS",
    bootstrap_errors: [],
    metrics: {
      "Categories indexed": built.stats.categories,
      "Groups indexed": built.stats.groups,
      "Fungi indexed": built.stats.fungi,
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
  bootstrap as compileFungiRuntime,
};

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
