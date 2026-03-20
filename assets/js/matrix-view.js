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

function getClass(val) {
  if (val === 3) return "cell-perfect";
  if (val === 2) return "cell-strong";
  if (val === 1) return "cell-ok";
  return "cell-none";
}

function dot(val) {
  if (val === 3 || val === 2 || val === 1) return "●";
  return "";
}

function formatLabel(str) {
  return str
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function cellTitle(val) {
  if (val === 3) return "Perfect pairing (poster large dot)";
  if (val === 2) return "Strong pairing";
  if (val === 1) return "Acceptable pairing";
  return "Avoid or poor pairing for this row";
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
          const cls = getClass(val);
          const title = escapeHtml(cellTitle(val));
          return `
          <div class="matrix-cell ${cls}" role="gridcell" title="${title}" aria-label="${title}">
            ${dot(val)}
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
