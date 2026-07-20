/**
 * FOOD-08B — Canonical grain and starch seed data.
 * Each entry is one canonical culinary ingredient (CANON-001).
 */

/** @typedef {object} GrainStarchSeed
 * @property {string} slug
 * @property {string} display_name
 * @property {"whole-grains"|"pseudocereals"|"processed-grains"|"starches"} parent_group
 * @property {string} scientific_name
 * @property {"primary"|"accent"|"luxury"} usage_intensity
 * @property {string[]} [aliases]
 * @property {string[]} [common_names]
 * @property {string} [origin_context]
 * @property {string} summary
 */

export const GROUP_SLUGS = [
  "whole-grains",
  "pseudocereals",
  "processed-grains",
  "starches",
];

export const GROUP_TO_CULINARY_GROUP = {
  "whole-grains": "whole_grains",
  "pseudocereals": "pseudocereals",
  "processed-grains": "processed_grains",
  "starches": "starches",
};

/** @type {GrainStarchSeed[]} */
export const GRAIN_STARCH_SEED = [
  {
    "slug": "rice",
    "display_name": "Rice",
    "parent_group": "whole-grains",
    "scientific_name": "Oryza sativa",
    "usage_intensity": "primary",
    "summary": "Rice is the world's foundational neutral starch base — its clean, absorbent grain carries Asian curries, risotto, and pilaf to pair with aromatic whites, off-dry Riesling, and light Pinot Noir.",
    "aliases": [
      "White Rice",
      "Brown Rice",
      "Jasmine Rice",
      "Basmati Rice",
      "Arborio Rice",
      "Instant Rice"
    ],
    "common_names": [
      "White Rice"
    ]
  },
  {
    "slug": "wheat",
    "display_name": "Wheat",
    "parent_group": "whole-grains",
    "scientific_name": "Triticum aestivum",
    "usage_intensity": "primary",
    "summary": "Wheat berries and whole kernels anchor European and Middle Eastern grain bowls with nutty chew — their gluten-rich character pairs with structured reds, oaked Chardonnay, and rustic Mediterranean whites.",
    "aliases": [
      "Wheat Berries",
      "Whole Wheat Grain",
      "Hard Red Wheat",
      "Soft White Wheat"
    ],
    "common_names": [
      "Wheat Berries"
    ]
  },
  {
    "slug": "barley",
    "display_name": "Barley",
    "parent_group": "whole-grains",
    "scientific_name": "Hordeum vulgare",
    "usage_intensity": "primary",
    "summary": "Barley adds chewy malt sweetness to Scotch broth, mushroom risotto, and beer-braised stews — its earthy grain depth pairs with Scotch ale, Syrah, and mineral-driven northern whites.",
    "aliases": [
      "Hulled Barley",
      "Pot Barley",
      "Scotch Barley",
      "Whole Barley"
    ],
    "common_names": [
      "Pearl Barley Grain"
    ]
  },
  {
    "slug": "rye",
    "display_name": "Rye",
    "parent_group": "whole-grains",
    "scientific_name": "Secale cereale",
    "usage_intensity": "primary",
    "summary": "Rye grain delivers tangy, dense character to Nordic porridges and Eastern European kasha — its assertive grain note pairs with Riesling, lager, and earthy northern European reds.",
    "aliases": [
      "Rye Berries",
      "Whole Rye",
      "Rye Groats"
    ],
    "common_names": [
      "Rye Berries"
    ]
  },
  {
    "slug": "oats",
    "display_name": "Oats",
    "parent_group": "whole-grains",
    "scientific_name": "Avena sativa",
    "usage_intensity": "primary",
    "summary": "Oats provide creamy, mild sweetness to porridge, granola, and savory crumb coatings — their soft starch base pairs with Scotch, oaked Chardonnay, and breakfast-friendly sparkling wine.",
    "aliases": [
      "Rolled Oats",
      "Quick Oats",
      "Instant Oats",
      "Steel-Cut Oats",
      "Old-Fashioned Oats"
    ],
    "common_names": [
      "Rolled Oats"
    ]
  },
  {
    "slug": "corn",
    "display_name": "Corn",
    "parent_group": "whole-grains",
    "scientific_name": "Zea mays",
    "usage_intensity": "primary",
    "summary": "Field corn grain delivers sweet starchy backbone to polenta, tortillas, and Latin American staples — distinct from fresh sweet corn in the Vegetable Ontology, it pairs with Viognier, Mexican lagers, and Zinfandel.",
    "aliases": [
      "Maize",
      "Dent Corn",
      "Field Corn",
      "Dried Corn",
      "Whole Kernel Corn"
    ],
    "common_names": [
      "Maize"
    ]
  },
  {
    "slug": "millet",
    "display_name": "Millet",
    "parent_group": "whole-grains",
    "scientific_name": "Panicum miliaceum",
    "usage_intensity": "accent",
    "summary": "Millet is a small golden grain with mild nutty sweetness in African porridges and Indian roti — its delicate starch character pairs with aromatic whites, off-dry styles, and light rustic reds.",
    "aliases": [
      "Proso Millet",
      "Common Millet",
      "Hog Millet",
      "Yellow Millet"
    ],
    "common_names": [
      "Proso Millet"
    ]
  },
  {
    "slug": "sorghum",
    "display_name": "Sorghum",
    "parent_group": "whole-grains",
    "scientific_name": "Sorghum bicolor",
    "usage_intensity": "accent",
    "summary": "Sorghum grain adds mild molasses sweetness to Southern porridges, African beer, and gluten-free bowls — its neutral chewy starch pairs with Zinfandel, bourbon-friendly reds, and tropical whites.",
    "aliases": [
      "Milo",
      "Whole Sorghum",
      "Sorghum Grain",
      "Jowar"
    ],
    "common_names": [
      "Milo"
    ]
  },
  {
    "slug": "teff",
    "display_name": "Teff",
    "parent_group": "whole-grains",
    "scientific_name": "Eragrostis tef",
    "usage_intensity": "accent",
    "summary": "Teff is a tiny Ethiopian grain with earthy, slightly sour ferment character in injera — its distinctive sourdough starch base pairs with Ethiopian honey wine, Syrah, and aromatic off-dry whites.",
    "aliases": [
      "Teff Grain",
      "Eragrostis Teff",
      "Tef"
    ],
    "common_names": [
      "Tef"
    ]
  },
  {
    "slug": "spelt",
    "display_name": "Spelt",
    "parent_group": "whole-grains",
    "scientific_name": "Triticum spelta",
    "usage_intensity": "accent",
    "summary": "Spelt is an ancient wheat with nutty chew and mild sweetness in German grain salads and soups — its rustic grain depth pairs with Grüner Veltliner, Pinot Noir, and Alpine whites.",
    "aliases": [
      "Spelt Berries",
      "Dinkel",
      "Farro Spelt",
      "Whole Spelt"
    ],
    "common_names": [
      "Dinkel"
    ]
  },
  {
    "slug": "farro",
    "display_name": "Farro",
    "parent_group": "whole-grains",
    "scientific_name": "Triticum dicoccum",
    "usage_intensity": "accent",
    "summary": "Farro is an emmer wheat with firm chew and toasted nut flavor in Italian grain bowls and risotto — its hearty texture pairs with Sangiovese, Verdicchio, and herb-driven Mediterranean reds.",
    "aliases": [
      "Emmer",
      "Emmer Wheat",
      "Farro Medio",
      "Whole Farro"
    ],
    "common_names": [
      "Emmer"
    ]
  },
  {
    "slug": "wild-rice",
    "display_name": "Wild Rice",
    "parent_group": "whole-grains",
    "scientific_name": "Zizania palustris",
    "usage_intensity": "luxury",
    "summary": "Wild rice offers smoky, grassy luxury chew in Midwestern pilafs and game dishes — its distinctive aquatic grain character pairs with Pinot Noir, oaked Chardonnay, and earthy northern reds.",
    "aliases": [
      "Manoomin",
      "Canadian Wild Rice",
      "Cultivated Wild Rice",
      "Black Wild Rice"
    ],
    "common_names": [
      "Manoomin"
    ]
  },
  {
    "slug": "triticale",
    "display_name": "Triticale",
    "parent_group": "whole-grains",
    "scientific_name": "Triticosecale spp.",
    "usage_intensity": "accent",
    "summary": "Triticale combines wheat and rye genetics for mild tangy grain in health-food porridges and animal feed crossover cooking — its hybrid starch note pairs with Riesling and rustic European whites.",
    "aliases": [
      "Triticale Berries",
      "Whole Triticale",
      "Rye-Wheat Hybrid"
    ],
    "common_names": [
      "Triticale Berries"
    ]
  },
  {
    "slug": "fonio",
    "display_name": "Fonio",
    "parent_group": "whole-grains",
    "scientific_name": "Digitaria exilis",
    "usage_intensity": "accent",
    "summary": "Fonio is a fast-cooking West African grain with delicate couscous-like texture and nutty aroma — its light starch base pairs with tropical whites, off-dry styles, and spice-friendly light reds.",
    "aliases": [
      "Fonio Grain",
      "Acha",
      "Hungry Rice",
      "Fundi"
    ],
    "common_names": [
      "Acha"
    ]
  },
  {
    "slug": "einkorn",
    "display_name": "Einkorn",
    "parent_group": "whole-grains",
    "scientific_name": "Triticum monococcum",
    "usage_intensity": "accent",
    "summary": "Einkorn is the oldest cultivated wheat with sweet nutty flavor and tender chew in ancient-grain salads — its delicate grain character pairs with Vermentino, Pinot Grigio, and light Italian reds.",
    "aliases": [
      "Einkorn Wheat",
      "Einkorn Berries",
      "Small Spelt",
      "Farro Piccolo"
    ],
    "common_names": [
      "Einkorn Wheat"
    ]
  },
  {
    "slug": "khorasan-wheat",
    "display_name": "Khorasan Wheat",
    "parent_group": "whole-grains",
    "scientific_name": "Triticum turgidum subsp. turanicum",
    "usage_intensity": "luxury",
    "summary": "Khorasan wheat delivers buttery, large-kernel luxury chew in premium pasta and grain salads — marketed as Kamut, its rich grain depth pairs with Barolo, oaked whites, and structured Mediterranean reds.",
    "aliases": [
      "Kamut",
      "Oriental Wheat",
      "King Tut Wheat",
      "Khorasan Berries"
    ],
    "common_names": [
      "Kamut"
    ]
  },
  {
    "slug": "jobs-tears",
    "display_name": "Job's Tears",
    "parent_group": "whole-grains",
    "scientific_name": "Coix lacryma-jobi",
    "usage_intensity": "accent",
    "summary": "Job's tears are pearly Asian grains with mild corn-like sweetness in Chinese soups and Taiwanese drinks — their translucent chew pairs with sake, lager, and mineral-driven aromatic whites.",
    "aliases": [
      "Coix Seed",
      "Chinese Pearl Barley",
      "Adlay",
      "Yi Yi Ren"
    ],
    "common_names": [
      "Adlay"
    ]
  },
  {
    "slug": "finger-millet",
    "display_name": "Finger Millet",
    "parent_group": "whole-grains",
    "scientific_name": "Eleusine coracana",
    "usage_intensity": "accent",
    "summary": "Finger millet adds earthy, malty depth to South Indian ragi porridge and African beer — its robust small grain pairs with aromatic whites, lager, and spice-tolerant light reds.",
    "aliases": [
      "Ragi",
      "Nachni",
      "Eleusine Millet",
      "African Millet"
    ],
    "common_names": [
      "Ragi"
    ]
  },
  {
    "slug": "pearl-millet",
    "display_name": "Pearl Millet",
    "parent_group": "whole-grains",
    "scientific_name": "Pennisetum glaucum",
    "usage_intensity": "accent",
    "summary": "Pearl millet is a drought-hardy Sahel grain with mild hay-sweet flavor in Indian bajra roti and African couscous — its hearty starch pairs with rustic reds, lager, and tropical whites.",
    "aliases": [
      "Bajra",
      "Cattail Millet",
      "Bulrush Millet",
      "Pennisetum Millet"
    ],
    "common_names": [
      "Bajra"
    ]
  },
  {
    "slug": "foxtail-millet",
    "display_name": "Foxtail Millet",
    "parent_group": "whole-grains",
    "scientific_name": "Setaria italica",
    "usage_intensity": "accent",
    "summary": "Foxtail millet delivers fluffy, mild sweetness in Chinese millet porridge and Korean grain dishes — its delicate starch texture pairs with sake, off-dry Riesling, and light aromatic whites.",
    "aliases": [
      "Italian Millet",
      "Setaria Millet",
      "German Millet",
      "Mohan Millet"
    ],
    "common_names": [
      "Italian Millet"
    ]
  },
  {
    "slug": "proso-millet",
    "display_name": "Proso Millet",
    "parent_group": "whole-grains",
    "scientific_name": "Panicum miliaceum",
    "usage_intensity": "accent",
    "summary": "Proso millet is a golden Eastern European and Asian grain with mild nutty flavor in porridge and birdseed-grade cooking — its soft starch base pairs with crisp whites and light rustic reds.",
    "aliases": [
      "Common Millet Grain",
      "Broomcorn Millet",
      "White Millet",
      "Hog Millet Grain"
    ],
    "common_names": [
      "Broomcorn Millet"
    ]
  },
  {
    "slug": "barnyard-millet",
    "display_name": "Barnyard Millet",
    "parent_group": "whole-grains",
    "scientific_name": "Echinochloa esculenta",
    "usage_intensity": "accent",
    "summary": "Barnyard millet is a fast-cooking Indian grain with mild earthy sweetness in sambar rice and fasting dishes — its light starch character pairs with aromatic whites, lager, and spice-friendly rosé.",
    "aliases": [
      "Sanwa Millet",
      "Japanese Millet",
      "Echinochloa Millet",
      "Sawa Millet"
    ],
    "common_names": [
      "Sanwa Millet"
    ]
  },
  {
    "slug": "quinoa",
    "display_name": "Quinoa",
    "parent_group": "pseudocereals",
    "scientific_name": "Chenopodium quinoa",
    "usage_intensity": "primary",
    "summary": "Quinoa is a protein-rich Andean pseudocereal with nutty pop and fluffy texture in grain bowls — its complete protein starch base pairs with Torrontés, Sauvignon Blanc, and light Malbec.",
    "aliases": [
      "White Quinoa",
      "Red Quinoa",
      "Black Quinoa",
      "Quinoa Grain"
    ],
    "common_names": [
      "White Quinoa"
    ]
  },
  {
    "slug": "buckwheat",
    "display_name": "Buckwheat",
    "parent_group": "pseudocereals",
    "scientific_name": "Fagopyrum esculentum",
    "usage_intensity": "primary",
    "summary": "Buckwheat groats add earthy, slightly bitter depth to soba, kasha, and Breton galettes — its distinctive pseudocereal character pairs with Champagne, Muscadet, and mineral-driven whites.",
    "aliases": [
      "Buckwheat Groats",
      "Kasha",
      "Roasted Buckwheat",
      "Soba Grain"
    ],
    "common_names": [
      "Kasha"
    ]
  },
  {
    "slug": "amaranth",
    "display_name": "Amaranth",
    "parent_group": "pseudocereals",
    "scientific_name": "Amaranthus cruentus",
    "usage_intensity": "primary",
    "summary": "Amaranth is a tiny Aztec pseudocereal with peppery, malty pop in porridge and popped garnish — its dense protein starch pairs with Zinfandel, Mexican beer, and off-dry aromatic whites.",
    "aliases": [
      "Amaranth Grain",
      "Kiwicha",
      "Amaranth Seeds",
      "Rajgira"
    ],
    "common_names": [
      "Kiwicha"
    ]
  },
  {
    "slug": "kaniwa",
    "display_name": "Kaniwa",
    "parent_group": "pseudocereals",
    "scientific_name": "Chenopodium pallidicaule",
    "usage_intensity": "accent",
    "summary": "Kaniwa is a miniature Andean cousin of quinoa with earthy sweetness and no saponin bitterness — its delicate pseudocereal base pairs with Torrontés, high-altitude whites, and light Pinot Noir.",
    "aliases": [
      "Cañihua",
      "Canihua",
      "Baby Quinoa",
      "Kaniwa Grain"
    ],
    "common_names": [
      "Cañihua"
    ]
  },
  {
    "slug": "chia",
    "display_name": "Chia",
    "parent_group": "pseudocereals",
    "scientific_name": "Salvia hispanica",
    "usage_intensity": "accent",
    "summary": "Chia seeds gel into mucilaginous pudding and add crunch to health bowls — their neutral omega-rich starch character pairs with tropical fruit wines, off-dry whites, and dessert-friendly styles.",
    "aliases": [
      "Chia Seeds",
      "Salba",
      "Chia Grain",
      "Black Chia"
    ],
    "common_names": [
      "Chia Seeds"
    ]
  },
  {
    "slug": "perilla-seed",
    "display_name": "Perilla Seed",
    "parent_group": "pseudocereals",
    "scientific_name": "Perilla frutescens",
    "usage_intensity": "accent",
    "summary": "Perilla seeds add minty, sesame-like depth when pressed or toasted in Korean banchan and Japanese furikake — their aromatic oil-rich character pairs with sake, soju-friendly whites, and light reds.",
    "aliases": [
      "Perilla Seeds",
      "Deulkkae",
      "Shiso Seed",
      "Wild Sesame"
    ],
    "common_names": [
      "Deulkkae"
    ]
  },
  {
    "slug": "plantain-flour",
    "display_name": "Plantain Flour",
    "parent_group": "pseudocereals",
    "scientific_name": "Musa × paradisiaca",
    "usage_intensity": "accent",
    "summary": "Plantain flour is a green-banana starch base for Caribbean and Latin gluten-free baking — its mild starchy sweetness pairs with rum, tropical whites, and fruit-forward off-dry styles.",
    "aliases": [
      "Green Banana Flour",
      "Plátano Flour",
      "Banana Starch Flour"
    ],
    "common_names": [
      "Green Banana Flour"
    ]
  },
  {
    "slug": "mesquite-flour",
    "display_name": "Mesquite Flour",
    "parent_group": "pseudocereals",
    "scientific_name": "Prosopis glandulosa",
    "usage_intensity": "accent",
    "summary": "Mesquite flour adds smoky, caramel-sweet desert character to Southwestern baking and tortillas — its distinctive pod starch pairs with Zinfandel, Tempranillo, and bold smoky reds.",
    "aliases": [
      "Mesquite Meal",
      "Mesquite Pod Flour",
      "Algarroba Flour"
    ],
    "common_names": [
      "Algarroba Flour"
    ]
  },
  {
    "slug": "wattleseed",
    "display_name": "Wattleseed",
    "parent_group": "pseudocereals",
    "scientific_name": "Acacia victoriae",
    "usage_intensity": "luxury",
    "summary": "Wattleseed is an Australian acacia seed with coffee-chocolate aroma in bush tucker desserts and bread — its roasted luxury character pairs with Shiraz, fortified wines, and rich dessert styles.",
    "aliases": [
      "Wattle Seed",
      "Acacia Seed",
      "Roasted Wattleseed",
      "Australian Wattleseed"
    ],
    "common_names": [
      "Acacia Seed"
    ]
  },
  {
    "slug": "wheat-flour",
    "display_name": "Wheat Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Triticum aestivum",
    "usage_intensity": "primary",
    "summary": "Wheat flour is the global baking backbone — from bread to pastry, its gluten structure and neutral starch define wine pairings for crusty loaves with Chianti, Champagne, and oaked whites.",
    "aliases": [
      "Bread Flour",
      "Cake Flour",
      "All-Purpose Flour",
      "AP Flour",
      "Plain Flour",
      "White Flour"
    ],
    "common_names": [
      "All-Purpose Flour"
    ]
  },
  {
    "slug": "rice-flour",
    "display_name": "Rice Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Oryza sativa",
    "usage_intensity": "primary",
    "summary": "Rice flour creates delicate gluten-free noodles, mochi, and Southeast Asian batters — its fine neutral starch pairs with sake, aromatic whites, and light lager with fried preparations.",
    "aliases": [
      "White Rice Flour",
      "Glutinous Rice Flour",
      "Mochiko",
      "Ground Rice"
    ],
    "common_names": [
      "White Rice Flour"
    ]
  },
  {
    "slug": "cornmeal",
    "display_name": "Cornmeal",
    "parent_group": "processed-grains",
    "scientific_name": "Zea mays",
    "usage_intensity": "primary",
    "summary": "Cornmeal grounds Southern cornbread, Italian polenta bases, and Latin arepas with sweet grain crunch — its golden starch character pairs with Viognier, bourbon, and Zinfandel.",
    "aliases": [
      "Yellow Cornmeal",
      "Stone-Ground Cornmeal",
      "Fine Cornmeal",
      "Coarse Cornmeal"
    ],
    "common_names": [
      "Yellow Cornmeal"
    ]
  },
  {
    "slug": "semolina",
    "display_name": "Semolina",
    "parent_group": "processed-grains",
    "scientific_name": "Triticum durum",
    "usage_intensity": "primary",
    "summary": "Semolina is durum wheat middlings essential to pasta dough, couscous, and semolina pudding — its firm gluten starch pairs with Sangiovese, Barolo, and structured Italian reds.",
    "aliases": [
      "Durum Semolina",
      "Semolina Flour",
      "Semola",
      "Coarse Semolina"
    ],
    "common_names": [
      "Durum Semolina"
    ]
  },
  {
    "slug": "bulgur",
    "display_name": "Bulgur",
    "parent_group": "processed-grains",
    "scientific_name": "Triticum durum",
    "usage_intensity": "primary",
    "summary": "Bulgur is parboiled cracked wheat for tabbouleh, kibbeh, and pilaf with nutty chew — its Middle Eastern starch base pairs with Lebanese whites, Rosé, and Mediterranean reds.",
    "aliases": [
      "Bulgur Wheat",
      "Cracked Wheat",
      "Burghul",
      "Bulgar"
    ],
    "common_names": [
      "Burghul"
    ]
  },
  {
    "slug": "couscous",
    "display_name": "Couscous",
    "parent_group": "processed-grains",
    "scientific_name": "Triticum durum",
    "usage_intensity": "primary",
    "summary": "Couscous is steamed semolina granules absorbing tagine sauces and stews across North Africa — its fluffy starch vehicle pairs with Moroccan reds, aromatic whites, and spice-friendly rosé.",
    "aliases": [
      "Moroccan Couscous",
      "Instant Couscous",
      "Israeli Couscous Style",
      "Ptitim"
    ],
    "common_names": [
      "Moroccan Couscous"
    ]
  },
  {
    "slug": "rye-flour",
    "display_name": "Rye Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Secale cereale",
    "usage_intensity": "accent",
    "summary": "Rye flour adds tangy, dense character to pumpernickel, Scandinavian crispbread, and sourdough — its assertive starch pairs with Riesling, lager, and earthy northern European reds.",
    "aliases": [
      "Dark Rye Flour",
      "Light Rye Flour",
      "Pumpernickel Flour",
      "Whole Rye Flour"
    ],
    "common_names": [
      "Dark Rye Flour"
    ]
  },
  {
    "slug": "barley-flour",
    "display_name": "Barley Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Hordeum vulgare",
    "usage_intensity": "accent",
    "summary": "Barley flour contributes malty sweetness to Scottish bannocks and Japanese mugi pan — its low-gluten starch character pairs with Scotch ale, mineral whites, and light smoky reds.",
    "aliases": [
      "Malted Barley Flour",
      "Pearl Barley Flour",
      "Ground Barley"
    ],
    "common_names": [
      "Ground Barley"
    ]
  },
  {
    "slug": "oat-flour",
    "display_name": "Oat Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Avena sativa",
    "usage_intensity": "accent",
    "summary": "Oat flour adds mild sweetness and tender crumb to gluten-free baking and Scottish oatcakes — its soft starch base pairs with Scotch, oaked Chardonnay, and honeyed dessert wines.",
    "aliases": [
      "Ground Oats",
      "Whole Oat Flour",
      "Fine Oat Flour"
    ],
    "common_names": [
      "Ground Oats"
    ]
  },
  {
    "slug": "polenta-meal",
    "display_name": "Polenta Meal",
    "parent_group": "processed-grains",
    "scientific_name": "Zea mays",
    "usage_intensity": "primary",
    "summary": "Polenta meal is coarsely ground corn for creamy Northern Italian porridge and grilled cakes — its buttery corn starch pairs with Barolo, Nebbiolo, and rich braised-meat reds.",
    "aliases": [
      "Polenta",
      "Coarse Polenta",
      "Fine Polenta",
      "Corn Polenta"
    ],
    "common_names": [
      "Polenta"
    ]
  },
  {
    "slug": "grits",
    "display_name": "Grits",
    "parent_group": "processed-grains",
    "scientific_name": "Zea mays",
    "usage_intensity": "primary",
    "summary": "Grits are coarsely ground Southern corn porridge with creamy starch and subtle sweetness — their comfort base pairs with bourbon, Viognier, and shrimp-friendly crisp whites.",
    "aliases": [
      "Corn Grits",
      "Stone-Ground Grits",
      "Hominy Grits",
      "White Grits"
    ],
    "common_names": [
      "Corn Grits"
    ]
  },
  {
    "slug": "hominy",
    "display_name": "Hominy",
    "parent_group": "processed-grains",
    "scientific_name": "Zea mays",
    "usage_intensity": "accent",
    "summary": "Hominy is nixtamalized corn with alkaline depth for pozole, menudo, and Southern stews — its puffy corn starch character pairs with Mexican lagers, Tempranillo, and smoky reds.",
    "aliases": [
      "Nixtamalized Corn",
      "Posole Corn",
      "Canned Hominy",
      "Dried Hominy"
    ],
    "common_names": [
      "Posole"
    ]
  },
  {
    "slug": "freekeh",
    "display_name": "Freekeh",
    "parent_group": "processed-grains",
    "scientific_name": "Triticum durum",
    "usage_intensity": "accent",
    "summary": "Freekeh is green wheat roasted for smoky, nutty Levantine pilafs and salads — its charred grain depth pairs with Lebanese reds, Rosé, and herb-driven Mediterranean whites.",
    "aliases": [
      "Freekeh Wheat",
      "Farik",
      "Firik",
      "Roasted Green Wheat"
    ],
    "common_names": [
      "Farik"
    ]
  },
  {
    "slug": "pearl-barley",
    "display_name": "Pearl Barley",
    "parent_group": "processed-grains",
    "scientific_name": "Hordeum vulgare",
    "usage_intensity": "accent",
    "summary": "Pearl barley is polished barley for Scotch broth, mushroom risotto, and beef barley soup — its chewy malt starch pairs with Syrah, Pinot Noir, and mineral northern whites.",
    "aliases": [
      "Pearled Barley",
      "Polished Barley",
      "Scotch Broth Barley"
    ],
    "common_names": [
      "Pearled Barley"
    ]
  },
  {
    "slug": "spelt-flour",
    "display_name": "Spelt Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Triticum spelta",
    "usage_intensity": "accent",
    "summary": "Spelt flour adds ancient-wheat nuttiness to European bread and pasta with lighter gluten — its rustic starch character pairs with Grüner Veltliner, Pinot Noir, and Alpine whites.",
    "aliases": [
      "Whole Spelt Flour",
      "White Spelt Flour",
      "Dinkel Flour"
    ],
    "common_names": [
      "Dinkel Flour"
    ]
  },
  {
    "slug": "buckwheat-flour",
    "display_name": "Buckwheat Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Fagopyrum esculentum",
    "usage_intensity": "accent",
    "summary": "Buckwheat flour creates earthy Breton crêpes, Japanese soba, and Russian blini — its bold pseudocereal starch pairs with Champagne, Muscadet, and mineral-driven whites.",
    "aliases": [
      "Soba Flour",
      "Dark Buckwheat Flour",
      "Light Buckwheat Flour"
    ],
    "common_names": [
      "Soba Flour"
    ]
  },
  {
    "slug": "quinoa-flour",
    "display_name": "Quinoa Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Chenopodium quinoa",
    "usage_intensity": "accent",
    "summary": "Quinoa flour adds protein-rich nuttiness to gluten-free baking and Andean flatbreads — its earthy starch base pairs with Torrontés, Sauvignon Blanc, and light Malbec.",
    "aliases": [
      "Ground Quinoa",
      "Quinoa Meal",
      "Whole Quinoa Flour"
    ],
    "common_names": [
      "Ground Quinoa"
    ]
  },
  {
    "slug": "amaranth-flour",
    "display_name": "Amaranth Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Amaranthus cruentus",
    "usage_intensity": "accent",
    "summary": "Amaranth flour contributes peppery, malty density to Aztec-inspired baking and health breads — its protein-rich starch pairs with Zinfandel, Mexican beer, and off-dry whites.",
    "aliases": [
      "Ground Amaranth",
      "Amaranth Meal",
      "Rajgira Flour"
    ],
    "common_names": [
      "Rajgira Flour"
    ]
  },
  {
    "slug": "masa-harina",
    "display_name": "Masa Harina",
    "parent_group": "processed-grains",
    "scientific_name": "Zea mays",
    "usage_intensity": "primary",
    "summary": "Masa harina is nixtamalized corn flour for tortillas, tamales, and pupusas — its lime-treated corn starch pairs with Mexican lagers, Tempranillo, and high-acid tropical whites.",
    "aliases": [
      "Masa Flour",
      "Corn Masa",
      "Instant Masa",
      "Nixtamal Flour"
    ],
    "common_names": [
      "Masa Flour"
    ]
  },
  {
    "slug": "farina",
    "display_name": "Farina",
    "parent_group": "processed-grains",
    "scientific_name": "Triticum aestivum",
    "usage_intensity": "accent",
    "summary": "Farina is finely milled wheat semolina for cream of wheat porridge and dusting — its mild sweet starch pairs with morning sparkling wine, oaked Chardonnay, and light dessert styles.",
    "aliases": [
      "Cream of Wheat",
      "Semolina Farina",
      "Wheat Farina",
      "Breakfast Farina"
    ],
    "common_names": [
      "Cream of Wheat"
    ]
  },
  {
    "slug": "whole-wheat-flour",
    "display_name": "Whole Wheat Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Triticum aestivum",
    "usage_intensity": "primary",
    "summary": "Whole wheat flour retains bran and germ for nutty, dense bread and pasta — its robust starch character pairs with rustic Italian reds, farmhouse ale, and structured Mediterranean whites.",
    "aliases": [
      "Graham Flour",
      "Wholemeal Flour",
      "Atta",
      "Whole Grain Wheat Flour"
    ],
    "common_names": [
      "Wholemeal Flour"
    ]
  },
  {
    "slug": "matzo-meal",
    "display_name": "Matzo Meal",
    "parent_group": "processed-grains",
    "scientific_name": "Triticum aestivum",
    "usage_intensity": "accent",
    "summary": "Matzo meal is ground unleavened cracker wheat for Passover matzo balls and coating — its neutral crisp starch pairs with kosher whites, Manischewitz-friendly styles, and light reds.",
    "aliases": [
      "Matzah Meal",
      "Matzoh Meal",
      "Ground Matzo",
      "Passover Matzo Meal"
    ],
    "common_names": [
      "Matzah Meal"
    ]
  },
  {
    "slug": "sorghum-flour",
    "display_name": "Sorghum Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Sorghum bicolor",
    "usage_intensity": "accent",
    "summary": "Sorghum flour adds mild molasses sweetness to gluten-free baking and African flatbreads — its neutral starch base pairs with Zinfandel, bourbon-friendly reds, and tropical whites.",
    "aliases": [
      "Jowar Flour",
      "Milo Flour",
      "Sweet Sorghum Flour",
      "Ground Sorghum"
    ],
    "common_names": [
      "Jowar Flour"
    ]
  },
  {
    "slug": "millet-flour",
    "display_name": "Millet Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Panicum miliaceum",
    "usage_intensity": "accent",
    "summary": "Millet flour creates tender gluten-free flatbreads and Indian bajra roti with mild sweetness — its delicate starch pairs with aromatic whites, lager, and light rustic reds.",
    "aliases": [
      "Bajra Flour",
      "Proso Millet Flour",
      "Ground Millet"
    ],
    "common_names": [
      "Bajra Flour"
    ]
  },
  {
    "slug": "teff-flour",
    "display_name": "Teff Flour",
    "parent_group": "processed-grains",
    "scientific_name": "Eragrostis tef",
    "usage_intensity": "accent",
    "summary": "Teff flour is the sourdough backbone of Ethiopian injera with earthy ferment depth — its tiny-grain starch base pairs with Ethiopian honey wine, Syrah, and aromatic off-dry whites.",
    "aliases": [
      "Ground Teff",
      "Injera Flour",
      "Brown Teff Flour",
      "Ivory Teff Flour"
    ],
    "common_names": [
      "Injera Flour"
    ]
  },
  {
    "slug": "cornstarch",
    "display_name": "Cornstarch",
    "parent_group": "starches",
    "scientific_name": "Zea mays",
    "usage_intensity": "accent",
    "summary": "Cornstarch is a neutral thickener for stir-fry sauces, fruit pie filling, and velveting — its invisible starch body lets dish flavors drive pairing with aromatic whites, lager, and light reds.",
    "aliases": [
      "Corn Starch",
      "Maize Starch",
      "Cornflour",
      "US Cornstarch"
    ],
    "common_names": [
      "Corn Starch"
    ]
  },
  {
    "slug": "potato-starch",
    "display_name": "Potato Starch",
    "parent_group": "starches",
    "scientific_name": "Solanum tuberosum",
    "usage_intensity": "accent",
    "summary": "Potato starch thickens European gravies and gluten-free baking with silky clarity — distinct from the whole potato in the Vegetable Ontology, it pairs with crisp whites and delicate fish wines.",
    "aliases": [
      "Potato Starch Powder",
      "Potato Flour Starch",
      "Kartoffelstärke"
    ],
    "common_names": [
      "Potato Starch Powder"
    ]
  },
  {
    "slug": "tapioca-starch",
    "display_name": "Tapioca Starch",
    "parent_group": "starches",
    "scientific_name": "Manihot esculenta",
    "usage_intensity": "accent",
    "summary": "Tapioca starch creates chewy pearls, glossy pie filling, and Brazilian pão de queijo structure — its neutral cassava starch pairs with tropical whites, lager, and fruit-forward off-dry styles.",
    "aliases": [
      "Tapioca Flour",
      "Cassava Starch",
      "Manioc Starch",
      "Tapioca Powder"
    ],
    "common_names": [
      "Tapioca Flour"
    ]
  },
  {
    "slug": "arrowroot-starch",
    "display_name": "Arrowroot Starch",
    "parent_group": "starches",
    "scientific_name": "Maranta arundinacea",
    "usage_intensity": "accent",
    "summary": "Arrowroot starch delivers clear, glossy thickening for delicate sauces and fruit compotes — its neutral starch body pairs with sparkling wine, light whites, and subtle dessert wines.",
    "aliases": [
      "Arrowroot Powder",
      "Arrowroot Flour",
      "Maranta Starch"
    ],
    "common_names": [
      "Arrowroot Powder"
    ]
  },
  {
    "slug": "wheat-starch",
    "display_name": "Wheat Starch",
    "parent_group": "starches",
    "scientific_name": "Triticum aestivum",
    "usage_intensity": "accent",
    "summary": "Wheat starch refines Asian dumpling wrappers and European baking with neutral body — its purified gluten-adjacent starch pairs with Riesling, lager, and light structured whites.",
    "aliases": [
      "Wheat Starch Powder",
      "Purified Wheat Starch",
      "White Wheat Starch"
    ],
    "common_names": [
      "Wheat Starch Powder"
    ]
  },
  {
    "slug": "rice-starch",
    "display_name": "Rice Starch",
    "parent_group": "starches",
    "scientific_name": "Oryza sativa",
    "usage_intensity": "accent",
    "summary": "Rice starch thickens Asian desserts, baby food, and hypoallergenic sauces with clean neutrality — its mild starch body pairs with sake, aromatic whites, and delicate sparkling wine.",
    "aliases": [
      "Rice Starch Powder",
      "Rice Flour Starch"
    ],
    "common_names": [
      "Rice Starch Powder"
    ]
  },
  {
    "slug": "sago-starch",
    "display_name": "Sago Starch",
    "parent_group": "starches",
    "scientific_name": "Metroxylon sagu",
    "usage_intensity": "accent",
    "summary": "Sago starch forms translucent pearls in Southeast Asian puddings and bubble tea — its neutral palm starch pairs with tropical fruit wines, lager, and off-dry aromatic whites.",
    "aliases": [
      "Sago Pearls",
      "Sago Flour",
      "Sabudana Starch",
      "Palm Sago"
    ],
    "common_names": [
      "Sabudana"
    ]
  },
  {
    "slug": "kudzu-starch",
    "display_name": "Kudzu Starch",
    "parent_group": "starches",
    "scientific_name": "Pueraria montana",
    "usage_intensity": "accent",
    "summary": "Kudzu starch is a Japanese and Chinese root thickener for clear sauces and wagashi — its glossy neutral body pairs with sake, light green tea whites, and delicate dessert wines.",
    "aliases": [
      "Kudzu Powder",
      "Kuzu Starch",
      "Kuzuko",
      "Arrowroot Kudzu"
    ],
    "common_names": [
      "Kuzu Starch"
    ]
  },
  {
    "slug": "mung-bean-starch",
    "display_name": "Mung Bean Starch",
    "parent_group": "starches",
    "scientific_name": "Vigna radiata",
    "usage_intensity": "accent",
    "summary": "Mung bean starch creates translucent Chinese cellophane noodles and Korean jelly — its clean legume starch pairs with sake, soju-friendly whites, and light aromatic reds.",
    "aliases": [
      "Green Bean Starch",
      "Mung Starch",
      "Glass Noodle Starch",
      "Bean Thread Starch"
    ],
    "common_names": [
      "Green Bean Starch"
    ]
  },
  {
    "slug": "water-chestnut-starch",
    "display_name": "Water Chestnut Starch",
    "parent_group": "starches",
    "scientific_name": "Eleocharis dulcis",
    "usage_intensity": "accent",
    "summary": "Water chestnut starch adds crisp coating to Chinese dim sum and stir-fry with subtle sweetness — its light starch crunch pairs with lager, off-dry Riesling, and aromatic whites.",
    "aliases": [
      "Water Chestnut Flour",
      "Chestnut Water Starch",
      "Ground Water Chestnut"
    ],
    "common_names": [
      "Water Chestnut Flour"
    ]
  },
  {
    "slug": "sweet-potato-starch",
    "display_name": "Sweet Potato Starch",
    "parent_group": "starches",
    "scientific_name": "Ipomoea batatas",
    "usage_intensity": "accent",
    "summary": "Sweet potato starch thickens Korean japchae noodles and Asian desserts with subtle sweetness — distinct from the whole tuber in the Vegetable Ontology, it pairs with off-dry whites and light reds.",
    "aliases": [
      "Sweet Potato Flour Starch",
      "Korean Sweet Potato Starch",
      "Ground Sweet Potato Starch"
    ],
    "common_names": [
      "Korean Sweet Potato Starch"
    ]
  },
  {
    "slug": "taro-starch",
    "display_name": "Taro Starch",
    "parent_group": "starches",
    "scientific_name": "Colocasia esculenta",
    "usage_intensity": "accent",
    "summary": "Taro starch adds purple-hued body to Taiwanese desserts and bubble tea with earthy sweetness — its root starch character pairs with tropical whites, lager, and fruit-forward off-dry styles.",
    "aliases": [
      "Taro Flour",
      "Colocasia Starch",
      "Ground Taro Starch"
    ],
    "common_names": [
      "Taro Flour"
    ]
  },
  {
    "slug": "sorghum-starch",
    "display_name": "Sorghum Starch",
    "parent_group": "starches",
    "scientific_name": "Sorghum bicolor",
    "usage_intensity": "accent",
    "summary": "Sorghum starch is a gluten-free thickener for sauces and industrial food with mild neutral body — its clean starch base pairs with Zinfandel, bourbon-friendly reds, and tropical whites.",
    "aliases": [
      "Milo Starch",
      "Sorghum Starch Powder",
      "Gluten-Free Sorghum Starch"
    ],
    "common_names": [
      "Milo Starch"
    ]
  },
  {
    "slug": "waxy-corn-starch",
    "display_name": "Waxy Corn Starch",
    "parent_group": "starches",
    "scientific_name": "Zea mays",
    "usage_intensity": "accent",
    "summary": "Waxy corn starch delivers high amylopectin gloss for Asian noodles and processed food with superior freeze-thaw stability — its neutral body pairs with aromatic whites and light lager.",
    "aliases": [
      "Waxy Maize Starch",
      "High Amylopectin Corn Starch",
      "Modified Waxy Corn Starch"
    ],
    "common_names": [
      "Waxy Maize Starch"
    ]
  },
  {
    "slug": "potato-flour",
    "display_name": "Potato Flour",
    "parent_group": "starches",
    "scientific_name": "Solanum tuberosum",
    "usage_intensity": "accent",
    "summary": "Potato flour adds moisture retention and earthy body to Scandinavian bread and gluten-free baking — distinct from potato starch, it pairs with crisp whites, lager, and Nordic aquavit-friendly wines.",
    "aliases": [
      "Potato Powder",
      "Dehydrated Potato Flour",
      "Whole Potato Flour"
    ],
    "common_names": [
      "Potato Powder"
    ]
  },
  {
    "slug": "waxy-rice-starch",
    "display_name": "Waxy Rice Starch",
    "parent_group": "starches",
    "scientific_name": "Oryza sativa",
    "usage_intensity": "accent",
    "summary": "Waxy rice starch creates chewy mochi texture and glossy Asian desserts with high amylopectin — its sticky rice starch pairs with sake, off-dry Riesling, and dessert sparkling wine.",
    "aliases": [
      "Glutinous Rice Starch Powder",
      "Sticky Rice Starch",
      "Sweet Rice Starch"
    ],
    "common_names": [
      "Sticky Rice Starch"
    ]
  },
  {
    "slug": "pea-starch",
    "display_name": "Pea Starch",
    "parent_group": "starches",
    "scientific_name": "Pisum sativum",
    "usage_intensity": "accent",
    "summary": "Pea starch is a plant-based thickener for vegan sauces and gluten-free pasta with neutral body — its clean legume starch pairs with Pinot Noir, crisp whites, and herb-driven light reds.",
    "aliases": [
      "Pea Starch Powder",
      "Green Pea Starch",
      "Plant-Based Pea Starch"
    ],
    "common_names": [
      "Green Pea Starch"
    ]
  },
  {
    "slug": "glutinous-rice-starch",
    "display_name": "Glutinous Rice Starch",
    "parent_group": "starches",
    "scientific_name": "Oryza sativa",
    "usage_intensity": "accent",
    "summary": "Glutinous rice starch binds Chinese tang yuan, Japanese daifuku, and Southeast Asian sweets — its sticky mochi starch pairs with sake, lychee wine, and off-dry dessert whites.",
    "aliases": [
      "Sweet Rice Flour Starch",
      "Mochi Starch",
      "Shiratamako Starch"
    ],
    "common_names": [
      "Mochi Starch"
    ]
  },
  {
    "slug": "chestnut-starch",
    "display_name": "Chestnut Starch",
    "parent_group": "starches",
    "scientific_name": "Castanea sativa",
    "usage_intensity": "accent",
    "summary": "Chestnut starch adds nutty sweetness to Corsican and Italian gluten-free baking and desserts — its aromatic starch character pairs with Vin Santo, Moscato, and autumnal dessert wines.",
    "aliases": [
      "Chestnut Flour Starch",
      "Farina di Castagne Starch",
      "Ground Chestnut Starch"
    ],
    "common_names": [
      "Chestnut Flour"
    ]
  },
  {
    "slug": "lotus-root-starch",
    "display_name": "Lotus Root Starch",
    "parent_group": "starches",
    "scientific_name": "Nelumbo nucifera",
    "usage_intensity": "accent",
    "summary": "Lotus root starch thickens Chinese soups, coatings, and delicate desserts with a clean neutral finish — its silky binder character pairs with aromatic whites, light lager, and off-dry Riesling.",
    "aliases": [
      "Lotus Starch",
      "Lotus Root Powder",
      "Nelumbo Starch"
    ],
    "common_names": [
      "Lotus Root Powder"
    ]
  }
];
