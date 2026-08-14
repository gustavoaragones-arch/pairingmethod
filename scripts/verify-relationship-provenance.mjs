#!/usr/bin/env node
/** AQ-02B3 — Independently verify every published domain's relationships trace to a real runtime edge. */
import { runRelationshipProvenanceStage } from "../lib/food-publication/relationship-provenance.js";

const result = runRelationshipProvenanceStage(process.cwd());
const summary = {
  totalChecked: result.totalChecked,
  totalViolations: result.totalViolations,
  allProvenanced: result.allProvenanced,
  wineTargetsChecked: result.targetExistence.checked,
  unknownWineTargets: result.targetExistence.unknownTargets.length,
};
console.log(JSON.stringify(summary, null, 2));

if (!result.allProvenanced || !result.targetExistence.allTargetsKnown) {
  console.error("Relationship provenance FAILED — see violations below:");
  for (const r of result.results) {
    if (r.violationCount) console.error(JSON.stringify(r.violations, null, 2));
  }
  if (result.targetExistence.unknownTargets.length) {
    console.error(JSON.stringify(result.targetExistence.unknownTargets, null, 2));
  }
  process.exit(1);
}
