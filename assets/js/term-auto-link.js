/**
 * Auto-link known wine terms (max 5 per slug). Priority terms link on first occurrence site-wide in root.
 * Call rescanTermLinks(container) after dynamic HTML injection (pairing engine).
 */

import { WINE_TERMS } from "./wine-terms-data.js";

const MAX_PER_SLUG = 5;

/** First occurrence in page root — always link (SEO force). */
const PRIORITY_ORDER = [
  { slug: "tannic", re: /\btannin\b/i },
  { slug: "high-acidity", re: /\bacidity\b/i },
  { slug: "full-bodied", re: /\bbody\b/i },
  { slug: "jammy", re: /\bjammy\b/i },
  { slug: "crisp", re: /\bcrisp\b/i },
];

const SKIP_PARENT = new Set([
  "A",
  "BUTTON",
  "CODE",
  "PRE",
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
]);

/** Do not auto-wrap glossary terms in these regions (UI labels, nav, hero, engine, matrix, promos). */
const SKIP_TERM_LINK_ANCESTOR =
  "#pairing-engine-root, #matrix-root, #dynamic-content, #internal-links, .hero, .semantic-entry, .seo-block, .quick-explanation, .supporting-text, .term-grid-section, .popular-pairings, .new-pairings, .recent-updates, .explore-pairings-cta, .mini-disclaimer, .crawl-hint, header, nav, footer, .site-footer, .breadcrumb, .quick-learn, .direct-answer, .query-match";

/** @type {Map<string, number>} */
const counts = new Map();

/** Slugs already linked via priority pass (first occurrence sitewide). */
const priorityDone = new Set();

function buildPhrases() {
  /** @type {{ phrase: string, slug: string, re: RegExp }[]} */
  const out = [];
  for (const [slug, d] of Object.entries(WINE_TERMS)) {
    const set = new Set([
      d.label,
      slug.replace(/-/g, " "),
      ...(d.phrases || []),
    ]);
    for (const p of set) {
      const phrase = String(p).trim();
      if (phrase.length < 3) continue;
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out.push({
        phrase,
        slug,
        re: new RegExp(`^(${escaped})\\b`, "i"),
      });
    }
  }
  out.sort((a, b) => b.phrase.length - a.phrase.length);
  return out;
}

const PHRASES = buildPhrases();

function acceptableParent(node) {
  const par = node.parentElement;
  if (!par) return false;
  if (par.closest("h1, h2, h3, h4, h5, h6")) return false;
  if (par.closest(SKIP_TERM_LINK_ANCESTOR)) return false;
  let p = par;
  while (p) {
    if (p.classList?.contains("no-term-link")) return false;
    if (SKIP_PARENT.has(p.tagName)) return false;
    if (p.closest?.(".term-link")) return false;
    p = p.parentElement;
  }
  return true;
}

function collectTextNodes(root) {
  const tree = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return acceptableParent(node)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes = [];
  let n;
  while ((n = tree.nextNode())) nodes.push(n);
  return nodes;
}

function wrapRange(node, start, end, slug, display) {
  const text = node.nodeValue;
  if (!text) return false;
  const frag = document.createDocumentFragment();
  if (start > 0) frag.appendChild(document.createTextNode(text.slice(0, start)));
  const span = document.createElement("span");
  span.className = "term-link";
  span.setAttribute("data-term", slug);
  span.setAttribute("role", "button");
  span.setAttribute("tabindex", "0");
  span.textContent = display;
  frag.appendChild(span);
  if (end < text.length) frag.appendChild(document.createTextNode(text.slice(end)));
  node.parentNode?.replaceChild(frag, node);
  return true;
}

/**
 * Guarantee priority vocabulary links once each (first match in document order).
 */
function applyPriorityLinks(root) {
  for (const { slug, re } of PRIORITY_ORDER) {
    if (priorityDone.has(slug)) continue;
    const nodes = collectTextNodes(root);
    for (const node of nodes) {
      const text = node.nodeValue;
      if (!text) continue;
      const m = text.match(re);
      if (!m || m.index === undefined) continue;
      const start = m.index;
      const end = start + m[0].length;
      if (wrapRange(node, start, end, slug, m[0])) {
        counts.set(slug, (counts.get(slug) || 0) + 1);
        priorityDone.add(slug);
      }
      break;
    }
  }
}

function processTextNode(node) {
  const text = node.nodeValue;
  if (!text) return;

  const frag = document.createDocumentFragment();
  let linked = false;
  let i = 0;
  while (i < text.length) {
    if (!/\S/.test(text[i])) {
      frag.appendChild(document.createTextNode(text[i]));
      i += 1;
      continue;
    }

    let best = null;
    for (const { slug, re } of PHRASES) {
      const sub = text.slice(i);
      const m = sub.match(re);
      if (!m || m.index !== 0) continue;
      const len = m[1].length;
      if (len === 0) continue;
      const c = counts.get(slug) || 0;
      if (c >= MAX_PER_SLUG) continue;
      if (!best || len > best.len) {
        best = { len, slug, display: m[1] };
      }
    }

    if (best) {
      linked = true;
      counts.set(best.slug, (counts.get(best.slug) || 0) + 1);
      const span = document.createElement("span");
      span.className = "term-link";
      span.setAttribute("data-term", best.slug);
      span.setAttribute("role", "button");
      span.setAttribute("tabindex", "0");
      span.textContent = best.display;
      frag.appendChild(span);
      i += best.len;
    } else {
      frag.appendChild(document.createTextNode(text[i]));
      i += 1;
    }
  }

  if (!linked) return;
  node.parentNode?.replaceChild(frag, node);
}

function walk(el) {
  if (!el) return;
  const nodes = collectTextNodes(el);
  nodes.forEach(processTextNode);
}

/**
 * @param {ParentNode | null | undefined} root
 */
export function rescanTermLinks(root) {
  if (!root) return;
  applyPriorityLinks(root);
  walk(root);
}

function init() {
  const root =
    document.querySelector("[data-term-scan]") ||
    document.querySelector("main") ||
    document.body;
  applyPriorityLinks(root);
  walk(root);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
