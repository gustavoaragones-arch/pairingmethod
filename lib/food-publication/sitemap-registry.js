/**
 * AQ-02B2 — Sitemap Completion.
 *
 * The existing per-domain sitemap stage (sitemap.js) merges its own three
 * files into whatever sitemap.xml already exists on disk — additive, but
 * dependent on run history and never self-correcting if a domain is
 * unpublished or a file goes missing. This module replaces that with a
 * full deterministic rebuild every time: given the current
 * NavigationRegistry state, it produces the exact, complete, correct
 * sitemap.xml from scratch. "No manual registration" — the only input is
 * `published: true/false` in food-domain-config.js.
 */

import fs from "fs";
import path from "path";
import { absoluteUrl } from "../public-url.js";
import { getDomainConfig, listPublishedDomainIds } from "../food-domain-config.js";
import { buildSitemapIndex } from "../protein-food-release.js";
import { getPublishedDomainEntries, INGREDIENTS_DIRECTORY_PATH } from "./navigation-registry.js";

const SITE_PAGES_LOC = "sitemaps/site-pages.xml";
const HUB_MARKER_START = "<!-- AQ-02B2:HUB-URLS-START -->";
const HUB_MARKER_END = "<!-- AQ-02B2:HUB-URLS-END -->";

/**
 * Domain hub pages (built in AQ-02B1) and /ingredients/ weren't covered by
 * any sitemap before this — they're structural navigation pages, not
 * per-domain leaf/group/category entities, so they don't belong in any of
 * the per-domain sitemap files. Injecting them into site-pages.xml (inside
 * an idempotent marker block, rebuilt from the registry every run rather
 * than hand-maintained) is what makes navigation, search, and sitemap
 * agree per Rule 3.
 */
export function updateSitePagesWithHubs(root, lastmod = new Date().toISOString()) {
  const sitePagesPath = path.join(root, "sitemaps", "site-pages.xml");
  if (!fs.existsSync(sitePagesPath)) return { updated: false, reason: "site-pages.xml not found" };

  let xml = fs.readFileSync(sitePagesPath, "utf8");
  const markerPattern = new RegExp(`\\s*${HUB_MARKER_START}[\\s\\S]*?${HUB_MARKER_END}`, "g");
  xml = xml.replace(markerPattern, "");

  const hubPaths = getPublishedDomainEntries(root).map((d) => d.hubPath);
  hubPaths.push(INGREDIENTS_DIRECTORY_PATH);

  const entries = hubPaths
    .map(
      (loc) => `  <url>
    <loc>${absoluteUrl(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.7</priority>
  </url>`
    )
    .join("\n\n");

  const block = `  ${HUB_MARKER_START}\n${entries}\n  ${HUB_MARKER_END}`;
  xml = xml.replace("</urlset>", `${block}\n</urlset>`);

  fs.writeFileSync(sitePagesPath, xml, "utf8");
  return { updated: true, hubUrlCount: hubPaths.length };
}

export function buildDeterministicSitemapLocs(root) {
  const locs = new Set();
  locs.add(SITE_PAGES_LOC);
  for (const id of listPublishedDomainIds()) {
    const domain = getDomainConfig(id, root);
    for (const rel of domain.deployment.sitemapFiles) {
      locs.add(rel);
    }
  }
  return [...locs].sort();
}

export function runSitemapIndexStage(root, lastmod = new Date().toISOString()) {
  const hubUpdate = updateSitePagesWithHubs(root, lastmod);
  const locs = buildDeterministicSitemapLocs(root);
  const entries = locs.map(
    (rel) => `  <sitemap>
    <loc>${absoluteUrl(`/${rel}`)}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
  );
  const xml = buildSitemapIndex(entries);

  const distOut = path.join(root, "dist", "sitemap.xml");
  const rootOut = path.join(root, "sitemap.xml");
  fs.mkdirSync(path.dirname(distOut), { recursive: true });
  fs.writeFileSync(distOut, xml, "utf8");
  fs.writeFileSync(rootOut, xml, "utf8");

  return { locCount: locs.length, locs, distOut, rootOut, hubUpdate };
}
