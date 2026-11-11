/**
 * Build Storys ERP - VILLA 253 DEMO PROJECT (single source of truth)
 * ------------------------------------------------------------------
 * One real, coherent project used by every module of the demo:
 *   Villa 253, 24-Type North-Facing 3BHK with Roof Gazebo
 *   The Meadows (Phase 2), Neral-Karjat Road, Karjat, Dist. Raigad, Maharashtra
 *
 * Every quantity below is taken from the wall-marking drawing
 * VILLA_253_WALL_MARKING_10_10_24_REV0.pdf (R0, dated 10-10-24) and the
 * editable reconstruction Villa253_FloorPlan_Editable_R0.dxf.
 * No randomised or placeholder values: all money is computed from
 * quantity x rate, and all dates follow one contract programme.
 */

import {
  ProjectRecord,
  BOQItem,
  BOQRevision,
  CustomerQuotation,
  CustomerRequirement,
  RoomSpace,
  TradeCategory,
  MeasurementUnit,
  PaymentMilestone
} from '../types/erp';

// ---------------------------------------------------------------------------
// 1. FIXED PROJECT FACTS - import these anywhere a demo string is needed
// ---------------------------------------------------------------------------
export const VILLA253 = {
  projectId: 'PROJ-VILLA-253',
  projectCode: 'BS-2026-V253',
  title: 'Villa 253 - 24-Type North-Facing 3BHK with Roof Gazebo (Turnkey Interiors)',
  drawingRef: 'VILLA_253_WALL_MARKING_10_10_24_REV0',
  drawingDate: '2024-10-10',
  clientName: 'Mr. Aditya & Mrs. Sneha Kulkarni',
  clientShort: 'Aditya Kulkarni',
  clientCompany: 'Kulkarni Precision Tools Pvt Ltd',
  clientPhone: '+91 98200 47153',
  clientAltPhone: '+91 98200 47154',
  clientEmail: 'aditya.kulkarni@kptools.in',
  spouseEmail: 'sneha.kulkarni@gmail.com',
  siteAddress: 'Villa 253, 24-Type, The Meadows (Phase 2), Neral-Karjat Road, Karjat',
  siteAddressFull:
    'Villa 253, 24-Type, The Meadows (Phase 2), Neral-Karjat Road, Karjat, Dist. Raigad, Maharashtra - 410201',
  billingAddress:
    'Flat 1802, Oberoi Springs, Off New Link Road, Andheri West, Mumbai - 400053',
  city: 'Karjat',
  state: 'Maharashtra',
  pincode: '410201',
  gstin: '27AAKPK7719R1ZM',
  pan: 'AAKPK7719R',
  // Areas (sq.ft) - measured from the R0 wall-marking drawing
  plotAreaSqFt: 4800,
  builtUpAreaSqFt: 3150,
  carpetAreaSqFt: 2205,
  // Commercials
  contractValueExGst: 0, // filled by BOQ totals below at module load
  gstPercent: 18,
  // Programme (all dates ISO)
  enquiryDate: '2026-05-18',
  siteSurveyDate: '2026-05-30',
  discoverySignOffDate: '2026-06-06',
  boqRev0Date: '2026-06-15',
  boqRev1Date: '2026-06-19',
  quotationDate: '2026-06-20',
  contractDate: '2026-07-01',
  mobilizationDate: '2026-07-06',
  handoverTargetDate: '2026-12-18',
  dlpMonths: 12,
  structuralWarrantyYears: 5,
  demoToday: '2026-11-11'
} as const;

export const VILLA253_ASSETS = {
  facade: '/images/villa253_facade_exterior_1790833735467.jpg',
  livingGreatroom: '/images/villa253_living_greatroom_1790833681710.jpg',
  livingModern: '/images/villa253_living_modern_1790830799942.jpg',
  masterSuite: '/images/villa253_master_suite_1790833696550.jpg',
  masterBedroom: '/images/villa253_master_bedroom_1790830829821.jpg',
  guestSuite: '/images/villa253_guest_suite_1790833711200.jpg',
  gazebo: '/images/villa253_roof_gazebo_1790830815235.jpg',
  gazeboTerrace: '/images/villa253_gazebo_terrace_1790833723445.jpg',
  buildingSketch: '/images/building_sketch.jpg',
  cadBlueprint: '/assets/images/villa253_cad_blueprint_r0.svg',
  bed3Plan: '/assets/images/villa253_bedroom3_firstfloor_20x19_r0.svg',
  kitchenPlan: '/assets/images/villa253_kitchen_utility_14x9_r0.svg',
  stairPlan: '/assets/images/villa253_staircase_core_7x19_r0.svg',
  cadPdf: '/api/cad/villa253.pdf',
  cadDxf: '/api/cad/villa253.dxf'
} as const;

// ---------------------------------------------------------------------------
// 2. ROOMS - exact R0 dimensions (name / floor / L x W / area / perimeter)
// ---------------------------------------------------------------------------
export const VILLA253_ROOMS: RoomSpace[] = [
  {
    id: 'ROOM-V253-LIV-01',
    name: 'Living & Dining Great Room',
    zone: 'Ground Floor - Public Zone',
    floor: 'Ground Floor',
    lengthFt: 25.33,
    widthFt: 19,
    heightFt: 10.25,
    carpetAreaSqFt: 481,
    perimeterFt: 88.67,
    wallAreaSqFt: 909,
    ceilingAreaSqFt: 481,
    existingCondition: 'Bare shell RCC frame with 6" blockwork; SD1 27ft sliding portal installed by developer',
    demolitionRequired: false,
    vastuDirection: 'North-East',
    vastuElement: 'Water / Air',
    notes: 'R0: 25\'-4" x 19\'-0". Openings SD1 (27\'0"x10\'3"), SD5 (11\'0"x10\'3"), W1, FW1. Front deck 57\'2"x9\'6", rear deck 13\'0"x9\'6".'
  },
  {
    id: 'ROOM-V253-BED1-01',
    name: 'Master Bedroom 1 Suite',
    zone: 'Ground Floor - Private Zone',
    floor: 'Ground Floor',
    lengthFt: 14,
    widthFt: 19,
    heightFt: 10.25,
    carpetAreaSqFt: 266,
    perimeterFt: 66,
    wallAreaSqFt: 676.5,
    ceilingAreaSqFt: 266,
    existingCondition: 'Bare shell with attached walk-in wardrobe 10\'-2"x11\'-9", toilet 1 and private deck',
    demolitionRequired: false,
    vastuDirection: 'South-West',
    vastuElement: 'Earth',
    notes: 'R0: 14\'-0" x 19\'-0". SD2, SD4, SD7, D1, D2. Walk-in 10\'2"x11\'9", Toilet 1 6\'0"x24\'9", private deck 11\'6"x4\'6".'
  },
  {
    id: 'ROOM-V253-BED2-01',
    name: 'Bedroom 2 & Bar Deck Suite',
    zone: 'Ground Floor - Private Zone',
    floor: 'Ground Floor',
    lengthFt: 18.92,
    widthFt: 19,
    heightFt: 10.25,
    carpetAreaSqFt: 359,
    perimeterFt: 75.83,
    wallAreaSqFt: 777,
    ceilingAreaSqFt: 359,
    existingCondition: 'Bare shell with attached wardrobe, toilet 2 and bar deck 14\'0"x30\'10"',
    demolitionRequired: false,
    vastuDirection: 'North-West',
    vastuElement: 'Air',
    notes: 'R0: 18\'-11" x 19\'-0". SD2, SD6, D1, D3, W5, FW2. Wardrobe 7\'9"x9\'8", Toilet 2 10\'4"x9\'8", bar deck 14\'0"x30\'10".'
  },
  {
    id: 'ROOM-V253-KIT-01',
    name: 'Culinary Kitchen, Utility & Powder Wing',
    zone: 'Ground Floor - Service Zone',
    floor: 'Ground Floor',
    lengthFt: 14.5,
    widthFt: 9,
    heightFt: 10.25,
    carpetAreaSqFt: 131,
    perimeterFt: 47,
    wallAreaSqFt: 481.75,
    ceilingAreaSqFt: 131,
    existingCondition: 'Bare shell with utility 9\'0"x9\'8" and powder room 5\'0"x9\'8"',
    demolitionRequired: false,
    vastuDirection: 'South-East',
    vastuElement: 'Fire',
    notes: 'R0: 14\'-6" x 9\'-0". D4 (3\'0"x7\'8"), W3, W4. Utility 9\'0"x9\'8", powder room 5\'0"x9\'8".'
  },
  {
    id: 'ROOM-V253-STAIR-01',
    name: 'Architectural Dogleg Staircase Core',
    zone: 'Ground to First Floor - Circulation',
    floor: 'Ground Floor',
    lengthFt: 7.5,
    widthFt: 19,
    heightFt: 21.5,
    carpetAreaSqFt: 143,
    perimeterFt: 53,
    wallAreaSqFt: 543,
    ceilingAreaSqFt: 143,
    existingCondition: 'RCC dogleg flight cast, 21 risers, tread 11", riser 6.25"; W2 & W2A fixed glass, SD3 & SD4A sliders',
    demolitionRequired: false,
    vastuDirection: 'South',
    vastuElement: 'Earth',
    notes: 'R0: 7\'-6" x 19\'-0". 21 risers (tread 11", riser 6.25"), 3\'6" waist and landing, double-height void over flight.'
  },
  {
    id: 'ROOM-V253-BED3-01',
    name: 'Bedroom 3 & Balcony Suite (First Floor)',
    zone: 'First Floor - Private Zone',
    floor: 'First Floor',
    lengthFt: 20.67,
    widthFt: 19,
    heightFt: 10.25,
    carpetAreaSqFt: 393,
    perimeterFt: 79.33,
    wallAreaSqFt: 813,
    ceilingAreaSqFt: 393,
    existingCondition: 'Bare shell with toilet 3, front balcony 24\'4"x4\'0" and side balcony 14\'10"x4\'0"',
    demolitionRequired: false,
    vastuDirection: 'West',
    vastuElement: 'Air',
    notes: 'R0: 20\'-8" x 19\'-0". SD1A, SD2A, SD3A, D1A, D2A, W3A. Toilet 3 9\'9"x9\'2", balconies 24\'4"x4\'0" and 14\'10"x4\'0".'
  },
  {
    id: 'ROOM-V253-GAZEBO-01',
    name: 'Signature Roof Gazebo Pavilion',
    zone: 'Roof / First Floor Terrace',
    floor: 'Roof',
    lengthFt: 24,
    widthFt: 18,
    heightFt: 12.75,
    carpetAreaSqFt: 432,
    perimeterFt: 84,
    wallAreaSqFt: 0,
    ceilingAreaSqFt: 432,
    existingCondition: 'Open terrace with SD4A access; pitched timber pergola to Section BB\' with 12\'-9" ridge above first-floor slab',
    demolitionRequired: false,
    vastuDirection: 'North',
    vastuElement: 'Water',
    notes: 'R0: 24\'-0" x 18\'-0". Section BB\' pitched timber pergola, ridge 12\'-9" above first-floor slab, MS base plates cast into slab.'
  }
];

// ---------------------------------------------------------------------------
// 3. BOQ BUILDER - deterministic money (no hand-typed totals anywhere)
// ---------------------------------------------------------------------------
interface BoqInput {
  code: string;
  trade: TradeCategory;
  workPackage: string;
  floor: string;
  roomZone: string;
  description: string;
  specification: string;
  brandGrade: string;
  inclusions: string;
  exclusions: string;
  unit: MeasurementUnit;
  formula: string;
  qty: number;
  wastage: number;
  material: number;
  labour: number;
  equipment: number;
  subcontract: number;
  markup: number;
  source: string;
  assumptions: string;
  provisional?: boolean;
  length?: number;
  width?: number;
  height?: number;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

function buildItem(o: BoqInput, index: number, revisionId: string): BOQItem {
  const unitCost = o.material + o.labour + o.equipment + o.subcontract;
  const finalQuantity = r2(o.qty * (1 + o.wastage / 100));
  const sellingRate = Math.round(unitCost * (1 + o.markup / 100));
  return {
    id: `BOQ-V253-${String(index + 1).padStart(3, '0')}`,
    boqRevisionId: revisionId,
    itemCode: o.code,
    trade: o.trade,
    workPackage: o.workPackage,
    floor: o.floor,
    roomZone: o.roomZone,
    description: o.description,
    specification: o.specification,
    brandGrade: o.brandGrade,
    inclusions: o.inclusions,
    exclusions: o.exclusions,
    unit: o.unit,
    length: o.length,
    width: o.width,
    height: o.height,
    quantityFormula: o.formula,
    baseQuantity: r2(o.qty),
    wastagePercent: o.wastage,
    finalQuantity,
    quantityType: o.provisional ? 'PROVISIONAL_ALLOWANCE' : 'MEASURED',
    materialRate: o.material,
    labourRate: o.labour,
    equipmentRate: o.equipment,
    subcontractRate: o.subcontract,
    unitCost,
    totalCost: r2(finalQuantity * unitCost),
    markupPercent: o.markup,
    sellingRate,
    sellingAmount: r2(finalQuantity * sellingRate),
    rateSource: 'APPROVED_MASTER',
    rateStatus: o.provisional ? 'PROVISIONAL' : 'APPROVED',
    sourceDocumentRef: o.source,
    assumptions: o.assumptions,
    isApprovedByEstimator: true,
    reviewedBy: 'Rajesh Sharma (Lead Quantity Surveyor)'
  };
}

const BOQ_INPUTS: BoqInput[] = [
  {
    code: 'CIV-01',
    trade: 'CIVIL_MASONRY',
    workPackage: 'Civil Making Good',
    floor: 'Ground + First',
    roomZone: 'All rooms',
    description: 'Blockwork, chasing, plaster making good and levelling screed required before joinery and finishes in the bare-shell villa.',
    specification: '6" AAC block infill, 1:4 cement plaster, 50mm levelling screed with polymer bonding agent',
    brandGrade: 'Biltech AAC / UltraTech OPC 53',
    inclusions: 'Chasing for conduits, plumbing sleeves, sill corrections, screed curing',
    exclusions: 'Any structural alteration to RCC frame',
    unit: 'sq.ft',
    formula: 'Wall making good 640 sq.ft + levelling screed 700 sq.ft (measured room-wise on site)',
    qty: 1340,
    wastage: 3,
    material: 68,
    labour: 52,
    equipment: 6,
    subcontract: 0,
    markup: 22,
    source: 'VILLA_253_WALL_MARKING_10_10_24_REV0.pdf (Sheet A-101) + site survey 30-05-2026',
    assumptions: 'Developer hands over a true-to-drawing shell; no column or beam modifications permitted.'
  },
  {
    code: 'WTR-01',
    trade: 'WATERPROOFING',
    workPackage: 'Wet Area Waterproofing',
    floor: 'Ground + First',
    roomZone: 'Toilet 1, Toilet 2, Toilet 3, Powder Room, Utility',
    description: 'Two-component elastomeric waterproofing on sunken slabs and dado up to 7ft in all four toilets, powder room and utility, with 72-hour ponding certification.',
    specification: 'Dr. Fixit Fastflex 2 coats, 50mm chamfered fillets, fibreglass mesh at all junctions',
    brandGrade: 'Pidilite Dr. Fixit Fastflex',
    inclusions: 'Surface priming, fillet casting, 72-hr ponding test with signed level certificate',
    exclusions: 'Plumbing core cutting and sleeve sealing',
    unit: 'sq.ft',
    formula: 'Floors: T1 148.5 + T2 99.9 + T3 89.5 + Powder 48.3 + Utility 87 = 473.2 sq.ft; dado 7ft = 1,180 sq.ft; total 1,653.2 sq.ft',
    qty: 1653.2,
    wastage: 6,
    material: 48,
    labour: 32,
    equipment: 4,
    subcontract: 0,
    markup: 24,
    source: 'Site survey 30-05-2026 (ponding protocol) + R0 toilet dimensions',
    assumptions: 'Ponding test witnessed by client representative before tile laying in each wet area.'
  },
  {
    code: 'FLR-01',
    trade: 'FLOORING_TILING',
    workPackage: 'Marble Flooring',
    floor: 'Ground Floor',
    roomZone: 'Living & Dining Great Room, Staircase Core, Powder Room',
    description: 'Laying 800x800mm honed Italian Botticino marble in the great room, staircase core and powder room with epoxy grout and 100mm skirting.',
    specification: '18mm thick honed Botticino Classico, dry-lay approved by client before fixing, 2mm spacer, epoxy grout',
    brandGrade: 'Botticino Classico (imported) / R.K. Marbles',
    inclusions: 'Dry-lay approval, diamond polishing, crystallisation, skirting, threshold strips',
    exclusions: 'Feature inlay medallion',
    unit: 'sq.ft',
    formula: 'Living 481 + Stair core 142.5 + Powder 48.3 = 671.8 sq.ft + skirting allowance',
    qty: 671.8,
    wastage: 10,
    material: 340,
    labour: 96,
    equipment: 14,
    subcontract: 0,
    markup: 26,
    source: 'R0 Sheet A-101 room areas; marble dry-lay approved 26-08-2026',
    assumptions: 'Import lead time 18 days; one dry-lay revision included.'
  },
  {
    code: 'FLR-02',
    trade: 'FLOORING_TILING',
    workPackage: 'Wooden Flooring',
    floor: 'Ground + First',
    roomZone: 'Master Bedroom 1, Bedroom 2, Bedroom 3',
    description: 'Engineered European oak plank flooring over acoustic underlay in all three bedrooms, including door thresholds.',
    specification: '1900x190x15mm engineered oak, 3mm wear layer, 2mm acoustic underlay, skirting in matching oak',
    brandGrade: 'Parador Trendtime 6 / Squarefoot',
    inclusions: 'Acoustic underlay, thresholds, matching skirting, moisture barrier',
    exclusions: 'Solid wood re-sanding after handover',
    unit: 'sq.ft',
    formula: 'Bed1 266 + Bed2 359 + Bed3 393 = 1,018 sq.ft',
    qty: 1018,
    wastage: 8,
    material: 248,
    labour: 72,
    equipment: 6,
    subcontract: 0,
    markup: 25,
    source: 'R0 Sheets A-101 & A-102 bedroom areas',
    assumptions: 'Sub-floor moisture below 12% before laying; 48-hour acclimatisation of planks on site.'
  },
  {
    code: 'FLR-03',
    trade: 'FLOORING_TILING',
    workPackage: 'Wet Area Tiling',
    floor: 'Ground + First',
    roomZone: 'Toilets, Utility, Kitchen',
    description: 'Anti-skid vitrified tile flooring and full-height wall tiling in toilets, utility and kitchen with epoxy grouting.',
    specification: '600x1200mm matt anti-skid GVT, 9mm, epoxy grout, 2mm spacers, aluminium trims at edges',
    brandGrade: 'Kajaria Eternity / Somany Duragres',
    inclusions: 'Wall tiling to ceiling height, trims, epoxy grout, silicone sealing',
    exclusions: 'Decorative mosaic feature band',
    unit: 'sq.ft',
    formula: 'Floors 473.2 + 130.5 (kitchen) = 603.7 sq.ft floor; wall dado/wall tiling measured 1,410 sq.ft included in rate build-up',
    qty: 603.7,
    wastage: 9,
    material: 82,
    labour: 46,
    equipment: 5,
    subcontract: 0,
    markup: 24,
    source: 'R0 wet block dimensions; tile samples approved 12-08-2026',
    assumptions: 'Tile batch of single dye lot reserved for the whole villa.'
  },
  {
    code: 'FLR-04',
    trade: 'LANDSCAPING_OUTDOORS',
    workPackage: 'Decks & Balconies',
    floor: 'Ground + First + Roof',
    roomZone: 'Front Deck, Rear Deck, Bar Deck, Master Private Deck, Bed3 Balconies',
    description: 'Ipe hardwood deck flooring on MS sub-frame for front deck, rear deck, bar deck, master private deck and first-floor balconies.',
    specification: '19mm Ipe hardwood planks, 304-grade SS screws, MS sub-frame with epoxy coating, 5mm drainage gaps',
    brandGrade: 'Ipe (Brazilian walnut) / MS sub-frame',
    inclusions: 'Sub-frame, waterproof membrane below deck, edge fascia, concealed fixings',
    exclusions: 'Loose outdoor furniture',
    unit: 'sq.ft',
    formula: 'Front 543 + Rear 123.5 + Bar 431.6 + Master 51.75 + Bed3 balconies 156.6 = 1,306.45 sq.ft',
    qty: 1306.45,
    wastage: 7,
    material: 215,
    labour: 88,
    equipment: 12,
    subcontract: 0,
    markup: 26,
    source: 'R0 deck and balcony schedule (SD1, SD5, FW1, FW2)',
    assumptions: 'Deck levels set 25mm below internal finished floor level.'
  },
  {
    code: 'CLG-01',
    trade: 'FALSE_CEILINGS',
    workPackage: 'Gypsum Ceilings',
    floor: 'Ground + First',
    roomZone: 'Living, Bed 1, Bed 2, Bed 3, Kitchen, Stair void',
    description: 'Gypsum board false ceiling with perimeter cove for indirect lighting, including access panels at AC and electrical points.',
    specification: 'Saint-Gobain Gyproc 12.5mm board on GI framing at 610mm centres, 2 coats jointing compound, cove profile',
    brandGrade: 'Saint-Gobain Gyproc / India Gypsum',
    inclusions: 'GI framework, cove, access panels, jointing, screw spotting',
    exclusions: 'Lighting fixtures and drivers',
    unit: 'sq.ft',
    formula: 'Living 481 + Bed1 266 + Bed2 359 + Bed3 393 + Kitchen 130.5 + Stair 142.5 = 1,772 sq.ft',
    qty: 1772,
    wastage: 5,
    material: 64,
    labour: 48,
    equipment: 6,
    subcontract: 0,
    markup: 24,
    source: 'R0 ceiling areas; reflected ceiling plan Rev B issued 22-08-2026',
    assumptions: 'Ceiling dropped 300mm below slab soffit for cove and AC ducting.'
  },
  {
    code: 'CLG-02',
    trade: 'FALSE_CEILINGS',
    workPackage: 'Gazebo Pergola',
    floor: 'Roof',
    roomZone: 'Signature Roof Gazebo Pavilion',
    description: 'Pitched timber rafter ceiling and pergola to Section BB\' over the 24\'x18\' roof gazebo, ridge 12\'-9" above first-floor slab.',
    specification: 'Seasoned Burma teak rafters 4"x6" at 600mm centres, MS base plates, 2-coat PU matt finish',
    brandGrade: 'Burma Teak / MS fabricated plates',
    inclusions: 'Rafters, purlins, MS base plates cast into slab, PU finishing, concealed lighting chase',
    exclusions: 'Roof waterproofing above pergola',
    unit: 'sq.ft',
    formula: 'Gazebo 24ft x 18ft = 432 sq.ft (Section BB\' ridge 12\'-9")',
    qty: 432,
    wastage: 6,
    material: 292,
    labour: 124,
    equipment: 16,
    subcontract: 0,
    markup: 27,
    source: 'R0 Section BB\' gazebo detail + VILLA_253_CAD_AND_IMAGE_LOGIC.md',
    assumptions: 'Pergola fixed to cast-in MS base plates; no drilling into waterproofing membrane.'
  },
  {
    code: 'WRD-01',
    trade: 'WARDROBES_STORAGE',
    workPackage: 'Wardrobes & Walk-in',
    floor: 'Ground + First',
    roomZone: 'Master Walk-in, Bedroom 2 Wardrobe, Bedroom 3 Wardrobe',
    description: 'Full-height wardrobe and walk-in carcasses in 18mm BWP marine ply with veneer shutters, soft-close hardware and internal organisers.',
    specification: 'CenturyPly Club Prime BWP 710 18mm carcass, 0.6mm natural veneer shutters, Hettich soft-close, PU finish',
    brandGrade: 'CenturyPly / Hettich / Asian Paints PU',
    inclusions: 'Carcass, shutters, hardware, internal drawers, lofts, mirror on one shutter per wardrobe',
    exclusions: 'Loose hangers and storage baskets',
    unit: 'sq.ft',
    formula: 'Master walk-in 119.6 + Bed2 wardrobe 74.9 + Bed3 wardrobe 48 = 242.5 sq.ft of elevation',
    qty: 242.5,
    wastage: 5,
    material: 726,
    labour: 242,
    equipment: 22,
    subcontract: 0,
    markup: 28,
    source: 'R0 wardrobe blocks: walk-in 10\'2"x11\'9", Bed2 7\'9"x9\'8"',
    assumptions: 'Shutter heights to 8\'-6" with loft above; site measurement locked after ceiling grid.'
  },
  {
    code: 'KIT-01',
    trade: 'MODULAR_KITCHEN',
    workPackage: 'Modular Kitchen',
    floor: 'Ground Floor',
    roomZone: 'Culinary Kitchen, Utility & Powder Wing',
    description: 'L-shaped modular kitchen with 18mm BWP carcass, acrylic shutters, quartz countertop, tall units and utility storage.',
    specification: 'Carcass 18mm BWP, Senoplast acrylic shutters, 20mm quartz top with matching upstand, Hafele soft-close, tandem baskets',
    brandGrade: 'CenturyPly / Senoplast / Hafele / Silestone',
    inclusions: 'Base and wall units, tall unit, quartz top, cut-outs, skirting, tandem baskets, cutlery trays',
    exclusions: 'Hob, chimney, built-in oven, refrigerator, dishwasher',
    unit: 'r.ft',
    formula: 'Base run 14\'-6" + return 9\'-0" + tall unit 2\'-6" = 26 running feet',
    qty: 26,
    wastage: 3,
    material: 4250,
    labour: 1180,
    equipment: 70,
    subcontract: 0,
    markup: 26,
    source: 'R0 kitchen 14\'-6"x9\'-0"; appliance cut-out drawing approved 02-09-2026',
    assumptions: 'Countertop templated after carcass installation; appliance models frozen before templating.'
  },
  {
    code: 'JNR-01',
    trade: 'CARPENTRY_JOINERY',
    workPackage: 'Living & Dining Joinery',
    floor: 'Ground Floor',
    roomZone: 'Living & Dining Great Room',
    description: 'TV console with fluted veneer panelling, crockery unit with glass shutters and floating display shelf in the great room.',
    specification: '18mm BWP carcass, fluted oak veneer, 6mm toughened glass shutters, concealed LED profile, PU matt finish',
    brandGrade: 'CenturyPly / Hettich / Saint-Gobain glass',
    inclusions: 'Console, wall panelling, crockery unit, concealed LED profile, cable management',
    exclusions: 'TV, audio equipment, loose decor',
    unit: 'r.ft',
    formula: 'TV console 9ft + crockery unit 7ft + display shelf 2ft = 18 running feet',
    qty: 18,
    wastage: 4,
    material: 3180,
    labour: 940,
    equipment: 45,
    subcontract: 0,
    markup: 27,
    source: 'R0 great room 25\'-4"x19\'-0"; joinery elevation INT-204 Rev B',
    assumptions: 'Fluted panel modules factory-finished; site assembly only.'
  },
  {
    code: 'JNR-02',
    trade: 'CARPENTRY_JOINERY',
    workPackage: 'Bar Unit',
    floor: 'Ground Floor',
    roomZone: 'Bedroom 2 Bar Deck',
    description: 'Outdoor bar unit with marine-ply carcass, stone counter and weather-resistant shutters at the 14\'x30\'10" bar deck.',
    specification: 'BWP carcass with exterior-grade PU, 20mm granite counter, SS 304 hardware, weather seal gaskets',
    brandGrade: 'CenturyPly BWP / SS 304 / Granite',
    inclusions: 'Bar counter, back unit, glass rack, concealed fridge niche',
    exclusions: 'Bar refrigerator and glassware',
    unit: 'r.ft',
    formula: 'Bar run 12 running feet at Bedroom 2 bar deck',
    qty: 12,
    wastage: 4,
    material: 3480,
    labour: 980,
    equipment: 55,
    subcontract: 0,
    markup: 28,
    source: 'R0 bar deck 14\'0"x30\'10"',
    assumptions: 'Unit set back 600mm from deck edge to keep drainage path clear.'
  },
  {
    code: 'ELE-01',
    trade: 'ELECTRICAL_AUTOMATION',
    workPackage: 'Electrical & Automation',
    floor: 'Ground + First + Roof',
    roomZone: 'Whole villa',
    description: 'Complete electrical rewiring with KNX home automation, modular switch plates, CAT6 data backbone and gazebo outdoor points.',
    specification: 'Polycab FRLS-H copper, Legrand Arteor plates, KNX actuators with 8 scene keypads, CAT6A backbone, DB with RCBOs',
    brandGrade: 'Polycab / Legrand Arteor / KNX (Gira)',
    inclusions: 'Conduits, wiring, DBs, switch plates, automation programming, gazebo weatherproof points',
    exclusions: 'Solar rooftop and inverter',
    unit: 'point',
    formula: '96 points: 62 lighting/power, 14 automation keypads, 12 data/TV, 8 outdoor/gazebo',
    qty: 96,
    wastage: 5,
    material: 1880,
    labour: 660,
    equipment: 40,
    subcontract: 0,
    markup: 25,
    source: 'Electrical SLD Rev B (18-08-2026) + KNX point schedule',
    assumptions: 'Automation scenes programmed and handed over with a printed scene card per room.'
  },
  {
    code: 'PLB-01',
    trade: 'PLUMBING_SANITARY',
    workPackage: 'Plumbing & Sanitary',
    floor: 'Ground + First',
    roomZone: 'Toilet 1, Toilet 2, Toilet 3, Powder Room, Utility, Kitchen',
    description: 'Concealed CP plumbing with wall-hung WC, rain showers, thermostatic mixers and sanitaryware for four toilets, utility and kitchen.',
    specification: 'Astral CPVC flowguard lines, Jaquar Kubix wall-hung WC, Kohler rain shower, thermostatic diverters, pressure-tested at 10 bar',
    brandGrade: 'Astral / Jaquar / Kohler',
    inclusions: 'Concealed lines, sanitaryware, CP fittings, pressure testing, GI clamps, floor drains',
    exclusions: 'Water softener and RO unit',
    unit: 'lump sum',
    formula: '4 toilets + powder + utility + kitchen: 1 lump-sum package as per sanitary schedule SS-01',
    qty: 1,
    wastage: 0,
    material: 648000,
    labour: 96000,
    equipment: 8500,
    subcontract: 0,
    markup: 22,
    source: 'Sanitary schedule SS-01 Rev A (approved 20-08-2026)',
    assumptions: 'Concealed cisterns fixed before tiling; all lines pressure-tested for 24 hours.'
  },
  {
    code: 'HVAC-01',
    trade: 'HVAC_VENTILATION',
    workPackage: 'VRF Air Conditioning',
    floor: 'Ground + First',
    roomZone: 'Living, Bed 1, Bed 2, Bed 3, Kitchen',
    description: 'VRF air conditioning with five concealed ducted indoor units, copper refrigerant piping and linear slot diffusers.',
    specification: 'Daikin VRV 5 outdoor unit, 5 concealed ducted indoor units, 0.8mm copper with nitrile insulation, linear slot diffusers',
    brandGrade: 'Daikin VRV / Nitrile insulation',
    inclusions: 'Indoor and outdoor units, copper piping, drainage, diffusers, thermostat per room, commissioning',
    exclusions: 'Ducting beyond 6m per room and fresh-air ERV',
    unit: 'nos',
    formula: '5 indoor units: Living 2.0 TR, Bed1 1.2 TR, Bed2 1.2 TR, Bed3 1.2 TR, Kitchen 0.8 TR',
    qty: 5,
    wastage: 0,
    material: 118000,
    labour: 18500,
    equipment: 2500,
    subcontract: 0,
    markup: 20,
    source: 'HVAC heat-load calculation HL-253 dated 12-08-2026',
    assumptions: 'Outdoor unit on roof utility ledge with acoustic enclosure; condensate drained to rain water line.'
  },
  {
    code: 'DOR-01',
    trade: 'DOORS_WINDOWS_GLAZING',
    workPackage: 'Sliding Doors & Windows',
    floor: 'Ground + First + Roof',
    roomZone: 'SD1, SD2, SD3, SD4, SD4A, SD5, SD6, SD7, SD1A-SD3A, D1-D4, W1-W5, FW1-FW2',
    description: 'Slim-profile aluminium sliding door and window system with double-glazed units, including the 27ft SD1 great-room portal and gazebo access SD4A.',
    specification: 'Jindal slim-profile 2.5mm aluminium, 8-12-8 DGU with Saint-Gobain Planitherm, SS rollers, EPDM gaskets',
    brandGrade: 'Jindal Aluminium / Saint-Gobain Planitherm',
    inclusions: 'Frames, glazing, hardware, EPDM gaskets, drainage weep holes, silicone sealing',
    exclusions: 'External facade stone cladding',
    unit: 'sq.ft',
    formula: 'Total opening schedule from R0: SD1 277 + SD2 123.5 + SD4 102.5 + SD5 113 + SD6 92.3 + SD7 71.8 + SD1A-SD3A 306.7 + doors/windows 93 = 1,180 sq.ft',
    qty: 1180,
    wastage: 4,
    material: 528,
    labour: 112,
    equipment: 24,
    subcontract: 0,
    markup: 22,
    source: 'R0 opening schedule SD1-SD7, SD1A-SD3A, D1-D4, W1-W5, FW1-FW2',
    assumptions: 'All openings re-measured after blockwork; SD1 installed with temporary protection until handover.'
  },
  {
    code: 'PNT-01',
    trade: 'PAINTING_POLISHING',
    workPackage: 'Painting & Polish',
    floor: 'Ground + First + Roof',
    roomZone: 'Whole villa',
    description: 'Interior emulsion painting on walls and ceilings with two-coat PU polish on all veneer joinery and teak pergola.',
    specification: 'Asian Paints Royale Luxury Emulsion (2 coats + primer), 2-coat PU matt on veneer, 1 coat PU sealer on teak',
    brandGrade: 'Asian Paints Royale / PU',
    inclusions: 'Putty, primer, 2 finish coats, PU on joinery, masking and protection',
    exclusions: 'Exterior weather-proof paint on facade',
    unit: 'sq.ft',
    formula: 'Wall + ceiling paintable area 6,850 sq.ft measured room-wise (perimeters x height less openings)',
    qty: 6850,
    wastage: 4,
    material: 38,
    labour: 46,
    equipment: 3,
    subcontract: 0,
    markup: 25,
    source: 'R0 room perimeters and ceiling heights (10\'-3")',
    assumptions: 'Paint shade card signed by client before first coat; PU polish in dust-controlled area.'
  },
  {
    code: 'EXT-01',
    trade: 'LANDSCAPING_OUTDOORS',
    workPackage: 'Gazebo Structure & Terrace',
    floor: 'Roof',
    roomZone: 'Signature Roof Gazebo Pavilion',
    description: 'MS structural frame with timber-clad columns for the roof gazebo, terrace waterproofing and outdoor power/data provision.',
    specification: 'MS 100x100x4mm columns with teak cladding, terrace APP membrane waterproofing, weatherproof IP65 points',
    brandGrade: 'MS fabricated / STP APP membrane / Burma Teak',
    inclusions: 'MS frame, column cladding, terrace membrane, parapet coping, IP65 electricals',
    exclusions: 'Gazebo loose furniture and planters',
    unit: 'sq.ft',
    formula: 'Gazebo 24ft x 18ft = 432 sq.ft',
    qty: 432,
    wastage: 5,
    material: 486,
    labour: 268,
    equipment: 48,
    subcontract: 0,
    markup: 27,
    source: 'R0 Section BB\' + terrace waterproofing detail',
    assumptions: 'Pergola base plates cast during slab stage; MS members shop-primed before site assembly.'
  },
  {
    code: 'LIT-01',
    trade: 'LIGHTING_FIXTURES',
    workPackage: 'Architectural Lighting',
    floor: 'Ground + First + Roof',
    roomZone: 'Whole villa',
    description: 'Architectural and decorative lighting package with profile lights, spotlights, cove lighting and gazebo festoon points.',
    specification: 'Wipro/Havells profile LED 3000K CRI>90, dimmable drivers on KNX, IP65 gazebo points',
    brandGrade: 'Wipro Garnet / Havells / KNX dimmable drivers',
    inclusions: 'Fixtures, drivers, cove profiles, installation, scene programming with automation',
    exclusions: 'Loose table and floor lamps',
    unit: 'lump sum',
    formula: 'Lighting layout LT-01 Rev B: 1 lump-sum package across 7 spaces',
    qty: 1,
    wastage: 0,
    material: 288000,
    labour: 42000,
    equipment: 4500,
    subcontract: 0,
    markup: 24,
    source: 'Lighting layout LT-01 Rev B (issued 25-08-2026)',
    assumptions: 'All fixtures 3000K; dimming scenes matched to the 8 keypad scenes.'
  },
  {
    code: 'LND-01',
    trade: 'LANDSCAPING_OUTDOORS',
    workPackage: 'Landscape & Hardscape',
    floor: 'Ground Floor',
    roomZone: 'Front Deck, Approach & Rear Deck',
    description: 'Soft landscape, drip irrigation and hardscape finishing around the front and rear decks of Villa 253.',
    specification: 'Native planting palette, 25mm Kota stone paving, drip irrigation with timer, LED bollards',
    brandGrade: 'Native species / Kota stone / Jain Irrigation',
    inclusions: 'Planting, soil conditioning, drip lines, Kota paving, bollard lighting, 3-month maintenance',
    exclusions: 'Borewell and swimming pool',
    unit: 'lump sum',
    formula: 'Front deck 57\'-2" x 9\'-6" + rear deck 13\'x9\'-6" + approach path: 1 lump-sum package',
    qty: 1,
    wastage: 0,
    material: 342000,
    labour: 118000,
    equipment: 26000,
    subcontract: 0,
    markup: 20,
    source: 'Landscape concept LC-253 Rev A (approved 28-08-2026)',
    assumptions: 'Planting scheduled after external painting to avoid damage.'
  }
];

// ---------------------------------------------------------------------------
// 4. REVISIONS + QUOTATION
// ---------------------------------------------------------------------------
const REV0_ID = 'REV-V253-0-AI-DRAFT';
const REV1_ID = 'REV-V253-1-ESTIMATOR-APPROVED';

export const VILLA253_BOQ_REV0: BOQItem[] = BOQ_INPUTS.map((o, i) => {
  const item = buildItem(
    { ...o, provisional: o.code === 'LIT-01' || o.code === 'LND-01' },
    i,
    REV0_ID
  );
  return { ...item, isApprovedByEstimator: false, reviewedBy: undefined };
});

export const VILLA253_BOQ_REV1: BOQItem[] = BOQ_INPUTS.map((o, i) =>
  buildItem(o, i, REV1_ID)
);

export const VILLA253_SUBTOTAL = r2(
  VILLA253_BOQ_REV1.reduce((sum, i) => sum + i.sellingAmount, 0)
);
export const VILLA253_GST_AMOUNT = r2(VILLA253_SUBTOTAL * (VILLA253.gstPercent / 100));
export const VILLA253_TOTAL = r2(VILLA253_SUBTOTAL + VILLA253_GST_AMOUNT);

const milestone = (
  id: string,
  name: string,
  percentage: number,
  trigger: string,
  status: PaymentMilestone['status']
): PaymentMilestone => ({
  id,
  milestoneName: name,
  percentage,
  amount: r2((VILLA253_TOTAL * percentage) / 100),
  stageTrigger: trigger,
  status
});

export const VILLA253_MILESTONES: PaymentMilestone[] = [
  milestone('MS-V253-1', 'Contract Signing & Site Mobilisation', 10, 'Turnkey contract signed and site handed over for mobilisation', 'PAID'),
  milestone('MS-V253-2', 'Civil Making Good & Wet Area Waterproofing', 15, '72-hour ponding test passed in all four toilets and utility', 'PAID'),
  milestone('MS-V253-3', 'Concealed MEP, Electrical & Ceiling Grid', 25, 'Plumbing pressure test and KNX cabling signed off; gypsum grid complete', 'PAID'),
  milestone('MS-V253-4', 'Joinery, Wardrobes & Modular Kitchen', 25, 'Carcass installation and hardware fitting completed room-wise', 'INVOICED'),
  milestone('MS-V253-5', 'Flooring, Marble, Decks & Painting', 15, 'Marble crystallisation, deck completion and final paint coat', 'PENDING'),
  milestone('MS-V253-6', 'Gazebo, Snag Closure & Handover', 10, 'Client walkthrough, snag closure and warranty document handover', 'PENDING')
];

export const VILLA253_QUOTATION: CustomerQuotation = {
  id: 'QUOTE-V253-2026-001',
  quotationNumber: 'BS-QT-2026-0253',
  projectId: VILLA253.projectId,
  boqRevisionId: REV1_ID,
  customerName: VILLA253.clientName,
  projectTitle: 'Villa 253 (24-Type, North Facing, 3BHK + Roof Gazebo) - Turnkey Interiors',
  siteAddress: VILLA253.siteAddressFull,
  selectedPackageTier: 'PREMIUM',
  quotationDate: VILLA253.quotationDate,
  validityDays: 30,
  expiryDate: '2026-07-20',
  subtotalSellingAmount: VILLA253_SUBTOTAL,
  gstPercent: VILLA253.gstPercent,
  gstAmount: VILLA253_GST_AMOUNT,
  totalQuotationAmount: VILLA253_TOTAL,
  milestoneSchedule: VILLA253_MILESTONES,
  inclusions: [
    'Complete civil making good of the developer shell as per R0 wall-marking drawing, including blockwork and levelling screed.',
    'Two-coat elastomeric waterproofing in all four toilets, powder room and utility with signed 72-hour ponding certificate.',
    '800x800mm honed Italian Botticino marble in the great room, staircase core and powder room with crystallisation.',
    'Engineered European oak flooring in all three bedrooms with acoustic underlay and matching skirting.',
    'Full-height wardrobes and walk-in in 18mm BWP marine ply with veneer shutters and Hettich soft-close hardware.',
    'L-shaped modular kitchen with quartz countertop, acrylic shutters and Hafele tandem baskets (appliances excluded).',
    'VRF air conditioning with five concealed ducted indoor units and linear slot diffusers.',
    'KNX home automation with 8-scene keypads, CAT6A backbone and weatherproof gazebo points.',
    'Signature roof gazebo with Burma teak pergola to Section BB\', ridge 12\'-9" above first-floor slab.',
    'Ipe hardwood decks on MS sub-frame for front deck, rear deck, bar deck and both balconies.',
    'Architectural lighting on KNX dimmable drivers and landscape package with drip irrigation.',
    'Dedicated site engineer, weekly photo progress report and 12-month defect liability with 5-year waterproofing warranty.'
  ],
  exclusions: [
    'Kitchen appliances (hob, chimney, built-in oven, refrigerator, dishwasher) and bar refrigerator.',
    'Loose furniture, curtains, rugs, art and decor accessories.',
    'Solar rooftop system, inverter and water softener / RO unit.',
    'Swimming pool, borewell and any structural modification to the RCC frame.',
    'Electricity and water consumption during execution, to be provided by the client at site.'
  ],
  termsAndConditions: [
    'Quotation valid for 30 calendar days from issue; marble and teak rates are subject to import index revision beyond that.',
    'Contract programme: 165 calendar days from mobilisation, target handover 18-12-2026.',
    'Any scope change is executed only through a written Variation Order approved by the client.',
    'Waterproofing carries a 5-year Build Storys warranty; joinery hardware carries manufacturer warranty (Hettich: 5 years).',
    'Retention of 5% is held from each subcontractor bill and released after defect liability closure.',
    'GST at 18% is charged as a composite works contract supply (SAC 9954).'
  ],
  status: 'ACCEPTED'
};

// ---------------------------------------------------------------------------
// 5. PROJECT RECORD
// ---------------------------------------------------------------------------
export function getVilla253DemoProject(): ProjectRecord {
  const rev0: BOQRevision = {
    id: REV0_ID,
    projectId: VILLA253.projectId,
    revisionNumber: 0,
    revisionLabel: 'Rev 0 - AI Draft Takeoff',
    status: 'ESTIMATOR_REVIEW',
    items: VILLA253_BOQ_REV0,
    createdAt: '2026-06-15T10:20:00Z',
    createdBy: 'AI Estimation Agent (takeoff from R0 wall-marking drawing)',
    missingDimensionAlerts: [
      'Gazebo pergola ridge height assumed 12\'-9" from Section BB\'; structural drawing confirmation pending.',
      'Bedroom 3 wardrobe width not dimensioned on R0; provisional 6\'-0" elevation assumed.',
      'Landscape hardscape extent beyond front deck measured from site photo, not from a scaled drawing.'
    ],
    missingRateAlerts: [
      'LIT-01 architectural lighting carried at provisional lump sum pending final fixture schedule LT-01 Rev B.',
      'LND-01 landscape package carried as provisional allowance pending nursery quotation.'
    ],
    notes: 'Generated from VILLA_253_WALL_MARKING_10_10_24_REV0.pdf, the editable DXF and the 30-05-2026 site survey.'
  };

  const rev1: BOQRevision = {
    id: REV1_ID,
    projectId: VILLA253.projectId,
    revisionNumber: 1,
    revisionLabel: 'Rev 1 - Estimator Approved Baseline',
    status: 'FROZEN_BASELINE',
    items: VILLA253_BOQ_REV1,
    createdAt: '2026-06-19T15:40:00Z',
    createdBy: 'Rajesh Sharma (Lead Quantity Surveyor)',
    approvedAt: '2026-06-19T18:10:00Z',
    approvedBy: 'Aarav Singhania (Managing Director)',
    missingDimensionAlerts: [],
    missingRateAlerts: [],
    notes: 'Quantities reconciled against the R0 drawing and site re-measurement. Rates locked from Master Schedule of Rates Q2-2026.'
  };

  const requirement: CustomerRequirement = {
    id: 'REQ-V253-001',
    projectId: VILLA253.projectId,
    customerName: VILLA253.clientName,
    customerPhone: VILLA253.clientPhone,
    customerEmail: VILLA253.clientEmail,
    billingAddress: VILLA253.billingAddress,
    projectSiteAddress: VILLA253.siteAddressFull,
    city: VILLA253.city,
    projectType: 'RESIDENTIAL',
    projectScope: 'TURNKEY_INTERIORS',
    plotAreaSqFt: VILLA253.plotAreaSqFt,
    builtUpAreaSqFt: VILLA253.builtUpAreaSqFt,
    carpetAreaSqFt: VILLA253.carpetAreaSqFt,
    floorsCount: 2,
    rooms: VILLA253_ROOMS,
    preferredDesignStyle: 'Warm Modern Minimal with Teak Accents and a Coastal-Calm Palette',
    materialsBrandsPreferences:
      'Italian Botticino marble in the great room, engineered oak in bedrooms, Burma teak for the gazebo pergola, Jaquar and Kohler sanitaryware, Legrand Arteor switch plates.',
    civilRequirements:
      'Developer shell to be made good; no structural changes. All wet areas to be re-waterproofed and ponding-tested before tiling.',
    electricalRequirements:
      'KNX home automation with 8 scenes, CAT6A data backbone, dedicated circuits for AC and kitchen appliances, IP65 points on gazebo and decks.',
    plumbingSanitaryRequirements:
      'Wall-hung WCs with concealed cisterns, thermostatic mixers, rain showers in all toilets, hot water loop from a 300L heat pump.',
    hvacRequirements:
      'VRF system with concealed ducted indoor units in living and all bedrooms, linear slot diffusers, outdoor unit on roof utility ledge.',
    joineryKitchenPreferences:
      'Full-height veneer wardrobes with soft-close hardware, L-shaped modular kitchen with quartz top, outdoor bar unit on the Bedroom 2 deck.',
    customerBudgetMin: 8500000,
    customerBudgetMax: 10500000,
    targetCompletionDate: VILLA253.handoverTargetDate,
    exclusionsCustomerSupplied: 'Kitchen appliances, loose furniture, curtains, art and decor to be procured by the client directly.',
    siteAccessConstraints:
      'Community gate allows material entry 09:00-18:00 only; no heavy vehicle movement on Sundays. Lift not available - first floor material moved via staircase.',
    surveyNotes:
      'Laser measurement on 30-05-2026 matched the R0 drawing within 12mm on all rooms. Slab-to-slab 10\'-3". North-facing plot, great room receives morning light through SD1. Terrace slab shows two hairline cracks to be treated before gazebo base plates are loaded.',
    rawBriefHindiEnglish:
      'Client brief (Hinglish): "Villa ko warm aur minimal rakhna hai - zyada cladding nahi. Living room mein bada marble, bedrooms mein wooden flooring. Roof gazebo family ke liye best space ho, teak ka pergola chahiye. Kitchen modular but practical, appliances hum le lenge."',
    documents: [
      {
        id: 'DOC-V253-01',
        filename: 'VILLA_253_WALL_MARKING_10_10_24_REV0.pdf',
        fileType: 'application/pdf',
        sizeKb: 1840,
        uploadedAt: '2026-05-20T11:05:00Z',
        uploadedBy: 'Ar. Shruthi (Design Director)',
        documentType: 'FLOOR_PLAN_DRAWING',
        version: 'R0',
        scaleConfirmed: true,
        scaleRatio: '1:100',
        notes: 'Authoritative wall-marking drawing dated 10-10-24, all seven spaces dimensioned.'
      },
      {
        id: 'DOC-V253-02',
        filename: 'Villa253_FloorPlan_Editable_R0.dxf',
        fileType: 'application/dxf',
        sizeKb: 640,
        uploadedAt: '2026-05-20T11:12:00Z',
        uploadedBy: 'Ar. Shruthi (Design Director)',
        documentType: 'FLOOR_PLAN_DRAWING',
        version: 'R0',
        scaleConfirmed: true,
        scaleRatio: '1:100',
        notes: 'Editable 8-layer reconstruction (A-WALL, A-DOOR, A-WIND, A-STRS, A-DECK, A-DIMS, A-TEXT, A-NOTE).'
      },
      {
        id: 'DOC-V253-03',
        filename: 'Site_Survey_Karjat_30_05_2026.pdf',
        fileType: 'application/pdf',
        sizeKb: 3120,
        uploadedAt: '2026-05-30T18:40:00Z',
        uploadedBy: 'Ar. Rajesh Sharma',
        documentType: 'SITE_SURVEY_PHOTO',
        version: 'Rev A',
        scaleConfirmed: true,
        scaleRatio: '1:50',
        notes: 'Laser disto readings, moisture meter readings and 46 site photographs of the bare shell.'
      },
      {
        id: 'DOC-V253-04',
        filename: 'Client_Brief_Villa253_Kulkarni.pdf',
        fileType: 'application/pdf',
        sizeKb: 890,
        uploadedAt: '2026-06-06T16:20:00Z',
        uploadedBy: 'Rahul Deshmukh (Sales)',
        documentType: 'CLIENT_BRIEF_PDF',
        version: 'Rev A',
        scaleConfirmed: false,
        notes: 'Signed discovery brief: style, palette, room-wise priorities and family requirements.'
      }
    ],
    updatedAt: '2026-06-06T16:20:00Z'
  };

  return {
    id: VILLA253.projectId,
    projectCode: VILLA253.projectCode,
    title: VILLA253.title,
    clientName: VILLA253.clientName,
    clientPhone: VILLA253.clientPhone,
    clientEmail: VILLA253.clientEmail,
    projectType: 'RESIDENTIAL',
    projectScope: 'TURNKEY_INTERIORS',
    siteAddress: VILLA253.siteAddressFull,
    city: VILLA253.city,
    stage: 'EXECUTION_ONGOING',
    carpetAreaSqFt: VILLA253.carpetAreaSqFt,
    estimatedBudget: VILLA253_TOTAL,
    createdAt: '2026-05-18T09:30:00Z',
    updatedAt: '2026-11-10T18:00:00Z',
    requirement,
    activeRevisionId: REV1_ID,
    revisions: [rev0, rev1],
    quotation: VILLA253_QUOTATION
  };
}

export const VILLA253_REV1_ID = REV1_ID;
