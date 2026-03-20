/**
 * Dynamic copy from engine state + matrix results — same logic for URL, context, or manual picks.
 */

import { PAIRING_MATRIX } from "./pairing-data.js";

function flattenSelections(state) {
  return Object.values(state).flatMap((bag) =>
    bag instanceof Set ? [...bag] : Array.isArray(bag) ? bag : []
  );
}

function humanize(key) {
  return String(key)
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * @param {Record<string, Set<string>|string[]>} state
 * @param {{ style: string; score?: number; baseline?: boolean }[]} results
 */
export function generateContent(state, results) {
  const selections = flattenSelections(state);
  const topStyle = results[0]?.style || "";

  return {
    why: buildWhy(selections, topStyle, results),
    topWines: buildTopWines(results),
    avoid: buildAvoid(selections),
    tips: buildTips(selections),
  };
}

function buildWhy(selections, topStyle, results) {
  if (!topStyle) {
    return "Select food dimensions to see how each wine style column scores against the pairing matrix.";
  }

  if (selections.length === 0) {
    return `With no rows active yet, the engine shows a reference order — ${humanize(topStyle)} appears first alphabetically. Add ingredients to compute a real intersection score.`;
  }

  const reasons = selections.map((sel) => {
    const val = PAIRING_MATRIX[sel]?.[topStyle];
    const label = humanize(sel);
    if (val === 3) {
      return `${label} strongly aligns with ${humanize(topStyle)} for this combination`;
    }
    if (val === 2) {
      return `${label} supports balance with ${humanize(topStyle)}`;
    }
    if (val === 1) {
      return `${label} is an acceptable match for ${humanize(topStyle)}`;
    }
    return null;
  }).filter(Boolean);

  if (reasons.length === 0) {
    return `Your leading match is ${humanize(topStyle)} (${results[0]?.score ?? 50}% matrix match). Refine chips to pull more “ideal” cells into the same column.`;
  }

  return reasons.slice(0, 3).join(". ") + ".";
}

function buildTopWines(results) {
  return results.slice(0, 3).map((r) => ({
    style: r.style,
    label: humanize(r.style),
    score: r.score ?? 50,
    baseline: !!r.baseline,
  }));
}

function buildAvoid(selections) {
  if (selections.length === 0) {
    return [];
  }

  const avoid = new Set();
  selections.forEach((sel) => {
    const row = PAIRING_MATRIX[sel];
    if (!row) return;
    Object.entries(row).forEach(([style, val]) => {
      if (val === 0) avoid.add(style);
    });
  });
  return [...avoid].map(humanize).slice(0, 5);
}

function buildTips(selections) {
  if (selections.includes("spicy")) {
    return "Use wines with slight sweetness or modest alcohol to balance heat without fanning the flames.";
  }
  if (selections.includes("smoked")) {
    return "Smoked foods favor structured reds or aromatic whites that won’t be overwhelmed by smoke.";
  }
  if (selections.includes("grilled")) {
    return "Char and caramelization call for wines with enough tannin or body to match intensity.";
  }
  if (selections.includes("fried")) {
    return "Fried dishes love acidity and bubbles — sparkling and crisp whites cut richness.";
  }
  if (selections.includes("fish") || selections.includes("shellfish")) {
    return "Serve whites and sparkling cooler (about 8–12°C) so acidity stays lifted with seafood.";
  }
  if (selections.includes("red_meat")) {
    return "Pour structured reds slightly below room temperature if the room is warm — around 16–18°C keeps tannins in balance.";
  }
  if (selections.includes("pungent_cheese")) {
    return "Pungent cheese often needs sweetness or oxidative richness — serve those wines a touch less cold so aroma opens.";
  }
  return "Match wine weight to food weight, and keep acidity high enough to refresh the palate between bites.";
}
