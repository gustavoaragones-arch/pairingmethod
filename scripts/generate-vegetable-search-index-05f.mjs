#!/usr/bin/env node
/** FOOD-05F — Vegetable search index generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSearchStage } from "../lib/food-publication/search.js";
runSearchStage(getDomainConfig("vegetable"));
