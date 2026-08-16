#!/usr/bin/env node
/** AQ-07A — Editorial narrative inventory (read-only). */
import { buildNarrativeInventory } from "../lib/editorial-audit/narrative-inventory.js";

const result = buildNarrativeInventory(process.cwd());
console.log(JSON.stringify(result, null, 2));
