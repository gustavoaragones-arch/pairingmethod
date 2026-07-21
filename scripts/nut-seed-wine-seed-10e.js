/**
 * FOOD-10E — Curated nut & seed wine pairing seed data.
 * Editorial pairing layer only — not derived from flavor_profile or usage_intensity.
 * NUT-PAIR-001: pair by culinary function, not botanical classification alone.
 * NUT-002: processed canonical identities retain distinct pairing profiles.
 *
 * @typedef {object} PairingSeed
 * @property {"pairs_with_style"|"also_pairs_with_style"|"pairs_with_descriptor"|"pairs_with_technique"} relationship
 * @property {string} source
 * @property {string} target
 * @property {"high"} confidence
 * @property {"approved"|"pending"} editorial_review
 * @property {string} evidence
 */

/** @type {PairingSeed[]} */
export const PAIRING_CURATED = [
  {
    "relationship": "pairs_with_style",
    "source": "almond",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Almond marzipan and almond-crust baking supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "almond",
    "target": "sherry",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Almond marzipan and almond-crust baking supports secondary wine style affinity with sherry per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "almond",
    "target": "nutty",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Almond marzipan and almond-crust baking supports descriptor alignment with nutty per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "almond",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Almond marzipan and almond-crust baking supports technique alignment with barrel-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "almond-butter",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Almond Butter nut-butter spread and modern sauce richness supports primary wine style affinity with viognier per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "almond-butter",
    "target": "chardonnay",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Almond Butter nut-butter spread and modern sauce richness supports secondary wine style affinity with chardonnay per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "almond-butter",
    "target": "creamy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Almond Butter nut-butter spread and modern sauce richness supports descriptor alignment with creamy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "almond-butter",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Almond Butter nut-butter spread and modern sauce richness supports technique alignment with barrel-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "almond-flour",
    "target": "champagne",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Almond Flour gluten-free macaron and fine pastry baking supports primary wine style affinity with champagne per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "almond-meal",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Almond Meal crumbed fish and tart-base nut meal supports primary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "almond-meal",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Almond Meal crumbed fish and tart-base nut meal supports secondary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "baru-nut",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Baru Nut toasted tree-nut crust and praline pastry contexts supports primary wine style affinity with pinot-noir per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "baru-nut",
    "target": "sherry",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Baru Nut toasted tree-nut crust and praline pastry contexts supports secondary wine style affinity with sherry per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "beechnut",
    "target": "nebbiolo",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Beechnut toasted tree-nut crust and praline pastry contexts supports primary wine style affinity with nebbiolo per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "beechnut",
    "target": "earthy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Beechnut toasted tree-nut crust and praline pastry contexts supports descriptor alignment with earthy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "bitter-almond",
    "target": "chardonnay",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Bitter Almond toasted tree-nut crust and praline pastry contexts supports primary wine style affinity with chardonnay per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "bitter-almond",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Bitter Almond toasted tree-nut crust and praline pastry contexts supports secondary wine style affinity with gewurztraminer per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "bitter-almond",
    "target": "nutty",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Bitter Almond toasted tree-nut crust and praline pastry contexts supports descriptor alignment with nutty per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "bitter-almond",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Bitter Almond toasted tree-nut crust and praline pastry contexts supports technique alignment with barrel-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "brazil-nut",
    "target": "malbec",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Brazil Nut large-format baking nut and snack garnish supports primary wine style affinity with malbec per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "brazil-nut",
    "target": "tempranillo",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Brazil Nut large-format baking nut and snack garnish supports secondary wine style affinity with tempranillo per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "brazil-nut",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Brazil Nut large-format baking nut and snack garnish supports technique alignment with lees-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "brazil-nut-meal",
    "target": "malbec",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Brazil Nut Meal gluten-free Brazil nut meal baking supports primary wine style affinity with malbec per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "breadfruit-seed",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Breadfruit Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "breadfruit-seed",
    "target": "moscato",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Breadfruit Seed seed garnish and lightly prepared bowl applications supports secondary wine style affinity with moscato per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "breadnut-seed",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Breadnut Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "breadnut-seed",
    "target": "pinot-grigio",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Breadnut Seed seed garnish and lightly prepared bowl applications supports secondary wine style affinity with pinot-grigio per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "breadnut-seed",
    "target": "neutral",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Breadnut Seed seed garnish and lightly prepared bowl applications supports descriptor alignment with neutral per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "candlenut",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Candlenut toasted tree-nut crust and praline pastry contexts supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "candlenut",
    "target": "earthy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Candlenut toasted tree-nut crust and praline pastry contexts supports descriptor alignment with earthy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "cashew",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cashew curry richness and cashew-cream sauces supports primary wine style affinity with viognier per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "cashew",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cashew curry richness and cashew-cream sauces supports secondary wine style affinity with gewurztraminer per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "cashew",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cashew curry richness and cashew-cream sauces supports technique alignment with barrel-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "cashew-butter",
    "target": "chardonnay",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cashew Butter vegan nut-butter sauce bases supports primary wine style affinity with chardonnay per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "cashew-butter",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cashew Butter vegan nut-butter sauce bases supports secondary wine style affinity with viognier per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "cashew-butter",
    "target": "malolactic-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cashew Butter vegan nut-butter sauce bases supports technique alignment with malolactic-fermentation per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "cashew-flour",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cashew Flour neutral gluten-free nut-flour baking supports primary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "chestnut",
    "target": "nebbiolo",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Chestnut roasting and autumn stuffing applications supports primary wine style affinity with nebbiolo per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "chestnut",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Chestnut roasting and autumn stuffing applications supports secondary wine style affinity with pinot-noir per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "chestnut",
    "target": "earthy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Chestnut roasting and autumn stuffing applications supports descriptor alignment with earthy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "chestnut-flour",
    "target": "nebbiolo",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Chestnut Flour Italian castagnaccio and mountain dessert baking supports primary wine style affinity with nebbiolo per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "chestnut-flour",
    "target": "sangiovese",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Chestnut Flour Italian castagnaccio and mountain dessert baking supports secondary wine style affinity with sangiovese per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "chestnut-flour",
    "target": "earthy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Chestnut Flour Italian castagnaccio and mountain dessert baking supports descriptor alignment with earthy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "chia-seed",
    "target": "moscato",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Chia Seed fresh pudding and lightly prepared seed bowl applications supports primary wine style affinity with moscato per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "chia-seed-meal",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Chia Seed Meal modern seed-meal pudding and baking supports primary wine style affinity with riesling per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "chia-seed-meal",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Chia Seed Meal modern seed-meal pudding and baking supports secondary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "chia-seed-meal",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Chia Seed Meal modern seed-meal pudding and baking supports technique alignment with lees-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "cucumber-seed",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cucumber Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with riesling per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "cucumber-seed",
    "target": "moscato",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cucumber Seed seed garnish and lightly prepared bowl applications supports secondary wine style affinity with moscato per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "cucumber-seed",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Cucumber Seed seed garnish and lightly prepared bowl applications supports technique alignment with cold-fermentation per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "desert-date-seed",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Desert Date Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with sauvignon-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "desert-date-seed",
    "target": "earthy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Desert Date Seed seed garnish and lightly prepared bowl applications supports descriptor alignment with earthy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "egusi-seed",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Egusi Seed West African egusi stew seed-spice depth supports primary wine style affinity with gewurztraminer per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "egusi-seed",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Egusi Seed West African egusi stew seed-spice depth supports secondary wine style affinity with viognier per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "egusi-seed",
    "target": "spicy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Egusi Seed West African egusi stew seed-spice depth supports descriptor alignment with spicy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "flaxseed",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Flaxseed baking binder and health bowl seed applications supports primary wine style affinity with riesling per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "flaxseed",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Flaxseed baking binder and health bowl seed applications supports secondary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "flaxseed-butter",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Flaxseed Butter health seed-butter toast applications supports primary wine style affinity with sauvignon-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "flaxseed-meal",
    "target": "pinot-grigio",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Flaxseed Meal gluten-free flax meal binding in baking supports primary wine style affinity with pinot-grigio per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "flaxseed-meal",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Flaxseed Meal gluten-free flax meal binding in baking supports secondary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "flaxseed-meal",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Flaxseed Meal gluten-free flax meal binding in baking supports technique alignment with lees-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "ginkgo-nut",
    "target": "nebbiolo",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Ginkgo Nut toasted tree-nut crust and praline pastry contexts supports primary wine style affinity with nebbiolo per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "ginkgo-nut",
    "target": "sherry",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Ginkgo Nut toasted tree-nut crust and praline pastry contexts supports secondary wine style affinity with sherry per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "ginkgo-nut",
    "target": "rich",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Ginkgo Nut toasted tree-nut crust and praline pastry contexts supports descriptor alignment with rich per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "ginkgo-nut",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Ginkgo Nut toasted tree-nut crust and praline pastry contexts supports technique alignment with lees-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "hazelnut",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hazelnut praline and chocolate-hazelnut pastry supports primary wine style affinity with pinot-noir per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "hazelnut",
    "target": "nutty",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hazelnut praline and chocolate-hazelnut pastry supports descriptor alignment with nutty per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "hazelnut-butter",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hazelnut Butter European nut-butter spread service supports primary wine style affinity with viognier per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "hazelnut-butter",
    "target": "chardonnay",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hazelnut Butter European nut-butter spread service supports secondary wine style affinity with chardonnay per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "hazelnut-flour",
    "target": "madeira",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hazelnut Flour dacquoise and European nut-flour dessert baking supports primary wine style affinity with madeira per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "hazelnut-flour",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hazelnut Flour dacquoise and European nut-flour dessert baking supports secondary wine style affinity with port per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "hazelnut-meal",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hazelnut Meal European torte and nut-meal bases supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "hemp-seed",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hemp Seed salad and protein bowl seed topping supports primary wine style affinity with sauvignon-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "hemp-seed",
    "target": "pinot-grigio",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hemp Seed salad and protein bowl seed topping supports secondary wine style affinity with pinot-grigio per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "hemp-seed",
    "target": "herbal",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hemp Seed salad and protein bowl seed topping supports descriptor alignment with herbal per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "hemp-seed",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hemp Seed salad and protein bowl seed topping supports technique alignment with cold-fermentation per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "hemp-seed-butter",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hemp Seed Butter protein seed-butter spread boards supports primary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "hemp-seed-butter",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hemp Seed Butter protein seed-butter spread boards supports secondary wine style affinity with sauvignon-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "hemp-seed-butter",
    "target": "herbal",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hemp Seed Butter protein seed-butter spread boards supports descriptor alignment with herbal per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "hemp-seed-butter",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hemp Seed Butter protein seed-butter spread boards supports technique alignment with barrel-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "hemp-seed-flour",
    "target": "pinot-grigio",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hemp Seed Flour protein seed-flour baking supports primary wine style affinity with pinot-grigio per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "hemp-seed-meal",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hemp Seed Meal protein seed-meal modern baking supports primary wine style affinity with riesling per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "hemp-seed-meal",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hemp Seed Meal protein seed-meal modern baking supports secondary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "hickory-nut",
    "target": "chardonnay",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hickory Nut toasted tree-nut crust and praline pastry contexts supports primary wine style affinity with chardonnay per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "hickory-nut",
    "target": "sherry",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Hickory Nut toasted tree-nut crust and praline pastry contexts supports secondary wine style affinity with sherry per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "jackfruit-seed",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Jackfruit Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with riesling per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "jackfruit-seed",
    "target": "earthy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Jackfruit Seed seed garnish and lightly prepared bowl applications supports descriptor alignment with earthy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "kola-nut",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Kola Nut toasted tree-nut crust and praline pastry contexts supports primary wine style affinity with pinot-noir per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "kola-nut",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Kola Nut toasted tree-nut crust and praline pastry contexts supports secondary wine style affinity with gewurztraminer per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "kola-nut",
    "target": "nutty",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Kola Nut toasted tree-nut crust and praline pastry contexts supports descriptor alignment with nutty per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "kola-nut",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Kola Nut toasted tree-nut crust and praline pastry contexts supports technique alignment with barrel-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "leek-seed",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Leek Seed seed-spice seasoning and pickling contexts supports primary wine style affinity with riesling per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "leek-seed",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Leek Seed seed-spice seasoning and pickling contexts supports secondary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "leek-seed",
    "target": "carbonic-maceration",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Leek Seed seed-spice seasoning and pickling contexts supports technique alignment with carbonic-maceration per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "lotus-seed",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Lotus Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "macadamia",
    "target": "chardonnay",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Macadamia buttery tropical nut cookies and crusted fish supports primary wine style affinity with chardonnay per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "macadamia",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Macadamia buttery tropical nut cookies and crusted fish supports secondary wine style affinity with viognier per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "macadamia-butter",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Macadamia Butter tropical nut-butter baking spreads supports primary wine style affinity with prosecco per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "macadamia-butter",
    "target": "cava",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Macadamia Butter tropical nut-butter baking spreads supports secondary wine style affinity with cava per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "macadamia-butter",
    "target": "creamy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Macadamia Butter tropical nut-butter baking spreads supports descriptor alignment with creamy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "mahlab",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mahlab seed-spice seasoning and pickling contexts supports primary wine style affinity with viognier per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "mahlab",
    "target": "nutty",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mahlab seed-spice seasoning and pickling contexts supports descriptor alignment with nutty per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "melon-seed",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Melon Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "melon-seed",
    "target": "pinot-grigio",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Melon Seed seed garnish and lightly prepared bowl applications supports secondary wine style affinity with pinot-grigio per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "melon-seed",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Melon Seed seed garnish and lightly prepared bowl applications supports technique alignment with cold-fermentation per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "mongongo-nut",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mongongo Nut toasted tree-nut crust and praline pastry contexts supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "mongongo-nut",
    "target": "sherry",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mongongo Nut toasted tree-nut crust and praline pastry contexts supports secondary wine style affinity with sherry per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "mongongo-nut",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Mongongo Nut toasted tree-nut crust and praline pastry contexts supports technique alignment with lees-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "niger-seed",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Niger Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with sauvignon-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "niger-seed-paste",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Niger Seed Paste processed seed paste, butter, and flour culinary functions supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "niger-seed-paste",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Niger Seed Paste processed seed paste, butter, and flour culinary functions supports secondary wine style affinity with prosecco per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "niger-seed-paste",
    "target": "nutty",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Niger Seed Paste processed seed paste, butter, and flour culinary functions supports descriptor alignment with nutty per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "okra-seed",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Okra Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "okra-seed",
    "target": "pinot-grigio",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Okra Seed seed garnish and lightly prepared bowl applications supports secondary wine style affinity with pinot-grigio per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "okra-seed",
    "target": "neutral",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Okra Seed seed garnish and lightly prepared bowl applications supports descriptor alignment with neutral per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "onion-seed",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Onion Seed seed-spice seasoning and pickling contexts supports primary wine style affinity with viognier per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "palm-kernel-seed",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Palm Kernel Seed seed-spice seasoning and pickling contexts supports primary wine style affinity with gewurztraminer per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "palm-kernel-seed",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Palm Kernel Seed seed-spice seasoning and pickling contexts supports secondary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "palm-kernel-seed",
    "target": "carbonic-maceration",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Palm Kernel Seed seed-spice seasoning and pickling contexts supports technique alignment with carbonic-maceration per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "palmyra-seed",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Palmyra Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "palmyra-seed",
    "target": "moscato",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Palmyra Seed seed garnish and lightly prepared bowl applications supports secondary wine style affinity with moscato per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "palmyra-seed",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Palmyra Seed seed garnish and lightly prepared bowl applications supports technique alignment with cold-fermentation per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "paradise-nut",
    "target": "chardonnay",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Paradise Nut toasted tree-nut crust and praline pastry contexts supports primary wine style affinity with chardonnay per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "paradise-nut",
    "target": "earthy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Paradise Nut toasted tree-nut crust and praline pastry contexts supports descriptor alignment with earthy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "peanut",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Peanut satay and peanut-sauce savory depth supports primary wine style affinity with gewurztraminer per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "peanut",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Peanut satay and peanut-sauce savory depth supports secondary wine style affinity with riesling per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "peanut",
    "target": "spicy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Peanut satay and peanut-sauce savory depth supports descriptor alignment with spicy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "peanut-butter",
    "target": "zinfandel",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Peanut Butter rich creamy spread and jammy sandwich sauces supports primary wine style affinity with zinfandel per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "peanut-butter",
    "target": "merlot",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Peanut Butter rich creamy spread and jammy sandwich sauces supports secondary wine style affinity with merlot per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pecan",
    "target": "zinfandel",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pecan Southern pie and praline baking supports primary wine style affinity with zinfandel per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pecan-butter",
    "target": "merlot",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pecan Butter Southern nut-butter glaze and baking supports primary wine style affinity with merlot per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "pecan-butter",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pecan Butter Southern nut-butter glaze and baking supports secondary wine style affinity with port per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "pecan-butter",
    "target": "malolactic-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pecan Butter Southern nut-butter glaze and baking supports technique alignment with malolactic-fermentation per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pecan-meal",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pecan Meal Southern nut-meal pie crust applications supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "pecan-meal",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pecan Meal Southern nut-meal pie crust applications supports secondary wine style affinity with viognier per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "pecan-meal",
    "target": "nutty",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pecan Meal Southern nut-meal pie crust applications supports descriptor alignment with nutty per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "pecan-meal",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pecan Meal Southern nut-meal pie crust applications supports technique alignment with barrel-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "perilla-seed",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Perilla Seed seed-spice seasoning and pickling contexts supports primary wine style affinity with viognier per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "perilla-seed",
    "target": "spicy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Perilla Seed seed-spice seasoning and pickling contexts supports descriptor alignment with spicy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pili-nut",
    "target": "nebbiolo",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pili Nut toasted tree-nut crust and praline pastry contexts supports primary wine style affinity with nebbiolo per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "pili-nut",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pili Nut toasted tree-nut crust and praline pastry contexts supports secondary wine style affinity with gewurztraminer per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pine-nut",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pine Nut pesto and premium Mediterranean nut garnish supports primary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "pine-nut",
    "target": "pinot-grigio",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pine Nut pesto and premium Mediterranean nut garnish supports secondary wine style affinity with pinot-grigio per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pine-nut-paste",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pine Nut Paste Ligurian pesto paste and nut confection supports primary wine style affinity with prosecco per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pistachio",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pistachio Middle Eastern sweets and green-nut garnish supports primary wine style affinity with gewurztraminer per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "pistachio",
    "target": "dry-rose",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pistachio Middle Eastern sweets and green-nut garnish supports secondary wine style affinity with dry-rose per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "pistachio",
    "target": "nutty",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pistachio Middle Eastern sweets and green-nut garnish supports descriptor alignment with nutty per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "pistachio",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pistachio Middle Eastern sweets and green-nut garnish supports technique alignment with barrel-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pistachio-paste",
    "target": "moscato",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pistachio Paste Sicilian pastry and gelato nut paste supports primary wine style affinity with moscato per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "pistachio-paste",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pistachio Paste Sicilian pastry and gelato nut paste supports secondary wine style affinity with prosecco per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "pistachio-paste",
    "target": "rich",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pistachio Paste Sicilian pastry and gelato nut paste supports descriptor alignment with rich per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "pistachio-paste",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pistachio Paste Sicilian pastry and gelato nut paste supports technique alignment with barrel-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pomegranate-seed",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pomegranate Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "poppy-seed",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Poppy Seed Central European poppy seed pastry baking supports primary wine style affinity with riesling per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "poppy-seed",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Poppy Seed Central European poppy seed pastry baking supports secondary wine style affinity with gewurztraminer per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "psyllium-seed",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Psyllium Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with sauvignon-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "psyllium-seed",
    "target": "pinot-grigio",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Psyllium Seed seed garnish and lightly prepared bowl applications supports secondary wine style affinity with pinot-grigio per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pumpkin-seed",
    "target": "tempranillo",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pumpkin Seed roasted garnish and mole seed applications supports primary wine style affinity with tempranillo per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "pumpkin-seed",
    "target": "earthy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pumpkin Seed roasted garnish and mole seed applications supports descriptor alignment with earthy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pumpkin-seed-butter",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pumpkin Seed Butter autumn seed-butter spread applications supports primary wine style affinity with pinot-noir per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "pumpkin-seed-butter",
    "target": "syrah-shiraz",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pumpkin Seed Butter autumn seed-butter spread applications supports secondary wine style affinity with syrah-shiraz per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "pumpkin-seed-butter",
    "target": "rich",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pumpkin Seed Butter autumn seed-butter spread applications supports descriptor alignment with rich per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "pumpkin-seed-butter",
    "target": "lees-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pumpkin Seed Butter autumn seed-butter spread applications supports technique alignment with lees-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pumpkin-seed-flour",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pumpkin Seed Flour autumn gluten-free seed-flour bread supports primary wine style affinity with pinot-noir per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "pumpkin-seed-flour",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pumpkin Seed Flour autumn gluten-free seed-flour bread supports secondary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "pumpkin-seed-flour",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pumpkin Seed Flour autumn gluten-free seed-flour bread supports technique alignment with barrel-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "pumpkin-seed-meal",
    "target": "tempranillo",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Pumpkin Seed Meal Mexican mole seed-meal seasoning supports primary wine style affinity with tempranillo per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "radish-seed",
    "target": "gewurztraminer",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Radish Seed seed-spice seasoning and pickling contexts supports primary wine style affinity with gewurztraminer per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "radish-seed",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Radish Seed seed-spice seasoning and pickling contexts supports secondary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "saba-nut",
    "target": "chardonnay",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Saba Nut toasted tree-nut crust and praline pastry contexts supports primary wine style affinity with chardonnay per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "saba-nut",
    "target": "sherry",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Saba Nut toasted tree-nut crust and praline pastry contexts supports secondary wine style affinity with sherry per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "saba-nut",
    "target": "rich",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Saba Nut toasted tree-nut crust and praline pastry contexts supports descriptor alignment with rich per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sacha-inchi-butter",
    "target": "viognier",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sacha Inchi Butter processed seed paste, butter, and flour culinary functions supports primary wine style affinity with viognier per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "sacha-inchi-butter",
    "target": "creamy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sacha Inchi Butter processed seed paste, butter, and flour culinary functions supports descriptor alignment with creamy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sacha-inchi-seed",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sacha Inchi Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with sauvignon-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "sacha-inchi-seed",
    "target": "pinot-grigio",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sacha Inchi Seed seed garnish and lightly prepared bowl applications supports secondary wine style affinity with pinot-grigio per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "sacha-inchi-seed",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sacha Inchi Seed seed garnish and lightly prepared bowl applications supports technique alignment with cold-fermentation per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "safflower-meal",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Safflower Meal seed garnish and lightly prepared bowl applications supports primary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "safflower-meal",
    "target": "moscato",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Safflower Meal seed garnish and lightly prepared bowl applications supports secondary wine style affinity with moscato per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "safflower-meal",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Safflower Meal seed garnish and lightly prepared bowl applications supports technique alignment with cold-fermentation per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "safflower-seed",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Safflower Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sesame",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sesame toasted seed garnish and Middle Eastern baking supports primary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "sesame",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sesame toasted seed garnish and Middle Eastern baking supports secondary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "sesame",
    "target": "nutty",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sesame toasted seed garnish and Middle Eastern baking supports descriptor alignment with nutty per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sesame-flour",
    "target": "prosecco",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sesame Flour Middle Eastern seed-flour flatbread baking supports primary wine style affinity with prosecco per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "sesame-flour",
    "target": "cava",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sesame Flour Middle Eastern seed-flour flatbread baking supports secondary wine style affinity with cava per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "sesame-flour",
    "target": "toasty",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sesame Flour Middle Eastern seed-flour flatbread baking supports descriptor alignment with toasty per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sesame-paste",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sesame Paste Chinese cold-noodle sesame paste applications supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "squash-seed",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Squash Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "squash-seed",
    "target": "pinot-grigio",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Squash Seed seed garnish and lightly prepared bowl applications supports secondary wine style affinity with pinot-grigio per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "squash-seed",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Squash Seed seed garnish and lightly prepared bowl applications supports technique alignment with cold-fermentation per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sunflower-seed",
    "target": "sauvignon-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sunflower Seed salad and bread seed topping applications supports primary wine style affinity with sauvignon-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "sunflower-seed",
    "target": "pinot-grigio",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sunflower Seed salad and bread seed topping applications supports secondary wine style affinity with pinot-grigio per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "sunflower-seed",
    "target": "cold-fermentation",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sunflower Seed salad and bread seed topping applications supports technique alignment with cold-fermentation per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sunflower-seed-butter",
    "target": "chardonnay",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sunflower Seed Butter allergy-friendly seed-butter sandwich spreads supports primary wine style affinity with chardonnay per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "sunflower-seed-butter",
    "target": "creamy",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sunflower Seed Butter allergy-friendly seed-butter sandwich spreads supports descriptor alignment with creamy per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sunflower-seed-flour",
    "target": "pinot-grigio",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sunflower Seed Flour gluten-free seed bread baking supports primary wine style affinity with pinot-grigio per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "sunflower-seed-flour",
    "target": "albarino",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sunflower Seed Flour gluten-free seed bread baking supports secondary wine style affinity with albarino per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "sunflower-seed-flour",
    "target": "neutral",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sunflower Seed Flour gluten-free seed bread baking supports descriptor alignment with neutral per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "sunflower-seed-paste",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sunflower Seed Paste Eastern European seed paste dip bases supports primary wine style affinity with riesling per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "sunflower-seed-paste",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Sunflower Seed Paste Eastern European seed paste dip bases supports secondary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "tahini",
    "target": "sherry",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Tahini savory sesame paste in hummus and Levantine sauces supports primary wine style affinity with sherry per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "walnut",
    "target": "pinot-noir",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Walnut salad walnut crunch and autumn baking supports primary wine style affinity with pinot-noir per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "walnut",
    "target": "port",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Walnut salad walnut crunch and autumn baking supports secondary wine style affinity with port per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "walnut",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Walnut salad walnut crunch and autumn baking supports technique alignment with barrel-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "walnut-butter",
    "target": "merlot",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Walnut Butter toast spread and health-bowl nut butter supports primary wine style affinity with merlot per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "walnut-butter",
    "target": "zinfandel",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Walnut Butter toast spread and health-bowl nut butter supports secondary wine style affinity with zinfandel per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "walnut-butter",
    "target": "rich",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Walnut Butter toast spread and health-bowl nut butter supports descriptor alignment with rich per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_technique",
    "source": "walnut-butter",
    "target": "barrel-aging",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Walnut Butter toast spread and health-bowl nut butter supports technique alignment with barrel-aging per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "walnut-meal",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Walnut Meal nut-meal torte and rustic bread bases supports primary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_descriptor",
    "source": "walnut-meal",
    "target": "nutty",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Walnut Meal nut-meal torte and rustic bread bases supports descriptor alignment with nutty per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "watermelon-seed",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Watermelon Seed seed garnish and lightly prepared bowl applications supports primary wine style affinity with riesling per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "watermelon-seed",
    "target": "moscato",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Watermelon Seed seed garnish and lightly prepared bowl applications supports secondary wine style affinity with moscato per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "pairs_with_style",
    "source": "wattleseed",
    "target": "riesling",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Wattleseed seed-spice seasoning and pickling contexts supports primary wine style affinity with riesling per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  },
  {
    "relationship": "also_pairs_with_style",
    "source": "wattleseed",
    "target": "chenin-blanc",
    "confidence": "high",
    "editorial_review": "approved",
    "evidence": "Wattleseed seed-spice seasoning and pickling contexts supports secondary wine style affinity with chenin-blanc per NUT-PAIR-001 culinary function pairing — not botanical classification alone; NUT-002 preserves distinct processed pairing identity."
  }
];
