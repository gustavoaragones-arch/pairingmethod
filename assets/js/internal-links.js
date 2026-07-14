/**
 * Contextual internal links from live engine state — reinforces topical graph (hub, dish, grape, seasonal).
 * State uses Set per category (same as pairing-engine).
 */

import {
  grapeUrl,
  pairingUrl,
  publicPath,
} from "../../lib/public-url.js";

const SHARED_ROUTES = Object.freeze({
  pairings: publicPath("pairings.html"),
  matrix: publicPath("pairing-matrix.html"),
  seasonal: publicPath("seasonal-wine-guides.html"),
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function has(state, category, value) {
  const bag = state[category];
  if (!bag) return false;
  if (bag instanceof Set) return bag.has(value);
  if (Array.isArray(bag)) return bag.includes(value);
  return false;
}

/**
 * @param {Record<string, Set<string>|string[]>} state
 */
export function injectInternalLinks(state) {
  const container = document.getElementById("internal-links");
  if (!container) return;

  const links = [];
  const add = (href, text) => {
    if (links.some((l) => l.href === href)) return;
    links.push({ href, text });
  };

  /* --- Pairing guides (dish + context) --- */
  if (has(state, "protein", "red_meat")) {
    add(pairingUrl("wine-with-steak"), "Best wine with steak — full pairing guide");
    if (has(state, "preparation", "grilled")) {
      add(pairingUrl("wine-with-grilled-steak"), "Best wine for grilled steak");
    }
  }
  if (has(state, "protein", "fish")) {
    add(pairingUrl("wine-with-salmon"), "Best wine with salmon — seafood pairing guide");
    if (has(state, "preparation", "fried")) {
      add(pairingUrl("wine-with-fried-fish"), "Best wine for fried fish");
    }
  }
  if (has(state, "protein", "poultry")) {
    add(pairingUrl("wine-with-chicken"), "Best wine with chicken — pairing guide");
    if (has(state, "preparation", "roasted")) {
      add(pairingUrl("wine-with-roasted-chicken"), "Best wine for roasted chicken");
    }
  }
  if (has(state, "protein", "pork")) {
    add(pairingUrl("wine-for-bbq-ribs"), "Best wine with BBQ ribs — smoke & glaze");
    if (has(state, "preparation", "smoked")) {
      add(pairingUrl("wine-with-smoked-pork"), "Best wine for smoked pork");
    }
  }
  if (has(state, "protein", "shellfish")) {
    add(pairingUrl("wine-with-salmon"), "Best wine with salmon & rich seafood guides");
  }

  if (has(state, "spice", "spicy")) {
    add(pairingUrl("wine-with-spicy-food"), "Best wine for spicy food");
  }

  if (has(state, "dairy", "soft_cheese")) {
    add(pairingUrl("wine-with-creamy-dishes"), "Best wine for creamy dishes & soft cheese");
  }

  if (has(state, "preparation", "grilled") && !has(state, "protein", "red_meat")) {
    add(pairingUrl("wine-with-grilled-steak"), "Best wine for grilled foods (steak lens)");
  }
  if (has(state, "preparation", "fried") && !has(state, "protein", "fish")) {
    add(pairingUrl("wine-with-fried-fish"), "Best wine for fried foods (fish lens)");
  }

  /* --- Hub + matrix (always useful) --- */
  add(SHARED_ROUTES.pairings, "Explore all wine pairings");
  add(SHARED_ROUTES.matrix, "Printable wine pairing matrix overview");

  /* --- Grape cluster (varietals tied to common rows) --- */
  if (
    has(state, "protein", "red_meat") ||
    has(state, "preparation", "grilled") ||
    has(state, "preparation", "smoked")
  ) {
    add(grapeUrl("cabernet-sauvignon"), "Cabernet Sauvignon — grape guide");
  }
  if (has(state, "protein", "fish") || has(state, "protein", "shellfish")) {
    add(grapeUrl("sauvignon-blanc"), "Sauvignon Blanc — grape guide");
  }
  if (has(state, "spice", "spicy")) {
    add(grapeUrl("riesling"), "Riesling — grape guide (acidity & sweetness)");
  }
  if (has(state, "protein", "poultry") || has(state, "dairy", "soft_cheese")) {
    add(grapeUrl("chardonnay"), "Chardonnay — grape guide");
  }
  if (links.length < 5) {
    add(grapeUrl("pinot-noir"), "Pinot Noir — grape guide");
  }

  /* --- Seasonal hub --- */
  add(SHARED_ROUTES.seasonal, "Seasonal wine guides — holidays & occasions");

  if (links.length === 0) {
    add(pairingUrl("wine-with-steak"), "Best wine with steak");
    add(pairingUrl("wine-with-spicy-food"), "Best wine for spicy food");
    add(SHARED_ROUTES.pairings, "Explore all wine pairings");
    add(SHARED_ROUTES.seasonal, "Seasonal wine guides");
    add(grapeUrl("cabernet-sauvignon"), "Cabernet Sauvignon — grape guide");
  }

  const show = links.slice(0, 8);

  const lis = show
    .map(
      (l) =>
        `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.text)}</a></li>`
    )
    .join("\n");

  container.innerHTML = `
    <section class="internal-links-inner">
      <h2>Related pairings &amp; resources</h2>
      <p class="internal-links-lede">Curated from your current matrix rows — same logic as our <a href="${SHARED_ROUTES.matrix}">pairing matrix</a>.</p>
      <ul class="internal-links-list">
      ${lis}
      </ul>
    </section>
  `;
}
