#!/usr/bin/env node
/** FOOD-10FI — Nut & Seed release certification. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runCertifyReleaseStage } from "../lib/food-publication/certify-release.js";
runCertifyReleaseStage(getDomainConfig("nut-seed"));
