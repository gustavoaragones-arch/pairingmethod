#!/usr/bin/env node
/** AQ-05C — Google structured data / Rich Results certification (read-only). */
import { certifyRichResults } from "../lib/search-audit/rich-results.js";

const result = certifyRichResults(process.cwd());
console.log(JSON.stringify(result, null, 2));
