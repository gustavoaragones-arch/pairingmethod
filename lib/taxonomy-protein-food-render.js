/**
 * ONTOLOGY-03G — Protein food HTML section renderers.
 * Pure presentation over certified page and navigation artifacts.
 */

import { escapeHtml, renderBreadcrumb } from "./taxonomy-render.js";

const CHARACTERISTIC_LABELS = {
  food_category: "Food category",
  species: "Species",
  scientific_name: "Scientific name",
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

function slugifyHeading(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatCharacteristicValue(value) {
  if (Array.isArray(value)) {
    if (!value.length) return null;
    return value.map((item) => String(item).replace(/-/g, " ")).join(", ");
  }
  if (value === undefined || value === null || value === "") return null;
  return String(value).replace(/-/g, " ");
}

function renderDefinitionList(entries) {
  if (!entries.length) return "";
  const rows = entries
    .map(
      ([label, value]) =>
        `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`
    )
    .join("");
  return `<dl class="protein-characteristics-list">${rows}</dl>`;
}

function renderCharacteristicsBlock(title, characteristics) {
  const entries = [];
  for (const [key, label] of Object.entries(CHARACTERISTIC_LABELS)) {
    if (!(key in characteristics)) continue;
    const formatted = formatCharacteristicValue(characteristics[key]);
    if (formatted) entries.push([label, formatted]);
  }

  if (!entries.length) return "";

  const headingId = `${slugifyHeading(title)}-heading`;
  return `<section class="term-entity-section protein-characteristics" aria-labelledby="${headingId}">
<h2 id="${headingId}">${escapeHtml(title)}</h2>
${renderDefinitionList(entries)}
</section>`;
}

function renderNavLinkItem(link) {
  if (link.href?.startsWith("/")) {
    return `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.title)}</a></li>`;
  }
  return `<li>${escapeHtml(link.title)}</li>`;
}

export function renderLinkSection(title, links) {
  if (!links?.length) return "";
  const headingId = `${slugifyHeading(title)}-heading`;
  return `<section class="term-entity-section protein-link-section" aria-labelledby="${headingId}">
<h2 id="${headingId}">${escapeHtml(title)}</h2>
<ul class="term-entity-link-list">${links.map(renderNavLinkItem).join("")}</ul>
</section>`;
}

function renderOverviewRows(rows) {
  const entries = rows.filter(([, value]) => value);
  if (!entries.length) return "";
  return renderDefinitionList(entries);
}

export function renderProteinFoodSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const sectionsNav = linkSet?.sections ?? {};

  sections.push(`<header class="term-entity-hero protein-food-hero">
<p class="term-entity-label">Protein Food</p>
<h1>${escapeHtml(overview.display_name ?? page.identity.title)}</h1>
</header>`);

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Classification", overview.category?.name],
    ["Group", overview.group?.name],
    ["Scientific name", overview.scientific_name],
    ["Species", overview.species],
  ];

  const overviewHtml = renderOverviewRows(overviewRows);
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section protein-overview" aria-labelledby="overview-heading">
<h2 id="overview-heading">Overview</h2>
${overviewHtml}
</section>`);
  }

  sections.push(renderCharacteristicsBlock("Characteristics", page.characteristics ?? {}));

  sections.push(renderLinkSection("Similar foods", sectionsNav.similar_foods));
  sections.push(renderLinkSection("Substitutions", sectionsNav.substitutions));
  sections.push(renderLinkSection("Culinary role", sectionsNav.culinary_role));
  sections.push(renderLinkSection("Common preparations", sectionsNav.common_preparations));

  sections.push(renderLinkSection("Primary wine styles", sectionsNav.primary_wine_styles));
  sections.push(renderLinkSection("Alternative wine styles", sectionsNav.alternative_wine_styles));
  sections.push(renderLinkSection("Wine descriptors", sectionsNav.wine_descriptors));
  sections.push(renderLinkSection("Wine techniques", sectionsNav.wine_techniques));

  return sections.filter(Boolean).join("\n");
}

export function renderProteinGroupSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const sectionsNav = linkSet?.sections ?? {};

  sections.push(`<header class="term-entity-hero protein-group-hero">
<p class="term-entity-label">Protein Group</p>
<h1>${escapeHtml(overview.display_name ?? page.identity.title)}</h1>
</header>`);

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Category", overview.parent_category?.name],
    ["Food count", overview.food_count != null ? String(overview.food_count) : null],
  ];

  const overviewHtml = renderOverviewRows(overviewRows);
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section protein-overview" aria-labelledby="overview-heading">
<h2 id="overview-heading">Overview</h2>
${overviewHtml}
</section>`);
  }

  const groupCharacteristics = {
    processing_states_represented: page.processing_states_represented,
    species_represented: page.species_represented,
  };
  sections.push(renderCharacteristicsBlock("Characteristics", groupCharacteristics));
  sections.push(renderLinkSection("Member foods", sectionsNav.member_foods));
  sections.push(renderLinkSection("Related groups", sectionsNav.related_groups));

  return sections.filter(Boolean).join("\n");
}

export function renderProteinCategorySections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const sectionsNav = linkSet?.sections ?? {};

  sections.push(`<header class="term-entity-hero protein-category-hero">
<p class="term-entity-label">Protein Category</p>
<h1>${escapeHtml(overview.display_name ?? page.identity.title)}</h1>
</header>`);

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Group count", overview.group_count != null ? String(overview.group_count) : null],
    ["Food count", overview.food_count != null ? String(overview.food_count) : null],
  ];

  const overviewHtml = renderOverviewRows(overviewRows);
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section protein-overview" aria-labelledby="overview-heading">
<h2 id="overview-heading">Overview</h2>
${overviewHtml}
</section>`);
  }

  sections.push(renderLinkSection("Groups", sectionsNav.groups));
  sections.push(renderLinkSection("Related categories", sectionsNav.related_categories));

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
