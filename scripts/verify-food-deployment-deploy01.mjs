#!/usr/bin/env node
/** DEPLOY-01 — Verify deployment for one or more food ontology domains. */
import { runVerifyDeployment } from "../lib/food-publication/deploy.js";

const domains = process.argv.slice(2);
runVerifyDeployment(domains.length ? domains : ["protein", "cheese", "vegetable"]);
