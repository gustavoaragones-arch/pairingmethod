#!/usr/bin/env node
/** LANG-02 — Spanish vocabulary population verification (read-only). */
import { execSync } from "child_process";
import { runSpanishVocabularyLang02Verification } from "../lib/language-audit/spanish-vocabulary-lang02.js";

function getGitDiffFiles() {
  try {
    const status = execSync("git status --porcelain", { cwd: process.cwd(), encoding: "utf8" });
    return status
      .split("\n")
      .filter(Boolean)
      .map((line) => line.slice(3).trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

const gitDiffFiles = getGitDiffFiles();
const result = runSpanishVocabularyLang02Verification(process.cwd(), { gitDiffFiles });
console.log(JSON.stringify(result, null, 2));
if (result.overall_certification !== "PASS") process.exit(1);
