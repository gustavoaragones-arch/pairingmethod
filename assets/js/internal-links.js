/**
 * Contextual internal links from live engine state — reinforces topical graph (hub, dish, grape, seasonal).
 * State uses Set per category (same as pairing-engine).
 */

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
    add("/wine-with-steak.html", "Best wine for steak — full pairing guide");
    if (has(state, "preparation", "grilled")) {
      add("/wine-with-grilled-steak.html", "Best wine for grilled steak");
    }
  }
  if (has(state, "protein", "fish")) {
    add("/wine-with-salmon.html", "Best wine for salmon — seafood pairing guide");
    if (has(state, "preparation", "fried")) {
      add("/wine-with-fried-fish.html", "Best wine for fried fish");
    }
  }
  if (has(state, "protein", "poultry")) {
    add("/wine-with-chicken.html", "Best wine for chicken — pairing guide");
    if (has(state, "preparation", "roasted")) {
      add("/wine-with-roasted-chicken.html", "Best wine for roasted chicken");
    }
  }
  if (has(state, "protein", "pork")) {
    add("/wine-for-bbq-ribs.html", "Best wine for BBQ ribs — smoke & glaze");
    if (has(state, "preparation", "smoked")) {
      add("/wine-with-smoked-pork.html", "Best wine for smoked pork");
    }
  }
  if (has(state, "protein", "shellfish")) {
    add("/wine-with-salmon.html", "Best wine for salmon & rich seafood guides");
  }

  if (has(state, "spice", "spicy")) {
    add("/wine-with-spicy-food.html", "Best wine for spicy food");
  }

  if (has(state, "dairy", "soft_cheese")) {
    add("/wine-with-creamy-dishes.html", "Best wine for creamy dishes & soft cheese");
  }

  if (has(state, "preparation", "grilled") && !has(state, "protein", "red_meat")) {
    add("/wine-with-grilled-steak.html", "Best wine for grilled foods (steak lens)");
  }
  if (has(state, "preparation", "fried") && !has(state, "protein", "fish")) {
    add("/wine-with-fried-fish.html", "Best wine for fried foods (fish lens)");
  }

  /* --- Hub + matrix (always useful) --- */
  add("/pairings.html", "Explore all wine pairings");
  add("/pairing-matrix.html", "Printable wine pairing matrix overview");

  /* --- Grape cluster (varietals tied to common rows) --- */
  if (
    has(state, "protein", "red_meat") ||
    has(state, "preparation", "grilled") ||
    has(state, "preparation", "smoked")
  ) {
    add("/grapes/cabernet-sauvignon.html", "Cabernet Sauvignon — grape guide");
  }
  if (has(state, "protein", "fish") || has(state, "protein", "shellfish")) {
    add("/grapes/sauvignon-blanc.html", "Sauvignon Blanc — grape guide");
  }
  if (has(state, "spice", "spicy")) {
    add("/grapes/riesling.html", "Riesling — grape guide (acidity & sweetness)");
  }
  if (has(state, "protein", "poultry") || has(state, "dairy", "soft_cheese")) {
    add("/grapes/chardonnay.html", "Chardonnay — grape guide");
  }
  if (links.length < 5) {
    add("/grapes/pinot-noir.html", "Pinot Noir — grape guide");
  }

  /* --- Seasonal hub --- */
  add("/seasonal-wine-guides.html", "Seasonal wine guides — holidays & occasions");

  if (links.length === 0) {
    add("/wine-with-steak.html", "Best wine for steak");
    add("/wine-with-spicy-food.html", "Best wine for spicy food");
    add("/pairings.html", "Explore all wine pairings");
    add("/seasonal-wine-guides.html", "Seasonal wine guides");
    add("/grapes/cabernet-sauvignon.html", "Cabernet Sauvignon — grape guide");
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
      <p class="internal-links-lede">Curated from your current matrix rows — same logic as our <a href="/pairing-matrix.html">pairing matrix</a>.</p>
      <ul class="internal-links-list">
      ${lis}
      </ul>
    </section>
  `;
}
