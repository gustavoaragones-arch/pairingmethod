#!/usr/bin/env node
/** FOOD-04F — Cheese page view models. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runPagesStage } from "../lib/food-publication/pages.js";
runPagesStage(getDomainConfig("cheese"));
