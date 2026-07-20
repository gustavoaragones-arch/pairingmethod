/**
 * FOOD-09F — Fruit HTML section renderers.
 * Pure presentation over certified page and navigation artifacts.
 */

import { escapeHtml, renderBreadcrumb } from "./taxonomy-render.js";

const CHARACTERISTIC_LABELS = {
  culinary_group: "Culinary group",
  usage_intensity: "Usage intensity",
  scientific_name: "Scientific name",
  flavor_profile: "Flavor profile",
  texture_profile: "Texture profile",
  aroma_profile: "Aroma profile",
  typical_descriptors: "Typical descriptors",
  usage_intensities_represented: "Usage intensities represented",
};

const LEAF_LINK_SECTIONS = [
  ["similar_fruits", "Similar fruits"],
  ["substitutions", "Substitutions"],
  ["commonly_served_with", "Commonly served with"],
  ["primary_wine_styles", "Primary wine styles"],
  ["alternative_wine_styles", "Alternative wine styles"],
  ["wine_descriptors", "Wine descriptors"],
  ["wine_techniques", "Wine techniques"],
];

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
  return String(value).replace(/-/g, " ").replace(/_/g, " ");
}

function renderDefinitionList(entries) {
  if (!entries.length) return "";
  const rows = entries
    .map(
      ([label, value]) =>
        `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`
    )
    .join("");
  return `<dl class="fruit-characteristics-list">${rows}</dl>`;
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
  return `<section class="term-entity-section fruit-characteristics" aria-labelledby="${headingId}">
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
  return `<section class="term-entity-section fruit-link-section" aria-labelledby="${headingId}">
<h2 id="${headingId}">${escapeHtml(title)}</h2>
<ul class="term-entity-link-list">${links.map(renderNavLinkItem).join("")}</ul>
</section>`;
}

function renderOverviewRows(rows) {
  const entries = rows.filter(([, value]) => value);
  if (!entries.length) return "";
  return renderDefinitionList(entries);
}

export function renderFruitSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const sectionsNav = linkSet?.sections ?? {};

  sections.push(`<header class="term-entity-hero fruit-hero">
<p class="term-entity-label">Fruit</p>
<h1>${escapeHtml(overview.display_name ?? page.identity.title)}</h1>
</header>`);

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Classification", overview.category?.name],
    ["Group", overview.group?.name],
    ["Scientific name", overview.scientific_name],
    ["Usage intensity", overview.usage_intensity?.replace(/_/g, " ")],
  ];

  const overviewHtml = renderOverviewRows(overviewRows);
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section fruit-overview" aria-labelledby="overview-heading">
<h2 id="overview-heading">Overview</h2>
${overviewHtml}
</section>`);
  }

  sections.push(renderCharacteristicsBlock("Characteristics", page.characteristics ?? {}));

  for (const [sectionKey, title] of LEAF_LINK_SECTIONS) {
    sections.push(renderLinkSection(title, sectionsNav[sectionKey]));
  }

  return sections.filter(Boolean).join("\n");
}

export function renderFruitGroupSections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const sectionsNav = linkSet?.sections ?? {};

  sections.push(`<header class="term-entity-hero fruit-group-hero">
<p class="term-entity-label">Fruit Group</p>
<h1>${escapeHtml(overview.display_name ?? page.identity.title)}</h1>
</header>`);

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Category", overview.parent_category?.name],
    ["Fruit count", overview.food_count != null ? String(overview.food_count) : null],
  ];

  const overviewHtml = renderOverviewRows(overviewRows);
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section fruit-overview" aria-labelledby="overview-heading">
<h2 id="overview-heading">Overview</h2>
${overviewHtml}
</section>`);
  }

  const groupCharacteristics = {
    usage_intensities_represented: page.usage_intensities_represented,
  };
  sections.push(renderCharacteristicsBlock("Characteristics", groupCharacteristics));
  sections.push(renderLinkSection("Member fruits", sectionsNav.member_fruits));
  sections.push(renderLinkSection("Related groups", sectionsNav.related_groups));

  return sections.filter(Boolean).join("\n");
}

export function renderFruitCategorySections(page, linkSet) {
  const sections = [];
  const overview = page.overview ?? {};
  const sectionsNav = linkSet?.sections ?? {};

  sections.push(`<header class="term-entity-hero fruit-category-hero">
<p class="term-entity-label">Fruit Category</p>
<h1>${escapeHtml(overview.display_name ?? page.identity.title)}</h1>
</header>`);

  const overviewRows = [
    ["Display name", overview.display_name],
    ["Group count", overview.group_count != null ? String(overview.group_count) : null],
    ["Fruit count", overview.food_count != null ? String(overview.food_count) : null],
  ];

  const overviewHtml = renderOverviewRows(overviewRows);
  if (overviewHtml) {
    sections.push(`<section class="term-entity-section fruit-overview" aria-labelledby="overview-heading">
<h2 id="overview-heading">Overview</h2>
${overviewHtml}
</section>`);
  }

  sections.push(renderLinkSection("Groups", sectionsNav.groups));
  sections.push(renderLinkSection("Related categories", sectionsNav.related_categories));

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
