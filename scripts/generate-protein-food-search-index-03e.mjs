#!/usr/bin/env node
/**
 * ONTOLOGY-03E — Protein food search index (domain wrapper).
 */

import { getDomainConfig } from "../lib/food-domain-config.js";
import { generateProteinFoodSearchIndex, runSearchStage } from "../lib/food-publication/search.js";

const domain = getDomainConfig("protein");

export { generateProteinFoodSearchIndex };

const isMain =
  process.argv[1] && new URL(import.meta.url).pathname === new URL(`file://${process.argv[1]}`).pathname;

if (isMain) {
  runSearchStage(domain);
}
