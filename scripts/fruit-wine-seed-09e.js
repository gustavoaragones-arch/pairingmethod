/**
 * FOOD-09E — Curated fruit wine pairing seed data.
 * Editorial pairing layer only — not derived from flavor_profile or usage_intensity.
 * FRUIT-PAIR-001: pair by culinary role in the finished dish, not botanical origin alone.
 * FRUIT-001: processed canonical identities retain distinct pairing profiles.
 *
 * @typedef {object} PairingSeed
 * @property {"pairs_with_style"|"also_pairs_with_style"|"pairs_with_descriptor"|"pairs_with_technique"} relationship
 * @property {string} source fruit slug
 * @property {string} target wine style, descriptor, or technique slug
 * @property {"high"} confidence
 * @property {"approved"|"pending"} editorial_review
 * @property {string} evidence
 */

/** @type {PairingSeed[]} */
export const PAIRING_CURATED = [
  {
    "relationship": "pairs_with_style",
    "source": "acai",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Açaí Açaí berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "apple",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Apple apple pome acid in pie and raw salad per FRUIT-PAIR-001 suits chenin-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "apricot",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Apricot Apricot stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "aprium",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Aprium Aprium stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "asian-pear",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Asian Pear Asian Pear fresh pome acidity in salad and baking suits chenin-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "avocado",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Avocado avocado fat and green freshness in raw garnish per FRUIT-PAIR-001 suits sauvignon-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "banana",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Banana Banana tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "banana-chips",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Banana Chips Banana Chips processed-fruit concentrate in baking and slow-cook glazes suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "barberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Barberry Barberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "bergamot",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Bergamot Bergamot citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "black-cherry",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Black Cherry Black Cherry stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "black-currant",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Black Currant Black Currant berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "blackberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Blackberry Blackberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "blood-orange",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Blood Orange Blood Orange citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "blueberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Blueberry Blueberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "boysenberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Boysenberry Boysenberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "calamansi",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Calamansi Calamansi citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "canary-melon",
    "target": "dry-rose",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Canary Melon Canary Melon chilled melon refreshment and summer platters suits dry-rose per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "candied-orange-peel",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Candied Orange Peel Candied Orange Peel processed-fruit concentrate in baking and slow-cook glazes suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "cantaloupe",
    "target": "dry-rose",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cantaloupe Cantaloupe chilled melon refreshment and summer platters suits dry-rose per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "casaba-melon",
    "target": "dry-rose",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Casaba Melon Casaba Melon chilled melon refreshment and summer platters suits dry-rose per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "citron",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Citron Citron citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "clementine",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Clementine Clementine citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "cloudberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cloudberry Cloudberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "coconut",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Coconut fresh coconut tropical freshness — not coconut milk curry function per FRUIT-001 suits prosecco per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "coconut-milk",
    "target": "chardonnay",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Coconut Milk coconut milk rich creamy curry and dessert base per FRUIT-PAIR-001 suits chardonnay per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "crabapple",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Crabapple Crabapple fresh pome acidity in salad and baking suits chenin-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "cranberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cranberry Cranberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "crenshaw-melon",
    "target": "dry-rose",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Crenshaw Melon Crenshaw Melon chilled melon refreshment and summer platters suits dry-rose per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "currants",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Currants Currants processed-fruit concentrate in baking and slow-cook glazes suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "damson",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Damson Damson stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "date",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Date date molasses sweetness in tagine and stuffing per FRUIT-PAIR-001 suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "desiccated-coconut",
    "target": "moscato",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Desiccated Coconut desiccated coconut baking and macaroon identity per FRUIT-PAIR-001 suits moscato per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "dragon-fruit",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dragon Fruit Dragon Fruit tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "dried-apple",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Apple Dried Apple processed-fruit concentrate in baking and slow-cook glazes suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "dried-apricot",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Apricot Dried Apricot processed-fruit concentrate in baking and slow-cook glazes suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "dried-blueberry",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Blueberry Dried Blueberry processed-fruit concentrate in baking and slow-cook glazes suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "dried-cherry",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Cherry Dried Cherry processed-fruit concentrate in baking and slow-cook glazes suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "dried-cranberry",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Cranberry Dried Cranberry processed-fruit concentrate in baking and slow-cook glazes suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "dried-date",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Date Dried Date processed-fruit concentrate in baking and slow-cook glazes suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "dried-fig",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Fig Dried Fig processed-fruit concentrate in baking and slow-cook glazes suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "dried-mango",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Mango Dried Mango processed-fruit concentrate in baking and slow-cook glazes suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "dried-pineapple",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Pineapple Dried Pineapple processed-fruit concentrate in baking and slow-cook glazes suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "durian",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Durian Durian tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "elderberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Elderberry Elderberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "fig",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Fig fig honeyed depth on cheese boards and slow roast per FRUIT-PAIR-001 suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "flat-peach",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Flat Peach Flat Peach stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "galia-melon",
    "target": "dry-rose",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Galia Melon Galia Melon chilled melon refreshment and summer platters suits dry-rose per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "goji-berry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Goji Berry Goji Berry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "golden-raisin",
    "target": "madeira",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Golden Raisin golden dried-grape in soda bread and pilaf per FRUIT-PAIR-001 suits madeira per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "gooseberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Gooseberry Gooseberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "grape",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Grape fresh table grape juiciness on cheese boards — not raisin dried profile per FRUIT-001 suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "grapefruit",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Grapefruit Grapefruit citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "greengage",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Greengage Greengage stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "guava",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Guava Guava tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "hawthorn",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hawthorn Hawthorn fresh pome acidity in salad and baking suits chenin-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "honeydew",
    "target": "dry-rose",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Honeydew Honeydew chilled melon refreshment and summer platters suits dry-rose per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "horned-melon",
    "target": "dry-rose",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Horned Melon Horned Melon chilled melon refreshment and summer platters suits dry-rose per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "huckleberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Huckleberry Huckleberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "jackfruit",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Jackfruit Jackfruit tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "juniper-berry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Juniper Berry Juniper Berry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "key-lime",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Key Lime Key Lime citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "kiwi",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Kiwi Kiwi tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "kumquat",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Kumquat Kumquat citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "lemon",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Lemon lemon acidity and freshness in finishing per FRUIT-PAIR-001 suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "lime",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Lime lime sharp acid in ceviche and tropical finishing per FRUIT-PAIR-001 suits sauvignon-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "lingonberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Lingonberry Lingonberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "loganberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Loganberry Loganberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "loquat",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Loquat Loquat fresh pome acidity in salad and baking suits chenin-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "lychee",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Lychee Lychee tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "mandarin",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mandarin Mandarin citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "mango",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mango mango tropical richness in salsa and dessert per FRUIT-PAIR-001 suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "mangosteen",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mangosteen Mangosteen tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "marionberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Marionberry Marionberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "medlar",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Medlar Medlar fresh pome acidity in salad and baking suits chenin-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "mirabelle",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mirabelle Mirabelle stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "montmorency-cherry",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Montmorency Cherry Montmorency Cherry stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "mulberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mulberry Mulberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "mume",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mume Mume stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "nectarine",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Nectarine Nectarine stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "orange",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Orange Orange citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "papaya",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Papaya Papaya tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "passion-fruit",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Passion Fruit Passion Fruit tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "peach",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Peach Peach stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pear",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pear Pear fresh pome acidity in salad and baking suits chenin-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "persimmon",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Persimmon Persimmon tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "piel-de-sapo",
    "target": "dry-rose",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Piel de Sapo Piel de Sapo chilled melon refreshment and summer platters suits dry-rose per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pineapple",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pineapple Pineapple tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "plantain",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Plantain Plantain tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "plum",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Plum fresh plum tartness in tarts and grilling — not prune braise identity suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pluot",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pluot Pluot stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pomegranate",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pomegranate Pomegranate tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pomelo",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pomelo Pomelo citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "prune",
    "target": "syrah-shiraz",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Prune prune slow-cooked braise and glaze applications per FRUIT-PAIR-001 suits syrah-shiraz per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "quince",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Quince Quince fresh pome acidity in salad and baking suits chenin-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "raisin",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Raisin dried-grape sweetness in tagine and baking per FRUIT-PAIR-001 — distinct from fresh grape suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "rambutan",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Rambutan Rambutan tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "raspberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Raspberry Raspberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "red-currant",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Red Currant Red Currant berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "rowan",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Rowan Rowan fresh pome acidity in salad and baking suits chenin-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sand-cherry",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sand Cherry Sand Cherry stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "satsuma",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Satsuma Satsuma citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sea-buckthorn",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sea Buckthorn Sea Buckthorn berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "serviceberry",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Serviceberry Serviceberry fresh pome acidity in salad and baking suits chenin-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sloe",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sloe Sloe stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sorb-apple",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sorb Apple Sorb Apple fresh pome acidity in salad and baking suits chenin-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sour-cherry",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sour Cherry Sour Cherry stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "starfruit",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Starfruit Starfruit tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "strawberry",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Strawberry strawberry red berry sweetness in dessert and raw service suits prosecco per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sudachi",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sudachi Sudachi citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sultanas",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sultanas seedless dried-grape in chutney per FRUIT-PAIR-001 — not fresh grape interchange suits port per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sweet-cherry",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sweet Cherry Sweet Cherry stone-fruit perfume in tarts and grilling suits gewurztraminer per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "tamarind",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Tamarind Tamarind tropical aromatic fruit in raw and smoothie service suits viognier per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "tangerine",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Tangerine Tangerine citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "tayberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Tayberry Tayberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "tejocote",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Tejocote Tejocote fresh pome acidity in salad and baking suits chenin-blanc per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "watermelon",
    "target": "dry-rose",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Watermelon watermelon summer refreshment and raw service per FRUIT-PAIR-001 suits dry-rose per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "wineberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Wineberry Wineberry berry brightness in compote and dessert garnish suits pinot-noir per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "pairs_with_style",
    "source": "yuzu",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Yuzu Yuzu citrus acid and zest in finishing and raw use suits albarino per FRUIT-PAIR-001 culinary role pairing — not botanical origin alone."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "acai",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Açaí also pairs with prosecco when Açaí berry brightness in compote and dessert garnish appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "apple",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Apple also pairs with riesling when apple pome acid in pie and raw salad per FRUIT-PAIR-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "apricot",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Apricot also pairs with viognier when Apricot stone-fruit perfume in tarts and grilling appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "asian-pear",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Asian Pear also pairs with riesling when Asian Pear fresh pome acidity in salad and baking appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "avocado",
    "target": "chardonnay",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Avocado also pairs with chardonnay when avocado fat and green freshness in raw garnish per FRUIT-PAIR-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "banana",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Banana also pairs with gewurztraminer when Banana tropical aromatic fruit in raw and smoothie service appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "barberry",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Barberry also pairs with prosecco when Barberry berry brightness in compote and dessert garnish appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "black-cherry",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Black Cherry also pairs with viognier when Black Cherry stone-fruit perfume in tarts and grilling appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "blackberry",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Blackberry also pairs with prosecco when Blackberry berry brightness in compote and dessert garnish appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "blueberry",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Blueberry also pairs with prosecco when Blueberry berry brightness in compote and dessert garnish appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "calamansi",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Calamansi also pairs with sauvignon-blanc when Calamansi citrus acid and zest in finishing and raw use appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "candied-orange-peel",
    "target": "zinfandel",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Candied Orange Peel also pairs with zinfandel when Candied Orange Peel processed-fruit concentrate in baking and slow-cook glazes appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "casaba-melon",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Casaba Melon also pairs with albarino when Casaba Melon chilled melon refreshment and summer platters appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "clementine",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Clementine also pairs with sauvignon-blanc when Clementine citrus acid and zest in finishing and raw use appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "coconut",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Coconut also pairs with albarino when fresh coconut tropical freshness — not coconut milk curry function per FRUIT-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "coconut-milk",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Coconut Milk also pairs with gewurztraminer when coconut milk rich creamy curry and dessert base per FRUIT-PAIR-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "crabapple",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Crabapple also pairs with riesling when Crabapple fresh pome acidity in salad and baking appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "crenshaw-melon",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Crenshaw Melon also pairs with albarino when Crenshaw Melon chilled melon refreshment and summer platters appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "damson",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Damson also pairs with viognier when Damson stone-fruit perfume in tarts and grilling appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "date",
    "target": "syrah-shiraz",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Date also pairs with syrah-shiraz when date molasses sweetness in tagine and stuffing per FRUIT-PAIR-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "desiccated-coconut",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Desiccated Coconut also pairs with chenin-blanc when desiccated coconut baking and macaroon identity per FRUIT-PAIR-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "dried-apple",
    "target": "zinfandel",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Apple also pairs with zinfandel when Dried Apple processed-fruit concentrate in baking and slow-cook glazes appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "dried-blueberry",
    "target": "zinfandel",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Blueberry also pairs with zinfandel when Dried Blueberry processed-fruit concentrate in baking and slow-cook glazes appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "dried-cranberry",
    "target": "zinfandel",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Cranberry also pairs with zinfandel when Dried Cranberry processed-fruit concentrate in baking and slow-cook glazes appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "dried-fig",
    "target": "zinfandel",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Fig also pairs with zinfandel when Dried Fig processed-fruit concentrate in baking and slow-cook glazes appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "dried-pineapple",
    "target": "zinfandel",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Pineapple also pairs with zinfandel when Dried Pineapple processed-fruit concentrate in baking and slow-cook glazes appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "elderberry",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Elderberry also pairs with prosecco when Elderberry berry brightness in compote and dessert garnish appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "fig",
    "target": "syrah-shiraz",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Fig also pairs with syrah-shiraz when fig honeyed depth on cheese boards and slow roast per FRUIT-PAIR-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "flat-peach",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Flat Peach also pairs with viognier when Flat Peach stone-fruit perfume in tarts and grilling appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "goji-berry",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Goji Berry also pairs with prosecco when Goji Berry berry brightness in compote and dessert garnish appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "golden-raisin",
    "target": "moscato",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Golden Raisin also pairs with moscato when golden dried-grape in soda bread and pilaf per FRUIT-PAIR-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "gooseberry",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Gooseberry also pairs with prosecco when Gooseberry berry brightness in compote and dessert garnish appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "grape",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Grape also pairs with prosecco when fresh table grape juiciness on cheese boards — not raisin dried profile per FRUIT-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "grapefruit",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Grapefruit also pairs with sauvignon-blanc when Grapefruit citrus acid and zest in finishing and raw use appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "guava",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Guava also pairs with gewurztraminer when Guava tropical aromatic fruit in raw and smoothie service appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "honeydew",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Honeydew also pairs with albarino when Honeydew chilled melon refreshment and summer platters appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "huckleberry",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Huckleberry also pairs with prosecco when Huckleberry berry brightness in compote and dessert garnish appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "juniper-berry",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Juniper Berry also pairs with prosecco when Juniper Berry berry brightness in compote and dessert garnish appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "kiwi",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Kiwi also pairs with gewurztraminer when Kiwi tropical aromatic fruit in raw and smoothie service appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "lemon",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Lemon also pairs with sauvignon-blanc when lemon acidity and freshness in finishing per FRUIT-PAIR-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "lime",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Lime also pairs with albarino when lime sharp acid in ceviche and tropical finishing per FRUIT-PAIR-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "lingonberry",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Lingonberry also pairs with prosecco when Lingonberry berry brightness in compote and dessert garnish appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "loquat",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Loquat also pairs with riesling when Loquat fresh pome acidity in salad and baking appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "mandarin",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mandarin also pairs with sauvignon-blanc when Mandarin citrus acid and zest in finishing and raw use appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "mango",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mango also pairs with gewurztraminer when mango tropical richness in salsa and dessert per FRUIT-PAIR-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "mangosteen",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mangosteen also pairs with gewurztraminer when Mangosteen tropical aromatic fruit in raw and smoothie service appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "medlar",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Medlar also pairs with riesling when Medlar fresh pome acidity in salad and baking appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "montmorency-cherry",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Montmorency Cherry also pairs with viognier when Montmorency Cherry stone-fruit perfume in tarts and grilling appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "mume",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mume also pairs with viognier when Mume stone-fruit perfume in tarts and grilling appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "orange",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Orange also pairs with sauvignon-blanc when Orange citrus acid and zest in finishing and raw use appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "passion-fruit",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Passion Fruit also pairs with gewurztraminer when Passion Fruit tropical aromatic fruit in raw and smoothie service appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "pear",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pear also pairs with riesling when Pear fresh pome acidity in salad and baking appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "piel-de-sapo",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Piel de Sapo also pairs with albarino when Piel de Sapo chilled melon refreshment and summer platters appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "plantain",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Plantain also pairs with gewurztraminer when Plantain tropical aromatic fruit in raw and smoothie service appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "plum",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Plum also pairs with pinot-noir when fresh plum tartness in tarts and grilling — not prune braise identity appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "pluot",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pluot also pairs with viognier when Pluot stone-fruit perfume in tarts and grilling appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "pomelo",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pomelo also pairs with sauvignon-blanc when Pomelo citrus acid and zest in finishing and raw use appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "prune",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Prune also pairs with port when prune slow-cooked braise and glaze applications per FRUIT-PAIR-001 appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "quince",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Quince also pairs with riesling when Quince fresh pome acidity in salad and baking appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "raisin",
    "target": "madeira",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Raisin also pairs with madeira when dried-grape sweetness in tagine and baking per FRUIT-PAIR-001 — distinct from fresh grape appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "rambutan",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Rambutan also pairs with gewurztraminer when Rambutan tropical aromatic fruit in raw and smoothie service appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "red-currant",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Red Currant also pairs with prosecco when Red Currant berry brightness in compote and dessert garnish appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "sand-cherry",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sand Cherry also pairs with viognier when Sand Cherry stone-fruit perfume in tarts and grilling appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "sea-buckthorn",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sea Buckthorn also pairs with prosecco when Sea Buckthorn berry brightness in compote and dessert garnish appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "sloe",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sloe also pairs with viognier when Sloe stone-fruit perfume in tarts and grilling appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "sour-cherry",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sour Cherry also pairs with viognier when Sour Cherry stone-fruit perfume in tarts and grilling appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "strawberry",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Strawberry also pairs with pinot-noir when strawberry red berry sweetness in dessert and raw service appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "sultanas",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sultanas also pairs with chenin-blanc when seedless dried-grape in chutney per FRUIT-PAIR-001 — not fresh grape interchange appears in composed plates per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "acai",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Açaí Açaí berry brightness in compote and dessert garnish aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "apricot",
    "target": "floral",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Apricot Apricot stone-fruit perfume in tarts and grilling aligns with floral wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "aprium",
    "target": "floral",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Aprium Aprium stone-fruit perfume in tarts and grilling aligns with floral wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "avocado",
    "target": "creamy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Avocado avocado fat and green freshness in raw garnish per FRUIT-PAIR-001 aligns with creamy wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "banana",
    "target": "floral",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Banana Banana tropical aromatic fruit in raw and smoothie service aligns with floral wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "barberry",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Barberry Barberry berry brightness in compote and dessert garnish aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "bergamot",
    "target": "citrus-zest",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Bergamot Bergamot citrus acid and zest in finishing and raw use aligns with citrus-zest wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "black-currant",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Black Currant Black Currant berry brightness in compote and dessert garnish aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "blackberry",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Blackberry Blackberry berry brightness in compote and dessert garnish aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "blueberry",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Blueberry Blueberry berry brightness in compote and dessert garnish aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "boysenberry",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Boysenberry Boysenberry berry brightness in compote and dessert garnish aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "canary-melon",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Canary Melon Canary Melon chilled melon refreshment and summer platters aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "candied-orange-peel",
    "target": "jammy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Candied Orange Peel Candied Orange Peel processed-fruit concentrate in baking and slow-cook glazes aligns with jammy wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "casaba-melon",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Casaba Melon Casaba Melon chilled melon refreshment and summer platters aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "citron",
    "target": "citrus-zest",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Citron Citron citrus acid and zest in finishing and raw use aligns with citrus-zest wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "cloudberry",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cloudberry Cloudberry berry brightness in compote and dessert garnish aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "coconut",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Coconut fresh coconut tropical freshness — not coconut milk curry function per FRUIT-001 aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "crabapple",
    "target": "tart",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Crabapple Crabapple fresh pome acidity in salad and baking aligns with tart wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "cranberry",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cranberry Cranberry berry brightness in compote and dessert garnish aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "currants",
    "target": "jammy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Currants Currants processed-fruit concentrate in baking and slow-cook glazes aligns with jammy wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "damson",
    "target": "floral",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Damson Damson stone-fruit perfume in tarts and grilling aligns with floral wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "desiccated-coconut",
    "target": "nutty",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Desiccated Coconut desiccated coconut baking and macaroon identity per FRUIT-PAIR-001 aligns with nutty wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "dragon-fruit",
    "target": "floral",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dragon Fruit Dragon Fruit tropical aromatic fruit in raw and smoothie service aligns with floral wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "dried-apricot",
    "target": "jammy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Apricot Dried Apricot processed-fruit concentrate in baking and slow-cook glazes aligns with jammy wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "dried-blueberry",
    "target": "jammy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Blueberry Dried Blueberry processed-fruit concentrate in baking and slow-cook glazes aligns with jammy wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "dried-cranberry",
    "target": "jammy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Cranberry Dried Cranberry processed-fruit concentrate in baking and slow-cook glazes aligns with jammy wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "dried-date",
    "target": "jammy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Date Dried Date processed-fruit concentrate in baking and slow-cook glazes aligns with jammy wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "dried-mango",
    "target": "jammy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Mango Dried Mango processed-fruit concentrate in baking and slow-cook glazes aligns with jammy wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "dried-pineapple",
    "target": "jammy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Pineapple Dried Pineapple processed-fruit concentrate in baking and slow-cook glazes aligns with jammy wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "elderberry",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Elderberry Elderberry berry brightness in compote and dessert garnish aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "fig",
    "target": "jammy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Fig fig honeyed depth on cheese boards and slow roast per FRUIT-PAIR-001 aligns with jammy wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "galia-melon",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Galia Melon Galia Melon chilled melon refreshment and summer platters aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "goji-berry",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Goji Berry Goji Berry berry brightness in compote and dessert garnish aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "gooseberry",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Gooseberry Gooseberry berry brightness in compote and dessert garnish aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "grape",
    "target": "primary-fruit",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Grape fresh table grape juiciness on cheese boards — not raisin dried profile per FRUIT-001 aligns with primary-fruit wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "greengage",
    "target": "floral",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Greengage Greengage stone-fruit perfume in tarts and grilling aligns with floral wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "guava",
    "target": "floral",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Guava Guava tropical aromatic fruit in raw and smoothie service aligns with floral wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "honeydew",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Honeydew Honeydew chilled melon refreshment and summer platters aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "horned-melon",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Horned Melon Horned Melon chilled melon refreshment and summer platters aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "jackfruit",
    "target": "floral",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Jackfruit Jackfruit tropical aromatic fruit in raw and smoothie service aligns with floral wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "juniper-berry",
    "target": "bright",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Juniper Berry Juniper Berry berry brightness in compote and dessert garnish aligns with bright wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "kiwi",
    "target": "floral",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Kiwi Kiwi tropical aromatic fruit in raw and smoothie service aligns with floral wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "kumquat",
    "target": "citrus-zest",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Kumquat Kumquat citrus acid and zest in finishing and raw use aligns with citrus-zest wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "lime",
    "target": "high-acidity",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Lime lime sharp acid in ceviche and tropical finishing per FRUIT-PAIR-001 aligns with high-acidity wine character per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "acai",
    "target": "carbonic-maceration",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Açaí Açaí berry brightness in compote and dessert garnish complements carbonic-maceration winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "apple",
    "target": "malolactic-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Apple apple pome acid in pie and raw salad per FRUIT-PAIR-001 complements malolactic-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "aprium",
    "target": "skin-contact",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Aprium Aprium stone-fruit perfume in tarts and grilling complements skin-contact winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "asian-pear",
    "target": "malolactic-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Asian Pear Asian Pear fresh pome acidity in salad and baking complements malolactic-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "avocado",
    "target": "malolactic-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Avocado avocado fat and green freshness in raw garnish per FRUIT-PAIR-001 complements malolactic-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "banana-chips",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Banana Chips Banana Chips processed-fruit concentrate in baking and slow-cook glazes complements lees-aging winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "barberry",
    "target": "carbonic-maceration",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Barberry Barberry berry brightness in compote and dessert garnish complements carbonic-maceration winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "bergamot",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Bergamot Bergamot citrus acid and zest in finishing and raw use complements cold-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "black-currant",
    "target": "carbonic-maceration",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Black Currant Black Currant berry brightness in compote and dessert garnish complements carbonic-maceration winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "blackberry",
    "target": "carbonic-maceration",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Blackberry Blackberry berry brightness in compote and dessert garnish complements carbonic-maceration winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "blood-orange",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Blood Orange Blood Orange citrus acid and zest in finishing and raw use complements cold-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "boysenberry",
    "target": "carbonic-maceration",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Boysenberry Boysenberry berry brightness in compote and dessert garnish complements carbonic-maceration winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "calamansi",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Calamansi Calamansi citrus acid and zest in finishing and raw use complements cold-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "canary-melon",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Canary Melon Canary Melon chilled melon refreshment and summer platters complements cold-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "cantaloupe",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cantaloupe Cantaloupe chilled melon refreshment and summer platters complements cold-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "casaba-melon",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Casaba Melon Casaba Melon chilled melon refreshment and summer platters complements cold-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "citron",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Citron Citron citrus acid and zest in finishing and raw use complements cold-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "cloudberry",
    "target": "carbonic-maceration",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cloudberry Cloudberry berry brightness in compote and dessert garnish complements carbonic-maceration winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "coconut",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Coconut fresh coconut tropical freshness — not coconut milk curry function per FRUIT-001 complements cold-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "coconut-milk",
    "target": "malolactic-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Coconut Milk coconut milk rich creamy curry and dessert base per FRUIT-PAIR-001 complements malolactic-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "cranberry",
    "target": "carbonic-maceration",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cranberry Cranberry berry brightness in compote and dessert garnish complements carbonic-maceration winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "crenshaw-melon",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Crenshaw Melon Crenshaw Melon chilled melon refreshment and summer platters complements cold-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "currants",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Currants Currants processed-fruit concentrate in baking and slow-cook glazes complements lees-aging winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "date",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Date date molasses sweetness in tagine and stuffing per FRUIT-PAIR-001 complements lees-aging winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "desiccated-coconut",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Desiccated Coconut desiccated coconut baking and macaroon identity per FRUIT-PAIR-001 complements barrel-aging winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "dragon-fruit",
    "target": "native-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dragon Fruit Dragon Fruit tropical aromatic fruit in raw and smoothie service complements native-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "dried-apricot",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Apricot Dried Apricot processed-fruit concentrate in baking and slow-cook glazes complements lees-aging winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "dried-blueberry",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Blueberry Dried Blueberry processed-fruit concentrate in baking and slow-cook glazes complements lees-aging winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "dried-cherry",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Cherry Dried Cherry processed-fruit concentrate in baking and slow-cook glazes complements lees-aging winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "dried-date",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Date Dried Date processed-fruit concentrate in baking and slow-cook glazes complements lees-aging winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "dried-fig",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Fig Dried Fig processed-fruit concentrate in baking and slow-cook glazes complements lees-aging winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "dried-mango",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Dried Mango Dried Mango processed-fruit concentrate in baking and slow-cook glazes complements lees-aging winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "durian",
    "target": "native-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Durian Durian tropical aromatic fruit in raw and smoothie service complements native-fermentation winemaking in curated pairing contexts per FRUIT-PAIR-001."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "elderberry",
    "target": "carbonic-maceration",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Elderberry Elderberry berry brightness in compote and dessert garnish complements carbonic-maceration winemaking in curated pairing contexts per FRUIT-PAIR-001."
  }
];
