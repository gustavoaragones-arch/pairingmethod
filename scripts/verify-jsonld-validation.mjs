#!/usr/bin/env node
/** AQ-04F — JSON-LD structural validation (read-only). */
import { validateAllSchemas } from "../lib/schema-audit/validation.js";

const result = validateAllSchemas(process.cwd());
console.log(JSON.stringify(result, null, 2));
