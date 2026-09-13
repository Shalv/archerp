/**
 * Build Storys ERP - Full Journey 26 Modules Workspace
 * Comprehensive enterprise views for all stages of Architecture & Turnkey Interior execution:
 * CRM, Design, Materials, Contracts, Schedules, DPRs, Procurement, Inventory, Subcontractors, Snags, Handover, Customer Portal, etc.
 */

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Users, 
  Ruler, 
  Layers, 
  Palette, 
  Calculator, 
  TrendingUp, 
  FileText, 
  FileCheck, 
  GitPullRequest, 
  Calendar, 
  HardHat, 
  ShoppingBag, 
  Package, 
  Briefcase, 
  FolderArchive, 
  CheckSquare, 
  Wrench, 
  ShieldCheck, 
  DollarSign, 
  Receipt, 
  Clock, 
  Award, 
  Monitor, 
  PieChart, 
  Settings, 
  Network,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ExternalLink,
  ChevronRight,
  Filter,
  Camera,
  Download,
  FileCheck2
} from 'lucide-react';
import { ProjectRecord, ERPJourneyStage, ERPModuleMeta, UserSession } from '../types/erp';
import { 
  ERP_MODULES_REGISTRY, 
  DEMO_CRM_LEADS, 
  DEMO_DRAWINGS, 
  DEMO_MATERIAL_SELECTIONS, 
  DEMO_DPR_LOGS, 
  DEMO_VARIATION_ORDERS, 
  DEMO_PURCHASE_ORDERS, 
  DEMO_SUBCONTRACT_ORDERS, 
  DEMO_SNAG_ITEMS, 
  DEMO_WARRANTIES 
} from '../data/modulesRegistry';
import { OperationalRegister } from './OperationalRegister';
import { MandatoryReportsHubView } from './MandatoryReportsHubView';
import { TimesheetManagementView } from './TimesheetManagementView';
import { ResourceDeploymentView } from './ResourceDeploymentView';
import { ProjectManagementHubView } from './ProjectManagementHubView';
import { EndToEndProcessWorkflowBar } from './EndToEndProcessWorkflowBar';
import { CRMAndLeadView } from './CRMAndLeadView';
import { DesignAndDrawingsManagementView } from './DesignAndDrawingsManagementView';
import { ProcurementAndInventoryView } from './ProcurementAndInventoryView';
import { SubcontractorAndMeasurementBookView } from './SubcontractorAndMeasurementBookView';
import { SiteExecutionAndDPRView } from './SiteExecutionAndDPRView';
import { QualityAndSafetyView } from './QualityAndSafetyView';
import { HandoverAndWarrantyView } from './HandoverAndWarrantyView';
import { INITIAL_ERP_USERS } from '../data/defaultUsers';

interface FullJourneyModulesViewProps {
  project: ProjectRecord;
  currentUser?: UserSession;
  initialTab?: string;
  onNavigateToCoreTab?: (tab: string) => void;
  onOpenAIWorkspace?: () => void;
}

export const FullJourneyModulesView: React.FC<FullJourneyModulesViewProps> = ({
  project,
  currentUser = INITIAL_ERP_USERS[0],
  initialTab = 'crm',
  onNavigateToCoreTab,
  onOpenAIWorkspace
}) => {
  const [activeModuleTab, setActiveModuleTab] = useState<string>(initialTab);
  useEffect(()=>setActiveModuleTab(initialTab),[initialTab]);
  const [activeStageFilter, setActiveStageFilter] = useState<string>('ALL');

  // Find active module metadata
  const currentModule = ERP_MODULES_REGISTRY.find(m => m.tabKey === activeModuleTab) || ERP_MODULES_REGISTRY[0];

  return (
    <div className="space-y-4">
      {/* 15-Step End-to-End Recommended Process Lifecycle Bar */}
      <EndToEndProcessWorkflowBar
        activeTab={activeModuleTab}
        onNavigateTab={(tab) => {
          setActiveModuleTab(tab);
          if (['survey', 'boq', 'budget', 'quotation', 'masters', 'traceability', 'reports'].includes(tab) && onNavigateToCoreTab) {
            onNavigateToCoreTab(tab);
          }
        }}
        onOpenAIWorkspace={onOpenAIWorkspace}
      />

      {/* Module Hub Navigation Strip */}
      <div className="bg-white border border-[#d2d0ce] rounded shadow-xs p-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Full 26 Modules Catalog
              </span>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
                {currentModule.code} • {currentModule.stageLabel}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              {currentModule.name}
            </h2>
            <p className="text-xs text-slate-500">
              {currentModule.keyFunctionality}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-medium">Stage:</span>
            <select
              value={activeStageFilter}
              onChange={e => setActiveStageFilter(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
            >
              <option value="ALL">All 7 Stages</option>
              <option value="ENQUIRY_SALES">1. Enquiry & Sales</option>
              <option value="SURVEY_DESIGN">2. Survey & Design</option>
              <option value="ESTIMATION_BOQ">3. Estimation & BOQ</option>
              <option value="COMMERCIAL_CONTRACTS">4. Commercial & Contracts</option>
              <option value="EXECUTION_OPS">5. Execution & Site Ops</option>
              <option value="BILLING_FINANCE">6. Billing & Finance</option>
              <option value="HANDOVER_WARRANTY">7. Handover & Warranty</option>
            </select>
          </div>
        </div>

        {/* Scrollable Module Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 scrollbar-none">
          {ERP_MODULES_REGISTRY
            .filter(m => activeStageFilter === 'ALL' || m.stage === activeStageFilter)
            .map(m => {
              const isSelected = activeModuleTab === m.tabKey;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveModuleTab(m.tabKey);
                    // If core view like survey, boq, budget, quotation, masters, notify parent if requested
                    if (['survey', 'boq', 'budget', 'quotation', 'masters', 'traceability', 'reports'].includes(m.tabKey) && onNavigateToCoreTab) {
                      onNavigateToCoreTab(m.tabKey);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#002050] text-white font-semibold shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    m.priority === 'Essential' ? 'bg-emerald-500' : 'bg-blue-400'
                  }`} />
                  <span>{m.code}: {m.name}</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Dynamic Module Component Rendering */}
      {activeModuleTab === 'crm' || activeModuleTab === 'contacts' ? (
        <CRMAndLeadView
          project={project}
          currentUser={currentUser}
          onNavigateTab={onNavigateToCoreTab}
        />
      ) : activeModuleTab === 'drawings' || activeModuleTab === 'materials' ? (
        <DesignAndDrawingsManagementView
          project={project}
          currentUser={currentUser}
          onNavigateTab={onNavigateToCoreTab}
        />
      ) : activeModuleTab === 'procurement' || activeModuleTab === 'inventory' ? (
        <ProcurementAndInventoryView
          project={project}
          currentUser={currentUser}
          onNavigateTab={onNavigateToCoreTab}
        />
      ) : activeModuleTab === 'contractors' || activeModuleTab === 'subcontractors' ? (
        <SubcontractorAndMeasurementBookView
          project={project}
          currentUser={currentUser}
          onNavigateTab={onNavigateToCoreTab}
        />
      ) : activeModuleTab === 'site_execution' || activeModuleTab === 'schedule' ? (
        <SiteExecutionAndDPRView
          project={project}
          currentUser={currentUser}
          onNavigateTab={onNavigateToCoreTab}
        />
      ) : activeModuleTab === 'snags' || activeModuleTab === 'compliance' ? (
        <QualityAndSafetyView
          project={project}
          currentUser={currentUser}
          onNavigateTab={onNavigateToCoreTab}
        />
      ) : activeModuleTab === 'handover' || activeModuleTab === 'portal' ? (
        <HandoverAndWarrantyView
          project={project}
          currentUser={currentUser}
          onNavigateTab={onNavigateToCoreTab}
        />
      ) : activeModuleTab === 'timesheets' ? (
        <TimesheetManagementView
          project={project}
          currentUser={currentUser}
          onNavigateToTab={onNavigateToCoreTab}
        />
      ) : activeModuleTab === 'resources' ? (
        <ResourceDeploymentView
          project={project}
          currentUser={currentUser}
          onNavigateToTab={onNavigateToCoreTab}
        />
      ) : activeModuleTab === 'project_hub' ? (
        <ProjectManagementHubView
          project={project}
          currentUser={currentUser}
          onNavigateToTab={onNavigateToCoreTab}
        />
      ) : (
        <OperationalRegister key={project.id+activeModuleTab} projectId={project.id} moduleId={activeModuleTab} title={currentModule.name}/>
      )}
    </div>
  );
};
