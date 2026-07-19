#!/usr/bin/env node
/**
 * FOOD-06D — Editorial relationship mapper for fungi ontology.
 * Level 3 (editorial) relationships — human-curated, evidence-backed.
 * Does not modify catalog, runtime indexes, or structural relationship layer.
 *
 * Run: node scripts/map-fungi-editorial-relationships-06d.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-fungi-runtime.js";
import { EDITORIAL_CURATED, FORWARD_REFERENCE_IDS } from "./fungi-editorial-seed-06d.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/fungi-catalog.json");
const STRUCTURAL_PATH = path.join(RUNTIME_DIR, "fungi-relationships.json");
const OUTPUT_PATH = path.join(RUNTIME_DIR, "fungi-editorial-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/fungi-editorial-relationship-report.json");
const EDGE_VERSION = "1.0";

const EDITORIAL_RELATIONSHIP_TYPES = ["similar_to", "substitutes_for", "commonly_served_with"];

const SYMMETRIC_TYPES = new Set(["similar_to"]);

const EDITORIAL_TIERS = {
  A: {
    label: "high_confidence_culinary_equivalence",
    relationships: ["similar_to", "substitutes_for"],
  },
  B: {
    label: "common_culinary_association",
    relationships: ["commonly_served_with"],
    scope: "intra_domain",
  },
  C: {
    label: "cross_domain_forward_reference",
    relationships: ["commonly_served_with"],
    scope: "forward_reference",
  },
};

const VALID_EDITORIAL_REVIEW = new Set(["approved", "pending"]);

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

function edgeKey(edge) {
  return `${edge.source}\t${edge.relationship}\t${edge.target}`;
}

function loadInputs() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const indexes = JSON.parse(fs.readFileSync(path.join(RUNTIME_DIR, "fungi-indexes.json"), "utf8"));
  const structural = JSON.parse(fs.readFileSync(STRUCTURAL_PATH, "utf8"));
  return { catalog, slugMap: indexes.by_slug, structural };
}

function resolveFungusId(slugMap, slug) {
  return slugMap[slug] ?? null;
}

function canonicalPair(source, target) {
  return source.localeCompare(target) <= 0 ? [source, target] : [target, source];
}

function isForwardReference(id) {
  return FORWARD_REFERENCE_IDS.has(id);
}

function isCrossDomainTarget(target) {
  return target.startsWith("food.") && !target.startsWith("food.fungi.");
}

export function mapFungiEditorialRelationships({ slugMap, catalog }) {
  const fungusIds = new Set(Object.values(slugMap));
  const edges = [];
  const seen = new Set();
  const forwardReferencesUsed = new Set();
  const tierCounts = { A: 0, B: 0, C: 0 };

  for (const entry of EDITORIAL_CURATED) {
    const sourceId = resolveFungusId(slugMap, entry.source);
    if (!sourceId) {
      throw new Error(`Unknown source slug: ${entry.source}`);
    }

    let targetId = entry.target;
    if (isCrossDomainTarget(entry.target)) {
      if (!isForwardReference(entry.target)) {
        throw new Error(`Undocumented cross-domain target: ${entry.target}`);
      }
      forwardReferencesUsed.add(entry.target);
      targetId = entry.target;
    } else {
      targetId = resolveFungusId(slugMap, entry.target);
      if (!targetId) {
        throw new Error(`Unknown target slug: ${entry.target}`);
      }
    }

    let source = sourceId;
    let target = targetId;

    if (SYMMETRIC_TYPES.has(entry.relationship)) {
      [source, target] = canonicalPair(sourceId, targetId);
    }

    const edge = {
      source,
      relationship: entry.relationship,
      target,
      confidence: entry.confidence,
      derived_from: "editorial",
      stability_level: "editorial",
      editorial_tier: entry.editorial_tier,
      editorial_review: entry.editorial_review,
      evidence: entry.evidence,
      version: EDGE_VERSION,
    };

    const key = edgeKey(edge);
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push(edge);
    tierCounts[entry.editorial_tier] = (tierCounts[entry.editorial_tier] ?? 0) + 1;
  }

  edges.sort((a, b) => edgeKey(a).localeCompare(edgeKey(b)));

  const typeCounts = Object.fromEntries(
    EDITORIAL_RELATIONSHIP_TYPES.map((type) => [type, 0])
  );
  for (const edge of edges) {
    typeCounts[edge.relationship] = (typeCounts[edge.relationship] ?? 0) + 1;
  }

  const usedTypes = EDITORIAL_RELATIONSHIP_TYPES.filter((type) => typeCounts[type] > 0);

  return {
    meta: {
      phase: "FOOD-06D",
      domain: "fungi",
      version: EDGE_VERSION,
      catalog_version: catalog.meta?.catalog_version ?? null,
      layer: "editorial",
      stability_level: "editorial",
      runtime_stability_level: 3,
      editorial_tiers: EDITORIAL_TIERS,
      relationship_types: usedTypes,
      edge_count: edges.length,
      tier_counts: tierCounts,
      forward_references: [...forwardReferencesUsed].sort(),
      inputs: [
        "data/fungi-catalog.json",
        "data/runtime/fungi-indexes.json",
        "data/runtime/fungi-relationships.json",
        "scripts/fungi-editorial-seed-06d.js",
      ],
      scope_exclusions: [
        "wine_pairings",
        "preparation_advice",
        "recipes",
        "finished_dishes",
        "nutrition",
        "health_claims",
      ],
      association_rule:
        "Editorial edges describe ingredient compatibility, not dish composition or finished dishes.",
    },
    edges,
    stats: {
      relationship_types: usedTypes.length,
      total_edges: edges.length,
      tier_counts: tierCounts,
      relationship_type_counts: typeCounts,
      forward_reference_count: forwardReferencesUsed.size,
    },
    fungusIds,
  };
}

function validateEditorial(output, structural, fungusIds) {
  const errors = [];
  const seen = new Set();
  const structuralKeys = new Set(structural.edges.map(edgeKey));
  let duplicates = 0;
  let missingEntities = 0;
  let orphanForwardRefs = 0;
  let conflicts = 0;
  let pendingReview = 0;

  for (const edge of output.edges) {
    const key = edgeKey(edge);
    if (seen.has(key)) {
      duplicates += 1;
      errors.push(`Duplicate editorial edge: ${key}`);
    }
    seen.add(key);

    if (edge.source === edge.target) {
      errors.push(`Self-reference: ${key}`);
    }

    if (!fungusIds.has(edge.source)) {
      missingEntities += 1;
      errors.push(`Missing source entity: ${edge.source}`);
    }

    if (isCrossDomainTarget(edge.target)) {
      if (!FORWARD_REFERENCE_IDS.has(edge.target)) {
        orphanForwardRefs += 1;
        errors.push(`Undocumented forward reference: ${edge.target}`);
      }
    } else if (!fungusIds.has(edge.target)) {
      missingEntities += 1;
      errors.push(`Missing target entity: ${edge.target}`);
    }

    if (structuralKeys.has(key)) {
      conflicts += 1;
      errors.push(`Conflicts with structural relationship: ${key}`);
    }

    if (edge.derived_from !== "editorial") {
      errors.push(`Invalid derived_from on ${key}`);
    }
    if (edge.stability_level !== "editorial") {
      errors.push(`Invalid stability_level on ${key}`);
    }
    if (edge.confidence !== "high") {
      errors.push(`Invalid confidence on ${key}`);
    }
    if (!edge.evidence || !edge.evidence.trim()) {
      errors.push(`Missing evidence on ${key}`);
    }
    if (!VALID_EDITORIAL_REVIEW.has(edge.editorial_review)) {
      errors.push(`Invalid editorial_review on ${key}`);
    }
    if (edge.editorial_review === "pending") {
      pendingReview += 1;
    }
    if (!["A", "B", "C"].includes(edge.editorial_tier)) {
      errors.push(`Invalid editorial_tier on ${key}`);
    }
    if (!EDITORIAL_RELATIONSHIP_TYPES.includes(edge.relationship)) {
      errors.push(`Unknown relationship type: ${edge.relationship}`);
    }

    if (edge.editorial_tier === "A" && !["similar_to", "substitutes_for"].includes(edge.relationship)) {
      errors.push(`Tier A relationship mismatch: ${key}`);
    }
    if (edge.editorial_tier === "B" && edge.relationship !== "commonly_served_with") {
      errors.push(`Tier B relationship mismatch: ${key}`);
    }
    if (edge.editorial_tier === "B" && isCrossDomainTarget(edge.target)) {
      errors.push(`Tier B must be intra-domain: ${key}`);
    }
    if (edge.editorial_tier === "C" && edge.relationship !== "commonly_served_with") {
      errors.push(`Tier C relationship mismatch: ${key}`);
    }
    if (edge.editorial_tier === "C" && !isCrossDomainTarget(edge.target)) {
      errors.push(`Tier C must be cross-domain forward reference: ${key}`);
    }
  }

  return { errors, duplicates, missingEntities, orphanForwardRefs, conflicts, pendingReview };
}

function main() {
  const { catalog, slugMap, structural } = loadInputs();
  const output = mapFungiEditorialRelationships({ slugMap, catalog });
  const validation = validateEditorial(output, structural, output.fungusIds);
  const rebuilt = mapFungiEditorialRelationships({ slugMap, catalog });
  const determinismPass =
    serializeRuntime({ meta: output.meta, edges: output.edges }) ===
    serializeRuntime({ meta: rebuilt.meta, edges: rebuilt.edges });

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-06D",
      domain: "fungi",
      overall_result: "FAIL",
      errors: validation.errors,
      metrics: {
        "Editorial relationship types": output.stats.relationship_types,
        "Editorial edges": output.stats.total_edges,
        "Tier A edges": output.stats.tier_counts.A,
        "Tier B edges": output.stats.tier_counts.B,
        "Tier C edges": output.stats.tier_counts.C,
        "Duplicate edges": validation.duplicates,
        "Missing entities": validation.missingEntities,
        "Forward reference orphans": validation.orphanForwardRefs,
        Conflicts: validation.conflicts,
        Determinism: determinismPass ? "PASS" : "FAIL",
        "Overall result": "FAIL",
      },
    };
    writeJson(REPORT_PATH, report);
    console.error(validation.errors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(OUTPUT_PATH, { meta: output.meta, edges: output.edges });

  const report = {
    phase: "FOOD-06D",
    domain: "fungi",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    errors: [],
    output: "data/runtime/fungi-editorial-relationships.json",
    forward_references: output.meta.forward_references,
    metrics: {
      "Editorial relationship types": output.stats.relationship_types,
      "Editorial edges": output.stats.total_edges,
      "Tier A edges": output.stats.tier_counts.A,
      "Tier B edges": output.stats.tier_counts.B,
      "Tier C edges": output.stats.tier_counts.C,
      "Pending review edges": validation.pendingReview,
      "Duplicate edges": 0,
      "Missing entities": 0,
      "Forward reference orphans": 0,
      Conflicts: 0,
      Determinism: "PASS",
      "Deterministic ordering": "PASS",
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
    editorial_tiers: EDITORIAL_TIERS,
    association_rule: output.meta.association_rule,
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Editorial relationships: ${OUTPUT_PATH}`);
  console.log(`Report: ${REPORT_PATH}`);
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
