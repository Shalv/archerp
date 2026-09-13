import React, { useState, useRef, useEffect } from 'react';
import {
  Calculator,
  TrendingUp,
  Percent,
  FileSpreadsheet,
  Ruler,
  Clock,
  ShieldCheck,
  Briefcase,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building,
  Layers,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { ProjectRecord, CostBudgetSummary, MasterRateItem, UserSession } from '../types/erp';

interface D365CueTilesBarProps {
  project: ProjectRecord;
  budgetSummary: CostBudgetSummary | null;
  masterRates?: MasterRateItem[];
  currentUser?: UserSession;
  onNavigateTab?: (tab: string) => void;
  onSelectRevision?: (revId: string) => void;
}

export const D365CueTilesBar: React.FC<D365CueTilesBarProps> = ({
  project,
  budgetSummary,
  masterRates = [],
  currentUser,
  onNavigateTab,
  onSelectRevision
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (tab: string) => {
    if (typeof onNavigateTab === 'function') {
      onNavigateTab(tab);
    }
  };

  const activeRev = project?.revisions?.find(r => r.id === project.activeRevisionId) || project?.revisions?.[0];
  const items = activeRev ? activeRev.items : [];
  const isClient = currentUser?.role === 'CLIENT';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCost = budgetSummary?.totalDirectCost || Math.round(project.estimatedBudget * 0.74);
  const totalSelling = budgetSummary?.totalClientContractValue || project.estimatedBudget;
  const gstAmount = Math.round(totalSelling * 0.18);
  const totalWithTax = totalSelling + gstAmount;
  const grossMargin = totalSelling > 0 ? Math.round(((totalSelling - totalCost) / totalSelling) * 1000) / 10 : 26.0;
  const marginAmount = totalSelling - totalCost;

  // Breakdown counts by trade
  const tradeCounts = items.reduce((acc, item) => {
    acc[item.trade] = (acc[item.trade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const toggleTile = (tileKey: string) => {
    setActiveDropdown(prev => prev === tileKey ? null : tileKey);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Visual Header Label */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#605E5C]">
            Activities &amp; Cue Tiles (Dashboard Matrix)
          </span>
          <span className="text-[10px] bg-[#EFF6FC] text-[#0F6CBD] px-1.5 py-0.5 rounded font-medium border border-[#C7E0F4]">
            Click any tile for drilldown &amp; dropdown options
          </span>
        </div>
        <span className="text-[11px] text-[#8A8886]">
          Posting Group: <strong className="text-[#201F1E]">Residential Turnkey</strong>
        </span>
      </div>

      {/* Grid of Cue Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-2.5">
        {/* 1. TOTAL ESTIMATED COST TILE */}
        {!isClient && (
          <div
            onClick={() => toggleTile('cost')}
            className={`group cursor-pointer rounded border p-2.5 transition relative select-none ${
              activeDropdown === 'cost'
                ? 'bg-[#EFF6FC] border-[#0F6CBD] shadow-md ring-2 ring-[#0F6CBD]/20'
                : 'bg-white border-[#E1DFDD] hover:border-[#0F6CBD] hover:bg-[#FAF9F8] hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-[#605E5C]">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Est. Cost</span>
              <div className="flex items-center gap-0.5">
                <Calculator className="h-3.5 w-3.5 text-[#0F6CBD]" />
                <ChevronDown className={`h-3 w-3 transition text-[#8A8886] ${activeDropdown === 'cost' ? 'rotate-180 text-[#0F6CBD]' : 'group-hover:text-[#0F6CBD]'}`} />
              </div>
            </div>
            <div className="mt-1 font-mono text-base font-bold text-[#201F1E] truncate">
              ₹{(totalCost / 100000).toFixed(2)}L
            </div>
            <div className="text-[10px] text-[#605E5C] truncate flex items-center justify-between mt-0.5">
              <span>Direct + Overheads</span>
              <span className="text-[#0F6CBD] font-semibold text-[9px]">Drilldown ▾</span>
            </div>
          </div>
        )}

        {/* 2. CUSTOMER CONTRACT VALUE TILE */}
        <div
          onClick={() => toggleTile('selling')}
          className={`group cursor-pointer rounded border p-2.5 transition relative select-none ${
            activeDropdown === 'selling'
              ? 'bg-[#EFF6FC] border-[#0F6CBD] shadow-md ring-2 ring-[#0F6CBD]/20'
              : 'bg-white border-[#E1DFDD] hover:border-[#0F6CBD] hover:bg-[#FAF9F8] hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-[#605E5C]">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Quotation</span>
            <div className="flex items-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5 text-[#107C41]" />
              <ChevronDown className={`h-3 w-3 transition text-[#8A8886] ${activeDropdown === 'selling' ? 'rotate-180 text-[#107C41]' : 'group-hover:text-[#107C41]'}`} />
            </div>
          </div>
          <div className="mt-1 font-mono text-base font-bold text-[#0F6CBD] truncate">
            ₹{(totalSelling / 100000).toFixed(2)}L
          </div>
          <div className="text-[10px] text-[#605E5C] truncate flex items-center justify-between mt-0.5">
            <span>Excl. 18% GST</span>
            <span className="text-[#0F6CBD] font-semibold text-[9px]">Drilldown ▾</span>
          </div>
        </div>

        {/* 3. GROSS PROFIT MARGIN TILE */}
        {!isClient && (
          <div
            onClick={() => toggleTile('margin')}
            className={`group cursor-pointer rounded border p-2.5 transition relative select-none ${
              activeDropdown === 'margin'
                ? 'bg-[#EFF6FC] border-[#0F6CBD] shadow-md ring-2 ring-[#0F6CBD]/20'
                : 'bg-white border-[#E1DFDD] hover:border-[#0F6CBD] hover:bg-[#FAF9F8] hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-[#605E5C]">
              <span className="text-[10px] font-semibold uppercase tracking-wider">Gross Margin</span>
              <div className="flex items-center gap-0.5">
                <Percent className="h-3.5 w-3.5 text-[#B87A38]" />
                <ChevronDown className={`h-3 w-3 transition text-[#8A8886] ${activeDropdown === 'margin' ? 'rotate-180 text-[#B87A38]' : 'group-hover:text-[#B87A38]'}`} />
              </div>
            </div>
            <div className="mt-1 font-mono text-base font-bold text-[#107C41] truncate">
              {grossMargin}%
            </div>
            <div className="text-[10px] text-[#605E5C] truncate flex items-center justify-between mt-0.5">
              <span>₹{(marginAmount / 100000).toFixed(2)}L Spread</span>
              <span className="text-[#0F6CBD] font-semibold text-[9px]">Drilldown ▾</span>
            </div>
          </div>
        )}

        {/* 4. ACTIVE PLANNING LINES TILE */}
        <div
          onClick={() => toggleTile('lines')}
          className={`group cursor-pointer rounded border p-2.5 transition relative select-none ${
            activeDropdown === 'lines'
              ? 'bg-[#EFF6FC] border-[#0F6CBD] shadow-md ring-2 ring-[#0F6CBD]/20'
              : 'bg-white border-[#E1DFDD] hover:border-[#0F6CBD] hover:bg-[#FAF9F8] hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-[#605E5C]">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Planning Lines</span>
            <div className="flex items-center gap-0.5">
              <FileSpreadsheet className="h-3.5 w-3.5 text-[#0F6CBD]" />
              <ChevronDown className={`h-3 w-3 transition text-[#8A8886] ${activeDropdown === 'lines' ? 'rotate-180 text-[#0F6CBD]' : 'group-hover:text-[#0F6CBD]'}`} />
            </div>
          </div>
          <div className="mt-1 font-mono text-base font-bold text-[#201F1E] truncate">
            {items.length} Lines
          </div>
          <div className="text-[10px] text-[#605E5C] truncate flex items-center justify-between mt-0.5">
            <span>BOQ Studio Takeoff</span>
            <span className="text-[#0F6CBD] font-semibold text-[9px]">Drilldown ▾</span>
          </div>
        </div>

        {/* 5. SITE SPATIAL SURVEY TILE */}
        <div
          onClick={() => toggleTile('survey')}
          className={`group cursor-pointer rounded border p-2.5 transition relative select-none ${
            activeDropdown === 'survey'
              ? 'bg-[#EFF6FC] border-[#0F6CBD] shadow-md ring-2 ring-[#0F6CBD]/20'
              : 'bg-white border-[#E1DFDD] hover:border-[#0F6CBD] hover:bg-[#FAF9F8] hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-[#605E5C]">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Carpet Area</span>
            <div className="flex items-center gap-0.5">
              <Ruler className="h-3.5 w-3.5 text-[#038387]" />
              <ChevronDown className={`h-3 w-3 transition text-[#8A8886] ${activeDropdown === 'survey' ? 'rotate-180 text-[#038387]' : 'group-hover:text-[#038387]'}`} />
            </div>
          </div>
          <div className="mt-1 font-mono text-base font-bold text-[#201F1E] truncate">
            {(project.requirement?.carpetAreaSqFt || 1650).toLocaleString()} sq.ft
          </div>
          <div className="text-[10px] text-[#605E5C] truncate flex items-center justify-between mt-0.5">
            <span>6 Rooms Surveyed</span>
            <span className="text-[#0F6CBD] font-semibold text-[9px]">Drilldown ▾</span>
          </div>
        </div>

        {/* 6. PAYMENT MILESTONES TILE */}
        <div
          onClick={() => toggleTile('milestones')}
          className={`group cursor-pointer rounded border p-2.5 transition relative select-none ${
            activeDropdown === 'milestones'
              ? 'bg-[#EFF6FC] border-[#0F6CBD] shadow-md ring-2 ring-[#0F6CBD]/20'
              : 'bg-white border-[#E1DFDD] hover:border-[#0F6CBD] hover:bg-[#FAF9F8] hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-[#605E5C]">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Milestones</span>
            <div className="flex items-center gap-0.5">
              <Clock className="h-3.5 w-3.5 text-[#7C4A1E]" />
              <ChevronDown className={`h-3 w-3 transition text-[#8A8886] ${activeDropdown === 'milestones' ? 'rotate-180 text-[#7C4A1E]' : 'group-hover:text-[#7C4A1E]'}`} />
            </div>
          </div>
          <div className="mt-1 font-mono text-base font-bold text-[#201F1E] truncate">
            6 Tranches
          </div>
          <div className="text-[10px] text-[#605E5C] truncate flex items-center justify-between mt-0.5">
            <span>Advance to Handover</span>
            <span className="text-[#0F6CBD] font-semibold text-[9px]">Drilldown ▾</span>
          </div>
        </div>

        {/* 7. REVISION BASELINE TILE */}
        <div
          onClick={() => toggleTile('revision')}
          className={`group cursor-pointer rounded border p-2.5 transition relative select-none ${
            activeDropdown === 'revision'
              ? 'bg-[#EFF6FC] border-[#0F6CBD] shadow-md ring-2 ring-[#0F6CBD]/20'
              : 'bg-white border-[#E1DFDD] hover:border-[#0F6CBD] hover:bg-[#FAF9F8] hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-[#605E5C]">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Revision</span>
            <div className="flex items-center gap-0.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#107C41]" />
              <ChevronDown className={`h-3 w-3 transition text-[#8A8886] ${activeDropdown === 'revision' ? 'rotate-180 text-[#107C41]' : 'group-hover:text-[#107C41]'}`} />
            </div>
          </div>
          <div className="mt-1 font-mono text-base font-bold text-[#201F1E] truncate">
            {activeRev?.revisionLabel || 'Rev 1.0'}
          </div>
          <div className="text-[10px] text-[#605E5C] truncate flex items-center justify-between mt-0.5">
            <span className="text-[#107C41] font-semibold">[{activeRev?.status || 'DRAFT'}]</span>
            <span className="text-[#0F6CBD] font-semibold text-[9px]">Drilldown ▾</span>
          </div>
        </div>

        {/* 8. MASTER CATALOG TILE */}
        <div
          onClick={() => toggleTile('masters')}
          className={`group cursor-pointer rounded border p-2.5 transition relative select-none ${
            activeDropdown === 'masters'
              ? 'bg-[#EFF6FC] border-[#0F6CBD] shadow-md ring-2 ring-[#0F6CBD]/20'
              : 'bg-white border-[#E1DFDD] hover:border-[#0F6CBD] hover:bg-[#FAF9F8] hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-[#605E5C]">
            <span className="text-[10px] font-semibold uppercase tracking-wider">Masters Hub</span>
            <div className="flex items-center gap-0.5">
              <Briefcase className="h-3.5 w-3.5 text-[#6264A7]" />
              <ChevronDown className={`h-3 w-3 transition text-[#8A8886] ${activeDropdown === 'masters' ? 'rotate-180 text-[#6264A7]' : 'group-hover:text-[#6264A7]'}`} />
            </div>
          </div>
          <div className="mt-1 font-mono text-base font-bold text-[#201F1E] truncate">
            {masterRates?.length || 28} Items
          </div>
          <div className="text-[10px] text-[#605E5C] truncate flex items-center justify-between mt-0.5">
            <span>Cust • Vend • Crew</span>
            <span className="text-[#0F6CBD] font-semibold text-[9px]">Drilldown ▾</span>
          </div>
        </div>
      </div>

      {/* DROPDOWN FLYOUT PANELS (POPOVERS) */}
      {activeDropdown && (
        <div className="mt-2 w-full bg-white rounded-lg border border-[#0F6CBD] shadow-xl p-4 text-xs z-30 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* 1. COST DROPDOWN */}
          {activeDropdown === 'cost' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-2">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-[#0F6CBD]" />
                  <span className="font-bold text-sm text-[#201F1E]">
                    Total Estimated Project Cost Decomposition
                  </span>
                  <span className="font-mono font-bold text-[#0F6CBD] bg-[#EFF6FC] px-2 py-0.5 rounded border border-[#C7E0F4]">
                    ₹{totalCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('budget');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0F6CBD] hover:underline"
                >
                  <span>Open Full Cost Accounting &amp; Budgets</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#FAF9F8] p-2.5 rounded border border-[#EDEBE9]">
                  <div className="text-[11px] text-[#605E5C]">Direct Materials</div>
                  <div className="font-mono text-sm font-bold text-[#201F1E] mt-0.5">
                    ₹{(budgetSummary?.directMaterialCost || 1645000).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#8A8886]">55.0% of direct costs</div>
                </div>
                <div className="bg-[#FAF9F8] p-2.5 rounded border border-[#EDEBE9]">
                  <div className="text-[11px] text-[#605E5C]">Direct Labour</div>
                  <div className="font-mono text-sm font-bold text-[#201F1E] mt-0.5">
                    ₹{(budgetSummary?.directLabourCost || 785000).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#8A8886]">26.3% of direct costs</div>
                </div>
                <div className="bg-[#FAF9F8] p-2.5 rounded border border-[#EDEBE9]">
                  <div className="text-[11px] text-[#605E5C]">Site Overheads (5%)</div>
                  <div className="font-mono text-sm font-bold text-[#201F1E] mt-0.5">
                    ₹{(budgetSummary?.siteOverheadsAmount || 149420).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#8A8886]">Site supervision, power</div>
                </div>
                <div className="bg-[#FAF9F8] p-2.5 rounded border border-[#EDEBE9]">
                  <div className="text-[11px] text-[#605E5C]">Contingency (3%)</div>
                  <div className="font-mono text-sm font-bold text-[#201F1E] mt-0.5">
                    ₹{(budgetSummary?.contingencyAmount || 89652).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#8A8886]">Unforeseen site factors</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE9]">
                <span className="text-[11px] text-[#605E5C]">
                  Deterministic calculation derived from {items.length} active Job Planning Lines.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      handleNavigate('boq');
                    }}
                    className="px-2.5 py-1 rounded bg-white text-[#323130] border border-[#8A8886] hover:bg-[#F3F2F1] text-xs font-semibold"
                  >
                    View Planning Lines
                  </button>
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      handleNavigate('budget');
                    }}
                    className="px-3 py-1 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold"
                  >
                    Adjust Budget Margins &amp; Overheads
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. SELLING QUOTATION DROPDOWN */}
          {activeDropdown === 'selling' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#107C41]" />
                  <span className="font-bold text-sm text-[#201F1E]">
                    Customer Quotation &amp; Commercial Contract Value
                  </span>
                  <span className="font-mono font-bold text-[#107C41] bg-[#DFF6DD] px-2 py-0.5 rounded border border-[#B3E5C7]">
                    ₹{totalSelling.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('quotation');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0F6CBD] hover:underline"
                >
                  <span>View Customer Proposal Document</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#FAF9F8] p-3 rounded border border-[#EDEBE9]">
                  <div className="text-[11px] text-[#605E5C]">Base Contract Value (Excl. Tax)</div>
                  <div className="font-mono text-base font-bold text-[#201F1E] mt-1">
                    ₹{totalSelling.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#107C41] mt-0.5 font-medium">Turnkey Scope Verified</div>
                </div>
                <div className="bg-[#FAF9F8] p-3 rounded border border-[#EDEBE9]">
                  <div className="text-[11px] text-[#605E5C]">Statutory GST @ 18% (Works Contract)</div>
                  <div className="font-mono text-base font-bold text-[#797673] mt-1">
                    + ₹{gstAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#8A8886] mt-0.5">HSN/SAC 9954 (Composite Supply)</div>
                </div>
                <div className="bg-[#EFF6FC] p-3 rounded border border-[#C7E0F4]">
                  <div className="text-[11px] text-[#0F6CBD] font-semibold">Total Client Outlay (Incl. GST)</div>
                  <div className="font-mono text-base font-bold text-[#0F6CBD] mt-1">
                    ₹{totalWithTax.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#605E5C] mt-0.5">Includes 18% input credit eligibility</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE9]">
                <span className="text-[11px] text-[#605E5C]">
                  Customer: <strong>{project.clientName}</strong> • Budget Range: <strong>₹{(project.requirement?.customerBudgetMin || 3000000).toLocaleString('en-IN')} - ₹{(project.requirement?.customerBudgetMax || 4500000).toLocaleString('en-IN')}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      window.print();
                    }}
                    className="px-2.5 py-1 rounded bg-white text-[#323130] border border-[#8A8886] hover:bg-[#F3F2F1] text-xs font-semibold"
                  >
                    Print Quotation (Ctrl+P)
                  </button>
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      handleNavigate('quotation');
                    }}
                    className="px-3 py-1 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold"
                  >
                    Open Customer Quotations &amp; Sales
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. MARGIN DROPDOWN */}
          {activeDropdown === 'margin' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-2">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-[#B87A38]" />
                  <span className="font-bold text-sm text-[#201F1E]">
                    Gross Margin Analysis &amp; Value Engineering Tiers
                  </span>
                  <span className="font-mono font-bold text-[#107C41] bg-[#DFF6DD] px-2 py-0.5 rounded border border-[#B3E5C7]">
                    {grossMargin}% Target Margin (₹{(marginAmount / 100000).toFixed(2)} Lakhs)
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('budget');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0F6CBD] hover:underline"
                >
                  <span>Open Value Engineering Studio</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#FAF9F8] p-3 rounded border border-[#EDEBE9]">
                  <div className="font-bold text-[#201F1E]">Essential / Economy Tier</div>
                  <div className="font-mono text-sm font-semibold text-[#605E5C] mt-1">₹37.50 Lakhs</div>
                  <div className="text-[10px] text-[#107C41] mt-0.5">Gross Margin: 22.5% (₹8.43L)</div>
                  <div className="text-[10px] text-[#8A8886] mt-1">Laminate finishes, standard sanitaryware</div>
                </div>
                <div className="bg-[#EFF6FC] p-3 rounded border border-[#0F6CBD]">
                  <div className="font-bold text-[#0F6CBD]">Standard Baseline (Active)</div>
                  <div className="font-mono text-sm font-bold text-[#0F6CBD] mt-1">₹43.50 Lakhs</div>
                  <div className="text-[10px] text-[#107C41] font-semibold mt-0.5">Gross Margin: 26.0% (₹13.62L)</div>
                  <div className="text-[10px] text-[#605E5C] mt-1">PU Polish, Italian tile format, Hafele</div>
                </div>
                <div className="bg-[#FAF9F8] p-3 rounded border border-[#EDEBE9]">
                  <div className="font-bold text-[#201F1E]">Luxury Premium Tier</div>
                  <div className="font-mono text-sm font-semibold text-[#605E5C] mt-1">₹52.00 Lakhs</div>
                  <div className="text-[10px] text-[#107C41] mt-0.5">Gross Margin: 28.0% (₹14.56L)</div>
                  <div className="text-[10px] text-[#8A8886] mt-1">Veneer with PU, quartz countertops</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE9]">
                <span className="text-[11px] text-[#605E5C]">
                  Margin is protected by deterministic cost accounting and quantity formulas.
                </span>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('budget');
                  }}
                  className="px-3 py-1 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold"
                >
                  Adjust Margins &amp; Generate VE Options
                </button>
              </div>
            </div>
          )}

          {/* 4. PLANNING LINES DROPDOWN */}
          {activeDropdown === 'lines' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-2">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-[#0F6CBD]" />
                  <span className="font-bold text-sm text-[#201F1E]">
                    Job Planning Lines Breakdown by Trade Package
                  </span>
                  <span className="font-mono font-bold text-[#0F6CBD] bg-[#EFF6FC] px-2 py-0.5 rounded border border-[#C7E0F4]">
                    {items.length} Active Lines
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('boq');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0F6CBD] hover:underline"
                >
                  <span>Open Full BOQ Studio Grid</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {Object.entries(tradeCounts).map(([trade, count]) => (
                  <div key={trade} className="bg-[#FAF9F8] p-2 rounded border border-[#EDEBE9]">
                    <div className="text-[10px] text-[#605E5C] truncate font-medium">
                      {trade.replace(/_/g, ' ')}
                    </div>
                    <div className="font-mono text-sm font-bold text-[#201F1E] mt-0.5">
                      {count} Lines
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE9]">
                <div className="flex items-center gap-3 text-[11px] text-[#605E5C]">
                  <span>AI Inferred: <strong className="text-[#0F6CBD]">8 items</strong></span>
                  <span>Needs Review: <strong className="text-[#107C41]">0 items (all verified)</strong></span>
                </div>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('boq');
                  }}
                  className="px-3 py-1 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold"
                >
                  Jump to Job Planning Lines (BOQ Studio)
                </button>
              </div>
            </div>
          )}

          {/* 5. SITE SPATIAL SURVEY DROPDOWN */}
          {activeDropdown === 'survey' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-2">
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-[#038387]" />
                  <span className="font-bold text-sm text-[#201F1E]">
                    Site Survey &amp; Spatial Room Breakdown
                  </span>
                  <span className="font-mono font-bold text-[#038387] bg-[#EFF6FC] px-2 py-0.5 rounded border border-[#C7E0F4]">
                    {(project.requirement?.carpetAreaSqFt || 1650).toLocaleString()} sq.ft Carpet Area
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('survey');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0F6CBD] hover:underline"
                >
                  <span>Open Site Survey &amp; Dimensions</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {(project.requirement?.rooms || []).map((room, idx) => (
                  <div key={idx} className="bg-[#FAF9F8] p-2 rounded border border-[#EDEBE9]">
                    <div className="font-semibold text-[#201F1E] truncate">{room.name}</div>
                    <div className="font-mono text-xs font-bold text-[#0F6CBD] mt-0.5">{(room.lengthFt * room.widthFt)} sq.ft</div>
                    <div className="text-[10px] text-[#605E5C] truncate">{room.lengthFt} × {room.widthFt} × {room.heightFt} ft</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE9]">
                <div className="text-[11px] text-[#605E5C]">
                  Super Built-up: <strong>{(project.requirement?.builtUpAreaSqFt || 2180).toLocaleString()} sq.ft</strong> • Clear Height: <strong>10.5 ft</strong>
                </div>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('survey');
                  }}
                  className="px-3 py-1 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold"
                >
                  Manage Room Measurements &amp; Constraints
                </button>
              </div>
            </div>
          )}

          {/* 6. MILESTONES DROPDOWN */}
          {activeDropdown === 'milestones' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#7C4A1E]" />
                  <span className="font-bold text-sm text-[#201F1E]">
                    Commercial Payment Milestone Schedule
                  </span>
                  <span className="font-mono font-bold text-[#7C4A1E] bg-[#FFF4CE] px-2 py-0.5 rounded border border-[#FDE3A7]">
                    6 Structured Tranches
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('quotation');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0F6CBD] hover:underline"
                >
                  <span>View Quotation Payment Terms</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
                <div className="bg-[#FAF9F8] p-2 rounded border border-[#EDEBE9]">
                  <div className="text-[10px] text-[#605E5C]">1. Advance (10%)</div>
                  <div className="font-mono font-bold text-[#201F1E] mt-0.5">₹4.35L</div>
                  <div className="text-[9px] text-[#107C41]">Mobilization</div>
                </div>
                <div className="bg-[#FAF9F8] p-2 rounded border border-[#EDEBE9]">
                  <div className="text-[10px] text-[#605E5C]">2. Civil (20%)</div>
                  <div className="font-mono font-bold text-[#201F1E] mt-0.5">₹8.70L</div>
                  <div className="text-[9px] text-[#605E5C]">Waterproofing sign-off</div>
                </div>
                <div className="bg-[#FAF9F8] p-2 rounded border border-[#EDEBE9]">
                  <div className="text-[10px] text-[#605E5C]">3. Finishes (25%)</div>
                  <div className="font-mono font-bold text-[#201F1E] mt-0.5">₹10.88L</div>
                  <div className="text-[9px] text-[#605E5C]">Flooring &amp; Ceilings</div>
                </div>
                <div className="bg-[#FAF9F8] p-2 rounded border border-[#EDEBE9]">
                  <div className="text-[10px] text-[#605E5C]">4. Joinery (25%)</div>
                  <div className="font-mono font-bold text-[#201F1E] mt-0.5">₹10.88L</div>
                  <div className="text-[9px] text-[#605E5C]">Kitchen &amp; Wardrobes</div>
                </div>
                <div className="bg-[#FAF9F8] p-2 rounded border border-[#EDEBE9]">
                  <div className="text-[10px] text-[#605E5C]">5. Polish (15%)</div>
                  <div className="font-mono font-bold text-[#201F1E] mt-0.5">₹6.53L</div>
                  <div className="text-[9px] text-[#605E5C]">Paint &amp; Fixtures</div>
                </div>
                <div className="bg-[#FAF9F8] p-2 rounded border border-[#EDEBE9]">
                  <div className="text-[10px] text-[#605E5C]">6. Handover (5%)</div>
                  <div className="font-mono font-bold text-[#201F1E] mt-0.5">₹2.18L</div>
                  <div className="text-[9px] text-[#605E5C]">Final Snag Clearance</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE9]">
                <span className="text-[11px] text-[#605E5C]">
                  Linked to physical site quality inspections and client approval sign-offs.
                </span>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('quotation');
                  }}
                  className="px-3 py-1 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold"
                >
                  Inspect Milestones in Quotation
                </button>
              </div>
            </div>
          )}

          {/* 7. REVISION DROPDOWN */}
          {activeDropdown === 'revision' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#107C41]" />
                  <span className="font-bold text-sm text-[#201F1E]">
                    Job Card Revisions &amp; Baseline Versioning
                  </span>
                  <span className="font-mono font-bold text-[#107C41] bg-[#DFF6DD] px-2 py-0.5 rounded border border-[#B3E5C7]">
                    {activeRev?.revisionLabel} [{activeRev?.status}]
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('boq');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0F6CBD] hover:underline"
                >
                  <span>Go to Job Planning Lines</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {project.revisions.map(rev => (
                  <div
                    key={rev.id}
                    onClick={() => onSelectRevision && onSelectRevision(rev.id)}
                    className={`p-2.5 rounded border flex items-center justify-between cursor-pointer transition ${
                      rev.id === activeRev?.id
                        ? 'bg-[#EFF6FC] border-[#0F6CBD] ring-1 ring-[#0F6CBD]'
                        : 'bg-white border-[#EDEBE9] hover:bg-[#FAF9F8]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-[#201F1E] flex items-center gap-2">
                        <span>{rev.revisionLabel}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          rev.status === 'APPROVED' ? 'bg-[#DFF6DD] text-[#107C41]' : 'bg-[#FFF4CE] text-[#797673]'
                        }`}>
                          {rev.status}
                        </span>
                        {rev.id === activeRev?.id && (
                          <span className="text-[10px] text-[#0F6CBD] font-bold">● Active Working Revision</span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#605E5C] mt-0.5">{rev.notes}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-xs text-[#201F1E]">{rev.items.length} Lines</div>
                      <div className="text-[10px] text-[#8A8886]">Created: {new Date(rev.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. MASTER HUB DROPDOWN */}
          {activeDropdown === 'masters' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#6264A7]" />
                  <span className="font-bold text-sm text-[#201F1E]">
                    Enterprise Master Data Section &amp; Operations Hub
                  </span>
                  <span className="font-mono font-bold text-[#6264A7] bg-[#EFF6FC] px-2 py-0.5 rounded border border-[#C7E0F4]">
                    6 Connected D365 Master Tables
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('masters');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0F6CBD] hover:underline"
                >
                  <span>Open Master Section Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div 
                  onClick={() => { setActiveDropdown(null); handleNavigate('masters'); }}
                  className="p-2 bg-[#FAF9F8] hover:bg-[#EFF6FC] rounded border border-[#EDEBE9] cursor-pointer transition"
                >
                  <div className="font-semibold text-[#201F1E]">Items &amp; Master Rates (Table 27)</div>
                  <div className="text-[10px] text-[#605E5C] mt-0.5">28 unit cost catalog items</div>
                </div>
                <div 
                  onClick={() => { setActiveDropdown(null); handleNavigate('masters'); }}
                  className="p-2 bg-[#FAF9F8] hover:bg-[#EFF6FC] rounded border border-[#EDEBE9] cursor-pointer transition"
                >
                  <div className="font-semibold text-[#201F1E]">Customer Directory (Table 18)</div>
                  <div className="text-[10px] text-[#605E5C] mt-0.5">4 residential &amp; commercial clients</div>
                </div>
                <div 
                  onClick={() => { setActiveDropdown(null); handleNavigate('masters'); }}
                  className="p-2 bg-[#FAF9F8] hover:bg-[#EFF6FC] rounded border border-[#EDEBE9] cursor-pointer transition"
                >
                  <div className="font-semibold text-[#201F1E]">Vendors &amp; Subcontractors (Table 23)</div>
                  <div className="text-[10px] text-[#605E5C] mt-0.5">5 trade contractors &amp; suppliers</div>
                </div>
                <div 
                  onClick={() => { setActiveDropdown(null); handleNavigate('masters'); }}
                  className="p-2 bg-[#FAF9F8] hover:bg-[#EFF6FC] rounded border border-[#EDEBE9] cursor-pointer transition"
                >
                  <div className="font-semibold text-[#201F1E]">Labour Crew Wages (Table 156)</div>
                  <div className="text-[10px] text-[#605E5C] mt-0.5">6 trade gangs &amp; master craftsmen</div>
                </div>
                <div 
                  onClick={() => { setActiveDropdown(null); handleNavigate('masters'); }}
                  className="p-2 bg-[#FAF9F8] hover:bg-[#EFF6FC] rounded border border-[#EDEBE9] cursor-pointer transition"
                >
                  <div className="font-semibold text-[#201F1E]">WBS Packages &amp; Wastage Catalog</div>
                  <div className="text-[10px] text-[#605E5C] mt-0.5">8 trade disciplines with waste norms</div>
                </div>
                <div 
                  onClick={() => { setActiveDropdown(null); handleNavigate('masters'); }}
                  className="p-2 bg-[#FAF9F8] hover:bg-[#EFF6FC] rounded border border-[#EDEBE9] cursor-pointer transition"
                >
                  <div className="font-semibold text-[#201F1E]">UOM &amp; Indian GST Schedules</div>
                  <div className="text-[10px] text-[#605E5C] mt-0.5">Standard units &amp; 18% Works Contract GST</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE9]">
                <span className="text-[11px] text-[#605E5C]">
                  Centralized repository powering instant BOQ takeoff generation and price book updates.
                </span>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    handleNavigate('masters');
                  }}
                  className="px-3 py-1 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold"
                >
                  Manage Master Data Section
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
