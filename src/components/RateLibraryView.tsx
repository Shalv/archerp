import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  DollarSign, 
  Clock,
  Building,
  Database,
  FileSpreadsheet,
  Package
} from 'lucide-react';
import { MasterRateItem, TradeCategory, UserSession } from '../types/erp';

interface RateLibraryViewProps {
  masterRates: MasterRateItem[];
  currentUser: UserSession;
  onUpdateRate: (rate: MasterRateItem) => void;
  onAddRate: (rate: MasterRateItem) => void;
}

export const RateLibraryView: React.FC<RateLibraryViewProps> = ({
  masterRates,
  currentUser,
  onUpdateRate,
  onAddRate
}) => {
  const [search, setSearch] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');
  const [editingRate, setEditingRate] = useState<MasterRateItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const isEstimatorOrAdmin = currentUser?.role === 'ESTIMATOR' || currentUser?.role === 'ADMIN';

  const filtered = masterRates.filter(rate => {
    const matchesSearch = 
      rate.itemCode.toLowerCase().includes(search.toLowerCase()) ||
      rate.description.toLowerCase().includes(search.toLowerCase()) ||
      rate.brandGrade.toLowerCase().includes(search.toLowerCase());
    const matchesTrade = selectedTrade === 'ALL' || rate.trade === selectedTrade;
    return matchesSearch && matchesTrade;
  });

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRate) return;

    if (isAddingNew) {
      onAddRate(editingRate);
    } else {
      onUpdateRate(editingRate);
    }
    setEditingRate(null);
    setIsAddingNew(false);
  };

  const handleStartAdd = () => {
    const newRate: MasterRateItem = {
      id: `RATE-${Date.now()}`,
      itemCode: `ITM-0${masterRates.length + 1}`,
      trade: 'CARPENTRY_JOINERY',
      workPackage: 'General Millwork Package',
      description: '',
      specification: '',
      brandGrade: '',
      unit: 'sq.ft',
      materialRate: 0,
      labourRate: 0,
      equipmentRate: 0,
      subcontractRate: 0,
      totalUnitCost: 0,
      defaultMarkupPercent: 25,
      suggestedSellingRate: 0,
      rateSource: 'APPROVED_MASTER',
      location: 'National Master (Delhi NCR / Bengaluru)',
      effectiveDate: '2026-09-11',
      status: 'APPROVED',
      gstRate: 18
    };
    setEditingRate(newRate);
    setIsAddingNew(true);
  };

  return (
    <div className="space-y-4">
      {/* D365 List Page Header */}
      <div className="bg-white border border-[#E1DFDD] p-4 rounded shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#605E5C] uppercase tracking-wider">
                Price List &amp; Catalog
              </span>
              <span className="bg-[#EFF6FC] text-[#0F6CBD] font-mono text-xs font-bold px-2 py-0.5 rounded border border-[#C7E0F4]">
                Table 27 &quot;Item&quot;
              </span>
              <span className="bg-[#DFF6DD] text-[#107C41] text-xs font-semibold px-2 py-0.5 rounded">
                Audited Q3-2026
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#201F1E] mt-1 tracking-tight">
              Master Items &amp; Standard Unit Price List
            </h1>
            <p className="text-xs text-[#605E5C] mt-0.5">
              Standardized procurement costs decomposed into direct materials, trade labour, tools, and subcontractor rates.
            </p>
          </div>

          {isEstimatorOrAdmin && (
            <button
              onClick={handleStartAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold shadow-2xs transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Master Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white border border-[#E1DFDD] rounded shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#605E5C]" />
            <input
              type="text"
              placeholder="Search code, specification, brand..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-[#8A8886] bg-white text-[#201F1E] focus:border-[#0F6CBD] focus:outline-hidden"
            />
          </div>

          <select
            value={selectedTrade}
            onChange={e => setSelectedTrade(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded border border-[#8A8886] bg-white text-[#201F1E] focus:border-[#0F6CBD] focus:outline-hidden"
          >
            <option value="ALL">All Trades ({masterRates.length})</option>
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

        <span className="text-xs text-[#605E5C]">
          Showing <strong>{filtered.length}</strong> master price records
        </span>
      </div>

      {/* D365 Master Rates Grid */}
      <div className="bg-white border border-[#E1DFDD] rounded shadow-2xs overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-[#F3F2F1] text-[#323130] font-semibold border-b border-[#E1DFDD] z-10 select-none">
              <tr>
                <th className="p-2.5 border-r border-[#E1DFDD] w-24 whitespace-nowrap">Item No.</th>
                <th className="p-2.5 border-r border-[#E1DFDD] w-36 whitespace-nowrap">Trade Discipline</th>
                <th className="p-2.5 border-r border-[#E1DFDD] min-w-[280px] whitespace-nowrap">Description &amp; Specifications</th>
                <th className="p-2.5 border-r border-[#E1DFDD] w-32 whitespace-nowrap">Brand / Grade</th>
                <th className="p-2.5 border-r border-[#E1DFDD] text-right w-16 whitespace-nowrap">Unit</th>
                <th className="p-2.5 border-r border-[#E1DFDD] text-right w-20 whitespace-nowrap">Material</th>
                <th className="p-2.5 border-r border-[#E1DFDD] text-right w-20 whitespace-nowrap">Labour</th>
                <th className="p-2.5 border-r border-[#E1DFDD] text-right w-20 whitespace-nowrap">Equip/Sub</th>
                <th className="p-2.5 border-r border-[#E1DFDD] text-right w-24 whitespace-nowrap">Unit Cost</th>
                <th className="p-2.5 border-r border-[#E1DFDD] text-right w-16 whitespace-nowrap">Margin %</th>
                <th className="p-2.5 border-r border-[#E1DFDD] text-right w-24 whitespace-nowrap">Sell Price</th>
                <th className="p-2.5 border-r border-[#E1DFDD] text-center w-20 whitespace-nowrap">Status</th>
                {isEstimatorOrAdmin && <th className="p-2.5 text-center w-16 whitespace-nowrap">Edit</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBE9]">
              {filtered.map(rate => (
                <tr key={rate.id} className="hover:bg-[#FAF9F8] transition">
                  <td className="p-2.5 font-mono font-semibold text-[#0F6CBD] border-r border-[#EDEBE9]">
                    {rate.itemCode}
                  </td>
                  <td className="p-2.5 text-[#201F1E] border-r border-[#EDEBE9]">
                    <span className="px-1.5 py-0.5 rounded bg-[#FAF9F8] border border-[#EDEBE9] text-[10px]">
                      {rate.trade.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-2.5 border-r border-[#EDEBE9]">
                    <div className="font-semibold text-[#201F1E]">{rate.description}</div>
                    <div className="text-[11px] text-[#605E5C] truncate max-w-md">{rate.specification}</div>
                  </td>
                  <td className="p-2.5 text-[#201F1E] border-r border-[#EDEBE9]">
                    {rate.brandGrade}
                  </td>
                  <td className="p-2.5 text-right font-mono text-[#605E5C] border-r border-[#EDEBE9]">
                    {rate.unit}
                  </td>
                  <td className="p-2.5 text-right font-mono text-[#605E5C] border-r border-[#EDEBE9]">
                    ₹{rate.materialRate.toLocaleString('en-IN')}
                  </td>
                  <td className="p-2.5 text-right font-mono text-[#605E5C] border-r border-[#EDEBE9]">
                    ₹{rate.labourRate.toLocaleString('en-IN')}
                  </td>
                  <td className="p-2.5 text-right font-mono text-[#605E5C] border-r border-[#EDEBE9]">
                    ₹{(rate.equipmentRate + rate.subcontractRate).toLocaleString('en-IN')}
                  </td>
                  <td className="p-2.5 text-right font-mono font-semibold text-[#201F1E] border-r border-[#EDEBE9]">
                    ₹{rate.totalUnitCost.toLocaleString('en-IN')}
                  </td>
                  <td className="p-2.5 text-right font-mono text-[#107C41] border-r border-[#EDEBE9]">
                    {rate.defaultMarkupPercent}%
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold text-[#0F6CBD] border-r border-[#EDEBE9]">
                    ₹{rate.suggestedSellingRate.toLocaleString('en-IN')}
                  </td>
                  <td className="p-2.5 text-center border-r border-[#EDEBE9]">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      rate.status === 'APPROVED' ? 'bg-[#DFF6DD] text-[#107C41]' : 'bg-[#FFF4CE] text-[#797673]'
                    }`}>
                      {rate.status}
                    </span>
                  </td>
                  {isEstimatorOrAdmin && (
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => {
                          setEditingRate({ ...rate });
                          setIsAddingNew(false);
                        }}
                        className="p-1 text-[#605E5C] hover:text-[#0F6CBD] rounded hover:bg-[#F3F2F1]"
                        title="Edit Master Rate"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="w-full max-w-xl bg-white rounded shadow-2xl border border-[#EDEBE9] overflow-hidden">
            <div className="bg-[#002050] text-white px-4 py-2.5 flex items-center justify-between">
              <span className="font-semibold text-xs">
                {isAddingNew ? 'Create New Master Rate' : `Edit Rate - ${editingRate.itemCode}`}
              </span>
              <button 
                onClick={() => setEditingRate(null)}
                className="text-white/70 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveRate} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#605E5C] block">Item Code</label>
                  <input
                    type="text"
                    value={editingRate.itemCode}
                    onChange={e => setEditingRate({ ...editingRate, itemCode: e.target.value })}
                    className="w-full mt-1 p-1.5 font-mono rounded border border-[#8A8886]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#605E5C] block">Trade Category</label>
                  <select
                    value={editingRate.trade}
                    onChange={e => setEditingRate({ ...editingRate, trade: e.target.value as TradeCategory })}
                    className="w-full mt-1 p-1.5 rounded border border-[#8A8886]"
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
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">Description</label>
                <input
                  type="text"
                  value={editingRate.description}
                  onChange={e => setEditingRate({ ...editingRate, description: e.target.value })}
                  className="w-full mt-1 p-1.5 rounded border border-[#8A8886] font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#605E5C] block">Specification Details</label>
                <input
                  type="text"
                  value={editingRate.specification}
                  onChange={e => setEditingRate({ ...editingRate, specification: e.target.value })}
                  className="w-full mt-1 p-1.5 rounded border border-[#8A8886]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#605E5C] block">Brand &amp; Grade</label>
                  <input
                    type="text"
                    value={editingRate.brandGrade}
                    onChange={e => setEditingRate({ ...editingRate, brandGrade: e.target.value })}
                    className="w-full mt-1 p-1.5 rounded border border-[#8A8886]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#605E5C] block">Unit of Measure</label>
                  <input
                    type="text"
                    value={editingRate.unit}
                    onChange={e => setEditingRate({ ...editingRate, unit: e.target.value as any })}
                    className="w-full mt-1 p-1.5 font-mono rounded border border-[#8A8886]"
                  />
                </div>
              </div>

              {/* Rates breakdown */}
              <div className="grid grid-cols-4 gap-2 bg-[#F3F2F1] p-3 rounded border border-[#EDEBE9]">
                <div>
                  <label className="text-[10px] text-[#605E5C] block">Material (₹)</label>
                  <input
                    type="number"
                    value={editingRate.materialRate}
                    onChange={e => {
                      const mat = Number(e.target.value);
                      const total = mat + editingRate.labourRate + editingRate.equipmentRate + editingRate.subcontractRate;
                      const sell = Math.round(total * (1 + editingRate.defaultMarkupPercent / 100));
                      setEditingRate({ ...editingRate, materialRate: mat, totalUnitCost: total, suggestedSellingRate: sell });
                    }}
                    className="w-full mt-1 p-1 font-mono rounded border border-[#8A8886]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#605E5C] block">Labour (₹)</label>
                  <input
                    type="number"
                    value={editingRate.labourRate}
                    onChange={e => {
                      const lab = Number(e.target.value);
                      const total = editingRate.materialRate + lab + editingRate.equipmentRate + editingRate.subcontractRate;
                      const sell = Math.round(total * (1 + editingRate.defaultMarkupPercent / 100));
                      setEditingRate({ ...editingRate, labourRate: lab, totalUnitCost: total, suggestedSellingRate: sell });
                    }}
                    className="w-full mt-1 p-1 font-mono rounded border border-[#8A8886]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#605E5C] block">Markup %</label>
                  <input
                    type="number"
                    value={editingRate.defaultMarkupPercent}
                    onChange={e => {
                      const mk = Number(e.target.value);
                      const sell = Math.round(editingRate.totalUnitCost * (1 + mk / 100));
                      setEditingRate({ ...editingRate, defaultMarkupPercent: mk, suggestedSellingRate: sell });
                    }}
                    className="w-full mt-1 p-1 font-mono rounded border border-[#8A8886] font-bold text-[#0F6CBD]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#605E5C] block">Sell Price (₹)</label>
                  <div className="w-full mt-1 p-1 font-mono font-bold text-[#0F6CBD] bg-white border border-[#EDEBE9] rounded">
                    ₹{editingRate.suggestedSellingRate}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDEBE9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRate(null)}
                  className="px-3 py-1.5 rounded border border-[#8A8886] bg-white hover:bg-[#F3F2F1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] font-semibold"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
