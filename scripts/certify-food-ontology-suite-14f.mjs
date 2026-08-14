#!/usr/bin/env node
/**
 * FOOD-14F — Food Ontology Suite v2.1.0 release certification.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  SUITE_VERSION,
  SUITE_TAG,
  FROZEN_CHECKPOINTS,
  FROZEN_LAYER_PATHS,
  PUBLICATION_ARTIFACT_PATHS,
  hashMap,
  verifyFrozenLayers,
  verifyCanonicalLayers,
  buildReleaseManifest,
  renderCertificationMarkdown,
  loadJson,
} from "../lib/suite/foodOntologySuite14f.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASELINE_PATH = path.join(ROOT, "reports/food-ontology-suite-v2.1.0-baseline.json");
const JSON_PATH = path.join(ROOT, "reports/food-ontology-suite-v2.1.0-certification.json");
const MD_PATH = path.join(ROOT, "reports/food-ontology-suite-v2.1.0-certification.md");
const MANIFEST_PATH = path.join(ROOT, "reports/food-ontology-suite-v2.1.0-release-manifest.json");

function readReport(relativePath) {
  const absolute = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolute)) return null;
  return JSON.parse(fs.readFileSync(absolute, "utf8"));
}

function main() {
  const errors = [];
  const baseline = fs.existsSync(BASELINE_PATH)
    ? JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"))
    : null;

  if (!baseline) {
    errors.push("Missing publication baseline — run generate-publication-assets-14f first");
  } else {
    verifyFrozenLayers(ROOT, baseline, errors);
  }

  const canonical = verifyCanonicalLayers(ROOT, errors);

  const publicationReport = readReport("reports/publication-certification-report.json");
  const releaseReport = readReport("reports/release-certification-report.json");
  const publicationRegenerated =
    publicationReport?.overall_certification === "PASS" &&
    releaseReport?.overall_result === "PASS";

  if (!publicationRegenerated) {
    errors.push("Publication or release certification did not PASS");
  }

  const publicationHashesBefore = baseline?.frozen_layer_hashes ?? {};
  const publicationChanged = PUBLICATION_ARTIFACT_PATHS.some((relativePath) => {
    const before = publicationHashesBefore[relativePath];
    const after = hashMap(ROOT, [relativePath])[relativePath];
    return before && after && before !== after;
  });

  const checks = {
    runtime_canonical: canonical.deprecated_in_runtime === 0 ? "PASS" : "FAIL",
    editorial_canonical: canonical.editorialValidation.deprecatedEndpoints === 0 ? "PASS" : "FAIL",
    wine_pairing_canonical: canonical.pairingValidation.deprecatedEndpoints === 0 ? "PASS" : "FAIL",
    ownership_integrity: canonical.duplicate_canonical_ids === 0 ? "PASS" : "FAIL",
    deprecated_ids: canonical.deprecated_in_runtime === 0 ? "PASS" : "FAIL",
    orphan_references:
      canonical.editorialValidation.orphanReferences === 0 &&
      canonical.pairingValidation.orphanReferences === 0
        ? "PASS"
        : "FAIL",
    duplicate_canonical_ids: canonical.duplicate_canonical_ids === 0 ? "PASS" : "FAIL",
    publication_regenerated: publicationRegenerated ? "PASS" : "FAIL",
    deterministic_build: releaseReport?.metrics?.["Overall result"] === "PASS" ? "PASS" : "FAIL",
    runtime_modified: errors.some((error) => error.startsWith("Frozen layer modified")) ? "true" : "false",
    editorial_modified: errors.some((error) => error.includes("protein-food-editorial")) ? "true" : "false",
    pairing_modified: errors.some((error) => error.includes("protein-food-wine")) ? "true" : "false",
    overall_certification: "PENDING",
  };

  const overall =
    Object.entries(checks)
      .filter(([key]) => !key.endsWith("_modified") && key !== "overall_certification")
      .every(([, value]) => value === "PASS" || value === "false") && errors.length === 0
      ? "PASS"
      : "FAIL";
  checks.overall_certification = overall;

  const certification = {
    phase: "FOOD-14F",
    suite_version: SUITE_VERSION,
    suite_tag: SUITE_TAG,
    frozen_checkpoints: FROZEN_CHECKPOINTS,
    checks,
    metrics: {
      catalog_entities: canonical.catalog_entities,
      runtime_active_entities: canonical.runtime_active_entities,
      deprecated_excluded: loadJson(ROOT, "data/runtime/protein-food-index.json").meta?.deprecated_excluded,
      editorial_edges: loadJson(ROOT, "data/runtime/protein-food-editorial-relationships.json").meta?.edge_count,
      pairing_edges: loadJson(ROOT, "data/runtime/protein-food-wine-relationships.json").meta?.edge_count,
      publication_pages: releaseReport?.metrics?.["HTML pages"] ?? null,
      redirect_entries: canonical.redirect_entries,
      publication_artifacts_changed: publicationChanged,
    },
    publication_reports: {
      publication: "reports/publication-certification-report.json",
      release: "reports/release-certification-report.json",
      publication_generation: "reports/food-ontology-suite-v2.1.0-publication-report.json",
    },
    overall,
    errors,
  };

  const manifest = {
    ...buildReleaseManifest(ROOT, baseline ?? {}),
    certification: overall,
    checks,
  };

  fs.mkdirSync(path.dirname(JSON_PATH), { recursive: true });
  fs.writeFileSync(JSON_PATH, `${JSON.stringify(certification, null, 2)}\n`, "utf8");
  fs.writeFileSync(MD_PATH, renderCertificationMarkdown(certification));
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(JSON.stringify({ checks, overall, errors }, null, 2));
  console.log(`Certification JSON: ${JSON_PATH}`);
  console.log(`Certification MD: ${MD_PATH}`);
  console.log(`Release manifest: ${MANIFEST_PATH}`);

  if (overall !== "PASS") {
    console.error(errors.join("\n"));
    process.exit(1);
  }
}

main();
