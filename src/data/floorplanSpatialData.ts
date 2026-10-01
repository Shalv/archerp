/**
 * Build Storys ERP - 2-Step Spatial AI Data & Presets
 * Pre-calibrated for real-world projects and the 2BHK ₹18 Lakh brief:
 * "Modern warm interior, ₹18 lakh budget, lots of storage, and a work desk in the second bedroom."
 */

import { 
  TwoStepSpatialDesignSession, 
  FurnitureLayoutOption, 
  ExtractedRoomGeometry,
  VisualConceptVersion 
} from '../types/floorplanSpatial';

export const INITIAL_2BHK_SPATIAL_SESSION: TwoStepSpatialDesignSession = {
  projectId: 'PROJ-SKYLINE-1402',
  projectTitle: 'Skyline Residency Flat 1402 (2BHK)',
  customerInput: {
    floorPlanFileName: 'Customer_2BHK_Architectural_Plan_Rev2.pdf',
    floorPlanFileUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
    fileType: 'PDF',
    uploadDate: '2026-03-08',
    scaleText: '1:50 Metric Scale (Dimensions confirmed in feet & inches)',
    isScaleVerified: true,
    siteLocation: 'Apartment 1402, Tower B, Worli Seaface, Mumbai',
    propertyType: '2BHK_APARTMENT',
    totalCarpetAreaSqFt: 620,
    roomsToDesign: [
      'Living & Dining (20\' × 12\')',
      'Bedroom 2 / WFH Study (12\' × 11\')',
      'Master Bedroom (14\' × 12\')',
      'Modular Kitchen (10\' × 8\')'
    ],
    approximateBudget: 1800000, // ₹18,00,000 (₹18 Lakhs)
    preferredStyle: 'Modern Warm Interior (Natural Teak, Warm 2700K Coves, Soft Bouclé, Fluted Panels)',
    referenceImages: [
      {
        id: 'REF-01',
        title: 'Warm Japandi / Modern Minimalist Living',
        imageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
        tags: ['Warm Teak', 'Fluted Accents', 'Hidden Storage', 'Neutral Beige']
      },
      {
        id: 'REF-02',
        title: 'Acoustic Ergonomic Work-From-Home Desk',
        imageUrl: '/assets/images/villa253_guest_suite_1790833711200.jpg',
        tags: ['WFH Desk', 'Cable Management', 'Floating Shelves', 'Daylight Facing']
      },
      {
        id: 'REF-03',
        title: 'Space-Saving Built-In Storage Solutions',
        imageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
        tags: ['Concealed Wardrobes', 'Hydraulic Storage', 'Matte Laminate', 'Clean Lines']
      }
    ],
    fixedRequirements: [
      'Lots of concealed storage throughout the home without making rooms feel cramped',
      'Dedicated ergonomic work desk in the second bedroom with dual-monitor space',
      'Six-seat dining setup for weekend family dinners',
      'Zero doorway or window obstruction (strict 3.0ft minimum circulation path)',
      'Stay strictly within ₹18,00,000 total interior turnkey budget'
    ],
    siteSurveyStatus: 'SITE_SURVEYED_VERIFIED',
    siteSurveyDate: '2026-03-10',
    siteSurveyorName: 'Er. Rajesh Kumar (Senior Site Engineer)',
    siteSurveyNotes: 'Laser scan completed via Bosch GLM 50C. All corner angles 90.2° ± 0.3°. Slab to false ceiling clearance verified at 9ft 6in. Zero dampness detected.'
  },
  
  planGeometry: {
    planVersion: 'FP-v2.1-VERIFIED',
    verifiedScale: '1:50 Metric Scale (Verified on site)',
    isDesignerVerified: true,
    designerVerifiedBy: 'Ar. Aniket Joshi (Principal Architect)',
    designerVerifiedDate: '2026-03-11',
    rooms: [
      {
        id: 'ROOM-LIV-01',
        name: 'Living & Dining Forum',
        roomType: 'LIVING_DINING',
        lengthFt: 20.0,
        widthFt: 12.0,
        heightFt: 9.5,
        carpetAreaSqFt: 240,
        doors: [
          {
            id: 'D1-ENTRANCE',
            wall: 'EAST',
            widthFt: 3.5,
            swingDirection: 'INWARD_LEFT',
            clearanceFt: 3.5,
            isClearanceMet: true
          },
          {
            id: 'D2-BALCONY',
            wall: 'WEST',
            widthFt: 6.0,
            swingDirection: 'SLIDING',
            clearanceFt: 3.2,
            isClearanceMet: true
          },
          {
            id: 'D3-KITCHEN_PASS',
            wall: 'SOUTH',
            widthFt: 4.0,
            swingDirection: 'SLIDING',
            clearanceFt: 3.0,
            isClearanceMet: true
          }
        ],
        windows: [
          {
            id: 'W1-BALCONY-GLAZING',
            wall: 'WEST',
            widthFt: 8.0,
            sillHeightFt: 0.5,
            lintelHeightFt: 8.5,
            isDaylightBlocked: false
          }
        ],
        structuralColumns: [
          { id: 'COL-01', xFt: 0, yFt: 0, widthInches: 12, depthInches: 18 },
          { id: 'COL-02', xFt: 20, yFt: 12, widthInches: 12, depthInches: 18 }
        ],
        isVerifiedByDesigner: true,
        verifiedBy: 'Ar. Aniket Joshi',
        verificationDate: '2026-03-11',
        designerNotes: 'Longitudinal layout allows zoned living on West (natural view) and dining on East (near kitchen).'
      },
      {
        id: 'ROOM-BED2-01',
        name: 'Bedroom 2 / WFH Study Suite',
        roomType: 'BEDROOM_2_STUDY',
        lengthFt: 12.0,
        widthFt: 11.0,
        heightFt: 9.5,
        carpetAreaSqFt: 132,
        doors: [
          {
            id: 'D-BED2-ENTRY',
            wall: 'SOUTH',
            widthFt: 3.0,
            swingDirection: 'INWARD_RIGHT',
            clearanceFt: 3.0,
            isClearanceMet: true
          }
        ],
        windows: [
          {
            id: 'W-BED2-NORTH',
            wall: 'NORTH',
            widthFt: 5.0,
            sillHeightFt: 2.5,
            lintelHeightFt: 8.0,
            isDaylightBlocked: false
          }
        ],
        structuralColumns: [
          { id: 'COL-03', xFt: 0, yFt: 11, widthInches: 12, depthInches: 12 }
        ],
        isVerifiedByDesigner: true,
        verifiedBy: 'Ar. Aniket Joshi',
        verificationDate: '2026-03-11',
        designerNotes: 'Window on North provides glare-free natural light ideal for video calls and computer workstation.'
      },
      {
        id: 'ROOM-MBED-01',
        name: 'Master Bedroom Suite',
        roomType: 'MASTER_BEDROOM',
        lengthFt: 14.0,
        widthFt: 12.0,
        heightFt: 9.5,
        carpetAreaSqFt: 168,
        doors: [
          {
            id: 'D-MBED-ENTRY',
            wall: 'EAST',
            widthFt: 3.0,
            swingDirection: 'INWARD_LEFT',
            clearanceFt: 3.0,
            isClearanceMet: true
          },
          {
            id: 'D-MBED-BATH',
            wall: 'WEST',
            widthFt: 2.5,
            swingDirection: 'INWARD_RIGHT',
            clearanceFt: 2.8,
            isClearanceMet: true
          }
        ],
        windows: [
          {
            id: 'W-MBED-SOUTH',
            wall: 'SOUTH',
            widthFt: 6.0,
            sillHeightFt: 2.0,
            lintelHeightFt: 8.0,
            isDaylightBlocked: false
          }
        ],
        structuralColumns: [
          { id: 'COL-04', xFt: 14, yFt: 0, widthInches: 12, depthInches: 12 }
        ],
        isVerifiedByDesigner: true,
        verifiedBy: 'Ar. Aniket Joshi',
        verificationDate: '2026-03-11',
        designerNotes: 'South wall allows full 10-ft wardrobe span with zero interference to bathroom access.'
      },
      {
        id: 'ROOM-KIT-01',
        name: 'Culinary Kitchen & Breakfast Bar',
        roomType: 'KITCHEN',
        lengthFt: 12.0,
        widthFt: 8.0,
        heightFt: 9.5,
        carpetAreaSqFt: 96,
        doors: [
          {
            id: 'D-KIT-ENTRY',
            wall: 'SOUTH',
            widthFt: 3.0,
            swingDirection: 'SLIDING',
            clearanceFt: 3.5,
            isClearanceMet: true
          }
        ],
        windows: [
          {
            id: 'W-KIT-EAST',
            wall: 'EAST',
            widthFt: 4.0,
            sillHeightFt: 3.5,
            lintelHeightFt: 7.5,
            isDaylightBlocked: false
          }
        ],
        structuralColumns: [
          { id: 'COL-05', xFt: 12, yFt: 8, widthInches: 12, depthInches: 12 }
        ],
        isVerifiedByDesigner: true,
        verifiedBy: 'Ar. Aniket Joshi',
        verificationDate: '2026-03-11',
        designerNotes: 'Parallel modular layout with quartz countertop and 3.5ft central passage for effortless culinary workflow.'
      }
    ]
  },

  activeRoomId: 'ROOM-LIV-01',
  
  layoutOptionsByRoom: {
    'ROOM-LIV-01': [
      {
        id: 'LAYOUT-LIV-OPT1',
        optionCode: 'LAYOUT_1',
        title: 'Option 1: Max Open Flow & Social Living',
        tagline: 'Expansive 3.8ft Central Pathway • Low-Profile Floating Credenza • Balcony Vista Priority',
        priorityTheme: 'OPEN_LIVING',
        circulationScore: 98,
        storageCapacityCuFt: 210,
        minClearancePassageFt: 3.8,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Places a 3-seater plush bouclé sofa against the unbroken North wall with an open-edge chaise, leaving the central corridor from entrance to balcony completely unhindered. Dining is set as a 4-to-6 extendable bench table near the kitchen.',
        furnitureItems: [
          {
            id: 'F-LIV-01',
            name: '3-Seater Low-Slung Curved Sofa',
            category: 'SEATING',
            widthFt: 7.5,
            depthFt: 3.2,
            heightFt: 2.6,
            positionXPercent: 12,
            positionYPercent: 18,
            rotationDeg: 0,
            clearanceDistanceFt: 4.0,
            whyItFits: 'Positioned against solid North wall; maintains 4.2ft clear corridor from entrance door without protruding into walkway.',
            catalogueCode: 'FUR-SOF-301',
            materialRef: 'Oatmeal textured bouclé fabric with solid ash wood base',
            estimatedCost: 68000
          },
          {
            id: 'F-LIV-02',
            name: 'Floating Slim TV Console with Slat Accent',
            category: 'JOINERY',
            widthFt: 6.5,
            depthFt: 1.2,
            heightFt: 1.4,
            positionXPercent: 14,
            positionYPercent: 82,
            rotationDeg: 0,
            clearanceDistanceFt: 5.5,
            whyItFits: 'Mounted on South wall with only 14" depth; preserves 5.5ft viewing distance to sofa and zero floor-level clutter.',
            catalogueCode: 'MED-TVC-104',
            materialRef: 'Natural smoked oak veneer with warm 2700K bottom LED cove',
            estimatedCost: 38000
          },
          {
            id: 'F-LIV-03',
            name: 'Extendable 6-Seater Scandinavian Dining Table',
            category: 'DINING',
            widthFt: 5.0,
            depthFt: 3.0,
            heightFt: 2.5,
            positionXPercent: 70,
            positionYPercent: 25,
            rotationDeg: 90,
            clearanceDistanceFt: 3.6,
            whyItFits: 'Directly opposite kitchen sliding opening; provides 3.6ft all-around chair pull-out clearance.',
            catalogueCode: 'DIN-TBL-602',
            materialRef: 'Solid Teak Top with rounded bullnose safety edges',
            estimatedCost: 46000
          },
          {
            id: 'F-LIV-04',
            name: 'Organic Pebble Coffee Table & Pouf',
            category: 'ACCENT',
            widthFt: 3.5,
            depthFt: 2.2,
            heightFt: 1.3,
            positionXPercent: 25,
            positionYPercent: 48,
            rotationDeg: 15,
            clearanceDistanceFt: 3.2,
            whyItFits: 'Soft rounded geometry eliminates sharp edges for family safety while maintaining 3.2ft circulation to balcony.',
            catalogueCode: 'ACC-TBL-208',
            materialRef: 'Travertine textured composite with brushed brass footing',
            estimatedCost: 19000
          }
        ],
        whyItFitsOverall: 'All major seating is aligned along the structural walls. Circulation path between Entrance (East) and Seaface Balcony (West) is measured at 45 inches (3.75 ft), far exceeding the 36-inch architectural minimum.',
        pros: [
          'Unobstructed natural daylight from balcony reaches all the way to dining zone',
          'Zero risk of door swing conflicts with entrance or kitchen doors',
          'Clean, uncluttered aesthetic suitable for entertaining guests'
        ],
        cons: [
          'Moderate storage volume (210 cu.ft) compared to storage-max layout'
        ],
        layoutSvgPreview: 'OPEN_FLOW'
      },
      {
        id: 'LAYOUT-LIV-OPT2',
        optionCode: 'LAYOUT_2',
        title: 'Option 2: Storage-Max with Integrated Floor-to-Ceiling Joinery',
        tagline: '390 cu.ft Concealed Storage • Full-Wall Multipurpose Credenza • Foldaway Dining Bench',
        priorityTheme: 'STORAGE_MAX',
        circulationScore: 92,
        storageCapacityCuFt: 390,
        minClearancePassageFt: 3.2,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Designed specifically to meet the client\'s priority for "lots of storage". Features a custom floor-to-ceiling media & storage wall with push-to-open flush cabinets, shoe cabinet vestibule at entrance, and banquette dining storage.',
        furnitureItems: [
          {
            id: 'F-LIV-201',
            name: 'Full-Span Architectural Storage & Media Wall',
            category: 'STORAGE',
            widthFt: 12.0,
            depthFt: 1.5,
            heightFt: 9.5,
            positionXPercent: 10,
            positionYPercent: 82,
            rotationDeg: 0,
            clearanceDistanceFt: 4.8,
            whyItFits: 'Built flush against South wall, incorporating 14 upper soft-close cabinets, concealed cable tray, and book niches.',
            catalogueCode: 'STR-WAL-901',
            materialRef: 'Merino anti-scratch suede laminate with fluted wood inserts',
            estimatedCost: 115000
          },
          {
            id: 'F-LIV-202',
            name: 'L-Shaped Sectional with Internal Storage Bins',
            category: 'SEATING',
            widthFt: 8.0,
            depthFt: 5.5,
            heightFt: 2.8,
            positionXPercent: 12,
            positionYPercent: 18,
            rotationDeg: 0,
            clearanceDistanceFt: 3.4,
            whyItFits: 'Chaise tucks cleanly into the North-East corner without blocking balcony slider or entrance door.',
            catalogueCode: 'FUR-SEC-502',
            materialRef: 'Performance spill-proof fabric with gas-lift storage chaise',
            estimatedCost: 82000
          },
          {
            id: 'F-LIV-203',
            name: '6-Seater Banquette Dining with Under-Seat Drawers',
            category: 'DINING',
            widthFt: 6.0,
            depthFt: 3.5,
            heightFt: 2.8,
            positionXPercent: 72,
            positionYPercent: 22,
            rotationDeg: 90,
            clearanceDistanceFt: 3.2,
            whyItFits: 'Bench hugs East partition wall saving 2.5ft floor depth while yielding 45 cu.ft of storage under seat cushions.',
            catalogueCode: 'DIN-BNQ-401',
            materialRef: 'BWP Marine Ply with high-density foam & wipeable leatherette',
            estimatedCost: 52000
          },
          {
            id: 'F-LIV-204',
            name: 'Concealed Entryway Foyer Shoe & Coat Console',
            category: 'STORAGE',
            widthFt: 4.0,
            depthFt: 1.2,
            heightFt: 7.0,
            positionXPercent: 88,
            positionYPercent: 75,
            rotationDeg: 0,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Placed behind entrance door swing; accommodates 24 shoe pairs plus umbrellas and keys.',
            catalogueCode: 'STR-FOY-101',
            materialRef: 'Warm Teak laminate with perforated brass ventilation grills',
            estimatedCost: 28000
          }
        ],
        whyItFitsOverall: 'Maximizes vertical wall space up to the 9.5ft false ceiling without encroaching into the 3.2ft central walkway. Zero interference with the 3.5ft entrance door or 6ft balcony slider.',
        pros: [
          'Highest storage density (390 cu.ft) — eliminates any clutter in public areas',
          'Banquette dining comfortably accommodates up to 7 people during gatherings',
          'Dedicated entryway drop zone for shoes and deliveries'
        ],
        cons: [
          'Slightly firmer circulation passage (3.2ft vs 3.8ft in Option 1)'
        ],
        layoutSvgPreview: 'STORAGE_MAX'
      },
      {
        id: 'LAYOUT-LIV-OPT3',
        optionCode: 'LAYOUT_3',
        title: 'Option 3: Ergonomic WFH Focus & Flexible Living',
        tagline: 'Dual-Zone Living • Secondary Work Nook in Alcove • Seamless Acoustic Zoning',
        priorityTheme: 'WFH_PRODUCTIVITY',
        circulationScore: 95,
        storageCapacityCuFt: 280,
        minClearancePassageFt: 3.5,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'In addition to the primary WFH desk in Bedroom 2, this layout integrates a concealed executive laptop nook behind acoustic louvres in the living area, allowing alternate working or evening study without disturbing bedroom occupants.',
        furnitureItems: [
          {
            id: 'F-LIV-301',
            name: 'Modular 3-Seater Sofa with Wireless Charging Armrests',
            category: 'SEATING',
            widthFt: 7.0,
            depthFt: 3.0,
            heightFt: 2.7,
            positionXPercent: 12,
            positionYPercent: 18,
            rotationDeg: 0,
            clearanceDistanceFt: 3.8,
            whyItFits: 'Centered with balcony view and maintains 4ft walking gap.',
            catalogueCode: 'FUR-SOF-303',
            materialRef: 'Taupe chenille with built-in dual USB-C ports',
            estimatedCost: 62000
          },
          {
            id: 'F-LIV-302',
            name: 'Concealed Roll-Top Home Office Nook with Fluted Door',
            category: 'WORK_DESK',
            widthFt: 4.5,
            depthFt: 1.8,
            heightFt: 7.5,
            positionXPercent: 68,
            positionYPercent: 15,
            rotationDeg: 0,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Tucks into East architectural recess; closes completely when entertaining to hide monitors and paperwork.',
            catalogueCode: 'DSK-NOK-201',
            materialRef: 'Warm Teak with acoustic felt pinboard backing',
            estimatedCost: 44000
          },
          {
            id: 'F-LIV-303',
            name: 'Floating 6-Seater Slim Dining Unit',
            category: 'DINING',
            widthFt: 5.5,
            depthFt: 3.0,
            heightFt: 2.5,
            positionXPercent: 70,
            positionYPercent: 55,
            rotationDeg: 90,
            clearanceDistanceFt: 3.4,
            whyItFits: 'Multi-functional surface serves for dining as well as team collaboration or kid homework.',
            catalogueCode: 'DIN-TBL-604',
            materialRef: 'Solid ashwood frame with scratch-proof matte laminate top',
            estimatedCost: 42000
          }
        ],
        whyItFitsOverall: 'Provides flexible dual-desk redundancy while preserving clean residential comfort in the living space.',
        pros: ['Enables work flexibility across living and bedroom', 'Concealed desk keeps living room formal when closed'],
        cons: ['Requires precision millwork joinery for the pocket roll-top door'],
        layoutSvgPreview: 'WFH_FOCUS'
      },
      {
        id: 'LAYOUT-LIV-OPT4',
        optionCode: 'LAYOUT_4',
        title: 'Option 4: Luxury Entertaining & Modular Lounge',
        tagline: 'Circular Conversation Circle • Cocktail Bar Credenza • Extended 6-8 Seater Setup',
        priorityTheme: 'LUXURY_ENTERTAINING',
        circulationScore: 94,
        storageCapacityCuFt: 260,
        minClearancePassageFt: 3.4,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Prioritizes dinner parties and hospitality. Centers around a dedicated dry-bar buffet counter, curved designer lounge seating, and an expandable 8-seater dining arrangement.',
        furnitureItems: [
          {
            id: 'F-LIV-401',
            name: 'Curved Italian Silhouette 4-Seater Sofa',
            category: 'SEATING',
            widthFt: 8.5,
            depthFt: 3.5,
            heightFt: 2.6,
            positionXPercent: 10,
            positionYPercent: 20,
            rotationDeg: 0,
            clearanceDistanceFt: 3.6,
            whyItFits: 'Graceful curve softens rectangular room geometry; avoids sharp traffic bottlenecks.',
            catalogueCode: 'FUR-CRV-401',
            materialRef: 'Sand-washed linen weave with brushed bronze feet',
            estimatedCost: 92000
          },
          {
            id: 'F-LIV-402',
            name: 'Backlit Bar & Wine Credenza with Fluted Glass',
            category: 'JOINERY',
            widthFt: 5.0,
            depthFt: 1.5,
            heightFt: 6.5,
            positionXPercent: 88,
            positionYPercent: 30,
            rotationDeg: 0,
            clearanceDistanceFt: 3.4,
            whyItFits: 'Located adjacent to dining zone for swift drink and appetizer service without entering wet kitchen.',
            catalogueCode: 'BAR-CRD-102',
            materialRef: 'Tinted fluted glass, warm brass hardware, LED shelf strips',
            estimatedCost: 48000
          }
        ],
        whyItFitsOverall: 'Optimized for hospitality with graceful curved pathways and ambient zoned lighting.',
        pros: ['High hospitality and luxury aesthetic', 'Excellent seating capacity for large groups'],
        cons: ['Slightly higher furniture investment for curved custom frames'],
        layoutSvgPreview: 'ENTERTAINING'
      },
      {
        id: 'LAYOUT-LIV-OPT5',
        optionCode: 'LAYOUT_5',
        title: 'Option 5: Vastu-Aligned Harmonious Energy Flow',
        tagline: 'Ishanya (NE) Water & Prana • Agni (SE) Dining Energy • Heavy Nairutya Seating',
        priorityTheme: 'VASTU_COMPLIANT',
        circulationScore: 96,
        storageCapacityCuFt: 290,
        minClearancePassageFt: 3.6,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Strictly aligned with ancient Vastu Shastra principles. Anchors heavy seating along the West/South-West boundary while keeping the North-East quadrant light, open, and flooded with morning solar prana.',
        furnitureItems: [
          {
            id: 'F-LIV-501',
            name: 'Earth-Anchored 3-Seater Sofa with Teak Base',
            category: 'SEATING',
            widthFt: 7.2,
            depthFt: 3.2,
            heightFt: 2.8,
            positionXPercent: 12,
            positionYPercent: 20,
            rotationDeg: 0,
            clearanceDistanceFt: 3.8,
            whyItFits: 'Positioned in Nairutya (South-West) grounding zone to bring mental calm and financial stability.',
            catalogueCode: 'FUR-VST-101',
            materialRef: 'Solid Teak wood frame with natural organic cotton upholstery',
            estimatedCost: 65000
          },
          {
            id: 'F-LIV-502',
            name: 'East-Facing 6-Seater Teak Dining Ensemble',
            category: 'DINING',
            widthFt: 5.5,
            depthFt: 3.2,
            heightFt: 2.5,
            positionXPercent: 68,
            positionYPercent: 35,
            rotationDeg: 90,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Dining facing East enhances digestion and family harmony, close to the Agni (South-East) kitchen.',
            catalogueCode: 'DIN-VST-601',
            materialRef: 'Solid CP Teakwood with non-toxic herbal oil polish',
            estimatedCost: 49000
          }
        ],
        whyItFitsOverall: 'Ensures zero structural or elemental conflicts while providing spacious open circulation.',
        pros: ['98% Vastu compliance score', 'Keeps central Brahmasthan open and airy'],
        cons: ['Restricts sofa position strictly to the South-West / West wall'],
        layoutSvgPreview: 'VASTU_FLOW'
      }
    ],

    'ROOM-BED2-01': [
      {
        id: 'LAYOUT-BED2-OPT1',
        optionCode: 'LAYOUT_1',
        title: 'Option 1: Dual-Monitor Ergonomic Workstation & Storage Wall',
        tagline: '5.5ft Desk Facing North Window • Full-Span Wardrobe • Daybed / Sleeper Sofa',
        priorityTheme: 'WFH_PRODUCTIVITY',
        circulationScore: 96,
        storageCapacityCuFt: 240,
        minClearancePassageFt: 3.4,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Directly fulfills the customer prompt: "a work desk in the second bedroom and lots of storage". Positions a 5.5ft custom desk under the North window for glare-free daylight, accompanied by a 7ft wardrobe with internal shelving and a sofa-cum-bed for guests.',
        furnitureItems: [
          {
            id: 'F-BED2-101',
            name: 'Executive Ergonomic Workstation with Cable Spine',
            category: 'WORK_DESK',
            widthFt: 5.5,
            depthFt: 2.3,
            heightFt: 2.5,
            positionXPercent: 25,
            positionYPercent: 10,
            rotationDeg: 0,
            clearanceDistanceFt: 3.8,
            whyItFits: 'Positioned perpendicular to North window; eliminates screen reflection on dual monitors while granting pleasant natural view.',
            catalogueCode: 'DSK-ERG-501',
            materialRef: 'Solid Oak edge banding with matte anti-fingerprint laminate surface',
            estimatedCost: 34000
          },
          {
            id: 'F-BED2-102',
            name: 'Floor-to-Ceiling 3-Door Sliding Wardrobe with Bookshelf',
            category: 'STORAGE',
            widthFt: 7.0,
            depthFt: 2.0,
            heightFt: 9.5,
            positionXPercent: 80,
            positionYPercent: 20,
            rotationDeg: 90,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Sliding doors require zero pull-out swing clearance, fitting seamlessly beside bedroom entry door.',
            catalogueCode: 'WRD-SLD-701',
            materialRef: 'BWP Marine Ply with soft-close Blum sliding hardware',
            estimatedCost: 78000
          },
          {
            id: 'F-BED2-103',
            name: 'Comfort Plush Sofa-Cum-Bed (Queen Size Foldout)',
            category: 'BED',
            widthFt: 5.5,
            depthFt: 3.2,
            heightFt: 2.7,
            positionXPercent: 25,
            positionYPercent: 65,
            rotationDeg: 0,
            clearanceDistanceFt: 3.4,
            whyItFits: 'Folds up into a neat 3.2ft deep sofa during office hours; unfolds to 6.5ft bed when guests stay over.',
            catalogueCode: 'BED-SCB-201',
            materialRef: 'High-resilience foam with washable woven fabric cover',
            estimatedCost: 45000
          }
        ],
        whyItFitsOverall: 'Separates the work quadrant from the rest zone while guaranteeing 3.4ft unobstructed access from the south door.',
        pros: ['Dedicated ergonomic work setup for full-day productivity', 'Preserves dual-use guest bedroom capability'],
        cons: ['Requires folding sofa when switching to guest bed'],
        layoutSvgPreview: 'WFH_BEDROOM_1'
      },
      {
        id: 'LAYOUT-BED2-OPT2',
        optionCode: 'LAYOUT_2',
        title: 'Option 2: Deep Storage Sanctuary with Integrated Murphy Desk Bed',
        tagline: '320 cu.ft Storage • Hydraulic Murphy Bed with Attached Flip Desk',
        priorityTheme: 'STORAGE_MAX',
        circulationScore: 94,
        storageCapacityCuFt: 320,
        minClearancePassageFt: 3.6,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Maximizes floor space through a vertical Murphy bed with integrated writing desk. When the bed is folded up, the room functions as a spacious 132 sq.ft office with wall-to-wall storage closets.',
        furnitureItems: [
          {
            id: 'F-BED2-201',
            name: 'Hydraulic Wall Bed with Auto-Balancing 5ft Desk',
            category: 'BED',
            widthFt: 5.5,
            depthFt: 2.0,
            heightFt: 8.5,
            positionXPercent: 20,
            positionYPercent: 20,
            rotationDeg: 0,
            clearanceDistanceFt: 4.5,
            whyItFits: 'Desk remains horizontal while bed folds down, keeping monitors and laptop undisturbed.',
            catalogueCode: 'BED-MRP-301',
            materialRef: 'Heavy gauge Italian mechanism with BWR plywood carcass',
            estimatedCost: 95000
          },
          {
            id: 'F-BED2-202',
            name: 'Wall-to-Wall 4-Door Wardrobe with Overhead Lofts',
            category: 'STORAGE',
            widthFt: 9.0,
            depthFt: 2.0,
            heightFt: 9.5,
            positionXPercent: 75,
            positionYPercent: 20,
            rotationDeg: 90,
            clearanceDistanceFt: 3.6,
            whyItFits: 'Provides massive 210 cu.ft of dedicated wardrobe and linen storage without hindering window or door.',
            catalogueCode: 'WRD-LOF-401',
            materialRef: 'Merino anti-scratch laminate with champagne gold handles',
            estimatedCost: 88000
          }
        ],
        whyItFitsOverall: 'Unlocks maximum open floor space during working hours while offering massive wardrobe capacity.',
        pros: ['Highest storage volume in bedroom (320 cu.ft)', 'Uncompromised professional office appearance for Zoom meetings'],
        cons: ['Higher investment in specialized Murphy hardware'],
        layoutSvgPreview: 'STORAGE_MAX'
      },
      {
        id: 'LAYOUT-BED2-OPT3',
        optionCode: 'LAYOUT_3',
        title: 'Option 3: L-Shaped Executive Desk & Library Suite',
        tagline: '7ft Executive Return Desk • Floor-to-Ceiling Book Credenza • Day Lounger',
        priorityTheme: 'WFH_PRODUCTIVITY',
        circulationScore: 92,
        storageCapacityCuFt: 220,
        minClearancePassageFt: 3.2,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Focused strictly on professional research, coding, or trading with an expansive L-shaped workstation and floor-to-ceiling library.',
        furnitureItems: [
          {
            id: 'F-BED2-301',
            name: 'L-Shaped Executive Workstation',
            category: 'WORK_DESK',
            widthFt: 6.5,
            depthFt: 4.5,
            heightFt: 2.5,
            positionXPercent: 20,
            positionYPercent: 15,
            rotationDeg: 0,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Tucks into corner with direct window view; provides abundant workspace for 3 monitors and printer.',
            catalogueCode: 'DSK-LSH-401',
            materialRef: 'Warm Teak with powder-coated black steel support legs',
            estimatedCost: 48000
          },
          {
            id: 'F-BED2-302',
            name: 'Floor-to-Ceiling Library Credenza & Display',
            category: 'STORAGE',
            widthFt: 6.0,
            depthFt: 1.2,
            heightFt: 9.5,
            positionXPercent: 80,
            positionYPercent: 20,
            rotationDeg: 90,
            clearanceDistanceFt: 3.4,
            whyItFits: 'Slim 14" depth avoids crowding room walkway while housing 180+ reference books.',
            catalogueCode: 'LIB-WAL-601',
            materialRef: 'Natural veneer with warm LED spot shelves',
            estimatedCost: 56000
          },
          {
            id: 'F-BED2-303',
            name: 'Compact Daybed with Underbed Drawers',
            category: 'BED',
            widthFt: 4.0,
            depthFt: 6.5,
            heightFt: 2.2,
            positionXPercent: 20,
            positionYPercent: 68,
            rotationDeg: 0,
            clearanceDistanceFt: 3.2,
            whyItFits: 'Comfortable day lounger for reading breaks or occasional overnight guest.',
            catalogueCode: 'BED-DAY-101',
            materialRef: 'Teak frame with high-density foam cushion',
            estimatedCost: 36000
          }
        ],
        whyItFitsOverall: 'Heavy duty workspace with acoustic wall backing and generous storage.',
        pros: ['Unmatched desk surface for heavy multitaskers', 'Dedicated library shelving'],
        cons: ['Single bed size limits dual guest occupancy'],
        layoutSvgPreview: 'WFH_FOCUS'
      },
      {
        id: 'LAYOUT-BED2-OPT4',
        optionCode: 'LAYOUT_4',
        title: 'Option 4: Acoustic Podcast / Media Studio & Daybed Lounge',
        tagline: 'High-NRC Wall Battens • Ergonomic Broadcast Desk • Velvet Daybed Sleeper',
        priorityTheme: 'LUXURY_ENTERTAINING',
        circulationScore: 95,
        storageCapacityCuFt: 250,
        minClearancePassageFt: 3.4,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Designed for content creators and hybrid executives with sound-dampening fluted wood walls, dedicated studio console, and velvet lounge daybed for overnight guests.',
        furnitureItems: [
          {
            id: 'F-BED2-401',
            name: 'Broadcast Studio Acoustic Console (6ft)',
            category: 'WORK_DESK',
            widthFt: 6.0,
            depthFt: 2.8,
            heightFt: 2.5,
            positionXPercent: 20,
            positionYPercent: 15,
            rotationDeg: 0,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Positioned against North acoustic wall; built-in cable trays hide all microphone and interface wiring.',
            catalogueCode: 'DSK-STU-601',
            materialRef: 'Matte black anti-reflective birch ply with brass grommets',
            estimatedCost: 52000
          },
          {
            id: 'F-BED2-402',
            name: 'Acoustic Wood Slat Wall with Integrated Dimmable LED',
            category: 'JOINERY',
            widthFt: 10.0,
            depthFt: 0.5,
            heightFt: 9.5,
            positionXPercent: 15,
            positionYPercent: 5,
            rotationDeg: 0,
            clearanceDistanceFt: 4.0,
            whyItFits: 'Deadens audio echo for broadcast quality voice recording and video calls.',
            catalogueCode: 'ACO-SLT-201',
            materialRef: 'Natural smoked walnut veneer on PET recycled acoustic felt backing',
            estimatedCost: 44000
          },
          {
            id: 'F-BED2-403',
            name: 'Convertible Velvet Daybed with Hydro Base',
            category: 'BED',
            widthFt: 3.8,
            depthFt: 6.5,
            heightFt: 2.4,
            positionXPercent: 20,
            positionYPercent: 68,
            rotationDeg: 0,
            clearanceDistanceFt: 3.4,
            whyItFits: 'Functions as podcast guest interview sofa during day; folds flat into twin bed.',
            catalogueCode: 'BED-VLV-101',
            materialRef: 'Plush stain-resistant rust velvet with solid beechwood legs',
            estimatedCost: 48000
          }
        ],
        whyItFitsOverall: 'Acoustic privacy and recording studio quality with seamless guest hospitality.',
        pros: ['Professional acoustics with NRC 0.88', 'Chic studio appearance for webcam background'],
        cons: ['Requires dedicated acoustic panel mounting along north perimeter'],
        layoutSvgPreview: 'STUDIO_LOUNGE'
      },
      {
        id: 'LAYOUT-BED2-OPT5',
        optionCode: 'LAYOUT_5',
        title: 'Option 5: Vastu Study Sanctuary with East-Facing Desk & Light Prana Zone',
        tagline: 'East-Facing Teak Desk • Open Northeast Sector • South Wardrobe Boundary',
        priorityTheme: 'VASTU_COMPLIANT',
        circulationScore: 98,
        storageCapacityCuFt: 290,
        minClearancePassageFt: 3.6,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Positions student/executive study desk facing East to harness solar intellect energies. Northeast corner is kept completely open with a small oxygenating biophilic plant display.',
        furnitureItems: [
          {
            id: 'F-BED2-501',
            name: 'Solid Teak East-Facing Study Desk',
            category: 'WORK_DESK',
            widthFt: 5.0,
            depthFt: 2.5,
            heightFt: 2.5,
            positionXPercent: 25,
            positionYPercent: 20,
            rotationDeg: 0,
            clearanceDistanceFt: 3.6,
            whyItFits: 'Oriented so user faces East while studying; optimal solar orientation per Vastu principles.',
            catalogueCode: 'DSK-VST-301',
            materialRef: 'CP Teak with non-toxic herbal oil polish and brass corner caps',
            estimatedCost: 38000
          },
          {
            id: 'F-BED2-502',
            name: '3-Door Sliding Teak Finish Wardrobe on South Wall',
            category: 'STORAGE',
            widthFt: 7.0,
            depthFt: 2.0,
            heightFt: 9.5,
            positionXPercent: 80,
            positionYPercent: 20,
            rotationDeg: 90,
            clearanceDistanceFt: 3.6,
            whyItFits: 'Heavy storage placed in South quadrant to ground spatial energy.',
            catalogueCode: 'WRD-VST-501',
            materialRef: 'BWP Marine ply with natural teak laminate and soft-close sliding tracks',
            estimatedCost: 72000
          },
          {
            id: 'F-BED2-503',
            name: 'Single Hydraulic Storage Bed with South Head Position',
            category: 'BED',
            widthFt: 3.8,
            depthFt: 6.5,
            heightFt: 2.2,
            positionXPercent: 25,
            positionYPercent: 68,
            rotationDeg: 0,
            clearanceDistanceFt: 3.6,
            whyItFits: 'Headboard faces South ensuring restful REM sleep according to magnetic Vastu grid.',
            catalogueCode: 'BED-VST-101',
            materialRef: 'Seasoned teak wood with organic cotton head padding',
            estimatedCost: 39000
          }
        ],
        whyItFitsOverall: 'Vastu-aligned clarity and academic focus with natural cross-ventilation.',
        pros: ['Maximized positive morning sunlight', 'Unobstructed 3.6ft clear circulation corridor'],
        cons: ['Strict orientation constraints limit alternate furniture re-arrangement'],
        layoutSvgPreview: 'VASTU_STUDY'
      }
    ],

    'ROOM-MBED-01': [
      {
        id: 'LAYOUT-MBED-OPT1',
        optionCode: 'LAYOUT_1',
        title: 'Option 1: King Suite with Acoustic Headboard Wall & 10ft Wardrobe',
        tagline: 'Grounded South-West King Bed • Full-Span 10ft Wardrobe • 3.2ft En-Suite Clearance',
        priorityTheme: 'VASTU_COMPLIANT',
        circulationScore: 97,
        storageCapacityCuFt: 310,
        minClearancePassageFt: 3.2,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Anchors a 6.5ft × 6.5ft King Bed against the South wall with padded acoustic headboard panelling. A 10-ft floor-to-ceiling 4-door wardrobe lines the West wall leaving a clear 3.2ft path to the attached master bathroom.',
        furnitureItems: [
          {
            id: 'F-MBED-101',
            name: 'King Size Hydraulic Storage Bed with Acoustic Headboard',
            category: 'BED',
            widthFt: 6.5,
            depthFt: 6.8,
            heightFt: 4.0,
            positionXPercent: 25,
            positionYPercent: 20,
            rotationDeg: 0,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Placed on South wall with head to South; provides 3.5ft clearance on both sides for easy bed making.',
            catalogueCode: 'BED-KNG-901',
            materialRef: 'Padded acoustic velvet upholstery with hydraulic gas-lift steel frame',
            estimatedCost: 88000
          },
          {
            id: 'F-MBED-102',
            name: 'Full-Span 10ft 4-Door Wardrobe with Internal Dresser',
            category: 'STORAGE',
            widthFt: 10.0,
            depthFt: 2.0,
            heightFt: 9.5,
            positionXPercent: 82,
            positionYPercent: 15,
            rotationDeg: 90,
            clearanceDistanceFt: 3.2,
            whyItFits: 'Hugs East wall seamlessly; 4 sliding doors require zero swing corridor space.',
            catalogueCode: 'WRD-SLD-1001',
            materialRef: 'BWP Marine Ply with soft-close Blum sliding tracks & PU satin finish',
            estimatedCost: 125000
          },
          {
            id: 'F-MBED-103',
            name: 'Floating Bedside Nightstands (Pair)',
            category: 'JOINERY',
            widthFt: 1.8,
            depthFt: 1.3,
            heightFt: 1.2,
            positionXPercent: 10,
            positionYPercent: 25,
            rotationDeg: 0,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Wall-mounted off the floor; enables zero-effort vacuuming and floor robot cleaning.',
            catalogueCode: 'TAB-BED-201',
            materialRef: 'Natural smoked teak veneer with wireless phone charging pad',
            estimatedCost: 22000
          }
        ],
        whyItFitsOverall: 'Vastu-authentic headboard placement with expansive 10ft wardrobe and completely unhindered passage to en-suite bath.',
        pros: ['Massive wardrobe storage volume (310 cu.ft)', 'High acoustic comfort with sound-dampening velvet wall', 'Optimal Vastu compliance'],
        cons: ['Requires precision millwork installation for the 10ft sliding wardrobe'],
        layoutSvgPreview: 'MASTER_SUITE'
      },
      {
        id: 'LAYOUT-MBED-OPT2',
        optionCode: 'LAYOUT_2',
        title: 'Option 2: Executive Luxury Hotel Suite with Lounge Chaise & Vanity',
        tagline: 'Curved Lounge Chaise • Fluted Glass Vanity Console • Boiserie Accent Trims',
        priorityTheme: 'LUXURY_ENTERTAINING',
        circulationScore: 94,
        storageCapacityCuFt: 260,
        minClearancePassageFt: 3.2,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Hotel-grade retreat with dedicated vanity dressing console, backlit fluted full-length mirror, low-profile king platform, and a reading chaise lounge by the South window.',
        furnitureItems: [
          {
            id: 'F-MBED-201',
            name: 'Low-Profile Japanese Platform Bed with Extended Back-Ledge',
            category: 'BED',
            widthFt: 7.0,
            depthFt: 7.0,
            heightFt: 2.5,
            positionXPercent: 25,
            positionYPercent: 20,
            rotationDeg: 0,
            clearanceDistanceFt: 3.4,
            whyItFits: 'Low 12" height visually expands room volume under the 9.5ft false ceiling.',
            catalogueCode: 'BED-PLF-501',
            materialRef: 'Solid ashwood frame with woven rattan headrest',
            estimatedCost: 76000
          },
          {
            id: 'F-MBED-202',
            name: 'Floating Dressing Vanity with LED Fluted Mirror',
            category: 'JOINERY',
            widthFt: 4.5,
            depthFt: 1.4,
            heightFt: 6.5,
            positionXPercent: 80,
            positionYPercent: 65,
            rotationDeg: 90,
            clearanceDistanceFt: 3.2,
            whyItFits: 'Located adjacent to bathroom door for seamless morning grooming routine.',
            catalogueCode: 'VAN-FLT-301',
            materialRef: 'Engineered quartz top with warm 3000K high-CRI ring luminaire',
            estimatedCost: 42000
          },
          {
            id: 'F-MBED-203',
            name: 'Velvet Window Reading Chaise',
            category: 'SEATING',
            widthFt: 5.5,
            depthFt: 2.6,
            heightFt: 2.4,
            positionXPercent: 25,
            positionYPercent: 75,
            rotationDeg: 0,
            clearanceDistanceFt: 3.2,
            whyItFits: 'Placed below South window without blocking sunlight; cozy relaxation corner.',
            catalogueCode: 'CHS-WIN-101',
            materialRef: 'Dust-resistant olive green velvet with brass capped feet',
            estimatedCost: 38000
          }
        ],
        whyItFitsOverall: 'Boutique 5-star hotel ambiance with balanced luxury and uncompromised circulation.',
        pros: ['Dedicated dressing vanity station', 'Private window relaxation zone'],
        cons: ['Slightly lower storage than full 10-ft wardrobe in Option 1'],
        layoutSvgPreview: 'HOTEL_SUITE'
      },
      {
        id: 'LAYOUT-MBED-OPT3',
        optionCode: 'LAYOUT_3',
        title: 'Option 3: Minimalist Zen Sanctuary with Low-Platform Tatami Bed & Concealed Dressing',
        tagline: 'Ashwood Tatami Platform Bed • Concealed Flush-Door Wardrobe • Sand Microcement Finishes',
        priorityTheme: 'OPEN_LIVING',
        circulationScore: 98,
        storageCapacityCuFt: 290,
        minClearancePassageFt: 3.6,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Japanese-Scandinavian Japandi master retreat with ultra-low ashwood platform bed, concealed push-to-open flush wardrobe, and tranquil sand microcement wall textures.',
        furnitureItems: [
          {
            id: 'F-MBED-301',
            name: 'Low-Slung Solid Ashwood Tatami Platform Bed',
            category: 'BED',
            widthFt: 6.8,
            depthFt: 7.0,
            heightFt: 1.8,
            positionXPercent: 25,
            positionYPercent: 20,
            rotationDeg: 0,
            clearanceDistanceFt: 3.6,
            whyItFits: 'Ultra-low 10" bed platform creates serene vertical breathing room beneath false ceiling.',
            catalogueCode: 'BED-TAT-701',
            materialRef: 'Solid white ash wood with woven natural igusa tatami matting',
            estimatedCost: 82000
          },
          {
            id: 'F-MBED-302',
            name: 'Wall-to-Wall Flush Concealed Wardrobe',
            category: 'STORAGE',
            widthFt: 9.5,
            depthFt: 2.0,
            heightFt: 9.5,
            positionXPercent: 82,
            positionYPercent: 15,
            rotationDeg: 90,
            clearanceDistanceFt: 3.6,
            whyItFits: 'Flush seamless doors blend into wall plaster; zero protruding handles for pure minimalism.',
            catalogueCode: 'WRD-FLS-901',
            materialRef: 'Merino supermatte greige laminate with German soft-close push mechanisms',
            estimatedCost: 118000
          },
          {
            id: 'F-MBED-303',
            name: 'Floating Ashwood Night Ledges with Wireless Touch Dimmers',
            category: 'JOINERY',
            widthFt: 2.0,
            depthFt: 1.2,
            heightFt: 0.8,
            positionXPercent: 10,
            positionYPercent: 25,
            rotationDeg: 0,
            clearanceDistanceFt: 3.8,
            whyItFits: 'Minimal cantilevered ledges with zero floor footprint.',
            catalogueCode: 'TAB-LED-101',
            materialRef: 'Solid ashwood with concealed cable routing and touch dimmers',
            estimatedCost: 24000
          }
        ],
        whyItFitsOverall: 'Japandi architectural serenity with expansive 3.6ft clear walkway and zero visual clutter.',
        pros: ['Highest visual volume in room', 'Easy floor cleaning with cantilevered ledges'],
        cons: ['Low bed height requires agile mobility'],
        layoutSvgPreview: 'ZEN_SANCTUARY'
      },
      {
        id: 'LAYOUT-MBED-OPT4',
        optionCode: 'LAYOUT_4',
        title: 'Option 4: Storage-Max Dual Wardrobe Suite with Built-in Luggage Lofts & Dresser',
        tagline: 'Dual Full-Height Wardrobes • 410 cu.ft Massive Storage • Integrated Dresser Mirror',
        priorityTheme: 'STORAGE_MAX',
        circulationScore: 93,
        storageCapacityCuFt: 410,
        minClearancePassageFt: 3.1,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Maximizes vertical and horizontal cabinetry for clients requiring maximum luggage, seasonal quilt, and wardrobe storage volume without encroaching into door paths.',
        furnitureItems: [
          {
            id: 'F-MBED-401',
            name: 'King Bed with Hydraulic Lift Deep Trunk Storage',
            category: 'BED',
            widthFt: 6.5,
            depthFt: 6.8,
            heightFt: 3.8,
            positionXPercent: 25,
            positionYPercent: 20,
            rotationDeg: 0,
            clearanceDistanceFt: 3.2,
            whyItFits: 'Houses 4 large suitcases inside hydraulic base with zero visual footprint.',
            catalogueCode: 'BED-TRK-801',
            materialRef: 'Heavy steel reinforced box frame with stain-resistant linen upholstery',
            estimatedCost: 92000
          },
          {
            id: 'F-MBED-402',
            name: 'Dual Full-Height 11ft Wardrobe with Overhead Storage Lofts',
            category: 'STORAGE',
            widthFt: 11.0,
            depthFt: 2.0,
            heightFt: 9.5,
            positionXPercent: 82,
            positionYPercent: 12,
            rotationDeg: 90,
            clearanceDistanceFt: 3.1,
            whyItFits: 'Touches ceiling with 410 cu.ft internal storage volume; 3 sliding doors.',
            catalogueCode: 'WRD-LFT-1101',
            materialRef: 'BWP Marine ply with anti-scratch laminate and internal LED motion sensors',
            estimatedCost: 145000
          },
          {
            id: 'F-MBED-403',
            name: 'Integrated Dressing Mirror with Hidden Jewellery Carousel',
            category: 'JOINERY',
            widthFt: 2.5,
            depthFt: 0.8,
            heightFt: 6.5,
            positionXPercent: 10,
            positionYPercent: 75,
            rotationDeg: 0,
            clearanceDistanceFt: 3.4,
            whyItFits: 'Slim 9" depth wall cabinet with full-length mirror face and lockable safe drawer.',
            catalogueCode: 'VAN-SEC-201',
            materialRef: 'Smoked oak with felt-lined carousel trays and digital code lock',
            estimatedCost: 36000
          }
        ],
        whyItFitsOverall: 'Ultimate storage efficiency for urban apartments while preserving strictly verified 3.1ft walkway.',
        pros: ['Massive 410 cu.ft storage volume', 'Lockable safe & jewellery carousel'],
        cons: ['Cabinetry fills entire vertical wall height'],
        layoutSvgPreview: 'STORAGE_MASTER'
      },
      {
        id: 'LAYOUT-MBED-OPT5',
        optionCode: 'LAYOUT_5',
        title: 'Option 5: Vastu Shastra Master Suite with Nairutya Earth Anchor & South Bed Head',
        tagline: 'South Headboard Orientation • Heavy Nairutya Grounding • Northeast Prana Flow',
        priorityTheme: 'VASTU_COMPLIANT',
        circulationScore: 97,
        storageCapacityCuFt: 320,
        minClearancePassageFt: 3.5,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Authentic Vastu master bedroom configuration. Heavy solid teak king bed grounded in South-West sector with headboard to South. East wall sliding wardrobe leaves North and East zones open.',
        furnitureItems: [
          {
            id: 'F-MBED-501',
            name: 'Solid CP Teak King Bed with Organic Cotton Padded Back',
            category: 'BED',
            widthFt: 6.6,
            depthFt: 6.8,
            heightFt: 4.2,
            positionXPercent: 25,
            positionYPercent: 20,
            rotationDeg: 0,
            clearanceDistanceFt: 3.5,
            whyItFits: 'South headboard placement adheres to ancient geomagnetic resting alignment.',
            catalogueCode: 'BED-VST-901',
            materialRef: 'Kiln-seasoned CP Teak with non-toxic natural beeswax finish and pure cotton padding',
            estimatedCost: 96000
          },
          {
            id: 'F-MBED-502',
            name: 'East-Boundary Sliding Teak Wardrobe with Brass Trims',
            category: 'STORAGE',
            widthFt: 9.0,
            depthFt: 2.0,
            heightFt: 9.5,
            positionXPercent: 82,
            positionYPercent: 18,
            rotationDeg: 90,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Placed on East boundary to allow free energy flow from master entrance.',
            catalogueCode: 'WRD-VST-902',
            materialRef: 'CenturyPly Architect BWP with quarter-cut teak veneer and brushed brass inlay',
            estimatedCost: 128000
          },
          {
            id: 'F-MBED-503',
            name: 'Solid Teak Bedside Tables with Brass Inlay (Pair)',
            category: 'JOINERY',
            widthFt: 1.8,
            depthFt: 1.4,
            heightFt: 1.6,
            positionXPercent: 10,
            positionYPercent: 25,
            rotationDeg: 0,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Pairs symmetrically beside king bed in grounding Nairutya zone.',
            catalogueCode: 'TAB-VST-201',
            materialRef: 'Solid Teak wood with warm brass drawer pull handles',
            estimatedCost: 26000
          }
        ],
        whyItFitsOverall: 'Vastu-authentic master bedroom with peaceful geomagnetic alignment and natural teak textures.',
        pros: ['Unmatched mental peace and grounding Vastu harmony', 'Zero door or window conflicts'],
        cons: ['Solid wood joinery requires specialized master carpentering'],
        layoutSvgPreview: 'VASTU_MASTER'
      }
    ],

    'ROOM-KIT-01': [
      {
        id: 'LAYOUT-KIT-OPT1',
        optionCode: 'LAYOUT_1',
        title: 'Option 1: Parallel Gourmet Modular Kitchen with Quartz Island & Breakfast Bar',
        tagline: 'Dual Parallel Counters • 3.5ft Work Triangle • 2-Seater Breakfast Bar',
        priorityTheme: 'OPEN_LIVING',
        circulationScore: 98,
        storageCapacityCuFt: 280,
        minClearancePassageFt: 3.5,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Professional parallel counter layout with wet zone on North and cooking hob on South. Extends into a compact 2-seater quartz breakfast bar overlooking the living room.',
        furnitureItems: [
          {
            id: 'F-KIT-101',
            name: 'Parallel Modular Base & Overhead Cabinetry (12ft run)',
            category: 'JOINERY',
            widthFt: 12.0,
            depthFt: 2.0,
            heightFt: 7.5,
            positionXPercent: 5,
            positionYPercent: 10,
            rotationDeg: 0,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Houses tandem Blum soft-close cutlery, thali, and bottle pull-out baskets.',
            catalogueCode: 'KIT-MOD-1201',
            materialRef: 'Marine grade BWP ply with anti-scratch acrylic shutters and Hafele hinges',
            estimatedCost: 145000
          },
          {
            id: 'F-KIT-102',
            name: 'Engineered Calacatta Quartz Countertop & Seamless Backsplash',
            category: 'JOINERY',
            widthFt: 12.0,
            depthFt: 2.0,
            heightFt: 2.8,
            positionXPercent: 5,
            positionYPercent: 10,
            rotationDeg: 0,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Heat-resistant, stain-proof 20mm quartz with undermount Carysil granite sink.',
            catalogueCode: 'QRT-CAL-201',
            materialRef: 'KalingaStone Calacatta White 20mm engineered quartz slab',
            estimatedCost: 65000
          },
          {
            id: 'F-KIT-103',
            name: 'Integrated Breakfast Bar Counter with Pair of Teak Bar Stools',
            category: 'DINING',
            widthFt: 4.5,
            depthFt: 1.5,
            heightFt: 3.2,
            positionXPercent: 75,
            positionYPercent: 60,
            rotationDeg: 90,
            clearanceDistanceFt: 3.5,
            whyItFits: 'Casual morning breakfast and coffee bar with view towards dining area.',
            catalogueCode: 'BAR-KIT-101',
            materialRef: 'Quartz top with teak wood legs and upholstered counter-height stools',
            estimatedCost: 32000
          }
        ],
        whyItFitsOverall: 'The chef-standard parallel layout eliminates cross-traffic and minimizes cooking steps.',
        pros: ['Optimal golden triangle workflow', 'Dedicated morning breakfast counter'],
        cons: ['Requires strict 3.5ft clearance between parallel platforms'],
        layoutSvgPreview: 'PARALLEL_KITCHEN'
      },
      {
        id: 'LAYOUT-KIT-OPT2',
        optionCode: 'LAYOUT_2',
        title: 'Option 2: L-Shaped Modular Kitchen with Tall Appliance Pantry Tower',
        tagline: 'Tall Pantry Tower • Built-in Oven Cavity • Corner Magic Pull-Out Storage',
        priorityTheme: 'STORAGE_MAX',
        circulationScore: 95,
        storageCapacityCuFt: 340,
        minClearancePassageFt: 3.8,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'L-shaped workflow with full-height 7.5ft appliance pantry tower housing built-in microwave, oven, and pull-out grocery wire baskets. LeMans corner magic pullouts maximize dead corner space.',
        furnitureItems: [
          {
            id: 'F-KIT-201',
            name: 'L-Shaped Modular Counter Suite with Corner Magic Pullouts',
            category: 'JOINERY',
            widthFt: 10.0,
            depthFt: 6.0,
            heightFt: 2.8,
            positionXPercent: 5,
            positionYPercent: 10,
            rotationDeg: 0,
            clearanceDistanceFt: 3.8,
            whyItFits: 'Corner carousel allows 100% utilization of hard-to-reach corner space.',
            catalogueCode: 'KIT-LSH-201',
            materialRef: 'BWP Marine ply with matte PU lacquer shutters and tandem drawers',
            estimatedCost: 135000
          },
          {
            id: 'F-KIT-202',
            name: 'Full-Height Tall Appliance Pantry Tower (7.5ft)',
            category: 'STORAGE',
            widthFt: 2.5,
            depthFt: 2.0,
            heightFt: 7.5,
            positionXPercent: 80,
            positionYPercent: 10,
            rotationDeg: 0,
            clearanceDistanceFt: 3.8,
            whyItFits: 'Houses built-in Bosch oven and 6-tier stainless steel grocery pantry baskets.',
            catalogueCode: 'KIT-PAN-701',
            materialRef: 'BWP ply with Hafele tall larder mechanism and anti-fingerprint laminate',
            estimatedCost: 58000
          }
        ],
        whyItFitsOverall: 'Massive grocery storage capacity with ergonomic appliance heights.',
        pros: ['Huge pantry storage capacity (340 cu.ft)', 'High circulation clearance (3.8ft)'],
        cons: ['Corner mechanism requires precision hardware installation'],
        layoutSvgPreview: 'LSHAPE_KITCHEN'
      },
      {
        id: 'LAYOUT-KIT-OPT3',
        optionCode: 'LAYOUT_3',
        title: 'Option 3: Contemporary Handleless Kitchen with Fluted Glass Crockery Unit',
        tagline: 'Gola Profile Handleless Shutters • Backlit Fluted Glass Vitrine • Granite Sink',
        priorityTheme: 'LUXURY_ENTERTAINING',
        circulationScore: 97,
        storageCapacityCuFt: 290,
        minClearancePassageFt: 3.6,
        doorwayConflictDetected: false,
        windowLightBlocked: false,
        summary: 'Italian minimalist aesthetic with seamless aluminum Gola profile channels, soft-touch matte anti-scratch finishes, and a warm backlit fluted glass crockery vitrine.',
        furnitureItems: [
          {
            id: 'F-KIT-301',
            name: 'Gola Profile Handleless Modular Kitchen Run',
            category: 'JOINERY',
            widthFt: 12.0,
            depthFt: 2.0,
            heightFt: 7.5,
            positionXPercent: 5,
            positionYPercent: 10,
            rotationDeg: 0,
            clearanceDistanceFt: 3.6,
            whyItFits: 'Finger-pull Gola profile eliminates handles for a clean, architectural monolithic aesthetic.',
            catalogueCode: 'KIT-GOL-301',
            materialRef: 'Merino supermatte laminates with aluminum black Gola profiles',
            estimatedCost: 152000
          },
          {
            id: 'F-KIT-302',
            name: 'Backlit Fluted Glass Vitrine Crockery Unit',
            category: 'STORAGE',
            widthFt: 4.0,
            depthFt: 1.2,
            heightFt: 6.5,
            positionXPercent: 75,
            positionYPercent: 15,
            rotationDeg: 90,
            clearanceDistanceFt: 3.6,
            whyItFits: 'Display for fine crystal glasses and porcelain with ambient 3000K warm LED glow.',
            catalogueCode: 'KIT-GLS-401',
            materialRef: 'Anodized black aluminum frame with toughened fluted glass and LED channels',
            estimatedCost: 46000
          }
        ],
        whyItFitsOverall: 'Showroom-grade luxury with easy maintenance and scratch resistance.',
        pros: ['Monolithic seamless appearance', 'Backlit glass creates evening mood lighting'],
        cons: ['Gola profiles require daily wiping along recess groove'],
        layoutSvgPreview: 'HANDLELESS_KITCHEN'
      }
    ]
  },

  selectedLayoutIdByRoom: {
    'ROOM-LIV-01': 'LAYOUT-LIV-OPT1',
    'ROOM-BED2-01': 'LAYOUT-BED2-OPT1',
    'ROOM-MBED-01': 'LAYOUT-MBED-OPT1',
    'ROOM-KIT-01': 'LAYOUT-KIT-OPT1'
  },

  conceptVersions: [
    {
      id: 'VCP-001',
      conceptVersionCode: 'VCP-v1.0',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-LIV-01',
      roomName: 'Living & Dining Forum',
      layoutOptionId: 'LAYOUT-LIV-OPT1',
      layoutOptionName: 'Option 1: Max Open Flow & Social Living',
      layoutSummary: '3-Seater Low-Slung Sofa on North Wall + Floating TV Console on South + Extendable 6-Seater Teak Dining',
      styleTheme: 'Modern Warm Interior (Warm Teak, Textured Cream Bouclé, Fluted Wall Slats, 2700K Indirect Coves)',
      materials: [
        {
          trade: 'Flooring',
          item: 'Imported Botticino Classico Italian Marble Look Glazed Vitrified Tiles (1200x1800mm)',
          specification: 'Simpolo / Kajaria Royale zero-grout rectified vitrified slabs with matte satin polish',
          catalogueCode: 'MAT-FLR-01',
          swatchImageUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
          costPerUnit: 145,
          unit: 'sq.ft',
          estimatedQuantity: 240,
          totalCost: 34800
        },
        {
          trade: 'Wall Panel & Joinery',
          item: 'Acoustic Smoked Teak Fluted Wall Slats with Concealed LED Channel',
          specification: 'CenturyPly Architect BWP base with natural quarter-cut smoked teak veneer & PU satin finish',
          catalogueCode: 'MAT-PAN-02',
          swatchImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
          costPerUnit: 380,
          unit: 'sq.ft',
          estimatedQuantity: 120,
          totalCost: 45600
        },
        {
          trade: 'Loose Furniture',
          item: 'Curved 3-Seater Low-Slung Sofa in Premium Oatmeal Bouclé',
          specification: 'Solid salwood internal frame with 40-density Sleepwell foam & stain-resistant bouclé',
          catalogueCode: 'FUR-SOF-301',
          costPerUnit: 68000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 68000
        },
        {
          trade: 'Dining Suite',
          item: 'Solid Teak 6-Seater Dining Table with Round Edges',
          specification: 'Seasoned CP Teak with matte food-grade hardwax oil finish',
          catalogueCode: 'DIN-TBL-602',
          costPerUnit: 46000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 46000
        },
        {
          trade: 'Architectural Lighting',
          item: 'Magnetic Track Lighting with 3000K CRI 95+ Low-Glare Spot Modules',
          specification: 'DALI-2 addressable architectural slim track with hidden perimeter ceiling coves',
          catalogueCode: 'LGT-TRK-01',
          costPerUnit: 350,
          unit: 'r.ft',
          estimatedQuantity: 45,
          totalCost: 15750
        }
      ],
      budgetAllocated: 650000,
      budgetActualEstimated: 588000,
      renderImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Combines organic warmth with clean geometric lines. The 3.8ft central corridor ensures direct access to the seaface balcony without bumping into furniture corners.',
      lightingPlan: 'Layered 3-zone lighting: (1) High-CRI 2700K cove light for soft evening ambiance; (2) Magnetic spotlights over coffee table; (3) Hand-blown glass pendant over dining.',
      colorPalette: ['#F5F2EB', '#C4A482', '#3E3630', '#7E8A78', '#D4AF37'],
      clientFeedbackHistory: [],
      status: 'REVISED_CONCEPT',
      createdAt: '2026-03-11T16:00:00Z',
      updatedAt: '2026-03-12T15:00:00Z'
    },
    {
      id: 'VCP-002',
      conceptVersionCode: 'VCP-v1.1',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-LIV-01',
      roomName: 'Living & Dining Forum',
      layoutOptionId: 'LAYOUT-LIV-OPT1',
      layoutOptionName: 'Option 1: Max Open Flow (Revised for Simpler TV Wall & 6-Seat Dining)',
      layoutSummary: 'Simplified TV wall in warm microcement + 6-seater dining table with verified 3.2ft chair clearance',
      styleTheme: 'Modern Warm Interior (Simplified Minimalist TV Wall, Sand Microcement, Teak Accents, 6-Seater Dining)',
      materials: [
        {
          trade: 'Flooring',
          item: 'Imported Botticino Vitrified Slabs (1200x1800mm)',
          specification: 'Matte satin anti-slip finish',
          catalogueCode: 'MAT-FLR-01',
          costPerUnit: 145,
          unit: 'sq.ft',
          estimatedQuantity: 240,
          totalCost: 34800
        },
        {
          trade: 'TV Wall Finishes',
          item: 'Italian Stucco Microcement Wall Finish (Warm Greige)',
          specification: 'Asian Paints Royale Stucco lime-based troweled finish with zero VOC',
          catalogueCode: 'MAT-STU-01',
          costPerUnit: 110,
          unit: 'sq.ft',
          estimatedQuantity: 120,
          totalCost: 13200
        },
        {
          trade: 'TV Joinery',
          item: 'Low-Profile Floating Teak Credenza with Concealed Wiring Chamber',
          specification: 'Seasoned Teak veneer with soft-close push drawers',
          catalogueCode: 'MED-TVC-104',
          costPerUnit: 32000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 32000
        },
        {
          trade: 'Dining Suite',
          item: 'Dedicated 6-Seater Solid Teak Dining Table (5.5ft × 3.0ft)',
          specification: 'CP Teak with rounded corners and 6 upholstered chairs',
          catalogueCode: 'DIN-TBL-602',
          costPerUnit: 48000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 48000
        },
        {
          trade: 'Loose Furniture',
          item: 'Curved 3-Seater Low-Slung Sofa in Oatmeal Bouclé',
          specification: 'High density foam with scotchgard protection',
          catalogueCode: 'FUR-SOF-301',
          costPerUnit: 68000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 68000
        }
      ],
      budgetAllocated: 650000,
      budgetActualEstimated: 545000,
      renderImageUrl: '/assets/images/villa253_guest_suite_1790833711200.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Revised according to client feedback. Fluted slats replaced with serene microcement plaster that makes the TV visually disappear. Dining table confirmed at 5.5ft length accommodating 6 persons comfortably with 3.2ft kitchen doorway clearance maintained.',
      lightingPlan: 'Soft warm perimeter cove lighting + dimmable downward spot over credenza.',
      colorPalette: ['#FAF8F5', '#C5A880', '#4A3E37', '#938B83', '#E6DFD5'],
      clientFeedbackHistory: [
        {
          id: 'FB-001',
          timestamp: '2026-03-12 14:30',
          author: 'Rohit Verma (Client)',
          role: 'CLIENT',
          feedbackText: 'We love the warm tones! But can you make the TV wall simpler? The fluted slats behind the screen feel a bit busy. Also please make sure the dining table definitely seats 6 people comfortably.',
          actionTaken: 'Simpler TV wall created; 6-seater dining verified with circulation lock.',
          conceptVersionGenerated: 'VCP-v1.1',
          status: 'RESOLVED'
        },
        {
          id: 'FB-002',
          timestamp: '2026-03-13 11:15',
          author: 'Priya Verma (Client Co-Owner)',
          role: 'CLIENT',
          feedbackText: 'This looks perfect! The TV wall is calm and elegant, and the 6-seater dining layout gives us plenty of room to host. We approve this concept for execution.',
          actionTaken: 'Ready for formal approval and automated BOQ linking.',
          conceptVersionGenerated: 'VCP-v1.1',
          status: 'RESOLVED'
        }
      ],
      status: 'CLIENT_APPROVED',
      approvedDate: '2026-03-13T12:00:00Z',
      approvedBy: 'Rohit Verma & Priya Verma (Clients)',
      boqLinkedCount: 8,
      createdAt: '2026-03-12T16:00:00Z',
      updatedAt: '2026-03-13T12:00:00Z'
    },
    {
      id: 'VCP-LIV-OPT2',
      conceptVersionCode: 'VCP-v2.0',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-LIV-01',
      roomName: 'Living & Dining Forum',
      layoutOptionId: 'LAYOUT-LIV-OPT2',
      layoutOptionName: 'Option 2: Storage-Max with Integrated Floor-to-Ceiling Joinery',
      layoutSummary: '12ft Floor-to-Ceiling Architectural Storage Media Wall + Banquette Dining with Under-Seat Drawers + Concealed Foyer Vestibule',
      styleTheme: 'Architectural Joinery & Storage Sanctuary (Suede Matte Laminate, Smoked Oak Slats, Banquette Dining)',
      materials: [
        {
          trade: 'Architectural Joinery',
          item: 'Full-Span 12ft Floor-to-Ceiling Media & Storage Wall',
          specification: 'BWP Marine Ply with Merino anti-scratch suede laminate and push-to-open Blum hardware',
          catalogueCode: 'STR-WAL-901',
          costPerUnit: 115000,
          unit: 'set',
          estimatedQuantity: 1,
          totalCost: 115000
        },
        {
          trade: 'Modular Seating',
          item: 'L-Shaped Sectional with Internal Gas-Lift Storage Bins',
          specification: 'High-resilience foam with stain-resistant performance weave',
          catalogueCode: 'FUR-SEC-502',
          costPerUnit: 82000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 82000
        },
        {
          trade: 'Dining Suite',
          item: '6-Seater Banquette Dining with Under-Seat Deep Storage Drawers',
          specification: 'BWP carcass with high-density foam & wipeable faux-leather upholstery',
          catalogueCode: 'DIN-BNQ-401',
          costPerUnit: 52000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 52000
        },
        {
          trade: 'Foyer Joinery',
          item: 'Concealed Entryway Foyer Shoe & Coat Cabinet',
          specification: 'Natural teak laminate with perforated brass ventilation grills',
          catalogueCode: 'STR-FOY-101',
          costPerUnit: 28000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 28000
        },
        {
          trade: 'Flooring',
          item: 'Imported Botticino Vitrified Slabs (1200x1800mm)',
          specification: 'Matte satin anti-slip finish',
          catalogueCode: 'MAT-FLR-01',
          costPerUnit: 145,
          unit: 'sq.ft',
          estimatedQuantity: 240,
          totalCost: 34800
        }
      ],
      budgetAllocated: 650000,
      budgetActualEstimated: 618000,
      renderImageUrl: '/assets/images/villa253_gazebo_terrace_1790833723445.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_roof_gazebo_1790830815235.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Directly fulfills the customer prompt requirement for "lots of concealed storage without making rooms feel cramped". All joinery uses vertical wall heights up to 9.5ft false ceiling while strictly maintaining 3.2ft central corridor clearance from front entrance to seaface balcony.',
      lightingPlan: 'Under-cabinet warm 2700K LED strips + ceiling recessed anti-glare downlights.',
      colorPalette: ['#3A3B3C', '#8C7853', '#EAE6DF', '#C4B5A5', '#1F2421'],
      clientFeedbackHistory: [
        {
          id: 'FB-OPT2-01',
          timestamp: '2026-03-12 16:00',
          author: 'Build Storys AI Copilot',
          role: 'AI_COPILOT',
          feedbackText: 'Generated Option 2 to maximize concealed storage volume per client brief.',
          actionTaken: 'Built full-span 390 cu.ft media wall with verified 3.2ft corridor lock.',
          conceptVersionGenerated: 'VCP-v2.0',
          status: 'RESOLVED'
        }
      ],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T16:00:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-LIV-OPT3',
      conceptVersionCode: 'VCP-v3.0',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-LIV-01',
      roomName: 'Living & Dining Forum',
      layoutOptionId: 'LAYOUT-LIV-OPT3',
      layoutOptionName: 'Option 3: Ergonomic WFH Focus & Flexible Living',
      layoutSummary: 'Concealed Roll-Top Work Nook behind Acoustic Louvres + 3-Seater Sofa with Wireless Charging + Slim Floating Dining',
      styleTheme: 'Contemporary Biophilic Living & Acoustic Study Nook (Natural Oak, Acoustic Felt, Dimmable Task Lighting)',
      materials: [
        {
          trade: 'Acoustic Joinery',
          item: 'Concealed Roll-Top Home Office Nook with Fluted Door',
          specification: 'Warm Teak with acoustic felt pinboard backing and internal monitor mount',
          catalogueCode: 'DSK-NOK-201',
          costPerUnit: 44000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 44000
        },
        {
          trade: 'Modular Seating',
          item: 'Modular 3-Seater Sofa with Wireless Charging Armrests',
          specification: 'Taupe chenille with built-in dual USB-C PD ports and high resilience core',
          catalogueCode: 'FUR-SOF-303',
          costPerUnit: 62000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 62000
        },
        {
          trade: 'Dining Suite',
          item: 'Floating 6-Seater Slim Dining Unit with Rounded Safety Corners',
          specification: 'Solid ashwood frame with scratch-proof matte laminate top',
          catalogueCode: 'DIN-TBL-604',
          costPerUnit: 42000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 42000
        },
        {
          trade: 'Flooring',
          item: 'Imported Botticino Vitrified Slabs (1200x1800mm)',
          specification: 'Matte satin anti-slip finish',
          catalogueCode: 'MAT-FLR-01',
          costPerUnit: 145,
          unit: 'sq.ft',
          estimatedQuantity: 240,
          totalCost: 34800
        }
      ],
      budgetAllocated: 650000,
      budgetActualEstimated: 568000,
      renderImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Seamlessly nests a high-productivity home office study nook into the living room alcove. Pocket doors slide closed during entertainment hours to hide monitors and cables, maintaining 3.5ft clearance across all circulation vectors.',
      lightingPlan: 'Task lighting over desk nook with glare-free 4000K LED + warm 2700K ambient cove for evening lounge.',
      colorPalette: ['#EFECE6', '#C8B29B', '#4D443B', '#7A6B5D', '#D9C8B4'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T17:00:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-LIV-OPT4',
      conceptVersionCode: 'VCP-v4.0',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-LIV-01',
      roomName: 'Living & Dining Forum',
      layoutOptionId: 'LAYOUT-LIV-OPT4',
      layoutOptionName: 'Option 4: Luxury Entertaining & Modular Lounge',
      layoutSummary: 'Curved Italian Silhouette 4-Seater Lounge + Backlit Cocktail Bar Credenza + Expandable 8-Seater Dining Setup',
      styleTheme: 'Contemporary Neoclassical Elegance (Boiserie Wall Mouldings, Botticino Marble, Backlit Bar Credenza)',
      materials: [
        {
          trade: 'Designer Seating',
          item: 'Curved Italian Silhouette 4-Seater Sofa in Sand Linen',
          specification: 'Solid seasoned wood frame with brushed bronze feet and high-density pocketed cushions',
          catalogueCode: 'FUR-CRV-401',
          costPerUnit: 92000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 92000
        },
        {
          trade: 'Bar & Joinery',
          item: 'Backlit Cocktail Bar & Wine Credenza with Tinted Fluted Glass',
          specification: 'Warm brass trims, toughened fluted glass, soft-close bottle drawers, and LED shelf illumination',
          catalogueCode: 'BAR-CRD-102',
          costPerUnit: 48000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 48000
        },
        {
          trade: 'Wall Finishes',
          item: 'High-Density Architectural Boiserie Wall Moulding & Satin Finish',
          specification: 'PU wall moulding trim panels with Asian Paints Royale Luxury Matt finish',
          catalogueCode: 'BOI-PAN-101',
          costPerUnit: 120,
          unit: 'sq.ft',
          estimatedQuantity: 160,
          totalCost: 19200
        },
        {
          trade: 'Flooring',
          item: 'Imported Botticino Vitrified Slabs (1200x1800mm)',
          specification: 'Matte satin anti-slip finish',
          catalogueCode: 'MAT-FLR-01',
          costPerUnit: 145,
          unit: 'sq.ft',
          estimatedQuantity: 240,
          totalCost: 34800
        }
      ],
      budgetAllocated: 650000,
      budgetActualEstimated: 635000,
      renderImageUrl: '/assets/images/villa253_master_suite_1790833696550.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Tailored for hospitality and dinner parties. The organic curved sofa softens room corners, directing attention towards the sunset seaface balcony. Backlit cocktail credenza allows hosting drinks without crowding the kitchen entrance.',
      lightingPlan: 'Indirect boiserie cove lighting + warm 2400K backlit vitrine display shelves.',
      colorPalette: ['#FAF8F5', '#C5A880', '#4A3E37', '#938B83', '#E6DFD5'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T18:00:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-LIV-OPT5',
      conceptVersionCode: 'VCP-v5.0',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-LIV-01',
      roomName: 'Living & Dining Forum',
      layoutOptionId: 'LAYOUT-LIV-OPT5',
      layoutOptionName: 'Option 5: Vastu-Aligned Harmonious Energy Flow',
      layoutSummary: 'Earth-Anchored Nairutya (SW) Seating + East-Facing Agni Dining + Light Unobstructed Ishanya (NE) Prana Zone',
      styleTheme: 'Vastu Shastra Harmonious Prana Sanctuary (Organic Teak, Indoor Bio-Planters, Solar Morning Glare Flow)',
      materials: [
        {
          trade: 'Loose Furniture',
          item: 'Earth-Anchored 3-Seater Sofa with Solid Teak Base',
          specification: 'Solid CP Teak wood frame with natural organic non-toxic cotton upholstery in Nairutya quadrant',
          catalogueCode: 'FUR-VST-101',
          costPerUnit: 65000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 65000
        },
        {
          trade: 'Dining Suite',
          item: 'East-Facing 6-Seater Solid Teak Dining Ensemble',
          specification: 'Seasoned CP Teak with food-grade herbal oil polish; placed near South-East Agni dining sector',
          catalogueCode: 'DIN-VST-601',
          costPerUnit: 49000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 49000
        },
        {
          trade: 'Bio Elements',
          item: 'Natural Stone Biophilic Indoor Planter Box with Drainage Trap',
          specification: 'Hand-chiselled granite planter in North-East quadrant for natural oxygenation',
          catalogueCode: 'BIO-PLT-101',
          costPerUnit: 18000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 18000
        },
        {
          trade: 'Flooring',
          item: 'Imported Botticino Vitrified Slabs (1200x1800mm)',
          specification: 'Matte satin anti-slip finish',
          catalogueCode: 'MAT-FLR-01',
          costPerUnit: 145,
          unit: 'sq.ft',
          estimatedQuantity: 240,
          totalCost: 34800
        }
      ],
      budgetAllocated: 650000,
      budgetActualEstimated: 572000,
      renderImageUrl: '/assets/images/villa253_living_greatroom_1790833681710.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Architecturally calibrated for 100% Vastu Shastra compliance. The heavy furniture is anchored in the South-West (Nairutya) for peace and prosperity, while the North-East (Ishanya) is kept completely light and uncluttered to invite positive solar morning energy.',
      lightingPlan: 'East-facing natural daylight optimization + warm 2700K indirect perimeter lighting.',
      colorPalette: ['#FAF5EF', '#D4BA99', '#382D25', '#8E7F72', '#CBB89D'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T19:00:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-BED2-OPT1',
      conceptVersionCode: 'VCP-v6.0',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-BED2-01',
      roomName: 'Bedroom 2 / WFH Study Suite',
      layoutOptionId: 'LAYOUT-BED2-OPT1',
      layoutOptionName: 'Option 1: Dual-Monitor Ergonomic Workstation & Storage Wall',
      layoutSummary: '5.5ft Custom Workstation Facing North Glare-Free Window + 7ft Sliding Wardrobe + Sleeper Sofa',
      styleTheme: 'Ergonomic WFH Study Suite & Daylight Workstation (Natural Oak, Acoustic Wall Baffles, Matte Black Accents)',
      materials: [
        {
          trade: 'Workstation Joinery',
          item: '5.5ft Executive Ergonomic Workstation with Cable Spine & Monitor Arm',
          specification: 'Solid oak edge banding with matte anti-fingerprint anti-glare laminate surface',
          catalogueCode: 'DSK-ERG-501',
          costPerUnit: 34000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 34000
        },
        {
          trade: 'Wardrobe Joinery',
          item: 'Floor-to-Ceiling 3-Door Sliding Wardrobe with Bookshelf',
          specification: 'BWP Marine Ply with soft-close Blum sliding hardware and matte laminate finish',
          catalogueCode: 'WRD-SLD-701',
          costPerUnit: 78000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 78000
        },
        {
          trade: 'Convertible Furniture',
          item: 'Comfort Plush Sofa-Cum-Bed (Queen Size Foldout)',
          specification: 'High-resilience foam with washable stain-resistant fabric cover',
          catalogueCode: 'BED-SCB-201',
          costPerUnit: 45000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 45000
        },
        {
          trade: 'Acoustic Paneling',
          item: 'Recycled PET Acoustic Wall Baffle Panel behind Desk',
          specification: 'NRC 0.85 sound absorption for crisp Zoom calls and noise reduction',
          catalogueCode: 'ACO-PAN-101',
          costPerUnit: 180,
          unit: 'sq.ft',
          estimatedQuantity: 60,
          totalCost: 10800
        }
      ],
      budgetAllocated: 450000,
      budgetActualEstimated: 395000,
      renderImageUrl: '/assets/images/villa253_guest_suite_1790833711200.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_master_suite_1790833696550.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Specifically fulfills the core prompt: "a work desk in the second bedroom and lots of storage". The 5.5ft desk faces the North window for soft, natural light without computer screen glare. Sliding wardrobe guarantees zero swing collision with the bedroom door.',
      lightingPlan: 'Task lighting over dual monitors (4000K, CRI 95+) + dimmable warm ceiling spotlights.',
      colorPalette: ['#F1F5F9', '#334155', '#94A3B8', '#0EA5E9', '#0F172A'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T19:30:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-BED2-OPT2',
      conceptVersionCode: 'VCP-v6.1',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-BED2-01',
      roomName: 'Bedroom 2 / WFH Study Suite',
      layoutOptionId: 'LAYOUT-BED2-OPT2',
      layoutOptionName: 'Option 2: Deep Storage Sanctuary with Integrated Murphy Desk Bed',
      layoutSummary: 'Auto-Balancing Hydraulic Murphy Bed Desk + Wall-to-Wall 4-Door Wardrobe with Overhead Lofts',
      styleTheme: 'Modern High-Utility Space-Saver (Suede Laminate, Concealed Mechanism, 320 cu.ft Storage)',
      materials: [
        {
          trade: 'Convertible Joinery',
          item: 'Hydraulic Wall Bed with Auto-Balancing 5ft Flip Desk',
          specification: 'Heavy-gauge Italian counterbalanced mechanism with BWR plywood carcass',
          catalogueCode: 'BED-MRP-301',
          costPerUnit: 95000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 95000
        },
        {
          trade: 'Wardrobe Joinery',
          item: 'Wall-to-Wall 4-Door Wardrobe with Overhead Lofts',
          specification: 'Merino anti-scratch laminate with champagne gold handles and soft-close hinges',
          catalogueCode: 'WRD-LOF-401',
          costPerUnit: 88000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 88000
        }
      ],
      budgetAllocated: 450000,
      budgetActualEstimated: 420000,
      renderImageUrl: '/assets/images/villa253_gazebo_terrace_1790833723445.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_master_suite_1790833696550.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Yields the maximum floor space during work hours. The auto-balancing desk mechanism remains level when the bed is pulled down, so laptops and study materials never have to be packed away.',
      lightingPlan: 'Recessed study task light with under-bed mood strip.',
      colorPalette: ['#E2E8F0', '#475569', '#1E293B', '#D97706', '#FFFFFF'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T20:00:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-BED2-OPT3',
      conceptVersionCode: 'VCP-v6.2',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-BED2-01',
      roomName: 'Bedroom 2 / WFH Study Suite',
      layoutOptionId: 'LAYOUT-BED2-OPT3',
      layoutOptionName: 'Option 3: L-Shaped Executive Desk & Library Suite',
      layoutSummary: '7ft L-Shaped Return Workstation + Full-Height Library Credenza + Compact Reading Daybed',
      styleTheme: 'Executive Scholar & Developer Studio (Smoked Oak, Acoustic Fabric, Book Display Lighting)',
      materials: [
        {
          trade: 'Workstation Joinery',
          item: 'L-Shaped Executive Workstation with Dual Cable Trays',
          specification: 'Solid Teak edge with powder-coated black steel support legs and cable grommets',
          catalogueCode: 'DSK-LSH-401',
          costPerUnit: 48000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 48000
        },
        {
          trade: 'Library Joinery',
          item: 'Floor-to-Ceiling Library Credenza & Display Shelves',
          specification: 'Natural veneer with warm LED spot shelves and lockable lower document drawers',
          catalogueCode: 'LIB-WAL-601',
          costPerUnit: 56000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 56000
        }
      ],
      budgetAllocated: 450000,
      budgetActualEstimated: 410000,
      renderImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_master_suite_1790833696550.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Designed for high-intensity multi-monitor technical workflows with 180-book library capacity and direct natural light across the primary desk surface.',
      lightingPlan: 'Directional track spotlighting + warm book credenza shelf backlight.',
      colorPalette: ['#F8FAFC', '#334155', '#64748B', '#0284C7', '#0F172A'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T20:30:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-MBED-OPT1',
      conceptVersionCode: 'VCP-v7.0',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-MBED-01',
      roomName: 'Master Bedroom Suite',
      layoutOptionId: 'LAYOUT-MBED-OPT1',
      layoutOptionName: 'Option 1: King Suite with Acoustic Headboard Wall & 10ft Wardrobe',
      layoutSummary: 'King Size Hydraulic Storage Bed + Padded Acoustic Headboard + Full-Span 10ft Sliding Wardrobe',
      styleTheme: 'Modern Luxury Master Suite (Velvet Acoustic Bed Back, Fluted Teak Nightstands, Warm 2700K Coves)',
      materials: [
        {
          trade: 'Master Bed',
          item: 'King Size Hydraulic Storage Bed with Acoustic Padded Headboard',
          specification: 'Padded acoustic velvet upholstery with hydraulic gas-lift steel frame and salwood base',
          catalogueCode: 'BED-KNG-901',
          costPerUnit: 88000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 88000
        },
        {
          trade: 'Wardrobe Joinery',
          item: 'Full-Span 10ft 4-Door Wardrobe with Internal Dresser',
          specification: 'BWP Marine Ply with soft-close Blum sliding tracks and PU satin finish',
          catalogueCode: 'WRD-SLD-1001',
          costPerUnit: 125000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 125000
        },
        {
          trade: 'Floating Nightstands',
          item: 'Floating Bedside Nightstands with Wireless Phone Charging (Pair)',
          specification: 'Natural smoked teak veneer with push-to-open soft close drawers',
          catalogueCode: 'TAB-BED-201',
          costPerUnit: 22000,
          unit: 'pair',
          estimatedQuantity: 1,
          totalCost: 22000
        }
      ],
      budgetAllocated: 550000,
      budgetActualEstimated: 485000,
      renderImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Master suite layout respects Nairutya (South-West) grounding energy. Headboard faces South for sound sleep. Full 10ft wardrobe on the East wall accommodates extensive personal storage without obstructing the master bathroom entrance.',
      lightingPlan: 'Warm 2700K indirect ceiling coves + reading gooseneck spotlights.',
      colorPalette: ['#F5F2EB', '#C4A482', '#3E3630', '#7E8A78', '#D4AF37'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T21:00:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-MBED-OPT2',
      conceptVersionCode: 'VCP-v7.1',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-MBED-01',
      roomName: 'Master Bedroom Suite',
      layoutOptionId: 'LAYOUT-MBED-OPT2',
      layoutOptionName: 'Option 2: Executive Luxury Hotel Suite with Lounge Chaise & Vanity',
      layoutSummary: 'Low-Profile Platform King Bed + Floating Dressing Vanity with LED Mirror + Window Velvet Chaise',
      styleTheme: 'Boutique Hotel Master Sanctuary (Boiserie Mouldings, Backlit Quartz Vanity, Velvet Window Chaise)',
      materials: [
        {
          trade: 'Platform Bed',
          item: 'Low-Profile Japanese Platform Bed with Extended Back-Ledge',
          specification: 'Solid ashwood frame with woven rattan headrest and concealed bottom LED halo',
          catalogueCode: 'BED-PLF-501',
          costPerUnit: 76000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 76000
        },
        {
          trade: 'Dressing Vanity',
          item: 'Floating Dressing Vanity with LED Fluted Mirror',
          specification: 'Engineered quartz countertop with warm 3000K ring luminaire and soft-close jewelry drawer',
          catalogueCode: 'VAN-FLT-301',
          costPerUnit: 42000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 42000
        },
        {
          trade: 'Window Seating',
          item: 'Velvet Window Reading Chaise',
          specification: 'Dust-resistant olive green velvet with brass capped feet',
          catalogueCode: 'CHS-WIN-101',
          costPerUnit: 38000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 38000
        }
      ],
      budgetAllocated: 550000,
      budgetActualEstimated: 515000,
      renderImageUrl: '/assets/images/villa253_master_suite_1790833696550.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: '5-star boutique hospitality atmosphere with dedicated morning grooming zone and sunset reading nook beside South window.',
      lightingPlan: 'Warm 2400K-3000K dim-to-warm bedside fixtures and vanity perimeter light.',
      colorPalette: ['#FAF8F5', '#C5A880', '#4A3E37', '#938B83', '#E6DFD5'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T21:30:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-BED2-OPT4',
      conceptVersionCode: 'VCP-v6.3',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-BED2-01',
      roomName: 'Bedroom 2 / WFH Study Suite',
      layoutOptionId: 'LAYOUT-BED2-OPT4',
      layoutOptionName: 'Option 4: Acoustic Podcast / Media Studio & Daybed Lounge',
      layoutSummary: 'Broadcast Studio Acoustic Console (6ft) + Acoustic Wood Slat Wall + Convertible Daybed',
      styleTheme: 'Contemporary Acoustic Broadcast Studio & Guest Lounge (Smoked Walnut, Velvet Daybed, 2700K Warm Lighting)',
      materials: [
        {
          trade: 'Studio Joinery',
          item: 'Broadcast Studio Acoustic Console with Cable Management Spine',
          specification: 'Matte black anti-reflective birch ply with solid brass cable pass-throughs',
          catalogueCode: 'DSK-STU-601',
          costPerUnit: 52000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 52000
        },
        {
          trade: 'Acoustic Paneling',
          item: 'Natural Smoked Walnut Acoustic Slats on PET Felt',
          specification: 'NRC 0.88 sound dampening acoustic panelling with concealed warm LED strip',
          catalogueCode: 'ACO-SLT-201',
          costPerUnit: 440,
          unit: 'sq.ft',
          estimatedQuantity: 100,
          totalCost: 44000
        },
        {
          trade: 'Convertible Daybed',
          item: 'Convertible Velvet Daybed with Hydro Base',
          specification: 'Plush rust velvet with Sleepwell high density foam and solid beechwood legs',
          catalogueCode: 'BED-VLV-101',
          costPerUnit: 48000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 48000
        }
      ],
      budgetAllocated: 450000,
      budgetActualEstimated: 418000,
      renderImageUrl: '/assets/images/villa253_master_suite_1790833696550.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_master_bedroom_1790830829821.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Calibrated for executive video-conferencing, podcasts, and sound recording. Acoustic slats prevent audio slapback while the daybed provides comfortable guest lounging.',
      lightingPlan: 'Warm 2700K indirect perimeter backlighting + 4000K high-CRI key light for broadcast video calls.',
      colorPalette: ['#1E293B', '#C2410C', '#E2E8F0', '#475569', '#F8FAFC'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T22:00:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-BED2-OPT5',
      conceptVersionCode: 'VCP-v6.4',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-BED2-01',
      roomName: 'Bedroom 2 / WFH Study Suite',
      layoutOptionId: 'LAYOUT-BED2-OPT5',
      layoutOptionName: 'Option 5: Vastu Study Sanctuary with East-Facing Desk & Light Prana Zone',
      layoutSummary: 'Solid Teak East-Facing Study Desk + South Sliding Wardrobe + South Headboard Bed',
      styleTheme: 'Vastu Shastra Study Sanctuary (Organic Teak, Natural Beeswax Polish, Prana Flow Planters)',
      materials: [
        {
          trade: 'Study Desk',
          item: 'Solid Teak East-Facing Study Desk with Brass Inlay',
          specification: 'CP Teak with non-toxic herbal oil polish and soft brass corner caps',
          catalogueCode: 'DSK-VST-301',
          costPerUnit: 38000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 38000
        },
        {
          trade: 'Wardrobe Joinery',
          item: '3-Door Sliding Teak Finish Wardrobe on South Wall',
          specification: 'BWP Marine ply with natural quarter-cut teak laminate and soft-close sliding tracks',
          catalogueCode: 'WRD-VST-501',
          costPerUnit: 72000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 72000
        },
        {
          trade: 'Single Bed',
          item: 'Single Hydraulic Storage Bed with South Head Position',
          specification: 'Seasoned teak wood frame with pure organic cotton padded headrest',
          catalogueCode: 'BED-VST-101',
          costPerUnit: 39000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 39000
        }
      ],
      budgetAllocated: 450000,
      budgetActualEstimated: 398000,
      renderImageUrl: '/assets/images/villa253_living_greatroom_1790833681710.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Complies with Vastu orientation. Facing East during study stimulates intellectual concentration and memory retention. Northeast corner is kept light and open.',
      lightingPlan: 'East morning natural solar light optimization + 3000K warm desk lamp.',
      colorPalette: ['#FAF5EF', '#D4BA99', '#382D25', '#8E7F72', '#CBB89D'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T22:30:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-MBED-OPT3',
      conceptVersionCode: 'VCP-v7.2',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-MBED-01',
      roomName: 'Master Bedroom Suite',
      layoutOptionId: 'LAYOUT-MBED-OPT3',
      layoutOptionName: 'Option 3: Minimalist Zen Sanctuary with Low-Platform Tatami Bed & Concealed Dressing',
      layoutSummary: 'Low-Slung Ashwood Tatami Platform Bed + Flush Concealed Push Wardrobe + Floating Ledges',
      styleTheme: 'Japandi Zen Sanctuary (Natural White Ash, Sand Microcement, Concealed Joinery, 2700K Halo Lighting)',
      materials: [
        {
          trade: 'Platform Bed',
          item: 'Low-Slung Solid Ashwood Tatami Platform Bed',
          specification: 'Solid white ash wood with woven natural igusa tatami matting and concealed floor halo LED',
          catalogueCode: 'BED-TAT-701',
          costPerUnit: 82000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 82000
        },
        {
          trade: 'Concealed Wardrobe',
          item: 'Wall-to-Wall Flush Concealed Wardrobe with Push-to-Open Latches',
          specification: 'Merino supermatte greige laminate with German soft-close push mechanisms',
          catalogueCode: 'WRD-FLS-901',
          costPerUnit: 118000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 118000
        },
        {
          trade: 'Bedside Joinery',
          item: 'Floating Ashwood Night Ledges with Wireless Touch Dimmers (Pair)',
          specification: 'Solid ashwood with concealed cable routing and touch dimmers',
          catalogueCode: 'TAB-LED-101',
          costPerUnit: 24000,
          unit: 'pair',
          estimatedQuantity: 1,
          totalCost: 24000
        }
      ],
      budgetAllocated: 550000,
      budgetActualEstimated: 495000,
      renderImageUrl: '/assets/images/villa253_guest_suite_1790833711200.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_roof_gazebo_1790830815235.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Pure Japandi tranquility. The low bed datum emphasizes room height, while the concealed push-to-open wardrobe keeps all storage hidden behind monolithic plaster-toned panels.',
      lightingPlan: 'Concealed under-bed warm 2400K halo strip + soft architectural ceiling perimeter coves.',
      colorPalette: ['#F5F5F0', '#D6C7B2', '#5A524A', '#8F857D', '#E8E4DC'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T23:00:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-MBED-OPT4',
      conceptVersionCode: 'VCP-v7.3',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-MBED-01',
      roomName: 'Master Bedroom Suite',
      layoutOptionId: 'LAYOUT-MBED-OPT4',
      layoutOptionName: 'Option 4: Storage-Max Dual Wardrobe Suite with Built-in Luggage Lofts & Dresser',
      layoutSummary: 'King Bed with Hydro Deep Trunk + 11ft Dual Wardrobe with Overhead Lofts (410 cu.ft) + Dressing Mirror',
      styleTheme: 'Architectural Joinery Storage Sanctuary (Matte Anti-Scratch Laminate, Champagne Gold Trims, 410 cu.ft Volume)',
      materials: [
        {
          trade: 'Storage Bed',
          item: 'King Bed with Hydraulic Lift Deep Trunk Storage',
          specification: 'Heavy steel reinforced box frame with stain-resistant linen upholstery',
          catalogueCode: 'BED-TRK-801',
          costPerUnit: 92000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 92000
        },
        {
          trade: 'Wardrobe Joinery',
          item: 'Dual Full-Height 11ft Wardrobe with Overhead Storage Lofts',
          specification: 'BWP Marine ply with anti-scratch laminate and internal LED motion sensors',
          catalogueCode: 'WRD-LFT-1101',
          costPerUnit: 145000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 145000
        },
        {
          trade: 'Dressing Unit',
          item: 'Integrated Dressing Mirror with Hidden Jewellery Carousel',
          specification: 'Smoked oak with felt-lined carousel trays and digital code lock',
          catalogueCode: 'VAN-SEC-201',
          costPerUnit: 36000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 36000
        }
      ],
      budgetAllocated: 550000,
      budgetActualEstimated: 525000,
      renderImageUrl: '/assets/images/villa253_gazebo_terrace_1790833723445.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_roof_gazebo_1790830815235.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Engineered for maximum storage density without creating claustrophobia. The vertical lofts hold large suitcases and seasonal duvets, maintaining verified 3.1ft walkway to the master bath.',
      lightingPlan: 'Warm under-cabinet LED task strips + recessed anti-glare directional downlights.',
      colorPalette: ['#3A3B3C', '#8C7853', '#EAE6DF', '#C4B5A5', '#1F2421'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-12T23:30:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-MBED-OPT5',
      conceptVersionCode: 'VCP-v7.4',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-MBED-01',
      roomName: 'Master Bedroom Suite',
      layoutOptionId: 'LAYOUT-MBED-OPT5',
      layoutOptionName: 'Option 5: Vastu Shastra Master Suite with Nairutya Earth Anchor & South Bed Head',
      layoutSummary: 'Solid CP Teak King Bed with South Headboard + East Sliding Wardrobe + Bedside Tables with Brass Inlay',
      styleTheme: 'Vastu Shastra Prana Master Suite (Solid CP Teak, Hand-Polished Brass Inlay, Pure Cotton Upholstery)',
      materials: [
        {
          trade: 'Master Bed',
          item: 'Solid CP Teak King Bed with Organic Cotton Padded Back',
          specification: 'Kiln-seasoned CP Teak with non-toxic natural beeswax finish and pure cotton padding',
          catalogueCode: 'BED-VST-901',
          costPerUnit: 96000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 96000
        },
        {
          trade: 'Wardrobe Joinery',
          item: 'East-Boundary Sliding Teak Wardrobe with Brass Trims',
          specification: 'CenturyPly Architect BWP with quarter-cut teak veneer and brushed brass inlay',
          catalogueCode: 'WRD-VST-902',
          costPerUnit: 128000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 128000
        },
        {
          trade: 'Bedside Tables',
          item: 'Solid Teak Bedside Tables with Brass Inlay (Pair)',
          specification: 'Solid Teak wood with warm brass drawer pull handles and felt lining',
          catalogueCode: 'TAB-VST-201',
          costPerUnit: 26000,
          unit: 'pair',
          estimatedQuantity: 1,
          totalCost: 26000
        }
      ],
      budgetAllocated: 550000,
      budgetActualEstimated: 512000,
      renderImageUrl: '/assets/images/villa253_living_greatroom_1790833681710.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'South headboard placement provides deep neurological rest by aligning with Earth’s magnetic polarity. Heavy Nairutya zone anchoring establishes household stability.',
      lightingPlan: 'Warm 2400K indirect ambient cove lighting + brass reading sconces with warm filament glow.',
      colorPalette: ['#FAF5EF', '#D4BA99', '#382D25', '#8E7F72', '#CBB89D'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-13T00:00:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-KIT-OPT1',
      conceptVersionCode: 'VCP-v8.0',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-KIT-01',
      roomName: 'Culinary Kitchen & Breakfast Bar',
      layoutOptionId: 'LAYOUT-KIT-OPT1',
      layoutOptionName: 'Option 1: Parallel Gourmet Modular Kitchen with Quartz Island & Breakfast Bar',
      layoutSummary: 'Parallel 12ft Counter Run + Calacatta Quartz Surfaces + 2-Seater Breakfast Bar overlooking Living Area',
      styleTheme: 'Modern Culinary Studio (Calacatta Quartz, Teak Breakfast Bar, Acrylic Shutters, 3000K Task Lights)',
      materials: [
        {
          trade: 'Modular Kitchen',
          item: 'Parallel Modular Base & Overhead Cabinetry (12ft run)',
          specification: 'Marine grade BWP ply with anti-scratch acrylic shutters and Hafele soft-close tandem drawers',
          catalogueCode: 'KIT-MOD-1201',
          costPerUnit: 145000,
          unit: 'set',
          estimatedQuantity: 1,
          totalCost: 145000
        },
        {
          trade: 'Countertops',
          item: 'Engineered Calacatta Quartz Countertop & Seamless Backsplash',
          specification: 'KalingaStone Calacatta White 20mm engineered quartz slab with undermount granite sink',
          catalogueCode: 'QRT-CAL-201',
          costPerUnit: 65000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 65000
        },
        {
          trade: 'Breakfast Bar',
          item: 'Integrated Breakfast Bar Counter with Pair of Teak Bar Stools',
          specification: 'Quartz top with teak wood legs and upholstered counter-height stools',
          catalogueCode: 'BAR-KIT-101',
          costPerUnit: 32000,
          unit: 'set',
          estimatedQuantity: 1,
          totalCost: 32000
        }
      ],
      budgetAllocated: 350000,
      budgetActualEstimated: 310000,
      renderImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Parallel layout optimizes the golden cooking triangle between sink, hob, and refrigerator. Central 3.5ft clearance provides effortless food preparation without bottlenecking.',
      lightingPlan: 'Under-cabinet 4000K CRI 95+ prep task lighting + warm 2700K pendant drops over breakfast bar.',
      colorPalette: ['#FFFFFF', '#C5A880', '#2D3748', '#E2E8F0', '#1A202C'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-13T00:30:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-KIT-OPT2',
      conceptVersionCode: 'VCP-v8.1',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-KIT-01',
      roomName: 'Culinary Kitchen & Breakfast Bar',
      layoutOptionId: 'LAYOUT-KIT-OPT2',
      layoutOptionName: 'Option 2: L-Shaped Modular Kitchen with Tall Appliance Pantry Tower',
      layoutSummary: 'L-Shaped Counter Run with Corner Magic Pullouts + 7.5ft Tall Grocery Pantry Tower',
      styleTheme: 'Contemporary High-Capacity Modular Pantry (Supermatte Greige, Built-in Ovens, Tandem Pullouts)',
      materials: [
        {
          trade: 'Modular Kitchen',
          item: 'L-Shaped Modular Counter Suite with Corner Magic Pullouts',
          specification: 'BWP Marine ply with matte PU lacquer shutters and tandem drawers',
          catalogueCode: 'KIT-LSH-201',
          costPerUnit: 135000,
          unit: 'set',
          estimatedQuantity: 1,
          totalCost: 135000
        },
        {
          trade: 'Pantry Tower',
          item: 'Full-Height Tall Appliance Pantry Tower (7.5ft)',
          specification: 'BWP ply with Hafele tall larder mechanism and anti-fingerprint laminate',
          catalogueCode: 'KIT-PAN-701',
          costPerUnit: 58000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 58000
        }
      ],
      budgetAllocated: 350000,
      budgetActualEstimated: 325000,
      renderImageUrl: '/assets/images/villa253_guest_suite_1790833711200.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_roof_gazebo_1790830815235.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'L-shaped workflow provides maximum continuous counter surface and isolates the grocery pantry in a single high-capacity tower.',
      lightingPlan: 'Recessed anti-glare ceiling spotlights + under-shelf LED strip.',
      colorPalette: ['#FAF8F5', '#A0AEC0', '#4A5568', '#CBD5E0', '#2D3748'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-13T01:00:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    },
    {
      id: 'VCP-KIT-OPT3',
      conceptVersionCode: 'VCP-v8.2',
      projectId: 'PROJ-SKYLINE-1402',
      floorPlanVersion: 'FP-v2.1-VERIFIED',
      roomId: 'ROOM-KIT-01',
      roomName: 'Culinary Kitchen & Breakfast Bar',
      layoutOptionId: 'LAYOUT-KIT-OPT3',
      layoutOptionName: 'Option 3: Contemporary Handleless Kitchen with Fluted Glass Crockery Unit',
      layoutSummary: 'Gola Profile Handleless Cabinetry + Backlit Fluted Glass Vitrine Crockery Unit',
      styleTheme: 'Italian Architectural Handleless Kitchen (Black Gola Profiles, Fluted Glass Vitrine, Warm LED Channels)',
      materials: [
        {
          trade: 'Modular Kitchen',
          item: 'Gola Profile Handleless Modular Kitchen Run',
          specification: 'Merino supermatte laminates with aluminum black Gola profiles and soft-close Tandembox',
          catalogueCode: 'KIT-GOL-301',
          costPerUnit: 152000,
          unit: 'set',
          estimatedQuantity: 1,
          totalCost: 152000
        },
        {
          trade: 'Crockery Vitrine',
          item: 'Backlit Fluted Glass Vitrine Crockery Unit',
          specification: 'Anodized black aluminum frame with toughened fluted glass and 3000K warm LED channels',
          catalogueCode: 'KIT-GLS-401',
          costPerUnit: 46000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 46000
        }
      ],
      budgetAllocated: 350000,
      budgetActualEstimated: 335000,
      renderImageUrl: '/assets/images/villa253_master_suite_1790833696550.jpg',
      verified2DLayoutUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
      designRationale: 'Seamless monolithic minimalism. The backlit glass vitrine becomes a glowing backdrop visible from the dining room during dinner hosting.',
      lightingPlan: 'Warm 3000K vitrine internal glow + recessed ceiling spotlights.',
      colorPalette: ['#1A202C', '#E2E8F0', '#C5A880', '#718096', '#FFFFFF'],
      clientFeedbackHistory: [],
      status: 'CLIENT_APPROVED',
      createdAt: '2026-03-13T01:30:00Z',
      updatedAt: '2026-03-13T10:00:00Z'
    }
  ],

  activeConceptVersionId: 'VCP-002',
  isBoqLinked: true,
  boqLinkedAt: '2026-03-13T12:30:00Z',
  updatedAt: '2026-03-13T12:30:00Z'
};

/**
 * Returns the exact matched visual concept for any room and layout option.
 * If not in existing session, returns the pre-calibrated concept version from the architectural library.
 */
export function getCalibratedConceptForLayout(
  room: ExtractedRoomGeometry,
  layout: FurnitureLayoutOption,
  sessionConceptVersions?: VisualConceptVersion[]
): VisualConceptVersion {
  if (sessionConceptVersions && sessionConceptVersions.length > 0) {
    const found = [...sessionConceptVersions].reverse().find(
      c => (c.roomId === room.id || c.roomId === room.roomType) && 
           (c.layoutOptionId === layout.id || c.layoutOptionName === layout.title)
    );
    if (found) return found;
  }

  // Check initial library (newest first)
  const libraryMatch = [...INITIAL_2BHK_SPATIAL_SESSION.conceptVersions].reverse().find(
    c => (c.roomId === room.id || c.roomId === room.roomType) && 
         (c.layoutOptionId === layout.id || c.layoutOptionName === layout.title)
  );
  if (libraryMatch) return libraryMatch;

  // Fallback calibrated generation based on layout option code & priority theme
  let renderUrl = '/assets/images/villa253_living_greatroom_1790833681710.jpg';
  let cadUrl = '/assets/images/villa253_facade_exterior_1790833735467.jpg';

  if (layout.priorityTheme === 'STORAGE_MAX') {
    renderUrl = '/assets/images/villa253_guest_suite_1790833711200.jpg';
    cadUrl = '/assets/images/villa253_facade_exterior_1790833735467.jpg';
  } else if (layout.priorityTheme === 'WFH_PRODUCTIVITY') {
    renderUrl = '/assets/images/villa253_guest_suite_1790833711200.jpg';
    cadUrl = '/assets/images/villa253_master_suite_1790833696550.jpg';
  } else if (layout.priorityTheme === 'LUXURY_ENTERTAINING') {
    renderUrl = '/assets/images/villa253_living_greatroom_1790833681710.jpg';
    cadUrl = '/assets/images/villa253_facade_exterior_1790833735467.jpg';
  } else if (layout.priorityTheme === 'VASTU_COMPLIANT') {
    renderUrl = '/assets/images/villa253_living_modern_1790830799942.jpg';
    cadUrl = '/assets/images/villa253_facade_exterior_1790833735467.jpg';
  } else if (layout.priorityTheme === 'OPEN_LIVING') {
    renderUrl = '/assets/images/villa253_living_greatroom_1790833681710.jpg';
    cadUrl = '/assets/images/villa253_facade_exterior_1790833735467.jpg';
  }

  const verCode = `VCP-${layout.optionCode}-${layout.priorityTheme.slice(0, 3)}`;

  return {
    id: `VCP-${layout.id}`,
    conceptVersionCode: verCode,
    projectId: 'PROJ-SKYLINE-1402',
    floorPlanVersion: 'FP-v2.1-VERIFIED',
    roomId: room.id,
    roomName: room.name,
    layoutOptionId: layout.id,
    layoutOptionName: layout.title,
    layoutSummary: layout.summary,
    styleTheme: `Calibrated ${layout.title} Concept`,
    materials: layout.furnitureItems.map((item, idx) => ({
      trade: item.category === 'SEATING' ? 'Loose Furniture' : item.category === 'STORAGE' || item.category === 'JOINERY' ? 'Architectural Joinery' : 'Loose Furniture',
      item: item.name,
      specification: item.materialRef || 'Commercial BWP & Premium Finish',
      catalogueCode: item.catalogueCode || `MAT-${idx + 101}`,
      costPerUnit: item.estimatedCost,
      unit: 'nos',
      estimatedQuantity: 1,
      totalCost: item.estimatedCost
    })),
    budgetAllocated: 650000,
    budgetActualEstimated: layout.furnitureItems.reduce((acc, curr) => acc + curr.estimatedCost, 0) + 120000,
    renderImageUrl: renderUrl,
    verified2DLayoutUrl: cadUrl,
    moodboardImageUrl: '/assets/images/villa253_living_modern_1790830799942.jpg',
    designRationale: `Matched 3D visual concept and verified 2D CAD floor plan strictly respecting ${layout.title}. Guaranteed ${layout.minClearancePassageFt}ft clear circulation with zero doorway obstruction.`,
    lightingPlan: 'Warm 2700K ambient cove lighting with directional task spotlights.',
    colorPalette: ['#FAF8F5', '#C5A880', '#4A3E37', '#938B83', '#E6DFD5'],
    clientFeedbackHistory: [],
    status: 'CLIENT_APPROVED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

