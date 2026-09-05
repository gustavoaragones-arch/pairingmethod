/**
 * PAIRING-EAT-06 — Deterministic fungi "Why These Wines Work" renderer.
 *
 * Derives user-facing pairing explanation from authoritative relationship edges in
 * data/runtime/fungi-wine-relationships.json. Does not modify relationship semantics.
 *
 * Fields used per edge:
 * - source (entity id)
 * - target (wine style slug, descriptor slug, or technique slug)
 * - relationship (pairs_with_style | also_pairs_with_style | pairs_with_descriptor | pairs_with_technique)
 * - evidence (editorial pairing rationale tied to the edge)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { escapeHtml, renderNarrativeSection } from "./taxonomy-render.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const WINE_RELATIONSHIPS_PATH = path.join(ROOT, "data/runtime/fungi-wine-relationships.json");

const RELATIONSHIP_PRIORITY = Object.freeze({
  pairs_with_style: 0,
  also_pairs_with_style: 1,
  pairs_with_descriptor: 2,
  pairs_with_technique: 3,
});

/** Controlled openers — each maps to a real relationship type attribute. */
const RELATIONSHIP_OPENER = Object.freeze({
  pairs_with_style: (wineLabelHtml, entityNameHtml) =>
    `${wineLabelHtml} is recommended for ${entityNameHtml} because`,
  also_pairs_with_style: (wineLabelHtml, entityNameHtml) =>
    `${wineLabelHtml} also pairs well with ${entityNameHtml} because`,
  pairs_with_descriptor: (descriptorHtml, entityNameHtml) =>
    `Wines with ${descriptorHtml} character complement ${entityNameHtml} because`,
  pairs_with_technique: (techniqueHtml, entityNameHtml) =>
    `${techniqueHtml} in complementary wines supports pairing with ${entityNameHtml} because`,
});

let cachedEdgesBySource = null;

function loadEdgesBySource() {
  if (cachedEdgesBySource) return cachedEdgesBySource;
  const { edges } = JSON.parse(fs.readFileSync(WINE_RELATIONSHIPS_PATH, "utf8"));
  cachedEdgesBySource = new Map();
  for (const edge of edges) {
    if (!cachedEdgesBySource.has(edge.source)) {
      cachedEdgesBySource.set(edge.source, []);
    }
    cachedEdgesBySource.get(edge.source).push(edge);
  }
  return cachedEdgesBySource;
}

function titleCase(text) {
  return String(text)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function slugToLabel(slug) {
  return titleCase(String(slug).replace(/-/g, " "));
}

function lowercaseFirst(text) {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function edgeKey(edge) {
  return `${edge.source}|${edge.relationship}|${edge.target}`;
}

function buildNavLinkLookup(linkSet) {
  const byTarget = new Map();
  const sections = linkSet?.sections ?? {};
  for (const links of Object.values(sections)) {
    if (!Array.isArray(links)) continue;
    for (const link of links) {
      if (link.id) byTarget.set(link.id, link);
      if (typeof link.href === "string" && link.href.startsWith("/styles/")) {
        const slug = link.href.replace(/^\/styles\//, "").replace(/\/$/, "");
        byTarget.set(slug, link);
      }
    }
  }
  return byTarget;
}

function wineLinkHtml(link, targetSlug) {
  const label = titleCase(link?.title ?? slugToLabel(targetSlug));
  if (link?.href?.startsWith("/styles/")) {
    return `<a href="${escapeHtml(link.href)}">${escapeHtml(label)}</a>`;
  }
  return escapeHtml(label);
}

function normalizeSentence(text) {
  const trimmed = String(text).trim();
  if (!trimmed) return "";
  return trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
}

function evidenceIsStandaloneSentence(evidence, entityName, targetSlug, link) {
  const lower = evidence.toLowerCase();
  const entityToken = entityName.split(/\s+/)[0]?.toLowerCase();
  const wineLabel = (link?.title ?? targetSlug.replace(/-/g, " ")).toLowerCase();
  const wineTokens = wineLabel.split(/\s+/).filter((token) => token.length > 3);
  const mentionsEntity = Boolean(entityToken && lower.includes(entityToken));
  const mentionsWine =
    wineTokens.some((token) => lower.includes(token)) ||
    lower.includes("wine") ||
    lower.includes("rosé") ||
    lower.includes("rose") ||
    lower.includes("champagne");
  return mentionsEntity && mentionsWine;
}

function renderReasonParagraph(edge, entityName, linkLookup) {
  const evidence = edge.evidence?.trim();
  if (!evidence) return null;

  const target = edge.target;
  const link = linkLookup.get(target);
  const relationship = edge.relationship;
  const attrs = `class="fungi-pairing-reason no-term-link" data-relationship="${escapeHtml(relationship)}" data-source="${escapeHtml(edge.source)}" data-target="${escapeHtml(target)}"`;

  if (relationship === "pairs_with_style" || relationship === "also_pairs_with_style") {
    const wineLink = wineLinkHtml(link, target);
    if (evidenceIsStandaloneSentence(evidence, entityName, target, link)) {
      return `<p ${attrs}>${wineLink} — ${escapeHtml(normalizeSentence(evidence))}</p>`;
    }
    const opener = RELATIONSHIP_OPENER[relationship]?.(
      wineLink,
      escapeHtml(entityName)
    );
    if (!opener) return null;
    const reason = lowercaseFirst(evidence.replace(/\.$/, ""));
    return `<p ${attrs}>${opener} ${escapeHtml(reason)}.</p>`;
  }

  if (relationship === "pairs_with_descriptor") {
    const descriptor = slugToLabel(target);
    if (evidenceIsStandaloneSentence(evidence, entityName, target, link)) {
      return `<p ${attrs}>${escapeHtml(descriptor)} — ${escapeHtml(normalizeSentence(evidence))}</p>`;
    }
    const opener = RELATIONSHIP_OPENER.pairs_with_descriptor(
      escapeHtml(descriptor),
      escapeHtml(entityName)
    );
    const reason = lowercaseFirst(evidence.replace(/\.$/, ""));
    return `<p ${attrs}>${opener} ${escapeHtml(reason)}.</p>`;
  }

  if (relationship === "pairs_with_technique") {
    const technique = slugToLabel(target);
    const opener = RELATIONSHIP_OPENER.pairs_with_technique(
      escapeHtml(technique),
      escapeHtml(entityName)
    );
    const reason = lowercaseFirst(evidence.replace(/\.$/, ""));
    return `<p ${attrs}>${opener} ${escapeHtml(reason)}.</p>`;
  }

  return null;
}

export function getFungiWineRelationshipsForEntity(entityId) {
  return [...(loadEdgesBySource().get(entityId) ?? [])].sort((a, b) => {
    const pa = RELATIONSHIP_PRIORITY[a.relationship] ?? 99;
    const pb = RELATIONSHIP_PRIORITY[b.relationship] ?? 99;
    if (pa !== pb) return pa - pb;
    return a.target.localeCompare(b.target);
  });
}

export function renderWhyTheseWinesWork(entityId, entityName, linkSet, opts = {}) {
  const maxReasons = opts.maxReasons ?? 3;
  const edges = getFungiWineRelationshipsForEntity(entityId);
  if (!edges.length) return "";

  const linkLookup = buildNavLinkLookup(linkSet);
  const paragraphs = [];
  const seen = new Set();

  for (const edge of edges) {
    if (paragraphs.length >= maxReasons) break;
    const key = edgeKey(edge);
    if (seen.has(key)) continue;
    seen.add(key);
    const paragraph = renderReasonParagraph(edge, entityName, linkLookup);
    if (paragraph) paragraphs.push(paragraph);
  }

  if (!paragraphs.length) return "";

  return renderNarrativeSection(
    "why-these-wines-work",
    "Why These Wines Work",
    paragraphs.join("\n"),
    "narrative-why-these-wines fungi-why-these-wines"
  );
}

export function buildWhyTheseWinesWorkRecords(entityId, entityName, linkSet, opts = {}) {
  const maxReasons = opts.maxReasons ?? 3;
  const edges = getFungiWineRelationshipsForEntity(entityId).slice(0, maxReasons);
  const linkLookup = buildNavLinkLookup(linkSet);
  return edges.map((edge) => ({
    relationship: edge.relationship,
    source: edge.source,
    target: edge.target,
    evidence: edge.evidence,
    html: renderReasonParagraph(edge, entityName, linkLookup),
  }));
}
