/**
 * Delegates .term-link clicks → lazy-loaded term modal (no eager modal bundle).
 */
function onActivate(el) {
  const slug = el.getAttribute("data-term");
  if (!slug) return;
  import("./term-modal.js")
    .then((m) => m.openTermModal(slug))
    .catch((err) => console.error(err));
}

document.body.addEventListener(
  "click",
  (e) => {
    const el = e.target.closest(".term-link[data-term]");
    if (!el) return;
    e.preventDefault();
    onActivate(el);
  },
  true
);

document.body.addEventListener(
  "keydown",
  (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const el = e.target.closest?.(".term-link[data-term]");
    if (!el) return;
    e.preventDefault();
    onActivate(el);
  },
  true
);
