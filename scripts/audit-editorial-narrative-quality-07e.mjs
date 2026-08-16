#!/usr/bin/env node
/** AQ-07E — Grammar & template-quality audit (read-only). */
import { auditNarrativeQuality } from "../lib/editorial-audit/narrative-quality.js";

const result = auditNarrativeQuality(process.cwd());
console.log(JSON.stringify(result, null, 2));
