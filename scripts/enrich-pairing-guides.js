/**
 * KNOWLEDGE-04 — Inject taxonomy sections into high-intent pairing guides.
 * Run: node scripts/enrich-pairing-guides.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WINES } from "../assets/js/pairing-data.js";
import { buildKnowledgeGraph } from "../lib/taxonomy-graph.js";
import { loadPairingGuideCatalog, buildPairingGuideContext } from "../lib/taxonomy-pairing.js";
import {
  renderPairingWhySection,
  renderPairingRelatedSection,
} from "../lib/taxonomy-pairing-render.js";
import { loadTaxonomy } from "../lib/taxonomy.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const MARKER_START = "<!-- KNOWLEDGE-04:TAXONOMY-START -->";
const MARKER_END = "<!-- KNOWLEDGE-04:TAXONOMY-END -->";

function injectTaxonomyBlock(html, block) {
  const wrapped = `${MARKER_START}\n${block}\n${MARKER_END}`;
  if (html.includes(MARKER_START)) {
    const start = html.indexOf(MARKER_START);
    const end = html.indexOf(MARKER_END);
    if (end < 0) throw new Error("Missing KNOWLEDGE-04:TAXONOMY-END marker");
    return html.slice(0, start) + wrapped + html.slice(end + MARKER_END.length);
  }

  const anchor = '<section aria-label="Why these wines work">';
  const idx = html.indexOf(anchor);
  if (idx >= 0) {
    return html.slice(0, idx) + wrapped + "\n\n      " + html.slice(idx);
  }

  const engineAnchor = '<section id="engine-enhancement"';
  const eidx = html.indexOf(engineAnchor);
  if (eidx >= 0) {
    return html.slice(0, eidx) + wrapped + "\n\n      " + html.slice(eidx);
  }

  throw new Error("No injection anchor found");
}

function main() {
  const taxonomy = loadTaxonomy();
  const graph = buildKnowledgeGraph({ taxonomy, WINES, root: ROOT });
  const catalog = loadPairingGuideCatalog();
  let count = 0;

  for (const slug of Object.keys(catalog.guides)) {
    const file = path.join(ROOT, `${slug}.html`);
    if (!fs.existsSync(file)) {
      console.warn(`Skip missing: ${slug}.html`);
      continue;
    }

    const ctx = buildPairingGuideContext(slug, { taxonomy, graph, WINES, catalog });
    if (!ctx) continue;

    const whyHtml = renderPairingWhySection(taxonomy, ctx);
    const relatedHtml = renderPairingRelatedSection(ctx);
    const block = [whyHtml, relatedHtml].filter(Boolean).join("\n\n");

    let html = fs.readFileSync(file, "utf8");
    html = injectTaxonomyBlock(html, block);
    fs.writeFileSync(file, html, "utf8");
    count += 1;
    console.log(`  Enriched ${slug}.html`);
  }

  console.log(`Enriched ${count} high-intent pairing guides`);
}

main();
