#!/usr/bin/env node
/** AQ-05A — Google crawlability certification (read-only). */
import { certifyCrawlability } from "../lib/search-audit/crawlability.js";

const result = certifyCrawlability(process.cwd());
console.log(JSON.stringify(result, null, 2));
