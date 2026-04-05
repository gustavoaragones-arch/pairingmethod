/**
 * Maps matrix state + wine style → semantic explanation HTML (term-linked).
 */

import { WINE_STYLE_SEMANTICS } from "./pairing-data.js";
import { WINE_TERMS } from "./wine-terms-data.js";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function flattenState(state) {
  return Object.values(state).flatMap((bag) =>
    bag instanceof Set ? [...bag] : Array.isArray(bag) ? bag : []
  );
}

/**
 * @param {string} slug
 * @returns {string}
 */
export function termLinkHtml(slug) {
  if (!slug || !WINE_TERMS[slug]) {
    return escapeHtml(slug || "");
  }
  const label = WINE_TERMS[slug].label;
  return `<span class="term-link" role="button" tabindex="0" data-term="${escapeHtml(slug)}">${escapeHtml(label)}</span>`;
}

/**
 * @param {string[]} slugs
 * @param {number} max
 */
export function termLinksJoin(slugs, max = 4) {
  const use = slugs.filter((s) => WINE_TERMS[s]).slice(0, max);
  return use.map(termLinkHtml).join(", ");
}

/**
 * Context-aware bullets (HTML). Use opts.primary for block above wine cards (no inner title).
 * @param {string} style
 * @param {Record<string, Set<string>>} state
 * @param {{ primary?: boolean }} [opts]
 */
export function buildResultExplanationHtml(style, state, opts = {}) {
  const sem = WINE_STYLE_SEMANTICS[style];
  if (!sem) return "";

  const sel = new Set(flattenState(state));
  const has = (v) => sel.has(v);
  const bullets = [];

  const meatish =
    has("red_meat") || has("pork") || has("cured_meat") || has("poultry");
  const ocean = has("fish") || has("shellfish");
  const char = has("grilled") || has("smoked");
  const fry = has("fried");
  const heat = has("spicy");

  if (meatish && sem.tannin?.length) {
    bullets.push(
      `High tannin (${termLinksJoin(sem.tannin, 3)}) binds with protein and fat on the plate.`
    );
  }

  if ((ocean || fry || has("white_starch")) && sem.acidity?.length) {
    bullets.push(
      `Acidity (${termLinksJoin(sem.acidity, 3)}) refreshes the palate and cuts richness.`
    );
  }

  if (sem.fruit?.length && (char || meatish || ocean)) {
    bullets.push(
      `Fruit profile (${termLinksJoin(sem.fruit, 3)}) complements ${char ? "caramelized and savory" : "primary"} flavors in the dish.`
    );
  }

  if (char && sem.spice?.length) {
    bullets.push(
      `Oak and spice notes (${termLinksJoin(sem.spice, 3)}) echo char and smoke from the kitchen.`
    );
  }

  if (sem.earth?.length && (has("fungi") || has("root") || char || has("smoked"))) {
    bullets.push(
      `Savory earth tones (${termLinksJoin(sem.earth, 2)}) align with ${has("fungi") ? "umami" : "rustic"} elements.`
    );
  }

  if (heat) {
    bullets.push(
      `Spicy heat is often easier with slight sweetness or lower alcohol — try ${termLinksJoin(["off-dry", "ripe", "lush"], 2)} aromatic whites or lightly chilled reds with soft tannin.`
    );
  }

  if (bullets.length === 0) {
    if (sem.tannin?.length) {
      bullets.push(
        `Structure (${termLinksJoin(sem.tannin, 2)}) fits the weight of your selected rows.`
      );
    }
    if (sem.acidity?.length) {
      bullets.push(`Lift (${termLinksJoin(sem.acidity, 2)}) keeps the match fresh.`);
    }
    if (sem.fruit?.length) {
      bullets.push(`Fruit (${termLinksJoin(sem.fruit, 2)}) bridges flavor with the glass.`);
    }
  }

  const items = bullets.slice(0, 4).map((b) => `<li>${b}</li>`).join("");
  if (!items) return "";
  if (opts?.primary) {
    return `<ul class="result-explanation-list result-explanation-list--primary">${items}</ul>`;
  }
  return `<p class="result-explanation-lede"><strong>Why this works</strong></p><ul class="result-explanation-list">${items}</ul>`;
}

/**
 * “Structure breakdown” for dynamic column + matrix context.
 * @param {Record<string, Set<string>>} state
 */
export function buildStructureBreakdownHtml(state) {
  const sel = new Set(flattenState(state));
  if (sel.size === 0) return "";

  const has = (v) => sel.has(v);
  const rows = [];

  if (has("red_meat") || has("cured_meat")) {
    rows.push({
      k: "Protein",
      t: `binds tannin (${termLinksJoin(["grippy", "firm", "tannic"], 3)})`,
    });
  } else if (has("poultry")) {
    rows.push({
      k: "Protein",
      t: `likes moderate structure (${termLinksJoin(["silky", "supple", "bright"], 3)})`,
    });
  } else if (has("fish") || has("shellfish")) {
    rows.push({
      k: "Protein",
      t: `needs lift (${termLinksJoin(["crisp", "high-acidity", "citrus"], 3)})`,
    });
  }

  if (has("pork")) {
    rows.push({
      k: "Fat & smoke",
      t: `softened by acidity (${termLinksJoin(["fresh", "bright", "racy"], 3)}) or matched by ${termLinksJoin(["smoky", "spicy"], 2)}`,
    });
  } else if (has("red_meat") || has("dairy")) {
    rows.push({
      k: "Fat",
      t: `softened by acidity (${termLinksJoin(["bright", "fresh", "crisp"], 3)})`,
    });
  }

  if (has("grilled")) {
    rows.push({
      k: "Char",
      t: `mirrors oak spice (${termLinksJoin(["toasty", "smoky", "vanilla"], 3)})`,
    });
  }
  if (has("smoked")) {
    rows.push({
      k: "Smoke",
      t: `echoed by ${termLinksJoin(["smoky", "earthy", "leathery"], 3)}`,
    });
  }
  if (has("roasted")) {
    rows.push({
      k: "Roast",
      t: `pairs with ${termLinksJoin(["toasty", "rich", "concentrated"], 3)}`,
    });
  }
  if (has("fried")) {
    rows.push({
      k: "Fry",
      t: `cut by ${termLinksJoin(["crisp", "zesty", "high-acidity"], 3)}`,
    });
  }
  if (has("spicy")) {
    rows.push({
      k: "Heat",
      t: `often needs ${termLinksJoin(["off-dry", "ripe", "lush"], 2)} or modest alcohol`,
    });
  }

  if (rows.length === 0) return "";

  const inner = rows
    .map((r) => `<p><strong>${escapeHtml(r.k)}</strong> → ${r.t}</p>`)
    .join("");
  return `<h3 class="structure-breakdown-title">Structure breakdown</h3><div class="structure-breakdown-body">${inner}</div>`;
}

/**
 * Live engine feedback: detected dish signals + recommended wine structure (term-linked).
 * @param {Record<string, Set<string>>} state
 * @param {string} topStyle
 */
export function buildEngineFeedbackHtml(state, topStyle) {
  const sel = new Set(flattenState(state));
  if (sel.size === 0) return "";

  const has = (v) => sel.has(v);
  const detected = [];

  if (has("red_meat") || has("pork") || has("cured_meat")) {
    detected.push(
      `<li><strong>High fat / protein</strong> — supports ${termLinkHtml("tannic")}, ${termLinkHtml("firm")} structure without harsh ${termLinkHtml("astringent")} clash.</li>`
    );
  }
  if (has("poultry")) {
    detected.push(
      `<li><strong>Poultry</strong> — mid-weight plates favor ${termLinkHtml("bright")} acid and ${termLinkHtml("silky")} or ${termLinkHtml("soft")} tannin.</li>`
    );
  }
  if (has("fish") || has("shellfish")) {
    detected.push(
      `<li><strong>Seafood</strong> — calls for ${termLinkHtml("high-acidity")}, ${termLinkHtml("crisp")}, ${termLinkHtml("citrus")}-driven profiles.</li>`
    );
  }
  if (has("fungi") || has("pungent_cheese")) {
    detected.push(
      `<li><strong>Umami-rich</strong> — ${termLinkHtml("earthy")}, ${termLinkHtml("leathery")}, and ${termLinkHtml("structured")} wines track savory depth.</li>`
    );
  }
  if (has("grilled")) {
    detected.push(
      `<li><strong>Grilled</strong> — ${termLinkHtml("smoky")}, ${termLinkHtml("toasty")}, and ${termLinkHtml("spicy")} oak tones mirror char.</li>`
    );
  }
  if (has("fried")) {
    detected.push(
      `<li><strong>Fried</strong> — fat and crust need ${termLinkHtml("zesty")} or ${termLinkHtml("racy")} acid (or bubbles) to cut.</li>`
    );
  }
  if (has("smoked")) {
    detected.push(
      `<li><strong>Smoked</strong> — smoke aligns with ${termLinkHtml("smoky")}, ${termLinkHtml("earthy")}, ${termLinkHtml("leathery")} wine vectors.</li>`
    );
  }
  if (has("spicy")) {
    detected.push(
      `<li><strong>Heat-forward</strong> — often easier with ${termLinkHtml("off-dry")}, ${termLinkHtml("ripe")} fruit, or lower alcohol.</li>`
    );
  }
  if (has("soft_cheese") || has("hard_cheese")) {
    detected.push(
      `<li><strong>Cheese / dairy fat</strong> — ${termLinkHtml("crisp")} whites or structured reds depending on intensity.</li>`
    );
  }

  const sem = WINE_STYLE_SEMANTICS[topStyle];
  const recItems = [];
  if (sem) {
    recItems.push(
      `<li><strong>Tannin</strong> — ${termLinksJoin(sem.tannin?.length ? sem.tannin : ["soft", "silky"], 4)}</li>`
    );
    recItems.push(
      `<li><strong>Body</strong> — ${termLinksJoin(sem.body?.length ? sem.body : ["light-bodied"], 4)}</li>`
    );
    recItems.push(
      `<li><strong>Acidity</strong> — ${termLinksJoin(sem.acidity?.length ? sem.acidity : ["fresh"], 4)}</li>`
    );
  }

  if (detected.length === 0 && recItems.length === 0) return "";

  return `
    <div class="engine-feedback-inner">
      ${
        detected.length
          ? `<h3 class="engine-feedback-title">Detected profile</h3><ul class="engine-feedback-list">${detected.join("")}</ul>`
          : ""
      }
      ${
        recItems.length
          ? `<h3 class="engine-feedback-title">Recommended wine structure</h3><ul class="engine-feedback-list engine-feedback-list--rec">${recItems.join("")}</ul>`
          : ""
      }
    </div>
  `;
}
