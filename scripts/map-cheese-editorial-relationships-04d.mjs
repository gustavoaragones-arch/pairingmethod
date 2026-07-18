#!/usr/bin/env node
/**
 * FOOD-04D — Editorial relationship mapper for cheese ontology.
 * Curated, evidence-backed semantics — separate from structural relationships.
 * Does not modify catalog, runtime indexes, or structural relationship layer.
 *
 * Run: node scripts/map-cheese-editorial-relationships-04d.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-cheese-catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "data/runtime");
const CATALOG_PATH = path.join(ROOT, "data/cheese-catalog.json");
const STRUCTURAL_PATH = path.join(RUNTIME_DIR, "cheese-relationships.json");
const OUTPUT_PATH = path.join(RUNTIME_DIR, "cheese-editorial-relationships.json");
const REPORT_PATH = path.join(ROOT, "reports/editorial-relationship-report.json");
const EDGE_VERSION = "1.0";

const EDITORIAL_RELATIONSHIP_TYPES = [
  "similar_to",
  "substitutes_for",
  "same_family",
  "commonly_served_with",
];

const SYMMETRIC_TYPES = new Set(["similar_to", "same_family"]);

/** Forward references to future Food Ontology domains — not validated against cheese runtime. */
const FORWARD_REFERENCE_IDS = new Set([
  "food.bread.baguette",
  "food.bread.sourdough",
  "food.fruit.apple",
  "food.fruit.fig",
  "food.fruit.grape",
  "food.fruit.pear",
  "food.ingredient.almonds",
  "food.ingredient.crackers",
  "food.ingredient.honey",
  "food.ingredient.olives",
  "food.ingredient.quince-paste",
  "food.ingredient.walnuts",
  "food.protein.charcuterie.prosciutto",
  "food.protein.charcuterie.salami",
]);

/**
 * Curated v1 editorial edges (slug references resolved at map time).
 * @type {Array<{ relationship: string, source: string, target: string, confidence: string, evidence: string }>}
 */
const EDITORIAL_CURATED = [
  // —— similar_to ——
  {
    relationship: "similar_to",
    source: "brie-de-meaux",
    target: "camembert-de-normandie",
    confidence: "high",
    evidence: "Both are soft cow-milk bloomy-rind cheeses with comparable melting texture and table-cheese service.",
  },
  {
    relationship: "similar_to",
    source: "brie-de-meaux",
    target: "coulommiers",
    confidence: "high",
    evidence: "Coulommiers is a larger-format bloomy-rind cheese with a similar creamy profile to Brie.",
  },
  {
    relationship: "similar_to",
    source: "gruyere",
    target: "emmental",
    confidence: "high",
    evidence: "Both are Alpine cow-milk semi-hard cheeses used for melting, fondue, and gratins.",
  },
  {
    relationship: "similar_to",
    source: "gruyere",
    target: "comte",
    confidence: "high",
    evidence: "Comté and Gruyère share Jura-Alpine aging character and cooking applications.",
  },
  {
    relationship: "similar_to",
    source: "roquefort",
    target: "stilton",
    confidence: "high",
    evidence: "Both are benchmark blue cheeses with bold salinity and crumbling service on cheese boards.",
  },
  {
    relationship: "similar_to",
    source: "roquefort",
    target: "gorgonzola-picante",
    confidence: "high",
    evidence: "Both are assertive blue cheeses used as pungent finishing elements in savory cooking.",
  },
  {
    relationship: "similar_to",
    source: "parmigiano-reggiano",
    target: "grana-padano",
    confidence: "high",
    evidence: "Both are granular aged grana cheeses used for grating over pasta and risotto.",
  },
  {
    relationship: "similar_to",
    source: "mozzarella-fior-di-latte",
    target: "mozzarella-di-bufala",
    confidence: "high",
    evidence: "Both are fresh pasta-filata mozzarellas used interchangeably on pizza and in caprese salads.",
  },
  {
    relationship: "similar_to",
    source: "epoisses",
    target: "munster",
    confidence: "high",
    evidence: "Both are pungent washed-rind soft cheeses with strong aroma and spoonable texture when ripe.",
  },
  {
    relationship: "similar_to",
    source: "taleggio",
    target: "reblochon",
    confidence: "high",
    evidence: "Both are soft washed-rind Alpine cheeses suited to melting in tarts and potato dishes.",
  },
  {
    relationship: "similar_to",
    source: "havarti",
    target: "jarlsberg",
    confidence: "high",
    evidence: "Both are mild, supple semi-hard cheeses with broad sandwich and snacking appeal.",
  },
  {
    relationship: "similar_to",
    source: "edam",
    target: "gouda-young",
    confidence: "high",
    evidence: "Both are Dutch semi-hard cow cheeses with mild sweetness and melting behavior.",
  },
  {
    relationship: "similar_to",
    source: "fourme-dambert",
    target: "bleu-dauvergne",
    confidence: "high",
    evidence: "Both are French cow-milk blue cheeses with creamy paste and moderate pungency.",
  },
  {
    relationship: "similar_to",
    source: "point-reyes-blue",
    target: "stilton",
    confidence: "high",
    evidence: "Both are creamy-crumbly blue cheeses positioned as premium board and salad blues.",
  },
  {
    relationship: "similar_to",
    source: "goat-chevre-log",
    target: "fresh-goat-cheese",
    confidence: "high",
    evidence: "Both denote fresh chèvre with tart lactic flavor and spreadable service.",
  },
  {
    relationship: "similar_to",
    source: "manchego-curado",
    target: "manchego-viejo",
    confidence: "high",
    evidence: "Both are Manchego expressions differing mainly in age rather than culinary role.",
  },
  {
    relationship: "similar_to",
    source: "provolone-dolce",
    target: "provolone-picante",
    confidence: "high",
    evidence: "Both are Provolone pasta-filata cheeses used for slicing, melting, and antipasto.",
  },
  {
    relationship: "similar_to",
    source: "saint-marcellin",
    target: "reblochon",
    confidence: "high",
    evidence: "Both are small-format soft cheeses with washed or washed-leaning rinds for ripe service.",
  },
  {
    relationship: "similar_to",
    source: "telemea",
    target: "feta",
    confidence: "high",
    evidence: "Both are brined white cheeses with crumbly texture and salty finish in Mediterranean cooking.",
  },
  {
    relationship: "similar_to",
    source: "pecorino-romano",
    target: "pecorino-sardo",
    confidence: "high",
    evidence: "Both are aged sheep pecorinos used as grating and finishing cheeses in Italian cuisine.",
  },

  // —— substitutes_for (directional) ——
  {
    relationship: "substitutes_for",
    source: "grana-padano",
    target: "parmigiano-reggiano",
    confidence: "high",
    evidence: "Grana Padano is the standard grating substitute when Parmigiano-Reggiano is unavailable.",
  },
  {
    relationship: "substitutes_for",
    source: "parmesan",
    target: "parmigiano-reggiano",
    confidence: "high",
    evidence: "Generic Parmesan is commonly used as a practical substitute for Parmigiano-Reggiano in cooking.",
  },
  {
    relationship: "substitutes_for",
    source: "reggianito",
    target: "parmigiano-reggiano",
    confidence: "high",
    evidence: "Reggianito is an Argentine hard grana used as a Parmigiano substitute in Latin American kitchens.",
  },
  {
    relationship: "substitutes_for",
    source: "emmental",
    target: "gruyere",
    confidence: "high",
    evidence: "Emmental is a common melting substitute for Gruyère in fondue and gratins.",
  },
  {
    relationship: "substitutes_for",
    source: "swiss",
    target: "emmental",
    confidence: "high",
    evidence: "North American Swiss cheese is routinely substituted for Emmental in sandwiches and melts.",
  },
  {
    relationship: "substitutes_for",
    source: "jarlsberg",
    target: "emmental",
    confidence: "high",
    evidence: "Jarlsberg is substituted for Emmental where a mild holey melting cheese is needed.",
  },
  {
    relationship: "substitutes_for",
    source: "red-leicester",
    target: "cheddar",
    confidence: "high",
    evidence: "Red Leicester is substituted for Cheddar in British pub and sandwich contexts.",
  },
  {
    relationship: "substitutes_for",
    source: "colby",
    target: "cheddar",
    confidence: "high",
    evidence: "Colby is a milder direct substitute for Cheddar in melting and snacking applications.",
  },
  {
    relationship: "substitutes_for",
    source: "monterey-jack",
    target: "colby",
    confidence: "high",
    evidence: "Monterey Jack is commonly substituted for Colby in Tex-Mex and melting recipes.",
  },
  {
    relationship: "substitutes_for",
    source: "double-gloucester",
    target: "cheddar",
    confidence: "high",
    evidence: "Double Gloucester fills the same English territorial hard-cheese role as Cheddar on boards.",
  },
  {
    relationship: "substitutes_for",
    source: "brie-de-nangis",
    target: "brie-de-meaux",
    confidence: "high",
    evidence: "Brie de Nangis is a smaller-format substitute for Brie de Meaux on cheese boards.",
  },
  {
    relationship: "substitutes_for",
    source: "danish-blue",
    target: "stilton",
    confidence: "high",
    evidence: "Danish Blue is widely substituted for Stilton in salads and blue-cheese dressings.",
  },
  {
    relationship: "substitutes_for",
    source: "castello-blue",
    target: "danish-blue",
    confidence: "high",
    evidence: "Castello Blue is a mild creamy substitute for Danish Blue in approachable blue-cheese service.",
  },
  {
    relationship: "substitutes_for",
    source: "burrata",
    target: "mozzarella-fior-di-latte",
    confidence: "high",
    evidence: "Burrata is substituted with mozzarella when a stracciatella center is not required.",
  },
  {
    relationship: "substitutes_for",
    source: "mozzarella-fior-di-latte",
    target: "burrata",
    confidence: "high",
    evidence: "Fresh mozzarella is substituted for burrata when a simpler caprese or pizza cheese is needed.",
  },
  {
    relationship: "substitutes_for",
    source: "scamorza-affumicata",
    target: "provolone",
    confidence: "high",
    evidence: "Smoked scamorza is substituted for provolone in grilled and melted Southern Italian dishes.",
  },
  {
    relationship: "substitutes_for",
    source: "telemea",
    target: "feta",
    confidence: "high",
    evidence: "Telemea is substituted for feta in Balkan salads and baked dishes when Greek PDO feta is unavailable.",
  },
  {
    relationship: "substitutes_for",
    source: "sirene",
    target: "feta",
    confidence: "high",
    evidence: "Sirene is a standard Bulgarian substitute for feta in shopska salad and pastry fillings.",
  },
  {
    relationship: "substitutes_for",
    source: "manchego-curado",
    target: "manchego-viejo",
    confidence: "high",
    evidence: "Curado Manchego is substituted for viejo when a less intense aged sheep cheese is preferred.",
  },
  {
    relationship: "substitutes_for",
    source: "kashkaval",
    target: "kasseri",
    confidence: "high",
    evidence: "Kashkaval is substituted for Kasseri in Balkan and Eastern Mediterranean grilled cheese dishes.",
  },
  {
    relationship: "substitutes_for",
    source: "gouda-young",
    target: "edam",
    confidence: "high",
    evidence: "Young Gouda is substituted for Edam in Dutch-style sandwiches and melting applications.",
  },
  {
    relationship: "substitutes_for",
    source: "ricotta",
    target: "mascarpone",
    confidence: "high",
    evidence: "Ricotta is substituted for mascarpone in some fillings when a lighter fresh cheese is needed.",
  },
  {
    relationship: "substitutes_for",
    source: "fromage-blanc",
    target: "quark",
    confidence: "high",
    evidence: "Fromage blanc is substituted for quark in European-style spreads and baking.",
  },

  // —— same_family ——
  {
    relationship: "same_family",
    source: "cheddar",
    target: "clothbound-cheddar",
    confidence: "high",
    evidence: "Both belong to the English Cheddar lineage differing in clothbinding and aging expression.",
  },
  {
    relationship: "same_family",
    source: "cheddar",
    target: "aged-cheddar",
    confidence: "high",
    evidence: "Aged Cheddar is an expression of the same Cheddar family with extended maturation.",
  },
  {
    relationship: "same_family",
    source: "red-leicester",
    target: "double-gloucester",
    confidence: "high",
    evidence: "Both are traditional English territorial hard cheeses with regional board identity.",
  },
  {
    relationship: "same_family",
    source: "red-leicester",
    target: "wensleydale",
    confidence: "high",
    evidence: "Both are recognized English regional cheeses with crumbly to firm board traditions.",
  },
  {
    relationship: "same_family",
    source: "parmigiano-reggiano",
    target: "grana-padano",
    confidence: "high",
    evidence: "Both belong to the Italian grana family of hard grating cheeses.",
  },
  {
    relationship: "same_family",
    source: "pecorino-romano",
    target: "pecorino-sardo",
    confidence: "high",
    evidence: "Both are Pecorino sheep-milk cheeses within the Italian pecorino family.",
  },
  {
    relationship: "same_family",
    source: "pecorino-romano",
    target: "pecorino-toscano",
    confidence: "high",
    evidence: "Pecorino Romano and Pecorino Toscano share the pecorino sheep-cheese lineage.",
  },
  {
    relationship: "same_family",
    source: "gorgonzola",
    target: "gorgonzola-dolce",
    confidence: "high",
    evidence: "Gorgonzola Dolce is a recognized sweet expression within the Gorgonzola family.",
  },
  {
    relationship: "same_family",
    source: "gorgonzola",
    target: "gorgonzola-picante",
    confidence: "high",
    evidence: "Gorgonzola Piccante is the aged sharp expression of the Gorgonzola family.",
  },
  {
    relationship: "same_family",
    source: "brie-de-meaux",
    target: "brie-de-melun",
    confidence: "high",
    evidence: "Both are protected Brie family cheeses from Île-de-France with distinct size and ripening.",
  },
  {
    relationship: "same_family",
    source: "brie-de-meaux",
    target: "brie-de-nangis",
    confidence: "high",
    evidence: "Brie de Nangis is a smaller member of the Brie family alongside Brie de Meaux.",
  },
  {
    relationship: "same_family",
    source: "manchego-curado",
    target: "manchego-viejo",
    confidence: "high",
    evidence: "Both are age-tier expressions within the Manchego family.",
  },
  {
    relationship: "same_family",
    source: "comte",
    target: "gruyere",
    confidence: "high",
    evidence: "Comté and Gruyère belong to the Franco-Swiss Alpine cooked-press family.",
  },
  {
    relationship: "same_family",
    source: "emmental",
    target: "swiss",
    confidence: "high",
    evidence: "Swiss cheese in North America derives from the Emmental family tradition.",
  },
  {
    relationship: "same_family",
    source: "emmental",
    target: "jarlsberg",
    confidence: "high",
    evidence: "Jarlsberg is a Norwegian expression within the broader holey Alpine-Emmental family.",
  },
  {
    relationship: "same_family",
    source: "roquefort",
    target: "cabrales",
    confidence: "high",
    evidence: "Both are benchmark European blue-cheese families with protected regional identity.",
  },
  {
    relationship: "same_family",
    source: "feta",
    target: "telemea",
    confidence: "high",
    evidence: "Feta and Telemea belong to the Balkan brined white-cheese family.",
  },
  {
    relationship: "same_family",
    source: "feta",
    target: "sirene",
    confidence: "high",
    evidence: "Feta and Sirene share the Eastern Mediterranean brined sheep-cheese family.",
  },
  {
    relationship: "same_family",
    source: "provolone",
    target: "caciocavallo",
    confidence: "high",
    evidence: "Both are Southern Italian pasta-filata family cheeses traditionally hung to age.",
  },
  {
    relationship: "same_family",
    source: "provolone",
    target: "scamorza-affumicata",
    confidence: "high",
    evidence: "Scamorza is a smoked member of the Southern Italian pasta-filata family alongside Provolone.",
  },

  // —— commonly_served_with (directional; forward refs allowed) ——
  {
    relationship: "commonly_served_with",
    source: "brie-de-meaux",
    target: "food.fruit.grape",
    confidence: "high",
    evidence: "Fresh grapes are a classic Brie board accompaniment balancing creamy fat with juicy acidity.",
  },
  {
    relationship: "commonly_served_with",
    source: "camembert-de-normandie",
    target: "food.bread.baguette",
    confidence: "high",
    evidence: "Warm baguette is the canonical carrier for ripe Camembert in French service.",
  },
  {
    relationship: "commonly_served_with",
    source: "roquefort",
    target: "food.fruit.fig",
    confidence: "high",
    evidence: "Fresh or dried figs are a stable Roquefort pairing on cheese boards.",
  },
  {
    relationship: "commonly_served_with",
    source: "stilton",
    target: "food.fruit.pear",
    confidence: "high",
    evidence: "Ripe pear is a long-established Stilton board companion in British cheese service.",
  },
  {
    relationship: "commonly_served_with",
    source: "parmigiano-reggiano",
    target: "food.ingredient.honey",
    confidence: "high",
    evidence: "Aged Parmigiano with honey is a recognized Italian antipasto and dessert cheese service.",
  },
  {
    relationship: "commonly_served_with",
    source: "manchego-curado",
    target: "food.ingredient.quince-paste",
    confidence: "high",
    evidence: "Membrillo with Manchego is canonical Spanish tapas service.",
  },
  {
    relationship: "commonly_served_with",
    source: "manchego-viejo",
    target: "food.ingredient.quince-paste",
    confidence: "high",
    evidence: "Membrillo accompanies aged Manchego on Spanish cheese boards.",
  },
  {
    relationship: "commonly_served_with",
    source: "cheddar",
    target: "food.bread.sourdough",
    confidence: "high",
    evidence: "Cheddar on sourdough is a stable pub and lunch pairing in English cheese service.",
  },
  {
    relationship: "commonly_served_with",
    source: "clothbound-cheddar",
    target: "food.bread.sourdough",
    confidence: "high",
    evidence: "Artisan Cheddar with sourdough is standard English farmhouse cheese service.",
  },
  {
    relationship: "commonly_served_with",
    source: "gouda-young",
    target: "food.ingredient.walnuts",
    confidence: "high",
    evidence: "Walnuts with Gouda are a classic Dutch cheese board accompaniment.",
  },
  {
    relationship: "commonly_served_with",
    source: "aged-gouda",
    target: "food.ingredient.walnuts",
    confidence: "high",
    evidence: "Aged Gouda with walnuts is established Dutch cheese course service.",
  },
  {
    relationship: "commonly_served_with",
    source: "goat-chevre-log",
    target: "food.ingredient.honey",
    confidence: "high",
    evidence: "Fresh chèvre with honey is a stable bistro and salad cheese accompaniment.",
  },
  {
    relationship: "commonly_served_with",
    source: "fresh-goat-cheese",
    target: "food.ingredient.honey",
    confidence: "high",
    evidence: "Honey drizzle over fresh goat cheese is a standard Mediterranean appetizer service.",
  },
  {
    relationship: "commonly_served_with",
    source: "parmigiano-reggiano",
    target: "food.protein.charcuterie.prosciutto",
    confidence: "high",
    evidence: "Parmigiano with prosciutto is canonical Italian antipasto service.",
  },
  {
    relationship: "commonly_served_with",
    source: "pecorino-romano",
    target: "food.ingredient.olives",
    confidence: "high",
    evidence: "Pecorino with olives is a stable Roman aperitivo cheese accompaniment.",
  },
  {
    relationship: "commonly_served_with",
    source: "comte",
    target: "food.ingredient.crackers",
    confidence: "high",
    evidence: "Neutral crackers are a standard Comté board carrier in French cheese service.",
  },
  {
    relationship: "commonly_served_with",
    source: "gruyere",
    target: "food.ingredient.crackers",
    confidence: "high",
    evidence: "Crackers with Gruyère are common Swiss and Alpine cheese board service.",
  },
  {
    relationship: "commonly_served_with",
    source: "epoisses",
    target: "food.bread.baguette",
    confidence: "high",
    evidence: "Baguette is the traditional carrier for spoonable Époisses in Burgundian service.",
  },
  {
    relationship: "commonly_served_with",
    source: "mont-dor",
    target: "food.bread.baguette",
    confidence: "high",
    evidence: "Vacherin Mont d'Or is traditionally served oven-melted with bread for dipping.",
  },
  {
    relationship: "commonly_served_with",
    source: "brie-de-meaux",
    target: "food.ingredient.crackers",
    confidence: "high",
    evidence: "Plain crackers are a common neutral carrier for soft Brie on cheese boards.",
  },
  {
    relationship: "commonly_served_with",
    source: "gorgonzola",
    target: "food.protein.charcuterie.salami",
    confidence: "high",
    evidence: "Blue cheese with salami is a stable Italian antipasto board pairing.",
  },
  {
    relationship: "commonly_served_with",
    source: "goat-chevre-log",
    target: "food.ingredient.almonds",
    confidence: "high",
    evidence: "Toasted almonds with chèvre are a standard bistro cheese accompaniment.",
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

function loadInputs() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const indexes = JSON.parse(fs.readFileSync(path.join(RUNTIME_DIR, "cheese-indexes.json"), "utf8"));
  const structural = JSON.parse(fs.readFileSync(STRUCTURAL_PATH, "utf8"));
  return { catalog, slugMap: indexes.by_slug, structural };
}

function resolveCheeseId(slugMap, slug) {
  return slugMap[slug] ?? null;
}

function canonicalPair(source, target) {
  return source.localeCompare(target) <= 0 ? [source, target] : [target, source];
}

function isForwardReference(id) {
  return FORWARD_REFERENCE_IDS.has(id);
}

export function mapCheeseEditorialRelationships({ slugMap, catalog }) {
  const cheeseIds = new Set(Object.values(slugMap));
  const edges = [];
  const seen = new Set();
  const forwardReferencesUsed = new Set();

  for (const entry of EDITORIAL_CURATED) {
    const sourceId = resolveCheeseId(slugMap, entry.source);
    if (!sourceId) {
      throw new Error(`Unknown source slug: ${entry.source}`);
    }

    let targetId = entry.target;
    if (entry.relationship === "commonly_served_with" && isForwardReference(entry.target)) {
      forwardReferencesUsed.add(entry.target);
    } else {
      targetId = resolveCheeseId(slugMap, entry.target);
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
      evidence: entry.evidence,
      version: EDGE_VERSION,
    };

    const key = edgeKey(edge);
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push(edge);
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
      phase: "FOOD-04D",
      domain: "cheese",
      version: EDGE_VERSION,
      catalog_version: catalog.meta?.catalog_version ?? null,
      layer: "editorial",
      relationship_types: usedTypes,
      edge_count: edges.length,
      forward_references: [...forwardReferencesUsed].sort(),
      inputs: [
        "data/cheese-catalog.json",
        "data/runtime/cheese-indexes.json",
        "data/runtime/cheese-relationships.json",
      ],
    },
    edges,
    stats: {
      relationship_types: usedTypes.length,
      total_edges: edges.length,
      relationship_type_counts: typeCounts,
      forward_reference_count: forwardReferencesUsed.size,
    },
    cheeseIds,
  };
}

function validateEditorial(output, structural, cheeseIds) {
  const errors = [];
  const seen = new Set();
  const structuralKeys = new Set(structural.edges.map(edgeKey));
  let duplicates = 0;
  let missingEntities = 0;
  let orphanForwardRefs = 0;
  let conflicts = 0;

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

    if (!cheeseIds.has(edge.source)) {
      missingEntities += 1;
      errors.push(`Missing source entity: ${edge.source}`);
    }

    if (edge.relationship === "commonly_served_with" && isForwardReference(edge.target)) {
      if (!FORWARD_REFERENCE_IDS.has(edge.target)) {
        orphanForwardRefs += 1;
        errors.push(`Undocumented forward reference: ${edge.target}`);
      }
    } else if (!cheeseIds.has(edge.target)) {
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
    if (edge.confidence !== "high") {
      errors.push(`Invalid confidence on ${key}`);
    }
    if (!edge.evidence || !edge.evidence.trim()) {
      errors.push(`Missing evidence on ${key}`);
    }
    if (!EDITORIAL_RELATIONSHIP_TYPES.includes(edge.relationship)) {
      errors.push(`Unknown relationship type: ${edge.relationship}`);
    }
  }

  return { errors, duplicates, missingEntities, orphanForwardRefs, conflicts };
}

function main() {
  const { catalog, slugMap, structural } = loadInputs();
  const output = mapCheeseEditorialRelationships({ slugMap, catalog });
  const validation = validateEditorial(output, structural, output.cheeseIds);
  const rebuilt = mapCheeseEditorialRelationships({ slugMap, catalog });
  const determinismPass =
    serializeRuntime({ meta: output.meta, edges: output.edges }) ===
    serializeRuntime({ meta: rebuilt.meta, edges: rebuilt.edges });

  const overall =
    validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "FOOD-04D",
      domain: "cheese",
      overall_result: "FAIL",
      errors: validation.errors,
      metrics: {
        "Editorial relationship types": output.stats.relationship_types,
        "Editorial edges": output.stats.total_edges,
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
    phase: "FOOD-04D",
    domain: "cheese",
    catalog_version: output.meta.catalog_version,
    overall_result: "PASS",
    errors: [],
    output: "data/runtime/cheese-editorial-relationships.json",
    forward_references: output.meta.forward_references,
    metrics: {
      "Editorial relationship types": output.stats.relationship_types,
      "Editorial edges": output.stats.total_edges,
      "Duplicate edges": 0,
      "Missing entities": 0,
      "Forward reference orphans": 0,
      Conflicts: 0,
      Determinism: "PASS",
      "Deterministic ordering": "PASS",
      "Overall result": "PASS",
    },
    relationship_type_counts: output.stats.relationship_type_counts,
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
