import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Phone,
  Calendar,
  MapPin,
  Mail,
  User,
  Sparkles,
  FileSpreadsheet,
  Building2,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  CheckSquare,
  Square,
  Briefcase,
  ChevronRight,
  ThumbsUp,
  XCircle,
  Plus,
  Send,
  BrainCircuit,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { formatINR } from '../utils/currency';
import { calculateProjectDataScienceProfile } from '../utils/dataScienceEngine';
import {
  ProjectCustomer,
  SalesStage,
  CRM_SALES_STAGES_ORDER,
  STAGE_WIN_PROBABILITIES,
  CRMActivity,
} from '../types';
import {
  SalesStageBadge,
  EngagementBadge,
  DesignStatusBadge,
  ExecutionStatusBadge,
} from './StatusBadges';

interface DealCockpitDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectCustomer | null;
  onNavigateTab: (tab: string, projectId: string) => void;
}

// Stage-specific qualification gates
const STAGE_GATES: Record<SalesStage, { id: string; label: string }[]> = {
  'New Enquiry': [
    { id: 'enq_contact', label: 'Primary client contact & channels verified' },
    { id: 'enq_location', label: 'Site location & municipal jurisdiction confirmed' },
    { id: 'enq_budget', label: 'Target budget range & timeline communicated' },
    { id: 'enq_scope', label: 'Engagement route classified (Turnkey, Design, etc.)' },
  ],
  'Site Survey': [
    { id: 'surv_visit', label: 'Physical site walk-through & reconnaissance conducted' },
    { id: 'surv_measure', label: 'Laser dimensions & built-up square footage checked' },
    { id: 'surv_mep', label: 'Existing structural & MEP entry points documented' },
    { id: 'surv_photos', label: 'High-res site survey photograph catalog archived' },
  ],
  'Requirement Confirmed': [
    { id: 'req_zones', label: 'Room zones & spatial program allocations locked' },
    { id: 'req_style', label: 'Aesthetic theme & material palette preferences defined' },
    { id: 'req_constraints', label: 'Technical constraints (HVAC, ceiling heights) vetted' },
    { id: 'req_signoff', label: 'Client confirmed formal design brief' },
  ],
  'Concept Pitch': [
    { id: 'con_ai_gen', label: '4-5 distinctive architectural options synthesized' },
    { id: 'con_visuals', label: 'Photorealistic 3D perspectives & CAD floor plans rendered' },
    { id: 'con_pitch_held', label: 'Concept pitch presentation delivered to decision-makers' },
    { id: 'con_feedback', label: 'Client review & preferred design direction captured' },
  ],
  'Commercial Proposal': [
    { id: 'boq_drafted', label: 'Itemized BOQ revision generated from trade masters' },
    { id: 'boq_margin', label: 'Trade margins & contingency allocations validated' },
    { id: 'boq_delivered', label: 'Comprehensive commercial proposal sent to client' },
    { id: 'boq_terms', label: 'Payment milestone structure outlined' },
  ],
  'Negotiation': [
    { id: 'neg_meeting', label: 'Commercial review & scope alignment meeting held' },
    { id: 'neg_adjust', label: 'Value engineering adjustments finalized if required' },
    { id: 'neg_draft', label: 'Master Turnkey / Architectural Contract draft issued' },
  ],
  'Won / Contract Signed': [
    { id: 'won_signed', label: 'Legally binding contract executed by all parties' },
    { id: 'won_advance', label: 'Mobilization advance invoiced & credited' },
    { id: 'won_handover', label: 'Project handed over to Site Execution team' },
  ],
  'Lost': [
    { id: 'lost_reason', label: 'Loss reason documented for market intelligence' },
  ],
};

export const DealCockpitDrawer: React.FC<DealCockpitDrawerProps> = ({
  isOpen,
  onClose,
  project,
  onNavigateTab,
}) => {
  const { advanceProjectStage, logCRMActivity, toggleStageChecklistItem, updateProject, masterData } =
    useProject();

  const [activeTab, setActiveTab] = useState<'journey' | 'activities' | 'specs' | 'analytics'>('journey');
  const [activityType, setActivityType] = useState<'call' | 'meeting' | 'site_visit' | 'note'>('call');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityNote, setActivityNote] = useState('');
  const [activityAuthor, setActivityAuthor] = useState('Sales Lead');
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  // Next action editing state
  const [isEditingAction, setIsEditingAction] = useState(false);
  const [actionTitle, setActionTitle] = useState(project?.nextAction.actionTitle || '');
  const [actionAssignee, setActionAssignee] = useState(project?.nextAction.assigneeName || '');
  const [actionDueDate, setActionDueDate] = useState(project?.nextAction.dueDate || '');
  const [actionPriority, setActionPriority] = useState(project?.nextAction.priority || 'Normal');

  if (!isOpen || !project) return null;

  const currentStageIndex = CRM_SALES_STAGES_ORDER.indexOf(project.salesStage);
  const winProb = project.winProbability ?? STAGE_WIN_PROBABILITIES[project.salesStage] ?? 50;
  const dsProfile = calculateProjectDataScienceProfile(project, masterData);
  const currentGates = STAGE_GATES[project.salesStage] || [];
  const checkedGatesCount = currentGates.filter(
    (g) => project.qualificationChecklist?.[g.id]
  ).length;

  const handleStageClick = (targetStage: SalesStage) => {
    if (targetStage === project.salesStage) return;
    advanceProjectStage(project.id, targetStage);
  };

  const handleAdvanceNext = () => {
    advanceProjectStage(project.id);
  };

  const handleMarkLost = () => {
    advanceProjectStage(project.id, 'Lost', 'Deal marked as lost / archived.');
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim()) return;

    logCRMActivity(project.id, {
      type: activityType,
      title: activityTitle.trim(),
      description: activityNote.trim() || undefined,
      author: activityAuthor.trim() || 'Sales Representative',
    });

    setActivityTitle('');
    setActivityNote('');
    setIsAddingActivity(false);
  };

  const handleSaveNextAction = () => {
    updateProject(project.id, {
      nextAction: {
        ...project.nextAction,
        actionTitle,
        assigneeName: actionAssignee,
        dueDate: actionDueDate,
        priority: actionPriority,
      },
    });
    setIsEditingAction(false);
  };

  const handleToggleNextActionComplete = () => {
    updateProject(project.id, {
      nextAction: {
        ...project.nextAction,
        isCompleted: !project.nextAction.isCompleted,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Content */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Frozen Top Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-800">
                {project.enquiryNumber}
              </span>
              <EngagementBadge type={project.engagementType} />
              <SalesStageBadge stage={project.salesStage} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5">
              {project.clientName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
              <span>{project.organizationOrFamily}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{project.siteAddress}, {project.siteCity}</span>
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close deal drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Commercial Highlights Ribbon */}
        <div className="px-5 py-3 bg-white border-b border-slate-200 grid grid-cols-3 gap-4 shrink-0 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
              Deal Value
            </span>
            <p className="text-base font-bold text-slate-900 mt-0.5">
              {formatINR(project.targetBudget)}
            </p>
            <span className="text-[11px] text-slate-500">
              {project.budgetTier}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Win Probability (ML Calibrated)
              </span>
              <span className="text-[10px] text-indigo-600 font-mono font-bold">
                {dsProfile.predictedWinProbability}% ML
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    dsProfile.predictedWinProbability >= 70
                      ? 'bg-emerald-500'
                      : dsProfile.predictedWinProbability >= 45
                      ? 'bg-indigo-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${dsProfile.predictedWinProbability}%` }}
                />
              </div>
              <span className="font-bold text-slate-800 text-xs">{dsProfile.predictedWinProbability}%</span>
            </div>
            <span className="text-[11px] text-slate-500">
              CI: [{dsProfile.winConfidenceInterval[0]}% - {dsProfile.winConfidenceInterval[1]}%] • Stage: {winProb}%
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
              Project Scale
            </span>
            <p className="text-base font-bold text-slate-900 mt-0.5">
              {project.builtUpAreaSqFt.toLocaleString()} sq.ft
            </p>
            <span className="text-[11px] text-slate-500">
              ~{formatINR(Math.round(project.targetBudget / (project.builtUpAreaSqFt || 1)))}/sq.ft
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-5 gap-4 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('journey')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'journey'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sales Pipeline Journey &amp; Gating
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'activities'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Activity Log</span>
            {(project.crmActivities?.length || 0) > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-mono">
                {project.crmActivities?.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'specs'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Deal Brief &amp; Contacts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`py-2.5 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
            <span>ML Econometrics</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold">
              {dsProfile.predictedWinProbability}%
            </span>
          </button>
        </div>

        {/* Scrollable Body Viewport */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: STAGE PROGRESSION & GATES */}
          {activeTab === 'journey' && (
            <div className="space-y-6">
              {/* Interactive Stage Pipeline Ribbon */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Commercial Stage Pipeline
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Click any stage to transition
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {CRM_SALES_STAGES_ORDER.map((stage, idx) => {
                    const isCurrent = stage === project.salesStage;
                    const isPassed = currentStageIndex > idx;
                    return (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => handleStageClick(stage)}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2 ${
                          isCurrent
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : isPassed
                            ? 'bg-emerald-50/80 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isPassed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : isCurrent ? (
                            <Circle className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span
                            className={`text-[10px] font-mono block ${
                              isCurrent ? 'text-slate-300' : 'text-slate-400'
                            }`}
                          >
                            Stage {idx + 1}
                          </span>
                          <span className="text-xs font-semibold block leading-tight truncate">
                            {stage}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Stage Action Bar */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAdvanceNext}
                      disabled={project.salesStage === 'Won / Contract Signed'}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Advance to Next Stage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {project.salesStage !== 'Won / Contract Signed' && (
                      <button
                        type="button"
                        onClick={() => advanceProjectStage(project.id, 'Won / Contract Signed')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Mark as Won</span>
                      </button>
                    )}
                  </div>

                  {project.salesStage !== 'Lost' && (
                    <button
                      type="button"
                      onClick={handleMarkLost}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Archive / Mark Lost</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stage Qualification Checklist (Gating Criteria) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Stage Qualification Gate: {project.salesStage}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Verify these prerequisites to maintain clean deal governance
                    </p>
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {checkedGatesCount} / {currentGates.length} Checked
                  </span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                  {currentGates.map((gate) => {
                    const isChecked = !!project.qualificationChecklist?.[gate.id];
                    return (
                      <button
                        key={gate.id}
                        type="button"
                        onClick={() => toggleStageChecklistItem(project.id, gate.id)}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors text-xs cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
                          )}
                          <span
                            className={
                              isChecked
                                ? 'text-slate-800 font-medium'
                                : 'text-slate-600'
                            }
                          >
                            {gate.label}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            isChecked
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {isChecked ? 'Verified' : 'Pending'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Action Responsibility Card */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Active Next Action Responsibility</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingAction(!isEditingAction)}
                    className="text-xs font-bold text-amber-950 underline hover:text-amber-800 cursor-pointer"
                  >
                    {isEditingAction ? 'Cancel' : 'Edit Action'}
                  </button>
                </div>

                {isEditingAction ? (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Action Description
                      </label>
                      <input
                        type="text"
                        value={actionTitle}
                        onChange={(e) => setActionTitle(e.target.value)}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                        placeholder="e.g. Schedule concept review with client"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Assignee
                        </label>
                        <input
                          type="text"
                          value={actionAssignee}
                          onChange={(e) => setActionAssignee(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={actionDueDate}
                          onChange={(e) => setActionDueDate(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Priority
                        </label>
                        <select
                          value={actionPriority}
                          onChange={(e) => setActionPriority(e.target.value as any)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Urgent">Urgent</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveNextAction}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Save Next Action
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleNextActionComplete}
                        className="cursor-pointer"
                        title="Toggle completion"
                      >
                        {project.nextAction.isCompleted ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <span
                        className={`font-semibold text-slate-900 ${
                          project.nextAction.isCompleted
                            ? 'line-through text-slate-400'
                            : ''
                        }`}
                      >
                        {project.nextAction.actionTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{project.nextAction.assigneeName}</span>
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span
                          className={
                            project.nextAction.priority === 'Urgent' ||
                            project.nextAction.priority === 'Critical'
                              ? 'text-rose-600 font-bold'
                              : ''
                          }
                        >
                          Due {project.nextAction.dueDate}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Operational Jump Links */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Execute Architectural Scope For This Deal
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab('ai-studio', project.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-left transition-all text-xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-indigo-700 font-bold mb-1">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Studio</span>
                      </span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {project.conceptOptions.length} Concept Options
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab('boq', project.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all text-xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-emerald-700 font-bold mb-1">
                      <span className="flex items-center gap-1">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>BOQ Commercials</span>
                      </span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {project.boqRevisions.length} Revisions Logged
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab('workspace', project.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-100 text-left transition-all text-xs cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-slate-800 font-bold mb-1">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Workspace</span>
                      </span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Brief &amp; Deliverables
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CRM ACTIVITY & INTERACTIONS LOG */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              {/* Add Activity Button / Form */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Log Client Interaction
                  </h3>
                  {!isAddingActivity && (
                    <button
                      type="button"
                      onClick={() => setIsAddingActivity(true)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Activity</span>
                    </button>
                  )}
                </div>

                {isAddingActivity && (
                  <form onSubmit={handleSaveActivity} className="space-y-3 mt-3">
                    {/* Activity Type Selection */}
                    <div className="flex items-center gap-1.5">
                      {[
                        { type: 'call', label: 'Call', icon: Phone },
                        { type: 'meeting', label: 'Meeting', icon: Calendar },
                        { type: 'site_visit', label: 'Site Visit', icon: MapPin },
                        { type: 'note', label: 'Note', icon: MessageSquare },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = activityType === item.type;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => setActivityType(item.type as any)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-slate-900 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Subject (e.g., Concept Pitch Debrief Call, Site Inspection with Structural Engineer)"
                        value={activityTitle}
                        onChange={(e) => setActivityTitle(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                        required
                      />
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        placeholder="Detailed notes, client reactions, decisions, and agreed next steps..."
                        value={activityNote}
                        onChange={(e) => setActivityNote(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <input
                        type="text"
                        placeholder="Logged by"
                        value={activityAuthor}
                        onChange={(e) => setActivityAuthor(e.target.value)}
                        className="text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 w-48"
                      />

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingActivity(false)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Save Interaction</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Chronological Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Customer History &amp; Audit Trail
                </h4>

                {(!project.crmActivities || project.crmActivities.length === 0) ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-700">No activity logged yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Log client calls, design pitch meetings, and site visits to keep one customer history.
                    </p>
                  </div>
                ) : (
                  <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {project.crmActivities.map((act) => {
                      const iconColor =
                        act.type === 'call'
                          ? 'bg-blue-100 text-blue-700'
                          : act.type === 'meeting'
                          ? 'bg-purple-100 text-purple-700'
                          : act.type === 'site_visit'
                          ? 'bg-amber-100 text-amber-700'
                          : act.type === 'stage_change'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-700';

                      return (
                        <div key={act.id} className="relative">
                          {/* Dot indicator */}
                          <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-white" />

                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${iconColor}`}
                              >
                                {act.type.replace('_', ' ')}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {new Date(act.timestamp).toLocaleDateString()}{' '}
                                {new Date(act.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <p className="text-xs font-bold text-slate-900 mt-1">
                              {act.title}
                            </p>

                            {act.description && (
                              <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                                {act.description}
                              </p>
                            )}

                            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 mt-2">
                              <span>By {act.author}</span>
                              {act.stageAtTime && (
                                <span>At stage: {act.stageAtTime}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DEAL BRIEF & CONTACTS */}
          {activeTab === 'specs' && (
            <div className="space-y-4 text-xs">
              {/* Client Contacts */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Stakeholder &amp; Contact Channels
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 font-medium block">Email</span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {project.contactEmail || 'Not documented'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 font-medium block">Phone</span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {project.contactPhone || 'Not documented'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmed Architectural Brief */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Project Vision &amp; Requirements
                </span>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                  {project.confirmedRequirements.projectVision || 'No vision statement recorded.'}
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    Allocated Spatial Zones
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.confirmedRequirements.roomZones.map((zone, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                    Style Preferences
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.confirmedRequirements.stylePreferences.map((style, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[11px] font-medium"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>

                {project.confirmedRequirements.specialConstraints && (
                  <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-amber-900 text-xs">
                    <strong>Special Constraints:</strong>{' '}
                    {project.confirmedRequirements.specialConstraints}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PREDICTIVE DATA SCIENCE & ECONOMETRICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-5">
              {/* Executive ML Probability Hero */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block font-bold flex items-center gap-1">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>Multivariate Regressive Win Score</span>
                  </span>
                  <div className="text-3xl font-extrabold text-white font-mono mt-1">
                    {dsProfile.predictedWinProbability}%
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    95% Confidence Interval: [{dsProfile.winConfidenceInterval[0]}% –{' '}
                    {dsProfile.winConfidenceInterval[1]}%]
                  </p>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-right shrink-0">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                    Recommended Contingency
                  </span>
                  <span className="text-lg font-bold text-amber-400 font-mono">
                    +{dsProfile.recommendedContingencyPercent}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    +{formatINR(Math.round((project.targetBudget * dsProfile.recommendedContingencyPercent) / 100))}
                  </span>
                </div>
              </div>

              {/* SHAP Feature Contribution Drivers */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>SHAP Key Model Drivers</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Additive impact on win %</span>
                </div>

                <div className="space-y-2">
                  {dsProfile.shapKeyDrivers.map((driver, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        {driver.type === 'favorable' ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span className="text-slate-800 font-medium">{driver.driver}</span>
                      </div>
                      <span
                        className={`font-bold font-mono text-xs px-2 py-0.5 rounded ${
                          driver.type === 'favorable'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {driver.type === 'favorable' ? '+' : '-'}
                        {driver.impactPercent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dual Risk Gating Radar */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                    Margin Erosion Risk
                  </span>
                  <p className="text-xl font-extrabold text-amber-900 font-mono">
                    {dsProfile.marginErosionRiskScore}/100
                  </p>
                  <span className="text-[11px] text-amber-700 block">
                    {dsProfile.marginErosionRiskScore > 50
                      ? 'High material price volatility'
                      : 'Standard margin resilience'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                    Schedule Slippage Risk
                  </span>
                  <p className="text-xl font-extrabold text-rose-900 font-mono">
                    {dsProfile.delayRiskScore}/100
                  </p>
                  <span className="text-[11px] text-rose-700 block">
                    +{dsProfile.predictedSlippageDays} calendar days predicted
                  </span>
                </div>
              </div>

              {/* Action Banner to Data Science Hub */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-indigo-950">
                    Run Monte Carlo &amp; S-Curve Simulations
                  </h5>
                  <p className="text-[11px] text-indigo-700">
                    Launch 1,000 cost iterations and cash-flow curves for this deal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateTab('analytics', project.id);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Open in ML Hub &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Fixed Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
