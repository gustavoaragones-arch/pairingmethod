#!/usr/bin/env node
/** FOOD-10F — Nut & Seed projection generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runProjectionsStage } from "../lib/food-publication/projections.js";
runProjectionsStage(getDomainConfig("nut-seed"));
