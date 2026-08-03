#!/usr/bin/env node
/** FOOD-12F — Sweet Flavor projections generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runProjectionsStage } from "../lib/food-publication/projections.js";
runProjectionsStage(getDomainConfig("sweet-flavor"));
