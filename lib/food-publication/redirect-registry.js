/**
 * AQ-02B4 — Redirect Registry.
 *
 * Closes AQ-01/AQ-01R finding TC-02 and the orphan-page finding this
 * milestone's reachability crawl surfaced: 51 protein-food entities are
 * marked `refinement.redirect_required: true` with a
 * `canonical_publication_path` already specified, but `_redirects` had
 * zero matching entries — so the deprecated pages were live duplicates
 * with no path back to their canonical replacement, and (as this
 * milestone discovered) unreachable via internal links at all, because
 * the runtime layer's own member lists no longer include them.
 *
 * This is registry-driven the same way navigation/search/sitemap are:
 * it reads `redirect_required` + `canonical_publication_path` directly
 * off each catalog entity rather than a hand-maintained list, so a
 * future deprecation only requires setting those two fields — this
 * module and `_redirects` regenerate the rest automatically.
 */

import fs from "fs";
import path from "path";
import { readJson } from "./utils.js";

const MARKER_START = "# AQ-02B4:REDIRECTS-START";
const MARKER_END = "# AQ-02B4:REDIRECTS-END";

export function collectDeprecatedRedirects(root, domainId, catalogRelPath, leafKey, sourcePrefix) {
  const catalog = readJson(path.join(root, catalogRelPath));
  const entries = (catalog[leafKey] ?? []).filter((e) => e.refinement?.redirect_required);
  return entries
    .map((e) => ({
      domain: domainId,
      slug: e.slug,
      from: `${sourcePrefix}${e.slug}`,
      to: e.refinement.canonical_publication_path,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function collectProteinMigrationRedirects(root) {
  const migrationMap = readJson(path.join(root, "data/protein-migration-map.json"));
  return migrationMap.migrations
    .filter((entry) => entry.redirect_required)
    .map((entry) => ({
      domain: "protein",
      slug: entry.legacy_slug,
      from: entry.legacy_publication_path,
      to: entry.canonical_publication_path,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Only protein currently has deprecated entities; other domains are checked too so a future one is picked up automatically. */
function allDeprecatedRedirects(root) {
  const specs = [
    ["fruit", "data/fruit-catalog.json", "fruits", "/fruits/"],
    ["vegetable", "data/vegetable-catalog.json", "vegetables", "/vegetables/"],
    ["grain-starch", "data/grain-starch-catalog.json", "grain_starches", "/grains-starches/"],
    ["legume", "data/legume-catalog.json", "legumes", "/legumes/"],
    ["nut-seed", "data/nut-seed-catalog.json", "nut_seeds", "/nut-seeds/"],
    ["herb-spice", "data/herb-spice-catalog.json", "herb_spices", "/herbs-spices/"],
    ["sweet-flavor", "data/sweet-flavor-catalog.json", "sweet_flavors", "/sweet-flavors/"],
    ["sauce-condiment", "data/sauce-condiment-catalog.json", "sauce_condiments", "/sauce-condiments/"],
    ["fungi", "data/fungi-catalog.json", "fungi", "/fungi/"],
    ["cheese", "data/cheese-catalog.json", "cheeses", "/cheeses/"],
  ];
  return [
    ...collectProteinMigrationRedirects(root),
    ...specs.flatMap(([domainId, catalogRelPath, leafKey, prefix]) =>
      collectDeprecatedRedirects(root, domainId, catalogRelPath, leafKey, prefix)
    ),
  ];
}

export function runRedirectRegistryStage(root) {
  const redirects = allDeprecatedRedirects(root);
  const redirectsPath = path.join(root, "_redirects");
  let content = fs.readFileSync(redirectsPath, "utf8");

  const markerPattern = new RegExp(`\\n*${MARKER_START}[\\s\\S]*?${MARKER_END}\\n?`, "g");
  content = content.replace(markerPattern, "");

  const lines = redirects.flatMap((r) => {
    const sources = r.from.endsWith("/") ? [r.from.slice(0, -1), r.from] : [r.from];
    return sources.map((source) => `${source} ${r.to} 301`);
  });
  const block = `\n${MARKER_START}\n${lines.join("\n")}\n${MARKER_END}\n`;
  content = `${content.trimEnd()}\n${block}`;

  fs.writeFileSync(redirectsPath, content, "utf8");
  return { redirectsPath, redirectCount: redirects.length, redirects };
}
