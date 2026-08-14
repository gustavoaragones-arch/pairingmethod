/**
 * ONTOLOGY-03G — Protein food HTML section renderers.
 * AQ-02A — Publication Completion Architecture: narrative-first educational
 * reference layout. Pure presentation over certified page and navigation
 * artifacts; all HTML generation lives in the shared helpers in
 * taxonomy-render.js — this file only supplies protein-specific config.
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
  cut_type: "Cut type",
  anatomical_cut: "Anatomical cut",
  bone_state: "Bone state",
  plant_part: "Plant part",
  edible_structure: "Edible structure",
  processing_state: "Processing state",
  fat_content: "Fat content",
  primary_cooking_methods: "Primary cooking methods",
  recommended_doneness: "Recommended doneness",
  texture: "Texture",
  typical_descriptors: "Typical descriptors",
  processing_states_represented: "Processing states represented",
  species_represented: "Species represented",
};

const RELATED_INGREDIENT_SECTIONS = [
  ["similar_foods", "Similar foods"],
  ["substitutions", "Substitutions"],
];

const DESCRIPTOR_SECTIONS = [
  ["wine_descriptors", "Wine descriptors"],
  ["wine_techniques", "Wine techniques"],
];

export function renderProteinFoodSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const characteristics = page.characteristics ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero protein-food-hero">
<p class="term-entity-label">Protein Food</p>
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
      { title: "Culinary role", links: sectionsNav.culinary_role },
      { title: "Common preparations", links: sectionsNav.common_preparations },
    ])
  );

  sections.push(renderRegionalContext(narrative));
  sections.push(renderFAQ(narrative));

  sections.push(
    renderKnowledgeCards([
      { label: "Group", value: overview.group?.name },
      { label: "Classification", value: overview.category?.name },
      { label: "Species", value: overview.species },
      { label: "Scientific name", value: overview.scientific_name },
    ])
  );

  const classificationRows = [
    ["Display name", overview.display_name],
    ["Classification", overview.category?.name],
    ["Group", overview.group?.name],
    ["Scientific name", overview.scientific_name],
    ["Species", overview.species],
  ];
  const classificationHtml = renderOverviewRows(classificationRows, "protein-characteristics-list");
  if (classificationHtml) {
    sections.push(`<section class="term-entity-section protein-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${classificationHtml}
</section>`);
  }

  sections.push(
    renderCharacteristicsBlock(
      "Taxonomy",
      characteristics,
      TAXONOMY_LABELS,
      "protein-characteristics",
      "protein-characteristics-list"
    )
  );

  for (const [key, title] of RELATED_INGREDIENT_SECTIONS) {
    sections.push(renderMetaLinkSection(title, sectionsNav[key], "protein-link-section"));
  }
  for (const [key, title] of DESCRIPTOR_SECTIONS) {
    sections.push(renderMetaLinkSection(title, sectionsNav[key], "protein-link-section"));
  }

  return sections.filter(Boolean).join("\n");
}

export function renderProteinGroupSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero protein-group-hero">
<p class="term-entity-label">Protein Group</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  sections.push(renderEducationalIntroduction(name, narrative, "About This Group"));
  sections.push(renderBeginnerGuide(narrative));
  sections.push(renderFAQ(narrative));

  sections.push(
    renderKnowledgeCards([
      { label: "Parent category", value: overview.parent_category?.name },
      { label: "Food count", value: overview.food_count != null ? String(overview.food_count) : null },
    ])
  );

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Category", overview.parent_category?.name],
    ["Food count", overview.food_count != null ? String(overview.food_count) : null],
  ];
  const overviewHtml = renderOverviewRows(overviewRows, "protein-characteristics-list");
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section protein-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${overviewHtml}
</section>`);
  }

  const groupCharacteristics = {
    processing_states_represented: page.processing_states_represented,
    species_represented: page.species_represented,
  };
  sections.push(
    renderCharacteristicsBlock(
      "Taxonomy",
      groupCharacteristics,
      TAXONOMY_LABELS,
      "protein-characteristics",
      "protein-characteristics-list"
    )
  );

  sections.push(renderMetaLinkSection("Member foods", sectionsNav.member_foods, "protein-link-section"));
  sections.push(renderMetaLinkSection("Related groups", sectionsNav.related_groups, "protein-link-section"));

  return sections.filter(Boolean).join("\n");
}

export function renderProteinCategorySections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const narrative = page.narrative ?? {};
  const sectionsNav = linkSet?.sections ?? {};
  const name = overview.display_name ?? page.identity.title;

  sections.push(`<header class="term-entity-hero protein-category-hero">
<p class="term-entity-label">Protein Category</p>
<h1>${escapeHtml(name)}</h1>
</header>`);

  sections.push(renderEducationalIntroduction(name, narrative, "About This Category"));
  sections.push(renderBeginnerGuide(narrative));
  sections.push(renderFAQ(narrative));

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Group count", overview.group_count != null ? String(overview.group_count) : null],
    ["Food count", overview.food_count != null ? String(overview.food_count) : null],
  ];
  const overviewHtml = renderOverviewRows(overviewRows, "protein-characteristics-list");
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section protein-overview" aria-labelledby="scientific-classification-heading">
<h2 id="scientific-classification-heading">Scientific Classification</h2>
${overviewHtml}
</section>`);
  }

  sections.push(renderMetaLinkSection("Groups", sectionsNav.groups, "protein-link-section"));
  sections.push(renderMetaLinkSection("Related categories", sectionsNav.related_categories, "protein-link-section"));

  return sections.filter(Boolean).join("\n");
}

export function renderProteinBreadcrumb(page) {
  return renderBreadcrumb(page.breadcrumbs ?? []);
}

export function assembleProteinEntityPage({
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
    BREADCRUMB: renderProteinBreadcrumb(page),
    BODY_SECTIONS: bodySectionsHtml,
    JSON_LD: jsonLdBlock,
    ENTITY_CLASS: entityClass,
  };
}
