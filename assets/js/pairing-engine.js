/**
 * Pairing Engine V2 — matrix-based intersection scoring (Wine Folly–style rows × wine styles).
 * Multi-select state; real-time recalculation; top 3 wine style families + reasoning.
 * Legacy RULES remain in pairing-data.js for future hybrid layering.
 */

import {
  PAIRING_MATRIX,
  WINE_STYLES,
  FILTER_GROUPS,
  CATEGORY_WEIGHTS,
} from "./pairing-data.js";
import { renderMatrix } from "./matrix-view.js";
import { generateContent } from "./content-engine.js";
import { injectInternalLinks } from "./internal-links.js";
import {
  buildResultExplanationHtml,
  buildStructureBreakdownHtml,
  buildEngineFeedbackHtml,
} from "./wine-semantic.js";

const CATEGORIES = FILTER_GROUPS.map((g) => g.key);

/** Valid matrix row ids per category (for safe page-context preload). */
const ALLOWED_VALUES = Object.fromEntries(
  FILTER_GROUPS.map((g) => [
    g.key,
    new Set(g.options.map((o) => o.value)),
  ])
);

/**
 * Empty authoring shape (arrays). Runtime state uses Sets — see `applyContext` + `resetSelections`.
 */
export const DEFAULT_STATE = Object.fromEntries(
  CATEGORIES.map((k) => [k, []])
);

/** @type {Record<string, Set<string>>} */
const state = Object.fromEntries(CATEGORIES.map((k) => [k, new Set()]));

/** Skip “Updating…” flash on first paint only */
let isFirstResultsPaint = true;

/**
 * Parse `?protein=fish,pork&preparation=grilled` into validated row ids per category.
 * @returns {Record<string, string[]>}
 */
function parseURLState() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const urlState = {};

  Object.keys(DEFAULT_STATE).forEach((key) => {
    if (!params.has(key)) return;
    const raw = params.get(key);
    if (raw == null || raw.trim() === "") return;
    const allowed = ALLOWED_VALUES[key];
    if (!allowed) return;
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((v) => allowed.has(v));
    if (parts.length) urlState[key] = parts;
  });

  return urlState;
}

/**
 * Priority: URL query > `window.PAIRING_CONTEXT` > empty.
 * When any category has valid URL values, URL fully drives initial state (no context merge).
 */
function initializeState() {
  CATEGORIES.forEach((k) => state[k].clear());

  const urlState = parseURLState();
  if (Object.keys(urlState).length > 0) {
    Object.entries(urlState).forEach(([key, values]) => {
      values.forEach((v) => state[key].add(v));
    });
    return;
  }

  applyContext();
}

/**
 * Merge `window.PAIRING_CONTEXT` into engine state (arrays of row ids per category).
 * Invalid keys/values are ignored. Used when URL has no engine params.
 * @returns {boolean} true if at least one value was applied
 */
function applyContext() {
  const ctx = typeof window !== "undefined" ? window.PAIRING_CONTEXT : null;
  if (!ctx || typeof ctx !== "object") return false;

  let applied = false;
  Object.entries(ctx).forEach(([key, values]) => {
    if (!state[key] || !Array.isArray(values)) return;
    const allowed = ALLOWED_VALUES[key];
    if (!allowed) return;
    values.forEach((v) => {
      if (typeof v === "string" && allowed.has(v)) {
        state[key].add(v);
        applied = true;
      }
    });
  });
  return applied;
}

function updateURL() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams();
  Object.entries(state).forEach(([key, values]) => {
    const arr = values instanceof Set ? [...values] : [];
    if (arr.length > 0) params.set(key, arr.join(","));
  });
  const qs = params.toString();
  const hash = window.location.hash || "";
  const newURL = qs
    ? `${window.location.pathname}?${qs}${hash}`
    : `${window.location.pathname}${hash}`;
  window.history.replaceState({}, "", newURL);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function flattenSelections() {
  return CATEGORIES.flatMap((cat) => [...state[cat]]);
}

function scrollEngineIntoViewIfSelections() {
  if (typeof window === "undefined") return;
  if (flattenSelections().length === 0) return;

  const prefersReduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  requestAnimationFrame(() => {
    document.getElementById("pairing-engine-root")?.scrollIntoView({
      behavior: prefersReduce ? "auto" : "smooth",
      block: "start",
    });
  });
}

/** Micro “system responding” cue after each successful paint (CSS-only). */
function pulseEngine(root) {
  const el =
    root || document.getElementById("pairing-engine-root");
  if (!el) return;
  const prefersReduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduce) return;

  el.classList.remove("is-updating");
  void el.offsetWidth;
  el.classList.add("is-updating");
  window.setTimeout(() => el.classList.remove("is-updating"), 180);
}

function humanizeNode(key) {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatStyleTitle(style) {
  return humanizeNode(style);
}

function hasSelection(category, value) {
  return !!state[category]?.has(value);
}

const STYLE_STRUCTURE = {
  bold_red: { acidity: "medium", tannin: "high", body: "full", sweetness: "dry" },
  medium_red: { acidity: "medium", tannin: "medium", body: "medium", sweetness: "dry" },
  light_red: { acidity: "high", tannin: "low", body: "light", sweetness: "dry" },
  rose: { acidity: "high", tannin: "low", body: "light", sweetness: "dry" },
  rich_white: { acidity: "medium", tannin: "low", body: "full", sweetness: "dry" },
  light_white: { acidity: "high", tannin: "low", body: "light", sweetness: "dry" },
  sparkling: { acidity: "high", tannin: "low", body: "light", sweetness: "dry" },
  sweet_white: { acidity: "high", tannin: "low", body: "medium", sweetness: "off-dry" },
  dessert: { acidity: "medium", tannin: "low", body: "full", sweetness: "off-dry" },
};

function buildStructureReason(topWine) {
  const profile = STYLE_STRUCTURE[topWine.style];
  if (!profile) return "";

  const reasons = [];

  if (profile.acidity === "high") {
    reasons.push("its acidity cuts through richness");
  }

  if (profile.tannin === "high") {
    reasons.push("its tannins bind with protein and fat");
  }

  if (profile.body === "full") {
    reasons.push("its body matches the weight of the dish");
  }

  if (profile.sweetness === "off-dry") {
    reasons.push("a touch of sweetness balances spice");
  }

  if (reasons.length === 0) return "";

  return `, because ${reasons.join(", ")}`;
}

function generateSommelierText(topWine) {
  const parts = [];

  if (hasSelection("protein", "red_meat")) {
    parts.push("your dish is rich and protein-heavy");
  } else if (hasSelection("protein", "poultry")) {
    parts.push("your dish is lighter with moderate protein");
  } else if (hasSelection("protein", "fish")) {
    parts.push("your dish is delicate and lean");
  }

  if (hasSelection("preparation", "grilled")) {
    parts.push("the grilled preparation adds char and intensity");
  }
  if (hasSelection("preparation", "fried")) {
    parts.push("the frying adds fat and crisp texture");
  }
  if (hasSelection("preparation", "roasted")) {
    parts.push("roasting adds depth and savory notes");
  }

  if (state.dairy?.size > 0) {
    parts.push("there is added richness from dairy");
  }

  if (hasSelection("spice", "spicy")) {
    parts.push("spice requires a wine that will not amplify heat");
  }

  if (hasSelection("starch", "sweet_starch") || hasSelection("fruit", "ripe_fruit")) {
    parts.push("sweetness needs balance from acidity or residual sugar");
  }

  let explanation = "";
  if (parts.length > 0) {
    explanation = `Because ${parts.join(", ")}, `;
  }

  const wineLabel = formatStyleTitle(topWine.style);
  explanation += `a <strong>${escapeHtml(wineLabel)}</strong> works best`;
  explanation += buildStructureReason(topWine);

  return `${explanation}.`;
}

/**
 * Weighted matrix score + contradiction penalty (zeros add flat penalty so bad rows don't rank high).
 * @param {string} style
 */
function scoreWineStyle(style) {
  let total = 0;
  let weightTotal = 0;
  let penalty = 0;

  Object.entries(state).forEach(([category, selections]) => {
    selections.forEach((selection) => {
      const row = PAIRING_MATRIX[selection];
      if (!row) return;

      const value = row[style] ?? 0;
      const weight = CATEGORY_WEIGHTS[category] ?? 1;

      total += value * weight;
      weightTotal += 3 * weight;

      if (value === 0) penalty += 10;
    });
  });

  if (weightTotal === 0) return 50;

  let score = (total / weightTotal) * 100;
  score -= penalty;

  return Math.max(0, Math.round(score));
}

/**
 * Explain top drivers for this style from current selections (max 3 lines).
 * @param {string} style
 */
function buildReasoning(style) {
  const positives = [];
  const negatives = [];

  flattenSelections().forEach((selection) => {
    const val = PAIRING_MATRIX[selection]?.[style];
    if (val === undefined) return;
    const label = humanizeNode(selection);
    if (val === 3) positives.push(`${label} is an ideal match`);
    if (val === 0) negatives.push(`${label} conflicts`);
  });

  return [...positives.slice(0, 2), ...negatives.slice(0, 1)];
}

function baselineReasons() {
  return [
    "Baseline view: no matrix rows selected yet — each wine style family is shown at 50%.",
    "Multi-select proteins, preparation, dairy, vegetables, spice, and starch to intersect rows (poster logic).",
  ];
}

function getResults() {
  const selections = flattenSelections();

  if (selections.length === 0) {
    const sorted = [...WINE_STYLES].sort();
    return sorted.slice(0, 3).map((style) => ({
      style,
      score: 50,
      baseline: true,
    }));
  }

  return WINE_STYLES.map((style) => ({
    style,
    score: scoreWineStyle(style),
    baseline: false,
  }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.style.localeCompare(b.style);
    })
    .slice(0, 3);
}

function animateResultCards(container) {
  requestAnimationFrame(() => {
    container.querySelectorAll(".result-card").forEach((el) => {
      el.classList.add("result-card-enter");
      setTimeout(() => el.classList.add("result-card-active"), 10);
    });
  });
}

function paintResults(root) {
  const container = root.querySelector("#results");
  if (!container) return;
  const sommelierEl = root.querySelector("#sommelier-output");

  const rows = getResults();
  const selections = flattenSelections();

  const topRow = rows[0];
  const primaryInner =
    topRow && !topRow.baseline && selections.length > 0
      ? buildResultExplanationHtml(topRow.style, state, { primary: true })
      : "";

  const primaryBlock =
    primaryInner !== ""
      ? `<div class="pairing-explanation-primary"><h3 class="explanation-title">Why these wines work</h3>${primaryInner}</div>`
      : "";

  const cardsHtml = rows
    .map((r, i) => {
      let lines = r.baseline ? baselineReasons() : buildReasoning(r.style);
      if (!r.baseline && lines.length === 0) {
        lines = [
          "No strong support/conflict flags from your current rows for this style — try adding more dimensions.",
        ];
      }

      const reasons = lines
        .map((t) => `<li>${escapeHtml(t)}</li>`)
        .join("");

      const title = formatStyleTitle(r.style);
      const meta = r.baseline
        ? "50% baseline — add food rows to score"
        : `${r.score}% matrix match · ${selections.length} active row${selections.length === 1 ? "" : "s"}`;

      const topClass = i === 0 ? " top-result" : "";

      return `
        <div class="result-card${topClass}">
          <h3>${escapeHtml(title)}</h3>
          <p class="result-meta">${escapeHtml(meta)}</p>
          <ul class="result-reasoning">${reasons}</ul>
        </div>
      `;
    })
    .join("");

  container.innerHTML = `${primaryBlock}<div class="pairing-results-cards" aria-label="Top wine style matches">${cardsHtml}</div>`;

  if (sommelierEl) {
    if (rows.length > 0 && selections.length > 0 && !rows[0].baseline) {
      sommelierEl.innerHTML = generateSommelierText(rows[0]);
      sommelierEl.hidden = false;
    } else {
      sommelierEl.innerHTML = "";
      sommelierEl.hidden = true;
    }
  }

  const feedbackEl = root.querySelector("#engine-feedback");
  if (feedbackEl) {
    feedbackEl.innerHTML =
      selections.length > 0 && topRow
        ? buildEngineFeedbackHtml(state, topRow.style)
        : "";
  }

  renderMatrix(state, rows);
  renderActiveSelections(root);
  animateResultCards(container);
  updateURL();

  const dynamic = generateContent(state, rows);
  renderDynamicContent(dynamic);
  injectInternalLinks(state);

  import("./term-auto-link.js").then((m) => {
    m.rescanTermLinks(document.getElementById("dynamic-content"));
    m.rescanTermLinks(document.getElementById("internal-links"));
    m.rescanTermLinks(container);
    m.rescanTermLinks(feedbackEl);
  });

  pulseEngine(root);
}

/**
 * Long-form explanations beside the engine (same for URL + page context).
 * @param {{ why: string; topWines: { label: string; score: number; baseline: boolean }[]; avoid: string[]; tips: string }} content
 */
function renderDynamicContent(content) {
  const root = document.getElementById("dynamic-content");
  if (!root) return;

  const structureInner =
    flattenSelections().length > 0 ? buildStructureBreakdownHtml(state) : "";
  const structureBlock = structureInner
    ? `<section class="structure-breakdown" aria-label="Structure breakdown">${structureInner}</section>`
    : "";

  const avoidText =
    content.avoid.length > 0
      ? content.avoid.join(", ")
      : "No wine style column hits zero on your selected rows — still watch weight and acidity so the bottle doesn’t overpower the plate.";

  const topHtml = content.topWines
    .map((w) => {
      const meta = w.baseline
        ? " — reference order until you add rows"
        : ` — ${w.score}% matrix match`;
      return `<li><strong>${escapeHtml(w.label)}</strong>${escapeHtml(meta)}</li>`;
    })
    .join("");

  root.innerHTML = `
    <section class="dynamic-section" aria-live="polite">
      ${structureBlock}
      <h2>Why This Works</h2>
      <p>${escapeHtml(content.why)}</p>

      <h2>Top Wines</h2>
      <ul class="dynamic-top-wines">${topHtml}</ul>

      <h2>Wines to Avoid</h2>
      <p>${escapeHtml(avoidText)}</p>

      <h2>Serving Tips</h2>
      <p>${escapeHtml(content.tips)}</p>
    </section>
  `;
}

function renderResults(root) {
  const container = root.querySelector("#results");
  if (!container) return;

  if (isFirstResultsPaint) {
    isFirstResultsPaint = false;
    paintResults(root);
    return;
  }

  container.innerHTML = "<p class=\"loading\">Updating pairing…</p>";
  setTimeout(() => paintResults(root), 55);
}

/**
 * Summary of current picks; chips remove via same toggle as filter buttons.
 * @param {HTMLElement} root
 */
function renderActiveSelections(root) {
  const container =
    root.querySelector("#active-selections") ||
    document.getElementById("active-selections");
  if (!container) return;

  const pairs = FILTER_GROUPS.flatMap(({ key }) => {
    const bag = state[key];
    const values =
      bag instanceof Set ? [...bag] : Array.isArray(bag) ? bag : [];
    return values.map((v) => ({ cat: key, v }));
  });

  if (pairs.length === 0) {
    container.innerHTML =
      '<p class="active-selections-empty">Pick ingredients above — your choices appear here.</p>';
    return;
  }

  container.innerHTML = pairs
    .map(
      ({ cat, v }) =>
        `<button type="button" class="active-chip" data-pe-remove-cat="${escapeHtml(cat)}" data-pe-remove-val="${escapeHtml(v)}">${escapeHtml(humanizeNode(v))} <span aria-hidden="true">✕</span></button>`
    )
    .join(" ");
}

function resetSelections() {
  CATEGORIES.forEach((k) => state[k].clear());
  const root = document.getElementById("pairing-engine-root");
  if (root) {
    syncButtonState(root);
    renderResults(root);
  }
}

function syncButtonState(root) {
  root.querySelectorAll("[data-pe-category][data-pe-value]").forEach((btn) => {
    const cat = btn.getAttribute("data-pe-category");
    const val = btn.getAttribute("data-pe-value");
    if (!cat || !val) return;
    const on = state[cat]?.has(val);
    btn.classList.toggle("is-selected", !!on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function buildFilterMarkup() {
  return FILTER_GROUPS.map(
    (g) => `
    <div class="filter-group" role="group" aria-label="${escapeHtml(g.label)}">
      <span class="filter-label">${escapeHtml(g.label)}</span>
      <div class="filter-chips">
        ${g.options
          .map(
            (o) =>
              `<button type="button" class="filter-chip" data-pe-category="${escapeHtml(g.key)}" data-pe-value="${escapeHtml(o.value)}" aria-pressed="false">${escapeHtml(o.label)}</button>`
          )
          .join("")}
      </div>
    </div>
  `
  ).join("");
}

const ENGINE_MARKUP = `
  <h2 class="engine-title">Build Your Pairing</h2>
  <div id="active-selections" class="active-selections" aria-label="Current selections"></div>
  <p class="engine-lede engine-intro">Choose your ingredients — we calculate the best wine matches in real time.</p>
  <div class="filters">
    ${buildFilterMarkup()}
  </div>
  <button type="button" class="reset-btn">Reset</button>
  <div id="engine-feedback" class="engine-feedback" aria-live="polite"></div>
  <div id="sommelier-output" class="sommelier-output" hidden></div>
  <div id="results" class="pairing-results" aria-live="polite"></div>
  <button type="button" class="share-btn">Copy shareable link</button>
`;

export function toggleSelection(category, value) {
  if (!CATEGORIES.includes(category)) return;
  const set = state[category];
  if (set.has(value)) set.delete(value);
  else set.add(value);
  const root = document.getElementById("pairing-engine-root");
  if (root) {
    syncButtonState(root);
    renderResults(root);
  }
}

export function setSelection(category, value) {
  toggleSelection(category, value);
}

function onRootClick(e) {
  const removeChip = e.target.closest(
    ".active-chip[data-pe-remove-cat][data-pe-remove-val]"
  );
  if (removeChip) {
    const cat = removeChip.getAttribute("data-pe-remove-cat");
    const val = removeChip.getAttribute("data-pe-remove-val");
    if (cat && val) toggleSelection(cat, val);
    return;
  }

  if (e.target.closest(".reset-btn")) {
    e.preventDefault();
    resetSelections();
    return;
  }

  const btn = e.target.closest("[data-pe-category][data-pe-value]");
  if (!btn) return;
  const cat = btn.getAttribute("data-pe-category");
  const val = btn.getAttribute("data-pe-value");
  if (cat && val) toggleSelection(cat, val);
}

function copyPairingLink() {
  const href = window.location.href;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(href).then(
      () => {
        alert("Link copied");
      },
      () => {
        prompt("Copy this link:", href);
      }
    );
  } else {
    prompt("Copy this link:", href);
  }
}

export function initPairingEngine() {
  const root = document.getElementById("pairing-engine-root");
  if (!root) return;

  if (!root.querySelector(".filters")) {
    root.innerHTML = ENGINE_MARKUP;
  }

  initializeState();

  root.classList.add("engine");
  root.addEventListener("click", onRootClick);
  syncButtonState(root);
  renderResults(root);

  if (flattenSelections().length > 0) {
    scrollEngineIntoViewIfSelections();
  }

  window.setSelection = setSelection;
  window.toggleSelection = toggleSelection;
  window.resetSelections = resetSelections;
  window.copyPairingLink = copyPairingLink;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPairingEngine);
} else {
  initPairingEngine();
}
