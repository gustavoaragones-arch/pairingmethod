/**
 * ONTOLOGY-01C — Migrate wine-style-catalog serving text fields to serving entity slugs.
 * Run: node scripts/migrate-style-serving-slugs.js
 *
 * Reads data/wine-style-catalog.json and data/wine-serving-catalog.json,
 * replaces serving_temperature, glassware, decanting, aging with serving object.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const STYLE_CATALOG = path.join(ROOT, "data", "wine-style-catalog.json");
const SERVING_CATALOG = path.join(ROOT, "data", "wine-serving-catalog.json");

/** Per-style serving slug mapping derived from ONTOLOGY-01A text fields. */
const STYLE_SERVING = {
  "cabernet-sauvignon": {
    temperature: "room-temperature",
    glassware: "bordeaux-glass",
    decanting: "1-hour",
    cellaring: "long-term-aging",
    serving_notes:
      "Young, tannic examples benefit from 1–2 hours decanting; older wines 30–60 minutes.",
  },
  merlot: {
    temperature: "room-temperature",
    glassware: "universal-wine-glass",
    decanting: "30-minutes",
    cellaring: "medium-term-aging",
    serving_notes: "Optional for young oaky examples; 30 minutes is usually enough.",
  },
  "pinot-noir": {
    temperature: "cellar-temperature",
    glassware: "burgundy-glass",
    decanting: "30-minutes",
    cellaring: "medium-term-aging",
    serving_notes: "Usually not required; older Burgundy may need only 20–30 minutes for sediment.",
  },
  "syrah-shiraz": {
    temperature: "room-temperature",
    glassware: "universal-wine-glass",
    decanting: "1-hour",
    cellaring: "medium-term-aging",
    serving_notes: "1 hour for young, tannic Syrah; 30 minutes for plush Shiraz.",
  },
  malbec: {
    temperature: "room-temperature",
    glassware: "universal-wine-glass",
    decanting: "30-minutes",
    cellaring: "medium-term-aging",
    serving_notes: "Optional; 30 minutes for young oak-aged bottles.",
  },
  grenache: {
    temperature: "cool",
    glassware: "universal-wine-glass",
    decanting: "no-decanting",
    cellaring: "short-term-aging",
    serving_notes: "Optional decant for young, high-alcohol examples.",
  },
  sangiovese: {
    temperature: "cool",
    glassware: "universal-wine-glass",
    decanting: "1-hour",
    cellaring: "medium-term-aging",
    serving_notes: "1–2 hours for young Brunello; Chianti often needs less.",
  },
  nebbiolo: {
    temperature: "room-temperature",
    glassware: "burgundy-glass",
    decanting: "extended-decant",
    cellaring: "long-term-aging",
    serving_notes: "Essential for young Barolo — 2–4 hours; older wines about 1 hour.",
  },
  tempranillo: {
    temperature: "cool",
    glassware: "universal-wine-glass",
    decanting: "30-minutes",
    cellaring: "medium-term-aging",
    serving_notes: "30–60 minutes for reserva and gran reserva.",
  },
  zinfandel: {
    temperature: "room-temperature",
    glassware: "bordeaux-glass",
    decanting: "30-minutes",
    cellaring: "short-term-aging",
    serving_notes: "Optional; 30–60 minutes for young, high-alcohol bottles.",
  },
  chardonnay: {
    temperature: "cool",
    glassware: "white-wine-glass",
    decanting: "splash-decant",
    cellaring: "short-term-aging",
    serving_notes: "Rarely needed; allow 10 minutes in glass for premium white Burgundy.",
  },
  "sauvignon-blanc": {
    temperature: "chilled",
    glassware: "white-wine-glass",
    decanting: "no-decanting",
    cellaring: "drink-now",
    serving_notes: "Serve well chilled — decanting strips freshness.",
  },
  riesling: {
    temperature: "chilled",
    glassware: "white-wine-glass",
    decanting: "no-decanting",
    cellaring: "medium-term-aging",
    serving_notes: "Dry 3–10 years; sweet German examples 10–30+ years.",
  },
  "pinot-grigio": {
    temperature: "chilled",
    glassware: "white-wine-glass",
    decanting: "no-decanting",
    cellaring: "drink-now",
  },
  "chenin-blanc": {
    temperature: "lightly-chilled",
    glassware: "white-wine-glass",
    decanting: "30-minutes",
    cellaring: "medium-term-aging",
    serving_notes: "Optional for aged Savennières; dry 5–15 years, sweet Loire 10–30+ years.",
  },
  viognier: {
    temperature: "cool",
    glassware: "white-wine-glass",
    decanting: "no-decanting",
    cellaring: "short-term-aging",
    serving_notes: "Warm slightly if over-chilled.",
  },
  gewurztraminer: {
    temperature: "chilled",
    glassware: "aromatic-white-service",
    decanting: "no-decanting",
    cellaring: "short-term-aging",
    serving_notes: "Drink 1–5 years for primary aromatics.",
  },
  albarino: {
    temperature: "chilled",
    glassware: "white-wine-glass",
    decanting: "no-decanting",
    cellaring: "drink-now",
    serving_notes: "Serve well chilled.",
  },
  champagne: {
    temperature: "sparkling-chilled",
    glassware: "champagne-tulip",
    decanting: "no-decanting",
    cellaring: "medium-term-aging",
    serving_notes: "Never decant — preserve bubbles. NV 2–5 years; prestige cuvée 10–25+ years.",
  },
  prosecco: {
    temperature: "ice-cold",
    glassware: "champagne-flute",
    decanting: "no-decanting",
    cellaring: "drink-now",
    serving_notes: "Serve very chilled; drink within 1–2 years of release.",
  },
  cava: {
    temperature: "sparkling-chilled",
    glassware: "champagne-flute",
    decanting: "no-decanting",
    cellaring: "short-term-aging",
    serving_notes: "NV 1–3 years; Reserva and Gran Reserva 3–10 years.",
  },
  rose: {
    temperature: "chilled",
    glassware: "white-wine-glass",
    decanting: "no-decanting",
    cellaring: "drink-now",
    serving_notes: "Serve chilled; drink within 1–2 years for freshness.",
  },
  "dry-rose": {
    temperature: "chilled",
    glassware: "white-wine-glass",
    decanting: "no-decanting",
    cellaring: "drink-now",
    serving_notes: "Serve well chilled.",
  },
  "provence-rose": {
    temperature: "chilled",
    glassware: "white-wine-glass",
    decanting: "no-decanting",
    cellaring: "drink-now",
    serving_notes: "Serve chilled; best enjoyed young.",
  },
  port: {
    temperature: "fortified-service",
    glassware: "dessert-wine-glass",
    decanting: "1-hour",
    cellaring: "long-term-aging",
    serving_notes:
      "55–60°F for Ruby; slightly cooler for White Port cocktails. Vintage Port benefits from decanting; Ruby and Tawny typically do not.",
  },
  madeira: {
    temperature: "fortified-service",
    glassware: "dessert-wine-glass",
    decanting: "no-decanting",
    cellaring: "long-term-aging",
    serving_notes: "55–65°F depending on sweetness; optional decant for older vintage.",
  },
  sherry: {
    temperature: "fortified-service",
    glassware: "white-wine-glass",
    decanting: "no-decanting",
    cellaring: "long-term-aging",
    serving_notes:
      "45–55°F for Fino/Manzanilla; slightly warmer for Oloroso. Serve Fino fresh and chilled.",
  },
  moscato: {
    temperature: "ice-cold",
    glassware: "dessert-wine-glass",
    decanting: "no-decanting",
    cellaring: "drink-now",
    serving_notes: "Serve very chilled; drink young.",
  },
};

const SERVING_FIELDS = ["temperature", "glassware", "decanting", "cellaring"];
const LEGACY_FIELDS = ["serving_temperature", "glassware", "decanting", "aging"];

function main() {
  if (!fs.existsSync(SERVING_CATALOG)) {
    console.error("✗ Missing wine-serving-catalog.json — run bootstrap-wine-serving-catalog.js first");
    process.exit(1);
  }

  const styleCatalog = JSON.parse(fs.readFileSync(STYLE_CATALOG, "utf8"));
  const servingCatalog = JSON.parse(fs.readFileSync(SERVING_CATALOG, "utf8"));
  const validSlugs = new Set(servingCatalog.entities.map((e) => e.slug));

  const unmapped = [];
  const invalidRefs = [];
  let stylesMigrated = 0;

  for (const style of styleCatalog.styles) {
    const mapping = STYLE_SERVING[style.slug];
    if (!mapping) {
      unmapped.push(style.slug);
      continue;
    }

    for (const field of SERVING_FIELDS) {
      const slug = mapping[field];
      if (!slug || !validSlugs.has(slug)) {
        invalidRefs.push(`${style.slug}.${field} → "${slug ?? "(missing)"}"`);
      }
    }

    const serving = {
      temperature: mapping.temperature,
      glassware: mapping.glassware,
      decanting: mapping.decanting,
      cellaring: mapping.cellaring,
    };

    if (mapping.serving_notes) {
      style.serving_notes = mapping.serving_notes;
    } else {
      delete style.serving_notes;
    }

    for (const field of LEGACY_FIELDS) {
      delete style[field];
    }

    style.serving = serving;
    stylesMigrated += 1;
  }

  if (unmapped.length) {
    console.error("✗ Unmapped styles:");
    for (const slug of unmapped) console.error(`  - ${slug}`);
    process.exit(1);
  }

  if (invalidRefs.length) {
    console.error("✗ Invalid serving slug references:");
    for (const ref of invalidRefs) console.error(`  - ${ref}`);
    process.exit(1);
  }

  styleCatalog.meta = {
    ...styleCatalog.meta,
    serving_slugs_migrated: new Date().toISOString().slice(0, 10),
    phase: "ONTOLOGY-01C",
  };

  fs.writeFileSync(STYLE_CATALOG, JSON.stringify(styleCatalog, null, 2) + "\n");

  const totalStyles = styleCatalog.styles.length;
  console.log(`Migrated serving fields in ${stylesMigrated}/${totalStyles} wine styles`);
  console.log(`✓ All ${stylesMigrated} styles reference valid wine-serving-catalog slugs`);
}

main();
