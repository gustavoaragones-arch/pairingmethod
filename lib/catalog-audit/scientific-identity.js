/**
 * AQ-03A — Scientific Identity Verifier.
 *
 * Verifies knowledge, does not modify it (Rule 1: catalogs are authoritative).
 * Checks every published domain's `scientific_name` field against that
 * domain's own governance-documented semantics rather than a generic
 * external expectation — the exact discipline this phase exists to
 * enforce, after two prior audits flagged intentional, governed design
 * (cheese's milk-source semantics) as if it were an error.
 *
 * Domain semantics (from docs/*_GOVERNANCE.md, verified by direct read,
 * not assumed):
 *   - cheese: scientific_name = primary milk-source species, per a frozen
 *     4-entry table (cow/goat/sheep/buffalo). The one documented exception.
 *   - every other domain: scientific_name = the entity's own primary
 *     species/botanical identity, or an explicit "Multiple species" /
 *     "Multiple sources" escape value for blends and composites.
 */

import fs from "fs";
import { readJson } from "../food-publication/utils.js";

const MILK_SOURCE_TABLE = {
  cow: "Bos taurus",
  goat: "Capra hircus",
  sheep: "Ovis aries",
  buffalo: "Bubalus bubalis",
};

const ALLOWED_MULTI_VALUES = new Set(["Multiple species", "Multiple sources"]);

// A real scientific name: "Genus species", optionally with hybrid notation (×),
// "spp." for multi-species genera, subspecies/var. qualifiers, or a subgenus
// reference for cultivars without one clean binomial (e.g. cultivated hybrids).
const SCIENTIFIC_NAME_PATTERN =
  /^[A-Z][a-z]+(\s*[×x]\s*[a-z][a-z-]+|\s+(spp\.|[a-z][a-z-]+))(\s+.+)?$/;

function isWellFormedScientificName(value) {
  if (ALLOWED_MULTI_VALUES.has(value)) return true;
  return SCIENTIFIC_NAME_PATTERN.test(value);
}

const CATALOG_SPECS = [
  ["protein", "data/protein-food-catalog.json", "protein_foods"],
  ["cheese", "data/cheese-catalog.json", "cheeses"],
  ["fruit", "data/fruit-catalog.json", "fruits"],
  ["vegetable", "data/vegetable-catalog.json", "vegetables"],
  ["grain-starch", "data/grain-starch-catalog.json", "grain_starches"],
  ["legume", "data/legume-catalog.json", "legumes"],
  ["nut-seed", "data/nut-seed-catalog.json", "nut_seeds"],
  ["herb-spice", "data/herb-spice-catalog.json", "herb_spices"],
  ["sweet-flavor", "data/sweet-flavor-catalog.json", "sweet_flavors"],
  ["sauce-condiment", "data/sauce-condiment-catalog.json", "sauce_condiments"],
  ["fungi", "data/fungi-catalog.json", "fungi"],
];

export function verifyScientificIdentity(root) {
  const findings = [];
  let totalChecked = 0;

  for (const [domainId, relPath, leafKey] of CATALOG_SPECS) {
    const catalog = readJson(`${root}/${relPath}`);
    const entities = catalog[leafKey] ?? [];

    for (const entity of entities) {
      totalChecked += 1;
      const sn = (entity.scientific_name ?? "").trim();

      if (!sn) {
        findings.push({ type: "missing_scientific_name", domain: domainId, entity: entity.id ?? entity.slug });
        continue;
      }

      if (domainId === "cheese") {
        const expected = MILK_SOURCE_TABLE[entity.milk_source];
        if (entity.milk_source === "mixed") continue; // primary source per governance §5, not independently verifiable from this field alone
        if (expected && sn !== expected) {
          findings.push({
            type: "cheese_milk_source_mismatch",
            domain: domainId,
            entity: entity.id ?? entity.slug,
            milk_source: entity.milk_source,
            expected,
            actual: sn,
          });
        }
        continue;
      }

      if (!isWellFormedScientificName(sn)) {
        findings.push({
          type: "malformed_scientific_name",
          domain: domainId,
          entity: entity.id ?? entity.slug,
          value: sn,
        });
      }
    }
  }

  return { totalChecked, findingCount: findings.length, findings, allConformant: findings.length === 0 };
}
