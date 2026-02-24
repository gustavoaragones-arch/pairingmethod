/**
 * Pairing Method — Pairing engine
 * Mount point: #pairing-engine-root
 * Data layer: /data/foods.json, /data/wines.json, /data/definitions.json
 *
 * Structural attributes: integer scale 0–5 only. 0 = absent, 5 = dominant.
 * No decimals. No floats. Ever.
 *
 * Canonical pairing rules (locked). Do not change unless structurally justified.
 */

const BASE_SCORE = 50;

/** @constant {number} Rule 1: max score when wine sweetness < food sweetness */
const SWEETNESS_CAP = 40;

/** @constant {number} Rule 2: acid gap penalty */
const ACID_GAP_PENALTY = 20;

/** @constant {number} Rule 3a: spice + high alcohol penalty */
const SPICE_ALCOHOL_PENALTY = 15;

/** @constant {number} Rule 3b: spice + high tannin penalty */
const SPICE_TANNIN_PENALTY = 10;

/** @constant {number} Rule 4: fat balance bonus */
const FAT_BALANCE_BONUS = 10;

/** @constant {number} Rule 5: intensity harmony bonus */
const INTENSITY_HARMONY_BONUS = 15;

/**
 * Score a single (food, wine) pair using canonical rules.
 * All attributes must be integers 0–5 (alcohol and aromatic_intensity 1–5).
 * @param {Object} food - { protein_intensity, fat_level, acidity, sweetness, spice_heat, umami, texture | texture_weight }
 * @param {Object} wine - { body, tannin, acidity, alcohol, sweetness, aromatic_intensity }
 * @returns {number} Score 0–100, or capped at 40 if Rule 1 applies
 */
export function scorePairing(food, wine) {
  const f = normalizeFood(food);
  const w = normalizeWine(wine);

  let score = BASE_SCORE;

  // Rule 2 — Acid gap: wine.acidity + 1 < food.acidity → -20
  if (w.acidity + 1 < f.acidity) {
    score -= ACID_GAP_PENALTY;
  }

  // Rule 3 — Spice clash
  if (f.spice_heat >= 3 && w.alcohol >= 4) {
    score -= SPICE_ALCOHOL_PENALTY;
  }
  if (w.tannin >= 4 && f.spice_heat >= 3) {
    score -= SPICE_TANNIN_PENALTY;
  }

  // Rule 4 — Fat balance: food.fat_level ≥ 3 AND (wine.acidity ≥ 3 OR wine.tannin ≥ 3) → +10
  if (f.fat_level >= 3 && (w.acidity >= 3 || w.tannin >= 3)) {
    score += FAT_BALANCE_BONUS;
  }

  // Rule 5 — Intensity harmony: |food.protein_intensity - wine.body| ≤ 1 → +15
  const bodyDiff = Math.abs(f.protein_intensity - w.body);
  if (bodyDiff <= 1) {
    score += INTENSITY_HARMONY_BONUS;
  }

  score = Math.max(0, Math.min(100, score));

  // Rule 1 — Sweetness violation: wine.sweetness < food.sweetness → score capped at 40
  if (w.sweetness < f.sweetness) {
    score = Math.min(score, SWEETNESS_CAP);
  }

  return score;
}

/**
 * Calculate pairing recommendations for a food against a list of wines.
 * Returns wines sorted by score descending (best first).
 * @param {Object} food - Food descriptor with structural attributes
 * @param {Array} wines - List of wine descriptors
 * @returns {Array<{ wine: Object, score: number }>} Ordered list of { wine, score }
 */
export function calculatePairing(food, wines) {
  if (!Array.isArray(wines) || wines.length === 0) {
    return [];
  }

  const results = wines.map((wine) => ({
    wine,
    score: scorePairing(food, wine),
  }));

  results.sort((a, b) => b.score - a.score);
  return results;
}

/**
 * Clamp integer 0–5. Used for food and most wine attributes.
 * @param {number} v
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(v, min = 0, max = 5) {
  const n = Number(v);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

/**
 * Ensure food object has all required attributes as integers 0–5.
 * @param {Object} food
 * @returns {Object}
 */
function normalizeFood(food) {
  return {
    protein_intensity: clamp(food.protein_intensity),
    fat_level: clamp(food.fat_level),
    acidity: clamp(food.acidity),
    sweetness: clamp(food.sweetness),
    spice_heat: clamp(food.spice_heat),
    umami: clamp(food.umami),
    texture_weight: clamp(food.texture ?? food.texture_weight),
  };
}

/**
 * Ensure wine object has all required attributes. body, tannin, acidity, sweetness 0–5; alcohol, aromatic_intensity 1–5.
 * @param {Object} wine
 * @returns {Object}
 */
function normalizeWine(wine) {
  const alc = Number(wine.alcohol);
  const arom = Number(wine.aromatic_intensity);
  return {
    body: clamp(wine.body),
    tannin: clamp(wine.tannin),
    acidity: clamp(wine.acidity),
    alcohol: Number.isNaN(alc) ? 3 : Math.max(1, Math.min(5, Math.floor(alc))),
    sweetness: clamp(wine.sweetness),
    aromatic_intensity: Number.isNaN(arom) ? 2 : Math.max(1, Math.min(5, Math.floor(arom))),
  };
}
