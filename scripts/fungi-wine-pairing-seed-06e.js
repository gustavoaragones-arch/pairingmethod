/**
 * FOOD-06E — Curated fungi wine pairing seed data.
 * Editorial pairing layer only — not derived from usage_intensity or reserved profiles.
 * Pairings describe the fungus itself, not dishes made from it.
 *
 * @typedef {object} PairingSeed
 * @property {"pairs_with_style"|"also_pairs_with_style"|"pairs_with_descriptor"|"pairs_with_technique"} relationship
 * @property {string} source fungus slug
 * @property {string} target wine style, descriptor, or technique slug
 * @property {"high"} confidence
 * @property {"approved"|"pending"} editorial_review
 * @property {string} evidence
 */

/** @type {PairingSeed[]} */
export const PAIRING_CURATED = [
  // —— Cultivated Mushrooms ——
  { relationship: "pairs_with_style", source: "button-mushroom", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Neutral button mushroom umami suits soft-fruited Pinot Noir without overpowering delicate preparations." },
  { relationship: "also_pairs_with_style", source: "button-mushroom", target: "pinot-grigio", confidence: "high", editorial_review: "approved", evidence: "Light sautéed button mushrooms pair with crisp Pinot Grigio when served as a simple vegetable side." },
  { relationship: "pairs_with_descriptor", source: "button-mushroom", target: "earthy", confidence: "high", editorial_review: "approved", evidence: "Button mushroom mild earth aligns with earthy Pinot Noir and rustic white wine notes." },
  { relationship: "pairs_with_style", source: "cremini", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Cremini depth and brown cap character suit Pinot Noir fruit in everyday mushroom sauté service." },
  { relationship: "pairs_with_style", source: "portobello", target: "syrah-shiraz", confidence: "high", editorial_review: "approved", evidence: "Meaty portobello cap character stands up to Syrah pepper and smoke in grill preparations." },
  { relationship: "also_pairs_with_style", source: "portobello", target: "zinfandel", confidence: "high", editorial_review: "approved", evidence: "Grilled portobello richness pairs with Zinfandel fruit in American plant-forward cookery." },
  { relationship: "pairs_with_descriptor", source: "portobello", target: "smoky", confidence: "high", editorial_review: "approved", evidence: "Char-grilled portobello aligns with smoky Syrah and lightly oaked red fruit notes." },
  { relationship: "pairs_with_technique", source: "portobello", target: "carbonic-maceration", confidence: "high", editorial_review: "approved", evidence: "Bright carbonic-maceration reds offer fruit without heavy tannin for grilled mushroom caps." },
  { relationship: "pairs_with_style", source: "shiitake", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Shiitake umami and forest depth suit Pinot Noir in Japanese and Western mushroom cookery." },
  { relationship: "also_pairs_with_style", source: "shiitake", target: "grenache", confidence: "high", editorial_review: "approved", evidence: "Dried and fresh shiitake savor pairs with Grenache fruit in Mediterranean mushroom preparations." },
  { relationship: "pairs_with_descriptor", source: "shiitake", target: "earthy", confidence: "high", editorial_review: "approved", evidence: "Shiitake guanylate-rich umami aligns with earthy notes in Pinot Noir and aged whites." },
  { relationship: "pairs_with_technique", source: "shiitake", target: "stainless-steel-aging", confidence: "high", editorial_review: "approved", evidence: "Clean stainless-aged whites preserve shiitake aroma in dashi and light Asian preparations." },
  { relationship: "pairs_with_style", source: "oyster-mushroom", target: "pinot-grigio", confidence: "high", editorial_review: "approved", evidence: "Delicate oyster mushroom suits crisp Pinot Grigio in pan and soup applications." },
  { relationship: "also_pairs_with_style", source: "oyster-mushroom", target: "dry-rose", confidence: "high", editorial_review: "approved", evidence: "Oyster mushroom in light sauté pairs with dry rosé without masking subtle cap flavor." },
  { relationship: "pairs_with_style", source: "king-oyster", target: "chardonnay", confidence: "high", editorial_review: "approved", evidence: "King oyster stem meatiness suits medium Chardonnay in sear and roast applications." },
  { relationship: "also_pairs_with_style", source: "king-oyster", target: "syrah-shiraz", confidence: "high", editorial_review: "approved", evidence: "Pan-seared king oyster pairs with Syrah when caramelized with higher heat." },
  { relationship: "pairs_with_style", source: "enoki", target: "riesling", confidence: "high", editorial_review: "approved", evidence: "Delicate enoki in hot pot and soup pairs with aromatic off-dry Riesling." },
  { relationship: "also_pairs_with_style", source: "enoki", target: "gewurztraminer", confidence: "high", editorial_review: "approved", evidence: "Enoki in Japanese and Korean broth suits Gewürztraminer aromatic lift." },
  { relationship: "pairs_with_style", source: "maitake", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Maitake frond umami and forest character suit earthy Pinot Noir." },
  { relationship: "also_pairs_with_style", source: "maitake", target: "syrah-shiraz", confidence: "high", editorial_review: "approved", evidence: "Roast maitake pairs with Syrah when caramelized in higher-heat preparations." },
  { relationship: "pairs_with_descriptor", source: "maitake", target: "earthy", confidence: "high", editorial_review: "approved", evidence: "Maitake hen-of-the-woods earth aligns with earthy Pinot and Rhône red notes." },
  { relationship: "pairs_with_style", source: "straw-mushroom", target: "gewurztraminer", confidence: "high", editorial_review: "approved", evidence: "Straw mushroom in Southeast Asian stir-fry pairs with Gewürztraminer spice tolerance." },
  { relationship: "pairs_with_style", source: "chestnut-mushroom", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Chestnut mushroom nutty cap suits Pinot Noir in European cultivated mushroom service." },
  { relationship: "pairs_with_style", source: "cinnamon-cap-mushroom", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Cinnamon cap mild forest flavor suits light Pinot Noir in autumn mushroom foraging cookery." },
  { relationship: "pairs_with_style", source: "elm-oyster-mushroom", target: "pinot-grigio", confidence: "high", editorial_review: "approved", evidence: "Elm oyster delicate Pleurotus character suits crisp Pinot Grigio in pan preparations." },
  { relationship: "pairs_with_style", source: "almond-mushroom", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Almond mushroom nutty Agaricus notes suit Pinot Noir fruit in cultivated mushroom medleys." },
  { relationship: "pairs_with_style", source: "pioppino", target: "sangiovese", confidence: "high", editorial_review: "approved", evidence: "Pioppino nutty Italian cultivated character pairs with Sangiovese in Tuscan mushroom contorno." },
  { relationship: "pairs_with_style", source: "wine-cap-mushroom", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Wine cap garden mushroom earth suits Pinot Noir in foraged and cultivated autumn service." },

  // —— Wild Mushrooms ——
  { relationship: "pairs_with_style", source: "porcini", target: "nebbiolo", confidence: "high", editorial_review: "approved", evidence: "Porcini forest umami and tannic structure mirror Nebbiolo acid and tar in Piedmontese pairing tradition." },
  { relationship: "also_pairs_with_style", source: "porcini", target: "sangiovese", confidence: "high", editorial_review: "approved", evidence: "Porcini in Tuscan and Umbrian cookery pairs with Sangiovese savory cherry fruit." },
  { relationship: "pairs_with_descriptor", source: "porcini", target: "earthy", confidence: "high", editorial_review: "approved", evidence: "Porcini cep earth aligns with earthy Nebbiolo and aged Barolo-area red character." },
  { relationship: "pairs_with_technique", source: "porcini", target: "malolactic-fermentation", confidence: "high", editorial_review: "approved", evidence: "Malolactic softness in Chardonnay suits porcini in cream and butter finishing without sharp acid clash." },
  { relationship: "pairs_with_style", source: "chanterelle", target: "chardonnay", confidence: "high", editorial_review: "approved", evidence: "Chanterelle apricot fruit and delicate savor suit oaked Chardonnay in classic forest-mushroom service." },
  { relationship: "also_pairs_with_style", source: "chanterelle", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Chanterelle in Nordic and Burgundian preparations pairs with light Pinot Noir fruit." },
  { relationship: "pairs_with_descriptor", source: "chanterelle", target: "nutty", confidence: "high", editorial_review: "approved", evidence: "Chanterelle subtle nut aligns with nutty oak influence in barrel-aged Chardonnay." },
  { relationship: "pairs_with_technique", source: "chanterelle", target: "barrel-aging", confidence: "high", editorial_review: "approved", evidence: "Moderate barrel-aged whites complement chanterelle fruit without masking delicate aroma." },
  { relationship: "pairs_with_style", source: "morel", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Morel honeycomb earth suits Pinot Noir in spring foraged mushroom service." },
  { relationship: "also_pairs_with_style", source: "morel", target: "chardonnay", confidence: "high", editorial_review: "approved", evidence: "Morel in cream sauce pairs with medium Chardonnay in French and American spring menus." },
  { relationship: "pairs_with_descriptor", source: "morel", target: "earthy", confidence: "high", editorial_review: "approved", evidence: "Morel forest floor character aligns with earthy Pinot Noir and mature white oxidative notes." },
  { relationship: "pairs_with_technique", source: "morel", target: "malolactic-fermentation", confidence: "high", editorial_review: "approved", evidence: "Malolactic Chardonnay suits morel in butter and cream without sharp green clash." },
  { relationship: "pairs_with_style", source: "black-trumpet", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Black trumpet dark earth suits Pinot Noir in Burgundian and Provençal wild-mushroom cookery." },
  { relationship: "pairs_with_descriptor", source: "black-trumpet", target: "earthy", confidence: "high", editorial_review: "approved", evidence: "Black trumpet horn-of-plenty depth aligns with earthy Old World red fruit." },
  { relationship: "pairs_with_style", source: "hedgehog-mushroom", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Hedgehog mushroom sweet tooth character suits Pinot Noir in Pacific Northwest foraged service." },
  { relationship: "pairs_with_descriptor", source: "hedgehog-mushroom", target: "nutty", confidence: "high", editorial_review: "approved", evidence: "Hedgehog mushroom mild nut aligns with nutty notes in lightly oaked Chardonnay and Pinot." },
  { relationship: "pairs_with_style", source: "matsutake", target: "riesling", confidence: "high", editorial_review: "approved", evidence: "Matsutake pine-cinnamon aroma suits aromatic Riesling in Japanese autumn kaiseki tradition." },
  { relationship: "also_pairs_with_style", source: "matsutake", target: "champagne", confidence: "high", editorial_review: "approved", evidence: "Matsutake ceremonial service pairs with Champagne acidity to lift resinous aroma without masking it." },
  { relationship: "pairs_with_descriptor", source: "matsutake", target: "herbal", confidence: "high", editorial_review: "approved", evidence: "Matsutake pine-herb character aligns with herbal notes in aromatic whites and cool-climate reds." },
  { relationship: "pairs_with_technique", source: "matsutake", target: "stainless-steel-aging", confidence: "high", editorial_review: "approved", evidence: "Clean stainless-aged whites preserve matsutake aroma better than heavy oak influence." },
  { relationship: "pairs_with_style", source: "lobster-mushroom", target: "chardonnay", confidence: "high", editorial_review: "approved", evidence: "Lobster mushroom seafood-adjacent savor suits Chardonnay in Pacific Northwest composed plates." },
  { relationship: "also_pairs_with_style", source: "lobster-mushroom", target: "sauvignon-blanc", confidence: "high", editorial_review: "approved", evidence: "Lobster mushroom bright color pairs with high-acid Sauvignon Blanc in foraged mushroom salads." },
  { relationship: "pairs_with_style", source: "blewit", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Blewit lilac-tinted earth suits Pinot Noir in European woodland foraged mushroom service." },
  { relationship: "pairs_with_style", source: "cauliflower-mushroom", target: "chardonnay", confidence: "high", editorial_review: "approved", evidence: "Cauliflower mushroom coral texture suits Chardonnay in specialty foraged mushroom preparations." },
  { relationship: "pairs_with_style", source: "chicken-of-the-woods", target: "chardonnay", confidence: "high", editorial_review: "approved", evidence: "Chicken of the woods poultry-adjacent savor suits medium Chardonnay without red tannin clash." },
  { relationship: "also_pairs_with_style", source: "chicken-of-the-woods", target: "viognier", confidence: "high", editorial_review: "approved", evidence: "Sautéed chicken of the woods pairs with Viognier body in American foraged mushroom service." },
  { relationship: "pairs_with_style", source: "parasol-mushroom", target: "albarino", confidence: "high", editorial_review: "approved", evidence: "Parasol mushroom mild cap suits Albariño crispness in European foraged mushroom antipasto." },
  { relationship: "pairs_with_style", source: "saffron-milk-cap", target: "grenache", confidence: "high", editorial_review: "approved", evidence: "Saffron milk cap Mediterranean forest character pairs with Grenache in Iberian mushroom cookery." },
  { relationship: "pairs_with_style", source: "shaggy-mane", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Shaggy mane delicate cap suits Pinot Noir when prepared quickly before autolysis." },
  { relationship: "pairs_with_style", source: "termite-mushroom", target: "gewurztraminer", confidence: "high", editorial_review: "approved", evidence: "Termite mushroom in Southeast Asian cookery pairs with Gewürztraminer aromatic spice tolerance." },

  // —— Truffles ——
  { relationship: "pairs_with_style", source: "white-truffle", target: "nebbiolo", confidence: "high", editorial_review: "approved", evidence: "White truffle garlicky aroma suits structured Nebbiolo from Piedmont — aroma compatibility over prestige alone." },
  { relationship: "also_pairs_with_style", source: "white-truffle", target: "champagne", confidence: "high", editorial_review: "approved", evidence: "White truffle finishing pairs with elegant Champagne acidity that lifts aroma without competing tannin." },
  { relationship: "pairs_with_descriptor", source: "white-truffle", target: "herbal", confidence: "high", editorial_review: "approved", evidence: "White truffle sulfur-garlic aroma aligns with herbal and floral notes in aromatic structured whites and reds." },
  { relationship: "pairs_with_technique", source: "white-truffle", target: "stainless-steel-aging", confidence: "high", editorial_review: "approved", evidence: "Clean stainless-aged whites preserve white truffle aroma better than heavy new-oak influence." },
  { relationship: "pairs_with_style", source: "black-truffle", target: "syrah-shiraz", confidence: "high", editorial_review: "approved", evidence: "Black truffle earthy depth suits fuller-bodied Syrah with pepper and dark fruit — culinary earth, not prestige pairing." },
  { relationship: "also_pairs_with_style", source: "black-truffle", target: "nebbiolo", confidence: "high", editorial_review: "approved", evidence: "Black truffle in winter service pairs with Nebbiolo tar and acid in Northern Italian tradition." },
  { relationship: "pairs_with_descriptor", source: "black-truffle", target: "earthy", confidence: "high", editorial_review: "approved", evidence: "Black truffle forest earth aligns with earthy Syrah and Nebbiolo without requiring the most extracted wines." },
  { relationship: "pairs_with_technique", source: "black-truffle", target: "barrel-aging", confidence: "high", editorial_review: "approved", evidence: "Moderate barrel-aged reds complement black truffle earth without overwhelming delicate shaved aroma." },
  { relationship: "pairs_with_style", source: "bianchetto-truffle", target: "nebbiolo", confidence: "high", editorial_review: "approved", evidence: "Bianchetto truffle garlicky aroma suits Nebbiolo structure in Italian white-truffle-adjacent service." },
  { relationship: "pairs_with_descriptor", source: "bianchetto-truffle", target: "herbal", confidence: "high", editorial_review: "approved", evidence: "Bianchetto aromatic sulfur aligns with herbal notes in elegant Piedmontese-compatible wines." },
  { relationship: "pairs_with_style", source: "burgundy-truffle", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Burgundy truffle and Pinot Noir share regional terroir affinity in classic French forest pairing." },
  { relationship: "pairs_with_descriptor", source: "burgundy-truffle", target: "earthy", confidence: "high", editorial_review: "approved", evidence: "Burgundy truffle subtle earth aligns with earthy Côte de Nuits Pinot character." },
  { relationship: "pairs_with_style", source: "summer-truffle", target: "pinot-noir", confidence: "high", editorial_review: "approved", evidence: "Summer truffle milder aroma suits lighter Pinot Noir when truffle is used as accent finishing." },
  { relationship: "also_pairs_with_style", source: "summer-truffle", target: "dry-rose", confidence: "high", editorial_review: "approved", evidence: "Summer truffle on vegetables pairs with dry rosé when served in warm-season composed plates." },

  // —— Specialty Fungi ——
  { relationship: "pairs_with_style", source: "wood-ear", target: "riesling", confidence: "high", editorial_review: "approved", evidence: "Wood ear chewy texture in Chinese stir-fry pairs with off-dry Riesling spice balance." },
  { relationship: "pairs_with_style", source: "snow-fungus", target: "moscato", confidence: "high", editorial_review: "approved", evidence: "Snow fungus in sweet soup and dessert contexts suits gentle Moscato fruit." },
  { relationship: "also_pairs_with_style", source: "snow-fungus", target: "riesling", confidence: "high", editorial_review: "approved", evidence: "Snow fungus in savory broth pairs with aromatic Riesling in Chinese tonic preparations." },
  { relationship: "pairs_with_style", source: "nameko", target: "riesling", confidence: "high", editorial_review: "approved", evidence: "Nameko slippery cap in miso soup pairs with off-dry Riesling in Japanese home cooking." },
  { relationship: "pairs_with_style", source: "lions-mane", target: "chardonnay", confidence: "high", editorial_review: "approved", evidence: "Lion's mane crab-adjacent texture suits Chardonnay in plant-based and specialty mushroom service." },
  { relationship: "pairs_with_style", source: "coral-tooth-mushroom", target: "chardonnay", confidence: "high", editorial_review: "approved", evidence: "Coral tooth mushroom delicate savor suits medium Chardonnay in specialty foraged preparations." },
  { relationship: "pairs_with_style", source: "bamboo-pith", target: "gewurztraminer", confidence: "high", editorial_review: "approved", evidence: "Bamboo pith in Chinese banquet soup pairs with Gewürztraminer aromatic lift." },
  { relationship: "pairs_with_style", source: "abalone-mushroom", target: "pinot-grigio", confidence: "high", editorial_review: "approved", evidence: "Abalone mushroom seafood-adjacent cap suits crisp Pinot Grigio in East Asian specialty service." },
  { relationship: "pairs_with_style", source: "beech-mushroom", target: "riesling", confidence: "high", editorial_review: "approved", evidence: "Beech mushroom cluster delicacy pairs with Riesling in Japanese and Korean hot-pot service." },
  { relationship: "pairs_with_style", source: "fried-chicken-mushroom", target: "chardonnay", confidence: "high", editorial_review: "approved", evidence: "Fried chicken mushroom poultry-like savor suits Chardonnay in American foraged mushroom cookery." },
];
