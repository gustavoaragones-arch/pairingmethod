#!/usr/bin/env node
/** FOOD-04F — Cheese JSON-LD schema. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSchemaStage } from "../lib/food-publication/schema.js";
runSchemaStage(getDomainConfig("cheese"));
