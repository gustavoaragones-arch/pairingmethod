#!/usr/bin/env node
/**
 * ONTOLOGY-03G — Static HTML renderer for protein food ontology.
 * Pure presentation layer over certified publication artifacts.
 * Requires passing publication certification before rendering.
 *
 * Run: node scripts/generate-protein-food-html-03g.mjs
 */

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { serializeRuntime } from "./bootstrap-protein-food-catalog.js";
import { fillTemplate, loadTemplate, SHARED_ROUTES } from "../lib/taxonomy-shell.js";
import { proteinFoodsHubUrl } from "../lib/public-url.js";
import { isResolvableHref } from "../lib/protein-food-navigation.js";
import {
  assembleProteinEntityPage,
  renderProteinCategorySections,
  renderProteinFoodSections,
  renderProteinGroupSections,
} from "../lib/taxonomy-protein-food-render.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TEMPLATE_NAME = "protein-entity-template.html";
const REPORT_PATH = path.join(ROOT, "reports/html-render-report.json");

const PATHS = {
  pages: {
    foods: path.join(ROOT, "data/pages/protein-food-pages.json"),
    groups: path.join(ROOT, "data/pages/protein-group-pages.json"),
    categories: path.join(ROOT, "data/pages/protein-category-pages.json"),
  },
  schema: {
    foods: path.join(ROOT, "data/schema/protein-food-schema.json"),
    groups: path.join(ROOT, "data/schema/protein-group-schema.json"),
    categories: path.join(ROOT, "data/schema/protein-category-schema.json"),
  },
  navigation: {
    foods: path.join(ROOT, "data/navigation/protein-food-links.json"),
    groups: path.join(ROOT, "data/navigation/protein-group-links.json"),
    categories: path.join(ROOT, "data/navigation/protein-category-links.json"),
  },
  output: {
    foods: path.join(ROOT, "dist/foods"),
    groups: path.join(ROOT, "dist/groups"),
    categories: path.join(ROOT, "dist/categories"),
  },
};

const ENTITY_CONFIG = [
  {
    kind: "food",
    pageFile: PATHS.pages.foods,
    schemaFile: PATHS.schema.foods,
    navFile: PATHS.navigation.foods,
    outDir: PATHS.output.foods,
    entityClass: "protein-food-entity-page",
    renderSections: renderProteinFoodSections,
    expectedCount: 207,
  },
  {
    kind: "group",
    pageFile: PATHS.pages.groups,
    schemaFile: PATHS.schema.groups,
    navFile: PATHS.navigation.groups,
    outDir: PATHS.output.groups,
    entityClass: "protein-group-entity-page",
    renderSections: renderProteinGroupSections,
    expectedCount: 16,
  },
  {
    kind: "category",
    pageFile: PATHS.pages.categories,
    schemaFile: PATHS.schema.categories,
    navFile: PATHS.navigation.categories,
    outDir: PATHS.output.categories,
    entityClass: "protein-category-entity-page",
    renderSections: renderProteinCategorySections,
    expectedCount: 3,
  },
];

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, serializeRuntime(data), "utf8");
}

function requireCertification() {
  const result = spawnSync("npm", ["run", "certify:protein-food-publication"], {
    cwd: ROOT,
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

function buildHrefRegistry(pagesByKind) {
  const validHrefs = new Set(["/", proteinFoodsHubUrl()]);
  for (const pages of Object.values(pagesByKind)) {
    for (const page of pages.pages) {
      validHrefs.add(page.canonical_path);
    }
  }
  return { validHrefs };
}

function renderEntityPage({ template, page, schemaEntry, linkSet, config }) {
  const bodySectionsHtml = config.renderSections(page, linkSet);
  const vars = assembleProteinEntityPage({
    template,
    page,
    bodySectionsHtml,
    jsonLd: schemaEntry.json_ld,
    entityClass: config.entityClass,
  });

  return fillTemplate(template, {
    ...vars,
    HOME: SHARED_ROUTES.home,
    FOODS: proteinFoodsHubUrl(),
    PAIRINGS: SHARED_ROUTES.pairings,
    GRAPES: SHARED_ROUTES.grapes,
    SEASONAL: SHARED_ROUTES.seasonal,
    ABOUT: SHARED_ROUTES.about,
    MATRIX: SHARED_ROUTES.matrix,
    PRIVACY: SHARED_ROUTES.privacy,
    TERMS_OF_SERVICE: SHARED_ROUTES.termsOfService,
  });
}

function buildRenderedPages(artifactSets) {
  const template = loadTemplate(TEMPLATE_NAME);
  const rendered = new Map();

  for (const config of ENTITY_CONFIG) {
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

function validateRenderedPages(rendered, registry) {
  const errors = [];
  let brokenLinks = 0;
  let embeddedJsonLdBlocks = 0;
  let foodCount = 0;
  let groupCount = 0;
  let categoryCount = 0;

  for (const entry of rendered.values()) {
    const { html, page, schemaEntry, linkSet, config } = entry;

    if (config.kind === "food") foodCount += 1;
    if (config.kind === "group") groupCount += 1;
    if (config.kind === "category") categoryCount += 1;

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
        if (
          (link.href.startsWith("/foods/") ||
            link.href.startsWith("/groups/") ||
            link.href.startsWith("/categories/")) &&
          !registry.validHrefs.has(link.href)
        ) {
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
    foodCount,
    groupCount,
    categoryCount,
  };
}

function writeRenderedPages(rendered) {
  for (const entry of rendered.values()) {
    fs.mkdirSync(path.dirname(entry.outFile), { recursive: true });
    fs.writeFileSync(entry.outFile, entry.html, "utf8");
  }
}

function loadArtifacts() {
  const pages = {};
  const schema = {};
  const navigation = {};

  for (const config of ENTITY_CONFIG) {
    pages[config.kind] = JSON.parse(fs.readFileSync(config.pageFile, "utf8"));
    schema[config.kind] = JSON.parse(fs.readFileSync(config.schemaFile, "utf8"));
    navigation[config.kind] = JSON.parse(fs.readFileSync(config.navFile, "utf8"));
  }

  return { pages, schema, navigation };
}

function main() {
  requireCertification();

  const artifacts = loadArtifacts();
  const registry = buildHrefRegistry(artifacts.pages);

  const firstPass = buildRenderedPages(artifacts);
  const validation = validateRenderedPages(firstPass, registry);

  const expectedTotal = ENTITY_CONFIG.reduce((sum, c) => sum + c.expectedCount, 0);
  if (firstPass.size !== expectedTotal) {
    validation.errors.push(
      `HTML file count mismatch: expected ${expectedTotal}, got ${firstPass.size}`
    );
  }

  for (const config of ENTITY_CONFIG) {
    const actual = [...firstPass.values()].filter((e) => e.config.kind === config.kind).length;
    if (actual !== config.expectedCount) {
      validation.errors.push(
        `${config.kind} page count mismatch: expected ${config.expectedCount}, got ${actual}`
      );
    }
  }

  const secondPass = buildRenderedPages(artifacts);
  let determinismPass = firstPass.size === secondPass.size;
  if (determinismPass) {
    for (const [outFile, entry] of firstPass.entries()) {
      const other = secondPass.get(outFile);
      if (!other || entry.html !== other.html) {
        determinismPass = false;
        validation.errors.push(`Determinism check failed: ${path.relative(ROOT, outFile)}`);
        break;
      }
    }
  } else {
    validation.errors.push("Determinism check failed: render count mismatch");
  }

  const overall = validation.errors.length === 0 && determinismPass ? "PASS" : "FAIL";

  if (overall === "FAIL") {
    const report = {
      phase: "ONTOLOGY-03G",
      overall_result: "FAIL",
      validation_errors: validation.errors,
      outputs: [
        "dist/foods/",
        "dist/groups/",
        "dist/categories/",
      ],
      metrics: {
        "Food pages rendered": validation.foodCount,
        "Group pages rendered": validation.groupCount,
        "Category pages rendered": validation.categoryCount,
        "HTML files generated": firstPass.size,
        "Embedded JSON-LD blocks": validation.embeddedJsonLdBlocks,
        "Broken links": validation.brokenLinks,
        "Rendering errors": validation.errors.length,
        "Deterministic regeneration": determinismPass ? "PASS" : "FAIL",
        "Overall result": "FAIL",
      },
    };
    writeJson(REPORT_PATH, report);
    console.error(validation.errors.join("\n"));
    process.exit(1);
  }

  writeRenderedPages(firstPass);

  const report = {
    phase: "ONTOLOGY-03G",
    overall_result: "PASS",
    validation_errors: [],
    outputs: [
      "dist/foods/",
      "dist/groups/",
      "dist/categories/",
    ],
    metrics: {
      "Food pages rendered": validation.foodCount,
      "Group pages rendered": validation.groupCount,
      "Category pages rendered": validation.categoryCount,
      "HTML files generated": firstPass.size,
      "Embedded JSON-LD blocks": validation.embeddedJsonLdBlocks,
      "Broken links": 0,
      "Rendering errors": 0,
      "Deterministic regeneration": "PASS",
      "Overall result": "PASS",
    },
  };

  writeJson(REPORT_PATH, report);
  console.log(JSON.stringify(report.metrics, null, 2));
  console.log(`Report: ${REPORT_PATH}`);
}

main();
