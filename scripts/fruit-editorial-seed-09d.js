/**
 * FOOD-09D — Curated editorial relationship seed data.
 * Tier A: similar_to, substitutes_for
 * Tier B: commonly_served_with (intra-domain)
 * Tier C: commonly_served_with (cross-domain forward references)
 *
 * FRUIT-001 Editorial Rule: fresh/processed canonical identities must not be
 * treated as editorially interchangeable in Tier A (grape/raisin, plum/prune,
 * coconut/desiccated-coconut/coconut-milk).
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
  "food.cheese.bloomy-rind.brie-de-meaux",
  "food.cheese.brined.feta",
  "food.cheese.fresh.goat-chevre-log",
  "food.cheese.hard.cheddar",
  "food.cheese.hard.parmigiano-reggiano",
  "food.cheese.blue.gorgonzola",
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
    "source": "lemon",
    "target": "lime",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Lemon and lime share bright acid and zest roles in dressings, ceviche, and citrus finishing — distinct processed forms under FRUIT-001."
  },
  {
    "relationship": "similar_to",
    "source": "lime",
    "target": "lemon",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "lime and lemon share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "nectarine",
    "target": "peach",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Nectarine and peach share smooth and fuzzy stone-fruit flesh in pies, grilling, and summer fruit service."
  },
  {
    "relationship": "similar_to",
    "source": "peach",
    "target": "nectarine",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "peach and nectarine share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "tangerine",
    "target": "mandarin",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Tangerine and mandarin overlap in easy-peel citrus segments, marmalade, and holiday fruit service."
  },
  {
    "relationship": "similar_to",
    "source": "mandarin",
    "target": "tangerine",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "mandarin and tangerine share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "clementine",
    "target": "tangerine",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Clementine and tangerine share seedless snack-citrus and salad segment roles in winter fruit service."
  },
  {
    "relationship": "similar_to",
    "source": "tangerine",
    "target": "clementine",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "tangerine and clementine share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "satsuma",
    "target": "mandarin",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Satsuma and mandarin share loose-skin Japanese and Chinese easy-peel citrus character."
  },
  {
    "relationship": "similar_to",
    "source": "mandarin",
    "target": "satsuma",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "mandarin and satsuma share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "blueberry",
    "target": "blackberry",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Blueberry and blackberry share bramble berry compote, pie, and breakfast fruit bowl roles."
  },
  {
    "relationship": "similar_to",
    "source": "blackberry",
    "target": "blueberry",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "blackberry and blueberry share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "cranberry",
    "target": "lingonberry",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cranberry and lingonberry share tart red berry sauce and Scandinavian–American relish applications."
  },
  {
    "relationship": "similar_to",
    "source": "lingonberry",
    "target": "cranberry",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "lingonberry and cranberry share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "apricot",
    "target": "peach",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Apricot and peach share stone-fruit jam, tart, and grill applications with overlapping summer harvest use."
  },
  {
    "relationship": "similar_to",
    "source": "peach",
    "target": "apricot",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "peach and apricot share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "greengage",
    "target": "plum",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Greengage and plum share European stone-fruit jam and tart lineage despite different skin color."
  },
  {
    "relationship": "similar_to",
    "source": "plum",
    "target": "greengage",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "plum and greengage share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "damson",
    "target": "plum",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Damson and plum share dense-flesh European jam and gin-adjacent stone-fruit cookery."
  },
  {
    "relationship": "similar_to",
    "source": "plum",
    "target": "damson",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "plum and damson share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "mirabelle",
    "target": "plum",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Mirabelle and plum share Lorraine tarte and European small-plum preserve traditions."
  },
  {
    "relationship": "similar_to",
    "source": "plum",
    "target": "mirabelle",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "plum and mirabelle share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "bergamot",
    "target": "lemon",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Bergamot and lemon share aromatic citrus oil and marmalade roles despite bergamot's perfumed peel."
  },
  {
    "relationship": "similar_to",
    "source": "lemon",
    "target": "bergamot",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "lemon and bergamot share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "key-lime",
    "target": "lime",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Key lime and lime share pie, ceviche, and tropical cocktail acid with overlapping juice applications."
  },
  {
    "relationship": "similar_to",
    "source": "lime",
    "target": "key-lime",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "lime and key-lime share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "calamansi",
    "target": "key-lime",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Calamansi and key lime share Southeast Asian and Filipino sour citrus finishing in marinades and drinks."
  },
  {
    "relationship": "similar_to",
    "source": "key-lime",
    "target": "calamansi",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "key-lime and calamansi share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "blood-orange",
    "target": "orange",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Blood orange and orange share segment, juice, and salad roles with blood orange adding anthocyanin depth."
  },
  {
    "relationship": "similar_to",
    "source": "orange",
    "target": "blood-orange",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "orange and blood-orange share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "grapefruit",
    "target": "pomelo",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Grapefruit and pomelo share large bitter-sweet citrus segment and breakfast half service."
  },
  {
    "relationship": "similar_to",
    "source": "pomelo",
    "target": "grapefruit",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "pomelo and grapefruit share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "asian-pear",
    "target": "pear",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Asian pear and pear share crisp pome fruit salad and poached fruit roles with different texture density."
  },
  {
    "relationship": "similar_to",
    "source": "pear",
    "target": "asian-pear",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "pear and asian-pear share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "cantaloupe",
    "target": "honeydew",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cantaloupe and honeydew share melon platter, prosciutto service, and fruit cup applications."
  },
  {
    "relationship": "similar_to",
    "source": "honeydew",
    "target": "cantaloupe",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "honeydew and cantaloupe share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "galia-melon",
    "target": "cantaloupe",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Galia melon and cantaloupe share netted-rind melon aroma in fruit platters and chilled dessert service."
  },
  {
    "relationship": "similar_to",
    "source": "cantaloupe",
    "target": "galia-melon",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "cantaloupe and galia-melon share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "golden-raisin",
    "target": "raisin",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Golden raisin and raisin share dried-grape baking and pilaf roles as distinct processed identities from fresh grape."
  },
  {
    "relationship": "similar_to",
    "source": "raisin",
    "target": "golden-raisin",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "raisin and golden-raisin share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "sultanas",
    "target": "raisin",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Sultanas and raisin share scone, chutney, and trail-mix dried-fruit roles without fresh-grape interchange."
  },
  {
    "relationship": "similar_to",
    "source": "raisin",
    "target": "sultanas",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "raisin and sultanas share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "gooseberry",
    "target": "red-currant",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Gooseberry and red currant share tart European compote and fool dessert applications."
  },
  {
    "relationship": "similar_to",
    "source": "red-currant",
    "target": "gooseberry",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "red-currant and gooseberry share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "mulberry",
    "target": "blackberry",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Mulberry and blackberry share dark berry jam and summer compote roles in Old World and New World cookery."
  },
  {
    "relationship": "similar_to",
    "source": "blackberry",
    "target": "mulberry",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "blackberry and mulberry share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "marionberry",
    "target": "blackberry",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Marionberry and blackberry share Pacific Northwest pie and jam lineage with overlapping bramble character."
  },
  {
    "relationship": "similar_to",
    "source": "blackberry",
    "target": "marionberry",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "blackberry and marionberry share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "loganberry",
    "target": "boysenberry",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Loganberry and boysenberry share hybrid bramble jam and pie roles developed in California breeding programs."
  },
  {
    "relationship": "similar_to",
    "source": "boysenberry",
    "target": "loganberry",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "boysenberry and loganberry share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "papaya",
    "target": "mango",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Papaya and mango share tropical fruit salad, smoothie, and Latin American breakfast fruit service."
  },
  {
    "relationship": "similar_to",
    "source": "mango",
    "target": "papaya",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "mango and papaya share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "lychee",
    "target": "rambutan",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Lychee and rambutan share peeled tropical aril fruit in Southeast Asian dessert and cocktail garnish service."
  },
  {
    "relationship": "similar_to",
    "source": "rambutan",
    "target": "lychee",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "rambutan and lychee share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "guava",
    "target": "passion-fruit",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Guava and passion fruit share tropical juice, agua fresca, and pastry filling roles in Latin American cookery."
  },
  {
    "relationship": "similar_to",
    "source": "passion-fruit",
    "target": "guava",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "passion-fruit and guava share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "yuzu",
    "target": "sudachi",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Yuzu and sudachi share Japanese aromatic citrus juice and ponzu-adjacent finishing roles."
  },
  {
    "relationship": "similar_to",
    "source": "sudachi",
    "target": "yuzu",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "sudachi and yuzu share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "fig",
    "target": "date",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Fig and date share dense sweet fruit plate, tagine, and cheese-board roles as distinct canonical identities."
  },
  {
    "relationship": "similar_to",
    "source": "date",
    "target": "fig",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "date and fig share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "quince",
    "target": "pear",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Quince and pear share poached pome and paste roles when quince is cooked to softening — not raw interchange."
  },
  {
    "relationship": "similar_to",
    "source": "pear",
    "target": "quince",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "pear and quince share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "similar_to",
    "source": "flat-peach",
    "target": "peach",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Flat peach and peach share donut-peach and standard stone-fruit grill, tart, and fresh service roles."
  },
  {
    "relationship": "similar_to",
    "source": "peach",
    "target": "flat-peach",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "peach and flat-peach share established culinary overlap without FRUIT-001 processed-form interchange."
  },
  {
    "relationship": "substitutes_for",
    "source": "lemon",
    "target": "lime",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Lemon substitutes for lime in dressings and finishing acid when lime scarcity requires a bright citrus swap."
  },
  {
    "relationship": "substitutes_for",
    "source": "lime",
    "target": "lemon",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Lime substitutes for lemon in ceviche and tropical marinades when perfumed lemon zest is not required."
  },
  {
    "relationship": "substitutes_for",
    "source": "nectarine",
    "target": "peach",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Nectarine substitutes for peach in tarts and grilling when smooth skin is preferred without flavor shift."
  },
  {
    "relationship": "substitutes_for",
    "source": "key-lime",
    "target": "lime",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Key lime substitutes for Persian lime in pie and cocktail acid when smaller aromatic fruit is unavailable."
  },
  {
    "relationship": "substitutes_for",
    "source": "golden-raisin",
    "target": "raisin",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Golden raisin substitutes for raisin in baking and pilaf when lighter color and milder sweetness are acceptable."
  },
  {
    "relationship": "substitutes_for",
    "source": "sultanas",
    "target": "raisin",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Sultanas substitute for raisin in scones and chutney as a seedless golden dried-grape alternative."
  },
  {
    "relationship": "substitutes_for",
    "source": "currants",
    "target": "raisin",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Currants substitute for raisin in mincemeat and soda bread where smaller dried-fruit size is traditional — not fresh grape interchange."
  },
  {
    "relationship": "substitutes_for",
    "source": "dried-apricot",
    "target": "dried-date",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Dried apricot substitutes for dried date in tagine and stuffing when stone-fruit tang is preferred over date molasses."
  },
  {
    "relationship": "substitutes_for",
    "source": "clementine",
    "target": "tangerine",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Clementine substitutes for tangerine in segment salads when smaller seedless fruit is needed."
  },
  {
    "relationship": "substitutes_for",
    "source": "cantaloupe",
    "target": "honeydew",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cantaloupe substitutes for honeydew on fruit platters when netted melon aroma is desired over pale melon sweetness."
  },
  {
    "relationship": "substitutes_for",
    "source": "boysenberry",
    "target": "blackberry",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Boysenberry substitutes for blackberry in pie when hybrid bramble availability favors boysenberry harvest."
  },
  {
    "relationship": "substitutes_for",
    "source": "red-currant",
    "target": "black-currant",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Red currant substitutes for black currant in sauces when lighter color and less musky aroma are required."
  },
  {
    "relationship": "substitutes_for",
    "source": "papaya",
    "target": "mango",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Papaya substitutes for mango in smoothies and salsas when tropical stone-free texture is acceptable."
  },
  {
    "relationship": "substitutes_for",
    "source": "asian-pear",
    "target": "pear",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Asian pear substitutes for pear in salads when extra crisp juice-forward texture is desired."
  },
  {
    "relationship": "substitutes_for",
    "source": "mirabelle",
    "target": "plum",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Mirabelle substitutes for plum in tarts when small yellow plum availability defines Alsatian-style preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "pear",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Apple and pear combine in fall fruit salads, tarts, and poached pome platters."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "quince",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Apple and quince combine in paste, compote, and Central European poached fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pear",
    "target": "quince",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Pear and quince share poached pome and cheese-board roles when quince is fully softened."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "crabapple",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Apple and crabapple combine in jelly and high-pectin preserve formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "asian-pear",
    "target": "pear",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Asian pear and pear layer in mixed pome salads and gift fruit boxes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peach",
    "target": "nectarine",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Peach and nectarine combine in stone-fruit cobbler, grill platters, and summer compotes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peach",
    "target": "apricot",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Peach and apricot combine in jam blends and French stone-fruit tart fillings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peach",
    "target": "plum",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Peach and plum combine in plumcot-style tarts and mixed stone-fruit galettes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "plum",
    "target": "sweet-cherry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Plum and sweet cherry combine in clafouti-adjacent and Central European stone-fruit compotes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apricot",
    "target": "sweet-cherry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Apricot and sweet cherry combine in Hungarian and French mixed stone-fruit preserves."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sweet-cherry",
    "target": "sour-cherry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Sweet cherry and sour cherry combine in pie blends balancing sugar and acid."
  },
  {
    "relationship": "commonly_served_with",
    "source": "orange",
    "target": "grapefruit",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Orange and grapefruit combine in citrus salads, marmalade blends, and breakfast segments."
  },
  {
    "relationship": "commonly_served_with",
    "source": "orange",
    "target": "lemon",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Orange and lemon combine in citrus curd, vinaigrette, and marmalade formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon",
    "target": "lime",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Lemon and lime combine in Southeast Asian and Latin American dual-citrus dressing bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grapefruit",
    "target": "pomelo",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Grapefruit and pomelo combine in Thai yam and large-format citrus segment service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mandarin",
    "target": "tangerine",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Mandarin and tangerine combine in holiday citrus crates and segment salads."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blood-orange",
    "target": "orange",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Blood orange and orange combine in winter citrus salads and juice blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "bergamot",
    "target": "lemon",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Bergamot and lemon combine in Earl Grey–adjacent marmalade and aromatic citrus curd."
  },
  {
    "relationship": "commonly_served_with",
    "source": "yuzu",
    "target": "lemon",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Yuzu and lemon combine in ponzu, kosho, and Japanese–Western fusion citrus finishing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "calamansi",
    "target": "lime",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Calamansi and lime combine in Filipino adobo marinades and tropical citrus punch."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kumquat",
    "target": "mandarin",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Kumquat and mandarin combine in candied citrus and holiday relish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "citron",
    "target": "lemon",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Citron and lemon combine in candied peel and high-pectin marmalade traditions."
  },
  {
    "relationship": "commonly_served_with",
    "source": "strawberry",
    "target": "blueberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Strawberry and blueberry combine in summer berry compote, shortcake, and breakfast bowls."
  },
  {
    "relationship": "commonly_served_with",
    "source": "strawberry",
    "target": "raspberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Strawberry and raspberry combine in mixed berry coulis and patisserie fruit layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blueberry",
    "target": "blackberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Blueberry and blackberry combine in pie, crumble, and antioxidant-forward berry medleys."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raspberry",
    "target": "blackberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Raspberry and blackberry combine in bramble jam and Eton mess–style dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cranberry",
    "target": "blueberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cranberry and blueberry combine in sauce blends moderating pure cranberry tartness."
  },
  {
    "relationship": "commonly_served_with",
    "source": "red-currant",
    "target": "black-currant",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Red currant and black currant combine in ribes compote and European summer pudding."
  },
  {
    "relationship": "commonly_served_with",
    "source": "gooseberry",
    "target": "red-currant",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Gooseberry and red currant combine in fool and tart fillings with balancing acid."
  },
  {
    "relationship": "commonly_served_with",
    "source": "elderberry",
    "target": "blackberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Elderberry and blackberry combine in cordial-adjacent and dark berry preserve service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mango",
    "target": "pineapple",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Mango and pineapple combine in tropical salsa, smoothie, and fruit platter service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mango",
    "target": "papaya",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Mango and papaya combine in Latin American fruit cups and hotel breakfast tropical medleys."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mango",
    "target": "passion-fruit",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Mango and passion fruit combine in coulis, pavlova topping, and tropical pastry fillings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "banana",
    "target": "pineapple",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Banana and pineapple combine in smoothie, upside-down cake, and tropical bowl service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "banana",
    "target": "plantain",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Banana and plantain combine in Caribbean mixed fry and Latin American ripe-plantain dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pineapple",
    "target": "passion-fruit",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Pineapple and passion fruit combine in tropical cocktail and sorbet flavor layering."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lychee",
    "target": "rambutan",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Lychee and rambutan combine in Southeast Asian dessert platters and peeled tropical fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dragon-fruit",
    "target": "passion-fruit",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dragon fruit and passion fruit combine in smoothie bowls and tropical fruit aesthetic plating."
  },
  {
    "relationship": "commonly_served_with",
    "source": "guava",
    "target": "papaya",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Guava and papaya combine in agua fresca and Caribbean fruit salad service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "avocado",
    "target": "lime",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Avocado and lime combine in guacamole, ceviche garnish, and Latin American fruit-fat acid balance."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut",
    "target": "pineapple",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Fresh coconut and pineapple combine in piña colada–adjacent and tropical fruit platter service — not coconut milk interchange."
  },
  {
    "relationship": "commonly_served_with",
    "source": "watermelon",
    "target": "cantaloupe",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Watermelon and cantaloupe combine in summer fruit platters and chilled melon soup service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "watermelon",
    "target": "honeydew",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Watermelon and honeydew combine in fruit cup and spa-style chilled melon service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cantaloupe",
    "target": "honeydew",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cantaloupe and honeydew combine in classic two-melon breakfast and prosciutto platter service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "galia-melon",
    "target": "honeydew",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Galia melon and honeydew combine in mixed melon ball and fruit cup service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "crenshaw-melon",
    "target": "cantaloupe",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Crenshaw melon and cantaloupe combine in autumn melon platters with overlapping aromatic flesh."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raisin",
    "target": "date",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Raisin and date combine in tagine, stuffing, and Middle Eastern sweet-savory grain fillings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "prune",
    "target": "date",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Prune and date combine in braised meat glazes and North African sweet-savory sauce bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dried-apricot",
    "target": "dried-date",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dried apricot and dried date combine in Moroccan tagine and muesli mix-ins."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dried-fig",
    "target": "date",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dried fig and date combine in cheese boards and Mediterranean stuffed pastry fillings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dried-cranberry",
    "target": "cranberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dried cranberry and fresh cranberry combine in relish blends and trail mix when texture contrast is desired."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dried-mango",
    "target": "dried-pineapple",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dried mango and dried pineapple combine in tropical snack mixes and bakery inclusions."
  },
  {
    "relationship": "commonly_served_with",
    "source": "candied-orange-peel",
    "target": "orange",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Candied orange peel and orange combine in panettone, fruitcake, and marmalade-adjacent pastry."
  },
  {
    "relationship": "commonly_served_with",
    "source": "golden-raisin",
    "target": "sultanas",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Golden raisin and sultanas combine in Irish soda bread and spiced fruit loaf formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grape",
    "target": "fig",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Grape and fig combine on cheese boards and Mediterranean composed fruit plates — distinct from raisin identity."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pomegranate",
    "target": "persimmon",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Pomegranate and persimmon combine in fall salad and Middle Eastern fruit plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kiwi",
    "target": "strawberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Kiwi and strawberry combine in fruit tart, pavlova, and New Zealand–style dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "starfruit",
    "target": "mango",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Starfruit and mango combine in tropical fruit carving platters and hotel breakfast display."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tamarind",
    "target": "lime",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Tamarind and lime combine in pad thai–adjacent and Latin American sour fruit sauce balancing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "jackfruit",
    "target": "mango",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Jackfruit and mango combine in Southeast Asian fruit salad and ripe jackfruit dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "durian",
    "target": "mango",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Durian and mango combine in Southeast Asian durian–sticky rice service alongside milder tropical fruit."
  },
  {
    "relationship": "commonly_served_with",
    "source": "persimmon",
    "target": "apple",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Persimmon and apple combine in fall fruit salad when persimmon is fully ripe and soft."
  },
  {
    "relationship": "commonly_served_with",
    "source": "quince",
    "target": "apple",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Quince and apple combine in membrillo-adjacent and Central European poached pome service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pluot",
    "target": "plum",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Pluot and plum combine in stone-fruit galette and farmers market mixed plum preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "aprium",
    "target": "apricot",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Aprium and apricot combine in hybrid stone-fruit jam and tart filling blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "flat-peach",
    "target": "nectarine",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Flat peach and nectarine combine in donut-peach and smooth-skin stone-fruit platters."
  },
  {
    "relationship": "commonly_served_with",
    "source": "montmorency-cherry",
    "target": "sour-cherry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Montmorency cherry and sour cherry combine in pie and preserve with shared tart pie cherry identity."
  },
  {
    "relationship": "commonly_served_with",
    "source": "black-cherry",
    "target": "sweet-cherry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Black cherry and sweet cherry combine in clafouti and dark sweet cherry compote service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "huckleberry",
    "target": "blueberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Huckleberry and blueberry combine in Pacific Northwest pie and wild berry jam service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cloudberry",
    "target": "lingonberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cloudberry and lingonberry combine in Nordic cloudberry–lingon condiment and dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "serviceberry",
    "target": "blueberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Serviceberry and blueberry combine in foraged berry jam and mixed wild berry service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wineberry",
    "target": "raspberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Wineberry and raspberry combine in wild bramble preserve and foraged berry compote."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tayberry",
    "target": "loganberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Tayberry and loganberry combine in hybrid bramble jam and Pacific Northwest berry service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "boysenberry",
    "target": "marionberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Boysenberry and marionberry combine in Oregon mixed bramble pie and preserve service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "goji-berry",
    "target": "cranberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Goji berry and cranberry combine in superfood trail mix and antioxidant-forward dried fruit blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "acai",
    "target": "blueberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Açaí and blueberry combine in smoothie bowl bases and antioxidant-forward breakfast service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "barberry",
    "target": "cranberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Barberry and cranberry combine in Persian rice garnish and tart red berry sauce traditions."
  },
  {
    "relationship": "commonly_served_with",
    "source": "juniper-berry",
    "target": "barberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Juniper berry and barberry combine in game and preserved fruit sauce with resinous and tart notes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hawthorn",
    "target": "crabapple",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Hawthorn and crabapple combine in high-pectin jelly and traditional Chinese haw flake-adjacent service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mume",
    "target": "apricot",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Mume and apricot combine in Japanese umeboshi-adjacent and East Asian salted fruit traditions."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tejocote",
    "target": "apple",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Tejocote and apple combine in Mexican ponche and winter fruit punch service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sorb-apple",
    "target": "quince",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Sorb apple and quince combine in Central European high-pectin preserve and membrillo-adjacent service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "medlar",
    "target": "quince",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Medlar and quince combine in bletted fruit paste and Old World winter preserve service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "canary-melon",
    "target": "honeydew",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Canary melon and honeydew combine in yellow-flesh melon platter and fruit cup service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "piel-de-sapo",
    "target": "cantaloupe",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Piel de sapo and cantaloupe combine in Spanish melon service and mixed melon breakfast platters."
  },
  {
    "relationship": "commonly_served_with",
    "source": "horned-melon",
    "target": "passion-fruit",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Horned melon and passion fruit combine in exotic fruit platters and garnish-focused tropical service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "banana-chips",
    "target": "dried-pineapple",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Banana chips and dried pineapple combine in tropical snack mix and bakery inclusion service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dried-apple",
    "target": "dried-apricot",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dried apple and dried apricot combine in muesli and trail mix with complementary pome and stone-fruit chew."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dried-blueberry",
    "target": "dried-cranberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dried blueberry and dried cranberry combine in antioxidant trail mix and granola inclusion service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dried-cherry",
    "target": "dried-cranberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dried cherry and dried cranberry combine in holiday stuffing and bakery fruit blend service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "dried-fig",
    "target": "prune",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Dried fig and prune combine in tagine and braise glazes as distinct processed identities — not fresh plum interchange."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-milk",
    "target": "mango",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Coconut milk and mango combine in Thai mango sticky rice and tropical curry fruit finish — not fresh coconut interchange."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-milk",
    "target": "pineapple",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Coconut milk and pineapple combine in piña colada–adjacent and Southeast Asian curry applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "desiccated-coconut",
    "target": "dried-pineapple",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Desiccated coconut and dried pineapple combine in macaroon and tropical bakery inclusion service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "plantain",
    "target": "mango",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Plantain and mango combine in Caribbean ripe plantain dessert and tropical composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "loquat",
    "target": "apricot",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Loquat and apricot combine in early-season stone-fruit jam and East Asian poached fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "greengage",
    "target": "mirabelle",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Greengage and mirabelle combine in Alsatian tart and small European plum preserve service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sloe",
    "target": "blackberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Sloe and blackberry combine in sloe gin–adjacent and wild dark berry preserve traditions."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rowan",
    "target": "cranberry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rowan and cranberry combine in Nordic rowan jelly and tart red berry condiment service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sand-cherry",
    "target": "sour-cherry",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Sand cherry and sour cherry combine in Great Plains prairie cherry jam and pie service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "passion-fruit",
    "target": "mango",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Passion fruit and mango combine in tropical mousse, pavlova, and coulis layering."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rambutan",
    "target": "mangosteen",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rambutan and mangosteen combine in Southeast Asian luxury tropical fruit platter service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mangosteen",
    "target": "lychee",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Mangosteen and lychee combine in Thai and Malaysian hotel breakfast tropical fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and cheddar combine on British ploughman's lunch and American cheese board service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lime",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lime and onion combine in pico de gallo and Latin American raw condiment service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.cheese.bloomy-rind.brie-de-meaux",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and Brie combine on French cheese boards and baked Brie with fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and oats combine in crumble topping, baked oatmeal, and autumn breakfast service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and cinnamon define pie, crumble, and mulled cider-adjacent baked fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and pork loin combine in Normandy roast and American pork-with-applesauce service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.vegetable.root-vegetables.carrot",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and carrot combine in slaw, juice blends, and root-vegetable salad crunch."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pear",
    "target": "food.cheese.blue.gorgonzola",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pear and Gorgonzola combine on Italian cheese boards and walnut salad service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pear",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pear and Parmigiano-Reggiano combine in shaved pear salad and aged cheese fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pear",
    "target": "food.protein.charcuterie.prosciutto",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pear and prosciutto combine in Italian antipasto and melon-adjacent composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pear",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pear and spinach combine in wilted salad and autumn nut-and-pear green service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pear",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pear and cinnamon combine in poached pear, tart, and spiced winter fruit dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "strawberry",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Strawberry and chèvre combine in salad, tart, and spring cheese board service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "strawberry",
    "target": "food.cheese.bloomy-rind.brie-de-meaux",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Strawberry and Brie combine on dessert cheese boards and strawberry–Brie tart service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "strawberry",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Strawberry and oats combine in overnight oats, crumble, and summer breakfast bowl service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "strawberry",
    "target": "food.herb.whole-spices.vanilla-bean",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Strawberry and vanilla combine in shortcake, panna cotta, and pastry cream service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "strawberry",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Strawberry and shrimp combine in Southern strawberry salad and coastal composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blueberry",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Blueberry and oats combine in muffin, pancake, and baked breakfast service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blueberry",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Blueberry and wheat flour combine in pancake, scone, and summer berry baking service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blueberry",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Blueberry and cheddar combine in savory scone and New England cheese board service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blueberry",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Blueberry and cinnamon combine in pie, buckle, and spiced berry compote service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raspberry",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Raspberry and chèvre combine in salad and summer tart with tangy berry contrast."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raspberry",
    "target": "food.herb.whole-spices.vanilla-bean",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Raspberry and vanilla combine in pavlova, crème, and berry dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raspberry",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Raspberry and wheat flour combine in linzer tart and summer berry pastry service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blackberry",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Blackberry and oats combine in crumble and baked breakfast with bramble harvest character."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blackberry",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Blackberry and cheddar combine in savory hand pie and autumn cheese board service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cranberry",
    "target": "food.protein.poultry.chicken-thigh",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cranberry and chicken thigh combine in roast poultry glaze and Thanksgiving composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cranberry",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cranberry and pork loin combine in holiday roast and chutney-glazed pork service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cranberry",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cranberry and feta combine in salad and Mediterranean sweet-tart cheese board service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cranberry",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cranberry and oats combine in granola, crisp, and holiday breakfast service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon and salmon combine in gravlax, pan sauce, and classic fish finishing service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon and shrimp combine in scampi, ceviche, and coastal seafood finishing service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon and chicken breast combine in piccata, roast, and Mediterranean poultry service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon and garlic combine in gremolata, roast poultry, and Mediterranean aromatic finishing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon",
    "target": "food.vegetable.green-vegetables.asparagus",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon and asparagus combine in spring roast vegetable and hollandaise-adjacent service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon",
    "target": "food.herb.fresh-herbs.basil",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon and basil combine in pesto variation and summer salad finishing service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lime",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lime and salmon combine in ceviche, taco, and Latin American fish finishing service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lime",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lime and shrimp combine in ceviche, aguachile, and tropical seafood service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lime",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lime and tomato combine in salsa, ceviche, and Latin American raw sauce service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "orange",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Orange and chicken breast combine in duck à l'orange–adjacent and glazed poultry service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "orange",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Orange and pork loin combine in Cuban mojo and holiday glazed roast service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "orange",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Orange and tomato combine in Sicilian salad and winter citrus–tomato condiment service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "orange",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Orange and cinnamon combine in mulled spice, marmalade, and holiday dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "orange",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Orange and rice combine in Persian polo and citrus-scented pilaf service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grapefruit",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grapefruit and salmon combine in citrus-glazed fish and brunch composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grapefruit",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grapefruit and shrimp combine in coastal salad and citrus-seafood appetizer service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grapefruit",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grapefruit and spinach combine in winter salad with bitter greens and citrus segment."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grapefruit",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grapefruit and feta combine in Mediterranean salad with salty-briny and bitter-sweet contrast."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grape",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grape and cheddar combine on cheese boards and pub ploughman's fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grape",
    "target": "food.cheese.bloomy-rind.brie-de-meaux",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grape and Brie combine on classic French cheese board and fresh fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grape",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grape and chicken breast combine in Waldorf-adjacent and composed salad fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grape",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grape and rice combine in Persian jeweled rice and Mediterranean pilaf fruit garnish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raisin",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Raisin and cheddar combine in ploughman's lunch and fruit-and-cheese pub service — distinct from fresh grape."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raisin",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Raisin and oats combine in oatmeal, granola, and Irish soda bread fruit inclusion."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raisin",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Raisin and wheat flour combine in fruit bread, bun, and holiday baking service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raisin",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Raisin and lamb leg combine in Moroccan tagine and Middle Eastern braise fruit sweetness."
  },
  {
    "relationship": "commonly_served_with",
    "source": "prune",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Prune and brisket combine in Jewish tzimmes-adjacent and braised meat sweet-savory glazes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "prune",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Prune and pork loin combine in French prune-stuffed roast and braise service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "prune",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Prune and lamb leg combine in North African tagine and Mediterranean braise service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "prune",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Prune and rice combine in Persian pilaf and stuffed poultry fruit-sweet grain service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "date",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Date and lamb leg combine in Moroccan tagine and Middle Eastern braise service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "date",
    "target": "food.protein.beef.brisket",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Date and brisket combine in sweet-savory braise and holiday roast fruit glaze service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "date",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Date and rice combine in stuffed poultry, pilaf, and Middle Eastern sweet grain service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "date",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Date and feta combine in salad and mezze sweet-salty cheese board service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fig",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fig and Parmigiano-Reggiano combine on Italian cheese boards and prosciutto-adjacent service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fig",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fig and chèvre combine on autumn cheese board and honey-drizzled fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fig",
    "target": "food.protein.charcuterie.prosciutto",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fig and prosciutto combine in Italian antipasto and wrapped appetizer service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fig",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fig and oats combine in baked oatmeal and autumn breakfast crumble service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peach",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Peach and pork loin combine in Southern glazed roast and summer fruit meat pairing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peach",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Peach and chèvre combine in salad and summer tart with stone-fruit sweetness."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peach",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Peach and wheat flour combine in cobbler, pie, and summer stone-fruit baking service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peach",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Peach and chicken breast combine in grill and composed salad summer fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sweet-cherry",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sweet cherry and pork loin combine in duck cherry–adjacent glaze and roast fruit sauce service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sweet-cherry",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sweet cherry and ribeye combine in pan sauce and steakhouse fruit condiment service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sweet-cherry",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sweet cherry and wheat flour combine in clafouti, pie, and summer stone-fruit pastry service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sweet-cherry",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sweet cherry and cheddar combine in savory hand pie and British pub fruit-cheese service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mango",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mango and shrimp combine in tropical ceviche and coastal composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mango",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mango and chicken breast combine in curry-adjacent and tropical salad fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mango",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mango and tomato combine in salsa, chutney, and Latin American fruit-vegetable condiment service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mango",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mango and onion combine in chutney and tropical relish aromatic base service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mango",
    "target": "food.herb.fresh-herbs.basil",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mango and basil combine in Thai salad and tropical herb-fruit appetizer service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pineapple",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pineapple and shrimp combine in tropical stir-fry and coastal sweet-sour seafood service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pineapple",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pineapple and pork loin combine in Hawaiian roast and sweet-sour glaze service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pineapple",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pineapple and tomato combine in sweet-sour sauce and tropical salsa service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pineapple",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pineapple and rice combine in Hawaiian fried rice and tropical pilaf fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "banana",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Banana and oats combine in oatmeal, smoothie bowl, and breakfast baking service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "banana",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Banana and wheat flour combine in quick bread, muffin, and breakfast baking service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "banana",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Banana and cinnamon combine in bread, foster, and spiced dessert fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "banana",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Banana and chicken breast combine in Caribbean curry-adjacent and tropical composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "avocado",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Avocado and shrimp combine in cocktail, toast, and coastal composed appetizer service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "avocado",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Avocado and salmon combine in poke, toast, and omega-rich composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "avocado",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Avocado and tomato combine in guacamole, salad, and Latin American raw condiment service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "avocado",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Avocado and onion combine in guacamole and Latin American raw salsa service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "avocado",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Avocado and chicken breast combine in salad, wrap, and health-forward composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fresh coconut and shrimp combine in coastal curry and tropical seafood service — not coconut milk interchange."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fresh coconut and rice combine in Southeast Asian coconut rice and tropical pilaf service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-milk",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coconut milk and chicken breast combine in Thai curry and Southeast Asian braise service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-milk",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coconut milk and shrimp combine in Thai curry and tropical seafood stew service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-milk",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coconut milk and salmon combine in Southeast Asian curry and poached fish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-milk",
    "target": "food.vegetable.nightshades.eggplant",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coconut milk and eggplant combine in Thai and South Asian curry vegetable service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-milk",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coconut milk and rice combine in Southeast Asian curry accompaniment and sticky rice service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "watermelon",
    "target": "food.herb.fresh-herbs.mint",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Watermelon and mint combine in summer salad, agua fresca, and chilled fruit appetizer service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "watermelon",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Watermelon and feta combine in Mediterranean salad with salty-sweet summer contrast."
  },
  {
    "relationship": "commonly_served_with",
    "source": "watermelon",
    "target": "food.protein.charcuterie.prosciutto",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Watermelon and prosciutto combine in Italian antipasto and summer composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "watermelon",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Watermelon and onion combine in pickle and summer salad with sharp aromatic contrast."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pomegranate",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pomegranate and lamb leg combine in Persian fesenjan-adjacent and Middle Eastern braise service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pomegranate",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pomegranate and feta combine in salad and mezze with jewel-like aril garnish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pomegranate",
    "target": "food.vegetable.green-vegetables.spinach",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pomegranate and spinach combine in salad and Persian herb plate fruit garnish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pomegranate",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pomegranate and rice combine in Persian jeweled rice and holiday pilaf garnish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kiwi",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Kiwi and salmon combine in fruit salsa and New Zealand–style composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kiwi",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Kiwi and wheat flour combine in pavlova topping and summer fruit tart service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kiwi",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Kiwi and chèvre combine in salad with tangy tropical fruit contrast."
  },
  {
    "relationship": "commonly_served_with",
    "source": "passion-fruit",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Passion fruit and salmon combine in tropical glaze and ceviche-adjacent fish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "passion-fruit",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Passion fruit and wheat flour combine in mousse cake and tropical pastry service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "passion-fruit",
    "target": "food.cheese.fresh.goat-chevre-log",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Passion fruit and chèvre combine in dessert cheese board and tropical tart service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lime",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lime and ribeye combine in carne asada marinade and Latin American grilled beef service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon and ribeye combine in Italian tagliata and Mediterranean grilled steak finishing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and ribeye combine in tagliata-adjacent and autumn steak with fruit condiment service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pear",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pear and ribeye combine in salad and steakhouse composed plate with autumn fruit."
  },
  {
    "relationship": "commonly_served_with",
    "source": "orange",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Orange and salmon combine in citrus-glazed fish and Scandinavian composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grapefruit",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grapefruit and salmon combine in brunch fish and citrus-segment composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "strawberry",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Strawberry and salmon combine in Nordic gravlax-adjacent and summer composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mango",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mango and salmon combine in tropical glaze and poke-adjacent composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blueberry",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Blueberry and chicken breast combine in pan sauce and summer fruit poultry service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and tomato combine in chutney and sweet-sour condiment with pome acidity."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and onion combine in stuffing, chutney, and autumn savory fruit-vegetable service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.fungi.wild-mushrooms.porcini",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and porcini combine in autumn risotto-adjacent and forest mushroom fruit garnish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pear",
    "target": "food.fungi.wild-mushrooms.porcini",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pear and porcini combine in autumn salad and wild mushroom composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pear",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pear and shiitake combine in Asian-inspired salad and mushroom fruit contrast service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sweet-cherry",
    "target": "food.fungi.wild-mushrooms.porcini",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sweet cherry and porcini combine in game-adjacent sauce and autumn forest mushroom service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grape",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grape and shiitake combine in Asian hot pot fruit garnish and composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon and shiitake combine in stir-fry finishing and mushroom citrus brightness service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lime",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lime and shiitake combine in Thai salad and mushroom citrus dressing service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "orange",
    "target": "food.fungi.wild-mushrooms.chanterelle",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Orange and chanterelle combine in autumn salad and citrus-mushroom composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and wheat flour combine in pie, tart, and autumn fruit baking service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.grain.processed-grains.cornmeal",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and cornmeal combine in Southern apple cornbread and autumn dual-starch baking."
  },
  {
    "relationship": "commonly_served_with",
    "source": "banana",
    "target": "food.grain.processed-grains.cornmeal",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Banana and cornmeal combine in Caribbean banana bread and tropical baking service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peach",
    "target": "food.grain.processed-grains.cornmeal",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Peach and cornmeal combine in Southern peach cornbread and summer fruit baking service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blueberry",
    "target": "food.grain.processed-grains.cornmeal",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Blueberry and cornmeal combine in blueberry cornbread and summer berry baking service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cranberry",
    "target": "food.grain.processed-grains.cornmeal",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cranberry and cornmeal combine in holiday cornbread stuffing and berry baking service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fig",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fig and oats combine in baked oatmeal and autumn breakfast crumble service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "date",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Date and oats combine in energy bar, granola, and Middle Eastern breakfast service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "raisin",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Raisin and wheat flour combine in fruit bread and holiday bun baking service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "prune",
    "target": "food.grain.whole-grains.rice",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Prune and rice combine in Persian pilaf and stuffed poultry sweet-savory grain service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon",
    "target": "food.herb.dried-herbs.rosemary",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon and rosemary combine in roast poultry, fish, and Mediterranean aromatic finishing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "orange",
    "target": "food.herb.dried-herbs.rosemary",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Orange and rosemary combine in roast meat glaze and holiday aromatic fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.herb.dried-herbs.rosemary",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and rosemary combine in roast pork garnish and autumn herb-fruit stuffing service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pear",
    "target": "food.herb.dried-herbs.rosemary",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pear and rosemary combine in roast meat garnish and autumn composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grape",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grape and black pepper combine on modern cheese board and fruit with cracked pepper service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "strawberry",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Strawberry and black pepper combine in modern dessert and balsamic-adjacent fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pineapple",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pineapple and black pepper combine in grilled fruit and tropical sweet-heat appetizer service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mango",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mango and black pepper combine in chaat-adjacent and tropical fruit with heat service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "watermelon",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Watermelon and black pepper combine in summer salad and modern fruit appetizer service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "fig",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Fig and black pepper combine on cheese board and autumn fruit with cracked pepper service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "peach",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Peach and cinnamon combine in pie, cobbler, and spiced stone-fruit dessert service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apple",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apple and chicken breast combine in Waldorf salad and autumn composed poultry service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pear",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pear and chicken breast combine in salad and roast poultry with autumn fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grape",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grape and pork loin combine in roast with grape pan sauce and autumn fruit meat service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "orange",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Orange and pork loin combine in Cuban mojo and holiday glazed roast service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lemon",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lemon and pork loin combine in Greek roast and Mediterranean citrus meat finishing."
  },
  {
    "relationship": "commonly_served_with",
    "source": "lime",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Lime and pork loin combine in Latin American carnitas-adjacent and citrus pork service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mango",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Mango and pork loin combine in tropical glaze and sweet-sour roast fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pineapple",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pineapple and chicken breast combine in Hawaiian teriyaki and tropical composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "banana",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Banana and chicken breast combine in Caribbean curry-adjacent and tropical fruit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "avocado",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Avocado and pork loin combine in Latin American taco and composed plate fruit-fat service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-milk",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coconut milk and tomato combine in South Asian curry and tropical stew base service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-milk",
    "target": "food.herb.fresh-herbs.basil",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coconut milk and basil combine in Thai curry and tropical herb finish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "coconut-milk",
    "target": "food.protein.poultry.chicken-thigh",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Coconut milk and chicken thigh combine in Thai curry and Southeast Asian braise service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "desiccated-coconut",
    "target": "food.grain.processed-grains.wheat-flour",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Desiccated coconut and wheat flour combine in macaroon and tropical bakery service — not fresh coconut interchange."
  },
  {
    "relationship": "commonly_served_with",
    "source": "desiccated-coconut",
    "target": "food.grain.whole-grains.oats",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Desiccated coconut and oats combine in granola and tropical breakfast bake service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tamarind",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tamarind and shrimp combine in pad thai–adjacent and Southeast Asian sour seafood service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tamarind",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tamarind and salmon combine in Southeast Asian glaze and sour fruit fish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tamarind",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tamarind and tomato combine in chutney and sour-sweet condiment base service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pomegranate",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pomegranate and ribeye combine in modern steakhouse fruit sauce and Middle Eastern glaze service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sweet-cherry",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sweet cherry and lamb leg combine in pan sauce and European roast fruit meat pairing service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "plum",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Plum and pork loin combine in French prune-adjacent roast and stone-fruit glaze service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apricot",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apricot and chicken breast combine in tagine-adjacent and summer fruit poultry service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "apricot",
    "target": "food.protein.lamb.lamb-leg",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Apricot and lamb leg combine in North African tagine and stone-fruit braise service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "nectarine",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Nectarine and pork loin combine in summer roast and stone-fruit glaze service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "persimmon",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Persimmon and feta combine in autumn salad and sweet-salty composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "persimmon",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Persimmon and pork loin combine in autumn roast and fruit glaze service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "quince",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Quince and Parmigiano-Reggiano combine in membrillo and Italian cheese board service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "yuzu",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Yuzu and salmon combine in Japanese citrus fish and ponzu finishing service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "yuzu",
    "target": "food.protein.crustaceans.shrimp",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Yuzu and shrimp combine in Japanese seafood and aromatic citrus finishing service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blood-orange",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Blood orange and salmon combine in winter citrus fish and composed plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "blood-orange",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Blood orange and tomato combine in winter salad and Sicilian citrus-tomato service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kumquat",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Kumquat and chicken breast combine in glazed poultry and candied citrus garnish service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kumquat",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Kumquat and feta combine in salad with whole candied citrus and salty cheese contrast."
  },
  {
    "relationship": "commonly_served_with",
    "source": "gooseberry",
    "target": "food.protein.pork.pork-loin",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Gooseberry and pork loin combine in British gooseberry sauce and roast fruit meat service."
  }
];
