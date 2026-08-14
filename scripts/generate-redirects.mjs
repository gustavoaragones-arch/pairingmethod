#!/usr/bin/env node
/** AQ-02B4 — Regenerate _redirects' deprecated-entity block from every domain's catalog. */
import { runRedirectRegistryStage } from "../lib/food-publication/redirect-registry.js";

const result = runRedirectRegistryStage(process.cwd());
console.log(JSON.stringify({ redirectCount: result.redirectCount, redirectsPath: result.redirectsPath }, null, 2));
