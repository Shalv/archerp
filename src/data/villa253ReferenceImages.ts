/**
 * Build Storys ERP - Villa 253 Reference Architectural & Interior Visual Gallery
 * Calibrated strictly to VILLA 253 - NORTH FACING - 24 TYPE - 3 BEDROOM WITH ROOF GAZEBO (Wall Marking R0, 10-10-24)
 *
 * Key Fixes Applied:
 * 1. Removed the 'ALL' roomId mapping that previously caused exterior/living images to appear across every room.
 * 2. Corrected room IDs so they match Villa 253's canonical room IDs:
 *    - Living & Dining: ROOM-V253-LIV-01 (25'-4" × 19'-0")
 *    - Bedroom 1 (Master): ROOM-V253-BED1-01 (14'-0" × 19'-0")
 *    - Bedroom 2 Suite: ROOM-V253-BED2-01 (18'-11" × 19'-0")
 *    - Bedroom 3 (First Floor): ROOM-V253-BED3-01 (20'-8" × 19'-0")
 *    - Kitchen, Utility & Powder: ROOM-V253-KIT-01 (14'-6" × 9'-0")
 *    - Staircase Core: ROOM-V253-STAIR-01 (7'-6" × 19'-0", 21 Risers)
 *    - Roof Gazebo Pavilion: ROOM-V253-GAZEBO-01 (24'-0" × 18'-0")
 * 3. Added strict URL de-duplication so no two cards or rooms ever repeat the same image URL.
 * 4. Removed the fallback that returned Living Room image [0] when a room was unmatched.
 */

export type CanonicalVilla253RoomId =
  | 'ROOM-V253-LIV-01'
  | 'ROOM-V253-BED1-01'
  | 'ROOM-V253-BED2-01'
  | 'ROOM-V253-BED3-01'
  | 'ROOM-V253-KIT-01'
  | 'ROOM-V253-STAIR-01'
  | 'ROOM-V253-GAZEBO-01'
  | 'EXTERIOR-FACADE';

export interface Villa253ReferenceImage {
  id: string;
  title: string;
  subtitle: string;
  roomId: CanonicalVilla253RoomId;
  roomName: string;
  dimensions: string;
  imageUrl: string;
  fallbackUrl: string;
  styleTag: string;
  architecturalNotes: string[];
  materialHighlights: string[];
}

/**
 * Normalizes legacy or mismatched room IDs/names to canonical Villa 253 R0 room IDs.
 */
export function resolveCanonicalVilla253RoomId(
  roomIdOrName?: string,
  roomCategory?: string
): CanonicalVilla253RoomId {
  const raw = (roomIdOrName || '').trim().toUpperCase();
  const cat = (roomCategory || '').trim().toUpperCase();

  // Direct canonical or legacy ID matches
  if (raw === 'ROOM-V253-LIV-01' || raw === 'ROOM-V253-GF-LIV') return 'ROOM-V253-LIV-01';
  if (raw === 'ROOM-V253-BED1-01' || raw === 'ROOM-V253-GF-BED1') return 'ROOM-V253-BED1-01';
  if (raw === 'ROOM-V253-BED2-01' || raw === 'ROOM-V253-GF-BED2') return 'ROOM-V253-BED2-01';
  if (raw === 'ROOM-V253-BED3-01' || raw === 'ROOM-V253-FF-BED3') return 'ROOM-V253-BED3-01';
  if (raw === 'ROOM-V253-KIT-01' || raw === 'ROOM-V253-GF-KIT') return 'ROOM-V253-KIT-01';
  if (raw === 'ROOM-V253-STAIR-01' || raw === 'ROOM-V253-GF-STAIR') return 'ROOM-V253-STAIR-01';
  if (raw === 'ROOM-V253-GAZEBO-01' || raw === 'ROOM-V253-RF-GAZ') return 'ROOM-V253-GAZEBO-01';
  if (raw === 'EXTERIOR-FACADE') return 'EXTERIOR-FACADE';

  // Semantic name matching (checking specific bedroom numbers before generic bedroom)
  if (raw.includes('BEDROOM 3') || raw.includes('BED3') || raw.includes('FIRST FLOOR BED')) {
    return 'ROOM-V253-BED3-01';
  }
  if (raw.includes('BEDROOM 2') || raw.includes('BED2') || raw.includes('GUEST') || raw.includes('BAR DECK')) {
    return 'ROOM-V253-BED2-01';
  }
  if (raw.includes('BEDROOM 1') || raw.includes('BED1') || raw.includes('MASTER')) {
    return 'ROOM-V253-BED1-01';
  }
  if (raw.includes('GAZEBO') || raw.includes('TERRACE') || raw.includes('ROOF') || cat === 'TERRACE') {
    return 'ROOM-V253-GAZEBO-01';
  }
  if (raw.includes('KITCHEN') || raw.includes('UTILITY') || raw.includes('CULINARY') || cat === 'KITCHEN') {
    return 'ROOM-V253-KIT-01';
  }
  if (raw.includes('STAIR') || raw.includes('FOYER') || cat === 'STAIRCASE') {
    return 'ROOM-V253-STAIR-01';
  }
  if (raw.includes('FACADE') || raw.includes('EXTERIOR')) {
    return 'EXTERIOR-FACADE';
  }
  if (cat === 'BEDROOM') {
    return 'ROOM-V253-BED1-01';
  }

  return 'ROOM-V253-LIV-01';
}

/**
 * De-duplicates an array of reference images or URLs by normalized imageUrl.
 */
export function deduplicateReferenceImages<T extends { imageUrl: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const key = (item.imageUrl || '').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

export function deduplicateImageUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    const clean = (u || '').trim();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    out.push(clean);
  }
  return out;
}

export const VILLA_253_REFERENCE_IMAGES: Villa253ReferenceImage[] = [
  // 1. LIVING & DINING GREAT ROOM (25'-4" x 19'-0")
  {
    id: 'V253-IMG-LIV-01',
    title: 'Living & Dining Great Room — Exposed Timber Truss View',
    subtitle: 'Ground Floor Central Spine • SD1 27\'-0" × 10\'-3" North Deck Portal',
    roomId: 'ROOM-V253-LIV-01',
    roomName: 'Living & Dining Great Room',
    dimensions: "25'-4\" × 19'-0\" (481 sq.ft)",
    imageUrl: '/assets/images/villa253_living_greatroom_1790833681710.jpg',
    fallbackUrl: '/images/villa253_living_greatroom_1790833681710.jpg',
    styleTag: 'Tropical Contemporary Chalet',
    architecturalNotes: [
      '25\'-4" × 19\'-0" column-free span connecting 57\'-2" × 9\'-6" North Front Deck (SD1) and 13\'-0" × 9\'-6" Rear Deck (SD5)',
      '10\'-3" structural beam soffit with FW1 (15\'-9" × 1\'-3") clerestory ribbon glazing',
      'Integrated 8-seater bespoke Burma teak dining table & low-slung modular linen sectional'
    ],
    materialHighlights: [
      'Honed Beige Travertine Large-Format Slab Flooring',
      'Exposed Teak Rafters with Recessed Linear Warm LED Grazing',
      'Slimline Charcoal Anodized Aluminum Sliding Frames (SD1 27\'-0" × 10\'-3")'
    ]
  },
  {
    id: 'V253-IMG-LIV-02',
    title: 'Living & Dining Great Room — Modern Daylight Clerestory Perspective',
    subtitle: 'Ground Floor • FW1 15\'-9" × 1\'-3" Clerestory & Dual Deck Cross-Ventilation',
    roomId: 'ROOM-V253-LIV-01',
    roomName: 'Living & Dining Great Room',
    dimensions: "25'-4\" × 19'-0\" (481 sq.ft)",
    imageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
    fallbackUrl: '/images/villa253_living_modern_1790830799942.jpg',
    styleTag: 'Warm Minimalist Luxury',
    architecturalNotes: [
      'Direct sightline across the 25\'-4" × 19\'-0" Great Room toward the 57\'-2" × 9\'-6" Front Deck',
      'Acoustic timber slat ceiling planes with concealed HVAC linear slot diffusers',
      'Custom floating credenza aligned with East feature wall and W1 (1\'-6" × 9\'-1") slit window'
    ],
    materialHighlights: [
      'Quarter-Sawn Natural Oak Acoustic Ceiling Baffles',
      'Hand-Troweled Micro-Cement Feature Wall',
      'Bouclé & Saddle Leather Lounge Seating'
    ]
  },

  // 2. BEDROOM 1 — MASTER SUITE (14'-0" x 19'-0")
  {
    id: 'V253-IMG-BED1-01',
    title: 'Master Bedroom 1 Suite — Private North Deck & Garden Portal',
    subtitle: 'Ground Floor West Wing • SD2 (12\'-0" × 10\'-3") & SD4 (10\'-0" × 10\'-3") Sliders',
    roomId: 'ROOM-V253-BED1-01',
    roomName: 'Master Bedroom 1 Suite & Walk-in Closet',
    dimensions: "14'-0\" × 19'-0\" + 10'-2\" × 11'-9\" Wardrobe + 14'-0\" × 7'-0\" Toilet 1",
    imageUrl: '/assets/images/villa253_master_suite_1790833696550.jpg',
    fallbackUrl: '/images/villa253_master_suite_1790833696550.jpg',
    styleTag: 'Resort Master Sanctuary',
    architecturalNotes: [
      '14\'-0" × 19\'-0" master sleeping zone opening onto private 11\'-6" × 4\'-6" deck via SD2 (12\'-0" × 10\'-3")',
      'Dedicated 10\'-2" × 11\'-9" walk-in wardrobe accessed via SD7 (7\'-0" × 10\'-3") with W6 (2\'-6" × 6\'-6") window',
      'En-suite Toilet 1 (6\'-0" × 24\'-9" / 14\'-0" × 7\'-0" wet/dry zone) entered via D2 (3\'-6" × 10\'-3")'
    ],
    materialHighlights: [
      'Smoked European Oak Engineered Plank Flooring',
      'Woven Cane & Solid Teak Headboard Wall Panelling',
      'Fluted Bronze Glass Walk-In Wardrobe Partition (SD7)'
    ]
  },
  {
    id: 'V253-IMG-BED1-02',
    title: 'Master Bedroom 1 — Evening Ambient & Walk-in Wardrobe Axis',
    subtitle: 'Ground Floor West Wing • D1 (4\'-0" × 10\'-3") Entry & SD7 Wardrobe Portal',
    roomId: 'ROOM-V253-BED1-01',
    roomName: 'Master Bedroom 1 Suite & Walk-in Closet',
    dimensions: "14'-0\" × 19'-0\" (266 sq.ft)",
    imageUrl: '/assets/images/villa253_master_bedroom_1790830829821.jpg',
    fallbackUrl: '/images/villa253_master_bedroom_1790830829821.jpg',
    styleTag: 'Contemporary Teak & Linen',
    architecturalNotes: [
      'Warm cove lighting highlighting the 10\'-3" clear ceiling height in the 14\'-0" × 19\'-0" suite',
      'Acoustic upholstered headboard wall backing onto Toilet 1 masonry spine',
      'Seamless threshold to 10\'-2" × 11\'-9" dressing room and 11\'-6" × 4\'-6" private deck'
    ],
    materialHighlights: [
      'Warm Grey Linen Upholstered Wall Panels',
      'Brushed Champagne Brass Pendant & Reading Sconces',
      'Motorized Sheer & Blackout Drapery Track in Ceiling Pelmet'
    ]
  },

  // 3. BEDROOM 2 SUITE (18'-11" x 19'-0")
  {
    id: 'V253-IMG-BED2-01',
    title: 'Bedroom 2 Suite — East Bar Deck & North Front Deck Access',
    subtitle: 'Ground Floor East Wing • SD2 (12\'-0" × 10\'-3") & SD6 (9\'-0" × 10\'-3") Sliders',
    roomId: 'ROOM-V253-BED2-01',
    roomName: 'Bedroom 2 & Bar Deck Suite',
    dimensions: "18'-11\" × 19'-0\" + 7'-9\" × 9'-8\" Wardrobe + 10'-4\" × 9'-8\" Toilet 2",
    imageUrl: '/assets/images/villa253_guest_suite_1790833711200.jpg',
    fallbackUrl: '/images/villa253_guest_suite_1790833711200.jpg',
    styleTag: 'East-Wing Garden Suite',
    architecturalNotes: [
      'Generous 18\'-11" × 19\'-0" (359 sq.ft) suite with dual aspect onto North Deck (SD2 12\') and East Bar Unit Deck (SD6 9\')',
      'Dedicated 7\'-9" × 9\'-8" recessed wardrobe vestibule leading to 10\'-4" × 9\'-8" Toilet 2 (D3 3\'-3" × 7\'-8")',
      'W5 (1\'-6" × 6\'-6") architectural vertical window for natural cross-breeze'
    ],
    materialHighlights: [
      'Warm Terrazzo & Honed Kota Stone Border Inlay',
      'Custom Teak Louvered Wardrobe Shutters',
      'Acoustic Limewash Plaster Walls in Warm Sand Tone'
    ]
  },

  // 4. BEDROOM 3 — FIRST FLOOR SUITE (20'-8" x 19'-0")
  {
    id: 'V253-IMG-BED3-01',
    title: 'First Floor Bedroom 3 Suite — Dual Balcony & Terrace Overlook',
    subtitle: 'First Floor Level (+11\'-6") • SD1A (12\'), SD2A (10\') & SD3A (8\') Portals',
    roomId: 'ROOM-V253-BED3-01',
    roomName: 'First Floor Bedroom 3 & Balconies',
    dimensions: "20'-8\" × 19'-0\" + 9'-9\" × 9'-2\" Toilet 3 + 24'-4\" × 4'-0\" Balcony",
    imageUrl: '/assets/images/villa253_bedroom3_firstfloor_20x19_r0.svg',
    fallbackUrl: '/assets/images/villa253_bedroom3_firstfloor_20x19_r0.svg',
    styleTag: 'Elevated Pitched-Roof Suite',
    architecturalNotes: [
      'Largest bedroom footprint at 20\'-8" × 19\'-0" (393 sq.ft) on the First Floor',
      'Opens to 24\'-4" × 4\'-0" North Front Balcony via SD1A (12\'-0" × Beam Bottom) and 14\'-10" × 4\'-0" Side Balcony',
      'Includes en-suite Toilet 3 (9\'-9" × 9\'-2") via D2A (3\'-6") and direct terrace access toward the Roof Gazebo'
    ],
    materialHighlights: [
      'Pitched Timber Ceiling with Exposed Rafters & Skylight Glazing',
      'Wide-Plank Brushed Teak Flooring with Brass Thresholds',
      'Laminated Low-E Double Glazed Sliding Doors (SD1A / SD2A / SD3A)'
    ]
  },

  // 5. KITCHEN, UTILITY & POWDER WING (14'-6" x 9'-0")
  {
    id: 'V253-IMG-KIT-01',
    title: 'Culinary Kitchen, Utility & Powder Wing — Ergonomic Parallel Galley',
    subtitle: 'Ground Floor South-Central Wing • 14\'-6" × 9\'-0" Kitchen + 9\'-0" × 9\'-8" Utility',
    roomId: 'ROOM-V253-KIT-01',
    roomName: 'Culinary Kitchen, Utility & Powder Wing',
    dimensions: "14'-6\" × 9'-0\" Kitchen + 9'-0\" × 9'-8\" Utility + 5'-0\" × 9'-8\" Powder",
    imageUrl: '/assets/images/villa253_kitchen_utility_14x9_r0.svg',
    fallbackUrl: '/assets/images/villa253_kitchen_utility_14x9_r0.svg',
    styleTag: 'Bespoke Culinary Atelier',
    architecturalNotes: [
      '14\'-6" × 9\'-0" precision kitchen directly serving the 25\'-4" × 19\'-0" Living & Dining Great Room',
      'Adjoining 9\'-0" × 9\'-8" wet utility room with W4 (3\'-0" × 4\'-0") window and laundry/dishwashing zone',
      'Discrete 5\'-0" × 9\'-8" guest powder room with D4 (3\'-0" × 7\'-8") door and W3 (1\'-3" × 5\'-7") ventilator'
    ],
    materialHighlights: [
      '20mm Statuario Quartz Countertop & Full-Height Backsplash',
      'Fluted Walnut & Matte Cashmere Lacquer Handleless Cabinetry',
      'Brushed Gunmetal Sink Mixer & Integrated Baffle Chimney Hood'
    ]
  },

  // 6. STAIRCASE CORE (7'-6" x 19'-0")
  {
    id: 'V253-IMG-STAIR-01',
    title: 'Architectural Staircase Core — 21 Risers & Double-Height Glazing',
    subtitle: 'Central Spine • 7\'-6" × 19\'-0" Core • W2/W2A (5\'-0") & SD3 (5\'-0" × 10\'-3")',
    roomId: 'ROOM-V253-STAIR-01',
    roomName: 'Architectural Staircase & Double-Height Core',
    dimensions: "7'-6\" × 19'-0\" (21 Risers • Tread 11\" • Riser 6.25\")",
    imageUrl: '/assets/images/villa253_staircase_core_7x19_r0.svg',
    fallbackUrl: '/assets/images/villa253_staircase_core_7x19_r0.svg',
    styleTag: 'Sculptural Vertical Spine',
    architecturalNotes: [
      '7\'-6" × 19\'-0" vertical circulation core with two 3\'-6" wide flights and 3\'-6" × 7\'-6" mid-landing',
      '21 precision risers (Tread = 11", Riser = 6.25") ascending from Ground (+1\'-6") to First Floor (+12\'-6")',
      'Daylit by W2 & W2A (5\'-0" × Mid-Landing) fixed glass panels and SD3 (5\'-0" × 10\'-3") North Deck portal'
    ],
    materialHighlights: [
      '2" Thick Solid Burma Teak Treads with Recessed Step LEDs',
      '12mm Toughened Low-Iron Glass Balustrade with Matte Black Handrail',
      'Board-Formed Architectural Concrete Double-Height Feature Wall'
    ]
  },

  // 7. ROOF GAZEBO PAVILION (24'-0" x 18'-0")
  {
    id: 'V253-IMG-GAZ-01',
    title: 'Signature Roof Gazebo Pavilion — Section BB\' Timber Pergola',
    subtitle: 'First Floor / Roof Terrace • 24\'-0" × 18\'-0" Pavilion • 12\'-9" Ridge Height',
    roomId: 'ROOM-V253-GAZEBO-01',
    roomName: 'Signature Roof Gazebo Terrace Pavilion',
    dimensions: "24'-0\" × 18'-0\" (432 sq.ft • Section BB' Ridge 12'-9\")",
    imageUrl: '/assets/images/villa253_gazebo_terrace_1790833723445.jpg',
    fallbackUrl: '/images/villa253_gazebo_terrace_1790833723445.jpg',
    styleTag: 'Elevated Resort Pavilion',
    architecturalNotes: [
      'Signaturepitched Roof Gazebo detailed in Sheet 2/2 Section BB\' with 12\'-9" clear ridge height',
      'Accessed via First Floor Staircase Landing (SD4A 5\'-0") and Bedroom 3 terrace portal (SD2A 10\'-0")',
      'Includes outdoor sunken lounge, wet bar counter, and panoramic views over the 57\'-2" North Deck'
    ],
    materialHighlights: [
      'Treated Glulam Teak Structural Rafters & Purlins',
      'Weatherproof Flamed Basalt & Ipe Wood Terrace Decking',
      'Warm IP67 Architectural Uplighting Along Rafters'
    ]
  },
  {
    id: 'V253-IMG-GAZ-02',
    title: 'Roof Gazebo & Sunset Lounge Deck — Panoramic Dusk View',
    subtitle: 'Roof Terrace Level • Section BB\' Pitched Canopy & Outdoor Bar',
    roomId: 'ROOM-V253-GAZEBO-01',
    roomName: 'Signature Roof Gazebo Terrace Pavilion',
    dimensions: "24'-0\" × 18'-0\" (432 sq.ft)",
    imageUrl: '/assets/images/villa253_roof_gazebo_1790830815235.jpg',
    fallbackUrl: '/images/villa253_roof_gazebo_1790830815235.jpg',
    styleTag: 'Alfresco Entertaining Deck',
    architecturalNotes: [
      'Overlooks the 14\'-0" × 30\'-10" East Bar Unit Deck below and the North landscape vista',
      'Engineered steel-and-timber hybrid column shoes anchored to First Floor RCC slab',
      'Integrated ceiling fan mount at 12\'-9" ridge beam with perimeter glass windbreak railing'
    ],
    materialHighlights: [
      'Thermory Ash Exterior Decking Boards',
      'Black Powder-Coated Structural Steel Tie Plates',
      'Sunbrella All-Weather Performance Outdoor Upholstery'
    ]
  },

  // 8. EXTERIOR ARCHITECTURAL FACADE (85'-5" x 20'-4" Footprint)
  {
    id: 'V253-IMG-EXT-01',
    title: 'Villa 253 North-Facing Exterior Facade & 57\'-2" Front Deck',
    subtitle: 'Complete 85\'-5" × 20\'-4" Footprint • Ground + First Floor + Roof Gazebo',
    roomId: 'EXTERIOR-FACADE',
    roomName: 'North-Facing Exterior Elevation & Deck',
    dimensions: "85'-5\" × 20'-4\" Structural Footprint + 57'-2\" × 9'-6\" Front Deck",
    imageUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
    fallbackUrl: '/images/villa253_facade_exterior_1790833735467.jpg',
    styleTag: 'North-Facing 24-Type Villa',
    architecturalNotes: [
      'Three-bay structural rhythm (35\'-9" West + 27\'-7" Center + 22\'-1" East = 85\'-5" overall length)',
      'Expansive 57\'-2" × 9\'-6" North Front Deck unifying Living (SD1 27\'), Staircase (SD3 5\'), and Bedroom 2 (SD2 12\')',
      'Crowned by First Floor Bedroom 3 (20\'-8" × 19\'-0") and the pitched Roof Gazebo (Section BB\')'
    ],
    materialHighlights: [
      'Natural Laterite & Honed Basalt Cladding Plinth (+1\'-6")',
      'Deep Cantilevered Timber-Soffit Roof Overhangs',
      'Floor-to-Beam Performance Glazing (SD1 27\'-0" × 10\'-3")'
    ]
  }
];

/**
 * Returns de-duplicated reference images strictly matching the requested roomId.
 * Notice: The 'ALL' wildcard mapping has been removed so rooms never bleed images into one another.
 */
export function getVilla253ImagesByRoom(roomId?: string, roomCategory?: string): Villa253ReferenceImage[] {
  if (!roomId || roomId === 'ALL') {
    return deduplicateReferenceImages(VILLA_253_REFERENCE_IMAGES);
  }
  const canonicalId = resolveCanonicalVilla253RoomId(roomId, roomCategory);
  const matched = VILLA_253_REFERENCE_IMAGES.filter(img => img.roomId === canonicalId);
  return deduplicateReferenceImages(matched);
}

/**
 * Returns the primary Villa 253 reference image strictly for the given roomId/name.
 * Never falls back to Living Room [0] for non-living rooms.
 */
export function getPrimaryVilla253ImageForRoom(
  roomId?: string,
  roomCategory?: string
): Villa253ReferenceImage {
  const canonicalId = resolveCanonicalVilla253RoomId(roomId, roomCategory);
  const exact = VILLA_253_REFERENCE_IMAGES.find(img => img.roomId === canonicalId);
  if (exact) return exact;

  // Safe room-category specific fallback (never blindly returning living room for bedroom/kitchen)
  const byCategory = getVilla253ImagesByRoom(canonicalId, roomCategory);
  return byCategory[0] || VILLA_253_REFERENCE_IMAGES[0];
}

import { FloorPlanReferenceImage } from '../types/floorplanSpatial';

/**
 * FloorPlanReferenceImage collection mapped strictly to canonical Villa 253 R0 room IDs.
 * Note: 'ALL' mapping has been removed from applicableRooms so rooms never show another room's visuals.
 */
export const VILLA_253_ALL_REFERENCE_IMAGES: FloorPlanReferenceImage[] = [
  {
    id: 'V253-REF-LIV-01',
    title: 'Living & Dining Great Room — Timber Truss & 27ft Deck Slider (SD1)',
    subtitle: '25\'-4" × 19\'-0" Great Room • Ground Floor Central Spine',
    category: 'INTERIOR_RENDER',
    imageUrl: '/assets/images/villa253_living_greatroom_1790833681710.jpg',
    applicableRooms: ['ROOM-V253-LIV-01'],
    cameraHotspot: {
      cameraLabel: 'CAM-01 Living North-East View',
      positionXPercent: 25,
      positionYPercent: 75,
      angleDegrees: 315,
      fieldOfViewDegrees: 65,
      viewTargetName: '27ft Sliding Glass Portal SD1 & 8-Seater Teak Dining'
    },
    themeMappingId: 'THEME-BIOPHILIC-TROPICAL',
    description: '25\'-4" × 19\'-0" Living & Dining space opening onto the 57\'-2" × 9\'-6" Front Deck through SD1 (27\'-0" × 10\'-3").',
    keyDesignElements: [
      'SD1 27\'-0" × 10\'-3" Aluminum Sliding Portal to North Deck',
      'FW1 15\'-9" × 1\'-3" Clerestory Glazing',
      '8-Seater Solid Plantation Teak Dining Suite'
    ],
    materialsReferenced: ['Honed Travertine Slabs', 'Seasoned CP Teak Rafters', 'Oatmeal Belgian Bouclé'],
    cadDimensionReference: "25'-4\" × 19'-0\" (481 sq.ft)",
    aspectRatio: '16:9'
  },
  {
    id: 'V253-REF-LIV-02',
    title: 'Living & Dining Great Room — Modern Daylight Clerestory Axis',
    subtitle: '25\'-4" × 19\'-0" Great Room • FW1 Clerestory & Rear Deck (SD5)',
    category: 'INTERIOR_RENDER',
    imageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
    applicableRooms: ['ROOM-V253-LIV-01'],
    cameraHotspot: {
      cameraLabel: 'CAM-02 Dining to Living Axis',
      positionXPercent: 78,
      positionYPercent: 30,
      angleDegrees: 210,
      fieldOfViewDegrees: 60,
      viewTargetName: 'Living Lounge & North Front Deck'
    },
    themeMappingId: 'THEME-WARM-LUXURY',
    description: 'Daylit perspective across the 25\'-4" × 19\'-0" Great Room showing acoustic oak slat ceiling and 13\'-0" × 9\'-6" Rear Deck alignment.',
    keyDesignElements: [
      'SD5 11\'-0" × 10\'-3" Rear Deck Sliding Portal',
      'W1 1\'-6" × 9\'-1" Vertical Slit Window',
      '12ft Floating Travertine Media Credenza'
    ],
    materialsReferenced: ['Quarter-Sawn Oak Baffles', 'Micro-Cement Feature Wall', 'Saddle Leather'],
    cadDimensionReference: "25'-4\" × 19'-0\" (481 sq.ft)",
    aspectRatio: '16:9'
  },
  {
    id: 'V253-REF-BED1-01',
    title: 'Master Bedroom 1 Suite — Private Deck (SD2) & Walk-in Closet (SD7)',
    subtitle: '14\'-0" × 19\'-0" Master Suite + 10\'-2" × 11\'-9" Wardrobe + Toilet 1',
    category: 'INTERIOR_RENDER',
    imageUrl: '/assets/images/villa253_master_suite_1790833696550.jpg',
    applicableRooms: ['ROOM-V253-BED1-01'],
    cameraHotspot: {
      cameraLabel: 'CAM-03 Master Bed to Private Deck',
      positionXPercent: 55,
      positionYPercent: 80,
      angleDegrees: 270,
      fieldOfViewDegrees: 60,
      viewTargetName: 'King Platform Bed & 11\'-6" × 4\'-6" Private Deck (SD2)'
    },
    themeMappingId: 'THEME-WARM-LUXURY',
    description: 'Primary West-Wing Master Bedroom 1 (14\'-0" × 19\'-0") with SD2 (12\'-0" × 10\'-3"), SD4 (10\'-0" × 10\'-3"), and 10\'-2" × 11\'-9" walk-in wardrobe (SD7).',
    keyDesignElements: [
      'SD2 12\'-0" × 10\'-3" Private Deck Slider',
      'SD7 7\'-0" × 10\'-3" Walk-In Wardrobe Portal',
      'D2 3\'-6" × 10\'-3" En-suite Toilet 1 Entry'
    ],
    materialsReferenced: ['Smoked European Oak Planks', 'Woven Cane & Teak Headboard', 'Fluted Bronze Glass'],
    cadDimensionReference: "14'-0\" × 19'-0\" (266 sq.ft)",
    aspectRatio: '16:9'
  },
  {
    id: 'V253-REF-BED1-02',
    title: 'Master Bedroom 1 — Evening Cove & Dressing Axis',
    subtitle: '14\'-0" × 19\'-0" Master Suite • West Ground Wing',
    category: 'INTERIOR_RENDER',
    imageUrl: '/assets/images/villa253_master_bedroom_1790830829821.jpg',
    applicableRooms: ['ROOM-V253-BED1-01'],
    cameraHotspot: {
      cameraLabel: 'CAM-04 Master North-West Corner',
      positionXPercent: 20,
      positionYPercent: 25,
      angleDegrees: 135,
      fieldOfViewDegrees: 60,
      viewTargetName: 'Upholstered Headboard & SD7 Walk-in Wardrobe'
    },
    themeMappingId: 'THEME-NEO-CLASSICAL-GRANDEUR',
    description: 'Warm 2700K cove lighting in Bedroom 1 (14\'-0" × 19\'-0") highlighting the acoustic headboard wall and walk-in closet threshold.',
    keyDesignElements: [
      '10\'-3" Clear Beam Soffit with Perimeter Cove',
      '10\'-2" × 11\'-9" Walk-in Wardrobe with W6 Window',
      '6\'-0" × 24\'-9" En-suite Master Bath (Toilet 1)'
    ],
    materialsReferenced: ['Warm Grey Linen Panels', 'Brushed Champagne Brass', 'Smoked Oak Veneer'],
    cadDimensionReference: "14'-0\" × 19'-0\" (266 sq.ft)",
    aspectRatio: '16:9'
  },
  {
    id: 'V253-REF-BED2-01',
    title: 'Bedroom 2 Suite — East Bar Deck (SD6) & North Deck (SD2)',
    subtitle: '18\'-11" × 19\'-0" Suite + 7\'-9" × 9\'-8" Wardrobe + 10\'-4" × 9\'-8" Toilet 2',
    category: 'INTERIOR_RENDER',
    imageUrl: '/assets/images/villa253_guest_suite_1790833711200.jpg',
    applicableRooms: ['ROOM-V253-BED2-01'],
    cameraHotspot: {
      cameraLabel: 'CAM-05 Bedroom 2 East Bar Deck View',
      positionXPercent: 25,
      positionYPercent: 55,
      angleDegrees: 45,
      fieldOfViewDegrees: 60,
      viewTargetName: 'SD6 (9\'-0" × 10\'-3") to 14\'-0" × 30\'-10" Bar Unit Deck'
    },
    themeMappingId: 'THEME-BIOPHILIC-TROPICAL',
    description: 'Ground-Floor East Wing Bedroom 2 (18\'-11" × 19\'-0", 359 sq.ft) with dual deck sliders SD2 (12\') and SD6 (9\') plus 7\'-9" × 9\'-8" wardrobe.',
    keyDesignElements: [
      'SD6 9\'-0" × 10\'-3" Portal to 14\'-0" × 30\'-10" Bar Deck',
      'SD2 12\'-0" × 10\'-3" Portal to North Front Deck',
      '7\'-9" × 9\'-8" Wardrobe & 10\'-4" × 9\'-8" Toilet 2 (D3)'
    ],
    materialsReferenced: ['Honed Terrazzo & Kota Inlay', 'Teak Louvered Wardrobe', 'Limewash Plaster'],
    cadDimensionReference: "18'-11\" × 19'-0\" (359 sq.ft)",
    aspectRatio: '16:9'
  },
  {
    id: 'V253-REF-BED3-01',
    title: 'First Floor Bedroom 3 Suite — 20\'-8" × 19\'-0" Penthouse & Balconies',
    subtitle: 'First Floor (+11\'-6") • SD1A (12\'), SD2A (10\'), SD3A (8\') & Toilet 3 (9\'-9" × 9\'-2")',
    category: 'INTERIOR_RENDER',
    imageUrl: '/assets/images/villa253_bedroom3_firstfloor_20x19_r0.svg',
    applicableRooms: ['ROOM-V253-BED3-01'],
    cameraHotspot: {
      cameraLabel: 'CAM-06 Bedroom 3 First Floor Balcony Axis',
      positionXPercent: 50,
      positionYPercent: 75,
      angleDegrees: 270,
      fieldOfViewDegrees: 65,
      viewTargetName: '24\'-4" × 4\'-0" Front Balcony (SD1A) & Pitched Timber Ceiling'
    },
    themeMappingId: 'THEME-WARM-LUXURY',
    description: 'First-Floor Bedroom 3 (20\'-8" × 19\'-0", 393 sq.ft) opening to 24\'-4" × 4\'-0" front balcony (SD1A 12\'), 14\'-10" × 4\'-0" side balcony, and Toilet 3 (9\'-9" × 9\'-2").',
    keyDesignElements: [
      'SD1A 12\'-0" × Beam Bottom Front Balcony Slider',
      'SD2A 10\'-0" & SD3A 8\'-0" Terrace Sliders',
      'En-suite Toilet 3 (9\'-9" × 9\'-2") via D2A (3\'-6")'
    ],
    materialsReferenced: ['Exposed Pitched Timber Rafters', 'Brushed Teak Planks', 'Low-E Double Glazing'],
    cadDimensionReference: "20'-8\" × 19'-0\" (393 sq.ft)",
    aspectRatio: '16:9'
  },
  {
    id: 'V253-REF-KIT-01',
    title: 'Culinary Kitchen, Utility & Powder Wing — 14\'-6" × 9\'-0" Galley',
    subtitle: 'Ground Floor South Spine • 14\'-6" × 9\'-0" Kitchen + 9\'-0" × 9\'-8" Utility + 5\'-0" × 9\'-8" Powder',
    category: 'INTERIOR_RENDER',
    imageUrl: '/assets/images/villa253_kitchen_utility_14x9_r0.svg',
    applicableRooms: ['ROOM-V253-KIT-01'],
    cameraHotspot: {
      cameraLabel: 'CAM-07 Parallel Kitchen Galley Axis',
      positionXPercent: 15,
      positionYPercent: 50,
      angleDegrees: 0,
      fieldOfViewDegrees: 60,
      viewTargetName: '14\'-6" × 9\'-0" Parallel Quartz Counter & 9\'-0" × 9\'-8" Utility'
    },
    themeMappingId: 'THEME-WARM-LUXURY',
    description: 'Ergonomic 14\'-6" × 9\'-0" parallel kitchen directly adjoining the 9\'-0" × 9\'-8" wet utility (W4) and 5\'-0" × 9\'-8" powder room (D4/W3).',
    keyDesignElements: [
      '14\'-6" × 9\'-0" Parallel Counter Run with 5\'-0" Central Aisle',
      '9\'-0" × 9\'-8" Wet Utility with W4 (3\'-0" × 4\'-0") Window',
      '5\'-0" × 9\'-8" Guest Powder Room (D4 3\'-0" × 7\'-8")'
    ],
    materialsReferenced: ['20mm Statuario Quartz', 'Fluted Walnut & Cashmere Acrylic', 'Hafele Tandembox'],
    cadDimensionReference: "14'-6\" × 9'-0\" (131 sq.ft)",
    aspectRatio: '16:9'
  },
  {
    id: 'V253-REF-STAIR-01',
    title: 'Architectural Staircase Core — 7\'-6" × 19\'-0" (21 Risers)',
    subtitle: 'Central Vertical Spine • Tread 11" • Riser 6.25" • W2/W2A Fixed Glazing',
    category: 'INTERIOR_RENDER',
    imageUrl: '/assets/images/villa253_staircase_core_7x19_r0.svg',
    applicableRooms: ['ROOM-V253-STAIR-01'],
    cameraHotspot: {
      cameraLabel: 'CAM-08 Staircase Double-Height Core',
      positionXPercent: 50,
      positionYPercent: 85,
      angleDegrees: 270,
      fieldOfViewDegrees: 60,
      viewTargetName: '21-Riser Dogleg Staircase & W2/W2A 5\'-0" Glazing'
    },
    themeMappingId: 'THEME-WARM-LUXURY',
    description: '7\'-6" × 19\'-0" dogleg staircase with 21 risers (Tread 11", Riser 6.25", 3\'-6" flight width), SD3 (5\'-0" × 10\'-3") North Deck slider, and W2/W2A glazing.',
    keyDesignElements: [
      '21 Risers (Tread = 11", Riser = 6.25", Flight Width = 3\'-6")',
      'W2 & W2A (5\'-0" × Mid-Landing) Fixed Architectural Glass',
      'SD3 (5\'-0" × 10\'-3") North Deck Portal & SD4A First Floor Portal'
    ],
    materialsReferenced: ['2" Solid Burma Teak Treads', '12mm Toughened Low-Iron Glass', 'Recessed Step LEDs'],
    cadDimensionReference: "7'-6\" × 19'-0\" (143 sq.ft)",
    aspectRatio: '16:9'
  },
  {
    id: 'V253-REF-GAZ-01',
    title: 'Signature Roof Gazebo Pavilion — Section BB\' Timber Pergola',
    subtitle: '24\'-0" × 18\'-0" Roof Gazebo • 12\'-9" Ridge Height & Cocktail Bar',
    category: 'INTERIOR_RENDER',
    imageUrl: '/assets/images/villa253_gazebo_terrace_1790833723445.jpg',
    applicableRooms: ['ROOM-V253-GAZEBO-01'],
    cameraHotspot: {
      cameraLabel: 'CAM-09 Roof Gazebo Pergola Lounge',
      positionXPercent: 20,
      positionYPercent: 75,
      angleDegrees: 315,
      fieldOfViewDegrees: 65,
      viewTargetName: 'Section BB\' Pitched Timber Rafters & Outdoor Bar'
    },
    themeMappingId: 'THEME-ROOF-GAZEBO-LOUNGE',
    description: '24\'-0" × 18\'-0" pitched timber Roof Gazebo detailed in Sheet 2/2 Section BB\' (12\'-9" clear ridge height) overlooking the North and East decks.',
    keyDesignElements: [
      'Section BB\' Pitched Timber Pergola (Ridge 12\'-9")',
      'SD4A (5\'-0" × Beam) Upper Staircase Access',
      '8ft Honed Black Granite Outdoor Cocktail Bar'
    ],
    materialsReferenced: ['Weatherproof Glulam Teak Rafters', 'Ipe Decking', 'Sunbrella Outdoor Fabric'],
    cadDimensionReference: "24'-0\" × 18'-0\" (432 sq.ft)",
    aspectRatio: '16:9'
  },
  {
    id: 'V253-REF-GAZ-02',
    title: 'Roof Gazebo & Sunset Lounge — Panoramic Dusk Elevation',
    subtitle: '24\'-0" × 18\'-0" Roof Terrace Pavilion • Section BB\'',
    category: 'EXTERIOR_ELEVATION',
    imageUrl: '/assets/images/villa253_roof_gazebo_1790830815235.jpg',
    applicableRooms: ['ROOM-V253-GAZEBO-01'],
    cameraHotspot: {
      cameraLabel: 'CAM-10 Gazebo Sunset Perspective',
      positionXPercent: 80,
      positionYPercent: 60,
      angleDegrees: 225,
      fieldOfViewDegrees: 65,
      viewTargetName: 'Pitched Gazebo Canopy & Sunset Horizon'
    },
    themeMappingId: 'THEME-ROOF-GAZEBO-LOUNGE',
    description: 'Dusk architectural perspective of the Villa 253 Roof Gazebo showing warm 2400K rafter grazing and outdoor lounge seating.',
    keyDesignElements: [
      '24\'-0" × 18\'-0" Open-Air Terrace Pavilion',
      'Warm 2400K IP65 Rafter & Step Lighting',
      'Overlooks 14\'-0" × 30\'-10" East Bar Unit Deck'
    ],
    materialsReferenced: ['Thermory Ash Decking', 'Powder-Coated Steel Shoes', 'Woven Rattan Lanterns'],
    cadDimensionReference: "24'-0\" × 18'-0\" (432 sq.ft)",
    aspectRatio: '16:9'
  }
];

/**
 * Returns de-duplicated FloorPlanReferenceImage items strictly for a given room ID/name.
 * Never mixes 'ALL' or living-room images into other rooms.
 */
export function getReferenceImagesForRoom(
  roomId?: string,
  roomName?: string
): FloorPlanReferenceImage[] {
  if (!roomId || roomId === 'ALL') {
    return deduplicateReferenceImages(VILLA_253_ALL_REFERENCE_IMAGES);
  }
  const canonical = resolveCanonicalVilla253RoomId(roomId, roomName);
  const filtered = VILLA_253_ALL_REFERENCE_IMAGES.filter(img =>
    img.applicableRooms.includes(canonical)
  );
  return deduplicateReferenceImages(filtered);
}

