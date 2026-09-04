#!/usr/bin/env node
/** LANG-01 — Language & regional vocabulary governance verification (read-only). */
import { runLanguageGovernanceVerification } from "../lib/language-audit/language-governance.js";

const result = runLanguageGovernanceVerification(process.cwd());
console.log(JSON.stringify(result, null, 2));
if (result.overall_certification !== "PASS") process.exit(1);
