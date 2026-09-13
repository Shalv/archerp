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
    <div id="erp-journey-bar" className="bg-[#002050] text-white border-b border-[#003366] px-3 sm:px-4 py-2 select-none shadow-[0_2px_8px_-2px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 max-w-[1700px] mx-auto min-w-0">
        
        {/* Left: Journey Label & Quick Cost Traceability & Reports Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 pr-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9bb0d3]">Full Journey</span>
            <span className="text-[10px] bg-[#004b99] px-1.5 py-0.2 rounded text-white font-mono font-bold">26 Modules</span>
          </div>

          <button
            id="btn-quick-traceability"
            onClick={() => onSelectTab('traceability')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeTab === 'traceability'
                ? 'bg-[#ffb900] text-slate-900 font-bold shadow-[0_2px_6px_rgba(255,185,0,0.3)] ring-1 ring-white/40'
                : 'bg-[#003875] text-[#d6e3f8] hover:bg-[#004a99] hover:text-white'
            }`}
            title="Core Integration: BOQ Item → Budget → PO/Subcontract → Consumption → Actual Cost"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Cost Traceability</span>
          </button>

          <button
            id="btn-quick-mandatory-reports"
            onClick={() => onSelectTab('reports')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              activeTab === 'reports'
                ? 'bg-[#107c41] text-white font-bold shadow-[0_2px_6px_rgba(16,124,65,0.4)] ring-1 ring-white/50'
                : 'bg-[#003875] text-[#d6e3f8] hover:bg-[#004a99] hover:text-white'
            }`}
            title="Mandatory Statutory, Executive & Operational Reports (12 Reports)"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mandatory Reports</span>
            <span className="bg-[#0e6335] text-white text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">22</span>
          </button>
        </div>

        {/* Center: The 7 Visual Journey Stages */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none min-w-0">
          {JOURNEY_STAGES.map((step, idx) => {
            const Icon = step.icon;
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
                  className={`flex items-center gap-2 px-2.5 py-1 rounded transition-all shrink-0 text-left ${
                    isStageActive
                      ? 'bg-white text-[#002050] shadow-sm font-semibold'
                      : 'text-[#bcd0ee] hover:bg-[#003875] hover:text-white'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isStageActive 
                      ? 'bg-[#002050] text-white' 
                      : step.status === 'COMPLETED'
                      ? 'bg-[#107c41] text-white'
                      : step.status === 'IN_PROGRESS'
                      ? 'bg-[#ffb900] text-slate-900'
                      : 'bg-[#003875] text-[#8ea6ca]'
                  }`}>
                    {step.stageNumber}
                  </div>

                  <div className="leading-tight">
                    <div className="text-xs">{step.label}</div>
                    <div className={`text-[9px] ${isStageActive ? 'text-slate-600' : 'text-[#8ea6ca]'}`}>
                      {step.subtext}
                    </div>
                  </div>
                </button>

                {idx < JOURNEY_STAGES.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#004a99] shrink-0" />
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
              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#5c2d91] to-[#0078d4] text-white rounded text-xs font-semibold hover:brightness-110 shadow-sm transition-all border border-purple-400/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>Agentic AI Workspace</span>
              {pendingAISuggestionsCount > 0 && (
                <span className="bg-yellow-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1">
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
