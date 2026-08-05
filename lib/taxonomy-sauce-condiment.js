/**
 * FOOD-13C — Read-only Sauce & Condiment Ontology runtime interface.
 * Loads consolidated runtime projection only; never mutates catalog SSOT.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUNTIME_PATH = path.join(__dirname, "..", "data/runtime/sauce-condiment-runtime.json");

let cachedRuntime = null;

export function loadSauceCondimentRuntime() {
  if (!cachedRuntime) {
    cachedRuntime = Object.freeze(JSON.parse(fs.readFileSync(RUNTIME_PATH, "utf8")));
  }
  return cachedRuntime;
}

export function clearSauceCondimentRuntimeCache() {
  cachedRuntime = null;
}

export function getSauceCondimentById(id) {
  const runtime = loadSauceCondimentRuntime();
  return runtime.indexes.by_id[id] ?? null;
}

export function getSauceCondimentBySlug(slug) {
  const runtime = loadSauceCondimentRuntime();
  const id = runtime.indexes.by_slug[slug];
  return id ? runtime.indexes.by_id[id] : null;
}

export function getSauceCondimentsByGroup(groupSlug) {
  const runtime = loadSauceCondimentRuntime();
  const ids = runtime.hierarchy.group_to_sauce_condiments[groupSlug] ?? [];
  return ids.map((id) => runtime.indexes.by_id[id]).filter(Boolean);
}

export function getSauceCondimentCategory(categorySlug = "sauce-condiment") {
  const runtime = loadSauceCondimentRuntime();
  return runtime.categories.find((category) => category.slug === categorySlug) ?? null;
}

export function listSauceCondimentGroups() {
  return loadSauceCondimentRuntime().groups;
}

export function listSauceCondiments() {
  const runtime = loadSauceCondimentRuntime();
  return Object.keys(runtime.indexes.by_id)
    .sort()
    .map((id) => runtime.indexes.by_id[id]);
}
