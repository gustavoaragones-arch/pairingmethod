#!/usr/bin/env node
/**
 * ONTOLOGY-03B — Static page view model generator for protein food ontology.
 * Consumes projection datasets only; produces presentation-ready page models.
 *
 * Run: node scripts/generate-protein-food-pages-03b.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import {
  absoluteUrl,
  proteinCategoryUrl,
  proteinFoodUrl,
  proteinFoodsHubUrl,
  proteinGroupUrl,
  termUrl,
  wineStyleUrl,
  winemakingTechniqueUrl,
} from "../lib/public-url.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GENERATED_DIR = path.join(ROOT, "data/generated");
const PAGES_DIR = path.join(ROOT, "data/pages");
const REPORT_PATH = path.join(ROOT, "reports/page-generation-report.json");

const INPUTS = {
  foods: path.join(GENERATED_DIR, "protein-food-pages.json"),
  groups: path.join(GENERATED_DIR, "protein-group-pages.json"),
  categories: path.join(GENERATED_DIR, "protein-category-pages.json"),
};

const OUTPUTS = {
  foods: path.join(PAGES_DIR, "protein-food-pages.json"),
  groups: path.join(PAGES_DIR, "protein-group-pages.json"),
  categories: path.join(PAGES_DIR, "protein-category-pages.json"),
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

function loadProjections() {
  return {
    foods: JSON.parse(fs.readFileSync(INPUTS.foods, "utf8")),
    groups: JSON.parse(fs.readFileSync(INPUTS.groups, "utf8")),
    categories: JSON.parse(fs.readFileSync(INPUTS.categories, "utf8")),
  };
}

function preparationLabel(target) {
  return target.replace(/^preparation\./, "").replace(/-/g, " ");
}

function resolveFoodRef(targetId, foodById) {
  const projection = foodById.get(targetId);
  if (!projection) return null;
  return {
    id: projection.identity.id,
    slug: projection.identity.slug,
    name: projection.identity.name,
    href: proteinFoodUrl(projection.identity.slug),
  };
}

function mapEditorialRefs(refs, foodById) {
  return refs
    .map((ref) => {
      const entity = resolveFoodRef(ref.target, foodById);
      if (!entity) return null;
      return {
        ...entity,
        relationship: ref.relationship,
        confidence: ref.confidence,
        derived_from: ref.derived_from,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function mapPreparationRefs(refs) {
  return refs
    .map((ref) => ({
      target: ref.target,
      label: preparationLabel(ref.target),
      relationship: ref.relationship,
      confidence: ref.confidence,
      derived_from: ref.derived_from,
    }))
    .sort((a, b) => a.target.localeCompare(b.target));
}

function mapWineStyleRefs(refs) {
  return refs
    .map((ref) => ({
      slug: ref.target,
      name: ref.target.replace(/-/g, " "),
      href: wineStyleUrl(ref.target),
      relationship: ref.relationship,
      confidence: ref.confidence,
      derived_from: ref.derived_from,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function mapDescriptorRefs(refs) {
  return refs
    .map((ref) => ({
      slug: ref.target,
      name: ref.target.replace(/-/g, " "),
      href: termUrl(ref.target),
      relationship: ref.relationship,
      confidence: ref.confidence,
      derived_from: ref.derived_from,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function mapTechniqueRefs(refs) {
  return refs
    .map((ref) => ({
      slug: ref.target,
      name: ref.target.replace(/-/g, " "),
      href: winemakingTechniqueUrl(ref.target),
      relationship: ref.relationship,
      confidence: ref.confidence,
      derived_from: ref.derived_from,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function foodBreadcrumbs(projection) {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Foods", href: proteinFoodsHubUrl() },
  ];
  if (projection.classification.category) {
    crumbs.push({
      label: projection.classification.category.name,
      href: proteinCategoryUrl(projection.classification.category.slug),
    });
  }
  if (projection.classification.group) {
    crumbs.push({
      label: projection.classification.group.name,
      href: proteinGroupUrl(projection.classification.group.slug),
    });
  }
  crumbs.push({
    label: projection.identity.name,
    href: proteinFoodUrl(projection.identity.slug),
  });
  return crumbs;
}

function foodMetadata(projection, canonicalPath) {
  const title = `${projection.identity.name} — Protein Food Guide`;
  const groupName = projection.classification.group?.name ?? "";
  const categoryName = projection.classification.category?.name ?? "";
  const description = [
    projection.identity.name,
    groupName && `(${groupName})`,
    categoryName && `— ${categoryName} protein food`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title,
    description,
    canonical: absoluteUrl(canonicalPath),
    og_title: title,
    og_description: description,
  };
}

function groupBreadcrumbs(projection) {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Foods", href: proteinFoodsHubUrl() },
  ];
  if (projection.parent_category) {
    crumbs.push({
      label: projection.parent_category.name,
      href: proteinCategoryUrl(projection.parent_category.slug),
    });
  }
  crumbs.push({
    label: projection.identity.name,
    href: proteinGroupUrl(projection.identity.slug),
  });
  return crumbs;
}

function groupMetadata(projection, canonicalPath) {
  const title = `${projection.identity.name} — Protein Food Group`;
  const description = `${projection.identity.name} — ${projection.food_count} protein foods in the Food Ontology.`;
  return {
    title,
    description,
    canonical: absoluteUrl(canonicalPath),
    og_title: title,
    og_description: description,
  };
}

function categoryBreadcrumbs(projection) {
  return [
    { label: "Home", href: "/" },
    { label: "Foods", href: proteinFoodsHubUrl() },
    {
      label: projection.identity.name,
      href: proteinCategoryUrl(projection.identity.slug),
    },
  ];
}

function categoryMetadata(projection, canonicalPath) {
  const title = `${projection.identity.name} — Protein Food Category`;
  const description = `${projection.identity.name} — ${projection.group_count} groups and ${projection.food_count} protein foods.`;
  return {
    title,
    description,
    canonical: absoluteUrl(canonicalPath),
    og_title: title,
    og_description: description,
  };
}

export function generateProteinFoodPageModels(projections) {
  const foodById = new Map(
    projections.foods.projections.map((p) => [p.identity.id, p])
  );
  const groupById = new Map(
    projections.groups.projections.map((p) => [p.identity.id, p])
  );
  const categoryById = new Map(
    projections.categories.projections.map((p) => [p.identity.id, p])
  );

  const foodPages = projections.foods.projections
    .map((projection) => {
      const canonicalPath = proteinFoodUrl(projection.identity.slug);
      return {
        page_type: "protein_food",
        slug: projection.identity.slug,
        canonical_path: canonicalPath,
        identity: {
          title: projection.identity.name,
          slug: projection.identity.slug,
          id: projection.identity.id,
        },
        breadcrumbs: foodBreadcrumbs(projection),
        overview: {
          display_name: projection.identity.name,
          category: projection.classification.category,
          group: projection.classification.group,
          scientific_name: projection.classification.scientific_name,
          species: projection.classification.species,
        },
        characteristics: projection.intrinsic,
        related_foods: {
          similar_foods: mapEditorialRefs(
            projection.editorial_context.similar_foods,
            foodById
          ),
          substitutions: mapEditorialRefs(
            projection.editorial_context.substitutions,
            foodById
          ),
          culinary_role: mapEditorialRefs(
            projection.editorial_context.culinary_role,
            foodById
          ),
          common_preparations: mapPreparationRefs(
            projection.editorial_context.common_preparations
          ),
        },
        wine_pairing_summary: {
          primary_styles: mapWineStyleRefs(
            projection.wine_context.primary_wine_styles
          ),
          alternative_styles: mapWineStyleRefs(
            projection.wine_context.alternative_wine_styles
          ),
          descriptor_affinities: mapDescriptorRefs(projection.wine_context.descriptors),
          technique_affinities: mapTechniqueRefs(projection.wine_context.techniques),
        },
        metadata: foodMetadata(projection, canonicalPath),
        projection_id: projection.identity.id,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const groupPages = projections.groups.projections
    .map((projection) => {
      const canonicalPath = proteinGroupUrl(projection.identity.slug);
      const memberFoods = projection.member_food_ids
        .map((id) => resolveFoodRef(id, foodById))
        .filter(Boolean)
        .sort((a, b) => a.slug.localeCompare(b.slug));

      return {
        page_type: "protein_group",
        slug: projection.identity.slug,
        canonical_path: canonicalPath,
        identity: {
          title: projection.identity.name,
          slug: projection.identity.slug,
          id: projection.identity.id,
        },
        breadcrumbs: groupBreadcrumbs(projection),
        overview: {
          display_name: projection.identity.name,
          parent_category: projection.parent_category,
          food_count: projection.food_count,
        },
        member_foods: memberFoods,
        species_represented: projection.species_represented,
        processing_states_represented: projection.processing_states_represented,
        metadata: groupMetadata(projection, canonicalPath),
        projection_id: projection.identity.id,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const categoryPages = projections.categories.projections
    .map((projection) => {
      const canonicalPath = proteinCategoryUrl(projection.identity.slug);
      const groups = projection.groups
        .map((group) => {
          const groupProjection = groupById.get(group.id);
          return {
            ...group,
            href: proteinGroupUrl(group.slug),
            food_count: groupProjection?.food_count ?? 0,
          };
        })
        .sort((a, b) => a.slug.localeCompare(b.slug));

      return {
        page_type: "protein_category",
        slug: projection.identity.slug,
        canonical_path: canonicalPath,
        identity: {
          title: projection.identity.name,
          slug: projection.identity.slug,
          id: projection.identity.id,
        },
        breadcrumbs: categoryBreadcrumbs(projection),
        overview: {
          display_name: projection.identity.name,
          group_count: projection.group_count,
          food_count: projection.food_count,
        },
        groups,
        metadata: categoryMetadata(projection, canonicalPath),
        projection_id: projection.identity.id,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    meta: {
      phase: "ONTOLOGY-03B",
      catalog_version: projections.foods.meta.catalog_version,
      food_ontology_version: projections.foods.meta.food_ontology_version,
    },
    foodPages,
    groupPages,
    categoryPages,
    indexes: { foodById, groupById, categoryById },
    projectionCounts: {
      foods: projections.foods.projections.length,
      groups: projections.groups.projections.length,
      categories: projections.categories.projections.length,
    },
  };
}

function validatePageModels(generated, projections) {
  const errors = [];
  const urls = new Set();
  let duplicateUrls = 0;
  let missingReferences = 0;

  const foodProjectionIds = new Set(
    projections.foods.projections.map((p) => p.identity.id)
  );
  const groupProjectionIds = new Set(
    projections.groups.projections.map((p) => p.identity.id)
  );
  const categoryProjectionIds = new Set(
    projections.categories.projections.map((p) => p.identity.id)
  );

  const allPages = [
    ...generated.foodPages,
    ...generated.groupPages,
    ...generated.categoryPages,
  ];

  for (const page of allPages) {
    if (urls.has(page.canonical_path)) {
      duplicateUrls += 1;
      errors.push(`Duplicate URL: ${page.canonical_path}`);
    }
    urls.add(page.canonical_path);

    if (page.canonical_path.includes(".html")) {
      errors.push(`${page.slug}: canonical path must not include .html`);
    }
    if (!page.canonical_path.endsWith("/")) {
      errors.push(`${page.slug}: canonical path must end with trailing slash`);
    }

    if (page.page_type === "protein_food" && !foodProjectionIds.has(page.projection_id)) {
      missingReferences += 1;
      errors.push(`Missing food projection: ${page.projection_id}`);
    }
    if (page.page_type === "protein_group" && !groupProjectionIds.has(page.projection_id)) {
      missingReferences += 1;
      errors.push(`Missing group projection: ${page.projection_id}`);
    }
    if (
      page.page_type === "protein_category" &&
      !categoryProjectionIds.has(page.projection_id)
    ) {
      missingReferences += 1;
      errors.push(`Missing category projection: ${page.projection_id}`);
    }
  }

  if (generated.foodPages.length !== projections.foods.projections.length) {
    errors.push("Food page count does not match food projections");
  }
  if (generated.groupPages.length !== projections.groups.projections.length) {
    errors.push("Group page count does not match group projections");
  }
  if (generated.categoryPages.length !== projections.categories.projections.length) {
    errors.push("Category page count does not match category projections");
  }

  for (const page of generated.foodPages) {
    for (const bucket of Object.values(page.related_foods)) {
      for (const item of bucket) {
        if (item.id && !foodProjectionIds.has(item.id)) {
          missingReferences += 1;
          errors.push(`${page.slug}: invalid related food ${item.id}`);
        }
      }
    }
  }

  for (const page of generated.groupPages) {
    for (const food of page.member_foods) {
      if (!foodProjectionIds.has(food.id)) {
        missingReferences += 1;
        errors.push(`${page.slug}: invalid member food ${food.id}`);
      }
    }
  }

  return { errors, duplicateUrls, missingReferences };
}

function packageOutputs(generated) {
  return {
    foods: {
      meta: {
        ...generated.meta,
        page_type: "protein_food",
        page_count: generated.foodPages.length,
      },
      pages: generated.foodPages,
    },
    groups: {
      meta: {
        ...generated.meta,
        page_type: "protein_group",
        page_count: generated.groupPages.length,
      },
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

function main() {
  const projections = loadProjections();
  const generated = generateProteinFoodPageModels(projections);
  const packaged = packageOutputs(generated);
  const validation = validatePageModels(generated, projections);

  const determinismPass =
    serializeRuntime(packaged.foods) ===
    serializeRuntime(packageOutputs(generateProteinFoodPageModels(projections)).foods);

  const overall =
    validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "ONTOLOGY-03B",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      metrics: {
        "Food pages": generated.foodPages.length,
        "Group pages": generated.groupPages.length,
        "Category pages": generated.categoryPages.length,
        "Duplicate URLs": validation.duplicateUrls,
        "Missing references": validation.missingReferences,
        "Validation errors": validation.errors.length,
        "Overall result": "FAIL",
      },
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
    phase: "ONTOLOGY-03B",
    overall_result: "PASS",
    validation_errors: [],
    outputs: Object.values(OUTPUTS).map((p) => path.relative(ROOT, p)),
    metrics: {
      "Food pages": generated.foodPages.length,
      "Group pages": generated.groupPages.length,
      "Category pages": generated.categoryPages.length,
      "Duplicate URLs": 0,
      "Missing references": 0,
      "Validation errors": 0,
      "Overall result": "PASS",
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
