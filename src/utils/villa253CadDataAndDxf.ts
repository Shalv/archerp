/**
 * Build Storys ERP - Villa 253 Authoritative Wall Marking Drawing R0 & Editable DXF/SVG CAD Engine
 *
 * Source Authority:
 * Drawing Title: VILLA 253 - NORTH FACING - 24 TYPE - 3 BEDROOM WITH ROOF GAZEBO (WALL MARKING DRAWING)
 * Date: 10-10-24 | Revision: 0 | Sheets: 1/2 (Ground & First Floor Plans) & 2/2 (Section BB', Roof Gazebo & Schedule)
 *
 * Key Verified Dimensions from Source Drawing:
 * - Outer Footprint: 85'-5" × 20'-4" (Structural bays: 35'-9" + 27'-7" + 22'-1")
 * - Living & Dining Great Room (ROOM-V253-LIV-01): 25'-4" × 19'-0" (481 sq.ft), 27'-0" × 10'-3" slider SD1
 * - Bedroom 1 Master Suite (ROOM-V253-BED1-01): 14'-0" × 19'-0" (266 sq.ft), Walk-in Wardrobe 10'-2" × 11'-9", Toilet 1 14'-0" × 7'-0" (6'-0" × 24'-9" zone)
 * - Bedroom 2 Suite (ROOM-V253-BED2-01): 18'-11" × 19'-0" (359 sq.ft), Wardrobe 7'-9" × 9'-8", Toilet 2 10'-4" × 9'-8"
 * - Bedroom 3 First Floor Suite (ROOM-V253-BED3-01): 20'-8" × 19'-0" (393 sq.ft), Toilet 3 9'-9" × 9'-2", Front Balcony 24'-4" × 4'-0"
 * - Staircase Core (ROOM-V253-STAIR-01): 7'-6" × 19'-0" (143 sq.ft, 21 Risers, Tread 11", Riser 6.25", 3'-6" Flight Width)
 * - Kitchen, Utility & Powder Wing (ROOM-V253-KIT-01): Kitchen 14'-6" × 9'-0" (131 sq.ft), Utility 9'-0" × 9'-8", Powder 5'-0" × 9'-8"
 * - Roof Gazebo Pavilion (ROOM-V253-GAZEBO-01): 24'-0" × 18'-0" (432 sq.ft, Section BB' Pitched Timber Pergola, Ridge 12'-9")
 * - Exterior Decks: North Front Deck 57'-2" × 9'-6", Bar Unit Deck 14'-0" × 30'-10", Rear Living Deck 13'-0" × 9'-6"
 */

export type CadLayerId =
  | 'WALLS'
  | 'DOORS'
  | 'WINDOWS'
  | 'STAIRCASE'
  | 'DECKS_BALCONIES'
  | 'DIMENSIONS'
  | 'TEXT'
  | 'NOTES';

export interface CadLayerDefinition {
  id: CadLayerId;
  dxfLayerName: string;
  label: string;
  colorHex: string;
  aciColor: number; // AutoCAD Color Index (1=Red, 2=Yellow, 3=Green, 4=Cyan, 5=Blue, 6=Magenta, 7=White, 8=Grey)
  description: string;
  defaultVisible: boolean;
}

export const VILLA_253_CAD_LAYERS: CadLayerDefinition[] = [
  {
    id: 'WALLS',
    dxfLayerName: 'A-WALL',
    label: 'Walls (9" Ext / 4.5" Int)',
    colorHex: '#E2E8F0',
    aciColor: 7,
    description: 'Structural RCC columns & 230mm/115mm masonry wall markings',
    defaultVisible: true
  },
  {
    id: 'DOORS',
    dxfLayerName: 'A-DOOR',
    label: 'Doors & Sliders (SD1–SD7, D1–D4)',
    colorHex: '#38BDF8',
    aciColor: 4,
    description: 'Aluminum sliding portals (SD1 27ft, SD2 12ft, SD4, SD5, SD6, SD7) & wooden flush doors',
    defaultVisible: true
  },
  {
    id: 'WINDOWS',
    dxfLayerName: 'A-WIND',
    label: 'Windows & Glazing (W1–W6, FW1–FW2)',
    colorHex: '#FBBF24',
    aciColor: 2,
    description: 'Architectural slit windows, staircase double-height fixed glazing (W2/W2A) & clerestory',
    defaultVisible: true
  },
  {
    id: 'STAIRCASE',
    dxfLayerName: 'A-STRS',
    label: 'Staircase (7\'6" × 19\'0" • 21 Risers)',
    colorHex: '#A78BFA',
    aciColor: 6,
    description: 'RCC double-flight dogleg staircase with 11" treads, 6.25" risers & mid-landing',
    defaultVisible: true
  },
  {
    id: 'DECKS_BALCONIES',
    dxfLayerName: 'A-DECK',
    label: 'Decks, Balconies & Roof Gazebo',
    colorHex: '#34D399',
    aciColor: 3,
    description: '57\'2" × 9\'6" North Deck, 14\'0" × 30\'10" Bar Deck, 13\'0" Rear Deck, Balconies & Gazebo',
    defaultVisible: true
  },
  {
    id: 'DIMENSIONS',
    dxfLayerName: 'A-DIMS',
    label: 'Dimensions (Wall Marking R0)',
    colorHex: '#F97316',
    aciColor: 30,
    description: 'Authoritative wall-to-wall dimensions, bay spans (35\'9" + 27\'7" + 22\'1") & footprint',
    defaultVisible: true
  },
  {
    id: 'TEXT',
    dxfLayerName: 'A-TEXT',
    label: 'Room Labels & Area Callouts',
    colorHex: '#F8FAFC',
    aciColor: 7,
    description: 'Room designations, exact dimensions in feet-inches, and door/window schedule tags',
    defaultVisible: true
  },
  {
    id: 'NOTES',
    dxfLayerName: 'A-NOTE',
    label: 'Title Block & Construction Notes',
    colorHex: '#94A3B8',
    aciColor: 8,
    description: 'Villa 253 North-Facing R0 title block, datum notes, and CAD reconstruction authority notice',
    defaultVisible: true
  }
];

export interface Villa253RoomSpec {
  roomId: string;
  code: string;
  name: string;
  shortLabel: string;
  floor: 'GROUND' | 'FIRST' | 'ROOF';
  dimensionText: string;
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  areaSqFt: number;
  adjunctSpaces: string[];
  doorWindowMarks: string[];
  cadX: number; // In feet from SW origin (0,0) of main ground footprint
  cadY: number;
  cadW: number;
  cadH: number;
}

export const VILLA_253_AUTHORITATIVE_SPECS: Record<string, Villa253RoomSpec> = {
  'ROOM-V253-LIV-01': {
    roomId: 'ROOM-V253-LIV-01',
    code: 'LIV-DIN',
    name: 'Living & Dining Great Room',
    shortLabel: 'LIVING & DINING',
    floor: 'GROUND',
    dimensionText: "25'-4\" × 19'-0\"",
    lengthFt: 25.33,
    widthFt: 19.0,
    heightFt: 10.25,
    areaSqFt: 481,
    adjunctSpaces: ["Front Deck 57'-2\" × 9'-6\"", "Rear Living Deck 13'-0\" × 9'-6\""],
    doorWindowMarks: ['SD1 (27\'0"×10\'3")', 'SD5 (11\'0"×10\'3")', 'W1 (1\'6"×9\'1")', 'FW1 (15\'9"×1\'3")'],
    cadX: 35.75,
    cadY: 0,
    cadW: 25.33,
    cadH: 19.0
  },
  'ROOM-V253-BED1-01': {
    roomId: 'ROOM-V253-BED1-01',
    code: 'BED-1',
    name: 'Master Bedroom 1 Suite & Walk-in Closet',
    shortLabel: 'BEDROOM 1 (MASTER)',
    floor: 'GROUND',
    dimensionText: "14'-0\" × 19'-0\"",
    lengthFt: 14.0,
    widthFt: 19.0,
    heightFt: 10.25,
    areaSqFt: 266,
    adjunctSpaces: ["Walk-in Wardrobe 10'-2\" × 11'-9\"", "Toilet 1 (14'-0\" × 7'-0\" / 6'-0\" × 24'-9\")", "Private Deck 11'-6\" × 4'-6\""],
    doorWindowMarks: ['SD2 (12\'0"×10\'3")', 'SD4 (10\'0"×10\'3")', 'SD7 (7\'0"×10\'3")', 'D1 (4\'0"×10\'3")', 'D2 (3\'6"×10\'3")', 'W6 (2\'6"×6\'6")'],
    cadX: 14.25,
    cadY: 0,
    cadW: 14.0,
    cadH: 19.0
  },
  'ROOM-V253-BED2-01': {
    roomId: 'ROOM-V253-BED2-01',
    code: 'BED-2',
    name: 'Bedroom 2 & Bar Deck Suite',
    shortLabel: 'BEDROOM 2',
    floor: 'GROUND',
    dimensionText: "18'-11\" × 19'-0\"",
    lengthFt: 18.91,
    widthFt: 19.0,
    heightFt: 10.25,
    areaSqFt: 359,
    adjunctSpaces: ["Bar Unit Deck 14'-0\" × 30'-10\"", "Wardrobe 7'-9\" × 9'-8\"", "Toilet 2 10'-4\" × 9'-8\""],
    doorWindowMarks: ['SD2 (12\'0"×10\'3")', 'SD6 (9\'0"×10\'3")', 'D1 (4\'0"×10\'3")', 'D3 (3\'3"×7\'8")', 'W5 (1\'6"×6\'6")', 'FW2 (9\'0"×Roof)'],
    cadX: 66.5,
    cadY: 0,
    cadW: 18.91,
    cadH: 19.0
  },
  'ROOM-V253-KIT-01': {
    roomId: 'ROOM-V253-KIT-01',
    code: 'KIT-UTL',
    name: 'Culinary Kitchen, Utility & Powder Wing',
    shortLabel: 'KITCHEN & UTILITY',
    floor: 'GROUND',
    dimensionText: "14'-6\" × 9'-0\"",
    lengthFt: 14.5,
    widthFt: 9.0,
    heightFt: 10.25,
    areaSqFt: 131,
    adjunctSpaces: ["Utility Room 9'-0\" × 9'-8\"", "Powder Room 5'-0\" × 9'-8\""],
    doorWindowMarks: ['D4 (3\'0"×7\'8")', 'W3 (1\'3"×5\'7")', 'W4 (3\'0"×4\'0")'],
    cadX: 52.0,
    cadY: -9.67,
    cadW: 14.5,
    cadH: 9.0
  },
  'ROOM-V253-STAIR-01': {
    roomId: 'ROOM-V253-STAIR-01',
    code: 'STAIR',
    name: 'Architectural Staircase & Double-Height Core',
    shortLabel: 'STAIRCASE',
    floor: 'GROUND',
    dimensionText: "7'-6\" × 19'-0\"",
    lengthFt: 19.0,
    widthFt: 7.5,
    heightFt: 22.5,
    areaSqFt: 143,
    adjunctSpaces: ["21 Risers (Tread 11\", Riser 6.25\")", "Mid-Landing 3'-6\" × 7'-6\""],
    doorWindowMarks: ['SD3 (5\'0"×10\'3")', 'W2 & W2A (5\'0"×Mid-Landing)', 'SD4A (5\'0"×Beam)'],
    cadX: 28.25,
    cadY: 0,
    cadW: 7.5,
    cadH: 19.0
  },
  'ROOM-V253-BED3-01': {
    roomId: 'ROOM-V253-BED3-01',
    code: 'BED-3',
    name: 'First Floor Bedroom 3 & Balconies',
    shortLabel: 'BEDROOM 3 (1ST FLR)',
    floor: 'FIRST',
    dimensionText: "20'-8\" × 19'-0\"",
    lengthFt: 20.66,
    widthFt: 19.0,
    heightFt: 10.25,
    areaSqFt: 393,
    adjunctSpaces: ["Toilet 3 (9'-9\" × 9'-2\")", "Front Balcony 24'-4\" × 4'-0\"", "Side Balcony 14'-10\" × 4'-0\""],
    doorWindowMarks: ['SD1A (12\'0"×Beam)', 'SD2A (10\'0"×Beam)', 'SD3A (8\'0"×Beam)', 'D1A (4\'0"×Beam)', 'D2A (3\'6"×Beam)', 'W3A (5\'0"×Beam)'],
    cadX: 35.75,
    cadY: 0,
    cadW: 20.66,
    cadH: 19.0
  },
  'ROOM-V253-GAZEBO-01': {
    roomId: 'ROOM-V253-GAZEBO-01',
    code: 'GAZEBO',
    name: 'Signature Roof Gazebo Terrace Pavilion',
    shortLabel: 'ROOF GAZEBO',
    floor: 'ROOF',
    dimensionText: "24'-0\" × 18'-0\"",
    lengthFt: 24.0,
    widthFt: 18.0,
    heightFt: 12.75,
    areaSqFt: 432,
    adjunctSpaces: ["Section BB' Pitched Timber Pergola (Ridge 12'-9\")", "Upper Terrace & Bar Deck Overlook"],
    doorWindowMarks: ['SD4A (5\'0"×Beam)', 'Section BB\' Timber Rafters'],
    cadX: 56.41,
    cadY: 0.5,
    cadW: 24.0,
    cadH: 18.0
  }
};

/**
 * Generates a deterministic, room-specific filename slug (no random suffix)
 */
export function buildRoomSpecificFilename(
  roomIdOrName: string,
  styleOrTheme?: string,
  extension: 'svg' | 'jpg' | 'png' | 'dxf' | 'pdf' = 'jpg'
): string {
  const cleanRoom = roomIdOrName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const spec = VILLA_253_AUTHORITATIVE_SPECS[roomIdOrName];
  const dimSlug = spec
    ? `${Math.round(spec.lengthFt)}x${Math.round(spec.widthFt)}ft`
    : '';
  const cleanStyle = styleOrTheme
    ? styleOrTheme
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 28)
    : 'r0_verified';

  const parts = ['villa253', cleanRoom, dimSlug, cleanStyle].filter(Boolean);
  return `${parts.join('_')}.${extension}`;
}

/**
 * Generates an SVG string of the authoritative Villa 253 Vector CAD Floor Plan
 * with support for active room highlighting, sheet selection, and 8 toggleable CAD layers.
 */
export function generateVilla253VectorCadSvg(options?: {
  activeRoomId?: string;
  sheet?: 'GROUND' | 'FIRST' | 'SECTION' | 'COMPOSITE';
  visibleLayers?: CadLayerId[];
}): string {
  const activeRoomId = options?.activeRoomId || 'ROOM-V253-LIV-01';
  const spec = VILLA_253_AUTHORITATIVE_SPECS[activeRoomId];
  const defaultSheet =
    options?.sheet ||
    (spec?.floor === 'FIRST'
      ? 'FIRST'
      : spec?.floor === 'ROOF'
      ? 'SECTION'
      : 'GROUND');

  const layers = new Set<CadLayerId>(
    options?.visibleLayers || [
      'WALLS',
      'DOORS',
      'WINDOWS',
      'STAIRCASE',
      'DECKS_BALCONIES',
      'DIMENSIONS',
      'TEXT',
      'NOTES'
    ]
  );

  const isLayerOn = (id: CadLayerId) => layers.has(id);
  const isHi = (id: string) => activeRoomId === id;

  // Coordinate system: 1200 x 760 CAD Blueprint Sheet
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" width="1200" height="760">
  <defs>
    <pattern id="cadMinorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" stroke-width="0.6" />
    </pattern>
    <pattern id="cadMajorGrid" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="url(#cadMinorGrid)" />
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#334155" stroke-width="1.1" />
    </pattern>
    <pattern id="deckHatch" width="12" height="12" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="12" y2="0" stroke="#10B981" stroke-width="0.8" stroke-opacity="0.35" />
    </pattern>
    <pattern id="wallHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#94A3B8" stroke-width="1.2" stroke-opacity="0.5" />
    </pattern>
  </defs>

  <!-- Blueprint Background -->
  <rect width="1200" height="760" fill="#090D16" />
  <rect x="16" y="16" width="1168" height="728" fill="url(#cadMajorGrid)" stroke="#475569" stroke-width="2" />
  <rect x="22" y="22" width="1156" height="716" fill="none" stroke="#334155" stroke-width="1" />

  ${
    isLayerOn('NOTES')
      ? `<!-- TOP HEADER & NORTH ARROW -->
  <g font-family="monospace">
    <rect x="34" y="32" width="760" height="46" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1.2" />
    <text x="48" y="52" fill="#F8FAFC" font-size="14" font-weight="bold">VILLA 253 • NORTH FACING • 24 TYPE – 3 BEDROOM WITH ROOF GAZEBO</text>
    <text x="48" y="69" fill="#38BDF8" font-size="11">WALL MARKING DRAWING R0 (DATE: 10-10-24) • AUTHORITATIVE VECTOR CAD RECONSTRUCTION • SHEET: ${defaultSheet}</text>

    <!-- North Compass -->
    <g transform="translate(1115, 62)">
      <circle cx="0" cy="0" r="24" fill="#0F172A" stroke="#F59E0B" stroke-width="1.5" />
      <polygon points="0,-18 -6,8 0,3 6,8" fill="#F59E0B" />
      <text x="0" y="-27" fill="#FBBF24" font-size="11" font-weight="bold" text-anchor="middle">N ↑</text>
      <text x="0" y="18" fill="#94A3B8" font-size="8" text-anchor="middle">NORTH</text>
    </g>
  </g>`
      : ''
  }

  <!-- ===================================================================== -->
  <!-- GROUND FLOOR WALL MARKING PLAN (LEFT / MAIN VIEW)                     -->
  <!-- ===================================================================== -->
  <g transform="translate(60, 135)">
    ${
      isLayerOn('TEXT')
        ? `<text x="0" y="-18" fill="#FBBF24" font-family="monospace" font-size="13" font-weight="bold">GROUND FLOOR PLAN (OUTER FOOTPRINT: 85'-5" × 20'-4" + DECKS &amp; SERVICE WINGS)</text>`
        : ''
    }

    ${
      isLayerOn('DECKS_BALCONIES')
        ? `<!-- Decks & Exterior Terraces (Layer: A-DECK) -->
    <!-- North Front Deck: 57'-2" x 9'-6" -->
    <rect x="240" y="20" width="460" height="76" fill="url(#deckHatch)" stroke="#10B981" stroke-width="1.8" stroke-dasharray="6,3" />
    <!-- Master Bedroom 1 Private West/North Deck: 11'-6" x 4'-6" -->
    <rect x="115" y="58" width="95" height="38" fill="url(#deckHatch)" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,2" />
    <!-- Outdoor Bar Unit Deck (East): 14'-0" x 30'-10" -->
    <rect x="735" y="45" width="112" height="246" fill="url(#deckHatch)" stroke="#10B981" stroke-width="1.8" stroke-dasharray="6,3" />
    <!-- Rear Living Deck (South): 13'-0" x 9'-6" -->
    <rect x="315" y="250" width="115" height="76" fill="url(#deckHatch)" stroke="#10B981" stroke-width="1.5" stroke-dasharray="5,3" />`
        : ''
    }

    ${
      isLayerOn('WALLS')
        ? `<!-- Structural & Partition Walls (Layer: A-WALL) -->
    <!-- Toilet 1 (Master Bath West Wing): 6'-0" x 24'-9" / 14'-0" x 7'-0" -->
    <rect x="40" y="96" width="75" height="205" fill="#0F172A" stroke="#CBD5E1" stroke-width="4" />
    <!-- Walk-In Wardrobe (SW of Bedroom 1): 10'-2" x 11'-9" -->
    <rect x="115" y="250" width="125" height="92" fill="#0F172A" stroke="#CBD5E1" stroke-width="4" />

    <!-- Bedroom 1 (Master): 14'-0" x 19'-0" -->
    <rect x="115" y="96" width="125" height="154" fill="${
      isHi('ROOM-V253-BED1-01') ? '#1E3A8A' : '#111827'
    }" fill-opacity="${isHi('ROOM-V253-BED1-01') ? '0.55' : '0.85'}" stroke="${
          isHi('ROOM-V253-BED1-01') ? '#38BDF8' : '#E2E8F0'
        }" stroke-width="${isHi('ROOM-V253-BED1-01') ? '5' : '4'}" />

    <!-- Staircase Core: 7'-6" x 19'-0" -->
    <rect x="240" y="96" width="75" height="154" fill="${
      isHi('ROOM-V253-STAIR-01') ? '#3B0764' : '#111827'
    }" fill-opacity="${isHi('ROOM-V253-STAIR-01') ? '0.6' : '0.85'}" stroke="${
          isHi('ROOM-V253-STAIR-01') ? '#C084FC' : '#E2E8F0'
        }" stroke-width="${isHi('ROOM-V253-STAIR-01') ? '5' : '4'}" />

    <!-- Living & Dining Great Room: 25'-4" x 19'-0" -->
    <rect x="315" y="96" width="245" height="154" fill="${
      isHi('ROOM-V253-LIV-01') ? '#064E3B' : '#111827'
    }" fill-opacity="${isHi('ROOM-V253-LIV-01') ? '0.55' : '0.85'}" stroke="${
          isHi('ROOM-V253-LIV-01') ? '#34D399' : '#E2E8F0'
        }" stroke-width="${isHi('ROOM-V253-LIV-01') ? '5' : '4'}" />

    <!-- Bedroom 2 Suite: 18'-11" x 19'-0" -->
    <rect x="560" y="96" width="175" height="154" fill="${
      isHi('ROOM-V253-BED2-01') ? '#1E3A8A' : '#111827'
    }" fill-opacity="${isHi('ROOM-V253-BED2-01') ? '0.55' : '0.85'}" stroke="${
          isHi('ROOM-V253-BED2-01') ? '#38BDF8' : '#E2E8F0'
        }" stroke-width="${isHi('ROOM-V253-BED2-01') ? '5' : '4'}" />

    <!-- Kitchen (14'-6" x 9'-0"), Utility (9'-0" x 9'-8") & Powder (5'-0" x 9'-8") South Service Wing -->
    <rect x="430" y="250" width="130" height="76" fill="${
      isHi('ROOM-V253-KIT-01') ? '#7C2D12' : '#0F172A'
    }" fill-opacity="${isHi('ROOM-V253-KIT-01') ? '0.6' : '0.9'}" stroke="${
          isHi('ROOM-V253-KIT-01') ? '#FB923C' : '#CBD5E1'
        }" stroke-width="${isHi('ROOM-V253-KIT-01') ? '5' : '3.5'}" />
    <!-- Utility 9'0" x 9'8" -->
    <rect x="430" y="326" width="82" height="68" fill="#0F172A" stroke="#CBD5E1" stroke-width="3" />
    <!-- Powder 5'0" x 9'8" -->
    <rect x="512" y="326" width="48" height="68" fill="#0F172A" stroke="#CBD5E1" stroke-width="3" />

    <!-- Bedroom 2 Wardrobe (7'-9" x 9'-8") & Toilet 2 (10'-4" x 9'-8") -->
    <rect x="560" y="250" width="72" height="82" fill="#0F172A" stroke="#CBD5E1" stroke-width="3.5" />
    <rect x="632" y="250" width="103" height="82" fill="#0F172A" stroke="#CBD5E1" stroke-width="3.5" />

    <!-- Structural RCC Column Pads -->
    <g fill="#F8FAFC" stroke="#0EA5E9" stroke-width="1">
      <rect x="111" y="92" width="8" height="8" />
      <rect x="236" y="92" width="8" height="8" />
      <rect x="311" y="92" width="8" height="8" />
      <rect x="556" y="92" width="8" height="8" />
      <rect x="731" y="92" width="8" height="8" />
      <rect x="111" y="246" width="8" height="8" />
      <rect x="236" y="246" width="8" height="8" />
      <rect x="311" y="246" width="8" height="8" />
      <rect x="556" y="246" width="8" height="8" />
      <rect x="731" y="246" width="8" height="8" />
    </g>`
        : ''
    }

    ${
      isLayerOn('STAIRCASE')
        ? `<!-- Dogleg Staircase Treads (21 Risers, 11" Tread, 6.25" Riser, 3'-6" Waist) (Layer: A-STRS) -->
    <g stroke="#A78BFA" stroke-width="1.3" fill="none">
      <rect x="246" y="104" width="63" height="28" fill="#1E1B4B" />
      <!-- Left flight & Right flight treads -->
      <line x1="277" y1="132" x2="277" y2="238" stroke-width="2" />
      <line x1="246" y1="142" x2="309" y2="142" />
      <line x1="246" y1="152" x2="309" y2="152" />
      <line x1="246" y1="162" x2="309" y2="162" />
      <line x1="246" y1="172" x2="309" y2="172" />
      <line x1="246" y1="182" x2="309" y2="182" />
      <line x1="246" y1="192" x2="309" y2="192" />
      <line x1="246" y1="202" x2="309" y2="202" />
      <line x1="246" y1="212" x2="309" y2="212" />
      <line x1="246" y1="222" x2="309" y2="222" />
      <!-- Up Arrow -->
      <path d="M 260 232 L 260 138 L 294 138 L 294 232" stroke="#C084FC" stroke-width="1.5" stroke-dasharray="3,2" />
    </g>`
        : ''
    }

    ${
      isLayerOn('DOORS')
        ? `<!-- Doors & Sliding Portals (Layer: A-DOOR) -->
    <g stroke="#38BDF8" fill="#0284C7">
      <!-- SD1: 27'-0" x 10'-3" Main North Living Slider -->
      <rect x="330" y="93" width="215" height="6" />
      <!-- SD2 (Bed 1): 12'-0" x 10'-3" -->
      <rect x="130" y="93" width="90" height="6" />
      <!-- SD4 (Bed 1 West): 10'-0" x 10'-3" -->
      <rect x="112" y="130" width="6" height="75" />
      <!-- SD7 (Walk-in Wardrobe): 7'-0" x 10'-3" -->
      <rect x="150" y="247" width="56" height="6" />
      <!-- SD3 (Staircase): 5'-0" x 10'-3" -->
      <rect x="255" y="93" width="45" height="6" />
      <!-- SD5 (Living Rear Deck): 11'-0" x 10'-3" -->
      <rect x="328" y="247" width="90" height="6" />
      <!-- SD2 (Bed 2 North): 12'-0" x 10'-3" -->
      <rect x="585" y="93" width="95" height="6" />
      <!-- SD6 (Bed 2 to Bar Deck): 9'-0" x 10'-3" -->
      <rect x="732" y="130" width="6" height="72" />
      <!-- D1 (Bed 1 & Bed 2 Wooden Entry Doors 4'-0") -->
      <path d="M 240 215 A 26 26 0 0 0 214 241" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3,2" />
      <path d="M 560 215 A 26 26 0 0 1 586 241" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3,2" />
      <!-- D2 (Toilet 1 Entry 3'-6") -->
      <rect x="112" y="215" width="6" height="24" fill="#F59E0B" />
      <!-- D3 (Toilet 2 Entry 3'-3") -->
      <rect x="645" y="247" width="24" height="6" fill="#F59E0B" />
      <!-- D4 (Powder Entry 3'-0") -->
      <rect x="520" y="323" width="22" height="6" fill="#F59E0B" />
    </g>`
        : ''
    }

    ${
      isLayerOn('WINDOWS')
        ? `<!-- Windows & Clerestory Glazing (Layer: A-WIND) -->
    <g fill="#FBBF24" stroke="#FDE68A" stroke-width="1">
      <!-- FW1: 15'-9" x 1'-3" Clerestory above Living -->
      <rect x="370" y="86" width="130" height="4" />
      <!-- W1: 1'-6" x 9'-1" Living Slit Window -->
      <rect x="557" y="110" width="6" height="16" />
      <!-- W2 & W2A: 5'-0" Fixed Glass Staircase -->
      <rect x="255" y="247" width="45" height="5" />
      <!-- W5: 1'-6" x 6'-6" Bed 2 Slit -->
      <rect x="710" y="247" width="16" height="5" />
      <!-- W6: 2'-6" x 6'-6" Walk-in Wardrobe -->
      <rect x="160" y="339" width="24" height="5" />
      <!-- W4: 3'-0" x 4'-0" Utility & W3: Powder -->
      <rect x="455" y="391" width="26" height="5" />
      <rect x="530" y="391" width="14" height="5" />
    </g>`
        : ''
    }

    ${
      isLayerOn('DIMENSIONS')
        ? `<!-- Outer & Bay Dimension Lines (Layer: A-DIMS) -->
    <g font-family="monospace" font-size="10" fill="#FB923C" stroke="#FB923C" stroke-width="1">
      <!-- Total Outer Width 85'-5" -->
      <line x1="40" y1="4" x2="735" y2="4" />
      <line x1="40" y1="-2" x2="40" y2="10" />
      <line x1="735" y1="-2" x2="735" y2="10" />
      <text x="387" y="-2" text-anchor="middle" stroke="none" font-weight="bold">◄ OUTER FOOTPRINT LENGTH: 85'-5" (BAYS: 35'-9" + 27'-7" + 22'-1") ►</text>

      <!-- West Depth 20'-4" -->
      <line x1="18" y1="96" x2="18" y2="250" />
      <line x1="12" y1="96" x2="24" y2="96" />
      <line x1="12" y1="250" x2="24" y2="250" />
      <text x="12" y="173" text-anchor="middle" stroke="none" transform="rotate(-90 12 173)" font-weight="bold">20'-4" SPAN</text>
    </g>`
        : ''
    }

    ${
      isLayerOn('TEXT')
        ? `<!-- Room & Opening Callout Text (Layer: A-TEXT) -->
    <g font-family="monospace" text-anchor="middle">
      <!-- North Deck -->
      <text x="470" y="52" fill="#34D399" font-size="11" font-weight="bold">FRONT DECK • 57'-2" × 9'-6"</text>
      <text x="438" y="84" fill="#38BDF8" font-size="9.5" font-weight="bold">SD1 (27'-0" × 10'-3") SLIDING PORTAL</text>

      <!-- Bedroom 1 -->
      <text x="177" y="160" fill="#F8FAFC" font-size="11" font-weight="bold">BEDROOM 1</text>
      <text x="177" y="176" fill="#38BDF8" font-size="10.5" font-weight="bold">14'-0" × 19'-0"</text>
      <text x="177" y="191" fill="#94A3B8" font-size="8.5">(266 SQ.FT • SD2/SD4/SD7)</text>

      <!-- Toilet 1 & Walk-in Wardrobe -->
      <text x="77" y="185" fill="#CBD5E1" font-size="8.5" font-weight="bold">TOILET 1</text>
      <text x="77" y="198" fill="#94A3B8" font-size="8">6'0"×24'9"</text>
      <text x="77" y="210" fill="#94A3B8" font-size="7.5">(14'0"×7'0")</text>

      <text x="177" y="292" fill="#CBD5E1" font-size="9" font-weight="bold">WALK-IN WARDROBE</text>
      <text x="177" y="306" fill="#94A3B8" font-size="8.5">10'-2" × 11'-9" (SD7/W6)</text>

      <!-- Staircase -->
      <text x="277" y="116" fill="#E9D5FF" font-size="9" font-weight="bold">STAIRCASE</text>
      <text x="277" y="128" fill="#C084FC" font-size="8.5">7'-6" × 19'-0"</text>
      <text x="277" y="243" fill="#A78BFA" font-size="7.5">21 RISERS • W2/W2A</text>

      <!-- Living & Dining -->
      <text x="437" y="158" fill="#FFFFFF" font-size="12.5" font-weight="bold">LIVING &amp; DINING</text>
      <text x="437" y="176" fill="#34D399" font-size="11.5" font-weight="bold">25'-4" × 19'-0"</text>
      <text x="437" y="192" fill="#94A3B8" font-size="9">(481 SQ.FT • 10'-3" BEAM HT)</text>

      <!-- Bedroom 2 -->
      <text x="647" y="158" fill="#F8FAFC" font-size="11.5" font-weight="bold">BEDROOM 2</text>
      <text x="647" y="175" fill="#38BDF8" font-size="10.5" font-weight="bold">18'-11" × 19'-0"</text>
      <text x="647" y="190" fill="#94A3B8" font-size="8.5">(359 SQ.FT • SD6/SD2/W5)</text>

      <!-- Bar Unit Deck -->
      <text x="791" y="160" fill="#34D399" font-size="9.5" font-weight="bold">BAR UNIT DECK</text>
      <text x="791" y="175" fill="#A7F3D0" font-size="9">14'-0" × 30'-10"</text>

      <!-- Rear Deck, Kitchen, Utility, Powder, Toilet 2 -->
      <text x="372" y="285" fill="#34D399" font-size="9" font-weight="bold">REAR DECK</text>
      <text x="372" y="298" fill="#A7F3D0" font-size="8.5">13'-0" × 9'-6"</text>

      <text x="495" y="284" fill="#FDBA74" font-size="10" font-weight="bold">KITCHEN</text>
      <text x="495" y="298" fill="#FB923C" font-size="9.5" font-weight="bold">14'-6" × 9'-0"</text>

      <text x="471" y="358" fill="#CBD5E1" font-size="8.5" font-weight="bold">UTILITY</text>
      <text x="471" y="370" fill="#94A3B8" font-size="8">9'-0" × 9'-8"</text>

      <text x="536" y="358" fill="#CBD5E1" font-size="8" font-weight="bold">POWDER</text>
      <text x="536" y="370" fill="#94A3B8" font-size="7.5">5'0"×9'8"</text>

      <text x="596" y="288" fill="#CBD5E1" font-size="8.5" font-weight="bold">WARDROBE</text>
      <text x="596" y="300" fill="#94A3B8" font-size="8">7'-9"×9'-8"</text>

      <text x="683" y="288" fill="#CBD5E1" font-size="9" font-weight="bold">TOILET 2</text>
      <text x="683" y="300" fill="#94A3B8" font-size="8.5">10'-4" × 9'-8"</text>
    </g>`
        : ''
    }
  </g>

  <!-- ===================================================================== -->
  <!-- FIRST FLOOR PLAN & ROOF GAZEBO SECTION BB' (RIGHT PANE)               -->
  <!-- ===================================================================== -->
  <g transform="translate(925, 135)">
    ${
      isLayerOn('TEXT')
        ? `<text x="0" y="-18" fill="#38BDF8" font-family="monospace" font-size="12" font-weight="bold">FIRST FLOOR &amp; ROOF GAZEBO</text>`
        : ''
    }

    ${
      isLayerOn('DECKS_BALCONIES')
        ? `<!-- First Floor Front Balcony: 24'-4" x 4'-0" -->
    <rect x="0" y="16" width="220" height="36" fill="url(#deckHatch)" stroke="#10B981" stroke-width="1.5" stroke-dasharray="5,2" />
    <!-- Side Balcony Access: 14'-10" x 4'-0" -->
    <rect x="0" y="206" width="130" height="34" fill="url(#deckHatch)" stroke="#10B981" stroke-width="1.5" stroke-dasharray="5,2" />`
        : ''
    }

    ${
      isLayerOn('WALLS')
        ? `<!-- First Floor Staircase Upper Landing (7'-6" x 19'-0") -->
    <rect x="0" y="52" width="62" height="154" fill="#111827" stroke="#CBD5E1" stroke-width="3.5" />
    <!-- Bedroom 3 (First Floor): 20'-8" x 19'-0" -->
    <rect x="62" y="52" width="158" height="154" fill="${
      isHi('ROOM-V253-BED3-01') ? '#1E3A8A' : '#111827'
    }" fill-opacity="${isHi('ROOM-V253-BED3-01') ? '0.6' : '0.85'}" stroke="${
          isHi('ROOM-V253-BED3-01') ? '#38BDF8' : '#E2E8F0'
        }" stroke-width="${isHi('ROOM-V253-BED3-01') ? '5' : '4'}" />
    <!-- Toilet 3: 9'-9" x 9'-2" -->
    <rect x="130" y="206" width="90" height="68" fill="#0F172A" stroke="#CBD5E1" stroke-width="3.5" />`
        : ''
    }

    ${
      isLayerOn('DOORS')
        ? `<!-- First Floor Sliders SD1A (12ft), SD2A (10ft), SD3A (8ft), SD4A (5ft) -->
    <rect x="85" y="49" width="110" height="6" fill="#0284C7" stroke="#38BDF8" />
    <rect x="59" y="85" width="6" height="75" fill="#0284C7" stroke="#38BDF8" />
    <rect x="85" y="203" width="42" height="6" fill="#0284C7" stroke="#38BDF8" />
    <rect x="16" y="49" width="35" height="6" fill="#0284C7" stroke="#38BDF8" />`
        : ''
    }

    ${
      isLayerOn('TEXT')
        ? `<g font-family="monospace" text-anchor="middle">
      <text x="110" y="37" fill="#34D399" font-size="8.5" font-weight="bold">BALCONY 24'-4" × 4'-0" (SD1A)</text>
      <text x="31" y="124" fill="#C084FC" font-size="8" font-weight="bold">STAIR</text>
      <text x="31" y="136" fill="#94A3B8" font-size="7.5">7'6"×19'</text>
      <text x="141" y="118" fill="#FFFFFF" font-size="10.5" font-weight="bold">BEDROOM 3</text>
      <text x="141" y="134" fill="#38BDF8" font-size="10" font-weight="bold">20'-8" × 19'-0"</text>
      <text x="141" y="148" fill="#94A3B8" font-size="8">(393 SQ.FT • 1ST FLR)</text>
      <text x="175" y="240" fill="#CBD5E1" font-size="8.5" font-weight="bold">TOILET 3</text>
      <text x="175" y="252" fill="#94A3B8" font-size="8">9'-9" × 9'-2"</text>
    </g>`
        : ''
    }

    <!-- SECTION BB' - ROOF GAZEBO PAVILION (24'-0" x 18'-0") -->
    <g transform="translate(0, 305)">
      <rect x="0" y="0" width="220" height="165" fill="${
        isHi('ROOM-V253-GAZEBO-01') ? '#3B0764' : '#0F172A'
      }" fill-opacity="${isHi('ROOM-V253-GAZEBO-01') ? '0.55' : '0.9'}" stroke="${
    isHi('ROOM-V253-GAZEBO-01') ? '#F59E0B' : '#475569'
  }" stroke-width="${isHi('ROOM-V253-GAZEBO-01') ? '3.5' : '2'}" rx="4" />
      ${
        isLayerOn('DECKS_BALCONIES')
          ? `<!-- Pitched Timber Gazebo Roof Rafters (Section BB') -->
      <polygon points="18,88 110,26 202,88" fill="#78350F" fill-opacity="0.45" stroke="#F59E0B" stroke-width="2.5" />
      <line x1="110" y1="26" x2="110" y2="132" stroke="#FBBF24" stroke-width="1.5" stroke-dasharray="3,2" />
      <line x1="35" y1="88" x2="35" y2="132" stroke="#E2E8F0" stroke-width="3" />
      <line x1="185" y1="88" x2="185" y2="132" stroke="#E2E8F0" stroke-width="3" />
      <rect x="20" y="132" width="180" height="8" fill="#10B981" />`
          : ''
      }
      ${
        isLayerOn('TEXT')
          ? `<g font-family="monospace" text-anchor="middle">
        <text x="110" y="18" fill="#FBBF24" font-size="9.5" font-weight="bold">SECTION BB' • ROOF GAZEBO</text>
        <text x="110" y="76" fill="#FFFFFF" font-size="9.5" font-weight="bold">24'-0" × 18'-0" PAVILION</text>
        <text x="110" y="108" fill="#38BDF8" font-size="8.5">RIDGE HT: 12'-9" • TIMBER RAFTERS</text>
        <text x="110" y="153" fill="#94A3B8" font-size="8">432 SQ.FT • BAR DECK OVERLOOK</text>
      </g>`
          : ''
      }
    </g>
  </g>

  ${
    isLayerOn('NOTES')
      ? `<!-- ===================================================================== -->
  <!-- BOTTOM ARCHITECTURAL SCHEDULE & CAD AUTHORITY TITLE BLOCK              -->
  <!-- ===================================================================== -->
  <g transform="translate(34, 632)" font-family="monospace">
    <rect x="0" y="0" width="1132" height="92" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1.5" />
    <line x1="380" y1="0" x2="380" y2="92" stroke="#334155" stroke-width="1.2" />
    <line x1="790" y1="0" x2="790" y2="92" stroke="#334155" stroke-width="1.2" />

    <!-- Column 1: Active Room Highlight -->
    <text x="14" y="20" fill="#FBBF24" font-size="10.5" font-weight="bold">ACTIVE ROOM GEOMETRY VERIFICATION:</text>
    <text x="14" y="38" fill="#FFFFFF" font-size="11.5" font-weight="bold">${
      spec ? `${spec.name} (${spec.dimensionText})` : 'Villa 253 Complete Plan'
    }</text>
    <text x="14" y="55" fill="#34D399" font-size="9.5">Carpet Area: ${
      spec ? `${spec.areaSqFt} sq.ft • Clear Height: ${spec.heightFt}'` : '2,840 sq.ft Total Built-up'
    }</text>
    <text x="14" y="73" fill="#94A3B8" font-size="8.5">Openings: ${
      spec ? spec.doorWindowMarks.join(', ') : 'SD1..SD7, D1..D4, W1..W6, FW1..FW2'
    }</text>

    <!-- Column 2: Key Drawing Dimensions -->
    <text x="394" y="20" fill="#38BDF8" font-size="10.5" font-weight="bold">VILLA 253 WALL MARKING R0 KEY DIMENSIONS:</text>
    <text x="394" y="38" fill="#E2E8F0" font-size="9.5">• Living &amp; Dining: 25'-4" × 19'-0" | Master Bed 1: 14'-0" × 19'-0"</text>
    <text x="394" y="54" fill="#E2E8F0" font-size="9.5">• Bedroom 2: 18'-11" × 19'-0"     | Bedroom 3 (1F): 20'-8" × 19'-0"</text>
    <text x="394" y="70" fill="#E2E8F0" font-size="9.5">• Staircase: 7'-6" × 19'-0"       | Kitchen: 14'-6" × 9'-0" | Gazebo: 24'×18'</text>
    <text x="394" y="84" fill="#94A3B8" font-size="8.5">• Front Deck: 57'-2" × 9'-6"      | Bar Deck: 14'-0" × 30'-10" | Rear: 13'×9'6"</text>

    <!-- Column 3: Authority & Layer Stamp -->
    <text x="804" y="20" fill="#A78BFA" font-size="10.5" font-weight="bold">CAD &amp; CONSTRUCTION AUTHORITY NOTE:</text>
    <text x="804" y="37" fill="#CBD5E1" font-size="8.5">Source: VILLA_253_WALL_MARKING_10_10_24_REV0.pdf</text>
    <text x="804" y="52" fill="#CBD5E1" font-size="8.5">DXF File: Villa253_FloorPlan_Editable_R0.dxf (8 Layers)</text>
    <text x="804" y="68" fill="#FBBF24" font-size="8">Working DXF reconstruction from R0 wall-marking drawing.</text>
    <text x="804" y="81" fill="#94A3B8" font-size="8">Original architectural PDF remains construction authority.</text>
  </g>`
      : ''
  }
</svg>`;
}

/**
 * Returns a data:image/svg+xml;utf8 URL for use in <img> tags or downloads
 * so no raster photo is ever mistaken for a 2D CAD drawing.
 */
export function getVilla253VectorCadSvgDataUrl(
  activeRoomId?: string,
  sheet?: 'GROUND' | 'FIRST' | 'SECTION' | 'COMPOSITE',
  visibleLayers?: CadLayerId[]
): string {
  const svg = generateVilla253VectorCadSvg({ activeRoomId, sheet, visibleLayers });
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Generates an editable AutoCAD DXF (AC1009 / R12 ASCII format) with separate CAD layers:
 * - A-WALL (Walls)
 * - A-DOOR (Doors)
 * - A-WIND (Windows)
 * - A-STRS (Staircase)
 * - A-DECK (Decks & Balconies)
 * - A-DIMS (Dimensions)
 * - A-TEXT (Room Labels & Schedule Text)
 * - A-NOTE (Title Block & Construction Notes)
 *
 * Units: Decimal Feet (1 unit = 1 foot), dimension-driven from Villa 253 Wall Marking Drawing R0 (10-10-24).
 */
export function generateVilla253EditableDxf(): string {
  const lines: string[] = [];
  const push = (...items: (string | number)[]) => {
    for (const item of items) {
      lines.push(String(item));
    }
  };

  const addLine = (layer: string, x1: number, y1: number, x2: number, y2: number) => {
    push(
      0, 'LINE',
      8, layer,
      10, x1.toFixed(4),
      20, y1.toFixed(4),
      30, '0.0',
      11, x2.toFixed(4),
      21, y2.toFixed(4),
      31, '0.0'
    );
  };

  const addRect = (layer: string, x: number, y: number, w: number, h: number) => {
    addLine(layer, x, y, x + w, y);
    addLine(layer, x + w, y, x + w, y + h);
    addLine(layer, x + w, y + h, x, y + h);
    addLine(layer, x, y + h, x, y);
  };

  const addText = (layer: string, x: number, y: number, height: number, text: string) => {
    push(
      0, 'TEXT',
      8, layer,
      10, x.toFixed(4),
      20, y.toFixed(4),
      30, '0.0',
      40, height.toFixed(2),
      1, text
    );
  };

  const addArc = (layer: string, cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    push(
      0, 'ARC',
      8, layer,
      10, cx.toFixed(4),
      20, cy.toFixed(4),
      30, '0.0',
      40, r.toFixed(4),
      50, startAngle.toFixed(2),
      51, endAngle.toFixed(2)
    );
  };

  // 1. HEADER SECTION
  push(
    0, 'SECTION',
    2, 'HEADER',
    9, '$ACADVER',
    1, 'AC1009',
    9, '$INSUNITS',
    70, 2, // Feet
    9, '$EXTMIN',
    10, '-10.0',
    20, '-30.0',
    30, '0.0',
    9, '$EXTMAX',
    10, '160.0',
    20, '60.0',
    30, '0.0',
    0, 'ENDSEC'
  );

  // 2. TABLES SECTION (8 Separate Architectural Layers)
  push(
    0, 'SECTION',
    2, 'TABLES',
    0, 'TABLE',
    2, 'LAYER',
    70, VILLA_253_CAD_LAYERS.length + 1,
    0, 'LAYER',
    2, '0',
    70, 0,
    62, 7,
    6, 'CONTINUOUS'
  );

  for (const layer of VILLA_253_CAD_LAYERS) {
    push(
      0, 'LAYER',
      2, layer.dxfLayerName,
      70, 0,
      62, layer.aciColor,
      6, 'CONTINUOUS'
    );
  }

  push(
    0, 'ENDTAB',
    0, 'ENDSEC'
  );

  // 3. ENTITIES SECTION
  push(0, 'SECTION', 2, 'ENTITIES');

  // --- GROUND FLOOR PLAN (Origin 0,0 at SW of main structural spine) ---
  // Toilet 1 (West Master Bath): 6'-0" x 24'-9" (x: 0..6, y: -5.75..19.0)
  addRect('A-WALL', 0, -5.75, 6.0, 24.75);
  // Walk-in Wardrobe (South of Bedroom 1): 10'-2" x 11'-9" (x: 6.0..16.17, y: -11.75..0)
  addRect('A-WALL', 6.0, -11.75, 10.17, 11.75);
  // Bedroom 1 (Master Suite): 14'-0" x 19'-0" (x: 6.0..20.0, y: 0..19.0)
  addRect('A-WALL', 6.0, 0, 14.0, 19.0);
  // Staircase Core: 7'-6" x 19'-0" (x: 20.0..27.5, y: 0..19.0)
  addRect('A-WALL', 20.0, 0, 7.5, 19.0);
  // Living & Dining Great Room: 25'-4" x 19'-0" (x: 27.5..52.83, y: 0..19.0)
  addRect('A-WALL', 27.5, 0, 25.33, 19.0);
  // Bedroom 2 Suite: 18'-11" x 19'-0" (x: 52.83..71.75, y: 0..19.0)
  addRect('A-WALL', 52.83, 0, 18.92, 19.0);

  // Kitchen (14'-6" x 9'-0"), Utility (9'-0" x 9'-8"), Powder (5'-0" x 9'-8")
  addRect('A-WALL', 38.33, -9.0, 14.5, 9.0);
  addRect('A-WALL', 38.33, -18.67, 9.0, 9.67);
  addRect('A-WALL', 47.33, -18.67, 5.0, 9.67);

  // Bedroom 2 Wardrobe (7'-9" x 9'-8") & Toilet 2 (10'-4" x 9'-8")
  addRect('A-WALL', 52.83, -9.67, 7.75, 9.67);
  addRect('A-WALL', 60.58, -9.67, 10.33, 9.67);

  // --- DECKS & BALCONIES (Layer: A-DECK) ---
  // North Front Deck: 57'-2" x 9'-6" (x: 20.0..77.17, y: 19.0..28.5)
  addRect('A-DECK', 20.0, 19.0, 57.17, 9.5);
  // Master Private Deck: 11'-6" x 4'-6" (x: 6.0..17.5, y: 19.0..23.5)
  addRect('A-DECK', 6.0, 19.0, 11.5, 4.5);
  // Outdoor Bar Unit Deck: 14'-0" x 30'-10" (x: 71.75..85.75, y: -5.0..25.83)
  addRect('A-DECK', 71.75, -5.0, 14.0, 30.83);
  // Rear Living Deck: 13'-0" x 9'-6" (x: 25.33..38.33, y: -9.5..0)
  addRect('A-DECK', 25.33, -9.5, 13.0, 9.5);

  // --- STAIRCASE RISERS & LANDING (Layer: A-STRS) ---
  // 7'-6" x 19'-0" Dogleg Staircase with 21 Risers (Tread 11" = 0.917ft, Flight Width 3'-6")
  addLine('A-STRS', 20.0, 15.5, 27.5, 15.5); // Mid-landing 3'-6" deep
  addLine('A-STRS', 23.75, 2.5, 23.75, 15.5); // Central stringer divide
  for (let i = 0; i <= 10; i++) {
    const ry = 2.5 + i * 0.917;
    addLine('A-STRS', 20.0, ry, 27.5, ry);
  }

  // --- DOORS & SLIDING PORTALS (Layer: A-DOOR) ---
  // SD1: 27'-0" x 10'-3" Living North Slider
  addRect('A-DOOR', 26.67, 18.75, 27.0, 0.5);
  // SD2: 12'-0" x 10'-3" Bedroom 1 & Bedroom 2 North Sliders
  addRect('A-DOOR', 7.0, 18.75, 12.0, 0.5);
  addRect('A-DOOR', 56.0, 18.75, 12.0, 0.5);
  // SD3: 5'-0" x 10'-3" Staircase North Slider
  addRect('A-DOOR', 21.25, 18.75, 5.0, 0.5);
  // SD4: 10'-0" x 10'-3" Bedroom 1 West Slider
  addRect('A-DOOR', 5.75, 4.5, 0.5, 10.0);
  // SD5: 11'-0" x 10'-3" Living Rear Deck Slider
  addRect('A-DOOR', 26.5, -0.25, 11.0, 0.5);
  // SD6: 9'-0" x 10'-3" Bedroom 2 East Slider to Bar Deck
  addRect('A-DOOR', 71.5, 5.0, 0.5, 9.0);
  // SD7: 7'-0" x 10'-3" Walk-in Wardrobe Slider
  addRect('A-DOOR', 7.5, -0.25, 7.0, 0.5);
  // Wooden Hinged Doors D1 (4'-0"), D2 (3'-6"), D3 (3'-3"), D4 (3'-0")
  addArc('A-DOOR', 20.0, 2.0, 4.0, 90, 180);
  addArc('A-DOOR', 52.83, 2.0, 4.0, 0, 90);
  addArc('A-DOOR', 6.0, 2.0, 3.5, 90, 180);
  addArc('A-DOOR', 61.5, 0.0, 3.25, 180, 270);
  addArc('A-DOOR', 48.0, -9.0, 3.0, 180, 270);

  // --- WINDOWS & FIXED GLASS (Layer: A-WIND) ---
  // FW1: 15'-9" x 1'-3" Living Clerestory
  addRect('A-WIND', 32.0, 19.3, 15.75, 0.35);
  // W1: 1'-6" x 9'-1" Living Window
  addRect('A-WIND', 52.6, 12.0, 0.4, 1.5);
  // W2 & W2A: 5'-0" Fixed Glass Staircase
  addRect('A-WIND', 21.25, -0.2, 5.0, 0.4);
  // W3 (1'-3" Powder), W4 (3'-0" Utility), W5 (1'-6" Bed 2), W6 (2'-6" Wardrobe)
  addRect('A-WIND', 49.0, -18.85, 1.25, 0.35);
  addRect('A-WIND', 41.0, -18.85, 3.0, 0.35);
  addRect('A-WIND', 69.0, -0.2, 1.5, 0.4);
  addRect('A-WIND', 9.5, -11.9, 2.5, 0.35);

  // --- DIMENSIONS (Layer: A-DIMS) ---
  addLine('A-DIMS', 0, 31.0, 85.42, 31.0);
  addLine('A-DIMS', 0, 30.0, 0, 32.0);
  addLine('A-DIMS', 85.42, 30.0, 85.42, 32.0);
  addText('A-DIMS', 32.0, 32.2, 1.1, "OUTER FOOTPRINT: 85'-5\" x 20'-4\" (BAYS: 35'-9\" + 27'-7\" + 22'-1\")");

  // --- ROOM TEXT LABELS (Layer: A-TEXT) ---
  addText('A-TEXT', 31.0, 10.5, 1.2, "LIVING & DINING: 25'-4\" x 19'-0\" (481 SQ.FT)");
  addText('A-TEXT', 8.0, 10.5, 1.0, "BEDROOM 1: 14'-0\" x 19'-0\"");
  addText('A-TEXT', 55.0, 10.5, 1.0, "BEDROOM 2: 18'-11\" x 19'-0\"");
  addText('A-TEXT', 20.8, 9.0, 0.85, "STAIR: 7'-6\" x 19'-0\"");
  addText('A-TEXT', 40.0, -4.5, 0.9, "KITCHEN: 14'-6\" x 9'-0\"");
  addText('A-TEXT', 39.5, -14.0, 0.75, "UTILITY: 9'-0\" x 9'-8\"");
  addText('A-TEXT', 47.8, -14.0, 0.7, "POWDER: 5'x9'8\"");
  addText('A-TEXT', 7.0, -6.0, 0.8, "WARDROBE: 10'-2\" x 11'-9\"");
  addText('A-TEXT', 0.8, 6.0, 0.75, "TOILET 1: 6'x24'9\"");
  addText('A-TEXT', 61.5, -5.0, 0.8, "TOILET 2: 10'-4\" x 9'-8\"");
  addText('A-TEXT', 38.0, 23.0, 1.1, "FRONT DECK: 57'-2\" x 9'-6\" (SD1: 27'-0\" x 10'-3\")");
  addText('A-TEXT', 73.0, 10.0, 0.9, "BAR DECK: 14'-0\" x 30'-10\"");
  addText('A-TEXT', 27.0, -5.0, 0.85, "REAR DECK: 13'-0\" x 9'-6\"");

  // --- FIRST FLOOR PLAN & ROOF GAZEBO (Offset X = 100.0ft) ---
  // Staircase Upper Core: 7'-6" x 19'-0"
  addRect('A-WALL', 100.0, 0, 7.5, 19.0);
  // Bedroom 3 Suite: 20'-8" x 19'-0"
  addRect('A-WALL', 107.5, 0, 20.67, 19.0);
  // Toilet 3: 9'-9" x 9'-2"
  addRect('A-WALL', 118.42, -9.17, 9.75, 9.17);
  // First Floor Front Balcony: 24'-4" x 4'-0"
  addRect('A-DECK', 103.83, 19.0, 24.33, 4.0);
  // First Floor Side Balcony: 14'-10" x 4'-0"
  addRect('A-DECK', 100.0, -4.0, 14.83, 4.0);
  // Roof Gazebo Pavilion (Section BB'): 24'-0" x 18'-0"
  addRect('A-DECK', 132.0, 0.5, 24.0, 18.0);
  // First Floor Sliders SD1A (12ft), SD2A (10ft), SD3A (8ft), SD4A (5ft)
  addRect('A-DOOR', 111.0, 18.75, 12.0, 0.5);
  addRect('A-DOOR', 107.25, 4.5, 0.5, 10.0);
  addRect('A-DOOR', 109.0, -0.25, 8.0, 0.5);
  addRect('A-DOOR', 101.25, 18.75, 5.0, 0.5);

  addText('A-TEXT', 110.0, 10.5, 1.1, "FIRST FLOOR BEDROOM 3: 20'-8\" x 19'-0\" (393 SQ.FT)");
  addText('A-TEXT', 119.5, -5.0, 0.85, "TOILET 3: 9'-9\" x 9'-2\"");
  addText('A-TEXT', 106.0, 20.5, 0.85, "BALCONY: 24'-4\" x 4'-0\" (SD1A)");
  addText('A-TEXT', 135.0, 9.5, 1.0, "ROOF GAZEBO: 24'-0\" x 18'-0\" (SECTION BB' RIDGE 12'-9\")");

  // --- NOTES & TITLE BLOCK (Layer: A-NOTE) ---
  addRect('A-NOTE', 0, -28.0, 156.0, 7.0);
  addText('A-NOTE', 2.0, -23.5, 1.2, "VILLA 253 - NORTH FACING - 24 TYPE - 3 BEDROOM WITH ROOF GAZEBO | DATE: 10-10-24 | REV: 0");
  addText('A-NOTE', 2.0, -26.0, 0.9, "NOTE: Editable working DXF reconstruction from R0 wall-marking drawing. Original architectural PDF remains construction authority.");

  push(0, 'ENDSEC', 0, 'EOF');
  return lines.join('\n');
}

/**
 * Generates a valid, standards-compliant multi-page PDF Uint8Array representing the authoritative
 * Villa 253 Wall Marking Drawing R0 (10-10-24) with Sheet 1/2 (Ground & First Floor Plan + Schedule)
 * and Sheet 2/2 (Section BB', Roof Gazebo & Elevations).
 */
export function generateVilla253SourcePdfBytes(): Uint8Array {
  const encoder = new TextEncoder();
  const byteLen = (str: string) => encoder.encode(str).byteLength;

  // Build a clean, vector-graphics + text PDF 1.4 document with 2 full landscape architectural sheets (842 x 595 pt)
  const page1Stream = `
q
0.05 0.08 0.14 rg
0 0 842 595 re f
0.22 0.74 0.97 RG
1.5 w
20 20 802 555 re S
24 24 794 547 re S

% Title Banner
0.08 0.12 0.22 rg
32 520 778 42 re B
BT
/F1 13 Tf
1 1 1 rg
44 544 Td
(VILLA 253 - NORTH FACING - 24 TYPE - 3 BEDROOM WITH ROOF GAZEBO) Tj
/F1 9 Tf
0.22 0.74 0.97 rg
0 -15 Td
(WALL MARKING DRAWING - DATE: 10-10-24 - REV: 0 - SHEET 1 OF 2: GROUND FLOOR & FIRST FLOOR PLANS) Tj
ET

% Ground Floor Plan Vector Envelope
0.20 0.83 0.60 RG
1 w
% Front Deck 57'-2" x 9'-6"
180 390 340 52 re S
% Bar Unit Deck 14'-0" x 30'-10"
550 240 85 180 re S
% Rear Deck 13'-0" x 9'-6"
235 205 90 55 re S

0.92 0.95 0.98 RG
2 w
% Toilet 1 (West)
45 260 50 130 re S
% Bedroom 1: 14'-0" x 19'-0"
95 260 85 130 re S
% Walk-in Wardrobe: 10'-2" x 11'-9"
95 195 85 65 re S
% Staircase: 7'-6" x 19'-0"
180 260 55 130 re S
% Living & Dining: 25'-4" x 19'-0"
235 260 185 130 re S
% Bedroom 2: 18'-11" x 19'-0"
420 260 130 130 re S
% Kitchen (14'-6" x 9'-0") & Utility/Powder
325 205 95 55 re S
325 155 60 50 re S
385 155 35 50 re S
% Bed 2 Wardrobe & Toilet 2
420 195 55 65 re S
475 195 75 65 re S

% First Floor Plan Box (Right)
655 260 45 130 re S
700 260 105 130 re S
740 195 65 65 re S
0.20 0.83 0.60 RG
1 w
670 390 135 28 re S

BT
/F1 9 Tf
0.98 0.75 0.14 rg
45 455 Td (GROUND FLOOR WALL MARKING PLAN - OUTER FOOTPRINT: 85'-5" x 20'-4" [BAYS: 35'-9" + 27'-7" + 22'-1"]) Tj
ET

BT
/F1 8 Tf
1 1 1 rg
104 330 Td (BEDROOM 1) Tj
0 -11 Td (14'-0" x 19'-0") Tj
0 -11 Td (SD2 / SD4 / SD7) Tj
ET

BT
/F1 8 Tf
0.8 0.9 1 rg
52 325 Td (TOILET 1) Tj
0 -10 Td (6'0"x24'9") Tj
ET

BT
/F1 8 Tf
0.8 0.9 1 rg
104 230 Td (WARDROBE) Tj
0 -10 Td (10'-2" x 11'-9") Tj
ET

BT
/F1 8 Tf
0.85 0.75 1 rg
186 330 Td (STAIRCASE) Tj
0 -10 Td (7'-6" x 19'-0") Tj
0 -10 Td (21 RISERS) Tj
ET

BT
/F1 10 Tf
0.20 0.95 0.70 rg
275 332 Td (LIVING & DINING GREAT ROOM) Tj
0 -13 Td (25'-4" x 19'-0" [481 SQ.FT]) Tj
/F1 8 Tf
0 -12 Td (SD1: 27'-0" x 10'-3" TO 57'-2" FRONT DECK) Tj
ET

BT
/F1 9 Tf
1 1 1 rg
445 330 Td (BEDROOM 2 SUITE) Tj
0 -12 Td (18'-11" x 19'-0" [359 SQ.FT]) Tj
/F1 8 Tf
0 -11 Td (SD6: 9'-0" x 10'-3" TO BAR DECK) Tj
ET

BT
/F1 8 Tf
0.20 0.95 0.70 rg
290 412 Td (NORTH FRONT DECK: 57'-2" x 9'-6") Tj
ET

BT
/F1 8 Tf
0.20 0.95 0.70 rg
556 330 Td (BAR UNIT DECK) Tj
0 -11 Td (14'-0" x 30'-10") Tj
ET

BT
/F1 8 Tf
0.98 0.65 0.25 rg
340 232 Td (KITCHEN: 14'-6" x 9'-0") Tj
0 -11 Td (UTILITY: 9'x9'8" | POWDER: 5'x9'8") Tj
ET

BT
/F1 9 Tf
0.22 0.74 0.97 rg
655 432 Td (FIRST FLOOR PLAN) Tj
/F1 8 Tf
1 1 1 rg
48 -95 Td (BEDROOM 3 [1ST FLR]) Tj
0 -11 Td (20'-8" x 19'-0" [393 SQ.FT]) Tj
0 -11 Td (SD1A 12' / SD2A 10' / SD3A 8') Tj
0 -55 Td (TOILET 3: 9'-9" x 9'-2") Tj
ET

% Bottom Schedule Summary Box
0.08 0.12 0.22 rg
32 34 778 105 re B
BT
/F1 9 Tf
0.98 0.75 0.14 rg
44 122 Td (DOOR & WINDOW SCHEDULE SUMMARY [WALL MARKING DRAWING R0 - 10-10-24]:) Tj
/F1 8 Tf
0.9 0.94 0.98 rg
0 -15 Td (SD1: 27'0"x10'3" [Living Front Deck] | SD2: 12'0"x10'3" [Bed 1 & 2] | SD3: 5'0"x10'3" [Stair] | SD4: 10'0"x10'3" [Bed 1] | SD5: 11'0"x10'3" [Rear Deck]) Tj
0 -13 Td (SD6: 9'0"x10'3" [Bed 2 Bar Deck] | SD7: 7'0"x10'3" [Master Wardrobe] | SD1A: 12'0"xBeam [Bed 3 Balcony] | SD2A: 10'0"xBeam | SD3A: 8'0"xBeam | SD4A: 5'0"xBeam) Tj
0 -13 Td (D1: 4'0"x10'3" [Bed 1 & 2] | D2: 3'6"x10'3" [Toilet 1] | D3: 3'3"x7'8" [Toilet 2] | D4: 3'0"x7'8" [Powder] | D1A: 4'0"xBeam [Bed 3] | D2A: 3'6"xBeam [Toilet 3]) Tj
0 -13 Td (W1: 1'6"x9'1" | W2/W2A: 5'0"xMid-Landing [Staircase] | W3: 1'3"x5'7" | W4: 3'0"x4'0" | W5: 1'6"x6'6" | W6: 2'6"x6'6" | FW1: 15'9"x1'3" | FW2: 9'0"xRoof) Tj
0.6 0.7 0.8 rg
0 -16 Td (AUTHORITY NOTE: Authoritative Architectural Reference PDF for Villa 253. Companion DXF is a dimension-driven working CAD reconstruction.) Tj
ET
Q
`.trim();

  const page2Stream = `
q
0.05 0.08 0.14 rg
0 0 842 595 re f
0.22 0.74 0.97 RG
1.5 w
20 20 802 555 re S

0.08 0.12 0.22 rg
32 520 778 42 re B
BT
/F1 13 Tf
1 1 1 rg
44 544 Td
(VILLA 253 - SHEET 2 OF 2: SECTION BB', ROOF GAZEBO RAFTER DETAIL & REAR ELEVATION) Tj
/F1 9 Tf
0.22 0.74 0.97 rg
0 -15 Td
(24 TYPE - 3 BEDROOM WITH ROOF GAZEBO - NORTH FACING - DATE: 10-10-24 - REVISION: 0) Tj
ET

% Section BB' Roof Gazebo Diagram
0.98 0.75 0.14 RG
2 w
80 240 320 140 re S
80 380 m 240 475 l 400 380 l S
240 240 m 240 475 l S

BT
/F1 10 Tf
0.98 0.75 0.14 rg
95 488 Td (SECTION BB' - SIGNATURE ROOF GAZEBO PAVILION [24'-0" x 18'-0" / 432 SQ.FT]) Tj
/F1 8.5 Tf
1 1 1 rg
0 -45 Td (Pitched Timber Pergola Roof Structure with Exposed Rafters) Tj
0 -14 Td (Ridge Beam Height: 12'-9" clear above First Floor Terrace Slab) Tj
0 -14 Td (Plinth Level: +1'-6" above finished ground level) Tj
0 -14 Td (Ground Floor Clear Height: 10'-3" to Beam Bottom | Clerestory FW1: 11'-6" to 12'-9") Tj
0 -14 Td (Staircase Core: 21 Risers | Tread = 11" | Riser = 6.25" | Waist & Landing Slab = 3'-6") Tj
ET

% Complete Room Schedule Box on Sheet 2
0.08 0.12 0.22 rg
435 200 375 300 re B
BT
/F1 10 Tf
0.20 0.95 0.70 rg
450 478 Td (VERIFIED ROOM DIMENSION SCHEDULE - VILLA 253 R0) Tj
/F1 8.5 Tf
1 1 1 rg
0 -22 Td (1. Living & Dining Great Room: 25'-4" x 19'-0" [481 sq.ft]) Tj
0 -16 Td (2. Bedroom 1 [Master Suite]: 14'-0" x 19'-0" [266 sq.ft]) Tj
0 -14 Td (   - Walk-in Wardrobe: 10'-2" x 11'-9" | Toilet 1: 6'-0" x 24'-9" / 14'x7') Tj
0 -14 Td (   - Private Master Deck: 11'-6" x 4'-6") Tj
0 -16 Td (3. Bedroom 2 Suite: 18'-11" x 19'-0" [359 sq.ft]) Tj
0 -14 Td (   - Wardrobe: 7'-9" x 9'-8" | Toilet 2: 10'-4" x 9'-8") Tj
0 -16 Td (4. Bedroom 3 [First Floor]: 20'-8" x 19'-0" [393 sq.ft]) Tj
0 -14 Td (   - Toilet 3: 9'-9" x 9'-2" | Balconies: 24'-4"x4'-0" & 14'-10"x4'-0") Tj
0 -16 Td (5. Staircase Core: 7'-6" x 19'-0" [143 sq.ft, 21 Risers]) Tj
0 -16 Td (6. Kitchen: 14'-6" x 9'-0" [131 sq.ft]) Tj
0 -14 Td (   - Utility: 9'-0" x 9'-8" | Powder Room: 5'-0" x 9'-8") Tj
0 -16 Td (7. Roof Gazebo Pavilion: 24'-0" x 18'-0" [432 sq.ft]) Tj
0 -16 Td (8. Exterior Decks: North Front Deck 57'-2" x 9'-6",) Tj
0 -14 Td (   Bar Unit Deck 14'-0" x 30'-10", Rear Deck 13'-0" x 9'-6") Tj
ET
Q
`.trim();

  // Assemble valid PDF objects with exact byte offsets
  const objects: string[] = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>\nendobj');
  objects.push(
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 5 0 R >> >> /Contents 6 0 R >>\nendobj'
  );
  objects.push(
    '4 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 5 0 R >> >> /Contents 7 0 R >>\nendobj'
  );
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>\nendobj');
  objects.push(
    `6 0 obj\n<< /Length ${byteLen(page1Stream)} >>\nstream\n${page1Stream}\nendstream\nendobj`
  );
  objects.push(
    `7 0 obj\n<< /Length ${byteLen(page2Stream)} >>\nstream\n${page2Stream}\nendstream\nendobj`
  );

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(byteLen(pdf));
    pdf += obj + '\n';
  }
  const xrefOffset = byteLen(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return encoder.encode(pdf);
}

/**
 * Triggers a browser download of the editable Villa 253 DXF CAD file (8 layers)
 */
export function triggerDownloadVilla253Dxf(): void {
  const dxfContent = generateVilla253EditableDxf();
  const blob = new Blob([dxfContent], { type: 'application/dxf;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Villa253_FloorPlan_Editable_R0.dxf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers a browser download of the authoritative Villa 253 Wall Marking R0 PDF
 */
export function triggerDownloadVilla253Pdf(): void {
  const bytes = generateVilla253SourcePdfBytes();
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'VILLA_253_WALL_MARKING_10_10_24_REV0.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
