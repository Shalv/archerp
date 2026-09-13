/**
 * Build Storys ERP - CRM and Lead Management (Pillar 1)
 * Full lifecycle lead capture, qualification pipeline, customer requirements recording,
 * site visit scheduling, stakeholder directory, follow-up timeline, and AI project options.
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
  UserCheck
} from 'lucide-react';
import { ProjectRecord, UserSession } from '../types/erp';

interface CRMAndLeadViewProps {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
  onUpdateRequirement?: (req: any) => void;
}

interface LeadRecord {
  id: string;
  leadCode: string;
  clientName: string;
  phone: string;
  email: string;
  source: 'WEBSITE' | 'WHATSAPP' | 'PHONE_CALL' | 'ARCHITECT_REFERRAL' | 'PORTAL' | 'WALK_IN';
  projectType: 'RESIDENTIAL' | 'COMMERCIAL' | 'OFFICE' | 'RETAIL' | 'HOSPITALITY';
  location: string;
  plotAreaSqFt: number;
  builtUpAreaSqFt: number;
  carpetAreaSqFt: number;
  budgetMinINR: number;
  budgetMaxINR: number;
  floorsCount: number;
  targetTimelineMonths: number;
  interiorStyle: string;
  architectPartner?: string;
  consultantOrBroker?: string;
  stage: 'NEW_ENQUIRY' | 'QUALIFIED' | 'SITE_VISIT_SCHEDULED' | 'DESIGN_PITCH' | 'ESTIMATION' | 'WON' | 'LOST';
  qualificationScore: number; // 1 to 100
  assignedSalesLead: string;
  nextFollowUpDate: string;
  lastContactDate: string;
  siteVisitDate?: string;
  siteVisitStatus?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  siteVisitNotes?: string;
  communicationLog: {
    date: string;
    type: 'CALL' | 'WHATSAPP' | 'EMAIL' | 'MEETING';
    summary: string;
    agent: string;
  }[];
  aiRecommendationSnippet: string;
}

const INITIAL_LEADS: LeadRecord[] = [
  {
    id: 'LEAD-2026-001',
    leadCode: 'LD-1402',
    clientName: 'Vikramaditya Singhania',
    phone: '+91 98201 44521',
    email: 'vikram.singhania@apexholding.in',
    source: 'ARCHITECT_REFERRAL',
    projectType: 'RESIDENTIAL',
    location: 'Skyline Towers, Flat 1402, Worli Seaface, Mumbai',
    plotAreaSqFt: 0,
    builtUpAreaSqFt: 3650,
    carpetAreaSqFt: 2850,
    budgetMinINR: 8500000,
    budgetMaxINR: 11000000,
    floorsCount: 1,
    targetTimelineMonths: 5,
    interiorStyle: 'Modern Italian Minimalist with Biophilic Balcony & Smart Automation',
    architectPartner: 'Ar. Sanjay Puri Architects',
    consultantOrBroker: 'Knight Frank Luxury Residential',
    stage: 'WON',
    qualificationScore: 95,
    assignedSalesLead: 'Rahul Deshmukh (Sr. Relationship Manager)',
    nextFollowUpDate: '2026-03-20',
    lastContactDate: '2026-03-12',
    siteVisitDate: '2026-02-14',
    siteVisitStatus: 'COMPLETED',
    siteVisitNotes: 'Laser measurements verified. Non-load bearing wall between dining & study can be demolished.',
    communicationLog: [
      { date: '2026-02-10', type: 'CALL', summary: 'Initial intake via Ar. Sanjay referral. Client requested turnkey luxury fitout.', agent: 'Rahul D.' },
      { date: '2026-02-14', type: 'MEETING', summary: 'Physical site visit conducted with laser disto and moisture meter.', agent: 'Ar. Rajesh S.' },
      { date: '2026-02-28', type: 'WHATSAPP', summary: 'Sent preliminary 4 AI design options with preliminary budget brackets.', agent: 'Rahul D.' },
      { date: '2026-03-05', type: 'MEETING', summary: 'Presented BOQ Rev 1 and quotation. Client approved scope with 10% advance.', agent: 'Rahul D.' }
    ],
    aiRecommendationSnippet: 'Recommend Option 1: Italian Botticino marble, concealed VRF ducted AC, and acoustic double-glazed balcony partitions.'
  },
  {
    id: 'LEAD-2026-002',
    leadCode: 'LD-1405',
    clientName: 'Dr. Ananya Roy & Dr. Debanjan Roy',
    phone: '+91 98450 11234',
    email: 'ananya.roy@kemhospital.org',
    source: 'WEBSITE',
    projectType: 'RESIDENTIAL',
    location: 'Parijat Bungalow, Baner Road, Pune',
    plotAreaSqFt: 4500,
    builtUpAreaSqFt: 5200,
    carpetAreaSqFt: 4100,
    budgetMinINR: 14000000,
    budgetMaxINR: 17500000,
    floorsCount: 3,
    targetTimelineMonths: 8,
    interiorStyle: 'Contemporary Scandinavian with Warm Oak Timber & Solar Pergola',
    architectPartner: 'Studio Lotus Pune',
    consultantOrBroker: 'Self Web Inquiry',
    stage: 'DESIGN_PITCH',
    qualificationScore: 88,
    assignedSalesLead: 'Sneha Kulkarni',
    nextFollowUpDate: '2026-03-18',
    lastContactDate: '2026-03-13',
    siteVisitDate: '2026-03-08',
    siteVisitStatus: 'COMPLETED',
    siteVisitNotes: 'G+2 structure. Structural stability certificate obtained. Plumbing shaft needs rerouting.',
    communicationLog: [
      { date: '2026-03-02', type: 'WHATSAPP', summary: 'Inquiry received for G+2 Bungalow architecture + turnkey interior.', agent: 'Bot / Sneha K.' },
      { date: '2026-03-08', type: 'MEETING', summary: 'Site survey done. Soil test report reviewed for exterior deck.', agent: 'Sneha K.' }
    ],
    aiRecommendationSnippet: 'Recommend Option 2: Prefab lightweight steel framing for 2nd floor extension to reduce load on foundation.'
  },
  {
    id: 'LEAD-2026-003',
    leadCode: 'LD-1408',
    clientName: 'NEXUS Fintech Solutions (CTO Office)',
    phone: '+91 99002 88765',
    email: 'facilities@nexusfintech.io',
    source: 'PORTAL',
    projectType: 'OFFICE',
    location: 'Mindspace IT Park, 8th Floor, Airoli, Navi Mumbai',
    plotAreaSqFt: 0,
    builtUpAreaSqFt: 12000,
    carpetAreaSqFt: 9800,
    budgetMinINR: 22000000,
    budgetMaxINR: 28000000,
    floorsCount: 1,
    targetTimelineMonths: 3,
    interiorStyle: 'High-Tech Collaborative Workspace with Acoustic Phone Booths & IoT Lighting',
    architectPartner: 'Space Matrix Mumbai',
    consultantOrBroker: 'JLL Corporate Solutions',
    stage: 'ESTIMATION',
    qualificationScore: 92,
    assignedSalesLead: 'Rahul Deshmukh',
    nextFollowUpDate: '2026-03-16',
    lastContactDate: '2026-03-14',
    siteVisitDate: '2026-03-10',
    siteVisitStatus: 'COMPLETED',
    siteVisitNotes: 'Bare shell handed over by Mindspace. Fire sprinkler approval received from MIDC.',
    communicationLog: [
      { date: '2026-03-06', type: 'CALL', summary: 'Received RFP for 120-workstation turnkey office fitout.', agent: 'Rahul D.' },
      { date: '2026-03-10', type: 'MEETING', summary: 'Joint inspection with Mindspace building manager & JLL consultant.', agent: 'Rahul D.' }
    ],
    aiRecommendationSnippet: 'Recommend Fast-Track Modular Partition system to meet aggressive 90-day handover deadline.'
  },
  {
    id: 'LEAD-2026-004',
    leadCode: 'LD-1412',
    clientName: 'Rajesh & Meera Singhal',
    phone: '+91 97112 33445',
    email: 'rajesh.singhal@rediffmail.com',
    source: 'WHATSAPP',
    projectType: 'RESIDENTIAL',
    location: 'Lodha Parkside, Lower Parel, Mumbai',
    plotAreaSqFt: 0,
    builtUpAreaSqFt: 1850,
    carpetAreaSqFt: 1420,
    budgetMinINR: 4200000,
    budgetMaxINR: 5500000,
    floorsCount: 1,
    targetTimelineMonths: 4,
    interiorStyle: 'Neo-Classical Luxury with Gold Brass Accents & Herringbone Parquet',
    architectPartner: 'Direct Client',
    consultantOrBroker: 'None',
    stage: 'SITE_VISIT_SCHEDULED',
    qualificationScore: 78,
    assignedSalesLead: 'Sneha Kulkarni',
    nextFollowUpDate: '2026-03-17',
    lastContactDate: '2026-03-12',
    siteVisitDate: '2026-03-17',
    siteVisitStatus: 'SCHEDULED',
    siteVisitNotes: 'Scheduled for 11:00 AM on Tuesday. Society security gate pass arranged.',
    communicationLog: [
      { date: '2026-03-11', type: 'WHATSAPP', summary: 'Client requested portfolio and site survey for 3BHK interior renovation.', agent: 'Sneha K.' }
    ],
    aiRecommendationSnippet: 'Recommend standardizing joinery with pre-laminated marine ply to optimize ₹50 Lakhs budget.'
  }
];

export const CRMAndLeadView: React.FC<CRMAndLeadViewProps> = ({
  project,
  currentUser,
  onNavigateTab,
  onUpdateRequirement
}) => {
  const [leads, setLeads] = useState<LeadRecord[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<LeadRecord>(INITIAL_LEADS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'pipeline' | 'details' | 'new_lead' | 'site_visit' | 'ai_options'>('details');

  // New Lead Form State
  const [newLead, setNewLead] = useState<Partial<LeadRecord>>({
    clientName: '',
    phone: '',
    email: '',
    source: 'WEBSITE',
    projectType: 'RESIDENTIAL',
    location: '',
    builtUpAreaSqFt: 2500,
    budgetMinINR: 5000000,
    budgetMaxINR: 7500000,
    targetTimelineMonths: 4,
    interiorStyle: 'Modern Contemporary',
    stage: 'NEW_ENQUIRY'
  });

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.leadCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || l.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleConvertLeadToProject = (lead: LeadRecord) => {
    if (onUpdateRequirement) {
      onUpdateRequirement({
        customerName: lead.clientName,
        customerPhone: lead.phone,
        customerEmail: lead.email,
        projectSiteAddress: lead.location,
        projectType: lead.projectType,
        plotAreaSqFt: lead.plotAreaSqFt,
        builtUpAreaSqFt: lead.builtUpAreaSqFt,
        carpetAreaSqFt: lead.carpetAreaSqFt,
        floorsCount: lead.floorsCount,
        customerBudgetMin: lead.budgetMinINR,
        customerBudgetMax: lead.budgetMaxINR,
        preferredDesignStyle: lead.interiorStyle,
        surveyNotes: lead.siteVisitNotes || 'Generated from CRM Lead Qualification'
      });
    }
    // Navigate to step 2/3 (Survey / Requirements)
    if (onNavigateTab) {
      onNavigateTab('survey');
    }
  };

  const handleAddNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.clientName || !newLead.phone) return;

    const created: LeadRecord = {
      id: `LEAD-${Date.now()}`,
      leadCode: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: newLead.clientName || 'Unnamed Client',
      phone: newLead.phone || '',
      email: newLead.email || '',
      source: newLead.source || 'WEBSITE',
      projectType: newLead.projectType || 'RESIDENTIAL',
      location: newLead.location || 'Mumbai',
      plotAreaSqFt: 0,
      builtUpAreaSqFt: Number(newLead.builtUpAreaSqFt) || 2000,
      carpetAreaSqFt: Math.round((Number(newLead.builtUpAreaSqFt) || 2000) * 0.78),
      budgetMinINR: Number(newLead.budgetMinINR) || 4000000,
      budgetMaxINR: Number(newLead.budgetMaxINR) || 6000000,
      floorsCount: 1,
      targetTimelineMonths: Number(newLead.targetTimelineMonths) || 4,
      interiorStyle: newLead.interiorStyle || 'Contemporary',
      stage: 'NEW_ENQUIRY',
      qualificationScore: 70,
      assignedSalesLead: currentUser.name,
      nextFollowUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      lastContactDate: new Date().toISOString().split('T')[0],
      communicationLog: [
        {
          date: new Date().toISOString().split('T')[0],
          type: 'WHATSAPP',
          summary: 'Inbound lead captured and assigned to sales team.',
          agent: currentUser.name
        }
      ],
      aiRecommendationSnippet: `Generated for ${newLead.builtUpAreaSqFt} sq.ft ${newLead.projectType}: Estimated budget ₹${((Number(newLead.budgetMinINR) || 4000000) / 100000).toFixed(0)}L - ₹${((Number(newLead.budgetMaxINR) || 6000000) / 100000).toFixed(0)}L.`
    };

    setLeads([created, ...leads]);
    setSelectedLead(created);
    setActiveTab('details');
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen text-slate-800 p-4 md:p-6 space-y-5">
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#004a99] text-white flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Pillar 1: CRM & Inbound Opportunity Pipeline
              </h1>
              <p className="text-xs text-slate-500">
                End-to-End Inbound Capture (WhatsApp, Web, Referrals) → Requirements Recording → Site Visit → AI Feasibility
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-crm-new-lead"
            onClick={() => setActiveTab('new_lead')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#004a99] hover:bg-[#003875] text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Capture New Lead</span>
          </button>
          <button
            id="btn-convert-to-workflow"
            onClick={() => handleConvertLeadToProject(selectedLead)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Convert Lead to Project & Survey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left side lead list, Right side detail workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Lead Directory & Search (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Leads & Inquiries ({filteredLeads.length})
            </span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700"
            >
              <option value="ALL">All Stages</option>
              <option value="NEW_ENQUIRY">New Inquiry</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="SITE_VISIT_SCHEDULED">Site Visit Scheduled</option>
              <option value="DESIGN_PITCH">Design Pitch</option>
              <option value="ESTIMATION">Estimation</option>
              <option value="WON">Won & Active</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by client, location or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#004a99]"
            />
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredLeads.map((ld) => {
              const isSelected = selectedLead.id === ld.id;
              return (
                <div
                  key={ld.id}
                  id={`lead-card-${ld.leadCode}`}
                  onClick={() => {
                    setSelectedLead(ld);
                    setActiveTab('details');
                  }}
                  className={`p-3 rounded-md border cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50/70 border-[#004a99] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-900 text-xs truncate">
                      {ld.clientName}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      ld.stage === 'WON' ? 'bg-emerald-100 text-emerald-800' :
                      ld.stage === 'SITE_VISIT_SCHEDULED' ? 'bg-amber-100 text-amber-800' :
                      ld.stage === 'DESIGN_PITCH' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {ld.stage.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{ld.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-mono font-medium">
                      ₹{(ld.budgetMinINR / 100000).toFixed(0)}L - ₹{(ld.budgetMaxINR / 100000).toFixed(0)}L
                    </span>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                      {ld.source}
                    </span>
                  </div>

                  {ld.siteVisitStatus === 'SCHEDULED' && (
                    <div className="mt-2 text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      <span>Site Visit: {ld.siteVisitDate}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Workspace & Requirement Recording (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Sub-nav Tabs */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-2 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                activeTab === 'details' ? 'bg-[#004a99] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Client Requirements & Brief
            </button>
            <button
              onClick={() => setActiveTab('site_visit')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                activeTab === 'site_visit' ? 'bg-[#004a99] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Site Visit & Survey Reports
            </button>
            <button
              onClick={() => setActiveTab('ai_options')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition ${
                activeTab === 'ai_options' ? 'bg-purple-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>AI Preliminary Feasibility</span>
            </button>
            <button
              onClick={() => setActiveTab('new_lead')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                activeTab === 'new_lead' ? 'bg-[#004a99] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              + Inbound Lead Intake Form
            </button>
          </div>

          {/* TAB 1: Lead Details & Requirements Recording */}
          {activeTab === 'details' && selectedLead && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-5">
              
              {/* Lead Top Banner */}
              <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">{selectedLead.clientName}</h2>
                    <span className="text-xs bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded font-bold">
                      {selectedLead.leadCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedLead.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedLead.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedLead.location}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-500">Qualification Score</div>
                  <div className="text-lg font-bold text-emerald-600">{selectedLead.qualificationScore}/100</div>
                  <div className="text-[10px] text-slate-400">Assigned: {selectedLead.assignedSalesLead}</div>
                </div>
              </div>

              {/* Requirement Matrix (Pillar 1 Requirement Recording) */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#004a99]" />
                  <span>Requirement Recording Master</span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Project Type</span>
                    <strong className="text-slate-900">{selectedLead.projectType}</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Built-up Area</span>
                    <strong className="text-slate-900">{selectedLead.builtUpAreaSqFt.toLocaleString()} sq.ft</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Carpet Area</span>
                    <strong className="text-slate-900">{selectedLead.carpetAreaSqFt.toLocaleString()} sq.ft</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Target Timeline</span>
                    <strong className="text-slate-900">{selectedLead.targetTimelineMonths} Months</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Budget Bracket</span>
                    <strong className="text-slate-900">
                      ₹{(selectedLead.budgetMinINR / 100000).toFixed(0)}L - ₹{(selectedLead.budgetMaxINR / 100000).toFixed(0)}L
                    </strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Floors Count</span>
                    <strong className="text-slate-900">{selectedLead.floorsCount} Floor(s)</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Architect Partner</span>
                    <strong className="text-slate-900">{selectedLead.architectPartner || 'Direct'}</strong>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Broker / Portal</span>
                    <strong className="text-slate-900">{selectedLead.consultantOrBroker || 'None'}</strong>
                  </div>
                </div>

                <div className="mt-3 bg-blue-50/50 p-3 rounded border border-blue-200 text-xs">
                  <span className="text-blue-900 font-bold block mb-1">Interior & Architectural Style Preferences:</span>
                  <p className="text-slate-700">{selectedLead.interiorStyle}</p>
                </div>
              </div>

              {/* Stakeholder Communication History Log */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#004a99]" />
                  <span>Customer Communication History ({selectedLead.communicationLog.length} Records)</span>
                </h3>

                <div className="space-y-2">
                  {selectedLead.communicationLog.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded border border-slate-100 bg-slate-50/60 text-xs">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        log.type === 'WHATSAPP' ? 'bg-emerald-100 text-emerald-800' :
                        log.type === 'CALL' ? 'bg-blue-100 text-blue-800' :
                        log.type === 'MEETING' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-200 text-slate-800'
                      }`}>
                        {log.type}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-0.5">
                          <span>{log.date}</span>
                          <span>Logged by: <strong>{log.agent}</strong></span>
                        </div>
                        <p className="text-slate-800">{log.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 flex-wrap gap-2">
                <div className="text-xs text-slate-500">
                  Ready to proceed? Move this lead into Site Survey & BOQ Estimation.
                </div>
                <button
                  id="btn-lead-convert-action"
                  onClick={() => handleConvertLeadToProject(selectedLead)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Convert to Active Project & Survey</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: Site Visit & Survey Reports */}
          {activeTab === 'site_visit' && selectedLead && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Site Visit Scheduling & Inspection Protocol</h3>
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  selectedLead.siteVisitStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                  selectedLead.siteVisitStatus === 'SCHEDULED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  Status: {selectedLead.siteVisitStatus || 'PENDING'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Site Visit Date</span>
                  <strong className="text-slate-800">{selectedLead.siteVisitDate || 'Not Scheduled'}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Visiting Engineer</span>
                  <strong className="text-slate-800">Ar. Rajesh Sharma (Site Ops)</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Tools Deployed</span>
                  <strong className="text-slate-800">Laser Disto + Moisture Meter</strong>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Site Visit Engineer Notes:</span>
                <p className="text-slate-700">
                  {selectedLead.siteVisitNotes || 'No visit observations recorded yet. Click below to enter survey observations.'}
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded border border-amber-200 text-amber-900">
                <span className="font-bold block mb-1">Pillar 3 Direct Handshake:</span>
                <p>
                  Measurements captured during site visits are automatically synced with the Site Survey module, where room dimensions, slab heights, and photographic evidence are bound to the BOQ.
                </p>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('survey')}
                  className="mt-2 px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1"
                >
                  <span>Open Full Site Survey Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: AI Preliminary Feasibility */}
          {activeTab === 'ai_options' && selectedLead && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">
                  AI-Generated Project Options & Preliminary Recommendations (Pillars 1 & 5)
                </h3>
              </div>

              <p className="text-slate-600">
                Based on client requirement ({selectedLead.builtUpAreaSqFt} sq.ft, budget ₹{(selectedLead.budgetMinINR / 100000).toFixed(0)}L - ₹{(selectedLead.budgetMaxINR / 100000).toFixed(0)}L, {selectedLead.interiorStyle}), our engineering engine recommends:
              </p>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-2">
                <div className="font-bold text-purple-900 flex items-center justify-between">
                  <span>Preliminary Engineering Recommendation</span>
                  <span className="bg-purple-200 text-purple-800 text-[10px] px-2 py-0.5 rounded font-mono">
                    AI Match: 94% Feasibility
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {selectedLead.aiRecommendationSnippet}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded border border-slate-200 bg-slate-50">
                  <span className="font-bold text-slate-800 block mb-1">Cost Per Sq.Ft Estimated</span>
                  <div className="text-base font-bold text-[#004a99]">
                    ₹{Math.round(selectedLead.budgetMinINR / selectedLead.builtUpAreaSqFt)} - ₹{Math.round(selectedLead.budgetMaxINR / selectedLead.builtUpAreaSqFt)} / sq.ft
                  </div>
                  <span className="text-[10px] text-slate-500">Includes civil, flooring, carpentry, and electrical turnkey.</span>
                </div>

                <div className="p-3 rounded border border-slate-200 bg-slate-50">
                  <span className="font-bold text-slate-800 block mb-1">Next Step in 15-Step Workflow</span>
                  <div className="text-base font-bold text-emerald-600">
                    Step 4: AI Design Options Studio
                  </div>
                  <span className="text-[10px] text-slate-500">Generates 4-5 complete architectural options with preliminary BOQs.</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab && onNavigateTab('drawings')}
                className="w-full py-2 rounded bg-purple-700 hover:bg-purple-800 text-white font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Open Design & AI Options Studio</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 4: Inbound Lead Intake Form */}
          {activeTab === 'new_lead' && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                Inbound Lead Capture Form (Multi-Channel Intake)
              </h3>

              <form onSubmit={handleAddNewLead} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Customer / Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={newLead.clientName}
                      onChange={(e) => setNewLead({ ...newLead, clientName: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-[#004a99]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Phone Number (WhatsApp) *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98XXX XXXXX"
                      value={newLead.phone}
                      onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-[#004a99]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="client@example.com"
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-[#004a99]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Lead Source Channel</label>
                    <select
                      value={newLead.source}
                      onChange={(e: any) => setNewLead({ ...newLead, source: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded bg-white"
                    >
                      <option value="WEBSITE">Website Lead Form</option>
                      <option value="WHATSAPP">WhatsApp Direct Chat</option>
                      <option value="PHONE_CALL">Inbound Phone Call</option>
                      <option value="ARCHITECT_REFERRAL">Architect Referral</option>
                      <option value="PORTAL">Housing / 99acres Portal</option>
                      <option value="WALK_IN">Experience Center Walk-in</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Project Type</label>
                    <select
                      value={newLead.projectType}
                      onChange={(e: any) => setNewLead({ ...newLead, projectType: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded bg-white"
                    >
                      <option value="RESIDENTIAL">Residential (Flat / Bungalow)</option>
                      <option value="COMMERCIAL">Commercial Fitout</option>
                      <option value="OFFICE">Corporate Office</option>
                      <option value="RETAIL">Retail Store</option>
                      <option value="HOSPITALITY">Restaurant / Cafe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Built-Up Area (sq.ft)</label>
                    <input
                      type="number"
                      value={newLead.builtUpAreaSqFt}
                      onChange={(e) => setNewLead({ ...newLead, builtUpAreaSqFt: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-200 rounded"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">Project Site Location / Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Unit 802, Hiranandani Gardens, Powai, Mumbai"
                      value={newLead.location}
                      onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Customer Budget Range (₹)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min (e.g. 5000000)"
                        value={newLead.budgetMinINR}
                        onChange={(e) => setNewLead({ ...newLead, budgetMinINR: Number(e.target.value) })}
                        className="w-1/2 p-2 border border-slate-200 rounded"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        placeholder="Max (e.g. 8000000)"
                        value={newLead.budgetMaxINR}
                        onChange={(e) => setNewLead({ ...newLead, budgetMaxINR: Number(e.target.value) })}
                        className="w-1/2 p-2 border border-slate-200 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Target Timeline (Months)</label>
                    <input
                      type="number"
                      value={newLead.targetTimelineMonths}
                      onChange={(e) => setNewLead({ ...newLead, targetTimelineMonths: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#004a99] hover:bg-[#003875] text-white font-bold shadow-sm"
                  >
                    Save & Qualify Lead
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
