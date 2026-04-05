/**
 * Pairing guide pages: insight strip after H1 (term-linked + grape link).
 */

const PAIRING_PAGE =
  /\/wine-(with|for)-[^/]+\.html$/i.test(location.pathname);

if (PAIRING_PAGE) {
  const inject = () => {
    const h1 = document.querySelector(
      "main h1, main article h1, article h1, .container article h1"
    );
    if (!h1 || h1.nextElementSibling?.classList?.contains("quick-learn")) return;

    const div = document.createElement("div");
    div.className = "quick-learn";
    div.setAttribute("role", "note");
    div.innerHTML = `<p><strong>Quick insight:</strong> High <span class="term-link" role="button" tabindex="0" data-term="tannic">tannic</span> wines (like <a href="/grapes/cabernet-sauvignon.html">Cabernet Sauvignon</a>) bind to fat, reducing <span class="term-link" role="button" tabindex="0" data-term="astringent">astringent</span> edge and improving <span class="term-link" role="button" tabindex="0" data-term="balanced">balance</span> on the palate.</p>`;
    h1.insertAdjacentElement("afterend", div);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
}
