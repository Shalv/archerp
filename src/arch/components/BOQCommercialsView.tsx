import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  History,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Printer,
  Trash2,
  Edit2,
  Calculator,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { BOQItem, BOQRevision } from '../types';
import { formatINR } from '../utils/currency';

export const BOQCommercialsView: React.FC<{ onNavigateTab: (tab: string) => void }> = ({
  onNavigateTab,
}) => {
  const { activeProject, createBOQRevision, setActiveBOQRevision } = useProject();

  const [isCreatingRevision, setIsCreatingRevision] = useState(false);
  const [revisionLabel, setRevisionLabel] = useState('');
  const [revisionReason, setRevisionReason] = useState('');
  const [marginPercent, setMarginPercent] = useState<number>(12);
  const [contingencyPercent, setContingencyPercent] = useState<number>(5);
  const [taxPercent, setTaxPercent] = useState<number>(8.5);

  if (!activeProject) return null;

  const revisions = activeProject.boqRevisions || [];
  const currentRevisionIndex = activeProject.activeBOQRevisionNumber || 0;
  const currentRevision: BOQRevision | undefined =
    revisions[currentRevisionIndex] || revisions[0];

  // If user wants to create a new revision, initialize draft items from current
  const [draftItems, setDraftItems] = useState<BOQItem[]>([]);

  const handleOpenCreateRevision = () => {
    const sourceItems = currentRevision?.items || [];
    setDraftItems(
      sourceItems.map((it) => ({
        ...it,
        id: `draft-${Date.now()}-${Math.random()}`,
      }))
    );
    setRevisionLabel(`Rev ${revisions.length} - Change Order`);
    setRevisionReason('');
    setMarginPercent(currentRevision?.contractorMarginPercent || 12);
    setContingencyPercent(currentRevision?.contingencyPercent || 5);
    setTaxPercent(currentRevision?.taxPercent || 8.5);
    setIsCreatingRevision(true);
  };

  const handleSaveNewRevision = () => {
    if (draftItems.length === 0) return;
    createBOQRevision(
      activeProject.id,
      revisionLabel,
      revisionReason,
      draftItems,
      marginPercent,
      contingencyPercent,
      taxPercent
    );
    setIsCreatingRevision(false);
  };

  const handleUpdateDraftItem = (
    index: number,
    field: keyof BOQItem,
    value: any
  ) => {
    setDraftItems((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], [field]: value };
      if (field === 'quantity' || field === 'unitRate') {
        target.amount = Math.round(target.quantity * target.unitRate);
      }
      updated[index] = target;
      return updated;
    });
  };

  const handleAddDraftItem = () => {
    const newItem: BOQItem = {
      id: `new-${Date.now()}`,
      category: 'Carpentry & Modular',
      itemCode: `ADD-0${draftItems.length + 1}`,
      description: 'Custom bespoke architectural millwork line item',
      unit: 'sq.ft',
      quantity: 100,
      unitRate: 45,
      amount: 4500,
      notes: 'Included in scope update',
    };
    setDraftItems([...draftItems, newItem]);
  };

  const handleDeleteDraftItem = (index: number) => {
    setDraftItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Draft calculations
  const draftSubtotal = draftItems.reduce((acc, it) => acc + it.amount, 0);
  const draftContingency = Math.round((draftSubtotal * contingencyPercent) / 100);
  const draftMargin = Math.round((draftSubtotal * marginPercent) / 100);
  const draftTaxable = draftSubtotal + draftContingency + draftMargin;
  const draftTax = Math.round((draftTaxable * taxPercent) / 100);
  const draftGrandTotal = draftTaxable + draftTax;

  if (revisions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <FileSpreadsheet className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          No Bill of Quantities Baseline Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          In ArchCRM, the itemized BOQ is automatically generated from your approved architectural concept option without repeated data entry.
        </p>
        <button
          type="button"
          onClick={() => onNavigateTab('ai-studio')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs inline-flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Select Concept in AI Studio</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Revision Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono">
              Commercial Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Traceable Commercial Revisions &amp; Margins
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Bill of Quantities &amp; Project Commercials
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Contract-grade rate breakdown with auditable revision control, contingency reserves, and contractor margin tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleOpenCreateRevision}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Create New Revision</span>
          </button>
        </div>
      </div>

      {/* Revision History Switcher */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-800">Select Revision History:</span>
          <div className="flex space-x-1 overflow-x-auto">
            {revisions.map((rev) => {
              const isSelected = rev.revisionNumber === currentRevision?.revisionNumber;
              return (
                <button
                  key={rev.revisionNumber}
                  type="button"
                  onClick={() => setActiveBOQRevision(activeProject.id, rev.revisionNumber)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rev.revisionLabel}
                </button>
              );
            })}
          </div>
        </div>

        {currentRevision && (
          <div className="text-xs text-slate-500 flex items-center space-x-2">
            <span>Author: <strong>{currentRevision.author}</strong></span>
            <span>•</span>
            <span>Date: <strong>{currentRevision.date}</strong></span>
          </div>
        )}
      </div>

      {/* Revision Metadata & Audit Reason */}
      {currentRevision && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start sm:items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 font-mono shrink-0">
              Audit Reason
            </span>
            <p className="text-slate-700 font-medium">{currentRevision.reasonForChange}</p>
          </div>
          <span className="text-[11px] text-slate-400 shrink-0">
            {currentRevision.items.length} itemized trade specifications
          </span>
        </div>
      )}

      {/* Itemized Table */}
      {currentRevision && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">Code</th>
                  <th className="py-3 px-3.5">Trade Category</th>
                  <th className="py-3 px-3.5">Description &amp; Specification</th>
                  <th className="py-3 px-3.5 text-center">Unit</th>
                  <th className="py-3 px-3.5 text-right">Quantity</th>
                  <th className="py-3 px-3.5 text-right">Rate ($)</th>
                  <th className="py-3 px-3.5 text-right">Amount ($)</th>
                  <th className="py-3 px-3.5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {currentRevision.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">{item.itemCode}</td>
                    <td className="py-2.5 px-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 max-w-sm text-slate-800 font-medium">
                      {item.description}
                    </td>
                    <td className="py-2.5 px-3.5 text-center text-slate-500">{item.unit}</td>
                    <td className="py-2.5 px-3.5 text-right font-mono">{item.quantity.toLocaleString()}</td>
                    <td className="py-2.5 px-3.5 text-right font-mono">{formatINR(item.unitRate)}</td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900">
                      {formatINR(item.amount)}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-400 text-[11px] max-w-xs truncate">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown Summary Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2 text-xs text-slate-500 max-w-md">
              <div className="flex items-center space-x-1.5 font-semibold text-slate-700">
                <Calculator className="w-4 h-4 text-slate-400" />
                <span>Commercial Terms &amp; Margin Rules</span>
              </div>
              <p className="leading-relaxed">
                Contingency is earmarked for hidden site conditions and municipal inspections. Contractor margin is applied post-contingency before statutory sales taxes.
              </p>
            </div>

            <div className="w-full md:w-80 space-y-2 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Direct Trade Subtotal:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatINR(currentRevision.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Contingency Reserve ({currentRevision.contingencyPercent}%):</span>
                <span className="font-mono text-slate-700">
                  +{formatINR(Math.round((currentRevision.subtotal * currentRevision.contingencyPercent) / 100))}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Contractor Margin ({currentRevision.contractorMarginPercent}%):</span>
                <span className="font-mono text-slate-700">
                  +{formatINR(Math.round((currentRevision.subtotal * currentRevision.contractorMarginPercent) / 100))}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Applicable Tax ({currentRevision.taxPercent}%):</span>
                <span className="font-mono text-slate-700">
                  +{formatINR(Math.round(
                    ((currentRevision.subtotal * (1 + (currentRevision.contingencyPercent + currentRevision.contractorMarginPercent) / 100)) *
                      currentRevision.taxPercent) /
                      100
                  ))}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
                <span>Contract Grand Total:</span>
                <span className="font-mono text-base text-slate-950">
                  {formatINR(currentRevision.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Overlay to Create New Revision */}
      {isCreatingRevision && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Create Auditable Commercial Revision (Rev {revisions.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Modify trade line items, quantities, or commercial markups with traceable audit reasons.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingRevision(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Revision Label
                  </label>
                  <input
                    type="text"
                    value={revisionLabel}
                    onChange={(e) => setRevisionLabel(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Reason for Revision / Change Order
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Upgraded joinery finishes & scope addition"
                    value={revisionReason}
                    onChange={(e) => setRevisionReason(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              {/* Editable Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Trade Line Items ({draftItems.length})</span>
                  <button
                    type="button"
                    onClick={handleAddDraftItem}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-2">Code</th>
                        <th className="py-2 px-2">Description</th>
                        <th className="py-2 px-2">Unit</th>
                        <th className="py-2 px-2 text-right">Qty</th>
                        <th className="py-2 px-2 text-right">Rate ($)</th>
                        <th className="py-2 px-2 text-right">Amount ($)</th>
                        <th className="py-2 px-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {draftItems.map((it, idx) => (
                        <tr key={it.id || idx}>
                          <td className="p-2 font-mono">
                            <input
                              type="text"
                              value={it.itemCode}
                              onChange={(e) => handleUpdateDraftItem(idx, 'itemCode', e.target.value)}
                              className="w-16 px-1.5 py-1 border border-slate-200 rounded text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={it.description}
                              onChange={(e) => handleUpdateDraftItem(idx, 'description', e.target.value)}
                              className="w-full px-1.5 py-1 border border-slate-200 rounded text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={it.unit}
                              onChange={(e) => handleUpdateDraftItem(idx, 'unit', e.target.value)}
                              className="w-14 px-1.5 py-1 border border-slate-200 rounded text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={it.quantity}
                              onChange={(e) => handleUpdateDraftItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-16 px-1.5 py-1 border border-slate-200 rounded text-xs text-right font-mono"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={it.unitRate}
                              onChange={(e) => handleUpdateDraftItem(idx, 'unitRate', parseFloat(e.target.value) || 0)}
                              className="w-20 px-1.5 py-1 border border-slate-200 rounded text-xs text-right font-mono"
                            />
                          </td>
                          <td className="p-2 text-right font-mono font-bold">
                            {formatINR(it.amount)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteDraftItem(idx)}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Commercial Ratios */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Contingency Reserve %
                  </label>
                  <input
                    type="number"
                    value={contingencyPercent}
                    onChange={(e) => setContingencyPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Contractor Margin %
                  </label>
                  <input
                    type="number"
                    value={marginPercent}
                    onChange={(e) => setMarginPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Statutory Tax %
                  </label>
                  <input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Draft Grand Total Display */}
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Revised Grand Total</span>
                  <span className="text-base font-bold font-mono text-amber-400">
                    {formatINR(draftGrandTotal)}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  Subtotal: {formatINR(draftSubtotal)} | Margin: +{formatINR(draftMargin)}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsCreatingRevision(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewRevision}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
              >
                Commit Revision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
