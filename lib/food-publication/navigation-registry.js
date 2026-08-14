/**
 * AQ-02B1 — Navigation Registry.
 *
 * Single source of truth for "what food domains exist and are published,"
 * consumed by hub generation, search generation, sitemap generation, and
 * the shared site nav. A domain becomes navigable, searchable, and
 * sitemap-listed by setting `published: true` in its food-domain-config.js
 * entry — nothing else has to be told about it individually. This is the
 * concrete fix for AQ-01/AQ-01R Rule 1: "Individual domains must never
 * hardcode shared navigation."
 */

import { getDomainConfig, listDomainIds, listPublishedDomainIds } from "../food-domain-config.js";

/** The master directory page every published domain hub links back to. */
export const INGREDIENTS_DIRECTORY_PATH = "/ingredients/";

function navEntry(domain) {
  return {
    id: domain.id,
    published: domain.published,
    label: domain.entityLabels.leafPlural,
    hubPath: domain.urls.hubPath,
    groupPrefix: domain.urls.groupPrefix,
    categoryPrefix: domain.urls.categoryPrefix,
    leafCount: domain.expectedCounts.leaf,
    groupCount: domain.expectedCounts.groups,
    categoryCount: domain.expectedCounts.categories,
  };
}

/** Every registered food domain, published or not — for internal tooling/QA only. */
export function getAllDomainEntries(root) {
  return listDomainIds()
    .map((id) => navEntry(getDomainConfig(id, root)))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Domains that are actually live and should appear in nav/search/sitemap. */
export function getPublishedDomainEntries(root) {
  return listPublishedDomainIds()
    .map((id) => navEntry(getDomainConfig(id, root)))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Sibling published domains for a given domain id — used so a hub page is never a dead end. */
export function getSiblingDomainEntries(domainId, root) {
  return getPublishedDomainEntries(root).filter((entry) => entry.id !== domainId);
}
