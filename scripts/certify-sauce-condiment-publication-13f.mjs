#!/usr/bin/env node
/** FOOD-13F — Sauce & Condiment publication certification. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runCertifyPublicationStage } from "../lib/food-publication/certify-publication.js";
runCertifyPublicationStage(getDomainConfig("sauce-condiment"));
