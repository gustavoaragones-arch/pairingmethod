#!/usr/bin/env node
/** FOOD-09F — Fruit internal link generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runLinksStage } from "../lib/food-publication/links.js";
runLinksStage(getDomainConfig("fruit"));
