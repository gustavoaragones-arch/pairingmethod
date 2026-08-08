#!/usr/bin/env node
/** FOOD-13F — Sauce & Condiment schema generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSchemaStage } from "../lib/food-publication/schema.js";
runSchemaStage(getDomainConfig("sauce-condiment"));
