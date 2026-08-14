#!/usr/bin/env node
/** AQ-02B2 — Deterministically rebuild sitemap.xml from every published domain. */
import path from "path";
import { fileURLToPath } from "url";
import { runSitemapIndexStage } from "../lib/food-publication/sitemap-registry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const result = runSitemapIndexStage(root);
console.log(JSON.stringify({ locCount: result.locCount, locs: result.locs }, null, 2));
