#!/usr/bin/env node
/**
 * ONTOLOGY-03A — Protein food projection generator (domain wrapper).
 */

import { getDomainConfig } from "../lib/food-domain-config.js";
import { generateProjections, runProjectionsStage } from "../lib/food-publication/projections.js";

const domain = getDomainConfig("protein");

export function generateProteinFoodProjections(inputs) {
  const generated = generateProjections(domain, inputs);
  return {
    meta: generated.meta,
    foodProjections: generated.leafProjections,
    groupProjections: generated.groupProjections,
    categoryProjections: generated.categoryProjections,
    entitySets: {
      foodIds: generated.entitySets.leafIds,
      groupIds: generated.entitySets.groupIds,
      categoryIds: generated.entitySets.categoryIds,
    },
    relationshipRegistry: generated.relationshipRegistry,
    index: generated.index,
  };
}

const isMain =
  process.argv[1] && new URL(import.meta.url).pathname === new URL(`file://${process.argv[1]}`).pathname;

if (isMain) {
  runProjectionsStage(domain);
}
