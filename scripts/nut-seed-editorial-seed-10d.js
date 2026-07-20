/**
 * FOOD-10D — Curated editorial relationship seed data.
 * Tier A: similar_to, substitutes_for
 * Tier B: commonly_served_with (intra-domain)
 * Tier C: commonly_served_with (cross-domain forward references)
 *
 * NUT-002 Editorial Rule: whole and processed nut/seed canonical identities must not
 * be treated as editorially interchangeable in Tier A.
 *
 * @typedef {object} EditorialSeed
 * @property {string} relationship
 * @property {string} source
 * @property {string} target
 * @property {"high"} confidence
 * @property {"A"|"B"|"C"} editorial_tier
 * @property {"approved"|"pending"} editorial_review
 * @property {string} evidence
 */

/** Forward references to published domains — canonical IDs only. */
export const FORWARD_REFERENCE_IDS = new Set([
  "food.cheese.bloomy-rind.brie-de-meaux",
  "food.cheese.blue.gorgonzola",
  "food.cheese.brined.feta",
  "food.cheese.fresh.goat-chevre-log",
  "food.cheese.hard.cheddar",
  "food.cheese.hard.parmigiano-reggiano",
  "food.fruit.berries.strawberry",
  "food.fruit.citrus.lemon",
  "food.fruit.citrus.orange",
  "food.fruit.pomes.apple",
  "food.fruit.processed-fruits.raisin",
  "food.fruit.tropical-fruits.coconut",
  "food.fungi.cultivated-mushrooms.shiitake",
  "food.fungi.wild-mushrooms.chanterelle",
  "food.fungi.wild-mushrooms.porcini",
  "food.grain.processed-grains.cornmeal",
  "food.grain.processed-grains.wheat-flour",
  "food.grain.whole-grains.oats",
  "food.grain.whole-grains.rice",
  "food.herb.dried-herbs.rosemary",
  "food.herb.fresh-herbs.basil",
  "food.herb.fresh-herbs.mint",
  "food.herb.whole-spices.black-pepper",
  "food.herb.whole-spices.cinnamon",
  "food.herb.whole-spices.vanilla-bean",
  "food.protein.beef.brisket",
  "food.protein.beef.ribeye",
  "food.protein.charcuterie.prosciutto",
  "food.protein.crustaceans.shrimp",
  "food.protein.fin-fish.salmon-fillet",
  "food.protein.lamb.lamb-leg",
  "food.protein.pork.pork-loin",
  "food.protein.poultry.chicken-breast",
  "food.protein.poultry.chicken-thigh",
  "food.vegetable.alliums.garlic",
  "food.vegetable.alliums.onion",
  "food.vegetable.alliums.shallot",
  "food.vegetable.green-vegetables.asparagus",
  "food.vegetable.green-vegetables.spinach",
  "food.vegetable.nightshades.eggplant",
  "food.vegetable.nightshades.tomato",
  "food.vegetable.root-vegetables.carrot"
]);

/** @type {EditorialSeed[]} */
export const EDITORIAL_CURATED = [
  {
    "relationship": "similar_to",
    "source": "almond-flour",
    "target": "hazelnut-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Almond flour and hazelnut flour share gluten-free baking and macaron roles — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "pumpkin-seed",
    "target": "sunflower-seed",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Pumpkin seed and sunflower seed share salad garnish and seed-bread topping roles — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "cashew",
    "target": "macadamia",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cashew and macadamia share creamy tree-nut richness in tropical and pastry contexts — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "tahini",
    "target": "sunflower-seed-butter",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Tahini and sunflower seed butter share seed-butter spread and sauce functions — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "walnut",
    "target": "pecan",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Walnut and pecan share toasted nut character in baking and autumn salads — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "almond",
    "target": "hazelnut",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Almond and hazelnut share praline, crust, and European pastry nut roles — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "pistachio",
    "target": "pine-nut",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Pistachio and pine nut share premium green-nut garnish in Mediterranean sweets — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "chia-seed",
    "target": "flaxseed",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Chia seed and flaxseed share gel-forming seed roles in puddings and egg-free baking — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "hemp-seed",
    "target": "sunflower-seed",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Hemp seed and sunflower seed share salad and bowl topping seed character — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "chestnut-flour",
    "target": "almond-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Chestnut flour and almond flour share alternative-flour baking in European desserts — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "cashew-flour",
    "target": "almond-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cashew flour and almond flour share neutral gluten-free flour roles in modern baking — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "pecan-meal",
    "target": "walnut-meal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Pecan meal and walnut meal share nut-meal crust and torte base applications — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "sesame-flour",
    "target": "sunflower-seed-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Sesame flour and sunflower seed flour share seed-flour flatbread and coating roles — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "peanut-butter",
    "target": "almond-butter",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Peanut butter and almond butter share nut-butter sandwich and sauce functions — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "similar_to",
    "source": "brazil-nut",
    "target": "pecan",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Brazil nut and pecan share large-format baking nut and snack roles — distinct processed forms preserved under NUT-002."
  },
  {
    "relationship": "substitutes_for",
    "source": "almond-flour",
    "target": "hazelnut-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Almond flour substitutes for hazelnut flour in macarons and gluten-free cakes without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "hazelnut-flour",
    "target": "almond-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Hazelnut flour substitutes for almond flour in dacquoise and nut tortes without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "almond-flour",
    "target": "cashew-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Almond flour substitutes for cashew flour in neutral gluten-free baking without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "cashew-flour",
    "target": "almond-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cashew flour substitutes for almond flour in fine nut-flour bakes without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "chestnut-flour",
    "target": "almond-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Chestnut flour substitutes for almond flour in European autumn desserts without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "walnut-meal",
    "target": "pecan-meal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Walnut meal substitutes for pecan meal in nut-crusted fish and pie bases without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "pecan-meal",
    "target": "walnut-meal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Pecan meal substitutes for walnut meal in Southern nut-meal baking without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "pumpkin-seed",
    "target": "sunflower-seed",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Pumpkin seed substitutes for sunflower seed in salad and bread toppings without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "sunflower-seed",
    "target": "pumpkin-seed",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Sunflower seed substitutes for pumpkin seed in toasted seed garnish without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "chia-seed",
    "target": "flaxseed",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Chia seed substitutes for flaxseed in puddings and egg substitutes without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "flaxseed",
    "target": "chia-seed",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Flaxseed substitutes for chia seed in gel-binding in vegan baking without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "tahini",
    "target": "sunflower-seed-butter",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Tahini substitutes for sunflower seed butter in seed-butter sauces and spreads without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "sunflower-seed-butter",
    "target": "tahini",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Sunflower seed butter substitutes for tahini in Middle Eastern-style seed pastes without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "cashew",
    "target": "macadamia",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cashew substitutes for macadamia in creamy nut finishing in curries and cookies without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "macadamia",
    "target": "cashew",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Macadamia substitutes for cashew in buttery tree-nut texture in tropical dishes without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "almond-butter",
    "target": "cashew-butter",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Almond butter substitutes for cashew butter in vegan sauces and spreads without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "cashew-butter",
    "target": "almond-butter",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cashew butter substitutes for almond butter in nut-butter baking and toast without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "pecan-butter",
    "target": "walnut-butter",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Pecan butter substitutes for walnut butter in autumn nut-butter applications without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "walnut-butter",
    "target": "pecan-butter",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Walnut butter substitutes for pecan butter in toast and health-bowl spreads without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "sesame-flour",
    "target": "sunflower-seed-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Sesame flour substitutes for sunflower seed flour in seed-flour flatbreads without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "sunflower-seed-flour",
    "target": "sesame-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Sunflower seed flour substitutes for sesame flour in gluten-free seed bread without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "pumpkin-seed-meal",
    "target": "sunflower-seed-paste",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Pumpkin seed meal substitutes for sunflower seed paste in seed-meal dips and coatings without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "hemp-seed-flour",
    "target": "sunflower-seed-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Hemp seed flour substitutes for sunflower seed flour in protein seed baking without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "flaxseed-meal",
    "target": "chia-seed-meal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Flaxseed meal substitutes for chia seed meal in binding in gluten-free bakes without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "pine-nut-paste",
    "target": "pistachio-paste",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Pine nut paste substitutes for pistachio paste in premium nut-paste confection without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "pistachio-paste",
    "target": "pine-nut-paste",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Pistachio paste substitutes for pine nut paste in Mediterranean pastry fillings without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "hazelnut-meal",
    "target": "almond-meal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Hazelnut meal substitutes for almond meal in European torte bases without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "almond-meal",
    "target": "hazelnut-meal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Almond meal substitutes for hazelnut meal in crumbed fish and tart shells without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "brazil-nut-meal",
    "target": "walnut-meal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Brazil nut meal substitutes for walnut meal in gluten-free nut baking without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "substitutes_for",
    "source": "pumpkin-seed-flour",
    "target": "hemp-seed-flour",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Pumpkin seed flour substitutes for hemp seed flour in autumn seed-flour bread without collapsing NUT-002 canonical identity."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond",
    "target": "walnut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "almond is commonly served with walnut in classic nut-crusted salads and baklava-style pastries — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pistachio",
    "target": "hazelnut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "pistachio is commonly served with hazelnut in Middle Eastern and Italian nut sweets — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chia-seed",
    "target": "flaxseed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "chia-seed is commonly served with flaxseed in health bowls and modern seed puddings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peanut-butter",
    "target": "tahini",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "peanut-butter is commonly served with tahini in sauce bases for satay and Middle Eastern dressings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sesame",
    "target": "pumpkin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "sesame is commonly served with pumpkin-seed in seed garnish on breads and grain bowls — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond",
    "target": "pistachio",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "almond is commonly served with pistachio in Mediterranean nut mixes and pastry fillings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "walnut",
    "target": "hazelnut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "walnut is commonly served with hazelnut in European tortes and forest-style nut combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pecan",
    "target": "walnut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "pecan is commonly served with walnut in American pie and autumn baking combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cashew",
    "target": "almond",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "cashew is commonly served with almond in curry richness and nut-cream sauces — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "macadamia",
    "target": "cashew",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "macadamia is commonly served with cashew in tropical cookies and nut-crusted seafood — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pine-nut",
    "target": "pistachio",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "pine-nut is commonly served with pistachio in pesto-adjacent and Sicilian nut garnish — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "brazil-nut",
    "target": "walnut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "brazil-nut is commonly served with walnut in mixed nut roasts and holiday baking — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chestnut",
    "target": "walnut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "chestnut is commonly served with walnut in stuffing and autumn roast accompaniments — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sunflower-seed",
    "target": "pumpkin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "sunflower-seed is commonly served with pumpkin-seed in multiseed bread and salad crunch — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "flaxseed",
    "target": "hemp-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "flaxseed is commonly served with hemp-seed in modern seed topping on yogurt and bowls — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sesame",
    "target": "sunflower-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "sesame is commonly served with sunflower-seed in toasted seed mixes on flatbreads — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chia-seed",
    "target": "hemp-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "chia-seed is commonly served with hemp-seed in superfood bowl and pudding combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "poppy-seed",
    "target": "sesame",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "poppy-seed is commonly served with sesame in Central European and Middle Eastern seed baking — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pumpkin-seed",
    "target": "sesame",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "pumpkin-seed is commonly served with sesame in mole-adjacent and seed-crusted vegetables — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lotus-seed",
    "target": "pine-nut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "lotus-seed is commonly served with pine-nut in East Asian sweets and delicate nut garnish — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peanut",
    "target": "sesame",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "peanut is commonly served with sesame in Asian noodle and stir-fry seed-nut combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond-flour",
    "target": "chestnut-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "almond-flour is commonly served with chestnut-flour in European gluten-free dessert baking — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hazelnut-flour",
    "target": "almond-meal",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "hazelnut-flour is commonly served with almond-meal in dacquoise and frangipane-style bases — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peanut-butter",
    "target": "almond-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "peanut-butter is commonly served with almond-butter in nut-butter sauces and modern sandwich spreads — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tahini",
    "target": "sesame-paste",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "tahini is commonly served with sesame-paste in hummus and cold-noodle sauce bases — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sunflower-seed-butter",
    "target": "pumpkin-seed-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "sunflower-seed-butter is commonly served with pumpkin-seed-butter in seed-butter toast and allergy-friendly spreads — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "walnut-meal",
    "target": "pecan-meal",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "walnut-meal is commonly served with pecan-meal in nut-meal pie crusts and crumb toppings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pistachio-paste",
    "target": "hazelnut-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "pistachio-paste is commonly served with hazelnut-butter in premium pastry and gelato nut bases — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cashew-butter",
    "target": "tahini",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "cashew-butter is commonly served with tahini in plant-based creamy sauce combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "flaxseed-meal",
    "target": "chia-seed-meal",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "flaxseed-meal is commonly served with chia-seed-meal in vegan binding in muffins and pancakes — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hemp-seed-butter",
    "target": "sunflower-seed-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "hemp-seed-butter is commonly served with sunflower-seed-butter in protein-rich seed spread boards — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pomegranate-seed",
    "target": "pistachio",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "pomegranate-seed is commonly served with pistachio in Persian garnish and nut-seed salad contrast — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "melon-seed",
    "target": "sesame",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "melon-seed is commonly served with sesame in Middle Eastern seed snack roasting — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "niger-seed",
    "target": "sesame",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "niger-seed is commonly served with sesame in Ethiopian and seed-oil seasoning contexts — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "egusi-seed",
    "target": "pumpkin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "egusi-seed is commonly served with pumpkin-seed in West African and Latin seed-stew thickeners — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "perilla-seed",
    "target": "sesame",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "perilla-seed is commonly served with sesame in Korean banchan and East Asian seed seasoning — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mahlab",
    "target": "poppy-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "mahlab is commonly served with poppy-seed in Eastern Mediterranean sweet bread seed blends — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wattleseed",
    "target": "macadamia",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "wattleseed is commonly served with macadamia in Australian bush-food nut and seed dessert pairings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "bitter-almond",
    "target": "almond",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "bitter-almond is commonly served with almond in European almond extract and marzipan lineage — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hickory-nut",
    "target": "pecan",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "hickory-nut is commonly served with pecan in Southern nut baking and praline traditions — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "beechnut",
    "target": "hazelnut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "beechnut is commonly served with hazelnut in Central European forest nut pastry combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ginkgo-nut",
    "target": "pine-nut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "ginkgo-nut is commonly served with pine-nut in East Asian seasonal nut garnish contexts — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "candlenut",
    "target": "macadamia",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "candlenut is commonly served with macadamia in Southeast Asian curry paste richness — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "baru-nut",
    "target": "brazil-nut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "baru-nut is commonly served with brazil-nut in South American roasted nut snack pairings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mongongo-nut",
    "target": "macadamia",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "mongongo-nut is commonly served with macadamia in Southern African foraged nut combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "saba-nut",
    "target": "cashew",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "saba-nut is commonly served with cashew in Central American stew nut richness — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "paradise-nut",
    "target": "brazil-nut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "paradise-nut is commonly served with brazil-nut in Amazonian confection nut pairings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pili-nut",
    "target": "macadamia",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "pili-nut is commonly served with macadamia in Filipino nut sweets and tropical baking — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kola-nut",
    "target": "hazelnut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "kola-nut is commonly served with hazelnut in West African spice-nut and praline adjacency — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "okra-seed",
    "target": "flaxseed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "okra-seed is commonly served with flaxseed in Southern seed-meal thickening combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "breadnut-seed",
    "target": "chestnut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "breadnut-seed is commonly served with chestnut in Mesoamerican roast nut traditions — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "breadfruit-seed",
    "target": "chestnut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "breadfruit-seed is commonly served with chestnut in Pacific Island roast seed-nut service — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "desert-date-seed",
    "target": "sesame",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "desert-date-seed is commonly served with sesame in Sahelian seed-oil and flatbread contexts — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cucumber-seed",
    "target": "melon-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "cucumber-seed is commonly served with melon-seed in Middle Eastern dried seed snack pairings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "palmyra-seed",
    "target": "sesame",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "palmyra-seed is commonly served with sesame in South Asian palm and sesame sweet seed contexts — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sacha-inchi-seed",
    "target": "hemp-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "sacha-inchi-seed is commonly served with hemp-seed in Andean superfood seed bowl combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sacha-inchi-butter",
    "target": "hemp-seed-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "sacha-inchi-butter is commonly served with hemp-seed-butter in modern protein seed spread pairings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "safflower-seed",
    "target": "sunflower-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "safflower-seed is commonly served with sunflower-seed in neutral oilseed salad topping combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "safflower-meal",
    "target": "sunflower-seed-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "safflower-meal is commonly served with sunflower-seed-flour in health baking seed-meal combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "squash-seed",
    "target": "pumpkin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "squash-seed is commonly served with pumpkin-seed in autumn cucurbit seed roasting pairings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "psyllium-seed",
    "target": "flaxseed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "psyllium-seed is commonly served with flaxseed in gluten-free binding seed combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "jackfruit-seed",
    "target": "chestnut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "jackfruit-seed is commonly served with chestnut in South Asian curry seed-nut roasting — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "watermelon-seed",
    "target": "melon-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "watermelon-seed is commonly served with melon-seed in Levantine roasted seed snack combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hemp-seed-meal",
    "target": "flaxseed-meal",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "hemp-seed-meal is commonly served with flaxseed-meal in protein seed-meal baking combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "niger-seed-paste",
    "target": "tahini",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "niger-seed-paste is commonly served with tahini in Ethiopian seed-paste seasoning contexts — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pumpkin-seed-meal",
    "target": "sesame-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "pumpkin-seed-meal is commonly served with sesame-flour in Mexican mole and seed-coating combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "radish-seed",
    "target": "onion-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "radish-seed is commonly served with onion-seed in pickling and sprouting seed spice blends — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "leek-seed",
    "target": "onion-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "leek-seed is commonly served with onion-seed in European pickling seed combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "palm-kernel-seed",
    "target": "sesame",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "palm-kernel-seed is commonly served with sesame in West African seed-oil seasoning pairings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond-butter",
    "target": "hazelnut-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "almond-butter is commonly served with hazelnut-butter in European nut-butter spread boards — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pecan-butter",
    "target": "walnut-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "pecan-butter is commonly served with walnut-butter in autumn nut-butter toast combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "macadamia-butter",
    "target": "cashew-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "macadamia-butter is commonly served with cashew-butter in tropical nut-butter baking — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "flaxseed-butter",
    "target": "sunflower-seed-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "flaxseed-butter is commonly served with sunflower-seed-butter in health-focused seed butter pairings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pumpkin-seed-flour",
    "target": "sunflower-seed-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "pumpkin-seed-flour is commonly served with sunflower-seed-flour in autumn gluten-free seed bread baking — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hemp-seed-flour",
    "target": "chia-seed-meal",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "hemp-seed-flour is commonly served with chia-seed-meal in modern protein baking combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sesame-paste",
    "target": "sunflower-seed-paste",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "sesame-paste is commonly served with sunflower-seed-paste in seed-paste dip and noodle sauce bases — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pine-nut-paste",
    "target": "walnut-meal",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "pine-nut-paste is commonly served with walnut-meal in pesto-style and rustic nut-paste combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hazelnut-meal",
    "target": "pecan-meal",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "hazelnut-meal is commonly served with pecan-meal in nut-meal tart and cookie bases — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "brazil-nut-meal",
    "target": "pecan-meal",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "brazil-nut-meal is commonly served with pecan-meal in gluten-free nut-meal holiday baking — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond",
    "target": "pecan",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "almond is commonly served with pecan in autumn salad and tart nut combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "walnut",
    "target": "pistachio",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "walnut is commonly served with pistachio in salad and pastry nut contrast combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hazelnut",
    "target": "pecan",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "hazelnut is commonly served with pecan in praline and holiday nut mix combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cashew",
    "target": "peanut",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "cashew is commonly served with peanut in Asian stir-fry and satay nut combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peanut",
    "target": "sesame",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "peanut is commonly served with sesame in Southeast Asian noodle and sauce combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sunflower-seed",
    "target": "flaxseed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "sunflower-seed is commonly served with flaxseed in multiseed bread and health baking — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pumpkin-seed",
    "target": "chia-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "pumpkin-seed is commonly served with chia-seed in modern bowl and seed-cluster toppings — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hemp-seed",
    "target": "chia-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "hemp-seed is commonly served with chia-seed in superfood seed topping combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "poppy-seed",
    "target": "flaxseed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "poppy-seed is commonly served with flaxseed in Central European seed bread combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sesame",
    "target": "flaxseed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "sesame is commonly served with flaxseed in seed bread and cracker topping combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tahini",
    "target": "pumpkin-seed-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "tahini is commonly served with pumpkin-seed-butter in seed-butter sauce and spread combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond-flour",
    "target": "walnut-meal",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "almond-flour is commonly served with walnut-meal in fine nut-flour and meal baking combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chestnut-flour",
    "target": "hazelnut-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "chestnut-flour is commonly served with hazelnut-flour in European mountain dessert flour combinations — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peanut-butter",
    "target": "sunflower-seed-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "peanut-butter is commonly served with sunflower-seed-butter in allergy-conscious nut and seed butter boards — ingredient compatibility, not a finished dish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond",
    "target": "food.fruit.pomes.apple",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "almond commonly pairs with food.fruit.pomes.apple in European tart and orchard fruit pastry pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "almond commonly pairs with food.grain.processed-grains.wheat-flour in frangipane and almond paste baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "walnut",
    "target": "food.fruit.processed-fruits.raisin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "walnut commonly pairs with food.fruit.processed-fruits.raisin in classic Waldorf-style fruit-nut combinations — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "walnut",
    "target": "food.cheese.blue.gorgonzola",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "walnut commonly pairs with food.cheese.blue.gorgonzola in blue cheese and walnut salad pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pecan",
    "target": "food.fruit.pomes.apple",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pecan commonly pairs with food.fruit.pomes.apple in American pie and autumn dessert pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pecan",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pecan commonly pairs with food.grain.whole-grains.oats in granola and praline breakfast contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hazelnut",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hazelnut commonly pairs with food.fruit.tropical-fruits.coconut in chocolate-adjacent tropical nut pairings — coconut in Fruit domain — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hazelnut",
    "target": "food.herb.whole-spices.vanilla-bean",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hazelnut commonly pairs with food.herb.whole-spices.vanilla-bean in European praline and dessert spice pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pistachio",
    "target": "food.fruit.citrus.orange",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pistachio commonly pairs with food.fruit.citrus.orange in Middle Eastern nut and citrus pastry pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pistachio",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pistachio commonly pairs with food.herb.whole-spices.cinnamon in spiced nut dessert and baklava contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cashew",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "cashew commonly pairs with food.vegetable.nightshades.tomato in Indian curry and korma sauce contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cashew",
    "target": "food.protein.poultry.chicken-thigh",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "cashew commonly pairs with food.protein.poultry.chicken-thigh in cashew-cream curry poultry pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "macadamia",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "macadamia commonly pairs with food.fruit.tropical-fruits.coconut in tropical cookie and crust pairings — coconut in Fruit domain — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "macadamia",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "macadamia commonly pairs with food.protein.fin-fish.salmon-fillet in nut-crusted fish finishing contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pine-nut",
    "target": "food.vegetable.green-vegetables.asparagus",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pine-nut commonly pairs with food.vegetable.green-vegetables.asparagus in pesto-adjacent spring vegetable pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pine-nut",
    "target": "food.herb.fresh-herbs.basil",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pine-nut commonly pairs with food.herb.fresh-herbs.basil in classic Ligurian pesto herb-nut contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "brazil-nut",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "brazil-nut commonly pairs with food.fruit.berries.strawberry in tropical fruit and nut snack pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "brazil-nut",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "brazil-nut commonly pairs with food.protein.beef.ribeye in South American churrasco nut side contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chestnut",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "chestnut commonly pairs with food.protein.pork.pork-loin in European roast chestnut and pork pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chestnut",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "chestnut commonly pairs with food.vegetable.root-vegetables.carrot in autumn root vegetable and chestnut roasts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peanut",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "peanut commonly pairs with food.vegetable.nightshades.tomato in West African and Asian peanut stew contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peanut",
    "target": "food.protein.poultry.chicken-thigh",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "peanut commonly pairs with food.protein.poultry.chicken-thigh in satay and peanut sauce poultry pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sesame",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sesame commonly pairs with food.protein.fin-fish.salmon-fillet in Japanese and Middle Eastern sesame fish finishing — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sesame",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sesame commonly pairs with food.vegetable.green-vegetables.spinach in goma-ae and sesame green vegetable contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sunflower-seed",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sunflower-seed commonly pairs with food.grain.processed-grains.wheat-flour in multiseed bread and roll baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sunflower-seed",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sunflower-seed commonly pairs with food.vegetable.root-vegetables.carrot in salad and slaw seed crunch pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pumpkin-seed",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pumpkin-seed commonly pairs with food.vegetable.nightshades.tomato in Mexican mole and seed garnish contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pumpkin-seed",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pumpkin-seed commonly pairs with food.protein.pork.pork-loin in Latin seed-crusted roast pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "flaxseed",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "flaxseed commonly pairs with food.grain.whole-grains.oats in breakfast seed and oat combinations — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "flaxseed",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "flaxseed commonly pairs with food.fruit.berries.strawberry in smoothie bowl and seed topping contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chia-seed",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "chia-seed commonly pairs with food.fruit.berries.strawberry in pudding and parfait seed topping contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chia-seed",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "chia-seed commonly pairs with food.grain.whole-grains.oats in overnight oat and seed bowl contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tahini",
    "target": "food.vegetable.nightshades.eggplant",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "tahini commonly pairs with food.vegetable.nightshades.eggplant in baba ghanoush and Middle Eastern dip contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tahini",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "tahini commonly pairs with food.protein.lamb.lamb-leg in Levantine tahini lamb sauce contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peanut-butter",
    "target": "food.fruit.processed-fruits.raisin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "peanut-butter commonly pairs with food.fruit.processed-fruits.raisin in classic American sandwich fruit-nut pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peanut-butter",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "peanut-butter commonly pairs with food.grain.processed-grains.wheat-flour in peanut butter cookie and baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond-flour",
    "target": "food.herb.whole-spices.vanilla-bean",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "almond-flour commonly pairs with food.herb.whole-spices.vanilla-bean in macaron and almond pastry spice contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond-flour",
    "target": "food.fruit.citrus.lemon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "almond-flour commonly pairs with food.fruit.citrus.lemon in gluten-free citrus almond cake contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hazelnut-flour",
    "target": "food.herb.whole-spices.vanilla-bean",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hazelnut-flour commonly pairs with food.herb.whole-spices.vanilla-bean in European nut torte and spice dessert contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hazelnut-flour",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hazelnut-flour commonly pairs with food.fruit.tropical-fruits.coconut in tropical nut flour dessert pairings — coconut in Fruit domain — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond-butter",
    "target": "food.fruit.pomes.apple",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "almond-butter commonly pairs with food.fruit.pomes.apple in nut butter and orchard fruit snack contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond-butter",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "almond-butter commonly pairs with food.grain.processed-grains.wheat-flour in almond butter baking and toast contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cashew-butter",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "cashew-butter commonly pairs with food.vegetable.nightshades.tomato in vegan cream sauce and curry contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cashew-butter",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "cashew-butter commonly pairs with food.protein.poultry.chicken-breast in cashew-cream poultry sauce contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pistachio-paste",
    "target": "food.fruit.citrus.orange",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pistachio-paste commonly pairs with food.fruit.citrus.orange in Sicilian nut paste and citrus dessert contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pistachio-paste",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pistachio-paste commonly pairs with food.herb.whole-spices.cinnamon in spiced nut paste pastry contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chestnut-flour",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "chestnut-flour commonly pairs with food.protein.pork.pork-loin in Italian castagnaccio and roast pork contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chestnut-flour",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "chestnut-flour commonly pairs with food.vegetable.root-vegetables.carrot in autumn root and chestnut flour baking — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "poppy-seed",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "poppy-seed commonly pairs with food.grain.processed-grains.wheat-flour in Central European poppy seed pastry contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "poppy-seed",
    "target": "food.fruit.citrus.lemon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "poppy-seed commonly pairs with food.fruit.citrus.lemon in lemon-poppy seed baking pairings — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "egusi-seed",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "egusi-seed commonly pairs with food.protein.beef.brisket in West African egusi stew protein contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "egusi-seed",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "egusi-seed commonly pairs with food.vegetable.nightshades.tomato in tomato-based egusi stew contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hemp-seed",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hemp-seed commonly pairs with food.vegetable.green-vegetables.spinach in salad and bowl seed topping contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hemp-seed",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hemp-seed commonly pairs with food.grain.whole-grains.oats in breakfast seed and oat combinations — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lotus-seed",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "lotus-seed commonly pairs with food.grain.whole-grains.rice in Chinese lotus seed sweet soup contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lotus-seed",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "lotus-seed commonly pairs with food.fruit.tropical-fruits.coconut in Asian seed and coconut dessert contexts — coconut in Fruit domain — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wattleseed",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "wattleseed commonly pairs with food.protein.beef.ribeye in Australian bush spice and beef dessert contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wattleseed",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "wattleseed commonly pairs with food.grain.processed-grains.wheat-flour in Australian seed dessert baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "perilla-seed",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "perilla-seed commonly pairs with food.protein.fin-fish.salmon-fillet in Korean banchan and fish seed contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "perilla-seed",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "perilla-seed commonly pairs with food.vegetable.alliums.garlic in Korean seed and allium banchan contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mahlab",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "mahlab commonly pairs with food.grain.processed-grains.wheat-flour in Greek sweet bread and seed spice contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mahlab",
    "target": "food.fruit.citrus.orange",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "mahlab commonly pairs with food.fruit.citrus.orange in Eastern Mediterranean holiday baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "walnut-meal",
    "target": "food.fruit.processed-fruits.raisin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "walnut-meal commonly pairs with food.fruit.processed-fruits.raisin in nut-meal fruit bread and tart contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "walnut-meal",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "walnut-meal commonly pairs with food.grain.processed-grains.wheat-flour in mixed nut-meal baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pecan-meal",
    "target": "food.fruit.pomes.apple",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pecan-meal commonly pairs with food.fruit.pomes.apple in Southern pecan meal pie contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pecan-meal",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pecan-meal commonly pairs with food.protein.poultry.chicken-breast in nut-meal crusted poultry contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sunflower-seed-butter",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sunflower-seed-butter commonly pairs with food.fruit.berries.strawberry in seed butter and berry toast contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sunflower-seed-butter",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sunflower-seed-butter commonly pairs with food.grain.processed-grains.wheat-flour in seed butter sandwich bread contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pumpkin-seed-butter",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pumpkin-seed-butter commonly pairs with food.vegetable.root-vegetables.carrot in autumn seed butter and root vegetable contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pumpkin-seed-butter",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pumpkin-seed-butter commonly pairs with food.grain.whole-grains.oats in fall seed butter oat bowl contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "flaxseed-meal",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "flaxseed-meal commonly pairs with food.grain.processed-grains.wheat-flour in gluten-free seed meal baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "flaxseed-meal",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "flaxseed-meal commonly pairs with food.fruit.berries.strawberry in health baking and berry pairing contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sesame-flour",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sesame-flour commonly pairs with food.protein.fin-fish.salmon-fillet in Middle Eastern seed flour fish coating contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sesame-flour",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sesame-flour commonly pairs with food.vegetable.alliums.garlic in Levantine seed flatbread contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hazelnut-butter",
    "target": "food.fruit.citrus.orange",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hazelnut-butter commonly pairs with food.fruit.citrus.orange in European nut butter and citrus toast contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hazelnut-butter",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hazelnut-butter commonly pairs with food.grain.processed-grains.wheat-flour in nut butter baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pecan-butter",
    "target": "food.fruit.pomes.apple",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pecan-butter commonly pairs with food.fruit.pomes.apple in Southern nut butter and orchard fruit contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pecan-butter",
    "target": "food.protein.poultry.chicken-thigh",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pecan-butter commonly pairs with food.protein.poultry.chicken-thigh in Southern nut butter glaze contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "walnut-butter",
    "target": "food.fruit.processed-fruits.raisin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "walnut-butter commonly pairs with food.fruit.processed-fruits.raisin in nut butter and dried fruit toast contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "walnut-butter",
    "target": "food.cheese.blue.gorgonzola",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "walnut-butter commonly pairs with food.cheese.blue.gorgonzola in walnut butter and blue cheese service contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "macadamia-butter",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "macadamia-butter commonly pairs with food.fruit.tropical-fruits.coconut in tropical nut butter dessert contexts — coconut in Fruit domain — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "macadamia-butter",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "macadamia-butter commonly pairs with food.protein.fin-fish.salmon-fillet in macadamia butter fish finishing contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pine-nut-paste",
    "target": "food.herb.fresh-herbs.basil",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pine-nut-paste commonly pairs with food.herb.fresh-herbs.basil in pesto paste herb contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pine-nut-paste",
    "target": "food.vegetable.green-vegetables.asparagus",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pine-nut-paste commonly pairs with food.vegetable.green-vegetables.asparagus in spring nut paste vegetable contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond-meal",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "almond-meal commonly pairs with food.protein.fin-fish.salmon-fillet in nut-meal crusted fish contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "almond-meal",
    "target": "food.fruit.citrus.lemon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "almond-meal commonly pairs with food.fruit.citrus.lemon in almond meal citrus tart contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hazelnut-meal",
    "target": "food.herb.whole-spices.vanilla-bean",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hazelnut-meal commonly pairs with food.herb.whole-spices.vanilla-bean in European torte nut meal contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hazelnut-meal",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hazelnut-meal commonly pairs with food.fruit.tropical-fruits.coconut in nut meal tropical dessert contexts — coconut in Fruit domain — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cashew-flour",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "cashew-flour commonly pairs with food.vegetable.nightshades.tomato in vegan cashew flour sauce contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cashew-flour",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "cashew-flour commonly pairs with food.protein.poultry.chicken-breast in cashew flour coating poultry contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hemp-seed-butter",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hemp-seed-butter commonly pairs with food.vegetable.green-vegetables.spinach in seed butter green salad contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hemp-seed-butter",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hemp-seed-butter commonly pairs with food.grain.whole-grains.oats in protein seed butter oat contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hemp-seed-flour",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hemp-seed-flour commonly pairs with food.grain.processed-grains.wheat-flour in protein seed flour baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hemp-seed-flour",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hemp-seed-flour commonly pairs with food.fruit.berries.strawberry in seed flour berry baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pumpkin-seed-flour",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pumpkin-seed-flour commonly pairs with food.vegetable.root-vegetables.carrot in autumn seed flour baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pumpkin-seed-flour",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pumpkin-seed-flour commonly pairs with food.protein.pork.pork-loin in seed flour roast accompaniment contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sunflower-seed-flour",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sunflower-seed-flour commonly pairs with food.grain.processed-grains.wheat-flour in seed flour bread baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sunflower-seed-flour",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sunflower-seed-flour commonly pairs with food.cheese.hard.cheddar in seed bread and cheddar service contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pumpkin-seed-meal",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pumpkin-seed-meal commonly pairs with food.vegetable.nightshades.tomato in Mexican mole seed meal contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pumpkin-seed-meal",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pumpkin-seed-meal commonly pairs with food.protein.pork.pork-loin in Latin seed meal crust contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chia-seed-meal",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "chia-seed-meal commonly pairs with food.fruit.berries.strawberry in chia meal pudding contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chia-seed-meal",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "chia-seed-meal commonly pairs with food.grain.whole-grains.oats in chia meal oat breakfast contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "flaxseed-butter",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "flaxseed-butter commonly pairs with food.grain.whole-grains.oats in seed butter oat toast contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "flaxseed-butter",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "flaxseed-butter commonly pairs with food.fruit.berries.strawberry in health seed butter berry toast contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sesame-paste",
    "target": "food.vegetable.nightshades.eggplant",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sesame-paste commonly pairs with food.vegetable.nightshades.eggplant in Chinese cold noodle sesame paste contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sesame-paste",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sesame-paste commonly pairs with food.protein.fin-fish.salmon-fillet in Asian sesame paste fish contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sunflower-seed-paste",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sunflower-seed-paste commonly pairs with food.vegetable.root-vegetables.carrot in Eastern European seed paste dip contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sunflower-seed-paste",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sunflower-seed-paste commonly pairs with food.grain.processed-grains.wheat-flour in seed paste bread spread contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "niger-seed-paste",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "niger-seed-paste commonly pairs with food.protein.beef.brisket in Ethiopian seed paste stew contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "niger-seed-paste",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "niger-seed-paste commonly pairs with food.grain.whole-grains.rice in Ethiopian seed paste rice contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sacha-inchi-butter",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sacha-inchi-butter commonly pairs with food.fruit.berries.strawberry in Andean seed butter berry toast contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sacha-inchi-butter",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sacha-inchi-butter commonly pairs with food.grain.whole-grains.oats in superfood seed butter oat contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "brazil-nut-meal",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "brazil-nut-meal commonly pairs with food.fruit.berries.strawberry in tropical nut meal berry baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "brazil-nut-meal",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "brazil-nut-meal commonly pairs with food.grain.processed-grains.wheat-flour in Brazil nut meal gluten-free baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "bitter-almond",
    "target": "food.herb.whole-spices.vanilla-bean",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "bitter-almond commonly pairs with food.herb.whole-spices.vanilla-bean in European almond extract dessert contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "bitter-almond",
    "target": "food.fruit.citrus.orange",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "bitter-almond commonly pairs with food.fruit.citrus.orange in amaretto-adjacent citrus dessert contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hickory-nut",
    "target": "food.fruit.pomes.apple",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hickory-nut commonly pairs with food.fruit.pomes.apple in Southern nut and orchard fruit baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "beechnut",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "beechnut commonly pairs with food.grain.processed-grains.wheat-flour in Central European nut pastry contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pili-nut",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pili-nut commonly pairs with food.fruit.tropical-fruits.coconut in Filipino nut and coconut sweet contexts — coconut in Fruit domain — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kola-nut",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "kola-nut commonly pairs with food.protein.beef.brisket in West African spice-nut stew contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ginkgo-nut",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "ginkgo-nut commonly pairs with food.grain.whole-grains.rice in East Asian ginkgo rice contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "candlenut",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "candlenut commonly pairs with food.protein.fin-fish.salmon-fillet in Indonesian curry paste fish contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mongongo-nut",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "mongongo-nut commonly pairs with food.protein.beef.brisket in Southern African foraged nut stew contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "baru-nut",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "baru-nut commonly pairs with food.protein.beef.ribeye in Brazilian cerrado nut and beef contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "saba-nut",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "saba-nut commonly pairs with food.protein.pork.pork-loin in Central American nut stew contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "paradise-nut",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "paradise-nut commonly pairs with food.fruit.tropical-fruits.coconut in Amazonian nut confection contexts — coconut in Fruit domain — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "jackfruit-seed",
    "target": "food.protein.poultry.chicken-thigh",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "jackfruit-seed commonly pairs with food.protein.poultry.chicken-thigh in South Asian curry seed contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "breadnut-seed",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "breadnut-seed commonly pairs with food.protein.pork.pork-loin in Mesoamerican roast seed contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "breadfruit-seed",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "breadfruit-seed commonly pairs with food.protein.pork.pork-loin in Pacific Island roast seed contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "desert-date-seed",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "desert-date-seed commonly pairs with food.protein.lamb.lamb-leg in Sahelian seed-oil lamb contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cucumber-seed",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "cucumber-seed commonly pairs with food.vegetable.alliums.garlic in Levantine dried seed snack contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "palmyra-seed",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "palmyra-seed commonly pairs with food.fruit.tropical-fruits.coconut in South Asian palm sweet contexts — coconut in Fruit domain — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "okra-seed",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "okra-seed commonly pairs with food.protein.beef.brisket in Southern seed-meal stew contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "melon-seed",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "melon-seed commonly pairs with food.cheese.brined.feta in Middle Eastern seed and cheese snack contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "watermelon-seed",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "watermelon-seed commonly pairs with food.cheese.brined.feta in Levantine roasted seed and cheese contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "niger-seed",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "niger-seed commonly pairs with food.protein.beef.brisket in Ethiopian seed stew contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sacha-inchi-seed",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "sacha-inchi-seed commonly pairs with food.fruit.berries.strawberry in Andean superfood seed bowl contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "safflower-seed",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "safflower-seed commonly pairs with food.vegetable.green-vegetables.spinach in neutral oilseed salad contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "safflower-meal",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "safflower-meal commonly pairs with food.grain.processed-grains.wheat-flour in health seed meal baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "squash-seed",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "squash-seed commonly pairs with food.vegetable.root-vegetables.carrot in autumn cucurbit seed roast contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "psyllium-seed",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "psyllium-seed commonly pairs with food.grain.processed-grains.wheat-flour in gluten-free binding baking contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pomegranate-seed",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "pomegranate-seed commonly pairs with food.protein.lamb.lamb-leg in Persian nut-seed and lamb garnish contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "radish-seed",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "radish-seed commonly pairs with food.protein.fin-fish.salmon-fillet in East Asian sprouting seed fish contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "onion-seed",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "onion-seed commonly pairs with food.protein.beef.brisket in Indian pickle and stew seed contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "leek-seed",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "leek-seed commonly pairs with food.protein.pork.pork-loin in European pickling seed roast contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "palm-kernel-seed",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "palm-kernel-seed commonly pairs with food.protein.beef.brisket in West African seed-oil stew contexts — cross-domain forward reference by canonical ID only."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hemp-seed-meal",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "hemp-seed-meal commonly pairs with food.grain.processed-grains.wheat-flour in protein seed meal baking contexts — cross-domain forward reference by canonical ID only."
  }
];
