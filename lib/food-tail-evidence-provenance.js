/**
 * PAIRING-EAT-16 — Food-tail evidence provenance & validation architecture.
 *
 * Implements the EAT-15-authoritative evidence policy as executable,
 * fail-closed validation logic, plus the relationship -> evidence_record ->
 * source_record provenance data model.
 *
 * This module is intentionally separate from lib/relationship-evidence.js /
 * lib/relationship-evidence-types.js (the ONTOLOGY-01C.6 wine-internal
 * evidence system backing data/relationship-evidence.json, used for facts
 * like wine-style -> recommended-glass or wine-style -> produced-in-region).
 * That system is NOT repurposed or imported here — food-to-wine pairing
 * provenance is a structurally distinct concern with its own store
 * (data/evidence-provenance/) and its own schema, per EAT-13/EAT-14's
 * explicit finding that the wine-internal evidence file has zero coverage
 * of food-tail pairing edges and must not be treated as if it did.
 *
 * Nothing in this module writes to or reads from the 873 quarantined
 * runtime relationship files, the four food catalogs, the pairing engine,
 * or any renderer. It is a standalone, read-only-against-production
 * architecture layer.
 */

// ---------------------------------------------------------------------
// Enums (EAT-15 authoritative)
// ---------------------------------------------------------------------

export const RELATIONSHIP_TYPES_ALLOWED = Object.freeze(["pairs_with_style", "also_pairs_with_style", "pairs_with_descriptor", "pairs_with_technique"]);

export const RELATIONSHIP_STATUSES = Object.freeze(["evidence_required", "evidence_present", "evidence_verified", "evidence_insufficient", "quarantined", "deprecated_unsupported"]);

export const CONTRADICTION_STATUSES = Object.freeze(["none", "contradiction_signal", "contradicted"]);

export const SOURCE_VERIFICATION_STATES = Object.freeze({
  SOURCE_UNVERIFIED: { can_support_evidence_verified: false },
  SOURCE_SNIPPET_ONLY: { can_support_evidence_verified: false },
  SOURCE_DIRECTLY_VERIFIED: { can_support_evidence_verified: true },
  SOURCE_ARCHIVED_VERIFIED: { can_support_evidence_verified: true },
});
export const VALID_SOURCE_VERIFICATION_STATES = Object.freeze(Object.keys(SOURCE_VERIFICATION_STATES));

export const BRIDGE_TYPES = Object.freeze(["EXACT_ENTITY", "UNAMBIGUOUS_SYNONYM", "PREPARATION_DERIVED", "DISH_DERIVED", "CATEGORY_DERIVED", "ATTRIBUTE_DERIVED"]);
export const BRIDGE_TYPES_AUTO_QUALIFY = Object.freeze(["EXACT_ENTITY", "UNAMBIGUOUS_SYNONYM"]);
export const BRIDGE_TYPES_REQUIRE_DOCUMENTED_RULE = Object.freeze(["PREPARATION_DERIVED", "DISH_DERIVED"]);
export const BRIDGE_TYPES_NEVER_QUALIFY = Object.freeze(["CATEGORY_DERIVED", "ATTRIBUTE_DERIVED"]);

export const CLAIM_TYPES = Object.freeze(["EXPLICIT_PAIRING", "STRONG_CONTEXTUAL_SUPPORT", "INDIRECT_SUPPORT", "COINCIDENTAL_CO_OCCURRENCE", "UNSUPPORTED"]);

export const EVIDENCE_STRENGTH_LEVELS = Object.freeze(["insufficient", "contextual_single_source", "contextual_multi_source", "explicit_single_source", "explicit_multi_source", "contradicted", "contradiction_signal"]);

export const SOURCE_TIERS = Object.freeze([1, 2, 3, 4]);

export const SOURCE_TYPES = Object.freeze(["PRODUCER_SOURCE", "RETAILER_SOURCE", "EDITORIAL_SOURCE", "INSTITUTIONAL_SOURCE", "PROFESSIONAL_SOURCE", "ALGORITHMIC_SOURCE", "USER_GENERATED_SOURCE"]);
export const SOURCE_TYPES_NEVER_SUFFICIENT_ALONE = Object.freeze(["PRODUCER_SOURCE", "RETAILER_SOURCE", "ALGORITHMIC_SOURCE", "USER_GENERATED_SOURCE"]);

export const SOURCE_RECORD_FIELDS = Object.freeze(["source_id", "source_url", "title", "publisher", "author", "publication_date", "source_tier", "source_type", "verification_state", "accessed_date", "archive_status", "archive_reference", "content_hash", "notes"]);

export const RELATIONSHIP_EVIDENCE_RECORD_FIELDS = Object.freeze(["relationship_id", "exact_food_entity_id", "exact_wine_target_id", "relationship_type", "source_ids", "source_verification_state", "bridge_type", "documented_bridge_rule", "claim_type", "evidence_strength", "relationship_status", "researcher_id", "reviewer_id", "research_date", "review_date", "caveats", "contradiction_status", "name_echo_risk", "name_echo_reviewed"]);

// ---------------------------------------------------------------------
// Evidence-strength derivation (must never be independently trusted)
// ---------------------------------------------------------------------

/**
 * Derives the ONLY acceptable evidence_strength value for a given
 * claim_type + source count. A relationship_evidence_record's stored
 * evidence_strength MUST equal this function's output — it is computed,
 * never independently supplied. This is the direct fix for the EAT-14/
 * EAT-15-identified error where a STRONG_CONTEXTUAL_SUPPORT claim was
 * recorded with an 'explicit_*' strength merely because multiple sources
 * existed.
 */
export function computeExpectedEvidenceStrength({ claimType, sourceCount, contradictionStatus }) {
  if (contradictionStatus === "contradicted") return "contradicted";
  if (contradictionStatus === "contradiction_signal") return "contradiction_signal";
  if (claimType === "UNSUPPORTED" || claimType === "COINCIDENTAL_CO_OCCURRENCE" || claimType === "INDIRECT_SUPPORT") return "insufficient";
  if (claimType === "EXPLICIT_PAIRING") return sourceCount >= 2 ? "explicit_multi_source" : "explicit_single_source";
  if (claimType === "STRONG_CONTEXTUAL_SUPPORT") return sourceCount >= 2 ? "contextual_multi_source" : "contextual_single_source";
  return "insufficient";
}

// ---------------------------------------------------------------------
// Name-echo risk detection (not a new enum value — a boolean risk flag
// layered on top of the existing claim/bridge model, per Director
// instruction: "Do NOT create a new runtime relationship enum merely for
// name-echo.")
// ---------------------------------------------------------------------

const STOPWORDS = new Set(["a", "an", "the", "and", "or", "of", "with", "flavor", "flavored", "flavoured"]);
function normalizeTokens(text) {
  if (!text) return [];
  return text.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t && !STOPWORDS.has(t));
}

// ---------------------------------------------------------------------
// Name-echo matching data (PAIRING-EAT-16B hardening)
//
// These two tables are the ONLY non-exact-token matching this module
// performs. Both are small, deliberately conservative, and deterministic
// — no fuzzy matching, no edit-distance threshold, no embeddings, no NLP
// library. Each entry is individually justified below rather than being
// a general-purpose synonym dictionary.
// ---------------------------------------------------------------------

/**
 * WINE_DESCRIPTOR_ALIASES mirrors the `search_aliases` field ALREADY
 * documented on these exact wine descriptor entries in the project's own
 * wine ontology (see e.g. the "chocolate" and "honeyed" descriptor nodes
 * returned by lib/taxonomy.js's loadTaxonomy()). It is reproduced here as
 * a small static table — rather than adding a live taxonomy import to
 * this otherwise dependency-free, pure function — specifically to keep
 * detectNameEcho() deterministic and side-effect-free. Per the Director's
 * instruction to "use existing project terms rather than inventing a
 * parallel ontology," every alias listed below is copied verbatim from
 * the real descriptor's own search_aliases (confirmed by direct
 * inspection of lib/taxonomy.js's loaded data during EAT-16B), not
 * invented for this module.
 *
 * Deliberately kept to only the descriptors implicated in known EAT-15
 * name-echo findings — this is NOT the full wine-descriptor vocabulary,
 * to avoid overgeneralizing name-echo risk across unrelated descriptors
 * that happen to share a search alias for an unrelated reason.
 */
const WINE_DESCRIPTOR_ALIASES = Object.freeze({
  // Real search_aliases: ["chocolate", "cocoa", "mocha"]. "Cocoa" is
  // included because chocolate is made from cocoa/cacao; "mocha" is a
  // recognized chocolate-coffee flavor term.
  chocolate: Object.freeze(["chocolate", "cocoa", "mocha"]),
  // Real search_aliases: ["honeyed", "honey"].
  honeyed: Object.freeze(["honeyed", "honey"]),
});

/**
 * INGREDIENT_SYNONYMS is a single, well-established English synonym pair
 * for the same substance — NOT a general synonym dictionary. "Cacao" and
 * "cocoa" both refer to Theobroma cacao / its processed forms and are
 * used interchangeably in ordinary food vocabulary (the raw/traditional
 * term vs. the more common processed-product term). This is the one
 * mapping needed to connect food-side "cacao powder" to the wine
 * descriptor "chocolate"'s own documented "cocoa" alias, without which
 * that real EAT-15 motivating case cannot be explained through the
 * project's existing vocabulary alone.
 */
const INGREDIENT_SYNONYMS = Object.freeze({ cacao: "cocoa" });

/**
 * A single, general, deterministic English derivational rule: a
 * descriptor formed by appending "-ed" to a plain noun (e.g. "honey" ->
 * "honeyed", the same pattern as "flavor" -> "flavored" already excluded
 * as a stopword pair elsewhere in this module). Applied symmetrically
 * (food-derived-from-descriptor or descriptor-derived-from-food) and
 * only for tokens of at least 3 letters after stripping the suffix, to
 * avoid matching trivial fragments. This is NOT a stemming library and
 * recognizes exactly one suffix pattern — nothing broader.
 */
function isEdSuffixDerivation(tokenA, tokenB) {
  const strip = (long, short) => long.length > short.length + 1 && long.endsWith("ed") && long.slice(0, -2) === short && short.length >= 3;
  return strip(tokenA, tokenB) || strip(tokenB, tokenA);
}

/**
 * Detects the "name-echo" risk pattern: the food entity's own name and
 * the wine descriptor/target's own name/slug share a substantive token,
 * a recognized single-suffix derivational form, or a documented wine-
 * descriptor alias (optionally bridged by one recognized ingredient
 * synonym) — WITHOUT any other structural corroboration (e.g. a
 * documented compositional/chemical link). This is a RISK CONDITION, not
 * evidence, and not itself disqualifying — but a record with
 * name_echo_risk === true cannot reach evidence_verified unless
 * name_echo_reviewed === true (an explicit, separate acknowledgment that
 * a human/editorial reviewer checked the underlying causal claim,
 * distinct from just accepting the word match).
 *
 * Recognizes exactly three classes, each deterministic and explainable:
 *   A. Exact token overlap (e.g. "Almond" vs. wine descriptor "Almond").
 *   B. A single "-ed" derivational suffix relationship (e.g. "Honey" vs.
 *      "Honeyed") — see isEdSuffixDerivation().
 *   C. A documented wine-descriptor alias match, optionally bridged by
 *      the one recognized ingredient synonym (e.g. "Cacao Powder" vs.
 *      "Chocolate", via cacao->cocoa and chocolate's own "cocoa" alias)
 *      — see WINE_DESCRIPTOR_ALIASES / INGREDIENT_SYNONYMS above.
 *
 * Always returns a strict boolean — never a string, object, score, or
 * undefined.
 */
export function detectNameEcho(foodEntityName, wineTargetName) {
  const foodTokens = new Set(normalizeTokens(foodEntityName));
  const targetTokens = new Set(normalizeTokens(wineTargetName));

  // Class A: exact token overlap.
  for (const t of targetTokens) {
    if (foodTokens.has(t)) return true;
  }

  // Class B: single "-ed" derivational suffix, checked pairwise.
  for (const f of foodTokens) {
    for (const t of targetTokens) {
      if (isEdSuffixDerivation(f, t)) return true;
    }
  }

  // Class C: documented wine-descriptor alias, food side optionally
  // expanded through the one recognized ingredient synonym.
  const expandedFoodTokens = new Set(foodTokens);
  for (const f of foodTokens) {
    if (INGREDIENT_SYNONYMS[f]) expandedFoodTokens.add(INGREDIENT_SYNONYMS[f]);
  }
  for (const t of targetTokens) {
    const aliasList = WINE_DESCRIPTOR_ALIASES[t];
    if (!aliasList) continue;
    for (const alias of aliasList) {
      if (expandedFoodTokens.has(alias)) return true;
    }
  }

  return false;
}

// ---------------------------------------------------------------------
// Source record validation
// ---------------------------------------------------------------------

export function validateSourceRecord(source) {
  const errors = [];
  if (!source || typeof source !== "object") return { valid: false, errors: ["source record is not an object"] };
  if (!source.source_id) errors.push("missing source_id");
  if (source.source_tier !== null && !SOURCE_TIERS.includes(source.source_tier)) errors.push(`invalid source_tier: ${source.source_tier}`);
  if (source.source_type !== null && !SOURCE_TYPES.includes(source.source_type)) errors.push(`invalid source_type: ${source.source_type}`);
  if (!VALID_SOURCE_VERIFICATION_STATES.includes(source.verification_state)) errors.push(`invalid verification_state: ${source.verification_state}`);
  if (source.verification_state !== "SOURCE_UNVERIFIED" && source.source_url === undefined) errors.push("source_url field must be present (may be null) once a source has been looked at");
  const fieldSet = new Set(Object.keys(source));
  for (const f of SOURCE_RECORD_FIELDS) if (!fieldSet.has(f)) errors.push(`missing required field: ${f}`);
  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------
// Relationship evidence record validation (structural / schema level)
// ---------------------------------------------------------------------

export function validateRelationshipEvidenceRecordSchema(record) {
  const errors = [];
  if (!record || typeof record !== "object") return { valid: false, errors: ["record is not an object"] };
  if (!record.relationship_id) errors.push("missing relationship_id");
  if (!record.exact_food_entity_id) errors.push("missing exact_food_entity_id");
  if (!record.exact_wine_target_id) errors.push("missing exact_wine_target_id");
  if (!RELATIONSHIP_TYPES_ALLOWED.includes(record.relationship_type)) errors.push(`invalid relationship_type: ${record.relationship_type}`);
  if (!Array.isArray(record.source_ids) || record.source_ids.length === 0) errors.push("source_ids must be a non-empty array");
  if (!VALID_SOURCE_VERIFICATION_STATES.includes(record.source_verification_state)) errors.push(`invalid source_verification_state: ${record.source_verification_state}`);
  if (!BRIDGE_TYPES.includes(record.bridge_type)) errors.push(`invalid bridge_type: ${record.bridge_type}`);
  if (!CLAIM_TYPES.includes(record.claim_type)) errors.push(`invalid claim_type: ${record.claim_type}`);
  if (!EVIDENCE_STRENGTH_LEVELS.includes(record.evidence_strength)) errors.push(`invalid evidence_strength: ${record.evidence_strength}`);
  if (!RELATIONSHIP_STATUSES.includes(record.relationship_status)) errors.push(`invalid relationship_status: ${record.relationship_status}`);
  if (!CONTRADICTION_STATUSES.includes(record.contradiction_status)) errors.push(`invalid contradiction_status: ${record.contradiction_status}`);
  if (!record.researcher_id) errors.push("missing researcher_id");
  if (record.reviewer_id && record.reviewer_id === record.researcher_id) errors.push("reviewer_id must be distinct from researcher_id (identity collision)");
  if (!record.research_date) errors.push("missing research_date");
  if (record.review_date && !record.reviewer_id) errors.push("review_date present without a reviewer_id");
  if (!Array.isArray(record.caveats)) errors.push("caveats must be an array");
  const fieldSet = new Set(Object.keys(record));
  for (const f of RELATIONSHIP_EVIDENCE_RECORD_FIELDS) if (!fieldSet.has(f)) errors.push(`missing required field: ${f}`);

  // Evidence-strength derivation consistency (fails closed on any drift).
  if (EVIDENCE_STRENGTH_LEVELS.includes(record.evidence_strength) && CLAIM_TYPES.includes(record.claim_type) && CONTRADICTION_STATUSES.includes(record.contradiction_status)) {
    const expected = computeExpectedEvidenceStrength({ claimType: record.claim_type, sourceCount: (record.source_ids || []).length, contradictionStatus: record.contradiction_status });
    if (record.evidence_strength !== expected) errors.push(`evidence_strength inconsistency: stored='${record.evidence_strength}' expected='${expected}' (derived from claim_type='${record.claim_type}', sourceCount=${(record.source_ids || []).length}, contradiction_status='${record.contradiction_status}')`);
  }

  // NOTE: whether a PREPARATION_DERIVED/DISH_DERIVED bridge without a
  // documented_bridge_rule can reach evidence_verified is an ELIGIBILITY
  // question (see evaluateEvidenceVerifiedEligibility), not a SCHEMA
  // question — such a record is perfectly well-formed (e.g. legitimately
  // parked at evidence_present or evidence_insufficient), so it must not
  // be rejected here merely for lacking a rule it doesn't yet need.

  // Name-echo: risk flag must be present and, if true, must be explicitly
  // acknowledged (not silently ignored) before the record can be treated
  // as strong evidence.
  if (typeof record.name_echo_risk !== "boolean") errors.push("name_echo_risk must be an explicit boolean (computed via detectNameEcho, not omitted)");

  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------
// Full referential validation against live repository state
// ---------------------------------------------------------------------

export function validateRelationshipEvidenceRecordReferences(record, { foodEntityExists, wineTargetExists, sourcesById }) {
  const errors = [];
  if (record.exact_food_entity_id && foodEntityExists && !foodEntityExists(record.exact_food_entity_id)) errors.push(`unknown food entity: ${record.exact_food_entity_id}`);
  if (record.exact_wine_target_id && wineTargetExists && !wineTargetExists(record.relationship_type, record.exact_wine_target_id)) errors.push(`unknown wine target: ${record.exact_wine_target_id} for ${record.relationship_type}`);
  if (Array.isArray(record.source_ids)) {
    for (const sid of record.source_ids) {
      if (!sourcesById || !sourcesById.has(sid)) errors.push(`dangling source reference: ${sid}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

// ---------------------------------------------------------------------
// Master fail-closed eligibility gate for evidence_verified
// ---------------------------------------------------------------------

/**
 * Determines whether a relationship_evidence_record is eligible to hold
 * relationship_status 'evidence_verified'. This is the single authoritative
 * gate — every disqualifying condition is checked explicitly; nothing here
 * is optimistic ("assume true unless proven false"). Returns
 * {eligible: boolean, reasons: string[]} where reasons is empty only when
 * eligible is true.
 */
export function evaluateEvidenceVerifiedEligibility(record, { sourcesById } = {}) {
  const reasons = [];

  // 1. Structural/schema validity is a prerequisite.
  const schemaCheck = validateRelationshipEvidenceRecordSchema(record);
  if (!schemaCheck.valid) reasons.push(...schemaCheck.errors.map((e) => `schema: ${e}`));

  // 2. Claim type: unified bar across ALL relationship types (no relaxed
  // standard for descriptor/technique, per EAT-15's Policy C verdict).
  if (record.claim_type !== "EXPLICIT_PAIRING") {
    reasons.push(`claim_type must be EXPLICIT_PAIRING for evidence_verified regardless of relationship_type (got '${record.claim_type}')`);
  }

  // 3. Source verification state.
  const stateInfo = SOURCE_VERIFICATION_STATES[record.source_verification_state];
  if (!stateInfo || !stateInfo.can_support_evidence_verified) {
    reasons.push(`source_verification_state '${record.source_verification_state}' cannot support evidence_verified (only SOURCE_DIRECTLY_VERIFIED or SOURCE_ARCHIVED_VERIFIED may)`);
  }

  // 4. Bridge type.
  if (BRIDGE_TYPES_NEVER_QUALIFY.includes(record.bridge_type)) {
    reasons.push(`bridge_type '${record.bridge_type}' never qualifies for evidence_verified`);
  } else if (BRIDGE_TYPES_REQUIRE_DOCUMENTED_RULE.includes(record.bridge_type) && !record.documented_bridge_rule) {
    reasons.push(`bridge_type '${record.bridge_type}' requires a documented_bridge_rule, none present`);
  } else if (!BRIDGE_TYPES.includes(record.bridge_type)) {
    reasons.push(`unrecognized bridge_type '${record.bridge_type}'`);
  }

  // 5. Source count / quality preference: 2 independent sources preferred;
  // a single source may qualify ONLY via the narrow high-quality exception
  // (Tier 1-2, SOURCE_DIRECTLY_VERIFIED or better, non-capped source_type).
  const sourceIds = Array.isArray(record.source_ids) ? record.source_ids : [];
  const sources = sourcesById ? sourceIds.map((id) => sourcesById.get(id)).filter(Boolean) : [];
  if (sourcesById) {
    if (sources.length < sourceIds.length) reasons.push("one or more source_ids do not resolve to a known source record");
    const qualifyingIndependentSources = sources.filter((s) => !SOURCE_TYPES_NEVER_SUFFICIENT_ALONE.includes(s.source_type));
    if (qualifyingIndependentSources.length === 0) {
      reasons.push("no qualifying independent source (all sources are producer/retailer/algorithmic/user-generated, which cannot alone establish evidence_verified)");
    }
    if (sources.length < 2) {
      const single = sources[0];
      const singleQualifiesForException = single && single.source_tier && single.source_tier <= 2 && (single.verification_state === "SOURCE_DIRECTLY_VERIFIED" || single.verification_state === "SOURCE_ARCHIVED_VERIFIED") && !SOURCE_TYPES_NEVER_SUFFICIENT_ALONE.includes(single.source_type);
      if (!singleQualifiesForException) {
        reasons.push("fewer than 2 independent sources, and the single-source high-quality exception (Tier 1-2, directly/archived verified, non-capped source_type) is not met");
      }
    }
  }

  // 6. Name-echo: a risk-flagged record must be explicitly reviewed.
  if (record.name_echo_risk === true && record.name_echo_reviewed !== true) {
    reasons.push("name_echo_risk is true but name_echo_reviewed is not true — a name-echo risk condition must be explicitly acknowledged by review, never silently passed as strong evidence");
  }

  // 7. Reviewer requirement (pairs_with_style AND unified to all types per
  // the 'evidence rigor is unified' Director rule — this phase treats the
  // second-reviewer requirement as applying to every relationship type's
  // evidence_verified state, not just pairs_with_style, since the ticket's
  // rule #2 explicitly forbids type-based bar relaxation).
  if (!record.reviewer_id) {
    reasons.push("evidence_verified requires a non-null reviewer_id distinct from researcher_id");
  } else if (record.reviewer_id === record.researcher_id) {
    reasons.push("reviewer_id must be distinct from researcher_id (identity collision)");
  }

  // 8. Contradiction status must be 'none' — a contradicted or
  // signal-flagged relationship cannot simultaneously be evidence_verified.
  if (record.contradiction_status && record.contradiction_status !== "none") {
    reasons.push(`contradiction_status '${record.contradiction_status}' is incompatible with evidence_verified`);
  }

  return { eligible: reasons.length === 0, reasons };
}

// ---------------------------------------------------------------------
// Status transition rules (explicit state machine — no arbitrary jumps)
// ---------------------------------------------------------------------

const ALLOWED_TRANSITIONS = {
  evidence_required: ["evidence_present", "quarantined"],
  evidence_present: ["evidence_verified", "evidence_insufficient", "quarantined"],
  evidence_verified: ["deprecated_unsupported", "quarantined"],
  evidence_insufficient: ["evidence_present", "deprecated_unsupported", "quarantined"],
  quarantined: ["evidence_present", "evidence_insufficient"],
  deprecated_unsupported: [],
};

export function canTransition(fromStatus, toStatus, record, context) {
  if (!RELATIONSHIP_STATUSES.includes(fromStatus) || !RELATIONSHIP_STATUSES.includes(toStatus)) return { allowed: false, reason: "unknown status in transition" };
  const allowedTargets = ALLOWED_TRANSITIONS[fromStatus] || [];
  if (!allowedTargets.includes(toStatus)) return { allowed: false, reason: `${fromStatus} -> ${toStatus} is not a defined transition` };
  if (toStatus === "evidence_verified") {
    const evalResult = evaluateEvidenceVerifiedEligibility(record, context);
    if (!evalResult.eligible) return { allowed: false, reason: `evidence_verified eligibility failed: ${evalResult.reasons.join("; ")}` };
  }
  if (toStatus === "deprecated_unsupported") {
    if (record.contradiction_status !== "contradicted") return { allowed: false, reason: "deprecated_unsupported requires contradiction_status 'contradicted' (a CONTRADICTION_SIGNAL alone is insufficient per Director policy)" };
  }
  return { allowed: true, reason: null };
}

// ---------------------------------------------------------------------
// Publication safety predicate
// ---------------------------------------------------------------------

/**
 * A relationship is publication-safe if and only if its status is
 * evidence_verified AND its contradiction_status is 'none'. This is a
 * pure function over the provenance record — it does not read or modify
 * the runtime relationship files, the renderer, or the pairing engine.
 * A future phase may choose to wire this into
 * lib/food-tail-wine-pairing-explanation.js's existing filter; this phase
 * defines and tests the predicate only.
 */
export function isPublicationSafe(record) {
  if (!record) return false;
  if (record.relationship_status !== "evidence_verified") return false;
  if (record.contradiction_status && record.contradiction_status !== "none") return false;
  return true;
}

// ---------------------------------------------------------------------
// Governance-ID-as-evidence detection (must never qualify)
// ---------------------------------------------------------------------

const GOVERNANCE_ID_PATTERN = /\bper [A-Z][A-Z0-9-]*-\d+\b/i;
export function containsGovernanceIdAsEvidence(text) {
  return typeof text === "string" && GOVERNANCE_ID_PATTERN.test(text);
}

// ---------------------------------------------------------------------
// Duplicate / dangling reference detection across a whole store
// ---------------------------------------------------------------------

export function findDuplicateIds(records, idField) {
  const seen = new Map();
  const duplicates = [];
  for (const r of records) {
    const id = r[idField];
    seen.set(id, (seen.get(id) || 0) + 1);
  }
  for (const [id, count] of seen) if (count > 1) duplicates.push(id);
  return duplicates;
}

export function findDanglingSourceReferences(relationshipRecords, sourceRecords) {
  const sourceIds = new Set(sourceRecords.map((s) => s.source_id));
  const dangling = [];
  for (const r of relationshipRecords) {
    for (const sid of r.source_ids || []) {
      if (!sourceIds.has(sid)) dangling.push({ relationship_id: r.relationship_id, source_id: sid });
    }
  }
  return dangling;
}
