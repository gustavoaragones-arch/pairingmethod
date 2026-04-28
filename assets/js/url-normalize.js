/**
 * Client-side normalization to a single canonical URL (HTTPS, trailing slash,
 * /index.html → /, and extensionless paths for known flat .html pages).
 * Skips file:// and local hostnames so static previews keep working.
 */
(function () {
  const { protocol, hostname, pathname, search, hash } = window.location;

  if (protocol === "file:") return;
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".local")
  ) {
    return;
  }

  let path = pathname;

  if (path === "/index.html") {
    path = "/";
  }

  if (path.length > 1 && path.endsWith("/")) {
    path = path.replace(/\/+$/, "") || "/";
  }

  const routes = ["/pairings", "/wine-with-salmon", "/wine-with-roasted-chicken"];
  if (routes.includes(path)) {
    path += ".html";
  }

  const proto = protocol === "https:" ? "https:" : "https:";
  const normalized = `${proto}//${hostname}${path}${search}${hash}`;
  const current = `${protocol}//${hostname}${pathname}${search}${hash}`;

  if (normalized !== current) {
    window.location.replace(normalized);
  }
})();
