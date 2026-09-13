import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  Layers, 
  Check, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  ChevronRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  Sliders,
  ArrowDownRight
} from 'lucide-react';
import { CostBudgetSummary, AlternativePackageOption, ValueEngineeringOption, UserSession } from '../types/erp';
import { getAlternativePackages, getValueEngineeringOptions } from '../server/syntheticDemo';

interface BudgetEngineViewProps {
  projectId: string;
  currentUser: UserSession;
  budgetSummary?: CostBudgetSummary | null;
  onGenerateQuotation: (tier: 'ECONOMY' | 'STANDARD' | 'PREMIUM') => void;
}

export const BudgetEngineView: React.FC<BudgetEngineViewProps> = ({
  projectId,
  currentUser,
  budgetSummary,
  onGenerateQuotation
}) => {
  const [alternatives, setAlternatives] = useState<AlternativePackageOption[]>(() => 
    getAlternativePackages(budgetSummary?.totalDirectCost || 1350000)
  );
  const [veOptions, setVeOptions] = useState<ValueEngineeringOption[]>(() => 
    getValueEngineeringOptions()
  );
  const [selectedTier, setSelectedTier] = useState<'ECONOMY' | 'STANDARD' | 'PREMIUM'>('STANDARD');
  const [loading, setLoading] = useState(true);

  const isClient = currentUser?.role === 'CLIENT';

  useEffect(() => {
    const headers: Record<string, string> = {};
    if (currentUser?.id) {
      headers['x-user-id'] = currentUser.id;
    }

    Promise.all([
      fetch(`/api/projects/${projectId}/alternatives`, { headers })
        .then(async r => {
          if (!r.ok) return null;
          return r.json();
        })
        .catch(() => null),
      fetch(`/api/projects/${projectId}/value-engineering`, { headers })
        .then(async r => {
          if (!r.ok) return null;
          return r.json();
        })
        .catch(() => null)
    ])
      .then(([alts, ves]) => {
        if (Array.isArray(alts) && alts.length > 0) {
          setAlternatives(alts);
        } else {
          setAlternatives(getAlternativePackages(budgetSummary?.totalDirectCost || 1350000));
        }

        if (Array.isArray(ves) && ves.length > 0) {
          setVeOptions(ves);
        } else {
          setVeOptions(getValueEngineeringOptions());
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load budget comparisons:', err);
        setAlternatives(getAlternativePackages(budgetSummary?.totalDirectCost || 1350000));
        setVeOptions(getValueEngineeringOptions());
        setLoading(false);
      });
  }, [projectId, currentUser?.id, budgetSummary?.totalDirectCost]);

  const handleToggleVE = async (veId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/value-engineering/${veId}/toggle`, {
        method: 'PUT',
        headers: {
          'x-user-id': currentUser?.id || ''
        }
      });
      if (res.ok) {
        const updated = await res.json();
        if (updated && updated.id) {
          setVeOptions(prev => (Array.isArray(prev) ? prev : getValueEngineeringOptions()).map(v => v.id === veId ? updated : v));
          return;
        }
      }
    } catch (err) {
      console.error('Failed to toggle VE option:', err);
    }
    // Fallback locally
    setVeOptions(prev => (Array.isArray(prev) ? prev : getValueEngineeringOptions()).map(v => v.id === veId ? { ...v, isAccepted: !v.isAccepted } : v));
  };

  const safeVeOptions = Array.isArray(veOptions) ? veOptions : [];
  const safeAlternatives = Array.isArray(alternatives) ? alternatives : [];

  const totalVeSavings = safeVeOptions
    .filter(v => v.isAccepted)
    .reduce((acc, v) => acc + (v.sellingReduction || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-[#E5DFD7] bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#EFEAE2] px-2 py-0.5 text-xs font-bold text-[#554B3E]">
                STEP 4 OF 8
              </span>
              <span className="rounded bg-[#E8F3ED] px-2 py-0.5 text-xs font-semibold text-[#1C7346]">
                Deterministic Cost Accounting & Specification Tiers
              </span>
            </div>
            <h2 className="mt-2 font-serif text-2xl font-bold text-[#1F2421]">
              Commercial Budget Engine & Value Engineering
            </h2>
            <p className="mt-1 text-xs text-[#6B7280]">
              Mathematical separation of direct site costs, indirect contractor overheads, and multi-tier finish alternatives.
            </p>
          </div>

          <button
            onClick={() => onGenerateQuotation(selectedTier)}
            className="flex items-center gap-2 rounded-lg bg-[#273034] px-4 py-2.5 text-xs font-semibold text-[#E0A96D] hover:bg-[#1A2022] transition shadow-xs"
          >
            <FileText className="h-4 w-4" />
            <span>Generate Customer Quotation ({selectedTier})</span>
          </button>
        </div>
      </div>

      {/* Internal Cost Breakdown - Masked if Client */}
      {!isClient ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Direct Costs Panel */}
          <div className="rounded-xl border border-[#E5DFD7] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F0EBE3] pb-3">
              <h3 className="font-serif text-sm font-bold text-[#1F2421]">1. Direct Site Costs</h3>
              <span className="font-mono text-xs font-bold text-[#1F2421]">
                ₹{budgetSummary?.totalDirectCost.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Direct Materials (TMT, Ply, Tiles, Paint)</span>
                <span className="font-mono font-semibold text-[#273034]">
                  ₹{budgetSummary?.directMaterialCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Direct Site Labour (Carpenters, Masons, Plumbers)</span>
                <span className="font-mono font-semibold text-[#273034]">
                  ₹{budgetSummary?.directLabourCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Tools & Equipment (Scaffolding, Cutters, Compressors)</span>
                <span className="font-mono font-semibold text-[#273034]">
                  ₹{budgetSummary?.directEquipmentCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Specialist Subcontractors (PU Polish, Glass Glazing)</span>
                <span className="font-mono font-semibold text-[#273034]">
                  ₹{budgetSummary?.directSubcontractCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-[#FAF8F5] p-2.5 text-[11px] text-[#7A7165]">
              Computed strictly from BOQ line items with item-level material, labour, and subcontract rates.
            </div>
          </div>

          {/* Indirect Costs & Overheads Panel */}
          <div className="rounded-xl border border-[#E5DFD7] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F0EBE3] pb-3">
              <h3 className="font-serif text-sm font-bold text-[#1F2421]">2. Site Overheads & Allowances</h3>
              <span className="font-mono text-xs font-bold text-[#1F2421]">
                ₹{((budgetSummary?.siteOverheadsAmount || 0) + (budgetSummary?.contingencyAmount || 0) + (budgetSummary?.siteLogisticsExpense || 0)).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Site Supervision & Preliminaries (5.0%)</span>
                <span className="font-mono font-semibold text-[#273034]">
                  ₹{budgetSummary?.siteOverheadsAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Project Risk Contingency Allowance (3.0%)</span>
                <span className="font-mono font-semibold text-[#273034]">
                  ₹{budgetSummary?.contingencyAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Freight, Debris Carting & Society Lift Logistics</span>
                <span className="font-mono font-semibold text-[#273034]">
                  ₹{budgetSummary?.siteLogisticsExpense.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Material Escalation Risk Hedge</span>
                <span className="font-mono font-semibold text-[#273034]">
                  Fixed Price Contract (₹0)
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-[#FAF8F5] p-2.5 text-[11px] text-[#7A7165]">
              Total Internal Cost Budget: <strong>₹{budgetSummary?.totalProjectCost.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Margins & Taxes Panel */}
          <div className="rounded-xl border border-[#E5DFD7] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F0EBE3] pb-3">
              <h3 className="font-serif text-sm font-bold text-[#1F2421]">3. Commercial Margin & Taxes</h3>
              <span className="font-mono text-xs font-bold text-[#1E7348]">
                {budgetSummary?.grossMarginPercent}% Margin
              </span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Gross Margin Contribution</span>
                <span className="font-mono font-bold text-[#1E7348]">
                  ₹{budgetSummary?.grossMarginAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Selling Subtotal (Before GST)</span>
                <span className="font-mono font-semibold text-[#1F2421]">
                  ₹{budgetSummary?.totalSellingBeforeTax.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Works Contract GST (18.0%)</span>
                <span className="font-mono font-semibold text-[#795548]">
                  ₹{budgetSummary?.gstAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-[#F0EBE3] pt-2 font-bold">
                <span className="text-[#1F2421]">Total Contract Value</span>
                <span className="font-mono text-[#A86F37]">
                  ₹{budgetSummary?.totalClientContractValue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-[#EBF3EF] p-2.5 text-[11px] text-[#1E7348]">
              Markup on Cost: <strong>{budgetSummary?.markupOnCostPercent}%</strong> • Turnkey execution pricing model.
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[#F5C2C7] bg-[#FFF5F5] p-4 text-xs text-[#842029]">
          Internal contractor cost rates and gross profit margins are protected under company confidentiality protocols.
        </div>
      )}

      {/* Trade & Room Cost Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trade Breakdown */}
        <div className="rounded-xl border border-[#E5DFD7] bg-white p-5 shadow-xs">
          <h3 className="font-serif text-sm font-bold text-[#1F2421] border-b border-[#F0EBE3] pb-2">
            Trade-wise Value Distribution
          </h3>
          <div className="mt-3 space-y-2">
            {budgetSummary?.tradeBreakdown?.map(t => (
              <div key={t.trade} className="rounded-lg border border-[#EDE7DF] bg-[#FAF8F5] p-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1F2421]">{t.trade.replace(/_/g, ' ')}</span>
                  <span className="font-mono font-bold text-[#1F2421]">₹{t.sellingAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-[#7A7165]">
                  <span>{t.itemsCount} Takeoff Items</span>
                  {!isClient && <span>Target Margin: {t.marginPercent}%</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room/Zone Breakdown */}
        <div className="rounded-xl border border-[#E5DFD7] bg-white p-5 shadow-xs">
          <h3 className="font-serif text-sm font-bold text-[#1F2421] border-b border-[#F0EBE3] pb-2">
            Room / Spatial Zone Allocation
          </h3>
          <div className="mt-3 space-y-2">
            {budgetSummary?.roomBreakdown?.map(r => (
              <div key={r.roomZone} className="rounded-lg border border-[#EDE7DF] bg-[#FAF8F5] p-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1F2421]">{r.roomZone}</span>
                  <span className="font-mono font-bold text-[#1F2421]">₹{r.sellingAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-[#7A7165]">
                  <span>{r.itemsCount} Scope Items</span>
                  <span>Allocation: {((r.sellingAmount / (budgetSummary.totalSellingBeforeTax || 1)) * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Tier Comparison Cards (Economy vs Standard vs Premium) */}
      <div className="space-y-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#1F2421]">
            Alternative Specification Tiers
          </h3>
          <p className="text-xs text-[#6B7280]">
            Evaluate Economy, Standard, and Premium specification packages with detailed material grades and timeline variances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {safeAlternatives.map(alt => {
            const isSelected = selectedTier === alt.tier;
            const ratePerSqFt = Math.round(alt.totalSellingPrice / 1650);
            return (
              <div
                key={alt.tier}
                onClick={() => setSelectedTier(alt.tier)}
                className={`relative flex flex-col justify-between rounded-xl border p-5 cursor-pointer transition shadow-xs ${
                  isSelected
                    ? 'border-[#273034] bg-[#FBF9F6] ring-2 ring-[#273034]'
                    : 'border-[#E5DFD7] bg-white hover:border-[#C4BAAC]'
                }`}
              >
                {alt.tier === 'STANDARD' && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-[#A86F37] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    Recommended Baseline
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base font-bold text-[#1F2421]">{alt.title}</span>
                    <span className="rounded bg-[#EFEAE2] px-2 py-0.5 text-[10px] font-bold text-[#4A4036]">
                      {alt.badge}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#6B7280]">{alt.specificationsSummary}</p>

                  {/* Pricing Box */}
                  <div className="mt-4 rounded-lg bg-[#FAF8F5] p-3 border border-[#EAE3DA]">
                    <div className="text-[11px] text-[#7A7165]">Client Quotation (Excl. Tax)</div>
                    <div className="font-serif text-xl font-bold text-[#1F2421] mt-0.5">
                      ₹{alt.totalSellingPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-[#A86F37] font-semibold mt-0.5">
                      ₹{ratePerSqFt} / sq.ft carpet area
                    </div>
                  </div>

                  {/* Specs List */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="text-[11px] font-bold text-[#8C8275] uppercase tracking-wider">
                      Specification Highlights:
                    </div>
                    {alt.materialsHighlights.map((spec, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[#4D453B]">
                        <Check className="h-3.5 w-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-[#EAE3DA] pt-3">
                  <div className="flex items-center justify-between text-xs text-[#7A7165]">
                    <span>Turnkey Duration:</span>
                    <span className="font-bold text-[#1F2421]">{alt.timelineWeeks} Weeks</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateQuotation(alt.tier);
                    }}
                    className={`mt-3 w-full rounded-lg py-2 text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-[#273034] text-[#E0A96D] hover:bg-[#1A2022]'
                        : 'border border-[#D5CCC0] bg-white text-[#1F2421] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    Generate {alt.title} Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Value Engineering Interactive Module */}
      <div className="rounded-xl border border-[#E5DFD7] bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE3] pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-[#FAF4EC] p-1.5 text-[#B87A38]">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#1F2421]">
                Interactive Value Engineering (VE) Matrix
              </h3>
              <p className="text-xs text-[#6B7280]">
                Toggle strategic material substitutions to achieve cost optimizations without sacrificing structural integrity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6B7280]">Applied Savings:</span>
            <span className="font-serif font-bold text-sm text-[#1E7348]">
              -₹{totalVeSavings.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {safeVeOptions.map(ve => (
            <div
              key={ve.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 transition text-xs gap-3 ${
                ve.isAccepted
                  ? 'border-[#B7DFC9] bg-[#F2F8F4]'
                  : 'border-[#EDE7DF] bg-[#FAF8F5] hover:border-[#D0C6B8]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#EFE9DF] px-1.5 py-0.2 text-[10px] font-bold text-[#4A4036]">
                    {ve.trade}
                  </span>
                  <span className="font-semibold text-[#1F2421]">
                    Replace: <span className="line-through text-[#857B6F]">{ve.originalSpec}</span>
                  </span>
                  <span className="text-[#1E7348] font-bold">➔ {ve.proposedAlternative}</span>
                </div>
                <div className="text-[#5D5549]">
                  <strong>Specification & Aesthetic Impact:</strong> {ve.clientQualityImpact}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <div className="text-right">
                  <div className="font-mono font-bold text-[#1E7348] text-xs">
                    -₹{ve.sellingReduction.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#7A7165]">Client Price Reduction</div>
                </div>

                <button
                  onClick={() => handleToggleVE(ve.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    ve.isAccepted
                      ? 'bg-[#1E7348] text-white hover:bg-[#175C3A]'
                      : 'border border-[#D5CCC0] bg-white text-[#1F2421] hover:bg-[#EDE8E1]'
                  }`}
                >
                  {ve.isAccepted ? 'Applied' : 'Apply Substitution'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
