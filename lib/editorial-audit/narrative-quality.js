/**
 * AQ-07E — Grammar & Template-Quality Audit.
 *
 * Inspects every rewritten narrative field (AQ-07C) for mechanical defects
 * a spell-checker would catch and a few AQ-07-specific ones (leftover
 * template variables, internal terminology, ontology-describing-itself
 * prose) that a generic grammar checker would not. Classifies every
 * finding critical/high/medium/low/intentional rather than auto-fixing
 * anything ambiguous, per the ticket's explicit instruction.
 *
 * Read-only.
 */

import { readJson } from "../food-publication/utils.js";

const CATALOG_SPECS = [
  ["protein", "data/protein-food-catalog.json", "protein_foods", "groups", "categories"],
  ["cheese", "data/cheese-catalog.json", "cheeses", "groups", "categories"],
  ["fruit", "data/fruit-catalog.json", "fruits", "groups", "categories"],
  ["vegetable", "data/vegetable-catalog.json", "vegetables", "groups", "categories"],
  ["grain-starch", "data/grain-starch-catalog.json", "grain_starches", "groups", "categories"],
  ["legume", "data/legume-catalog.json", "legumes", "groups", "categories"],
  ["nut-seed", "data/nut-seed-catalog.json", "nut_seeds", "groups", "categories"],
  ["herb-spice", "data/herb-spice-catalog.json", "herb_spices", "groups", "categories"],
  ["sweet-flavor", "data/sweet-flavor-catalog.json", "sweet_flavors", "groups", "categories"],
  ["sauce-condiment", "data/sauce-condiment-catalog.json", "sauce_condiments", "groups", "categories"],
  ["fungi", "data/fungi-catalog.json", "fungi", "groups", "categories"],
];

const NARRATIVE_FIELDS = ["summary", "seo_description", "beginner_notes", "introduction"];

// Mirrors lib/food-publication/narrative.js's NARRATIVE_FIELDS and
// AQ-07B's own render-awareness fix (lib/editorial-audit/governance-
// language.js): "introduction" does not render for leaf-tier entities, so
// a leaf entity's raw "introduction" key (163 of them, in sweet-flavor and
// sauce-condiment) is dead, never-consumer-facing data. Findings in a
// non-rendered field are reported separately, not counted toward the
// critical-defect gate — the same distinction AQ-07B established, applied
// consistently here rather than re-litigated.
const RENDERED_FIELDS_BY_TIER = {
  leaf: new Set(["summary", "beginner_notes", "faq", "seo_description", "origin_context"]),
  group: new Set(["summary", "introduction", "beginner_notes", "faq", "seo_description"]),
  category: new Set(["summary", "introduction", "seo_description"]),
};

// A finding inside a scientific_name-echoing phrase (binomial nomenclature
// legitimately repeats the genus as the species epithet, e.g. "Solea
// solea") is not a grammar defect — classified intentional, not critical.
function isScientificBinomialEcho(snippet) {
  if (!snippet) return false;
  const [a, b] = snippet.split(/\s+/);
  return a && b && a.toLowerCase() === b.toLowerCase() && /^[A-Z][a-z]+$/.test(a);
}

const VOWEL_SOUND = /^(a|e|i|o|u)/i;
// Words starting with a vowel letter but a consonant SOUND ("a European", "a one-off") —
// small, deliberately conservative exception list to avoid false positives.
const CONSONANT_SOUND_EXCEPTIONS = new Set(["european", "one", "united"]);

function checkArticleAgreement(text, findings, context) {
  const matches = [...text.matchAll(/\b(a|an)\s+(\w+)/gi)];
  for (const m of matches) {
    const article = m[1].toLowerCase();
    const word = m[2].toLowerCase();
    const startsVowelSound = VOWEL_SOUND.test(word) && !CONSONANT_SOUND_EXCEPTIONS.has(word);
    if (article === "a" && startsVowelSound) {
      findings.push({ ...context, type: "article_agreement", severity: "critical", detail: `"a ${m[2]}" should likely be "an ${m[2]}"`, snippet: m[0] });
    }
    if (article === "an" && !startsVowelSound) {
      findings.push({ ...context, type: "article_agreement", severity: "critical", detail: `"an ${m[2]}" should likely be "a ${m[2]}"`, snippet: m[0] });
    }
  }
}

function checkDuplicateWords(text, findings, context) {
  const matches = [...text.matchAll(/\b(\w+)\s+\1\b/gi)];
  for (const m of matches) {
    findings.push({ ...context, type: "duplicated_word", severity: "critical", detail: `repeated word: "${m[0]}"`, snippet: m[0] });
  }
}

function checkTemplateArtifacts(text, findings, context) {
  if (/\{[a-zA-Z_]+\}/.test(text)) {
    findings.push({ ...context, type: "unresolved_template_variable", severity: "critical", detail: "literal {placeholder} syntax found", snippet: text.match(/\{[a-zA-Z_]+\}/)[0] });
  }
  if (/\bTODO\b|\bFIXME\b|\bXXX\b/.test(text)) {
    findings.push({ ...context, type: "leftover_dev_marker", severity: "critical", detail: "TODO/FIXME/XXX marker found in prose" });
  }
}

function checkOldTemplatePattern(text, findings, context) {
  // The specific pre-AQ-07C broken construction: "{noun} use in {X} cooking pairs with"
  if (/\buse in .+ cooking pairs with\b/i.test(text)) {
    findings.push({ ...context, type: "legacy_template_pattern_survived", severity: "critical", detail: "the pre-remediation broken sentence pattern is still present" });
  }
  if (/\bis a canonical\b/i.test(text)) {
    findings.push({ ...context, type: "legacy_governance_leak_survived", severity: "critical", detail: "'is a canonical' pattern still present" });
  }
};

function checkPunctuationAndSpacing(text, findings, context) {
  if (/  +/.test(text)) {
    findings.push({ ...context, type: "double_space", severity: "low" });
  }
  // A trailing " ..." is the site's established truncated-seo_description
  // marker (lib/schema-audit and every domain's seo_description follow
  // this convention) — legitimate, not a missing-punctuation defect.
  const isTruncationMarker = /\s\.\.\.$/.test(text);
  if (text.trim().length > 0 && !/[.!?]$/.test(text.trim()) && !isTruncationMarker) {
    findings.push({ ...context, type: "missing_terminal_punctuation", severity: "medium", detail: `ends with: "...${text.trim().slice(-20)}"` });
  }
  // Same exclusion: the space before the "..." truncation marker is
  // intentional formatting, not a stray space before punctuation.
  const withoutTruncationMarker = isTruncationMarker ? text.replace(/\s\.\.\.$/, "") : text;
  if (/\s[.,;:]/.test(withoutTruncationMarker)) {
    findings.push({ ...context, type: "space_before_punctuation", severity: "low" });
  }
}

function checkGenericOpeners(text, findings, context) {
  // Flags a small set of known-generic openers that convey no entity-specific
  // information — reported as medium (needs human judgment), not auto-flagged
  // as high, since a generic-sounding opener followed by real specifics isn't
  // itself a defect.
  const genericPhrases = [
    /^this ingredient is a versatile choice/i,
    /^a versatile ingredient/i,
    /^pairs well with (a range of|many) wines?/i,
  ];
  for (const pattern of genericPhrases) {
    if (pattern.test(text.trim())) {
      findings.push({ ...context, type: "generic_template_opener", severity: "high", detail: "matches a known content-free generic phrasing pattern" });
    }
  }
}

function checkOntologySelfReference(text, findings, context) {
  // Prose that describes the catalog/platform rather than the ingredient
  // itself — e.g. "this entity's classification is..." — distinct from,
  // and a superset check beyond, AQ-07B's specific term list.
  const selfReferentialPatterns = [
    /\bthis (entity|entry|record)\b/i,
    /\bcatalog(ed|s)? (as|under)\b/i,
    /\bgoverned by\b/i,
    /\bper [A-Z]+-\d+\b/i, // e.g. "per CANON-001"
  ];
  for (const pattern of selfReferentialPatterns) {
    if (pattern.test(text)) {
      findings.push({ ...context, type: "describes_the_catalog_not_the_ingredient", severity: "high", detail: `matched: ${pattern}` });
    }
  }
}

export function auditNarrativeQuality(root) {
  const findings = [];
  let fieldsChecked = 0;

  for (const [domainId, relPath, leafKey, groupKey, catKey] of CATALOG_SPECS) {
    const catalog = readJson(`${root}/${relPath}`);
    for (const [tier, key] of [["leaf", leafKey], ["group", groupKey], ["category", catKey]]) {
      for (const entity of catalog[key] ?? []) {
        for (const field of NARRATIVE_FIELDS) {
          const value = entity[field];
          if (typeof value !== "string" || !value) continue;
          fieldsChecked += 1;
          const rendersToConsumer = RENDERED_FIELDS_BY_TIER[tier]?.has(field) ?? false;
          const context = { domain: domainId, tier, entity_id: entity.id, field, renders_to_consumer: rendersToConsumer };
          const before = findings.length;
          checkArticleAgreement(value, findings, context);
          checkDuplicateWords(value, findings, context);
          checkTemplateArtifacts(value, findings, context);
          checkOldTemplatePattern(value, findings, context);
          checkPunctuationAndSpacing(value, findings, context);
          checkGenericOpeners(value, findings, context);
          checkOntologySelfReference(value, findings, context);
          // Reclassify: dead-field findings never reach a reader (AQ-07B's
          // established distinction); scientific-binomial echoes are a
          // legitimate nomenclature convention, not a grammar defect.
          for (let i = before; i < findings.length; i++) {
            const f = findings[i];
            if (!rendersToConsumer && f.severity === "critical") {
              f.severity = "intentional";
              f.reclassification_reason = "field does not render to any consumer surface for this tier (dead catalog data, not a live defect)";
            } else if (f.type === "duplicated_word" && isScientificBinomialEcho(f.snippet)) {
              f.severity = "intentional";
              f.reclassification_reason = "genus/species binomial nomenclature convention (e.g. Solea solea), not a grammar defect";
            }
          }
        }
      }
    }
  }

  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0, intentional: 0 };
  for (const f of findings) bySeverity[f.severity] = (bySeverity[f.severity] ?? 0) + 1;

  return {
    phase: "AQ-07E",
    title: "Grammar & Template-Quality Audit",
    fields_checked: fieldsChecked,
    total_findings: findings.length,
    findings_by_severity: bySeverity,
    findings,
    quality_gate: {
      requirement: "0 critical grammatical defects",
      critical_count: bySeverity.critical,
      pass: bySeverity.critical === 0,
    },
    overall_certification: bySeverity.critical === 0 ? "PASS" : "FAIL — critical defects require correction",
  };
}
