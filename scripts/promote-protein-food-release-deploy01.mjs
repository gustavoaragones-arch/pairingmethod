#!/usr/bin/env node
/** DEPLOY-01 — Promote certified food ontology releases (multi-domain). */
import { runPromoteStage } from "../lib/food-publication/deploy.js";

runPromoteStage(["protein"]);
