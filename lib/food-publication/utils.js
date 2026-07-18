import fs from "fs";
import path from "path";

export function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeysDeep(value[key]);
        return acc;
      }, {});
  }
  return value;
}

export function writeJson(filePath, data) {
  const text = `${JSON.stringify(sortKeysDeep(data), null, 2)}\n`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text, "utf8");
  return text;
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function entityDisplayName(entity, field) {
  return entity[field] ?? entity.name ?? entity.display_name ?? "";
}

export function entityRef(entity, displayField) {
  return {
    id: entity.id,
    slug: entity.slug,
    name: entityDisplayName(entity, displayField),
  };
}

export function leafUrl(domain, slug) {
  return `${domain.urls.leafPrefix}${slug}/`;
}

export function groupUrl(domain, slug) {
  return `${domain.urls.groupPrefix}${slug}/`;
}

export function categoryUrl(domain, slug) {
  return `${domain.urls.categoryPrefix}${slug}/`;
}

export function relative(root, filePath) {
  return path.relative(root, filePath);
}
