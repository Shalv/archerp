/**
 * Build Storys ERP - AI Drawing & Technical Documentation Seed Data
 * Authoritative Technical Drawing Packages (Packages A to E)
 * Incorporating User's Technical CAD Cases:
 * 1. MBR Wardrobe 2700mm x 2900mm with Study Desk & Fluted Panels
 * 2. Bed Wall Feature Elevation with Moulding & Fluted Panels
 * 3. 4-Door Wardrobe with Hydraulic Loft & Internal Carcass Section
 */

import {
  DataLinkageMetadata,
  FurnitureJoineryDrawingDetail,
  MaterialScheduleItem,
  ParametricValidationCheck,
  ServiceDrawingDetail,
  WallElevationDetail,
  DesignChangeImpact
} from '../types/drawingsAndDocs';

export const PRIMARY_DATA_LINKAGE: DataLinkageMetadata = {
  projectId: 'PRJ-2026-001',
  roomId: 'MBR-001',
  roomName: 'Master Bedroom Suite (20\'-0" × 19\'-0")',
  designId: 'DES-MBR-001',
  drawingId: 'DRW-MBR-005',
  revision: 'R02',
  wallId: 'MBR-WALL-03',
  furnitureId: 'FUR-WRD-001',
  boqReference: 'BOQ-0045',
  materialReference: 'MAT-LAM-001',
  designerName: 'Aparanji Divya / Ar. Shruthi',
  checkedBy: 'Rajesh Sharma (Lead QS)',
  releaseDate: '2026-09-14',
  scale: '1:25 (Elevations & Joinery in MM)',
  sheetSize: 'A1'
};

// ============================================================================
// PACKAGE B: WALL ELEVATIONS (Wall A, B, C, D)
// ============================================================================
export const SEED_WALL_ELEVATIONS: WallElevationDetail[] = [
  {
    wallId: 'MBR-WALL-01',
    wallLabel: 'Wall A',
    orientation: 'SOUTH',
    lengthMm: 6100,
    heightMm: 2900,
    title: 'South Wall A - Master Bed Head Wall with Fluted Acoustic Panels & Bedside Sconces',
    finishes: [
      { panelType: 'American Walnut Crown Cut Veneer on 12mm BWP Ply', materialCode: 'MAT-VEN-002', areaSqM: 8.4, heightFromFflMm: 0 },
      { panelType: 'Soft-Padded Velvet Headboard Cushion Band (Warm Taupe)', materialCode: 'MAT-FAB-008', areaSqM: 3.2, heightFromFflMm: 450 },
      { panelType: 'MDF Moulding with Asian Paints Royale Matt PU Paint', materialCode: 'MAT-PNT-006', areaSqM: 6.1, heightFromFflMm: 1200 }
    ],
    openings: [],
    electricalPoints: [
      { code: 'E-SW1', type: 'Bedside Master 2-Way Switch + 65W Fast USB-C Dual Port', heightFromFflMm: 650, distanceFromLeftMm: 1400 },
      { code: 'E-SW2', type: 'Bedside Master 2-Way Switch + 65W Fast USB-C Dual Port', heightFromFflMm: 650, distanceFromLeftMm: 4700 },
      { code: 'E-LT1', type: 'Reading Sconce Point (Warm White 3000K, Dimmable)', heightFromFflMm: 1450, distanceFromLeftMm: 1400 },
      { code: 'E-LT2', type: 'Reading Sconce Point (Warm White 3000K, Dimmable)', heightFromFflMm: 1450, distanceFromLeftMm: 4700 }
    ],
    furnitureIntegrated: ['FUR-BED-001: King Size Storage Bed with Float Base (1980mm × 2100mm)'],
    drawingReference: 'DRW-MBR-001'
  },
  {
    wallId: 'MBR-WALL-02',
    wallLabel: 'Wall B',
    orientation: 'WEST',
    lengthMm: 5800,
    heightMm: 2900,
    title: 'West Wall B - Ocean Vista Full-Height Portal with Concealed Pelmet',
    finishes: [
      { panelType: 'Low-E Acoustic Double Glazed Sliding Door Portal', materialCode: 'MAT-GLS-005', areaSqM: 12.8, heightFromFflMm: 0 },
      { panelType: 'Concealed Motorized Curtain Pelmet with 2800K LED Indirect Glow', materialCode: 'MAT-CEIL-009', areaSqM: 2.9, heightFromFflMm: 2750 }
    ],
    openings: [
      { type: 'SLIDER', code: 'SD2', widthMm: 3650, heightMm: 2750, sillHeightMm: 0 }
    ],
    electricalPoints: [
      { code: 'E-MOT1', type: 'Motorized Roller Blind 24V Drive Conduit', heightFromFflMm: 2800, distanceFromLeftMm: 200 }
    ],
    furnitureIntegrated: ['FUR-LOUNGE-002: Leather Armchair & Marble Top Drink Table'],
    drawingReference: 'DRW-MBR-002'
  },
  {
    wallId: 'MBR-WALL-03',
    wallLabel: 'Wall C',
    orientation: 'NORTH',
    lengthMm: 6100,
    heightMm: 2900,
    title: 'North Wall C - Built-In MBR Wardrobe 2700mm with Study Desk & Display Shelves',
    finishes: [
      { panelType: 'Sage Green Matt 1mm Laminate (Ref #SG-418)', materialCode: 'MAT-LAM-001', areaSqM: 5.8, heightFromFflMm: 100 },
      { panelType: 'Brushed Gold Aluminum Profile with Tinted Fluted Glass', materialCode: 'MAT-GLS-005', areaSqM: 2.8, heightFromFflMm: 900 },
      { panelType: 'Natural Teak Veneer Study Desk Countertop with PU Clear Coat', materialCode: 'MAT-VEN-002', areaSqM: 1.4, heightFromFflMm: 715 },
      { panelType: 'Vertical Fluted MDF Accent Battens (PU Charcoal)', materialCode: 'MAT-PNT-006', areaSqM: 2.4, heightFromFflMm: 735 }
    ],
    openings: [
      { type: 'DOOR', code: 'D1', widthMm: 914, heightMm: 2134, sillHeightMm: 0 }
    ],
    electricalPoints: [
      { code: 'E-ST1', type: 'Study Desk Quad 6A/16A Universal Sockets + HDMI Pass-Through', heightFromFflMm: 850, distanceFromLeftMm: 2200 },
      { code: 'E-WRD1', type: 'Wardrobe Internal Automatic Micro-Switch LED Sensors (5A DC)', heightFromFflMm: 2600, distanceFromLeftMm: 450 }
    ],
    furnitureIntegrated: ['FUR-WRD-001: 2700mm MBR Wardrobe with Integrated Study & Fluted Backing'],
    drawingReference: 'DRW-MBR-005'
  },
  {
    wallId: 'MBR-WALL-04',
    wallLabel: 'Wall D',
    orientation: 'EAST',
    lengthMm: 5800,
    heightMm: 2900,
    title: 'East Wall D - En-Suite Vanity Access & Floating TV Media Credenza',
    finishes: [
      { panelType: 'Botticino Classico Bookmatched Italian Marble Backing', materialCode: 'MAT-MAR-007', areaSqM: 4.8, heightFromFflMm: 600 },
      { panelType: 'Floating Walnut Carcass with Acoustic Fluted Slats', materialCode: 'MAT-VEN-002', areaSqM: 1.6, heightFromFflMm: 450 }
    ],
    openings: [
      { type: 'DOOR', code: 'D2', widthMm: 838, heightMm: 2134, sillHeightMm: 0 }
    ],
    electricalPoints: [
      { code: 'E-TV1', type: 'Concealed TV Hub (Quad Socket, RJ45 LAN, Optical Audio, HDMI Conduit)', heightFromFflMm: 1150, distanceFromLeftMm: 2900 }
    ],
    furnitureIntegrated: ['FUR-TV-003: Floating Media Console with Slotted Acoustic Storage'],
    drawingReference: 'DRW-MBR-004'
  },
  {
    wallId: 'COR-WALL-E',
    wallLabel: 'Elevation E',
    orientation: 'NORTH',
    lengthMm: 12400,
    heightMm: 5200,
    title: '3F Public Corridor & SPA Reception - Elevation E (Detailed Grand Elevation with Stepped Cove & Salon Portal)',
    finishes: [
      { panelType: 'Teakwood Fluted Corinthian Pilasters (Tags M1, M7, M13)', materialCode: 'MAT-WD-M01', areaSqM: 18.5, heightFromFflMm: 0 },
      { panelType: 'Stepped Ceiling Light Trough (+5200mm SSL) with Crystal Chandelier Rose', materialCode: 'MAT-GYP-001', areaSqM: 24.0, heightFromFflMm: 3800 },
      { panelType: 'Classical Boiserie Wainscoting Panels (Tags WP01, WP02, WP03)', materialCode: 'MAT-WPN-002', areaSqM: 32.4, heightFromFflMm: 150 },
      { panelType: 'Statuario Italian Marble Skirting (Tag SK2 - 150mm Ht)', materialCode: 'MAT-MAR-SK2', areaSqM: 3.6, heightFromFflMm: 0 }
    ],
    openings: [
      { type: 'DOOR', code: 'D1', widthMm: 1800, heightMm: 2400, sillHeightMm: 0 },
      { type: 'PORTAL', code: 'SPA-ENT', widthMm: 2200, heightMm: 3200, sillHeightMm: 0 }
    ],
    electricalPoints: [
      { code: 'E-CHAN1', type: 'Grand Chandelier Rigging Point with 150kg Seismic Anchor', heightFromFflMm: 5200, distanceFromLeftMm: 4600 },
      { code: 'E-SCN1..4', type: 'Wall Sconce Ambient Light Points (2800K Dimmable)', heightFromFflMm: 2200, distanceFromLeftMm: 1800 },
      { code: 'E-COVE1', type: 'Continuous Perimeter Architectural Cove LED Strip (24V IP44)', heightFromFflMm: 3800, distanceFromLeftMm: 0 }
    ],
    furnitureIntegrated: ['FUR-COR-001: 3F Corridor Classical Joinery Package with Console Credenzas'],
    drawingReference: 'DRW-3F-COR-001'
  }
];

// ============================================================================
// PACKAGE C: FURNITURE & JOINERY DRAWINGS (Cases 1, 2, 3)
// ============================================================================
export const SEED_FURNITURE_JOINERY_CASES: FurnitureJoineryDrawingDetail[] = [
  // CASE 1: MBR WARDROBE WITH STUDY DESK (from WhatsApp Image / images.jpeg)
  {
    furnitureId: 'FUR-WRD-001',
    itemCode: 'MBR-WRD-01',
    name: 'Wardrobe with Integrated Study Desk & Fluted Feature Wall',
    category: 'WARDROBE',
    dimensionsMm: {
      width: 2700,
      depth: 600,
      height: 2900,
      skirtingHeight: 100,
      countertopHeight: 715,
      loftHeight: 450
    },
    linkage: {
      ...PRIMARY_DATA_LINKAGE,
      drawingId: 'DRW-MBR-005',
      furnitureId: 'FUR-WRD-001',
      wallId: 'MBR-WALL-03',
      boqReference: 'BOQ-0045',
      materialReference: 'MAT-LAM-001'
    },
    sections: [
      {
        sectionId: 'SEC-A-A',
        sectionLabel: 'Section A-A: Internal Wardrobe Carcass (Depth: 600mm)',
        depthMm: 600,
        details: [
          'Top Loft storage (height 450mm) for bulky luggage with soft-close lift up stays',
          'Upper double hanging rod with 1100mm drop for formal suits and coats',
          'Mid drawer module: 2 concealed soft-close Blum Tandembox drawers (height 200mm each)',
          'Lower wire pull-out shoe basket (height 350mm) with breathable slatted base',
          'Carcase made of 18mm Century BWP Marine Plywood with 0.8mm off-white balancing laminate'
        ]
      },
      {
        sectionId: 'SEC-B-B',
        sectionLabel: 'Section B-B: Study Desk & Overhead Display Niche (Depth: 500mm)',
        depthMm: 500,
        details: [
          'Countertop: 20mm thick Natural Teak Veneer over 18mm Marine Ply with chamfered edge',
          'Legroom clearance: 600mm clear height from FFL to drawer apron',
          'Dual stationery drawers: 130mm fascia with Hafele push-to-open slides',
          'Vertical fluted panel backing: 450mm width with 12mm x 12mm acoustic battens',
          'Overhead floating open shelving with integrated 3000K LED profile channel (heights: 369mm, 450mm)'
        ]
      }
    ],
    shutterSpecs: {
      count: 3,
      mechanism: 'SLIDING_SOFT_CLOSE',
      material: 'Sage Green Matt 1mm Laminate (Panels 1 & 3) + Tinted Glass with Brushed Gold Profile (Panel 2)',
      hardware: 'Hafele Silent 60kg Top-Hung Track with bi-directional hydraulic dampening'
    },
    carcassSpecs: {
      coreMaterial: '18mm CenturyPly Club Prime Marine Plywood (BWP Grade, IS 710)',
      innerLaminate: '0.8mm Merino Off-White Suede Balancing Laminate (#MR-1002)',
      backPanel: '9mm Marine Ply with matching balancing laminate on both sides',
      edgeBanding: '2mm PVC Rehau Machine Pressed with PUR Waterproof Adhesive'
    },
    hardwareList: [
      { code: 'H-01', name: 'Hafele Silent 60kg Sliding Track & Roller Kit', brand: 'Hafele', quantity: 1, unit: 'Set', spec: 'Bi-directional soft close top-hung system' },
      { code: 'H-02', name: 'Blum Tandembox Antaro Soft-Close Drawers', brand: 'Blum', quantity: 4, unit: 'Sets', spec: '500mm depth, 30kg load capacity, Silk White' },
      { code: 'H-03', name: 'Brushed Gold Aluminum Profile Extrusions', brand: 'Hafele', quantity: 4, unit: 'Lengths (3m)', spec: 'Anodized 20 microns brush gold alloy' },
      { code: 'H-04', name: 'Hafele Push-to-Open Drawer Runners for Desk', brand: 'Hafele', quantity: 2, unit: 'Sets', spec: 'Full extension synchronous runners' }
    ],
    cuttingListSummary: [
      { panelCode: 'P-01', partName: 'Outer Carcass Side Panel (Left)', material: '18mm Marine Ply', lengthMm: 2800, widthMm: 600, thicknessMm: 18, qty: 1, edgeBandingSides: 'Front 2mm' },
      { panelCode: 'P-02', partName: 'Outer Carcass Side Panel (Right Divider)', material: '18mm Marine Ply', lengthMm: 2800, widthMm: 600, thicknessMm: 18, qty: 1, edgeBandingSides: 'Front 2mm' },
      { panelCode: 'P-03', partName: 'Horizontal Top & Bottom Slabs', material: '18mm Marine Ply', lengthMm: 1800, widthMm: 600, thicknessMm: 18, qty: 2, edgeBandingSides: 'Front 2mm' },
      { panelCode: 'P-04', partName: 'Central Vertical Partition', material: '18mm Marine Ply', lengthMm: 2350, widthMm: 580, thicknessMm: 18, qty: 1, edgeBandingSides: 'Front 2mm' },
      { panelCode: 'P-05', partName: 'Study Desk Floating Countertop', material: '18mm Marine Ply + Teak', lengthMm: 900, widthMm: 500, thicknessMm: 20, qty: 1, edgeBandingSides: 'All 4 sides 2mm' },
      { panelCode: 'P-06', partName: 'Fluted Wall Panel Backing Sheet', material: '12mm MDF + PU', lengthMm: 2150, widthMm: 450, thicknessMm: 12, qty: 1, edgeBandingSides: 'Finished PU' },
      { panelCode: 'P-07', partName: 'Sliding Shutters (Plywood Substrate)', material: '18mm Marine Ply', lengthMm: 2350, widthMm: 920, thicknessMm: 18, qty: 2, edgeBandingSides: 'Alu Profile Grooved' },
      { panelCode: 'P-08', partName: 'Back Panels', material: '9mm Marine Ply', lengthMm: 2750, widthMm: 900, thicknessMm: 9, qty: 3, edgeBandingSides: 'Rebate Mounted' }
    ]
  },

  // CASE 2: BED WALL FEATURE ELEVATION WITH FLUTED ACCENT & HEADBOARD (from 2d-layout webp)
  {
    furnitureId: 'FUR-BED-001',
    itemCode: 'MBR-BW-02',
    name: 'Bed Wall Feature with Ceiling Drop & Fluted Panels',
    category: 'BED_WALL',
    dimensionsMm: {
      width: 3600,
      depth: 180,
      height: 2900,
      skirtingHeight: 100
    },
    linkage: {
      ...PRIMARY_DATA_LINKAGE,
      drawingId: 'DRW-MBR-001',
      furnitureId: 'FUR-BED-001',
      wallId: 'MBR-WALL-01',
      boqReference: 'BOQ-0012',
      materialReference: 'MAT-VEN-002'
    },
    sections: [
      {
        sectionId: 'SEC-BW-01',
        sectionLabel: 'Ceiling to Headboard Section Detail',
        depthMm: 180,
        details: [
          'Ceiling dropped false ceiling pelmet with hidden 2800K LED wash',
          '38mm deep fluted wooden vertical battens with brass inlay profiles',
          'Central wall paint accent panel (3\'10" × 6\'0") framed with CNC mouldings',
          'Upholstered fabric headboard cushion (2\'1" depth) in high-density foam',
          'Concealed conduit channels for bedside dimmable switches & USB-C ports'
        ]
      }
    ],
    shutterSpecs: {
      count: 2,
      mechanism: 'HINGED_HYDRAULIC',
      material: 'MDF with Polyurethane Paint + Solid Brass Long Pulls',
      hardware: 'Blum Clip-Top 110 Degree with integrated Blumotion'
    },
    carcassSpecs: {
      coreMaterial: '18mm Marine Plywood + 12mm High Density Moisture Resistant (HDHMR) MDF',
      innerLaminate: 'Asian Paints PU Matt Interior Coating',
      backPanel: '12mm Marine Ply Wall Battens anchored to masonry with Fischer anchor bolts',
      edgeBanding: 'PU Spray Finished seamless round edges'
    },
    hardwareList: [
      { code: 'H-BW-1', name: 'Solid Brass 1200mm Architectural Bar Handles', brand: 'Hafele', quantity: 2, unit: 'Pieces', spec: 'Brushed brass satin finish' },
      { code: 'H-BW-2', name: 'DALI-2 Addressable Flexible LED Strip', brand: 'Flos Equivalent', quantity: 8, unit: 'Meters', spec: '24V 9.6W/m 2800K CRI 95+' }
    ],
    cuttingListSummary: [
      { panelCode: 'BW-01', partName: 'Fluted Vertical Column (Left)', material: '18mm HDHMR + PU', lengthMm: 2900, widthMm: 450, thicknessMm: 38, qty: 1, edgeBandingSides: 'PU Coated' },
      { panelCode: 'BW-02', partName: 'Fluted Vertical Column (Right)', material: '18mm HDHMR + PU', lengthMm: 2900, widthMm: 450, thicknessMm: 38, qty: 1, edgeBandingSides: 'PU Coated' },
      { panelCode: 'BW-03', partName: 'Moulded Framing Architrave', material: 'Solid Wood Timber', lengthMm: 2100, widthMm: 120, thicknessMm: 25, qty: 2, edgeBandingSides: 'Carved Profile' }
    ]
  },

  // CASE 3: 4-DOOR WARDROBE WITH HYDRAULIC LOFT & INTERNAL CARCASS (from 2d-layout webp)
  {
    furnitureId: 'FUR-WRD-004',
    itemCode: 'MBR-WRD-04',
    name: '4-Door Full-Height Wardrobe with Hydraulic Loft & Sectional Carcass',
    category: 'WARDROBE',
    dimensionsMm: {
      width: 2400,
      depth: 600,
      height: 2900,
      skirtingHeight: 100,
      loftHeight: 650
    },
    linkage: {
      ...PRIMARY_DATA_LINKAGE,
      drawingId: 'DRW-MBR-003',
      furnitureId: 'FUR-WRD-004',
      wallId: 'MBR-WALL-03',
      boqReference: 'BOQ-0048',
      materialReference: 'MAT-LAM-001'
    },
    sections: [
      {
        sectionId: 'SEC-INT-CARCASS',
        sectionLabel: 'Internal Joinery Elevation & Fitting Layout',
        depthMm: 600,
        details: [
          'Hydraulic lift-up overhead loft with gas struts for large suitcases',
          'Handleless shutter design with precision 4mm J-pull routered groove in PU',
          'Internal hanging zone: Oval chrome closet rod with anti-slip rubber insert',
          'Modular wire pull-out shoe organizers (8 pairs capacity)',
          'Lockable jewelry drawer with velvet-lined ring & watch compartments',
          'Internal LED vertical profile lights routed into vertical divider panels'
        ]
      }
    ],
    shutterSpecs: {
      count: 4,
      mechanism: 'HINGED_HYDRAULIC',
      material: '1mm Matt Laminate on 18mm BWP Ply with 4mm Handleless Groove',
      hardware: 'Blum Clip-Top 110 Soft-Close Hinges + Aventos HK-S Lift for Lofts'
    },
    carcassSpecs: {
      coreMaterial: '18mm Century Marine Plywood (BWP Grade)',
      innerLaminate: '0.8mm Merino Off-White Suede Balancing Sheet',
      backPanel: '9mm Marine Ply with double-sided balancing film',
      edgeBanding: '2mm PVC Machine Pressed on shutters, 0.8mm on internal shelves'
    },
    hardwareList: [
      { code: 'H-W4-1', name: 'Blum Aventos HK-S Lift Up Stays', brand: 'Blum', quantity: 2, unit: 'Sets', spec: 'Power factor 400-1000 for loft shutters' },
      { code: 'H-W4-2', name: 'Blum Clip-Top 110 Soft-Close Hinges', brand: 'Blum', quantity: 16, unit: 'Pieces', spec: 'Concealed hinge with integrated Blumotion' },
      { code: 'H-W4-3', name: 'Hafele Pull-out Wire Trouser & Tie Rack', brand: 'Hafele', quantity: 1, unit: 'Set', spec: 'Soft-close undermount slides' }
    ],
    cuttingListSummary: [
      { panelCode: 'W4-01', partName: 'Loft Lift Shutters', material: '18mm Marine Ply', lengthMm: 650, widthMm: 1180, thicknessMm: 18, qty: 2, edgeBandingSides: '4 sides 2mm' },
      { panelCode: 'W4-02', partName: 'Tall Main Shutters', material: '18mm Marine Ply', lengthMm: 2150, widthMm: 590, thicknessMm: 18, qty: 4, edgeBandingSides: '4 sides 2mm' },
      { panelCode: 'W4-03', partName: 'Internal Adjustable Shelves', material: '18mm Marine Ply', lengthMm: 580, widthMm: 560, thicknessMm: 18, qty: 8, edgeBandingSides: 'Front 2mm' }
    ]
  }
];

// ============================================================================
// PACKAGE D: SERVICES DRAWINGS (Electrical, False Ceiling, Plumbing, HVAC)
// ============================================================================
export const SEED_SERVICES_DRAWINGS: ServiceDrawingDetail[] = [
  {
    discipline: 'ELECTRICAL',
    drawingCode: 'DRW-MBR-E-01',
    title: 'Master Bedroom Electrical Layout & Circuit Conduit Routing',
    scale: '1:50',
    circuitPointsCount: 22,
    fixturesSchedule: [
      { symbol: '◎', description: 'Recessed COB LED Spotlights (7W, 3000K, 24° Beam)', wattageOrSpec: '7W / 230V', brandModel: 'Philips GreenSpace Pro', mountingHeight: 'Flush ceiling', boqRef: 'BOQ-0082' },
      { symbol: '━', description: 'Architectural Magnetic Track Light (48V Low Voltage)', wattageOrSpec: '24W / 48V DC', brandModel: 'Erco MagTrack Series', mountingHeight: 'Ceiling track', boqRef: 'BOQ-0083' },
      { symbol: '░', description: 'Concealed Indirect LED Cove Strip (CRI 95+)', wattageOrSpec: '9.6W/m', brandModel: 'Flos Architectural Strip', mountingHeight: 'Cove trough', boqRef: 'BOQ-0084' },
      { symbol: '⚏', description: 'Study Desk Universal 6A/16A Dual Socket + Type-C', wattageOrSpec: '16A / 230V', brandModel: 'Schneider Vivace Brushed Gold', mountingHeight: '+850mm FFL', boqRef: 'BOQ-0085' }
    ],
    technicalNotes: [
      'All conduit pipes to be 25mm heavy gauge FRLS PVC pipes concealed in slab/masonry.',
      'Separate 2.5 sq.mm copper wires for power points and 1.5 sq.mm for lighting circuits.',
      'Earthing loop impedance must be strictly verified below 1.0 Ohm before energizing.'
    ]
  },
  {
    discipline: 'FALSE_CEILING',
    drawingCode: 'DRW-MBR-C-01',
    title: 'Master Bedroom False Ceiling Framing, Cove Pelmet & Expansion Joints',
    scale: '1:50',
    circuitPointsCount: 14,
    fixturesSchedule: [
      { symbol: '▨', description: '12.5mm Gyproc Saint-Gobain Moisture Resistant Plasterboard', wattageOrSpec: '12.5mm Board', brandModel: 'Gyproc MR Board', mountingHeight: '2750mm from FFL', boqRef: 'BOQ-0061' },
      { symbol: '▥', description: 'Concealed Curtain Pelmet with 150mm Return Flange', wattageOrSpec: '150mm × 150mm', brandModel: 'Custom Gyproc Pelmet', mountingHeight: '2900mm from FFL', boqRef: 'BOQ-0062' },
      { symbol: '▦', description: 'Linear AC Supply & Return Slot Diffuser Integration', wattageOrSpec: '2-Slot 1200mm', brandModel: 'Daikin Architectural Grille', mountingHeight: 'Flush ceiling', boqRef: 'BOQ-0063' }
    ],
    technicalNotes: [
      'Galvanized intermediate channel suspended at 1200mm c/c with perimeter channels anchored at 600mm c/c.',
      'Paper tape and Gyproc jointing compound to be applied in 3 stages before sanding and primer coat.',
      '72-hour curing time required prior to second coat painting.'
    ]
  },
  {
    discipline: 'HVAC',
    drawingCode: 'DRW-MBR-H-01',
    title: 'VRV Indoor Duct Unit, Refrigerant Piping & Condensate Drain Routing',
    scale: '1:50',
    circuitPointsCount: 4,
    fixturesSchedule: [
      { symbol: '❄', description: 'Daikin VRV-X Slim Low-Static Duct Unit (1.8 TR Inverter)', wattageOrSpec: '1.8 TR / 410A', brandModel: 'Daikin FXDQ50', mountingHeight: '+2600mm FFL above closet', boqRef: 'BOQ-0091' },
      { symbol: '〰', description: 'Insulated Dual Copper Refrigerant Lines with Nitrile Rubber Sleeves', wattageOrSpec: '9.5mm / 15.9mm', brandModel: 'Mandev Copper', mountingHeight: 'Above ceiling slab', boqRef: 'BOQ-0092' }
    ],
    technicalNotes: [
      'Condensate drain line sloped at minimum 1:100 toward nearest bathroom utility shaft.',
      'Acoustic flexible ducting of 1.5m length between duct unit discharge collar and linear plenum box.'
    ]
  }
];

// ============================================================================
// PACKAGE E: MATERIAL & FINISHING SCHEDULE (With exact codes & BOQ links)
// ============================================================================
export const SEED_MATERIAL_SCHEDULE: MaterialScheduleItem[] = [
  {
    slNo: 1,
    materialCode: 'MAT-LAM-001',
    category: 'LAMINATE',
    productName: 'Sage Green Matt 1mm Architectural Laminate',
    specification: '1.0mm Zero-Sheen Antibacterial Matt Finish Surface with Anti-Fingerprint Coating',
    brand: 'Merino Speciality / Greenlam',
    finishCode: 'Sage Green Matt #SG-418',
    colourSwatchHex: '#73877b',
    unit: 'sq.ft',
    approvedRateInr: 125,
    boqReference: 'BOQ-0045',
    drawingReference: 'DRW-MBR-005',
    usedInElements: ['FUR-WRD-001 (Shutters)', 'MBR-WALL-03', 'Loft Panels'],
    sampleApprovalStatus: 'APPROVED',
    approvedDate: '2026-09-02'
  },
  {
    slNo: 2,
    materialCode: 'MAT-VEN-002',
    category: 'VENEER',
    productName: 'Natural Teak & American Walnut Architectural Veneer',
    specification: '0.6mm Crown Cut Natural Grain Veneer pressed on 12mm BWP Backing with PU Matt Finish',
    brand: 'Turakhia Natural Veneers / CenturyPly',
    finishCode: 'Natural Teak Grade-A #TK-902',
    colourSwatchHex: '#b37d4e',
    unit: 'sq.ft',
    approvedRateInr: 280,
    boqReference: 'BOQ-0046',
    drawingReference: 'DRW-MBR-005',
    usedInElements: ['Study Desk Apron & Top', 'MBR-WALL-01', 'Bedside Credenza'],
    sampleApprovalStatus: 'APPROVED',
    approvedDate: '2026-09-02'
  },
  {
    slNo: 3,
    materialCode: 'MAT-PLY-003',
    category: 'PLYWOOD',
    productName: 'CenturyPly Club Prime BWP Marine Plywood (IS 710)',
    specification: '18mm & 9mm Boiling Waterproof (BWP) 100% Calibrated Marine Ply with 25-Year Termite Warranty',
    brand: 'Century Plyboards Ltd.',
    finishCode: 'BWP Calibrated Core IS:710',
    colourSwatchHex: '#c29b6b',
    unit: 'sq.ft',
    approvedRateInr: 145,
    boqReference: 'BOQ-0044',
    drawingReference: 'DRW-MBR-005',
    usedInElements: ['All Joinery Carcasses', 'Internal Shelves', 'Study Box Frame'],
    sampleApprovalStatus: 'APPROVED',
    approvedDate: '2026-08-28'
  },
  {
    slNo: 4,
    materialCode: 'MAT-HRD-004',
    category: 'HARDWARE',
    productName: 'Hafele Silent 60kg Top-Hung Sliding Gear & Blum Soft Close',
    specification: 'Heavy duty top-hung precision ball bearing sliding system + Blum Tandembox runners',
    brand: 'Hafele Germany / Blum Austria',
    finishCode: 'Silent 60 / Silk White',
    colourSwatchHex: '#94a3b8',
    unit: 'Set',
    approvedRateInr: 18500,
    boqReference: 'BOQ-0047',
    drawingReference: 'DRW-MBR-005',
    usedInElements: ['FUR-WRD-001 (Sliding Doors)', 'Drawers'],
    sampleApprovalStatus: 'APPROVED',
    approvedDate: '2026-09-04'
  },
  {
    slNo: 5,
    materialCode: 'MAT-GLS-005',
    category: 'GLASS_ALU',
    productName: 'Brushed Gold Aluminum Profile with 5mm Fluted Tinted Glass',
    specification: 'Anodized 20 microns slim brushed gold alloy profile with grey-tinted toughened fluted glass',
    brand: 'Hafele Alusys / Saint-Gobain',
    finishCode: 'Brush Gold #BG-70 / Fluted Grey',
    colourSwatchHex: '#d4af37',
    unit: 'sq.ft',
    approvedRateInr: 450,
    boqReference: 'BOQ-0049',
    drawingReference: 'DRW-MBR-005',
    usedInElements: ['Wardrobe Center Shutter', 'West Balcony Slider SD2'],
    sampleApprovalStatus: 'APPROVED',
    approvedDate: '2026-09-06'
  },
  {
    slNo: 6,
    materialCode: 'MAT-PNT-006',
    category: 'PAINT_POLISH',
    productName: 'Asian Paints Royale Luxury Matt Emulsion with Teflon',
    specification: 'Zero-VOC scrub-resistant washable emulsion on 3 coats of acrylic putty primer',
    brand: 'Asian Paints',
    finishCode: 'Soft Whisper #L102 / PU Matt Charcoal',
    colourSwatchHex: '#f1f0ea',
    unit: 'sq.ft',
    approvedRateInr: 48,
    boqReference: 'BOQ-0052',
    drawingReference: 'DRW-MBR-001',
    usedInElements: ['Ceiling & Masonry Walls', 'Fluted Battens PU Coating'],
    sampleApprovalStatus: 'APPROVED',
    approvedDate: '2026-09-01'
  }
];

// ============================================================================
// PARAMETRIC CAD/BIM VALIDATION RULES (10-Check Verification Gate)
// ============================================================================
export const SEED_PARAMETRIC_VALIDATION_CHECKS: ParametricValidationCheck[] = [
  {
    id: 'CHK-01',
    category: 'DIMENSIONAL',
    ruleName: 'Wall C vs Wardrobe Total Width Reconciliation',
    status: 'PASS',
    measuredValue: 'Wardrobe width 2700mm + Door opening 914mm + Pier 2486mm = 6100mm (Matches Wall C CAD)',
    requiredTolerance: '± 5mm tolerance',
    verdictMessage: 'Exact match: Built-in joinery width conforms to civil laser survey baseline.'
  },
  {
    id: 'CHK-02',
    category: 'CLEARANCE',
    ruleName: 'Bed to Wardrobe Circulation Pathway Clearance',
    status: 'PASS',
    measuredValue: '1150mm clear walkway between King Bed footboard and Wardrobe sliding shutters',
    requiredTolerance: 'Minimum 900mm required for luxury residential ergonomics',
    verdictMessage: 'Exceeds standard luxury comfort guidelines (1150mm > 900mm).'
  },
  {
    id: 'CHK-03',
    category: 'CLEARANCE',
    ruleName: 'Study Desk Ergonomic Knee Clearance & Apron Height',
    status: 'PASS',
    measuredValue: 'Countertop 715mm FFL - 130mm drawer fascia = 585mm clear knee height',
    requiredTolerance: 'Minimum 580mm clear knee depth',
    verdictMessage: 'Ergonomically sound for standard executive office chair.'
  },
  {
    id: 'CHK-04',
    category: 'SERVICES_CONFLICT',
    ruleName: 'Electrical Socket vs Wardrobe Partition Interference Check',
    status: 'PASS',
    measuredValue: 'Study quad socket positioned at +850mm FFL, 200mm offset from carcass internal divider',
    requiredTolerance: 'Minimum 100mm offset from timber framework',
    verdictMessage: 'Zero conflict: Electrical boxes clear all internal shelf rebating.'
  },
  {
    id: 'CHK-05',
    category: 'SERVICES_CONFLICT',
    ruleName: 'False Ceiling Drop vs Top Wardrobe Shutter Clearance',
    status: 'PASS',
    measuredValue: 'Ceiling drop level 2750mm with 150mm top pelmet matching wardrobe height 2900mm',
    requiredTolerance: 'Pelmet shadow line 15mm gap',
    verdictMessage: 'Concealed expansion shadow gap designed without structural ceiling load on joinery.'
  },
  {
    id: 'CHK-06',
    category: 'MATERIAL_COMPLIANCE',
    ruleName: 'BWP Marine Ply IS 710 Compliance for Wet Zone Proximity',
    status: 'PASS',
    measuredValue: '100% CenturyPly Club Prime BWP specified on En-Suite abutting wall',
    requiredTolerance: 'IS 710 Boiling Water Proof grade mandatory',
    verdictMessage: 'Moisture resistant substrate approved against shared bathroom plumbing shaft.'
  },
  {
    id: 'CHK-07',
    category: 'BOQ_LINKAGE',
    ruleName: 'Parametric Geometry to BOQ Item Quantity Linkage',
    status: 'PASS',
    measuredValue: '2.70m width × 2.90m height = 7.83 sq.m (84.28 sq.ft) matches BOQ-0045 line quantity',
    requiredTolerance: 'Exact 1:1 match',
    verdictMessage: 'BOQ line item BOQ-0045 automatically synchronized to parametric CAD model.'
  },
  {
    id: 'CHK-08',
    category: 'BOQ_LINKAGE',
    ruleName: 'Master Schedule of Rates (SOR) Rate Audit',
    status: 'PASS',
    measuredValue: 'Rate ₹2,850/sq.ft matches Master Rate Item RATE-CARP-014 approved commercial price',
    requiredTolerance: 'Zero unapproved rate variance',
    verdictMessage: 'Estimator approved rate verified in system master schedule.'
  },
  {
    id: 'CHK-09',
    category: 'CLEARANCE',
    ruleName: 'Sliding Shutter Overlap & Handle Flush Depth',
    status: 'PASS',
    measuredValue: '45mm shutter overlap with flush routered brushed gold profile handles (zero projection)',
    requiredTolerance: 'Minimum 35mm overlap, flush hardware required',
    verdictMessage: 'Dust seal brushes and flush profile prevent shutter collision.'
  },
  {
    id: 'CHK-10',
    category: 'MATERIAL_COMPLIANCE',
    ruleName: 'Client Approved Swatch vs Drawing Specification Verification',
    status: 'PASS',
    measuredValue: 'Sage Green Matt #SG-418 verified with signed Swatch Board SB-04 on 02-09-2026',
    requiredTolerance: 'Customer physical sign-off on record',
    verdictMessage: 'Client approval verified in M05 Material Register.'
  }
];

// ============================================================================
// SIMULATION ENGINE: REVISING DESIGN & COMPUTING AUTOMATIC CASCADE DELTAS
// ============================================================================
export function simulateDesignChangeCascade(
  changeType: 'EXTEND_WARDROBE_TO_3000MM' | 'UPGRADE_TO_SMOKED_OAK_VENEER' | 'ADD_INTERNAL_LEATHER_DRAWERS'
): DesignChangeImpact {
  if (changeType === 'EXTEND_WARDROBE_TO_3000MM') {
    return {
      changedElementId: 'FUR-WRD-001',
      changeDescription: 'Extend Master Bedroom Wardrobe width from 2700mm to 3000mm (adds 300mm to study desk counter and fluted wall panel)',
      affectedDrawings: [
        { drawingCode: 'DRW-MBR-005', title: 'Wardrobe & Study Desk Joinery Details', discipline: 'JOINERY_MILLWORK', actionRequired: 'REGENERATE_CAD' },
        { drawingCode: 'DRW-MBR-002', title: 'Wall C North Elevation', discipline: 'ARCHITECTURAL', actionRequired: 'UPDATE_DIMENSION_STRING' },
        { drawingCode: 'DRW-MBR-E-01', title: 'Electrical Conduit & Socket Placement', discipline: 'SERVICES_ELECTRICAL', actionRequired: 'RE-ANNOTATE' }
      ],
      materialTakeoffDelta: [
        { materialCode: 'MAT-PLY-003', materialName: '18mm Century Marine Ply', originalQty: 84.3, revisedQty: 93.6, deltaQty: 9.3, unit: 'sq.ft', rateInr: 145, costImpactInr: 1348.5 },
        { materialCode: 'MAT-LAM-001', materialName: 'Sage Green Matt 1mm Laminate', originalQty: 62.5, revisedQty: 69.4, deltaQty: 6.9, unit: 'sq.ft', rateInr: 125, costImpactInr: 862.5 },
        { materialCode: 'MAT-VEN-002', materialName: 'Natural Teak Study Top', originalQty: 15.0, revisedQty: 19.8, deltaQty: 4.8, unit: 'sq.ft', rateInr: 280, costImpactInr: 1344.0 },
        { materialCode: 'MAT-HRD-004', materialName: 'Hafele Push Slides (Extended Track)', originalQty: 1.0, revisedQty: 1.0, deltaQty: 0.0, unit: 'Set', rateInr: 2500, costImpactInr: 2500.0 }
      ],
      boqDeltaSummary: {
        originalBoqTotalInr: 240255, // 84.3 sq.ft × ₹2850
        revisedBoqTotalInr: 266760,  // 93.6 sq.ft × ₹2850
        netDeltaInr: 26505,
        affectedBoqLinesCount: 3
      },
      procurementImpact: [
        { affectedPoNumber: 'PO-2026-018', vendorName: 'Apex Timber & Plywood Corp', status: 'QUANTITY_ADDITION', revisedAmountInr: 351200 },
        { affectedPoNumber: 'PO-2026-031', vendorName: 'Hafele Architectural Hardware', status: 'PO_AMENDMENT_REQUIRED', revisedAmountInr: 218500 }
      ],
      productionCuttingListDelta: {
        totalPanelsAffected: 6,
        revisedCuttingTimeMinutes: 48,
        cncFileRegenerated: true
      },
      clientApprovalRequired: true,
      reOpenedApprovalId: 'CR-2026-004'
    };
  }

  if (changeType === 'UPGRADE_TO_SMOKED_OAK_VENEER') {
    return {
      changedElementId: 'FUR-WRD-001',
      changeDescription: 'Upgrade wardrobe shutter material from Sage Green Matt Laminate (MAT-LAM-001) to Smoked Natural Oak Architectural Veneer with PU Matt Clear Coat (MAT-VEN-002)',
      affectedDrawings: [
        { drawingCode: 'DRW-MBR-005', title: 'Wardrobe & Study Desk Joinery Details', discipline: 'JOINERY_MILLWORK', actionRequired: 'REGENERATE_CAD' },
        { drawingCode: 'DRW-MBR-002', title: 'Wall C North Elevation Finish Legend', discipline: 'ARCHITECTURAL', actionRequired: 'RE-ANNOTATE' }
      ],
      materialTakeoffDelta: [
        { materialCode: 'MAT-LAM-001', materialName: 'Sage Green Matt 1mm Laminate', originalQty: 62.5, revisedQty: 0, deltaQty: -62.5, unit: 'sq.ft', rateInr: 125, costImpactInr: -7812.5 },
        { materialCode: 'MAT-VEN-002', materialName: 'Smoked Oak Natural Veneer', originalQty: 0, revisedQty: 62.5, deltaQty: 62.5, unit: 'sq.ft', rateInr: 480, costImpactInr: 30000.0 },
        { materialCode: 'MAT-PNT-006', materialName: 'PU Matt Wood Polish Multi-Coat', originalQty: 0, revisedQty: 62.5, deltaQty: 62.5, unit: 'sq.ft', rateInr: 165, costImpactInr: 10312.5 }
      ],
      boqDeltaSummary: {
        originalBoqTotalInr: 240255,
        revisedBoqTotalInr: 272755,
        netDeltaInr: 32500,
        affectedBoqLinesCount: 2
      },
      procurementImpact: [
        { affectedPoNumber: 'PO-2026-018', vendorName: 'Apex Timber & Plywood Corp', status: 'RATE_RENEGOTIATION', revisedAmountInr: 377500 }
      ],
      productionCuttingListDelta: {
        totalPanelsAffected: 4,
        revisedCuttingTimeMinutes: 35,
        cncFileRegenerated: true
      },
      clientApprovalRequired: true,
      reOpenedApprovalId: 'CR-2026-005'
    };
  }

  // ADD_INTERNAL_LEATHER_DRAWERS
  return {
    changedElementId: 'FUR-WRD-001',
    changeDescription: 'Add 2 handcrafted saddle-stitched Italian leather drawer organizers and velvet watch display tray with LED sensor strip',
    affectedDrawings: [
      { drawingCode: 'DRW-MBR-005', title: 'Section A-A Internal Carcass Drawer Module', discipline: 'JOINERY_MILLWORK', actionRequired: 'REGENERATE_CAD' }
    ],
    materialTakeoffDelta: [
      { materialCode: 'MAT-LEA-011', materialName: 'Saddle Tan Italian Nappa Leather Lining', originalQty: 0, revisedQty: 18.0, deltaQty: 18.0, unit: 'sq.ft', rateInr: 380, costImpactInr: 6840.0 },
      { materialCode: 'MAT-HRD-004', materialName: 'Blum Tip-On Push Catch for Concealed Drawer', originalQty: 2, revisedQty: 4, deltaQty: 2, unit: 'Set', rateInr: 1850, costImpactInr: 3700.0 }
    ],
    boqDeltaSummary: {
      originalBoqTotalInr: 240255,
      revisedBoqTotalInr: 250795,
      netDeltaInr: 10540,
      affectedBoqLinesCount: 1
    },
    procurementImpact: [
      { affectedPoNumber: 'PO-2026-031', vendorName: 'Lumiere & Luxury Hardware', status: 'QUANTITY_ADDITION', revisedAmountInr: 225540 }
    ],
    productionCuttingListDelta: {
      totalPanelsAffected: 2,
      revisedCuttingTimeMinutes: 20,
      cncFileRegenerated: true
    },
    clientApprovalRequired: true,
    reOpenedApprovalId: 'CR-2026-006'
  };
}
