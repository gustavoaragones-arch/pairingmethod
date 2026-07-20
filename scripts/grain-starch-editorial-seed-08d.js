/**
 * FOOD-08D — Curated editorial relationship seed data.
 * Tier A: similar_to, substitutes_for
 * Tier B: commonly_served_with (intra-domain)
 * Tier C: commonly_served_with (cross-domain forward references)
 *
 * PROC-001 Editorial Rule: whole grain vs PROC-separated processed form
 * (wheat/wheat-flour, rice/rice-flour, corn/cornmeal/cornstarch, oats/oat-flour)
 * must not appear as similar_to or substitutes_for in Tier A.
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
  "food.vegetable.alliums.garlic",
  "food.vegetable.alliums.onion",
  "food.vegetable.nightshades.tomato",
  "food.protein.poultry.chicken-breast",
  "food.protein.beef.ribeye",
  "food.protein.fin-fish.salmon-fillet",
  "food.herb.fresh-herbs.basil",
  "food.herb.dried-herbs.rosemary",
  "food.herb.whole-spices.black-pepper",
  "food.herb.whole-spices.cinnamon",
  "food.fungi.wild-mushrooms.porcini",
  "food.fungi.cultivated-mushrooms.shiitake",
  "food.cheese.hard.parmigiano-reggiano",
  "food.cheese.hard.cheddar",
  "food.cheese.brined.feta"
]);

/** @type {EditorialSeed[]} */
export const EDITORIAL_CURATED = [
  {
    "relationship": "similar_to",
    "source": "bulgur",
    "target": "pearl-barley",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Bulgur and pearl barley share nutty cracked-grain texture in pilafs and tabbouleh — distinct from whole wheat berries under PROC-001."
  },
  {
    "relationship": "similar_to",
    "source": "pearl-barley",
    "target": "bulgur",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Pearl barley and bulgur occupy similar simmered-grain roles in soups and salads without wheat-flour interchange."
  },
  {
    "relationship": "similar_to",
    "source": "cornmeal",
    "target": "polenta-meal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cornmeal and polenta meal are coarsely milled maize products with overlapping polenta and cornbread applications."
  },
  {
    "relationship": "similar_to",
    "source": "polenta-meal",
    "target": "cornmeal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Polenta meal and cornmeal share medium-grind maize character for porridge, grill cakes, and baked corn preparations."
  },
  {
    "relationship": "similar_to",
    "source": "arrowroot-starch",
    "target": "tapioca-starch",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Arrowroot starch and tapioca starch are neutral root starches used for clear sauces and fruit pie thickening."
  },
  {
    "relationship": "similar_to",
    "source": "tapioca-starch",
    "target": "arrowroot-starch",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Tapioca starch and arrowroot starch share glossy, flavor-neutral thickening in Asian and European pastry."
  },
  {
    "relationship": "similar_to",
    "source": "quinoa",
    "target": "amaranth",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Quinoa and amaranth are pseudocereal seeds with nutty whole-grain side-dish and salad roles."
  },
  {
    "relationship": "similar_to",
    "source": "amaranth",
    "target": "quinoa",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Amaranth and quinoa share protein-rich pseudocereal character in bowls, porridge, and gluten-free baking."
  },
  {
    "relationship": "similar_to",
    "source": "millet",
    "target": "sorghum",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Millet and sorghum are small-seeded gluten-free whole grains with mild sweetness in African and Indian cookery."
  },
  {
    "relationship": "similar_to",
    "source": "sorghum",
    "target": "millet",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Sorghum and millet overlap in porridge, flatbread, and fermented grain beverage applications."
  },
  {
    "relationship": "similar_to",
    "source": "farro",
    "target": "spelt",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Farro and spelt are ancient wheat whole grains with chewy texture in Italian farro salad and German spelt berry dishes — not flour interchange."
  },
  {
    "relationship": "similar_to",
    "source": "spelt",
    "target": "farro",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Spelt and farro share nutty ancient-wheat berry character in risotto-style and pilaf preparations."
  },
  {
    "relationship": "similar_to",
    "source": "einkorn",
    "target": "farro",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Einkorn and farro are heirloom wheat berries with distinct but related nutty whole-grain service."
  },
  {
    "relationship": "similar_to",
    "source": "freekeh",
    "target": "bulgur",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Freekeh and bulgur are parched or parboiled cracked wheat products with smoky and nutty pilaf roles — processed forms, not whole wheat berries."
  },
  {
    "relationship": "similar_to",
    "source": "couscous",
    "target": "semolina",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Couscous is granulated semolina wheat with overlapping North African steam-grain and pasta-adjacent applications."
  },
  {
    "relationship": "similar_to",
    "source": "grits",
    "target": "polenta-meal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Grits and polenta meal are coarse maize meals used in Southern porridge and Italian polenta service."
  },
  {
    "relationship": "similar_to",
    "source": "masa-harina",
    "target": "cornmeal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Masa harina and cornmeal are nixtamalized and plain maize flours with related tortilla and cornbread lineage — distinct from whole dried corn."
  },
  {
    "relationship": "similar_to",
    "source": "wild-rice",
    "target": "rice",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Wild rice and cultivated rice share steamed-grain and pilaf roles despite different botanical genera — not rice-flour interchange."
  },
  {
    "relationship": "similar_to",
    "source": "fonio",
    "target": "millet",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Fonio and millet are tiny African gluten-free grains with quick-cooking porridge and side-dish character."
  },
  {
    "relationship": "similar_to",
    "source": "buckwheat",
    "target": "quinoa",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Buckwheat and quinoa are gluten-free seed-grains with nutty salad and side-dish applications — distinct from buckwheat flour."
  },
  {
    "relationship": "similar_to",
    "source": "potato-starch",
    "target": "tapioca-starch",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Potato starch and tapioca starch are neutral tuber and root starches for clear gravies and gluten-free baking binders."
  },
  {
    "relationship": "similar_to",
    "source": "sago-starch",
    "target": "tapioca-starch",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Sago starch and tapioca starch share pearl and pudding thickening in Southeast Asian and European dessert starch roles."
  },
  {
    "relationship": "similar_to",
    "source": "kudzu-starch",
    "target": "arrowroot-starch",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Kudzu starch and arrowroot starch are delicate root starches for Japanese kuzu-an and clear Western sauces."
  },
  {
    "relationship": "similar_to",
    "source": "mung-bean-starch",
    "target": "pea-starch",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Mung bean starch and pea starch are legume-derived clear starches in Asian noodles and gluten-free binder applications."
  },
  {
    "relationship": "similar_to",
    "source": "finger-millet",
    "target": "pearl-millet",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Finger millet and pearl millet are African millet species with porridge and flatbread overlap."
  },
  {
    "relationship": "substitutes_for",
    "source": "cornmeal",
    "target": "polenta-meal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Cornmeal substitutes for polenta meal in baked cornbread and pan-fried cakes when grind is matched."
  },
  {
    "relationship": "substitutes_for",
    "source": "polenta-meal",
    "target": "cornmeal",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Polenta meal substitutes for cornmeal in creamy porridge when medium-coarse texture is acceptable."
  },
  {
    "relationship": "substitutes_for",
    "source": "arrowroot-starch",
    "target": "tapioca-starch",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Arrowroot starch substitutes for tapioca starch in fruit fillings requiring clear, glossy set without clouding."
  },
  {
    "relationship": "substitutes_for",
    "source": "tapioca-starch",
    "target": "arrowroot-starch",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Tapioca starch substitutes for arrowroot in Asian stir-fry velveting and pie thickening at roughly equal weight."
  },
  {
    "relationship": "substitutes_for",
    "source": "potato-starch",
    "target": "cornstarch",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Potato starch substitutes for cornstarch in clear sauces and gluten-free coatings where a neutral finish is needed."
  },
  {
    "relationship": "substitutes_for",
    "source": "semolina",
    "target": "farina",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Semolina substitutes for farina in pasta dough and porridge when coarser wheat endosperm texture is acceptable."
  },
  {
    "relationship": "substitutes_for",
    "source": "farina",
    "target": "semolina",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Farina substitutes for semolina in fine porridge and dusting when softer wheat granulation is preferred."
  },
  {
    "relationship": "substitutes_for",
    "source": "quinoa",
    "target": "rice",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Quinoa substitutes for rice as a gluten-free whole-grain side in bowls and pilafs — distinct from rice-flour interchange."
  },
  {
    "relationship": "substitutes_for",
    "source": "wild-rice",
    "target": "rice",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Wild rice substitutes for white rice in pilafs and stuffings when nutty chew and longer cook time are acceptable."
  },
  {
    "relationship": "substitutes_for",
    "source": "bulgur",
    "target": "couscous",
    "confidence": "high",
    "editorial_tier": "A",
    "editorial_review": "approved",
    "evidence": "Bulgur substitutes for couscous in tabbouleh and quick-cook grain salads when pre-soaked texture is matched."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "quinoa",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rice and quinoa combine in mixed-grain bowls and health-forward pilaf service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "semolina",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Wheat flour and semolina combine in fresh pasta, pizza dough, and durum-wheat baking blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornmeal",
    "target": "wheat-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cornmeal and wheat flour combine in cornbread, hush puppies, and dual-flour Southern baking."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tapioca-starch",
    "target": "rice-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Tapioca starch and rice flour combine in gluten-free Asian noodles, mochi-adjacent doughs, and tender cake blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "oats",
    "target": "barley",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Oats and barley combine in Scottish brose, multigrain porridge, and hearty soup grain blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "wild-rice",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rice and wild rice blend in Thanksgiving stuffing, Minnesota wild rice soup, and composed pilafs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "barley",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rice and barley share risotto-style and soup grain bases in Italian orzotto and Middle Eastern harissa bowls."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "millet",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rice and millet combine in Indian khichdi-adjacent and African mixed-grain porridge service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "bulgur",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rice and bulgur blend in Lebanese mujadara-adjacent and Turkish pilaf preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "freekeh",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rice and freekeh combine in Levantine pilafs where smoky cracked wheat layers nutty long-grain rice."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "jobs-tears",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rice and Job's tears combine in East Asian herbal porridge and Taiwanese mixed-grain drinks."
  },
  {
    "relationship": "commonly_served_with",
    "source": "quinoa",
    "target": "amaranth",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Quinoa and amaranth combine in supergrain bowls and gluten-free breakfast porridge blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "quinoa",
    "target": "millet",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Quinoa and millet share gluten-free side-dish and salad grain layers in health-forward cookery."
  },
  {
    "relationship": "commonly_served_with",
    "source": "quinoa",
    "target": "buckwheat",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Quinoa and buckwheat combine in multigrain salads and Eastern European–New World fusion bowls."
  },
  {
    "relationship": "commonly_served_with",
    "source": "barley",
    "target": "pearl-barley",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Barley and pearl barley appear together in Scotch broth and multigrain soup blends when texture contrast is desired."
  },
  {
    "relationship": "commonly_served_with",
    "source": "barley",
    "target": "bulgur",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Barley and bulgur combine in Middle Eastern grain salads and minestrone-style soup bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "barley",
    "target": "rye",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Barley and rye berries combine in Nordic and Eastern European dense bread and porridge traditions."
  },
  {
    "relationship": "commonly_served_with",
    "source": "oats",
    "target": "chia",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Oats and chia combine in overnight oat jars and multiseed breakfast porridge blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "oats",
    "target": "millet",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Oats and millet share warm breakfast porridge and multigrain granola formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "whole-wheat-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Wheat flour and whole-wheat flour blend in sandwich loaves and pasta where partial bran retention is desired."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "rye-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Wheat flour and rye flour combine in deli rye, pumpernickel, and European mixed-flour bread."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "spelt-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Wheat flour and spelt flour blend in artisan loaves and pastry with nutty ancient-grain character."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "barley-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Wheat flour and barley flour combine in Finnish pulla and Nordic mixed-flour baking."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "matzo-meal",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Wheat flour and matzo meal combine in matzo ball dumplings and Passover cake formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "semolina",
    "target": "farina",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Semolina and farina combine in dual-grind pasta flour blends and hot wheat cereal service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "semolina",
    "target": "couscous",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Semolina and couscous share durum-wheat lineage in North African steam-grain and pasta production."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornmeal",
    "target": "grits",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cornmeal and grits combine in Southern layered cornbread and dual-grind maize porridge service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornmeal",
    "target": "polenta-meal",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cornmeal and polenta meal layer in Italian-American polenta fries and baked corn casseroles."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornmeal",
    "target": "masa-harina",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cornmeal and masa harina combine in tamale cornbread hybrids and Tex-Mex dual-maize baking."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grits",
    "target": "hominy",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Grits and hominy share nixtamalized and plain maize lineage in Southern breakfast and pozole-adjacent service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "farro",
    "target": "spelt",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Farro and spelt berries combine in ancient-grain salad mixes and Italian–German multigrain bowls."
  },
  {
    "relationship": "commonly_served_with",
    "source": "farro",
    "target": "einkorn",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Farro and einkorn combine in heritage wheat berry salads and long-soak risotto-style preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "farro",
    "target": "khorasan-wheat",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Farro and Khorasan wheat combine in artisan multigrain pilafs and ancient-wheat tasting menus."
  },
  {
    "relationship": "commonly_served_with",
    "source": "spelt",
    "target": "khorasan-wheat",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Spelt and Khorasan wheat share nutty ancient-wheat berry character in health-food grain blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "millet",
    "target": "sorghum",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Millet and sorghum combine in African uji porridge and gluten-free multigrain flatbread blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "millet",
    "target": "fonio",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Millet and fonio combine in West African mixed-grain couscous and quick-cook porridge service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "finger-millet",
    "target": "pearl-millet",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Finger millet and pearl millet combine in Indian ragi–bajra mixed flatbread and porridge blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "barnyard-millet",
    "target": "foxtail-millet",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Barnyard millet and foxtail millet combine in South Indian samai–thinai mixed millet rice service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "proso-millet",
    "target": "millet",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Proso millet and common millet combine in Central European and Indian multigrain porridge formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "teff",
    "target": "quinoa",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Teff and quinoa combine in Ethiopian–New World fusion injera-adjacent and power bowl grain blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "buckwheat",
    "target": "kaniwa",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Buckwheat and kaniwa combine in Andean–Slavic gluten-free porridge and crêpe flour blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "triticale",
    "target": "rye",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Triticale and rye berries combine in Scandinavian dense bread and mixed whole-grain porridge."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornstarch",
    "target": "potato-starch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cornstarch and potato starch combine in gluten-free flour blends and dual-starch sauce formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornstarch",
    "target": "tapioca-starch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cornstarch and tapioca starch combine in Asian stir-fry velveting and pie filling starch blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornstarch",
    "target": "arrowroot-starch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Cornstarch and arrowroot starch combine in clear fruit pie glazes and neutral sauce thickening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "potato-starch",
    "target": "tapioca-starch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Potato starch and tapioca starch combine in gluten-free bread and chewy cookie starch blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "potato-starch",
    "target": "rice-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Potato starch and rice flour combine in Japanese mochi-style and gluten-free sponge cake formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice-flour",
    "target": "glutinous-rice-starch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rice flour and glutinous rice starch combine in mochi, tang yuan, and chewy Asian dessert doughs."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice-starch",
    "target": "waxy-rice-starch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Rice starch and waxy rice starch combine in East Asian transparent noodle and rice cake formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "waxy-corn-starch",
    "target": "cornstarch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Waxy corn starch and cornstarch combine in industrial-style gluten-free baking and high-viscosity sauce blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sago-starch",
    "target": "tapioca-starch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Sago starch and tapioca starch combine in Southeast Asian pearl pudding and bubble-tea starch blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "kudzu-starch",
    "target": "lotus-root-starch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Kudzu starch and lotus root starch combine in East Asian clear sauce and starch-pudding formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mung-bean-starch",
    "target": "sweet-potato-starch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Mung bean starch and sweet potato starch combine in Korean japchae-style and Chinese transparent noodle production."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pea-starch",
    "target": "potato-starch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Pea starch and potato starch combine in plant-based and gluten-free binder formulations for extruded pasta."
  },
  {
    "relationship": "commonly_served_with",
    "source": "chestnut-starch",
    "target": "water-chestnut-starch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Chestnut starch and water chestnut starch combine in East Asian cake flour blends and crisp coating mixes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sorghum-starch",
    "target": "rice-starch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Sorghum starch and rice starch combine in gluten-free beer-adjacent and hypoallergenic baking starch blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-starch",
    "target": "cornstarch",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Wheat starch and cornstarch combine in European pastry cream and industrial sauce viscosity blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "mesquite-flour",
    "target": "plantain-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Mesquite flour and plantain flour combine in Latin American and Southwestern gluten-free baking blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "amaranth-flour",
    "target": "quinoa-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Amaranth flour and quinoa flour combine in gluten-free pancake and quick bread multigrain blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "millet-flour",
    "target": "sorghum-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Millet flour and sorghum flour combine in African and American gluten-free flatbread formulations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "teff-flour",
    "target": "buckwheat-flour",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Teff flour and buckwheat flour combine in injera-adjacent and Eastern European gluten-free crêpe blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "perilla-seed",
    "target": "wattleseed",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Perilla seed and wattleseed combine in global native-seed bread and savory cracker seasoning blends."
  },
  {
    "relationship": "commonly_served_with",
    "source": "freekeh",
    "target": "couscous",
    "confidence": "high",
    "editorial_tier": "B",
    "editorial_review": "approved",
    "evidence": "Freekeh and couscous combine in Levantine grain salad and mezze platter multigrain service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice and garlic anchor fried rice, pilaf sofrito bases, and global savory grain aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice and onion combine in pilaf, biryani, and Latin American arroz con pollo-style grain bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice and chicken breast define Hainanese chicken rice, arroz con pollo, and global one-plate service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice and salmon combine in Japanese donburi, Nordic rice bowls, and herb-crusted fish over steamed grain."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice and ribeye pair in Korean bibimbap-adjacent bowls and steak-with-rice composed plates."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice and tomato combine in Spanish arroz, Indian tomato rice, and Mediterranean stuffed pepper grain fillings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice and cinnamon combine in Persian polo, Mexican arroz con leche-adjacent savory pilafs, and biryani aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice and feta combine in Greek spinach-rice pies and Mediterranean grain salad cheese layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wild-rice",
    "target": "food.fungi.wild-mushrooms.porcini",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wild rice and porcini combine in Minnesota wild rice soup and forest-mushroom pilaf service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wild-rice",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wild rice and salmon define Pacific Northwest and Scandinavian composed fish plates."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wild-rice",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wild rice and onion anchor wild rice soup and pilaf aromatic bases in Upper Midwest cookery."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wheat flour and tomato define pasta sauce, pizza, and roux-thickened tomato gravies worldwide."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "food.herb.fresh-herbs.basil",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wheat flour and basil combine in pesto pasta, caprese-adjacent flatbread, and Italian herb dough finishes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wheat flour and Parmigiano-Reggiano define fresh pasta, gnocchi-adjacent dumplings, and gratin crusts."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wheat flour and cheddar combine in savory scones, cheese bread, and British pie crust service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wheat flour and chicken breast combine in dredged cutlets, pot pie, and dumpling-wrapped poultry preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wheat flour and garlic combine in garlic knots, roux bases, and Mediterranean flatbread aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "whole-wheat-flour",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Whole-wheat flour and ribeye combine in beef Wellington-adjacent crusts and whole-grain steak pie service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "semolina",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Semolina and tomato define dried pasta, semolina gnocchi, and Southern Italian tomato pasta pairings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "semolina",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Semolina and Parmigiano-Reggiano combine in Roman cacio e pepe pasta and semolina dumpling service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "semolina",
    "target": "food.herb.fresh-herbs.basil",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Semolina and basil finish fresh pasta and Ligurian pesto presentations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "couscous",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Couscous and chicken breast combine in Moroccan tagine service and North African composed grain plates."
  },
  {
    "relationship": "commonly_served_with",
    "source": "couscous",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Couscous and tomato combine in Maghrebi vegetable couscous and harissa-spiced grain salads."
  },
  {
    "relationship": "commonly_served_with",
    "source": "couscous",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Couscous and feta combine in Mediterranean grain salads and stuffed pepper grain fillings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "matzo-meal",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Matzo meal and chicken breast combine in matzo ball soup and Passover dredged cutlet service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "farina",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Farina and cinnamon define hot wheat cereal and semolina pudding breakfast service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornmeal",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cornmeal and ribeye pair in Southern steak with cornbread and chili-cornbread composed plates."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornmeal",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cornmeal and cheddar combine in jalapeño cornbread, hush puppies, and savory corn pudding."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornmeal",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cornmeal and onion combine in hush puppies, cornbread dressing, and savory corn fritter bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornmeal",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cornmeal and chicken breast combine in Southern fried chicken dredge and cornmeal-crusted cutlets."
  },
  {
    "relationship": "commonly_served_with",
    "source": "polenta-meal",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Polenta meal and Parmigiano-Reggiano define Northern Italian polenta and grilled polenta cake service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "polenta-meal",
    "target": "food.fungi.wild-mushrooms.porcini",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Polenta meal and porcini combine in Alpine polenta con funghi and forest-mushroom ragù over soft polenta."
  },
  {
    "relationship": "commonly_served_with",
    "source": "polenta-meal",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Polenta meal and shiitake combine in modern bistro polenta with mushroom ragù presentations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grits",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grits and cheddar define Southern cheese grits and shrimp-and-grits-adjacent brunch service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grits",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grits and chicken breast combine in Southern brunch plates and gravy-over-grits poultry service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "masa-harina",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Masa harina and ribeye combine in Tex-Mex taco service and corn-tortilla steak composed plates."
  },
  {
    "relationship": "commonly_served_with",
    "source": "masa-harina",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Masa harina and feta combine in Mexican–Mediterranean fusion tlacoyo and stuffed corn masa preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "hominy",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Hominy and chicken breast combine in pozole and Southern hominy stew poultry service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "corn",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Whole dried corn and onion combine in succotash-adjacent and Latin American grain-and-sofrito preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "barley",
    "target": "food.fungi.wild-mushrooms.porcini",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Barley and porcini combine in Italian orzotto and Alpine mushroom-barley risotto service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "barley",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Barley and ribeye combine in Scotch broth-adjacent and beef-and-barley stew composed plates."
  },
  {
    "relationship": "commonly_served_with",
    "source": "barley",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Barley and onion anchor beef barley soup and European grain-pilaf aromatic bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pearl-barley",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pearl barley and shiitake combine in mushroom barley soup and East–West risotto-style grain bowls."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pearl-barley",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pearl barley and chicken breast combine in Scotch broth and chicken barley soup service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "bulgur",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Bulgur and tomato define tabbouleh-adjacent grain salads and Turkish kısır preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "bulgur",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Bulgur and onion combine in kibbeh-adjacent and Levantine pilaf aromatic bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "bulgur",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Bulgur and feta combine in Mediterranean grain salad and stuffed vegetable grain fillings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "freekeh",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Freekeh and chicken breast combine in Levantine freekeh pilaf and roast chicken stuffed with smoked grain."
  },
  {
    "relationship": "commonly_served_with",
    "source": "freekeh",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Freekeh and onion anchor smoky Levantine pilaf and soup aromatic bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "oats",
    "target": "food.herb.whole-spices.cinnamon",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Oats and cinnamon define oatmeal, baked oat bars, and Nordic spice porridge service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "oats",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Oats and cheddar combine in savory oatcakes and Scottish cheese oat biscuit service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "oats",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Oats and salmon combine in oat-crusted fish and Scottish oatmeal-adjacent composed brunch plates."
  },
  {
    "relationship": "commonly_served_with",
    "source": "farro",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Farro and tomato combine in Tuscan farro salad and tomato-braised ancient-grain risotto service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "farro",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Farro and Parmigiano-Reggiano combine in Italian farro risotto and grain salad cheese finishes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "farro",
    "target": "food.fungi.wild-mushrooms.porcini",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Farro and porcini combine in Umbrian farro and wild-mushroom ragù composed plates."
  },
  {
    "relationship": "commonly_served_with",
    "source": "spelt",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Spelt and ribeye combine in German spelt berry salads served alongside roast beef composed plates."
  },
  {
    "relationship": "commonly_served_with",
    "source": "quinoa",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Quinoa and tomato combine in South American quinoa salad and stuffed pepper grain fillings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "quinoa",
    "target": "food.cheese.brined.feta",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Quinoa and feta combine in Mediterranean power bowls and herb grain salad service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "quinoa",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Quinoa and chicken breast combine in health-forward grain bowls and stuffed poultry grain fillings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "millet",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Millet and chicken breast combine in West African millet porridge with poultry and Indian khichdi-adjacent service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "buckwheat",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Buckwheat and salmon combine in Russian blini with fish and Japanese soba-adjacent salmon bowl service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rye",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rye berries and ribeye combine in Nordic open sandwich and steak-with-rye-porridge composed service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "khorasan-wheat",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Khorasan wheat and cheddar combine in artisan Kamut grain salad and cheddar whole-grain bread service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornstarch",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cornstarch and chicken breast combine in stir-fry velveting and General Tso–style glazed cutlet coatings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornstarch",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cornstarch and salmon combine in light battered fish and Asian glazed salmon sauce thickening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornstarch",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cornstarch and tomato combine in thickened sweet-sour sauces and American Chinese tomato egg stir-fry."
  },
  {
    "relationship": "commonly_served_with",
    "source": "potato-starch",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Potato starch and salmon combine in gluten-free fish coating and Scandinavian potato-starch-thickened fish sauces."
  },
  {
    "relationship": "commonly_served_with",
    "source": "potato-starch",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Potato starch and chicken breast combine in Korean-style double-fried chicken and velveting marinades."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tapioca-starch",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tapioca starch and chicken breast combine in Brazilian tapioca crepe wraps and Asian velveting applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "tapioca-starch",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Tapioca starch and salmon combine in gluten-free fish cake binding and Asian clear fish sauce glazes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice-flour",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice flour and chicken breast combine in Korean fried chicken, rice-flour dredges, and dumpling wrappers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice-flour",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice flour and salmon combine in rice-flour battered fish and Japanese salmon tempura-adjacent coatings."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice-flour",
    "target": "food.fungi.cultivated-mushrooms.shiitake",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice flour and shiitake combine in gluten-free tempura and mushroom rice-noodle soup thickeners."
  },
  {
    "relationship": "commonly_served_with",
    "source": "arrowroot-starch",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Arrowroot starch and salmon combine in clear pan sauces and delicate fish glaze thickening."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-starch",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wheat starch and chicken breast combine in Asian translucent dumpling skin and velveting applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "food.herb.dried-herbs.rosemary",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice and rosemary combine in Italian risotto-adjacent and roast poultry stuffing grain aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "food.herb.dried-herbs.rosemary",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wheat flour and rosemary combine in focaccia, rosemary flatbread, and savory tart crust aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornmeal",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cornmeal and black pepper combine in cracked-pepper cornbread and Southern savory corn fritter seasoning."
  },
  {
    "relationship": "commonly_served_with",
    "source": "polenta-meal",
    "target": "food.herb.dried-herbs.rosemary",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Polenta meal and rosemary combine in grilled polenta cakes and roast herb polenta service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "barley",
    "target": "food.herb.dried-herbs.rosemary",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Barley and rosemary combine in Tuscan barley soup and roast lamb barley pilaf aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "oats",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Oats and black pepper combine in savory oatcakes and Scottish peppered porridge-adjacent service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "quinoa",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Quinoa and garlic combine in pilaf-style quinoa and Latin American sofrito grain bowl bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "bulgur",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Bulgur and garlic combine in kibbeh and Levantine grain pilaf aromatic layers."
  },
  {
    "relationship": "commonly_served_with",
    "source": "farro",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Farro and garlic combine in Tuscan farro soup and aglio–olio-adjacent grain preparations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "couscous",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Couscous and garlic combine in Moroccan chermoula grain service and garlic-herb couscous finishes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "grits",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Grits and black pepper season Southern breakfast grits and shrimp-and-grits pepper finish."
  },
  {
    "relationship": "commonly_served_with",
    "source": "semolina",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Semolina and black pepper combine in cacio e pepe and Roman semolina pasta seasoning."
  },
  {
    "relationship": "commonly_served_with",
    "source": "wheat-flour",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Wheat flour and black pepper combine in savory pie crust, crackers, and pepper bread service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rice",
    "target": "food.herb.whole-spices.black-pepper",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rice and black pepper finish pepper rice, steakhouse rice sides, and cacio e pepe-adjacent grain dishes."
  },
  {
    "relationship": "commonly_served_with",
    "source": "cornmeal",
    "target": "food.vegetable.nightshades.tomato",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Cornmeal and tomato combine in polenta pizza crust and Southern tomato-cornbread casserole service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "pearl-barley",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Pearl barley and ribeye combine in beef barley stew and steakhouse grain side composed plates."
  },
  {
    "relationship": "commonly_served_with",
    "source": "freekeh",
    "target": "food.fungi.wild-mushrooms.porcini",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Freekeh and porcini combine in Levantine–Italian fusion mushroom freekeh risotto service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "millet",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Millet and onion combine in Indian upma-adjacent and African millet porridge aromatic bases."
  },
  {
    "relationship": "commonly_served_with",
    "source": "sorghum",
    "target": "food.vegetable.alliums.garlic",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Sorghum and garlic combine in Southern sorghum grain bowls and savory porridge aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "teff",
    "target": "food.vegetable.alliums.onion",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Teff and onion combine in Ethiopian misir wot-adjacent grain side and teff porridge aromatics."
  },
  {
    "relationship": "commonly_served_with",
    "source": "buckwheat",
    "target": "food.cheese.hard.cheddar",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Buckwheat and cheddar combine in buckwheat galettes and savory crêpe cheese service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "rye-flour",
    "target": "food.protein.beef.ribeye",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Rye flour and ribeye combine in deli rye sandwich service and open-face steak on rye bread presentations."
  },
  {
    "relationship": "commonly_served_with",
    "source": "spelt-flour",
    "target": "food.protein.poultry.chicken-breast",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Spelt flour and chicken breast combine in spelt dumplings and ancient-grain dredged cutlet service."
  },
  {
    "relationship": "commonly_served_with",
    "source": "oat-flour",
    "target": "food.protein.fin-fish.salmon-fillet",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Oat flour and salmon combine in oat-crusted baked salmon and gluten-sensitive fish coating applications."
  },
  {
    "relationship": "commonly_served_with",
    "source": "einkorn",
    "target": "food.cheese.hard.parmigiano-reggiano",
    "confidence": "high",
    "editorial_tier": "C",
    "editorial_review": "approved",
    "evidence": "Einkorn and Parmigiano-Reggiano combine in heritage wheat berry salad and Italian ancient-grain cheese service."
  }
];
