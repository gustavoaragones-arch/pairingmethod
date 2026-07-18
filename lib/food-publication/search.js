import { serializeRuntime } from "../../scripts/bootstrap-protein-food-catalog.js";
import { getDomainConfig } from "../food-domain-config.js";
import { isResolvableHref } from "../protein-food-navigation.js";
import {
  collectLinkIds,
  collectTokens,
  flattenIntrinsicValues,
} from "../protein-food-search.js";
import { readJson, relative, writeJson } from "./utils.js";

const WINE_SECTION_KEYS = new Set([
  "primary_wine_styles",
  "alternative_wine_styles",
  "wine_descriptors",
  "wine_techniques",
]);

function normalizeInputs(inputs) {
  if (inputs.leafPages) return inputs;
  return {
    leafPages: inputs.foodPages,
    groupPages: inputs.groupPages,
    categoryPages: inputs.categoryPages,
    leafLinks: inputs.foodLinks,
    groupLinks: inputs.groupLinks,
    categoryLinks: inputs.categoryLinks,
    leafSchema: inputs.foodSchema,
    groupSchema: inputs.groupSchema,
    categorySchema: inputs.categorySchema,
  };
}

function groupMemberSectionKey(domain) {
  return (
    Object.keys(domain.linkSections.group).find((key) => key.startsWith("member_")) ??
    "member_foods"
  );
}

function leafEditorialSectionKeys(domain) {
  return Object.keys(domain.linkSections.leaf).filter((key) => !WINE_SECTION_KEYS.has(key));
}

function indexLinkSets(linkSets) {
  return new Map(linkSets.map((set) => [set.canonical_path, set]));
}

function indexSchemas(schemas) {
  return new Map(schemas.map((entry) => [entry.canonical_path, entry]));
}

function buildRegistry(inputs) {
  const validHrefs = new Set();
  const leafIds = new Set();
  const groupIds = new Set();
  const categoryIds = new Set();

  for (const page of inputs.leafPages.pages) {
    validHrefs.add(page.canonical_path);
    leafIds.add(page.identity.id);
  }
  for (const page of inputs.groupPages.pages) {
    validHrefs.add(page.canonical_path);
    groupIds.add(page.identity.id);
  }
  for (const page of inputs.categoryPages.pages) {
    validHrefs.add(page.canonical_path);
    categoryIds.add(page.identity.id);
  }

  const leafLinksByPath = indexLinkSets(inputs.leafLinks.link_sets);
  const groupLinksByPath = indexLinkSets(inputs.groupLinks.link_sets);
  const categoryLinksByPath = indexLinkSets(inputs.categoryLinks.link_sets);
  const leafSchemaByPath = indexSchemas(inputs.leafSchema.schemas);
  const groupSchemaByPath = indexSchemas(inputs.groupSchema.schemas);
  const categorySchemaByPath = indexSchemas(inputs.categorySchema.schemas);

  return {
    validHrefs,
    leafIds,
    groupIds,
    categoryIds,
    foodIds: leafIds,
    leafLinksByPath,
    groupLinksByPath,
    categoryLinksByPath,
    foodLinksByPath: leafLinksByPath,
    leafSchemaByPath,
    groupSchemaByPath,
    categorySchemaByPath,
    foodSchemaByPath: leafSchemaByPath,
  };
}

function buildLeafNavigation(domain, linkSet) {
  const sections = linkSet?.sections ?? {};
  const navigation = {};

  for (const sectionKey of leafEditorialSectionKeys(domain)) {
    navigation[`${sectionKey}_ids`] = collectLinkIds(sections[sectionKey] ?? []);
  }

  return navigation;
}

function buildWinePairing(domain, linkSet) {
  const sections = linkSet?.sections ?? {};
  const wineStyles = [
    ...(sections.primary_wine_styles ?? []),
    ...(sections.alternative_wine_styles ?? []),
  ];

  return {
    style_ids: collectLinkIds(wineStyles),
    descriptor_ids: collectLinkIds(sections.wine_descriptors ?? []),
    technique_ids: collectLinkIds(sections.wine_techniques ?? []),
  };
}

function leafTokenValues(domain, page) {
  const values = [
    page.identity.title,
    page.slug,
    page.overview.category?.name,
    page.overview.group?.name,
    page.slug.replace(/-/g, " "),
    ...flattenIntrinsicValues(page.characteristics),
  ];

  for (const field of domain.intrinsicFields ?? []) {
    const value = page.characteristics?.[field];
    if (value !== undefined && value !== null && value !== "") {
      values.push(value);
    }
  }

  if (page.overview.scientific_name) values.push(page.overview.scientific_name);
  if (page.overview.species) values.push(page.overview.species);

  for (const [key, value] of Object.entries(domain.classificationFields ?? {})) {
    if (page.overview[key] !== undefined) values.push(page.overview[key]);
    if (page.overview[value] !== undefined) values.push(page.overview[value]);
  }

  return values;
}

function buildLeafDocument(domain, page, linkSet) {
  const navigation = buildLeafNavigation(domain, linkSet);
  const winePairing = buildWinePairing(domain, linkSet);
  const tokens = collectTokens(leafTokenValues(domain, page));

  const classification = {
    category: page.overview.category
      ? {
          id: page.overview.category.id,
          slug: page.overview.category.slug,
          name: page.overview.category.name,
        }
      : null,
    group: page.overview.group
      ? {
          id: page.overview.group.id,
          slug: page.overview.group.slug,
          name: page.overview.group.name,
        }
      : null,
  };

  for (const [key, value] of Object.entries(page.overview)) {
    if (key === "category" || key === "group" || key === "display_name") continue;
    classification[key] = value;
  }

  return {
    document_type: domain.pageTypes.leaf,
    id: page.identity.id,
    slug: page.slug,
    canonical_path: page.canonical_path,
    canonical_url: page.metadata.canonical,
    display_name: page.identity.title,
    classification,
    intrinsic: page.characteristics,
    navigation,
    wine_pairing: winePairing,
    tokens,
    projection_id: page.projection_id,
  };
}

function groupAggregateValues(domain, page) {
  const values = [];
  for (const outputKey of Object.values(domain.groupAggregateFields ?? {})) {
    if (Array.isArray(page[outputKey])) values.push(...page[outputKey]);
  }
  return values;
}

function groupAggregateDocumentFields(domain, page) {
  const fields = {};
  for (const outputKey of Object.values(domain.groupAggregateFields ?? {})) {
    if (outputKey in page) {
      fields[outputKey] = [...(page[outputKey] ?? [])].sort();
    }
  }
  if ("species_represented" in page) {
    fields.species_represented = [...(page.species_represented ?? [])].sort();
  }
  if ("processing_states_represented" in page) {
    fields.processing_states_represented = [...(page.processing_states_represented ?? [])].sort();
  }
  return fields;
}

function buildGroupDocument(domain, page, linkSet) {
  const memberSectionKey = groupMemberSectionKey(domain);
  const memberSection = linkSet?.sections?.[memberSectionKey] ?? page[memberSectionKey] ?? [];

  const tokens = collectTokens([
    page.identity.title,
    page.slug,
    page.overview.parent_category?.name,
    page.slug.replace(/-/g, " "),
    ...groupAggregateValues(domain, page),
  ]);

  return {
    document_type: domain.pageTypes.group,
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
    member_food_ids: collectLinkIds(memberSection),
    ...groupAggregateDocumentFields(domain, page),
    tokens,
    projection_id: page.projection_id,
  };
}

function buildCategoryDocument(domain, page, linkSet) {
  const tokens = collectTokens([
    page.identity.title,
    page.slug,
    page.slug.replace(/-/g, " "),
    String(page.overview.food_count),
    String(page.overview.group_count),
    ...(page.groups ?? []).map((group) => group.name),
  ]);

  return {
    document_type: domain.pageTypes.category,
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
    group_ids: collectLinkIds(linkSet?.sections?.groups ?? page.groups.map((group) => ({ id: group.id }))),
    tokens,
    projection_id: page.projection_id,
  };
}

function suggestionType(domain, pageType) {
  if (pageType === domain.pageTypes.leaf) return domain.id === "protein" ? "food" : domain.pageTypes.leaf;
  if (pageType === domain.pageTypes.group) return "group";
  if (pageType === domain.pageTypes.category) return "category";
  return pageType;
}

function buildSuggestion(page, type) {
  return {
    title: page.identity.title,
    href: page.canonical_path,
    type,
    tokens: collectTokens([page.identity.title, page.slug, page.slug.replace(/-/g, " ")]),
  };
}

export function generateSearchIndex(domain, inputs) {
  const normalized = normalizeInputs(inputs);
  const registry = buildRegistry(normalized);

  const leafDocuments = normalized.leafPages.pages
    .map((page) =>
      buildLeafDocument(domain, page, registry.leafLinksByPath.get(page.canonical_path))
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  const groupDocuments = normalized.groupPages.pages
    .map((page) =>
      buildGroupDocument(domain, page, registry.groupLinksByPath.get(page.canonical_path))
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  const categoryDocuments = normalized.categoryPages.pages
    .map((page) =>
      buildCategoryDocument(domain, page, registry.categoryLinksByPath.get(page.canonical_path))
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  const suggestions = [
    ...normalized.leafPages.pages.map((page) =>
      buildSuggestion(page, suggestionType(domain, domain.pageTypes.leaf))
    ),
    ...normalized.groupPages.pages.map((page) =>
      buildSuggestion(page, suggestionType(domain, domain.pageTypes.group))
    ),
    ...normalized.categoryPages.pages.map((page) =>
      buildSuggestion(page, suggestionType(domain, domain.pageTypes.category))
    ),
  ].sort((a, b) => {
    const titleCmp = a.title.localeCompare(b.title);
    if (titleCmp !== 0) return titleCmp;
    return a.href.localeCompare(b.href);
  });

  const indexedTokens = new Set();
  for (const doc of [...leafDocuments, ...groupDocuments, ...categoryDocuments]) {
    for (const token of doc.tokens) indexedTokens.add(token);
  }

  return {
    meta: {
      phase: `${domain.phasePrefix}E`,
      domain: domain.id,
      catalog_version: normalized.leafPages.meta.catalog_version,
      food_ontology_version: normalized.leafPages.meta.food_ontology_version,
    },
    leafDocuments,
    groupDocuments,
    categoryDocuments,
    suggestions,
    indexedTokenCount: indexedTokens.size,
    registry,
    inputs: normalized,
  };
}

export function generateProteinFoodSearchIndex(inputs) {
  const domain = getDomainConfig("protein");
  const generated = generateSearchIndex(domain, inputs);

  const foodDocuments = generated.leafDocuments.map((doc) => ({
    ...doc,
    document_type: "protein_food",
    navigation: {
      similar_food_ids: doc.navigation.similar_foods_ids ?? [],
      substitution_ids: doc.navigation.substitutions_ids ?? [],
      culinary_role_ids: doc.navigation.culinary_role_ids ?? [],
      preparation_ids: doc.navigation.common_preparations_ids ?? [],
    },
  }));

  return {
    meta: {
      phase: generated.meta.phase,
      catalog_version: generated.meta.catalog_version,
      food_ontology_version: generated.meta.food_ontology_version,
    },
    foodDocuments,
    groupDocuments: generated.groupDocuments.map((doc) => ({
      ...doc,
      document_type: "protein_group",
    })),
    categoryDocuments: generated.categoryDocuments.map((doc) => ({
      ...doc,
      document_type: "protein_category",
    })),
    suggestions: generated.suggestions,
    indexedTokenCount: generated.indexedTokenCount,
    registry: generated.registry,
    inputs,
  };
}

function preparationSectionKey(domain) {
  return domain.editorial.byRelationship.commonly_prepared_as ?? null;
}

function crossDomainSectionKeys(domain) {
  const crossDomain = new Set(domain.editorial.crossDomainTargets);
  return Object.entries(domain.editorial.byRelationship)
    .filter(([relationship]) => crossDomain.has(relationship))
    .map(([, bucket]) => bucket);
}

function validateSearchIndex(domain, generated) {
  const errors = [];
  let brokenReferences = 0;
  let duplicateDocuments = 0;

  const docIds = new Set();
  const suggestionKeys = new Set();
  const prepSectionKey = preparationSectionKey(domain);
  const prepPrefix = domain.editorial.preparationPrefix;
  const crossDomainSections = new Set(crossDomainSectionKeys(domain));

  const allDocs = [
    ...generated.leafDocuments,
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
      generated.inputs.leafPages.pages.some((page) => page.identity.id === doc.id) ||
      generated.inputs.groupPages.pages.some((page) => page.identity.id === doc.id) ||
      generated.inputs.categoryPages.pages.some((page) => page.identity.id === doc.id);

    if (!pageExists) errors.push(`Missing page for document: ${doc.id}`);

    const schemaMap =
      doc.document_type === domain.pageTypes.leaf
        ? generated.registry.leafSchemaByPath
        : doc.document_type === domain.pageTypes.group
          ? generated.registry.groupSchemaByPath
          : generated.registry.categorySchemaByPath;

    if (!schemaMap.has(doc.canonical_path)) {
      brokenReferences += 1;
      errors.push(`Missing schema for document: ${doc.canonical_path}`);
    }

    if (doc.document_type === domain.pageTypes.leaf) {
      for (const [sectionKey, ids] of Object.entries(doc.navigation)) {
        if (crossDomainSections.has(sectionKey.replace(/_ids$/, ""))) continue;

        if (prepSectionKey && sectionKey === `${prepSectionKey}_ids`) {
          for (const prepId of ids) {
            if (prepPrefix && !prepId.startsWith(prepPrefix)) {
              brokenReferences += 1;
              errors.push(`${doc.slug}: invalid preparation id ${prepId}`);
            }
          }
          continue;
        }

        for (const id of ids) {
          if (!generated.registry.leafIds.has(id)) {
            brokenReferences += 1;
            errors.push(`${doc.slug}: broken navigation reference ${id} (${sectionKey})`);
          }
        }
      }
    }

    if (doc.document_type === domain.pageTypes.group) {
      for (const id of doc.member_food_ids) {
        if (!generated.registry.leafIds.has(id)) {
          brokenReferences += 1;
          errors.push(`${doc.slug}: broken member food ${id}`);
        }
      }
    }

    if (doc.document_type === domain.pageTypes.category) {
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

  if (generated.leafDocuments.length !== generated.inputs.leafPages.pages.length) {
    errors.push("Leaf document count mismatch");
  }
  if (generated.groupDocuments.length !== generated.inputs.groupPages.pages.length) {
    errors.push("Group document count mismatch");
  }
  if (generated.categoryDocuments.length !== generated.inputs.categoryPages.pages.length) {
    errors.push("Category document count mismatch");
  }

  return { errors, brokenReferences, duplicateDocuments };
}

function mapLeafDocumentsForOutput(domain, generated) {
  if (domain.id !== "protein") return generated.leafDocuments;
  return generated.leafDocuments.map((doc) => ({
    ...doc,
    navigation: {
      similar_food_ids: doc.navigation.similar_foods_ids ?? [],
      substitution_ids: doc.navigation.substitutions_ids ?? [],
      culinary_role_ids: doc.navigation.culinary_role_ids ?? [],
      preparation_ids: doc.navigation.common_preparations_ids ?? [],
    },
  }));
}

export function packageSearchOutput(domain, generated) {
  const leafDocuments = mapLeafDocumentsForOutput(domain, generated);
  return {
    leaf: {
      meta: {
        ...generated.meta,
        document_type: domain.pageTypes.leaf,
        document_count: leafDocuments.length,
      },
      documents: leafDocuments,
    },
    group: {
      meta: {
        ...generated.meta,
        document_type: domain.pageTypes.group,
        document_count: generated.groupDocuments.length,
      },
      documents: generated.groupDocuments,
    },
    category: {
      meta: {
        ...generated.meta,
        document_type: domain.pageTypes.category,
        document_count: generated.categoryDocuments.length,
      },
      documents: generated.categoryDocuments,
    },
    suggestions: {
      meta: {
        ...generated.meta,
        document_type: domain.pageTypes.suggestions,
        suggestion_count: generated.suggestions.length,
      },
      suggestions: generated.suggestions,
    },
  };
}

function packageOutput(domain, generated) {
  return packageSearchOutput(domain, generated);
}

function loadSearchInputs(domain) {
  return {
    leafPages: readJson(domain.paths.pages.leaf),
    groupPages: readJson(domain.paths.pages.group),
    categoryPages: readJson(domain.paths.pages.category),
    leafLinks: readJson(domain.paths.navigation.leaf),
    groupLinks: readJson(domain.paths.navigation.group),
    categoryLinks: readJson(domain.paths.navigation.category),
    leafSchema: readJson(domain.paths.schema.leaf),
    groupSchema: readJson(domain.paths.schema.group),
    categorySchema: readJson(domain.paths.schema.category),
  };
}

export function runSearchStage(domain) {
  const inputs = loadSearchInputs(domain);
  const generated = generateSearchIndex(domain, inputs);
  const packaged = packageOutput(domain, generated);
  const validation = validateSearchIndex(domain, generated);

  const determinismPass =
    serializeRuntime(packaged.leaf) ===
    serializeRuntime(packageOutput(domain, generateSearchIndex(domain, inputs)).leaf);

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  const report = {
    phase: `${domain.phasePrefix}E`,
    domain: domain.id,
    overall_result: overall,
    validation_errors: overall === "PASS" ? [] : validation.errors,
    outputs:
      overall === "PASS"
        ? [
            domain.paths.search.leaf,
            domain.paths.search.group,
            domain.paths.search.category,
            domain.paths.search.suggestions,
          ].map((filePath) => relative(domain.root, filePath))
        : undefined,
    metrics: {
      "Leaf search documents": generated.leafDocuments.length,
      "Group search documents": generated.groupDocuments.length,
      "Category search documents": generated.categoryDocuments.length,
      Suggestions: generated.suggestions.length,
      "Indexed tokens": generated.indexedTokenCount,
      "Duplicate documents": overall === "PASS" ? 0 : validation.duplicateDocuments,
      "Broken references": overall === "PASS" ? 0 : validation.brokenReferences,
      "Validation errors": overall === "PASS" ? 0 : validation.errors.length,
      "Deterministic regeneration": determinismPass ? "PASS" : "FAIL",
      "Overall result": overall,
    },
  };

  if (overall === "FAIL") {
    writeJson(domain.paths.reports.search, report);
    console.error(validation.errors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(domain.paths.search.leaf, packaged.leaf);
  writeJson(domain.paths.search.group, packaged.group);
  writeJson(domain.paths.search.category, packaged.category);
  writeJson(domain.paths.search.suggestions, packaged.suggestions);
  writeJson(domain.paths.reports.search, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${domain.paths.reports.search}`);
  return report;
}
