/**
 * AQ-04C — Ontology Mapping Verification.
 *
 * Confirms that identifiers, hierarchy, and denormalized cross-references
 * inside the emitted JSON-LD accurately mirror the governed catalog/
 * projection data they were built from — not that the JSON-LD merely looks
 * well-formed. Read-only; no file is modified.
 */

import { getDomainConfig, listDomainIds } from "../food-domain-config.js";
import { readJson } from "../food-publication/utils.js";

function loadDomain(domainId) {
  const domain = getDomainConfig(domainId);
  return {
    domain,
    schema: {
      leaf: readJson(domain.paths.schema.leaf),
      group: readJson(domain.paths.schema.group),
      category: readJson(domain.paths.schema.category),
    },
    pages: {
      leaf: readJson(domain.paths.pages.leaf),
      group: readJson(domain.paths.pages.group),
      category: readJson(domain.paths.pages.category),
    },
  };
}

function findBlock(jsonLd, type) {
  return jsonLd.find((b) => b["@type"] === type);
}

export function verifyOntologyMapping(root) {
  const domainIds = listDomainIds();
  const issues = [];
  let leafIdentifierChecks = 0;
  let groupIdentifierChecks = 0;
  let categoryIdentifierChecks = 0;
  let hasPartCrossReferenceChecks = 0;
  let isPartOfHierarchyChecks = 0;
  const globalAtIds = new Map(); // @id -> domain/slug, for site-wide uniqueness

  for (const domainId of domainIds) {
    const { schema, pages } = loadDomain(domainId);

    const leafBySlug = new Map(pages.leaf.pages.map((p) => [p.slug, p]));

    // Leaf DefinedTerm.identifier must equal the page's own catalog canonical id.
    for (const entry of schema.leaf.schemas) {
      const page = leafBySlug.get(entry.slug);
      const term = findBlock(entry.json_ld, "DefinedTerm");
      leafIdentifierChecks += 1;
      if (term && page && term.identifier !== page.identity.id) {
        issues.push({
          type: "identifier_mismatch",
          domain: domainId,
          slug: entry.slug,
          expected: page.identity.id,
          found: term.identifier,
        });
      }

      // isPartOf group reference must match the leaf's actual parent group id.
      if (term?.isPartOf && page?.overview?.group) {
        isPartOfHierarchyChecks += 1;
        if (term.isPartOf.identifier !== page.overview.group.id) {
          issues.push({
            type: "isPartOf_group_mismatch",
            domain: domainId,
            slug: entry.slug,
            expected: page.overview.group.id,
            found: term.isPartOf.identifier,
          });
        }
      }

      for (const block of entry.json_ld) {
        if (block["@id"]) {
          const key = block["@id"];
          if (globalAtIds.has(key) && globalAtIds.get(key) !== `${domainId}/${entry.slug}`) {
            issues.push({
              type: "global_duplicate_at_id",
              atId: key,
              firstSeenIn: globalAtIds.get(key),
              duplicateIn: `${domainId}/${entry.slug}`,
            });
          }
          globalAtIds.set(key, `${domainId}/${entry.slug}`);
        }
      }
    }

    // Group DefinedTermSet.identifier must equal the group's own catalog canonical id,
    // and hasPart members must each match the referenced leaf's actual id/name.
    for (const entry of schema.group.schemas) {
      const page = pages.group.pages.find((p) => p.slug === entry.slug);
      const termSet = findBlock(entry.json_ld, "DefinedTermSet");
      groupIdentifierChecks += 1;
      if (termSet && page && termSet.identifier !== page.identity.id) {
        issues.push({
          type: "identifier_mismatch",
          domain: domainId,
          slug: entry.slug,
          expected: page.identity.id,
          found: termSet.identifier,
        });
      }
      if (termSet?.hasPart && page) {
        const memberKey = Object.keys(page).find((k) => Array.isArray(page[k]) && page[k][0]?.id);
        const actualMembers = memberKey ? page[memberKey] : [];
        const actualById = new Map(actualMembers.map((m) => [m.id, m]));
        for (const part of termSet.hasPart) {
          hasPartCrossReferenceChecks += 1;
          const actual = actualById.get(part.identifier);
          if (!actual) {
            issues.push({
              type: "hasPart_no_matching_member",
              domain: domainId,
              group: entry.slug,
              part_identifier: part.identifier,
            });
          } else if (actual.name !== part.name) {
            issues.push({
              type: "hasPart_name_drift",
              domain: domainId,
              group: entry.slug,
              part_identifier: part.identifier,
              schema_name: part.name,
              actual_name: actual.name,
            });
          }
        }
      }
    }

    // Category DefinedTermSet.identifier + hasPart groups, same pattern.
    for (const entry of schema.category.schemas) {
      const page = pages.category.pages.find((p) => p.slug === entry.slug);
      const termSet = findBlock(entry.json_ld, "DefinedTermSet");
      categoryIdentifierChecks += 1;
      if (termSet && page && termSet.identifier !== page.identity.id) {
        issues.push({
          type: "identifier_mismatch",
          domain: domainId,
          slug: entry.slug,
          expected: page.identity.id,
          found: termSet.identifier,
        });
      }
      if (termSet?.hasPart && page?.groups) {
        const actualById = new Map(page.groups.map((g) => [g.id, g]));
        for (const part of termSet.hasPart) {
          hasPartCrossReferenceChecks += 1;
          const actual = actualById.get(part.identifier);
          if (!actual) {
            issues.push({
              type: "hasPart_no_matching_member",
              domain: domainId,
              category: entry.slug,
              part_identifier: part.identifier,
            });
          } else if (actual.name !== part.name) {
            issues.push({
              type: "hasPart_name_drift",
              domain: domainId,
              category: entry.slug,
              part_identifier: part.identifier,
              schema_name: part.name,
              actual_name: actual.name,
            });
          }
        }
      }
    }
  }

  return {
    checks: {
      leaf_identifier_checks: leafIdentifierChecks,
      group_identifier_checks: groupIdentifierChecks,
      category_identifier_checks: categoryIdentifierChecks,
      isPartOf_hierarchy_checks: isPartOfHierarchyChecks,
      hasPart_cross_reference_checks: hasPartCrossReferenceChecks,
      global_at_id_uniqueness_checks: globalAtIds.size,
    },
    issue_count: issues.length,
    issues,
    all_mapped_correctly: issues.length === 0,
  };
}
