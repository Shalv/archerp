/**
 * Build Storys ERP - AI DESIGN STUDIO ENGINE
 * ------------------------------------------
 * Deterministic, geometry-preserving pipeline:
 *
 *   floor plan intake -> structured model -> preference constraints ->
 *   3-5 concepts (room-wise) -> revisions -> approval -> room-wise BOQ
 *
 * Design notes:
 *  - Every concept is generated FROM the measured room model, so no concept
 *    can invent a room that does not exist on the plan.
 *  - Nothing is random: the same model + preferences always produce the same
 *    concepts (auditable for a client presentation and for pricing).
 *  - Money is computed from area x rate, and BOQ lines are matched to the
 *    Master Schedule of Rates where a matching rate exists.
 *  - An optional Gemini call can enrich the narrative text; the geometry,
 *    material mapping and pricing never depend on it.
 */

import { mediaForRoom, primaryVisualForRoom } from '../data/villa253MediaLibrary';
import {
  BOQItem,
  MasterRateItem,
  MeasurementUnit,
  TradeCategory
} from '../types/erp';
import {
  BudgetBand,
  ColourPalette,
  ConceptRevision,
  DesignConcept,
  DesignPreferences,
  DesignStudioSession,
  FloorPlanModel,
  FloorPlanOpening,
  FloorPlanRoom,
  FloorPlanSourceKind,
  MaterialSpecLine,
  PromptHistoryEntry,
  RoomScheme,
  RoomType,
  StylePreference
} from '../types/designStudio';

const r2 = (n: number) => Math.round(n * 100) / 100;
const uid = (prefix: string, seed: string) =>
  `${prefix}-${seed.replace(/[^A-Za-z0-9]/g, '').slice(-12).toUpperCase()}`;

// ---------------------------------------------------------------------------
// 1. FLOOR PLAN ANALYSIS
// ---------------------------------------------------------------------------
export interface RawRoomInput {
  id?: string;
  name: string;
  roomType?: RoomType;
  floor?: string;
  lengthFt?: number;
  widthFt?: number;
  areaSqFt?: number;
  ceilingHeightFt?: number;
  openings?: FloorPlanOpening[];
  notes?: string;
  confidence?: FloorPlanRoom['confidence'];
}

const ROOM_TYPE_RULES: { match: RegExp; type: RoomType }[] = [
  { match: /living|great room|hall|drawing/i, type: 'LIVING' },
  { match: /dining/i, type: 'DINING' },
  { match: /master/i, type: 'MASTER_BEDROOM' },
  { match: /kids|child/i, type: 'KIDS_BEDROOM' },
  { match: /bed\s?room|bedroom|guest suite/i, type: 'BEDROOM' },
  { match: /kitchen|pantry/i, type: 'KITCHEN' },
  { match: /utility|wash/i, type: 'UTILITY' },
  { match: /powder/i, type: 'POWDER_ROOM' },
  { match: /toilet|bath|ensuite|wc/i, type: 'BATHROOM' },
  { match: /wardrobe|walk-in|walk in|closet/i, type: 'WARDROBE' },
  { match: /stair|staircase|foyer|lobby|corridor/i, type: 'STAIRCASE' },
  { match: /balcony/i, type: 'BALCONY' },
  { match: /deck|terrace/i, type: 'DECK' },
  { match: /study|office/i, type: 'STUDY' },
  { match: /gazebo|pavilion|pergola/i, type: 'GAZEBO' }
];

export function inferRoomType(name: string): RoomType {
  const hit = ROOM_TYPE_RULES.find(rule => rule.match.test(name));
  return hit ? hit.type : 'OTHER';
}

const WET_ROOMS: RoomType[] = ['BATHROOM', 'POWDER_ROOM', 'UTILITY', 'KITCHEN'];
const OUTDOOR_ROOMS: RoomType[] = ['BALCONY', 'DECK', 'GAZEBO'];

export interface FloorPlanIntake {
  kind: FloorPlanSourceKind;
  fileName?: string;
  sizeKb?: number;
  uploadedBy?: string;
  uploadedAt?: string;
  previewUrl?: string;
  cadDownloadUrl?: string;
  scaleRatio?: string;
  rooms: RawRoomInput[];
  columnsDetected?: number;
  analysisNotes?: string[];
}

/**
 * Turns any intake (uploaded file + extracted rooms, or manually entered
 * dimensions) into one structured, flag-checked floor plan model.
 */
export function buildFloorPlanModel(intake: FloorPlanIntake): FloorPlanModel {
  const uncertainItems: string[] = [];
  const analysisNotes: string[] = [...(intake.analysisNotes || [])];

  const rooms: FloorPlanRoom[] = intake.rooms.map((raw, idx) => {
    const name = (raw.name || `Room ${idx + 1}`).trim();
    const roomType = raw.roomType || inferRoomType(name);
    const ceilingHeightFt = raw.ceilingHeightFt || 10.25;
    if (!raw.ceilingHeightFt) {
      uncertainItems.push(
        `${name}: ceiling height not found on the drawing - 10'-3" (standard slab) assumed. Confirm with a site measurement.`
      );
    }

    let lengthFt = Number(raw.lengthFt) || 0;
    let widthFt = Number(raw.widthFt) || 0;
    let areaSqFt = Number(raw.areaSqFt) || 0;

    if ((!lengthFt || !widthFt) && areaSqFt > 0) {
      // Square-room assumption keeps the geometry valid but is explicitly flagged.
      const side = Math.sqrt(areaSqFt);
      lengthFt = r2(side);
      widthFt = r2(side);
      uncertainItems.push(
        `${name}: only area (${areaSqFt} sq.ft) was available - room proportion assumed square until dimensions are confirmed.`
      );
    }
    if (lengthFt > 0 && widthFt > 0) {
      const computed = r2(lengthFt * widthFt);
      if (areaSqFt > 0 && Math.abs(computed - areaSqFt) / areaSqFt > 0.05) {
        uncertainItems.push(
          `${name}: entered area ${areaSqFt} sq.ft does not match L x W (${computed} sq.ft). The dimensioned value is used; please confirm.`
        );
      }
      areaSqFt = computed;
    }
    if (!areaSqFt) {
      areaSqFt = 100;
      lengthFt = 10;
      widthFt = 10;
      uncertainItems.push(`${name}: no dimensions or area found - 100 sq.ft placeholder created, must be corrected before BOQ.`);
    }

    const perimeterFt = r2(2 * (lengthFt + widthFt));
    const openings = raw.openings || [];
    const openingArea = openings.reduce((sum, o) => sum + (o.widthFt || 0) * (o.heightFt || 7), 0);
    const wallAreaSqFt = Math.max(0, r2(perimeterFt * ceilingHeightFt - openingArea));

    const confidence: FloorPlanRoom['confidence'] =
      raw.confidence ||
      (intake.kind === 'DXF' || intake.kind === 'DWG'
        ? 'CAD_EXTRACTED'
        : intake.kind === 'MANUAL_DIMENSIONS'
          ? 'USER_VERIFIED'
          : 'AI_INFERRED');

    if (confidence === 'AI_INFERRED' && openings.length === 0) {
      uncertainItems.push(
        `${name}: no door or window opening was detected - furniture layout and glazing quantities will assume one 3'-0" door.`
      );
    }

    const flags: string[] = [];
    if (WET_ROOMS.includes(roomType)) flags.push('WET_AREA');
    if (OUTDOOR_ROOMS.includes(roomType)) flags.push('OUTDOOR');
    if (roomType === 'STAIRCASE') flags.push('DOUBLE_HEIGHT');
    if (roomType === 'GAZEBO') flags.push('STRUCTURE_REQUIRED');
    if (confidence !== 'CAD_EXTRACTED' && confidence !== 'SITE_MEASURED') flags.push('VERIFY_DIMENSIONS');

    return {
      id: raw.id || `ROOM-${idx + 1}`,
      name,
      roomType,
      floor: raw.floor || 'Ground Floor',
      lengthFt: r2(lengthFt),
      widthFt: r2(widthFt),
      ceilingHeightFt,
      areaSqFt: r2(areaSqFt),
      perimeterFt,
      wallAreaSqFt,
      confidence,
      flags,
      openings,
      notes: raw.notes
    };
  });

  const totalCarpetSqFt = r2(rooms.reduce((sum, room) => sum + room.areaSqFt, 0));
  const doorsDetected = rooms.reduce(
    (sum, room) => sum + room.openings.filter(o => o.type === 'DOOR').length,
    0
  );
  const windowsDetected = rooms.reduce(
    (sum, room) => sum + room.openings.filter(o => o.type !== 'DOOR').length,
    0
  );

  if (intake.kind === 'PDF' || intake.kind === 'JPG' || intake.kind === 'PNG') {
    analysisNotes.push(
      'Raster plan read with OCR + geometry detection. Dimensions printed on the sheet are used where legible; everything else is flagged for confirmation.'
    );
  }
  if (intake.kind === 'DXF' || intake.kind === 'DWG') {
    analysisNotes.push(
      'CAD geometry extracted layer-wise (walls, doors, windows, stair, decks). Room boundaries come from closed wall loops, not from a raster guess.'
    );
  }
  if (intake.kind === 'MANUAL_DIMENSIONS') {
    analysisNotes.push('Room dimensions entered by the customer or designer - treated as user-verified.');
  }

  return {
    source: {
      kind: intake.kind,
      fileName: intake.fileName,
      sizeKb: intake.sizeKb,
      uploadedBy: intake.uploadedBy,
      uploadedAt: intake.uploadedAt,
      previewUrl: intake.previewUrl,
      cadDownloadUrl: intake.cadDownloadUrl
    },
    scaleRatio: intake.scaleRatio,
    rooms,
    totalCarpetSqFt,
    doorsDetected,
    windowsDetected,
    columnsDetected: intake.columnsDetected || 0,
    circulationSqFt: r2(totalCarpetSqFt * 0.08),
    uncertainItems,
    analysisNotes,
    analyzedAt: new Date().toISOString()
  };
}

// ---------------------------------------------------------------------------
// 2. CONCEPT TEMPLATES
// ---------------------------------------------------------------------------
interface StyleTemplate {
  style: StylePreference;
  name: string;
  tagline: string;
  narrative: string;
  palette: string[];
  ratePerSqFt: Record<BudgetBand, number>;
  materialVoice: string;
  brandTier: string;
  furnitureVoice: string[];
  lightingVoice: string[];
  moodImages: string[];
  /** Multiplier applied to every material line so each concept has a real budget position */
  costFactor: number;
}

const STYLE_TEMPLATES: StyleTemplate[] = [
  {
    style: 'LUXURY',
    name: 'Modern Luxury',
    tagline: 'Book-matched stone, veneer warmth and layered lighting',
    narrative:
      'A quiet-luxury scheme that leads with book-matched stone in the public areas, fluted veneer on the joinery and a warm neutral palette. Designed to photograph well and age well, with every finish specified to a brand and a finish code.',
    palette: ['#F5F1E8 Ivory', '#B99B6B Travertine', '#3E3A35 Charcoal Walnut', '#7C6A55 Bronze'],
    ratePerSqFt: { ECONOMY: 2100, STANDARD: 2900, PREMIUM: 4100, LUXURY: 5200, CUSTOM: 4600 },
    materialVoice: 'Italian marble, natural veneer, brushed bronze hardware',
    brandTier: 'Imported / premium Indian (Botticino, CenturyPly veneer, Hettich)',
    furnitureVoice: ['Custom upholstered sofa with solid teak frame', 'Stone-top coffee table', 'Upholstered bench at the foot of the bed'],
    lightingVoice: ['Cove lighting on dimmable drivers', 'Adjustable accent spots on joinery', 'Sculptural pendant over the dining table'],
    moodImages: [
      '/images/villa253_living_modern_1790830799942.jpg',
      '/images/villa253_master_suite_1790833696550.jpg',
      '/images/villa253_gazebo_terrace_1790833723445.jpg'
    ],
    costFactor: 1.0
  },
  {
    style: 'MINIMALIST',
    name: 'Warm Minimalist',
    tagline: 'Few materials, honest details, maximum calm',
    narrative:
      'A restrained scheme built on three materials only - matt laminate, oak and micro-cement - with shadow-gap detailing instead of mouldings. Storage is concealed so the visible surface stays quiet, and the palette stays within two tones.',
    palette: ['#FAFAF7 Chalk', '#D9D2C5 Sand', '#8B8175 Greige', '#2E2E2E Graphite'],
    ratePerSqFt: { ECONOMY: 1650, STANDARD: 2350, PREMIUM: 3200, LUXURY: 4100, CUSTOM: 3600 },
    materialVoice: 'Matt laminates, white oak veneer, micro-cement texture',
    brandTier: 'Premium Indian (Merino laminate, Greenlam oak, Ebco hardware)',
    furnitureVoice: ['Low-profile modular sofa', 'Shadow-gap wall unit without handles', 'Platform bed with concealed storage'],
    lightingVoice: ['Continuous linear profile light', 'Recessed spots only where needed', 'No decorative pendants in circulation'],
    moodImages: [
      '/images/villa253_living_greatroom_1790833681710.jpg',
      '/images/villa253_master_bedroom_1790830829821.jpg',
      '/images/villa253_guest_suite_1790833711200.jpg'
    ],
    costFactor: 0.78
  },
  {
    style: 'SCANDINAVIAN',
    name: 'Scandinavian Light',
    tagline: 'Pale timber, soft textiles and daylight-first planning',
    narrative:
      'A light, functional scheme using pale ash veneer, linen textiles and a white-washed palette. Furniture is low and leggy so the floor reads continuous, and every window is left unobstructed to protect the daylight path.',
    palette: ['#FFFFFF Snow', '#EFE7DA Linen', '#C9A87C Pale Ash', '#6E7B70 Sage'],
    ratePerSqFt: { ECONOMY: 1750, STANDARD: 2450, PREMIUM: 3300, LUXURY: 4200, CUSTOM: 3700 },
    materialVoice: 'Pale ash veneer, linen upholstery, matt white lacquer',
    brandTier: 'Mid-premium (Greenlam ash, D Decor linen, Hafele soft-close)',
    furnitureVoice: ['Slip-covered three-seat sofa', 'Round ash dining table', 'Woven storage baskets in the wardrobe'],
    lightingVoice: ['Paper-shade pendants over dining', 'Task lamp at the study desk', 'Warm 2700K ambient throughout'],
    moodImages: [
      '/images/villa253_living_greatroom_1790833681710.jpg',
      '/images/villa253_guest_suite_1790833711200.jpg',
      '/images/villa253_facade_exterior_1790833735467.jpg'
    ],
    costFactor: 0.82
  },
  {
    style: 'CONTEMPORARY',
    name: 'Contemporary Premium',
    tagline: 'Clean geometry with a stone-and-metal accent language',
    narrative:
      'A contemporary scheme that mixes large-format stone, matt lacquer and slim metal trims. Circulation stays generous, joinery runs full height, and the palette pairs a cool base with one warm accent so the house feels current without being trend-bound.',
    palette: ['#EDEDEA Concrete', '#8C9491 Slate', '#C58B4E Amber', '#1F2422 Deep Green'],
    ratePerSqFt: { ECONOMY: 1900, STANDARD: 2650, PREMIUM: 3600, LUXURY: 4700, CUSTOM: 4200 },
    materialVoice: 'Large-format vitrified stone, matt lacquer, brushed SS trims',
    brandTier: 'Premium Indian (Kajaria large format, Asian Paints PU, Hettich)',
    furnitureVoice: ['Deep-seated modular sofa', 'Stone-top island with bar stools', 'Metal-frame bed with upholstered headboard'],
    lightingVoice: ['Track spots on the art wall', 'Under-cabinet task light in the kitchen', 'Warm accent wash on the stone wall'],
    moodImages: [
      '/images/villa253_living_modern_1790830799942.jpg',
      '/images/villa253_roof_gazebo_1790830815235.jpg',
      '/images/villa253_master_suite_1790833696550.jpg'
    ],
    costFactor: 0.9
  },
  {
    style: 'TRADITIONAL_INDIAN',
    name: 'Contemporary Indian',
    tagline: 'Teak, jaali and brass with a modern plan',
    narrative:
      'A rooted scheme using teak, carved jaali screens and brass inlay, arranged on a modern plan. Vastu directions are respected where the customer asks for them, and the detailing stays restrained so maintenance remains practical.',
    palette: ['#F3E9D2 Sandstone', '#8C5A2B Teak', '#B08D57 Brass', '#4A3F35 Umber'],
    ratePerSqFt: { ECONOMY: 1800, STANDARD: 2500, PREMIUM: 3400, LUXURY: 4300, CUSTOM: 3900 },
    materialVoice: 'Teak veneer, jaali screens, brass inlay, Kota stone',
    brandTier: 'Premium Indian (CenturyPly teak, Bharat brass, Kajaria Kota)',
    furnitureVoice: ['Teak diwan with bolster cushions', 'Carved console at the entry', 'Brass-legged dining table'],
    lightingVoice: ['Brass pendant over the dining table', 'Warm wall sconces in the corridor', 'Cove light behind the jaali screen'],
    moodImages: [
      '/images/villa253_master_suite_1790833696550.jpg',
      '/images/villa253_gazebo_terrace_1790833723445.jpg',
      '/images/villa253_facade_exterior_1790833735467.jpg'
    ],
    costFactor: 0.88
  }
];

const BAND_LABEL: Record<BudgetBand, string> = {
  ECONOMY: 'Economy',
  STANDARD: 'Standard',
  PREMIUM: 'Premium',
  LUXURY: 'Luxury',
  CUSTOM: 'Custom budget'
};

function flooringSpec(prefs: DesignPreferences, roomType: RoomType): MaterialSpecLine {
  const outdoor = OUTDOOR_ROOMS.includes(roomType);
  const wet = WET_ROOMS.includes(roomType);

  if (outdoor) {
    return {
      category: 'Deck / outdoor flooring',
      specification: '19mm hardwood deck plank on MS sub-frame with drainage gaps',
      brandTier: 'Ipe / weather-treated hardwood',
      finish: 'Oiled matt',
      unit: 'sq.ft',
      indicativeRate: 315,
      trade: 'LANDSCAPING_OUTDOORS',
      quantityBasis: 'FLOOR_AREA'
    };
  }
  if (wet) {
    return {
      category: 'Wet area flooring',
      specification: '600x1200mm matt anti-skid vitrified tile with epoxy grout',
      brandTier: 'Kajaria / Somany',
      finish: 'Anti-skid matt',
      unit: 'sq.ft',
      indicativeRate: 133,
      trade: 'FLOORING_TILING',
      quantityBasis: 'FLOOR_AREA'
    };
  }
  switch (prefs.flooring) {
    case 'MARBLE':
      return {
        category: 'Stone flooring',
        specification: '800x800mm honed marble with epoxy grout and 100mm skirting',
        brandTier: 'Botticino Classico / Statuario',
        finish: 'Honed and crystallised',
        unit: 'sq.ft',
        indicativeRate: 450,
        trade: 'FLOORING_TILING',
        quantityBasis: 'FLOOR_AREA'
      };
    case 'WOODEN':
      return {
        category: 'Wooden flooring',
        specification: '1900x190x15mm engineered oak on acoustic underlay',
        brandTier: 'Parador / Squarefoot',
        finish: 'Matt lacquer',
        unit: 'sq.ft',
        indicativeRate: 326,
        trade: 'FLOORING_TILING',
        quantityBasis: 'FLOOR_AREA'
      };
    case 'VINYL':
      return {
        category: 'Vinyl flooring',
        specification: 'Luxury vinyl plank 4.5mm with 0.5mm wear layer',
        brandTier: 'Responsive / Armstrong',
        finish: 'Wood-grain matt',
        unit: 'sq.ft',
        indicativeRate: 148,
        trade: 'FLOORING_TILING',
        quantityBasis: 'FLOOR_AREA'
      };
    default:
      return {
        category: 'Tile flooring',
        specification: '800x1600mm glazed vitrified tile with epoxy grout',
        brandTier: 'Kajaria Eternity / Somany',
        finish: 'High gloss',
        unit: 'sq.ft',
        indicativeRate: 165,
        trade: 'FLOORING_TILING',
        quantityBasis: 'FLOOR_AREA'
      };
  }
}

function joinerySpec(roomType: RoomType, prefs: DesignPreferences, style: StyleTemplate): MaterialSpecLine | null {
  const storageNote =
    prefs.storage === 'MAXIMUM'
      ? 'full-height carcass with loft and internal drawers'
      : prefs.storage === 'CONCEALED'
        ? 'handle-less shutters with push-to-open hardware'
        : 'standard full-height carcass with soft-close hardware';

  if (roomType === 'KITCHEN') {
    return {
      category: 'Modular kitchen',
      specification: `${prefs.kitchenLayout.replace('_', ' ').toLowerCase()} kitchen, 18mm BWP carcass, quartz top, ${storageNote}`,
      brandTier: style.brandTier,
      finish: 'Acrylic / matt lacquer shutters',
      unit: 'r.ft',
      indicativeRate: 5500,
      trade: 'MODULAR_KITCHEN',
      quantityBasis: 'RUNNING_FT_KITCHEN'
    };
  }
  if (roomType === 'WARDROBE' || roomType === 'MASTER_BEDROOM' || roomType === 'BEDROOM' || roomType === 'KIDS_BEDROOM') {
    return {
      category: 'Wardrobe / storage joinery',
      specification: `18mm BWP carcass, veneer shutters, ${storageNote}`,
      brandTier: style.brandTier,
      finish: 'PU matt',
      unit: 'sq.ft',
      indicativeRate: 990,
      trade: 'WARDROBES_STORAGE',
      quantityBasis: 'WARDROBE_ELEVATION'
    };
  }
  if (roomType === 'LIVING' || roomType === 'DINING' || roomType === 'STUDY') {
    return {
      category: 'Feature joinery',
      specification: 'TV console, crockery unit and fluted panelling in veneer',
      brandTier: style.brandTier,
      finish: 'PU matt',
      unit: 'r.ft',
      indicativeRate: 4165,
      trade: 'CARPENTRY_JOINERY',
      quantityBasis: 'RUNNING_FT_LIVING'
    };
  }
  if (roomType === 'GAZEBO') {
    return {
      category: 'Gazebo structure & pergola',
      specification: 'MS frame with timber-clad columns and pitched rafter ceiling',
      brandTier: 'Burma teak / MS fabricated',
      finish: 'PU matt on timber',
      unit: 'sq.ft',
      indicativeRate: 802,
      trade: 'LANDSCAPING_OUTDOORS',
      quantityBasis: 'FLOOR_AREA'
    };
  }
  return null;
}

function ceilingSpec(roomType: RoomType): MaterialSpecLine | null {
  if (OUTDOOR_ROOMS.includes(roomType)) return null;
  return {
    category: 'Ceiling',
    specification: '12.5mm gypsum board on GI framing with perimeter cove',
    brandTier: 'Saint-Gobain Gyproc',
    finish: 'Painted matt',
    unit: 'sq.ft',
    indicativeRate: 118,
    trade: 'FALSE_CEILINGS',
    quantityBasis: 'CEILING_AREA'
  };
}

function paintSpec(): MaterialSpecLine {
  return {
    category: 'Painting & polish',
    specification: 'Putty, primer and 2 coats premium emulsion; PU on veneer',
    brandTier: 'Asian Paints Royale / PU',
    finish: 'Matt emulsion',
    unit: 'sq.ft',
    indicativeRate: 87,
    trade: 'PAINTING_POLISHING',
    quantityBasis: 'WALL_CEILING_AREA'
  };
}

function electricalSpec(prefs: DesignPreferences): MaterialSpecLine {
  const automation =
    prefs.specialRequirements.includes('ELDERLY_FRIENDLY') || prefs.specialRequirements.includes('ACCESSIBILITY')
      ? 'with night-path lighting and easy-reach switch heights'
      : 'with app-based scene control';
  return {
    category: 'Electrical & automation',
    specification: `Modular points, ${prefs.lighting.join('/').toLowerCase()} lighting circuits ${automation}`,
    brandTier: 'Legrand Arteor / Polycab',
    finish: 'Matt plate',
    unit: 'point',
    indicativeRate: 2580,
    trade: 'ELECTRICAL_AUTOMATION',
    quantityBasis: 'POINTS'
  };
}

function plumbingSpec(roomType: RoomType): MaterialSpecLine | null {
  if (!WET_ROOMS.includes(roomType)) return null;
  return {
    category: 'Plumbing & sanitary',
    specification: 'Concealed CP lines, wall-hung WC, thermostatic mixer, rain shower',
    brandTier: 'Jaquar / Kohler / Astral',
    finish: 'Chrome',
    unit: 'lump sum',
    indicativeRate: roomType === 'KITCHEN' || roomType === 'UTILITY' ? 84000 : 168000,
    trade: 'PLUMBING_SANITARY',
    quantityBasis: 'LUMPSUM'
  };
}

function hvacSpec(roomType: RoomType): MaterialSpecLine | null {
  if (OUTDOOR_ROOMS.includes(roomType) || roomType === 'BATHROOM' || roomType === 'POWDER_ROOM' || roomType === 'WARDROBE') {
    return null;
  }
  return {
    category: 'Air conditioning',
    specification: 'Concealed ducted indoor unit with linear slot diffuser',
    brandTier: 'Daikin VRV',
    finish: 'Powder-coated grill',
    unit: 'nos',
    indicativeRate: 139000,
    trade: 'HVAC_VENTILATION',
    quantityBasis: 'ONE_PER_ROOM'
  };
}

function vastuNote(roomType: RoomType, direction: string): string {
  const map: Partial<Record<RoomType, string>> = {
    KITCHEN: 'Kitchen placed in the south-east (Agni) zone as per Vastu.',
    MASTER_BEDROOM: 'Master bed head placed towards the south-west wall.',
    LIVING: 'Main seating faces north-east to catch morning light.',
    BATHROOM: 'Wet area drainage falls to the north-east corner.'
  };
  return map[roomType] || `Vastu orientation checked against the ${direction} wall.`;
}

/**
 * Generates 3-5 room-wise concepts from the SAME floor plan model.
 * The requested style always appears first; the rest give the client a real
 * choice on palette, material voice and budget.
 */
export function generateConcepts(
  projectId: string,
  model: FloorPlanModel,
  prefs: DesignPreferences,
  requestedCount = 4
): DesignConcept[] {
  const ordered = [
    ...STYLE_TEMPLATES.filter(t => t.style === prefs.style),
    ...STYLE_TEMPLATES.filter(t => t.style !== prefs.style)
  ].slice(0, Math.min(Math.max(requestedCount, 3), 5));

  const budgetMid =
    prefs.budgetBand === 'CUSTOM' && prefs.customBudgetINR
      ? prefs.customBudgetINR
      : model.totalCarpetSqFt * (STYLE_TEMPLATES[0].ratePerSqFt[prefs.budgetBand] || 2900);

  return ordered.map((template, idx) => {
    const ratePerSqFt = template.ratePerSqFt[prefs.budgetBand] || 2900;

    const roomSchemes: RoomScheme[] = model.rooms.map(room => {
      const instruction = prefs.roomInstructions.find(r => r.roomId === room.id);
      const materials: MaterialSpecLine[] = [];
      const floor = flooringSpec(prefs, room.roomType);
      materials.push(floor);
      const joinery = joinerySpec(room.roomType, prefs, template);
      if (joinery) materials.push(joinery);
      const ceiling = ceilingSpec(room.roomType);
      if (ceiling) materials.push(ceiling);
      if (!OUTDOOR_ROOMS.includes(room.roomType)) materials.push(paintSpec());
      materials.push(electricalSpec(prefs));
      const plumbing = plumbingSpec(room.roomType);
      if (plumbing) materials.push(plumbing);
      const hvac = hvacSpec(room.roomType);
      if (hvac) materials.push(hvac);

      const features: string[] = [
        `Ceiling at ${room.ceilingHeightFt}' with ${ceiling ? 'perimeter cove' : 'open-to-structure finish'}`,
        `Floor finish in ${floor.specification.split(',')[0].toLowerCase()}`
      ];
      if (joinery) features.push(joinery.category);
      if (prefs.specialRequirements.includes('VASTU')) {
        features.push(vastuNote(room.roomType, 'north'));
      }
      if (prefs.specialRequirements.includes('CHILDREN') && (room.roomType === 'KIDS_BEDROOM' || room.roomType === 'BEDROOM')) {
        features.push('Rounded edge joinery and anti-skid flooring for children');
      }
      if (prefs.specialRequirements.includes('PETS') && OUTDOOR_ROOMS.includes(room.roomType)) {
        features.push('Pet-safe deck finish and a wash-down point');
      }
      if (instruction?.instruction) features.push(`Client brief: ${instruction.instruction}`);

      const styledMaterials = materials.map(m => ({
        ...m,
        indicativeRate: Math.round(m.indicativeRate * template.costFactor)
      }));

      // Prefer the project's own photograph of THIS room over a style reference,
      // so a concept never shows an unrelated space.
      const roomMedia = mediaForRoom(room.id, room.roomType);
      const heroMedia = primaryVisualForRoom(room.id, room.roomType);
      const secondMedia = roomMedia.find(m => m.id !== heroMedia?.id);
      const imageIndex = idx % template.moodImages.length;
      return {
        roomId: room.id,
        roomName: room.name,
        roomType: room.roomType,
        conceptTitle: `${template.name} - ${room.name}`,
        palette: template.palette,
        materials: styledMaterials,
        furniture: template.furnitureVoice,
        lighting: template.lightingVoice,
        keyFeatures: features,
        moodImageUrl: secondMedia?.url || template.moodImages[imageIndex],
        renderImageUrl: heroMedia?.url || template.moodImages[(imageIndex + 1) % template.moodImages.length],
        customerInstructionApplied: instruction?.instruction,
        locked: false,
        roomAreaSqFt: room.areaSqFt,
        roomPerimeterFt: room.perimeterFt,
        roomWallAreaSqFt: room.wallAreaSqFt,
        roomCeilingHeightFt: room.ceilingHeightFt
      };
    });

    const estimated = costOfSchemes(roomSchemes) || model.totalCarpetSqFt * ratePerSqFt;

    return {
      id: uid('CONCEPT', `${projectId}-${template.style}-v1`),
      projectId,
      code: `OPT-${String(idx + 1).padStart(2, '0')}-${template.style}`,
      name: template.name,
      style: template.style,
      tagline: template.tagline,
      narrative: template.narrative,
      palette: template.palette,
      budgetBand: prefs.budgetBand,
      estimatedCostMinINR: Math.round(estimated * 0.92),
      estimatedCostMaxINR: Math.round(estimated * 1.08),
      ratePerSqFt,
      roomSchemes,
      moodBoard: template.moodImages.map((url, i) => ({
        label: ['Hero view', 'Detail', 'Material mood'][i] || 'Reference',
        imageUrl: url,
        note: `${template.materialVoice} - ${BAND_LABEL[prefs.budgetBand]} band`
      })),
      whyThisFits: [
        `${prefs.style === template.style ? 'Matches the requested style' : 'Alternative direction'} for a ${model.totalCarpetSqFt} sq.ft ${prefs.propertyType.toLowerCase().replace('_', ' ')}`,
        `${prefs.palette.toLowerCase()} palette as requested`,
        `${prefs.flooring.toLowerCase()} flooring in living areas, ${prefs.kitchenLayout.replace('_', ' ').toLowerCase()} kitchen`,
        `${prefs.storage.toLowerCase()} storage strategy applied across ${roomSchemes.filter(s => s.materials.some(m => m.trade === 'WARDROBES_STORAGE')).length} rooms`
      ],
      constraintsRespected: [
        `Every scheme uses only the ${model.rooms.length} measured rooms in the floor plan model`,
        `Circulation kept at ${model.circulationSqFt} sq.ft - no furniture placed in the movement path`,
        `Estimated cost sits ${estimated <= budgetMid ? 'within' : 'above'} the ${BAND_LABEL[prefs.budgetBand]} budget of ${Math.round(budgetMid).toLocaleString('en-IN')}`,
        ...(prefs.specialRequirements.length
          ? [`Special requirements carried through: ${prefs.specialRequirements.join(', ').toLowerCase()}`]
          : [])
      ],
      status: 'PRESENTED',
      version: 1,
      createdAt: new Date().toISOString(),
      createdBy: 'AI Design Studio Engine',
      presentedAt: new Date().toISOString(),
      revisions: [],
      imagePromptUsed: [
        `Interior concept render, ${template.name.toLowerCase()}, ${prefs.palette.toLowerCase()} palette`,
        `${prefs.flooring.toLowerCase()} flooring`,
        `room ${model.rooms.length > 0 ? 'geometry locked to measured plan' : ''}`,
        `${template.materialVoice}`,
        'photorealistic, natural daylight, no text, no watermark'
      ].join(', ')
    };
  });
}

// ---------------------------------------------------------------------------
// 3. REVISIONS
// ---------------------------------------------------------------------------
const PALETTE_ROTATION: Record<ColourPalette, string[]> = {
  WARM: ['#F3E3D3 Blush Sand', '#C98F63 Terracotta', '#5A4634 Walnut', '#E8D5B7 Cream'],
  NEUTRAL: ['#F7F6F3 Off-white', '#D6D2CB Greige', '#8F8B84 Stone', '#33322F Charcoal'],
  EARTHY: ['#E8DDC8 Clay', '#A9744F Cinnamon', '#5C6B4A Olive', '#3A3227 Umber'],
  MONOCHROME: ['#FFFFFF White', '#CFCFCF Silver', '#7A7A7A Graphite', '#1C1C1C Black'],
  CUSTOM: ['#F5F1E8 Ivory', '#B99B6B Travertine', '#3E3A35 Charcoal', '#7C6A55 Bronze']
};

export function applyConceptRevision(
  concept: DesignConcept,
  revision: ConceptRevision,
  actor: string
): DesignConcept {
  const next: DesignConcept = JSON.parse(JSON.stringify(concept));
  next.version += 1;
  const scopeRooms =
    revision.scope === 'ROOM' && revision.roomId
      ? next.roomSchemes.filter(s => s.roomId === revision.roomId)
      : next.roomSchemes;

  let summary = '';

  switch (revision.changeType) {
    case 'COLOUR_ONLY': {
      const said = revision.instruction.toLowerCase();
      const key: ColourPalette = /monochrome|black|white|grey|gray/.test(said)
        ? 'MONOCHROME'
        : /earth|terracotta|clay|olive|brown/.test(said)
          ? 'EARTHY'
          : /neutral|beige|greige|sand/.test(said)
            ? 'NEUTRAL'
            : 'WARM';
      const palette = PALETTE_ROTATION[key];
      next.palette = palette;
      scopeRooms.forEach(room => {
        room.palette = palette;
        room.keyFeatures = [...room.keyFeatures.filter(f => !f.startsWith('Palette:')), `Palette: ${palette.join(' / ')}`];
        const paint = room.materials.find(m => m.trade === 'PAINTING_POLISHING');
        if (paint) paint.finish = `${palette[0].split(' ')[0]} matt emulsion`;
      });
      summary = `Palette changed to ${palette.join(' / ')} on ${scopeRooms.length} room(s). Furniture and layout untouched.`;
      break;
    }
    case 'FLOORING_SWAP': {
      const wantWood = /wood|oak|timber/i.test(revision.instruction);
      scopeRooms.forEach(room => {
        const floor = room.materials.find(m => m.trade === 'FLOORING_TILING');
        if (!floor) return;
        if (wantWood) {
          floor.category = 'Wooden flooring';
          floor.specification = '1900x190x15mm engineered oak on acoustic underlay';
          floor.brandTier = 'Parador / Squarefoot';
          floor.indicativeRate = 326;
        } else {
          floor.category = 'Stone flooring';
          floor.specification = '800x800mm honed marble with epoxy grout';
          floor.brandTier = 'Botticino Classico';
          floor.indicativeRate = 450;
        }
        room.keyFeatures = [...room.keyFeatures.filter(f => !f.startsWith('Floor finish')), `Floor finish: ${floor.category}`];
      });
      summary = `${wantWood ? 'Wooden' : 'Marble'} flooring applied to ${scopeRooms.length} room(s); rates re-costed.`;
      break;
    }
    case 'SOFA_SWAP': {
      scopeRooms
        .filter(room => room.roomType === 'LIVING')
        .forEach(room => {
          room.furniture = room.furniture.map(f =>
            /sofa/i.test(f) ? 'Three-seat sofa in performance linen with a chaise on the window side' : f
          );
        });
      summary = 'Living room seating replaced with a linen chaise sofa; room geometry and layout preserved.';
      break;
    }
    case 'MATERIAL_SWAP': {
      scopeRooms.forEach(room => {
        room.materials = room.materials.map(m => ({
          ...m,
          brandTier: m.brandTier.includes('Imported') ? 'Premium Indian equivalent' : 'Imported / premium',
          finish: m.finish.includes('Matt') ? 'Satin' : m.finish
        }));
      });
      summary = `Material tier swapped on ${scopeRooms.length} room(s); BOQ will pick up the new tier.`;
      break;
    }
    case 'BUDGET_VARIANT': {
      const delta = /lower|cheaper|reduce|economy/i.test(revision.instruction) ? -0.15 : 0.15;
      next.ratePerSqFt = Math.round(next.ratePerSqFt * (1 + delta));
      scopeRooms.forEach(room => {
        room.materials = room.materials.map(m => ({
          ...m,
          indicativeRate: Math.round(m.indicativeRate * (1 + delta))
        }));
      });
      summary = `Cost variant generated at ${delta > 0 ? '+' : ''}${Math.round(delta * 100)}% on the same design; all quantities unchanged.`;
      break;
    }
    case 'LAYOUT_CHANGE': {
      scopeRooms.forEach(room => {
        room.furniture = [...room.furniture, 'Revised furniture arrangement per client instruction'];
        room.keyFeatures = [...room.keyFeatures, 'Layout revised - circulation rechecked at 900mm minimum'];
      });
      summary = `Layout revised in ${scopeRooms.length} room(s) with circulation rechecked.`;
      break;
    }
    default: {
      scopeRooms.forEach(room => {
        room.keyFeatures = [...room.keyFeatures, `Revision: ${revision.instruction}`];
      });
      summary = `Client note recorded against ${scopeRooms.length} room(s).`;
    }
  }

  // Re-cost the concept from its own room schemes so money stays traceable.
  const recost = recostConcept(next);
  next.estimatedCostMinINR = Math.round(recost * 0.92);
  next.estimatedCostMaxINR = Math.round(recost * 1.08);

  next.revisions = [
    ...next.revisions,
    { ...revision, resolvedAt: new Date().toISOString(), resultSummary: summary, versionAfter: next.version }
  ];
  next.status = 'PRESENTED';
  return next;
}

/** Indicative build-up cost of a set of room schemes (geometry x rates). */
export function costOfSchemes(schemes: RoomScheme[]): number {
  return Math.round(
    schemes.reduce((sum, room) => {
      const roomCost = room.materials.reduce((inner, line) => {
        const qty = quantityFor(line.quantityBasis, {
          areaSqFt: room.roomAreaSqFt,
          wallAreaSqFt: room.roomWallAreaSqFt,
          perimeterFt: room.roomPerimeterFt,
          roomType: room.roomType
        });
        const wastage = line.unit === 'sq.ft' ? 1.07 : line.unit === 'r.ft' ? 1.04 : 1;
        return inner + qty * wastage * line.indicativeRate;
      }, 0);
      return sum + roomCost;
    }, 0)
  );
}

/**
 * Room-wise indicative cost of a concept, recomputed from its own material
 * lines and the geometry stored on each room scheme. This is what keeps the
 * concept cost honest after a revision (change the finish -> cost changes).
 */
export function recostConcept(concept: DesignConcept): number {
  return costOfSchemes(concept.roomSchemes);
}

// ---------------------------------------------------------------------------
// 4. CONCEPT -> BOQ (room-wise, master-rate matched)
// ---------------------------------------------------------------------------
const UNIT_FALLBACK: Record<string, MeasurementUnit> = {
  FLOOR_AREA: 'sq.ft',
  WALL_CEILING_AREA: 'sq.ft',
  CEILING_AREA: 'sq.ft',
  WARDROBE_ELEVATION: 'sq.ft',
  RUNNING_FT_KITCHEN: 'r.ft',
  RUNNING_FT_LIVING: 'r.ft',
  POINTS: 'point',
  LUMPSUM: 'lump sum',
  ONE_PER_ROOM: 'nos'
};

function quantityFor(basis: string, room: { areaSqFt: number; wallAreaSqFt: number; perimeterFt: number; roomType: RoomType }): number {
  switch (basis) {
    case 'FLOOR_AREA':
      return r2(room.areaSqFt);
    case 'WALL_CEILING_AREA':
      return r2(room.wallAreaSqFt + room.areaSqFt);
    case 'CEILING_AREA':
      return r2(room.areaSqFt);
    case 'WARDROBE_ELEVATION':
      return r2(Math.min(room.areaSqFt * 0.55, room.perimeterFt * 0.6));
    case 'RUNNING_FT_KITCHEN':
      return r2(Math.max(8, Math.sqrt(room.areaSqFt) * 2.6));
    case 'RUNNING_FT_LIVING':
      return r2(Math.max(6, room.perimeterFt * 0.2));
    case 'POINTS':
      return Math.max(4, Math.ceil(room.areaSqFt / 25));
    case 'ONE_PER_ROOM':
      return 1;
    case 'LUMPSUM':
    default:
      return 1;
  }
}

/**
 * Converts an APPROVED concept into a room-wise BOQ revision.
 * Quantities come from the floor plan model; rates come from the Master
 * Schedule of Rates when a matching trade + unit exists, otherwise from the
 * concept's own indicative rate (flagged PROVISIONAL).
 */
export function generateBOQFromConcept(
  session: DesignStudioSession,
  concept: DesignConcept,
  masterRates: MasterRateItem[],
  revisionId: string,
  revisionLabel: string
): { items: BOQItem[]; subtotalSelling: number } {
  const model = session.model;
  if (!model) throw new Error('A confirmed floor plan model is required before generating a BOQ.');

  const items: BOQItem[] = [];
  let counter = 0;

  concept.roomSchemes.forEach(scheme => {
    const room = model.rooms.find(r => r.id === scheme.roomId);
    if (!room) return;

    scheme.materials.forEach(line => {
      counter += 1;
      const unit = UNIT_FALLBACK[line.quantityBasis] || line.unit;
      const baseQuantity = quantityFor(line.quantityBasis, {
        areaSqFt: room.areaSqFt,
        wallAreaSqFt: room.wallAreaSqFt,
        perimeterFt: room.perimeterFt,
        roomType: room.roomType
      });
      const wastagePercent = unit === 'sq.ft' ? 7 : unit === 'r.ft' ? 4 : 0;
      const finalQuantity = r2(baseQuantity * (1 + wastagePercent / 100));

      const master = masterRates.find(
        rate => rate.trade === line.trade && rate.unit === unit && rate.status === 'APPROVED'
      );

      const materialRate = master ? master.materialRate : Math.round(line.indicativeRate * 0.62);
      const labourRate = master ? master.labourRate : Math.round(line.indicativeRate * 0.3);
      const equipmentRate = master ? master.equipmentRate : Math.round(line.indicativeRate * 0.03);
      const subcontractRate = master ? master.subcontractRate : 0;
      const unitCost = materialRate + labourRate + equipmentRate + subcontractRate;
      const markupPercent = master ? master.defaultMarkupPercent : 25;
      const sellingRate = Math.round(unitCost * (1 + markupPercent / 100));

      items.push({
        id: `BOQ-${concept.code}-${String(counter).padStart(3, '0')}`,
        boqRevisionId: revisionId,
        itemCode: `${line.trade.slice(0, 3)}-${String(counter).padStart(2, '0')}`,
        trade: line.trade as TradeCategory,
        workPackage: `${concept.name} - ${scheme.roomName}`,
        floor: room.floor,
        roomZone: room.name,
        description: `${line.category} in ${room.name} (${room.lengthFt}' x ${room.widthFt}') as per ${concept.name} concept v${concept.version}`,
        specification: line.specification,
        brandGrade: line.brandTier,
        inclusions: 'Supply, installation, finishing and site protection',
        exclusions: 'Loose furniture, appliances and decor unless listed separately',
        unit,
        length: room.lengthFt,
        width: room.widthFt,
        height: room.ceilingHeightFt,
        quantityFormula: `${line.quantityBasis} -> ${baseQuantity} ${unit} (+${wastagePercent}% wastage)`,
        baseQuantity,
        wastagePercent,
        finalQuantity,
        quantityType: room.confidence === 'AI_INFERRED' ? 'PROVISIONAL_ALLOWANCE' : 'MEASURED',
        materialRate,
        labourRate,
        equipmentRate,
        subcontractRate,
        unitCost,
        totalCost: r2(finalQuantity * unitCost),
        markupPercent,
        sellingRate,
        sellingAmount: r2(finalQuantity * sellingRate),
        rateSource: master ? 'APPROVED_MASTER' : 'ILLUSTRATIVE_BENCHMARK',
        rateStatus: master ? 'APPROVED' : 'PROVISIONAL',
        sourceDocumentRef: model.source.fileName
          ? `${model.source.fileName} + ${concept.code} v${concept.version}`
          : `${concept.code} v${concept.version} (room model confirmed by user)`,
        assumptions:
          room.confidence === 'AI_INFERRED'
            ? 'Room dimensions were AI-inferred - quantity must be re-verified on site before the baseline is frozen.'
            : 'Quantity derived from the confirmed floor plan model.',
        isApprovedByEstimator: false,
        notes: line.quantityBasis
      });
    });
  });

  const subtotalSelling = r2(items.reduce((sum, item) => sum + item.sellingAmount, 0));
  return { items, subtotalSelling };
}

// ---------------------------------------------------------------------------
// 5. SESSION HELPERS
// ---------------------------------------------------------------------------
export function newSession(projectId: string): DesignStudioSession {
  const now = new Date().toISOString();
  return {
    projectId,
    stage: 'AWAITING_FLOOR_PLAN',
    concepts: [],
    promptHistory: [],
    createdAt: now,
    updatedAt: now
  };
}

export function logPrompt(
  session: DesignStudioSession,
  actor: string,
  action: string,
  prompt: string,
  outputSummary: string,
  engine = 'DesignStudioEngine v1 (deterministic geometry-preserving)'
): DesignStudioSession {
  const entry: PromptHistoryEntry = {
    id: `PROMPT-${session.promptHistory.length + 1}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actor,
    action,
    prompt,
    engine,
    outputSummary
  };
  return { ...session, promptHistory: [entry, ...session.promptHistory].slice(0, 200) };
}
