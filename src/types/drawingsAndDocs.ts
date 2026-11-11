/**
 * Build Storys ERP - AI Drawing & Technical Documentation Module Types
 * Mandatory Data Linkage & Technical Drawing Packages (Packages A to E)
 */

export interface DataLinkageMetadata {
  projectId: string;       // e.g. PRJ-2026-001 / PROJ-VILLA-253
  roomId: string;          // e.g. MBR-001
  roomName: string;        // e.g. Master Bedroom Suite
  designId: string;        // e.g. DES-MBR-001
  drawingId: string;       // e.g. DRW-MBR-005
  revision: string;        // e.g. R02
  wallId?: string;         // e.g. MBR-WALL-03 (Wall C)
  furnitureId?: string;    // e.g. FUR-WRD-001
  boqReference: string;    // e.g. BOQ-0045
  materialReference: string;// e.g. MAT-LAM-001
  designerName: string;    // e.g. Aparanji Divya / Ar. Shruthi
  checkedBy: string;       // e.g. Lead Quantity Surveyor / Studio Director
  releaseDate: string;     // e.g. 2026-09-14
  scale: string;           // e.g. 1:25, 1:50, NTS
  sheetSize: 'A1' | 'A2' | 'A3';
}

export type TechnicalPackageType = 
  | 'PACKAGE_A_FLOOR_PLAN'
  | 'PACKAGE_B_WALL_ELEVATIONS'
  | 'PACKAGE_C_FURNITURE_JOINERY'
  | 'PACKAGE_D_SERVICES_DRAWINGS'
  | 'PACKAGE_E_MATERIAL_SCHEDULE';

export interface WallElevationDetail {
  wallId: string;         // MBR-WALL-01, MBR-WALL-02, MBR-WALL-03, MBR-WALL-04, COR-WALL-E
  wallLabel: 'Wall A' | 'Wall B' | 'Wall C' | 'Wall D' | 'Elevation D' | 'Elevation E' | 'Elevation F' | string;
  orientation: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
  lengthMm: number;       // e.g. 5800mm
  heightMm: number;       // e.g. 2900mm
  title: string;
  finishes: {
    panelType: string;    // e.g. "Fluted Charcoal Acoustic Battens", "Botticino Marble Slab", "Smoked Oak Veneer"
    materialCode: string; // MAT-LAM-001
    areaSqM: number;
    heightFromFflMm: number;
  }[];
  openings: {
    type: 'DOOR' | 'WINDOW' | 'SLIDER' | 'NICHE' | 'PORTAL';
    code: string;
    widthMm: number;
    heightMm: number;
    sillHeightMm: number;
  }[];
  electricalPoints: {
    code: string;
    type: string;         // e.g. "6A Dual Socket + USB", "Bedside Sconce Light Point", "AC Conduit Entry"
    heightFromFflMm: number;
    distanceFromLeftMm: number;
  }[];
  furnitureIntegrated: string[]; // e.g. ["FUR-WRD-001: 3-Door Sliding Wardrobe with Study Desk"]
  drawingReference: string;      // DRW-MBR-002
}

export interface FurnitureJoineryDrawingDetail {
  furnitureId: string;           // FUR-WRD-001
  itemCode: string;              // MBR-WRD-01
  name: string;                  // Wardrobe with Study Desk (Case 1), Bed Wall Feature (Case 2), 4-Door Loft Wardrobe (Case 3)
  category: 'WARDROBE' | 'BED_WALL' | 'STUDY_DESK' | 'VANITY' | 'TV_CONSOLE' | 'KITCHEN';
  dimensionsMm: {
    width: number;               // 2700mm
    depth: number;               // 600mm carcass + 500mm desk
    height: number;              // 2900mm
    skirtingHeight: number;      // 100mm
    countertopHeight?: number;   // 715mm
    loftHeight?: number;         // 650mm
  };
  linkage: DataLinkageMetadata;
  sections: {
    sectionId: string;
    sectionLabel: string;        // "Section A-A (Internal Wardrobe Carcass)", "Section B-B (Study Desk & Overhead Niche)"
    details: string[];
    depthMm: number;
  }[];
  shutterSpecs: {
    count: number;
    mechanism: 'SLIDING_SOFT_CLOSE' | 'HINGED_HYDRAULIC' | 'LIFT_UP_PNEUMATIC';
    material: string;            // Sage Green Matt 1mm Laminate with Aluminium Profile Brushed Gold
    hardware: string;            // Blum Tip-On / Hafele Silent 60kg Top Hung
  };
  carcassSpecs: {
    coreMaterial: string;        // 18mm Century Marine Ply (BWP Grade)
    innerLaminate: string;       // 0.8mm Off-White Suede Balancing Laminate
    backPanel: string;           // 9mm Marine Ply with Matching Laminate
    edgeBanding: string;         // 2mm PVC Rehau Machine Pressed with PUR Waterproof Adhesive
  };
  hardwareList: {
    code: string;
    name: string;
    brand: 'Blum' | 'Hafele' | 'Hettich' | 'Ebco' | string;
    quantity: number;
    unit: string;
    spec: string;
  }[];
  cuttingListSummary: {
    panelCode: string;
    partName: string;
    material: string;
    lengthMm: number;
    widthMm: number;
    thicknessMm: number;
    qty: number;
    edgeBandingSides: string;
  }[];
}

export interface ServiceDrawingDetail {
  discipline: 'ELECTRICAL' | 'FALSE_CEILING' | 'PLUMBING' | 'HVAC';
  drawingCode: string;
  title: string;
  scale: string;
  circuitPointsCount: number;
  fixturesSchedule: {
    symbol: string;
    description: string;
    wattageOrSpec: string;
    brandModel: string;
    mountingHeight: string;
    boqRef: string;
  }[];
  technicalNotes: string[];
}

export interface MaterialScheduleItem {
  slNo: number;
  materialCode: string;          // MAT-LAM-001
  category: 'PLYWOOD' | 'LAMINATE' | 'VENEER' | 'MARBLE_TILE' | 'PAINT_POLISH' | 'HARDWARE' | 'GLASS_ALU' | 'LIGHTING';
  productName: string;
  specification: string;
  brand: string;
  finishCode: string;            // e.g. "Sage Green Matt 1mm (Ref #SG-418)"
  colourSwatchHex: string;
  unit: string;
  approvedRateInr: number;
  boqReference: string;          // BOQ-0045
  drawingReference: string;      // DRW-MBR-005
  usedInElements: string[];      // ["MBR-WALL-03", "FUR-WRD-001 (Shutters)", "Study Desk Apron"]
  sampleApprovalStatus: 'APPROVED' | 'SUBMITTED' | 'PENDING_CLIENT';
  approvedDate?: string;
}

export interface ParametricValidationCheck {
  id: string;
  category: 'DIMENSIONAL' | 'CLEARANCE' | 'MATERIAL_COMPLIANCE' | 'SERVICES_CONFLICT' | 'BOQ_LINKAGE';
  ruleName: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  measuredValue: string;
  requiredTolerance: string;
  verdictMessage: string;
  affectedElementId?: string;
}

export interface DesignChangeImpact {
  changedElementId: string;
  changeDescription: string;
  affectedDrawings: {
    drawingCode: string;
    title: string;
    discipline: string;
    actionRequired: 'REGENERATE_CAD' | 'UPDATE_DIMENSION_STRING' | 'RE-ANNOTATE';
  }[];
  materialTakeoffDelta: {
    materialCode: string;
    materialName: string;
    originalQty: number;
    revisedQty: number;
    deltaQty: number;
    unit: string;
    rateInr: number;
    costImpactInr: number;
  }[];
  boqDeltaSummary: {
    originalBoqTotalInr: number;
    revisedBoqTotalInr: number;
    netDeltaInr: number;
    affectedBoqLinesCount: number;
  };
  procurementImpact: {
    affectedPoNumber: string;
    vendorName: string;
    status: 'PO_AMENDMENT_REQUIRED' | 'QUANTITY_ADDITION' | 'RATE_RENEGOTIATION';
    revisedAmountInr: number;
  }[];
  productionCuttingListDelta: {
    totalPanelsAffected: number;
    revisedCuttingTimeMinutes: number;
    cncFileRegenerated: boolean;
  };
  clientApprovalRequired: boolean;
  reOpenedApprovalId?: string;
}
