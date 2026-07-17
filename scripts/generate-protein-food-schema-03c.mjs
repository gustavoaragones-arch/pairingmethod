#!/usr/bin/env node
/**
 * ONTOLOGY-03C — JSON-LD schema generator for protein food page view models.
 * Pure serialization layer: consumes page ViewModels only.
 *
 * Run: node scripts/generate-protein-food-schema-03c.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import {
  buildCategorySchemas,
  buildFoodSchemas,
  buildGroupSchemas,
  CATEGORY_SCHEMA_TYPES,
  FOOD_SCHEMA_TYPES,
  GROUP_SCHEMA_TYPES,
} from "../lib/protein-food-schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PAGES_DIR = path.join(ROOT, "data/pages");
const SCHEMA_DIR = path.join(ROOT, "data/schema");
const REPORT_PATH = path.join(ROOT, "reports/schema-generation-report.json");

const INPUTS = {
  foods: path.join(PAGES_DIR, "protein-food-pages.json"),
  groups: path.join(PAGES_DIR, "protein-group-pages.json"),
  categories: path.join(PAGES_DIR, "protein-category-pages.json"),
};

const OUTPUTS = {
  foods: path.join(SCHEMA_DIR, "protein-food-schema.json"),
  groups: path.join(SCHEMA_DIR, "protein-group-schema.json"),
  categories: path.join(SCHEMA_DIR, "protein-category-schema.json"),
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

function writeJson(filePath, data) {
  const text = `${JSON.stringify(sortKeysDeep(data), null, 2)}\n`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
  return text;
}

function loadPageModels() {
  return {
    foods: JSON.parse(fs.readFileSync(INPUTS.foods, "utf8")),
    groups: JSON.parse(fs.readFileSync(INPUTS.groups, "utf8")),
    categories: JSON.parse(fs.readFileSync(INPUTS.categories, "utf8")),
  };
}

function collectSchemaTypes(schemas) {
  const types = new Set();
  for (const block of schemas) {
    if (block["@type"]) types.add(block["@type"]);
  }
  return types;
}

function collectTopLevelAtIds(schemas, atIds, errors) {
  for (const block of schemas) {
    if (!block["@id"]) continue;
    if (atIds.has(block["@id"])) {
      errors.push(`Duplicate @id: ${block["@id"]}`);
    }
    atIds.add(block["@id"]);
  }
}

export function generateProteinFoodSchema(pageModels) {
  const pageUrlByPath = new Map();
  for (const page of pageModels.foods.pages) pageUrlByPath.set(page.canonical_path, page);
  for (const page of pageModels.groups.pages) pageUrlByPath.set(page.canonical_path, page);
  for (const page of pageModels.categories.pages) pageUrlByPath.set(page.canonical_path, page);

  const foodSchemas = pageModels.foods.pages
    .map((page) => ({
      slug: page.slug,
      canonical_path: page.canonical_path,
      projection_id: page.projection_id,
      json_ld: buildFoodSchemas(page),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const groupSchemas = pageModels.groups.pages
    .map((page) => ({
      slug: page.slug,
      canonical_path: page.canonical_path,
      projection_id: page.projection_id,
      json_ld: buildGroupSchemas(page),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const categorySchemas = pageModels.categories.pages
    .map((page) => ({
      slug: page.slug,
      canonical_path: page.canonical_path,
      projection_id: page.projection_id,
      json_ld: buildCategorySchemas(page),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    meta: {
      phase: "ONTOLOGY-03C",
      catalog_version: pageModels.foods.meta.catalog_version,
      food_ontology_version: pageModels.foods.meta.food_ontology_version,
    },
    foodSchemas,
    groupSchemas,
    categorySchemas,
    pageUrlByPath,
    pageModels,
  };
}

function validateSchemaOutput(generated) {
  const errors = [];
  const atIds = new Set();
  const canonicalUrls = new Set();
  let invalidReferences = 0;
  let duplicateAtId = 0;

  const allEntries = [
    ...generated.foodSchemas,
    ...generated.groupSchemas,
    ...generated.categorySchemas,
  ];

  const pageByPath = new Map();
  for (const page of generated.pageModels.foods.pages) {
    pageByPath.set(page.canonical_path, page);
  }
  for (const page of generated.pageModels.groups.pages) {
    pageByPath.set(page.canonical_path, page);
  }
  for (const page of generated.pageModels.categories.pages) {
    pageByPath.set(page.canonical_path, page);
  }

  if (generated.foodSchemas.length !== generated.pageModels.foods.pages.length) {
    errors.push("Missing food schemas");
  }
  if (generated.groupSchemas.length !== generated.pageModels.groups.pages.length) {
    errors.push("Missing group schemas");
  }
  if (generated.categorySchemas.length !== generated.pageModels.categories.pages.length) {
    errors.push("Missing category schemas");
  }

  for (const entry of allEntries) {
    if (!entry.json_ld?.length) {
      errors.push(`${entry.slug}: empty schema`);
    }

    if (canonicalUrls.has(entry.canonical_path)) {
      errors.push(`Duplicate canonical path: ${entry.canonical_path}`);
    }
    canonicalUrls.add(entry.canonical_path);

    const page = pageByPath.get(entry.canonical_path);

    if (!page) {
      invalidReferences += 1;
      errors.push(`Schema without page model: ${entry.slug}`);
    } else if (page.canonical_path !== entry.canonical_path) {
      invalidReferences += 1;
      errors.push(`${entry.slug}: canonical path mismatch`);
    }

    try {
      for (const block of entry.json_ld) {
        JSON.stringify(block);
      }
      collectTopLevelAtIds(entry.json_ld, atIds, errors);
    } catch (err) {
      errors.push(`${entry.slug}: invalid JSON-LD (${err.message})`);
    }

    for (const block of entry.json_ld) {
      if (!block["@context"] || !block["@type"]) {
        errors.push(`${entry.slug}: schema block missing @context or @type`);
      }
    }
  }

  return {
    errors,
    duplicateAtId: errors.filter((e) => e.startsWith("Duplicate @id")).length,
    invalidReferences,
  };
}

function packageOutput(generated) {
  return {
    foods: {
      meta: {
        ...generated.meta,
        schema_type: "protein_food",
        schema_count: generated.foodSchemas.length,
      },
      schemas: generated.foodSchemas,
    },
    groups: {
      meta: {
        ...generated.meta,
        schema_type: "protein_group",
        schema_count: generated.groupSchemas.length,
      },
      schemas: generated.groupSchemas,
    },
    categories: {
      meta: {
        ...generated.meta,
        schema_type: "protein_category",
        schema_count: generated.categorySchemas.length,
      },
      schemas: generated.categorySchemas,
    },
  };
}

function computeReportMetrics(generated) {
  const allEntries = [
    ...generated.foodSchemas,
    ...generated.groupSchemas,
    ...generated.categorySchemas,
  ];
  const objectCount = allEntries.reduce((sum, e) => sum + e.json_ld.length, 0);
  const schemaTypes = new Set();
  for (const entry of allEntries) {
    for (const type of collectSchemaTypes(entry.json_ld)) schemaTypes.add(type);
  }

  return {
    foodSchemas: generated.foodSchemas.length,
    groupSchemas: generated.groupSchemas.length,
    categorySchemas: generated.categorySchemas.length,
    schemaTypesGenerated: [...schemaTypes].sort(),
    jsonLdObjectsEmitted: objectCount,
    averageObjectsPerPage:
      allEntries.length > 0 ? Number((objectCount / allEntries.length).toFixed(2)) : 0,
  };
}

function main() {
  const pageModels = loadPageModels();
  const generated = generateProteinFoodSchema(pageModels);
  const packaged = packageOutput(generated);
  const validation = validateSchemaOutput(generated);
  const metrics = computeReportMetrics(generated);

  const determinismPass =
    serializeRuntime(packaged.foods) ===
    serializeRuntime(packageOutput(generateProteinFoodSchema(pageModels)).foods);

  const overall =
    validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "ONTOLOGY-03C",
      overall_result: "FAIL",
      overall_certification: "FAIL",
      validation_errors: validation.errors,
      metrics: {
        "Food schemas": metrics.foodSchemas,
        "Group schemas": metrics.groupSchemas,
        "Category schemas": metrics.categorySchemas,
        "Schema types generated": metrics.schemaTypesGenerated.length,
        "JSON-LD objects emitted": metrics.jsonLdObjectsEmitted,
        "Average objects per page": metrics.averageObjectsPerPage,
        "Duplicate @id": validation.duplicateAtId,
        "Invalid references": validation.invalidReferences,
        "Validation errors": validation.errors.length,
        "Deterministic regeneration": determinismPass ? "PASS" : "FAIL",
        "Overall result": "FAIL",
        "Overall certification": "FAIL",
      },
      schema_types: metrics.schemaTypesGenerated,
    };
    writeJson(REPORT_PATH, report);
    console.error(validation.errors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(OUTPUTS.foods, packaged.foods);
  writeJson(OUTPUTS.groups, packaged.groups);
  writeJson(OUTPUTS.categories, packaged.categories);

  const report = {
    phase: "ONTOLOGY-03C",
    overall_result: "PASS",
    overall_certification: "PASS",
    validation_errors: [],
    outputs: Object.values(OUTPUTS).map((p) => path.relative(ROOT, p)),
    metrics: {
      "Food schemas": metrics.foodSchemas,
      "Group schemas": metrics.groupSchemas,
      "Category schemas": metrics.categorySchemas,
      "Schema types generated": metrics.schemaTypesGenerated.length,
      "JSON-LD objects emitted": metrics.jsonLdObjectsEmitted,
      "Average objects per page": metrics.averageObjectsPerPage,
      "Duplicate @id": 0,
      "Invalid references": 0,
      "Validation errors": 0,
      "Deterministic regeneration": "PASS",
      "Overall result": "PASS",
      "Overall certification": "PASS",
    },
    schema_types: metrics.schemaTypesGenerated,
    builders: {
      food: FOOD_SCHEMA_TYPES,
      group: GROUP_SCHEMA_TYPES,
      category: CATEGORY_SCHEMA_TYPES,
    },
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${REPORT_PATH}`);
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
