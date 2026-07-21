#!/usr/bin/env node
/** FOOD-10F — Nut & Seed internal link generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runLinksStage } from "../lib/food-publication/links.js";
runLinksStage(getDomainConfig("nut-seed"));
