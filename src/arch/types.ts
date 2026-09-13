export type EngagementType =
  | 'Architecture consultancy'
  | 'Interior design consultancy'
  | 'Interior turnkey'
  | 'Construction execution'
  | 'Renovation'
  | 'Landscape'
  | 'Modular furniture'
  | 'Complete design-and-build';

export type SalesStage =
  | 'New Enquiry'
  | 'Site Survey'
  | 'Requirement Confirmed'
  | 'Concept Pitch'
  | 'Commercial Proposal'
  | 'Negotiation'
  | 'Won / Contract Signed'
  | 'Lost';

export const CRM_SALES_STAGES_ORDER: SalesStage[] = [
  'New Enquiry',
  'Site Survey',
  'Requirement Confirmed',
  'Concept Pitch',
  'Commercial Proposal',
  'Negotiation',
  'Won / Contract Signed',
];

export const STAGE_WIN_PROBABILITIES: Record<SalesStage, number> = {
  'New Enquiry': 15,
  'Site Survey': 30,
  'Requirement Confirmed': 50,
  'Concept Pitch': 65,
  'Commercial Proposal': 80,
  'Negotiation': 90,
  'Won / Contract Signed': 100,
  'Lost': 0,
};

export type DesignStatus =
  | 'Briefing'
  | '4-5 Concepts Generated'
  | 'Internal Review'
  | 'Customer Review'
  | 'Revision Requested'
  | 'Concept Approved'
  | 'Detailed GFC Drawings'
  | 'Handover to Site';

export type ExecutionStatus =
  | 'Pre-construction'
  | 'Mobilization'
  | 'Civil / Structural'
  | 'MEP & Services'
  | 'Finishes & Joinery'
  | 'Snagging & Punchlist'
  | 'Completed & Handed Over';

export type BillingStatus =
  | 'Unbilled'
  | 'Milestone Invoiced'
  | 'Partially Paid'
  | 'Fully Invoiced'
  | 'Overdue';

export type CollectionStatus =
  | 'Pending Advance'
  | 'Milestone Retentions'
  | 'Collected'
  | 'Defect Liability Retention';

export type WarrantyStatus =
  | 'Not Applicable'
  | '12-Month Fitout Warranty Active'
  | '5-Year Structural Warranty Active'
  | 'Service Claim Open'
  | 'Warranty Expired';

export type BudgetTier = 'Value / Affordable' | 'Standard Premium' | 'High-End Luxury' | 'Ultra Luxury Bespoke';

export interface SpatialZone {
  zone: string;
  allocationSqFt: number;
  flowDescription: string;
}

export interface MaterialSpec {
  costTier?: string;
  sampleAvailable?: boolean;
  category:
    | 'Flooring'
    | 'Joinery & Woodwork'
    | 'Wall Finishes'
    | 'Ceiling'
    | 'Hardware & Fixtures'
    | 'Lighting'
    | 'Hardware & Glazing'
    | 'Civil & Masonry'
    | 'Carpentry & Modular'
    | 'Painting & Polishing'
    | 'Electrical & MEP';
  material: string;
  finish: string;
  ecoRating: string;
  estimatedRatePerUnit: number;
  unit: string;
}

export interface VisualAnnotation {
  id: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  title: string;
  note: string;
  materialRef?: string;
}

export interface ArchitecturalVisualAsset {
  id: string;
  type: 'render_3d' | 'cad_floor_plan' | 'elevation_section' | 'material_moodboard' | 'client_reference' | 'massing_schematic';
  title: string;
  subtitle?: string;
  imageUrl: string;
  drawingNumber?: string;
  scale?: string;
  revision?: string;
  sheetSize?: string;
  caption?: string;
  isPrimary?: boolean;
  tags?: string[];
  annotations?: VisualAnnotation[];
  approvalStatus?: 'approved' | 'draft_pending_approval';
  isCustomUpload?: boolean;
  uploadedAt?: string;
  sourceType?: 'client_upload' | 'architect_cad' | 'ai_synthesis' | 'sample_data';
}

export interface ConceptOption {
  id: string;
  optionNumber: number; // 1 to 5
  title: string;
  themeStyle: string;
  architecturalNarrative: string;
  spatialZoning: SpatialZone[];
  materials: MaterialSpec[];
  sustainabilityScore: number; // 0 - 100
  estimatedCostPerSqFt: number;
  totalEstimatedCost: number;
  estimatedWeeks: number;
  visualAssets?: ArchitecturalVisualAsset[];
  // Staging & Approval governance for Drawing Sheets & 3D presentation
  drawingSheetsApproved?: boolean;
  drawingSheetsApprovalDate?: string;
  drawingSheetsApprovedBy?: string;
  drawingSheetsApprovalNotes?: string;
  hasUnapprovedDraftSheets?: boolean;
  stagedVisualAssets?: ArchitecturalVisualAsset[];
  sampleReferenceImages?: {
    id: string;
    url: string;
    caption: string;
    uploadedAt: string;
    sourceType: 'client_upload' | 'sample_data' | 'site_survey';
  }[];
  renderTheme: {
    accentColor: string;
    secondaryColor: string;
    styleTag: string;
    schematicType: 'biophilic' | 'minimalist' | 'industrial' | 'classic' | 'contemporary';
  };
  internalReview: {
    reviewedBy: string;
    approvedForClient: boolean;
    leadNotes: string;
    reviewDate: string;
  };
  clientReview: {
    isShared: boolean;
    clientApproved: boolean;
    clientComments: string;
    approvalDate?: string;
  };
  isSelectedConcept: boolean;
  aiCritique?: {
    solarAndDaylighting: { score: number; verdict: string; recommendations: string[] };
    spatialCirculation: { score: number; verdict: string; recommendations: string[] };
    embodiedCarbonAndEco: { score: number; verdict: string; recommendations: string[] };
    constructibilityAndCost: { score: number; verdict: string; recommendations: string[] };
    executiveSummary: string;
    keyStrengths: string[];
    potentialRisks: string[];
  };
  aiPitchScript?: {
    clientHook: string;
    narrativeWalkthrough: string;
    closingObjectionHandler: string;
    timestamp: string;
  };
}

export interface GenerationProgress {
  isStreaming: boolean;
  step: number;
  totalSteps: number;
  phase: string;
  message: string;
}

export interface GeminiStatus {
  connected: boolean;
  configured?: boolean;
  healthy?: boolean;
  model: string;
  imageModel: string;
  checked: boolean;
}

export interface DetailedDeliverable {
  id: string;
  code: string;
  title: string;
  category: 'Architectural' | 'Interior GFC' | 'MEP & HVAC' | '3D Renders' | 'Structural';
  status: 'Pending' | 'In Progress' | 'Under Review' | 'Approved / GFC Issued';
  assignedTo: string;
  revision: string;
  dueDate: string;
}

export interface BOQItem {
  id: string;
  category: 'Civil & Masonry' | 'Carpentry & Modular' | 'Electrical & MEP' | 'Painting & Polishing' | 'Hardware & Glazing' | 'Soft Furnishing' | 'Professional Fees';
  itemCode: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  amount: number;
  notes?: string;
}

export interface BOQRevision {
  revisionNumber: number; // 0, 1, 2...
  revisionLabel: string; // "Rev 0 - Baseline", "Rev 1 - Scope expansion"
  date: string;
  author: string;
  reasonForChange: string;
  items: BOQItem[];
  subtotal: number;
  contingencyPercent: number;
  contractorMarginPercent: number;
  taxPercent: number;
  grandTotal: number;
}

export interface SiteExecutionMilestone {
  id: string;
  title: string;
  phase: string;
  targetStartDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  progressPercent: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  leadSupervisor: string;
  prerequisites: string;
}

export interface SnagItem {
  id: string;
  roomOrZone: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Rectification' | 'Verified & Closed';
  assignedContractor: string;
  reportedDate: string;
  closedDate?: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  milestoneTitle: string;
  percentageOfContract: number;
  amountDue: number;
  retentionWithheld: number;
  issueDate: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  paidDate?: string;
  paidAmount?: number;
}

export interface WarrantyServiceTicket {
  id: string;
  ticketNumber: string;
  reportedDate: string;
  clientContact?: string;
  issueDescription: string;
  warrantyCategory?: 'Carpentry / Hinges' | 'Electrical & Lighting' | 'Plumbing & Drainage' | 'Paint / Surface Finishes' | 'Structural Waterproofing';
  status: 'Logged' | 'Claim Received' | 'Technician Dispatched' | 'Parts Ordered' | 'Resolved' | 'Closed';
  technicianAssigned?: string;
  notes?: string;
  resolutionNotes?: string;
}

export interface CRMActivity {
  id: string;
  type: 'call' | 'meeting' | 'site_visit' | 'note' | 'stage_change' | 'milestone';
  title: string;
  description?: string;
  author: string;
  timestamp: string;
  stageAtTime?: SalesStage;
  dueDate?: string;
}

export interface SampleInspirationData {
  id: string;
  clientName: string;
  source: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  createdAt?: string;
}

export interface ProjectCustomer {
  id: string;
  enquiryNumber: string;
  clientName: string;
  organizationOrFamily: string;
  contactEmail: string;
  contactPhone: string;
  
  // Site & Engagement
  siteAddress: string;
  siteCity: string;
  siteAreaSqFt: number;
  builtUpAreaSqFt: number;
  engagementType: EngagementType;
  budgetTier: BudgetTier;
  targetBudget: number;
  targetTimelineMonths: number;
  
  // Confirmed Requirements Brief
  confirmedRequirements: {
    projectVision: string;
    roomZones: string[];
    stylePreferences: string[];
    specialConstraints: string;
    dateConfirmed: string;
  };
  customerReferences?: SampleInspirationData[];

  // Next Action clear responsibility
  nextAction: {
    actionTitle: string;
    assigneeName: string;
    assigneeRole: string;
    dueDate: string;
    priority: 'Normal' | 'Urgent' | 'Critical';
    isCompleted: boolean;
  };

  // 6 Distinct Statuses
  salesStage: SalesStage;
  designStatus: DesignStatus;
  executionStatus: ExecutionStatus;
  billingStatus: BillingStatus;
  collectionStatus: CollectionStatus;
  warrantyStatus: WarrantyStatus;

  // CRM Process Flow Extensions
  crmActivities?: CRMActivity[];
  qualificationChecklist?: Record<string, boolean>;
  winProbability?: number;

  // AI Concept Studio options (4 to 5 options)
  conceptOptions: ConceptOption[];
  selectedConceptId?: string;
  conceptCarriedForwardDate?: string;

  // Carried Forward Deliverables & BOQ
  detailedDeliverables: DetailedDeliverable[];
  boqRevisions: BOQRevision[];
  activeBOQRevisionNumber: number;

  // Site Execution & Snagging
  executionMilestones: SiteExecutionMilestone[];
  snagItems: SnagItem[];

  // Operational Billing & Handover / Warranty
  invoices: InvoiceRecord[];
  handoverDate?: string;
  warrantyExpiryDate?: string;
  defectLiabilityRetentionAmount: number;
  warrantyTickets: WarrantyServiceTicket[];

  createdAt: string;
  updatedAt: string;

  // Industry-Specific Compliance & Technical Intelligence (India AEC industry reference)
  // Optional: components should fall back to sensible synthesized defaults when absent.
  industryCompliance?: IndustryComplianceProfile;
}

export type PlanApprovalStatus =
  | 'Not Submitted'
  | 'Submitted'
  | 'Under Scrutiny'
  | 'Approved'
  | 'Revision Sought';

export type OccupancyCertificateStatus = 'Not Applicable' | 'Pending' | 'Applied' | 'Received';

export type SoilTestStatus = 'Pending' | 'In Progress' | 'Completed';

export type GreenBuildingRating =
  | 'None'
  | 'IGBC Certified'
  | 'IGBC Silver'
  | 'IGBC Gold'
  | 'IGBC Platinum'
  | 'GRIHA 3-Star'
  | 'GRIHA 5-Star';

export interface IndustryComplianceProfile {
  approvalAuthority: string;
  planApprovalStatus: PlanApprovalStatus;
  fsiPermissible: number;
  fsiUtilized: number;
  groundCoveragePercent: number;
  setbacksCompliant: boolean;
  soilTestStatus: SoilTestStatus;
  structuralConsultant: string;
  mepConsultant: string;
  greenBuildingRating: GreenBuildingRating;
  occupancyCertificateStatus: OccupancyCertificateStatus;
  reraRegistrationNumber?: string;
}

// ==========================================
// MASTER DATA MANAGEMENT MODULE TYPES
// ==========================================

export type MasterTabType =
  | 'trades'
  | 'materials'
  | 'zones'
  | 'vendors'
  | 'milestones'
  | 'team';

export interface TradeCategoryMaster {
  id: string;
  code: string;
  name: string;
  description: string;
  defaultMarginPercent: number;
  defaultContingencyPercent: number;
  defaultLeadDays: number;
  status: 'Active' | 'Inactive';
}

export interface MaterialMaster {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  standardRate: number;
  ecoRating: string;
  preferredSupplier: string;
  leadTimeDays: number;
  specs: string;
  status: 'Active' | 'Inactive';
}

export interface SpaceZoneMaster {
  id: string;
  code: string;
  roomName: string;
  spaceTypology: 'Residential' | 'Commercial' | 'Hospitality' | 'Institutional';
  typicalAreaSqFt: number;
  typicalBudgetPerSqFt: number;
  priorityFinishes: string[];
  status: 'Active' | 'Inactive';
}

export interface VendorMaster {
  id: string;
  code: string;
  companyName: string;
  tradeCategory: string;
  contactPerson: string;
  phone: string;
  email: string;
  rating: number; // 1-5
  complianceStatus: 'Verified & Insured' | 'Pending Audit' | 'Probationary';
  activeSitesCount: number;
  paymentTerms: string;
  status: 'Active' | 'Inactive';
}

export interface MilestoneStageTemplate {
  stageName: string;
  percentage: number;
  triggerCondition: string;
}

export interface MilestoneTemplateMaster {
  id: string;
  code: string;
  templateName: string;
  engagementType: EngagementType;
  stages: MilestoneStageTemplate[];
  retentionPercent: number;
  status: 'Active' | 'Inactive';
}

export interface TeamMemberMaster {
  id: string;
  code: string;
  fullName: string;
  role: string;
  department: 'Architecture' | 'Interior Design' | 'Project Management' | 'MEP Engineering' | 'Commercials & Estimation' | 'Site Supervision';
  email: string;
  phone: string;
  activeProjectsCount: number;
  status: 'Active' | 'Inactive';
}

export interface PredictiveFeatureWeight {
  feature: string;
  category: 'Engagement' | 'Commercial' | 'Governance' | 'Velocity';
  weight: number;
  direction: 'positive' | 'negative';
  description: string;
}

export interface ProjectDataScienceProfile {
  predictedWinProbability: number; // 0-100%
  winConfidenceInterval: [number, number]; // [min, max] e.g. [68, 84]
  marginErosionRiskScore: number; // 0-100
  delayRiskScore: number; // 0-100
  predictedSlippageDays: number;
  recommendedContingencyPercent: number;
  shapKeyDrivers: {
    driver: string;
    impactPercent: number; // positive or negative
    type: 'favorable' | 'risk';
  }[];
}

export interface MasterDataHubState {
  trades: TradeCategoryMaster[];
  materials: MaterialMaster[];
  zones: SpaceZoneMaster[];
  vendors: VendorMaster[];
  milestones: MilestoneTemplateMaster[];
  team: TeamMemberMaster[];
}

export type AppModuleId =
  | 'pipeline'
  | 'workspace'
  | 'ai-studio'
  | 'boq'
  | 'execution'
  | 'billing'
  | 'analytics'
  | 'masters';

export type PermissionLevel = 'full' | 'view_only' | 'none';

export type ModulePermissionSet = Record<AppModuleId, PermissionLevel>;

export interface ModulePermissionMeta {
  id: AppModuleId;
  name: string;
  category: string;
  description: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department?: string;
  studioName: string;
  licenseNumber?: string;
  bio?: string;
  avatarUrl?: string;
  password?: string;
  lastLoginAt?: string;
  permissions?: ModulePermissionSet;
}
