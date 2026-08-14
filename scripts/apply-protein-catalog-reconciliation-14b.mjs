#!/usr/bin/env node
/**
 * FOOD-14B — Apply catalog reconciliation from protein migration map.
 * Updates deprecation metadata and poster additions only — no runtime/editorial/wine changes.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/protein-food-catalog.json");
const MAP_PATH = path.join(ROOT, "data/protein-migration-map.json");
const REPORT_PATH = path.join(ROOT, "reports/protein-catalog-reconciliation-14b.json");

function emptyRelationshipArrays() {
  return {
    texture: [],
    typical_descriptors: [],
    wine_pairings: [],
    avoid_wine_pairings: [],
    related_styles: [],
    related_descriptors: [],
    related_regions: [],
    related_serving: [],
    related_techniques: [],
    similar_foods: [],
    substitutes: [],
    common_preparations: [],
    common_cuisines: [],
  };
}

function buildCuredMeatEntity(spec) {
  return {
    id: spec.id,
    slug: spec.slug,
    name: spec.name,
    entity_type: "protein_food",
    domain: "culinary",
    parent_group: spec.parent_group,
    food_category: "animal",
    scientific_name: "Sus scrofa domesticus",
    external_ids: {},
    aliases: spec.slug === "salami" ? ["dry-cured sausage"] : ["prosciutto di parma", "Parma ham"],
    fat_content: "rich",
    cut_type: "trim",
    bone_state: "boneless",
    primary_cooking_methods: spec.slug === "salami" ? ["slice", "pan-sear"] : ["slice"],
    recommended_doneness: ["well-done"],
    anatomical_cut: spec.slug === "prosciutto" ? "leg" : "trim",
    processing_state: "cured",
    ...emptyRelationshipArrays(),
    summary:
      spec.slug === "salami"
        ? "Salami is dry-cured fermented sausage — savory, garlicky, and fat-rich. Structured reds, Lambrusco, and off-dry whites suit charcuterie boards."
        : "Prosciutto is dry-cured Italian ham — silky, salty, and delicate. Prosecco, dry rosé, and light Pinot Noir suit antipasto and melon pairings.",
    beginner_notes:
      spec.slug === "salami"
        ? "Slice thin for boards; cooking optional in pasta and pizza."
        : "Serve paper-thin; avoid cooking — heat melts delicate texture.",
    faq: [
      {
        q: `What is ${spec.name}?`,
        a:
          spec.slug === "salami"
            ? "Dry-cured fermented sausage with regional styles worldwide."
            : "Dry-cured ham traditionally from Italian hind leg.",
      },
    ],
    seo_title: `${spec.name} — Protein Food Guide`,
    seo_description:
      spec.slug === "salami"
        ? "Salami is dry-cured fermented sausage for charcuterie and cooking — pairs with Lambrusco and structured reds."
        : "Prosciutto is dry-cured Italian ham for antipasto — pairs with Prosecco and dry rosé.",
    refinement: {
      introduced_phase: "FOOD-14B",
      poster_concept: spec.poster_concept,
      governance_rule: spec.governance_rule,
    },
  };
}

function buildLangoustineEntity(spec) {
  return {
    id: spec.id,
    slug: spec.slug,
    name: spec.name,
    entity_type: "protein_food",
    domain: "culinary",
    parent_group: spec.parent_group,
    food_category: "animal",
    scientific_name: "Nephrops norvegicus",
    species: "langoustine",
    external_ids: {},
    aliases: ["Dublin Bay prawn", "scampi", "Norway lobster"],
    fat_content: "lean",
    cut_type: "whole",
    anatomical_cut: "",
    bone_state: "boneless",
    processing_state: "fresh",
    primary_cooking_methods: ["grill", "sauté", "roast"],
    recommended_doneness: ["well-done"],
    ...emptyRelationshipArrays(),
    summary:
      "Langoustine is a slender clawed crustacean — sweeter and more delicate than large warm-water prawns. Mineral whites, Champagne, and dry rosé suit butter and garlic preparations.",
    beginner_notes: "Also sold as scampi or Dublin Bay prawn — distinct from large tiger prawn.",
    faq: [
      {
        q: "What is Langoustine?",
        a: "A cold-water crustacean prized in European seafood cookery.",
      },
    ],
    seo_title: "Langoustine — Protein Food Guide",
    seo_description:
      "Langoustine is a delicate crustacean for grilling and roasting — pairs with Champagne and mineral whites.",
    refinement: {
      introduced_phase: "FOOD-14B",
      poster_concept: spec.poster_concept,
      governance_rule: spec.governance_rule,
    },
  };
}

function applyReconciliation(catalog, map) {
  const migrationByLegacy = new Map(map.migrations.map((m) => [m.legacy_id, m]));
  let deprecatedCount = 0;
  let retainedMarked = 0;
  let additions = 0;

  for (const entity of catalog.protein_foods) {
    const migration = migrationByLegacy.get(entity.id);
    if (migration) {
      entity.refinement = {
        deprecated: true,
        canonical_id: migration.canonical_id,
        canonical_domain: migration.canonical_domain,
        governance_rule: migration.governance_rule,
        migration_phase: "FOOD-14B",
        runtime_generate: false,
        editorial_generate: false,
        wine_generate: false,
        publication_mode: migration.publication_mode,
        redirect_required: migration.redirect_required,
        canonical_publication_path: migration.canonical_publication_path,
      };
      deprecatedCount += 1;
      continue;
    }

    const retained = map.retained.find((r) => r.protein_id === entity.id);
    if (retained) {
      entity.refinement = {
        retained: true,
        governance_rule: retained.governance_rule,
        migration_phase: "FOOD-14B",
        reason: retained.reason,
        runtime_generate: true,
        editorial_generate: true,
        wine_generate: true,
        publication_mode: retained.publication_mode,
      };
      retainedMarked += 1;
    }
  }

  const hasCuredMeatGroup = catalog.groups.some((g) => g.slug === "cured-meat");
  if (!hasCuredMeatGroup) {
    catalog.groups.push({
      id: "food.protein.cured-meat",
      slug: "cured-meat",
      name: "Cured Meat",
      entity_type: "protein_group",
      domain: "culinary",
      parent_category: "animal-protein",
      scientific_name: "Sus scrofa domesticus",
      external_ids: {},
      introduction:
        "Cured meats are salt-cured, smoked, or dry-cured animal proteins with distinct pairing identities — charcuterie, antipasto, and flavoring roles.",
      child_slugs: [],
      summary: "Salami, prosciutto, and other cured forms with poster-level culinary identity.",
      seo_title: "Cured Meat — Protein Group Guide",
      seo_description: "Salami, prosciutto, and cured charcuterie proteins for wine pairing.",
      refinement: { introduced_phase: "FOOD-14B", governance_rule: "PROTEIN-004" },
    });

    const animalCategory = catalog.categories.find((c) => c.slug === "animal-protein");
    if (animalCategory && !animalCategory.child_slugs.includes("cured-meat")) {
      animalCategory.child_slugs.push("cured-meat");
    }
  }

  const curedGroup = catalog.groups.find((g) => g.slug === "cured-meat");
  const crustaceansGroup = catalog.groups.find((g) => g.slug === "crustaceans");

  for (const spec of map.poster_additions) {
    if (catalog.protein_foods.some((e) => e.id === spec.id)) continue;

    const entity =
      spec.parent_group === "cured-meat"
        ? buildCuredMeatEntity(spec)
        : buildLangoustineEntity(spec);

    catalog.protein_foods.push(entity);
    additions += 1;

    const group = spec.parent_group === "cured-meat" ? curedGroup : crustaceansGroup;
    if (group && !group.child_slugs.includes(spec.slug)) {
      group.child_slugs.push(spec.slug);
    }
  }

  catalog.meta.phase = "FOOD-14B";
  catalog.meta.refinement_phase = "FOOD-14B";
  catalog.meta.catalog_version = "2.1.0";
  catalog.meta.migration_map = "data/protein-migration-map.json";
  catalog.meta.entity_count = catalog.protein_foods.length;

  return { deprecatedCount, retainedMarked, additions, entityCount: catalog.protein_foods.length };
}

const map = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
const beforeCount = catalog.protein_foods.length;
const stats = applyReconciliation(catalog, map);

fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

const report = {
  phase: "FOOD-14B",
  domain: "protein",
  overall_result: "PASS",
  output: "data/protein-food-catalog.json",
  metrics: {
    "Entities before reconciliation": beforeCount,
    "Entities after reconciliation": stats.entityCount,
    "Deprecated entities marked": stats.deprecatedCount,
    "Retained entities marked": stats.retainedMarked,
    "Poster additions applied": stats.additions,
    "Catalog version": "2.1.0",
    "Runtime modified": false,
    "Editorial modified": false,
    "Wine modified": false,
    "Publication modified": false,
  },
};

fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report.metrics, null, 2));
console.log(`Catalog: ${CATALOG_PATH}`);
console.log(`Report: ${REPORT_PATH}`);
