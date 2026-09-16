/**
 * Build Storys ERP - CRM & Lead Management (Stage 1)
 * Expert CRM Suite for Architecture & Turnkey Interior Contractors:
 * - Visual Kanban Deal Pipeline (8 stages with win probability & weighted revenue)
 * - Comprehensive Deal 360 Workspace (BANT Qualification Matrix, Turnkey Estimator, Omnichannel Comms)
 * - Advanced Deals List / Table with multi-column filtering & CSV Export
 * - Executive Sales Analytics & Funnel Dashboard
 * - Direct Handshake to Project Hub & Site Survey (Pillar 2/3)
 */

import React, { useState } from 'react';
import {
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Plus,
  MessageSquare,
  Building,
  DollarSign,
  Layers,
  ChevronRight,
  Share2,
  FileCheck,
  Send,
  UserCheck,
  Kanban,
  Table,
  BarChart3,
  Download,
  SlidersHorizontal,
  RefreshCw,
  Users
} from 'lucide-react';
import { ProjectRecord, UserSession } from '../types/erp';
import {
  CrmLeadExtended,
  CrmStageId,
  CRM_STAGES_CONFIG
} from '../types/crm';
import { SEED_CRM_LEADS } from '../data/crmSeedData';
import { CrmKanbanBoard } from './crm/CrmKanbanBoard';
import { CrmDeal360View } from './crm/CrmDeal360View';
import { CrmAnalyticsView } from './crm/CrmAnalyticsView';

interface CRMAndLeadViewProps {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
  onUpdateRequirement?: (req: any) => void;
}

export const CRMAndLeadView: React.FC<CRMAndLeadViewProps> = ({
  project,
  currentUser,
  onNavigateTab,
  onUpdateRequirement
}) => {
  const [leads, setLeads] = useState<CrmLeadExtended[]>(SEED_CRM_LEADS);
  const [selectedLead, setSelectedLead] = useState<CrmLeadExtended>(SEED_CRM_LEADS[0]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'deal_360' | 'analytics'>('kanban');
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [targetModalStage, setTargetModalStage] = useState<CrmStageId>('NEW_ENQUIRY');

  // New Lead Form State
  const [newLead, setNewLead] = useState<Partial<CrmLeadExtended>>({
    clientName: '',
    companyName: '',
    phone: '',
    email: '',
    source: 'WEBSITE',
    projectType: 'RESIDENTIAL',
    location: '',
    city: 'Mumbai',
    builtUpAreaSqFt: 2800,
    carpetAreaSqFt: 2200,
    dealValueINR: 7500000,
    targetFinishTier: 'Premium Luxury',
    targetTimelineMonths: 4,
    interiorStyle: 'Modern Contemporary Turnkey',
    stage: 'NEW_ENQUIRY'
  });

  // Calculate Pipeline Metrics
  const totalPipelineINR = leads.reduce((acc, l) => acc + (l.dealValueINR || 0), 0);
  const weightedPipelineINR = leads.reduce((acc, l) => {
    const stage = CRM_STAGES_CONFIG.find((s) => s.id === l.stage);
    return acc + (l.dealValueINR * (stage ? stage.probability : 0)) / 100;
  }, 0);
  const wonDealsCount = leads.filter((l) => l.stage === 'WON').length;
  const activeOpportunities = leads.filter((l) => l.stage !== 'WON' && l.stage !== 'LOST');

  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(1)} L`;
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.leadCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.companyName && l.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStage = stageFilter === 'ALL' || l.stage === stageFilter;
    const matchesSource = sourceFilter === 'ALL' || l.source === sourceFilter;
    return matchesSearch && matchesStage && matchesSource;
  });

  // Handle Stage Movement
  const handleMoveLeadStage = (leadId: string, newStage: CrmStageId) => {
    const stageConfig = CRM_STAGES_CONFIG.find((s) => s.id === newStage);
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const updated: CrmLeadExtended = {
            ...l,
            stage: newStage,
            lastContactDate: new Date().toISOString().split('T')[0],
            communicationLog: [
              {
                id: `log-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'NOTE',
                summary: `Stage updated to ${stageConfig?.label || newStage}`,
                outcome: 'Pipeline stage advanced',
                agent: currentUser.name
              },
              ...l.communicationLog
            ]
          };
          if (selectedLead.id === leadId) {
            setSelectedLead(updated);
          }
          return updated;
        }
        return l;
      })
    );
  };

  // Handle Update Lead
  const handleUpdateLead = (updatedLead: CrmLeadExtended) => {
    setLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
    setSelectedLead(updatedLead);
  };

  // Handle Handshake: Convert Lead to ERP Project & Survey
  const handleConvertLeadToProject = (leadToConvert: CrmLeadExtended) => {
    if (onUpdateRequirement) {
      onUpdateRequirement({
        customerName: leadToConvert.clientName,
        customerPhone: leadToConvert.phone,
        customerEmail: leadToConvert.email,
        projectSiteAddress: `${leadToConvert.location}, ${leadToConvert.city}`,
        projectType: leadToConvert.projectType,
        plotAreaSqFt: leadToConvert.plotAreaSqFt,
        builtUpAreaSqFt: leadToConvert.builtUpAreaSqFt,
        carpetAreaSqFt: leadToConvert.carpetAreaSqFt,
        floorsCount: leadToConvert.floorsCount,
        customerBudgetMin: leadToConvert.budgetMinINR,
        customerBudgetMax: leadToConvert.budgetMaxINR,
        preferredDesignStyle: leadToConvert.interiorStyle,
        surveyNotes: leadToConvert.siteVisitNotes || `Handover from CRM Opportunity ${leadToConvert.leadCode}`
      });
    }

    // Automatically mark lead as WON if not already
    if (leadToConvert.stage !== 'WON') {
      handleMoveLeadStage(leadToConvert.id, 'WON');
    }

    // Navigate to step 2/3 (Survey)
    if (onNavigateTab) {
      onNavigateTab('survey');
    }
  };

  // Handle Inbound Lead Creation
  const handleAddNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.clientName || !newLead.phone) return;

    const builtUp = Number(newLead.builtUpAreaSqFt) || 2500;
    const dealVal = Number(newLead.dealValueINR) || 7500000;

    const created: CrmLeadExtended = {
      id: `LEAD-${Date.now()}`,
      leadCode: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: newLead.clientName || 'Inbound Prospect',
      companyName: newLead.companyName || '',
      phone: newLead.phone || '',
      email: newLead.email || '',
      source: newLead.source || 'WEBSITE',
      projectType: newLead.projectType || 'RESIDENTIAL',
      location: newLead.location || 'Mumbai',
      city: newLead.city || 'Mumbai',
      plotAreaSqFt: 0,
      builtUpAreaSqFt: builtUp,
      carpetAreaSqFt: Math.round(builtUp * 0.78),
      budgetMinINR: Math.round(dealVal * 0.9),
      budgetMaxINR: Math.round(dealVal * 1.1),
      dealValueINR: dealVal,
      targetFinishTier: newLead.targetFinishTier || 'Premium Luxury',
      floorsCount: 1,
      targetTimelineMonths: Number(newLead.targetTimelineMonths) || 4,
      interiorStyle: newLead.interiorStyle || 'Contemporary Minimalist',
      stage: targetModalStage,
      assignedSalesLead: currentUser.name,
      nextFollowUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      nextFollowUpTime: '11:00 AM',
      nextActionTitle: 'Conduct Intake Discovery & Scope Briefing',
      lastContactDate: new Date().toISOString().split('T')[0],
      siteVisitStatus: 'PENDING',
      estimatedTurnkeyRatePerSqFt: Math.round(dealVal / builtUp),
      expectedGrossMarginPct: 23.0,
      bant: {
        budgetScore: 20,
        authorityScore: 20,
        needScore: 20,
        timelineScore: 15,
        budgetNotes: 'Inbound prospect stated budget verified on initial call.',
        authorityNotes: 'Primary owner decision maker.',
        needNotes: 'Turnkey architectural interior fitout requested.',
        timelineNotes: 'Target possession within 4 months.'
      },
      stakeholders: [
        {
          name: newLead.clientName,
          role: 'Primary Owner',
          phone: newLead.phone,
          email: newLead.email || '',
          isDecisionMaker: true
        }
      ],
      communicationLog: [
        {
          id: `log-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'NOTE',
          summary: 'Inbound lead captured and assigned to relationship manager.',
          outcome: 'Lead created',
          agent: currentUser.name
        }
      ],
      aiRecommendationSnippet: `AI preliminary estimate for ${builtUp} sq.ft ${newLead.projectType}: Recommended target budget ₹${(dealVal / 100000).toFixed(0)} Lakhs based on standard turnkey finish rates.`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setLeads([created, ...leads]);
    setSelectedLead(created);
    setShowNewLeadModal(false);
    setViewMode('deal_360');
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Lead Code', 'Client Name', 'Company', 'Phone', 'Email', 'Location', 'City', 'Project Type', 'Stage', 'Deal Value INR', 'Built-up SqFt', 'Assigned Rep', 'Next Follow Up'];
    const rows = leads.map((l) => [
      l.leadCode,
      `"${l.clientName}"`,
      `"${l.companyName || ''}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.location}"`,
      l.city,
      l.projectType,
      l.stage,
      l.dealValueINR,
      l.builtUpAreaSqFt,
      `"${l.assignedSalesLead}"`,
      l.nextFollowUpDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BuildStorys_CRM_Deals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-slate-800 p-3 md:p-5 space-y-4">
      
      {/* 1. Header Toolbar with KPI Badges & View Switcher */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-3.5 space-y-3">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#002050] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <UserPlus className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  Stage 1: Enterprise CRM & Opportunity Pipeline
                </h1>
                <span className="text-[10px] bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded border border-slate-200">
                  8 Stages • BANT • Turnkey Economics
                </span>
              </div>
              <p className="text-xs text-slate-500">
                End-to-End Inbound Capture → Qualification Scorecard → Site Laser Survey → Direct ERP Handshake
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            
            <button
              id="btn-crm-export-csv"
              type="button"
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-2xs"
              title="Export all deals to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              id="btn-crm-quick-add"
              type="button"
              onClick={() => {
                setTargetModalStage('NEW_ENQUIRY');
                setShowNewLeadModal(true);
              }}
              className="px-3 py-1.5 rounded bg-[#002050] hover:bg-[#003070] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-blue-300" />
              <span>Capture New Deal</span>
            </button>

            {onNavigateTab && (
              <button
                id="btn-crm-arch-cockpit"
                type="button"
                onClick={() => onNavigateTab('arch_pipeline')}
                className="px-3 py-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                title="Open Dedicated Architectural Deal Cockpit & Stage-Gate Radar"
              >
                <Users className="w-3.5 h-3.5 text-amber-700" />
                <span>Architectural Deal Cockpit</span>
              </button>
            )}

            <button
              id="btn-crm-convert-handshake"
              type="button"
              onClick={() => handleConvertLeadToProject(selectedLead)}
              className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Convert selected lead to active project & Site Survey"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Convert to Project & Survey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Real-time Pipeline Metrics Strip & View Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          
          {/* Executive Metrics Counters */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">Total Pipeline:</span>
              <strong className="font-mono text-slate-900">{formatINR(totalPipelineINR)}</strong>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-50/80 px-2.5 py-1 rounded border border-emerald-200 text-emerald-900">
              <span className="text-emerald-700 font-medium">Weighted Forecast:</span>
              <strong className="font-mono text-emerald-800">{formatINR(weightedPipelineINR)}</strong>
            </div>

            <div className="flex items-center gap-1.5 bg-blue-50/80 px-2.5 py-1 rounded border border-blue-200 text-blue-900">
              <span className="text-blue-700 font-medium">Active Deals:</span>
              <strong className="font-mono text-blue-800">{activeOpportunities.length}</strong>
            </div>

            <div className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded border border-green-200 text-green-900">
              <span className="text-green-700 font-medium">Won Contracts:</span>
              <strong className="font-mono text-green-800">{wonDealsCount}</strong>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              type="button"
              id="tab-view-kanban"
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-[#002050] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban Deals Board</span>
            </button>

            <button
              type="button"
              id="tab-view-list"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-[#002050] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Deals Grid</span>
            </button>

            <button
              type="button"
              id="tab-view-deal360"
              onClick={() => setViewMode('deal_360')}
              className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'deal_360' ? 'bg-white text-[#002050] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Deal 360 Workspace</span>
            </button>

            <button
              type="button"
              id="tab-view-analytics"
              onClick={() => setViewMode('analytics')}
              className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'analytics' ? 'bg-white text-[#002050] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
              <span>Sales Analytics</span>
            </button>
          </div>

        </div>

      </div>

      {/* 2. Search & Stage Filtering Bar (When in Kanban or List view) */}
      {(viewMode === 'kanban' || viewMode === 'list') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search deals by client, company, location, or lead code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#002050]"
              />
            </div>

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">Stage:</span>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-700"
              >
                <option value="ALL">All 8 Stages</option>
                {CRM_STAGES_CONFIG.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} ({s.probability}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">Source:</span>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-700"
              >
                <option value="ALL">All Inbound Sources</option>
                <option value="ARCHITECT_REFERRAL">Architect Referral</option>
                <option value="WEBSITE">Website Lead Form</option>
                <option value="WHATSAPP">WhatsApp Direct</option>
                <option value="PORTAL">Housing / 99acres Portal</option>
                <option value="PHONE_CALL">Inbound Phone Call</option>
                <option value="WALK_IN">Experience Center</option>
              </select>
            </div>

            <span className="text-slate-400 font-mono text-[11px]">
              Showing {filteredLeads.length} of {leads.length}
            </span>
          </div>

        </div>
      )}

      {/* 3. MAIN WORKSPACE VIEW ROUTING */}

      {/* VIEW 1: KANBAN DEAL PIPELINE */}
      {viewMode === 'kanban' && (
        <CrmKanbanBoard
          leads={filteredLeads}
          selectedLeadId={selectedLead.id}
          onSelectLead={(lead) => {
            setSelectedLead(lead);
            setViewMode('deal_360');
          }}
          onMoveLeadStage={handleMoveLeadStage}
          onQuickAddDeal={(stage) => {
            setTargetModalStage(stage);
            setShowNewLeadModal(true);
          }}
        />
      )}

      {/* VIEW 2: DETAILED DEALS GRID / LIST TABLE */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="p-3">Deal / Code</th>
                  <th className="p-3">Client & Company</th>
                  <th className="p-3">Location & Type</th>
                  <th className="p-3">Stage & Progress</th>
                  <th className="p-3 text-right">Deal Value (₹)</th>
                  <th className="p-3 text-center">BANT Score</th>
                  <th className="p-3">Assigned Rep</th>
                  <th className="p-3">Next Action / Due</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLeads.map((ld) => {
                  const stageMeta = CRM_STAGES_CONFIG.find((s) => s.id === ld.stage) || CRM_STAGES_CONFIG[0];
                  const totalBant = ld.bant.budgetScore + ld.bant.authorityScore + ld.bant.needScore + ld.bant.timelineScore;
                  const isSelected = ld.id === selectedLead.id;

                  return (
                    <tr
                      key={ld.id}
                      onClick={() => {
                        setSelectedLead(ld);
                        setViewMode('deal_360');
                      }}
                      className={`hover:bg-blue-50/40 cursor-pointer transition ${
                        isSelected ? 'bg-blue-50/60 font-medium' : ''
                      }`}
                    >
                      <td className="p-3 font-mono">
                        <span className="font-bold text-slate-900 block">{ld.leadCode}</span>
                        <span className="text-[10px] text-slate-400">{ld.createdAt}</span>
                      </td>

                      <td className="p-3">
                        <strong className="text-slate-900 block hover:text-[#0F6CBD]">{ld.clientName}</strong>
                        <span className="text-[11px] text-slate-500">{ld.companyName || ld.source}</span>
                      </td>

                      <td className="p-3">
                        <span className="text-slate-700 block truncate max-w-[180px]">{ld.location}</span>
                        <span className="text-[10px] text-slate-400">
                          {ld.city} • {ld.builtUpAreaSqFt.toLocaleString()} sq.ft
                        </span>
                      </td>

                      <td className="p-3">
                        <select
                          value={ld.stage}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleMoveLeadStage(ld.id, e.target.value as CrmStageId)}
                          className={`text-[11px] font-bold px-2 py-1 rounded border cursor-pointer ${stageMeta.badgeBg} ${stageMeta.textColor} ${stageMeta.borderColor}`}
                        >
                          {CRM_STAGES_CONFIG.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label} ({s.probability}%)
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {formatINR(ld.dealValueINR)}
                      </td>

                      <td className="p-3 text-center">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                          totalBant >= 85 ? 'bg-emerald-100 text-emerald-800' :
                          totalBant >= 70 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {totalBant}/100
                        </span>
                      </td>

                      <td className="p-3 text-slate-700">
                        {ld.assignedSalesLead}
                      </td>

                      <td className="p-3">
                        <div className="truncate max-w-[160px] font-medium text-slate-800">{ld.nextActionTitle}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{ld.nextFollowUpDate}</span>
                        </div>
                      </td>

                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLead(ld);
                            setViewMode('deal_360');
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#002050] hover:text-white text-slate-700 text-xs font-semibold transition cursor-pointer"
                        >
                          360 View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: DEAL 360 WORKSPACE */}
      {viewMode === 'deal_360' && selectedLead && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left mini deal selector (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 shadow-2xs p-3 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase">Opportunities ({leads.length})</span>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className="text-xs text-[#0F6CBD] hover:underline font-semibold"
              >
                Back to Board
              </button>
            </div>

            <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
              {leads.map((l) => {
                const isCurrent = l.id === selectedLead.id;
                const stage = CRM_STAGES_CONFIG.find((s) => s.id === l.stage);
                return (
                  <div
                    key={l.id}
                    onClick={() => setSelectedLead(l)}
                    className={`p-2.5 rounded-md border cursor-pointer transition select-none ${
                      isCurrent
                        ? 'bg-blue-50/70 border-[#002050] shadow-xs ring-1 ring-[#002050]/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <strong className="text-xs text-slate-900 truncate block">{l.clientName}</strong>
                      <span className="text-xs font-bold font-mono text-slate-800">{formatINR(l.dealValueINR)}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{l.location}</div>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className={`px-1.5 py-0.2 rounded font-semibold ${stage?.badgeBg} ${stage?.textColor}`}>
                        {stage?.shortLabel}
                      </span>
                      <span className="text-slate-400 font-mono">{l.leadCode}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right deal 360 detailed workspace (9 cols) */}
          <div className="lg:col-span-9">
            <CrmDeal360View
              lead={selectedLead}
              currentUser={currentUser}
              onUpdateLead={handleUpdateLead}
              onConvertToProject={handleConvertLeadToProject}
              onNavigateTab={onNavigateTab}
            />
          </div>

        </div>
      )}

      {/* VIEW 4: SALES ANALYTICS & PIPELINE PERFORMANCE */}
      {viewMode === 'analytics' && <CrmAnalyticsView leads={leads} />}

      {/* NEW OPPORTUNITY INTAKE MODAL */}
      {showNewLeadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-xl w-full p-5 space-y-4 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Capture Inbound Turnkey Opportunity</h3>
                <p className="text-slate-500 text-[11px]">Enters into Stage 1 with automatic BANT qualification tracking</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewLeadModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewLead} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Customer / Client Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh & Sangeeta Iyer"
                    value={newLead.clientName}
                    onChange={(e) => setNewLead({ ...newLead, clientName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#002050] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Company / Entity Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Iyer Holdings / Private Residence"
                    value={newLead.companyName}
                    onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#002050] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#002050] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="client@domain.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#002050] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Inbound Source Channel</label>
                  <select
                    value={newLead.source}
                    onChange={(e: any) => setNewLead({ ...newLead, source: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  >
                    <option value="WEBSITE">Website Lead Form</option>
                    <option value="WHATSAPP">WhatsApp Direct Inquiry</option>
                    <option value="PHONE_CALL">Inbound Phone Call</option>
                    <option value="ARCHITECT_REFERRAL">Architect Referral Partner</option>
                    <option value="PORTAL">Housing / 99acres Portal</option>
                    <option value="WALK_IN">Experience Center Walk-in</option>
                    <option value="REPEAT_CLIENT">Repeat Client / Word of Mouth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Project Type</label>
                  <select
                    value={newLead.projectType}
                    onChange={(e: any) => setNewLead({ ...newLead, projectType: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  >
                    <option value="RESIDENTIAL">Residential (Apartment / Villa)</option>
                    <option value="COMMERCIAL">Commercial Fitout</option>
                    <option value="OFFICE">Corporate Office</option>
                    <option value="RETAIL">Retail Showroom</option>
                    <option value="HOSPITALITY">Boutique Cafe / Restaurant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Built-Up Area (sq.ft)</label>
                  <input
                    type="number"
                    value={newLead.builtUpAreaSqFt}
                    onChange={(e) => {
                      const sqft = Number(e.target.value);
                      const rate = newLead.targetFinishTier === 'Ultra Bespoke' ? 4150 : newLead.targetFinishTier === 'Premium Luxury' ? 2950 : 2200;
                      setNewLead({
                        ...newLead,
                        builtUpAreaSqFt: sqft,
                        dealValueINR: Math.round(sqft * rate)
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Specification Tier</label>
                  <select
                    value={newLead.targetFinishTier}
                    onChange={(e: any) => {
                      const tier = e.target.value;
                      const rate = tier === 'Ultra Bespoke' ? 4150 : tier === 'Premium Luxury' ? 2950 : 2200;
                      setNewLead({
                        ...newLead,
                        targetFinishTier: tier,
                        dealValueINR: Math.round((newLead.builtUpAreaSqFt || 2500) * rate)
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  >
                    <option value="Standard Turnkey">Standard Turnkey (~₹2,200/sq.ft)</option>
                    <option value="Premium Luxury">Premium Luxury (~₹2,950/sq.ft)</option>
                    <option value="Ultra Bespoke">Ultra Bespoke (~₹4,150/sq.ft)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estimated Deal Value (₹)</label>
                  <input
                    type="number"
                    value={newLead.dealValueINR}
                    onChange={(e) => setNewLead({ ...newLead, dealValueINR: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Timeline (Months)</label>
                  <input
                    type="number"
                    value={newLead.targetTimelineMonths}
                    onChange={(e) => setNewLead({ ...newLead, targetTimelineMonths: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Site Address & Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Oberoi Sky Heights, Flat 1802, Andheri West, Mumbai"
                    value={newLead.location}
                    onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Design Style & Customer Brief</label>
                  <input
                    type="text"
                    placeholder="e.g. Modern Minimalist with Italian Botticino marble and ducted AC"
                    value={newLead.interiorStyle}
                    onChange={(e) => setNewLead({ ...newLead, interiorStyle: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#002050] hover:bg-[#003070] text-white font-bold cursor-pointer shadow-xs"
                >
                  Save & Open Deal 360
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
