/**
 * KNOWLEDGE-01 — Bootstrap canonical wine taxonomy from Wine Folly poster ontology.
 * Writes data/wine-taxonomy.json (single source of truth).
 *
 * Run: node scripts/bootstrap-wine-taxonomy.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WINE_TERMS } from "../assets/js/wine-terms-data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "data", "wine-taxonomy.json");

/** @type {const} */
const CATEGORIES = [
  {
    id: "inorganic",
    slug: "inorganic",
    name: "Inorganic",
    color: "#6ba3c7",
    intro:
      "Non-fruit, mineral, and textural descriptors — the stoniness, petrol, and tactile qualities that define terroir and winemaking texture.",
  },
  {
    id: "flower",
    slug: "flower",
    name: "Flower",
    color: "#8b5a9b",
    intro:
      "Floral aromatics from grape and fermentation — violet in Cabernet, citrus blossom in Riesling, and perfumed whites.",
  },
  {
    id: "herb",
    slug: "herb",
    name: "Herb",
    color: "#4a8f5a",
    intro:
      "Herbaceous, green, and savory vegetal notes — from grassy Sauvignon Blanc to bell pepper pyrazines in Carmenère.",
  },
  {
    id: "oak",
    slug: "oak",
    name: "Oak",
    color: "#b8860b",
    intro:
      "Barrel-derived flavors and textures — toast, vanilla, spice, and creamy malolactic notes from oak aging.",
  },
  {
    id: "fruit",
    slug: "fruit",
    name: "Fruit",
    color: "#b83232",
    intro:
      "Primary fruit character organized by ripeness, color family, and fruit type — the aromatic core of most wine descriptions.",
  },
  {
    id: "spice",
    slug: "spice",
    name: "Spice",
    color: "#c49a2a",
    intro:
      "Spice and aromatic warmth — pepper, clove, cinnamon, and exotic notes from grape, oak, or fermentation.",
  },
  {
    id: "alcohol",
    slug: "alcohol",
    name: "Alcohol",
    color: "#7a2d3b",
    intro:
      "Alcohol perception — heat, ripeness, and viscosity cues including legs and jammy over-ripeness.",
  },
  {
    id: "acidity",
    slug: "acidity",
    name: "Acidity",
    color: "#2d8a8a",
    intro:
      "Acid structure on a continuum from flat to nervy — the backbone that drives food pairing more than any other single trait.",
  },
  {
    id: "tannin",
    slug: "tannin",
    name: "Tannin",
    color: "#c45c7a",
    intro:
      "Phenolic grip and texture — from silky Pinot to aggressive young Nebbiolo; tannin is the main red-wine pairing lever.",
  },
  {
    id: "style",
    slug: "style",
    name: "Style",
    color: "#9a7b4f",
    intro:
      "Overall personality — earthy vs. polished, rustic vs. refined, accessible vs. closed.",
  },
  {
    id: "yeast",
    slug: "yeast",
    name: "Yeast",
    color: "#a89878",
    intro:
      "Fermentation and lees character — biscuit in Champagne, creamy MLF whites, and sourdough-like autolytic notes.",
  },
  {
    id: "body",
    slug: "body",
    name: "Body",
    color: "#3a5a8f",
    intro:
      "Perceived weight and density — the mouthfeel scale from thin to fat that must track dish heaviness.",
  },
];

/** Ordered continua from the poster (slugs). */
const SCALES = {
  body: [
    "thin",
    "cliff-edge",
    "hollow",
    "mellow",
    "short",
    "austere",
    "angular",
    "delicate",
    "elegant",
    "light-bodied",
    "finesse",
    "closed",
    "polished",
    "complex",
    "full-bodied",
    "tight",
    "firm",
    "powerful",
    "concentrated",
    "dense",
    "opulent",
    "rich",
    "extracted",
    "flabby",
    "fat",
  ],
  acidity: [
    "bright",
    "astringent",
    "austere",
    "thin",
    "lean",
    "angular",
    "racy",
    "tart",
    "edgy",
    "nerve",
    "zippy",
    "zesty",
    "lively",
    "fresh",
    "crisp",
    "delicate",
    "soft",
    "flabby",
    "fallen-over",
    "flat",
  ],
  tannin: [
    "bitter",
    "harsh",
    "aggressive",
    "grippy",
    "angular",
    "powerful",
    "coarse",
    "leathery",
    "rigid",
    "muscular",
    "firm",
    "structured",
    "chewy",
    "chocolate",
    "silky",
    "smooth",
    "round",
    "opulent",
    "velvety",
    "voluptuous",
    "supple",
    "soft",
    "mellow",
    "spineless",
    "flabby",
  ],
};

/** Fruit hierarchy: group slug → child descriptor slugs */
const FRUIT_TREE = {
  "fruit-ripeness": [
    "jammy",
    "ripe",
    "juicy",
    "flamboyant",
    "fleshy",
    "extracted",
    "plummy",
  ],
  "red-fruit": ["strawberry", "raspberry", "cherry", "blueberry", "blackberry"],
  "black-fruit": ["cassis"],
  grapey: [],
  berry: [],
  citrus: ["lime", "lemon", "orange", "grapefruit", "citrus-zest"],
  "stone-fruit": ["apricot", "nectarine", "peach"],
  "tropical-fruit": ["banana", "pineapple", "lychee", "coconut"],
  melon: [],
  apple: [],
};

/** Category → flat descriptor slugs (groups handled separately for fruit). */
const CATEGORY_DESCRIPTORS = {
  inorganic: [
    "minerality",
    "graphite",
    "petrichor",
    "unctuous",
    "oily",
    "petroleum",
    "plastic",
    "tar",
    "rubber",
    "diesel",
  ],
  flower: [
    "white-flowers",
    "violet",
    "perfumed",
    "lavender",
    "rose",
    "citrus-blossom",
    "geranium",
  ],
  herb: [
    "stemmy",
    "stalky",
    "vegetal",
    "cats-pee",
    "asparagus",
    "green",
    "grassy",
    "sage",
    "eucalyptus",
    "jalapeno",
    "dill",
    "bell-pepper",
    "gooseberry",
    "quince",
  ],
  oak: [
    "smoky",
    "charcoal",
    "sweet-tobacco",
    "toasty",
    "nutty",
    "coconut",
    "caramel",
    "vanilla",
    "buttery",
    "creamy",
  ],
  spice: [
    "spicy",
    "musky",
    "bright",
    "black-pepper",
    "anise",
    "clove",
    "cinnamon",
    "nutmeg",
    "saffron",
    "ginger",
  ],
  alcohol: ["hot", "burn", "legs"],
  style: [
    "barnyard",
    "earthy",
    "accessible",
    "clean",
    "elegant",
    "polished",
    "refined",
    "complex",
  ],
  yeast: ["sour", "cheesy", "biscuit"],
};

/** Slug aliases for terms that exist in WINE_TERMS under different keys */
const SLUG_ALIASES = {
  "cats-pee": "cats-pee",
  "rose-petal": "rose",
};

/** Default copy for poster terms not yet in WINE_TERMS */
const DEFAULT_COPY = {
  petrichor: {
    name: "Petrichor",
    definition:
      "The smell of rain on dry earth — sometimes evoked in mineral, earthy whites and cool-climate reds after rain-soaked terroir.",
    description: "Earthy-mineral aroma associated with wet stone and damp soil after rainfall.",
    examples: ["Some Jura whites", "Cool-climate Pinot Noir"],
    search_aliases: ["petrichor", "rain on pavement", "wet earth"],
  },
  unctuous: {
    name: "Unctuous",
    definition:
      "Rich, oily mouthfeel — often from lees, malolactic fermentation, or ripe extract in full whites.",
    description: "Textural descriptor for oily, coating palate weight.",
    examples: ["Oaked Chardonnay", "Viognier", "Semillon"],
    search_aliases: ["unctuous", "oily texture", "rich texture"],
  },
  oily: {
    name: "Oily",
    definition:
      "A slick, viscous texture on the mid-palate — common in lees-aged or malolactic whites.",
    description: "Mouthfeel descriptor overlapping with unctuous and creamy.",
    examples: ["White Burgundy", "Rhone whites"],
    search_aliases: ["oily", "oily texture"],
  },
  petroleum: {
    name: "Petroleum",
    definition:
      "Kerosene or petrol note from TDN in aged Riesling — prized in mature German and Australian examples.",
    description: "Aromatic compound (TDN) in aged Riesling.",
    examples: ["Aged German Riesling", "Mature Hunter Valley Semillon"],
    search_aliases: ["petroleum", "petrol", "kerosene", "diesel note"],
  },
  plastic: {
    name: "Plastic",
    definition:
      "Synthetic, vinyl-like aroma — can indicate reduction or certain high-acid white winemaking; usually negative at high intensity.",
    description: "Chemical aroma in some high-acid whites.",
    examples: ["Some Sauvignon Blanc", "Reduced whites"],
    search_aliases: ["plastic", "vinyl", "rubber band"],
  },
  tar: {
    name: "Tar",
    definition:
      "Burnt, resinous, road-tar aroma in dense, earthy full-bodied reds — classic in Northern Rhône Syrah.",
    description: "Resinous dark note in powerful reds.",
    examples: ["Syrah", "Barolo", "Some Cabernet"],
    search_aliases: ["tar", "road tar", "resinous"],
  },
  rubber: {
    name: "Rubber",
    definition:
      "Resinous rubber or tire note — can be reduction, brett, or terroir depending on context and intensity.",
    description: "Resinous aroma found in reds and some reduced whites.",
    examples: ["Syrah", "Reduced wines"],
    search_aliases: ["rubber", "tire", "eraser"],
  },
  diesel: {
    name: "Diesel",
    definition:
      "Strong gasoline or diesel fuel aroma — closely related to petroleum/petrol in aged aromatic whites.",
    description: "Fuel-like note in Riesling and similar varieties.",
    examples: ["Aged Riesling"],
    search_aliases: ["diesel", "gasoline", "fuel"],
  },
  "white-flowers": {
    name: "White Flowers",
    definition:
      "Delicate floral bouquet — lily, apple blossom, gardenia — typical of aromatic whites.",
    description: "Light floral aromatics in white wines.",
    examples: ["Moscato", "Gewürztraminer", "Albariño"],
    search_aliases: ["white flowers", "white flower", "floral white"],
  },
  lavender: {
    name: "Lavender",
    definition:
      "Resinous floral herb note — often in fine Rhône and Provence-influenced reds.",
    description: "Herbal-floral aroma in Mediterranean reds.",
    examples: ["Grenache blends", "Syrah", "Bandol"],
    search_aliases: ["lavender", "herbes de provence"],
  },
  rose: {
    name: "Rose",
    definition:
      "Fresh rose-petal aroma — positive in light reds, rosés, and some aromatic whites.",
    description: "Floral descriptor distinct from red-fruit character.",
    examples: ["Pinot Noir", "Nebbiolo", "Aromatic whites"],
    search_aliases: ["rose", "rose petal", "rose petals"],
  },
  "citrus-blossom": {
    name: "Citrus Blossom",
    definition:
      "Orange or lemon blossom aroma — common in Riesling, Chenin, and white Rhône varieties.",
    description: "Floral citrus note in aromatic whites.",
    examples: ["Riesling", "Chenin Blanc", "Viognier"],
    search_aliases: ["citrus blossom", "orange blossom", "lemon blossom"],
  },
  geranium: {
    name: "Geranium",
    definition:
      "Leafy floral note — can become a fault at high levels from improper winemaking or stressed fruit.",
    description: "Floral-herbal note; fault when dominant.",
    examples: ["Some natural wines"],
    search_aliases: ["geranium"],
  },
  stemmy: {
    name: "Stemmy",
    definition:
      "Green, bitter stem character from whole-cluster or underripe extraction — often negative.",
    description: "Herbaceous bitter note from stems.",
    examples: ["Whole-cluster Pinot", "Underripe Cabernet"],
    search_aliases: ["stemmy", "stems"],
  },
  stalky: {
    name: "Stalky",
    definition:
      "Woody, herbaceous stalk bitterness — related to stemmy and green extraction.",
    description: "Vegetal bitterness from stalks.",
    examples: ["Whole-cluster ferments"],
    search_aliases: ["stalky", "stalks"],
  },
  vegetal: {
    name: "Vegetal",
    definition:
      "Cooked or raw vegetable note — asparagus, pea, or canned veg; intensity determines whether it helps or hurts.",
    description: "Savory vegetable aroma.",
    examples: ["Some Cabernet Franc", "Cool-climate reds"],
    search_aliases: ["vegetal", "veggie", "vegetable"],
  },
  "cats-pee": {
    name: "Cat's Pee",
    definition:
      "Pungent, ammonia-adjacent aromatics in cool-climate Sauvignon Blanc — polarizing but classic in New Zealand SB.",
    description: "Signature (and divisive) Sauvignon Blanc note.",
    examples: ["Marlborough Sauvignon Blanc"],
    search_aliases: ["cats pee", "cat pee", "cat's pee"],
  },
  asparagus: {
    name: "Asparagus",
    definition:
      "Green, slightly sulfurous vegetal note — can appear in unoaked whites and some reds.",
    description: "Savory green vegetable aroma.",
    examples: ["Sauvignon Blanc", "Some Chenin"],
    search_aliases: ["asparagus"],
  },
  sage: {
    name: "Sage",
    definition:
      "Savory herbal note — Mediterranean garrigue character in Rhône and Italian reds.",
    description: "Herbal savory aroma.",
    examples: ["Syrah", "Sangiovese", "Grenache"],
    search_aliases: ["sage", "herbal"],
  },
  jalapeno: {
    name: "Jalapeño",
    definition:
      "Fresh green chili aroma — classic pyrazine note in Sauvignon Blanc and some Carmenère.",
    description: "Green spicy pepper note.",
    examples: ["Sauvignon Blanc", "Carmenère"],
    search_aliases: ["jalapeno", "jalapeño", "green pepper"],
  },
  dill: {
    name: "Dill",
    definition:
      "Herbal dill note — sometimes associated with American oak influence.",
    description: "Savory herb from oak or variety.",
    examples: ["American-oak Chardonnay", "Some Zinfandel"],
    search_aliases: ["dill"],
  },
  gooseberry: {
    name: "Gooseberry",
    definition:
      "Tart green berry — hallmark of Sauvignon Blanc, especially Loire and New Zealand.",
    description: "Green fruit-herb bridge descriptor.",
    examples: ["Sauvignon Blanc"],
    search_aliases: ["gooseberry"],
  },
  quince: {
    name: "Quince",
    definition:
      "Tart, fuzzy golden fruit — astringent and aromatic; common in Chenin and aromatic whites.",
    description: "Pome fruit with tart, floral edge.",
    examples: ["Chenin Blanc", "Riesling"],
    search_aliases: ["quince"],
  },
  charcoal: {
    name: "Charcoal",
    definition:
      "Burnt, ashy oak or smoke note from heavy toast barrels or charred wood influence.",
    description: "Dark toasted oak / smoke descriptor.",
    examples: ["Heavily oaked Cabernet", "Some Syrah"],
    search_aliases: ["charcoal", "char", "ashy"],
  },
  "sweet-tobacco": {
    name: "Sweet Tobacco",
    definition:
      "Sweet resinous tobacco leaf — developed with age in fine reds and some oaked whites.",
    description: "Aged oak and tertiary aroma.",
    examples: ["Aged Bordeaux", "Rioja", "Barolo"],
    search_aliases: ["sweet tobacco", "tobacco leaf"],
  },
  nutty: {
    name: "Nutty",
    definition:
      "Almond, hazelnut, or walnut character from oxidation, age, or certain oak regimes.",
    description: "Oxidative or aged nut aroma.",
    examples: ["Sherry", "Aged Champagne", "Jura whites"],
    search_aliases: ["nutty", "hazelnut", "almond"],
  },
  coconut: {
    name: "Coconut",
    definition:
      "Coconut or dill-like lactone from American oak — classic in many California Chardonnays and Cabs.",
    description: "American oak lactone aroma.",
    examples: ["American-oak Chardonnay", "Bourbon-barrel reds"],
    search_aliases: ["coconut", "dill oak"],
  },
  juicy: {
    name: "Juicy",
    definition:
      "Fresh, mouthwatering fruit that feels liquid and immediate — high appeal, low formality.",
    description: "Fresh, succulent fruit character.",
    examples: ["Beaujolais", "Young Grenache", "Fruit-forward Pinot"],
    search_aliases: ["juicy", "succulent"],
  },
  flamboyant: {
    name: "Flamboyant",
    definition:
      "Showy, exuberant fruit and aroma — high aromatic impact without necessarily heavy structure.",
    description: "Bold aromatic fruit display.",
    examples: ["Gewürztraminer", "Viognier"],
    search_aliases: ["flamboyant", "showy"],
  },
  fleshy: {
    name: "Fleshy",
    definition:
      "Meaty, substantial mid-palate fruit — weight without necessarily high tannin.",
    description: "Substantial fruit texture on palate.",
    examples: ["Grenache", "Merlot", "Warm-climate Shiraz"],
    search_aliases: ["fleshy", "meaty"],
  },
  plummy: {
    name: "Plummy",
    definition:
      "Soft, sweet plum fruit — common in Merlot and warm-climate blends.",
    description: "Dark soft fruit descriptor.",
    examples: ["Merlot", "Primitivo"],
    search_aliases: ["plummy", "plum"],
  },
  strawberry: {
    name: "Strawberry",
    definition: "Fresh red berry — classic Pinot Noir and light Gamay marker.",
    description: "Red fruit descriptor.",
    examples: ["Pinot Noir", "Gamay"],
    search_aliases: ["strawberry"],
  },
  raspberry: {
    name: "Raspberry",
    definition: "Bright red berry — Pinot, Grenache, and cool-climate reds.",
    description: "Red fruit descriptor.",
    examples: ["Pinot Noir", "Grenache"],
    search_aliases: ["raspberry"],
  },
  blueberry: {
    name: "Blueberry",
    definition: "Soft blue fruit — warmer-climate Merlot and Shiraz.",
    description: "Blue fruit in red wine.",
    examples: ["Merlot", "Shiraz"],
    search_aliases: ["blueberry"],
  },
  blackberry: {
    name: "Blackberry",
    definition: "Dark brambly berry — Syrah, Zinfandel, warm Cabernet.",
    description: "Dark fruit descriptor.",
    examples: ["Syrah", "Zinfandel", "Cabernet Sauvignon"],
    search_aliases: ["blackberry", "bramble"],
  },
  grapey: {
    name: "Grapey",
    definition: "Fresh grape-juice character — primary and simple; common in Muscat and young wines.",
    description: "Literal grape flavor.",
    examples: ["Muscat", "Concord-style wines"],
    search_aliases: ["grapey", "grape juice"],
  },
  lime: {
    name: "Lime",
    definition: "Sharp citrus — high-acid whites and some sparkling.",
    description: "Citrus fruit descriptor.",
    examples: ["Sauvignon Blanc", "Albariño", "Champagne"],
    search_aliases: ["lime", "lime zest"],
  },
  lemon: {
    name: "Lemon",
    definition: "Clean citrus acidity — universal white and sparkling marker.",
    description: "Citrus fruit descriptor.",
    examples: ["Chardonnay", "Sauvignon Blanc", "Champagne"],
    search_aliases: ["lemon", "lemon zest"],
  },
  orange: {
    name: "Orange",
    definition: "Orange fruit or peel — oxidative and skin-contact whites.",
    description: "Citrus descriptor.",
    examples: ["Skin-contact whites", "Orange wine"],
    search_aliases: ["orange", "orange peel"],
  },
  grapefruit: {
    name: "Grapefruit",
    definition: "Bitter-edged citrus — classic New World Sauvignon Blanc.",
    description: "Citrus descriptor.",
    examples: ["Sauvignon Blanc", "Some Riesling"],
    search_aliases: ["grapefruit"],
  },
  "citrus-zest": {
    name: "Citrus Zest",
    definition: "Aromatic peel oils — pithy, perfumed citrus without full juice sweetness.",
    description: "Citrus peel aromatic.",
    examples: ["Sauvignon Blanc", "Vermentino"],
    search_aliases: ["citrus zest", "zest"],
  },
  nectarine: {
    name: "Nectarine",
    definition: "Soft stone fruit — aromatic whites and off-dry styles.",
    description: "Stone fruit descriptor.",
    examples: ["Viognier", "Pinot Gris", "Riesling"],
    search_aliases: ["nectarine"],
  },
  banana: {
    name: "Banana",
    definition: "Isoamyl acetate ester — carbonic or warm fermentation note; common in Beaujolais.",
    description: "Fermentation ester fruit.",
    examples: ["Beaujolais", "Some Chardonnay"],
    search_aliases: ["banana"],
  },
  pineapple: {
    name: "Pineapple",
    definition: "Tropical ripe fruit — warm-climate Chardonnay and Sauvignon.",
    description: "Tropical fruit descriptor.",
    examples: ["Chardonnay", "Sauvignon Blanc"],
    search_aliases: ["pineapple"],
  },
  melon: {
    name: "Melon",
    definition: "Honeydew or cantaloupe — soft, sweet aromatic whites.",
    description: "Melon fruit in whites.",
    examples: ["Pinot Gris", "Viognier"],
    search_aliases: ["melon", "honeydew", "cantaloupe"],
  },
  apple: {
    name: "Apple",
    definition: "Green or golden apple — baseline white wine fruit.",
    description: "Pome fruit descriptor.",
    examples: ["Chardonnay", "Riesling", "Chenin Blanc"],
    search_aliases: ["apple", "green apple", "golden apple"],
  },
  musky: {
    name: "Musky",
    definition: "Animalic, musk-like perfume — can be spice, style, or variety-driven.",
    description: "Aromatic musk note.",
    examples: ["Muscat", "Some Syrah", "Orange wines"],
    search_aliases: ["musky", "musk"],
  },
  anise: {
    name: "Anise",
    definition: "Licorice or anise seed spice — Rhône reds and some Italian varieties.",
    description: "Sweet spice descriptor.",
    examples: ["Syrah", "Grenache", "Sangiovese"],
    search_aliases: ["anise", "licorice", "liquorice"],
  },
  saffron: {
    name: "Saffron",
    definition: "Exotic honeyed spice — occasional in aromatic whites and skin-contact wines.",
    description: "Exotic spice note.",
    examples: ["Aromatic whites", "Skin-contact wines"],
    search_aliases: ["saffron"],
  },
  ginger: {
    name: "Ginger",
    definition: "Fresh or candied ginger spice — spice and alcohol warmth overlap.",
    description: "Spice descriptor.",
    examples: ["Gewürztraminer", "Some Riesling"],
    search_aliases: ["ginger"],
  },
  hot: {
    name: "Hot",
    definition: "Noticeable alcohol warmth on palate or finish — imbalance when it dominates.",
    description: "High-ABV heat perception.",
    examples: ["Warm-climate Zinfandel", "High-alcohol Shiraz"],
    search_aliases: ["hot", "alcohol heat", "hot wine"],
  },
  burn: {
    name: "Burn",
    definition: "Ethanol burn at back of throat — stronger than 'hot'; pairing liability with delicate food.",
    description: "Aggressive alcohol sensation.",
    examples: ["Fortified styles", "Very ripe reds"],
    search_aliases: ["burn", "burning", "ethanol burn"],
  },
  legs: {
    name: "Legs",
    definition:
      "Viscous tears on glass walls — indicates alcohol/glycerol; not a quality score on its own.",
    description: "Visual viscosity cue.",
    examples: ["High-alcohol reds", "Dessert wines"],
    search_aliases: ["legs", "tears", "wine legs"],
  },
  accessible: {
    name: "Accessible",
    definition: "Easy to appreciate young — low barriers; crowd-pleasing without deep complexity.",
    description: "Approachable style descriptor.",
    examples: ["Commercial Merlot", "Fruit-forward Pinot"],
    search_aliases: ["accessible", "approachable"],
  },
  refined: {
    name: "Refined",
    definition: "Polished, precise, without rough edges — high craftsmanship signal.",
    description: "Elegant winemaking style.",
    examples: ["Burgundy", "Fine Bordeaux"],
    search_aliases: ["refined", "polished"],
  },
  sour: {
    name: "Sour",
    definition: "Sourdough or sourdough-bread tang from lees or wild ferment — can be positive in sparkling.",
    description: "Yeasty sour note.",
    examples: ["Traditional-method sparkling", "Natural wines"],
    search_aliases: ["sour", "sour dough"],
  },
  cheesy: {
    name: "Cheesy",
    definition: "Savory cheese or nutritional-yeast note from lees — positive in low dose.",
    description: "Autolytic savory note.",
    examples: ["Champagne sur lie", "Some Chardonnay"],
    search_aliases: ["cheesy", "cheese rind"],
  },
  "cliff-edge": {
    name: "Cliff-edge",
    definition: "Flavor drops off abruptly mid-palate — hollow follow-through.",
    description: "Structural mid-palate gap.",
    examples: ["Thin inexpensive reds"],
    search_aliases: ["cliff edge", "cliff-edge"],
  },
  nerve: {
    name: "Nerve",
    definition: "Wire-tight acidity with energy — synonym territory with racy and edgy.",
    description: "High-acid energy descriptor.",
    examples: ["Chablis", "Mosel Riesling"],
    search_aliases: ["nerve", "nervy"],
  },
  edgy: {
    name: "Edgy",
    definition: "Tense, sharp acid (and sometimes tannin) — not yet rounded.",
    description: "Angular youthful structure.",
    examples: ["Young Barolo", "Young Riesling"],
    search_aliases: ["edgy"],
  },
  "fallen-over": {
    name: "Fallen Over",
    definition: "Wine past its acid prime — flat, tired, collapsed structure.",
    description: "Declined acidity marker.",
    examples: ["Old oxidized whites"],
    search_aliases: ["fallen over", "collapsed"],
  },
  bitter: {
    name: "Bitter",
    definition: "Phenolic bitterness — green tannin or extraction fault when harsh.",
    description: "Negative tannin edge.",
    examples: ["Underripe extraction", "Some Italian reds"],
    search_aliases: ["bitter", "bitterness"],
  },
  harsh: {
    name: "Harsh",
    definition: "Rough, drying tannin without polish — needs age or food.",
    description: "Aggressive tannin texture.",
    examples: ["Young tannic Cabernet", "Young Nebbiolo"],
    search_aliases: ["harsh"],
  },
  aggressive: {
    name: "Aggressive",
    definition: "Tannin or acid that dominates — youthful power.",
    description: "Dominant structural force.",
    examples: ["Young Barolo", "Young Cabernet"],
    search_aliases: ["aggressive"],
  },
  coarse: {
    name: "Coarse",
    definition: "Grainy, sandy tannin texture — lacks finesse.",
    description: "Rough tannin grain.",
    examples: ["Inexpensive high-extraction reds"],
    search_aliases: ["coarse", "grainy tannin"],
  },
  rigid: {
    name: "Rigid",
    definition: "Unyielding tannin structure — tight and ungiving young.",
    description: "Inflexible tannin frame.",
    examples: ["Young Bordeaux", "Young Barolo"],
    search_aliases: ["rigid"],
  },
  muscular: {
    name: "Muscular",
    definition: "Powerful, athletic tannin and extract — big but not necessarily coarse.",
    description: "Strong physical presence.",
    examples: ["Napa Cabernet", "Hermitage"],
    search_aliases: ["muscular"],
  },
  chocolate: {
    name: "Chocolate",
    definition: "Cocoa or dark chocolate tannin roundness — often oak and fruit interplay.",
    description: "Sweet structural note in reds.",
    examples: ["Oaked Merlot", "Modern Rioja"],
    search_aliases: ["chocolate", "cocoa", "mocha"],
  },
  voluptuous: {
    name: "Voluptuous",
    definition: "Luxurious, rounded abundance — more flavor than structural angularity.",
    description: "Rich, generous mouthfeel.",
    examples: ["Grenache", "Merlot-heavy blends"],
    search_aliases: ["voluptuous"],
  },
  spineless: {
    name: "Spineless",
    definition: "Lacks backbone — low acid and low tannin together.",
    description: "Weak structural core.",
    examples: ["Flabby commercial reds"],
    search_aliases: ["spineless", "no backbone"],
  },
  dense: {
    name: "Dense",
    definition: "Compact, concentrated palate — tightly packed fruit and structure.",
    description: "High-density mouthfeel.",
    examples: ["Napa Cabernet", "Vintage Port"],
    search_aliases: ["dense", "compact"],
  },
  fat: {
    name: "Fat",
    definition: "Broad, low-acid heaviness — past flabby into cumbersome.",
    description: "Extreme low-acid body.",
    examples: ["Overripe warm-climate whites"],
    search_aliases: ["fat", "heavy"],
  },
};

function labelFromSlug(slug) {
  return slug
    .split("-")
    .map((w) => (w === "pee" ? "Pee" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ")
    .replace(/Cats Pee/i, "Cat's Pee")
    .replace(/Light Bodied/i, "Light-bodied")
    .replace(/Full Bodied/i, "Full-bodied")
    .replace(/Black Pepper/i, "Black Pepper")
    .replace(/Citrus Zest/i, "Citrus Zest")
    .replace(/Citrus Blossom/i, "Citrus Blossom")
    .replace(/Sweet Tobacco/i, "Sweet Tobacco")
    .replace(/White Flowers/i, "White Flowers")
    .replace(/Stone Fruit/i, "Stone Fruit")
    .replace(/Tropical Fruit/i, "Tropical Fruit")
    .replace(/Red Fruit/i, "Red Fruit")
    .replace(/Black Fruit/i, "Black Fruit")
    .replace(/Fruit Ripeness/i, "Fruit Ripeness")
    .replace(/Cliff Edge/i, "Cliff-edge")
    .replace(/Fallen Over/i, "Fallen Over");
}

function legacyTerm(slug) {
  if (WINE_TERMS[slug]) return WINE_TERMS[slug];
  const alias = SLUG_ALIASES[slug];
  if (alias && WINE_TERMS[alias]) return WINE_TERMS[alias];
  return null;
}

function seoTitle(name, categoryName) {
  return `${name} in Wine — ${categoryName} Descriptor & Pairing Guide`;
}

function seoDescription(name, definition) {
  const clip = definition.length > 140 ? `${definition.slice(0, 137)}…` : definition;
  return `What does ${name} mean in wine? ${clip} Pairing Method glossary.`;
}

function makeNode({
  slug,
  name,
  type,
  category,
  parent = null,
  children = [],
  definition,
  description,
  examples = [],
  related_terms = [],
  opposite_terms = [],
  associated_wines = [],
  associated_foods = [],
  associated_pairings = [],
  search_aliases = [],
  scale = null,
}) {
  const categoryMeta = CATEGORIES.find((c) => c.id === category);
  const categoryName = categoryMeta?.name ?? category;
  return {
    id: slug,
    slug,
    name,
    type,
    category,
    parent,
    children,
    description: description ?? definition,
    definition,
    examples,
    related_terms,
    opposite_terms,
    associated_wines,
    associated_foods,
    associated_pairings,
    search_aliases: [...new Set([slug, name.toLowerCase(), ...search_aliases])],
    seo_title: seoTitle(name, categoryName),
    seo_description: seoDescription(name, definition),
    ...(scale ? { scale } : {}),
  };
}

function buildDescriptorNode(slug, category, parent, scaleInfo = null) {
  const legacy = legacyTerm(slug);
  const defaults = DEFAULT_COPY[slug] ?? {};
  const name = defaults.name ?? legacy?.label ?? labelFromSlug(slug);
  const definition =
    defaults.definition ??
    legacy?.definition ??
    `${name} is a wine descriptor in the ${category} family on the Wine Folly tasting vocabulary.`;
  const description = defaults.description ?? legacy?.context ?? definition;
  const examples = defaults.examples ?? [];
  const related_terms = legacy?.related ?? [];
  const opposite_terms = legacy?.opposites ?? [];
  const search_aliases = [
    ...(defaults.search_aliases ?? []),
    ...(legacy?.phrases ?? []),
  ];

  let scale = null;
  if (scaleInfo) {
    const { scaleId, position, ordered } = scaleInfo;
    const prev = position > 0 ? ordered[position - 1] : null;
    const next = position < ordered.length - 1 ? ordered[position + 1] : null;
    scale = {
      id: scaleId,
      name: labelFromSlug(scaleId),
      position,
      previous: prev,
      next,
    };
  }

  return makeNode({
    slug,
    name,
    type: "descriptor",
    category,
    parent,
    definition,
    description,
    examples,
    related_terms,
    opposite_terms,
    search_aliases,
    scale,
  });
}

function buildCategoryNode(cat) {
  const children = [
    ...(CATEGORY_DESCRIPTORS[cat.id] ?? []),
    ...(cat.id === "fruit" ? Object.keys(FRUIT_TREE) : []),
    ...(SCALES[cat.id] ?? []).filter(
      (slug) => !(CATEGORY_DESCRIPTORS[cat.id] ?? []).includes(slug)
    ),
  ];
  const uniqueChildren = [...new Set(children)];

  return makeNode({
    slug: cat.slug,
    name: cat.name,
    type: "category",
    category: cat.id,
    parent: null,
    children: uniqueChildren,
    definition: cat.intro,
    description: cat.intro,
    search_aliases: [cat.slug, cat.name.toLowerCase()],
  });
}

function buildGroupNode(slug, category, parent, children) {
  return makeNode({
    slug,
    name: labelFromSlug(slug),
    type: "group",
    category,
    parent,
    children,
    definition: `${labelFromSlug(slug)} is a sub-family within the ${category} taxonomy on the Wine Folly descriptor poster.`,
    description: `Browse ${labelFromSlug(slug).toLowerCase()} descriptors and how they affect pairing.`,
    search_aliases: [slug.replace(/-/g, " ")],
  });
}

function main() {
  const nodes = {};

  for (const cat of CATEGORIES) {
    nodes[cat.slug] = buildCategoryNode(cat);
  }

  for (const [catId, slugs] of Object.entries(CATEGORY_DESCRIPTORS)) {
    for (const slug of slugs) {
      if (nodes[slug]) continue;
      nodes[slug] = buildDescriptorNode(slug, catId, catId);
    }
  }

  for (const [groupSlug, childSlugs] of Object.entries(FRUIT_TREE)) {
    if (!nodes[groupSlug]) {
      nodes[groupSlug] = buildGroupNode(groupSlug, "fruit", "fruit", childSlugs);
    }
    for (const child of childSlugs) {
      if (!nodes[child]) {
        nodes[child] = buildDescriptorNode(child, "fruit", groupSlug);
      }
    }
  }

  for (const [scaleId, ordered] of Object.entries(SCALES)) {
    ordered.forEach((slug, position) => {
      if (!nodes[slug]) {
        nodes[slug] = buildDescriptorNode(slug, scaleId, scaleId, {
          scaleId,
          position,
          ordered,
        });
      } else if (!nodes[slug].scale) {
        nodes[slug].scale = {
          id: scaleId,
          name: labelFromSlug(scaleId),
          position,
          previous: position > 0 ? ordered[position - 1] : null,
          next: position < ordered.length - 1 ? ordered[position + 1] : null,
        };
      }
      if (!nodes[scaleId].children.includes(slug)) {
        nodes[scaleId].children.push(slug);
      }
    });
  }

  for (const node of Object.values(nodes)) {
    if (node.parent && nodes[node.parent]) {
      const parent = nodes[node.parent];
      if (!parent.children.includes(node.slug)) {
        parent.children.push(node.slug);
      }
    }
  }

  /** Migrate legacy WINE_TERMS not on poster — preserves existing graph edges. */
  const legacyCategoryMap = {
    body_style: "body",
    spice_oak: "oak",
    flower_herb_earth: "herb",
  };
  for (const [slug, term] of Object.entries(WINE_TERMS)) {
    if (nodes[slug]) continue;
    const category = legacyCategoryMap[term.categoryId] ?? term.categoryId;
    if (!nodes[category]) continue;
    nodes[slug] = buildDescriptorNode(slug, category, category);
    if (!nodes[category].children.includes(slug)) {
      nodes[category].children.push(slug);
    }
  }

  /** Prune relation slugs that still don't exist (safety). */
  for (const node of Object.values(nodes)) {
    node.related_terms = (node.related_terms ?? []).filter((s) => nodes[s]);
    node.opposite_terms = (node.opposite_terms ?? []).filter((s) => nodes[s]);
  }

  const taxonomy = {
    meta: {
      version: "1.0.0",
      phase: "KNOWLEDGE-01",
      source: "Wine Folly — Wine Descriptions & What They Mean",
      updated: new Date().toISOString().slice(0, 10),
      node_count: Object.keys(nodes).length,
      category_count: CATEGORIES.length,
      scale_count: Object.keys(SCALES).length,
    },
    categories: CATEGORIES.map(({ id, slug, name, color, intro }) => ({
      id,
      slug,
      name,
      color,
      introduction: intro,
      url: `/terms/${slug}/`,
    })),
    scales: Object.entries(SCALES).map(([id, ordered]) => ({
      id,
      category: id,
      name: `${labelFromSlug(id)} Scale`,
      ordered_slugs: ordered,
    })),
    nodes,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(taxonomy, null, 2)}\n`);
  console.log(`Wrote ${OUT}`);
  console.log(
    `Nodes: ${taxonomy.meta.node_count} | Categories: ${taxonomy.meta.category_count} | Scales: ${taxonomy.meta.scale_count}`
  );
}

main();
