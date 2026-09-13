/**
 * Build Storys ERP - Architectural Journey Workflow Bar
 * Visual pipeline: Enquiry → Design → Estimation → Execution → Billing → Handover → After-Sales
 */

import React from 'react';
import { 
  UserCheck, 
  Ruler, 
  Calculator, 
  FileCheck, 
  HardHat, 
  Receipt, 
  Award, 
  ChevronRight, 
  Sparkles, 
  Network
} from 'lucide-react';
import { ERPJourneyStage } from '../types/erp';

interface JourneyStageItem {
  stage: ERPJourneyStage;
  stageNumber: number;
  label: string;
  subtext: string;
  icon: React.ElementType;
  modulesCount: number;
  defaultTab: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
}

const JOURNEY_STAGES: JourneyStageItem[] = [
  {
    stage: 'ENQUIRY_SALES',
    stageNumber: 1,
    label: 'Enquiry & CRM',
    subtext: 'Leads, brief & pipeline',
    icon: UserCheck,
    modulesCount: 2,
    defaultTab: 'crm',
    status: 'COMPLETED'
  },
  {
    stage: 'SURVEY_DESIGN',
    stageNumber: 2,
    label: 'Survey & Design',
    subtext: 'Laser scan & finishes',
    icon: Ruler,
    modulesCount: 3,
    defaultTab: 'survey',
    status: 'COMPLETED'
  },
  {
    stage: 'ESTIMATION_BOQ',
    stageNumber: 3,
    label: 'Estimation & BOQ',
    subtext: 'Takeoffs & baseline',
    icon: Calculator,
    modulesCount: 2,
    defaultTab: 'boq',
    status: 'COMPLETED'
  },
  {
    stage: 'COMMERCIAL_CONTRACTS',
    stageNumber: 4,
    label: 'Commercial & Contracts',
    subtext: 'Quotes, VO & terms',
    icon: FileCheck,
    modulesCount: 3,
    defaultTab: 'quotation',
    status: 'COMPLETED'
  },
  {
    stage: 'EXECUTION_OPS',
    stageNumber: 5,
    label: 'Execution & Site Ops',
    subtext: 'DPR, PO & contractors',
    icon: HardHat,
    modulesCount: 8,
    defaultTab: 'site_execution',
    status: 'IN_PROGRESS'
  },
  {
    stage: 'BILLING_FINANCE',
    stageNumber: 6,
    label: 'Billing & Finance',
    subtext: 'Milestones & cost link',
    icon: Receipt,
    modulesCount: 4,
    defaultTab: 'traceability',
    status: 'IN_PROGRESS'
  },
  {
    stage: 'HANDOVER_WARRANTY',
    stageNumber: 7,
    label: 'Handover & Reports',
    subtext: 'Mandatory MIS & Pack',
    icon: Award,
    modulesCount: 4,
    defaultTab: 'reports',
    status: 'UPCOMING'
  }
];

interface JourneyWorkflowBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAIWorkspace?: () => void;
  pendingAISuggestionsCount?: number;
}

export const JourneyWorkflowBar: React.FC<JourneyWorkflowBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAIWorkspace,
  pendingAISuggestionsCount = 9
}) => {
  return (
    <div id="erp-journey-bar" className="bg-[#0F172A] text-slate-100 border-b border-slate-800 px-3 sm:px-4 py-1.5 select-none shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 max-w-[1700px] mx-auto min-w-0">
        
        {/* Left: Journey Label & Quick Cost Traceability & Reports Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 pr-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Lifecycle</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono font-medium border border-slate-700">26 Modules</span>
          </div>

          <button
            id="btn-quick-traceability"
            onClick={() => onSelectTab('traceability')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activeTab === 'traceability'
                ? 'bg-amber-400 text-slate-900 font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
            title="Core Integration: BOQ Item → Budget → PO/Subcontract → Consumption → Actual Cost"
          >
            <Network className="w-3.5 h-3.5 text-amber-400" />
            <span>Traceability</span>
          </button>

          <button
            id="btn-quick-mandatory-reports"
            onClick={() => onSelectTab('reports')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activeTab === 'reports'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
            title="Mandatory Statutory, Executive & Operational Reports"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reports Hub</span>
            <span className="bg-emerald-800 text-emerald-200 text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">12</span>
          </button>
        </div>

        {/* Center: The 7 Visual Journey Stages */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none min-w-0">
          {JOURNEY_STAGES.map((step, idx) => {
            const isStageActive = 
              (step.stage === 'ENQUIRY_SALES' && (activeTab === 'crm' || activeTab === 'contacts')) ||
              (step.stage === 'SURVEY_DESIGN' && (activeTab === 'survey' || activeTab === 'drawings' || activeTab === 'materials')) ||
              (step.stage === 'ESTIMATION_BOQ' && (activeTab === 'boq' || activeTab === 'budget')) ||
              (step.stage === 'COMMERCIAL_CONTRACTS' && (activeTab === 'quotation' || activeTab === 'contracts' || activeTab === 'variations')) ||
              (step.stage === 'EXECUTION_OPS' && (activeTab === 'site_execution' || activeTab === 'schedule' || activeTab === 'procurement' || activeTab === 'inventory' || activeTab === 'contractors' || activeTab === 'snags' || activeTab === 'documents' || activeTab === 'assets' || activeTab === 'compliance')) ||
              (step.stage === 'BILLING_FINANCE' && (activeTab === 'traceability' || activeTab === 'billing' || activeTab === 'finance' || activeTab === 'resources')) ||
              (step.stage === 'HANDOVER_WARRANTY' && (activeTab === 'handover' || activeTab === 'portal' || activeTab === 'reports' || activeTab === 'masters'));

            return (
              <React.Fragment key={step.stage}>
                <button
                  id={`journey-step-${step.stageNumber}`}
                  onClick={() => onSelectTab(step.defaultTab)}
                  className={`flex items-center gap-2 px-2 py-1 rounded transition-all shrink-0 text-left ${
                    isStageActive
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isStageActive 
                      ? 'bg-slate-900 text-white' 
                      : step.status === 'COMPLETED'
                      ? 'bg-emerald-600 text-white'
                      : step.status === 'IN_PROGRESS'
                      ? 'bg-amber-500 text-slate-900'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {step.stageNumber}
                  </div>

                  <div className="leading-tight whitespace-nowrap">
                    <div className="text-xs whitespace-nowrap">{step.label}</div>
                    <div className={`text-[9px] whitespace-nowrap ${isStageActive ? 'text-slate-500' : 'text-slate-400'}`}>
                      {step.subtext}
                    </div>
                  </div>
                </button>

                {idx < JOURNEY_STAGES.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Central Agentic AI Workspace Trigger */}
        {onOpenAIWorkspace && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-open-agentic-ai-workspace"
              onClick={onOpenAIWorkspace}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 text-slate-100 rounded text-xs font-semibold hover:bg-slate-700 shadow-xs transition-all border border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Copilot</span>
              {pendingAISuggestionsCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1">
                  {pendingAISuggestionsCount}
                </span>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
