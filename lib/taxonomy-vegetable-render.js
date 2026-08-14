/**
 * FOOD-05F — Vegetable HTML section renderers.
 * AQ-02A — Publication Completion Architecture: narrative-first educational
 * reference layout. Pure presentation over certified page and navigation
 * artifacts; all HTML generation lives in the shared helpers in
 * taxonomy-render.js — this file only supplies vegetable-specific config.
 */

import {
  escapeHtml,
  renderBreadcrumb,
  renderCharacteristicsBlock,
  renderEducationalIntroduction,
  renderKnowledgeCards,
  renderMetaLinkSection,
  renderOverviewRows,
  renderWinePairingExplanation,
  renderCommonCulinaryUses,
  renderRegionalContext,
  renderBeginnerGuide,
  renderFAQ,
} from "./taxonomy-render.js";

const TAXONOMY_LABELS = {
  culinary_role: "Culinary role",
  plant_part: "Plant part",
  texture: "Texture",
  moisture_class: "Moisture class",
  flavor_intensity: "Flavor intensity",
  seasonality: "Seasonality",
  flavor_profile: "Flavor profile",
  typical_descriptors: "Typical descriptors",
  culinary_roles_represented: "Culinary roles represented",
  plant_parts_represented: "Plant parts represented",
};

const RELATED_INGREDIENT_SECTIONS = [
  ["similar_vegetables", "Similar vegetables"],
  ["substitutions", "Substitutions"],
];

const DESCRIPTOR_SECTIONS = [
  ["wine_descriptors", "Descriptors"],
  ["wine_techniques", "Techniques"],
];

export function renderVegetableSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const characteristics = page.characteristics ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero vegetable-hero">
<p class="term-entity-label">Vegetable</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  sections.push(renderEducationalIntroduction(name, narrative));
  sections.push(renderBeginnerGuide(narrative));

  sections.push(
    renderWinePairingExplanation(name, narrative, [
      { title: "Primary wine styles", links: sectionsNav.primary_wine_styles },
      { title: "Alternative wine styles", links: sectionsNav.alternative_wine_styles },
    ])
  );

  sections.push(
    renderCommonCulinaryUses(narrative, [
      { title: "Commonly served with", links: sectionsNav.commonly_served_with },
    ])
  );

  sections.push(renderRegionalContext(narrative));
  sections.push(renderFAQ(narrative));

  sections.push(
    renderKnowledgeCards([
      { label: "Group", value: overview.group?.name },
      { label: "Classification", value: overview.category?.name },
      { label: "Culinary role", value: formatValue(characteristics.culinary_role) },
      { label: "Scientific name", value: overview.scientific_name },
    ])
  );

  const classificationRows = [
    ["Display name", overview.display_name],
    ["Classification", overview.category?.name],
    ["Group", overview.group?.name],
    ["Scientific name", overview.scientific_name],
  ];
  const classificationHtml = renderOverviewRows(classificationRows, "vegetable-characteristics-list");
  if (classificationHtml) {
    sections.push(`<section class="term-entity-section vegetable-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${classificationHtml}
</section>`);
  }

  sections.push(
    renderCharacteristicsBlock(
      "Taxonomy",
      characteristics,
      TAXONOMY_LABELS,
      "vegetable-characteristics",
      "vegetable-characteristics-list"
    )
  );

  for (const [key, title] of RELATED_INGREDIENT_SECTIONS) {
    sections.push(renderMetaLinkSection(title, sectionsNav[key], "vegetable-link-section"));
  }
  for (const [key, title] of DESCRIPTOR_SECTIONS) {
    sections.push(renderMetaLinkSection(title, sectionsNav[key], "vegetable-link-section"));
  }

  return sections.filter(Boolean).join("\n");
}

function formatValue(value) {
  if (value === undefined || value === null || value === "") return null;
  return String(value).replace(/-/g, " ").replace(/_/g, " ");
}

export function renderVegetableGroupSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero vegetable-group-hero">
<p class="term-entity-label">Vegetable Group</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  sections.push(renderEducationalIntroduction(name, narrative, "About This Group"));
  sections.push(renderBeginnerGuide(narrative));
  sections.push(renderFAQ(narrative));

  sections.push(
    renderKnowledgeCards([
      { label: "Parent category", value: overview.parent_category?.name },
      { label: "Vegetable count", value: overview.food_count != null ? String(overview.food_count) : null },
    ])
  );

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Category", overview.parent_category?.name],
    ["Vegetable count", overview.food_count != null ? String(overview.food_count) : null],
  ];
  const overviewHtml = renderOverviewRows(overviewRows, "vegetable-characteristics-list");
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section vegetable-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${overviewHtml}
</section>`);
  }

  const groupCharacteristics = {
    culinary_roles_represented: page.culinary_roles_represented,
    plant_parts_represented: page.plant_parts_represented,
  };
  sections.push(
    renderCharacteristicsBlock(
      "Taxonomy",
      groupCharacteristics,
      TAXONOMY_LABELS,
      "vegetable-characteristics",
      "vegetable-characteristics-list"
    )
  );

  sections.push(renderMetaLinkSection("Member vegetables", sectionsNav.member_vegetables, "vegetable-link-section"));
  sections.push(renderMetaLinkSection("Related groups", sectionsNav.related_groups, "vegetable-link-section"));

  return sections.filter(Boolean).join("\n");
}

export function renderVegetableCategorySections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero vegetable-category-hero">
<p class="term-entity-label">Vegetable Category</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  sections.push(renderEducationalIntroduction(name, narrative, "About This Category"));
  sections.push(renderBeginnerGuide(narrative));
  sections.push(renderFAQ(narrative));

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Group count", overview.group_count != null ? String(overview.group_count) : null],
    ["Vegetable count", overview.food_count != null ? String(overview.food_count) : null],
  ];
  const overviewHtml = renderOverviewRows(overviewRows, "vegetable-characteristics-list");
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section vegetable-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${overviewHtml}
</section>`);
  }

  sections.push(renderMetaLinkSection("Groups", sectionsNav.groups, "vegetable-link-section"));
  sections.push(renderMetaLinkSection("Related categories", sectionsNav.related_categories, "vegetable-link-section"));

  return sections.filter(Boolean).join("\n");
}

export function renderVegetableBreadcrumb(page) {
  return renderBreadcrumb(page.breadcrumbs ?? []);
}

export function assembleVegetableEntityPage({
  template,
  page,
  bodySectionsHtml,
  jsonLd,
  entityClass,
}) {
  const jsonLdBlock = jsonLd
    .map(
      (obj) =>
        `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`
    )
    .join("\n  ");

  return {
    PAGE_TITLE: escapeHtml(page.metadata.title),
    META_DESCRIPTION: escapeHtml(page.metadata.description),
    CANONICAL_URL: page.metadata.canonical,
    OG_URL: page.metadata.canonical,
    OG_TITLE: escapeHtml(page.metadata.og_title),
    BREADCRUMB: renderVegetableBreadcrumb(page),
    BODY_SECTIONS: bodySectionsHtml,
    JSON_LD: jsonLdBlock,
    ENTITY_CLASS: entityClass,
  };
}
