/**
 * FOOD-07B — Canonical culinary herb and spice seed data.
 * Each entry is one canonical culinary ingredient (CANON-001).
 */

/** @typedef {object} HerbSpiceSeed
 * @property {string} slug
 * @property {string} display_name
 * @property {"fresh-herbs"|"dried-herbs"|"whole-spices"|"ground-blended-spices"} parent_group
 * @property {string} scientific_name
 * @property {"primary"|"accent"|"luxury"} usage_intensity
 * @property {string[]} [aliases]
 * @property {string[]} [common_names]
 * @property {string} [origin_context]
 * @property {string} summary
 */

export const GROUP_SLUGS = [
  "fresh-herbs",
  "dried-herbs",
  "whole-spices",
  "ground-blended-spices",
];

export const GROUP_TO_CULINARY_GROUP = {
  "fresh-herbs": "fresh_herbs",
  "dried-herbs": "dried_herbs",
  "whole-spices": "whole_spices",
  "ground-blended-spices": "ground_blended_spices",
};

/** @type {HerbSpiceSeed[]} */
export const HERB_SPICE_SEED = [
  {
    "slug": "basil",
    "display_name": "Basil",
    "parent_group": "fresh-herbs",
    "scientific_name": "Ocimum basilicum",
    "usage_intensity": "primary",
    "summary": "Basil is the defining fresh herb of Mediterranean and Southeast Asian cooking — sweet peppery leaves anchor pesto, caprese, and Thai dishes that pair with Sauvignon Blanc and crisp whites.",
    "aliases": [
      "Sweet Basil",
      "Fresh Basil",
      "Dried Basil",
      "Genovese Basil",
      "Thai Basil"
    ],
    "common_names": [
      "Sweet Basil"
    ]
  },
  {
    "slug": "cilantro",
    "display_name": "Cilantro",
    "parent_group": "fresh-herbs",
    "scientific_name": "Coriandrum sativum",
    "usage_intensity": "primary",
    "summary": "Cilantro delivers bright citrus-soap leaf aroma essential to Latin, South Asian, and East Asian cuisines — its fresh character pairs with aromatic whites, lager, and high-acid reds.",
    "aliases": [
      "Fresh Coriander",
      "Chinese Parsley",
      "Coriander Leaf"
    ],
    "common_names": [
      "Coriander Leaves"
    ]
  },
  {
    "slug": "culantro",
    "display_name": "Culantro",
    "parent_group": "fresh-herbs",
    "scientific_name": "Eryngium foetidum",
    "usage_intensity": "accent",
    "summary": "Culantro is a spiny-leafed herb with intense cilantro-like flavor used in Caribbean and Central American sofritos — its bold aroma suits tropical whites and light lagers.",
    "aliases": [
      "Recao",
      "Spiritweed",
      "Long Coriander"
    ],
    "common_names": [
      "Recao"
    ]
  },
  {
    "slug": "parsley",
    "display_name": "Parsley",
    "parent_group": "fresh-herbs",
    "scientific_name": "Petroselinum crispum",
    "usage_intensity": "accent",
    "summary": "Parsley adds clean grassy freshness to European, Middle Eastern, and American finishing — flat and curly forms share one canonical identity paired with crisp whites and herb-friendly reds.",
    "aliases": [
      "Flat-Leaf Parsley",
      "Curly Parsley",
      "Italian Parsley",
      "Dried Parsley"
    ],
    "common_names": [
      "Flat-Leaf Parsley"
    ]
  },
  {
    "slug": "dill",
    "display_name": "Dill",
    "parent_group": "fresh-herbs",
    "scientific_name": "Anethum graveolens",
    "usage_intensity": "accent",
    "summary": "Dill offers feathery anise-herb brightness to Nordic fish, pickles, and Eastern European dishes — its delicate aroma pairs with dry Riesling, Grüner Veltliner, and sparkling wine.",
    "aliases": [
      "Dill Weed",
      "Fresh Dill",
      "Dill Leaves"
    ],
    "common_names": [
      "Dill Weed"
    ]
  },
  {
    "slug": "mint",
    "display_name": "Mint",
    "parent_group": "fresh-herbs",
    "scientific_name": "Mentha spicata",
    "usage_intensity": "accent",
    "summary": "Mint brings cooling sweetness to Middle Eastern salads, lamb, desserts, and cocktails — its aromatic lift pairs with Rosé, Moscatel, and mint-friendly aromatic whites.",
    "aliases": [
      "Spearmint",
      "Fresh Mint",
      "Peppermint Leaf",
      "Garden Mint"
    ],
    "common_names": [
      "Spearmint"
    ]
  },
  {
    "slug": "tarragon",
    "display_name": "Tarragon",
    "parent_group": "fresh-herbs",
    "scientific_name": "Artemisia dracunculus",
    "usage_intensity": "accent",
    "summary": "Tarragon carries subtle anise notes prized in French béarnaise, chicken, and egg dishes — its refined herbaceousness pairs with unoaked Chardonnay and elegant Loire whites.",
    "aliases": [
      "French Tarragon",
      "Fresh Tarragon",
      "Dried Tarragon"
    ],
    "common_names": [
      "French Tarragon"
    ]
  },
  {
    "slug": "chives",
    "display_name": "Chives",
    "parent_group": "fresh-herbs",
    "scientific_name": "Allium schoenoprasum",
    "usage_intensity": "accent",
    "summary": "Chives provide mild onion-grass garnish for eggs, potatoes, and cream sauces — their gentle allium note suits sparkling wine, crisp whites, and delicate fish pairings.",
    "aliases": [
      "Fresh Chives",
      "Dried Chives"
    ],
    "common_names": [
      "Snipped Chives"
    ]
  },
  {
    "slug": "lemongrass",
    "display_name": "Lemongrass",
    "parent_group": "fresh-herbs",
    "scientific_name": "Cymbopogon citratus",
    "usage_intensity": "accent",
    "summary": "Lemongrass infuses citrus-ginger aroma into Thai curries, soups, and marinades — its bright stalk character pairs with Gewürztraminer, Torrontés, and off-dry aromatic whites.",
    "aliases": [
      "Fresh Lemongrass",
      "Lemon Grass"
    ],
    "common_names": [
      "Lemon Grass"
    ]
  },
  {
    "slug": "shiso",
    "display_name": "Shiso",
    "parent_group": "fresh-herbs",
    "scientific_name": "Perilla frutescens",
    "usage_intensity": "accent",
    "summary": "Shiso is a Japanese and Korean herb with mint-basil-anise complexity — used raw with sashimi and pickles, it pairs with sake, Pinot Gris, and mineral-driven whites.",
    "aliases": [
      "Perilla",
      "Japanese Basil",
      "Kkaennip"
    ],
    "common_names": [
      "Perilla"
    ]
  },
  {
    "slug": "chervil",
    "display_name": "Chervil",
    "parent_group": "fresh-herbs",
    "scientific_name": "Anthriscus cerefolium",
    "usage_intensity": "accent",
    "summary": "Chervil is a delicate French fines herb with mild parsley-anise flavor — classic in omelets and sauces, it pairs with Champagne, Chablis, and light Sauvignon Blanc.",
    "aliases": [
      "French Parsley",
      "Garden Chervil"
    ],
    "common_names": [
      "Garden Chervil"
    ]
  },
  {
    "slug": "lemon-balm",
    "display_name": "Lemon Balm",
    "parent_group": "fresh-herbs",
    "scientific_name": "Melissa officinalis",
    "usage_intensity": "accent",
    "summary": "Lemon balm adds gentle citrus-mint aroma to teas, fish, and fruit desserts — its soft herbal brightness suits off-dry whites, Rosé, and aromatic sparkling wine.",
    "aliases": [
      "Melissa",
      "Balm Mint",
      "Common Balm"
    ],
    "common_names": [
      "Melissa"
    ]
  },
  {
    "slug": "epazote",
    "display_name": "Epazote",
    "parent_group": "fresh-herbs",
    "scientific_name": "Dysphania ambrosioides",
    "usage_intensity": "accent",
    "summary": "Epazote is a pungent Mexican herb essential to black beans and quesadillas — its assertive resinous note pairs with rustic Tempranillo, Mexican lagers, and high-acid whites.",
    "aliases": [
      "Mexican Tea",
      "Wormseed Herb",
      "Ipazote"
    ],
    "common_names": [
      "Mexican Tea"
    ]
  },
  {
    "slug": "curry-leaves",
    "display_name": "Curry Leaves",
    "parent_group": "fresh-herbs",
    "scientific_name": "Murraya koenigii",
    "usage_intensity": "accent",
    "summary": "Curry leaves release nutty citrus aroma when tempered in South Indian tadka — their distinctive fragrance pairs with aromatic whites, lager, and spice-friendly light reds.",
    "aliases": [
      "Sweet Neem Leaves",
      "Kadi Patta",
      "Kariveppilai"
    ],
    "common_names": [
      "Kadi Patta"
    ]
  },
  {
    "slug": "lovage",
    "display_name": "Lovage",
    "parent_group": "fresh-herbs",
    "scientific_name": "Levisticum officinale",
    "usage_intensity": "accent",
    "summary": "Lovage tastes like intense celery-parsley and seasons Central European broths and stocks — its savory depth pairs with mineral whites, Alsatian varieties, and light Pinot Noir.",
    "aliases": [
      "Garden Lovage",
      "Maggi Plant"
    ],
    "common_names": [
      "Maggi Plant"
    ]
  },
  {
    "slug": "garlic-chives",
    "display_name": "Garlic Chives",
    "parent_group": "fresh-herbs",
    "scientific_name": "Allium tuberosum",
    "usage_intensity": "accent",
    "summary": "Garlic chives combine mild chive and garlic notes in Chinese dumplings and pancakes — their gentle allium character suits Riesling, beer, and unoaked whites.",
    "aliases": [
      "Chinese Chives",
      "Nira",
      "Gau Choy"
    ],
    "common_names": [
      "Chinese Chives"
    ]
  },
  {
    "slug": "vietnamese-coriander",
    "display_name": "Vietnamese Coriander",
    "parent_group": "fresh-herbs",
    "scientific_name": "Persicaria odorata",
    "usage_intensity": "accent",
    "summary": "Vietnamese coriander delivers peppery cilantro-like leaf flavor in pho and salads — distinct from cilantro, it pairs with aromatic whites, lager, and bright Rosé.",
    "aliases": [
      "Rau Ram",
      "Hot Mint",
      "Laksa Leaf"
    ],
    "common_names": [
      "Rau Ram"
    ]
  },
  {
    "slug": "borage",
    "display_name": "Borage",
    "parent_group": "fresh-herbs",
    "scientific_name": "Borago officinalis",
    "usage_intensity": "accent",
    "summary": "Borage offers cucumber-flavored blue flowers and leaves to Mediterranean salads and cocktails — its cool herbal note pairs with Sauvignon Blanc and Provence Rosé.",
    "aliases": [
      "Starflower",
      "Bee Bread"
    ],
    "common_names": [
      "Starflower"
    ]
  },
  {
    "slug": "fennel-frond",
    "display_name": "Fennel Frond",
    "parent_group": "fresh-herbs",
    "scientific_name": "Foeniculum vulgare",
    "usage_intensity": "accent",
    "summary": "Fennel fronds add delicate anise-herb garnish to seafood and salads — distinct from the bulb owned by the Vegetable Ontology, they pair with Vermentino and coastal whites.",
    "aliases": [
      "Fennel Leaves",
      "Fennel Herb",
      "Fennel Tops"
    ],
    "common_names": [
      "Fennel Tops"
    ]
  },
  {
    "slug": "sorrel",
    "display_name": "Sorrel",
    "parent_group": "fresh-herbs",
    "scientific_name": "Rumex acetosa",
    "usage_intensity": "accent",
    "summary": "Sorrel contributes sharp lemony acidity to French sauces, soups, and spring salads — its bright sour leaf character pairs with Sauvignon Blanc, Sancerre, and dry Riesling.",
    "aliases": [
      "Garden Sorrel",
      "Common Sorrel",
      "French Sorrel"
    ],
    "common_names": [
      "Garden Sorrel"
    ]
  },
  {
    "slug": "pandan-leaf",
    "display_name": "Pandan Leaf",
    "parent_group": "fresh-herbs",
    "scientific_name": "Pandanus amaryllifolius",
    "usage_intensity": "accent",
    "summary": "Pandan leaf infuses coconut-pine aroma into Southeast Asian rice and desserts — its fragrant wrap character pairs with aromatic whites, lager, and off-dry styles.",
    "aliases": [
      "Screwpine Leaf",
      "Rampe",
      "Daun Pandan"
    ],
    "common_names": [
      "Daun Pandan"
    ]
  },
  {
    "slug": "anise-hyssop",
    "display_name": "Anise Hyssop",
    "parent_group": "fresh-herbs",
    "scientific_name": "Agastache foeniculum",
    "usage_intensity": "accent",
    "summary": "Anise hyssop brings licorice-mint sweetness to teas, fruit, and American herb gardens — its floral anise note pairs with Gewürztraminer, Muscat, and dessert wines.",
    "aliases": [
      "Licorice Mint",
      "Blue Giant Hyssop"
    ],
    "common_names": [
      "Licorice Mint"
    ]
  },
  {
    "slug": "salad-burnet",
    "display_name": "Salad Burnet",
    "parent_group": "fresh-herbs",
    "scientific_name": "Sanguisorba minor",
    "usage_intensity": "accent",
    "summary": "Salad burnet adds cucumber-pepper freshness to European salads and compound butters — its delicate green note pairs with crisp Loire whites and herb-friendly Sauvignon Blanc.",
    "aliases": [
      "Small Burnet",
      "Garden Burnet"
    ],
    "common_names": [
      "Small Burnet"
    ]
  },
  {
    "slug": "papalo",
    "display_name": "Papalo",
    "parent_group": "fresh-herbs",
    "scientific_name": "Porophyllum ruderale",
    "usage_intensity": "accent",
    "summary": "Papalo is a bold Mexican herb with cilantro-arugula intensity used on cemitas and tacos — its assertive green flavor pairs with Mexican lagers, high-acid whites, and rustic reds.",
    "aliases": [
      "Quilquina",
      "Papaloquelite",
      "Bolivian Coriander"
    ],
    "common_names": [
      "Quilquina"
    ]
  },
  {
    "slug": "mitsuba",
    "display_name": "Mitsuba",
    "parent_group": "fresh-herbs",
    "scientific_name": "Cryptotaenia japonica",
    "usage_intensity": "accent",
    "summary": "Mitsuba is a Japanese trefoil herb with celery-parsley aroma used in chawanmushi and soups — its subtle fines-herb character pairs with sake, light sake-style whites, and delicate fish wines.",
    "aliases": [
      "Japanese Parsley",
      "Trefoil",
      "White Chervil"
    ],
    "common_names": [
      "Japanese Parsley"
    ]
  },
  {
    "slug": "oregano",
    "display_name": "Oregano",
    "parent_group": "dried-herbs",
    "scientific_name": "Origanum vulgare",
    "usage_intensity": "accent",
    "summary": "Dried oregano is the backbone of Greek, Italian, and Mexican seasoning — its warm camphor aroma pairs with Sangiovese, Agiorghitiko, and rustic Mediterranean reds.",
    "aliases": [
      "Dried Oregano",
      "Mediterranean Oregano",
      "Wild Oregano"
    ],
    "common_names": [
      "Greek Oregano"
    ]
  },
  {
    "slug": "thyme",
    "display_name": "Thyme",
    "parent_group": "dried-herbs",
    "scientific_name": "Thymus vulgaris",
    "usage_intensity": "accent",
    "summary": "Dried thyme adds earthy pine-herb depth to roasts, stews, and Provençal dishes — its savory note pairs with Syrah, Bandol, and structured Rhône reds.",
    "aliases": [
      "Dried Thyme",
      "Common Thyme",
      "French Thyme"
    ],
    "common_names": [
      "Common Thyme"
    ]
  },
  {
    "slug": "rosemary",
    "display_name": "Rosemary",
    "parent_group": "dried-herbs",
    "scientific_name": "Salvia rosmarinus",
    "usage_intensity": "accent",
    "summary": "Dried rosemary delivers resinous pine aroma to lamb, potatoes, and focaccia — its bold Mediterranean character pairs with Cabernet Sauvignon, Tempranillo, and oaked whites.",
    "aliases": [
      "Dried Rosemary",
      "Rosmarinus officinalis"
    ],
    "common_names": [
      "Rosmarinus"
    ]
  },
  {
    "slug": "sage",
    "display_name": "Sage",
    "parent_group": "dried-herbs",
    "scientific_name": "Salvia officinalis",
    "usage_intensity": "accent",
    "summary": "Dried sage brings musky eucalyptus depth to brown butter, poultry stuffing, and Italian saltimbocca — its assertive herb pairs with Chardonnay, Verdicchio, and earthy reds.",
    "aliases": [
      "Dried Sage",
      "Common Sage",
      "Garden Sage"
    ],
    "common_names": [
      "Common Sage"
    ]
  },
  {
    "slug": "bay-leaf",
    "display_name": "Bay Leaf",
    "parent_group": "dried-herbs",
    "scientific_name": "Laurus nobilis",
    "usage_intensity": "accent",
    "summary": "Bay leaf infuses subtle camphor-tea aroma into braises, stocks, and Mediterranean stews — its background herbal note supports full-bodied reds and savory white wines.",
    "aliases": [
      "Dried Bay Leaf",
      "Laurel Leaf",
      "Sweet Bay",
      "Turkish Bay Leaf"
    ],
    "common_names": [
      "Laurel"
    ]
  },
  {
    "slug": "marjoram",
    "display_name": "Marjoram",
    "parent_group": "dried-herbs",
    "scientific_name": "Origanum majorana",
    "usage_intensity": "accent",
    "summary": "Dried marjoram offers sweet mild oregano-like warmth to German sausages and tomato sauces — its gentle herbal note pairs with Pinot Noir, Gamay, and lighter Italian reds.",
    "aliases": [
      "Sweet Marjoram",
      "Dried Marjoram",
      "Knotted Marjoram"
    ],
    "common_names": [
      "Sweet Marjoram"
    ]
  },
  {
    "slug": "mexican-oregano",
    "display_name": "Mexican Oregano",
    "parent_group": "dried-herbs",
    "scientific_name": "Lippia graveolens",
    "usage_intensity": "accent",
    "summary": "Mexican oregano is a citrusy verbena-family herb central to chili, mole, and Tex-Mex — its distinct aroma pairs with Zinfandel, Mexican beer, and smoky reds.",
    "aliases": [
      "Dried Mexican Oregano",
      "Oregano Cimmaron"
    ],
    "common_names": [
      "Oregano Cimmaron"
    ]
  },
  {
    "slug": "summer-savory",
    "display_name": "Summer Savory",
    "parent_group": "dried-herbs",
    "scientific_name": "Satureja hortensis",
    "usage_intensity": "accent",
    "summary": "Summer savory adds peppery thyme-like warmth to bean dishes and grilled meats — a classic fines herb paired with Beaujolais, rustic whites, and herb-driven reds.",
    "aliases": [
      "Dried Summer Savory",
      "Bohnenkraut"
    ],
    "common_names": [
      "Bohnenkraut"
    ]
  },
  {
    "slug": "winter-savory",
    "display_name": "Winter Savory",
    "parent_group": "dried-herbs",
    "scientific_name": "Satureja montana",
    "usage_intensity": "accent",
    "summary": "Winter savory delivers stronger pepper-pine flavor than summer savory in stews and game — its robust herbal note pairs with Syrah, Cabernet Franc, and earthy reds.",
    "aliases": [
      "Dried Winter Savory",
      "Mountain Savory"
    ],
    "common_names": [
      "Mountain Savory"
    ]
  },
  {
    "slug": "fenugreek-leaves",
    "display_name": "Fenugreek Leaves",
    "parent_group": "dried-herbs",
    "scientific_name": "Trigonella foenum-graecum",
    "usage_intensity": "accent",
    "summary": "Dried fenugreek leaves (kasuri methi) add maple-bitter depth to Indian curries and breads — their distinctive aroma pairs with aromatic whites, lager, and spice-tolerant reds.",
    "aliases": [
      "Kasuri Methi",
      "Dried Methi Leaves",
      "Kasoori Methi"
    ],
    "common_names": [
      "Kasuri Methi"
    ]
  },
  {
    "slug": "kaffir-lime-leaves",
    "display_name": "Kaffir Lime Leaves",
    "parent_group": "dried-herbs",
    "scientific_name": "Citrus hystrix",
    "usage_intensity": "accent",
    "summary": "Kaffir lime leaves release intense citrus-floral aroma in Thai curries and soups — their fragrant essential-oil character pairs with Riesling, Gewürztraminer, and tropical whites.",
    "aliases": [
      "Makrut Lime Leaves",
      "Dried Kaffir Lime Leaf",
      "Bai Magrood"
    ],
    "common_names": [
      "Makrut Lime Leaves"
    ]
  },
  {
    "slug": "celery-leaf",
    "display_name": "Celery Leaf",
    "parent_group": "dried-herbs",
    "scientific_name": "Apium graveolens",
    "usage_intensity": "accent",
    "summary": "Dried celery leaf adds concentrated grassy-salty herb to stocks, Bloody Mary seasoning, and soup bases — its savory lift pairs with Sauvignon Blanc and crisp high-acid whites.",
    "aliases": [
      "Dried Celery Leaves",
      "Celery Herb",
      "Leaf Celery"
    ],
    "common_names": [
      "Leaf Celery"
    ]
  },
  {
    "slug": "hyssop",
    "display_name": "Hyssop",
    "parent_group": "dried-herbs",
    "scientific_name": "Hyssopus officinalis",
    "usage_intensity": "accent",
    "summary": "Dried hyssop contributes minty camphor notes to Mediterranean liqueurs, stews, and herb blends — its aromatic intensity pairs with Rhône whites and herb-friendly reds.",
    "aliases": [
      "Dried Hyssop",
      "Holy Herb"
    ],
    "common_names": [
      "Holy Herb"
    ]
  },
  {
    "slug": "lavender",
    "display_name": "Lavender",
    "parent_group": "dried-herbs",
    "scientific_name": "Lavandula angustifolia",
    "usage_intensity": "accent",
    "summary": "Culinary lavender adds floral perfume to Herbes de Provence, honey, and desserts — used sparingly, it pairs with Rosé, Muscat, and aromatic Mediterranean whites.",
    "aliases": [
      "Dried Lavender",
      "Culinary Lavender",
      "Lavande"
    ],
    "common_names": [
      "Culinary Lavender"
    ]
  },
  {
    "slug": "lemon-myrtle",
    "display_name": "Lemon Myrtle",
    "parent_group": "dried-herbs",
    "scientific_name": "Backhousia citriodora",
    "usage_intensity": "accent",
    "summary": "Lemon myrtle is an Australian leaf spice with intense lemon-citral aroma — its bright character pairs with Sauvignon Blanc, Vermentino, and citrus-friendly whites.",
    "aliases": [
      "Dried Lemon Myrtle",
      "Sweet Verbena Tree"
    ],
    "common_names": [
      "Sweet Verbena Tree"
    ]
  },
  {
    "slug": "savory",
    "display_name": "Savory",
    "parent_group": "dried-herbs",
    "scientific_name": "Satureja spp.",
    "usage_intensity": "accent",
    "summary": "Savory is a peppery European herb seasoning beans, grilled meats, and Alpine dishes — its warm herbal note pairs with Gamay, Pinot Noir, and rustic mountain whites.",
    "aliases": [
      "Dried Savory",
      "Bean Herb"
    ],
    "common_names": [
      "Bean Herb"
    ]
  },
  {
    "slug": "hoja-santa",
    "display_name": "Hoja Santa",
    "parent_group": "dried-herbs",
    "scientific_name": "Piper auritum",
    "usage_intensity": "accent",
    "summary": "Hoja Santa is a Mexican sacred leaf with root beer-anise aroma used in mole verde and fish — its distinctive flavor pairs with Mexican lagers, high-acid whites, and smoky reds.",
    "aliases": [
      "Sacred Pepper Leaf",
      "Mexican Pepperleaf",
      "Acuyo"
    ],
    "common_names": [
      "Acuyo"
    ]
  },
  {
    "slug": "indian-bay-leaf",
    "display_name": "Indian Bay Leaf",
    "parent_group": "dried-herbs",
    "scientific_name": "Cinnamomum tamala",
    "usage_intensity": "accent",
    "summary": "Indian bay leaf (tejpat) adds cinnamon-clove depth distinct from Mediterranean laurel — essential in biryani and dal, it pairs with aromatic whites and spice-friendly reds.",
    "aliases": [
      "Tejpat",
      "Tej Patta",
      "Malabar Leaf"
    ],
    "common_names": [
      "Tejpat"
    ]
  },
  {
    "slug": "boldo",
    "display_name": "Boldo",
    "parent_group": "dried-herbs",
    "scientific_name": "Peumus boldus",
    "usage_intensity": "accent",
    "summary": "Boldo is a Chilean leaf herb with camphor-eucalyptus aroma used in empanadas and digestifs — its bold herbal note pairs with Carmenère, rustic reds, and mineral whites.",
    "aliases": [
      "Boldo Leaf",
      "Peumo Leaf"
    ],
    "common_names": [
      "Peumo Leaf"
    ]
  },
  {
    "slug": "rue",
    "display_name": "Rue",
    "parent_group": "dried-herbs",
    "scientific_name": "Ruta graveolens",
    "usage_intensity": "accent",
    "summary": "Rue is a bitter Mediterranean herb used sparingly in Ethiopian berbere and old European recipes — its intense aroma pairs with robust reds and requires restrained wine pairing.",
    "aliases": [
      "Dried Rue",
      "Herb of Grace",
      "Common Rue"
    ],
    "common_names": [
      "Herb of Grace"
    ]
  },
  {
    "slug": "black-pepper",
    "display_name": "Black Pepper",
    "parent_group": "whole-spices",
    "scientific_name": "Piper nigrum",
    "usage_intensity": "primary",
    "summary": "Black pepper is the world's most essential spice — pungent piperine heat finishes savory dishes globally and pairs with virtually every red and white wine style.",
    "aliases": [
      "Ground Black Pepper",
      "Tellicherry Pepper",
      "Malabar Pepper",
      "Whole Black Peppercorns"
    ],
    "common_names": [
      "Peppercorn"
    ]
  },
  {
    "slug": "white-pepper",
    "display_name": "White Pepper",
    "parent_group": "whole-spices",
    "scientific_name": "Piper nigrum",
    "usage_intensity": "accent",
    "summary": "White pepper delivers fermented earthy heat without dark specks — prized in French white sauces and Asian soups, it pairs with Chardonnay, Riesling, and delicate fish wines.",
    "aliases": [
      "Ground White Pepper",
      "Whole White Peppercorns",
      "Muntok White Pepper"
    ],
    "common_names": [
      "White Peppercorn"
    ]
  },
  {
    "slug": "green-peppercorn",
    "display_name": "Green Peppercorn",
    "parent_group": "whole-spices",
    "scientific_name": "Piper nigrum",
    "usage_intensity": "accent",
    "summary": "Green peppercorns offer fresh fruity heat in Thai curries and French steak au poivre vert — their mild pungency pairs with Sauvignon Blanc, Chenin Blanc, and light reds.",
    "aliases": [
      "Fresh Green Pepper",
      "Brined Green Peppercorn"
    ],
    "common_names": [
      "Green Pepper"
    ]
  },
  {
    "slug": "pink-peppercorn",
    "display_name": "Pink Peppercorn",
    "parent_group": "whole-spices",
    "scientific_name": "Schinus terebinthifolia",
    "usage_intensity": "accent",
    "summary": "Pink peppercorns add mild fruity resinous spice to fish and game — not true pepper, their delicate heat pairs with Rosé, Pinot Noir, and aromatic whites.",
    "aliases": [
      "Baies Rose",
      "Brazilian Peppercorn"
    ],
    "common_names": [
      "Baies Rose"
    ]
  },
  {
    "slug": "coriander-seed",
    "display_name": "Coriander Seed",
    "parent_group": "whole-spices",
    "scientific_name": "Coriandrum sativum",
    "usage_intensity": "accent",
    "summary": "Coriander seed delivers warm citrus-sage aroma distinct from cilantro leaf — essential in Indian, Middle Eastern, and pickling spice, it pairs with Gewürztraminer and spice-friendly whites.",
    "aliases": [
      "Whole Coriander",
      "Dhania Seed",
      "Ground Coriander"
    ],
    "common_names": [
      "Dhania"
    ]
  },
  {
    "slug": "dill-seed",
    "display_name": "Dill Seed",
    "parent_group": "whole-spices",
    "scientific_name": "Anethum graveolens",
    "usage_intensity": "accent",
    "summary": "Dill seed offers caraway-like warmth to pickles, rye bread, and Eastern European dishes — distinct from dill weed, it pairs with Riesling, lager, and light Nordic whites.",
    "aliases": [
      "Whole Dill Seed",
      "Dill Seeds"
    ],
    "common_names": [
      "Dill Seeds"
    ]
  },
  {
    "slug": "cinnamon",
    "display_name": "Cinnamon",
    "parent_group": "whole-spices",
    "scientific_name": "Cinnamomum verum",
    "usage_intensity": "accent",
    "summary": "Cinnamon is warm sweet bark essential to baking, Moroccan tagines, and mulled wine — its aromatic sweetness pairs with Port, off-dry Riesling, and spiced dessert wines.",
    "aliases": [
      "Ceylon Cinnamon",
      "Cassia Cinnamon",
      "Vietnamese Cinnamon",
      "Cinnamon Stick",
      "Ground Cinnamon"
    ],
    "common_names": [
      "Ceylon Cinnamon"
    ]
  },
  {
    "slug": "nutmeg",
    "display_name": "Nutmeg",
    "parent_group": "whole-spices",
    "scientific_name": "Myristica fragrans",
    "usage_intensity": "accent",
    "summary": "Nutmeg adds warm sweet-spice depth to béchamel, eggnog, and holiday baking — freshly grated, it pairs with oaked Chardonnay, Sauternes, and aromatic whites.",
    "aliases": [
      "Whole Nutmeg",
      "Ground Nutmeg",
      "Mace Nutmeg"
    ],
    "common_names": [
      "Jaiphal"
    ]
  },
  {
    "slug": "clove",
    "display_name": "Clove",
    "parent_group": "whole-spices",
    "scientific_name": "Syzygium aromaticum",
    "usage_intensity": "accent",
    "summary": "Clove delivers intense eugenol warmth to ham, mulled wine, and Indian garam masala — its powerful aroma pairs with Zinfandel, Port, and full-bodied spiced reds.",
    "aliases": [
      "Whole Clove",
      "Ground Clove",
      "Clove Bud"
    ],
    "common_names": [
      "Laung"
    ]
  },
  {
    "slug": "green-cardamom",
    "display_name": "Green Cardamom",
    "parent_group": "whole-spices",
    "scientific_name": "Elettaria cardamomum",
    "usage_intensity": "accent",
    "summary": "Green cardamom is floral citrus pod spice central to chai, Scandinavian baking, and biryani — its perfumed warmth pairs with Gewürztraminer, off-dry whites, and aromatic reds.",
    "aliases": [
      "Cardamom Pod",
      "True Cardamom",
      "Ground Cardamom"
    ],
    "common_names": [
      "Elaichi"
    ]
  },
  {
    "slug": "black-cardamom",
    "display_name": "Black Cardamom",
    "parent_group": "whole-spices",
    "scientific_name": "Amomum subulatum",
    "usage_intensity": "accent",
    "summary": "Black cardamom adds smoky camphor depth to Indian dal and Chinese braises — its robust aroma pairs with Syrah, Malbec, and full-bodied spice-friendly reds.",
    "aliases": [
      "Brown Cardamom",
      "Large Cardamom",
      "Nepal Cardamom"
    ],
    "common_names": [
      "Badi Elaichi"
    ]
  },
  {
    "slug": "cumin-seed",
    "display_name": "Cumin Seed",
    "parent_group": "whole-spices",
    "scientific_name": "Cuminum cyminum",
    "usage_intensity": "accent",
    "summary": "Cumin seed is earthy warm backbone of Mexican, Indian, and Middle Eastern cooking — its toasty aroma pairs with Tempranillo, Syrah, and rustic Mediterranean reds.",
    "aliases": [
      "Whole Cumin",
      "Ground Cumin",
      "Jeera"
    ],
    "common_names": [
      "Jeera"
    ]
  },
  {
    "slug": "fennel-seed",
    "display_name": "Fennel Seed",
    "parent_group": "whole-spices",
    "scientific_name": "Foeniculum vulgare",
    "usage_intensity": "accent",
    "summary": "Fennel seed adds sweet licorice warmth to Italian sausage, Indian tempering, and rye bread — distinct from the vegetable bulb, it pairs with Sangiovese and aromatic whites.",
    "aliases": [
      "Whole Fennel Seed",
      "Saunf",
      "Ground Fennel"
    ],
    "common_names": [
      "Saunf"
    ]
  },
  {
    "slug": "mustard-seed",
    "display_name": "Mustard Seed",
    "parent_group": "whole-spices",
    "scientific_name": "Brassica nigra",
    "usage_intensity": "accent",
    "summary": "Mustard seed delivers pungent heat when cracked in Indian tadka and pickling — distinct from mustard greens in the Vegetable Ontology, it pairs with Riesling and German whites.",
    "aliases": [
      "Yellow Mustard Seed",
      "Brown Mustard Seed",
      "Black Mustard Seed",
      "Ground Mustard"
    ],
    "common_names": [
      "Rai"
    ]
  },
  {
    "slug": "allspice",
    "display_name": "Allspice",
    "parent_group": "whole-spices",
    "scientific_name": "Pimenta dioica",
    "usage_intensity": "accent",
    "summary": "Allspice combines clove-cinnamon-nutmeg warmth in Caribbean jerk and holiday baking — its complex berry spice pairs with Zinfandel, rum-friendly desserts, and oaked whites.",
    "aliases": [
      "Jamaica Pepper",
      "Pimento Berry",
      "Ground Allspice"
    ],
    "common_names": [
      "Pimento"
    ]
  },
  {
    "slug": "star-anise",
    "display_name": "Star Anise",
    "parent_group": "whole-spices",
    "scientific_name": "Illicium verum",
    "usage_intensity": "accent",
    "summary": "Star anise adds licorice sweetness to Chinese braises, pho, and mulled wine — its intense aroma pairs with Syrah, aromatic whites, and spice-tolerant reds.",
    "aliases": [
      "Badian",
      "Chinese Star Anise",
      "Whole Star Anise"
    ],
    "common_names": [
      "Badian"
    ]
  },
  {
    "slug": "juniper-berry",
    "display_name": "Juniper Berry",
    "parent_group": "whole-spices",
    "scientific_name": "Juniperus communis",
    "usage_intensity": "accent",
    "summary": "Juniper berry defines gin and Nordic game dishes with pine-resin aroma — its forest character pairs with gin, Syrah, and earthy northern European reds.",
    "aliases": [
      "Gin Berry",
      "Common Juniper",
      "Dried Juniper"
    ],
    "common_names": [
      "Gin Berry"
    ]
  },
  {
    "slug": "caraway-seed",
    "display_name": "Caraway Seed",
    "parent_group": "whole-spices",
    "scientific_name": "Carum carvi",
    "usage_intensity": "accent",
    "summary": "Caraway seed adds rye-bread anise warmth to Eastern European stews and sauerkraut — its distinctive seed spice pairs with Riesling, lager, and Alpine whites.",
    "aliases": [
      "Whole Caraway",
      "Meridian Fennel",
      "Ground Caraway"
    ],
    "common_names": [
      "Kümmel"
    ]
  },
  {
    "slug": "celery-seed",
    "display_name": "Celery Seed",
    "parent_group": "whole-spices",
    "scientific_name": "Apium graveolens",
    "usage_intensity": "accent",
    "summary": "Celery seed concentrates grassy-salty celery flavor in pickling spice and coleslaw — its savory seed note pairs with Sauvignon Blanc and crisp high-acid whites.",
    "aliases": [
      "Whole Celery Seed",
      "Ground Celery Seed"
    ],
    "common_names": [
      "Celery Seed"
    ]
  },
  {
    "slug": "fenugreek-seed",
    "display_name": "Fenugreek Seed",
    "parent_group": "whole-spices",
    "scientific_name": "Trigonella foenum-graecum",
    "usage_intensity": "accent",
    "summary": "Fenugreek seed adds maple-bitter depth to Indian curry powder and pickles — its distinctive seed character pairs with aromatic whites and spice-friendly light reds.",
    "aliases": [
      "Methi Seed",
      "Ground Fenugreek",
      "Whole Fenugreek"
    ],
    "common_names": [
      "Methi"
    ]
  },
  {
    "slug": "nigella-seed",
    "display_name": "Nigella Seed",
    "parent_group": "whole-spices",
    "scientific_name": "Nigella sativa",
    "usage_intensity": "accent",
    "summary": "Nigella seed (kalonji) adds oregano-onion bitterness to naan, pickles, and Middle Eastern breads — its dark seed spice pairs with aromatic whites and rustic reds.",
    "aliases": [
      "Black Cumin",
      "Kalonji",
      "Charnushka"
    ],
    "common_names": [
      "Kalonji"
    ]
  },
  {
    "slug": "annatto-seed",
    "display_name": "Annatto Seed",
    "parent_group": "whole-spices",
    "scientific_name": "Bixa orellana",
    "usage_intensity": "accent",
    "summary": "Annatto seed (achiote) adds earthy peppery color to Latin sofrito and Yucatecan cochinita — its mild seed character pairs with Tempranillo, Mexican beer, and tropical whites.",
    "aliases": [
      "Achiote Seed",
      "Bija",
      "Roucou Seed"
    ],
    "common_names": [
      "Achiote"
    ]
  },
  {
    "slug": "saffron",
    "display_name": "Saffron",
    "parent_group": "whole-spices",
    "scientific_name": "Crocus sativus",
    "usage_intensity": "luxury",
    "summary": "Saffron is the world's most precious spice — honey-hay aroma elevates paella, risotto, and Persian rice with luxury pairing power for Champagne, aged whites, and elegant reds.",
    "aliases": [
      "Saffron Threads",
      "Spanish Saffron",
      "Persian Saffron",
      "Kashmiri Saffron"
    ],
    "common_names": [
      "Kesar"
    ]
  },
  {
    "slug": "vanilla-bean",
    "display_name": "Vanilla Bean",
    "parent_group": "whole-spices",
    "scientific_name": "Vanilla planifolia",
    "usage_intensity": "luxury",
    "summary": "Vanilla bean delivers floral sweet luxury to custards, chocolate, and fine desserts — its aromatic depth pairs with Sauternes, Port, Muscat, and oaked Chardonnay.",
    "aliases": [
      "Bourbon Vanilla",
      "Madagascar Vanilla",
      "Vanilla Pod",
      "Vanilla Extract"
    ],
    "common_names": [
      "Bourbon Vanilla"
    ]
  },
  {
    "slug": "mace",
    "display_name": "Mace",
    "parent_group": "whole-spices",
    "scientific_name": "Myristica fragrans",
    "usage_intensity": "accent",
    "summary": "Mace is the delicate lace aril of nutmeg with softer warm spice — used in béchamel and pickling, it pairs with oaked whites and aromatic dessert wines.",
    "aliases": [
      "Blade Mace",
      "Ground Mace",
      "Nutmeg Mace"
    ],
    "common_names": [
      "Javitri"
    ]
  },
  {
    "slug": "ginger",
    "display_name": "Ginger",
    "parent_group": "whole-spices",
    "scientific_name": "Zingiber officinale",
    "usage_intensity": "accent",
    "summary": "Fresh ginger root adds sharp citrus heat to Asian stir-fries, marinades, and baking — its pungent rhizome character pairs with Riesling, Gewürztraminer, and off-dry whites.",
    "aliases": [
      "Fresh Ginger",
      "Ground Ginger",
      "Ginger Root"
    ],
    "common_names": [
      "Adrak"
    ]
  },
  {
    "slug": "galangal",
    "display_name": "Galangal",
    "parent_group": "whole-spices",
    "scientific_name": "Alpinia galanga",
    "usage_intensity": "accent",
    "summary": "Galangal is a peppery pine rhizome essential to Thai tom kha and Indonesian rendang — sharper than ginger, it pairs with aromatic whites, lager, and spice-friendly reds.",
    "aliases": [
      "Thai Galangal",
      "Greater Galangal",
      "Ground Galangal"
    ],
    "common_names": [
      "Kha"
    ]
  },
  {
    "slug": "horseradish",
    "display_name": "Horseradish",
    "parent_group": "whole-spices",
    "scientific_name": "Armoracia rusticana",
    "usage_intensity": "accent",
    "summary": "Horseradish delivers sinus-clearing heat to beef, seafood cocktail sauce, and Eastern European dishes — its pungency pairs with bold reds, vodka, and full-bodied whites.",
    "aliases": [
      "Fresh Horseradish",
      "Prepared Horseradish",
      "Horseradish Root"
    ],
    "common_names": [
      "Meerrettich"
    ]
  },
  {
    "slug": "wasabi",
    "display_name": "Wasabi",
    "parent_group": "whole-spices",
    "scientific_name": "Eutrema japonicum",
    "usage_intensity": "accent",
    "summary": "Wasabi provides fleeting green heat to sushi and sashimi — distinct from horseradish, its fresh rhizome character pairs with sake, Champagne, and mineral-driven whites.",
    "aliases": [
      "Fresh Wasabi",
      "Wasabi Root",
      "Wasabi Paste"
    ],
    "common_names": [
      "Japanese Horseradish"
    ]
  },
  {
    "slug": "grains-of-paradise",
    "display_name": "Grains of Paradise",
    "parent_group": "whole-spices",
    "scientific_name": "Aframomum melegueta",
    "usage_intensity": "accent",
    "summary": "Grains of paradise add peppery floral heat to West African stews and craft beer — their complex seed spice pairs with Belgian ale, Syrah, and aromatic whites.",
    "aliases": [
      "Melegueta Pepper",
      "Alligator Pepper",
      "Guinea Pepper"
    ],
    "common_names": [
      "Melegueta Pepper"
    ]
  },
  {
    "slug": "long-pepper",
    "display_name": "Long Pepper",
    "parent_group": "whole-spices",
    "scientific_name": "Piper longum",
    "usage_intensity": "accent",
    "summary": "Long pepper delivers complex sweet heat predating black pepper in Indian and Roman cooking — its elongated catkin spice pairs with aromatic whites and spice-tolerant reds.",
    "aliases": [
      "Pippali",
      "Indian Long Pepper",
      "Balinese Long Pepper"
    ],
    "common_names": [
      "Pippali"
    ]
  },
  {
    "slug": "ajwain",
    "display_name": "Ajwain",
    "parent_group": "whole-spices",
    "scientific_name": "Trachyspermum ammi",
    "usage_intensity": "accent",
    "summary": "Ajwain (carom seed) adds thyme-oregano pungency to Indian paratha and lentil dishes — its sharp seed aroma pairs with lager, aromatic whites, and rustic reds.",
    "aliases": [
      "Carom Seed",
      "Bishop's Weed",
      "Omam"
    ],
    "common_names": [
      "Carom Seed"
    ]
  },
  {
    "slug": "cubeb-pepper",
    "display_name": "Cubeb Pepper",
    "parent_group": "whole-spices",
    "scientific_name": "Piper cubeba",
    "usage_intensity": "accent",
    "summary": "Cubeb pepper offers eucalyptus-pepper warmth used in Indonesian and medieval European spice blends — its aromatic heat pairs with Gewürztraminer and full-bodied reds.",
    "aliases": [
      "Tailed Pepper",
      "Java Pepper",
      "Ground Cubeb"
    ],
    "common_names": [
      "Tailed Pepper"
    ]
  },
  {
    "slug": "asafoetida",
    "display_name": "Asafoetida",
    "parent_group": "whole-spices",
    "scientific_name": "Ferula assa-foetida",
    "usage_intensity": "accent",
    "summary": "Asafoetida (hing) adds pungent allium-like umami to Indian dal when tempered in ghee — its resinous spice pairs with aromatic whites and spice-friendly light reds.",
    "aliases": [
      "Hing",
      "Devil's Dung",
      "Food of the Gods"
    ],
    "common_names": [
      "Hing"
    ]
  },
  {
    "slug": "mahleb",
    "display_name": "Mahleb",
    "parent_group": "whole-spices",
    "scientific_name": "Prunus mahaleb",
    "usage_intensity": "accent",
    "summary": "Mahleb is an cherry-pit spice with almond-cherry aroma in Greek Easter bread and Middle Eastern pastries — its delicate seed note pairs with dessert wines and oaked whites.",
    "aliases": [
      "Mahlab",
      "St. Lucie Cherry Kernel",
      "Ground Mahleb"
    ],
    "common_names": [
      "Mahlab"
    ]
  },
  {
    "slug": "tamarind",
    "display_name": "Tamarind",
    "parent_group": "whole-spices",
    "scientific_name": "Tamarindus indica",
    "usage_intensity": "accent",
    "summary": "Tamarind pulp adds sweet-sour fruit acidity to pad thai, chutney, and Mexican agua fresca — its tangy character pairs with Riesling, beer, and high-acid tropical whites.",
    "aliases": [
      "Tamarind Paste",
      "Tamarind Block",
      "Imli"
    ],
    "common_names": [
      "Imli"
    ]
  },
  {
    "slug": "paprika",
    "display_name": "Paprika",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Capsicum annuum",
    "usage_intensity": "accent",
    "summary": "Paprika is sweet to hot ground capsicum essential to Hungarian goulash, Spanish chorizo, and deviled eggs — its red powder warmth pairs with Tempranillo, Garnacha, and rustic reds.",
    "aliases": [
      "Sweet Paprika",
      "Hot Paprika",
      "Smoked Paprika",
      "Hungarian Paprika"
    ],
    "common_names": [
      "Sweet Paprika"
    ]
  },
  {
    "slug": "turmeric",
    "display_name": "Turmeric",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Curcuma longa",
    "usage_intensity": "accent",
    "summary": "Turmeric adds earthy golden warmth and color to Indian curries and golden milk — its mild bitter spice pairs with aromatic whites, lager, and spice-friendly rosé.",
    "aliases": [
      "Ground Turmeric",
      "Turmeric Powder",
      "Haldi"
    ],
    "common_names": [
      "Haldi"
    ]
  },
  {
    "slug": "cayenne-pepper",
    "display_name": "Cayenne Pepper",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Capsicum annuum",
    "usage_intensity": "accent",
    "summary": "Cayenne pepper delivers straightforward capsaicin heat to Cajun, Mexican, and hot sauce applications — its clean chili burn pairs with Zinfandel, beer, and bold fruit-forward reds.",
    "aliases": [
      "Ground Cayenne",
      "Red Cayenne",
      "Cayenne Powder"
    ],
    "common_names": [
      "Cayenne"
    ]
  },
  {
    "slug": "chili-powder",
    "display_name": "Chili Powder",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Capsicum annuum",
    "usage_intensity": "accent",
    "summary": "Chili powder blends ground chile with cumin and oregano for Tex-Mex — its savory heat pairs with Zinfandel, Mexican beer, and smoky Southwestern reds.",
    "aliases": [
      "Mexican Chili Powder",
      "Chile Powder",
      "Mild Chili Powder"
    ],
    "common_names": [
      "Chile Powder"
    ]
  },
  {
    "slug": "red-pepper-flakes",
    "display_name": "Red Pepper Flakes",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Capsicum annuum",
    "usage_intensity": "accent",
    "summary": "Red pepper flakes add rustic capsaicin heat to pizza, pasta aglio e olio, and Korean gochugaru-adjacent dishes — their flake heat pairs with Sangiovese, Primitivo, and spicy reds.",
    "aliases": [
      "Crushed Red Pepper",
      "Pepperoncino Flakes",
      "Dried Red Chili Flakes"
    ],
    "common_names": [
      "Crushed Red Pepper"
    ]
  },
  {
    "slug": "garam-masala",
    "display_name": "Garam Masala",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Garam masala is a warming North Indian spice blend of cardamom, cinnamon, and clove — its aromatic finish pairs with aromatic whites, lager, and spice-tolerant reds.",
    "aliases": [
      "Garam Masala Powder",
      "Whole Garam Masala",
      "Punjabi Garam Masala"
    ],
    "common_names": [
      "Garam Masala"
    ]
  },
  {
    "slug": "ras-el-hanout",
    "display_name": "Ras el Hanout",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Ras el hanout is a complex Moroccan spice blend with rose, cinnamon, and pepper — its layered aroma pairs with Moroccan reds, aromatic whites, and tagine-friendly wines.",
    "aliases": [
      "Rass el Hanout",
      "Moroccan Spice Blend"
    ],
    "common_names": [
      "Rass el Hanout"
    ]
  },
  {
    "slug": "chinese-five-spice",
    "display_name": "Chinese Five-Spice",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Chinese five-spice balances star anise, cinnamon, fennel, clove, and pepper — its sweet-savory blend pairs with Syrah, off-dry Riesling, and Peking duck wines.",
    "aliases": [
      "Five-Spice Powder",
      "Five Spice",
      "Wu Xiang Fen"
    ],
    "common_names": [
      "Five-Spice Powder"
    ]
  },
  {
    "slug": "herbes-de-provence",
    "display_name": "Herbes de Provence",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Herbes de Provence blends dried lavender, thyme, and rosemary for Provençal roasts — its Mediterranean mix pairs with Bandol Rosé, Syrah, and herb-driven southern French reds.",
    "aliases": [
      "Herbs de Provence",
      "Provencal Herb Blend"
    ],
    "common_names": [
      "Herbes de Provence"
    ]
  },
  {
    "slug": "zaatar",
    "display_name": "Za'atar",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Za'atar combines sumac, thyme, and sesame for Levantine flatbread and labneh — its tangy herbal blend pairs with Lebanese whites, Rosé, and Mediterranean reds.",
    "aliases": [
      "Zaatar",
      "Zatar",
      "Za'atar Spice Mix"
    ],
    "common_names": [
      "Zaatar"
    ]
  },
  {
    "slug": "sumac",
    "display_name": "Sumac",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Rhus coriaria",
    "usage_intensity": "accent",
    "summary": "Sumac adds lemony tartness without liquid to fattoush, kebab, and Middle Eastern salads — its sour crimson powder pairs with Lebanese whites, Rosé, and high-acid reds.",
    "aliases": [
      "Ground Sumac",
      "Sumac Powder",
      "Sicilian Sumac"
    ],
    "common_names": [
      "Sumac"
    ]
  },
  {
    "slug": "curry-powder",
    "display_name": "Curry Powder",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Curry powder is a British-Indian blend of turmeric, coriander, and cumin for golden curries — its warm yellow spice pairs with aromatic whites, lager, and off-dry styles.",
    "aliases": [
      "Madras Curry Powder",
      "Yellow Curry Powder",
      "Mild Curry Powder"
    ],
    "common_names": [
      "Curry Powder"
    ]
  },
  {
    "slug": "berbere",
    "display_name": "Berbere",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Berbere is a fiery Ethiopian spice blend with chile, fenugreek, and ginger — its complex heat pairs with Ethiopian honey wine, Syrah, and bold spice-friendly reds.",
    "aliases": [
      "Berber Spice",
      "Ethiopian Berbere",
      "Berbere Seasoning"
    ],
    "common_names": [
      "Berbere"
    ]
  },
  {
    "slug": "baharat",
    "display_name": "Baharat",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Baharat is a warm Middle Eastern seven-spice blend for kibbeh and grilled meats — its aromatic mix pairs with Lebanese reds, Rosé, and Mediterranean whites.",
    "aliases": [
      "Lebanese Seven Spice",
      "Arabic Spice Mix",
      "Gulf Baharat"
    ],
    "common_names": [
      "Seven Spice"
    ]
  },
  {
    "slug": "shichimi-togarashi",
    "display_name": "Shichimi Togarashi",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Shichimi togarashi is Japanese seven-spice with chili, citrus, and nori — its layered heat pairs with sake, lager, and mineral-driven whites with umami dishes.",
    "aliases": [
      "Shichimi",
      "Seven Spice",
      "Nanami Togarashi"
    ],
    "common_names": [
      "Shichimi"
    ]
  },
  {
    "slug": "dukkah",
    "display_name": "Dukkah",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Dukkah is an Egyptian nut-seed-spice blend for bread dipping and crusting — its crunchy aromatic mix pairs with crisp whites, Rosé, and Mediterranean reds.",
    "aliases": [
      "Dukka",
      "Egyptian Dukkah",
      "Duqqa"
    ],
    "common_names": [
      "Dukka"
    ]
  },
  {
    "slug": "chaat-masala",
    "display_name": "Chaat Masala",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Chaat masala adds tangy amchur-salt spice to Indian street snacks and fruit — its sour-salty blend pairs with lager, aromatic whites, and off-dry sparkling wine.",
    "aliases": [
      "Chaat Spice",
      "Chaat Masala Powder"
    ],
    "common_names": [
      "Chaat Masala"
    ]
  },
  {
    "slug": "panch-phoron",
    "display_name": "Panch Phoron",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Panch phoron is a Bengali whole-spice blend of fenugreek, nigella, and cumin — its tempering mix pairs with aromatic whites, lager, and spice-friendly light reds.",
    "aliases": [
      "Panch Puran",
      "Bengali Five Spice",
      "Paanch Phoron"
    ],
    "common_names": [
      "Panch Puran"
    ]
  },
  {
    "slug": "quatre-epices",
    "display_name": "Quatre Épices",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Quatre épices blends pepper, clove, nutmeg, and ginger for French charcuterie — its warm quartet pairs with Burgundy reds, Rhône whites, and pâté-friendly wines.",
    "aliases": [
      "Four Spices",
      "French Four Spice",
      "Quatre Epices"
    ],
    "common_names": [
      "Four Spices"
    ]
  },
  {
    "slug": "harissa-spice",
    "display_name": "Harissa Spice",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Harissa spice blend delivers smoky chile heat for Tunisian paste and marinades — its fiery mix pairs with Syrah, Moroccan reds, and aromatic Mediterranean whites.",
    "aliases": [
      "Dry Harissa",
      "Harissa Powder",
      "Harissa Seasoning"
    ],
    "common_names": [
      "Harissa"
    ]
  },
  {
    "slug": "aleppo-pepper",
    "display_name": "Aleppo Pepper",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Capsicum annuum",
    "usage_intensity": "accent",
    "summary": "Aleppo pepper adds fruity moderate heat with sun-dried complexity to Middle Eastern dips — its flake warmth pairs with Lebanese whites, Rosé, and Mediterranean reds.",
    "aliases": [
      "Halaby Pepper",
      "Pul Biber",
      "Aleppo Chili Flakes"
    ],
    "common_names": [
      "Pul Biber"
    ]
  },
  {
    "slug": "urfa-biber",
    "display_name": "Urfa Biber",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Capsicum annuum",
    "usage_intensity": "accent",
    "summary": "Urfa biber is a smoky Turkish chili with wine-dark fruit and moderate heat — its raisin-like spice pairs with Turkish reds, Rosé, and kebab-friendly wines.",
    "aliases": [
      "Isot Pepper",
      "Urfa Chili",
      "Turkish Black Chili"
    ],
    "common_names": [
      "Isot Pepper"
    ]
  },
  {
    "slug": "kashmiri-chili",
    "display_name": "Kashmiri Chili",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Capsicum annuum",
    "usage_intensity": "accent",
    "summary": "Kashmiri chili adds vivid red color and mild heat to Indian tandoori and rogan josh — its decorative warmth pairs with aromatic whites and spice-friendly light reds.",
    "aliases": [
      "Kashmiri Mirch",
      "Kashmiri Chili Powder",
      "Deggi Mirch"
    ],
    "common_names": [
      "Kashmiri Mirch"
    ]
  },
  {
    "slug": "ancho-chile-powder",
    "display_name": "Ancho Chile Powder",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Capsicum annuum",
    "usage_intensity": "accent",
    "summary": "Ancho chile powder delivers mild fruity raisin heat from dried poblano — essential to mole and chili, it pairs with Zinfandel, Mexican beer, and smoky reds.",
    "aliases": [
      "Ancho Powder",
      "Dried Ancho Chile",
      "Ancho Chili Powder"
    ],
    "common_names": [
      "Ancho Chile"
    ]
  },
  {
    "slug": "chipotle-powder",
    "display_name": "Chipotle Powder",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Capsicum annuum",
    "usage_intensity": "accent",
    "summary": "Chipotle powder adds smoky jalapeño heat to adobo, barbecue, and Mexican salsas — its mesquite warmth pairs with Zinfandel, Tempranillo, and bold smoky reds.",
    "aliases": [
      "Chipotle Chili Powder",
      "Smoked Jalapeño Powder",
      "Meco Chipotle Powder"
    ],
    "common_names": [
      "Chipotle"
    ]
  },
  {
    "slug": "old-bay-seasoning",
    "display_name": "Old Bay Seasoning",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Old Bay seasoning blends celery salt, paprika, and mustard for Chesapeake seafood boils — its savory coastal mix pairs with crisp whites, lager, and shellfish-friendly wines.",
    "aliases": [
      "Old Bay Spice",
      "Chesapeake Bay Seasoning"
    ],
    "common_names": [
      "Old Bay"
    ]
  },
  {
    "slug": "lemon-pepper",
    "display_name": "Lemon Pepper",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Lemon pepper combines citrus zest and cracked pepper for grilled fish and chicken — its bright savory blend pairs with Sauvignon Blanc, Vermentino, and coastal whites.",
    "aliases": [
      "Lemon Pepper Seasoning",
      "Lemon Pepper Spice"
    ],
    "common_names": [
      "Lemon Pepper"
    ]
  },
  {
    "slug": "poultry-seasoning",
    "display_name": "Poultry Seasoning",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Poultry seasoning blends sage, thyme, and marjoram for roast chicken and Thanksgiving stuffing — its classic herb mix pairs with Chardonnay, Pinot Noir, and roast-friendly whites.",
    "aliases": [
      "Chicken Seasoning",
      "Turkey Seasoning",
      "Sage Stuffing Mix"
    ],
    "common_names": [
      "Chicken Seasoning"
    ]
  },
  {
    "slug": "tandoori-masala",
    "display_name": "Tandoori Masala",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Tandoori masala blends Kashmiri chili, cumin, and fenugreek for tandoori chicken — its red aromatic spice pairs with aromatic whites, lager, and spice-tolerant rosé.",
    "aliases": [
      "Tandoori Spice",
      "Tandoori Powder",
      "Tandoori Chicken Masala"
    ],
    "common_names": [
      "Tandoori Masala"
    ]
  },
  {
    "slug": "vadouvan",
    "display_name": "Vadouvan",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Vadouvan is a French-Indian curry blend with shallot, garlic, and fenugreek — its mellow curry warmth pairs with aromatic whites, Rhône reds, and fusion cuisine wines.",
    "aliases": [
      "French Curry Powder",
      "Vadouvan Curry Blend"
    ],
    "common_names": [
      "Vadouvan"
    ]
  },
  {
    "slug": "jerk-seasoning",
    "display_name": "Jerk Seasoning",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Jerk seasoning combines allspice, scotch bonnet heat, and thyme for Jamaican grilled meats — its fiery island spice pairs with rum, Zinfandel, and tropical fruit-forward reds.",
    "aliases": [
      "Jamaican Jerk Spice",
      "Jerk Spice Blend",
      "Jerk Rub"
    ],
    "common_names": [
      "Jerk Seasoning"
    ]
  },
  {
    "slug": "cajun-seasoning",
    "display_name": "Cajun Seasoning",
    "parent_group": "ground-blended-spices",
    "scientific_name": "Multiple species",
    "usage_intensity": "accent",
    "summary": "Cajun seasoning blends paprika, cayenne, and garlic notes for Louisiana blackened fish and gumbo — its bold bayou mix pairs with Zinfandel, beer, and spicy southern reds.",
    "aliases": [
      "Cajun Spice",
      "Louisiana Seasoning",
      "Blackening Seasoning"
    ],
    "common_names": [
      "Cajun Spice"
    ]
  }
];
