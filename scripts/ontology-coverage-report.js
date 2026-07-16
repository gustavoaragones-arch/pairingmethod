/**
 * ONTOLOGY-01B — Ontology coverage dashboard + graph maturity report.
 * Run: node scripts/ontology-coverage-report.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadTaxonomy } from "../lib/taxonomy.js";
import { listDescriptorNodes } from "../lib/taxonomy-descriptor.js";
import { loadGrapeCatalog } from "../lib/taxonomy-grape.js";
import { listWineStyleEntries } from "../lib/taxonomy-wine-style.js";
import { listWineRegionEntries } from "../lib/taxonomy-wine-region.js";
import { listWineServingEntries } from "../lib/taxonomy-wine-serving.js";
import { listWinemakingTechniqueEntries } from "../lib/taxonomy-winemaking-technique.js";
import { listWineFaultEntries } from "../lib/taxonomy-wine-fault.js";
import { computeGraphMaturity, validateGraphEdges } from "../lib/graph-maturity.js";
import { ENTITY_TYPES } from "../lib/entity-model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORT_OUT = path.join(ROOT, "reports", "ontology-coverage.json");
const STYLES_DIR = path.join(ROOT, "styles");
const REGIONS_DIR = path.join(ROOT, "regions");
const SERVING_DIR = path.join(ROOT, "serving");
const TECHNIQUES_DIR = path.join(ROOT, "techniques");
const FAULTS_DIR = path.join(ROOT, "faults");
const SITEMAP = path.join(ROOT, "sitemap.xml");

const TARGETS = {
  descriptors: 187,
  categories: 12,
  groups: 10,
  grape_varieties: 5,
  wine_styles_tier1: 28,
  wine_regions_tier1: 45,
  wine_serving: 40,
  wine_faults: 30,
  winemaking_techniques: 60,
};

function countGroups(taxonomy) {
  return Object.values(taxonomy.nodes).filter((n) => n.type === "group").length;
}

function countGeneratedPages(dir) {
  if (!fs.existsSync(dir)) return 0;
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(dir, d.name, "index.html")))
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
  const regions = listWineRegionEntries().length;
  const servings = listWineServingEntries().length;
  const techniques = listWinemakingTechniqueEntries().length;
  const faults = listWineFaultEntries().length;
  const stylePages = countGeneratedPages(STYLES_DIR);
  const regionPages = countGeneratedPages(REGIONS_DIR);
  const servingPages = countGeneratedPages(SERVING_DIR);
  const techniquePages = countGeneratedPages(TECHNIQUES_DIR);
  const faultPages = countGeneratedPages(FAULTS_DIR);
  const graphMaturity = computeGraphMaturity(taxonomy);
  const brokenEdges = validateGraphEdges(taxonomy);

  graphMaturity.broken_graph_edges = brokenEdges.length;

  const rows = [
    { domain: "Wine", entity_type: "Descriptor", target: TARGETS.descriptors, current: descriptors, status: status(descriptors, TARGETS.descriptors) },
    { domain: "Wine", entity_type: "Category", target: TARGETS.categories, current: categories, status: status(categories, TARGETS.categories) },
    { domain: "Wine", entity_type: "Hierarchy (Group)", target: TARGETS.groups, current: groups, status: status(groups, TARGETS.groups) },
    { domain: "Wine", entity_type: "Grape Variety", target: TARGETS.grape_varieties, current: grapes, status: status(grapes, TARGETS.grape_varieties) },
    { domain: "Wine", entity_type: "Wine Style (Tier 1)", target: TARGETS.wine_styles_tier1, current: styles, pages: stylePages, status: status(styles, TARGETS.wine_styles_tier1) },
    { domain: "Wine", entity_type: "Wine Region (Tier 1)", target: TARGETS.wine_regions_tier1, current: regions, pages: regionPages, status: status(regions, TARGETS.wine_regions_tier1) },
    { domain: "Wine", entity_type: "Serving & Service", target: TARGETS.wine_serving, current: servings, pages: servingPages, status: status(servings, TARGETS.wine_serving) },
    { domain: "Wine", entity_type: "Wine Fault", target: TARGETS.wine_faults, current: faults, pages: faultPages, status: status(faults, TARGETS.wine_faults) },
    { domain: "Wine", entity_type: "Winemaking Technique", target: TARGETS.winemaking_techniques, current: techniques, pages: techniquePages, status: status(techniques, TARGETS.winemaking_techniques) },
    { domain: "Culinary", entity_type: "Protein", target: null, current: 0, status: "planned" },
    { domain: "Culinary", entity_type: "Cooking Method", target: null, current: 0, status: "planned" },
    { domain: "Culinary", entity_type: "Ingredient", target: null, current: 0, status: "planned" },
  ];

  const report = {
    generated_at: new Date().toISOString(),
    phase: "ONTOLOGY-01E",
    ontology_version: taxonomy.meta?.version ?? "unknown",
    wine_ontology_version: JSON.parse(
      fs.readFileSync(path.join(ROOT, "data", "wine-fault-catalog.json"), "utf8")
    ).meta?.wine_ontology_version ?? "unknown",
    supported_entity_types: taxonomy.meta?.entity_model?.supported_entity_types ?? ENTITY_TYPES,
    dashboard: rows,
    graph_maturity: graphMaturity,
    sitemap: {
      total: sitemapCount(/.+/),
      region_urls: sitemapCount(/\/regions\/[a-z0-9-]+\/$/),
      serving_urls: sitemapCount(/\/serving\/[a-z0-9-]+\/$/),
      technique_urls: sitemapCount(/\/techniques\/[a-z0-9-]+\/$/),
      fault_urls: sitemapCount(/\/faults\/[a-z0-9-]+\/$/),
      style_urls: sitemapCount(/\/styles\/[a-z0-9-]+\/$/),
      descriptor_urls: sitemapCount(/\/terms\/[a-z0-9-]+$/),
      category_urls: sitemapCount(/\/terms\/[a-z0-9-]+\/$/),
    },
  };

  fs.mkdirSync(path.dirname(REPORT_OUT), { recursive: true });
  fs.writeFileSync(REPORT_OUT, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const semanticOut = path.join(ROOT, "reports", "semantic-relationship-summary.json");
  fs.writeFileSync(
    semanticOut,
    `${JSON.stringify(
      {
        generated_at: report.generated_at,
        phase: report.phase,
        canonical_relationship_types: graphMaturity.semantic_relationships?.canonical_relationship_types,
        ...graphMaturity.semantic_relationships,
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const evidenceOut = path.join(ROOT, "reports", "relationship-evidence-summary.json");
  fs.writeFileSync(
    evidenceOut,
    `${JSON.stringify(
      {
        generated_at: report.generated_at,
        phase: report.phase,
        relationships_with_evidence: graphMaturity.semantic_relationships?.relationships_with_evidence,
        relationships_without_evidence: graphMaturity.semantic_relationships?.relationships_without_evidence,
        evidence_coverage_pct: graphMaturity.semantic_relationships?.evidence_coverage_pct,
        confidence_distribution: graphMaturity.semantic_relationships?.confidence_distribution,
        most_cited_reason_entities: graphMaturity.semantic_relationships?.most_cited_reason_entities,
        evidence_benchmark: graphMaturity.semantic_relationships?.evidence_benchmark,
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  console.log("Ontology Coverage Report");
  console.log("========================");
  console.log("Domain\tEntity Type\tTarget\tCurrent\tStatus");
  for (const row of rows) {
    const target = row.target ?? "—";
    const current = row.pages !== undefined ? `${row.current} (${row.pages} pages)` : row.current;
    console.log(`${row.domain}\t${row.entity_type}\t${target}\t${current}\t${row.status}`);
  }
  console.log("\nGraph Maturity");
  console.log("--------------");
  console.log(`Total entities:              ${graphMaturity.total_entities}`);
  console.log(`Total relationships:         ${graphMaturity.total_relationships}`);
  console.log(`Avg relationships/entity:    ${graphMaturity.average_relationships_per_entity}`);
  console.log(`Entities with FAQ:           ${graphMaturity.entities_with_faq}`);
  console.log(`Entities with structured data: ${graphMaturity.entities_with_structured_data}`);
  console.log(`Style→region links:          ${graphMaturity.reverse_relationship_coverage.style_to_region_links}`);
  console.log(`Region→style reverse:        ${graphMaturity.reverse_relationship_coverage.region_to_style_reverse}`);
  console.log(`Style→serving links:         ${graphMaturity.reverse_relationship_coverage.style_to_serving_links}`);
  console.log(`Serving→style links:         ${graphMaturity.reverse_relationship_coverage.serving_to_style_links}`);
  console.log(`Serving→descriptor links:    ${graphMaturity.reverse_relationship_coverage.serving_to_descriptor_links}`);
  console.log(`Serving→region links:        ${graphMaturity.reverse_relationship_coverage.serving_to_region_links}`);
  console.log(`Serving→grape links:         ${graphMaturity.reverse_relationship_coverage.serving_to_grape_links}`);
  console.log(`Fully connected (≥5 edges):  ${graphMaturity.fully_connected_entities_pct}%`);
  console.log(`Orphan entities:             ${graphMaturity.orphan_entities}`);
  console.log(`Broken graph edges:          ${graphMaturity.broken_graph_edges}`);
  if (graphMaturity.semantic_relationships) {
    const sr = graphMaturity.semantic_relationships;
    console.log("\nSemantic Relationships");
    console.log("----------------------");
    console.log(`Canonical relationship types: ${sr.canonical_relationship_types}`);
    console.log(`Typed edges (explicit):       ${sr.explicit_typed_edges}`);
    console.log(`Typed edges (+ inferred rev): ${sr.total_edges_with_inferred_reverse}`);
    console.log(`Anonymous edges remaining:    ${sr.anonymous_edges_remaining}`);
    console.log(`Graph density (typed/entity): ${sr.graph_density}`);
    console.log(`Traversal benchmark:          ${sr.traversal_benchmark.ms_per_lookup} ms/lookup`);
    console.log("Top relationship types:");
    for (const row of sr.most_common_relationships.slice(0, 5)) {
      console.log(`  ${row.type.padEnd(28)} ${row.count}`);
    }
    if (sr.relationships_with_evidence !== undefined) {
      console.log("\nRelationship Evidence");
      console.log("---------------------");
      console.log(`With evidence:               ${sr.relationships_with_evidence}`);
      console.log(`Without evidence:            ${sr.relationships_without_evidence}`);
      console.log(`Evidence coverage:           ${sr.evidence_coverage_pct}%`);
      console.log(`Confidence high/medium/low:    ${sr.confidence_distribution?.high ?? 0}/${sr.confidence_distribution?.medium ?? 0}/${sr.confidence_distribution?.low ?? 0}`);
      if (sr.most_cited_reason_entities?.length) {
        console.log(`Top cited reason entity:     ${sr.most_cited_reason_entities[0].slug} (${sr.most_cited_reason_entities[0].count})`);
      }
    }
  }
  console.log(`\nFull report → ${path.relative(ROOT, REPORT_OUT)}`);
}

main();
