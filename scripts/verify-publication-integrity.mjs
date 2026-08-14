#!/usr/bin/env node
/** AQ-02B4 — Internal linking reachability + knowledge integrity detection, whole-site. */
import { runPublicationIntegrityStage } from "../lib/food-publication/integrity-verifier.js";

const result = runPublicationIntegrityStage(process.cwd());
console.log(
  JSON.stringify(
    {
      reachability: {
        totalExpected: result.reachability.totalExpected,
        totalReachable: result.reachability.totalReachable,
        orphanCount: result.reachability.orphans.length,
        noOrphans: result.reachability.noOrphans,
        pagesVisitedInCrawl: result.reachability.pagesVisitedInCrawl,
      },
      knowledgeIntegrity: {
        findingCount: result.knowledgeIntegrity.findingCount,
      },
    },
    null,
    2
  )
);

if (!result.reachability.noOrphans) {
  console.error("ORPHAN PAGES FOUND:");
  console.error(JSON.stringify(result.reachability.orphans.slice(0, 30), null, 2));
}
