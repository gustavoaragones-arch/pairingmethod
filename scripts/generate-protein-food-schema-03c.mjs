#!/usr/bin/env node
/**
 * ONTOLOGY-03C — Protein food JSON-LD schema (domain wrapper).
 */

import { getDomainConfig } from "../lib/food-domain-config.js";
import { generateProteinFoodSchema, runSchemaStage } from "../lib/food-publication/schema.js";

const domain = getDomainConfig("protein");

export { generateProteinFoodSchema };

const isMain =
  process.argv[1] && new URL(import.meta.url).pathname === new URL(`file://${process.argv[1]}`).pathname;

if (isMain) {
  runSchemaStage(domain);
}
