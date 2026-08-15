#!/usr/bin/env node
/** AQ-03A — Cross-domain scientific-identity verification (read-only). */
import { verifyScientificIdentity } from "../lib/catalog-audit/scientific-identity.js";

const result = verifyScientificIdentity(process.cwd());
console.log(JSON.stringify({ totalChecked: result.totalChecked, findingCount: result.findingCount, allConformant: result.allConformant }, null, 2));
if (result.findingCount) console.log(JSON.stringify(result.findings, null, 2));
