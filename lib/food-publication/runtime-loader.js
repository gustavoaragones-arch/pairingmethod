import fs from "fs";
import path from "path";
import { readJson } from "./utils.js";

export function loadDomainInputs(domain) {
  const catalog = readJson(domain.paths.catalog);
  const leaves = catalog[domain.catalogKeys.leaf];
  const groups = catalog[domain.catalogKeys.groups];
  const categories = catalog[domain.catalogKeys.categories];

  const structural = readJson(domain.publicationArtifacts.relationships[0]);
  const editorial = readJson(domain.publicationArtifacts.relationships[1]);
  const pairing = readJson(domain.publicationArtifacts.relationships[2]);

  let runtimeGroups;
  let runtimeCategories;
  let index = null;

  if (domain.runtimeLayout === "protein") {
    index = readJson(path.join(domain.root, "data/runtime/protein-food-index.json"));
    runtimeGroups = readJson(path.join(domain.root, "data/runtime/protein-food-groups.json"));
    runtimeCategories = readJson(
      path.join(domain.root, "data/runtime/protein-food-categories.json")
    );
  } else {
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
