/**
 * Build Storys ERP - AI FLOOR PLAN-TO-INTERIOR DESIGN STUDIO (types)
 * -----------------------------------------------------------------
 * Shared contract between the studio UI, the generation engine and the API.
 * The model is deliberately geometry-first: a design concept is always tied
 * to a measured room, so every render, material and BOQ line keeps its
 * project + room reference.
 */

import { TradeCategory, MeasurementUnit, BOQItem } from './erp';

// ---------------------------------------------------------------------------
// 1. FLOOR PLAN INTAKE & ANALYSIS
// ---------------------------------------------------------------------------
export type FloorPlanSourceKind = 'PDF' | 'JPG' | 'PNG' | 'DWG' | 'DXF' | 'MANUAL_DIMENSIONS';

export type DimensionConfidence = 'CAD_EXTRACTED' | 'AI_INFERRED' | 'USER_VERIFIED' | 'SITE_MEASURED';

export interface FloorPlanOpening {
  code: string;
  type: 'DOOR' | 'WINDOW' | 'SLIDER' | 'FRENCH_WINDOW' | 'VENTILATOR';
  widthFt: number;
  heightFt?: number;
  wall: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
  note?: string;
}

export interface FloorPlanRoom {
  id: string;
  name: string;
  roomType: RoomType;
  floor: string;
  lengthFt: number;
  widthFt: number;
  ceilingHeightFt: number;
  areaSqFt: number;
  perimeterFt: number;
  wallAreaSqFt: number;
  confidence: DimensionConfidence;
  flags: string[];
  openings: FloorPlanOpening[];
  notes?: string;
}

export type RoomType =
  | 'LIVING'
  | 'DINING'
  | 'MASTER_BEDROOM'
  | 'BEDROOM'
  | 'KIDS_BEDROOM'
  | 'KITCHEN'
  | 'UTILITY'
  | 'BATHROOM'
  | 'POWDER_ROOM'
  | 'WARDROBE'
  | 'STAIRCASE'
  | 'BALCONY'
  | 'DECK'
  | 'STUDY'
  | 'GAZEBO'
  | 'OTHER';

export interface FloorPlanModel {
  source: {
    kind: FloorPlanSourceKind;
    fileName?: string;
    sizeKb?: number;
    uploadedAt?: string;
    uploadedBy?: string;
    previewUrl?: string;
    cadDownloadUrl?: string;
  };
  scaleRatio?: string;
  rooms: FloorPlanRoom[];
  totalCarpetSqFt: number;
  doorsDetected: number;
  windowsDetected: number;
  columnsDetected: number;
  circulationSqFt: number;
  /** Anything the pipeline could not confirm - always shown to the user */
  uncertainItems: string[];
  analysisNotes: string[];
  analyzedAt?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  /** Provenance of an AI-assisted read (OCR + structured extraction) */
  aiExtraction?: {
    engine: string;
    model?: string;
    ocrCharacters: number;
    confidenceNotes: string[];
    extractedAt: string;
    extractedBy?: string;
  };
}

// ---------------------------------------------------------------------------
// 2. CUSTOMER PREFERENCE FORM
// ---------------------------------------------------------------------------
export type PropertyType = 'APARTMENT' | 'VILLA' | 'INDEPENDENT_HOUSE' | 'OFFICE';
export type StylePreference =
  | 'MODERN'
  | 'CONTEMPORARY'
  | 'MINIMALIST'
  | 'LUXURY'
  | 'SCANDINAVIAN'
  | 'INDUSTRIAL'
  | 'TRADITIONAL_INDIAN';
export type BudgetBand = 'ECONOMY' | 'STANDARD' | 'PREMIUM' | 'LUXURY' | 'CUSTOM';
export type ColourPalette = 'WARM' | 'NEUTRAL' | 'EARTHY' | 'MONOCHROME' | 'CUSTOM';
export type FlooringPreference = 'MARBLE' | 'TILES' | 'WOODEN' | 'VINYL';
export type FurniturePreference = 'READYMADE' | 'MODULAR' | 'CUSTOM';
export type KitchenLayout = 'OPEN' | 'CLOSED' | 'ISLAND' | 'PARALLEL' | 'L_SHAPED';
export type LightingPreference = 'AMBIENT' | 'TASK' | 'ACCENT' | 'DECORATIVE';
export type StoragePreference = 'STANDARD' | 'MAXIMUM' | 'CONCEALED';
export type SpecialRequirement =
  | 'VASTU'
  | 'ELDERLY_FRIENDLY'
  | 'CHILDREN'
  | 'PETS'
  | 'ACCESSIBILITY';

export interface RoomInstruction {
  roomId: string;
  roomName: string;
  instruction: string;
}

export interface DesignPreferences {
  propertyType: PropertyType;
  carpetAreaSqFt: number;
  style: StylePreference;
  budgetBand: BudgetBand;
  customBudgetINR?: number;
  palette: ColourPalette;
  flooring: FlooringPreference;
  furniture: FurniturePreference;
  kitchenLayout: KitchenLayout;
  lighting: LightingPreference[];
  storage: StoragePreference;
  specialRequirements: SpecialRequirement[];
  roomInstructions: RoomInstruction[];
  additionalNotes?: string;
  updatedAt?: string;
  updatedBy?: string;
}

// ---------------------------------------------------------------------------
// 3. DESIGN CONCEPTS
// ---------------------------------------------------------------------------
export interface MaterialSpecLine {
  category: string;
  specification: string;
  brandTier: string;
  finish: string;
  unit: MeasurementUnit;
  indicativeRate: number;
  trade: TradeCategory;
  quantityBasis: string;
}

export interface RoomScheme {
  roomId: string;
  roomName: string;
  roomType: RoomType;
  conceptTitle: string;
  palette: string[];
  materials: MaterialSpecLine[];
  furniture: string[];
  lighting: string[];
  keyFeatures: string[];
  moodImageUrl: string;
  renderImageUrl: string;
  customerInstructionApplied?: string;
  locked: boolean;
  /** Geometry carried with the scheme so it can be re-costed without the model */
  roomAreaSqFt: number;
  roomPerimeterFt: number;
  roomWallAreaSqFt: number;
  roomCeilingHeightFt: number;
}

export type ConceptStatus =
  | 'DRAFT'
  | 'PRESENTED'
  | 'REVISION_REQUESTED'
  | 'SELECTED'
  | 'APPROVED'
  | 'REJECTED';

export interface ConceptRevision {
  id: string;
  requestedAt: string;
  requestedBy: string;
  scope: 'WHOLE_CONCEPT' | 'ROOM';
  roomId?: string;
  changeType:
    | 'SOFA_SWAP'
    | 'COLOUR_ONLY'
    | 'FLOORING_SWAP'
    | 'MATERIAL_SWAP'
    | 'LAYOUT_CHANGE'
    | 'BUDGET_VARIANT'
    | 'OTHER';
  instruction: string;
  resolvedAt?: string;
  resultSummary?: string;
  versionAfter?: number;
}

export interface DesignConcept {
  id: string;
  projectId: string;
  code: string;
  name: string;
  style: StylePreference;
  tagline: string;
  narrative: string;
  palette: string[];
  budgetBand: BudgetBand;
  estimatedCostMinINR: number;
  estimatedCostMaxINR: number;
  ratePerSqFt: number;
  roomSchemes: RoomScheme[];
  moodBoard: { label: string; imageUrl: string; note: string }[];
  whyThisFits: string[];
  constraintsRespected: string[];
  status: ConceptStatus;
  version: number;
  createdAt: string;
  createdBy: string;
  presentedAt?: string;
  selectedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  clientRating?: number;
  revisions: ConceptRevision[];
  imagePromptUsed: string;
  /** Set when Gemini generated the narrative and/or room renders */
  aiGeneration?: {
    engine: string;
    narrativeModel?: string;
    imageModel?: string;
    narrativeGeneratedAt?: string;
    rendersGeneratedAt?: string;
    rendersRequested?: number;
    rendersSucceeded?: number;
    failures?: string[];
  };
}

// ---------------------------------------------------------------------------
// 4. SESSION
// ---------------------------------------------------------------------------
export interface PromptHistoryEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  prompt: string;
  engine: string;
  outputSummary: string;
}

export type StudioStage =
  | 'AWAITING_FLOOR_PLAN'
  | 'ANALYSIS_REVIEW'
  | 'PREFERENCES'
  | 'CONCEPTS_GENERATED'
  | 'CUSTOMER_REVIEW'
  | 'APPROVED'
  | 'BOQ_GENERATED';

export interface DesignStudioSession {
  projectId: string;
  stage: StudioStage;
  model?: FloorPlanModel;
  preferences?: DesignPreferences;
  concepts: DesignConcept[];
  selectedConceptId?: string;
  approvedConceptId?: string;
  boqDraft?: {
    revisionId: string;
    revisionLabel: string;
    items: BOQItem[];
    subtotalSelling: number;
    generatedAt: string;
    generatedFromConceptId: string;
  };
  promptHistory: PromptHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}
