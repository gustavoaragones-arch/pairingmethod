/**
 * ONTOLOGY-01B — Migrate wine-style-catalog typical_regions to region slugs.
 * Run: node scripts/migrate-style-region-slugs.js
 *
 * Reads data/wine-style-catalog.json and data/wine-region-catalog.json,
 * replaces human-readable region labels with catalog slugs.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const STYLE_CATALOG = path.join(ROOT, "data", "wine-style-catalog.json");
const REGION_CATALOG = path.join(ROOT, "data", "wine-region-catalog.json");

/** Human-readable labels from ONTOLOGY-01A style catalog → wine-region-catalog slugs. */
const REGION_LABEL_TO_SLUG = {
  "Alsace (France)": "alsace",
  "Alto Adige (Italy)": "italy",
  Asti: "piedmont",
  Australia: "australia",
  "Australia (Clare Valley)": "clare-valley",
  Austria: "austria",
  Bandol: "provence",
  "Barossa Valley (Australia)": "barossa-valley",
  "Bordeaux (France)": "bordeaux",
  "Bordeaux Right Bank (France)": "bordeaux",
  "Burgundy (France)": "burgundy",
  "Cahors (France)": "cahors",
  California: "usa",
  "California (USA)": "usa",
  "Champagne (France)": "champagne",
  Chile: "chile",
  "Condrieu (France)": "rhone-valley",
  "Coonawarra (Australia)": "coonawarra",
  "Côtes de Provence": "provence",
  "Douro Valley (Portugal)": "douro",
  "El Puerto de Santa María": "jerez",
  "Emilia-Romagna": "italy",
  "Friuli-Venezia Giulia": "veneto",
  Italy: "italy",
  "Jerez (Spain)": "jerez",
  "Languedoc (France)": "france",
  Lodi: "usa",
  "Loire (France)": "loire-valley",
  "Loire Valley (France)": "loire-valley",
  "Lombardy (Valtellina)": "italy",
  "Madeira (Portugal)": "madeira",
  "Marlborough (New Zealand)": "marlborough",
  "Mendoza (Argentina)": "mendoza",
  "Mosel (Germany)": "mosel",
  "Napa Valley (USA)": "napa-valley",
  "New Zealand": "new-zealand",
  "Northern Rhône (France)": "rhone-valley",
  Oregon: "willamette-valley",
  "Other Spanish DOs": "spain",
  "Penedès (Spain)": "penedes",
  "Piedmont (Italy)": "piedmont",
  "Portugal (as Touriga Nacional blends)": "portugal",
  "Priorat (Spain)": "priorat",
  "Provence (France)": "provence",
  "Puglia (Italy, as Primitivo)": "italy",
  "Ribera del Duero (Spain)": "ribera-del-duero",
  "Rioja (Spain)": "rioja",
  "Rías Baixas (Spain)": "rias-baixas",
  "Sanlúcar de Barrameda": "jerez",
  Sonoma: "sonoma",
  "Sonoma (USA)": "sonoma",
  "South Africa": "south-africa",
  "Southern Rhône (France)": "rhone-valley",
  Spain: "spain",
  "Tuscany (Italy)": "tuscany",
  "Veneto (Italy)": "veneto",
  "Veneto and Friuli (Italy)": "veneto",
  "Vinho Verde (Portugal)": "portugal",
  "Washington State": "usa",
};

function dedupeSlugs(slugs) {
  const seen = new Set();
  return slugs.filter((slug) => {
    if (seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
}

function main() {
  const styleCatalog = JSON.parse(fs.readFileSync(STYLE_CATALOG, "utf8"));
  const regionCatalog = JSON.parse(fs.readFileSync(REGION_CATALOG, "utf8"));
  const validSlugs = new Set(regionCatalog.regions.map((r) => r.slug));

  const unmapped = new Set();
  let migratedCount = 0;
  let stylesUpdated = 0;

  for (const style of styleCatalog.styles) {
    const original = style.typical_regions ?? [];
    const migrated = [];

    for (const label of original) {
      const slug = REGION_LABEL_TO_SLUG[label];
      if (!slug) {
        unmapped.add(label);
        continue;
      }
      if (!validSlugs.has(slug)) {
        console.error(`✗ Mapped slug "${slug}" for "${label}" not in region catalog`);
        process.exit(1);
      }
      migrated.push(slug);
      if (slug !== label) migratedCount += 1;
    }

    const deduped = dedupeSlugs(migrated);
    if (JSON.stringify(original) !== JSON.stringify(deduped)) {
      stylesUpdated += 1;
    }
    style.typical_regions = deduped;
  }

  if (unmapped.size) {
    console.error("✗ Unmapped region labels:");
    for (const label of [...unmapped].sort()) console.error(`  - ${label}`);
    process.exit(1);
  }

  styleCatalog.meta = {
    ...styleCatalog.meta,
    region_slugs_migrated: new Date().toISOString().slice(0, 10),
    phase: "ONTOLOGY-01B",
  };

  fs.writeFileSync(STYLE_CATALOG, JSON.stringify(styleCatalog, null, 2) + "\n");

  const totalStyles = styleCatalog.styles.length;
  console.log(`Updated typical_regions in ${stylesUpdated}/${totalStyles} wine styles`);
  console.log(`Migrated ${migratedCount} region label → slug references`);
  console.log(`✓ All ${totalStyles} styles use region slugs from wine-region-catalog.json`);
}

main();
