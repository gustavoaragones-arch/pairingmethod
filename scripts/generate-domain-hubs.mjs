#!/usr/bin/env node
/** AQ-02B1 — Generate every published food domain's hub page (dist/<domain>/index.html). */
import { getDomainConfig, listPublishedDomainIds } from "../lib/food-domain-config.js";
import { runHubStage } from "../lib/food-publication/hub.js";

const results = listPublishedDomainIds().map((id) => runHubStage(getDomainConfig(id)));
console.log(JSON.stringify(results, null, 2));
