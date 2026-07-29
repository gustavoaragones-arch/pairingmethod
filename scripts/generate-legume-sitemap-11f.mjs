#!/usr/bin/env node
/** FOOD-11F — Legume sitemap generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSitemapStage } from "../lib/food-publication/sitemap.js";
runSitemapStage(getDomainConfig("legume"));
