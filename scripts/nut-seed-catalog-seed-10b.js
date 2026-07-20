/**
 * FOOD-10B — Canonical nut & seed seed data.
 * Each entry is one canonical culinary ingredient (CANON-001).
 */

/** @typedef {object} NutSeedSeed
 * @property {string} slug
 * @property {string} display_name
 * @property {"tree-nuts"|"peanuts"|"edible-seeds"|"seed-spices"|"nut-products"|"seed-products"} parent_group
 * @property {string} scientific_name
 * @property {"primary"|"accent"|"luxury"} usage_intensity
 * @property {string[]} [aliases]
 * @property {string[]} [common_names]
 * @property {string} [origin_context]
 * @property {string} summary
 */

export const GROUP_SLUGS = [
  "tree-nuts",
  "peanuts",
  "edible-seeds",
  "seed-spices",
  "nut-products",
  "seed-products"
];

export const GROUP_TO_CULINARY_GROUP = {
  "tree-nuts": "tree_nuts",
  "peanuts": "peanuts",
  "edible-seeds": "edible_seeds",
  "seed-spices": "seed_spices",
  "nut-products": "nut_products",
  "seed-products": "seed_products"
};

/** @type {NutSeedSeed[]} */
export const NUT_SEED_SEED = [
  {
    "slug": "almond",
    "display_name": "Almond",
    "parent_group": "tree-nuts",
    "scientific_name": "Prunus dulcis",
    "usage_intensity": "primary",
    "summary": "Almond is a canonical marzipan and crusts ingredient — tree nut use in marzipan and crusts cooking pairs with Almondine whites, dry Sherry, and light Pinot Noir.",
    "aliases": [
      "Chopped Almond",
      "Sliced Almond",
      "Blanched Almond"
    ],
    "common_names": [
      "Sweet Almond"
    ]
  },
  {
    "slug": "almond-butter",
    "display_name": "Almond Butter",
    "parent_group": "nut-products",
    "scientific_name": "Prunus dulcis",
    "usage_intensity": "primary",
    "summary": "Almond Butter is a canonical spreads and modern pastry ingredient — nut butter use in spreads and modern pastry cooking pairs with off-dry whites and nutty oxidative pairings."
  },
  {
    "slug": "almond-flour",
    "display_name": "Almond Flour",
    "parent_group": "nut-products",
    "scientific_name": "Prunus dulcis",
    "usage_intensity": "primary",
    "summary": "Almond Flour is a canonical macaron and gluten-free baking ingredient — nut flour use in macaron and gluten-free baking cooking pairs with Almondine whites and oxidative dessert wines."
  },
  {
    "slug": "almond-meal",
    "display_name": "Almond Meal",
    "parent_group": "nut-products",
    "scientific_name": "Prunus dulcis",
    "usage_intensity": "accent",
    "summary": "Almond Meal is a canonical crumbed fish and tart bases ingredient — nut meal use in crumbed fish and tart bases cooking pairs with Mediterranean whites and light structured reds."
  },
  {
    "slug": "baru-nut",
    "display_name": "Baru Nut",
    "parent_group": "tree-nuts",
    "scientific_name": "Dipteryx alata",
    "usage_intensity": "accent",
    "summary": "Baru Nut is a canonical Brazilian cerrado roasting ingredient — tree nut use in Brazilian cerrado roasting cooking pairs with Brazilian reds and tropical fruit whites."
  },
  {
    "slug": "beechnut",
    "display_name": "Beechnut",
    "parent_group": "tree-nuts",
    "scientific_name": "Fagus sylvatica",
    "usage_intensity": "accent",
    "summary": "Beechnut is a canonical Central European pastries ingredient — tree nut use in Central European pastries cooking pairs with German Riesling and alpine whites."
  },
  {
    "slug": "bitter-almond",
    "display_name": "Bitter Almond",
    "parent_group": "tree-nuts",
    "scientific_name": "Prunus dulcis amara",
    "usage_intensity": "accent",
    "summary": "Bitter Almond is a canonical European almond extract ingredient — tree nut use in European almond extract cooking pairs with Amaretto-friendly dessert wines and oxidative whites."
  },
  {
    "slug": "brazil-nut",
    "display_name": "Brazil Nut",
    "parent_group": "tree-nuts",
    "scientific_name": "Bertholletia excelsa",
    "usage_intensity": "accent",
    "summary": "Brazil Nut is a canonical baking and garnish ingredient — tree nut use in baking and garnish cooking pairs with Malbec, tropical fruit whites, and Tawny Port.",
    "aliases": [
      "Pará Nut"
    ]
  },
  {
    "slug": "brazil-nut-meal",
    "display_name": "Brazil Nut Meal",
    "parent_group": "nut-products",
    "scientific_name": "Bertholletia excelsa",
    "usage_intensity": "accent",
    "summary": "Brazil Nut Meal is a canonical gluten-free baking ingredient — nut meal use in gluten-free baking cooking pairs with Malbec and tropical fruit whites."
  },
  {
    "slug": "breadfruit-seed",
    "display_name": "Breadfruit Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Artocarpus altilis",
    "usage_intensity": "accent",
    "summary": "Breadfruit Seed is a canonical Pacific Island roasting ingredient — edible seed use in Pacific Island roasting cooking pairs with tropical whites and light island reds."
  },
  {
    "slug": "breadnut-seed",
    "display_name": "Breadnut Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Brosimum alicastrum",
    "usage_intensity": "accent",
    "summary": "Breadnut Seed is a canonical Mesoamerican staple roasting ingredient — edible seed use in Mesoamerican staple roasting cooking pairs with Central American whites and cacao-friendly reds."
  },
  {
    "slug": "candlenut",
    "display_name": "Candlenut",
    "parent_group": "tree-nuts",
    "scientific_name": "Aleurites moluccanus",
    "usage_intensity": "accent",
    "summary": "Candlenut is a canonical Indonesian curry pastes ingredient — tree nut use in Indonesian curry pastes cooking pairs with aromatic whites and spice-friendly reds.",
    "aliases": [
      "Kukui Nut"
    ]
  },
  {
    "slug": "cashew",
    "display_name": "Cashew",
    "parent_group": "tree-nuts",
    "scientific_name": "Anacardium occidentale",
    "usage_intensity": "primary",
    "summary": "Cashew is a canonical curries and stir-fries ingredient — tree nut use in curries and stir-fries cooking pairs with Viognier, off-dry whites, and light tropical reds.",
    "aliases": [
      "Raw Cashew",
      "Roasted Cashew"
    ]
  },
  {
    "slug": "cashew-butter",
    "display_name": "Cashew Butter",
    "parent_group": "nut-products",
    "scientific_name": "Anacardium occidentale",
    "usage_intensity": "primary",
    "summary": "Cashew Butter is a canonical vegan sauces and curry bases ingredient — nut butter use in vegan sauces and curry bases cooking pairs with Viognier and off-dry aromatic whites."
  },
  {
    "slug": "cashew-flour",
    "display_name": "Cashew Flour",
    "parent_group": "nut-products",
    "scientific_name": "Anacardium occidentale",
    "usage_intensity": "accent",
    "summary": "Cashew Flour is a canonical gluten-free baking ingredient — nut flour use in gluten-free baking cooking pairs with aromatic whites and light vegetarian pairings."
  },
  {
    "slug": "chestnut",
    "display_name": "Chestnut",
    "parent_group": "tree-nuts",
    "scientific_name": "Castanea sativa",
    "usage_intensity": "primary",
    "summary": "Chestnut is a canonical roasting and stuffing ingredient — tree nut use in roasting and stuffing cooking pairs with Barolo, aged Nebbiolo, and oxidative northern whites.",
    "aliases": [
      "Sweet Chestnut",
      "Marrons"
    ]
  },
  {
    "slug": "chestnut-flour",
    "display_name": "Chestnut Flour",
    "parent_group": "nut-products",
    "scientific_name": "Castanea sativa",
    "usage_intensity": "primary",
    "summary": "Chestnut Flour is a canonical Italian castagnaccio ingredient — nut flour use in Italian castagnaccio cooking pairs with Nebbiolo and oxidative mountain reds."
  },
  {
    "slug": "chia-seed",
    "display_name": "Chia Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Salvia hispanica",
    "usage_intensity": "accent",
    "summary": "Chia Seed is a canonical puddings and health bowls ingredient — edible seed use in puddings and health bowls cooking pairs with tropical fruit whites and light sparkling wine."
  },
  {
    "slug": "chia-seed-meal",
    "display_name": "Chia Seed Meal",
    "parent_group": "seed-products",
    "scientific_name": "Salvia hispanica",
    "usage_intensity": "accent",
    "summary": "Chia Seed Meal is a canonical puddings and modern baking ingredient — seed meal use in puddings and modern baking cooking pairs with tropical fruit whites and light sparkling wine."
  },
  {
    "slug": "cucumber-seed",
    "display_name": "Cucumber Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Cucumis sativus",
    "usage_intensity": "accent",
    "summary": "Cucumber Seed is a canonical Middle Eastern dried snacks ingredient — edible seed use in Middle Eastern dried snacks cooking pairs with Levantine mineral whites and summer Rosé."
  },
  {
    "slug": "desert-date-seed",
    "display_name": "Desert Date Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Balanites aegyptiaca",
    "usage_intensity": "accent",
    "summary": "Desert Date Seed is a canonical Sahelian oil bases ingredient — edible seed use in Sahelian oil bases cooking pairs with North African whites and spice reds."
  },
  {
    "slug": "egusi-seed",
    "display_name": "Egusi Seed",
    "parent_group": "seed-spices",
    "scientific_name": "Citrullus colocynthis",
    "usage_intensity": "primary",
    "summary": "Egusi Seed is a canonical West African egusi stews ingredient — seed spice use in West African egusi stews cooking pairs with off-dry whites and spice-friendly reds.",
    "aliases": [
      "Melon Seed (Egusi)"
    ]
  },
  {
    "slug": "flaxseed",
    "display_name": "Flaxseed",
    "parent_group": "edible-seeds",
    "scientific_name": "Linum usitatissimum",
    "usage_intensity": "accent",
    "summary": "Flaxseed is a canonical baking and egg substitutes ingredient — edible seed use in baking and egg substitutes cooking pairs with mineral whites and light Nordic reds.",
    "aliases": [
      "Ground Flaxseed",
      "Linseed"
    ]
  },
  {
    "slug": "flaxseed-butter",
    "display_name": "Flaxseed Butter",
    "parent_group": "seed-products",
    "scientific_name": "Linum usitatissimum",
    "usage_intensity": "accent",
    "summary": "Flaxseed Butter is a canonical health spreads ingredient — seed butter use in health spreads cooking pairs with mineral whites and clean vegetarian wines."
  },
  {
    "slug": "flaxseed-meal",
    "display_name": "Flaxseed Meal",
    "parent_group": "seed-products",
    "scientific_name": "Linum usitatissimum",
    "usage_intensity": "accent",
    "summary": "Flaxseed Meal is a canonical gluten-free binding ingredient — seed meal use in gluten-free binding cooking pairs with mineral whites and light vegetarian pairings."
  },
  {
    "slug": "ginkgo-nut",
    "display_name": "Ginkgo Nut",
    "parent_group": "tree-nuts",
    "scientific_name": "Ginkgo biloba",
    "usage_intensity": "accent",
    "summary": "Ginkgo Nut is a canonical East Asian seasonal snacks ingredient — tree nut use in East Asian seasonal snacks cooking pairs with Junmai sake and mineral whites."
  },
  {
    "slug": "hazelnut",
    "display_name": "Hazelnut",
    "parent_group": "tree-nuts",
    "scientific_name": "Corylus avellana",
    "usage_intensity": "accent",
    "summary": "Hazelnut is a canonical chocolate and praline ingredient — tree nut use in chocolate and praline cooking pairs with Pinot Noir, Barbaresco, and nutty oxidative whites.",
    "aliases": [
      "Filbert"
    ]
  },
  {
    "slug": "hazelnut-butter",
    "display_name": "Hazelnut Butter",
    "parent_group": "nut-products",
    "scientific_name": "Corylus avellana",
    "usage_intensity": "accent",
    "summary": "Hazelnut Butter is a canonical European spreads ingredient — nut butter use in European spreads cooking pairs with Pinot Noir and nutty dessert wines."
  },
  {
    "slug": "hazelnut-flour",
    "display_name": "Hazelnut Flour",
    "parent_group": "nut-products",
    "scientific_name": "Corylus avellana",
    "usage_intensity": "accent",
    "summary": "Hazelnut Flour is a canonical Dacquoise and European pastry ingredient — nut flour use in Dacquoise and European pastry cooking pairs with Pinot Noir and nutty oxidative whites."
  },
  {
    "slug": "hazelnut-meal",
    "display_name": "Hazelnut Meal",
    "parent_group": "nut-products",
    "scientific_name": "Corylus avellana",
    "usage_intensity": "accent",
    "summary": "Hazelnut Meal is a canonical European tortes ingredient — nut meal use in European tortes cooking pairs with Pinot Noir and oxidative dessert wines."
  },
  {
    "slug": "hemp-seed",
    "display_name": "Hemp Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Cannabis sativa",
    "usage_intensity": "accent",
    "summary": "Hemp Seed is a canonical salads and protein bowls ingredient — edible seed use in salads and protein bowls cooking pairs with herbaceous whites and Grüner Veltliner.",
    "aliases": [
      "Hulled Hemp Seed",
      "Hemp Hearts"
    ]
  },
  {
    "slug": "hemp-seed-butter",
    "display_name": "Hemp Seed Butter",
    "parent_group": "seed-products",
    "scientific_name": "Cannabis sativa",
    "usage_intensity": "accent",
    "summary": "Hemp Seed Butter is a canonical protein spreads ingredient — seed butter use in protein spreads cooking pairs with herbaceous whites and clean natural wines."
  },
  {
    "slug": "hemp-seed-flour",
    "display_name": "Hemp Seed Flour",
    "parent_group": "seed-products",
    "scientific_name": "Cannabis sativa",
    "usage_intensity": "accent",
    "summary": "Hemp Seed Flour is a canonical protein baking ingredient — seed flour use in protein baking cooking pairs with herbaceous whites and clean pairings."
  },
  {
    "slug": "hemp-seed-meal",
    "display_name": "Hemp Seed Meal",
    "parent_group": "edible-seeds",
    "scientific_name": "Cannabis sativa",
    "usage_intensity": "accent",
    "summary": "Hemp Seed Meal is a canonical protein-rich modern baking ingredient — edible seed meal use in protein-rich modern baking cooking pairs with herbaceous whites and clean vegetarian pairings."
  },
  {
    "slug": "hickory-nut",
    "display_name": "Hickory Nut",
    "parent_group": "tree-nuts",
    "scientific_name": "Carya ovata",
    "usage_intensity": "accent",
    "summary": "Hickory Nut is a canonical Southern baking ingredient — tree nut use in Southern baking cooking pairs with American bourbon-friendly reds and smoky whites."
  },
  {
    "slug": "jackfruit-seed",
    "display_name": "Jackfruit Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Artocarpus heterophyllus",
    "usage_intensity": "accent",
    "summary": "Jackfruit Seed is a canonical South Asian curries ingredient — edible seed use in South Asian curries cooking pairs with aromatic curry-friendly whites and spice reds."
  },
  {
    "slug": "kola-nut",
    "display_name": "Kola Nut",
    "parent_group": "tree-nuts",
    "scientific_name": "Cola acuminata",
    "usage_intensity": "accent",
    "summary": "Kola Nut is a canonical West African spice blends ingredient — tree nut use in West African spice blends cooking pairs with robust reds and oxidative amber wines."
  },
  {
    "slug": "leek-seed",
    "display_name": "Leek Seed",
    "parent_group": "seed-spices",
    "scientific_name": "Allium ampeloprasum",
    "usage_intensity": "accent",
    "summary": "Leek Seed is a canonical European pickling and seed spice blends ingredient — seed spice use in European pickling and seed spice blends cooking pairs with French whites and mineral coastal pairings."
  },
  {
    "slug": "lotus-seed",
    "display_name": "Lotus Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Nelumbo nucifera",
    "usage_intensity": "accent",
    "summary": "Lotus Seed is a canonical Chinese desserts and soups ingredient — edible seed use in Chinese desserts and soups cooking pairs with off-dry Chinese whites and floral aromatic whites."
  },
  {
    "slug": "macadamia",
    "display_name": "Macadamia",
    "parent_group": "tree-nuts",
    "scientific_name": "Macadamia integrifolia",
    "usage_intensity": "luxury",
    "summary": "Macadamia is a canonical cookies and crusted fish ingredient — tree nut use in cookies and crusted fish cooking pairs with Chardonnay, tropical whites, and buttery sparkling wine."
  },
  {
    "slug": "macadamia-butter",
    "display_name": "Macadamia Butter",
    "parent_group": "nut-products",
    "scientific_name": "Macadamia integrifolia",
    "usage_intensity": "luxury",
    "summary": "Macadamia Butter is a canonical tropical baking spreads ingredient — nut butter use in tropical baking spreads cooking pairs with buttery Chardonnay and tropical sparkling wine."
  },
  {
    "slug": "mahlab",
    "display_name": "Mahlab",
    "parent_group": "seed-spices",
    "scientific_name": "Prunus mahaleb",
    "usage_intensity": "accent",
    "summary": "Mahlab is a canonical Greek sweet bread ingredient — seed spice use in Greek sweet bread cooking pairs with Greek whites and oxidative dessert wines."
  },
  {
    "slug": "melon-seed",
    "display_name": "Melon Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Cucumis melo",
    "usage_intensity": "accent",
    "summary": "Melon Seed is a canonical Middle Eastern snack roasting ingredient — edible seed use in Middle Eastern snack roasting cooking pairs with mineral Mediterranean whites."
  },
  {
    "slug": "mongongo-nut",
    "display_name": "Mongongo Nut",
    "parent_group": "tree-nuts",
    "scientific_name": "Schinziophyton rautanenii",
    "usage_intensity": "accent",
    "summary": "Mongongo Nut is a canonical Southern African foraged cooking ingredient — tree nut use in Southern African foraged cooking cooking pairs with Chenin Blanc and smoky reds."
  },
  {
    "slug": "niger-seed",
    "display_name": "Niger Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Guizotia abyssinica",
    "usage_intensity": "accent",
    "summary": "Niger Seed is a canonical Ethiopian oilseed cooking ingredient — edible seed use in Ethiopian oilseed cooking cooking pairs with Ethiopian honey wine and aromatic whites.",
    "aliases": [
      "Nyjer Seed"
    ]
  },
  {
    "slug": "niger-seed-paste",
    "display_name": "Niger Seed Paste",
    "parent_group": "seed-products",
    "scientific_name": "Guizotia abyssinica",
    "usage_intensity": "accent",
    "summary": "Niger Seed Paste is a canonical Ethiopian seasoning bases ingredient — seed paste use in Ethiopian seasoning bases cooking pairs with Ethiopian honey wine and aromatic whites."
  },
  {
    "slug": "okra-seed",
    "display_name": "Okra Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Abelmoschus esculentus",
    "usage_intensity": "accent",
    "summary": "Okra Seed is a canonical Southern seed-meal thickening ingredient — edible seed use in Southern seed-meal thickening cooking pairs with Southern whites and smoky reds."
  },
  {
    "slug": "onion-seed",
    "display_name": "Onion Seed",
    "parent_group": "seed-spices",
    "scientific_name": "Allium cepa",
    "usage_intensity": "accent",
    "summary": "Onion Seed is a canonical Indian pickle blends ingredient — seed spice use in Indian pickle blends cooking pairs with aromatic whites and spice-friendly reds."
  },
  {
    "slug": "palm-kernel-seed",
    "display_name": "Palm Kernel Seed",
    "parent_group": "seed-spices",
    "scientific_name": "Elaeis guineensis",
    "usage_intensity": "accent",
    "summary": "Palm Kernel Seed is a canonical West African oil-rich seasoning bases ingredient — seed spice use in West African oil-rich seasoning bases cooking pairs with tropical amber wines and spice-friendly reds."
  },
  {
    "slug": "palmyra-seed",
    "display_name": "Palmyra Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Borassus flabellifer",
    "usage_intensity": "accent",
    "summary": "Palmyra Seed is a canonical South Asian palm sweets ingredient — edible seed use in South Asian palm sweets cooking pairs with tropical dessert wines and off-dry whites."
  },
  {
    "slug": "paradise-nut",
    "display_name": "Paradise Nut",
    "parent_group": "tree-nuts",
    "scientific_name": "Lecythis pisonis",
    "usage_intensity": "luxury",
    "summary": "Paradise Nut is a canonical Amazonian confection ingredient — tree nut use in Amazonian confection cooking pairs with Tawny Port and tropical dessert wines."
  },
  {
    "slug": "peanut",
    "display_name": "Peanut",
    "parent_group": "peanuts",
    "scientific_name": "Arachis hypogaea",
    "usage_intensity": "primary",
    "summary": "Peanut is a canonical satay and peanut sauce ingredient — culinary peanut use in satay and peanut sauce cooking pairs with off-dry Riesling, Beaujolais, and spice-friendly whites.",
    "aliases": [
      "Groundnut",
      "Raw Peanut",
      "Roasted Peanut",
      "Virginia Peanut"
    ]
  },
  {
    "slug": "peanut-butter",
    "display_name": "Peanut Butter",
    "parent_group": "nut-products",
    "scientific_name": "Arachis hypogaea",
    "usage_intensity": "primary",
    "summary": "Peanut Butter is a canonical sandwiches and satay ingredient — nut butter use in sandwiches and satay cooking pairs with Beaujolais, off-dry Riesling, and jammy Zinfandel."
  },
  {
    "slug": "pecan",
    "display_name": "Pecan",
    "parent_group": "tree-nuts",
    "scientific_name": "Carya illinoinensis",
    "usage_intensity": "accent",
    "summary": "Pecan is a canonical pies and pralines ingredient — tree nut use in pies and pralines cooking pairs with Bourbon, off-dry Riesling, and oaked Chardonnay.",
    "aliases": [
      "Pecan Halves"
    ]
  },
  {
    "slug": "pecan-butter",
    "display_name": "Pecan Butter",
    "parent_group": "nut-products",
    "scientific_name": "Carya illinoinensis",
    "usage_intensity": "accent",
    "summary": "Pecan Butter is a canonical Southern baking sauces ingredient — nut butter use in Southern baking sauces cooking pairs with Bourbon, off-dry Riesling, and jammy reds."
  },
  {
    "slug": "pecan-meal",
    "display_name": "Pecan Meal",
    "parent_group": "nut-products",
    "scientific_name": "Carya illinoinensis",
    "usage_intensity": "accent",
    "summary": "Pecan Meal is a canonical Southern pie crusts ingredient — nut meal use in Southern pie crusts cooking pairs with Bourbon-friendly reds and off-dry whites."
  },
  {
    "slug": "perilla-seed",
    "display_name": "Perilla Seed",
    "parent_group": "seed-spices",
    "scientific_name": "Perilla frutescens",
    "usage_intensity": "accent",
    "summary": "Perilla Seed is a canonical Korean banchan seasoning ingredient — seed spice use in Korean banchan seasoning cooking pairs with Junmai sake and mineral Japanese whites.",
    "aliases": [
      "Shiso Seed"
    ]
  },
  {
    "slug": "pili-nut",
    "display_name": "Pili Nut",
    "parent_group": "tree-nuts",
    "scientific_name": "Canarium ovatum",
    "usage_intensity": "luxury",
    "summary": "Pili Nut is a canonical Filipino sweets ingredient — tree nut use in Filipino sweets cooking pairs with tropical fruit whites and dessert Sherry."
  },
  {
    "slug": "pine-nut",
    "display_name": "Pine Nut",
    "parent_group": "tree-nuts",
    "scientific_name": "Pinus pinea",
    "usage_intensity": "luxury",
    "summary": "Pine Nut is a canonical pesto and salads ingredient — tree nut use in pesto and salads cooking pairs with Vermentino, Ligurian whites, and herb-driven reds.",
    "aliases": [
      "Pignoli",
      "Pinon Nut"
    ]
  },
  {
    "slug": "pine-nut-paste",
    "display_name": "Pine Nut Paste",
    "parent_group": "nut-products",
    "scientific_name": "Pinus pinea",
    "usage_intensity": "luxury",
    "summary": "Pine Nut Paste is a canonical pesto bases and Ligurian confection ingredient — nut paste use in pesto bases and Ligurian confection cooking pairs with Vermentino and herb-driven Mediterranean whites."
  },
  {
    "slug": "pistachio",
    "display_name": "Pistachio",
    "parent_group": "tree-nuts",
    "scientific_name": "Pistacia vera",
    "usage_intensity": "accent",
    "summary": "Pistachio is a canonical Middle Eastern sweets ingredient — tree nut use in Middle Eastern sweets cooking pairs with Rosé, Lebanese whites, and Gewürztraminer.",
    "aliases": [
      "Crushed Pistachios",
      "Shelled Pistachio"
    ]
  },
  {
    "slug": "pistachio-paste",
    "display_name": "Pistachio Paste",
    "parent_group": "nut-products",
    "scientific_name": "Pistacia vera",
    "usage_intensity": "luxury",
    "summary": "Pistachio Paste is a canonical Sicilian pastry and gelato ingredient — nut paste use in Sicilian pastry and gelato cooking pairs with Marsala, dessert wines, and oxidative whites."
  },
  {
    "slug": "pomegranate-seed",
    "display_name": "Pomegranate Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Punica granatum",
    "usage_intensity": "accent",
    "summary": "Pomegranate Seed is a canonical Persian garnish ingredient — edible seed use in Persian garnish cooking pairs with Persian reds and bright Rosé.",
    "aliases": [
      "Pomegranate Arils"
    ]
  },
  {
    "slug": "poppy-seed",
    "display_name": "Poppy Seed",
    "parent_group": "seed-spices",
    "scientific_name": "Papaver somniferum",
    "usage_intensity": "accent",
    "summary": "Poppy Seed is a canonical Central European baking ingredient — seed spice use in Central European baking cooking pairs with off-dry Riesling and Austrian dessert wines."
  },
  {
    "slug": "psyllium-seed",
    "display_name": "Psyllium Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Plantago ovata",
    "usage_intensity": "accent",
    "summary": "Psyllium Seed is a canonical gluten-free binding ingredient — edible seed use in gluten-free binding cooking pairs with neutral vegetarian whites.",
    "aliases": [
      "Isabgol"
    ]
  },
  {
    "slug": "pumpkin-seed",
    "display_name": "Pumpkin Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Cucurbita pepo",
    "usage_intensity": "accent",
    "summary": "Pumpkin Seed is a canonical pepitas and mole ingredient — edible seed use in pepitas and mole cooking pairs with Mexican whites and smoky mezcal-friendly reds.",
    "aliases": [
      "Pepita"
    ]
  },
  {
    "slug": "pumpkin-seed-butter",
    "display_name": "Pumpkin Seed Butter",
    "parent_group": "seed-products",
    "scientific_name": "Cucurbita pepo",
    "usage_intensity": "accent",
    "summary": "Pumpkin Seed Butter is a canonical autumn spreads ingredient — seed butter use in autumn spreads cooking pairs with earthy Pinot Noir and orchard whites."
  },
  {
    "slug": "pumpkin-seed-flour",
    "display_name": "Pumpkin Seed Flour",
    "parent_group": "seed-products",
    "scientific_name": "Cucurbita pepo",
    "usage_intensity": "accent",
    "summary": "Pumpkin Seed Flour is a canonical gluten-free autumn bread ingredient — seed flour use in gluten-free autumn bread cooking pairs with earthy whites and light Pinot Noir."
  },
  {
    "slug": "pumpkin-seed-meal",
    "display_name": "Pumpkin Seed Meal",
    "parent_group": "seed-products",
    "scientific_name": "Cucurbita pepo",
    "usage_intensity": "accent",
    "summary": "Pumpkin Seed Meal is a canonical Mexican moles ingredient — seed meal use in Mexican moles cooking pairs with Mexican whites and smoky mezcal-friendly reds."
  },
  {
    "slug": "radish-seed",
    "display_name": "Radish Seed",
    "parent_group": "seed-spices",
    "scientific_name": "Raphanus sativus",
    "usage_intensity": "accent",
    "summary": "Radish Seed is a canonical East Asian sprouting condiments ingredient — seed spice use in East Asian sprouting condiments cooking pairs with Junmai sake and mineral Asian whites."
  },
  {
    "slug": "saba-nut",
    "display_name": "Saba Nut",
    "parent_group": "tree-nuts",
    "scientific_name": "Pachira aquatica",
    "usage_intensity": "accent",
    "summary": "Saba Nut is a canonical Central American stews ingredient — tree nut use in Central American stews cooking pairs with Central American whites and tropical Rosé."
  },
  {
    "slug": "sacha-inchi-butter",
    "display_name": "Sacha Inchi Butter",
    "parent_group": "seed-products",
    "scientific_name": "Plukenetia volubilis",
    "usage_intensity": "accent",
    "summary": "Sacha Inchi Butter is a canonical Andean superfood spreads ingredient — seed butter use in Andean superfood spreads cooking pairs with Peruvian whites and tropical fruit pairings."
  },
  {
    "slug": "sacha-inchi-seed",
    "display_name": "Sacha Inchi Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Plukenetia volubilis",
    "usage_intensity": "accent",
    "summary": "Sacha Inchi Seed is a canonical Andean superfood snacking ingredient — edible seed use in Andean superfood snacking cooking pairs with Peruvian whites and tropical fruit wines.",
    "aliases": [
      "Inca Peanut"
    ]
  },
  {
    "slug": "safflower-meal",
    "display_name": "Safflower Meal",
    "parent_group": "edible-seeds",
    "scientific_name": "Carthamus tinctorius",
    "usage_intensity": "accent",
    "summary": "Safflower Meal is a canonical oilseed meal in health baking ingredient — edible seed meal use in oilseed meal in health baking cooking pairs with neutral whites and clean mineral pairings."
  },
  {
    "slug": "safflower-seed",
    "display_name": "Safflower Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Carthamus tinctorius",
    "usage_intensity": "accent",
    "summary": "Safflower Seed is a canonical salad oilseed use ingredient — edible seed use in salad oilseed use cooking pairs with neutral whites and clean mineral wines."
  },
  {
    "slug": "sesame",
    "display_name": "Sesame",
    "parent_group": "edible-seeds",
    "scientific_name": "Sesamum indicum",
    "usage_intensity": "accent",
    "summary": "Sesame is a canonical tahini and Middle Eastern baking ingredient — edible seed use in tahini and Middle Eastern baking cooking pairs with Lebanese whites and nutty amber wines.",
    "aliases": [
      "Toasted Sesame Seeds",
      "White Sesame",
      "Black Sesame",
      "Benne Seed"
    ]
  },
  {
    "slug": "sesame-flour",
    "display_name": "Sesame Flour",
    "parent_group": "seed-products",
    "scientific_name": "Sesamum indicum",
    "usage_intensity": "accent",
    "summary": "Sesame Flour is a canonical Middle Eastern flatbreads ingredient — seed flour use in Middle Eastern flatbreads cooking pairs with Levantine whites and oxidative pairings."
  },
  {
    "slug": "sesame-paste",
    "display_name": "Sesame Paste",
    "parent_group": "seed-products",
    "scientific_name": "Sesamum indicum",
    "usage_intensity": "primary",
    "summary": "Sesame Paste is a canonical Chinese cold noodles ingredient — seed paste use in Chinese cold noodles cooking pairs with aromatic whites and nutty oxidative wines.",
    "aliases": [
      "Raw Tahini"
    ]
  },
  {
    "slug": "squash-seed",
    "display_name": "Squash Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Cucurbita maxima",
    "usage_intensity": "accent",
    "summary": "Squash Seed is a canonical autumn baking garnish ingredient — edible seed use in autumn baking garnish cooking pairs with autumn whites and earthy Pinot Noir."
  },
  {
    "slug": "sunflower-seed",
    "display_name": "Sunflower Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Helianthus annuus",
    "usage_intensity": "accent",
    "summary": "Sunflower Seed is a canonical salads and bread topping ingredient — edible seed use in salads and bread topping cooking pairs with crisp whites, light Rosé, and Sauvignon Blanc.",
    "aliases": [
      "Shelled Sunflower Seed"
    ]
  },
  {
    "slug": "sunflower-seed-butter",
    "display_name": "Sunflower Seed Butter",
    "parent_group": "seed-products",
    "scientific_name": "Helianthus annuus",
    "usage_intensity": "primary",
    "summary": "Sunflower Seed Butter is a canonical nut-free sandwich spreads ingredient — seed butter use in nut-free sandwich spreads cooking pairs with crisp whites and light Rosé."
  },
  {
    "slug": "sunflower-seed-flour",
    "display_name": "Sunflower Seed Flour",
    "parent_group": "seed-products",
    "scientific_name": "Helianthus annuus",
    "usage_intensity": "accent",
    "summary": "Sunflower Seed Flour is a canonical gluten-free seed bread ingredient — seed flour use in gluten-free seed bread cooking pairs with crisp mineral whites and light Rosé."
  },
  {
    "slug": "sunflower-seed-paste",
    "display_name": "Sunflower Seed Paste",
    "parent_group": "seed-products",
    "scientific_name": "Helianthus annuus",
    "usage_intensity": "accent",
    "summary": "Sunflower Seed Paste is a canonical Eastern European seed dips ingredient — seed paste use in Eastern European seed dips cooking pairs with crisp whites and rustic Central European reds."
  },
  {
    "slug": "tahini",
    "display_name": "Tahini",
    "parent_group": "seed-products",
    "scientific_name": "Sesamum indicum",
    "usage_intensity": "primary",
    "summary": "Tahini is a canonical hummus and halva ingredient — seed paste use in hummus and halva cooking pairs with Lebanese whites, oxidative whites, and nutty amber wines."
  },
  {
    "slug": "walnut",
    "display_name": "Walnut",
    "parent_group": "tree-nuts",
    "scientific_name": "Juglans regia",
    "usage_intensity": "primary",
    "summary": "Walnut is a canonical salads and baking ingredient — tree nut use in salads and baking cooking pairs with structured reds, Sauternes, and oxidative whites.",
    "aliases": [
      "English Walnut",
      "Walnut Halves",
      "Crushed Walnuts"
    ]
  },
  {
    "slug": "walnut-butter",
    "display_name": "Walnut Butter",
    "parent_group": "nut-products",
    "scientific_name": "Juglans regia",
    "usage_intensity": "accent",
    "summary": "Walnut Butter is a canonical toast spreads and health bowls ingredient — nut butter use in toast spreads and health bowls cooking pairs with structured reds and oxidative whites."
  },
  {
    "slug": "walnut-meal",
    "display_name": "Walnut Meal",
    "parent_group": "nut-products",
    "scientific_name": "Juglans regia",
    "usage_intensity": "accent",
    "summary": "Walnut Meal is a canonical tortes and rustic bread ingredient — nut meal use in tortes and rustic bread cooking pairs with Sauternes, structured reds, and oxidative whites."
  },
  {
    "slug": "watermelon-seed",
    "display_name": "Watermelon Seed",
    "parent_group": "edible-seeds",
    "scientific_name": "Citrullus lanatus",
    "usage_intensity": "accent",
    "summary": "Watermelon Seed is a canonical Middle Eastern roasting ingredient — edible seed use in Middle Eastern roasting cooking pairs with Levantine whites and mineral Rosé."
  },
  {
    "slug": "wattleseed",
    "display_name": "Wattleseed",
    "parent_group": "seed-spices",
    "scientific_name": "Acacia victoriae",
    "usage_intensity": "accent",
    "summary": "Wattleseed is a canonical Australian bush desserts ingredient — seed spice use in Australian bush desserts cooking pairs with Australian Shiraz and fortified dessert wines."
  }
];
