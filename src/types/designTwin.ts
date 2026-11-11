/**
 * Build Storys ERP - PROJECT DESIGN DIGITAL TWIN (types)
 * ======================================================
 * One structured, version-controlled representation of the property:
 *
 *   PROJECT -> FLOOR PLAN -> FLOOR -> ROOM -> ELEMENT
 *     element kinds: WALL_A, WALL_B, WALL_C, WALL_D, CEILING, FLOORING,
 *                    DOORS_WINDOWS, ELECTRICAL, LIGHTING,
 *                    FURNITURE_JOINERY, PLUMBING_HVAC
 *     each element owns: assets (elevation, render, references, mood board,
 *                    material specs, dimensions, construction detail, BOQ items)
 *
 * Rules encoded in this model:
 *  - every asset carries project + room + element + design version + revision,
 *    the material IDs it depicts, its source and provenance;
 *  - a drawing can only be derived from VERIFIED geometry;
 *  - a package cannot be released until validation passes AND it is approved.
 */

import { MeasurementUnit, TradeCategory } from './erp';

// ---------------------------------------------------------------------------
// 1. IDENTITY
// ---------------------------------------------------------------------------
export type ElementKind =
  | 'WALL_A'
  | 'WALL_B'
  | 'WALL_C'
  | 'WALL_D'
  | 'CEILING'
  | 'FLOORING'
  | 'DOORS_WINDOWS'
  | 'ELECTRICAL'
  | 'LIGHTING'
  | 'FURNITURE_JOINERY'
  | 'PLUMBING_HVAC';

export const ELEMENT_KIND_LABEL: Record<ElementKind, string> = {
  WALL_A: 'Wall A',
  WALL_B: 'Wall B',
  WALL_C: 'Wall C',
  WALL_D: 'Wall D',
  CEILING: 'Ceiling',
  FLOORING: 'Flooring',
  DOORS_WINDOWS: 'Doors & Windows',
  ELECTRICAL: 'Electrical',
  LIGHTING: 'Lighting',
  FURNITURE_JOINERY: 'Furniture & Joinery',
  PLUMBING_HVAC: 'Plumbing / HVAC'
};

export type WallDirection = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';

export type AssetType =
  | 'WALL_ELEVATION'
  | 'RENDER_3D'
  | 'REFERENCE_IMAGE'
  | 'MOOD_BOARD'
  | 'MATERIAL_REFERENCE'
  | 'CONSTRUCTION_DETAIL'
  | 'DIMENSION_SHEET'
  | 'SPECIFICATION'
  | 'BOQ_LINK'
  | 'LIGHTING_PLAN'
  | 'ELECTRICAL_PLAN';

export const ASSET_TYPE_LABEL: Record<AssetType, string> = {
  WALL_ELEVATION: 'Wall elevation',
  RENDER_3D: '3D render',
  REFERENCE_IMAGE: 'Reference image',
  MOOD_BOARD: 'Mood board',
  MATERIAL_REFERENCE: 'Material reference',
  CONSTRUCTION_DETAIL: 'Construction detail',
  DIMENSION_SHEET: 'Dimension sheet',
  SPECIFICATION: 'Specification',
  BOQ_LINK: 'BOQ link',
  LIGHTING_PLAN: 'Lighting plan',
  ELECTRICAL_PLAN: 'Electrical plan'
};

export type AssetSource =
  | 'DERIVED_FROM_GEOMETRY'
  | 'PROJECT_LIBRARY'
  | 'AI_GENERATED'
  | 'UPLOADED'
  | 'MANUFACTURER';

export type AssetApproval = 'APPROVED' | 'PENDING' | 'REJECTED';

export type AssetStatus =
  | 'READY'
  | 'BLOCKED_UNVERIFIED_GEOMETRY'
  | 'MISSING_MATERIAL'
  | 'STALE_REVISION'
  | 'SUPERSEDED';

// ---------------------------------------------------------------------------
// 2. MATERIAL SPECIFICATION (the only source of finishes)
// ---------------------------------------------------------------------------
export interface MaterialSpecRecord {
  id: string; // MAT-MBR-WA-01
  projectId: string;
  name: string;
  category: string;
  specification: string;
  brand: string;
  finish: string;
  unit: MeasurementUnit;
  trade: TradeCategory;
  rate: number;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  supplierRef?: string;
  /** Quantity and rate carried from the linked BOQ line, so a change can be priced */
  boqQuantity: number;
  boqItemCodes: string[];
  colourHex?: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// 3. ASSETS
// ---------------------------------------------------------------------------
export interface AssetProvenance {
  origin: string;
  sourceUrl?: string;
  licence?: string;
  generatedAt?: string;
  generatedBy?: string;
  model?: string;
  /** Human-readable record of how this asset came to exist */
  method: string;
}

export interface DesignAssetRecord {
  id: string; // AST-MBR-WA-001
  projectId: string;
  roomId: string;
  elementId: string;
  assetType: AssetType;
  designVersion: string; // V1.0
  revision: string; // R01
  drawingRef?: string; // WE-MBR-A
  materialRefs: string[]; // MAT-*
  source: AssetSource;
  promptRef?: string; // PROMPT-MBR-WA-001
  approvalStatus: AssetApproval;
  approvedBy?: string;
  approvedAt?: string;
  parentAssetId?: string;
  supersedes?: string;
  url?: string; // image / drawing url or data URI
  provenance: AssetProvenance;
  status: AssetStatus;
  /** The verified geometry this asset was derived from (never an estimate) */
  geometryBasis?: {
    lengthFt: number;
    widthFt: number;
    ceilingHeightFt: number;
    areaSqFt: number;
    verified: boolean;
    sourceRef: string;
  };
  notes?: string;
}

// ---------------------------------------------------------------------------
// 4. ELEMENTS
// ---------------------------------------------------------------------------
export interface ElementSpec {
  /** Approved materials only - an element cannot be finished without one */
  materialRefs: string[];
  /** Palette tokens copied from the approved concept (colourHex + name) */
  colourRefs: string[];
  dimensions: {
    lengthFt: number;
    widthFt: number;
    heightFt: number;
    verified: boolean;
  };
  constructionNotes: string[];
  furnitureRefs: string[];
  lightingRefs: string[];
  electricalRefs: string[];
  plumbingRefs: string[];
  specificationText: string;
  designVersion: string;
}

export type ElementStatus = 'COMPLETE' | 'INCOMPLETE' | 'NEEDS_REVIEW' | 'NOT_APPLICABLE';

export interface DesignElement {
  id: string; // MBR-WA
  projectId: string;
  roomId: string;
  kind: ElementKind;
  label: string;
  wallDirection?: WallDirection;
  spec: ElementSpec;
  assetIds: string[];
  boqItemCodes: string[];
  /** Elements that must be reviewed after a change to this one */
  dependents: string[];
  reviewFlags: string[];
  status: ElementStatus;
}

// ---------------------------------------------------------------------------
// 5. ROOMS / FLOORS
// ---------------------------------------------------------------------------
export interface TwinRoom {
  id: string; // MBR-001
  projectId: string;
  floorId: string;
  name: string;
  roomType: string;
  /** Link back to the floor plan model room - the geometry source */
  floorPlanRoomId: string;
  geometry: {
    lengthFt: number;
    widthFt: number;
    ceilingHeightFt: number;
    areaSqFt: number;
    perimeterFt: number;
    wallAreaSqFt: number;
    verified: boolean;
    confidence: string;
  };
  requirementIds: string[];
  briefText: string;
  conceptId: string;
  conceptCode: string;
  conceptVersion: number;
  enclosed: boolean;
  elements: DesignElement[];
  status: 'COMPLETE' | 'INCOMPLETE' | 'NEEDS_REVIEW';
}

export interface TwinFloor {
  id: string;
  name: string;
  level: number;
  roomIds: string[];
}

// ---------------------------------------------------------------------------
// 6. PROMPTS & REVISIONS
// ---------------------------------------------------------------------------
export interface TwinPromptRecord {
  id: string; // PROMPT-MBR-WA-001
  projectId: string;
  elementId: string;
  text: string;
  model?: string;
  createdAt: string;
  createdBy: string;
  assetIds: string[];
  /** Everything the prompt was constrained by - makes the output reproducible */
  constraints: {
    designVersion: string;
    materialRefs: string[];
    colourRefs: string[];
    geometry: string;
    style: string;
  };
}

export type RevisionScope = 'ELEMENT' | 'ROOM' | 'PACKAGE';

export interface TwinRevision {
  id: string; // REV-MBR-WA-003
  projectId: string;
  requestedAt: string;
  requestedBy: string;
  scope: RevisionScope;
  scopeId: string;
  elementIds: string[];
  change: {
    field: 'MATERIAL' | 'COLOUR' | 'DIMENSION' | 'SPECIFICATION' | 'LAYOUT';
    from: string;
    to: string;
    reason: string;
  };
  previousVersion: string;
  newVersion: string;
  affectedAssetIds: string[];
  supersededAssetIds: string[];
  dependentsFlagged: string[];
  boqImpact: { itemCodes: string[]; previousAmount: number; newAmount: number; delta: number };
  approvalsRequired: boolean;
  status: 'APPLIED' | 'AWAITING_APPROVAL' | 'APPROVED' | 'REVERTED';
}

// ---------------------------------------------------------------------------
// 7. VALIDATION
// ---------------------------------------------------------------------------
export type ValidationCheckId =
  | 'GEOMETRY_VERIFIED'
  | 'WALL_ELEVATIONS_MAPPED'
  | 'RENDERS_MATCH_APPROVED_DESIGN'
  | 'MOOD_BOARDS_MATCH_MATERIALS'
  | 'MATERIAL_IMAGES_MATCH_IDS'
  | 'FURNITURE_DIMENSIONS_VALIDATED'
  | 'LIGHTING_ELECTRICAL_COORDINATED'
  | 'DETAILS_REFERENCE_CORRECT_WALL'
  | 'BOQ_LINKS_APPROVED_SPECS'
  | 'SINGLE_DESIGN_REVISION';

export interface ValidationCheck {
  id: ValidationCheckId;
  label: string;
  passed: boolean;
  blocking: boolean;
  detail: string;
  elementIds: string[];
  assetIds: string[];
}

export interface ValidationReport {
  validatedAt: string;
  validatedBy: string;
  designVersion: string;
  passedCount: number;
  totalCount: number;
  checks: ValidationCheck[];
  passed: boolean;
}

// ---------------------------------------------------------------------------
// 8. APPROVALS & PACKAGE
// ---------------------------------------------------------------------------
export type PackageStatus =
  | 'DRAFT'
  | 'VALIDATION_FAILED'
  | 'AWAITING_APPROVAL'
  | 'APPROVED_FOR_EXECUTION';

export interface TwinApproval {
  id: string;
  level: 'ROOM' | 'ELEMENT' | 'PACKAGE';
  scopeId: string;
  by: string;
  at: string;
  designVersion: string;
  note?: string;
}

// ---------------------------------------------------------------------------
// 9. THE TWIN
// ---------------------------------------------------------------------------
/**
 * Whole-project drawings and images (R0 PDF, DXF, plan sheets, site sketch).
 * They are not room-scoped, so they live beside the rooms rather than inside
 * one - but they still carry design version, revision, provenance and approval.
 */
export interface ProjectDrawingRecord {
  id: string;
  title: string;
  kind: 'PHOTOGRAPH' | 'RENDER' | 'CAD_DRAWING' | 'PLAN_SHEET' | 'SKETCH';
  url: string;
  designVersion: string;
  revision: string;
  drawingRef: string;
  approvalStatus: AssetApproval;
  provenance: AssetProvenance;
  notes?: string;
}

export interface DesignTwin {
  projectId: string;
  designVersion: string;
  versionSeq: number;
  builtFrom: {
    conceptId: string;
    conceptCode: string;
    conceptVersion: number;
    floorPlanSource: string;
    floorPlanConfirmedAt?: string;
    floorPlanConfirmedBy?: string;
    boqRevisionId?: string;
  };
  floors: TwinFloor[];
  rooms: TwinRoom[];
  materials: MaterialSpecRecord[];
  assets: DesignAssetRecord[];
  /** Project-level drawings: floor plans, CAD files, site sketch, facade */
  projectDrawings: ProjectDrawingRecord[];
  prompts: TwinPromptRecord[];
  revisions: TwinRevision[];
  approvals: TwinApproval[];
  validation?: ValidationReport;
  packageStatus: PackageStatus;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 10. CONVENIENCE INDEXES (used by UI + engine)
// ---------------------------------------------------------------------------
export function allElements(twin: DesignTwin): DesignElement[] {
  return twin.rooms.flatMap(room => room.elements);
}

export function findRoom(twin: DesignTwin, roomId: string): TwinRoom | undefined {
  return twin.rooms.find(room => room.id === roomId);
}

export function findElement(twin: DesignTwin, elementId: string): DesignElement | undefined {
  return allElements(twin).find(el => el.id === elementId);
}

export function assetsForElement(twin: DesignTwin, elementId: string): DesignAssetRecord[] {
  return twin.assets.filter(asset => asset.elementId === elementId);
}

export function materialsByIds(twin: DesignTwin, ids: string[]): MaterialSpecRecord[] {
  return twin.materials.filter(material => ids.includes(material.id));
}
