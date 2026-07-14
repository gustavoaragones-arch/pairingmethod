/**
 * Latest pairing guides — injected on /pairings.html for crawl discovery (non-orphan pages).
 */
const container = document.getElementById("latest-pages");

if (container) {
  import("../../lib/public-url.js").then(({ pairingUrl }) => {
    const latest = [
      { url: pairingUrl("wine-with-grilled-steak"), title: "Wine with Grilled Steak" },
      { url: pairingUrl("wine-with-roasted-chicken"), title: "Wine with Roasted Chicken" },
      { url: pairingUrl("wine-with-fried-fish"), title: "Wine with Fried Fish" },
      { url: pairingUrl("wine-with-spicy-food"), title: "Wine for Spicy Food" },
    ];

    container.innerHTML = latest
      .map(
        (p) =>
          `<li><a href="${p.url}">${p.title}</a></li>`
      )
      .join("");
  });
}
