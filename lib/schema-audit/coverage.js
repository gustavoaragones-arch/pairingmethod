/**
 * AQ-04 — JSON-LD Coverage.
 *
 * Quantifies how completely each schema.org property is populated across
 * the 11-domain suite, and specifically verifies the AQ-04B fix landed at
 * full coverage (not a partial rollout). Read-only.
 */

import { getDomainConfig, listDomainIds } from "../food-domain-config.js";
import { readJson } from "../food-publication/utils.js";

const DERIVED_PRODUCT_DOMAINS = new Set(["cheese"]);

function findBlock(jsonLd, type) {
  return jsonLd.find((b) => b["@type"] === type);
}

export function computeJsonLdCoverage(root) {
  const domainIds = listDomainIds();
  let leafTotal = 0;
  let leafWithJsonLd = 0;
  let leafWithNonTemplateDescription = 0;
  let leafWithTaxon = 0;
  let leafWithMilkSourcePropertyValue = 0;
  let leafWithSpeciesPropertyValue = 0;
  let groupTotal = 0;
  let groupWithJsonLd = 0;
  let categoryTotal = 0;
  let categoryWithJsonLd = 0;
  const perDomain = {};

  for (const domainId of domainIds) {
    const domain = getDomainConfig(domainId);
    const leaf = readJson(domain.paths.schema.leaf);
    const group = readJson(domain.paths.schema.group);
    const category = readJson(domain.paths.schema.category);
    const isDerivedProduct = DERIVED_PRODUCT_DOMAINS.has(domainId);

    let domainLeafTaxon = 0;
    let domainLeafMilkSource = 0;
    let domainLeafSpecies = 0;
    let domainLeafNonTemplateDesc = 0;

    for (const entry of leaf.schemas) {
      leafTotal += 1;
      if (entry.json_ld.length > 0) leafWithJsonLd += 1;
      const webPage = findBlock(entry.json_ld, "WebPage");
      const about = Array.isArray(webPage?.about) ? webPage.about : webPage?.about ? [webPage.about] : [];
      if (about.some((a) => a["@type"] === "Taxon")) {
        leafWithTaxon += 1;
        domainLeafTaxon += 1;
      }
      if (about.some((a) => a["@type"] === "PropertyValue" && a.name === "Milk source species")) {
        leafWithMilkSourcePropertyValue += 1;
        domainLeafMilkSource += 1;
      }
      if (about.some((a) => a["@type"] === "PropertyValue" && a.name === "species")) {
        leafWithSpeciesPropertyValue += 1;
        domainLeafSpecies += 1;
      }
      // "Non-template" heuristic: description does not end in the generic
      // template's fixed tail pattern used before AQ-04B.
      if (webPage?.description && !/ — .+ (cheese|fruit|vegetable|food)$/i.test(webPage.description)) {
        leafWithNonTemplateDescription += 1;
        domainLeafNonTemplateDesc += 1;
      }
    }
    for (const entry of group.schemas) {
      groupTotal += 1;
      if (entry.json_ld.length > 0) groupWithJsonLd += 1;
    }
    for (const entry of category.schemas) {
      categoryTotal += 1;
      if (entry.json_ld.length > 0) categoryWithJsonLd += 1;
    }

    perDomain[domainId] = {
      is_derived_product_domain: isDerivedProduct,
      leaf_pages: leaf.schemas.length,
      leaf_with_taxon: domainLeafTaxon,
      leaf_with_milk_source_property_value: domainLeafMilkSource,
      leaf_with_species_property_value: domainLeafSpecies,
      leaf_with_likely_authored_description: domainLeafNonTemplateDesc,
      taxon_coverage_correct:
        isDerivedProduct ? domainLeafTaxon === 0 : domainLeafTaxon === leaf.schemas.length,
    };
  }

  return {
    phase: "AQ-04 (coverage)",
    title: "JSON-LD Coverage",
    totals: {
      leaf_pages: leafTotal,
      leaf_with_json_ld: leafWithJsonLd,
      leaf_json_ld_coverage: `${((leafWithJsonLd / leafTotal) * 100).toFixed(2)}%`,
      leaf_with_taxon: leafWithTaxon,
      leaf_with_milk_source_property_value: leafWithMilkSourcePropertyValue,
      leaf_with_species_property_value: leafWithSpeciesPropertyValue,
      leaf_with_likely_authored_description: leafWithNonTemplateDescription,
      leaf_authored_description_coverage: `${((leafWithNonTemplateDescription / leafTotal) * 100).toFixed(2)}%`,
      group_pages: groupTotal,
      group_with_json_ld: groupWithJsonLd,
      group_json_ld_coverage: `${((groupWithJsonLd / groupTotal) * 100).toFixed(2)}%`,
      category_pages: categoryTotal,
      category_with_json_ld: categoryWithJsonLd,
      category_json_ld_coverage: `${((categoryWithJsonLd / categoryTotal) * 100).toFixed(2)}%`,
    },
    per_domain: perDomain,
    notes: {
      taxon_coverage_correct:
        "True for every domain iff: cheese emits Taxon on 0 leaf pages (derived-product domain, milk source is not cheese identity) and every other domain emits Taxon on 100% of leaf pages that have a scientific_name (own taxonomic identity). Verified per-domain above.",
      authored_description_heuristic:
        "leaf_with_likely_authored_description is a heuristic (excludes strings matching the old generic template's fixed tail shape), not a byte-for-byte match against narrative.seo_description — see reports/schema-inventory.json FIND-02 and the AQ-04B code change for the authoritative fix (projection.narrative?.seo_description with template fallback).",
    },
  };
}
