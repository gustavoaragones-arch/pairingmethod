#!/usr/bin/env node
/** FOOD-08F — Grain & Starch schema generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSchemaStage } from "../lib/food-publication/schema.js";
runSchemaStage(getDomainConfig("grain-starch"));
