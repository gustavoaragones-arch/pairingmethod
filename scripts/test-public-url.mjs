import assert from "node:assert/strict";
import test from "node:test";

import {
  absoluteUrl,
  canonicalUrl,
  grapeUrl,
  ogUrl,
  pairingUrl,
  publicPath,
  schemaUrl,
  termUrl,
} from "../lib/public-url.js";

test("publicPath maps physical HTML files to public routes", () => {
  assert.equal(publicPath("index.html"), "/");
  assert.equal(publicPath("about.html"), "/about");
  assert.equal(publicPath("pairings.html"), "/pairings");
  assert.equal(publicPath("wine-with-steak.html"), "/wine-with-steak");
  assert.equal(publicPath("terms/earthy.html"), "/terms/earthy");
  assert.equal(
    publicPath("grapes/cabernet-sauvignon.html"),
    "/grapes/cabernet-sauvignon"
  );
});

test("publicPath accepts already-public routes without changing them", () => {
  assert.equal(publicPath("/"), "/");
  assert.equal(publicPath("/about"), "/about");
  assert.equal(publicPath("/terms/earthy"), "/terms/earthy");
});

test("publicPath preserves directory semantics for nested index files", () => {
  assert.equal(publicPath("guides/index.html"), "/guides/");
});

test("absolute URL helpers share the production origin and public path", () => {
  assert.equal(absoluteUrl("/about"), "https://pairingmethod.com/about");
  assert.equal(canonicalUrl("about.html"), "https://pairingmethod.com/about");
  assert.equal(ogUrl("terms/earthy.html"), "https://pairingmethod.com/terms/earthy");
  assert.equal(
    schemaUrl("grapes/pinot-noir.html"),
    "https://pairingmethod.com/grapes/pinot-noir"
  );
});

test("route helpers build extensionless routes", () => {
  assert.equal(pairingUrl("wine-with-steak"), "/wine-with-steak");
  assert.equal(termUrl("tannic"), "/terms/tannic");
  assert.equal(grapeUrl("pinot-noir"), "/grapes/pinot-noir");
});

test("helpers reject external URLs, traversal, queries, and malformed slugs", () => {
  assert.throws(() => publicPath("https://example.com/about.html"), TypeError);
  assert.throws(() => publicPath("../about.html"), TypeError);
  assert.throws(() => publicPath("about.html?ref=test"), TypeError);
  assert.throws(() => absoluteUrl("about"), TypeError);
  assert.throws(() => absoluteUrl("//example.com/about"), TypeError);
  assert.throws(() => termUrl("../earthy"), TypeError);
});
