import fs from "fs";
import path from "path";
import { readJson } from "./utils.js";

const EMPTY_EDITORIAL = Object.freeze({
  meta: { layer: "editorial", edge_count: 0 },
  edges: [],
});

const EMPTY_WINE_PAIRING = Object.freeze({
  meta: { layer: "wine_pairing", edge_count: 0 },
  edges: [],
});

function readJsonIfExists(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return readJson(filePath);
}

export function loadDomainInputs(domain) {
  const catalog = readJson(domain.paths.catalog);
  const leaves = catalog[domain.catalogKeys.leaf];
  const groups = catalog[domain.catalogKeys.groups];
  const categories = catalog[domain.catalogKeys.categories];

  let structural;
  let editorial;
  let pairing;
  let runtimeGroups;
  let runtimeCategories;
  let index = null;

  const consolidatedRuntimeLayouts = new Set(["legume", "sweet-flavor", "sauce-condiment"]);
  if (consolidatedRuntimeLayouts.has(domain.runtimeLayout)) {
    const runtime = readJson(domain.publicationArtifacts.runtime[0]);
    runtimeGroups = runtime.groups;
    runtimeCategories = runtime.categories;
    index = runtime.indexes;
    structural = runtime.relationships;
    editorial = readJsonIfExists(
      domain.publicationArtifacts.relationships[1],
      EMPTY_EDITORIAL
    );
    pairing = readJsonIfExists(domain.publicationArtifacts.relationships[2], EMPTY_WINE_PAIRING);
  } else {
    structural = readJson(domain.publicationArtifacts.relationships[0]);
    editorial = readJson(domain.publicationArtifacts.relationships[1]);
    pairing = readJson(domain.publicationArtifacts.relationships[2]);
  }

  if (domain.runtimeLayout === "protein") {
    index = readJson(path.join(domain.root, "data/runtime/protein-food-index.json"));
    runtimeGroups = readJson(path.join(domain.root, "data/runtime/protein-food-groups.json"));
    runtimeCategories = readJson(
      path.join(domain.root, "data/runtime/protein-food-categories.json")
    );
  } else if (!consolidatedRuntimeLayouts.has(domain.runtimeLayout)) {
    const groupsFile = domain.publicationArtifacts.runtime.find((filePath) =>
      filePath.endsWith("-groups.json")
    );
    const categoriesFile = domain.publicationArtifacts.runtime.find((filePath) =>
      filePath.endsWith("-categories.json")
    );
    if (!groupsFile || !categoriesFile) {
      throw new Error(`Runtime group/category artifacts missing for domain: ${domain.id}`);
    }
    runtimeGroups = readJson(groupsFile);
    runtimeCategories = readJson(categoriesFile);
  }

  return {
    catalog,
    leaves,
    groups,
    categories,
    index,
    runtimeGroups,
    runtimeCategories,
    structural,
    editorial,
    pairing,
  };
}
