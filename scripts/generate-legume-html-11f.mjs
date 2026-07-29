#!/usr/bin/env node
/** FOOD-11F — Legume html generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runHtmlStage } from "../lib/food-publication/html.js";
runHtmlStage(getDomainConfig("legume"));
