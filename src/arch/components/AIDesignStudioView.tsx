import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Share2,
  FileCheck,
  Layers,
  Clock,
  DollarSign,
  Leaf,
  ShieldCheck,
  Eye,
  ArrowRight,
  RefreshCw,
  Award,
  ChevronRight,
  Info,
  Sliders,
  Printer,
  Compass,
  Ruler,
  Maximize2,
  X,
  Camera,
  Palette,
  Paperclip,
  Wand2,
  MessageSquare,
  Sun,
  Wind,
  Zap,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ConceptOption } from '../types';
import { ArchitecturalDrawingViewer } from './ArchitecturalDrawingViewer';
import { ArchitecturalBriefInputsPanel } from './ArchitecturalBriefInputsPanel';
import { getVisualAssetsForConcept } from '../data/architecturalAssets';
import { GeminiStatusBadge } from './GeminiStatusBadge';
import { ConceptStreamingProgress } from './ConceptStreamingProgress';
import { ConceptRefineModal } from './ConceptRefineModal';
import { ConceptCritiqueModal } from './ConceptCritiqueModal';
import { ConceptPitchModal } from './ConceptPitchModal';
import { formatINR } from '../utils/currency';

interface AIDesignStudioViewProps {
  onNavigateTab: (tab: string) => void;
}

export const AIDesignStudioView: React.FC<AIDesignStudioViewProps> = ({ onNavigateTab }) => {
  const {
    activeProject,
    generateConceptsForProject,
    isGeneratingConcepts,
    generationProgress,
    geminiStatus,
    refreshGeminiStatus,
    refineConceptWithGemini,
    critiqueConceptWithGemini,
    generatePitchWithGemini,
    updateConceptReview,
    selectConcept,
    carryForwardConcept,
    addConceptVisualAsset,
    updateConceptVisualAsset,
    approveConceptDrawingSheets,
    discardDraftDrawingSheets,
    stageDrawingSheetUpload,
    addMaterialToConcept,
    addCustomerReference,
    deleteCustomerReference,
  } = useProject();

  const [activeOptionIndex, setActiveOptionIndex] = useState<number>(0);
  const [isCustomerPresentationMode, setIsCustomerPresentationMode] = useState<boolean>(false);
  const [leadNotesInput, setLeadNotesInput] = useState<string>('');
  const [clientCommentsInput, setClientCommentsInput] = useState<string>('');
  const [isRefineModalOpen, setIsRefineModalOpen] = useState<boolean>(false);
  const [isCritiqueModalOpen, setIsCritiqueModalOpen] = useState<boolean>(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState<boolean>(false);

  if (!activeProject) {
    return null;
  }

  const concepts = activeProject.conceptOptions || [];
  const rawConcept: ConceptOption | undefined = concepts[activeOptionIndex] || concepts[0];

  // Guarantee that every concept has complete architectural visual assets & drawings
  const currentConcept: ConceptOption | undefined = useMemo(() => {
    if (!rawConcept) return undefined;
    if (rawConcept.hasUnapprovedDraftSheets && rawConcept.stagedVisualAssets && rawConcept.stagedVisualAssets.length > 0) {
      return {
        ...rawConcept,
        visualAssets: rawConcept.stagedVisualAssets,
      };
    }
    if (rawConcept.visualAssets && rawConcept.visualAssets.length > 0) {
      return rawConcept;
    }
    return {
      ...rawConcept,
      visualAssets: getVisualAssetsForConcept(
        rawConcept.optionNumber,
        rawConcept.themeStyle,
        activeProject.builtUpAreaSqFt
      ),
    };
  }, [rawConcept, activeProject.builtUpAreaSqFt]);

  const handleGenerate = async () => {
    await generateConceptsForProject(activeProject.id);
    setActiveOptionIndex(0);
  };

  const handleGenerateWithCustomInputs = async (params: any) => {
    await generateConceptsForProject(activeProject.id, params);
    setActiveOptionIndex(0);
  };

  const handleToggleInternalApproval = () => {
    if (!currentConcept) return;
    const currentApproval = currentConcept.internalReview.approvedForClient;
    updateConceptReview(
      activeProject.id,
      currentConcept.id,
      {
        approvedForClient: !currentApproval,
        leadNotes: leadNotesInput || currentConcept.internalReview.leadNotes,
        reviewDate: new Date().toISOString().split('T')[0],
      },
      {}
    );
  };

  const handleClientApprove = () => {
    if (!currentConcept) return;
    updateConceptReview(
      activeProject.id,
      currentConcept.id,
      {},
      {
        clientApproved: true,
        clientComments: clientCommentsInput || currentConcept.clientReview.clientComments || 'Approved by client.',
        approvalDate: new Date().toISOString().split('T')[0],
      }
    );
    selectConcept(activeProject.id, currentConcept.id);
  };

  const handleCarryForward = () => {
    if (!currentConcept) return;
    selectConcept(activeProject.id, currentConcept.id);
    carryForwardConcept(activeProject.id, currentConcept.id);
    onNavigateTab('boq');
  };

  const handleAttachSample = (sample: {
    title: string;
    description: string;
    imageUrl: string;
    sourceType: 'client_upload' | 'sample_data' | 'site_survey';
    tags: string[];
  }) => {
    if (!currentConcept) return;
    addConceptVisualAsset(activeProject.id, currentConcept.id, {
      type: 'client_reference',
      title: sample.title,
      subtitle: sample.description,
      caption: sample.description,
      imageUrl: sample.imageUrl,
      tags: sample.tags,
      drawingNumber: sample.sourceType === 'site_survey' ? 'SURV-01' : 'REF-INSP',
      scale: sample.sourceType === 'site_survey' ? '1:50 As-Built' : 'N/A Reference',
      revision: 'Rev A',
    });
  };

  // Architectural schematic visualizer helper
  const renderSchematic = (type: string, theme: string) => {
    switch (type) {
      case 'biophilic':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-44 bg-emerald-950/5 rounded-xl border border-emerald-900/10">
            {/* Grid background lines */}
            <defs>
              <pattern id="archGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="600" height="240" fill="url(#archGrid)" />
            {/* Architectural lightwell atrium */}
            <rect x="230" y="30" width="140" height="180" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
            <text x="300" y="125" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="bold" fontFamily="monospace">
              CENTRAL BIOPHILIC LIGHTWELL
            </text>
            <text x="300" y="142" textAnchor="middle" fill="#065f46" fontSize="9" fontFamily="sans-serif">
              Natural Daylight + Living Planter Core
            </text>

            {/* Social Living Wing */}
            <rect x="40" y="45" width="160" height="150" rx="6" fill="#ffffff" stroke="#334155" strokeWidth="1.75" />
            <text x="120" y="115" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
              Living &amp; Dining Forum
            </text>
            <text x="120" y="132" textAnchor="middle" fill="#64748b" fontSize="9">
              White Oak Slatting (1,450 sq.ft)
            </text>

            {/* Private Sanctum Wing */}
            <rect x="400" y="45" width="160" height="150" rx="6" fill="#ffffff" stroke="#334155" strokeWidth="1.75" />
            <text x="480" y="115" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
              Private Master Suite
            </text>
            <text x="480" y="132" textAnchor="middle" fill="#64748b" fontSize="9">
              Acoustic Buffer Wall (1,100 sq.ft)
            </text>

            {/* Circulation vectors */}
            <line x1="200" y1="120" x2="230" y2="120" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
            <line x1="370" y1="120" x2="400" y2="120" stroke="#10b981" strokeWidth="2" />
            <circle cx="200" cy="120" r="3" fill="#10b981" />
            <circle cx="400" cy="120" r="3" fill="#10b981" />
          </svg>
        );
      case 'minimalist':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-44 bg-slate-900/5 rounded-xl border border-slate-300/40">
            <defs>
              <pattern id="minGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="600" height="240" fill="url(#minGrid)" />
            {/* Monolithic pure volume */}
            <rect x="50" y="35" width="500" height="170" rx="4" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <line x1="220" y1="35" x2="220" y2="205" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="380" y1="35" x2="380" y2="205" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="60" y="45" width="150" height="40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <text x="135" y="70" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">
              Gallery Corridor
            </text>
            <text x="300" y="115" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
              MONOLITHIC PURE GEOMETRY
            </text>
            <text x="300" y="135" textAnchor="middle" fill="#64748b" fontSize="9">
              Shadowline ceiling grilles &amp; jambless pivot planes
            </text>
            <text x="460" y="115" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="bold">
              Integrated Core
            </text>
          </svg>
        );
      case 'industrial':
        return (
          <svg viewBox="0 0 600 240" className="w-full h-44 bg-amber-950/5 rounded-xl border border-amber-900/10">
            <rect width="600" height="240" fill="#fafaf9" />
            {/* Exposed portal frames */}
            <line x1="80" y1="30" x2="80" y2="210" stroke="#334155" strokeWidth="4" />
            <line x1="220" y1="30" x2="220" y2="210" stroke="#334155" strokeWidth="4" />
            <line x1="360" y1="30" x2="360" y2="210" stroke="#334155" strokeWidth="4" />
            <line x1="500" y1="30" x2="500" y2="210" stroke="#334155" strokeWidth="4" />
            <line x1="80" y1="60" x2="500" y2="60" stroke="#d97706" strokeWidth="2.5" />
            <rect x="100" y="80" width="100" height="110" rx="4" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
            <text x="150" y="135" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">
              Crittall Glass Room
            </text>
            <rect x="240" y="80" width="240" height="110" rx="4" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
            <text x="360" y="130" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
              Exposed Portal Framework
            </text>
            <text x="360" y="148" textAnchor="middle" fill="#b45309" fontSize="9" fontWeight="medium">
              Blackened Steel &amp; Polished Terrazzo Matrix
            </text>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 600 240" className="w-full h-44 bg-slate-50 rounded-xl border border-slate-200">
            <rect width="600" height="240" fill="#f8fafc" />
            <rect x="60" y="40" width="480" height="160" rx="6" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
            <line x1="240" y1="40" x2="240" y2="200" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="240" cy="120" r="16" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
            <text x="150" y="125" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
              Zone A: Social Flow
            </text>
            <text x="380" y="115" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
              Zone B: Private Sanctum &amp; Services
            </text>
            <text x="380" y="135" textAnchor="middle" fill="#64748b" fontSize="9">
              Proportional Classical Ratios &amp; Shadowline Cornices
            </text>
          </svg>
        );
    }
  };

  // -------------------------------------------------------------
  // Customer Presentation Mode Deck
  // -------------------------------------------------------------
  if (isCustomerPresentationMode && currentConcept) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Presentation Header Bar */}
        <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-bold uppercase font-mono">
                Customer Walkthrough Deck
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">
                {activeProject.clientName} Residence
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white mt-1">
              Architectural Design Concept Presentation
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Site: {activeProject.siteAddress}, {activeProject.siteCity} • Built-Up Area: {activeProject.builtUpAreaSqFt.toLocaleString()} sq.ft
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Presentation</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCustomerPresentationMode(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-xs"
            >
              Exit Customer Mode
            </button>
          </div>
        </div>

        {/* Concept Options Selector in Presentation Mode */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {concepts.map((opt, idx) => {
            const isCurrent = activeOptionIndex === idx;
            const isSelected = opt.isSelectedConcept;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveOptionIndex(idx)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isCurrent
                    ? 'bg-slate-900 text-white border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                    : isSelected
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={`font-mono font-bold ${isCurrent ? 'text-amber-400' : 'text-slate-500'}`}>
                    Option {opt.optionNumber}
                  </span>
                  {isSelected && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500 text-white">
                      Selected
                    </span>
                  )}
                </div>
                <p className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                  {opt.themeStyle}
                </p>
                <div className="text-[10px] text-slate-400 mt-1">
                  {formatINR(opt.estimatedCostPerSqFt)}/sq.ft • {opt.estimatedWeeks} wks
                </div>
              </button>
            );
          })}
        </div>

        {/* Presentation Visual Canvas & Drawings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-indigo-600 font-mono">
                  PROPOSAL OPTION 0{currentConcept.optionNumber}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-700">
                  {currentConcept.themeStyle}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {currentConcept.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPitchModalOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors flex items-center space-x-1.5 shadow-xs"
                title="Open AI Presentation Pitch Script"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-950" />
                <span>Pitch Script</span>
              </button>

              <div className="text-right pr-3 border-r border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Budget Target</span>
                <span className="text-sm font-bold text-slate-900">{formatINR(currentConcept.totalEstimatedCost)}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Sustainability</span>
                <span className="text-sm font-bold text-emerald-600">{currentConcept.sustainabilityScore}/100</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-4xl bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            {currentConcept.architecturalNarrative}
          </p>

          {/* Full Visual Showcase in Presentation Mode */}
          <ArchitecturalDrawingViewer
            concept={currentConcept}
            clientName={activeProject.clientName}
            builtUpAreaSqFt={activeProject.builtUpAreaSqFt}
            project={activeProject}
            onAttachSampleData={handleAttachSample}
            renderSchematicSvg={renderSchematic}
            isPresentationMode={true}
            onUpdateVisualAsset={(typeOrId, updates) =>
              updateConceptVisualAsset(activeProject.id, currentConcept.id, typeOrId, updates)
            }
            onApproveDrawingSheets={(approverName, approverRole, notes) =>
              approveConceptDrawingSheets(activeProject.id, currentConcept.id, approverName, approverRole, notes)
            }
            onDiscardDraftSheets={() =>
              discardDraftDrawingSheets(activeProject.id, currentConcept.id)
            }
            onStageCustomUpload={(sheetType, fileDataUrl, metadata) =>
              stageDrawingSheetUpload(activeProject.id, currentConcept.id, sheetType, fileDataUrl, metadata)
            }
            onAddMaterial={(material) =>
              addMaterialToConcept(activeProject.id, currentConcept.id, material)
            }
            onAddReference={(ref) => addCustomerReference(activeProject.id, ref)}
            onDeleteReference={(id) => deleteCustomerReference(activeProject.id, id)}
          />

          {/* Client Decision & Sign-off Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-amber-400">
                  Client Decision Protocol
                </span>
                {currentConcept.clientReview.clientApproved && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                    Officially Approved
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {currentConcept.clientReview.clientApproved
                  ? 'Option Approved as Baseline Contract Design'
                  : `Approve Option ${currentConcept.optionNumber} as Project Design Baseline?`}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Approving this concept locks the spatial layouts, finishes, and estimates, directly generating the detailed BOQ, 5 GFC drawings, and milestone payment schedules.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {!currentConcept.clientReview.clientApproved ? (
                <button
                  type="button"
                  onClick={handleClientApprove}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-md flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Approve &amp; Lock Option {currentConcept.optionNumber}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCarryForward}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-colors shadow-md flex items-center space-x-2"
                >
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                  <span>Proceed to Detailed BOQ &amp; Delivery</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Studio Header & Generation Trigger */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              AI Design Studio Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Target: 4 to 5 Distinct Concept Alternatives
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Architectural Concept Options Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Generates 4 to 5 meaningful concept options from confirmed customer requirements and site information. Approved concept carries forward directly into detailed design, BOQ, contract, and execution.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2 shrink-0">
          <GeminiStatusBadge status={geminiStatus} onRefresh={refreshGeminiStatus} />

          <button
            type="button"
            onClick={() => setIsCustomerPresentationMode(!isCustomerPresentationMode)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center space-x-1.5 ${
              isCustomerPresentationMode
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>{isCustomerPresentationMode ? 'Exit Customer Mode' : 'Customer Presentation Mode'}</span>
          </button>

          <button
            type="button"
            disabled={isGeneratingConcepts}
            onClick={handleGenerate}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs flex items-center space-x-2"
          >
            {isGeneratingConcepts ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Synthesizing 5 Options...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{concepts.length > 0 ? 'Regenerate 5 Options' : 'Generate 4-5 Concepts'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-Time Gemini 3.8 Flash Streaming Progress Indicator */}
      <ConceptStreamingProgress
        progress={generationProgress}
        isGenerating={isGeneratingConcepts}
      />

      {/* Architectural Concept Options Studio Input Parameters & AI Directives Panel */}
      <ArchitecturalBriefInputsPanel
        project={activeProject}
        onGenerateWithInputs={handleGenerateWithCustomInputs}
        isGenerating={isGeneratingConcepts}
      />

      {/* No Concepts Generated Yet Empty State */}
      {concepts.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              No Concepts Generated Yet for {activeProject.clientName}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Click &quot;Generate 4-5 Concepts&quot; to synthesize 5 distinct architectural and interior design options complete with spatial zoning, material palettes, sustainability ratings, and cost estimates.
            </p>
          </div>
          <button
            type="button"
            disabled={isGeneratingConcepts}
            onClick={handleGenerate}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs inline-flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isGeneratingConcepts ? 'Synthesizing...' : 'Generate 5 Architectural Concepts'}</span>
          </button>
        </div>
      )}

      {/* 5 Concept Options Tabs */}
      {concepts.length > 0 && (
        <div className="space-y-6">
          {/* Options Switcher Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {concepts.map((opt, idx) => {
              const isCurrent = activeOptionIndex === idx;
              const isSelectedForProject = opt.isSelectedConcept;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActiveOptionIndex(idx)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isCurrent
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : isSelectedForProject
                      ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span
                      className={`font-mono font-bold ${
                        isCurrent ? 'text-amber-400' : 'text-slate-500'
                      }`}
                    >
                      Option {opt.optionNumber}
                    </span>
                    {isSelectedForProject && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500 text-white">
                        Selected
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs font-bold truncate ${
                      isCurrent ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {opt.themeStyle}
                  </p>
                  <div
                    className={`flex items-center justify-between text-[10px] mt-2 pt-2 border-t ${
                      isCurrent ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <span>{formatINR(opt.estimatedCostPerSqFt)}/sq.ft</span>
                    <span>{opt.estimatedWeeks} wks</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Concept Detailed Layout */}
          {currentConcept && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Concept Hero Ribbon */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-slate-200 text-slate-800">
                      Option {currentConcept.optionNumber} of {concepts.length}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {currentConcept.themeStyle}
                    </span>
                    {currentConcept.isSelectedConcept && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Contract Baseline Concept</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5">
                    {currentConcept.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    {currentConcept.architecturalNarrative}
                  </p>
                </div>

                {/* Key Numbers Banner */}
                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                  <div className="text-right pr-3 border-r border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Cost / Sq.Ft</span>
                    <span className="text-base font-bold text-slate-900">{formatINR(currentConcept.estimatedCostPerSqFt)}</span>
                  </div>
                  <div className="text-right pr-3 border-r border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Est. Budget</span>
                    <span className="text-base font-bold text-slate-900">{formatINR(currentConcept.totalEstimatedCost)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sustainability</span>
                    <span className="text-base font-bold text-emerald-600 flex items-center justify-end space-x-1">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>{currentConcept.sustainabilityScore}/100</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Gemini Real-Time AI Copilot Toolbar */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-900/40">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <span className="font-bold text-amber-400 font-mono">Gemini Real-Time AI Copilot</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-300">Live Iteration for Option {currentConcept.optionNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRefineModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center space-x-1.5 shadow-xs"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Refine with AI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCritiqueModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center space-x-1.5 shadow-xs"
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span>Daylighting &amp; Feasibility Critique</span>
                    {currentConcept.aiCritique && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5"></span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPitchModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors flex items-center space-x-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-950" />
                    <span>Client Pitch Script</span>
                    {currentConcept.aiPitchScript && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 ml-0.5"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Micro-Refinements Chips */}
              <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-indigo-600" />
                  <span>Real-Time Quick Directives:</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    refineConceptWithGemini(
                      activeProject.id,
                      currentConcept.id,
                      'Enhance spatial orientation to maximize natural morning daylight penetration and optimize solar shading.'
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 text-[11px] font-medium transition-colors hover:border-indigo-300"
                >
                  ☀️ Daylighting + Overhangs
                </button>
                <button
                  type="button"
                  onClick={() =>
                    refineConceptWithGemini(
                      activeProject.id,
                      currentConcept.id,
                      'Value-engineer finish specifications to reduce total estimated cost by approximately 8% while preserving spatial luxury.'
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 text-[11px] font-medium transition-colors hover:border-indigo-300"
                >
                  💰 Value-Engineer -8%
                </button>
                <button
                  type="button"
                  onClick={() =>
                    refineConceptWithGemini(
                      activeProject.id,
                      currentConcept.id,
                      'Upgrade to carbon-neutral certified timber, low-VOC breathable plasters, and target a 95+ sustainability rating.'
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 text-[11px] font-medium transition-colors hover:border-indigo-300"
                >
                  🌿 Boost Sustainability (95+)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    refineConceptWithGemini(
                      activeProject.id,
                      currentConcept.id,
                      'Incorporate acoustic sound-dampening buffers, isolated master suite wing, and dedicated quiet study.'
                    )
                  }
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 text-[11px] font-medium transition-colors hover:border-indigo-300"
                >
                  🤫 Acoustic Master Wing
                </button>
              </div>

              {/* Main Content: Schematic + Spatial + Materials */}
              <div className="p-6 space-y-6">
                {/* 1. Architectural Drawings, 3D Renders & Sample Data Showcase */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                        <Camera className="w-3.5 h-3.5 text-amber-500" />
                        <span>Architectural Drawing Sheets &amp; 3D Visual Presentation</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Actual 3D photorealistic perspective renders, CAD architectural floor plan drawings, and customer reference data.
                      </p>
                    </div>
                  </div>

                  <ArchitecturalDrawingViewer
                    concept={currentConcept}
                    clientName={activeProject.clientName}
                    builtUpAreaSqFt={activeProject.builtUpAreaSqFt}
                    project={activeProject}
                    onAttachSampleData={handleAttachSample}
                    renderSchematicSvg={renderSchematic}
                    onUpdateVisualAsset={(typeOrId, updates) =>
                      updateConceptVisualAsset(activeProject.id, currentConcept.id, typeOrId, updates)
                    }
                    onApproveDrawingSheets={(approverName, approverRole, notes) =>
                      approveConceptDrawingSheets(activeProject.id, currentConcept.id, approverName, approverRole, notes)
                    }
                    onDiscardDraftSheets={() =>
                      discardDraftDrawingSheets(activeProject.id, currentConcept.id)
                    }
                    onStageCustomUpload={(sheetType, fileDataUrl, metadata) =>
                      stageDrawingSheetUpload(activeProject.id, currentConcept.id, sheetType, fileDataUrl, metadata)
                    }
                    onAddMaterial={(material) =>
                      addMaterialToConcept(activeProject.id, currentConcept.id, material)
                    }
                    onAddReference={(ref) => addCustomerReference(activeProject.id, ref)}
                    onDeleteReference={(id) => deleteCustomerReference(activeProject.id, id)}
                  />
                </div>

                {/* 2. Spatial Zoning & Flow Allocation */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Spatial Zoning &amp; Functional Allocation ({activeProject.builtUpAreaSqFt} sq.ft)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentConcept.spatialZoning.map((zone, zIdx) => (
                      <div key={zIdx} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{zone.zone}</h4>
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                            {zone.allocationSqFt} sq.ft
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                          {zone.flowDescription}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Material Palette Specifications */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Material Specifications &amp; Commercial Rates
                  </h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">Trade Category</th>
                          <th className="py-2.5 px-3">Material Specification</th>
                          <th className="py-2.5 px-3">Surface Finish</th>
                          <th className="py-2.5 px-3">Eco Rating</th>
                          <th className="py-2.5 px-3 text-right">Unit Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {currentConcept.materials.map((mat, mIdx) => (
                          <tr key={mIdx} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 font-semibold text-slate-900">{mat.category}</td>
                            <td className="py-2 px-3">{mat.material}</td>
                            <td className="py-2 px-3 text-slate-500">{mat.finish}</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {mat.ecoRating}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-semibold">
                              {formatINR(mat.estimatedRatePerUnit)} / {mat.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. Dual Review Workflows: Internal Review & Customer Review */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Internal Review Box */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Internal Design Lead Review</span>
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          currentConcept.internalReview.approvedForClient
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {currentConcept.internalReview.approvedForClient
                          ? 'Approved For Client'
                          : 'Pending Approval'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200/80">
                      &quot;{currentConcept.internalReview.leadNotes}&quot;
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Reviewer: {currentConcept.internalReview.reviewedBy}</span>
                      <button
                        type="button"
                        onClick={handleToggleInternalApproval}
                        className="font-semibold text-indigo-600 hover:text-indigo-800 underline"
                      >
                        {currentConcept.internalReview.approvedForClient
                          ? 'Revoke Client Flag'
                          : 'Mark Approved for Client'}
                      </button>
                    </div>
                  </div>

                  {/* Customer Review Box */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1">
                        <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Customer Presentation &amp; Sign-off</span>
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          currentConcept.clientReview.clientApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {currentConcept.clientReview.clientApproved
                          ? 'Client Approved'
                          : 'In Presentation'}
                      </span>
                    </div>

                    {currentConcept.clientReview.clientComments ? (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                        {currentConcept.clientReview.clientComments}
                      </p>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter client feedback or decision notes..."
                        value={clientCommentsInput}
                        onChange={(e) => setClientCommentsInput(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                      />
                    )}

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        {currentConcept.clientReview.approvalDate
                          ? `Signed on ${currentConcept.clientReview.approvalDate}`
                          : 'Pending client confirmation'}
                      </span>
                      {!currentConcept.clientReview.clientApproved && (
                        <button
                          type="button"
                          onClick={handleClientApprove}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        >
                          Lock Customer Approval
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. CARRY FORWARD ENGINE (The Core Mandate) */}
                <div className="p-5 rounded-2xl bg-slate-950 text-white shadow-md space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                        Zero Repeated Data Entry Protocol
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                        Promote &amp; Carry Forward Concept #{currentConcept.optionNumber} to Project Delivery
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                        Seamlessly generates detailed GFC deliverables, itemized BOQ (Rev 0), milestone payment schedule, and site execution plan directly from this concept without retyping data.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCarryForward}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-xs flex items-center space-x-2 shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>
                        {currentConcept.isSelectedConcept ? 'Sync with BOQ & Milestones' : 'Promote Concept to Project'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-950 ml-1" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] pt-2 border-t border-slate-800 text-slate-300">
                    <div className="flex items-center space-x-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Itemized BOQ Rev 0 ($ {currentConcept.totalEstimatedCost.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>5 GFC Working Drawings</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>5 Milestone Payment Invoices</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>6 Execution Phases Workplan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals for Real-Time Gemini AI Copilot */}
      {currentConcept && (
        <>
          <ConceptRefineModal
            isOpen={isRefineModalOpen}
            onClose={() => setIsRefineModalOpen(false)}
            concept={currentConcept}
            clientName={activeProject.clientName}
            onRefine={(instruction) =>
              refineConceptWithGemini(activeProject.id, currentConcept.id, instruction)
            }
          />
          <ConceptCritiqueModal
            isOpen={isCritiqueModalOpen}
            onClose={() => setIsCritiqueModalOpen(false)}
            concept={currentConcept}
            clientName={activeProject.clientName}
            onCritique={() => critiqueConceptWithGemini(activeProject.id, currentConcept.id)}
          />
          <ConceptPitchModal
            isOpen={isPitchModalOpen}
            onClose={() => setIsPitchModalOpen(false)}
            concept={currentConcept}
            clientName={activeProject.clientName}
            onGeneratePitch={() => generatePitchWithGemini(activeProject.id, currentConcept.id)}
          />
        </>
      )}
    </div>
  );
};
