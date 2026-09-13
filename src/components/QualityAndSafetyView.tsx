/**
 * Build Storys ERP - Quality Assurance (QA/QC) & Safety HSE Management (Pillars 16 & 17)
 * Quality: Inspection Test Plans (ITP), Cube/Slump/Moisture Test Reports, Non-Conformance Reports (NCR) with Rework Cost & CAPA.
 * Safety: Daily Toolbox Talks (TBT), PPE Compliance Register, Permit to Work (PTW) System & Safety Scorecard.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  HardHat,
  Flame,
  Zap,
  Activity,
  Plus,
  ArrowRight,
  Camera,
  XCircle,
  FileText,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { ProjectRecord, UserSession, QualityNCRRecord, SafetyPermitToWork } from '../types/erp';

interface QualityAndSafetyViewProps {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
}

interface MaterialTestReport {
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

const INITIAL_NCRS: QualityNCRRecord[] = [
  {
    id: 'NCR-001',
    projectId: 'PROJ-SKYLINE-1402',
    ncrCode: 'NCR-2026-004',
    dateRaised: '2026-03-08',
    roomZone: 'Living Room Partition Wall',
    trade: 'CIVIL_MASONRY',
    severity: 'MINOR',
    description: 'Chipping at bottom edge of non-load bearing lintel left exposed aggregate.',
    rootCause: 'Manual breaker tool operated at excessive angle by junior mason.',
    correctiveActionPlan: 'Apply non-shrink epoxy repair mortar (Sika Monotop) and re-cure for 48 hours.',
    assignedContractorOrTeam: 'Omkar Civil Specialists',
    reworkCostINR: 4200,
    targetClosureDate: '2026-03-12',
    closureDate: '2026-03-11',
    status: 'CLOSED_VERIFIED',
    inspectedBy: 'QA Lead K. R. Nair'
  },
  {
    id: 'NCR-002',
    projectId: 'PROJ-SKYLINE-1402',
    ncrCode: 'NCR-2026-005',
    dateRaised: '2026-03-10',
    roomZone: 'Master Bathroom Dado',
    trade: 'WATERPROOFING',
    severity: 'MAJOR',
    description: 'Corner fillet radius was less than 50mm before applying 2nd elastomeric coat.',
    rootCause: 'Mason hurried plaster screed fillet without checking gauge template.',
    correctiveActionPlan: 'Grind corner, recast 50mm chamfer fillet with polymer modified mortar, reapply Fastflex with fiber mesh.',
    assignedContractorOrTeam: 'Omkar Civil Specialists',
    reworkCostINR: 8500,
    targetClosureDate: '2026-03-14',
    status: 'IN_PROGRESS',
    inspectedBy: 'QA Lead K. R. Nair'
  }
];

const INITIAL_PTWS: SafetyPermitToWork[] = [
  {
    id: 'PTW-001',
    projectId: 'PROJ-SKYLINE-1402',
    ptwNumber: 'PTW-2026-034',
    permitType: 'HOT_WORK',
    locationArea: 'Living Room Balcony Area',
    contractorOrCrew: 'Precision Metal Fabricators',
    hazardsIdentified: ['Fire hazard from sparks', 'Adjacent combustible packaging', 'Hot slag falling to lower floor'],
    mandatoryPrecautions: ['10kg ABC Dry Powder Fire Extinguisher at site', 'Fire blanket shielding balcony glass', 'Fire watch personnel stationed on floor 13'],
    ppeEquipmentsVerified: ['Welding Helmet', 'Leather Apron', 'Insulated Gloves', 'Safety Goggles'],
    issuedByOfficer: 'Safety Officer Arun Pillai',
    receivedBySupervisor: 'Foreman R. Qureshi',
    validFrom: '2026-03-12 09:00',
    validUntil: '2026-03-12 18:00',
    emergencyContact: '+91 98200 99112',
    status: 'ACTIVE_PERMIT'
  },
  {
    id: 'PTW-002',
    projectId: 'PROJ-SKYLINE-1402',
    ptwNumber: 'PTW-2026-035',
    permitType: 'WORKING_AT_HEIGHT',
    locationArea: 'Balcony Façade Outer Railing',
    contractorOrCrew: 'Sky Glass & Glazing Crew',
    hazardsIdentified: ['Fall from height (14th floor)', 'Wind gusts', 'Drop hazards onto ground podium'],
    mandatoryPrecautions: ['Double lanyard safety harness hooked to certified lifeline', 'Safety net rigged at 13th floor level', 'Barricading podium zone below'],
    ppeEquipmentsVerified: ['Full Body Harness with Shock Absorber', 'Chin-strap Helmet', 'Non-slip Boots'],
    issuedByOfficer: 'Safety Officer Arun Pillai',
    receivedBySupervisor: 'Supervisor Naresh',
    validFrom: '2026-03-13 10:00',
    validUntil: '2026-03-13 17:00',
    emergencyContact: '+91 98200 99112',
    status: 'ACTIVE_PERMIT'
  }
];

const INITIAL_TESTS: MaterialTestReport[] = [
  {
    id: 'TR-01',
    testCode: 'TEST-WTR-01',
    testType: 'WATERPROOFING_PONDING',
    componentTested: 'Master Bathroom Sunken Slab Ponding (72 Hours)',
    sampleDate: '2026-03-09',
    testDate: '2026-03-12',
    labAgency: 'On-site PMC Joint Certification',
    requiredValue: '0 mm water drop over 72 hrs (excluding evaporation)',
    obtainedValue: '0 mm loss (Level Marker intact)',
    status: 'PASSED',
    remarks: 'Underside of 13th floor slab completely dry, thermal scanner confirmed no damp spots.'
  },
  {
    id: 'TR-02',
    testCode: 'TEST-PLY-02',
    testType: 'WOOD_SEASONING_CHECK',
    componentTested: 'CenturyPly 18mm Marine Plywood Batch #CT-88',
    sampleDate: '2026-03-11',
    testDate: '2026-03-11',
    labAgency: 'Delmhorst J-2000 Pin Moisture Meter',
    requiredValue: 'Moisture content < 12%',
    obtainedValue: '8.4% Moisture Content',
    status: 'PASSED',
    remarks: 'Optimal moisture content for zero post-installation warping or delamination.'
  }
];

export const QualityAndSafetyView: React.FC<QualityAndSafetyViewProps> = ({
  project,
  currentUser,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'ncr' | 'safety_ptw' | 'material_tests' | 'tbt'>('ncr');
  const [ncrs, setNcrs] = useState<QualityNCRRecord[]>(INITIAL_NCRS);
  const [ptws, setPtws] = useState<SafetyPermitToWork[]>(INITIAL_PTWS);
  const [tests, setTests] = useState<MaterialTestReport[]>(INITIAL_TESTS);

  const handleCloseNCR = (id: string) => {
    setNcrs(ncrs.map(n => n.id === id ? {
      ...n,
      status: 'CLOSED_VERIFIED',
      closureDate: new Date().toISOString().split('T')[0]
    } : n));
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen text-slate-800 p-4 md:p-6 space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Pillars 16 & 17: Quality Assurance (QA/QC) & Site Safety (HSE)
              </h1>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded font-bold">
                Zero Lost Time Incidents (LTI) • ISO 9001/45001 Compliant
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Non-Conformance Reports (NCR) with CAPA, Material Test Records & High-Risk Permit to Work (PTW) Protocols.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('ncr')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'ncr' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Non-Conformance Reports (NCR)
          </button>
          <button
            onClick={() => setActiveTab('safety_ptw')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'safety_ptw' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Permit to Work (PTW)
          </button>
          <button
            onClick={() => setActiveTab('material_tests')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'material_tests' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Material Test Reports
          </button>
          <button
            onClick={() => setActiveTab('tbt')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'tbt' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Daily Toolbox Talks (TBT)
          </button>
        </div>
      </div>

      {/* TAB 1: NON-CONFORMANCE REPORTS (NCR) - Pillar 16 */}
      {activeTab === 'ncr' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Quality Non-Conformance Reports (NCR) & Defect Rectification</h3>
              <p className="text-slate-500 text-[11px]">Corrective and Preventive Action (CAPA) tracking with rework financial accountability.</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[11px] block">Total Rework Cost Logged</span>
              <strong className="text-red-700 font-mono text-sm">
                ₹{ncrs.reduce((sum, n) => sum + n.reworkCostINR, 0).toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="space-y-3">
            {ncrs.map((ncr) => (
              <div key={ncr.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#004a99] text-white font-mono font-bold px-2 py-0.5 rounded text-xs">
                      {ncr.ncrCode}
                    </span>
                    <strong className="text-slate-900 text-sm">{ncr.roomZone}</strong>
                    <span className="text-slate-500">({ncr.trade})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ncr.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      ncr.severity === 'MAJOR' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {ncr.severity}
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ncr.status === 'CLOSED_VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {ncr.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold block">Defect Observation:</span>
                    <p className="text-slate-800">{ncr.description}</p>
                    <span className="text-slate-400 block text-[11px]">Root Cause: {ncr.rootCause}</span>
                  </div>

                  <div className="space-y-1 bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-blue-900 font-bold block">Corrective Action Plan (CAPA):</span>
                    <p className="text-slate-700">{ncr.correctiveActionPlan}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Assigned: <strong>{ncr.assignedContractorOrTeam}</strong></span>
                      <span>Rework Impact: <strong className="text-red-700 font-mono">₹{ncr.reworkCostINR.toLocaleString()}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  <div>
                    Inspected by: <strong>{ncr.inspectedBy}</strong> on {ncr.dateRaised}
                    {ncr.closureDate && <span className="ml-2 text-emerald-700 font-semibold">• Closed on {ncr.closureDate}</span>}
                  </div>

                  {ncr.status !== 'CLOSED_VERIFIED' && (
                    <button
                      onClick={() => handleCloseNCR(ncr.id)}
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verify & Close NCR</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PERMIT TO WORK (PTW) - Pillar 17 */}
      {activeTab === 'safety_ptw' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Site Permit to Work (PTW) Authority</h3>
              <p className="text-slate-500 text-[11px]">Mandatory safety clearance required for Hot Work, Height Work, and Electrical Isolation.</p>
            </div>
            <span className="text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
              Active Permits: {ptws.filter(p => p.status === 'ACTIVE_PERMIT').length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ptws.map((ptw) => (
              <div key={ptw.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded flex items-center justify-center text-white ${
                      ptw.permitType === 'HOT_WORK' ? 'bg-amber-600' : 'bg-blue-600'
                    }`}>
                      {ptw.permitType === 'HOT_WORK' ? <Flame className="w-3.5 h-3.5" /> : <HardHat className="w-3.5 h-3.5" />}
                    </span>
                    <strong className="text-slate-900 text-sm">{ptw.permitType.replace('_', ' ')}</strong>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px] px-2 py-0.5 rounded">
                    {ptw.ptwNumber}
                  </span>
                </div>

                <div className="text-slate-700">
                  Location: <strong className="text-slate-900">{ptw.locationArea}</strong> • Crew: <strong>{ptw.contractorOrCrew}</strong>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-amber-900 block text-[11px]">Mandatory Precautions Enforced:</span>
                  {ptw.mandatoryPrecautions.map((pre, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pre}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-600">
                  PPE Verified: <strong>{ptw.ppeEquipmentsVerified.join(', ')}</strong>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>Issued By: <strong>{ptw.issuedByOfficer}</strong></span>
                  <span>Valid: {ptw.validFrom} to {ptw.validUntil}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MATERIAL TEST REPORTS */}
      {activeTab === 'material_tests' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Material Quality Test Reports & Lab Certificates</h3>
            <span className="text-slate-500 text-[11px]">Independent QA Testing & On-Site Instrumental Verification</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Test Code</th>
                  <th className="p-3">Component / Material</th>
                  <th className="p-3">Testing Method / Agency</th>
                  <th className="p-3">Required Benchmark</th>
                  <th className="p-3">Actual Obtained Value</th>
                  <th className="p-3">Result</th>
                  <th className="p-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tests.map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#004a99]">{tr.testCode}</td>
                    <td className="p-3 font-bold text-slate-900">{tr.componentTested}</td>
                    <td className="p-3 text-slate-600 text-[11px]">{tr.labAgency}</td>
                    <td className="p-3 font-mono text-slate-600">{tr.requiredValue}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{tr.obtainedValue}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {tr.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">{tr.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TOOLBOX TALKS (TBT) */}
      {activeTab === 'tbt' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Daily Toolbox Talks (TBT) & Safety Induction Log</h3>
            <span className="text-emerald-700 font-bold">100% Attendance Enforced Before 8:30 AM Shift</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <strong className="text-slate-900 text-sm">TBT Session #44 - Electrical Safety & Cord Protection</strong>
                <span className="text-slate-500 text-[11px]">Conducted: 2026-03-12 08:15 AM by Safety Officer Arun</span>
              </div>
              <p className="text-slate-700 text-xs">
                Covered inspection of power tool cables, prohibition of open wire twisted joints, mandatory 30mA ELCB trip testing on distribution boards, and proper grounding of welding machines.
              </p>
              <div className="text-[11px] text-slate-500">
                Attendees: <strong>22 Workers Signed Log Book</strong> • Zero safety violations recorded today.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
