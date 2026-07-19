#!/usr/bin/env node
/** FOOD-06F — Fungi projection generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runProjectionsStage } from "../lib/food-publication/projections.js";
runProjectionsStage(getDomainConfig("fungi"));
