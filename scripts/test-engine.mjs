/**
 * Quick test for pairing engine: Ribeye Steak, Spicy Thai Curry, Tomato Pasta.
 * Run from project root: node scripts/test-engine.mjs
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { calculatePairing } from "../public/assets/js/engine.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dataDir = join(root, "public", "data");

const foods = JSON.parse(readFileSync(join(dataDir, "foods.json"), "utf8"));
const wines = JSON.parse(readFileSync(join(dataDir, "wines.json"), "utf8"));

const testFoodNames = ["Ribeye Steak", "Spicy Thai Curry", "Tomato Pasta"];
const testFoods = testFoodNames.map((name) => foods.find((f) => f.name === name)).filter(Boolean);

if (testFoods.length !== 3) {
  console.error("Missing test foods in foods.json");
  process.exit(1);
}

console.log("--- Engine test: top 3 wines per dish ---\n");

let ok = true;
for (const food of testFoods) {
  const results = calculatePairing(food, wines);
  console.log(`\n${food.name}:`);
  if (results.length === 0) {
    console.log("  FAIL: no results");
    ok = false;
    continue;
  }
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.name} (${r.score})`);
    if (r.score < 0) ok = false;
    r.reasoning.forEach((line) => console.log(`     - ${line}`));
  });
}

// Spicy Thai Curry: expect off-dry Riesling to be in top 3 (sweetness softens spice)
const spicy = testFoods.find((f) => f.name === "Spicy Thai Curry");
const spicyResults = calculatePairing(spicy, wines);
const hasOffDryRiesling = spicyResults.some((r) => r.name.includes("Riesling") && r.name.includes("Off-Dry"));
if (!hasOffDryRiesling) {
  console.log("\nNote: Off-Dry Riesling not in top 3 for Spicy Thai Curry (check if expected).");
}

// Tomato Pasta: sweet dish (sweetness 1) — dry wines should be capped at 40 if below; we expect high-acid wines to rank
const tomato = testFoods.find((f) => f.name === "Tomato Pasta");
const tomatoResults = calculatePairing(tomato, wines);
const allNonNegative = tomatoResults.every((r) => r.score >= 0);
if (!allNonNegative) ok = false;

console.log("\n--- No empty returns, no negative scores ---");
console.log(ok ? "PASS" : "FAIL");
process.exit(ok ? 0 : 1);
