/**
 * DEPLOY-01 — Production deployment configuration.
 * Consumer-only settings for certified release integration.
 */

export const PRODUCTION_ORIGIN = "https://pairingmethod.com";
export const PRODUCTION_HOST = "pairingmethod.com";

export const EXPECTED_HTML_COUNTS = Object.freeze({
  foods: 207,
  groups: 16,
  categories: 3,
  total: 226,
});

export const SMOKE_SAMPLE_SIZES = Object.freeze({
  foods: 10,
  groups: 5,
  categories: 3,
});

export const PROMOTION_PATHS = Object.freeze([
  { source: "dist/foods", target: "foods" },
  { source: "dist/groups", target: "groups" },
  { source: "dist/categories", target: "categories" },
]);

export const DEPLOYMENT_MANIFESTS = Object.freeze([
  { source: "dist/crawl-manifest.json", target: "crawl-manifest.json" },
  { source: "dist/release-manifest.json", target: "release-manifest.json" },
]);

export const PROTEIN_SITEMAPS = Object.freeze([
  "sitemaps/protein-food-pages.xml",
  "sitemaps/protein-group-pages.xml",
  "sitemaps/protein-category-pages.xml",
]);

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
    paths: ["/foods/*", "/groups/*", "/categories/*"],
    cache_control: "public, max-age=3600",
  },
});

export const REQUIRED_REPORTS = Object.freeze({
  publication: "reports/publication-certification-report.json",
  release: "reports/release-certification-report.json",
  html: "reports/html-render-report.json",
  sitemap: "reports/sitemap-report.json",
});

export function productionUrl(pathname) {
  if (!pathname.startsWith("/")) {
    throw new Error(`productionUrl requires root-relative path, got: ${pathname}`);
  }
  return `${PRODUCTION_ORIGIN}${pathname === "/" ? "/" : pathname}`;
}
