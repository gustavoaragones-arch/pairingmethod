/**
 * ONTOLOGY-03D — Navigation link builders for protein food ontology.
 */

export function makeLink({ id, title, href, relationship }) {
  return {
    id,
    title,
    href,
    relationship,
    source: "ontology",
  };
}

export function sortLinks(links) {
  return [...links].sort((a, b) => {
    const titleCmp = a.title.localeCompare(b.title);
    if (titleCmp !== 0) return titleCmp;
    return a.id.localeCompare(b.id);
  });
}

export function dedupeLinks(links) {
  const seen = new Set();
  const out = [];
  for (const link of links) {
    const key = `${link.relationship}\t${link.href}\t${link.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(link);
  }
  return out;
}

export function isResolvableHref(href, registry) {
  if (!href) return false;
  if (href.startsWith("preparation.")) return true;
  if (registry.validHrefs.has(href)) return true;
  if (href.startsWith("/styles/") || href.startsWith("/terms/") || href.startsWith("/techniques/")) {
    return true;
  }
  return false;
}

export function preparationTitle(target) {
  return target.replace(/^preparation\./, "").replace(/-/g, " ");
}
