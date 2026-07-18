/**
 * FOOD-04F — Generalized publication coverage and certification (ONTOLOGY-03F).
 * Read-only release gate: verifies every publication artifact is complete,
 * internally consistent, and deterministic.
 */

import fs from "fs";
import path from "path";
import { serializeRuntime } from "../../scripts/bootstrap-protein-food-catalog.js";
import { getDomainConfig } from "../food-domain-config.js";
import { isResolvableHref } from "../protein-food-navigation.js";
import { generateLinks } from "./links.js";
import { generatePageModels } from "./pages.js";
import { generateProjections } from "./projections.js";
import { loadDomainInputs } from "./runtime-loader.js";
import { generateSchema } from "./schema.js";
import { generateSearchIndex, packageSearchOutput } from "./search.js";
import { readJson, relative, writeJson } from "./utils.js";

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

function certificationPhase(domain) {
  return domain.certificationPhase ?? `${domain.phasePrefix}F`;
}

function resolveDomain(domainOrId) {
  return typeof domainOrId === "string" ? getDomainConfig(domainOrId) : domainOrId;
}

function canonicalEdgeKey(source, relationship, target, symmetric) {
  if (symmetric.has(relationship)) {
    const [a, b] = source.localeCompare(target) <= 0 ? [source, target] : [target, source];
    return `${a}\t${relationship}\t${b}`;
  }
  return `${source}\t${relationship}\t${target}`;
}

function assertFileExists(filePath, errors, domain, label) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing ${label}: ${relative(domain.root, filePath)}`);
    return false;
  }
  return true;
}

function loadCatalog(domain) {
  return readJson(domain.paths.catalog);
}

function loadProjections(domain) {
  return {
    leaf: readJson(domain.paths.projections.leaf),
    group: readJson(domain.paths.projections.group),
    category: readJson(domain.paths.projections.category),
  };
}

function loadPages(domain) {
  return {
    leaf: readJson(domain.paths.pages.leaf),
    group: readJson(domain.paths.pages.group),
    category: readJson(domain.paths.pages.category),
  };
}

function loadSchema(domain) {
  return {
    leaf: readJson(domain.paths.schema.leaf),
    group: readJson(domain.paths.schema.group),
    category: readJson(domain.paths.schema.category),
  };
}

function loadNavigation(domain) {
  return {
    leaf: readJson(domain.paths.navigation.leaf),
    group: readJson(domain.paths.navigation.group),
    category: readJson(domain.paths.navigation.category),
  };
}

function loadSearch(domain) {
  return {
    leaf: readJson(domain.paths.search.leaf),
    group: readJson(domain.paths.search.group),
    category: readJson(domain.paths.search.category),
    suggestions: readJson(domain.paths.search.suggestions),
  };
}

function loadLinkInputs(domain, pages, projections) {
  return {
    leafPages: pages.leaf,
    groupPages: pages.group,
    categoryPages: pages.category,
    projections: {
      leaf: projections.leaf,
      group: projections.group,
      category: projections.category,
    },
    structural: readJson(domain.publicationArtifacts.relationships[0]),
    editorial: readJson(domain.publicationArtifacts.relationships[1]),
    pairing: readJson(domain.publicationArtifacts.relationships[2]),
  };
}

function loadSearchInputs(domain, pages, navigation, schema) {
  return {
    leafPages: pages.leaf,
    groupPages: pages.group,
    categoryPages: pages.category,
    leafLinks: navigation.leaf,
    groupLinks: navigation.group,
    categoryLinks: navigation.category,
    leafSchema: schema.leaf,
    groupSchema: schema.group,
    categorySchema: schema.category,
  };
}

function packageProjections(domain, generated) {
  const { meta, leafProjections, groupProjections, categoryProjections } = generated;
  return {
    leaf: {
      meta: { ...meta, projection_type: domain.projectionTypes.leaf, projection_count: leafProjections.length },
      projections: leafProjections,
    },
    group: {
      meta: { ...meta, projection_type: domain.projectionTypes.group, projection_count: groupProjections.length },
      projections: groupProjections,
    },
    category: {
      meta: {
        ...meta,
        projection_type: domain.projectionTypes.category,
        projection_count: categoryProjections.length,
      },
      projections: categoryProjections,
    },
  };
}

function packagePages(domain, generated) {
  return {
    leaf: {
      meta: { ...generated.meta, page_type: domain.pageTypes.leaf, page_count: generated.leafPages.length },
      pages: generated.leafPages,
    },
    group: {
      meta: { ...generated.meta, page_type: domain.pageTypes.group, page_count: generated.groupPages.length },
      pages: generated.groupPages,
    },
    category: {
      meta: {
        ...generated.meta,
        page_type: domain.pageTypes.category,
        page_count: generated.categoryPages.length,
      },
      pages: generated.categoryPages,
    },
  };
}

function packageSchema(domain, generated) {
  return {
    leaf: {
      meta: { ...generated.meta, schema_type: domain.pageTypes.leaf, schema_count: generated.leafSchemas.length },
      schemas: generated.leafSchemas,
    },
    group: {
      meta: { ...generated.meta, schema_type: domain.pageTypes.group, schema_count: generated.groupSchemas.length },
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

function packageLinks(domain, generated) {
  return {
    leaf: {
      meta: { ...generated.meta, link_set_type: domain.pageTypes.leaf, link_set_count: generated.leafLinkSets.length },
      link_sets: generated.leafLinkSets,
    },
    group: {
      meta: { ...generated.meta, link_set_type: domain.pageTypes.group, link_set_count: generated.groupLinkSets.length },
      link_sets: generated.groupLinkSets,
    },
    category: {
      meta: {
        ...generated.meta,
        link_set_type: domain.pageTypes.category,
        link_set_count: generated.categoryLinkSets.length,
      },
      link_sets: generated.categoryLinkSets,
    },
  };
}

function packageSearch(domain, generated) {
  return packageSearchOutput(domain, generated);
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

function buildHrefRegistry(domain, pages) {
  const validHrefs = new Set(["/", domain.urls.hubPath]);
  const leafIds = new Set();
  const groupIds = new Set();
  const categoryIds = new Set();

  for (const page of pages.leaf.pages) {
    validHrefs.add(page.canonical_path);
    leafIds.add(page.identity.id);
  }
  for (const page of pages.group.pages) {
    validHrefs.add(page.canonical_path);
    groupIds.add(page.identity.id);
  }
  for (const page of pages.category.pages) {
    validHrefs.add(page.canonical_path);
    categoryIds.add(page.identity.id);
  }

  return { validHrefs, leafIds, groupIds, categoryIds, foodIds: leafIds };
}

function pct(numerator, denominator) {
  if (!denominator) return 100;
  return Number(((numerator / denominator) * 100).toFixed(2));
}

function certifyProjectionCoverage(domain, catalog, projections, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 8;

  const leafIds = new Set(catalog[domain.catalogKeys.leaf].map((entry) => entry.id));
  const groupIds = new Set(catalog[domain.catalogKeys.groups].map((entry) => entry.id));
  const categoryIds = new Set(catalog[domain.catalogKeys.categories].map((entry) => entry.id));

  const leafProjections = projections.leaf.projections;
  const groupProjections = projections.group.projections;
  const categoryProjections = projections.category.projections;

  const projectedLeafIds = new Set(leafProjections.map((p) => p.identity.id));
  const projectedGroupIds = new Set(groupProjections.map((p) => p.identity.id));
  const projectedCategoryIds = new Set(categoryProjections.map((p) => p.identity.id));

  if (leafProjections.length !== leafIds.size) {
    errors.push(`Leaf projection count mismatch: expected ${leafIds.size}, got ${leafProjections.length}`);
  }
  if (groupProjections.length !== groupIds.size) {
    errors.push(`Group projection count mismatch: expected ${groupIds.size}, got ${groupProjections.length}`);
  }
  if (categoryProjections.length !== categoryIds.size) {
    errors.push(
      `Category projection count mismatch: expected ${categoryIds.size}, got ${categoryProjections.length}`
    );
  }

  for (const id of leafIds) {
    if (!projectedLeafIds.has(id)) errors.push(`Missing leaf projection: ${id}`);
  }
  for (const id of groupIds) {
    if (!projectedGroupIds.has(id)) errors.push(`Missing group projection: ${id}`);
  }
  for (const id of categoryIds) {
    if (!projectedCategoryIds.has(id)) errors.push(`Missing category projection: ${id}`);
  }

  for (const projection of leafProjections) {
    if (!leafIds.has(projection.identity.id)) {
      errors.push(`Orphan leaf projection: ${projection.identity.id}`);
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

  const leafDupes = leafProjections.length - projectedLeafIds.size;
  const groupDupes = groupProjections.length - projectedGroupIds.size;
  const categoryDupes = categoryProjections.length - projectedCategoryIds.size;
  if (leafDupes > 0) errors.push(`Duplicate leaf projections: ${leafDupes}`);
  if (groupDupes > 0) errors.push(`Duplicate group projections: ${groupDupes}`);
  if (categoryDupes > 0) errors.push(`Duplicate category projections: ${categoryDupes}`);

  const leafCovered = [...leafIds].filter((id) => projectedLeafIds.has(id)).length;
  const groupCovered = [...groupIds].filter((id) => projectedGroupIds.has(id)).length;
  const categoryCovered = [...categoryIds].filter((id) => projectedCategoryIds.has(id)).length;

  state.coverage.projections = {
    leaf: pct(leafCovered, leafIds.size),
    groups: pct(groupCovered, groupIds.size),
    categories: pct(categoryCovered, categoryIds.size),
    overall: pct(leafCovered + groupCovered + categoryCovered, leafIds.size + groupIds.size + categoryIds.size),
  };

  state.leafCertified = errors.length === 0 ? leafIds.size : leafCovered;
  state.groupsCertified = errors.length === 0 ? groupIds.size : groupCovered;
  state.categoriesCertified = errors.length === 0 ? categoryIds.size : categoryCovered;

  return { errors, warnings };
}

function certifyViewModelCoverage(projections, pages, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 7;

  const leafProjectionIds = new Set(projections.leaf.projections.map((p) => p.identity.id));
  const groupProjectionIds = new Set(projections.group.projections.map((p) => p.identity.id));
  const categoryProjectionIds = new Set(projections.category.projections.map((p) => p.identity.id));

  const allPages = [
    ...pages.leaf.pages.map((p) => ({ ...p, kind: "leaf" })),
    ...pages.group.pages.map((p) => ({ ...p, kind: "group" })),
    ...pages.category.pages.map((p) => ({ ...p, kind: "category" })),
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
      page.kind === "leaf"
        ? leafProjectionIds
        : page.kind === "group"
          ? groupProjectionIds
          : categoryProjectionIds;

    if (!projectionSet.has(page.projection_id)) {
      errors.push(`Page references missing projection: ${page.projection_id}`);
    }
  }

  for (const id of leafProjectionIds) {
    if (!pages.leaf.pages.some((p) => p.projection_id === id)) {
      errors.push(`Orphan leaf projection without page: ${id}`);
    }
  }
  for (const id of groupProjectionIds) {
    if (!pages.group.pages.some((p) => p.projection_id === id)) {
      errors.push(`Orphan group projection without page: ${id}`);
    }
  }
  for (const id of categoryProjectionIds) {
    if (!pages.category.pages.some((p) => p.projection_id === id)) {
      errors.push(`Orphan category projection without page: ${id}`);
    }
  }

  const expected = allPages.length;
  const matched = allPages.filter((page) => {
    const set =
      page.kind === "leaf"
        ? leafProjectionIds
        : page.kind === "group"
          ? groupProjectionIds
          : categoryProjectionIds;
    return set.has(page.projection_id);
  }).length;

  state.coverage.viewmodels = {
    leaf: pct(pages.leaf.pages.length, projections.leaf.projections.length),
    groups: pct(pages.group.pages.length, projections.group.projections.length),
    categories: pct(pages.category.pages.length, projections.category.projections.length),
    overall: pct(matched, expected),
  };

  return { errors, warnings };
}

function certifySchemaCoverage(pages, schema, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 6;

  const pageByPath = new Map();
  for (const page of [...pages.leaf.pages, ...pages.group.pages, ...pages.category.pages]) {
    pageByPath.set(page.canonical_path, page);
  }

  const allSchemas = [...schema.leaf.schemas, ...schema.group.schemas, ...schema.category.schemas];

  const schemaPaths = new Set();
  const atIds = new Set();

  if (schema.leaf.schemas.length !== pages.leaf.pages.length) {
    errors.push("Leaf schema count does not match leaf pages");
  }
  if (schema.group.schemas.length !== pages.group.pages.length) {
    errors.push("Group schema count does not match group pages");
  }
  if (schema.category.schemas.length !== pages.category.pages.length) {
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

  const matched = [...pageByPath.keys()].filter((entryPath) => schemaPaths.has(entryPath)).length;
  state.coverage.json_ld = {
    leaf: pct(schema.leaf.schemas.length, pages.leaf.pages.length),
    groups: pct(schema.group.schemas.length, pages.group.pages.length),
    categories: pct(schema.category.schemas.length, pages.category.pages.length),
    overall: pct(matched, pageByPath.size),
  };

  return { errors, warnings };
}

function certifyNavigationCoverage(domain, pages, navigation, registry, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 7;

  const allLinkSets = [
    ...navigation.leaf.link_sets,
    ...navigation.group.link_sets,
    ...navigation.category.link_sets,
  ];

  const pageByPath = new Map();
  for (const page of [...pages.leaf.pages, ...pages.group.pages, ...pages.category.pages]) {
    pageByPath.set(page.canonical_path, page);
  }

  if (navigation.leaf.link_sets.length !== pages.leaf.pages.length) {
    errors.push("Leaf navigation link set count mismatch");
  }
  if (navigation.group.link_sets.length !== pages.group.pages.length) {
    errors.push("Group navigation link set count mismatch");
  }
  if (navigation.category.link_sets.length !== pages.category.pages.length) {
    errors.push("Category navigation link set count mismatch");
  }

  const prepPrefix = domain.editorial.preparationPrefix;

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

      if (link.id && !(prepPrefix && link.id.startsWith(prepPrefix))) {
        const known =
          registry.leafIds.has(link.id) ||
          registry.groupIds.has(link.id) ||
          registry.categoryIds.has(link.id);
        const externalWineRef =
          link.href?.startsWith("/styles/") ||
          link.href?.startsWith("/techniques/") ||
          link.href?.startsWith("/terms/");
        const crossDomainRef = link.id.startsWith("food.") || link.href?.startsWith("food.");
        if (!known && !externalWineRef && !crossDomainRef) {
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

  const matched = [...pageByPath.keys()].filter((entryPath) =>
    allLinkSets.some((set) => set.canonical_path === entryPath)
  ).length;

  state.coverage.navigation = {
    leaf: pct(navigation.leaf.link_sets.length, pages.leaf.pages.length),
    groups: pct(navigation.group.link_sets.length, pages.group.pages.length),
    categories: pct(navigation.category.link_sets.length, pages.category.pages.length),
    overall: pct(matched, pageByPath.size),
  };

  return { errors, warnings };
}

function certifySearchCoverage(pages, search, registry, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 7;

  const pageByPath = new Map();
  for (const page of [...pages.leaf.pages, ...pages.group.pages, ...pages.category.pages]) {
    pageByPath.set(page.canonical_path, page);
  }

  const allDocs = [...search.leaf.documents, ...search.group.documents, ...search.category.documents];

  const docIds = new Set();
  const docPaths = new Set();
  const suggestionKeys = new Set();

  if (search.leaf.documents.length !== pages.leaf.pages.length) {
    errors.push("Leaf search document count mismatch");
  }
  if (search.group.documents.length !== pages.group.pages.length) {
    errors.push("Group search document count mismatch");
  }
  if (search.category.documents.length !== pages.category.pages.length) {
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
    (entryPath) =>
      docPaths.has(entryPath) && search.suggestions.suggestions.some((s) => s.href === entryPath)
  ).length;

  state.coverage.search = {
    leaf: pct(search.leaf.documents.length, pages.leaf.pages.length),
    groups: pct(search.group.documents.length, pages.group.pages.length),
    categories: pct(search.category.documents.length, pages.category.pages.length),
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

function certifyRelationshipCoverage(domain, catalog, projections, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 6;

  const symmetric = new Set(domain.editorial.symmetric);
  const leafIds = new Set(catalog[domain.catalogKeys.leaf].map((entry) => entry.id));
  const groupIds = new Set(catalog[domain.catalogKeys.groups].map((entry) => entry.id));
  const categoryIds = new Set(catalog[domain.catalogKeys.categories].map((entry) => entry.id));
  const allOntologyIds = new Set([...leafIds, ...groupIds, ...categoryIds]);

  const structural = readJson(domain.publicationArtifacts.relationships[0]);
  const editorial = readJson(domain.publicationArtifacts.relationships[1]);
  const pairing = readJson(domain.publicationArtifacts.relationships[2]);

  const edgeRegistry = new Map();
  for (const layer of [structural, editorial, pairing]) {
    for (const edge of layer.edges) {
      edgeRegistry.set(canonicalEdgeKey(edge.source, edge.relationship, edge.target, symmetric), edge);
    }
  }

  for (const edge of structural.edges) {
    if (!allOntologyIds.has(edge.source)) {
      errors.push(`Structural edge missing source entity: ${edge.source}`);
    }
    if (!allOntologyIds.has(edge.target) && edge.relationship !== "category_contains") {
      if (!leafIds.has(edge.target) && !groupIds.has(edge.target)) {
        errors.push(`Structural edge missing target entity: ${edge.target}`);
      }
    }
    if (edge.relationship === "category_contains" && !groupIds.has(edge.target)) {
      errors.push(`Structural category_contains invalid group: ${edge.target}`);
    }
    if (edge.relationship === "group_contains" && !leafIds.has(edge.target)) {
      errors.push(`Structural group_contains invalid leaf: ${edge.target}`);
    }
  }

  const prepPrefix = domain.editorial.preparationPrefix;

  for (const edge of editorial.edges) {
    if (!leafIds.has(edge.source)) {
      errors.push(`Editorial edge missing source leaf: ${edge.source}`);
    }
    if (prepPrefix && edge.target.startsWith(prepPrefix)) continue;
    if (!leafIds.has(edge.target) && !domain.editorial.crossDomainTargets.includes(edge.relationship)) {
      errors.push(`Editorial edge missing target leaf: ${edge.target}`);
    }
  }

  for (const edge of pairing.edges) {
    if (!leafIds.has(edge.source)) {
      errors.push(`Pairing edge missing source leaf: ${edge.source}`);
    }
    if (!pairingTargetResolvable(edge.target, edge.relationship)) {
      errors.push(`Pairing edge invalid target slug: ${edge.target}`);
    }
  }

  for (const projection of projections.leaf.projections) {
    const refs = [
      ...Object.values(projection.editorial_context ?? {}).flat(),
      ...Object.values(projection.wine_context ?? {}).flat(),
    ];
    for (const ref of refs) {
      const key = canonicalEdgeKey(projection.identity.id, ref.relationship, ref.target, symmetric);
      if (!edgeRegistry.has(key)) {
        errors.push(`Projection missing relationship edge: ${key}`);
      }
    }
  }

  const consumedEdges = projections.leaf.projections.reduce((sum, projection) => {
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

function certifyCrossLayerConsistency(domain, catalog, artifacts, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 5;

  const { projections, pages, schema, navigation, search } = artifacts;
  const registry = buildHrefRegistry(domain, pages);

  const entities = [
    ...catalog[domain.catalogKeys.leaf].map((entry) => ({ id: entry.id, kind: "leaf" })),
    ...catalog[domain.catalogKeys.groups].map((entry) => ({ id: entry.id, kind: "group" })),
    ...catalog[domain.catalogKeys.categories].map((entry) => ({ id: entry.id, kind: "category" })),
  ];

  const projectionById = new Map([
    ...projections.leaf.projections.map((p) => [p.identity.id, p]),
    ...projections.group.projections.map((p) => [p.identity.id, p]),
    ...projections.category.projections.map((p) => [p.identity.id, p]),
  ]);

  const pageByProjection = new Map();
  for (const page of [...pages.leaf.pages, ...pages.group.pages, ...pages.category.pages]) {
    pageByProjection.set(page.projection_id, page);
  }

  const schemaByPath = new Map(
    [...schema.leaf.schemas, ...schema.group.schemas, ...schema.category.schemas].map((s) => [
      s.canonical_path,
      s,
    ])
  );

  const navByPath = new Map(
    [
      ...navigation.leaf.link_sets,
      ...navigation.group.link_sets,
      ...navigation.category.link_sets,
    ].map((n) => [n.canonical_path, n])
  );

  const searchByPath = new Map(
    [...search.leaf.documents, ...search.group.documents, ...search.category.documents].map(
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

function certifyDeterminism(domain, state) {
  const errors = [];
  const warnings = [];
  state.rulesExecuted += 5;

  const projectionInputs = loadDomainInputs(domain);
  const projectionsGenerated = generateProjections(domain, projectionInputs);
  const projectionsPackaged = packageProjections(domain, projectionsGenerated);

  const pagesGenerated = generatePageModels(domain, projectionsPackaged);
  const pagesPackaged = packagePages(domain, pagesGenerated);

  const schemaGenerated = generateSchema(domain, {
    leafPages: pagesPackaged.leaf,
    groupPages: pagesPackaged.group,
    categoryPages: pagesPackaged.category,
  });
  const schemaPackaged = packageSchema(domain, schemaGenerated);

  const linksGenerated = generateLinks(domain, loadLinkInputs(domain, pagesPackaged, projectionsPackaged));
  const linksPackaged = packageLinks(domain, linksGenerated);

  const searchGenerated = generateSearchIndex(
    domain,
    loadSearchInputs(domain, pagesPackaged, linksPackaged, schemaPackaged)
  );
  const searchPackaged = packageSearch(domain, searchGenerated);

  const checks = [
    ["projections.leaf", domain.paths.projections.leaf, projectionsPackaged.leaf],
    ["projections.group", domain.paths.projections.group, projectionsPackaged.group],
    ["projections.category", domain.paths.projections.category, projectionsPackaged.category],
    ["pages.leaf", domain.paths.pages.leaf, pagesPackaged.leaf],
    ["pages.group", domain.paths.pages.group, pagesPackaged.group],
    ["pages.category", domain.paths.pages.category, pagesPackaged.category],
    ["schema.leaf", domain.paths.schema.leaf, schemaPackaged.leaf],
    ["schema.group", domain.paths.schema.group, schemaPackaged.group],
    ["schema.category", domain.paths.schema.category, schemaPackaged.category],
    ["navigation.leaf", domain.paths.navigation.leaf, linksPackaged.leaf],
    ["navigation.group", domain.paths.navigation.group, linksPackaged.group],
    ["navigation.category", domain.paths.navigation.category, linksPackaged.category],
    ["search.leaf", domain.paths.search.leaf, searchPackaged.leaf],
    ["search.group", domain.paths.search.group, searchPackaged.group],
    ["search.category", domain.paths.search.category, searchPackaged.category],
    ["search.suggestions", domain.paths.search.suggestions, searchPackaged.suggestions],
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

function certifyUpstreamReports(domain, state) {
  const warnings = [];
  state.rulesExecuted += 1;

  const upstream = {
    projections: domain.paths.reports.generator,
    pages: domain.paths.reports.pages,
    schema: domain.paths.reports.schema,
    navigation: domain.paths.reports.links,
    search: domain.paths.reports.search,
  };

  for (const [name, reportPath] of Object.entries(upstream)) {
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

function writeReports(domain, state, errors, warnings, overall, overallCompleteness = 0) {
  const phase = certificationPhase(domain);
  const certificationReport = {
    phase,
    domain: domain.id,
    release_gate: true,
    overall_certification: overall,
    metrics: {
      [`${domain.entityLabels.leafPlural} certified`]: state.leafCertified,
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
      relative(domain.root, domain.paths.reports.publication),
      relative(domain.root, domain.paths.reports.coverage),
    ],
  };

  const coverageReport = {
    phase,
    domain: domain.id,
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

  writeJson(domain.paths.reports.publication, certificationReport);
  writeJson(domain.paths.reports.coverage, coverageReport);
}

export function runCertifyPublicationStage(domainOrId) {
  const domain = resolveDomain(domainOrId);
  const errors = [];
  const warnings = [];

  const state = {
    rulesExecuted: 0,
    leafCertified: 0,
    groupsCertified: 0,
    categoriesCertified: 0,
    coverage: {},
  };

  const artifactPaths = [
    domain.paths.catalog,
    domain.paths.projections.leaf,
    domain.paths.projections.group,
    domain.paths.projections.category,
    domain.paths.pages.leaf,
    domain.paths.pages.group,
    domain.paths.pages.category,
    domain.paths.schema.leaf,
    domain.paths.schema.group,
    domain.paths.schema.category,
    domain.paths.navigation.leaf,
    domain.paths.navigation.group,
    domain.paths.navigation.category,
    domain.paths.search.leaf,
    domain.paths.search.group,
    domain.paths.search.category,
    domain.paths.search.suggestions,
  ];

  for (const file of artifactPaths) {
    assertFileExists(file, errors, domain, "publication artifact");
  }

  if (errors.length > 0) {
    writeReports(domain, state, errors, warnings, "FAIL");
    console.error(errors.join("\n"));
    process.exit(1);
  }

  const catalog = loadCatalog(domain);
  const projections = loadProjections(domain);
  const pages = loadPages(domain);
  const schema = loadSchema(domain);
  const navigation = loadNavigation(domain);
  const search = loadSearch(domain);
  const registry = buildHrefRegistry(domain, pages);

  for (const result of [
    certifyProjectionCoverage(domain, catalog, projections, state),
    certifyViewModelCoverage(projections, pages, state),
    certifySchemaCoverage(pages, schema, state),
    certifyNavigationCoverage(domain, pages, navigation, registry, state),
    certifySearchCoverage(pages, search, registry, state),
    certifyRelationshipCoverage(domain, catalog, projections, state),
    certifyCrossLayerConsistency(domain, catalog, { projections, pages, schema, navigation, search }, state),
    certifyDeterminism(domain, state),
    certifyUpstreamReports(domain, state),
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
  writeReports(domain, state, errors, warnings, overall, overallCompleteness);

  const summary = {
    phase: certificationPhase(domain),
    domain: domain.id,
    overall_certification: overall,
    leaf_certified: state.leafCertified,
    groups_certified: state.groupsCertified,
    categories_certified: state.categoriesCertified,
    validation_rules_executed: state.rulesExecuted,
    errors: errors.length,
    warnings: warnings.length,
    publication_completeness_percent: overallCompleteness,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (overall === "FAIL") {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  return summary;
}
