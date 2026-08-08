#!/usr/bin/env node
/** FOOD-13F — Sauce & Condiment pages generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runPagesStage } from "../lib/food-publication/pages.js";
runPagesStage(getDomainConfig("sauce-condiment"));
