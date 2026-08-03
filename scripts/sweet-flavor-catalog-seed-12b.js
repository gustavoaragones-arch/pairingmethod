/**
 * FOOD-12B — Canonical sweet flavor seed data.
 * Each entry is one canonical culinary ingredient (CANON-001).
 */

/** @typedef {object} SweetFlavorSeed
 * @property {string} slug
 * @property {string} display_name
 * @property {"sugars"|"syrups"|"honey-bee-products"|"natural-sweeteners"|"alternative-sweeteners"|"cocoa-chocolate-ingredients"} parent_group
 * @property {string} scientific_name
 * @property {"primary"|"accent"|"luxury"} usage_intensity
 * @property {string[]} [aliases]
 * @property {string[]} [common_names]
 * @property {string} [origin_context]
 * @property {string} [summary]
 * @property {string} [culinary_role]
 */

export const GROUP_SLUGS = [
  "sugars",
  "syrups",
  "honey-bee-products",
  "natural-sweeteners",
  "alternative-sweeteners",
  "cocoa-chocolate-ingredients",
];

export const GROUP_TO_CULINARY_GROUP = {
  sugars: "sugars",
  syrups: "syrups",
  "honey-bee-products": "honey_bee_products",
  "natural-sweeteners": "natural_sweeteners",
  "alternative-sweeteners": "alternative_sweeteners",
  "cocoa-chocolate-ingredients": "cocoa_chocolate_ingredients",
};

function summary(seed) {
  if (seed.summary) return seed.summary;
  const role = seed.culinary_role ?? "sweetening and flavor building";
  return `${seed.display_name} is a canonical ${role} ingredient in global cookery — its sweetness character, texture, and pairing behavior pair with dessert wines, sparkling styles, and spice-friendly reds when used as a primary sweetener.`;
}

/** @param {Omit<SweetFlavorSeed, "summary"> & { summary?: string }} seed */
function entry(seed) {
  return { ...seed, summary: summary(seed) };
}

/** @type {SweetFlavorSeed[]} */
export const SWEET_FLAVOR_SEED = [
  // —— Sugars (13) ——
  entry({ slug: "cane-sugar", display_name: "Cane Sugar", parent_group: "sugars", scientific_name: "Saccharum officinarum", usage_intensity: "primary", culinary_role: "general baking and cookery sweetener", aliases: ["Powdered Sugar", "Superfine Sugar", "Caster Sugar", "Granulated Sugar", "White Sugar"], common_names: ["Granulated Cane Sugar"] }),
  entry({ slug: "beet-sugar", display_name: "Beet Sugar", parent_group: "sugars", scientific_name: "Beta vulgaris", usage_intensity: "primary", culinary_role: "European refined sugar and confection base" }),
  entry({ slug: "palm-sugar", display_name: "Palm Sugar", parent_group: "sugars", scientific_name: "Multiple species", usage_intensity: "accent", culinary_role: "Southeast Asian caramel-forward palm sugar blocks" }),
  entry({ slug: "brown-sugar", display_name: "Brown Sugar", parent_group: "sugars", scientific_name: "Saccharum officinarum", usage_intensity: "primary", culinary_role: "molasses-rich baking and barbecue glaze", aliases: ["Light Brown Sugar", "Dark Brown Sugar"] }),
  entry({ slug: "muscovado-sugar", display_name: "Muscovado Sugar", parent_group: "sugars", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "unrefined dark baking sugar with molasses depth" }),
  entry({ slug: "demerara-sugar", display_name: "Demerara Sugar", parent_group: "sugars", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "crunchy topping sugar for baking and coffee service" }),
  entry({ slug: "turbinado-sugar", display_name: "Turbinado Sugar", parent_group: "sugars", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "partially refined golden baking sugar", common_names: ["Raw Cane Sugar"] }),
  entry({ slug: "raw-sugar", display_name: "Raw Sugar", parent_group: "sugars", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "minimally processed crystalline sweetener for baking" }),
  entry({ slug: "jaggery", display_name: "Jaggery", parent_group: "sugars", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "South Asian unrefined cane or palm sugar blocks", common_names: ["Gur"] }),
  entry({ slug: "panela", display_name: "Panela", parent_group: "sugars", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "Latin American unrefined cane sugar loaf", common_names: ["Piloncillo"] }),
  entry({ slug: "piloncillo", display_name: "Piloncillo", parent_group: "sugars", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "Mexican cone-shaped unrefined cane sugar" }),
  entry({ slug: "maple-sugar", display_name: "Maple Sugar", parent_group: "sugars", scientific_name: "Acer saccharum", usage_intensity: "accent", culinary_role: "crystallized maple sap for baking and finishing" }),
  entry({ slug: "rock-sugar", display_name: "Rock Sugar", parent_group: "sugars", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "Chinese crystalline sugar for braises and tea sweetening", common_names: ["Rock Candy Sugar"] }),

  // —— Syrups (13) ——
  entry({ slug: "maple-syrup", display_name: "Maple Syrup", parent_group: "syrups", scientific_name: "Acer saccharum", usage_intensity: "primary", culinary_role: "North American pancake and glaze syrup" }),
  entry({ slug: "molasses", display_name: "Molasses", parent_group: "syrups", scientific_name: "Saccharum officinarum", usage_intensity: "primary", culinary_role: "baking, gingerbread, and braise depth syrup" }),
  entry({ slug: "blackstrap-molasses", display_name: "Blackstrap Molasses", parent_group: "syrups", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "robust third-boil molasses for baking and marinades" }),
  entry({ slug: "corn-syrup", display_name: "Corn Syrup", parent_group: "syrups", scientific_name: "Zea mays", usage_intensity: "primary", culinary_role: "American confection and candy syrup base" }),
  entry({ slug: "golden-syrup", display_name: "Golden Syrup", parent_group: "syrups", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "British inverted cane syrup for baking and treacle tart" }),
  entry({ slug: "rice-syrup", display_name: "Rice Syrup", parent_group: "syrups", scientific_name: "Oryza sativa", usage_intensity: "accent", culinary_role: "mild Asian rice malt syrup for baking" }),
  entry({ slug: "barley-malt-syrup", display_name: "Barley Malt Syrup", parent_group: "syrups", scientific_name: "Hordeum vulgare", usage_intensity: "accent", culinary_role: "malt-forward brewing and baking syrup" }),
  entry({ slug: "sorghum-syrup", display_name: "Sorghum Syrup", parent_group: "syrups", scientific_name: "Sorghum bicolor", usage_intensity: "accent", culinary_role: "Southern American sorghum molasses alternative" }),
  entry({ slug: "treacle", display_name: "Treacle", parent_group: "syrups", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "British dark cane syrup for puddings and gingerbread" }),
  entry({ slug: "cane-syrup", display_name: "Cane Syrup", parent_group: "syrups", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "Southern cane syrup for pancakes and glazes" }),
  entry({ slug: "palm-syrup", display_name: "Palm Syrup", parent_group: "syrups", scientific_name: "Multiple species", usage_intensity: "accent", culinary_role: "palm sap syrup for Southeast Asian cookery" }),
  entry({ slug: "glucose-syrup", display_name: "Glucose Syrup", parent_group: "syrups", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "confectionery and pastry invert syrup base" }),
  entry({ slug: "invert-sugar-syrup", display_name: "Invert Sugar Syrup", parent_group: "syrups", scientific_name: "Saccharum officinarum", usage_intensity: "accent", culinary_role: "professional pastry syrup for moisture retention" }),

  // —— Honey & Bee Products (5) ——
  entry({ slug: "honey", display_name: "Honey", parent_group: "honey-bee-products", scientific_name: "Apis mellifera", usage_intensity: "primary", culinary_role: "global floral sweetener for baking, glazing, and finishing" }),
  entry({ slug: "comb-honey", display_name: "Comb Honey", parent_group: "honey-bee-products", scientific_name: "Apis mellifera", usage_intensity: "luxury", culinary_role: "whole-comb honey for cheese boards and finishing" }),
  entry({ slug: "clover-honey", display_name: "Clover Honey", parent_group: "honey-bee-products", scientific_name: "Apis mellifera", usage_intensity: "primary", culinary_role: "mild everyday baking and tea honey" }),
  entry({ slug: "buckwheat-honey", display_name: "Buckwheat Honey", parent_group: "honey-bee-products", scientific_name: "Apis mellifera", usage_intensity: "accent", culinary_role: "robust dark honey for rye baking and sauces" }),
  entry({ slug: "manuka-honey", display_name: "Manuka Honey", parent_group: "honey-bee-products", scientific_name: "Apis mellifera", usage_intensity: "luxury", culinary_role: "New Zealand specialty honey for finishing and glazes" }),

  // —— Natural Sweeteners (11) ——
  entry({ slug: "agave", display_name: "Agave", parent_group: "natural-sweeteners", scientific_name: "Agave tequilana", usage_intensity: "accent", culinary_role: "Mexican agave nectar for beverages and baking", common_names: ["Agave Nectar"] }),
  entry({ slug: "date-syrup", display_name: "Date Syrup", parent_group: "natural-sweeteners", scientific_name: "Phoenix dactylifera", usage_intensity: "accent", culinary_role: "Middle Eastern date silan for baking and marinades", common_names: ["Silan", "Date Honey"] }),
  entry({ slug: "monk-fruit-sweetener", display_name: "Monk Fruit Sweetener", parent_group: "natural-sweeteners", scientific_name: "Siraitia grosvenorii", usage_intensity: "accent", culinary_role: "zero-calorie fruit-derived sweetener for baking blends" }),
  entry({ slug: "coconut-sugar", display_name: "Coconut Sugar", parent_group: "natural-sweeteners", scientific_name: "Cocos nucifera", usage_intensity: "accent", culinary_role: "caramel-toned palm coconut blossom sugar for baking" }),
  entry({ slug: "yacon-syrup", display_name: "Yacon Syrup", parent_group: "natural-sweeteners", scientific_name: "Smallanthus sonchifolius", usage_intensity: "accent", culinary_role: "Andean root syrup for low-glycemic sweetening" }),
  entry({ slug: "lucuma-powder", display_name: "Lucuma Powder", parent_group: "natural-sweeteners", scientific_name: "Pouteria lucuma", usage_intensity: "accent", culinary_role: "Peruvian fruit powder for ice cream and pastry flavor" }),
  entry({ slug: "carob-powder", display_name: "Carob Powder", parent_group: "natural-sweeteners", scientific_name: "Ceratonia siliqua", usage_intensity: "accent", culinary_role: "Mediterranean carob sweetener for baking and drinks" }),
  entry({ slug: "grape-sugar", display_name: "Grape Sugar", parent_group: "natural-sweeteners", scientific_name: "Vitis vinifera", usage_intensity: "accent", culinary_role: "wine-country grape must sugar for confection" }),
  entry({ slug: "mesquite-powder", display_name: "Mesquite Powder", parent_group: "natural-sweeteners", scientific_name: "Prosopis glandulosa", usage_intensity: "accent", culinary_role: "Southwestern mesquite pod sweetener for baking" }),
  entry({ slug: "birch-sugar", display_name: "Birch Sugar", parent_group: "natural-sweeteners", scientific_name: "Betula pendula", usage_intensity: "accent", culinary_role: "xylitol-rich birch sap crystalline sweetener", common_names: ["Xylitol Birch Sugar"] }),
  entry({ slug: "fruit-sugar", display_name: "Fruit Sugar", parent_group: "natural-sweeteners", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "fructose-dominant fruit-derived crystalline sweetener" }),

  // —— Alternative Sweeteners (11) ——
  entry({ slug: "erythritol", display_name: "Erythritol", parent_group: "alternative-sweeteners", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "sugar-alcohol sweetener for reduced-sugar baking" }),
  entry({ slug: "xylitol", display_name: "Xylitol", parent_group: "alternative-sweeteners", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "sugar-alcohol sweetener for confection and gum bases" }),
  entry({ slug: "allulose", display_name: "Allulose", parent_group: "alternative-sweeteners", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "rare sugar for low-calorie baking and caramelization" }),
  entry({ slug: "stevia", display_name: "Stevia", parent_group: "alternative-sweeteners", scientific_name: "Stevia rebaudiana", usage_intensity: "accent", culinary_role: "high-intensity leaf-derived sweetener for blends" }),
  entry({ slug: "sucralose", display_name: "Sucralose", parent_group: "alternative-sweeteners", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "heat-stable high-intensity sweetener for baking mixes" }),
  entry({ slug: "aspartame", display_name: "Aspartame", parent_group: "alternative-sweeteners", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "high-intensity sweetener for tabletop blends" }),
  entry({ slug: "saccharin", display_name: "Saccharin", parent_group: "alternative-sweeteners", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "classic high-intensity tabletop sweetener" }),
  entry({ slug: "maltitol", display_name: "Maltitol", parent_group: "alternative-sweeteners", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "sugar-alcohol for sugar-free chocolate and confection" }),
  entry({ slug: "sorbitol", display_name: "Sorbitol", parent_group: "alternative-sweeteners", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "sugar-alcohol humectant for confection and baking" }),
  entry({ slug: "tagatose", display_name: "Tagatose", parent_group: "alternative-sweeteners", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "low-calorie monosaccharide for specialty baking" }),
  entry({ slug: "cyclamate", display_name: "Cyclamate", parent_group: "alternative-sweeteners", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "high-intensity sweetener used in regional tabletop blends" }),

  // —— Cocoa & Chocolate Ingredients (20) ——
  entry({ slug: "cacao-bean", display_name: "Cacao Bean", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "primary", culinary_role: "whole agricultural cacao bean for roasting and nib production", common_names: ["Cocoa Bean"] }),
  entry({ slug: "cocoa-powder", display_name: "Cocoa Powder", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "primary", culinary_role: "defatted cacao powder for baking and hot chocolate" }),
  entry({ slug: "dutch-process-cocoa-powder", display_name: "Dutch-Process Cocoa Powder", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "primary", culinary_role: "alkalized cocoa for darker baked goods and frostings", aliases: ["Alkalized Cocoa Powder"], common_names: ["Dutch Cocoa"] }),
  entry({ slug: "natural-cocoa-powder", display_name: "Natural Cocoa Powder", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "primary", culinary_role: "non-alkalized cocoa for acidic baking and brownie recipes" }),
  entry({ slug: "black-cocoa-powder", display_name: "Black Cocoa Powder", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "heavily Dutched dark cocoa for oreo-style baking" }),
  entry({ slug: "red-cocoa-powder", display_name: "Red Cocoa Powder", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "specialty reddish cocoa for velvet-style baking" }),
  entry({ slug: "cocoa-butter", display_name: "Cocoa Butter", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "primary", culinary_role: "cacao fat for chocolate making and confection enrobing" }),
  entry({ slug: "chocolate-liquor", display_name: "Chocolate Liquor", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "primary", culinary_role: "ground cacao mass base for chocolate production", common_names: ["Cacao Liquor", "Cocoa Mass"] }),
  entry({ slug: "cacao-nibs", display_name: "Cacao Nibs", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "crunchy roasted cacao for baking and finishing", common_names: ["Cocoa Nibs"] }),
  entry({ slug: "cacao-paste", display_name: "Cacao Paste", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "primary", culinary_role: "unsweetened cacao paste for confection and baking bases" }),
  entry({ slug: "raw-cacao", display_name: "Raw Cacao", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "minimally processed cacao for health-forward baking" }),
  entry({ slug: "cocoa-solids", display_name: "Cocoa Solids", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "non-fat cacao solid base for professional chocolate work" }),
  entry({ slug: "roasted-cacao-nibs", display_name: "Roasted Cacao Nibs", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "toasted nibs for pastry crunch and garnish" }),
  entry({ slug: "defatted-cocoa-powder", display_name: "Defatted Cocoa Powder", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "low-fat cocoa for lighter baking applications" }),
  entry({ slug: "high-fat-cocoa-powder", display_name: "High-Fat Cocoa Powder", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "rich cocoa for ice cream and premium ganache bases" }),
  entry({ slug: "ruby-cacao", display_name: "Ruby Cacao", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "luxury", culinary_role: "fruit-forward specialty cacao for confection and pastry" }),
  entry({ slug: "cocoa-presscake", display_name: "Cocoa Presscake", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "pressed cacao cake ground into industrial cocoa powder feedstock" }),
  entry({ slug: "ground-cacao", display_name: "Ground Cacao", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "coarsely ground cacao for rustic baking and drinks" }),
  entry({ slug: "cacao-powder", display_name: "Cacao Powder", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "raw-style cacao powder for health-forward recipes", common_names: ["Raw Cacao Powder"] }),
  entry({ slug: "toasted-cacao", display_name: "Toasted Cacao", parent_group: "cocoa-chocolate-ingredients", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "lightly toasted cacao for nutty baking and spice blends" }),
];
