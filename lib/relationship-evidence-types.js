/**
 * ONTOLOGY-01C.6 — Relationship evidence SSOT.
 *
 * Architecture Rule #3: Relationships may optionally contain evidence.
 * Evidence references ontology entities whenever possible.
 */

export const CONFIDENCE_LEVELS = Object.freeze(["high", "medium", "low"]);

export const REASON_ENTITY_KINDS = Object.freeze([
  "descriptor",
  "descriptor_group",
  "wine_style",
  "wine_region",
  "wine_serving",
  "grape_variety",
  "pairing",
  "winemaking_technique",
  "wine_fault",
]);
