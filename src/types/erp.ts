/**
 * Build Storys ERP - Core Domain Types & Schemas
 * Full-lifecycle ERP for Architecture, Interior Design, Renovation & Turnkey Construction
 */

export type UserRole = 'ADMIN' | 'ESTIMATOR' | 'PROJECT_MANAGER' | 'SITE_ENGINEER' | 'CLIENT';

export interface UserPermissions {
  canViewCostAndMargin: boolean;    // View internal direct costs, markup %, unit cost, and profit margins
  canApproveBOQ: boolean;           // Officially approve BOQ baseline and freeze revisions
  canEditBOQ: boolean;              // Add, update, and delete Job Planning Lines (BOQ)
  canRunAITakeoff: boolean;         // Execute Dynamics 365 Copilot AI requirements takeoff
  canManageMasterRates: boolean;    // Add, edit, and delete rates in corporate Master Rate Library
  canGenerateQuotation: boolean;    // Create customer sales quotations, set milestone payment terms
  canManageProjects: boolean;       // Create new projects, edit project master information
  canConductSiteSurvey: boolean;    // Edit site measurements, room dimensions, survey briefs
  canManageUsers: boolean;          // Admin-only: Create users, edit user cards, assign security permissions
  canViewAuditLogs: boolean;        // View enterprise audit trails and change telemetry
  canExportData: boolean;           // Export BOQ / Quotation / Job Planning Lines to Excel / CSV
  canManageContracts?: boolean;     // Manage commercial contracts, retention, DLP terms
  canApprovePO?: boolean;           // Issue and approve Purchase Orders
  canCertifyBills?: boolean;        // Certify contractor work bills & RA invoices
}

export const ROLE_DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  ADMIN: {
    canViewCostAndMargin: true,
    canApproveBOQ: true,
    canEditBOQ: true,
    canRunAITakeoff: true,
    canManageMasterRates: true,
    canGenerateQuotation: true,
    canManageProjects: true,
    canConductSiteSurvey: true,
    canManageUsers: true,
    canViewAuditLogs: true,
    canExportData: true,
    canManageContracts: true,
    canApprovePO: true,
    canCertifyBills: true
  },
  ESTIMATOR: {
    canViewCostAndMargin: true,
    canApproveBOQ: true,
    canEditBOQ: true,
    canRunAITakeoff: true,
    canManageMasterRates: true,
    canGenerateQuotation: true,
    canManageProjects: true,
    canConductSiteSurvey: true,
    canManageUsers: false,
    canViewAuditLogs: true,
    canExportData: true,
    canManageContracts: true,
    canApprovePO: false,
    canCertifyBills: true
  },
  PROJECT_MANAGER: {
    canViewCostAndMargin: true,
    canApproveBOQ: false,
    canEditBOQ: true,
    canRunAITakeoff: true,
    canManageMasterRates: false,
    canGenerateQuotation: true,
    canManageProjects: true,
    canConductSiteSurvey: true,
    canManageUsers: false,
    canViewAuditLogs: true,
    canExportData: true,
    canManageContracts: true,
    canApprovePO: true,
    canCertifyBills: true
  },
  SITE_ENGINEER: {
    canViewCostAndMargin: false,
    canApproveBOQ: false,
    canEditBOQ: false,
    canRunAITakeoff: false,
    canManageMasterRates: false,
    canGenerateQuotation: false,
    canManageProjects: false,
    canConductSiteSurvey: true,
    canManageUsers: false,
    canViewAuditLogs: false,
    canExportData: false,
    canManageContracts: false,
    canApprovePO: false,
    canCertifyBills: false
  },
  CLIENT: {
    canViewCostAndMargin: false,
    canApproveBOQ: false,
    canEditBOQ: false,
    canRunAITakeoff: false,
    canManageMasterRates: false,
    canGenerateQuotation: false,
    canManageProjects: false,
    canConductSiteSurvey: false,
    canManageUsers: false,
    canViewAuditLogs: false,
    canExportData: false,
    canManageContracts: false,
    canApprovePO: false,
    canCertifyBills: false
  }
};

export interface UserSession {
  id: string;
  username?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  roleTitle: string;
  department?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  permissions: UserPermissions;
  allowedModuleIds?: string[];
  avatar?: string;
  avatarUrl?: string;
  assignedProjectIds?: string[];
  createdAt?: string;
  lastLoginAt?: string;
  notes?: string;
  bio?: string;
}

export type ProjectType = 'RESIDENTIAL' | 'COMMERCIAL' | 'OFFICE' | 'RETAIL' | 'HOSPITALITY';
export type ProjectScope = 'TURNKEY_INTERIORS' | 'ARCHITECTURE_BUILD' | 'COMPLETE_RENOVATION' | 'INTERIOR_FITOUT' | 'CIVIL_STRUCTURAL';
export type ProjectStage = 
  | 'ENQUIRY' 
  | 'REQUIREMENTS_SURVEY' 
  | 'DESIGN_SCOPE' 
  | 'AI_DRAFT_BOQ' 
  | 'ESTIMATOR_REVIEW' 
  | 'APPROVED_BUDGET' 
  | 'CUSTOMER_QUOTATION' 
  | 'NEGOTIATION' 
  | 'CONTRACT_AWARDED' 
  | 'EXECUTION_ONGOING' 
  | 'HANDOVER_WARRANTY';

export type MeasurementUnit = 'sq.ft' | 'sq.m' | 'r.ft' | 'nos' | 'lump sum' | 'cum' | 'cft' | 'kg' | 'metric ton' | 'point';

export type TradeCategory =
  | 'DEMOLITION_DISPOSAL'
  | 'CIVIL_MASONRY'
  | 'WATERPROOFING'
  | 'FLOORING_TILING'
  | 'FALSE_CEILINGS'
  | 'PAINTING_POLISHING'
  | 'ELECTRICAL_AUTOMATION'
  | 'PLUMBING_SANITARY'
  | 'HVAC_VENTILATION'
  | 'DOORS_WINDOWS_GLAZING'
  | 'CARPENTRY_JOINERY'
  | 'MODULAR_KITCHEN'
  | 'WARDROBES_STORAGE'
  | 'LOOSE_FURNITURE'
  | 'LIGHTING_FIXTURES'
  | 'LANDSCAPING_OUTDOORS';

export type RateStatus = 'APPROVED' | 'PROVISIONAL' | 'MISSING' | 'STALE';
export type QuantityType = 'MEASURED' | 'USER_ENTERED' | 'PROVISIONAL_ALLOWANCE';

export interface MasterRateItem {
  id: string;
  itemCode: string;
  trade: TradeCategory;
  workPackage: string;
  description: string;
  specification: string;
  brandGrade: string;
  unit: MeasurementUnit;
  materialRate: number; // ₹ per unit
  labourRate: number;   // ₹ per unit
  equipmentRate: number; // ₹ per unit
  subcontractRate: number; // ₹ per unit
  totalUnitCost: number; // Sum of material + labour + equipment + subcontract
  defaultMarkupPercent: number; // e.g. 25%
  suggestedSellingRate: number;
  rateSource: 'APPROVED_MASTER' | 'HISTORICAL_PURCHASE' | 'VENDOR_QUOTE' | 'ILLUSTRATIVE_BENCHMARK';
  location: string;
  effectiveDate: string;
  status: RateStatus;
  hsnSacCode?: string;
  gstRate: number; // standard e.g. 18%
}

export interface CustomerMaster {
  id: string;
  customerNo: string; // e.g. CUST-1001
  name: string;
  companyName?: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin?: string;
  pan?: string;
  billingAddress: string;
  city: string;
  state: string;
  pincode: string;
  customerType: 'INDIVIDUAL_HOMEOWNER' | 'COMMERCIAL_ENTERPRISE' | 'BUILDER_DEVELOPER';
  creditLimit: number; // ₹
  paymentTerms: string; // e.g. "Milestone Based (10-30-25-20-15)"
  status: 'ACTIVE' | 'PROSPECT' | 'BLOCKED';
  totalProjectsCount: number;
  createdAt: string;
  notes?: string;
}

export interface VendorMaster {
  id: string;
  vendorNo: string; // e.g. VEND-2001
  name: string;
  tradeSpecialty: TradeCategory;
  contactPerson: string;
  phone: string;
  email: string;
  gstin?: string;
  pan?: string;
  address: string;
  city: string;
  rating: number; // 1 to 5
  bankAccountNumber?: string;
  bankIfsc?: string;
  paymentTerms: string;
  complianceStatus: 'VERIFIED' | 'PENDING_DOCS' | 'INACTIVE';
  leadTimeDays: number;
  status: 'ACTIVE' | 'ON_HOLD' | 'BLOCKED';
  notes?: string;
}

export interface ResourceMaster {
  id: string;
  resourceNo: string; // e.g. RES-3001
  name: string;
  trade: TradeCategory;
  skillLevel: 'MASTER_CRAFTSMAN' | 'SKILLED_TRADESMAN' | 'SEMI_SKILLED' | 'GENERAL_HELPER' | 'SITE_SUPERVISOR';
  dailyWageRate: number; // ₹ per 8hr day
  hourlyRate: number; // ₹ per hr
  overtimeMultiplier: number; // e.g. 1.5
  standardDailyOutput: string; // e.g. "75 sq.ft tile laying / day"
  employmentType: 'DIRECT_PAYROLL' | 'PIECE_RATE_CONTRACT' | 'SUBCONTRACT_CREW';
  phone: string;
  crewSize?: number;
  status: 'AVAILABLE' | 'ALLOCATED' | 'ON_LEAVE';
  notes?: string;
}

export interface WorkPackageMaster {
  id: string;
  code: string;
  trade: TradeCategory;
  name: string;
  standardWastagePercent: number;
  defaultGstPercent: number;
  hsnSacCode: string;
  mandatoryInclusions: string[];
  standardExclusions: string[];
  leadTimeWeeks: number;
}

export interface UOMMaster {
  code: MeasurementUnit;
  name: string;
  description: string;
  precision: number;
  dimensionType: 'AREA' | 'VOLUME' | 'LENGTH' | 'COUNT' | 'WEIGHT' | 'LUMP_SUM';
}

export interface TaxRuleMaster {
  id: string;
  code: string;
  name: string;
  gstRatePercent: number;
  applicableHSNSAC: string;
  description: string;
}

export interface RoomSpace {
  id: string;
  name: string;
  zone: string; // e.g., 'Ground Floor - Public Zone', 'First Floor - Private'
  floor: string; // e.g., 'Ground Floor', 'First Floor'
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  carpetAreaSqFt: number;
  perimeterFt: number;
  wallAreaSqFt: number;
  ceilingAreaSqFt: number;
  existingCondition: string;
  demolitionRequired: boolean;
  notes?: string;
}

export interface UploadedBriefDocument {
  id: string;
  filename: string;
  fileType: string;
  sizeKb: number;
  uploadedAt: string;
  uploadedBy: string;
  documentType: 'FLOOR_PLAN_DRAWING' | 'CLIENT_BRIEF_PDF' | 'SITE_SURVEY_PHOTO' | 'MATERIAL_SCHEDULE' | 'SPECIFICATION_DOC';
  version: string;
  scaleConfirmed: boolean;
  scaleRatio?: string; // e.g. "1:100" or "1/4 inch = 1 foot"
  notes?: string;
}

export interface CustomerRequirement {
  id: string;
  projectId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  billingAddress: string;
  projectSiteAddress: string;
  city: string;
  projectType: ProjectType;
  projectScope: ProjectScope;
  plotAreaSqFt: number;
  builtUpAreaSqFt: number;
  carpetAreaSqFt: number;
  floorsCount: number;
  rooms: RoomSpace[];
  preferredDesignStyle: string; // e.g. 'Modern Minimalist with Warm Wood Accents'
  materialsBrandsPreferences: string;
  civilRequirements: string;
  electricalRequirements: string;
  plumbingSanitaryRequirements: string;
  hvacRequirements: string;
  joineryKitchenPreferences: string;
  customerBudgetMin: number;
  customerBudgetMax: number;
  targetCompletionDate: string;
  exclusionsCustomerSupplied: string;
  siteAccessConstraints: string;
  surveyNotes: string;
  rawBriefHindiEnglish: string; // Hinglish / multilingual input support
  documents: UploadedBriefDocument[];
  updatedAt: string;
}

export interface BOQItem {
  id: string;
  boqRevisionId: string;
  itemCode: string;
  trade: TradeCategory;
  workPackage: string;
  floor: string;
  roomZone: string;
  description: string;
  specification: string;
  brandGrade: string;
  inclusions: string;
  exclusions: string;
  unit: MeasurementUnit;
  length?: number;
  width?: number;
  height?: number;
  quantityFormula: string; // e.g., "16 * 14 = 224 sq.ft" or "Perimeter 60ft * 9.5ft height"
  baseQuantity: number;
  wastagePercent: number; // e.g., 5% or 10%
  finalQuantity: number; // baseQuantity * (1 + wastagePercent/100)
  quantityType: QuantityType; // MEASURED | USER_ENTERED | PROVISIONAL_ALLOWANCE
  
  // Cost Components (Deterministic)
  materialRate: number;
  labourRate: number;
  equipmentRate: number;
  subcontractRate: number;
  unitCost: number; // sum of rates
  totalCost: number; // finalQuantity * unitCost
  
  // Pricing & Commercial
  markupPercent: number; // e.g. 25% -> Cost * 1.25
  sellingRate: number;
  sellingAmount: number; // finalQuantity * sellingRate
  
  // Audit & Provenance
  rateSource: string;
  rateStatus: RateStatus;
  sourceDocumentRef: string;
  assumptions: string;
  uncertaintyFlags?: string; // e.g. "Missing ceiling height - assumed 9.5ft standard slab"
  isApprovedByEstimator: boolean;
  reviewedBy?: string;
  notes?: string;
}

export interface BOQRevision {
  id: string;
  projectId: string;
  revisionNumber: number; // 0 for AI Draft, 1 for Estimator Baseline, etc.
  revisionLabel: string;  // "Rev 0 - AI Draft", "Rev 1 - Estimator Approved Baseline"
  status: 'DRAFT' | 'ESTIMATOR_REVIEW' | 'APPROVED' | 'FROZEN_BASELINE';
  items: BOQItem[];
  createdAt: string;
  createdBy: string;
  approvedAt?: string;
  approvedBy?: string;
  missingDimensionAlerts: string[];
  missingRateAlerts: string[];
  notes?: string;
}

export interface CostBudgetSummary {
  directMaterialCost: number;
  directLabourCost: number;
  directEquipmentCost: number;
  directSubcontractCost: number;
  totalDirectCost: number;
  
  siteLogisticsExpense: number;
  siteOverheadsPercent: number;
  siteOverheadsAmount: number;
  contingencyPercent: number;
  contingencyAmount: number;
  escalationAllowanceAmount: number;
  totalProjectCost: number;
  
  totalSellingBeforeTax: number;
  grossMarginAmount: number; // totalSellingBeforeTax - totalProjectCost
  grossMarginPercent: number; // (grossMarginAmount / totalSellingBeforeTax) * 100
  markupOnCostPercent: number; // (grossMarginAmount / totalProjectCost) * 100
  
  gstRatePercent: number;
  gstAmount: number;
  totalClientContractValue: number;
  
  tradeBreakdown: {
    trade: TradeCategory;
    cost: number;
    sellingAmount: number;
    marginPercent: number;
    itemsCount: number;
  }[];
  
  roomBreakdown: {
    roomZone: string;
    cost: number;
    sellingAmount: number;
    itemsCount: number;
  }[];
}

export interface AlternativePackageOption {
  tier: 'ECONOMY' | 'STANDARD' | 'PREMIUM';
  title: string;
  badge: string;
  specificationsSummary: string;
  materialsHighlights: string[];
  totalDirectCost: number;
  totalSellingPrice: number;
  marginPercent: number;
  timelineWeeks: number;
  warrantyPeriod: string;
  assumptions: string[];
}

export interface ValueEngineeringOption {
  id: string;
  trade: TradeCategory;
  roomZone: string;
  originalSpec: string;
  proposedAlternative: string;
  costSaving: number;
  sellingReduction: number;
  clientQualityImpact: string;
  isAccepted: boolean;
}

export interface PaymentMilestone {
  id: string;
  milestoneName: string;
  percentage: number;
  amount: number;
  stageTrigger: string;
  status: 'PENDING' | 'INVOICED' | 'PAID';
}

export interface CustomerQuotation {
  id: string;
  quotationNumber: string;
  projectId: string;
  boqRevisionId: string;
  customerName: string;
  projectTitle: string;
  siteAddress: string;
  selectedPackageTier: 'ECONOMY' | 'STANDARD' | 'PREMIUM';
  quotationDate: string;
  validityDays: number;
  expiryDate: string;
  subtotalSellingAmount: number;
  gstPercent: number;
  gstAmount: number;
  totalQuotationAmount: number;
  milestoneSchedule: PaymentMilestone[];
  inclusions: string[];
  exclusions: string[];
  termsAndConditions: string[];
  status: 'DRAFT' | 'SENT_TO_CLIENT' | 'ACCEPTED' | 'REVISED';
}

export interface ProjectRecord {
  id: string;
  projectCode: string;
  title: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectType: ProjectType;
  projectScope: ProjectScope;
  siteAddress: string;
  city: string;
  stage: ProjectStage;
  carpetAreaSqFt: number;
  estimatedBudget: number;
  createdAt: string;
  updatedAt: string;
  requirement?: CustomerRequirement;
  activeRevisionId?: string;
  revisions: BOQRevision[];
  quotation?: CustomerQuotation;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}

export interface SystemCapabilityReport {
  codeExecution: boolean;
  codeExecutionDetails: string;
  fileCreation: boolean;
  fileCreationDetails: string;
  databaseRunning: boolean;
  databaseType: string;
  databaseDetails: string;
  cloudDeployment: boolean;
  cloudDeploymentDetails: string;
  businessAssumptions: string[];
}

// ============================================================================
// FULL ARCHITECTURE & INTERIOR DESIGN ERP 26-MODULE SUITE DEFINITIONS
// Journey: Enquiry → Design → Estimation → Execution → Billing → Handover → After-Sales
// ============================================================================

export type ERPJourneyStage = 
  | 'ENQUIRY_SALES'
  | 'SURVEY_DESIGN'
  | 'ESTIMATION_BOQ'
  | 'COMMERCIAL_CONTRACTS'
  | 'EXECUTION_OPS'
  | 'BILLING_FINANCE'
  | 'HANDOVER_WARRANTY';

export interface ERPModuleMeta {
  id: number;
  code: string;
  name: string;
  stage: ERPJourneyStage;
  stageLabel: string;
  priority: 'Essential' | 'Essential for execution' | 'Essential for turnkey' | 'Highly recommended' | 'As needed' | 'According to scope';
  keyFunctionality: string;
  tabKey: string;
  iconName: string;
}

// ----------------------------------------------------------------------------
// 1. Traceability Engine: BOQ Item → Budget → PO/Subcontract → Consumption → Actual Cost
// ----------------------------------------------------------------------------
export interface CostTraceabilityItem {
  id: string;
  boqItemCode: string;
  trade: TradeCategory;
  roomZone: string;
  description: string;
  specification: string;
  unit: MeasurementUnit;
  
  // 1. BOQ & Budget Line
  boqQuantity: number;
  budgetUnitCost: number;
  budgetTotalCost: number;
  sellingRate: number;
  sellingTotal: number;
  budgetedMarginPercent: number;

  // 2. Committed Cost (Purchase Order or Subcontract Work Order)
  poNumber?: string;
  poVendorName?: string;
  poCommittedAmount: number;
  subcontractWONumber?: string;
  subcontractorName?: string;
  subcontractCommittedAmount: number;
  totalCommittedCost: number;

  // 3. Material Consumption / Site Work Certification
  materialIssuedQuantity: number;
  materialIssuedValue: number;
  workCertifiedQuantity: number;
  workCertifiedValue: number;

  // 4. Actual Project Cost & Variance
  actualCostIncurred: number;
  costVariance: number; // budgetTotalCost - actualCostIncurred (positive = favorable savings)
  actualMarginPercent: number;
  status: 'BUDGETED' | 'COMMITTED' | 'PARTIALLY_DELIVERED' | 'CERTIFIED' | 'OVERRUN_ALERT';
  notes?: string;
}

// ----------------------------------------------------------------------------
// 2. Agentic AI Central Workspace Capabilities
// ----------------------------------------------------------------------------
export type AIAssistantType = 
  | 'REQUIREMENTS'
  | 'BOQ'
  | 'BUDGET'
  | 'DESIGN_REVIEW'
  | 'PROCUREMENT'
  | 'PROJECT_MONITORING'
  | 'COST_CONTROL'
  | 'BILLING'
  | 'KNOWLEDGE';

export interface AgenticAISuggestion {
  id: string;
  assistantType: AIAssistantType;
  assistantName: string;
  targetModule: string;
  title: string;
  description: string;
  detailedAnalysis: string;
  financialImpact?: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
  actionPayload?: any;
  status: 'PENDING_REVIEW' | 'APPROVED_APPLIED' | 'REJECTED';
  timestamp: string;
  suggestedBy: string;
}

// ----------------------------------------------------------------------------
// 3. Specialized Module Schemas
// ----------------------------------------------------------------------------

// Module 1: CRM & Sales Lead
export interface CRMLead {
  id: string;
  leadCode: string;
  clientName: string;
  phone: string;
  email: string;
  projectType: ProjectType;
  budgetBracket: string;
  source: 'WEBSITE' | 'ARCHITECT_REFERRAL' | 'DIRECT_WALK_IN' | 'INSTAGRAM' | 'REPEAT_CLIENT';
  stage: 'NEW_ENQUIRY' | 'SITE_VISIT_SCHEDULED' | 'BRIEF_TAKEN' | 'PROPOSAL_SUBMITTED' | 'WON' | 'LOST';
  lostReason?: string;
  assignedSalesLead: string;
  followUpDate: string;
  notes: string;
}

// Module 4: Design & Drawing Revisions
export interface DesignDrawingItem {
  id: string;
  drawingCode: string; // e.g. DWG-1402-A-101
  title: string;
  discipline: 'ARCHITECTURAL' | 'INTERIOR_LAYOUT' | 'ELECTRICAL_MEP' | 'JOINERY_MILLWORK' | '3D_RENDERS';
  revision: string; // Rev A, Rev B, Rev C
  status: 'CONCEPT_DRAFT' | 'INTERNAL_REVIEW' | 'CLIENT_APPROVED' | 'GFC_ISSUED';
  releaseDate: string;
  designerName: string;
  reviewedBy: string;
  thumbnailUrl?: string;
  fileSizeMb: number;
  customerApprovedDate?: string;
}

// Module 5: Material & Finish Selection
export interface MaterialSelectionItem {
  id: string;
  itemCode: string;
  roomZone: string;
  category: 'FLOORING' | 'VENEER_LAMINATE' | 'PAINT_FINISH' | 'HARDWARE' | 'SANITARY' | 'LIGHTING';
  productName: string;
  brand: string;
  codeOrFinish: string;
  sampleStatus: 'REQUESTED' | 'SAMPLE_DELIVERED' | 'APPROVED_BY_CLIENT' | 'REJECTED';
  approvedByCustomer: boolean;
  approvalDate?: string;
  costImpactComparedToBudget: number; // 0 = within budget, positive = premium, negative = economy
}

// Module 11: Site Execution Daily Progress Report (DPR)
export interface DailyProgressReport {
  id: string;
  dprCode: string;
  date: string;
  weatherCondition: string;
  labourCountOnSite: {
    masons: number;
    carpenters: number;
    electricians: number;
    plumbers: number;
    helpers: number;
  };
  activitiesExecuted: string[];
  plannedTomorrow: string[];
  issuesDelays: string[];
  sitePhotographs: {
    caption: string;
    stage: string;
    time: string;
  }[];
  pettyExpensesToday: number;
  siteEngineer: string;
}

// Module 12: Change Orders & Additional Work (Variations)
export interface VariationOrder {
  id: string;
  voNumber: string; // VO-001
  title: string;
  requestedBy: 'CLIENT' | 'ARCHITECT' | 'SITE_CONSTRAINT';
  description: string;
  costImpact: number;
  sellingImpact: number;
  timeImpactDays: number;
  status: 'SUBMITTED' | 'ESTIMATOR_CHECKED' | 'APPROVED_BY_CLIENT' | 'REJECTED';
  approvedDate?: string;
}

// Module 13: Procurement PO & RFQ
export interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  trade: TradeCategory;
  itemsCount: number;
  totalAmount: number;
  issueDate: string;
  deliveryDateExpected: string;
  status: 'DRAFT' | 'ISSUED' | 'PARTIALLY_DELIVERED' | 'DELIVERED_CLOSED';
  paymentTerms: string;
}

// Module 15: Subcontractor Work Orders & Joint Measurement Certification
export interface SubcontractWorkOrder {
  id: string;
  woNumber: string; // SCWO-2026-01
  contractorName: string;
  trade: TradeCategory;
  agreedLabourRatePerUnit: string;
  contractValue: number;
  certifiedWorkDoneValue: number;
  retentionWithheld: number;
  amountPaid: number;
  status: 'ACTIVE_EXECUTION' | 'FINAL_BILL_CERTIFIED' | 'CLOSED';
}

// Module 19: Snag List
export interface SnagItem {
  id: string;
  snagCode: string;
  roomZone: string;
  trade: TradeCategory;
  description: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  assignedContractor: string;
  targetClosureDate: string;
  status: 'IDENTIFIED' | 'RECTIFICATION_IN_PROGRESS' | 'VERIFIED_CLOSED';
  closureDate?: string;
}

// Module 20: Handover & Warranty
export interface WarrantyRecord {
  id: string;
  component: string;
  oemBrand: string;
  coverageYears: number;
  startDate: string;
  expiryDate: string;
  policyNumber: string;
  status: 'ACTIVE' | 'EXPIRED';
}
