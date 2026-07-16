# ONTOLOGY-02A.1 — Protein Taxonomy Blueprint

**Status:** **Approved for implementation** (2026-07-16)  
**Parent:** [`ONTOLOGY-02A_ARCHITECTURE.md`](ONTOLOGY-02A_ARCHITECTURE.md)  
**Catalog SSOT:** `data/protein-food-catalog.json` (empty — populate per Section 6)

This document defines the **protein foods taxonomy** independently of the catalog. Review and approve this blueprint before adding entities to `protein-food-catalog.json`.

Analogous to the wine descriptor hierarchy designed before descriptor pages were generated.

---

## 1. Top-Level Categories (3)

| Slug | Name | Ontology ID prefix | Target groups |
|------|------|-------------------|---------------|
| `animal-protein` | Animal Protein Foods | `food.protein.animal` | 10 |
| `plant-protein` | Plant Protein Foods | `food.protein.plant` | 4 |
| `fungi-protein` | Fungi Protein Foods | `food.protein.fungi` | 2 |

**Total categories:** 3  
**Total groups:** 16  
**Total `protein_food` entities (minimum target):** **168+**

The 168 figure is a **minimum** for balanced coverage — not a fixed ceiling. Certification evaluates taxonomy coverage and connectivity, not whether the catalog stopped at exactly 168.

---

## 2. Groups & Hierarchy

```text
Animal Protein Foods (animal-protein)
├── Beef (beef)
├── Pork (pork)
├── Lamb (lamb)
├── Veal (veal)
├── Poultry (poultry)
├── Wild Game (wild-game)
├── Fin Fish (fin-fish)
├── Crustaceans (crustaceans)
├── Mollusks (mollusks)
└── Cephalopods (cephalopods)

Plant Protein Foods (plant-protein)
├── Legumes (legumes)
├── Soy Foods (soy-foods)
├── Grains & Wheat Protein (grains-wheat-protein)
└── Nuts & Seeds (nuts-seeds)

Fungi Protein Foods (fungi-protein)
├── Mushrooms (mushrooms)
└── Mycoprotein (mycoprotein)
```

### Hierarchy Depth (02A)

Exactly three levels — **no fourth level** in ONTOLOGY-02A:

```text
protein_category
    ↓ child_of
protein_group
    ↓ child_of
protein_food
```

Cuts, preparations, and species variants are `protein_food` leaf entities, not nested sub-groups. Similarity between cuts uses `similar_to` / `substitutes`, not hierarchy.

---

## 3. Estimated Entity Counts

| Category | Group | Slug | Target count |
|----------|-------|------|-------------:|
| Animal | Beef | `beef` | 20 |
| Animal | Pork | `pork` | 18 |
| Animal | Lamb | `lamb` | 10 |
| Animal | Veal | `veal` | 8 |
| Animal | Poultry | `poultry` | 18 |
| Animal | Wild Game | `wild-game` | 12 |
| Animal | Fin Fish | `fin-fish` | 22 |
| Animal | Crustaceans | `crustaceans` | 7 |
| Animal | Mollusks | `mollusks` | 8 |
| Animal | Cephalopods | `cephalopods` | 8 |
| **Animal subtotal** | | | **131** |
| Plant | Legumes | `legumes` | 12 |
| Plant | Soy Foods | `soy-foods` | 8 |
| Plant | Grains & Wheat Protein | `grains-wheat-protein` | 4 |
| Plant | Nuts & Seeds | `nuts-seeds` | 10 |
| **Plant subtotal** | | | **34** |
| Fungi | Mushrooms | `mushrooms` | 12 |
| Fungi | Mycoprotein | `mycoprotein` | 3 |
| **Fungi subtotal** | | | **15** |
| **Grand total** | | | **168** |

Counts are minimum targets for balanced coverage — not hard caps. Groups may exceed targets where coverage warrants. Certification evaluates coverage quality, not exact entity totals.

---

## 4. Planned Entities by Group

### Animal Protein Foods

#### Beef (`beef`) — 20

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `ribeye` | Ribeye Steak | Bos taurus |
| `striploin` | Striploin (NY Strip) | Bos taurus |
| `tenderloin` | Beef Tenderloin | Bos taurus |
| `filet-mignon` | Filet Mignon | Bos taurus |
| `brisket` | Beef Brisket | Bos taurus |
| `flank-steak` | Flank Steak | Bos taurus |
| `skirt-steak` | Skirt Steak | Bos taurus |
| `hanger-steak` | Hanger Steak | Bos taurus |
| `chuck-roast` | Chuck Roast | Bos taurus |
| `short-rib` | Beef Short Rib | Bos taurus |
| `sirloin` | Sirloin Steak | Bos taurus |
| `top-round` | Top Round | Bos taurus |
| `bottom-round` | Bottom Round | Bos taurus |
| `prime-rib` | Prime Rib | Bos taurus |
| `flat-iron` | Flat Iron Steak | Bos taurus |
| `oxtail` | Oxtail | Bos taurus |
| `beef-cheek` | Beef Cheek | Bos taurus |
| `ground-beef` | Ground Beef | Bos taurus |
| `beef-liver` | Beef Liver | Bos taurus |
| `t-bone` | T-Bone Steak | Bos taurus |

#### Pork (`pork`) — 18

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `pork-belly` | Pork Belly | Sus scrofa domesticus |
| `pork-loin` | Pork Loin | Sus scrofa domesticus |
| `pork-shoulder` | Pork Shoulder | Sus scrofa domesticus |
| `pork-tenderloin` | Pork Tenderloin | Sus scrofa domesticus |
| `ham` | Ham | Sus scrofa domesticus |
| `pork-chop` | Pork Chop | Sus scrofa domesticus |
| `spare-ribs` | Pork Spare Ribs | Sus scrofa domesticus |
| `baby-back-ribs` | Baby Back Ribs | Sus scrofa domesticus |
| `ground-pork` | Ground Pork | Sus scrofa domesticus |
| `pork-neck` | Pork Neck | Sus scrofa domesticus |
| `pork-hock` | Pork Hock | Sus scrofa domesticus |
| `bacon` | Bacon | Sus scrofa domesticus |
| `pancetta` | Pancetta | Sus scrofa domesticus |
| `guanciale` | Guanciale | Sus scrofa domesticus |
| `coppa` | Coppa | Sus scrofa domesticus |
| `pork-liver` | Pork Liver | Sus scrofa domesticus |
| `country-style-ribs` | Country-Style Ribs | Sus scrofa domesticus |
| `crown-roast-pork` | Crown Roast of Pork | Sus scrofa domesticus |

#### Lamb (`lamb`) — 10

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `lamb-leg` | Lamb Leg | Ovis aries |
| `lamb-rack` | Lamb Rack | Ovis aries |
| `lamb-shoulder` | Lamb Shoulder | Ovis aries |
| `lamb-shank` | Lamb Shank | Ovis aries |
| `lamb-chop` | Lamb Chop | Ovis aries |
| `lamb-loin` | Lamb Loin | Ovis aries |
| `ground-lamb` | Ground Lamb | Ovis aries |
| `lamb-breast` | Lamb Breast | Ovis aries |
| `lamb-neck` | Lamb Neck | Ovis aries |
| `lamb-saddle` | Lamb Saddle | Ovis aries |

#### Veal (`veal`) — 8

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `veal-cutlet` | Veal Cutlet | Bos taurus |
| `veal-shank` | Veal Shank (Osso Buco) | Bos taurus |
| `veal-chop` | Veal Chop | Bos taurus |
| `veal-tenderloin` | Veal Tenderloin | Bos taurus |
| `veal-breast` | Veal Breast | Bos taurus |
| `ground-veal` | Ground Veal | Bos taurus |
| `veal-liver` | Veal Liver | Bos taurus |
| `veal-sweetbreads` | Veal Sweetbreads | Bos taurus |

#### Poultry (`poultry`) — 18

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `chicken-breast` | Chicken Breast | Gallus gallus domesticus |
| `chicken-thigh` | Chicken Thigh | Gallus gallus domesticus |
| `chicken-wing` | Chicken Wing | Gallus gallus domesticus |
| `chicken-leg` | Chicken Leg | Gallus gallus domesticus |
| `whole-chicken` | Whole Chicken | Gallus gallus domesticus |
| `ground-chicken` | Ground Chicken | Gallus gallus domesticus |
| `duck-breast` | Duck Breast | Anas platyrhynchos domesticus |
| `duck-leg` | Duck Leg | Anas platyrhynchos domesticus |
| `duck-confit-leg` | Duck Confit Leg | Anas platyrhynchos domesticus |
| `turkey-breast` | Turkey Breast | Meleagris gallopavo |
| `turkey-leg` | Turkey Leg | Meleagris gallopavo |
| `ground-turkey` | Ground Turkey | Meleagris gallopavo |
| `quail` | Quail | Coturnix coturnix |
| `cornish-hen` | Cornish Hen | Gallus gallus domesticus |
| `guinea-fowl` | Guinea Fowl | Numida meleagris |
| `goose-breast` | Goose Breast | Anser anser domesticus |
| `chicken-liver` | Chicken Liver | Gallus gallus domesticus |
| `foie-gras` | Foie Gras | Anas platyrhynchos domesticus |

#### Wild Game (`wild-game`) — 12

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `venison` | Venison | Odocoileus virginianus |
| `rabbit` | Rabbit | Oryctolagus cuniculus |
| `pheasant` | Pheasant | Phasianus colchicus |
| `squab` | Squab | Columba livia domestica |
| `wild-boar` | Wild Boar | Sus scrofa |
| `elk` | Elk | Cervus canadensis |
| `bison` | Bison | Bison bison |
| `wild-duck` | Wild Duck | Anas platyrhynchos |
| `partridge` | Partridge | Perdix perdix |
| `grouse` | Grouse | Lagopus lagopus |
| `wild-turkey` | Wild Turkey | Meleagris gallopavo |
| `wild-hare` | Wild Hare | Lepus europaeus |

#### Fin Fish (`fin-fish`) — 22

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `cod` | Cod | Gadus morhua |
| `halibut` | Halibut | Hippoglossus hippoglossus |
| `sole` | Sole | Solea solea |
| `flounder` | Flounder | Paralichthys dentatus |
| `sea-bass` | Sea Bass | Dicentrarchus labrax |
| `snapper` | Snapper | Lutjanus campechanus |
| `haddock` | Haddock | Melanogrammus aeglefinus |
| `turbot` | Turbot | Scophthalmus maximus |
| `monkfish` | Monkfish | Lophius piscatorius |
| `pollock` | Pollock | Gadus chalcogrammus |
| `tilapia` | Tilapia | Oreochromis niloticus |
| `striped-bass` | Striped Bass | Morone saxatilis |
| `salmon` | Salmon | Salmo salar |
| `tuna` | Tuna | Thunnus albacares |
| `mackerel` | Mackerel | Scomber scombrus |
| `sardine` | Sardine | Sardina pilchardus |
| `anchovy` | Anchovy | Engraulis encrasicolus |
| `trout` | Trout | Oncorhynchus mykiss |
| `herring` | Herring | Clupea harengus |
| `swordfish` | Swordfish | Xiphias gladius |
| `arctic-char` | Arctic Char | Salvelinus alpinus |
| `bluefish` | Bluefish | Pomatomus saltatrix |

#### Crustaceans (`crustaceans`) — 7

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `shrimp` | Shrimp | Litopenaeus vannamei |
| `lobster` | Lobster | Homarus americanus |
| `crab` | Crab | Callinectes sapidus |
| `king-crab` | King Crab | Paralithodes camtschaticus |
| `dungeness-crab` | Dungeness Crab | Metacarcinus magister |
| `crawfish` | Crawfish | Procambarus clarkii |
| `langoustine` | Langoustine | Nephrops norvegicus |

#### Mollusks (`mollusks`) — 8

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `mussels` | Mussels | Mytilus edulis |
| `clams` | Clams | Mercenaria mercenaria |
| `oysters` | Oysters | Crassostrea virginica |
| `scallops` | Scallops | Pecten maximus |
| `abalone` | Abalone | Haliotis rufescens |
| `cockles` | Cockles | Cerastoderma edule |
| `geoduck` | Geoduck | Panopea generosa |
| `green-lip-mussels` | Green-Lip Mussels | Perna canaliculus |

#### Cephalopods (`cephalopods`) — 8

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `squid` | Squid | Loligo vulgaris |
| `octopus` | Octopus | Octopus vulgaris |
| `cuttlefish` | Cuttlefish | Sepia officinalis |
| `squid-tubes` | Squid Tubes | Loligo vulgaris |
| `baby-octopus` | Baby Octopus | Octopus vulgaris |
| `octopus-tentacle` | Octopus Tentacle | Octopus vulgaris |
| `whole-squid` | Whole Squid | Loligo vulgaris |
| `whole-octopus` | Whole Octopus | Octopus vulgaris |

---

### Plant Protein Foods

#### Legumes (`legumes`) — 12

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `lentils` | Lentils | Lens culinaris |
| `chickpeas` | Chickpeas | Cicer arietinum |
| `black-beans` | Black Beans | Phaseolus vulgaris |
| `kidney-beans` | Kidney Beans | Phaseolus vulgaris |
| `cannellini-beans` | Cannellini Beans | Phaseolus vulgaris |
| `pinto-beans` | Pinto Beans | Phaseolus vulgaris |
| `navy-beans` | Navy Beans | Phaseolus vulgaris |
| `split-peas` | Split Peas | Pisum sativum |
| `black-eyed-peas` | Black-Eyed Peas | Vigna unguiculata |
| `fava-beans` | Fava Beans | Vicia faba |
| `mung-beans` | Mung Beans | Vigna radiata |
| `adzuki-beans` | Adzuki Beans | Vicia angularis |

#### Soy Foods (`soy-foods`) — 8

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `tofu-firm` | Firm Tofu | Glycine max |
| `tofu-silken` | Silken Tofu | Glycine max |
| `tofu-extra-firm` | Extra-Firm Tofu | Glycine max |
| `tempeh` | Tempeh | Glycine max |
| `edamame` | Edamame | Glycine max |
| `yuba` | Yuba (Tofu Skin) | Glycine max |
| `smoked-tofu` | Smoked Tofu | Glycine max |
| `natto` | Natto | Glycine max |

#### Grains & Wheat Protein (`grains-wheat-protein`) — 4

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `seitan` | Seitan | Triticum aestivum |
| `vital-wheat-gluten` | Vital Wheat Gluten | Triticum aestivum |
| `wheat-protein-strips` | Wheat Protein Strips | Triticum aestivum |
| `fu` | Fu (Wheat Gluten) | Triticum aestivum |

#### Nuts & Seeds (`nuts-seeds`) — 10

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `almonds` | Almonds | Prunus dulcis |
| `walnuts` | Walnuts | Juglans regia |
| `cashews` | Cashews | Anacardium occidentale |
| `pumpkin-seeds` | Pumpkin Seeds | Cucurbita pepo |
| `sunflower-seeds` | Sunflower Seeds | Helianthus annuus |
| `hemp-seeds` | Hemp Seeds | Cannabis sativa |
| `peanuts` | Peanuts | Arachis hypogaea |
| `pistachios` | Pistachios | Pistacia vera |
| `pine-nuts` | Pine Nuts | Pinus pinea |
| `chia-seeds` | Chia Seeds | Salvia hispanica |

---

### Fungi Protein Foods

#### Mushrooms (`mushrooms`) — 12

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `button-mushroom` | Button Mushroom | Agaricus bisporus |
| `cremini` | Cremini Mushroom | Agaricus bisporus |
| `portobello` | Portobello Mushroom | Agaricus bisporus |
| `shiitake` | Shiitake | Lentinula edodes |
| `oyster-mushroom` | Oyster Mushroom | Pleurotus ostreatus |
| `king-oyster` | King Oyster Mushroom | Pleurotus eryngii |
| `maitake` | Maitake | Grifola frondosa |
| `enoki` | Enoki Mushroom | Flammulina velutipes |
| `chanterelle` | Chanterelle | Cantharellus cibarius |
| `morel` | Morel | Morchella esculenta |
| `porcini` | Porcini | Boletus edulis |
| `lions-mane` | Lion's Mane | Hericium erinaceus |

#### Mycoprotein (`mycoprotein`) — 3

| Slug | Display Name | Scientific name (initial) |
|------|--------------|---------------------------|
| `quorn-fillets` | Quorn Fillets | Fusarium venenatum |
| `mycoprotein-ground` | Mycoprotein Ground | Fusarium venenatum |
| `mycoprotein-cutlets` | Mycoprotein Cutlets | Fusarium venenatum |

---

## 5. Scope Boundaries (02A)

### In scope

- Raw and cooked **protein-forward foods** as pairing subjects
- Anatomical cuts, species, and protein-rich plant/fungi foods
- Cured meats where the protein is the primary pairing subject (bacon, pancetta, ham)
- Relationship arrays to wine ontology (may start empty)

### Explicitly out of scope

| Excluded | Belongs to |
|----------|------------|
| Marinades | Ingredients (02C) or Sauces (02E) |
| Cooking methods (grilled, roasted, braised) | Cooking Techniques (02B) |
| Sauces (béarnaise, pesto, demi-glace) | Sauces (02E) |
| Prepared dishes (beef Wellington, coq au vin) | Dishes (02H) |
| Butter, cream, flour, aromatics | Ingredients (02C) |
| Cheese | Cheeses (02F) |
| Fourth hierarchy level (e.g. Beef → Ribeye → Grass-fed) | Deferred — use attributes, not hierarchy |
| Nutrient/macronutrient entities | Not ontology entities |

---

## 6. Catalog Population Order

Populate `data/protein-food-catalog.json` **category by category** in this sequence (aligns with wine-pairing demand):

| Order | Group(s) | Rationale |
|------:|----------|-----------|
| 1 | Beef | Highest red-meat pairing demand |
| 2 | Pork | Broad white/red pairing range |
| 3 | Lamb & Veal | Classic European pairing context |
| 4 | Poultry | Highest volume home cooking |
| 5 | Seafood (`fin-fish`, `crustaceans`, `mollusks`, `cephalopods`) | Biologically grouped; major white-wine pairing category |
| 6 | Wild Game (`wild-game`) | Regional and seasonal pairing depth |
| 7 | Plant Protein Foods (`legumes`, `soy-foods`, `grains-wheat-protein`, `nuts-seeds`) | Vegetarian pairing growth |
| 8 | Fungi Protein Foods (mushrooms, mycoprotein) | Umami-forward pairing niche |

Do not begin bootstrap, validator, or generator until all groups are populated per this blueprint.

---

## 7. Reserved Relationship Arrays

Every `protein_food` catalog entry must include these arrays from day one — **empty `[]` if unknown**:

```jsonc
{
  "related_styles": [],
  "related_descriptors": [],
  "related_regions": [],
  "related_serving": [],
  "related_techniques": [],
  "similar_foods": [],
  "substitutes": [],
  "common_preparations": [],
  "common_cuisines": []
}
```

| Array | Maps to (typed edge) | Populated in |
|-------|---------------------|--------------|
| `related_styles` | `pairs_best_with` / `pairs_with` | 02A |
| `related_descriptors` | `typically_exhibits` | 02A |
| `related_regions` | `associated_with` / regional context | 02A (optional) |
| `related_serving` | `associated_with` → wine_serving | 02A (optional) |
| `related_techniques` | Reserved | 02B |
| `similar_foods` | `similar_to` | 02A |
| `substitutes` | `substitute_for` | 02A |
| `common_preparations` | Placeholder — not cooking techniques or dishes | 02B / 02G |
| `common_cuisines` | Placeholder — regional culinary context | 02G |

`common_preparations` and `common_cuisines` are cross-domain placeholders — not cooking techniques (02B) or dishes (02H). Reserved now to avoid schema evolution later.

Empty arrays are preferable to omitting fields. Reinforces SSOT and prevents schema migration.

---

## 8. Ontology ID Convention

| Level | Pattern | Example |
|-------|---------|---------|
| Category | `food.protein.{category}` | `food.protein.animal` |
| Group | `food.protein.{group}` | `food.protein.beef` |
| Food | `food.protein.{group}.{entity}` | `food.protein.beef.ribeye` |

Fungi and plant foods use their group slug: `food.protein.mushrooms.shiitake`, `food.protein.soy-foods.tofu-firm`.

---

## 9. Approval Checklist

- [x] Category count and names approved (3 categories)
- [x] Group slugs approved (16 groups)
- [x] Entity counts balanced (168+ minimum)
- [x] Wild Game (not Game); seafood split by biology; plant groups reordered
- [x] No prepared dishes or cooking methods in entity list
- [x] Population order confirmed
- [x] Reserved relationship arrays in schema (9 arrays)

**Status:** **Approved for implementation** — 2026-07-16

Refinements applied: Wild Game rename; seafood → Fin Fish / Crustaceans / Mollusks / Cephalopods; plant → Legumes / Soy Foods / Grains & Wheat Protein / Nuts & Seeds; `common_preparations` and `common_cuisines` arrays reserved.

---

## 10. Next Steps (after approval)

1. Populate `data/protein-food-catalog.json` per Section 6 order
2. Bump `catalog_version` to `1.1.0` when first group ships; `1.0.0` remains empty shell
3. `scripts/bootstrap-protein-food-catalog.js`
4. `scripts/validate-ontology-02a.js`
5. Relationship mapper → generator → pages → search → certification

---

*This blueprint is the planning contract for ONTOLOGY-02A. The catalog implements it; the catalog does not define it.*
