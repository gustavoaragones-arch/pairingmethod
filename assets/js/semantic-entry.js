/**
 * Homepage: term shortcuts + search (filters WINE_TERMS → modal).
 */

import { HOMEPAGE_TERM_SHORTCUTS, WINE_TERMS } from "./wine-terms-data.js";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderShortcuts() {
  const host = document.getElementById("term-shortcuts");
  if (!host) return;

  host.innerHTML = HOMEPAGE_TERM_SHORTCUTS.map((slug) => {
    const d = WINE_TERMS[slug];
    if (!d) return "";
    return `<button type="button" class="term-shortcut-chip term-link" data-term="${escapeHtml(slug)}">${escapeHtml(d.label)}</button>`;
  }).join("");
}

function termSearchHaystack(slug, d) {
  return [
    slug,
    d.label,
    ...(d.phrases || []),
    categoryHay(d.categoryId),
  ]
    .join(" ")
    .toLowerCase();
}

function categoryHay(id) {
  const m = {
    body_style: "body style weight",
    tannin: "tannin",
    acidity: "acidity acid",
    fruit: "fruit",
    spice_oak: "spice oak toast",
    flower_herb_earth: "earth herb flower",
    yeast: "yeast lees",
    alcohol: "alcohol",
  };
  return m[id] || id;
}

function categoryUi(id) {
  const m = {
    body_style: "Body & style",
    tannin: "Tannin",
    acidity: "Acidity",
    fruit: "Fruit",
    spice_oak: "Spice & oak",
    flower_herb_earth: "Earth & herbs",
    yeast: "Yeast",
    alcohol: "Alcohol",
  };
  return m[id] || id;
}

function setupSearch() {
  const input = document.getElementById("term-search-input");
  const results = document.getElementById("term-search-results");
  if (!input || !results) return;

  const all = Object.entries(WINE_TERMS).map(([slug, d]) => ({
    slug,
    d,
    hay: termSearchHaystack(slug, d),
  }));

  function renderList(q) {
    const query = q.trim().toLowerCase();
    if (!query) {
      results.innerHTML = "";
      results.hidden = true;
      return;
    }

    const hits = all
      .filter((x) => x.hay.includes(query))
      .slice(0, 24);

    if (hits.length === 0) {
      results.innerHTML =
        '<p class="term-search-empty">No matching terms — try <span class="term-link" role="button" tabindex="0" data-term="jammy">jammy</span>, <span class="term-link" role="button" tabindex="0" data-term="tannic">tannic</span>, or <span class="term-link" role="button" tabindex="0" data-term="high-acidity">high acidity</span>.</p>';
      results.hidden = false;
      return;
    }

    results.innerHTML = `<ul class="term-search-list" role="listbox" aria-label="Matching terms">
      ${hits
        .map(
          (x) =>
            `<li role="option"><button type="button" class="term-search-hit" data-term="${escapeHtml(x.slug)}">${escapeHtml(x.d.label)} <span class="term-search-hit-cat">${escapeHtml(categoryUi(x.d.categoryId))}</span></button></li>`
        )
        .join("")}
    </ul>`;
    results.hidden = false;

    results.querySelectorAll(".term-search-hit[data-term]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slug = btn.getAttribute("data-term");
        if (!slug) return;
        import("./term-modal.js").then((m) => m.openTermModal(slug));
      });
    });
  }

  let t = 0;
  input.addEventListener("input", () => {
    clearTimeout(t);
    t = window.setTimeout(() => renderList(input.value), 120);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      renderList("");
    }
  });
}

function boot() {
  renderShortcuts();
  setupSearch();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
