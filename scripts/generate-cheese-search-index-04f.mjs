#!/usr/bin/env node
/** FOOD-04F — Cheese search index. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSearchStage } from "../lib/food-publication/search.js";
runSearchStage(getDomainConfig("cheese"));
