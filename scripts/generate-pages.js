/**
 * Controlled programmatic expansion: emit validated pairing pages from templates + manual copy.
 * Run from repo root: node scripts/generate-pages.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, "..");
const templatesDir = path.join(root, "templates");
const outputDir = root;

const BASE = "https://pairingmethod.com";

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

/**
 * Each entry: slug, SEO, unique intro, 2–3 matrix attributes max, FAQs, related HTML, serving bullets.
 */
const combinations = [
  {
    slug: "wine-with-grilled-steak",
    pageTitle: "Best Wine for Grilled Steak | Pairing Method",
    ogTitle: "Best Wine for Grilled Steak",
    h1: "Best Wine for Grilled Steak",
    breadcrumbLabel: "Best Wine for Grilled Steak",
    metaDescription:
      "Best wine for grilled steak: structured reds and matrix logic for char, fat, and smoke. Refine cuts and sides with the Pairing Method engine.",
    intro:
      "Grilled steak layers caramelized fat, smoke from the grate, and deep beef savor. Wines need enough structure—tannin, body, and acidity—to mirror that intensity without thinning out. Leaner cuts can bend toward medium reds, but char and browning usually favor bolder bottles. Use the interactive matrix below to align your exact cut, sides, and heat level with nine wine style families.",
    queryMatch:
      "What wine goes with grilled steak, the best wine for your cut and char, and a focused grilled steak wine pairing all come down to structure and smoke. This page leads with the written answer, then the matrix at the end when you want to encode sides, rub, and heat.",
    context: {
      protein: ["red_meat"],
      preparation: ["grilled"],
    },
    relatedBody:
      'Compare with <a href="/wine-with-steak.html">wine with steak</a> (all preparations), <a href="/wine-for-bbq-ribs.html">BBQ ribs</a> for sweet smoke, and the full <a href="/pairings.html">pairing guide hub</a>.',
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
    pageTitle: "Best Wine for Roasted Chicken | Pairing Method",
    ogTitle: "Best Wine for Roasted Chicken",
    h1: "Best Wine for Roasted Chicken",
    breadcrumbLabel: "Best Wine for Roasted Chicken",
    metaDescription:
      "Best wine for roasted chicken: medium reds, rich whites, and rosé—scored with the Pairing Method matrix for herbs, skin, and gravy.",
    intro:
      "Roasted chicken delivers crisp skin, juicy meat, and gentle savory depth—often with herbs and pan juices. Wines should match that moderate intensity without overpowering: medium reds, rich whites, and many rosés sit in the sweet spot. Acidity keeps the pairing fresh when the bird comes straight from the oven. Layer dark meat, gravy, or vegetables in the engine to sharpen the match.",
    queryMatch:
      "If you are searching what wine goes with roasted chicken, the best wine for pan juices and herbs, or a roasted chicken wine pairing in one pass, the logic is the same: moderate weight and good acidity. Read the lead answer first, then use the tool last to layer gravy, sides, and vegetables.",
    context: {
      protein: ["poultry"],
      preparation: ["roasted"],
    },
    relatedBody:
      'See <a href="/wine-with-chicken.html">wine with chicken</a> for broader cuts, <a href="/wine-for-thanksgiving-turkey.html">Thanksgiving turkey</a> for holiday roasts, and <a href="/pairings.html">more guides</a>.',
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
    pageTitle: "Best Wine for Fried Fish | Pairing Method",
    ogTitle: "Best Wine for Fried Fish",
    h1: "Best Wine for Fried Fish",
    breadcrumbLabel: "Best Wine for Fried Fish",
    metaDescription:
      "Best wine for fried fish: crisp whites, sparkling, and rosé—cut richness with acidity. Use the pairing matrix for fish plus fryer prep.",
    intro:
      "Fried fish pairs crunch, oil, and mild protein—so wine needs lift. High-acid whites, sparkling wine, and lighter rosés cut grease and refresh the palate. Heavy oaked reds usually clash with delicate fillets. The matrix below encodes fish plus fried preparation so you can see which columns stay green while you adjust batter, spice, and sides.",
    queryMatch:
      "What wine goes with fried fish, the best wine for a hot crust, and a practical fried fish wine pairing all lean on acid and bubbles. This guide gives the answer in text before the engine, with the matrix last when you want to model batter, lemon, and sides.",
    context: {
      protein: ["fish"],
      preparation: ["fried"],
    },
    relatedBody:
      'Contrast with <a href="/wine-with-salmon.html">wine with salmon</a>, lighter <a href="/wine-with-chicken.html">chicken</a> fried dishes, and browse <a href="/pairings.html">all pairings</a>.',
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
    pageTitle: "Best Wine for Spicy Food | Pairing Method",
    ogTitle: "Best Wine for Spicy Food",
    h1: "Best Wine for Spicy Food",
    breadcrumbLabel: "Best Wine for Spicy Food",
    metaDescription:
      "Best wine for spicy food: off-dry whites, aromatic styles, rosé—balance heat without fanning alcohol burn. Matrix-driven pairing logic.",
    intro:
      "Spicy food amplifies heat and can make tannin and high alcohol feel harsher. Slight sweetness, lower alcohol, and aromatic lift often work better than dry, grippy reds—sweetness is structural, not dessert. Rosé, off-dry whites, and sparkling can tame capsaicin while refreshing the palate. Add protein and starch rows when your dish isn’t heat alone so the matrix reflects the full plate.",
    queryMatch:
      "What wine goes with spicy food, the best wine for taming capsaicin without harshening alcohol, and a clear spicy food wine pairing: reach for lift and a touch of sweetness before tannin. The explanation leads; the tool follows when you want the full matrix on the plate you actually cooked.",
    context: {
      spice: ["spicy"],
    },
    relatedBody:
      'Pair with <a href="/wine-for-bbq-ribs.html">BBQ ribs</a> when smoke meets sugar, explore <a href="/wine-with-chicken.html">chicken</a> for protein context, and see <a href="/pairings.html">more guides</a>.',
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
    pageTitle: "Best Wine for Creamy Dishes | Pairing Method",
    ogTitle: "Best Wine for Creamy Dishes",
    h1: "Best Wine for Creamy Dishes",
    breadcrumbLabel: "Best Wine for Creamy Dishes",
    metaDescription:
      "Best wine for creamy dishes: acidity-driven whites, structured whites, and selective reds—pair fat with cut-through, via the pairing matrix.",
    intro:
      "Creamy sauces, soft cheeses, and dairy-forward plates coat the palate and raise richness. Wines need enough acidity to cut through fat—or controlled richness that matches without doubling weight blindly. Thin, tannic reds without acidity often feel awkward; crisp and structured whites frequently lead. Add starch, protein, and prep rows when cream sits on pasta, poultry, or vegetables so the matrix stays honest.",
    queryMatch:
      "If you are asking what wine goes with creamy dishes, the best wine for cheese- or dairy-weight plates, or a one-stop creamy dish wine pairing, acid cutting fat is the through-line. The answer is up front; the engine sits after so you can add starch, protein, and how you made the cream.",
    context: {
      dairy: ["soft_cheese"],
    },
    relatedBody:
      'Explore <a href="/wine-with-chicken.html">chicken with cream sauces</a>, <a href="/wine-with-salmon.html">salmon</a> for fatty fish, and the <a href="/pairing-matrix.html">full matrix</a> reference.',
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
    pageTitle: "Best Wine for Smoked Pork | Pairing Method",
    ogTitle: "Best Wine for Smoked Pork",
    h1: "Best Wine for Smoked Pork",
    breadcrumbLabel: "Best Wine for Smoked Pork",
    metaDescription:
      "Best wine for smoked pork: medium reds, rosé, structured whites—balance smoke, sweetness, and fat using Pairing Method’s matrix.",
    intro:
      "Smoked pork stacks sweet, savory, and smoky notes from wood and low heat. Medium reds, rosés, and structured whites can align with smoke without amplifying bitterness. Rubs and sauces—sweet, spicy, or vinegary—shift the matrix: update spice, fruit, and starch rows to match what’s on the plate. The tool below keeps preparation and protein explicit so scores stay interpretable.",
    queryMatch:
      "What wine goes with smoked pork, the best wine for your rub and glaze, and a full smoked pork wine pairing start with sweet, smoke, and fat in balance. Read the direct guidance first, then open the matrix to reflect your exact sauce, sides, and heat.",
    context: {
      protein: ["pork"],
      preparation: ["smoked"],
    },
    relatedBody:
      'Compare <a href="/wine-for-bbq-ribs.html">BBQ ribs</a>, <a href="/wine-with-grilled-steak.html">grilled steak</a> for char without long smoke, and <a href="/pairings.html">all pairing guides</a>.',
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
  const canonicalUrl = `${BASE}/${page.slug}.html`;
  const faqSchemaJson = JSON.stringify(buildFaqSchema(page.faqs), null, 2);
  const servingLi = page.servingLi.map((t) => `          <li>${escapeHtml(t)}</li>`).join("\n");

  const replacements = {
    "{{PAGE_TITLE}}": page.pageTitle,
    "{{META_DESCRIPTION}}": escapeHtml(page.metaDescription),
    "{{CANONICAL_URL}}": canonicalUrl,
    "{{OG_TITLE}}": escapeHtml(page.ogTitle),
    "{{H1}}": escapeHtml(page.h1),
    "{{BREADCRUMB_LABEL}}": escapeHtml(page.breadcrumbLabel),
    "{{INTRO}}": escapeHtml(page.intro),
    "{{QUERY_MATCH_TEXT}}": escapeHtml(page.queryMatch),
    "{{RELATED_BODY}}": page.relatedBody,
    "{{CONTEXT}}": contextScript(page.context),
    "{{FAQ_SCHEMA_JSON}}": faqSchemaJson,
    "{{FAQ_HTML}}": buildFaqHtml(page.faqs),
    "{{SERVING_LI}}": servingLi,
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
