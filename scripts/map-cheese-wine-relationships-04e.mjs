#!/usr/bin/env node
/**
 * FOOD-04E — Wine pairing layer for cheese ontology.
 * Third independent semantic layer: derived_from = editorial (curated pairing knowledge).
 * Does not modify catalog, runtime indexes, structural, editorial, or wine ontology layers.
 *
 * Run: node scripts/map-cheese-wine-relationships-04e.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-cheese-catalog.js";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { listWinemakingTechniqueEntries } from "../lib/taxonomy-winemaking-technique.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/cheese-catalog.json");
const STRUCTURAL_PATH = path.join(RUNTIME_DIR, "cheese-relationships.json");
const EDITORIAL_PATH = path.join(RUNTIME_DIR, "cheese-editorial-relationships.json");
const OUTPUT_PATH = path.join(RUNTIME_DIR, "cheese-wine-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/cheese-wine-relationship-report.json");
const EDGE_VERSION = "1.0";

const PAIRING_RELATIONSHIP_TYPES = [
  "pairs_with_style",
  "also_pairs_with_style",
  "pairs_with_descriptor",
  "pairs_with_technique",
];

/**
 * Curated v1 wine pairing edges (cheese slug + wine ontology target slug).
 * @type {Array<{ relationship: string, source: string, target: string, confidence: string, evidence: string }>}
 */
const PAIRING_CURATED = [
  // —— Bloomy rind ——
  {
    relationship: "pairs_with_style",
    source: "brie-de-meaux",
    target: "champagne",
    confidence: "high",
    evidence: "Creamy Brie fat and salt are classically balanced by Champagne acidity and fine bubbles.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "brie-de-meaux",
    target: "chardonnay",
    confidence: "high",
    evidence: "Lightly oaked Chardonnay complements bloomy-rind creaminess without overpowering delicate flavor.",
  },
  {
    relationship: "pairs_with_style",
    source: "camembert-de-normandie",
    target: "champagne",
    confidence: "high",
    evidence: "Ripe Camembert is a canonical Champagne pairing in French cheese service.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "camembert-de-normandie",
    target: "pinot-noir",
    confidence: "high",
    evidence: "Silky Pinot Noir suits earthy, ripe Camembert when served at room temperature.",
  },
  {
    relationship: "pairs_with_descriptor",
    source: "brie-de-meaux",
    target: "buttery",
    confidence: "high",
    evidence: "Bloomy-rind Brie commonly pairs with wines showing buttery texture from lees or oak influence.",
  },
  {
    relationship: "pairs_with_technique",
    source: "brie-de-meaux",
    target: "traditional-method",
    confidence: "high",
    evidence: "Traditional-method sparkling wines provide the classic structural counterpoint to soft bloomy cheeses.",
  },

  // —— Blue ——
  {
    relationship: "pairs_with_style",
    source: "roquefort",
    target: "port",
    confidence: "high",
    evidence: "Roquefort salt and pungency are durably paired with sweet fortified Port wine.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "roquefort",
    target: "riesling",
    confidence: "high",
    evidence: "Off-dry Riesling acidity and sweetness balance Roquefort intensity on cheese boards.",
  },
  {
    relationship: "pairs_with_style",
    source: "stilton",
    target: "port",
    confidence: "high",
    evidence: "Stilton and Port is a widely recognized British cheese-course pairing.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "stilton",
    target: "sherry",
    confidence: "high",
    evidence: "Oxidative Sherry nuttiness complements Stilton cream and blue spice.",
  },
  {
    relationship: "pairs_with_style",
    source: "gorgonzola",
    target: "moscato",
    confidence: "high",
    evidence: "Sweet Moscato contrasts Gorgonzola salt and pungency in established Italian service.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "gorgonzola-dolce",
    target: "prosecco",
    confidence: "high",
    evidence: "Gorgonzola Dolce pairs with light sparkling Prosecco for approachable blue-cheese service.",
  },
  {
    relationship: "pairs_with_style",
    source: "bleu-dauvergne",
    target: "gewurztraminer",
    confidence: "high",
    evidence: "Aromatic Gewürztraminer stands up to creamy Auvergne blue without harsh tannin clash.",
  },
  {
    relationship: "pairs_with_technique",
    source: "stilton",
    target: "fortification",
    confidence: "high",
    evidence: "Fortified wines such as Port provide the sweetness structure classic for blue cheese pairing.",
  },

  // —— Goat / fresh ——
  {
    relationship: "pairs_with_style",
    source: "goat-chevre-log",
    target: "sauvignon-blanc",
    confidence: "high",
    evidence: "Goat cheese tang and Sauvignon Blanc herbaceous acidity are a classic Loire pairing.",
  },
  {
    relationship: "pairs_with_style",
    source: "fresh-goat-cheese",
    target: "sauvignon-blanc",
    confidence: "high",
    evidence: "Fresh chèvre and Sauvignon Blanc share long-established regional pairing tradition.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "goat-chevre-log",
    target: "chenin-blanc",
    confidence: "high",
    evidence: "Loire Chenin Blanc offers the same high-acid white profile as classic goat cheese pairings.",
  },
  {
    relationship: "pairs_with_style",
    source: "chabichou-du-poitou",
    target: "sauvignon-blanc",
    confidence: "high",
    evidence: "Chabichou du Poitou is traditionally served with Loire Sauvignon Blanc.",
  },
  {
    relationship: "pairs_with_style",
    source: "humboldt-fog",
    target: "sauvignon-blanc",
    confidence: "high",
    evidence: "Tangy American goat cheese follows the established chèvre–Sauvignon Blanc pairing model.",
  },
  {
    relationship: "pairs_with_descriptor",
    source: "goat-chevre-log",
    target: "citrus-zest",
    confidence: "high",
    evidence: "Goat cheese lactic tang aligns with citrus aromatics common in Sauvignon Blanc.",
  },
  {
    relationship: "pairs_with_technique",
    source: "goat-chevre-log",
    target: "stainless-steel-aging",
    confidence: "high",
    evidence: "Unoaked stainless-aged whites preserve goat cheese freshness without wood masking acidity.",
  },

  // —— Hard Italian grana ——
  {
    relationship: "pairs_with_style",
    source: "parmigiano-reggiano",
    target: "sangiovese",
    confidence: "high",
    evidence: "Aged Parmigiano umami and salt pair with Sangiovese acidity in classic Italian antipasto.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "parmigiano-reggiano",
    target: "prosecco",
    confidence: "high",
    evidence: "Parmigiano with Prosecco is a widely served Italian aperitivo combination.",
  },
  {
    relationship: "pairs_with_style",
    source: "grana-padano",
    target: "sangiovese",
    confidence: "high",
    evidence: "Grana Padano follows the same Sangiovese-friendly grating cheese pairing tradition as Parmigiano.",
  },
  {
    relationship: "pairs_with_style",
    source: "pecorino-romano",
    target: "sangiovese",
    confidence: "high",
    evidence: "Salty Pecorino Romano balances Sangiovese fruit and acidity in Roman cuisine.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "pecorino-romano",
    target: "pinot-grigio",
    confidence: "high",
    evidence: "Crisp Italian white wine complements sheep pecorino salt in Mediterranean antipasto.",
  },
  {
    relationship: "pairs_with_descriptor",
    source: "parmigiano-reggiano",
    target: "nutty",
    confidence: "high",
    evidence: "Aged Parmigiano nuttiness echoes nutty oxidative notes in mature red and sparkling wines.",
  },

  // —— Alpine / semi-hard ——
  {
    relationship: "pairs_with_style",
    source: "gruyere",
    target: "chardonnay",
    confidence: "high",
    evidence: "Nutty Gruyère pairs with medium-bodied Chardonnay in fondue and Alpine cheese service.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "gruyere",
    target: "pinot-noir",
    confidence: "high",
    evidence: "Pinot Noir complements Gruyère in classic fondue and raclette contexts.",
  },
  {
    relationship: "pairs_with_style",
    source: "comte",
    target: "chardonnay",
    confidence: "high",
    evidence: "Comté nuttiness and Jura Chardonnay share established regional pairing affinity.",
  },
  {
    relationship: "pairs_with_style",
    source: "raclette",
    target: "riesling",
    confidence: "high",
    evidence: "Riesling acidity cuts melted Raclette richness in Alpine dining tradition.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "raclette",
    target: "pinot-noir",
    confidence: "high",
    evidence: "Light Pinot Noir suits melted Raclette without overpowering mild Alpine flavor.",
  },
  {
    relationship: "pairs_with_style",
    source: "emmental",
    target: "riesling",
    confidence: "high",
    evidence: "Mild Emmental pairs with aromatic Riesling in Swiss and German cheese service.",
  },
  {
    relationship: "pairs_with_descriptor",
    source: "gruyere",
    target: "nutty",
    confidence: "high",
    evidence: "Alpine Gruyère nut character aligns with nutty notes in aged Chardonnay and Pinot Noir.",
  },

  // —— Cheddar / British hard ——
  {
    relationship: "pairs_with_style",
    source: "cheddar",
    target: "cabernet-sauvignon",
    confidence: "high",
    evidence: "Sharp Cheddar fat and salt stand up to structured Cabernet in pub and board service.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "cheddar",
    target: "merlot",
    confidence: "high",
    evidence: "Merlot soft tannin suits medium Cheddar without harsh astringency.",
  },
  {
    relationship: "pairs_with_style",
    source: "clothbound-cheddar",
    target: "sherry",
    confidence: "high",
    evidence: "Artisan Cheddar and Sherry is a recognized British cheese-course pairing.",
  },
  {
    relationship: "pairs_with_style",
    source: "aged-cheddar",
    target: "port",
    confidence: "high",
    evidence: "Extra-aged Cheddar pairs with Port in established English cheese course tradition.",
  },
  {
    relationship: "pairs_with_style",
    source: "red-leicester",
    target: "merlot",
    confidence: "high",
    evidence: "Mild territorial cheeses such as Red Leicester suit approachable Merlot.",
  },
  {
    relationship: "pairs_with_descriptor",
    source: "aged-cheddar",
    target: "nutty",
    confidence: "high",
    evidence: "Long-aged Cheddar develops nutty character that mirrors oxidative wine notes.",
  },

  // —— Washed rind ——
  {
    relationship: "pairs_with_style",
    source: "epoisses",
    target: "gewurztraminer",
    confidence: "high",
    evidence: "Pungent Époisses is classically matched with aromatic Gewürztraminer in Burgundy.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "epoisses",
    target: "pinot-noir",
    confidence: "high",
    evidence: "Local Pinot Noir complements washed-rind intensity in Burgundian cheese service.",
  },
  {
    relationship: "pairs_with_style",
    source: "taleggio",
    target: "nebbiolo",
    confidence: "high",
    evidence: "Taleggio meltability pairs with Nebbiolo structure in Northern Italian cheese traditions.",
  },
  {
    relationship: "pairs_with_style",
    source: "munster",
    target: "gewurztraminer",
    confidence: "high",
    evidence: "Alsace Gewürztraminer is the traditional match for washed-rind Munster.",
  },
  {
    relationship: "pairs_with_style",
    source: "reblochon",
    target: "pinot-noir",
    confidence: "high",
    evidence: "Reblochon tartiflette tradition pairs melted cheese with Savoie Pinot Noir.",
  },
  {
    relationship: "pairs_with_descriptor",
    source: "munster",
    target: "floral",
    confidence: "high",
    evidence: "Washed-rind Munster pairs with floral aromatic whites that offset barnyard intensity.",
  },

  // —— Pasta filata / fresh Italian ——
  {
    relationship: "pairs_with_style",
    source: "mozzarella-fior-di-latte",
    target: "prosecco",
    confidence: "high",
    evidence: "Fresh mozzarella and Prosecco share common Italian antipasto and pizza-table service.",
  },
  {
    relationship: "pairs_with_style",
    source: "mozzarella-di-bufala",
    target: "prosecco",
    confidence: "high",
    evidence: "Bufala mozzarella with Prosecco is standard Campanian pairing culture.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "burrata",
    target: "pinot-grigio",
    confidence: "high",
    evidence: "Light Pinot Grigio suits fresh burrata without masking delicate dairy sweetness.",
  },
  {
    relationship: "pairs_with_style",
    source: "provolone",
    target: "sangiovese",
    confidence: "high",
    evidence: "Aged Provolone salt pairs with Sangiovese in Southern Italian cheese and wine culture.",
  },

  // —— Brined / Mediterranean ——
  {
    relationship: "pairs_with_style",
    source: "feta",
    target: "sauvignon-blanc",
    confidence: "high",
    evidence: "Salty Feta balances crisp Sauvignon Blanc in Greek salad and meze service.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "feta",
    target: "dry-rose",
    confidence: "high",
    evidence: "Dry rosé is a widely served Mediterranean partner for brined Feta.",
  },
  {
    relationship: "pairs_with_style",
    source: "halloumi",
    target: "dry-rose",
    confidence: "high",
    evidence: "Grilled Halloumi pairs with dry rosé in Cypriot and Eastern Mediterranean service.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "halloumi",
    target: "albarino",
    confidence: "high",
    evidence: "Albariño acidity complements salty grilled Halloumi without heavy oak.",
  },
  {
    relationship: "pairs_with_descriptor",
    source: "feta",
    target: "saline",
    confidence: "high",
    evidence: "Brined Feta salinity aligns with saline mineral notes in crisp coastal whites.",
  },

  // —— Spanish sheep ——
  {
    relationship: "pairs_with_style",
    source: "manchego-curado",
    target: "tempranillo",
    confidence: "high",
    evidence: "Manchego and Tempranillo share canonical Castilian tapas pairing tradition.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "manchego-viejo",
    target: "sherry",
    confidence: "high",
    evidence: "Aged Manchego with Sherry is established Spanish cheese-course service.",
  },
  {
    relationship: "pairs_with_style",
    source: "idiazabal",
    target: "tempranillo",
    confidence: "high",
    evidence: "Smoky Idiazábal pairs with Tempranillo in Basque pintxos culture.",
  },

  // —— Additional benchmark pairings ——
  {
    relationship: "pairs_with_style",
    source: "beaufort",
    target: "chardonnay",
    confidence: "high",
    evidence: "Alpine Beaufort nuttiness pairs with Jura and Savoie Chardonnay expressions.",
  },
  {
    relationship: "pairs_with_style",
    source: "ossau-iraty",
    target: "dry-rose",
    confidence: "high",
    evidence: "Sheep Ossau-Iraty pairs with dry rosé in Basque and Béarn cheese service.",
  },
  {
    relationship: "pairs_with_style",
    source: "mont-dor",
    target: "pinot-noir",
    confidence: "high",
    evidence: "Vacherin Mont d'Or is traditionally served with local Pinot Noir when oven-melted.",
  },
  {
    relationship: "pairs_with_technique",
    source: "parmigiano-reggiano",
    target: "barrel-aging",
    confidence: "high",
    evidence: "Oak-aged reds provide structure and spice that complement aged hard cheese umami.",
  },
  {
    relationship: "pairs_with_technique",
    source: "camembert-de-normandie",
    target: "malolactic-fermentation",
    confidence: "high",
    evidence: "Malolactic softness in Chardonnay and red wines suits bloomy-rind texture.",
  },
  {
    relationship: "pairs_with_style",
    source: "cabrales",
    target: "port",
    confidence: "high",
    evidence: "Intense Cabrales blue pairs with sweet Port in Asturian cheese tradition.",
  },
  {
    relationship: "pairs_with_style",
    source: "morbier",
    target: "pinot-noir",
    confidence: "high",
    evidence: "Morbier meltability suits Jura Pinot Noir in regional pairing practice.",
  },
  {
    relationship: "also_pairs_with_style",
    source: "havarti",
    target: "pinot-grigio",
    confidence: "high",
    evidence: "Mild Havarti pairs with neutral, crisp Pinot Grigio for everyday cheese service.",
  },
  {
    relationship: "pairs_with_style",
    source: "gouda-young",
    target: "riesling",
    confidence: "high",
    evidence: "Young Gouda sweetness pairs with off-dry Riesling in Dutch cheese culture.",
  },
  {
    relationship: "pairs_with_style",
    source: "aged-gouda",
    target: "port",
    confidence: "high",
    evidence: "Extra-aged Gouda caramel notes pair with Port in established Dutch cheese courses.",
  },
  {
    relationship: "pairs_with_style",
    source: "ricotta",
    target: "prosecco",
    confidence: "high",
    evidence: "Fresh Ricotta with sparkling Prosecco is common Italian dessert and antipasto service.",
  },
  {
    relationship: "pairs_with_style",
    source: "mascarpone",
    target: "moscato",
    confidence: "high",
    evidence: "Mascarpone sweetness pairs with Moscato in Italian dolce service traditions.",
  },
];

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

function loadWineOntology() {
  const taxonomy = loadTaxonomy();
  const descriptorIds = new Set(
    Object.values(taxonomy.nodes)
      .filter((n) => n.type === "descriptor")
      .map((n) => n.slug)
  );
  const styleIds = new Set(listWineStyleEntries().map((s) => s.slug));
  const techniqueIds = new Set(listWinemakingTechniqueEntries().map((t) => t.slug));

  return { styleIds, descriptorIds, techniqueIds };
}

function loadCheeseInputs() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const indexes = JSON.parse(fs.readFileSync(path.join(RUNTIME_DIR, "cheese-indexes.json"), "utf8"));
  const editorial = JSON.parse(fs.readFileSync(EDITORIAL_PATH, "utf8"));
  const structural = JSON.parse(fs.readFileSync(STRUCTURAL_PATH, "utf8"));
  return { catalog, slugMap: indexes.by_slug, editorial, structural };
}

function resolveCheeseId(slugMap, slug) {
  return slugMap[slug] ?? null;
}

function validateTarget(relationship, target, wine) {
  if (relationship === "pairs_with_style" || relationship === "also_pairs_with_style") {
    return wine.styleIds.has(target);
  }
  if (relationship === "pairs_with_descriptor") {
    return wine.descriptorIds.has(target);
  }
  if (relationship === "pairs_with_technique") {
    return wine.techniqueIds.has(target);
  }
  return false;
}

export function mapCheeseWineRelationships({ slugMap, catalog, wine }) {
  const cheeseIds = new Set(Object.values(slugMap));
  const edges = [];
  const seen = new Set();

  for (const entry of PAIRING_CURATED) {
    const sourceId = resolveCheeseId(slugMap, entry.source);
    if (!sourceId) {
      throw new Error(`Unknown cheese slug: ${entry.source}`);
    }
    if (!validateTarget(entry.relationship, entry.target, wine)) {
      throw new Error(`Unknown wine target: ${entry.target} for ${entry.relationship}`);
    }

    const edge = {
      source: sourceId,
      relationship: entry.relationship,
      target: entry.target,
      confidence: entry.confidence,
      derived_from: "editorial",
      evidence: entry.evidence,
      version: EDGE_VERSION,
    };

    const key = edgeKey(edge);
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push(edge);
  }

  edges.sort((a, b) => edgeKey(a).localeCompare(edgeKey(b)));

  const cheesesLinked = new Set(edges.map((e) => e.source));
  const stylesLinked = new Set(
    edges.filter((e) => e.relationship.endsWith("_style")).map((e) => e.target)
  );
  const descriptorLinks = edges.filter((e) => e.relationship === "pairs_with_descriptor").length;
  const techniqueLinks = edges.filter((e) => e.relationship === "pairs_with_technique").length;

  const typeCounts = Object.fromEntries(
    PAIRING_RELATIONSHIP_TYPES.map((type) => [type, 0])
  );
  for (const edge of edges) {
    typeCounts[edge.relationship] = (typeCounts[edge.relationship] ?? 0) + 1;
  }

  return {
    meta: {
      phase: "FOOD-04E",
      domain: "cheese",
      version: EDGE_VERSION,
      catalog_version: catalog.meta?.catalog_version ?? null,
      layer: "wine_pairing",
      relationship_types: PAIRING_RELATIONSHIP_TYPES.filter((t) => typeCounts[t] > 0),
      edge_count: edges.length,
      inputs: [
        "data/cheese-catalog.json",
        "data/runtime/cheese-indexes.json",
        "data/runtime/cheese-editorial-relationships.json",
        "data/wine-style-catalog.json",
        "data/wine-taxonomy.json",
        "data/winemaking-technique-catalog.json",
      ],
    },
    edges,
    stats: {
      cheeses_linked: cheesesLinked.size,
      wine_styles_linked: stylesLinked.size,
      descriptor_links: descriptorLinks,
      technique_links: techniqueLinks,
      pairing_edges: edges.length,
      relationship_type_counts: typeCounts,
    },
    cheeseIds,
  };
}

function validatePairing(output, wine, cheeseIds, structural, editorial) {
  const errors = [];
  const seen = new Set();
  const forbidden = new Set([
    ...structural.edges.map(edgeKey),
    ...editorial.edges.map(edgeKey),
  ]);
  let duplicates = 0;
  let missingCheese = 0;
  let missingWine = 0;

  for (const edge of output.edges) {
    const key = edgeKey(edge);
    if (seen.has(key)) {
      duplicates += 1;
      errors.push(`Duplicate pairing edge: ${key}`);
    }
    seen.add(key);

    if (edge.source === edge.target) {
      errors.push(`Self-reference: ${key}`);
    }

    if (!cheeseIds.has(edge.source)) {
      missingCheese += 1;
      errors.push(`Missing cheese entity: ${edge.source}`);
    }
    if (!edge.evidence?.trim()) {
      errors.push(`Missing evidence: ${key}`);
    }
    if (edge.confidence !== "high") {
      errors.push(`Invalid confidence: ${key}`);
    }
    if (edge.derived_from !== "editorial") {
      errors.push(`Invalid derived_from: ${key}`);
    }
    if (!validateTarget(edge.relationship, edge.target, wine)) {
      missingWine += 1;
      errors.push(`Invalid wine ontology reference: ${edge.target}`);
    }
    if (forbidden.has(key)) {
      errors.push(`Conflicts with prior layer: ${key}`);
    }
    if (!PAIRING_RELATIONSHIP_TYPES.includes(edge.relationship)) {
      errors.push(`Unknown relationship: ${edge.relationship}`);
    }
  }

  return { errors, duplicates, missingCheese, missingWine };
}

function main() {
  const { catalog, slugMap, editorial, structural } = loadCheeseInputs();
  const wine = loadWineOntology();
  const output = mapCheeseWineRelationships({ slugMap, catalog, wine });
  const validation = validatePairing(
    output,
    wine,
    output.cheeseIds,
    structural,
    editorial
  );

  const rebuilt = mapCheeseWineRelationships({ slugMap, catalog, wine });
  const determinismPass =
    serializeRuntime({ meta: output.meta, edges: output.edges }) ===
    serializeRuntime({ meta: rebuilt.meta, edges: rebuilt.edges });

  const overall =
    validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-04E",
      domain: "cheese",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      metrics: {
        "Cheeses linked": output.stats.cheeses_linked,
        "Wine styles linked": output.stats.wine_styles_linked,
        "Descriptor links": output.stats.descriptor_links,
        "Technique links": output.stats.technique_links,
        "Pairing edges": output.stats.pairing_edges,
        "Duplicate edges": validation.duplicates,
        "Missing cheese entities": validation.missingCheese,
        "Missing wine references": validation.missingWine,
        Determinism: determinismPass ? "PASS" : "FAIL",
        "Deterministic ordering": determinismPass ? "PASS" : "FAIL",
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
    phase: "FOOD-04E",
    domain: "cheese",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    validation_errors: [],
    output: "data/runtime/cheese-wine-relationships.json",
    metrics: {
      "Cheeses linked": output.stats.cheeses_linked,
      "Wine styles linked": output.stats.wine_styles_linked,
      "Descriptor links": output.stats.descriptor_links,
      "Technique links": output.stats.technique_links,
      "Pairing edges": output.stats.pairing_edges,
      "Duplicate edges": 0,
      "Missing cheese entities": 0,
      "Missing wine references": 0,
      "Invalid ontology references": 0,
      Determinism: "PASS",
      "Deterministic ordering": "PASS",
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Wine pairing relationships: ${OUTPUT_PATH}`);
  console.log(`Report: ${REPORT_PATH}`);
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main();
}
