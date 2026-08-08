#!/usr/bin/env node
/** FOOD-13F — Sauce & Condiment sitemap generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSitemapStage } from "../lib/food-publication/sitemap.js";
runSitemapStage(getDomainConfig("sauce-condiment"));
