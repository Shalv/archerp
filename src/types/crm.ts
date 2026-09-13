/**
 * Build Storys ERP - CRM & Lead Pipeline Type Definitions
 * Expert CRM models: Deals, Stages, BANT qualification, Omnichannel communication,
 * Stakeholders, Commercial Turnkey Estimator & Pipeline Analytics.
 */

export type CrmStageId =
  | 'NEW_ENQUIRY'
  | 'QUALIFIED'
  | 'SITE_VISIT_SCHEDULED'
  | 'DESIGN_PITCH'
  | 'ESTIMATION'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export interface CrmStageConfig {
  id: CrmStageId;
  label: string;
  shortLabel: string;
  probability: number; // 0 - 100
  color: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  description: string;
}

export const CRM_STAGES_CONFIG: CrmStageConfig[] = [
  {
    id: 'NEW_ENQUIRY',
    label: 'New Inquiry',
    shortLabel: 'Inquiry',
    probability: 10,
    color: '#64748B',
    badgeBg: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-300',
    description: 'Fresh inbound lead from web, WhatsApp, or phone awaiting qualification'
  },
  {
    id: 'QUALIFIED',
    label: 'Contacted & Qualified',
    shortLabel: 'Qualified',
    probability: 25,
    color: '#0284C7',
    badgeBg: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-300',
    description: 'Initial phone discovery completed. Budget, scope and intent verified'
  },
  {
    id: 'SITE_VISIT_SCHEDULED',
    label: 'Site Visit & Laser Survey',
    shortLabel: 'Site Visit',
    probability: 50,
    color: '#D97706',
    badgeBg: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    description: 'Physical site inspection with laser disto and moisture meter arranged/done'
  },
  {
    id: 'DESIGN_PITCH',
    label: 'Concept & Design Pitch',
    shortLabel: 'Design Pitch',
    probability: 70,
    color: '#7C3AED',
    badgeBg: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
    description: 'Moodboards, 3D spatial layout options, and preliminary budget presented'
  },
  {
    id: 'ESTIMATION',
    label: 'BOQ & Detailed Costing',
    shortLabel: 'BOQ Estimating',
    probability: 85,
    color: '#2563EB',
    badgeBg: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    description: 'Itemized BOQ lines, master rate lookups, and quotation tranches prepared'
  },
  {
    id: 'NEGOTIATION',
    label: 'Commercial Negotiation',
    shortLabel: 'Negotiation',
    probability: 95,
    color: '#059669',
    badgeBg: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-300',
    description: 'Final scope refinement, contract terms, retention 5%, and advance token'
  },
  {
    id: 'WON',
    label: 'Closed Won (Active Project)',
    shortLabel: 'Closed Won',
    probability: 100,
    color: '#107C41',
    badgeBg: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-400',
    description: 'Contract executed with advance payment. Auto-transferred to Project Hub'
  },
  {
    id: 'LOST',
    label: 'Closed Lost',
    shortLabel: 'Closed Lost',
    probability: 0,
    color: '#E11D48',
    badgeBg: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-300',
    description: 'Opportunity dropped or lost to competitor with documented loss reason'
  }
];

export interface CrmCommunicationLog {
  id: string;
  date: string;
  time: string;
  type: 'CALL' | 'WHATSAPP' | 'EMAIL' | 'MEETING' | 'NOTE';
  summary: string;
  outcome?: string;
  agent: string;
}

export interface CrmStakeholder {
  name: string;
  role: 'Primary Owner' | 'Co-Owner / Spouse' | 'Architect Consultant' | 'PMC / Builder' | 'Facility Manager';
  phone: string;
  email: string;
  isDecisionMaker: boolean;
}

export interface BantQualification {
  budgetScore: number; // 0-25
  authorityScore: number; // 0-25
  needScore: number; // 0-25
  timelineScore: number; // 0-25
  budgetNotes: string;
  authorityNotes: string;
  needNotes: string;
  timelineNotes: string;
}

export interface CrmLeadExtended {
  id: string;
  leadCode: string;
  clientName: string;
  companyName?: string;
  phone: string;
  email: string;
  source: 'WEBSITE' | 'WHATSAPP' | 'PHONE_CALL' | 'ARCHITECT_REFERRAL' | 'PORTAL' | 'WALK_IN' | 'REPEAT_CLIENT';
  projectType: 'RESIDENTIAL' | 'COMMERCIAL' | 'OFFICE' | 'RETAIL' | 'HOSPITALITY';
  location: string;
  city: string;
  plotAreaSqFt: number;
  builtUpAreaSqFt: number;
  carpetAreaSqFt: number;
  budgetMinINR: number;
  budgetMaxINR: number;
  dealValueINR: number; // canonical deal value for pipeline forecasting
  targetFinishTier: 'Standard Turnkey' | 'Premium Luxury' | 'Ultra Bespoke';
  floorsCount: number;
  targetTimelineMonths: number;
  interiorStyle: string;
  architectPartner?: string;
  consultantOrBroker?: string;
  stage: CrmStageId;
  assignedSalesLead: string;
  nextFollowUpDate: string;
  nextFollowUpTime?: string;
  nextActionTitle: string;
  lastContactDate: string;
  siteVisitDate?: string;
  siteVisitTime?: string;
  siteVisitStatus?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
  siteVisitNotes?: string;
  visitingEngineer?: string;
  bant: BantQualification;
  stakeholders: CrmStakeholder[];
  communicationLog: CrmCommunicationLog[];
  aiRecommendationSnippet: string;
  estimatedTurnkeyRatePerSqFt: number;
  expectedGrossMarginPct: number;
  lostReason?: string;
  createdAt: string;
}
