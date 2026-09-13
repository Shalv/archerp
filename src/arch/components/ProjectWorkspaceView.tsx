import React from 'react';
import {
  Building,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Maximize2,
  Sparkles,
  Layers,
  FileSpreadsheet,
  HardHat,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Compass,
  Palette
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { formatINR } from '../utils/currency';

interface ProjectWorkspaceViewProps {
  onNavigateTab: (tab: string) => void;
}

export const ProjectWorkspaceView: React.FC<ProjectWorkspaceViewProps> = ({ onNavigateTab }) => {
  const { activeProject, projects, setActiveProjectId } = useProject();

  if (!activeProject) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4">
        <Building className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">No Active Project Selected</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Please choose a project from the pipeline or select one of the existing records below:
        </p>
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProjectId(p.id)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              {p.enquiryNumber} • {p.clientName}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const selectedConcept = activeProject.conceptOptions?.find(
    c => c.id === activeProject.selectedConceptId || c.isSelectedConcept
  ) || activeProject.conceptOptions?.[0];

  const completedMilestones = activeProject.executionMilestones?.filter(m => m.status === 'Completed').length || 0;
  const totalMilestones = activeProject.executionMilestones?.length || 1;
  const overallExecutionPercent = Math.round((completedMilestones / totalMilestones) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Banner & Title Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 mb-1">
              <span>{activeProject.enquiryNumber}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono">
                {activeProject.engagementType}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {activeProject.clientName}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeProject.siteAddress || activeProject.siteCity}</span>
              <span>•</span>
              <span>{activeProject.organizationOrFamily}</span>
            </p>
          </div>

          {/* Quick Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activeProject.salesStage}</span>
            </span>

            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {activeProject.designStatus}
            </span>

            <button
              onClick={() => onNavigateTab('ai-studio')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Open AI Design Studio</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Built-Up Area
            </span>
            <span className="text-base font-bold text-slate-800 font-mono">
              {activeProject.builtUpAreaSqFt?.toLocaleString()} sq.ft
            </span>
            <span className="text-[10px] text-slate-400 block">
              Site: {activeProject.siteAreaSqFt?.toLocaleString()} sq.ft
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Commercial Budget
            </span>
            <span className="text-base font-bold text-slate-800 font-mono">
              {formatINR(activeProject.targetBudget)}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {activeProject.budgetTier}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Execution Progress
            </span>
            <span className="text-base font-bold text-slate-800 font-mono">
              {overallExecutionPercent}%
            </span>
            <span className="text-[10px] text-slate-400 block">
              {completedMilestones} of {totalMilestones} Milestones
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Active Concept
            </span>
            <span className="text-base font-bold text-indigo-600 truncate block">
              {selectedConcept ? `Option ${selectedConcept.optionNumber}` : 'Drafting'}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {selectedConcept?.themeStyle || 'Pending Selection'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Architectural Concepts & Next Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Concept Preview Card */}
          {selectedConcept && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Approved Concept: Option {selectedConcept.optionNumber} — {selectedConcept.title}
                    </h3>
                    <span className="text-[11px] text-indigo-600 font-semibold">
                      {selectedConcept.themeStyle}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('ai-studio')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <span>View Full Design Pack</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Render Image & Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                  <img
                    src={selectedConcept.visualAssets?.[0]?.imageUrl || '/assets/images/minimalist_concept_render_1789216644600.jpg'}
                    alt={selectedConcept.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-mono">
                    Option {selectedConcept.optionNumber} 3D Render
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-600 line-clamp-3 leading-relaxed">
                    {selectedConcept.architecturalNarrative}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Sustainability Score:</span>
                      <span className="font-bold text-emerald-600">{selectedConcept.sustainabilityScore}/100</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Est. Square Foot Cost:</span>
                      <span className="font-bold text-slate-800 font-mono">₹{selectedConcept.estimatedCostPerSqFt?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Drawing Sheets Status:</span>
                      <span className="font-bold text-indigo-600">
                        {selectedConcept.drawingSheetsApproved ? 'GFC Approved' : 'Draft In Review'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Client Brief & Confirmed Program */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Confirmed Spatial Program & Brief</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeProject.confirmedRequirements?.projectVision}
            </p>

            <div>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Room Zones
              </span>
              <div className="flex flex-wrap gap-2">
                {(activeProject.confirmedRequirements?.roomZones || []).map((zone, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                  >
                    {zone}
                  </span>
                ))}
              </div>
            </div>

            {activeProject.confirmedRequirements?.specialConstraints && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Special Constraints:</span>
                {activeProject.confirmedRequirements.specialConstraints}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Navigation & Next Action */}
        <div className="space-y-6">
          {/* Next Immediate Action Card */}
          {activeProject.nextAction && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Immediate Next Action</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeProject.nextAction.priority === 'Urgent' || activeProject.nextAction.priority === 'Critical'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {activeProject.nextAction.priority}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900">
                {activeProject.nextAction.actionTitle}
              </h4>

              <div className="text-[11px] text-slate-500 space-y-1">
                <div>Assignee: <strong>{activeProject.nextAction.assigneeName}</strong> ({activeProject.nextAction.assigneeRole})</div>
                <div>Due Date: <strong>{activeProject.nextAction.dueDate}</strong></div>
              </div>
            </div>
          )}

          {/* Module Navigation Jump Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Project Lifecycle Modules
            </h4>

            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('ai-studio')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-800">AI Design Studio</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button
                onClick={() => onNavigateTab('boq')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-800">BOQ & Commercials</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button
                onClick={() => onNavigateTab('execution')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <HardHat className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-800">Site Execution Milestones</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button
                onClick={() => onNavigateTab('billing')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Receipt className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-800">Billing & Warranty</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>

              <button
                onClick={() => onNavigateTab('analytics')}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-800">Data Analytics & Audit</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
