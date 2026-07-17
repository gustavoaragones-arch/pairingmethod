/**
 * ONTOLOGY-03C — Modular JSON-LD builders for protein food page view models.
 * Pure serialization: every property originates from page ViewModels.
 */

import { absoluteUrl } from "./public-url.js";

const ONTOLOGY_SET = {
  "@type": "DefinedTermSet",
  name: "Pairing Method Food Ontology",
  url: absoluteUrl("/"),
};

const WEBSITE = {
  "@type": "WebSite",
  name: "Pairing Method",
  url: absoluteUrl("/"),
};

export function pageIds(page) {
  const url = page.metadata.canonical;
  return {
    url,
    webpage: `${url}#webpage`,
    breadcrumb: `${url}#breadcrumb`,
    definedTerm: `${url}#definedterm`,
    definedTermSet: `${url}#definedtermset`,
    collectionPage: `${url}#collectionpage`,
    taxon: `${url}#taxon`,
  };
}

export function buildBreadcrumbListSchema(page, ids) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": ids.breadcrumb,
    itemListElement: page.breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  };
}

export function buildFoodWebPageSchema(page, ids) {
  const about = [];
  if (page.overview.category) {
    about.push({
      "@type": "DefinedTermSet",
      "@id": absoluteUrl(
        page.breadcrumbs.find((c) => c.label === page.overview.category.name)?.href ??
          `/categories/${page.overview.category.slug}/`
      ) + "#definedtermset",
      name: page.overview.category.name,
      identifier: page.overview.category.id,
    });
  }
  if (page.overview.group) {
    about.push({
      "@type": "DefinedTermSet",
      "@id": absoluteUrl(
        page.breadcrumbs.find((c) => c.label === page.overview.group.name)?.href ??
          `/groups/${page.overview.group.slug}/`
      ) + "#definedtermset",
      name: page.overview.group.name,
      identifier: page.overview.group.id,
    });
  }
  if (page.overview.scientific_name) {
    about.push({ "@type": "Taxon", "@id": ids.taxon, name: page.overview.scientific_name });
  }
  if (page.overview.species) {
    about.push({
      "@type": "PropertyValue",
      name: "species",
      value: page.overview.species,
    });
  }

  const block = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": ids.webpage,
    url: ids.url,
    name: page.metadata.title,
    description: page.metadata.description,
    breadcrumb: { "@id": ids.breadcrumb },
    isPartOf: WEBSITE,
  };

  if (about.length > 0) block.about = about;
  return block;
}

export function buildFoodDefinedTermSchema(page, ids) {
  const term = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": ids.definedTerm,
    identifier: page.identity.id,
    name: page.identity.title,
    alternateName: page.identity.slug,
    description: page.metadata.description,
    url: ids.url,
    inDefinedTermSet: ONTOLOGY_SET,
  };

  if (page.overview.group) {
    term.isPartOf = {
      "@type": "DefinedTermSet",
      "@id":
        absoluteUrl(
          page.breadcrumbs.find((c) => c.label === page.overview.group.name)?.href ??
            `/groups/${page.overview.group.slug}/`
        ) + "#definedtermset",
      name: page.overview.group.name,
      identifier: page.overview.group.id,
    };
  }

  return term;
}

export function buildFoodTaxonSchema(page, ids) {
  if (!page.overview.scientific_name) return null;

  const taxon = {
    "@context": "https://schema.org",
    "@type": "Taxon",
    "@id": ids.taxon,
    name: page.overview.scientific_name,
    url: ids.url,
  };

  if (page.overview.species) {
    taxon.taxonRank = "species";
    taxon.alternateName = page.overview.species;
  }

  return taxon;
}

export function buildFoodSchemas(page) {
  const ids = pageIds(page);
  const schemas = [
    buildFoodWebPageSchema(page, ids),
    buildBreadcrumbListSchema(page, ids),
    buildFoodDefinedTermSchema(page, ids),
  ];

  const taxon = buildFoodTaxonSchema(page, ids);
  if (taxon) schemas.push(taxon);

  return schemas;
}

export function buildGroupCollectionPageSchema(page, ids) {
  const block = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": ids.collectionPage,
    url: ids.url,
    name: page.metadata.title,
    description: page.metadata.description,
    breadcrumb: { "@id": ids.breadcrumb },
    isPartOf: WEBSITE,
  };

  if (page.overview.parent_category) {
    block.about = {
      "@type": "DefinedTermSet",
      "@id":
        absoluteUrl(
          page.breadcrumbs.find((c) => c.label === page.overview.parent_category.name)?.href ??
            `/categories/${page.overview.parent_category.slug}/`
        ) + "#definedtermset",
      name: page.overview.parent_category.name,
      identifier: page.overview.parent_category.id,
    };
  }

  return block;
}

export function buildGroupDefinedTermSetSchema(page, ids) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": ids.definedTermSet,
    identifier: page.identity.id,
    name: page.identity.title,
    alternateName: page.identity.slug,
    description: page.metadata.description,
    url: ids.url,
    numberOfTerms: page.overview.food_count,
    inDefinedTermSet: ONTOLOGY_SET,
    hasPart: page.member_foods.map((food) => ({
      "@type": "DefinedTerm",
      "@id": absoluteUrl(food.href) + "#definedterm",
      name: food.name,
      identifier: food.id,
      url: absoluteUrl(food.href),
    })),
  };
}

export function buildGroupSchemas(page) {
  const ids = pageIds(page);
  return [
    buildGroupCollectionPageSchema(page, ids),
    buildBreadcrumbListSchema(page, ids),
    buildGroupDefinedTermSetSchema(page, ids),
  ];
}

export function buildCategoryCollectionPageSchema(page, ids) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": ids.collectionPage,
    url: ids.url,
    name: page.metadata.title,
    description: page.metadata.description,
    breadcrumb: { "@id": ids.breadcrumb },
    isPartOf: WEBSITE,
  };
}

export function buildCategoryDefinedTermSetSchema(page, ids) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": ids.definedTermSet,
    identifier: page.identity.id,
    name: page.identity.title,
    alternateName: page.identity.slug,
    description: page.metadata.description,
    url: ids.url,
    numberOfTerms: page.overview.food_count,
    inDefinedTermSet: ONTOLOGY_SET,
    hasPart: page.groups.map((group) => ({
      "@type": "DefinedTermSet",
      "@id": absoluteUrl(group.href) + "#definedtermset",
      name: group.name,
      identifier: group.id,
      url: absoluteUrl(group.href),
      numberOfTerms: group.food_count,
    })),
  };
}

export function buildCategorySchemas(page) {
  const ids = pageIds(page);
  return [
    buildCategoryCollectionPageSchema(page, ids),
    buildBreadcrumbListSchema(page, ids),
    buildCategoryDefinedTermSetSchema(page, ids),
  ];
}

export const FOOD_SCHEMA_TYPES = ["WebPage", "BreadcrumbList", "DefinedTerm", "Taxon"];
export const GROUP_SCHEMA_TYPES = ["CollectionPage", "BreadcrumbList", "DefinedTermSet"];
export const CATEGORY_SCHEMA_TYPES = ["CollectionPage", "BreadcrumbList", "DefinedTermSet"];
