/**
 * Build Storys ERP - CRM Deal 360 Workspace
 * Deep dive view for selected lead:
 * - Stage progression stepper
 * - BANT qualification scorecard with interactive sliders
 * - Turnkey cost & margin estimator
 * - Omnichannel communication logger (Call, WhatsApp, Email, Meeting)
 * - Stakeholder directory
 * - Direct handshake to ERP Project Hub & Site Survey
 */

import React, { useState } from 'react';
import {
  CrmLeadExtended,
  CrmStageId,
  CRM_STAGES_CONFIG,
  CrmCommunicationLog,
  CrmStakeholder
} from '../../types/crm';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Building,
  User,
  ShieldAlert,
  ArrowRight,
  Plus,
  Send,
  MessageSquare,
  DollarSign,
  Layers,
  FileCheck,
  CheckSquare,
  AlertTriangle,
  Sliders,
  Calculator,
  UserCheck,
  Users
} from 'lucide-react';

interface CrmDeal360ViewProps {
  lead: CrmLeadExtended;
  currentUser: { name: string; email: string };
  onUpdateLead: (updatedLead: CrmLeadExtended) => void;
  onConvertToProject: (lead: CrmLeadExtended) => void;
  onNavigateTab?: (tab: string) => void;
}

export const CrmDeal360View: React.FC<CrmDeal360ViewProps> = ({
  lead,
  currentUser,
  onUpdateLead,
  onConvertToProject,
  onNavigateTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bant' | 'scope_cost' | 'comms' | 'stakeholders' | 'site_visit'>('bant');

  // Quick Communication Logging Form State
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [logType, setLogType] = useState<'CALL' | 'WHATSAPP' | 'EMAIL' | 'MEETING' | 'NOTE'>('CALL');
  const [logSummary, setLogSummary] = useState('');
  const [logOutcome, setLogOutcome] = useState('Connected & Discussed');

  // New Stakeholder Form State
  const [showStakeholderModal, setShowStakeholderModal] = useState(false);
  const [newStakeholder, setNewStakeholder] = useState<CrmStakeholder>({
    name: '',
    role: 'Co-Owner / Spouse',
    phone: '',
    email: '',
    isDecisionMaker: true
  });

  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} Lakhs`;
  };

  const totalBantScore =
    lead.bant.budgetScore +
    lead.bant.authorityScore +
    lead.bant.needScore +
    lead.bant.timelineScore;

  const getBantTierBadge = (score: number) => {
    if (score >= 85) return { label: 'Tier A+ (Hot High Priority)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= 70) return { label: 'Tier B (Warm Opportunity)', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    return { label: 'Tier C (Nurture Pipeline)', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  };

  const tier = getBantTierBadge(totalBantScore);

  // Handle Stage Change
  const handleStageChange = (newStage: CrmStageId) => {
    const updated: CrmLeadExtended = {
      ...lead,
      stage: newStage,
      lastContactDate: new Date().toISOString().split('T')[0],
      communicationLog: [
        {
          id: `log-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'NOTE',
          summary: `Opportunity stage updated to ${CRM_STAGES_CONFIG.find(s => s.id === newStage)?.label}`,
          outcome: 'Stage advanced',
          agent: currentUser.name
        },
        ...lead.communicationLog
      ]
    };
    onUpdateLead(updated);
  };

  // Handle BANT Slider Updates
  const handleBantUpdate = (dimension: 'budgetScore' | 'authorityScore' | 'needScore' | 'timelineScore', val: number) => {
    const updated: CrmLeadExtended = {
      ...lead,
      bant: {
        ...lead.bant,
        [dimension]: val
      }
    };
    onUpdateLead(updated);
  };

  // Handle Communication Log Submission
  const handleAddCommunicationLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logSummary.trim()) return;

    const newLog: CrmCommunicationLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: logType,
      summary: logSummary.trim(),
      outcome: logOutcome,
      agent: currentUser.name
    };

    const updated: CrmLeadExtended = {
      ...lead,
      lastContactDate: new Date().toISOString().split('T')[0],
      communicationLog: [newLog, ...lead.communicationLog]
    };

    onUpdateLead(updated);
    setLogSummary('');
    setShowLogModal(false);
  };

  // Add Stakeholder
  const handleAddStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStakeholder.name.trim()) return;

    const updated: CrmLeadExtended = {
      ...lead,
      stakeholders: [...lead.stakeholders, newStakeholder]
    };
    onUpdateLead(updated);
    setNewStakeholder({
      name: '',
      role: 'Co-Owner / Spouse',
      phone: '',
      email: '',
      isDecisionMaker: true
    });
    setShowStakeholderModal(false);
  };

  // Finish Tier Recalculation
  const handleFinishTierChange = (tierName: 'Standard Turnkey' | 'Premium Luxury' | 'Ultra Bespoke') => {
    let rate = 2200;
    let margin = 21.0;
    if (tierName === 'Premium Luxury') {
      rate = 2950;
      margin = 23.5;
    } else if (tierName === 'Ultra Bespoke') {
      rate = 4150;
      margin = 26.0;
    }

    const calculatedDealVal = Math.round(lead.builtUpAreaSqFt * rate);

    const updated: CrmLeadExtended = {
      ...lead,
      targetFinishTier: tierName,
      estimatedTurnkeyRatePerSqFt: rate,
      expectedGrossMarginPct: margin,
      dealValueINR: calculatedDealVal,
      budgetMinINR: Math.round(calculatedDealVal * 0.9),
      budgetMaxINR: Math.round(calculatedDealVal * 1.1)
    };
    onUpdateLead(updated);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-2xs space-y-5 p-5">
      
      {/* 1. Header Profile & Stage Progression Stepper */}
      <div className="space-y-4 pb-4 border-b border-slate-200">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-900">{lead.clientName}</h2>
              <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded font-bold border border-slate-200">
                {lead.leadCode}
              </span>
              <span className="text-xs bg-blue-50 text-[#0F6CBD] font-medium px-2 py-0.5 rounded border border-blue-200">
                {lead.projectType}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-bold border ${tier.color}`}>
                BANT {totalBantScore}/100 • {tier.label.split(' ')[0]} {tier.label.split(' ')[1]}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{lead.companyName || 'Private Client'}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{lead.location}, {lead.city}</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <a href={`tel:${lead.phone}`} className="hover:underline text-slate-700">{lead.phone}</a>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a href={`mailto:${lead.email}`} className="hover:underline text-slate-700">{lead.email}</a>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-right">
              <div className="text-[11px] text-slate-500 font-medium">Deal Forecast Value</div>
              <div className="text-xl font-bold text-slate-900 font-mono">{formatINR(lead.dealValueINR)}</div>
              <div className="text-[10px] text-slate-400">Target Margin: {lead.expectedGrossMarginPct}%</div>
            </div>

            <button
              id="btn-deal360-convert-project"
              type="button"
              onClick={() => onConvertToProject(lead)}
              className="px-3.5 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Convert to Project & Survey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive 8-Stage Stepper Bar */}
        <div className="pt-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Sales Pipeline Stage Progression</span>
            <span className="text-slate-700 font-normal">
              Click any stage to fast-track opportunity status
            </span>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5">
            {CRM_STAGES_CONFIG.map((s, idx) => {
              const isCurrent = lead.stage === s.id;
              const currentStageIdx = CRM_STAGES_CONFIG.findIndex((st) => st.id === lead.stage);
              const isCompleted = idx < currentStageIdx;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStageChange(s.id)}
                  title={`${s.label}: ${s.description} (${s.probability}% probability)`}
                  className={`p-2 rounded text-left transition select-none border cursor-pointer ${
                    isCurrent
                      ? 'bg-[#002050] text-white border-[#002050] shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50/80 text-emerald-900 border-emerald-300 hover:bg-emerald-100/70'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold mb-0.5">
                    <span className="truncate">{s.shortLabel}</span>
                    <span className={isCurrent ? 'text-blue-200' : 'text-slate-400 font-mono'}>
                      {s.probability}%
                    </span>
                  </div>
                  <div className={`text-[9px] truncate ${isCurrent ? 'text-slate-200' : 'text-slate-500'}`}>
                    {idx + 1}. {s.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. Sub-Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveSubTab('bant')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'bant' ? 'bg-[#0F6CBD] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>BANT Qualification ({totalBantScore}/100)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('scope_cost')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'scope_cost' ? 'bg-[#0F6CBD] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Turnkey Estimator & Commercials</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('comms')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'comms' ? 'bg-[#0F6CBD] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Omnichannel Activity ({lead.communicationLog.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('stakeholders')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'stakeholders' ? 'bg-[#0F6CBD] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Stakeholders ({lead.stakeholders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('site_visit')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'site_visit' ? 'bg-[#0F6CBD] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Site Visit & AI Feasibility</span>
          </button>
        </div>

        {/* Quick Activity Button */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setLogType('CALL');
              setShowLogModal(true);
            }}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <Phone className="w-3 h-3 text-[#0F6CBD]" />
            <span>Log Call</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLogType('WHATSAPP');
              setShowLogModal(true);
            }}
            className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 transition cursor-pointer border border-emerald-200"
          >
            <MessageSquare className="w-3 h-3 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLogType('MEETING');
              setShowLogModal(true);
            }}
            className="px-2.5 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold flex items-center gap-1 transition cursor-pointer border border-purple-200"
          >
            <Calendar className="w-3 h-3 text-purple-600" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: BANT QUALIFICATION SCORECARD */}
      {activeSubTab === 'bant' && (
        <div className="space-y-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#0F6CBD]" />
                <span>BANT Qualification Matrix (Budget • Authority • Need • Timeline)</span>
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Standardized enterprise qualification protocol for high-value architectural & turnkey turnkey opportunities.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Health Score</div>
                <div className="text-2xl font-bold font-mono text-emerald-700">{totalBantScore}/100</div>
              </div>
              <div className={`px-3 py-1.5 rounded-lg border font-bold text-xs ${tier.color}`}>
                {tier.label}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Budget Score */}
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 text-xs">1. Budget Verification (Max 25 pts)</label>
                <span className="font-mono font-bold text-sm text-[#0F6CBD]">{lead.bant.budgetScore}/25</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="5"
                value={lead.bant.budgetScore}
                onChange={(e) => handleBantUpdate('budgetScore', Number(e.target.value))}
                className="w-full accent-[#0F6CBD] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0: Underfunded</span>
                <span>15: Stretch Target</span>
                <span>25: Fully Approved / Cheque Ready</span>
              </div>
              <p className="text-slate-600 bg-slate-50 p-2 rounded text-[11px] border border-slate-100">
                <strong>Current Note:</strong> {lead.bant.budgetNotes}
              </p>
            </div>

            {/* 2. Authority Score */}
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 text-xs">2. Decision Authority (Max 25 pts)</label>
                <span className="font-mono font-bold text-sm text-[#0F6CBD]">{lead.bant.authorityScore}/25</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="5"
                value={lead.bant.authorityScore}
                onChange={(e) => handleBantUpdate('authorityScore', Number(e.target.value))}
                className="w-full accent-[#0F6CBD] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0: Gatekeeper/Broker</span>
                <span>15: Joint Influencer</span>
                <span>25: Sole Signing Authority</span>
              </div>
              <p className="text-slate-600 bg-slate-50 p-2 rounded text-[11px] border border-slate-100">
                <strong>Current Note:</strong> {lead.bant.authorityNotes}
              </p>
            </div>

            {/* 3. Need Score */}
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 text-xs">3. Need & Scope Clarity (Max 25 pts)</label>
                <span className="font-mono font-bold text-sm text-[#0F6CBD]">{lead.bant.needScore}/25</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="5"
                value={lead.bant.needScore}
                onChange={(e) => handleBantUpdate('needScore', Number(e.target.value))}
                className="w-full accent-[#0F6CBD] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0: Vague Exploration</span>
                <span>15: Preliminary Concept</span>
                <span>25: Clear Architectural Brief</span>
              </div>
              <p className="text-slate-600 bg-slate-50 p-2 rounded text-[11px] border border-slate-100">
                <strong>Current Note:</strong> {lead.bant.needNotes}
              </p>
            </div>

            {/* 4. Timeline Score */}
            <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 text-xs">4. Timeline Urgency (Max 25 pts)</label>
                <span className="font-mono font-bold text-sm text-[#0F6CBD]">{lead.bant.timelineScore}/25</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="5"
                value={lead.bant.timelineScore}
                onChange={(e) => handleBantUpdate('timelineScore', Number(e.target.value))}
                className="w-full accent-[#0F6CBD] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0: Tentative &gt;6 months</span>
                <span>15: 3-5 months window</span>
                <span>25: Immediate Start (&lt;30 days)</span>
              </div>
              <p className="text-slate-600 bg-slate-50 p-2 rounded text-[11px] border border-slate-100">
                <strong>Current Note:</strong> {lead.bant.timelineNotes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TURNKEY ESTIMATOR & COMMERCIAL ECONOMICS */}
      {activeSubTab === 'scope_cost' && (
        <div className="space-y-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-[#0F6CBD]" />
              <span>Turnkey Cost Estimator & Deal Economics Calculator</span>
            </h3>
            <p className="text-slate-500 text-xs">
              Simulate preliminary project budget and contractor margin based on carpet/built-up area and interior specification tier.
            </p>
          </div>

          {/* Specification Tier Selection */}
          <div>
            <label className="block text-slate-700 font-bold mb-2">Select Target Finish Specification Tier:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { tier: 'Standard Turnkey', rate: '₹2,200/sq.ft', desc: 'Commercial laminates, vitrified tiles, standard modular kitchen, split ACs, emulsion painting.' },
                { tier: 'Premium Luxury', rate: '₹2,950/sq.ft', desc: 'Veneer/PU finish carpentry, imported Botticino marble, concealed VRF ducted AC, quartz counters.' },
                { tier: 'Ultra Bespoke', rate: '₹4,150/sq.ft', desc: 'Statuario Italian marble, custom boiserie panelling, Lutron IoT home automation, Dornbracht sanitaryware.' }
              ].map((t) => {
                const isSelected = lead.targetFinishTier === t.tier;
                return (
                  <button
                    key={t.tier}
                    type="button"
                    onClick={() => handleFinishTierChange(t.tier as any)}
                    className={`p-3 rounded-lg border text-left transition cursor-pointer select-none ${
                      isSelected
                        ? 'border-[#0F6CBD] bg-blue-50/50 shadow-xs ring-1 ring-[#0F6CBD]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-slate-900 font-bold">{t.tier}</strong>
                      <span className="text-xs font-mono font-bold text-[#0F6CBD]">{t.rate}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Area & Commercials Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Built-up Area</span>
              <strong className="text-slate-900 text-sm">{lead.builtUpAreaSqFt.toLocaleString()} sq.ft</strong>
              <span className="text-[10px] text-slate-500 block">Carpet: {lead.carpetAreaSqFt.toLocaleString()} sq.ft</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Calculated Turnkey Rate</span>
              <strong className="text-slate-900 text-sm font-mono">₹{lead.estimatedTurnkeyRatePerSqFt} / sq.ft</strong>
              <span className="text-[10px] text-slate-500 block">Civil + Finishes + MEP</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Total Deal Value</span>
              <strong className="text-[#0F6CBD] text-sm font-mono">{formatINR(lead.dealValueINR)}</strong>
              <span className="text-[10px] text-slate-500 block">Target Gross Margin: {lead.expectedGrossMarginPct}%</span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Estimated Gross Profit</span>
              <strong className="text-emerald-700 text-sm font-mono">
                {formatINR(Math.round(lead.dealValueINR * (lead.expectedGrossMarginPct / 100)))}
              </strong>
              <span className="text-[10px] text-slate-500 block">Post Direct Material & Labor</span>
            </div>
          </div>

          {/* Payment Tranches Milestones Simulation */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Standard Turnkey Commercial Tranche Schedule:</h4>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">1. Mobilization</div>
                <div className="font-bold text-slate-900">10% Advance</div>
                <div className="text-[10px] font-mono text-emerald-700">{formatINR(lead.dealValueINR * 0.1)}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">2. Demolition & Civil</div>
                <div className="font-bold text-slate-900">20% Milestone</div>
                <div className="text-[10px] font-mono text-slate-700">{formatINR(lead.dealValueINR * 0.2)}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">3. MEP & Framing</div>
                <div className="font-bold text-slate-900">25% Milestone</div>
                <div className="text-[10px] font-mono text-slate-700">{formatINR(lead.dealValueINR * 0.25)}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">4. Joinery & Stone</div>
                <div className="font-bold text-slate-900">25% Milestone</div>
                <div className="text-[10px] font-mono text-slate-700">{formatINR(lead.dealValueINR * 0.25)}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500">5. Testing & Finishes</div>
                <div className="font-bold text-slate-900">15% Milestone</div>
                <div className="text-[10px] font-mono text-slate-700">{formatINR(lead.dealValueINR * 0.15)}</div>
              </div>
              <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                <div className="text-[10px] text-emerald-700">6. DLP Retention</div>
                <div className="font-bold text-emerald-900">5% Handover</div>
                <div className="text-[10px] font-mono text-emerald-800">{formatINR(lead.dealValueINR * 0.05)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OMNICHANNEL ACTIVITY LOG */}
      {activeSubTab === 'comms' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#0F6CBD]" />
              <span>Unified Interaction History & Activity Feed ({lead.communicationLog.length})</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowLogModal(true)}
              className="px-3 py-1.5 rounded bg-[#0F6CBD] hover:bg-[#0d5ca0] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Interaction</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {lead.communicationLog.map((log) => (
              <div key={log.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex items-start gap-3">
                <div className={`p-2 rounded-full shrink-0 ${
                  log.type === 'CALL' ? 'bg-blue-100 text-blue-700' :
                  log.type === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-700' :
                  log.type === 'EMAIL' ? 'bg-indigo-100 text-indigo-700' :
                  log.type === 'MEETING' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {log.type === 'CALL' && <Phone className="w-4 h-4" />}
                  {log.type === 'WHATSAPP' && <MessageSquare className="w-4 h-4" />}
                  {log.type === 'EMAIL' && <Mail className="w-4 h-4" />}
                  {log.type === 'MEETING' && <Calendar className="w-4 h-4" />}
                  {log.type === 'NOTE' && <FileCheck className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{log.type}</span>
                      {log.outcome && (
                        <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                          {log.outcome}
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {log.date} at {log.time}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">{log.summary}</p>

                  <div className="mt-1.5 text-[10px] text-slate-500">
                    Recorded by <strong className="text-slate-700">{log.agent}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STAKEHOLDER DIRECTORY */}
      {activeSubTab === 'stakeholders' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0F6CBD]" />
                <span>Decision Makers & Project Stakeholders ({lead.stakeholders.length})</span>
              </h3>
              <p className="text-slate-500 text-xs">Multi-party stakeholder directory for the property owner, PMC, and consulting architect.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowStakeholderModal(true)}
              className="px-3 py-1.5 rounded bg-[#0F6CBD] hover:bg-[#0d5ca0] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stakeholder</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lead.stakeholders.map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-sm">{s.name}</strong>
                    {s.isDecisionMaker && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                        Decision Maker
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 block font-medium">{s.role}</span>
                  <div className="text-xs text-slate-600 flex items-center gap-3 pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <a href={`tel:${s.phone}`} className="hover:underline">{s.phone}</a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SITE VISIT & AI FEASIBILITY */}
      {activeSubTab === 'site_visit' && (
        <div className="space-y-4 text-xs">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-900 flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Engineering & Architectural Recommendations</span>
              </span>
              <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded font-mono font-bold">
                BuildStorys AI Engine
              </span>
            </div>
            <p className="text-slate-800 leading-relaxed">
              {lead.aiRecommendationSnippet}
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs">Site Visit & Laser Measurement Record</h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                lead.siteVisitStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                lead.siteVisitStatus === 'SCHEDULED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {lead.siteVisitStatus || 'PENDING'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Site Visit Date & Time</span>
                <strong className="text-slate-800">{lead.siteVisitDate ? `${lead.siteVisitDate} ${lead.siteVisitTime || ''}` : 'Not Scheduled'}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Visiting Engineer</span>
                <strong className="text-slate-800">{lead.visitingEngineer || 'Ar. Rajesh Sharma'}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Equipment Deployed</span>
                <strong className="text-slate-800">Laser Disto + Moisture Meter</strong>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 block text-[11px]">Visiting Engineer Site Notes:</span>
              <p className="text-slate-700">
                {lead.siteVisitNotes || 'No site visit notes recorded yet. Schedule site visit to record observations.'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <strong className="text-emerald-900 block font-bold">Pillar 2/3 Seamless Handshake:</strong>
              <p className="text-emerald-800 text-xs">
                Convert this lead to an active project in the ERP. Room measurements and site inspection observations will auto-populate the Site Survey workspace.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onConvertToProject(lead)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Convert to Project & Survey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* QUICK LOG MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-md w-full p-5 space-y-4 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Log Customer Interaction</h3>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCommunicationLog} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Interaction Channel</label>
                <select
                  value={logType}
                  onChange={(e) => setLogType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-xs focus:ring-1 focus:ring-[#0F6CBD]"
                >
                  <option value="CALL">Phone Call</option>
                  <option value="WHATSAPP">WhatsApp Message</option>
                  <option value="EMAIL">Email</option>
                  <option value="MEETING">In-Person Meeting / Site Visit</option>
                  <option value="NOTE">Internal Team Note</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Call / Meeting Outcome</label>
                <input
                  type="text"
                  value={logOutcome}
                  onChange={(e) => setLogOutcome(e.target.value)}
                  placeholder="e.g. Discussed budget, sent moodboards, scheduled survey"
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#0F6CBD]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Summary / Notes *</label>
                <textarea
                  required
                  rows={3}
                  value={logSummary}
                  onChange={(e) => setLogSummary(e.target.value)}
                  placeholder="Enter detailed points discussed with client..."
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#0F6CBD]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#0F6CBD] hover:bg-[#0d5ca0] text-white font-bold cursor-pointer"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STAKEHOLDER MODAL */}
      {showStakeholderModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-md w-full p-5 space-y-4 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Add Project Stakeholder</h3>
              <button
                type="button"
                onClick={() => setShowStakeholderModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStakeholder} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Singhania"
                  value={newStakeholder.name}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Role / Relationship</label>
                <select
                  value={newStakeholder.role}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, role: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                >
                  <option value="Primary Owner">Primary Owner</option>
                  <option value="Co-Owner / Spouse">Co-Owner / Spouse</option>
                  <option value="Architect Consultant">Architect Consultant</option>
                  <option value="PMC / Builder">PMC / Builder</option>
                  <option value="Facility Manager">Facility Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98XXX XXXXX"
                  value={newStakeholder.phone}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, phone: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="stakeholder@example.com"
                  value={newStakeholder.email}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, email: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-decision-maker"
                  checked={newStakeholder.isDecisionMaker}
                  onChange={(e) => setNewStakeholder({ ...newStakeholder, isDecisionMaker: e.target.checked })}
                  className="rounded text-[#0F6CBD] focus:ring-0"
                />
                <label htmlFor="chk-decision-maker" className="text-slate-700 cursor-pointer font-medium">
                  Has commercial / sign-off decision authority
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowStakeholderModal(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#0F6CBD] hover:bg-[#0d5ca0] text-white font-bold cursor-pointer"
                >
                  Save Stakeholder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
