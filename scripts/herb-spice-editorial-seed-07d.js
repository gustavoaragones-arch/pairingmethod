/**
 * FOOD-07D — Curated editorial relationship seed data.
 * Tier A: similar_to, substitutes_for
 * Tier B: commonly_served_with (intra-domain)
 * Tier C: commonly_served_with (cross-domain forward references)
 *
 * Botanical Editorial Rule: cilantro/coriander seed and dill/dill seed
 * must not be treated as interchangeable in Tier A relationships.
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

/** Forward references to published domains — canonical IDs only. */
export const FORWARD_REFERENCE_IDS = new Set([
  "food.cheese.brined.feta",
  "food.cheese.fresh.goat-chevre-log",
  "food.cheese.hard.parmigiano-reggiano",
  "food.fungi.cultivated-mushrooms.shiitake",
  "food.fungi.wild-mushrooms.chanterelle",
  "food.fungi.wild-mushrooms.porcini",
  "food.protein.beef.brisket",
  "food.protein.beef.ribeye",
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
    "source": "black-pepper",
    "target": "white-pepper",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Black pepper and white pepper share Piper nigrum lineage with overlapping seasoning roles despite different fermentation and color."
  },
  {
    "relationship": "similar_to",
    "source": "oregano",
    "target": "marjoram",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Oregano and marjoram are closely related Origanum herbs with interchangeable dried-herb roles in Mediterranean cookery."
  },
  {
    "relationship": "similar_to",
    "source": "marjoram",
    "target": "oregano",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Marjoram and oregano share sweet herbal character in tomato sauces, roast poultry, and Greek seasoning."
  },
  {
    "relationship": "similar_to",
    "source": "thyme",
    "target": "rosemary",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Thyme and rosemary are resinous Mediterranean herbs paired in roast and braise aromatics with overlapping woody profiles."
  },
  {
    "relationship": "similar_to",
    "source": "rosemary",
    "target": "thyme",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Rosemary and thyme combine in Provençal and Italian herb mixes with complementary pine and earth notes."
  },
  {
    "relationship": "similar_to",
    "source": "cumin-seed",
    "target": "caraway-seed",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cumin seed and caraway seed share warm earthy seed-spice character in Central European and Indian tempering — similarity only, not automatic substitution."
  },
  {
    "relationship": "similar_to",
    "source": "caraway-seed",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Caraway seed and cumin seed overlap in rye bread and Eastern European spice profiles with distinct but related aroma."
  },
  {
    "relationship": "similar_to",
    "source": "mexican-oregano",
    "target": "oregano",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Mexican oregano and Mediterranean oregano occupy similar dried-herb seasoning roles in tomato and chili preparations."
  },
  {
    "relationship": "similar_to",
    "source": "summer-savory",
    "target": "winter-savory",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Summer savory and winter savory are Satureja species with overlapping peppery bean and grill seasoning applications."
  },
  {
    "relationship": "similar_to",
    "source": "green-cardamom",
    "target": "black-cardamom",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Green cardamom and black cardamom are Elettaria and Amomum pods used in distinct but related Indian aromatic spice roles."
  },
  {
    "relationship": "similar_to",
    "source": "ancho-chile-powder",
    "target": "chipotle-powder",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Ancho chile powder and chipotle powder are dried capsicum powders with overlapping Mexican sauce and rub applications."
  },
  {
    "relationship": "similar_to",
    "source": "paprika",
    "target": "cayenne-pepper",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Paprika and cayenne pepper are capsicum powders used in heat-layered seasoning — related but not identical heat profiles."
  },
  {
    "relationship": "similar_to",
    "source": "turmeric",
    "target": "curry-powder",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Turmeric and curry powder share golden spice character — turmeric is a primary component of many curry powder blends."
  },
  {
    "relationship": "similar_to",
    "source": "garam-masala",
    "target": "curry-powder",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Garam masala and curry powder are Indian spice blends with overlapping warm aromatic finishing roles."
  },
  {
    "relationship": "similar_to",
    "source": "herbes-de-provence",
    "target": "quatre-epices",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Herbes de Provence and quatre épices are French aromatic blends used in roast and charcuterie seasoning."
  },
  {
    "relationship": "similar_to",
    "source": "dill",
    "target": "fennel-frond",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Dill and fennel frond share mild anise-herb garnish character in seafood and Scandinavian preparations — distinct botanical forms."
  },
  {
    "relationship": "similar_to",
    "source": "mint",
    "target": "lemon-balm",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Mint and lemon balm share cooling herbal aroma in teas, salads, and Middle Eastern garnish service."
  },
  {
    "relationship": "similar_to",
    "source": "parsley",
    "target": "chervil",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Parsley and chervil are fines herbs with overlapping fresh finishing roles in French and European cookery."
  },
  {
    "relationship": "similar_to",
    "source": "saffron",
    "target": "turmeric",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Saffron and turmeric both provide golden color in rice and stew — saffron is luxury aroma; turmeric is earthy warmth."
  },
  {
    "relationship": "similar_to",
    "source": "vanilla-bean",
    "target": "cinnamon",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Vanilla bean and cinnamon share warm sweet spice character in baking and dessert spice blends."
  },
  {
    "relationship": "substitutes_for",
    "source": "white-pepper",
    "target": "black-pepper",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "White pepper substitutes for black pepper in light-colored sauces where dark specks must be avoided."
  },
  {
    "relationship": "substitutes_for",
    "source": "marjoram",
    "target": "oregano",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Marjoram substitutes for oregano when a milder sweet herbal note is preferred in tomato and roast applications."
  },
  {
    "relationship": "substitutes_for",
    "source": "oregano",
    "target": "marjoram",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Oregano substitutes for marjoram when a bolder Mediterranean herbal note is needed."
  },
  {
    "relationship": "substitutes_for",
    "source": "mexican-oregano",
    "target": "oregano",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Mexican oregano substitutes for Mediterranean oregano in Tex-Mex and Latin American chili preparations."
  },
  {
    "relationship": "substitutes_for",
    "source": "summer-savory",
    "target": "winter-savory",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Summer savory substitutes for winter savory in bean and sausage seasonings when milder peppery notes are preferred."
  },
  {
    "relationship": "substitutes_for",
    "source": "winter-savory",
    "target": "summer-savory",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Winter savory substitutes for summer savory when a stronger pepper-pine herbal note is needed."
  },
  {
    "relationship": "substitutes_for",
    "source": "chipotle-powder",
    "target": "cayenne-pepper",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Chipotle powder substitutes for cayenne when smoky heat rather than pure capsaicin is acceptable."
  },
  {
    "relationship": "substitutes_for",
    "source": "cayenne-pepper",
    "target": "red-pepper-flakes",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cayenne pepper substitutes for red pepper flakes in spice blends requiring fine uniform heat."
  },
  {
    "relationship": "substitutes_for",
    "source": "red-pepper-flakes",
    "target": "cayenne-pepper",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Red pepper flakes substitute for cayenne when rustic flake texture is preferred."
  },
  {
    "relationship": "substitutes_for",
    "source": "green-cardamom",
    "target": "black-cardamom",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Green cardamom substitutes for black cardamom only in sweet applications — not in smoky dal preparations."
  },
  {
    "relationship": "substitutes_for",
    "source": "turmeric",
    "target": "curry-powder",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Turmeric substitutes for curry powder when golden color and mild warmth are needed without full blend complexity."
  },
  {
    "relationship": "substitutes_for",
    "source": "curry-powder",
    "target": "garam-masala",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Curry powder substitutes for garam masala in Anglo-Indian applications when warm yellow spice is sufficient."
  },
  {
    "relationship": "substitutes_for",
    "source": "ras-el-hanout",
    "target": "baharat",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Ras el hanout substitutes for baharat in North African tagine seasoning when complex warm spice is required."
  },
  {
    "relationship": "substitutes_for",
    "source": "baharat",
    "target": "ras-el-hanout",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Baharat substitutes for ras el hanout in Levantine grilled meat rubs with overlapping seven-spice character."
  },
  {
    "relationship": "substitutes_for",
    "source": "herbes-de-provence",
    "target": "quatre-epices",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Herbes de Provence substitutes for quatre épices in roast poultry when herbal rather than clove-forward spice is preferred."
  },
  {
    "relationship": "substitutes_for",
    "source": "lemon-myrtle",
    "target": "lemongrass",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Lemon myrtle substitutes for lemongrass when intense citrus leaf aroma is needed in Australian and Southeast Asian fusion."
  },
  {
    "relationship": "substitutes_for",
    "source": "vietnamese-coriander",
    "target": "mint",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Vietnamese coriander substitutes for mint in some Southeast Asian herb plate applications — distinct from cilantro leaf identity."
  },
  {
    "relationship": "commonly_served_with",
    "source": "basil",
    "target": "oregano",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Basil and oregano are foundational partners in Italian tomato, pizza, and Mediterranean herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "basil",
    "target": "thyme",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Basil and thyme combine in Provençal and Italian composed herb preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "basil",
    "target": "parsley",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Basil and parsley finish Caprese-adjacent and Mediterranean herb garnishes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "oregano",
    "target": "thyme",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Oregano and thyme define Greek and Italian dried-herb mixes for roast lamb and tomato."
  },
  {
    "relationship": "commonly_served_with",
    "source": "thyme",
    "target": "rosemary",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Thyme and rosemary are classic roast poultry and lamb herb partners across Mediterranean cookery."
  },
  {
    "relationship": "commonly_served_with",
    "source": "thyme",
    "target": "sage",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Thyme and sage combine in poultry stuffing and Thanksgiving herb blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rosemary",
    "target": "sage",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rosemary and sage share roast pork and poultry aromatic bases in European cookery."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sage",
    "target": "marjoram",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Sage and marjoram combine in Italian saltimbocca and brown butter herb finishes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "bay-leaf",
    "target": "thyme",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Bay leaf and thyme anchor French and European braise and stock aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "bay-leaf",
    "target": "parsley",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Bay leaf and parsley finish bouquet garni and European soup bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "parsley",
    "target": "chives",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Parsley and chives are classic fines-herb partners for eggs, potatoes, and fish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "parsley",
    "target": "dill",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Parsley and dill combine in Scandinavian and Eastern European fish and potato garnishes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dill",
    "target": "chives",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dill and chives finish gravlax, smørrebrød, and Nordic cold fish preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mint",
    "target": "parsley",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Mint and parsley combine in Middle Eastern tabbouleh and herb salad compositions."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cilantro",
    "target": "mint",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cilantro and mint are paired in Indian raita, chutney, and Southeast Asian herb garnishes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cilantro",
    "target": "parsley",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cilantro and parsley combine in Latin American and Middle Eastern fresh herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tarragon",
    "target": "chervil",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Tarragon and chervil are fines herbs in French omelet and sauce aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tarragon",
    "target": "chives",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Tarragon and chives finish béarnaise-adjacent and French egg preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemongrass",
    "target": "ginger",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Lemongrass and ginger form the aromatic base of Thai curry paste and Southeast Asian broths."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemongrass",
    "target": "kaffir-lime-leaves",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Lemongrass and kaffir lime leaves define Thai tom yum and curry aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kaffir-lime-leaves",
    "target": "galangal",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Kaffir lime leaves and galangal combine in Thai and Indonesian curry paste bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ginger",
    "target": "turmeric",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Ginger and turmeric are paired in Indian curry bases and golden milk preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ginger",
    "target": "garlic-chives",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Ginger and garlic chives combine in Chinese dumpling and stir-fry aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cumin-seed",
    "target": "coriander-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cumin seed and coriander seed are the defining pair in Indian garam masala and global curry tempering."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cumin-seed",
    "target": "fennel-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cumin seed and fennel seed combine in Panch phoron and Indian five-spice tempering."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coriander-seed",
    "target": "mustard-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Coriander seed and mustard seed are paired in Indian pickle and Bengali panch phoron blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cinnamon",
    "target": "nutmeg",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cinnamon and nutmeg define baking spice and mulled wine aromatic pairs worldwide."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cinnamon",
    "target": "clove",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cinnamon and clove combine in holiday baking, pho spice, and Chinese five-spice components."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cinnamon",
    "target": "green-cardamom",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cinnamon and green cardamom anchor chai masala and Nordic baking spice blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "nutmeg",
    "target": "clove",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Nutmeg and clove share béchamel, eggnog, and spice cake aromatic roles."
  },
  {
    "relationship": "commonly_served_with",
    "source": "nutmeg",
    "target": "mace",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Nutmeg and mace are the same Myristica species expressed as seed and aril in baking spice."
  },
  {
    "relationship": "commonly_served_with",
    "source": "clove",
    "target": "star-anise",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Clove and star anise combine in Chinese five-spice and pho broth aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "star-anise",
    "target": "cinnamon",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Star anise and cinnamon define Chinese braised meat and five-spice powder character."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-pepper",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Black pepper and cumin seed combine in Indian and Middle Eastern savory spice blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-pepper",
    "target": "coriander-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Black pepper and coriander seed finish steak rubs and global savory seasoning blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-pepper",
    "target": "mustard-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Black pepper and mustard seed combine in pickling spice and steakhouse seasoning."
  },
  {
    "relationship": "commonly_served_with",
    "source": "paprika",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Paprika and cumin seed define Hungarian goulash and Spanish pimentón spice bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "paprika",
    "target": "oregano",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Paprika and oregano combine in Spanish sofrito and Hungarian paprikash aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "turmeric",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Turmeric and cumin seed anchor Indian curry powder and dal tempering."
  },
  {
    "relationship": "commonly_served_with",
    "source": "turmeric",
    "target": "coriander-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Turmeric and coriander seed combine in South Asian curry and pickle spice blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "turmeric",
    "target": "ginger",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Turmeric and ginger form the golden aromatic base of Indian and Southeast Asian curries."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cayenne-pepper",
    "target": "paprika",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cayenne pepper and paprika layer heat and color in Cajun and Southwestern seasoning."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chili-powder",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Chili powder and cumin seed define Tex-Mex taco and chili seasoning bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "garam-masala",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Garam masala and cumin seed combine in North Indian curry finishing and dal tempering."
  },
  {
    "relationship": "commonly_served_with",
    "source": "garam-masala",
    "target": "coriander-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Garam masala and coriander seed share Indian curry and biryani aromatic layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "curry-powder",
    "target": "turmeric",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Curry powder and turmeric combine in Anglo-Indian golden curry preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "curry-powder",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Curry powder and cumin seed anchor British-Indian curry spice bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chinese-five-spice",
    "target": "star-anise",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Chinese five spice and star anise share aromatic meat rub and braise applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chinese-five-spice",
    "target": "cinnamon",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Chinese five spice and cinnamon combine in red-braised pork and duck aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "herbes-de-provence",
    "target": "thyme",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Herbes de Provence and thyme combine in Provençal roast and grill herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "herbes-de-provence",
    "target": "rosemary",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Herbes de Provence and rosemary share Mediterranean roast lamb and potato aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "herbes-de-provence",
    "target": "lavender",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Herbes de Provence and lavender combine in Provençal herb blends and roast seasoning."
  },
  {
    "relationship": "commonly_served_with",
    "source": "zaatar",
    "target": "sumac",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Za'atar and sumac combine in Levantine flatbread and labneh herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "zaatar",
    "target": "thyme",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Za'atar and thyme share Levantine manakish and herb oil applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sumac",
    "target": "mint",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Sumac and mint finish fattoush and Middle Eastern salad herb layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ras-el-hanout",
    "target": "cinnamon",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Ras el hanout and cinnamon combine in Moroccan tagine and couscous spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ras-el-hanout",
    "target": "ginger",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Ras el hanout and ginger share North African tagine and preserved lemon aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "baharat",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Baharat and cumin seed combine in Lebanese kibbeh and grilled meat spice rubs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "berbere",
    "target": "ginger",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Berbere and ginger anchor Ethiopian wat and lentil stew spice bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "berbere",
    "target": "fenugreek-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Berbere and fenugreek seed combine in Ethiopian spice blends with layered heat and bitterness."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tandoori-masala",
    "target": "turmeric",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Tandoori masala and turmeric define tandoori chicken rub color and warmth."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tandoori-masala",
    "target": "kashmiri-chili",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Tandoori masala and Kashmiri chili combine in tandoori and tikka rub applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "panch-phoron",
    "target": "mustard-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Panch phoron and mustard seed share Bengali tempering and pickle spice character."
  },
  {
    "relationship": "commonly_served_with",
    "source": "panch-phoron",
    "target": "fenugreek-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Panch phoron and fenugreek seed combine in Bengali dal and vegetable tempering."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dukkah",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dukkah and cumin seed combine in Egyptian nut-spice dip and crust applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dukkah",
    "target": "coriander-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dukkah and coriander seed share Egyptian bread-dipping spice blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wasabi",
    "target": "ginger",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Wasabi and ginger accompany sushi and sashimi with complementary pungent and clean heat."
  },
  {
    "relationship": "commonly_served_with",
    "source": "horseradish",
    "target": "mustard-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Horseradish and mustard seed combine in cocktail sauce and roast beef condiment service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "saffron",
    "target": "vanilla-bean",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Saffron and vanilla bean combine in Persian and European luxury dessert and rice aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "vanilla-bean",
    "target": "cinnamon",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Vanilla bean and cinnamon define baking spice and poached fruit aromatic pairs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "juniper-berry",
    "target": "caraway-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Juniper berry and caraway seed combine in German sauerkraut and gin-spice applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "juniper-berry",
    "target": "black-pepper",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Juniper berry and black pepper season game and Nordic cured meat preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fennel-seed",
    "target": "coriander-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Fennel seed and coriander seed combine in Italian sausage and Indian pickle spice."
  },
  {
    "relationship": "commonly_served_with",
    "source": "celery-seed",
    "target": "mustard-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Celery seed and mustard seed combine in pickling spice and Old Bay-style seasoning."
  },
  {
    "relationship": "commonly_served_with",
    "source": "nigella-seed",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Nigella seed and cumin seed combine in Indian naan and Middle Eastern bread toppings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ajwain",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Ajwain and cumin seed combine in Indian paratha and lentil tempering."
  },
  {
    "relationship": "commonly_served_with",
    "source": "asafoetida",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Asafoetida and cumin seed temper together in Indian dal and vegetable preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fenugreek-seed",
    "target": "coriander-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Fenugreek seed and coriander seed combine in Indian curry powder and pickle spice."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tamarind",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Tamarind and cumin seed combine in South Indian sambar and pad thai sour-spice balance."
  },
  {
    "relationship": "commonly_served_with",
    "source": "aleppo-pepper",
    "target": "sumac",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Aleppo pepper and sumac finish Middle Eastern grilled meat and muhammara spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "urfa-biber",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Urfa biber and cumin seed combine in Turkish kebab and eggplant spice rubs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "harissa-spice",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Harissa spice and cumin seed combine in Tunisian paste and North African grill rubs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "jerk-seasoning",
    "target": "allspice",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Jerk seasoning and allspice share Jamaican grill spice with warm aromatic heat."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cajun-seasoning",
    "target": "paprika",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cajun seasoning and paprika combine in Louisiana blackened fish and gumbo spice bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "old-bay-seasoning",
    "target": "celery-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Old Bay seasoning and celery seed combine in Chesapeake seafood boil spice character."
  },
  {
    "relationship": "commonly_served_with",
    "source": "poultry-seasoning",
    "target": "sage",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Poultry seasoning and sage combine in Thanksgiving stuffing and roast turkey rubs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "poultry-seasoning",
    "target": "thyme",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Poultry seasoning and thyme share roast chicken and turkey herb blend applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon-pepper",
    "target": "black-pepper",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Lemon pepper and black pepper season grilled fish and chicken with citrus-pepper lift."
  },
  {
    "relationship": "commonly_served_with",
    "source": "vadouvan",
    "target": "turmeric",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Vadouvan and turmeric combine in French-Indian curry paste with mellow golden spice."
  },
  {
    "relationship": "commonly_served_with",
    "source": "epazote",
    "target": "cilantro",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Epazote and cilantro combine in Mexican bean and quesadilla herb service — distinct from coriander seed."
  },
  {
    "relationship": "commonly_served_with",
    "source": "curry-leaves",
    "target": "mustard-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Curry leaves and mustard seed temper together in South Indian tadka and dal."
  },
  {
    "relationship": "commonly_served_with",
    "source": "indian-bay-leaf",
    "target": "cumin-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Indian bay leaf and cumin seed combine in biryani and dal aromatic layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dill-seed",
    "target": "mustard-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dill seed and mustard seed combine in pickling spice and Eastern European bread seasoning."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dill-seed",
    "target": "coriander-seed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dill seed and coriander seed share pickle and rye bread spice applications — distinct from dill weed."
  },
  {
    "relationship": "commonly_served_with",
    "source": "basil",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Basil and tomato define Caprese and Italian tomato sauce herb finishing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "basil",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Basil and fresh goat cheese combine in salads and Mediterranean composed plates."
  },
  {
    "relationship": "commonly_served_with",
    "source": "basil",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Basil and Parmigiano-Reggiano finish pasta, pesto, and Italian herb-cheese service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "oregano",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Oregano and tomato are foundational partners in Greek and Italian savory cookery."
  },
  {
    "relationship": "commonly_served_with",
    "source": "oregano",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Oregano and feta combine in Greek horiatiki and baked feta preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "thyme",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Thyme and lamb leg share Provençal and British roast herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "thyme",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Thyme and onion combine in French braise and stock aromatic bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rosemary",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rosemary and lamb leg define Mediterranean roast herb pairing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rosemary",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rosemary and pork loin combine in Italian porchetta and roast pork aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rosemary",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rosemary and garlic share roast potato and Mediterranean grill aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sage",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sage and chicken breast combine in saltimbocca and brown butter poultry preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sage",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sage and pork loin are paired in Italian and American roast pork service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "parsley",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Parsley and garlic finish gremolata, chimichurri, and pan sauce herb layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "parsley",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Parsley and salmon combine in herb-crusted and pan-seared fish preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cilantro",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cilantro and tomato combine in Latin American salsa and South Asian chutney — leaf identity, not coriander seed."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cilantro",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cilantro and salmon pair in ceviche-adjacent and Asian herb-crusted fish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cilantro",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cilantro and shrimp combine in Southeast Asian and Latin American composed seafood."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mint",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mint and feta combine in Greek mezze and watermelon-feta herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mint",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mint and lamb leg share British and Middle Eastern roast herb pairing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dill",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Dill and salmon define gravlax and Scandinavian fish herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dill",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Dill and shrimp combine in Nordic and American seafood salad preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tarragon",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tarragon and chicken breast combine in French béarnaise and tarragon chicken preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tarragon",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tarragon and salmon pair in French and Nordic composed fish plates."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chives",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Chives and salmon finish cream sauce and gravlax garnish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chives",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Chives and goat cheese combine in log cheese and brunch herb garnishes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemongrass",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemongrass and shrimp combine in Thai tom yum and Vietnamese shrimp soup aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ginger",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Ginger and chicken breast combine in East Asian stir-fry and steam preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ginger",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Ginger and salmon pair in Japanese and Chinese glazed fish preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ginger",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Ginger and garlic form the aromatic base of East Asian and Indian savory cookery."
  },
  {
    "relationship": "commonly_served_with",
    "source": "turmeric",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Turmeric and chicken combine in Indian curry and Southeast Asian golden braise preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "turmeric",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Turmeric and shrimp combine in South Indian and Malaysian curry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cumin-seed",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cumin seed and lamb leg combine in Middle Eastern and North African roast spice rubs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cumin-seed",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cumin seed and beef brisket share Texas chili and barbecue spice rub applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coriander-seed",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coriander seed and chicken combine in Indian curry and global spice rub applications — seed identity, not cilantro leaf."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coriander-seed",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coriander seed and lamb leg share Moroccan and Indian roast spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cinnamon",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cinnamon and beef brisket combine in Moroccan tagine and Texas chili aromatic layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cinnamon",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cinnamon and lamb leg share Middle Eastern and North African braise spice character."
  },
  {
    "relationship": "commonly_served_with",
    "source": "nutmeg",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Nutmeg and beef brisket combine in European braise and Caribbean spice rub applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "clove",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Clove and pork loin combine in Chinese red braise and holiday ham spice glazes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-pepper",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Black pepper and garlic season pan sauces, steak rubs, and global savory bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-pepper",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Black pepper and ribeye define steak au poivre and classic grill seasoning."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-pepper",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Black pepper and beef brisket combine in barbecue rub and pastrami spice character."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-pepper",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Black pepper and chicken breast season roast and pan-seared poultry worldwide."
  },
  {
    "relationship": "commonly_served_with",
    "source": "white-pepper",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "White pepper and chicken breast combine in French white sauce and Chinese stir-fry seasoning."
  },
  {
    "relationship": "commonly_served_with",
    "source": "paprika",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Paprika and pork loin combine in Hungarian paprikash and Spanish roast pork rubs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "paprika",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Paprika and chicken combine in Spanish and Hungarian paprika-forward poultry preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cayenne-pepper",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cayenne pepper and beef brisket combine in Texas chili and barbecue heat layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chili-powder",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Chili powder and beef brisket define Texas chili and Southwestern braise spice bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "garam-masala",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Garam masala and chicken combine in North Indian curry and tandoori finishing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "garam-masala",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Garam masala and lamb leg share Indian and Pakistani roast curry spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "curry-powder",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Curry powder and chicken combine in British-Indian and Caribbean curry preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "curry-powder",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Curry powder and salmon combine in Anglo-Indian and fusion curry fish applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tandoori-masala",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tandoori masala and chicken breast define tandoori and tikka rub applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "berbere",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Berbere and lamb leg combine in Ethiopian doro wat-adjacent and lamb stew spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ras-el-hanout",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Ras el hanout and lamb leg share Moroccan tagine and couscous spice character."
  },
  {
    "relationship": "commonly_served_with",
    "source": "zaatar",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Za'atar and feta combine in Levantine manakish and labneh herb-cheese service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sumac",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sumac and lamb leg combine in Middle Eastern grill and fattoush-adjacent spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "saffron",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Saffron and salmon combine in Persian and Mediterranean luxury fish preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "saffron",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Saffron and shrimp combine in Spanish paella and Mediterranean seafood rice aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "vanilla-bean",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Vanilla bean and goat cheese combine in dessert cheese and poached fruit luxury pairings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "thyme",
    "target": "food.fungi.wild-mushrooms.porcini",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Thyme and porcini combine in Italian and French wild-mushroom sauté aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "parsley",
    "target": "food.fungi.wild-mushrooms.porcini",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Parsley and porcini finish Tuscan and Alpine mushroom sauce herb layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-pepper",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Black pepper and shiitake season East Asian and Western mushroom stir-fry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ginger",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Ginger and shiitake combine in Japanese and Chinese mushroom stir-fry bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tarragon",
    "target": "food.fungi.wild-mushrooms.chanterelle",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tarragon and chanterelle combine in French forest-mushroom and poultry sauce aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "garlic-chives",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Garlic chives and shrimp combine in Chinese dumpling and stir-fry seafood preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coriander-seed",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coriander seed and onion combine in Indian curry and pickle aromatic bases — seed identity, not cilantro."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cumin-seed",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cumin seed and onion anchor Indian and Mexican sofrito-adjacent savory bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "paprika",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Paprika and onion combine in Hungarian and Spanish sofrito spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "basil",
    "target": "food.vegetable.green-vegetables.asparagus",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Basil and asparagus combine in spring pasta and grill vegetable herb finishing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tarragon",
    "target": "food.vegetable.green-vegetables.asparagus",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tarragon and asparagus are classic spring bistro herb-vegetable partners."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mint",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mint and spinach combine in Middle Eastern and Indian saag-adjacent herb layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "nutmeg",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Nutmeg and spinach combine in European creamed spinach and béchamel applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cinnamon",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cinnamon and carrot combine in Moroccan tagine and roasted root vegetable spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cumin-seed",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cumin seed and carrot combine in Middle Eastern and Indian roasted vegetable spice."
  },
  {
    "relationship": "commonly_served_with",
    "source": "oregano",
    "target": "food.vegetable.nightshades.eggplant",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Oregano and eggplant combine in Greek moussaka and Mediterranean roast vegetable service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "basil",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Basil and feta combine in Mediterranean salad and watermelon-feta herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rosemary",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rosemary and onion combine in roast bed and pan sauce aromatics for poultry and lamb."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-pepper",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Black pepper and Parmigiano finish cacio e pepe and Italian pasta cheese service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "red-pepper-flakes",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Red pepper flakes and tomato combine in Italian arrabbiata and pizza seasoning."
  },
  {
    "relationship": "commonly_served_with",
    "source": "herbes-de-provence",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Herbes de Provence and lamb leg define Provençal roast herb pairing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "herbes-de-provence",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Herbes de Provence and chicken breast combine in Provençal roast and grill applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fennel-seed",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fennel seed and pork loin combine in Italian sausage and roast pork spice character."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mustard-seed",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mustard seed and pork loin share European roast and cure spice pairing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dill-seed",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Dill seed and salmon combine in pickling and Scandinavian fish spice — distinct from dill weed."
  },
  {
    "relationship": "commonly_served_with",
    "source": "star-anise",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Star anise and pork loin combine in Chinese red braise and five-spice roast applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "green-cardamom",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Green cardamom and lamb leg combine in Indian and Middle Eastern biryani spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fenugreek-seed",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fenugreek seed and chicken combine in Indian curry and tandoori spice bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "horseradish",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Horseradish and beef brisket combine in roast beef and deli condiment service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wasabi",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wasabi and salmon pair in Japanese sashimi and fusion raw fish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemongrass",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemongrass and chicken breast combine in Thai and Vietnamese curry and soup applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kaffir-lime-leaves",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Kaffir lime leaves and shrimp combine in Thai tom yum and curry paste aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "galangal",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Galangal and chicken combine in Indonesian and Thai curry paste bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "epazote",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Epazote and onion combine in Mexican sofrito and black bean aromatic bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cajun-seasoning",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cajun seasoning and shrimp combine in Louisiana boil and blackened shrimp applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "old-bay-seasoning",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Old Bay seasoning and shrimp define Chesapeake seafood boil pairing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "jerk-seasoning",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Jerk seasoning and pork loin combine in Jamaican grill and roast spice applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "harissa-spice",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Harissa spice and lamb leg combine in North African grill and tagine rubs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "poultry-seasoning",
    "target": "food.protein.poultry.chicken-thigh",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Poultry seasoning and chicken thigh combine in roast and sheet-pan poultry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon-pepper",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon pepper and salmon combine in grill and pan-seared fish seasoning."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chinese-five-spice",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Chinese five spice and pork loin combine in red-braised and char siu spice applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ancho-chile-powder",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Ancho chile powder and beef brisket combine in Texas chili and mole-adjacent rubs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chipotle-powder",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Chipotle powder and pork loin combine in Mexican and Southwestern adobo rubs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "aleppo-pepper",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Aleppo pepper and lamb leg combine in Middle Eastern grill and kebab spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kashmiri-chili",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Kashmiri chili and chicken combine in tandoori and butter chicken color-spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chaat-masala",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Chaat masala and spinach combine in Indian street snack and saag-adjacent seasoning."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tamarind",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tamarind and shrimp combine in pad thai and South Indian sour-spice seafood applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sorrel",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sorrel and salmon combine in French and Nordic spring fish sauce herb layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lovage",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lovage and chicken breast combine in Central European broth and soup aromatic bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "marjoram",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Marjoram and chicken breast combine in Mediterranean roast poultry herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mexican-oregano",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mexican oregano and beef brisket combine in Texas chili and barbacoa spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "culantro",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Culantro and shrimp combine in Caribbean and Central American seafood sofrito — distinct from cilantro leaf."
  },
  {
    "relationship": "commonly_served_with",
    "source": "vietnamese-coriander",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Vietnamese coriander and shrimp combine in pho and Southeast Asian herb plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pandan-leaf",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pandan leaf and shrimp combine in Southeast Asian rice and curry wrap aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "asafoetida",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Asafoetida and spinach combine in Indian saag and dal tempering applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "nigella-seed",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Nigella seed and chicken combine in Indian and Middle Eastern bread and roast spice toppings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mahleb",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mahleb and lamb leg combine in Middle Eastern Easter bread and roast spice adjacency."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grains-of-paradise",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grains of paradise and pork loin combine in West African and craft spice rub applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "long-pepper",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Long pepper and lamb leg combine in historical and South Asian roast spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cubeb-pepper",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cubeb pepper and chicken breast combine in Indonesian and historical spice rub applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "annatto-seed",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Annatto seed and pork loin combine in Yucatecan cochinita and Latin American achiote rubs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fenugreek-leaves",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fenugreek leaves and chicken combine in Indian butter chicken and curry finishing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "boldo",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Boldo and pork loin combine in Chilean empanada and roast spice adjacency."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hyssop",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Hyssop and lamb leg combine in Mediterranean and historical roast herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon-myrtle",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon myrtle and salmon combine in Australian citrus-herb fish preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "shiso",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Shiso and salmon combine in Japanese sashimi and herb wrap service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mitsuba",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mitsuba and salmon combine in Japanese chawanmushi and fish garnish applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "papalo",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Papalo and beef brisket combine in Mexican cemita and taco herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hoja-santa",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Hoja santa and pork loin combine in Mexican mole verde and tamale wrap aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "anise-hyssop",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Anise hyssop and goat cheese combine in herb salad and dessert cheese garnish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "salad-burnet",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Salad burnet and salmon combine in European cucumber-herb fish garnish applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "borage",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Borage and salmon combine in Mediterranean herb and fish composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fennel-frond",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fennel frond and salmon combine in Mediterranean and Nordic fish herb garnish — distinct from fennel bulb."
  },
  {
    "relationship": "commonly_served_with",
    "source": "quatre-epices",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Quatre épices and pork loin combine in French charcuterie and braise spice applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dukkah",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Dukkah and goat cheese combine in Egyptian and modern mezze bread-dip service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "shichimi-togarashi",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Shichimi togarashi and salmon combine in Japanese grilled fish and noodle finishing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pink-peppercorn",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pink peppercorn and salmon combine in French and modern pepper-crusted fish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "green-peppercorn",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Green peppercorn and ribeye define steak au poivre vert and French pan sauce pairing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rue",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rue and lamb leg combine in Ethiopian berbere-adjacent and historical Mediterranean herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "celery-leaf",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Celery leaf and salmon combine in European fish stock and herb garnish applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "summer-savory",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Summer savory and pork loin combine in German and Eastern European sausage and roast spice."
  },
  {
    "relationship": "commonly_served_with",
    "source": "winter-savory",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Winter savory and lamb leg combine in Alpine and Eastern European game roast herb service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lavender",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lavender and lamb leg combine in Provençal herb roast and Mediterranean grill applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "indian-bay-leaf",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Indian bay leaf and chicken combine in biryani and curry aromatic layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-cardamom",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Black cardamom and beef brisket combine in Chinese and Indian smoky braise spice layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mace",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mace and chicken breast combine in béchamel and holiday poultry spice applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "ajwain",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Ajwain and chicken combine in Indian paratha and roast spice topping applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "urfa-biber",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Urfa biber and lamb leg combine in Turkish kebab and eggplant spice rubs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "vadouvan",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Vadouvan and chicken combine in French-Indian curry and roast poultry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon-balm",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon balm and goat cheese combine in herb salad and dessert cheese garnish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chervil",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Chervil and chicken breast combine in French fines herb and spring poultry preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "epazote",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Epazote and pork loin combine in Mexican quesadilla and bean-adjacent pork preparations."
  }
];
