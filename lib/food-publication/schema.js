import { serializeRuntime } from "../../scripts/bootstrap-protein-food-catalog.js";
import { getDomainConfig } from "../food-domain-config.js";
import { absoluteUrl } from "../public-url.js";
import {
  buildBreadcrumbListSchema,
  buildFoodTaxonSchema,
  CATEGORY_SCHEMA_TYPES,
  FOOD_SCHEMA_TYPES,
  GROUP_SCHEMA_TYPES,
  pageIds,
} from "../protein-food-schema.js";
import { categoryUrl, groupUrl, readJson, relative, writeJson } from "./utils.js";

function normalizePageModels(pageModels) {
  if (pageModels.leafPages) return pageModels;
  return {
    leafPages: pageModels.foods,
    groupPages: pageModels.groups,
    categoryPages: pageModels.categories,
  };
}

function groupMemberKey(domain) {
  return (
    Object.keys(domain.linkSections.group).find((key) => key.startsWith("member_")) ??
    "member_foods"
  );
}

function ontologySet(domain) {
  return {
    "@type": "DefinedTermSet",
    name: domain.metadata.ontologyName,
    url: absoluteUrl("/"),
  };
}

function website() {
  return {
    "@type": "WebSite",
    name: "Pairing Method",
    url: absoluteUrl("/"),
  };
}

function crumbHref(page, label) {
  return page.breadcrumbs.find((crumb) => crumb.label === label)?.href;
}

function buildFoodWebPageSchema(domain, page, ids) {
  const about = [];
  if (page.overview.category) {
    about.push({
      "@type": "DefinedTermSet",
      "@id":
        absoluteUrl(
          crumbHref(page, page.overview.category.name) ??
            categoryUrl(domain, page.overview.category.slug)
        ) + "#definedtermset",
      name: page.overview.category.name,
      identifier: page.overview.category.id,
    });
  }
  if (page.overview.group) {
    about.push({
      "@type": "DefinedTermSet",
      "@id":
        absoluteUrl(
          crumbHref(page, page.overview.group.name) ??
            groupUrl(domain, page.overview.group.slug)
        ) + "#definedtermset",
      name: page.overview.group.name,
      identifier: page.overview.group.id,
    });
  }
  if (page.overview.scientific_name) {
    about.push({ "@type": "Taxon", "@id": ids.taxon, name: page.overview.scientific_name });
  }
  if (page.overview.species) {
    about.push({
      "@type": "PropertyValue",
      name: "species",
      value: page.overview.species,
    });
  }

  const block = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": ids.webpage,
    url: ids.url,
    name: page.metadata.title,
    description: page.metadata.description,
    breadcrumb: { "@id": ids.breadcrumb },
    isPartOf: website(),
  };

  if (about.length > 0) block.about = about;
  return block;
}

function buildFoodDefinedTermSchema(domain, page, ids) {
  const term = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": ids.definedTerm,
    identifier: page.identity.id,
    name: page.identity.title,
    alternateName: page.identity.slug,
    description: page.metadata.description,
    url: ids.url,
    inDefinedTermSet: ontologySet(domain),
  };

  if (page.overview.group) {
    term.isPartOf = {
      "@type": "DefinedTermSet",
      "@id":
        absoluteUrl(
          crumbHref(page, page.overview.group.name) ??
            groupUrl(domain, page.overview.group.slug)
        ) + "#definedtermset",
      name: page.overview.group.name,
      identifier: page.overview.group.id,
    };
  }

  return term;
}

function buildFoodSchemas(domain, page) {
  const ids = pageIds(page);
  const schemas = [
    buildFoodWebPageSchema(domain, page, ids),
    buildBreadcrumbListSchema(page, ids),
    buildFoodDefinedTermSchema(domain, page, ids),
  ];

  const taxon = buildFoodTaxonSchema(page, ids);
  if (taxon) schemas.push(taxon);

  return schemas;
}

function buildGroupCollectionPageSchema(domain, page, ids) {
  const block = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": ids.collectionPage,
    url: ids.url,
    name: page.metadata.title,
    description: page.metadata.description,
    breadcrumb: { "@id": ids.breadcrumb },
    isPartOf: website(),
  };

  if (page.overview.parent_category) {
    block.about = {
      "@type": "DefinedTermSet",
      "@id":
        absoluteUrl(
          crumbHref(page, page.overview.parent_category.name) ??
            categoryUrl(domain, page.overview.parent_category.slug)
        ) + "#definedtermset",
      name: page.overview.parent_category.name,
      identifier: page.overview.parent_category.id,
    };
  }

  return block;
}

function buildGroupDefinedTermSetSchema(domain, page, ids) {
  const memberKey = groupMemberKey(domain);
  const members = page[memberKey] ?? page.member_foods ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": ids.definedTermSet,
    identifier: page.identity.id,
    name: page.identity.title,
    alternateName: page.identity.slug,
    description: page.metadata.description,
    url: ids.url,
    numberOfTerms: page.overview.food_count,
    inDefinedTermSet: ontologySet(domain),
    hasPart: members.map((food) => ({
      "@type": "DefinedTerm",
      "@id": absoluteUrl(food.href) + "#definedterm",
      name: food.name,
      identifier: food.id,
      url: absoluteUrl(food.href),
    })),
  };
}

function buildGroupSchemas(domain, page) {
  const ids = pageIds(page);
  return [
    buildGroupCollectionPageSchema(domain, page, ids),
    buildBreadcrumbListSchema(page, ids),
    buildGroupDefinedTermSetSchema(domain, page, ids),
  ];
}

function buildCategoryCollectionPageSchema(page, ids) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": ids.collectionPage,
    url: ids.url,
    name: page.metadata.title,
    description: page.metadata.description,
    breadcrumb: { "@id": ids.breadcrumb },
    isPartOf: website(),
  };
}

function buildCategoryDefinedTermSetSchema(domain, page, ids) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": ids.definedTermSet,
    identifier: page.identity.id,
    name: page.identity.title,
    alternateName: page.identity.slug,
    description: page.metadata.description,
    url: ids.url,
    numberOfTerms: page.overview.food_count,
    inDefinedTermSet: ontologySet(domain),
    hasPart: page.groups.map((group) => ({
      "@type": "DefinedTermSet",
      "@id": absoluteUrl(group.href) + "#definedtermset",
      name: group.name,
      identifier: group.id,
      url: absoluteUrl(group.href),
      numberOfTerms: group.food_count,
    })),
  };
}

function buildCategorySchemas(domain, page) {
  const ids = pageIds(page);
  return [
    buildCategoryCollectionPageSchema(page, ids),
    buildBreadcrumbListSchema(page, ids),
    buildCategoryDefinedTermSetSchema(domain, page, ids),
  ];
}

function schemaEntry(page, jsonLd) {
  return {
    slug: page.slug,
    canonical_path: page.canonical_path,
    projection_id: page.projection_id,
    json_ld: jsonLd,
  };
}

export function generateSchema(domain, pageModels) {
  const models = normalizePageModels(pageModels);

  const pageUrlByPath = new Map();
  for (const page of models.leafPages.pages) pageUrlByPath.set(page.canonical_path, page);
  for (const page of models.groupPages.pages) pageUrlByPath.set(page.canonical_path, page);
  for (const page of models.categoryPages.pages) pageUrlByPath.set(page.canonical_path, page);

  const leafSchemas = models.leafPages.pages
    .map((page) => schemaEntry(page, buildFoodSchemas(domain, page)))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const groupSchemas = models.groupPages.pages
    .map((page) => schemaEntry(page, buildGroupSchemas(domain, page)))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const categorySchemas = models.categoryPages.pages
    .map((page) => schemaEntry(page, buildCategorySchemas(domain, page)))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    meta: {
      phase: `${domain.phasePrefix}C`,
      domain: domain.id,
      catalog_version: models.leafPages.meta.catalog_version,
      food_ontology_version: models.leafPages.meta.food_ontology_version,
    },
    leafSchemas,
    groupSchemas,
    categorySchemas,
    pageUrlByPath,
    pageModels: models,
  };
}

export function generateProteinFoodSchema(pageModels) {
  const domain = getDomainConfig("protein");
  const generated = generateSchema(domain, pageModels);

  return {
    meta: {
      phase: generated.meta.phase,
      catalog_version: generated.meta.catalog_version,
      food_ontology_version: generated.meta.food_ontology_version,
    },
    foodSchemas: generated.leafSchemas,
    groupSchemas: generated.groupSchemas,
    categorySchemas: generated.categorySchemas,
    pageUrlByPath: generated.pageUrlByPath,
    pageModels,
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

function validateSchemaOutput(domain, generated) {
  const errors = [];
  const atIds = new Set();
  const canonicalUrls = new Set();
  let invalidReferences = 0;

  const allEntries = [
    ...generated.leafSchemas,
    ...generated.groupSchemas,
    ...generated.categorySchemas,
  ];

  const pageByPath = new Map();
  for (const page of generated.pageModels.leafPages.pages) {
    pageByPath.set(page.canonical_path, page);
  }
  for (const page of generated.pageModels.groupPages.pages) {
    pageByPath.set(page.canonical_path, page);
  }
  for (const page of generated.pageModels.categoryPages.pages) {
    pageByPath.set(page.canonical_path, page);
  }

  if (generated.leafSchemas.length !== generated.pageModels.leafPages.pages.length) {
    errors.push("Missing leaf schemas");
  }
  if (generated.groupSchemas.length !== generated.pageModels.groupPages.pages.length) {
    errors.push("Missing group schemas");
  }
  if (generated.categorySchemas.length !== generated.pageModels.categoryPages.pages.length) {
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
    duplicateAtId: errors.filter((error) => error.startsWith("Duplicate @id")).length,
    invalidReferences,
  };
}

function packageOutput(domain, generated) {
  return {
    leaf: {
      meta: {
        ...generated.meta,
        schema_type: domain.pageTypes.leaf,
        schema_count: generated.leafSchemas.length,
      },
      schemas: generated.leafSchemas,
    },
    group: {
      meta: {
        ...generated.meta,
        schema_type: domain.pageTypes.group,
        schema_count: generated.groupSchemas.length,
      },
      schemas: generated.groupSchemas,
    },
    category: {
      meta: {
        ...generated.meta,
        schema_type: domain.pageTypes.category,
        schema_count: generated.categorySchemas.length,
      },
      schemas: generated.categorySchemas,
    },
  };
}

function computeReportMetrics(generated) {
  const allEntries = [
    ...generated.leafSchemas,
    ...generated.groupSchemas,
    ...generated.categorySchemas,
  ];
  const objectCount = allEntries.reduce((sum, entry) => sum + entry.json_ld.length, 0);
  const schemaTypes = new Set();
  for (const entry of allEntries) {
    for (const type of collectSchemaTypes(entry.json_ld)) schemaTypes.add(type);
  }

  return {
    leafSchemas: generated.leafSchemas.length,
    groupSchemas: generated.groupSchemas.length,
    categorySchemas: generated.categorySchemas.length,
    schemaTypesGenerated: [...schemaTypes].sort(),
    jsonLdObjectsEmitted: objectCount,
    averageObjectsPerPage:
      allEntries.length > 0 ? Number((objectCount / allEntries.length).toFixed(2)) : 0,
  };
}

function loadPageModels(domain) {
  return {
    leafPages: readJson(domain.paths.pages.leaf),
    groupPages: readJson(domain.paths.pages.group),
    categoryPages: readJson(domain.paths.pages.category),
  };
}

export function runSchemaStage(domain) {
  const pageModels = loadPageModels(domain);
  const generated = generateSchema(domain, pageModels);
  const packaged = packageOutput(domain, generated);
  const validation = validateSchemaOutput(domain, generated);
  const metrics = computeReportMetrics(generated);

  const determinismPass =
    serializeRuntime(packaged.leaf) ===
    serializeRuntime(packageOutput(domain, generateSchema(domain, pageModels)).leaf);

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  const report = {
    phase: `${domain.phasePrefix}C`,
    domain: domain.id,
    overall_result: overall,
    overall_certification: overall,
    validation_errors: overall === "PASS" ? [] : validation.errors,
    outputs:
      overall === "PASS"
        ? [domain.paths.schema.leaf, domain.paths.schema.group, domain.paths.schema.category].map(
            (filePath) => relative(domain.root, filePath)
          )
        : undefined,
    metrics: {
      "Leaf schemas": metrics.leafSchemas,
      "Group schemas": metrics.groupSchemas,
      "Category schemas": metrics.categorySchemas,
      "Schema types generated": metrics.schemaTypesGenerated.length,
      "JSON-LD objects emitted": metrics.jsonLdObjectsEmitted,
      "Average objects per page": metrics.averageObjectsPerPage,
      "Duplicate @id": overall === "PASS" ? 0 : validation.duplicateAtId,
      "Invalid references": overall === "PASS" ? 0 : validation.invalidReferences,
      "Validation errors": overall === "PASS" ? 0 : validation.errors.length,
      "Deterministic regeneration": determinismPass ? "PASS" : "FAIL",
      "Overall result": overall,
      "Overall certification": overall,
    },
    schema_types: metrics.schemaTypesGenerated,
    builders: {
      leaf: FOOD_SCHEMA_TYPES,
      group: GROUP_SCHEMA_TYPES,
      category: CATEGORY_SCHEMA_TYPES,
    },
  };

  if (overall === "FAIL") {
    writeJson(domain.paths.reports.schema, report);
    console.error(validation.errors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(domain.paths.schema.leaf, packaged.leaf);
  writeJson(domain.paths.schema.group, packaged.group);
  writeJson(domain.paths.schema.category, packaged.category);
  writeJson(domain.paths.reports.schema, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${domain.paths.reports.schema}`);
  return report;
}
