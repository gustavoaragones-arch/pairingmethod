/**
 * FOOD-09F — Fruit HTML section renderers.
 * AQ-02A — Publication Completion Architecture: narrative-first educational
 * reference layout. Pure presentation over certified page and navigation
 * artifacts; all HTML generation lives in the shared helpers in
 * taxonomy-render.js — this file only supplies fruit-specific labels/config.
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
import { renderWhyTheseWinesWork } from "./food-tail-wine-pairing-explanation.js";

// Scientific Classification (identity) vs. Taxonomy (remaining intrinsic detail) —
// both metadata-tier blocks, rendered below the narrative per AQ-02A Rule 3.
const CLASSIFICATION_LABELS = {
  culinary_group: "Culinary group",
  scientific_name: "Scientific name",
};

const TAXONOMY_LABELS = {
  usage_intensity: "Usage intensity",
  flavor_profile: "Flavor profile",
  texture_profile: "Texture profile",
  aroma_profile: "Aroma profile",
  typical_descriptors: "Typical descriptors",
  usage_intensities_represented: "Usage intensities represented",
};

const RELATED_INGREDIENT_SECTIONS = [
  ["similar_fruits", "Similar fruits"],
  ["substitutions", "Substitutions"],
];

const DESCRIPTOR_SECTIONS = [
  ["wine_descriptors", "Descriptors"],
  ["wine_techniques", "Techniques"],
];

export function renderFruitSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const characteristics = page.characteristics ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  // Hero
  sections.push(`<header class="term-entity-hero fruit-hero">
<p class="term-entity-label">Fruit</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  // Narrative tier — teach before reference (Rule 1)
  sections.push(renderEducationalIntroduction(name, narrative));
  sections.push(renderBeginnerGuide(narrative));

  sections.push(
    renderWinePairingExplanation(name, narrative, [
      { title: "Primary wine styles", links: sectionsNav.primary_wine_styles },
      { title: "Alternative wine styles", links: sectionsNav.alternative_wine_styles },
    ])
  );

  sections.push(renderWhyTheseWinesWork("fruit", page.identity?.id, name, linkSet));

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

  // Metadata tier — reference data, below the narrative (Rule 3)
  const classificationRows = [
    ["Display name", overview.display_name],
    ["Classification", overview.category?.name],
    ["Group", overview.group?.name],
    ["Scientific name", overview.scientific_name],
  ];
  const classificationHtml = renderOverviewRows(classificationRows, "fruit-characteristics-list");
  if (classificationHtml) {
    sections.push(`<section class="term-entity-section fruit-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${classificationHtml}
</section>`);
  }

  sections.push(
    renderCharacteristicsBlock(
      "Taxonomy",
      characteristics,
      TAXONOMY_LABELS,
      "fruit-characteristics",
      "fruit-characteristics-list"
    )
  );

  for (const [key, title] of RELATED_INGREDIENT_SECTIONS) {
    sections.push(renderMetaLinkSection(title, sectionsNav[key], "fruit-link-section"));
  }
  for (const [key, title] of DESCRIPTOR_SECTIONS) {
    sections.push(renderMetaLinkSection(title, sectionsNav[key], "fruit-link-section"));
  }

  return sections.filter(Boolean).join("\n");
}

export function renderFruitGroupSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero fruit-group-hero">
<p class="term-entity-label">Fruit Group</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  sections.push(renderEducationalIntroduction(name, narrative, "About This Group"));
  sections.push(renderBeginnerGuide(narrative));
  sections.push(renderFAQ(narrative));

  const groupCharacteristics = {
    usage_intensities_represented: page.usage_intensities_represented,
  };
  sections.push(
    renderKnowledgeCards([
      { label: "Parent category", value: overview.parent_category?.name },
      { label: "Fruit count", value: overview.food_count != null ? String(overview.food_count) : null },
    ])
  );

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Category", overview.parent_category?.name],
    ["Fruit count", overview.food_count != null ? String(overview.food_count) : null],
  ];
  const overviewHtml = renderOverviewRows(overviewRows, "fruit-characteristics-list");
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section fruit-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${overviewHtml}
</section>`);
  }
  sections.push(
    renderCharacteristicsBlock(
      "Taxonomy",
      groupCharacteristics,
      TAXONOMY_LABELS,
      "fruit-characteristics",
      "fruit-characteristics-list"
    )
  );

  sections.push(renderMetaLinkSection("Member fruits", sectionsNav.member_fruits, "fruit-link-section"));
  sections.push(renderMetaLinkSection("Related groups", sectionsNav.related_groups, "fruit-link-section"));

  return sections.filter(Boolean).join("\n");
}

export function renderFruitCategorySections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero fruit-category-hero">
<p class="term-entity-label">Fruit Category</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  sections.push(renderEducationalIntroduction(name, narrative, "About This Category"));
  sections.push(renderBeginnerGuide(narrative));
  sections.push(renderFAQ(narrative));

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Group count", overview.group_count != null ? String(overview.group_count) : null],
    ["Fruit count", overview.food_count != null ? String(overview.food_count) : null],
  ];
  const overviewHtml = renderOverviewRows(overviewRows, "fruit-characteristics-list");
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section fruit-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${overviewHtml}
</section>`);
  }

  sections.push(renderMetaLinkSection("Groups", sectionsNav.groups, "fruit-link-section"));
  sections.push(renderMetaLinkSection("Related categories", sectionsNav.related_categories, "fruit-link-section"));

  return sections.filter(Boolean).join("\n");
}

export function renderFruitBreadcrumb(page) {
  return renderBreadcrumb(page.breadcrumbs ?? []);
}

export function assembleFruitEntityPage({
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
    BREADCRUMB: renderFruitBreadcrumb(page),
    BODY_SECTIONS: bodySectionsHtml,
    JSON_LD: jsonLdBlock,
    ENTITY_CLASS: entityClass,
  };
}
