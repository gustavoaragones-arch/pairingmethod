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

/**
 * Presentation-only resource-type icons (PAIRING-UI-02). Purely visual —
 * does not affect which links are selected, their order, or their count.
 * Fixed mapping: pairing/food guide -> wine glass, educational wine
 * concept/article -> book, comparison/reference resource -> document.
 */
const RESOURCE_ICONS = {
  pairing: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h10l-1 7a4 4 0 0 1-8 0L7 3z"/><path d="M12 14v6"/><path d="M9 20h6"/></svg>`,
  article: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5C4 4.67 4.67 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13z"/><path d="M20 5.5c0-.83-.67-1.5-1.5-1.5H13v16h5.5c.83 0 1.5-.67 1.5-1.5v-13z"/></svg>`,
  reference: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l3 3v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M15 3v3h3"/><path d="M8 12h8M8 16h8"/></svg>`,
};

const CHEVRON_ICON = `<svg class="resource-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>`;

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
  const add = (href, text, type = "pairing") => {
    if (links.some((l) => l.href === href)) return;
    links.push({ href, text, type });
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
  add(SHARED_ROUTES.matrix, "Printable wine pairing matrix overview", "reference");

  /* --- Grape cluster (varietals tied to common rows) --- */
  if (
    has(state, "protein", "red_meat") ||
    has(state, "preparation", "grilled") ||
    has(state, "preparation", "smoked")
  ) {
    add(grapeUrl("cabernet-sauvignon"), "Cabernet Sauvignon — grape guide", "article");
  }
  if (has(state, "protein", "fish") || has(state, "protein", "shellfish")) {
    add(grapeUrl("sauvignon-blanc"), "Sauvignon Blanc — grape guide", "article");
  }
  if (has(state, "spice", "spicy")) {
    add(grapeUrl("riesling"), "Riesling — grape guide (acidity & sweetness)", "article");
  }
  if (has(state, "protein", "poultry") || has(state, "dairy", "soft_cheese")) {
    add(grapeUrl("chardonnay"), "Chardonnay — grape guide", "article");
  }
  if (links.length < 5) {
    add(grapeUrl("pinot-noir"), "Pinot Noir — grape guide", "article");
  }

  /* --- Seasonal hub --- */
  add(SHARED_ROUTES.seasonal, "Seasonal wine guides — holidays & occasions");

  if (links.length === 0) {
    add(pairingUrl("wine-with-steak"), "Best wine with steak");
    add(pairingUrl("wine-with-spicy-food"), "Best wine for spicy food");
    add(SHARED_ROUTES.pairings, "Explore all wine pairings");
    add(SHARED_ROUTES.seasonal, "Seasonal wine guides");
    add(grapeUrl("cabernet-sauvignon"), "Cabernet Sauvignon — grape guide", "article");
  }

  const show = links.slice(0, 8);

  // PAIRING-UI-02's editorial row treatment (icon + text + chevron) is
  // homepage-only, matching its CSS scope (.page-home ...) — every other
  // page that embeds this same module (dish/pairing guides) keeps the
  // original plain-link markup untouched, so nothing renders unstyled.
  const isHomePage = document.body.classList.contains("page-home");
  const listClass = isHomePage ? "internal-links-list resource-list" : "internal-links-list";
  const lis = show
    .map((l) => {
      if (!isHomePage) {
        return `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.text)}</a></li>`;
      }
      const icon = RESOURCE_ICONS[l.type] ?? RESOURCE_ICONS.pairing;
      return `<li><a class="resource-row" href="${escapeHtml(l.href)}"><span class="resource-icon" aria-hidden="true">${icon}</span><span class="resource-text">${escapeHtml(l.text)}</span>${CHEVRON_ICON}</a></li>`;
    })
    .join("\n");

  container.innerHTML = `
    <section class="internal-links-inner">
      <h2>Related pairings &amp; resources</h2>
      <p class="internal-links-lede">Curated from your current matrix rows — same logic as our <a href="${SHARED_ROUTES.matrix}">pairing matrix</a>.</p>
      <ul class="${listClass}">
      ${lis}
      </ul>
    </section>
  `;
}
