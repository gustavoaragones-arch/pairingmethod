#!/usr/bin/env node
/**
 * ONTOLOGY-03D — Protein food internal links (domain wrapper).
 */

import { getDomainConfig } from "../lib/food-domain-config.js";
import { generateProteinFoodLinks, runLinksStage } from "../lib/food-publication/links.js";

const domain = getDomainConfig("protein");

export { generateProteinFoodLinks };

const isMain =
  process.argv[1] && new URL(import.meta.url).pathname === new URL(`file://${process.argv[1]}`).pathname;

if (isMain) {
  runLinksStage(domain);
}
