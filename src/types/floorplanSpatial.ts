/**
 * Build Storys ERP - 2-Step Spatial AI & Visual Concept Studio Types
 * Step 1: Create Usable Room Layout (Read geometry, designer verification, 3-5 layouts, circulation check)
 * Step 2: Create Visual Concept (Mood boards, room visuals, client feedback iterations, BOQ linking)
 */

export interface FloorPlanCustomerInput {
  floorPlanFileName: string;
  floorPlanFileUrl: string;
  fileType: 'PDF' | 'CAD_DWG' | 'IMAGE';
  uploadDate: string;
  scaleText: string;
  isScaleVerified: boolean;
  
  siteLocation: string;
  propertyType: '2BHK_APARTMENT' | '3BHK_APARTMENT' | '4BHK_VILLA' | 'DUPLEX' | 'STUDIO';
  totalCarpetAreaSqFt: number;
  roomsToDesign: string[]; // e.g. ["Living & Dining", "Master Bedroom", "Bedroom 2 (WFH Desk)", "Kitchen"]
  approximateBudget: number; // e.g. 1800000 (₹18 Lakh)
  preferredStyle: string; // e.g. "Modern Warm Interior"
  referenceImages: {
    id: string;
    title: string;
    imageUrl: string;
    tags: string[];
  }[];
  fixedRequirements: string[]; // e.g. ["Lots of storage", "Work desk in second bedroom", "6-seater dining", "Zero doorway obstruction"]
  
  siteSurveyStatus: 'PENDING_SURVEY' | 'SITE_SURVEYED_VERIFIED' | 'NEEDS_RECHECK';
  siteSurveyDate?: string;
  siteSurveyorName?: string;
  siteSurveyNotes?: string;
}

export interface WallDoor {
  id: string;
  wall: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
  widthFt: number;
  swingDirection: 'INWARD_LEFT' | 'INWARD_RIGHT' | 'OUTWARD' | 'SLIDING';
  clearanceFt: number; // Minimum clearance required (e.g. 3.0 ft)
  isClearanceMet: boolean;
}

export interface WallWindow {
  id: string;
  wall: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
  widthFt: number;
  sillHeightFt: number;
  lintelHeightFt: number;
  isDaylightBlocked: boolean;
}

export interface ExtractedRoomGeometry {
  id: string;
  name: string;
  roomType: 'LIVING_DINING' | 'MASTER_BEDROOM' | 'BEDROOM_2_STUDY' | 'KITCHEN' | 'BATHROOM' | 'BALCONY';
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  carpetAreaSqFt: number;
  doors: WallDoor[];
  windows: WallWindow[];
  structuralColumns: { id: string; xFt: number; yFt: number; widthInches: number; depthInches: number }[];
  isVerifiedByDesigner: boolean;
  verifiedBy?: string;
  verificationDate?: string;
  designerNotes?: string;
}

export interface FurnitureLayoutItem {
  id: string;
  name: string;
  category: 'SEATING' | 'STORAGE' | 'WORK_DESK' | 'DINING' | 'BED' | 'ACCENT' | 'JOINERY';
  widthFt: number;
  depthFt: number;
  heightFt: number;
  positionXPercent: number; // 0 - 100% relative to room
  positionYPercent: number; // 0 - 100% relative to room
  rotationDeg: number;
  clearanceDistanceFt: number; // Minimum walk clearance around item
  whyItFits: string; // Explains ergonomics & door/window clearance
  catalogueCode?: string;
  materialRef?: string;
  estimatedCost: number;
}

export interface FurnitureLayoutOption {
  id: string;
  optionCode: 'LAYOUT_1' | 'LAYOUT_2' | 'LAYOUT_3' | 'LAYOUT_4' | 'LAYOUT_5';
  title: string;
  tagline: string;
  priorityTheme: 'OPEN_LIVING' | 'STORAGE_MAX' | 'WFH_PRODUCTIVITY' | 'LUXURY_ENTERTAINING' | 'VASTU_COMPLIANT';
  circulationScore: number; // 0 - 100
  storageCapacityCuFt: number;
  minClearancePassageFt: number; // e.g. 3.2 ft
  doorwayConflictDetected: boolean;
  windowLightBlocked: boolean;
  summary: string;
  furnitureItems: FurnitureLayoutItem[];
  whyItFitsOverall: string;
  pros: string[];
  cons: string[];
  layoutSvgPreview?: string;
}

export interface ConceptMaterialItem {
  trade: string;
  item: string;
  specification: string;
  catalogueCode: string;
  swatchImageUrl?: string;
  costPerUnit: number;
  unit: string;
  estimatedQuantity: number;
  totalCost: number;
}

export interface ClientFeedbackEntry {
  id: string;
  timestamp: string;
  author: string;
  role: 'CLIENT' | 'DESIGNER' | 'AI_COPILOT';
  feedbackText: string;
  actionTaken: string;
  conceptVersionGenerated: string;
  status: 'RESOLVED' | 'UNDER_REVIEW';
}

export interface VisualConceptVersion {
  id: string;
  conceptVersionCode: string; // e.g. "VCP-v1.0", "VCP-v1.1", "VCP-v2.0"
  projectId: string;
  floorPlanVersion: string;
  roomId: string;
  roomName: string;
  layoutOptionId: string;
  layoutOptionName: string;
  layoutSummary: string;
  
  styleTheme: string;
  materials: ConceptMaterialItem[];
  budgetAllocated: number;
  budgetActualEstimated: number;
  
  renderImageUrl: string;
  verified2DLayoutUrl: string;
  moodboardImageUrl?: string;
  
  designRationale: string;
  lightingPlan: string;
  colorPalette: string[];
  
  clientFeedbackHistory: ClientFeedbackEntry[];
  status: 'DRAFT_GENERATED' | 'DESIGNER_REVIEWED' | 'CLIENT_FEEDBACK_REQUESTED' | 'REVISED_CONCEPT' | 'CLIENT_APPROVED' | 'LINKED_TO_BOQ';
  approvedDate?: string;
  approvedBy?: string;
  boqLinkedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TwoStepSpatialDesignSession {
  projectId: string;
  projectTitle: string;
  customerInput: FloorPlanCustomerInput;
  planGeometry: {
    planVersion: string;
    verifiedScale: string;
    isDesignerVerified: boolean;
    designerVerifiedBy?: string;
    designerVerifiedDate?: string;
    rooms: ExtractedRoomGeometry[];
  };
  activeRoomId: string;
  layoutOptionsByRoom: Record<string, FurnitureLayoutOption[]>;
  selectedLayoutIdByRoom: Record<string, string>; // roomId -> layoutId
  conceptVersions: VisualConceptVersion[];
  activeConceptVersionId: string;
  isBoqLinked: boolean;
  boqLinkedAt?: string;
  updatedAt: string;
}
