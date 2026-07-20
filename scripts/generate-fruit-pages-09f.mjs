#!/usr/bin/env node
/** FOOD-09F — Fruit page model generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runPagesStage } from "../lib/food-publication/pages.js";
runPagesStage(getDomainConfig("fruit"));
