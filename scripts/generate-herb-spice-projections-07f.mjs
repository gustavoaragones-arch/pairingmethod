#!/usr/bin/env node
/** FOOD-07F — Herb & Spice projection generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runProjectionsStage } from "../lib/food-publication/projections.js";
runProjectionsStage(getDomainConfig("herb-spice"));
