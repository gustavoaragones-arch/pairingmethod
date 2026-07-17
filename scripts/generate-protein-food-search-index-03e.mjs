#!/usr/bin/env node
/**
 * ONTOLOGY-03E — Search index generator for protein food ontology.
 * Read-only projection over published page, navigation, and schema artifacts.
 *
 * Run: node scripts/generate-protein-food-search-index-03e.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import { isResolvableHref } from "../lib/protein-food-navigation.js";
import {
  collectLinkIds,
  collectTokens,
  flattenIntrinsicValues,
} from "../lib/protein-food-search.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const PATHS = {
  pages: {
    foods: path.join(ROOT, "data/pages/protein-food-pages.json"),
    groups: path.join(ROOT, "data/pages/protein-group-pages.json"),
    categories: path.join(ROOT, "data/pages/protein-category-pages.json"),
  },
  navigation: {
    foods: path.join(ROOT, "data/navigation/protein-food-links.json"),
    groups: path.join(ROOT, "data/navigation/protein-group-links.json"),
    categories: path.join(ROOT, "data/navigation/protein-category-links.json"),
  },
  schema: {
    foods: path.join(ROOT, "data/schema/protein-food-schema.json"),
    groups: path.join(ROOT, "data/schema/protein-group-schema.json"),
    categories: path.join(ROOT, "data/schema/protein-category-schema.json"),
  },
  outputs: {
    foods: path.join(ROOT, "data/search/protein-food-search-index.json"),
    groups: path.join(ROOT, "data/search/protein-group-search-index.json"),
    categories: path.join(ROOT, "data/search/protein-category-search-index.json"),
    suggestions: path.join(ROOT, "data/search/protein-search-suggestions.json"),
  },
  report: path.join(ROOT, "reports/search-index-report.json"),
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
}

function loadInputs() {
  return {
    foodPages: JSON.parse(fs.readFileSync(PATHS.pages.foods, "utf8")),
    groupPages: JSON.parse(fs.readFileSync(PATHS.pages.groups, "utf8")),
    categoryPages: JSON.parse(fs.readFileSync(PATHS.pages.categories, "utf8")),
    foodLinks: JSON.parse(fs.readFileSync(PATHS.navigation.foods, "utf8")),
    groupLinks: JSON.parse(fs.readFileSync(PATHS.navigation.groups, "utf8")),
    categoryLinks: JSON.parse(fs.readFileSync(PATHS.navigation.categories, "utf8")),
    foodSchema: JSON.parse(fs.readFileSync(PATHS.schema.foods, "utf8")),
    groupSchema: JSON.parse(fs.readFileSync(PATHS.schema.groups, "utf8")),
    categorySchema: JSON.parse(fs.readFileSync(PATHS.schema.categories, "utf8")),
  };
}

function indexLinkSets(linkSets) {
  return new Map(linkSets.map((set) => [set.canonical_path, set]));
}

function indexSchemas(schemas) {
  return new Map(schemas.map((entry) => [entry.canonical_path, entry]));
}

function buildRegistry(inputs) {
  const validHrefs = new Set();
  const foodIds = new Set();
  const groupIds = new Set();
  const categoryIds = new Set();

  for (const page of inputs.foodPages.pages) {
    validHrefs.add(page.canonical_path);
    foodIds.add(page.identity.id);
  }
  for (const page of inputs.groupPages.pages) {
    validHrefs.add(page.canonical_path);
    groupIds.add(page.identity.id);
  }
  for (const page of inputs.categoryPages.pages) {
    validHrefs.add(page.canonical_path);
    categoryIds.add(page.identity.id);
  }

  return {
    validHrefs,
    foodIds,
    groupIds,
    categoryIds,
    foodLinksByPath: indexLinkSets(inputs.foodLinks.link_sets),
    groupLinksByPath: indexLinkSets(inputs.groupLinks.link_sets),
    categoryLinksByPath: indexLinkSets(inputs.categoryLinks.link_sets),
    foodSchemaByPath: indexSchemas(inputs.foodSchema.schemas),
    groupSchemaByPath: indexSchemas(inputs.groupSchema.schemas),
    categorySchemaByPath: indexSchemas(inputs.categorySchema.schemas),
  };
}

function buildFoodDocument(page, linkSet) {
  const sections = linkSet?.sections ?? {};
  const navigation = {
    similar_food_ids: collectLinkIds(sections.similar_foods ?? []),
    substitution_ids: collectLinkIds(sections.substitutions ?? []),
    culinary_role_ids: collectLinkIds(sections.culinary_role ?? []),
    preparation_ids: collectLinkIds(sections.common_preparations ?? []),
  };

  const wineStyles = [
    ...(sections.primary_wine_styles ?? []),
    ...(sections.alternative_wine_styles ?? []),
  ];

  const winePairing = {
    style_ids: collectLinkIds(wineStyles),
    descriptor_ids: collectLinkIds(sections.wine_descriptors ?? []),
    technique_ids: collectLinkIds(sections.wine_techniques ?? []),
  };

  const tokens = collectTokens([
    page.identity.title,
    page.slug,
    page.overview.scientific_name,
    page.overview.species,
    page.overview.category?.name,
    page.overview.group?.name,
    page.slug.replace(/-/g, " "),
    ...flattenIntrinsicValues(page.characteristics),
  ]);

  return {
    document_type: "protein_food",
    id: page.identity.id,
    slug: page.slug,
    canonical_path: page.canonical_path,
    canonical_url: page.metadata.canonical,
    display_name: page.identity.title,
    classification: {
      category: page.overview.category
        ? { id: page.overview.category.id, slug: page.overview.category.slug, name: page.overview.category.name }
        : null,
      group: page.overview.group
        ? { id: page.overview.group.id, slug: page.overview.group.slug, name: page.overview.group.name }
        : null,
      species: page.overview.species,
      scientific_name: page.overview.scientific_name,
    },
    intrinsic: page.characteristics,
    navigation,
    wine_pairing: winePairing,
    tokens,
    projection_id: page.projection_id,
  };
}

function buildGroupDocument(page, linkSet) {
  const tokens = collectTokens([
    page.identity.title,
    page.slug,
    page.overview.parent_category?.name,
    page.slug.replace(/-/g, " "),
    ...(page.species_represented ?? []),
    ...(page.processing_states_represented ?? []),
  ]);

  return {
    document_type: "protein_group",
    id: page.identity.id,
    slug: page.slug,
    canonical_path: page.canonical_path,
    canonical_url: page.metadata.canonical,
    display_name: page.identity.title,
    category: page.overview.parent_category
      ? {
          id: page.overview.parent_category.id,
          slug: page.overview.parent_category.slug,
          name: page.overview.parent_category.name,
        }
      : null,
    member_food_ids: (linkSet?.sections?.member_foods ?? page.member_foods).map((item) => item.id).sort(),
    species_represented: [...(page.species_represented ?? [])].sort(),
    processing_states_represented: [...(page.processing_states_represented ?? [])].sort(),
    tokens,
    projection_id: page.projection_id,
  };
}

function buildCategoryDocument(page, linkSet) {
  const tokens = collectTokens([
    page.identity.title,
    page.slug,
    page.slug.replace(/-/g, " "),
    String(page.overview.food_count),
    String(page.overview.group_count),
    ...(page.groups ?? []).map((g) => g.name),
  ]);

  return {
    document_type: "protein_category",
    id: page.identity.id,
    slug: page.slug,
    canonical_path: page.canonical_path,
    canonical_url: page.metadata.canonical,
    display_name: page.identity.title,
    groups: (page.groups ?? []).map((group) => ({
      id: group.id,
      slug: group.slug,
      name: group.name,
      food_count: group.food_count,
    })),
    food_count: page.overview.food_count,
    group_count: page.overview.group_count,
    group_ids: collectLinkIds(linkSet?.sections?.groups ?? page.groups.map((g) => ({ id: g.id }))),
    tokens,
    projection_id: page.projection_id,
  };
}

function buildSuggestion(page, type) {
  return {
    title: page.identity.title,
    href: page.canonical_path,
    type,
    tokens: collectTokens([page.identity.title, page.slug, page.slug.replace(/-/g, " ")]),
  };
}

export function generateProteinFoodSearchIndex(inputs) {
  const registry = buildRegistry(inputs);

  const foodDocuments = inputs.foodPages.pages
    .map((page) => buildFoodDocument(page, registry.foodLinksByPath.get(page.canonical_path)))
    .sort((a, b) => a.id.localeCompare(b.id));

  const groupDocuments = inputs.groupPages.pages
    .map((page) => buildGroupDocument(page, registry.groupLinksByPath.get(page.canonical_path)))
    .sort((a, b) => a.id.localeCompare(b.id));

  const categoryDocuments = inputs.categoryPages.pages
    .map((page) =>
      buildCategoryDocument(page, registry.categoryLinksByPath.get(page.canonical_path))
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  const suggestions = [
    ...inputs.foodPages.pages.map((page) => buildSuggestion(page, "food")),
    ...inputs.groupPages.pages.map((page) => buildSuggestion(page, "group")),
    ...inputs.categoryPages.pages.map((page) => buildSuggestion(page, "category")),
  ].sort((a, b) => {
    const titleCmp = a.title.localeCompare(b.title);
    if (titleCmp !== 0) return titleCmp;
    return a.href.localeCompare(b.href);
  });

  const indexedTokens = new Set();
  for (const doc of [...foodDocuments, ...groupDocuments, ...categoryDocuments]) {
    for (const token of doc.tokens) indexedTokens.add(token);
  }

  return {
    meta: {
      phase: "ONTOLOGY-03E",
      catalog_version: inputs.foodPages.meta.catalog_version,
      food_ontology_version: inputs.foodPages.meta.food_ontology_version,
    },
    foodDocuments,
    groupDocuments,
    categoryDocuments,
    suggestions,
    indexedTokenCount: indexedTokens.size,
    registry,
    inputs,
  };
}

function validateSearchIndex(generated) {
  const errors = [];
  let brokenReferences = 0;
  let duplicateDocuments = 0;

  const docIds = new Set();
  const suggestionKeys = new Set();

  const allDocs = [
    ...generated.foodDocuments,
    ...generated.groupDocuments,
    ...generated.categoryDocuments,
  ];

  for (const doc of allDocs) {
    if (docIds.has(doc.id)) {
      duplicateDocuments += 1;
      errors.push(`Duplicate search document: ${doc.id}`);
    }
    docIds.add(doc.id);

    if (!generated.registry.validHrefs.has(doc.canonical_path)) {
      brokenReferences += 1;
      errors.push(`Broken canonical path: ${doc.canonical_path}`);
    }

    const pageExists =
      generated.inputs.foodPages.pages.some((p) => p.identity.id === doc.id) ||
      generated.inputs.groupPages.pages.some((p) => p.identity.id === doc.id) ||
      generated.inputs.categoryPages.pages.some((p) => p.identity.id === doc.id);

    if (!pageExists) errors.push(`Missing page for document: ${doc.id}`);

    const schemaMap =
      doc.document_type === "protein_food"
        ? generated.registry.foodSchemaByPath
        : doc.document_type === "protein_group"
          ? generated.registry.groupSchemaByPath
          : generated.registry.categorySchemaByPath;

    if (!schemaMap.has(doc.canonical_path)) {
      brokenReferences += 1;
      errors.push(`Missing schema for document: ${doc.canonical_path}`);
    }

    if (doc.document_type === "protein_food") {
      for (const id of [
        ...doc.navigation.similar_food_ids,
        ...doc.navigation.substitution_ids,
        ...doc.navigation.culinary_role_ids,
      ]) {
        if (!generated.registry.foodIds.has(id)) {
          brokenReferences += 1;
          errors.push(`${doc.slug}: broken navigation reference ${id}`);
        }
      }
      for (const prepId of doc.navigation.preparation_ids) {
        if (!prepId.startsWith("preparation.")) {
          brokenReferences += 1;
          errors.push(`${doc.slug}: invalid preparation id ${prepId}`);
        }
      }
    }

    if (doc.document_type === "protein_group") {
      for (const id of doc.member_food_ids) {
        if (!generated.registry.foodIds.has(id)) {
          brokenReferences += 1;
          errors.push(`${doc.slug}: broken member food ${id}`);
        }
      }
    }

    if (doc.document_type === "protein_category") {
      for (const id of doc.group_ids) {
        if (!generated.registry.groupIds.has(id)) {
          brokenReferences += 1;
          errors.push(`${doc.slug}: broken group reference ${id}`);
        }
      }
    }
  }

  for (const suggestion of generated.suggestions) {
    const key = `${suggestion.type}\t${suggestion.href}`;
    if (suggestionKeys.has(key)) {
      duplicateDocuments += 1;
      errors.push(`Duplicate suggestion: ${key}`);
    }
    suggestionKeys.add(key);

    if (!isResolvableHref(suggestion.href, generated.registry)) {
      brokenReferences += 1;
      errors.push(`Broken suggestion href: ${suggestion.href}`);
    }
  }

  if (generated.foodDocuments.length !== generated.inputs.foodPages.pages.length) {
    errors.push("Food document count mismatch");
  }
  if (generated.groupDocuments.length !== generated.inputs.groupPages.pages.length) {
    errors.push("Group document count mismatch");
  }
  if (generated.categoryDocuments.length !== generated.inputs.categoryPages.pages.length) {
    errors.push("Category document count mismatch");
  }

  return { errors, brokenReferences, duplicateDocuments };
}

function packageOutput(generated) {
  return {
    foods: {
      meta: {
        ...generated.meta,
        document_type: "protein_food",
        document_count: generated.foodDocuments.length,
      },
      documents: generated.foodDocuments,
    },
    groups: {
      meta: {
        ...generated.meta,
        document_type: "protein_group",
        document_count: generated.groupDocuments.length,
      },
      documents: generated.groupDocuments,
    },
    categories: {
      meta: {
        ...generated.meta,
        document_type: "protein_category",
        document_count: generated.categoryDocuments.length,
      },
      documents: generated.categoryDocuments,
    },
    suggestions: {
      meta: {
        ...generated.meta,
        document_type: "protein_search_suggestions",
        suggestion_count: generated.suggestions.length,
      },
      suggestions: generated.suggestions,
    },
  };
}

function main() {
  const inputs = loadInputs();
  const generated = generateProteinFoodSearchIndex(inputs);
  const packaged = packageOutput(generated);
  const validation = validateSearchIndex(generated);

  const determinismPass =
    serializeRuntime(packaged.foods) ===
    serializeRuntime(packageOutput(generateProteinFoodSearchIndex(inputs)).foods);

  const overall =
    validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "ONTOLOGY-03E",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      metrics: {
        "Food search documents": generated.foodDocuments.length,
        "Group search documents": generated.groupDocuments.length,
        "Category search documents": generated.categoryDocuments.length,
        Suggestions: generated.suggestions.length,
        "Indexed tokens": generated.indexedTokenCount,
        "Duplicate documents": validation.duplicateDocuments,
        "Broken references": validation.brokenReferences,
        "Validation errors": validation.errors.length,
        "Deterministic regeneration": determinismPass ? "PASS" : "FAIL",
        "Overall result": "FAIL",
      },
    };
    writeJson(PATHS.report, report);
    console.error(validation.errors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(PATHS.outputs.foods, packaged.foods);
  writeJson(PATHS.outputs.groups, packaged.groups);
  writeJson(PATHS.outputs.categories, packaged.categories);
  writeJson(PATHS.outputs.suggestions, packaged.suggestions);

  const report = {
    phase: "ONTOLOGY-03E",
    overall_result: "PASS",
    validation_errors: [],
    outputs: Object.values(PATHS.outputs).map((p) => path.relative(ROOT, p)),
    metrics: {
      "Food search documents": generated.foodDocuments.length,
      "Group search documents": generated.groupDocuments.length,
      "Category search documents": generated.categoryDocuments.length,
      Suggestions: generated.suggestions.length,
      "Indexed tokens": generated.indexedTokenCount,
      "Duplicate documents": 0,
      "Broken references": 0,
      "Validation errors": 0,
      "Deterministic regeneration": "PASS",
      "Overall result": "PASS",
    },
  };

  writeJson(PATHS.report, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${PATHS.report}`);
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
