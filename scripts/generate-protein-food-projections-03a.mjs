#!/usr/bin/env node
/**
 * ONTOLOGY-03A — Protein food projection generator.
 * Read-only assembly of validated ontology into page-ready view models.
 * Does not modify catalog, runtime indexes, or relationship layers.
 *
 * Run: node scripts/generate-protein-food-projections-03a.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const GENERATED_DIR = path.join(ROOT, "data/generated");
const CATALOG_PATH = path.join(ROOT, "data/protein-food-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/generator-report.json");

const OUTPUTS = {
  foods: path.join(GENERATED_DIR, "protein-food-pages.json"),
  groups: path.join(GENERATED_DIR, "protein-group-pages.json"),
  categories: path.join(GENERATED_DIR, "protein-category-pages.json"),
};

const INTRINSIC_FIELDS = [
  "food_category",
  "species",
  "scientific_name",
  "cut_type",
  "anatomical_cut",
  "bone_state",
  "plant_part",
  "edible_structure",
  "processing_state",
  "fat_content",
  "primary_cooking_methods",
  "recommended_doneness",
  "texture",
  "typical_descriptors",
];

const EDITORIAL_BY_RELATIONSHIP = {
  similar_to: "similar_foods",
  substitutes_for: "substitutions",
  shares_culinary_role: "culinary_role",
  commonly_prepared_as: "common_preparations",
};

const WINE_BY_RELATIONSHIP = {
  pairs_with_style: "primary_wine_styles",
  also_pairs_with_style: "alternative_wine_styles",
  pairs_with_descriptor: "descriptors",
  pairs_with_technique: "techniques",
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

const SYMMETRIC_EDITORIAL = new Set(["similar_to", "shares_culinary_role"]);

function canonicalEdgeKey(source, relationship, target) {
  if (SYMMETRIC_EDITORIAL.has(relationship)) {
    const [a, b] =
      source.localeCompare(target) <= 0 ? [source, target] : [target, source];
    return `${a}\t${relationship}\t${b}`;
  }
  return `${source}\t${relationship}\t${target}`;
}

function relationshipRef(edge) {
  return {
    relationship: edge.relationship,
    target: edge.target,
    confidence: edge.confidence,
    derived_from: edge.derived_from,
  };
}

function entityRef(entity) {
  return {
    id: entity.id,
    slug: entity.slug,
    name: entity.name,
  };
}

function intrinsicFromEntity(entity) {
  const intrinsic = {};
  for (const field of INTRINSIC_FIELDS) {
    if (field in entity) intrinsic[field] = entity[field];
  }
  return intrinsic;
}

function indexEdgesBySource(edges) {
  const map = {};
  for (const edge of edges) {
    if (!map[edge.source]) map[edge.source] = [];
    map[edge.source].push(edge);
  }
  return map;
}

function indexSymmetricEdges(edges, relationship) {
  const map = {};
  for (const edge of edges) {
    if (edge.relationship !== relationship) continue;
    for (const id of [edge.source, edge.target]) {
      if (!map[id]) map[id] = [];
      const other = id === edge.source ? edge.target : edge.source;
      map[id].push({ ...edge, target: other, source: id });
    }
  }
  return map;
}

function loadInputs() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const index = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-index.json"), "utf8")
  );
  const runtimeGroups = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-groups.json"), "utf8")
  );
  const runtimeCategories = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-categories.json"), "utf8")
  );
  const structural = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-relationships.json"), "utf8")
  );
  const editorial = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-editorial-relationships.json"), "utf8")
  );
  const pairing = JSON.parse(
    fs.readFileSync(path.join(RUNTIME_DIR, "protein-food-wine-relationships.json"), "utf8")
  );

  return { catalog, index, runtimeGroups, runtimeCategories, structural, editorial, pairing };
}

function buildRelationshipRegistry(structural, editorial, pairing) {
  const registry = new Map();
  for (const layer of [structural, editorial, pairing]) {
    for (const edge of layer.edges) {
      registry.set(canonicalEdgeKey(edge.source, edge.relationship, edge.target), edge);
    }
  }
  return registry;
}

export function generateProteinFoodProjections(inputs) {
  const { catalog, index, runtimeGroups, runtimeCategories, structural, editorial, pairing } =
    inputs;

  const groupBySlug = Object.fromEntries(catalog.groups.map((g) => [g.slug, g]));
  const categoryBySlug = Object.fromEntries(catalog.categories.map((c) => [c.slug, c]));
  const foodById = Object.fromEntries(catalog.protein_foods.map((f) => [f.id, f]));
  const foodIds = new Set(catalog.protein_foods.map((f) => f.id));
  const groupIds = new Set(catalog.groups.map((g) => g.id));
  const categoryIds = new Set(catalog.categories.map((c) => c.id));

  const editorialBySource = indexEdgesBySource(editorial.edges);
  const pairingBySource = indexEdgesBySource(pairing.edges);
  const similarByFood = indexSymmetricEdges(editorial.edges, "similar_to");
  const culinaryRoleByFood = indexSymmetricEdges(editorial.edges, "shares_culinary_role");

  const relationshipRegistry = buildRelationshipRegistry(structural, editorial, pairing);

  const foodProjections = catalog.protein_foods
    .map((food) => {
      const group = groupBySlug[food.parent_group];
      const category = group ? categoryBySlug[group.parent_category] : null;

      const editorialContext = {
        similar_foods: [],
        substitutions: [],
        culinary_role: [],
        common_preparations: [],
      };

      for (const edge of editorialBySource[food.id] ?? []) {
        if (edge.relationship === "similar_to" || edge.relationship === "shares_culinary_role") {
          continue;
        }
        const bucket = EDITORIAL_BY_RELATIONSHIP[edge.relationship];
        if (bucket) editorialContext[bucket].push(relationshipRef(edge));
      }

      for (const edge of similarByFood[food.id] ?? []) {
        editorialContext.similar_foods.push(relationshipRef(edge));
      }
      for (const edge of culinaryRoleByFood[food.id] ?? []) {
        editorialContext.culinary_role.push(relationshipRef(edge));
      }

      for (const bucket of Object.values(editorialContext)) {
        bucket.sort((a, b) =>
          `${a.relationship}\t${a.target}`.localeCompare(`${b.relationship}\t${b.target}`)
        );
      }

      const wineContext = {
        primary_wine_styles: [],
        alternative_wine_styles: [],
        descriptors: [],
        techniques: [],
      };

      for (const edge of pairingBySource[food.id] ?? []) {
        const bucket = WINE_BY_RELATIONSHIP[edge.relationship];
        if (bucket) wineContext[bucket].push(relationshipRef(edge));
      }

      for (const bucket of Object.values(wineContext)) {
        bucket.sort((a, b) =>
          `${a.relationship}\t${a.target}`.localeCompare(`${b.relationship}\t${b.target}`)
        );
      }

      return {
        identity: {
          id: food.id,
          slug: food.slug,
          name: food.name,
        },
        classification: {
          category: category ? entityRef(category) : null,
          group: group ? entityRef(group) : null,
          species: food.species ?? "",
          scientific_name: food.scientific_name ?? "",
        },
        intrinsic: intrinsicFromEntity(food),
        structural_context: {
          parent_group: group ? entityRef(group) : null,
          parent_category: category ? entityRef(category) : null,
        },
        editorial_context: editorialContext,
        wine_context: wineContext,
      };
    })
    .sort((a, b) => a.identity.id.localeCompare(b.identity.id));

  const groupProjections = catalog.groups
    .map((group) => {
      const runtime = runtimeGroups.find((g) => g.slug === group.slug);
      const memberFoodIds = [...(runtime?.food_ids ?? [])].sort();
      const foods = memberFoodIds.map((id) => foodById[id]).filter(Boolean);
      const species = [...new Set(foods.map((f) => f.species).filter(Boolean))].sort();
      const processingStates = [
        ...new Set(foods.map((f) => f.processing_state).filter(Boolean)),
      ].sort();

      return {
        identity: entityRef(group),
        parent_category: categoryBySlug[group.parent_category]
          ? entityRef(categoryBySlug[group.parent_category])
          : null,
        member_food_ids: memberFoodIds,
        food_count: memberFoodIds.length,
        species_represented: species,
        processing_states_represented: processingStates,
      };
    })
    .sort((a, b) => a.identity.id.localeCompare(b.identity.id));

  const categoryProjections = catalog.categories
    .map((category) => {
      const runtime = runtimeCategories.find((c) => c.slug === category.slug);
      const groupRefs = (runtime?.group_slugs ?? category.child_slugs)
        .map((slug) => groupBySlug[slug])
        .filter(Boolean)
        .map(entityRef)
        .sort((a, b) => a.id.localeCompare(b.id));

      const foodCount = groupRefs.reduce((sum, groupRef) => {
        const runtimeGroup = runtimeGroups.find((g) => g.slug === groupRef.slug);
        return sum + (runtimeGroup?.food_ids?.length ?? 0);
      }, 0);

      return {
        identity: entityRef(category),
        groups: groupRefs,
        group_count: groupRefs.length,
        food_count: foodCount,
      };
    })
    .sort((a, b) => a.identity.id.localeCompare(b.identity.id));

  return {
    meta: {
      phase: "ONTOLOGY-03A",
      catalog_version: catalog.meta?.catalog_version ?? null,
      food_ontology_version: catalog.meta?.food_ontology_version ?? null,
    },
    foodProjections,
    groupProjections,
    categoryProjections,
    entitySets: { foodIds, groupIds, categoryIds },
    relationshipRegistry,
    index,
  };
}

function countRelationshipRefs(projections) {
  let count = 0;
  for (const food of projections) {
    for (const bucket of Object.values(food.editorial_context)) count += bucket.length;
    for (const bucket of Object.values(food.wine_context)) count += bucket.length;
  }
  return count;
}

function validateProjections(generated) {
  const errors = [];
  const { foodProjections, groupProjections, categoryProjections, entitySets, relationshipRegistry } =
    generated;

  if (foodProjections.length !== entitySets.foodIds.size) {
    errors.push(
      `Food projection count ${foodProjections.length} != catalog foods ${entitySets.foodIds.size}`
    );
  }
  if (groupProjections.length !== entitySets.groupIds.size) {
    errors.push(`Group projection count mismatch`);
  }
  if (categoryProjections.length !== entitySets.categoryIds.size) {
    errors.push(`Category projection count mismatch`);
  }

  const projectedFoodIds = new Set(foodProjections.map((p) => p.identity.id));
  for (const id of entitySets.foodIds) {
    if (!projectedFoodIds.has(id)) errors.push(`Orphan catalog food without projection: ${id}`);
  }

  for (const food of foodProjections) {
    if (!entitySets.foodIds.has(food.identity.id)) {
      errors.push(`Unknown food projection: ${food.identity.id}`);
    }
    if (food.structural_context.parent_group && !entitySets.groupIds.has(food.structural_context.parent_group.id)) {
      errors.push(`${food.identity.id}: invalid parent group reference`);
    }
    if (
      food.structural_context.parent_category &&
      !entitySets.categoryIds.has(food.structural_context.parent_category.id)
    ) {
      errors.push(`${food.identity.id}: invalid parent category reference`);
    }

    const allRefs = [
      ...Object.values(food.editorial_context).flat(),
      ...Object.values(food.wine_context).flat(),
    ];

    for (const ref of allRefs) {
      const key = canonicalEdgeKey(food.identity.id, ref.relationship, ref.target);
      if (!relationshipRegistry.has(key)) {
        errors.push(`${food.identity.id}: missing relationship ${key}`);
      }
      if (ref.relationship === "commonly_prepared_as") {
        if (!ref.target.startsWith("preparation.")) {
          errors.push(`${food.identity.id}: invalid preparation target ${ref.target}`);
        }
      } else if (
        ["similar_to", "substitutes_for", "shares_culinary_role"].includes(ref.relationship)
      ) {
        if (!entitySets.foodIds.has(ref.target)) {
          errors.push(`${food.identity.id}: invalid food target ${ref.target}`);
        }
      }
    }
  }

  for (const group of groupProjections) {
    if (!entitySets.groupIds.has(group.identity.id)) {
      errors.push(`Unknown group projection: ${group.identity.id}`);
    }
    for (const foodId of group.member_food_ids) {
      if (!entitySets.foodIds.has(foodId)) {
        errors.push(`Group ${group.identity.slug}: invalid member ${foodId}`);
      }
    }
  }

  for (const category of categoryProjections) {
    if (!entitySets.categoryIds.has(category.identity.id)) {
      errors.push(`Unknown category projection: ${category.identity.id}`);
    }
    for (const group of category.groups) {
      if (!entitySets.groupIds.has(group.id)) {
        errors.push(`Category ${category.identity.slug}: invalid group ${group.id}`);
      }
    }
  }

  return errors;
}

function packageOutput(generated) {
  const { meta, foodProjections, groupProjections, categoryProjections } = generated;

  return {
    foods: {
      meta: {
        ...meta,
        projection_type: "protein_food",
        projection_count: foodProjections.length,
      },
      projections: foodProjections,
    },
    groups: {
      meta: {
        ...meta,
        projection_type: "protein_group",
        projection_count: groupProjections.length,
      },
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

function main() {
  const inputs = loadInputs();
  const generated = generateProteinFoodProjections(inputs);
  const packaged = packageOutput(generated);
  const errors = validateProjections(generated);

  const determinismPass =
    serializeRuntime(packaged.foods) ===
    serializeRuntime(packageOutput(generateProteinFoodProjections(inputs)).foods);

  const overall = errors.length === 0 && determinismPass ? "PASS" : "FAIL";
  const referencedRelationships = countRelationshipRefs(generated.foodProjections);

  if (overall === "FAIL") {
    const report = {
      phase: "ONTOLOGY-03A",
      overall_result: "FAIL",
      validation_errors: errors,
      metrics: {
        "Food projections": generated.foodProjections.length,
        "Group projections": generated.groupProjections.length,
        "Category projections": generated.categoryProjections.length,
        "Referenced relationships": referencedRelationships,
        "Validation errors": errors.length,
        "Overall result": "FAIL",
      },
    };
    writeJson(REPORT_PATH, report);
    console.error(errors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(OUTPUTS.foods, packaged.foods);
  writeJson(OUTPUTS.groups, packaged.groups);
  writeJson(OUTPUTS.categories, packaged.categories);

  const report = {
    phase: "ONTOLOGY-03A",
    overall_result: "PASS",
    validation_errors: [],
    outputs: Object.values(OUTPUTS).map((p) => path.relative(ROOT, p)),
    metrics: {
      "Food projections": generated.foodProjections.length,
      "Group projections": generated.groupProjections.length,
      "Category projections": generated.categoryProjections.length,
      "Referenced relationships": referencedRelationships,
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
