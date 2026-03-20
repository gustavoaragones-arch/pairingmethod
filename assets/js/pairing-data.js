/**
 * Pairing Engine — authoritative poster matrix + category weights + legacy RULES.
 * Matrix cells: 0 = avoid, 1 = acceptable, 2 = strong, 3 = perfect.
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
  },
  {
    id: "pinot-noir",
    name: "Pinot Noir",
    body: 2,
    tannin: 2,
    acidity: 4,
    sweetness: 1,
    tags: ["red", "light"],
  },
  {
    id: "chardonnay",
    name: "Chardonnay",
    body: 4,
    tannin: 1,
    acidity: 3,
    sweetness: 1,
    tags: ["white", "rich"],
  },
  {
    id: "sauvignon-blanc",
    name: "Sauvignon Blanc",
    body: 2,
    tannin: 0,
    acidity: 5,
    sweetness: 1,
    tags: ["white", "light"],
  },
  {
    id: "riesling",
    name: "Riesling",
    body: 2,
    tannin: 0,
    acidity: 5,
    sweetness: 3,
    tags: ["white", "sweet"],
  },
];

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
