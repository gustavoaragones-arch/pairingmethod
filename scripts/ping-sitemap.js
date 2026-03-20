#!/usr/bin/env node
/**
 * Post-deploy: notify Google of sitemap URL (may trigger recrawl).
 * Run: npm run ping:sitemap
 *
 * Note: Google's legacy ping endpoint may be deprecated; Search Console
 * sitemap submit remains the primary signal. This still documents the URL
 * and opens it locally on macOS for a quick manual ping.
 */
import { execSync } from "child_process";
import process from "process";

const SITEMAP = "https://pairingmethod.com/sitemap.xml";
const PING = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`;

console.log("\n📍 Sitemap ping URL (open after deploy):\n");
console.log(PING);
console.log("\nAlso submit in Search Console → Sitemaps if not already.\n");

if (process.platform === "darwin") {
  try {
    execSync(`open "${PING}"`, { stdio: "inherit" });
  } catch {
    // ignore if `open` fails (e.g. headless CI)
  }
}
