/**
 * Controlled programmatic expansion: emit validated pairing pages from templates + manual copy.
 * Run from repo root: node scripts/generate-pages.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  absoluteUrl,
  canonicalUrl,
  grapeUrl,
  ogUrl,
  pairingUrl,
  publicPath,
  schemaUrl,
  termUrl,
} from "../lib/public-url.js";
import { buildSeoBundle } from "./pairing-seo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, "..");
const templatesDir = path.join(root, "templates");
const outputDir = root;

const SHARED_ROUTES = Object.freeze({
  home: publicPath("index.html"),
  pairings: publicPath("pairings.html"),
  grapes: publicPath("grapes.html"),
  seasonal: publicPath("seasonal-wine-guides.html"),
  about: publicPath("about.html"),
  matrix: publicPath("pairing-matrix.html"),
  privacy: publicPath("privacy.html"),
  termsOfService: publicPath("terms.html"),
  disclaimer: publicPath("disclaimer.html"),
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function buildFaqHtml(faqs) {
  return faqs
    .map(
      (f) => `        <div class="faq-item">
          <h3>${escapeHtml(f.q)}</h3>
          <p>${escapeHtml(f.a)}</p>
        </div>`
    )
    .join("\n\n");
}

function pageLink(href, label) {
  return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

/**
 * Each entry: slug + foodLabel + copy blocks (SEO derived via pairing-seo.js).
 */
const combinations = [
  {
    slug: "wine-with-grilled-steak",
    foodLabel: "Grilled Steak",
    pageSubline:
      "The best wine with grilled steak matches char, smoke, and fat—Cabernet Sauvignon and Syrah lead; lean cuts can take Merlot or Pinot Noir.",
    directAnswer:
      "Cabernet Sauvignon and Syrah are the best wines with grilled steak when the cut is fatty and the grate adds smoke. Tannin binds to protein, acidity refreshes between bites, and peppery fruit mirrors char. For all steak preparations—including pan-seared ribeye—see our general wine with steak guide.",
    sommelierVerdict: {
      wine: "Cabernet Sauvignon",
      confidenceKey: "smoky",
      dishContext: "grilled ribeye and strip steak",
      reasoning:
        "firm tannin and full body stand up to grill smoke and caramelized fat without thinning on the palate",
    },
    queryMatch:
      "Best wine for grilled steak, what wine goes with grilled steak, and grilled steak wine pairing all point to structured reds first. This page owns grill and char; pan-seared or butter-basted cuts are covered on the main steak guide.",
    metaDescription:
      "Cabernet Sauvignon and Syrah are the best wines with grilled steak for char and fat. Sommelier pairing guide for cuts, rubs, and smoke.",
    context: { protein: ["red_meat"], preparation: ["grilled"] },
    relatedBody: `For steak in any preparation, see ${pageLink(pairingUrl("wine-with-steak"), "wine with steak")}. Sweet-smoke plates: ${pageLink(pairingUrl("wine-for-bbq-ribs"), "wine with BBQ ribs")}. Hub: ${pageLink(SHARED_ROUTES.pairings, "all pairing guides")}.`,
    faqs: [
      {
        q: "Does grilled steak need a bolder wine than pan-seared?",
        a: "Often yes. Grill marks and smoke add intensity that pairs well with structured reds; pan-seared can be a touch more flexible depending on fat.",
      },
      {
        q: "Can I drink white wine with grilled steak?",
        a: "Rich whites can work with leaner steak or butter sauces, but classic grilled ribeye usually favors red for tannin and weight.",
      },
      {
        q: "What if I use a spicy rub?",
        a: "Add spicy and aromatic spice rows in the engine—heat shifts the matrix toward rosé, aromatic whites, and off-dry styles.",
      },
    ],
    servingLi: [
      "Rest the steak before slicing so juices stabilize; wine shows better against calm, even bites.",
      "Pour structured reds near 16–18°C (60–65°F) if the room is warm.",
      "Large-bowl glasses help bold reds open next to char.",
    ],
  },
  {
    slug: "wine-with-roasted-chicken",
    foodLabel: "Roasted Chicken",
    pageSubline:
      "The best wine for roasted chicken is Pinot Noir or Chardonnay—moderate weight, bright acidity, and enough body for pan juices and herbs.",
    directAnswer:
      "Pinot Noir and Chardonnay are the best wines for roasted chicken: Pinot lifts white and dark meat with acidity and gentle earth; Chardonnay matches butter, gravy, and root vegetables. Best wine for roast chicken and roast chicken wine pairing both favor moderate intensity—not heavy, tannic reds.",
    sommelierVerdict: {
      wine: "Pinot Noir",
      confidenceKey: "safest",
      dishContext: "roast chicken with herbs and pan juices",
      reasoning:
        "its acidity lifts the meat while earthy notes mirror roasted skin and savory depth",
    },
    queryMatch:
      "Best wine for roasted chicken, roast chicken wine pairing, and wine with roast chicken are answered here. For grilled, fried, or cream-sauced chicken, see the general wine with chicken guide.",
    metaDescription:
      "Pinot Noir and Chardonnay are the best wines for roasted chicken—herbs, skin, and gravy. Sommelier roast chicken pairing guide.",
    context: { protein: ["poultry"], preparation: ["roasted"] },
    relatedBody: `General poultry pairings: ${pageLink(pairingUrl("wine-with-chicken"), "wine with chicken")}. Holiday roasts: ${pageLink(pairingUrl("wine-for-thanksgiving-turkey"), "wine with Thanksgiving turkey")}. ${pageLink(grapeUrl("pinot-noir"), "Pinot Noir")} and ${pageLink(grapeUrl("chardonnay"), "Chardonnay")} guides. More: ${pageLink(SHARED_ROUTES.pairings, "pairing hub")}.`,
    faqs: [
      {
        q: "Is Chardonnay good with roast chicken?",
        a: "Yes when the dish has butter, cream, or root vegetables—rich white rows align with that weight.",
      },
      {
        q: "When should I choose red over white?",
        a: "Dark meat, mushroom stuffing, or reduced sauces often nudge the matrix toward medium red; the tool shows the intersection.",
      },
      {
        q: "Does lemon or brine change the pairing?",
        a: "Higher acidity in the food lifts the need for wine acidity—add citrus or green vegetable rows if those flavors dominate.",
      },
    ],
    servingLi: [
      "Serve whites lightly chilled and reds cool—not hot—to keep acidity perceptible with poultry fat.",
      "Carve at the table so the breast stays moist; wine follows texture more predictably.",
      "Match glass size to wine weight: smaller for crisp whites, larger bowls for medium reds.",
    ],
  },
  {
    slug: "wine-with-fried-fish",
    foodLabel: "Fried Fish",
    pageSubline:
      "The best wine with fried fish cuts oil with acidity—Sauvignon Blanc, sparkling wine, and dry rosé are the top sommelier picks.",
    directAnswer:
      "Sauvignon Blanc, sparkling wine, and dry rosé are the best wines with fried fish because high acidity and bubbles refresh the palate against hot fat and batter. Heavy tannic reds clash with delicate fillets.",
    sommelierVerdict: {
      wine: "Sauvignon Blanc",
      confidenceKey: "classic",
      dishContext: "beer-battered and pan-fried fish",
      reasoning:
        "crisp acidity and citrus lift cut through oil without competing with mild protein",
    },
    queryMatch: `What wine goes with fried fish, the best wine for fried fish, and fried fish wine pairing all lean on acid and bubbles. Lighter fish without fryer prep: ${pageLink(pairingUrl("wine-with-salmon"), "wine with salmon")}.`,
    metaDescription:
      "Sauvignon Blanc, sparkling wine, and rosé are the best wines with fried fish—cut richness with acidity. Sommelier pairing guide.",
    context: { protein: ["fish"], preparation: ["fried"] },
    relatedBody: `Richer fish: ${pageLink(pairingUrl("wine-with-salmon"), "wine with salmon")}. Poultry fry: ${pageLink(pairingUrl("wine-with-chicken"), "wine with chicken")}. ${pageLink(termUrl("acidity"), "Acidity")} in pairing. ${pageLink(SHARED_ROUTES.pairings, "All guides")}.`,
    faqs: [
      {
        q: "Is sparkling wine good with fried fish?",
        a: "Often yes—bubbles and acidity contrast oil and keep the palate clean.",
      },
      {
        q: "What about tartar sauce or lemon?",
        a: "Acid from condiments increases the need for crisp wine; add herb or dairy rows if sauces are creamy.",
      },
      {
        q: "Does beer always beat wine here?",
        a: "Beer is classic, but crisp wine can match when acidity is high enough—use the matrix to compare columns.",
      },
    ],
    servingLi: [
      "Serve sparkling and crisp whites well chilled (6–10°C) against hot fried coatings.",
      "Pat excess oil briefly so aromatics in the wine aren’t masked.",
      "Fresher pours matter—acidity is doing the work.",
    ],
  },
  {
    slug: "wine-with-spicy-food",
    foodLabel: "Spicy Food",
    pageSubline:
      "The best wine with spicy food balances heat—off-dry Riesling, aromatic whites, and rosé tame capsaicin better than grippy tannic reds.",
    directAnswer:
      "Off-dry Riesling, Gewürztraminer-style aromatics, and dry rosé are the best wines with spicy food because a touch of sweetness and lower alcohol soften heat without fanning burn. Bold dry reds often taste harsher beside capsaicin.",
    sommelierVerdict: {
      wine: "Off-dry Riesling",
      confidenceKey: "friendly",
      dishContext: "chili-forward and pepper-heavy dishes",
      reasoning:
        "residual sugar and acidity calm heat the way dairy can, without clashing like high tannin",
    },
    queryMatch: `What wine goes with spicy food, best wine for spicy food, and spicy food wine pairing: reach for lift and gentle sweetness before tannin. Smoky-sweet plates: ${pageLink(pairingUrl("wine-for-bbq-ribs"), "wine with BBQ ribs")}.`,
    metaDescription:
      "Off-dry Riesling and rosé are the best wines with spicy food—balance heat without harsh tannin. Sommelier pairing guide.",
    context: { spice: ["spicy"] },
    relatedBody: `Smoke and sugar: ${pageLink(pairingUrl("wine-for-bbq-ribs"), "wine with BBQ ribs")}. Protein context: ${pageLink(pairingUrl("wine-with-chicken"), "wine with chicken")}. ${pageLink(termUrl("off-dry"), "Off-dry")} wines explained. ${pageLink(SHARED_ROUTES.pairings, "More guides")}.`,
    faqs: [
      {
        q: "Why is a little sweetness recommended with heat?",
        a: "Residual sugar softens capsaicin burn the same way dairy can—without clashing the way tannin often does.",
      },
      {
        q: "Can I drink bold red with spicy food?",
        a: "Sometimes, but heat often pushes the matrix away from dry reds—check your exact rows in the tool.",
      },
      {
        q: "Does beer pair better than wine?",
        a: "Beer is forgiving; wine works when you pick lower tannin, good acidity, or touch sweetness—use the scores to compare.",
      },
    ],
    servingLi: [
      "Chill aromatic and off-dry whites lightly; ice-cold masks flavor.",
      "Pour smaller glasses of higher-ABV wines if heat is intense.",
      "Balance the table with rice or bread when heat is extreme—then update starch rows.",
    ],
  },
  {
    slug: "wine-with-creamy-dishes",
    foodLabel: "Creamy Dishes",
    pageSubline:
      "The best wine with creamy dishes needs acidity to cut fat—Chardonnay, Sauvignon Blanc, and selective medium reds lead.",
    directAnswer:
      "Chardonnay, Sauvignon Blanc, and medium-bodied Pinot Noir are the best wines with creamy dishes when acidity matches sauce weight. Thin, highly tannic reds without acid feel awkward against dairy-rich plates.",
    sommelierVerdict: {
      wine: "Chardonnay",
      confidenceKey: "restaurant",
      dishContext: "cream sauces and soft-cheese plates",
      reasoning:
        "balanced acidity and controlled richness cut through fat without doubling heaviness on the palate",
    },
    queryMatch: `What wine goes with creamy dishes, best wine for creamy pasta, and creamy dish wine pairing: acid cutting fat is the rule. Creamy poultry: ${pageLink(pairingUrl("wine-with-chicken"), "wine with chicken")}.`,
    metaDescription:
      "Chardonnay and Sauvignon Blanc are the best wines with creamy dishes—cut fat with acidity. Sommelier pairing guide.",
    context: { dairy: ["soft_cheese"] },
    relatedBody: `Creamy poultry: ${pageLink(pairingUrl("wine-with-chicken"), "wine with chicken")}. Fatty fish: ${pageLink(pairingUrl("wine-with-salmon"), "wine with salmon")}. ${pageLink(grapeUrl("chardonnay"), "Chardonnay")}. ${pageLink(SHARED_ROUTES.matrix, "Pairing matrix")}.`,
    faqs: [
      {
        q: "Is Chardonnay always the answer for cream?",
        a: "Often, when the wine has acid and balance; overly oaky or low-acid whites can feel heavy.",
      },
      {
        q: "Can red wine work with cream?",
        a: "Yes when tannin is moderate and acidity is sufficient—use the engine to see conflicts with your exact rows.",
      },
      {
        q: "What if there’s lemon or tomato with the cream?",
        a: "Acidity in the dish increases the need for wine acidity—add nightshade or green vegetable rows as needed.",
      },
    ],
    servingLi: [
      "Serve high-acid whites cool but not ice-cold so aroma survives cream.",
      "Reduce sauces enough—concentration changes salt and fat balance.",
      "Wide white glasses help creamy dishes more than narrow flutes.",
    ],
  },
  {
    slug: "wine-with-smoked-pork",
    foodLabel: "Smoked Pork",
    pageSubline:
      "The best wine with smoked pork balances sweet, smoke, and fat—Zinfandel, off-dry Riesling, and medium reds are sommelier favorites.",
    directAnswer:
      "Zinfandel, Grenache-style medium reds, and off-dry Riesling are the best wines with smoked pork when rubs and glazes add sweetness. Acidity and fruit keep smoke from reading bitter; update spice rows for hot rubs.",
    sommelierVerdict: {
      wine: "Zinfandel",
      confidenceKey: "smoky",
      dishContext: "smoked pork with sweet or pepper rub",
      reasoning:
        "jammy fruit and moderate tannin mirror smoke and glaze without amplifying bitterness",
    },
    queryMatch: `What wine goes with smoked pork, best wine for smoked pork, and smoked pork wine pairing balance sugar, smoke, and fat. Char without long smoke: ${pageLink(pairingUrl("wine-with-grilled-steak"), "wine with grilled steak")}.`,
    metaDescription:
      "Zinfandel and off-dry Riesling are the best wines with smoked pork—smoke, sweetness, and fat. Sommelier pairing guide.",
    context: { protein: ["pork"], preparation: ["smoked"] },
    relatedBody: `Sweet smoke: ${pageLink(pairingUrl("wine-for-bbq-ribs"), "wine with BBQ ribs")}. Grill char: ${pageLink(pairingUrl("wine-with-grilled-steak"), "wine with grilled steak")}. ${pageLink(termUrl("smoky"), "Smoky")} flavor in wine. ${pageLink(SHARED_ROUTES.pairings, "All guides")}.`,
    faqs: [
      {
        q: "Does smoke make wine taste more bitter?",
        a: "It can—balanced fruit, acidity, and moderate oak usually fare better than extremely dry, tannic reds alone.",
      },
      {
        q: "What if the pork is heavily sauced?",
        a: "Add sweet starch or fruit rows when glaze is prominent; sugar changes which wine columns stay strong.",
      },
      {
        q: "Is cider a better match than wine?",
        a: "Cider works; wine still fits when you pick styles the matrix scores well for smoke plus your sides.",
      },
    ],
    servingLi: [
      "Slice pork thin for consistent smoke exposure per bite—easier to match wine weight.",
      "Rest before serving so juices redistribute; salt perception affects wine.",
      "Offer slightly cooler reds if the rub is hot—heat magnifies alcohol.",
    ],
  },
];

function contextScript(ctx) {
  const json = JSON.stringify(ctx, null, 2);
  return `<script>
window.PAIRING_CONTEXT = ${json};
</script>`;
}

function applyTemplate(template, page) {
  const publicRoute = pairingUrl(page.slug);
  const pageCanonicalUrl = canonicalUrl(publicRoute);
  const pageOgUrl = ogUrl(publicRoute);
  const pageSchemaUrl = schemaUrl(publicRoute);
  const seo = buildSeoBundle({
    foodLabel: page.foodLabel,
    pageSubline: page.pageSubline,
    directAnswer: page.directAnswer,
    sommelierVerdict: page.sommelierVerdict,
    queryMatch: page.queryMatch,
    metaDescription: page.metaDescription,
  });
  const faqSchemaJson = JSON.stringify(buildFaqSchema(page.faqs), null, 2);
  const servingLi = page.servingLi.map((t) => `          <li>${escapeHtml(t)}</li>`).join("\n");

  const replacements = {
    "{{PAGE_TITLE}}": seo.pageTitle,
    "{{META_DESCRIPTION}}": escapeHtml(seo.metaDescription),
    "{{CANONICAL_URL}}": pageCanonicalUrl,
    "{{OG_URL}}": pageOgUrl,
    "{{SCHEMA_URL}}": pageSchemaUrl,
    "{{SITE_URL}}": absoluteUrl(SHARED_ROUTES.home),
    "{{OG_TITLE}}": escapeHtml(seo.ogTitle),
    "{{H1}}": escapeHtml(seo.h1),
    "{{BREADCRUMB_LABEL}}": escapeHtml(seo.breadcrumbLabel),
    "{{PAGE_SUBLINE}}": escapeHtml(seo.pageSubline),
    "{{DIRECT_ANSWER}}": escapeHtml(seo.directAnswer),
    "{{SOMMELIER_VERDICT_HTML}}": seo.sommelierVerdictHtml,
    "{{QUERY_MATCH_TEXT}}": page.queryMatch,
    "{{RELATED_BODY}}": page.relatedBody,
    "{{CONTEXT}}": contextScript(page.context),
    "{{FAQ_SCHEMA_JSON}}": faqSchemaJson,
    "{{FAQ_HTML}}": buildFaqHtml(page.faqs),
    "{{SERVING_LI}}": servingLi,
    "{{HOME_URL}}": SHARED_ROUTES.home,
    "{{PAIRINGS_URL}}": SHARED_ROUTES.pairings,
    "{{GRAPES_URL}}": SHARED_ROUTES.grapes,
    "{{SEASONAL_URL}}": SHARED_ROUTES.seasonal,
    "{{ABOUT_URL}}": SHARED_ROUTES.about,
    "{{MATRIX_URL}}": SHARED_ROUTES.matrix,
    "{{PRIVACY_URL}}": SHARED_ROUTES.privacy,
    "{{TERMS_OF_SERVICE_URL}}": SHARED_ROUTES.termsOfService,
    "{{DISCLAIMER_URL}}": SHARED_ROUTES.disclaimer,
    "{{TERM_TANNIN_URL}}": termUrl("tannin"),
    "{{TERM_ACIDITY_URL}}": termUrl("acidity"),
    "{{TERM_BODY_URL}}": termUrl("body"),
    "{{GRAPE_CABERNET_URL}}": grapeUrl("cabernet-sauvignon"),
    "{{GRAPE_PINOT_URL}}": grapeUrl("pinot-noir"),
    "{{GRAPE_CHARDONNAY_URL}}": grapeUrl("chardonnay"),
  };

  let html = template;
  for (const [token, value] of Object.entries(replacements)) {
    html = html.split(token).join(value);
  }
  return html;
}

function main() {
  const templatePath = path.join(templatesDir, "pairing-template.html");
  if (!fs.existsSync(templatePath)) {
    console.error("Missing template:", templatePath);
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, "utf-8");
  const seen = new Set();

  combinations.forEach((page) => {
    if (seen.has(page.slug)) {
      throw new Error(`Duplicate slug: ${page.slug}`);
    }
    seen.add(page.slug);

    const html = applyTemplate(template, page);
    const filePath = path.join(outputDir, `${page.slug}.html`);
    fs.writeFileSync(filePath, html, "utf-8");
    console.log("Wrote", path.relative(root, filePath));
  });

  console.log(`Done. ${combinations.length} pages.`);
}

main();
