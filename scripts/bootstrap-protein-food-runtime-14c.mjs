#!/usr/bin/env node
/**
 * FOOD-14C — Bootstrap protein runtime without catalog audit gate.
 * Catalog audit remains deferred to FOOD-14F; runtime normalization consumes migration map only.
 */

import { runProteinFoodBootstrap } from "./bootstrap-protein-food-catalog.js";

runProteinFoodBootstrap({ skipCatalogAudit: true });
