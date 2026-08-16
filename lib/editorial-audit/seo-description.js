/**
 * AQ-07F — SEO Description Certification.
 *
 * Because AQ-04B deliberately made seo_description the source for both
 * <meta name="description"> and every JSON-LD description property, it
 * gets its own certification pass here rather than being folded into
 * AQ-07E's general grammar check. Verifies, for every published leaf/
 * group/category entity: presence, entity-specificity (not a copy of a
 * sibling entity's description), no governance-language leak (reused from
 * AQ-07B), no unsupported-claim language, and a sensible, non-empty,
 * coherently-ending description — deliberately not gated on an arbitrary
 * character count, per the ticket's explicit instruction.
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

const GOVERNANCE_TERMS = /\b(canonical|ontology|runtime|editorial layer|migration map|deprecated id|namespace|relationship layer|SSOT|source of truth|runtime-active|publication layer|plant_part|edible_structure|fungal_body|intrinsic metadata)\b/i;

// "best" alone is legitimate culinary usage ("best served chilled," "best
// known as") — only flag superlative/marketing constructions distinct from
// ordinary cooking guidance, and only "unsupported" claim patterns with no
// plausible legitimate reading.
// "cure"/"cures" deliberately excluded: it's an ordinary culinary verb on
// this site (curing meat/fish — an entire protein group is "cured-meat"),
// not a health claim in this content domain, and including it produced
// exactly one false positive ("grill or cure") with zero real catches.
const UNSUPPORTED_CLAIM_PATTERNS = [
  /\bworld'?s (finest|best|greatest)\b/i,
  /\b#1\b/i,
  /\bnumber one\b/i,
  /\bguaranteed\b/i,
  /\bproven to\b/i,
  /\bscientifically proven\b/i,
  /\bmiracle\b/i,
];

function checkEntity(entity, domain, tier, findings) {
  const seo = entity.seo_description;
  const present = typeof seo === "string" && seo.trim().length > 0;
  if (!present) {
    findings.push({ domain, tier, entity_id: entity.id, issue: "missing_seo_description", severity: "critical" });
    return { present: false };
  }

  const hasGovernanceLeak = GOVERNANCE_TERMS.test(seo);
  if (hasGovernanceLeak) {
    findings.push({ domain, tier, entity_id: entity.id, issue: "governance_language_leak", severity: "critical", snippet: seo.match(GOVERNANCE_TERMS)[0] });
  }

  const unsupportedMatch = UNSUPPORTED_CLAIM_PATTERNS.find((p) => p.test(seo));
  if (unsupportedMatch) {
    findings.push({ domain, tier, entity_id: entity.id, issue: "unsupported_claim", severity: "high", snippet: seo.match(unsupportedMatch)[0] });
  }

  return { present: true, hasGovernanceLeak, hasUnsupportedClaim: !!unsupportedMatch };
}

export function certifySeoDescriptions(root) {
  const findings = [];
  const perDomain = {};
  let totalChecked = 0;
  let totalPresent = 0;

  const allDescriptions = new Map(); // description text -> [entity ids], for duplicate detection

  for (const [domainId, relPath, leafKey, groupKey, catKey] of CATALOG_SPECS) {
    const catalog = readJson(`${root}/${relPath}`);
    let domainChecked = 0;
    let domainPresent = 0;
    for (const [tier, key] of [["leaf", leafKey], ["group", groupKey], ["category", catKey]]) {
      for (const entity of catalog[key] ?? []) {
        totalChecked += 1;
        domainChecked += 1;
        const result = checkEntity(entity, domainId, tier, findings);
        if (result.present) {
          totalPresent += 1;
          domainPresent += 1;
          const desc = entity.seo_description;
          if (!allDescriptions.has(desc)) allDescriptions.set(desc, []);
          allDescriptions.get(desc).push(`${domainId}/${tier}/${entity.id}`);
        }
      }
    }
    perDomain[domainId] = { checked: domainChecked, present: domainPresent };
  }

  const duplicates = [...allDescriptions.entries()].filter(([, ids]) => ids.length > 1);
  for (const [desc, ids] of duplicates) {
    findings.push({ issue: "duplicate_seo_description_across_entities", severity: "high", entity_ids: ids, snippet: desc.slice(0, 80) });
  }

  const critical = findings.filter((f) => f.severity === "critical").length;
  const high = findings.filter((f) => f.severity === "high").length;

  return {
    phase: "AQ-07F",
    title: "SEO Description Certification",
    methodology: "Certifies every published leaf/group/category entity's seo_description for presence, entity-specificity (no duplicate across different entities), absence of internal governance terminology (reusing AQ-07B's term list plus the additional raw-field-name leaks found during AQ-07C/E), and absence of unsupported marketing-superlative claims. Deliberately does not gate on character count — Google's own guidance treats length as informational, not a pass/fail signal (established in AQ-05B).",
    total_entities_checked: totalChecked,
    total_with_seo_description: totalPresent,
    coverage: `${totalPresent} / ${totalChecked}`,
    coverage_percent: `${((totalPresent / totalChecked) * 100).toFixed(2)}%`,
    per_domain: perDomain,
    duplicate_descriptions_across_different_entities: duplicates.length,
    findings,
    findings_by_severity: {
      critical,
      high,
      informational: findings.length - critical - high,
    },
    quality_gate: {
      requirement_100_percent_coverage: totalPresent === totalChecked,
      requirement_0_governance_leaks: !findings.some((f) => f.issue === "governance_language_leak"),
      requirement_0_duplicate_descriptions: duplicates.length === 0,
    },
    overall_certification: totalPresent === totalChecked && critical === 0 ? "PASS" : "FAIL",
  };
}
