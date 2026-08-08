#!/usr/bin/env node
/** FOOD-13F — Sauce & Condiment projections generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runProjectionsStage } from "../lib/food-publication/projections.js";
runProjectionsStage(getDomainConfig("sauce-condiment"));
