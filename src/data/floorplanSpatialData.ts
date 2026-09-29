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
    floorPlanFileUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
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
        imageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
        tags: ['Warm Teak', 'Fluted Accents', 'Hidden Storage', 'Neutral Beige']
      },
      {
        id: 'REF-02',
        title: 'Acoustic Ergonomic Work-From-Home Desk',
        imageUrl: '/assets/images/minimalist_concept_render_1789216644600.jpg',
        tags: ['WFH Desk', 'Cable Management', 'Floating Shelves', 'Daylight Facing']
      },
      {
        id: 'REF-03',
        title: 'Space-Saving Built-In Storage Solutions',
        imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
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
      }
    ]
  },

  selectedLayoutIdByRoom: {
    'ROOM-LIV-01': 'LAYOUT-LIV-OPT1',
    'ROOM-BED2-01': 'LAYOUT-BED2-OPT1'
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
          swatchImageUrl: '/assets/images/cement_pour_macro_1789549128682.jpg',
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
          swatchImageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
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
      budgetAllocated: 650000, // Living & Dining portion of ₹18L budget
      budgetActualEstimated: 588000,
      renderImageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
      verified2DLayoutUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
      moodboardImageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
      designRationale: 'Combines organic warmth with clean geometric lines. The 3.8ft central corridor ensures direct access to the seaface balcony without bumping into furniture corners.',
      lightingPlan: 'Layered 3-zone lighting: (1) High-CRI 2700K cove light for soft evening ambiance; (2) Magnetic spotlights over coffee table; (3) Hand-blown glass pendant over dining.',
      colorPalette: ['#F5F2EB', '#C4A482', '#3E3630', '#7E8A78', '#D4AF37'],
      clientFeedbackHistory: [
        {
          id: 'FB-001',
          timestamp: '2026-03-12 14:30',
          author: 'Rohit Verma (Client)',
          role: 'CLIENT',
          feedbackText: 'We love the warm tones! But can you make the TV wall simpler? The fluted slats behind the screen feel a bit busy. Also please make sure the dining table definitely seats 6 people comfortably.',
          actionTaken: 'Triggered AI Concept Revision: Simplified TV wall to minimalist microcement lime plaster with floating low-profile teak drawer. Validated 6-seater dining with 3.2ft pull-out clearance.',
          conceptVersionGenerated: 'VCP-v1.1',
          status: 'RESOLVED'
        }
      ],
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
          totalCost: 13200 // Reduced cost by simplifying from fluted wood slats
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
      budgetActualEstimated: 545000, // Savings passed to client!
      renderImageUrl: '/assets/images/minimalist_concept_render_1789216644600.jpg',
      verified2DLayoutUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
      moodboardImageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
      designRationale: 'Revised according to client feedback. Fluted slats removed; replaced with serene microcement plaster that makes the TV visually disappear. Dining table confirmed at 5.5ft length accommodating 6 persons comfortably with 3.2ft kitchen doorway clearance maintained.',
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
    }
  ],

  activeConceptVersionId: 'VCP-002',
  isBoqLinked: true,
  boqLinkedAt: '2026-03-13T12:30:00Z',
  updatedAt: '2026-03-13T12:30:00Z'
};
