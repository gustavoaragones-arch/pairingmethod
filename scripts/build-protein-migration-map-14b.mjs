#!/usr/bin/env node
/**
 * FOOD-14B — Build protein ownership migration map and certification audit.
 * SSOT: data/protein-migration-map.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/protein-food-catalog.json");
const MAP_PATH = path.join(ROOT, "data/protein-migration-map.json");
const REPORT_PATH = path.join(ROOT, "reports/protein-migration-audit.json");

const LEGACY_GROUPS = [
  "mushrooms",
  "legumes",
  "soy-foods",
  "nuts-seeds",
  "grains-wheat-protein",
];

const DOMAIN_PUBLICATION_PREFIX = {
  fungi: "/fungi/",
  legume: "/legumes/",
  "nut-seed": "/nut-seeds/",
  "grain-starch": "/grains-starches/",
};

/** @type {Record<string, string>} protein slug -> canonical entity id */
const CANONICAL_ID_BY_PROTEIN_SLUG = {
  "button-mushroom": "food.fungi.cultivated-mushrooms.button-mushroom",
  cremini: "food.fungi.cultivated-mushrooms.cremini",
  portobello: "food.fungi.cultivated-mushrooms.portobello",
  shiitake: "food.fungi.cultivated-mushrooms.shiitake",
  "oyster-mushroom": "food.fungi.cultivated-mushrooms.oyster-mushroom",
  "king-oyster": "food.fungi.cultivated-mushrooms.king-oyster",
  enoki: "food.fungi.cultivated-mushrooms.enoki",
  maitake: "food.fungi.cultivated-mushrooms.maitake",
  "lions-mane": "food.fungi.specialty-fungi.lions-mane",
  morel: "food.fungi.wild-mushrooms.morel",
  porcini: "food.fungi.wild-mushrooms.porcini",
  chanterelle: "food.fungi.wild-mushrooms.chanterelle",
  chickpeas: "food.legume.chickpeas.chickpea",
  lentils: "food.legume.lentils.green-lentil",
  "green-lentils": "food.legume.lentils.green-lentil",
  "red-lentils": "food.legume.lentils.red-lentil",
  "black-lentils": "food.legume.lentils.black-lentil",
  "black-beans": "food.legume.beans.black-bean",
  "kidney-beans": "food.legume.beans.kidney-bean",
  "pinto-beans": "food.legume.beans.pinto-bean",
  "navy-beans": "food.legume.beans.navy-bean",
  "cannellini-beans": "food.legume.beans.cannellini-bean",
  "lima-beans": "food.legume.beans.lima-bean",
  peas: "food.legume.peas.green-pea",
  soybeans: "food.legume.other-legumes.soybean",
  edamame: "food.legume.other-legumes.soybean",
  "tofu-firm": "food.legume.legume-products.tofu",
  "silken-tofu": "food.legume.legume-products.tofu",
  tempeh: "food.legume.legume-products.tempeh",
  natto: "food.legume.legume-products.natto",
  "textured-vegetable-protein": "food.legume.legume-products.textured-vegetable-protein",
  "soy-curls": "food.legume.legume-products.soy-curls",
  miso: "food.legume.legume-products.miso",
  almonds: "food.nut-seed.tree-nuts.almond",
  walnuts: "food.nut-seed.tree-nuts.walnut",
  pistachios: "food.nut-seed.tree-nuts.pistachio",
  cashews: "food.nut-seed.tree-nuts.cashew",
  peanuts: "food.nut-seed.peanuts.peanut",
  "pumpkin-seeds": "food.nut-seed.edible-seeds.pumpkin-seed",
  "sunflower-seeds": "food.nut-seed.edible-seeds.sunflower-seed",
  "hemp-seeds": "food.nut-seed.edible-seeds.hemp-seed",
  "chia-seeds": "food.nut-seed.edible-seeds.chia-seed",
  flaxseed: "food.nut-seed.edible-seeds.flaxseed",
  "sesame-seeds": "food.nut-seed.edible-seeds.sesame",
  "pine-nuts": "food.nut-seed.tree-nuts.pine-nut",
  quinoa: "food.grain.pseudocereals.quinoa",
  amaranth: "food.grain.pseudocereals.amaranth",
  buckwheat: "food.grain.pseudocereals.buckwheat",
  farro: "food.grain.whole-grains.farro",
  oats: "food.grain.whole-grains.oats",
  barley: "food.grain.whole-grains.barley",
};

const RETAINED = [
  {
    protein_id: "food.protein.grains-wheat-protein.seitan",
    slug: "seitan",
    parent_group: "grains-wheat-protein",
    governance_rule: "PROTEIN-001",
    reason:
      "Canonical wheat-protein preparation per GRAIN_STARCH governance — seitan remains in Protein; Grain & Starch cross-reference only.",
    runtime_generate: true,
    editorial_generate: true,
    wine_generate: true,
    publication_mode: "active",
    redirect_required: false,
  },
  {
    protein_id: "food.protein.grains-wheat-protein.vital-wheat-gluten",
    slug: "vital-wheat-gluten",
    parent_group: "grains-wheat-protein",
    governance_rule: "PROTEIN-001",
    reason:
      "Vital wheat gluten is the seitan base — retained in Protein per GRAIN_STARCH governance §10.",
    runtime_generate: true,
    editorial_generate: true,
    wine_generate: true,
    publication_mode: "active",
    redirect_required: false,
  },
  {
    protein_id: "food.protein.soy-foods.soy-milk",
    slug: "soy-milk",
    parent_group: "soy-foods",
    governance_rule: "PROTEIN-001",
    reason:
      "No canonical legume catalog entity for soy milk at v2.0.0 — retained in Protein pending legume catalog extension.",
    runtime_generate: true,
    editorial_generate: true,
    wine_generate: true,
    publication_mode: "active",
    redirect_required: false,
    ownership_note: "unresolved_canonical_owner",
  },
];

const POSTER_SATISFIED = [
  {
    poster_concept: "Fish — tuna",
    protein_id: "food.protein.fin-fish.tuna-loin",
    also_satisfied_by: ["food.protein.fin-fish.tuna-steak"],
    governance_rule: "PROTEIN-003",
  },
  {
    poster_concept: "Fish — cod",
    protein_id: "food.protein.fin-fish.cod-fillet",
    governance_rule: "PROTEIN-003",
  },
  {
    poster_concept: "Fish — trout",
    protein_id: "food.protein.fin-fish.trout-fillet",
    governance_rule: "PROTEIN-003",
  },
  {
    poster_concept: "Fish — bass",
    protein_id: "food.protein.fin-fish.sea-bass-fillet",
    governance_rule: "PROTEIN-003",
  },
  {
    poster_concept: "Lobster & Shellfish — prawn",
    protein_id: "food.protein.crustaceans.prawn",
    governance_rule: "PROTEIN-003",
  },
  {
    poster_concept: "Lobster & Shellfish — crab",
    protein_id: "food.protein.crustaceans.crab",
    governance_rule: "PROTEIN-003",
  },
  {
    poster_concept: "Mollusks — oyster",
    protein_id: "food.protein.mollusks.oyster",
    governance_rule: "PROTEIN-003",
  },
  {
    poster_concept: "Mollusks — mussel",
    protein_id: "food.protein.mollusks.mussel",
    governance_rule: "PROTEIN-003",
  },
  {
    poster_concept: "Mollusks — clam",
    protein_id: "food.protein.mollusks.clam",
    governance_rule: "PROTEIN-003",
  },
  {
    poster_concept: "Cured Meat — bacon",
    protein_id: "food.protein.pork.bacon",
    governance_rule: "PROTEIN-004",
  },
  {
    poster_concept: "Cured Meat — ham",
    protein_id: "food.protein.pork.ham",
    governance_rule: "PROTEIN-004",
  },
  {
    poster_concept: "Cured Meat — pancetta",
    protein_id: "food.protein.pork.pancetta",
    governance_rule: "PROTEIN-004",
  },
];

const POSTER_ADDITIONS = [
  {
    id: "food.protein.cured-meat.salami",
    slug: "salami",
    name: "Salami",
    parent_group: "cured-meat",
    governance_rule: "PROTEIN-004",
    poster_concept: "Cured Meat — salami",
  },
  {
    id: "food.protein.cured-meat.prosciutto",
    slug: "prosciutto",
    name: "Prosciutto",
    parent_group: "cured-meat",
    governance_rule: "PROTEIN-004",
    poster_concept: "Cured Meat — prosciutto",
  },
  {
    id: "food.protein.crustaceans.langoustine",
    slug: "langoustine",
    name: "Langoustine",
    parent_group: "crustaceans",
    governance_rule: "PROTEIN-003",
    poster_concept: "Lobster & Shellfish — langoustine",
  },
];

function canonicalDomain(canonicalId) {
  const segment = canonicalId.split(".")[1];
  if (segment === "grain") return "grain-starch";
  return segment;
}

function canonicalPublicationPath(canonicalId) {
  const domain = canonicalDomain(canonicalId);
  const prefix = DOMAIN_PUBLICATION_PREFIX[domain];
  const slug = canonicalId.split(".").pop();
  return prefix ? `${prefix}${slug}/` : null;
}

function migrationEntry(entity, canonicalId) {
  const domain = canonicalDomain(canonicalId);
  return {
    legacy_id: entity.id,
    legacy_slug: entity.slug,
    legacy_group: entity.parent_group,
    canonical_id: canonicalId,
    canonical_domain: domain,
    status: "deprecated",
    governance_rule: "PROTEIN-001",
    redirect_required: true,
    legacy_publication_path: `/foods/${entity.slug}/`,
    canonical_publication_path: canonicalPublicationPath(canonicalId),
    runtime_generate: false,
    editorial_generate: false,
    wine_generate: false,
    publication_mode: "redirect",
  };
}

function buildMigrationMap(catalog) {
  const legacy = catalog.protein_foods.filter((e) => LEGACY_GROUPS.includes(e.parent_group));
  const retainedIds = new Set(RETAINED.map((r) => r.protein_id));
  const migrations = [];
  const unresolved = [];

  for (const entity of legacy) {
    if (retainedIds.has(entity.id)) continue;
    const canonicalId = CANONICAL_ID_BY_PROTEIN_SLUG[entity.slug];
    if (!canonicalId) {
      unresolved.push({ id: entity.id, slug: entity.slug, group: entity.parent_group });
      continue;
    }
    migrations.push(migrationEntry(entity, canonicalId));
  }

  migrations.sort((a, b) => a.legacy_id.localeCompare(b.legacy_id));

  return {
    meta: {
      phase: "FOOD-14B",
      version: "1.0.0",
      suite_baseline: "food-ontology-suite-v2.0.0",
      governance: "PROTEIN_REFINEMENT_GOVERNANCE.md v1.0.0",
      catalog_path: "data/protein-food-catalog.json",
    },
    migrations,
    retained: RETAINED,
    poster_satisfied: POSTER_SATISFIED,
    poster_additions: POSTER_ADDITIONS,
    unresolved,
  };
}

function auditMigrationMap(map, catalog) {
  const errors = [];
  const legacy = catalog.protein_foods.filter((e) => LEGACY_GROUPS.includes(e.parent_group));
  const canonicalTargets = new Map();

  for (const entry of map.migrations) {
    if (!entry.legacy_id || !entry.canonical_id) {
      errors.push(`Missing IDs on migration entry: ${entry.legacy_slug}`);
    }
    if (entry.status !== "deprecated") {
      errors.push(`Invalid status for migration: ${entry.legacy_id}`);
    }
    if (entry.runtime_generate !== false || entry.editorial_generate !== false || entry.wine_generate !== false) {
      errors.push(`PROTEIN-005 violation: ${entry.legacy_id} must not generate layers`);
    }
    const list = canonicalTargets.get(entry.canonical_id) ?? [];
    list.push(entry.legacy_id);
    canonicalTargets.set(entry.canonical_id, list);
  }

  const duplicateCanonicalTargets = [...canonicalTargets.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([canonical_id, legacy_ids]) => ({ canonical_id, legacy_ids }));

  if (map.unresolved.length) {
    errors.push(`Unresolved legacy entities: ${map.unresolved.map((u) => u.slug).join(", ")}`);
  }

  const expectedMigrations = legacy.length - map.retained.length;
  if (map.migrations.length !== expectedMigrations) {
    errors.push(
      `Migration count mismatch: expected ${expectedMigrations}, got ${map.migrations.length}`
    );
  }

  const redirectCount = map.migrations.filter((m) => m.redirect_required).length;
  const overall = errors.length === 0 ? "PASS" : "FAIL";

  return {
    phase: "FOOD-14B",
    domain: "protein",
    overall_result: overall,
    validation_errors: errors,
    metrics: {
      "Legacy entities audited": legacy.length,
      "Total migrations": map.migrations.length,
      "Entities retained in Protein": map.retained.length,
      "Poster additions planned": map.poster_additions.length,
      "Poster concepts satisfied": map.poster_satisfied.length,
      "One-to-one canonical mapping": map.unresolved.length === 0 ? "PASS" : "FAIL",
      "Duplicate canonical targets": duplicateCanonicalTargets.length,
      "Unresolved ownership conflicts": map.unresolved.length,
      "Redirect count": redirectCount,
      "Overall result": overall,
    },
    duplicate_canonical_targets: duplicateCanonicalTargets,
    retained_entities: map.retained.map((r) => r.protein_id),
    governance_rules: {
      PROTEIN001: "Ownership transfer — canonical owner wins",
      PROTEIN005: "Deprecated entities excluded from runtime, editorial, and wine generation",
    },
    output: "data/protein-migration-map.json",
  };
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
const map = buildMigrationMap(catalog);
const report = auditMigrationMap(map, catalog);

fs.writeFileSync(MAP_PATH, `${JSON.stringify(map, null, 2)}\n`, "utf8");
fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify(report.metrics, null, 2));
console.log(`Migration map: ${MAP_PATH}`);
console.log(`Audit report: ${REPORT_PATH}`);

if (report.overall_result === "FAIL") {
  console.error(report.validation_errors.join("\n"));
  process.exit(1);
}
