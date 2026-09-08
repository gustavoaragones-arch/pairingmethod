# PAIRING-EAT-22 — AdSense P1 Remediation

## 1. Scope

Remediated exactly three EAT-21 P1 blockers:

| ID | Issue | Status |
|---|---|---|
| P1-LEGAL-01 | Disclaimer Canada/US jurisdiction vs Wyoming operator | **PASS** |
| P1-LEGAL-02 | Privacy intro reused Terms wording | **PASS** |
| P1-TRUST-01 | Six generated pages retained "Sommelier Verdict" | **PASS** |

No evidence work, no AdSense activation, no quarantine publication, no pairing-engine changes.

## 2. P1-LEGAL-01 Remediation

**Authoritative operator sources (unchanged):** About and Terms state Albor Digital LLC is registered in the **State of Wyoming, United States**. Organization JSON-LD on legal pages uses `"addressRegion": "Wyoming"`.

**Change (Disclaimer §7 only):**

- **Removed:** "Our products are operated from Canada and the United States."
- **Added:** "Pairing Method is operated by Albor Digital LLC, an independent digital product studio registered in the State of Wyoming, United States."

The remainder of §7 preserves the availability/jurisdiction disclaimer without introducing new entities or offices.

## 3. P1-LEGAL-02 Remediation

**Change (privacy.html intro only):**

- **Removed:** `These terms apply to Pairing Method, operated by Albor Digital LLC.`
- **Added:** `This Privacy Policy applies to Pairing Method, operated by Albor Digital LLC, and describes how we collect, use, and protect information when you use this site.`

All other Privacy sections (GDPR, legal bases, rights, cookies, retention, contact) unchanged.

## 4. P1-TRUST-01 Remediation

Updated **`scripts/pairing-seo.js`** → `buildSommelierVerdictHtml()`:

| Element | Before | After |
|---|---|---|
| `<h2>` | Sommelier Verdict | **Pairing Method Verdict** |
| `aria-label` | Sommelier verdict | **Pairing Method verdict** |
| CSS class | `sommelier-verdict` | unchanged (per EAT-11) |

Regenerated six pages via `node scripts/generate-pages.js`.

## 5. Generator Trace

```
scripts/pairing-seo.js (buildSommelierVerdictHtml)
  → scripts/generate-pages.js (buildSeoBundle → applyTemplate)
  → templates/pairing-template.html ({{SOMMELIER_VERDICT_HTML}})
  → wine-with-*.html (6 files)
```

## 6. Exact Files Changed

| File | Reason |
|---|---|
| `disclaimer.html` | P1-LEGAL-01 |
| `privacy.html` | P1-LEGAL-02 |
| `scripts/pairing-seo.js` | P1-TRUST-01 generator |
| `wine-with-grilled-steak.html` | Regenerated |
| `wine-with-roasted-chicken.html` | Regenerated |
| `wine-with-fried-fish.html` | Regenerated |
| `wine-with-spicy-food.html` | Regenerated |
| `wine-with-creamy-dishes.html` | Regenerated |
| `wine-with-smoked-pork.html` | Regenerated |
| `scripts/verify-pairing-eat-22.mjs` | Verifier (new) |
| `reports/pairing-eat-22-verification.json` | Report (new) |
| `reports/pairing-eat-22-baseline-six-pages.json` | Pre-regen SHA baseline (audit helper) |

**Not changed:** Terms, About, pairing-engine, pairing-data, runtime relationships, sitemap, robots, redirects, EAT-16/20 artifacts.

## 7. Before/After Integrity

Six-page regeneration diff (example `wine-with-grilled-steak.html`):

```diff
-      <section class="sommelier-verdict" aria-label="Sommelier verdict">
-        <h2>Sommelier Verdict</h2>
+      <section class="sommelier-verdict" aria-label="Pairing Method verdict">
+        <h2>Pairing Method Verdict</h2>
```

Normalized comparison (verdict labels stripped): **byte-identical to git HEAD** for all six pages — no churn to titles, canonicals, meta, JSON-LD, verdict paragraph bodies, or wine recommendations.

## 8. Pairing Integrity

For all six pages verified against git HEAD:

- Title unchanged (still includes "+ Sommelier Pairing Guide" — out of scope)
- Meta description unchanged
- Canonical unchanged
- Verdict `<p>` body unchanged
- No Pairing Strength scores on this family (unchanged — none present)

## 9. Publication Integrity

- `sitemap.xml` — byte-identical to HEAD
- `robots.txt` — byte-identical to HEAD
- `_redirects` — byte-identical to HEAD
- 873 quarantined food-tail edges — unchanged
- Cheese / Spanish — still unpublished

## 10. Protected-Path Verification

SHA-256 unchanged vs HEAD for: pairing-engine.js, pairing-data.js, matrix-view.js, food-tail-evidence-provenance.js, food-tail-wine-pairing-explanation.js, four food-tail runtime JSON files, about.html, terms.html, index.html, sitemap, robots, redirects.

## 11. Browser QA

- **Local repository:** Remediation verified via verifier + diff inspection.
- **Production (pairingmethod.com):** Still serves **pre-remediation** Disclaimer/Privacy until deploy — expected. Production browser snapshot still shows old §7 wording; **do not treat production as remediated until deploy.**
- **MANUAL_REVIEW_REQUIRED:** Full 10-page desktop/mobile Chrome matrix per EAT-22 §11 after deploy.

## 12. EAT-21 Regression

Re-ran `scripts/verify-pairing-eat-21.mjs` from EAT-22 verifier:

| Metric | Result |
|---|---|
| P1 findings | **0** (was 3) |
| Final gate | **B. READY WITH NON-MATERIAL NOTES** (P2 only) |
| Quarantine / publication scope | PASS preserved |

Three former P1 checks now PASS: `LEGAL_disclaimer_jurisdiction_mismatch`, `LEGAL_privacy_intro_wording`, all six `HI_GEN_*_sommelier_heading`.

## 13. Verification Summary

**109 checks** — 108 PASS, 0 FAIL, 1 MANUAL (deterministic across consecutive runs).

## 14. Remaining Findings

EAT-21 P2 (not remediated in EAT-22 — by design):

- P2-HOME-01 — Homepage title/meta "Sommelier Wine Pairing Recommendations"
- P2-QUAR-01 — Food-tail wine-style links from unfiltered graph (prose suppressed)
- P2-LEGAL-03 — Shared Albor boilerplate sections on Disclaimer

## 15. Final Recommendation

**LOCAL PASS — DIRECTOR REVIEW REQUIRED**

All three P1 blockers remediated in repository. **Do not declare AdSense readiness** — rerun final EAT-21 audit after Director approval and production deploy.

**NOT COMMITTED. NOT PUSHED. NOT DEPLOYED.**
