/**
 * KNOWLEDGE-04 — Pairing guide quick insight from taxonomy descriptors.
 */

import { grapeUrl } from "../../lib/public-url.js";
import { hasTaxonomyNode } from "./taxonomy-runtime.js";

const PAIRING_PAGE =
  /\/wine-(with|for)-[^/]+(?:\.html)?\/?$/i.test(location.pathname);

function termEntityLink(slug, label) {
  if (hasTaxonomyNode(slug)) {
    return `<a href="/terms/${slug}" class="term-link term-link-entity">${label}</a>`;
  }
  return `<span class="term-link" role="button" tabindex="0" data-term="${slug}">${label}</span>`;
}

if (PAIRING_PAGE) {
  const inject = () => {
    const h1 = document.querySelector(
      "main h1, main article h1, article h1, .container article h1"
    );
    if (!h1 || h1.nextElementSibling?.classList?.contains("quick-learn")) return;

    const div = document.createElement("div");
    div.className = "quick-learn";
    div.setAttribute("role", "note");
    div.innerHTML = `<p><strong>Quick insight:</strong> High ${termEntityLink("tannic", "tannic")} wines (like <a href="${grapeUrl("cabernet-sauvignon")}">Cabernet Sauvignon</a>) bind to fat, reducing ${termEntityLink("astringent", "astringent")} edge and improving ${termEntityLink("balanced", "balance")} on the palate.</p>`;
    h1.insertAdjacentElement("afterend", div);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
}
