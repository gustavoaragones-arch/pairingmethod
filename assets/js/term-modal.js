/**
 * Wine term explorer — modal shell (SEO lives on /terms/*.html).
 */

import {
  WINE_TERMS,
  EXPLORER_CATEGORIES,
  TERM_CONNECTIONS,
} from "./wine-terms-data.js";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let modalEl = null;
let overlayEl = null;

function categoryLabel(id) {
  return EXPLORER_CATEGORIES.find((c) => c.id === id)?.label || id;
}

function categoryColor(id) {
  return EXPLORER_CATEGORIES.find((c) => c.id === id)?.color || "#333";
}

function ensureShell() {
  if (modalEl) return;

  overlayEl = document.createElement("div");
  overlayEl.className = "term-modal-overlay";
  overlayEl.setAttribute("role", "presentation");
  overlayEl.innerHTML = `
    <div class="term-modal" role="dialog" aria-modal="true" aria-labelledby="term-modal-title">
      <button type="button" class="term-modal-close" aria-label="Close">&times;</button>
      <div class="term-modal-header">
        <h2 id="term-modal-title" class="term-modal-title"></h2>
        <p class="term-modal-sub">Browse by category, or open a term for meaning and related concepts.</p>
        <div class="term-modal-cats" id="term-modal-cats"></div>
      </div>
      <div class="term-modal-body" id="term-modal-body"></div>
      <div class="term-modal-relationships" id="term-modal-relationships"></div>
    </div>
  `;
  document.body.appendChild(overlayEl);
  modalEl = overlayEl.querySelector(".term-modal");

  overlayEl.addEventListener("click", (e) => {
    if (e.target === overlayEl) closeTermModal();
  });
  overlayEl
    .querySelector(".term-modal-close")
    ?.addEventListener("click", closeTermModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlayEl?.classList.contains("is-open")) {
      closeTermModal();
    }
  });
}

function renderCategoryTabs(activeId) {
  const host = document.getElementById("term-modal-cats");
  if (!host) return;

  host.innerHTML = EXPLORER_CATEGORIES.map(
    (c) =>
      `<button type="button" class="term-modal-cat" data-cat="${escapeHtml(c.id)}" style="--cat:${c.color}">${escapeHtml(c.label)}</button>`
  ).join("");

  host.querySelectorAll(".term-modal-cat").forEach((btn) => {
    btn.classList.toggle(
      "is-active",
      btn.getAttribute("data-cat") === activeId
    );
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-cat");
      if (id) showCategoryList(id);
    });
  });
}

function termsInCategory(catId) {
  return Object.entries(WINE_TERMS)
    .filter(([, d]) => d.categoryId === catId)
    .sort((a, b) => a[1].label.localeCompare(b[1].label));
}

function showCategoryList(catId) {
  ensureShell();
  renderCategoryTabs(catId);
  const body = document.getElementById("term-modal-body");
  const title = document.getElementById("term-modal-title");
  if (!body || !title) return;

  title.textContent = categoryLabel(catId);
  const pairs = termsInCategory(catId);
  body.innerHTML = `
    <p class="term-modal-hint">Select a category above to explore wine descriptors. Each term links to related concepts — click any term for full meaning, related words, and opposites.</p>
    <ul class="term-modal-term-list">
      ${pairs
        .map(
          ([slug, d]) =>
            `<li><button type="button" class="term-modal-term-btn" data-term="${escapeHtml(slug)}">${escapeHtml(d.label)}</button></li>`
        )
        .join("")}
    </ul>
  `;
  body.querySelectorAll(".term-modal-term-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const s = btn.getAttribute("data-term");
      if (s) showTermDetail(s);
    });
  });

  const rel = document.getElementById("term-modal-relationships");
  if (rel) {
    rel.innerHTML = `
      <h3 class="term-modal-rel-h">Key relationships between categories</h3>
      <ul class="term-modal-rel-list">
        ${TERM_CONNECTIONS.map(
          (x) =>
            `<li><span class="term-modal-pill" style="--cat:${categoryColor(x.fromCategory)}">${escapeHtml(categoryLabel(x.fromCategory))}</span>
            → <span class="term-modal-pill" style="--cat:${categoryColor(x.toCategory)}">${escapeHtml(categoryLabel(x.toCategory))}</span>
            — ${escapeHtml(x.note)}</li>`
        ).join("")}
      </ul>
    `;
  }
}

function showTermDetail(slug) {
  ensureShell();
  const def = WINE_TERMS[slug];
  if (!def) return;

  renderCategoryTabs(def.categoryId);
  const title = document.getElementById("term-modal-title");
  const body = document.getElementById("term-modal-body");
  if (!title || !body) return;

  title.textContent = def.label;
  const rel = (def.related || [])
    .filter((s) => WINE_TERMS[s])
    .map(
      (s) =>
        `<button type="button" class="term-link term-link-inline" data-term="${escapeHtml(s)}">${escapeHtml(WINE_TERMS[s].label)}</button>`
    )
    .join(", ");
  const opp = (def.opposites || [])
    .filter((s) => WINE_TERMS[s])
    .map(
      (s) =>
        `<button type="button" class="term-link term-link-inline" data-term="${escapeHtml(s)}">${escapeHtml(WINE_TERMS[s].label)}</button>`
    )
    .join(", ");

  body.innerHTML = `
    <p class="term-modal-cat-badge" style="--cat:${categoryColor(def.categoryId)}">${escapeHtml(categoryLabel(def.categoryId))}</p>
    <p class="term-modal-def">${escapeHtml(def.definition)}</p>
    <h3 class="term-modal-h3">Context</h3>
    <p>${escapeHtml(def.context)}</p>
    <h3 class="term-modal-h3">Related terms</h3>
    <p>${rel || "—"}</p>
    <h3 class="term-modal-h3">Opposites / contrasts</h3>
    <p>${opp || "—"}</p>
    <p class="term-modal-seo"><a href="/terms/${escapeHtml(slug)}.html">Open full glossary page</a> (indexed reference)</p>
    <p><button type="button" class="term-modal-back">← Back to category</button></p>
  `;

  body.querySelector(".term-modal-back")?.addEventListener("click", () => {
    showCategoryList(def.categoryId);
  });

  document.getElementById("term-modal-relationships").innerHTML = "";
}

/**
 * @param {string} slugOrLabel term slug (preferred) or display label
 */
export function openTermModal(slugOrLabel) {
  if (typeof window !== "undefined") {
    window.openTermModal = openTermModal;
  }
  ensureShell();
  let slug = slugOrLabel;
  if (!WINE_TERMS[slug]) {
    const found = Object.entries(WINE_TERMS).find(
      ([, d]) => d.label.toLowerCase() === String(slugOrLabel).toLowerCase()
    );
    if (found) slug = found[0];
  }
  if (!WINE_TERMS[slug]) {
    console.warn("Unknown term:", slugOrLabel);
    return;
  }
  showTermDetail(slug);
  overlayEl.classList.add("is-open");
  document.body.classList.add("term-modal-open");
  modalEl.querySelector(".term-modal-close")?.focus();
}

export function closeTermModal() {
  overlayEl?.classList.remove("is-open");
  document.body.classList.remove("term-modal-open");
}

/** Category browser (sticky CTA / “explore terms” entry). */
export function openTermExplorer() {
  if (typeof window !== "undefined") {
    window.openTermExplorer = openTermExplorer;
  }
  ensureShell();
  const first = EXPLORER_CATEGORIES[0]?.id || "body_style";
  showCategoryList(first);
  overlayEl.classList.add("is-open");
  document.body.classList.add("term-modal-open");
  modalEl.querySelector(".term-modal-close")?.focus();
}
