#!/usr/bin/env node
/** FOOD-06F — Fungi search index generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSearchStage } from "../lib/food-publication/search.js";
runSearchStage(getDomainConfig("fungi"));
