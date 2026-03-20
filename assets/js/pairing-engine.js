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

const CATEGORIES = FILTER_GROUPS.map((g) => g.key);

/** @type {Record<string, Set<string>>} */
const state = Object.fromEntries(CATEGORIES.map((k) => [k, new Set()]));

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

function humanizeNode(key) {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatStyleTitle(style) {
  return humanizeNode(style);
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

function renderResults(root) {
  const container = root.querySelector("#results");
  if (!container) return;

  const rows = getResults();
  const selections = flattenSelections();

  container.innerHTML = rows
    .map((r) => {
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

      return `
        <div class="result-card">
          <h3>${escapeHtml(title)}</h3>
          <p class="result-meta">${escapeHtml(meta)}</p>
          <ul class="result-reasoning">${reasons}</ul>
        </div>
      `;
    })
    .join("");

  renderMatrix(state, rows);
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
  <p class="engine-lede">Multi-select food dimensions — each choice activates a matrix row. We score all nine wine style columns (0–3 per cell) and surface the top three matches with live reasoning.</p>
  <div class="filters">
    ${buildFilterMarkup()}
  </div>
  <div id="results" class="pairing-results" aria-live="polite"></div>
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
  const btn = e.target.closest("[data-pe-category][data-pe-value]");
  if (!btn) return;
  const cat = btn.getAttribute("data-pe-category");
  const val = btn.getAttribute("data-pe-value");
  if (cat && val) toggleSelection(cat, val);
}

export function initPairingEngine() {
  const root = document.getElementById("pairing-engine-root");
  if (!root) return;

  if (!root.querySelector(".filters")) {
    root.innerHTML = ENGINE_MARKUP;
  }

  root.classList.add("engine");
  root.addEventListener("click", onRootClick);
  syncButtonState(root);
  renderResults(root);

  window.setSelection = setSelection;
  window.toggleSelection = toggleSelection;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPairingEngine);
} else {
  initPairingEngine();
}
