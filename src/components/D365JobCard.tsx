import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Building, 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Calculator, 
  Sliders, 
  ArrowRight, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  Printer, 
  FileSpreadsheet, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Ruler,
  Clock,
  Briefcase,
  TrendingUp,
  Tag
} from 'lucide-react';
import { 
  ProjectRecord, 
  BOQItem, 
  BOQRevision, 
  CostBudgetSummary, 
  MasterRateItem, 
  UserSession, 
  TradeCategory,
  CustomerRequirement
} from '../types/erp';
import { BudgetEngineView } from './BudgetEngineView';
import { CustomerQuotationView } from './CustomerQuotationView';
import { D365CueTilesBar } from './D365CueTilesBar';
import { SiteSurveyWorkspace } from './SiteSurveyWorkspace';
import { BOQGrid } from './BOQGrid';

interface D365JobCardProps {
  project: ProjectRecord;
  currentUser: UserSession;
  masterRates: MasterRateItem[];
  budgetSummary: CostBudgetSummary | null;
  selectedItem: BOQItem | null;
  onSelectItem: (item: BOQItem | null) => void;
  onSelectRevision: (revId: string) => void;
  onGenerateAIBOQ: () => void;
  isGeneratingAI: boolean;
  onApproveBaseline: () => void;
  onUpdateItem: (itemId: string, updated: Partial<BOQItem>) => void;
  onAddItem: (item: Partial<BOQItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onExportToExcel: () => void;
  onPrintQuotation: () => void;
  onGenerateQuotation: (tier: 'ECONOMY' | 'STANDARD' | 'PREMIUM') => void;
  onSaveRequirement?: (req: CustomerRequirement) => void;
  activeTab: string;
  onNavigateTab?: (tab: string) => void;
}

export const D365JobCard: React.FC<D365JobCardProps> = ({
  project,
  currentUser,
  masterRates,
  budgetSummary,
  selectedItem,
  onSelectItem,
  onSelectRevision,
  onGenerateAIBOQ,
  isGeneratingAI,
  onApproveBaseline,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onExportToExcel,
  onPrintQuotation,
  onGenerateQuotation,
  onSaveRequirement,
  activeTab,
  onNavigateTab
}) => {
  const handleNavigate = (tab: string) => {
    if (typeof onNavigateTab === 'function') {
      onNavigateTab(tab);
    }
  };

  // FastTab Expansion States (Business Central standard: default expanded, collapsible)
  const [generalExpanded, setGeneralExpanded] = useState(true);
  const [surveyExpanded, setSurveyExpanded] = useState(true);
  const [linesExpanded, setLinesExpanded] = useState(true);
  const [budgetExpanded, setBudgetExpanded] = useState(true);
  const [milestonesExpanded, setMilestonesExpanded] = useState(true);
  const [quotationExpanded, setQuotationExpanded] = useState(true);

  // Search & Filter within Job Planning Lines
  const [lineSearch, setLineSearch] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [lineFilterMode, setLineFilterMode] = useState<'ALL' | 'AI_INFERRED' | 'NEEDS_REVIEW'>('ALL');

  // Edit / Add line modal state
  const [editingItem, setEditingItem] = useState<BOQItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemTrade, setNewItemTrade] = useState<TradeCategory>('CARPENTRY_JOINERY');

  const isEstimatorOrAdmin = currentUser?.role === 'ESTIMATOR' || currentUser?.role === 'ADMIN';
  const isClient = currentUser?.role === 'CLIENT';

  const activeRev = project.revisions.find(r => r.id === project.activeRevisionId) || project.revisions[0];
  const items = activeRev ? activeRev.items : [];
  const isFrozen = activeRev?.status === 'APPROVED' || activeRev?.status === 'FROZEN_BASELINE';

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.itemCode.toLowerCase().includes(lineSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(lineSearch.toLowerCase()) ||
      item.roomZone.toLowerCase().includes(lineSearch.toLowerCase()) ||
      item.brandGrade.toLowerCase().includes(lineSearch.toLowerCase());

    const matchesTrade = selectedTrade === 'ALL' || item.trade === selectedTrade;
    const matchesZone = selectedZone === 'ALL' || item.roomZone === selectedZone;
    
    let matchesMode = true;
    if (lineFilterMode === 'AI_INFERRED') {
      matchesMode = Boolean(item.quantityFormula && item.quantityFormula.includes('*'));
    } else if (lineFilterMode === 'NEEDS_REVIEW') {
      matchesMode = !item.isApprovedByEstimator;
    }

    return matchesSearch && matchesTrade && matchesZone && matchesMode;
  });

  const zones = Array.from(new Set(items.map(i => i.roomZone)));

  // Save edited item
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const baseQty = Number(editingItem.baseQuantity) || 0;
    const wastage = Number(editingItem.wastagePercent) || 0;
    const finalQty = Number((baseQty * (1 + wastage / 100)).toFixed(2));
    const unitCost = (Number(editingItem.materialRate) || 0) + 
                     (Number(editingItem.labourRate) || 0) + 
                     (Number(editingItem.equipmentRate) || 0) + 
                     (Number(editingItem.subcontractRate) || 0);
    const totalCost = Number((finalQty * unitCost).toFixed(2));
    const markup = Number(editingItem.markupPercent) || 25;
    const sellingRate = Number((unitCost * (1 + markup / 100)).toFixed(2));
    const sellingAmount = Number((finalQty * sellingRate).toFixed(2));

    const updated: Partial<BOQItem> = {
      ...editingItem,
      finalQuantity: finalQty,
      unitCost,
      totalCost,
      sellingRate,
      sellingAmount
    };

    onUpdateItem(editingItem.id, updated);
    if (selectedItem?.id === editingItem.id) {
      onSelectItem({ ...editingItem, ...updated });
    }
    setEditingItem(null);
  };

  // Add from master rate
  const handleSelectMasterForAdd = (master: MasterRateItem) => {
    const baseQty = 10;
    const wastage = 5;
    const finalQty = Number((baseQty * (1 + wastage / 100)).toFixed(2));
    const unitCost = master.totalUnitCost;
    const totalCost = Number((finalQty * unitCost).toFixed(2));
    const sellingRate = master.suggestedSellingRate;
    const sellingAmount = Number((finalQty * sellingRate).toFixed(2));

    const itemToAdd: Partial<BOQItem> = {
      itemCode: master.itemCode,
      trade: master.trade,
      workPackage: master.workPackage,
      floor: '14th Floor',
      roomZone: 'Living Lounge & Dining',
      description: master.description,
      specification: master.specification,
      brandGrade: master.brandGrade,
      unit: master.unit,
      baseQuantity: baseQty,
      wastagePercent: wastage,
      finalQuantity: finalQty,
      quantityType: 'MEASURED',
      materialRate: master.materialRate,
      labourRate: master.labourRate,
      equipmentRate: master.equipmentRate,
      subcontractRate: master.subcontractRate,
      unitCost,
      totalCost,
      markupPercent: master.defaultMarkupPercent,
      sellingRate,
      sellingAmount,
      rateSource: master.rateSource,
      rateStatus: master.status,
      sourceDocumentRef: 'Added by Estimator',
      assumptions: 'Standard installation parameters apply.'
    };

    onAddItem(itemToAdd);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. DOCUMENT HEADER (D365 Business Central Job Card Title Bar) */}
      <div className="bg-white border border-[#E1DFDD] p-4 rounded shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#605E5C] uppercase tracking-wider">
                Job Card
              </span>
              <span className="font-mono text-xs font-bold text-[#0F6CBD] bg-[#EFF6FC] px-2 py-0.5 rounded border border-[#C7E0F4]">
                {project.projectCode}
              </span>
              <span className="bg-[#DFF6DD] text-[#107C41] border border-[#B3E5C7] text-xs font-semibold px-2 py-0.5 rounded">
                Status: In Progress
              </span>
              <span className="bg-[#FFF4CE] text-[#797673] border border-[#FDE3A7] text-xs font-semibold px-2 py-0.5 rounded">
                Posting: Residential Turnkey
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#201F1E] mt-1 tracking-tight">
              {project.title}
            </h1>
            <div className="text-xs text-[#605E5C] mt-1 flex flex-wrap items-center gap-4">
              <span>Customer: <strong className="text-[#201F1E]">{project.clientName}</strong></span>
              <span>Site: <strong className="text-[#201F1E]">{project.siteAddress}, {project.city}</strong></span>
              <span>Posting Date: <strong className="text-[#201F1E]">11-Sep-2026</strong></span>
            </div>
          </div>

          {/* Revision Switcher in Document Header */}
          <div className="flex items-center gap-2 bg-[#F3F2F1] p-2 rounded border border-[#E1DFDD]">
            <span className="text-xs font-semibold text-[#605E5C]">Revision:</span>
            <select
              value={activeRev?.id}
              onChange={e => onSelectRevision(e.target.value)}
              className="bg-white border border-[#8A8886] rounded px-2.5 py-1 text-xs font-bold text-[#201F1E] focus:border-[#0F6CBD] focus:outline-hidden cursor-pointer"
            >
              {project.revisions.map(r => (
                <option key={r.id} value={r.id}>
                  {r.revisionLabel} [{r.status}]
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. DYNAMICS 365 CUE TILES BAR (Interactive, Clickable KPI Tiles with Flyout Dropdowns) */}
      <D365CueTilesBar
        project={project}
        budgetSummary={budgetSummary}
        masterRates={masterRates}
        currentUser={currentUser}
        onNavigateTab={handleNavigate}
        onSelectRevision={onSelectRevision}
      />

      {/* DEDICATED VIEW SWITCHER ACCORDING TO ACTIVETAB SCOPE */}
      {activeTab === 'survey' ? (
        <SiteSurveyWorkspace
          project={project}
          currentUser={currentUser}
          onSaveRequirement={onSaveRequirement}
          onProceedToBOQ={() => handleNavigate('boq')}
          onNavigateTab={handleNavigate}
        />
      ) : activeTab === 'boq' ? (
        <div className="bg-white border border-[#E1DFDD] rounded shadow-2xs p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDEBE9]">
            <div>
              <span className="text-xs font-semibold text-[#0F6CBD] uppercase tracking-wider">BuildStorys Enact360 Job Planning Lines</span>
              <h2 className="text-base font-bold text-[#201F1E]">BOQ Studio &amp; AI Takeoff Workspace</h2>
              <p className="text-xs text-[#605E5C]">
                Project: <strong className="text-[#201F1E]">{project.projectCode}</strong> • {project.title} • Active Revision: <strong className="text-[#0F6CBD]">{activeRev?.revisionLabel || 'Rev-A'}</strong> ({activeRev?.status || 'DRAFT'})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onExportToExcel}
                className="px-2.5 py-1 rounded bg-white text-[#107C41] border border-[#B3E5C7] hover:bg-[#F2FBF6] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
                title="Export to Excel Spreadsheet"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Export Excel</span>
              </button>
              <button
                onClick={() => handleNavigate('general')}
                className="px-2.5 py-1 rounded bg-[#F3F2F1] text-[#323130] hover:bg-[#EDEBE9] text-xs font-semibold transition"
              >
                ← Back to Full Job Card
              </button>
            </div>
          </div>
          <BOQGrid
            revisions={project.revisions}
            activeRevisionId={project.activeRevisionId}
            onSelectRevision={onSelectRevision}
            currentUser={currentUser}
            masterRates={masterRates}
            onGenerateAIBOQ={onGenerateAIBOQ}
            isGeneratingAI={isGeneratingAI}
            onUpdateItem={onUpdateItem}
            onAddItem={onAddItem}
            onDeleteItem={onDeleteItem}
            onApproveBaseline={onApproveBaseline}
            budgetSummary={budgetSummary}
          />
        </div>
      ) : activeTab === 'budget' ? (
        <div className="bg-white border border-[#E1DFDD] rounded shadow-2xs p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDEBE9]">
            <div>
              <span className="text-xs font-semibold text-[#0F6CBD] uppercase tracking-wider">BuildStorys Enact360 Cost Accounting</span>
              <h2 className="text-base font-bold text-[#201F1E]">Commercial Costing &amp; Budget Engine</h2>
              <p className="text-xs text-[#605E5C]">Direct Costs, Overheads (5%), Contingency (3%), Margin Calibration (26%) &amp; 3-Tier Value Engineering</p>
            </div>
            <button
              onClick={() => handleNavigate('general')}
              className="px-2.5 py-1 rounded bg-[#F3F2F1] text-[#323130] hover:bg-[#EDEBE9] text-xs font-semibold"
            >
              ← Back to Full Job Card
            </button>
          </div>
          <BudgetEngineView
            projectId={project.id}
            currentUser={currentUser}
            budgetSummary={budgetSummary}
            onGenerateQuotation={onGenerateQuotation}
          />
        </div>
      ) : activeTab === 'quotation' ? (
        <div className="bg-white border border-[#E1DFDD] rounded shadow-2xs p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDEBE9]">
            <div>
              <span className="text-xs font-semibold text-[#0F6CBD] uppercase tracking-wider">BuildStorys Enact360 Sales Proposal</span>
              <h2 className="text-base font-bold text-[#201F1E]">Customer Quotation &amp; Commercial Proposal</h2>
              <p className="text-xs text-[#605E5C]">Composite Works GST 18%, Payment Milestones, Warranty Terms &amp; Print-Ready Contract</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onPrintQuotation}
                className="px-3 py-1 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold shadow-xs"
              >
                Print Quotation (Ctrl+P)
              </button>
              <button
                onClick={() => handleNavigate('general')}
                className="px-2.5 py-1 rounded bg-[#F3F2F1] text-[#323130] hover:bg-[#EDEBE9] text-xs font-semibold"
              >
                ← Back to Full Job Card
              </button>
            </div>
          </div>
          <CustomerQuotationView
            quotation={project.quotation || null} items={items} onPrint={onPrintQuotation}
            currentUser={currentUser}
          />
        </div>
      ) : (
        <>
          {activeTab === 'boq' && (
            <div className="bg-[#EFF6FC] border border-[#C7E0F4] rounded p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#0F6CBD]">
                <Layers className="h-4 w-4" />
                <span className="font-semibold">Showing Job Planning Lines (BOQ Studio) Focused Scope</span>
              </div>
              <button
                onClick={() => handleNavigate('general')}
                className="text-[#0F6CBD] font-semibold hover:underline"
              >
                Show All FastTabs
              </button>
            </div>
          )}

          {/* 3. FASTTAB: GENERAL */}
          <section className="bg-white border border-[#E1DFDD] rounded shadow-2xs overflow-hidden">
            <button
              onClick={() => setGeneralExpanded(!generalExpanded)}
              className="w-full px-4 py-2.5 flex items-center justify-between bg-[#F8F7F6] hover:bg-[#F3F2F1] transition border-b border-[#EDEBE9]"
            >
              <div className="flex items-center gap-2">
                {generalExpanded ? <ChevronUp className="h-4 w-4 text-[#0F6CBD]" /> : <ChevronDown className="h-4 w-4 text-[#0F6CBD]" />}
                <span className="font-bold text-sm text-[#201F1E]">General</span>
              </div>

              {!generalExpanded && (
                <div className="text-xs text-[#605E5C] truncate max-w-xl">
                  No.: <strong className="text-[#201F1E]">{project.projectCode}</strong> • Customer: <strong className="text-[#201F1E]">{project.clientName}</strong> • Carpet Area: <strong className="text-[#201F1E]">{project.requirement?.carpetAreaSqFt || 1650} sq.ft</strong> • Scope: <strong className="text-[#201F1E]">3BHK Turnkey Interior</strong>
                </div>
              )}
            </button>

        {generalExpanded && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Column 1 */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">No.</label>
                <div className="mt-1 font-mono font-semibold text-[#201F1E] bg-[#F3F2F1] px-2.5 py-1.5 rounded border border-[#EDEBE9]">
                  {project.projectCode}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">Description</label>
                <div className="mt-1 text-[#201F1E] bg-[#FAF9F8] px-2.5 py-1.5 rounded border border-[#EDEBE9]">
                  {project.title}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">Bill-to Customer No. &amp; Name</label>
                <div className="mt-1 text-[#201F1E] bg-[#FAF9F8] px-2.5 py-1.5 rounded border border-[#EDEBE9]">
                  CUST-1044 • {project.clientName}
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">Person Responsible (Project Manager)</label>
                <div className="mt-1 text-[#201F1E] bg-[#FAF9F8] px-2.5 py-1.5 rounded border border-[#EDEBE9] flex items-center justify-between">
                  <span>USR-PM-01 (Vikramaditya Rao)</span>
                  <span className="text-[10px] bg-[#FEF3C7] text-[#92400E] px-1.5 rounded font-medium">PM</span>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">Lead Quantity Surveyor (QS)</label>
                <div className="mt-1 text-[#201F1E] bg-[#FAF9F8] px-2.5 py-1.5 rounded border border-[#EDEBE9] flex items-center justify-between">
                  <span>USR-EST-01 (Rajesh Sharma)</span>
                  <span className="text-[10px] bg-[#EFF6FC] text-[#0F6CBD] px-1.5 rounded font-medium">Lead QS</span>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">Job Posting Group</label>
                <div className="mt-1 text-[#201F1E] bg-[#FAF9F8] px-2.5 py-1.5 rounded border border-[#EDEBE9]">
                  INTERIOR-RESIDENTIAL-TURNKEY
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">Starting &amp; Target Handover Date</label>
                <div className="mt-1 text-[#201F1E] bg-[#FAF9F8] px-2.5 py-1.5 rounded border border-[#EDEBE9]">
                  {project.createdAt} to {project.requirement?.targetCompletionDate}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">Currency &amp; Blocked</label>
                <div className="mt-1 text-[#201F1E] bg-[#FAF9F8] px-2.5 py-1.5 rounded border border-[#EDEBE9] flex justify-between">
                  <span>Currency Code: <strong>INR (₹)</strong></span>
                  <span className="text-[#107C41] font-semibold">Blocked: No</span>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">Customer Budget Range</label>
                <div className="mt-1 text-[#201F1E] bg-[#FAF9F8] px-2.5 py-1.5 rounded border border-[#EDEBE9]">
                  ₹{(project.requirement?.customerBudgetMin || 3000000).toLocaleString('en-IN')} - ₹{(project.requirement?.customerBudgetMax || 4500000).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. FASTTAB: SITE SURVEY & SPATIAL DIMENSIONS */}
      <section className="bg-white border border-[#E1DFDD] rounded shadow-2xs overflow-hidden">
        <button
          onClick={() => setSurveyExpanded(!surveyExpanded)}
          className="w-full px-4 py-2.5 flex items-center justify-between bg-[#F8F7F6] hover:bg-[#F3F2F1] transition border-b border-[#EDEBE9]"
        >
          <div className="flex items-center gap-2">
            {surveyExpanded ? <ChevronUp className="h-4 w-4 text-[#0F6CBD]" /> : <ChevronDown className="h-4 w-4 text-[#0F6CBD]" />}
            <span className="font-bold text-sm text-[#201F1E]">Site Survey &amp; Spatial Dimensions</span>
          </div>

          {!surveyExpanded && (
            <div className="text-xs text-[#605E5C] truncate max-w-xl">
              Carpet Area: <strong className="text-[#201F1E]">1,650 sq.ft</strong> • Super Built-up: <strong className="text-[#201F1E]">2,180 sq.ft</strong> • 6 Rooms Surveyed • Society Lift: Goods Only
            </div>
          )}
        </button>

        {surveyExpanded && (
          <div className="p-4 space-y-4">
            {/* KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#FAF9F8] p-3 rounded border border-[#EDEBE9]">
                <div className="text-[11px] text-[#605E5C]">Carpet Area</div>
                <div className="text-base font-bold text-[#201F1E] mt-0.5">
                  {(project.requirement?.carpetAreaSqFt || 1650).toLocaleString()} sq.ft
                </div>
              </div>
              <div className="bg-[#FAF9F8] p-3 rounded border border-[#EDEBE9]">
                <div className="text-[11px] text-[#605E5C]">Super Built-up Area</div>
                <div className="text-base font-bold text-[#201F1E] mt-0.5">
                  {(project.requirement?.builtUpAreaSqFt || 2180).toLocaleString()} sq.ft
                </div>
              </div>
              <div className="bg-[#FAF9F8] p-3 rounded border border-[#EDEBE9]">
                <div className="text-[11px] text-[#605E5C]">Ceiling Clear Height</div>
                <div className="text-base font-bold text-[#201F1E] mt-0.5">
                  10.5 ft (slab) / 9.25 ft (false ceiling drop)
                </div>
              </div>
              <div className="bg-[#FAF9F8] p-3 rounded border border-[#EDEBE9]">
                <div className="text-[11px] text-[#605E5C]">Survey Status</div>
                <div className="text-base font-bold text-[#107C41] mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-[#107C41]" />
                  <span>Verified by Site QS</span>
                </div>
              </div>
            </div>

            {/* Room-by-room dimensions table */}
            <div>
              <div className="text-xs font-semibold text-[#201F1E] mb-2 flex items-center justify-between">
                <span>Room Dimensions &amp; Spatial Breakdown (Laser Distance Meter Survey)</span>
                <span className="text-[11px] text-[#605E5C]">Ref: Skyline_1402_Architectural_FloorPlan_RevB.pdf</span>
              </div>
              <div className="overflow-x-auto border border-[#E1DFDD] rounded">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#F3F2F1] text-[#323130] font-semibold border-b border-[#E1DFDD]">
                    <tr>
                      <th className="p-2 border-r border-[#E1DFDD]">Room Space</th>
                      <th className="p-2 border-r border-[#E1DFDD]">Type</th>
                      <th className="p-2 border-r border-[#E1DFDD]">Dimensions (L × W × H)</th>
                      <th className="p-2 border-r border-[#E1DFDD] text-right">Carpet Area</th>
                      <th className="p-2 border-r border-[#E1DFDD]">Floor Finish Spec</th>
                      <th className="p-2">Ceiling &amp; Joinery Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDEBE9]">
                    {(project.requirement?.rooms || []).map((room: any, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF9F8]">
                        <td className="p-2 font-semibold text-[#201F1E] border-r border-[#EDEBE9]">
                          {room.name}
                        </td>
                        <td className="p-2 text-[#605E5C] border-r border-[#EDEBE9]">
                          {room.roomType || room.zone || 'General'}
                        </td>
                        <td className="p-2 font-mono text-[#201F1E] border-r border-[#EDEBE9]">
                          {room.lengthFt} ft × {room.widthFt} ft × {room.heightFt || 10.5} ft
                        </td>
                        <td className="p-2 text-right font-mono font-semibold text-[#201F1E] border-r border-[#EDEBE9]">
                          {room.areaSqFt || room.carpetAreaSqFt || Math.round(room.lengthFt * room.widthFt)} sq.ft
                        </td>
                        <td className="p-2 text-[#323130] border-r border-[#EDEBE9]">
                          {room.flooringFinish || room.existingCondition || 'Vitrified / Italian Marble'}
                        </td>
                        <td className="p-2 text-[#323130]">
                          {room.falseCeilingType || 'Acoustic Gypsum False Ceiling'} {room.doorsWindows ? `• ${room.doorsWindows}` : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Multilingual Client Natural Language Brief */}
            {project.requirement?.rawBriefHindiEnglish && (
              <div className="p-3 bg-[#FFF4CE] rounded border border-[#FDE3A7] text-xs space-y-1">
                <div className="font-semibold text-[#201F1E] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#B87A38]" />
                  <span>Multilingual Natural Language Client Brief (Parsed by Gemini Copilot):</span>
                </div>
                <div className="italic text-[#797673] pl-5">
                  &quot;{project.requirement.rawBriefHindiEnglish}&quot;
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. FASTTAB: JOB PLANNING LINES (BOQ STUDIO GRID - D365 STYLE) */}
      <section className="bg-white border border-[#E1DFDD] rounded shadow-2xs overflow-hidden">
        <button
          onClick={() => setLinesExpanded(!linesExpanded)}
          className="w-full px-4 py-2.5 flex items-center justify-between bg-[#F8F7F6] hover:bg-[#F3F2F1] transition border-b border-[#EDEBE9]"
        >
          <div className="flex items-center gap-2">
            {linesExpanded ? <ChevronUp className="h-4 w-4 text-[#0F6CBD]" /> : <ChevronDown className="h-4 w-4 text-[#0F6CBD]" />}
            <span className="font-bold text-sm text-[#201F1E]">Job Planning Lines (BOQ Studio &amp; Takeoffs)</span>
            <span className="bg-[#EFF6FC] text-[#0F6CBD] text-xs font-semibold px-2 py-0.5 rounded border border-[#C7E0F4]">
              {items.length} Lines Active
            </span>
          </div>

          {!linesExpanded && (
            <div className="text-xs text-[#605E5C] truncate max-w-xl">
              Total Lines: <strong className="text-[#201F1E]">{items.length}</strong> • Total Direct Cost: <strong className="text-[#201F1E]">₹{(budgetSummary?.totalDirectCost || 0).toLocaleString('en-IN')}</strong> • Total Selling: <strong className="text-[#0F6CBD]">₹{(budgetSummary?.totalClientContractValue || 0).toLocaleString('en-IN')}</strong>
            </div>
          )}
        </button>

        {linesExpanded && (
          <div className="p-4 space-y-3">
            {/* Filter & Action Toolstrip */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#F3F2F1] rounded border border-[#E1DFDD]">
              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-56">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-[#605E5C]" />
                  <input
                    type="text"
                    placeholder="Search in lines..."
                    value={lineSearch}
                    onChange={e => setLineSearch(e.target.value)}
                    className="w-full pl-7 pr-2 py-1 text-xs rounded border border-[#8A8886] bg-white text-[#201F1E] focus:border-[#0F6CBD] focus:outline-hidden"
                  />
                </div>

                {/* Trade Filter */}
                <select
                  value={selectedTrade}
                  onChange={e => setSelectedTrade(e.target.value)}
                  className="px-2 py-1 text-xs rounded border border-[#8A8886] bg-white text-[#201F1E] focus:border-[#0F6CBD] focus:outline-hidden"
                >
                  <option value="ALL">All Trades ({items.length})</option>
                  <option value="CIVIL_MASONRY">Civil &amp; Demolition</option>
                  <option value="WATERPROOFING">Waterproofing</option>
                  <option value="FLOORING_TILING">Flooring &amp; Tiling</option>
                  <option value="FALSE_CEILINGS">False Ceilings</option>
                  <option value="PAINTING_POLISHING">Painting &amp; Polishing</option>
                  <option value="CARPENTRY_JOINERY">Carpentry &amp; Joinery</option>
                  <option value="MODULAR_KITCHEN">Modular Kitchen</option>
                  <option value="WARDROBES_STORAGE">Wardrobes &amp; Storage</option>
                  <option value="ELECTRICAL_AUTOMATION">Electrical &amp; Automation</option>
                  <option value="PLUMBING_SANITARY">Plumbing &amp; Sanitary</option>
                </select>

                {/* Zone Filter */}
                <select
                  value={selectedZone}
                  onChange={e => setSelectedZone(e.target.value)}
                  className="px-2 py-1 text-xs rounded border border-[#8A8886] bg-white text-[#201F1E] focus:border-[#0F6CBD] focus:outline-hidden"
                >
                  <option value="ALL">All Rooms ({zones.length})</option>
                  {zones.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>

                {/* Quick View Modes */}
                <button
                  onClick={() => setLineFilterMode('ALL')}
                  className={`px-2 py-1 text-xs rounded transition font-medium ${
                    lineFilterMode === 'ALL'
                      ? 'bg-white text-[#0F6CBD] shadow-2xs border border-[#C7E0F4]'
                      : 'text-[#605E5C] hover:bg-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setLineFilterMode('AI_INFERRED')}
                  className={`px-2 py-1 text-xs rounded transition font-medium ${
                    lineFilterMode === 'AI_INFERRED'
                      ? 'bg-white text-[#0F6CBD] shadow-2xs border border-[#C7E0F4]'
                      : 'text-[#605E5C] hover:bg-white'
                  }`}
                >
                  AI Formulas
                </button>
                <button
                  onClick={() => setLineFilterMode('NEEDS_REVIEW')}
                  className={`px-2 py-1 text-xs rounded transition font-medium ${
                    lineFilterMode === 'NEEDS_REVIEW'
                      ? 'bg-white text-[#0F6CBD] shadow-2xs border border-[#C7E0F4]'
                      : 'text-[#605E5C] hover:bg-white'
                  }`}
                >
                  Needs Review
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {isEstimatorOrAdmin && (
                  <>
                    <button
                      onClick={() => setShowAddModal(true)}
                      disabled={isFrozen}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold transition disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Line</span>
                    </button>
                  </>
                )}

                <button
                  onClick={onExportToExcel}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-white text-[#107C41] border border-[#B3E5C7] hover:bg-[#F2FBF6] text-xs font-medium transition"
                  title="Open in Excel"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Excel</span>
                </button>
              </div>
            </div>

            {/* High-density D365 Table */}
            <div className="overflow-x-auto border border-[#E1DFDD] rounded max-h-[550px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-[#F3F2F1] text-[#323130] font-semibold border-b border-[#E1DFDD] z-10">
                  <tr>
                    <th className="p-2 border-r border-[#E1DFDD] w-10 text-center">#</th>
                    <th className="p-2 border-r border-[#E1DFDD] w-14">Type</th>
                    <th className="p-2 border-r border-[#E1DFDD] w-24">Item No.</th>
                    <th className="p-2 border-r border-[#E1DFDD] w-32">Trade</th>
                    <th className="p-2 border-r border-[#E1DFDD] w-32">Room / Zone</th>
                    <th className="p-2 border-r border-[#E1DFDD]">Description &amp; Specifications</th>
                    <th className="p-2 border-r border-[#E1DFDD] w-48">Formula Derivation</th>
                    <th className="p-2 border-r border-[#E1DFDD] text-right w-14">Unit</th>
                    <th className="p-2 border-r border-[#E1DFDD] text-right w-16">Base Qty</th>
                    <th className="p-2 border-r border-[#E1DFDD] text-right w-14">Waste %</th>
                    <th className="p-2 border-r border-[#E1DFDD] text-right w-16">Billable</th>
                    {!isClient && (
                      <>
                        <th className="p-2 border-r border-[#E1DFDD] text-right w-20">Unit Cost</th>
                        <th className="p-2 border-r border-[#E1DFDD] text-right w-24">Line Cost</th>
                        <th className="p-2 border-r border-[#E1DFDD] text-right w-16">Margin %</th>
                      </>
                    )}
                    <th className="p-2 border-r border-[#E1DFDD] text-right w-20">Unit Price</th>
                    <th className="p-2 border-r border-[#E1DFDD] text-right w-24">Line Amount</th>
                    <th className="p-2 text-center w-16">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDEBE9]">
                  {filteredItems.map((item, index) => {
                    const isSelected = selectedItem?.id === item.id;
                    const lineNo = (index + 1) * 10000;

                    return (
                      <tr 
                        key={item.id}
                        onClick={() => onSelectItem(item)}
                        className={`cursor-pointer transition ${
                          isSelected 
                            ? 'bg-[#EFF6FC] ring-1 ring-[#0F6CBD] border-l-4 border-l-[#0F6CBD]' 
                            : 'hover:bg-[#FAF9F8]'
                        }`}
                      >
                        <td className="p-2 text-center font-mono text-[#8A8886] border-r border-[#EDEBE9]">
                          {lineNo}
                        </td>
                        <td className="p-2 text-[#605E5C] border-r border-[#EDEBE9]">
                          Item
                        </td>
                        <td className="p-2 font-mono font-semibold text-[#0F6CBD] border-r border-[#EDEBE9]">
                          {item.itemCode}
                        </td>
                        <td className="p-2 text-[#201F1E] border-r border-[#EDEBE9]">
                          <span className="px-1.5 py-0.5 rounded bg-[#FAF9F8] text-[10px] font-medium border border-[#EDEBE9]">
                            {item.trade.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-2 text-[#201F1E] border-r border-[#EDEBE9] truncate max-w-[120px]">
                          {item.roomZone}
                        </td>
                        <td className="p-2 text-[#201F1E] border-r border-[#EDEBE9]">
                          <div className="font-semibold text-[#201F1E]">{item.description}</div>
                          <div className="text-[11px] text-[#605E5C] truncate max-w-sm">
                            {item.brandGrade} • {item.specification}
                          </div>
                        </td>
                        <td className="p-2 border-r border-[#EDEBE9]">
                          <span className="font-mono text-[11px] bg-[#F3F2F1] px-1.5 py-0.5 rounded border border-[#E1DFDD] text-[#201F1E] block truncate max-w-[180px]" title={item.quantityFormula}>
                            {item.quantityFormula || 'Standard allowance'}
                          </span>
                        </td>
                        <td className="p-2 text-right font-mono text-[#605E5C] border-r border-[#EDEBE9]">
                          {item.unit}
                        </td>
                        <td className="p-2 text-right font-mono text-[#201F1E] border-r border-[#EDEBE9]">
                          {item.baseQuantity}
                        </td>
                        <td className="p-2 text-right font-mono text-[#8A8886] border-r border-[#EDEBE9]">
                          +{item.wastagePercent}%
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-[#201F1E] border-r border-[#EDEBE9]">
                          {item.finalQuantity}
                        </td>

                        {!isClient && (
                          <>
                            <td className="p-2 text-right font-mono text-[#605E5C] border-r border-[#EDEBE9]">
                              ₹{item.unitCost.toLocaleString('en-IN')}
                            </td>
                            <td className="p-2 text-right font-mono font-semibold text-[#201F1E] border-r border-[#EDEBE9]">
                              ₹{item.totalCost.toLocaleString('en-IN')}
                            </td>
                            <td className="p-2 text-right font-mono text-[#107C41] border-r border-[#EDEBE9]">
                              {item.markupPercent}%
                            </td>
                          </>
                        )}

                        <td className="p-2 text-right font-mono text-[#0F6CBD] font-semibold border-r border-[#EDEBE9]">
                          ₹{item.sellingRate.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 text-right font-mono font-bold text-[#0F6CBD] border-r border-[#EDEBE9]">
                          ₹{item.sellingAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 text-center" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            {isEstimatorOrAdmin && !isFrozen && (
                              <>
                                <button
                                  onClick={() => setEditingItem(item)}
                                  className="p-1 text-[#605E5C] hover:text-[#0F6CBD] rounded hover:bg-white"
                                  title="Edit line item"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteItem(item.id)}
                                  className="p-1 text-[#605E5C] hover:text-[#A80000] rounded hover:bg-white"
                                  title="Delete line"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={17} className="p-8 text-center text-xs text-[#605E5C]">
                        No planning lines match the current filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* High-density Footer Summary */}
            <div className="flex flex-wrap items-center justify-between p-3 bg-[#FAF9F8] rounded border border-[#EDEBE9] text-xs">
              <div className="text-[#605E5C]">
                Displaying <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> lines
              </div>

              <div className="flex items-center gap-6">
                {!isClient && (
                  <div>
                    <span className="text-[#605E5C]">Total Direct Cost: </span>
                    <span className="font-bold text-[#201F1E]">
                      ₹{(budgetSummary?.totalDirectCost || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-[#605E5C]">Total Selling Price: </span>
                  <span className="font-bold text-[#0F6CBD] text-sm">
                    ₹{(budgetSummary?.totalClientContractValue || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. FASTTAB: COST ACCOUNTING & COMMERCIAL BUDGET */}
      <section className="bg-white border border-[#E1DFDD] rounded shadow-2xs overflow-hidden">
        <button
          onClick={() => setBudgetExpanded(!budgetExpanded)}
          className="w-full px-4 py-2.5 flex items-center justify-between bg-[#F8F7F6] hover:bg-[#F3F2F1] transition border-b border-[#EDEBE9]"
        >
          <div className="flex items-center gap-2">
            {budgetExpanded ? <ChevronUp className="h-4 w-4 text-[#0F6CBD]" /> : <ChevronDown className="h-4 w-4 text-[#0F6CBD]" />}
            <span className="font-bold text-sm text-[#201F1E]">Cost Accounting, Overheads &amp; Value Engineering</span>
          </div>

          {!budgetExpanded && (
            <div className="text-xs text-[#605E5C] truncate max-w-xl">
              Site Overheads: <strong className="text-[#201F1E]">5.0%</strong> • Contingency: <strong className="text-[#201F1E]">3.0%</strong> • Target Margin: <strong className="text-[#107C41]">24.0%</strong> • 3-Tier Packages Active
            </div>
          )}
        </button>

        {budgetExpanded && (
          <div className="p-4">
            <BudgetEngineView
              projectId={project.id}
              currentUser={currentUser}
              budgetSummary={budgetSummary}
              onGenerateQuotation={onGenerateQuotation}
            />
          </div>
        )}
      </section>

      {/* 6. FASTTAB: CUSTOMER PROPOSAL & FORMAL QUOTATION */}
      <section className="bg-white border border-[#E1DFDD] rounded shadow-2xs overflow-hidden">
        <button
          onClick={() => setQuotationExpanded(!quotationExpanded)}
          className="w-full px-4 py-2.5 flex items-center justify-between bg-[#F8F7F6] hover:bg-[#F3F2F1] transition border-b border-[#EDEBE9]"
        >
          <div className="flex items-center gap-2">
            {quotationExpanded ? <ChevronUp className="h-4 w-4 text-[#0F6CBD]" /> : <ChevronDown className="h-4 w-4 text-[#0F6CBD]" />}
            <span className="font-bold text-sm text-[#201F1E]">Customer Proposal, Milestones &amp; Sales Quotation</span>
          </div>

          {!quotationExpanded && (
            <div className="text-xs text-[#605E5C] truncate max-w-xl">
              Proposal Ref: <strong className="text-[#201F1E]">QUOTE-SKYLINE-2026-001</strong> • 6 Milestone Payments • Print Ready
            </div>
          )}
        </button>

        {quotationExpanded && (
          <div className="p-4">
            <CustomerQuotationView
              quotation={project.quotation || null} items={items} onPrint={onPrintQuotation}
              currentUser={currentUser}
            />
          </div>
        )}
      </section>
        </>
      )}

      {/* EDIT MODAL FOR PLANNING LINE (D365 Style Dialog) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="w-full max-w-2xl bg-white rounded shadow-2xl border border-[#EDEBE9] overflow-hidden animate-in fade-in duration-150">
            <div className="bg-[#002050] text-white px-4 py-2.5 flex items-center justify-between">
              <span className="font-semibold text-xs">Edit Job Planning Line - {editingItem.itemCode}</span>
              <button 
                onClick={() => setEditingItem(null)}
                className="text-white/70 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">Work Description</label>
                <input
                  type="text"
                  value={editingItem.description}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full mt-1 p-2 rounded border border-[#8A8886] text-xs font-semibold text-[#201F1E] focus:border-[#0F6CBD] focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#605E5C] block">Room / Zone</label>
                  <input
                    type="text"
                    value={editingItem.roomZone}
                    onChange={e => setEditingItem({ ...editingItem, roomZone: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded border border-[#8A8886] text-xs text-[#201F1E]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#605E5C] block">Brand &amp; Spec Grade</label>
                  <input
                    type="text"
                    value={editingItem.brandGrade}
                    onChange={e => setEditingItem({ ...editingItem, brandGrade: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded border border-[#8A8886] text-xs text-[#201F1E]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">Formula Derivation</label>
                <input
                  type="text"
                  value={editingItem.quantityFormula}
                  onChange={e => setEditingItem({ ...editingItem, quantityFormula: e.target.value })}
                  className="w-full mt-1 p-1.5 font-mono rounded border border-[#8A8886] text-xs text-[#201F1E]"
                  placeholder="e.g. 24 * 14.5 = 348 sq.ft + 5% waste"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 bg-[#FAF9F8] p-3 rounded border border-[#EDEBE9]">
                <div>
                  <label className="text-[11px] font-semibold text-[#605E5C] block">Base Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.baseQuantity}
                    onChange={e => setEditingItem({ ...editingItem, baseQuantity: Number(e.target.value) })}
                    className="w-full mt-1 p-1.5 font-mono rounded border border-[#8A8886] text-xs text-[#201F1E]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#605E5C] block">Wastage %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingItem.wastagePercent}
                    onChange={e => setEditingItem({ ...editingItem, wastagePercent: Number(e.target.value) })}
                    className="w-full mt-1 p-1.5 font-mono rounded border border-[#8A8886] text-xs text-[#201F1E]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#605E5C] block">Unit of Measure</label>
                  <input
                    type="text"
                    value={editingItem.unit}
                    onChange={e => setEditingItem({ ...editingItem, unit: e.target.value as any })}
                    className="w-full mt-1 p-1.5 font-mono rounded border border-[#8A8886] text-xs text-[#201F1E]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 bg-[#F3F2F1] p-3 rounded border border-[#EDEBE9]">
                <div>
                  <label className="text-[10px] text-[#605E5C] block">Material (₹)</label>
                  <input
                    type="number"
                    value={editingItem.materialRate}
                    onChange={e => setEditingItem({ ...editingItem, materialRate: Number(e.target.value) })}
                    className="w-full mt-1 p-1 font-mono rounded border border-[#8A8886] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#605E5C] block">Labour (₹)</label>
                  <input
                    type="number"
                    value={editingItem.labourRate}
                    onChange={e => setEditingItem({ ...editingItem, labourRate: Number(e.target.value) })}
                    className="w-full mt-1 p-1 font-mono rounded border border-[#8A8886] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#605E5C] block">Equipment (₹)</label>
                  <input
                    type="number"
                    value={editingItem.equipmentRate}
                    onChange={e => setEditingItem({ ...editingItem, equipmentRate: Number(e.target.value) })}
                    className="w-full mt-1 p-1 font-mono rounded border border-[#8A8886] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#605E5C] block">Markup %</label>
                  <input
                    type="number"
                    value={editingItem.markupPercent}
                    onChange={e => setEditingItem({ ...editingItem, markupPercent: Number(e.target.value) })}
                    className="w-full mt-1 p-1 font-mono rounded border border-[#8A8886] text-xs text-[#0F6CBD] font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDEBE9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 rounded border border-[#8A8886] bg-white text-[#201F1E] hover:bg-[#F3F2F1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD LINE MODAL FROM MASTER RATES (D365 Style Select Dialog) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="w-full max-w-2xl bg-white rounded shadow-2xl border border-[#EDEBE9] overflow-hidden animate-in fade-in duration-150">
            <div className="bg-[#002050] text-white px-4 py-2.5 flex items-center justify-between">
              <span className="font-semibold text-xs">Select from Master Items Price List</span>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white/70 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#605E5C]">Filter Trade:</span>
                <select
                  value={newItemTrade}
                  onChange={e => setNewItemTrade(e.target.value as TradeCategory)}
                  className="p-1.5 text-xs rounded border border-[#8A8886] bg-white text-[#201F1E]"
                >
                  <option value="CIVIL_MASONRY">Civil &amp; Demolition</option>
                  <option value="WATERPROOFING">Waterproofing</option>
                  <option value="FLOORING_TILING">Flooring &amp; Tiling</option>
                  <option value="FALSE_CEILINGS">False Ceilings</option>
                  <option value="PAINTING_POLISHING">Painting &amp; Polishing</option>
                  <option value="CARPENTRY_JOINERY">Carpentry &amp; Joinery</option>
                  <option value="MODULAR_KITCHEN">Modular Kitchen</option>
                  <option value="WARDROBES_STORAGE">Wardrobes &amp; Storage</option>
                  <option value="ELECTRICAL_AUTOMATION">Electrical &amp; Automation</option>
                  <option value="PLUMBING_SANITARY">Plumbing &amp; Sanitary</option>
                </select>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#EDEBE9] border border-[#E1DFDD] rounded">
                {masterRates
                  .filter(m => m.trade === newItemTrade)
                  .map(m => (
                    <div 
                      key={m.id}
                      onClick={() => handleSelectMasterForAdd(m)}
                      className="p-2.5 hover:bg-[#EFF6FC] cursor-pointer flex items-center justify-between group transition text-xs"
                    >
                      <div>
                        <div className="font-mono text-[10px] text-[#0F6CBD] font-semibold">{m.itemCode}</div>
                        <div className="font-semibold text-[#201F1E]">{m.description}</div>
                        <div className="text-[11px] text-[#605E5C]">{m.brandGrade} • {m.specification}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#0F6CBD]">₹{m.suggestedSellingRate.toLocaleString('en-IN')}/{m.unit}</div>
                        <div className="text-[10px] text-[#605E5C]">Cost: ₹{m.totalUnitCost}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
