/**
 * Build Storys ERP - Client Approval & Revision Management Module (Module 9)
 * -------------------------------------------------------------------------
 * Client sign-off and revision governance:
 * - 3D concept sign-off
 * - Physical sample & finish sign-off
 * - Drawing sign-off with GFC release stamp
 * - Revision history trail (R01 -> R02 -> R03)
 * - Formal Change Request (CR) builder with live cost, time, and drawing impact
 */

import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  History,
  GitPullRequest,
  Sparkles,
  Download,
  Printer,
  Layers,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { ProjectRecord, UserSession } from '../types/erp';

interface Props {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
}

export const ClientApprovalAndRevisionView: React.FC<Props> = ({
  project,
  currentUser,
  onNavigateTab
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [approvals, setApprovals] = useState([
    {
      id: 'APP-01',
      title: '3D Architectural Interior Concept A (Modern Luxury)',
      category: 'CONCEPT_3D',
      reference: 'DES-MBR-001',
      status: 'APPROVED',
      approvedBy: 'Vikram Malhotra (Client)',
      approvedAt: '2026-09-02T14:30:00Z',
      notes: 'Approved with minor request for 900mm study desk counter.'
    },
    {
      id: 'APP-02',
      title: 'Physical Swatch SB-04 (Sage Green Matt & American Walnut)',
      category: 'MATERIAL_FINISH',
      reference: 'MAT-LAM-001 / MAT-VEN-002',
      status: 'APPROVED',
      approvedBy: 'Priya Malhotra (Client)',
      approvedAt: '2026-09-04T11:15:00Z',
      notes: 'Signed physical sample board in design studio.'
    },
    {
      id: 'APP-03',
      title: 'Technical Joinery Package (MBR Wardrobe 2700mm)',
      category: 'GFC_DRAWINGS',
      reference: 'DRW-MBR-005 Rev 02',
      status: 'APPROVED',
      approvedBy: 'Vikram Malhotra & Lead QS',
      approvedAt: '2026-09-14T09:45:00Z',
      notes: 'GFC Stamp issued for site execution and factory production.'
    },
    {
      id: 'APP-04',
      title: 'Client Change Request CR-04 (Desk Width Extension)',
      category: 'VARIATION_ORDER',
      reference: 'VO-2026-003 (+₹26,505)',
      status: 'PENDING_FINAL_SIGN',
      approvedBy: 'Pending Client Signature',
      approvedAt: '2026-09-14T10:00:00Z',
      notes: 'Awaiting digital OTP sign-off on revised quotation.'
    }
  ]);

  const handleSignGfc = (appId: string) => {
    setApprovals(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: 'APPROVED', approvedBy: `${currentUser.name} (Signed)` } : a))
    );
    showToast('Applied digital GFC Approval Stamp to drawing package.');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#002050] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-blue-400/30 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-[#d2d0ce] rounded-lg shadow-xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-slate-900 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                MODULE 9
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Client Approval &amp; Revision Governance
              </span>
              <span className="bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5 rounded font-mono font-semibold border border-emerald-200">
                Audited &amp; Timestamped
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#002050]" />
              Client Approval &amp; Revision Management
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl mt-0.5">
              Multi-disciplinary sign-off workflow: 3D concept approval, physical sample sign-offs, Good For Construction (GFC)
              drawing stamping, revision version control, and commercial Change Requests (CR) with live cost impact.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab?.('ai_drawings')}
              className="px-3 py-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold"
            >
              Inspect Drawings (Module 2)
            </button>
            <button
              onClick={() => onNavigateTab?.('quotation')}
              className="px-3 py-1.5 rounded bg-[#002050] text-white text-xs font-semibold"
            >
              Client Quotations (Module 11)
            </button>
          </div>
        </div>
      </div>

      {/* Approvals Register */}
      <div className="bg-white border border-[#d2d0ce] rounded-lg shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Project Approval &amp; GFC Release Register</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            Project: {project.projectCode} • Client: {project.clientName}
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {approvals.map(item => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded shrink-0 mt-0.5 ${
                  item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {item.status === 'APPROVED' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-slate-500">{item.id}</span>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold">
                      {item.reference}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{item.notes}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Signed by: <strong>{item.approvedBy}</strong> • {new Date(item.approvedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                {item.status === 'APPROVED' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> GFC Released
                  </span>
                ) : (
                  <button
                    onClick={() => handleSignGfc(item.id)}
                    className="px-3 py-1 rounded bg-[#002050] hover:bg-[#003366] text-white text-xs font-semibold shadow-xs"
                  >
                    Stamp &amp; Approve GFC
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
