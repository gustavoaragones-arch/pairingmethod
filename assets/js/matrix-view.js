/**
 * Live heatmap: rows = active food matrix keys, columns = wine styles, cells = 0–3 strength.
 * Stays in sync with pairing-engine state and top-3 results (header highlight).
 */

import { PAIRING_MATRIX, WINE_STYLES, FILTER_GROUPS } from "./pairing-data.js";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Flatten selections in stable category order; supports Set or array buckets. */
function activeSelectionsOrdered(state) {
  const out = [];
  for (const { key } of FILTER_GROUPS) {
    const bag = state[key];
    if (!bag) continue;
    if (bag instanceof Set) {
      out.push(...bag);
    } else if (Array.isArray(bag)) {
      out.push(...bag);
    }
  }
  return out;
}

/**
 * Single source of truth mapping a 0–3 matrix value to one of the three
 * approved semantic states. Shared by the matrix cells and the "Why This
 * Works" bullets (pairing-engine.js imports this) so the same underlying
 * value always produces the same icon and label everywhere — never a
 * second, independent classification.
 * @param {number} val
 */
export function getMatchStatus(val) {
  if (val >= 3) return { symbol: "✓", label: "Ideal Match", cssClass: "status-ideal" };
  if (val >= 1) return { symbol: "−", label: "Works Well", cssClass: "status-works" };
  return { symbol: "×", label: "Not a Match", cssClass: "status-none" };
}

/**
 * Renders one status icon: colored circle + symbol, never color alone.
 * Always aria-hidden — the icon is a visual reinforcement of meaning that
 * an enclosing element or adjacent text already states in full (the
 * matrix cell's own aria-label, or the "Why This Works" bullet's
 * sentence). Giving the icon its own aria-label as well would duplicate
 * that announcement for screen reader users, not add information.
 */
export function statusIconHtml(val) {
  const status = getMatchStatus(val);
  return `<span class="status-icon ${status.cssClass}" aria-hidden="true">${status.symbol}</span>`;
}

function formatLabel(str) {
  return str
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Accessible per-cell label: "{Food} — {Wine}: {Status}" (never color-only). */
function cellAriaLabel(selection, style, val) {
  const food = formatLabel(selection);
  const wine = formatLabel(style);
  const { label } = getMatchStatus(val);
  return `${food} — ${wine}: ${label}`;
}

function isTop(style, results) {
  return results.some((r) => r.style === style);
}

/**
 * @param {Record<string, Set<string>|string[]>} state
 * @param {{ style: string; score?: number; baseline?: boolean }[]} results
 */
export function renderMatrix(state, results) {
  const root = document.getElementById("matrix-root");
  if (!root) return;

  const activeSelections = activeSelectionsOrdered(state);

  const header = `
    <div class="matrix-row matrix-header" role="row">
      <div class="matrix-label matrix-corner" role="columnheader"></div>
      ${WINE_STYLES.map(
        (style) => `
        <div class="matrix-cell matrix-col ${isTop(style, results) ? "is-top" : ""}" role="columnheader">
          ${escapeHtml(formatLabel(style))}
        </div>
      `
      ).join("")}
    </div>
  `;

  const rows = activeSelections
    .map((sel) => {
      const row = PAIRING_MATRIX[sel];
      if (!row) return "";

      return `
      <div class="matrix-row is-active" role="row">
        <div class="matrix-label" role="rowheader">${escapeHtml(formatLabel(sel))}</div>
        ${WINE_STYLES.map((style) => {
          const val = row[style] ?? 0;
          const label = escapeHtml(cellAriaLabel(sel, style, val));
          return `
          <div class="matrix-cell" role="gridcell" aria-label="${label}">
            ${statusIconHtml(val)}
          </div>
        `;
        }).join("")}
      </div>
    `;
    })
    .join("");

  root.innerHTML = `
    <section class="matrix" aria-label="Food and wine pairing heatmap">
      ${header}
      ${rows || `<div class="matrix-empty" role="status">Select ingredients to visualize pairings</div>`}
    </section>
  `;
}
