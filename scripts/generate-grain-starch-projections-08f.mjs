#!/usr/bin/env node
/** FOOD-08F — Grain & Starch projection generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runProjectionsStage } from "../lib/food-publication/projections.js";
runProjectionsStage(getDomainConfig("grain-starch"));
