/**
 * Build Storys ERP - AI Design Studio: 11 Integrated AI Submodules
 * -----------------------------------------------------------------
 * 1. Floor Plan Intelligence
 * 2. Space Planning
 * 3. Concept Generator
 * 4. Wall Design Generator
 * 5. Mood Board Generator
 * 6. 3D Visualisation
 * 7. Furniture Design
 * 8. Ceiling Design
 * 9. Material Intelligence
 * 10. Design Alternatives
 * 11. Design Revision AI
 */

import React, { useState } from 'react';
import {
  ScanLine,
  Compass,
  Sparkles,
  Ruler,
  Palette,
  Eye,
  Wrench,
  Sun,
  Layers,
  IndianRupee,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Sliders,
  Download,
  Printer,
  ChevronRight,
  Check,
  AlertCircle
} from 'lucide-react';
import { ProjectRecord, UserSession } from '../../types/erp';
import { DesignConcept } from '../../types/designStudio';

export interface AISubmoduleItem {
  id: string;
  number: number;
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  primaryActionLabel: string;
  keyMetrics: string;
}

export const AI_SUBMODULES: AISubmoduleItem[] = [
  {
    id: 'plan_intel',
    number: 1,
    name: 'Floor Plan Intelligence',
    tagline: 'PDF, DWG & JPG Room Geometry Extraction',
    icon: ScanLine,
    description: 'Reads uploaded CAD or architectural blueprints, extracts room perimeters, masonry walls, structural columns, and opening schedules (SD1-SD7, D1-D4, W1-W5).',
    primaryActionLabel: 'Re-Analyze CAD Blueprints',
    keyMetrics: '7 Rooms • 18 Columns • 100% Geometry Matched'
  },
  {
    id: 'space_planning',
    number: 2,
    name: 'Space Planning',
    tagline: 'Measured Furniture Placement & Circulation Paths',
    icon: Compass,
    description: 'Generates 2D furniture layouts based on confirmed room dimensions with strict luxury circulation clearances (1150mm bed-to-wardrobe pathway).',
    primaryActionLabel: 'Generate Ergonomic Layouts',
    keyMetrics: '1150mm Walkway • Zero Door Collisions'
  },
  {
    id: 'concept_generator',
    number: 3,
    name: 'Concept Generator',
    tagline: 'Multi-Concept Architectural Styling',
    icon: Sparkles,
    description: 'Produces 3-5 distinct architectural concepts from the same geometry model: Modern Luxury, Contemporary Minimalist, Biophilic Teak, and Neo-Classical.',
    primaryActionLabel: 'Generate 4 Design Concepts',
    keyMetrics: '4 Concepts Generated • Concept A Approved'
  },
  {
    id: 'wall_design',
    number: 4,
    name: 'Wall Design Generator',
    tagline: 'Wall A, B, C, D Elevation Synthesis',
    icon: Ruler,
    description: 'Synthesizes each wall separately: Bed Head Wall A (mouldings + fluted acoustic panels), Wall B (vista slider), Wall C (2700mm wardrobe + study), Wall D (TV console).',
    primaryActionLabel: 'Generate Wall A-D Elevations',
    keyMetrics: '4 Walls Modeled • 2900mm Clear Height'
  },
  {
    id: 'mood_board',
    number: 5,
    name: 'Mood Board Generator',
    tagline: 'Materials, Textures, Lighting & Color Harmonies',
    icon: Palette,
    description: 'Generates curated tactile palettes: Sage Green Matt (#73877b), American Walnut (#5a4634), Brushed Gold Alloy (#d4af37), and Asian Paints Royale Matt (#f1f0ea).',
    primaryActionLabel: 'Generate Mood Board & Palette',
    keyMetrics: '6 Swatches Approved • 3000K Warm Lighting'
  },
  {
    id: '3d_visual',
    number: 6,
    name: '3D Visualisation',
    tagline: 'Photorealistic Architectural Renders',
    icon: Eye,
    description: 'Generates ultra-high-resolution photorealistic 3D room views with natural sunlight, shadow falloff, raytraced reflections, and evening mood scenes.',
    primaryActionLabel: 'Render High-Res 3D Views',
    keyMetrics: 'Gemini 3.1 Flash Image • 4K Renders'
  },
  {
    id: 'furniture_design',
    number: 7,
    name: 'Furniture Design',
    tagline: 'Custom Wardrobes, Bed Walls, Study & Vanities',
    icon: Wrench,
    description: 'Parametric joinery design for custom built-ins: MBR Wardrobe 2700mm with study desk, Bed Headboard cushion wall, and 4-door wardrobe with hydraulic loft.',
    primaryActionLabel: 'Open Custom Joinery Builder',
    keyMetrics: '3 Bespoke CAD Units • 18mm BWP Core'
  },
  {
    id: 'ceiling_design',
    number: 8,
    name: 'Ceiling Design',
    tagline: 'False Ceiling, Pelmets, Spotlights & HVAC Slots',
    icon: Sun,
    description: 'False ceiling layout with 150mm perimeter drop cove, Gyproc moisture resistant boards, magnetic low-voltage tracks, and Daikin VRV linear AC diffusers.',
    primaryActionLabel: 'Generate Ceiling & Lighting Grid',
    keyMetrics: '14 Lighting Points • 150mm Pelmet Drop'
  },
  {
    id: 'material_intel',
    number: 9,
    name: 'Material Intelligence',
    tagline: 'Approved Catalog & Rate Library Matching',
    icon: Layers,
    description: 'Automatically maps room elements to corporate master rate library items, verifies OEM brand warranties, and ensures no unapproved specifications exist.',
    primaryActionLabel: 'Audit Catalog Rates & Lead Times',
    keyMetrics: '100% Rate Library Mapped • Century & Hafele'
  },
  {
    id: 'alternatives',
    number: 10,
    name: 'Design Alternatives',
    tagline: 'Budget Tier Packages (Economy, Standard, Luxury)',
    icon: IndianRupee,
    description: 'Generates budget-conscious alternatives for value engineering: Economy (₹72L), Standard (₹96L), and Luxury Bespoke (₹1.15 Cr) with instant trade-off comparisons.',
    primaryActionLabel: 'Compare 3 Budget Alternatives',
    keyMetrics: '₹24L Value Engineering Range'
  },
  {
    id: 'revision_ai',
    number: 11,
    name: 'Design Revision AI',
    tagline: 'Client Feedback-Driven Regeneration',
    icon: RefreshCw,
    description: 'Natural language feedback loop: client requests modifications ("Extend study desk by 300mm", "Change green laminate to oak"), updating CAD, BOQ, and drawings.',
    primaryActionLabel: 'Process Client Feedback Prompt',
    keyMetrics: '1-Click Cascade Update'
  }
];

interface Props {
  project: ProjectRecord;
  currentUser: UserSession;
  activeConcept?: DesignConcept | null;
  onNavigateToDrawings?: () => void;
  onNavigateToBOQ?: () => void;
  onOpenImageToCadModal?: () => void;
}

export const AISubmodulesTray: React.FC<Props> = ({
  project,
  currentUser,
  activeConcept,
  onNavigateToDrawings,
  onNavigateToBOQ,
  onOpenImageToCadModal
}) => {
  const [selectedSubmoduleId, setSelectedSubmoduleId] = useState<string>('plan_intel');
  const [activeFeedbackPrompt, setActiveFeedbackPrompt] = useState<string>('Extend study desk to 900mm and add brushed gold aluminum glass shutter.');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const selectedModule = AI_SUBMODULES.find(m => m.id === selectedSubmoduleId) || AI_SUBMODULES[0];

  const handleExecuteAction = (actionLabel: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActionNotice(`Executed ${selectedModule.name}: ${actionLabel} completed successfully.`);
      setTimeout(() => setActionNotice(null), 4000);
    }, 600);
  };

  return (
    <div className="bg-white border border-[#d2d0ce] rounded-lg shadow-xs overflow-hidden mb-4">
      {/* Tray Header */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#002050] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
            11 AI SUBMODULES
          </span>
          <h3 className="text-xs font-bold text-slate-900">
            AI Design Studio Comprehensive Functionality Suite
          </h3>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            (Floor Plan • Space Planning • Walls • Mood Boards • 3D • Joinery • Ceilings • Revision AI)
          </span>
        </div>

        {/* Bridge Links to Modules 2 & 4 */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onNavigateToDrawings}
            className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded font-semibold text-[11px] transition-colors"
          >
            <span>Proceed to AI Drawings (Module 2)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={onNavigateToBOQ}
            className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded font-semibold text-[11px] transition-colors"
          >
            <span>View AI BOQ (Module 4)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Vision to CAD Converter Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-amber-100/70 to-orange-50 border-b border-amber-300 p-2.5 px-3 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded uppercase shadow-xs">
            VISION → CAD
          </span>
          <span className="font-bold text-slate-900">
            Image-to-CAD Technical Plan Engine:
          </span>
          <span className="text-slate-600 hidden md:inline">
            If customer gives the 3D concept render/photo (Image 1), the system synthesizes the 2D CAD elevation plan with millimeter dimensions (Image 2).
          </span>
        </div>
        <button
          onClick={onOpenImageToCadModal}
          className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs flex items-center gap-1.5 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Image-to-CAD (Image 1 → 2)</span>
        </button>
      </div>

      {/* Notice Banner */}
      {actionNotice && (
        <div className="bg-emerald-50 border-b border-emerald-200 p-2 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Scrollable Submodule Selector Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-slate-100 border-b border-slate-200 scrollbar-thin">
        {AI_SUBMODULES.map(sub => {
          const isSelected = selectedSubmoduleId === sub.id;
          const Icon = sub.icon;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubmoduleId(sub.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#002050] text-white border-[#002050] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200/70'
              }`}
            >
              <span className={`text-[10px] font-mono font-bold px-1 rounded ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {sub.number}
              </span>
              <Icon className="w-3.5 h-3.5" />
              <span>{sub.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Submodule Workspace Panel */}
      <div className="p-4 bg-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">
                SUBMODULE {selectedModule.number} OF 11
              </span>
              <h4 className="text-base font-bold text-slate-900">{selectedModule.name}</h4>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                {selectedModule.tagline}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              {selectedModule.description}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded">
              {selectedModule.keyMetrics}
            </span>
            <button
              onClick={() => handleExecuteAction(selectedModule.primaryActionLabel)}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#002050] hover:bg-[#003366] text-white text-xs font-semibold rounded shadow-xs transition-colors"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Processing AI...' : selectedModule.primaryActionLabel}</span>
            </button>
          </div>
        </div>

        {/* Submodule Specific Interactive Content */}
        {selectedSubmoduleId === 'plan_intel' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="font-bold text-slate-900 block mb-1">Layer Schedule Recognized</span>
              <p className="text-[11px] text-slate-600 font-mono">
                A-WALL, A-DOOR, A-WIND, A-STRS, A-DECK, A-DIMS, A-TEXT, A-NOTE
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="font-bold text-slate-900 block mb-1">Scale Ratio & Units</span>
              <p className="text-[11px] text-slate-600 font-mono">
                1:100 Metric Drawing (MM) • Converted to Feet/Inches for Indian Works
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="font-bold text-slate-900 block mb-1">Opening Schedule Mapped</span>
              <p className="text-[11px] text-slate-600 font-mono">
                Sliders SD1-SD7, Doors D1-D4, Windows W1-W5 mapped to rooms
              </p>
            </div>
          </div>
        )}

        {selectedSubmoduleId === 'furniture_design' && (
          <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Custom Joinery Package (3 Authoritative CAD Cases)</span>
              <button
                onClick={onNavigateToDrawings}
                className="text-blue-700 underline font-semibold text-[11px]"
              >
                Inspect Technical Drawing Sheets (Module 2) →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="font-bold text-slate-900 block">Case 1: MBR Wardrobe 2700mm</span>
                <span className="text-slate-500">With Study Desk, Fluted Battens &amp; Gold Profile</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="font-bold text-slate-900 block">Case 2: Bed Wall Feature Elevation</span>
                <span className="text-slate-500">MDF Moulding PU Paint + Headboard Cushion</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <span className="font-bold text-slate-900 block">Case 3: 4-Door Wardrobe + Loft</span>
                <span className="text-slate-500">Hydraulic Loft + Internal Carcass Section</span>
              </div>
            </div>

            <button
              onClick={onOpenImageToCadModal}
              className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs rounded shadow-xs flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Convert Customer 3D Inspiration Render to 2D Technical CAD Plan (Image 1 → Image 2)</span>
            </button>
          </div>
        )}

        {selectedSubmoduleId === 'revision_ai' && (
          <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2">
            <span className="font-bold text-slate-900 block">
              Natural Language Client Revision Input (Regenerates Drawings + BOQ):
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={activeFeedbackPrompt}
                onChange={e => setActiveFeedbackPrompt(e.target.value)}
                placeholder="e.g. Change wardrobe shutter to smoked oak veneer..."
                className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#002050]"
              />
              <button
                onClick={() => handleExecuteAction(`Revised concept with client feedback: "${activeFeedbackPrompt.slice(0, 30)}..."`)}
                className="px-3 py-1.5 bg-[#002050] hover:bg-[#003366] text-white rounded font-semibold text-xs whitespace-nowrap"
              >
                Apply Feedback AI
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
