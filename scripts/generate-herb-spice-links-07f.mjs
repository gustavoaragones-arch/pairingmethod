#!/usr/bin/env node
/** FOOD-07F — Fungi navigation link generator. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runLinksStage } from "../lib/food-publication/links.js";
runLinksStage(getDomainConfig("herb-spice"));
