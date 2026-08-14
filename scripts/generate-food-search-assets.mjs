#!/usr/bin/env node
/** AQ-02B2 — Generate assets/js/food-ontology-search-index.js from every published domain's search index. */
import path from "path";
import { fileURLToPath } from "url";
import { runSearchAssetsStage } from "../lib/food-publication/search-assets.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

console.log(JSON.stringify(runSearchAssetsStage(root), null, 2));
