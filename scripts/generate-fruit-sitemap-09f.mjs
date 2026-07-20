#!/usr/bin/env node
/** FOOD-09F — Fruit sitemap generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSitemapStage } from "../lib/food-publication/sitemap.js";
runSitemapStage(getDomainConfig("fruit"));
