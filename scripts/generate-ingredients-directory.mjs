#!/usr/bin/env node
/** AQ-02B1 — Generate the /ingredients/ master food-ontology directory page. */
import path from "path";
import { fileURLToPath } from "url";
import { runIngredientsDirectoryStage } from "../lib/food-publication/ingredients-directory.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

console.log(JSON.stringify(runIngredientsDirectoryStage(root), null, 2));
