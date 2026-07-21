#!/usr/bin/env node
/** FOOD-10F — Nut & Seed publication certification. */
import { getDomainConfig } from "../lib/food-domain-config.js";
import { runCertifyPublicationStage } from "../lib/food-publication/certify-publication.js";
runCertifyPublicationStage(getDomainConfig("nut-seed"));
