/**
 * Homepage: after ~400px scroll, show sticky CTA → term explorer.
 */

if (location.pathname === "/" || location.pathname === "/index.html") {
  const bar = document.getElementById("term-cta-sticky");
  if (bar) {
    document.body.classList.add("has-term-sticky");
    let armed = true;
    const onScroll = () => {
      if (!armed) return;
      if (window.scrollY < 400) return;
      armed = false;
      bar.classList.add("is-visible");
      bar.setAttribute("aria-hidden", "false");
      window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    bar.querySelector(".term-cta-sticky-btn")?.addEventListener("click", () => {
      import("./term-modal.js").then((m) => m.openTermExplorer());
    });
  }
}
