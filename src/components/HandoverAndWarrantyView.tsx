/**
 * Build Storys ERP - Project Handover, Snagging, DLP & Warranty Management (Pillars 22 & 23)
 * Snagging Punch List with Mobile Photos & Re-inspection Sign-offs →
 * Handover Dossier (As-Built Drawings, O&M Manuals, Key Handover) →
 * Defect Liability Period (DLP) 12-Month Countdown & Warranty Maintenance Tickets (SLA) →
 * Final Retention Release Authorization.
 */

import React, { useState } from 'react';
import {
  Key,
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  Clock,
  Wrench,
  Camera,
  AlertTriangle,
  Plus,
  ArrowRight,
  BookOpen,
  DollarSign,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';
import { ProjectRecord, UserSession, WarrantyMaintenanceTicket } from '../types/erp';

interface HandoverAndWarrantyViewProps {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
}

interface SnagItem {
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

const INITIAL_SNAGS: SnagItem[] = [
  {
    id: 'SNAG-01',
    snagNumber: 'SNAG-1402-01',
    roomLocation: 'Master Bedroom Wardrobe',
    trade: 'Carpentry',
    description: 'Bottom soft-close drawer runner sticking slightly on left side.',
    severity: 'FUNCTIONAL',
    assignedContractor: 'Royal Heritage Carpentry',
    dateLogged: '2026-03-10',
    targetResolutionDate: '2026-03-13',
    status: 'RECTIFIED',
    clientSignOff: true
  },
  {
    id: 'SNAG-02',
    snagNumber: 'SNAG-1402-02',
    roomLocation: 'Powder Room',
    trade: 'Plumbing & Sanitary',
    description: 'Kohler sensor faucet aerator requires minor descaling for smooth laminar flow.',
    severity: 'COSMETIC',
    assignedContractor: 'Precision MEP Solutions',
    dateLogged: '2026-03-11',
    targetResolutionDate: '2026-03-14',
    status: 'OPEN',
    clientSignOff: false
  },
  {
    id: 'SNAG-03',
    snagNumber: 'SNAG-1402-03',
    roomLocation: 'Balcony Glass Railing',
    trade: 'Metal & Glass',
    description: 'Protective blue peel-off tape left on stainless steel top-rail edge.',
    severity: 'COSMETIC',
    assignedContractor: 'Sky Glass Crew',
    dateLogged: '2026-03-12',
    targetResolutionDate: '2026-03-13',
    status: 'RECTIFIED',
    clientSignOff: false
  }
];

const INITIAL_TICKETS: WarrantyMaintenanceTicket[] = [
  {
    id: 'TKT-001',
    projectId: 'PROJ-SKYLINE-1402',
    projectCode: 'PROJ-SKYLINE-1402',
    ticketNumber: 'DLP-TKT-2026-01',
    clientName: 'Dr. Vikramaditya Singhania',
    componentAffected: 'Lutron dimming scene #2 in dining room',
    issueCategory: 'ELECTRICAL',
    complaintDescription: 'Lutron dimming scene #2 in dining room occasionally flickers under heavy air conditioning load.',
    slaTargetHours: 24,
    reportedDate: '2026-03-11',
    assignedTechnician: 'Sr. Automation Eng. Farhan',
    technicianPhone: '+91 98201 55644',
    resolutionStatus: 'TECHNICIAN_DISPATCHED',
    sparesConsumed: 'Firmware update required on Lutron QS processor; scheduled technician visit for Saturday 11:00 AM.',
    warrantyCovered: true,
    costIncurredINR: 0,
    clientRating: 5
  }
];

export const HandoverAndWarrantyView: React.FC<HandoverAndWarrantyViewProps> = ({
  project,
  currentUser,
  onNavigateTab
}) => {
  const [activeTab, setActiveTab] = useState<'snagging' | 'dossier' | 'dlp_warranty' | 'retention_release'>('snagging');
  const [snags, setSnags] = useState<SnagItem[]>(INITIAL_SNAGS);
  const [tickets, setTickets] = useState<WarrantyMaintenanceTicket[]>(INITIAL_TICKETS);

  // Quick Snag Add state
  const [isAddingSnag, setIsAddingSnag] = useState(false);
  const [newSnag, setNewSnag] = useState<Partial<SnagItem>>({
    roomLocation: 'Living Room',
    trade: 'Flooring',
    description: 'Minor polish touch-up near entrance threshold.',
    severity: 'COSMETIC',
    assignedContractor: 'Royal Heritage Carpentry'
  });

  const handleAddSnag = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SnagItem = {
      id: `SNAG-${Date.now()}`,
      snagNumber: `SNAG-1402-${snags.length + 1}`,
      roomLocation: newSnag.roomLocation || 'General',
      trade: newSnag.trade || 'Finishing',
      description: newSnag.description || '',
      severity: newSnag.severity || 'COSMETIC',
      assignedContractor: newSnag.assignedContractor || 'Main Contractor',
      dateLogged: new Date().toISOString().split('T')[0],
      targetResolutionDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'OPEN',
      clientSignOff: false
    };

    setSnags([...snags, created]);
    setIsAddingSnag(false);
  };

  const handleSignOffSnag = (id: string) => {
    setSnags(snags.map(s => s.id === id ? {
      ...s,
      status: 'CLIENT_ACCEPTED',
      clientSignOff: true
    } : s));
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen text-slate-800 p-4 md:p-6 space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#004a99] text-white flex items-center justify-center font-bold">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Pillars 22 & 23: Project Closure, Handover Dossier & 12-Month DLP Warranty
              </h1>
              <span className="text-xs bg-purple-100 text-purple-800 font-mono px-2 py-0.5 rounded font-bold">
                Defect Liability Period: Active (365 Days)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Pre-handover Snagging, As-Built Documentation, Warranty SLA Ticketing & Final Retention Release.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('snagging')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'snagging' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Snagging Punch-List
          </button>
          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'dossier' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Handover Dossier & As-Builts
          </button>
          <button
            onClick={() => setActiveTab('dlp_warranty')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'dlp_warranty' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            DLP Warranty Tickets
          </button>
          <button
            onClick={() => setActiveTab('retention_release')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition ${
              activeTab === 'retention_release' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            5% Retention Release Ledger
          </button>
        </div>
      </div>

      {/* TAB 1: SNAGGING PUNCH LIST (Pillar 22) */}
      {activeTab === 'snagging' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Client & Architect Pre-Handover Snagging Register</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono text-[11px] font-bold">
                  {snags.filter(s => s.status === 'CLIENT_ACCEPTED').length} / {snags.length} Cleared
                </span>
              </h3>
              <p className="text-slate-500 text-[11px]">
                Defect rectification punch-list before final keys handover and project completion certificate.
              </p>
            </div>

            <button
              onClick={() => setIsAddingSnag(true)}
              className="px-3 py-1.5 rounded bg-[#004a99] hover:bg-[#003875] text-white font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Snag Item</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Snag ID</th>
                  <th className="p-3">Location & Trade</th>
                  <th className="p-3">Defect Observation</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Assigned Subcontractor</th>
                  <th className="p-3">Target Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Client Sign-Off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {snags.map((snag) => (
                  <tr key={snag.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#004a99]">{snag.snagNumber}</td>
                    <td className="p-3">
                      <strong className="text-slate-900 block">{snag.roomLocation}</strong>
                      <span className="text-slate-500 text-[11px]">{snag.trade}</span>
                    </td>
                    <td className="p-3 text-slate-800 max-w-xs">{snag.description}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        snag.severity === 'SAFETY_CRITICAL' ? 'bg-red-100 text-red-800' :
                        snag.severity === 'FUNCTIONAL' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {snag.severity}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-medium">{snag.assignedContractor}</td>
                    <td className="p-3 font-mono text-slate-500">{snag.targetResolutionDate}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        snag.status === 'CLIENT_ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                        snag.status === 'RECTIFIED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {snag.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {snag.clientSignOff ? (
                        <span className="text-emerald-700 font-bold flex items-center justify-end gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSignOffSnag(snag.id)}
                          className="px-2.5 py-1 rounded bg-[#004a99] hover:bg-[#003875] text-white font-bold text-[11px]"
                        >
                          Sign-Off
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD SNAG */}
      {isAddingSnag && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-md w-full p-5 space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Log Pre-Handover Snag Item</h3>
              <button onClick={() => setIsAddingSnag(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddSnag} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Room / Location</label>
                <input
                  type="text"
                  value={newSnag.roomLocation}
                  onChange={(e) => setNewSnag({ ...newSnag, roomLocation: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Trade Category</label>
                <input
                  type="text"
                  value={newSnag.trade}
                  onChange={(e) => setNewSnag({ ...newSnag, trade: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Snag Description</label>
                <textarea
                  rows={2}
                  value={newSnag.description}
                  onChange={(e) => setNewSnag({ ...newSnag, description: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Severity</label>
                  <select
                    value={newSnag.severity}
                    onChange={(e) => setNewSnag({ ...newSnag, severity: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded"
                  >
                    <option value="COSMETIC">Cosmetic</option>
                    <option value="FUNCTIONAL">Functional</option>
                    <option value="SAFETY_CRITICAL">Safety Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Assigned Contractor</label>
                  <input
                    type="text"
                    value={newSnag.assignedContractor}
                    onChange={(e) => setNewSnag({ ...newSnag, assignedContractor: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddingSnag(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#004a99] text-white font-bold"
                >
                  Save Snag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: HANDOVER DOSSIER */}
      {activeTab === 'dossier' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Comprehensive Client Handover Dossier</h3>
              <p className="text-slate-500 text-[11px]">As-Built CAD drawings, OEM equipment warranties, and key handover receipts.</p>
            </div>
            <button
              onClick={() => alert('Handover Dossier PDF generated with As-Built drawing attachments!')}
              className="px-3 py-1.5 rounded bg-emerald-600 text-white font-bold text-xs flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Handover Dossier (PDF)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <FileCheck className="w-4 h-4 text-[#004a99]" />
                <span>As-Built Drawings (Rev Final)</span>
              </div>
              <p className="text-slate-600 text-xs">
                Includes architectural layout, MEP concealed piping & electrical conduit routings, HVAC ducting, and Lutron automation schematics.
              </p>
              <span className="text-[11px] text-emerald-700 font-bold block">✓ 14 Sheet PDF Signed & Timestamped</span>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <BookOpen className="w-4 h-4 text-purple-700" />
                <span>O&M Manuals & Warranties</span>
              </div>
              <p className="text-slate-600 text-xs">
                Daikin VRV AC manuals, Blum hardware lifetime warranty cards, Dr. Fixit 10-year waterproofing guarantee, and Kohler sensor faucets warranty.
              </p>
              <span className="text-[11px] text-purple-700 font-bold block">✓ 8 Manufacturer Certificates Bound</span>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Key className="w-4 h-4 text-amber-600" />
                <span>Asset & Master Keys Handover</span>
              </div>
              <p className="text-slate-600 text-xs">
                Main door biometric lock master codes, bedroom Yale mortise key sets (3 each), electrical DB panel keys, and maintenance access tags.
              </p>
              <span className="text-[11px] text-amber-800 font-bold block">✓ Physical Key Box Sign-off Form Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DLP WARRANTY TICKETS (Pillar 23) */}
      {activeTab === 'dlp_warranty' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Defect Liability Period (DLP) 365-Day Warranty SLA Helpdesk</h3>
              <p className="text-slate-500 text-[11px]">Direct client service tickets with 24-hour response and 72-hour rectification SLA.</p>
            </div>
            <button
              onClick={() => alert('New ticket created!')}
              className="px-3 py-1.5 rounded bg-[#004a99] text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Client Complaint</span>
            </button>
          </div>

          <div className="space-y-3">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#004a99] text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                      {tkt.ticketNumber}
                    </span>
                    <strong className="text-slate-900 text-sm">{tkt.issueCategory.replace('_', ' ')}</strong>
                  </div>
                  <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded">
                    {tkt.resolutionStatus.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-slate-800 text-xs">{tkt.complaintDescription}</p>

                {tkt.sparesConsumed && (
                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-950 text-xs">
                    <strong>Technician Action Plan:</strong> {tkt.sparesConsumed}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Reported by: <strong>{tkt.clientName}</strong> ({tkt.technicianPhone})</span>
                  <span>SLA Target: <strong>{tkt.slaTargetHours}h turnaround</strong></span>
                  <span>Assigned: <strong>{tkt.assignedTechnician}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RETENTION RELEASE */}
      {activeTab === 'retention_release' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Contractor 5% Retention Release Ledger</h3>
            <span className="text-slate-500">Scheduled for disbursement at DLP Expiry (March 2027)</span>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2 text-emerald-950">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              <span>Retention Release Protocol:</span>
            </div>
            <p className="text-xs">
              Subcontractors Omkar Civil Specialists and Royal Heritage Carpentry have 5% retention totaling ₹1,02,250 withheld in project escrow. Once the 365-day DLP period completes with zero unrectified snags, this ledger triggers automated clearance in Accounts & Banking (Pillar 18).
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
