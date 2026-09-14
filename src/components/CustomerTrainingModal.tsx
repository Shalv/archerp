import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  X,
  Search,
  BookOpen,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  Layers,
  Palette,
  Database,
  FileSpreadsheet,
  Calculator,
  Network,
  FileText,
  FileSignature,
  GitPullRequest,
  Calendar,
  ClipboardCheck,
  ShoppingBag,
  PackageCheck,
  HardHat,
  Clock,
  AlertCircle,
  CheckSquare,
  Receipt,
  TrendingUp,
  Landmark,
  Smile,
  Key,
  Shield,
  BarChart3,
  Sparkles,
  FolderArchive,
  Printer,
  ExternalLink,
  Info,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { UserSession } from '../types/erp';

export interface CustomerTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
  currentUser?: UserSession;
}

interface TrainingStep {
  stepNumber: number;
  title: string;
  action: string;
  uiElements: string[];
  expectedResult: string;
  tips?: string;
}

interface ModuleTrainingData {
  id: string;
  code: string;
  tabKey: string;
  stageNumber: number;
  stageName: string;
  moduleName: string;
  icon: React.ElementType;
  primaryRoles: string[];
  objective: string;
  prerequisites: string[];
  steps: TrainingStep[];
  businessRules: string[];
  milestoneOutput: string;
}

export const CustomerTrainingModal: React.FC<CustomerTrainingModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  currentUser
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<number | 'ALL'>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [activeModuleId, setActiveModuleId] = useState<string>('M01');

  // Full sequential curriculum data
  const trainingCurriculum: ModuleTrainingData[] = useMemo(() => [
    // STAGE 1: ENQUIRY & CRM
    {
      id: 'M01',
      code: 'M01',
      tabKey: 'crm',
      stageNumber: 1,
      stageName: 'Stage 1 • Enquiry & CRM',
      moduleName: 'CRM & Lead Funnel Pipeline',
      icon: Users,
      primaryRoles: ['COMMERCIAL', 'SALES_LEAD', 'PROJECT_MANAGER', 'ADMIN'],
      objective: 'Capture new client inquiries, assess budget & timeline feasibility, schedule initial site laser surveys, and qualify leads into active projects.',
      prerequisites: [
        'Customer enquiry received via phone, web, referral, or architect network.',
        'Basic scope idea (e.g. 3BHK turnkey interior, 5000 sqft villa, office fit-out).'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Register New Customer Lead',
          action: 'Click "+ New Lead" button on the top right of the CRM board.',
          uiElements: ['Client Name', 'Phone & Email', 'Project Typology', 'Target Area (sq.ft)', 'Estimated Budget', 'Lead Source'],
          expectedResult: 'A new lead card appears under the "New Inquiries" stage in the CRM funnel.',
          tips: 'Always tag the Lead Source to accurately measure sales channel conversion rates.'
        },
        {
          stepNumber: 2,
          title: 'Qualify Scope & Schedule Site Visit',
          action: 'Open the lead card and click "Schedule Site Survey". Assign the lead Architect or Site Surveyor.',
          uiElements: ['Assigned Surveyor', 'Scheduled Date & Time', 'Site Location Pin', 'Client Special Requests'],
          expectedResult: 'Lead moves to "Site Visit Scheduled" column and surveyor receives site inspection alert.',
          tips: 'Verify if the property is in bare-shell, core & shell, or renovation condition.'
        },
        {
          stepNumber: 3,
          title: 'Promote Lead to Active Job Card',
          action: 'After completing feasibility, click "Promote to Job Card (Project)".',
          uiElements: ['Project Code Generator', 'Customer Directory Link', 'Initial Budget Freeze'],
          expectedResult: 'System provisions an official project record (e.g. PROJ-SKYLINE-1402) and creates customer profile.',
          tips: 'All subsequent design, BOQ, and billing will reference this generated Project Code.'
        }
      ],
      businessRules: [
        'Leads cannot be promoted to active Job Cards without minimum carpet area and customer phone number.',
        'Automatic conversion rate metrics update on the Role Center Dashboard in real-time.'
      ],
      milestoneOutput: 'Qualified Lead promoted to registered Project Job Card with assigned project code.'
    },
    {
      id: 'M02',
      code: 'M02',
      tabKey: 'contacts',
      stageNumber: 1,
      stageName: 'Stage 1 • Enquiry & CRM',
      moduleName: 'Customers & Contacts Directory',
      icon: Users,
      primaryRoles: ['ACCOUNT_MANAGER', 'FINANCE', 'PROJECT_MANAGER'],
      objective: 'Manage centralized customer dossiers, corporate GSTIN numbers, multi-property portfolios, and authorized decision-maker contacts.',
      prerequisites: [
        'Promoted customer profile from CRM or direct corporate client registration.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Review Customer Profile & Tax Information',
          action: 'Search for customer in the directory and click "Edit Account Profile".',
          uiElements: ['Legal Billing Entity', '15-Digit GSTIN', 'PAN Number', 'Permanent Address', 'Site Delivery Address'],
          expectedResult: 'Verified tax and billing profile ready for statutory GSTR compliance.',
          tips: 'For corporate clients, ensure billing address matches the State GST registration.'
        },
        {
          stepNumber: 2,
          title: 'Configure Client Portal Access',
          action: 'Toggle "Enable Customer Transparency Portal" and issue login credentials.',
          uiElements: ['Client Portal Username', 'Email Invite', 'Restricted Client View Settings'],
          expectedResult: 'Customer can log in to view 3D renders, approved drawings, and pay milestone invoices.',
          tips: 'Client role is read-only for designs and invoices, preventing accidental edits to BOQ.'
        }
      ],
      businessRules: [
        'GSTIN validation enforces standard Indian tax format (2 digits state code + 10 chars PAN + 1 entity + 1 Z + 1 checksum).',
        'Customer billing profile locks once the first formal Tax Invoice is posted.'
      ],
      milestoneOutput: 'Approved Customer Record linked to tax profile and digital portal account.'
    },

    // STAGE 2: SURVEY, ARCHITECTURE & SAMPLES
    {
      id: 'M03',
      code: 'M03',
      tabKey: 'survey',
      stageNumber: 2,
      stageName: 'Stage 2 • Survey & Design',
      moduleName: 'Site Survey & Laser Scan Hub',
      icon: Compass,
      primaryRoles: ['SITE_ENGINEER', 'ARCHITECT', 'ESTIMATOR'],
      objective: 'Log digital laser room measurements, structural beam clearances, plumbing shafts, and physical site constraints.',
      prerequisites: [
        'Physical site access granted by property owner / building association.',
        'Bosch GLM 50 laser distance meter or physical measurement tape.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Input Room-by-Room Laser Dimensions',
          action: 'Open Site Survey Hub and click "Add Room Measurement".',
          uiElements: ['Room Name', 'Length (ft)', 'Width (ft)', 'Clear Ceiling Height (ft)', 'Beam Drop Soffit (in)'],
          expectedResult: 'Real-time calculation of Floor Carpet Area (sq.ft) and Wall Surface Area (sq.ft).',
          tips: 'Record beam heights carefully as they dictate false ceiling drops and AC duct pathways.'
        },
        {
          stepNumber: 2,
          title: 'Mark Structural & MEP Constraints',
          action: 'Check constraint checkboxes and attach site inspection photos.',
          uiElements: ['Shear Wall Restrictions', 'Plumbing Shaft Location', 'Main Electrical Incomer', 'Window Sill Heights'],
          expectedResult: 'Constraints are highlighted in red on the architect\'s design brief and BOQ checklist.',
          tips: 'Photograph existing electrical distribution boxes to check breaker capacities.'
        },
        {
          stepNumber: 3,
          title: 'Submit & Lock Survey Baseline',
          action: 'Click "Submit & Lock Survey Dimensions".',
          uiElements: ['Lock Survey Button', 'Surveyor Digital Signature'],
          expectedResult: 'Survey data is locked and becomes the basis for the automated AI BOQ takeoff.',
          tips: 'Once locked, any physical dimension change must go through a revision request.'
        }
      ],
      businessRules: [
        'Total measured carpet area must reconcile within ±2% of client deed area.',
        'Laser measurements automatically populate the floor takeoff formulas in Module M07.'
      ],
      milestoneOutput: 'Digitally verified spatial model with exact square footages and constraint tags.'
    },
    {
      id: 'M04',
      code: 'M04',
      tabKey: 'drawings',
      stageNumber: 2,
      stageName: 'Stage 2 • Survey & Design',
      moduleName: 'Architectural Drawings & 3D Visuals',
      icon: Layers,
      primaryRoles: ['ARCHITECT', 'DESIGN_LEAD', 'PROJECT_MANAGER', 'CLIENT'],
      objective: 'Manage 2D CAD floor plans, Reflected Ceiling Plans (RCP), MEP schematics, 3D photorealistic renderings, and Good-for-Construction (GFC) releases.',
      prerequisites: [
        'Locked survey measurements from Module M03.',
        'Approved client design brief and lifestyle preferences.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Upload CAD Sheets & Drawing Packages',
          action: 'Click "Upload Drawing Sheet" and select drawing category.',
          uiElements: ['Category (Architectural, RCP, Electrical, Joinery)', 'Sheet Title', 'Drawing File (PDF/DWG)', 'Revision Code'],
          expectedResult: 'Drawing appears in the project sheet register with Revision tag Rev A.',
          tips: 'Always maintain naming conventions: e.g. PROJ-DWG-ARCH-01_RevA.'
        },
        {
          stepNumber: 2,
          title: 'Review 3D Photorealistic Views',
          action: 'Switch to the "3D Virtual Renderings" tab to inspect space finishes.',
          uiElements: ['Living Room Perspective', 'Master Bedroom Paneling', 'Kitchen Elevation', 'Material Callouts'],
          expectedResult: 'Photorealistic views display materials (Italian marble, smoked eucalyptus veneer, fluted panels).',
          tips: 'Ensure lighting color temperature (3000K Warm White) is noted for site execution.'
        },
        {
          stepNumber: 3,
          title: 'Grant GFC (Good-For-Construction) Approval',
          action: 'Lead Architect reviews the compliance checklist and clicks "Approve as GFC".',
          uiElements: ['GFC Stamp Button', 'Architect Digital Signature', 'Release to Site Toggle'],
          expectedResult: 'Watermark updates to "GFC - GOOD FOR CONSTRUCTION", releasing drawings to site teams.',
          tips: 'Site Engineers can only execute tasks against drawings with active GFC status.'
        }
      ],
      businessRules: [
        'Revisions automatically supersede previous versions while maintaining full archival history.',
        'Site team cannot print or download superseded drawings to prevent execution errors.'
      ],
      milestoneOutput: 'Approved GFC Drawing Set with 3D visualizations ready for execution.'
    },
    {
      id: 'M05',
      code: 'M05',
      tabKey: 'materials',
      stageNumber: 2,
      stageName: 'Stage 2 • Survey & Design',
      moduleName: 'Material & Sample Approval Matrix',
      icon: Palette,
      primaryRoles: ['INTERIOR_DESIGNER', 'ARCHITECT', 'CLIENT'],
      objective: 'Track physical samples (veneers, laminates, fabrics, stone, sanitaryware) from vendor dispatch through client physical inspection to formal approval.',
      prerequisites: [
        'Approved 3D renderings identifying required finish palettes.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Register Material Sample',
          action: 'Click "+ Add Sample Item" and enter manufacturer specifications.',
          uiElements: ['Material Category', 'Item Description', 'Brand & Code', 'Sample Type (Physical/Digital)', 'Supplier Name'],
          expectedResult: 'Sample card added with status "Requested from Supplier".',
          tips: 'Specify minimum sample dimensions (e.g. 1ft x 1ft for stone, full swatch book for fabrics).'
        },
        {
          stepNumber: 2,
          title: 'Log Sample Receipt & Client Presentation',
          action: 'Update status to "Sample Received at Studio" then "Presented to Client".',
          uiElements: ['Date Received', 'Studio Location Tag', 'Client Presentation Meeting Notes'],
          expectedResult: 'Sample audit trail updates with physical receipt date.',
          tips: 'Hold sample against warm natural light during the client meeting.'
        },
        {
          stepNumber: 3,
          title: 'Obtain Client Digital or Physical Sign-off',
          action: 'Record client approval by clicking "Approve Sample".',
          uiElements: ['Client Signature Capture', 'Approved Photo of Swatch', 'Finish Lock Confirmation'],
          expectedResult: 'Status becomes "Approved by Client"; Procurement POs are unlocked for this material.',
          tips: 'Approved sample is tagged with barcode and safely stored in the site sample room.'
        }
      ],
      businessRules: [
        'Purchase orders for finishing items cannot be issued until the corresponding sample is "Approved by Client".',
        'If a sample is rejected, reason must be recorded (e.g. Grain too dark, texture too glossy) before ordering a replacement.'
      ],
      milestoneOutput: 'Comprehensive Approved Material Palette locking all brand specifications.'
    },

    // STAGE 3: ESTIMATION & BOQ
    {
      id: 'M06',
      code: 'M06',
      tabKey: 'masters',
      stageNumber: 3,
      stageName: 'Stage 3 • Estimation & BOQ',
      moduleName: 'Master Schedule of Rates (Table 27)',
      icon: Database,
      primaryRoles: ['CHIEF_ESTIMATOR', 'QUANTITY_SURVEYOR', 'ADMIN'],
      objective: 'Maintain standardized unit cost libraries across civil, false ceiling, carpentry, electrical, plumbing, and painting trades with base materials, labor, and markup.',
      prerequisites: [
        'Current market vendor quotes and prevailing skilled/unskilled labor daily wages.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Browse Rate Library Catalog',
          action: 'Use the category filters (Civil, Woodwork, MEP, Finishes) to inspect unit rates.',
          uiElements: ['Item Code', 'Item Description', 'Standard UOM (SQFT, RFT, NOS)', 'Base Material Cost', 'Labor Cost', 'Default Sales Price'],
          expectedResult: 'Displays full cost composition and gross margin for each standard item.',
          tips: 'Search by keywords like "veneer", "gypsum", "concealed" to quickly locate items.'
        },
        {
          stepNumber: 2,
          title: 'Update or Add Custom Rate Item',
          action: 'Click "+ Add Master Rate" or click "Edit" on an existing item.',
          uiElements: ['Item Code (e.g. WOOD-WARD-04)', 'Description', 'Base Material Cost (₹)', 'Labor Rate (₹)', 'Default Markup (%)'],
          expectedResult: 'System computes the Recommended Sales Price based on input costs and markup.',
          tips: 'Review quarterly against inflation indices to protect contract profitability.'
        }
      ],
      businessRules: [
        'Rate changes require Chief Estimator or Admin authorization.',
        'Existing project Job Cards lock their rates upon baseline approval to preserve historical integrity.'
      ],
      milestoneOutput: 'Master Table 27 database providing verified unit costs for all project estimates.'
    },
    {
      id: 'M07',
      code: 'M07',
      tabKey: 'boq',
      stageNumber: 3,
      stageName: 'Stage 3 • Estimation & BOQ',
      moduleName: 'BOQ Estimating Engine & Job Planning Lines',
      icon: FileSpreadsheet,
      primaryRoles: ['QUANTITY_SURVEYOR', 'ESTIMATOR', 'PROJECT_MANAGER'],
      objective: 'Build comprehensive, itemized Bill of Quantities with dynamic formulas, room-wise tagging, rate lookups, and revision baselining.',
      prerequisites: [
        'Locked survey measurements from Module M03 and approved drawing scope from M04.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Auto-Generate Takeoff via AI or Manual Selection',
          action: 'Option A: Click "✨ AI Takeoff from Survey Dimensions" to auto-populate quantities. Option B: Click "+ Add Line Item".',
          uiElements: ['Category Picker', 'Master Rate Code', 'Line Description', 'Room Location Tag', 'Quantity & UOM'],
          expectedResult: 'Planning line is added to the active Job Card with real-time cost and sales price calculations.',
          tips: 'Assigning accurate Room Tags (e.g. Master Bedroom, Kitchen) enables room-wise client breakdown.'
        },
        {
          stepNumber: 2,
          title: 'Adjust Specifications, Overrides & Markup',
          action: 'Click on unit cost or markup percentage to adjust for project-specific complexity.',
          uiElements: ['Quantity (e.g. 180 SQFT)', 'Unit Cost (₹ 1,850)', 'Markup (22.5%)', 'Total Line Price (₹ 4,07,925)'],
          expectedResult: 'Total Contract Value and Gross Margin update instantaneously.',
          tips: 'Add item specifications in the line notes (e.g. "Blum clip-top hinges, Hafele profile handles").'
        },
        {
          stepNumber: 3,
          title: 'Approve Official Budget Baseline',
          action: 'Click "Approve as Official Budget Baseline".',
          uiElements: ['Baseline Confirmation Dialog', 'Revision Snapshot Tag (Rev B)', 'Freeze Quantities Checkbox'],
          expectedResult: 'BOQ is stamped as Baseline Approved. Future changes must go through Variation Orders (M12).',
          tips: 'Baseline approval is mandatory before issuing customer quotations or purchasing materials.'
        }
      ],
      businessRules: [
        'Quantity cannot be zero or negative.',
        'Once baselined, lines cannot be deleted; they can only be revised via change orders.'
      ],
      milestoneOutput: 'Official Baselined Job Planning Lines with locked cost budget and sales price.'
    },
    {
      id: 'M08',
      code: 'M08',
      tabKey: 'budget',
      stageNumber: 3,
      stageName: 'Stage 3 • Estimation & BOQ',
      moduleName: 'Cost Budget & Margin Analysis',
      icon: Calculator,
      primaryRoles: ['COMMERCIAL_MANAGER', 'ESTIMATOR', 'MANAGING_DIRECTOR'],
      objective: 'Evaluate direct costs, labor splits, site overheads, contingency buffers, and verify gross profit margin thresholds.',
      prerequisites: [
        'Baselined BOQ from Module M07.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Review Cost Breakdown Ratios',
          action: 'Open Cost Budget view and inspect the direct cost summary cards.',
          uiElements: ['Total Material Cost (55%)', 'Direct Labor Cost (25%)', 'Subcontractor MEP (10%)', 'Total Direct Cost'],
          expectedResult: 'Visual verification that trade allocations fall within healthy industry benchmarks.',
          tips: 'Material costs exceeding 60% may indicate un-optimized procurement assumptions.'
        },
        {
          stepNumber: 2,
          title: 'Configure Overheads & Contingency Buffer',
          action: 'Verify or adjust indirect cost parameters.',
          uiElements: ['Site Overheads % (Default: 8.0%)', 'Contingency Reserve % (Default: 5.0%)', 'Total Budgeted Cost'],
          expectedResult: 'Contingency reserve provides a safety buffer against unexpected site complications.',
          tips: 'Older renovation projects should carry a 7–8% contingency instead of 5%.'
        },
        {
          stepNumber: 3,
          title: 'Check Margin Guardrail',
          action: 'Review Gross Profit Margin percentage indicator.',
          uiElements: ['Gross Margin % Gauge', 'Green Target Threshold (≥ 18.5%)', 'Amber Alert (< 18.5%)'],
          expectedResult: 'System green-lights commercial quotation generation if margin is healthy.',
          tips: 'If amber alert triggers, perform Value Engineering (M10) before presenting to client.'
        }
      ],
      businessRules: [
        'Quotations cannot be issued without Chief Commercial approval if Gross Margin is below 15.0%.',
        'Contingency drawdowns require Project Manager authorization during execution.'
      ],
      milestoneOutput: 'Verified Project Cost Budget with locked margin targets and risk contingencies.'
    },
    {
      id: 'M09',
      code: 'M09',
      tabKey: 'traceability',
      stageNumber: 3,
      stageName: 'Stage 3 • Estimation & BOQ',
      moduleName: 'Cost Traceability Matrix (4-Way Match)',
      icon: Network,
      primaryRoles: ['COST_CONTROLLER', 'INTERNAL_AUDITOR', 'QUANTITY_SURVEYOR'],
      objective: 'Track line-by-line financial audit linking BOQ Item → Baseline Budget → Committed PO/WO → Actual Incurred Cost.',
      prerequisites: [
        'Active project execution with issued Purchase Orders or Subcontractor Vouchers.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Inspect 4-Way Match Audit Columns',
          action: 'Open Traceability Matrix and review the audit columns for each work package.',
          uiElements: ['BOQ Code', 'Budget Allocation (₹)', 'Committed PO Amount (₹)', 'Actual Cost Paid (₹)', 'Cost Variance (₹ / %)'],
          expectedResult: 'Clear visibility into whether costs are running under or over budget for every single item.',
          tips: 'Sort by "Variance %" descending to immediately pinpoint high-cost overruns.'
        },
        {
          stepNumber: 2,
          title: 'Investigate Cost Variances',
          action: 'Click any red warning badge to see the underlying vendor PO or subcontractor claim.',
          uiElements: ['Variance Drill-down Modal', 'Offending PO Number', 'Quantity Deviation', 'Price Escalation Reason'],
          expectedResult: 'Detailed explanation of why the line experienced cost escalation.',
          tips: 'Trigger a Variation Order (M12) if variance was caused by client-requested specification upgrades.'
        }
      ],
      businessRules: [
        'System flags any line where Committed Cost exceeds Budget Allocation by more than 5%.',
        'Provides audit defense for management reviews and statutory cost accounting.'
      ],
      milestoneOutput: 'End-to-end Cost Traceability audit record protecting project bottom-line.'
    },

    // STAGE 4: COMMERCIAL & CONTRACTS
    {
      id: 'M10',
      code: 'M10',
      tabKey: 'quotation',
      stageNumber: 4,
      stageName: 'Stage 4 • Commercial & Contracts',
      moduleName: 'Customer Quotation & Value Engineering',
      icon: FileText,
      primaryRoles: ['COMMERCIAL_DIRECTOR', 'PROJECT_MANAGER', 'SALES_LEAD'],
      objective: 'Generate branded, professional customer proposals with 3-tier Value Engineering options and progressive milestone payment tranches.',
      prerequisites: [
        'Baselined BOQ from M07 and approved budget from M08.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Select Value Engineering Proposal Tier',
          action: 'Choose the appropriate proposal tier to present to the client.',
          uiElements: ['Economy Tier (Melamine, BWR ply)', 'Standard Tier (Natural Teak veneer, Marine ply, Hafele)', 'Luxury Tier (Italian marble, Smoked veneer, Blum)'],
          expectedResult: 'Quotation rates and specifications adjust automatically to match chosen tier.',
          tips: 'Presenting Standard vs Luxury gives clients clear choice without losing the deal.'
        },
        {
          stepNumber: 2,
          title: 'Configure Milestone Payment Tranches',
          action: 'Review the standard 5-stage payment schedule.',
          uiElements: ['Tranche 1: Mobilization Advance (20%)', 'Tranche 2: Civil & MEP Completion (25%)', 'Tranche 3: Carpentry Carcass (30%)', 'Tranche 4: Finishes & Paint (20%)', 'Tranche 5: Handover (5%)'],
          expectedResult: 'Progressive billing schedule ensures positive cash flow throughout execution.',
          tips: 'Never start physical demolition on site without receipt of Tranche 1 Mobilization Advance.'
        },
        {
          stepNumber: 3,
          title: 'Post Formal Quotation & Export PDF',
          action: 'Click "Post & Generate Formal Quotation" then click "Print / Export PDF".',
          uiElements: ['Quotation Number Tag (e.g. QT-2026-0891)', 'Company Header', 'Commercial Terms', 'Print Button'],
          expectedResult: 'PDF document generated with formal legal clauses, payment bank details, and room summaries.',
          tips: 'Send directly to client or allow client to inspect and accept in their Customer Portal.'
        }
      ],
      businessRules: [
        'Quotation validity is standard 30 calendar days from date of issuance.',
        'Prices are exclusive or inclusive of GST as defined in Company Setup.'
      ],
      milestoneOutput: 'Official Customer Quotation document with structured payment milestones.'
    },
    {
      id: 'M11',
      code: 'M11',
      tabKey: 'contracts',
      stageNumber: 4,
      stageName: 'Stage 4 • Commercial & Contracts',
      moduleName: 'Commercial Contracts & Terms',
      icon: FileSignature,
      primaryRoles: ['LEGAL_ADVISOR', 'PROJECT_MANAGER', 'MANAGING_DIRECTOR'],
      objective: 'Execute turnkey interior contracting agreements, retention money clauses, Defect Liability Period, and liquidated damages.',
      prerequisites: [
        'Accepted customer quotation from Module M10.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Establish Contract Sum & Retention Clauses',
          action: 'Open Commercial Contracts and verify contract parameters.',
          uiElements: ['Total Lump-Sum Contract Amount', 'Retention Money % (5.0%)', 'Defect Liability Period (12 Months)', 'Liquidated Damages (0.5%/week)'],
          expectedResult: 'Contractual terms documented and ready for signing.',
          tips: 'The 5% retention protects against incomplete defects at project handover.'
        },
        {
          stepNumber: 2,
          title: 'Upload Signed Contract Document',
          action: 'Upload PDF of countersigned agreement.',
          uiElements: ['Document Upload Box', 'Signatory Names', 'Execution Date', 'Status: Legally Binding'],
          expectedResult: 'Contract status changes to "Executed & Binding", unlocking site mobilization.',
          tips: 'Signed contracts are automatically archived in Module M25 Cloud Store.'
        }
      ],
      businessRules: [
        'No site execution work can commence without an executed contract or signed Work Authorization letter.',
        'Retention deductions are calculated automatically on every customer invoice in Module M19.'
      ],
      milestoneOutput: 'Legally binding turnkey interior contract with signed execution terms.'
    },
    {
      id: 'M12',
      code: 'M12',
      tabKey: 'variations',
      stageNumber: 4,
      stageName: 'Stage 4 • Commercial & Contracts',
      moduleName: 'Variation Orders & Scope Changes',
      icon: GitPullRequest,
      primaryRoles: ['PROJECT_MANAGER', 'QUANTITY_SURVEYOR', 'CLIENT'],
      objective: 'Manage mid-project client additions or omissions without eroding contract margins or causing unbilled work.',
      prerequisites: [
        'Client verbal or written request for additional work or design alteration.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Initiate Variation Order (VO)',
          action: 'Click "+ New Variation Order" and enter scope details.',
          uiElements: ['VO Sequence (e.g. VO-01)', 'Scope Description', 'Reason (Client Upgrade, Site Condition)', 'Additional Quantities'],
          expectedResult: 'VO draft created with unique tracking ID.',
          tips: 'Always tag who requested the change: Client, Architect, or Structural Engineer.'
        },
        {
          stepNumber: 2,
          title: 'Calculate Cost & Schedule Impact',
          action: 'Enter itemized cost delta and additional working days required.',
          uiElements: ['Cost Delta (₹ +2,85,000 + GST)', 'Schedule Extension (+7 Working Days)', 'Revised Completion Date'],
          expectedResult: 'Client is presented with exact financial and timeline impact before work begins.',
          tips: 'Never execute extra work on verbal promise; always obtain digital approval.'
        },
        {
          stepNumber: 3,
          title: 'Obtain Client Approval & Merge into Budget',
          action: 'Once client approves in portal, click "Merge VO into Job Card Budget".',
          uiElements: ['Client Approval Timestamp', 'Merge Action Button', 'Updated Contract Value'],
          expectedResult: 'Job Card budget and contract sum increase automatically in real time.',
          tips: 'Merged VO lines appear automatically in the next Running Account (RA) Bill.'
        }
      ],
      businessRules: [
        'Unapproved VOs cannot be billed or committed to subcontractors.',
        'Prevents commercial disputes during final account settlement.'
      ],
      milestoneOutput: 'Formally approved Variation Order with updated contract value and schedule.'
    },

    // STAGE 5: SITE OPERATIONS & EXECUTION
    {
      id: 'M29',
      code: 'M29',
      tabKey: 'project_hub',
      stageNumber: 5,
      stageName: 'Stage 5 • Execution & Site Ops',
      moduleName: 'Project Management Hub & Kanban Tasks',
      icon: Calendar,
      primaryRoles: ['PROJECT_MANAGER', 'SITE_ENGINEER', 'SITE_SUPERVISOR'],
      objective: 'Manage site tasks, sprint milestones, trade assignments, and daily task completion across interactive Kanban columns.',
      prerequisites: [
        'Executed contract and site mobilization clearance.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Create Site Task Cards',
          action: 'Click "+ Add Task" under the relevant column or backlog.',
          uiElements: ['Task Title', 'Category / Trade (Civil, MEP, Carpentry, Paint)', 'Assignee', 'Due Date', 'Priority (Urgent/High/Normal)'],
          expectedResult: 'Task card is positioned on the Kanban board.',
          tips: 'Break work into 2-to-3 day manageable tasks for reliable daily tracking.'
        },
        {
          stepNumber: 2,
          title: 'Move Tasks Across Execution Stages',
          action: 'Drag and drop cards as work progresses: Backlog → Scheduled → In Progress → Quality Inspection → Completed.',
          uiElements: ['Kanban Board Columns', 'Checklist Sub-items', 'Completion % Slider'],
          expectedResult: 'Role Center Dashboard reflects live task progress percentage.',
          tips: 'Only mark task as "Completed" after site supervisor physical inspection.'
        }
      ],
      businessRules: [
        'Tasks with priority "Urgent" trigger instant alerts to assigned supervisors.',
        'Completed tasks feed into the Daily Progress Report (DPR) automatically.'
      ],
      milestoneOutput: 'Organized daily sprint board ensuring synchronized trade execution.'
    },
    {
      id: 'M13',
      code: 'M13',
      tabKey: 'schedule',
      stageNumber: 5,
      stageName: 'Stage 5 • Execution & Site Ops',
      moduleName: 'Master Site Schedule & WBS Gantt',
      icon: Calendar,
      primaryRoles: ['PLANNING_ENGINEER', 'PROJECT_MANAGER'],
      objective: 'Track overall project timeline, critical path milestones, task dependencies, and scheduled vs actual progress percentage.',
      prerequisites: [
        'Project start date and committed completion date from Contract M11.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Inspect Master WBS Phases',
          action: 'Review the sequential timeline bars.',
          uiElements: ['Phase 1: Civil & Demolition', 'Phase 2: MEP First Fix', 'Phase 3: Woodwork Carcass', 'Phase 4: Polishing & Painting', 'Phase 5: MEP Fixtures', 'Phase 6: Snagging & Handover'],
          expectedResult: 'Visual roadmap showing current site status against planned schedule.',
          tips: 'Identify the Critical Path (activities with zero float) to prevent completion delays.'
        },
        {
          stepNumber: 2,
          title: 'Detect Schedule Slippage',
          action: 'Compare Planned % vs Actual % on the progress bar.',
          uiElements: ['Planned Progress %', 'Actual Progress %', 'Schedule Variance (Days Ahead / Behind)'],
          expectedResult: 'If slippage exceeds 5 days, system prompts resource redeployment.',
          tips: 'Use overtime shifts in Carpentry to recover lost civil demolition days.'
        }
      ],
      businessRules: [
        'Critical milestones cannot be postponed without client written consent.',
        'Schedule updates automatically recalculate the Earned Value Management (SPI) index.'
      ],
      milestoneOutput: 'Live WBS Gantt schedule maintaining deadline compliance.'
    },
    {
      id: 'M14',
      code: 'M14',
      tabKey: 'site_execution',
      stageNumber: 5,
      stageName: 'Stage 5 • Execution & Site Ops',
      moduleName: 'Daily Progress Reports (DPR)',
      icon: ClipboardCheck,
      primaryRoles: ['SITE_ENGINEER', 'SITE_SUPERVISOR'],
      objective: 'Document daily on-site trade attendance, work completed today, materials arrived, delay reasons, and upload mandatory site photos.',
      prerequisites: [
        'Physical site supervision and end-of-day site briefing with trade foremen.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Create Today\'s Daily Report',
          action: 'Click "+ New Daily Report". System auto-fills today\'s date and current weather.',
          uiElements: ['Report Date', 'Weather Conditions', 'Shift Hours', 'Site Supervisor Name'],
          expectedResult: 'DPR draft opens for data entry.',
          tips: 'File DPR before 7:00 PM daily to ensure management has fresh morning reports.'
        },
        {
          stepNumber: 2,
          title: 'Log Trade Manpower Headcount',
          action: 'Enter skilled and helper attendance by trade.',
          uiElements: ['Carpenters', 'Masons', 'Electricians', 'Plumbers', 'Painters', 'Helpers', 'Total Site Headcount'],
          expectedResult: 'Verifies daily productivity and validates contractor labor billing.',
          tips: 'Note if any trade was absent or understaffed.'
        },
        {
          stepNumber: 3,
          title: 'Detail Work Done & Upload Photos',
          action: 'Write specific work progress by room and upload at least 3 timestamped photos.',
          uiElements: ['Room-wise Work Description', 'Percentage Completed Today', 'Photo Upload Box (Camera / Gallery)', 'Site Impediments / Roadblocks'],
          expectedResult: 'DPR creates permanent legal record of daily site accomplishments.',
          tips: 'Capture close-up photos of concealed piping before walls are plastered.'
        },
        {
          stepNumber: 4,
          title: 'Submit DPR for Manager Review',
          action: 'Click "Submit DPR".',
          uiElements: ['Submit Action Button', 'Digital Timestamp'],
          expectedResult: 'Report is locked and broadcast to Project Manager and Client Portal.',
          tips: 'Clients love reading daily summaries with photos in their portal.'
        }
      ],
      businessRules: [
        'DPR cannot be submitted without at least one progress photo and labor headcount.',
        'DPR logs feed into Mandatory Report #9 (DPR Activity Log Summary).'
      ],
      milestoneOutput: 'Official timestamped Daily Progress Report with photographic evidence.'
    },
    {
      id: 'M15',
      code: 'M15',
      tabKey: 'procurement',
      stageNumber: 5,
      stageName: 'Stage 5 • Execution & Site Ops',
      moduleName: 'Procurement & Purchase Orders (POs)',
      icon: ShoppingBag,
      primaryRoles: ['PROCUREMENT_OFFICER', 'PURCHASE_MANAGER', 'QUANTITY_SURVEYOR'],
      objective: 'Issue formal vendor Purchase Orders matched to BOQ line codes, enforce budget caps, track delivery lead times, and manage payment terms.',
      prerequisites: [
        'Approved Material Sample (M05) and baselined BOQ (M07).'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Create Vendor Purchase Order',
          action: 'Click "+ Create Purchase Order" and select vendor from Table 23.',
          uiElements: ['Vendor Picker', 'Delivery Site Address', 'Payment Terms (Advance / 30 Days)', 'Required Delivery Date'],
          expectedResult: 'PO header generated with sequence PO-2026-XXXX.',
          tips: 'Select approved vendors with verified GSTIN numbers to secure input tax credits.'
        },
        {
          stepNumber: 2,
          title: 'Add PO Line Items Linked to BOQ',
          action: 'Add items and link to corresponding BOQ line codes.',
          uiElements: ['Item Code', 'Quantity & UOM', 'Negotiated Unit Rate', 'Total PO Value', 'Budget Cap Indicator'],
          expectedResult: 'System checks that PO amount does not breach the budgeted item allocation.',
          tips: 'Negotiate bulk discounts across multiple projects where possible.'
        },
        {
          stepNumber: 3,
          title: 'Authorize & Dispatch PO',
          action: 'Click "Approve & Dispatch PO to Vendor".',
          uiElements: ['Digital Signature', 'Email Dispatch', 'PDF Generation'],
          expectedResult: 'Committed cost updates in Cost Traceability (M09) and financial ledgers.',
          tips: 'Track vendor confirmation and expected dispatch dates.'
        }
      ],
      businessRules: [
        'POs exceeding line budget by >5% require Commercial Director override.',
        'Vendor advance payments cannot be released without an approved PO.'
      ],
      milestoneOutput: 'Legally authorized Purchase Order dispatched to verified vendor.'
    },
    {
      id: 'M16',
      code: 'M16',
      tabKey: 'inventory',
      stageNumber: 5,
      stageName: 'Stage 5 • Execution & Site Ops',
      moduleName: 'Material Inward & GRN Stock Register',
      icon: PackageCheck,
      primaryRoles: ['STOREKEEPER', 'SITE_ENGINEER'],
      objective: 'Verify physical material arrivals against vendor POs, inspect quality, record Goods Received Notes (GRN), and maintain site stock balance.',
      prerequisites: [
        'Physical delivery truck arrival at site with delivery challan and invoice copy.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Initiate Goods Received Note (GRN)',
          action: 'Click "+ Record Material Inward (GRN)" and select the associated PO.',
          uiElements: ['PO Selector', 'Vendor Delivery Challan No', 'Challan Date', 'Vehicle / Driver Details'],
          expectedResult: 'PO line items load automatically into the receipt grid.',
          tips: 'Never accept material without an official delivery challan.'
        },
        {
          stepNumber: 2,
          title: 'Inspect Quality & Count Physical Quantities',
          action: 'Enter Quantity Received, Quantity Accepted, and Quantity Damaged / Rejected.',
          uiElements: ['Ordered Qty', 'Delivered Qty', 'Accepted Qty', 'Damaged Qty', 'Rejection Reason Note'],
          expectedResult: 'System updates site inventory only for the Accepted Quantity.',
          tips: 'Inspect plywood sheets for corner damage, warping, or delamination.'
        },
        {
          stepNumber: 3,
          title: 'Photograph Challan & Post GRN',
          action: 'Take a clear photo of signed physical challan and click "Post GRN".',
          uiElements: ['Challan Photo Upload', 'Storekeeper Digital Stamp', 'Post GRN Button'],
          expectedResult: 'Site stock balance updates; Finance is notified to process vendor payment voucher.',
          tips: 'Attach copy of vendor warranty card directly to the GRN record.'
        }
      ],
      businessRules: [
        'Vendor invoices cannot be settled without an approved matching GRN (3-Way Match: PO + Challan + Invoice).',
        'Damaged items generate an immediate debit note alert.'
      ],
      milestoneOutput: 'Official Goods Received Note (GRN) certifying physical inventory receipt.'
    },
    {
      id: 'M17',
      code: 'M17',
      tabKey: 'contractors',
      stageNumber: 5,
      stageName: 'Stage 5 • Execution & Site Ops',
      moduleName: 'Subcontractors & Joint Measurement Book (MB)',
      icon: HardHat,
      primaryRoles: ['SITE_QS', 'SITE_ENGINEER', 'SUBCONTRACTOR'],
      objective: 'Jointly record physical site measurements to certify trade subcontractor progress bills (Gypsum, Tiling, Painting, Carpentry).',
      prerequisites: [
        'Subcontract Work Order executed and physical stage of work completed on site.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Select Trade Contractor & Item Code',
          action: 'Open Joint MB and pick the active subcontractor.',
          uiElements: ['Subcontractor Name', 'Trade Work Package (e.g. Gypsum Ceilings)', 'Work Order Reference'],
          expectedResult: 'Displays work order rates and previous cumulative certified quantities.',
          tips: 'Verify work order scope before taking physical measurements.'
        },
        {
          stepNumber: 2,
          title: 'Record Physical Measurements (L x B x H)',
          action: 'Input detailed dimensions for each completed room or surface.',
          uiElements: ['Room Description', 'Length (ft)', 'Breadth (ft)', 'Number of Units', 'Deductions for Openings', 'Certified Area (SQFT)'],
          expectedResult: 'Exact area computed with automatic standard opening deductions.',
          tips: 'Deduct window and door openings as per IS:1200 standard measurement rules.'
        },
        {
          stepNumber: 3,
          title: 'Joint Sign-off & Issue Payment Certificate',
          action: 'Both Site Engineer and Contractor representative digitally sign the MB sheet.',
          uiElements: ['Engineer Signature', 'Contractor Sign-off', 'Generate Interim Payment Certificate (IPC)'],
          expectedResult: 'Certified amount is approved for payment, less 5% retention.',
          tips: 'Eliminates dispute over fabricated or exaggerated subcontractor claims.'
        }
      ],
      businessRules: [
        'Total cumulative certified quantity cannot exceed the Work Order quantity without an approved VO.',
        '5% retention money is withheld from each subcontractor bill until DLP expiration.'
      ],
      milestoneOutput: 'Jointly signed Measurement Book sheet and certified subcontractor payment voucher.'
    },
    {
      id: 'M27',
      code: 'M27',
      tabKey: 'timesheets',
      stageNumber: 5,
      stageName: 'Stage 5 • Execution & Site Ops',
      moduleName: 'Employee Timesheet Management',
      icon: Clock,
      primaryRoles: ['ARCHITECT', 'PROJECT_MANAGER', 'SITE_ENGINEER', 'INTERN'],
      objective: 'Track internal employee labor hours, billable project rates, and overtime with an interactive live stopwatch.',
      prerequisites: [
        'Assigned project task or site inspection duty.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Start Live Task Timer or Manual Log',
          action: 'Option A: Click "Start Live Timer" when starting work. Option B: Click "+ Log Hours Manually".',
          uiElements: ['Project Selector', 'Task Activity (Site Inspection, CAD Detailing, Client Meeting)', 'Live Timer Display', 'Stop Timer Button'],
          expectedResult: 'Tracks exact time spent on the specific activity.',
          tips: 'Tag the specific module or drawing sheet being worked on.'
        },
        {
          stepNumber: 2,
          title: 'Submit Daily Timesheet',
          action: 'Review logged hours and click "Submit Timesheet for Week".',
          uiElements: ['Total Hours (e.g. 8.5 hrs)', 'Billable vs Non-Billable Split', 'Work Accomplished Notes'],
          expectedResult: 'Labor cost is allocated to the project Job Card based on employee hourly cost rate.',
          tips: 'Managers review and approve timesheets every Monday morning.'
        }
      ],
      businessRules: [
        'Standard working day is 8 hours; excess hours flagged as overtime requiring manager approval.',
        'Billable hours feed into Mandatory Report #17 (Labor Productivity).'
      ],
      milestoneOutput: 'Verified timesheet log providing accurate internal project labor costing.'
    },
    {
      id: 'M28',
      code: 'M28',
      tabKey: 'resources',
      stageNumber: 5,
      stageName: 'Stage 5 • Execution & Site Ops',
      moduleName: 'Resource Deployment Matrix',
      icon: Users,
      primaryRoles: ['GENERAL_SUPERINTENDENT', 'PROJECT_MANAGER'],
      objective: 'Allocate, balance, and mobilize labor trades, specialized tools, and heavy machinery across multiple active project sites.',
      prerequisites: [
        'Active site schedules and trade headcount requirements.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Inspect Multi-Site Resource Allocations',
          action: 'Open Resource Deployment Matrix to see company-wide deployment.',
          uiElements: ['Trade Rosters (Carpenters, Masons, Polishers)', 'Equipment Tracker (Scaffolding, Cutters, Compressors)', 'Site Capacity Gauges'],
          expectedResult: 'Overview of where company manpower and equipment are stationed.',
          tips: 'Prevents bottlenecks where two high-priority sites compete for the same specialized crews.'
        },
        {
          stepNumber: 2,
          title: 'Reallocate Resources Seamlessly',
          action: 'Reassign crews or machinery from Site A to Site B with one click.',
          uiElements: ['Transfer Action', 'Destination Project', 'Effective Date', 'Transport Logistics Note'],
          expectedResult: 'Deployment schedule updates and site supervisors receive reassignment alert.',
          tips: 'Mobilize polishing and painting crews only after carpentry dust has settled.'
        }
      ],
      businessRules: [
        'Resource conflicts trigger automatic calendar alerts to Project Managers.',
        'Maintains optimal utilization rate (Target: ≥ 85% billable crew utilization).'
      ],
      milestoneOutput: 'Balanced labor and equipment deployment schedule optimizing multi-site delivery.'
    },
    {
      id: 'M18',
      code: 'M18',
      tabKey: 'snags',
      stageNumber: 5,
      stageName: 'Stage 5 • Execution & Site Ops',
      moduleName: 'Quality Audits & Snag List Management',
      icon: AlertCircle,
      primaryRoles: ['QA_QC_AUDITOR', 'LEAD_ARCHITECT', 'SITE_ENGINEER', 'CLIENT'],
      objective: 'Systematically log defects, assign rectification trades, enforce SLA deadlines, upload before/after photographic proof, and achieve zero-defect handover.',
      prerequisites: [
        'Pre-handover walk-through inspection or routine QA audit.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Log Defect / Snag Ticket',
          action: 'Click "+ Log Snag Item" and capture defect details.',
          uiElements: ['Location (e.g. Master Bedroom, West Wall)', 'Defect Description (e.g. Uneven paint patch & brush marks)', 'Severity (Critical, Major, Minor)', 'Assigned Trade (Painting)', 'Due Date (e.g. 48 hrs)', 'Defect Photo'],
          expectedResult: 'Snag ticket created with status "Open / Pending Rectification".',
          tips: 'Be specific: "Tile joint lip of 2mm at foyer entry" is actionable; "Floor not good" is not.'
        },
        {
          stepNumber: 2,
          title: 'Execute Rectification & Upload After-Photo',
          action: 'Trade contractor rectifies defect and uploads after-photo.',
          uiElements: ['After Rectification Photo', 'Work Completed Notes', 'Status: Ready for Inspection'],
          expectedResult: 'Site Engineer is notified to conduct physical verification inspection.',
          tips: 'Ensure after-photo is taken from the exact same camera angle and lighting.'
        },
        {
          stepNumber: 3,
          title: 'Verify & Close Snag',
          action: 'QA Auditor or Architect verifies work and clicks "Verify & Close Snag".',
          uiElements: ['Auditor Digital Stamp', 'Close Date/Time Tag', 'Zero-Snag Count Gauge'],
          expectedResult: 'Ticket is closed. Remaining open snag counter decrements in the FactBox Pane.',
          tips: 'Final client handover requires zero remaining open critical or major snags.'
        }
      ],
      businessRules: [
        'Critical snags must be addressed within 24 hours.',
        'Subcontractor final bills are blocked if they have open snags older than 7 days.'
      ],
      milestoneOutput: 'Verified Zero-Defect Snag Resolution Certificate ready for client handover.'
    },
    {
      id: 'M24',
      code: 'M24',
      tabKey: 'compliance',
      stageNumber: 5,
      stageName: 'Stage 5 • Execution & Site Ops',
      moduleName: 'Compliance, Licenses & Permits to Work (PTW)',
      icon: CheckSquare,
      primaryRoles: ['EHS_SAFETY_OFFICER', 'SITE_MANAGER'],
      objective: 'Manage building society NOC permits, hot work permits, fire safety compliance, PPE protocols, and contractor insurance policies.',
      prerequisites: [
        'Building management / society rules and statutory safety standards.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Upload Society NOC & Working Hours Rules',
          action: 'Upload signed society approval document.',
          uiElements: ['Apartment Owners Association (AOA) NOC', 'Permitted Working Hours (e.g. 9:00 AM - 6:00 PM)', 'Noisy Work Hours (10:00 AM - 1:00 PM)', 'Security Deposit Receipt'],
          expectedResult: 'Compliance checklist activates and enforces site shift limits.',
          tips: 'Adhere strictly to society noisy work timings to prevent site work stoppages.'
        },
        {
          stepNumber: 2,
          title: 'Issue Permit to Work (PTW)',
          action: 'Click "Issue Hot Work / Height Permit" for hazardous activities.',
          uiElements: ['Activity Type (Welding, Scaffolding at Height)', 'Safety Checklist (Fire Extinguisher, Harness, Helmet)', 'Safety Officer Sign-off'],
          expectedResult: 'Active PTW generated with 24-hour expiration window.',
          tips: 'Conduct mandatory 5-minute morning toolbox talk before starting hot work.'
        }
      ],
      businessRules: [
        'Site operations must immediately halt if society NOC or insurance policy expires.',
        'Zero-tolerance policy on mandatory PPE (Hardhat, reflective vest, safety shoes).'
      ],
      milestoneOutput: 'Active compliance dossier and daily safe working permits.'
    },

    // STAGE 6: BILLING & FINANCE
    {
      id: 'M19',
      code: 'M19',
      tabKey: 'billing',
      stageNumber: 6,
      stageName: 'Stage 6 • Billing & Finance',
      moduleName: 'Customer Billing & Running Account (RA) Invoices',
      icon: Receipt,
      primaryRoles: ['FINANCE_OFFICER', 'PROJECT_MANAGER', 'CLIENT'],
      objective: 'Generate formal GSTR-compliant Running Account (RA) tax invoices against certified milestones with cumulative retention and advance recovery deductions.',
      prerequisites: [
        'Certified milestone completion (e.g. Carpentry Carcass 30% complete) and executed contract.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Generate New Running Account (RA) Bill',
          action: 'Click "+ Generate New RA Bill". System assigns next sequence (e.g. RA-BILL-02).',
          uiElements: ['Invoice Number', 'Billing Date', 'Certified Milestone Picker', 'Gross Progress Claim (₹)'],
          expectedResult: 'Invoice calculation engine opens with automatic statutory formulas.',
          tips: 'Ensure previous RA bill collections have been posted before issuing a new bill.'
        },
        {
          stepNumber: 2,
          title: 'Review Statutory Deductions & Tax Splits',
          action: 'Verify computed deductions and tax amounts.',
          uiElements: ['Gross Progress Claim (e.g. ₹ 20,00,000)', 'Less: 5% Retention (- ₹ 1,00,000)', 'Less: Advance Recovery (- ₹ 2,00,000)', 'Taxable Amount (₹ 17,00,000)', 'CGST @ 9% (+ ₹ 1,53,000)', 'SGST @ 9% (+ ₹ 1,53,000)', 'Net Payable (₹ 20,06,000)'],
          expectedResult: 'Transparent, accurate invoice math preventing client billing disputes.',
          tips: 'The 5% retention accumulates into the dedicated project retention holding ledger.'
        },
        {
          stepNumber: 3,
          title: 'Authorize & Issue Official Tax Invoice',
          action: 'Click "Authorize & Post Tax Invoice".',
          uiElements: ['Finance Digital Stamp', 'QR Code Generator', 'Print / PDF Export Button', 'Client Notification Alert'],
          expectedResult: 'Official GSTR-compliant invoice is posted and transmitted to Client Portal.',
          tips: 'Client receives payment link and bank virtual account details for instant wire transfer.'
        }
      ],
      businessRules: [
        'Tax invoices must strictly comply with GST Rule 46 (HSN/SAC codes, state code, GSTIN).',
        'Cumulative billed amount cannot exceed total contract sum + approved variation orders.'
      ],
      milestoneOutput: 'Official Statutory GSTR Tax Invoice with verified payment milestone claim.'
    },
    {
      id: 'M20',
      code: 'M20',
      tabKey: 'finance',
      stageNumber: 6,
      stageName: 'Stage 6 • Billing & Finance',
      moduleName: 'Financial Ledger & Real-Time Cash Flow',
      icon: TrendingUp,
      primaryRoles: ['CFO', 'MANAGING_DIRECTOR', 'PROJECT_ACCOUNTANT'],
      objective: 'Track real-time project cash waterfall (Inflows vs Outflows), committed liabilities, vendor payouts, and net realized operating margins.',
      prerequisites: [
        'Recorded customer collections and posted vendor/contractor payment vouchers.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Analyze Project Cash Waterfall',
          action: 'Open Financial Ledger and inspect the four core cash cards.',
          uiElements: ['Total Inflow (Client Collections Received)', 'Total Outflow (Vendor & Labor Payouts)', 'Committed Pending (Open POs & Subcontracts)', 'Net Liquid Cash Position'],
          expectedResult: 'Clear visibility into whether the project is currently cash-flow positive or negative.',
          tips: 'Aim to keep net cash position positive by timing supplier payouts after client tranche receipts.'
        },
        {
          stepNumber: 2,
          title: 'Inspect Realized Operating Margin',
          action: 'Review Gross Profit Realized to date.',
          uiElements: ['Contract Sum Billed', 'Actual Cost Incurred', 'Realized Gross Margin %', 'Comparison with Budget Target'],
          expectedResult: 'Verifies that project is tracking at or above the targeted 18.5% margin.',
          tips: 'Detect margin erosion early before final project completion.'
        }
      ],
      businessRules: [
        'All financial movements write immutable entries into the double-entry General Ledger.',
        'Directly powers Mandatory Report #3 (Project Cash Flow Projection).'
      ],
      milestoneOutput: 'Complete real-time Financial Ledger balancing all project revenues and expenses.'
    },

    // STAGE 7: HANDOVER, WARRANTY & REPORTS
    {
      id: 'M21',
      code: 'M21',
      tabKey: 'handover',
      stageNumber: 7,
      stageName: 'Stage 7 • Handover & Reports',
      moduleName: 'Project Handover & Key Release',
      icon: Key,
      primaryRoles: ['LEAD_ARCHITECT', 'PROJECT_MANAGER', 'CLIENT'],
      objective: 'Perform final site turnover, zero-snag sign-off, key handover ceremony, and issue official Certificate of Practical Completion (CPC).',
      prerequisites: [
        'All snags verified closed in M18, deep cleaning completed, and final payment cleared.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Verify Handover Prerequisite Checklist',
          action: 'Open Project Handover and verify all 5 condition gates.',
          uiElements: ['Gate 1: Zero Open Snags (100% Resolved)', 'Gate 2: Deep Chemical Cleaning Completed', 'Gate 3: As-Built Drawings Compiled', 'Gate 4: Final Payment Reconciled', 'Gate 5: Asset Manuals Assembled'],
          expectedResult: 'System green-lights the "Execute Final Handover" button once all gates are satisfied.',
          tips: 'Do not release main door physical keys until Gate 4 (Final Payment) is confirmed cleared by Finance.'
        },
        {
          stepNumber: 2,
          title: 'Execute Digital Handover Sign-off & CPC',
          action: 'Client and Project Manager provide digital signatures on the handover tablet.',
          uiElements: ['Client Handover Signature', 'Architect Certification Stamp', 'Certificate of Practical Completion (CPC) Generator', 'Key Handover Timestamp'],
          expectedResult: 'Generates formal Certificate of Practical Completion and starts Defect Liability Clock.',
          tips: 'Present the client with the physical brass branded handover welcome kit and keys.'
        }
      ],
      businessRules: [
        'Project status transitions from "In Progress" to "Completed & Handed Over".',
        'Defect Liability Period (12 months) begins exactly on the Handover Timestamp.'
      ],
      milestoneOutput: 'Signed Certificate of Practical Completion (CPC) and official project turnover.'
    },
    {
      id: 'M22',
      code: 'M22',
      tabKey: 'warranty',
      stageNumber: 7,
      stageName: 'Stage 7 • Handover & Reports',
      moduleName: 'Warranty Registry & Defect Liability (DLP)',
      icon: Shield,
      primaryRoles: ['SERVICE_MANAGER', 'CLIENT', 'PROJECT_MANAGER'],
      objective: 'Maintain centralized registry of OEM equipment warranties (plywood, hardware, air conditioning, paint) and manage 12-month DLP post-handover service tickets.',
      prerequisites: [
        'Handed over project with registered supplier warranty certificates.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Inspect Registered Asset Warranties',
          action: 'Browse the registered project warranty asset cards.',
          uiElements: ['Plywood Borer/Termite (CenturyPly - 25 Yrs)', 'Hardware Soft-Close (Hafele/Blum - 5 Yrs)', 'Waterproofing Membrane (Dr. Fixit - 10 Yrs)', 'Paint Surface Guarantee (Asian Paints - 3 Yrs)', 'HVAC Compressors (Daikin - 5 Yrs)'],
          expectedResult: 'Client and service team have instant access to serial numbers, invoice copies, and warranty cards.',
          tips: 'Download the compiled "Warranty & Care Manual" PDF for the homeowner.'
        },
        {
          stepNumber: 2,
          title: 'Log DLP Service Request',
          action: 'If a minor defect occurs during the 12-month period, client or manager clicks "+ Log DLP Ticket".',
          uiElements: ['Issue Description (e.g. Cabinet hinge adjustment)', 'Room Location', 'Photo Upload', 'Assigned Service Technician'],
          expectedResult: 'Service ticket dispatched with guaranteed 48-hour response SLA.',
          tips: 'Prompt DLP service builds stellar client goodwill and yields valuable referral business.'
        },
        {
          stepNumber: 3,
          title: 'Release Retention Money upon DLP Expiration',
          action: 'At the end of 12 months with all DLP tickets resolved, initiate retention release.',
          uiElements: ['12-Month DLP Audit Clearance', 'Release 5% Client Retention Certificate', 'Release Subcontractor Retentions'],
          expectedResult: 'Withheld retention money is returned or closed in the financial ledger.',
          tips: 'Final financial closure of the project is now fully achieved.'
        }
      ],
      businessRules: [
        'OEM warranty documents are permanently stored in Cloud Transmittals M25.',
        'Retention money cannot be released if there are active, unresolved DLP service tickets.'
      ],
      milestoneOutput: 'Comprehensive Warranty Dossier and verified Defect Liability Period administration.'
    },
    {
      id: 'M23',
      code: 'M23',
      tabKey: 'portal',
      stageNumber: 7,
      stageName: 'Stage 7 • Handover & Reports',
      moduleName: 'Customer Satisfaction Portal',
      icon: Smile,
      primaryRoles: ['CLIENT', 'CUSTOMER_SUCCESS_MANAGER'],
      objective: 'Provide clients with full visibility into their project journey, photos, approved drawings, milestone payments, and collect formal Net Promoter Score (NPS) feedback.',
      prerequisites: [
        'Active client portal login credentials issued in Module M02.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Client Navigates Journey Overview',
          action: 'Client logs in to view project summary, active phase, and completed milestones.',
          uiElements: ['Project Progress Bar (e.g. 95% Complete)', 'Photo Gallery', 'Approved 3D Views', 'Paid vs Due Invoices'],
          expectedResult: 'Client experiences complete transparency and confidence in the execution quality.',
          tips: 'Portal updates in real time whenever the site engineer submits a DPR.'
        },
        {
          stepNumber: 2,
          title: 'Submit Formal NPS Review & Feedback',
          action: 'Client rates project experience on a 1-to-10 scale and writes detailed feedback.',
          uiElements: ['NPS Score (1-10 Slider)', 'Design Rating (Stars)', 'Execution Quality Rating', 'Timeliness Rating', 'Written Testimonial Box'],
          expectedResult: 'Feedback is recorded on the Executive Dashboard; high NPS triggers referral incentives.',
          tips: 'Collect testimonial quotes for company social media and architectural portfolio.'
        }
      ],
      businessRules: [
        'Scores 9–10 classified as Promoters, 7–8 as Passives, ≤6 as Detractors.',
        'Any score below 7 immediately notifies the Managing Director for swift corrective engagement.'
      ],
      milestoneOutput: 'Verified Client Net Promoter Score (NPS) and authentic testimonial rating.'
    },
    {
      id: 'M26',
      code: 'M26',
      tabKey: 'reports',
      stageNumber: 7,
      stageName: 'Stage 7 • Handover & Reports',
      moduleName: 'Mandatory Reports Hub (All 22 Project Reports)',
      icon: BarChart3,
      primaryRoles: ['MANAGING_DIRECTOR', 'PROJECT_MANAGER', 'AUDITOR', 'ALL_ROLES'],
      objective: 'Access the centralized reporting suite containing all 22 required executive, management, financial, and operational reports with instant export to PDF and Excel.',
      prerequisites: [
        'Active or completed project with data recorded across preceding modules.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Filter Reports by Category or Role',
          action: 'Use category tabs: Executive Reports, Management Reports, User & Operations Reports.',
          uiElements: ['Category Filter Tabs', 'Report Search Bar', 'Report Cards (1 through 22)'],
          expectedResult: 'Displays the list of standard reports formatted to D365 Business Central specifications.',
          tips: 'Use Report #2 (EVM Earned Value) for project steering committee meetings.'
        },
        {
          stepNumber: 2,
          title: 'Generate & Inspect Detailed Report',
          action: 'Click "View Report" on any card (e.g. Report #1: Executive Financial Dashboard).',
          uiElements: ['Report Preview Modal', 'Data Tables & KPI Cards', 'Charts & Visualizations', 'Parameter Date Filters'],
          expectedResult: 'Generates live calculation with exact current project figures.',
          tips: 'Verify EVM Cost Performance Index (CPI ≥ 1.0) and Schedule Performance Index (SPI ≥ 1.0).'
        },
        {
          stepNumber: 3,
          title: 'Export to Excel CSV or Print PDF',
          action: 'Click "Export to Excel" or "Print PDF".',
          uiElements: ['Excel CSV Export Button', 'Print Preview', 'Official Report Header'],
          expectedResult: 'Clean, formatted file downloaded for board presentation or external auditing.',
          tips: 'All reports include project code, active revision ID, generation timestamp, and user signature.'
        }
      ],
      businessRules: [
        'All 22 reports derive data directly from transactional tables; no manual data entry allowed.',
        'Strict RBAC controls ensure team members only see reports authorized for their role.'
      ],
      milestoneOutput: '22 Verified Enterprise MIS Reports satisfying all management and audit compliance.'
    },

    // STAGE 8: AI & ADMINISTRATION
    {
      id: 'AI',
      code: 'AI',
      tabKey: 'ai_workspace',
      stageNumber: 8,
      stageName: 'Stage 8 • Intelligence & Admin',
      moduleName: 'Agentic AI Copilot Action Center',
      icon: Sparkles,
      primaryRoles: ['PROJECT_MANAGER', 'ESTIMATOR', 'ARCHITECT', 'ADMIN'],
      objective: 'Autonomous AI Copilot running continuous background audits to detect cost spikes, schedule bottlenecks, BOQ takeoff omissions, and provide one-click recommendations.',
      prerequisites: [
        'Project Job Card with active BOQ, schedule, or site execution data.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Open Agentic AI Action Center',
          action: 'Click "Agentic AI Action Center" from the Left Sidebar or click Copilot icon in top bar.',
          uiElements: ['Autonomous Scan Status', 'Health Score Gauge', 'Active Recommendations Feed', 'Urgency Badges (High, Medium, Low)'],
          expectedResult: 'Displays AI-detected findings categorized into Cost, Schedule, Quality, and Compliance.',
          tips: 'Run an AI audit whenever a major design revision or variation order is initiated.'
        },
        {
          stepNumber: 2,
          title: 'Inspect AI Findings & Explanations',
          action: 'Click on a recommendation card to read root-cause analysis and proposed action.',
          uiElements: ['Finding Summary', 'Detailed Explanation', 'Projected Cost Savings (₹)', 'Action Button (e.g. "Apply Alternative Material")'],
          expectedResult: 'Clear understanding of why the Copilot made this recommendation.',
          tips: 'Copilot checks historical vendor rates to suggest more cost-effective suppliers.'
        },
        {
          stepNumber: 3,
          title: 'Accept & Apply Recommendation',
          action: 'Click "Accept Recommendation" to execute the action automatically.',
          uiElements: ['Accept Button', 'Dismiss Option', 'Audit Log Confirmation'],
          expectedResult: 'System applies the suggested optimization directly to the active project.',
          tips: 'All Copilot actions are logged in the System Audit Trail for compliance.'
        }
      ],
      businessRules: [
        'Copilot recommendations are advisory; human authorization is required before applying changes.',
        'Never overrides locked legal contracts without Commercial Director approval.'
      ],
      milestoneOutput: 'Autonomous intelligent risk mitigation and cost optimization applied to project.'
    },
    {
      id: 'M25',
      code: 'M25',
      tabKey: 'documents',
      stageNumber: 8,
      stageName: 'Stage 8 • Intelligence & Admin',
      moduleName: 'Documents & Transmittals Cloud Store',
      icon: FolderArchive,
      primaryRoles: ['DOCUMENT_CONTROLLER', 'ALL_ROLES'],
      objective: 'Maintain a secure, centralized cloud document archive with automated revision numbering, transmittal logs, and role-based viewing permissions.',
      prerequisites: [
        'Project documents (Contracts, GFC drawings, municipal approvals, vendor warranties).'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Browse Structured Folder Hierarchy',
          action: 'Navigate standard directory folders: Contracts & Legal, GFC Drawings, Structural Certificates, Invoices & Tax Receipts, Handover Packs.',
          uiElements: ['Folder Tree Navigation', 'File Search Bar', 'File Type Badges (PDF, DWG, XLSX, JPG)'],
          expectedResult: 'Clean, organized project archive preventing lost files or version confusion.',
          tips: 'Store all municipal clearance letters under the "Compliance & Permits" folder.'
        },
        {
          stepNumber: 2,
          title: 'Upload Document & Create Transmittal',
          action: 'Click "Upload Document", assign metadata tags, and generate an outward transmittal note.',
          uiElements: ['File Drag-and-Drop Area', 'Category Tag', 'Revision ID', 'Recipient Stakeholders', 'Generate Transmittal Form'],
          expectedResult: 'Recipients receive formal transmittal record with download link and timestamp.',
          tips: 'Transmittals establish legal proof of when drawings were issued to contractors.'
        }
      ],
      businessRules: [
        'All uploaded files are virus-scanned and immutably stamped with uploader ID.',
        'Superseded documents are archived but never permanently deleted.'
      ],
      milestoneOutput: 'Centralized, audit-compliant digital document archive with formal transmittal records.'
    },
    {
      id: 'USR',
      code: 'USR',
      tabKey: 'users',
      stageNumber: 8,
      stageName: 'Stage 8 • Intelligence & Admin',
      moduleName: 'User Administration & RBAC Security',
      icon: ShieldCheck,
      primaryRoles: ['ADMIN'],
      objective: 'Provision team user accounts, set encrypted passwords, assign role responsibilities, manage project-specific permissions, and monitor active sessions.',
      prerequisites: [
        'Administrator credentials and new employee onboarding details.'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Add New System User',
          action: 'Click "+ Add User Account" on the User Master Setup view.',
          uiElements: ['Full Name', 'Work Email', 'Username', 'Initial Password', 'Role Dropdown (Admin, Architect, Estimator, PM, Site Engineer, Client)'],
          expectedResult: 'User account created with specified role permissions.',
          tips: 'Choose strong alphanumeric passwords with at least 8 characters.'
        },
        {
          stepNumber: 2,
          title: 'Assign Project Access Restrictions',
          action: 'Under "Assigned Projects", select the specific project codes the user can access.',
          uiElements: ['All Projects (Global Access)', 'Specific Project Multi-Select (e.g. PROJ-SKYLINE-1402, PROJ-VILLA-90)'],
          expectedResult: 'User will only see and access authorized Job Cards upon logging in.',
          tips: 'Site Engineers should be restricted to their assigned job sites to ensure data privacy.'
        },
        {
          stepNumber: 3,
          title: 'Manage Security & Password Resets',
          action: 'Reset passwords, deactivate departed staff, or inspect active login sessions.',
          uiElements: ['Reset Password Action', 'Deactivate User Toggle', 'Last Login Timestamp', 'Session Audit Link'],
          expectedResult: 'Maintains enterprise-level security compliance across the organization.',
          tips: 'Deactivating an account retains all historical audit logs and signature records.'
        }
      ],
      businessRules: [
        'Only users with ADMIN role can create, modify, or delete user accounts.',
        'All password resets and permission changes are recorded in the System Audit Log.'
      ],
      milestoneOutput: 'Secure, configured user directory enforcing strict role-based access control.'
    }
  ], []);

  // Filtered modules based on search, stage, and role
  const filteredModules = useMemo(() => {
    return trainingCurriculum.filter(m => {
      // Stage filter
      if (selectedStage !== 'ALL' && m.stageNumber !== selectedStage) {
        return false;
      }
      // Role filter
      if (selectedRole !== 'ALL' && !m.primaryRoles.includes(selectedRole) && !m.primaryRoles.includes('ALL_ROLES')) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.moduleName.toLowerCase().includes(q);
        const matchesCode = m.code.toLowerCase().includes(q);
        const matchesDesc = m.objective.toLowerCase().includes(q);
        const matchesSteps = m.steps.some(s => 
          s.title.toLowerCase().includes(q) || 
          s.action.toLowerCase().includes(q) ||
          s.uiElements.some(ui => ui.toLowerCase().includes(q))
        );
        const matchesRules = m.businessRules.some(r => r.toLowerCase().includes(q));
        return matchesName || matchesCode || matchesDesc || matchesSteps || matchesRules;
      }
      return true;
    });
  }, [trainingCurriculum, selectedStage, selectedRole, searchQuery]);

  // Active selected module
  const activeModule = useMemo(() => {
    return trainingCurriculum.find(m => m.id === activeModuleId) || filteredModules[0] || trainingCurriculum[0];
  }, [trainingCurriculum, activeModuleId, filteredModules]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="training-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#002050] via-[#0F6CBD] to-[#002050] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <GraduationCap className="h-6 w-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-sky-200 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-400/30">
                  Customer Training & Operations Manual
                </span>
                <span className="text-[10px] text-slate-300 hidden sm:inline">• Version 2.6 Enterprise</span>
              </div>
              <h2 id="training-modal-title" className="text-lg sm:text-xl font-bold tracking-tight font-['Cinzel',serif] flex items-center gap-2">
                Build Storys ERP Training Curriculum
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition border border-white/20 cursor-pointer"
              title="Print or Save Training Manual as PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              aria-label="Close training modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4 flex flex-col md:flex-row gap-3 items-center justify-between shrink-0">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search module, step, rule, or UI element..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F6CBD] focus:border-[#0F6CBD]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Lifecycle Stage Filter & Role Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Stage Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium hidden lg:inline">Stage:</span>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-[#0F6CBD]"
              >
                <option value="ALL">All 7 Lifecycle Stages</option>
                <option value="1">Stage 1 • Enquiry & CRM</option>
                <option value="2">Stage 2 • Survey & Design</option>
                <option value="3">Stage 3 • Estimation & BOQ</option>
                <option value="4">Stage 4 • Commercial & Contracts</option>
                <option value="5">Stage 5 • Site Ops & Execution</option>
                <option value="6">Stage 6 • Billing & Finance</option>
                <option value="7">Stage 7 • Handover & Reports</option>
                <option value="8">Stage 8 • Intelligence & Admin</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium hidden lg:inline">My Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-[#0F6CBD]"
              >
                <option value="ALL">All Roles View</option>
                <option value="ARCHITECT">Architect / Designer</option>
                <option value="ESTIMATOR">Quantity Surveyor / Estimator</option>
                <option value="PROJECT_MANAGER">Project / Commercial Manager</option>
                <option value="SITE_ENGINEER">Site Engineer / Supervisor</option>
                <option value="FINANCE">Finance / Accountant</option>
                <option value="CLIENT">Client / Property Owner</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            <div className="text-[11px] text-slate-500 font-medium ml-auto">
              Showing <span className="font-bold text-slate-800">{filteredModules.length}</span> Modules
            </div>
          </div>
        </div>

        {/* WORKSPACE: 2-COLUMN SPLIT (MODULE LIST ON LEFT, DETAILED STEP-BY-STEP ON RIGHT) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* LEFT COLUMN: MODULE NAVIGATION ROSTER */}
          <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto bg-slate-50/50 p-2 sm:p-3 shrink-0 flex flex-col gap-1.5">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Sequential Module Sequence</span>
              <span className="text-[10px] text-slate-400">Enquiry → Handover</span>
            </div>

            {filteredModules.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No training modules found matching your search criteria.
              </div>
            ) : (
              filteredModules.map((mod) => {
                const isSelected = activeModule.id === mod.id;
                const IconComponent = mod.icon;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModuleId(mod.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#0F6CBD] shadow-md ring-1 ring-[#0F6CBD]/20'
                        : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isSelected ? 'bg-[#0F6CBD] text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <IconComponent className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-mono font-bold text-[#0F6CBD] bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                          {mod.code}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 truncate">
                          {mod.stageName.split('•')[0]}
                        </span>
                      </div>
                      <h4 className={`text-xs font-semibold truncate ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                        {mod.moduleName}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {mod.objective}
                      </p>
                    </div>

                    <ChevronRight className={`h-4 w-4 shrink-0 mt-2 transition-transform ${
                      isSelected ? 'text-[#0F6CBD] translate-x-0.5' : 'text-slate-400'
                    }`} />
                  </button>
                );
              })
            )}
          </div>

          {/* RIGHT COLUMN: MODULE DETAILED TRAINING GUIDE & STEP-BY-STEP INSTRUCTIONS */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white">
            {activeModule ? (
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Module Banner Card */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F6CBD]/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-700">
                          MODULE {activeModule.code}
                        </span>
                        <span className="text-xs font-medium text-slate-300">
                          {activeModule.stageName}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Cinzel',serif]">
                        {activeModule.moduleName}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
                        {activeModule.objective}
                      </p>
                    </div>

                    {/* Direct Launch Button */}
                    <div className="shrink-0">
                      <button
                        onClick={() => {
                          onNavigateToTab(activeModule.tabKey);
                          onClose();
                        }}
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F6CBD] hover:bg-[#0c5999] text-white text-xs font-bold shadow-lg hover:shadow-sky-500/25 transition cursor-pointer"
                      >
                        <span>Open Module in ERP</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Primary Target Roles */}
                  <div className="mt-4 pt-4 border-t border-slate-700/80 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400 font-medium">Primary Roles:</span>
                    {activeModule.primaryRoles.map((role) => (
                      <span 
                        key={role}
                        className="px-2 py-0.5 rounded bg-slate-800 border border-slate-600 text-slate-200 text-[11px] font-mono"
                      >
                        {role.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prerequisites Box */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-2">
                    <Info className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Prerequisites & Required Inputs Prior to Starting This Step</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-amber-800 list-disc list-inside">
                    {activeModule.prerequisites.map((req, idx) => (
                      <li key={idx} className="leading-relaxed">{req}</li>
                    ))}
                  </ul>
                </div>

                {/* STEP-BY-STEP OPERATIONAL TRAINING GUIDE */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-[#0F6CBD]" />
                      <span>Step-by-Step Training Procedures</span>
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      {activeModule.steps.length} Steps in Procedure
                    </span>
                  </div>

                  <div className="space-y-4">
                    {activeModule.steps.map((step) => (
                      <div 
                        key={step.stepNumber}
                        className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Step Badge */}
                          <div className="h-7 w-7 rounded-full bg-[#0F6CBD] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                            {step.stepNumber}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-bold text-slate-900 mb-1">
                              {step.title}
                            </h5>

                            {/* Action Instruction */}
                            <div className="text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 mb-3 leading-relaxed">
                              <span className="font-bold text-slate-900">Action: </span>
                              {step.action}
                            </div>

                            {/* UI Elements Checklist */}
                            <div className="mb-3">
                              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                UI Fields & Controls to Interact With:
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {step.uiElements.map((elem, i) => (
                                  <span 
                                    key={i}
                                    className="px-2 py-0.5 rounded bg-sky-50 border border-sky-100 text-sky-800 text-[11px] font-medium"
                                  >
                                    {elem}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Expected Result */}
                            <div className="flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50/70 border border-emerald-200/80 p-2.5 rounded-lg">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-emerald-950">Expected Milestone Outcome: </span>
                                {step.expectedResult}
                              </div>
                            </div>

                            {/* Pro-Tip */}
                            {step.tips && (
                              <div className="mt-2 text-[11px] text-slate-500 italic flex items-center gap-1.5">
                                <span className="font-semibold text-slate-700 not-italic">Pro-Tip:</span>
                                <span>{step.tips}</span>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Rules & Validation Guardrails */}
                <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-sky-400" />
                    <span>System Business Rules & Compliance Guardrails</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {activeModule.businessRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-sky-400 font-bold">•</span>
                        <span className="leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Milestone Output Verification */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-600 text-white rounded-lg">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Formal Stage Deliverable
                      </div>
                      <div className="text-xs font-bold text-emerald-950 mt-0.5">
                        {activeModule.milestoneOutput}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onNavigateToTab(activeModule.tabKey);
                      onClose();
                    }}
                    type="button"
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Execute Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            ) : null}
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Need Live Guidance?</span>
            <span>Use Tell Me Search (<kbd className="font-mono bg-white px-1.5 py-0.5 border border-slate-300 rounded text-[10px]">Alt+Q</kbd>) or Data Inspector (<kbd className="font-mono bg-white px-1.5 py-0.5 border border-slate-300 rounded text-[10px]">Ctrl+Alt+F1</kbd>).</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">Documentation File: /docs/CUSTOMER_TRAINING_MANUAL.md</span>
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition cursor-pointer"
            >
              Close Manual
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
