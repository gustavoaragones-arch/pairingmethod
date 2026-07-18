#!/usr/bin/env node
/** DEPLOY-01 — Promote one or more certified food ontology domains. */
import { runPromoteStage } from "../lib/food-publication/deploy.js";

const domains = process.argv.slice(2);
runPromoteStage(domains.length ? domains : ["protein", "cheese"]);
