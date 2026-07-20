#!/usr/bin/env node
/**
 * FOOD-08C.2 — Runtime validator for grain & starch bootstrap artifacts.
 * Structural verification only: no catalog writes, no repairs, no relationships.
 *
 * Run: node scripts/validate-runtime-grain-starch-08c.mjs
 * Output: reports/grain-starch-runtime-validator-report.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  ARTIFACTS,
  VOCAB_FIELDS,
  VOCAB,
  RESERVED_PROFILE_FIELDS,
  fieldValue,
  serializeRuntime,
  compileGrainStarchRuntime,
} from "./bootstrap-grain-starch-runtime.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/grain-starch-catalog.json");
const REPORT_PATH = path.join(ROOT, "reports/grain-starch-runtime-validator-report.json");

const ARTIFACT_BUILDERS = {
  "grain-starch-bootstrap.json": (built) => built.bootstrapDoc,
  "grain-starch-categories.json": (built) => built.categoriesOut,
  "grain-starch-groups.json": (built) => built.groupsOut,
  "grain-starch-indexes.json": (built) => built.indexesDoc,
};

const PROC_SEPARATED = [
  { slug: "wheat", group: "whole-grains", partner: "wheat-flour", partnerGroup: "processed-grains" },
  { slug: "rice", group: "whole-grains", partner: "rice-flour", partnerGroup: "processed-grains" },
  { slug: "corn", group: "whole-grains", partner: "cornmeal", partnerGroup: "processed-grains" },
  {
    slug: "corn",
    group: "whole-grains",
    partner: "cornstarch",
    partnerGroup: "starches",
  },
  {
    slug: "cornmeal",
    group: "processed-grains",
    partner: "cornstarch",
    partnerGroup: "starches",
  },
];

const CROSS_DOMAIN_FORBIDDEN_SLUGS = ["potato", "sweet-corn", "mustard-seed", "soybean"];

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

function writeReport(report) {
  const text = `${JSON.stringify(sortKeysDeep(report), null, 2)}\n`;
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, text, "utf8");
}

function loadRuntimeArtifacts() {
  const loaded = {};
  for (const name of ARTIFACTS) {
    const filePath = path.join(RUNTIME_DIR, name);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing runtime artifact: data/runtime/${name}`);
    }
    loaded[name] = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  return loaded;
}

function validateIdentity({ byId, bySlug, errors, checks }) {
  let passed = 0;
  const ids = Object.keys(byId);
  const slugs = Object.keys(bySlug);

  if (ids.length !== new Set(ids).size) errors.push("Identity: duplicate ontology IDs in by_id");
  else passed += 1;

  if (slugs.length !== new Set(slugs).size) errors.push("Identity: duplicate slugs in by_slug");
  else passed += 1;

  const slugToIdValues = Object.values(bySlug);
  if (slugToIdValues.length !== new Set(slugToIdValues).size) {
    errors.push("Identity: by_slug resolves multiple slugs to the same ID inconsistently");
  } else passed += 1;

  for (const id of ids) {
    const ref = byId[id];
    if (ref.id !== id) errors.push(`Identity: by_id entry ${id} has mismatched id field ${ref.id}`);
    if (!bySlug[ref.slug]) errors.push(`Identity: by_id entry ${id} slug ${ref.slug} missing from by_slug`);
    else if (bySlug[ref.slug] !== id) {
      errors.push(`Identity: by_slug ${ref.slug} points to ${bySlug[ref.slug]}, expected ${id}`);
    }
  }
  if (!errors.some((e) => e.startsWith("Identity: by_id entry"))) passed += 1;

  for (const [slug, id] of Object.entries(bySlug)) {
    const ref = byId[id];
    if (!ref) {
      errors.push(`Identity: slug ${slug} resolves to missing id ${id}`);
      continue;
    }
    if (ref.slug !== slug) {
      errors.push(`Identity: by_slug ${slug} -> ${id} but entity slug is ${ref.slug}`);
    }
  }
  if (!errors.some((e) => e.startsWith("Identity: slug") || e.startsWith("Identity: by_slug"))) passed += 1;

  if (ids.length !== slugToIdValues.length) {
    errors.push(`Identity: by_id count ${ids.length} != by_slug target count ${slugToIdValues.length}`);
  } else passed += 1;

  checks.identity = passed;
  return passed;
}

function validateHierarchy({ bootstrap, categories, groups, bySlug, byId, errors, checks }) {
  let passed = 0;
  const groupSlugs = new Set(groups.map((g) => g.slug));
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const { category_to_groups, group_to_category, group_to_grain_starches, grain_starch_to_group } =
    bootstrap.hierarchy;

  for (const cat of categories) {
    for (const groupSlug of cat.group_slugs) {
      if (!groupSlugs.has(groupSlug)) {
        errors.push(`Hierarchy: category ${cat.slug} references missing group ${groupSlug}`);
      }
    }
    const indexed = category_to_groups[cat.slug] ?? [];
    if (JSON.stringify([...indexed].sort()) !== JSON.stringify([...cat.group_slugs].sort())) {
      errors.push(`Hierarchy: category ${cat.slug} group_slugs mismatch with bootstrap`);
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: category"))) passed += 1;

  for (const group of groups) {
    for (const grainStarchSlug of group.grain_starch_slugs) {
      if (!bySlug[grainStarchSlug]) {
        errors.push(
          `Hierarchy: group ${group.slug} references missing grain_starch slug ${grainStarchSlug}`
        );
      }
    }
    const expectedIds = group.grain_starch_slugs.map((s) => bySlug[s]).filter(Boolean).sort();
    if (JSON.stringify(group.grain_starch_ids) !== JSON.stringify(expectedIds)) {
      errors.push(`Hierarchy: group ${group.slug} grain_starch_ids mismatch grain_starch_slugs`);
    }
    const indexedGrainStarches = group_to_grain_starches[group.slug] ?? [];
    if (JSON.stringify(indexedGrainStarches) !== JSON.stringify(expectedIds)) {
      errors.push(`Hierarchy: group ${group.slug} bootstrap grain_starch list mismatch`);
    }
    if (group_to_category[group.slug] !== group.parent_category) {
      errors.push(`Hierarchy: group ${group.slug} parent_category mismatch in bootstrap`);
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: group"))) passed += 1;

  for (const [grainStarchSlug, parentGroup] of Object.entries(grain_starch_to_group)) {
    if (!bySlug[grainStarchSlug]) {
      errors.push(`Hierarchy: grain_starch_to_group references unknown slug ${grainStarchSlug}`);
      continue;
    }
    if (!groupSlugs.has(parentGroup)) {
      errors.push(`Hierarchy: grain_starch ${grainStarchSlug} parent group ${parentGroup} missing`);
      continue;
    }
    const ref = byId[bySlug[grainStarchSlug]];
    if (ref.parent_group !== parentGroup) {
      errors.push(
        `Hierarchy: grain_starch ${grainStarchSlug} parent_group ${ref.parent_group} != index ${parentGroup}`
      );
    }
    const group = groups.find((g) => g.slug === parentGroup);
    if (group && !group.grain_starch_slugs.includes(grainStarchSlug)) {
      errors.push(
        `Hierarchy: reciprocal failure — ${grainStarchSlug} not in group ${parentGroup} grain_starch_slugs`
      );
    }
  }
  if (
    !errors.some(
      (e) => e.startsWith("Hierarchy: grain_starch") || e.startsWith("Hierarchy: reciprocal")
    )
  ) {
    passed += 1;
  }

  for (const [catSlug, groupList] of Object.entries(category_to_groups)) {
    if (!categorySlugs.has(catSlug)) {
      errors.push(`Hierarchy: bootstrap category ${catSlug} not in categories artifact`);
    }
    for (const g of groupList) {
      if (group_to_category[g] !== catSlug) {
        errors.push(`Hierarchy: group ${g} parent ${group_to_category[g]} != category ${catSlug}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Hierarchy: bootstrap category"))) passed += 1;

  checks.hierarchy = passed;
  return passed;
}

function validateUsageIntensity({ byUsageIntensity, byId, errors, checks }) {
  let passed = 0;

  for (const [intensity, ids] of Object.entries(byUsageIntensity)) {
    for (const id of ids) {
      if (!byId[id]) errors.push(`Usage intensity: ${intensity} references missing entity ${id}`);
      else if (byId[id].usage_intensity !== intensity) {
        errors.push(
          `Usage intensity: ${id} indexed under ${intensity} but entity usage_intensity is ${byId[id].usage_intensity}`
        );
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Usage intensity:") && e.includes("references"))) passed += 1;

  for (const [id, ref] of Object.entries(byId)) {
    const bucket = byUsageIntensity[ref.usage_intensity] ?? [];
    if (!bucket.includes(id)) {
      errors.push(
        `Usage intensity: entity ${id} usage_intensity ${ref.usage_intensity} missing from by_usage_intensity`
      );
    }
  }
  if (!errors.some((e) => e.startsWith("Usage intensity: entity"))) passed += 1;

  checks.usage_intensity = passed;
  return passed;
}

function validateByGroup({ byGroup, byId, groups, errors, checks }) {
  let passed = 0;

  for (const group of groups) {
    const expected = group.grain_starch_ids.sort();
    const indexed = (byGroup[group.slug] ?? []).slice().sort();
    if (JSON.stringify(indexed) !== JSON.stringify(expected)) {
      errors.push(`By group: ${group.slug} index mismatch with group grain_starch_ids`);
    }
  }
  if (!errors.some((e) => e.startsWith("By group:"))) passed += 1;

  for (const [groupSlug, ids] of Object.entries(byGroup)) {
    for (const id of ids) {
      if (!byId[id]) errors.push(`By group: ${groupSlug} references missing entity ${id}`);
      else if (byId[id].parent_group !== groupSlug) {
        errors.push(`By group: ${id} indexed under ${groupSlug} but parent_group is ${byId[id].parent_group}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("By group:") && e.includes("references"))) passed += 1;

  checks.by_group = passed;
  return passed;
}

function validateScientificName({ byScientificName, byId, errors, checks }) {
  let passed = 0;

  for (const [sciName, ids] of Object.entries(byScientificName)) {
    for (const id of ids) {
      if (!byId[id]) errors.push(`Scientific: ${sciName} references missing entity ${id}`);
      else if (byId[id].scientific_name !== sciName) {
        errors.push(`Scientific: ${id} indexed under ${sciName} but entity has ${byId[id].scientific_name}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Scientific:") && e.includes("references"))) passed += 1;

  for (const [id, ref] of Object.entries(byId)) {
    if (ref.scientific_name) {
      const bucket = byScientificName[ref.scientific_name] ?? [];
      if (!bucket.includes(id)) {
        errors.push(`Scientific: entity ${id} scientific_name ${ref.scientific_name} missing from by_scientific_name`);
      }
    }
  }
  if (!errors.some((e) => e.includes("missing from by_scientific_name"))) passed += 1;

  checks.scientific_name = passed;
  return passed;
}

function validateVocabulary({ vocabularyIndex, byId, errors, checks }) {
  let passed = 0;

  for (const field of VOCAB_FIELDS) {
    const fieldIndex = vocabularyIndex[field] ?? {};
    for (const [value, ids] of Object.entries(fieldIndex)) {
      if (VOCAB[field] && !VOCAB[field].has(value)) {
        errors.push(`Vocabulary: unexpected ${field} value "${value}"`);
      }
      for (const id of ids) {
        if (!byId[id]) errors.push(`Vocabulary: ${field}/${value} references missing entity ${id}`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Vocabulary: unexpected") || e.includes("references missing"))) {
    passed += 1;
  }

  for (const [id, ref] of Object.entries(byId)) {
    for (const field of VOCAB_FIELDS) {
      const val = fieldValue(ref, field);
      const bucket = vocabularyIndex[field]?.[val] ?? [];
      if (!bucket.includes(id)) {
        errors.push(`Vocabulary: entity ${id} missing from ${field} index key "${val}"`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Vocabulary: entity"))) passed += 1;

  checks.vocabulary = passed;
  return passed;
}

function validateCrossIndex({
  bootstrap,
  groups,
  bySlug,
  byId,
  byUsageIntensity,
  byGroup,
  vocabularyIndex,
  errors,
  checks,
}) {
  let passed = 0;
  const allIds = new Set(Object.keys(byId));

  for (const group of groups) {
    for (const id of group.grain_starch_ids) {
      const ref = byId[id];
      if (!ref) {
        errors.push(`Cross-index: group ${group.slug} grain_starch_id ${id} missing from by_id`);
        continue;
      }
      if (bySlug[ref.slug] !== id) errors.push(`Cross-index: group grain_starch ${id} by_slug mismatch`);
      if (bootstrap.hierarchy.grain_starch_to_group[ref.slug] !== group.slug) {
        errors.push(`Cross-index: group ${group.slug} grain_starch ${ref.slug} hierarchy mismatch`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Cross-index: group"))) passed += 1;

  for (const ids of Object.values(byUsageIntensity)) {
    for (const id of ids) {
      if (!allIds.has(id)) errors.push(`Cross-index: by_usage_intensity entity ${id} missing from by_id`);
    }
  }
  if (!errors.some((e) => e.startsWith("Cross-index: by_usage_intensity"))) passed += 1;

  for (const ids of Object.values(byGroup)) {
    for (const id of ids) {
      if (!allIds.has(id)) errors.push(`Cross-index: by_group entity ${id} missing from by_id`);
    }
  }
  if (!errors.some((e) => e.startsWith("Cross-index: by_group"))) passed += 1;

  for (const field of VOCAB_FIELDS) {
    for (const ids of Object.values(vocabularyIndex[field] ?? {})) {
      for (const id of ids) {
        if (!allIds.has(id)) {
          errors.push(`Cross-index: vocabulary ${field} entity ${id} missing from by_id`);
        }
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Cross-index: vocabulary"))) passed += 1;

  checks.cross_index = passed;
  return passed;
}

function validateNamespace({ byNamespace, categories, groups, byId, errors, checks }) {
  let passed = 0;
  const categoryIds = categories.map((c) => c.id);
  const nsCategory = byNamespace["food.grain"] ?? [];

  if (JSON.stringify(nsCategory) !== JSON.stringify(categoryIds.sort())) {
    errors.push("Namespace: food.grain namespace mismatch with categories");
  } else passed += 1;

  for (const group of groups) {
    const expected = group.grain_starch_ids.sort();
    const actual = byNamespace[group.id] ?? [];
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      errors.push(`Namespace: ${group.id} namespace mismatch with group grain_starch_ids`);
    }
  }
  if (!errors.some((e) => e.startsWith("Namespace:") && e.includes("namespace mismatch"))) passed += 1;

  for (const ids of Object.values(byNamespace)) {
    for (const id of ids) {
      if (id === "food.grain") continue;
      if (!byId[id] && !categories.some((c) => c.id === id) && !groups.some((g) => g.id === id)) {
        errors.push(`Namespace: unknown entity ${id} in by_namespace`);
      }
    }
  }
  if (!errors.some((e) => e.startsWith("Namespace: unknown"))) passed += 1;

  checks.namespace = passed;
  return passed;
}

function validateProcessingOwnership({ byId, bySlug, errors, checks }) {
  let passed = 0;

  for (const slug of CROSS_DOMAIN_FORBIDDEN_SLUGS) {
    if (bySlug[slug]) {
      errors.push(`PROC-001 / cross-domain: forbidden runtime entity slug ${slug}`);
    }
  }

  if (!bySlug["potato-starch"]) {
    errors.push("PROC-001: runtime missing potato-starch canonical entity");
  }

  for (const rule of PROC_SEPARATED) {
    const idA = bySlug[rule.slug];
    const idB = bySlug[rule.partner];
    if (!idA) errors.push(`PROC-001: missing canonical entity ${rule.slug}`);
    if (!idB) errors.push(`PROC-001: missing canonical entity ${rule.partner}`);
    if (idA && idB) {
      if (idA === idB) {
        errors.push(`PROC-001: ${rule.slug} and ${rule.partner} collapsed to same canonical ID`);
      }
      const refA = byId[idA];
      const refB = byId[idB];
      if (refA && refA.parent_group !== rule.group) {
        errors.push(`PROC-001: ${rule.slug} must be in ${rule.group}, got ${refA.parent_group}`);
      }
      if (refB && refB.parent_group !== rule.partnerGroup) {
        errors.push(
          `PROC-001: ${rule.partner} must be in ${rule.partnerGroup}, got ${refB.parent_group}`
        );
      }
    }
  }

  if (!errors.some((e) => e.startsWith("PROC-001") || e.includes("cross-domain"))) passed += 1;
  checks.processing_ownership = passed;
  return passed;
}

function validateDeterminism(loaded, errors, checks) {
  let passed = 0;
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const rebuilt = compileGrainStarchRuntime(catalog);

  for (const name of ARTIFACTS) {
    const expected = serializeRuntime(loaded[name]);
    const actual = serializeRuntime(ARTIFACT_BUILDERS[name](rebuilt));
    if (expected !== actual) {
      errors.push(`Determinism: ${name} differs from catalog recompilation`);
    }
  }

  if (!errors.some((e) => e.startsWith("Determinism:"))) {
    passed = ARTIFACTS.length;
  }

  checks.determinism = passed;
  return passed;
}

function main() {
  const errors = [];
  const warnings = [];
  const checks = {
    identity: 0,
    hierarchy: 0,
    usage_intensity: 0,
    by_group: 0,
    scientific_name: 0,
    vocabulary: 0,
    cross_index: 0,
    namespace: 0,
    processing_ownership: 0,
    determinism: 0,
  };

  let loaded;
  try {
    loaded = loadRuntimeArtifacts();
  } catch (err) {
    const report = {
      phase: "FOOD-08C.2",
      domain: "grain-starch",
      overall_result: "FAIL",
      errors: [err.message],
      warnings: [],
      metrics: {
        "Runtime artifacts checked": 0,
        Errors: 1,
        Warnings: 0,
        "Overall result": "FAIL",
      },
    };
    writeReport(report);
    console.error(err.message);
    process.exit(1);
  }

  const bootstrap = loaded["grain-starch-bootstrap.json"];
  const categories = loaded["grain-starch-categories.json"];
  const groups = loaded["grain-starch-groups.json"];
  const indexes = loaded["grain-starch-indexes.json"];
  const byId = indexes.by_id;
  const bySlug = indexes.by_slug;
  const byUsageIntensity = indexes.by_usage_intensity;
  const byGroup = indexes.by_group;
  const byScientificName = indexes.by_scientific_name;
  const byNamespace = indexes.by_namespace;
  const vocabularyIndex = indexes.vocabulary;

  validateIdentity({ byId, bySlug, errors, checks });
  validateHierarchy({ bootstrap, categories, groups, bySlug, byId, errors, checks });
  validateUsageIntensity({ byUsageIntensity, byId, errors, checks });
  validateByGroup({ byGroup, byId, groups, errors, checks });
  validateScientificName({ byScientificName, byId, errors, checks });
  validateVocabulary({ vocabularyIndex, byId, errors, checks });
  validateCrossIndex({
    bootstrap,
    groups,
    bySlug,
    byId,
    byUsageIntensity,
    byGroup,
    vocabularyIndex,
    errors,
    checks,
  });
  validateNamespace({ byNamespace, categories, groups, byId, errors, checks });
  validateProcessingOwnership({ byId, bySlug, errors, checks });
  validateDeterminism(loaded, errors, checks);

  const overall = errors.length === 0 ? "PASS" : "FAIL";
  const report = {
    phase: "FOOD-08C.2",
    domain: "grain-starch",
    catalog_version: bootstrap.meta?.catalog_version ?? null,
    overall_result: overall,
    errors,
    warnings,
    artifacts: ARTIFACTS.map((name) => `data/runtime/${name}`),
    metrics: {
      "Runtime artifacts checked": ARTIFACTS.length,
      "Identity checks": checks.identity,
      "Hierarchy checks": checks.hierarchy,
      "Usage intensity checks": checks.usage_intensity,
      "By group checks": checks.by_group,
      "Scientific name checks": checks.scientific_name,
      "Vocabulary checks": checks.vocabulary,
      "Cross-index checks": checks.cross_index,
      "Namespace checks": checks.namespace,
      "Processing ownership checks": checks.processing_ownership,
      "Determinism checks": checks.determinism,
      Errors: errors.length,
      Warnings: warnings.length,
      "Overall result": overall,
    },
  };

  writeReport(report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${REPORT_PATH}`);

  if (overall === "FAIL") {
    console.error(errors.join("\n"));
    process.exit(1);
  }
}

main();
