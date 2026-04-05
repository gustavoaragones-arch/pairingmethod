/**
 * Pairing Engine — authoritative poster matrix + category weights + legacy RULES.
 * Matrix cells: 0 = avoid, 1 = acceptable, 2 = strong, 3 = perfect.
 */

/**
 * Semantic descriptor slugs — must exist in wine-terms-data.js WINE_TERMS.
 * Keys: body, tannin, acidity, fruit, spice, earth (pairing + SEO layer).
 */
export const WINES = [
  {
    id: "cabernet",
    name: "Cabernet Sauvignon",
    body: 5,
    tannin: 5,
    acidity: 3,
    sweetness: 1,
    tags: ["red", "bold"],
    descriptors: {
      body: ["full-bodied", "powerful", "concentrated"],
      tannin: ["firm", "grippy", "tannic"],
      acidity: ["structured", "fresh"],
      fruit: ["blackberry", "cassis", "black-fruit"],
      spice: ["vanilla", "cedar", "oak"],
      earth: ["graphite", "tobacco"],
    },
  },
  {
    id: "pinot-noir",
    name: "Pinot Noir",
    body: 2,
    tannin: 2,
    acidity: 4,
    sweetness: 1,
    tags: ["red", "light"],
    descriptors: {
      body: ["light-bodied", "delicate", "elegant"],
      tannin: ["silky", "soft", "supple"],
      acidity: ["bright", "fresh", "racy"],
      fruit: ["cherry", "red-fruit"],
      spice: ["spicy"],
      earth: ["earthy", "violet"],
    },
  },
  {
    id: "chardonnay",
    name: "Chardonnay",
    body: 4,
    tannin: 1,
    acidity: 3,
    sweetness: 1,
    tags: ["white", "rich"],
    descriptors: {
      body: ["rich", "opulent", "full-bodied"],
      tannin: ["soft"],
      acidity: ["fresh", "crisp"],
      fruit: ["stone-fruit", "citrus"],
      spice: ["buttery", "vanilla", "toast", "oak"],
      earth: ["minerality"],
    },
  },
  {
    id: "sauvignon-blanc",
    name: "Sauvignon Blanc",
    body: 2,
    tannin: 0,
    acidity: 5,
    sweetness: 1,
    tags: ["white", "light"],
    descriptors: {
      body: ["light-bodied", "lean"],
      tannin: ["soft"],
      acidity: ["high-acidity", "zesty", "racy", "crisp"],
      fruit: ["citrus", "grassy"],
      spice: ["herbal", "black-pepper"],
      earth: ["minerality"],
    },
  },
  {
    id: "riesling",
    name: "Riesling",
    body: 2,
    tannin: 0,
    acidity: 5,
    sweetness: 3,
    tags: ["white", "sweet"],
    descriptors: {
      body: ["light-bodied"],
      tannin: ["soft"],
      acidity: ["high-acidity", "racy", "linear"],
      fruit: ["apricot", "citrus", "lychee"],
      spice: [],
      earth: ["minerality"],
    },
  },
];

/** Matrix column → semantic tags (for “why this works” copy + term links). */
export const WINE_STYLE_SEMANTICS = {
  bold_red: {
    body: ["full-bodied", "powerful", "concentrated"],
    tannin: ["firm", "grippy", "tannic"],
    acidity: ["structured", "fresh"],
    fruit: ["blackberry", "cassis"],
    spice: ["vanilla", "clove", "oak"],
    earth: ["graphite", "tobacco"],
  },
  medium_red: {
    body: ["structured", "rich"],
    tannin: ["supple", "firm"],
    acidity: ["bright", "balanced"],
    fruit: ["cherry", "plummy", "red-fruit"],
    spice: ["spicy", "oak"],
    earth: ["earthy", "leathery"],
  },
  light_red: {
    body: ["light-bodied", "delicate"],
    tannin: ["soft", "silky"],
    acidity: ["bright", "fresh"],
    fruit: ["red-fruit", "cherry"],
    spice: [],
    earth: ["earthy"],
  },
  rose: {
    body: ["light-bodied"],
    tannin: ["soft"],
    acidity: ["crisp", "bright"],
    fruit: ["red-fruit", "citrus"],
    spice: [],
    earth: [],
  },
  rich_white: {
    body: ["rich", "opulent"],
    tannin: ["soft"],
    acidity: ["fresh", "crisp"],
    fruit: ["stone-fruit", "citrus"],
    spice: ["buttery", "vanilla", "toast", "oak"],
    earth: ["minerality"],
  },
  light_white: {
    body: ["light-bodied", "lean"],
    tannin: ["soft"],
    acidity: ["high-acidity", "crisp", "zesty"],
    fruit: ["citrus"],
    spice: ["herbal"],
    earth: ["minerality", "grassy"],
  },
  sparkling: {
    body: ["light-bodied"],
    tannin: ["soft"],
    acidity: ["high-acidity", "racy", "crisp"],
    fruit: ["citrus", "stone-fruit"],
    spice: ["toast", "brioche"],
    earth: ["minerality"],
  },
  sweet_white: {
    body: ["rich"],
    tannin: ["soft"],
    acidity: ["racy", "bright"],
    fruit: ["apricot", "lychee", "ripe", "lush"],
    spice: [],
    earth: [],
  },
  dessert: {
    body: ["opulent"],
    tannin: ["soft"],
    acidity: ["balanced"],
    fruit: ["honeyed", "marmalade"],
    spice: ["toffee", "caramel"],
    earth: [],
  },
};

/** Legacy attribute rules — retained for future hybrid layering. */
export const RULES = {
  protein: {
    beef: { tannin: 5, body: 5 },
    chicken: { body: 3 },
    fish: { acidity: 4, body: 2 },
    pork: { body: 3 },
  },
  preparation: {
    grilled: { body: 4, tannin: 4 },
    roasted: { body: 3 },
    fried: { acidity: 4 },
    raw: { acidity: 5 },
  },
  richness: {
    light: { body: 2 },
    medium: { body: 3 },
    high: { body: 5 },
  },
  spice: {
    none: {},
    mild: { sweetness: 2 },
    spicy: { sweetness: 4 },
  },
};

export const ATTR_LABELS = {
  body: "body / weight",
  tannin: "tannin",
  acidity: "acidity",
  sweetness: "sweetness",
};

export const WINE_STYLES = [
  "bold_red",
  "medium_red",
  "light_red",
  "rose",
  "rich_white",
  "light_white",
  "sparkling",
  "sweet_white",
  "dessert",
];

/** Importance multipliers when summing matrix contributions (protein > prep ≈ spice > …). */
export const CATEGORY_WEIGHTS = {
  protein: 3,
  preparation: 2,
  spice: 2,
  dairy: 1.5,
  vegetable: 1,
  starch: 1,
};

/**
 * UI + state keys: each value must exist as a key in PAIRING_MATRIX.
 */
export const FOOD_NODES = {
  protein: [
    "red_meat",
    "cured_meat",
    "pork",
    "poultry",
    "fish",
    "shellfish",
  ],
  preparation: ["grilled", "roasted", "fried", "poached", "smoked"],
  dairy: ["soft_cheese", "hard_cheese", "pungent_cheese"],
  vegetable: ["green", "root", "fungi", "nightshade"],
  spice: ["black_pepper", "herbs", "spicy", "aromatic_spice"],
  starch: ["white_starch", "sweet_starch", "fruit", "chocolate"],
};

/** Authoritative poster matrix — complete rows (Wine Folly digital edition alignment). */
export const PAIRING_MATRIX = {
  // PROTEIN
  red_meat: {
    bold_red: 3,
    medium_red: 2,
    light_red: 1,
    rose: 0,
    rich_white: 0,
    light_white: 0,
    sparkling: 1,
    sweet_white: 0,
    dessert: 0,
  },
  cured_meat: {
    bold_red: 2,
    medium_red: 3,
    light_red: 2,
    rose: 1,
    rich_white: 1,
    light_white: 1,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },
  pork: {
    bold_red: 2,
    medium_red: 3,
    light_red: 2,
    rose: 2,
    rich_white: 2,
    light_white: 1,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },
  poultry: {
    bold_red: 1,
    medium_red: 2,
    light_red: 3,
    rose: 2,
    rich_white: 2,
    light_white: 2,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },
  fish: {
    bold_red: 0,
    medium_red: 1,
    light_red: 2,
    rose: 2,
    rich_white: 2,
    light_white: 3,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },
  shellfish: {
    bold_red: 0,
    medium_red: 0,
    light_red: 2,
    rose: 2,
    rich_white: 2,
    light_white: 3,
    sparkling: 3,
    sweet_white: 1,
    dessert: 0,
  },

  // PREPARATION
  grilled: {
    bold_red: 3,
    medium_red: 2,
    light_red: 1,
    rose: 1,
    rich_white: 1,
    light_white: 0,
    sparkling: 1,
    sweet_white: 0,
    dessert: 0,
  },
  roasted: {
    bold_red: 2,
    medium_red: 3,
    light_red: 2,
    rose: 2,
    rich_white: 2,
    light_white: 1,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },
  fried: {
    bold_red: 1,
    medium_red: 2,
    light_red: 2,
    rose: 2,
    rich_white: 2,
    light_white: 2,
    sparkling: 3,
    sweet_white: 1,
    dessert: 0,
  },
  poached: {
    bold_red: 0,
    medium_red: 1,
    light_red: 2,
    rose: 2,
    rich_white: 2,
    light_white: 3,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },
  smoked: {
    bold_red: 3,
    medium_red: 2,
    light_red: 1,
    rose: 1,
    rich_white: 1,
    light_white: 0,
    sparkling: 1,
    sweet_white: 0,
    dessert: 0,
  },

  // DAIRY
  soft_cheese: {
    bold_red: 1,
    medium_red: 2,
    light_red: 2,
    rose: 2,
    rich_white: 3,
    light_white: 3,
    sparkling: 2,
    sweet_white: 2,
    dessert: 1,
  },
  hard_cheese: {
    bold_red: 3,
    medium_red: 3,
    light_red: 2,
    rose: 1,
    rich_white: 2,
    light_white: 1,
    sparkling: 2,
    sweet_white: 1,
    dessert: 1,
  },
  pungent_cheese: {
    bold_red: 2,
    medium_red: 2,
    light_red: 1,
    rose: 1,
    rich_white: 1,
    light_white: 1,
    sparkling: 2,
    sweet_white: 3,
    dessert: 2,
  },

  // VEGETABLE
  green: {
    bold_red: 0,
    medium_red: 1,
    light_red: 2,
    rose: 2,
    rich_white: 2,
    light_white: 3,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },
  root: {
    bold_red: 2,
    medium_red: 2,
    light_red: 2,
    rose: 2,
    rich_white: 2,
    light_white: 1,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },
  fungi: {
    bold_red: 2,
    medium_red: 3,
    light_red: 3,
    rose: 1,
    rich_white: 2,
    light_white: 1,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },
  nightshade: {
    bold_red: 2,
    medium_red: 2,
    light_red: 2,
    rose: 2,
    rich_white: 2,
    light_white: 1,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },

  // SPICE
  black_pepper: {
    bold_red: 3,
    medium_red: 3,
    light_red: 2,
    rose: 1,
    rich_white: 1,
    light_white: 1,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },
  herbs: {
    bold_red: 2,
    medium_red: 2,
    light_red: 3,
    rose: 2,
    rich_white: 2,
    light_white: 3,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },
  spicy: {
    bold_red: 0,
    medium_red: 1,
    light_red: 1,
    rose: 2,
    rich_white: 1,
    light_white: 2,
    sparkling: 2,
    sweet_white: 3,
    dessert: 1,
  },
  aromatic_spice: {
    bold_red: 1,
    medium_red: 2,
    light_red: 2,
    rose: 2,
    rich_white: 2,
    light_white: 2,
    sparkling: 2,
    sweet_white: 2,
    dessert: 1,
  },

  // STARCH / SWEET
  white_starch: {
    bold_red: 2,
    medium_red: 2,
    light_red: 2,
    rose: 2,
    rich_white: 2,
    light_white: 2,
    sparkling: 2,
    sweet_white: 1,
    dessert: 0,
  },
  sweet_starch: {
    bold_red: 1,
    medium_red: 1,
    light_red: 2,
    rose: 2,
    rich_white: 2,
    light_white: 2,
    sparkling: 2,
    sweet_white: 2,
    dessert: 1,
  },
  fruit: {
    bold_red: 1,
    medium_red: 1,
    light_red: 2,
    rose: 3,
    rich_white: 2,
    light_white: 2,
    sparkling: 2,
    sweet_white: 3,
    dessert: 2,
  },
  chocolate: {
    bold_red: 1,
    medium_red: 1,
    light_red: 0,
    rose: 0,
    rich_white: 0,
    light_white: 0,
    sparkling: 1,
    sweet_white: 2,
    dessert: 3,
  },
};

const GROUP_LABELS = {
  protein: "Protein",
  preparation: "Preparation",
  dairy: "Dairy",
  vegetable: "Vegetable",
  spice: "Herb & spice",
  starch: "Starch & sweet",
};

function formatNodeLabel(value) {
  return value
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const FILTER_GROUPS = Object.keys(FOOD_NODES).map((key) => ({
  key,
  label: GROUP_LABELS[key] || formatNodeLabel(key),
  options: FOOD_NODES[key].map((value) => ({
    value,
    label: formatNodeLabel(value),
  })),
}));
