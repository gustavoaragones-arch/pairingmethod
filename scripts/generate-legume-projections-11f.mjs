#!/usr/bin/env node
/** FOOD-11F — Legume projections generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runProjectionsStage } from "../lib/food-publication/projections.js";
runProjectionsStage(getDomainConfig("legume"));
