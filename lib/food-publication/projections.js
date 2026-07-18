import { serializeRuntime } from "../../scripts/bootstrap-protein-food-catalog.js";
import { loadDomainInputs } from "./runtime-loader.js";
import { entityRef, writeJson } from "./utils.js";

function canonicalEdgeKey(edge, symmetric) {
  if (symmetric.has(edge.relationship)) {
    const [a, b] =
      edge.source.localeCompare(edge.target) <= 0
        ? [edge.source, edge.target]
        : [edge.target, edge.source];
    return `${a}\t${edge.relationship}\t${b}`;
  }
  return `${edge.source}\t${edge.relationship}\t${edge.target}`;
}

function relationshipRef(edge) {
  return {
    relationship: edge.relationship,
    target: edge.target,
    confidence: edge.confidence,
    derived_from: edge.derived_from,
  };
}

function intrinsicFromEntity(entity, fields) {
  const intrinsic = {};
  for (const field of fields) {
    if (field in entity) intrinsic[field] = entity[field];
  }
  return intrinsic;
}

function indexEdgesBySource(edges) {
  const map = {};
  for (const edge of edges) {
    if (!map[edge.source]) map[edge.source] = [];
    map[edge.source].push(edge);
  }
  return map;
}

function indexSymmetricEdges(edges, relationship) {
  const map = {};
  for (const edge of edges) {
    if (edge.relationship !== relationship) continue;
    for (const id of [edge.source, edge.target]) {
      if (!map[id]) map[id] = [];
      const other = id === edge.source ? edge.target : edge.source;
      map[id].push({ ...edge, target: other, source: id });
    }
  }
  return map;
}

function buildRelationshipRegistry(structural, editorial, pairing, symmetric) {
  const registry = new Map();
  for (const layer of [structural, editorial, pairing]) {
    for (const edge of layer.edges) {
      registry.set(
        canonicalEdgeKey(edge, symmetric),
        edge
      );
    }
  }
  return registry;
}

function emptyEditorialContext(domain) {
  return Object.fromEntries(
    Object.values(domain.editorial.byRelationship).map((bucket) => [bucket, []])
  );
}

function emptyWineContext(domain) {
  return Object.fromEntries(
    Object.values(domain.wine.byRelationship).map((bucket) => [bucket, []])
  );
}

export function generateProjections(domain, inputs) {
  const {
    catalog,
    leaves,
    groups,
    categories,
    index,
    runtimeGroups,
    runtimeCategories,
    structural,
    editorial,
    pairing,
  } = inputs;

  const symmetric = new Set(domain.editorial.symmetric);
  const groupBySlug = Object.fromEntries(groups.map((g) => [g.slug, g]));
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const leafById = Object.fromEntries(leaves.map((f) => [f.id, f]));
  const leafIds = new Set(leaves.map((f) => f.id));
  const groupIds = new Set(groups.map((g) => g.id));
  const categoryIds = new Set(categories.map((c) => c.id));

  const editorialBySource = indexEdgesBySource(editorial.edges);
  const pairingBySource = indexEdgesBySource(pairing.edges);
  const symmetricHandlers = Object.fromEntries(
    domain.editorial.skipInMainLoop.map((relationship) => [
      relationship,
      indexSymmetricEdges(editorial.edges, relationship),
    ])
  );

  const relationshipRegistry = buildRelationshipRegistry(
    structural,
    editorial,
    pairing,
    symmetric
  );

  const leafProjections = leaves
    .map((leaf) => {
      const group = groupBySlug[leaf.parent_group];
      const category = group ? categoryBySlug[group.parent_category] : null;
      const editorialContext = emptyEditorialContext(domain);
      const wineContext = emptyWineContext(domain);

      for (const edge of editorialBySource[leaf.id] ?? []) {
        if (domain.editorial.skipInMainLoop.includes(edge.relationship)) continue;
        const bucket = domain.editorial.byRelationship[edge.relationship];
        if (bucket) editorialContext[bucket].push(relationshipRef(edge));
      }

      for (const relationship of domain.editorial.skipInMainLoop) {
        const bucket = domain.editorial.byRelationship[relationship];
        for (const edge of symmetricHandlers[relationship]?.[leaf.id] ?? []) {
          if (bucket) editorialContext[bucket].push(relationshipRef(edge));
        }
      }

      for (const edge of pairingBySource[leaf.id] ?? []) {
        const bucket = domain.wine.byRelationship[edge.relationship];
        if (bucket) wineContext[bucket].push(relationshipRef(edge));
      }

      for (const bucket of Object.values(editorialContext)) {
        bucket.sort((a, b) =>
          `${a.relationship}\t${a.target}`.localeCompare(`${b.relationship}\t${b.target}`)
        );
      }
      for (const bucket of Object.values(wineContext)) {
        bucket.sort((a, b) =>
          `${a.relationship}\t${a.target}`.localeCompare(`${b.relationship}\t${b.target}`)
        );
      }

      const classification = {
        category: category ? entityRef(category, domain.categoryDisplayField) : null,
        group: group ? entityRef(group, domain.groupDisplayField) : null,
      };

      if (domain.classificationFields) {
        for (const [key, field] of Object.entries(domain.classificationFields)) {
          classification[key] = leaf[field] ?? "";
        }
      } else {
        classification.species = leaf.species ?? "";
        classification.scientific_name = leaf.scientific_name ?? "";
      }

      return {
        identity: {
          id: leaf.id,
          slug: leaf.slug,
          name: leaf[domain.leafDisplayField],
        },
        classification,
        intrinsic: intrinsicFromEntity(leaf, domain.intrinsicFields),
        structural_context: {
          parent_group: group ? entityRef(group, domain.groupDisplayField) : null,
          parent_category: category
            ? entityRef(category, domain.categoryDisplayField)
            : null,
        },
        editorial_context: editorialContext,
        wine_context: wineContext,
      };
    })
    .sort((a, b) => a.identity.id.localeCompare(b.identity.id));

  const memberIdsKey = domain.runtimeMemberIdsKey;
  const groupProjections = groups
    .map((group) => {
      const runtime = runtimeGroups.find((g) => g.slug === group.slug);
      const memberLeafIds = [...(runtime?.[memberIdsKey] ?? [])].sort();
      const memberLeaves = memberLeafIds.map((id) => leafById[id]).filter(Boolean);

      const aggregates = {};
      for (const [field, outputKey] of Object.entries(domain.groupAggregateFields)) {
        aggregates[outputKey] = [
          ...new Set(memberLeaves.map((f) => f[field]).filter(Boolean)),
        ].sort();
      }

      return {
        identity: entityRef(group, domain.groupDisplayField),
        parent_category: categoryBySlug[group.parent_category]
          ? entityRef(categoryBySlug[group.parent_category], domain.categoryDisplayField)
          : null,
        member_leaf_ids: memberLeafIds,
        member_food_ids: memberLeafIds,
        food_count: memberLeafIds.length,
        ...aggregates,
      };
    })
    .sort((a, b) => a.identity.id.localeCompare(b.identity.id));

  const groupProjectionsBySlug = Object.fromEntries(
    groupProjections.map((g) => [g.identity.slug, g])
  );

  const categoryProjections = categories
    .map((category) => {
      const runtime = runtimeCategories.find((c) => c.slug === category.slug);
      const groupRefs = (runtime?.[domain.runtimeGroupSlugsKey] ?? category.child_slugs)
        .map((slug) => groupBySlug[slug])
        .filter(Boolean)
        .map((g) => entityRef(g, domain.groupDisplayField))
        .sort((a, b) => a.id.localeCompare(b.id));

      const leafCount = groupRefs.reduce((sum, groupRef) => {
        const runtimeGroup = runtimeGroups.find((g) => g.slug === groupRef.slug);
        return sum + (runtimeGroup?.[memberIdsKey]?.length ?? 0);
      }, 0);

      return {
        identity: entityRef(category, domain.categoryDisplayField),
        groups: groupRefs,
        group_count: groupRefs.length,
        food_count: leafCount,
      };
    })
    .sort((a, b) => a.identity.id.localeCompare(b.identity.id));

  return {
    meta: {
      phase: `${domain.phasePrefix}A`,
      domain: domain.id,
      catalog_version: catalog.meta?.catalog_version ?? null,
      food_ontology_version: catalog.meta?.food_ontology_version ?? null,
    },
    leafProjections,
    groupProjections,
    categoryProjections,
    entitySets: { leafIds, groupIds, categoryIds },
    relationshipRegistry,
    index,
    groupProjectionsBySlug,
  };
}

function countRelationshipRefs(projections) {
  let count = 0;
  for (const leaf of projections) {
    for (const bucket of Object.values(leaf.editorial_context)) count += bucket.length;
    for (const bucket of Object.values(leaf.wine_context)) count += bucket.length;
  }
  return count;
}

function validateProjections(domain, generated) {
  const errors = [];
  const {
    leafProjections,
    groupProjections,
    categoryProjections,
    entitySets,
    relationshipRegistry,
  } = generated;

  if (leafProjections.length !== entitySets.leafIds.size) {
    errors.push(
      `Leaf projection count ${leafProjections.length} != catalog ${entitySets.leafIds.size}`
    );
  }
  if (groupProjections.length !== entitySets.groupIds.size) {
    errors.push("Group projection count mismatch");
  }
  if (categoryProjections.length !== entitySets.categoryIds.size) {
    errors.push("Category projection count mismatch");
  }

  const projectedLeafIds = new Set(leafProjections.map((p) => p.identity.id));
  for (const id of entitySets.leafIds) {
    if (!projectedLeafIds.has(id)) errors.push(`Orphan catalog leaf without projection: ${id}`);
  }

  const crossDomain = new Set(domain.editorial.crossDomainTargets);
  const prepPrefix = domain.editorial.preparationPrefix;

  for (const leaf of leafProjections) {
    if (!entitySets.leafIds.has(leaf.identity.id)) {
      errors.push(`Unknown leaf projection: ${leaf.identity.id}`);
    }
    if (
      leaf.structural_context.parent_group &&
      !entitySets.groupIds.has(leaf.structural_context.parent_group.id)
    ) {
      errors.push(`${leaf.identity.id}: invalid parent group reference`);
    }
    if (
      leaf.structural_context.parent_category &&
      !entitySets.categoryIds.has(leaf.structural_context.parent_category.id)
    ) {
      errors.push(`${leaf.identity.id}: invalid parent category reference`);
    }

    const allRefs = [
      ...Object.values(leaf.editorial_context).flat(),
      ...Object.values(leaf.wine_context).flat(),
    ];

    for (const ref of allRefs) {
      const key = canonicalEdgeKey(
        { source: leaf.identity.id, relationship: ref.relationship, target: ref.target },
        new Set(domain.editorial.symmetric)
      );
      if (!relationshipRegistry.has(key)) {
        errors.push(`${leaf.identity.id}: missing relationship ${key}`);
      }

      if (prepPrefix && ref.relationship === "commonly_prepared_as") {
        if (!ref.target.startsWith(prepPrefix)) {
          errors.push(`${leaf.identity.id}: invalid preparation target ${ref.target}`);
        }
      } else if (crossDomain.has(ref.relationship)) {
        continue;
      } else if (domain.editorial.intraDomainRelationships.includes(ref.relationship)) {
        if (!entitySets.leafIds.has(ref.target)) {
          errors.push(`${leaf.identity.id}: invalid leaf target ${ref.target}`);
        }
      }
    }
  }

  for (const group of groupProjections) {
    if (!entitySets.groupIds.has(group.identity.id)) {
      errors.push(`Unknown group projection: ${group.identity.id}`);
    }
    for (const leafId of group.member_leaf_ids) {
      if (!entitySets.leafIds.has(leafId)) {
        errors.push(`Group ${group.identity.slug}: invalid member ${leafId}`);
      }
    }
  }

  for (const category of categoryProjections) {
    if (!entitySets.categoryIds.has(category.identity.id)) {
      errors.push(`Unknown category projection: ${category.identity.id}`);
    }
    for (const group of category.groups) {
      if (!entitySets.groupIds.has(group.id)) {
        errors.push(`Category ${category.identity.slug}: invalid group ${group.id}`);
      }
    }
  }

  return errors;
}

function packageOutput(domain, generated) {
  const { meta, leafProjections, groupProjections, categoryProjections } = generated;
  return {
    leaf: {
      meta: {
        ...meta,
        projection_type: domain.projectionTypes.leaf,
        projection_count: leafProjections.length,
      },
      projections: leafProjections,
    },
    group: {
      meta: {
        ...meta,
        projection_type: domain.projectionTypes.group,
        projection_count: groupProjections.length,
      },
      projections: groupProjections,
    },
    category: {
      meta: {
        ...meta,
        projection_type: domain.projectionTypes.category,
        projection_count: categoryProjections.length,
      },
      projections: categoryProjections,
    },
  };
}

export function runProjectionsStage(domain) {
  const inputs = loadDomainInputs(domain);
  const generated = generateProjections(domain, inputs);
  const packaged = packageOutput(domain, generated);
  const errors = validateProjections(domain, generated);

  const determinismPass =
    serializeRuntime(packaged.leaf) ===
    serializeRuntime(packageOutput(domain, generateProjections(domain, inputs)).leaf);

  const overall = errors.length === 0 && determinismPass ? "PASS" : "FAIL";
  const referencedRelationships = countRelationshipRefs(generated.leafProjections);

  const report = {
    phase: `${domain.phasePrefix}A`,
    domain: domain.id,
    overall_result: overall,
    validation_errors: overall === "PASS" ? [] : errors,
    outputs:
      overall === "PASS"
        ? [
            domain.paths.projections.leaf,
            domain.paths.projections.group,
            domain.paths.projections.category,
          ].map((p) => p.replace(`${domain.root}/`, "").replace(/\\/g, "/"))
        : undefined,
    metrics: {
      "Leaf projections": generated.leafProjections.length,
      "Group projections": generated.groupProjections.length,
      "Category projections": generated.categoryProjections.length,
      "Referenced relationships": referencedRelationships,
      "Validation errors": errors.length,
      "Overall result": overall,
    },
  };

  if (overall === "FAIL") {
    writeJson(domain.paths.reports.generator, report);
    console.error(errors.join("\n"));
    if (!determinismPass) console.error("Determinism check failed");
    process.exit(1);
  }

  writeJson(domain.paths.projections.leaf, packaged.leaf);
  writeJson(domain.paths.projections.group, packaged.group);
  writeJson(domain.paths.projections.category, packaged.category);
  writeJson(domain.paths.reports.generator, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${domain.paths.reports.generator}`);
  return report;
}
