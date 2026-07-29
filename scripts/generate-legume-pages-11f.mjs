#!/usr/bin/env node
/** FOOD-11F — Legume pages generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runPagesStage } from "../lib/food-publication/pages.js";
runPagesStage(getDomainConfig("legume"));
