#!/usr/bin/env node
/** AQ-04C — Ontology mapping verification (read-only). */
import { verifyOntologyMapping } from "../lib/schema-audit/ontology-mapping.js";

const result = verifyOntologyMapping(process.cwd());
console.log(JSON.stringify(result, null, 2));
