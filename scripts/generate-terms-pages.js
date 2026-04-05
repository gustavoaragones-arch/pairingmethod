/**
 * Static SEO glossary: /terms/{slug}.html from WINE_TERMS + WINES descriptors.
 * Run: node scripts/generate-terms-pages.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WINE_TERMS } from "../assets/js/wine-terms-data.js";
import { WINES } from "../assets/js/pairing-data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "terms");

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function categoryLabel(id) {
  const m = {
    body_style: "Body & style",
    tannin: "Tannin",
    acidity: "Acidity",
    fruit: "Fruit",
    spice_oak: "Spice & oak",
    flower_herb_earth: "Flower, herb & earth",
    yeast: "Yeast & lees",
    alcohol: "Alcohol",
  };
  return m[id] || id;
}

function pairingBlurb(categoryId) {
  const b = {
    body_style:
      "Match weight to weight: fuller dishes call for fuller wines so neither side dominates.",
    tannin:
      "Protein and fat soften tannin — red meats, hard cheese, and mushroom dishes are natural partners.",
    acidity:
      "High-acid wines cut richness — try with fried food, cream sauces, citrusy plates, or goat cheese.",
    fruit:
      "Fruit character bridges to sauces and sides — riper profiles suit caramelization; citrusy profiles suit herbs and seafood.",
    spice_oak:
      "Oak spice and toast echo char, smoke, and baking spices — useful with BBQ, roast, or winter spices.",
    flower_herb_earth:
      "Earthy and herbal wines align with mushrooms, root vegetables, game, and green herbs.",
    yeast:
      "Autolytic and creamy notes love butter-based sauces, shellfish, and brunch dishes.",
    alcohol:
      "Balance alcohol heat with food richness; spicy food often prefers modest ABV or slight residual sugar.",
  };
  return b[categoryId] || "Use the pairing engine on the home page to map this term to your exact meal.";
}

function winesForSlug(slug) {
  return WINES.filter((w) => {
    const d = w.descriptors;
    if (!d) return false;
    return Object.values(d).some((arr) => Array.isArray(arr) && arr.includes(slug));
  });
}

/** ~40–55 words for featured-snippet style definition box. */
function featureSnippetParagraph(def) {
  const a = def.definition.trim().split(/\s+/);
  let parts = [...a];
  if (parts.length < 40 && def.context) {
    parts = [...parts, ...def.context.trim().split(/\s+/)];
  }
  const max = 52;
  if (parts.length <= max) return parts.join(" ");
  return parts.slice(0, max).join(" ") + "…";
}

function confusedWithSlugs(slug, def) {
  const ex = new Set([slug, ...(def.related || []), ...(def.opposites || [])]);
  return Object.entries(WINE_TERMS)
    .filter(([s, d]) => d.categoryId === def.categoryId && !ex.has(s))
    .map(([s]) => s)
    .sort((x, y) => WINE_TERMS[x].label.localeCompare(WINE_TERMS[y].label))
    .slice(0, 8);
}

function termFoodBridge(slug, def) {
  const cid = def.categoryId;
  const out = [];
  const add = (label, href) => {
    if (out.some((x) => x.href === href)) return;
    out.push({ label, href });
  };

  const tanninSlug =
    cid === "tannin" ||
    ["grippy", "firm", "tannic", "astringent", "chewy", "leathery"].includes(slug);
  const acidSlug =
    cid === "acidity" ||
    ["crisp", "bright", "zesty", "high-acidity", "racy", "tart", "fresh", "lean"].includes(
      slug
    );
  const fruitSlug =
    cid === "fruit" || ["jammy", "ripe", "lush", "extracted"].includes(slug);
  const oakSlug =
    cid === "spice_oak" ||
    ["smoky", "toasty", "oak", "vanilla", "clove", "toast", "cedar"].includes(slug);
  const earthSlug =
    cid === "flower_herb_earth" ||
    ["earthy", "graphite", "minerality", "herbal", "grassy"].includes(slug);

  if (tanninSlug) {
    add("Steak & red meat", "/wine-with-steak.html");
    add("Grilled steak (char)", "/wine-with-grilled-steak.html");
    add("BBQ ribs", "/wine-for-bbq-ribs.html");
    add("Aged / hard cheese plates", "/wine-with-creamy-dishes.html");
  } else if (acidSlug) {
    add("Salmon & seafood", "/wine-with-salmon.html");
    add("Fried fish", "/wine-with-fried-fish.html");
    add("Chicken", "/wine-with-chicken.html");
    add("Spicy dishes (careful with RS)", "/wine-with-spicy-food.html");
  } else if (fruitSlug) {
    add("BBQ & caramelized meats", "/wine-for-bbq-ribs.html");
    add("Grilled proteins", "/wine-with-grilled-steak.html");
    add("Turkey & holiday tables", "/wine-for-thanksgiving-turkey.html");
  } else if (oakSlug) {
    add("Grilled & smoky plates", "/wine-with-grilled-steak.html");
    add("Smoked pork", "/wine-with-smoked-pork.html");
    add("Roasted chicken", "/wine-with-roasted-chicken.html");
  } else if (earthSlug) {
    add("Mushroom-forward dishes", "/wine-with-creamy-dishes.html");
    add("Roasted poultry", "/wine-with-roasted-chicken.html");
    add("Game & savory sides", "/wine-with-steak.html");
  } else {
    add("All dish guides", "/pairings.html");
    add("Interactive engine", "/");
  }

  return out.slice(0, 6);
}

function graphLinkLi(s) {
  return `<li><a href="/terms/${escapeHtml(s)}.html" class="term-graph-link term-link" data-term="${escapeHtml(s)}">${escapeHtml(WINE_TERMS[s].label)}</a></li>`;
}

/** 2–3 sentences; always names ≥1 food and ≥1 wine style. */
function termIntentParagraph(slug, def) {
  const cat = def.categoryId;
  let food;
  let wine;
  let para;
  switch (cat) {
    case "tannin":
      food = "charred ribeye, braised lamb shank, or cave-aged cheddar";
      wine = "Cabernet Sauvignon, Barolo, or structured Syrah";
      para = `Tannic grip relaxes when the plate brings real protein and fat—think ${food}—because polyphenols bind lipid instead of drying the gums. Wines such as ${wine} are built for that trade: the meal softens the wine while structure counters richness. Without that buffer, the same bottle reads hard-edged.`;
      break;
    case "acidity":
      food = "fried fish, lemony salmon, or herbed goat cheese";
      wine = "Sancerre Sauvignon Blanc, dry Riesling, or bright Champagne";
      para = `Acidity is the palate reset: ${food} need a wine that can scour fat and salt, which is why sommeliers reach for ${wine}. Low-acid whites beside the same plate taste heavy and flat. Treat acid as the hinge between kitchen richness and glass refresh.`;
      break;
    case "body_style":
      food = "butter-poached lobster, mushroom risotto, or porterhouse";
      wine = "oaked Chardonnay, cool-climate Pinot Noir, or concentrated Cabernet";
      para = `Body mismatch shows on the first bite—${food} call for wines with comparable mass, not a wispy pour. ${wine} illustrate how extract, alcohol, and tannin stack to meet the dish. Pour something too light and the food steamrolls the wine.`;
      break;
    case "fruit":
      food = "BBQ-glazed ribs, charred burgers, or roast turkey with cranberry";
      wine = "ripe Zinfandel, bold Shiraz, or plush Grenache";
      para = `Ripe fruit in the glass anticipates caramelization and succulence on the plate—${food} resonate when the wine brings generous red and black fruit. Bottles like ${wine} mirror those Maillard and sauce notes instead of fighting them with austere profiles.`;
      break;
    case "spice_oak":
      food = "smoked brisket, cedar-planked salmon, or clove-spiced stews";
      wine = "toasty barrel-aged Chardonnay, modern Rioja, or French-oak-aged reds";
      para = `Toast, smoke, and baking spice hunt for the same cues from the kitchen—${food} echo that aromatic family. ${wine} show how oak-derived flavors bridge charred proteins without clumsy sweetness.`;
      break;
    case "flower_herb_earth":
      food = "wild mushrooms, beet salads, or herbed roast chicken";
      wine = "earthy Pinot Noir, savory Sangiovese, or cool-climate Syrah";
      para = `Savory, herbal, and mineral tones align with ${food} because they share the non-fruit spectrum. Try ${wine}: those bottles carry forest-floor lift that flatters roots, game, and herbs without jammy sweetness.`;
      break;
    case "yeast":
      food = "lobster rolls, brown-butter scallops, or aged Comté";
      wine = "traditional-method sparkling wine, lees-rich Chardonnay, or oxidative Jura whites";
      para = `Autolytic cream and brioche love ${food} where dairy fat and umami echo lees character. ${wine} delivers that brioche-meets-brine handshake—serve cool so the mousse stays lifted.`;
      break;
    case "alcohol":
      food = "slow-roasted pork belly, pepper-crusted steaks, or salty cheese boards";
      wine = "warm-climate reds with supple tannins, or lightly off-dry aromatic whites when chiles are in play";
      para = `Alcohol heat needs succulence and salt—${food} cushion ethanol so ${wine} can show depth without scorching the palate. Pair razor-lean salads with hot, high-ABV reds and the burn compounds.`;
      break;
    default:
      food = "your mains and finishing sauces";
      wine = "wines that mirror their intensity tier on our matrix";
      para = `This descriptor signals how the wine occupies the palate, so align ${food} with bottles carrying matched structure. Styles such as ${wine} demonstrate the principle: echo weight, acid, and tannin to the plate.`;
  }
  return para;
}

function grapeLinkForCategory(categoryId) {
  const m = {
    tannin: {
      href: "/grapes/cabernet-sauvignon.html",
      label: "Cabernet Sauvignon (grape guide)",
    },
    acidity: {
      href: "/grapes/sauvignon-blanc.html",
      label: "Sauvignon Blanc (grape guide)",
    },
    fruit: {
      href: "/grapes/pinot-noir.html",
      label: "Pinot Noir (grape guide)",
    },
    spice_oak: {
      href: "/grapes/chardonnay.html",
      label: "Chardonnay (grape guide)",
    },
    flower_herb_earth: {
      href: "/grapes/pinot-noir.html",
      label: "Pinot Noir (grape guide)",
    },
    yeast: {
      href: "/grapes/chardonnay.html",
      label: "Chardonnay (grape guide)",
    },
    alcohol: {
      href: "/grapes/riesling.html",
      label: "Riesling (grape guide)",
    },
    body_style: {
      href: "/grapes/chardonnay.html",
      label: "Chardonnay (grape guide)",
    },
  };
  return (
    m[categoryId] || {
      href: "/grapes/cabernet-sauvignon.html",
      label: "Cabernet Sauvignon (grape guide)",
    }
  );
}

/** ≥5 internal links: related terms, pairing URLs, grape hub. */
function buildCrossDensityList(slug, def) {
  const seen = new Set();
  const rows = [];
  const add = (href, label) => {
    if (seen.has(href)) return;
    seen.add(href);
    rows.push({ href, label });
  };

  const relPick = (def.related || []).filter((s) => WINE_TERMS[s]);
  relPick.slice(0, 2).forEach((s) =>
    add(`/terms/${s}.html`, `${WINE_TERMS[s].label} (related term)`)
  );

  const foods = termFoodBridge(slug, def);
  foods.slice(0, 2).forEach((f) => add(f.href, f.label));

  const grape = grapeLinkForCategory(def.categoryId);
  add(grape.href, grape.label);

  const pool = [...(def.related || []), ...(def.opposites || [])];
  let i = 0;
  while (rows.length < 5 && i < pool.length) {
    const s = pool[i++];
    if (!WINE_TERMS[s]) continue;
    add(`/terms/${s}.html`, WINE_TERMS[s].label);
  }
  if (rows.length < 5) add("/pairings.html", "Wine pairing guides hub");
  if (rows.length < 5) add("/", "Interactive pairing engine");
  if (rows.length < 5) add("/wine-with-steak.html", "Wine with steak guide");

  return rows
    .slice(0, 8)
    .map(
      (r) =>
        `<li><a href="${escapeHtml(r.href)}">${escapeHtml(r.label)}</a></li>`
    )
    .join("");
}

function pageHtml(slug, def) {
  const title = `What Does ‘${def.label}’ Mean in Wine? (and what to pair it with)`;
  const canonical = `https://pairingmethod.com/terms/${slug}.html`;
  const wines = winesForSlug(slug);
  const related = (def.related || [])
    .filter((s) => WINE_TERMS[s])
    .slice(0, 10);
  const opposites = (def.opposites || [])
    .filter((s) => WINE_TERMS[s])
    .slice(0, 10);
  const confused = confusedWithSlugs(slug, def);
  const snippet = featureSnippetParagraph(def);
  const metaDesc = snippet.slice(0, 155);

  const wineList =
    wines.length > 0
      ? `<ul>${wines.map((w) => `<li><strong>${escapeHtml(w.name)}</strong></li>`).join("")}</ul>`
      : "<p>Many wines can show this note depending on vintage and winemaking — use the engine to narrow by dish.</p>";

  const relList = related.map((s) => graphLinkLi(s)).join("");
  const oppList = opposites.map((s) => graphLinkLi(s)).join("");
  const confList = confused.map((s) => graphLinkLi(s)).join("");

  const foods = termFoodBridge(slug, def);
  const foodUl = foods
    .map(
      (f) =>
        `<li><a href="${escapeHtml(f.href)}">${escapeHtml(f.label)}</a></li>`
    )
    .join("");

  const defWordCount = def.definition.trim().split(/\s+/).length;
  const defExtra =
    defWordCount > 48 || snippet.endsWith("…")
      ? `<h2>Full definition</h2><p>${escapeHtml(def.definition)}</p>`
      : "";

  const intentPara = termIntentParagraph(slug, def);
  const intentSection = `<section class="term-intent">
<h2>What does this mean for pairing?</h2>
<p>${escapeHtml(intentPara)}</p>
</section>`;

  const pairingH2 =
    slug === "tannin"
      ? "Best food pairings for tannic wines"
      : slug === "acidity"
        ? "Best food pairings for high-acid wines"
        : slug === "body"
          ? "Best food pairings by wine body (weight)"
          : `Best food pairings for wines described as “${def.label}”`;
  const crossList = buildCrossDensityList(slug, def);
  const crossSection = `<section class="term-cross-density" aria-label="More internal guides">
<h2>Explore next</h2>
<ul>${crossList}</ul>
</section>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} | Pairing Method</title>
  <meta name="description" content="${escapeHtml(metaDesc)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(def.definition.slice(0, 200))}">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script type="application/ld+json">
  ${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: def.label,
    description: def.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Pairing Method wine glossary",
      url: "https://pairingmethod.com/",
    },
  })}
  </script>
</head>
<body>
  <header>
    <div class="container">
      <a href="/" class="logo">Pairing Method</a>
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/pairings.html">Pairings</a></li>
          <li><a href="/grapes.html">Grapes</a></li>
          <li><a href="/seasonal-wine-guides.html">Seasonal</a></li>
          <li><a href="/about.html">About</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <div class="container">
      <article class="term-page">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <a href="/">Glossary</a> &gt; <span>${escapeHtml(def.label)}</span>
        </nav>
        <p class="term-page-cat">${escapeHtml(categoryLabel(def.categoryId))}</p>
        <h1>${escapeHtml(title)}</h1>
        <h2 class="term-pairing-intent-h2">${escapeHtml(pairingH2)}</h2>

        <div class="definition-box">
          <h2>Definition</h2>
          <p>${escapeHtml(snippet)}</p>
        </div>

        ${defExtra}

        ${intentSection}

        <div class="term-graph">
          <div class="term-graph-group">
            <h3 class="term-graph-label">Similar</h3>
            ${relList ? `<ul class="term-graph-list">${relList}</ul>` : "<p>—</p>"}
          </div>
          <div class="term-graph-group">
            <h3 class="term-graph-label">Opposite</h3>
            ${oppList ? `<ul class="term-graph-list">${oppList}</ul>` : "<p>—</p>"}
          </div>
          <div class="term-graph-group">
            <h3 class="term-graph-label">Often confused with</h3>
            ${confList ? `<ul class="term-graph-list">${confList}</ul>` : "<p>—</p>"}
          </div>
        </div>

        <h2>Context</h2>
        <p>${escapeHtml(def.context)}</p>

        <section class="term-to-pairing">
          <h2>What foods pair with this profile?</h2>
          <ul>${foodUl}</ul>
        </section>

        <h2>Wines that often show this</h2>
        ${wineList}

        <h2>Pairing suggestions</h2>
        <p>${escapeHtml(pairingBlurb(def.categoryId))}</p>

        <p class="term-page-engine-cta"><a href="/">Open the pairing engine</a> to match this structure to your ingredients.</p>

        ${crossSection}
      </article>
    </div>
  </main>

  <footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <div class="footer-logo">Pairing Method</div>
      <p class="footer-tagline">Structured wine pairing intelligence based on culinary principles.</p>
    </div>
    <div class="footer-links">
      <div>
        <strong>Explore</strong>
        <a href="/pairings.html">Pairings</a>
        <a href="/seasonal-wine-guides.html">Seasonal</a>
        <a href="/pairing-matrix.html">Pairing Matrix</a>
      </div>
      <div>
        <strong>Company</strong>
        <a href="/about.html">About</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
      </div>
    </div>
    <div class="footer-meta">
      <p>Operated by Albor Digital LLC</p>
      <p><a href="mailto:contact@pairingmethod.com">contact@pairingmethod.com</a></p>
    </div>
  </div>
  <p class="crawl-hint">Explore more structured wine pairings across different foods and cooking styles.</p>
  <div class="footer-bottom">© Pairing Method — All rights reserved</div>
  </footer>
  <script type="module" src="/assets/js/quick-learn.js"></script>
  <script type="module" src="/assets/js/term-delegate.js"></script>
  <script type="module" src="/assets/js/term-auto-link.js"></script>
</body>
</html>
`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
let n = 0;
for (const [slug, def] of Object.entries(WINE_TERMS)) {
  const file = path.join(OUT_DIR, `${slug}.html`);
  fs.writeFileSync(file, pageHtml(slug, def), "utf-8");
  n += 1;
}
console.log(`Wrote ${n} term pages to ${OUT_DIR}`);
