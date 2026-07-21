#!/usr/bin/env node
/** FOOD-10F — Nut & Seed sitemap generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSitemapStage } from "../lib/food-publication/sitemap.js";
runSitemapStage(getDomainConfig("nut-seed"));
