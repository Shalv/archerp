import React, { useState } from 'react';
import {
  HardHat,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Clock,
  User,
  Calendar,
  Layers,
  Filter,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SnagItem, SiteExecutionMilestone } from '../types';

export const SiteExecutionView: React.FC = () => {
  const {
    activeProject,
    addSnagItem,
    updateSnagItemStatus,
    updateProject,
  } = useProject();

  const [isAddSnagOpen, setIsAddSnagOpen] = useState(false);
  const [snagRoom, setSnagRoom] = useState('');
  const [snagDescription, setSnagDescription] = useState('');
  const [snagSeverity, setSnagSeverity] = useState<SnagItem['severity']>('Medium');
  const [snagContractor, setSnagContractor] = useState('Millwork & Joinery Team');
  const [snagFilter, setSnagFilter] = useState<'All' | 'Open' | 'Closed'>('All');

  if (!activeProject) return null;

  const milestones = activeProject.executionMilestones || [];
  const snags = activeProject.snagItems || [];

  const filteredSnags = snags.filter((s) => {
    if (snagFilter === 'Open') return s.status !== 'Verified & Closed';
    if (snagFilter === 'Closed') return s.status === 'Verified & Closed';
    return true;
  });

  const openSnagCount = snags.filter((s) => s.status !== 'Verified & Closed').length;
  const criticalSnagCount = snags.filter(
    (s) => (s.severity === 'Critical' || s.severity === 'High') && s.status !== 'Verified & Closed'
  ).length;

  const handleCreateSnag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snagDescription || !snagRoom) return;
    addSnagItem(activeProject.id, {
      roomOrZone: snagRoom,
      description: snagDescription,
      severity: snagSeverity,
      assignedContractor: snagContractor,
      status: 'Open',
    });
    setSnagRoom('');
    setSnagDescription('');
    setIsAddSnagOpen(false);
  };

  const handleUpdateMilestoneProgress = (milestoneId: string, newProgress: number) => {
    const updated = milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            progressPercent: newProgress,
            status:
              newProgress === 100
                ? ('Completed' as const)
                : newProgress > 0
                ? ('In Progress' as const)
                : ('Not Started' as const),
          }
        : m
    );
    updateProject(activeProject.id, { executionMilestones: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono">
              Site Operations
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Milestone Progress &amp; Quality Punchlist
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Site Execution &amp; Snagging Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Monitor on-site work progress across architectural phases, manage snagging tickets, and track defect rectifications before final client handover.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddSnagOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Log Snagging Item</span>
          </button>
        </div>
      </div>

      {/* Execution Milestones Tracker */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Contract Workplan &amp; Milestones ({milestones.length} Phases)
            </h2>
            <p className="text-[11px] text-slate-500">
              Site supervision checkpoints and physical trade progression.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {activeProject.executionStatus}
          </span>
        </div>

        {milestones.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No execution milestones initialized yet. Promote a concept in AI Studio to auto-generate the site workplan.
          </p>
        ) : (
          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-colors space-y-2.5 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-800">
                      {m.phase}
                    </span>
                    <h3 className="font-bold text-slate-900">{m.title}</h3>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-500">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{m.leadSupervisor}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{m.targetStartDate} → {m.targetEndDate}</span>
                    </span>
                  </div>
                </div>

                {/* Progress bar + quick slider */}
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        m.progressPercent === 100
                          ? 'bg-emerald-500'
                          : m.progressPercent > 50
                          ? 'bg-indigo-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${m.progressPercent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono font-bold text-slate-800 text-[11px]">
                    {m.progressPercent}%
                  </span>
                  <div className="flex space-x-1 shrink-0">
                    {[0, 25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleUpdateMilestoneProgress(m.id, pct)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                          m.progressPercent === pct
                            ? 'bg-slate-900 text-white border-slate-900 font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Snagging & Punchlist Management */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900">
                Snagging &amp; Quality Punchlist ({snags.length} Total)
              </h2>
              {criticalSnagCount > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  {criticalSnagCount} Critical
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Audit deviations, assign rectification trades, and enforce zero-snag handover.
            </p>
          </div>

          <div className="flex items-center space-x-1 text-xs">
            {(['All', 'Open', 'Closed'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSnagFilter(filter)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  snagFilter === filter
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter} {filter === 'Open' ? `(${openSnagCount})` : ''}
              </button>
            ))}
          </div>
        </div>

        {filteredSnags.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
            <p className="font-semibold text-slate-700">No active snags in this view</p>
            <p className="text-[11px]">All quality checkpoints are either clear or verified closed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSnags.map((snag) => {
              const isClosed = snag.status === 'Verified & Closed';
              const severityColor =
                snag.severity === 'Critical'
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : snag.severity === 'High'
                  ? 'bg-orange-100 text-orange-800 border-orange-200'
                  : snag.severity === 'Medium'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200';

              return (
                <div
                  key={snag.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                    isClosed
                      ? 'bg-slate-50/70 border-slate-200/80 opacity-75'
                      : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 block">
                        Location: <strong>{snag.roomOrZone}</strong>
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                        {snag.description}
                      </h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${severityColor}`}>
                      {snag.severity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Trade: <strong>{snag.assignedContractor}</strong></span>
                    <span>Reported: {snag.reportedDate}</span>
                  </div>

                  {/* Status Controller */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">Status:</span>
                      <select
                        value={snag.status}
                        onChange={(e) => updateSnagItemStatus(activeProject.id, snag.id, e.target.value as SnagItem['status'])}
                        className="text-[11px] font-semibold px-2 py-1 rounded border border-slate-200 bg-white text-slate-800 focus:outline-none"
                      >
                        <option value="Open">Open</option>
                        <option value="In Rectification">In Rectification</option>
                        <option value="Rectified">Rectified</option>
                        <option value="Verified & Closed">Verified &amp; Closed</option>
                      </select>
                    </div>

                    {!isClosed && (
                      <button
                        type="button"
                        onClick={() => updateSnagItemStatus(activeProject.id, snag.id, 'Verified & Closed')}
                        className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verify &amp; Close</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Log Snag Modal */}
      {isAddSnagOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Log Site Snagging Defect</h3>
              <button
                type="button"
                onClick={() => setIsAddSnagOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSnag} className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Room Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bedroom, West Elevation Foyer"
                  value={snagRoom}
                  onChange={(e) => setSnagRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Defect Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Shadowline reveal uneven by 4mm; requires sand down and touch up"
                  value={snagDescription}
                  onChange={(e) => setSnagDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Severity
                  </label>
                  <select
                    value={snagSeverity}
                    onChange={(e) => setSnagSeverity(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Assigned Trade
                  </label>
                  <select
                    value={snagContractor}
                    onChange={(e) => setSnagContractor(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Carpentry & Millwork">Carpentry &amp; Millwork</option>
                    <option value="Civil & Masonry">Civil &amp; Masonry</option>
                    <option value="Electrical & MEP">Electrical &amp; MEP</option>
                    <option value="Painting & Polishing">Painting &amp; Polishing</option>
                    <option value="Glazing & Aluminum">Glazing &amp; Aluminum</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddSnagOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                >
                  Save Snag Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
