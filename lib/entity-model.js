/**
 * KNOWLEDGE-05 — Entity ontology constants and inference helpers.
 *
 * Structural `type` (category | group | descriptor | entity) describes tree role.
 * Semantic `entity_type` classifies what the node represents in the knowledge graph.
 * `domain` scopes entities to wine, culinary, or shared knowledge.
 */

/** @typedef {import('./entity-model-types.js').EntityType} EntityType */
/** @typedef {import('./entity-model-types.js').Domain} Domain */

export const DOMAINS = Object.freeze({
  WINE: "wine",
  CULINARY: "culinary",
  SHARED: "shared",
});

/** Entity types currently present in the graph. */
export const ENTITY_TYPES = Object.freeze({
  DESCRIPTOR_CATEGORY: "descriptor_category",
  DESCRIPTOR_GROUP: "descriptor_group",
  DESCRIPTOR: "descriptor",
  WINE_STYLE: "wine_style",
  GRAPE_VARIETY: "grape_variety",
  WINE_REGION: "wine_region",
  WINE_SERVING: "wine_serving",
  WINE_FAULT: "wine_fault",
  WINEMAKING_TECHNIQUE: "winemaking_technique",
  SERVING: "serving",
  GLASSWARE: "glassware",
  FOOD: "food",
  PROTEIN: "protein",
  COOKING_METHOD: "cooking_method",
  SAUCE: "sauce",
  CHEESE: "cheese",
  HERB: "herb",
  SPICE: "spice",
  VEGETABLE: "vegetable",
  FRUIT: "fruit",
  MUSHROOM: "mushroom",
});

/** All entity types the schema accepts (current + planned KNOWLEDGE-05/06). */
export const SUPPORTED_ENTITY_TYPES = Object.freeze([
  ENTITY_TYPES.DESCRIPTOR_CATEGORY,
  ENTITY_TYPES.DESCRIPTOR_GROUP,
  ENTITY_TYPES.DESCRIPTOR,
  ENTITY_TYPES.WINE_STYLE,
  ENTITY_TYPES.GRAPE_VARIETY,
  ENTITY_TYPES.WINE_REGION,
  ENTITY_TYPES.WINE_SERVING,
  ENTITY_TYPES.WINE_FAULT,
  ENTITY_TYPES.WINEMAKING_TECHNIQUE,
  ENTITY_TYPES.SERVING,
  ENTITY_TYPES.GLASSWARE,
  ENTITY_TYPES.FOOD,
  ENTITY_TYPES.PROTEIN,
  ENTITY_TYPES.COOKING_METHOD,
  ENTITY_TYPES.SAUCE,
  ENTITY_TYPES.CHEESE,
  ENTITY_TYPES.HERB,
  ENTITY_TYPES.SPICE,
  ENTITY_TYPES.VEGETABLE,
  ENTITY_TYPES.FRUIT,
  ENTITY_TYPES.MUSHROOM,
]);

const WINE_ENTITY_TYPES = new Set([
  ENTITY_TYPES.DESCRIPTOR_CATEGORY,
  ENTITY_TYPES.DESCRIPTOR_GROUP,
  ENTITY_TYPES.DESCRIPTOR,
  ENTITY_TYPES.WINE_STYLE,
  ENTITY_TYPES.GRAPE_VARIETY,
  ENTITY_TYPES.WINE_REGION,
  ENTITY_TYPES.WINE_SERVING,
  ENTITY_TYPES.WINE_FAULT,
  ENTITY_TYPES.WINEMAKING_TECHNIQUE,
  ENTITY_TYPES.SERVING,
  ENTITY_TYPES.GLASSWARE,
]);

const CULINARY_ENTITY_TYPES = new Set([
  ENTITY_TYPES.FOOD,
  ENTITY_TYPES.PROTEIN,
  ENTITY_TYPES.COOKING_METHOD,
  ENTITY_TYPES.SAUCE,
  ENTITY_TYPES.CHEESE,
  ENTITY_TYPES.HERB,
  ENTITY_TYPES.SPICE,
  ENTITY_TYPES.VEGETABLE,
  ENTITY_TYPES.FRUIT,
  ENTITY_TYPES.MUSHROOM,
]);

const STRUCTURAL_TYPE_TO_ENTITY_TYPE = Object.freeze({
  category: ENTITY_TYPES.DESCRIPTOR_CATEGORY,
  group: ENTITY_TYPES.DESCRIPTOR_GROUP,
  descriptor: ENTITY_TYPES.DESCRIPTOR,
});

/**
 * Infer semantic entity_type from a taxonomy node.
 *
 * @param {{ type?: string, entity_type?: string }} node
 * @returns {string}
 */
export function inferEntityType(node) {
  if (node.entity_type) return node.entity_type;
  return STRUCTURAL_TYPE_TO_ENTITY_TYPE[node.type] ?? node.type;
}

/**
 * Infer domain from entity_type when not explicitly set.
 *
 * @param {{ domain?: string, entity_type?: string, type?: string }} node
 * @returns {string | null}
 */
export function inferDomain(node) {
  if (node.domain) return node.domain;
  const entityType = inferEntityType(node);
  if (WINE_ENTITY_TYPES.has(entityType)) return DOMAINS.WINE;
  if (CULINARY_ENTITY_TYPES.has(entityType)) return DOMAINS.CULINARY;
  return null;
}

/**
 * Apply entity_type and domain to a node (mutates copy).
 *
 * @param {Record<string, unknown>} node
 * @returns {Record<string, unknown>}
 */
export function normalizeEntityFields(node) {
  const entity_type = inferEntityType(node);
  const domain = inferDomain({ ...node, entity_type });
  return {
    ...node,
    entity_type,
    ...(domain ? { domain } : {}),
  };
}

/**
 * @param {string} entityType
 * @returns {boolean}
 */
export function isDescriptorEntity(entityType) {
  return entityType === ENTITY_TYPES.DESCRIPTOR;
}

/**
 * @param {string} entityType
 * @returns {boolean}
 */
export function isWineDomainEntity(entityType) {
  return WINE_ENTITY_TYPES.has(entityType);
}
