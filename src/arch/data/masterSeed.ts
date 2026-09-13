import { MasterDataHubState } from '../types';

export const INITIAL_MASTER_DATA: MasterDataHubState = {
  trades: [
    {
      id: 'TRD-01',
      code: 'CIVIL_DEMOLITION',
      name: 'Civil Demolition & Debris Disposal',
      description: 'Masonry hacking, partition dismantling, chute debris disposal, and surface prep.',
      defaultMarginPercent: 25,
      defaultContingencyPercent: 5,
      defaultLeadDays: 3,
      status: 'Active'
    },
    {
      id: 'TRD-02',
      code: 'FLOORING_CLADDING',
      name: 'Premium Flooring & Stone Cladding',
      description: 'Italian marble, granite, engineered quartz, vitrified tiles, and hardwood timber decking.',
      defaultMarginPercent: 22,
      defaultContingencyPercent: 7,
      defaultLeadDays: 14,
      status: 'Active'
    },
    {
      id: 'TRD-03',
      code: 'CARPENTRY_JOINERY',
      name: 'Custom Joinery & Architectural Millwork',
      description: 'Bespoke wardrobes, vanity consoles, acoustic wall panels, veneer pressing, and hardware.',
      defaultMarginPercent: 24,
      defaultContingencyPercent: 6,
      defaultLeadDays: 21,
      status: 'Active'
    },
    {
      id: 'TRD-04',
      code: 'CEILING_DRYWALL',
      name: 'False Ceiling & Architectural Coves',
      description: 'Gyproc suspended ceilings, perimeter coves, acoustic insulation, and access trap doors.',
      defaultMarginPercent: 25,
      defaultContingencyPercent: 4,
      defaultLeadDays: 7,
      status: 'Active'
    },
    {
      id: 'TRD-05',
      code: 'ELECTRICAL_LIGHTING',
      name: 'Electrical Conduits & Architectural Lighting',
      description: 'FRLS point wiring, DB dressing, smart home automation, magnetic track lights, and coves.',
      defaultMarginPercent: 25,
      defaultContingencyPercent: 5,
      defaultLeadDays: 10,
      status: 'Active'
    },
    {
      id: 'TRD-06',
      code: 'PAINTING_POLISHING',
      name: 'Surface Finishing, Painting & PU Polishing',
      description: 'Acrylic putty, low-VOC luxury emulsion, Italian PU clear wood finish, and limewash plaster.',
      defaultMarginPercent: 28,
      defaultContingencyPercent: 4,
      defaultLeadDays: 7,
      status: 'Active'
    }
  ],
  materials: [
    {
      id: 'MAT-01',
      code: 'MAR-STAT-01',
      name: 'Italian Statuario Marble Slabs (18mm)',
      category: 'Natural Stone',
      unit: 'sq.ft',
      standardRate: 780,
      ecoRating: 'A+',
      preferredSupplier: 'Classic Marble Company',
      leadTimeDays: 10,
      specs: 'Selected white marble with grey-gold veins, polished bookmatched finish.',
      status: 'Active'
    },
    {
      id: 'MAT-02',
      code: 'PLY-BWP-710',
      name: 'CenturyPly Club Prime 710 Marine Plywood (19mm)',
      category: 'Engineered Wood',
      unit: 'sq.ft',
      standardRate: 145,
      ecoRating: 'A',
      preferredSupplier: 'Apex Timber & Plywood Corp',
      leadTimeDays: 4,
      specs: '100% borer and termite proof, boiling waterproof grade with 25-year warranty.',
      status: 'Active'
    },
    {
      id: 'MAT-03',
      code: 'VEN-SMK-OAK',
      name: 'Natural Smoked Oak Architectural Veneer',
      category: 'Veneers & Laminates',
      unit: 'sq.ft',
      standardRate: 220,
      ecoRating: 'A+',
      preferredSupplier: 'Turakhia Natural Veneers',
      leadTimeDays: 7,
      specs: '0.55mm thick smoked European oak veneer, crown cut sequence matched.',
      status: 'Active'
    },
    {
      id: 'MAT-04',
      code: 'PNT-ROYALE-MATT',
      name: 'Asian Paints Royale Luxury Matt Emulsion',
      category: 'Paints & Finishes',
      unit: 'litre',
      standardRate: 480,
      ecoRating: 'A',
      preferredSupplier: 'Asian Paints Color Idea Store',
      leadTimeDays: 2,
      specs: 'Teflon surface protector, anti-bacterial, washable luxury interior matt.',
      status: 'Active'
    },
    {
      id: 'MAT-05',
      code: 'HRD-BLUM-TANDEM',
      name: 'Blum Tandembox Antaro Soft-Close Drawer Kit (500mm)',
      category: 'Architectural Hardware',
      unit: 'set',
      standardRate: 3850,
      ecoRating: 'A',
      preferredSupplier: 'Hafele India / Blum Official',
      leadTimeDays: 5,
      specs: 'Full-extension concealed runners with integrated Blumotion soft-close.',
      status: 'Active'
    }
  ],
  zones: [
    {
      id: 'ZN-01',
      code: 'LIV_DIN',
      roomName: 'Living & Dining Great Room',
      spaceTypology: 'Residential',
      typicalAreaSqFt: 850,
      typicalBudgetPerSqFt: 3200,
      priorityFinishes: ['Statuario Marble', 'Smoked Oak Panelling', 'Acoustic Ceiling Cove'],
      status: 'Active'
    },
    {
      id: 'ZN-02',
      code: 'MBR_SUITE',
      roomName: 'Master Bedroom Suite & Dressing',
      spaceTypology: 'Residential',
      typicalAreaSqFt: 450,
      typicalBudgetPerSqFt: 2800,
      priorityFinishes: ['Hardwood Flooring', 'Fluted Veneer Headboard', 'Walk-in Closet'],
      status: 'Active'
    },
    {
      id: 'ZN-03',
      code: 'KIT_GOURMET',
      roomName: 'Gourmet Show Kitchen & Pantry',
      spaceTypology: 'Residential',
      typicalAreaSqFt: 220,
      typicalBudgetPerSqFt: 4500,
      priorityFinishes: ['Silestone Quartz Counter', 'Blum Servo-Drive Hardware', 'PU Lacquered Shutters'],
      status: 'Active'
    },
    {
      id: 'ZN-04',
      code: 'STU_OFFICE',
      roomName: 'Executive Study & Library',
      spaceTypology: 'Residential',
      typicalAreaSqFt: 180,
      typicalBudgetPerSqFt: 2600,
      priorityFinishes: ['Acoustic Fabric Panels', 'Brass Profile Bookshelves', 'Dim-to-Warm Lighting'],
      status: 'Active'
    }
  ],
  vendors: [
    {
      id: 'VND-001',
      code: 'VND-APEX',
      companyName: 'Apex Timber & Plywood Corporation',
      tradeCategory: 'CARPENTRY_JOINERY',
      contactPerson: 'Harish Patel',
      phone: '+91 98201 11223',
      email: 'sales@apextimber.in',
      rating: 4.8,
      complianceStatus: 'Verified & Insured',
      activeSitesCount: 4,
      paymentTerms: '30% Advance, Balance on Delivery Inspection',
      status: 'Active'
    },
    {
      id: 'VND-002',
      code: 'VND-CLASSIC',
      companyName: 'Classic Marble & Stone Imports',
      tradeCategory: 'FLOORING_CLADDING',
      contactPerson: 'Suresh Mehta',
      phone: '+91 98212 33445',
      email: 'orders@classicmarble.com',
      rating: 4.9,
      complianceStatus: 'Verified & Insured',
      activeSitesCount: 2,
      paymentTerms: '100% against Slab Selection',
      status: 'Active'
    },
    {
      id: 'VND-003',
      code: 'VND-LUMIERE',
      companyName: 'Lumiere Lighting Solutions',
      tradeCategory: 'ELECTRICAL_LIGHTING',
      contactPerson: 'Deepak Shah',
      phone: '+91 98303 55667',
      email: 'info@lumierelighting.in',
      rating: 4.7,
      complianceStatus: 'Verified & Insured',
      activeSitesCount: 3,
      paymentTerms: '50% Order, 50% on Dispatch',
      status: 'Active'
    }
  ],
  milestones: [
    {
      id: 'MST-01',
      code: 'TURNKEY_STD_7',
      templateName: 'Turnkey Residential Interior (7-Milestone Standard)',
      engagementType: 'Interior turnkey',
      stages: [
        { stageName: 'Advance on Contract Signing & Mobilization', percentage: 10, triggerCondition: 'Signed contract & BOQ Rev-1 baseline freeze' },
        { stageName: 'Civil Demolition & MEP Rough-Ins Complete', percentage: 15, triggerCondition: 'Joint inspection of conduit & plumbing pressure tests' },
        { stageName: 'Flooring Slabs & Wall Tiling Complete', percentage: 20, triggerCondition: 'Laying & initial grinding certification' },
        { stageName: 'False Ceiling & Carcass Carpentry Complete', percentage: 25, triggerCondition: 'Gypsum inspection and wardrobe carcass level verification' },
        { stageName: 'Veneer Finishing & Painting First Coat', percentage: 15, triggerCondition: 'Veneer polish sign-off and lighting fixture fitment' },
        { stageName: 'Pre-Handover Joint Inspection & Snag Resolution', percentage: 10, triggerCondition: '100% snag rectification and deep clean' },
        { stageName: 'Final Handover & Key Release', percentage: 5, triggerCondition: 'Signed handover certificate and OEM warranty dossier release' }
      ],
      retentionPercent: 5,
      status: 'Active'
    }
  ],
  team: [
    {
      id: 'USR-DIR-01',
      code: 'TM-01',
      fullName: 'Aarav Singhania',
      role: 'Managing Director & Partner',
      department: 'Architecture',
      email: 'aarav@buildstorys.com',
      phone: '+91 98101 22334',
      activeProjectsCount: 3,
      status: 'Active'
    },
    {
      id: 'USR-EST-01',
      code: 'TM-02',
      fullName: 'Rajesh Sharma',
      role: 'Lead Quantity Surveyor & Cost Planner',
      department: 'Commercials & Estimation',
      email: 'rajesh.qs@buildstorys.com',
      phone: '+91 98202 33445',
      activeProjectsCount: 4,
      status: 'Active'
    },
    {
      id: 'USR-PM-01',
      code: 'TM-03',
      fullName: 'Kavita Nair',
      role: 'Senior Project Lead (Interiors & Turnkey)',
      department: 'Project Management',
      email: 'kavita.pm@buildstorys.com',
      phone: '+91 98303 44556',
      activeProjectsCount: 2,
      status: 'Active'
    },
    {
      id: 'USR-SITE-01',
      code: 'TM-04',
      fullName: 'Ramesh Verma',
      role: 'Site Execution & QC Engineer',
      department: 'Site Supervision',
      email: 'ramesh.site@buildstorys.com',
      phone: '+91 98404 55667',
      activeProjectsCount: 1,
      status: 'Active'
    }
  ]
};
