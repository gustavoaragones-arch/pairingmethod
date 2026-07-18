#!/usr/bin/env node
/** DEPLOY-01 — Verify deployment for certified food ontology domains. */
import { runVerifyDeployment } from "../lib/food-publication/deploy.js";

runVerifyDeployment(["protein"]);
