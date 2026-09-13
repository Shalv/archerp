import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  Printer, 
  RotateCcw, 
  Database, 
  Info, 
  Layers, 
  Calculator, 
  ShieldCheck, 
  Search, 
  Sliders, 
  ChevronDown,
  ArrowRight,
  ExternalLink,
  FileCheck,
  PackageCheck,
  BarChart3,
  Award
} from 'lucide-react';
import { UserSession, BOQRevision, ProjectRecord } from '../types/erp';

interface D365CommandBarProps {
  currentUser: UserSession;
  activeRevision?: BOQRevision | null;
  activeProject?: ProjectRecord | null;
  onGenerateAIBOQ?: () => void;
  onCopilotTakeoff?: () => void;
  isGeneratingAI?: boolean;
  isGeneratingCopilot?: boolean;
  onApproveBaseline?: () => void;
  onRecalculateBudget?: () => void;
  onGenerateQuotation?: () => void;
  onAddLine?: () => void;
  onDeleteSelectedLine?: () => void;
  hasSelectedLine?: boolean;
  onExportToExcel?: () => void;
  onPrintQuotation?: () => void;
  onPrint?: () => void;
  onOpenInspectData?: () => void;
  onInspectPage?: () => void;
  onToggleFactBox?: () => void;
  isFactBoxOpen?: boolean;
  onResetDemo?: () => void;
  onNavigateTab?: (tab: string) => void;
  activeTab?: string;
}

export const D365CommandBar: React.FC<D365CommandBarProps> = ({
  currentUser,
  activeRevision,
  activeProject,
  onGenerateAIBOQ,
  onCopilotTakeoff,
  isGeneratingAI,
  isGeneratingCopilot,
  onApproveBaseline,
  onRecalculateBudget,
  onGenerateQuotation,
  onAddLine,
  onDeleteSelectedLine,
  hasSelectedLine,
  onExportToExcel,
  onPrintQuotation,
  onPrint,
  onOpenInspectData,
  onInspectPage,
  onToggleFactBox,
  isFactBoxOpen,
  onResetDemo,
  onNavigateTab,
  activeTab
}) => {
  const [activeRibbonTab, setActiveRibbonTab] = useState<'HOME' | 'PROCESS' | 'LINE' | 'NAVIGATE' | 'REPORT' | 'PAGE'>('HOME');

  const handleNavigate = (tab: string) => {
    if (typeof onNavigateTab === 'function') {
      onNavigateTab(tab);
    }
  };

  const handleRunAI = onGenerateAIBOQ || onCopilotTakeoff;
  const isGenerating = isGeneratingAI || isGeneratingCopilot || false;
  const handlePrint = onPrintQuotation || onPrint;
  const handleInspect = onOpenInspectData || onInspectPage;

  const activeRev = activeRevision || (activeProject?.revisions?.find(r => r.id === activeProject.activeRevisionId) || activeProject?.revisions?.[0]) || null;

  const isEstimatorOrAdmin = currentUser?.role === 'ADMIN' || (currentUser?.permissions ? (currentUser.permissions.canEditBOQ || currentUser.permissions.canRunAITakeoff || currentUser.permissions.canApproveBOQ) : currentUser?.role === 'ESTIMATOR');
  const canRunAITakeoff = currentUser?.role === 'ADMIN' || (currentUser?.permissions ? currentUser.permissions.canRunAITakeoff : currentUser?.role === 'ESTIMATOR');
  const canApproveBaseline = currentUser?.role === 'ADMIN' || (currentUser?.permissions ? currentUser.permissions.canApproveBOQ : currentUser?.role === 'ESTIMATOR');
  const canEditLines = currentUser?.role === 'ADMIN' || (currentUser?.permissions ? currentUser.permissions.canEditBOQ : currentUser?.role === 'ESTIMATOR');
  const canExport = currentUser?.role === 'ADMIN' || (currentUser?.permissions ? currentUser.permissions.canExportData : currentUser?.role !== 'CLIENT');
  const isClient = currentUser?.role === 'CLIENT';
  const isFrozen = activeRev?.status === 'APPROVED' || activeRev?.status === 'FROZEN_BASELINE';

  return (
    <div className="bg-white border-b border-[#E1DFDD] shadow-2xs select-none">
      {/* Ribbon Tabs Header (Office / D365 standard) */}
      <div className="flex items-center px-4 pt-1 gap-1 border-b border-[#EDEBE9] bg-[#FAF9F8]">
        {(['HOME', 'PROCESS', 'LINE', 'NAVIGATE', 'REPORT', 'PAGE'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveRibbonTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold tracking-tight transition rounded-t ${
              activeRibbonTab === tab
                ? 'bg-white text-[#0F6CBD] border-t-2 border-t-[#0F6CBD] border-x border-b-0 border-[#E1DFDD] -mb-px'
                : 'text-[#605E5C] hover:text-[#201F1E] hover:bg-[#F3F2F1]'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 pb-1">
          {/* FactBox Toggle Icon */}
          <button
            onClick={onToggleFactBox}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded border transition ${
              isFactBoxOpen
                ? 'bg-[#EFF6FC] border-[#C7E0F4] text-[#0F6CBD]'
                : 'bg-white border-[#8A8886] text-[#605E5C] hover:bg-[#F3F2F1]'
            }`}
            title="Toggle Details & FactBox Pane (Alt+F2)"
          >
            <Info className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[11px] font-medium">FactBox</span>
          </button>

          {/* Page Inspector Shortcut */}
          <button
            onClick={handleInspect}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-[#8A8886] bg-white text-[#201F1E] hover:bg-[#F3F2F1] transition"
            title="Inspect Pages and Data (Ctrl+Alt+F1)"
          >
            <Database className="h-3.5 w-3.5 text-[#0F6CBD]" />
            <span className="hidden md:inline text-[11px] font-medium">Inspect (Ctrl+Alt+F1)</span>
          </button>
        </div>
      </div>

      {/* Ribbon Action Buttons Content Bar */}
      <div className="px-4 py-2 flex flex-wrap items-center gap-2 min-h-[48px]">
        {/* HOME TAB */}
        {activeRibbonTab === 'HOME' && (
          <div className="flex items-center gap-2 divide-x divide-[#EDEBE9]">
            {/* Primary Workflow Actions */}
            <div className="flex items-center gap-1.5 pr-2">
              {canRunAITakeoff && (
                <button
                  onClick={handleRunAI}
                  disabled={isGenerating || isFrozen}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold shadow-2xs transition disabled:opacity-50"
                  title="Run BuildStorys Enact360 Copilot AI Takeoff"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Copilot Generating...' : 'Copilot Takeoff (AI)'}</span>
                </button>
              )}

              {canApproveBaseline && (
                <button
                  onClick={onApproveBaseline}
                  disabled={isFrozen}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold transition border ${
                    isFrozen
                      ? 'bg-[#F3F2F1] text-[#A19F9D] border-[#EDEBE9]'
                      : 'bg-[#107C41] text-white hover:bg-[#0E6837] border-transparent'
                  }`}
                  title="Approve and freeze contractual baseline"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{isFrozen ? 'Baseline Frozen (Rev 1)' : 'Post / Approve Baseline'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (onRecalculateBudget) onRecalculateBudget();
                  handleNavigate('budget');
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-[#201F1E] hover:bg-[#F3F2F1] border border-[#D2D0CE] transition"
              >
                <Calculator className="h-3.5 w-3.5 text-[#0F6CBD]" />
                <span>Recalculate Budget</span>
              </button>

              <button
                onClick={() => {
                  if (onGenerateQuotation) onGenerateQuotation();
                  handleNavigate('quotation');
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-[#201F1E] hover:bg-[#F3F2F1] border border-[#D2D0CE] transition"
              >
                <FileCheck className="h-3.5 w-3.5 text-[#107C41]" />
                <span>Customer Quotation</span>
              </button>
            </div>

            {/* Quick Export & Print */}
            <div className="flex items-center gap-1.5 px-2">
              {canExport && (
                <button
                  onClick={onExportToExcel}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-[#107C41] bg-[#F2FBF6] hover:bg-[#DFF6DD] border border-[#B3E5C7] transition"
                  title="Export Job Planning Lines to Excel"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-[#107C41]" />
                  <span>Open in Excel</span>
                </button>
              )}

              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-[#201F1E] hover:bg-[#F3F2F1] border border-[#D2D0CE] transition"
                title="Print Formal Customer Proposal"
              >
                <Printer className="h-3.5 w-3.5 text-[#605E5C]" />
                <span>Print / Send</span>
              </button>
            </div>

            {/* System Demo Reset */}
            <div className="flex items-center gap-1.5 pl-2">
              <button
                onClick={onResetDemo}
                className="flex items-center gap-1 px-2 py-1.5 rounded text-xs text-[#8A8886] hover:text-[#B02A37] hover:bg-[#FDF3F4] transition"
                title="Reset to clean synthetic residential interior turnkey demo"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="text-[11px]">Reset Demo</span>
              </button>
            </div>
          </div>
        )}

        {/* PROCESS TAB */}
        {activeRibbonTab === 'PROCESS' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAI}
              disabled={isGenerating || isFrozen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold transition disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate AI Draft Takeoff (Gemini 3.8 Flash)</span>
            </button>

            <button
              onClick={onApproveBaseline}
              disabled={isFrozen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#107C41] text-white hover:bg-[#0E6837] text-xs font-semibold transition disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Freeze Estimator Baseline</span>
            </button>

            <button
              onClick={() => handleNavigate('budget')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white text-[#201F1E] border border-[#D2D0CE] hover:bg-[#F3F2F1] text-xs font-medium transition"
            >
              <Sliders className="h-3.5 w-3.5 text-[#0F6CBD]" />
              <span>Simulate Value Engineering Options</span>
            </button>
          </div>
        )}

        {/* LINE TAB */}
        {activeRibbonTab === 'LINE' && (
          <div className="flex items-center gap-2">
            {canEditLines && (
              <>
                <button
                  onClick={onAddLine}
                  disabled={isFrozen}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-medium transition disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Insert Line</span>
                </button>

                <button
                  onClick={onDeleteSelectedLine}
                  disabled={!hasSelectedLine || isFrozen}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-white text-[#A80000] border border-[#F9C6CA] hover:bg-[#FDE7E9] text-xs font-medium transition disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Selected Line</span>
                </button>
              </>
            )}

            <button
              onClick={() => handleNavigate('rates')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-white text-[#201F1E] border border-[#D2D0CE] hover:bg-[#F3F2F1] text-xs font-medium transition"
            >
              <PackageCheck className="h-3.5 w-3.5 text-[#0F6CBD]" />
              <span>Select from Master Price List</span>
            </button>
          </div>
        )}

        {/* NAVIGATE TAB */}
        {activeRibbonTab === 'NAVIGATE' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigate('general')}
              className="px-2.5 py-1.5 rounded text-xs font-medium border border-[#D2D0CE] hover:bg-[#F3F2F1]"
            >
              Job Card General
            </button>
            <button
              onClick={() => handleNavigate('survey')}
              className="px-2.5 py-1.5 rounded text-xs font-medium border border-[#D2D0CE] hover:bg-[#F3F2F1]"
            >
              Site Survey &amp; Room Dimensions
            </button>
            <button
              onClick={() => handleNavigate('boq')}
              className="px-2.5 py-1.5 rounded text-xs font-medium border border-[#D2D0CE] hover:bg-[#F3F2F1]"
            >
              Job Planning Lines (BOQ)
            </button>
            <button
              onClick={() => handleNavigate('budget')}
              className="px-2.5 py-1.5 rounded text-xs font-medium border border-[#D2D0CE] hover:bg-[#F3F2F1]"
            >
              Cost &amp; Overhead Budget
            </button>
            <button
              onClick={() => handleNavigate('quotation')}
              className="px-2.5 py-1.5 rounded text-xs font-medium border border-[#D2D0CE] hover:bg-[#F3F2F1]"
            >
              Customer Proposal
            </button>
            <button
              onClick={() => handleNavigate('rates')}
              className="px-2.5 py-1.5 rounded text-xs font-medium border border-[#D2D0CE] hover:bg-[#F3F2F1]"
            >
              Master Rate Library
            </button>
          </div>
        )}

        {/* REPORT TAB */}
        {activeRibbonTab === 'REPORT' && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleNavigate('reports')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#107C41] text-white hover:bg-[#0E6837] text-xs font-semibold shadow-xs transition"
              title="Open all 12 Mandatory Reports: EVM, Cash Flow, WBS Variance, GST & Operations"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>All Mandatory Reports (12)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-medium transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Customer Quotation &amp; Milestones (PDF)</span>
            </button>

            <button
              onClick={onExportToExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-[#107C41] border border-[#B3E5C7] hover:bg-[#F2FBF6] text-xs font-medium transition"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export Planning Lines (CSV/Excel)</span>
            </button>

            <button
              onClick={() => handleNavigate('traceability')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-[#795B00] border border-[#FFD335] hover:bg-[#FFF9E6] text-xs font-medium transition"
            >
              <Award className="h-3.5 w-3.5" />
              <span>BOQ Traceability Matrix</span>
            </button>
          </div>
        )}

        {/* PAGE TAB */}
        {activeRibbonTab === 'PAGE' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleInspect}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-white text-[#0F6CBD] border border-[#C7E0F4] hover:bg-[#EFF6FC]"
            >
              <Database className="h-3.5 w-3.5" />
              <span>Inspect Pages and Data (Ctrl+Alt+F1)</span>
            </button>

            <button
              onClick={onToggleFactBox}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-white text-[#201F1E] border border-[#D2D0CE] hover:bg-[#F3F2F1]"
            >
              <Info className="h-3.5 w-3.5 text-[#0F6CBD]" />
              <span>Toggle FactBox Pane (Alt+F2)</span>
            </button>

            <button
              onClick={onResetDemo}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-white text-[#A80000] border border-[#F9C6CA] hover:bg-[#FDE7E9]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Demo Database</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
