#!/usr/bin/env node
/**
 * FOOD-04C.1 — Bootstrap cheese catalog into runtime indexes.
 * Read-only compiler: never modifies data/cheese-catalog.json.
 *
 * Run: node scripts/bootstrap-cheese-catalog.js
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/cheese-catalog.json");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const REPORT_PATH = path.join(ROOT, "reports/cheese-bootstrap-report.json");

const VOCAB_FIELDS = [
  "cheese_category",
  "milk_source",
  "aging_class",
  "texture",
  "moisture_class",
  "rind_type",
  "pasteurization",
  "origin_country",
  "protected_status",
];

const VOCAB = {
  cheese_category: new Set([
    "fresh", "bloomy_rind", "washed_rind", "natural_rind", "blue",
    "semi_hard", "hard", "pasta_filata", "brined",
  ]),
  milk_source: new Set(["cow", "goat", "sheep", "buffalo", "mixed"]),
  aging_class: new Set(["unaged", "short_aged", "medium_aged", "long_aged", "extra_aged"]),
  texture: new Set(["soft", "semi_soft", "firm", "hard", "crumbly", "creamy", "granular", "elastic"]),
  moisture_class: new Set(["high", "medium", "low", "extra_low"]),
  rind_type: new Set([
    "none", "bloomy", "washed", "natural", "blue", "wax", "cloth", "leaf_wrapped", "smoked",
  ]),
  pasteurization: new Set(["raw", "pasteurized", "thermalized", "mixed", "unknown"]),
  origin_country: null,
  protected_status: new Set(["none", "PDO", "PGI", "AOP", "TSG", "other", "pending_documentation"]),
};

const SCIENTIFIC_NAMES = new Set(["Bos taurus", "Capra hircus", "Ovis aries", "Bubalus bubalis"]);

const ARTIFACTS = [
  "cheese-bootstrap.json",
  "cheese-categories.json",
  "cheese-groups.json",
  "cheese-indexes.json",
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
  const result = spawnSync("node", ["scripts/catalog-audit-cheese-04c.mjs"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Catalog audit failed";
    throw new Error(`Bootstrap blocked: catalog audit did not pass.\n${err}`);
  }
}

function cheeseRef(cheese) {
  return {
    id: cheese.id,
    slug: cheese.slug,
    display_name: cheese.display_name,
    parent_group: cheese.parent_group,
    scientific_name: cheese.scientific_name,
    cheese_category: cheese.cheese_category,
    milk_source: cheese.milk_source,
    aging_class: cheese.aging_class,
    texture: cheese.texture,
    moisture_class: cheese.moisture_class,
    rind_type: cheese.rind_type,
    pasteurization: cheese.pasteurization,
    origin_country: cheese.origin_country ?? "",
    protected_status: cheese.protected_status,
    catalog_version: cheese.catalog_version,
    food_ontology_version: cheese.food_ontology_version,
  };
}

function fieldValue(cheese, field) {
  if (field === "origin_country") return cheese.origin_country ?? "";
  return cheese[field];
}

function validateForBootstrap(catalog) {
  const errors = [];
  const ids = new Set();
  const slugs = new Set();
  const groupSlugs = new Set(catalog.groups.map((g) => g.slug));
  const categorySlugs = new Set(catalog.categories.map((c) => c.slug));

  for (const cheese of catalog.cheeses) {
    if (ids.has(cheese.id)) errors.push(`Duplicate id: ${cheese.id}`);
    ids.add(cheese.id);
    if (slugs.has(cheese.slug)) errors.push(`Duplicate slug: ${cheese.slug}`);
    slugs.add(cheese.slug);
    if (!groupSlugs.has(cheese.parent_group)) {
      errors.push(`Broken hierarchy: ${cheese.slug} parent_group ${cheese.parent_group}`);
    }

    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(cheese, field);
      if (val === undefined || val === null) {
        errors.push(`${cheese.slug}: missing ${field}`);
      } else if (VOCAB[field] && !VOCAB[field].has(val)) {
        errors.push(`${cheese.slug}: invalid ${field} "${val}"`);
      }
    }

    if (!cheese.scientific_name || !SCIENTIFIC_NAMES.has(cheese.scientific_name)) {
      errors.push(`${cheese.slug}: invalid or missing scientific_name`);
    }
    if (!cheese.external_ids || typeof cheese.external_ids !== "object") {
      errors.push(`${cheese.slug}: missing external_ids object`);
    }
  }

  for (const g of catalog.groups) {
    if (!categorySlugs.has(g.parent_category)) {
      errors.push(`Group ${g.slug} orphan parent_category`);
    }
    const cheeses = catalog.cheeses.filter((c) => c.parent_group === g.slug).map((c) => c.slug);
    for (const s of g.child_slugs) {
      if (!cheeses.includes(s)) errors.push(`Group ${g.slug} missing cheese ${s}`);
    }
  }

  return errors;
}

function buildVocabularyIndex(cheeses) {
  const index = Object.fromEntries(VOCAB_FIELDS.map((f) => [f, {}]));
  for (const cheese of cheeses) {
    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(cheese, field);
      const key = val ?? "";
      if (!index[field][key]) index[field][key] = [];
      index[field][key].push(cheese.id);
    }
  }
  for (const field of VOCAB_FIELDS) {
    for (const key of Object.keys(index[field])) {
      index[field][key].sort();
    }
  }
  return index;
}

function buildNamespaceLookup(categories, groups, cheeses) {
  const byNamespace = {
    "food.cheese": categories.map((c) => c.id).sort(),
  };
  for (const group of groups) {
    byNamespace[group.id] = cheeses
      .filter((c) => c.parent_group === group.slug)
      .map((c) => c.id)
      .sort();
  }
  return byNamespace;
}

function bootstrap(catalog) {
  const cheeses = [...catalog.cheeses].sort((a, b) => a.id.localeCompare(b.id));
  const groups = [...catalog.groups].sort((a, b) => a.slug.localeCompare(b.slug));
  const categories = [...catalog.categories].sort((a, b) => a.slug.localeCompare(b.slug));

  const byId = {};
  const bySlug = {};
  const byMilkSource = {};
  const byDisplayName = {};
  const byScientificName = {};

  for (const cheese of cheeses) {
    byId[cheese.id] = cheeseRef(cheese);
    bySlug[cheese.slug] = cheese.id;

    if (!byMilkSource[cheese.milk_source]) byMilkSource[cheese.milk_source] = [];
    byMilkSource[cheese.milk_source].push(cheese.id);

    const nameKey = cheese.display_name.trim().toLowerCase();
    if (!byDisplayName[nameKey]) byDisplayName[nameKey] = [];
    byDisplayName[nameKey].push(cheese.id);

    if (cheese.scientific_name) {
      if (!byScientificName[cheese.scientific_name]) byScientificName[cheese.scientific_name] = [];
      byScientificName[cheese.scientific_name].push(cheese.id);
    }
  }

  for (const key of Object.keys(byMilkSource)) byMilkSource[key].sort();
  for (const key of Object.keys(byDisplayName)) byDisplayName[key].sort();
  for (const key of Object.keys(byScientificName)) byScientificName[key].sort();

  const categoryToGroups = {};
  const groupToCategory = {};
  const groupToCheeses = {};
  const cheeseToGroup = {};

  for (const cat of categories) {
    categoryToGroups[cat.slug] = [...cat.child_slugs].sort();
  }

  for (const group of groups) {
    groupToCategory[group.slug] = group.parent_category;
    const childIds = group.child_slugs
      .map((slug) => bySlug[slug])
      .filter(Boolean)
      .sort();
    groupToCheeses[group.slug] = childIds;
  }

  for (const cheese of cheeses) {
    cheeseToGroup[cheese.slug] = cheese.parent_group;
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
    cheese_category: group.cheese_category,
    cheese_slugs: [...group.child_slugs].sort(),
    cheese_ids: group.child_slugs.map((s) => bySlug[s]).sort(),
  }));

  const vocabularyIndex = buildVocabularyIndex(cheeses);
  const byNamespace = buildNamespaceLookup(categories, groups, cheeses);

  const bootstrapDoc = {
    meta: {
      domain: "cheese",
      source: "data/cheese-catalog.json",
      catalog_version: catalog.meta.catalog_version,
      food_ontology_version: catalog.meta.food_ontology_version,
      entity_count: cheeses.length,
      group_count: groups.length,
      category_count: categories.length,
      bootstrapped_at: catalog.meta.catalog_version,
      phase: "FOOD-04C.1",
    },
    hierarchy: {
      category_to_groups: categoryToGroups,
      group_to_category: groupToCategory,
      group_to_cheeses: groupToCheeses,
      cheese_to_group: cheeseToGroup,
    },
  };

  const indexesDoc = {
    meta: {
      domain: "cheese",
      catalog_version: catalog.meta.catalog_version,
      phase: "FOOD-04C.1",
    },
    by_id: byId,
    by_slug: bySlug,
    by_namespace: byNamespace,
    by_display_name: byDisplayName,
    by_scientific_name: byScientificName,
    by_milk_source: byMilkSource,
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
      cheeses: cheeses.length,
      milk_sources: Object.keys(byMilkSource).length,
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
      phase: "FOOD-04C.1",
      domain: "cheese",
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
    phase: "FOOD-04C.1",
    domain: "cheese",
    catalog_version: catalog.meta.catalog_version,
    overall_result: "PASS",
    bootstrap_errors: [],
    metrics: {
      "Categories indexed": built.stats.categories,
      "Groups indexed": built.stats.groups,
      "Cheeses indexed": built.stats.cheeses,
      "Milk sources indexed": built.stats.milk_sources,
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
  bootstrap as compileCheeseRuntime,
};

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
