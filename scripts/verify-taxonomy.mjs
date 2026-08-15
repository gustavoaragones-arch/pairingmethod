#!/usr/bin/env node
/** AQ-03B — Cross-domain taxonomy/classification verification (read-only). */
import { runTaxonomyVerification } from "../lib/catalog-audit/taxonomy.js";

const result = runTaxonomyVerification(process.cwd());
console.log(JSON.stringify(result, null, 2));
