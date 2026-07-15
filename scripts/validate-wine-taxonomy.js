/**
 * Validate data/wine-taxonomy.json structure for KNOWLEDGE-01.
 * Run: node scripts/validate-wine-taxonomy.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TAXONOMY_PATH = path.join(__dirname, "..", "data", "wine-taxonomy.json");

const REQUIRED_NODE_FIELDS = [
  "id",
  "slug",
  "name",
  "type",
  "category",
  "parent",
  "children",
  "description",
  "definition",
  "examples",
  "related_terms",
  "opposite_terms",
  "associated_wines",
  "associated_foods",
  "associated_pairings",
  "search_aliases",
  "seo_title",
  "seo_description",
];

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function main() {
  if (!fs.existsSync(TAXONOMY_PATH)) {
    fail(`Missing ${TAXONOMY_PATH}. Run: npm run taxonomy:bootstrap`);
    return;
  }

  const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, "utf8"));
  const errors = [];

  if (!taxonomy.meta?.version) errors.push("meta.version required");
  if (!Array.isArray(taxonomy.categories) || taxonomy.categories.length < 12) {
    errors.push("Expected 12+ categories");
  }
  if (!Array.isArray(taxonomy.scales) || taxonomy.scales.length < 3) {
    errors.push("Expected body, acidity, tannin scales");
  }
  if (!taxonomy.nodes || typeof taxonomy.nodes !== "object") {
    errors.push("nodes object required");
  }

  const slugs = new Set(Object.keys(taxonomy.nodes ?? {}));

  for (const [slug, node] of Object.entries(taxonomy.nodes ?? {})) {
    if (node.slug !== slug) errors.push(`Slug key mismatch: ${slug}`);
    for (const field of REQUIRED_NODE_FIELDS) {
      if (!(field in node)) errors.push(`${slug}: missing ${field}`);
    }
    if (!["category", "group", "descriptor"].includes(node.type)) {
      errors.push(`${slug}: invalid type ${node.type}`);
    }
    for (const child of node.children ?? []) {
      if (!slugs.has(child)) errors.push(`${slug}: unknown child ${child}`);
    }
    if (node.parent && !slugs.has(node.parent)) {
      errors.push(`${slug}: unknown parent ${node.parent}`);
    }
    for (const rel of [...(node.related_terms ?? []), ...(node.opposite_terms ?? [])]) {
      if (!slugs.has(rel)) errors.push(`${slug}: unknown relation ${rel}`);
    }
    if (node.scale) {
      if (typeof node.scale.position !== "number") {
        errors.push(`${slug}: scale.position must be number`);
      }
    }
  }

  for (const cat of taxonomy.categories ?? []) {
    if (!slugs.has(cat.slug)) errors.push(`Category node missing: ${cat.slug}`);
  }

  if (errors.length) {
    for (const e of errors) fail(e);
    return;
  }

  ok(`${slugs.size} nodes validated`);
  ok(`${taxonomy.categories.length} categories`);
  ok(`${taxonomy.scales.length} scales`);
  ok("All required fields present");
  ok("Parent/child graph consistent");
}

main();
