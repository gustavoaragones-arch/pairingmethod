#!/usr/bin/env node
/**
 * ONTOLOGY-03F — Protein food publication coverage & certification.
 * Read-only release gate: verifies every publication artifact is complete,
 * internally consistent, and deterministic. Does not modify catalog, runtime,
 * relationships, projections, pages, schema, navigation, or search outputs.
 *
 * Run: node scripts/certify-protein-food-publication-03f.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import { generateProteinFoodProjections } from "./generate-protein-food-projections-03a.mjs";
import { generateProteinFoodPageModels } from "./generate-protein-food-pages-03b.mjs";
import { generateProteinFoodSchema } from "./generate-protein-food-schema-03c.mjs";
import { generateProteinFoodLinks } from "./generate-protein-food-links-03d.mjs";
import { generateProteinFoodSearchIndex } from "./generate-protein-food-search-index-03e.mjs";
import { isResolvableHref } from "../lib/protein-food-navigation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const PATHS = {
  catalog: path.join(ROOT, "data/protein-food-catalog.json"),
  generated: {
    foods: path.join(ROOT, "data/generated/protein-food-pages.json"),
    groups: path.join(ROOT, "data/generated/protein-group-pages.json"),
    categories: path.join(ROOT, "data/generated/protein-category-pages.json"),
  },
  pages: {
    foods: path.join(ROOT, "data/pages/protein-food-pages.json"),
    groups: path.join(ROOT, "data/pages/protein-group-pages.json"),
    categories: path.join(ROOT, "data/pages/protein-category-pages.json"),
  },
  schema: {
    foods: path.join(ROOT, "data/schema/protein-food-schema.json"),
    groups: path.join(ROOT, "data/schema/protein-group-schema.json"),
    categories: path.join(ROOT, "data/schema/protein-category-schema.json"),
  },
  navigation: {
    foods: path.join(ROOT, "data/navigation/protein-food-links.json"),
    groups: path.join(ROOT, "data/navigation/protein-group-links.json"),
    categories: path.join(ROOT, "data/navigation/protein-category-links.json"),
  },
  search: {
    foods: path.join(ROOT, "data/search/protein-food-search-index.json"),
    groups: path.join(ROOT, "data/search/protein-group-search-index.json"),
    categories: path.join(ROOT, "data/search/protein-category-search-index.json"),
    suggestions: path.join(ROOT, "data/search/protein-search-suggestions.json"),
  },
  runtime: {
    structural: path.join(ROOT, "data/runtime/protein-food-relationships.json"),
    editorial: path.join(ROOT, "data/runtime/protein-food-editorial-relationships.json"),
    pairing: path.join(ROOT, "data/runtime/protein-food-wine-relationships.json"),
    index: path.join(ROOT, "data/runtime/protein-food-index.json"),
    groups: path.join(ROOT, "data/runtime/protein-food-groups.json"),
    categories: path.join(ROOT, "data/runtime/protein-food-categories.json"),
  },
  reports: {
    certification: path.join(ROOT, "reports/publication-certification-report.json"),
    coverage: path.join(ROOT, "reports/publication-coverage-report.json"),
    upstream: {
      projections: path.join(ROOT, "reports/generator-report.json"),
      pages: path.join(ROOT, "reports/page-generation-report.json"),
      schema: path.join(ROOT, "reports/schema-generation-report.json"),
      navigation: path.join(ROOT, "reports/internal-link-report.json"),
      search: path.join(ROOT, "reports/search-index-report.json"),
    },
  },
};

const PUBLICATION_LAYERS = [
  "projections",
  "viewmodels",
  "json_ld",
  "navigation",
  "search",
  "relationships",
  "cross_layer",
  "determinism",
];

const SYMMETRIC_EDITORIAL = new Set(["similar_to", "shares_culinary_role"]);

function canonicalEdgeKey(source, relationship, target) {
  if (SYMMETRIC_EDITORIAL.has(relationship)) {
    const [a, b] = source.localeCompare(target) <= 0 ? [source, target] : [target, source];
    return `${a}\t${relationship}\t${b}`;
  }
  return `${source}\t${relationship}\t${target}`;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, serializeRuntime(data), "utf8");
}

function assertFileExists(filePath, errors, label) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing ${label}: ${path.relative(ROOT, filePath)}`);
    return false;
  }
  return true;
}

function loadCatalog() {
  return readJson(PATHS.catalog);
}

function loadProjections() {
  return {
    foods: readJson(PATHS.generated.foods),
    groups: readJson(PATHS.generated.groups),
    categories: readJson(PATHS.generated.categories),
  };
}

function loadPages() {
  return {
    foods: readJson(PATHS.pages.foods),
    groups: readJson(PATHS.pages.groups),
    categories: readJson(PATHS.pages.categories),
  };
}

function loadSchema() {
  return {
    foods: readJson(PATHS.schema.foods),
    groups: readJson(PATHS.schema.groups),
    categories: readJson(PATHS.schema.categories),
  };
}

function loadNavigation() {
  return {
    foods: readJson(PATHS.navigation.foods),
    groups: readJson(PATHS.navigation.groups),
    categories: readJson(PATHS.navigation.categories),
  };
}

function loadSearch() {
  return {
    foods: readJson(PATHS.search.foods),
    groups: readJson(PATHS.search.groups),
    categories: readJson(PATHS.search.categories),
    suggestions: readJson(PATHS.search.suggestions),
  };
}

function loadProjectionInputs() {
  return {
    catalog: readJson(PATHS.catalog),
    index: readJson(PATHS.runtime.index),
    runtimeGroups: readJson(PATHS.runtime.groups),
    runtimeCategories: readJson(PATHS.runtime.categories),
    structural: readJson(PATHS.runtime.structural),
    editorial: readJson(PATHS.runtime.editorial),
    pairing: readJson(PATHS.runtime.pairing),
  };
}

function loadLinkInputs(pages, projections) {
  return {
    foodPages: pages.foods,
    groupPages: pages.groups,
    categoryPages: pages.categories,
    projections: {
      foods: projections.foods,
      groups: projections.groups,
      categories: projections.categories,
    },
    structural: readJson(PATHS.runtime.structural),
    editorial: readJson(PATHS.runtime.editorial),
    pairing: readJson(PATHS.runtime.pairing),
  };
}

function loadSearchInputs(pages, navigation, schema) {
  return {
    foodPages: pages.foods,
    groupPages: pages.groups,
    categoryPages: pages.categories,
    foodLinks: navigation.foods,
    groupLinks: navigation.groups,
    categoryLinks: navigation.categories,
    foodSchema: schema.foods,
    groupSchema: schema.groups,
    categorySchema: schema.categories,
  };
}

function packageProjections(generated) {
  const { meta, foodProjections, groupProjections, categoryProjections } = generated;
  return {
    foods: {
      meta: { ...meta, projection_type: "protein_food", projection_count: foodProjections.length },
      projections: foodProjections,
    },
    groups: {
      meta: { ...meta, projection_type: "protein_group", projection_count: groupProjections.length },
      projections: groupProjections,
    },
    categories: {
      meta: {
        ...meta,
        projection_type: "protein_category",
        projection_count: categoryProjections.length,
      },
      projections: categoryProjections,
    },
  };
}

function packagePages(generated) {
  return {
    foods: {
      meta: { ...generated.meta, page_type: "protein_food", page_count: generated.foodPages.length },
      pages: generated.foodPages,
    },
    groups: {
      meta: { ...generated.meta, page_type: "protein_group", page_count: generated.groupPages.length },
      pages: generated.groupPages,
    },
    categories: {
      meta: {
        ...generated.meta,
        page_type: "protein_category",
        page_count: generated.categoryPages.length,
      },
      pages: generated.categoryPages,
    },
  };
}

function packageSchema(generated) {
  return {
    foods: {
      meta: { ...generated.meta, schema_type: "protein_food", schema_count: generated.foodSchemas.length },
      schemas: generated.foodSchemas,
    },
    groups: {
      meta: { ...generated.meta, schema_type: "protein_group", schema_count: generated.groupSchemas.length },
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

function packageLinks(generated) {
  return {
    foods: {
      meta: { ...generated.meta, link_set_type: "protein_food", link_set_count: generated.foodLinkSets.length },
      link_sets: generated.foodLinkSets,
    },
    groups: {
      meta: { ...generated.meta, link_set_type: "protein_group", link_set_count: generated.groupLinkSets.length },
      link_sets: generated.groupLinkSets,
    },
    categories: {
      meta: {
        ...generated.meta,
        link_set_type: "protein_category",
        link_set_count: generated.categoryLinkSets.length,
      },
      link_sets: generated.categoryLinkSets,
    },
  };
}

function packageSearch(generated) {
  return {
    foods: {
      meta: { ...generated.meta, document_type: "protein_food", document_count: generated.foodDocuments.length },
      documents: generated.foodDocuments,
    },
    groups: {
      meta: { ...generated.meta, document_type: "protein_group", document_count: generated.groupDocuments.length },
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

function matchesOnDisk(filePath, data) {
  const onDisk = readJson(filePath);
  return serializeRuntime(onDisk) === serializeRuntime(data);
}

function collectLinksFromSet(linkSet) {
  const links = [];
  for (const value of Object.values(linkSet.sections ?? {})) {
    if (!value) continue;
    if (Array.isArray(value)) {
      links.push(...value);
      continue;
    }
    if (typeof value === "object" && value.href) {
      links.push(value);
    }
    if (typeof value === "object") {
      for (const nested of Object.values(value)) {
        if (nested?.href) links.push(nested);
      }
    }
  }
  return links;
}

function buildHrefRegistry(pages) {
  const validHrefs = new Set(["/"]);
  const foodIds = new Set();
  const groupIds = new Set();
  const categoryIds = new Set();

  for (const page of pages.foods.pages) {
    validHrefs.add(page.canonical_path);
    foodIds.add(page.identity.id);
  }
  for (const page of pages.groups.pages) {
    validHrefs.add(page.canonical_path);
    groupIds.add(page.identity.id);
  }
  for (const page of pages.categories.pages) {
    validHrefs.add(page.canonical_path);
    categoryIds.add(page.identity.id);
  }

  return { validHrefs, foodIds, groupIds, categoryIds };
}

function certifyProjectionCoverage(catalog, projections, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 8;

  const foodIds = new Set(catalog.protein_foods.map((f) => f.id));
  const groupIds = new Set(catalog.groups.map((g) => g.id));
  const categoryIds = new Set(catalog.categories.map((c) => c.id));

  const foodProjections = projections.foods.projections;
  const groupProjections = projections.groups.projections;
  const categoryProjections = projections.categories.projections;

  const projectedFoodIds = new Set(foodProjections.map((p) => p.identity.id));
  const projectedGroupIds = new Set(groupProjections.map((p) => p.identity.id));
  const projectedCategoryIds = new Set(categoryProjections.map((p) => p.identity.id));

  if (foodProjections.length !== foodIds.size) {
    errors.push(`Food projection count mismatch: expected ${foodIds.size}, got ${foodProjections.length}`);
  }
  if (groupProjections.length !== groupIds.size) {
    errors.push(`Group projection count mismatch: expected ${groupIds.size}, got ${groupProjections.length}`);
  }
  if (categoryProjections.length !== categoryIds.size) {
    errors.push(
      `Category projection count mismatch: expected ${categoryIds.size}, got ${categoryProjections.length}`
    );
  }

  for (const id of foodIds) {
    if (!projectedFoodIds.has(id)) errors.push(`Missing food projection: ${id}`);
  }
  for (const id of groupIds) {
    if (!projectedGroupIds.has(id)) errors.push(`Missing group projection: ${id}`);
  }
  for (const id of categoryIds) {
    if (!projectedCategoryIds.has(id)) errors.push(`Missing category projection: ${id}`);
  }

  for (const projection of foodProjections) {
    if (!foodIds.has(projection.identity.id)) {
      errors.push(`Orphan food projection: ${projection.identity.id}`);
    }
  }
  for (const projection of groupProjections) {
    if (!groupIds.has(projection.identity.id)) {
      errors.push(`Orphan group projection: ${projection.identity.id}`);
    }
  }
  for (const projection of categoryProjections) {
    if (!categoryIds.has(projection.identity.id)) {
      errors.push(`Orphan category projection: ${projection.identity.id}`);
    }
  }

  const foodDupes = foodProjections.length - projectedFoodIds.size;
  const groupDupes = groupProjections.length - projectedGroupIds.size;
  const categoryDupes = categoryProjections.length - projectedCategoryIds.size;
  if (foodDupes > 0) errors.push(`Duplicate food projections: ${foodDupes}`);
  if (groupDupes > 0) errors.push(`Duplicate group projections: ${groupDupes}`);
  if (categoryDupes > 0) errors.push(`Duplicate category projections: ${categoryDupes}`);

  const foodCovered = [...foodIds].filter((id) => projectedFoodIds.has(id)).length;
  const groupCovered = [...groupIds].filter((id) => projectedGroupIds.has(id)).length;
  const categoryCovered = [...categoryIds].filter((id) => projectedCategoryIds.has(id)).length;

  state.coverage.projections = {
    foods: pct(foodCovered, foodIds.size),
    groups: pct(groupCovered, groupIds.size),
    categories: pct(categoryCovered, categoryIds.size),
    overall: pct(foodCovered + groupCovered + categoryCovered, foodIds.size + groupIds.size + categoryIds.size),
  };

  state.foodsCertified = errors.length === 0 ? foodIds.size : foodCovered;
  state.groupsCertified = errors.length === 0 ? groupIds.size : groupCovered;
  state.categoriesCertified = errors.length === 0 ? categoryIds.size : categoryCovered;

  return { errors, warnings };
}

function certifyViewModelCoverage(projections, pages, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 7;

  const foodProjectionIds = new Set(projections.foods.projections.map((p) => p.identity.id));
  const groupProjectionIds = new Set(projections.groups.projections.map((p) => p.identity.id));
  const categoryProjectionIds = new Set(projections.categories.projections.map((p) => p.identity.id));

  const allPages = [
    ...pages.foods.pages.map((p) => ({ ...p, kind: "food" })),
    ...pages.groups.pages.map((p) => ({ ...p, kind: "group" })),
    ...pages.categories.pages.map((p) => ({ ...p, kind: "category" })),
  ];

  const urls = new Set();
  const pageProjectionIds = new Set();

  for (const page of allPages) {
    if (urls.has(page.canonical_path)) {
      errors.push(`Duplicate canonical URL: ${page.canonical_path}`);
    }
    urls.add(page.canonical_path);

    if (pageProjectionIds.has(page.projection_id)) {
      errors.push(`Duplicate page projection reference: ${page.projection_id}`);
    }
    pageProjectionIds.add(page.projection_id);

    const projectionSet =
      page.kind === "food"
        ? foodProjectionIds
        : page.kind === "group"
          ? groupProjectionIds
          : categoryProjectionIds;

    if (!projectionSet.has(page.projection_id)) {
      errors.push(`Page references missing projection: ${page.projection_id}`);
    }
  }

  for (const id of foodProjectionIds) {
    if (!pages.foods.pages.some((p) => p.projection_id === id)) {
      errors.push(`Orphan food projection without page: ${id}`);
    }
  }
  for (const id of groupProjectionIds) {
    if (!pages.groups.pages.some((p) => p.projection_id === id)) {
      errors.push(`Orphan group projection without page: ${id}`);
    }
  }
  for (const id of categoryProjectionIds) {
    if (!pages.categories.pages.some((p) => p.projection_id === id)) {
      errors.push(`Orphan category projection without page: ${id}`);
    }
  }

  const expected = allPages.length;
  const matched = allPages.filter((page) => {
    const set =
      page.kind === "food"
        ? foodProjectionIds
        : page.kind === "group"
          ? groupProjectionIds
          : categoryProjectionIds;
    return set.has(page.projection_id);
  }).length;

  state.coverage.viewmodels = {
    foods: pct(pages.foods.pages.length, projections.foods.projections.length),
    groups: pct(pages.groups.pages.length, projections.groups.projections.length),
    categories: pct(pages.categories.pages.length, projections.categories.projections.length),
    overall: pct(matched, expected),
  };

  return { errors, warnings };
}

function certifySchemaCoverage(pages, schema, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 6;

  const pageByPath = new Map();
  for (const page of [...pages.foods.pages, ...pages.groups.pages, ...pages.categories.pages]) {
    pageByPath.set(page.canonical_path, page);
  }

  const allSchemas = [
    ...schema.foods.schemas,
    ...schema.groups.schemas,
    ...schema.categories.schemas,
  ];

  const schemaPaths = new Set();
  const atIds = new Set();

  if (schema.foods.schemas.length !== pages.foods.pages.length) {
    errors.push("Food schema count does not match food pages");
  }
  if (schema.groups.schemas.length !== pages.groups.pages.length) {
    errors.push("Group schema count does not match group pages");
  }
  if (schema.categories.schemas.length !== pages.categories.pages.length) {
    errors.push("Category schema count does not match category pages");
  }

  for (const entry of allSchemas) {
    if (!entry.json_ld?.length) {
      errors.push(`${entry.slug ?? entry.canonical_path}: missing JSON-LD`);
    }

    if (schemaPaths.has(entry.canonical_path)) {
      errors.push(`Duplicate schema canonical path: ${entry.canonical_path}`);
    }
    schemaPaths.add(entry.canonical_path);

    if (!pageByPath.has(entry.canonical_path)) {
      errors.push(`JSON-LD without page model: ${entry.canonical_path}`);
    }

    for (const block of entry.json_ld ?? []) {
      if (block["@id"]) {
        if (atIds.has(block["@id"])) {
          errors.push(`Duplicate @id: ${block["@id"]}`);
        }
        atIds.add(block["@id"]);
      }
      if (!block["@context"] || !block["@type"]) {
        errors.push(`${entry.canonical_path}: schema block missing @context or @type`);
      }
    }
  }

  for (const page of pageByPath.values()) {
    if (!schemaPaths.has(page.canonical_path)) {
      errors.push(`Page without JSON-LD: ${page.canonical_path}`);
    }
  }

  const matched = [...pageByPath.keys()].filter((path) => schemaPaths.has(path)).length;
  state.coverage.json_ld = {
    foods: pct(schema.foods.schemas.length, pages.foods.pages.length),
    groups: pct(schema.groups.schemas.length, pages.groups.pages.length),
    categories: pct(schema.categories.schemas.length, pages.categories.pages.length),
    overall: pct(matched, pageByPath.size),
  };

  return { errors, warnings };
}

function certifyNavigationCoverage(pages, navigation, registry, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 7;

  const allLinkSets = [
    ...navigation.foods.link_sets,
    ...navigation.groups.link_sets,
    ...navigation.categories.link_sets,
  ];

  const pageByPath = new Map();
  for (const page of [...pages.foods.pages, ...pages.groups.pages, ...pages.categories.pages]) {
    pageByPath.set(page.canonical_path, page);
  }

  if (navigation.foods.link_sets.length !== pages.foods.pages.length) {
    errors.push("Food navigation link set count mismatch");
  }
  if (navigation.groups.link_sets.length !== pages.groups.pages.length) {
    errors.push("Group navigation link set count mismatch");
  }
  if (navigation.categories.link_sets.length !== pages.categories.pages.length) {
    errors.push("Category navigation link set count mismatch");
  }

  for (const linkSet of allLinkSets) {
    const page = pageByPath.get(linkSet.canonical_path);
    if (!page) {
      errors.push(`Orphan navigation link set: ${linkSet.canonical_path}`);
      continue;
    }

    if (linkSet.projection_id !== page.projection_id) {
      errors.push(`${linkSet.slug}: navigation projection_id mismatch`);
    }

    const seen = new Set();
    for (const link of collectLinksFromSet(linkSet)) {
      const key = `${link.href}\t${link.relationship ?? ""}\t${link.id ?? ""}`;
      if (seen.has(key)) {
        errors.push(`${linkSet.slug}: duplicate navigation link ${link.href}`);
      }
      seen.add(key);

      if (!isResolvableHref(link.href, registry)) {
        errors.push(`${linkSet.slug}: broken navigation href ${link.href}`);
      }

      if (link.id && !link.id.startsWith("preparation.")) {
        const known =
          registry.foodIds.has(link.id) ||
          registry.groupIds.has(link.id) ||
          registry.categoryIds.has(link.id);
        const externalWineRef =
          link.href?.startsWith("/styles/") ||
          link.href?.startsWith("/techniques/") ||
          link.href?.startsWith("/terms/");
        if (!known && !externalWineRef) {
          errors.push(`${linkSet.slug}: navigation references unknown entity ${link.id}`);
        }
      }
    }

    const parent = linkSet.sections?.parent_navigation ?? linkSet.sections?.parent_category;
    if (linkSet.sections?.parent_navigation) {
      const { category, group } = linkSet.sections.parent_navigation;
      if (category && !registry.categoryIds.has(category.id)) {
        errors.push(`${linkSet.slug}: invalid parent category ${category.id}`);
      }
      if (group && !registry.groupIds.has(group.id)) {
        errors.push(`${linkSet.slug}: invalid parent group ${group.id}`);
      }
    } else if (linkSet.sections?.parent_category && !registry.categoryIds.has(linkSet.sections.parent_category.id)) {
      errors.push(`${linkSet.slug}: invalid parent category ${linkSet.sections.parent_category.id}`);
    }
  }

  for (const page of pageByPath.values()) {
    if (!allLinkSets.some((set) => set.canonical_path === page.canonical_path)) {
      errors.push(`Page without navigation link set: ${page.canonical_path}`);
    }
  }

  const matched = [...pageByPath.keys()].filter((path) =>
    allLinkSets.some((set) => set.canonical_path === path)
  ).length;

  state.coverage.navigation = {
    foods: pct(navigation.foods.link_sets.length, pages.foods.pages.length),
    groups: pct(navigation.groups.link_sets.length, pages.groups.pages.length),
    categories: pct(navigation.categories.link_sets.length, pages.categories.pages.length),
    overall: pct(matched, pageByPath.size),
  };

  return { errors, warnings };
}

function certifySearchCoverage(pages, search, registry, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 7;

  const pageByPath = new Map();
  for (const page of [...pages.foods.pages, ...pages.groups.pages, ...pages.categories.pages]) {
    pageByPath.set(page.canonical_path, page);
  }

  const allDocs = [
    ...search.foods.documents,
    ...search.groups.documents,
    ...search.categories.documents,
  ];

  const docIds = new Set();
  const docPaths = new Set();
  const suggestionKeys = new Set();

  if (search.foods.documents.length !== pages.foods.pages.length) {
    errors.push("Food search document count mismatch");
  }
  if (search.groups.documents.length !== pages.groups.pages.length) {
    errors.push("Group search document count mismatch");
  }
  if (search.categories.documents.length !== pages.categories.pages.length) {
    errors.push("Category search document count mismatch");
  }
  if (search.suggestions.suggestions.length !== pageByPath.size) {
    errors.push(
      `Suggestion count mismatch: expected ${pageByPath.size}, got ${search.suggestions.suggestions.length}`
    );
  }

  for (const doc of allDocs) {
    if (docIds.has(doc.id)) errors.push(`Duplicate search document id: ${doc.id}`);
    docIds.add(doc.id);

    if (docPaths.has(doc.canonical_path)) {
      errors.push(`Duplicate search document path: ${doc.canonical_path}`);
    }
    docPaths.add(doc.canonical_path);

    if (!pageByPath.has(doc.canonical_path)) {
      errors.push(`Search document without page: ${doc.canonical_path}`);
    }
    if (!isResolvableHref(doc.canonical_path, registry)) {
      errors.push(`Search document URL does not resolve: ${doc.canonical_path}`);
    }
  }

  for (const suggestion of search.suggestions.suggestions) {
    const key = `${suggestion.href}\t${suggestion.title}`;
    if (suggestionKeys.has(key)) {
      errors.push(`Duplicate search suggestion: ${suggestion.title}`);
    }
    suggestionKeys.add(key);

    if (!pageByPath.has(suggestion.href)) {
      errors.push(`Suggestion without page: ${suggestion.href}`);
    }
    if (!isResolvableHref(suggestion.href, registry)) {
      errors.push(`Suggestion URL does not resolve: ${suggestion.href}`);
    }
  }

  for (const page of pageByPath.values()) {
    if (!docPaths.has(page.canonical_path)) {
      errors.push(`Page without search document: ${page.canonical_path}`);
    }
    if (!search.suggestions.suggestions.some((s) => s.href === page.canonical_path)) {
      errors.push(`Page without search suggestion: ${page.canonical_path}`);
    }
  }

  const matched = [...pageByPath.keys()].filter(
    (path) => docPaths.has(path) && search.suggestions.suggestions.some((s) => s.href === path)
  ).length;

  state.coverage.search = {
    foods: pct(search.foods.documents.length, pages.foods.pages.length),
    groups: pct(search.groups.documents.length, pages.groups.pages.length),
    categories: pct(search.categories.documents.length, pages.categories.pages.length),
    overall: pct(matched, pageByPath.size),
  };

  return { errors, warnings };
}

function pairingTargetResolvable(target, relationship) {
  if (relationship.includes("style")) return /^[a-z0-9-]+$/.test(target);
  if (relationship.includes("technique")) return /^[a-z0-9-]+$/.test(target);
  if (relationship.includes("descriptor") || relationship.includes("term")) return /^[a-z0-9-]+$/.test(target);
  return true;
}

function certifyRelationshipCoverage(catalog, projections, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 6;

  const foodIds = new Set(catalog.protein_foods.map((f) => f.id));
  const groupIds = new Set(catalog.groups.map((g) => g.id));
  const categoryIds = new Set(catalog.categories.map((c) => c.id));
  const allOntologyIds = new Set([...foodIds, ...groupIds, ...categoryIds]);

  const structural = readJson(PATHS.runtime.structural);
  const editorial = readJson(PATHS.runtime.editorial);
  const pairing = readJson(PATHS.runtime.pairing);

  const edgeRegistry = new Map();
  for (const layer of [structural, editorial, pairing]) {
    for (const edge of layer.edges) {
      edgeRegistry.set(canonicalEdgeKey(edge.source, edge.relationship, edge.target), edge);
    }
  }

  for (const edge of structural.edges) {
    if (!allOntologyIds.has(edge.source)) {
      errors.push(`Structural edge missing source entity: ${edge.source}`);
    }
    if (!allOntologyIds.has(edge.target) && edge.relationship !== "category_contains") {
      if (!foodIds.has(edge.target) && !groupIds.has(edge.target)) {
        errors.push(`Structural edge missing target entity: ${edge.target}`);
      }
    }
    if (edge.relationship === "category_contains" && !groupIds.has(edge.target)) {
      errors.push(`Structural category_contains invalid group: ${edge.target}`);
    }
    if (edge.relationship === "group_contains" && !foodIds.has(edge.target)) {
      errors.push(`Structural group_contains invalid food: ${edge.target}`);
    }
  }

  for (const edge of editorial.edges) {
    if (!foodIds.has(edge.source)) {
      errors.push(`Editorial edge missing source food: ${edge.source}`);
    }
    if (edge.target.startsWith("preparation.")) continue;
    if (!foodIds.has(edge.target)) {
      errors.push(`Editorial edge missing target food: ${edge.target}`);
    }
  }

  for (const edge of pairing.edges) {
    if (!foodIds.has(edge.source)) {
      errors.push(`Pairing edge missing source food: ${edge.source}`);
    }
    if (!pairingTargetResolvable(edge.target, edge.relationship)) {
      errors.push(`Pairing edge invalid target slug: ${edge.target}`);
    }
  }

  for (const projection of projections.foods.projections) {
    const refs = [
      ...Object.values(projection.editorial_context ?? {}).flat(),
      ...Object.values(projection.wine_context ?? {}).flat(),
    ];
    for (const ref of refs) {
      const key = canonicalEdgeKey(projection.identity.id, ref.relationship, ref.target);
      if (!edgeRegistry.has(key)) {
        errors.push(`Projection missing relationship edge: ${key}`);
      }
    }
  }

  const consumedEdges = projections.foods.projections.reduce((sum, projection) => {
    const refs = [
      ...Object.values(projection.editorial_context ?? {}).flat(),
      ...Object.values(projection.wine_context ?? {}).flat(),
    ];
    return sum + refs.length;
  }, 0);

  const resolved =
    errors.length === 0
      ? 100
      : pct(
          consumedEdges - errors.filter((e) => e.includes("relationship")).length,
          Math.max(consumedEdges, 1)
        );

  state.coverage.relationships = {
    structural_edges: structural.edges.length,
    editorial_edges: editorial.edges.length,
    pairing_edges: pairing.edges.length,
    consumed_by_publication: consumedEdges,
    overall: resolved,
  };

  return { errors, warnings };
}

function certifyCrossLayerConsistency(catalog, artifacts, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 5;

  const { projections, pages, schema, navigation, search } = artifacts;
  const registry = buildHrefRegistry(pages);

  const entities = [
    ...catalog.protein_foods.map((f) => ({ id: f.id, kind: "food" })),
    ...catalog.groups.map((g) => ({ id: g.id, kind: "group" })),
    ...catalog.categories.map((c) => ({ id: c.id, kind: "category" })),
  ];

  const projectionById = new Map([
    ...projections.foods.projections.map((p) => [p.identity.id, p]),
    ...projections.groups.projections.map((p) => [p.identity.id, p]),
    ...projections.categories.projections.map((p) => [p.identity.id, p]),
  ]);

  const pageByProjection = new Map();
  for (const page of [...pages.foods.pages, ...pages.groups.pages, ...pages.categories.pages]) {
    pageByProjection.set(page.projection_id, page);
  }

  const schemaByPath = new Map(
    [...schema.foods.schemas, ...schema.groups.schemas, ...schema.categories.schemas].map((s) => [
      s.canonical_path,
      s,
    ])
  );

  const navByPath = new Map(
    [
      ...navigation.foods.link_sets,
      ...navigation.groups.link_sets,
      ...navigation.categories.link_sets,
    ].map((n) => [n.canonical_path, n])
  );

  const searchByPath = new Map(
    [...search.foods.documents, ...search.groups.documents, ...search.categories.documents].map(
      (d) => [d.canonical_path, d]
    )
  );

  const suggestionByPath = new Map(search.suggestions.suggestions.map((s) => [s.href, s]));

  let completeChains = 0;

  for (const entity of entities) {
    const projection = projectionById.get(entity.id);
    if (!projection) {
      errors.push(`Cross-layer chain broken at projection: ${entity.id}`);
      continue;
    }

    const page = pageByProjection.get(entity.id);
    if (!page) {
      errors.push(`Cross-layer chain broken at page: ${entity.id}`);
      continue;
    }

    const schemaEntry = schemaByPath.get(page.canonical_path);
    if (!schemaEntry) {
      errors.push(`Cross-layer chain broken at schema: ${entity.id}`);
      continue;
    }

    const nav = navByPath.get(page.canonical_path);
    if (!nav) {
      errors.push(`Cross-layer chain broken at navigation: ${entity.id}`);
      continue;
    }

    const doc = searchByPath.get(page.canonical_path);
    if (!doc) {
      errors.push(`Cross-layer chain broken at search document: ${entity.id}`);
      continue;
    }

    const suggestion = suggestionByPath.get(page.canonical_path);
    if (!suggestion) {
      errors.push(`Cross-layer chain broken at search suggestion: ${entity.id}`);
      continue;
    }

    if (nav.projection_id !== page.projection_id || doc.projection_id !== page.projection_id) {
      errors.push(`Cross-layer projection_id mismatch: ${entity.id}`);
    }

    if (!isResolvableHref(page.canonical_path, registry)) {
      errors.push(`Cross-layer unresolved canonical path: ${entity.id}`);
    }

    completeChains += 1;
  }

  state.coverage.cross_layer = {
    entities: entities.length,
    complete_chains: completeChains,
    overall: pct(completeChains, entities.length),
  };

  return { errors, warnings };
}

function certifyDeterminism(state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 5;

  const projectionInputs = loadProjectionInputs();
  const projectionsGenerated = generateProteinFoodProjections(projectionInputs);
  const projectionsPackaged = packageProjections(projectionsGenerated);

  const pagesGenerated = generateProteinFoodPageModels(projectionsPackaged);
  const pagesPackaged = packagePages(pagesGenerated);

  const schemaGenerated = generateProteinFoodSchema(pagesPackaged);
  const schemaPackaged = packageSchema(schemaGenerated);

  const linksGenerated = generateProteinFoodLinks(loadLinkInputs(pagesPackaged, projectionsPackaged));
  const linksPackaged = packageLinks(linksGenerated);

  const searchGenerated = generateProteinFoodSearchIndex(
    loadSearchInputs(pagesPackaged, linksPackaged, schemaPackaged)
  );
  const searchPackaged = packageSearch(searchGenerated);

  const checks = [
    ["projections.foods", PATHS.generated.foods, projectionsPackaged.foods],
    ["projections.groups", PATHS.generated.groups, projectionsPackaged.groups],
    ["projections.categories", PATHS.generated.categories, projectionsPackaged.categories],
    ["pages.foods", PATHS.pages.foods, pagesPackaged.foods],
    ["pages.groups", PATHS.pages.groups, pagesPackaged.groups],
    ["pages.categories", PATHS.pages.categories, pagesPackaged.categories],
    ["schema.foods", PATHS.schema.foods, schemaPackaged.foods],
    ["schema.groups", PATHS.schema.groups, schemaPackaged.groups],
    ["schema.categories", PATHS.schema.categories, schemaPackaged.categories],
    ["navigation.foods", PATHS.navigation.foods, linksPackaged.foods],
    ["navigation.groups", PATHS.navigation.groups, linksPackaged.groups],
    ["navigation.categories", PATHS.navigation.categories, linksPackaged.categories],
    ["search.foods", PATHS.search.foods, searchPackaged.foods],
    ["search.groups", PATHS.search.groups, searchPackaged.groups],
    ["search.categories", PATHS.search.categories, searchPackaged.categories],
    ["search.suggestions", PATHS.search.suggestions, searchPackaged.suggestions],
  ];

  let passCount = 0;
  for (const [label, filePath, data] of checks) {
    if (matchesOnDisk(filePath, data)) {
      passCount += 1;
    } else {
      errors.push(`Determinism check failed: ${label}`);
    }
  }

  state.coverage.determinism = {
    artifacts_checked: checks.length,
    artifacts_passing: passCount,
    overall: pct(passCount, checks.length),
  };

  return { errors, warnings };
}

function certifyUpstreamReports(state) {
  const warnings = [];
  state.rulesExecuted += 1;

  for (const [name, reportPath] of Object.entries(PATHS.reports.upstream)) {
    if (!fs.existsSync(reportPath)) {
      warnings.push(`Missing upstream generator report: ${name}`);
      continue;
    }
    const report = readJson(reportPath);
    if (report.overall_result !== "PASS") {
      warnings.push(`Upstream report not PASS: ${name}`);
    }
  }

  return { errors: [], warnings };
}

function pct(numerator, denominator) {
  if (!denominator) return 100;
  return Number(((numerator / denominator) * 100).toFixed(2));
}

function main() {
  const errors = [];
  const warnings = [];

  const state = {
    rulesExecuted: 0,
    foodsCertified: 0,
    groupsCertified: 0,
    categoriesCertified: 0,
    coverage: {},
  };

  for (const file of [
    PATHS.catalog,
    ...Object.values(PATHS.generated),
    ...Object.values(PATHS.pages),
    ...Object.values(PATHS.schema),
    ...Object.values(PATHS.navigation),
    ...Object.values(PATHS.search),
  ]) {
    assertFileExists(file, errors, "publication artifact");
  }

  if (errors.length > 0) {
    writeReports(state, errors, warnings, "FAIL");
    console.error(errors.join("\n"));
    process.exit(1);
  }

  const catalog = loadCatalog();
  const projections = loadProjections();
  const pages = loadPages();
  const schema = loadSchema();
  const navigation = loadNavigation();
  const search = loadSearch();
  const registry = buildHrefRegistry(pages);

  for (const result of [
    certifyProjectionCoverage(catalog, projections, state),
    certifyViewModelCoverage(projections, pages, state),
    certifySchemaCoverage(pages, schema, state),
    certifyNavigationCoverage(pages, navigation, registry, state),
    certifySearchCoverage(pages, search, registry, state),
    certifyRelationshipCoverage(catalog, projections, state),
    certifyCrossLayerConsistency(catalog, { projections, pages, schema, navigation, search }, state),
    certifyDeterminism(state),
    certifyUpstreamReports(state),
  ]) {
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  const layerValues = [
    state.coverage.projections?.overall,
    state.coverage.viewmodels?.overall,
    state.coverage.json_ld?.overall,
    state.coverage.navigation?.overall,
    state.coverage.search?.overall,
    state.coverage.cross_layer?.overall,
    state.coverage.determinism?.overall,
  ].filter((v) => typeof v === "number");

  const overallCompleteness =
    layerValues.length > 0
      ? Number((layerValues.reduce((sum, v) => sum + v, 0) / layerValues.length).toFixed(2))
      : 0;

  const overall = errors.length === 0 ? "PASS" : "FAIL";
  writeReports(state, errors, warnings, overall, overallCompleteness);

  console.log(
    JSON.stringify(
      {
        phase: "ONTOLOGY-03F",
        overall_certification: overall,
        foods_certified: state.foodsCertified,
        groups_certified: state.groupsCertified,
        categories_certified: state.categoriesCertified,
        validation_rules_executed: state.rulesExecuted,
        errors: errors.length,
        warnings: warnings.length,
        publication_completeness_percent: overallCompleteness,
      },
      null,
      2
    )
  );

  if (overall === "FAIL") {
    console.error(errors.join("\n"));
    process.exit(1);
  }
}

function writeReports(state, errors, warnings, overall, overallCompleteness = 0) {
  const certificationReport = {
    phase: "ONTOLOGY-03F",
    release_gate: true,
    overall_certification: overall,
    metrics: {
      "Foods certified": state.foodsCertified,
      "Groups certified": state.groupsCertified,
      "Categories certified": state.categoriesCertified,
      "Publication layers": PUBLICATION_LAYERS.length,
      "Validation rules executed": state.rulesExecuted,
      Errors: errors.length,
      Warnings: warnings.length,
      "Overall certification": overall,
    },
    publication_layers: PUBLICATION_LAYERS,
    validation_errors: errors,
    warnings,
    layer_results: {
      projections: state.coverage.projections ?? null,
      viewmodels: state.coverage.viewmodels ?? null,
      json_ld: state.coverage.json_ld ?? null,
      navigation: state.coverage.navigation ?? null,
      search: state.coverage.search ?? null,
      relationships: state.coverage.relationships ?? null,
      cross_layer: state.coverage.cross_layer ?? null,
      determinism: state.coverage.determinism ?? null,
    },
    outputs: [
      "reports/publication-certification-report.json",
      "reports/publication-coverage-report.json",
    ],
  };

  const coverageReport = {
    phase: "ONTOLOGY-03F",
    overall_certification: overall,
    publication_completeness_percent: overallCompleteness,
    layers: {
      projections: state.coverage.projections ?? { overall: 0 },
      viewmodels: state.coverage.viewmodels ?? { overall: 0 },
      json_ld: state.coverage.json_ld ?? { overall: 0 },
      navigation: state.coverage.navigation ?? { overall: 0 },
      search: state.coverage.search ?? { overall: 0 },
      relationships: state.coverage.relationships ?? { overall: 0 },
      cross_layer: state.coverage.cross_layer ?? { overall: 0 },
      determinism: state.coverage.determinism ?? { overall: 0 },
    },
  };

  writeJson(PATHS.reports.certification, certificationReport);
  writeJson(PATHS.reports.coverage, coverageReport);
}

main();
