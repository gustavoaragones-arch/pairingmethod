/**
 * KNOWLEDGE-04 — Internal linking audit for knowledge graph health.
 * Run: node scripts/knowledge-graph-link-audit.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WINES, WINE_STYLE_SEMANTICS } from "../assets/js/pairing-data.js";
import { buildKnowledgeGraph, validateDescriptorSlugs } from "../lib/taxonomy-graph.js";
import { listDescriptorNodes } from "../lib/taxonomy-descriptor.js";
import { listGrapeCatalogEntries } from "../lib/taxonomy-grape.js";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { grapeUrl, pairingUrl, termUrl } from "../lib/public-url.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORT_OUT = path.join(ROOT, "reports", "knowledge-graph-link-audit.json");

function countEdges(map) {
  return Object.values(map).reduce((s, arr) => s + arr.length, 0);
}

function orphanDescriptors(taxonomy, graph) {
  const orphans = [];
  for (const d of listDescriptorNodes(taxonomy)) {
    const grapes = graph.reverse.descriptorToGrapes[d.slug]?.length ?? 0;
    const pairings = graph.reverse.descriptorToPairings[d.slug]?.length ?? 0;
    const rel =
      (d.related_terms?.length ?? 0) +
      (d.opposite_terms?.length ?? 0) +
      (d.parent ? 1 : 0);
    if (grapes === 0 && pairings === 0 && rel <= 1) {
      orphans.push(d.slug);
    }
  }
  return orphans;
}

function main() {
  const taxonomy = loadTaxonomy();
  const graph = buildKnowledgeGraph({ taxonomy, WINES, root: ROOT });

  const semanticMissing = validateDescriptorSlugs(taxonomy, [
    Object.values(WINE_STYLE_SEMANTICS).flatMap((s) => Object.values(s).flat()),
    WINES.flatMap((w) => Object.values(w.descriptors ?? {}).flat()),
  ]);

  const report = {
    generated_at: new Date().toISOString(),
    phase: "KNOWLEDGE-04",
    edges: {
      descriptor_to_grape: countEdges(graph.reverse.descriptorToGrapes),
      descriptor_to_pairing: countEdges(graph.reverse.descriptorToPairings),
      grape_to_descriptor: countEdges(graph.reverse.grapeToDescriptors),
      pairing_to_descriptor: countEdges(graph.reverse.pairingToDescriptors),
      grape_to_pairing: countEdges(graph.reverse.grapeToPairings),
      pairing_to_grape: countEdges(graph.reverse.pairingToGrapes),
    },
    graph_stats: graph.stats,
    orphan_descriptors: orphanDescriptors(taxonomy, graph),
    missing_taxonomy_slugs: semanticMissing,
    sample_links: {
      graphite: {
        grapes: (graph.reverse.descriptorToGrapes.graphite ?? []).map((g) => grapeUrl(g)),
        pairings: (graph.reverse.descriptorToPairings.graphite ?? []).map((p) => pairingUrl(p)),
      },
      cabernet: {
        descriptors: (graph.reverse.grapeToDescriptors["cabernet-sauvignon"] ?? []).map((s) =>
          termUrl(s)
        ),
        pairings: (graph.reverse.grapeToPairings["cabernet-sauvignon"] ?? []).map((p) =>
          pairingUrl(p)
        ),
      },
      steak: {
        descriptors: (graph.reverse.pairingToDescriptors["wine-with-steak"] ?? [])
          .slice(0, 8)
          .map((s) => termUrl(s)),
        grapes: (graph.reverse.pairingToGrapes["wine-with-steak"] ?? []).map((g) => grapeUrl(g)),
      },
    },
  };

  fs.mkdirSync(path.dirname(REPORT_OUT), { recursive: true });
  fs.writeFileSync(REPORT_OUT, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("Knowledge Graph Link Audit");
  console.log("==========================");
  console.log(`descriptor → grape links:    ${report.edges.descriptor_to_grape}`);
  console.log(`descriptor → pairing links:  ${report.edges.descriptor_to_pairing}`);
  console.log(`grape → descriptor links:    ${report.edges.grape_to_descriptor}`);
  console.log(`pairing → descriptor links:  ${report.edges.pairing_to_descriptor}`);
  console.log(`Average graph degree:        ${report.graph_stats.averageDegree}`);
  console.log(`Orphan descriptors:          ${report.orphan_descriptors.length}`);
  console.log(`Missing taxonomy slugs:      ${report.missing_taxonomy_slugs.length}`);
  console.log(`Strongest nodes:             ${report.graph_stats.strongestNodes
    .slice(0, 5)
    .map((n) => n.slug)
    .join(", ")}`);
  console.log(`\nFull report → ${path.relative(ROOT, REPORT_OUT)}`);
}

main();
