/**
 * Build Storys ERP - End-to-End Recommended Process Workflow Navigator
 * Visual interactive pipeline:
 * Lead → Customer Requirement → Site Survey → Design Options → Estimate & BOQ → 
 * Quotation → Contract Approval → Project Creation → Procurement → Site Execution → 
 * Measurement & Billing → Quality & Safety → Client Approval → Handover → Warranty & AMC
 */

import React, { useState } from 'react';
import { 
  UserPlus, 
  FileText, 
  Compass, 
  Sparkles, 
  Calculator, 
  FileCheck, 
  FileSignature, 
  FolderPlus, 
  ShoppingBag, 
  HardHat, 
  Receipt, 
  ShieldCheck, 
  Smile, 
  Key, 
  ShieldAlert, 
  ChevronRight, 
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  X
} from 'lucide-react';
import { ProcessLifecycleStepMeta, ProcessLifecycleStepId } from '../types/erp';

export const LIFECYCLE_STEPS: ProcessLifecycleStepMeta[] = [
  {
    stepNumber: 1,
    id: 'LEAD_CAPTURE',
    name: '1. Lead Capture',
    shortLabel: 'Lead',
    description: 'Capture inbound leads from website, calls, WhatsApp, architect referrals, and qualify opportunity.',
    responsibleRole: 'Sales Executive',
    primaryTab: 'crm',
    keyArtifacts: 'Lead Card, Channel Attribution, Follow-up Timeline',
    status: 'COMPLETED'
  },
  {
    stepNumber: 2,
    id: 'CUSTOMER_REQUIREMENT',
    name: '2. Customer Requirement',
    shortLabel: 'Requirement',
    description: 'Record project type, plot/carpet area, floors, budget bracket, lifestyle, and detailed room brief.',
    responsibleRole: 'Sales / Designer',
    primaryTab: 'requirements',
    keyArtifacts: 'Requirement Brief, Space Schedule, Budget Range',
    status: 'COMPLETED'
  },
  {
    stepNumber: 3,
    id: 'SITE_SURVEY',
    name: '3. Site Survey',
    shortLabel: 'Survey',
    description: 'On-site laser disto measurements, GPS location, civil condition check, MEP constraints, and photos.',
    responsibleRole: 'Site Engineer',
    primaryTab: 'survey',
    keyArtifacts: 'Survey Form, Room Dimensions, Constraints Log',
    status: 'COMPLETED'
  },
  {
    stepNumber: 4,
    id: 'DESIGN_OPTIONS',
    name: '4. Design Options & AI Studio',
    shortLabel: 'Design',
    description: 'Architectural drawings, floor plans, 3D renders, and AI generation of 4-5 project options with internal review.',
    responsibleRole: 'Architect / Designer',
    primaryTab: 'drawings',
    keyArtifacts: 'CAD Layouts, 4 Design Options, GFC Drawings',
    status: 'COMPLETED'
  },
  {
    stepNumber: 5,
    id: 'ESTIMATE_BOQ',
    name: '5. Estimate and BOQ',
    shortLabel: 'BOQ',
    description: 'Itemized BOQ, WBS, Material/Labour/Equipment rate analysis, wastage %, takeoffs, and frozen baseline.',
    responsibleRole: 'Estimation Engineer',
    primaryTab: 'boq',
    keyArtifacts: 'BOQ Rev-A Baseline, Rate Analysis, Takeoffs',
    status: 'COMPLETED'
  },
  {
    stepNumber: 6,
    id: 'QUOTATION',
    name: '6. Sales Quotation',
    shortLabel: 'Quotation',
    description: 'Client quotation with Economy/Standard/Premium tiers, exclusions, payment milestones, and VE studio.',
    responsibleRole: 'Commercial Manager',
    primaryTab: 'quotation',
    keyArtifacts: 'Customer Quotation PDF, Payment Terms, Inclusions',
    status: 'COMPLETED'
  },
  {
    stepNumber: 7,
    id: 'CONTRACT_APPROVAL',
    name: '7. Contract Approval',
    shortLabel: 'Contract',
    description: 'Commercial contract sign-off, mobilization advance (10%), retention (5%), DLP, and penalty terms.',
    responsibleRole: 'Legal & Management',
    primaryTab: 'contracts',
    keyArtifacts: 'Executed Contract, Milestone Schedule, Retention Agreement',
    status: 'COMPLETED'
  },
  {
    stepNumber: 8,
    id: 'PROJECT_CREATION',
    name: '8. Project Creation',
    shortLabel: 'Project',
    description: 'Project master setup, unique project code, PM & team assignment, stakeholder mapping, and doc store.',
    responsibleRole: 'Project Manager',
    primaryTab: 'projects',
    keyArtifacts: 'Job Card, Team Matrix, Document Transmittal',
    status: 'COMPLETED'
  },
  {
    stepNumber: 9,
    id: 'PROCUREMENT',
    name: '9. Procurement & Purchase',
    shortLabel: 'Procurement',
    description: 'Site material requisitions (PR), multi-vendor RFQ comparative statement, PO, GRN, and warehouse stock.',
    responsibleRole: 'Purchase Manager',
    primaryTab: 'procurement',
    keyArtifacts: 'Purchase Orders, Comparative Matrix, GRN Inwards',
    status: 'IN_PROGRESS'
  },
  {
    stepNumber: 10,
    id: 'SITE_EXECUTION',
    name: '10. Site Execution & DPR',
    shortLabel: 'Execution',
    description: 'Daily progress reports (DPR), site diary, labour attendance, Gantt schedule, timesheets, and resource shifts.',
    responsibleRole: 'Site Engineer / PM',
    primaryTab: 'site_execution',
    keyArtifacts: 'DPR Logs, Gantt Milestones, Daily Photos',
    status: 'IN_PROGRESS'
  },
  {
    stepNumber: 11,
    id: 'MEASUREMENT_BILLING',
    name: '11. Measurement & Billing',
    shortLabel: 'Measurement',
    description: 'Physical Measurement Book (MB), engineer verification, subcontractor work orders, RA bills, and retention.',
    responsibleRole: 'Billing Engineer',
    primaryTab: 'contractors',
    keyArtifacts: 'Measurement Book (MB), RA Invoices, 5% Retention',
    status: 'IN_PROGRESS'
  },
  {
    stepNumber: 12,
    id: 'QUALITY_SAFETY',
    name: '12. Quality & Safety (HSE)',
    shortLabel: 'Quality/HSE',
    description: 'Quality ITP inspection checklists, material test reports, NCR defect management, toolbox talks, and PTW permits.',
    responsibleRole: 'HSE & QA Manager',
    primaryTab: 'compliance',
    keyArtifacts: 'NCR Register, Permit to Work (PTW), Toolbox Talks',
    status: 'IN_PROGRESS'
  },
  {
    stepNumber: 13,
    id: 'CLIENT_APPROVAL',
    name: '13. Client Approval Portal',
    shortLabel: 'Client Portal',
    description: 'Customer transparent view of progress, 3D renders, approved materials, change requests, and invoices.',
    responsibleRole: 'Client Relationship',
    primaryTab: 'portal',
    keyArtifacts: 'Client Approval Stamps, NPS Rating, Change Approvals',
    status: 'PENDING'
  },
  {
    stepNumber: 14,
    id: 'HANDOVER',
    name: '14. Handover & Closure',
    shortLabel: 'Handover',
    description: 'Snag closure, final inspection, as-built drawings transmittal, O&M manuals, handover certificate, and keys release.',
    responsibleRole: 'Project Manager',
    primaryTab: 'handover',
    keyArtifacts: 'Handover Certificate, Snag Clearance, Retention Release',
    status: 'PENDING'
  },
  {
    stepNumber: 15,
    id: 'WARRANTY_AMC',
    name: '15. Warranty & AMC',
    shortLabel: 'Warranty/AMC',
    description: 'OEM warranties (CenturyPly 25yr, Blum 10yr), DLP tracking, complaint ticket management, technician visits, and AMC.',
    responsibleRole: 'After-Sales Service',
    primaryTab: 'warranty',
    keyArtifacts: 'Warranty Certificates, Defect Tickets, AMC Contracts',
    status: 'PENDING'
  }
];

const STEP_ICONS: Record<ProcessLifecycleStepId, React.ElementType> = {
  LEAD_CAPTURE: UserPlus,
  CUSTOMER_REQUIREMENT: FileText,
  SITE_SURVEY: Compass,
  DESIGN_OPTIONS: Sparkles,
  ESTIMATE_BOQ: Calculator,
  QUOTATION: FileCheck,
  CONTRACT_APPROVAL: FileSignature,
  PROJECT_CREATION: FolderPlus,
  PROCUREMENT: ShoppingBag,
  SITE_EXECUTION: HardHat,
  MEASUREMENT_BILLING: Receipt,
  QUALITY_SAFETY: ShieldCheck,
  CLIENT_APPROVAL: Smile,
  HANDOVER: Key,
  WARRANTY_AMC: ShieldAlert
};

interface EndToEndProcessWorkflowBarProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  projectCode?: string;
  onOpenAIWorkspace?: () => void;
}

export const EndToEndProcessWorkflowBar: React.FC<EndToEndProcessWorkflowBarProps> = ({
  activeTab,
  onNavigateTab,
  projectCode = 'PROJ-SKYLINE-1402'
}) => {
  const [selectedStep, setSelectedStep] = useState<ProcessLifecycleStepMeta | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Map activeTab to step
  const currentStep = LIFECYCLE_STEPS.find(s => s.primaryTab === activeTab) || 
    (activeTab === 'general' ? LIFECYCLE_STEPS[7] : null);

  return (
    <div className="bg-gradient-to-r from-[#001737] via-[#002456] to-[#001737] text-white border-b border-[#003a7a] shadow-md px-3 py-1.5 select-none">
      <div className="max-w-[1750px] mx-auto flex flex-col gap-1.5">
        
        {/* Top Header Strip: Title, Progress stats & Expand toggle */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended End-to-End Lifecycle</span>
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono text-cyan-200">
              15 Verified Workflow Stages
            </span>
            <span className="hidden sm:inline-block text-[11px] text-slate-300">
              Project: <strong className="text-white font-mono">{projectCode}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" /> 8 Done
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ml-1.5" /> 4 In Progress
              <span className="inline-block w-2 h-2 rounded-full bg-slate-500 ml-1.5" /> 3 Upcoming
            </div>

            <button
              id="btn-toggle-lifecycle-details"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] px-2 py-0.5 rounded bg-[#004a99] hover:bg-[#005bb5] text-white font-medium transition"
            >
              {isExpanded ? 'Hide Details' : 'View Workflow Guide'}
            </button>
          </div>
        </div>

        {/* The 15 Horizontal Stepper Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none min-w-0">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const Icon = STEP_ICONS[step.id] || FileText;
            const isSelected = activeTab === step.primaryTab;

            return (
              <React.Fragment key={step.id}>
                <button
                  id={`lifecycle-step-btn-${step.stepNumber}`}
                  onClick={() => {
                    setSelectedStep(step);
                    onNavigateTab(step.primaryTab);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all shrink-0 text-left ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md ring-2 ring-white/50 scale-102'
                      : 'text-slate-200 hover:bg-[#003875] hover:text-white'
                  }`}
                  title={`${step.name} - ${step.description}`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isSelected
                      ? 'bg-slate-950 text-amber-400'
                      : step.status === 'COMPLETED'
                      ? 'bg-emerald-600 text-white'
                      : step.status === 'IN_PROGRESS'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {step.stepNumber}
                  </div>

                  <span className="text-[11px] whitespace-nowrap">{step.shortLabel}</span>
                </button>

                {idx < LIFECYCLE_STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-[#004a99] shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Expanded Lifecycle Guide Drawer */}
        {isExpanded && (
          <div className="bg-[#001f47] border border-[#004a99] rounded p-3 mt-1 text-xs text-slate-200 space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#003d7a] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400 text-sm">
                  Complete Construction & Turnkey Interior Lifecycle Standard
                </span>
                <span className="bg-[#004a99] text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  ISO / Indian Works Contract Compliant
                </span>
              </div>
              <button onClick={() => setIsExpanded(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {LIFECYCLE_STEPS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onNavigateTab(s.primaryTab)}
                  className={`p-2 rounded border cursor-pointer transition ${
                    activeTab === s.primaryTab
                      ? 'bg-[#003366] border-amber-400 ring-1 ring-amber-400/40'
                      : 'bg-[#001737] border-[#003875] hover:border-[#005bb5]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-[11px]">{s.name}</span>
                    <span className={`text-[9px] px-1 rounded font-mono ${
                      s.status === 'COMPLETED' ? 'bg-emerald-900/60 text-emerald-300' :
                      s.status === 'IN_PROGRESS' ? 'bg-amber-900/60 text-amber-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 line-clamp-2 mb-1.5">
                    {s.description}
                  </p>
                  <div className="text-[9px] text-cyan-300 font-mono">
                    Owner: <strong>{s.responsibleRole}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
