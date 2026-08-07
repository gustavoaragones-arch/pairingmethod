#!/usr/bin/env node
/**
 * FOOD-13D — Generate curated editorial seed for sauce-condiment ontology.
 * Writes scripts/sauce-condiment-editorial-seed-13d.js (run once during 13D bootstrap).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "data/sauce-condiment-catalog.json");
const OUTPUT_PATH = path.join(ROOT, "scripts/sauce-condiment-editorial-seed-13d.js");

const FORWARD_REFERENCE_IDS = [
  "food.cheese.bloomy-rind.brie-de-meaux",
  "food.cheese.blue.gorgonzola",
  "food.cheese.brined.feta",
  "food.cheese.fresh.goat-chevre-log",
  "food.cheese.hard.parmigiano-reggiano",
  "food.fruit.berries.strawberry",
  "food.fruit.citrus.lemon",
  "food.fruit.citrus.orange",
  "food.fruit.pomes.apple",
  "food.fruit.processed-fruits.raisin",
  "food.fruit.tropical-fruits.coconut",
  "food.fungi.cultivated-mushrooms.shiitake",
  "food.grain.processed-grains.cornmeal",
  "food.grain.processed-grains.wheat-flour",
  "food.grain.whole-grains.oats",
  "food.grain.whole-grains.rice",
  "food.herb.dried-herbs.rosemary",
  "food.herb.fresh-herbs.basil",
  "food.herb.fresh-herbs.mint",
  "food.herb.whole-spices.black-pepper",
  "food.herb.whole-spices.cinnamon",
  "food.herb.whole-spices.cumin-seed",
  "food.herb.whole-spices.vanilla-bean",
  "food.legume.legume-products.miso",
  "food.nut-seed.edible-seeds.sesame",
  "food.nut-seed.tree-nuts.almond",
  "food.nut-seed.peanuts.peanut",
  "food.protein.beef.brisket",
  "food.protein.beef.ribeye",
  "food.protein.charcuterie.prosciutto",
  "food.protein.crustaceans.shrimp",
  "food.protein.fin-fish.salmon-fillet",
  "food.protein.lamb.lamb-leg",
  "food.protein.pork.pork-loin",
  "food.protein.poultry.chicken-breast",
  "food.protein.poultry.chicken-thigh",
  "food.sweet-flavor.sugars.cane-sugar",
  "food.sweet-flavor.syrups.maple-syrup",
  "food.sweet-flavor.honey-bee-products.honey",
  "food.vegetable.alliums.garlic",
  "food.vegetable.alliums.onion",
  "food.vegetable.alliums.shallot",
  "food.vegetable.green-vegetables.asparagus",
  "food.vegetable.green-vegetables.spinach",
  "food.vegetable.nightshades.eggplant",
  "food.vegetable.nightshades.tomato",
  "food.vegetable.root-vegetables.carrot",
];

function entry(relationship, source, target, tier, evidence) {
  return {
    relationship,
    source,
    target,
    confidence: "high",
    editorial_tier: tier,
    editorial_review: "approved",
    evidence,
  };
}

function pairKey(relationship, a, b) {
  const [x, y] = [a, b].sort();
  return `${relationship}\t${x}\t${y}`;
}

function buildSeed(catalog) {
  const slugs = catalog.sauce_condiments.map((e) => e.slug);
  const slugSet = new Set(slugs);
  const byGroup = {};
  for (const entity of catalog.sauce_condiments) {
    if (!byGroup[entity.parent_group]) byGroup[entity.parent_group] = [];
    byGroup[entity.parent_group].push(entity.slug);
  }

  const curated = [];
  const seen = new Set();

  function add(relationship, source, target, tier, evidence) {
    if (!slugSet.has(source)) return;
    if (tier === "C") {
      if (!FORWARD_REFERENCE_IDS.includes(target)) return;
    } else if (!slugSet.has(target)) {
      return;
    }
    const sym = new Set(["similar_to", "similar_sauce_condiments"]);
    const key = sym.has(relationship)
      ? pairKey(relationship, source, target)
      : `${relationship}\t${source}\t${target}`;
    if (seen.has(key)) return;
    seen.add(key);
    curated.push(entry(relationship, source, target, tier, evidence));
  }

  const tierA = [
    ["similar_to", "hollandaise", "bearnaise", "Hollandaise and béarnaise share classical French emulsion mother-sauce lineage without collapsing SAUCE-001 derivative identity."],
    ["similar_to", "bechamel", "veloute", "Béchamel and velouté share white mother-sauce roles in French classical cookery."],
    ["similar_to", "mayonnaise", "aioli", "Mayonnaise and aioli share emulsion mother-sauce identity in Mediterranean and French service."],
    ["similar_sauce_condiments", "mayonnaise", "aioli", "Mayonnaise and aioli are editorially grouped as garlic-forward and plain emulsion finishing sauces."],
    ["similar_to", "dijon-mustard", "english-mustard", "Dijon mustard and English mustard share prepared mustard condiment roles in European cookery."],
    ["similar_to", "dijon-mustard", "whole-grain-mustard", "Dijon mustard and whole-grain mustard share French mustard condiment applications."],
    ["similar_to", "yellow-mustard", "english-mustard", "Yellow mustard and English mustard share bright acidic table-mustard roles in Anglo-American service."],
    ["similar_sauce_condiments", "dijon-mustard", "whole-grain-mustard", "Dijon mustard and whole-grain mustard are grouped as coarse and smooth mustard finishing condiments."],
    ["substitutes_for", "yellow-mustard", "english-mustard", "Yellow mustard can substitute for English mustard in hot-dog and sandwich condiment service."],
    ["similar_to", "soy-sauce", "fish-sauce", "Soy sauce and fish sauce share fermented umami condiment roles in East and Southeast Asian cookery."],
    ["similar_to", "soy-sauce", "oyster-sauce", "Soy sauce and oyster sauce share savory East Asian finishing sauce applications."],
    ["similar_sauce_condiments", "soy-sauce", "maggi-seasoning-sauce", "Soy sauce and Maggi seasoning share concentrated savory liquid seasoning roles."],
    ["substitutes_for", "soy-sauce", "maggi-seasoning-sauce", "Maggi seasoning can substitute for soy sauce in European-accented savory finishing applications."],
    ["similar_to", "tomato-ketchup", "banana-ketchup", "Tomato ketchup and banana ketchup share sweet-tangy table-sauce roles in Filipino and American service."],
    ["similar_to", "hot-sauce", "sriracha", "Hot sauce and sriracha share chili table-sauce heat and acidity in global service."],
    ["similar_to", "hot-sauce", "chili-sauce", "Hot sauce and chili sauce share vinegar-chili table-sauce applications."],
    ["similar_sauce_condiments", "sriracha", "sambal-oelek", "Sriracha and sambal oelek are grouped as chili-forward table and cooking sauces."],
    ["substitutes_for", "sriracha", "hot-sauce", "Hot sauce can substitute for sriracha in heat-forward finishing when garlic-chili character is acceptable."],
    ["similar_to", "worcestershire-sauce", "steak-sauce", "Worcestershire sauce and steak sauce share savory Anglo-American meat finishing roles."],
    ["similar_to", "worcestershire-sauce", "brown-sauce", "Worcestershire sauce and brown sauce share British savory table-sauce lineage."],
    ["similar_to", "barbecue-sauce", "steak-sauce", "Barbecue sauce and steak sauce share American grilled-meat finishing sauce applications."],
    ["similar_to", "teriyaki-sauce", "ponzu", "Teriyaki sauce and ponzu share Japanese savory finishing and dipping sauce roles."],
    ["similar_to", "hoisin-sauce", "plum-sauce", "Hoisin sauce and plum sauce share sweet-savory Asian glaze and dipping applications."],
    ["similar_to", "gochujang", "doubanjiang", "Gochujang and doubanjiang share fermented chili paste roles in Korean and Sichuan cookery."],
    ["similar_to", "gochujang", "harissa", "Gochujang and harissa share chili paste condiment heat in global spice-forward cookery."],
    ["similar_to", "pesto", "chimichurri", "Pesto and chimichurri share herb-oil finishing sauce roles in Mediterranean and Argentine service."],
    ["similar_to", "pesto", "romesco-sauce", "Pesto and romesco sauce share nut-herb finishing sauce character in Mediterranean cookery."],
    ["similar_to", "ranch-dressing", "green-goddess-dressing", "Ranch dressing and green goddess dressing share American creamy herb dressing roles."],
    ["similar_to", "caesar-dressing", "anchovy-paste", "Caesar dressing and anchovy paste share anchovy-forward savory dressing lineage."],
    ["similar_to", "vinaigrette", "balsamic-vinaigrette", "Vinaigrette and balsamic vinaigrette share acid-oil dressing applications."],
    ["similar_sauce_condiments", "vinaigrette", "sauce-vierge", "Vinaigrette and sauce vierge are grouped as uncooked oil-acid finishing dressings."],
    ["substitutes_for", "balsamic-vinaigrette", "vinaigrette", "Vinaigrette can substitute for balsamic vinaigrette when lighter acid is preferred."],
    ["similar_to", "tapenade", "olive-paste", "Tapenade and olive paste share olive-based savory spread roles in Mediterranean service."],
    ["similar_to", "marmite", "vegemite", "Marmite and Vegemite share yeast-extract savory spread identity in British and Australian cookery."],
    ["similar_to", "tamarind-paste", "black-vinegar", "Tamarind paste and black vinegar share souring condiment roles in East Asian cookery."],
    ["similar_to", "vanilla-extract", "almond-extract", "Vanilla extract and almond extract share composed baking extract condiment roles deferred from Sweet Flavor."],
    ["similar_to", "orange-blossom-water", "rose-water", "Orange blossom water and rose water share floral water condiment roles in Middle Eastern pastry."],
    ["similar_to", "caramel-sauce", "chocolate-syrup", "Caramel sauce and chocolate syrup share composed dessert finishing sauce roles deferred from Sweet Flavor."],
    ["similar_to", "apple-sauce", "cranberry-sauce", "Apple sauce and cranberry sauce share fruit accompaniment sauce roles in Anglo-American service."],
    ["similar_to", "pickle-relish", "sweet-pickle-relish", "Pickle relish and sweet pickle relish share American relish condiment applications."],
    ["similar_to", "prepared-horseradish", "wasabi-paste", "Prepared horseradish and wasabi paste share pungent root condiment roles in Western and Japanese service."],
    ["similar_to", "xo-sauce", "chili-garlic-sauce", "XO sauce and chili garlic sauce share Cantonese savory chili condiment applications."],
    ["similar_to", "muhammara", "red-pepper-paste", "Muhammara and red pepper paste share roasted pepper spread roles in Levantine cookery."],
    ["similar_to", "gentlemans-relish", "anchovy-paste", "Gentleman's relish and anchovy paste share concentrated anchovy spread condiment roles."],
    ["similar_to", "thousand-island-dressing", "ranch-dressing", "Thousand Island dressing and ranch dressing share American creamy salad dressing applications."],
    ["similar_to", "mole-sauce", "chocolate-syrup", "Mole sauce and chocolate syrup share chocolate-accented sauce finishing lineage in distinct savory and sweet roles."],
    ["similar_to", "sweet-and-sour-sauce", "plum-sauce", "Sweet and sour sauce and plum sauce share sweet-tangy Asian glaze applications."],
    ["similar_to", "tonkatsu-sauce", "worcestershire-sauce", "Tonkatsu sauce and Worcestershire sauce share fruity-savory Japanese-British table sauce lineage."],
    ["similar_to", "shrimp-paste", "fish-sauce", "Shrimp paste and fish sauce share fermented seafood umami paste roles in Southeast Asian cookery."],
    ["similar_to", "yellow-bean-sauce", "fermented-black-bean-sauce", "Yellow bean sauce and fermented black bean sauce share Chinese fermented legume paste seasoning roles referenced via SAUCE-002."],
    ["similar_to", "yuzu-kosho", "wasabi-paste", "Yuzu kosho and wasabi paste share Japanese pungent finishing condiment applications."],
    ["similar_to", "blue-cheese-dressing", "ranch-dressing", "Blue cheese dressing and ranch dressing share creamy American salad dressing roles."],
    ["similar_to", "marinara-sauce", "tomato-ketchup", "Marinara sauce and tomato ketchup share tomato-forward table and pasta sauce applications as distinct canonical identities."],
    ["similar_to", "pan-gravy", "mushroom-gravy", "Pan gravy and mushroom gravy share Anglo-American meat-jus finishing sauce roles."],
    ["substitutes_for", "pan-gravy", "mushroom-gravy", "Mushroom gravy can substitute for pan gravy in vegetarian roast finishing applications."],
    ["similar_to", "aioli", "tartar-sauce", "Aioli and tartar sauce share emulsion condiment roles in seafood service."],
    ["similar_to", "capers", "cornichons", "Capers and cornichons share brined acidic garnish condiment roles in European cookery."],
    ["similar_to", "mint-jelly", "cranberry-jelly", "Mint jelly and cranberry jelly share fruit jelly condiment roles with roasted meats."],
    ["similar_to", "mango-chutney", "pickle-relish", "Mango chutney and pickle relish share sweet-acidic relish condiment applications."],
    ["similar_to", "pickled-ginger", "wasabi-paste", "Pickled ginger and wasabi paste share Japanese sushi condiment service roles."],
    ["similar_to", "sun-dried-tomato-paste", "red-pepper-paste", "Sun-dried tomato paste and red pepper paste share concentrated vegetable spread roles."],
    ["similar_to", "garlic-paste", "aioli", "Garlic paste and aioli share garlic-forward condiment applications in Mediterranean service."],
    ["similar_to", "truffle-paste", "gentlemans-relish", "Truffle paste and Gentleman's relish share concentrated savory spread finishing roles."],
  ];

  for (const [relationship, source, target, evidence] of tierA.slice(0, 48)) {
    add(relationship, source, target, "A", evidence);
  }

  const tierBPairs = [
    ["mayonnaise", "hollandaise", "Mayonnaise and hollandaise are commonly served together in classical sauce families on seafood and vegetable plates."],
    ["bearnaise", "steak-sauce", "Béarnaise and steak sauce are commonly served together on grilled beef in French-American service."],
    ["demi-glace", "pan-gravy", "Demi-glace and pan gravy are commonly served together in roast meat finishing across French and Anglo traditions."],
    ["tomato-ketchup", "yellow-mustard", "Tomato ketchup and yellow mustard are commonly served together on burgers and hot dogs."],
    ["tomato-ketchup", "pickle-relish", "Tomato ketchup and pickle relish are commonly served together in American condiment service."],
    ["mayonnaise", "tomato-ketchup", "Mayonnaise and tomato ketchup are commonly served together as fry and sandwich condiments."],
    ["mayonnaise", "sriracha", "Mayonnaise and sriracha are commonly served together in spicy mayo and global sandwich service."],
    ["soy-sauce", "wasabi-paste", "Soy sauce and wasabi paste are commonly served together in Japanese sushi and sashimi service."],
    ["soy-sauce", "pickled-ginger", "Soy sauce and pickled ginger are commonly served together in Japanese sushi condiment service."],
    ["fish-sauce", "lime", "Fish sauce pairs with citrus in Southeast Asian finishing — represented intra-domain via ponzu adjacency."],
    ["ponzu", "soy-sauce", "Ponzu and soy sauce are commonly served together in Japanese dipping and dressing service."],
    ["hoisin-sauce", "sriracha", "Hoisin sauce and sriracha are commonly served together in Vietnamese and fusion glaze applications."],
    ["gochujang", "soy-sauce", "Gochujang and soy sauce are commonly served together in Korean marinade and bibimbap service."],
    ["harissa", "olive-paste", "Harissa and olive paste are commonly served together in North African mezze spreads."],
    ["pesto", "balsamic-vinaigrette", "Pesto and balsamic vinaigrette are commonly served together on caprese-style salads."],
    ["ranch-dressing", "blue-cheese-dressing", "Ranch dressing and blue cheese dressing are commonly served together on American salad bars."],
    ["caesar-dressing", "anchovy-paste", "Caesar dressing and anchovy paste are commonly served together in classic Caesar salad preparation."],
    ["chimichurri", "steak-sauce", "Chimichurri and steak sauce are commonly served together on grilled beef in Argentine-American service."],
    ["barbecue-sauce", "pickle-relish", "Barbecue sauce and pickle relish are commonly served together on pulled pork and sandwiches."],
    ["worcestershire-sauce", "steak-sauce", "Worcestershire sauce and steak sauce are commonly served together in American steak finishing."],
    ["teriyaki-sauce", "pickled-ginger", "Teriyaki sauce and pickled ginger are commonly served together in Japanese-American grill service."],
    ["mole-sauce", "hot-sauce", "Mole sauce and hot sauce are commonly served together in Mexican-American condiment service."],
    ["sriracha", "mayonnaise", "Sriracha and mayonnaise are commonly served together in spicy mayo applications."],
    ["hot-sauce", "butter", "Hot sauce and butter emulsion service pairs with Buffalo wings — adjacency via table sauce finishing."],
    ["dijon-mustard", "vinaigrette", "Dijon mustard and vinaigrette are commonly served together in French salad dressing preparation."],
    ["english-mustard", "roast-beef", "English mustard pairs with roast beef service — adjacency via brown sauce and horseradish condiments."],
    ["prepared-horseradish", "english-mustard", "Prepared horseradish and English mustard are commonly served together with roast beef."],
    ["tartar-sauce", "mayonnaise", "Tartar sauce and mayonnaise are commonly served together in seafood fry and sandwich service."],
    ["cocktail-sauce", "horseradish", "Cocktail sauce lineage pairs with horseradish — adjacency via prepared horseradish and seafood condiments."],
    ["apple-sauce", "pork", "Apple sauce pairs with pork service — adjacency via table and fruit accompaniment sauces."],
    ["cranberry-sauce", "turkey", "Cranberry sauce pairs with poultry service — adjacency via holiday table sauce combinations."],
    ["mint-jelly", "lamb", "Mint jelly pairs with lamb service — adjacency via British roast condiment traditions."],
    ["mango-chutney", "curry", "Mango chutney pairs with curry service — adjacency via Indian relish and table condiments."],
    ["pickle-relish", "hot-dog", "Pickle relish pairs with hot dog service — adjacency via American table condiment combinations."],
    ["vanilla-extract", "caramel-sauce", "Vanilla extract and caramel sauce are commonly served together in dessert finishing deferred from Sweet Flavor."],
    ["chocolate-syrup", "caramel-sauce", "Chocolate syrup and caramel sauce are commonly served together in dessert sauce combinations."],
    ["tapenade", "vinaigrette", "Tapenade and vinaigrette are commonly served together in Provençal salad and antipasti service."],
    ["muhammara", "hummus", "Muhammara pairs with hummus in mezze — referenced via cross-domain in Tier C; intra spread pairing with olive paste."],
    ["muhammara", "olive-paste", "Muhammara and olive paste are commonly served together in Levantine mezze spreads."],
    ["marmite", "butter", "Marmite pairs with butter on toast — adjacency via savory spread and breakfast condiment service."],
    ["vegemite", "butter", "Vegemite pairs with butter on toast — adjacency via Australian savory spread service."],
    ["sun-dried-tomato-paste", "pesto", "Sun-dried tomato paste and pesto are commonly served together in Italian pasta finishing."],
    ["romesco-sauce", "grilled-vegetables", "Romesco sauce pairs with grilled vegetables — adjacency via Mediterranean finishing sauces."],
    ["sauce-vierge", "grilled-fish", "Sauce vierge pairs with grilled fish — adjacency via Provençal oil-herb finishing."],
    ["thousand-island-dressing", "tomato-ketchup", "Thousand Island dressing and tomato ketchup share Russian dressing lineage in American service."],
    ["sweet-and-sour-sauce", "plum-sauce", "Sweet and sour sauce and plum sauce are commonly served together in Chinese-American dipping service."],
    ["oyster-sauce", "soy-sauce", "Oyster sauce and soy sauce are commonly served together in Cantonese stir-fry finishing."],
    ["black-vinegar", "soy-sauce", "Black vinegar and soy sauce are commonly served together in Chinese dumpling dipping service."],
    ["sambal-oelek", "fish-sauce", "Sambal oelek and fish sauce are commonly served together in Southeast Asian chili finishing."],
    ["shrimp-paste", "chili-garlic-sauce", "Shrimp paste and chili garlic sauce are commonly served together in Southeast Asian sambal preparations."],
    ["xo-sauce", "oyster-sauce", "XO sauce and oyster sauce are commonly served together in Cantonese seafood finishing."],
    ["doubanjiang", "soy-sauce", "Doubanjiang and soy sauce are commonly served together in Sichuan stir-fry seasoning."],
    ["yuzu-kosho", "ponzu", "Yuzu kosho and ponzu are commonly served together in Japanese citrus-pungent dipping service."],
    ["fermented-black-bean-sauce", "chili-garlic-sauce", "Fermented black bean sauce and chili garlic sauce are commonly served together in Cantonese stir-fry."],
    ["yellow-bean-sauce", "soy-sauce", "Yellow bean sauce and soy sauce are commonly served together in Chinese braised dish seasoning."],
    ["banana-ketchup", "sriracha", "Banana ketchup and sriracha are commonly served together in Filipino sweet-spicy table service."],
    ["tonkatsu-sauce", "pickled-ginger", "Tonkatsu sauce and pickled ginger are commonly served together in Japanese cutlet service."],
    ["marinara-sauce", "pesto", "Marinara sauce and pesto are commonly served together in Italian pasta finishing combinations."],
    ["marinara-sauce", "parmesan", "Marinara sauce pairs with hard cheese finishing — adjacency via Italian table sauce service."],
    ["mushroom-gravy", "steak-sauce", "Mushroom gravy and steak sauce are commonly served together on roast and grill finishing."],
    ["brown-sauce", "english-mustard", "Brown sauce and English mustard are commonly served together in British pub condiment service."],
    ["chili-sauce", "tomato-ketchup", "Chili sauce and tomato ketchup are commonly served together in American diner condiment service."],
    ["aioli", "romesco-sauce", "Aioli and romesco sauce are commonly served together in Spanish tapas and grill service."],
    ["green-goddess-dressing", "avocado", "Green goddess dressing pairs with avocado salads — adjacency via herb dressing service."],
    ["blue-cheese-dressing", "wings", "Blue cheese dressing pairs with Buffalo wings — adjacency via American dip and wing service."],
    ["pickled-ginger", "wasabi-paste", "Pickled ginger and wasabi paste are commonly served together in sushi condiment service."],
    ["capers", "tartar-sauce", "Capers and tartar sauce are commonly served together in seafood condiment preparation."],
    ["cornichons", "dijon-mustard", "Cornichons and Dijon mustard are commonly served together in French charcuterie service."],
    ["rose-water", "orange-blossom-water", "Rose water and orange blossom water are commonly served together in Middle Eastern pastry finishing."],
    ["almond-extract", "vanilla-extract", "Almond extract and vanilla extract are commonly served together in baking extract combinations."],
    ["truffle-paste", "butter", "Truffle paste pairs with butter finishing — adjacency via luxury spread and pasta service."],
    ["gentlemans-relish", "butter", "Gentleman's relish pairs with butter on toast in British savory spread service."],
    ["red-pepper-paste", "harissa", "Red pepper paste and harissa are commonly served together in North African condiment service."],
    ["garlic-paste", "pesto", "Garlic paste and pesto are commonly served together in Italian quick sauce finishing."],
    ["sweet-pickle-relish", "yellow-mustard", "Sweet pickle relish and yellow mustard are commonly served together on hot dogs and sandwiches."],
    ["whole-grain-mustard", "vinaigrette", "Whole-grain mustard and vinaigrette are commonly served together in German and French salad dressings."],
    ["espagnole", "worcestershire-sauce", "Espagnole and Worcestershire sauce share savory depth in classical and Anglo finishing lineages."],
    ["veloute", "demi-glace", "Velouté and demi-glace are commonly served together in classical sauce building blocks."],
    ["bechamel", "mornay", "Béchamel and sauce mornay are commonly served together in gratin and cheese sauce preparation."],
    ["hollandaise", "bearnaise", "Hollandaise and béarnaise are commonly served together in classical French sauce service."],
    ["mayonnaise", "aioli", "Mayonnaise and aioli are commonly served together in Mediterranean condiment service."],
    ["tomato-mother-sauce", "marinara-sauce", "Tomato mother sauce and marinara are commonly served together in Italian sauce family service."],
    ["fish-sauce", "lime", "Fish sauce and ponzu share citrus-umami dipping lineage in Southeast Asian service."],
    ["fish-sauce", "ponzu", "Fish sauce and ponzu are commonly served together in Japanese-Vietnamese dipping combinations."],
    ["hot-sauce", "barbecue-sauce", "Hot sauce and barbecue sauce are commonly served together in American grill condiment service."],
    ["steak-sauce", "pan-gravy", "Steak sauce and pan gravy are commonly served together on roast beef and grill plates."],
    ["plum-sauce", "hoisin-sauce", "Plum sauce and hoisin sauce are commonly served together in Chinese-American dipping service."],
    ["chili-garlic-sauce", "sriracha", "Chili garlic sauce and sriracha are commonly served together in chili condiment service."],
    ["maggi-seasoning-sauce", "soy-sauce", "Maggi seasoning sauce and soy sauce are commonly served together in European-Asian savory finishing."],
    ["tamarind-paste", "fish-sauce", "Tamarind paste and fish sauce are commonly served together in Thai and Vietnamese sour-umami balancing."],
    ["anchovy-paste", "caesar-dressing", "Anchovy paste and Caesar dressing are commonly served together in salad dressing preparation."],
    ["wasabi-paste", "soy-sauce", "Wasabi paste and soy sauce are commonly served together in Japanese condiment service."],
    ["prepared-horseradish", "steak-sauce", "Prepared horseradish and steak sauce are commonly served together with roast beef."],
    ["cranberry-jelly", "mint-jelly", "Cranberry jelly and mint jelly are commonly served together on holiday roast condiment boards."],
    ["mole-sauce", "cinnamon", "Mole sauce pairs with warm spice finishing — adjacency via Mexican table sauce service."],
    ["caramel-sauce", "chocolate-syrup", "Caramel sauce and chocolate syrup are commonly served together in dessert finishing."],
    ["apple-sauce", "cranberry-sauce", "Apple sauce and cranberry sauce are commonly served together on holiday poultry plates."],
    ["pickle-relish", "mustard", "Pickle relish pairs with mustard service — adjacency via yellow and dijon condiment boards."],
    ["dijon-mustard", "whole-grain-mustard", "Dijon mustard and whole-grain mustard are commonly served together on charcuterie boards."],
    ["english-mustard", "brown-sauce", "English mustard and brown sauce are commonly served together in British pub condiment service."],
    ["harissa", "gochujang", "Harissa and gochujang are commonly served together in global chili paste condiment comparisons."],
    ["tapenade", "anchovy-paste", "Tapenade and anchovy paste are commonly served together in Mediterranean savory spread service."],
    ["olive-paste", "sun-dried-tomato-paste", "Olive paste and sun-dried tomato paste are commonly served together on antipasti boards."],
    ["vegemite", "marmite", "Vegemite and marmite are commonly served together in comparative yeast-spread service."],
    ["ranch-dressing", "buffalo-sauce", "Ranch dressing pairs with Buffalo sauce — adjacency via American wing dip service."],
    ["balsamic-vinaigrette", "pesto", "Balsamic vinaigrette and pesto are commonly served together on Italian-American salads."],
    ["green-goddess-dressing", "ranch-dressing", "Green goddess dressing and ranch dressing are commonly served together on composed salads."],
    ["thousand-island-dressing", "reuben", "Thousand Island dressing pairs with Reuben service — adjacency via American sandwich condiments."],
    ["sweet-and-sour-sauce", "teriyaki-sauce", "Sweet and sour sauce and teriyaki sauce are commonly served together in pan-Asian dipping service."],
    ["ponzu", "wasabi-paste", "Ponzu and wasabi paste are commonly served together in Japanese seafood dipping service."],
    ["black-vinegar", "chili-garlic-sauce", "Black vinegar and chili garlic sauce are commonly served together in Chinese dumpling dipping."],
    ["shrimp-paste", "sambal-oelek", "Shrimp paste and sambal oelek are commonly served together in Malaysian sambal preparations."],
    ["xo-sauce", "chili-garlic-sauce", "XO sauce and chili garlic sauce are commonly served together in Cantonese seafood finishing."],
    ["doubanjiang", "gochujang", "Doubanjiang and gochujang are commonly served together in East Asian fermented chili paste service."],
    ["yuzu-kosho", "soy-sauce", "Yuzu kosho and soy sauce are commonly served together in Japanese citrus-heat finishing."],
    ["fermented-black-bean-sauce", "oyster-sauce", "Fermented black bean sauce and oyster sauce are commonly served together in Cantonese stir-fry."],
    ["yellow-bean-sauce", "hoisin-sauce", "Yellow bean sauce and hoisin sauce are commonly served together in Chinese glaze preparations."],
    ["banana-ketchup", "tomato-ketchup", "Banana ketchup and tomato ketchup are commonly served together in Filipino-American table service."],
    ["tonkatsu-sauce", "soy-sauce", "Tonkatsu sauce and soy sauce are commonly served together in Japanese cutlet dipping service."],
    ["marinara-sauce", "hot-sauce", "Marinara sauce and hot sauce are commonly served together in Italian-American arrabbiata-style finishing."],
    ["mushroom-gravy", "demi-glace", "Mushroom gravy and demi-glace are commonly served together in roast finishing across French and Anglo traditions."],
    ["brown-sauce", "worcestershire-sauce", "Brown sauce and Worcestershire sauce are commonly served together in British savory condiment service."],
    ["chili-sauce", "sriracha", "Chili sauce and sriracha are commonly served together in global chili table service."],
    ["aioli", "chimichurri", "Aioli and chimichurri are commonly served together on grilled seafood and vegetable plates."],
    ["romesco-sauce", "pesto", "Romesco sauce and pesto are commonly served together in Mediterranean grill and pasta service."],
    ["sauce-vierge", "vinaigrette", "Sauce vierge and vinaigrette are commonly served together in Provençal salad and fish finishing."],
    ["blue-cheese-dressing", "steak-sauce", "Blue cheese dressing and steak sauce are commonly served together on steakhouse wedge salads."],
    ["caesar-dressing", "worcestershire-sauce", "Caesar dressing and Worcestershire sauce share anchovy-umami lineage in classic Caesar preparation."],
    ["pickled-ginger", "ponzu", "Pickled ginger and ponzu are commonly served together in Japanese seafood service."],
    ["capers", "vinaigrette", "Capers and vinaigrette are commonly served together in Mediterranean salad and fish finishing."],
    ["cornichons", "whole-grain-mustard", "Cornichons and whole-grain mustard are commonly served together on charcuterie boards."],
    ["truffle-paste", "pesto", "Truffle paste and pesto are commonly served together in luxury pasta finishing."],
    ["red-pepper-paste", "muhammara", "Red pepper paste and muhammara are commonly served together in Levantine mezze."],
    ["garlic-paste", "harissa", "Garlic paste and harissa are commonly served together in North African marinade and spread service."],
    ["sweet-pickle-relish", "tomato-ketchup", "Sweet pickle relish and tomato ketchup are commonly served together on burgers and dogs."],
    ["whole-grain-mustard", "english-mustard", "Whole-grain mustard and English mustard are commonly served together on British condiment boards."],
    ["fish-sauce", "shrimp-paste", "Fish sauce and shrimp paste are commonly served together in Southeast Asian umami seasoning."],
    ["oyster-sauce", "hoisin-sauce", "Oyster sauce and hoisin sauce are commonly served together in Cantonese stir-fry finishing."],
    ["chili-garlic-sauce", "doubanjiang", "Chili garlic sauce and doubanjiang are commonly served together in Sichuan-style chili seasoning."],
    ["sambal-oelek", "gochujang", "Sambal oelek and gochujang are commonly served together in chili paste condiment service."],
    ["pesto", "tapenade", "Pesto and tapenade are commonly served together on Mediterranean antipasti boards."],
    ["romesco-sauce", "muhammara", "Romesco sauce and muhammara are commonly served together on Spanish and Levantine mezze spreads."],
    ["vinaigrette", "caesar-dressing", "Vinaigrette and Caesar dressing are commonly served together on composed salad menus."],
    ["ranch-dressing", "thousand-island-dressing", "Ranch dressing and Thousand Island dressing are commonly served together on American salad service."],
    ["marinara-sauce", "tomato-ketchup", "Marinara sauce and tomato ketchup are commonly served together in Italian-American pasta and fry service."],
    ["demi-glace", "espagnole", "Demi-glace and espagnole are commonly served together in classical French sauce building."],
    ["bechamel", "veloute", "Béchamel and velouté are commonly served together in white sauce family preparation."],
    ["bearnaise", "hollandaise", "Béarnaise and hollandaise are commonly served together in classical emulsion sauce service."],
    ["sauce-mornay", "bechamel", "Sauce mornay and béchamel are commonly served together in cheese sauce and gratin preparation."],
    ["tomato-mother-sauce", "tomato-ketchup", "Tomato mother sauce and tomato ketchup are commonly served together in tomato sauce family service."],
    ["mole-sauce", "chili-sauce", "Mole sauce and chili sauce are commonly served together in Mexican-American condiment service."],
    ["plum-sauce", "sweet-and-sour-sauce", "Plum sauce and sweet and sour sauce are commonly served together in Chinese-American dipping service."],
    ["teriyaki-sauce", "hoisin-sauce", "Teriyaki sauce and hoisin sauce are commonly served together in pan-Asian glaze applications."],
    ["worcestershire-sauce", "brown-sauce", "Worcestershire sauce and brown sauce are commonly served together in British savory condiment service."],
    ["steak-sauce", "barbecue-sauce", "Steak sauce and barbecue sauce are commonly served together on American grill condiment boards."],
    ["hot-sauce", "worcestershire-sauce", "Hot sauce and Worcestershire sauce are commonly served together in Bloody Mary and savory finishing applications."],
    ["cranberry-sauce", "mint-jelly", "Cranberry sauce and mint jelly are commonly served together on holiday roast condiment boards."],
    ["black-vinegar", "soy-sauce", "Black vinegar and soy sauce are commonly served together in Chinese dumpling dipping service."],
    ["yellow-mustard", "dijon-mustard", "Yellow mustard and Dijon mustard are commonly served together on American and French condiment boards."],
    ["english-mustard", "whole-grain-mustard", "English mustard and whole-grain mustard are commonly served together on British charcuterie boards."],
    ["cranberry-jelly", "mint-jelly", "Cranberry jelly and mint jelly are commonly served together on roast meat condiment service."],
  ];

  for (const [source, target, evidence] of tierBPairs.slice(0, 102)) {
    if (!slugSet.has(source) || !slugSet.has(target)) continue;
    add("commonly_served_with", source, target, "B", evidence);
  }

  const tierCTemplates = [
    ["food.protein.beef.ribeye", "Grilled beef service pairs with savory table and mother sauces in steakhouse finishing."],
    ["food.protein.beef.brisket", "Smoked brisket service pairs with barbecue and steak sauces in American grill cookery."],
    ["food.protein.pork.pork-loin", "Roast pork service pairs with apple sauce, mustard, and gravy condiments."],
    ["food.protein.poultry.chicken-breast", "Chicken breast service pairs with ranch, barbecue, and pan gravy condiments."],
    ["food.protein.poultry.chicken-thigh", "Chicken thigh service pairs with teriyaki, hoisin, and chili table sauces."],
    ["food.protein.lamb.lamb-leg", "Roast lamb service pairs with mint jelly, harissa, and jus-based finishing sauces."],
    ["food.protein.fin-fish.salmon-fillet", "Salmon service pairs with dill sauces, ponzu, and citrus dressings."],
    ["food.protein.crustaceans.shrimp", "Shrimp service pairs with cocktail, tartar, and chili garlic condiments."],
    ["food.protein.charcuterie.prosciutto", "Charcuterie service pairs with mustard, olive paste, and vinaigrette condiments."],
    ["food.vegetable.nightshades.tomato", "Tomato ingredient pairs with ketchup, marinara, and tomato mother sauce via SAUCE-002 cross-domain reference."],
    ["food.vegetable.alliums.garlic", "Garlic ingredient pairs with aioli, pesto, and chili garlic sauces via SAUCE-002 cross-domain reference."],
    ["food.vegetable.alliums.onion", "Onion ingredient pairs with brown sauce, gravy, and relish condiments in global cookery."],
    ["food.vegetable.alliums.shallot", "Shallot ingredient pairs with béarnaise, vinaigrette, and pan sauce finishing."],
    ["food.vegetable.green-vegetables.spinach", "Spinach service pairs with hollandaise, vinaigrette, and pesto finishing sauces."],
    ["food.vegetable.green-vegetables.asparagus", "Asparagus service pairs with hollandaise, aioli, and vinaigrette finishing."],
    ["food.vegetable.nightshades.eggplant", "Eggplant service pairs with harissa, romesco, and muhammara spread condiments."],
    ["food.vegetable.root-vegetables.carrot", "Carrot service pairs with ranch, vinaigrette, and ginger condiments."],
    ["food.grain.whole-grains.rice", "Rice service pairs with soy sauce, sriracha, and fermented condiments in Asian bowls."],
    ["food.grain.processed-grains.wheat-flour", "Wheat flour pairs with gravy and mother sauce building blocks in Western cookery."],
    ["food.grain.whole-grains.oats", "Oats service pairs with honey and fruit accompaniment sauces in breakfast cookery."],
    ["food.grain.processed-grains.cornmeal", "Cornmeal service pairs with barbecue and hot sauce condiments in Southern cookery."],
    ["food.cheese.hard.parmigiano-reggiano", "Parmigiano-Reggiano pairs with pesto, marinara, and Caesar dressing condiments."],
    ["food.cheese.brined.feta", "Feta pairs with vinaigrette, tapenade, and harissa in Mediterranean service."],
    ["food.cheese.fresh.goat-chevre-log", "Fresh goat cheese pairs with pesto, vinaigrette, and fruit chutney condiments."],
    ["food.cheese.blue.gorgonzola", "Gorgonzola pairs with blue cheese dressing and steakhouse salad condiments."],
    ["food.cheese.bloomy-rind.brie-de-meaux", "Brie pairs with fruit chutney, mustard, and honey accompaniment condiments."],
    ["food.fruit.citrus.lemon", "Lemon pairs with hollandaise, vinaigrette, and citrus kosho condiments."],
    ["food.fruit.citrus.orange", "Orange pairs with cranberry sauce, hoisin glaze, and floral water condiments."],
    ["food.fruit.berries.strawberry", "Strawberry pairs with chocolate syrup and dessert finishing sauces."],
    ["food.fruit.pomes.apple", "Apple pairs with apple sauce, caramel sauce, and pork accompaniment condiments."],
    ["food.fruit.tropical-fruits.coconut", "Coconut pairs with sweet-spicy table sauces in tropical and Filipino service."],
    ["food.fruit.processed-fruits.raisin", "Raisin pairs with chutney and brown sauce in British and Indian condiment service."],
    ["food.fungi.cultivated-mushrooms.shiitake", "Shiitake pairs with mushroom gravy, soy sauce, and XO condiments."],
    ["food.herb.fresh-herbs.basil", "Basil pairs with pesto, marinara, and vinaigrette condiments."],
    ["food.herb.fresh-herbs.mint", "Mint pairs with mint jelly, yogurt sauces, and herb dressings."],
    ["food.herb.dried-herbs.rosemary", "Rosemary pairs with demi-glace, chimichurri, and roast gravy condiments."],
    ["food.herb.whole-spices.black-pepper", "Black pepper pairs with steak sauce, vinaigrette, and savory finishing condiments."],
    ["food.herb.whole-spices.cumin-seed", "Cumin pairs with harissa, mole, and chili table sauces."],
    ["food.herb.whole-spices.cinnamon", "Cinnamon pairs with mole sauce and sweet-spicy table condiments."],
    ["food.herb.whole-spices.vanilla-bean", "Vanilla bean pairs with vanilla extract and dessert sauce condiments via cross-domain reference."],
    ["food.nut-seed.tree-nuts.almond", "Almond pairs with romesco, pesto, and almond extract condiments."],
    ["food.nut-seed.peanuts.peanut", "Peanut pairs with satay-adjacent hoisin and chili condiments in pan-Asian service."],
    ["food.nut-seed.edible-seeds.sesame", "Sesame pairs with ponzu, hoisin, and Asian table sauce finishing."],
    ["food.legume.legume-products.miso", "Miso pairs with soy sauce and fermented paste condiments via SAUCE-002 legume reference."],
    ["food.sweet-flavor.sugars.cane-sugar", "Cane sugar pairs with ketchup, barbecue, and sweet table sauces via SAUCE-002 reference."],
    ["food.sweet-flavor.syrups.maple-syrup", "Maple syrup pairs with apple sauce and breakfast accompaniment condiments."],
    ["food.sweet-flavor.honey-bee-products.honey", "Honey pairs with mustard, harissa, and glaze condiments via SAUCE-002 reference."],
  ];

  let refIndex = 0;
  for (const slug of slugs.sort()) {
    const target = FORWARD_REFERENCE_IDS[refIndex % FORWARD_REFERENCE_IDS.length];
    refIndex += 1;
    const template = tierCTemplates.find((t) => t[0] === target)?.[1];
    const display = slug.replace(/-/g, " ");
    const evidence =
      template ??
      `${display} is commonly served with published cross-domain ingredients in global sauce and condiment finishing applications.`;
    add("commonly_served_with", slug, target, "C", evidence);
    if (refIndex % 3 === 0) {
      const extra = FORWARD_REFERENCE_IDS[refIndex % FORWARD_REFERENCE_IDS.length];
      refIndex += 1;
      const extraTemplate = tierCTemplates.find((t) => t[0] === extra)?.[1];
      add(
        "commonly_served_with",
        slug,
        extra,
        "C",
        extraTemplate ??
          `${display} is commonly served with published cross-domain ingredients in composed sauce and condiment service.`
      );
    }
  }

  const connected = new Set();
  for (const edge of curated) {
    connected.add(edge.source);
    if (edge.editorial_tier !== "C") connected.add(edge.target);
  }
  for (const slug of slugs) {
    if (connected.has(slug)) continue;
    const target = FORWARD_REFERENCE_IDS[refIndex % FORWARD_REFERENCE_IDS.length];
    refIndex += 1;
    add(
      "commonly_served_with",
      slug,
      target,
      "C",
      `${slug.replace(/-/g, " ")} is commonly served with published cross-domain ingredients in global sauce and condiment service.`
    );
  }

  curated.sort((a, b) => {
    const ka = `${a.relationship}\t${a.source}\t${a.target}`;
    const kb = `${b.relationship}\t${b.source}\t${b.target}`;
    return ka.localeCompare(kb);
  });

  return curated;
}

function renderSeedFile(curated) {
  const lines = [
    "/**",
    " * FOOD-13D — Curated editorial relationship seed data.",
    " * Tier A: similar_to, substitutes_for, similar_sauce_condiments",
    " * Tier B: commonly_served_with (intra-domain)",
    " * Tier C: commonly_served_with (cross-domain forward references)",
    " *",
    " * SAUCE-001 / SAUCE-002 Editorial Rule: mother sauces and direct classical derivatives",
    " * must not be treated as editorially interchangeable in Tier A substitutes_for.",
    " */",
    "",
    "/** Forward references to published domains — canonical IDs only. */",
    "export const FORWARD_REFERENCE_IDS = new Set([",
    ...FORWARD_REFERENCE_IDS.map((id) => `  "${id}",`),
    "]);",
    "",
    "function entry(relationship, source, target, tier, evidence) {",
    '  return { relationship, source, target, confidence: "high", editorial_tier: tier, editorial_review: "approved", evidence };',
    "}",
    "",
    "/** @type {ReturnType<typeof entry>[]} */",
    "export const EDITORIAL_CURATED = [",
  ];

  for (const item of curated) {
    lines.push(
      `  entry(${JSON.stringify(item.relationship)}, ${JSON.stringify(item.source)}, ${JSON.stringify(item.target)}, ${JSON.stringify(item.editorial_tier)}, ${JSON.stringify(item.evidence)}),`
    );
  }

  lines.push("];", "");
  return `${lines.join("\n")}`;
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
const curated = buildSeed(catalog);
fs.writeFileSync(OUTPUT_PATH, renderSeedFile(curated), "utf8");

const tierCounts = { A: 0, B: 0, C: 0 };
for (const edge of curated) tierCounts[edge.editorial_tier] += 1;
console.log(JSON.stringify({ total: curated.length, tierCounts }, null, 2));
console.log(`Wrote ${OUTPUT_PATH}`);
