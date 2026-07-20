#!/usr/bin/env node
/** FOOD-07F — Fungi JSON-LD schema generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runSchemaStage } from "../lib/food-publication/schema.js";
runSchemaStage(getDomainConfig("herb-spice"));
