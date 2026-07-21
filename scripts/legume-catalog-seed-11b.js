/**
 * FOOD-11B — Canonical legume seed data.
 * Each entry is one canonical culinary ingredient (CANON-001).
 */

/** @typedef {object} LegumeSeed
 * @property {string} slug
 * @property {string} display_name
 * @property {"beans"|"peas"|"lentils"|"chickpeas"|"other-legumes"|"legume-products"} parent_group
 * @property {string} scientific_name
 * @property {"primary"|"accent"|"luxury"} usage_intensity
 * @property {string[]} [aliases]
 * @property {string[]} [common_names]
 * @property {string} [origin_context]
 * @property {string} [summary]
 * @property {string} [culinary_role]
 */

export const GROUP_SLUGS = [
  "beans",
  "peas",
  "lentils",
  "chickpeas",
  "other-legumes",
  "legume-products",
];

export const GROUP_TO_CULINARY_GROUP = {
  beans: "beans",
  peas: "peas",
  lentils: "lentils",
  chickpeas: "chickpeas",
  "other-legumes": "other_legumes",
  "legume-products": "legume_products",
};

function summary(seed) {
  if (seed.summary) return seed.summary;
  const role = seed.culinary_role ?? "stew and pulse cookery";
  return `${seed.display_name} is a canonical ${role} ingredient — ${seed.parent_group.replace(/-/g, " ")} use in global pulse cooking pairs with earthy reds, aromatic whites, and spice-friendly rosé.`;
}

/** @param {Omit<LegumeSeed, "summary"> & { summary?: string }} seed */
function entry(seed) {
  return { ...seed, summary: summary(seed) };
}

/** @type {LegumeSeed[]} */
export const LEGUME_SEED = [
  // —— Beans (26) ——
  entry({ slug: "kidney-bean", display_name: "Kidney Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "primary", culinary_role: "chili and Latin American stew", common_names: ["Red Kidney Bean"], aliases: ["Red Kidney Beans"] }),
  entry({ slug: "black-bean", display_name: "Black Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "primary", culinary_role: "Caribbean and Latin American stew", aliases: ["Mashed Black Beans", "Frijoles Negros"] }),
  entry({ slug: "pinto-bean", display_name: "Pinto Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "primary", culinary_role: "Mexican refried bean and burrito" }),
  entry({ slug: "navy-bean", display_name: "Navy Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "primary", culinary_role: "American baked bean and soup" }),
  entry({ slug: "cannellini-bean", display_name: "Cannellini Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "primary", culinary_role: "Italian white bean stew and ribollita", common_names: ["White Kidney Bean"] }),
  entry({ slug: "great-northern-bean", display_name: "Great Northern Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "American white bean soup and casserole" }),
  entry({ slug: "lima-bean", display_name: "Lima Bean", parent_group: "beans", scientific_name: "Phaseolus lunatus", usage_intensity: "primary", culinary_role: "succotash and Southern side dish" }),
  entry({ slug: "fava-bean", display_name: "Fava Bean", parent_group: "beans", scientific_name: "Vicia faba", usage_intensity: "primary", culinary_role: "Mediterranean spring stew and fava puree", common_names: ["Broad Bean"] }),
  entry({ slug: "cranberry-bean", display_name: "Cranberry Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "Italian borlotti-style minestrone", common_names: ["Borlotti Bean"] }),
  entry({ slug: "borlotti-bean", display_name: "Borlotti Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "Northern Italian pasta e fagioli" }),
  entry({ slug: "butter-bean", display_name: "Butter Bean", parent_group: "beans", scientific_name: "Phaseolus lunatus", usage_intensity: "accent", culinary_role: "Southern butter bean stew" }),
  entry({ slug: "pink-bean", display_name: "Pink Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "Southwestern chili and refried bean" }),
  entry({ slug: "small-red-bean", display_name: "Small Red Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "Creole red beans and rice" }),
  entry({ slug: "black-turtle-bean", display_name: "Black Turtle Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "primary", culinary_role: "Central American and Caribbean stew" }),
  entry({ slug: "flageolet-bean", display_name: "Flageolet Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "French lamb and bean braise" }),
  entry({ slug: "white-bean", display_name: "White Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "primary", culinary_role: "Tuscan white bean and sage stew" }),
  entry({ slug: "haricot-bean", display_name: "Haricot Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "French cassoulet and bean salad" }),
  entry({ slug: "scarlet-runner-bean", display_name: "Scarlet Runner Bean", parent_group: "beans", scientific_name: "Phaseolus coccineus", usage_intensity: "accent", culinary_role: "British and Central American heirloom bean" }),
  entry({ slug: "tepary-bean", display_name: "Tepary Bean", parent_group: "beans", scientific_name: "Phaseolus acutifolius", usage_intensity: "accent", culinary_role: "Southwestern desert-adapted stew bean" }),
  entry({ slug: "anasazi-bean", display_name: "Anasazi Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "Southwestern heirloom stew and soup" }),
  entry({ slug: "soldier-bean", display_name: "Soldier Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "New England baked bean tradition" }),
  entry({ slug: "roman-bean", display_name: "Roman Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "Italian flat white bean stew" }),
  entry({ slug: "marrow-bean", display_name: "Marrow Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "Appalachian heirloom soup bean" }),
  entry({ slug: "rattlesnake-bean", display_name: "Rattlesnake Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "Southwestern pole bean stew" }),
  entry({ slug: "mayocoba-bean", display_name: "Mayocoba Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "Peruvian yellow bean stew and refried bean", common_names: ["Peruvian Bean"] }),
  entry({ slug: "jacob-cattle-bean", display_name: "Jacob's Cattle Bean", parent_group: "beans", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "New England heirloom baked bean" }),

  // —— Peas (10) ——
  entry({ slug: "green-pea", display_name: "Green Pea", parent_group: "peas", scientific_name: "Pisum sativum", usage_intensity: "primary", culinary_role: "English pea side and spring soup", aliases: ["Split Peas", "Split Green Peas", "English Peas", "Garden Peas", "Petit Pois"] }),
  entry({ slug: "snow-pea", display_name: "Snow Pea", parent_group: "peas", scientific_name: "Pisum sativum", usage_intensity: "accent", culinary_role: "Chinese stir-fry and salad pea pod" }),
  entry({ slug: "snap-pea", display_name: "Snap Pea", parent_group: "peas", scientific_name: "Pisum sativum", usage_intensity: "accent", culinary_role: "raw snack pea and quick sauté" }),
  entry({ slug: "black-eyed-pea", display_name: "Black-Eyed Pea", parent_group: "peas", scientific_name: "Vigna unguiculata", usage_intensity: "primary", culinary_role: "Southern Hoppin' John and stew", common_names: ["Cowpea"], aliases: ["Cow Peas"] }),
  entry({ slug: "field-pea", display_name: "Field Pea", parent_group: "peas", scientific_name: "Pisum sativum", usage_intensity: "accent", culinary_role: "European dried pea soup and mash" }),
  entry({ slug: "marrowfat-pea", display_name: "Marrowfat Pea", parent_group: "peas", scientific_name: "Pisum sativum", usage_intensity: "accent", culinary_role: "British mushy pea and mushy side" }),
  entry({ slug: "yellow-pea", display_name: "Yellow Pea", parent_group: "peas", scientific_name: "Pisum sativum", usage_intensity: "accent", culinary_role: "Canadian pea soup and dal-style split pea" }),
  entry({ slug: "purple-hull-pea", display_name: "Purple Hull Pea", parent_group: "peas", scientific_name: "Vigna unguiculata", usage_intensity: "accent", culinary_role: "Southern fresh shell pea and stew" }),

  // —— Lentils (9) ——
  entry({ slug: "green-lentil", display_name: "Green Lentil", parent_group: "lentils", scientific_name: "Lens culinaris", usage_intensity: "primary", culinary_role: "French lentil salad and braise" }),
  entry({ slug: "brown-lentil", display_name: "Brown Lentil", parent_group: "lentils", scientific_name: "Lens culinaris", usage_intensity: "primary", culinary_role: "everyday soup and stew lentil" }),
  entry({ slug: "red-lentil", display_name: "Red Lentil", parent_group: "lentils", scientific_name: "Lens culinaris", usage_intensity: "primary", culinary_role: "Indian dal and Middle Eastern soup", aliases: ["Split Red Lentils"] }),
  entry({ slug: "black-lentil", display_name: "Black Lentil", parent_group: "lentils", scientific_name: "Lens culinaris", usage_intensity: "accent", culinary_role: "Beluga lentil salad and side", common_names: ["Beluga Lentil"] }),
  entry({ slug: "yellow-lentil", display_name: "Yellow Lentil", parent_group: "lentils", scientific_name: "Lens culinaris", usage_intensity: "accent", culinary_role: "Turkish and Middle Eastern dal-style stew" }),
  entry({ slug: "puy-lentil", display_name: "Puy Lentil", parent_group: "lentils", scientific_name: "Lens culinaris", usage_intensity: "luxury", culinary_role: "French lentilles du Puy braise and salad", common_names: ["French Green Lentil"] }),
  entry({ slug: "golden-lentil", display_name: "Golden Lentil", parent_group: "lentils", scientific_name: "Lens culinaris", usage_intensity: "accent", culinary_role: "Mediterranean golden lentil soup" }),
  entry({ slug: "macachiados-lentil", display_name: "Macachiados Lentil", parent_group: "lentils", scientific_name: "Lens culinaris", usage_intensity: "accent", culinary_role: "Mexican stew lentil with chile and tomato" }),
  entry({ slug: "coral-lentil", display_name: "Coral Lentil", parent_group: "lentils", scientific_name: "Lens culinaris", usage_intensity: "accent", culinary_role: "North African coral lentil soup", aliases: ["Egyptian Red Lentil"] }),

  // —— Chickpeas (3) ——
  entry({ slug: "chickpea", display_name: "Chickpea", parent_group: "chickpeas", scientific_name: "Cicer arietinum", usage_intensity: "primary", culinary_role: "hummus base and Mediterranean stew", common_names: ["Garbanzo Bean"], aliases: ["Garbanzo Beans", "Cooked Chickpeas"] }),
  entry({ slug: "green-chickpea", display_name: "Green Chickpea", parent_group: "chickpeas", scientific_name: "Cicer arietinum", usage_intensity: "accent", culinary_role: "fresh chana stew and Indian snack base" }),
  entry({ slug: "black-chickpea", display_name: "Black Chickpea", parent_group: "chickpeas", scientific_name: "Cicer arietinum", usage_intensity: "accent", culinary_role: "desi chana curry and South Asian stew", common_names: ["Desi Chickpea"] }),

  // —— Other Legumes (12) ——
  entry({ slug: "soybean", display_name: "Soybean", parent_group: "other-legumes", scientific_name: "Glycine max", usage_intensity: "primary", culinary_role: "East Asian whole bean and plant protein base", aliases: ["Edamame", "Boiled Soybeans"] }),
  entry({ slug: "adzuki-bean", display_name: "Adzuki Bean", parent_group: "other-legumes", scientific_name: "Vigna angularis", usage_intensity: "primary", culinary_role: "Japanese and East Asian sweet and savory bean" }),
  entry({ slug: "mung-bean", display_name: "Mung Bean", parent_group: "other-legumes", scientific_name: "Vigna radiata", usage_intensity: "primary", culinary_role: "Indian dal and East Asian sprouted bean base" }),
  entry({ slug: "lupin-bean", display_name: "Lupin Bean", parent_group: "other-legumes", scientific_name: "Lupinus albus", usage_intensity: "accent", culinary_role: "Mediterranean lupini snack and stew bean" }),
  entry({ slug: "pigeon-pea", display_name: "Pigeon Pea", parent_group: "other-legumes", scientific_name: "Cajanus cajan", usage_intensity: "primary", culinary_role: "Caribbean and South Asian toor dal stew", common_names: ["Toor Dal", "Arhar Dal"] }),
  entry({ slug: "black-gram", display_name: "Black Gram", parent_group: "other-legumes", scientific_name: "Vigna mungo", usage_intensity: "primary", culinary_role: "South Indian urad dal and idli base", common_names: ["Urad Bean"] }),
  entry({ slug: "winged-bean", display_name: "Winged Bean", parent_group: "other-legumes", scientific_name: "Psophocarpus tetragonolobus", usage_intensity: "accent", culinary_role: "Southeast Asian winged bean stir-fry" }),
  entry({ slug: "hyacinth-bean", display_name: "Hyacinth Bean", parent_group: "other-legumes", scientific_name: "Lablab purpureus", usage_intensity: "accent", culinary_role: "Indian lablab curry and African stew", common_names: ["Lablab Bean"] }),
  entry({ slug: "guar-bean", display_name: "Guar Bean", parent_group: "other-legumes", scientific_name: "Cyamopsis tetragonoloba", usage_intensity: "accent", culinary_role: "Indian guar vegetable and cluster bean curry" }),
  entry({ slug: "horse-gram", display_name: "Horse Gram", parent_group: "other-legumes", scientific_name: "Macrotyloma uniflorum", usage_intensity: "accent", culinary_role: "South Indian rasam and rustic pulse stew" }),
  entry({ slug: "moth-bean", display_name: "Moth Bean", parent_group: "other-legumes", scientific_name: "Vigna aconitifolia", usage_intensity: "accent", culinary_role: "Rajasthani moth dal and desert-adapted stew" }),
  entry({ slug: "jack-bean", display_name: "Jack Bean", parent_group: "other-legumes", scientific_name: "Canavalia ensiformis", usage_intensity: "accent", culinary_role: "tropical sword bean stew and forage legume cooking" }),

  // —— Legume Products (17) ——
  entry({ slug: "chickpea-flour", display_name: "Chickpea Flour", parent_group: "legume-products", scientific_name: "Cicer arietinum", usage_intensity: "primary", culinary_role: "besan batter and gluten-free flatbread", common_names: ["Besan"] }),
  entry({ slug: "tofu", display_name: "Tofu", parent_group: "legume-products", scientific_name: "Glycine max", usage_intensity: "primary", culinary_role: "East Asian soy curd and plant protein base", aliases: ["Firm Tofu", "Silken Tofu"] }),
  entry({ slug: "tempeh", display_name: "Tempeh", parent_group: "legume-products", scientific_name: "Glycine max", usage_intensity: "primary", culinary_role: "Indonesian fermented soy cake and grill" }),
  entry({ slug: "miso", display_name: "Miso", parent_group: "legume-products", scientific_name: "Glycine max", usage_intensity: "primary", culinary_role: "Japanese fermented soy paste and soup base" }),
  entry({ slug: "soy-flour", display_name: "Soy Flour", parent_group: "legume-products", scientific_name: "Glycine max", usage_intensity: "accent", culinary_role: "protein-enriched baking and Japanese kinako-style use" }),
  entry({ slug: "natto", display_name: "Natto", parent_group: "legume-products", scientific_name: "Glycine max", usage_intensity: "accent", culinary_role: "Japanese fermented whole soybean breakfast" }),
  entry({ slug: "textured-vegetable-protein", display_name: "Textured Vegetable Protein", parent_group: "legume-products", scientific_name: "Glycine max", usage_intensity: "accent", culinary_role: "soy-based meat analogue and chili filler", common_names: ["TVP"] }),
  entry({ slug: "lentil-flour", display_name: "Lentil Flour", parent_group: "legume-products", scientific_name: "Lens culinaris", usage_intensity: "accent", culinary_role: "Indian papadum and lentil flatbread base" }),
  entry({ slug: "fava-bean-flour", display_name: "Fava Bean Flour", parent_group: "legume-products", scientific_name: "Vicia faba", usage_intensity: "accent", culinary_role: "Mediterranean fava flour bread and falafel-adjacent use" }),
  entry({ slug: "mung-bean-flour", display_name: "Mung Bean Flour", parent_group: "legume-products", scientific_name: "Vigna radiata", usage_intensity: "accent", culinary_role: "Indian moong dal flour and Asian noodle base" }),
  entry({ slug: "black-bean-flour", display_name: "Black Bean Flour", parent_group: "legume-products", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "Latin American black bean dough and gluten-free baking" }),
  entry({ slug: "pea-flour", display_name: "Pea Flour", parent_group: "legume-products", scientific_name: "Pisum sativum", usage_intensity: "accent", culinary_role: "modern plant-protein baking and soup thickener" }),
  entry({ slug: "lupin-flour", display_name: "Lupin Flour", parent_group: "legume-products", scientific_name: "Lupinus albus", usage_intensity: "accent", culinary_role: "Mediterranean lupin flour bread and pasta" }),
  entry({ slug: "soy-curls", display_name: "Soy Curls", parent_group: "legume-products", scientific_name: "Glycine max", usage_intensity: "accent", culinary_role: "rehydrated soy strip and plant-based braise" }),
  entry({ slug: "red-lentil-flour", display_name: "Red Lentil Flour", parent_group: "legume-products", scientific_name: "Lens culinaris", usage_intensity: "accent", culinary_role: "Middle Eastern red lentil flatbread and soup thickener" }),
  entry({ slug: "fermented-black-bean", display_name: "Fermented Black Bean", parent_group: "legume-products", scientific_name: "Glycine max", usage_intensity: "accent", culinary_role: "Chinese douchi black bean sauce and stir-fry", common_names: ["Douchi"] }),
  entry({ slug: "white-bean-flour", display_name: "White Bean Flour", parent_group: "legume-products", scientific_name: "Phaseolus vulgaris", usage_intensity: "accent", culinary_role: "Italian white bean soup thickener and gluten-free baking" }),
];

export const LEGUME_SEED_WITH_SUMMARIES = LEGUME_SEED;
