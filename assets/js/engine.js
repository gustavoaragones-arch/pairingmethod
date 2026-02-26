/**
 * Pairing Method Engine
 * Deterministic structural pairing system.
 *
 * Pure vanilla JS, no external libraries.
 * Data layer: /data/foods.json, /data/wines.json
 *
 * All structural attributes: integer 0–5 (alcohol 1–5). No decimals, no floats.
 */

const BASE_SCORE = 50;

// -----------------------------------------------------------------------------
// Normalization (deterministic input handling)
// -----------------------------------------------------------------------------

/**
 * Clamp numeric attribute to integer in range [min, max].
 * @param {number} v - Value to clamp
 * @param {number} min - Minimum (default 0)
 * @param {number} max - Maximum (default 5)
 * @returns {number}
 */
function clamp(v, min = 0, max = 5) {
  const n = Number(v);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

/**
 * Normalize food object for scoring. Accepts both "texture" and "texture_weight".
 * @param {Object} food - Raw food from dataset
 * @returns {Object} Normalized attributes only
 */
function normalizeFood(food) {
  return {
    name: typeof food.name === "string" ? food.name : "",
    protein_intensity: clamp(food.protein_intensity),
    fat_level: clamp(food.fat_level),
    acidity: clamp(food.acidity),
    sweetness: clamp(food.sweetness),
    spice_heat: clamp(food.spice_heat),
    umami: clamp(food.umami),
  };
}

/**
 * Normalize wine object for scoring.
 * @param {Object} wine - Raw wine from dataset
 * @returns {Object} Normalized attributes + flavor_profile if present
 */
function normalizeWine(wine) {
  const alc = Number(wine.alcohol);
  const arom = Number(wine.aromatic_intensity);
  return {
    name: typeof wine.name === "string" ? wine.name : "",
    body: clamp(wine.body),
    tannin: clamp(wine.tannin),
    acidity: clamp(wine.acidity),
    alcohol: Number.isNaN(alc) ? 3 : Math.max(1, Math.min(5, Math.floor(alc))),
    sweetness: clamp(wine.sweetness),
    aromatic_intensity: Number.isNaN(arom) ? 2 : Math.max(1, Math.min(5, Math.floor(arom))),
    flavor_profile: Array.isArray(wine.flavor_profile) ? wine.flavor_profile : [],
  };
}

// -----------------------------------------------------------------------------
// Rule helpers (each returns { delta, reasoning } for modular, deterministic scoring)
// -----------------------------------------------------------------------------

/**
 * 1️⃣ Intensity Harmony — Wine body vs protein intensity.
 * Bonus when aligned (diff ≤ 1), penalty when misaligned (diff ≥ 3).
 * @param {Object} f - Normalized food
 * @param {Object} w - Normalized wine
 * @returns {{ delta: number, reasoning: string[] }}
 */
function applyIntensityHarmony(f, w) {
  const reasoning = [];
  const intensityDiff = Math.abs(f.protein_intensity - w.body);

  if (intensityDiff <= 1) {
    reasoning.push("Wine body aligns with protein intensity.");
    return { delta: 15, reasoning };
  }
  if (intensityDiff >= 3) {
    reasoning.push("Wine body misaligned with dish intensity.");
    return { delta: -15, reasoning };
  }
  return { delta: 0, reasoning: [] };
}

/**
 * 2️⃣ Fat Balance — Rich dishes need structure (acidity or tannin).
 * Bonus when fat ≥ 3 and wine has structure; penalty when fat ≥ 4 and wine lacks acidity.
 * @param {Object} f - Normalized food
 * @param {Object} w - Normalized wine
 * @returns {{ delta: number, reasoning: string[] }}
 */
function applyFatBalance(f, w) {
  const reasoning = [];

  if (f.fat_level >= 3 && (w.acidity >= 3 || w.tannin >= 3)) {
    reasoning.push("Structure balances dish richness.");
    return { delta: 10, reasoning };
  }

  if (f.fat_level >= 4 && w.acidity <= 1) {
    reasoning.push("Wine lacks acidity for rich texture.");
    return { delta: -10, reasoning };
  }

  return { delta: 0, reasoning: [] };
}

/**
 * 3️⃣ Sweetness Rule — Wine sweetness must meet or exceed dish sweetness.
 * If not, score is capped at 40 (applied after all other modifiers).
 * @param {Object} f - Normalized food
 * @param {Object} w - Normalized wine
 * @returns {{ cap: number | null, reasoning: string[] }} cap is 40 if violated, else null
 */
function applySweetnessRule(f, w) {
  if (w.sweetness < f.sweetness) {
    return { cap: 40, reasoning: ["Wine sweetness lower than dish sweetness."] };
  }
  return { cap: null, reasoning: [] };
}

/**
 * 4️⃣ Acid Gap — Wine acidity must keep up with dish acidity.
 * @param {Object} f - Normalized food
 * @param {Object} w - Normalized wine
 * @returns {{ delta: number, reasoning: string[] }}
 */
function applyAcidGap(f, w) {
  if (w.acidity + 1 < f.acidity) {
    return { delta: -20, reasoning: ["Wine acidity too low for dish brightness."] };
  }
  return { delta: 0, reasoning: [] };
}

/**
 * 5️⃣ Spice Logic — High alcohol and high tannin clash with heat; slight sweetness helps.
 * @param {Object} f - Normalized food
 * @param {Object} w - Normalized wine
 * @returns {{ delta: number, reasoning: string[] }}
 */
function applySpiceLogic(f, w) {
  const reasoning = [];
  let delta = 0;

  if (f.spice_heat >= 3 && w.alcohol >= 4) {
    delta -= 15;
    reasoning.push("High alcohol clashes with spice heat.");
  }

  if (f.spice_heat >= 3 && w.tannin >= 4) {
    delta -= 10;
    reasoning.push("Tannins amplified by spice.");
  }

  if (f.spice_heat >= 3 && w.sweetness >= 1) {
    delta += 8;
    reasoning.push("Slight sweetness softens spice.");
  }

  return { delta, reasoning };
}

/**
 * 6️⃣ Umami Support — Acidity supports savory depth.
 * @param {Object} f - Normalized food
 * @param {Object} w - Normalized wine
 * @returns {{ delta: number, reasoning: string[] }}
 */
function applyUmamiSupport(f, w) {
  if (f.umami >= 3 && w.acidity >= 3) {
    return { delta: 5, reasoning: ["Acidity supports savory depth."] };
  }
  return { delta: 0, reasoning: [] };
}

/**
 * 7️⃣ Flavor Bridge (MVP) — Simple keyword match: dish name contains any wine flavor note.
 * @param {Object} f - Normalized food (has .name)
 * @param {Object} w - Normalized wine (has .flavor_profile array)
 * @returns {{ delta: number, reasoning: string[] }}
 */
function applyFlavorBridge(f, w) {
  const foodName = (f.name || "").toLowerCase();
  const hasMatch =
    w.flavor_profile &&
    w.flavor_profile.length > 0 &&
    w.flavor_profile.some((flavor) => typeof flavor === "string" && foodName.includes(flavor.toLowerCase()));

  if (hasMatch) {
    return { delta: 5, reasoning: ["Flavor bridge between wine and dish."] };
  }
  return { delta: 0, reasoning: [] };
}

// -----------------------------------------------------------------------------
// Single-pair scoring (deterministic)
// -----------------------------------------------------------------------------

/**
 * Score one (food, wine) pair and build reasoning list.
 * @param {Object} food - Raw food object
 * @param {Object} wine - Raw wine object
 * @returns {{ name: string, score: number, reasoning: string[] }}
 */
function scoreOnePair(food, wine) {
  const f = normalizeFood(food);
  const w = normalizeWine(wine);
  const reasoning = [];

  let score = BASE_SCORE;

  const intensity = applyIntensityHarmony(f, w);
  score += intensity.delta;
  reasoning.push(...intensity.reasoning);

  const fat = applyFatBalance(f, w);
  score += fat.delta;
  reasoning.push(...fat.reasoning);

  const acid = applyAcidGap(f, w);
  score += acid.delta;
  reasoning.push(...acid.reasoning);

  const spice = applySpiceLogic(f, w);
  score += spice.delta;
  reasoning.push(...spice.reasoning);

  const umami = applyUmamiSupport(f, w);
  score += umami.delta;
  reasoning.push(...umami.reasoning);

  const flavor = applyFlavorBridge(f, w);
  score += flavor.delta;
  reasoning.push(...flavor.reasoning);

  score = Math.max(0, Math.min(100, score));

  const sweetness = applySweetnessRule(f, w);
  reasoning.push(...sweetness.reasoning);
  if (sweetness.cap !== null) {
    score = Math.min(score, sweetness.cap);
  }

  return {
    name: w.name || wine.name || "",
    score,
    reasoning,
  };
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

/**
 * Calculate pairing recommendations for a food against a list of wines.
 * Returns the top 3 wines sorted by score descending (best first).
 * Deterministic: same inputs always produce same outputs.
 *
 * @param {Object} food - Food descriptor (name, protein_intensity, fat_level, acidity, sweetness, spice_heat, umami; optional texture/texture_weight)
 * @param {Array<Object>} wines - List of wine descriptors (name, body, tannin, acidity, alcohol, sweetness, flavor_profile, etc.)
 * @returns {Array<{ name: string, score: number, reasoning: string[] }>} Top 3 results, or fewer if fewer wines provided
 */
export function calculatePairing(food, wines) {
  if (!food || !Array.isArray(wines) || wines.length === 0) {
    return [];
  }

  const results = wines.map((wine) => scoreOnePair(food, wine));

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, 3);
}

/**
 * Score a single (food, wine) pair. Exposed for testing or UI.
 * @param {Object} food - Food descriptor
 * @param {Object} wine - Wine descriptor
 * @returns {{ name: string, score: number, reasoning: string[] }}
 */
export function scorePairing(food, wine) {
  if (!food || !wine) {
    return { name: "", score: 0, reasoning: [] };
  }
  return scoreOnePair(food, wine);
}
