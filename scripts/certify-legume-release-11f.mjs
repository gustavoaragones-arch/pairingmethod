#!/usr/bin/env node
/** FOOD-11F — Legume release certification. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runCertifyReleaseStage } from "../lib/food-publication/certify-release.js";
runCertifyReleaseStage(getDomainConfig("legume"));
