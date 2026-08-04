/**
 * FOOD-13B — Canonical sauce & condiment seed data.
 * Each entry is one canonical culinary ingredient (CANON-001).
 */

/** @typedef {object} SauceCondimentSeed
 * @property {string} slug
 * @property {string} display_name
 * @property {"mother-sauces"|"table-sauces"|"condiments"|"fermented-sauces-pastes"|"oil-based-sauces-dressings"|"savory-spreads-pastes"} parent_group
 * @property {string} scientific_name
 * @property {"primary"|"accent"|"luxury"} usage_intensity
 * @property {string[]} [aliases]
 * @property {string[]} [common_names]
 * @property {string} [origin_context]
 * @property {string} [summary]
 * @property {string} [culinary_role]
 */

export const GROUP_SLUGS = [
  "mother-sauces",
  "table-sauces",
  "condiments",
  "fermented-sauces-pastes",
  "oil-based-sauces-dressings",
  "savory-spreads-pastes",
];

export const GROUP_TO_CULINARY_GROUP = {
  "mother-sauces": "mother_sauces",
  "table-sauces": "table_sauces",
  condiments: "condiments",
  "fermented-sauces-pastes": "fermented_sauces_pastes",
  "oil-based-sauces-dressings": "oil_based_sauces_dressings",
  "savory-spreads-pastes": "savory_spreads_pastes",
};

function summary(seed) {
  if (seed.summary) return seed.summary;
  const role = seed.culinary_role ?? "sauce and condiment finishing";
  return `${seed.display_name} is a canonical ${role} ingredient in global cookery — its acidity, richness, and pairing behavior pair with structured whites, aromatic rosés, and spice-friendly reds when used as a finishing or table sauce.`;
}

/** @param {Omit<SauceCondimentSeed, "summary"> & { summary?: string }} seed */
function entry(seed) {
  return { ...seed, summary: summary(seed) };
}

/** @type {SauceCondimentSeed[]} */
export const SAUCE_CONDIMENT_SEED = [
  // —— Mother Sauces (9) ——
  entry({ slug: "bechamel", display_name: "Béchamel", parent_group: "mother-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "French white roux mother sauce for gratins and lasagna" }),
  entry({ slug: "veloute", display_name: "Velouté", parent_group: "mother-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "French velouté mother sauce thickened with blond roux" }),
  entry({ slug: "espagnole", display_name: "Espagnole", parent_group: "mother-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "French brown mother sauce base for classical reductions" }),
  entry({ slug: "tomato-mother-sauce", display_name: "Tomato Mother Sauce", parent_group: "mother-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "classic tomato-based mother sauce for braises and pasta" }),
  entry({ slug: "hollandaise", display_name: "Hollandaise", parent_group: "mother-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "emulsified butter mother sauce for eggs and asparagus" }),
  entry({ slug: "mayonnaise", display_name: "Mayonnaise", parent_group: "mother-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "cold emulsified mother sauce base for dressings and spreads" }),
  entry({ slug: "demi-glace", display_name: "Demi-Glace", parent_group: "mother-sauces", scientific_name: "Multiple sources", usage_intensity: "luxury", culinary_role: "reduced espagnole glaze for classical sauce finishing" }),
  entry({ slug: "bearnaise", display_name: "Béarnaise", parent_group: "mother-sauces", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "tarragon hollandaise derivative for steak and roast service" }),
  entry({ slug: "sauce-mornay", display_name: "Sauce Mornay", parent_group: "mother-sauces", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "béchamel-based cheese mother sauce for gratins and croquettes" }),

  // —— Table Sauces (22) ——
  entry({ slug: "tomato-ketchup", display_name: "Tomato Ketchup", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "global tomato table sauce for burgers and fried foods", common_names: ["Ketchup"] }),
  entry({ slug: "barbecue-sauce", display_name: "Barbecue Sauce", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "smoky-sweet American table sauce for grilled meats" }),
  entry({ slug: "worcestershire-sauce", display_name: "Worcestershire Sauce", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "British umami table sauce for meats and Caesar dressing", aliases: ["Worcestershire"] }),
  entry({ slug: "pan-gravy", display_name: "Pan Gravy", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "roast pan drippings table sauce for poultry and Sunday roasts" }),
  entry({ slug: "cranberry-sauce", display_name: "Cranberry Sauce", parent_group: "table-sauces", scientific_name: "Vaccinium macrocarpon", usage_intensity: "accent", culinary_role: "holiday fruit table sauce for turkey and roast poultry" }),
  entry({ slug: "caramel-sauce", display_name: "Caramel Sauce", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "composed caramel table sauce for desserts and coffee service" }),
  entry({ slug: "chocolate-syrup", display_name: "Chocolate Syrup", parent_group: "table-sauces", scientific_name: "Theobroma cacao", usage_intensity: "accent", culinary_role: "composed chocolate table syrup for desserts and beverages" }),
  entry({ slug: "brown-sauce", display_name: "Brown Sauce", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "British HP-style brown table sauce for breakfast and chips", common_names: ["HP Sauce"] }),
  entry({ slug: "steak-sauce", display_name: "Steak Sauce", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "tangy brown table sauce for grilled beef and chops" }),
  entry({ slug: "chili-sauce", display_name: "Chili Sauce", parent_group: "table-sauces", scientific_name: "Capsicum annuum", usage_intensity: "accent", culinary_role: "sweet-spicy table sauce for Asian and American cookery" }),
  entry({ slug: "hot-sauce", display_name: "Hot Sauce", parent_group: "table-sauces", scientific_name: "Capsicum annuum", usage_intensity: "primary", culinary_role: "vinegar-chile table sauce for global heat finishing" }),
  entry({ slug: "sriracha", display_name: "Sriracha", parent_group: "table-sauces", scientific_name: "Capsicum annuum", usage_intensity: "accent", culinary_role: "garlic-chile table sauce for Southeast Asian and fusion dishes" }),
  entry({ slug: "oyster-sauce", display_name: "Oyster Sauce", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "Cantonese umami table sauce for stir-fries and vegetables" }),
  entry({ slug: "plum-sauce", display_name: "Plum Sauce", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "sweet-sour Chinese table sauce for duck and spring rolls" }),
  entry({ slug: "sweet-and-sour-sauce", display_name: "Sweet and Sour Sauce", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Chinese-American table sauce for fried proteins and rice" }),
  entry({ slug: "teriyaki-sauce", display_name: "Teriyaki Sauce", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "Japanese soy-glaze table sauce for grilled proteins" }),
  entry({ slug: "tonkatsu-sauce", display_name: "Tonkatsu Sauce", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Japanese fruit-vinegar table sauce for breaded cutlets" }),
  entry({ slug: "ponzu", display_name: "Ponzu", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Japanese citrus-soy table sauce for sashimi and hot pot" }),
  entry({ slug: "mushroom-gravy", display_name: "Mushroom Gravy", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "mushroom-enriched table gravy for roasts and vegetarian mains" }),
  entry({ slug: "marinara-sauce", display_name: "Marinara Sauce", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "Italian tomato table sauce for pasta and pizza" }),
  entry({ slug: "mole-sauce", display_name: "Mole Sauce", parent_group: "table-sauces", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Mexican chile-nut table sauce for poultry and enchiladas" }),
  entry({ slug: "apple-sauce", display_name: "Apple Sauce", parent_group: "table-sauces", scientific_name: "Malus domestica", usage_intensity: "accent", culinary_role: "pureed fruit table sauce for pork roasts and baking" }),

  // —— Condiments (20) ——
  entry({ slug: "dijon-mustard", display_name: "Dijon Mustard", parent_group: "condiments", scientific_name: "Brassica juncea", usage_intensity: "primary", culinary_role: "French prepared mustard condiment for dressings and charcuterie" }),
  entry({ slug: "whole-grain-mustard", display_name: "Whole-Grain Mustard", parent_group: "condiments", scientific_name: "Brassica juncea", usage_intensity: "accent", culinary_role: "coarse-textured prepared mustard condiment for sandwiches and vinaigrettes" }),
  entry({ slug: "yellow-mustard", display_name: "Yellow Mustard", parent_group: "condiments", scientific_name: "Sinapis alba", usage_intensity: "primary", culinary_role: "American ballpark prepared mustard condiment for hot dogs and burgers", aliases: ["American Mustard", "Ballpark Mustard"] }),
  entry({ slug: "english-mustard", display_name: "English Mustard", parent_group: "condiments", scientific_name: "Brassica juncea", usage_intensity: "accent", culinary_role: "sharp British prepared mustard condiment for roasts and ploughman's lunch" }),
  entry({ slug: "prepared-horseradish", display_name: "Prepared Horseradish", parent_group: "condiments", scientific_name: "Armoracia rusticana", usage_intensity: "accent", culinary_role: "vinegar-preserved horseradish condiment for beef and seafood" }),
  entry({ slug: "vanilla-extract", display_name: "Vanilla Extract", parent_group: "condiments", scientific_name: "Vanilla planifolia", usage_intensity: "accent", culinary_role: "composed vanilla extract condiment for baking and pastry finishing" }),
  entry({ slug: "almond-extract", display_name: "Almond Extract", parent_group: "condiments", scientific_name: "Prunus dulcis", usage_intensity: "accent", culinary_role: "composed almond extract condiment for baking and confection" }),
  entry({ slug: "orange-blossom-water", display_name: "Orange Blossom Water", parent_group: "condiments", scientific_name: "Citrus aurantium", usage_intensity: "accent", culinary_role: "Middle Eastern floral water condiment for pastries and syrups" }),
  entry({ slug: "rose-water", display_name: "Rose Water", parent_group: "condiments", scientific_name: "Rosa damascena", usage_intensity: "accent", culinary_role: "Middle Eastern and South Asian floral water condiment for desserts" }),
  entry({ slug: "pickle-relish", display_name: "Pickle Relish", parent_group: "condiments", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "chopped pickle condiment for hot dogs and deli sandwiches" }),
  entry({ slug: "sweet-pickle-relish", display_name: "Sweet Pickle Relish", parent_group: "condiments", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "sweetened pickle relish condiment for burgers and tuna salad" }),
  entry({ slug: "mango-chutney", display_name: "Mango Chutney", parent_group: "condiments", scientific_name: "Mangifera indica", usage_intensity: "accent", culinary_role: "Indian sweet-sour fruit chutney condiment for curries and cheese boards" }),
  entry({ slug: "mint-jelly", display_name: "Mint Jelly", parent_group: "condiments", scientific_name: "Mentha spicata", usage_intensity: "accent", culinary_role: "British mint jelly condiment for lamb roasts and cold cuts" }),
  entry({ slug: "cranberry-jelly", display_name: "Cranberry Jelly", parent_group: "condiments", scientific_name: "Vaccinium macrocarpon", usage_intensity: "accent", culinary_role: "set cranberry jelly condiment for poultry and holiday platters" }),
  entry({ slug: "capers", display_name: "Capers", parent_group: "condiments", scientific_name: "Capparis spinosa", usage_intensity: "accent", culinary_role: "brined caper bud condiment for piccata and Mediterranean sauces" }),
  entry({ slug: "cornichons", display_name: "Cornichons", parent_group: "condiments", scientific_name: "Cucumis sativus", usage_intensity: "accent", culinary_role: "French tiny pickle condiment for charcuterie and steak tartare" }),
  entry({ slug: "pickled-ginger", display_name: "Pickled Ginger", parent_group: "condiments", scientific_name: "Zingiber officinale", usage_intensity: "accent", culinary_role: "Japanese gari pickle condiment for sushi and sashimi", common_names: ["Gari"] }),
  entry({ slug: "wasabi-paste", display_name: "Wasabi Paste", parent_group: "condiments", scientific_name: "Eutrema japonicum", usage_intensity: "accent", culinary_role: "Japanese horseradish paste condiment for sushi and sashimi", aliases: ["Wasabi"] }),
  entry({ slug: "harissa", display_name: "Harissa", parent_group: "condiments", scientific_name: "Capsicum annuum", usage_intensity: "accent", culinary_role: "North African chile paste condiment for tagines and couscous" }),
  entry({ slug: "tartar-sauce", display_name: "Tartar Sauce", parent_group: "condiments", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "mayonnaise-based pickle condiment for fried seafood" }),

  // —— Fermented Sauces & Pastes (16) ——
  entry({ slug: "soy-sauce", display_name: "Soy Sauce", parent_group: "fermented-sauces-pastes", scientific_name: "Glycine max", usage_intensity: "primary", culinary_role: "East Asian fermented soy table sauce for stir-fries and dipping", aliases: ["Tamari", "Shoyu"] }),
  entry({ slug: "fish-sauce", display_name: "Fish Sauce", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "Southeast Asian fermented fish umami sauce for curries and salads", common_names: ["Nam Pla", "Nuoc Mam"] }),
  entry({ slug: "gochujang", display_name: "Gochujang", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "Korean fermented chile paste for stews and bibimbap" }),
  entry({ slug: "doubanjiang", display_name: "Doubanjiang", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Sichuan fermented broad bean chile paste for mapo tofu", common_names: ["Pixian Douban"] }),
  entry({ slug: "hoisin-sauce", display_name: "Hoisin Sauce", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Chinese sweet fermented bean sauce for duck and stir-fries" }),
  entry({ slug: "fermented-black-bean-sauce", display_name: "Fermented Black Bean Sauce", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Cantonese fermented black bean sauce for seafood and stir-fries", common_names: ["Black Bean Sauce"] }),
  entry({ slug: "sambal-oelek", display_name: "Sambal Oelek", parent_group: "fermented-sauces-pastes", scientific_name: "Capsicum annuum", usage_intensity: "accent", culinary_role: "Indonesian raw chile paste for Southeast Asian cookery" }),
  entry({ slug: "chili-garlic-sauce", display_name: "Chili Garlic Sauce", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Chinese prepared chile-garlic sauce for stir-fries and dumplings" }),
  entry({ slug: "shrimp-paste", display_name: "Shrimp Paste", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Southeast Asian fermented shrimp umami paste for curries and sambal", common_names: ["Belacan", "Terasi"] }),
  entry({ slug: "yellow-bean-sauce", display_name: "Yellow Bean Sauce", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Chinese fermented yellow soybean paste for braises and noodles" }),
  entry({ slug: "xo-sauce", display_name: "XO Sauce", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "luxury", culinary_role: "Cantonese luxury dried seafood chile sauce for finishing" }),
  entry({ slug: "maggi-seasoning-sauce", display_name: "Maggi Seasoning Sauce", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "European hydrolyzed seasoning sauce for soups and stir-fries", common_names: ["Maggi Sauce"] }),
  entry({ slug: "yuzu-kosho", display_name: "Yuzu Kosho", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Japanese yuzu-chile fermented paste for sashimi and hot pot" }),
  entry({ slug: "tamarind-paste", display_name: "Tamarind Paste", parent_group: "fermented-sauces-pastes", scientific_name: "Tamarindus indica", usage_intensity: "accent", culinary_role: "sour tamarind pulp paste for Thai and Indian curries" }),
  entry({ slug: "black-vinegar", display_name: "Black Vinegar", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Chinese aged black vinegar condiment for dumplings and braises", common_names: ["Chinkiang Vinegar"] }),
  entry({ slug: "banana-ketchup", display_name: "Banana Ketchup", parent_group: "fermented-sauces-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Filipino sweet banana table ketchup for fried foods and marinades" }),

  // —— Oil-Based Sauces & Dressings (12) ——
  entry({ slug: "vinaigrette", display_name: "Vinaigrette", parent_group: "oil-based-sauces-dressings", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "classic oil-vinegar emulsion dressing for salads and vegetables" }),
  entry({ slug: "pesto", display_name: "Pesto", parent_group: "oil-based-sauces-dressings", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "Genoese basil-oil sauce for pasta and finishing" }),
  entry({ slug: "aioli", display_name: "Aioli", parent_group: "oil-based-sauces-dressings", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "Provençal garlic mayonnaise sauce for seafood and vegetables" }),
  entry({ slug: "ranch-dressing", display_name: "Ranch Dressing", parent_group: "oil-based-sauces-dressings", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "American buttermilk-herb dressing for salads and dipping" }),
  entry({ slug: "caesar-dressing", display_name: "Caesar Dressing", parent_group: "oil-based-sauces-dressings", scientific_name: "Multiple sources", usage_intensity: "primary", culinary_role: "anchovy-emulsion salad dressing for Caesar salad service" }),
  entry({ slug: "thousand-island-dressing", display_name: "Thousand Island Dressing", parent_group: "oil-based-sauces-dressings", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "American sweet pickle dressing for salads and burgers" }),
  entry({ slug: "green-goddess-dressing", display_name: "Green Goddess Dressing", parent_group: "oil-based-sauces-dressings", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "herb-anchovy dressing for salads and crudité platters" }),
  entry({ slug: "blue-cheese-dressing", display_name: "Blue Cheese Dressing", parent_group: "oil-based-sauces-dressings", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "creamy blue cheese dressing for wedge salads and wings" }),
  entry({ slug: "balsamic-vinaigrette", display_name: "Balsamic Vinaigrette", parent_group: "oil-based-sauces-dressings", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "balsamic-oil vinaigrette for salads and roasted vegetables" }),
  entry({ slug: "chimichurri", display_name: "Chimichurri", parent_group: "oil-based-sauces-dressings", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Argentine herb-oil sauce for grilled beef and chorizo" }),
  entry({ slug: "romesco-sauce", display_name: "Romesco Sauce", parent_group: "oil-based-sauces-dressings", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Catalan nut-red pepper oil sauce for seafood and vegetables" }),
  entry({ slug: "sauce-vierge", display_name: "Sauce Vierge", parent_group: "oil-based-sauces-dressings", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Provençal uncooked tomato-herb oil sauce for fish finishing" }),

  // —— Savory Spreads & Pastes (11) ——
  entry({ slug: "tapenade", display_name: "Tapenade", parent_group: "savory-spreads-pastes", scientific_name: "Olea europaea", usage_intensity: "accent", culinary_role: "Provençal olive-caper spread for crostini and fish" }),
  entry({ slug: "anchovy-paste", display_name: "Anchovy Paste", parent_group: "savory-spreads-pastes", scientific_name: "Engraulis encrasicolus", usage_intensity: "accent", culinary_role: "concentrated anchovy spread for Caesar dressing and bagna càuda" }),
  entry({ slug: "olive-paste", display_name: "Olive Paste", parent_group: "savory-spreads-pastes", scientific_name: "Olea europaea", usage_intensity: "accent", culinary_role: "pureed olive spread for sandwiches and Mediterranean boards" }),
  entry({ slug: "muhammara", display_name: "Muhammara", parent_group: "savory-spreads-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Syrian walnut-red pepper spread for mezze and flatbreads" }),
  entry({ slug: "sun-dried-tomato-paste", display_name: "Sun-Dried Tomato Paste", parent_group: "savory-spreads-pastes", scientific_name: "Solanum lycopersicum", usage_intensity: "accent", culinary_role: "concentrated sun-dried tomato spread for pasta and bruschetta" }),
  entry({ slug: "truffle-paste", display_name: "Truffle Paste", parent_group: "savory-spreads-pastes", scientific_name: "Tuber melanosporum", usage_intensity: "luxury", culinary_role: "luxury truffle spread for finishing risotto and pasta" }),
  entry({ slug: "gentlemans-relish", display_name: "Gentleman's Relish", parent_group: "savory-spreads-pastes", scientific_name: "Multiple sources", usage_intensity: "luxury", culinary_role: "British anchovy-spice spread for toast and scrambled eggs", common_names: ["Patum Peperium"] }),
  entry({ slug: "marmite", display_name: "Marmite", parent_group: "savory-spreads-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "British yeast extract spread for toast and savory baking" }),
  entry({ slug: "vegemite", display_name: "Vegemite", parent_group: "savory-spreads-pastes", scientific_name: "Multiple sources", usage_intensity: "accent", culinary_role: "Australian yeast extract spread for toast and sandwiches" }),
  entry({ slug: "red-pepper-paste", display_name: "Red Pepper Paste", parent_group: "savory-spreads-pastes", scientific_name: "Capsicum annuum", usage_intensity: "accent", culinary_role: "Turkish and Balkan roasted pepper spread for mezze and stews" }),
  entry({ slug: "garlic-paste", display_name: "Garlic Paste", parent_group: "savory-spreads-pastes", scientific_name: "Allium sativum", usage_intensity: "accent", culinary_role: "prepared garlic paste spread for marinades and finishing" }),
];
