/**
 * Latest pairing guides — injected on /pairings.html for crawl discovery (non-orphan pages).
 */
const latest = [
  { url: "/wine-with-grilled-steak.html", title: "Wine with Grilled Steak" },
  { url: "/wine-with-roasted-chicken.html", title: "Wine with Roasted Chicken" },
  { url: "/wine-with-fried-fish.html", title: "Wine with Fried Fish" },
  { url: "/wine-with-spicy-food.html", title: "Wine for Spicy Food" },
];

const container = document.getElementById("latest-pages");

if (container) {
  container.innerHTML = latest
    .map(
      (p) =>
        `<li><a href="${p.url}">${p.title}</a></li>`
    )
    .join("");
}
