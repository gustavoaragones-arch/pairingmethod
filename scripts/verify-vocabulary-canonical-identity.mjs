#!/usr/bin/env node
/** AQ-03C — Vocabulary conformance + canonical identity verification (read-only). */
import { runVocabularyAndCanonicalIdentityStage } from "../lib/catalog-audit/canonical-identity.js";

const result = runVocabularyAndCanonicalIdentityStage(process.cwd());
console.log(JSON.stringify(result, null, 2));
