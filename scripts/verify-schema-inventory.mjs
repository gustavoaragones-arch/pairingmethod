#!/usr/bin/env node
/** AQ-04A — Schema inventory (read-only). */
import { buildSchemaInventory } from "../lib/schema-audit/inventory.js";

const result = buildSchemaInventory(process.cwd());
console.log(JSON.stringify(result, null, 2));
