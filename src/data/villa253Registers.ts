/**
 * Build Storys ERP - VILLA 253 REGISTER SEEDS
 * -------------------------------------------
 * Contracts, variation orders, RA invoices, finance vouchers, client portal
 * requests, the document register and the equipment asset register for
 * PROJ-VILLA-253. Field keys match the OperationalRegister column specs so
 * every register renders without an empty cell.
 */

import { VILLA253 } from './villa253DemoProject';

export type OperationRecord = Record<string, string | number | undefined> & {
  id: string;
  title: string;
  status: string;
  notes?: string;
};

const P = VILLA253.projectId;

// ---------------------------------------------------------------------------
// M11 - CONTRACTS & LEGAL
// ---------------------------------------------------------------------------
const contracts: OperationRecord[] = [
  {
    id: 'CTR-V253-01',
    title: 'Turnkey Interior Execution Contract - Villa 253 (Main Contract)',
    status: 'Approved',
    'Contract number': 'BS/CTR/2026/V253',
    Counterparty: 'Aditya & Sneha Kulkarni',
    'Contract value INR': 9954702,
    'Start date': '2026-07-01',
    'End date': '2026-12-18',
    'Retention percent': 5,
    'Payment terms': '6 milestones - 10/15/25/25/15/10',
    notes: 'Signed at the Andheri studio on 27-06-2026. Liquidated damages ₹5,000/day capped at 5% of contract value. 5-year waterproofing warranty, 12-month DLP.'
  },
  {
    id: 'CTR-V253-02',
    title: 'Subcontract - Civil Making Good & Waterproofing (Sahyadri Civil Works)',
    status: 'Approved',
    'Contract number': 'BS/SC/2026/V253-01',
    Counterparty: 'Sahyadri Civil Works (Karjat)',
    'Contract value INR': 850000,
    'Start date': '2026-07-14',
    'End date': '2026-11-15',
    'Retention percent': 5,
    'Payment terms': 'Monthly against certified measurement book pages',
    notes: 'Back-to-back with the main contract; ponding certification is a precondition for the second running bill.'
  },
  {
    id: 'CTR-V253-03',
    title: 'Subcontract - Joinery, Wardrobes & Modular Kitchen (Mistry Joinery Works)',
    status: 'Approved',
    'Contract number': 'BS/SC/2026/V253-02',
    Counterparty: 'Mistry Joinery Works (Panvel)',
    'Contract value INR': 1248000,
    'Start date': '2026-09-18',
    'End date': '2026-11-11',
    'Retention percent': 5,
    'Payment terms': 'Milestone-linked (carcass 50%, shutters 40%, snag closure 10%)',
    notes: 'Includes Hettich hardware supply-and-fix; 5-year hardware warranty passed through to the client.'
  },
  {
    id: 'CTR-V253-04',
    title: 'Subcontract - Roof Gazebo Structure & Teak Pergola (Shree Ganesh Fabrication)',
    status: 'Pending Approval',
    'Contract number': 'BS/SC/2026/V253-05',
    Counterparty: 'Shree Ganesh Fabrication & Pergola (Neral)',
    'Contract value INR': 460000,
    'Start date': '2026-10-08',
    'End date': '2026-12-05',
    'Retention percent': 5,
    'Payment terms': '40% on MS frame, 40% on pergola completion, 20% on snag closure',
    notes: 'Labour licence and work-at-height insurance renewed copy pending - safety compliance currently flagged EXPIRED_DOCS.'
  }
];

// ---------------------------------------------------------------------------
// M12 - VARIATION ORDERS
// ---------------------------------------------------------------------------
const variations: OperationRecord[] = [
  {
    id: 'VO-V253-01',
    title: 'VO-01 - Outdoor kitchen counter at the Bedroom 2 bar deck',
    status: 'Approved',
    'Variation number': 'VO-2026-V253-01',
    Reason: 'Client requested a built-in outdoor kitchen counter with a grill niche during the 12-09-2026 site review',
    'Cost impact INR': 184500,
    'Days impact': 4,
    'Approval reference': 'Client email 14-09-2026 / PO-2026-V253-013 revision',
    notes: 'Adds 6 r.ft of BWP carcass with granite top and IP65 power points. Absorbed inside the existing gazebo float; handover date unchanged.'
  },
  {
    id: 'VO-V253-02',
    title: 'VO-02 - Powder room marble upgrade to book-matched Statuario',
    status: 'Approved',
    'Variation number': 'VO-2026-V253-02',
    Reason: 'Client preferred book-matched Statuario after seeing the dry-lay of Botticino in the great room',
    'Cost impact INR': 96200,
    'Days impact': 7,
    'Approval reference': 'Client WhatsApp approval 26-08-2026 / R.K. Marbles quote RKM/2026/1187-Rev1',
    notes: 'Additional 18-day import lead absorbed by starting procurement before the BOQ freeze. Powder room only (48.3 sq.ft).'
  },
  {
    id: 'VO-V253-03',
    title: 'VO-03 - Four additional KNX keypads in gazebo and decks',
    status: 'Pending Approval',
    'Variation number': 'VO-2026-V253-03',
    Reason: 'Outdoor lighting scenes required at the gazebo and both decks after the landscape concept was finalised',
    'Cost impact INR': 42800,
    'Days impact': 0,
    'Approval reference': 'Awaiting client signature - submitted 08-11-2026',
    notes: '4 IP65 keypads plus 2 additional dimming channels. No programme impact; can be executed before the 27-11 walkthrough.'
  }
];

// ---------------------------------------------------------------------------
// M19 - CUSTOMER BILLING / RA INVOICES
// ---------------------------------------------------------------------------
const billing: OperationRecord[] = [
  {
    id: 'INV-V253-01',
    title: 'RA-01 - Mobilisation advance (10%)',
    status: 'Completed',
    'Invoice number': 'BS/INV/2026/V253-01',
    'Invoice date': '2026-07-06',
    Customer: 'Aditya & Sneha Kulkarni',
    Milestone: 'MS-V253-1 Contract Signing & Site Mobilisation',
    'Taxable amount INR': 843618.82,
    'GST amount INR': 151851.39,
    'Paid amount INR': 995470.21,
    'Due date': '2026-07-16',
    notes: 'Received by RTGS on 08-07-2026. Mobilisation advance adjusted against RA-04.'
  },
  {
    id: 'INV-V253-02',
    title: 'RA-02 - Civil making good & wet area waterproofing (15%)',
    status: 'Completed',
    'Invoice number': 'BS/INV/2026/V253-02',
    'Invoice date': '2026-08-20',
    Customer: 'Aditya & Sneha Kulkarni',
    Milestone: 'MS-V253-2 Civil Making Good & Wet Area Waterproofing',
    'Taxable amount INR': 1265428.23,
    'GST amount INR': 227777.08,
    'Paid amount INR': 1493205.31,
    'Due date': '2026-09-04',
    notes: 'Supported by 72-hour ponding certificate TR-V253-01 and MB-V253-PAGE-013.'
  },
  {
    id: 'INV-V253-03',
    title: 'RA-03 - Concealed MEP, electrical & ceiling grid (25%)',
    status: 'Completed',
    'Invoice number': 'BS/INV/2026/V253-03',
    'Invoice date': '2026-10-05',
    Customer: 'Aditya & Sneha Kulkarni',
    Milestone: 'MS-V253-3 Concealed MEP, Electrical & Ceiling Grid',
    'Taxable amount INR': 2109054.05,
    'GST amount INR': 379629.73,
    'Paid amount INR': 2488675.52,
    'Due date': '2026-10-20',
    notes: 'Includes plumbing pressure-test certificate and KNX cabling continuity report.'
  },
  {
    id: 'INV-V253-04',
    title: 'RA-04 - Joinery, wardrobes & modular kitchen (25%)',
    status: 'Pending Approval',
    'Invoice number': 'BS/INV/2026/V253-04',
    'Invoice date': '2026-11-08',
    Customer: 'Aditya & Sneha Kulkarni',
    Milestone: 'MS-V253-4 Joinery, Wardrobes & Modular Kitchen',
    'Taxable amount INR': 2109054.05,
    'GST amount INR': 379629.73,
    'Paid amount INR': 0,
    'Due date': '2026-11-23',
    notes: 'Awaiting client approval of MB-V253-PAGE-015 and 016. Mobilisation advance of ₹9,95,470.21 to be adjusted here.'
  }
];

// ---------------------------------------------------------------------------
// M20 - FINANCE LEDGER
// ---------------------------------------------------------------------------
const finance: OperationRecord[] = [
  { id: 'VCH-V253-01', title: 'Client receipt - RA-01 mobilisation advance', status: 'Approved', 'Voucher number': 'BRV/2026/V253/001', 'Voucher date': '2026-07-08', Account: 'Bank - HDFC Current A/c', Party: 'Aditya & Sneha Kulkarni', 'Debit INR': 995470.21, 'Credit INR': 0, Reference: 'RTGS UTR HDFC0260718', notes: 'Receipt against invoice BS/INV/2026/V253-01.' },
  { id: 'VCH-V253-02', title: 'Vendor payment - Konkan Timber & Ply Mart (PO-2026-V253-011)', status: 'Approved', 'Voucher number': 'BPV/2026/V253/014', 'Voucher date': '2026-09-20', Account: 'Sundry Creditors - Materials', Party: 'Konkan Timber & Ply Mart, Panvel', 'Debit INR': 318460, 'Credit INR': 0, Reference: 'PO-2026-V253-011 / GRN-2026-V253-031', notes: '30-day credit honoured; 2 rejected ply sheets deducted and replaced free of cost.' },
  { id: 'VCH-V253-03', title: 'Vendor payment - R.K. Marbles (PO-2026-V253-012)', status: 'Approved', 'Voucher number': 'BPV/2026/V253/019', 'Voucher date': '2026-10-08', Account: 'Sundry Creditors - Materials', Party: 'R.K. Marbles & Granites, Kishangarh', 'Debit INR': 298682, 'Credit INR': 0, Reference: 'PO-2026-V253-012 / GRN-2026-V253-032', notes: '80% balance released after client approved the dry-lay on 03-10-2026.' },
  { id: 'VCH-V253-04', title: 'Subcontractor bill - Sahyadri Civil Works (MB pages 12-14)', status: 'Approved', 'Voucher number': 'BPV/2026/V253/022', 'Voucher date': '2026-10-12', Account: 'Subcontractors - Civil', Party: 'Sahyadri Civil Works (Karjat)', 'Debit INR': 803700, 'Credit INR': 0, Reference: 'SCWO-2026-V253-01', notes: 'Certified ₹8,46,000 less 5% retention ₹42,300.' },
  { id: 'VCH-V253-05', title: 'Client receipt - RA-03 MEP and ceiling milestone', status: 'Approved', 'Voucher number': 'BRV/2026/V253/006', 'Voucher date': '2026-10-18', Account: 'Bank - HDFC Current A/c', Party: 'Aditya & Sneha Kulkarni', 'Debit INR': 2488675.52, 'Credit INR': 0, Reference: 'RTGS UTR HDFC0261021', notes: 'Receipt against invoice BS/INV/2026/V253-03.' },
  { id: 'VCH-V253-06', title: 'Retention provision - all subcontractors to date', status: 'Open', 'Voucher number': 'JV/2026/V253/009', 'Voucher date': '2026-11-10', Account: 'Retention Money Payable', Party: 'Consolidated subcontractors', 'Debit INR': 0, 'Credit INR': 195600, Reference: 'MB-V253-PAGE-012 to 020', notes: '5% retention held across five work orders; released after DLP closure on 18-12-2027.' }
];

// ---------------------------------------------------------------------------
// M23 - CLIENT PORTAL REQUESTS
// ---------------------------------------------------------------------------
const portal: OperationRecord[] = [
  { id: 'PRT-V253-01', title: 'Gazebo furniture layout review request', status: 'Completed', Client: 'Sneha Kulkarni', 'Request type': 'Design clarification', 'Submitted date': '2026-10-22', 'Approval reference': 'Studio response 24-10-2026', 'Document URL': '/images/villa253_gazebo_terrace_1790833723445.jpg', notes: 'Shared two seating layouts for the 24\'x18\' gazebo; client chose the L-shaped bench with a loose dining set.' },
  { id: 'PRT-V253-02', title: 'Request to change Bedroom 3 wall colour to sage green', status: 'Approved', Client: 'Sneha Kulkarni', 'Request type': 'Finish change', 'Submitted date': '2026-11-02', 'Approval reference': 'VO-2026-V253-03 addendum', 'Document URL': '', notes: 'Approved at no cost - within the same Royale Luxury price band. Shade card 7982 signed and filed.' },
  { id: 'PRT-V253-03', title: 'Confirm handover date for family move-in', status: 'Open', Client: 'Aditya Kulkarni', 'Request type': 'Schedule', 'Submitted date': '2026-11-09', 'Approval reference': 'Pending PM confirmation', 'Document URL': '', notes: 'Client asking whether 18-12-2026 holds given the teak rafter delay. PM to confirm after the 22-10 balance delivery lands.' }
];

// ---------------------------------------------------------------------------
// M25 - DOCUMENT REGISTER
// ---------------------------------------------------------------------------
const documents: OperationRecord[] = [
  { id: 'DOC-V253-01', title: 'Wall marking drawing R0 (construction authority)', status: 'Approved', 'Document number': 'V253-ARC-101-R0', Category: 'Architectural drawing', Version: 'R0', Owner: 'Ar. Shruthi', 'File URL': '/api/cad/villa253.pdf', 'Review date': '2026-06-06', notes: 'VILLA_253_WALL_MARKING_10_10_24_REV0.pdf dated 10-10-24. Remains the construction authority.' },
  { id: 'DOC-V253-02', title: 'Editable 8-layer CAD reconstruction of the R0 plan', status: 'Approved', 'Document number': 'V253-DXF-R0', Category: 'CAD working file', Version: 'R0', Owner: 'Ar. Shruthi', 'File URL': '/api/cad/villa253.dxf', 'Review date': '2026-06-06', notes: 'Layers A-WALL, A-DOOR, A-WIND, A-STRS, A-DECK, A-DIMS, A-TEXT, A-NOTE. Working reconstruction, not a certified DWG.' },
  { id: 'DOC-V253-03', title: 'Furniture layout and circulation plan', status: 'Approved', 'Document number': 'V253-ARC-102-R2', Category: 'Architectural drawing', Version: 'R2', Owner: 'Ar. Shruthi', 'File URL': '/images/building_sketch.jpg', 'Review date': '2026-08-14', notes: 'GFC issued 14-08-2026 with circulation clearance checked at 900mm minimum.' },
  { id: 'DOC-V253-04', title: 'Great room joinery elevations (TV console, fluting, crockery)', status: 'Approved', 'Document number': 'V253-INT-201-R2', Category: 'Interior detail', Version: 'R2', Owner: 'Meera Rao', 'File URL': '/images/villa253_living_greatroom_1790833681710.jpg', 'Review date': '2026-08-22', notes: 'Client approved 22-08-2026 with 4 comments closed on fluting width.' },
  { id: 'DOC-V253-05', title: 'Roof gazebo structural detail - Section BB\'', status: 'Approved', 'Document number': 'V253-STR-501-R1', Category: 'Structural drawing', Version: 'R1', Owner: 'Eng. K. N. Rao', 'File URL': '/images/villa253_roof_gazebo_1790830815235.jpg', 'Review date': '2026-09-09', notes: 'MS base plate setting-out and teak rafter section; ridge 12\'-9" above first-floor slab.' },
  { id: 'DOC-V253-06', title: '72-hour ponding test certificate - Toilets 1 to 3', status: 'Approved', 'Document number': 'TR-V253-01', Category: 'Quality certificate', Version: 'Rev 0', Owner: 'K. R. Nair', 'File URL': '', 'Review date': '2026-08-18', notes: 'Signed by PMC consultant and the client representative; precondition for milestone MS-V253-2.' },
  { id: 'DOC-V253-07', title: 'Quotation BS-QT-2026-0253 and Rev 1 BOQ baseline', status: 'Approved', 'Document number': 'BS-QT-2026-0253', Category: 'Commercial', Version: 'Rev 1', Owner: 'Rajesh Sharma', 'File URL': '', 'Review date': '2026-06-27', notes: 'Accepted 27-06-2026; baseline frozen at ₹84,36,188.20 ex-GST.' }
];

// ---------------------------------------------------------------------------
// M26 - EQUIPMENT & ASSET REGISTER
// ---------------------------------------------------------------------------
const assets: OperationRecord[] = [
  { id: 'AST-V253-01', title: 'Bosch GLM 150-27 laser distance measurer', status: 'Approved', 'Asset code': 'EQ-V253-01', 'Asset name': 'Laser disto GLM 150-27', Location: 'Villa 253 site office', Custodian: 'Rajesh Sharma', 'Purchase date': '2025-11-14', 'Value INR': 18500, 'Service due date': '2027-05-14', notes: 'Calibration certificate valid to 14-05-2027; used for all seven room measurements.' },
  { id: 'AST-V253-02', title: 'Aluminium scaffold tower 4m with guardrail', status: 'Approved', 'Asset code': 'EQ-V253-02', 'Asset name': 'Scaffold tower 4m', Location: 'Villa 253 staircase core', Custodian: 'Arun Pillai', 'Purchase date': '2024-08-02', 'Value INR': 64000, 'Service due date': '2027-02-02', notes: 'Third-party inspection sticker valid to 02-02-2027; mandatory for the double-height stair void work.' },
  { id: 'AST-V253-03', title: 'Delmhorst J-2000 pin moisture meter', status: 'Approved', 'Asset code': 'EQ-V253-03', 'Asset name': 'Moisture meter J-2000', Location: 'Villa 253 site office', Custodian: 'K. R. Nair', 'Purchase date': '2025-02-20', 'Value INR': 42000, 'Service due date': '2027-02-20', notes: 'Used for plywood, teak and screed moisture readings logged in the test register.' },
  { id: 'AST-V253-04', title: 'Bosch GDC 121 marble cutter', status: 'Open', 'Asset code': 'EQ-V253-04', 'Asset name': 'Marble cutter GDC 121', Location: 'Villa 253 great room', Custodian: 'Suresh Bhandari', 'Purchase date': '2025-06-10', 'Value INR': 9800, 'Service due date': '2026-12-10', notes: 'Blade replacement due at 500 cutting hours; currently at 430 hours.' }
];

const byModule: Record<string, OperationRecord[]> = {
  contracts,
  variations,
  billing,
  finance,
  portal,
  documents,
  assets
};

/** Keyed exactly as DatabaseService expects: "<projectId>:<moduleId>" */
export const VILLA253_OPERATIONS: Record<string, OperationRecord[]> = Object.fromEntries(
  Object.entries(byModule).map(([moduleId, records]) => [`${P}:${moduleId}`, records])
);
