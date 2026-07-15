/**
 * KNOWLEDGE-04 — Term links: taxonomy entities navigate; legacy terms open modal.
 */

import { hasTaxonomyNode, taxonomyHref } from "./taxonomy-runtime.js";

function onActivate(el, slug) {
  if (hasTaxonomyNode(slug)) {
    const href = taxonomyHref(slug);
    if (href) {
      window.location.href = href;
      return;
    }
  }
  import("./term-modal.js")
    .then((m) => m.openTermModal(slug))
    .catch((err) => console.error(err));
}

document.body.addEventListener(
  "click",
  (e) => {
    const el = e.target.closest(".term-link[data-term]");
    if (!el) return;
    const slug = el.getAttribute("data-term");
    if (!slug) return;
    if (el.tagName === "A" && el.classList.contains("term-link-entity")) return;
    e.preventDefault();
    onActivate(el, slug);
  },
  true
);

document.body.addEventListener(
  "keydown",
  (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const el = e.target.closest?.(".term-link[data-term]");
    if (!el) return;
    if (el.tagName === "A" && el.classList.contains("term-link-entity")) return;
    e.preventDefault();
    const slug = el.getAttribute("data-term");
    if (slug) onActivate(el, slug);
  },
  true
);
