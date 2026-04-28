/**
 * Idempotent: insert url-normalize.js before </body> on every .html file.
 * Run from repo root: node scripts/inject-url-normalize.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const SNIPPET = '  <script src="/assets/js/url-normalize.js"></script>\n';

function walk(dir, out) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules") continue;
      walk(p, out);
    } else if (ent.name.endsWith(".html")) {
      out.push(p);
    }
  }
}

const files = [];
walk(root, files);
let changed = 0;

for (const file of files.sort()) {
  let s = fs.readFileSync(file, "utf8");
  if (s.includes("url-normalize.js")) continue;
  const lower = s.toLowerCase();
  const idx = lower.lastIndexOf("</body>");
  if (idx === -1) {
    console.warn("No </body>:", path.relative(root, file));
    continue;
  }
  s = s.slice(0, idx) + SNIPPET + s.slice(idx);
  fs.writeFileSync(file, s, "utf8");
  changed++;
  console.log("Updated", path.relative(root, file));
}

console.log(`Done. ${changed} file(s) updated, ${files.length - changed} skipped (already had script or no body).`);
