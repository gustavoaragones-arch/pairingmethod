import { serializeRuntime } from "../../scripts/bootstrap-protein-food-catalog.js";
import { getDomainConfig } from "../food-domain-config.js";
import {
  dedupeLinks as dedupeNavigationLinks,
  isResolvableHref,
  makeLink as makeNavigationLink,
  preparationTitle,
  sortLinks as sortNavigationLinks,
} from "../protein-food-navigation.js";
import { termUrl, wineStyleUrl, winemakingTechniqueUrl } from "../public-url.js";
import { readJson, relative, writeJson } from "./utils.js";

function indexEdges(edges) {
  const bySource = new Map();
  const byTarget = new Map();
  for (const edge of edges) {
    if (!bySource.has(edge.source)) bySource.set(edge.source, []);
    bySource.get(edge.source).push(edge);
    if (!byTarget.has(edge.target)) byTarget.set(edge.target, []);
    byTarget.get(edge.target).push(edge);
  }
  return { bySource, byTarget };
}

function wineLinkSectionKey(bucket) {
  if (bucket === "descriptors") return "wine_descriptors";
  if (bucket === "techniques") return "wine_techniques";
  return bucket;
}

function buildWineRelationshipSections(domain) {
  const map = new Map();
  for (const [relationship, bucket] of Object.entries(domain.wine.byRelationship)) {
    map.set(relationship, wineLinkSectionKey(bucket));
  }
  return map;
}

function memberGroupSectionKey(domain) {
  return Object.keys(domain.linkSections.group).find((key) => key.startsWith("member_")) ?? "member_foods";
}

function crossDomainTitle(targetId) {
  const segment = targetId.split(".").pop() ?? targetId;
  return segment.replace(/-/g, " ");
}

function buildRegistry(inputs) {
  const leafById = new Map();
  const groupById = new Map();
  const categoryById = new Map();
  const validHrefs = new Set();

  for (const page of inputs.leafPages.pages) {
    leafById.set(page.identity.id, page);
    validHrefs.add(page.canonical_path);
  }
  for (const page of inputs.groupPages.pages) {
    groupById.set(page.identity.id, page);
    validHrefs.add(page.canonical_path);
  }
  for (const page of inputs.categoryPages.pages) {
    categoryById.set(page.identity.id, page);
    validHrefs.add(page.canonical_path);
  }

  const groupsByCategory = new Map();
  for (const page of inputs.groupPages.pages) {
    const catId = page.overview?.parent_category?.id;
    if (!catId) continue;
    if (!groupsByCategory.has(catId)) groupsByCategory.set(catId, []);
    groupsByCategory.get(catId).push(page);
  }

  return { leafById, groupById, categoryById, validHrefs, groupsByCategory };
}

function leafLinkFromId(leafId, registry, relationship) {
  const page = registry.leafById.get(leafId);
  if (!page) return null;
  return makeNavigationLink({
    id: page.identity.id,
    title: page.identity.title,
    href: page.canonical_path,
    relationship,
  });
}

function groupLinkFromId(groupId, registry, relationship) {
  const page = registry.groupById.get(groupId);
  if (!page) return null;
  return makeNavigationLink({
    id: page.identity.id,
    title: page.identity.title,
    href: page.canonical_path,
    relationship,
  });
}

function categoryLinkFromId(categoryId, registry, relationship) {
  const page = registry.categoryById.get(categoryId);
  if (!page) return null;
  return makeNavigationLink({
    id: page.identity.id,
    title: page.identity.title,
    href: page.canonical_path,
    relationship,
  });
}

function finalizeSection(links, pagePath, allowSelf = false) {
  const filtered = links.filter((link) => allowSelf || link.href !== pagePath);
  return sortNavigationLinks(dedupeNavigationLinks(filtered));
}

function emptyLeafSections(domain) {
  return Object.fromEntries(Object.keys(domain.linkSections.leaf).map((key) => [key, []]));
}

function editorialLinkFromEdge(edge, registry, domain) {
  const crossDomain = new Set(domain.editorial.crossDomainTargets);
  if (crossDomain.has(edge.relationship)) {
    return makeNavigationLink({
      id: edge.target,
      title: crossDomainTitle(edge.target),
      href: edge.target,
      relationship: edge.relationship,
    });
  }

  if (edge.relationship === "commonly_prepared_as" && domain.editorial.preparationPrefix) {
    return makeNavigationLink({
      id: edge.target,
      title: preparationTitle(edge.target),
      href: edge.target,
      relationship: edge.relationship,
    });
  }

  if (domain.editorial.intraDomainRelationships.includes(edge.relationship)) {
    return leafLinkFromId(edge.target, registry, edge.relationship);
  }

  return null;
}

function wineLinkFromEdge(edge, wineRelationshipSections) {
  const sectionKey = wineRelationshipSections.get(edge.relationship);
  if (!sectionKey) return null;

  if (edge.relationship === "pairs_with_style" || edge.relationship === "also_pairs_with_style") {
    return {
      sectionKey,
      link: makeNavigationLink({
        id: edge.target,
        title: edge.target.replace(/-/g, " "),
        href: wineStyleUrl(edge.target),
        relationship: edge.relationship,
      }),
    };
  }

  if (edge.relationship === "pairs_with_descriptor") {
    return {
      sectionKey,
      link: makeNavigationLink({
        id: edge.target,
        title: edge.target.replace(/-/g, " "),
        href: termUrl(edge.target),
        relationship: edge.relationship,
      }),
    };
  }

  if (edge.relationship === "pairs_with_technique") {
    return {
      sectionKey,
      link: makeNavigationLink({
        id: edge.target,
        title: edge.target.replace(/-/g, " "),
        href: winemakingTechniqueUrl(edge.target),
        relationship: edge.relationship,
      }),
    };
  }

  return null;
}

function buildLeafLinkSet(page, registry, structuralIdx, editorialIdx, pairingIdx, domain) {
  const leafId = page.identity.id;
  const canonicalPath = page.canonical_path;
  const symmetric = new Set(domain.editorial.symmetric);
  const editorialSections = domain.editorial.byRelationship;
  const wineRelationshipSections = buildWineRelationshipSections(domain);

  const parentNavigation = {
    category: null,
    group: null,
  };

  for (const edge of structuralIdx.bySource.get(leafId) ?? []) {
    if (edge.relationship === "belongs_to_category") {
      parentNavigation.category = categoryLinkFromId(edge.target, registry, edge.relationship);
    }
    if (edge.relationship === "belongs_to_group") {
      parentNavigation.group = groupLinkFromId(edge.target, registry, edge.relationship);
    }
  }

  const sections = emptyLeafSections(domain);

  for (const edge of editorialIdx.bySource.get(leafId) ?? []) {
    const sectionKey = editorialSections[edge.relationship];
    if (!sectionKey) continue;
    const link = editorialLinkFromEdge(edge, registry, domain);
    if (link) sections[sectionKey].push(link);
  }

  for (const relationship of symmetric) {
    const sectionKey = editorialSections[relationship];
    if (!sectionKey) continue;
    for (const edge of editorialIdx.byTarget.get(leafId) ?? []) {
      if (edge.relationship !== relationship) continue;
      const link = leafLinkFromId(edge.source, registry, edge.relationship);
      if (link) sections[sectionKey].push(link);
    }
  }

  for (const edge of pairingIdx.bySource.get(leafId) ?? []) {
    const resolved = wineLinkFromEdge(edge, wineRelationshipSections);
    if (resolved) sections[resolved.sectionKey].push(resolved.link);
  }

  for (const key of Object.keys(sections)) {
    sections[key] = finalizeSection(sections[key], canonicalPath);
  }

  return {
    slug: page.slug,
    canonical_path: canonicalPath,
    projection_id: page.projection_id,
    sections: {
      parent_navigation: parentNavigation,
      ...sections,
    },
  };
}

function buildGroupLinkSet(page, registry, structuralIdx, domain) {
  const groupId = page.identity.id;
  const canonicalPath = page.canonical_path;
  const memberSectionKey = memberGroupSectionKey(domain);

  let parentCategory = null;
  const memberLeaves = [];
  const relatedGroups = [];

  for (const edge of structuralIdx.bySource.get(groupId) ?? []) {
    if (edge.relationship === "belongs_to_category") {
      parentCategory = categoryLinkFromId(edge.target, registry, edge.relationship);
    }
    if (edge.relationship === "group_contains") {
      const link = leafLinkFromId(edge.target, registry, edge.relationship);
      if (link) memberLeaves.push(link);
    }
  }

  const categoryId = page.overview?.parent_category?.id;
  if (categoryId) {
    for (const sibling of registry.groupsByCategory.get(categoryId) ?? []) {
      if (sibling.identity.id === groupId) continue;
      relatedGroups.push(
        makeNavigationLink({
          id: sibling.identity.id,
          title: sibling.identity.title,
          href: sibling.canonical_path,
          relationship: "shares_category",
        })
      );
    }
  }

  return {
    slug: page.slug,
    canonical_path: canonicalPath,
    projection_id: page.projection_id,
    sections: {
      parent_category: parentCategory,
      [memberSectionKey]: finalizeSection(memberLeaves, canonicalPath),
      related_groups: finalizeSection(relatedGroups, canonicalPath),
    },
  };
}

function buildCategoryLinkSet(page, registry, structuralIdx) {
  const categoryId = page.identity.id;
  const canonicalPath = page.canonical_path;
  const groups = [];

  for (const edge of structuralIdx.bySource.get(categoryId) ?? []) {
    if (edge.relationship === "category_contains") {
      const link = groupLinkFromId(edge.target, registry, edge.relationship);
      if (link) groups.push(link);
    }
  }

  return {
    slug: page.slug,
    canonical_path: canonicalPath,
    projection_id: page.projection_id,
    sections: {
      groups: finalizeSection(groups, canonicalPath),
      member_food_summary: {
        food_count: page.overview.food_count,
        group_count: page.overview.group_count,
      },
      related_categories: [],
    },
  };
}

export function generateLinks(domain, inputs) {
  const registry = buildRegistry(inputs);
  const structuralIdx = indexEdges(inputs.structural.edges);
  const editorialIdx = indexEdges(inputs.editorial.edges);
  const pairingIdx = indexEdges(inputs.pairing.edges);

  const leafLinkSets = inputs.leafPages.pages
    .map((page) =>
      buildLeafLinkSet(page, registry, structuralIdx, editorialIdx, pairingIdx, domain)
    )
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const groupLinkSets = inputs.groupPages.pages
    .map((page) => buildGroupLinkSet(page, registry, structuralIdx, domain))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const categoryLinkSets = inputs.categoryPages.pages
    .map((page) => buildCategoryLinkSet(page, registry, structuralIdx))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    meta: {
      phase: `${domain.phasePrefix}D`,
      domain: domain.id,
      catalog_version: inputs.leafPages.meta.catalog_version,
      food_ontology_version: inputs.leafPages.meta.food_ontology_version,
    },
    leafLinkSets,
    groupLinkSets,
    categoryLinkSets,
    registry,
    inputs,
  };
}

export function generateProteinFoodLinks(inputs) {
  const domain = getDomainConfig("protein");
  const normalized = {
    leafPages: inputs.foodPages,
    groupPages: inputs.groupPages,
    categoryPages: inputs.categoryPages,
    structural: inputs.structural,
    editorial: inputs.editorial,
    pairing: inputs.pairing,
  };
  const generated = generateLinks(domain, normalized);

  return {
    meta: {
      phase: generated.meta.phase,
      catalog_version: generated.meta.catalog_version,
      food_ontology_version: generated.meta.food_ontology_version,
    },
    foodLinkSets: generated.leafLinkSets,
    groupLinkSets: generated.groupLinkSets,
    categoryLinkSets: generated.categoryLinkSets,
    registry: generated.registry,
    inputs,
  };
}

function isLinkResolvable(link, registry, crossDomainRelationships) {
  if (crossDomainRelationships.has(link.relationship)) return true;
  return isResolvableHref(link.href, registry);
}

function validateLinkGraph(domain, generated) {
  const errors = [];
  let brokenLinks = 0;
  let duplicateLinks = 0;
  let totalLinks = 0;
  const crossDomainRelationships = new Set(domain.editorial.crossDomainTargets);

  const allSets = [
    ...generated.leafLinkSets,
    ...generated.groupLinkSets,
    ...generated.categoryLinkSets,
  ];

  for (const linkSet of allSets) {
    const sectionKeys = Object.keys(linkSet.sections).sort();
    const seenInSet = new Set();

    for (const key of sectionKeys) {
      const section = linkSet.sections[key];
      const sectionLinks = Array.isArray(section)
        ? section
        : section && typeof section === "object"
          ? Object.values(section).filter((v) => v && typeof v === "object" && "href" in v)
          : [];

      for (const link of sectionLinks) {
        totalLinks += 1;
        const dedupeKey = `${linkSet.canonical_path}\t${key}\t${link.relationship}\t${link.href}\t${link.id}`;
        if (seenInSet.has(dedupeKey)) {
          duplicateLinks += 1;
          errors.push(`Duplicate link in ${linkSet.slug}/${key}: ${link.href}`);
        }
        seenInSet.add(dedupeKey);

        if (!isLinkResolvable(link, generated.registry, crossDomainRelationships)) {
          brokenLinks += 1;
          errors.push(`Broken link in ${linkSet.slug}/${key}: ${link.href}`);
        }

        if (link.source !== "ontology") {
          errors.push(`${linkSet.slug}: invalid link source ${link.source}`);
        }
      }
    }

    const page =
      generated.inputs.leafPages.pages.find((p) => p.canonical_path === linkSet.canonical_path) ??
      generated.inputs.groupPages.pages.find((p) => p.canonical_path === linkSet.canonical_path) ??
      generated.inputs.categoryPages.pages.find((p) => p.canonical_path === linkSet.canonical_path);

    if (!page) {
      errors.push(`Orphan link set: ${linkSet.slug}`);
    }
  }

  if (generated.leafLinkSets.length !== generated.inputs.leafPages.pages.length) {
    errors.push("Leaf link set count mismatch");
  }
  if (generated.groupLinkSets.length !== generated.inputs.groupPages.pages.length) {
    errors.push("Group link set count mismatch");
  }
  if (generated.categoryLinkSets.length !== generated.inputs.categoryPages.pages.length) {
    errors.push("Category link set count mismatch");
  }

  return { errors, brokenLinks, duplicateLinks, totalLinks };
}

function packageOutput(domain, generated) {
  return {
    leaf: {
      meta: {
        ...generated.meta,
        link_set_type: domain.pageTypes.leaf,
        link_set_count: generated.leafLinkSets.length,
      },
      link_sets: generated.leafLinkSets,
    },
    group: {
      meta: {
        ...generated.meta,
        link_set_type: domain.pageTypes.group,
        link_set_count: generated.groupLinkSets.length,
      },
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

function loadLinkInputs(domain) {
  return {
    leafPages: readJson(domain.paths.pages.leaf),
    groupPages: readJson(domain.paths.pages.group),
    categoryPages: readJson(domain.paths.pages.category),
    structural: readJson(domain.publicationArtifacts.relationships[0]),
    editorial: readJson(domain.publicationArtifacts.relationships[1]),
    pairing: readJson(domain.publicationArtifacts.relationships[2]),
  };
}

export function runLinksStage(domain) {
  const inputs = loadLinkInputs(domain);
  const generated = generateLinks(domain, inputs);
  const packaged = packageOutput(domain, generated);
  const validation = validateLinkGraph(domain, generated);

  const determinismPass =
    serializeRuntime(packaged.leaf) ===
    serializeRuntime(packageOutput(domain, generateLinks(domain, inputs)).leaf);

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  const report = {
    phase: `${domain.phasePrefix}D`,
    domain: domain.id,
    overall_result: overall,
    validation_errors: overall === "PASS" ? [] : validation.errors,
    outputs:
      overall === "PASS"
        ? [
            domain.paths.navigation.leaf,
            domain.paths.navigation.group,
            domain.paths.navigation.category,
          ].map((p) => relative(domain.root, p))
        : undefined,
    metrics: {
      "Leaf link sets": generated.leafLinkSets.length,
      "Group link sets": generated.groupLinkSets.length,
      "Category link sets": generated.categoryLinkSets.length,
      "Total internal links": validation.totalLinks,
      "Broken links": overall === "PASS" ? 0 : validation.brokenLinks,
      "Duplicate links": overall === "PASS" ? 0 : validation.duplicateLinks,
      "Validation errors": overall === "PASS" ? 0 : validation.errors.length,
      "Deterministic regeneration": determinismPass ? "PASS" : "FAIL",
      "Overall result": overall,
    },
  };

  if (overall === "FAIL") {
    writeJson(domain.paths.reports.links, report);
    console.error(validation.errors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(domain.paths.navigation.leaf, packaged.leaf);
  writeJson(domain.paths.navigation.group, packaged.group);
  writeJson(domain.paths.navigation.category, packaged.category);
  writeJson(domain.paths.reports.links, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${domain.paths.reports.links}`);
  return report;
}
