#!/usr/bin/env node
/** FOOD-12F — Sweet Flavor pages generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runPagesStage } from "../lib/food-publication/pages.js";
runPagesStage(getDomainConfig("sweet-flavor"));
