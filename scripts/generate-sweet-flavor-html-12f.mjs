#!/usr/bin/env node
/** FOOD-12F — Sweet Flavor html generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runHtmlStage } from "../lib/food-publication/html.js";
runHtmlStage(getDomainConfig("sweet-flavor"));
