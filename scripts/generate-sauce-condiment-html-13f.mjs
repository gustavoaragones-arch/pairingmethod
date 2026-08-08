#!/usr/bin/env node
/** FOOD-13F — Sauce & Condiment html generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runHtmlStage } from "../lib/food-publication/html.js";
runHtmlStage(getDomainConfig("sauce-condiment"));
