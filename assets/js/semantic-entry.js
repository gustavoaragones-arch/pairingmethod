/**
 * Homepage: term shortcuts + unified taxonomy search (descriptor entity pages).
 */

import { HOMEPAGE_TERM_SHORTCUTS, WINE_TERMS } from "./wine-terms-data.js";
import { TAXONOMY_SEARCH_INDEX } from "./taxonomy-search-index.js";

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
    const tax = TAXONOMY_SEARCH_INDEX.find((e) => e.slug === slug);
    if (tax) {
      return `<a href="${escapeHtml(tax.href)}" class="term-shortcut-chip term-shortcut-chip-entity">${escapeHtml(tax.name)}</a>`;
    }
    const d = WINE_TERMS[slug];
    if (!d) return "";
    return `<button type="button" class="term-shortcut-chip term-link" data-term="${escapeHtml(slug)}">${escapeHtml(d.label)}</button>`;
  }).join("");
}

function legacyTermHaystack(slug, d) {
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

function setupSearch() {
  const input = document.getElementById("term-search-input");
  const results = document.getElementById("term-search-results");
  if (!input || !results) return;

  const taxonomyHits = TAXONOMY_SEARCH_INDEX.map((entry) => ({
    kind: "entity",
    slug: entry.slug,
    label: entry.name,
    category: entry.categoryName,
    href: entry.href,
    hay: entry.haystack,
  }));

  const legacyHits = Object.entries(WINE_TERMS)
    .filter(([slug]) => !taxonomyHits.some((t) => t.slug === slug))
    .map(([slug, d]) => ({
      kind: "modal",
      slug,
      label: d.label,
      category: categoryUi(d.categoryId),
      href: null,
      hay: legacyTermHaystack(slug, d),
    }));

  const all = [...taxonomyHits, ...legacyHits];

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
        '<p class="term-search-empty">No matching terms — try <a href="/terms/graphite">graphite</a>, <a href="/terms/grippy">grippy</a>, or <a href="/terms/austere">austere</a>.</p>';
      results.hidden = false;
      return;
    }

    results.innerHTML = `<ul class="term-search-list" role="listbox" aria-label="Matching terms">
      ${hits
        .map((x) => {
          if (x.kind === "entity") {
            return `<li role="option"><a class="term-search-hit term-search-hit-entity" href="${escapeHtml(x.href)}">${escapeHtml(x.label)} <span class="term-search-hit-cat">${escapeHtml(x.category)}</span></a></li>`;
          }
          return `<li role="option"><button type="button" class="term-search-hit" data-term="${escapeHtml(x.slug)}">${escapeHtml(x.label)} <span class="term-search-hit-cat">${escapeHtml(x.category)}</span></button></li>`;
        })
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

function boot() {
  renderShortcuts();
  setupSearch();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
