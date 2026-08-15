/**
 * AQ-04F — JSON-LD Validation.
 *
 * A deterministic, reproducible internal validator covering the checks that
 * matter for validator.schema.org / Google Rich Results acceptance and for
 * detecting semantic drift: required properties present per type, no
 * duplicate/contradictory @id usage, well-formed breadcrumb sequences,
 * absolute canonical URLs, and — as a standing regression guard — no
 * derived-product-domain page ever re-emitting Taxon (the AQ-04B defect).
 * Read-only; no file is modified.
 */

import { getDomainConfig, listDomainIds } from "../food-domain-config.js";
import { readJson } from "../food-publication/utils.js";

const REQUIRED_PROPERTIES = {
  WebPage: ["@id", "url", "name", "description"],
  BreadcrumbList: ["@id", "itemListElement"],
  DefinedTerm: ["@id", "identifier", "name", "url"],
  DefinedTermSet: ["@id", "identifier", "name", "url"],
  Taxon: ["@id", "name", "url"],
  CollectionPage: ["@id", "url", "name", "description"],
  PropertyValue: ["name", "value"],
};

const DERIVED_PRODUCT_DOMAINS = new Set(["cheese"]);

function checkRequiredProperties(block, issues, context) {
  const required = REQUIRED_PROPERTIES[block["@type"]];
  if (!required) return;
  for (const prop of required) {
    if (block[prop] === undefined || block[prop] === null || block[prop] === "") {
      issues.push({ type: "missing_required_property", property: prop, schemaType: block["@type"], ...context });
    }
  }
}

function checkBreadcrumbSequence(block, issues, context) {
  if (block["@type"] !== "BreadcrumbList") return;
  const positions = block.itemListElement.map((item) => item.position);
  const expected = positions.map((_, i) => i + 1);
  if (JSON.stringify(positions) !== JSON.stringify(expected)) {
    issues.push({ type: "breadcrumb_position_gap", positions, ...context });
  }
  for (const item of block.itemListElement) {
    if (!item.item?.startsWith("https://pairingmethod.com/")) {
      issues.push({ type: "breadcrumb_item_not_absolute_url", item: item.item, ...context });
    }
    if (!item.name) {
      issues.push({ type: "breadcrumb_item_missing_name", position: item.position, ...context });
    }
  }
}

function checkAbsoluteUrls(block, issues, context) {
  for (const key of ["url", "@id"]) {
    const value = block[key];
    if (typeof value === "string" && value.includes("://") && !value.startsWith("https://pairingmethod.com/")) {
      issues.push({ type: "non_canonical_host", property: key, value, ...context });
    }
  }
}

function checkTaxonRegression(entry, domainId, issues) {
  if (!DERIVED_PRODUCT_DOMAINS.has(domainId)) return;
  for (const block of entry.json_ld) {
    if (block["@type"] === "Taxon") {
      issues.push({ type: "REGRESSION_taxon_on_derived_product_domain", domain: domainId, slug: entry.slug });
    }
    const aboutItems = Array.isArray(block.about) ? block.about : block.about ? [block.about] : [];
    for (const item of aboutItems) {
      if (item["@type"] === "Taxon") {
        issues.push({ type: "REGRESSION_taxon_on_derived_product_domain", domain: domainId, slug: entry.slug, location: "about[]" });
      }
    }
  }
}

function checkContext(block, issues, context) {
  if (block["@context"] !== "https://schema.org") {
    issues.push({ type: "missing_or_invalid_context", found: block["@context"], ...context });
  }
  if (!block["@type"]) {
    issues.push({ type: "missing_type", ...context });
  }
}

function validateEntries(domainId, tier, entries, issues) {
  let objectsChecked = 0;
  for (const entry of entries) {
    checkTaxonRegression(entry, domainId, issues);
    for (const block of entry.json_ld) {
      objectsChecked += 1;
      const context = { domain: domainId, tier, slug: entry.slug };
      checkContext(block, issues, context);
      checkRequiredProperties(block, issues, context);
      checkBreadcrumbSequence(block, issues, context);
      checkAbsoluteUrls(block, issues, context);
    }
  }
  return objectsChecked;
}

export function validateAllSchemas(root) {
  const domainIds = listDomainIds();
  const issues = [];
  let totalObjectsChecked = 0;
  const perDomain = {};

  for (const domainId of domainIds) {
    const domain = getDomainConfig(domainId);
    const leaf = readJson(domain.paths.schema.leaf);
    const group = readJson(domain.paths.schema.group);
    const category = readJson(domain.paths.schema.category);

    const before = issues.length;
    let checked = 0;
    checked += validateEntries(domainId, "leaf", leaf.schemas, issues);
    checked += validateEntries(domainId, "group", group.schemas, issues);
    checked += validateEntries(domainId, "category", category.schemas, issues);
    totalObjectsChecked += checked;

    perDomain[domainId] = {
      objects_checked: checked,
      issues_found: issues.length - before,
    };
  }

  return {
    phase: "AQ-04F",
    title: "JSON-LD Validation",
    methodology:
      "Internal, deterministic structural validator: required-property presence per @type (per schema.org's own documented required/recommended properties), @context/@type presence, breadcrumb position-sequence and absolute-URL well-formedness, canonical-host consistency, and a standing regression guard confirming no derived-product-domain (cheese) page re-emits @type Taxon.",
    external_validation_note:
      "validator.schema.org and Google's Rich Results Test are both JavaScript SPAs with no documented, stable public API — confirmed directly (an unauthenticated POST to a guessed endpoint 404s). Scripting against an undocumented internal API would be fragile and, worse, non-reproducible, which would undermine this validator's own determinism standard. External validation was therefore not run programmatically; this report's evidence is the internal structural validator below. Recommended as a manual follow-up, not claimed as done here: paste a handful of representative URLs (one leaf, one group, one category, across a couple of domains) into https://validator.schema.org/ and https://search.google.com/test/rich-results directly.",
    total_objects_checked: totalObjectsChecked,
    issue_count: issues.length,
    issues,
    all_valid: issues.length === 0,
    per_domain: perDomain,
  };
}
