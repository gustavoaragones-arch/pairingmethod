#!/usr/bin/env node
/** FOOD-07F — Herb & Spice search index generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSearchStage } from "../lib/food-publication/search.js";
runSearchStage(getDomainConfig("herb-spice"));
