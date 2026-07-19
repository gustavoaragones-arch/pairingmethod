/**
 * FOOD-06D — Curated editorial relationship seed data.
 * Tier A: similar_to, substitutes_for
 * Tier B: commonly_served_with (intra-domain)
 * Tier C: commonly_served_with (cross-domain forward references)
 *
 * Association Rule: edges describe ingredient compatibility, not dish composition.
 *
 * @typedef {object} EditorialSeed
 * @property {string} relationship
 * @property {string} source slug
 * @property {string} target slug or forward canonical ID
 * @property {"high"} confidence
 * @property {"A"|"B"|"C"} editorial_tier
 * @property {"approved"|"pending"} editorial_review
 * @property {string} evidence
 */

/** Forward references to published or not-yet-published domains — canonical IDs only. */
export const FORWARD_REFERENCE_IDS = new Set([
  "food.cheese.parmigiano_reggiano",
  "food.cheese.hard.parmigiano-reggiano",
  "food.cheese.brined.feta",
  "food.cheese.fresh.mozzarella-fior-di-latte",
  "food.cheese.blue.gorgonzola",
  "food.herb.basil",
  "food.herb.rosemary",
  "food.herb.thyme",
  "food.herb.oregano",
  "food.herb.parsley",
  "food.herb.cilantro",
  "food.herb.dill",
  "food.herb.tarragon",
  "food.herb.ginger",
  "food.spice.cumin",
  "food.spice.black_pepper",
  "food.protein.chicken",
  "food.protein.poultry.chicken-breast",
  "food.protein.poultry.chicken-thigh",
  "food.protein.beef.brisket",
  "food.protein.beef.ribeye",
  "food.protein.pork.pork-loin",
  "food.protein.lamb.lamb-leg",
  "food.protein.fin-fish.salmon-fillet",
  "food.protein.crustaceans.shrimp",
  "food.protein.mollusks.clam",
  "food.vegetable.alliums.onion",
  "food.vegetable.alliums.garlic",
  "food.vegetable.alliums.shallot",
  "food.vegetable.green-vegetables.asparagus",
  "food.vegetable.green-vegetables.spinach",
  "food.vegetable.root-vegetables-squash.carrot",
  "food.vegetable.nightshades.tomato",
  "food.sauce.pesto",
  "food.sauce.salsa_verde",
]);

/** @type {EditorialSeed[]} */
export const EDITORIAL_CURATED = [
  // —— Tier A: similar_to ——
  { relationship: "similar_to", source: "button-mushroom", target: "cremini", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Button mushroom and cremini are Agaricus bisporus at different maturity stages with interchangeable sauté and soup roles." },
  { relationship: "similar_to", source: "cremini", target: "portobello", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Cremini and portobello are the same Agaricus bisporus species expressed as juvenile and mature cap forms." },
  { relationship: "similar_to", source: "button-mushroom", target: "portobello", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Button mushroom and portobello share Agaricus bisporus lineage in everyday and grill-cap applications." },
  { relationship: "similar_to", source: "king-oyster", target: "oyster-mushroom", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "King oyster and oyster mushroom are Pleurotus species with overlapping stir-fry, roast, and broil applications." },
  { relationship: "similar_to", source: "elm-oyster-mushroom", target: "oyster-mushroom", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Elm oyster and oyster mushroom are Pleurotus varieties used interchangeably in pan and wok cookery." },
  { relationship: "similar_to", source: "black-truffle", target: "white-truffle", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Black truffle and white truffle occupy the same luxury truffle finishing role despite distinct aroma profiles." },
  { relationship: "similar_to", source: "black-truffle", target: "summer-truffle", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Black truffle and summer truffle share shaved-truffle garnish and aromatic finishing applications." },
  { relationship: "similar_to", source: "bianchetto-truffle", target: "white-truffle", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Bianchetto and white truffle are both pale Tuber species used as aromatic finishing truffles." },
  { relationship: "similar_to", source: "black-trumpet", target: "chanterelle", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Black trumpet and chanterelle are forest mushrooms paired in European wild-mushroom medleys with complementary earth and fruit notes." },
  { relationship: "similar_to", source: "chanterelle", target: "hedgehog-mushroom", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Chanterelle and hedgehog mushroom share golden forest-mushroom character in sauté and sauce applications." },
  { relationship: "similar_to", source: "beech-mushroom", target: "enoki", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Beech mushroom and enoki are small cluster cultivated mushrooms in hot pot, soup, and garnish service." },
  { relationship: "similar_to", source: "maitake", target: "shiitake", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Maitake and shiitake are umami-forward cultivated mushrooms in Japanese and pan-Asian savory cookery." },

  // —— Tier A: substitutes_for ——
  { relationship: "substitutes_for", source: "cremini", target: "button-mushroom", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Cremini substitutes for button mushroom when slightly deeper flavor and brown cap color are acceptable." },
  { relationship: "substitutes_for", source: "button-mushroom", target: "cremini", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Button mushroom substitutes for cremini in everyday sauté and stuffing when brown caps are unavailable." },
  { relationship: "substitutes_for", source: "cremini", target: "portobello", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Cremini substitutes for portobello when a smaller cap format is needed in stuffed-mushroom applications." },
  { relationship: "substitutes_for", source: "portobello", target: "cremini", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Portobello substitutes for cremini when a large meaty cap is required for grill or broil service." },
  { relationship: "substitutes_for", source: "button-mushroom", target: "portobello", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Button mushroom substitutes for portobello in diced applications when mature caps are unavailable." },
  { relationship: "substitutes_for", source: "king-oyster", target: "oyster-mushroom", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "King oyster substitutes for oyster mushroom when a firm stem-forward Pleurotus texture is preferred." },
  { relationship: "substitutes_for", source: "oyster-mushroom", target: "king-oyster", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Oyster mushroom substitutes for king oyster in stir-fry when flat cap clusters are preferred." },
  { relationship: "substitutes_for", source: "elm-oyster-mushroom", target: "oyster-mushroom", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Elm oyster substitutes for oyster mushroom as an interchangeable Pleurotus in pan and soup cookery." },
  { relationship: "substitutes_for", source: "straw-mushroom", target: "button-mushroom", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Straw mushroom substitutes for button mushroom in Southeast Asian stir-fry when canned straw mushrooms are used." },
  { relationship: "substitutes_for", source: "wine-cap-mushroom", target: "portobello", confidence: "high", editorial_tier: "A", editorial_review: "approved", evidence: "Wine cap mushroom substitutes for portobello in grill and roast cap applications with similar meaty texture." },

  // —— Tier B: commonly_served_with (intra-domain) ——
  { relationship: "commonly_served_with", source: "porcini", target: "chanterelle", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Porcini and chanterelle combine in mixed wild-mushroom sautés across Italian and French cookery." },
  { relationship: "commonly_served_with", source: "porcini", target: "morel", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Porcini and morel share forest-mushroom medley compositions in spring and autumn preparations." },
  { relationship: "commonly_served_with", source: "chanterelle", target: "morel", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Chanterelle and morel are paired in luxury wild-mushroom mixes with complementary golden and honeycomb textures." },
  { relationship: "commonly_served_with", source: "black-trumpet", target: "porcini", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Black trumpet and porcini combine in French forest-mushroom sauces with layered earth and umami depth." },
  { relationship: "commonly_served_with", source: "black-trumpet", target: "chanterelle", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Black trumpet and chanterelle are classic partners in Provençal and Burgundian wild-mushroom preparations." },
  { relationship: "commonly_served_with", source: "black-trumpet", target: "morel", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Black trumpet and morel share composed wild-mushroom service with complementary dark and honeycomb forms." },
  { relationship: "commonly_served_with", source: "hedgehog-mushroom", target: "black-trumpet", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Hedgehog mushroom and black trumpet combine in Pacific Northwest and European wild-mushroom mixes." },
  { relationship: "commonly_served_with", source: "saffron-milk-cap", target: "chanterelle", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Saffron milk cap and chanterelle are paired in Mediterranean forest-mushroom foraging cookery." },
  { relationship: "commonly_served_with", source: "lobster-mushroom", target: "chanterelle", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Lobster mushroom and chanterelle combine in colorful wild-mushroom sautés with contrasting orange tones." },
  { relationship: "commonly_served_with", source: "black-truffle", target: "porcini", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Black truffle and porcini are paired as complementary luxury forest fungi in shaved and diced finishing." },
  { relationship: "commonly_served_with", source: "porcini", target: "white-truffle", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Porcini and white truffle combine in Piedmontese forest-fungi service with layered umami and aroma." },
  { relationship: "commonly_served_with", source: "black-truffle", target: "white-truffle", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Black truffle and white truffle appear together in comparative truffle service and mixed aromatic finishing." },
  { relationship: "commonly_served_with", source: "bianchetto-truffle", target: "black-truffle", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Bianchetto and black truffle share winter truffle finishing on eggs, cheese, and root vegetables." },
  { relationship: "commonly_served_with", source: "summer-truffle", target: "black-truffle", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Summer truffle and black truffle are paired when extending truffle season across warm and cool months." },
  { relationship: "commonly_served_with", source: "shiitake", target: "maitake", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Shiitake and maitake are standard partners in Japanese mushroom dashi and nimono preparations." },
  { relationship: "commonly_served_with", source: "enoki", target: "shiitake", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Enoki and shiitake combine in hot pot and soup with contrasting delicate and meaty mushroom textures." },
  { relationship: "commonly_served_with", source: "maitake", target: "enoki", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Maitake and enoki share Japanese and Korean hot-pot mushroom assortments." },
  { relationship: "commonly_served_with", source: "nameko", target: "shiitake", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Nameko and shiitake are paired in miso soup and nimono with complementary slippery and firm textures." },
  { relationship: "commonly_served_with", source: "pioppino", target: "shiitake", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Pioppino and shiitake combine in Italian-Japanese fusion mushroom sautés with nutty and umami depth." },
  { relationship: "commonly_served_with", source: "matsutake", target: "shiitake", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Matsutake and shiitake are paired in Japanese autumn mushroom service including chawanmushi aromatics." },
  { relationship: "commonly_served_with", source: "porcini", target: "matsutake", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Porcini and matsutake combine in luxury composed mushroom service with distinct European and Japanese forest character." },
  { relationship: "commonly_served_with", source: "oyster-mushroom", target: "shiitake", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Oyster mushroom and shiitake are standard partners in East Asian stir-fried mushroom mixes." },
  { relationship: "commonly_served_with", source: "shiitake", target: "wood-ear", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Shiitake and wood ear combine in Chinese moo shu and stir-fry with contrasting chewy and crisp textures." },
  { relationship: "commonly_served_with", source: "king-oyster", target: "portobello", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "King oyster and portobello share grill-platter mushroom service with meaty cap and stem character." },
  { relationship: "commonly_served_with", source: "coral-tooth-mushroom", target: "lions-mane", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Coral tooth mushroom and lion's mane combine in specialty mushroom sautés with distinctive coral and shag textures." },
  { relationship: "commonly_served_with", source: "almond-mushroom", target: "button-mushroom", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Almond mushroom and button mushroom are paired in cultivated mushroom medleys with nutty and neutral base notes." },
  { relationship: "commonly_served_with", source: "button-mushroom", target: "cremini", confidence: "high", editorial_tier: "B", editorial_review: "approved", evidence: "Button mushroom and cremini combine in mixed Agaricus sautés with graduated cap color and flavor." },

  // —— Tier C: commonly_served_with (cross-domain forward references) ——
  { relationship: "commonly_served_with", source: "porcini", target: "food.vegetable.alliums.onion", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Porcini and onion are foundational partners in Italian and French mushroom sauté bases." },
  { relationship: "commonly_served_with", source: "porcini", target: "food.vegetable.alliums.garlic", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Porcini and garlic build the aromatic base of Tuscan and Alpine mushroom preparations." },
  { relationship: "commonly_served_with", source: "porcini", target: "food.herb.thyme", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Porcini and thyme are paired in Provençal and Italian forest-mushroom cookery." },
  { relationship: "commonly_served_with", source: "porcini", target: "food.herb.parsley", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Porcini and parsley finish Central European and Italian mushroom sauces and sautés." },
  { relationship: "commonly_served_with", source: "porcini", target: "food.cheese.hard.parmigiano-reggiano", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Porcini and Parmigiano-Reggiano are a defining umami pairing in Northern Italian ingredient service." },
  { relationship: "commonly_served_with", source: "porcini", target: "food.protein.beef.brisket", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Porcini and beef brisket share Central European braise and roast bed compositions." },
  { relationship: "commonly_served_with", source: "porcini", target: "food.protein.beef.ribeye", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Porcini and ribeye are paired in Tuscan tagliata-style composed plates with shaved mushroom garnish." },
  { relationship: "commonly_served_with", source: "porcini", target: "food.protein.pork.pork-loin", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Porcini and pork loin combine in roast bed and pan sauce preparations across Central Europe." },
  { relationship: "commonly_served_with", source: "shiitake", target: "food.vegetable.alliums.garlic", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Shiitake and garlic are the foundational aromatic pair in East Asian mushroom stir-fry and braise." },
  { relationship: "commonly_served_with", source: "shiitake", target: "food.vegetable.alliums.onion", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Shiitake and onion combine in Japanese and Chinese mushroom stir-fry bases." },
  { relationship: "commonly_served_with", source: "shiitake", target: "food.herb.ginger", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Shiitake and ginger form the aromatic base of East Asian mushroom and vegetable cookery." },
  { relationship: "commonly_served_with", source: "shiitake", target: "food.protein.chicken", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Shiitake and chicken are paired in Japanese and Chinese steamed and braised preparations." },
  { relationship: "commonly_served_with", source: "shiitake", target: "food.protein.poultry.chicken-breast", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Shiitake and chicken breast combine in East Asian stir-fry and steam applications." },
  { relationship: "commonly_served_with", source: "shiitake", target: "food.spice.black_pepper", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Shiitake and black pepper season pan-seared mushroom applications across Asian and Western cookery." },
  { relationship: "commonly_served_with", source: "maitake", target: "food.vegetable.alliums.garlic", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Maitake and garlic are paired in Japanese and American roast mushroom preparations." },
  { relationship: "commonly_served_with", source: "maitake", target: "food.protein.chicken", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Maitake and chicken combine in Japanese hot pot and American roast poultry accompaniments." },
  { relationship: "commonly_served_with", source: "morel", target: "food.vegetable.green-vegetables.asparagus", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Morel and asparagus are classic spring ingredient partners in French and American seasonal cookery." },
  { relationship: "commonly_served_with", source: "morel", target: "food.vegetable.alliums.onion", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Morel and onion share spring sauté and cream sauce bases in French and Midwestern cookery." },
  { relationship: "commonly_served_with", source: "morel", target: "food.herb.thyme", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Morel and thyme are paired in French forest-mushroom and spring vegetable preparations." },
  { relationship: "commonly_served_with", source: "morel", target: "food.protein.poultry.chicken-breast", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Morel and chicken breast combine in spring bistro and cream sauce preparations." },
  { relationship: "commonly_served_with", source: "chanterelle", target: "food.vegetable.alliums.garlic", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Chanterelle and garlic anchor European wild-mushroom sauté bases from Scandinavia to Provence." },
  { relationship: "commonly_served_with", source: "chanterelle", target: "food.herb.thyme", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Chanterelle and thyme are paired in French and Nordic forest-mushroom cookery." },
  { relationship: "commonly_served_with", source: "chanterelle", target: "food.herb.tarragon", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Chanterelle and tarragon combine in classic French mushroom and poultry sauce aromatics." },
  { relationship: "commonly_served_with", source: "chanterelle", target: "food.protein.poultry.chicken-breast", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Chanterelle and chicken breast are paired in French and Scandinavian composed spring plates." },
  { relationship: "commonly_served_with", source: "chanterelle", target: "food.cheese.hard.parmigiano-reggiano", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Chanterelle and Parmigiano finish Northern Italian and Alpine mushroom preparations." },
  { relationship: "commonly_served_with", source: "black-trumpet", target: "food.vegetable.alliums.onion", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Black trumpet and onion combine in Burgundian and Provençal mushroom sauce bases." },
  { relationship: "commonly_served_with", source: "button-mushroom", target: "food.vegetable.alliums.onion", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Button mushroom and onion are universal partners in pan sauces, stuffings, and sauté bases." },
  { relationship: "commonly_served_with", source: "portobello", target: "food.vegetable.alliums.onion", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Portobello and onion combine in grill and roast mushroom preparations worldwide." },
  { relationship: "commonly_served_with", source: "portobello", target: "food.herb.rosemary", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Portobello and rosemary are paired in Mediterranean roast mushroom and grill applications." },
  { relationship: "commonly_served_with", source: "portobello", target: "food.protein.beef.brisket", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Portobello and beef brisket share composed roast and smoke-platter ingredient pairings." },
  { relationship: "commonly_served_with", source: "oyster-mushroom", target: "food.vegetable.alliums.garlic", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Oyster mushroom and garlic are paired in Chinese and Southeast Asian stir-fry mushroom bases." },
  { relationship: "commonly_served_with", source: "matsutake", target: "food.herb.ginger", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Matsutake and ginger combine in Japanese autumn mushroom and dashi aromatics." },
  { relationship: "commonly_served_with", source: "white-truffle", target: "food.cheese.hard.parmigiano-reggiano", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "White truffle and Parmigiano-Reggiano define the canonical Piedmontese luxury ingredient pair." },
  { relationship: "commonly_served_with", source: "black-truffle", target: "food.cheese.hard.parmigiano-reggiano", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Black truffle and Parmigiano-Reggiano are paired in shaved truffle and aged cheese finishing." },
  { relationship: "commonly_served_with", source: "black-truffle", target: "food.herb.parsley", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Black truffle and parsley finish European truffle service on eggs and root vegetables." },
  { relationship: "commonly_served_with", source: "chicken-of-the-woods", target: "food.protein.chicken", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Chicken of the woods and chicken share poultry-adjacent flavor pairings in American and European foraged cookery." },
  { relationship: "commonly_served_with", source: "lobster-mushroom", target: "food.protein.fin-fish.salmon-fillet", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "Lobster mushroom and salmon combine in Pacific Northwest composed fish and foraged mushroom service." },
  { relationship: "commonly_served_with", source: "king-oyster", target: "food.vegetable.alliums.garlic", confidence: "high", editorial_tier: "C", editorial_review: "approved", evidence: "King oyster and garlic are paired in Korean and Chinese pan-seared mushroom preparations." },
];
