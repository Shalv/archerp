/**
 * Build Storys ERP - VILLA 253 DEMO SEEDS (stage 1 to 7 operational data)
 * ----------------------------------------------------------------------
 * Every record below belongs to one project: PROJ-VILLA-253 (Villa 253,
 * Karjat). Nothing here is random or borrowed from another project - room
 * names, quantities and dates all trace back to the R0 wall-marking drawing
 * and the contract programme defined in villa253DemoProject.ts.
 */

import {
  PurchaseOrderRecord,
  ProcurementRFQ,
  GoodsReceiptNote,
  SubcontractWorkOrder,
  DailyProgressReport,
  QualityNCRRecord,
  SafetyPermitToWork,
  WarrantyMaintenanceTicket,
  TradeCategory
} from '../types/erp';
import { CrmLeadExtended } from '../types/crm';
import { VILLA253, VILLA253_ASSETS } from './villa253DemoProject';

// ---------------------------------------------------------------------------
// MODULE M01 - CRM & LEAD FUNNEL
// ---------------------------------------------------------------------------
export const VILLA253_CRM_LEADS: CrmLeadExtended[] = [
  {
    id: 'LEAD-V253-001',
    leadCode: 'LD-V253',
    clientName: 'Aditya & Sneha Kulkarni',
    companyName: 'Kulkarni Precision Tools Pvt Ltd',
    phone: VILLA253.clientPhone,
    email: VILLA253.clientEmail,
    source: 'ARCHITECT_REFERRAL',
    projectType: 'RESIDENTIAL',
    location: 'Villa 253, 24-Type, The Meadows (Phase 2), Neral-Karjat Road',
    city: 'Karjat',
    plotAreaSqFt: 4800,
    builtUpAreaSqFt: 3150,
    carpetAreaSqFt: 2205,
    budgetMinINR: 8500000,
    budgetMaxINR: 10500000,
    dealValueINR: 9954702,
    targetFinishTier: 'Premium Luxury',
    floorsCount: 2,
    targetTimelineMonths: 6,
    interiorStyle: 'Warm Modern Minimal with Teak Accents and Coastal-Calm Palette',
    architectPartner: 'Ar. Shruthi (Build Storys Design Studio)',
    consultantOrBroker: 'The Meadows Community - Developer Handover Desk',
    stage: 'WON',
    assignedSalesLead: 'Rahul Deshmukh',
    nextFollowUpDate: '2026-12-12',
    nextFollowUpTime: '04:00 PM',
    nextActionTitle: 'Pre-handover walkthrough of great room, gazebo and bedroom 3',
    lastContactDate: '2026-11-08',
    siteVisitDate: '2026-05-30',
    siteVisitTime: '10:00 AM',
    siteVisitStatus: 'COMPLETED',
    siteVisitNotes:
      'Bare-shell villa measured with Bosch GLM 150-27. All seven R0 spaces matched within 12mm. Slab-to-slab 10\'-3". Two hairline cracks on terrace slab noted for treatment before gazebo base plates.',
    visitingEngineer: 'Ar. Rajesh Sharma',
    estimatedTurnkeyRatePerSqFt: 4515,
    expectedGrossMarginPct: 23.8,
    bant: {
      budgetScore: 25,
      authorityScore: 25,
      needScore: 25,
      timelineScore: 20,
      budgetNotes: '₹99.5 lakh contract signed including GST. 10% mobilisation advance received 01-07-2026.',
      authorityNotes: 'Mr. Aditya Kulkarni is sole signing authority; Mrs. Sneha Kulkarni approves all finishes and samples.',
      needNotes: 'Complete turnkey interiors on a developer shell, including roof gazebo, decks and landscape.',
      timelineNotes: 'Handover required before the family\'s December school break - target 18-12-2026.'
    },
    stakeholders: [
      { name: 'Aditya Kulkarni', role: 'Primary Owner', phone: VILLA253.clientPhone, email: VILLA253.clientEmail, isDecisionMaker: true },
      { name: 'Sneha Kulkarni', role: 'Co-Owner / Spouse', phone: VILLA253.clientAltPhone, email: VILLA253.spouseEmail, isDecisionMaker: true },
      { name: 'Ar. Shruthi', role: 'Architect Consultant', phone: '+91 98100 88776', email: 'shruthi@buildstory.com', isDecisionMaker: false }
    ],
    communicationLog: [
      { id: 'v253-c1', date: '2026-05-18', time: '11:00 AM', type: 'CALL', summary: 'Referral from the Kulkarni family office. Villa 253 handover due from developer; turnkey interiors required before December.', outcome: 'Interested - site visit requested', agent: 'Rahul Deshmukh' },
      { id: 'v253-c2', date: '2026-05-30', time: '10:00 AM', type: 'MEETING', summary: 'Site survey of the bare shell with laser disto and moisture meter; 46 photographs logged against R0 drawing.', outcome: 'Survey complete', agent: 'Ar. Rajesh Sharma' },
      { id: 'v253-c3', date: '2026-06-06', time: '04:00 PM', type: 'MEETING', summary: 'Discovery brief signed with Mrs. Kulkarni - palette, room priorities, gazebo as family space.', outcome: 'Brief frozen', agent: 'Rahul Deshmukh' },
      { id: 'v253-c4', date: '2026-06-20', time: '05:30 PM', type: 'WHATSAPP', summary: 'Quotation BS-QT-2026-0253 (₹84.36 L + GST) sent with Rev 1 BOQ and 4 renders.', outcome: 'Under review', agent: 'Rahul Deshmukh' },
      { id: 'v253-c5', date: '2026-06-27', time: '12:15 PM', type: 'MEETING', summary: 'Contract signed at the Andheri studio. 10% advance cheque handed over; programme locked to 18-12-2026.', outcome: 'Deal Won', agent: 'Rahul Deshmukh' }
    ],
    aiRecommendationSnippet:
      'Villa 253 is a bare-shell 3BHK: budget the highest margin on joinery (28%) and gazebo (27%). Marble and teak have 18-day import lead time - release both POs before the first-week programme. Terrace slab cracks must be treated before the gazebo base plates are loaded.',
    createdAt: '2026-05-18'
  },
  {
    id: 'LEAD-V253-002',
    leadCode: 'LD-0407',
    clientName: 'Nikhil & Priya Bhandari',
    companyName: 'Bhandari Capital Advisors',
    phone: '+91 98670 33214',
    email: 'nikhil.bhandari@bhandaricapital.in',
    source: 'WEBSITE',
    projectType: 'RESIDENTIAL',
    location: 'Bungalow 12, Sagar Darshan, Alibaug-Revdanda Road',
    city: 'Alibaug',
    plotAreaSqFt: 6200,
    builtUpAreaSqFt: 3800,
    carpetAreaSqFt: 2740,
    budgetMinINR: 12000000,
    budgetMaxINR: 15000000,
    dealValueINR: 14200000,
    targetFinishTier: 'Ultra Bespoke',
    floorsCount: 2,
    targetTimelineMonths: 8,
    interiorStyle: 'Tropical Contemporary with Teak and Kota Stone',
    architectPartner: 'Studio Lotus (external architect)',
    consultantOrBroker: 'Private family office',
    stage: 'ESTIMATION',
    assignedSalesLead: 'Rahul Deshmukh',
    nextFollowUpDate: '2026-11-18',
    nextFollowUpTime: '11:30 AM',
    nextActionTitle: 'Negotiation on joinery scope and imported teak rate',
    lastContactDate: '2026-11-06',
    siteVisitDate: '2026-10-24',
    siteVisitTime: '09:30 AM',
    siteVisitStatus: 'COMPLETED',
    siteVisitNotes:
      'Sea-facing bungalow, salt-laden air - all hardware to be SS 316. Existing teak joinery in two bedrooms can be retained after polish.',
    visitingEngineer: 'Ar. Shruthi',
    estimatedTurnkeyRatePerSqFt: 5180,
    expectedGrossMarginPct: 26.2,
    bant: {
      budgetScore: 25,
      authorityScore: 20,
      needScore: 25,
      timelineScore: 15,
      budgetNotes: '₹1.42 Cr indicated; wants imported teak priced separately.',
      authorityNotes: 'Joint decision with external architect - architect approval adds a review cycle.',
      needNotes: 'Full interiors plus landscape and pool deck.',
      timelineNotes: 'Flexible - aiming for March 2027 occupancy.'
    },
    stakeholders: [
      { name: 'Nikhil Bhandari', role: 'Primary Owner', phone: '+91 98670 33214', email: 'nikhil.bhandari@bhandaricapital.in', isDecisionMaker: true },
      { name: 'Priya Bhandari', role: 'Co-Owner / Spouse', phone: '+91 98670 33215', email: 'priya.bhandari@gmail.com', isDecisionMaker: true }
    ],
    communicationLog: [
      { id: 'v253-c6', date: '2026-10-18', time: '10:00 AM', type: 'CALL', summary: 'Enquiry through website form after seeing the Villa 253 gazebo on Instagram.', outcome: 'Site visit scheduled', agent: 'Rahul Deshmukh' },
      { id: 'v253-c7', date: '2026-10-24', time: '09:30 AM', type: 'MEETING', summary: 'Site visit and brief. Salt-resistant specification agreed as a must.', outcome: 'Brief taken', agent: 'Ar. Shruthi' },
      { id: 'v253-c8', date: '2026-11-06', time: '05:00 PM', type: 'EMAIL', summary: 'Proposal sent: ₹1.42 Cr with SS 316 hardware and teak rate revision clause.', outcome: 'Under review', agent: 'Rahul Deshmukh' }
    ],
    aiRecommendationSnippet:
      'Coastal project - quote SS 316 hardware as a line item rather than absorbing it in joinery markup. Retaining the existing teak joinery saves roughly ₹6.8 L and shortens the programme by 3 weeks.',
    createdAt: '2026-10-18'
  },
  {
    id: 'LEAD-V253-003',
    leadCode: 'LD-0409',
    clientName: 'Meera Iyer',
    companyName: 'Iyer Dental Clinics',
    phone: '+91 99870 21455',
    email: 'meera@iyerdental.in',
    source: 'REPEAT_CLIENT',
    projectType: 'COMMERCIAL',
    location: 'Ground Floor, Sai Plaza, Panvel-Karjat Highway',
    city: 'Panvel',
    plotAreaSqFt: 0,
    builtUpAreaSqFt: 1450,
    carpetAreaSqFt: 1180,
    budgetMinINR: 3200000,
    budgetMaxINR: 4000000,
    dealValueINR: 3860000,
    targetFinishTier: 'Standard Turnkey',
    floorsCount: 1,
    targetTimelineMonths: 3,
    interiorStyle: 'Clinical Minimal - White, Oak and Muted Green',
    consultantOrBroker: 'Returning client (2 clinics delivered 2024)',
    stage: 'DESIGN_PITCH',
    assignedSalesLead: 'Rahul Deshmukh',
    nextFollowUpDate: '2026-11-14',
    nextFollowUpTime: '03:00 PM',
    nextActionTitle: 'Send layout options for 3-chair clinic with sterile zone',
    lastContactDate: '2026-11-09',
    siteVisitDate: '2026-11-05',
    siteVisitTime: '02:00 PM',
    siteVisitStatus: 'COMPLETED',
    siteVisitNotes: 'Shell with 3-phase power available. Dental chair plumbing points to be confirmed with equipment vendor.',
    visitingEngineer: 'Ar. Rajesh Sharma',
    estimatedTurnkeyRatePerSqFt: 3271,
    expectedGrossMarginPct: 21.5,
    bant: {
      budgetScore: 20,
      authorityScore: 25,
      needScore: 20,
      timelineScore: 20,
      budgetNotes: '₹38.6 L approved by clinic partners.',
      authorityNotes: 'Meera is sole owner of the clinic chain.',
      needNotes: '3-chair clinic with reception, sterile zone and a small consultation room.',
      timelineNotes: 'Wants to open before 31-01-2027.'
    },
    stakeholders: [
      { name: 'Meera Iyer', role: 'Primary Owner', phone: '+91 99870 21455', email: 'meera@iyerdental.in', isDecisionMaker: true }
    ],
    communicationLog: [
      { id: 'v253-c9', date: '2026-11-03', time: '12:00 PM', type: 'WHATSAPP', summary: 'Repeat client - third clinic. Asked for a quick turnaround layout.', outcome: 'Site visit fixed', agent: 'Rahul Deshmukh' },
      { id: 'v253-c10', date: '2026-11-05', time: '02:00 PM', type: 'MEETING', summary: 'Site visit and brief taken; equipment vendor drawings awaited.', outcome: 'Brief taken', agent: 'Ar. Rajesh Sharma' }
    ],
    aiRecommendationSnippet:
      'Repeat client with two delivered clinics - reuse the standard clinic BOQ template and cut estimation time. Vinyl flooring and modular partitions keep the programme inside 10 weeks.',
    createdAt: '2026-11-03'
  },
  {
    id: 'LEAD-V253-004',
    leadCode: 'LD-0411',
    clientName: 'Rohit Deshpande',
    companyName: 'Deshpande Agro Estates',
    phone: '+91 98220 77419',
    email: 'rohit@deshpandeagro.in',
    source: 'WALK_IN',
    projectType: 'HOSPITALITY',
    location: 'Farmhouse Plot 7, Khopoli-Pali Road',
    city: 'Khopoli',
    plotAreaSqFt: 18000,
    builtUpAreaSqFt: 4200,
    carpetAreaSqFt: 3100,
    budgetMinINR: 15000000,
    budgetMaxINR: 20000000,
    dealValueINR: 18500000,
    targetFinishTier: 'Premium Luxury',
    floorsCount: 2,
    targetTimelineMonths: 10,
    interiorStyle: 'Rustic Luxury - Stone, Teak and Lime Plaster',
    consultantOrBroker: 'Walk-in at Karjat site board',
    stage: 'SITE_VISIT_SCHEDULED',
    assignedSalesLead: 'Rahul Deshmukh',
    nextFollowUpDate: '2026-11-16',
    nextFollowUpTime: '10:00 AM',
    nextActionTitle: 'Site visit with structural consultant for farmhouse shell',
    lastContactDate: '2026-11-10',
    siteVisitDate: '2026-11-16',
    siteVisitTime: '10:00 AM',
    siteVisitStatus: 'SCHEDULED',
    visitingEngineer: 'Ar. Shruthi',
    estimatedTurnkeyRatePerSqFt: 5967,
    expectedGrossMarginPct: 24.0,
    bant: {
      budgetScore: 25,
      authorityScore: 25,
      needScore: 20,
      timelineScore: 15,
      budgetNotes: '₹1.5-2.0 Cr range discussed for 6 guest suites plus common areas.',
      authorityNotes: 'Family-owned estate; Rohit is the decision maker.',
      needNotes: 'Farmhouse guest suites, dining pavilion and landscape.',
      timelineNotes: 'No fixed date - wants to open for the 2027 monsoon season.'
    },
    stakeholders: [
      { name: 'Rohit Deshpande', role: 'Primary Owner', phone: '+91 98220 77419', email: 'rohit@deshpandeagro.in', isDecisionMaker: true }
    ],
    communicationLog: [
      { id: 'v253-c11', date: '2026-11-10', time: '11:00 AM', type: 'CALL', summary: 'Saw the Villa 253 site board; asked for a farmhouse turnkey discussion.', outcome: 'Site visit scheduled for 16-11-2026', agent: 'Rahul Deshmukh' }
    ],
    aiRecommendationSnippet:
      'Hospitality scope - separate guest-suite fitout from common-area civil so the estate can open in phases. Lime plaster needs a 6-week curing window before furniture moves in.',
    createdAt: '2026-11-10'
  },
  {
    id: 'LEAD-V253-005',
    leadCode: 'LD-0398',
    clientName: 'Sunita Merchant',
    companyName: 'Merchant Textiles',
    phone: '+91 98211 66032',
    email: 'sunita@merchanttextiles.in',
    source: 'PORTAL',
    projectType: 'RETAIL',
    location: 'Shop 4, Hill Road, Bandra West',
    city: 'Mumbai',
    plotAreaSqFt: 0,
    builtUpAreaSqFt: 900,
    carpetAreaSqFt: 720,
    budgetMinINR: 2200000,
    budgetMaxINR: 2800000,
    dealValueINR: 2600000,
    targetFinishTier: 'Standard Turnkey',
    floorsCount: 1,
    targetTimelineMonths: 2,
    interiorStyle: 'Retail Display - Warm Neutrals',
    stage: 'LOST',
    lostReason: 'Client selected a Bandra-based contractor at 18% lower quote; scope reduced to display fixtures only.',
    assignedSalesLead: 'Rahul Deshmukh',
    nextFollowUpDate: '2027-02-01',
    nextFollowUpTime: '11:00 AM',
    nextActionTitle: 'Re-approach for phase 2 lighting upgrade',
    lastContactDate: '2026-09-22',
    siteVisitDate: '2026-09-10',
    siteVisitTime: '04:00 PM',
    siteVisitStatus: 'COMPLETED',
    visitingEngineer: 'Ar. Rajesh Sharma',
    estimatedTurnkeyRatePerSqFt: 3611,
    expectedGrossMarginPct: 18.5,
    bant: {
      budgetScore: 15,
      authorityScore: 25,
      needScore: 15,
      timelineScore: 25,
      budgetNotes: 'Budget was tight for the millwork specified.',
      authorityNotes: 'Owner-led decision.',
      needNotes: 'Display fixtures and lighting only.',
      timelineNotes: 'Needed possession before Diwali 2026 - too tight for our marble lead time.'
    },
    stakeholders: [
      { name: 'Sunita Merchant', role: 'Primary Owner', phone: '+91 98211 66032', email: 'sunita@merchanttextiles.in', isDecisionMaker: true }
    ],
    communicationLog: [
      { id: 'v253-c12', date: '2026-09-10', time: '04:00 PM', type: 'MEETING', summary: 'Shop measured; display fixture layout discussed.', outcome: 'Proposal to be sent', agent: 'Rahul Deshmukh' },
      { id: 'v253-c13', date: '2026-09-22', time: '06:00 PM', type: 'CALL', summary: 'Client informed us she has gone with a lower quote. Reason: budget.', outcome: 'Lost', agent: 'Rahul Deshmukh' }
    ],
    aiRecommendationSnippet:
      'Lost on price for a 2-week deadline. Keep a display-fixture-only package ready for retail enquiries that cannot absorb full turnkey rates.',
    createdAt: '2026-09-10'
  }
];

// ---------------------------------------------------------------------------
// MODULE M04 - DRAWING REGISTER (all sheets are Villa 253 sheets)
// ---------------------------------------------------------------------------
export interface VillaDrawingRecord {
  id: string;
  drawingCode: string;
  discipline: 'ARCHITECTURAL' | 'INTERIOR_LAYOUT' | '3D_RENDERS' | 'STRUCTURAL' | 'ELECTRICAL_MEP' | 'PLUMBING_HVAC';
  title: string;
  revision: 'Rev A' | 'Rev B' | 'Rev C' | 'Rev D';
  status: 'DRAFT' | 'INTERNAL_REVIEW' | 'CLIENT_APPROVED' | 'GFC_ISSUED';
  sheetSize: 'A1' | 'A2' | 'A3';
  scale: string;
  author: string;
  checker: string;
  releaseDate: string;
  fileSizeMb: number;
  imageThumbnail: string;
  gfcStampDate?: string;
  clientCommentsCount: number;
}

export const VILLA253_DRAWINGS: VillaDrawingRecord[] = [
  {
    id: 'DWG-V253-01',
    drawingCode: 'V253-ARC-101-R0',
    discipline: 'ARCHITECTURAL',
    title: 'Wall Marking Drawing R0 - All Seven Spaces with Openings SD1-SD7, D1-D4, W1-W5',
    revision: 'Rev A',
    status: 'GFC_ISSUED',
    sheetSize: 'A1',
    scale: '1:100',
    author: 'Ar. Shruthi (Design Director)',
    checker: 'Ar. Sanjay Puri (Consultant)',
    releaseDate: '2024-10-10',
    fileSizeMb: 8.4,
    imageThumbnail: VILLA253_ASSETS.cadBlueprint,
    gfcStampDate: '2024-10-12',
    clientCommentsCount: 0
  },
  {
    id: 'DWG-V253-02',
    drawingCode: 'V253-ARC-102-R2',
    discipline: 'ARCHITECTURAL',
    title: 'Furniture Layout & Circulation Plan - Great Room, Bedrooms 1-3, Kitchen and Gazebo',
    revision: 'Rev C',
    status: 'GFC_ISSUED',
    sheetSize: 'A1',
    scale: '1:100',
    author: 'Ar. Shruthi',
    checker: 'Ar. Rajesh Sharma',
    releaseDate: '2026-08-12',
    fileSizeMb: 12.6,
    imageThumbnail: VILLA253_ASSETS.buildingSketch,
    gfcStampDate: '2026-08-14',
    clientCommentsCount: 3
  },
  {
    id: 'DWG-V253-03',
    drawingCode: 'V253-INT-201-R2',
    discipline: 'INTERIOR_LAYOUT',
    title: 'Great Room Joinery - TV Console, Fluted Panelling & Crockery Unit Elevations',
    revision: 'Rev C',
    status: 'CLIENT_APPROVED',
    sheetSize: 'A1',
    scale: '1:50',
    author: 'Meera Rao (Lead Interior Designer)',
    checker: 'Ar. Shruthi',
    releaseDate: '2026-08-22',
    fileSizeMb: 16.2,
    imageThumbnail: VILLA253_ASSETS.livingGreatroom,
    clientCommentsCount: 4
  },
  {
    id: 'DWG-V253-04',
    drawingCode: 'V253-INT-202-R1',
    discipline: 'INTERIOR_LAYOUT',
    title: 'Wardrobes & Walk-in - Master Walk-in 10\'2"x11\'9", Bedroom 2 and Bedroom 3 Sections',
    revision: 'Rev B',
    status: 'CLIENT_APPROVED',
    sheetSize: 'A1',
    scale: '1:25',
    author: 'Meera Rao',
    checker: 'Ar. Rajesh Sharma',
    releaseDate: '2026-08-28',
    fileSizeMb: 14.8,
    imageThumbnail: VILLA253_ASSETS.masterBedroom,
    clientCommentsCount: 2
  },
  {
    id: 'DWG-V253-05',
    drawingCode: 'V253-KIT-301-R1',
    discipline: 'INTERIOR_LAYOUT',
    title: 'Modular Kitchen & Utility - 14\'6"x9\'0" Plan with Appliance Cut-outs',
    revision: 'Rev B',
    status: 'GFC_ISSUED',
    sheetSize: 'A2',
    scale: '1:25',
    author: 'Meera Rao',
    checker: 'Ar. Shruthi',
    releaseDate: '2026-09-02',
    fileSizeMb: 9.1,
    imageThumbnail: VILLA253_ASSETS.kitchenPlan,
    gfcStampDate: '2026-09-03',
    clientCommentsCount: 1
  },
  {
    id: 'DWG-V253-06',
    drawingCode: 'V253-STR-501-R1',
    discipline: 'STRUCTURAL',
    title: 'Roof Gazebo - MS Base Plate Setting-out and Section BB\' Timber Pergola (Ridge 12\'-9")',
    revision: 'Rev B',
    status: 'GFC_ISSUED',
    sheetSize: 'A1',
    scale: '1:50',
    author: 'Eng. K. N. Rao (Structural)',
    checker: 'Ar. Sanjay Puri (Consultant)',
    releaseDate: '2026-09-08',
    fileSizeMb: 11.4,
    imageThumbnail: VILLA253_ASSETS.gazebo,
    gfcStampDate: '2026-09-09',
    clientCommentsCount: 0
  },
  {
    id: 'DWG-V253-07',
    drawingCode: 'V253-MEP-E-401-R2',
    discipline: 'ELECTRICAL_MEP',
    title: 'Electrical SLD, KNX Point Schedule & Lighting Layout LT-01 (96 points)',
    revision: 'Rev C',
    status: 'GFC_ISSUED',
    sheetSize: 'A1',
    scale: '1:50',
    author: 'Eng. Farhan Qureshi (MEP)',
    checker: 'Ar. Rajesh Sharma',
    releaseDate: '2026-08-25',
    fileSizeMb: 13.7,
    imageThumbnail: VILLA253_ASSETS.stairPlan,
    gfcStampDate: '2026-08-26',
    clientCommentsCount: 2
  },
  {
    id: 'DWG-V253-08',
    drawingCode: 'V253-MEP-P-402-R1',
    discipline: 'PLUMBING_HVAC',
    title: 'Plumbing Riser, Sanitary Schedule SS-01 & VRF Refrigerant Routing',
    revision: 'Rev B',
    status: 'CLIENT_APPROVED',
    sheetSize: 'A1',
    scale: '1:50',
    author: 'Eng. Farhan Qureshi',
    checker: 'Eng. K. N. Rao',
    releaseDate: '2026-08-20',
    fileSizeMb: 10.9,
    imageThumbnail: VILLA253_ASSETS.bed3Plan,
    clientCommentsCount: 1
  },
  {
    id: 'DWG-V253-09',
    drawingCode: 'V253-3D-601-R3',
    discipline: '3D_RENDERS',
    title: 'Great Room, Master Suite, Bedroom 3 and Roof Gazebo - Photorealistic Render Set',
    revision: 'Rev D',
    status: 'CLIENT_APPROVED',
    sheetSize: 'A2',
    scale: 'NTS',
    author: 'Meera Rao',
    checker: 'Ar. Shruthi',
    releaseDate: '2026-09-05',
    fileSizeMb: 28.3,
    imageThumbnail: VILLA253_ASSETS.livingModern,
    clientCommentsCount: 5
  }
];

// ---------------------------------------------------------------------------
// MODULES M15 / M16 - PROCUREMENT, PO, GRN AND STORE
// ---------------------------------------------------------------------------
export interface VillaRequisition {
  id: string;
  prNumber: string;
  requestedBy: string;
  trade: string;
  itemName: string;
  requestedQuantity: number;
  unit: string;
  requiredByDate: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  purpose: string;
  approvalStatus: 'PENDING_APPROVAL' | 'APPROVED_FOR_PO' | 'REJECTED';
}

export const VILLA253_REQUISITIONS: VillaRequisition[] = [
  {
    id: 'PR-V253-01',
    prNumber: 'PR-2026-V253-041',
    requestedBy: 'Site Eng. Rajesh Sharma',
    trade: 'CARPENTRY_JOINERY',
    itemName: 'CenturyPly Club Prime BWP 710 Marine Grade Plywood 18mm (8x4)',
    requestedQuantity: 64,
    unit: 'sheets',
    requiredByDate: '2026-09-18',
    urgency: 'HIGH',
    purpose: 'Wardrobe and walk-in carcasses for Master, Bedroom 2 and Bedroom 3 (242.5 sq.ft elevation)',
    approvalStatus: 'APPROVED_FOR_PO'
  },
  {
    id: 'PR-V253-02',
    prNumber: 'PR-2026-V253-042',
    requestedBy: 'Ar. Shruthi (Design)',
    trade: 'FLOORING_TILING',
    itemName: 'Botticino Classico honed marble slab 800x800x18mm',
    requestedQuantity: 740,
    unit: 'sq.ft',
    requiredByDate: '2026-09-26',
    urgency: 'HIGH',
    purpose: 'Great room, staircase core and powder room flooring (671.8 sq.ft + 10% wastage)',
    approvalStatus: 'APPROVED_FOR_PO'
  },
  {
    id: 'PR-V253-03',
    prNumber: 'PR-2026-V253-043',
    requestedBy: 'Carpentry Foreman Ramji Mistry',
    trade: 'FALSE_CEILINGS',
    itemName: 'Burma Teak rafter 4"x6" seasoned, 8ft length',
    requestedQuantity: 168,
    unit: 'nos',
    requiredByDate: '2026-10-10',
    urgency: 'MEDIUM',
    purpose: 'Roof gazebo pitched pergola to Section BB\' (24\'x18\', rafters at 600mm centres)',
    approvalStatus: 'APPROVED_FOR_PO'
  },
  {
    id: 'PR-V253-04',
    prNumber: 'PR-2026-V253-044',
    requestedBy: 'Site Eng. Rajesh Sharma',
    trade: 'WATERPROOFING',
    itemName: 'Dr. Fixit Fastflex 2-component elastomeric kit (24 kg)',
    requestedQuantity: 26,
    unit: 'kits',
    requiredByDate: '2026-11-20',
    urgency: 'LOW',
    purpose: 'Top-up for Bedroom 3 balcony and gazebo terrace membrane repair',
    approvalStatus: 'PENDING_APPROVAL'
  }
];

export const VILLA253_RFQS: ProcurementRFQ[] = [
  {
    id: 'RFQ-V253-01',
    projectId: VILLA253.projectId,
    rfqNumber: 'RFQ-2026-V253-018',
    materialRequisitionId: 'PR-V253-01',
    itemDescription: 'CenturyPly Club Prime BWP 710 18mm plywood, 8x4 sheets (64 sheets)',
    trade: 'CARPENTRY_JOINERY',
    requiredQuantity: 64,
    unit: 'nos',
    requiredByDate: '2026-09-18',
    deliverySiteAddress: VILLA253.siteAddressFull,
    vendorQuotations: [
      { vendorId: 'VEND-V253-01', vendorName: 'Konkan Timber & Ply Mart, Panvel', unitRateINR: 3140, taxPercent: 18, totalAmountINR: 237142, deliveryLeadTimeDays: 2, paymentTerms: '30-day credit', vendorRating: 4.8, isRecommended: true },
      { vendorId: 'VEND-V253-02', vendorName: 'Raigad Hardware & Ply House, Karjat', unitRateINR: 3280, taxPercent: 18, totalAmountINR: 247706, deliveryLeadTimeDays: 1, paymentTerms: '50% advance, balance on delivery', vendorRating: 4.3, isRecommended: false },
      { vendorId: 'VEND-V253-03', vendorName: 'Shree Sai Building Materials, Neral', unitRateINR: 3310, taxPercent: 18, totalAmountINR: 249971, deliveryLeadTimeDays: 3, paymentTerms: 'Immediate RTGS before dispatch', vendorRating: 4.1, isRecommended: false }
    ],
    selectedVendorId: 'VEND-V253-01',
    status: 'PO_ISSUED'
  },
  {
    id: 'RFQ-V253-02',
    projectId: VILLA253.projectId,
    rfqNumber: 'RFQ-2026-V253-019',
    materialRequisitionId: 'PR-V253-02',
    itemDescription: 'Botticino Classico honed marble 800x800x18mm, dry-lay approved (740 sq.ft)',
    trade: 'FLOORING_TILING',
    requiredQuantity: 740,
    unit: 'sq.ft',
    requiredByDate: '2026-09-26',
    deliverySiteAddress: VILLA253.siteAddressFull,
    vendorQuotations: [
      { vendorId: 'VEND-V253-04', vendorName: 'R.K. Marbles & Granites, Kishangarh', unitRateINR: 342, taxPercent: 18, totalAmountINR: 298682, deliveryLeadTimeDays: 18, paymentTerms: '20% advance, 80% against dry-lay approval', vendorRating: 4.7, isRecommended: true },
      { vendorId: 'VEND-V253-05', vendorName: 'Aakriti Stone Studio, Mumbai', unitRateINR: 366, taxPercent: 18, totalAmountINR: 319607, deliveryLeadTimeDays: 12, paymentTerms: '40% advance, balance before dispatch', vendorRating: 4.4, isRecommended: false }
    ],
    selectedVendorId: 'VEND-V253-04',
    status: 'PO_ISSUED'
  },
  {
    id: 'RFQ-V253-03',
    projectId: VILLA253.projectId,
    rfqNumber: 'RFQ-2026-V253-020',
    materialRequisitionId: 'PR-V253-03',
    itemDescription: 'Burma Teak rafter 4"x6" seasoned, 8ft (168 nos) for roof gazebo pergola',
    trade: 'CARPENTRY_JOINERY',
    requiredQuantity: 168,
    unit: 'nos',
    requiredByDate: '2026-10-10',
    deliverySiteAddress: VILLA253.siteAddressFull,
    vendorQuotations: [
      { vendorId: 'VEND-V253-06', vendorName: 'Burma Teak House, Fort Mumbai', unitRateINR: 4280, taxPercent: 18, totalAmountINR: 848683, deliveryLeadTimeDays: 16, paymentTerms: '50% advance on order, balance on delivery', vendorRating: 4.9, isRecommended: true },
      { vendorId: 'VEND-V253-07', vendorName: 'Sahyadri Timber Traders, Khopoli', unitRateINR: 4650, taxPercent: 18, totalAmountINR: 922068, deliveryLeadTimeDays: 9, paymentTerms: '100% before dispatch', vendorRating: 4.0, isRecommended: false }
    ],
    selectedVendorId: 'VEND-V253-06',
    status: 'COMPARISON_READY'
  }
];

export const VILLA253_POS: PurchaseOrderRecord[] = [
  { id: 'PO-V253-01', poNumber: 'PO-2026-V253-011', vendorId: 'VEND-V253-01', vendorName: 'Konkan Timber & Ply Mart, Panvel', trade: 'CARPENTRY_JOINERY', itemsCount: 3, totalAmount: 318460, issueDate: '2026-09-12', deliveryDateExpected: '2026-09-15', status: 'DELIVERED_CLOSED', paymentTerms: '30 Days Net Credit' },
  { id: 'PO-V253-02', poNumber: 'PO-2026-V253-012', vendorId: 'VEND-V253-04', vendorName: 'R.K. Marbles & Granites, Kishangarh', trade: 'FLOORING_TILING', itemsCount: 1, totalAmount: 298682, issueDate: '2026-09-14', deliveryDateExpected: '2026-10-02', status: 'DELIVERED_CLOSED', paymentTerms: '20% Advance, 80% on dry-lay approval' },
  { id: 'PO-V253-03', poNumber: 'PO-2026-V253-013', vendorId: 'VEND-V253-06', vendorName: 'Burma Teak House, Fort Mumbai', trade: 'CARPENTRY_JOINERY', itemsCount: 1, totalAmount: 848683, issueDate: '2026-09-24', deliveryDateExpected: '2026-10-10', status: 'PARTIALLY_DELIVERED', paymentTerms: '50% Advance on order, balance on delivery' },
  { id: 'PO-V253-04', poNumber: 'PO-2026-V253-014', vendorId: 'VEND-V253-08', vendorName: 'Astral Flowguard Distributors, Thane', trade: 'PLUMBING_SANITARY', itemsCount: 4, totalAmount: 412750, issueDate: '2026-08-18', deliveryDateExpected: '2026-08-28', status: 'DELIVERED_CLOSED', paymentTerms: '15 Days Net' },
  { id: 'PO-V253-05', poNumber: 'PO-2026-V253-015', vendorId: 'VEND-V253-09', vendorName: 'Daikin Airconditioning India - Vashi Branch', trade: 'HVAC_VENTILATION', itemsCount: 2, totalAmount: 596000, issueDate: '2026-08-26', deliveryDateExpected: '2026-09-20', status: 'DELIVERED_CLOSED', paymentTerms: '50% on order, 50% on commissioning' },
  { id: 'PO-V253-06', poNumber: 'PO-2026-V253-016', vendorId: 'VEND-V253-10', vendorName: 'Legrand India - Automation Partner, Andheri', trade: 'ELECTRICAL_AUTOMATION', itemsCount: 5, totalAmount: 486300, issueDate: '2026-08-30', deliveryDateExpected: '2026-09-22', status: 'DELIVERED_CLOSED', paymentTerms: '30 Days Net Credit' }
];

export const VILLA253_GRNS: GoodsReceiptNote[] = [
  {
    id: 'GRN-V253-01',
    projectId: VILLA253.projectId,
    grnNumber: 'GRN-2026-V253-031',
    poNumber: 'PO-2026-V253-011',
    vendorName: 'Konkan Timber & Ply Mart, Panvel',
    receivedDate: '2026-09-15',
    challanInvoiceNumber: 'DC-4471 / INV-2026-318',
    itemsReceived: [
      { itemCode: 'PLY-18-BWP', description: 'CenturyPly Club Prime BWP 710 18mm (8x4)', orderedQty: 64, receivedQty: 64, acceptedQty: 62, rejectedQty: 2, rejectionReason: 'Edge delamination and damp corner - stored in open yard at vendor', unit: 'sheets' },
      { itemCode: 'FVI-MAR-50', description: 'Fevicol Marine synthetic resin 50kg drum', orderedQty: 3, receivedQty: 3, acceptedQty: 3, rejectedQty: 0, unit: 'drums' },
      { itemCode: 'HET-SOFT-CLOSE', description: 'Hettich soft-close hinge set (box of 50)', orderedQty: 6, receivedQty: 6, acceptedQty: 6, rejectedQty: 0, unit: 'boxes' }
    ],
    qualityInspectionStatus: 'CONDITIONALLY_ACCEPTED',
    inspectorName: 'QA Eng. K. R. Nair',
    warehouseStorageLocation: 'Villa 253 Site Store - Ground Floor Bedroom 2 (dry chamber)',
    notes: '2 sheets rejected and replaced free of cost on 17-09-2026. Accepted sheets stacked on 100mm battens with 300mm wall gap.'
  },
  {
    id: 'GRN-V253-02',
    projectId: VILLA253.projectId,
    grnNumber: 'GRN-2026-V253-032',
    poNumber: 'PO-2026-V253-012',
    vendorName: 'R.K. Marbles & Granites, Kishangarh',
    receivedDate: '2026-10-02',
    challanInvoiceNumber: 'RKM/DC/2026/1187',
    itemsReceived: [
      { itemCode: 'MAR-BOT-800', description: 'Botticino Classico honed marble 800x800x18mm', orderedQty: 740, receivedQty: 742, acceptedQty: 742, rejectedQty: 0, unit: 'sq.ft' }
    ],
    qualityInspectionStatus: 'PASSED',
    inspectorName: 'QA Eng. K. R. Nair',
    warehouseStorageLocation: 'Villa 253 Great Room - covered dry lay area',
    notes: 'Slabs dry-laid in the great room on 03-10-2026 for client approval; 6 slabs held back as cutting reserve.'
  },
  {
    id: 'GRN-V253-03',
    projectId: VILLA253.projectId,
    grnNumber: 'GRN-2026-V253-033',
    poNumber: 'PO-2026-V253-013',
    vendorName: 'Burma Teak House, Fort Mumbai',
    receivedDate: '2026-10-10',
    challanInvoiceNumber: 'BTH/2026/0904',
    itemsReceived: [
      { itemCode: 'TEK-RAFTER-46', description: 'Burma Teak rafter 4"x6" seasoned, 8ft', orderedQty: 168, receivedQty: 112, acceptedQty: 112, rejectedQty: 0, unit: 'nos' }
    ],
    qualityInspectionStatus: 'PASSED',
    inspectorName: 'QA Eng. K. R. Nair',
    warehouseStorageLocation: 'Villa 253 Roof Terrace - covered rack',
    notes: 'Part delivery 1 of 2. Balance 56 rafters committed for 22-10-2026. Moisture content 9.8% (limit 12%).'
  },
  {
    id: 'GRN-V253-04',
    projectId: VILLA253.projectId,
    grnNumber: 'GRN-2026-V253-034',
    poNumber: 'PO-2026-V253-014',
    vendorName: 'Astral Flowguard Distributors, Thane',
    receivedDate: '2026-08-28',
    challanInvoiceNumber: 'AST/TH/2026/7741',
    itemsReceived: [
      { itemCode: 'PLB-CPVC-25', description: 'Astral CPVC Flowguard pipe 25mm (3m)', orderedQty: 90, receivedQty: 90, acceptedQty: 90, rejectedQty: 0, unit: 'nos' },
      { itemCode: 'PLB-CPVC-20', description: 'Astral CPVC Flowguard pipe 20mm (3m)', orderedQty: 120, receivedQty: 120, acceptedQty: 120, rejectedQty: 0, unit: 'nos' },
      { itemCode: 'PLB-FIT-01', description: 'Astral CPVC fittings assorted (elbows, tees, unions)', orderedQty: 1, receivedQty: 1, acceptedQty: 1, rejectedQty: 0, unit: 'lot' }
    ],
    qualityInspectionStatus: 'PASSED',
    inspectorName: 'Site Eng. Rajesh Sharma',
    warehouseStorageLocation: 'Villa 253 Site Store - Utility Room',
    notes: 'Batch numbers logged in the store register for warranty traceability.'
  },
  {
    id: 'GRN-V253-05',
    projectId: VILLA253.projectId,
    grnNumber: 'GRN-2026-V253-035',
    poNumber: 'PO-2026-V253-016',
    vendorName: 'Legrand India - Automation Partner, Andheri',
    receivedDate: '2026-09-22',
    challanInvoiceNumber: 'LG/IN/2026/5510',
    itemsReceived: [
      { itemCode: 'ELE-ARTEOR-PL', description: 'Legrand Arteor plate with KNX 8-scene keypad', orderedQty: 14, receivedQty: 14, acceptedQty: 14, rejectedQty: 0, unit: 'nos' },
      { itemCode: 'ELE-KNX-ACT', description: 'KNX switch actuator 8-channel', orderedQty: 6, receivedQty: 6, acceptedQty: 6, rejectedQty: 0, unit: 'nos' },
      { itemCode: 'ELE-CAT6A', description: 'CAT6A shielded cable (305m box)', orderedQty: 4, receivedQty: 4, acceptedQty: 4, rejectedQty: 0, unit: 'boxes' }
    ],
    qualityInspectionStatus: 'PASSED',
    inspectorName: 'Eng. Farhan Qureshi (MEP)',
    warehouseStorageLocation: 'Villa 253 Site Store - Locked MEP cage',
    notes: 'KNX devices registered in the programming file before installation.'
  }
];

export interface VillaStockItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  warehouseLocation: string;
  currentStock: number;
  minimumThreshold: number;
  unit: string;
  unitCostINR: number;
  totalValueINR: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'REORDER_TRIGGERED';
}

const stock = (
  id: string,
  itemCode: string,
  itemName: string,
  category: string,
  warehouseLocation: string,
  currentStock: number,
  minimumThreshold: number,
  unit: string,
  unitCostINR: number,
  status: VillaStockItem['status']
): VillaStockItem => ({
  id,
  itemCode,
  itemName,
  category,
  warehouseLocation,
  currentStock,
  minimumThreshold,
  unit,
  unitCostINR,
  totalValueINR: Math.round(currentStock * unitCostINR),
  status
});

export const VILLA253_STOCK: VillaStockItem[] = [
  stock('STK-V253-01', 'PLY-18-BWP', 'CenturyPly Club Prime BWP 710 18mm', 'Plywood & Boards', 'Villa 253 Site Store - Bedroom 2', 11, 15, 'sheets', 3140, 'LOW_STOCK'),
  stock('STK-V253-02', 'MAR-BOT-800', 'Botticino Classico honed marble 800x800', 'Marble & Stone', 'Villa 253 Great Room - dry lay', 62, 40, 'sq.ft', 342, 'IN_STOCK'),
  stock('STK-V253-03', 'TEK-RAFTER-46', 'Burma Teak rafter 4"x6" seasoned', 'Timber', 'Villa 253 Roof Terrace rack', 24, 20, 'nos', 4280, 'IN_STOCK'),
  stock('STK-V253-04', 'FIX-FAST-24', 'Dr. Fixit Fastflex 2-comp waterproofing kit', 'Chemicals & Adhesives', 'Villa 253 Site Store - Utility', 3, 6, 'kits', 2980, 'REORDER_TRIGGERED'),
  stock('STK-V253-05', 'ELE-CAT6A', 'CAT6A shielded cable 305m box', 'Electrical', 'Villa 253 Site Store - MEP cage', 2, 2, 'boxes', 9400, 'IN_STOCK'),
  stock('STK-V253-06', 'PLB-CPVC-25', 'Astral CPVC Flowguard pipe 25mm (3m)', 'Plumbing', 'Villa 253 Site Store - Utility', 18, 20, 'nos', 640, 'LOW_STOCK'),
  stock('STK-V253-07', 'TIL-GVT-6012', 'Kajaria 600x1200 matt anti-skid GVT tile', 'Tiles', 'Villa 253 Site Store - Ground Floor', 96, 60, 'nos', 1180, 'IN_STOCK'),
  stock('STK-V253-08', 'PNT-ROYALE-20', 'Asian Paints Royale Luxury Emulsion 20L', 'Paints & Polish', 'Villa 253 Site Store - Ground Floor', 7, 10, 'buckets', 7420, 'LOW_STOCK')
];

// ---------------------------------------------------------------------------
// MODULE M17 - SUBCONTRACTORS, WORK ORDERS & MEASUREMENT BOOK
// ---------------------------------------------------------------------------
export interface VillaSubcontractor {
  id: string;
  vendorNo: string;
  name: string;
  trade: string;
  contactPerson: string;
  phone: string;
  crewStrength: number;
  gstin: string;
  rating: number;
  safetyCompliance: 'VERIFIED_OK' | 'EXPIRED_DOCS';
  activeProjects: number;
  totalCertifiedAmountINR: number;
  retentionAccumulatedINR: number;
}

export const VILLA253_SUBCONTRACTORS: VillaSubcontractor[] = [
  { id: 'SC-V253-01', vendorNo: 'SC-V253-101', name: 'Sahyadri Civil Works (Karjat)', trade: 'CIVIL_MASONRY & WATERPROOFING', contactPerson: 'Ganesh Pawar (Foreman)', phone: '+91 98214 77230', crewStrength: 12, gstin: '27AAJFS4412L1ZP', rating: 4.7, safetyCompliance: 'VERIFIED_OK', activeProjects: 2, totalCertifiedAmountINR: 846000, retentionAccumulatedINR: 42300 },
  { id: 'SC-V253-02', vendorNo: 'SC-V253-102', name: 'Mistry Joinery Works (Panvel)', trade: 'CARPENTRY_JOINERY & WARDROBES', contactPerson: 'Ustad Ramji Mistry', phone: '+91 98190 23412', crewStrength: 16, gstin: '27AAMPR4412B1Z8', rating: 4.9, safetyCompliance: 'VERIFIED_OK', activeProjects: 1, totalCertifiedAmountINR: 1248000, retentionAccumulatedINR: 62400 },
  { id: 'SC-V253-03', vendorNo: 'SC-V253-103', name: 'Deccan MEP & Automation (Thane)', trade: 'ELECTRICAL_AUTOMATION & HVAC', contactPerson: 'Imran Siddiqui', phone: '+91 99201 88345', crewStrength: 9, gstin: '27AAACI7721K1ZM', rating: 4.6, safetyCompliance: 'VERIFIED_OK', activeProjects: 1, totalCertifiedAmountINR: 618000, retentionAccumulatedINR: 30900 },
  { id: 'SC-V253-04', vendorNo: 'SC-V253-104', name: 'Konkan Stone & Tile Laying (Khopoli)', trade: 'FLOORING_TILING', contactPerson: 'Suresh Bhandari', phone: '+91 98603 41127', crewStrength: 8, gstin: '27AAGFK8891M1ZQ', rating: 4.4, safetyCompliance: 'VERIFIED_OK', activeProjects: 2, totalCertifiedAmountINR: 782000, retentionAccumulatedINR: 39100 },
  { id: 'SC-V253-05', vendorNo: 'SC-V253-105', name: 'Shree Ganesh Fabrication & Pergola (Neral)', trade: 'GAZEBO_STRUCTURE & MS FABRICATION', contactPerson: 'Vikas Jadhav', phone: '+91 98905 22318', crewStrength: 6, gstin: '27AAHPS3320K1ZJ', rating: 4.5, safetyCompliance: 'EXPIRED_DOCS', activeProjects: 1, totalCertifiedAmountINR: 418000, retentionAccumulatedINR: 20900 }
];

export const VILLA253_WORK_ORDERS: SubcontractWorkOrder[] = [
  { id: 'WO-V253-01', woNumber: 'SCWO-2026-V253-01', contractorName: 'Sahyadri Civil Works (Karjat)', trade: 'CIVIL_MASONRY', agreedLabourRatePerUnit: 'Blockwork & making good ₹78/sq.ft, levelling screed ₹42/sq.ft', contractValue: 850000, certifiedWorkDoneValue: 846000, retentionWithheld: 42300, amountPaid: 803700, status: 'ACTIVE_EXECUTION' },
  { id: 'WO-V253-02', woNumber: 'SCWO-2026-V253-02', contractorName: 'Mistry Joinery Works (Panvel)', trade: 'CARPENTRY_JOINERY', agreedLabourRatePerUnit: 'Wardrobe elevation ₹242/sq.ft, kitchen ₹1,180/r.ft, TV console ₹940/r.ft', contractValue: 1248000, certifiedWorkDoneValue: 1248000, retentionWithheld: 62400, amountPaid: 1060800, status: 'ACTIVE_EXECUTION' },
  { id: 'WO-V253-03', woNumber: 'SCWO-2026-V253-03', contractorName: 'Deccan MEP & Automation (Thane)', trade: 'ELECTRICAL_AUTOMATION', agreedLabourRatePerUnit: 'Electrical point ₹660/point, KNX programming ₹68,000 lump sum', contractValue: 620000, certifiedWorkDoneValue: 618000, retentionWithheld: 30900, amountPaid: 587100, status: 'ACTIVE_EXECUTION' },
  { id: 'WO-V253-04', woNumber: 'SCWO-2026-V253-04', contractorName: 'Konkan Stone & Tile Laying (Khopoli)', trade: 'FLOORING_TILING', agreedLabourRatePerUnit: 'Marble laying ₹96/sq.ft, tile laying ₹46/sq.ft, deck ₹88/sq.ft', contractValue: 780000, certifiedWorkDoneValue: 782000, retentionWithheld: 39100, amountPaid: 703800, status: 'ACTIVE_EXECUTION' },
  { id: 'WO-V253-05', woNumber: 'SCWO-2026-V253-05', contractorName: 'Shree Ganesh Fabrication & Pergola (Neral)', trade: 'LANDSCAPING_OUTDOORS', agreedLabourRatePerUnit: 'MS frame ₹168/kg, teak pergola ₹268/sq.ft', contractValue: 460000, certifiedWorkDoneValue: 418000, retentionWithheld: 20900, amountPaid: 376200, status: 'ACTIVE_EXECUTION' }
];

export interface VillaMbEntry {
  id: string;
  projectId: string;
  mbNumber: string;
  workOrderId: string;
  contractorName: string;
  itemCode: string;
  trade: TradeCategory;
  description: string;
  locationRoom: string;
  measurementFormula: string;
  unit: 'sq.ft' | 'r.ft' | 'nos' | 'lump sum';
  contractRate: number;
  previousQuantity: number;
  currentQuantity: number;
  cumulativeQuantity: number;
  totalCertifiedAmount: number;
  cumulativeCertifiedAmount: number;
  siteEngineerVerification: boolean;
  siteEngineerName: string;
  consultantApproval: boolean;
  consultantName: string;
  certifiedDate: string;
  status: 'DRAFT_ENTRY' | 'ENGINEER_VERIFIED' | 'APPROVED_FOR_BILLING' | 'DISPUTED';
  notes: string;
}

const mb = (
  n: number,
  o: Omit<VillaMbEntry, 'id' | 'projectId' | 'mbNumber' | 'totalCertifiedAmount' | 'cumulativeCertifiedAmount' | 'cumulativeQuantity'> & { previousQuantity: number }
): VillaMbEntry => {
  const totalCertifiedAmount = Math.round(o.currentQuantity * o.contractRate);
  return {
    ...o,
    id: `MB-V253-${String(n).padStart(3, '0')}`,
    projectId: VILLA253.projectId,
    mbNumber: `MB-V253-PAGE-${n}`,
    cumulativeQuantity: o.previousQuantity + o.currentQuantity,
    totalCertifiedAmount,
    cumulativeCertifiedAmount: Math.round((o.previousQuantity + o.currentQuantity) * o.contractRate)
  };
};

export const VILLA253_MB_ENTRIES: VillaMbEntry[] = [
  mb(12, {
    workOrderId: 'WO-V253-01',
    contractorName: 'Sahyadri Civil Works (Karjat)',
    itemCode: 'CIV-01',
    trade: 'CIVIL_MASONRY',
    description: 'Blockwork infill and plaster making good at joinery recesses in the great room and master walk-in.',
    locationRoom: 'Living & Dining Great Room + Master Walk-in',
    measurementFormula: 'Great room recesses 42.5 ft x 9.0 ft = 382.5 sq.ft; walk-in 28 ft x 9.2 ft = 257.6 sq.ft; total 640.1 sq.ft',
    unit: 'sq.ft' as const,
    contractRate: 78,
    previousQuantity: 0,
    currentQuantity: 640.1,
    siteEngineerVerification: true,
    siteEngineerName: 'Site Eng. Rajesh Sharma',
    consultantApproval: true,
    consultantName: 'PMC Consultant K. N. Rao',
    certifiedDate: '2026-08-08',
    status: 'APPROVED_FOR_BILLING',
    notes: 'Joint measurement with disto meter; plaster checked with 2m straight edge, tolerance within 3mm.'
  }),
  mb(13, {
    workOrderId: 'WO-V253-01',
    contractorName: 'Sahyadri Civil Works (Karjat)',
    itemCode: 'WTR-01',
    trade: 'WATERPROOFING',
    description: 'Dr. Fixit Fastflex two-coat waterproofing with 72-hour ponding in Toilet 1, Toilet 2 and Toilet 3.',
    locationRoom: 'Toilet 1, Toilet 2, Toilet 3',
    measurementFormula: 'Floors: 148.5 + 99.9 + 89.5 = 337.9 sq.ft; dado 7ft: 702 sq.ft; total 1,039.9 sq.ft',
    unit: 'sq.ft' as const,
    contractRate: 32,
    previousQuantity: 0,
    currentQuantity: 1039.9,
    siteEngineerVerification: true,
    siteEngineerName: 'Site Eng. Rajesh Sharma',
    consultantApproval: true,
    consultantName: 'PMC Consultant K. N. Rao',
    certifiedDate: '2026-08-19',
    status: 'APPROVED_FOR_BILLING',
    notes: '72-hour ponding certified on 18-08-2026; ground floor ceiling below all three toilets dry.'
  }),
  mb(14, {
    workOrderId: 'WO-V253-01',
    contractorName: 'Sahyadri Civil Works (Karjat)',
    itemCode: 'WTR-01',
    trade: 'WATERPROOFING',
    description: 'Waterproofing in powder room, utility and kitchen wet zone with fillet casting.',
    locationRoom: 'Powder Room, Utility, Kitchen',
    measurementFormula: 'Powder 48.3 + Utility 87 = 135.3 sq.ft floor; kitchen wet zone 42 sq.ft; dado 7ft: 436 sq.ft; total 613.3 sq.ft',
    unit: 'sq.ft' as const,
    contractRate: 32,
    previousQuantity: 1039.9,
    currentQuantity: 613.3,
    siteEngineerVerification: true,
    siteEngineerName: 'Site Eng. Rajesh Sharma',
    consultantApproval: false,
    consultantName: 'PMC Consultant K. N. Rao',
    certifiedDate: '2026-11-04',
    status: 'ENGINEER_VERIFIED',
    notes: 'Ponding test completed 03-11-2026. Consultant approval pending site visit on 14-11-2026.'
  }),
  mb(15, {
    workOrderId: 'WO-V253-02',
    contractorName: 'Mistry Joinery Works (Panvel)',
    itemCode: 'WRD-01',
    trade: 'WARDROBES_STORAGE',
    description: 'Wardrobe and walk-in carcass fabrication and installation in BWP 710 with Hettich soft-close hardware.',
    locationRoom: 'Master Walk-in, Bedroom 2 Wardrobe, Bedroom 3 Wardrobe',
    measurementFormula: 'Master walk-in 119.6 + Bed2 74.9 + Bed3 48 = 242.5 sq.ft of elevation',
    unit: 'sq.ft' as const,
    contractRate: 242,
    previousQuantity: 0,
    currentQuantity: 242.5,
    siteEngineerVerification: true,
    siteEngineerName: 'Site Eng. Rajesh Sharma',
    consultantApproval: true,
    consultantName: 'PMC Consultant K. N. Rao',
    certifiedDate: '2026-10-18',
    status: 'APPROVED_FOR_BILLING',
    notes: 'Plumb and diagonal verified with laser level; shutter gaps 2.5mm uniform. Hardware boxes logged serially.'
  }),
  mb(16, {
    workOrderId: 'WO-V253-02',
    contractorName: 'Mistry Joinery Works (Panvel)',
    itemCode: 'KIT-01',
    trade: 'MODULAR_KITCHEN',
    description: 'Modular kitchen base, wall and tall unit installation with quartz counter template.',
    locationRoom: 'Culinary Kitchen, Utility & Powder Wing',
    measurementFormula: 'Base run 14.5 ft + return 9.0 ft + tall unit 2.5 ft = 26 running feet',
    unit: 'r.ft',
    contractRate: 1180,
    previousQuantity: 0,
    currentQuantity: 26,
    siteEngineerVerification: true,
    siteEngineerName: 'Site Eng. Rajesh Sharma',
    consultantApproval: true,
    consultantName: 'PMC Consultant K. N. Rao',
    certifiedDate: '2026-10-26',
    status: 'APPROVED_FOR_BILLING',
    notes: 'Countertop template taken 24-10-2026 after carcass levelling; appliance cut-outs confirmed with client.'
  }),
  mb(17, {
    workOrderId: 'WO-V253-02',
    contractorName: 'Mistry Joinery Works (Panvel)',
    itemCode: 'JNR-01',
    trade: 'CARPENTRY_JOINERY',
    description: 'Great room TV console, fluted veneer panelling and crockery unit installation.',
    locationRoom: 'Living & Dining Great Room',
    measurementFormula: 'TV console 9.0 ft + crockery 7.0 ft + display shelf 2.0 ft = 18 running feet',
    unit: 'r.ft',
    contractRate: 940,
    previousQuantity: 0,
    currentQuantity: 18,
    siteEngineerVerification: true,
    siteEngineerName: 'Site Eng. Rajesh Sharma',
    consultantApproval: false,
    consultantName: 'PMC Consultant K. N. Rao',
    certifiedDate: '2026-11-06',
    status: 'ENGINEER_VERIFIED',
    notes: 'Fluting alignment checked against INT-201 Rev C; LED profile chase handed to electrical contractor.'
  }),
  mb(18, {
    workOrderId: 'WO-V253-04',
    contractorName: 'Konkan Stone & Tile Laying (Khopoli)',
    itemCode: 'FLR-01',
    trade: 'FLOORING_TILING',
    description: 'Botticino marble laying in great room, staircase core and powder room with skirting and crystallisation.',
    locationRoom: 'Living & Dining Great Room, Staircase Core, Powder Room',
    measurementFormula: 'Living 481 + Stair 142.5 + Powder 48.3 = 671.8 sq.ft + skirting 67 r.ft',
    unit: 'sq.ft' as const,
    contractRate: 96,
    previousQuantity: 0,
    currentQuantity: 671.8,
    siteEngineerVerification: true,
    siteEngineerName: 'Site Eng. Rajesh Sharma',
    consultantApproval: true,
    consultantName: 'PMC Consultant K. N. Rao',
    certifiedDate: '2026-10-30',
    status: 'APPROVED_FOR_BILLING',
    notes: 'Lippage under 0.5mm; crystallisation completed 29-10-2026 and covered with protective sheeting.'
  }),
  mb(19, {
    workOrderId: 'WO-V253-04',
    contractorName: 'Konkan Stone & Tile Laying (Khopoli)',
    itemCode: 'FLR-02',
    trade: 'FLOORING_TILING',
    description: 'Engineered oak flooring in all three bedrooms over acoustic underlay with matching skirting.',
    locationRoom: 'Master Bedroom 1, Bedroom 2, Bedroom 3',
    measurementFormula: 'Bed1 266 + Bed2 359 + Bed3 393 = 1,018 sq.ft',
    unit: 'sq.ft' as const,
    contractRate: 72,
    previousQuantity: 0,
    currentQuantity: 1018,
    siteEngineerVerification: true,
    siteEngineerName: 'Site Eng. Rajesh Sharma',
    consultantApproval: false,
    consultantName: 'PMC Consultant K. N. Rao',
    certifiedDate: '2026-11-09',
    status: 'ENGINEER_VERIFIED',
    notes: 'Sub-floor moisture 9.2% before laying. Bedroom 3 completed; thresholds and skirting in progress.'
  }),
  mb(20, {
    workOrderId: 'WO-V253-05',
    contractorName: 'Shree Ganesh Fabrication & Pergola (Neral)',
    itemCode: 'EXT-01',
    trade: 'LANDSCAPING_OUTDOORS',
    description: 'MS structural frame with teak-clad columns for the roof gazebo and terrace membrane waterproofing.',
    locationRoom: 'Signature Roof Gazebo Pavilion',
    measurementFormula: 'Gazebo 24 ft x 18 ft = 432 sq.ft of plan area',
    unit: 'sq.ft' as const,
    contractRate: 268,
    previousQuantity: 0,
    currentQuantity: 432,
    siteEngineerVerification: true,
    siteEngineerName: 'Site Eng. Rajesh Sharma',
    consultantApproval: false,
    consultantName: 'PMC Consultant K. N. Rao',
    certifiedDate: '2026-11-07',
    status: 'ENGINEER_VERIFIED',
    notes: 'Base plates cast and torqued to 180 Nm. Pergola rafters 112 of 168 fixed; balance teak awaited 22-10 PO balance.'
  })
];

// ---------------------------------------------------------------------------
// MODULE M14 / M13 - DPR AND WBS PROGRAMME
// ---------------------------------------------------------------------------
export interface VillaDpr extends DailyProgressReport {
  milestonePhase: string;
  overallProgressPercent: number;
}

export const VILLA253_DPRS: VillaDpr[] = [
  {
    id: 'DPR-V253-001',
    dprCode: 'DPR-V253-2026-11-10',
    date: '2026-11-10',
    weatherCondition: 'Clear / 32°C, humidity 58% (no rain delay)',
    milestonePhase: 'Phase 5: Flooring, Decks & Painting',
    overallProgressPercent: 68,
    labourCountOnSite: { masons: 2, carpenters: 8, electricians: 3, plumbers: 1, helpers: 7 },
    activitiesExecuted: [
      'Bedroom 3 engineered oak flooring completed - 393 sq.ft laid with acoustic underlay.',
      'Master walk-in wardrobe shutters hung and aligned; 6 of 8 shutters fitted.',
      'Great room wall putty second coat completed on north and east walls (SD1 side).',
      'Gazebo pergola rafters - 18 additional rafters fixed (total 112 of 168).',
      'KNX keypad back-boxes fixed in living, kitchen and Bedroom 2 (14 points).'
    ],
    plannedTomorrow: [
      'Bedroom 1 oak flooring and skirting.',
      'Marble skirting polishing in the staircase core.',
      'PU polish first coat on great room crockery unit shutters.',
      'Balance teak rafters follow-up with Burma Teak House.'
    ],
    issuesDelays: [
      'Balance 56 teak rafters still pending from vendor - gazebo closure risk of 4 days against the 18-12 handover date.',
      'Community water supply cut 11:00-14:00, tiling work shifted to joinery.'
    ],
    sitePhotographs: [
      { caption: 'Bedroom 3 oak flooring completed with skirting line', stage: 'Flooring', time: '10:15 AM' },
      { caption: 'Gazebo rafters at 600mm centres to Section BB\'', stage: 'Gazebo', time: '03:20 PM' }
    ],
    pettyExpensesToday: 3850,
    siteEngineer: 'Site Eng. Rajesh Sharma'
  },
  {
    id: 'DPR-V253-002',
    dprCode: 'DPR-V253-2026-11-09',
    date: '2026-11-09',
    weatherCondition: 'Clear / 33°C',
    milestonePhase: 'Phase 5: Flooring, Decks & Painting',
    overallProgressPercent: 66,
    labourCountOnSite: { masons: 2, carpenters: 9, electricians: 2, plumbers: 1, helpers: 6 },
    activitiesExecuted: [
      'Master bedroom oak flooring started - 148 sq.ft laid.',
      'Ipe deck laying on front deck completed (543 sq.ft) with concealed fixings.',
      'Waterproofing ponding test started in utility and kitchen wet zone.',
      'Marble crystallisation in powder room completed.'
    ],
    plannedTomorrow: [
      'Complete Bedroom 3 flooring and start Bedroom 1.',
      'Wardrobe shutter alignment in master walk-in.',
      'Putty second coat in great room.'
    ],
    issuesDelays: ['Ipe plank batch showed 3 warped planks - replaced from site stock, no cost impact.'],
    sitePhotographs: [
      { caption: 'Front deck Ipe hardwood completed', stage: 'Decks', time: '01:40 PM' }
    ],
    pettyExpensesToday: 2100,
    siteEngineer: 'Site Eng. Rajesh Sharma'
  },
  {
    id: 'DPR-V253-003',
    dprCode: 'DPR-V253-2026-11-07',
    date: '2026-11-07',
    weatherCondition: 'Partly cloudy / 30°C, light drizzle after 5 PM',
    milestonePhase: 'Phase 5: Flooring, Decks & Painting',
    overallProgressPercent: 64,
    labourCountOnSite: { masons: 3, carpenters: 7, electricians: 3, plumbers: 2, helpers: 8 },
    activitiesExecuted: [
      'Gazebo MS base plates torqued and teak column cladding completed (4 columns).',
      'Bar unit carcass installed at Bedroom 2 bar deck.',
      'Marble laying in staircase core landing completed.',
      'KNX CAT6A termination at the main DB completed and continuity tested.'
    ],
    plannedTomorrow: [
      'Start front deck Ipe laying.',
      'Master bedroom flooring.',
      'Utility ponding test filling.'
    ],
    issuesDelays: ['Drizzle after 5 PM - external deck work stopped 30 minutes early; no programme impact.'],
    sitePhotographs: [
      { caption: 'Gazebo base plates and teak column cladding', stage: 'Gazebo', time: '11:50 AM' },
      { caption: 'Bar unit carcass at Bedroom 2 deck', stage: 'Joinery', time: '04:10 PM' }
    ],
    pettyExpensesToday: 6400,
    siteEngineer: 'Site Eng. Rajesh Sharma'
  },
  {
    id: 'DPR-V253-004',
    dprCode: 'DPR-V253-2026-11-04',
    date: '2026-11-04',
    weatherCondition: 'Clear / 34°C',
    milestonePhase: 'Phase 4: Joinery, Kitchen & Ceilings',
    overallProgressPercent: 61,
    labourCountOnSite: { masons: 3, carpenters: 10, electricians: 3, plumbers: 2, helpers: 9 },
    activitiesExecuted: [
      'Modular kitchen carcass and tall unit installation completed (26 r.ft).',
      'Great room false ceiling cove lighting profile fixed and tested.',
      'Waterproofing completed in powder room and utility; ponding started.',
      'Bedroom 2 wardrobe shutters installed with Hettich soft-close.'
    ],
    plannedTomorrow: ['Quartz counter template for kitchen.', 'Begin marble crystallisation in powder room.'],
    issuesDelays: ['Quartz slab shade variation noted - one slab held back, replacement requested from Silestone dealer.'],
    sitePhotographs: [
      { caption: 'Kitchen carcass with tall unit', stage: 'Kitchen', time: '12:30 PM' },
      { caption: 'Cove profile test in great room', stage: 'Ceilings', time: '05:00 PM' }
    ],
    pettyExpensesToday: 4200,
    siteEngineer: 'Site Eng. Rajesh Sharma'
  },
  {
    id: 'DPR-V253-005',
    dprCode: 'DPR-V253-2026-10-30',
    date: '2026-10-30',
    weatherCondition: 'Clear / 31°C',
    milestonePhase: 'Phase 4: Joinery, Kitchen & Ceilings',
    overallProgressPercent: 56,
    labourCountOnSite: { masons: 4, carpenters: 9, electricians: 4, plumbers: 2, helpers: 10 },
    activitiesExecuted: [
      'Marble laying completed in great room and powder room (671.8 sq.ft) - crystallisation done.',
      'Gypsum false ceiling completed in all bedrooms and kitchen.',
      'VRF indoor units commissioned in living and Bedroom 1.',
      'Wardrobe carcasses completed in all three bedrooms.'
    ],
    plannedTomorrow: ['Kitchen carcass installation.', 'Deck sub-frame for front deck.'],
    issuesDelays: ['Marble cutting reserve short by 6 sq.ft - managed from dry-lay held-back slabs.'],
    sitePhotographs: [
      { caption: 'Marble crystallisation in great room', stage: 'Flooring', time: '02:15 PM' },
      { caption: 'VRF commissioning readings', stage: 'HVAC', time: '04:45 PM' }
    ],
    pettyExpensesToday: 5150,
    siteEngineer: 'Site Eng. Rajesh Sharma'
  }
];

export interface VillaWbsTask {
  id: string;
  wbsCode: string;
  taskTitle: string;
  trade: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  completionPercent: number;
  criticalPath: boolean;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' | 'DELAYED';
  varianceDays: number;
}

export const VILLA253_WBS: VillaWbsTask[] = [
  { id: 'WBS-V253-01', wbsCode: '1.0', taskTitle: 'Site handover, mobilisation and shell survey', trade: 'Civil', durationDays: 7, startDate: '2026-07-06', endDate: '2026-07-13', completionPercent: 100, criticalPath: true, status: 'COMPLETED', varianceDays: 0 },
  { id: 'WBS-V253-02', wbsCode: '2.0', taskTitle: 'Civil making good, blockwork and levelling screed', trade: 'Civil', durationDays: 24, startDate: '2026-07-14', endDate: '2026-08-07', completionPercent: 100, criticalPath: true, status: 'COMPLETED', varianceDays: 1 },
  { id: 'WBS-V253-03', wbsCode: '3.0', taskTitle: 'Wet area waterproofing and 72-hour ponding (Toilets 1-3)', trade: 'Waterproofing', durationDays: 14, startDate: '2026-08-05', endDate: '2026-08-19', completionPercent: 100, criticalPath: true, status: 'COMPLETED', varianceDays: 0 },
  { id: 'WBS-V253-04', wbsCode: '4.0', taskTitle: 'Concealed plumbing, electrical conduits and KNX cabling', trade: 'MEP', durationDays: 30, startDate: '2026-08-10', endDate: '2026-09-09', completionPercent: 100, criticalPath: true, status: 'COMPLETED', varianceDays: 2 },
  { id: 'WBS-V253-05', wbsCode: '5.0', taskTitle: 'Gypsum false ceilings with cove and access panels', trade: 'Ceilings', durationDays: 26, startDate: '2026-09-01', endDate: '2026-09-27', completionPercent: 100, criticalPath: false, status: 'COMPLETED', varianceDays: 0 },
  { id: 'WBS-V253-06', wbsCode: '6.0', taskTitle: 'Wardrobe, walk-in and kitchen carcass fabrication', trade: 'Joinery', durationDays: 40, startDate: '2026-09-18', endDate: '2026-10-28', completionPercent: 100, criticalPath: true, status: 'COMPLETED', varianceDays: 3 },
  { id: 'WBS-V253-07', wbsCode: '7.0', taskTitle: 'Marble, tile and engineered wood flooring', trade: 'Flooring', durationDays: 34, startDate: '2026-10-03', endDate: '2026-11-06', completionPercent: 82, criticalPath: true, status: 'IN_PROGRESS', varianceDays: 2 },
  { id: 'WBS-V253-08', wbsCode: '8.0', taskTitle: 'Wardrobe shutters, kitchen counter and hardware', trade: 'Joinery', durationDays: 22, startDate: '2026-10-20', endDate: '2026-11-11', completionPercent: 74, criticalPath: true, status: 'IN_PROGRESS', varianceDays: 2 },
  { id: 'WBS-V253-09', wbsCode: '9.0', taskTitle: 'Roof gazebo MS frame, teak pergola and terrace membrane', trade: 'Gazebo', durationDays: 34, startDate: '2026-10-08', endDate: '2026-11-11', completionPercent: 66, criticalPath: true, status: 'DELAYED', varianceDays: 4 },
  { id: 'WBS-V253-10', wbsCode: '10.0', taskTitle: 'Decks, balconies and landscape hardscape', trade: 'Landscape', durationDays: 26, startDate: '2026-10-20', endDate: '2026-11-15', completionPercent: 58, criticalPath: false, status: 'IN_PROGRESS', varianceDays: 0 },
  { id: 'WBS-V253-11', wbsCode: '11.0', taskTitle: 'Painting, PU polish and lighting installation', trade: 'Finishes', durationDays: 30, startDate: '2026-10-26', endDate: '2026-11-25', completionPercent: 46, criticalPath: true, status: 'IN_PROGRESS', varianceDays: 0 },
  { id: 'WBS-V253-12', wbsCode: '12.0', taskTitle: 'Snagging, deep cleaning, client walkthrough and handover', trade: 'Handover', durationDays: 22, startDate: '2026-11-27', endDate: '2026-12-18', completionPercent: 0, criticalPath: true, status: 'UPCOMING', varianceDays: 0 }
];

// ---------------------------------------------------------------------------
// MODULE M18 / M24 - QUALITY NCR, PERMIT TO WORK AND TESTS
// ---------------------------------------------------------------------------
export const VILLA253_NCRS: QualityNCRRecord[] = [
  {
    id: 'NCR-V253-01',
    projectId: VILLA253.projectId,
    ncrCode: 'NCR-2026-V253-004',
    dateRaised: '2026-08-12',
    roomZone: 'Master Walk-in Wardrobe',
    trade: 'CIVIL_MASONRY',
    severity: 'MINOR',
    description: 'Plaster at the wardrobe recess was out of plumb by 9mm over 2.4m, which would have forced a 12mm packing shim behind the carcass.',
    rootCause: 'Junior mason worked the recess corner without the 2m straight edge template.',
    correctiveActionPlan: 'Chop back 900mm band, re-plaster with 1:4 mortar and recheck with 2m straight edge to 3mm tolerance.',
    assignedContractorOrTeam: 'Sahyadri Civil Works (Karjat)',
    reworkCostINR: 6800,
    targetClosureDate: '2026-08-16',
    closureDate: '2026-08-15',
    status: 'CLOSED_VERIFIED',
    inspectedBy: 'QA Eng. K. R. Nair'
  },
  {
    id: 'NCR-V253-02',
    projectId: VILLA253.projectId,
    ncrCode: 'NCR-2026-V253-005',
    dateRaised: '2026-08-17',
    roomZone: 'Toilet 2 (Bedroom 2)',
    trade: 'WATERPROOFING',
    severity: 'MAJOR',
    description: 'Corner fillet radius measured 32mm instead of the specified 50mm before the second Fastflex coat in Toilet 2.',
    rootCause: 'Fillet gauge template not used; mason hurried the screed fillet before the coat.',
    correctiveActionPlan: 'Grind back the fillet, recast 50mm polymer-modified chamfer, reapply Fastflex with fibreglass mesh and repeat the 72-hour ponding test.',
    assignedContractorOrTeam: 'Sahyadri Civil Works (Karjat)',
    reworkCostINR: 9400,
    targetClosureDate: '2026-08-24',
    closureDate: '2026-08-23',
    status: 'CLOSED_VERIFIED',
    inspectedBy: 'QA Eng. K. R. Nair'
  },
  {
    id: 'NCR-V253-03',
    projectId: VILLA253.projectId,
    ncrCode: 'NCR-2026-V253-009',
    dateRaised: '2026-10-16',
    roomZone: 'Signature Roof Gazebo Pavilion',
    trade: 'LANDSCAPING_OUTDOORS',
    severity: 'MAJOR',
    description: 'Two MS base plates were installed 12mm off the setting-out grid from V253-STR-501, which would have skewed the pergola ridge line.',
    rootCause: 'Setting-out done from the parapet instead of the cast-in anchor grid.',
    correctiveActionPlan: 'Ream anchor holes, reposition plates on the grid, torque to 180 Nm and re-verify the ridge line with a laser level before rafter fixing.',
    assignedContractorOrTeam: 'Shree Ganesh Fabrication & Pergola (Neral)',
    reworkCostINR: 18500,
    targetClosureDate: '2026-10-22',
    closureDate: '2026-10-21',
    status: 'CLOSED_VERIFIED',
    inspectedBy: 'Eng. K. N. Rao (Structural)'
  },
  {
    id: 'NCR-V253-04',
    projectId: VILLA253.projectId,
    ncrCode: 'NCR-2026-V253-011',
    dateRaised: '2026-11-06',
    roomZone: 'Culinary Kitchen, Utility & Powder Wing',
    trade: 'MODULAR_KITCHEN',
    severity: 'MINOR',
    description: 'Two kitchen shutter gaps measured 4mm against the specified 2.5mm on the tall unit side.',
    rootCause: 'Hinge plates left at factory default setting during installation.',
    correctiveActionPlan: 'Adjust hinge plates, recheck all 26 r.ft shutter gaps and re-sign the kitchen handover checklist.',
    assignedContractorOrTeam: 'Mistry Joinery Works (Panvel)',
    reworkCostINR: 3200,
    targetClosureDate: '2026-11-13',
    status: 'IN_PROGRESS',
    inspectedBy: 'QA Eng. K. R. Nair'
  }
];

export const VILLA253_PTWS: SafetyPermitToWork[] = [
  {
    id: 'PTW-V253-01',
    projectId: VILLA253.projectId,
    ptwNumber: 'PTW-2026-V253-021',
    permitType: 'WORKING_AT_HEIGHT',
    locationArea: 'Roof Gazebo Pavilion - pergola rafter fixing at 12\'-9" ridge',
    contractorOrCrew: 'Shree Ganesh Fabrication & Pergola (6 persons)',
    hazardsIdentified: ['Fall from roof terrace edge (no parapet on north side)', 'Manual handling of 8ft teak rafters', 'Material drop onto front deck below'],
    mandatoryPrecautions: ['Full-body harness with double lanyard to independent lifeline', 'Edge protection scaffolding on north side', 'Barricade and signboard on front deck below', 'Rafters lifted by rope, never thrown'],
    ppeEquipmentsVerified: ['Full Body Harness', 'Chin-strap Helmet', 'Non-slip Safety Boots', 'Safety Goggles'],
    issuedByOfficer: 'Safety Officer Arun Pillai',
    receivedBySupervisor: 'Foreman Vikas Jadhav',
    validFrom: '2026-11-10 09:00',
    validUntil: '2026-11-10 18:00',
    emergencyContact: '+91 98200 99112',
    status: 'CLOSED'
  },
  {
    id: 'PTW-V253-02',
    projectId: VILLA253.projectId,
    ptwNumber: 'PTW-2026-V253-022',
    permitType: 'HOT_WORK',
    locationArea: 'Roof Gazebo - MS base plate welding and grinding',
    contractorOrCrew: 'Shree Ganesh Fabrication & Pergola (3 persons)',
    hazardsIdentified: ['Spark ignition of stored teak off-cuts', 'Hot slag falling to first-floor balcony', 'Fumes in a semi-enclosed terrace'],
    mandatoryPrecautions: ['10kg ABC extinguisher at the work face', 'Fire blanket over teak stock', 'Fire watch for 60 minutes after last weld', 'Forced ventilation fan'],
    ppeEquipmentsVerified: ['Welding Helmet', 'Leather Apron', 'Insulated Gloves', 'Safety Goggles'],
    issuedByOfficer: 'Safety Officer Arun Pillai',
    receivedBySupervisor: 'Foreman Vikas Jadhav',
    validFrom: '2026-11-11 09:00',
    validUntil: '2026-11-11 17:00',
    emergencyContact: '+91 98200 99112',
    status: 'ACTIVE_PERMIT'
  },
  {
    id: 'PTW-V253-03',
    projectId: VILLA253.projectId,
    ptwNumber: 'PTW-2026-V253-023',
    permitType: 'ELECTRICAL_ISOLATION',
    locationArea: 'Main DB and KNX panel - Bedroom 2 wall',
    contractorOrCrew: 'Deccan MEP & Automation (4 persons)',
    hazardsIdentified: ['Live 3-phase supply from developer meter', 'Arc flash while terminating the KNX actuator', 'Backfeed from the VRF outdoor unit'],
    mandatoryPrecautions: ['Isolate and lock the developer meter with a padlock and tag', 'Test for dead with a calibrated multimeter', 'Second person at the DB during termination'],
    ppeEquipmentsVerified: ['Insulated Gloves (1000V)', 'Arc-rated Face Shield', 'Safety Boots', 'Helmet'],
    issuedByOfficer: 'Safety Officer Arun Pillai',
    receivedBySupervisor: 'Supervisor Imran Siddiqui',
    validFrom: '2026-11-12 10:00',
    validUntil: '2026-11-12 14:00',
    emergencyContact: '+91 98200 99112',
    status: 'ACTIVE_PERMIT'
  },
  {
    id: 'PTW-V253-04',
    projectId: VILLA253.projectId,
    ptwNumber: 'PTW-2026-V253-019',
    permitType: 'WORKING_AT_HEIGHT',
    locationArea: 'Double-height staircase core - W2 / W2A glazing and pendant fixing',
    contractorOrCrew: 'Konkan Stone & Tile Laying (2 persons) + electrical (2 persons)',
    hazardsIdentified: ['Fall into the 21-riser stair void', 'Fragile glass W2 during work', 'Dropped tools onto the flight below'],
    mandatoryPrecautions: ['Scaffold tower with guardrail across the void', 'Tool lanyards on all power tools', 'No work while others use the staircase'],
    ppeEquipmentsVerified: ['Full Body Harness', 'Helmet', 'Safety Boots'],
    issuedByOfficer: 'Safety Officer Arun Pillai',
    receivedBySupervisor: 'Supervisor Suresh Bhandari',
    validFrom: '2026-10-27 09:00',
    validUntil: '2026-10-27 18:00',
    emergencyContact: '+91 98200 99112',
    status: 'EXPIRED'
  }
];

export interface VillaMaterialTest {
  id: string;
  testCode: string;
  testType: 'CONCRETE_CUBE_TEST' | 'MOISTURE_METER' | 'WATERPROOFING_PONDING' | 'WOOD_SEASONING_CHECK';
  componentTested: string;
  sampleDate: string;
  testDate: string;
  labAgency: string;
  requiredValue: string;
  obtainedValue: string;
  status: 'PASSED' | 'FAILED' | 'CONDITIONALLY_PASSED';
  remarks: string;
}

export const VILLA253_TESTS: VillaMaterialTest[] = [
  {
    id: 'TR-V253-01',
    testCode: 'TEST-V253-WTR-01',
    testType: 'WATERPROOFING_PONDING',
    componentTested: 'Toilet 1, Toilet 2 and Toilet 3 sunken slabs - 72-hour ponding',
    sampleDate: '2026-08-15',
    testDate: '2026-08-18',
    labAgency: 'On-site joint certification with PMC Consultant K. N. Rao',
    requiredValue: 'Zero water loss over 72 hours excluding evaporation',
    obtainedValue: '0 mm loss; ground floor ceiling below all three toilets dry',
    status: 'PASSED',
    remarks: 'Thermal scan of the ceiling below showed no damp patches. Certificate signed by client representative Mrs. Sneha Kulkarni.'
  },
  {
    id: 'TR-V253-02',
    testCode: 'TEST-V253-WTR-02',
    testType: 'WATERPROOFING_PONDING',
    componentTested: 'Powder room, utility and kitchen wet zone - 72-hour ponding',
    sampleDate: '2026-11-01',
    testDate: '2026-11-04',
    labAgency: 'On-site joint certification with Site Eng. Rajesh Sharma',
    requiredValue: 'Zero water loss over 72 hours excluding evaporation',
    obtainedValue: '0 mm loss; no seepage at the utility wall base',
    status: 'PASSED',
    remarks: 'PMC consultant physical verification scheduled 14-11-2026 before the billing certificate is issued.'
  },
  {
    id: 'TR-V253-03',
    testCode: 'TEST-V253-PLY-01',
    testType: 'WOOD_SEASONING_CHECK',
    componentTested: 'CenturyPly BWP 710 18mm batch PLY/2026/0912 (62 accepted sheets)',
    sampleDate: '2026-09-16',
    testDate: '2026-09-16',
    labAgency: 'Delmhorst J-2000 pin moisture meter (site QA)',
    requiredValue: 'Moisture content below 12%',
    obtainedValue: '8.6% average across 10 readings',
    status: 'PASSED',
    remarks: 'Sheets stacked on battens in the dry store; rechecked 12-10-2026 at 9.1%.'
  },
  {
    id: 'TR-V253-04',
    testCode: 'TEST-V253-TEAK-01',
    testType: 'WOOD_SEASONING_CHECK',
    componentTested: 'Burma Teak rafters 4"x6" - first delivery of 112 nos',
    sampleDate: '2026-10-10',
    testDate: '2026-10-10',
    labAgency: 'Delmhorst J-2000 pin moisture meter (site QA)',
    requiredValue: 'Moisture content below 12% for external pergola use',
    obtainedValue: '9.8% average; 2 rafters at 13.4%',
    status: 'CONDITIONALLY_PASSED',
    remarks: '2 high-moisture rafters segregated and returned. Accepted stock stored under cover on the roof rack.'
  },
  {
    id: 'TR-V253-05',
    testCode: 'TEST-V253-MAR-01',
    testType: 'MOISTURE_METER',
    componentTested: 'Great room screed before Botticino marble laying',
    sampleDate: '2026-10-02',
    testDate: '2026-10-02',
    labAgency: 'Protimeter Surveymaster (site QA)',
    requiredValue: 'Substrate moisture below 4% before stone fixing',
    obtainedValue: '3.1% at 12 grid points',
    status: 'PASSED',
    remarks: 'Marble fixing released only after this reading; dry-lay approved by client on 03-10-2026.'
  }
];

// ---------------------------------------------------------------------------
// MODULE M19 / M20 - SNAGS AND WARRANTY (handover stage)
// ---------------------------------------------------------------------------
export interface VillaSnag {
  id: string;
  snagNumber: string;
  roomLocation: string;
  trade: string;
  description: string;
  severity: 'COSMETIC' | 'FUNCTIONAL' | 'SAFETY_CRITICAL';
  assignedContractor: string;
  dateLogged: string;
  targetResolutionDate: string;
  status: 'OPEN' | 'RECTIFIED' | 'CLIENT_ACCEPTED';
  clientSignOff: boolean;
}

export const VILLA253_SNAGS: VillaSnag[] = [
  { id: 'SNAG-V253-01', snagNumber: 'SNAG-V253-01', roomLocation: 'Master Walk-in Wardrobe', trade: 'Carpentry & Hardware', description: 'Top-left shutter of the walk-in rubs against the loft frame at closing.', severity: 'FUNCTIONAL', assignedContractor: 'Mistry Joinery Works (Panvel)', dateLogged: '2026-11-08', targetResolutionDate: '2026-11-13', status: 'RECTIFIED', clientSignOff: true },
  { id: 'SNAG-V253-02', snagNumber: 'SNAG-V253-02', roomLocation: 'Toilet 2 (Bedroom 2)', trade: 'Plumbing & Sanitary', description: 'Thermostatic diverter in Toilet 2 needs a half-turn extra to reach the rain-shower position.', severity: 'FUNCTIONAL', assignedContractor: 'Deccan MEP & Automation (Thane)', dateLogged: '2026-11-09', targetResolutionDate: '2026-11-14', status: 'OPEN', clientSignOff: false },
  { id: 'SNAG-V253-03', snagNumber: 'SNAG-V253-03', roomLocation: 'Living & Dining Great Room', trade: 'Painting & Polish', description: 'Two hairline paint marks on the north wall near the SD1 portal after curtain-rod drilling by the client vendor.', severity: 'COSMETIC', assignedContractor: 'Build Storys In-house Finishing', dateLogged: '2026-11-09', targetResolutionDate: '2026-11-15', status: 'OPEN', clientSignOff: false },
  { id: 'SNAG-V253-04', snagNumber: 'SNAG-V253-04', roomLocation: 'Culinary Kitchen, Utility & Powder Wing', trade: 'Modular Kitchen', description: 'Tall unit shutter gaps at 4mm instead of 2.5mm on the utility side.', severity: 'COSMETIC', assignedContractor: 'Mistry Joinery Works (Panvel)', dateLogged: '2026-11-06', targetResolutionDate: '2026-11-13', status: 'OPEN', clientSignOff: false },
  { id: 'SNAG-V253-05', snagNumber: 'SNAG-V253-05', roomLocation: 'Signature Roof Gazebo Pavilion', trade: 'Gazebo & Fabrication', description: 'One rafter end shows a 2mm gap against the purlin after fixing - visible from the seating zone.', severity: 'COSMETIC', assignedContractor: 'Shree Ganesh Fabrication & Pergola (Neral)', dateLogged: '2026-11-10', targetResolutionDate: '2026-11-20', status: 'OPEN', clientSignOff: false },
  { id: 'SNAG-V253-06', snagNumber: 'SNAG-V253-06', roomLocation: 'Bedroom 3 & Balcony Suite', trade: 'Flooring', description: 'One oak plank in Bedroom 3 near the balcony door sounds hollow underfoot.', severity: 'FUNCTIONAL', assignedContractor: 'Konkan Stone & Tile Laying (Khopoli)', dateLogged: '2026-11-10', targetResolutionDate: '2026-11-18', status: 'OPEN', clientSignOff: false },
  { id: 'SNAG-V253-07', snagNumber: 'SNAG-V253-07', roomLocation: 'Bedroom 2 Bar Deck', trade: 'Joinery', description: 'Bar unit shutter magnet does not hold flush in the closed position.', severity: 'FUNCTIONAL', assignedContractor: 'Mistry Joinery Works (Panvel)', dateLogged: '2026-11-07', targetResolutionDate: '2026-11-12', status: 'RECTIFIED', clientSignOff: false },
  { id: 'SNAG-V253-08', snagNumber: 'SNAG-V253-08', roomLocation: 'Architectural Dogleg Staircase Core', trade: 'Electrical & Automation', description: 'KNX staircase keypad scene 3 does not switch the pendant circuit as programmed.', severity: 'FUNCTIONAL', assignedContractor: 'Deccan MEP & Automation (Thane)', dateLogged: '2026-11-05', targetResolutionDate: '2026-11-12', status: 'RECTIFIED', clientSignOff: true }
];

export const VILLA253_WARRANTY_TICKETS: WarrantyMaintenanceTicket[] = [
  {
    id: 'TKT-V253-01',
    projectId: VILLA253.projectId,
    projectCode: VILLA253.projectCode,
    clientName: VILLA253.clientName,
    ticketNumber: 'DLP-V253-2026-001',
    componentAffected: 'Gazebo pergola - first rafter bay (Section BB\')',
    issueCategory: 'CARPENTRY_HARDWARE',
    complaintDescription: 'Client reported a creaking sound from the first rafter bay during the pre-handover visit on a windy evening.',
    slaTargetHours: 48,
    reportedDate: '2026-11-10',
    assignedTechnician: 'Foreman Vikas Jadhav (Shree Ganesh Fabrication)',
    technicianPhone: '+91 98905 22318',
    resolutionStatus: 'TECHNICIAN_DISPATCHED',
    sparesConsumed: 'Awaiting site inspection - SS 304 bracket set reserved',
    warrantyCovered: true,
    costIncurredINR: 0
  },
  {
    id: 'TKT-V253-02',
    projectId: VILLA253.projectId,
    projectCode: VILLA253.projectCode,
    clientName: VILLA253.clientName,
    ticketNumber: 'DLP-V253-2026-002',
    componentAffected: 'Toilet 3 shower mixer (Jaquar Kubix)',
    issueCategory: 'PLUMBING',
    complaintDescription: 'Hot water takes longer than expected to reach Toilet 3 on the first floor.',
    slaTargetHours: 24,
    reportedDate: '2026-11-09',
    assignedTechnician: 'Supervisor Imran Siddiqui (Deccan MEP)',
    technicianPhone: '+91 99201 88345',
    resolutionStatus: 'RESOLVED_SIGNED_OFF',
    sparesConsumed: 'Circulation pump timer re-set; no spares consumed',
    warrantyCovered: true,
    costIncurredINR: 0,
    clientRating: 5
  },
  {
    id: 'TKT-V253-03',
    projectId: VILLA253.projectId,
    projectCode: VILLA253.projectCode,
    clientName: VILLA253.clientName,
    ticketNumber: 'DLP-V253-2026-003',
    componentAffected: 'Great room KNX scene 2 (evening dim)',
    issueCategory: 'ELECTRICAL',
    complaintDescription: 'Evening dim scene leaves the cove at 40% instead of the programmed 25%.',
    slaTargetHours: 24,
    reportedDate: '2026-11-08',
    assignedTechnician: 'Eng. Farhan Qureshi (MEP)',
    technicianPhone: '+91 98201 55644',
    resolutionStatus: 'RESOLVED_SIGNED_OFF',
    sparesConsumed: 'KNX dimming curve re-parameterised in the ETS project file',
    warrantyCovered: true,
    costIncurredINR: 0,
    clientRating: 4
  }
];

// ---------------------------------------------------------------------------
// Convenience re-export so components import from one place
// ---------------------------------------------------------------------------
export { VILLA253 };
