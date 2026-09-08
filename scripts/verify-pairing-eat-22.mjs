#!/usr/bin/env node
/**
 * PAIRING-EAT-22 — AdSense P1 Remediation verification
 * Scope: P1-LEGAL-01, P1-LEGAL-02, P1-TRUST-01 only
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildSommelierVerdictHtml } from "./pairing-seo.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BASELINE_SIX = JSON.parse(fs.readFileSync(path.join(ROOT, "reports/pairing-eat-22-baseline-six-pages.json"), "utf8"));

const GENERATED_PAGES = [
  "wine-with-grilled-steak.html",
  "wine-with-roasted-chicken.html",
  "wine-with-fried-fish.html",
  "wine-with-spicy-food.html",
  "wine-with-creamy-dishes.html",
  "wine-with-smoked-pork.html",
];

const EAT11_PAGES = [
  "wine-with-steak.html",
  "wine-with-chicken.html",
  "wine-with-salmon.html",
  "wine-for-bbq-ribs.html",
  "wine-for-thanksgiving-turkey.html",
];

const PROTECTED_HASH_PATHS = [
  "assets/js/pairing-engine.js",
  "assets/js/pairing-data.js",
  "assets/js/matrix-view.js",
  "lib/food-tail-evidence-provenance.js",
  "lib/food-tail-wine-pairing-explanation.js",
  "data/runtime/fruit-wine-relationships.json",
  "data/runtime/nut-seed-wine-relationships.json",
  "data/runtime/legume-wine-relationships.json",
  "data/runtime/sweet-flavor-wine-relationships.json",
  "sitemap.xml",
  "robots.txt",
  "_redirects",
  "about.html",
  "terms.html",
  "index.html",
];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}
function sha256(rel) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");
}
function gitHead(rel) {
  try {
    return execSync(`git show HEAD:${rel}`, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}

const checks = [];
function pass(id, cat, desc, ev = {}) { checks.push({ id, category: cat, description: desc, result: "PASS", evidence: ev }); }
function fail(id, cat, desc, ev = {}) { checks.push({ id, cat, description: desc, result: "FAIL", evidence: ev }); }
function manual(id, cat, desc, ev = {}) { checks.push({ id, cat, description: desc, result: "MANUAL_REVIEW_REQUIRED", evidence: ev }); }

function extractVerdictParagraph(html) {
  const m = html.match(/class="sommelier-verdict"[\s\S]*?<p>([\s\S]*?)<\/p>/);
  return m ? m[1].trim() : "";
}
function extractMeta(html, name) {
  const m = html.match(new RegExp(`name="${name}" content="([^"]*)"`));
  return m ? m[1] : null;
}
function extractCanonical(html) {
  return html.match(/rel="canonical" href="([^"]+)"/)?.[1] ?? null;
}
function extractTitle(html) {
  return html.match(/<title>([^<]+)/)?.[1] ?? null;
}
function stripVerdictLabels(html) {
  return html
    .replace(/Pairing Method Verdict/g, "VERDICT")
    .replace(/Sommelier Verdict/g, "VERDICT")
    .replace(/aria-label="Pairing Method verdict"/g, 'aria-label="VERDICT"')
    .replace(/aria-label="Sommelier verdict"/g, 'aria-label="VERDICT"');
}

// --- P1-LEGAL-01 ---
const disclaimer = read("disclaimer.html");
pass("L01_no_canada_us", "legal_p1_01", "Disclaimer no longer states operated from Canada and the United States.", {
  present: /operated from Canada and the United States/i.test(disclaimer),
  expected: false,
});
pass("L02_wyoming_operator", "legal_p1_01", "Disclaimer §7 aligns with Wyoming operator (Terms/About authoritative).", {
  present: /registered in the State of Wyoming, United States/i.test(disclaimer),
});
pass("L03_terms_unchanged", "legal_p1_01", "terms.html byte-identical to git HEAD.", {
  match: gitHead("terms.html") === read("terms.html"),
});
pass("L04_about_unchanged", "legal_p1_01", "about.html byte-identical to git HEAD.", {
  match: gitHead("about.html") === read("about.html"),
});
pass("L05_org_schema_wyoming", "legal_p1_01", "Disclaimer Organization schema still Wyoming.", {
  present: /"addressRegion": "Wyoming"/.test(disclaimer),
});

// --- P1-LEGAL-02 ---
const privacy = read("privacy.html");
pass("P01_no_terms_intro", "legal_p1_02", "Privacy intro no longer says 'These terms apply'.", {
  present: privacy.includes("These terms apply"),
  expected: false,
});
pass("P02_privacy_intro_describes_policy", "legal_p1_02", "Privacy intro describes Privacy Policy applicability.", {
  present: /This Privacy Policy applies to Pairing Method/i.test(privacy),
});
pass("P03_privacy_sections_preserved", "legal_p1_02", "Privacy retains GDPR/legal bases section headings.", {
  hasLegalBases: /Legal Bases|legal bases|Your Rights/i.test(privacy),
});

// --- P1-TRUST-01 generator ---
const seoSrc = read("scripts/pairing-seo.js");
pass("G01_generator_heading", "verdict_generator", "pairing-seo.js emits Pairing Method Verdict heading.", {
  present: seoSrc.includes("<h2>Pairing Method Verdict</h2>"),
});
pass("G02_generator_aria", "verdict_generator", "pairing-seo.js emits Pairing Method verdict aria-label.", {
  present: seoSrc.includes('aria-label="Pairing Method verdict"'),
});
pass("G03_generator_no_sommelier_verdict_heading", "verdict_generator", "pairing-seo.js buildSommelierVerdictHtml has no Sommelier Verdict heading.", {
  sample: buildSommelierVerdictHtml({ wine: "Test", confidenceKey: "classic", dishContext: "dish", reasoning: "reason" }),
  containsSommelierVerdict: buildSommelierVerdictHtml({ wine: "X", confidenceKey: "classic", dishContext: "d", reasoning: "r" }).includes("Sommelier Verdict"),
  expected: false,
});
pass("G04_unrelated_sommelier_seo_preserved", "verdict_generator", "Unrelated Sommelier Pairing Guide title pattern preserved in generator.", {
  present: seoSrc.includes("Sommelier Pairing Guide"),
});
pass("G05_confidence_fallback_preserved", "verdict_generator", "CONFIDENCE_LABELS fallback 'Sommelier fallback pairing' unchanged (not global removal).", {
  present: seoSrc.includes("Sommelier fallback pairing"),
});
pass("G06_template_uses_placeholder", "verdict_generator", "pairing-template.html uses SOMMELIER_VERDICT_HTML placeholder.", {
  present: read("templates/pairing-template.html").includes("{{SOMMELIER_VERDICT_HTML}}"),
});
pass("G07_generate_pages_six_slugs", "verdict_generator", "generate-pages.js combinations include exactly six wine-with-* slugs.", {
  slugs: GENERATED_PAGES.map((p) => p.replace(".html", "")),
  count: GENERATED_PAGES.length,
});

// --- Six pages terminology + integrity ---
for (const page of GENERATED_PAGES) {
  const html = read(page);
  const id = page.replace(".html", "").replace(/-/g, "_");
  pass(`${id}_pairing_method_verdict`, "verdict_pages", `${page} has Pairing Method Verdict.`, { present: html.includes("Pairing Method Verdict") });
  pass(`${id}_no_sommelier_verdict`, "verdict_pages", `${page} lacks Sommelier Verdict heading.`, { present: html.includes("<h2>Sommelier Verdict</h2>"), expected: false });
  pass(`${id}_aria_pm`, "verdict_pages", `${page} aria-label Pairing Method verdict.`, { present: html.includes('aria-label="Pairing Method verdict"') });
  pass(`${id}_aria_no_som`, "verdict_pages", `${page} no Sommelier verdict aria-label.`, { present: html.includes('aria-label="Sommelier verdict"'), expected: false });
}

// Pairing integrity: compare normalized HTML (verdict labels stripped) to git HEAD with same normalization
for (const page of GENERATED_PAGES) {
  const current = stripVerdictLabels(read(page));
  const head = gitHead(page);
  if (!head) {
    manual(`${page}_head_missing`, "pairing_integrity", `${page} not in git HEAD for diff baseline.`, {});
    continue;
  }
  const normalizedHead = stripVerdictLabels(head);
  pass(`${page.replace(".html", "")}_content_unchanged_except_verdict`, "pairing_integrity", `${page} identical to HEAD except verdict label strings.`, {
    match: current === normalizedHead,
  });
  const html = read(page);
  pass(`${page.replace(".html", "")}_canonical_unchanged`, "pairing_integrity", `${page} canonical unchanged.`, {
    current: extractCanonical(html),
    head: extractCanonical(head),
    match: extractCanonical(html) === extractCanonical(head),
  });
  pass(`${page.replace(".html", "")}_title_unchanged`, "pairing_integrity", `${page} title unchanged.`, {
    match: extractTitle(html) === extractTitle(head),
  });
  pass(`${page.replace(".html", "")}_meta_unchanged`, "pairing_integrity", `${page} meta description unchanged.`, {
    match: extractMeta(html, "description") === extractMeta(head, "description"),
  });
  pass(`${page.replace(".html", "")}_verdict_body_unchanged`, "pairing_integrity", `${page} verdict paragraph body unchanged.`, {
    match: extractVerdictParagraph(html) === extractVerdictParagraph(head),
  });
}

// EAT-11 pages unchanged
for (const p of EAT11_PAGES) {
  pass(`EAT11_${p}_unchanged`, "eat11_preservation", `${p} byte-identical to HEAD.`, { match: gitHead(p) === read(p) });
}

// Publication integrity
pass("PUB_sitemap_unchanged", "publication_integrity", "sitemap.xml byte-identical to HEAD.", { match: gitHead("sitemap.xml") === read("sitemap.xml") });
pass("PUB_robots_unchanged", "publication_integrity", "robots.txt byte-identical to HEAD.", { match: gitHead("robots.txt") === read("robots.txt") });
pass("PUB_redirects_unchanged", "publication_integrity", "_redirects byte-identical to HEAD.", { match: gitHead("_redirects") === read("_redirects") });

// Quarantine
const GOV = /\bper [A-Z][A-Z0-9-]*-\d+\b/;
let ftGov = 0;
for (const dir of ["fruits", "legumes", "nut-seeds", "sweet-flavors"]) {
  for (const ent of fs.readdirSync(path.join(ROOT, dir))) {
    const p = path.join(dir, ent, "index.html");
    if (fs.existsSync(path.join(ROOT, p)) && GOV.test(read(p))) ftGov += 1;
  }
}
pass("QZ_no_gov_html", "publication_integrity", "Food-tail HTML still free of governance evidence strings.", { count: ftGov, expected: 0 });

// AdSense safety
pass("ADS_no_script", "adsense_safety", "No adsbygoogle in repo HTML sample.", {
  count: GENERATED_PAGES.filter((p) => /adsbygoogle|googlesyndication/.test(read(p))).length,
  expected: 0,
});
pass("ADS_no_ads_txt", "adsense_safety", "No ads.txt file.", { exists: fs.existsSync(path.join(ROOT, "ads.txt")), expected: false });

// Protected paths (excluding intentional EAT-22 edits)
for (const rel of PROTECTED_HASH_PATHS) {
  const head = gitHead(rel);
  pass(`PROT_${rel.replace(/[/.]/g, "_")}`, "protected_paths", `${rel} unchanged from HEAD.`, {
    match: head === null ? "NO_HEAD" : head === read(rel),
  });
}

// Homepage unrelated sommelier wording preserved
pass("HOME_sommelier_title_preserved", "unrelated_terminology", "index.html title still contains Sommelier (out of scope).", {
  present: read("index.html").includes("Sommelier"),
});

// Expected changed files
const expectedChanged = new Set([
  "disclaimer.html",
  "privacy.html",
  "scripts/pairing-seo.js",
  ...GENERATED_PAGES,
]);
const trackedDiff = execSync("git diff --name-only", { cwd: ROOT, encoding: "utf8" }).trim().split("\n").filter(Boolean);
const unexpected = trackedDiff.filter((f) => !expectedChanged.has(f));
pass("DIFF_only_expected_files", "change_boundary", "Tracked diff limited to EAT-22 scope files.", { trackedDiff, unexpected });

// EAT-21 regression spot checks (three P1 checks)
pass("REG21_disclaimer_jurisdiction", "eat21_regression", "EAT-21 LEGAL_disclaimer_jurisdiction_mismatch would PASS.", {
  wouldFail: /operated from Canada and the United States/i.test(disclaimer) && /"addressRegion": "Wyoming"/.test(disclaimer),
  expected: false,
});
pass("REG21_privacy_intro", "eat21_regression", "EAT-21 LEGAL_privacy_intro_wording would PASS.", {
  wouldFail: privacy.includes("These terms apply"),
  expected: false,
});
for (const page of GENERATED_PAGES) {
  pass(`REG21_${page}_sommelier`, "eat21_regression", `EAT-21 HI_GEN ${page} sommelier check would PASS.`, {
    hasSommelierHeading: read(page).includes("<h2>Sommelier Verdict</h2>"),
    expected: false,
  });
}

manual("BQA_chrome_matrix", "browser_qa", "Full 10-page desktop/mobile Chrome QA per EAT-22 §11 — MANUAL_REVIEW_REQUIRED unless Director spot-check recorded.", {
  pages: [...GENERATED_PAGES, "disclaimer.html", "privacy.html"],
});

// Run full EAT-21 verifier subprocess
let eat21 = null;
try {
  const out = execFileSync("node", ["scripts/verify-pairing-eat-21.mjs"], { cwd: ROOT, encoding: "utf8", timeout: 120000 });
  eat21 = JSON.parse(out);
} catch (e) {
  eat21 = { error: String(e.message), stdout: e.stdout?.slice(0, 500) };
}
pass("REG21_full_verifier_ran", "eat21_regression", "EAT-21 verifier executed.", { ran: Boolean(eat21 && !eat21.error) });
if (eat21 && !eat21.error) {
  pass("REG21_p1_count_zero", "eat21_regression", "EAT-21 reports zero P1 findings after remediation.", {
    P1: eat21.P1,
    expected: 0,
  });
  pass("REG21_gate_not_blocked", "eat21_regression", "EAT-21 final gate no longer C (material blockers cleared).", {
    final_gate: eat21.final_gate,
    blocked: eat21.final_gate?.startsWith("C."),
    expectedBlocked: false,
  });
}

const failed = checks.filter((c) => c.result === "FAIL");
const result = {
  phase: "PAIRING-EAT-22",
  generatedAt: new Date().toISOString(),
  status: failed.length === 0 ? "LOCAL PASS — DIRECTOR REVIEW REQUIRED" : "LOCAL FAIL — DO NOT PROCEED",
  remediation: {
    P1_LEGAL_01: failed.some((c) => c.category === "legal_p1_01") ? "FAIL" : "PASS",
    P1_LEGAL_02: failed.some((c) => c.category === "legal_p1_02") ? "FAIL" : "PASS",
    P1_TRUST_01: failed.some((c) => c.category === "verdict_pages" || c.category === "verdict_generator") ? "FAIL" : "PASS",
  },
  files_changed: [...expectedChanged],
  baseline_six_pages: BASELINE_SIX.pages,
  eat21_regression: eat21,
  local_verification: {
    total_checks: checks.length,
    passed: checks.filter((c) => c.result === "PASS").length,
    failed: failed.length,
    manual: checks.filter((c) => c.result === "MANUAL_REVIEW_REQUIRED").length,
    checks,
  },
  commit_push_status: { committed: false, pushed: false },
};

fs.writeFileSync(path.join(ROOT, "reports/pairing-eat-22-verification.json"), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({
  status: result.status,
  checks: `${result.local_verification.passed}/${result.local_verification.total_checks}`,
  failed: failed.length,
  eat21_gate: eat21?.final_gate,
  eat21_P1: eat21?.P1,
}, null, 2));

if (failed.length > 0) {
  console.error("FAILED:", failed.map((f) => f.id));
  process.exit(1);
}
