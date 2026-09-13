/**
 * Build Storys ERP - CRM Kanban Deals Board
 * Visual stage progression pipeline with deal values, probabilities,
 * quick stage advancement, and deal cards.
 */

import React from 'react';
import {
  CrmLeadExtended,
  CrmStageId,
  CRM_STAGES_CONFIG
} from '../../types/crm';
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Building,
  User,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Sparkles,
  PhoneCall,
  ChevronRight
} from 'lucide-react';

interface CrmKanbanBoardProps {
  leads: CrmLeadExtended[];
  selectedLeadId?: string;
  onSelectLead: (lead: CrmLeadExtended) => void;
  onMoveLeadStage: (leadId: string, newStage: CrmStageId) => void;
  onQuickAddDeal: (stage: CrmStageId) => void;
}

export const CrmKanbanBoard: React.FC<CrmKanbanBoardProps> = ({
  leads,
  selectedLeadId,
  onSelectLead,
  onMoveLeadStage,
  onQuickAddDeal
}) => {
  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} L`;
  };

  const getBantScore = (lead: CrmLeadExtended) => {
    const { budgetScore, authorityScore, needScore, timelineScore } = lead.bant;
    return budgetScore + authorityScore + needScore + timelineScore;
  };

  const getBantTierBadge = (score: number) => {
    if (score >= 85) return { label: 'A+ Hot', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= 70) return { label: 'B Warm', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    return { label: 'C Nurture', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  };

  return (
    <div className="overflow-x-auto pb-4 pt-1">
      <div className="flex items-start gap-3 min-w-[1360px]">
        {CRM_STAGES_CONFIG.map((stageConfig, stageIndex) => {
          const stageLeads = leads.filter((l) => l.stage === stageConfig.id);
          const stageTotalINR = stageLeads.reduce((sum, l) => sum + (l.dealValueINR || 0), 0);
          const stageWeightedINR = (stageTotalINR * stageConfig.probability) / 100;

          return (
            <div
              key={stageConfig.id}
              className="w-[280px] shrink-0 bg-slate-100/90 rounded-lg border border-slate-200/80 flex flex-col max-h-[calc(100vh-230px)] shadow-2xs"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-200 bg-white rounded-t-lg">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: stageConfig.color }}
                    />
                    <h3 className="text-xs font-bold text-slate-800 truncate" title={stageConfig.label}>
                      {stageConfig.shortLabel}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="font-bold text-slate-800 font-mono">
                    {formatINR(stageTotalINR)}
                  </span>
                  <span className="text-[10px] text-slate-500" title={`Weighted at ${stageConfig.probability}%`}>
                    Wt: <strong className="font-mono text-slate-700">{formatINR(stageWeightedINR)}</strong> ({stageConfig.probability}%)
                  </span>
                </div>
              </div>

              {/* Deals Container */}
              <div className="p-2 space-y-2 overflow-y-auto flex-1 scrollbar-thin">
                {stageLeads.length === 0 ? (
                  <div className="p-4 text-center rounded border border-dashed border-slate-300 text-slate-400 text-xs">
                    No active deals in {stageConfig.shortLabel}
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const isSelected = selectedLeadId === lead.id;
                    const bantScore = getBantScore(lead);
                    const tier = getBantTierBadge(bantScore);
                    const isOverdue =
                      new Date(lead.nextFollowUpDate).getTime() < new Date().setHours(0, 0, 0, 0) &&
                      lead.stage !== 'WON' &&
                      lead.stage !== 'LOST';

                    return (
                      <div
                        key={lead.id}
                        id={`crm-card-${lead.leadCode}`}
                        onClick={() => onSelectLead(lead)}
                        className={`p-3 bg-white rounded-md border transition cursor-pointer shadow-2xs hover:shadow-xs select-none ${
                          isSelected
                            ? 'border-[#0F6CBD] ring-2 ring-[#0F6CBD]/20 bg-blue-50/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Top: Client name & Deal value */}
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 truncate block hover:text-[#0F6CBD]">
                              {lead.clientName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {lead.leadCode} • {lead.city}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-900 font-mono shrink-0 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            {formatINR(lead.dealValueINR)}
                          </span>
                        </div>

                        {/* Location & Built-up area */}
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-1.5 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{lead.location}</span>
                        </div>

                        {/* Tags: Built-up, Project Type, BANT */}
                        <div className="flex items-center gap-1 flex-wrap mb-2">
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                            {lead.builtUpAreaSqFt.toLocaleString()} sq.ft
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                            {lead.projectType}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold border ${tier.color}`}>
                            {tier.label} ({bantScore})
                          </span>
                        </div>

                        {/* Next Action & Follow up Date */}
                        <div className={`p-1.5 rounded text-[10px] mb-2 flex items-start gap-1.5 ${
                          isOverdue ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-slate-50 text-slate-600 border border-slate-100'
                        }`}>
                          <Calendar className={`w-3 h-3 shrink-0 mt-0.5 ${isOverdue ? 'text-rose-600' : 'text-slate-400'}`} />
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold truncate">{lead.nextActionTitle}</div>
                            <div className="text-[9px] text-slate-500 flex items-center justify-between mt-0.5">
                              <span>Due: {lead.nextFollowUpDate}</span>
                              <span className="font-medium text-slate-700">{lead.assignedSalesLead.split(' ')[0]}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Move left / right buttons */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px]">
                          <button
                            type="button"
                            disabled={stageIndex === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (stageIndex > 0) {
                                onMoveLeadStage(lead.id, CRM_STAGES_CONFIG[stageIndex - 1].id);
                              }
                            }}
                            title="Move to previous stage"
                            className={`p-1 rounded hover:bg-slate-100 transition ${
                              stageIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-slate-900 cursor-pointer'
                            }`}
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectLead(lead);
                            }}
                            className="text-[#0F6CBD] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Open 360</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>

                          <button
                            type="button"
                            disabled={stageIndex === CRM_STAGES_CONFIG.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (stageIndex < CRM_STAGES_CONFIG.length - 1) {
                                onMoveLeadStage(lead.id, CRM_STAGES_CONFIG[stageIndex + 1].id);
                              }
                            }}
                            title="Advance to next stage"
                            className={`p-1 rounded hover:bg-slate-100 transition ${
                              stageIndex === CRM_STAGES_CONFIG.length - 1
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-600 hover:text-slate-900 cursor-pointer'
                            }`}
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Quick Add Deal in Stage */}
                <button
                  type="button"
                  onClick={() => onQuickAddDeal(stageConfig.id)}
                  className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-[#0F6CBD] hover:bg-slate-200/60 rounded border border-dashed border-slate-300 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Deal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
