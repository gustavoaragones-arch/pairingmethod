/**
 * Centralized SEO copy for pairing guides — titles, verdicts, confidence phrasing.
 * Used by generate-pages.js; mirror patterns on hand-maintained high-intent pages.
 */

export const CONFIDENCE_PHRASES = {
  safest: "safest high-confidence pairing",
  classic: "best classic pairing",
  versatile: "most versatile choice",
  smoky: "best if the dish is smoky",
  fallback: "sommelier fallback pairing",
  friendly: "most food-friendly option",
  restaurant: "best restaurant-style pairing",
};

export const CONFIDENCE_LABELS = {
  safest: "Safest high-confidence pairing",
  classic: "Best classic pairing",
  versatile: "Most versatile choice",
  smoky: "Best if the dish is smoky",
  fallback: "Sommelier fallback pairing",
  friendly: "Most food-friendly option",
  restaurant: "Best restaurant-style pairing",
};

export function buildH1(foodLabel) {
  return `Best Wine with ${foodLabel}`;
}

export function buildPageTitle(foodLabel) {
  return `${buildH1(foodLabel)} (+ Sommelier Pairing Guide) | Pairing Method`;
}

export function buildOgTitle(foodLabel) {
  return `${buildH1(foodLabel)} (+ Sommelier Pairing Guide)`;
}

/**
 * @param {{ wine: string, confidenceKey: keyof CONFIDENCE_PHRASES, dishContext: string, reasoning: string }} opts
 */
export function buildSommelierVerdictHtml(opts) {
  const phrase = CONFIDENCE_PHRASES[opts.confidenceKey] ?? CONFIDENCE_PHRASES.classic;
  const wine = escapeHtml(opts.wine);
  const dish = escapeHtml(opts.dishContext);
  const reasoning = escapeHtml(opts.reasoning);
  return `      <section class="sommelier-verdict" aria-label="Sommelier verdict">
        <h2>Sommelier Verdict</h2>
        <p><strong>${wine}</strong> is the ${phrase} for ${dish} because ${reasoning}.</p>
      </section>`;
}

export function confidenceLabelHtml(key) {
  const label = CONFIDENCE_LABELS[key];
  if (!label) return "";
  return `<p class="confidence-label">${escapeHtml(label)}</p>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Derive SEO bundle from food label + page-specific copy.
 */
export function buildSeoBundle({
  foodLabel,
  pageSubline,
  directAnswer,
  sommelierVerdict,
  queryMatch,
  metaDescription,
}) {
  return {
    pageTitle: buildPageTitle(foodLabel),
    ogTitle: buildOgTitle(foodLabel),
    h1: buildH1(foodLabel),
    breadcrumbLabel: buildH1(foodLabel),
    pageSubline,
    directAnswer,
    sommelierVerdictHtml: buildSommelierVerdictHtml(sommelierVerdict),
    queryMatch,
    metaDescription,
  };
}
