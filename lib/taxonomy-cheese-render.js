/**
 * FOOD-04F — Cheese HTML section renderers.
 * AQ-02A — Publication Completion Architecture: narrative-first educational
 * reference layout. Pure presentation over certified page and navigation
 * artifacts; all HTML generation lives in the shared helpers in
 * taxonomy-render.js — this file only supplies cheese-specific config.
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
  cheese_category: "Cheese category",
  aging_class: "Aging class",
  texture: "Texture",
  moisture_class: "Moisture class",
  rind_type: "Rind type",
  pasteurization: "Pasteurization",
  origin_country: "Origin country",
  protected_status: "Protected status",
  typical_descriptors: "Typical descriptors",
  milk_sources_represented: "Milk sources represented",
  aging_classes_represented: "Aging classes represented",
};

const RELATED_INGREDIENT_SECTIONS = [
  ["similar_cheeses", "Similar cheeses"],
  ["substitutions", "Substitutions"],
  ["same_family", "Same family"],
];

const DESCRIPTOR_SECTIONS = [
  ["wine_descriptors", "Wine descriptors"],
  ["wine_techniques", "Wine techniques"],
];

export function renderCheeseSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const characteristics = page.characteristics ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero cheese-hero">
<p class="term-entity-label">Cheese</p>
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
      { label: "Milk source", value: overview.milk_source },
    ])
  );

  const classificationRows = [
    ["Display name", overview.display_name],
    ["Classification", overview.category?.name],
    ["Group", overview.group?.name],
    ["Milk source", overview.milk_source],
  ];
  const classificationHtml = renderOverviewRows(classificationRows, "cheese-characteristics-list");
  if (classificationHtml) {
    sections.push(`<section class="term-entity-section cheese-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${classificationHtml}
</section>`);
  }

  sections.push(
    renderCharacteristicsBlock(
      "Taxonomy",
      characteristics,
      TAXONOMY_LABELS,
      "cheese-characteristics",
      "cheese-characteristics-list"
    )
  );

  for (const [key, title] of RELATED_INGREDIENT_SECTIONS) {
    sections.push(renderMetaLinkSection(title, sectionsNav[key], "cheese-link-section"));
  }
  for (const [key, title] of DESCRIPTOR_SECTIONS) {
    sections.push(renderMetaLinkSection(title, sectionsNav[key], "cheese-link-section"));
  }

  return sections.filter(Boolean).join("\n");
}

export function renderCheeseGroupSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero cheese-group-hero">
<p class="term-entity-label">Cheese Group</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  sections.push(renderEducationalIntroduction(name, narrative, "About This Group"));
  sections.push(renderBeginnerGuide(narrative));
  sections.push(renderFAQ(narrative));

  sections.push(
    renderKnowledgeCards([
      { label: "Parent category", value: overview.parent_category?.name },
      { label: "Cheese count", value: overview.food_count != null ? String(overview.food_count) : null },
    ])
  );

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Category", overview.parent_category?.name],
    ["Cheese count", overview.food_count != null ? String(overview.food_count) : null],
  ];
  const overviewHtml = renderOverviewRows(overviewRows, "cheese-characteristics-list");
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section cheese-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${overviewHtml}
</section>`);
  }

  const groupCharacteristics = {
    milk_sources_represented: page.milk_sources_represented,
    aging_classes_represented: page.aging_classes_represented,
  };
  sections.push(
    renderCharacteristicsBlock(
      "Taxonomy",
      groupCharacteristics,
      TAXONOMY_LABELS,
      "cheese-characteristics",
      "cheese-characteristics-list"
    )
  );

  sections.push(renderMetaLinkSection("Member cheeses", sectionsNav.member_cheeses, "cheese-link-section"));
  sections.push(renderMetaLinkSection("Related groups", sectionsNav.related_groups, "cheese-link-section"));

  return sections.filter(Boolean).join("\n");
}

export function renderCheeseCategorySections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero cheese-category-hero">
<p class="term-entity-label">Cheese Category</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  sections.push(renderEducationalIntroduction(name, narrative, "About This Category"));
  sections.push(renderBeginnerGuide(narrative));
  sections.push(renderFAQ(narrative));

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Group count", overview.group_count != null ? String(overview.group_count) : null],
    ["Cheese count", overview.food_count != null ? String(overview.food_count) : null],
  ];
  const overviewHtml = renderOverviewRows(overviewRows, "cheese-characteristics-list");
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section cheese-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${overviewHtml}
</section>`);
  }

  sections.push(renderMetaLinkSection("Groups", sectionsNav.groups, "cheese-link-section"));
  sections.push(renderMetaLinkSection("Related categories", sectionsNav.related_categories, "cheese-link-section"));

  return sections.filter(Boolean).join("\n");
}

export function renderCheeseBreadcrumb(page) {
  return renderBreadcrumb(page.breadcrumbs ?? []);
}

export function assembleCheeseEntityPage({
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
    BREADCRUMB: renderCheeseBreadcrumb(page),
    BODY_SECTIONS: bodySectionsHtml,
    JSON_LD: jsonLdBlock,
    ENTITY_CLASS: entityClass,
  };
}
