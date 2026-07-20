#!/usr/bin/env node
/** FOOD-08F — Grain & Starch internal link generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runLinksStage } from "../lib/food-publication/links.js";
runLinksStage(getDomainConfig("grain-starch"));
