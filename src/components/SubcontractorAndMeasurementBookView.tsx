/**
 * Build Storys ERP - Subcontractor Management & Joint Measurement Book (MB) (Pillars 11 & 15)
 * Subcontractor Master & Trade Contracts → Work Orders (SCWO) →
 * Physical Joint Measurement Book (MB) with L x W x H Formulas, Engineer Sign-offs,
 * Running Account (RA) Bills calculation with 5% Retention & Advance Recovery.
 */

import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Printer,
  Search,
  DollarSign,
  Scale,
  Calendar,
  Layers,
  ArrowRight,
  HardHat,
  Star
} from 'lucide-react';
import { ProjectRecord, UserSession, SubcontractWorkOrder, MeasurementBookEntry } from '../types/erp';

interface SubcontractorAndMeasurementBookViewProps {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
}

interface SubcontractorPartner {
  id: string;
  vendorNo: string;
  name: string;
  trade: string;
  contactPerson: string;
  phone: string;
  crewStrength: number;
  gstin: string;
  rating: number; // 1-5
  safetyCompliance: 'VERIFIED_OK' | 'EXPIRED_DOCS';
  activeProjects: number;
  totalCertifiedAmountINR: number;
  retentionAccumulatedINR: number;
}

const INITIAL_SUBCONTRACTORS: SubcontractorPartner[] = [
  {
    id: 'SC-01',
    vendorNo: 'SC-301',
    name: 'Omkar Civil & Waterproofing Specialists',
    trade: 'CIVIL_MASONRY & WATERPROOFING',
    contactPerson: 'Mukesh Sharma (Foreman)',
    phone: '+91 98214 77810',
    crewStrength: 14,
    gstin: '27AAKFO9981D1ZX',
    rating: 4.8,
    safetyCompliance: 'VERIFIED_OK',
    activeProjects: 2,
    totalCertifiedAmountINR: 485000,
    retentionAccumulatedINR: 24250
  },
  {
    id: 'SC-02',
    vendorNo: 'SC-302',
    name: 'Royal Heritage Carpentry & Millwork Works',
    trade: 'CARPENTRY_JOINERY',
    contactPerson: 'Ustad Ramji Mistry',
    phone: '+91 98190 23412',
    crewStrength: 18,
    gstin: '27AAMPR4412B1Z8',
    rating: 4.9,
    safetyCompliance: 'VERIFIED_OK',
    activeProjects: 3,
    totalCertifiedAmountINR: 1240000,
    retentionAccumulatedINR: 62000
  },
  {
    id: 'SC-03',
    vendorNo: 'SC-303',
    name: 'Precision MEP & Smart Automation Solutions',
    trade: 'ELECTRICAL_AUTOMATION & HVAC',
    contactPerson: 'Imran Siddiqui',
    phone: '+91 99201 88345',
    crewStrength: 8,
    gstin: '27AAACI7721K1ZM',
    rating: 4.6,
    safetyCompliance: 'VERIFIED_OK',
    activeProjects: 1,
    totalCertifiedAmountINR: 320000,
    retentionAccumulatedINR: 16000
  }
];

const INITIAL_WORK_ORDERS: SubcontractWorkOrder[] = [
  {
    id: 'WO-01',
    woNumber: 'SCWO-2026-01',
    contractorName: 'Omkar Civil & Waterproofing Specialists',
    trade: 'CIVIL_MASONRY',
    agreedLabourRatePerUnit: 'Demolition ₹22/sq.ft, Waterproofing ₹45/sq.ft',
    contractValue: 485000,
    certifiedWorkDoneValue: 340000,
    retentionWithheld: 17000, // 5%
    amountPaid: 285000,
    status: 'ACTIVE_EXECUTION'
  },
  {
    id: 'WO-02',
    woNumber: 'SCWO-2026-02',
    contractorName: 'Royal Heritage Carpentry & Millwork Works',
    trade: 'CARPENTRY_JOINERY',
    agreedLabourRatePerUnit: 'Wardrobe Joinery ₹280/sq.ft, Modular carcass ₹320/sq.ft',
    contractValue: 1240000,
    certifiedWorkDoneValue: 560000,
    retentionWithheld: 28000, // 5%
    amountPaid: 450000,
    status: 'ACTIVE_EXECUTION'
  }
];

const INITIAL_MB_ENTRIES: MeasurementBookEntry[] = [
  {
    id: 'MB-001',
    projectId: 'PROJ-SKYLINE-1402',
    mbNumber: 'MB-PAGE-14',
    workOrderId: 'WO-01',
    contractorName: 'Omkar Civil & Waterproofing Specialists',
    itemCode: 'DEM-01',
    trade: 'DEMOLITION_DISPOSAL',
    description: 'Dismantling non-load-bearing brick partition wall between dining & study including bagging and disposal.',
    locationRoom: '14th Floor - Dining & Study',
    measurementFormula: 'L: 12.0 ft * H: 9.5 ft = 114.0 sq.ft',
    unit: 'sq.ft',
    contractRate: 22,
    previousQuantity: 0,
    currentQuantity: 114,
    cumulativeQuantity: 114,
    totalCertifiedAmount: 2508,
    cumulativeCertifiedAmount: 2508,
    siteEngineerVerification: true,
    siteEngineerName: 'Site Eng. Rajesh Sharma',
    consultantApproval: true,
    consultantName: 'PMC Consultant K. N. Rao',
    certifiedDate: '2026-03-02',
    status: 'APPROVED_FOR_BILLING',
    notes: 'Joint measurement verified with digital disto meter. Debris cleared via freight elevator.'
  },
  {
    id: 'MB-002',
    projectId: 'PROJ-SKYLINE-1402',
    mbNumber: 'MB-PAGE-15',
    workOrderId: 'WO-01',
    contractorName: 'Omkar Civil & Waterproofing Specialists',
    itemCode: 'WTR-01',
    trade: 'WATERPROOFING',
    description: 'Dr. Fixit Fastflex 2 coats acrylic elastomeric waterproofing on toilet sunken slab with 72-hr ponding test.',
    locationRoom: 'Master Ensuite Bathroom',
    measurementFormula: 'Floor: 8ft * 6.5ft = 52 sq.ft; Dado: 2*(8+6.5)*7ft = 203 sq.ft',
    unit: 'sq.ft',
    contractRate: 45,
    previousQuantity: 0,
    currentQuantity: 255,
    cumulativeQuantity: 255,
    totalCertifiedAmount: 11475,
    cumulativeCertifiedAmount: 11475,
    siteEngineerVerification: true,
    siteEngineerName: 'Site Eng. Rajesh Sharma',
    consultantApproval: true,
    consultantName: 'PMC Consultant K. N. Rao',
    certifiedDate: '2026-03-05',
    status: 'APPROVED_FOR_BILLING',
    notes: 'Ponding test certified for 72 hours with 0mm seepage on 13th-floor ceiling below.'
  },
  {
    id: 'MB-003',
    projectId: 'PROJ-SKYLINE-1402',
    mbNumber: 'MB-PAGE-16',
    workOrderId: 'WO-02',
    contractorName: 'Royal Heritage Carpentry & Millwork Works',
    itemCode: 'CARP-01',
    trade: 'CARPENTRY_JOINERY',
    description: 'CenturyPly 18mm BWP marine ply wardrobe carcass fabrication with Blum hardware fittings.',
    locationRoom: 'Master Bedroom Wardrobe Zone',
    measurementFormula: 'Wardrobe A: 9ft * 9.5ft = 85.5 sq.ft; Dresser: 4ft * 7ft = 28 sq.ft',
    unit: 'sq.ft',
    contractRate: 280,
    previousQuantity: 0,
    currentQuantity: 113.5,
    cumulativeQuantity: 113.5,
    totalCertifiedAmount: 31780,
    cumulativeCertifiedAmount: 31780,
    siteEngineerVerification: true,
    siteEngineerName: 'Site Eng. Rajesh Sharma',
    consultantApproval: false,
    consultantName: 'PMC Consultant K. N. Rao',
    certifiedDate: '2026-03-12',
    status: 'ENGINEER_VERIFIED',
    notes: 'Plumb and square alignment verified with laser cross-line level.'
  }
];

export const SubcontractorAndMeasurementBookView: React.FC<SubcontractorAndMeasurementBookViewProps> = ({
  project,
  currentUser,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'mb' | 'contractors' | 'work_orders' | 'ra_bills'>('mb');
  const [subcontractors, setSubcontractors] = useState<SubcontractorPartner[]>(INITIAL_SUBCONTRACTORS);
  const [workOrders, setWorkOrders] = useState<SubcontractWorkOrder[]>(INITIAL_WORK_ORDERS);
  const [mbEntries, setMbEntries] = useState<MeasurementBookEntry[]>(INITIAL_MB_ENTRIES);

  // New MB Entry Form Modal state
  const [isAddingMB, setIsAddingMB] = useState(false);
  const [newMB, setNewMB] = useState<Partial<MeasurementBookEntry>>({
    contractorName: INITIAL_SUBCONTRACTORS[0].name,
    itemCode: 'TIL-01',
    trade: 'FLOORING_TILING',
    description: 'Italian marble laying on living room floor with diamond polishing',
    locationRoom: 'Living & Dining Area',
    measurementFormula: 'L: 26.5 ft * W: 18.0 ft = 477 sq.ft',
    unit: 'sq.ft',
    contractRate: 85,
    previousQuantity: 0,
    currentQuantity: 477
  });

  const handleAddMBEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const currQty = Number(newMB.currentQuantity) || 0;
    const rate = Number(newMB.contractRate) || 0;
    const amount = currQty * rate;

    const created: MeasurementBookEntry = {
      id: `MB-${Date.now()}`,
      projectId: project.id,
      mbNumber: `MB-PAGE-${mbEntries.length + 15}`,
      workOrderId: 'WO-01',
      contractorName: newMB.contractorName || 'Omkar Civil Specialists',
      itemCode: newMB.itemCode || 'GEN-01',
      trade: newMB.trade || 'CIVIL_MASONRY',
      description: newMB.description || '',
      locationRoom: newMB.locationRoom || '',
      measurementFormula: newMB.measurementFormula || '',
      unit: newMB.unit || 'sq.ft',
      contractRate: rate,
      previousQuantity: Number(newMB.previousQuantity) || 0,
      currentQuantity: currQty,
      cumulativeQuantity: currQty + (Number(newMB.previousQuantity) || 0),
      totalCertifiedAmount: amount,
      cumulativeCertifiedAmount: amount,
      siteEngineerVerification: true,
      siteEngineerName: currentUser.name,
      consultantApproval: false,
      consultantName: 'PMC Consultant K. N. Rao',
      certifiedDate: new Date().toISOString().split('T')[0],
      status: 'ENGINEER_VERIFIED'
    };

    setMbEntries([...mbEntries, created]);
    setIsAddingMB(false);
  };

  const handleConsultantApproveMB = (id: string) => {
    setMbEntries(mbEntries.map(m => m.id === id ? {
      ...m,
      consultantApproval: true,
      status: 'APPROVED_FOR_BILLING'
    } : m));
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen text-slate-800 p-4 md:p-6 space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#004a99] text-white flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Pillars 11 & 15: Subcontractor Master & Joint Measurement Book (MB)
              </h1>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded font-bold">
                Formula Taking-Offs + 5% Retention Protection
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Site Engineer & Consultant Certified Quantities, Work Orders (SCWO) & Running Account (RA) Bills.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('mb')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'mb' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Measurement Book (MB) Sheets
          </button>
          <button
            onClick={() => setActiveTab('work_orders')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'work_orders' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Subcontract Work Orders (SCWO)
          </button>
          <button
            onClick={() => setActiveTab('contractors')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'contractors' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Subcontractor Master & Compliance
          </button>
          <button
            onClick={() => setActiveTab('ra_bills')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'ra_bills' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            RA Bills & Retention Summary
          </button>
        </div>
      </div>

      {/* TAB 1: MEASUREMENT BOOK (MB) - Pillar 15 Core */}
      {activeTab === 'mb' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Joint Measurement Book (MB) Register</span>
                <span className="bg-blue-50 text-[#004a99] px-2 py-0.5 rounded font-mono text-[11px] font-bold">
                  Certified Value: ₹{mbEntries.reduce((sum, m) => sum + m.totalCertifiedAmount, 0).toLocaleString()}
                </span>
              </h3>
              <p className="text-slate-500 text-[11px]">
                Physical dimensions taken jointly by Site Engineer and Trade Foreman with laser disto meters.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingMB(true)}
                className="px-3 py-1.5 rounded bg-[#004a99] hover:bg-[#003875] text-white font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record New MB Measurement</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">MB Page & Item</th>
                  <th className="p-3">Subcontractor</th>
                  <th className="p-3">Location & Description</th>
                  <th className="p-3">Formula / Dimension Takeoff</th>
                  <th className="p-3 text-center">Prev Qty</th>
                  <th className="p-3 text-center">Current Qty</th>
                  <th className="p-3 text-center">Cumul Qty</th>
                  <th className="p-3">Rate (₹)</th>
                  <th className="p-3">Certified (₹)</th>
                  <th className="p-3">Sign-offs</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mbEntries.map((mb) => (
                  <tr key={mb.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono">
                      <strong className="text-[#004a99] block">{mb.mbNumber}</strong>
                      <span className="text-slate-400 text-[10px]">{mb.itemCode}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{mb.contractorName}</td>
                    <td className="p-3 max-w-xs">
                      <span className="text-blue-900 font-bold block text-[11px]">{mb.locationRoom}</span>
                      <span className="text-slate-600 text-[11px] line-clamp-2">{mb.description}</span>
                    </td>
                    <td className="p-3 font-mono bg-amber-50/50 text-amber-950 text-[11px] rounded border border-amber-100">
                      {mb.measurementFormula}
                    </td>
                    <td className="p-3 text-center font-mono text-slate-400">{mb.previousQuantity}</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-900">{mb.currentQuantity} {mb.unit}</td>
                    <td className="p-3 text-center font-mono text-slate-600">{mb.cumulativeQuantity} {mb.unit}</td>
                    <td className="p-3 font-mono">₹{mb.contractRate}</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">₹{mb.totalCertifiedAmount.toLocaleString()}</td>
                    <td className="p-3 text-[10px]">
                      <div className="flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Eng: {mb.siteEngineerVerification ? 'Signed' : 'Pending'}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${mb.consultantApproval ? 'text-emerald-700' : 'text-amber-600'}`}>
                        {mb.consultantApproval ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>PMC: {mb.consultantApproval ? 'Approved' : 'Pending'}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      {!mb.consultantApproval ? (
                        <button
                          onClick={() => handleConsultantApproveMB(mb.id)}
                          className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px]"
                        >
                          PMC Sign-Off
                        </button>
                      ) : (
                        <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold text-[10px]">
                          Approved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-emerald-50 p-3 rounded border border-emerald-200 text-emerald-950 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Statutory Measurement Book Protocol:</strong> Any variation exceeding 10% of BOQ baseline triggers a mandatory Variation Order (VO) in Module 12.
              </span>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('traceability')}
              className="text-emerald-800 font-bold hover:underline flex items-center gap-1"
            >
              <span>View in Cost Traceability Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL: RECORD NEW MB MEASUREMENT */}
      {isAddingMB && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-lg w-full p-5 space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Record Joint Measurement Book (MB) Entry</h3>
              <button onClick={() => setIsAddingMB(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddMBEntry} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Subcontractor Partner</label>
                <select
                  value={newMB.contractorName}
                  onChange={(e) => setNewMB({ ...newMB, contractorName: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded"
                >
                  {subcontractors.map(sc => (
                    <option key={sc.id} value={sc.name}>{sc.name} ({sc.trade})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Item Code</label>
                  <input
                    type="text"
                    value={newMB.itemCode}
                    onChange={(e) => setNewMB({ ...newMB, itemCode: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Location / Room Zone</label>
                  <input
                    type="text"
                    value={newMB.locationRoom}
                    onChange={(e) => setNewMB({ ...newMB, locationRoom: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Item Work Description</label>
                <input
                  type="text"
                  value={newMB.description}
                  onChange={(e) => setNewMB({ ...newMB, description: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Measurement Formula (L x W x H)</label>
                <input
                  type="text"
                  placeholder="e.g. L: 20ft * W: 15ft = 300 sq.ft"
                  value={newMB.measurementFormula}
                  onChange={(e) => setNewMB({ ...newMB, measurementFormula: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Current Qty</label>
                  <input
                    type="number"
                    value={newMB.currentQuantity}
                    onChange={(e) => setNewMB({ ...newMB, currentQuantity: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Unit</label>
                  <input
                    type="text"
                    value={newMB.unit}
                    onChange={(e) => setNewMB({ ...newMB, unit: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Agreed Rate (₹)</label>
                  <input
                    type="number"
                    value={newMB.contractRate}
                    onChange={(e) => setNewMB({ ...newMB, contractRate: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddingMB(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#004a99] text-white font-bold"
                >
                  Save & Verify Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: WORK ORDERS (SCWO) */}
      {activeTab === 'work_orders' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Subcontract Work Orders (SCWO) Register</h3>
            <span className="text-slate-500">Agreed Labour Contracts with 5% Retention Clauses</span>
          </div>

          <div className="space-y-3">
            {workOrders.map((wo) => (
              <div key={wo.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#004a99] text-white font-mono font-bold px-2 py-0.5 rounded text-xs">
                      {wo.woNumber}
                    </span>
                    <strong className="text-slate-900 text-sm">{wo.contractorName}</strong>
                    <span className="text-slate-500 text-[11px]">({wo.trade})</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {wo.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Agreed Contract Value</span>
                    <strong className="text-slate-900 font-mono">₹{wo.contractValue.toLocaleString()}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Work Certified (MB)</span>
                    <strong className="text-emerald-700 font-mono">₹{wo.certifiedWorkDoneValue.toLocaleString()}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">5% Retention Withheld</span>
                    <strong className="text-amber-700 font-mono">₹{wo.retentionWithheld.toLocaleString()}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Net Amount Disbursed</span>
                    <strong className="text-[#004a99] font-mono">₹{wo.amountPaid.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100">
                  Contract Rates: <strong>{wo.agreedLabourRatePerUnit}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SUBCONTRACTORS MASTER */}
      {activeTab === 'contractors' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Subcontractor Master & Safety Compliance</h3>
            <span className="text-slate-500">KYC, GSTIN & Safety Insurance Verification</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Vendor Code</th>
                  <th className="p-3">Firm Name</th>
                  <th className="p-3">Trade Category</th>
                  <th className="p-3">Foreman & Phone</th>
                  <th className="p-3 text-center">Crew Size</th>
                  <th className="p-3">GSTIN</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Safety Compliance</th>
                  <th className="p-3 font-mono">5% Retention Held</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subcontractors.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-[#004a99] font-bold">{sc.vendorNo}</td>
                    <td className="p-3 font-bold text-slate-900">{sc.name}</td>
                    <td className="p-3 text-slate-600 text-[11px] font-mono">{sc.trade}</td>
                    <td className="p-3">
                      <div>{sc.contactPerson}</div>
                      <div className="text-slate-400 text-[10px]">{sc.phone}</div>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800">{sc.crewStrength} workers</td>
                    <td className="p-3 font-mono text-slate-500 text-[11px]">{sc.gstin}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{sc.rating}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold text-[10px]">
                        {sc.safetyCompliance}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-700">
                      ₹{sc.retentionAccumulatedINR.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RA BILLS & RETENTION SUMMARY */}
      {activeTab === 'ra_bills' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Running Account (RA) Bills & Retention Accounting</h3>
            <span className="text-slate-500">Defect Liability Period (DLP) Release Ledger</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded border border-slate-200 bg-slate-50">
              <span className="text-slate-400 block text-[10px]">Total Certified Work (MB)</span>
              <div className="text-lg font-bold text-emerald-700 font-mono">
                ₹{(workOrders.reduce((sum, w) => sum + w.certifiedWorkDoneValue, 0) / 100000).toFixed(2)} Lakhs
              </div>
            </div>
            <div className="p-3 rounded border border-slate-200 bg-slate-50">
              <span className="text-slate-400 block text-[10px]">5% Retention Withheld Under Contract</span>
              <div className="text-lg font-bold text-amber-700 font-mono">
                ₹{(workOrders.reduce((sum, w) => sum + w.retentionWithheld, 0) / 100000).toFixed(2)} Lakhs
              </div>
              <span className="text-[10px] text-slate-500">Release upon 12-month DLP completion</span>
            </div>
            <div className="p-3 rounded border border-slate-200 bg-slate-50">
              <span className="text-slate-400 block text-[10px]">Net Disbursed to Contractors</span>
              <div className="text-lg font-bold text-[#004a99] font-mono">
                ₹{(workOrders.reduce((sum, w) => sum + w.amountPaid, 0) / 100000).toFixed(2)} Lakhs
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
