#!/usr/bin/env node
/** FOOD-05F — Vegetable page model generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runPagesStage } from "../lib/food-publication/pages.js";
runPagesStage(getDomainConfig("vegetable"));
