#!/usr/bin/env node
/** FOOD-12F — Sweet Flavor internal links generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runLinksStage } from "../lib/food-publication/links.js";
runLinksStage(getDomainConfig("sweet-flavor"));
