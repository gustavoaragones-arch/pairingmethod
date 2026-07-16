/**
 * ONTOLOGY-01E — Seed wine fault evidence annotations.
 * Merges with existing ONTOLOGY-01D annotations in relationship-evidence.json.
 * Run: node scripts/bootstrap-wine-fault-evidence.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const EVIDENCE_PATH = path.join(ROOT, "data", "relationship-evidence.json");

const WINE_FAULT_EVIDENCE = [
  {
    source_kind: "wine_fault",
    source: "reduction",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "rubber",
    evidence: {
      reason: [{ kind: "wine_fault", slug: "hydrogen-sulfide" }],
      confidence: "high",
      notes: "Volatile sulfur compounds (H₂S, mercaptans) produce rubber and struck-match aromas.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "brettanomyces",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "barnyard",
    evidence: {
      reason: [{ kind: "descriptor", slug: "leathery" }],
      confidence: "high",
      notes: "Brett metabolizes hydroxycinnamic acids into volatile phenols with barnyard character.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "oxidation",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "nutty",
    evidence: {
      confidence: "high",
      notes: "Excessive oxygen drives aldehyde formation and nutty oxidative aromas.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "oxidation",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "oxidized",
    evidence: {
      reason: [{ kind: "descriptor", slug: "nutty" }],
      confidence: "high",
    },
  },
  {
    source_kind: "wine_fault",
    source: "cork-taint",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "earthy",
    evidence: {
      confidence: "high",
      notes: "TCA imparts musty, damp-cardboard earthiness at parts-per-trillion thresholds.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "volatile-acidity",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "sour",
    evidence: {
      reason: [{ kind: "descriptor", slug: "tart" }],
      confidence: "high",
      notes: "Elevated acetic acid produces vinegar-like sourness dominating the palate.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "premature-oxidation",
    type: "confused_with",
    target_kind: "wine_fault",
    target: "oxidation",
    evidence: {
      confidence: "high",
      notes: "Both show nutty, oxidative character — premox differs in timing and white-wine context.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "premature-oxidation",
    type: "confused_with",
    target_kind: "wine_fault",
    target: "maderization",
    evidence: {
      confidence: "medium",
      notes: "Early white-wine oxidation can resemble heat-driven maderized character.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "brettanomyces",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "leathery",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "wine_fault",
    source: "brettanomyces",
    type: "reduces_descriptor",
    target_kind: "descriptor",
    target: "fresh",
    evidence: {
      confidence: "high",
      notes: "Pronounced Brett masks primary fruit and terroir expression.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "brettanomyces",
    type: "common_in",
    target_kind: "wine_style",
    target: "pinot-noir",
    evidence: {
      reason: [{ kind: "descriptor", slug: "barnyard" }],
      confidence: "high",
    },
  },
  {
    source_kind: "wine_fault",
    source: "brettanomyces",
    type: "common_in",
    target_kind: "wine_region",
    target: "rhone-valley",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "wine_fault",
    source: "brettanomyces",
    type: "confused_with",
    target_kind: "winemaking_technique",
    target: "native-fermentation",
    evidence: {
      confidence: "medium",
      notes: "Ambient yeast ferments can produce earthy notes mistaken for Brett spoilage.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "brettanomyces",
    type: "associated_with",
    target_kind: "winemaking_technique",
    target: "barrel-aging",
    evidence: {
      confidence: "high",
      notes: "Brett survives in barrel wood and transfer lines during extended aging.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "reduction",
    type: "confused_with",
    target_kind: "wine_fault",
    target: "hydrogen-sulfide",
    evidence: {
      confidence: "high",
      notes: "H₂S is a primary volatile sulfur compound within the broader reduction fault family.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "reduction",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "vegetal",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "wine_fault",
    source: "reduction",
    type: "reduces_descriptor",
    target_kind: "descriptor",
    target: "floral",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "wine_fault",
    source: "reduction",
    type: "common_in",
    target_kind: "wine_style",
    target: "champagne",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "wine_fault",
    source: "reduction",
    type: "associated_with",
    target_kind: "wine_serving",
    target: "extended-decant",
    evidence: {
      confidence: "medium",
      notes: "Mild reduction often dissipates with aeration and decanting.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "oxidation",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "caramel",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "wine_fault",
    source: "oxidation",
    type: "reduces_descriptor",
    target_kind: "descriptor",
    target: "bright",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "wine_fault",
    source: "oxidation",
    type: "common_in",
    target_kind: "wine_style",
    target: "chardonnay",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "wine_fault",
    source: "oxidation",
    type: "associated_with",
    target_kind: "winemaking_technique",
    target: "solera-system",
    evidence: {
      confidence: "high",
      notes: "Intentional oxidative aging in solera differs from unplanned table-wine oxidation.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "cork-taint",
    type: "reduces_descriptor",
    target_kind: "descriptor",
    target: "floral",
    evidence: {
      confidence: "high",
      notes: "TCA mutes aromatic lift even when musty notes are subtle.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "cork-taint",
    type: "confused_with",
    target_kind: "wine_fault",
    target: "geosmin",
    evidence: {
      confidence: "medium",
      notes: "Both produce earthy mustiness — geosmin is muddy/beetroot, TCA is damp cardboard.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "cork-taint",
    type: "common_in",
    target_kind: "wine_region",
    target: "bordeaux",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "wine_fault",
    source: "volatile-acidity",
    type: "confused_with",
    target_kind: "wine_fault",
    target: "acetobacter",
    evidence: {
      confidence: "high",
      notes: "Acetobacter is a primary bacterial source of elevated volatile acidity.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "volatile-acidity",
    type: "common_in",
    target_kind: "wine_region",
    target: "beaujolais",
    evidence: {
      confidence: "medium",
    },
  },
  {
    source_kind: "wine_fault",
    source: "premature-oxidation",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "nutty",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "wine_fault",
    source: "premature-oxidation",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "oxidized",
    evidence: {
      reason: [{ kind: "descriptor", slug: "nutty" }],
      confidence: "high",
    },
  },
  {
    source_kind: "wine_fault",
    source: "premature-oxidation",
    type: "common_in",
    target_kind: "wine_region",
    target: "burgundy",
    evidence: {
      confidence: "high",
      notes: "White Burgundy Chardonnay was the epicenter of the premox debate.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "premature-oxidation",
    type: "associated_with",
    target_kind: "winemaking_technique",
    target: "batonnage",
    evidence: {
      confidence: "medium",
      notes: "Lees stirring and oxygen-aware élevage are debated premox contributing factors.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "hydrogen-sulfide",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "rubber",
    evidence: {
      confidence: "high",
      notes: "Rotten-egg H₂S is sensorially related to rubbery sulfur faults.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "hydrogen-sulfide",
    type: "confused_with",
    target_kind: "wine_fault",
    target: "reduction",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "wine_fault",
    source: "mercaptans",
    type: "confused_with",
    target_kind: "wine_fault",
    target: "hydrogen-sulfide",
    evidence: {
      confidence: "high",
      notes: "Untreated H₂S evolves into harder-to-remove mercaptans and disulfides.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "sulfur-dioxide-excess",
    type: "confused_with",
    target_kind: "wine_fault",
    target: "reduction",
    evidence: {
      confidence: "medium",
      notes: "Both present burnt-match and rubbery sulfur aromas — differ in cause and fix.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "lightstrike",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "rubber",
    evidence: {
      confidence: "high",
      notes: "UV photochemistry forms dimethyl disulfide and related rubbery volatiles.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "heat-damage",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "jammy",
    evidence: {
      confidence: "high",
    },
  },
  {
    source_kind: "wine_fault",
    source: "acetobacter",
    type: "creates_descriptor",
    target_kind: "descriptor",
    target: "sour",
    evidence: {
      confidence: "high",
      notes: "Acetic acid bacteria convert ethanol to acetic acid with vinegar-like sourness.",
    },
  },
  {
    source_kind: "wine_fault",
    source: "lactobacillus",
    type: "confused_with",
    target_kind: "winemaking_technique",
    target: "malolactic-fermentation",
    evidence: {
      confidence: "high",
      notes: "Controlled MLF uses beneficial LAB; spoilage Lactobacillus grows uncontrolled.",
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

  for (const ann of WINE_FAULT_EVIDENCE) {
    const key = edgeKey(ann);
    if (seen.has(key)) continue;
    seen.add(key);
    existing.annotations.push(ann);
    added += 1;
  }

  existing.meta = {
    ...existing.meta,
    phase: "ONTOLOGY-01E",
    annotation_count: existing.annotations.length,
    wine_fault_evidence_count: WINE_FAULT_EVIDENCE.length,
  };

  fs.writeFileSync(EVIDENCE_PATH, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
  console.log(`✓ Added ${added} wine fault evidence annotations (${existing.annotations.length} total)`);
}

main();
