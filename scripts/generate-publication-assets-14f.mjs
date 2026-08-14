#!/usr/bin/env node
/**
 * FOOD-14F — Regenerate Protein publication assets from frozen canonical layers.
 * Does not recompile runtime, editorial, or pairing artifacts.
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  FROZEN_LAYER_PATHS,
  hashMap,
  verifyFrozenLayers,
} from "../lib/suite/foodOntologySuite14f.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASELINE_PATH = path.join(ROOT, "reports/food-ontology-suite-v2.1.0-baseline.json");
const REPORT_PATH = path.join(ROOT, "reports/food-ontology-suite-v2.1.0-publication-report.json");

function runNpm(script) {
  const result = spawnSync("npm", ["run", script], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(`${script} failed:\n${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function main() {
  const baseline = {
    phase: "FOOD-14F",
    captured_at: new Date().toISOString(),
    frozen_layer_hashes: hashMap(ROOT, FROZEN_LAYER_PATHS),
  };
  fs.mkdirSync(path.dirname(BASELINE_PATH), { recursive: true });
  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`, "utf8");

  runNpm("generate:protein-food-publication");
  runNpm("generate:protein-food-html");
  runNpm("generate:protein-food-sitemap");
  runNpm("certify:protein-food-release");

  const errors = [];
  verifyFrozenLayers(ROOT, baseline, errors);

  const report = {
    phase: "FOOD-14F",
    overall_result: errors.length === 0 ? "PASS" : "FAIL",
    baseline: BASELINE_PATH,
    publication_pipeline: [
      "generate:protein-food-publication",
      "generate:protein-food-html",
      "generate:protein-food-sitemap",
      "certify:protein-food-release",
    ],
    frozen_layers_modified: errors.length > 0,
    errors,
  };

  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report, null, 2));
  console.log(`Baseline: ${BASELINE_PATH}`);
  console.log(`Report: ${REPORT_PATH}`);

  if (report.overall_result !== "PASS") {
    console.error(errors.join("\n"));
    process.exit(1);
  }
}

main();
