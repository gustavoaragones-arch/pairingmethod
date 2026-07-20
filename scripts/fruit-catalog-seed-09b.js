/**
 * FOOD-09B — Canonical fruit seed data.
 * Each entry is one canonical culinary ingredient (CANON-001).
 */

/** @typedef {object} FruitSeed
 * @property {string} slug
 * @property {string} display_name
 * @property {"pomes"|"stone-fruits"|"citrus"|"berries"|"tropical-fruits"|"melons"|"processed-fruits"} parent_group
 * @property {string} scientific_name
 * @property {"primary"|"accent"|"luxury"} usage_intensity
 * @property {string[]} [aliases]
 * @property {string[]} [common_names]
 * @property {string} [origin_context]
 * @property {string} summary
 */

export const GROUP_SLUGS = [
  "pomes",
  "stone-fruits",
  "citrus",
  "berries",
  "tropical-fruits",
  "melons",
  "processed-fruits",
];

export const GROUP_TO_CULINARY_GROUP = {
  "pomes": "pomes",
  "stone-fruits": "stone_fruits",
  "citrus": "citrus",
  "berries": "berries",
  "tropical-fruits": "tropical_fruits",
  "melons": "melons",
  "processed-fruits": "processed_fruits",
};

/** @type {FruitSeed[]} */
export const FRUIT_SEED = [

  // —— Pomes (12) ——
  {
    "slug": "apple",
    "display_name": "Apple",
    "parent_group": "pomes",
    "scientific_name": "Malus domestica",
    "usage_intensity": "primary",
    "summary": "Apple is the foundational pome fruit — its crisp acidity and orchard sweetness anchor cheese boards, pork roasts, and salads that pair with off-dry Riesling, cider, and structured Chardonnay.",
    "aliases": [
      "Sliced Apple",
      "Diced Apple",
      "Granny Smith Apple",
      "Red Apple",
      "Green Apple",
      "Gala Apple",
    ],
    "common_names": [
      "Gala Apple"
    ],
    "origin_context": "Central Asia"
  },
  {
    "slug": "pear",
    "display_name": "Pear",
    "parent_group": "pomes",
    "scientific_name": "Pyrus communis",
    "usage_intensity": "primary",
    "summary": "Pear delivers buttery, floral sweetness with gentle acidity in salads, tarts, and cheese pairings — its soft pome texture pairs with Roquefort, Pinot Noir, and off-dry sparkling wine.",
    "aliases": [
      "Bartlett Pear",
      "Bosc Pear",
      "Anjou Pear",
      "Comice Pear",
      "Poached Pear",
    ],
    "common_names": [
      "Bartlett Pear",
    ]
  },
  {
    "slug": "quince",
    "display_name": "Quince",
    "parent_group": "pomes",
    "scientific_name": "Cydonia oblonga",
    "usage_intensity": "accent",
    "summary": "Quince is a hard aromatic pome that transforms when cooked into floral paste and membrillo — its tannic perfume pairs with Manchego, fortified wines, and rich Mediterranean reds.",
    "aliases": [
      "Membrillo Quince",
      "Cooking Quince",
      "Whole Quince",
    ],
    "common_names": [
      "Membrillo",
    ]
  },
  {
    "slug": "asian-pear",
    "display_name": "Asian Pear",
    "parent_group": "pomes",
    "scientific_name": "Pyrus pyrifolia",
    "usage_intensity": "primary",
    "summary": "Asian pear offers crunchy, juicy sweetness with subtle floral notes in Korean salads and Japanese gift fruit — its crisp pome character pairs with sake, off-dry Riesling, and light Pinot Grigio.",
    "aliases": [
      "Nashi Pear",
      "Apple Pear",
      "Korean Pear",
      "Chinese Pear",
    ],
    "common_names": [
      "Nashi Pear",
    ]
  },
  {
    "slug": "crabapple",
    "display_name": "Crabapple",
    "parent_group": "pomes",
    "scientific_name": "Malus sylvestris",
    "usage_intensity": "accent",
    "summary": "Crabapple brings sharp tannic acidity to jellies, chutney, and cider blends — its intense sour pome bite pairs with farmhouse ale, dry cider, and high-acid white wines.",
    "aliases": [
      "Wild Crabapple",
      "Sour Crabapple",
      "Crab Apple",
    ],
    "common_names": [
      "Crab Apple",
    ]
  },
  {
    "slug": "loquat",
    "display_name": "Loquat",
    "parent_group": "pomes",
    "scientific_name": "Eriobotrya japonica",
    "usage_intensity": "accent",
    "summary": "Loquat is a mild, honeyed pome with apricot-like perfume in Mediterranean and East Asian desserts — its delicate sweetness pairs with Muscat, off-dry whites, and light dessert wines.",
    "aliases": [
      "Japanese Plum",
      "Nispero",
      "Biwa",
    ],
    "common_names": [
      "Nispero",
    ]
  },
  {
    "slug": "medlar",
    "display_name": "Medlar",
    "parent_group": "pomes",
    "scientific_name": "Mespilus germanica",
    "usage_intensity": "luxury",
    "summary": "Medlar is a bletted luxury pome with spiced wine-gum depth in medieval European preserves — its fermented sweetness pairs with vintage Port, Sauternes, and aged hard cheese.",
    "aliases": [
      "Bletted Medlar",
      "Open-Arse Fruit",
      "Common Medlar",
    ],
    "common_names": [
      "Common Medlar",
    ]
  },
  {
    "slug": "hawthorn",
    "display_name": "Hawthorn",
    "parent_group": "pomes",
    "scientific_name": "Crataegus monogyna",
    "usage_intensity": "accent",
    "summary": "Hawthorn berries add tart, apple-like pome acidity to Chinese candies, liqueurs, and herbal preparations — their astringent fruit note pairs with floral whites and light herbal reds.",
    "aliases": [
      "Haw Berry",
      "Mayhaw",
      "Crataegus Berry",
    ],
    "common_names": [
      "Haw Berry",
    ]
  },
  {
    "slug": "serviceberry",
    "display_name": "Serviceberry",
    "parent_group": "pomes",
    "scientific_name": "Amelanchier alnifolia",
    "usage_intensity": "accent",
    "summary": "Serviceberry offers almond-scented pome sweetness in North American pies and foraged preserves — its wild berry-pome hybrid character pairs with Pinot Noir, cider, and off-dry rosé.",
    "aliases": [
      "Juneberry",
      "Saskatoon Berry",
      "Shadbush Berry",
    ],
    "common_names": [
      "Juneberry",
    ]
  },
  {
    "slug": "tejocote",
    "display_name": "Tejocote",
    "parent_group": "pomes",
    "scientific_name": "Crataegus mexicana",
    "usage_intensity": "accent",
    "summary": "Tejocote is a Mexican hawthorn pome essential to ponche and holiday fruit punch — its tart apple-cranberry depth pairs with spiced rum, Mexican lager, and aromatic off-dry whites.",
    "aliases": [
      "Mexican Hawthorn",
      "Manzanita",
      "Tejocote Fruit",
    ],
    "common_names": [
      "Manzanita",
    ]
  },
  {
    "slug": "rowan",
    "display_name": "Rowan",
    "parent_group": "pomes",
    "scientific_name": "Sorbus aucuparia",
    "usage_intensity": "accent",
    "summary": "Rowan berries bring bitter-tart pome astringency to Scandinavian liqueurs, jellies, and game sauces — their wild mountain fruit edge pairs with aquavit, dry cider, and earthy northern reds.",
    "aliases": [
      "Rowan Berry",
      "Mountain Ash Berry",
      "Dogberry",
    ],
    "common_names": [
      "Rowan Berry",
    ]
  },
  {
    "slug": "sorb-apple",
    "display_name": "Sorb Apple",
    "parent_group": "pomes",
    "scientific_name": "Sorbus domestica",
    "usage_intensity": "accent",
    "summary": "Sorb apple is an Old World pome with pear-like flesh used in cider, eau-de-vie, and Alpine preserves — its tannic orchard depth pairs with Calvados, dry cider, and structured whites.",
    "aliases": [
      "Sorb",
      "Service Tree Fruit",
      "Wild Service Fruit",
    ],
    "common_names": [
      "Sorb",
    ]
  },

  // —— Stone Fruits (17) ——
  {
    "slug": "peach",
    "display_name": "Peach",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus persica",
    "usage_intensity": "primary",
    "summary": "Peach is the quintessential stone fruit — its fuzzy skin and honeyed acidity shine in desserts, salsas, and grilled mains that pair with Moscato, Prosecco, and off-dry Riesling.",
    "aliases": [
      "White Peach",
      "Yellow Peach",
      "Freestone Peach",
      "Clingstone Peach",
      "Grilled Peach",
    ],
    "common_names": [
      "Yellow Peach",
    ]
  },
  {
    "slug": "nectarine",
    "display_name": "Nectarine",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus persica var. nucipersica",
    "usage_intensity": "primary",
    "summary": "Nectarine delivers smooth-skinned stone fruit intensity with brighter acidity than peach in tarts and salads — its vivid sweetness pairs with rosé, Viognier, and light sparkling wine.",
    "aliases": [
      "White Nectarine",
      "Yellow Nectarine",
      "Sliced Nectarine",
    ],
    "common_names": [
      "White Nectarine",
    ]
  },
  {
    "slug": "apricot",
    "display_name": "Apricot",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus armeniaca",
    "usage_intensity": "primary",
    "summary": "Apricot offers honeyed stone fruit perfume with gentle tang in tagines, tarts, and jam — its aromatic sweetness pairs with Gewürztraminer, Viognier, and off-dry dessert whites.",
    "aliases": [
      "Fresh Apricot",
      "Blush Apricot",
      "Turkish Apricot",
    ],
    "common_names": [
      "Turkish Apricot",
    ]
  },
  {
    "slug": "sweet-cherry",
    "display_name": "Sweet Cherry",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus avium",
    "usage_intensity": "primary",
    "summary": "Sweet cherry brings glossy stone fruit richness to clafoutis, duck sauces, and cheese boards — its deep sweetness pairs with Pinot Noir, Beaujolais, and off-dry sparkling wine.",
    "aliases": [
      "Bing Cherry",
      "Rainier Cherry",
      "Black Cherry",
      "Dark Sweet Cherry",
    ],
    "common_names": [
      "Bing Cherry",
    ]
  },
  {
    "slug": "sour-cherry",
    "display_name": "Sour Cherry",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus cerasus",
    "usage_intensity": "accent",
    "summary": "Sour cherry delivers piercing acidity and crimson juice for pies, Hungarian soups, and liqueurs — its tart stone fruit bite pairs with Tokaji, dry rosé, and bright Gamay.",
    "aliases": [
      "Tart Cherry",
      "Pie Cherry",
      "Morello Cherry",
    ],
    "common_names": [
      "Tart Cherry",
    ]
  },
  {
    "slug": "plum",
    "display_name": "Plum",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus domestica",
    "usage_intensity": "primary",
    "summary": "Plum is a versatile stone fruit with juicy flesh and skin tannin for tarts, pork glazes, and slivovitz — its balanced sweetness pairs with Alsatian whites, Zinfandel, and off-dry Riesling.",
    "aliases": [
      "Black Plum",
      "Red Plum",
      "Italian Plum",
      "Santa Rosa Plum",
    ],
    "common_names": [
      "Black Plum",
    ]
  },
  {
    "slug": "damson",
    "display_name": "Damson",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus domestica subsp. insititia",
    "usage_intensity": "accent",
    "summary": "Damson is a small tart stone fruit prized for gin, jam, and British preserves — its astringent depth pairs with London dry gin styles, farmhouse ale, and structured rustic reds.",
    "aliases": [
      "Damson Plum",
      "Damson Fruit",
      "Wild Damson",
    ],
    "common_names": [
      "Damson Plum",
    ]
  },
  {
    "slug": "mirabelle",
    "display_name": "Mirabelle",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus domestica subsp. syriaca",
    "usage_intensity": "accent",
    "summary": "Mirabelle is a golden Lorraine stone fruit with honeyed perfume in tarts and eau-de-vie — its delicate sweetness pairs with Crémant, Alsatian Pinot Gris, and light dessert wines.",
    "aliases": [
      "Mirabelle Plum",
      "Yellow Mirabelle",
      "Lorraine Mirabelle",
    ],
    "common_names": [
      "Mirabelle Plum",
    ]
  },
  {
    "slug": "greengage",
    "display_name": "Greengage",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus domestica var. italica",
    "usage_intensity": "accent",
    "summary": "Greengage offers green-skinned stone fruit with honeyed acidity in Victorian desserts and chutney — its refined sweetness pairs with Sauternes, off-dry Chenin Blanc, and soft goat cheese.",
    "aliases": [
      "Green Gage Plum",
      "Reine Claude",
      "Greengage Plum",
    ],
    "common_names": [
      "Reine Claude",
    ]
  },
  {
    "slug": "sloe",
    "display_name": "Sloe",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus spinosa",
    "usage_intensity": "accent",
    "summary": "Sloe is the wild blackthorn stone fruit behind sloe gin and hedgerow liqueurs — its bitter-tart astringency pairs with gin, dry cider, and robust farmhouse reds.",
    "aliases": [
      "Sloe Berry",
      "Blackthorn Berry",
      "Wild Plum",
    ],
    "common_names": [
      "Sloe Berry",
    ]
  },
  {
    "slug": "mume",
    "display_name": "Mume",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus mume",
    "usage_intensity": "accent",
    "summary": "Mume is the Japanese apricot stone fruit used in umeboshi, plum wine, and floral pickles — its salty-sour complexity pairs with sake, shochu-friendly whites, and umami-driven light reds.",
    "aliases": [
      "Japanese Apricot",
      "Ume",
      "Chinese Plum Fruit",
    ],
    "common_names": [
      "Ume",
    ]
  },
  {
    "slug": "pluot",
    "display_name": "Pluot",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus hybrid",
    "usage_intensity": "accent",
    "summary": "Pluot is a plum-apricot hybrid stone fruit with intense sweetness and smooth skin in modern desserts — its candy-like depth pairs with Moscato, off-dry whites, and fruit-forward rosé.",
    "aliases": [
      "Plumcot",
      "Dinosaur Egg Pluot",
      "Flavor King Pluot",
    ],
    "common_names": [
      "Plumcot",
    ]
  },
  {
    "slug": "aprium",
    "display_name": "Aprium",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus hybrid",
    "usage_intensity": "accent",
    "summary": "Aprium leans apricot in this plum cross with floral honey and soft flesh for tarts and compote — its aromatic stone fruit character pairs with Viognier, Gewürztraminer, and dessert sparkling.",
    "aliases": [
      "Apricot-Plum Hybrid",
      "Aprium Fruit",
    ],
    "common_names": [
      "Aprium Fruit",
    ]
  },
  {
    "slug": "black-cherry",
    "display_name": "Black Cherry",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus serotina",
    "usage_intensity": "accent",
    "summary": "Black cherry is a wild North American stone fruit with almond-bitter depth in jams and wild game sauces — its dark fruit tannin pairs with Zinfandel, bourbon-barrel reds, and dry cider.",
    "aliases": [
      "Wild Black Cherry",
      "Rum Cherry",
      "Choke Cherry Relative",
    ],
    "common_names": [
      "Wild Black Cherry",
    ]
  },
  {
    "slug": "flat-peach",
    "display_name": "Flat Peach",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus persica var. platycarpa",
    "usage_intensity": "accent",
    "summary": "Flat peach is a donut-shaped stone fruit with concentrated sweetness and thin skin for fresh eating and salads — its candy-sweet flesh pairs with Prosecco, Moscato, and off-dry sparkling wine.",
    "aliases": [
      "Donut Peach",
      "Peento Peach",
      "Saturn Peach",
    ],
    "common_names": [
      "Donut Peach",
    ]
  },
  {
    "slug": "montmorency-cherry",
    "display_name": "Montmorency Cherry",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus cerasus",
    "usage_intensity": "accent",
    "summary": "Montmorency cherry is the classic American pie cherry with bright acidity and crimson juice — its tart stone fruit intensity pairs with off-dry Riesling, Beaujolais, and sparkling rosé.",
    "aliases": [
      "Montmorency Tart Cherry",
      "American Sour Cherry",
      "Pie Cherry Cultivar",
    ],
    "common_names": [
      "Montmorency Tart Cherry",
    ]
  },
  {
    "slug": "sand-cherry",
    "display_name": "Sand Cherry",
    "parent_group": "stone-fruits",
    "scientific_name": "Prunus pumila",
    "usage_intensity": "accent",
    "summary": "Sand cherry is a wild prairie stone fruit with dark skin and sharp acidity in foraged jellies — its rustic tartness pairs with dry rosé, light Pinot Noir, and prairie-style craft cider.",
    "aliases": [
      "Western Sand Cherry",
      "Great Lakes Cherry",
      "Prunus pumila Fruit",
    ],
    "common_names": [
      "Western Sand Cherry",
    ]
  },

  // —— Citrus (17) ——
  {
    "slug": "lemon",
    "display_name": "Lemon",
    "parent_group": "citrus",
    "scientific_name": "Citrus limon",
    "usage_intensity": "accent",
    "summary": "Lemon is the essential accent citrus — its piercing acidity and aromatic oils lift seafood, poultry, and vinaigrettes to pair with Sauvignon Blanc, Albariño, and crisp sparkling wine.",
    "aliases": [
      "Zested Lemon",
      "Lemon Wedges",
      "Meyer Lemon",
      "Eureka Lemon",
      "Preserved Lemon",
    ],
    "common_names": [
      "Meyer Lemon",
    ]
  },
  {
    "slug": "lime",
    "display_name": "Lime",
    "parent_group": "citrus",
    "scientific_name": "Citrus aurantiifolia",
    "usage_intensity": "accent",
    "summary": "Lime delivers sharp tropical acidity and floral peel oils to ceviche, Thai curries, and cocktails — its bright citrus punch pairs with Torrontés, Mexican lager, and high-acid whites.",
    "aliases": [
      "Persian Lime",
      "Key Lime",
      "Lime Wedges",
      "Zested Lime",
    ],
    "common_names": [
      "Persian Lime",
    ]
  },
  {
    "slug": "orange",
    "display_name": "Orange",
    "parent_group": "citrus",
    "scientific_name": "Citrus sinensis",
    "usage_intensity": "primary",
    "summary": "Orange is the sweet citrus backbone for sauces, salads, and duck a l'orange — its juicy acidity and peel oils pair with sparkling wine, off-dry Riesling, and medium-bodied Pinot Noir.",
    "aliases": [
      "Orange Segments",
      "Navel Orange",
      "Valencia Orange",
    ],
    "common_names": [
      "Navel Orange",
    ]
  },
  {
    "slug": "grapefruit",
    "display_name": "Grapefruit",
    "parent_group": "citrus",
    "scientific_name": "Citrus paradisi",
    "usage_intensity": "primary",
    "summary": "Grapefruit brings bold bitter-sweet citrus to breakfast, seafood salads, and palomas — its bracing acidity pairs with Sauvignon Blanc, dry rosé, and herbaceous New World whites.",
    "aliases": [
      "Pink Grapefruit",
      "Ruby Red Grapefruit",
      "White Grapefruit",
      "Grapefruit Segments",
    ],
    "common_names": [
      "Ruby Red Grapefruit",
    ]
  },
  {
    "slug": "mandarin",
    "display_name": "Mandarin",
    "parent_group": "citrus",
    "scientific_name": "Citrus reticulata",
    "usage_intensity": "primary",
    "summary": "Mandarin is the loose-skinned sweet citrus for salads, duck, and holiday desserts — its easy-peel segments pair with off-dry Riesling, Moscato, and light sparkling wine.",
    "aliases": [
      "Mandarin Orange",
      "Clementine",
      "Tangerine",
      "Satsuma",
    ],
    "common_names": [
      "Mandarin Orange",
    ]
  },
  {
    "slug": "tangerine",
    "display_name": "Tangerine",
    "parent_group": "citrus",
    "scientific_name": "Citrus tangerina",
    "usage_intensity": "accent",
    "summary": "Tangerine offers deep orange sweetness with aromatic peel in marmalade, glazes, and Asian salads — its mellow citrus character pairs with Gewürztraminer, off-dry whites, and fruit-forward rosé.",
    "aliases": [
      "Honey Tangerine",
      "Murcott Tangerine",
      "Tangerine Segments",
    ],
    "common_names": [
      "Honey Tangerine",
    ]
  },
  {
    "slug": "clementine",
    "display_name": "Clementine",
    "parent_group": "citrus",
    "scientific_name": "Citrus clementina",
    "usage_intensity": "accent",
    "summary": "Clementine is a seedless winter citrus with honeyed sweetness for snacking and dessert garnish — its gentle acidity pairs with Prosecco, Moscato d'Asti, and off-dry sparkling wine.",
    "aliases": [
      "Clementine Orange",
      "Seedless Mandarin",
      "Christmas Orange",
    ],
    "common_names": [
      "Clementine Orange",
    ]
  },
  {
    "slug": "satsuma",
    "display_name": "Satsuma",
    "parent_group": "citrus",
    "scientific_name": "Citrus unshiu",
    "usage_intensity": "accent",
    "summary": "Satsuma is a Japanese seedless mandarin with floral sweetness and tender segments — its delicate citrus perfume pairs with sake, off-dry Riesling, and light dessert sparkling wine.",
    "aliases": [
      "Satsuma Mandarin",
      "Seedless Satsuma",
      "Mikan",
    ],
    "common_names": [
      "Mikan",
    ]
  },
  {
    "slug": "yuzu",
    "display_name": "Yuzu",
    "parent_group": "citrus",
    "scientific_name": "Citrus junos",
    "usage_intensity": "luxury",
    "summary": "Yuzu is a luxury Japanese citrus with intense floral-aromatic zest for ponzu, cocktails, and fine dining — its complex acidity pairs with sake, Champagne, and mineral-driven high-acid whites.",
    "aliases": [
      "Yuzu Zest",
      "Yuzu Juice",
      "Japanese Yuzu",
    ],
    "common_names": [
      "Japanese Yuzu",
    ]
  },
  {
    "slug": "pomelo",
    "display_name": "Pomelo",
    "parent_group": "citrus",
    "scientific_name": "Citrus maxima",
    "usage_intensity": "accent",
    "summary": "Pomelo is the largest citrus with mild sweetness and thick pith in Southeast Asian salads and lunar new year gifts — its gentle acidity pairs with aromatic whites, lager, and off-dry styles.",
    "aliases": [
      "Pummelo",
      "Shaddock",
      "Chinese Grapefruit",
      "Pomelo Segments",
    ],
    "common_names": [
      "Pummelo",
    ]
  },
  {
    "slug": "kumquat",
    "display_name": "Kumquat",
    "parent_group": "citrus",
    "scientific_name": "Fortunella margarita",
    "usage_intensity": "accent",
    "summary": "Kumquat is a bite-sized citrus eaten whole for sweet peel and tart flesh in marmalade and garnish — its contrast of sweet-sour pairs with off-dry Riesling, Moscato, and sparkling wine.",
    "aliases": [
      "Nagami Kumquat",
      "Marumi Kumquat",
      "Candied Kumquat",
    ],
    "common_names": [
      "Nagami Kumquat",
    ]
  },
  {
    "slug": "bergamot",
    "display_name": "Bergamot",
    "parent_group": "citrus",
    "scientific_name": "Citrus bergamia",
    "usage_intensity": "luxury",
    "summary": "Bergamot is a Calabrian luxury citrus whose peel defines Earl Grey and fine marmalade — its aromatic bitter oils pair with Champagne, dessert wine, and floral high-acid whites.",
    "aliases": [
      "Bergamot Orange",
      "Bergamot Peel",
      "Calabrian Bergamot",
    ],
    "common_names": [
      "Bergamot Orange",
    ]
  },
  {
    "slug": "citron",
    "display_name": "Citron",
    "parent_group": "citrus",
    "scientific_name": "Citrus medica",
    "usage_intensity": "accent",
    "summary": "Citron is an ancient thick-rind citrus prized for candied peel and Jewish ritual etrog — its intense aromatic pith pairs with dessert wine, Moscato, and fortified Mediterranean styles.",
    "aliases": [
      "Etrog",
      "Buddha Hand Citron",
      "Cedrat",
      "Candied Citron",
    ],
    "common_names": [
      "Etrog",
    ]
  },
  {
    "slug": "blood-orange",
    "display_name": "Blood Orange",
    "parent_group": "citrus",
    "scientific_name": "Citrus sinensis",
    "usage_intensity": "accent",
    "summary": "Blood orange delivers crimson flesh and berry-citrus depth to salads, sorbet, and Sicilian desserts — its anthocyanin sweetness pairs with Nero d'Avola, Prosecco, and off-dry rosé.",
    "aliases": [
      "Moro Orange",
      "Tarocco Orange",
      "Sanguinello Orange",
      "Blood Orange Segments",
    ],
    "common_names": [
      "Moro Orange",
    ]
  },
  {
    "slug": "key-lime",
    "display_name": "Key Lime",
    "parent_group": "citrus",
    "scientific_name": "Citrus aurantiifolia",
    "usage_intensity": "accent",
    "summary": "Key lime is the aromatic Florida citrus behind pie and ceviche with sharper perfume than Persian lime — its intense acidity pairs with tropical whites, rum cocktails, and crisp Sauvignon Blanc.",
    "aliases": [
      "Mexican Lime",
      "West Indian Lime",
      "Key Lime Juice",
    ],
    "common_names": [
      "Mexican Lime",
    ]
  },
  {
    "slug": "calamansi",
    "display_name": "Calamansi",
    "parent_group": "citrus",
    "scientific_name": "Citrus microcarpa",
    "usage_intensity": "accent",
    "summary": "Calamansi is a Filipino sour citrus with orange-lime complexity in adobo, dipping sauces, and drinks — its sharp acidity pairs with lager, off-dry Riesling, and tropical aromatic whites.",
    "aliases": [
      "Calamondin",
      "Philippine Lime",
      "Calamansi Juice",
    ],
    "common_names": [
      "Calamondin",
    ]
  },
  {
    "slug": "sudachi",
    "display_name": "Sudachi",
    "parent_group": "citrus",
    "scientific_name": "Citrus sudachi",
    "usage_intensity": "luxury",
    "summary": "Sudachi is a Japanese luxury sour citrus squeezed over sashimi, soba, and hot pot — its green zest acidity pairs with sake, Grüner Veltliner, and mineral-driven coastal whites.",
    "aliases": [
      "Sudachi Lime",
      "Japanese Sudachi",
      "Sudachi Zest",
    ],
    "common_names": [
      "Sudachi Lime",
    ]
  },

  // —— Berries (24) ——
  {
    "slug": "grape",
    "display_name": "Grape",
    "parent_group": "berries",
    "scientific_name": "Vitis vinifera",
    "usage_intensity": "primary",
    "summary": "Grape is the fresh berry essential to cheese boards, fruit salads, and Mediterranean mezze — its juicy sweetness pairs with virtually every wine style, especially soft reds and off-dry whites.",
    "aliases": [
      "Red Grape",
      "Green Grape",
      "Black Grape",
      "Concord Grape",
      "Seedless Grape",
    ],
    "common_names": [
      "Red Grape",
    ]
  },
  {
    "slug": "strawberry",
    "display_name": "Strawberry",
    "parent_group": "berries",
    "scientific_name": "Fragaria × ananassa",
    "usage_intensity": "primary",
    "summary": "Strawberry is the iconic summer berry with bright acidity and floral sweetness in desserts, salads, and balsamic pairings — its vivid fruit pairs with Champagne, rosé, and off-dry sparkling wine.",
    "aliases": [
      "Fresh Strawberry",
      "Wild Strawberry",
      "Sliced Strawberry",
      "Hulled Strawberry",
    ],
    "common_names": [
      "Fresh Strawberry",
    ]
  },
  {
    "slug": "raspberry",
    "display_name": "Raspberry",
    "parent_group": "berries",
    "scientific_name": "Rubus idaeus",
    "usage_intensity": "primary",
    "summary": "Raspberry delivers tart floral berry intensity to coulis, chocolate desserts, and duck — its vivid acidity pairs with Pinot Noir, Brut rosé Champagne, and off-dry German whites.",
    "aliases": [
      "Red Raspberry",
      "Fresh Raspberry",
      "Golden Raspberry",
    ],
    "common_names": [
      "Red Raspberry",
    ]
  },
  {
    "slug": "blueberry",
    "display_name": "Blueberry",
    "parent_group": "berries",
    "scientific_name": "Vaccinium corymbosum",
    "usage_intensity": "primary",
    "summary": "Blueberry offers mild sweetness and skin tannin in muffins, compote, and savory sauces — its rounded berry character pairs with Merlot, off-dry Riesling, and American oak Chardonnay.",
    "aliases": [
      "Highbush Blueberry",
      "Wild Blueberry",
      "Fresh Blueberry",
    ],
    "common_names": [
      "Highbush Blueberry",
    ]
  },
  {
    "slug": "blackberry",
    "display_name": "Blackberry",
    "parent_group": "berries",
    "scientific_name": "Rubus fruticosus",
    "usage_intensity": "primary",
    "summary": "Blackberry brings deep winey berry richness and seed crunch to cobblers, game, and cheese — its earthy sweetness pairs with Syrah, Zinfandel, and structured Mediterranean reds.",
    "aliases": [
      "Wild Blackberry",
      "Fresh Blackberry",
      "Marionberry Relative",
    ],
    "common_names": [
      "Wild Blackberry",
    ]
  },
  {
    "slug": "cranberry",
    "display_name": "Cranberry",
    "parent_group": "berries",
    "scientific_name": "Vaccinium macrocarpon",
    "usage_intensity": "accent",
    "summary": "Cranberry delivers piercing tart berry acidity to sauce, relish, and holiday roasts — its astringent brightness pairs with off-dry Riesling, Pinot Noir, and sparkling wine with turkey.",
    "aliases": [
      "Fresh Cranberry",
      "Cranberry Sauce Berry",
      "Wild Cranberry",
    ],
    "common_names": [
      "Fresh Cranberry",
    ]
  },
  {
    "slug": "gooseberry",
    "display_name": "Gooseberry",
    "parent_group": "berries",
    "scientific_name": "Ribes uva-crispa",
    "usage_intensity": "accent",
    "summary": "Gooseberry is a tart translucent berry for British fools, pies, and savory chutney — its sharp green fruit acidity pairs with Sauvignon Blanc, dry rosé, and off-dry Chenin Blanc.",
    "aliases": [
      "Green Gooseberry",
      "Red Gooseberry",
      "Hairless Gooseberry",
    ],
    "common_names": [
      "Green Gooseberry",
    ]
  },
  {
    "slug": "red-currant",
    "display_name": "Red Currant",
    "parent_group": "berries",
    "scientific_name": "Ribes rubrum",
    "usage_intensity": "accent",
    "summary": "Red currant offers jewel-like tart berry acidity for French tarts, jus, and game garnish — its transparent sourness pairs with sparkling wine, Loire reds, and off-dry Riesling.",
    "aliases": [
      "Fresh Red Currant",
      "Redcurrant",
      "Groseille",
    ],
    "common_names": [
      "Redcurrant",
    ]
  },
  {
    "slug": "black-currant",
    "display_name": "Black Currant",
    "parent_group": "berries",
    "scientific_name": "Ribes nigrum",
    "usage_intensity": "accent",
    "summary": "Black currant delivers intense cassis depth to sauces, liqueur, and British summer pudding — its earthy tartness pairs with Cabernet Sauvignon, Burgundy, and cassis-forward reds.",
    "aliases": [
      "Cassis Berry",
      "Fresh Black Currant",
      "Blackcurrant",
    ],
    "common_names": [
      "Cassis Berry",
    ]
  },
  {
    "slug": "elderberry",
    "display_name": "Elderberry",
    "parent_group": "berries",
    "scientific_name": "Sambucus nigra",
    "usage_intensity": "accent",
    "summary": "Elderberry brings dark winey berry depth to syrups, cordials, and foraged preserves — its earthy tartness pairs with Port-style reds, dry cider, and spiced dessert wines.",
    "aliases": [
      "Wild Elderberry",
      "Elder Berry",
      "Sambucus Berry",
    ],
    "common_names": [
      "Elder Berry",
    ]
  },
  {
    "slug": "mulberry",
    "display_name": "Mulberry",
    "parent_group": "berries",
    "scientific_name": "Morus alba",
    "usage_intensity": "accent",
    "summary": "Mulberry offers honeyed dark berry sweetness with gentle tannin in pies, syrups, and Middle Eastern drinks — its mellow fruit pairs with Moscato, off-dry whites, and light Italian reds.",
    "aliases": [
      "White Mulberry",
      "Black Mulberry",
      "Red Mulberry",
    ],
    "common_names": [
      "Black Mulberry",
    ]
  },
  {
    "slug": "boysenberry",
    "display_name": "Boysenberry",
    "parent_group": "berries",
    "scientific_name": "Rubus ursinus × idaeus",
    "usage_intensity": "accent",
    "summary": "Boysenberry is a large hybrid berry with bramble sweetness and jammy depth in pies and preserves — its rich berry character pairs with Zinfandel, off-dry rosé, and American fruit-forward reds.",
    "aliases": [
      "Fresh Boysenberry",
      "Boysen Berry",
    ],
    "common_names": [
      "Boysen Berry",
    ]
  },
  {
    "slug": "loganberry",
    "display_name": "Loganberry",
    "parent_group": "berries",
    "scientific_name": "Rubus × loganobaccus",
    "usage_intensity": "accent",
    "summary": "Loganberry is a raspberry-blackberry cross with tart winey juice for jams and British summer desserts — its sharp berry depth pairs with Beaujolais, off-dry sparkling, and crisp whites.",
    "aliases": [
      "Fresh Loganberry",
      "Logan Berry",
    ],
    "common_names": [
      "Logan Berry",
    ]
  },
  {
    "slug": "cloudberry",
    "display_name": "Cloudberry",
    "parent_group": "berries",
    "scientific_name": "Rubus chamaemorus",
    "usage_intensity": "luxury",
    "summary": "Cloudberry is a Nordic luxury amber berry with honeyed tartness in liqueurs and cloudberry cream — its arctic perfume pairs with aquavit, off-dry Riesling, and dessert sparkling wine.",
    "aliases": [
      "Bakeapple",
      "Arctic Cloudberry",
      "Salmonberry Relative",
    ],
    "common_names": [
      "Bakeapple",
    ]
  },
  {
    "slug": "lingonberry",
    "display_name": "Lingonberry",
    "parent_group": "berries",
    "scientific_name": "Vaccinium vitis-idaea",
    "usage_intensity": "accent",
    "summary": "Lingonberry delivers Scandinavian tart berry brightness to meatballs, game, and jam — its clean acidity pairs with dry cider, light Pinot Noir, and off-dry German whites.",
    "aliases": [
      "Cowberry",
      "Mountain Cranberry",
      "Partridgeberry",
    ],
    "common_names": [
      "Cowberry",
    ]
  },
  {
    "slug": "huckleberry",
    "display_name": "Huckleberry",
    "parent_group": "berries",
    "scientific_name": "Vaccinium membranaceum",
    "usage_intensity": "accent",
    "summary": "Huckleberry is a wild Pacific Northwest berry with intense winey sweetness in pies and foraged preserves — its deep berry character pairs with Pinot Noir, Zinfandel, and off-dry rosé.",
    "aliases": [
      "Wild Huckleberry",
      "Mountain Huckleberry",
      "Black Huckleberry",
    ],
    "common_names": [
      "Wild Huckleberry",
    ]
  },
  {
    "slug": "marionberry",
    "display_name": "Marionberry",
    "parent_group": "berries",
    "scientific_name": "Rubus L. subgenus",
    "usage_intensity": "accent",
    "summary": "Marionberry is Oregon's prized trailing blackberry cultivar with jammy intensity for pies and syrup — its concentrated berry depth pairs with Oregon Pinot Noir, Zinfandel, and off-dry whites.",
    "aliases": [
      "Marion Blackberry",
      "Fresh Marionberry",
    ],
    "common_names": [
      "Marion Blackberry",
    ]
  },
  {
    "slug": "acai",
    "display_name": "Açaí",
    "parent_group": "berries",
    "scientific_name": "Euterpe oleracea",
    "usage_intensity": "luxury",
    "summary": "Açaí is a Brazilian luxury dark berry with earthy chocolate undertones in bowls and smoothies — its antioxidant depth pairs with tropical fruit wines, off-dry whites, and light sparkling styles.",
    "aliases": [
      "Acai Berry",
      "Açaí Berry",
      "Acai Puree",
    ],
    "common_names": [
      "Acai Berry",
    ]
  },
  {
    "slug": "goji-berry",
    "display_name": "Goji Berry",
    "parent_group": "berries",
    "scientific_name": "Lycium barbarum",
    "usage_intensity": "accent",
    "summary": "Goji berry is a dried-fresh Asian berry with tomato-sweet herbal notes in soups, tea, and health bowls — its mild tartness pairs with off-dry Riesling, light reds, and aromatic whites.",
    "aliases": [
      "Wolfberry",
      "Lycium Berry",
      "Fresh Goji",
    ],
    "common_names": [
      "Wolfberry",
    ]
  },
  {
    "slug": "barberry",
    "display_name": "Barberry",
    "parent_group": "berries",
    "scientific_name": "Berberis vulgaris",
    "usage_intensity": "accent",
    "summary": "Barberry is a tart crimson berry essential to Persian rice and Georgian sauces — its sharp sour berry punch pairs with aromatic whites, Georgian amber wine, and off-dry styles.",
    "aliases": [
      "Zereshk",
      "Berberis Berry",
      "European Barberry",
    ],
    "common_names": [
      "Zereshk",
    ]
  },
  {
    "slug": "sea-buckthorn",
    "display_name": "Sea Buckthorn",
    "parent_group": "berries",
    "scientific_name": "Hippophae rhamnoides",
    "usage_intensity": "accent",
    "summary": "Sea buckthorn is a Nordic coastal berry with intense sour-orange oil for juice, sauce, and health products — its sharp acidity pairs with off-dry Riesling, sparkling wine, and crisp whites.",
    "aliases": [
      "Sea Buckthorn Berry",
      "Sandthorn",
      "Sallow Thorn Berry",
    ],
    "common_names": [
      "Sandthorn",
    ]
  },
  {
    "slug": "wineberry",
    "display_name": "Wineberry",
    "parent_group": "berries",
    "scientific_name": "Rubus phoenicolasius",
    "usage_intensity": "accent",
    "summary": "Wineberry is an Asian bramble berry with raspberry-like sweetness and orange-red glow in foraged jams — its bright berry character pairs with Beaujolais, off-dry rosé, and light reds.",
    "aliases": [
      "Japanese Wineberry",
      "Wine Raspberry",
      "Wild Wineberry",
    ],
    "common_names": [
      "Japanese Wineberry",
    ]
  },
  {
    "slug": "tayberry",
    "display_name": "Tayberry",
    "parent_group": "berries",
    "scientific_name": "Rubus fruticosus × idaeus",
    "usage_intensity": "accent",
    "summary": "Tayberry is a Scottish raspberry-blackberry hybrid with long conical fruit for preserves and dessert — its jammy sweetness pairs with Scotch whisky-friendly reds, off-dry whites, and rosé.",
    "aliases": [
      "Tay Berry",
      "Fresh Tayberry",
    ],
    "common_names": [
      "Tay Berry",
    ]
  },
  {
    "slug": "juniper-berry",
    "display_name": "Juniper Berry",
    "parent_group": "berries",
    "scientific_name": "Juniperus communis",
    "usage_intensity": "accent",
    "summary": "Juniper berry is the piney gin botanical with resinous berry character in game, sauerkraut, and Nordic cooking — its aromatic bitterness pairs with gin, dry cider, and structured rustic reds.",
    "aliases": [
      "Gin Berry",
      "Common Juniper Berry",
      "Wild Juniper",
    ],
    "common_names": [
      "Gin Berry",
    ]
  },

  // —— Tropical Fruits (22) ——
  {
    "slug": "mango",
    "display_name": "Mango",
    "parent_group": "tropical-fruits",
    "scientific_name": "Mangifera indica",
    "usage_intensity": "primary",
    "summary": "Mango is the king of tropical fruits — its lush sweetness and resinous perfume drive chutney, salsa, and desserts that pair with Gewürztraminer, off-dry Riesling, and tropical sparkling wine.",
    "aliases": [
      "Diced Mango",
      "Ripe Mango",
      "Ataulfo Mango",
      "Alphonso Mango",
      "Green Mango",
    ],
    "common_names": [
      "Alphonso Mango",
    ]
  },
  {
    "slug": "pineapple",
    "display_name": "Pineapple",
    "parent_group": "tropical-fruits",
    "scientific_name": "Ananas comosus",
    "usage_intensity": "primary",
    "summary": "Pineapple delivers tropical acidity and caramel sweetness when grilled or raw in Hawaiian and Caribbean dishes — its enzymatic brightness pairs with rum, off-dry Riesling, and aromatic whites.",
    "aliases": [
      "Fresh Pineapple",
      "Grilled Pineapple",
      "Pineapple Rings",
      "Golden Pineapple",
    ],
    "common_names": [
      "Fresh Pineapple",
    ]
  },
  {
    "slug": "papaya",
    "display_name": "Papaya",
    "parent_group": "tropical-fruits",
    "scientific_name": "Carica papaya",
    "usage_intensity": "primary",
    "summary": "Papaya offers musky tropical sweetness and tender flesh in Thai salads, smoothies, and Latin salsas — its soft fruit character pairs with Sauvignon Blanc, tropical whites, and light lager.",
    "aliases": [
      "Pawpaw",
      "Red Papaya",
      "Green Papaya",
      "Maradol Papaya",
    ],
    "common_names": [
      "Pawpaw",
    ]
  },
  {
    "slug": "banana",
    "display_name": "Banana",
    "parent_group": "tropical-fruits",
    "scientific_name": "Musa acuminata",
    "usage_intensity": "primary",
    "summary": "Banana is the ubiquitous tropical fruit with creamy sweetness in desserts, curries, and breakfast — its mellow starch-sugar balance pairs with rum, off-dry whites, and dessert sparkling wine.",
    "aliases": [
      "Ripe Banana",
      "Sliced Banana",
      "Cavendish Banana",
      "Lady Finger Banana",
    ],
    "common_names": [
      "Cavendish Banana",
    ]
  },
  {
    "slug": "coconut",
    "display_name": "Coconut",
    "parent_group": "tropical-fruits",
    "scientific_name": "Cocos nucifera",
    "usage_intensity": "primary",
    "summary": "Coconut is the fresh tropical fruit with water, flesh, and aromatic fat for curries, desserts, and Southeast Asian cooking — its creamy sweetness pairs with tropical whites, rum, and off-dry styles.",
    "aliases": [
      "Fresh Coconut",
      "Coconut Flesh",
      "Young Coconut",
      "Coconut Water Fruit",
    ],
    "common_names": [
      "Fresh Coconut",
    ]
  },
  {
    "slug": "avocado",
    "display_name": "Avocado",
    "parent_group": "tropical-fruits",
    "scientific_name": "Persea americana",
    "usage_intensity": "primary",
    "summary": "Avocado is a creamy tropical fruit with buttery fat and subtle grassiness in guacamole, toast, and sushi — its rich texture pairs with Sauvignon Blanc, crisp lager, and New World whites.",
    "aliases": [
      "Hass Avocado",
      "Ripe Avocado",
      "Sliced Avocado",
      "Fuerte Avocado",
    ],
    "common_names": [
      "Hass Avocado",
    ]
  },
  {
    "slug": "passion-fruit",
    "display_name": "Passion Fruit",
    "parent_group": "tropical-fruits",
    "scientific_name": "Passiflora edulis",
    "usage_intensity": "accent",
    "summary": "Passion fruit delivers explosive tart tropical perfume in mousses, cocktails, and pavlova — its aromatic acidity pairs with Moscato, off-dry sparkling, and New Zealand Sauvignon Blanc.",
    "aliases": [
      "Maracuya",
      "Purple Passion Fruit",
      "Passionfruit Pulp",
    ],
    "common_names": [
      "Maracuya",
    ]
  },
  {
    "slug": "lychee",
    "display_name": "Lychee",
    "parent_group": "tropical-fruits",
    "scientific_name": "Litchi chinensis",
    "usage_intensity": "accent",
    "summary": "Lychee is a floral tropical fruit with rose-perfumed sweetness in Asian desserts and cocktails — its delicate aroma pairs with Gewürztraminer, off-dry Riesling, and aromatic sparkling wine.",
    "aliases": [
      "Litchi",
      "Fresh Lychee",
      "Lychee Fruit",
    ],
    "common_names": [
      "Litchi",
    ]
  },
  {
    "slug": "dragon-fruit",
    "display_name": "Dragon Fruit",
    "parent_group": "tropical-fruits",
    "scientific_name": "Hylocereus undatus",
    "usage_intensity": "accent",
    "summary": "Dragon fruit offers mild kiwi-like tropical sweetness with dramatic magenta or white flesh in bowls and garnish — its subtle flavor pairs with off-dry whites, tropical fruit wine, and light sparkling.",
    "aliases": [
      "Pitaya",
      "Pitahaya",
      "Red Dragon Fruit",
      "White Dragon Fruit",
    ],
    "common_names": [
      "Pitaya",
    ]
  },
  {
    "slug": "guava",
    "display_name": "Guava",
    "parent_group": "tropical-fruits",
    "scientific_name": "Psidium guajava",
    "usage_intensity": "accent",
    "summary": "Guava brings tropical musk and pear-strawberry sweetness to Latin pastries, agua fresca, and cheese — its fragrant pulp pairs with Prosecco, off-dry whites, and tropical aromatic styles.",
    "aliases": [
      "Pink Guava",
      "White Guava",
      "Fresh Guava",
      "Guava Paste Fruit",
    ],
    "common_names": [
      "Pink Guava",
    ]
  },
  {
    "slug": "pomegranate",
    "display_name": "Pomegranate",
    "parent_group": "tropical-fruits",
    "scientific_name": "Punica granatum",
    "usage_intensity": "primary",
    "summary": "Pomegranate delivers jewel-like arils with tannic crunch and bright acidity in Persian, Middle Eastern, and modern salads — its astringent sweetness pairs with Syrah, Grenache, and off-dry rosé.",
    "aliases": [
      "Pomegranate Arils",
      "Pomegranate Seeds",
      "Fresh Pomegranate",
    ],
    "common_names": [
      "Pomegranate Arils",
    ]
  },
  {
    "slug": "fig",
    "display_name": "Fig",
    "parent_group": "tropical-fruits",
    "scientific_name": "Ficus carica",
    "usage_intensity": "primary",
    "summary": "Fig is a honeyed Mediterranean fruit with jammy flesh and skin tannin on cheese boards and prosciutto — its lush sweetness pairs with Port, Sauternes, and structured Mediterranean reds.",
    "aliases": [
      "Fresh Fig",
      "Black Mission Fig",
      "Brown Turkey Fig",
      "Calimyrna Fig",
    ],
    "common_names": [
      "Black Mission Fig",
    ]
  },
  {
    "slug": "date",
    "display_name": "Date",
    "parent_group": "tropical-fruits",
    "scientific_name": "Phoenix dactylifera",
    "usage_intensity": "primary",
    "summary": "Fresh date is a caramel-sweet Middle Eastern fruit with chewy flesh in tagines, stuffing, and hospitality platters — its rich sweetness pairs with Moroccan reds, off-dry whites, and fortified wine.",
    "aliases": [
      "Medjool Date",
      "Deglet Noor Date",
      "Fresh Date Fruit",
    ],
    "common_names": [
      "Medjool Date",
    ]
  },
  {
    "slug": "kiwi",
    "display_name": "Kiwi",
    "parent_group": "tropical-fruits",
    "scientific_name": "Actinidia deliciosa",
    "usage_intensity": "primary",
    "summary": "Kiwi delivers vivid green acidity and tropical-strawberry perfume in fruit salad and pavlova — its enzymatic tartness pairs with Sauvignon Blanc, off-dry Riesling, and New Zealand whites.",
    "aliases": [
      "Kiwifruit",
      "Green Kiwi",
      "Gold Kiwi",
      "Sliced Kiwi",
    ],
    "common_names": [
      "Kiwifruit",
    ]
  },
  {
    "slug": "persimmon",
    "display_name": "Persimmon",
    "parent_group": "tropical-fruits",
    "scientific_name": "Diospyros kaki",
    "usage_intensity": "accent",
    "summary": "Persimmon offers honeyed autumn sweetness with jelly-soft flesh when ripe in salads and Japanese wagashi — its mellow fruit depth pairs with off-dry whites, Moscato, and light dessert wine.",
    "aliases": [
      "Fuyu Persimmon",
      "Hachiya Persimmon",
      "Sharon Fruit",
      "Ripe Persimmon",
    ],
    "common_names": [
      "Fuyu Persimmon",
    ]
  },
  {
    "slug": "starfruit",
    "display_name": "Starfruit",
    "parent_group": "tropical-fruits",
    "scientific_name": "Averrhoa carambola",
    "usage_intensity": "accent",
    "summary": "Starfruit is a waxy tropical fruit with grape-like acidity and citrus-apple perfume in Southeast Asian salads — its crisp tartness pairs with aromatic whites, lager, and off-dry sparkling wine.",
    "aliases": [
      "Carambola",
      "Star Fruit",
      "Sliced Starfruit",
    ],
    "common_names": [
      "Carambola",
    ]
  },
  {
    "slug": "rambutan",
    "display_name": "Rambutan",
    "parent_group": "tropical-fruits",
    "scientific_name": "Nephelium lappaceum",
    "usage_intensity": "accent",
    "summary": "Rambutan is a hairy lychee cousin with grape-like tropical sweetness in Southeast Asian fruit platters — its mild perfume pairs with off-dry Riesling, tropical whites, and light sparkling wine.",
    "aliases": [
      "Rambutan Fruit",
      "Hairy Lychee",
      "Fresh Rambutan",
    ],
    "common_names": [
      "Hairy Lychee",
    ]
  },
  {
    "slug": "mangosteen",
    "display_name": "Mangosteen",
    "parent_group": "tropical-fruits",
    "scientific_name": "Garcinia mangostana",
    "usage_intensity": "luxury",
    "summary": "Mangosteen is the queen of tropical luxury fruits with floral segments and delicate tartness — its refined sweetness pairs with off-dry sparkling, Gewürztraminer, and dessert wine.",
    "aliases": [
      "Purple Mangosteen",
      "Mangosteen Segments",
      "Queen of Fruits",
    ],
    "common_names": [
      "Purple Mangosteen",
    ]
  },
  {
    "slug": "durian",
    "display_name": "Durian",
    "parent_group": "tropical-fruits",
    "scientific_name": "Durio zibethinus",
    "usage_intensity": "luxury",
    "summary": "Durian is a polarizing Southeast Asian luxury fruit with custard flesh and pungent aroma — its rich savory-sweet depth pairs with sweet dessert wine, tropical fruit styles, and off-dry whites.",
    "aliases": [
      "King of Fruits",
      "Durian Flesh",
      "Monthong Durian",
    ],
    "common_names": [
      "Monthong Durian",
    ]
  },
  {
    "slug": "jackfruit",
    "display_name": "Jackfruit",
    "parent_group": "tropical-fruits",
    "scientific_name": "Artocarpus heterophyllus",
    "usage_intensity": "primary",
    "summary": "Jackfruit is a massive tropical fruit with fibrous sweet flesh used in curries, desserts, and plant-based cooking — its tropical starch-sweet character pairs with aromatic whites, lager, and off-dry styles.",
    "aliases": [
      "Young Jackfruit",
      "Ripe Jackfruit",
      "Jackfruit Flesh",
    ],
    "common_names": [
      "Ripe Jackfruit",
    ]
  },
  {
    "slug": "plantain",
    "display_name": "Plantain",
    "parent_group": "tropical-fruits",
    "scientific_name": "Musa × paradisiaca",
    "usage_intensity": "primary",
    "summary": "Plantain is a starchy cooking banana with savory-sweet depth when fried or baked in Caribbean and West African cuisine — its caramelized starch pairs with rum, tropical whites, and off-dry rosé.",
    "aliases": [
      "Green Plantain",
      "Ripe Plantain",
      "Fried Plantain",
      "Plátano",
    ],
    "common_names": [
      "Plátano",
    ]
  },
  {
    "slug": "tamarind",
    "display_name": "Tamarind",
    "parent_group": "tropical-fruits",
    "scientific_name": "Tamarindus indica",
    "usage_intensity": "accent",
    "summary": "Tamarind is a sour pod tropical fruit with date-like sweetness in pad thai, chutney, and agua fresca — its tangy depth pairs with Gewürztraminer, off-dry Riesling, and spice-friendly whites.",
    "aliases": [
      "Tamarind Pulp",
      "Sour Tamarind",
      "Tamarind Paste Fruit",
    ],
    "common_names": [
      "Tamarind Pulp",
    ]
  },

  // —— Melons (9) ——
  {
    "slug": "watermelon",
    "display_name": "Watermelon",
    "parent_group": "melons",
    "scientific_name": "Citrullus lanatus",
    "usage_intensity": "primary",
    "summary": "Watermelon is the quintessential summer melon with crisp hydration and subtle sweetness in salads, gazpacho, and feta pairings — its refreshing character pairs with rosé, Prosecco, and dry sparkling wine.",
    "aliases": [
      "Seedless Watermelon",
      "Watermelon Cubes",
      "Watermelon Wedges",
      "Mini Watermelon",
    ],
    "common_names": [
      "Seedless Watermelon",
    ]
  },
  {
    "slug": "cantaloupe",
    "display_name": "Cantaloupe",
    "parent_group": "melons",
    "scientific_name": "Cucumis melo",
    "usage_intensity": "primary",
    "summary": "Cantaloupe delivers musky orange flesh and floral sweetness in fruit platters and prosciutto wraps — its aromatic melon depth pairs with Prosciutto di Parma, Moscato, and off-dry sparkling wine.",
    "aliases": [
      "Rockmelon",
      "Muskmelon",
      "Cantaloupe Melon",
      "Cantaloupe Wedges",
    ],
    "common_names": [
      "Rockmelon",
    ]
  },
  {
    "slug": "honeydew",
    "display_name": "Honeydew",
    "parent_group": "melons",
    "scientific_name": "Cucumis melo",
    "usage_intensity": "primary",
    "summary": "Honeydew is a pale green melon with mild honey sweetness and smooth flesh for fruit salad and sorbet — its gentle character pairs with off-dry Riesling, Moscato, and light sparkling wine.",
    "aliases": [
      "Honeydew Melon",
      "Green Melon",
      "Honeydew Wedges",
      "Honeydew Balls",
    ],
    "common_names": [
      "Honeydew Melon",
    ]
  },
  {
    "slug": "galia-melon",
    "display_name": "Galia Melon",
    "parent_group": "melons",
    "scientific_name": "Cucumis melo",
    "usage_intensity": "accent",
    "summary": "Galia melon is an Israeli netted melon with tropical perfume and juicy green flesh — its aromatic sweetness pairs with off-dry whites, Prosecco, and Mediterranean rosé.",
    "aliases": [
      "Galia",
      "Israeli Melon",
      "Netted Galia Melon",
    ],
    "common_names": [
      "Galia",
    ]
  },
  {
    "slug": "casaba-melon",
    "display_name": "Casaba Melon",
    "parent_group": "melons",
    "scientific_name": "Cucumis melo",
    "usage_intensity": "accent",
    "summary": "Casaba melon is a winter melon with pale flesh and mild cucumber-honey flavor — its subtle sweetness pairs with crisp whites, off-dry sparkling, and light aromatic styles.",
    "aliases": [
      "Casaba",
      "Winter Melon",
      "Golden Casaba",
    ],
    "common_names": [
      "Casaba",
    ]
  },
  {
    "slug": "crenshaw-melon",
    "display_name": "Crenshaw Melon",
    "parent_group": "melons",
    "scientific_name": "Cucumis melo",
    "usage_intensity": "accent",
    "summary": "Crenshaw melon is a hybrid with spicy-sweet aroma and salmon-orange flesh for premium fruit platters — its lush perfume pairs with off-dry whites, Moscato, and dessert sparkling wine.",
    "aliases": [
      "Crenshaw",
      "Cranshaw Melon",
      "Crenshaw Wedges",
    ],
    "common_names": [
      "Crenshaw",
    ]
  },
  {
    "slug": "canary-melon",
    "display_name": "Canary Melon",
    "parent_group": "melons",
    "scientific_name": "Cucumis melo",
    "usage_intensity": "accent",
    "summary": "Canary melon is a bright yellow melon with crisp ivory flesh and delicate sweetness — its clean melon character pairs with Prosecco, off-dry Riesling, and light sparkling wine.",
    "aliases": [
      "Canary",
      "San Juan Canary Melon",
      "Yellow Melon",
    ],
    "common_names": [
      "Canary",
    ]
  },
  {
    "slug": "piel-de-sapo",
    "display_name": "Piel de Sapo",
    "parent_group": "melons",
    "scientific_name": "Cucumis melo",
    "usage_intensity": "accent",
    "summary": "Piel de Sapo is a Spanish toad-skin melon with dense sweet green flesh and long shelf life — its honeyed character pairs with sherry, off-dry whites, and Mediterranean sparkling wine.",
    "aliases": [
      "Santa Claus Melon",
      "Christmas Melon",
      "Toad Skin Melon",
    ],
    "common_names": [
      "Santa Claus Melon",
    ]
  },
  {
    "slug": "horned-melon",
    "display_name": "Horned Melon",
    "parent_group": "melons",
    "scientific_name": "Cucumis metuliferus",
    "usage_intensity": "accent",
    "summary": "Horned melon is an African kiwano with jelly-green seeds and cucumber-banana flavor for garnish and novelty plates — its mild tartness pairs with Sauvignon Blanc, off-dry whites, and sparkling wine.",
    "aliases": [
      "Kiwano",
      "African Horned Melon",
      "Jelly Melon",
    ],
    "common_names": [
      "Kiwano",
    ]
  },

  // —— Processed Fruits (18) ——
  {
    "slug": "raisin",
    "display_name": "Raisin",
    "parent_group": "processed-fruits",
    "scientific_name": "Vitis vinifera",
    "usage_intensity": "accent",
    "summary": "Raisin is the dried grape with concentrated sweetness and chewy texture in pilaf, tagine, and baking — distinct from fresh grape, it pairs with Sherry, Port, and off-dry dessert wines.",
    "aliases": [
      "Dark Raisin",
      "Thompson Raisin",
      "Seedless Raisin",
    ],
    "common_names": [
      "Thompson Raisin",
    ]
  },
  {
    "slug": "prune",
    "display_name": "Prune",
    "parent_group": "processed-fruits",
    "scientific_name": "Prunus domestica",
    "usage_intensity": "accent",
    "summary": "Prune is the dried plum with deep molasses sweetness and soft chew in tagines, stuffing, and compote — distinct from fresh plum, it pairs with Port, Armagnac, and rich Mediterranean reds.",
    "aliases": [
      "Dried Plum",
      "Pitted Prune",
      "Agen Prune",
      "California Prune",
    ],
    "common_names": [
      "Dried Plum",
    ]
  },
  {
    "slug": "desiccated-coconut",
    "display_name": "Desiccated Coconut",
    "parent_group": "processed-fruits",
    "scientific_name": "Cocos nucifera",
    "usage_intensity": "accent",
    "summary": "Desiccated coconut is dried shredded coconut flesh for baking, curries, and confection — distinct from fresh coconut, its concentrated aroma pairs with tropical whites, rum, and off-dry styles.",
    "aliases": [
      "Shredded Coconut",
      "Dried Coconut Flakes",
      "Unsweetened Desiccated Coconut",
    ],
    "common_names": [
      "Shredded Coconut",
    ]
  },
  {
    "slug": "coconut-milk",
    "display_name": "Coconut Milk",
    "parent_group": "processed-fruits",
    "scientific_name": "Cocos nucifera",
    "usage_intensity": "accent",
    "summary": "Coconut milk is pressed fruit liquid with creamy fat for curries, desserts, and Southeast Asian broths — distinct from fresh coconut, it pairs with aromatic whites, lager, and off-dry tropical styles.",
    "aliases": [
      "Canned Coconut Milk",
      "Full-Fat Coconut Milk",
      "Lite Coconut Milk",
    ],
    "common_names": [
      "Canned Coconut Milk",
    ]
  },
  {
    "slug": "dried-fig",
    "display_name": "Dried Fig",
    "parent_group": "processed-fruits",
    "scientific_name": "Ficus carica",
    "usage_intensity": "accent",
    "summary": "Dried fig concentrates honeyed Mediterranean sweetness with seed crunch for cheese boards and baking — distinct from fresh fig, it pairs with Port, Sauternes, and aged hard cheese.",
    "aliases": [
      "Calimyrna Dried Fig",
      "Mission Dried Fig",
      "Turkish Dried Fig",
    ],
    "common_names": [
      "Turkish Dried Fig",
    ]
  },
  {
    "slug": "dried-apricot",
    "display_name": "Dried Apricot",
    "parent_group": "processed-fruits",
    "scientific_name": "Prunus armeniaca",
    "usage_intensity": "accent",
    "summary": "Dried apricot delivers concentrated honey-tart stone fruit in tagines, stuffing, and trail mix — distinct from fresh apricot, it pairs with Gewürztraminer, off-dry whites, and Moroccan reds.",
    "aliases": [
      "Turkish Dried Apricot",
      "California Dried Apricot",
      "Sulfured Dried Apricot",
    ],
    "common_names": [
      "Turkish Dried Apricot",
    ]
  },
  {
    "slug": "dried-cranberry",
    "display_name": "Dried Cranberry",
    "parent_group": "processed-fruits",
    "scientific_name": "Vaccinium macrocarpon",
    "usage_intensity": "accent",
    "summary": "Dried cranberry offers sweet-tart berry chew in salads, baking, and granola — distinct from fresh cranberry, its candy-tartness pairs with off-dry Riesling, Pinot Noir, and sparkling wine.",
    "aliases": [
      "Craisins",
      "Sweetened Dried Cranberry",
      "Dried Cranberries",
    ],
    "common_names": [
      "Craisins",
    ]
  },
  {
    "slug": "dried-mango",
    "display_name": "Dried Mango",
    "parent_group": "processed-fruits",
    "scientific_name": "Mangifera indica",
    "usage_intensity": "accent",
    "summary": "Dried mango concentrates tropical sweetness and chewy texture in snacking and chutney — distinct from fresh mango, its lush fruit depth pairs with off-dry Riesling, rum, and tropical whites.",
    "aliases": [
      "Dried Mango Slices",
      "Unsulfured Dried Mango",
      "Philippine Dried Mango",
    ],
    "common_names": [
      "Dried Mango Slices",
    ]
  },
  {
    "slug": "banana-chips",
    "display_name": "Banana Chips",
    "parent_group": "processed-fruits",
    "scientific_name": "Musa acuminata",
    "usage_intensity": "accent",
    "summary": "Banana chips are crisp fried or dehydrated banana slices with caramelized sweetness — distinct from fresh banana, they pair with rum, tropical fruit wine, and off-dry dessert whites.",
    "aliases": [
      "Dried Banana Chips",
      "Sweet Banana Chips",
      "Plantain Chips",
    ],
    "common_names": [
      "Dried Banana Chips",
    ]
  },
  {
    "slug": "currants",
    "display_name": "Currants",
    "parent_group": "processed-fruits",
    "scientific_name": "Vitis vinifera",
    "usage_intensity": "accent",
    "summary": "Currants are tiny dried Zante grapes with intense sweetness in scones, mincemeat, and British baking — distinct from fresh currant berries, they pair with Sherry, Port, and fortified wine.",
    "aliases": [
      "Zante Currants",
      "Dried Currants",
      "Corinth Currants",
    ],
    "common_names": [
      "Zante Currants",
    ]
  },
  {
    "slug": "sultanas",
    "display_name": "Sultanas",
    "parent_group": "processed-fruits",
    "scientific_name": "Vitis vinifera",
    "usage_intensity": "accent",
    "summary": "Sultanas are golden dried grapes softer and sweeter than raisins in British baking and pilaf — distinct from fresh grape, they pair with Sherry, off-dry whites, and light dessert wine.",
    "aliases": [
      "Golden Sultanas",
      "Sultanina Raisins",
      "White Raisins",
    ],
    "common_names": [
      "Golden Sultanas",
    ]
  },
  {
    "slug": "golden-raisin",
    "display_name": "Golden Raisin",
    "parent_group": "processed-fruits",
    "scientific_name": "Vitis vinifera",
    "usage_intensity": "accent",
    "summary": "Golden raisin is a sulfur-treated dried grape with honeyed sweetness in Persian rice and pilaf — distinct from fresh grape, it pairs with off-dry Riesling, aromatic whites, and Mediterranean reds.",
    "aliases": [
      "Golden Raisins",
      "Blond Raisin",
      "Sulfured Golden Raisin",
    ],
    "common_names": [
      "Golden Raisins",
    ]
  },
  {
    "slug": "dried-cherry",
    "display_name": "Dried Cherry",
    "parent_group": "processed-fruits",
    "scientific_name": "Prunus avium",
    "usage_intensity": "accent",
    "summary": "Dried cherry concentrates tart-sweet stone fruit for granola, chocolate, and salad — distinct from fresh cherry, its chewy depth pairs with Pinot Noir, off-dry rosé, and dessert sparkling wine.",
    "aliases": [
      "Tart Dried Cherry",
      "Montmorency Dried Cherry",
      "Sweet Dried Cherry",
    ],
    "common_names": [
      "Tart Dried Cherry",
    ]
  },
  {
    "slug": "dried-date",
    "display_name": "Dried Date",
    "parent_group": "processed-fruits",
    "scientific_name": "Phoenix dactylifera",
    "usage_intensity": "primary",
    "summary": "Dried date is the shelf-stable caramel fruit essential to Middle Eastern sweets and tagines — distinct from fresh date, its rich sweetness pairs with Moroccan reds, Port, and off-dry whites.",
    "aliases": [
      "Pitted Dried Date",
      "Chopped Dried Date",
      "Deglet Noor Dried Date",
    ],
    "common_names": [
      "Pitted Dried Date",
    ]
  },
  {
    "slug": "dried-blueberry",
    "display_name": "Dried Blueberry",
    "parent_group": "processed-fruits",
    "scientific_name": "Vaccinium corymbosum",
    "usage_intensity": "accent",
    "summary": "Dried blueberry concentrates mild berry sweetness with chewy skin in baking and trail mix — distinct from fresh blueberry, it pairs with Merlot, off-dry whites, and American fruit-forward reds.",
    "aliases": [
      "Dried Blueberries",
      "Sweetened Dried Blueberry",
    ],
    "common_names": [
      "Dried Blueberries",
    ]
  },
  {
    "slug": "dried-pineapple",
    "display_name": "Dried Pineapple",
    "parent_group": "processed-fruits",
    "scientific_name": "Ananas comosus",
    "usage_intensity": "accent",
    "summary": "Dried pineapple delivers concentrated tropical acidity and caramel chew in snacking and baking — distinct from fresh pineapple, it pairs with rum, off-dry Riesling, and tropical fruit wine.",
    "aliases": [
      "Dried Pineapple Rings",
      "Dried Pineapple Chunks",
      "Unsulfured Dried Pineapple",
    ],
    "common_names": [
      "Dried Pineapple Rings",
    ]
  },
  {
    "slug": "candied-orange-peel",
    "display_name": "Candied Orange Peel",
    "parent_group": "processed-fruits",
    "scientific_name": "Citrus sinensis",
    "usage_intensity": "accent",
    "summary": "Candied orange peel is crystallized citrus rind with bitter-sweet perfume in panettone, cocktails, and chocolate — distinct from fresh orange, it pairs with dessert wine, Moscato, and Champagne.",
    "aliases": [
      "Orange Peel Confit",
      "Crystallized Orange Peel",
      "Candied Citrus Peel",
    ],
    "common_names": [
      "Crystallized Orange Peel",
    ]
  },
  {
    "slug": "dried-apple",
    "display_name": "Dried Apple",
    "parent_group": "processed-fruits",
    "scientific_name": "Malus domestica",
    "usage_intensity": "accent",
    "summary": "Dried apple rings concentrate orchard sweetness and gentle tannin for snacking, granola, and baking — distinct from fresh apple, they pair with cider, off-dry Riesling, and structured Chardonnay.",
    "aliases": [
      "Apple Rings",
      "Dehydrated Apple",
      "Dried Apple Slices",
    ],
    "common_names": [
      "Apple Rings",
    ]
  }
];
