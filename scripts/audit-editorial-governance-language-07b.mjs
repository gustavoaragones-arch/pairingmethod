#!/usr/bin/env node
/** AQ-07B — Governance-language purge audit (read-only). */
import { auditGovernanceLanguage } from "../lib/editorial-audit/governance-language.js";

const result = auditGovernanceLanguage(process.cwd());
console.log(JSON.stringify(result, null, 2));
