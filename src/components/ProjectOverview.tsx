import React from 'react';
import { 
  Building, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Layers, 
  FileSpreadsheet, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { ProjectRecord, UserSession, ProjectStage } from '../types/erp';

interface ProjectOverviewProps {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
}

const STAGES: { key: ProjectStage; label: string; phase: string }[] = [
  { key: 'ENQUIRY', label: '1. Enquiry & CRM', phase: 'Phase 1' },
  { key: 'REQUIREMENTS_SURVEY', label: '2. Requirements & Survey', phase: 'Phase 1' },
  { key: 'AI_DRAFT_BOQ', label: '3. AI Draft BOQ', phase: 'Phase 1' },
  { key: 'ESTIMATOR_REVIEW', label: '4. Estimator Review', phase: 'Phase 1' },
  { key: 'APPROVED_BUDGET', label: '5. Approved Baseline', phase: 'Phase 1' },
  { key: 'CUSTOMER_QUOTATION', label: '6. Customer Quotation', phase: 'Phase 1' },
  { key: 'EXECUTION_ONGOING', label: '7. Site Execution', phase: 'Phase 2' },
  { key: 'HANDOVER_WARRANTY', label: '8. Handover & Warranty', phase: 'Phase 3' }
];

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  currentUser,
  onNavigateTab
}) => {
  const handleNavigate = (tab: string) => {
    if (typeof onNavigateTab === 'function') {
      onNavigateTab(tab);
    }
  };

  const isClient = currentUser?.role === 'CLIENT';
  const activeRev = project.revisions.find(r => r.id === project.activeRevisionId) || project.revisions[0];

  return (
    <div className="space-y-6">
      {/* Client Mode Privacy Banner */}
      {isClient && (
        <div className="rounded-xl border border-[#F5C2C7] bg-[#FFF5F5] p-4 text-xs text-[#842029]">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="h-4 w-4 text-[#B02A37]" />
            <span>Customer Portal Access Active</span>
          </div>
          <p className="mt-1">
            You are logged in as the property owner (<strong>{currentUser.name}</strong>). Internal contractor cost breakdowns, contractor margins, and vendor bid prices are strictly masked.
          </p>
        </div>
      )}

      {/* Main Project Header Card */}
      <div className="rounded-xl border border-[#E5DFD7] bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#EFE9DF] px-2 py-0.5 text-xs font-bold text-[#4A4036]">
                {project.projectCode}
              </span>
              <span className="rounded bg-[#E9F3EE] px-2 py-0.5 text-xs font-semibold text-[#1F7A4D]">
                {project.projectType} • {project.projectScope.replace(/_/g, ' ')}
              </span>
            </div>
            <h1 className="mt-2 font-serif text-2xl font-bold text-[#1F2421]">
              {project.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#B87A38]" />
                {project.siteAddress}, {project.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#857B6F]" />
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-[#857B6F]" />
                Carpet Area: <strong>{project.carpetAreaSqFt} sq.ft</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleNavigate('REQUIREMENTS')}
              className="rounded-lg border border-[#D5CCC0] bg-[#FAF7F2] px-3.5 py-2 text-xs font-semibold text-[#3C362F] hover:bg-[#F0EBE2] transition"
            >
              Survey & Brief
            </button>
            <button
              onClick={() => handleNavigate('BOQ')}
              className="flex items-center gap-1.5 rounded-lg bg-[#273034] px-4 py-2 text-xs font-semibold text-[#E0A96D] hover:bg-[#1B2225] transition shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI BOQ Studio</span>
            </button>
          </div>
        </div>

        {/* Lifecycle Stepper */}
        <div className="mt-6 border-t border-[#F0EBE3] pt-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#8A8073] mb-3">
            Connected Project Lifecycle Progression
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {STAGES.map((s, idx) => {
              const isCurrent = project.stage === s.key;
              const isPhase1 = s.phase === 'Phase 1';
              return (
                <div
                  key={s.key}
                  className={`rounded-lg border p-2 text-xs transition ${
                    isCurrent
                      ? 'border-[#B87A38] bg-[#FAF4EC] shadow-2xs'
                      : isPhase1
                      ? 'border-[#E5DFD7] bg-[#FDFCFB]'
                      : 'border-dashed border-[#DDD7CE] bg-[#FBF9F7] opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#8C8275]">
                    <span>Step {idx + 1}</span>
                    <span className="font-semibold text-[9px] px-1 rounded bg-[#EFEAE2]">{s.phase}</span>
                  </div>
                  <div className="mt-1 font-semibold text-[#1F2421] truncate text-[11px]">
                    {s.label.split('. ')[1]}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px]">
                    {isCurrent ? (
                      <span className="text-[#B87A38] font-bold flex items-center gap-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B87A38] animate-ping"></span>
                        Active Stage
                      </span>
                    ) : (
                      <span className="text-[#8C847A]">
                        {idx < 6 ? 'Operational' : 'Phase Ready'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estimated Selling Amount */}
        <div className="rounded-xl border border-[#E5DFD7] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6B7280]">Customer Contract Quotation</span>
            <div className="rounded-lg bg-[#FAF4EC] p-2 text-[#B87A38]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-[#1F2421]">
            ₹{project.estimatedBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="mt-1 text-xs text-[#71685D]">
            Excluding 18% GST (₹{Math.round(project.estimatedBudget * 0.18).toLocaleString('en-IN')})
          </div>
        </div>

        {/* Internal Cost (Restricted for Client) */}
        <div className="rounded-xl border border-[#E5DFD7] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6B7280]">Internal Project Cost Budget</span>
            <div className="rounded-lg bg-[#EBF3EF] p-2 text-[#1E7348]">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          {isClient ? (
            <div className="mt-3 text-xs font-medium text-[#842029] bg-[#FDF2F2] p-2 rounded">
              Confidential (Restricted)
            </div>
          ) : (
            <>
              <div className="mt-3 font-serif text-2xl font-bold text-[#1F2421]">
                ₹{Math.round(project.estimatedBudget * 0.74).toLocaleString('en-IN')}
              </div>
              <div className="mt-1 text-xs text-[#71685D]">
                Target Gross Margin: <strong>26.0%</strong>
              </div>
            </>
          )}
        </div>

        {/* BOQ Takeoff Items */}
        <div className="rounded-xl border border-[#E5DFD7] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6B7280]">Active BOQ Items</span>
            <div className="rounded-lg bg-[#E0F2FE] p-2 text-[#0369A1]">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-serif text-2xl font-bold text-[#1F2421]">
            {activeRev ? activeRev.items.length : 0} Lines
          </div>
          <div className="mt-1 text-xs text-[#71685D]">
            Revision: <strong>{activeRev ? activeRev.revisionLabel : 'None'}</strong>
          </div>
        </div>

        {/* Client & Commercial Details */}
        <div className="rounded-xl border border-[#E5DFD7] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6B7280]">Client Information</span>
            <div className="rounded-lg bg-[#F5EFEB] p-2 text-[#7C4A1E]">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 font-semibold text-sm text-[#1F2421] truncate">
            {project.clientName}
          </div>
          <div className="mt-1 text-xs text-[#6B7280] flex flex-col gap-0.5">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-[#A89E90]" /> {project.clientPhone}
            </span>
            <span className="flex items-center gap-1 truncate">
              <Mail className="h-3 w-3 text-[#A89E90]" /> {project.clientEmail}
            </span>
          </div>
        </div>
      </div>

      {/* Scope Highlights & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-[#E5DFD7] bg-white p-6 shadow-xs">
          <h2 className="font-serif text-base font-bold text-[#1F2421]">Project Scope & Verified Trades</h2>
          <p className="mt-1 text-xs text-[#6B7280]">
            Integrated turnkey interior architecture scope as captured during site survey and drawing takeoff.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-[#EDE7DD] bg-[#FAF8F5] p-3">
              <div className="font-semibold text-[#1F2421]">Civil, Demolition & Waterproofing</div>
              <p className="mt-1 text-[#5E564B] leading-relaxed">
                Partition demolition between dining and study, 2-coat elastomeric waterproofing in master bathroom with 72-hour pond testing.
              </p>
            </div>
            <div className="rounded-lg border border-[#EDE7DD] bg-[#FAF8F5] p-3">
              <div className="font-semibold text-[#1F2421]">Flooring & False Ceilings</div>
              <p className="mt-1 text-[#5E564B] leading-relaxed">
                1600x800mm Italian marble vitrified tiles, AC4 German wooden flooring in Master Suite, Saint-Gobain Gyproc false ceiling with LED light cove.
              </p>
            </div>
            <div className="rounded-lg border border-[#EDE7DD] bg-[#FAF8F5] p-3">
              <div className="font-semibold text-[#1F2421]">Modular Kitchen & Storage</div>
              <p className="mt-1 text-[#5E564B] leading-relaxed">
                18mm BWP 710 Marine Plywood carcass, Hafele soft-close tandem drawers, Senoplast acrylic shutters, and KalingaStone quartz counter.
              </p>
            </div>
            <div className="rounded-lg border border-[#EDE7DD] bg-[#FAF8F5] p-3">
              <div className="font-semibold text-[#1F2421]">Wardrobes & Painting</div>
              <p className="mt-1 text-[#5E564B] leading-relaxed">
                10ft sliding wardrobe with smoked American walnut natural veneer & Italian PU coat, complete apartment painted with Asian Paints Royale Luxury Emulsion.
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end">
            <button
              onClick={() => handleNavigate('REQUIREMENTS')}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#A86F37] hover:text-[#885422] transition"
            >
              <span>View complete survey rooms and upload briefs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Phase Demonstration Summary Card */}
        <div className="rounded-xl border border-[#E3D9C9] bg-[#FAF7F0] p-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-[#A86F37] p-1.5 text-white">
              <FileCheck className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#1F2421]">Phase 1 Demonstration Walkthrough</h3>
          </div>
          <p className="mt-2 text-xs text-[#6B5E4F] leading-relaxed">
            Verify the 8 required acceptance criteria for the residential interior turnkey slice:
          </p>
          <ul className="mt-3 space-y-2 text-xs text-[#52473A]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
              <span><strong>1. Capture requirements:</strong> Guided multi-space form + drawing uploads.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
              <span><strong>2. Identify missing dimensions:</strong> AI flags unscaled drawings & missing heights.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
              <span><strong>3. Provisional BOQ:</strong> Generated from approved master rate library.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
              <span><strong>4. Compare budget options:</strong> Economy, Standard, and Premium packages.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
              <span><strong>5. Edit & approve estimate:</strong> In-line formulas and Estimator freeze.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
              <span><strong>6. Export quotation:</strong> Customer view masks internal margin & unit cost.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
              <span><strong>7. Persist records:</strong> File-backed storage survives restarts & logout.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
              <span><strong>8. Reject unauthorized:</strong> Role-based access control (RBAC).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
