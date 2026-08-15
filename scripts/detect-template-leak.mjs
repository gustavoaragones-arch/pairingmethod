#!/usr/bin/env node
/** AQ-06B — Template/jargon-leak detection in authored catalog prose (read-only). */
import { detectTemplateLeak } from "../lib/adsense-audit/helpful-content.js";

const result = detectTemplateLeak(process.cwd());
console.log(JSON.stringify(result, null, 2));
