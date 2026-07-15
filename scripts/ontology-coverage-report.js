/**
 * ONTOLOGY-01A — Ontology coverage dashboard report.
 * Run: node scripts/ontology-coverage-report.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listDescriptorNodes } from "../lib/taxonomy-descriptor.js";
import { loadGrapeCatalog } from "../lib/taxonomy-grape.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { ENTITY_TYPES } from "../lib/entity-model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORT_OUT = path.join(ROOT, "reports", "ontology-coverage.json");
const STYLES_DIR = path.join(ROOT, "styles");
const TERMS_DIR = path.join(ROOT, "terms");
const GRAPES_DIR = path.join(ROOT, "grapes");
const SITEMAP = path.join(ROOT, "sitemap.xml");

const TARGETS = {
  descriptors: 187,
  categories: 12,
  groups: 10,
  grape_varieties: 5,
  wine_styles_tier1: 28,
  regions: 100,
  wine_faults: 20,
  winemaking_techniques: 30,
  serving: 20,
  glassware: 15,
};

function countGroups(taxonomy) {
  return Object.values(taxonomy.nodes).filter((n) => n.type === "group").length;
}

function countGeneratedStylePages() {
  if (!fs.existsSync(STYLES_DIR)) return 0;
  return fs
    .readdirSync(STYLES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(STYLES_DIR, d.name, "index.html")))
    .length;
}

function sitemapCount(pattern) {
  if (!fs.existsSync(SITEMAP)) return 0;
  const xml = fs.readFileSync(SITEMAP, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return locs.filter((u) => pattern.test(u)).length;
}

function status(current, target) {
  if (target === 0 || target === undefined) return "planned";
  if (current >= target) return "complete";
  if (current > 0) return "in_progress";
  return "pending";
}

function main() {
  const taxonomy = loadTaxonomy();
  const descriptors = listDescriptorNodes(taxonomy).length;
  const categories = taxonomy.categories.length;
  const groups = countGroups(taxonomy);
  const grapes = loadGrapeCatalog().grapes.length;
  const styles = listWineStyleEntries().length;
  const stylePages = countGeneratedStylePages();

  const rows = [
    {
      domain: "Wine",
      entity_type: "Descriptor",
      target: TARGETS.descriptors,
      current: descriptors,
      status: status(descriptors, TARGETS.descriptors),
    },
    {
      domain: "Wine",
      entity_type: "Category",
      target: TARGETS.categories,
      current: categories,
      status: status(categories, TARGETS.categories),
    },
    {
      domain: "Wine",
      entity_type: "Hierarchy (Group)",
      target: TARGETS.groups,
      current: groups,
      status: status(groups, TARGETS.groups),
    },
    {
      domain: "Wine",
      entity_type: "Grape Variety",
      target: TARGETS.grape_varieties,
      current: grapes,
      status: status(grapes, TARGETS.grape_varieties),
    },
    {
      domain: "Wine",
      entity_type: "Wine Style (Tier 1)",
      target: TARGETS.wine_styles_tier1,
      current: styles,
      pages: stylePages,
      status: status(styles, TARGETS.wine_styles_tier1),
    },
    {
      domain: "Wine",
      entity_type: "Region",
      target: TARGETS.regions,
      current: 0,
      status: "pending",
    },
    {
      domain: "Wine",
      entity_type: "Wine Fault",
      target: TARGETS.wine_faults,
      current: 0,
      status: "pending",
    },
    {
      domain: "Wine",
      entity_type: "Winemaking Technique",
      target: TARGETS.winemaking_techniques,
      current: 0,
      status: "pending",
    },
    {
      domain: "Wine",
      entity_type: "Serving & Storage",
      target: TARGETS.serving,
      current: 0,
      status: "pending",
    },
    {
      domain: "Wine",
      entity_type: "Glassware",
      target: TARGETS.glassware,
      current: 0,
      status: "pending",
    },
    { domain: "Culinary", entity_type: "Protein", target: null, current: 0, status: "planned" },
    { domain: "Culinary", entity_type: "Cooking Method", target: null, current: 0, status: "planned" },
    { domain: "Culinary", entity_type: "Ingredient", target: null, current: 0, status: "planned" },
  ];

  const report = {
    generated_at: new Date().toISOString(),
    phase: "ONTOLOGY-01A",
    ontology_version: taxonomy.meta?.version ?? "unknown",
    supported_entity_types: taxonomy.meta?.entity_model?.supported_entity_types ?? ENTITY_TYPES,
    dashboard: rows,
    sitemap: {
      total: sitemapCount(/.+/),
      style_urls: sitemapCount(/\/styles\/[a-z0-9-]+\/$/),
      descriptor_urls: sitemapCount(/\/terms\/[a-z0-9-]+$/),
      category_urls: sitemapCount(/\/terms\/[a-z0-9-]+\/$/),
    },
  };

  fs.mkdirSync(path.dirname(REPORT_OUT), { recursive: true });
  fs.writeFileSync(REPORT_OUT, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("Ontology Coverage Report");
  console.log("========================");
  console.log("Domain\tEntity Type\tTarget\tCurrent\tStatus");
  for (const row of rows) {
    const target = row.target ?? "—";
    const current = row.pages !== undefined ? `${row.current} (${row.pages} pages)` : row.current;
    console.log(`${row.domain}\t${row.entity_type}\t${target}\t${current}\t${row.status}`);
  }
  console.log(`\nFull report → ${path.relative(ROOT, REPORT_OUT)}`);
}

main();
