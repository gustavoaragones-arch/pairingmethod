import { serializeRuntime } from "../../scripts/bootstrap-protein-food-catalog.js";
import {
  absoluteUrl,
  termUrl,
  wineStyleUrl,
  winemakingTechniqueUrl,
} from "../public-url.js";
import {
  categoryUrl,
  groupUrl,
  leafUrl,
  readJson,
  relative,
  writeJson,
} from "./utils.js";

const WINE_OUTPUT_KEYS = {
  primary_wine_styles: "primary_styles",
  alternative_wine_styles: "alternative_styles",
  descriptors: "descriptor_affinities",
  techniques: "technique_affinities",
};

function normalizeProjections(projections) {
  if (projections.leaf) return projections;
  return {
    leaf: projections.foods,
    group: projections.groups,
    category: projections.categories,
  };
}

function relationshipByBucket(domain) {
  return Object.fromEntries(
    Object.entries(domain.editorial.byRelationship).map(([relationship, bucket]) => [
      bucket,
      relationship,
    ])
  );
}

function editorialBucketKeys(domain) {
  return [...new Set(Object.values(domain.editorial.byRelationship))];
}

function groupMemberSectionKey(domain) {
  return Object.keys(domain.linkSections.group).find((key) => key !== "related_groups");
}

function preparationLabel(target, prefix) {
  const stripped = prefix ? target.replace(new RegExp(`^${prefix.replace(".", "\\.")}`), "") : target;
  return stripped.replace(/-/g, " ");
}

function crossDomainLabel(target) {
  return target.replace(/-/g, " ");
}

function resolveLeafRef(domain, targetId, leafById) {
  const projection = leafById.get(targetId);
  if (!projection) return null;
  return {
    id: projection.identity.id,
    slug: projection.identity.slug,
    name: projection.identity.name,
    href: leafUrl(domain, projection.identity.slug),
  };
}

function mapEditorialRefs(refs, leafById, domain) {
  return refs
    .map((ref) => {
      const entity = resolveLeafRef(domain, ref.target, leafById);
      if (!entity) return null;
      return {
        ...entity,
        relationship: ref.relationship,
        confidence: ref.confidence,
        derived_from: ref.derived_from,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function mapPreparationRefs(refs, prefix) {
  return refs
    .map((ref) => ({
      target: ref.target,
      label: preparationLabel(ref.target, prefix),
      relationship: ref.relationship,
      confidence: ref.confidence,
      derived_from: ref.derived_from,
    }))
    .sort((a, b) => a.target.localeCompare(b.target));
}

function mapCrossDomainRefs(refs) {
  return refs
    .map((ref) => ({
      target: ref.target,
      label: crossDomainLabel(ref.target),
      relationship: ref.relationship,
      confidence: ref.confidence,
      derived_from: ref.derived_from,
    }))
    .sort((a, b) => a.target.localeCompare(b.target));
}

function mapWineStyleRefs(refs) {
  return refs
    .map((ref) => ({
      slug: ref.target,
      name: ref.target.replace(/-/g, " "),
      href: wineStyleUrl(ref.target),
      relationship: ref.relationship,
      confidence: ref.confidence,
      derived_from: ref.derived_from,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function mapDescriptorRefs(refs) {
  return refs
    .map((ref) => ({
      slug: ref.target,
      name: ref.target.replace(/-/g, " "),
      href: termUrl(ref.target),
      relationship: ref.relationship,
      confidence: ref.confidence,
      derived_from: ref.derived_from,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function mapTechniqueRefs(refs) {
  return refs
    .map((ref) => ({
      slug: ref.target,
      name: ref.target.replace(/-/g, " "),
      href: winemakingTechniqueUrl(ref.target),
      relationship: ref.relationship,
      confidence: ref.confidence,
      derived_from: ref.derived_from,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function mapWineRefs(refs, bucket) {
  if (bucket === "primary_wine_styles" || bucket === "alternative_wine_styles") {
    return mapWineStyleRefs(refs);
  }
  if (bucket === "descriptors") return mapDescriptorRefs(refs);
  if (bucket === "techniques") return mapTechniqueRefs(refs);
  return refs;
}

function leafBreadcrumbs(domain, projection) {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: domain.entityLabels.leafPlural, href: domain.urls.hubPath },
  ];
  if (projection.classification.category) {
    crumbs.push({
      label: projection.classification.category.name,
      href: categoryUrl(domain, projection.classification.category.slug),
    });
  }
  if (projection.classification.group) {
    crumbs.push({
      label: projection.classification.group.name,
      href: groupUrl(domain, projection.classification.group.slug),
    });
  }
  crumbs.push({
    label: projection.identity.name,
    href: leafUrl(domain, projection.identity.slug),
  });
  return crumbs;
}

function leafMetadata(domain, projection, canonicalPath) {
  const title = `${projection.identity.name} — ${domain.metadata.leafTitleSuffix}`;
  const groupName = projection.classification.group?.name ?? "";
  const categoryName = projection.classification.category?.name ?? "";
  const description = [
    projection.identity.name,
    groupName && `(${groupName})`,
    categoryName && `— ${categoryName} ${domain.metadata.leafDescriptionTail}`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title,
    description,
    canonical: absoluteUrl(canonicalPath),
    og_title: title,
    og_description: description,
  };
}

function groupBreadcrumbs(domain, projection) {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: domain.entityLabels.leafPlural, href: domain.urls.hubPath },
  ];
  if (projection.parent_category) {
    crumbs.push({
      label: projection.parent_category.name,
      href: categoryUrl(domain, projection.parent_category.slug),
    });
  }
  crumbs.push({
    label: projection.identity.name,
    href: groupUrl(domain, projection.identity.slug),
  });
  return crumbs;
}

function groupMetadata(domain, projection, canonicalPath) {
  const title = `${projection.identity.name} — ${domain.metadata.groupTitleSuffix}`;
  const description = `${projection.identity.name} — ${projection.food_count} ${domain.entityLabels.leafCount} in the ${domain.metadata.ontologyName}.`;
  return {
    title,
    description,
    canonical: absoluteUrl(canonicalPath),
    og_title: title,
    og_description: description,
  };
}

function categoryBreadcrumbs(domain, projection) {
  return [
    { label: "Home", href: "/" },
    { label: domain.entityLabels.leafPlural, href: domain.urls.hubPath },
    {
      label: projection.identity.name,
      href: categoryUrl(domain, projection.identity.slug),
    },
  ];
}

function categoryMetadata(domain, projection, canonicalPath) {
  const title = `${projection.identity.name} — ${domain.metadata.categoryTitleSuffix}`;
  const description = `${projection.identity.name} — ${projection.group_count} groups and ${projection.food_count} ${domain.entityLabels.leafCount}.`;
  return {
    title,
    description,
    canonical: absoluteUrl(canonicalPath),
    og_title: title,
    og_description: description,
  };
}

function classificationOverview(projection) {
  const overview = {
    display_name: projection.identity.name,
    category: projection.classification.category,
    group: projection.classification.group,
  };
  for (const [key, value] of Object.entries(projection.classification)) {
    if (key !== "category" && key !== "group") {
      overview[key] = value;
    }
  }
  return overview;
}

function mapRelatedSections(domain, projection, leafById) {
  const bucketRelationships = relationshipByBucket(domain);
  const crossDomain = new Set(domain.editorial.crossDomainTargets);
  const prepPrefix = domain.editorial.preparationPrefix;
  const related = {};

  for (const bucketKey of editorialBucketKeys(domain)) {
    const refs = projection.editorial_context[bucketKey] ?? [];
    const relationship = bucketRelationships[bucketKey];

    if (relationship === "commonly_prepared_as" && prepPrefix) {
      related[bucketKey] = mapPreparationRefs(refs, prepPrefix);
    } else if (crossDomain.has(relationship)) {
      related[bucketKey] = mapCrossDomainRefs(refs);
    } else {
      related[bucketKey] = mapEditorialRefs(refs, leafById, domain);
    }
  }

  return related;
}

function mapWinePairingSummary(projection) {
  const summary = {};
  for (const [bucket, outputKey] of Object.entries(WINE_OUTPUT_KEYS)) {
    summary[outputKey] = mapWineRefs(projection.wine_context[bucket] ?? [], bucket);
  }
  return summary;
}

function groupMemberIds(projection) {
  return projection.member_food_ids ?? projection.member_leaf_ids ?? [];
}

function groupAggregateFields(domain, projection) {
  const aggregates = {};
  for (const outputKey of Object.values(domain.groupAggregateFields)) {
    if (outputKey in projection) aggregates[outputKey] = projection[outputKey];
  }
  return aggregates;
}

export function generatePageModels(domain, rawProjections) {
  const projections = normalizeProjections(rawProjections);
  const leafById = new Map(
    projections.leaf.projections.map((projection) => [projection.identity.id, projection])
  );
  const groupById = new Map(
    projections.group.projections.map((projection) => [projection.identity.id, projection])
  );
  const categoryById = new Map(
    projections.category.projections.map((projection) => [projection.identity.id, projection])
  );
  const memberKey = groupMemberSectionKey(domain);

  const leafPages = projections.leaf.projections
    .map((projection) => {
      const canonicalPath = leafUrl(domain, projection.identity.slug);
      return {
        page_type: domain.pageTypes.leaf,
        slug: projection.identity.slug,
        canonical_path: canonicalPath,
        identity: {
          title: projection.identity.name,
          slug: projection.identity.slug,
          id: projection.identity.id,
        },
        breadcrumbs: leafBreadcrumbs(domain, projection),
        overview: classificationOverview(projection),
        characteristics: projection.intrinsic,
        related_foods: mapRelatedSections(domain, projection, leafById),
        wine_pairing_summary: mapWinePairingSummary(projection),
        metadata: leafMetadata(domain, projection, canonicalPath),
        projection_id: projection.identity.id,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const groupPages = projections.group.projections
    .map((projection) => {
      const canonicalPath = groupUrl(domain, projection.identity.slug);
      const members = groupMemberIds(projection)
        .map((id) => resolveLeafRef(domain, id, leafById))
        .filter(Boolean)
        .sort((a, b) => a.slug.localeCompare(b.slug));

      return {
        page_type: domain.pageTypes.group,
        slug: projection.identity.slug,
        canonical_path: canonicalPath,
        identity: {
          title: projection.identity.name,
          slug: projection.identity.slug,
          id: projection.identity.id,
        },
        breadcrumbs: groupBreadcrumbs(domain, projection),
        overview: {
          display_name: projection.identity.name,
          parent_category: projection.parent_category,
          food_count: projection.food_count,
        },
        [memberKey]: members,
        ...groupAggregateFields(domain, projection),
        metadata: groupMetadata(domain, projection, canonicalPath),
        projection_id: projection.identity.id,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const categoryPages = projections.category.projections
    .map((projection) => {
      const canonicalPath = categoryUrl(domain, projection.identity.slug);
      const groups = projection.groups
        .map((group) => {
          const groupProjection = groupById.get(group.id);
          return {
            ...group,
            href: groupUrl(domain, group.slug),
            food_count: groupProjection?.food_count ?? 0,
          };
        })
        .sort((a, b) => a.slug.localeCompare(b.slug));

      return {
        page_type: domain.pageTypes.category,
        slug: projection.identity.slug,
        canonical_path: canonicalPath,
        identity: {
          title: projection.identity.name,
          slug: projection.identity.slug,
          id: projection.identity.id,
        },
        breadcrumbs: categoryBreadcrumbs(domain, projection),
        overview: {
          display_name: projection.identity.name,
          group_count: projection.group_count,
          food_count: projection.food_count,
        },
        groups,
        metadata: categoryMetadata(domain, projection, canonicalPath),
        projection_id: projection.identity.id,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    meta: {
      phase: `${domain.phasePrefix}B`,
      domain: domain.id,
      catalog_version: projections.leaf.meta.catalog_version,
      food_ontology_version: projections.leaf.meta.food_ontology_version,
    },
    leafPages,
    groupPages,
    categoryPages,
    indexes: { leafById, groupById, categoryById },
    projectionCounts: {
      leaf: projections.leaf.projections.length,
      group: projections.group.projections.length,
      category: projections.category.projections.length,
    },
  };
}

function validatePageModels(domain, generated, projections) {
  const errors = [];
  const urls = new Set();
  let duplicateUrls = 0;
  let missingReferences = 0;
  const memberKey = groupMemberSectionKey(domain);

  const leafProjectionIds = new Set(
    projections.leaf.projections.map((projection) => projection.identity.id)
  );
  const groupProjectionIds = new Set(
    projections.group.projections.map((projection) => projection.identity.id)
  );
  const categoryProjectionIds = new Set(
    projections.category.projections.map((projection) => projection.identity.id)
  );

  const allPages = [
    ...generated.leafPages,
    ...generated.groupPages,
    ...generated.categoryPages,
  ];

  for (const page of allPages) {
    if (urls.has(page.canonical_path)) {
      duplicateUrls += 1;
      errors.push(`Duplicate URL: ${page.canonical_path}`);
    }
    urls.add(page.canonical_path);

    if (page.canonical_path.includes(".html")) {
      errors.push(`${page.slug}: canonical path must not include .html`);
    }
    if (!page.canonical_path.endsWith("/")) {
      errors.push(`${page.slug}: canonical path must end with trailing slash`);
    }

    if (page.page_type === domain.pageTypes.leaf && !leafProjectionIds.has(page.projection_id)) {
      missingReferences += 1;
      errors.push(`Missing leaf projection: ${page.projection_id}`);
    }
    if (page.page_type === domain.pageTypes.group && !groupProjectionIds.has(page.projection_id)) {
      missingReferences += 1;
      errors.push(`Missing group projection: ${page.projection_id}`);
    }
    if (
      page.page_type === domain.pageTypes.category &&
      !categoryProjectionIds.has(page.projection_id)
    ) {
      missingReferences += 1;
      errors.push(`Missing category projection: ${page.projection_id}`);
    }
  }

  if (generated.leafPages.length !== projections.leaf.projections.length) {
    errors.push("Leaf page count does not match leaf projections");
  }
  if (generated.groupPages.length !== projections.group.projections.length) {
    errors.push("Group page count does not match group projections");
  }
  if (generated.categoryPages.length !== projections.category.projections.length) {
    errors.push("Category page count does not match category projections");
  }

  for (const page of generated.leafPages) {
    for (const bucket of Object.values(page.related_foods)) {
      for (const item of bucket) {
        if (item.id && !leafProjectionIds.has(item.id)) {
          missingReferences += 1;
          errors.push(`${page.slug}: invalid related leaf ${item.id}`);
        }
      }
    }
  }

  for (const page of generated.groupPages) {
    for (const member of page[memberKey] ?? []) {
      if (!leafProjectionIds.has(member.id)) {
        missingReferences += 1;
        errors.push(`${page.slug}: invalid member leaf ${member.id}`);
      }
    }
  }

  return { errors, duplicateUrls, missingReferences };
}

function packageOutputs(domain, generated) {
  return {
    leaf: {
      meta: {
        ...generated.meta,
        page_type: domain.pageTypes.leaf,
        page_count: generated.leafPages.length,
      },
      pages: generated.leafPages,
    },
    group: {
      meta: {
        ...generated.meta,
        page_type: domain.pageTypes.group,
        page_count: generated.groupPages.length,
      },
      pages: generated.groupPages,
    },
    category: {
      meta: {
        ...generated.meta,
        page_type: domain.pageTypes.category,
        page_count: generated.categoryPages.length,
      },
      pages: generated.categoryPages,
    },
  };
}

function loadProjections(domain) {
  return {
    leaf: readJson(domain.paths.projections.leaf),
    group: readJson(domain.paths.projections.group),
    category: readJson(domain.paths.projections.category),
  };
}

export function runPagesStage(domain) {
  const projections = loadProjections(domain);
  const generated = generatePageModels(domain, projections);
  const packaged = packageOutputs(domain, generated);
  const validation = validatePageModels(domain, generated, projections);

  const determinismPass =
    serializeRuntime(packaged.leaf) ===
    serializeRuntime(packageOutputs(domain, generatePageModels(domain, projections)).leaf);

  const overall =
    validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  const report = {
    phase: `${domain.phasePrefix}B`,
    domain: domain.id,
    overall_result: overall,
    validation_errors: overall === "PASS" ? [] : validation.errors,
    outputs:
      overall === "PASS"
        ? [
            domain.paths.pages.leaf,
            domain.paths.pages.group,
            domain.paths.pages.category,
          ].map((filePath) => relative(domain.root, filePath))
        : undefined,
    metrics: {
      "Leaf pages": generated.leafPages.length,
      "Group pages": generated.groupPages.length,
      "Category pages": generated.categoryPages.length,
      "Duplicate URLs": validation.duplicateUrls,
      "Missing references": validation.missingReferences,
      "Validation errors": validation.errors.length,
      "Overall result": overall,
    },
  };

  if (overall === "FAIL") {
    writeJson(domain.paths.reports.pages, report);
    console.error(validation.errors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(domain.paths.pages.leaf, packaged.leaf);
  writeJson(domain.paths.pages.group, packaged.group);
  writeJson(domain.paths.pages.category, packaged.category);
  writeJson(domain.paths.reports.pages, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${domain.paths.reports.pages}`);
  return report;
}
