/**
 * FOOD-06B — Canonical culinary fungus seed data.
 * Each entry is one canonical culinary ingredient (CANON-001).
 */

/** @typedef {object} FungusSeed
 * @property {string} slug
 * @property {string} display_name
 * @property {"cultivated-mushrooms"|"wild-mushrooms"|"truffles"|"specialty-fungi"} parent_group
 * @property {string} scientific_name
 * @property {"primary"|"accent"|"luxury"} usage_intensity
 * @property {string[]} [aliases]
 * @property {string[]} [common_names]
 * @property {string} [origin_context]
 * @property {string} summary
 */

export const GROUP_SLUGS = [
  "cultivated-mushrooms",
  "wild-mushrooms",
  "truffles",
  "specialty-fungi",
];

export const GROUP_TO_CULINARY_GROUP = {
  "cultivated-mushrooms": "cultivated_mushrooms",
  "wild-mushrooms": "wild_mushrooms",
  truffles: "truffles",
  "specialty-fungi": "specialty_fungi",
};

/** @type {FungusSeed[]} */
export const FUNGI_SEED = [
  // —— Cultivated Mushrooms (17) ——
  {
    slug: "button-mushroom",
    display_name: "Button Mushroom",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Agaricus bisporus",
    usage_intensity: "primary",
    aliases: ["White Button Mushroom", "White Mushroom", "Table Mushroom", "Champignon Mushroom"],
    common_names: ["Champignon"],
    summary:
      "Button mushroom is the world's most common cultivated fungus — mild umami and soft texture anchor everyday sautés, soups, and global comfort dishes that pair with crisp whites and light reds.",
  },
  {
    slug: "cremini",
    display_name: "Cremini",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Agaricus bisporus",
    usage_intensity: "primary",
    aliases: ["Baby Bella", "Brown Mushroom", "Cremini Mushroom", "Swiss Brown Mushroom", "Roman Mushroom"],
    common_names: ["Crimini"],
    summary:
      "Cremini is a mature brown-capped Agaricus with deeper flavor than button mushroom — roasted or braised, it adds savory depth that suits medium-bodied reds and earthy whites.",
  },
  {
    slug: "portobello",
    display_name: "Portobello",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Agaricus bisporus",
    usage_intensity: "primary",
    aliases: ["Portabella", "Giant Portobello", "Portobella Mushroom", "Open-Cap Mushroom"],
    common_names: ["Portabello"],
    summary:
      "Portobello is a fully opened Agaricus cap prized for grilling and stuffing — meaty texture and concentrated umami call for structured reds and oaked whites.",
  },
  {
    slug: "shiitake",
    display_name: "Shiitake",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Lentinula edodes",
    usage_intensity: "primary",
    aliases: ["Shitake", "Forest Mushroom", "Black Forest Mushroom"],
    common_names: ["Shiitake Mushroom", "Donko"],
    summary:
      "Shiitake delivers smoky umami and firm bite in East Asian and modern Western cooking — dried or fresh, it pairs with Pinot Noir, Syrah, and savory whites.",
  },
  {
    slug: "oyster-mushroom",
    display_name: "Oyster Mushroom",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Pleurotus ostreatus",
    usage_intensity: "primary",
    aliases: ["Pearl Oyster Mushroom", "Phoenix Oyster Mushroom", "Golden Oyster Mushroom", "Grey Oyster Mushroom"],
    common_names: ["Oyster Cap Mushroom"],
    summary:
      "Oyster mushroom is a delicate, fan-shaped cultivated fungus with mild sweetness — quick sauté or soup applications favor aromatic whites and light, fruity reds.",
  },
  {
    slug: "king-oyster",
    display_name: "King Oyster",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Pleurotus eryngii",
    usage_intensity: "primary",
    aliases: ["King Trumpet Mushroom", "French Horn Mushroom", "Eryngii Mushroom", "Trumpet Royale"],
    common_names: ["King Oyster Mushroom"],
    summary:
      "King oyster offers a thick stem and firm, scallop-like texture when seared — its clean umami suits full-bodied whites, rosé, and soft tannins.",
  },
  {
    slug: "enoki",
    display_name: "Enoki",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Flammulina velutipes",
    usage_intensity: "primary",
    aliases: ["Enokitake", "Golden Needle Mushroom", "Winter Mushroom"],
    common_names: ["Enoki Mushroom"],
    summary:
      "Enoki brings crisp, mild mushrooms to hot pots, noodles, and salads — subtle flavor pairs with sparkling wine, sake-style whites, and delicate seafood dishes.",
  },
  {
    slug: "maitake",
    display_name: "Maitake",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Grifola frondosa",
    usage_intensity: "primary",
    aliases: ["Hen of the Woods", "Ram's Head Mushroom", "Sheep's Head Mushroom"],
    common_names: ["Maitake Mushroom"],
    summary:
      "Maitake is a frilled cultivated fungus with deep forest umami — roasted or pan-fried, it matches earthy Pinot, Nebbiolo, and barrel-fermented whites.",
  },
  {
    slug: "straw-mushroom",
    display_name: "Straw Mushroom",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Volvariella volvacea",
    usage_intensity: "primary",
    aliases: ["Paddy Straw Mushroom", "Chinese Mushroom"],
    common_names: ["Straw Mushroom"],
    summary:
      "Straw mushroom is a staple of Southeast Asian stir-fries and curries — tender caps and mild funk suit off-dry whites, Gewürztraminer, and aromatic reds.",
  },
  {
    slug: "pioppino",
    display_name: "Pioppino",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Cyclocybe aegerita",
    usage_intensity: "accent",
    aliases: ["Black Poplar Mushroom", "Tea Tree Mushroom", "Velvet Pioppini"],
    common_names: ["Pioppino Mushroom"],
    summary:
      "Pioppino offers nutty, slightly sweet caps on clustered stems — Italian and Asian sautés pair with Sangiovese, Barbera, and mineral-driven whites.",
  },
  {
    slug: "chestnut-mushroom",
    display_name: "Chestnut Mushroom",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Pholiota adiposa",
    usage_intensity: "accent",
    aliases: ["Fat Pholiota", "Chestnut Cap Mushroom"],
    common_names: ["Chestnut Mushroom"],
    summary:
      "Chestnut mushroom has a nutty, slightly bitter cap that holds up to roasting — its savory edge suits medium reds and structured Mediterranean whites.",
  },
  {
    slug: "wine-cap-mushroom",
    display_name: "Wine Cap Mushroom",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Stropharia rugosoannulata",
    usage_intensity: "accent",
    aliases: ["Garden Giant", "King Stropharia", "Burgundy Mushroom"],
    common_names: ["Wine Cap"],
    summary:
      "Wine cap is a large, wine-stained cultivated mushroom with firm texture — grilled or stewed, it pairs with Gamay, Pinot Noir, and rustic country reds.",
  },
  {
    slug: "almond-mushroom",
    display_name: "Almond Mushroom",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Agaricus subrufescens",
    usage_intensity: "primary",
    aliases: ["Almond Portobello", "Sun Mushroom", "God's Mushroom"],
    common_names: ["Almond Mushroom"],
    summary:
      "Almond mushroom is a cultivated Agaricus with marzipan-like aroma when cooked — its distinctive scent pairs with aromatic whites and soft, fruit-forward reds.",
  },
  {
    slug: "elm-oyster-mushroom",
    display_name: "Elm Oyster Mushroom",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Hypsizygus ulmarius",
    usage_intensity: "accent",
    aliases: ["Elm Mushroom", "Shirotamogitake"],
    common_names: ["Elm Oyster"],
    summary:
      "Elm oyster is a cultivated Pleurotus relative with firm white caps — mild umami in stir-fries and soups suits crisp whites and light-bodied reds.",
  },
  {
    slug: "cinnamon-cap-mushroom",
    display_name: "Cinnamon Cap Mushroom",
    parent_group: "cultivated-mushrooms",
    scientific_name: "Hypholoma sublateritium",
    usage_intensity: "accent",
    aliases: ["Brick Cap", "Red Woodlover"],
    common_names: ["Cinnamon Cap"],
    summary:
      "Cinnamon cap is a brick-red cultivated mushroom with nutty flavor when young — sautéed applications match earthy whites and light Italian reds.",
  },

  // —— Wild Mushrooms (14) ——
  {
    slug: "chanterelle",
    display_name: "Chanterelle",
    parent_group: "wild-mushrooms",
    scientific_name: "Cantharellus cibarius",
    usage_intensity: "accent",
    aliases: ["Golden Chanterelle", "Girolle", "Pfifferling"],
    common_names: ["Chanterelle Mushroom"],
    summary:
      "Chanterelle is a golden wild mushroom with apricot aroma and peppery finish — classic in French cream sauces and autumn dishes that love Chardonnay and Pinot Noir.",
  },
  {
    slug: "morel",
    display_name: "Morel",
    parent_group: "wild-mushrooms",
    scientific_name: "Morchella esculenta",
    usage_intensity: "accent",
    aliases: ["Yellow Morel", "Common Morel", "Sponge Mushroom"],
    common_names: ["Morel Mushroom"],
    summary:
      "Morel is a honeycombed spring wild mushroom with intense earthy-nutty flavor — butter sauces and poultry pair with aged whites, Champagne, and elegant reds.",
  },
  {
    slug: "porcini",
    display_name: "Porcini",
    parent_group: "wild-mushrooms",
    scientific_name: "Boletus edulis",
    usage_intensity: "accent",
    aliases: ["Cep", "Penny Bun", "King Bolete", "Steinpilz"],
    common_names: ["Porcini Mushroom"],
    summary:
      "Porcini is the benchmark wild bolete — rich umami, velvet texture, and forest aroma anchor risotto, pasta, and beef pairings with Barolo, Nebbiolo, and oaky whites.",
  },
  {
    slug: "matsutake",
    display_name: "Matsutake",
    parent_group: "wild-mushrooms",
    scientific_name: "Tricholoma matsutake",
    usage_intensity: "luxury",
    aliases: ["Pine Mushroom", "Song Rong"],
    common_names: ["Matsutake Mushroom"],
    summary:
      "Matsutake is a rare pine-scented wild mushroom central to Japanese kaiseki — its spicy-cinnamon aroma pairs with sake, aged Riesling, and restrained Pinot Noir.",
  },
  {
    slug: "black-trumpet",
    display_name: "Black Trumpet",
    parent_group: "wild-mushrooms",
    scientific_name: "Craterellus cornucopioides",
    usage_intensity: "accent",
    aliases: ["Horn of Plenty", "Trumpet of the Dead", "Trompette de la Mort"],
    common_names: ["Black Trumpet Mushroom"],
    summary:
      "Black trumpet is a thin, smoky wild mushroom that concentrates when dried — its deep umami suits Syrah, Rhône blends, and full-bodied southern whites.",
  },
  {
    slug: "hedgehog-mushroom",
    display_name: "Hedgehog Mushroom",
    parent_group: "wild-mushrooms",
    scientific_name: "Hydnum repandum",
    usage_intensity: "accent",
    aliases: ["Sweet Tooth", "Wood Hedgehog", "Pied de Mouton"],
    common_names: ["Hedgehog Mushroom"],
    summary:
      "Hedgehog mushroom has a sweet, nutty profile and tooth-like spines instead of gills — sautéed with herbs, it pairs with Pinot Gris, Chardonnay, and Gamay.",
  },
  {
    slug: "lobster-mushroom",
    display_name: "Lobster Mushroom",
    parent_group: "wild-mushrooms",
    scientific_name: "Hypomyces lactifluorum",
    usage_intensity: "accent",
    aliases: ["Lobster Mushroom Fungus"],
    common_names: ["Lobster Mushroom"],
    summary:
      "Lobster mushroom is a bright orange parasitic fungus with seafood-like sweetness — its color and flavor suit rosé, Viognier, and shellfish-friendly whites.",
  },
  {
    slug: "chicken-of-the-woods",
    display_name: "Chicken of the Woods",
    parent_group: "wild-mushrooms",
    scientific_name: "Laetiporus sulphureus",
    usage_intensity: "accent",
    aliases: ["Sulfur Shelf", "Chicken Mushroom"],
    common_names: ["Chicken of the Woods"],
    summary:
      "Chicken of the woods is a shelf-like wild fungus with poultry-like texture when cooked — fried or braised, it pairs with unoaked whites and medium-bodied reds.",
  },
  {
    slug: "cauliflower-mushroom",
    display_name: "Cauliflower Mushroom",
    parent_group: "wild-mushrooms",
    scientific_name: "Sparassis crispa",
    usage_intensity: "accent",
    aliases: ["Cabbage Mushroom", "Brain Mushroom"],
    common_names: ["Cauliflower Mushroom"],
    summary:
      "Cauliflower mushroom forms frilly, noodle-like clusters with mild almond flavor — butter-braised preparations suit Chardonnay, Albariño, and soft reds.",
  },
  {
    slug: "blewit",
    display_name: "Blewit",
    parent_group: "wild-mushrooms",
    scientific_name: "Lepista nuda",
    usage_intensity: "accent",
    aliases: ["Wood Blewit", "Blue Leg Mushroom"],
    common_names: ["Blewit Mushroom"],
    summary:
      "Blewit is a lilac-toned wild mushroom with floral aroma and firm flesh — cream sauces and game birds pair with Pinot Noir and aromatic northern whites.",
  },
  {
    slug: "saffron-milk-cap",
    display_name: "Saffron Milk Cap",
    parent_group: "wild-mushrooms",
    scientific_name: "Lactarius deliciosus",
    usage_intensity: "accent",
    aliases: ["Red Pine Mushroom", "Níscalos", "Rovellons"],
    common_names: ["Saffron Milk Cap"],
    summary:
      "Saffron milk cap is a Mediterranean wild mushroom with orange latex and resinous flavor — grilled with olive oil, it suits Tempranillo, Garnacha, and rustic whites.",
  },
  {
    slug: "shaggy-mane",
    display_name: "Shaggy Mane",
    parent_group: "wild-mushrooms",
    scientific_name: "Coprinus comatus",
    usage_intensity: "accent",
    aliases: ["Lawyer's Wig", "Ink Cap"],
    common_names: ["Shaggy Mane Mushroom"],
    summary:
      "Shaggy mane is a delicate wild mushroom best eaten young — mild flavor in egg dishes and soups pairs with Sauvignon Blanc and light, crisp whites.",
  },
  {
    slug: "parasol-mushroom",
    display_name: "Parasol Mushroom",
    parent_group: "wild-mushrooms",
    scientific_name: "Macrolepiota procera",
    usage_intensity: "accent",
    aliases: ["Parasol", "Snake's Hat Mushroom"],
    common_names: ["Parasol Mushroom"],
    summary:
      "Parasol mushroom is a large wild cap with hazelnut notes when breaded or grilled — Central European preparations pair with Grüner Veltliner, Riesling, and lager-style whites.",
  },
  {
    slug: "termite-mushroom",
    display_name: "Termite Mushroom",
    parent_group: "wild-mushrooms",
    scientific_name: "Termitomyces mammiformis",
    usage_intensity: "accent",
    aliases: ["Termitomyces Mushroom", "Ouhtoe"],
    common_names: ["Termite Mushroom"],
    summary:
      "Termite mushroom is a symbiotic wild fungus prized in African and Southeast Asian cuisines — its sweet, meaty caps suit aromatic whites and spiced red curries.",
  },

  // —— Truffles (5) ——
  {
    slug: "black-truffle",
    display_name: "Black Truffle",
    parent_group: "truffles",
    scientific_name: "Tuber melanosporum",
    usage_intensity: "luxury",
    aliases: ["Perigord Black Truffle", "Black Winter Truffle", "French Black Truffle"],
    common_names: ["Black Truffle"],
    summary:
      "Black truffle is the benchmark luxury fungus — intense earth, garlic, and chocolate notes over eggs, pasta, and root vegetables demand great age-worthy reds and structured whites.",
  },
  {
    slug: "white-truffle",
    display_name: "White Truffle",
    parent_group: "truffles",
    scientific_name: "Tuber magnatum",
    usage_intensity: "luxury",
    aliases: ["Alba White Truffle", "Piedmont White Truffle", "Italian White Truffle"],
    common_names: ["White Truffle"],
    summary:
      "White truffle is the most aromatic luxury fungus — raw shavings over tajarin and risotto pair with aged Barolo, Barbaresco, and rich, oxidative whites.",
  },
  {
    slug: "summer-truffle",
    display_name: "Summer Truffle",
    parent_group: "truffles",
    scientific_name: "Tuber aestivum",
    usage_intensity: "luxury",
    aliases: ["Burgundy Summer Truffle", "Scorzone"],
    common_names: ["Summer Truffle"],
    summary:
      "Summer truffle offers milder earth and hazelnut than winter varieties — shaved over vegetables and poultry, it suits Dolcetto, Barbera, and medium-bodied whites.",
  },
  {
    slug: "burgundy-truffle",
    display_name: "Burgundy Truffle",
    parent_group: "truffles",
    scientific_name: "Tuber uncinatum",
    usage_intensity: "luxury",
    aliases: ["Autumn Truffle", "Burgundy Black Truffle"],
    common_names: ["Burgundy Truffle"],
    summary:
      "Burgundy truffle bridges summer and black winter truffles in aroma — forest dishes and potato preparations pair with Pinot Noir, Gamay, and earthy Chardonnay.",
  },
  {
    slug: "bianchetto-truffle",
    display_name: "Bianchetto Truffle",
    parent_group: "truffles",
    scientific_name: "Tuber borchii",
    usage_intensity: "luxury",
    aliases: ["Whitish Truffle", "Spring White Truffle", "Marzuolo"],
    common_names: ["Bianchetto Truffle"],
    summary:
      "Bianchetto is a spring white truffle with sharp garlic aroma — lighter than Alba truffle, it pairs with Vermentino, Pecorino dishes, and young Sangiovese.",
  },

  // —— Specialty Fungi (9) ——
  {
    slug: "wood-ear",
    display_name: "Wood Ear",
    parent_group: "specialty-fungi",
    scientific_name: "Auricularia auricula-judae",
    usage_intensity: "accent",
    aliases: ["Cloud Ear", "Black Fungus", "Tree Ear", "Mu Er", "Jelly Ear"],
    common_names: ["Wood Ear Mushroom"],
    summary:
      "Wood ear is a gelatinous specialty fungus valued for crunch in Chinese hot pot and stir-fries — neutral flavor carries sauce pairings toward Riesling, Gewürztraminer, and off-dry whites.",
  },
  {
    slug: "lions-mane",
    display_name: "Lion's Mane",
    parent_group: "specialty-fungi",
    scientific_name: "Hericium erinaceus",
    usage_intensity: "accent",
    aliases: ["Pom Pom Mushroom", "Monkey Head Mushroom", "Bearded Tooth"],
    common_names: ["Lion's Mane Mushroom"],
    summary:
      "Lion's mane is a shaggy specialty fungus with crab-like texture when seared — butter and herbs pair with Chardonnay, Chenin Blanc, and soft, savory whites.",
  },
  {
    slug: "beech-mushroom",
    display_name: "Beech Mushroom",
    parent_group: "specialty-fungi",
    scientific_name: "Hypsizygus tessellatus",
    usage_intensity: "accent",
    aliases: ["Brown Beech Mushroom", "Buna Shimeji", "Hon Shimeji", "Bunapi Mushroom", "White Beech Mushroom"],
    common_names: ["Beech Mushroom", "Shimeji"],
    summary:
      "Beech mushroom grows in clustered caps with nutty, slightly sweet flavor — Japanese and Nordic preparations suit sake, Pinot Gris, and mineral whites.",
  },
  {
    slug: "nameko",
    display_name: "Nameko",
    parent_group: "specialty-fungi",
    scientific_name: "Pholiota nameko",
    usage_intensity: "accent",
    aliases: ["Butterscotch Mushroom", "Slimy Mushroom"],
    common_names: ["Nameko Mushroom"],
    summary:
      "Nameko is a small Japanese specialty fungus with viscous cap and nutty aroma — miso soup and soba pair with sake, Grüner Veltliner, and light, umami-friendly whites.",
  },
  {
    slug: "snow-fungus",
    display_name: "Snow Fungus",
    parent_group: "specialty-fungi",
    scientific_name: "Tremella fuciformis",
    usage_intensity: "accent",
    aliases: ["White Fungus", "Silver Ear", "Tremella Mushroom"],
    common_names: ["Snow Fungus"],
    summary:
      "Snow fungus is a translucent specialty fungus used in Chinese tonic soups and desserts — delicate texture suits off-dry whites, Moscato, and floral aromatic wines.",
  },
  {
    slug: "abalone-mushroom",
    display_name: "Abalone Mushroom",
    parent_group: "specialty-fungi",
    scientific_name: "Pleurotus cystidiosus",
    usage_intensity: "accent",
    aliases: ["White Abalone Mushroom", "Taiwan Abalone Mushroom"],
    common_names: ["Abalone Mushroom"],
    summary:
      "Abalone mushroom is a thick-stemmed Pleurotus prized for seafood-like bite — seared with garlic, it pairs with Albariño, Vermentino, and crisp coastal whites.",
  },
  {
    slug: "fried-chicken-mushroom",
    display_name: "Fried Chicken Mushroom",
    parent_group: "specialty-fungi",
    scientific_name: "Lyophyllum decastes",
    usage_intensity: "accent",
    aliases: ["Clustered Domecap", "Chicken Mushroom Lyophyllum"],
    common_names: ["Fried Chicken Mushroom"],
    summary:
      "Fried chicken mushroom is a clustered specialty fungus with mild, poultry-like flavor — East Asian braises and hot pots suit aromatic whites and light reds.",
  },
  {
    slug: "bamboo-pith",
    display_name: "Bamboo Pith",
    parent_group: "specialty-fungi",
    scientific_name: "Phallus indusiatus",
    usage_intensity: "luxury",
    aliases: ["Bamboo Fungus", "Veiled Lady", "Long Net Stinkhorn"],
    common_names: ["Bamboo Pith Mushroom"],
    summary:
      "Bamboo pith is a lacy specialty fungus in Chinese haute cuisine — prized for texture in clear broths and banquet soups that pair with aged Chenin and refined whites.",
  },
  {
    slug: "coral-tooth-mushroom",
    display_name: "Coral Tooth Mushroom",
    parent_group: "specialty-fungi",
    scientific_name: "Hericium coralloides",
    usage_intensity: "accent",
    aliases: ["Coral Hericium", "Comb Tooth Mushroom"],
    common_names: ["Coral Tooth Mushroom"],
    summary:
      "Coral tooth mushroom is a branching Hericium with delicate seafood-like flavor — butter-roasted clusters pair with Chardonnay, Pinot Blanc, and soft, savory whites.",
  },
];
