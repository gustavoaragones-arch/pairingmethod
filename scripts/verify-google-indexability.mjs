#!/usr/bin/env node
/** AQ-05B — Google indexability certification (read-only). */
import { certifyIndexability } from "../lib/search-audit/indexability.js";

const result = certifyIndexability(process.cwd());
console.log(JSON.stringify(result, null, 2));
