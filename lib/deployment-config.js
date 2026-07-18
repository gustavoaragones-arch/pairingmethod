/**
 * DEPLOY-01 — Production deployment configuration.
 * Consumer-only settings for certified release integration.
 */

export const PRODUCTION_ORIGIN = "https://pairingmethod.com";
export const PRODUCTION_HOST = "pairingmethod.com";

export const DOMAIN_DEPLOYMENTS = Object.freeze([
  Object.freeze({
    id: "protein",
    publicationId: "protein-food-ontology",
    promotionPaths: Object.freeze([
      { source: "dist/foods", target: "foods" },
      { source: "dist/groups", target: "groups" },
      { source: "dist/categories", target: "categories" },
    ]),
    sitemapFiles: Object.freeze([
      "sitemaps/protein-food-pages.xml",
      "sitemaps/protein-group-pages.xml",
      "sitemaps/protein-category-pages.xml",
    ]),
    expectedHtmlCounts: Object.freeze({
      leaf: 207,
      groups: 16,
      categories: 3,
      total: 226,
    }),
    smokeSampleSizes: Object.freeze({
      leaf: 10,
      groups: 5,
      categories: 3,
    }),
    htmlDistSections: Object.freeze(["foods", "groups", "categories"]),
    promotedTargets: Object.freeze(["foods", "groups", "categories"]),
    cacheHtmlPaths: Object.freeze(["/foods/*", "/groups/*", "/categories/*"]),
    internalUrlPrefixes: Object.freeze(["/foods/", "/groups/", "/categories/"]),
    hubPath: "/foods/",
    pageModelPaths: Object.freeze({
      leaf: "data/pages/protein-food-pages.json",
      group: "data/pages/protein-group-pages.json",
      category: "data/pages/protein-category-pages.json",
    }),
    navigationPaths: Object.freeze({
      leaf: "data/navigation/protein-food-links.json",
      group: "data/navigation/protein-group-links.json",
      category: "data/navigation/protein-category-links.json",
    }),
    reports: Object.freeze({
      publication: "reports/publication-certification-report.json",
      release: "reports/release-certification-report.json",
      html: "reports/html-render-report.json",
      sitemap: "reports/sitemap-report.json",
      promotion: "reports/promotion-report.json",
    }),
    liveSamples: Object.freeze([
      "/foods/brisket/",
      "/groups/beef/",
      "/categories/animal-protein/",
    ]),
  }),
  Object.freeze({
    id: "cheese",
    publicationId: "cheese-ontology",
    promotionPaths: Object.freeze([
      { source: "dist/cheeses", target: "cheeses" },
      { source: "dist/cheese-groups", target: "cheese-groups" },
      { source: "dist/cheese-categories", target: "cheese-categories" },
    ]),
    sitemapFiles: Object.freeze([
      "sitemaps/cheese-pages.xml",
      "sitemaps/cheese-group-pages.xml",
      "sitemaps/cheese-category-pages.xml",
    ]),
    expectedHtmlCounts: Object.freeze({
      leaf: 204,
      groups: 9,
      categories: 1,
      total: 214,
    }),
    smokeSampleSizes: Object.freeze({
      leaf: 10,
      groups: 5,
      categories: 1,
    }),
    htmlDistSections: Object.freeze(["cheeses", "cheese-groups", "cheese-categories"]),
    promotedTargets: Object.freeze(["cheeses", "cheese-groups", "cheese-categories"]),
    cacheHtmlPaths: Object.freeze([
      "/cheeses/*",
      "/cheese-groups/*",
      "/cheese-categories/*",
    ]),
    internalUrlPrefixes: Object.freeze([
      "/cheeses/",
      "/cheese-groups/",
      "/cheese-categories/",
    ]),
    hubPath: "/cheeses/",
    pageModelPaths: Object.freeze({
      leaf: "data/pages/cheese-pages.json",
      group: "data/pages/cheese-group-pages.json",
      category: "data/pages/cheese-category-pages.json",
    }),
    navigationPaths: Object.freeze({
      leaf: "data/navigation/cheese-links.json",
      group: "data/navigation/cheese-group-links.json",
      category: "data/navigation/cheese-category-links.json",
    }),
    reports: Object.freeze({
      publication: "reports/cheese-publication-certification-report.json",
      release: "reports/cheese-release-certification-report.json",
      html: "reports/cheese-html-render-report.json",
      sitemap: "reports/cheese-sitemap-report.json",
      promotion: "reports/promotion-report.json",
    }),
    liveSamples: Object.freeze([
      "/cheeses/brie-de-meaux/",
      "/cheese-groups/bloomy-rind/",
      "/cheese-categories/cheese/",
    ]),
  }),
]);

/** @deprecated Use DOMAIN_DEPLOYMENTS[0].expectedHtmlCounts — protein backward compat */
export const EXPECTED_HTML_COUNTS = Object.freeze({
  foods: DOMAIN_DEPLOYMENTS[0].expectedHtmlCounts.leaf,
  groups: DOMAIN_DEPLOYMENTS[0].expectedHtmlCounts.groups,
  categories: DOMAIN_DEPLOYMENTS[0].expectedHtmlCounts.categories,
  total: DOMAIN_DEPLOYMENTS[0].expectedHtmlCounts.total,
});

/** @deprecated Use DOMAIN_DEPLOYMENTS[0].smokeSampleSizes — protein backward compat */
export const SMOKE_SAMPLE_SIZES = Object.freeze({
  foods: DOMAIN_DEPLOYMENTS[0].smokeSampleSizes.leaf,
  groups: DOMAIN_DEPLOYMENTS[0].smokeSampleSizes.groups,
  categories: DOMAIN_DEPLOYMENTS[0].smokeSampleSizes.categories,
});

/** @deprecated Use DOMAIN_DEPLOYMENTS[0].promotionPaths — protein backward compat */
export const PROMOTION_PATHS = DOMAIN_DEPLOYMENTS[0].promotionPaths;

export const DEPLOYMENT_MANIFESTS = Object.freeze([
  { source: "dist/crawl-manifest.json", target: "crawl-manifest.json" },
  { source: "dist/release-manifest.json", target: "release-manifest.json" },
]);

/** @deprecated Use DOMAIN_DEPLOYMENTS[0].sitemapFiles — protein backward compat */
export const PROTEIN_SITEMAPS = DOMAIN_DEPLOYMENTS[0].sitemapFiles;

export const CACHE_POLICY = Object.freeze({
  immutable_assets: {
    paths: ["/assets/*"],
    cache_control: "public, max-age=31536000, immutable",
  },
  mutable_publication: {
    paths: [
      "/sitemap.xml",
      "/sitemaps/*",
      "/crawl-manifest.json",
      "/release-manifest.json",
      "/robots.txt",
    ],
    cache_control: "public, max-age=300",
  },
  html_pages: {
    paths: DOMAIN_DEPLOYMENTS.flatMap((domain) => domain.cacheHtmlPaths),
    cache_control: "public, max-age=3600",
  },
});

export const REQUIRED_REPORTS = Object.freeze({
  publication: DOMAIN_DEPLOYMENTS[0].reports.publication,
  release: DOMAIN_DEPLOYMENTS[0].reports.release,
  html: DOMAIN_DEPLOYMENTS[0].reports.html,
  sitemap: DOMAIN_DEPLOYMENTS[0].reports.sitemap,
});

export function getDomainDeployment(domainId) {
  const deployment = DOMAIN_DEPLOYMENTS.find((entry) => entry.id === domainId);
  if (!deployment) {
    throw new Error(`Unknown deployment domain: ${domainId}`);
  }
  return deployment;
}

export function resolveDomainDeployments(domains) {
  if (!domains?.length) {
    return [...DOMAIN_DEPLOYMENTS];
  }
  return domains.map((domain) =>
    typeof domain === "string" ? getDomainDeployment(domain) : domain
  );
}

export function productionUrl(pathname) {
  if (!pathname.startsWith("/")) {
    throw new Error(`productionUrl requires root-relative path, got: ${pathname}`);
  }
  return `${PRODUCTION_ORIGIN}${pathname === "/" ? "/" : pathname}`;
}
