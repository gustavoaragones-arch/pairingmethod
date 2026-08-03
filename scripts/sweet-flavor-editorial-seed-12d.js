/**
 * FOOD-12D — Curated editorial relationship seed data.
 * Tier A: similar_to, substitutes_for, similar_sweet_flavors
 * Tier B: commonly_served_with (intra-domain)
 * Tier C: commonly_served_with (cross-domain forward references)
 *
 * SWEET-001 / COCOA-001 Editorial Rule: cacao bean agricultural form and
 * independent cocoa-derived ingredients must not be treated as editorially
 * interchangeable in Tier A.
 */

/** Forward references to published domains — canonical IDs only. */
export const FORWARD_REFERENCE_IDS = new Set([
  "food.cheese.bloomy-rind.brie-de-meaux",
  "food.cheese.blue.gorgonzola",
  "food.cheese.brined.feta",
  "food.cheese.fresh.goat-chevre-log",
  "food.cheese.hard.parmigiano-reggiano",
  "food.fruit.berries.strawberry",
  "food.fruit.citrus.lemon",
  "food.fruit.citrus.orange",
  "food.fruit.pomes.apple",
  "food.fruit.processed-fruits.raisin",
  "food.fruit.tropical-fruits.coconut",
  "food.fungi.cultivated-mushrooms.shiitake",
  "food.grain.processed-grains.wheat-flour",
  "food.grain.whole-grains.oats",
  "food.grain.whole-grains.rice",
  "food.herb.dried-herbs.rosemary",
  "food.herb.fresh-herbs.basil",
  "food.herb.fresh-herbs.mint",
  "food.herb.whole-spices.black-pepper",
  "food.herb.whole-spices.cinnamon",
  "food.herb.whole-spices.vanilla-bean",
  "food.nut-seed.edible-seeds.sesame",
  "food.nut-seed.tree-nuts.almond",
  "food.nut-seed.peanuts.peanut",
  "food.protein.beef.brisket",
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
  "food.vegetable.green-vegetables.spinach",
  "food.vegetable.nightshades.eggplant",
  "food.vegetable.nightshades.tomato",
  "food.vegetable.root-vegetables.carrot"
]);

function entry(relationship, source, target, tier, evidence) {
  return { relationship, source, target, confidence: "high", editorial_tier: tier, editorial_review: "approved", evidence };
}

/** @type {ReturnType<typeof entry>[]} */
export const EDITORIAL_CURATED = [
  {
    "relationship": "similar_to",
    "source": "cane-sugar",
    "target": "beet-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cane sugar and beet sugar share refined crystalline sweetener roles in global baking without collapsing CANON-001 trade-name aliases."
  },
  {
    "relationship": "similar_to",
    "source": "turbinado-sugar",
    "target": "demerara-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Turbinado sugar and demerara sugar share partially refined golden topping sugar applications in baking and coffee service."
  },
  {
    "relationship": "similar_to",
    "source": "muscovado-sugar",
    "target": "brown-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Muscovado sugar and brown sugar share molasses-rich baking and glaze character in British and American cookery."
  },
  {
    "relationship": "similar_to",
    "source": "panela",
    "target": "piloncillo",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Panela and piloncillo share Latin American unrefined cane loaf sugar identity in stews and beverages."
  },
  {
    "relationship": "similar_to",
    "source": "jaggery",
    "target": "panela",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Jaggery and panela share unrefined block sugar roles in South Asian and Latin American cookery."
  },
  {
    "relationship": "similar_to",
    "source": "maple-syrup",
    "target": "maple-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Maple syrup and maple sugar share Acer saccharum lineage in North American sweetening applications."
  },
  {
    "relationship": "similar_to",
    "source": "molasses",
    "target": "blackstrap-molasses",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Molasses and blackstrap molasses share cane syrup lineage with distinct intensity grades preserved as separate canonical entities."
  },
  {
    "relationship": "similar_to",
    "source": "golden-syrup",
    "target": "treacle",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Golden syrup and treacle share British inverted cane syrup roles in puddings and gingerbread."
  },
  {
    "relationship": "similar_to",
    "source": "corn-syrup",
    "target": "glucose-syrup",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Corn syrup and glucose syrup share confectionery invert syrup roles in candy and pastry applications."
  },
  {
    "relationship": "similar_to",
    "source": "invert-sugar-syrup",
    "target": "glucose-syrup",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Invert sugar syrup and glucose syrup share professional pastry moisture-retention syrup applications."
  },
  {
    "relationship": "similar_to",
    "source": "clover-honey",
    "target": "honey",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Clover honey and honey share Apis mellifera floral sweetener roles in baking and finishing."
  },
  {
    "relationship": "similar_to",
    "source": "natural-cocoa-powder",
    "target": "cocoa-powder",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Natural cocoa powder and cocoa powder share defatted cacao powder baking roles with alkalization preserved as separate entities."
  },
  {
    "relationship": "similar_to",
    "source": "dutch-process-cocoa-powder",
    "target": "black-cocoa-powder",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Dutch-process cocoa powder and black cocoa powder share alkalized dark cocoa baking lineage."
  },
  {
    "relationship": "similar_to",
    "source": "cacao-nibs",
    "target": "roasted-cacao-nibs",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cacao nibs and roasted cacao nibs share crunchy cacao garnish roles with roast level preserved under COCOA-001."
  },
  {
    "relationship": "similar_to",
    "source": "erythritol",
    "target": "allulose",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Erythritol and allulose share modern low-calorie crystalline sweetener roles in reduced-sugar baking."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "honey",
    "target": "clover-honey",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Honey and clover honey share mild everyday floral sweetening character in tea and baking service."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "honey",
    "target": "buckwheat-honey",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Honey and buckwheat honey share bee-product sweetening roles with distinct terroir preserved as separate entities."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "comb-honey",
    "target": "honey",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Comb honey and honey share raw honey sweetness in cheese-board and finishing applications."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "raw-sugar",
    "target": "turbinado-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Raw sugar and turbinado sugar share minimally processed golden crystalline sweetener character."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "palm-sugar",
    "target": "jaggery",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Palm sugar and jaggery share unrefined block sweetener roles in tropical and South Asian cookery."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "palm-syrup",
    "target": "palm-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Palm syrup and palm sugar share palm sap sweetening lineage in Southeast Asian cookery."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "agave",
    "target": "yacon-syrup",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Agave and yacon syrup share pourable plant-derived low-glycemic sweetener roles in modern baking."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "coconut-sugar",
    "target": "palm-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Coconut sugar and palm sugar share caramel-toned palm-blossom crystalline sweetener character."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "date-syrup",
    "target": "grape-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Date syrup and grape sugar share fruit-derived Middle Eastern and Mediterranean sweetening roles."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "carob-powder",
    "target": "lucuma-powder",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Carob powder and lucuma powder share fruit-powder sweet flavor building in health-forward pastry."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "mesquite-powder",
    "target": "lucuma-powder",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Mesquite powder and lucuma powder share specialty fruit-powder sweetening in Southwestern and Peruvian baking."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "stevia",
    "target": "monk-fruit-sweetener",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Stevia and monk fruit sweetener share high-intensity natural sweetener blend roles."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "sucralose",
    "target": "aspartame",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Sucralose and aspartame share high-intensity tabletop sweetener roles in regional blend formulations."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "maltitol",
    "target": "sorbitol",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Maltitol and sorbitol share sugar-alcohol confection and baking humectant roles."
  },
  {
    "relationship": "similar_sweet_flavors",
    "source": "cacao-powder",
    "target": "ground-cacao",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cacao powder and ground cacao share rustic cacao drink and baking flavor roles with grind level preserved under COCOA-001."
  },
  {
    "relationship": "substitutes_for",
    "source": "cane-sugar",
    "target": "beet-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cane sugar substitutes for beet sugar in general baking and cookery with equivalent crystalline sweetness."
  },
  {
    "relationship": "substitutes_for",
    "source": "brown-sugar",
    "target": "muscovado-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Brown sugar substitutes for muscovado sugar in molasses-forward baking with minor moisture adjustment."
  },
  {
    "relationship": "substitutes_for",
    "source": "turbinado-sugar",
    "target": "demerara-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Turbinado sugar substitutes for demerara sugar as a crunchy topping and golden baking sweetener."
  },
  {
    "relationship": "substitutes_for",
    "source": "maple-syrup",
    "target": "golden-syrup",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Maple syrup substitutes for golden syrup in some British-style baking and glaze applications."
  },
  {
    "relationship": "substitutes_for",
    "source": "corn-syrup",
    "target": "glucose-syrup",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Corn syrup substitutes for glucose syrup in confectionery and candy applications."
  },
  {
    "relationship": "substitutes_for",
    "source": "honey",
    "target": "clover-honey",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Honey substitutes for clover honey in everyday baking and glaze formulations."
  },
  {
    "relationship": "substitutes_for",
    "source": "agave",
    "target": "yacon-syrup",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Agave substitutes for yacon syrup in pourable low-glycemic sweetening applications."
  },
  {
    "relationship": "substitutes_for",
    "source": "coconut-sugar",
    "target": "palm-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Coconut sugar substitutes for palm sugar in caramel-toned baking with similar moisture behavior."
  },
  {
    "relationship": "substitutes_for",
    "source": "date-syrup",
    "target": "grape-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Date syrup substitutes for grape sugar in Middle Eastern silan-style sweetening applications."
  },
  {
    "relationship": "substitutes_for",
    "source": "natural-cocoa-powder",
    "target": "dutch-process-cocoa-powder",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Natural cocoa powder substitutes for Dutch-process cocoa powder only with leavening and pH recipe adjustment."
  },
  {
    "relationship": "substitutes_for",
    "source": "erythritol",
    "target": "xylitol",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Erythritol substitutes for xylitol in reduced-sugar baking with similar sugar-alcohol bulk."
  },
  {
    "relationship": "substitutes_for",
    "source": "stevia",
    "target": "monk-fruit-sweetener",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Stevia substitutes for monk fruit sweetener in high-intensity natural sweetener blends."
  },
  {
    "relationship": "substitutes_for",
    "source": "maltitol",
    "target": "sorbitol",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Maltitol substitutes for sorbitol in sugar-free confection with similar humectant behavior."
  },
  {
    "relationship": "substitutes_for",
    "source": "fruit-sugar",
    "target": "cane-sugar",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Fruit sugar substitutes for cane sugar in fructose-forward baking with minor browning adjustment."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cane-sugar",
    "target": "corn-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cane sugar and corn syrup are commonly served together in American candy and fudge preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cane-sugar",
    "target": "brown-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cane sugar and brown sugar are commonly served together in layered baking and barbecue rub formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "brown-sugar",
    "target": "molasses",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Brown sugar and molasses are commonly served together in gingerbread and braise glaze combinations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "brown-sugar",
    "target": "muscovado-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Brown sugar and muscovado sugar are commonly served together in molasses-rich cookie and spice-cake formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "turbinado-sugar",
    "target": "demerara-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Turbinado sugar and demerara sugar are commonly served together in crunchy topping and crumble formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "maple-syrup",
    "target": "maple-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Maple syrup and maple sugar are commonly served together in North American maple dessert preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "maple-syrup",
    "target": "brown-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Maple syrup and brown sugar are commonly served together in autumn baking and glaze combinations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "molasses",
    "target": "blackstrap-molasses",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Molasses and blackstrap molasses are commonly served together in spice-forward baking and marinade blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "molasses",
    "target": "treacle",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Molasses and treacle are commonly served together in dark gingerbread and pudding formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "golden-syrup",
    "target": "treacle",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Golden syrup and treacle are commonly served together in British treacle tart and pudding layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "corn-syrup",
    "target": "glucose-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Corn syrup and glucose syrup are commonly served together in professional confection and mirror glaze bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "corn-syrup",
    "target": "invert-sugar-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Corn syrup and invert sugar syrup are commonly served together in candy and soft-caramel formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice-syrup",
    "target": "barley-malt-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rice syrup and barley malt syrup are commonly served together in Asian and health-food baking blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sorghum-syrup",
    "target": "cane-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Sorghum syrup and cane syrup are commonly served together in Southern sweet syrup and glaze service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "palm-syrup",
    "target": "palm-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Palm syrup and palm sugar are commonly served together in Southeast Asian sweet sauce and dessert bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "honey",
    "target": "brown-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Honey and brown sugar are commonly served together in barbecue glaze and spice-cake formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "honey",
    "target": "maple-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Honey and maple syrup are commonly served together in multi-syrup pancake and dressing blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "clover-honey",
    "target": "comb-honey",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Clover honey and comb honey are commonly served together on cheese boards and breakfast spreads."
  },
  {
    "relationship": "commonly_served_with",
    "source": "buckwheat-honey",
    "target": "manuka-honey",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Buckwheat honey and manuka honey are commonly served together in specialty honey tasting and finishing flights."
  },
  {
    "relationship": "commonly_served_with",
    "source": "agave",
    "target": "date-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Agave and date syrup are commonly served together in Middle Eastern and modern plant-sweetener blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-sugar",
    "target": "date-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Coconut sugar and date syrup are commonly served together in paleo and natural baking formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "yacon-syrup",
    "target": "agave",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Yacon syrup and agave are commonly served together in low-glycemic sweetener combination blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "monk-fruit-sweetener",
    "target": "stevia",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Monk fruit sweetener and stevia are commonly served together in zero-calorie tabletop blend formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "erythritol",
    "target": "allulose",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Erythritol and allulose are commonly served together in modern keto and reduced-sugar baking blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "xylitol",
    "target": "erythritol",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Xylitol and erythritol are commonly served together in sugar-alcohol confection and baking mixes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sucralose",
    "target": "aspartame",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Sucralose and aspartame are commonly served together in high-intensity tabletop sweetener blend packets."
  },
  {
    "relationship": "commonly_served_with",
    "source": "maltitol",
    "target": "sorbitol",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Maltitol and sorbitol are commonly served together in sugar-free chocolate and confection bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cocoa-powder",
    "target": "cocoa-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cocoa powder and cocoa butter are commonly served together in chocolate making and ganache formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chocolate-liquor",
    "target": "cocoa-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Chocolate liquor and cocoa butter are commonly served together in professional couverture and confection production."
  },
  {
    "relationship": "commonly_served_with",
    "source": "natural-cocoa-powder",
    "target": "dutch-process-cocoa-powder",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Natural cocoa powder and Dutch-process cocoa powder are commonly served together in layered brownie and devil's food formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cacao-nibs",
    "target": "cocoa-powder",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cacao nibs and cocoa powder are commonly served together in textured chocolate cookie and brownie preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cacao-paste",
    "target": "chocolate-liquor",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cacao paste and chocolate liquor are commonly served together in unsweetened chocolate base formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "high-fat-cocoa-powder",
    "target": "cocoa-butter",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "High-fat cocoa powder and cocoa butter are commonly served together in premium ganache and ice cream bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "defatted-cocoa-powder",
    "target": "cocoa-powder",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Defatted cocoa powder and cocoa powder are commonly served together in lighter baking and dusting applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-cocoa-powder",
    "target": "dutch-process-cocoa-powder",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Black cocoa powder and Dutch-process cocoa powder are commonly served together in dark oreo-style cookie formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cacao-powder",
    "target": "raw-cacao",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cacao powder and raw cacao are commonly served together in health-forward hot chocolate and smoothie blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ground-cacao",
    "target": "cacao-nibs",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Ground cacao and cacao nibs are commonly served together in rustic chocolate bark and granola formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "roasted-cacao-nibs",
    "target": "toasted-cacao",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Roasted cacao nibs and toasted cacao are commonly served together in nutty chocolate pastry crunch layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cocoa-solids",
    "target": "cocoa-presscake",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cocoa solids and cocoa presscake share industrial and artisan chocolate feedstock combinations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "panela",
    "target": "piloncillo",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Panela and piloncillo are commonly served together in Latin American atole and spiced beverage sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "jaggery",
    "target": "palm-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Jaggery and palm sugar are commonly served together in South Asian and Southeast Asian dessert sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rock-sugar",
    "target": "cane-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rock sugar and cane sugar are commonly served together in Chinese braised dessert and tea sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fruit-sugar",
    "target": "grape-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Fruit sugar and grape sugar are commonly served together in European confection and wine-country sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "birch-sugar",
    "target": "xylitol",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Birch sugar and xylitol are commonly served together in dental-friendly and reduced-sugar tabletop blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "carob-powder",
    "target": "cocoa-powder",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Carob powder and cocoa powder are commonly served together in caffeine-free chocolate alternative baking."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lucuma-powder",
    "target": "mesquite-powder",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Lucuma powder and mesquite powder are commonly served together in superfood smoothie and ice cream bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "beet-sugar",
    "target": "cane-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Beet sugar and cane sugar are commonly served together in European refined sugar blending for industrial baking."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raw-sugar",
    "target": "demerara-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Raw sugar and demerara sugar are commonly served together in artisan coffee and crumble topping service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "invert-sugar-syrup",
    "target": "golden-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Invert sugar syrup and golden syrup are commonly served together in professional pastry and soft-cookie formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "glucose-syrup",
    "target": "rice-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Glucose syrup and rice syrup are commonly served together in Asian confection and mochi sweetening blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cane-syrup",
    "target": "sorghum-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cane syrup and sorghum syrup are commonly served together in Southern syrup and pancake service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "manuka-honey",
    "target": "honey",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Manuka honey and honey are commonly served together in premium honey flight and glaze tasting service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tagatose",
    "target": "allulose",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Tagatose and allulose are commonly served together in specialty low-calorie baking research formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cyclamate",
    "target": "saccharin",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cyclamate and saccharin are commonly served together in regional high-intensity tabletop sweetener blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "saccharin",
    "target": "aspartame",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Saccharin and aspartame are commonly served together in legacy tabletop sweetener blend packets."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ruby-cacao",
    "target": "cacao-paste",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Ruby cacao and cacao paste are commonly served together in specialty fruit-forward confection development."
  },
  {
    "relationship": "commonly_served_with",
    "source": "red-cocoa-powder",
    "target": "natural-cocoa-powder",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Red cocoa powder and natural cocoa powder are commonly served together in velvet-style red baking formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cocoa-presscake",
    "target": "defatted-cocoa-powder",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cocoa presscake and defatted cocoa powder share industrial cocoa processing feedstock combinations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "piloncillo",
    "target": "jaggery",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Piloncillo and jaggery are commonly served together in Latin and South Asian spiced beverage sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "panela",
    "target": "rock-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Panela and rock sugar are commonly served together in global block-sugar dessert and tea sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blackstrap-molasses",
    "target": "treacle",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Blackstrap molasses and treacle are commonly served together in robust dark baking and marinade blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "barley-malt-syrup",
    "target": "sorghum-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Barley malt syrup and sorghum syrup are commonly served together in heritage grain syrup baking applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "date-syrup",
    "target": "yacon-syrup",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Date syrup and yacon syrup are commonly served together in fruit-and-root pourable sweetener blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-sugar",
    "target": "fruit-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Coconut sugar and fruit sugar are commonly served together in natural crystalline sweetener baking blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "allulose",
    "target": "tagatose",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Allulose and tagatose are commonly served together in experimental reduced-calorie caramel formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "aspartame",
    "target": "cyclamate",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Aspartame and cyclamate are commonly served together in regional diet tabletop sweetener packets."
  },
  {
    "relationship": "commonly_served_with",
    "source": "comb-honey",
    "target": "buckwheat-honey",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Comb honey and buckwheat honey are commonly served together in artisan honey board service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "clover-honey",
    "target": "manuka-honey",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Clover honey and manuka honey are commonly served together in comparative honey tasting flights."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cacao-bean",
    "target": "raw-cacao",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cacao bean and raw cacao are commonly served together in bean-to-bar tasting and health-forward cacao service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "toasted-cacao",
    "target": "raw-cacao",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Toasted cacao and raw cacao are commonly served together in layered cacao flavor tasting applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cocoa-solids",
    "target": "high-fat-cocoa-powder",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cocoa solids and high-fat cocoa powder are commonly served together in professional chocolate formulation."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ground-cacao",
    "target": "toasted-cacao",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Ground cacao and toasted cacao are commonly served together in rustic drinking-chocolate preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "muscovado-sugar",
    "target": "jaggery",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Muscovado sugar and jaggery are commonly served together in dark unrefined sugar baking blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "turbinado-sugar",
    "target": "raw-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Turbinado sugar and raw sugar are commonly served together in golden crystalline topping and coffee service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "demerara-sugar",
    "target": "rock-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Demerara sugar and rock sugar are commonly served together in textured crystalline sweetener finishing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "beet-sugar",
    "target": "fruit-sugar",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Beet sugar and fruit sugar are commonly served together in European refined and fructose-forward baking blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "agave",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Agave is commonly served with published cross-domain ingredients in strawberry dessert and pastry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "agave",
    "target": "food.cheese.blue.gorgonzola",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Agave is commonly served with published cross-domain ingredients in blue-cheese and honey dessert pairings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "allulose",
    "target": "food.fruit.citrus.lemon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Allulose is commonly served with published cross-domain ingredients in citrus dessert and glaze balancing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "allulose",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Allulose is commonly served with published cross-domain ingredients in Mediterranean honey-and-cheese mezze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "aspartame",
    "target": "food.fruit.citrus.orange",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Aspartame is commonly served with published cross-domain ingredients in marmalade and citrus confection contexts."
  },
  {
    "relationship": "commonly_served_with",
    "source": "aspartame",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Aspartame is commonly served with published cross-domain ingredients in chevre and honey dessert combinations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "barley-malt-syrup",
    "target": "food.fruit.pomes.apple",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Barley Malt Syrup is commonly served with published cross-domain ingredients in pie, tart, and autumn baking applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "barley-malt-syrup",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Barley Malt Syrup is commonly served with published cross-domain ingredients in balsamic and cheese dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "beet-sugar",
    "target": "food.fruit.processed-fruits.raisin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Beet Sugar is commonly served with published cross-domain ingredients in fruitcake and spiced baking combinations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "beet-sugar",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Beet Sugar is commonly served with published cross-domain ingredients in baking and pastry base formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "birch-sugar",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Birch Sugar is commonly served with published cross-domain ingredients in tropical dessert and confection applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "birch-sugar",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Birch Sugar is commonly served with published cross-domain ingredients in granola, crumble, and breakfast baking."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-cocoa-powder",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Black Cocoa Powder is commonly served with published cross-domain ingredients in spice-forward baking and beverage sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-cocoa-powder",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Black Cocoa Powder is commonly served with published cross-domain ingredients in rice pudding and Asian sweet dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blackstrap-molasses",
    "target": "food.herb.whole-spices.vanilla-bean",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Blackstrap Molasses is commonly served with published cross-domain ingredients in classic dessert and custard sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blackstrap-molasses",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Blackstrap Molasses is commonly served with published cross-domain ingredients in glaze and barbecue sweet-savory applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "brown-sugar",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Brown Sugar is commonly served with published cross-domain ingredients in spiced chocolate and gingerbread applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "brown-sugar",
    "target": "food.protein.poultry.chicken-thigh",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Brown Sugar is commonly served with published cross-domain ingredients in teriyaki and sweet-savory glaze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "buckwheat-honey",
    "target": "food.nut-seed.tree-nuts.almond",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Buckwheat Honey is commonly served with published cross-domain ingredients in marzipan, frangipane, and nut dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "buckwheat-honey",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Buckwheat Honey is commonly served with published cross-domain ingredients in miso-glaze and sweet-savory fish applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cacao-bean",
    "target": "food.nut-seed.peanuts.peanut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cacao Bean is commonly served with published cross-domain ingredients in confection, brittle, and American dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cacao-bean",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cacao Bean is commonly served with published cross-domain ingredients in barbecue and molasses-style braise glazes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cacao-nibs",
    "target": "food.nut-seed.edible-seeds.sesame",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cacao Nibs is commonly served with published cross-domain ingredients in halva, brittle, and Middle Eastern sweet applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cacao-nibs",
    "target": "food.protein.charcuterie.prosciutto",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cacao Nibs is commonly served with published cross-domain ingredients in melon, fig, and sweet-savory appetizer service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cacao-paste",
    "target": "food.cheese.bloomy-rind.brie-de-meaux",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cacao Paste is commonly served with published cross-domain ingredients in cheese boards and fruit-glazed service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cacao-paste",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cacao Paste is commonly served with published cross-domain ingredients in sweet chili and tropical glaze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cacao-powder",
    "target": "food.cheese.blue.gorgonzola",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cacao Powder is commonly served with published cross-domain ingredients in blue-cheese and honey dessert pairings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cacao-powder",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cacao Powder is commonly served with published cross-domain ingredients in Middle Eastern pomegranate and honey glaze service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cane-sugar",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cane Sugar is commonly served with published cross-domain ingredients in Mediterranean honey-and-cheese mezze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cane-sugar",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cane Sugar is commonly served with published cross-domain ingredients in carrot cake and root-vegetable dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cane-syrup",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cane Syrup is commonly served with published cross-domain ingredients in chevre and honey dessert combinations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cane-syrup",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cane Syrup is commonly served with published cross-domain ingredients in caramelized onion and sweet-savory braise applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "carob-powder",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Carob Powder is commonly served with published cross-domain ingredients in balsamic and cheese dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "carob-powder",
    "target": "food.vegetable.alliums.shallot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Carob Powder is commonly served with published cross-domain ingredients in sweet-sour glaze and confit applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chocolate-liquor",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Chocolate Liquor is commonly served with published cross-domain ingredients in baking and pastry base formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chocolate-liquor",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Chocolate Liquor is commonly served with published cross-domain ingredients in sweet tomato jam and chutney applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "clover-honey",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Clover Honey is commonly served with published cross-domain ingredients in granola, crumble, and breakfast baking."
  },
  {
    "relationship": "commonly_served_with",
    "source": "clover-honey",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Clover Honey is commonly served with published cross-domain ingredients in sweet-savory salad and spanakopita-adjacent applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cocoa-butter",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cocoa Butter is commonly served with published cross-domain ingredients in rice pudding and Asian sweet dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cocoa-butter",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cocoa Butter is commonly served with published cross-domain ingredients in Asian sweet-savory glaze and stir-fry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cocoa-powder",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cocoa Powder is commonly served with published cross-domain ingredients in glaze and barbecue sweet-savory applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cocoa-powder",
    "target": "food.herb.fresh-herbs.mint",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cocoa Powder is commonly served with published cross-domain ingredients in chocolate-mint and herbal dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cocoa-presscake",
    "target": "food.protein.poultry.chicken-thigh",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cocoa Presscake is commonly served with published cross-domain ingredients in teriyaki and sweet-savory glaze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cocoa-presscake",
    "target": "food.herb.fresh-herbs.basil",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cocoa Presscake is commonly served with published cross-domain ingredients in strawberry-basil and modern dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cocoa-solids",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cocoa Solids is commonly served with published cross-domain ingredients in miso-glaze and sweet-savory fish applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cocoa-solids",
    "target": "food.herb.dried-herbs.rosemary",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cocoa Solids is commonly served with published cross-domain ingredients in honey-rosemary and shortbread applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "comb-honey",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Comb Honey is commonly served with published cross-domain ingredients in barbecue and molasses-style braise glazes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "comb-honey",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Comb Honey is commonly served with published cross-domain ingredients in black-garlic and sweet-savory glaze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "corn-syrup",
    "target": "food.protein.charcuterie.prosciutto",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Corn Syrup is commonly served with published cross-domain ingredients in melon, fig, and sweet-savory appetizer service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "corn-syrup",
    "target": "food.vegetable.nightshades.eggplant",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Corn Syrup is commonly served with published cross-domain ingredients in candied and Middle Eastern sweet eggplant applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cyclamate",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cyclamate is commonly served with published cross-domain ingredients in sweet chili and tropical glaze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cyclamate",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cyclamate is commonly served with published cross-domain ingredients in glaze and sweet-savory roast applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "date-syrup",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Date Syrup is commonly served with published cross-domain ingredients in Middle Eastern pomegranate and honey glaze service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "date-syrup",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Date Syrup is commonly served with published cross-domain ingredients in strawberry dessert and pastry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "demerara-sugar",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Demerara Sugar is commonly served with published cross-domain ingredients in carrot cake and root-vegetable dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "demerara-sugar",
    "target": "food.fruit.citrus.lemon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Demerara Sugar is commonly served with published cross-domain ingredients in citrus dessert and glaze balancing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dutch-process-cocoa-powder",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Dutch Process Cocoa Powder is commonly served with published cross-domain ingredients in caramelized onion and sweet-savory braise applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dutch-process-cocoa-powder",
    "target": "food.fruit.citrus.orange",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Dutch Process Cocoa Powder is commonly served with published cross-domain ingredients in marmalade and citrus confection contexts."
  },
  {
    "relationship": "commonly_served_with",
    "source": "erythritol",
    "target": "food.vegetable.alliums.shallot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Erythritol is commonly served with published cross-domain ingredients in sweet-sour glaze and confit applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "erythritol",
    "target": "food.fruit.pomes.apple",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Erythritol is commonly served with published cross-domain ingredients in pie, tart, and autumn baking applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fruit-sugar",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fruit Sugar is commonly served with published cross-domain ingredients in sweet tomato jam and chutney applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fruit-sugar",
    "target": "food.fruit.processed-fruits.raisin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fruit Sugar is commonly served with published cross-domain ingredients in fruitcake and spiced baking combinations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "glucose-syrup",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Glucose Syrup is commonly served with published cross-domain ingredients in sweet-savory salad and spanakopita-adjacent applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "glucose-syrup",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Glucose Syrup is commonly served with published cross-domain ingredients in tropical dessert and confection applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "golden-syrup",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Golden Syrup is commonly served with published cross-domain ingredients in Asian sweet-savory glaze and stir-fry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "golden-syrup",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Golden Syrup is commonly served with published cross-domain ingredients in spice-forward baking and beverage sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grape-sugar",
    "target": "food.herb.fresh-herbs.mint",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grape Sugar is commonly served with published cross-domain ingredients in chocolate-mint and herbal dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grape-sugar",
    "target": "food.herb.whole-spices.vanilla-bean",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grape Sugar is commonly served with published cross-domain ingredients in classic dessert and custard sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ground-cacao",
    "target": "food.herb.fresh-herbs.basil",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Ground Cacao is commonly served with published cross-domain ingredients in strawberry-basil and modern dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ground-cacao",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Ground Cacao is commonly served with published cross-domain ingredients in spiced chocolate and gingerbread applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "high-fat-cocoa-powder",
    "target": "food.herb.dried-herbs.rosemary",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "High Fat Cocoa Powder is commonly served with published cross-domain ingredients in honey-rosemary and shortbread applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "high-fat-cocoa-powder",
    "target": "food.nut-seed.tree-nuts.almond",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "High Fat Cocoa Powder is commonly served with published cross-domain ingredients in marzipan, frangipane, and nut dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "honey",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Honey is commonly served with published cross-domain ingredients in black-garlic and sweet-savory glaze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "honey",
    "target": "food.nut-seed.peanuts.peanut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Honey is commonly served with published cross-domain ingredients in confection, brittle, and American dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "invert-sugar-syrup",
    "target": "food.vegetable.nightshades.eggplant",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Invert Sugar Syrup is commonly served with published cross-domain ingredients in candied and Middle Eastern sweet eggplant applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "invert-sugar-syrup",
    "target": "food.nut-seed.edible-seeds.sesame",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Invert Sugar Syrup is commonly served with published cross-domain ingredients in halva, brittle, and Middle Eastern sweet applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "jaggery",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Jaggery is commonly served with published cross-domain ingredients in glaze and sweet-savory roast applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "jaggery",
    "target": "food.cheese.bloomy-rind.brie-de-meaux",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Jaggery is commonly served with published cross-domain ingredients in cheese boards and fruit-glazed service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lucuma-powder",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lucuma Powder is commonly served with published cross-domain ingredients in strawberry dessert and pastry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lucuma-powder",
    "target": "food.cheese.blue.gorgonzola",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lucuma Powder is commonly served with published cross-domain ingredients in blue-cheese and honey dessert pairings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "maltitol",
    "target": "food.fruit.citrus.lemon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Maltitol is commonly served with published cross-domain ingredients in citrus dessert and glaze balancing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "maltitol",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Maltitol is commonly served with published cross-domain ingredients in Mediterranean honey-and-cheese mezze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "manuka-honey",
    "target": "food.fruit.citrus.orange",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Manuka Honey is commonly served with published cross-domain ingredients in marmalade and citrus confection contexts."
  },
  {
    "relationship": "commonly_served_with",
    "source": "manuka-honey",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Manuka Honey is commonly served with published cross-domain ingredients in chevre and honey dessert combinations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "maple-sugar",
    "target": "food.fruit.pomes.apple",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Maple Sugar is commonly served with published cross-domain ingredients in pie, tart, and autumn baking applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "maple-sugar",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Maple Sugar is commonly served with published cross-domain ingredients in balsamic and cheese dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "maple-syrup",
    "target": "food.fruit.processed-fruits.raisin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Maple Syrup is commonly served with published cross-domain ingredients in fruitcake and spiced baking combinations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "maple-syrup",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Maple Syrup is commonly served with published cross-domain ingredients in baking and pastry base formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mesquite-powder",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mesquite Powder is commonly served with published cross-domain ingredients in tropical dessert and confection applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mesquite-powder",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mesquite Powder is commonly served with published cross-domain ingredients in granola, crumble, and breakfast baking."
  },
  {
    "relationship": "commonly_served_with",
    "source": "molasses",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Molasses is commonly served with published cross-domain ingredients in spice-forward baking and beverage sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "molasses",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Molasses is commonly served with published cross-domain ingredients in rice pudding and Asian sweet dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "monk-fruit-sweetener",
    "target": "food.herb.whole-spices.vanilla-bean",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Monk Fruit Sweetener is commonly served with published cross-domain ingredients in classic dessert and custard sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "monk-fruit-sweetener",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Monk Fruit Sweetener is commonly served with published cross-domain ingredients in glaze and barbecue sweet-savory applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "muscovado-sugar",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Muscovado Sugar is commonly served with published cross-domain ingredients in spiced chocolate and gingerbread applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "muscovado-sugar",
    "target": "food.protein.poultry.chicken-thigh",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Muscovado Sugar is commonly served with published cross-domain ingredients in teriyaki and sweet-savory glaze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "natural-cocoa-powder",
    "target": "food.nut-seed.tree-nuts.almond",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Natural Cocoa Powder is commonly served with published cross-domain ingredients in marzipan, frangipane, and nut dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "natural-cocoa-powder",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Natural Cocoa Powder is commonly served with published cross-domain ingredients in miso-glaze and sweet-savory fish applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "palm-sugar",
    "target": "food.nut-seed.peanuts.peanut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Palm Sugar is commonly served with published cross-domain ingredients in confection, brittle, and American dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "palm-sugar",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Palm Sugar is commonly served with published cross-domain ingredients in barbecue and molasses-style braise glazes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "palm-syrup",
    "target": "food.nut-seed.edible-seeds.sesame",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Palm Syrup is commonly served with published cross-domain ingredients in halva, brittle, and Middle Eastern sweet applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "palm-syrup",
    "target": "food.protein.charcuterie.prosciutto",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Palm Syrup is commonly served with published cross-domain ingredients in melon, fig, and sweet-savory appetizer service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "panela",
    "target": "food.cheese.bloomy-rind.brie-de-meaux",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Panela is commonly served with published cross-domain ingredients in cheese boards and fruit-glazed service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "panela",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Panela is commonly served with published cross-domain ingredients in sweet chili and tropical glaze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "piloncillo",
    "target": "food.cheese.blue.gorgonzola",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Piloncillo is commonly served with published cross-domain ingredients in blue-cheese and honey dessert pairings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "piloncillo",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Piloncillo is commonly served with published cross-domain ingredients in Middle Eastern pomegranate and honey glaze service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raw-cacao",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Raw Cacao is commonly served with published cross-domain ingredients in Mediterranean honey-and-cheese mezze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raw-cacao",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Raw Cacao is commonly served with published cross-domain ingredients in carrot cake and root-vegetable dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raw-sugar",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Raw Sugar is commonly served with published cross-domain ingredients in chevre and honey dessert combinations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raw-sugar",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Raw Sugar is commonly served with published cross-domain ingredients in caramelized onion and sweet-savory braise applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "red-cocoa-powder",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Red Cocoa Powder is commonly served with published cross-domain ingredients in balsamic and cheese dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "red-cocoa-powder",
    "target": "food.vegetable.alliums.shallot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Red Cocoa Powder is commonly served with published cross-domain ingredients in sweet-sour glaze and confit applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice-syrup",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice Syrup is commonly served with published cross-domain ingredients in baking and pastry base formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice-syrup",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice Syrup is commonly served with published cross-domain ingredients in sweet tomato jam and chutney applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rock-sugar",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rock Sugar is commonly served with published cross-domain ingredients in granola, crumble, and breakfast baking."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rock-sugar",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rock Sugar is commonly served with published cross-domain ingredients in sweet-savory salad and spanakopita-adjacent applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "roasted-cacao-nibs",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Roasted Cacao Nibs is commonly served with published cross-domain ingredients in rice pudding and Asian sweet dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "roasted-cacao-nibs",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Roasted Cacao Nibs is commonly served with published cross-domain ingredients in Asian sweet-savory glaze and stir-fry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ruby-cacao",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Ruby Cacao is commonly served with published cross-domain ingredients in glaze and barbecue sweet-savory applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ruby-cacao",
    "target": "food.herb.fresh-herbs.mint",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Ruby Cacao is commonly served with published cross-domain ingredients in chocolate-mint and herbal dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "saccharin",
    "target": "food.protein.poultry.chicken-thigh",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Saccharin is commonly served with published cross-domain ingredients in teriyaki and sweet-savory glaze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "saccharin",
    "target": "food.herb.fresh-herbs.basil",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Saccharin is commonly served with published cross-domain ingredients in strawberry-basil and modern dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sorbitol",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sorbitol is commonly served with published cross-domain ingredients in miso-glaze and sweet-savory fish applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sorbitol",
    "target": "food.herb.dried-herbs.rosemary",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sorbitol is commonly served with published cross-domain ingredients in honey-rosemary and shortbread applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sorghum-syrup",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sorghum Syrup is commonly served with published cross-domain ingredients in barbecue and molasses-style braise glazes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sorghum-syrup",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sorghum Syrup is commonly served with published cross-domain ingredients in black-garlic and sweet-savory glaze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "stevia",
    "target": "food.protein.charcuterie.prosciutto",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Stevia is commonly served with published cross-domain ingredients in melon, fig, and sweet-savory appetizer service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "stevia",
    "target": "food.vegetable.nightshades.eggplant",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Stevia is commonly served with published cross-domain ingredients in candied and Middle Eastern sweet eggplant applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sucralose",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sucralose is commonly served with published cross-domain ingredients in sweet chili and tropical glaze applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sucralose",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sucralose is commonly served with published cross-domain ingredients in glaze and sweet-savory roast applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tagatose",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tagatose is commonly served with published cross-domain ingredients in Middle Eastern pomegranate and honey glaze service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tagatose",
    "target": "food.fruit.berries.strawberry",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tagatose is commonly served with published cross-domain ingredients in strawberry dessert and pastry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "toasted-cacao",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Toasted Cacao is commonly served with published cross-domain ingredients in carrot cake and root-vegetable dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "toasted-cacao",
    "target": "food.fruit.citrus.lemon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Toasted Cacao is commonly served with published cross-domain ingredients in citrus dessert and glaze balancing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "treacle",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Treacle is commonly served with published cross-domain ingredients in caramelized onion and sweet-savory braise applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "treacle",
    "target": "food.fruit.citrus.orange",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Treacle is commonly served with published cross-domain ingredients in marmalade and citrus confection contexts."
  },
  {
    "relationship": "commonly_served_with",
    "source": "turbinado-sugar",
    "target": "food.vegetable.alliums.shallot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Turbinado Sugar is commonly served with published cross-domain ingredients in sweet-sour glaze and confit applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "turbinado-sugar",
    "target": "food.fruit.pomes.apple",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Turbinado Sugar is commonly served with published cross-domain ingredients in pie, tart, and autumn baking applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "xylitol",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Xylitol is commonly served with published cross-domain ingredients in sweet tomato jam and chutney applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "xylitol",
    "target": "food.fruit.processed-fruits.raisin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Xylitol is commonly served with published cross-domain ingredients in fruitcake and spiced baking combinations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "yacon-syrup",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Yacon Syrup is commonly served with published cross-domain ingredients in sweet-savory salad and spanakopita-adjacent applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "yacon-syrup",
    "target": "food.fruit.tropical-fruits.coconut",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Yacon Syrup is commonly served with published cross-domain ingredients in tropical dessert and confection applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-sugar",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coconut Sugar is commonly served with published cross-domain ingredients in Asian sweet-savory glaze and stir-fry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-sugar",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coconut Sugar is commonly served with published cross-domain ingredients in spice-forward baking and beverage sweetening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "defatted-cocoa-powder",
    "target": "food.herb.fresh-herbs.mint",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Defatted Cocoa Powder is commonly served with published cross-domain ingredients in chocolate-mint and herbal dessert applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "defatted-cocoa-powder",
    "target": "food.herb.whole-spices.vanilla-bean",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Defatted Cocoa Powder is commonly served with published cross-domain ingredients in classic dessert and custard sweetening."
  }
];
