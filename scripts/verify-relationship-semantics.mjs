#!/usr/bin/env node
/** AQ-04D — Relationship semantics review (read-only). */
import { reviewRelationshipSemantics } from "../lib/schema-audit/relationship-semantics.js";

const result = reviewRelationshipSemantics(process.cwd());
console.log(JSON.stringify(result, null, 2));
