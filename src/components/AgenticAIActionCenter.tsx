/**
 * Build Storys ERP - Central Agentic AI Copilot Action Center
 * Central workspace to review suggestions and approve actions across all 9 specialized AI assistants.
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare, 
  Calculator, 
  TrendingUp, 
  Layers, 
  ShoppingBag, 
  Clock, 
  Receipt, 
  BookOpen,
  Filter,
  CheckCircle2,
  Compass,
  Cpu
} from 'lucide-react';
import { AgenticAISuggestion, AIAssistantType, ProjectRecord } from '../types/erp';
import { AI_ASSISTANTS_CATALOG, INITIAL_AGENTIC_SUGGESTIONS } from '../data/agenticAISuggestions';
import { AIVastuLayoutSuggesterModal } from './AIVastuLayoutSuggesterModal';

interface AgenticAIActionCenterProps {
  project: ProjectRecord;
  onClose?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const AgenticAIActionCenter: React.FC<AgenticAIActionCenterProps> = ({
  project,
  onClose,
  onNavigateToTab
}) => {
  const [suggestions, setSuggestions] = useState<AgenticAISuggestion[]>(INITIAL_AGENTIC_SUGGESTIONS);
  const [selectedAssistant, setSelectedAssistant] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isVastuModalOpen, setIsVastuModalOpen] = useState(false);
  const [targetAreaInput, setTargetAreaInput] = useState<number>(project.requirement?.carpetAreaSqFt || project.carpetAreaSqFt || 2500);

  const getAssistantIcon = (type: AIAssistantType) => {
    switch (type) {
      case 'REQUIREMENTS': return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'BOQ': return <Calculator className="w-4 h-4 text-emerald-600" />;
      case 'BUDGET': return <TrendingUp className="w-4 h-4 text-amber-600" />;
      case 'DESIGN_REVIEW': return <Layers className="w-4 h-4 text-purple-600" />;
      case 'PROCUREMENT': return <ShoppingBag className="w-4 h-4 text-orange-600" />;
      case 'PROJECT_MONITORING': return <Clock className="w-4 h-4 text-indigo-600" />;
      case 'COST_CONTROL': return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'BILLING': return <Receipt className="w-4 h-4 text-teal-600" />;
      case 'KNOWLEDGE': return <BookOpen className="w-4 h-4 text-slate-600" />;
      default: return <Sparkles className="w-4 h-4 text-[#0078d4]" />;
    }
  };

  const decisionUrl = '/api/operations/'+project.id+'/ai_actions';
  useEffect(()=>{fetch(decisionUrl).then(async r=>{if(!r.ok)throw new Error('Could not load review decisions');return r.json();}).then(rows=>setSuggestions(INITIAL_AGENTIC_SUGGESTIONS.map(s=>{const d=rows.find((r:any)=>r.suggestionId===s.id);return d?{...s,status:d.decision}:s;}))).catch(e=>setActionNotice(e.message));},[decisionUrl]);
  const recordDecision = async(suggestion: AgenticAISuggestion, decision: 'APPROVED_APPLIED'|'REJECTED')=>{
    try {const r=await fetch(decisionUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:suggestion.title,suggestionId:suggestion.id,decision,recommendedAction:suggestion.recommendedAction,status:'Reviewed'})});const d=await r.json();if(!r.ok)throw new Error(d.error);setSuggestions(prev=>prev.map(s=>s.id===suggestion.id?{...s,status:decision}:s));setActionNotice(decision==='REJECTED'?'Dismissal saved.':'Approval saved for manual implementation in the relevant module.');}catch(e:any){setActionNotice(e.message || 'Could not save decision.');}
  };
  const handleApproveAction=(suggestion:AgenticAISuggestion)=>recordDecision(suggestion,'APPROVED_APPLIED');
  const handleDismissAction=(suggestion:AgenticAISuggestion)=>recordDecision(suggestion,'REJECTED');

  const filteredSuggestions = suggestions.filter(s => {
    const matchAssistant = selectedAssistant === 'ALL' || s.assistantType === selectedAssistant;
    const matchRisk = selectedRisk === 'ALL' || s.riskLevel === selectedRisk;
    return matchAssistant && matchRisk;
  });

  const pendingCount = suggestions.filter(s => s.status === 'PENDING_REVIEW').length;
  const approvedCount = suggestions.filter(s => s.status === 'APPROVED_APPLIED').length;

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-slate-800 rounded-md border border-slate-700">
                <Cpu className="w-4 h-4 text-slate-200" />
              </span>
              <h2 className="text-lg font-bold tracking-tight font-display">
                Operations &amp; Specification Intelligence
              </h2>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
                Automated Audit Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Continuous audit engine monitoring all project planning lines, rate shifts, material inward variances, and contract compliance.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 text-xs">
            <div className="text-center px-2">
              <div className="text-base font-bold text-amber-400 font-mono tabular-nums">{pendingCount}</div>
              <div className="text-[10px] text-slate-400">Pending Review</div>
            </div>
            <div className="w-px h-6 bg-slate-700" />
            <div className="text-center px-2">
              <div className="text-base font-bold text-emerald-400 font-mono tabular-nums">{approvedCount}</div>
              <div className="text-[10px] text-slate-400">Actions Approved</div>
            </div>
          </div>
        </div>

        {/* 2. Horizontal Assistant Selector Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5">
          <button
            onClick={() => setSelectedAssistant('ALL')}
            className={`px-2 py-1.5 rounded-md text-[11px] font-semibold text-center transition cursor-pointer ${
              selectedAssistant === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            All Disciplines
          </button>
          {AI_ASSISTANTS_CATALOG.map(asst => (
            <button
              key={asst.type}
              onClick={() => setSelectedAssistant(asst.type)}
              className={`px-2 py-1.5 rounded-md text-[11px] font-medium text-left truncate transition cursor-pointer ${
                selectedAssistant === asst.type
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title={asst.roleDescription}
            >
              {asst.title.replace(' Assistant', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-lg flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold">{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Vastu Spatial Layout Optimizer Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-950 font-display">
                Vastu Shastra Spatial Layout Optimizer
              </h3>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Parametric Layouts
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
              Calculates 3 compliant architectural spatial configurations with room zoning (Ishanya, Agni, Nairutya, Vayu), exact dimensions, and compliance scoring.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-28">
            <input
              type="number"
              value={targetAreaInput}
              onChange={e => setTargetAreaInput(Number(e.target.value) || 0)}
              className="w-full pl-2.5 pr-8 py-1.5 rounded-md bg-white border border-slate-200 text-slate-900 font-mono font-bold text-xs focus:border-slate-900 focus:outline-none"
              placeholder="Area sq.ft"
            />
            <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-medium">sq.ft</span>
          </div>

          <button
            type="button"
            onClick={() => setIsVastuModalOpen(true)}
            className="px-3.5 py-1.5 rounded-md bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-slate-300" />
            <span>Generate Layouts</span>
          </button>
        </div>
      </div>

      {/* 3. Filters Bar */}
      <div className="bg-white p-3 rounded border border-slate-200 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter By Urgency:</span>
          <select
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
          >
            <option value="ALL">All Urgencies</option>
            <option value="HIGH">High Urgency / Critical Risk</option>
            <option value="MEDIUM">Medium Urgency</option>
            <option value="LOW">Low Urgency / Savings</option>
          </select>
        </div>

        <div className="text-slate-500">
          Showing {filteredSuggestions.length} suggestions for Project: <strong>{project.projectCode}</strong>
        </div>
      </div>

      {/* 4. Suggestions Review Cards Grid */}
      <div className="space-y-3">
        {filteredSuggestions.map(s => {
          const isPending = s.status === 'PENDING_REVIEW';
          const isApproved = s.status === 'APPROVED_APPLIED';

          return (
            <div 
              key={s.id}
              className={`bg-white rounded border transition-all p-4 shadow-xs ${
                isApproved 
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : s.riskLevel === 'HIGH'
                  ? 'border-rose-200 hover:border-rose-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                {/* Left: Assistant Badge & Title */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {getAssistantIcon(s.assistantType)}
                      <span>{s.assistantName}</span>
                    </span>

                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium">
                      Target: {s.targetModule}
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      s.riskLevel === 'HIGH'
                        ? 'bg-rose-100 text-rose-800'
                        : s.riskLevel === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {s.riskLevel} Urgency
                    </span>

                    {isApproved && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        <Check className="w-3 h-3 text-emerald-700" />
                        Approved for implementation
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 pt-1">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {s.description}
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleDismissAction(s)}
                        className="px-2.5 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded text-xs font-medium transition-colors"
                      >
                        Dismiss
                      </button>

                      <button
                        onClick={() => handleApproveAction(s)}
                        className="flex items-center gap-1 px-3.5 py-1.5 bg-[#107c41] hover:bg-[#0b5c30] text-white rounded text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve recommendation</span>
                      </button>
                    </>
                  ) : (
                    <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Action Logged to ERP Ledger</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Reasoning & Action Proposal */}
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded">
                <div className="md:col-span-2 space-y-1">
                  <div className="font-semibold text-slate-700">Detailed AI Analysis & Root Cause:</div>
                  <div className="text-slate-600 leading-relaxed">{s.detailedAnalysis}</div>
                </div>

                <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 md:pl-3">
                  {s.financialImpact && (
                    <div>
                      <div className="font-semibold text-slate-700">Financial Impact:</div>
                      <div className="text-slate-800 font-mono font-medium">{s.financialImpact}</div>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-slate-700">Recommended Action:</div>
                    <div className="text-slate-900 font-medium">{s.recommendedAction}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Vastu Layout Suggester Modal */}
      {isVastuModalOpen && (
        <AIVastuLayoutSuggesterModal
          isOpen={isVastuModalOpen}
          onClose={() => setIsVastuModalOpen(false)}
          project={project}
          initialArea={targetAreaInput || 2500}
          initialPropertyType={project.projectType || 'RESIDENTIAL_VILLA'}
        />
      )}
    </div>
  );
};
