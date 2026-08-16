#!/usr/bin/env node
/** AQ-07F — SEO description certification (read-only). */
import { certifySeoDescriptions } from "../lib/editorial-audit/seo-description.js";

const result = certifySeoDescriptions(process.cwd());
console.log(JSON.stringify(result, null, 2));
