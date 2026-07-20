#!/usr/bin/env node
/** FOOD-07F — Herb & Spice page model generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runPagesStage } from "../lib/food-publication/pages.js";
runPagesStage(getDomainConfig("herb-spice"));
