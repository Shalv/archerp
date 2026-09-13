import { ProjectCustomer, ConceptOption } from '../types';
import { getVisualAssetsForConcept, SAMPLE_CLIENT_INSPIRATIONS } from './architecturalAssets';

const SKYLINE_CONCEPTS: ConceptOption[] = [
  {
    id: 'c-opt-1',
    optionNumber: 1,
    title: 'Warm Minimalist Monolith',
    themeStyle: 'Contemporary Minimalist',
    architecturalNarrative: 'An exercise in architectural restraint. Honed travertine, brushed titanium fixtures, and seamless smoked oak millwork creating fluid, unencumbered sightlines across the 3,400 sq.ft floor plate.',
    spatialZoning: [
      { zone: 'Living & Dining Great Room', allocationSqFt: 850, flowDescription: 'Monolithic travertine floor seamlessly expanding toward panoramic balcony terrace.' },
      { zone: 'Master Bedroom Sanctum', allocationSqFt: 520, flowDescription: 'Double acoustically decoupled boundary with concealed walk-in dressing galleria.' },
      { zone: 'Executive Library / Study', allocationSqFt: 280, flowDescription: 'Full-height fluted acoustic millwork with integrated concealed video conferencing bar.' }
    ],
    materials: [
      { material: 'Roman Silver Travertine Slabs', category: 'Flooring', finish: 'Honed Matte', estimatedRatePerUnit: 850, unit: 'sq.ft', ecoRating: 'A+' },
      { material: 'Smoked Crown Oak Fluted Panelling', category: 'Wall Finishes', finish: 'Matte Lacquer', estimatedRatePerUnit: 420, unit: 'sq.ft', ecoRating: 'A' },
      { material: 'Natural Lime-Wash Mineral Plaster', category: 'Ceiling', finish: 'Textured Breathable', estimatedRatePerUnit: 95, unit: 'sq.ft', ecoRating: 'A+' }
    ],
    sustainabilityScore: 88,
    estimatedCostPerSqFt: 3450,
    totalEstimatedCost: 11730000,
    estimatedWeeks: 18,
    drawingSheetsApproved: true,
    drawingSheetsApprovalDate: '2026-02-15T11:00:00Z',
    drawingSheetsApprovedBy: 'Aarav Singhania (Lead Architect)',
    drawingSheetsApprovalNotes: 'Client verified and approved Rev-B drawing sets.',
    isSelectedConcept: true,
    renderTheme: {
      accentColor: '#4f46e5',
      secondaryColor: '#f8fafc',
      styleTag: 'Minimalist Monolith',
      schematicType: 'minimalist'
    },
    internalReview: {
      reviewedBy: 'Aarav Singhania',
      approvedForClient: true,
      leadNotes: 'Clean structural alignment with zero column intrusions in primary vista.',
      reviewDate: '2026-02-14'
    },
    clientReview: {
      isShared: true,
      clientApproved: true,
      clientComments: 'Loved the expansive feel of the living room and the calm material palette.',
      approvalDate: '2026-02-16'
    },
    visualAssets: getVisualAssetsForConcept(1, 'Contemporary Minimalist', 3400)
  },
  {
    id: 'c-opt-2',
    optionNumber: 2,
    title: 'Biophilic Urban Sanctuary',
    themeStyle: 'Biophilic Modernist',
    architecturalNarrative: 'Integrating botanical micro-climates, double-height interior green courts, and tactile terracotta textures to create a restorative breathing habitat high above the city.',
    spatialZoning: [
      { zone: 'Verdant Central Living Court', allocationSqFt: 880, flowDescription: 'Sub-floor recessed indoor planter troughs with circadian LED lighting.' },
      { zone: 'Terrace Dining Pavilion', allocationSqFt: 420, flowDescription: 'Thermally modified ash wood decking with motorized louvered pergola.' }
    ],
    materials: [
      { material: 'Reclaimed Teak Decking', category: 'Flooring', finish: 'Exterior Natural Oil', estimatedRatePerUnit: 650, unit: 'sq.ft', ecoRating: 'A+' },
      { material: 'Handmade Terracotta Brikettes', category: 'Wall Finishes', finish: 'Rustic Raw Kiln', estimatedRatePerUnit: 180, unit: 'sq.ft', ecoRating: 'A+' }
    ],
    sustainabilityScore: 94,
    estimatedCostPerSqFt: 3680,
    totalEstimatedCost: 12512000,
    estimatedWeeks: 20,
    isSelectedConcept: false,
    renderTheme: {
      accentColor: '#059669',
      secondaryColor: '#ecfdf5',
      styleTag: 'Biophilic Sanctuary',
      schematicType: 'biophilic'
    },
    internalReview: {
      reviewedBy: 'Aarav Singhania',
      approvedForClient: true,
      leadNotes: 'Requires sub-floor drainage detailing for planter boxes.',
      reviewDate: '2026-02-14'
    },
    clientReview: {
      isShared: true,
      clientApproved: false,
      clientComments: 'Stunning greenery concept; concern regarding plant maintenance during travel.',
      approvalDate: ''
    },
    visualAssets: getVisualAssetsForConcept(2, 'Biophilic Modernist', 3400)
  },
  {
    id: 'c-opt-3',
    optionNumber: 3,
    title: 'Industrial Luxe Atelier',
    themeStyle: 'Industrial Contemporary',
    architecturalNarrative: 'Celebrates raw materiality with blackened steel structural mullions, exposed micro-concrete surfaces, and warm antique brass joinery details.',
    spatialZoning: [
      { zone: 'Open Gallery Living & Lounge', allocationSqFt: 920, flowDescription: 'Seamless micro-concrete floor plate with ceiling acoustic baffles.' }
    ],
    materials: [
      { material: 'Micro-Concrete Seamless Overlay', category: 'Flooring', finish: 'Satin Polyurethane Seal', estimatedRatePerUnit: 320, unit: 'sq.ft', ecoRating: 'A' },
      { material: 'Blackened Patinated Mild Steel Framing', category: 'Joinery & Woodwork', finish: 'Gunmetal Wax Polish', estimatedRatePerUnit: 950, unit: 'sq.ft', ecoRating: 'A+' }
    ],
    sustainabilityScore: 82,
    estimatedCostPerSqFt: 3200,
    totalEstimatedCost: 10880000,
    estimatedWeeks: 16,
    isSelectedConcept: false,
    renderTheme: {
      accentColor: '#d97706',
      secondaryColor: '#fffbeb',
      styleTag: 'Industrial Luxe',
      schematicType: 'industrial'
    },
    internalReview: {
      reviewedBy: 'Aarav Singhania',
      approvedForClient: true,
      leadNotes: 'Acoustic treatment needed for hard micro-concrete reflective surfaces.',
      reviewDate: '2026-02-14'
    },
    clientReview: {
      isShared: true,
      clientApproved: false,
      clientComments: 'Bold and dramatic, but client prefers the warmer tone of Option 1.',
      approvalDate: ''
    },
    visualAssets: getVisualAssetsForConcept(3, 'Industrial Contemporary', 3400)
  }
];

export const INITIAL_SEED_PROJECTS: ProjectCustomer[] = [
  {
    id: 'PROJ-SKYLINE-1402',
    enquiryNumber: 'ENQ-2026-081',
    clientName: 'Vikram & Priya Malhotra',
    organizationOrFamily: 'Malhotra Family Residence',
    contactEmail: 'vikram.m@malhotragroup.in',
    contactPhone: '+91 98200 11223',
    siteAddress: 'Flat 1402, Tower B, Skyline Heights, Dr. Annie Besant Road, Worli',
    siteCity: 'Mumbai',
    siteAreaSqFt: 3800,
    builtUpAreaSqFt: 3400,
    engagementType: 'Complete design-and-build',
    budgetTier: 'High-End Luxury',
    targetBudget: 12000000,
    targetTimelineMonths: 5,
    confirmedRequirements: {
      projectVision: 'High-end turnkey residential transformation of a 3BHK high-rise apartment into a serene, minimalist family home with bespoke acoustic home office and panoramic entertaining deck.',
      roomZones: [
        'Living & Dining Great Room (850 sq.ft)',
        'Master Bedroom Suite & Dressing (520 sq.ft)',
        'Kids / Guest Bedrooms (640 sq.ft combined)',
        'Gourmet Kitchen & Wet Utility (280 sq.ft)',
        'Executive Study / Soundproof Library (240 sq.ft)'
      ],
      stylePreferences: ['Warm Minimalist', 'Italian Marble', 'Smoked Oak', 'Concealed Architecture'],
      specialConstraints: 'Strict society quiet-hours between 1:00 PM and 3:00 PM; all debris movement strictly via service elevator.',
      dateConfirmed: '2026-01-28'
    },
    customerReferences: SAMPLE_CLIENT_INSPIRATIONS,
    nextAction: {
      actionTitle: 'Review Subcontractor Joint Measurements for Living Room Flooring',
      assigneeName: 'Rajesh Sharma',
      assigneeRole: 'Lead Quantity Surveyor',
      dueDate: '2026-09-15',
      priority: 'Urgent',
      isCompleted: false
    },
    salesStage: 'Won / Contract Signed',
    designStatus: 'Detailed GFC Drawings',
    executionStatus: 'Finishes & Joinery',
    billingStatus: 'Milestone Invoiced',
    collectionStatus: 'Milestone Retentions',
    warrantyStatus: '12-Month Fitout Warranty Active',
    conceptOptions: SKYLINE_CONCEPTS,
    selectedConceptId: 'c-opt-1',
    conceptCarriedForwardDate: '2026-02-18',
    detailedDeliverables: [
      { id: 'del-1', code: 'DWG-GFC-01', title: 'Comprehensive Architectural CAD Drawing Pack (GFC)', category: 'Architectural', status: 'Approved / GFC Issued', assignedTo: 'Ananya Roy', revision: 'Rev B', dueDate: '2026-02-15' },
      { id: 'del-2', code: 'BOQ-BL-01', title: 'Line-by-Line Itemized Estimator BOQ Rev 1', category: 'Interior GFC', status: 'Approved / GFC Issued', assignedTo: 'Rajesh Sharma', revision: 'Rev 1', dueDate: '2026-02-20' },
      { id: 'del-3', code: 'COMM-QUO-01', title: 'Customer Turnkey Commercial Quotation & VE Pack', category: 'Interior GFC', status: 'Approved / GFC Issued', assignedTo: 'Aarav Singhania', revision: 'Rev 1', dueDate: '2026-02-25' }
    ],
    boqRevisions: [
      {
        revisionNumber: 0,
        revisionLabel: 'Rev 0 - Baseline Concept Draft',
        date: '2026-02-01',
        author: 'Aarav Singhania',
        reasonForChange: 'Initial AI Takeoff & Budget Draft',
        items: [],
        subtotal: 9800000,
        contingencyPercent: 5,
        contractorMarginPercent: 15,
        taxPercent: 18,
        grandTotal: 11250000
      },
      {
        revisionNumber: 1,
        revisionLabel: 'Rev 1 - Approved Baseline Frozen',
        date: '2026-02-20',
        author: 'Rajesh Sharma',
        reasonForChange: 'Estimator Approved Baseline BOQ (GFC Linked)',
        items: [],
        subtotal: 10300000,
        contingencyPercent: 5,
        contractorMarginPercent: 15,
        taxPercent: 18,
        grandTotal: 11845000
      }
    ],
    activeBOQRevisionNumber: 1,
    executionMilestones: [
      { id: 'm-1', title: 'Site Mobilization & Civil Demolition', phase: 'Civil & Demolition', targetStartDate: '2026-02-01', targetEndDate: '2026-02-28', progressPercent: 100, status: 'Completed', leadSupervisor: 'Ramesh Verma', prerequisites: 'Society Permission NOC' },
      { id: 'm-2', title: 'MEP Electrical & Plumbing Rough-Ins', phase: 'MEP Infrastructure', targetStartDate: '2026-03-01', targetEndDate: '2026-03-15', progressPercent: 100, status: 'Completed', leadSupervisor: 'Ramesh Verma', prerequisites: 'Civil Demolition Sign-off' },
      { id: 'm-3', title: 'Italian Marble Laying & Tile Cladding', phase: 'Flooring & Wet Areas', targetStartDate: '2026-03-16', targetEndDate: '2026-09-20', progressPercent: 85, status: 'In Progress', leadSupervisor: 'Ramesh Verma', prerequisites: 'Screed Level Certification' },
      { id: 'm-4', title: 'Gypsum False Ceiling Framing & Coves', phase: 'Ceiling Works', targetStartDate: '2026-09-01', targetEndDate: '2026-09-30', progressPercent: 60, status: 'In Progress', leadSupervisor: 'Ramesh Verma', prerequisites: 'MEP Pressure Testing' },
      { id: 'm-5', title: 'Modular Carcass & Wardrobe Millwork', phase: 'Carpentry & Joinery', targetStartDate: '2026-09-15', targetEndDate: '2026-10-15', progressPercent: 30, status: 'In Progress', leadSupervisor: 'Kavita Nair', prerequisites: 'Plywood Moisture Check' },
      { id: 'm-6', title: 'Painting, Polishing & Lighting Fixture Fit-out', phase: 'Finishes', targetStartDate: '2026-10-01', targetEndDate: '2026-10-30', progressPercent: 0, status: 'Not Started', leadSupervisor: 'Ramesh Verma', prerequisites: 'Ceiling Sanding' },
      { id: 'm-7', title: 'Deep Cleaning, Snag Rectification & Final Handover', phase: 'Handover', targetStartDate: '2026-11-01', targetEndDate: '2026-11-15', progressPercent: 0, status: 'Not Started', leadSupervisor: 'Kavita Nair', prerequisites: '100% Joinery Complete' }
    ],
    snagItems: [
      {
        id: 'snag-1',
        roomOrZone: 'Living Room',
        description: 'Minor roller texture inconsistency on south elevation accent wall under raking light.',
        severity: 'Low',
        assignedContractor: 'Shree Sai Finishing Contractors',
        reportedDate: '2026-09-10',
        status: 'In Rectification'
      },
      {
        id: 'snag-2',
        roomOrZone: 'Master Bedroom',
        description: 'Left wardrobe door soft-close damper tension requires re-adjustment.',
        severity: 'Low',
        assignedContractor: 'Vishwakarma Carpentry & Interior Works',
        reportedDate: '2026-09-08',
        status: 'Verified & Closed',
        closedDate: '2026-09-12'
      }
    ],
    invoices: [
      {
        id: 'inv-1',
        invoiceNumber: 'BS-RA-2026-01',
        milestoneTitle: 'Advance on Contract Signing & Mobilization (10%)',
        percentageOfContract: 10,
        amountDue: 1184500,
        retentionWithheld: 59225,
        issueDate: '2026-02-20',
        dueDate: '2026-02-28',
        status: 'Paid',
        paidDate: '2026-02-26',
        paidAmount: 1184500
      },
      {
        id: 'inv-2',
        invoiceNumber: 'BS-RA-2026-02',
        milestoneTitle: 'Civil Demolition & MEP Rough-Ins Certified (15%)',
        percentageOfContract: 15,
        amountDue: 1776750,
        retentionWithheld: 88837,
        issueDate: '2026-03-18',
        dueDate: '2026-03-25',
        status: 'Paid',
        paidDate: '2026-03-24',
        paidAmount: 1776750
      }
    ],
    defectLiabilityRetentionAmount: 592250,
    warrantyTickets: [],
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-09-12T16:00:00Z'
  },
  {
    id: 'PROJ-BANDRA-VILLA',
    enquiryNumber: 'ENQ-2026-094',
    clientName: 'Dr. Anand Kulkarni',
    organizationOrFamily: 'Kulkarni Family Estate',
    contactEmail: 'anand.k@healthmed.org',
    contactPhone: '+91 98210 44556',
    siteAddress: 'Plot 42, Perry Cross Road, Bandra West',
    siteCity: 'Mumbai',
    siteAreaSqFt: 6200,
    builtUpAreaSqFt: 5200,
    engagementType: 'Complete design-and-build',
    budgetTier: 'Ultra Luxury Bespoke',
    targetBudget: 26000000,
    targetTimelineMonths: 8,
    confirmedRequirements: {
      projectVision: 'Complete architectural interior renovation of a duplex bungalow. Focus on natural daylight courtyards, private yoga sanctuary, and temperature-controlled wine cellar.',
      roomZones: [
        'Ground Floor Foyer & Living Courtyard (1,800 sq.ft)',
        'Gourmet Show Kitchen & Chef Pantry (450 sq.ft)',
        'Master Suite with Garden Terrace (950 sq.ft)',
        'Wellness Studio & Yoga Pavilion (400 sq.ft)'
      ],
      stylePreferences: ['Biophilic Modernist', 'Natural Teak', 'Hand-cut Slate', 'Minimalist Glazing'],
      specialConstraints: 'Heritage tree on east boundary must be safeguarded with zero root disturbance.',
      dateConfirmed: '2026-02-14'
    },
    nextAction: {
      actionTitle: 'Present 4 AI Concept Options to Client & Family',
      assigneeName: 'Aarav Singhania',
      assigneeRole: 'Lead Architect & MD',
      dueDate: '2026-09-18',
      priority: 'Urgent',
      isCompleted: false
    },
    salesStage: 'Concept Pitch',
    designStatus: '4-5 Concepts Generated',
    executionStatus: 'Pre-construction',
    billingStatus: 'Unbilled',
    collectionStatus: 'Pending Advance',
    warrantyStatus: 'Not Applicable',
    conceptOptions: [
      {
        id: 'c-kul-1',
        optionNumber: 1,
        title: 'Courtyard House with Living Green Spine',
        themeStyle: 'Biophilic Modernist',
        architecturalNarrative: 'An inward-looking sanctuary structured around an open-sky courtyard with cascading ficus plants and water feature.',
        spatialZoning: [
          { zone: 'Central Green Court', allocationSqFt: 1200, flowDescription: 'Water feature and vertical garden wall.' }
        ],
        materials: [
          { material: 'Hand-Cut Jodhpur Sandstone', category: 'Wall Finishes', finish: 'Natural Split Face', estimatedRatePerUnit: 450, unit: 'sq.ft', ecoRating: 'A+' }
        ],
        sustainabilityScore: 96,
        estimatedCostPerSqFt: 5100,
        totalEstimatedCost: 26520000,
        estimatedWeeks: 32,
        isSelectedConcept: false,
        renderTheme: {
          accentColor: '#059669',
          secondaryColor: '#ecfdf5',
          styleTag: 'Courtyard Biophilic',
          schematicType: 'biophilic'
        },
        internalReview: {
          reviewedBy: 'Aarav Singhania',
          approvedForClient: true,
          leadNotes: 'Courtyard drainage and waterproofing detail required.',
          reviewDate: '2026-02-16'
        },
        clientReview: {
          isShared: false,
          clientApproved: false,
          clientComments: ''
        },
        visualAssets: getVisualAssetsForConcept(1, 'Biophilic Modernist', 5200)
      }
    ],
    detailedDeliverables: [],
    boqRevisions: [],
    activeBOQRevisionNumber: 0,
    executionMilestones: [],
    snagItems: [],
    invoices: [],
    defectLiabilityRetentionAmount: 0,
    warrantyTickets: [],
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-09-11T12:00:00Z'
  }
];
