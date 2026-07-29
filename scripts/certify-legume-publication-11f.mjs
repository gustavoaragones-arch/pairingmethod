#!/usr/bin/env node
/** FOOD-11F — Legume publication certification. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runCertifyPublicationStage } from "../lib/food-publication/certify-publication.js";
runCertifyPublicationStage(getDomainConfig("legume"));
