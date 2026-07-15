/**
 * KNOWLEDGE-03 — Knowledge graph coverage baseline report.
 * Run: node scripts/knowledge-graph-coverage-report.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  collectCategoryDescriptors,
  countInternalRelationships,
  loadTaxonomy,
} from "../lib/taxonomy.js";
import { listDescriptorNodes } from "../lib/taxonomy-descriptor.js";
import { countInternalLinks } from "../lib/taxonomy-descriptor-render.js";
import { publicPath, termUrl } from "../lib/public-url.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TERMS_DIR = path.join(ROOT, "terms");
const SITEMAP = path.join(ROOT, "sitemap.xml");
const REPORT_OUT = path.join(ROOT, "reports", "knowledge-graph-coverage.json");

function countNodesByType(taxonomy) {
  const counts = { category: 0, group: 0, descriptor: 0, other: 0 };
  for (const node of Object.values(taxonomy.nodes)) {
    if (counts[node.type] !== undefined) counts[node.type] += 1;
    else counts.other += 1;
  }
  return counts;
}

function totalSemanticRelationships(taxonomy) {
  let n = 0;
  for (const node of Object.values(taxonomy.nodes)) {
    n += (node.related_terms ?? []).length;
    n += (node.opposite_terms ?? []).length;
    n += (node.children ?? []).length;
    if (node.parent) n += 1;
    if (node.scale?.previous) n += 1;
    if (node.scale?.next) n += 1;
  }
  return n;
}

function ontologyGaps(taxonomy) {
  const gaps = [];
  for (const desc of listDescriptorNodes(taxonomy)) {
    if (!desc.definition?.trim()) gaps.push({ slug: desc.slug, issue: "missing definition" });
    if (!(desc.related_terms?.length || desc.opposite_terms?.length || desc.parent)) {
      gaps.push({ slug: desc.slug, issue: "isolated node (no parent/related/opposite)" });
    }
  }
  return gaps.slice(0, 25);
}

function sitemapStats() {
  if (!fs.existsSync(SITEMAP)) return { total: 0, descriptorUrls: 0, categoryUrls: 0 };
  const xml = fs.readFileSync(SITEMAP, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return {
    total: locs.length,
    descriptorUrls: locs.filter((u) => /\/terms\/[a-z0-9-]+$/.test(u)).length,
    categoryUrls: locs.filter((u) => /\/terms\/[a-z0-9-]+\/$/.test(u)).length,
  };
}

function main() {
  const taxonomy = loadTaxonomy();
  const descriptors = listDescriptorNodes(taxonomy);
  const typeCounts = countNodesByType(taxonomy);

  let descriptorPages = 0;
  let linkTotal = 0;
  for (const d of descriptors) {
    const file = path.join(TERMS_DIR, `${d.slug}.html`);
    if (!fs.existsSync(file)) continue;
    descriptorPages += 1;
    linkTotal += countInternalLinks(fs.readFileSync(file, "utf8"));
  }

  const categoryPages = taxonomy.categories.filter((c) =>
    fs.existsSync(path.join(TERMS_DIR, c.slug, "index.html"))
  ).length;

  const report = {
    generated_at: new Date().toISOString(),
    phase: "KNOWLEDGE-03",
    taxonomy: {
      total_nodes: Object.keys(taxonomy.nodes).length,
      category_nodes: typeCounts.category,
      hierarchy_nodes: typeCounts.group,
      descriptor_nodes: typeCounts.descriptor,
      ordered_scales: taxonomy.scales.length,
    },
    pages: {
      generated_descriptor_pages: descriptorPages,
      generated_category_pages: categoryPages,
      expected_descriptor_pages: descriptors.length,
    },
    relationships: {
      total_semantic_relationships: totalSemanticRelationships(taxonomy),
      per_category_internal_edges: Object.fromEntries(
        taxonomy.categories.map((c) => [
          c.slug,
          countInternalRelationships(taxonomy, c.slug),
        ])
      ),
    },
    linking: {
      average_internal_links_per_descriptor_page:
        descriptorPages > 0 ? Number((linkTotal / descriptorPages).toFixed(1)) : 0,
    },
    sitemap: sitemapStats(),
    ontology_gaps: ontologyGaps(taxonomy),
  };

  fs.mkdirSync(path.dirname(REPORT_OUT), { recursive: true });
  fs.writeFileSync(REPORT_OUT, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("Knowledge Graph Coverage Report");
  console.log("==============================");
  console.log(`Total taxonomy nodes:        ${report.taxonomy.total_nodes}`);
  console.log(`Category nodes:              ${report.taxonomy.category_nodes}`);
  console.log(`Hierarchy (group) nodes:     ${report.taxonomy.hierarchy_nodes}`);
  console.log(`Descriptor nodes:            ${report.taxonomy.descriptor_nodes}`);
  console.log(`Ordered scales:              ${report.taxonomy.ordered_scales}`);
  console.log(`Generated descriptor pages:  ${report.pages.generated_descriptor_pages}`);
  console.log(`Generated category pages:    ${report.pages.generated_category_pages}`);
  console.log(`Total semantic relationships:  ${report.relationships.total_semantic_relationships}`);
  console.log(
    `Avg internal links/descriptor: ${report.linking.average_internal_links_per_descriptor_page}`
  );
  console.log(`Sitemap URLs (total):        ${report.sitemap.total}`);
  console.log(`Sitemap descriptor URLs:     ${report.sitemap.descriptorUrls}`);
  console.log(`Sitemap category URLs:       ${report.sitemap.categoryUrls}`);
  if (report.ontology_gaps.length) {
    console.log(`Remaining ontology gaps:     ${report.ontology_gaps.length} (sample in report)`);
  } else {
    console.log("Remaining ontology gaps:     none flagged");
  }
  console.log(`\nFull report → ${path.relative(ROOT, REPORT_OUT)}`);
}

main();
