#!/usr/bin/env node
/** AQ-07D — Entity-specific wine narrative certification (read-only). */
import { certifyWineNarratives } from "../lib/editorial-audit/wine-narrative.js";

const result = certifyWineNarratives(process.cwd());
console.log(JSON.stringify(result, null, 2));
