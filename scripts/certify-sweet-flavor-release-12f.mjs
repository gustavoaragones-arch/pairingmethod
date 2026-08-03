#!/usr/bin/env node
/** FOOD-12F — Sweet Flavor release certification. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runCertifyReleaseStage } from "../lib/food-publication/certify-release.js";
runCertifyReleaseStage(getDomainConfig("sweet-flavor"));
