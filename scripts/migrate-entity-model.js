/**
 * KNOWLEDGE-05 — Add entity_type + domain to all taxonomy nodes.
 * Run once: node scripts/migrate-entity-model.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  ENTITY_TYPES,
  normalizeEntityFields,
  SUPPORTED_ENTITY_TYPES,
} from "../lib/entity-model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TAXONOMY_PATH = path.join(__dirname, "..", "data", "wine-taxonomy.json");

function main() {
  const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, "utf8"));
  let migrated = 0;

  for (const [slug, node] of Object.entries(taxonomy.nodes)) {
    const before = JSON.stringify({ entity_type: node.entity_type, domain: node.domain });
    taxonomy.nodes[slug] = normalizeEntityFields(node);
    const after = JSON.stringify({
      entity_type: taxonomy.nodes[slug].entity_type,
      domain: taxonomy.nodes[slug].domain,
    });
    if (before !== after) migrated += 1;
  }

  taxonomy.meta = {
    ...taxonomy.meta,
    version: "2.0.0",
    phase: "KNOWLEDGE-05",
    ontology: "entity_graph",
    updated: new Date().toISOString().slice(0, 10),
    entity_model: {
      structural_types: ["category", "group", "descriptor", "entity"],
      supported_entity_types: [...SUPPORTED_ENTITY_TYPES],
      domains: ["wine", "culinary", "shared"],
    },
    graph_integration:
      "KNOWLEDGE-05 — entity-centric ontology; descriptor graph is one wine-domain subgraph",
  };

  // Retire type-based future list in favor of entity_type
  delete taxonomy.meta.supported_node_types;

  fs.writeFileSync(TAXONOMY_PATH, `${JSON.stringify(taxonomy, null, 2)}\n`);

  console.log(`Migrated ${migrated} nodes with entity_type + domain`);
  console.log(`Entity types: descriptor_category, descriptor_group, descriptor (${Object.keys(taxonomy.nodes).length} nodes total)`);
  console.log(`Ready for KNOWLEDGE-05A wine_style entities`);
}

main();
