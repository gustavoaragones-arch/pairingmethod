/**
 * FOOD-13F — Sauce & Condiment HTML section renderers.
 * AQ-02A — Publication Completion Architecture: narrative-first educational
 * reference layout. Pure presentation over certified page and navigation
 * artifacts; all HTML generation lives in the shared helpers in
 * taxonomy-render.js — this file only supplies sauce/condiment-specific config.
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
  ["similar_sauce_condiments", "Similar sauces & condiments"],
  ["substitutions", "Substitutions"],
];

// Sauce & condiment is the one food domain with a differentiated wine-pairing
// taxonomy (classic / contrasting / regional / to-avoid) instead of a flat
// primary+alternative pair — richer material for the pairing explanation.
const WINE_PAIRING_GROUPS = [
  ["primary_wine_styles", "Primary wine styles"],
  ["classic_wine_pairings", "Classic pairings"],
  ["contrasting_wine_pairings", "Contrasting pairings"],
  ["regional_wine_pairings", "Regional pairings"],
  ["wines_to_avoid", "Wines to avoid"],
];

export function renderSauceCondimentSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const characteristics = page.characteristics ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero sauce-condiment-hero">
<p class="term-entity-label">Sauce & Condiment</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  sections.push(renderEducationalIntroduction(name, narrative));
  sections.push(renderBeginnerGuide(narrative));

  sections.push(
    renderWinePairingExplanation(
      name,
      narrative,
      WINE_PAIRING_GROUPS.map(([key, title]) => ({ title, links: sectionsNav[key] }))
    )
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
  const classificationHtml = renderOverviewRows(classificationRows, "sauce-condiment-characteristics-list");
  if (classificationHtml) {
    sections.push(`<section class="term-entity-section sauce-condiment-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${classificationHtml}
</section>`);
  }

  sections.push(
    renderCharacteristicsBlock(
      "Taxonomy",
      characteristics,
      TAXONOMY_LABELS,
      "sauce-condiment-characteristics",
      "sauce-condiment-characteristics-list"
    )
  );

  for (const [key, title] of RELATED_INGREDIENT_SECTIONS) {
    sections.push(renderMetaLinkSection(title, sectionsNav[key], "sauce-condiment-link-section"));
  }

  return sections.filter(Boolean).join("\n");
}

export function renderSauceCondimentGroupSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero sauce-condiment-group-hero">
<p class="term-entity-label">Sauce & Condiment Group</p>
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
  const overviewHtml = renderOverviewRows(overviewRows, "sauce-condiment-characteristics-list");
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section sauce-condiment-overview" aria-labelledby="scientific-classification-heading">
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
      "sauce-condiment-characteristics",
      "sauce-condiment-characteristics-list"
    )
  );

  sections.push(renderMetaLinkSection("Member sauces & condiments", sectionsNav.member_sauce_condiments, "sauce-condiment-link-section"));
  sections.push(renderMetaLinkSection("Related groups", sectionsNav.related_groups, "sauce-condiment-link-section"));

  return sections.filter(Boolean).join("\n");
}

export function renderSauceCondimentCategorySections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero sauce-condiment-category-hero">
<p class="term-entity-label">Sauce & Condiment Category</p>
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
  const overviewHtml = renderOverviewRows(overviewRows, "sauce-condiment-characteristics-list");
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section sauce-condiment-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${overviewHtml}
</section>`);
  }

  sections.push(renderMetaLinkSection("Groups", sectionsNav.groups, "sauce-condiment-link-section"));
  sections.push(renderMetaLinkSection("Related categories", sectionsNav.related_categories, "sauce-condiment-link-section"));

  return sections.filter(Boolean).join("\n");
}

export function renderSauceCondimentBreadcrumb(page) {
  return renderBreadcrumb(page.breadcrumbs ?? []);
}

export function assembleSauceCondimentEntityPage({
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
    BREADCRUMB: renderSauceCondimentBreadcrumb(page),
    BODY_SECTIONS: bodySectionsHtml,
    JSON_LD: jsonLdBlock,
    ENTITY_CLASS: entityClass,
  };
}
