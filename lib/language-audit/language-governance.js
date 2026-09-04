/**
 * LANG-01 / LANG-01A — Language & Regional Vocabulary Governance Verification.
 *
 * Proves the properties LANG-01's ticket requires, against the actual
 * registry/schema/repository state — not by asserting the architecture is
 * correct, by checking it. Read-only: this module never writes to the
 * ontology, runtime, publication output, or sitemap.
 *
 * LANG-01A hardening: V6 is now a genuinely recursive repository-tree
 * scan (was top-level only); V8 and V11 detect a broad, deterministic set
 * of regional/language-branching patterns (equality on region/profile
 * against all 5 profile ids, switch/case, hardcoded five-key vocabulary
 * maps) instead of one narrow regex each; V3/V7/V14 have corrected,
 * non-overclaiming descriptions matching exactly what each check does and
 * does not prove. No approved architecture value changed — only detection
 * rigor and reporting precision.
 */

import fs from "fs";
import path from "path";
import {
  listLanguageIds,
  listPublishedLanguageIds,
  getDefaultLanguageId,
  getLanguageConfig,
  listRegionalProfileIds,
  getFallbackRootProfileId,
} from "../language-config.js";

const REQUIRED_SPANISH_PROFILES = ["neutral", "mx", "es", "cl", "ca"];

// Files that implement or document this detection logic itself. They
// legitimately contain the literal patterns being searched for (as regex
// source, as comments, as the approved registry's own keys) and would
// false-positive against themselves if scanned. Excluding them is not a
// loophole for application code — no renderer, script, or engine file is
// on this list, only the governance-verification tooling and the one
// registry file the rules explicitly bless.
const SELF_REFERENTIAL_FILES = [
  "lib/language-config.js", // the approved registry — legitimately holds all 5 profile ids as object keys
  "lib/language-audit/language-governance.js", // this file
  "scripts/verify-language-governance-lang01.mjs",
  "lib/language-audit/spanish-vocabulary-lang02.js", // LANG-02's own governance-verification tooling — same class of exclusion, not application code
  "scripts/verify-spanish-vocabulary-lang02.mjs",
];

function isSelfReferential(root, filePath) {
  const rel = path.relative(root, filePath);
  return SELF_REFERENTIAL_FILES.includes(rel);
}

function checkEnglishIsDefault() {
  const defaultId = getDefaultLanguageId();
  return {
    id: "V1_english_default",
    description: "English remains the default publication.",
    pass: defaultId === "en",
    evidence: { defaultLanguageId: defaultId },
  };
}

function checkSpanishRegistered() {
  const ids = listLanguageIds();
  return {
    id: "V2_spanish_registered",
    description: "Spanish is registered as a supported language.",
    pass: ids.includes("es"),
    evidence: { registeredLanguageIds: ids },
  };
}

function checkExactlyOneSpanishPublicationDefinition() {
  const es = getLanguageConfig("es");
  const correctPrefix = es.urlPrefix === "/es";
  const notPublished = es.published === false;
  // No sibling "es-XX"-style entry exists anywhere in the top-level
  // language registry itself (as opposed to on disk, which V6 covers).
  const noSiblingCountryEntries = !listLanguageIds().some((id) => id !== "es" && /^es-[a-z]{2,}$/.test(id));
  const pass = correctPrefix && notPublished && noSiblingCountryEntries;
  return {
    id: "V3_exactly_one_spanish_publication_definition",
    description:
      "Exactly one Spanish publication DEFINITION exists in the registry (urlPrefix \"/es\") and it is currently UNPUBLISHED — this check certifies the registry's declared state, not generated output (V12/V13 certify output separately).",
    pass,
    evidence: { esUrlPrefix: es.urlPrefix, esPublished: es.published, noSiblingCountryEntries },
  };
}

function checkFiveRegionalProfiles() {
  const profiles = listRegionalProfileIds("es").sort();
  const expected = [...REQUIRED_SPANISH_PROFILES].sort();
  const pass = JSON.stringify(profiles) === JSON.stringify(expected);
  return {
    id: "V4_five_regional_profiles",
    description: "Exactly five Spanish vocabulary profiles exist: neutral, mx, es, cl, ca.",
    pass,
    evidence: { profiles },
  };
}

function checkNoCountrySpecificPublicationRegistered() {
  const es = getLanguageConfig("es");
  const profileIds = Object.keys(es.regionalProfiles);
  // Regional profiles must never carry their own urlPrefix/publication-like
  // field — they are vocabulary metadata only (label/description/isFallbackRoot).
  const allowedKeys = new Set(["id", "label", "description", "isFallbackRoot"]);
  const offenders = [];
  for (const id of profileIds) {
    const profile = es.regionalProfiles[id];
    for (const key of Object.keys(profile)) {
      if (!allowedKeys.has(key)) offenders.push({ profile: id, unexpectedField: key });
    }
  }
  return {
    id: "V5_no_country_specific_publication",
    description: "No regional profile carries publication-like fields (url prefix, sitemap, canonical, etc.) — profiles are vocabulary metadata only.",
    pass: offenders.length === 0,
    evidence: { offenders },
  };
}

// The only directory excluded from the recursive V6 walk. VCS internals —
// not repository content, cannot contain a publication directory in any
// meaningful sense, and is large enough (git object storage) that walking
// it would slow the check for zero evidentiary value. Every other
// directory in the tree, including dist/, reports/, and dotfile
// directories like .claude/, IS scanned — a stray es-XX directory
// anywhere among generated output would be exactly the kind of drift this
// check exists to catch.
const V6_EXCLUDED_DIRS = new Set([".git"]);
const COUNTRY_DIR_PATTERN = /^es-[a-z]{2,}$/;

function walkRecursive(dir, onDir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // unreadable directory (permissions, broken symlink) — not this check's concern
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (V6_EXCLUDED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    onDir(full, entry.name);
    walkRecursive(full, onDir);
  }
}

function checkNoSpanishCountryUrlNamespace(root) {
  // Genuinely recursive: walks the entire repository tree (minus .git),
  // not just top-level directories, looking for any /es-XX/-style
  // directory at any depth. The forbidden pattern is intentionally not
  // limited to a fixed example list (es-mx, es-cl, ...) — any directory
  // name matching es-<2+ lowercase letters> is flagged, and the legitimate
  // "es" namespace itself (no suffix) is never matched by this pattern.
  const offenders = [];
  let directoriesScanned = 0;
  walkRecursive(root, (fullPath, name) => {
    directoriesScanned += 1;
    if (COUNTRY_DIR_PATTERN.test(name)) {
      offenders.push({ type: "directory", path: path.relative(root, fullPath) });
    }
  });

  return {
    id: "V6_no_spanish_country_url_namespace",
    description: "No /es-XX/ country-specific URL namespace directory exists anywhere in the repository tree (recursive scan, not limited to top level).",
    pass: offenders.length === 0,
    evidence: {
      offenders,
      directoriesScanned,
      excludedDirectories: [...V6_EXCLUDED_DIRS],
      exclusionJustification: ".git is VCS storage, not repository content, and cannot hold a publication directory.",
    },
  };
}

// Catalog files LANG-02+ population research is allowed to draw entity_ids
// from. Kept in sync with lib/language-audit/spanish-vocabulary-lang02.js's
// own ONTOLOGY_FILES list (that module owns the authoritative, ordered
// version used for deterministic-ordering checks; this one only needs the
// unordered id set for existence cross-reference).
const VOCAB_ONTOLOGY_FILES = [
  "data/grape-catalog.json",
  "data/wine-style-catalog.json",
  "data/wine-region-catalog.json",
  "data/wine-fault-catalog.json",
  "data/wine-serving-catalog.json",
  "data/winemaking-technique-catalog.json",
  "data/wine-taxonomy.json",
  "data/protein-food-catalog.json",
  "data/cheese-catalog.json",
  "data/fruit-catalog.json",
  "data/vegetable-catalog.json",
  "data/grain-starch-catalog.json",
  "data/legume-catalog.json",
  "data/nut-seed-catalog.json",
  "data/herb-spice-catalog.json",
  "data/sweet-flavor-catalog.json",
  "data/sauce-condiment-catalog.json",
  "data/fungi-catalog.json",
];

function collectAllCatalogIds(root) {
  const ids = new Set();
  for (const rel of VOCAB_ONTOLOGY_FILES) {
    const full = path.join(root, rel);
    if (!fs.existsSync(full)) continue;
    const doc = JSON.parse(fs.readFileSync(full, "utf8"));
    const walk = (o) => {
      if (o && typeof o === "object") {
        if (!Array.isArray(o) && typeof o.id === "string") ids.add(o.id);
        for (const v of Object.values(o)) walk(v);
      }
    };
    walk(doc);
  }
  return ids;
}

function checkEntityIdentityLanguageIndependent(root) {
  // Two genuinely distinct validations live here, reported separately so
  // neither is mistaken for the other:
  //   (a) schema contract validation — does the DECLARED CONTRACT require
  //       entity_id to reference an existing ontology id? This is checkable
  //       right now regardless of how many entries exist.
  //   (b) populated-entry validation — does every ACTUAL entry's entity_id
  //       resolve to a real catalog record? Deferred while LANG-01 was
  //       schema-only (entries: []); now that LANG-02 has populated real
  //       entries, this performs the live cross-reference it always said
  //       a future phase would need to.
  const vocabPath = path.join(root, "data", "spanish-vocabulary.json");
  const vocab = JSON.parse(fs.readFileSync(vocabPath, "utf8"));
  const contract = vocab.schema?.entry_contract?.field_contracts?.entity_id;
  const schemaContractValid = Boolean(contract && /existing/i.test(contract.description));
  const entriesCount = vocab.entries.length;

  let populationValidationStatus = "deferred_schema_only";
  let missingEntityIds = [];
  let populationValid = true;

  if (entriesCount > 0) {
    const canonicalIds = collectAllCatalogIds(root);
    missingEntityIds = [...new Set(vocab.entries.filter((e) => !canonicalIds.has(e.entity_id)).map((e) => e.entity_id))];
    populationValid = missingEntityIds.length === 0;
    populationValidationStatus = populationValid ? "live_cross_reference_passed" : "live_cross_reference_failed";
  }

  return {
    id: "V7_entity_identity_language_independent",
    description:
      "Schema contract requires entity_id to reference an existing ontology id (checked now). When entries exist, every one is cross-referenced live against the actual catalog files — no populated entry is allowed to reference a nonexistent id.",
    pass: schemaContractValid && (entriesCount === 0 || populationValid),
    evidence: {
      schema_contract_valid: schemaContractValid,
      entries_count: entriesCount,
      population_validation_status: populationValidationStatus,
      missing_entity_ids: missingEntityIds,
    },
  };
}

const REGIONAL_PROFILE_IDS = ["mx", "es", "cl", "ca", "neutral"];
const REGIONAL_PROFILE_ID_ALTERNATION = REGIONAL_PROFILE_IDS.join("|");

/**
 * Deterministic, readable source-inspection rules for hardcoded regional-
 * vocabulary branching — deliberately not a JS parser (per the ticket's
 * explicit instruction), so this is a set of targeted regexes, each named
 * so a match is self-explanatory in evidence output, not a single
 * catch-all pattern.
 */
const REGIONAL_BRANCHING_PATTERNS = [
  { name: "region_strict_equality", regex: new RegExp(`\\bregion\\s*===\\s*["'](?:${REGIONAL_PROFILE_ID_ALTERNATION})["']`) },
  { name: "region_loose_equality", regex: new RegExp(`\\bregion\\s*==\\s*["'](?:${REGIONAL_PROFILE_ID_ALTERNATION})["']`) },
  { name: "profile_strict_equality", regex: new RegExp(`\\bprofile\\s*===\\s*["'](?:${REGIONAL_PROFILE_ID_ALTERNATION})["']`) },
  { name: "profile_loose_equality", regex: new RegExp(`\\bprofile\\s*==\\s*["'](?:${REGIONAL_PROFILE_ID_ALTERNATION})["']`) },
  { name: "switch_case_on_profile_id", regex: new RegExp(`\\bcase\\s*["'](?:${REGIONAL_PROFILE_ID_ALTERNATION})["']\\s*:`) },
];

/**
 * A hardcoded lookup object keyed by all five regional-profile ids (e.g.
 * `{ neutral: ..., mx: ..., es: ..., cl: ..., ca: ... }`) is a strong,
 * low-false-positive signal of "someone built a regional-vocabulary map in
 * application code" — the only place that shape is legitimate is the
 * approved registry itself (lib/language-config.js), which is excluded
 * from this scan via SELF_REFERENTIAL_FILES, not via a weaker pattern.
 */
function hasHardcodedFiveProfileKeyMap(content) {
  return REGIONAL_PROFILE_IDS.every((id) => new RegExp(`\\b${id}\\s*:`).test(content));
}

function scanFilesForPatterns(root, dirs, patterns, { includeFiveKeyMapCheck = false } = {}) {
  const offenders = [];
  let filesScanned = 0;
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(js|mjs)$/.test(entry.name)) {
        if (isSelfReferential(root, full)) continue;
        filesScanned += 1;
        const content = fs.readFileSync(full, "utf8");
        const relPath = path.relative(root, full);
        for (const p of patterns) {
          if (p.regex.test(content)) offenders.push({ file: relPath, pattern: p.name });
        }
        if (includeFiveKeyMapCheck && hasHardcodedFiveProfileKeyMap(content)) {
          offenders.push({ file: relPath, pattern: "hardcoded_five_profile_key_map" });
        }
      }
    }
  };
  for (const d of dirs) walk(path.join(root, d));
  return { offenders, filesScanned };
}

function checkVocabularyIsDataDriven(root) {
  const searchDirs = ["lib", "scripts", "assets/js"];
  const { offenders, filesScanned } = scanFilesForPatterns(root, searchDirs, REGIONAL_BRANCHING_PATTERNS, {
    includeFiveKeyMapCheck: true,
  });
  return {
    id: "V8_vocabulary_data_driven",
    description:
      "No source file in lib/, scripts/, or assets/js/ hardcodes regional-vocabulary branching — strict/loose equality on region or profile against any of the 5 approved profile ids, switch/case on a profile id, or a hardcoded object literal keyed by all 5 profile ids (a de-facto vocabulary map in code). lib/language-config.js (the approved registry) and this verification tooling are excluded — see SELF_REFERENTIAL_FILES.",
    pass: offenders.length === 0,
    evidence: { offenders, filesScanned, patternsChecked: REGIONAL_BRANCHING_PATTERNS.map((p) => p.name).concat(["hardcoded_five_profile_key_map"]) },
  };
}

function checkPreferredVsAliasDistinct() {
  const contractPath = path.join(process.cwd(), "data", "spanish-vocabulary.json");
  const vocab = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  const fields = vocab.schema?.entry_contract?.field_contracts ?? {};
  const pass = Boolean(fields.preferred && fields.aliases && fields.preferred.type === "string" && fields.aliases.type === "array");
  return {
    id: "V9_preferred_vs_alias_distinct",
    description: "Preferred term (single string) and aliases (array) are declared as distinct field types in the schema.",
    pass,
    evidence: { preferredType: fields.preferred?.type, aliasesType: fields.aliases?.type },
  };
}

function checkRegionalFallbackResolvesToNeutral() {
  const rootProfileId = getFallbackRootProfileId("es");
  return {
    id: "V10_fallback_resolves_to_neutral",
    description: "The regional fallback chain's root profile is \"neutral\".",
    pass: rootProfileId === "neutral",
    evidence: { fallbackRootProfileId: rootProfileId },
  };
}

const ENGINE_LANGUAGE_SELECTION_PATTERNS = [
  { name: "language_strict_equality_es", regex: /\blanguage\s*===\s*["']es["']/ },
  { name: "language_loose_equality_es", regex: /\blanguage\s*==\s*["']es["']/ },
  { name: "lang_strict_equality_es", regex: /\blang\s*===\s*["']es["']/ },
  { name: "lang_loose_equality_es", regex: /\blang\s*==\s*["']es["']/ },
  { name: "locale_strict_equality_es", regex: /\blocale\s*===\s*["']es["']/ },
  { name: "locale_loose_equality_es", regex: /\blocale\s*==\s*["']es["']/ },
];

// Kept as one additional signal, not the sole mechanism (per FIX 3): a
// literal Spanish word appearing as a quoted string value is a plausible
// sign vocabulary leaked into the engine as a machine value (entity id,
// status, scoring key) rather than living in the localization layer where
// it belongs. Intentionally small — this is a smoke test, not the
// architectural guarantee; the structural checks above and the shared
// REGIONAL_BRANCHING_PATTERNS scan are what actually prove the invariant.
const SPANISH_VOCABULARY_SMOKE_TEST = /["'](maridaje|vino|comida|carne|pescado)["']/i;

function checkPairingEngineLanguageNeutral(root) {
  const engineFiles = [
    "assets/js/pairing-engine.js",
    "assets/js/pairing-data.js",
    "assets/js/engine.js",
    "assets/js/matrix-view.js",
  ];
  const offenders = [];
  let filesChecked = 0;

  for (const relPath of engineFiles) {
    const full = path.join(root, relPath);
    if (!fs.existsSync(full)) continue;
    filesChecked += 1;
    const content = fs.readFileSync(full, "utf8");

    // 1. Spanish localization strings used as machine/entity values (smoke test, additional signal)
    if (SPANISH_VOCABULARY_SMOKE_TEST.test(content)) {
      offenders.push({ file: relPath, pattern: "spanish_vocabulary_literal_smoke_test" });
    }
    // 2 & 3. Language-selection / regional-profile branching (structural, deterministic)
    for (const p of ENGINE_LANGUAGE_SELECTION_PATTERNS) {
      if (p.regex.test(content)) offenders.push({ file: relPath, pattern: p.name });
    }
    for (const p of REGIONAL_BRANCHING_PATTERNS) {
      if (p.regex.test(content)) offenders.push({ file: relPath, pattern: p.name });
    }
    if (hasHardcodedFiveProfileKeyMap(content)) {
      offenders.push({ file: relPath, pattern: "hardcoded_five_profile_key_map" });
    }
  }

  return {
    id: "V11_pairing_engine_language_neutral",
    description:
      "The pairing engine (pairing-engine.js, pairing-data.js, engine.js, matrix-view.js) contains no Spanish localization strings used as machine values, no language-selection branching (language/lang/locale compared against \"es\"), and no regional-profile branching (the same structural patterns V8 checks for application code generally, applied specifically here). The Spanish-word check is one additional signal, not the sole mechanism.",
    pass: offenders.length === 0,
    evidence: { filesChecked, offenders },
  };
}

function checkNoSpanishPagesGenerated(root) {
  const esDir = path.join(root, "es");
  const exists = fs.existsSync(esDir);
  return {
    id: "V12_no_spanish_pages_generated",
    description: "No /es/ directory exists in the published output.",
    pass: !exists,
    evidence: { esDirectoryExists: exists },
  };
}

function checkNoSpanishSitemapUrls(root) {
  const sitemapPath = path.join(root, "sitemap.xml");
  let hasEsUrls = false;
  if (fs.existsSync(sitemapPath)) {
    const content = fs.readFileSync(sitemapPath, "utf8");
    hasEsUrls = /\/es\//.test(content) || /sitemap-es/.test(content);
  }
  return {
    id: "V13_no_spanish_sitemap_urls",
    description: "sitemap.xml contains no /es/ URLs and no sitemap-es reference.",
    pass: !hasEsUrls,
    evidence: { sitemapChecked: sitemapPath, hasEsUrls },
  };
}

function checkEnglishSoleDefaultAndSolePublished() {
  // This is a REGISTRY-LEVEL invariant check only. It does NOT, and cannot,
  // prove that no English publication file was modified on disk — that
  // requires `git status`/`git diff` evidence, which the calling script
  // (scripts/verify-language-governance-lang01.mjs) provides separately
  // and explicitly, not this module (no git dependency here, by design,
  // matching every other lib/*-audit module in this repository).
  const published = listPublishedLanguageIds();
  const defaultId = getDefaultLanguageId();
  const englishIsDefault = defaultId === "en";
  const englishIsPublished = published.includes("en");
  const spanishIsNotPublished = !published.includes("es");
  const noOtherLanguagePublished = published.length === 1 && published[0] === "en";
  const pass = englishIsDefault && englishIsPublished && spanishIsNotPublished && noOtherLanguagePublished;
  return {
    id: "V14_english_sole_default_and_sole_published",
    description:
      "REGISTRY-LEVEL check only: English is the default language, English is published, Spanish is not published, and no other language is published — i.e. listPublishedLanguageIds() === [\"en\"]. This does NOT itself prove English publication files are unchanged on disk; that evidence comes from `git status`/`git diff`, reported separately by the calling script.",
    pass,
    evidence: { defaultLanguageId: defaultId, publishedLanguageIds: published, englishIsDefault, englishIsPublished, spanishIsNotPublished, noOtherLanguagePublished },
  };
}

function checkConfigurationDeterministic() {
  // Re-require the module fresh isn't meaningful in a single process import
  // cache; instead assert the registry is built from frozen literals (no
  // Math.random/Date.now/env-var branching) by source inspection.
  const src = fs.readFileSync(path.join(process.cwd(), "lib", "language-config.js"), "utf8");
  const hasNonDeterminism = /Math\.random|Date\.now|process\.env/.test(src);
  return {
    id: "V16_configuration_deterministic",
    description: "lib/language-config.js contains no non-deterministic construct.",
    pass: !hasNonDeterminism,
    evidence: { nonDeterministicConstructFound: hasNonDeterminism },
  };
}

export function runLanguageGovernanceVerification(root) {
  const checks = [
    checkEnglishIsDefault(),
    checkSpanishRegistered(),
    checkExactlyOneSpanishPublicationDefinition(),
    checkFiveRegionalProfiles(),
    checkNoCountrySpecificPublicationRegistered(),
    checkNoSpanishCountryUrlNamespace(root),
    checkEntityIdentityLanguageIndependent(root),
    checkVocabularyIsDataDriven(root),
    checkPreferredVsAliasDistinct(),
    checkRegionalFallbackResolvesToNeutral(),
    checkPairingEngineLanguageNeutral(root),
    checkNoSpanishPagesGenerated(root),
    checkNoSpanishSitemapUrls(root),
    checkEnglishSoleDefaultAndSolePublished(),
    checkConfigurationDeterministic(),
  ];

  const failed = checks.filter((c) => !c.pass);

  return {
    phase: "LANG-01A",
    title: "Language & Regional Vocabulary Governance Verification (Hardened)",
    total_checks: checks.length,
    passed: checks.length - failed.length,
    failed: failed.length,
    checks,
    note: "This module performs registry-, schema-, and repository-tree-level checks only. It has no git dependency by design (matching lib/schema-audit and lib/search-audit's established pattern). Two categories of evidence it explicitly does NOT itself provide — (a) that existing English publication files, sitemap.xml, and ontology/runtime/editorial/wine data are byte-unchanged, and (b) that no populated vocabulary entry (there are currently none) resolves to a nonexistent catalog entity — are provided by the calling script via `git status`/`git diff` and by V7's explicit population-validation-deferred status respectively.",
    overall_certification: failed.length === 0 ? "PASS" : "FAIL",
  };
}
