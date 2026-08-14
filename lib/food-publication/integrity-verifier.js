/**
 * AQ-02B4 — Publication Integrity Verifier.
 *
 * Two independent checks that tie together everything AQ-02B built:
 *
 * 1. Internal linking reachability: a real breadth-first crawl of the
 *    published food-ontology site starting from /ingredients/, following
 *    every internal href actually present in the HTML (not just trusting
 *    that generation produced correct links). Every published leaf, group,
 *    and category page must be reachable — this is the closest thing to
 *    proving "a first-time visitor can navigate to every published
 *    ontology" rather than asserting it.
 *
 * 2. Knowledge integrity (detection only, per Rule 4 — publication
 *    consumes, it doesn't create or fix knowledge): scans published
 *    catalogs for known drift patterns (taxonomy misclassification,
 *    non-taxonomic "scientific_name" values, duplicate slugs, empty
 *    groups/categories) and reports them. Nothing here modifies a
 *    catalog — findings are for a future editorial/ontology pass.
 */

import fs from "fs";
import path from "path";
import { getDomainConfig, listPublishedDomainIds } from "../food-domain-config.js";
import { readJson } from "./utils.js";
import { INGREDIENTS_DIRECTORY_PATH } from "./navigation-registry.js";

function loadRedirectMap(root) {
  const content = fs.readFileSync(path.join(root, "_redirects"), "utf8");
  const map = new Map();
  for (const line of content.split("\n")) {
    const match = line.match(/^(\/\S+)\s+(\S+)\s+30[12]!?\s*$/);
    if (match) map.set(match[1], match[2].split("#")[0]);
  }
  return map;
}

const HREF_PATTERN = /href="(\/[^"#?]*)"/g;

function urlToFilePath(root, url) {
  let clean = url.split("#")[0].split("?")[0];
  if (clean === "/") return path.join(root, "index.html");
  if (clean.endsWith("/")) return path.join(root, clean, "index.html");
  if (clean.endsWith(".html")) return path.join(root, clean);
  // clean URL served from a flat file, e.g. /about -> about.html
  const flat = path.join(root, `${clean}.html`);
  if (fs.existsSync(flat)) return flat;
  return path.join(root, clean, "index.html");
}

function extractHrefs(html) {
  const hrefs = [];
  let match = HREF_PATTERN.exec(html);
  while (match) {
    hrefs.push(match[1]);
    match = HREF_PATTERN.exec(html);
  }
  return hrefs;
}

/** BFS the live root tree starting from /ingredients/ and the homepage, following every internal href found. */
export function verifyReachability(root, { maxPages = 20000 } = {}) {
  const visited = new Set();
  const queue = ["/", INGREDIENTS_DIRECTORY_PATH];
  const brokenLinks = [];

  while (queue.length && visited.size < maxPages) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    const filePath = urlToFilePath(root, url);
    if (!fs.existsSync(filePath)) {
      if (url !== "/") brokenLinks.push(url);
      continue;
    }
    const html = fs.readFileSync(filePath, "utf8");
    for (const href of extractHrefs(html)) {
      if (!visited.has(href)) queue.push(href);
    }
  }

  return { visited, brokenLinks };
}

/** Every published leaf/group/category canonical URL must appear in the reachability crawl. */
export function verifyNoOrphanPages(root) {
  const { visited, brokenLinks } = verifyReachability(root);
  const redirects = loadRedirectMap(root);
  const orphans = [];
  const redirectedPages = [];
  let totalExpected = 0;

  for (const id of listPublishedDomainIds()) {
    const domain = getDomainConfig(id, root);
    for (const tier of ["leaf", "group", "category"]) {
      const { pages } = readJson(domain.paths.pages[tier]);
      for (const page of pages) {
        totalExpected += 1;
        if (visited.has(page.canonical_path)) continue;

        const urlNoTrailingSlash = page.canonical_path.replace(/\/$/, "");
        const redirectTarget = redirects.get(urlNoTrailingSlash) ?? redirects.get(page.canonical_path);
        if (redirectTarget && visited.has(redirectTarget)) {
          redirectedPages.push({ domain: id, tier, url: page.canonical_path, redirectsTo: redirectTarget });
          continue;
        }

        orphans.push({ domain: id, tier, url: page.canonical_path, hasUnresolvedRedirect: !!redirectTarget });
      }
    }
  }

  return {
    totalExpected,
    totalReachable: totalExpected - orphans.length - redirectedPages.length,
    totalResolvedViaRedirect: redirectedPages.length,
    redirectedPages,
    orphans,
    brokenLinksEncounteredDuringCrawl: brokenLinks,
    pagesVisitedInCrawl: visited.size,
    noOrphans: orphans.length === 0,
  };
}

const ANIMAL_BINOMIALS = new Set([
  "Bos taurus",
  "Capra hircus",
  "Ovis aries",
  "Bubalus bubalis",
]);

// An animal binomial as scientific_name is CORRECT for a raw animal-tissue product
// (a ribeye is literally Bos taurus tissue — same convention as a fruit's
// scientific_name being the plant it comes from). It's only a category error for a
// manufactured/derived product that isn't itself an anatomical part of that animal —
// cheese is the confirmed case (a cheese is not a cow). Scoped to domains where the
// entity is a derived product, not raw meat/protein cuts.
const DERIVED_PRODUCT_DOMAINS = new Set(["cheese"]);

/** Detection only — reports drift, never modifies a catalog (Rule 4). */
export function verifyKnowledgeIntegrity(root) {
  const findings = [];

  const catalogSpecs = [
    ["protein", "data/protein-food-catalog.json", "protein_foods", "groups", "categories"],
    ["fruit", "data/fruit-catalog.json", "fruits", "groups", "categories"],
    ["vegetable", "data/vegetable-catalog.json", "vegetables", "groups", "categories"],
    ["grain-starch", "data/grain-starch-catalog.json", "grain_starches", "groups", "categories"],
    ["legume", "data/legume-catalog.json", "legumes", "groups", "categories"],
    ["nut-seed", "data/nut-seed-catalog.json", "nut_seeds", "groups", "categories"],
    ["herb-spice", "data/herb-spice-catalog.json", "herb_spices", "groups", "categories"],
    ["sweet-flavor", "data/sweet-flavor-catalog.json", "sweet_flavors", "groups", "categories"],
    ["sauce-condiment", "data/sauce-condiment-catalog.json", "sauce_condiments", "groups", "categories"],
    ["fungi", "data/fungi-catalog.json", "fungi", "groups", "categories"],
    ["cheese", "data/cheese-catalog.json", "cheeses", "groups", "categories"],
  ];

  for (const [domainId, relPath, leafKey, groupKey, catKey] of catalogSpecs) {
    const catalog = readJson(path.join(root, relPath));
    const leaves = catalog[leafKey] ?? [];
    const groups = catalog[groupKey] ?? [];
    const categories = catalog[catKey] ?? [];

    // Non-taxonomic scientific_name values (e.g. cheese entities carrying their
    // source animal's binomial as if it were the cheese's own taxonomic name).
    for (const leaf of leaves) {
      if (DERIVED_PRODUCT_DOMAINS.has(domainId) && ANIMAL_BINOMIALS.has(leaf.scientific_name)) {
        findings.push({
          type: "non_taxonomic_scientific_name",
          domain: domainId,
          entity: leaf.id,
          value: leaf.scientific_name,
          note: "scientific_name holds the source organism's binomial, not a taxonomic designation for this entity itself.",
        });
      }
    }

    // Duplicate slugs within a domain tier.
    for (const [tierName, items] of [["leaf", leaves], ["group", groups], ["category", categories]]) {
      const seen = new Map();
      for (const item of items) {
        const count = (seen.get(item.slug) ?? 0) + 1;
        seen.set(item.slug, count);
      }
      for (const [slug, count] of seen) {
        if (count > 1) {
          findings.push({ type: "duplicate_slug", domain: domainId, tier: tierName, slug, count });
        }
      }
    }

    // Empty groups (zero members) / empty categories (zero groups) — orphaned taxonomy nodes.
    const groupSlugSet = new Set(groups.map((g) => g.slug));
    const leafGroupCounts = new Map();
    for (const leaf of leaves) {
      leafGroupCounts.set(leaf.parent_group, (leafGroupCounts.get(leaf.parent_group) ?? 0) + 1);
    }
    for (const group of groups) {
      if (!leafGroupCounts.get(group.slug)) {
        findings.push({ type: "empty_group", domain: domainId, group: group.slug });
      }
      if (group.parent_category && !categories.some((c) => c.slug === group.parent_category)) {
        findings.push({
          type: "orphan_group_parent_category",
          domain: domainId,
          group: group.slug,
          missing_category: group.parent_category,
        });
      }
    }
    for (const leaf of leaves) {
      if (leaf.parent_group && !groupSlugSet.has(leaf.parent_group)) {
        findings.push({
          type: "orphan_leaf_parent_group",
          domain: domainId,
          entity: leaf.id,
          missing_group: leaf.parent_group,
        });
      }
    }
  }

  // Known plant_part / group-name mismatch pattern (the AQ-01/AQ-01R chayote finding),
  // generalized: flag any vegetable whose plant_part is "fruit_vegetable" but whose
  // parent_group name suggests a different botanical part.
  const vegetables = readJson(path.join(root, "data/vegetable-catalog.json"));
  const rootVegetableGroupSlugs = new Set(
    (vegetables.groups ?? []).filter((g) => /root/i.test(g.name)).map((g) => g.slug)
  );
  for (const veg of vegetables.vegetables ?? []) {
    if (veg.plant_part === "fruit_vegetable" && rootVegetableGroupSlugs.has(veg.parent_group)) {
      findings.push({
        type: "taxonomy_drift",
        domain: "vegetable",
        entity: veg.id,
        note: `plant_part is "fruit_vegetable" but filed under a root-vegetables group (${veg.parent_group}) — the AQ-01/AQ-01R chayote finding, checked here across the whole domain rather than one sampled entity.`,
      });
    }
  }

  return { findingCount: findings.length, findings, noKnowledgeIntegrityIssues: findings.length === 0 };
}

export function runPublicationIntegrityStage(root) {
  const reachability = verifyNoOrphanPages(root);
  const knowledgeIntegrity = verifyKnowledgeIntegrity(root);
  return { reachability, knowledgeIntegrity };
}
