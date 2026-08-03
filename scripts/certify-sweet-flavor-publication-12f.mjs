#!/usr/bin/env node
/** FOOD-12F — Sweet Flavor publication certification. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runCertifyPublicationStage } from "../lib/food-publication/certify-publication.js";
runCertifyPublicationStage(getDomainConfig("sweet-flavor"));
