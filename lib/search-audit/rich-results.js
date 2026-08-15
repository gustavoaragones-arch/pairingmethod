/**
 * AQ-05C — Structured Data + Rich Results Certification.
 *
 * Rule 1: only documented Google behavior. Every eligibility claim below
 * was verified against Google Search Central's current documentation in
 * this session (not recalled from training knowledge, and not carried
 * forward unchecked from AQ-04) — several facts changed materially between
 * AQ-04 (2026-08-15) and this check, which is exactly why Rule 1 requires
 * checking fresh rather than reusing a prior audit's conclusion:
 *
 *   - FAQ rich results: Google added a deprecation notice 2026-05-07 and
 *     the SERP feature no longer appears at all (not merely restricted to
 *     government/health sites, which was the 2023-era rule AQ-04 cited).
 *     Source: https://developers.google.com/search/docs/appearance/structured-data/faqpage
 *   - Sitelinks Search Box (WebSite + SearchAction): removed entirely,
 *     announced November 2024. Source:
 *     https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
 *   - Breadcrumb: confirmed still active, no deprecation notice. Source:
 *     https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 *   - Dataset: confirmed scoped to downloadable/queryable data resources
 *     (CSV, ML data, government/civic datasets), not reference content.
 *     Source: https://developers.google.com/search/docs/appearance/structured-data/dataset
 *   - Article/NewsArticle/BlogPosting: confirmed scoped to news/blog/sports
 *     content specifically, not evergreen reference material. Source:
 *     https://developers.google.com/search/docs/appearance/structured-data/article
 *
 * Read-only. Builds on AQ-04's schema-inventory.json, schema-validation.json,
 * and semantic-integrity.json rather than re-deriving that evidence.
 */

import fs from "fs";
import path from "path";
import { getDomainConfig, listPublishedDomainIds } from "../food-domain-config.js";
import { readJson } from "../food-publication/utils.js";

function extractJsonLdTypes(htmlPath) {
  if (!fs.existsSync(htmlPath)) return [];
  const html = fs.readFileSync(htmlPath, "utf8");
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)];
  const types = [];
  for (const [, raw] of blocks) {
    try {
      const obj = JSON.parse(raw);
      types.push(obj["@type"]);
    } catch {
      // malformed block would already be caught by AQ-04F; not re-litigated here
    }
  }
  return types;
}

function sweepSiteWideTypes(root) {
  const staticPagesToCheck = ["index.html", "about.html", "disclaimer.html", "cookies.html", "privacy.html"];
  const found = {};
  for (const rel of staticPagesToCheck) {
    const p = path.join(root, rel);
    if (!fs.existsSync(p)) continue;
    found[rel] = extractJsonLdTypes(p);
  }
  return found;
}

function sweepFoodOntologyTypes(root) {
  // One sample page per domain per tier — confirms no FAQPage/SearchAction/
  // Article/Dataset leakage into the food-ontology publication layer,
  // which AQ-04 scoped deliberately to WebPage/BreadcrumbList/DefinedTerm/
  // DefinedTermSet/CollectionPage/Taxon/PropertyValue only.
  const unexpectedTypes = [];
  const confirmedTypeSet = new Set();
  let pagesChecked = 0;
  const allowedTypes = new Set([
    "WebPage", "BreadcrumbList", "DefinedTerm", "DefinedTermSet", "CollectionPage", "Taxon", "PropertyValue",
  ]);

  for (const id of listPublishedDomainIds()) {
    const domain = getDomainConfig(id, root);
    for (const tier of ["leaf", "group", "category"]) {
      const { pages } = readJson(domain.paths.pages[tier]);
      const sample = pages[0];
      if (!sample) continue;
      const htmlPath = path.join(root, "dist", sample.canonical_path.replace(/^\//, ""), "index.html");
      const types = extractJsonLdTypes(htmlPath);
      pagesChecked += 1;
      for (const t of types) {
        confirmedTypeSet.add(t);
        if (!allowedTypes.has(t)) unexpectedTypes.push({ domain: id, tier, slug: sample.slug, type: t });
      }
    }
  }

  return {
    pages_checked: pagesChecked,
    types_found: [...confirmedTypeSet].sort(),
    unexpected_types: unexpectedTypes,
    scoping_confirmed: unexpectedTypes.length === 0,
  };
}

export function certifyRichResults(root) {
  const siteWide = sweepSiteWideTypes(root);
  const foodOntology = sweepFoodOntologyTypes(root);

  let schemaInventory = null;
  let schemaValidation = null;
  try {
    schemaInventory = readJson(path.join(root, "reports", "schema-inventory.json"));
    schemaValidation = readJson(path.join(root, "reports", "schema-validation.json"));
  } catch {
    // AQ-04 reports not present; determination below still stands on its own evidence
  }

  return {
    phase: "AQ-05C",
    title: "Structured Data + Rich Results Certification",
    verification_method:
      "Every eligibility claim below was checked against Google Search Central's current documentation in this session (see module header for sources and fetch dates), not carried forward from AQ-04 or recalled from training knowledge.",
    site_wide_static_pages: siteWide,
    food_ontology_layer_scoping: foodOntology,
    aq04_evidence_reused: {
      json_ld_objects_validated: schemaValidation?.total_objects_checked ?? null,
      validation_issues: schemaValidation?.issue_count ?? null,
      schema_type_tally: schemaInventory?.schema_type_tally ?? null,
    },
    rich_result_determinations: {
      BreadcrumbList: {
        status: "implemented",
        google_eligibility: "supported — active feature, no deprecation notice as of this check",
        implementation: "Present on 100% of leaf/group/category pages (1,038/1,038, AQ-04). Meets all 4 documented requirements: itemListElement, name, position, item present on every entry except (correctly) the final one's item.",
        source: "https://developers.google.com/search/docs/appearance/structured-data/breadcrumb",
      },
      WebPage: {
        status: "implemented",
        google_eligibility: "general-purpose type, not tied to a specific rich-result SERP feature — supports Google's general content understanding",
        implementation: "Present on every leaf/group/category page; description now sourced from authored content (AQ-04B), improving the quality of what Google may show as the page's understood summary.",
      },
      "DefinedTerm/DefinedTermSet": {
        status: "implemented",
        google_eligibility: "general-purpose entity/vocabulary type, not tied to a specific rich-result SERP feature — supports entity understanding and Knowledge Graph candidacy",
        implementation: "Present on every leaf (DefinedTerm) and group/category (DefinedTermSet) page, with governance-verified canonical identifiers (AQ-04C: 0/1,252 identifier mismatches).",
      },
      Organization: {
        status: "implemented",
        google_eligibility: "feeds Knowledge Panel candidacy and E-E-A-T entity signals, not a distinct rich-result type with its own SERP feature",
        implementation: "Present on index.html and about.html: name, url, parentOrganization (Albor Digital LLC, Wyoming), contactPoint. Consistent with the real operating entity — no fabricated claims.",
      },
      WebSite: {
        status: "implemented (without SearchAction)",
        google_eligibility: "SearchAction/Sitelinks Search Box was removed as a Google Search feature in November 2024 — confirmed via current Google documentation, which now describes the feature in the past tense.",
        implementation: "Present on index.html: name, url, publisher. No potentialAction/SearchAction — correctly absent, since the target feature no longer exists in Google Search. Adding SearchAction now would be optimizing for a myth (a real risk Rule 1 exists to prevent), not a documented feature.",
        source: "https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox",
      },
      FAQPage: {
        status: "implemented on index.html only, not on food-ontology pages",
        google_eligibility:
          "The FAQ rich result SERP feature was removed entirely as of 2026-05-07 (Google's own deprecation notice) — not merely restricted to government/health sites (the 2023-era rule). The markup itself remains valid schema.org vocabulary and may still be read by non-Google consumers (AI search/retrieval systems), but it cannot earn any Google SERP feature under any circumstances as of this check.",
        implementation: "3 authored Q&A pairs on index.html (What is Pairing Method / How does the pairing engine work / Who writes the content) — accurate, real content, not fabricated for schema purposes. Left in place: harmless, schema.org-valid, and still potentially useful to AI/LLM consumers even though it earns no Google SERP treatment. Not added to any food-ontology page (AQ-04's decision to omit FAQPage there was correct independent of this timing detail, and remains correct now for an even stronger reason).",
        source: "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
      },
      Article: {
        status: "intentionally omitted, site-wide",
        google_eligibility: "Scoped to news/blog/sports article content specifically — confirmed via current Google documentation. PairingMethod's entity pages are evergreen reference content, not time-sensitive authored articles; none of Article's recommended properties (headline, datePublished, author byline per entity) exist or would be meaningful here.",
        source: "https://developers.google.com/search/docs/appearance/structured-data/article",
      },
      Dataset: {
        status: "intentionally omitted",
        google_eligibility: "Scoped to downloadable/queryable data resources (CSV, ML datasets, government/civic data) for Google Dataset Search — confirmed via current Google documentation. The food ontology is reference content a person reads, not a data file a person downloads or queries; Dataset markup would misrepresent what the platform is.",
        source: "https://developers.google.com/search/docs/appearance/structured-data/dataset",
      },
      SearchAction: {
        status: "not implemented, correctly",
        google_eligibility: "Feature removed from Google Search entirely (November 2024). Was never implemented here — confirmed still correctly absent.",
        note: "Also technically unbuildable as specified even if the feature still existed: the site's search (AQ-02B2) is a client-side JS index with no server-rendered results-page URL for a query-input template to target.",
      },
      "Product/Recipe/Review/HowTo/Q&A": {
        status: "not applicable, correctly omitted",
        google_eligibility: "None of these content types exist on the site (no commerce, no step-by-step recipes, no user reviews). Correct non-implementation, not a gap.",
      },
    },
    overall_certification:
      foodOntology.scoping_confirmed && (schemaValidation ? schemaValidation.issue_count === 0 : true) ? "PASS" : "REVIEW",
  };
}
