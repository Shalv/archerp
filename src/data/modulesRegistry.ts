import { 
  ERPModuleMeta, 
  CRMLead, 
  DesignDrawingItem, 
  MaterialSelectionItem, 
  DailyProgressReport, 
  VariationOrder, 
  PurchaseOrderRecord, 
  SubcontractWorkOrder, 
  SnagItem, 
  WarrantyRecord 
} from '../types/erp';

export const ERP_MODULES_REGISTRY: ERPModuleMeta[] = [
  // Stage 1: Enquiry & Sales
  {
    id: 1,
    code: 'M01',
    name: 'CRM & Lead Funnel',
    stage: 'ENQUIRY_SALES',
    stageLabel: '1. Enquiry & Sales',
    priority: 'Essential',
    keyFunctionality: 'Lead intake, channel source attribution, initial discovery brief, budget bracket, and conversion tracking.',
    tabKey: 'crm',
    iconName: 'Users'
  },
  {
    id: 2,
    code: 'M02',
    name: 'Customer & Contacts Directory',
    stage: 'ENQUIRY_SALES',
    stageLabel: '1. Enquiry & Sales',
    priority: 'Essential',
    keyFunctionality: 'Central customer contact register, GSTIN, primary stakeholders, site address, and communication log.',
    tabKey: 'contacts',
    iconName: 'BookUser'
  },
  // Stage 2: Survey & Design
  {
    id: 3,
    code: 'M03',
    name: 'Site Survey & Laser Scan Hub',
    stage: 'SURVEY_DESIGN',
    stageLabel: '2. Survey & Design',
    priority: 'Essential for execution',
    keyFunctionality: 'On-site dimensions, civil conditions check, existing MEP constraints, and photographic survey logs.',
    tabKey: 'survey',
    iconName: 'Compass'
  },
  {
    id: 4,
    code: 'M04',
    name: 'Architectural & Interior Drawings',
    stage: 'SURVEY_DESIGN',
    stageLabel: '2. Survey & Design',
    priority: 'Essential',
    keyFunctionality: 'CAD drawings, Rev A/B/C revision control, GFC issuance, and multi-disciplinary drawing registers.',
    tabKey: 'drawings',
    iconName: 'Layers'
  },
  {
    id: 5,
    code: 'M05',
    name: 'Material & Sample Approvals',
    stage: 'SURVEY_DESIGN',
    stageLabel: '2. Survey & Design',
    priority: 'Essential for turnkey',
    keyFunctionality: 'Physical swatch submissions, veneer & tile selections, client sign-off records, and budget impact tracker.',
    tabKey: 'materials',
    iconName: 'Palette'
  },
  // Stage 3: Estimation & BOQ
  {
    id: 6,
    code: 'M06',
    name: 'Master Schedule of Rates',
    stage: 'ESTIMATION_BOQ',
    stageLabel: '3. Estimation & BOQ',
    priority: 'Essential',
    keyFunctionality: 'Company approved item rates (Material, Labour, Equipment, Subcontract) with historical cost analysis.',
    tabKey: 'masters',
    iconName: 'Database'
  },
  {
    id: 7,
    code: 'M07',
    name: 'BOQ Estimating Engine',
    stage: 'ESTIMATION_BOQ',
    stageLabel: '3. Estimation & BOQ',
    priority: 'Essential',
    keyFunctionality: 'Line-by-line itemized estimation, trade subtotals, quantity takeoffs, revisions baseline, and approval lock.',
    tabKey: 'boq',
    iconName: 'FileSpreadsheet'
  },
  {
    id: 8,
    code: 'M08',
    name: 'Cost Budget & Margin Analysis',
    stage: 'ESTIMATION_BOQ',
    stageLabel: '3. Estimation & BOQ',
    priority: 'Essential',
    keyFunctionality: 'Cost-to-complete forecast, direct cost breakdown, contingency risk reserve, and gross margin guardrails.',
    tabKey: 'budget',
    iconName: 'Calculator'
  },
  {
    id: 9,
    code: 'M09',
    name: 'End-to-End Cost Traceability',
    stage: 'ESTIMATION_BOQ',
    stageLabel: '3. Estimation & BOQ',
    priority: 'Essential',
    keyFunctionality: 'Traceability from BOQ baseline to PO commitment, GRN consumption, certified bills, and real-time margin.',
    tabKey: 'traceability',
    iconName: 'Network'
  },
  // Stage 4: Commercial & Contracts
  {
    id: 10,
    code: 'M10',
    name: 'Customer Quotation & VE Studio',
    stage: 'COMMERCIAL_CONTRACTS',
    stageLabel: '4. Commercial & Contracts',
    priority: 'Essential',
    keyFunctionality: 'Client-facing quotations, alternative spec tier packages, and value-engineering savings builder.',
    tabKey: 'quotation',
    iconName: 'FileText'
  },
  {
    id: 11,
    code: 'M11',
    name: 'Commercial Contracts & Terms',
    stage: 'COMMERCIAL_CONTRACTS',
    stageLabel: '4. Commercial & Contracts',
    priority: 'Essential',
    keyFunctionality: 'Milestone payment schedules, mobilization advance conditions, retention percentage, and penalty clauses.',
    tabKey: 'contracts',
    iconName: 'FileSignature'
  },
  {
    id: 12,
    code: 'M12',
    name: 'Variation Orders & Scope Changes',
    stage: 'COMMERCIAL_CONTRACTS',
    stageLabel: '4. Commercial & Contracts',
    priority: 'Essential for turnkey',
    keyFunctionality: 'Formal change requests (VO-01, VO-02), client approval signatures, and commercial price amendment logs.',
    tabKey: 'variations',
    iconName: 'GitPullRequest'
  },
  // Stage 5: Execution & Site Ops
  {
    id: 13,
    code: 'M13',
    name: 'Site Execution & Master WBS',
    stage: 'EXECUTION_OPS',
    stageLabel: '5. Execution & Site Ops',
    priority: 'Essential for execution',
    keyFunctionality: 'Gantt schedule, work breakdown milestones, dependency path, and weekly progress tracking.',
    tabKey: 'schedule',
    iconName: 'Calendar'
  },
  {
    id: 14,
    code: 'M14',
    name: 'Daily Progress Reports (DPR)',
    stage: 'EXECUTION_OPS',
    stageLabel: '5. Execution & Site Ops',
    priority: 'Essential for execution',
    keyFunctionality: 'Daily site attendance, headcounts (carpenters, masons, MEP), photos, delays, and supervisor sign-offs.',
    tabKey: 'site_execution',
    iconName: 'ClipboardCheck'
  },
  {
    id: 15,
    code: 'M15',
    name: 'Procurement & Purchase Orders (PO)',
    stage: 'EXECUTION_OPS',
    stageLabel: '5. Execution & Site Ops',
    priority: 'Essential',
    keyFunctionality: 'PO generation against budget lines, vendor quotes, delivery lead times, and commercial terms.',
    tabKey: 'procurement',
    iconName: 'ShoppingBag'
  },
  {
    id: 16,
    code: 'M16',
    name: 'Material Inward & GRN Inventory',
    stage: 'EXECUTION_OPS',
    stageLabel: '5. Execution & Site Ops',
    priority: 'Essential for turnkey',
    keyFunctionality: 'Goods Receipt Notes (GRN), quality inspection, site storage allocations, and scrap/wastage tracking.',
    tabKey: 'inventory',
    iconName: 'PackageCheck'
  },
  {
    id: 17,
    code: 'M17',
    name: 'Subcontractor Joint Measurements',
    stage: 'EXECUTION_OPS',
    stageLabel: '5. Execution & Site Ops',
    priority: 'Essential for execution',
    keyFunctionality: 'Work order commitments, labour rate agreements, joint measurement certification, and retention holdbacks.',
    tabKey: 'contractors',
    iconName: 'HardHat'
  },
  {
    id: 18,
    code: 'M18',
    name: 'Quality Audits & Snag List Register',
    stage: 'EXECUTION_OPS',
    stageLabel: '5. Execution & Site Ops',
    priority: 'Essential for turnkey',
    keyFunctionality: 'Room-by-room snag detection, photo evidence, severity classification, contractor assignment, and sign-off.',
    tabKey: 'snags',
    iconName: 'AlertCircle'
  },
  // Stage 6: Billing & Finance
  {
    id: 19,
    code: 'M19',
    name: 'Customer Billing & RA Invoices',
    stage: 'BILLING_FINANCE',
    stageLabel: '6. Billing & Finance',
    priority: 'Essential',
    keyFunctionality: 'Running Account (RA) bills against milestone completions, GST tax compliance, TDS deductions, and payment receipts.',
    tabKey: 'billing',
    iconName: 'Receipt'
  },
  {
    id: 20,
    code: 'M20',
    name: 'Financial Ledger & Cash Flow',
    stage: 'BILLING_FINANCE',
    stageLabel: '6. Billing & Finance',
    priority: 'Essential',
    keyFunctionality: 'Project cash-in vs cash-out ledger, vendor debits/credits, banking reconciliation, and margin realization.',
    tabKey: 'finance',
    iconName: 'TrendingUp'
  },
  // Stage 7: Handover & Warranty
  {
    id: 21,
    code: 'M21',
    name: 'Project Handover & Keys Package',
    stage: 'HANDOVER_WARRANTY',
    stageLabel: '7. Handover & Warranty',
    priority: 'Essential for turnkey',
    keyFunctionality: 'Formal completion certification, joint inspection sign-off, operation manuals, and customer keys release.',
    tabKey: 'handover',
    iconName: 'Key'
  },
  {
    id: 22,
    code: 'M22',
    name: 'Warranty Registry & Post-Handover',
    stage: 'HANDOVER_WARRANTY',
    stageLabel: '7. Handover & Warranty',
    priority: 'Essential for turnkey',
    keyFunctionality: 'OEM warranties (plywood, laminates, hardware, fixtures), defect liability tracking, and ticket resolution.',
    tabKey: 'warranty',
    iconName: 'ShieldCheck'
  },
  {
    id: 23,
    code: 'M23',
    name: 'Client Feedback & Satisfaction Portal',
    stage: 'HANDOVER_WARRANTY',
    stageLabel: '7. Handover & Warranty',
    priority: 'Highly recommended',
    keyFunctionality: 'Net Promoter Score (NPS), client testimonial capture, referral logging, and project portfolio sign-off.',
    tabKey: 'portal',
    iconName: 'Smile'
  },
  // Governance & Intelligence Modules
  {
    id: 24,
    code: 'M24',
    name: 'Compliance, Licenses & Statutory Approvals',
    stage: 'SURVEY_DESIGN',
    stageLabel: 'Governance & Compliance',
    priority: 'Essential for execution',
    keyFunctionality: 'Fire NOC, municipal interior fit-out permissions, society approvals, and safety compliances.',
    tabKey: 'compliance',
    iconName: 'CheckSquare'
  },
  {
    id: 25,
    code: 'M25',
    name: 'Documents & Transmittals Cloud Store',
    stage: 'COMMERCIAL_CONTRACTS',
    stageLabel: 'Enterprise Governance',
    priority: 'Essential',
    keyFunctionality: 'Secure project transmittal register, signed documents, PDF drawings repository, and versioned assets.',
    tabKey: 'documents',
    iconName: 'FolderArchive'
  },
  {
    id: 26,
    code: 'M26',
    name: 'Reports & Executive Analytics Hub',
    stage: 'BILLING_FINANCE',
    stageLabel: 'Executive Control',
    priority: 'Essential',
    keyFunctionality: 'Mandatory reports hub, financial performance metrics, audit trails, and multi-project portfolio exports.',
    tabKey: 'reports',
    iconName: 'BarChart3'
  }
];

export const DEMO_CRM_LEADS: CRMLead[] = [
  {
    id: 'LEAD-01',
    leadCode: 'LEAD-2026-081',
    clientName: 'Vikram & Priya Malhotra',
    phone: '+91 98200 11223',
    email: 'vikram.m@malhotragroup.in',
    projectType: 'RESIDENTIAL',
    budgetBracket: '₹1.0 - ₹1.5 Cr (High-End Luxury)',
    source: 'ARCHITECT_REFERRAL',
    stage: 'WON',
    assignedSalesLead: 'Aarav Singhania',
    followUpDate: '2026-03-01',
    notes: 'Premium 3BHK high-rise apartment (3,400 sq.ft) in Skyline Heights, Worli. Turnkey interior fit-out.'
  },
  {
    id: 'LEAD-02',
    leadCode: 'LEAD-2026-094',
    clientName: 'Dr. Anand Kulkarni',
    phone: '+91 98210 44556',
    email: 'anand.k@healthmed.org',
    projectType: 'RESIDENTIAL',
    budgetBracket: '₹2.5 Cr+ (Ultra-Luxury Bespoke)',
    source: 'WEBSITE',
    stage: 'PROPOSAL_SUBMITTED',
    assignedSalesLead: 'Aarav Singhania',
    followUpDate: '2026-09-18',
    notes: 'Duplex Penthouse 5,200 sq.ft at Bandra West. Modern biophilic aesthetic with Italian marble.'
  },
  {
    id: 'LEAD-03',
    leadCode: 'LEAD-2026-102',
    clientName: 'Nexus Tech Innovations',
    phone: '+91 98330 77889',
    email: 'facilities@nexustech.io',
    projectType: 'COMMERCIAL',
    budgetBracket: '₹80 Lakhs - ₹1.2 Cr',
    source: 'DIRECT_WALK_IN',
    stage: 'BRIEF_TAKEN',
    assignedSalesLead: 'Rajesh Sharma',
    followUpDate: '2026-09-22',
    notes: 'Commercial office floor (8,500 sq.ft) at BKC. Modular workstations, acoustic meeting pods.'
  }
];

export const DEMO_DRAWINGS: DesignDrawingItem[] = [
  {
    id: 'DWG-01',
    drawingCode: 'DWG-1402-A-101',
    title: 'Architectural Partition & Demolition Layout',
    discipline: 'ARCHITECTURAL',
    revision: 'Rev B',
    status: 'GFC_ISSUED',
    releaseDate: '2026-02-14',
    designerName: 'Ananya Roy',
    reviewedBy: 'Aarav Singhania',
    fileSizeMb: 14.2,
    customerApprovedDate: '2026-02-16'
  },
  {
    id: 'DWG-02',
    drawingCode: 'DWG-1402-I-201',
    title: 'Living & Dining Premium Flooring Pattern',
    discipline: 'INTERIOR_LAYOUT',
    revision: 'Rev A',
    status: 'GFC_ISSUED',
    releaseDate: '2026-02-18',
    designerName: 'Ananya Roy',
    reviewedBy: 'Rajesh Sharma',
    fileSizeMb: 18.5,
    customerApprovedDate: '2026-02-20'
  },
  {
    id: 'DWG-03',
    drawingCode: 'DWG-1402-E-301',
    title: 'MEP Electrical Conduit & Automation Routing',
    discipline: 'ELECTRICAL_MEP',
    revision: 'Rev C',
    status: 'GFC_ISSUED',
    releaseDate: '2026-02-22',
    designerName: 'Sanjay Deshmukh',
    reviewedBy: 'Kavita Nair',
    fileSizeMb: 9.8,
    customerApprovedDate: '2026-02-24'
  },
  {
    id: 'DWG-04',
    drawingCode: 'DWG-1402-M-401',
    title: 'Master Bedroom Wardrobe & Vanity Millwork',
    discipline: 'JOINERY_MILLWORK',
    revision: 'Rev B',
    status: 'GFC_ISSUED',
    releaseDate: '2026-02-25',
    designerName: 'Ananya Roy',
    reviewedBy: 'Rajesh Sharma',
    fileSizeMb: 22.1,
    customerApprovedDate: '2026-02-28'
  }
];

export const DEMO_MATERIAL_SELECTIONS: MaterialSelectionItem[] = [
  {
    id: 'MAT-01',
    itemCode: 'FLR-01',
    roomZone: 'Living & Dining Area',
    category: 'FLOORING',
    productName: 'Italian Statuario Marble Slabs',
    brand: 'Classic Marble Company',
    codeOrFinish: 'Polished Bookmatched Book-A',
    sampleStatus: 'APPROVED_BY_CLIENT',
    approvedByCustomer: true,
    approvalDate: '2026-02-15',
    costImpactComparedToBudget: 0
  },
  {
    id: 'MAT-02',
    itemCode: 'CAR-01',
    roomZone: 'Master Bedroom & Living',
    category: 'VENEER_LAMINATE',
    productName: 'Natural Smoked Oak Architectural Veneer',
    brand: 'Turakhia Natural Veneers',
    codeOrFinish: 'Smoked Crown Cut Grain',
    sampleStatus: 'APPROVED_BY_CLIENT',
    approvedByCustomer: true,
    approvalDate: '2026-02-18',
    costImpactComparedToBudget: 0
  },
  {
    id: 'MAT-03',
    itemCode: 'PNT-01',
    roomZone: 'Entire Residence',
    category: 'PAINT_FINISH',
    productName: 'Royale Luxury Matt Emulsion with Teflon',
    brand: 'Asian Paints',
    codeOrFinish: 'Shade: L102 Soft Whisper',
    sampleStatus: 'APPROVED_BY_CLIENT',
    approvedByCustomer: true,
    approvalDate: '2026-02-20',
    costImpactComparedToBudget: 0
  },
  {
    id: 'MAT-04',
    itemCode: 'HRD-01',
    roomZone: 'Joinery & Millwork',
    category: 'HARDWARE',
    productName: 'Soft-Close Concealed Hinges & Undermount Runners',
    brand: 'Blum / Hafele',
    codeOrFinish: 'Tandembox Antaro Silk White',
    sampleStatus: 'APPROVED_BY_CLIENT',
    approvedByCustomer: true,
    approvalDate: '2026-02-22',
    costImpactComparedToBudget: 0
  }
];

export const DEMO_DPR_LOGS: DailyProgressReport[] = [
  {
    id: 'DPR-01',
    dprCode: 'DPR-2026-042',
    date: '2026-09-10',
    weatherCondition: 'Clear 30°C',
    labourCountOnSite: {
      masons: 3,
      carpenters: 6,
      electricians: 2,
      plumbers: 2,
      helpers: 4
    },
    activitiesExecuted: [
      'Living room false ceiling framing completed (95%).',
      'Master bedroom wardrobe carcass alignment and leveling.',
      'Electrical conduit testing in kitchen & dining area.'
    ],
    plannedTomorrow: [
      'Commence Gyproc perimeter board installation in living room.',
      'Plumbing pressure test on concealed diverters.'
    ],
    issuesDelays: [
      'Elevator maintenance from 2:00 PM to 3:30 PM slightly delayed material movement.'
    ],
    sitePhotographs: [
      { caption: 'Living room ceiling grid inspection', stage: 'Civil & Ceiling', time: '11:30 AM' },
      { caption: 'Master wardrobe joinery detail verification', stage: 'Carpentry', time: '03:45 PM' }
    ],
    pettyExpensesToday: 1850,
    siteEngineer: 'Ramesh Verma'
  }
];

export const DEMO_VARIATION_ORDERS: VariationOrder[] = [
  {
    id: 'VO-01',
    voNumber: 'VO-2026-001',
    title: 'Acoustic Sound Insulation & Double Glazing for Study Room',
    requestedBy: 'CLIENT',
    description: 'Client requested upgraded high-density rockwool acoustic padding and acoustic timber door for home office.',
    costImpact: 42000,
    sellingImpact: 56000,
    timeImpactDays: 3,
    status: 'APPROVED_BY_CLIENT',
    approvedDate: '2026-03-05'
  },
  {
    id: 'VO-02',
    voNumber: 'VO-2026-002',
    title: 'Concealed LED Profile Strip Lighting in Kitchen Island Base',
    requestedBy: 'CLIENT',
    description: 'Added 4000K warm white accent illumination underneath waterfall edge stone island.',
    costImpact: 14500,
    sellingImpact: 19800,
    timeImpactDays: 1,
    status: 'APPROVED_BY_CLIENT',
    approvedDate: '2026-03-12'
  }
];

export const DEMO_PURCHASE_ORDERS: PurchaseOrderRecord[] = [
  {
    id: 'PO-01',
    poNumber: 'PO-2026-018',
    vendorId: 'VND-001',
    vendorName: 'Apex Timber & Plywood Corporation',
    trade: 'CARPENTRY_JOINERY',
    itemsCount: 4,
    totalAmount: 345000,
    issueDate: '2026-02-25',
    deliveryDateExpected: '2026-03-02',
    status: 'DELIVERED_CLOSED',
    paymentTerms: '30% Advance, 70% against site delivery inspection'
  },
  {
    id: 'PO-02',
    poNumber: 'PO-2026-022',
    vendorId: 'VND-002',
    vendorName: 'Classic Marble & Stone Imports',
    trade: 'FLOORING_TILING',
    itemsCount: 2,
    totalAmount: 680000,
    issueDate: '2026-02-28',
    deliveryDateExpected: '2026-03-08',
    status: 'DELIVERED_CLOSED',
    paymentTerms: '100% against slab selection confirmation'
  },
  {
    id: 'PO-03',
    poNumber: 'PO-2026-031',
    vendorId: 'VND-003',
    vendorName: 'Lumiere Lighting Solutions',
    trade: 'ELECTRICAL_AUTOMATION',
    itemsCount: 18,
    totalAmount: 215000,
    issueDate: '2026-03-10',
    deliveryDateExpected: '2026-03-22',
    status: 'PARTIALLY_DELIVERED',
    paymentTerms: '50% with order, balance on dispatch'
  }
];

export const DEMO_SUBCONTRACT_ORDERS: SubcontractWorkOrder[] = [
  {
    id: 'SCWO-01',
    woNumber: 'SCWO-2026-01',
    contractorName: 'Vishwakarma Carpentry & Interior Works',
    trade: 'CARPENTRY_JOINERY',
    agreedLabourRatePerUnit: '₹480 / sq.ft surface area',
    contractValue: 450000,
    certifiedWorkDoneValue: 310000,
    retentionWithheld: 15500,
    amountPaid: 294500,
    status: 'ACTIVE_EXECUTION'
  },
  {
    id: 'SCWO-02',
    woNumber: 'SCWO-2026-02',
    contractorName: 'Rajasthan Marble Laying & Diamond Polishing Co.',
    trade: 'FLOORING_TILING',
    agreedLabourRatePerUnit: '₹140 / sq.ft laying + ₹95 / sq.ft mirror polish',
    contractValue: 285000,
    certifiedWorkDoneValue: 285000,
    retentionWithheld: 14250,
    amountPaid: 270750,
    status: 'FINAL_BILL_CERTIFIED'
  }
];

export const DEMO_SNAG_ITEMS: SnagItem[] = [
  {
    id: 'SNG-01',
    snagCode: 'SNG-LIV-01',
    roomZone: 'Living Room',
    trade: 'PAINTING_POLISHING',
    description: 'Minor roller texture inconsistency on south elevation accent wall under raking light.',
    severity: 'MINOR',
    assignedContractor: 'Shree Sai Finishing Contractors',
    targetClosureDate: '2026-09-14',
    status: 'RECTIFICATION_IN_PROGRESS'
  },
  {
    id: 'SNG-02',
    snagCode: 'SNG-MBR-02',
    roomZone: 'Master Bedroom',
    trade: 'CARPENTRY_JOINERY',
    description: 'Left wardrobe door soft-close damper tension requires re-adjustment.',
    severity: 'MINOR',
    assignedContractor: 'Vishwakarma Carpentry & Interior Works',
    targetClosureDate: '2026-09-12',
    status: 'VERIFIED_CLOSED',
    closureDate: '2026-09-12'
  }
];

export const DEMO_WARRANTIES: WarrantyRecord[] = [
  {
    id: 'WAR-01',
    component: 'CenturyPly Club Prime Marine Plywood (BWP Grade)',
    oemBrand: 'Century Plyboards India Ltd.',
    coverageYears: 25,
    startDate: '2026-03-01',
    expiryDate: '2051-03-01',
    policyNumber: 'CPL-WAR-2026-98102',
    status: 'ACTIVE'
  },
  {
    id: 'WAR-02',
    component: 'Blum Tandembox Drawers & Aventos Lift Systems',
    oemBrand: 'Blum Austria / Hafele India',
    coverageYears: 10,
    startDate: '2026-03-15',
    expiryDate: '2036-03-15',
    policyNumber: 'BLUM-SYS-2026-4412',
    status: 'ACTIVE'
  },
  {
    id: 'WAR-03',
    component: 'Asian Paints Royale Luxury Interior Emulsion (Color Guard)',
    oemBrand: 'Asian Paints Limited',
    coverageYears: 5,
    startDate: '2026-04-01',
    expiryDate: '2031-04-01',
    policyNumber: 'AP-ROYALE-2026-19283',
    status: 'ACTIVE'
  }
];
