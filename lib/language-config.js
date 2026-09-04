/**
 * LANG-01 — Declarative language + regional-vocabulary-profile registry.
 *
 * Mirrors lib/food-domain-config.js's pattern deliberately: one frozen
 * registry object, id-keyed, accessed through getXConfig()/listXIds()
 * helpers — no parallel architecture invented for language.
 *
 * ARCHITECTURE, NOT PUBLICATION. This module declares what languages and
 * Spanish regional vocabulary profiles exist and how they relate to each
 * other. It does not generate pages, does not populate translations, and
 * is not consumed by any publication script yet. See
 * docs/LANGUAGE_GOVERNANCE.md for the full normative rules this registry
 * implements.
 */

const LANGUAGES = Object.freeze({
  en: Object.freeze({
    id: "en",
    label: "English",
    isDefault: true,
    published: true,
    urlPrefix: "", // English is unprefixed — the existing root-level publication.
    hasRegionalProfiles: false,
    regionalProfiles: Object.freeze({}),
  }),
  es: Object.freeze({
    id: "es",
    label: "Spanish",
    isDefault: false,
    // Not yet published — LANG-01 is architecture/governance only. No /es/
    // page may be generated while this is false (see
    // scripts/verify-language-governance-lang01.mjs, which asserts this).
    published: false,
    urlPrefix: "/es",
    hasRegionalProfiles: true,
    // Exactly five profiles, per LANG-01's Director Decision. Adding a
    // sixth (or a country-specific *publication*, which is a different,
    // forbidden concept — see docs/LANGUAGE_GOVERNANCE.md §18) requires a
    // governance update, not a silent data addition.
    regionalProfiles: Object.freeze({
      neutral: Object.freeze({
        id: "neutral",
        label: "Neutral Spanish",
        description: "General Spanish fallback vocabulary — the terminus of the regional fallback chain.",
        isFallbackRoot: true,
      }),
      mx: Object.freeze({
        id: "mx",
        label: "Mexico",
        description: "Mexican Spanish vocabulary profile.",
        isFallbackRoot: false,
      }),
      es: Object.freeze({
        id: "es",
        label: "Spain",
        description: "Spain Spanish vocabulary profile.",
        isFallbackRoot: false,
      }),
      cl: Object.freeze({
        id: "cl",
        label: "Chile",
        description: "Chilean Spanish vocabulary profile.",
        isFallbackRoot: false,
      }),
      ca: Object.freeze({
        id: "ca",
        label: "Central America",
        // Explicit disambiguation per the Director Decision: this is NOT
        // an ISO country/region code and must never be read as Canada.
        // It exists only inside the Spanish regional-profile namespace,
        // which has no relationship to ISO 3166.
        description: "Central American Spanish vocabulary profile. NOT Canada — see docs/LANGUAGE_GOVERNANCE.md §5.",
        isFallbackRoot: false,
      }),
    }),
  }),
});

export function getLanguageConfig(languageId) {
  const language = LANGUAGES[languageId];
  if (!language) {
    throw new Error(`Unknown language: ${languageId}`);
  }
  return language;
}

export function listLanguageIds() {
  return Object.keys(LANGUAGES);
}

export function listPublishedLanguageIds() {
  return Object.entries(LANGUAGES)
    .filter(([, lang]) => lang.published)
    .map(([id]) => id);
}

export function getDefaultLanguageId() {
  const entry = Object.values(LANGUAGES).find((lang) => lang.isDefault);
  if (!entry) {
    throw new Error("No default language configured");
  }
  return entry.id;
}

export function listRegionalProfileIds(languageId) {
  const language = getLanguageConfig(languageId);
  return Object.keys(language.regionalProfiles);
}

export function getRegionalProfile(languageId, profileId) {
  const language = getLanguageConfig(languageId);
  const profile = language.regionalProfiles[profileId];
  if (!profile) {
    throw new Error(`Unknown regional profile "${profileId}" for language "${languageId}"`);
  }
  return profile;
}

/**
 * The fallback root for a language's regional vocabulary — the profile a
 * regional lookup ultimately resolves to when no more specific override
 * exists. See docs/LANGUAGE_GOVERNANCE.md §10 (Fallback Rules).
 */
export function getFallbackRootProfileId(languageId) {
  const language = getLanguageConfig(languageId);
  const root = Object.values(language.regionalProfiles).find((p) => p.isFallbackRoot);
  return root ? root.id : null;
}
