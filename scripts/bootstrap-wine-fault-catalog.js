/**
 * ONTOLOGY-01E — Seed data/wine-fault-catalog.json (Tier 1 wine fault entities).
 * Run: node scripts/bootstrap-wine-fault-catalog.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "data", "wine-fault-catalog.json");
const TAXONOMY_PATH = path.join(ROOT, "data", "wine-taxonomy.json");
const STYLE_CATALOG = path.join(ROOT, "data", "wine-style-catalog.json");
const REGION_CATALOG = path.join(ROOT, "data", "wine-region-catalog.json");
const SERVING_CATALOG = path.join(ROOT, "data", "wine-serving-catalog.json");
const GRAPE_CATALOG = path.join(ROOT, "data", "grape-catalog.json");
const TECHNIQUE_CATALOG = path.join(ROOT, "data", "winemaking-technique-catalog.json");

function fault(entry) {
  return {
    type: "entity",
    entity_type: "wine_fault",
    domain: "wine",
    aliases: [],
    classification: "",
    summary: "",
    cause: "",
    how_it_occurs: "",
    prevention: "",
    severity: "medium",
    creates_descriptors: [],
    reduces_descriptors: [],
    commonly_confused_with: [],
    common_styles: [],
    common_regions: [],
    common_grapes: [],
    related_techniques: [],
    serving_implications: [],
    beginner_notes: "",
    faq: [],
    seo_title: "",
    seo_description: "",
    ...entry,
    id: entry.id ?? entry.slug,
  };
}

const entities = [
  // —— Microbial (4) ——
  fault({
    slug: "brettanomyces",
    name: "Brettanomyces",
    aliases: ["Brett", "Brett yeast", "Dekkera"],
    classification: "Microbial",
    summary:
      "Brettanomyces is a spoilage yeast that produces earthy, leathery, and barnyard-like aromas in wine. At low levels some drinkers accept subtle savory notes in Rhône and Burgundy reds, but pronounced Brett reads as a microbial fault that masks fruit and terroir.",
    cause: "Spoilage yeast (Brettanomyces bruxellensis and related strains) metabolizing hydroxycinnamic acids into volatile phenols.",
    how_it_occurs:
      "Brett survives in barrel wood, transfer lines, and unsanitized equipment. It grows slowly during aging when alcohol, pH, and free SO₂ are insufficient to suppress it — especially in wines with residual sugar or low intervention.",
    prevention:
      "Rigorous cellar hygiene, steam-cleaning barrels, maintaining adequate free SO₂, pH management, and early detection via sensory and lab testing. Some producers sterile-filter before bottling.",
    severity: "medium",
    creates_descriptors: ["barnyard", "leathery", "earthy", "musky"],
    reduces_descriptors: ["fresh", "bright", "clean", "elegant"],
    commonly_confused_with: ["native-fermentation", "earthy"],
    common_styles: ["pinot-noir", "syrah-shiraz", "nebbiolo", "grenache"],
    common_regions: ["rhone-valley", "burgundy", "napa-valley", "barossa-valley"],
    common_grapes: ["pinot-noir", "cabernet-sauvignon"],
    related_techniques: ["native-fermentation", "barrel-aging", "unfiltered-bottling"],
    serving_implications: ["extended-decant", "drink-now"],
    beginner_notes:
      "Brett smells like barnyard, leather, or band-aids — not the same as intentional earthy terroir. A little divides opinion; a lot is clearly faulty.",
    faq: [
      {
        q: "Can you smell Brett before opening the bottle?",
        a: "Often yes — barnyard or leather notes are apparent on the nose once the wine is poured, though low levels can be subtle.",
      },
      {
        q: "Is Brett always a fault?",
        a: "In formal judging, yes at high levels. Some traditional styles tolerate trace Brett, but it remains a microbial spoilage organism.",
      },
    ],
    seo_title: "Brettanomyces — Wine Fault Guide",
    seo_description:
      "Brettanomyces (Brett) causes barnyard and leathery aromas in wine. Learn how it develops in barrel, how to spot it, and why cellar hygiene matters.",
  }),
  fault({
    slug: "acetobacter",
    name: "Acetobacter",
    aliases: ["Acetic acid bacteria", "Acetic spoilage", "Vinegar bacteria"],
    classification: "Microbial",
    summary:
      "Acetobacter converts ethanol into acetic acid, producing a sharp vinegar-like sourness and volatile acidity spike. The fault destroys balance and is irreversible once established at noticeable levels.",
    cause: "Acetic acid bacteria (Acetobacter and related genera) oxidizing ethanol to acetic acid in the presence of oxygen.",
    how_it_occurs:
      "Exposed wine surfaces, leaky barrels, poor topping, and unsanitized equipment invite Acetobacter. High pH, warm cellar temperatures, and oxidative handling accelerate growth.",
    prevention:
      "Minimize oxygen exposure, maintain SO₂, keep cellars cool, top barrels regularly, and sanitize all transfer equipment. Discard or treat affected lots before blending.",
    severity: "high",
    creates_descriptors: ["sour", "tart"],
    reduces_descriptors: ["fresh", "elegant", "complex", "refined"],
    commonly_confused_with: ["volatile-acidity", "ethyl-acetate"],
    common_styles: ["port", "sherry", "pinot-noir"],
    common_regions: ["beaujolais", "bordeaux", "napa-valley"],
    common_grapes: ["pinot-noir", "chardonnay"],
    related_techniques: ["native-fermentation", "barrel-aging"],
    serving_implications: ["drink-now"],
    beginner_notes:
      "If wine smells distinctly like vinegar or salad dressing, suspect acetic spoilage — not normal tartness.",
    faq: [
      {
        q: "Can acetic spoilage be fixed?",
        a: "No — once Acetobacter has raised acetic acid to fault levels, the wine cannot be corrected through decanting or aeration.",
      },
      {
        q: "How is this different from volatile acidity?",
        a: "Acetobacter is one source of VA. VA measures multiple volatile acids; Acetobacter specifically drives vinegar-like acetic character.",
      },
    ],
    seo_title: "Acetobacter — Wine Fault Guide",
    seo_description:
      "Acetobacter turns wine vinegary through acetic acid bacteria. Learn causes, sensory signs, and why oxygen control and topping prevent spoilage.",
  }),
  fault({
    slug: "lactobacillus",
    name: "Lactobacillus",
    aliases: ["Lactic acid bacteria spoilage", "LAB spoilage", "Sauerkraut bacteria"],
    classification: "Microbial",
    summary:
      "Lactobacillus spoilage produces sour, cheesy, and sometimes mousy off-aromas when lactic acid bacteria grow outside controlled malolactic fermentation. The fault often appears in low-SO₂ or stuck wines with residual sugar.",
    cause: "Unwanted lactic acid bacteria (Lactobacillus and related LAB) metabolizing sugars and acids after primary fermentation.",
    how_it_occurs:
      "Stuck ferments, high pH, low SO₂, and warm cellars allow LAB to proliferate when MLF is incomplete or unintended. Dirty hoses and unsanitized tanks are common entry points.",
    prevention:
      "Complete primary fermentation, control pH, maintain SO₂, inoculate MLF deliberately when desired, and enforce strict sanitation. Monitor malic acid depletion.",
    severity: "medium",
    creates_descriptors: ["sour", "cheesy"],
    reduces_descriptors: ["fresh", "bright", "clean"],
    commonly_confused_with: ["malolactic-fermentation", "pediococcus", "mouse-taint"],
    common_styles: ["chardonnay", "pinot-noir", "grenache"],
    common_regions: ["burgundy", "beaujolais", "loire-valley"],
    common_grapes: ["chardonnay", "pinot-noir"],
    related_techniques: ["malolactic-fermentation", "native-fermentation"],
    serving_implications: ["drink-now"],
    beginner_notes:
      "Controlled MLF is intentional; unwanted Lactobacillus growth smells sour or cheesy without the intended buttery integration.",
    faq: [
      {
        q: "Is Lactobacillus the same as malolactic fermentation?",
        a: "MLF uses beneficial LAB deliberately. Spoilage Lactobacillus grows uncontrolled and produces off-aromas beyond normal malic conversion.",
      },
      {
        q: "Can filtration remove this fault?",
        a: "Sterile filtration can remove bacteria before they spoil the wine, but sensory damage already done cannot be reversed.",
      },
    ],
    seo_title: "Lactobacillus — Wine Fault Guide",
    seo_description:
      "Lactobacillus spoilage causes sour, cheesy off-aromas in wine. Understand how unwanted LAB growth differs from controlled malolactic fermentation.",
  }),
  fault({
    slug: "pediococcus",
    name: "Pediococcus",
    aliases: ["Pediococcus spoilage", "Diacetyl bacteria", "Sauerkraut fault"],
    classification: "Microbial",
    summary:
      "Pediococcus is a lactic acid bacteria that can produce intense buttery diacetyl, viscous texture, and cheesy or sauerkraut-like aromas. It often appears alongside stuck fermentations and high-pH wines.",
    cause: "Pediococcus damnosus and related strains growing in wine with residual sugar and insufficient SO₂ protection.",
    how_it_occurs:
      "Stuck or sluggish ferments with remaining sugar create ideal conditions. Biofilms in hoses and tanks harbor Pediococcus, which spreads during racking and blending.",
    prevention:
      "Avoid stuck ferments through nutrient management, lower pH, adequate SO₂, and sanitation. Do not blend affected lots without lab confirmation.",
    severity: "high",
    creates_descriptors: ["cheesy", "buttery", "sour"],
    reduces_descriptors: ["clean", "elegant", "refined"],
    commonly_confused_with: ["diacetyl-excess", "malolactic-fermentation", "lactobacillus"],
    common_styles: ["chardonnay", "pinot-noir", "grenache"],
    common_regions: ["burgundy", "beaujolais", "willamette-valley"],
    common_grapes: ["chardonnay", "pinot-noir"],
    related_techniques: ["malolactic-fermentation", "native-fermentation"],
    serving_implications: ["drink-now"],
    beginner_notes:
      "Pediococcus can make wine smell like buttered popcorn gone wrong — thick, cheesy, and unbalanced.",
    faq: [
      {
        q: "Why does Pediococcus create buttery notes?",
        a: "It produces diacetyl — the same compound from MLF — but at levels and in contexts that read as spoilage rather than integration.",
      },
      {
        q: "Is this fault reversible?",
        a: "No — once Pediococcus has altered the wine's chemistry and texture, the damage is permanent.",
      },
    ],
    seo_title: "Pediococcus — Wine Fault Guide",
    seo_description:
      "Pediococcus spoilage creates cheesy, buttery off-aromas and viscous texture. Learn how stuck ferments and low SO₂ invite this lactic bacteria fault.",
  }),

  // —— Chemical (6) ——
  fault({
    slug: "cork-taint",
    name: "Cork Taint",
    aliases: ["TCA", "Corked wine", "2,4,6-trichloroanisole"],
    classification: "Chemical",
    summary:
      "Cork taint is caused primarily by TCA (2,4,6-trichloroanisole), a chlorophenol compound that imparts musty, damp cardboard aromas and flattens fruit. It is the most widely recognized wine fault among consumers and sommeliers.",
    cause: "TCA and related chloroanisole compounds — often from contaminated corks, but also from barrels, cellars, or packaging materials.",
    how_it_occurs:
      "Chlorophenols from sanitizers, wood treatments, or environmental exposure convert to TCA via fungal metabolism. The compound transfers to wine at parts-per-trillion thresholds through cork contact or cellar contamination.",
    prevention:
      "Source quality corks, test for TCA, use alternative closures where appropriate, and avoid chlorophenol-based sanitizers in cellars and cooperages.",
    severity: "critical",
    creates_descriptors: ["earthy", "flat", "musky"],
    reduces_descriptors: ["fresh", "bright", "floral", "juicy"],
    commonly_confused_with: ["geosmin", "brettanomyces"],
    common_styles: ["cabernet-sauvignon", "nebbiolo", "champagne", "merlot"],
    common_regions: ["bordeaux", "burgundy", "napa-valley", "champagne"],
    common_grapes: ["cabernet-sauvignon", "pinot-noir", "chardonnay"],
    related_techniques: ["barrel-aging"],
    serving_implications: ["drink-now"],
    beginner_notes:
      "A corked wine smells like wet basement or musty newspaper — not crumbled cork bits in the glass. The cork itself may look fine.",
    faq: [
      {
        q: "Can you taste TCA if you can't smell it?",
        a: "Yes — TCA often mutes fruit and shortens the finish even when the musty note is subtle. The wine tastes flat or hollow.",
      },
      {
        q: "Does screw cap eliminate cork taint?",
        a: "Screw caps remove cork as a TCA vector, but cellar or barrel TCA can still affect any wine regardless of closure.",
      },
    ],
    seo_title: "Cork Taint (TCA) — Wine Fault Guide",
    seo_description:
      "Cork taint (TCA) causes musty, flat wine from contaminated corks or cellars. Learn to detect it, why it ruins fruit, and how producers prevent it.",
  }),
  fault({
    slug: "oxidation",
    name: "Oxidation",
    aliases: ["Oxidized wine", "Oxygen spoilage", "Aerobic spoilage"],
    classification: "Chemical",
    summary:
      "Oxidation occurs when wine absorbs excessive oxygen, shifting color toward brown or brick tones and developing nutty, caramel, or bruised-apple aromas. Some styles embrace controlled oxidation; unplanned oxidation is a fault in most table wines.",
    cause: "Excessive oxygen exposure accelerating aldehyde formation and browning reactions in wine.",
    how_it_occurs:
      "Permeable closures, ullage in aged bottles, leaky barrels, excessive racking, and poor cellar temperature accelerate oxidation. Low SO₂ and high pH wines are especially vulnerable.",
    prevention:
      "Maintain adequate free SO₂, minimize headspace, use inert gas during transfers, store cool and dark, and choose appropriate closures for intended aging.",
    severity: "medium",
    creates_descriptors: ["oxidized", "nutty", "caramel"],
    reduces_descriptors: ["fresh", "bright", "floral", "juicy"],
    commonly_confused_with: ["maderization", "premature-oxidation", "acetaldehyde"],
    common_styles: ["sherry", "port", "chardonnay", "riesling"],
    common_regions: ["burgundy", "jerez", "douro", "bordeaux"],
    common_grapes: ["chardonnay", "riesling", "pinot-noir"],
    related_techniques: ["barrel-aging", "solera-system", "fortification"],
    serving_implications: ["drink-now", "extended-decant"],
    beginner_notes:
      "Oxidized white wine turns deeper gold or brown and smells nutty or like dried apple — different from intentional Sherry oxidation.",
    faq: [
      {
        q: "Can oxidation be reversed?",
        a: "No — once aldehydes and browning develop, oxidation cannot be undone. Young oxidized wines may improve slightly with time but remain altered.",
      },
      {
        q: "Is all oxygen bad for wine?",
        a: "Small controlled oxygen during barrel aging aids integration. The fault is unplanned, excessive exposure that overwhelms fruit.",
      },
    ],
    seo_title: "Oxidation — Wine Fault Guide",
    seo_description:
      "Oxidation browns wine and adds nutty, caramel notes when oxygen exposure is excessive. Learn causes, sensory signs, and prevention during cellaring.",
  }),
  fault({
    slug: "reduction",
    name: "Reduction",
    aliases: ["Reductive notes", "Reductive winemaking fault", "Stinky ferment"],
    classification: "Chemical",
    summary:
      "Reduction refers to volatile sulfur compounds formed under oxygen-poor conditions, producing rubber, struck match, or cabbage-like aromas. Mild reduction can blow off with aeration; severe cases indicate a chemical fault.",
    cause: "Volatile sulfur compounds (H₂S, mercaptans, disulfides) formed when yeast or wine chemistry lacks adequate oxygen during fermentation or aging.",
    how_it_occurs:
      "Overly reductive fermentations, deficient yeast nutrients, heavy lees contact without oxygen, and stainless-steel aging without racking can trap sulfur compounds. Bottle closure can preserve mild reduction.",
    prevention:
      "Adequate yeast nutrition, controlled oxygen at key stages, copper fining when appropriate, and early sensory monitoring during fermentation.",
    severity: "medium",
    creates_descriptors: ["rubber", "vegetal"],
    reduces_descriptors: ["fresh", "floral", "bright"],
    commonly_confused_with: ["hydrogen-sulfide", "mercaptans", "sulfur-dioxide-excess"],
    common_styles: ["chardonnay", "riesling", "champagne", "sauvignon-blanc"],
    common_regions: ["burgundy", "champagne", "marlborough", "mosel"],
    common_grapes: ["chardonnay", "riesling", "sauvignon-blanc"],
    related_techniques: ["lees-aging", "stainless-steel-aging", "traditional-method"],
    serving_implications: ["extended-decant", "splash-decant"],
    beginner_notes:
      "A struck-match smell on a young white may blow off with decanting — that's mild reduction, not always a permanent fault.",
    faq: [
      {
        q: "Will decanting fix reduction?",
        a: "Mild reduction often dissipates with aeration. Severe mercaptans or disulfides may persist or worsen with exposure.",
      },
      {
        q: "Is reductive winemaking always a fault?",
        a: "Deliberate low-oxygen handling is a technique. The fault is when sulfur compounds exceed acceptable sensory thresholds.",
      },
    ],
    seo_title: "Reduction — Wine Fault Guide",
    seo_description:
      "Reduction creates rubber and struck-match aromas from volatile sulfur in low-oxygen winemaking. Learn mild vs severe cases, causes, and possible fixes.",
  }),
  fault({
    slug: "volatile-acidity",
    name: "Volatile Acidity",
    aliases: ["VA", "Volatile acid fault", "High VA"],
    classification: "Chemical",
    summary:
      "Volatile acidity measures acetic acid and other short-chain volatile acids that produce vinegar-like sharpness and nail-polish lift at high levels. Trace VA can add complexity; excessive VA is a chemical fault that dominates the palate.",
    cause: "Elevated acetic acid and related volatile acids from bacterial activity, oxidation, or stressed fermentations.",
    how_it_occurs:
      "Acetobacter, oxidative handling, and warm storage raise VA over time. Some hot-climate vintages and natural wines show higher baseline VA before becoming faulty.",
    prevention:
      "Oxygen control, SO₂ management, cool cellars, sanitation, and monitoring VA levels through analysis before bottling and release.",
    severity: "medium",
    creates_descriptors: ["sour", "tart"],
    reduces_descriptors: ["elegant", "refined", "complex"],
    commonly_confused_with: ["acetobacter", "ethyl-acetate"],
    common_styles: ["nebbiolo", "grenache", "port"],
    common_regions: ["piedmont", "beaujolais", "rhone-valley"],
    common_grapes: ["pinot-noir", "cabernet-sauvignon"],
    related_techniques: ["native-fermentation", "barrel-aging"],
    serving_implications: ["drink-now"],
    beginner_notes:
      "A little VA can smell like balsamic lift; too much reads as straight vinegar or nail polish remover.",
    faq: [
      {
        q: "Is some VA acceptable?",
        a: "Yes — many traditional wines show trace VA that adds aromatic lift. Fault thresholds depend on style and regional norms.",
      },
      {
        q: "Can VA be reduced after bottling?",
        a: "No — volatile acidity is stable in bottle. Prevention and blending decisions must happen before release.",
      },
    ],
    seo_title: "Volatile Acidity — Wine Fault Guide",
    seo_description:
      "Volatile acidity (VA) adds vinegar-like sharpness when acetic acid rises too high. Learn acceptable trace levels vs fault thresholds in table wine.",
  }),
  fault({
    slug: "sulfur-dioxide-excess",
    name: "Sulfur Dioxide Excess",
    aliases: ["SO₂ excess", "Sulfur burn", "Sulfite fault"],
    classification: "Chemical",
    summary:
      "Excess sulfur dioxide produces sharp burnt-match, rubber band, or metallic aromas that mask fruit. SO₂ is essential for preservation, but over-addition or poor integration creates an obvious chemical fault.",
    cause: "Over-addition of sulfur dioxide or free SO₂ remaining too high at bottling without adequate conditioning time.",
    how_it_occurs:
      "Heavy SO₂ additions at crush, bottling, or shipping — especially in wines with low pH binding less SO₂ — leave perceptible free sulfur. Poor dissolution or timing can concentrate the effect.",
    prevention:
      "Calculate additions carefully, allow conditioning time before bottling, and taste for integration. Adjust free SO₂ targets to wine chemistry.",
    severity: "low",
    creates_descriptors: ["rubber", "vegetal"],
    reduces_descriptors: ["fresh", "floral", "juicy"],
    commonly_confused_with: ["reduction", "hydrogen-sulfide"],
    common_styles: ["riesling", "sauvignon-blanc", "gewurztraminer", "chenin-blanc"],
    common_regions: ["alsace", "marlborough", "mosel", "loire-valley"],
    common_grapes: ["riesling", "sauvignon-blanc"],
    related_techniques: ["filtration", "cold-stabilization"],
    serving_implications: ["splash-decant", "extended-decant"],
    beginner_notes:
      "If a young white smells like burnt matches, let it breathe — excess SO₂ often dissipates within minutes.",
    faq: [
      {
        q: "Will aeration fix sulfur burn?",
        a: "Often yes for excess free SO₂ — swirling or decanting releases volatile sulfur compounds and fruit may emerge.",
      },
      {
        q: "Is this an allergy concern?",
        a: "SO₂ sensitivity is real for some drinkers, but the fault described here is a sensory issue from over-addition, not trace legal levels.",
      },
    ],
    seo_title: "Sulfur Dioxide Excess — Wine Fault Guide",
    seo_description:
      "Excess sulfur dioxide causes burnt-match aromas that mask fruit. Learn why SO₂ over-addition happens at bottling and when aeration helps integration.",
  }),
  fault({
    slug: "hydrogen-sulfide",
    name: "Hydrogen Sulfide",
    aliases: ["H₂S", "Rotten egg smell", "Sulfide fault"],
    classification: "Chemical",
    summary:
      "Hydrogen sulfide produces rotten-egg or sewer-like aromas when yeast ferment under stress or in oxygen-starved conditions. Low levels may dissipate; persistent H₂S indicates a serious fermentation fault.",
    cause: "Yeast reducing sulfur-containing amino acids under nutrient deficiency, high solids, or reductive ferment conditions.",
    how_it_occurs:
      "Stressed ferments — especially with weak yeast nutrition, high Brix, or excessive lees — generate H₂S during primary fermentation. It can bind into heavier mercaptans if not addressed early.",
    prevention:
      "Adequate YAN and nutrient additions, yeast strain selection, early H₂S monitoring, copper fining when caught in tank, and controlled aeration.",
    severity: "high",
    creates_descriptors: ["rubber", "tar", "vegetal"],
    reduces_descriptors: ["fresh", "floral", "bright"],
    commonly_confused_with: ["reduction", "mercaptans"],
    common_styles: ["chardonnay", "cabernet-sauvignon", "syrah-shiraz"],
    common_regions: ["napa-valley", "bordeaux", "rhone-valley"],
    common_grapes: ["chardonnay", "cabernet-sauvignon"],
    related_techniques: ["inoculated-fermentation", "alcoholic-fermentation"],
    serving_implications: ["splash-decant"],
    beginner_notes:
      "Rotten egg on the nose at fermentation usually means nutrient stress — in bottle it signals a serious fault unlikely to improve.",
    faq: [
      {
        q: "Can copper fix hydrogen sulfide?",
        a: "Copper fining in tank can bind H₂S before bottling. Once bottled at fault levels, options are essentially none.",
      },
      {
        q: "Does H₂S become mercaptans?",
        a: "Yes — untreated H₂S can evolve into harder-to-remove mercaptans and disulfides, worsening the fault.",
      },
    ],
    seo_title: "Hydrogen Sulfide — Wine Fault Guide",
    seo_description:
      "Hydrogen sulfide (H₂S) creates rotten-egg aromas from stressed yeast ferments. Learn causes, early cellar fixes, and why bottle H₂S rarely improves.",
  }),

  // —— Physical (5) ——
  fault({
    slug: "heat-damage",
    name: "Heat Damage",
    aliases: ["Cooked storage", "Thermal damage", "Heat exposure"],
    classification: "Physical",
    summary:
      "Heat damage occurs when wine is stored or shipped at sustained high temperatures, accelerating oxidation and producing jammy, pruny, or stewed fruit character. The fault is common in wines left in hot cars, warehouses, or poorly climate-controlled storage.",
    cause: "Prolonged exposure to temperatures typically above 25°C (77°F), accelerating chemical degradation and expansion that can compromise closures.",
    how_it_occurs:
      "Summer shipping, retail floor heat, attic storage, and trunk transport push wine past safe thermal limits. Protruding corks and seepage are physical warning signs alongside flavor change.",
    prevention:
      "Climate-controlled storage and shipping, insulated packaging, avoiding trunk storage, and monitoring warehouse conditions year-round.",
    severity: "high",
    creates_descriptors: ["jammy", "flat", "caramel"],
    reduces_descriptors: ["fresh", "bright", "elegant", "refined"],
    commonly_confused_with: ["cooked-wine", "maderization", "oxidation"],
    common_styles: ["cabernet-sauvignon", "merlot", "zinfandel", "port"],
    common_regions: ["napa-valley", "mendoza", "barossa-valley"],
    common_grapes: ["cabernet-sauvignon", "pinot-noir"],
    related_techniques: ["barrel-aging"],
    serving_implications: ["drink-now", "served-too-warm"],
    beginner_notes:
      "If a wine smells pruny or stewed and the cork pushed out, heat — not age — is the likely culprit.",
    faq: [
      {
        q: "Can heat-damaged wine recover?",
        a: "No — thermal degradation is permanent. Cooling the bottle stops further damage but does not restore original character.",
      },
      {
        q: "What temperature is safe for storage?",
        a: "Ideally 10–15°C (50–59°F) consistently. Brief spikes are less harmful than sustained heat above 25°C.",
      },
    ],
    seo_title: "Heat Damage — Wine Fault Guide",
    seo_description:
      "Heat damage stewes wine through hot storage or shipping. Learn signs like protruding corks, pruny flavors, and safe long-term cellaring temperatures.",
  }),
  fault({
    slug: "lightstrike",
    name: "Lightstrike",
    aliases: ["Light strike", "Goût de lumière", "UV damage"],
    classification: "Physical",
    summary:
      "Lightstrike occurs when UV and visible light react with riboflavin and sulfur amino acids in wine, producing rubbery, cabbage, and wet-wool aromas. Clear and pale bottles in retail display are especially vulnerable.",
    cause: "Photochemical reaction between light (especially UV/blue wavelengths) and wine compounds forming dimethyl disulfide and related volatiles.",
    how_it_occurs:
      "Shop windows, refrigerator lights, and clear glass bottles expose wine to damaging wavelengths within hours to days. Sparkling and delicate whites in clear glass are highest risk.",
    prevention:
      "Use dark or UV-protective glass, avoid fluorescent retail lighting, store in cartons, and keep bottles away from direct light at all stages.",
    severity: "high",
    creates_descriptors: ["rubber", "vegetal", "flat"],
    reduces_descriptors: ["fresh", "floral", "bright"],
    commonly_confused_with: ["reduction", "sulfur-dioxide-excess"],
    common_styles: ["champagne", "prosecco", "sauvignon-blanc", "riesling"],
    common_regions: ["champagne", "marlborough", "mosel", "loire-valley"],
    common_grapes: ["riesling", "sauvignon-blanc", "chardonnay"],
    related_techniques: ["traditional-method", "charmant-method"],
    serving_implications: ["chilled", "sparkling-chilled"],
    beginner_notes:
      "That rubbery note in a shop-display Sauvignon Blanc may be light damage — not the grape variety.",
    faq: [
      {
        q: "Does lightstrike affect red wine?",
        a: "Less often — dark glass and higher phenolic content offer protection. Pale wines in clear bottles are most at risk.",
      },
      {
        q: "Is lightstrike reversible?",
        a: "No — photochemical damage is permanent once dimethyl disulfide and related compounds form.",
      },
    ],
    seo_title: "Lightstrike — Wine Fault Guide",
    seo_description:
      "Lightstrike (goût de lumière) creates rubbery off-aromas when UV light hits pale wine in clear bottles. Learn prevention in shops and homes.",
  }),
  fault({
    slug: "refermentation",
    name: "Refermentation",
    aliases: ["Secondary bottle fermentation", "Fizzy fault", "Bottle ferment"],
    classification: "Physical",
    summary:
      "Refermentation happens when residual sugar or malic acid ferments in bottle, creating unintended spritz, turbidity, and off-aromas. It can push corks and indicates incomplete stabilization before bottling.",
    cause: "Yeast or bacteria fermenting residual sugar or malic acid in bottle under warm conditions after an incomplete sterile bottling.",
    how_it_occurs:
      "Bottling with residual sugar and viable microbes, insufficient SO₂, or incomplete MLF allows slow in-bottle fermentation. Warm storage accelerates the process.",
    prevention:
      "Ensure fermentation completeness, sterile filtration when appropriate, adequate SO₂ at bottling, and cold stabilization of microbial loads.",
    severity: "high",
    creates_descriptors: ["tart", "sour"],
    reduces_descriptors: ["clean", "refined", "elegant"],
    commonly_confused_with: ["cloudiness", "bottle-shock"],
    common_styles: ["riesling", "gewurztraminer", "chenin-blanc", "grenache"],
    common_regions: ["loire-valley", "alsace", "beaujolais"],
    common_grapes: ["riesling", "chardonnay"],
    related_techniques: ["malolactic-fermentation", "filtration", "unfiltered-bottling"],
    serving_implications: ["chilled", "drink-now"],
    beginner_notes:
      "Unexpected fizz in a still wine — especially with haze or pushed cork — usually means refermentation, not intentional pét-nat.",
    faq: [
      {
        q: "Is refermentation dangerous?",
        a: "Rarely a health risk in table wine, but pressure buildup can break glass. The wine is organoleptically faulty regardless.",
      },
      {
        q: "How is this different from pét-nat?",
        a: "Pét-nat is intentional ancestral-method sparkling. Refermentation is unplanned microbial activity in a wine meant to be still.",
      },
    ],
    seo_title: "Refermentation — Wine Fault Guide",
    seo_description:
      "Refermentation causes unintended fizz and haze when microbes ferment in bottle. Learn why incomplete stabilization and warm storage lead to this fault.",
  }),
  fault({
    slug: "protein-haze",
    name: "Protein Haze",
    aliases: ["Protein instability", "Heat haze", "White wine haze"],
    classification: "Physical",
    summary:
      "Protein haze is a visual fault where unstable grape proteins precipitate as a cloudy or milky suspension, often triggered by warm storage. The wine may taste unchanged but appears unappealing and suggests inadequate fining.",
    cause: "Heat-sensitive grape proteins aggregating when wine warms above typical cellar temperatures.",
    how_it_occurs:
      "Insufficient bentonite or protein stabilization before bottling leaves proteins that coagulate in warm transit or retail storage. Some varieties are naturally higher in unstable protein.",
    prevention:
      "Bentonite fining, heat stability testing, and cold conditioning before bottling to precipitate proteins in tank rather than in bottle.",
    severity: "low",
    creates_descriptors: ["flat"],
    reduces_descriptors: ["bright", "clean"],
    commonly_confused_with: ["cloudiness", "tartrate-crystals"],
    common_styles: ["sauvignon-blanc", "riesling", "gewurztraminer", "chenin-blanc"],
    common_regions: ["marlborough", "mosel", "alsace", "loire-valley"],
    common_grapes: ["sauvignon-blanc", "riesling"],
    related_techniques: ["fining", "filtration", "cold-stabilization"],
    serving_implications: ["chilled"],
    beginner_notes:
      "Cloudy white wine that tastes fine may be protein haze — harmless but a quality control failure, not intentional natural wine character.",
    faq: [
      {
        q: "Is protein haze harmful to drink?",
        a: "No — it is a visual stability fault. The proteins are natural grape material, not microbial spoilage.",
      },
      {
        q: "Will chilling clear protein haze?",
        a: "Chilling may reduce visible haze temporarily, but the underlying instability remains without proper fining.",
      },
    ],
    seo_title: "Protein Haze — Wine Fault Guide",
    seo_description:
      "Protein haze clouds white wine when unstable proteins precipitate in heat. Learn why bentonite fining and heat stability testing prevent this fault.",
  }),
  fault({
    slug: "tartrate-crystals",
    name: "Tartrate Crystals",
    aliases: ["Wine diamonds", "Potassium bitartrate", "Cream of tartar"],
    classification: "Physical",
    summary:
      "Tartrate crystals are harmless potassium bitartrate or calcium tartrate deposits that form when wine is chilled, appearing as glass-like shards or sediment. They are a physical precipitation — not microbial — but consumers often mistake them for glass or spoilage.",
    cause: "Natural tartaric acid salts exceeding solubility when wine temperature drops.",
    how_it_occurs:
      "Cold storage, refrigeration, or winter transport lowers solubility and crystals form on corks, bottle walls, or as sediment. Wines not cold-stabilized are more prone.",
    prevention:
      "Cold stabilization before bottling to precipitate tartrates in tank, then racking off crystals before final packaging.",
    severity: "low",
    creates_descriptors: ["tart"],
    reduces_descriptors: ["clean"],
    commonly_confused_with: ["protein-haze", "cloudiness"],
    common_styles: ["riesling", "sauvignon-blanc", "chardonnay", "gewurztraminer"],
    common_regions: ["mosel", "marlborough", "alsace", "chile"],
    common_grapes: ["riesling", "sauvignon-blanc", "chardonnay"],
    related_techniques: ["cold-stabilization", "filtration"],
    serving_implications: ["chilled", "lightly-chilled"],
    beginner_notes:
      "Those glittery shards in a chilled white are tartrates — safe to drink. Decanting or filtering removes them if appearance matters.",
    faq: [
      {
        q: "Are tartrate crystals glass?",
        a: "No — they dissolve in warm water and are natural wine acids. They cannot cut glass and are safe to ingest.",
      },
      {
        q: "Do crystals mean the wine was poorly made?",
        a: "Not unsafe — but commercial whites are usually cold-stabilized to avoid consumer concern. Crystals indicate incomplete stabilization.",
      },
    ],
    seo_title: "Tartrate Crystals — Wine Fault Guide",
    seo_description:
      "Tartrate crystals (wine diamonds) form in cold wine as harmless sediment. Learn why they appear, that they are safe, and how cold stabilization prevents them.",
  }),

  // —— Sensory (5) ——
  fault({
    slug: "mouse-taint",
    name: "Mouse Taint",
    aliases: ["Mousiness", "Mouse cage", "Mousy taint"],
    classification: "Sensory",
    summary:
      "Mouse taint is a sensory fault producing rodent-cage or cracker-like aromas detectable mainly on the retro-nasal finish, especially in low-acid or pH-elevated wines. It is associated with certain lactic bacteria and natural winemaking with minimal SO₂.",
    cause: "Metabolites from Brettanomyces, Lactobacillus, or other microbes — often 2-ethyltetrahydropyridine and related compounds — at elevated pH.",
    how_it_occurs:
      "Low SO₂, high pH, incomplete fermentation, and ambient microbial loads allow mousy compound formation during aging. The fault often emerges months after bottling.",
    prevention:
      "Lower pH, adequate SO₂, clean sanitation, complete fermentation, and early microbial monitoring in low-intervention programs.",
    severity: "medium",
    creates_descriptors: ["sour", "earthy"],
    reduces_descriptors: ["fresh", "refined", "elegant"],
    commonly_confused_with: ["lactobacillus", "brettanomyces", "geosmin"],
    common_styles: ["grenache", "pinot-noir", "chenin-blanc"],
    common_regions: ["beaujolais", "loire-valley", "australia"],
    common_grapes: ["pinot-noir", "chardonnay"],
    related_techniques: ["native-fermentation", "unfiltered-bottling"],
    serving_implications: ["drink-now"],
    beginner_notes:
      "Mouse taint is felt on the back palate after swallowing — sip, wait, exhale through your nose. Normal sniffing may miss it.",
    faq: [
      {
        q: "Why is mousiness hard to smell?",
        a: "Mousy compounds are often protonated at wine pH and only volatilize on the less-acid retro-nasal path after swallowing.",
      },
      {
        q: "Can mouse taint develop after bottling?",
        a: "Yes — it frequently appears during bottle aging when pH and microbial conditions favor compound formation.",
      },
    ],
    seo_title: "Mouse Taint — Wine Fault Guide",
    seo_description:
      "Mouse taint (mousiness) creates rodent-cage retro-nasal off-flavors in low-SO₂ wines. Learn detection on the finish, causes, and microbial links.",
  }),
  fault({
    slug: "premature-oxidation",
    name: "Premature Oxidation",
    aliases: ["Premox", "Premature oxidized", "Early oxidation"],
    classification: "Sensory",
    summary:
      "Premature oxidation describes white wines — notably Burgundy Chardonnay — that oxidize years before expected maturity, showing dark color, nutty flavors, and lost freshness. The fault sparked major debate about closures, viticulture, and winemaking shifts in the 1990s–2000s.",
    cause: "Combination of excessive oxygen ingress, low SO₂, cork variability, and possibly vineyard or winemaking changes accelerating oxidative decline.",
    how_it_occurs:
      "Young white wines show brick tones and dried fruit within 2–5 years instead of decades. Multiple factors — cork quality, barrel regime, batonnage, botrytis pressure — likely interact rather than a single cause.",
    prevention:
      "Higher SO₂ at bottling, quality closures, oxygen-aware élevage, and careful lees management. Producers monitor dissolved oxygen at bottling.",
    severity: "high",
    creates_descriptors: ["oxidized", "nutty", "flat"],
    reduces_descriptors: ["fresh", "bright", "elegant", "refined"],
    commonly_confused_with: ["oxidation", "maderization"],
    common_styles: ["chardonnay", "chenin-blanc"],
    common_regions: ["burgundy", "beaujolais", "loire-valley"],
    common_grapes: ["chardonnay"],
    related_techniques: ["barrel-aging", "batonnage", "lees-aging", "malolactic-fermentation"],
    serving_implications: ["drink-now"],
    beginner_notes:
      "A 5-year-old white Burgundy that tastes like aged Sherry may be premox — not a deliberate oxidative style.",
    faq: [
      {
        q: "Is premox only a Burgundy problem?",
        a: "Burgundy Chardonnay was the epicenter, but early oxidation has been reported in other white wines worldwide.",
      },
      {
        q: "Can premox be predicted at purchase?",
        a: "Not reliably — bottle variation and cellar conditions matter. Reviews and provenance help assess risk.",
      },
    ],
    seo_title: "Premature Oxidation — Wine Fault Guide",
    seo_description:
      "Premature oxidation (premox) ages white wine too fast — dark color, nutty flavors. Learn Burgundy Chardonnay links, signs, and likely contributing causes.",
  }),
  fault({
    slug: "cooked-wine",
    name: "Cooked Wine",
    aliases: ["Stewed wine", "Madeirized table wine", "Pruny wine"],
    classification: "Sensory",
    summary:
      "Cooked wine shows stewed, pruny, or raisined fruit from excessive heat during production or storage — distinct from intentional sun-dried grape wines. The sensory profile flattens freshness and reads as thermally abused rather than gracefully aged.",
    cause: "Thermal degradation of fruit compounds during hot fermentation, overheated cellars, or prolonged high-temperature storage.",
    how_it_occurs:
      "Hot harvest conditions fermented without cooling, warehouse heat exposure, or sun-damaged fruit can all produce cooked character. Overlaps with heat damage when storage is the primary driver.",
    prevention:
      "Temperature-controlled ferments, shade during harvest transport, climate-controlled cellars, and rejecting sun-burnt fruit lots.",
    severity: "high",
    creates_descriptors: ["jammy", "flat", "caramel"],
    reduces_descriptors: ["fresh", "bright", "elegant", "juicy"],
    commonly_confused_with: ["heat-damage", "maderization", "oxidation"],
    common_styles: ["zinfandel", "cabernet-sauvignon", "merlot", "port"],
    common_regions: ["napa-valley", "barossa-valley", "mendoza"],
    common_grapes: ["cabernet-sauvignon", "pinot-noir"],
    related_techniques: ["warm-fermentation"],
    serving_implications: ["drink-now", "served-too-warm"],
    beginner_notes:
      "Cooked wine tastes like stewed prunes or jam left on the stove — not the same as rich, ripe fruit in a balanced wine.",
    faq: [
      {
        q: "Can cooked character come from the vineyard?",
        a: "Yes — sun-burnt or desiccated grapes on the vine can impart cooked notes before wine even reaches the cellar.",
      },
      {
        q: "Is cooked wine the same as heat damage?",
        a: "They overlap — heat damage emphasizes storage abuse; cooked wine describes the sensory result from multiple thermal sources.",
      },
    ],
    seo_title: "Cooked Wine — Wine Fault Guide",
    seo_description:
      "Cooked wine tastes stewed and pruny from heat in production or storage. Learn how it differs from ripe fruit, graceful aging, and heat damage.",
  }),
  fault({
    slug: "cloudiness",
    name: "Cloudiness",
    aliases: ["Hazy wine", "Turbidity", "Visual haze"],
    classification: "Sensory",
    summary:
      "Cloudiness is a visual fault where wine lacks brilliance and appears hazy or turbid due to suspended particles — proteins, microbes, yeast, or colloids. Some natural wines embrace haze intentionally; in commercial still wine it signals instability.",
    cause: "Suspended particulates including proteins, yeast cells, bacteria, or colloidal material not removed before bottling.",
    how_it_occurs:
      "Skipping fining and filtration, bottling with active lees, microbial growth, or protein instability leaves particles visible in glass. Haze may worsen with temperature swings.",
    prevention:
      "Appropriate fining, filtration, microbial control, and stability testing before release depending on intended style.",
    severity: "low",
    creates_descriptors: ["flat"],
    reduces_descriptors: ["bright", "clean"],
    commonly_confused_with: ["protein-haze", "refermentation", "unfiltered-bottling"],
    common_styles: ["grenache", "prosecco", "chenin-blanc"],
    common_regions: ["beaujolais", "loire-valley", "veneto"],
    common_grapes: ["pinot-noir", "chardonnay"],
    related_techniques: ["unfiltered-bottling", "fining", "filtration"],
    serving_implications: ["chilled", "extended-decant"],
    beginner_notes:
      "Hazy wine is not always faulty — some pét-nat and natural wines are meant to be cloudy. Context and intent matter.",
    faq: [
      {
        q: "Is cloudy wine safe?",
        a: "Usually yes if from lees or protein — but microbial haze from spoilage organisms indicates a faulty, unstable wine.",
      },
      {
        q: "Will decanting clear haze?",
        a: "Decanting may remove heavy sediment but not fine colloidal haze — only fining or filtration address that in production.",
      },
    ],
    seo_title: "Cloudiness — Wine Fault Guide",
    seo_description:
      "Cloudy wine lacks brilliance from suspended particles — proteins, yeast, or microbes. Learn when haze is a stability fault vs an intentional style choice.",
  }),
  fault({
    slug: "bottle-shock",
    name: "Bottle Shock",
    aliases: ["Bottle sickness", "Travel shock", "Dumb phase"],
    classification: "Sensory",
    summary:
      "Bottle shock is a temporary sensory condition where recently bottled or heavily agitated wine tastes muted, disjointed, or flat. The wine is not chemically spoiled — it typically recovers after weeks to months of rest.",
    cause: "Physical agitation and oxygen incorporation during bottling, shipping, or rough handling temporarily suppressing aromatic expression.",
    how_it_occurs:
      "Newly bottled wines, transatlantic shipments, and rough transport show closed aromatics and flat palate. The effect is most noticed in delicate whites and older reds.",
    prevention:
      "Allow post-bottling rest before release, minimize agitation during shipping, and advise consumers to wait before judging recently moved bottles.",
    severity: "low",
    creates_descriptors: ["flat"],
    reduces_descriptors: ["fresh", "bright", "complex"],
    commonly_confused_with: ["reduction", "cork-taint"],
    common_styles: ["chardonnay", "pinot-noir", "champagne", "nebbiolo"],
    common_regions: ["burgundy", "champagne", "napa-valley", "piedmont"],
    common_grapes: ["chardonnay", "pinot-noir"],
    related_techniques: ["traditional-method", "filtration"],
    serving_implications: ["drink-now", "no-decanting"],
    beginner_notes:
      "Wine tasted right off a hot delivery truck often shows bottle shock — set it aside for a few weeks before deciding.",
    faq: [
      {
        q: "How long does bottle shock last?",
        a: "Typically a few weeks to three months depending on wine style and storage conditions after shipment.",
      },
      {
        q: "Is bottle shock a permanent fault?",
        a: "No — it is a temporary dumb phase. The wine usually opens and integrates with rest.",
      },
    ],
    seo_title: "Bottle Shock — Wine Fault Guide",
    seo_description:
      "Bottle shock mutes wine after bottling or rough shipping. Learn why aromatics flatten temporarily, typical duration, and why rest before judging helps.",
  }),

  // —— Additional (10) ——
  fault({
    slug: "maderization",
    name: "Maderization",
    aliases: ["Madeirized", "Maderized wine", "Baked wine"],
    classification: "Additional",
    summary:
      "Maderization describes the oxidative, heat-driven transformation toward Madeira-like character — amber color, caramel, and nutty flavors — in table wines where it is unintended. It combines thermal and oxidative stress into a distinct sensory profile.",
    cause: "Combined prolonged heat exposure and oxidative chemistry mimicking accelerated Madeira maturation.",
    how_it_occurs:
      "Poor cellar conditions, attic storage, or repeated temperature cycling over years push table wines toward baked, nutty, tawny character. More severe than simple premature oxidation in thermal component.",
    prevention:
      "Stable cool cellaring, appropriate closures, SO₂ maintenance, and inventory rotation to avoid years of thermal abuse.",
    severity: "high",
    creates_descriptors: ["caramel", "nutty", "oxidized"],
    reduces_descriptors: ["fresh", "bright", "floral", "juicy"],
    commonly_confused_with: ["oxidation", "cooked-wine", "heat-damage"],
    common_styles: ["madeira", "sherry", "port", "chardonnay"],
    common_regions: ["madeira", "jerez", "douro", "burgundy"],
    common_grapes: ["chardonnay", "riesling"],
    related_techniques: ["fortification", "solera-system"],
    serving_implications: ["drink-now", "fortified-service"],
    beginner_notes:
      "Maderized table wine looks and tastes like weak Sherry or Madeira — not a compliment for a wine meant to be fresh.",
    faq: [
      {
        q: "Is maderization the same as oxidation?",
        a: "Related but distinct — maderization emphasizes heat-driven baked character alongside oxidative nuttiness.",
      },
      {
        q: "Can maderized wine improve?",
        a: "No — the baked, oxidative profile is permanent once established at fault levels.",
      },
    ],
    seo_title: "Maderization — Wine Fault Guide",
    seo_description:
      "Maderization bakes table wine toward caramel, nutty Madeira-like character through heat and oxygen. Learn sensory signs, causes, and cellar prevention tips.",
  }),
  fault({
    slug: "mercaptans",
    name: "Mercaptans",
    aliases: ["Thiols fault", "Ethyl mercaptan", "Cabbage smell"],
    classification: "Additional",
    summary:
      "Mercaptans are volatile sulfur compounds producing garlic, onion, cabbage, or skunk-like aromas when hydrogen sulfide is not remediated during winemaking. They are more persistent than H₂S and harder to remove once formed.",
    cause: "Ethyl mercaptan and related thiols formed from H₂S conversion or yeast sulfur metabolism under reductive conditions.",
    how_it_occurs:
      "Untreated H₂S, copper mistreatment, or prolonged reductive aging allows mercaptans to develop. They can form in bottle if precursor conditions exist.",
    prevention:
      "Early H₂S detection, proper copper fining protocols, adequate aeration at the right stage, and avoiding over-reductive cellaring.",
    severity: "high",
    creates_descriptors: ["rubber", "tar", "vegetal"],
    reduces_descriptors: ["fresh", "floral", "elegant"],
    commonly_confused_with: ["hydrogen-sulfide", "reduction"],
    common_styles: ["chardonnay", "riesling", "syrah-shiraz"],
    common_regions: ["burgundy", "rhone-valley", "napa-valley"],
    common_grapes: ["chardonnay", "riesling"],
    related_techniques: ["lees-aging", "alcoholic-fermentation"],
    serving_implications: ["splash-decant"],
    beginner_notes:
      "Mercaptans smell like cooked cabbage or rubber — worse than a brief struck-match note and unlikely to blow off.",
    faq: [
      {
        q: "Can mercaptans be removed?",
        a: "Limited options exist in tank (copper, aeration). In bottle, mercaptans are essentially permanent at fault levels.",
      },
      {
        q: "How do mercaptans relate to H₂S?",
        a: "H₂S often precedes mercaptans — treating H₂S early prevents evolution into harder-to-remove thiols.",
      },
    ],
    seo_title: "Mercaptans — Wine Fault Guide",
    seo_description:
      "Mercaptans cause cabbage and skunk-like sulfur aromas in wine. Learn how they form from hydrogen sulfide and why they persist once present in bottle.",
  }),
  fault({
    slug: "geosmin",
    name: "Geosmin",
    aliases: ["Earthy taint", "Muddy aroma", "Actinomycetes taint"],
    classification: "Additional",
    summary:
      "Geosmin produces intensely earthy, muddy, or beetroot-like aromas at extremely low detection thresholds. In wine it often traces to contaminated grapes, cellar biofilms, or water sources rather than typical fermentation faults.",
    cause: "Geosmin compound — typically microbial origin from Actinomycetes or certain molds — transferred into must or wine.",
    how_it_occurs:
      "Muddy vineyard conditions, contaminated irrigation water, dirty equipment biofilms, or cork and cellar mold can introduce geosmin. Even ng/L concentrations are sensorially apparent.",
    prevention:
      "Clean water sources, equipment sanitation, grape sorting, and rejecting muddy or flood-affected fruit.",
    severity: "high",
    creates_descriptors: ["earthy", "vegetal"],
    reduces_descriptors: ["fresh", "elegant", "refined", "floral"],
    commonly_confused_with: ["brettanomyces", "cork-taint"],
    common_styles: ["pinot-noir", "riesling", "sauvignon-blanc"],
    common_regions: ["burgundy", "marlborough", "loire-valley"],
    common_grapes: ["pinot-noir", "riesling"],
    related_techniques: ["native-fermentation"],
    serving_implications: ["drink-now"],
    beginner_notes:
      "Geosmin smells like wet soil after rain — distinct from Brett's barnyard leather and usually unmistakably muddy.",
    faq: [
      {
        q: "Can geosmin be removed from wine?",
        a: "Very difficult — sensory thresholds are so low that even minor contamination persists through production.",
      },
      {
        q: "Is geosmin a grape fault or cellar fault?",
        a: "Both pathways exist — vineyard mud exposure and cellar biofilms are common sources.",
      },
    ],
    seo_title: "Geosmin — Wine Fault Guide",
    seo_description:
      "Geosmin creates muddy, beetroot-like earthy aromas in wine at tiny concentrations. Learn vineyard and cellar sources of this difficult-to-remove taint.",
  }),
  fault({
    slug: "acetaldehyde",
    name: "Acetaldehyde",
    aliases: ["Ethanal", "Aldehyde fault", "Sherry-like taint"],
    classification: "Additional",
    summary:
      "Acetaldehyde is an oxidative compound producing bruised apple, nutty, or Sherry-like aromas when elevated in table wines. Sherry flor yeast deliberately manages acetaldehyde; in still table wine it signals uncontrolled oxidation.",
    cause: "Ethanol oxidation to acetaldehyde under aerobic conditions, often with acetobacter co-occurrence.",
    how_it_occurs:
      "Oxygen ingress during aging, weak SO₂, and microbial activity raise acetaldehyde. It can bind as bisulfite adducts, masking detection until wine is aerated.",
    prevention:
      "SO₂ management, oxygen-minimal handling, and monitoring aldehyde levels during élevage and before bottling.",
    severity: "medium",
    creates_descriptors: ["oxidized", "nutty", "tart"],
    reduces_descriptors: ["fresh", "floral", "bright", "juicy"],
    commonly_confused_with: ["oxidation", "maderization", "film-yeast"],
    common_styles: ["sherry", "chardonnay", "riesling"],
    common_regions: ["jerez", "burgundy", "rioja"],
    common_grapes: ["chardonnay", "riesling"],
    related_techniques: ["solera-system", "barrel-aging"],
    serving_implications: ["extended-decant", "drink-now"],
    beginner_notes:
      "Acetaldehyde smells like bruised apple or nail polish at high levels — in Sherry it's intentional; in Chardonnay it's a fault.",
    faq: [
      {
        q: "Does decanting reveal acetaldehyde?",
        a: "Aeration can release bound aldehydes, making the fault more apparent after swirling or decanting.",
      },
      {
        q: "Is acetaldehyde always bad?",
        a: "In Fino Sherry and flor-aged wines it defines style. In fresh table wines it indicates oxidative fault.",
      },
    ],
    seo_title: "Acetaldehyde — Wine Fault Guide",
    seo_description:
      "Acetaldehyde adds bruised-apple, Sherry-like notes when oxidation runs unchecked in table wine. Learn detection after aeration and winemaking prevention.",
  }),
  fault({
    slug: "ethyl-acetate",
    name: "Ethyl Acetate",
    aliases: ["Ethyl acetate taint", "Nail polish remover", "EA fault"],
    classification: "Additional",
    summary:
      "Ethyl acetate produces solvent-like, nail-polish-remover aromas when ester levels exceed sensory thresholds, often alongside acetic acid elevation. It signals bacterial spoilage or severely stressed fermentation chemistry.",
    cause: "Ester formed from ethanol and acetic acid — typically when acetobacter or oxidative spoilage raises acetic acid precursor levels.",
    how_it_occurs:
      "Warm oxidative storage, acetic acid bacteria, and stuck ferments drive ethyl acetate formation. It often co-occurs with volatile acidity.",
    prevention:
      "Sanitation, oxygen control, cool cellaring, and addressing VA before ethyl acetate accumulates.",
    severity: "high",
    creates_descriptors: ["sour", "tart"],
    reduces_descriptors: ["elegant", "refined", "complex"],
    commonly_confused_with: ["volatile-acidity", "acetobacter"],
    common_styles: ["grenache", "port"],
    common_regions: ["beaujolais", "bordeaux"],
    common_grapes: ["pinot-noir"],
    related_techniques: ["native-fermentation"],
    serving_implications: ["drink-now"],
    beginner_notes:
      "Nail polish remover on the nose means ethyl acetate — past the point of drinkability for most tasters.",
    faq: [
      {
        q: "Is ethyl acetate the same as volatile acidity?",
        a: "Related — VA measures acetic acid; ethyl acetate is a distinct ester often elevated alongside acetic spoilage.",
      },
      {
        q: "Can ethyl acetate be corrected?",
        a: "No practical correction exists once at fault levels in finished wine.",
      },
    ],
    seo_title: "Ethyl Acetate — Wine Fault Guide",
    seo_description:
      "Ethyl acetate causes nail-polish-remover aromas in wine from ester spoilage. Learn its link to acetic acid, bacterial faults, and why it is irreversible.",
  }),
  fault({
    slug: "diacetyl-excess",
    name: "Diacetyl Excess",
    aliases: ["Butter bomb", "Diacetyl fault", "Over-buttery"],
    classification: "Additional",
    summary:
      "Diacetyl excess occurs when buttery, butterscotch-like aroma from malolactic fermentation or bacterial spoilage overwhelms fruit and balance. Controlled diacetyl adds complexity in Chardonnay; excess reads as a sensory fault.",
    cause: "Elevated diacetyl from malolactic bacteria, Pediococcus, or delayed MLF without sufficient SO₂ post-MLF.",
    how_it_occurs:
      "Warm MLF, high pH, and bacterial stress push diacetyl above integration thresholds. Pediococcus spoilage can amplify buttery character into fault territory.",
    prevention:
      "Monitor MLF temperature and timing, adjust SO₂ after MLF completes, and test for bacterial spoilage before bottling.",
    severity: "medium",
    creates_descriptors: ["buttery", "cheesy"],
    reduces_descriptors: ["fresh", "bright", "floral"],
    commonly_confused_with: ["malolactic-fermentation", "pediococcus"],
    common_styles: ["chardonnay", "chenin-blanc"],
    common_regions: ["burgundy", "napa-valley", "marlborough"],
    common_grapes: ["chardonnay"],
    related_techniques: ["malolactic-fermentation", "lees-aging", "barrel-aging"],
    serving_implications: ["cool", "cellar-temperature"],
    beginner_notes:
      "A Chardonnay that smells like movie-theater butter — without fruit — likely has diacetyl excess, not balanced MLF.",
    faq: [
      {
        q: "Is buttery Chardonnay always a fault?",
        a: "No — intentional MLF produces moderate buttery notes. The fault is when diacetyl dominates and masks fruit.",
      },
      {
        q: "Will diacetyl fade in bottle?",
        a: "It can diminish slowly as diacetyl converts to less aromatic compounds, but severe excess may never integrate.",
      },
    ],
    seo_title: "Diacetyl Excess — Wine Fault Guide",
    seo_description:
      "Diacetyl excess makes wine smell overwhelmingly buttery from MLF or bacterial spoilage. Learn the difference between balanced integration and fault levels.",
  }),
  fault({
    slug: "smoke-taint",
    name: "Smoke Taint",
    aliases: ["Smoke exposure", "Bushfire taint", "Wildfire smoke"],
    classification: "Additional",
    summary:
      "Smoke taint imparts medicinal, ashy, or campfire-like aromas and a harsh retro-nasal finish when grapes absorb volatile phenols from wildfire smoke during ripening. The fault became critical in California, Australia, and other fire-prone regions.",
    cause: "Grape uptake of smoke-derived volatile phenols — notably guaiacol and 4-methylguaiacol — during véraison and ripening.",
    how_it_occurs:
      "Fresh smoke settling on vineyards during sensitive ripening stages allows phenols to bind in grape skins. Fermentation releases bound compounds into wine, often worsening perception.",
    prevention:
      "Smoke testing of fruit, selective picking, hand-sorting, reverse osmosis or carbon treatment in severe cases, and rejecting heavily affected lots.",
    severity: "critical",
    creates_descriptors: ["smoky", "tar", "vegetal"],
    reduces_descriptors: ["fresh", "floral", "elegant", "refined", "juicy"],
    commonly_confused_with: ["toasty", "oak-alternatives"],
    common_styles: ["pinot-noir", "chardonnay", "cabernet-sauvignon", "syrah-shiraz"],
    common_regions: ["napa-valley", "sonoma", "australia", "willamette-valley"],
    common_grapes: ["pinot-noir", "chardonnay", "cabernet-sauvignon"],
    related_techniques: ["reverse-osmosis", "flash-detente"],
    serving_implications: ["drink-now"],
    beginner_notes:
      "Smoke taint often hits harder on the finish than the nose — ash tray retro-nasal character is a telltale sign.",
    faq: [
      {
        q: "Can smoke taint be removed after fermentation?",
        a: "Partial remediation exists (reverse osmosis, carbon) but heavily affected wine is often unsalvageable for premium use.",
      },
      {
        q: "Does oak aging cause smoke taint?",
        a: "No — barrel toast is intentional. Smoke taint comes from vineyard wildfire exposure during grape ripening.",
      },
    ],
    seo_title: "Smoke Taint — Wine Fault Guide",
    seo_description:
      "Smoke taint from wildfire exposure gives wine ashy, medicinal flavors during grape ripening. Learn detection, retro-nasal signs, and vineyard risk factors.",
  }),
  fault({
    slug: "film-yeast",
    name: "Film Yeast",
    aliases: ["Surface yeast", "Flor spoilage", "Candida film"],
    classification: "Additional",
    summary:
      "Film yeast forms a surface pellicle on wine in tanks or barrels, causing oxidative spoilage with acetic, ethyl acetate, and Sherry-like notes outside intentional flor aging. It indicates unprotected wine exposed to oxygen.",
    cause: "Aerobic yeasts (Candida, Pichia, and related film-formers) growing on wine surfaces exposed to oxygen.",
    how_it_occurs:
      "Untopped barrels, open tanks, and ullaged vessels allow film yeast to colonize the surface. Unlike intentional Sherry flor, uncontrolled films drive random oxidation and VA elevation.",
    prevention:
      "Regular topping, inert gas blanketing, full vessels, SO₂ maintenance, and sanitation of cellar equipment.",
    severity: "high",
    creates_descriptors: ["oxidized", "nutty", "sour"],
    reduces_descriptors: ["fresh", "bright", "juicy"],
    commonly_confused_with: ["acetaldehyde", "acetobacter", "solera-system"],
    common_styles: ["sherry", "port", "madeira"],
    common_regions: ["jerez", "douro", "madeira"],
    common_grapes: ["chardonnay"],
    related_techniques: ["solera-system", "fortification", "barrel-aging"],
    serving_implications: ["drink-now"],
    beginner_notes:
      "A fuzzy film on wine in an open barrel is not romantic — it's spoilage unless you're making Sherry under controlled flor.",
    faq: [
      {
        q: "Is film yeast the same as Sherry flor?",
        a: "Sherry flor is a controlled Saccharomyces film. Spoilage film yeasts are uncontrolled and produce fault characters.",
      },
      {
        q: "Can wine under film yeast be saved?",
        a: "Often not — oxidative and acetic damage usually requires discarding or heavy remediation below premium quality.",
      },
    ],
    seo_title: "Film Yeast — Wine Fault Guide",
    seo_description:
      "Film yeast spoilage oxidizes wine through surface pellicles in untopped barrels. Learn how it differs from intentional Sherry flor and why it is irreversible.",
  }),
  fault({
    slug: "ladybug-taint",
    name: "Ladybug Taint",
    aliases: ["Lady beetle taint", "Harmonia axyridis taint", "MBMP taint"],
    classification: "Additional",
    summary:
      "Ladybug taint occurs when Asian lady beetles are inadvertently crushed with grapes at harvest, releasing methoxypyrazine-like compounds that produce peanut, bell pepper, and bitter herbal flavors. Even a few beetles per ton can taint wine.",
    cause: "2-isopropyl-3-methoxypyrazine (IPMP) and related compounds from Harmonia axyridis lady beetles in harvested fruit.",
    how_it_occurs:
      "Lady beetles seek grape clusters in cool pre-harvest weather. Mechanical harvesting and destemming crush beetles into must, releasing taint compounds that survive fermentation.",
    prevention:
      "Night harvesting, vineyard beetle monitoring, gentle sorting tables, and delaying pick until beetle pressure drops.",
    severity: "high",
    creates_descriptors: ["vegetal", "green", "earthy"],
    reduces_descriptors: ["fresh", "elegant", "refined", "floral"],
    commonly_confused_with: ["green", "vegetal"],
    common_styles: ["riesling", "pinot-noir", "chardonnay"],
    common_regions: ["germany", "australia", "usa", "france"],
    common_grapes: ["riesling", "pinot-noir", "chardonnay"],
    related_techniques: ["gentle-press", "whole-cluster-press"],
    serving_implications: ["drink-now"],
    beginner_notes:
      "Ladybug taint adds a bitter peanut or cilantro edge — different from normal pyrazine greenness in underripe Cabernet.",
    faq: [
      {
        q: "How many ladybugs cause taint?",
        a: "Research suggests as few as 1–2 beetles per kg of grapes can produce perceptible taint — very low tolerance.",
      },
      {
        q: "Can ladybug taint be removed?",
        a: "No reliable post-fermentation removal exists — prevention at harvest is the only effective strategy.",
      },
    ],
    seo_title: "Ladybug Taint — Wine Fault Guide",
    seo_description:
      "Ladybug taint adds peanut and bitter herbal notes when beetles are crushed at harvest. Learn why even a few Asian lady beetles can spoil an entire lot.",
  }),
  fault({
    slug: "ullage-oxidation",
    name: "Ullage Oxidation",
    aliases: ["Headspace oxidation", "Low fill oxidation", "Cellar ullage"],
    classification: "Additional",
    summary:
      "Ullage oxidation develops when wine in bottle or barrel has excessive headspace, allowing oxygen to degrade color, aroma, and flavor over time. Old bottles with low fill levels and untopped barrels are classic sources.",
    cause: "Prolonged oxygen contact through large headspace in bottle neck or barrel, accelerated by warm storage.",
    how_it_occurs:
      "Cork shrinkage, seepage, evaporation through cork, and failure to top barrels create ullage. Oxygen ingress browns wine and develops nutty, flat, oxidative character distinct from quick heat damage.",
    prevention:
      "Proper fill levels at bottling, quality corks, regular barrel topping, inert gas blanketing, and cool humid cellars.",
    severity: "medium",
    creates_descriptors: ["oxidized", "nutty", "flat"],
    reduces_descriptors: ["fresh", "bright", "complex", "elegant"],
    commonly_confused_with: ["oxidation", "maderization", "cork-taint"],
    common_styles: ["cabernet-sauvignon", "nebbiolo", "port", "pinot-noir"],
    common_regions: ["bordeaux", "burgundy", "piedmont", "napa-valley"],
    common_grapes: ["cabernet-sauvignon", "pinot-noir"],
    related_techniques: ["barrel-aging", "solera-system"],
    serving_implications: ["extended-decant", "drink-now"],
    beginner_notes:
      "A old bottle with wine below the cork shoulder and tawny color likely suffered ullage oxidation — not graceful maturity.",
    faq: [
      {
        q: "Is ullage always a fault?",
        a: "In aged collectibles, some ullage is expected — but beyond low-shoulder fill, oxidative fault risk rises sharply.",
      },
      {
        q: "Can ullage oxidation be slowed?",
        a: "Cool, humid storage slows progression, but existing ullage damage to aroma and color is irreversible.",
      },
    ],
    seo_title: "Ullage Oxidation — Wine Fault Guide",
    seo_description:
      "Ullage oxidation degrades wine when headspace allows oxygen ingress in bottle or barrel. Learn fill levels, tawny color signs, and long-term prevention.",
  }),
];

const EXPECTED_SLUGS = [
  "brettanomyces", "acetobacter", "lactobacillus", "pediococcus",
  "cork-taint", "oxidation", "reduction", "volatile-acidity", "sulfur-dioxide-excess", "hydrogen-sulfide",
  "heat-damage", "lightstrike", "refermentation", "protein-haze", "tartrate-crystals",
  "mouse-taint", "premature-oxidation", "cooked-wine", "cloudiness", "bottle-shock",
  "maderization", "mercaptans", "geosmin", "acetaldehyde", "ethyl-acetate", "diacetyl-excess",
  "smoke-taint", "film-yeast", "ladybug-taint", "ullage-oxidation",
];

function loadValidSlugs() {
  const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, "utf8"));
  const descriptorSlugs = new Set(
    Object.values(taxonomy.nodes)
      .filter((n) => n.type === "descriptor")
      .map((n) => n.slug)
  );
  const styleSlugs = new Set(
    JSON.parse(fs.readFileSync(STYLE_CATALOG, "utf8")).styles.map((s) => s.slug)
  );
  const regionSlugs = new Set(
    JSON.parse(fs.readFileSync(REGION_CATALOG, "utf8")).regions.map((r) => r.slug)
  );
  const servingSlugs = new Set(
    JSON.parse(fs.readFileSync(SERVING_CATALOG, "utf8")).entities.map((e) => e.slug)
  );
  const grapeSlugs = new Set(
    JSON.parse(fs.readFileSync(GRAPE_CATALOG, "utf8")).grapes.map((g) => g.slug)
  );
  const techniqueSlugs = new Set(
    JSON.parse(fs.readFileSync(TECHNIQUE_CATALOG, "utf8")).techniques.map((t) => t.slug)
  );
  return { descriptorSlugs, styleSlugs, regionSlugs, servingSlugs, grapeSlugs, techniqueSlugs, taxonomy };
}

function resolveConfusedTargetKind(slug, taxonomy, faultSlugs, techniqueSlugs) {
  if (faultSlugs.has(slug)) return "wine_fault";
  if (techniqueSlugs.has(slug)) return "winemaking_technique";
  const node = taxonomy.nodes[slug];
  if (node && (node.type === "descriptor" || node.entity_type === "descriptor")) return "descriptor";
  return null;
}

function validate(entities, valid) {
  const { descriptorSlugs, styleSlugs, regionSlugs, servingSlugs, grapeSlugs, techniqueSlugs, taxonomy } = valid;
  const faultSlugs = new Set(entities.map((e) => e.slug));
  const errors = [];

  if (entities.length !== 30) {
    errors.push(`Expected 30 entities, got ${entities.length}`);
  }

  for (const slug of EXPECTED_SLUGS) {
    if (!faultSlugs.has(slug)) errors.push(`Missing required slug: ${slug}`);
  }

  for (const entity of entities) {
    if (entity.entity_type !== "wine_fault") {
      errors.push(`${entity.slug}: entity_type must be wine_fault`);
    }
    if (!entity.summary || entity.summary.length < 50) {
      errors.push(`${entity.slug}: summary too short`);
    }
    if (!entity.cause) errors.push(`${entity.slug}: missing cause`);
    if (!entity.how_it_occurs) errors.push(`${entity.slug}: missing how_it_occurs`);
    if (!entity.prevention) errors.push(`${entity.slug}: missing prevention`);
    if (!["low", "medium", "high", "critical"].includes(entity.severity)) {
      errors.push(`${entity.slug}: invalid severity "${entity.severity}"`);
    }
    if (!entity.faq || entity.faq.length < 2) {
      errors.push(`${entity.slug}: faq must have at least 2 entries`);
    }
    if (!entity.seo_title) errors.push(`${entity.slug}: missing seo_title`);
    if (!entity.seo_description) errors.push(`${entity.slug}: missing seo_description`);
    const seoLen = entity.seo_description?.length ?? 0;
    if (seoLen < 140 || seoLen > 160) {
      errors.push(`${entity.slug}: seo_description length ${seoLen} (expected 140–160)`);
    }

    for (const d of [...(entity.creates_descriptors ?? []), ...(entity.reduces_descriptors ?? [])]) {
      if (!descriptorSlugs.has(d)) errors.push(`${entity.slug}: invalid descriptor "${d}"`);
    }
    for (const s of entity.common_styles ?? []) {
      if (!styleSlugs.has(s)) errors.push(`${entity.slug}: invalid common_style "${s}"`);
    }
    for (const r of entity.common_regions ?? []) {
      if (!regionSlugs.has(r)) errors.push(`${entity.slug}: invalid common_region "${r}"`);
    }
    for (const g of entity.common_grapes ?? []) {
      if (!grapeSlugs.has(g)) errors.push(`${entity.slug}: invalid common_grape "${g}"`);
    }
    for (const t of entity.related_techniques ?? []) {
      if (!techniqueSlugs.has(t)) errors.push(`${entity.slug}: invalid technique "${t}"`);
    }
    for (const srv of entity.serving_implications ?? []) {
      if (!servingSlugs.has(srv)) errors.push(`${entity.slug}: invalid serving_implication "${srv}"`);
    }
    for (const slug of entity.commonly_confused_with ?? []) {
      const kind = resolveConfusedTargetKind(slug, taxonomy, faultSlugs, techniqueSlugs);
      if (!kind) errors.push(`${entity.slug}: invalid commonly_confused_with "${slug}"`);
    }
  }

  if (errors.length) {
    console.error("✗ Validation failed:");
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }
}

function classificationBreakdown(entities) {
  const counts = {};
  for (const e of entities) {
    counts[e.classification] = (counts[e.classification] ?? 0) + 1;
  }
  return counts;
}

function main() {
  const valid = loadValidSlugs();
  validate(entities, valid);

  const catalog = {
    meta: {
      phase: "ONTOLOGY-01E",
      tier: 1,
      description: "Tier 1 launch wine fault entities — microbial, chemical, physical, sensory, and storage-related faults.",
      entity_count: entities.length,
      wine_ontology_version: "1.6",
      seeded: new Date().toISOString().slice(0, 10),
    },
    faults: entities,
  };

  fs.writeFileSync(OUT, JSON.stringify(catalog, null, 2) + "\n");

  const classifications = classificationBreakdown(entities);
  console.log(`✓ Wrote ${entities.length} entities to data/wine-fault-catalog.json`);
  console.log("Classifications:", classifications);
}

main();
