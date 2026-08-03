#!/usr/bin/env node
/** FOOD-12F — Sweet Flavor search index generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSearchStage } from "../lib/food-publication/search.js";
runSearchStage(getDomainConfig("sweet-flavor"));
