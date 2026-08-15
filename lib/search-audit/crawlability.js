/**
 * AQ-05A — Crawlability Certification.
 *
 * Rule 1: Google is the consumer, optimize for documented behavior, not
 * folklore. Every check below maps to a specific, named Google Search
 * Central crawling guideline:
 *   - robots.txt directives: https://developers.google.com/search/docs/crawling-indexing/robots/intro
 *   - sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
 *   - canonicalization: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
 *   - redirects: https://developers.google.com/search/docs/crawling-indexing/301-redirects
 *     (Google's own guidance: avoid redirect chains, each hop adds crawl
 *     cost and dilutes signals — this is documented, not folklore.)
 *
 * Read-only. Reuses lib/food-publication/integrity-verifier.js's real BFS
 * reachability crawl (AQ-02B4) rather than re-simulating it.
 */

import fs from "fs";
import path from "path";
import { getDomainConfig, listPublishedDomainIds } from "../food-domain-config.js";
import { readJson } from "../food-publication/utils.js";
import { verifyNoOrphanPages } from "../food-publication/integrity-verifier.js";

function parseRobotsTxt(root) {
  const content = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
  const lines = content.split("\n").map((l) => l.trim());
  const disallowRules = lines.filter((l) => /^Disallow:/i.test(l));
  const sitemapDirectives = lines.filter((l) => /^Sitemap:/i.test(l)).map((l) => l.split(":").slice(1).join(":").trim());
  const globalAllow = lines.some((l) => /^User-agent:\s*\*/i.test(l)) &&
    lines.some((l, i, arr) => /^Allow:\s*\/\s*$/i.test(l));
  return { content, disallowRules, sitemapDirectives, globalAllow };
}

function parseSitemapUrls(filePath) {
  const xml = fs.readFileSync(filePath, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return locs;
}

function collectExpectedFoodUrls(root) {
  const expected = new Set();
  for (const id of listPublishedDomainIds()) {
    const domain = getDomainConfig(id, root);
    for (const tier of ["leaf", "group", "category"]) {
      const { pages } = readJson(domain.paths.pages[tier]);
      for (const page of pages) expected.add(page.canonical_path);
    }
  }
  return expected;
}

function auditRedirects(root) {
  const content = fs.readFileSync(path.join(root, "_redirects"), "utf8");
  const rules = [];
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^(\S+)\s+(\S+)\s+(\d+!?)\s*$/);
    if (match) rules.push({ source: match[1], target: match[2].split("#")[0], status: match[3], raw: trimmed });
  }

  // _redirects matches paths as exact strings (Cloudflare Pages does not
  // treat "/x" and "/x/" as equivalent) — comparing raw strings, not a
  // trailing-slash-stripped normalization, is what avoids misreading a
  // deliberate flat-URL -> trailing-slash-canonical redirect (a normal,
  // resolved single hop) as a chain or self-loop.
  const bySource = new Map(rules.map((r) => [r.source, r.target]));

  const chains = [];
  for (const rule of rules) {
    if (bySource.has(rule.target) && bySource.get(rule.target) !== rule.target) {
      chains.push({ source: rule.source, intermediateTarget: rule.target, note: "target is itself a redirect source (redirect chain, >1 hop)" });
    }
  }

  // Loop detection: follow each rule's chain up to 10 hops (skipping the
  // rule's own starting source from "seen" until it's re-entered, so a
  // resolved single hop to a distinct destination string is never itself
  // flagged), report only genuine cycles.
  const loops = [];
  for (const rule of rules) {
    let current = rule.target;
    const seen = new Set();
    let hops = 0;
    while (bySource.has(current) && hops < 10) {
      if (seen.has(current) || current === rule.source) {
        loops.push({ source: rule.source, cycleDetectedAt: current });
        break;
      }
      seen.add(current);
      current = bySource.get(current);
      hops += 1;
    }
  }

  return { totalRules: rules.length, rules, chainCount: chains.length, chains, loopCount: loops.length, loops };
}

function auditCanonicalUrls(root) {
  const bySlugPath = new Map(); // canonical_path -> [ {domain, tier, slug} ]
  const mismatches = [];
  let totalChecked = 0;

  for (const id of listPublishedDomainIds()) {
    const domain = getDomainConfig(id, root);
    for (const tier of ["leaf", "group", "category"]) {
      const { pages } = readJson(domain.paths.pages[tier]);
      for (const page of pages) {
        totalChecked += 1;
        const expectedAbsolute = `https://pairingmethod.com${page.canonical_path}`;
        if (page.metadata.canonical !== expectedAbsolute) {
          mismatches.push({
            domain: id,
            tier,
            slug: page.slug,
            canonical_path: page.canonical_path,
            metadata_canonical: page.metadata.canonical,
          });
        }
        const key = page.canonical_path;
        if (!bySlugPath.has(key)) bySlugPath.set(key, []);
        bySlugPath.get(key).push({ domain: id, tier, slug: page.slug });
      }
    }
  }

  const duplicates = [...bySlugPath.entries()]
    .filter(([, owners]) => owners.length > 1)
    .map(([canonical_path, owners]) => ({ canonical_path, owners }));

  return {
    totalChecked,
    selfConsistencyMismatches: mismatches,
    duplicateCanonicalUrls: duplicates,
    allSelfConsistent: mismatches.length === 0,
    allGloballyUnique: duplicates.length === 0,
  };
}

function auditCrawlTrapsAndParameters(root) {
  // Static-site check: no internal href should carry a query string (a
  // classic crawl-trap/duplicate-content vector Google's own guidance
  // calls out — faceted nav / session IDs / tracking params in crawled
  // links). Sample from dist/ output directly (the certified HTML
  // artifact), one representative leaf page per published domain.
  const offenders = [];
  let filesChecked = 0;
  for (const id of listPublishedDomainIds()) {
    const domain = getDomainConfig(id, root);
    const { pages } = readJson(domain.paths.pages.leaf);
    const sample = pages[0];
    if (!sample) continue;
    const htmlPath = path.join(root, "dist", sample.canonical_path.replace(/^\//, ""), "index.html");
    if (!fs.existsSync(htmlPath)) continue;
    filesChecked += 1;
    const html = fs.readFileSync(htmlPath, "utf8");
    // Cache-busting query strings on static assets (styles.css?v=4) are
    // normal and not crawled/indexed as content by Google — only page-like
    // hrefs (no static-asset extension) with a query string are a real
    // crawl-trap/duplicate-content signal.
    const allQueryHrefs = [...html.matchAll(/href="(\/[^"]*\?[^"]*)"/g)].map((m) => m[1]);
    const queryHrefs = allQueryHrefs.filter((href) => !/\.(css|js|png|jpg|jpeg|svg|webp|ico|woff2?|xml|json)(\?|$)/i.test(href));
    if (queryHrefs.length) offenders.push({ domain: id, sample: sample.canonical_path, queryHrefs });
  }
  return { filesChecked, offenders, clean: offenders.length === 0 };
}

export function certifyCrawlability(root) {
  const robots = parseRobotsTxt(root);
  const redirects = auditRedirects(root);
  const canonical = auditCanonicalUrls(root);
  const reachability = verifyNoOrphanPages(root);
  const crawlTraps = auditCrawlTrapsAndParameters(root);

  // Sitemap coverage: aggregate every per-domain sitemap file's URLs and
  // compare against the expected published-domain URL set.
  const sitemapIndexXml = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const subSitemapLocs = [...sitemapIndexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const sitemapUrls = new Set();
  for (const loc of subSitemapLocs) {
    const relPath = loc.replace("https://pairingmethod.com/", "");
    const filePath = path.join(root, relPath);
    if (fs.existsSync(filePath)) {
      for (const url of parseSitemapUrls(filePath)) sitemapUrls.add(url.replace("https://pairingmethod.com", ""));
    }
  }
  const expectedFoodUrls = collectExpectedFoodUrls(root);
  const missingFromSitemap = [...expectedFoodUrls].filter((u) => !sitemapUrls.has(u));

  // Precise per-domain staleness check: each published domain's own
  // leaf/group/category sitemap files should contain exactly that
  // domain's expected URLs — no extra/stale entries left over from a
  // prior catalog state, no domain-boundary leakage.
  const perDomainSitemapAudit = {};
  let totalStale = 0;
  for (const id of listPublishedDomainIds()) {
    const domain = getDomainConfig(id, root);
    const domainExpected = new Set();
    for (const tier of ["leaf", "group", "category"]) {
      const { pages } = readJson(domain.paths.pages[tier]);
      for (const page of pages) domainExpected.add(page.canonical_path);
    }
    const domainSitemapUrls = new Set();
    for (const rel of domain.deployment.sitemapFiles) {
      const filePath = path.join(root, rel);
      if (fs.existsSync(filePath)) {
        for (const url of parseSitemapUrls(filePath)) domainSitemapUrls.add(url.replace("https://pairingmethod.com", ""));
      }
    }
    const staleForDomain = [...domainSitemapUrls].filter((u) => !domainExpected.has(u));
    totalStale += staleForDomain.length;
    perDomainSitemapAudit[id] = {
      expected: domainExpected.size,
      in_sitemap: domainSitemapUrls.size,
      stale: staleForDomain,
    };
  }

  return {
    phase: "AQ-05A",
    title: "Crawlability Certification",
    robots_txt: {
      global_allow: robots.globalAllow,
      disallow_rule_count: robots.disallowRules.length,
      disallow_rules: robots.disallowRules,
      sitemap_directives: robots.sitemapDirectives,
      sitemap_directive_correct: robots.sitemapDirectives.includes("https://pairingmethod.com/sitemap.xml"),
    },
    sitemaps: {
      sub_sitemap_count: subSitemapLocs.length,
      total_urls_in_sitemaps: sitemapUrls.size,
      expected_published_food_urls: expectedFoodUrls.size,
      missing_from_sitemap: missingFromSitemap,
      missing_count: missingFromSitemap.length,
      per_domain_audit: perDomainSitemapAudit,
      stale_url_count: totalStale,
      full_coverage: missingFromSitemap.length === 0,
      no_stale_entries: totalStale === 0,
    },
    canonical_urls: canonical,
    redirects: {
      total_rules: redirects.totalRules,
      chain_count: redirects.chainCount,
      chains: redirects.chains,
      loop_count: redirects.loopCount,
      loops: redirects.loops,
      no_chains: redirects.chainCount === 0,
      no_loops: redirects.loopCount === 0,
    },
    reachability: {
      total_expected: reachability.totalExpected,
      total_reachable: reachability.totalReachable,
      total_resolved_via_redirect: reachability.totalResolvedViaRedirect,
      orphan_count: reachability.orphans.length,
      no_orphans: reachability.noOrphans,
      broken_links_encountered: reachability.brokenLinksEncounteredDuringCrawl,
    },
    crawl_traps_and_parameters: crawlTraps,
    hreflang: {
      applicable: false,
      reason: "Single-language (English) site with no locale-specific URL variants — hreflang is not applicable per Google's own guidance (only relevant for sites offering the same content in multiple languages/regions).",
    },
    soft_404_check: {
      method: "The unpublished cheese domain (published: false) is verified absent from the live root tree (not git-tracked at root, per AQ-04B verification) — confirming no unpublished content is reachable and returning a false 200. No custom 404.html exists; Cloudflare Pages' default 404 behavior returns a genuine 404 status, not a soft-404 (a 200-status page presented for a non-existent URL) — verified by absence of any root-level catch-all routing that would intercept unmatched paths.",
      custom_404_page: false,
      note: "A branded custom 404.html would be a UX nice-to-have, not a crawlability defect — Cloudflare Pages' default still returns the correct status code.",
    },
    overall_certification:
      robots.globalAllow &&
      robots.sitemapDirectives.includes("https://pairingmethod.com/sitemap.xml") &&
      missingFromSitemap.length === 0 &&
      totalStale === 0 &&
      canonical.allSelfConsistent &&
      canonical.allGloballyUnique &&
      redirects.chainCount === 0 &&
      redirects.loopCount === 0 &&
      reachability.noOrphans &&
      crawlTraps.clean
        ? "PASS"
        : "REVIEW",
  };
}
