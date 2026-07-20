#!/usr/bin/env node
/** FOOD-09F — Fruit HTML renderer. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runHtmlStage } from "../lib/food-publication/html.js";
runHtmlStage(getDomainConfig("fruit"));
