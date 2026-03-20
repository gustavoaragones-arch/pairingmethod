#!/usr/bin/env python3
"""One-off batch: site footer, mini-disclaimer, email consistency. Run from repo root."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

FOOTER = """<footer class="site-footer">
  <div class="container footer-grid">

    <div class="footer-brand">
      <div class="footer-logo">Pairing Method</div>
      <p class="footer-tagline">
        Structured wine pairing intelligence based on culinary principles.
      </p>
    </div>

    <div class="footer-links">
      <div>
        <strong>Explore</strong>
        <a href="/pairings.html">Pairings</a>
        <a href="/seasonal-wine-guides.html">Seasonal</a>
        <a href="/pairing-matrix.html">Pairing Matrix</a>
      </div>

      <div>
        <strong>Resources</strong>
        <a href="/grapes/cabernet-sauvignon.html">Cabernet Sauvignon</a>
        <a href="/grapes/pinot-noir.html">Pinot Noir</a>
        <a href="/grapes/chardonnay.html">Chardonnay</a>
      </div>

      <div>
        <strong>Company</strong>
        <a href="/about.html">About</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
        <a href="/disclaimer.html">Disclaimer</a>
      </div>
    </div>

    <div class="footer-meta">
      <p>Operated by Albor Digital LLC</p>
      <p>Wyoming, United States</p>
      <p>
        <a href="mailto:contact@pairingmethod.com">
          contact@pairingmethod.com
        </a>
      </p>
    </div>

  </div>

  <div class="footer-bottom">
    © Pairing Method — All rights reserved
  </div>
</footer>"""

DISCLAIMER_RE = re.compile(
    r"<section class=\"disclaimer\">[\s\S]*?</section>",
    re.MULTILINE,
)

MINI = """<section class="mini-disclaimer">
      <p>
        Pairing guidance is based on general culinary principles and may vary by preparation and preference.
      </p>
    </section>"""


def patch_file(path: Path) -> None:
    t = path.read_text(encoding="utf-8")
    orig = t

    # Footer
    t = re.sub(r"<footer[\s\S]*?</footer>", FOOTER, t, count=1)

    # Email (all occurrences)
    t = t.replace("contact@albor.digital", "contact@pairingmethod.com")

    # Disclaimer → mini (not on disclaimer.html full page duplicate)
    name = path.name
    if name == "disclaimer.html":
        # Remove trailing duplicate site disclaimer block inside main only
        t = DISCLAIMER_RE.sub("", t, count=1)
    else:
        t = DISCLAIMER_RE.sub(MINI, t)

    if t != orig:
        path.write_text(t, encoding="utf-8")
        print("patched", path.relative_to(ROOT))


def main():
    html_files = list(ROOT.rglob("*.html"))
    for p in sorted(html_files):
        if "node_modules" in p.parts:
            continue
        patch_file(p)


if __name__ == "__main__":
    main()
