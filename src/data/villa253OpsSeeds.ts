/**
 * Build Storys ERP - VILLA 253 DEMO SEEDS (people, time and cost control)
 * ---------------------------------------------------------------------
 * Timesheets, resource deployment, project tasks and the cost-traceability
 * ledger for PROJ-VILLA-253. The traceability ledger is DERIVED from the
 * Rev 1 BOQ so that budget, committed and certified figures always agree
 * with the BOQ tab, the budget tab and the measurement book.
 */

import {
  TimesheetEntry,
  ResourceDeployment,
  ProjectTask,
  CostTraceabilityItem,
  TradeCategory,
  MeasurementUnit
} from '../types/erp';
import { VILLA253, VILLA253_BOQ_REV1 } from './villa253DemoProject';

// ---------------------------------------------------------------------------
// RESOURCE MASTER (employees + equipment used on this villa)
// ---------------------------------------------------------------------------
export interface VillaResourceItem {
  id: string;
  name: string;
  type: 'EMPLOYEE' | 'EQUIPMENT';
  roleOrCategory: string;
  department?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  hourlyCostRate: number;
  hourlyBillableRate: number;
  skillsOrSpecs?: string[];
  status: 'AVAILABLE' | 'DEPLOYED' | 'MAINTENANCE';
}

export const VILLA253_RESOURCES: VillaResourceItem[] = [
  { id: 'USR-ARCH-01', name: 'Ar. Shruthi', type: 'EMPLOYEE', roleOrCategory: 'Design Director', department: 'Architecture & Design Studio', avatar: 'SD', phone: '+91 98100 88776', email: 'shruthi@buildstory.com', hourlyCostRate: 2400, hourlyBillableRate: 4800, skillsOrSpecs: ['Concept design', 'GFC drawings', 'Client presentation'], status: 'DEPLOYED' },
  { id: 'USR-EST-01', name: 'Rajesh Sharma', type: 'EMPLOYEE', roleOrCategory: 'Lead Quantity Surveyor & Site Engineer', department: 'Estimating & Commercial', avatar: 'RS', phone: '+91 98202 33445', email: 'rajesh.qs@buildstorys.com', hourlyCostRate: 1600, hourlyBillableRate: 3200, skillsOrSpecs: ['BOQ takeoff', 'Joint measurement', 'Contractor billing'], status: 'DEPLOYED' },
  { id: 'USR-DES-01', name: 'Meera Rao', type: 'EMPLOYEE', roleOrCategory: 'Lead Interior Designer', department: 'Architecture & Design Studio', avatar: 'MR', phone: '+91 98670 11209', email: 'meera.rao@buildstorys.com', hourlyCostRate: 1500, hourlyBillableRate: 3000, skillsOrSpecs: ['Joinery detailing', 'Material palette', 'Site coordination'], status: 'DEPLOYED' },
  { id: 'USR-MEP-01', name: 'Eng. Farhan Qureshi', type: 'EMPLOYEE', roleOrCategory: 'MEP & Automation Engineer', department: 'MEP', avatar: 'FQ', phone: '+91 98201 55644', email: 'farhan.mep@buildstorys.com', hourlyCostRate: 1400, hourlyBillableRate: 2900, skillsOrSpecs: ['KNX programming', 'VRF design', 'Electrical SLD'], status: 'DEPLOYED' },
  { id: 'USR-QA-01', name: 'K. R. Nair', type: 'EMPLOYEE', roleOrCategory: 'QA / QC Engineer', department: 'Quality & Safety', avatar: 'KN', phone: '+91 98330 44172', email: 'kr.nair@buildstorys.com', hourlyCostRate: 1100, hourlyBillableRate: 2300, skillsOrSpecs: ['Ponding certification', 'Snag management', 'Material testing'], status: 'DEPLOYED' },
  { id: 'USR-SAF-01', name: 'Arun Pillai', type: 'EMPLOYEE', roleOrCategory: 'Safety Officer', department: 'Quality & Safety', avatar: 'AP', phone: '+91 98200 99112', email: 'arun.safety@buildstorys.com', hourlyCostRate: 950, hourlyBillableRate: 1900, skillsOrSpecs: ['Permit to work', 'Toolbox talks', 'Work-at-height audits'], status: 'DEPLOYED' },
  { id: 'USR-SC-01', name: 'Ustad Ramji Mistry', type: 'EMPLOYEE', roleOrCategory: 'Carpentry Foreman (subcontract)', department: 'Execution', avatar: 'RM', phone: '+91 98190 23412', hourlyCostRate: 420, hourlyBillableRate: 0, skillsOrSpecs: ['Veneer joinery', 'Wardrobe fitting', 'Kitchen installation'], status: 'DEPLOYED' },
  { id: 'EQ-V253-01', name: 'Bosch GLM 150-27 Laser Disto', type: 'EQUIPMENT', roleOrCategory: 'Survey Instrument', avatar: 'LD', hourlyCostRate: 120, hourlyBillableRate: 260, skillsOrSpecs: ['150m range', 'Bluetooth logging'], status: 'DEPLOYED' },
  { id: 'EQ-V253-02', name: 'Scaffold Tower 4m (aluminium)', type: 'EQUIPMENT', roleOrCategory: 'Scaffolding', avatar: 'ST', hourlyCostRate: 180, hourlyBillableRate: 380, skillsOrSpecs: ['Guardrail', 'Double-height stair void'], status: 'DEPLOYED' },
  { id: 'EQ-V253-03', name: 'Delmhorst J-2000 Moisture Meter', type: 'EQUIPMENT', roleOrCategory: 'Testing Instrument', avatar: 'MM', hourlyCostRate: 90, hourlyBillableRate: 210, skillsOrSpecs: ['Wood moisture', 'Concrete RH'], status: 'AVAILABLE' }
];

// ---------------------------------------------------------------------------
// TIMESHEETS - week of 03-11-2026 to 10-11-2026
// ---------------------------------------------------------------------------
const ts = (
  n: number,
  employeeId: string,
  employeeName: string,
  employeeRole: string,
  avatar: string,
  date: string,
  dayOfWeek: string,
  taskTitle: string,
  category: TimesheetEntry['category'],
  hours: number,
  costRate: number,
  billableRate: number,
  description: string,
  billable = true
): TimesheetEntry => ({
  id: `TS-V253-${String(n).padStart(3, '0')}`,
  projectId: VILLA253.projectId,
  projectCode: VILLA253.projectCode,
  projectName: VILLA253.title,
  employeeId,
  employeeName,
  employeeRole,
  employeeAvatar: avatar,
  date,
  weekNumber: 'W45 2026',
  dayOfWeek,
  taskTitle,
  category,
  hours,
  overtimeHours: 0,
  billable,
  billableRate,
  costRate,
  totalCost: Math.round(hours * costRate),
  totalBillable: billable ? Math.round(hours * billableRate) : 0,
  description,
  status: 'APPROVED'
});

export const VILLA253_TIMESHEETS: TimesheetEntry[] = [
  ts(1, 'USR-ARCH-01', 'Ar. Shruthi', 'Design Director', 'SD', '2026-11-09', 'Mon', 'Gazebo pergola detail coordination with fabrication vendor', 'Design', 4.5, 2400, 4800, 'Resolved rafter end gap detail with Shree Ganesh and issued site sketch to close SNAG-V253-05.'),
  ts(2, 'USR-ARCH-01', 'Ar. Shruthi', 'Design Director', 'SD', '2026-11-10', 'Tue', 'Pre-handover walkthrough with client on great room finishes', 'Design', 3, 2400, 4800, 'Walkthrough with Mr. and Mrs. Kulkarni on paint marks, cove lighting scene levels and curtain rod fixing points.'),
  ts(3, 'USR-EST-01', 'Rajesh Sharma', 'Lead Quantity Surveyor & Site Engineer', 'RS', '2026-11-09', 'Mon', 'Joint measurement - Bedroom 3 oak flooring and utility waterproofing', 'Onsite', 8, 1600, 3200, 'MB-V253-PAGE-19 measured with Konkan Stone; ponding sheet for utility prepared for PMC sign-off.'),
  ts(4, 'USR-EST-01', 'Rajesh Sharma', 'Lead Quantity Surveyor & Site Engineer', 'RS', '2026-11-10', 'Tue', 'Contractor billing certification - Mistry Joinery WO-V253-02', 'Onsite', 6.5, 1600, 3200, 'Certified 242.5 sq.ft wardrobe elevation and 26 r.ft kitchen; retained 5% against WO-V253-02.'),
  ts(5, 'USR-DES-01', 'Meera Rao', 'Lead Interior Designer', 'MR', '2026-11-09', 'Mon', 'Wardrobe shutter alignment supervision in master walk-in', 'Design', 5, 1500, 3000, 'Supervised shutter alignment and logged snag SNAG-V253-01 as rectified with client sign-off.'),
  ts(6, 'USR-DES-01', 'Meera Rao', 'Lead Interior Designer', 'MR', '2026-11-10', 'Tue', 'Kitchen shutter gap rectification and countertop shade check', 'Design', 4, 1500, 3000, 'Verified hinge plate adjustment plan against NCR-2026-V253-011; checked quartz slab shade against approved sample.'),
  ts(7, 'USR-MEP-01', 'Eng. Farhan Qureshi', 'MEP & Automation Engineer', 'FQ', '2026-11-10', 'Tue', 'KNX scene programming - staircase pendant and great room cove', 'MEP', 6, 1400, 2900, 'Re-parameterised scene 3 and scene 2 dimming curves; closed warranty tickets DLP-V253-2026-002 and 003.'),
  ts(8, 'USR-MEP-01', 'Eng. Farhan Qureshi', 'MEP & Automation Engineer', 'FQ', '2026-11-06', 'Fri', 'VRF commissioning readings and diffuser balancing', 'MEP', 7, 1400, 2900, 'Balanced linear slot diffusers in living and Bedroom 1; logged supply/return temperatures for handover file.'),
  ts(9, 'USR-QA-01', 'K. R. Nair', 'QA / QC Engineer', 'KN', '2026-11-06', 'Fri', 'NCR-2026-V253-011 kitchen shutter gap inspection', 'Onsite', 3.5, 1100, 2300, 'Raised NCR for 4mm gaps on tall unit; assigned to Mistry Joinery with closure target 13-11-2026.'),
  ts(10, 'USR-QA-01', 'K. R. Nair', 'QA / QC Engineer', 'KN', '2026-11-07', 'Sat', 'Gazebo base plate torque and pergola alignment check', 'Onsite', 4, 1100, 2300, 'Verified 180 Nm torque on four base plates and ridge line alignment against Section BB\'.'),
  ts(11, 'USR-SAF-01', 'Arun Pillai', 'Safety Officer', 'AP', '2026-11-10', 'Tue', 'Work-at-height permit issue and toolbox talk - gazebo pergola', 'Onsite', 3, 950, 1900, 'Issued PTW-2026-V253-021 for six persons; toolbox talk on rafter manual handling and edge protection.'),
  ts(12, 'USR-SAF-01', 'Arun Pillai', 'Safety Officer', 'AP', '2026-11-11', 'Wed', 'Hot work permit issue - MS base plate welding on roof', 'Onsite', 2.5, 950, 1900, 'Issued PTW-2026-V253-022 with fire watch protocol and extinguisher placement at the work face.'),
  ts(13, 'USR-SC-01', 'Ustad Ramji Mistry', 'Carpentry Foreman (subcontract)', 'RM', '2026-11-10', 'Tue', 'Master walk-in shutter hanging and bar unit magnet fixing', 'Onsite', 9, 420, 0, 'Non-billable subcontract supervision hours; cost recovered through WO-V253-02 certification.', false),
  ts(14, 'USR-SC-01', 'Ustad Ramji Mistry', 'Carpentry Foreman (subcontract)', 'RM', '2026-11-09', 'Mon', 'Wardrobe carcass completion in Bedroom 2 and Bedroom 3', 'Onsite', 9, 420, 0, 'Non-billable subcontract supervision hours; carcass elevation measured for MB-V253-PAGE-15.', false)
];

// ---------------------------------------------------------------------------
// RESOURCE DEPLOYMENT - 10-11-2026 site day
// ---------------------------------------------------------------------------
export const VILLA253_DEPLOYMENTS: ResourceDeployment[] = [
  { id: 'DEP-V253-01', resourceId: 'USR-EST-01', resourceName: 'Rajesh Sharma', resourceType: 'EMPLOYEE', roleOrCategory: 'Site Engineer', avatar: 'RS', projectId: VILLA253.projectId, projectCode: VILLA253.projectCode, projectTitle: VILLA253.title, clientName: VILLA253.clientName, taskName: 'Joint measurement - Bedroom 1 oak flooring', date: '2026-11-10', startTime: '09:00 AM', endTime: '01:00 PM', durationHours: 4, shiftLabel: '9:00 AM - 1:00 PM - Site measurement', colorTheme: 'blue', utilizationPercent: 100, status: 'CONFIRMED' },
  { id: 'DEP-V253-02', resourceId: 'USR-DES-01', resourceName: 'Meera Rao', resourceType: 'EMPLOYEE', roleOrCategory: 'Interior Designer', avatar: 'MR', projectId: VILLA253.projectId, projectCode: VILLA253.projectCode, projectTitle: VILLA253.title, clientName: VILLA253.clientName, taskName: 'Kitchen shutter gap rectification', date: '2026-11-10', startTime: '10:00 AM', endTime: '02:00 PM', durationHours: 4, shiftLabel: '10:00 AM - 2:00 PM - Joinery QC', colorTheme: 'purple', utilizationPercent: 100, status: 'CONFIRMED' },
  { id: 'DEP-V253-03', resourceId: 'USR-MEP-01', resourceName: 'Eng. Farhan Qureshi', resourceType: 'EMPLOYEE', roleOrCategory: 'MEP Engineer', avatar: 'FQ', projectId: VILLA253.projectId, projectCode: VILLA253.projectCode, projectTitle: VILLA253.title, clientName: VILLA253.clientName, taskName: 'KNX scene programming and keypad testing', date: '2026-11-10', startTime: '02:00 PM', endTime: '06:00 PM', durationHours: 4, shiftLabel: '2:00 PM - 6:00 PM - Automation', colorTheme: 'teal', utilizationPercent: 100, status: 'CONFIRMED' },
  { id: 'DEP-V253-04', resourceId: 'USR-SAF-01', resourceName: 'Arun Pillai', resourceType: 'EMPLOYEE', roleOrCategory: 'Safety Officer', avatar: 'AP', projectId: VILLA253.projectId, projectCode: VILLA253.projectCode, projectTitle: VILLA253.title, clientName: VILLA253.clientName, taskName: 'PTW issue and toolbox talk - gazebo', date: '2026-11-10', startTime: '09:00 AM', endTime: '12:00 PM', durationHours: 3, shiftLabel: '9:00 AM - 12:00 PM - Safety', colorTheme: 'amber', utilizationPercent: 75, status: 'CONFIRMED' },
  { id: 'DEP-V253-05', resourceId: 'USR-SC-01', resourceName: 'Ustad Ramji Mistry', resourceType: 'EMPLOYEE', roleOrCategory: 'Carpentry Foreman', avatar: 'RM', projectId: VILLA253.projectId, projectCode: VILLA253.projectCode, projectTitle: VILLA253.title, clientName: VILLA253.clientName, taskName: 'Walk-in shutters and bar unit hardware', date: '2026-11-10', startTime: '08:00 AM', endTime: '05:00 PM', durationHours: 9, shiftLabel: '8:00 AM - 5:00 PM - Joinery', colorTheme: 'orange', utilizationPercent: 112, status: 'CONFIRMED' },
  { id: 'DEP-V253-06', resourceId: 'EQ-V253-02', resourceName: 'Scaffold Tower 4m (aluminium)', resourceType: 'EQUIPMENT', roleOrCategory: 'Scaffolding', avatar: 'ST', projectId: VILLA253.projectId, projectCode: VILLA253.projectCode, projectTitle: VILLA253.title, clientName: VILLA253.clientName, taskName: 'Staircase void glazing and pendant fixing', date: '2026-11-10', startTime: '09:00 AM', endTime: '05:00 PM', durationHours: 8, shiftLabel: '9:00 AM - 5:00 PM - Access', colorTheme: 'green', utilizationPercent: 100, status: 'CONFIRMED' },
  { id: 'DEP-V253-07', resourceId: 'USR-ARCH-01', resourceName: 'Ar. Shruthi', resourceType: 'EMPLOYEE', roleOrCategory: 'Design Director', avatar: 'SD', projectId: VILLA253.projectId, projectCode: VILLA253.projectCode, projectTitle: VILLA253.title, clientName: VILLA253.clientName, taskName: 'Pre-handover walkthrough with client', date: '2026-11-10', startTime: '04:00 PM', endTime: '07:00 PM', durationHours: 3, shiftLabel: '4:00 PM - 7:00 PM - Client', colorTheme: 'indigo', utilizationPercent: 75, status: 'CONFIRMED' },
  { id: 'DEP-V253-08', resourceId: 'USR-QA-01', resourceName: 'K. R. Nair', resourceType: 'EMPLOYEE', roleOrCategory: 'QA / QC Engineer', avatar: 'KN', projectId: VILLA253.projectId, projectCode: VILLA253.projectCode, projectTitle: VILLA253.title, clientName: VILLA253.clientName, taskName: 'Snag register update and paint touch-up check', date: '2026-11-10', startTime: '11:00 AM', endTime: '03:00 PM', durationHours: 4, shiftLabel: '11:00 AM - 3:00 PM - QA', colorTheme: 'blue', utilizationPercent: 100, status: 'CONFIRMED' }
];

// ---------------------------------------------------------------------------
// PROJECT MANAGEMENT HUB TASKS
// ---------------------------------------------------------------------------
const task = (
  n: number,
  title: string,
  stage: ProjectTask['stage'],
  category: ProjectTask['category'],
  assigneeId: string,
  assigneeName: string,
  assigneeAvatar: string,
  plannedHours: string,
  loggedHours: string,
  checklistTotal: number,
  checklistCompleted: number,
  priority: 1 | 2 | 3,
  dueDate: string,
  description: string,
  extra?: Partial<ProjectTask>
): ProjectTask => ({
  id: `TASK-V253-${String(n).padStart(3, '0')}`,
  projectId: VILLA253.projectId,
  projectCode: VILLA253.projectCode,
  projectName: VILLA253.title,
  clientName: VILLA253.clientName,
  title,
  stage,
  category,
  assigneeId,
  assigneeName,
  assigneeAvatar,
  plannedHours,
  loggedHours,
  checklistTotal,
  checklistCompleted,
  priority,
  dueDate,
  description,
  ...extra
});

export const VILLA253_PROJECT_TASKS: ProjectTask[] = [
  task(1, 'Close gazebo rafter end gap (SNAG-V253-05)', 'Ongoing', 'Onsite', 'USR-DES-01', 'Meera Rao', 'MR', '06:00', '03:30', 4, 2, 1, '2026-11-20', 'Detail sketch issued to Shree Ganesh; bracket set reserved. Target closure before the 20-11 client review.', { hasWarning: true }),
  task(2, 'Bedroom 1 oak flooring and skirting', 'Ongoing', 'Onsite', 'USR-EST-01', 'Rajesh Sharma', 'RS', '16:00', '09:00', 6, 3, 1, '2026-11-14', 'Balance 118 sq.ft of Bedroom 1 flooring; moisture already verified at 9.2%.'),
  task(3, 'Kitchen shutter gap rectification (NCR-011)', 'Ongoing', 'Onsite', 'USR-DES-01', 'Meera Rao', 'MR', '04:00', '02:00', 3, 1, 1, '2026-11-13', 'Adjust hinge plates on the tall unit and re-verify all 26 r.ft gaps at 2.5mm.', { hasWarning: true }),
  task(4, 'Balance 56 teak rafters - vendor follow-up', 'Ongoing', 'Procurement', 'USR-EST-01', 'Rajesh Sharma', 'RS', '03:00', '02:00', 2, 1, 1, '2026-11-22', 'Burma Teak House committed delivery 22-10 slipped; gazebo closure at risk of 4 days.', { hasWarning: true }),
  task(5, 'PU polish first coat on great room joinery', 'Ongoing', 'Onsite', 'USR-SC-01', 'Ustad Ramji Mistry', 'RM', '12:00', '06:00', 5, 3, 2, '2026-11-18', 'Dust-controlled polishing of crockery unit and TV console shutters.'),
  task(6, 'KNX scene card and handover documentation', 'New', 'Design', 'USR-MEP-01', 'Eng. Farhan Qureshi', 'FQ', '08:00', '00:00', 4, 0, 2, '2026-12-05', 'Printed scene card per room, ETS project backup and warranty booklet for the client.'),
  task(7, 'Landscape planting and drip irrigation commissioning', 'Ongoing', 'Onsite', 'USR-EST-01', 'Rajesh Sharma', 'RS', '20:00', '11:00', 8, 5, 2, '2026-11-15', 'Front and rear deck planting; Kota paving completed, drip lines being commissioned.'),
  task(8, 'Marble skirting polish in staircase core', 'Ongoing', 'Onsite', 'USR-EST-01', 'Rajesh Sharma', 'RS', '06:00', '04:00', 3, 2, 3, '2026-11-16', 'Skirting polishing and crystallisation touch-up after pendant installation.'),
  task(9, 'Snag register consolidation for client walkthrough', 'Customer feedback', 'Admin', 'USR-QA-01', 'K. R. Nair', 'KN', '10:00', '07:00', 8, 5, 2, '2026-11-27', 'Consolidate all open snags with photographs into the handover pack for 27-11 walkthrough.'),
  task(10, 'Milestone 4 invoice - joinery certification', 'Ongoing', 'Admin', 'USR-EST-01', 'Rajesh Sharma', 'RS', '05:00', '04:00', 4, 3, 1, '2026-11-14', 'Raise ₹24,88,675.52 (25%) invoice against certified joinery, wardrobe and kitchen work.'),
  task(11, 'Final paint coat - great room and bedrooms', 'Ongoing', 'Onsite', 'USR-SC-01', 'Ustad Ramji Mistry', 'RM', '24:00', '14:00', 7, 4, 2, '2026-11-25', 'Royale Luxury final coat after snag touch-ups; protection sheeting to stay until handover.'),
  task(12, 'Deep cleaning and handover kit preparation', 'New', 'Admin', 'USR-QA-01', 'K. R. Nair', 'KN', '14:00', '00:00', 6, 0, 3, '2026-12-15', 'Machine deep cleaning, warranty documents, spare tiles and paint touch-up kit.', { isMilestone: true })
];

// ---------------------------------------------------------------------------
// COST TRACEABILITY - derived from Rev 1 BOQ so all tabs agree
// ---------------------------------------------------------------------------
interface TraceRule {
  po?: string;
  vendor?: string;
  subWO?: string;
  subName?: string;
  committedPct: number; // of budget total cost
  issuedPct: number; // material issued to site
  certifiedPct: number; // work certified by MB
}

const TRACE_RULES: Record<string, TraceRule> = {
  'CIV-01': { subWO: 'SCWO-2026-V253-01', subName: 'Sahyadri Civil Works (Karjat)', committedPct: 1, issuedPct: 1, certifiedPct: 1 },
  'WTR-01': { po: 'PO-2026-V253-011', vendor: 'Konkan Timber & Ply Mart, Panvel', subWO: 'SCWO-2026-V253-01', subName: 'Sahyadri Civil Works (Karjat)', committedPct: 0.98, issuedPct: 0.92, certifiedPct: 0.92 },
  'FLR-01': { po: 'PO-2026-V253-012', vendor: 'R.K. Marbles & Granites, Kishangarh', subWO: 'SCWO-2026-V253-04', subName: 'Konkan Stone & Tile Laying (Khopoli)', committedPct: 1, issuedPct: 1, certifiedPct: 1 },
  'FLR-02': { po: 'PO-2026-V253-011', vendor: 'Konkan Timber & Ply Mart, Panvel', subWO: 'SCWO-2026-V253-04', subName: 'Konkan Stone & Tile Laying (Khopoli)', committedPct: 0.97, issuedPct: 0.84, certifiedPct: 0.62 },
  'FLR-03': { po: 'PO-2026-V253-012', vendor: 'R.K. Marbles & Granites, Kishangarh', subWO: 'SCWO-2026-V253-04', subName: 'Konkan Stone & Tile Laying (Khopoli)', committedPct: 0.96, issuedPct: 0.78, certifiedPct: 0.55 },
  'FLR-04': { po: 'PO-2026-V253-011', vendor: 'Konkan Timber & Ply Mart, Panvel', subWO: 'SCWO-2026-V253-04', subName: 'Konkan Stone & Tile Laying (Khopoli)', committedPct: 0.98, issuedPct: 0.7, certifiedPct: 0.45 },
  'CLG-01': { po: 'PO-2026-V253-011', vendor: 'Konkan Timber & Ply Mart, Panvel', committedPct: 1, issuedPct: 1, certifiedPct: 0.95 },
  'CLG-02': { po: 'PO-2026-V253-013', vendor: 'Burma Teak House, Fort Mumbai', subWO: 'SCWO-2026-V253-05', subName: 'Shree Ganesh Fabrication & Pergola (Neral)', committedPct: 0.99, issuedPct: 0.67, certifiedPct: 0.45 },
  'WRD-01': { po: 'PO-2026-V253-011', vendor: 'Konkan Timber & Ply Mart, Panvel', subWO: 'SCWO-2026-V253-02', subName: 'Mistry Joinery Works (Panvel)', committedPct: 1, issuedPct: 1, certifiedPct: 1 },
  'KIT-01': { po: 'PO-2026-V253-011', vendor: 'Konkan Timber & Ply Mart, Panvel', subWO: 'SCWO-2026-V253-02', subName: 'Mistry Joinery Works (Panvel)', committedPct: 1, issuedPct: 1, certifiedPct: 0.97 },
  'JNR-01': { po: 'PO-2026-V253-011', vendor: 'Konkan Timber & Ply Mart, Panvel', subWO: 'SCWO-2026-V253-02', subName: 'Mistry Joinery Works (Panvel)', committedPct: 1, issuedPct: 1, certifiedPct: 0.82 },
  'JNR-02': { po: 'PO-2026-V253-011', vendor: 'Konkan Timber & Ply Mart, Panvel', subWO: 'SCWO-2026-V253-02', subName: 'Mistry Joinery Works (Panvel)', committedPct: 0.95, issuedPct: 0.8, certifiedPct: 0.4 },
  'ELE-01': { po: 'PO-2026-V253-016', vendor: 'Legrand India - Automation Partner, Andheri', subWO: 'SCWO-2026-V253-03', subName: 'Deccan MEP & Automation (Thane)', committedPct: 1, issuedPct: 0.95, certifiedPct: 0.9 },
  'PLB-01': { po: 'PO-2026-V253-014', vendor: 'Astral Flowguard Distributors, Thane', subWO: 'SCWO-2026-V253-03', subName: 'Deccan MEP & Automation (Thane)', committedPct: 1, issuedPct: 1, certifiedPct: 0.93 },
  'HVAC-01': { po: 'PO-2026-V253-015', vendor: 'Daikin Airconditioning India - Vashi Branch', subWO: 'SCWO-2026-V253-03', subName: 'Deccan MEP & Automation (Thane)', committedPct: 1, issuedPct: 1, certifiedPct: 0.95 },
  'DOR-01': { po: 'PO-2026-V253-016', vendor: 'Legrand India - Automation Partner, Andheri', committedPct: 0.94, issuedPct: 0.72, certifiedPct: 0.6 },
  'PNT-01': { po: 'PO-2026-V253-011', vendor: 'Konkan Timber & Ply Mart, Panvel', committedPct: 0.92, issuedPct: 0.64, certifiedPct: 0.46 },
  'EXT-01': { po: 'PO-2026-V253-013', vendor: 'Burma Teak House, Fort Mumbai', subWO: 'SCWO-2026-V253-05', subName: 'Shree Ganesh Fabrication & Pergola (Neral)', committedPct: 1, issuedPct: 0.78, certifiedPct: 0.6 },
  'LIT-01': { po: 'PO-2026-V253-016', vendor: 'Legrand India - Automation Partner, Andheri', committedPct: 0.9, issuedPct: 0.5, certifiedPct: 0.35 },
  'LND-01': { committedPct: 0.6, issuedPct: 0.35, certifiedPct: 0.3 }
};

const money = (n: number) => Math.round(n);

export const VILLA253_COST_TRACEABILITY: CostTraceabilityItem[] = VILLA253_BOQ_REV1.map((item, idx) => {
  const rule: TraceRule = TRACE_RULES[item.itemCode] ?? { committedPct: 0.9, issuedPct: 0.6, certifiedPct: 0.5 };
  const poCommittedAmount = rule.po ? money(item.totalCost * rule.committedPct * 0.62) : 0;
  const subcontractCommittedAmount = rule.subWO ? money(item.totalCost * rule.committedPct * 0.34) : 0;
  const totalCommittedCost = poCommittedAmount + subcontractCommittedAmount;
  const materialIssuedQuantity = Math.round(item.finalQuantity * rule.issuedPct * 100) / 100;
  const materialIssuedValue = money(item.finalQuantity * rule.issuedPct * item.materialRate);
  const workCertifiedQuantity = Math.round(item.finalQuantity * rule.certifiedPct * 100) / 100;
  const workCertifiedValue = money(item.finalQuantity * rule.certifiedPct * (item.labourRate + item.subcontractRate));
  const actualCostIncurred = materialIssuedValue + workCertifiedValue;
  const status: CostTraceabilityItem['status'] =
    actualCostIncurred > item.totalCost
      ? 'OVERRUN_ALERT'
      : rule.certifiedPct >= 1
        ? 'CERTIFIED'
        : rule.issuedPct >= 0.7
          ? 'PARTIALLY_DELIVERED'
          : totalCommittedCost > 0
            ? 'COMMITTED'
            : 'BUDGETED';

  return {
    id: `TRC-V253-${String(idx + 1).padStart(3, '0')}`,
    boqItemCode: item.itemCode,
    trade: item.trade as TradeCategory,
    roomZone: item.roomZone,
    description: item.description,
    specification: item.specification,
    unit: item.unit as MeasurementUnit,
    boqQuantity: item.finalQuantity,
    budgetUnitCost: item.unitCost,
    budgetTotalCost: item.totalCost,
    sellingRate: item.sellingRate,
    sellingTotal: item.sellingAmount,
    budgetedMarginPercent: item.markupPercent,
    poNumber: rule.po,
    poVendorName: rule.vendor,
    poCommittedAmount,
    subcontractWONumber: rule.subWO,
    subcontractorName: rule.subName,
    subcontractCommittedAmount,
    totalCommittedCost,
    materialIssuedQuantity,
    materialIssuedValue,
    workCertifiedQuantity,
    workCertifiedValue,
    actualCostIncurred,
    costVariance: item.totalCost - actualCostIncurred,
    actualMarginPercent:
      item.sellingAmount > 0
        ? Math.round(((item.sellingAmount - actualCostIncurred) / item.sellingAmount) * 10000) / 100
        : 0,
    status,
    notes:
      status === 'OVERRUN_ALERT'
        ? 'Actual cost has crossed the approved budget line - review with the QS before the next certification.'
        : `Certified ${Math.round(rule.certifiedPct * 100)}% of BOQ quantity; material issued ${Math.round(rule.issuedPct * 100)}%.`
  };
});
