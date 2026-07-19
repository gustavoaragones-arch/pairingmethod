/**
 * FOOD-04F — Declarative domain descriptors for the Food Ontology publication platform.
 * One publication engine; domain-specific behavior lives in configuration.
 */

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, "..");

function artifact(root, relativePath) {
  return path.join(root, relativePath);
}

function buildPublicationArtifacts(root, cfg) {
  const p = cfg.paths;
  return Object.freeze({
    catalog: artifact(root, p.catalog),
    runtime: p.runtime.map((rel) => artifact(root, rel)),
    relationships: p.relationships.map((rel) => artifact(root, rel)),
    projections: [
      artifact(root, p.projections.leaf),
      artifact(root, p.projections.group),
      artifact(root, p.projections.category),
    ],
    pages: [
      artifact(root, p.pages.leaf),
      artifact(root, p.pages.group),
      artifact(root, p.pages.category),
    ],
    schema: [
      artifact(root, p.schema.leaf),
      artifact(root, p.schema.group),
      artifact(root, p.schema.category),
    ],
    navigation: [
      artifact(root, p.navigation.leaf),
      artifact(root, p.navigation.group),
      artifact(root, p.navigation.category),
    ],
    search: [
      artifact(root, p.search.leaf),
      artifact(root, p.search.group),
      artifact(root, p.search.category),
      artifact(root, p.search.suggestions),
    ],
    html: [
      artifact(root, p.html.leaf),
      artifact(root, p.html.group),
      artifact(root, p.html.category),
    ],
    sitemaps: [
      artifact(root, p.sitemaps.index),
      artifact(root, p.sitemaps.leaf),
      artifact(root, p.sitemaps.group),
      artifact(root, p.sitemaps.category),
      artifact(root, p.sitemaps.crawlManifest),
    ],
  });
}

const PROTEIN_DOMAIN = Object.freeze({
  id: "protein",
  publicationId: "protein-food-ontology",
  phasePrefix: "ONTOLOGY-03",
  certificationPhase: "ONTOLOGY-03F",
  entityLabels: {
    leaf: "Protein Food",
    group: "Protein Group",
    category: "Protein Category",
    leafPlural: "Foods",
    leafCount: "protein foods",
  },
  pageTypes: {
    leaf: "protein_food",
    group: "protein_group",
    category: "protein_category",
    suggestions: "protein_search_suggestions",
  },
  projectionTypes: {
    leaf: "protein_food",
    group: "protein_group",
    category: "protein_category",
  },
  catalogKeys: {
    leaf: "protein_foods",
    groups: "groups",
    categories: "categories",
  },
  leafDisplayField: "name",
  groupDisplayField: "name",
  categoryDisplayField: "name",
  runtimeLayout: "protein",
  runtimeMemberIdsKey: "food_ids",
  runtimeMemberSlugsKey: "food_slugs",
  runtimeGroupSlugsKey: "group_slugs",
  intrinsicFields: [
    "food_category",
    "species",
    "scientific_name",
    "cut_type",
    "anatomical_cut",
    "bone_state",
    "plant_part",
    "edible_structure",
    "processing_state",
    "fat_content",
    "primary_cooking_methods",
    "recommended_doneness",
    "texture",
    "typical_descriptors",
  ],
  groupAggregateFields: {
    species: "species_represented",
    processing_state: "processing_states_represented",
  },
  editorial: {
    byRelationship: {
      similar_to: "similar_foods",
      substitutes_for: "substitutions",
      shares_culinary_role: "culinary_role",
      commonly_prepared_as: "common_preparations",
    },
    symmetric: ["similar_to", "shares_culinary_role"],
    skipInMainLoop: ["similar_to", "shares_culinary_role"],
    crossDomainTargets: [],
    preparationPrefix: "preparation.",
    intraDomainRelationships: [
      "similar_to",
      "substitutes_for",
      "shares_culinary_role",
    ],
  },
  wine: {
    byRelationship: {
      pairs_with_style: "primary_wine_styles",
      also_pairs_with_style: "alternative_wine_styles",
      pairs_with_descriptor: "descriptors",
      pairs_with_technique: "techniques",
    },
  },
  linkSections: {
    leaf: {
      similar_foods: "Similar foods",
      substitutions: "Substitutions",
      culinary_role: "Culinary role",
      common_preparations: "Common preparations",
      primary_wine_styles: "Primary wine styles",
      alternative_wine_styles: "Alternative wine styles",
      wine_descriptors: "Wine descriptors",
      wine_techniques: "Wine techniques",
    },
    group: {
      member_foods: "Member foods",
      related_groups: "Related groups",
    },
    category: {
      groups: "Groups",
      related_categories: "Related categories",
    },
  },
  metadata: {
    leafTitleSuffix: "Protein Food Guide",
    groupTitleSuffix: "Protein Food Group",
    categoryTitleSuffix: "Protein Food Category",
    leafDescriptionTail: "protein food",
    ontologyName: "Pairing Method Food Ontology",
  },
  urls: {
    leafPrefix: "/foods/",
    groupPrefix: "/groups/",
    categoryPrefix: "/categories/",
    hubPath: "/foods/",
    internalPrefixes: ["/foods/", "/groups/", "/categories/"],
  },
  paths: {
    catalog: "data/protein-food-catalog.json",
    runtime: [
      "data/runtime/protein-food-index.json",
      "data/runtime/protein-food-groups.json",
      "data/runtime/protein-food-categories.json",
    ],
    relationships: [
      "data/runtime/protein-food-relationships.json",
      "data/runtime/protein-food-editorial-relationships.json",
      "data/runtime/protein-food-wine-relationships.json",
    ],
    projections: {
      leaf: "data/generated/protein-food-pages.json",
      group: "data/generated/protein-group-pages.json",
      category: "data/generated/protein-category-pages.json",
    },
    pages: {
      leaf: "data/pages/protein-food-pages.json",
      group: "data/pages/protein-group-pages.json",
      category: "data/pages/protein-category-pages.json",
    },
    schema: {
      leaf: "data/schema/protein-food-schema.json",
      group: "data/schema/protein-group-schema.json",
      category: "data/schema/protein-category-schema.json",
    },
    navigation: {
      leaf: "data/navigation/protein-food-links.json",
      group: "data/navigation/protein-group-links.json",
      category: "data/navigation/protein-category-links.json",
    },
    search: {
      leaf: "data/search/protein-food-search-index.json",
      group: "data/search/protein-group-search-index.json",
      category: "data/search/protein-category-search-index.json",
      suggestions: "data/search/protein-search-suggestions.json",
    },
    html: {
      leaf: "dist/foods",
      group: "dist/groups",
      category: "dist/categories",
    },
    sitemaps: {
      index: "dist/sitemap.xml",
      leaf: "dist/sitemaps/protein-food-pages.xml",
      group: "dist/sitemaps/protein-group-pages.xml",
      category: "dist/sitemaps/protein-category-pages.xml",
      crawlManifest: "dist/crawl-manifest.json",
    },
    releaseManifest: "dist/release-manifest.json",
    reports: {
      generator: "reports/generator-report.json",
      pages: "reports/page-generation-report.json",
      schema: "reports/schema-generation-report.json",
      links: "reports/internal-link-report.json",
      search: "reports/search-index-report.json",
      publication: "reports/publication-certification-report.json",
      coverage: "reports/publication-coverage-report.json",
      html: "reports/html-render-report.json",
      sitemap: "reports/sitemap-report.json",
      release: "reports/release-certification-report.json",
    },
  },
  render: {
    template: "protein-entity-template.html",
    entityClasses: {
      leaf: "protein-food-entity-page",
      group: "protein-group-entity-page",
      category: "protein-category-entity-page",
    },
    cssPrefix: "protein",
    module: "../taxonomy-protein-food-render.js",
  },
  deployment: {
    promotionPaths: [
      { source: "dist/foods", target: "foods" },
      { source: "dist/groups", target: "groups" },
      { source: "dist/categories", target: "categories" },
    ],
    sitemapFiles: [
      "sitemaps/protein-food-pages.xml",
      "sitemaps/protein-group-pages.xml",
      "sitemaps/protein-category-pages.xml",
    ],
    cacheHtmlPaths: ["/foods/*", "/groups/*", "/categories/*"],
    smokeSamples: {
      leaf: ["brisket"],
      group: ["beef"],
      category: ["animal-protein"],
    },
  },
  expectedCounts: {
    leaf: 207,
    groups: 16,
    categories: 3,
    total: 226,
  },
  certifyScript: "certify:protein-food-publication",
  htmlPrerequisiteScript: "generate:protein-food-html",
});

const CHEESE_DOMAIN = Object.freeze({
  id: "cheese",
  publicationId: "cheese-ontology",
  phasePrefix: "FOOD-04F",
  certificationPhase: "FOOD-04F",
  entityLabels: {
    leaf: "Cheese",
    group: "Cheese Group",
    category: "Cheese Category",
    leafPlural: "Cheeses",
    leafCount: "cheeses",
  },
  pageTypes: {
    leaf: "cheese",
    group: "cheese_group",
    category: "cheese_category",
    suggestions: "cheese_search_suggestions",
  },
  projectionTypes: {
    leaf: "cheese",
    group: "cheese_group",
    category: "cheese_category",
  },
  catalogKeys: {
    leaf: "cheeses",
    groups: "groups",
    categories: "categories",
  },
  leafDisplayField: "display_name",
  groupDisplayField: "name",
  categoryDisplayField: "name",
  runtimeLayout: "cheese",
  runtimeMemberIdsKey: "cheese_ids",
  runtimeMemberSlugsKey: "cheese_slugs",
  runtimeGroupSlugsKey: "group_slugs",
  intrinsicFields: [
    "cheese_category",
    "milk_source",
    "aging_class",
    "texture",
    "moisture_class",
    "rind_type",
    "pasteurization",
    "origin_country",
    "protected_status",
    "typical_descriptors",
  ],
  groupAggregateFields: {
    milk_source: "milk_sources_represented",
    aging_class: "aging_classes_represented",
  },
  classificationFields: {
    milk_source: "milk_source",
    scientific_name: "scientific_name",
  },
  editorial: {
    byRelationship: {
      similar_to: "similar_cheeses",
      substitutes_for: "substitutions",
      same_family: "same_family",
      commonly_served_with: "commonly_served_with",
    },
    symmetric: ["similar_to", "same_family"],
    skipInMainLoop: ["similar_to", "same_family"],
    crossDomainTargets: ["commonly_served_with"],
    preparationPrefix: null,
    intraDomainRelationships: ["similar_to", "substitutes_for", "same_family"],
  },
  wine: {
    byRelationship: {
      pairs_with_style: "primary_wine_styles",
      also_pairs_with_style: "alternative_wine_styles",
      pairs_with_descriptor: "descriptors",
      pairs_with_technique: "techniques",
    },
  },
  linkSections: {
    leaf: {
      similar_cheeses: "Similar cheeses",
      substitutions: "Substitutions",
      same_family: "Same family",
      commonly_served_with: "Commonly served with",
      primary_wine_styles: "Primary wine styles",
      alternative_wine_styles: "Alternative wine styles",
      wine_descriptors: "Wine descriptors",
      wine_techniques: "Wine techniques",
    },
    group: {
      member_cheeses: "Member cheeses",
      related_groups: "Related groups",
    },
    category: {
      groups: "Groups",
      related_categories: "Related categories",
    },
  },
  metadata: {
    leafTitleSuffix: "Cheese Guide",
    groupTitleSuffix: "Cheese Group",
    categoryTitleSuffix: "Cheese Category",
    leafDescriptionTail: "cheese",
    ontologyName: "Cheese Ontology",
  },
  urls: {
    leafPrefix: "/cheeses/",
    groupPrefix: "/cheese-groups/",
    categoryPrefix: "/cheese-categories/",
    hubPath: "/cheeses/",
    internalPrefixes: ["/cheeses/", "/cheese-groups/", "/cheese-categories/"],
  },
  paths: {
    catalog: "data/cheese-catalog.json",
    runtime: [
      "data/runtime/cheese-bootstrap.json",
      "data/runtime/cheese-groups.json",
      "data/runtime/cheese-categories.json",
      "data/runtime/cheese-indexes.json",
    ],
    relationships: [
      "data/runtime/cheese-relationships.json",
      "data/runtime/cheese-editorial-relationships.json",
      "data/runtime/cheese-wine-relationships.json",
    ],
    projections: {
      leaf: "data/generated/cheese-pages.json",
      group: "data/generated/cheese-group-pages.json",
      category: "data/generated/cheese-category-pages.json",
    },
    pages: {
      leaf: "data/pages/cheese-pages.json",
      group: "data/pages/cheese-group-pages.json",
      category: "data/pages/cheese-category-pages.json",
    },
    schema: {
      leaf: "data/schema/cheese-schema.json",
      group: "data/schema/cheese-group-schema.json",
      category: "data/schema/cheese-category-schema.json",
    },
    navigation: {
      leaf: "data/navigation/cheese-links.json",
      group: "data/navigation/cheese-group-links.json",
      category: "data/navigation/cheese-category-links.json",
    },
    search: {
      leaf: "data/search/cheese-search-index.json",
      group: "data/search/cheese-group-search-index.json",
      category: "data/search/cheese-category-search-index.json",
      suggestions: "data/search/cheese-search-suggestions.json",
    },
    html: {
      leaf: "dist/cheeses",
      group: "dist/cheese-groups",
      category: "dist/cheese-categories",
    },
    sitemaps: {
      index: "dist/sitemap.xml",
      leaf: "dist/sitemaps/cheese-pages.xml",
      group: "dist/sitemaps/cheese-group-pages.xml",
      category: "dist/sitemaps/cheese-category-pages.xml",
      crawlManifest: "dist/crawl-manifest.json",
    },
    releaseManifest: "dist/release-manifest.json",
    reports: {
      generator: "reports/cheese-generator-report.json",
      pages: "reports/cheese-page-generation-report.json",
      schema: "reports/cheese-schema-generation-report.json",
      links: "reports/cheese-internal-link-report.json",
      search: "reports/cheese-search-index-report.json",
      publication: "reports/cheese-publication-certification-report.json",
      coverage: "reports/cheese-publication-coverage-report.json",
      html: "reports/cheese-html-render-report.json",
      sitemap: "reports/cheese-sitemap-report.json",
      release: "reports/cheese-release-certification-report.json",
    },
  },
  render: {
    template: "protein-entity-template.html",
    entityClasses: {
      leaf: "cheese-entity-page",
      group: "cheese-group-entity-page",
      category: "cheese-category-entity-page",
    },
    cssPrefix: "cheese",
    module: "../taxonomy-cheese-render.js",
  },
  deployment: {
    promotionPaths: [
      { source: "dist/cheeses", target: "cheeses" },
      { source: "dist/cheese-groups", target: "cheese-groups" },
      { source: "dist/cheese-categories", target: "cheese-categories" },
    ],
    sitemapFiles: [
      "sitemaps/cheese-pages.xml",
      "sitemaps/cheese-group-pages.xml",
      "sitemaps/cheese-category-pages.xml",
    ],
    cacheHtmlPaths: ["/cheeses/*", "/cheese-groups/*", "/cheese-categories/*"],
    smokeSamples: {
      leaf: ["brie-de-meaux"],
      group: ["bloomy-rind"],
      category: ["cheese"],
    },
  },
  expectedCounts: {
    leaf: 204,
    groups: 9,
    categories: 1,
    total: 214,
  },
  certifyScript: "certify:cheese-publication",
  htmlPrerequisiteScript: "generate:cheese-html",
});

const VEGETABLE_DOMAIN = Object.freeze({
  id: "vegetable",
  publicationId: "vegetable-ontology",
  phasePrefix: "FOOD-05F",
  certificationPhase: "FOOD-05F",
  entityLabels: {
    leaf: "Vegetable",
    group: "Vegetable Group",
    category: "Vegetable Category",
    leafPlural: "Vegetables",
    leafCount: "vegetables",
  },
  pageTypes: {
    leaf: "vegetable",
    group: "vegetable_group",
    category: "vegetable_category",
    suggestions: "vegetable_search_suggestions",
  },
  projectionTypes: {
    leaf: "vegetable",
    group: "vegetable_group",
    category: "vegetable_category",
  },
  catalogKeys: {
    leaf: "vegetables",
    groups: "groups",
    categories: "categories",
  },
  leafDisplayField: "display_name",
  groupDisplayField: "name",
  categoryDisplayField: "name",
  runtimeLayout: "vegetable",
  runtimeMemberIdsKey: "vegetable_ids",
  runtimeMemberSlugsKey: "vegetable_slugs",
  runtimeGroupSlugsKey: "group_slugs",
  intrinsicFields: [
    "culinary_group",
    "culinary_role",
    "plant_part",
    "texture",
    "moisture_class",
    "flavor_intensity",
    "seasonality",
    "scientific_name",
    "flavor_profile",
    "typical_descriptors",
  ],
  groupAggregateFields: {
    culinary_role: "culinary_roles_represented",
    plant_part: "plant_parts_represented",
  },
  classificationFields: {
    culinary_group: "culinary_group",
    scientific_name: "scientific_name",
  },
  editorial: {
    byRelationship: {
      similar_to: "similar_vegetables",
      substitutes_for: "substitutions",
      commonly_served_with: "commonly_served_with",
    },
    symmetric: ["similar_to"],
    skipInMainLoop: ["similar_to"],
    crossDomainTargets: ["commonly_served_with"],
    preparationPrefix: null,
    intraDomainRelationships: ["similar_to", "substitutes_for"],
  },
  wine: {
    byRelationship: {
      pairs_with_style: "primary_wine_styles",
      also_pairs_with_style: "alternative_wine_styles",
      pairs_with_descriptor: "descriptors",
      pairs_with_technique: "techniques",
    },
  },
  linkSections: {
    leaf: {
      similar_vegetables: "Similar vegetables",
      substitutions: "Substitutions",
      commonly_served_with: "Commonly served with",
      primary_wine_styles: "Primary wine styles",
      alternative_wine_styles: "Alternative wine styles",
      wine_descriptors: "Wine descriptors",
      wine_techniques: "Wine techniques",
    },
    group: {
      member_vegetables: "Member vegetables",
      related_groups: "Related groups",
    },
    category: {
      groups: "Groups",
      related_categories: "Related categories",
    },
  },
  metadata: {
    leafTitleSuffix: "Vegetable Guide",
    groupTitleSuffix: "Vegetable Group",
    categoryTitleSuffix: "Vegetable Category",
    leafDescriptionTail: "vegetable",
    ontologyName: "Vegetable Ontology",
  },
  urls: {
    leafPrefix: "/vegetables/",
    groupPrefix: "/vegetable-groups/",
    categoryPrefix: "/vegetable-categories/",
    hubPath: "/vegetables/",
    internalPrefixes: ["/vegetables/", "/vegetable-groups/", "/vegetable-categories/"],
  },
  paths: {
    catalog: "data/vegetable-catalog.json",
    runtime: [
      "data/runtime/vegetable-bootstrap.json",
      "data/runtime/vegetable-groups.json",
      "data/runtime/vegetable-categories.json",
      "data/runtime/vegetable-indexes.json",
    ],
    relationships: [
      "data/runtime/vegetable-relationships.json",
      "data/runtime/vegetable-editorial-relationships.json",
      "data/runtime/vegetable-wine-relationships.json",
    ],
    projections: {
      leaf: "data/generated/vegetable-pages.json",
      group: "data/generated/vegetable-group-pages.json",
      category: "data/generated/vegetable-category-pages.json",
    },
    pages: {
      leaf: "data/pages/vegetable-pages.json",
      group: "data/pages/vegetable-group-pages.json",
      category: "data/pages/vegetable-category-pages.json",
    },
    schema: {
      leaf: "data/schema/vegetable-schema.json",
      group: "data/schema/vegetable-group-schema.json",
      category: "data/schema/vegetable-category-schema.json",
    },
    navigation: {
      leaf: "data/navigation/vegetable-links.json",
      group: "data/navigation/vegetable-group-links.json",
      category: "data/navigation/vegetable-category-links.json",
    },
    search: {
      leaf: "data/search/vegetable-search-index.json",
      group: "data/search/vegetable-group-search-index.json",
      category: "data/search/vegetable-category-search-index.json",
      suggestions: "data/search/vegetable-search-suggestions.json",
    },
    html: {
      leaf: "dist/vegetables",
      group: "dist/vegetable-groups",
      category: "dist/vegetable-categories",
    },
    sitemaps: {
      index: "dist/sitemap.xml",
      leaf: "dist/sitemaps/vegetable-pages.xml",
      group: "dist/sitemaps/vegetable-group-pages.xml",
      category: "dist/sitemaps/vegetable-category-pages.xml",
      crawlManifest: "dist/crawl-manifest.json",
    },
    releaseManifest: "dist/release-manifest.json",
    reports: {
      generator: "reports/vegetable-generator-report.json",
      pages: "reports/vegetable-page-generation-report.json",
      schema: "reports/vegetable-schema-generation-report.json",
      links: "reports/vegetable-internal-link-report.json",
      search: "reports/vegetable-search-index-report.json",
      publication: "reports/vegetable-publication-certification-report.json",
      coverage: "reports/vegetable-publication-coverage-report.json",
      html: "reports/vegetable-html-render-report.json",
      sitemap: "reports/vegetable-sitemap-report.json",
      release: "reports/vegetable-release-certification-report.json",
    },
  },
  render: {
    template: "protein-entity-template.html",
    entityClasses: {
      leaf: "vegetable-entity-page",
      group: "vegetable-group-entity-page",
      category: "vegetable-category-entity-page",
    },
    cssPrefix: "vegetable",
    module: "../taxonomy-vegetable-render.js",
  },
  deployment: {
    promotionPaths: [
      { source: "dist/vegetables", target: "vegetables" },
      { source: "dist/vegetable-groups", target: "vegetable-groups" },
      { source: "dist/vegetable-categories", target: "vegetable-categories" },
    ],
    sitemapFiles: [
      "sitemaps/vegetable-pages.xml",
      "sitemaps/vegetable-group-pages.xml",
      "sitemaps/vegetable-category-pages.xml",
    ],
    cacheHtmlPaths: ["/vegetables/*", "/vegetable-groups/*", "/vegetable-categories/*"],
    smokeSamples: {
      leaf: ["asparagus"],
      group: ["alliums"],
      category: ["vegetable"],
    },
  },
  expectedCounts: {
    leaf: 74,
    groups: 4,
    categories: 1,
    total: 79,
  },
  certifyScript: "certify:vegetable-publication",
  htmlPrerequisiteScript: "generate:vegetable-html",
});

const FUNGI_DOMAIN = Object.freeze({
  id: "fungi",
  publicationId: "fungi-ontology",
  phasePrefix: "FOOD-06F",
  certificationPhase: "FOOD-06F",
  entityLabels: {
    leaf: "Fungus",
    group: "Fungi Group",
    category: "Fungi Category",
    leafPlural: "Fungi",
    leafCount: "fungi",
  },
  pageTypes: {
    leaf: "fungus",
    group: "fungi_group",
    category: "fungi_category",
    suggestions: "fungi_search_suggestions",
  },
  projectionTypes: {
    leaf: "fungus",
    group: "fungi_group",
    category: "fungi_category",
  },
  catalogKeys: {
    leaf: "fungi",
    groups: "groups",
    categories: "categories",
  },
  leafDisplayField: "display_name",
  groupDisplayField: "name",
  categoryDisplayField: "name",
  runtimeLayout: "fungi",
  runtimeMemberIdsKey: "fungus_ids",
  runtimeMemberSlugsKey: "fungus_slugs",
  runtimeGroupSlugsKey: "group_slugs",
  intrinsicFields: [
    "culinary_group",
    "usage_intensity",
    "scientific_name",
    "flavor_profile",
    "texture_profile",
    "aroma_profile",
    "typical_descriptors",
  ],
  groupAggregateFields: {
    usage_intensity: "usage_intensities_represented",
  },
  classificationFields: {
    culinary_group: "culinary_group",
    scientific_name: "scientific_name",
  },
  editorial: {
    byRelationship: {
      similar_to: "similar_fungi",
      substitutes_for: "substitutions",
      commonly_served_with: "commonly_served_with",
    },
    symmetric: ["similar_to"],
    skipInMainLoop: ["similar_to"],
    crossDomainTargets: ["commonly_served_with"],
    preparationPrefix: null,
    intraDomainRelationships: ["similar_to", "substitutes_for"],
  },
  wine: {
    byRelationship: {
      pairs_with_style: "primary_wine_styles",
      also_pairs_with_style: "alternative_wine_styles",
      pairs_with_descriptor: "descriptors",
      pairs_with_technique: "techniques",
    },
  },
  linkSections: {
    leaf: {
      similar_fungi: "Similar fungi",
      substitutions: "Substitutions",
      commonly_served_with: "Commonly served with",
      primary_wine_styles: "Primary wine styles",
      alternative_wine_styles: "Alternative wine styles",
      wine_descriptors: "Wine descriptors",
      wine_techniques: "Wine techniques",
    },
    group: {
      member_fungi: "Member fungi",
      related_groups: "Related groups",
    },
    category: {
      groups: "Groups",
      related_categories: "Related categories",
    },
  },
  metadata: {
    leafTitleSuffix: "Fungi Guide",
    groupTitleSuffix: "Fungi Group",
    categoryTitleSuffix: "Fungi Category",
    leafDescriptionTail: "fungus",
    ontologyName: "Fungi Ontology",
  },
  urls: {
    leafPrefix: "/fungi/",
    groupPrefix: "/fungi-groups/",
    categoryPrefix: "/fungi-categories/",
    hubPath: "/fungi/",
    internalPrefixes: ["/fungi/", "/fungi-groups/", "/fungi-categories/"],
  },
  paths: {
    catalog: "data/fungi-catalog.json",
    runtime: [
      "data/runtime/fungi-bootstrap.json",
      "data/runtime/fungi-groups.json",
      "data/runtime/fungi-categories.json",
      "data/runtime/fungi-indexes.json",
    ],
    relationships: [
      "data/runtime/fungi-relationships.json",
      "data/runtime/fungi-editorial-relationships.json",
      "data/runtime/fungi-wine-relationships.json",
    ],
    projections: {
      leaf: "data/generated/fungi-pages.json",
      group: "data/generated/fungi-group-pages.json",
      category: "data/generated/fungi-category-pages.json",
    },
    pages: {
      leaf: "data/pages/fungi-pages.json",
      group: "data/pages/fungi-group-pages.json",
      category: "data/pages/fungi-category-pages.json",
    },
    schema: {
      leaf: "data/schema/fungi-schema.json",
      group: "data/schema/fungi-group-schema.json",
      category: "data/schema/fungi-category-schema.json",
    },
    navigation: {
      leaf: "data/navigation/fungi-links.json",
      group: "data/navigation/fungi-group-links.json",
      category: "data/navigation/fungi-category-links.json",
    },
    search: {
      leaf: "data/search/fungi-search-index.json",
      group: "data/search/fungi-group-search-index.json",
      category: "data/search/fungi-category-search-index.json",
      suggestions: "data/search/fungi-search-suggestions.json",
    },
    html: {
      leaf: "dist/fungi",
      group: "dist/fungi-groups",
      category: "dist/fungi-categories",
    },
    sitemaps: {
      index: "dist/sitemap.xml",
      leaf: "dist/sitemaps/fungi-pages.xml",
      group: "dist/sitemaps/fungi-group-pages.xml",
      category: "dist/sitemaps/fungi-category-pages.xml",
      crawlManifest: "dist/crawl-manifest.json",
    },
    releaseManifest: "dist/release-manifest.json",
    reports: {
      generator: "reports/fungi-generator-report.json",
      pages: "reports/fungi-page-generation-report.json",
      schema: "reports/fungi-schema-generation-report.json",
      links: "reports/fungi-internal-link-report.json",
      search: "reports/fungi-search-index-report.json",
      publication: "reports/fungi-publication-certification-report.json",
      coverage: "reports/fungi-publication-coverage-report.json",
      html: "reports/fungi-html-render-report.json",
      sitemap: "reports/fungi-sitemap-report.json",
      release: "reports/fungi-release-certification-report.json",
    },
  },
  render: {
    template: "protein-entity-template.html",
    entityClasses: {
      leaf: "fungi-entity-page",
      group: "fungi-group-entity-page",
      category: "fungi-category-entity-page",
    },
    cssPrefix: "fungi",
    module: "../taxonomy-fungi-render.js",
  },
  deployment: {
    promotionPaths: [
      { source: "dist/fungi", target: "fungi" },
      { source: "dist/fungi-groups", target: "fungi-groups" },
      { source: "dist/fungi-categories", target: "fungi-categories" },
    ],
    sitemapFiles: [
      "sitemaps/fungi-pages.xml",
      "sitemaps/fungi-group-pages.xml",
      "sitemaps/fungi-category-pages.xml",
    ],
    cacheHtmlPaths: ["/fungi/*", "/fungi-groups/*", "/fungi-categories/*"],
    smokeSamples: {
      leaf: ["porcini"],
      group: ["wild-mushrooms"],
      category: ["fungi"],
    },
  },
  expectedCounts: {
    leaf: 43,
    groups: 4,
    categories: 1,
    total: 48,
  },
  platformAudit: {
    platformModificationsRequired: 0,
    sharedPublicationPipelineReusePercent: 100,
  },
  releaseSummary: {
    canonicalFungi: 43,
    runtimeRelationships: 531,
    editorialRelationships: 87,
    wineRelationships: 82,
    publicationPages: 48,
  },
  certifyScript: "certify:fungi-publication",
  htmlPrerequisiteScript: "generate:fungi-html",
});

const DOMAINS = Object.freeze({
  protein: PROTEIN_DOMAIN,
  cheese: CHEESE_DOMAIN,
  vegetable: VEGETABLE_DOMAIN,
  fungi: FUNGI_DOMAIN,
});

export function getDomainConfig(domainId, root = ROOT) {
  const base = DOMAINS[domainId];
  if (!base) {
    throw new Error(`Unknown food domain: ${domainId}`);
  }
  return {
    ...base,
    root,
    publicationArtifacts: buildPublicationArtifacts(root, base),
    paths: {
      ...base.paths,
      reports: Object.fromEntries(
        Object.entries(base.paths.reports).map(([key, rel]) => [key, artifact(root, rel)])
      ),
      projections: Object.fromEntries(
        Object.entries(base.paths.projections).map(([key, rel]) => [key, artifact(root, rel)])
      ),
      pages: Object.fromEntries(
        Object.entries(base.paths.pages).map(([key, rel]) => [key, artifact(root, rel)])
      ),
      schema: Object.fromEntries(
        Object.entries(base.paths.schema).map(([key, rel]) => [key, artifact(root, rel)])
      ),
      navigation: Object.fromEntries(
        Object.entries(base.paths.navigation).map(([key, rel]) => [key, artifact(root, rel)])
      ),
      search: Object.fromEntries(
        Object.entries(base.paths.search).map(([key, rel]) => [key, artifact(root, rel)])
      ),
      html: Object.fromEntries(
        Object.entries(base.paths.html).map(([key, rel]) => [key, artifact(root, rel)])
      ),
      sitemaps: Object.fromEntries(
        Object.entries(base.paths.sitemaps).map(([key, rel]) => [key, artifact(root, rel)])
      ),
      releaseManifest: artifact(root, base.paths.releaseManifest),
      catalog: artifact(root, base.paths.catalog),
    },
  };
}

export function listDomainIds() {
  return Object.keys(DOMAINS);
}

export function getProteinReleaseExports(root = ROOT) {
  const domain = getDomainConfig("protein", root);
  return {
    EXPECTED_COUNTS: {
      foods: domain.expectedCounts.leaf,
      groups: domain.expectedCounts.groups,
      categories: domain.expectedCounts.categories,
      total: domain.expectedCounts.total,
    },
    PUBLICATION_ARTIFACTS: domain.publicationArtifacts,
  };
}
