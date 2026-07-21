#!/usr/bin/env node
/** FOOD-10F — Nut & Seed HTML renderer. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runHtmlStage } from "../lib/food-publication/html.js";
runHtmlStage(getDomainConfig("nut-seed"));
