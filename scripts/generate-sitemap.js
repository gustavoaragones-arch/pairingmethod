/**
 * Discover all public HTML pages (excludes /templates) and write /sitemap.xml.
 * Run from repo root: node scripts/generate-sitemap.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASE = "https://pairingmethod.com";

/** Explicit priorities; anything else gets defaultPriority */
const PRIORITY = {
  "index.html": 1.0,
  "pairings.html": 0.9,
  "pairing-matrix.html": 0.9,
  "wine-with-steak.html": 0.9,
  "wine-with-salmon.html": 0.9,
  "wine-with-chicken.html": 0.9,
  "wine-for-bbq-ribs.html": 0.85,
  "wine-for-thanksgiving-turkey.html": 0.85,
  "grapes.html": 0.85,
  "seasonal-wine-guides.html": 0.8,
  "thanksgiving-wine-guide.html": 0.8,
  "christmas-wine-pairing-guide.html": 0.8,
  "summer-bbq-wine-guide.html": 0.8,
  "romantic-dinner-wine-guide.html": 0.8,
  "wine-with-grilled-steak.html": 0.8,
  "wine-with-roasted-chicken.html": 0.8,
  "wine-with-fried-fish.html": 0.8,
  "wine-with-spicy-food.html": 0.8,
  "wine-with-creamy-dishes.html": 0.8,
  "wine-with-smoked-pork.html": 0.8,
  "grapes/cabernet-sauvignon.html": 0.7,
  "grapes/pinot-noir.html": 0.7,
  "grapes/chardonnay.html": 0.7,
  "grapes/sauvignon-blanc.html": 0.7,
  "grapes/riesling.html": 0.7,
  "about.html": 0.5,
  "privacy.html": 0.3,
  "terms.html": 0.3,
  "disclaimer.html": 0.3,
  "cookies.html": 0.3,
};

const DEFAULT_PRIORITY = 0.65;

function walkHtmlFiles(dir, rel = "") {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const full = path.join(dir, ent.name);
    const relPath = rel ? `${rel}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      if (ent.name === "templates" || ent.name === "node_modules") continue;
      out.push(...walkHtmlFiles(full, relPath));
    } else if (ent.name.endsWith(".html")) {
      out.push(relPath.replace(/\\/g, "/"));
    }
  }
  return out;
}

function toLoc(filePath) {
  if (filePath === "index.html") return `${BASE}/`;
  return `${BASE}/${filePath}`;
}

function main() {
  const files = walkHtmlFiles(ROOT).sort((a, b) => a.localeCompare(b));
  /** W3C DateTime — freshness signal for crawlers (regenerate on each deploy). */
  const lastmod = new Date().toISOString();

  const urlEntries = files.map((f) => {
    const pri = PRIORITY[f] ?? DEFAULT_PRIORITY;
    const priStr = (Math.round(pri * 10) / 10).toFixed(1);
    const loc = toLoc(f);
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priStr}</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join("\n\n")}
</urlset>
`;

  const outPath = path.join(ROOT, "sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf-8");
  console.log(`Wrote ${outPath} (${files.length} URLs)`);
}

main();
