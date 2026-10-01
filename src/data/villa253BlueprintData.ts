/**
 * Build Storys ERP - Villa 253 Architectural Blueprint & Interior Spatial Engine
 * Based on Blueprint: VILLA 253 - 24 TYPE - 3 BEDROOM WITH ROOF GAZEBO (NORTH FACING)
 * Blueprint Date: 10-10-24, Revision: 0, Pages 1-2 & 2-2
 */

import { 
  TwoStepSpatialDesignSession, 
  ExtractedRoomGeometry, 
  FurnitureLayoutOption, 
  VisualConceptVersion 
} from '../types/floorplanSpatial';

export interface Villa253DoorWindowScheduleItem {
  slNo: number;
  code: string;
  floor: 'GROUND' | 'FIRST';
  type: 'SLIDING_DOOR' | 'WOODEN_DOOR' | 'WINDOW' | 'FIXED_GLASS';
  sillHeight: string;
  lintelHeight: string;
  sizeLxH: string;
  location: string;
  qty: number;
  remarks: string;
}

export const VILLA_253_SCHEDULE: Villa253DoorWindowScheduleItem[] = [
  // Ground Floor
  { slNo: 1, code: 'SD1', floor: 'GROUND', type: 'SLIDING_DOOR', sillHeight: '---', lintelHeight: '10\'3"', sizeLxH: '27\'0" × 10\'3"', location: 'Living and Dining (Front Deck)', qty: 1, remarks: 'Large aluminum sliding door opening to 57\'2" front deck' },
  { slNo: 2, code: 'SD2', floor: 'GROUND', type: 'SLIDING_DOOR', sillHeight: '---', lintelHeight: '10\'3"', sizeLxH: '12\'0" × 10\'3"', location: 'Bedroom 1 & Bedroom 2', qty: 2, remarks: 'Aluminum frame sliding glass doors to private decks' },
  { slNo: 3, code: 'SD3', floor: 'GROUND', type: 'SLIDING_DOOR', sillHeight: '---', lintelHeight: '10\'3"', sizeLxH: '5\'0" × 10\'3"', location: 'Staircase Glazing', qty: 1, remarks: 'Sliding access to staircase courtyard' },
  { slNo: 4, code: 'SD4', floor: 'GROUND', type: 'SLIDING_DOOR', sillHeight: '---', lintelHeight: '10\'3"', sizeLxH: '10\'0" × 10\'3"', location: 'Bedroom 1 (Master)', qty: 1, remarks: 'Aluminum sliding door to deck' },
  { slNo: 5, code: 'SD5', floor: 'GROUND', type: 'SLIDING_DOOR', sillHeight: '---', lintelHeight: '10\'3"', sizeLxH: '11\'0" × 10\'3"', location: 'Living Rear Deck', qty: 1, remarks: 'Sliding door opening to 13\'0" rear deck' },
  { slNo: 6, code: 'SD6', floor: 'GROUND', type: 'SLIDING_DOOR', sillHeight: '---', lintelHeight: '10\'3"', sizeLxH: '9\'0" × 10\'3"', location: 'Bedroom 2', qty: 1, remarks: 'Sliding door opening to 30\'10" Bar Unit Deck' },
  { slNo: 7, code: 'SD7', floor: 'GROUND', type: 'SLIDING_DOOR', sillHeight: '---', lintelHeight: '10\'3"', sizeLxH: '7\'0" × 10\'3"', location: 'Bedroom 1 - Walk-in Wardrobe', qty: 1, remarks: 'Full-height sliding partition for master walk-in wardrobe' },
  { slNo: 8, code: 'W1', floor: 'GROUND', type: 'WINDOW', sillHeight: '1\'2"', lintelHeight: '10\'3"', sizeLxH: '1\'6" × 9\'1"', location: 'Living Area', qty: 1, remarks: 'Vertical architectural slit window' },
  { slNo: 9, code: 'W2 & W2A', floor: 'GROUND', type: 'FIXED_GLASS', sillHeight: '---', lintelHeight: 'Up to Beam', sizeLxH: '5\'0" × Up to Mid-Landing', location: 'Staircase Double-Height', qty: 2, remarks: 'Fixed glass with wooden beading (Staircase Drawing - 01)' },
  { slNo: 10, code: 'W3', floor: 'GROUND', type: 'WINDOW', sillHeight: '2\'1"', lintelHeight: '7\'8"', sizeLxH: '1\'3" × 5\'7"', location: 'Powder Room', qty: 1, remarks: 'Ventilator window with frosted acoustic glass' },
  { slNo: 11, code: 'W4', floor: 'GROUND', type: 'WINDOW', sillHeight: '3\'8"', lintelHeight: '7\'8"', sizeLxH: '3\'0" × 4\'0"', location: 'Utility Room', qty: 1, remarks: 'Louvered service window' },
  { slNo: 12, code: 'W5', floor: 'GROUND', type: 'WINDOW', sillHeight: '1\'2"', lintelHeight: '7\'8"', sizeLxH: '1\'6" × 6\'6"', location: 'Bedroom 2', qty: 1, remarks: 'Low-sill vertical daylight slit' },
  { slNo: 13, code: 'W6', floor: 'GROUND', type: 'FIXED_GLASS', sillHeight: '1\'2"', lintelHeight: '7\'8"', sizeLxH: '2\'6" × 6\'6"', location: 'Walk-in Wardrobe', qty: 1, remarks: 'Fixed glass window with frosted solar film' },
  { slNo: 14, code: 'FW1', floor: 'GROUND', type: 'FIXED_GLASS', sillHeight: '11\'6"', lintelHeight: '12\'9"', sizeLxH: '15\'9" × 1\'3"', location: 'Living Clerestory', qty: 1, remarks: 'Fixed glass with wooden beading above roof beam' },
  { slNo: 15, code: 'FW2', floor: 'GROUND', type: 'FIXED_GLASS', sillHeight: '11\'6"', lintelHeight: 'Up to Roof', sizeLxH: '9\'0" × Up to Roof', location: 'Bedroom 2 Clerestory', qty: 1, remarks: 'Fixed clerestory glass above roof beam' },
  { slNo: 16, code: 'D1', floor: 'GROUND', type: 'WOODEN_DOOR', sillHeight: '---', lintelHeight: '10\'3"', sizeLxH: '4\'0" × 10\'3"', location: 'Bedroom 1 & Bedroom 2 Entry', qty: 2, remarks: 'Full-height teakwood flush door with mortise lock' },
  { slNo: 17, code: 'D2', floor: 'GROUND', type: 'WOODEN_DOOR', sillHeight: '---', lintelHeight: '10\'3"', sizeLxH: '3\'6" × 10\'3"', location: 'Toilet 1 (Master Ensuite)', qty: 1, remarks: 'Waterproof PU flush door with frosted insert' },
  { slNo: 18, code: 'D3', floor: 'GROUND', type: 'WOODEN_DOOR', sillHeight: '---', lintelHeight: '7\'8"', sizeLxH: '3\'3" × 7\'8"', location: 'Toilet 2 (Bedroom 2)', qty: 1, remarks: 'Laminated moisture-resistant door' },
  { slNo: 19, code: 'D4', floor: 'GROUND', type: 'WOODEN_DOOR', sillHeight: '---', lintelHeight: '7\'8"', sizeLxH: '3\'0" × 7\'8"', location: 'Powder Room', qty: 1, remarks: 'Acoustic seal wooden door' },

  // First Floor
  { slNo: 20, code: 'SD1A', floor: 'FIRST', type: 'SLIDING_DOOR', sillHeight: '9"', lintelHeight: 'Up to Beam', sizeLxH: '12\'0" × Up to Beam', location: 'Bedroom 3 (First Floor Balcony)', qty: 1, remarks: 'Large sliding glass door to 24\'4" front balcony' },
  { slNo: 21, code: 'SD2A', floor: 'FIRST', type: 'SLIDING_DOOR', sillHeight: '---', lintelHeight: 'Up to Beam', sizeLxH: '10\'0" × Up to Beam', location: 'Bedroom 3', qty: 1, remarks: 'Sliding access to side terrace' },
  { slNo: 22, code: 'SD3A', floor: 'FIRST', type: 'SLIDING_DOOR', sillHeight: '---', lintelHeight: 'Up to Beam', sizeLxH: '8\'0" × Up to Beam', location: 'Bedroom 3', qty: 1, remarks: 'Balcony glass sliding panel' },
  { slNo: 23, code: 'SD4A', floor: 'FIRST', type: 'SLIDING_DOOR', sillHeight: '9"', lintelHeight: 'Up to Beam', sizeLxH: '5\'0" × Up to Beam', location: 'Staircase Upper Landing', qty: 1, remarks: 'Terrace / Gazebo access sliding door' },
  { slNo: 24, code: 'W1A', floor: 'FIRST', type: 'WINDOW', sillHeight: '4\'9"', lintelHeight: 'Up to Beam', sizeLxH: '6\'5" × Up to Beam', location: 'Staircase Upper Glazing', qty: 2, remarks: 'Double-glazed architectural fixed light' },
  { slNo: 25, code: 'W3A', floor: 'FIRST', type: 'WINDOW', sillHeight: '9"', lintelHeight: 'Up to Beam', sizeLxH: '5\'0" × Up to Beam', location: 'Toilet 3 (First Floor)', qty: 1, remarks: 'Horizontal privacy clerestory window' },
  { slNo: 26, code: 'D1A', floor: 'FIRST', type: 'WOODEN_DOOR', sillHeight: '---', lintelHeight: 'Up to Beam', sizeLxH: '4\'0" × Up to Beam', location: 'Bedroom 3 Entry', qty: 1, remarks: 'Full-height wooden door with acoustic drop seal' },
  { slNo: 27, code: 'D2A', floor: 'FIRST', type: 'WOODEN_DOOR', sillHeight: '---', lintelHeight: 'Up to Beam', sizeLxH: '3\'6" × Up to Beam', location: 'Toilet 3 Entry', qty: 1, remarks: 'Moisture-resistant flush door' }
];

export interface Villa253ThemeConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  palette: {
    primaryWall: string;
    accentWall: string;
    woodFinish: string;
    metalHardware: string;
    textileTone: string;
  };
  renderImage: string;
  moodboardImage: string;
  specifications: {
    flooring: string;
    wallCladding: string;
    ceiling: string;
    joinery: string;
    hardware: string;
    lighting: string;
    decking: string;
  };
  cctKelvin: number;
  vibeTags: string[];
}

export const VILLA_253_THEMES: Villa253ThemeConfig[] = [
  {
    id: 'THEME-WARM-LUXURY',
    name: 'Modern Warm Luxury',
    tagline: 'Signature Teak, Travertine & Concealed 2700K Architectural Coves',
    description: 'Designed specifically for the expansive 25\'4" × 19\'0" Living & Dining opening onto the 57ft deck. Combines Italian vein-cut travertine slabs, fluted teakwood wall slats, and soft bouclé upholstery.',
    palette: {
      primaryWall: '#FAF7F2',
      accentWall: '#D8CAB8',
      woodFinish: '#5E4028',
      metalHardware: '#A88947',
      textileTone: '#E4DCD0'
    },
    renderImage: '/assets/images/villa253_living_greatroom_1790833681710.jpg',
    moodboardImage: '/assets/images/villa253_living_modern_1790830799942.jpg',
    specifications: {
      flooring: '1200×600mm Vein-Cut Silver Travertine Italian Vitrified Slabs',
      wallCladding: 'Acoustic Fluted Solid CP Teak Paneling with Zero-VOC Matte PU',
      ceiling: 'Gyproc Seamless Gypsum False Ceiling with Continuous 2700K Indirect Cove',
      joinery: 'Natural Quarter-Cut Teak Veneer on BWP Marine Plywood with Blum Movento',
      hardware: 'Hafele Brushed Champagne Brass Edge Pulls & Concealed Soft-Close Hinges',
      lighting: 'Trimless 2700K CRI 97+ Architectural Recessed Spotlights (Cob lights)',
      decking: 'Seasoned Kiln-Dried Ipe Hardwood Decking with Concealed Stainless Clips'
    },
    cctKelvin: 2700,
    vibeTags: ['Warm Teak', 'Italian Travertine', '2700K Coves', 'Seamless Deck Flow', 'Architectural']
  },
  {
    id: 'THEME-JAPANDI-ZEN',
    name: 'Japandi Zen Minimalist',
    tagline: 'Muted Earth, Fluted White Oak & Wabi-Sabi Limewash Textures',
    description: 'A serene fusion of Scandinavian functionality and Japanese minimalism. Low-profile platform joinery, tatami-textured feature headboards, and unlacquered gunmetal fixtures.',
    palette: {
      primaryWall: '#F5F2EB',
      accentWall: '#D4C5B0',
      woodFinish: '#A38E75',
      metalHardware: '#4A453E',
      textileTone: '#C7BCAB'
    },
    renderImage: '/assets/images/villa253_guest_suite_1790833711200.jpg',
    moodboardImage: '/assets/images/villa253_master_suite_1790833696550.jpg',
    specifications: {
      flooring: 'Wide-Plank Engineered Bleached White Oak with UV Matte Oil Finish',
      wallCladding: 'Roman Clay Breathable Limewash Plaster in Warm Rice Cream',
      ceiling: 'Shadow-Line Flush Gypsum Ceiling with Recessed Micro-Track Lighting',
      joinery: 'Solid Scandinavian White Oak Slats with Push-to-Open Concealed Catches',
      hardware: 'Hand-Cast Unlacquered Gunmetal Bronze Hardware by Formani',
      lighting: 'Handmade Rice Paper Washi Pendant Luminaires with Dimmable 2400K E27',
      decking: 'FSC-Certified Thermo-Ash Decking with Weathering Grey Patina'
    },
    cctKelvin: 2500,
    vibeTags: ['Wabi-Sabi', 'White Oak', 'Limewash', 'Washi Paper', 'Minimalist']
  },
  {
    id: 'THEME-BIOPHILIC-TROPICAL',
    name: 'Biophilic Tropical Eco-Luxe',
    tagline: 'Verdant Courtyards, Teak Louvers, Living Walls & Natural Terrazzo',
    description: 'Maximizes the Villa 253 North-facing garden aspect. Blends indoor living seamlessly into the 57ft front deck, with indoor planters, natural terrazzo, and rattan weave accents.',
    palette: {
      primaryWall: '#F4F1EA',
      accentWall: '#2E4034',
      woodFinish: '#7A5230',
      metalHardware: '#8C7755',
      textileTone: '#D6CFBF'
    },
    renderImage: '/assets/images/villa253_living_modern_1790830799942.jpg',
    moodboardImage: '/assets/images/villa253_living_greatroom_1790833681710.jpg',
    specifications: {
      flooring: 'Cast-In-Situ Terrazzo with Sea-Green Jade Aggregate & Brass Divider Strips',
      wallCladding: 'Preserved Nordic Moss Wall Accent + Vertical Teak Screening Louvers',
      ceiling: 'Exposed Timber Ceiling Rafters with Natural Matte Wax Finish',
      joinery: 'Hand-Woven Rattan Cane Panels with Solid Teak Framing',
      hardware: 'Aged Brushed Brass Pulls with Organic Bamboo Detailing',
      lighting: 'Botanical Uplights with 3000K High CRI Daylight Simulation',
      decking: 'Heavy-Duty Indonesian Teak Deck with Anti-Slip Micro-Grooves'
    },
    cctKelvin: 3000,
    vibeTags: ['Indoor-Outdoor', 'Living Wall', 'Teak Louvers', 'Terrazzo', 'Verdant']
  },
  {
    id: 'THEME-NEOCLASSICAL-ELEGANCE',
    name: 'Contemporary Neoclassical',
    tagline: 'French Boiserie Mouldings, Botticino Marble & Champagne Gold',
    description: 'Timeless luxury with Parisian boiserie wall paneling, Italian Botticino marble flooring, double-height crystal chandelier over the staircase, and jewel-tone velvet accents.',
    palette: {
      primaryWall: '#FBF9F6',
      accentWall: '#BFA888',
      woodFinish: '#3E2723',
      metalHardware: '#C5A059',
      textileTone: '#5D6D7E'
    },
    renderImage: '/assets/images/villa253_master_suite_1790833696550.jpg',
    moodboardImage: '/assets/images/villa253_master_bedroom_1790830829821.jpg',
    specifications: {
      flooring: 'First-Choice Imported Botticino Italian Marble with Diamond Polish',
      wallCladding: 'High-Density Architectural Polyurethane Boiserie Wall Beadings & Cornices',
      ceiling: 'Multi-Step Coffered False Ceiling with Integrated Peripheral Chandeliers',
      joinery: 'High-Gloss Satin PU Lacquered Cabinetry in Warm Dove Grey with Mirror Trim',
      hardware: 'Solid Forged Brass Handles with 24K Champagne Gold PVD Coating',
      lighting: 'Cascading Crystal Prism Chandelier in Double-Height Staircase (W2/W2A)',
      decking: 'Natural Flamed Granite Pavers with Classical Bullnose Edge'
    },
    cctKelvin: 2800,
    vibeTags: ['Boiserie', 'Botticino Marble', 'Chandeliers', 'Velvet', 'Grandeur']
  },
  {
    id: 'THEME-URBAN-INDUSTRIAL',
    name: 'Urban Contemporary Loft',
    tagline: 'Architectural Microcement, Slim Steel Profiles & Cognac Leather',
    description: 'Crisp architectural lines that mirror the Villa 253 black aluminum door and window frames (SD1, SD2, SD6). Smoked glass wardrobes, raw steel accents, and aniline leather.',
    palette: {
      primaryWall: '#ECEAE6',
      accentWall: '#33373D',
      woodFinish: '#4A3525',
      metalHardware: '#1E1F22',
      textileTone: '#9C6137'
    },
    renderImage: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
    moodboardImage: '/assets/images/villa253_guest_suite_1790833711200.jpg',
    specifications: {
      flooring: 'Large-Format 1600×800mm Concrete-Look Matte Glazed Vitrified Slabs',
      wallCladding: 'Hand-Troweled Italian Microcement Plaster with Water-Repellent Seal',
      ceiling: 'Exposed Dark Ceiling Deck with Suspended Slim Acoustic Baffles',
      joinery: 'Fluted Smoked Glass Cabinetry with Slim Matte Black Aluminum Extrusions',
      hardware: 'Industrial Knurled Solid Aluminum Handles in Matte Carbon Finish',
      lighting: 'Architectural Low-Voltage 48V Magnetic Track System with Adjustable Spots',
      decking: 'Composite Charcoal Grey Decking with Hidden Fastener System'
    },
    cctKelvin: 3000,
    vibeTags: ['Concrete Plaster', 'Smoked Glass', 'Black Steel', 'Cognac Leather', 'Loft']
  },
  {
    id: 'THEME-ROOF-GAZEBO-LOUNGE',
    name: 'Signature Roof Gazebo & Bar Lounge',
    tagline: 'Pitched Timber Pergola, Outdoor Cocktail Bar & Sunset Ambient Lanterns',
    description: 'Dedicated outdoor-indoor theme for the Villa 253 signature Roof Gazebo (Section BB\') and the 14\'0" × 30\'10" Bar Unit Deck. Built with weatherproof timber rafters, stone bar counter, and exterior lounge daybeds.',
    palette: {
      primaryWall: '#FAF5EE',
      accentWall: '#7D4F27',
      woodFinish: '#5C381E',
      metalHardware: '#2B2520',
      textileTone: '#C9BAA7'
    },
    renderImage: '/assets/images/villa253_gazebo_terrace_1790833723445.jpg',
    moodboardImage: '/assets/images/villa253_roof_gazebo_1790830815235.jpg',
    specifications: {
      flooring: 'Kiln-Dried Weatherproof Teak Decking + Honed River Pebble Border',
      wallCladding: 'Dry-Stacked Natural Quartzite Stone Bar Backing with Integrated Bottle Rails',
      ceiling: 'Pitched Timber Rafters with Concealed LED Grazing Lighting (Roof Gazebo)',
      joinery: 'Marine-Grade Teak & Quartz Cocktail Bar Counter with 4 Heavy-Duty Bar Stools',
      hardware: 'Marine 316-Grade Stainless Steel & Weatherproof Anodized Black Fixtures',
      lighting: 'Weatherproof IP65 Rattan Lantern Drops & Dimmable Step Lights (2200K)',
      decking: 'Outdoor Sunbrella Quick-Dry All-Weather Foam Upholstery in Natural Sand'
    },
    cctKelvin: 2400,
    vibeTags: ['Roof Gazebo', 'Cocktail Bar', 'Outdoor Lounge', 'Pergola', 'Sunset Vibe']
  }
];

export const VILLA_253_ROOMS: ExtractedRoomGeometry[] = [
  {
    id: 'ROOM-V253-LIV-01',
    name: 'Living & Dining Great Room',
    roomType: 'LIVING_DINING',
    lengthFt: 25.33, // 25'4"
    widthFt: 19.0,   // 19'0"
    heightFt: 10.25, // 10'3" to beam
    carpetAreaSqFt: 481,
    doors: [
      {
        id: 'D-V253-SD1',
        wall: 'NORTH',
        widthFt: 27.0, // SD1: 27'0" x 10'3"
        swingDirection: 'SLIDING',
        clearanceFt: 4.5,
        isClearanceMet: true
      },
      {
        id: 'D-V253-SD5',
        wall: 'SOUTH',
        widthFt: 11.0, // SD5: 11'0" x 10'3"
        swingDirection: 'SLIDING',
        clearanceFt: 3.5,
        isClearanceMet: true
      }
    ],
    windows: [
      {
        id: 'W-V253-FW1',
        wall: 'NORTH',
        widthFt: 15.75, // FW1: 15'9" x 1'3" fixed glass above beam
        sillHeightFt: 11.5,
        lintelHeightFt: 12.75,
        isDaylightBlocked: false
      },
      {
        id: 'W-V253-W1',
        wall: 'EAST',
        widthFt: 1.5, // W1: 1'6" x 9'1"
        sillHeightFt: 1.16,
        lintelHeightFt: 10.25,
        isDaylightBlocked: false
      }
    ],
    structuralColumns: [
      { id: 'COL-V253-01', xFt: 0, yFt: 0, widthInches: 15, depthInches: 18 },
      { id: 'COL-V253-02', xFt: 25.33, yFt: 0, widthInches: 15, depthInches: 18 },
      { id: 'COL-V253-03', xFt: 0, yFt: 19, widthInches: 15, depthInches: 18 },
      { id: 'COL-V253-04', xFt: 25.33, yFt: 19, widthInches: 15, depthInches: 18 }
    ],
    isVerifiedByDesigner: true,
    verifiedBy: 'Chief Architect, Build Storys',
    verificationDate: '2026-10-10',
    designerNotes: 'Expansive 25\'4" × 19\'0" clear span opening directly to 57\'2" front deck via 27ft aluminum sliding system (SD1). Clear 4.0ft passage maintained between dining zone and kitchen portal.'
  },
  {
    id: 'ROOM-V253-BED1-01',
    name: 'Master Bedroom 1 Suite & Walk-in Closet',
    roomType: 'MASTER_BEDROOM',
    lengthFt: 14.0,  // 14'0"
    widthFt: 19.0,   // 19'0"
    heightFt: 10.25, // 10'3"
    carpetAreaSqFt: 266,
    doors: [
      {
        id: 'D-V253-SD2',
        wall: 'NORTH',
        widthFt: 12.0, // SD2: 12'0" x 10'3"
        swingDirection: 'SLIDING',
        clearanceFt: 3.5,
        isClearanceMet: true
      },
      {
        id: 'D-V253-SD4',
        wall: 'WEST',
        widthFt: 10.0, // SD4: 10'0" x 10'3"
        swingDirection: 'SLIDING',
        clearanceFt: 3.5,
        isClearanceMet: true
      },
      {
        id: 'D-V253-SD7',
        wall: 'SOUTH',
        widthFt: 7.0, // SD7: 7'0" x 10'3" Walk-in Wardrobe access
        swingDirection: 'SLIDING',
        clearanceFt: 3.2,
        isClearanceMet: true
      },
      {
        id: 'D-V253-D1',
        wall: 'EAST',
        widthFt: 4.0, // D1: 4'0" x 10'3" main suite door
        swingDirection: 'INWARD_LEFT',
        clearanceFt: 3.5,
        isClearanceMet: true
      }
    ],
    windows: [],
    structuralColumns: [
      { id: 'COL-V253-05', xFt: 0, yFt: 0, widthInches: 15, depthInches: 15 },
      { id: 'COL-V253-06', xFt: 14, yFt: 19, widthInches: 15, depthInches: 15 }
    ],
    isVerifiedByDesigner: true,
    verifiedBy: 'Chief Architect, Build Storys',
    verificationDate: '2026-10-10',
    designerNotes: 'Primary ground-floor master suite. Features separate 10\'2" × 11\'9" walk-in wardrobe and expansive 6\'0" × 24\'9" luxury bath (Toilet 1). Direct access to 11\'6" × 4\'6" private deck.'
  },
  {
    id: 'ROOM-V253-BED2-01',
    name: 'Bedroom 2 & Bar Deck Suite',
    roomType: 'BEDROOM_2_STUDY',
    lengthFt: 18.91, // 18'11"
    widthFt: 19.0,   // 19'0"
    heightFt: 10.25, // 10'3"
    carpetAreaSqFt: 359,
    doors: [
      {
        id: 'D-V253-SD6',
        wall: 'EAST',
        widthFt: 9.0, // SD6: 9'0" x 10'3" to Bar Deck
        swingDirection: 'SLIDING',
        clearanceFt: 3.5,
        isClearanceMet: true
      },
      {
        id: 'D-V253-SD2-B2',
        wall: 'NORTH',
        widthFt: 12.0, // SD2: 12'0" x 10'3" to deck
        swingDirection: 'SLIDING',
        clearanceFt: 3.5,
        isClearanceMet: true
      },
      {
        id: 'D-V253-D1-B2',
        wall: 'WEST',
        widthFt: 4.0, // D1: 4'0" x 10'3"
        swingDirection: 'INWARD_RIGHT',
        clearanceFt: 3.5,
        isClearanceMet: true
      }
    ],
    windows: [
      {
        id: 'W-V253-W5',
        wall: 'SOUTH',
        widthFt: 1.5,
        sillHeightFt: 1.16,
        lintelHeightFt: 7.66,
        isDaylightBlocked: false
      }
    ],
    structuralColumns: [
      { id: 'COL-V253-07', xFt: 0, yFt: 0, widthInches: 15, depthInches: 15 }
    ],
    isVerifiedByDesigner: true,
    verifiedBy: 'Chief Architect, Build Storys',
    verificationDate: '2026-10-10',
    designerNotes: 'Executive ground-floor suite opening via SD6 to the 14\'0" × 30\'10" Bar Unit Deck. Includes private wardrobe (7\'9" × 9\'8") and ensuite Toilet 2 (10\'4" × 9\'8").'
  },
  {
    id: 'ROOM-V253-KIT-01',
    name: 'Culinary Kitchen, Utility & Powder Wing',
    roomType: 'KITCHEN',
    lengthFt: 14.5, // 14'6"
    widthFt: 9.0,   // 9'0"
    heightFt: 10.25,
    carpetAreaSqFt: 131,
    doors: [
      {
        id: 'D-V253-KIT-ENTRY',
        wall: 'WEST',
        widthFt: 3.5,
        swingDirection: 'SLIDING',
        clearanceFt: 3.5,
        isClearanceMet: true
      },
      {
        id: 'D-V253-D4-POWDER',
        wall: 'NORTH',
        widthFt: 3.0,
        swingDirection: 'INWARD_LEFT',
        clearanceFt: 3.0,
        isClearanceMet: true
      }
    ],
    windows: [
      {
        id: 'W-V253-W4-UTIL',
        wall: 'SOUTH',
        widthFt: 3.0,
        sillHeightFt: 3.66,
        lintelHeightFt: 7.66,
        isDaylightBlocked: false
      },
      {
        id: 'W-V253-W3-POWDER',
        wall: 'EAST',
        widthFt: 1.25,
        sillHeightFt: 2.08,
        lintelHeightFt: 7.66,
        isDaylightBlocked: false
      }
    ],
    structuralColumns: [],
    isVerifiedByDesigner: true,
    verifiedBy: 'Chief Architect, Build Storys',
    verificationDate: '2026-10-10',
    designerNotes: 'Directly adjoins the dining zone. Integrated access to Utility (9\'0" × 9\'8") and guest Powder Room (5\'0" × 9\'8"). Parallel quartz countertop run with ergonomic 3.8ft central passage.'
  },
  {
    id: 'ROOM-V253-BED3-01',
    name: 'First Floor Bedroom 3 & Balconies',
    roomType: 'MASTER_BEDROOM',
    lengthFt: 20.66, // 20'8"
    widthFt: 19.0,   // 19'0"
    heightFt: 10.25,
    carpetAreaSqFt: 393,
    doors: [
      {
        id: 'D-V253-SD1A',
        wall: 'NORTH',
        widthFt: 12.0, // SD1A: 12'0" x beam to 24'4" front balcony
        swingDirection: 'SLIDING',
        clearanceFt: 3.5,
        isClearanceMet: true
      },
      {
        id: 'D-V253-SD2A',
        wall: 'WEST',
        widthFt: 10.0, // SD2A: 10'0" x beam
        swingDirection: 'SLIDING',
        clearanceFt: 3.5,
        isClearanceMet: true
      },
      {
        id: 'D-V253-SD3A',
        wall: 'SOUTH',
        widthFt: 8.0, // SD3A: 8'0" x beam
        swingDirection: 'SLIDING',
        clearanceFt: 3.2,
        isClearanceMet: true
      },
      {
        id: 'D-V253-D1A',
        wall: 'EAST',
        widthFt: 4.0, // D1A: 4'0" x beam
        swingDirection: 'INWARD_LEFT',
        clearanceFt: 3.5,
        isClearanceMet: true
      }
    ],
    windows: [],
    structuralColumns: [],
    isVerifiedByDesigner: true,
    verifiedBy: 'Chief Architect, Build Storys',
    verificationDate: '2026-10-10',
    designerNotes: 'Grand first-floor penthouse bedroom suite. Features wrap-around balconies (4\'0" × 24\'4" front and 14\'10" × 4\'0" balcony access). Private ensuite Toilet 3 (9\'9" × 9\'2").'
  },
  {
    id: 'ROOM-V253-GAZEBO-01',
    name: 'Signature Roof Gazebo Terrace Pavilion',
    roomType: 'BALCONY',
    lengthFt: 24.0,
    widthFt: 18.0,
    heightFt: 12.75, // Pitched roof timber gazebo as shown in Section BB'
    carpetAreaSqFt: 432,
    doors: [
      {
        id: 'D-V253-SD4A',
        wall: 'SOUTH',
        widthFt: 5.0, // SD4A: 5'0" x beam from staircase
        swingDirection: 'SLIDING',
        clearanceFt: 3.5,
        isClearanceMet: true
      }
    ],
    windows: [],
    structuralColumns: [
      { id: 'COL-V253-GZ1', xFt: 0, yFt: 0, widthInches: 12, depthInches: 12 },
      { id: 'COL-V253-GZ2', xFt: 24, yFt: 0, widthInches: 12, depthInches: 12 },
      { id: 'COL-V253-GZ3', xFt: 0, yFt: 18, widthInches: 12, depthInches: 12 },
      { id: 'COL-V253-GZ4', xFt: 24, yFt: 18, widthInches: 12, depthInches: 12 }
    ],
    isVerifiedByDesigner: true,
    verifiedBy: 'Chief Architect, Build Storys',
    verificationDate: '2026-10-10',
    designerNotes: 'Key architectural landmark of Villa 253 ("24 Type - 3 Bedroom with Roof Gazebo"). Features pitched timber rafters, outdoor cocktail bar counter, weather-resistant sectional lounge, and panoramic views.'
  },
  {
    id: 'ROOM-V253-STAIR-01',
    name: 'Architectural Staircase & Double-Height Core',
    roomType: 'LIVING_DINING',
    lengthFt: 19.0,
    widthFt: 7.5, // 7'6" x 19'0"
    heightFt: 22.5, // Double height ground to first floor roof beam
    carpetAreaSqFt: 143,
    doors: [
      {
        id: 'D-V253-STAIR-SD3',
        wall: 'NORTH',
        widthFt: 5.0,
        swingDirection: 'SLIDING',
        clearanceFt: 3.5,
        isClearanceMet: true
      }
    ],
    windows: [
      {
        id: 'W-V253-W2',
        wall: 'WEST',
        widthFt: 5.0,
        sillHeightFt: 0,
        lintelHeightFt: 10.25,
        isDaylightBlocked: false
      },
      {
        id: 'W-V253-W2A',
        wall: 'WEST',
        widthFt: 5.0,
        sillHeightFt: 11.5,
        lintelHeightFt: 22.0,
        isDaylightBlocked: false
      }
    ],
    structuralColumns: [],
    isVerifiedByDesigner: true,
    verifiedBy: 'Chief Architect, Build Storys',
    verificationDate: '2026-10-10',
    designerNotes: 'RCC double-flight dogleg staircase with 21 risers (Tread 11", Riser 6.25", 3\'6" waist slab & landing slab). Features continuous architectural glass facade W2/W2A with wooden beading.'
  }
];

export const VILLA_253_LAYOUTS_BY_ROOM: Record<string, FurnitureLayoutOption[]> = {
  'ROOM-V253-LIV-01': [
    {
      id: 'V253-LAY-LIV-01',
      optionCode: 'LAYOUT_1',
      title: 'Option A: Grand Entertaining & Deck Integration',
      tagline: 'Expansive 10-seater sectional facing North deck + 8-seater solid wood dining table',
      priorityTheme: 'OPEN_LIVING',
      circulationScore: 96,
      storageCapacityCuFt: 180,
      minClearancePassageFt: 3.8,
      doorwayConflictDetected: false,
      windowLightBlocked: false,
      summary: 'Focuses on the massive 27ft sliding glass door (SD1) to the 57ft deck. Continuous line of sight from dining through living to garden.',
      pros: ['Zero blockage of 27ft sliding doors SD1', 'Direct 4.2ft clear corridor to kitchen and deck', 'Seats 14 guests comfortably across living & dining'],
      cons: ['TV credenza is low-profile to maintain window views'],
      whyItFitsOverall: 'Leaves 4.2ft clear walk route between entrance, kitchen portal, and deck sliding doors. Ergonomically calibrated for high-volume entertaining.',
      furnitureItems: [
        {
          id: 'V253-FUR-LIV-01',
          name: 'Custom Curved 5-Seater Lounge Sofa in Oatmeal Bouclé',
          category: 'SEATING',
          widthFt: 12.0,
          depthFt: 3.5,
          heightFt: 2.7,
          positionXPercent: 20,
          positionYPercent: 55,
          rotationDeg: 0,
          clearanceDistanceFt: 4.0,
          whyItFits: 'Faces the North deck view without obstructing the 27ft sliding door track.',
          catalogueCode: 'SOF-BOU-120',
          materialRef: 'High-resilience foam with hydrophobic Belgian bouclé weave',
          estimatedCost: 145000
        },
        {
          id: 'V253-FUR-LIV-02',
          name: 'Pair of Organic Teak & Rattan Accent Armchairs',
          category: 'SEATING',
          widthFt: 2.8,
          depthFt: 2.8,
          heightFt: 2.6,
          positionXPercent: 55,
          positionYPercent: 60,
          rotationDeg: -35,
          clearanceDistanceFt: 3.5,
          whyItFits: 'Light visual silhouette maintains outdoor deck transparency.',
          catalogueCode: 'CHR-ACC-202',
          materialRef: 'Solid CP Teak with natural French cane weave backing',
          estimatedCost: 64000
        },
        {
          id: 'V253-FUR-LIV-03',
          name: 'Solid Teak & Bronze 8-Seater Formal Dining Table (8.0ft × 3.6ft)',
          category: 'DINING',
          widthFt: 8.0,
          depthFt: 3.6,
          heightFt: 2.5,
          positionXPercent: 70,
          positionYPercent: 20,
          rotationDeg: 0,
          clearanceDistanceFt: 3.8,
          whyItFits: 'Positioned near the kitchen pass; maintains 3.8ft passage around all dining chairs.',
          catalogueCode: 'DIN-TBL-801',
          materialRef: 'Solid plantation teak slab with brushed champagne bronze trestle base',
          estimatedCost: 168000
        },
        {
          id: 'V253-FUR-LIV-04',
          name: 'Set of 8 Sculptural Upholstered Dining Chairs',
          category: 'DINING',
          widthFt: 1.8,
          depthFt: 1.8,
          heightFt: 3.0,
          positionXPercent: 70,
          positionYPercent: 20,
          rotationDeg: 0,
          clearanceDistanceFt: 3.2,
          whyItFits: 'Ergonomic lumbar support with stain-shield linen fabric.',
          catalogueCode: 'DIN-CHR-808',
          materialRef: 'Solid teak legs with sand beige performance linen',
          estimatedCost: 96000
        },
        {
          id: 'V253-FUR-LIV-05',
          name: 'Low-Profile Floating Travertine & Teak Media Credenza (12ft)',
          category: 'STORAGE',
          widthFt: 12.0,
          depthFt: 1.5,
          heightFt: 1.6,
          positionXPercent: 22,
          positionYPercent: 12,
          rotationDeg: 0,
          clearanceDistanceFt: 4.5,
          whyItFits: 'Wall-hung at South masonry wall; leaves 4.5ft open floor space.',
          catalogueCode: 'MED-CRD-120',
          materialRef: 'Italian silver travertine top with fluted teak soft-close push drawers',
          estimatedCost: 110000
        }
      ]
    },
    {
      id: 'V253-LAY-LIV-02',
      optionCode: 'LAYOUT_2',
      title: 'Option B: Dual-Zone Living with Fireplace & Cocktail Bar',
      tagline: 'Formal conversational salon + dedicated dry bar credenza with wine cooler',
      priorityTheme: 'LUXURY_ENTERTAINING',
      circulationScore: 92,
      storageCapacityCuFt: 240,
      minClearancePassageFt: 3.5,
      doorwayConflictDetected: false,
      windowLightBlocked: false,
      summary: 'Divides the 25\'4" length into an intimate fireplace & TV lounge and a sophisticated cocktail dining lounge with integrated backlit bar cabinetry.',
      pros: ['Built-in dry bar and wine chiller cabinet near rear deck', 'Cosy dual-zone conversational clusters', 'Direct patio bar connection'],
      cons: ['Dining capacity adjusted to 6 seats'],
      whyItFitsOverall: 'Optimizes entertaining flexibility with 3.5ft walk paths maintained throughout.',
      furnitureItems: [
        {
          id: 'V253-FUR-LIV-11',
          name: 'L-Shaped Modular Velvet Sectional (10ft × 7ft)',
          category: 'SEATING',
          widthFt: 10.0,
          depthFt: 7.0,
          heightFt: 2.8,
          positionXPercent: 25,
          positionYPercent: 55,
          rotationDeg: 0,
          clearanceDistanceFt: 3.6,
          whyItFits: 'Defines formal lounge zone without closing off North glass sliding door SD1.',
          catalogueCode: 'SOF-LSH-107',
          materialRef: 'Deep taupe velvet with duck-down blend cushions',
          estimatedCost: 185000
        },
        {
          id: 'V253-FUR-LIV-12',
          name: 'Integrated Fluted Glass Cocktail Bar Credenza with Wine Chiller',
          category: 'JOINERY',
          widthFt: 7.0,
          depthFt: 2.0,
          heightFt: 7.5,
          positionXPercent: 88,
          positionYPercent: 65,
          rotationDeg: 0,
          clearanceDistanceFt: 3.8,
          whyItFits: 'Fits neatly on East wall adjacent to Bar Deck passway.',
          catalogueCode: 'BAR-CRD-701',
          materialRef: 'BWP marine ply with smoked fluted glass and brushed brass racks',
          estimatedCost: 148000
        },
        {
          id: 'V253-FUR-LIV-13',
          name: 'Round Italian Marble Dining Table (5.5ft Dia - 6 Seater)',
          category: 'DINING',
          widthFt: 5.5,
          depthFt: 5.5,
          heightFt: 2.5,
          positionXPercent: 65,
          positionYPercent: 25,
          rotationDeg: 0,
          clearanceDistanceFt: 3.6,
          whyItFits: 'Round geometry softens circulation angles and enhances conversation.',
          catalogueCode: 'DIN-RND-55',
          materialRef: 'Calacatta gold marble top with fluted timber pedestal base',
          estimatedCost: 155000
        }
      ]
    },
    {
      id: 'V253-LAY-LIV-03',
      optionCode: 'LAYOUT_3',
      title: 'Option C: Vastu Shastra Harmonized Spatial Flow',
      tagline: 'North-East Ishanya meditation corner, South-East Agni dining orientation',
      priorityTheme: 'VASTU_COMPLIANT',
      circulationScore: 94,
      storageCapacityCuFt: 195,
      minClearancePassageFt: 3.7,
      doorwayConflictDetected: false,
      windowLightBlocked: false,
      summary: 'Strictly complies with classical Vastu: North-East Ishanya zone kept light and uncluttered; heavy storage and seating anchored in South-West Nairutya.',
      pros: ['Positive cosmic energy flow aligned with North-facing villa entrance', 'Zero clutter in Ishanya corner', 'Excellent cross-ventilation from North to South decks'],
      cons: ['TV placed on South wall with motorized concealment'],
      whyItFitsOverall: 'Respects cardinal Vastu alignments without compromising contemporary ergonomics.',
      furnitureItems: [
        {
          id: 'V253-FUR-LIV-21',
          name: 'South-West Anchored Solid Teak Low-Rise Sofa Suite',
          category: 'SEATING',
          widthFt: 11.0,
          depthFt: 3.4,
          heightFt: 2.5,
          positionXPercent: 25,
          positionYPercent: 68,
          rotationDeg: 0,
          clearanceDistanceFt: 4.0,
          whyItFits: 'Anchors heavy weight in Nairutya (South-West) as mandated by Vastu.',
          catalogueCode: 'SOF-VST-110',
          materialRef: 'Pure seasoned CP Teakwood with organic unbleached cotton upholstery',
          estimatedCost: 165000
        },
        {
          id: 'V253-FUR-LIV-22',
          name: 'Agni Corner (South-East) Solid Wood 8-Seater Dining Table',
          category: 'DINING',
          widthFt: 7.5,
          depthFt: 3.5,
          heightFt: 2.5,
          positionXPercent: 72,
          positionYPercent: 22,
          rotationDeg: 0,
          clearanceDistanceFt: 3.8,
          whyItFits: 'Dining placed in Agni direction proximate to kitchen cooking fire zone.',
          catalogueCode: 'DIN-VST-801',
          materialRef: 'Kiln-dried solid Sheesham with natural oil wax finish',
          estimatedCost: 140000
        },
        {
          id: 'V253-FUR-LIV-23',
          name: 'Ishanya (North-East) Water Cascade & Brass Lamp Feature',
          category: 'ACCENT',
          widthFt: 3.0,
          depthFt: 2.0,
          heightFt: 4.5,
          positionXPercent: 90,
          positionYPercent: 12,
          rotationDeg: 0,
          clearanceDistanceFt: 4.0,
          whyItFits: 'Lightweight soothing water element in sacred Ishanya direction.',
          catalogueCode: 'VST-WTR-301',
          materialRef: 'Hand-hammered brass urn with river stone recirculation',
          estimatedCost: 45000
        }
      ]
    }
  ],

  'ROOM-V253-BED1-01': [
    {
      id: 'V253-LAY-BED1-01',
      optionCode: 'LAYOUT_1',
      title: 'Option A: Executive Resort Master Sanctuary',
      tagline: 'King-size floating platform bed facing private deck + illuminated walk-in wardrobe',
      priorityTheme: 'OPEN_LIVING',
      circulationScore: 95,
      storageCapacityCuFt: 340,
      minClearancePassageFt: 3.6,
      doorwayConflictDetected: false,
      windowLightBlocked: false,
      summary: 'Oriented towards the 11\'6" × 4\'6" private deck (SD2). Features acoustic fluted headboard, seamless access to the 10\'2" × 11\'9" walk-in wardrobe (SD7), and direct door to the 24\'9" long master bathroom (D2).',
      pros: ['Waking up to panoramic private garden deck view', 'Unrestricted 3.6ft perimeter passage around king bed', 'Walk-in wardrobe completely isolated from bed chamber'],
      cons: ['TV placed on side swivel mount'],
      whyItFitsOverall: 'Leaves 3.6ft clear clearance to all 4 doors (SD2, SD4, SD7, D1). Maximum luxury.',
      furnitureItems: [
        {
          id: 'V253-FUR-BED1-01',
          name: 'King Platform Bed with Integrated Fluted Oak Floating Headboard',
          category: 'BED',
          widthFt: 6.8,
          depthFt: 7.2,
          heightFt: 3.5,
          positionXPercent: 50,
          positionYPercent: 45,
          rotationDeg: 0,
          clearanceDistanceFt: 3.6,
          whyItFits: 'Placed against South wall; provides direct visual line to private deck glass sliding door SD2.',
          catalogueCode: 'BED-KNG-601',
          materialRef: 'Solid oak carcass with curved bouclé headboard & warm concealed LED step',
          estimatedCost: 165000
        },
        {
          id: 'V253-FUR-BED1-02',
          name: 'Floating Cantilevered Bedside Tables with Wireless Chargers (Pair)',
          category: 'STORAGE',
          widthFt: 2.0,
          depthFt: 1.5,
          heightFt: 1.2,
          positionXPercent: 50,
          positionYPercent: 45,
          rotationDeg: 0,
          clearanceDistanceFt: 3.8,
          whyItFits: 'Wall-mounted to keep floor space completely clear for vacuuming.',
          catalogueCode: 'TAB-FLT-202',
          materialRef: 'Natural smoked oak with Italian porcelain drawer fronts',
          estimatedCost: 48000
        },
        {
          id: 'V253-FUR-BED1-03',
          name: 'Bespoke Walk-in Wardrobe System (10\'2" × 11\'9" Room - 36 r.ft)',
          category: 'JOINERY',
          widthFt: 10.0,
          depthFt: 11.5,
          heightFt: 9.5,
          positionXPercent: 80,
          positionYPercent: 80,
          rotationDeg: 0,
          clearanceDistanceFt: 3.5,
          whyItFits: 'Fills the designated walk-in closet space with backlit hanging rails and jewelry drawers.',
          catalogueCode: 'WRD-WIW-36',
          materialRef: '18mm BWP marine ply with smoked glass shutters and Hafele sensor LEDs',
          estimatedCost: 320000
        },
        {
          id: 'V253-FUR-BED1-04',
          name: 'Lounge Daybed & Deck Reading Armchair',
          category: 'SEATING',
          widthFt: 3.0,
          depthFt: 3.2,
          heightFt: 2.8,
          positionXPercent: 20,
          positionYPercent: 70,
          rotationDeg: 25,
          clearanceDistanceFt: 3.5,
          whyItFits: 'Tucked by corner sliding door SD4 overlooking the side garden deck.',
          catalogueCode: 'CHR-LNG-301',
          materialRef: 'Brushed bronze swivel base with cognac aniline leather',
          estimatedCost: 72000
        }
      ]
    }
  ],

  'ROOM-V253-GAZEBO-01': [
    {
      id: 'V253-LAY-GAZ-01',
      optionCode: 'LAYOUT_1',
      title: 'Option A: Sunset Cocktail Pergola & Sky Daybeds',
      tagline: 'All-weather teak sectional under timber rafters + granite bar counter',
      priorityTheme: 'LUXURY_ENTERTAINING',
      circulationScore: 98,
      storageCapacityCuFt: 160,
      minClearancePassageFt: 4.2,
      doorwayConflictDetected: false,
      windowLightBlocked: false,
      summary: 'Tailored for the distinctive triangular pitched timber gazebo shown in Section BB\'. Features a 4-stool granite cocktail bar, weather-resistant U-sectional, and lantern pendants.',
      pros: ['360-degree open-air sky views', 'All-weather Sunbrella fabrics resistant to monsoon and UV', 'Built-in refrigerator and sink station'],
      cons: ['Requires outdoor electrical IP65 fittings'],
      whyItFitsOverall: '4.2ft clear circulation from upper staircase door SD4A. Maximizes outdoor lifestyle.',
      furnitureItems: [
        {
          id: 'V253-FUR-GAZ-01',
          name: 'All-Weather Outdoor Teak U-Sectional Lounge Suite (12ft × 9ft)',
          category: 'SEATING',
          widthFt: 12.0,
          depthFt: 9.0,
          heightFt: 2.6,
          positionXPercent: 40,
          positionYPercent: 50,
          rotationDeg: 0,
          clearanceDistanceFt: 4.0,
          whyItFits: 'Fits comfortably beneath the timber pitched pergola rafters.',
          catalogueCode: 'OUT-SEC-129',
          materialRef: 'Marine-grade teak framing with Sunbrella quick-dry cushions',
          estimatedCost: 195000
        },
        {
          id: 'V253-FUR-GAZ-02',
          name: 'Outdoor Granite Cocktail Bar Counter with Sink & Chiller (8ft)',
          category: 'JOINERY',
          widthFt: 8.0,
          depthFt: 2.5,
          heightFt: 3.5,
          positionXPercent: 82,
          positionYPercent: 40,
          rotationDeg: 90,
          clearanceDistanceFt: 4.2,
          whyItFits: 'Located alongside structural support columns with concealed drainage.',
          catalogueCode: 'OUT-BAR-801',
          materialRef: 'Honed jet black granite top with waterproof marine teak slatted carcass',
          estimatedCost: 165000
        },
        {
          id: 'V253-FUR-GAZ-03',
          name: 'Set of 4 Weatherproof Teak & Stainless High Bar Stools',
          category: 'SEATING',
          widthFt: 1.5,
          depthFt: 1.5,
          heightFt: 3.5,
          positionXPercent: 75,
          positionYPercent: 40,
          rotationDeg: 0,
          clearanceDistanceFt: 3.5,
          whyItFits: 'Tucks neatly under the granite overhang of the bar counter.',
          catalogueCode: 'OUT-STL-404',
          materialRef: 'Teak seats with powder-coated 316 stainless steel frame',
          estimatedCost: 52000
        }
      ]
    }
  ],

  'ROOM-V253-BED2-01': [
    {
      id: 'V253-LAY-BED2-01',
      optionCode: 'LAYOUT_1',
      title: 'Option A: East Bar-Deck & North Garden Suite',
      tagline: '18\'11" × 19\'0" Suite with King Bed, 7\'9" × 9\'8" Wardrobe & SD6 Bar Deck Portal',
      priorityTheme: 'OPEN_LIVING',
      circulationScore: 95,
      storageCapacityCuFt: 260,
      minClearancePassageFt: 3.8,
      doorwayConflictDetected: false,
      windowLightBlocked: false,
      summary: 'Calibrated to the 18\'11" × 19\'0" East Wing footprint. Maintains 3.8ft clear passage between the SD2 (12\'0") North Deck slider and SD6 (9\'0") East Bar Unit Deck slider.',
      pros: ['Dual deck access (North 57\'2" deck + East 14\'0"×30\'10" Bar Deck)', 'Dedicated 7\'9" × 9\'8" recessed wardrobe vestibule', 'Direct access to 10\'4" × 9\'8" Toilet 2 via D3'],
      cons: ['Media console offset to preserve SD6 9ft slider opening'],
      whyItFitsOverall: 'Respects all 3 doorways (D1, SD2, SD6) and W5 window with 3.8ft minimum walk clearance.',
      furnitureItems: [
        {
          id: 'V253-FUR-BED2-01',
          name: 'King Teak & Cane Platform Bed with Acoustic Headboard',
          category: 'BED',
          widthFt: 6.5,
          depthFt: 7.0,
          heightFt: 3.4,
          positionXPercent: 45,
          positionYPercent: 48,
          rotationDeg: 0,
          clearanceDistanceFt: 4.0,
          whyItFits: 'Centered in the 18\'11" × 19\'0" suite with unobstructed views toward North Deck (SD2) and East Bar Deck (SD6).',
          catalogueCode: 'BED-B2-650',
          materialRef: 'Seasoned CP Teak frame with woven rattan cane & linen upholstery',
          estimatedCost: 148000
        },
        {
          id: 'V253-FUR-BED2-02',
          name: 'Recessed Wardrobe Joinery System (7\'9" × 9\'8" Vestibule)',
          category: 'JOINERY',
          widthFt: 7.75,
          depthFt: 2.2,
          heightFt: 9.5,
          positionXPercent: 25,
          positionYPercent: 85,
          rotationDeg: 0,
          clearanceDistanceFt: 4.2,
          whyItFits: 'Installed inside the dedicated 7\'9" × 9\'8" dressing vestibule leading to Toilet 2 (D3).',
          catalogueCode: 'WRD-B2-798',
          materialRef: 'BWP Marine Ply with fluted teak louvers & concealed warm LED strips',
          estimatedCost: 215000
        }
      ]
    }
  ],

  'ROOM-V253-KIT-01': [
    {
      id: 'V253-LAY-KIT-01',
      optionCode: 'LAYOUT_1',
      title: 'Option A: Ergonomic Parallel Culinary Galley & Utility Spine',
      tagline: '14\'6" × 9\'0" Kitchen + 9\'0" × 9\'8" Wet Utility + 5\'0" × 9\'8" Powder Room',
      priorityTheme: 'STORAGE_MAX',
      circulationScore: 94,
      storageCapacityCuFt: 290,
      minClearancePassageFt: 4.2,
      doorwayConflictDetected: false,
      windowLightBlocked: false,
      summary: 'Engineered for the exact 14\'6" × 9\'0" kitchen footprint with parallel 2ft deep Statuario quartz counters leaving a 5\'0" central culinary work aisle and direct connection to the 9\'0" × 9\'8" utility.',
      pros: ['Ergonomic work triangle between hob, sink & tall appliance bank', 'Seamless wet utility (9\'0" × 9\'8") segregation with W4 window', 'Discrete 5\'0" × 9\'8" Powder Room (D4 / W3)'],
      cons: ['Breakfast counter integrated on dining threshold'],
      whyItFitsOverall: 'Maximizes storage along the 14\'6" walls while preserving a generous 4.2ft–5.0ft central galley passage.',
      furnitureItems: [
        {
          id: 'V253-FUR-KIT-01',
          name: 'Parallel Modular Culinary Counter & Tall Appliance Bank (14\'6" Run)',
          category: 'JOINERY',
          widthFt: 14.5,
          depthFt: 2.0,
          heightFt: 7.5,
          positionXPercent: 50,
          positionYPercent: 20,
          rotationDeg: 0,
          clearanceDistanceFt: 4.5,
          whyItFits: 'Runs full 14\'6" length of the North/South kitchen walls with Hafele soft-close tandem drawers.',
          catalogueCode: 'KIT-MOD-146',
          materialRef: '20mm Statuario Quartz countertop over BWP marine ply & walnut acrylic shutters',
          estimatedCost: 385000
        }
      ]
    }
  ],

  'ROOM-V253-BED3-01': [
    {
      id: 'V253-LAY-BED3-01',
      optionCode: 'LAYOUT_1',
      title: 'Option A: First-Floor Penthouse Suite & Dual Balcony Flow',
      tagline: '20\'8" × 19\'0" Suite opening to 24\'4" × 4\'0" Front Balcony (SD1A) & Terrace (SD2A)',
      priorityTheme: 'OPEN_LIVING',
      circulationScore: 97,
      storageCapacityCuFt: 310,
      minClearancePassageFt: 4.0,
      doorwayConflictDetected: false,
      windowLightBlocked: false,
      summary: 'Tailored to Villa 253\'s largest bedroom (20\'8" × 19\'0" on First Floor). Positions the king bed for panoramic views through SD1A (12\'0") to the 24\'4" × 4\'0" front balcony, with lounge seating near SD2A (10\'0") and ensuite Toilet 3 (9\'9" × 9\'2").',
      pros: ['Unobstructed access to SD1A (12\'), SD2A (10\') and SD3A (8\') sliding portals', 'Private reading lounge within the 20\'8" span', 'Direct en-suite Toilet 3 (9\'9" × 9\'2") access via D2A'],
      cons: ['Wardrobe aligned to East wall to keep all 3 balcony sliders clear'],
      whyItFitsOverall: 'Uses the generous 20\'8" × 19\'0" (393 sq.ft) area to provide both a king sleeping zone and private upper lounge.',
      furnitureItems: [
        {
          id: 'V253-FUR-BED3-01',
          name: 'First-Floor Penthouse King Bed with Pitched Timber Headboard',
          category: 'BED',
          widthFt: 6.8,
          depthFt: 7.2,
          heightFt: 3.5,
          positionXPercent: 48,
          positionYPercent: 45,
          rotationDeg: 0,
          clearanceDistanceFt: 4.2,
          whyItFits: 'Faces SD1A (12\'0") slider and 24\'4" × 4\'0" North Balcony while clearing SD2A (10\'0").',
          catalogueCode: 'BED-B3-208',
          materialRef: 'Brushed Teak & Natural Linen Upholstered Frame',
          estimatedCost: 172000
        }
      ]
    }
  ],

  'ROOM-V253-STAIR-01': [
    {
      id: 'V253-LAY-STAIR-01',
      optionCode: 'LAYOUT_1',
      title: 'Option A: 21-Riser Dogleg Architectural Spine & Foyer Console',
      tagline: '7\'6" × 19\'0" Core • 21 Risers (11" Tread / 6.25" Riser) • W2/W2A Double-Height Glass',
      priorityTheme: 'OPEN_LIVING',
      circulationScore: 98,
      storageCapacityCuFt: 45,
      minClearancePassageFt: 3.5,
      doorwayConflictDetected: false,
      windowLightBlocked: false,
      summary: 'Preserves the exact 7\'6" × 19\'0" staircase core with two 3\'6" flight widths, 3\'6" × 7\'6" mid-landing adjacent to W2/W2A (5\'0" fixed glazing), and SD3 (5\'0" × 10\'3") North Deck portal.',
      pros: ['Full compliance with 21-riser dogleg geometry (Tread 11", Riser 6.25")', 'Daylight flooding through W2 & W2A 5\'0" fixed glass', 'Direct North Deck threshold via SD3 (5\'0" × 10\'3")'],
      cons: ['No bulky furniture placed in vertical circulation zone'],
      whyItFitsOverall: 'Maintains 3\'6" clear flight width and landing clearances per Villa 253 Wall Marking R0.',
      furnitureItems: [
        {
          id: 'V253-FUR-STAIR-01',
          name: 'Sculptural Teak & Toughened Glass Balustrade with Step LEDs (21 Risers)',
          category: 'JOINERY',
          widthFt: 7.5,
          depthFt: 19.0,
          heightFt: 3.2,
          positionXPercent: 50,
          positionYPercent: 50,
          rotationDeg: 0,
          clearanceDistanceFt: 3.5,
          whyItFits: 'Engineered specifically for the 7\'6" × 19\'0" dogleg core with 11" treads and 6.25" risers.',
          catalogueCode: 'STR-BAL-21R',
          materialRef: '2" Solid Burma Teak treads + 12mm Low-Iron Toughened Glass railing',
          estimatedCost: 245000
        }
      ]
    }
  ]
};

export const INITIAL_VILLA_253_CONCEPTS: VisualConceptVersion[] = [
  {
    id: 'VCP-V253-LIV-01',
    conceptVersionCode: 'VCP-v1.0-V253-LIV',
    projectId: 'PROJ-VILLA-253',
    floorPlanVersion: 'VILLA-253-REV0',
    roomId: 'ROOM-V253-LIV-01',
    roomName: 'Living & Dining Great Room',
    layoutOptionId: 'V253-LAY-LIV-01',
    layoutOptionName: 'Option A: Grand Entertaining & Deck Integration',
    layoutSummary: '25\'4" × 19\'0" Living Room opening onto 57\'2" Front Deck through 27ft sliding glass doors (SD1) + 8-Seater Solid Teak Dining Table',
    styleTheme: 'Modern Warm Luxury (Signature Teak, Travertine & Concealed 2700K Architectural Coves)',
    materials: [
      {
        trade: 'Flooring',
        item: 'Silver Vein-Cut Italian Travertine Vitrified Slabs (1200×600mm)',
        specification: 'First choice rectified vitrified slabs with matte satin polish',
        catalogueCode: 'FLR-TRV-120',
        costPerUnit: 185,
        unit: 'sq.ft',
        estimatedQuantity: 520,
        totalCost: 96200
      },
      {
        trade: 'Wall Paneling',
        item: 'Acoustic Fluted Solid CP Teak Wall Paneling with Concealed LED Cove',
        specification: 'Seasoned CP Teak battens over marine ply with water-based PU clear finish',
        catalogueCode: 'WAL-TEK-401',
        costPerUnit: 340,
        unit: 'sq.ft',
        estimatedQuantity: 280,
        totalCost: 95200
      },
      {
        trade: 'Ceiling & Lighting',
        item: 'Gyproc Seamless False Ceiling with 2700K Architectural Cove & Trimless Spots',
        specification: 'Saint-Gobain Gypsteel Ultra with Philips CRI 97+ 2700K LED strips and dimmable drivers',
        catalogueCode: 'CEI-GYP-27K',
        costPerUnit: 165,
        unit: 'sq.ft',
        estimatedQuantity: 480,
        totalCost: 79200
      },
      {
        trade: 'Dining Suite',
        item: 'Solid Plantation Teak 8-Seater Formal Dining Table with 8 Upholstered Chairs',
        specification: 'Live edge seasoned teakwood top with brushed bronze metal legs',
        catalogueCode: 'DIN-TBL-801',
        costPerUnit: 264000,
        unit: 'set',
        estimatedQuantity: 1,
        totalCost: 264000
      },
      {
        trade: 'Living Seating',
        item: 'Curved 5-Seater Lounge Sofa in Oatmeal Belgian Bouclé with Scotchgard',
        specification: 'High resilience pocket-spring core with stain-resistant performance bouclé',
        catalogueCode: 'FUR-SOF-501',
        costPerUnit: 145000,
        unit: 'nos',
        estimatedQuantity: 1,
        totalCost: 145000
      }
    ],
    budgetAllocated: 850000,
    budgetActualEstimated: 679600,
    renderImageUrl: '/assets/images/villa253_living_greatroom_1790833681710.jpg',
    verified2DLayoutUrl: '/assets/images/villa253_cad_blueprint_r0.svg',
    moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
    designRationale: 'Designed specifically according to Villa 253 Wall Marking R0 (10-10-24) Sheet 1/2. Capitalizes on the 27\'0" × 10\'3" aluminum sliding doors (SD1) to integrate the 57\'2" × 9\'6" front deck into the 25\'4" × 19\'0" living space.',
    lightingPlan: 'Warm 2700K concealed perimeter cove lighting + magnetic architectural downward spots + designer linear pendant over dining table.',
    colorPalette: ['#FAF7F2', '#D8CAB8', '#5E4028', '#A88947', '#E4DCD0'],
    clientFeedbackHistory: [],
    status: 'CLIENT_APPROVED',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z'
  },
  {
    id: 'VCP-V253-BED1-01',
    conceptVersionCode: 'VCP-v1.0-V253-BED1',
    projectId: 'PROJ-VILLA-253',
    floorPlanVersion: 'VILLA-253-REV0',
    roomId: 'ROOM-V253-BED1-01',
    roomName: 'Master Bedroom 1 Suite & Walk-in Closet',
    layoutOptionId: 'V253-LAY-BED1-01',
    layoutOptionName: 'Option A: Executive Resort Master Sanctuary',
    layoutSummary: '14\'0" × 19\'0" Master Suite with King Platform Bed + 10\'2" × 11\'9" Walk-In Wardrobe + 24\'9" Ensuite Bath',
    styleTheme: 'Modern Warm Luxury (Natural Smoked Oak, Fluted Headboard, Warm 2700K Coves)',
    materials: [
      {
        trade: 'Master Bed',
        item: 'Solid White Oak King Platform Bed with Fluted Acoustic Backing',
        specification: 'Seasoned oak carcass with soft-close under-bed storage drawers',
        catalogueCode: 'BED-KNG-601',
        costPerUnit: 165000,
        unit: 'nos',
        estimatedQuantity: 1,
        totalCost: 165000
      },
      {
        trade: 'Walk-in Wardrobe',
        item: 'Bespoke Smoked Glass & Warm Oak Walk-In Wardrobe (10\'2" × 11\'9" - 36 r.ft)',
        specification: '18mm BWP marine ply carcass with Hafele sensor warm LED profiles',
        catalogueCode: 'WRD-WIW-36',
        costPerUnit: 320000,
        unit: 'set',
        estimatedQuantity: 1,
        totalCost: 320000
      }
    ],
    budgetAllocated: 600000,
    budgetActualEstimated: 485000,
    renderImageUrl: '/assets/images/villa253_master_suite_1790833696550.jpg',
    verified2DLayoutUrl: '/assets/images/villa253_cad_blueprint_r0.svg',
    moodboardImageUrl: '/assets/images/villa253_master_bedroom_1790830829821.jpg',
    designRationale: 'Master Suite (14\'0" × 19\'0") oriented towards private 11\'6" × 4\'6" terrace deck (SD2 12\'0" × 10\'3"). Includes dedicated 10\'2" × 11\'9" walk-in wardrobe (SD7) and 6\'0" × 24\'9" Toilet 1 (D2).',
    lightingPlan: 'Warm 2700K concealed backlighting behind headboard + brass bedside reading sconces + internal wardrobe sensor lights.',
    colorPalette: ['#FAF7F2', '#D8CAB8', '#5E4028', '#A88947', '#E4DCD0'],
    clientFeedbackHistory: [],
    status: 'CLIENT_APPROVED',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z'
  },
  {
    id: 'VCP-V253-BED2-01',
    conceptVersionCode: 'VCP-v1.0-V253-BED2',
    projectId: 'PROJ-VILLA-253',
    floorPlanVersion: 'VILLA-253-REV0',
    roomId: 'ROOM-V253-BED2-01',
    roomName: 'Bedroom 2 & Bar Deck Suite',
    layoutOptionId: 'V253-LAY-BED2-01',
    layoutOptionName: 'Option A: East Bar-Deck & North Garden Suite',
    layoutSummary: '18\'11" × 19\'0" East Suite opening to 14\'0" × 30\'10" Bar Deck (SD6) & North Deck (SD2) + 7\'9" × 9\'8" Wardrobe',
    styleTheme: 'East-Wing Garden Suite (Teak Louvers, Terrazzo & Limewash Plaster)',
    materials: [
      {
        trade: 'Bedroom 2 Suite Bed',
        item: 'King Teak & Rattan Cane Platform Bed with Floating Side Tables',
        specification: 'Seasoned CP Teak frame calibrated for the 18\'11" × 19\'0" suite',
        catalogueCode: 'BED-B2-650',
        costPerUnit: 148000,
        unit: 'nos',
        estimatedQuantity: 1,
        totalCost: 148000
      },
      {
        trade: 'Dressing Vestibule',
        item: 'Louvered Teak Wardrobe in 7\'9" × 9\'8" Vestibule leading to Toilet 2 (10\'4" × 9\'8")',
        specification: 'BWP Marine Ply with soft-close hinges and internal sensor lighting',
        catalogueCode: 'WRD-B2-798',
        costPerUnit: 215000,
        unit: 'set',
        estimatedQuantity: 1,
        totalCost: 215000
      }
    ],
    budgetAllocated: 480000,
    budgetActualEstimated: 363000,
    renderImageUrl: '/assets/images/villa253_guest_suite_1790833711200.jpg',
    verified2DLayoutUrl: '/assets/images/villa253_cad_blueprint_r0.svg',
    moodboardImageUrl: '/assets/images/villa253_guest_suite_1790833711200.jpg',
    designRationale: 'Calibrated strictly to Bedroom 2 (18\'11" × 19\'0", 359 sq.ft) with dual sliding portals SD2 (12\'0" North Deck) and SD6 (9\'0" Bar Unit Deck 14\'0" × 30\'10").',
    lightingPlan: 'Recessed warm 2700K architectural downlights + woven bedside pendant luminaires.',
    colorPalette: ['#F5F2EB', '#C8B69E', '#6E472B', '#2C3539', '#D9CFC1'],
    clientFeedbackHistory: [],
    status: 'CLIENT_APPROVED',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z'
  },
  {
    id: 'VCP-V253-KIT-01',
    conceptVersionCode: 'VCP-v1.0-V253-KIT',
    projectId: 'PROJ-VILLA-253',
    floorPlanVersion: 'VILLA-253-REV0',
    roomId: 'ROOM-V253-KIT-01',
    roomName: 'Culinary Kitchen, Utility & Powder Wing',
    layoutOptionId: 'V253-LAY-KIT-01',
    layoutOptionName: 'Option A: Ergonomic Parallel Culinary Galley & Utility Spine',
    layoutSummary: '14\'6" × 9\'0" Kitchen with Parallel Statuario Quartz Counters + 9\'0" × 9\'8" Utility + 5\'0" × 9\'8" Powder',
    styleTheme: 'Bespoke Culinary Atelier (Statuario Quartz, Fluted Walnut & Cashmere Lacquer)',
    materials: [
      {
        trade: 'Modular Kitchen Joinery',
        item: 'Parallel 14\'6" × 9\'0" Modular Kitchen with Hafele Tandem Hardware & Tall Unit',
        specification: 'BWP Marine Plywood carcass with anti-fingerprint matte acrylic & fluted walnut',
        catalogueCode: 'KIT-MOD-146',
        costPerUnit: 385000,
        unit: 'set',
        estimatedQuantity: 1,
        totalCost: 385000
      },
      {
        trade: 'Countertop & Utility',
        item: '20mm Statuario Quartz Countertop + 9\'0" × 9\'8" Wet Utility Laundry Counter',
        specification: 'Non-porous engineered quartz slab with double undermount sound-deadened sink',
        catalogueCode: 'QTZ-STA-20',
        costPerUnit: 135000,
        unit: 'set',
        estimatedQuantity: 1,
        totalCost: 135000
      }
    ],
    budgetAllocated: 600000,
    budgetActualEstimated: 520000,
    renderImageUrl: '/assets/images/villa253_kitchen_utility_14x9_r0.svg',
    verified2DLayoutUrl: '/assets/images/villa253_cad_blueprint_r0.svg',
    moodboardImageUrl: '/assets/images/villa253_kitchen_utility_14x9_r0.svg',
    designRationale: 'Built around the exact 14\'6" × 9\'0" kitchen dimensions on the South-Central spine, linking directly to the 9\'0" × 9\'8" Utility room (W4 3\'0"×4\'0") and 5\'0" × 9\'8" Powder Room (D4 / W3).',
    lightingPlan: '3000K CRI 97+ under-cabinet linear task LED profiles + recessed anti-glare ceiling spots.',
    colorPalette: ['#F6F3EC', '#DED6C6', '#5C3A21', '#1E293B', '#94A3B8'],
    clientFeedbackHistory: [],
    status: 'CLIENT_APPROVED',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z'
  },
  {
    id: 'VCP-V253-BED3-01',
    conceptVersionCode: 'VCP-v1.0-V253-BED3',
    projectId: 'PROJ-VILLA-253',
    floorPlanVersion: 'VILLA-253-REV0',
    roomId: 'ROOM-V253-BED3-01',
    roomName: 'First Floor Bedroom 3 & Balconies',
    layoutOptionId: 'V253-LAY-BED3-01',
    layoutOptionName: 'Option A: First-Floor Penthouse Suite & Dual Balcony Flow',
    layoutSummary: '20\'8" × 19\'0" First Floor Suite + 24\'4" × 4\'0" Front Balcony (SD1A) + 9\'9" × 9\'2" Toilet 3',
    styleTheme: 'Elevated Pitched-Roof Suite (Exposed Timber Rafters, Brushed Teak & Panoramic Glazing)',
    materials: [
      {
        trade: 'First Floor Suite Bed',
        item: 'Penthouse King Platform Bed with Pitched-Ceiling Acoustic Paneling',
        specification: 'Custom proportioned for the 20\'8" × 19\'0" (393 sq.ft) First Floor bedroom',
        catalogueCode: 'BED-B3-208',
        costPerUnit: 172000,
        unit: 'nos',
        estimatedQuantity: 1,
        totalCost: 172000
      },
      {
        trade: 'Wardrobe & Balcony Threshold',
        item: 'Full-Height Teak & Fluted Glass Wardrobe + Weatherproof Balcony Decking (24\'4" × 4\'0")',
        specification: 'Integrated with SD1A (12\'), SD2A (10\'), SD3A (8\') sliders and Toilet 3 (9\'9" × 9\'2")',
        catalogueCode: 'WRD-B3-393',
        costPerUnit: 248000,
        unit: 'set',
        estimatedQuantity: 1,
        totalCost: 248000
      }
    ],
    budgetAllocated: 550000,
    budgetActualEstimated: 420000,
    renderImageUrl: '/assets/images/villa253_bedroom3_firstfloor_20x19_r0.svg',
    verified2DLayoutUrl: '/assets/images/villa253_cad_blueprint_r0.svg',
    moodboardImageUrl: '/assets/images/villa253_bedroom3_firstfloor_20x19_r0.svg',
    designRationale: 'Calibrated to Sheet 1/2 First Floor Plan: 20\'8" × 19\'0" Bedroom 3 with wrap-around 24\'4" × 4\'0" North Balcony (SD1A 12\'), 14\'10" × 4\'0" Side Balcony, and 9\'9" × 9\'2" Toilet 3 (D2A).',
    lightingPlan: 'Warm 2700K rafter uplighting + recessed trimless spots + balcony step markers.',
    colorPalette: ['#F3EFE6', '#D4C3AE', '#4A2C11', '#38BDF8', '#1E293B'],
    clientFeedbackHistory: [],
    status: 'CLIENT_APPROVED',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z'
  },
  {
    id: 'VCP-V253-STAIR-01',
    conceptVersionCode: 'VCP-v1.0-V253-STAIR',
    projectId: 'PROJ-VILLA-253',
    floorPlanVersion: 'VILLA-253-REV0',
    roomId: 'ROOM-V253-STAIR-01',
    roomName: 'Architectural Staircase & Double-Height Core',
    layoutOptionId: 'V253-LAY-STAIR-01',
    layoutOptionName: 'Option A: 21-Riser Dogleg Architectural Spine & Foyer Console',
    layoutSummary: '7\'6" × 19\'0" Staircase Core • 21 Risers (Tread 11", Riser 6.25") • W2/W2A Fixed Glazing & SD3 Portal',
    styleTheme: 'Sculptural Vertical Spine (Solid Burma Teak Treads, 12mm Toughened Glass & Step LEDs)',
    materials: [
      {
        trade: 'Staircase Treads & Balustrade',
        item: '21-Riser Solid Burma Teak Treads (11" Tread × 3\'6" Flight) & 12mm Toughened Glass Railing',
        specification: 'Matches R0 drawing staircase schedule: 21 risers, 6.25" riser height, 3\'6" waist & mid-landing slab',
        catalogueCode: 'STR-BAL-21R',
        costPerUnit: 245000,
        unit: 'set',
        estimatedQuantity: 1,
        totalCost: 245000
      }
    ],
    budgetAllocated: 300000,
    budgetActualEstimated: 245000,
    renderImageUrl: '/assets/images/villa253_staircase_core_7x19_r0.svg',
    verified2DLayoutUrl: '/assets/images/villa253_cad_blueprint_r0.svg',
    moodboardImageUrl: '/assets/images/villa253_staircase_core_7x19_r0.svg',
    designRationale: 'Strictly engineered to the 7\'6" × 19\'0" central staircase bay between Bedroom 1 (14\'0" × 19\'0") and Living & Dining (25\'4" × 19\'0"), with W2 & W2A (5\'0" × Mid-Landing) double-height glazing.',
    lightingPlan: 'Concealed 2700K LED nosing profiles under all 21 treads + double-height chandelier drop.',
    colorPalette: ['#F5F2EB', '#9A5B25', '#CBD5E1', '#F59E0B', '#0F172A'],
    clientFeedbackHistory: [],
    status: 'CLIENT_APPROVED',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z'
  },
  {
    id: 'VCP-V253-GAZEBO-01',
    conceptVersionCode: 'VCP-v1.0-V253-GAZ',
    projectId: 'PROJ-VILLA-253',
    floorPlanVersion: 'VILLA-253-REV0',
    roomId: 'ROOM-V253-GAZEBO-01',
    roomName: 'Signature Roof Gazebo Terrace Pavilion',
    layoutOptionId: 'V253-LAY-GAZ-01',
    layoutOptionName: 'Option A: Sunset Cocktail Pergola & Sky Daybeds',
    layoutSummary: '24\'0" × 18\'0" Pitched Timber Roof Gazebo with Outdoor Teak Lounge + 4-Stool Cocktail Bar Counter',
    styleTheme: 'Signature Roof Gazebo & Bar Lounge (Weatherproof Teak Pergola & Ambient Lanterns)',
    materials: [
      {
        trade: 'Timber Gazebo',
        item: 'Pitched Hardwood Timber Gazebo Structure & Rafters with Weather Treatment',
        specification: 'Seasoned Malaysian Sal / Teak wood rafters with anti-fungal UV sealer',
        catalogueCode: 'GZB-TMB-241',
        costPerUnit: 280000,
        unit: 'set',
        estimatedQuantity: 1,
        totalCost: 280000
      },
      {
        trade: 'Outdoor Bar',
        item: 'Honed Jet Black Granite Cocktail Bar Counter with Weatherproof Cabinetry',
        specification: 'Marine ply carcass clad in fluted teak with undermount stainless steel bar sink',
        catalogueCode: 'BAR-OUT-801',
        costPerUnit: 165000,
        unit: 'nos',
        estimatedQuantity: 1,
        totalCost: 165000
      },
      {
        trade: 'Outdoor Lounge',
        item: 'Teak Sectional Daybed with Sunbrella Weatherproof Upholstery',
        specification: 'High density reticulated quick-dry foam with 5-year UV fade warranty',
        catalogueCode: 'FUR-OUT-SEC',
        costPerUnit: 195000,
        unit: 'nos',
        estimatedQuantity: 1,
        totalCost: 195000
      }
    ],
    budgetAllocated: 750000,
    budgetActualEstimated: 640000,
    renderImageUrl: '/assets/images/villa253_gazebo_terrace_1790833723445.jpg',
    verified2DLayoutUrl: '/assets/images/villa253_cad_blueprint_r0.svg',
    moodboardImageUrl: '/assets/images/villa253_roof_gazebo_1790830815235.jpg',
    designRationale: 'Directly mirrors the signature triangular roof gazebo shown in Villa 253 blueprint Section BB\' (12\'9" ridge height) and rear elevation.',
    lightingPlan: 'Warm 2400K hanging woven lantern luminaires + concealed rafter grazing strips + IP65 floor step lights.',
    colorPalette: ['#FAF5EE', '#7D4F27', '#5C381E', '#2B2520', '#C9BAA7'],
    clientFeedbackHistory: [],
    status: 'CLIENT_APPROVED',
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z'
  }
];

export const VILLA_253_SPATIAL_SESSION: TwoStepSpatialDesignSession = {
  projectId: 'PROJ-VILLA-253',
  projectTitle: 'Villa 253 (24 Type - 3BHK with Roof Gazebo - North Facing)',
  customerInput: {
    floorPlanFileName: 'VILLA_253_WALL_MARKING_10_10_24_REV0.pdf',
    floorPlanFileUrl: '/assets/images/villa253_cad_blueprint_r0.svg',
    fileType: 'PDF',
    uploadDate: '2026-10-10',
    scaleText: '1:50 Metric Scale (Verified from Page 1-2 & 2-2)',
    isScaleVerified: true,
    siteLocation: 'Villa 253, North Facing Plot, Prime Green Enclave',
    propertyType: '4BHK_VILLA',
    totalCarpetAreaSqFt: 2840,
    roomsToDesign: [
      'Living & Dining Great Room (25\'4" × 19\'0")',
      'Master Bedroom 1 Suite & Walk-in Closet (14\'0" × 19\'0")',
      'Bedroom 2 & Bar Deck Suite (18\'11" × 19\'0")',
      'Culinary Kitchen, Utility & Powder Wing (14\'6" × 9\'0")',
      'First Floor Bedroom 3 & Balconies (20\'8" × 19\'0")',
      'Signature Roof Gazebo Terrace Pavilion (24\'0" × 18\'0")',
      'Architectural Staircase Core (7\'6" × 19\'0")'
    ],
    approximateBudget: 4500000, // ₹45 Lakh turnkey interior budget
    preferredStyle: 'Modern Warm Luxury & Biophilic Tropical Eco-Luxe',
    referenceImages: [
      {
        id: 'REF-V253-01',
        title: 'Villa 253 Living & 57ft Deck Flow',
        imageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
        tags: ['27ft Glass Slider SD1', 'Travertine', 'Teak Accents', '2700K Coves']
      },
      {
        id: 'REF-V253-02',
        title: 'Villa 253 Signature Roof Gazebo Pavilion',
        imageUrl: '/assets/images/villa253_roof_gazebo_1790830815235.jpg',
        tags: ['Roof Gazebo Section BB\'', 'Timber Rafters', 'Cocktail Bar', 'Sky Daybed']
      },
      {
        id: 'REF-V253-03',
        title: 'Villa 253 Master Suite & Walk-in Closet',
        imageUrl: '/assets/images/villa253_master_bedroom_1790830829821.jpg',
        tags: ['Master Bedroom 1', 'Private Deck', 'Glass Wardrobe', 'Ensuite Bath']
      }
    ],
    fixedRequirements: [
      'Seamless integration between the 25\'4" × 19\'0" Living Room and the 57\'2" Front Deck through the 27ft sliding doors (SD1)',
      'Respect the distinctive pitched timber Roof Gazebo structure specified in Section BB\' with outdoor cocktail bar',
      'Full-height walk-in wardrobe (10\'2" × 11\'9") in Master Bedroom 1 with glass vitrines and warm lighting',
      'Strict minimum 3.5ft walk clearance along all sliding doors and primary circulation routes',
      'Provide interactive theme options with instant customization for colors, materials, lighting, and furniture'
    ],
    siteSurveyStatus: 'SITE_SURVEYED_VERIFIED',
    siteSurveyDate: '2026-10-12',
    siteSurveyorName: 'Er. Rajesh Verma (Lead Structural & Survey Engineer)',
    siteSurveyNotes: 'Laser dimension audit confirmed: Outer building footprint exactly 85\'-5" × 20\'-4" matching architectural blueprint Page 1-2. Plinth height 1\'6" above finished ground level. Roof Gazebo ridge beam height verified at 12\'9" above first floor slab level.'
  },
  planGeometry: {
    planVersion: 'VILLA-253-REV0',
    verifiedScale: '1:50 Metric Scale (Dimensions confirmed in feet & inches)',
    isDesignerVerified: true,
    designerVerifiedBy: 'Ar. Aniket Joshi & Er. Rajesh Verma',
    designerVerifiedDate: '2026-10-10',
    rooms: VILLA_253_ROOMS
  },
  activeRoomId: 'ROOM-V253-LIV-01',
  layoutOptionsByRoom: VILLA_253_LAYOUTS_BY_ROOM,
  selectedLayoutIdByRoom: {
    'ROOM-V253-LIV-01': 'V253-LAY-LIV-01',
    'ROOM-V253-BED1-01': 'V253-LAY-BED1-01',
    'ROOM-V253-BED2-01': 'V253-LAY-BED2-01',
    'ROOM-V253-KIT-01': 'V253-LAY-KIT-01',
    'ROOM-V253-BED3-01': 'V253-LAY-BED3-01',
    'ROOM-V253-STAIR-01': 'V253-LAY-STAIR-01',
    'ROOM-V253-GAZEBO-01': 'V253-LAY-GAZ-01'
  },
  conceptVersions: INITIAL_VILLA_253_CONCEPTS,
  activeConceptVersionId: 'VCP-V253-LIV-01',
  isBoqLinked: true,
  boqLinkedAt: '2026-10-10T12:00:00Z',
  updatedAt: '2026-10-10T12:00:00Z'
};
