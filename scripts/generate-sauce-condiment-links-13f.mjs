#!/usr/bin/env node
/** FOOD-13F — Sauce & Condiment internal links generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runLinksStage } from "../lib/food-publication/links.js";
runLinksStage(getDomainConfig("sauce-condiment"));
