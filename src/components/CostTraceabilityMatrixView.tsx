/**
 * Build Storys ERP - Project Cost Traceability & Profitability Matrix
 * 
 * CORE INTEGRATION VIEW:
 * Links every:
 *   [1] BOQ Item & Rev Baseline
 *   [2] Budget Line (Direct Cost: Material + Labour + Equipment + Subcontract)
 *   [3] Purchase Order (PO) or Subcontract Work Order (SCWO)
 *   [4] Material Consumption (GRN Issue) / Site Work Certification (Joint Measurement)
 *   [5] Actual Expended Project Cost, Cost Variance & Live Gross Profitability Margin
 */

import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download, 
  TrendingUp, 
  Sparkles,
  Info,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { ProjectRecord, CostTraceabilityItem, TradeCategory } from '../types/erp';
import { DEMO_COST_TRACEABILITY_LEDGER, getProjectTraceabilitySummary } from '../data/costTraceabilityData';

interface CostTraceabilityMatrixViewProps {
  project: ProjectRecord;
  onOpenAIWorkspace?: () => void;
  onNavigateToBOQ?: () => void;
}

export const CostTraceabilityMatrixView: React.FC<CostTraceabilityMatrixViewProps> = ({
  project,
  onOpenAIWorkspace,
  onNavigateToBOQ
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const summary = useMemo(() => getProjectTraceabilitySummary(DEMO_COST_TRACEABILITY_LEDGER), []);

  const filteredItems = useMemo(() => {
    return DEMO_COST_TRACEABILITY_LEDGER.filter(item => {
      const matchesSearch = 
        item.boqItemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roomZone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.poNumber && item.poNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.subcontractWONumber && item.subcontractWONumber.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTrade = selectedTrade === 'ALL' || item.trade === selectedTrade;
      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

      return matchesSearch && matchesTrade && matchesStatus;
    });
  }, [searchTerm, selectedTrade, selectedStatus]);

  const exportCSV = () => {
    const headers = [
      'BOQ Code', 'Trade', 'Room Zone', 'Description', 'Unit', 'BOQ Qty',
      'Budget Unit Cost', 'Budget Total', 'Selling Rate', 'Selling Total',
      'PO No', 'PO Amount', 'Subcontract WO', 'Subcontract Amount',
      'Committed Cost', 'Actual Expended', 'Variance (₹)', 'Live Margin %', 'Status'
    ];

    const rows = filteredItems.map(i => [
      i.boqItemCode,
      i.trade,
      `"${i.roomZone}"`,
      `"${i.description.replace(/"/g, '""')}"`,
      i.unit,
      i.boqQuantity,
      i.budgetUnitCost,
      i.budgetTotalCost,
      i.sellingRate,
      i.sellingTotal,
      i.poNumber || 'N/A',
      i.poCommittedAmount,
      i.subcontractWONumber || 'N/A',
      i.subcontractCommittedAmount,
      i.totalCommittedCost,
      i.actualCostIncurred,
      i.costVariance,
      `${i.actualMarginPercent}%`,
      i.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Cost_Traceability_${project.projectCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Banner & Architectural Logic Explanation */}
      <div className="bg-white border border-[#d2d0ce] rounded shadow-xs p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#0078d4]/10 text-[#0078d4] rounded">
                <Network className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Project Cost Traceability & Profitability Matrix
                </h2>
                <p className="text-xs text-slate-500">
                  {project.title} ({project.projectCode}) • Contract Rev 1 Approved Baseline
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl pt-1">
              <strong>Core Financial Engine:</strong> Links each line from <strong>BOQ Item</strong> → <strong>Budget Direct Cost</strong> → <strong>PO / Subcontract Work Order</strong> → <strong>Material Consumption / Work Certification</strong> → <strong>Actual Project Cost</strong> to verify real-time profitability against the 26.0% target margin.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-export-traceability-csv"
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export Ledger (.CSV)</span>
            </button>

            {onOpenAIWorkspace && (
              <button
                id="btn-ai-cost-audit"
                onClick={onOpenAIWorkspace}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#5c2d91] hover:bg-[#4b2476] rounded shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>AI Cost Controller Audit</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Visual 5-Stage Traceability Pipeline Diagram */}
        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Step 1: Estimate</div>
            <div className="font-semibold text-slate-800 text-sm mt-0.5">BOQ Planning Line</div>
            <div className="text-[11px] text-slate-500 mt-1">Room, specification, measured take-off quantity & wastage %</div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Step 2: Budget</div>
            <div className="font-semibold text-slate-800 text-sm mt-0.5">Direct Cost Budget</div>
            <div className="text-[11px] text-slate-500 mt-1">Material, labour, equipment & subcontractor base rates</div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Step 3: Commit</div>
            <div className="font-semibold text-slate-800 text-sm mt-0.5">PO & Subcontract WO</div>
            <div className="text-[11px] text-slate-500 mt-1">Binding supplier purchase orders and trade contractor work orders</div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Step 4: Consume</div>
            <div className="font-semibold text-slate-800 text-sm mt-0.5">GRN & Work Certified</div>
            <div className="text-[11px] text-slate-500 mt-1">Goods received on site, material issue slips & joint measurement bills</div>
          </div>

          <div className="bg-emerald-50 p-2.5 rounded border border-emerald-300">
            <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Step 5: Ledger</div>
            <div className="font-semibold text-emerald-900 text-sm mt-0.5">Actual Cost & Margin</div>
            <div className="text-[11px] text-emerald-700 mt-1">Cost variance, live gross profit margin % and financial health</div>
          </div>
        </div>
      </div>

      {/* 3. Executive KPI Dashboard Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded border border-slate-200 shadow-xs">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Client Contract Value</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">
            ₹{summary.totalSellingContract.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-slate-500">Approved Selling Price</div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-200 shadow-xs">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Budgeted Cost Baseline</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">
            ₹{summary.totalBudgetCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-slate-500">Target Direct Cost</div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-200 shadow-xs">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Total Committed Cost</div>
          <div className="text-lg font-bold text-blue-700 mt-0.5">
            ₹{summary.totalCommittedCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-blue-600">POs + Subcontracts Issued</div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-200 shadow-xs">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Actual Cost Expended</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">
            ₹{summary.totalActualCostIncurred.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-slate-500">Certified Bills + Stores GRN</div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-200 shadow-xs">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Cost Variance</div>
          <div className={`text-lg font-bold mt-0.5 ${summary.savingsFavorable ? 'text-emerald-700' : 'text-rose-600'}`}>
            {summary.savingsFavorable ? '+' : ''}₹{summary.totalCostVariance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className={`text-[10px] font-medium ${summary.savingsFavorable ? 'text-emerald-600' : 'text-rose-600'}`}>
            {summary.savingsFavorable ? 'Favorable Savings' : 'Budget Overrun Alert'}
          </div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-200 shadow-xs">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Live Profit Margin</div>
          <div className="text-lg font-bold text-emerald-800 mt-0.5">
            {summary.liveProjectMarginPercent}%
          </div>
          <div className="text-[10px] text-slate-500">
            Target: {summary.budgetedMarginPercent}% ({summary.liveProjectMarginPercent >= summary.budgetedMarginPercent ? 'Ahead' : 'Below'})
          </div>
        </div>
      </div>

      {/* 4. Controls & Filters */}
      <div className="bg-white p-3 rounded border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by BOQ Code, Description, Room, PO #, Contractor..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label className="text-slate-600 font-medium">Trade:</label>
          <select
            value={selectedTrade}
            onChange={e => setSelectedTrade(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
          >
            <option value="ALL">All Trades</option>
            <option value="DEMOLITION_DISPOSAL">Demolition & Civil</option>
            <option value="WATERPROOFING">Waterproofing</option>
            <option value="FLOORING_TILING">Flooring & Tiling</option>
            <option value="FALSE_CEILINGS">False Ceilings</option>
            <option value="CARPENTRY_JOINERY">Carpentry & Joinery</option>
            <option value="PAINTING_FINISHING">Painting & Polishing</option>
          </select>

          <label className="text-slate-600 font-medium ml-2">Status:</label>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
          >
            <option value="ALL">All Statuses</option>
            <option value="CERTIFIED">Certified Complete</option>
            <option value="PARTIALLY_DELIVERED">Partially Delivered / In Progress</option>
            <option value="COMMITTED">Committed PO</option>
            <option value="BUDGETED">Budgeted Only</option>
          </select>
        </div>
      </div>

      {/* 5. The Comprehensive Traceability Table */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1240px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3 whitespace-nowrap">BOQ Code & Scope</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Room Zone</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">BOQ Qty</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right bg-blue-50/50">Budget Total (₹)</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right bg-blue-50/50">Selling Total (₹)</th>
                <th className="py-2.5 px-3 whitespace-nowrap bg-purple-50/50">Committed Order (PO / SCWO)</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right bg-purple-50/50">Committed (₹)</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right bg-amber-50/50">Actual Expended (₹)</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right bg-emerald-50/50">Cost Variance (₹)</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center bg-emerald-50/50">Margin %</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map(item => {
                const isSavings = item.costVariance >= 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* BOQ Code & Scope */}
                    <td className="py-2 px-3">
                      <div className="font-mono font-bold text-slate-900">{item.boqItemCode}</div>
                      <div className="text-slate-700 font-medium line-clamp-1 max-w-[220px]" title={item.description}>
                        {item.description}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.trade}</div>
                    </td>

                    {/* Room Zone */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {item.roomZone}
                      </span>
                    </td>

                    {/* BOQ Qty */}
                    <td className="py-2 px-3 text-right font-mono whitespace-nowrap">
                      <div>{item.boqQuantity.toLocaleString('en-IN')} {item.unit}</div>
                      <div className="text-[10px] text-slate-400">@ ₹{item.budgetUnitCost}/{item.unit}</div>
                    </td>

                    {/* Budget Total */}
                    <td className="py-2 px-3 text-right font-mono font-medium text-slate-800 bg-blue-50/20 whitespace-nowrap">
                      ₹{item.budgetTotalCost.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                    </td>

                    {/* Selling Total */}
                    <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900 bg-blue-50/20 whitespace-nowrap">
                      ₹{item.sellingTotal.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                    </td>

                    {/* Committed Order */}
                    <td className="py-2 px-3 bg-purple-50/20">
                      {item.poNumber && (
                        <div className="text-[11px] font-mono text-blue-700 font-semibold">
                          PO: {item.poNumber} <span className="text-slate-600 font-normal">({item.poVendorName})</span>
                        </div>
                      )}
                      {item.subcontractWONumber && (
                        <div className="text-[11px] font-mono text-indigo-700 font-semibold">
                          WO: {item.subcontractWONumber} <span className="text-slate-600 font-normal">({item.subcontractorName})</span>
                        </div>
                      )}
                    </td>

                    {/* Committed Amount */}
                    <td className="py-2 px-3 text-right font-mono font-medium text-slate-800 bg-purple-50/20 whitespace-nowrap">
                      ₹{item.totalCommittedCost.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                    </td>

                    {/* Actual Expended */}
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 bg-amber-50/20 whitespace-nowrap">
                      ₹{item.actualCostIncurred.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                    </td>

                    {/* Cost Variance */}
                    <td className="py-2 px-3 text-right font-mono font-bold bg-emerald-50/20 whitespace-nowrap">
                      <span className={isSavings ? 'text-emerald-700' : 'text-rose-600'}>
                        {isSavings ? '+' : ''}₹{item.costVariance.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                      </span>
                    </td>

                    {/* Margin % */}
                    <td className="py-2 px-3 text-center font-mono font-bold bg-emerald-50/20 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                        item.actualMarginPercent >= item.budgetedMarginPercent
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.actualMarginPercent}%
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === 'CERTIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'PARTIALLY_DELIVERED'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'COMMITTED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.status === 'CERTIFIED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {item.status === 'PARTIALLY_DELIVERED' && <Clock className="w-3 h-3 text-blue-600" />}
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#0078d4]" />
            <span>
              Showing {filteredItems.length} of {DEMO_COST_TRACEABILITY_LEDGER.length} audited items. All numbers derived deterministically from Estimator Rev 1 Baseline and certified Running Account bills.
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono font-semibold">
            <span>Budget: ₹{summary.totalBudgetCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            <span>Expended: ₹{summary.totalActualCostIncurred.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            <span className="text-emerald-700">Variance: +₹{summary.totalCostVariance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
