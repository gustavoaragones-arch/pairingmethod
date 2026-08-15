/**
 * AQ-04A — Schema Inventory.
 *
 * Read-only enumeration of every JSON-LD block the food-ontology publication
 * layer emits: type, properties actually present, the catalog/projection
 * field each property originates from, and coverage across the 11-domain
 * suite. No file is modified.
 *
 * Scope: the food-ontology publication surfaces only (lib/food-publication/*,
 * lib/protein-food-schema.js, the 11 taxonomy-<domain>-render.js files) —
 * the same domain boundary AQ-02B and AQ-03 held to. The wine-education tier
 * (faults/, techniques/, styles/, regions/, serving/, terms/, grapes/) and
 * hand-authored static pages (about.html, disclaimer.html, dish/seasonal
 * guide pages) run an entirely separate, older schema-authoring path and are
 * explicitly out of scope — noted here, not audited.
 */

import { getDomainConfig, listDomainIds } from "../food-domain-config.js";
import { readJson } from "../food-publication/utils.js";

// Static, code-verified origin map: for each schema.org property this layer
// emits, which projection/catalog field feeds it, as of this inventory pass
// (before any AQ-04B corrections). Read directly from
// lib/protein-food-schema.js and lib/food-publication/schema.js — not
// inferred from output.
const PROPERTY_ORIGINS = {
  WebPage: {
    "@id": "derived: `${canonical_url}#webpage`",
    url: "page.metadata.canonical (derived from catalog identity.slug + domain URL pattern)",
    name: "page.metadata.title (template: `${identity.name} — ${domain.leafTitleSuffix}`)",
    description:
      "page.metadata.description — a generic template built from name/group/category (see findings: FIND-02)",
    breadcrumb: "reference to the page's own BreadcrumbList @id",
    isPartOf: "static WebSite stub (name: \"Pairing Method\", url: site root)",
    about: "array — see about[] sub-entries below",
  },
  "WebPage.about[].DefinedTermSet": {
    "@id": "derived: `${category_or_group_url}#definedtermset`",
    name: "page.overview.category.name / page.overview.group.name (catalog display_name)",
    identifier: "page.overview.category.id / page.overview.group.id (catalog canonical id)",
  },
  "WebPage.about[].Taxon": {
    "@id": "derived: `${canonical_url}#taxon`",
    name: "page.overview.scientific_name (catalog scientific_name field)",
    condition:
      "emitted domain-agnostically whenever scientific_name is present, including for cheese, where scientific_name denotes milk source, not cheese identity (see findings: FIND-01)",
  },
  "WebPage.about[].PropertyValue(species)": {
    name: "literal string \"species\"",
    value: "page.overview.species (catalog species field — informal/common name, protein domain only, 148/210 entities)",
  },
  BreadcrumbList: {
    "@id": "derived: `${canonical_url}#breadcrumb`",
    itemListElement: "page.breadcrumbs (built from projection.classification.category/group + identity, each entry's item is an absolute URL)",
  },
  DefinedTerm: {
    "@id": "derived: `${canonical_url}#definedterm`",
    identifier: "page.identity.id (catalog canonical id)",
    name: "page.identity.title (catalog display_name)",
    alternateName: "page.identity.slug (catalog slug)",
    description: "page.metadata.description — same generic template as WebPage.description (FIND-02)",
    url: "page.metadata.canonical",
    inDefinedTermSet: "static per-domain ontology stub (domain.metadata.ontologyName)",
    isPartOf: "page.overview.group (catalog canonical id/name of parent group), when present",
  },
  Taxon: {
    "@id": "derived: `${canonical_url}#taxon`",
    name: "page.overview.scientific_name (catalog scientific_name field)",
    url: "page.metadata.canonical",
    taxonRank: "literal \"species\", emitted only when page.overview.species is present (protein domain)",
    alternateName: "page.overview.species, when present (protein domain)",
    condition:
      "standalone top-level block (buildFoodTaxonSchema) — same domain-agnostic gating issue as the inline about[] Taxon (FIND-01)",
  },
  CollectionPage: {
    "@id": "derived: `${canonical_url}#collectionpage`",
    url: "page.metadata.canonical",
    name: "page.metadata.title",
    description: "page.metadata.description — same generic template as WebPage.description (FIND-02)",
    breadcrumb: "reference to the page's own BreadcrumbList @id",
    isPartOf: "static WebSite stub",
    about: "page.overview.parent_category (group pages only) — DefinedTermSet reference",
  },
  DefinedTermSet: {
    "@id": "derived: `${canonical_url}#definedtermset`",
    identifier: "page.identity.id (catalog canonical id)",
    name: "page.identity.title (catalog display_name)",
    alternateName: "page.identity.slug",
    description: "page.metadata.description — same generic template as WebPage.description (FIND-02)",
    url: "page.metadata.canonical",
    numberOfTerms: "page.overview.food_count (computed from live member census, not a catalog literal)",
    inDefinedTermSet: "static per-domain ontology stub",
    hasPart: "page.member_foods / page.groups — each entry's identifier/name traces to the referenced entity's own catalog id/display_name",
  },
  "Hub.CollectionPage": {
    "@id": "domain hub canonical URL",
    name: "domain.entityLabels.leafPlural (static per-domain config, not per-entity)",
    isPartOf: "static WebSite stub",
  },
  "Hub.ItemList": {
    itemListElement: "one ListItem per published group in the domain (name/item from group projection)",
  },
  IngredientsDirectory: {
    "@type": "CollectionPage + BreadcrumbList + ItemList, same pattern as domain hubs",
    itemListElement: "one ListItem per published domain (name/item from food-domain-config.js entityLabels + hub URL)",
  },
};

const FINDINGS = [
  {
    id: "FIND-01",
    severity: "high",
    title: "Taxon type misapplied to cheese pages",
    detail:
      "Both the inline WebPage.about[] Taxon entry and the standalone top-level Taxon block are emitted whenever page.overview.scientific_name is present, with no domain awareness. For 10 domains scientific_name is the entity's own taxonomic identity, so Taxon is accurate. For cheese, docs/CHEESE_GOVERNANCE.md §5 documents scientific_name as milk-source species only — emitting `{\"@type\": \"Taxon\", \"name\": \"Bos taurus\", \"url\": \".../cheeses/abondance/\"}` asserts the URL's subject IS the species Bos taurus, contradicting the same page's own DefinedTerm identity (food.cheese.natural-rind.abondance, name: Abondance). Affects all 204 cheese leaf pages (408 Taxon-typed blocks: 1 inline + 1 standalone each).",
    recommendation:
      "Per Rule 4 (omit rather than misrepresent) and Rule 2 (never overload vocabulary), Taxon should not be emitted for cheese. The underlying fact (milk-source species) is real and worth exposing — as a PropertyValue, not a Taxon assertion about the page's own subject.",
  },
  {
    id: "FIND-02",
    severity: "medium",
    title: "description property ignores 100%-coverage authored seo_description field",
    detail:
      "page.metadata.description (used verbatim for WebPage.description, DefinedTerm.description, CollectionPage.description, DefinedTermSet.description, and og:description) is a generic template (`${name} (${group}) — ${category} ${domain} cheese`-shape string), even though every one of the 1,166 leaf entities, 73 groups, and 13 categories across all 11 domains has a fully-authored seo_description field (100% coverage, verified against every domain catalog) that AQ-02A's own narrative pipeline (lib/food-publication/narrative.js) already extracts into projection.narrative.seo_description but which lib/food-publication/pages.js's leafMetadata/groupMetadata/categoryMetadata never reads. This is also the field AQ-01R's Priority 3/4 finding ('seo_description still isn't wired into the <meta> description tag') refers to — the same gap affects both the HTML <meta> tag and every JSON-LD description property, since both draw from the same page.metadata.description value.",
    recommendation:
      "Use narrative.seo_description as the description/og_description source, with the existing template retained only as a fallback for the (currently zero, but theoretically possible for a future domain) case where seo_description is absent.",
  },
];

function loadDomainSchema(domainId) {
  const domain = getDomainConfig(domainId);
  return {
    domain,
    leaf: readJson(domain.paths.schema.leaf),
    group: readJson(domain.paths.schema.group),
    category: readJson(domain.paths.schema.category),
  };
}

function tallyTypes(schemas, tally) {
  for (const entry of schemas) {
    for (const block of entry.json_ld) {
      const type = block["@type"];
      tally[type] = (tally[type] ?? 0) + 1;
      if (Array.isArray(block.about)) {
        for (const item of block.about) {
          const subtype = `${type}.about[].${item["@type"]}`;
          tally[subtype] = (tally[subtype] ?? 0) + 1;
        }
      }
    }
  }
}

export function buildSchemaInventory(root) {
  const domainIds = listDomainIds();
  const perDomain = {};
  const overallTally = {};
  let totalLeaf = 0;
  let totalGroup = 0;
  let totalCategory = 0;
  let totalObjects = 0;

  for (const domainId of domainIds) {
    const { leaf, group, category } = loadDomainSchema(domainId);
    const tally = {};
    tallyTypes(leaf.schemas, tally);
    tallyTypes(group.schemas, tally);
    tallyTypes(category.schemas, tally);

    for (const [type, count] of Object.entries(tally)) {
      overallTally[type] = (overallTally[type] ?? 0) + count;
    }

    const objectCount =
      [...leaf.schemas, ...group.schemas, ...category.schemas].reduce(
        (sum, e) => sum + e.json_ld.length,
        0
      );

    perDomain[domainId] = {
      leaf_pages: leaf.schemas.length,
      group_pages: group.schemas.length,
      category_pages: category.schemas.length,
      json_ld_objects: objectCount,
      type_tally: tally,
    };

    totalLeaf += leaf.schemas.length;
    totalGroup += group.schemas.length;
    totalCategory += category.schemas.length;
    totalObjects += objectCount;
  }

  return {
    phase: "AQ-04A",
    title: "Schema Inventory",
    scope: {
      included:
        "Food-ontology publication layer only: 11 domains' leaf/group/category pages (lib/food-publication/schema.js + lib/protein-food-schema.js), domain hub pages (lib/food-publication/hub.js), and the /ingredients/ directory (lib/food-publication/ingredients-directory.js).",
      excluded:
        "Wine-education tier (faults/techniques/styles/regions/serving/terms/grapes, ~2,700+ JSON-LD blocks across a separate, older schema-authoring path) and hand-authored static pages (about.html, disclaimer.html, dish/seasonal guide pages). Same domain boundary AQ-02B and AQ-03 held to; not audited here, noted for completeness.",
    },
    totals: {
      domains: domainIds.length,
      leaf_pages: totalLeaf,
      group_pages: totalGroup,
      category_pages: totalCategory,
      hub_pages: domainIds.filter((id) => getDomainConfig(id).published).length,
      ingredients_directory_pages: 1,
      json_ld_objects_leaf_group_category: totalObjects,
    },
    schema_type_tally: overallTally,
    per_domain: perDomain,
    property_origins: PROPERTY_ORIGINS,
    findings: FINDINGS,
  };
}
