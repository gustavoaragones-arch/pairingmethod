/**
 * FOOD-08F — Grain & Starch HTML section renderers.
 * AQ-02A — Publication Completion Architecture: narrative-first educational
 * reference layout. Pure presentation over certified page and navigation
 * artifacts; all HTML generation lives in the shared helpers in
 * taxonomy-render.js — this file only supplies grain/starch-specific config.
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
  usage_intensity: "Usage intensity",
  flavor_profile: "Flavor profile",
  texture_profile: "Texture profile",
  aroma_profile: "Aroma profile",
  typical_descriptors: "Typical descriptors",
  usage_intensities_represented: "Usage intensities represented",
};

const RELATED_INGREDIENT_SECTIONS = [
  ["similar_grain_starches", "Similar grains & starches"],
  ["substitutions", "Substitutions"],
];

const DESCRIPTOR_SECTIONS = [
  ["wine_descriptors", "Descriptors"],
  ["wine_techniques", "Techniques"],
];

export function renderGrainStarchSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const characteristics = page.characteristics ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero grain-starch-hero">
<p class="term-entity-label">Grain or Starch</p>
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
      { label: "Usage intensity", value: characteristics.usage_intensity?.replace(/_/g, " ") },
      { label: "Scientific name", value: overview.scientific_name },
    ])
  );

  const classificationRows = [
    ["Display name", overview.display_name],
    ["Classification", overview.category?.name],
    ["Group", overview.group?.name],
    ["Scientific name", overview.scientific_name],
  ];
  const classificationHtml = renderOverviewRows(classificationRows, "grain-starch-characteristics-list");
  if (classificationHtml) {
    sections.push(`<section class="term-entity-section grain-starch-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${classificationHtml}
</section>`);
  }

  sections.push(
    renderCharacteristicsBlock(
      "Taxonomy",
      characteristics,
      TAXONOMY_LABELS,
      "grain-starch-characteristics",
      "grain-starch-characteristics-list"
    )
  );

  for (const [key, title] of RELATED_INGREDIENT_SECTIONS) {
    sections.push(renderMetaLinkSection(title, sectionsNav[key], "grain-starch-link-section"));
  }
  for (const [key, title] of DESCRIPTOR_SECTIONS) {
    sections.push(renderMetaLinkSection(title, sectionsNav[key], "grain-starch-link-section"));
  }

  return sections.filter(Boolean).join("\n");
}

export function renderGrainStarchGroupSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero grain-starch-group-hero">
<p class="term-entity-label">Grain & Starch Group</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  sections.push(renderEducationalIntroduction(name, narrative, "About This Group"));
  sections.push(renderBeginnerGuide(narrative));
  sections.push(renderFAQ(narrative));

  sections.push(
    renderKnowledgeCards([
      { label: "Parent category", value: overview.parent_category?.name },
      { label: "Ingredient count", value: overview.food_count != null ? String(overview.food_count) : null },
    ])
  );

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Category", overview.parent_category?.name],
    ["Ingredient count", overview.food_count != null ? String(overview.food_count) : null],
  ];
  const overviewHtml = renderOverviewRows(overviewRows, "grain-starch-characteristics-list");
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section grain-starch-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${overviewHtml}
</section>`);
  }

  const groupCharacteristics = {
    usage_intensities_represented: page.usage_intensities_represented,
  };
  sections.push(
    renderCharacteristicsBlock(
      "Taxonomy",
      groupCharacteristics,
      TAXONOMY_LABELS,
      "grain-starch-characteristics",
      "grain-starch-characteristics-list"
    )
  );

  sections.push(renderMetaLinkSection("Member grains & starches", sectionsNav.member_grain_starches, "grain-starch-link-section"));
  sections.push(renderMetaLinkSection("Related groups", sectionsNav.related_groups, "grain-starch-link-section"));

  return sections.filter(Boolean).join("\n");
}

export function renderGrainStarchCategorySections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero grain-starch-category-hero">
<p class="term-entity-label">Grain & Starch Category</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  sections.push(renderEducationalIntroduction(name, narrative, "About This Category"));
  sections.push(renderBeginnerGuide(narrative));
  sections.push(renderFAQ(narrative));

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Group count", overview.group_count != null ? String(overview.group_count) : null],
    ["Ingredient count", overview.food_count != null ? String(overview.food_count) : null],
  ];
  const overviewHtml = renderOverviewRows(overviewRows, "grain-starch-characteristics-list");
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section grain-starch-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${overviewHtml}
</section>`);
  }

  sections.push(renderMetaLinkSection("Groups", sectionsNav.groups, "grain-starch-link-section"));
  sections.push(renderMetaLinkSection("Related categories", sectionsNav.related_categories, "grain-starch-link-section"));

  return sections.filter(Boolean).join("\n");
}

export function renderGrainStarchBreadcrumb(page) {
  return renderBreadcrumb(page.breadcrumbs ?? []);
}

export function assembleGrainStarchEntityPage({
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
    BREADCRUMB: renderGrainStarchBreadcrumb(page),
    BODY_SECTIONS: bodySectionsHtml,
    JSON_LD: jsonLdBlock,
    ENTITY_CLASS: entityClass,
  };
}
