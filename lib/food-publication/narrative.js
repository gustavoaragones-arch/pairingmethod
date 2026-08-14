/**
 * AQ-02A — Narrative field extraction for the Food Ontology publication platform.
 *
 * Rule 2 (Publication Completion Architecture): no authored catalog field may exist
 * without publication intent. This module is the single place that decides which
 * catalog fields carry publication intent at each entity tier (leaf / group / category),
 * and is domain-agnostic on purpose — a new food domain inherits narrative rendering
 * automatically by having these field names in its catalog, with no per-domain
 * configuration required.
 */

// Recognized narrative fields per tier. A field is only carried into the projection
// (and therefore only rendered) if it is present and non-empty on the source entity —
// domains that haven't authored a given field (e.g. beginner_notes/faq outside
// protein and cheese today) simply omit that section; this is the "graceful fallback"
// rule, not a defect.
export const NARRATIVE_FIELDS = Object.freeze({
  leaf: ["summary", "beginner_notes", "faq", "seo_description", "origin_context"],
  group: ["summary", "introduction", "beginner_notes", "faq", "seo_description"],
  category: ["summary", "introduction", "seo_description"],
});

function isPresent(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Extract the narrative (publication-intent) fields present on a raw catalog entity.
 * Returns a plain object containing only the fields that are actually present and
 * non-empty — never a field with an empty-string or empty-array placeholder value.
 */
export function extractNarrative(entity, tier) {
  const fields = NARRATIVE_FIELDS[tier] ?? [];
  const narrative = {};
  for (const field of fields) {
    const value = entity?.[field];
    if (isPresent(value)) narrative[field] = value;
  }
  return narrative;
}

/** True if the narrative object has at least one populated field. */
export function hasNarrative(narrative) {
  return !!narrative && Object.keys(narrative).length > 0;
}
