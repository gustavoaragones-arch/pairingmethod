/**
 * FOOD-04F — Generalized static HTML renderer (ONTOLOGY-03G).
 * Pure presentation layer over certified publication artifacts.
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath, pathToFileURL } from "url";
import { serializeRuntime } from "../../scripts/bootstrap-protein-food-catalog.js";
import { fillTemplate, loadTemplate, SHARED_ROUTES } from "../taxonomy-shell.js";
import { getDomainConfig } from "../food-domain-config.js";
import { isResolvableHref } from "../protein-food-navigation.js";
import { readJson, relative, writeJson } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB_DIR = path.join(__dirname, "..");

const DEFAULT_RENDER_EXPORTS = Object.freeze({
  protein: {
    leaf: "renderProteinFoodSections",
    group: "renderProteinGroupSections",
    category: "renderProteinCategorySections",
    assemble: "assembleProteinEntityPage",
  },
  cheese: {
    leaf: "renderCheeseSections",
    group: "renderCheeseGroupSections",
    category: "renderCheeseCategorySections",
    assemble: "assembleCheeseEntityPage",
  },
  vegetable: {
    leaf: "renderVegetableSections",
    group: "renderVegetableGroupSections",
    category: "renderVegetableCategorySections",
    assemble: "assembleVegetableEntityPage",
  },
  fungi: {
    leaf: "renderFungiSections",
    group: "renderFungiGroupSections",
    category: "renderFungiCategorySections",
    assemble: "assembleFungiEntityPage",
  },
  "herb-spice": {
    leaf: "renderHerbSpiceSections",
    group: "renderHerbSpiceGroupSections",
    category: "renderHerbSpiceCategorySections",
    assemble: "assembleHerbSpiceEntityPage",
  },
  "grain-starch": {
    leaf: "renderGrainStarchSections",
    group: "renderGrainStarchGroupSections",
    category: "renderGrainStarchCategorySections",
    assemble: "assembleGrainStarchEntityPage",
  },
});

const ENTITY_KINDS = ["leaf", "group", "category"];

function resolveRenderModulePath(domain) {
  const rel = domain.render.module.replace(/^\.\.\//, "");
  return path.join(LIB_DIR, rel);
}

function getRenderExportNames(domain) {
  const names = domain.render.exports ?? DEFAULT_RENDER_EXPORTS[domain.id];
  if (!names) {
    throw new Error(`No render export mapping for domain: ${domain.id}`);
  }
  return names;
}

async function loadRenderModule(domain) {
  const modulePath = resolveRenderModulePath(domain);
  const exportNames = getRenderExportNames(domain);
  const mod = await import(pathToFileURL(modulePath).href);

  const renderFns = {
    leaf: mod[exportNames.leaf],
    group: mod[exportNames.group],
    category: mod[exportNames.category],
    assemble: mod[exportNames.assemble],
  };

  for (const [kind, fn] of Object.entries(renderFns)) {
    if (typeof fn !== "function") {
      throw new Error(
        `Render module ${modulePath} missing export ${exportNames[kind] ?? kind}`
      );
    }
  }

  return renderFns;
}

function buildEntityConfig(domain, renderFns) {
  return [
    {
      kind: "leaf",
      pageFile: domain.paths.pages.leaf,
      schemaFile: domain.paths.schema.leaf,
      navFile: domain.paths.navigation.leaf,
      outDir: domain.paths.html.leaf,
      entityClass: domain.render.entityClasses.leaf,
      renderSections: renderFns.leaf,
      expectedCount: domain.expectedCounts.leaf,
    },
    {
      kind: "group",
      pageFile: domain.paths.pages.group,
      schemaFile: domain.paths.schema.group,
      navFile: domain.paths.navigation.group,
      outDir: domain.paths.html.group,
      entityClass: domain.render.entityClasses.group,
      renderSections: renderFns.group,
      expectedCount: domain.expectedCounts.groups,
    },
    {
      kind: "category",
      pageFile: domain.paths.pages.category,
      schemaFile: domain.paths.schema.category,
      navFile: domain.paths.navigation.category,
      outDir: domain.paths.html.category,
      entityClass: domain.render.entityClasses.category,
      renderSections: renderFns.category,
      expectedCount: domain.expectedCounts.categories,
    },
  ];
}

function resolveDomain(domainOrId) {
  return typeof domainOrId === "string" ? getDomainConfig(domainOrId) : domainOrId;
}

function requireCertification(domain) {
  const result = spawnSync("npm", ["run", domain.certifyScript], {
    cwd: domain.root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    const err = result.stderr || result.stdout || "Publication certification failed";
    console.error("HTML rendering blocked: publication certification did not pass.");
    console.error(err);
    process.exit(1);
  }
}

function indexByPath(items, key = "canonical_path") {
  return new Map(items.map((item) => [item[key], item]));
}

function collectNavigationLinks(linkSet) {
  const links = [];
  for (const value of Object.values(linkSet?.sections ?? {})) {
    if (!value) continue;
    if (Array.isArray(value)) {
      links.push(...value);
      continue;
    }
    if (typeof value === "object" && value.href) {
      links.push(value);
    }
    if (typeof value === "object") {
      for (const nested of Object.values(value)) {
        if (nested?.href) links.push(nested);
      }
    }
  }
  return links;
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const pattern = /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g;
  let match = pattern.exec(html);
  while (match) {
    blocks.push(JSON.parse(match[1]));
    match = pattern.exec(html);
  }
  return blocks;
}

function buildHrefRegistry(pagesByKind, domain) {
  const validHrefs = new Set(["/", domain.urls.hubPath]);
  for (const pages of Object.values(pagesByKind)) {
    for (const page of pages.pages) {
      validHrefs.add(page.canonical_path);
    }
  }
  return { validHrefs };
}

function isInternalEntityHref(href, domain) {
  return domain.urls.internalPrefixes.some((prefix) => href.startsWith(prefix));
}

function renderEntityPage({ template, page, schemaEntry, linkSet, config, renderFns, domain }) {
  const bodySectionsHtml = config.renderSections(page, linkSet);
  const vars = renderFns.assemble({
    template,
    page,
    bodySectionsHtml,
    jsonLd: schemaEntry.json_ld,
    entityClass: config.entityClass,
  });

  return fillTemplate(template, {
    ...vars,
    HOME: SHARED_ROUTES.home,
    FOODS: domain.urls.hubPath,
    PAIRINGS: SHARED_ROUTES.pairings,
    GRAPES: SHARED_ROUTES.grapes,
    SEASONAL: SHARED_ROUTES.seasonal,
    ABOUT: SHARED_ROUTES.about,
    MATRIX: SHARED_ROUTES.matrix,
    PRIVACY: SHARED_ROUTES.privacy,
    TERMS_OF_SERVICE: SHARED_ROUTES.termsOfService,
  });
}

function buildRenderedPages(artifactSets, entityConfig, renderFns, domain) {
  const template = loadTemplate(domain.render.template);
  const rendered = new Map();

  for (const config of entityConfig) {
    const pages = artifactSets.pages[config.kind];
    const schemas = indexByPath(artifactSets.schema[config.kind].schemas);
    const linkSets = indexByPath(artifactSets.navigation[config.kind].link_sets);

    for (const page of pages.pages) {
      const schemaEntry = schemas.get(page.canonical_path);
      const linkSet = linkSets.get(page.canonical_path);
      const html = renderEntityPage({
        template,
        page,
        schemaEntry,
        linkSet,
        config,
        renderFns,
        domain,
      });
      const outFile = path.join(config.outDir, page.slug, "index.html");
      rendered.set(outFile, {
        html,
        page,
        schemaEntry,
        linkSet,
        config,
        outFile,
      });
    }
  }

  return rendered;
}

function validateRenderedPages(rendered, registry, domain) {
  const errors = [];
  let brokenLinks = 0;
  let embeddedJsonLdBlocks = 0;
  const kindCounts = { leaf: 0, group: 0, category: 0 };

  for (const entry of rendered.values()) {
    const { html, page, schemaEntry, linkSet, config } = entry;

    kindCounts[config.kind] += 1;

    if (!html.startsWith("<!DOCTYPE html>")) {
      errors.push(`${page.slug}: missing DOCTYPE`);
    }
    if (!html.includes("<html") || !html.includes("<head>") || !html.includes("<body")) {
      errors.push(`${page.slug}: invalid HTML structure`);
    }
    if (!html.includes(page.metadata.title)) {
      errors.push(`${page.slug}: missing page title`);
    }
    if (!html.includes(`href="${page.metadata.canonical}"`)) {
      errors.push(`${page.slug}: canonical URL mismatch`);
    }

    const extractedJsonLd = extractJsonLdBlocks(html);
    embeddedJsonLdBlocks += extractedJsonLd.length;

    if (!schemaEntry?.json_ld?.length) {
      errors.push(`${page.slug}: missing schema entry`);
    } else if (
      serializeRuntime(extractedJsonLd) !== serializeRuntime(schemaEntry.json_ld)
    ) {
      errors.push(`${page.slug}: embedded JSON-LD does not match schema artifact`);
    }

    for (const link of collectNavigationLinks(linkSet)) {
      if (link.href?.startsWith("/")) {
        if (!html.includes(`href="${link.href}"`)) {
          errors.push(`${page.slug}: navigation link missing in HTML: ${link.href}`);
        }
        if (isInternalEntityHref(link.href, domain) && !registry.validHrefs.has(link.href)) {
          brokenLinks += 1;
          errors.push(`${page.slug}: broken internal link ${link.href}`);
        }
      } else if (!html.includes(link.title)) {
        errors.push(`${page.slug}: navigation title missing in HTML: ${link.title}`);
      }

      if (link.href?.startsWith("/") && !isResolvableHref(link.href, registry)) {
        brokenLinks += 1;
        errors.push(`${page.slug}: unresolvable navigation href ${link.href}`);
      }
    }
  }

  return {
    errors,
    brokenLinks,
    embeddedJsonLdBlocks,
    kindCounts,
  };
}

function writeRenderedPages(rendered) {
  for (const entry of rendered.values()) {
    fs.mkdirSync(path.dirname(entry.outFile), { recursive: true });
    fs.writeFileSync(entry.outFile, entry.html, "utf8");
  }
}

function loadArtifacts(entityConfig) {
  const pages = {};
  const schema = {};
  const navigation = {};

  for (const config of entityConfig) {
    pages[config.kind] = readJson(config.pageFile);
    schema[config.kind] = readJson(config.schemaFile);
    navigation[config.kind] = readJson(config.navFile);
  }

  return { pages, schema, navigation };
}

function htmlOutputDirs(domain) {
  return ENTITY_KINDS.map((kind) => relative(domain.root, domain.paths.html[kind]));
}

export async function runHtmlStage(domainOrId) {
  const domain = resolveDomain(domainOrId);
  requireCertification(domain);

  const renderFns = await loadRenderModule(domain);
  const entityConfig = buildEntityConfig(domain, renderFns);
  const artifacts = loadArtifacts(entityConfig);
  const registry = buildHrefRegistry(artifacts.pages, domain);

  const firstPass = buildRenderedPages(artifacts, entityConfig, renderFns, domain);
  const validation = validateRenderedPages(firstPass, registry, domain);

  const expectedTotal = domain.expectedCounts.total;
  if (firstPass.size !== expectedTotal) {
    validation.errors.push(
      `HTML file count mismatch: expected ${expectedTotal}, got ${firstPass.size}`
    );
  }

  for (const config of entityConfig) {
    const actual = [...firstPass.values()].filter((e) => e.config.kind === config.kind).length;
    if (actual !== config.expectedCount) {
      validation.errors.push(
        `${config.kind} page count mismatch: expected ${config.expectedCount}, got ${actual}`
      );
    }
  }

  const secondPass = buildRenderedPages(artifacts, entityConfig, renderFns, domain);
  let determinismPass = firstPass.size === secondPass.size;
  if (determinismPass) {
    for (const [outFile, entry] of firstPass.entries()) {
      const other = secondPass.get(outFile);
      if (!other || entry.html !== other.html) {
        determinismPass = false;
        validation.errors.push(`Determinism check failed: ${relative(domain.root, outFile)}`);
        break;
      }
    }
  } else {
    validation.errors.push("Determinism check failed: render count mismatch");
  }

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  const metrics = {
    "Leaf pages rendered": validation.kindCounts.leaf,
    "Group pages rendered": validation.kindCounts.group,
    "Category pages rendered": validation.kindCounts.category,
    "HTML files generated": firstPass.size,
    "Embedded JSON-LD blocks": validation.embeddedJsonLdBlocks,
    "Broken links": overall === "PASS" ? 0 : validation.brokenLinks,
    "Rendering errors": overall === "PASS" ? 0 : validation.errors.length,
    "Deterministic regeneration": determinismPass ? "PASS" : "FAIL",
    "Overall result": overall,
  };

  const report = {
    phase: `${domain.phasePrefix}G`,
    domain: domain.id,
    overall_result: overall,
    validation_errors: overall === "PASS" ? [] : validation.errors,
    outputs: overall === "PASS" ? htmlOutputDirs(domain) : undefined,
    metrics,
  };

  if (overall === "FAIL") {
    writeJson(domain.paths.reports.html, report);
    console.error(validation.errors.join("\n"));
    process.exit(1);
  }

  writeRenderedPages(firstPass);
  writeJson(domain.paths.reports.html, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${domain.paths.reports.html}`);
  return report;
}
