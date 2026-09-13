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

// --- Company Setup Master (Finance & General Ledger) ---
export interface StateGSTRegistration {
  stateCode: string;
  stateName: string;
  gstin: string;
  address: string;
  isPrimary: boolean;
}

export interface BankAccountSetup {
  id: string;
  bankName: string;
  branch: string;
  accountType: 'CURRENT' | 'ESCROW' | 'STATUTORY_RESERVE' | 'OVERDRAFT';
  accountNumber: string;
  ifscCode: string;
  swiftCode?: string;
  upiVpa?: string;
  isDefaultDisbursement: boolean;
  isDefaultReceipt: boolean;
  glAccountCode: string;
  balanceLimit?: number;
}

export interface DocumentSeriesSetup {
  id: string;
  documentType: string;
  name: string;
  prefix: string;
  suffix?: string;
  startingNumber: number;
  lastUsedNumber: number;
  numberPadding: number;
  previewExample: string;
}

export interface GLMappingAccount {
  accountCode: string;
  accountName: string;
  category: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  nature: 'DEBIT' | 'CREDIT';
  roleInWorkflow: string;
  isStatutory: boolean;
}

export interface CompanyFinanceSetupMaster {
  // 1. Legal Entity & Brand Details
  companyLegalName: string;
  tradeName: string;
  cinNumber: string;
  panNumber: string;
  tanNumber: string;
  udyamRegistrationNumber: string;
  enterpriseClassification: 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE';
  registeredAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    stateCode: string;
    pincode: string;
    country: string;
  };
  communication: {
    officialEmail: string;
    accountsEmail: string;
    phone: string;
    website: string;
  };
  authorizedSignatory: {
    name: string;
    designation: string;
    dinOrPan: string;
    email: string;
  };
  logoUrl?: string;

  // 2. Fiscal Year & Accounting Controls
  fiscalYear: {
    currentYearLabel: string;
    startDate: string;
    endDate: string;
    postingStatus: 'OPEN' | 'CLOSING_IN_PROGRESS' | 'LOCKED';
    allowPostingFrom: string;
    allowPostingTo: string;
    baseCurrency: string;
    currencySymbol: string;
    decimalPlaces: number;
    revenueRecognitionMethod: 'POCM_IND_AS_115' | 'COMPLETED_CONTRACT' | 'BILLING_MILESTONE';
    costAccountingMethod: 'JOB_ORDER_COSTING' | 'STANDARD_COSTING';
  };

  // 3. Taxation & Statutory Rates Master
  taxation: {
    primaryGstin: string;
    gstScheme: 'REGULAR' | 'COMPOSITION';
    stateRegistrations: StateGSTRegistration[];
    defaultWorksContractGstPercent: number;
    architecturalServiceSac: string;
    interiorDecorationSac: string;
    turnkeyBuildingSac: string;
    subcontractorTdsRatePercent: number;
    professionalConsultantTdsRatePercent: number;
    machineryRentTdsRatePercent: number;
    bocwLabourCessPercent: number;
    eInvoicingEnabled: boolean;
    eWayBillThreshold: number;
    reverseChargeApplicable: boolean;
  };

  // 4. Banking & Treasury Setup
  banking: {
    accounts: BankAccountSetup[];
    defaultCreditPeriodDays: number;
    clientRetentionPercent: number;
    subcontractorRetentionPercent: number;
    mobilizationAdvanceStandardPercent: number;
    interestOnDelayedPaymentPercent: number;
  };

  // 5. Document Numbering Series Controls
  numberSeries: DocumentSeriesSetup[];

  // 6. Chart of Accounts & GL Mapping
  glMappings: GLMappingAccount[];

  // 7. Audit & Financial Governance Guardrails
  governance: {
    dualApprovalThresholdAmount: number;
    budgetOverrunTolerancePercent: number;
    autoLockBudgetAfterClientApproval: boolean;
    requirePOForEveryDirectVendorInvoice: boolean;
    requireMeasurementBookEntryForSubcontractorBilling: boolean;
    strictCostCenterAllocation: boolean;
    enableMakerCheckerForDisbursements: boolean;
  };

  updatedAt: string;
  updatedBy: string;
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

// Module 27: Employee Project-Based Timesheet Management
export interface TimesheetEntry {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  employeeAvatar?: string;
  date: string; // YYYY-MM-DD
  weekNumber: string; // e.g. "W47 2024"
  dayOfWeek?: string; // "Mon", "Tue", etc.
  taskId?: string;
  taskTitle: string;
  category: 'Design' | 'Onsite' | 'Procurement' | 'Admin' | 'Survey' | 'MEP' | 'Consulting';
  hours: number;
  overtimeHours?: number;
  billable: boolean;
  billableRate: number; // in INR / hr or currency
  costRate: number; // in INR / hr
  totalCost: number;
  totalBillable: number;
  description: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'INVOICED';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  invoiceRef?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Module 28: Resource Deployment Project-Wise (People & Equipment Matrix)
export interface ResourceDeployment {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceType: 'EMPLOYEE' | 'EQUIPMENT';
  roleOrCategory: string; // e.g., 'Team Leader', 'Junior Architect', 'Scanner', 'Furniture Tools'
  avatar?: string;
  projectId: string;
  projectCode: string;
  projectTitle: string;
  clientName?: string;
  taskName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "07:00 AM"
  endTime: string; // e.g. "11:00 AM"
  durationHours: number;
  shiftLabel?: string; // e.g. "7:00 AM - 11:00 AM - Senior..."
  colorTheme: 'orange' | 'blue' | 'teal' | 'purple' | 'green' | 'amber' | 'indigo';
  utilizationPercent: number; // 0 to 100+
  status: 'CONFIRMED' | 'TENTATIVE' | 'COMPLETED';
  notes?: string;
}

// Project Tasks Kanban (Tasks, Timesheets, Schedulers)
export interface ProjectTask {
  id: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  title: string;
  stage: 'New' | 'Assessment' | 'Ongoing' | 'Customer feedback' | 'Done';
  category: 'Onsite' | 'Design' | 'Procurement' | 'Admin';
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  plannedHours: string; // e.g. "06:00"
  loggedHours: string; // e.g. "04:30"
  checklistTotal: number;
  checklistCompleted: number;
  priority: 1 | 2 | 3;
  isMilestone?: boolean;
  hasWarning?: boolean;
  imagePreview?: string;
  dueDate?: string;
  description?: string;
}

// ============================================================================
// EXTENDED ENTERPRISE SCHEMAS FOR 26-PILLAR COMPLETE LIFECYCLE
// ============================================================================

// 1. AI-Based Requirement & Design Suggestions (4-5 Project Options)
export interface AIDesignOption {
  id: string;
  projectId: string;
  optionCode: string; // e.g. "OPT-01-BIOPHILIC"
  optionName: string; // e.g. "Modern Biophilic Luxury"
  architecturalStyle: string; // e.g. "Contemporary Minimalist with Italian Marble & Warm Teak"
  lifestyleProfile: string; // e.g. "Working Executives, Frequent Entertainers, Pet-Friendly"
  layoutConcept: string; // Open-plan living-dining flow with concealed dry pantry
  spacePlanningSuggestions: string[];
  materialRecommendations: {
    trade: string;
    specification: string;
    brandTier: string;
    durabilityRating: string;
  }[];
  sustainabilityFeatures: string[];
  preliminaryBOQSummary: {
    civilDemolition: number;
    flooringMarble: number;
    carpentryMillwork: number;
    electricalAutomation: number;
    paintingFinishes: number;
    hvacPlumbing: number;
  };
  budgetRangeMin: number;
  budgetRangeMax: number;
  estimatedTimelineWeeks: number;
  pros: string[];
  cons: string[];
  internalApprovalStatus: 'PENDING_INTERNAL_APPROVAL' | 'INTERNAL_APPROVED' | 'SHARED_WITH_CLIENT' | 'CLIENT_SELECTED';
  approvedByEstimatorOrLead?: string;
  approvedDate?: string;
  internalReviewNotes?: string;
}

// 2. Subcontractor Measurement Book (MB) Entry
export interface MeasurementBookEntry {
  id: string;
  projectId: string;
  mbNumber: string; // e.g. "MB-2026-04"
  workOrderId: string; // SCWO-01
  contractorName: string;
  itemCode: string;
  trade: TradeCategory;
  description: string;
  locationRoom: string;
  measurementFormula: string; // "L: 24ft * W: 12ft"
  unit: MeasurementUnit;
  contractRate: number; // ₹ per unit
  previousQuantity: number;
  currentQuantity: number;
  cumulativeQuantity: number;
  totalCertifiedAmount: number; // currentQuantity * contractRate
  cumulativeCertifiedAmount: number;
  siteEngineerVerification: boolean;
  siteEngineerName: string;
  consultantApproval: boolean;
  consultantName: string;
  certifiedDate: string;
  status: 'DRAFT_ENTRY' | 'ENGINEER_VERIFIED' | 'APPROVED_FOR_BILLING' | 'DISPUTED';
  notes?: string;
}

// 3. Quality Non-Conformance Report (NCR) & Inspection Checklists
export interface QualityNCRRecord {
  id: string;
  projectId: string;
  ncrCode: string; // NCR-2026-012
  dateRaised: string;
  roomZone: string;
  trade: TradeCategory;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  description: string;
  rootCause: string;
  correctiveActionPlan: string;
  assignedContractorOrTeam: string;
  reworkCostINR: number;
  targetClosureDate: string;
  closureDate?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RE-INSPECTION_PENDING' | 'CLOSED_VERIFIED';
  inspectedBy: string;
  photoUrl?: string;
}

// 4. Safety & Compliance: Permit-To-Work (PTW) & ToolBox Talks
export interface SafetyPermitToWork {
  id: string;
  projectId: string;
  ptwNumber: string; // PTW-2026-088
  permitType: 'HOT_WORK' | 'WORKING_AT_HEIGHT' | 'ELECTRICAL_ISOLATION' | 'CONFINED_SPACE' | 'CIVIL_DEMOLITION';
  locationArea: string;
  contractorOrCrew: string;
  hazardsIdentified: string[];
  mandatoryPrecautions: string[];
  ppeEquipmentsVerified: string[]; // Safety Harness, Welding Visor, Insulated Gloves, Hard Hat
  issuedByOfficer: string;
  receivedBySupervisor: string;
  validFrom: string;
  validUntil: string;
  emergencyContact: string;
  status: 'ACTIVE_PERMIT' | 'EXPIRED' | 'REVOKED' | 'CLOSED';
}

// 5. Procurement RFQ & Vendor Comparative Statement
export interface ProcurementRFQ {
  id: string;
  projectId: string;
  rfqNumber: string; // RFQ-2026-045
  materialRequisitionId: string;
  itemDescription: string;
  trade: TradeCategory;
  requiredQuantity: number;
  unit: MeasurementUnit;
  requiredByDate: string;
  deliverySiteAddress: string;
  vendorQuotations: {
    vendorId: string;
    vendorName: string;
    unitRateINR: number;
    taxPercent: number;
    totalAmountINR: number;
    deliveryLeadTimeDays: number;
    paymentTerms: string;
    vendorRating: number; // 1 to 5
    isRecommended: boolean;
  }[];
  selectedVendorId?: string;
  status: 'RFQ_SENT' | 'COMPARISON_READY' | 'PO_ISSUED' | 'CANCELLED';
}

// 6. Goods Receipt Note (GRN) with Quality Inspection
export interface GoodsReceiptNote {
  id: string;
  projectId: string;
  grnNumber: string; // GRN-2026-104
  poNumber: string;
  vendorName: string;
  receivedDate: string;
  challanInvoiceNumber: string;
  itemsReceived: {
    itemCode: string;
    description: string;
    orderedQty: number;
    receivedQty: number;
    acceptedQty: number;
    rejectedQty: number;
    rejectionReason?: string;
    unit: string;
  }[];
  qualityInspectionStatus: 'PASSED' | 'CONDITIONALLY_ACCEPTED' | 'REJECTED';
  inspectorName: string;
  warehouseStorageLocation: string;
  notes?: string;
}

// 7. Equipment & Machinery Asset Record
export interface MachineryAssetRecord {
  id: string;
  assetCode: string; // EQ-2026-01
  assetName: string; // e.g. "Bosch GLM 150-27 C Laser Distance Measurer"
  category: 'SURVEY_INSTRUMENT' | 'HEAVY_TOOL' | 'CUTTING_MACHINE' | 'SCAFFOLDING' | 'GENERATOR' | 'AIR_COMPRESSOR';
  ownership: 'COMPANY_OWNED' | 'RENTED';
  assignedProjectId: string;
  assignedProjectCode: string;
  assignedOperator: string;
  operatorContact: string;
  dailyRentalRateINR: number;
  totalUsageHours: number;
  fuelConsumptionLiters?: number;
  lastMaintenanceDate: string;
  nextServiceDueDate: string;
  conditionStatus: 'EXCELLENT' | 'OPERATIONAL' | 'MAINTENANCE_REQUIRED' | 'BREAKDOWN';
  qrCodeTag: string;
}

// 8. Post-Handover Warranty & AMC Maintenance Ticket
export interface WarrantyMaintenanceTicket {
  id: string;
  projectId: string;
  projectCode: string;
  clientName: string;
  ticketNumber: string; // TKT-2026-009
  componentAffected: string; // e.g. "Kitchen Island Blum Pull-out runner"
  issueCategory: 'PLUMBING' | 'CARPENTRY_HARDWARE' | 'ELECTRICAL' | 'PAINT_PEELING' | 'MARBLE_SEALANT';
  complaintDescription: string;
  slaTargetHours: number; // e.g. 24 hours
  reportedDate: string;
  assignedTechnician: string;
  technicianPhone: string;
  resolutionStatus: 'REPORTED' | 'TECHNICIAN_DISPATCHED' | 'PARTS_ORDERED' | 'RESOLVED_SIGNED_OFF';
  sparesConsumed?: string;
  warrantyCovered: boolean;
  costIncurredINR: number;
  clientRating?: number;
}

// 9. End-to-End 15-Step Recommended Process Lifecycle Definition
export type ProcessLifecycleStepId = 
  | 'LEAD_CAPTURE'
  | 'CUSTOMER_REQUIREMENT'
  | 'SITE_SURVEY'
  | 'DESIGN_OPTIONS'
  | 'ESTIMATE_BOQ'
  | 'QUOTATION'
  | 'CONTRACT_APPROVAL'
  | 'PROJECT_CREATION'
  | 'PROCUREMENT'
  | 'SITE_EXECUTION'
  | 'MEASUREMENT_BILLING'
  | 'QUALITY_SAFETY'
  | 'CLIENT_APPROVAL'
  | 'HANDOVER'
  | 'WARRANTY_AMC';

export interface ProcessLifecycleStepMeta {
  stepNumber: number;
  id: ProcessLifecycleStepId;
  name: string;
  shortLabel: string;
  description: string;
  responsibleRole: string;
  primaryTab: string;
  keyArtifacts: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

