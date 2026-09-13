import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Camera,
  Layers,
  Ruler,
  Palette,
  Compass,
  Paperclip,
} from 'lucide-react';
import { ConceptOption, ArchitecturalVisualAsset } from '../types';

interface ApproveDrawingSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  concept: ConceptOption;
  clientName: string;
  onConfirmApproval: (
    approverName: string,
    approverRole: string,
    notes?: string
  ) => void;
}

export const ApproveDrawingSheetsModal: React.FC<ApproveDrawingSheetsModalProps> = ({
  isOpen,
  onClose,
  concept,
  clientName,
  onConfirmApproval,
}) => {
  const [approverName, setApproverName] = useState<string>('Ar. Sarah Chen');
  const [approverRole, setApproverRole] = useState<string>('Lead Architect');
  const [notes, setNotes] = useState<string>(
    'Technical drawings and 3D visual presentation reviewed. Dimensional integrity, daylight vectors, and finish specifications approved for permanent project baseline.'
  );

  const [checks, setChecks] = useState<{
    circulation: boolean;
    materials: boolean;
    standards: boolean;
    baselineCommit: boolean;
  }>({
    circulation: true,
    materials: true,
    standards: true,
    baselineCommit: true,
  });

  if (!isOpen) return null;

  const currentAssets = concept.stagedVisualAssets && concept.stagedVisualAssets.length > 0
    ? concept.stagedVisualAssets
    : concept.visualAssets || [];

  const allChecksPassed = Object.values(checks).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approverName.trim()) {
      alert('Please provide an approver name.');
      return;
    }
    if (!allChecksPassed) {
      alert('Please confirm all governance verification checkpoints.');
      return;
    }

    onConfirmApproval(approverName.trim(), approverRole, notes.trim());
    onClose();
  };

  const getIconForType = (type: ArchitecturalVisualAsset['type']) => {
    switch (type) {
      case 'render_3d':
        return Camera;
      case 'cad_floor_plan':
        return Ruler;
      case 'elevation_section':
        return Layers;
      case 'material_moodboard':
        return Palette;
      case 'massing_schematic':
        return Compass;
      case 'client_reference':
      default:
        return Paperclip;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono">
                Architectural Governance Sign-Off
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">
                Approve &amp; Save Drawing Sheets
              </h2>
              <p className="text-xs text-slate-300">
                Option {concept.optionNumber}: {concept.title} ({clientName})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Sheets Summary */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              Sheets Being Approved &amp; Committed to Baseline ({currentAssets.length} Sheets)
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {currentAssets.map((asset, i) => {
                const Icon = getIconForType(asset.type);
                return (
                  <div
                    key={asset.id || i}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <div className="p-1 rounded bg-slate-200 text-slate-700">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-slate-800 truncate">
                        {asset.title}
                      </span>
                      {asset.drawingNumber && (
                        <span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          {asset.drawingNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      {asset.isCustomUpload && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                          Custom Upload
                        </span>
                      )}
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        Ready to Commit
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Governance Verification Checkpoints */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-xs font-bold text-slate-900 block">
              Architectural Verification Checkpoints
            </span>

            <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.circulation}
                onChange={(e) => setChecks((prev) => ({ ...prev, circulation: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Spatial zoning and functional circulation validated against client brief</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.materials}
                onChange={(e) => setChecks((prev) => ({ ...prev, materials: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Specified material swatches match client budget tier and sustainability targets</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.standards}
                onChange={(e) => setChecks((prev) => ({ ...prev, standards: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Drawing sheet resolutions and technical notes meet studio presentation standards</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={checks.baselineCommit}
                onChange={(e) => setChecks((prev) => ({ ...prev, baselineCommit: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-900">
                Authorize permanent baseline save to project records and downstream BOQ
              </span>
            </label>
          </div>

          {/* Approver Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Authorized Sign-Off Name
              </label>
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                placeholder="e.g. Ar. Sarah Chen"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Approval Role
              </label>
              <select
                value={approverRole}
                onChange={(e) => setApproverRole(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="Lead Architect">Lead Architect</option>
                <option value="Principal Architect">Principal Architect</option>
                <option value="Design Director">Design Director</option>
                <option value="Client Sign-Off">Client Sign-Off</option>
                <option value="Project Manager">Project Manager</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Approval Sign-Off Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter sign-off comments, client approvals, or milestone instructions..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Notice */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-2 text-xs text-emerald-900">
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Permanent Baseline Commitment:</span>
              <span>
                Once confirmed, these drawing sheets and 3D visual presentation will be permanently saved to the project baseline, logged in the CRM audit trail, and made available for downstream deliverables.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!allChecksPassed || !approverName.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-xs disabled:opacity-50 flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Approval &amp; Save to Baseline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
