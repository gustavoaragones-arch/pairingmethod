#!/usr/bin/env node
/** FOOD-11F — Legume search-index generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSearchStage } from "../lib/food-publication/search.js";
runSearchStage(getDomainConfig("legume"));
