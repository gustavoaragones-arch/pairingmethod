#!/usr/bin/env node
/** FOOD-05F — Vegetable internal link generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runLinksStage } from "../lib/food-publication/links.js";
runLinksStage(getDomainConfig("vegetable"));
