#!/usr/bin/env node
/** FOOD-11F — Legume schema generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSchemaStage } from "../lib/food-publication/schema.js";
runSchemaStage(getDomainConfig("legume"));
