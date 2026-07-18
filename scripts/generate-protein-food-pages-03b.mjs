#!/usr/bin/env node
/**
 * ONTOLOGY-03B — Protein food page view models (domain wrapper).
 */

import { getDomainConfig } from "../lib/food-domain-config.js";
import { generatePageModels, runPagesStage } from "../lib/food-publication/pages.js";

const domain = getDomainConfig("protein");

export function generateProteinFoodPageModels(projections) {
  const generated = generatePageModels(domain, projections);
  return {
    meta: generated.meta,
    foodPages: generated.leafPages,
    groupPages: generated.groupPages,
    categoryPages: generated.categoryPages,
    indexes: generated.indexes,
    projectionCounts: {
      foods: generated.projectionCounts.leaf,
      groups: generated.projectionCounts.groups,
      categories: generated.projectionCounts.categories,
    },
  };
}

const isMain =
  process.argv[1] && new URL(import.meta.url).pathname === new URL(`file://${process.argv[1]}`).pathname;

if (isMain) {
  runPagesStage(domain);
}
