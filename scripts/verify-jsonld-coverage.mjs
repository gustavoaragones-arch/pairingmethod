#!/usr/bin/env node
/** AQ-04 — JSON-LD coverage report (read-only). */
import { computeJsonLdCoverage } from "../lib/schema-audit/coverage.js";

const result = computeJsonLdCoverage(process.cwd());
console.log(JSON.stringify(result, null, 2));
