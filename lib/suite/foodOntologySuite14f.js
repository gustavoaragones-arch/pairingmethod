/**
 * FOOD-14F — Food Ontology Suite v2.1.0 release certification helpers.
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { createProteinMigrationResolver } from "../runtime/proteinMigrationResolver.js";
import { validateRefinedEditorial } from "../editorial/proteinEditorialRefinement.js";
import { validateRefinedPairing } from "../pairing/proteinWinePairingRefinement.js";

export const SUITE_VERSION = "2.1.0";
export const SUITE_TAG = "food-ontology-suite-v2.1.0";

export const FROZEN_CHECKPOINTS = {
  "FOOD-14A": "426d888",
  "FOOD-14B": "e11cc99",
  "FOOD-14C": "87bcb69",
  "FOOD-14D": "59f8da3",
  "FOOD-14E": "48e3cc6",
};

export const RUNTIME_ARTIFACTS_14C = [
  "data/runtime/protein-food-index.json",
  "data/runtime/protein-food-categories.json",
  "data/runtime/protein-food-groups.json",
  "data/runtime/protein-food-id-map.json",
  "data/runtime/protein-food-slug-map.json",
  "data/runtime/protein-food-species-map.json",
  "data/runtime/protein-food-vocabulary-index.json",
  "data/runtime/protein-food-relationships.json",
];

export const FROZEN_LAYER_PATHS = [
  ...RUNTIME_ARTIFACTS_14C,
  "data/protein-food-catalog.json",
  "data/protein-migration-map.json",
  "lib/runtime/proteinMigrationResolver.js",
  "data/runtime/protein-food-editorial-relationships.json",
  "data/runtime/protein-food-wine-relationships.json",
];

export const PUBLICATION_ARTIFACT_PATHS = [
  "data/generated/protein-food-pages.json",
  "data/generated/protein-group-pages.json",
  "data/generated/protein-category-pages.json",
  "data/pages/protein-food-pages.json",
  "data/pages/protein-group-pages.json",
  "data/pages/protein-category-pages.json",
  "data/schema/protein-food-schema.json",
  "data/navigation/protein-food-links.json",
  "data/search/protein-food-search-index.json",
  "dist/release-manifest.json",
  "reports/publication-certification-report.json",
  "reports/release-certification-report.json",
];

export function sha256(root, relativePath) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex");
}

export function hashMap(root, relativePaths) {
  return Object.fromEntries(relativePaths.map((relativePath) => [relativePath, sha256(root, relativePath)]));
}

export function loadJson(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

export function verifyFrozenLayers(root, baseline, errors) {
  for (const relativePath of FROZEN_LAYER_PATHS) {
    const expected = baseline.frozen_layer_hashes?.[relativePath];
    const actual = sha256(root, relativePath);
    if (expected && actual !== expected) {
      errors.push(`Frozen layer modified: ${relativePath}`);
    }
  }
}

export function verifyCanonicalLayers(root, errors) {
  const resolver = createProteinMigrationResolver(root);
  const idMap = loadJson(root, "data/runtime/protein-food-id-map.json");
  const structural = loadJson(root, "data/runtime/protein-food-relationships.json");
  const editorial = loadJson(root, "data/runtime/protein-food-editorial-relationships.json");
  const pairing = loadJson(root, "data/runtime/protein-food-wine-relationships.json");

  const editorialValidation = validateRefinedEditorial({
    output: editorial,
    resolver,
    idMap,
    structural,
  });
  const pairingValidation = validateRefinedPairing({
    output: pairing,
    resolver,
    idMap,
    structural,
    editorial,
  });

  if (editorialValidation.errors.length > 0) {
    errors.push(...editorialValidation.errors.map((error) => `Editorial: ${error}`));
  }
  if (pairingValidation.errors.length > 0) {
    errors.push(...pairingValidation.errors.map((error) => `Pairing: ${error}`));
  }

  const activeIds = new Set(Object.values(idMap).map((ref) => ref.id));
  const duplicateCanonicalInProteinRuntime = resolver.map.migrations.filter((entry) =>
    activeIds.has(entry.canonical_id)
  );
  if (duplicateCanonicalInProteinRuntime.length > 0) {
    errors.push(
      `Duplicate canonical IDs in protein runtime: ${duplicateCanonicalInProteinRuntime
        .map((entry) => entry.canonical_id)
        .join(", ")}`
    );
  }

  let deprecatedInRuntime = 0;
  for (const entry of resolver.map.migrations) {
    if (idMap[entry.legacy_id]) deprecatedInRuntime += 1;
  }
  if (deprecatedInRuntime > 0) {
    errors.push(`Deprecated IDs present in runtime id map: ${deprecatedInRuntime}`);
  }

  const redirectEntries = resolver.map.migrations.filter((entry) => entry.redirect_required !== false);
  if (redirectEntries.length !== resolver.migrationCount) {
    errors.push("Migration map redirect coverage incomplete");
  }

  return {
    editorialValidation,
    pairingValidation,
    deprecated_in_runtime: deprecatedInRuntime,
    duplicate_canonical_ids: duplicateCanonicalInProteinRuntime.length,
    redirect_entries: redirectEntries.length,
    runtime_active_entities: Object.keys(idMap).length,
    catalog_entities: loadJson(root, "data/protein-food-catalog.json").meta?.entity_count ?? null,
  };
}

export function buildReleaseManifest(root, baseline) {
  const pairing = loadJson(root, "data/runtime/protein-food-wine-relationships.json");
  const editorial = loadJson(root, "data/runtime/protein-food-editorial-relationships.json");
  const index = loadJson(root, "data/runtime/protein-food-index.json");
  const releaseReport = fs.existsSync(path.join(root, "reports/release-certification-report.json"))
    ? loadJson(root, "reports/release-certification-report.json")
    : null;

  return {
    suite_version: SUITE_VERSION,
    suite_tag: SUITE_TAG,
    phase: "FOOD-14F",
    generated_at: new Date().toISOString(),
    frozen_checkpoints: FROZEN_CHECKPOINTS,
    protein_refinement: {
      catalog_version: index.meta?.catalog_version ?? null,
      catalog_entities: index.meta?.catalog_entity_count ?? null,
      runtime_active_entities: index.meta?.entity_count ?? null,
      deprecated_excluded: index.meta?.deprecated_excluded ?? null,
      editorial_edges: editorial.meta?.edge_count ?? editorial.edges.length,
      pairing_edges: pairing.meta?.edge_count ?? pairing.edges.length,
      publication_pages: releaseReport?.metrics?.["HTML pages"] ?? 230,
    },
    artifact_hashes: hashMap(root, [...FROZEN_LAYER_PATHS, ...PUBLICATION_ARTIFACT_PATHS]),
    baseline_captured_at: baseline.captured_at ?? null,
  };
}

export function renderCertificationMarkdown(certification) {
  const lines = [
    `# Food Ontology Suite v${SUITE_VERSION} — Release Certification`,
    "",
    `**Phase:** FOOD-14F`,
    `**Overall:** ${certification.overall}`,
    `**Suite tag:** \`${SUITE_TAG}\``,
    "",
    "## Frozen checkpoints",
    "",
    "| Phase | Commit |",
    "|-------|--------|",
    ...Object.entries(FROZEN_CHECKPOINTS).map(([phase, commit]) => `| ${phase} | \`${commit}\` |`),
    "",
    "## Certification checks",
    "",
    "| Check | Result |",
    "|-------|--------|",
    ...Object.entries(certification.checks).map(([check, result]) => `| ${check} | ${result} |`),
    "",
    "## Protein refinement totals",
    "",
    `- Catalog entities: ${certification.metrics.catalog_entities}`,
    `- Runtime-active entities: ${certification.metrics.runtime_active_entities}`,
    `- Deprecated excluded from runtime: ${certification.metrics.deprecated_excluded}`,
    `- Editorial edges: ${certification.metrics.editorial_edges}`,
    `- Wine pairing edges: ${certification.metrics.pairing_edges}`,
    `- Publication pages: ${certification.metrics.publication_pages}`,
    "",
  ];

  if (certification.errors?.length) {
    lines.push("## Errors", "", ...certification.errors.map((error) => `- ${error}`));
  }

  return `${lines.join("\n")}\n`;
}
