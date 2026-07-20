#!/usr/bin/env node
/** FOOD-09FI — Fruit release certification. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runCertifyReleaseStage } from "../lib/food-publication/certify-release.js";
runCertifyReleaseStage(getDomainConfig("fruit"));
