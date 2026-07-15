const SITE_ORIGIN = "https://pairingmethod.com";
const HTML_SUFFIX = /\.html$/i;
const INDEX_FILE = /(^|\/)index\.html$/i;
const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Convert a physical HTML file path into its public Cloudflare Pages route.
 *
 * Physical files keep their `.html` names; only the public URL is normalized.
 * Nested index files retain a trailing slash to match directory routes.
 *
 * @param {string} filePath
 * @returns {string}
 */
export function publicPath(filePath) {
  const normalized = normalizeFilePath(filePath);

  if (normalized.toLowerCase() === "index.html") return "/";

  if (INDEX_FILE.test(normalized)) {
    return `/${normalized.replace(INDEX_FILE, "$1")}`;
  }

  return `/${normalized.replace(HTML_SUFFIX, "")}`;
}

/**
 * Convert a site-relative public path into an absolute production URL.
 *
 * @param {string} path
 * @returns {string}
 */
export function absoluteUrl(path) {
  if (typeof path !== "string" || path.trim() === "") {
    throw new TypeError("absoluteUrl(path) requires a non-empty string");
  }

  const normalized = path.trim();
  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    throw new TypeError("absoluteUrl(path) requires a root-relative path");
  }

  return `${SITE_ORIGIN}${normalized === "/" ? "/" : normalized}`;
}

/**
 * Build the absolute canonical URL for a physical file path or public path.
 *
 * @param {string} filePath
 * @returns {string}
 */
export function canonicalUrl(filePath) {
  return absoluteUrl(publicPath(filePath));
}

/**
 * Build the Open Graph URL for a physical file path or public path.
 *
 * @param {string} filePath
 * @returns {string}
 */
export function ogUrl(filePath) {
  return absoluteUrl(publicPath(filePath));
}

/**
 * Build a structured-data URL for a physical file path or public path.
 *
 * @param {string} filePath
 * @returns {string}
 */
export function schemaUrl(filePath) {
  return absoluteUrl(publicPath(filePath));
}

/**
 * Build a route from a complete pairing page slug such as
 * `wine-with-steak` or `wine-for-bbq-ribs`.
 *
 * @param {string} slug
 * @returns {string}
 */
export function pairingUrl(slug) {
  return `/${normalizeSlug(slug)}`;
}

/**
 * @param {string} slug
 * @returns {string}
 */
export function termUrl(slug) {
  return `/terms/${normalizeSlug(slug)}`;
}

/**
 * Public href for any taxonomy node (category, group, or descriptor).
 *
 * @param {{ slug: string, type?: string, category?: string }} node
 * @returns {string}
 */
export function taxonomyNodeHref(node) {
  if (!node?.slug) {
    throw new TypeError("taxonomyNodeHref(node) requires a taxonomy node with slug");
  }
  if (node.type === "category") return termCategoryUrl(node.slug);
  if (node.type === "group") return `${termCategoryUrl(node.category)}#${node.slug}`;
  return termUrl(node.slug);
}

/**
 * @param {string} slug Category slug (e.g. body, fruit)
 * @returns {string}
 */
export function termCategoryUrl(slug) {
  return `/terms/${normalizeSlug(slug)}/`;
}

/**
 * @param {string} slug
 * @returns {string}
 */
export function grapeUrl(slug) {
  return `/grapes/${normalizeSlug(slug)}`;
}

function normalizeFilePath(filePath) {
  if (typeof filePath !== "string" || filePath.trim() === "") {
    throw new TypeError("publicPath(filePath) requires a non-empty string");
  }

  if (filePath.trim() === "/") return "index.html";

  const normalized = filePath
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\.?\//, "")
    .replace(/\/{2,}/g, "/");

  if (
    normalized === "" ||
    normalized.startsWith("../") ||
    normalized.includes("/../") ||
    normalized.includes(":") ||
    normalized.includes("?") ||
    normalized.includes("#")
  ) {
    throw new TypeError("publicPath(filePath) requires a local page path");
  }

  return normalized;
}

function normalizeSlug(slug) {
  if (typeof slug !== "string" || !VALID_SLUG.test(slug)) {
    throw new TypeError(
      "Route helpers require a lowercase, hyphen-separated slug"
    );
  }

  return slug;
}
