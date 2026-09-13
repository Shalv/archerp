import React, { useState } from 'react';
import {
  Download,
  Share2,
  Printer,
  Mail,
  Phone,
  MessageSquare,
  Building,
  CheckCircle2,
  Shield,
  Layers,
  Sparkles,
  Palette,
  Award,
  Calendar,
  DollarSign,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Eye,
  FileText
} from 'lucide-react';
import {
  CustomerDiscoveryData,
  CategorySampleHead,
  COMPANY_PROFILE_DATA,
  SERVICE_CATALOGUE_DATA,
  DESIGN_PROCESS_STEPS,
  PRE_START_DOCUMENTS_CHECKLIST
} from '../../data/discoveryAndSampleHeadsData';
import { ProjectRecord } from '../../types/erp';

interface VisualInformationPackViewProps {
  discoveryData: CustomerDiscoveryData;
  sampleHeads: CategorySampleHead[];
  project: ProjectRecord;
}

export const VisualInformationPackView: React.FC<VisualInformationPackViewProps> = ({
  discoveryData,
  sampleHeads,
  project
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'COMPANY' | 'SERVICES' | 'GALLERY' | 'METHODOLOGY' | 'DOCS' | 'DISCOVERY_SUMMARY'>('OVERVIEW');
  const [galleryFilter, setGalleryFilter] = useState<'ALL' | 'ARCHITECTURE' | 'INTERIOR' | 'CONSTRUCTION' | 'MATERIALS'>('ALL');
  const [copiedLink, setCopiedLink] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hello ${discoveryData.contactPerson || discoveryData.customerName},\n\nWe have prepared your personalized "Project Introduction & Design Discovery Pack" for ${project.title} (${project.projectCode}).\n\nIncluded:\n• Company Profile & Credentials\n• Architectural, Interior & Turnkey Scope\n• Curated 3D Sample Visual Heads & Moodboards\n• 16-Step Project Execution Timeline\n• Pre-requisite Statutory Documents & Sample BOQ\n\nAccess your interactive visual discovery portal here:\n${window.location.href}\n\nWarm regards,\nBuildStorys Design & Infra Tech`
    );
    window.open(`https://wa.me/${discoveryData.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Design Discovery Pack & Visual Portfolio - ${project.title} [${project.projectCode}]`);
    const body = encodeURIComponent(
      `Dear ${discoveryData.contactPerson || discoveryData.customerName},\n\nThank you for sharing your project aspirations with BuildStorys. We are pleased to share our comprehensive "Project Introduction & Design Discovery Pack".\n\nKey Highlights:\n- Project Type: ${discoveryData.projectTypes.join(', ')}\n- Built-Up Area: ${discoveryData.builtUpAreaSqFt} sq.ft\n- Preferred Styles: ${discoveryData.selectedStyles.join(', ')}\n- Budget Tier: ${discoveryData.budgetTier}\n\nPlease review your visual information deck online:\n${window.location.href}\n\nBest regards,\nBuildStorys Architecture & Turnkey Team`
    );
    window.location.href = `mailto:${discoveryData.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const filteredGallery = sampleHeads.filter(h => galleryFilter === 'ALL' || h.category === galleryFilter);

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Action Header Banner (Hidden in Print) */}
      <div className="bg-slate-900 text-white rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0F6CBD] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              Pillar 3: Client Discovery Pack
            </span>
            <span className="text-xs text-slate-400">Ver. 2026.4 • Ready for Client Presentation</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Project Introduction &amp; Design Discovery Pack
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Personalized visual deck for <strong className="text-amber-300">{discoveryData.customerName}</strong> • {project.title} ({project.projectCode})
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Pack</span>
          </button>
          <button
            type="button"
            onClick={handleEmailShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Client</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#0F6CBD]" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs (Hidden in Print) */}
      <div className="bg-white p-1 rounded-lg border border-slate-200 flex items-center gap-1 overflow-x-auto text-xs font-semibold shadow-2xs print:hidden">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3 py-1.5 rounded transition whitespace-nowrap ${
            activeTab === 'OVERVIEW' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Pack Cover &amp; Overview
        </button>
        <button
          onClick={() => setActiveTab('COMPANY')}
          className={`px-3 py-1.5 rounded transition whitespace-nowrap ${
            activeTab === 'COMPANY' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Company Credentials (A)
        </button>
        <button
          onClick={() => setActiveTab('SERVICES')}
          className={`px-3 py-1.5 rounded transition whitespace-nowrap ${
            activeTab === 'SERVICES' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Service Catalogue (B)
        </button>
        <button
          onClick={() => setActiveTab('GALLERY')}
          className={`px-3 py-1.5 rounded transition whitespace-nowrap ${
            activeTab === 'GALLERY' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Sample Visual Portfolio (C)
        </button>
        <button
          onClick={() => setActiveTab('METHODOLOGY')}
          className={`px-3 py-1.5 rounded transition whitespace-nowrap ${
            activeTab === 'METHODOLOGY' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          16-Step Design Process
        </button>
        <button
          onClick={() => setActiveTab('DOCS')}
          className={`px-3 py-1.5 rounded transition whitespace-nowrap ${
            activeTab === 'DOCS' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Pre-Start Documents
        </button>
        <button
          onClick={() => setActiveTab('DISCOVERY_SUMMARY')}
          className={`px-3 py-1.5 rounded transition whitespace-nowrap ${
            activeTab === 'DISCOVERY_SUMMARY' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Captured Requirements
        </button>
      </div>

      {/* TAB 1: COVER OVERVIEW */}
      {(activeTab === 'OVERVIEW' || activeTab === 'COMPANY') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Branded Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-[#0F6CBD] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  BS
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-900 leading-tight">
                    {COMPANY_PROFILE_DATA.companyName}
                  </h1>
                  <p className="text-[11px] text-slate-500">{COMPANY_PROFILE_DATA.brandTagline}</p>
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-600">
              <span className="font-bold text-slate-900 block">Project Identification</span>
              <span className="font-mono text-[#0F6CBD] font-semibold">{project.projectCode}</span> • {project.title}
              <div className="text-[10px] text-slate-400 mt-0.5">Location: {discoveryData.projectLocation}</div>
            </div>
          </div>

          {/* About Company & Key Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#0F6CBD]" />
                <span>About BuildStorys Architecture &amp; Turnkey EPC</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                {COMPANY_PROFILE_DATA.about}
              </p>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                {COMPANY_PROFILE_DATA.stats.map(s => (
                  <div key={s.label} className="p-2.5 rounded bg-slate-50 border border-slate-200 text-center">
                    <span className="block text-base font-bold text-[#0F6CBD] font-mono">{s.value}</span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase leading-tight mt-0.5 block">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Registrations and Certifications */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Institutional Registrations &amp; Certifications</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {COMPANY_PROFILE_DATA.registrations.map(r => (
                    <div key={r} className="flex items-center gap-2 p-1.5 rounded bg-blue-50/50 border border-blue-100">
                      <Shield className="w-3.5 h-3.5 text-[#0F6CBD] shrink-0" />
                      <span className="text-[11px] font-medium">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Leadership & Client Testimonials */}
            <div className="space-y-4 border-l border-slate-100 md:pl-5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Design Leadership</h4>
              <div className="space-y-2 text-xs">
                {COMPANY_PROFILE_DATA.leadership.map(l => (
                  <div key={l.name} className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block">{l.name}</span>
                    <span className="text-[11px] text-[#0F6CBD] font-semibold block">{l.role}</span>
                    <span className="text-[10px] text-slate-500 block">{l.qual}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Client Testimonial</h4>
                <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-xs italic text-slate-700 space-y-1">
                  <p className="text-[11px] leading-relaxed">&ldquo;{COMPANY_PROFILE_DATA.testimonials[0].text}&rdquo;</p>
                  <span className="block text-[10px] font-bold text-slate-900 not-italic pt-1">
                    — {COMPANY_PROFILE_DATA.testimonials[0].client} ({COMPANY_PROFILE_DATA.testimonials[0].project})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICE CATALOGUE (ARCHITECTURE, INTERIOR, CONSTRUCTION) */}
      {(activeTab === 'OVERVIEW' || activeTab === 'SERVICES') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0F6CBD]" />
                <span>B. Comprehensive Turnkey Service Catalogue</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Clearly demarcating professional disciplines and deliverables across design, engineering, and execution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SERVICE_CATALOGUE_DATA.map((cat, idx) => (
              <div key={cat.category} className="rounded-lg border border-slate-200 overflow-hidden flex flex-col justify-between bg-slate-50/40">
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#0F6CBD] text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">{cat.category}</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                    {cat.services.map(svc => (
                      <div key={svc} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{svc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white border-t border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-[#0F6CBD] uppercase">
                    Guaranteed Turnkey Milestone SLA
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIZED SAMPLE PROJECT VISUALS */}
      {(activeTab === 'OVERVIEW' || activeTab === 'GALLERY') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#0F6CBD]" />
                <span>C. Curated Project Sample Visual Album (64 Categorized Heads)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sharing sample inspiration across classified heads so customers can point to precise styles, materials, and details.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
              {(['ALL', 'ARCHITECTURE', 'INTERIOR', 'CONSTRUCTION', 'MATERIALS'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setGalleryFilter(cat)}
                  className={`px-2.5 py-1 rounded transition whitespace-nowrap text-[11px] ${
                    galleryFilter === cat ? 'bg-[#0F6CBD] text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredGallery.slice(0, activeTab === 'OVERVIEW' ? 8 : 64).map(head => (
              <div key={head.id} className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex flex-col group">
                <div className="aspect-16/10 bg-slate-900 overflow-hidden relative">
                  <img
                    src={head.imageUrl}
                    alt={head.headName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                    {head.category}
                  </span>
                </div>
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <span className="font-bold text-slate-900 text-xs line-clamp-1">{head.headName}</span>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{head.description}</p>
                </div>
              </div>
            ))}
          </div>

          {activeTab === 'OVERVIEW' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('GALLERY')}
                className="px-4 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition inline-flex items-center gap-1.5"
              >
                <span>View Full 64-Head Visual Portfolio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: 16-STEP RECOMMENDED DESIGN PROCESS */}
      {(activeTab === 'OVERVIEW' || activeTab === 'METHODOLOGY') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0F6CBD]" />
              <span>D. Recommended 16-Step Design &amp; Turnkey Execution Process</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              A transparent, predictable roadmap from initial discovery through design sign-off, procurement, and key handover.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {DESIGN_PROCESS_STEPS.map(p => (
              <div key={p.step} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#0F6CBD] text-white text-[10px] font-bold flex items-center justify-center">
                      {p.step}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-slate-400">PHASE {Math.ceil(p.step / 4)}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{p.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PRE-START DOCUMENTS & DELIVERABLES */}
      {(activeTab === 'OVERVIEW' || activeTab === 'DOCS') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#0F6CBD]" />
              <span>E. Documents &amp; Assurances Shared Before Project Commencement</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Clear commitments ensuring complete legal, commercial, and technical transparency before site mobilization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {PRE_START_DOCUMENTS_CHECKLIST.map(doc => (
              <div key={doc.code} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#0F6CBD] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      {doc.code}
                    </span>
                    <span className="font-bold text-slate-900">{doc.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{doc.desc}</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded shrink-0">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: DISCOVERY SUMMARY SHEET */}
      {(activeTab === 'OVERVIEW' || activeTab === 'DISCOVERY_SUMMARY') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>F. Captured Project Discovery Brief Summary</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The parameters provided by the client, forming the baseline for preliminary BOQ and AI concept modeling.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
              Verified Intake
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Client Name</span>
              <span className="font-bold text-slate-900 block mt-0.5">{discoveryData.customerName}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Project Types</span>
              <span className="font-semibold text-slate-800 block mt-0.5">{discoveryData.projectTypes.join(', ')}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Built-Up Area</span>
              <span className="font-bold text-slate-900 block mt-0.5 font-mono">{discoveryData.builtUpAreaSqFt} sq.ft</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Target Budget Tier</span>
              <span className="font-bold text-emerald-700 block mt-0.5">{discoveryData.budgetTier} (₹{(discoveryData.overallBudgetINR / 100000).toFixed(1)}L)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Selected Styles</span>
              <span className="font-semibold text-purple-700 block mt-0.5">{discoveryData.selectedStyles.join(', ')}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Kitchen Layout</span>
              <span className="font-semibold text-slate-800 block mt-0.5">{discoveryData.kitchenDetails.layoutType} with {discoveryData.kitchenDetails.countertopMaterial}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Vastu Preference</span>
              <span className="font-semibold text-slate-800 block mt-0.5">{discoveryData.vastuPreference} ({discoveryData.directionFacing})</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Expected Timeline</span>
              <span className="font-semibold text-slate-800 block mt-0.5">{discoveryData.expectedStartDate} to {discoveryData.expectedCompletionDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* Print Footer */}
      <div className="text-center text-[11px] text-slate-400 py-3 border-t border-slate-200">
        BuildStorys Design &amp; Infra Tech Pvt. Ltd. • Mumbai | Bengaluru | Delhi NCR • www.buildstorys.com • Confidential Discovery Pack
      </div>
    </div>
  );
};
