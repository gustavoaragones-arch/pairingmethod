/**
 * FOOD-14C — Centralized Protein migration resolver.
 * Consumes data/protein-migration-map.json only — no duplicated ownership logic.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_MAP_PATH = path.join(__dirname, "../../data/protein-migration-map.json");

/**
 * @param {string} [root]
 * @param {string} [mapPath]
 */
export function createProteinMigrationResolver(root, mapPath = DEFAULT_MAP_PATH) {
  const resolvedMapPath = mapPath.startsWith("/") ? mapPath : path.join(root ?? process.cwd(), mapPath);
  const map = JSON.parse(fs.readFileSync(resolvedMapPath, "utf8"));

  /** @type {Map<string, object>} */
  const byLegacyId = new Map(map.migrations.map((entry) => [entry.legacy_id, entry]));
  /** @type {Map<string, object>} */
  const byLegacySlug = new Map(map.migrations.map((entry) => [entry.legacy_slug, entry]));
  /** @type {Set<string>} */
  const retainedIds = new Set(map.retained.map((entry) => entry.protein_id));

  /**
   * Resolve a Protein ID for runtime consumption.
   * Deprecated legacy IDs normalize to canonical cross-domain IDs.
   * Active and retained IDs pass through unchanged.
   */
  function resolveProteinId(id) {
    if (!id || typeof id !== "string") return id;
    if (!id.startsWith("food.protein.")) return id;

    const migration = byLegacyId.get(id);
    if (migration && migration.runtime_generate === false) {
      return migration.canonical_id;
    }
    return id;
  }

  function isDeprecatedProtein(id) {
    return byLegacyId.get(id)?.status === "deprecated";
  }

  function canonicalProteinId(id) {
    if (!id || typeof id !== "string") return id;
    const migration = byLegacyId.get(id);
    if (migration) return migration.canonical_id;
    return id;
  }

  function proteinPublicationMode(id) {
    const migration = byLegacyId.get(id);
    if (migration) return migration.publication_mode;
    if (retainedIds.has(id)) return "active";
    if (id?.startsWith("food.protein.")) return "active";
    return null;
  }

  function proteinRuntimeAllowed(id) {
    if (retainedIds.has(id)) return true;
    const migration = byLegacyId.get(id);
    if (migration) return migration.runtime_generate !== false;
    if (id?.startsWith("food.protein.")) return true;
    return false;
  }

  function resolveProteinSlug(slug) {
    const migration = byLegacySlug.get(slug);
    if (!migration) return null;
    return resolveProteinId(migration.legacy_id);
  }

  function legacyIdToCanonicalIndex() {
    return Object.fromEntries(
      map.migrations.map((entry) => [entry.legacy_id, entry.canonical_id]).sort(([a], [b]) => a.localeCompare(b))
    );
  }

  function legacySlugToCanonicalIndex() {
    return Object.fromEntries(
      map.migrations
        .map((entry) => [entry.legacy_slug, entry.canonical_id])
        .sort(([a], [b]) => a.localeCompare(b))
    );
  }

  return {
    map,
    mapPath: resolvedMapPath,
    resolveProteinId,
    isDeprecatedProtein,
    canonicalProteinId,
    proteinPublicationMode,
    proteinRuntimeAllowed,
    resolveProteinSlug,
    legacyIdToCanonicalIndex,
    legacySlugToCanonicalIndex,
    migrationCount: map.migrations.length,
    retainedCount: map.retained.length,
  };
}

export { DEFAULT_MAP_PATH };
