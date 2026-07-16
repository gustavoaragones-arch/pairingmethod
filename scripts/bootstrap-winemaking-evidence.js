/**
 * ONTOLOGY-01D — Seed winemaking technique evidence annotations.
 * Merges with existing ONTOLOGY-01C.6 annotations in relationship-evidence.json.
 * Run: node scripts/bootstrap-winemaking-evidence.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const EVIDENCE_PATH = path.join(ROOT, "data", "relationship-evidence.json");

const WINEMAKING_EVIDENCE = [
  {
    source_kind: "winemaking_technique",
    source: "malolactic-fermentation",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "buttery",
    evidence: {
      reason: [{ kind: "descriptor", slug: "creamy" }],
      confidence: "high",
      notes: "Diacetyl produced during MLF creates buttery aroma and texture.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "malolactic-fermentation",
    type: "reduces_descriptor",
    target_kind: "descriptor",
    target: "zesty",
    evidence: {
      reason: [{ kind: "descriptor", slug: "tart" }],
      confidence: "high",
      notes: "Conversion of malic to lactic acid lowers perceived acidity.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "malolactic-fermentation",
    type: "common_in",
    target_kind: "wine_style",
    target: "chardonnay",
    evidence: {
      reason: [{ kind: "descriptor", slug: "buttery" }],
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "carbonic-maceration",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "banana",
    evidence: {
      confidence: "high",
      notes: "Intracellular fermentation produces distinctive ester-driven fruit notes.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "carbonic-maceration",
    type: "common_in",
    target_kind: "wine_region",
    target: "beaujolais",
    evidence: {
      reason: [{ kind: "descriptor", slug: "banana" }],
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "carbonic-maceration",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "jammy",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "lees-aging",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "brioche",
    evidence: {
      reason: [{ kind: "descriptor", slug: "rich" }],
      confidence: "high",
      notes: "Autolysis of yeast lees releases bready, creamy compounds.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "lees-aging",
    type: "common_in",
    target_kind: "wine_style",
    target: "champagne",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "batonnage",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "creamy",
    evidence: {
      reason: [{ kind: "winemaking_technique", slug: "lees-aging" }],
      confidence: "high",
      notes: "Stirring lees increases contact and mouthfeel integration.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "amphora-aging",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "earthy",
    evidence: {
      confidence: "high",
      notes: "Porous clay vessels allow micro-oxygenation and earthy expression.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "barrel-aging",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "vanilla",
    evidence: {
      reason: [{ kind: "descriptor", slug: "toast" }],
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "new-french-oak",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "toast",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "neutral-oak",
    type: "reduces_descriptor",
    target_kind: "descriptor",
    target: "vanilla",
    evidence: {
      confidence: "medium",
      notes: "Previously used barrels impart less overt oak flavor.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "cold-soak",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "juicy",
    evidence: {
      confidence: "medium",
      notes: "Pre-fermentation skin contact extracts color and phenolics.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "extended-maceration",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "firm",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "whole-cluster-fermentation",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "spicy",
    evidence: {
      confidence: "medium",
      notes: "Stem inclusion can add herbal and peppery notes.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "native-fermentation",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "earthy",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "traditional-method",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "brioche",
    evidence: {
      reason: [{ kind: "winemaking_technique", slug: "lees-aging" }],
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "traditional-method",
    type: "common_in",
    target_kind: "wine_style",
    target: "champagne",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "charmat-method",
    type: "common_in",
    target_kind: "wine_style",
    target: "prosecco",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "fortification",
    type: "common_in",
    target_kind: "wine_style",
    target: "port",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "fortification",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "rich",
    evidence: {
      confidence: "high",
      notes: "Added spirit raises alcohol and preserves sweetness.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "solera-system",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "oxidized",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "noble-rot-production",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "honeyed",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "ice-wine-production",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "honeyed",
    evidence: {
      confidence: "high",
      notes: "Frozen harvest concentrates sugars and acidity.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "late-harvest",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "ripe",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "cold-fermentation",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "crisp",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "warm-fermentation",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "ripe",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "micro-oxygenation",
    type: "reduces_descriptor",
    target_kind: "descriptor",
    target: "firm",
    evidence: {
      confidence: "medium",
      notes: "Controlled oxygen softens tannins pre-bottling.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "fining",
    type: "reduces_descriptor",
    target_kind: "descriptor",
    target: "firm",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "unfiltered-bottling",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "earthy",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "skin-contact",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "tannic",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "flash-detente",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "jammy",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "concrete-egg-aging",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "rich",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "stainless-steel-aging",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "crisp",
    evidence: {
      confidence: "high",
      notes: "Inert vessels preserve primary fruit and acidity.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "malolactic-fermentation",
    type: "associated_with",
    target_kind: "grape_variety",
    target: "chardonnay",
    evidence: {
      reason: [{ kind: "descriptor", slug: "buttery" }],
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "carbonic-maceration",
    type: "associated_with",
    target_kind: "grape_variety",
    target: "pinot-noir",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "lees-aging",
    type: "associated_with",
    target_kind: "wine_serving",
    target: "cellar-temperature",
    evidence: {
      confidence: "medium",
      notes: "Textural wines often show best with moderate cellar service.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "barrel-aging",
    type: "common_in",
    target_kind: "wine_region",
    target: "napa-valley",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "malolactic-fermentation",
    type: "common_in",
    target_kind: "wine_region",
    target: "burgundy",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "ancestral-method",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "barnyard",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "crossflow-filtration",
    type: "reduces_descriptor",
    target_kind: "descriptor",
    target: "earthy",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "oak-alternatives",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "toast",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "inoculated-fermentation",
    type: "confused_with",
    target_kind: "winemaking_technique",
    target: "native-fermentation",
    evidence: {
      confidence: "medium",
      notes: "Both are fermentation approaches — differ by yeast source.",
    },
  },
  {
    source_kind: "winemaking_technique",
    source: "cold-stabilization",
    type: "reduces_descriptor",
    target_kind: "descriptor",
    target: "tart",
    evidence: {
      confidence: "high",
      notes: "Tartrate precipitation reduces crystal formation and sharp edges.",
    },
  },
];

function edgeKey(a) {
  return `${a.source_kind}:${a.source}|${a.type}|${a.target_kind}:${a.target}`;
}

function main() {
  const existing = JSON.parse(fs.readFileSync(EVIDENCE_PATH, "utf8"));
  const seen = new Set(existing.annotations.map(edgeKey));
  let added = 0;

  for (const ann of WINEMAKING_EVIDENCE) {
    const key = edgeKey(ann);
    if (seen.has(key)) continue;
    seen.add(key);
    existing.annotations.push(ann);
    added += 1;
  }

  existing.meta = {
    ...existing.meta,
    phase: "ONTOLOGY-01D",
    annotation_count: existing.annotations.length,
    winemaking_evidence_count: WINEMAKING_EVIDENCE.length,
  };

  fs.writeFileSync(EVIDENCE_PATH, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
  console.log(`✓ Added ${added} winemaking evidence annotations (${existing.annotations.length} total)`);
}

main();
