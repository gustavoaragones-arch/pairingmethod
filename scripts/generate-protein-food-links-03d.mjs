#!/usr/bin/env node
/**
 * ONTOLOGY-03D — Internal linking graph for protein food ontology.
 * Navigation projection only: never invents relationships.
 *
 * Run: node scripts/generate-protein-food-links-03d.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import {
  dedupeLinks,
  isResolvableHref,
  makeLink,
  preparationTitle,
  sortLinks,
} from "../lib/protein-food-navigation.js";
import { termUrl, wineStyleUrl, winemakingTechniqueUrl } from "../lib/public-url.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const PATHS = {
  pages: {
    foods: path.join(ROOT, "data/pages/protein-food-pages.json"),
    groups: path.join(ROOT, "data/pages/protein-group-pages.json"),
    categories: path.join(ROOT, "data/pages/protein-category-pages.json"),
  },
  projections: path.join(ROOT, "data/generated/protein-food-pages.json"),
  relationships: {
    structural: path.join(ROOT, "data/runtime/protein-food-relationships.json"),
    editorial: path.join(ROOT, "data/runtime/protein-food-editorial-relationships.json"),
    pairing: path.join(ROOT, "data/runtime/protein-food-wine-relationships.json"),
  },
  outputs: {
    foods: path.join(ROOT, "data/navigation/protein-food-links.json"),
    groups: path.join(ROOT, "data/navigation/protein-group-links.json"),
    categories: path.join(ROOT, "data/navigation/protein-category-links.json"),
  },
  report: path.join(ROOT, "reports/internal-link-report.json"),
};

const SYMMETRIC_EDITORIAL = new Set(["similar_to", "shares_culinary_role"]);

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
    projections: JSON.parse(fs.readFileSync(PATHS.projections, "utf8")),
    structural: JSON.parse(fs.readFileSync(PATHS.relationships.structural, "utf8")),
    editorial: JSON.parse(fs.readFileSync(PATHS.relationships.editorial, "utf8")),
    pairing: JSON.parse(fs.readFileSync(PATHS.relationships.pairing, "utf8")),
  };
}

function buildRegistry(inputs) {
  const foodById = new Map();
  const groupById = new Map();
  const categoryById = new Map();
  const validHrefs = new Set();

  for (const page of inputs.foodPages.pages) {
    foodById.set(page.identity.id, page);
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
    const catId = page.overview.parent_category?.id;
    if (!catId) continue;
    if (!groupsByCategory.has(catId)) groupsByCategory.set(catId, []);
    groupsByCategory.get(catId).push(page);
  }

  return { foodById, groupById, categoryById, validHrefs, groupsByCategory };
}

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

function foodLinkFromId(foodId, registry, relationship) {
  const page = registry.foodById.get(foodId);
  if (!page) return null;
  return makeLink({
    id: page.identity.id,
    title: page.identity.title,
    href: page.canonical_path,
    relationship,
  });
}

function groupLinkFromId(groupId, registry, relationship) {
  const page = registry.groupById.get(groupId);
  if (!page) return null;
  return makeLink({
    id: page.identity.id,
    title: page.identity.title,
    href: page.canonical_path,
    relationship,
  });
}

function categoryLinkFromId(categoryId, registry, relationship) {
  const page = registry.categoryById.get(categoryId);
  if (!page) return null;
  return makeLink({
    id: page.identity.id,
    title: page.identity.title,
    href: page.canonical_path,
    relationship,
  });
}

function finalizeSection(links, pagePath, allowSelf = false) {
  const filtered = links.filter((link) => allowSelf || link.href !== pagePath);
  return sortLinks(dedupeLinks(filtered));
}

function buildFoodLinkSet(page, registry, structuralIdx, editorialIdx, pairingIdx) {
  const foodId = page.identity.id;
  const canonicalPath = page.canonical_path;

  const parentNavigation = {
    category: null,
    group: null,
  };

  for (const edge of structuralIdx.bySource.get(foodId) ?? []) {
    if (edge.relationship === "belongs_to_category") {
      parentNavigation.category = categoryLinkFromId(edge.target, registry, edge.relationship);
    }
    if (edge.relationship === "belongs_to_group") {
      parentNavigation.group = groupLinkFromId(edge.target, registry, edge.relationship);
    }
  }

  const similarFoods = [];
  const substitutions = [];
  const culinaryRole = [];
  const commonPreparations = [];

  for (const edge of editorialIdx.bySource.get(foodId) ?? []) {
    if (edge.relationship === "similar_to") {
      const link = foodLinkFromId(edge.target, registry, edge.relationship);
      if (link) similarFoods.push(link);
    }
    if (edge.relationship === "substitutes_for") {
      const link = foodLinkFromId(edge.target, registry, edge.relationship);
      if (link) substitutions.push(link);
    }
    if (edge.relationship === "shares_culinary_role") {
      const link = foodLinkFromId(edge.target, registry, edge.relationship);
      if (link) culinaryRole.push(link);
    }
    if (edge.relationship === "commonly_prepared_as") {
      commonPreparations.push(
        makeLink({
          id: edge.target,
          title: preparationTitle(edge.target),
          href: edge.target,
          relationship: edge.relationship,
        })
      );
    }
  }

  if (SYMMETRIC_EDITORIAL.has("similar_to")) {
    for (const edge of editorialIdx.byTarget.get(foodId) ?? []) {
      if (edge.relationship === "similar_to") {
        const link = foodLinkFromId(edge.source, registry, edge.relationship);
        if (link) similarFoods.push(link);
      }
      if (edge.relationship === "shares_culinary_role") {
        const link = foodLinkFromId(edge.source, registry, edge.relationship);
        if (link) culinaryRole.push(link);
      }
    }
  }

  const primaryWineStyles = [];
  const alternativeWineStyles = [];
  const wineDescriptors = [];
  const wineTechniques = [];

  for (const edge of pairingIdx.bySource.get(foodId) ?? []) {
    if (edge.relationship === "pairs_with_style") {
      primaryWineStyles.push(
        makeLink({
          id: edge.target,
          title: edge.target.replace(/-/g, " "),
          href: wineStyleUrl(edge.target),
          relationship: edge.relationship,
        })
      );
    }
    if (edge.relationship === "also_pairs_with_style") {
      alternativeWineStyles.push(
        makeLink({
          id: edge.target,
          title: edge.target.replace(/-/g, " "),
          href: wineStyleUrl(edge.target),
          relationship: edge.relationship,
        })
      );
    }
    if (edge.relationship === "pairs_with_descriptor") {
      wineDescriptors.push(
        makeLink({
          id: edge.target,
          title: edge.target.replace(/-/g, " "),
          href: termUrl(edge.target),
          relationship: edge.relationship,
        })
      );
    }
    if (edge.relationship === "pairs_with_technique") {
      wineTechniques.push(
        makeLink({
          id: edge.target,
          title: edge.target.replace(/-/g, " "),
          href: winemakingTechniqueUrl(edge.target),
          relationship: edge.relationship,
        })
      );
    }
  }

  return {
    slug: page.slug,
    canonical_path: canonicalPath,
    projection_id: page.projection_id,
    sections: {
      parent_navigation: parentNavigation,
      similar_foods: finalizeSection(similarFoods, canonicalPath),
      substitutions: finalizeSection(substitutions, canonicalPath),
      culinary_role: finalizeSection(culinaryRole, canonicalPath),
      common_preparations: finalizeSection(commonPreparations, canonicalPath),
      primary_wine_styles: finalizeSection(primaryWineStyles, canonicalPath),
      alternative_wine_styles: finalizeSection(alternativeWineStyles, canonicalPath),
      wine_descriptors: finalizeSection(wineDescriptors, canonicalPath),
      wine_techniques: finalizeSection(wineTechniques, canonicalPath),
    },
  };
}

function buildGroupLinkSet(page, registry, structuralIdx) {
  const groupId = page.identity.id;
  const canonicalPath = page.canonical_path;

  let parentCategory = null;
  const memberFoods = [];
  const relatedGroups = [];

  for (const edge of structuralIdx.bySource.get(groupId) ?? []) {
    if (edge.relationship === "belongs_to_category") {
      parentCategory = categoryLinkFromId(edge.target, registry, edge.relationship);
    }
    if (edge.relationship === "group_contains") {
      const link = foodLinkFromId(edge.target, registry, edge.relationship);
      if (link) memberFoods.push(link);
    }
  }

  const categoryId = page.overview.parent_category?.id;
  if (categoryId) {
    for (const sibling of registry.groupsByCategory.get(categoryId) ?? []) {
      if (sibling.identity.id === groupId) continue;
      relatedGroups.push(
        makeLink({
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
      member_foods: finalizeSection(memberFoods, canonicalPath),
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

export function generateProteinFoodLinks(inputs) {
  const registry = buildRegistry(inputs);
  const structuralIdx = indexEdges(inputs.structural.edges);
  const editorialIdx = indexEdges(inputs.editorial.edges);
  const pairingIdx = indexEdges(inputs.pairing.edges);

  const foodLinkSets = inputs.foodPages.pages
    .map((page) =>
      buildFoodLinkSet(page, registry, structuralIdx, editorialIdx, pairingIdx)
    )
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const groupLinkSets = inputs.groupPages.pages
    .map((page) => buildGroupLinkSet(page, registry, structuralIdx))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const categoryLinkSets = inputs.categoryPages.pages
    .map((page) => buildCategoryLinkSet(page, registry, structuralIdx))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    meta: {
      phase: "ONTOLOGY-03D",
      catalog_version: inputs.foodPages.meta.catalog_version,
      food_ontology_version: inputs.foodPages.meta.food_ontology_version,
    },
    foodLinkSets,
    groupLinkSets,
    categoryLinkSets,
    registry,
    inputs,
  };
}

function validateLinkGraph(generated) {
  const errors = [];
  let brokenLinks = 0;
  let duplicateLinks = 0;
  let totalLinks = 0;

  const allSets = [
    ...generated.foodLinkSets,
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

        if (!isResolvableHref(link.href, generated.registry)) {
          brokenLinks += 1;
          errors.push(`Broken link in ${linkSet.slug}/${key}: ${link.href}`);
        }

        if (link.source !== "ontology") {
          errors.push(`${linkSet.slug}: invalid link source ${link.source}`);
        }
      }
    }

    const page =
      generated.inputs.foodPages.pages.find((p) => p.canonical_path === linkSet.canonical_path) ??
      generated.inputs.groupPages.pages.find((p) => p.canonical_path === linkSet.canonical_path) ??
      generated.inputs.categoryPages.pages.find((p) => p.canonical_path === linkSet.canonical_path);

    if (!page) {
      errors.push(`Orphan link set: ${linkSet.slug}`);
    }
  }

  if (generated.foodLinkSets.length !== generated.inputs.foodPages.pages.length) {
    errors.push("Food link set count mismatch");
  }
  if (generated.groupLinkSets.length !== generated.inputs.groupPages.pages.length) {
    errors.push("Group link set count mismatch");
  }
  if (generated.categoryLinkSets.length !== generated.inputs.categoryPages.pages.length) {
    errors.push("Category link set count mismatch");
  }

  return { errors, brokenLinks, duplicateLinks, totalLinks };
}

function packageOutput(generated) {
  return {
    foods: {
      meta: {
        ...generated.meta,
        link_set_type: "protein_food",
        link_set_count: generated.foodLinkSets.length,
      },
      link_sets: generated.foodLinkSets,
    },
    groups: {
      meta: {
        ...generated.meta,
        link_set_type: "protein_group",
        link_set_count: generated.groupLinkSets.length,
      },
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

function main() {
  const inputs = loadInputs();
  const generated = generateProteinFoodLinks(inputs);
  const packaged = packageOutput(generated);
  const validation = validateLinkGraph(generated);

  const determinismPass =
    serializeRuntime(packaged.foods) ===
    serializeRuntime(packageOutput(generateProteinFoodLinks(inputs)).foods);

  const overall =
    validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "ONTOLOGY-03D",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      metrics: {
        "Food link sets": generated.foodLinkSets.length,
        "Group link sets": generated.groupLinkSets.length,
        "Category link sets": generated.categoryLinkSets.length,
        "Total internal links": validation.totalLinks,
        "Broken links": validation.brokenLinks,
        "Duplicate links": validation.duplicateLinks,
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

  const report = {
    phase: "ONTOLOGY-03D",
    overall_result: "PASS",
    validation_errors: [],
    outputs: Object.values(PATHS.outputs).map((p) => path.relative(ROOT, p)),
    metrics: {
      "Food link sets": generated.foodLinkSets.length,
      "Group link sets": generated.groupLinkSets.length,
      "Category link sets": generated.categoryLinkSets.length,
      "Total internal links": validation.totalLinks,
      "Broken links": 0,
      "Duplicate links": 0,
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
