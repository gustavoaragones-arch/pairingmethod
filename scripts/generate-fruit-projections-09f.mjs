#!/usr/bin/env node
/** FOOD-09F — Fruit projection generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runProjectionsStage } from "../lib/food-publication/projections.js";
runProjectionsStage(getDomainConfig("fruit"));
