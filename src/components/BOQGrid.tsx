import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Plus, 
  Search, 
  Filter, 
  HelpCircle, 
  Info, 
  Edit3, 
  Trash2, 
  FileSpreadsheet, 
  Layers, 
  DollarSign, 
  ShieldCheck, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileCheck
} from 'lucide-react';
import { BOQItem, BOQRevision, CostBudgetSummary, MasterRateItem, TradeCategory, UserSession } from '../types/erp';

interface BOQGridProps {
  revisions: BOQRevision[];
  activeRevisionId?: string;
  onSelectRevision: (revId: string) => void;
  currentUser: UserSession;
  masterRates: MasterRateItem[];
  onGenerateAIBOQ: () => void;
  isGeneratingAI: boolean;
  onUpdateItem: (itemId: string, updatedFields: Partial<BOQItem>) => void;
  onAddItem: (item: Partial<BOQItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onApproveBaseline: () => void;
  budgetSummary?: CostBudgetSummary | null;
}

export const BOQGrid: React.FC<BOQGridProps> = ({
  revisions,
  activeRevisionId,
  onSelectRevision,
  currentUser,
  masterRates,
  onGenerateAIBOQ,
  isGeneratingAI,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  onApproveBaseline,
  budgetSummary
}) => {
  const activeRev = revisions.find(r => r.id === activeRevisionId) || revisions[0];
  const items = activeRev ? activeRev.items : [];

  const [search, setSearch] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Edit Item Modal
  const [editingItem, setEditingItem] = useState<BOQItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemTrade, setNewItemTrade] = useState<TradeCategory>('CARPENTRY_JOINERY');

  const isEstimatorOrAdmin = currentUser?.role === 'ESTIMATOR' || currentUser?.role === 'ADMIN';
  const isClient = currentUser?.role === 'CLIENT';
  const isFrozen = activeRev?.status === 'APPROVED' || activeRev?.status === 'FROZEN_BASELINE';

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.itemCode.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.roomZone.toLowerCase().includes(search.toLowerCase()) ||
      item.brandGrade.toLowerCase().includes(search.toLowerCase());

    const matchesTrade = selectedTrade === 'ALL' || item.trade === selectedTrade;
    const matchesZone = selectedZone === 'ALL' || item.roomZone === selectedZone;

    return matchesSearch && matchesTrade && matchesZone;
  });

  // Unique zones and trades for filter
  const zones = Array.from(new Set(items.map(i => i.roomZone))).filter((z): z is string => !!z);
  const availableTrades = Array.from(new Set(items.map(i => i.trade))).filter((t): t is TradeCategory => !!t);

  // Save edited item
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Recalculate deterministic quantities & amounts
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
    setEditingItem(null);
  };

  // Add from master
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
    <div className="space-y-6">
      {/* Top Banner & Revision Control */}
      <div className="rounded-xl border border-[#E5DFD7] bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#EFEAE2] px-2 py-0.5 text-xs font-bold text-[#554B3E]">
                PRIMARY FEATURE
              </span>
              <span className="rounded bg-[#E8F3ED] px-2 py-0.5 text-xs font-semibold text-[#1C7346]">
                Traceable AI Takeoff & Deterministic Costing
              </span>
            </div>
            <h2 className="mt-2 font-serif text-2xl font-bold text-[#1F2421]">
              Bill of Quantities (BOQ) Studio
            </h2>
            <p className="mt-1 text-xs text-[#6B7280]">
              Every quantity is derived from verified room schedules with explicit formulas, material waste, and master rates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Revision Picker */}
            <div className="flex items-center gap-2 rounded-lg border border-[#DDD4C7] bg-[#FAF8F5] px-3 py-1.5 text-xs">
              <span className="text-[#7A7165] font-medium">Revision:</span>
              <select
                value={activeRev?.id}
                onChange={e => onSelectRevision(e.target.value)}
                className="bg-transparent font-semibold text-[#1F2421] focus:outline-hidden cursor-pointer"
              >
                {revisions.map(rev => (
                  <option key={rev.id} value={rev.id}>
                    {rev.revisionLabel} ({rev.status})
                  </option>
                ))}
              </select>
            </div>

            {/* AI Re-generate Button */}
            <button
              onClick={onGenerateAIBOQ}
              disabled={isGeneratingAI || isFrozen}
              className="flex items-center gap-1.5 rounded-lg bg-[#273034] px-4 py-2 text-xs font-semibold text-[#E0A96D] hover:bg-[#1A2022] transition shadow-xs disabled:opacity-50"
              title="Generate new AI Takeoff Revision from verified site survey dimensions"
            >
              {isGeneratingAI ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>AI Takeoff in progress...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate Draft BOQ (AI)</span>
                </>
              )}
            </button>

            {/* Estimator Approval Button */}
            {!isFrozen ? (
              <button
                onClick={onApproveBaseline}
                disabled={!isEstimatorOrAdmin}
                className="flex items-center gap-1.5 rounded-lg bg-[#1E7348] px-4 py-2 text-xs font-semibold text-white hover:bg-[#175C3A] transition shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                title={isEstimatorOrAdmin ? "Freeze this revision as approved baseline" : "Only Estimator/Admin can approve baseline"}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Approve & Freeze Baseline</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 rounded-lg bg-[#E7F4EE] px-3 py-2 text-xs font-semibold text-[#1E7348] border border-[#B7DFC9]">
                <Lock className="h-3.5 w-3.5" />
                <span>Baseline Approved & Frozen</span>
              </div>
            )}
          </div>
        </div>

        {/* Quality Alerts Banner */}
        {activeRev && (activeRev.missingDimensionAlerts?.length > 0 || activeRev.missingRateAlerts?.length > 0) && (
          <div className="mt-5 rounded-lg border border-[#F5DEC7] bg-[#FFF9F2] p-3.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#9A5012]">
              <AlertTriangle className="h-4 w-4" />
              <span>Quantity Surveyor Quality Gates & Alerts:</span>
            </div>
            <div className="mt-2 space-y-1 text-[#783D0D]">
              {activeRev.missingDimensionAlerts?.map((alert, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="font-bold">•</span>
                  <span><strong>Dimension Alert:</strong> {alert}</span>
                </div>
              ))}
              {activeRev.missingRateAlerts?.map((alert, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="font-bold">•</span>
                  <span><strong>Rate Status:</strong> {alert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Rollup Bar */}
        {budgetSummary && (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#F0EBE3] pt-4">
            <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#EDE7DF]">
              <div className="text-[11px] text-[#78716C] font-medium">Direct Site Cost</div>
              <div className="text-sm font-bold text-[#1F2421] font-mono mt-0.5">
                {isClient ? '*** Confidentially Masked ***' : `₹${budgetSummary.totalDirectCost.toLocaleString('en-IN')}`}
              </div>
              <div className="text-[10px] text-[#A8A29E]">Material + Labour + Equip</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#EDE7DF]">
              <div className="text-[11px] text-[#78716C] font-medium">Indirect & Overheads</div>
              <div className="text-sm font-bold text-[#1F2421] font-mono mt-0.5">
                {isClient ? '*** Confidentially Masked ***' : `₹${(budgetSummary.siteOverheadsAmount + budgetSummary.contingencyAmount + budgetSummary.siteLogisticsExpense).toLocaleString('en-IN')}`}
              </div>
              <div className="text-[10px] text-[#A8A29E]">5% Overheads + 3% Contingency</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#EDE7DF]">
              <div className="text-[11px] text-[#78716C] font-medium">Selling (Before Tax)</div>
              <div className="text-sm font-bold text-[#1F2421] font-mono mt-0.5">
                ₹{budgetSummary.totalSellingBeforeTax.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-[#1E7348] font-medium">
                {isClient ? 'Standard Rate Card' : `Gross Margin: ${budgetSummary.grossMarginPercent}%`}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#EDE7DF]">
              <div className="text-[11px] text-[#78716C] font-medium">Contract Value (Incl. 18% GST)</div>
              <div className="text-sm font-bold text-[#A86F37] font-mono mt-0.5">
                ₹{budgetSummary.totalClientContractValue.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-[#A8A29E]">Turnkey Works Contract</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search code, specs, zone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-lg border border-[#D5CCC0] bg-white pl-8 pr-3 py-1.5 text-xs text-[#1F2421] focus:border-[#273034] focus:outline-hidden w-48 sm:w-60"
            />
          </div>

          {/* Trade Filter */}
          <select
            value={selectedTrade}
            onChange={e => setSelectedTrade(e.target.value)}
            className="rounded-lg border border-[#D5CCC0] bg-white px-2.5 py-1.5 text-xs text-[#1F2421] focus:outline-hidden"
          >
            <option value="ALL">All Trades ({items.length})</option>
            {availableTrades.map(trade => (
              <option key={trade} value={trade}>
                {trade.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          {/* Zone Filter */}
          <select
            value={selectedZone}
            onChange={e => setSelectedZone(e.target.value)}
            className="rounded-lg border border-[#D5CCC0] bg-white px-2.5 py-1.5 text-xs text-[#1F2421] focus:outline-hidden"
          >
            <option value="ALL">All Zones & Rooms</option>
            {zones.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>

        {/* Add Item Button */}
        {!isFrozen && isEstimatorOrAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 rounded-lg border border-[#D5CCC0] bg-[#FAF7F2] px-3.5 py-1.5 text-xs font-semibold text-[#3C362F] hover:bg-[#F0EBE2] transition shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Item from Master Rate Library</span>
          </button>
        )}
      </div>

      {/* Main BOQ Table */}
      <div className="rounded-xl border border-[#E5DFD7] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1260px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9] bg-[#FAF8F5] text-[11px] font-semibold text-[#6C6356] select-none">
                <th className="p-3 w-10 text-center whitespace-nowrap">#</th>
                <th className="p-3 whitespace-nowrap">Item Code &amp; Trade</th>
                <th className="p-3 whitespace-nowrap">Room / Zone</th>
                <th className="p-3 min-w-[240px] whitespace-nowrap">Description &amp; Approved Spec</th>
                <th className="p-3 text-right whitespace-nowrap">Unit</th>
                <th className="p-3 text-right whitespace-nowrap">Base Qty</th>
                <th className="p-3 text-right whitespace-nowrap">Waste %</th>
                <th className="p-3 text-right whitespace-nowrap">Final Qty</th>
                {!isClient && <th className="p-3 text-right whitespace-nowrap">Unit Cost</th>}
                {!isClient && <th className="p-3 text-right whitespace-nowrap">Total Cost</th>}
                <th className="p-3 text-right whitespace-nowrap">Selling Rate</th>
                <th className="p-3 text-right whitespace-nowrap">Selling Amount</th>
                <th className="p-3 text-center whitespace-nowrap">Status</th>
                <th className="p-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE5]">
              {filteredItems.map((item, idx) => {
                const isExpanded = expandedItemId === item.id;
                return (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-[#FCFAF7] transition group">
                      <td className="p-3 text-[#9CA3AF] font-mono text-[10px] text-center whitespace-nowrap">{idx + 1}</td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-mono font-bold text-[#1F2421]">{item.itemCode}</div>
                        <div className="text-[10px] text-[#8C8275]">{item.trade}</div>
                      </td>
                      <td className="p-3 font-medium text-[#423C33] whitespace-nowrap">{item.roomZone}</td>
                      <td className="p-3 min-w-[240px]">
                        <div className="font-semibold text-[#1F2421]">{item.description}</div>
                        <div className="mt-0.5 text-[11px] text-[#6B7280]">{item.brandGrade}</div>
                        {item.uncertaintyFlags && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-[#B45309]">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{item.uncertaintyFlags}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-3 font-mono text-[#554E45] text-right whitespace-nowrap">{item.unit}</td>
                      <td className="p-3 text-right font-mono whitespace-nowrap tabular-nums">{item.baseQuantity}</td>
                      <td className="p-3 text-right font-mono text-[#78716C] whitespace-nowrap tabular-nums">{item.wastagePercent}%</td>
                      <td className="p-3 text-right font-mono font-bold text-[#1F2421] whitespace-nowrap tabular-nums">{item.finalQuantity}</td>
                      
                      {/* Internal Costs - Hidden for Client */}
                      {!isClient && (
                        <td className="p-3 text-right font-mono text-[#5D5549] whitespace-nowrap tabular-nums">
                          ₹{item.unitCost.toLocaleString('en-IN')}
                        </td>
                      )}
                      {!isClient && (
                        <td className="p-3 text-right font-mono font-semibold text-[#1F2421] whitespace-nowrap tabular-nums">
                          ₹{item.totalCost.toLocaleString('en-IN')}
                        </td>
                      )}

                      <td className="p-3 text-right font-mono text-[#795548] whitespace-nowrap tabular-nums">
                        ₹{item.sellingRate.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#1F2421] whitespace-nowrap tabular-nums">
                        ₹{item.sellingAmount.toLocaleString('en-IN')}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap">
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          item.quantityType === 'PROVISIONAL_ALLOWANCE'
                            ? 'bg-[#FEF3C7] text-[#92400E]'
                            : item.isApprovedByEstimator
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : 'bg-[#E0F2FE] text-[#0369A1]'
                        }`}>
                          {item.quantityType === 'PROVISIONAL_ALLOWANCE' ? 'PROVISIONAL' : item.isApprovedByEstimator ? 'APPROVED' : 'AI DRAFT'}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                            className="rounded p-1 text-[#8C8275] hover:bg-[#EFEAE2] transition"
                            title="Traceability & Formulas"
                          >
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>
                          {!isFrozen && isEstimatorOrAdmin && (
                            <>
                              <button
                                onClick={() => setEditingItem(item)}
                                className="rounded p-1 text-[#8C8275] hover:bg-[#EFEAE2] hover:text-[#1F2421] transition"
                                title="Edit Quantities & Rates"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteItem(item.id)}
                                className="rounded p-1 text-[#9CA3AF] hover:bg-[#FEE2E2] hover:text-[#DC2626] transition"
                                title="Delete Item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Traceability Drawer */}
                    {isExpanded && (
                      <tr className="bg-[#FAF7F2] border-b border-[#E8E2D9]">
                        <td colSpan={isClient ? 12 : 14} className="p-4 text-xs">
                          <div className="rounded-lg border border-[#E0D7CB] bg-white p-4 space-y-3">
                            <div className="flex items-center gap-2 font-bold text-[#1F2421] text-xs">
                              <Info className="h-4 w-4 text-[#A86F37]" />
                              <span>Quantity Surveying Traceability & Explicit Derivation:</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                              <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#EDE7DF]">
                                <div className="text-[10px] font-semibold text-[#8C8275] uppercase">Formula & Dimensions</div>
                                <div className="mt-1 font-mono font-bold text-[#2A2F33]">{item.quantityFormula}</div>
                                <div className="mt-1 text-[11px] text-[#6B7280]">
                                  Base Qty: {item.baseQuantity} {item.unit} + {item.wastagePercent}% wastage = {item.finalQuantity} {item.unit}
                                </div>
                              </div>

                              <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#EDE7DF]">
                                <div className="text-[10px] font-semibold text-[#8C8275] uppercase">Source & References</div>
                                <div className="mt-1 font-medium text-[#2A2F33]">{item.sourceDocumentRef || 'Survey Schedule'}</div>
                                <div className="mt-1 text-[11px] text-[#6B7280]">
                                  Rate Source: <strong>{item.rateSource}</strong> ({item.rateStatus})
                                </div>
                              </div>

                              <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#EDE7DF]">
                                <div className="text-[10px] font-semibold text-[#8C8275] uppercase">Rate Breakdown (Per {item.unit})</div>
                                {!isClient ? (
                                  <div className="mt-1 text-[11px] space-y-0.5 text-[#554E45]">
                                    <div>Material: ₹{item.materialRate} • Labour: ₹{item.labourRate}</div>
                                    <div>Equip: ₹{item.equipmentRate} • Subcontract: ₹{item.subcontractRate}</div>
                                    <div className="font-bold text-[#1F2421] border-t border-[#E8E2D9] pt-0.5 mt-0.5">
                                      Unit Cost: ₹{item.unitCost} + {item.markupPercent}% markup = ₹{item.sellingRate}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mt-1 text-[11px] text-[#842029]">
                                    Confidential contractor rate breakdown masked.
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-xs text-[#5D5549]">
                              <strong>QS Assumptions & Notes:</strong> {item.assumptions || 'Standard execution per manufacturer specification.'}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Count */}
        <div className="flex items-center justify-between border-t border-[#E8E2D9] bg-[#FAF8F5] p-3 text-xs text-[#6B7280]">
          <span>Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> total BOQ items</span>
          <span>Stage: <strong>{activeRev ? activeRev.status : 'N/A'}</strong></span>
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <form onSubmit={handleSaveEdit} className="w-full max-w-xl rounded-xl border border-[#E5DFD7] bg-[#FAF8F5] p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1F2421]">
              Edit BOQ Item: {editingItem.itemCode}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-[#6B7280]">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="mt-1 w-full rounded border border-[#D5CCC0] bg-white p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#6B7280]">Base Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.baseQuantity}
                    onChange={e => setEditingItem({ ...editingItem, baseQuantity: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded border border-[#D5CCC0] bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#6B7280]">Wastage (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingItem.wastagePercent}
                    onChange={e => setEditingItem({ ...editingItem, wastagePercent: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded border border-[#D5CCC0] bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#6B7280]">Markup (%)</label>
                  <input
                    type="number"
                    step="1"
                    value={editingItem.markupPercent}
                    onChange={e => setEditingItem({ ...editingItem, markupPercent: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded border border-[#D5CCC0] bg-white p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#6B7280]">Material Rate</label>
                  <input
                    type="number"
                    value={editingItem.materialRate}
                    onChange={e => setEditingItem({ ...editingItem, materialRate: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded border border-[#D5CCC0] bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#6B7280]">Labour Rate</label>
                  <input
                    type="number"
                    value={editingItem.labourRate}
                    onChange={e => setEditingItem({ ...editingItem, labourRate: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded border border-[#D5CCC0] bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#6B7280]">Equipment Rate</label>
                  <input
                    type="number"
                    value={editingItem.equipmentRate}
                    onChange={e => setEditingItem({ ...editingItem, equipmentRate: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded border border-[#D5CCC0] bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#6B7280]">Subcontract Rate</label>
                  <input
                    type="number"
                    value={editingItem.subcontractRate}
                    onChange={e => setEditingItem({ ...editingItem, subcontractRate: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded border border-[#D5CCC0] bg-white p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6B7280]">Quantity Derivation Formula</label>
                <input
                  type="text"
                  value={editingItem.quantityFormula}
                  onChange={e => setEditingItem({ ...editingItem, quantityFormula: e.target.value })}
                  className="mt-1 w-full rounded border border-[#D5CCC0] bg-white p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6B7280]">Assumptions & Constraints</label>
                <input
                  type="text"
                  value={editingItem.assumptions}
                  onChange={e => setEditingItem({ ...editingItem, assumptions: e.target.value })}
                  className="mt-1 w-full rounded border border-[#D5CCC0] bg-white p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E2D9]">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="rounded-lg px-4 py-2 text-xs text-[#6B7280] hover:bg-[#EDE8E1]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#273034] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1A2022]"
              >
                Save & Recalculate Totals
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add from Master Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-xl border border-[#E5DFD7] bg-[#FAF8F5] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1F2421]">
                  Add Line Item from Master Rate Library
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Approved rates with deterministic material, labour, and subcontractor breakdowns.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded p-1 text-[#6B7280] hover:bg-[#EDE8E1]"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-2 pr-1">
              {masterRates.map(master => (
                <div
                  key={master.id}
                  className="flex items-center justify-between rounded-lg border border-[#E3DBD0] bg-white p-3 hover:border-[#273034] transition cursor-pointer"
                  onClick={() => handleSelectMasterForAdd(master)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#1F2421]">{master.itemCode}</span>
                      <span className="rounded bg-[#EFE9DF] px-1.5 py-0.2 text-[10px] font-semibold text-[#4A4036]">{master.trade}</span>
                      <span className="text-xs font-medium text-[#1F2421]">{master.description}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-[#6B7280]">{master.brandGrade}</div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-xs text-[#1F2421]">
                      ₹{master.totalUnitCost.toLocaleString('en-IN')} / {master.unit}
                    </div>
                    <div className="text-[10px] text-[#1E7348]">
                      Suggested Sell: ₹{master.suggestedSellingRate}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end border-t border-[#E8E2D9] pt-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg bg-[#273034] px-4 py-2 text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
