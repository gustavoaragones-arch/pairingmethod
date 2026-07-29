#!/usr/bin/env node
/** FOOD-11F — Legume links generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runLinksStage } from "../lib/food-publication/links.js";
runLinksStage(getDomainConfig("legume"));
