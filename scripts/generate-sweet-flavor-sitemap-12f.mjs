#!/usr/bin/env node
/** FOOD-12F — Sweet Flavor sitemap generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSitemapStage } from "../lib/food-publication/sitemap.js";
runSitemapStage(getDomainConfig("sweet-flavor"));
