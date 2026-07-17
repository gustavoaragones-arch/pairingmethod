/**
 * ONTOLOGY-03E — Search token normalization for protein food indexes.
 */

export function normalizeToken(value) {
  if (value === undefined || value === null) return "";
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function collectTokens(values) {
  const tokens = new Set();
  for (const value of values) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const token = normalizeToken(item);
        if (token) tokens.add(token);
      }
      continue;
    }
    if (value && typeof value === "object") {
      for (const nested of Object.values(value)) {
        for (const token of collectTokens([nested])) tokens.add(token);
      }
      continue;
    }
    const token = normalizeToken(value);
    if (token) tokens.add(token);
  }
  return [...tokens].sort();
}

export function flattenIntrinsicValues(intrinsic) {
  const values = [];
  for (const value of Object.values(intrinsic ?? {})) {
    if (Array.isArray(value)) values.push(...value);
    else if (value !== undefined && value !== null && value !== "") values.push(value);
  }
  return values;
}

export function collectLinkIds(links) {
  return links.map((link) => link.id).sort();
}
