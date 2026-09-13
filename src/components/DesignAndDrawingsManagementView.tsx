/**
 * Build Storys ERP - Design, Drawings & AI Design Options Studio (Pillars 4 & 5)
 * Multi-disciplinary drawing repository with CAD / 3D revision control (Rev A, B, C),
 * GFC issuance, client sign-offs, design issue register, and
 * AI Design Options Generator producing 4-5 project options with internal approval before client release.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  FileCheck,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Building,
  Maximize2,
  RefreshCw,
  Plus,
  Compass,
  FileText,
  DollarSign,
  Palette,
  ShieldCheck,
  ChevronRight,
  Share2
} from 'lucide-react';
import { ProjectRecord, UserSession, AIDesignOption } from '../types/erp';

interface DesignAndDrawingsManagementViewProps {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
}

interface DrawingRecord {
  id: string;
  drawingCode: string;
  discipline: 'ARCHITECTURAL' | 'INTERIOR_LAYOUT' | '3D_RENDERS' | 'STRUCTURAL' | 'ELECTRICAL_MEP' | 'PLUMBING_HVAC';
  title: string;
  revision: 'Rev A' | 'Rev B' | 'Rev C' | 'Rev D';
  status: 'DRAFT' | 'INTERNAL_REVIEW' | 'CLIENT_APPROVED' | 'GFC_ISSUED';
  sheetSize: 'A1' | 'A2' | 'A3';
  scale: string;
  author: string;
  checker: string;
  releaseDate: string;
  fileSizeMb: number;
  imageThumbnail: string;
  gfcStampDate?: string;
  clientCommentsCount: number;
}

const INITIAL_DRAWINGS: DrawingRecord[] = [
  {
    id: 'DWG-001',
    drawingCode: 'SKY-ARC-A-101',
    discipline: 'ARCHITECTURAL',
    title: 'Master Architectural Floor Plan & Demolition Layout',
    revision: 'Rev C',
    status: 'GFC_ISSUED',
    sheetSize: 'A1',
    scale: '1:50',
    author: 'Ar. Aniket Joshi',
    checker: 'Ar. Sanjay Puri',
    releaseDate: '2026-03-01',
    fileSizeMb: 14.2,
    imageThumbnail: '/assets/images/cad_floor_plan_1789216705163.jpg',
    gfcStampDate: '2026-03-02',
    clientCommentsCount: 0
  },
  {
    id: 'DWG-002',
    drawingCode: 'SKY-INT-3D-201',
    discipline: '3D_RENDERS',
    title: 'Living & Dining Area 4K Photorealistic Concept Render',
    revision: 'Rev B',
    status: 'CLIENT_APPROVED',
    sheetSize: 'A2',
    scale: 'NTS',
    author: 'Meera Rao (3D Visualizer)',
    checker: 'Ar. Aniket Joshi',
    releaseDate: '2026-02-24',
    fileSizeMb: 28.5,
    imageThumbnail: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    clientCommentsCount: 2
  },
  {
    id: 'DWG-003',
    drawingCode: 'SKY-INT-3D-202',
    discipline: '3D_RENDERS',
    title: 'Master Bedroom Ensuite - Italian Botticino Concept Render',
    revision: 'Rev B',
    status: 'CLIENT_APPROVED',
    sheetSize: 'A2',
    scale: 'NTS',
    author: 'Meera Rao',
    checker: 'Ar. Aniket Joshi',
    releaseDate: '2026-02-26',
    fileSizeMb: 24.1,
    imageThumbnail: '/assets/images/minimalist_concept_render_1789216644600.jpg',
    clientCommentsCount: 1
  },
  {
    id: 'DWG-004',
    drawingCode: 'SKY-MEP-E-301',
    discipline: 'ELECTRICAL_MEP',
    title: 'Electrical Single Line Diagram (SLD), Automation & HVAC Layout',
    revision: 'Rev B',
    status: 'GFC_ISSUED',
    sheetSize: 'A1',
    scale: '1:50',
    author: 'Eng. K. N. Rao (MEP)',
    checker: 'Project Lead',
    releaseDate: '2026-03-04',
    fileSizeMb: 18.7,
    imageThumbnail: '/assets/images/cad_section_drawing_1789218091254.jpg',
    gfcStampDate: '2026-03-05',
    clientCommentsCount: 0
  }
];

const INITIAL_AI_OPTIONS: AIDesignOption[] = [
  {
    id: 'AI-OPT-01',
    projectId: 'PROJ-SKYLINE-1402',
    optionCode: 'OPTION-1',
    optionName: 'Modern Biophilic Luxury with Warm Teak Accents',
    architecturalStyle: 'Contemporary Biophilic Minimalist',
    lifestyleProfile: 'C-Suite Executive Family, Entertaining Guests, Pet Friendly',
    layoutConcept: 'Open-plan continuous living-dining volume with full-height pocket sliding fluted glass dividers to study.',
    spacePlanningSuggestions: [
      'Eliminate 4.5" dining-study wall to expand natural light penetration from seaface balcony',
      'Create 8-seater island breakfast counter integrated into dry kitchen',
      'Concealed walk-in wardrobe with acoustic backing in Master Ensuite'
    ],
    materialRecommendations: [
      { trade: 'Flooring', specification: 'Imported Botticino Classico Italian Marble (Diamond Polished)', brandTier: 'Classic Italian Direct Quarry', durabilityRating: 'High (30+ Years)' },
      { trade: 'Millwork', specification: 'CenturyPly Architect Marine Ply with Natural Smoked Teak Veneer & PU Polish', brandTier: 'Tier 1 Premium', durabilityRating: 'Water & Termite Proof' },
      { trade: 'Hardware', specification: 'Blum Tip-On Blumotion soft-close concealed runners and clip-top hinges', brandTier: 'Austrian Luxury', durabilityRating: '200k cycle certified' },
      { trade: 'Lighting', specification: 'DALI-2 addressable architectural magnetic track lighting with warm 3000K CRI 95+', brandTier: 'Erco / Flos Equivalent', durabilityRating: '50,000 hrs LED' }
    ],
    sustainabilityFeatures: [
      'Zero-VOC Asian Paints Royale Aspire Low Odour Coatings',
      'Low-flow water sense certified Kohler faucets (3.5 LPM aerators)',
      'Energy-star VRF Daikin ducted inverter system reducing AC power by 28%'
    ],
    preliminaryBOQSummary: {
      civilDemolition: 485000,
      flooringMarble: 2450000,
      carpentryMillwork: 3850000,
      electricalAutomation: 1420000,
      paintingFinishes: 620000,
      hvacPlumbing: 980000
    },
    budgetRangeMin: 9200000,
    budgetRangeMax: 10400000,
    estimatedTimelineWeeks: 20,
    pros: ['Highest resale and luxury aesthetic value', 'Superior acoustic isolation in bedrooms', 'Maximized natural daylight'],
    cons: ['Requires 7-day marble crystallization lead time', 'Higher upfront investment'],
    internalApprovalStatus: 'CLIENT_SELECTED',
    approvedByEstimatorOrLead: 'Ar. Sanjay Puri (Principal)',
    approvedDate: '2026-03-01',
    internalReviewNotes: 'Fully vetted by estimation team. All rates aligned with master library.'
  },
  {
    id: 'AI-OPT-02',
    projectId: 'PROJ-SKYLINE-1402',
    optionCode: 'OPTION-2',
    optionName: 'Neo-Classical Elegance with Brass Trims & Oak Parquet',
    architecturalStyle: 'Modern Parisian Haussmann / Neo-Classical',
    lifestyleProfile: 'Art Collectors, Formal Dinners, Sophisticated Classical Taste',
    layoutConcept: 'Symmetrical room enfilade with decorative wall mouldings, coffered acoustic ceilings, and herringbone parquet.',
    spacePlanningSuggestions: [
      'Add arched vestibule transition between public living room and private bedrooms',
      'Dual vanity in master bathroom with backlit fluted marble pilasters'
    ],
    materialRecommendations: [
      { trade: 'Flooring', specification: 'Engineered European White Oak Herringbone Parquet (UV Lacquered)', brandTier: 'Quick-Step / Boen', durabilityRating: 'Very High' },
      { trade: 'Wall Finishes', specification: 'High-density PU Mouldings with Asian Paints Stucco Veneziano Italian Plaster', brandTier: 'San Marco / Asian Paints', durabilityRating: 'Washable Class 1' },
      { trade: 'Hardware', specification: 'Antique Brushed Brass Knurled Handles by Buster + Punch', brandTier: 'Bespoke Brass', durabilityRating: 'PVD Coated Anti-Tarnish' }
    ],
    sustainabilityFeatures: [
      'FSC certified sustained forestry oak wood',
      'Natural mineral lime plaster with humidity absorption'
    ],
    preliminaryBOQSummary: {
      civilDemolition: 420000,
      flooringMarble: 2100000,
      carpentryMillwork: 4200000,
      electricalAutomation: 1350000,
      paintingFinishes: 890000,
      hvacPlumbing: 920000
    },
    budgetRangeMin: 9500000,
    budgetRangeMax: 10800000,
    estimatedTimelineWeeks: 22,
    pros: ['Timeless architectural character', 'Intricate craftsmanship on paneling'],
    cons: ['Longer joinery fabrication schedule', 'Delicate wooden floor maintenance'],
    internalApprovalStatus: 'INTERNAL_APPROVED',
    approvedByEstimatorOrLead: 'Estimator R. Sen',
    approvedDate: '2026-02-28',
    internalReviewNotes: 'Approved as premium alternative for customer comparison.'
  },
  {
    id: 'AI-OPT-03',
    projectId: 'PROJ-SKYLINE-1402',
    optionCode: 'OPTION-3',
    optionName: 'Industrial Loft with Exposed Microtopping & Matte Black Metals',
    architecturalStyle: 'Urban Industrial Loft / Japandi Fusion',
    lifestyleProfile: 'Tech Founders, Minimalist Living, Clean Lines, Low Maintenance',
    layoutConcept: 'Seamless micro-concrete continuous floor with exposed ceiling slab treated in acoustic acoustic plaster.',
    spacePlanningSuggestions: [
      'Full open kitchen with concrete waterfall island and overhead hanging steel gantry rack',
      'Slide-away metal glass partitions'
    ],
    materialRecommendations: [
      { trade: 'Flooring', specification: 'Seamless Microtopping Concrete 3mm by Ideal Work Italy', brandTier: 'Ideal Work', durabilityRating: 'High Abrasion Resistant' },
      { trade: 'Metalwork', specification: 'CNC laser-cut mild steel with ultra-matte architectural powder coat', brandTier: 'AkzoNobel Interpon', durabilityRating: 'Class 2' }
    ],
    sustainabilityFeatures: [
      'Minimal demolition debris by applying microtopping directly over screed',
      'Low embodied energy raw materials'
    ],
    preliminaryBOQSummary: {
      civilDemolition: 310000,
      flooringMarble: 1450000,
      carpentryMillwork: 3100000,
      electricalAutomation: 1100000,
      paintingFinishes: 580000,
      hvacPlumbing: 880000
    },
    budgetRangeMin: 7200000,
    budgetRangeMax: 8100000,
    estimatedTimelineWeeks: 16,
    pros: ['Fastest execution (16 weeks)', 'Cost effective (saves ~25% over marble options)', 'Scratch and water resilient'],
    cons: ['Subjective aesthetic appeal', 'Cooler acoustic profile'],
    internalApprovalStatus: 'INTERNAL_APPROVED',
    approvedByEstimatorOrLead: 'Estimator R. Sen',
    approvedDate: '2026-02-28'
  },
  {
    id: 'AI-OPT-04',
    projectId: 'PROJ-SKYLINE-1402',
    optionCode: 'OPTION-4',
    optionName: 'Sustainable Tropical Eco-Villa Fitout (Natural Rattan & Lime)',
    architecturalStyle: 'Biophilic Tropical Sustainable',
    lifestyleProfile: 'Wellness focused, Eco-conscious, Organic Living',
    layoutConcept: 'Indoor courtyards, natural ventilation wind tunnels, living green walls with automated drip irrigation.',
    spacePlanningSuggestions: [
      'Balcony integrated planter boxes with automated drip lines',
      'Timber louvers for solar shading on south-facing glass'
    ],
    materialRecommendations: [
      { trade: 'Flooring', specification: 'Handcrafted Kota Stone & Terracotta Tiles with brass inlays', brandTier: 'Heritage Natural Stone', durabilityRating: 'Centuries' },
      { trade: 'Cabinetry', specification: 'Reclaimed Teak wood with natural woven cane rattan inserts', brandTier: 'Artisanal Handcraft', durabilityRating: 'High' }
    ],
    sustainabilityFeatures: [
      '100% locally sourced carbon-negative building materials within 200km radius',
      'Integrated indoor air purification plants'
    ],
    preliminaryBOQSummary: {
      civilDemolition: 350000,
      flooringMarble: 1650000,
      carpentryMillwork: 3400000,
      electricalAutomation: 1200000,
      paintingFinishes: 520000,
      hvacPlumbing: 820000
    },
    budgetRangeMin: 7800000,
    budgetRangeMax: 8700000,
    estimatedTimelineWeeks: 18,
    pros: ['Eco-friendly and carbon-neutral', 'High thermal insulation reducing AC bills'],
    cons: ['Artisanal cane requires skilled craftsmen with longer lead times'],
    internalApprovalStatus: 'INTERNAL_APPROVED',
    approvedByEstimatorOrLead: 'Ar. Sanjay Puri',
    approvedDate: '2026-03-01'
  }
];

export const DesignAndDrawingsManagementView: React.FC<DesignAndDrawingsManagementViewProps> = ({
  project,
  currentUser,
  onNavigateTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'drawings' | 'ai_options' | 'comparison' | 'revisions'>('drawings');
  const [drawings, setDrawings] = useState<DrawingRecord[]>(INITIAL_DRAWINGS);
  const [aiOptions, setAiOptions] = useState<AIDesignOption[]>(INITIAL_AI_OPTIONS);
  const [selectedOption, setSelectedOption] = useState<AIDesignOption>(INITIAL_AI_OPTIONS[0]);
  const [disciplineFilter, setDisciplineFilter] = useState<string>('ALL');

  // Issue GFC Stamp Handler
  const handleIssueGFC = (id: string) => {
    setDrawings(drawings.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: 'GFC_ISSUED',
          gfcStampDate: new Date().toISOString().split('T')[0]
        };
      }
      return d;
    }));
  };

  // Internal Approval of AI Option
  const handleApproveOptionInternally = (id: string) => {
    setAiOptions(aiOptions.map(o => {
      if (o.id === id) {
        return {
          ...o,
          internalApprovalStatus: 'INTERNAL_APPROVED',
          approvedByEstimatorOrLead: currentUser.name,
          approvedDate: new Date().toISOString().split('T')[0]
        };
      }
      return o;
    }));
  };

  const handleShareWithClient = (id: string) => {
    setAiOptions(aiOptions.map(o => {
      if (o.id === id) {
        return {
          ...o,
          internalApprovalStatus: 'SHARED_WITH_CLIENT'
        };
      }
      return o;
    }));
  };

  const filteredDrawings = drawings.filter(d => disciplineFilter === 'ALL' || d.discipline === disciplineFilter);

  return (
    <div className="bg-[#f3f4f6] min-h-screen text-slate-800 p-4 md:p-6 space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-purple-700 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Pillars 4 & 5: Design, CAD Drawings & AI Design Studio
              </h1>
              <span className="text-xs bg-purple-100 text-purple-800 font-mono px-2 py-0.5 rounded font-bold">
                Rev A/B/C + 4 Project Options
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Multi-disciplinary Drawing Revision Control, GFC Issuance & AI-Generated 4-5 Project Options with Internal Approval Workflow
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveSubTab('ai_options')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
              activeSubTab === 'ai_options' ? 'bg-purple-700 text-white shadow-sm' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Design Studio (4 Options)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('drawings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
              activeSubTab === 'drawings' ? 'bg-[#004a99] text-white shadow-sm' : 'bg-blue-50 text-[#004a99] hover:bg-blue-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Drawing Transmittal & GFC</span>
          </button>
          <button
            onClick={() => setActiveSubTab('comparison')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
              activeSubTab === 'comparison' ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Options Comparison Matrix</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DRAWINGS TRANSMITTAL & GFC REVISIONS (Pillar 4) */}
      {activeSubTab === 'drawings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Discipline Filter:
              </span>
              <select
                value={disciplineFilter}
                onChange={(e) => setDisciplineFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2.5 py-1 bg-slate-50 text-slate-700"
              >
                <option value="ALL">All Disciplines (4)</option>
                <option value="ARCHITECTURAL">Architectural Floor Plans</option>
                <option value="3D_RENDERS">3D Photorealistic Renders</option>
                <option value="ELECTRICAL_MEP">Electrical SLD & Automation</option>
                <option value="PLUMBING_HVAC">Plumbing & HVAC</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> GFC Issued (2)
              </span>
              <span className="flex items-center gap-1 ml-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Client Approved (2)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDrawings.map((dwg) => (
              <div key={dwg.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-48 bg-slate-900 overflow-hidden group">
                    <img
                      src={dwg.imageThumbnail}
                      alt={dwg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        {dwg.drawingCode}
                      </span>
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {dwg.revision}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
                        dwg.status === 'GFC_ISSUED' ? 'bg-emerald-600 text-white' :
                        dwg.status === 'CLIENT_APPROVED' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-white'
                      }`}>
                        {dwg.status.replace('_', ' ')}
                      </span>
                    </div>

                    {dwg.gfcStampDate && (
                      <div className="absolute bottom-2 left-2 bg-emerald-950/80 backdrop-blur-xs text-emerald-300 border border-emerald-500/50 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>GFC Certified: {dwg.gfcStampDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm">{dwg.title}</h3>
                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                      <div>Sheet: <strong>{dwg.sheetSize}</strong></div>
                      <div>Scale: <strong>{dwg.scale}</strong></div>
                      <div>Size: <strong>{dwg.fileSizeMb} MB</strong></div>
                      <div>Author: <strong>{dwg.author}</strong></div>
                      <div>Checker: <strong>{dwg.checker}</strong></div>
                      <div>Released: <strong>{dwg.releaseDate}</strong></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="text-slate-400 text-[11px]">
                    Comments: <strong className="text-slate-700">{dwg.clientCommentsCount} Resolved</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {dwg.status !== 'GFC_ISSUED' && (
                      <button
                        onClick={() => handleIssueGFC(dwg.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Stamp & Issue GFC</span>
                      </button>
                    )}
                    <button
                      onClick={() => alert(`Transmittal download: ${dwg.drawingCode}`)}
                      className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-[11px] flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: AI DESIGN OPTIONS STUDIO (Pillar 5) */}
      {activeSubTab === 'ai_options' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: 4 Options List (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  AI Generated Options (4)
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono font-bold">
                  2,850 sq.ft Project
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Select an option below to view space planning, preliminary BOQ summary, and internal approval status.
              </p>

              <div className="space-y-2.5">
                {aiOptions.map((opt) => {
                  const isSelected = selectedOption.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOption(opt)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        isSelected
                          ? 'bg-purple-50 border-purple-600 shadow-xs ring-1 ring-purple-600/30'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-bold text-slate-900 text-xs">{opt.optionName}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          opt.internalApprovalStatus === 'CLIENT_SELECTED' ? 'bg-emerald-100 text-emerald-800' :
                          opt.internalApprovalStatus === 'SHARED_WITH_CLIENT' ? 'bg-blue-100 text-blue-800' :
                          opt.internalApprovalStatus === 'INTERNAL_APPROVED' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {opt.internalApprovalStatus.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 font-mono mb-1">
                        ₹{(opt.budgetRangeMin / 100000).toFixed(0)}L - ₹{(opt.budgetRangeMax / 100000).toFixed(0)}L • {opt.estimatedTimelineWeeks} wks
                      </div>

                      <p className="text-[10px] text-slate-500 line-clamp-2">
                        {opt.layoutConcept}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Active Option In-Depth Spec & Approval (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-5 text-xs">
            
            {/* Header of Option */}
            <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-700 text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                    {selectedOption.optionCode}
                  </span>
                  <h2 className="text-base font-bold text-slate-900">{selectedOption.optionName}</h2>
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  Style: <strong className="text-slate-800">{selectedOption.architecturalStyle}</strong> • Profile: <strong className="text-slate-800">{selectedOption.lifestyleProfile}</strong>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Estimated Budget Range</span>
                <span className="text-lg font-bold text-[#004a99] font-mono">
                  ₹{(selectedOption.budgetRangeMin / 100000).toFixed(1)}L - ₹{(selectedOption.budgetRangeMax / 100000).toFixed(1)}L
                </span>
                <span className="block text-[10px] text-slate-400">Duration: {selectedOption.estimatedTimelineWeeks} Weeks</span>
              </div>
            </div>

            {/* Layout Concept & Space Planning */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#004a99]" />
                <span>Space Planning & Architectural Concept</span>
              </h3>
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-700 leading-relaxed">
                {selectedOption.layoutConcept}
              </div>

              <div className="space-y-1.5 pt-1">
                {selectedOption.spacePlanningSuggestions.map((sp, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{sp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Material Specifications Recommendations */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-700" />
                <span>Recommended Finishes & Brand Specifications</span>
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-2 font-semibold">Trade</th>
                      <th className="p-2 font-semibold">Specification</th>
                      <th className="p-2 font-semibold">Brand Tier</th>
                      <th className="p-2 font-semibold">Durability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOption.materialRecommendations.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2 font-bold text-slate-800">{m.trade}</td>
                        <td className="p-2 text-slate-700">{m.specification}</td>
                        <td className="p-2 text-purple-800 font-mono text-[11px]">{m.brandTier}</td>
                        <td className="p-2 text-slate-600">{m.durabilityRating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Preliminary BOQ Breakdown (Pillar 5 Deliverable) */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Preliminary BOQ Trade Cost Allocation</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Civil & Demolition</span>
                  <strong className="text-slate-800 font-mono">₹{selectedOption.preliminaryBOQSummary.civilDemolition.toLocaleString()}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Flooring & Italian Marble</span>
                  <strong className="text-slate-800 font-mono">₹{selectedOption.preliminaryBOQSummary.flooringMarble.toLocaleString()}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Carpentry & Millwork</span>
                  <strong className="text-slate-800 font-mono">₹{selectedOption.preliminaryBOQSummary.carpentryMillwork.toLocaleString()}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Electrical & Automation</span>
                  <strong className="text-slate-800 font-mono">₹{selectedOption.preliminaryBOQSummary.electricalAutomation.toLocaleString()}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Painting & Special Finishes</span>
                  <strong className="text-slate-800 font-mono">₹{selectedOption.preliminaryBOQSummary.paintingFinishes.toLocaleString()}</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">HVAC & Wet Areas</span>
                  <strong className="text-slate-800 font-mono">₹{selectedOption.preliminaryBOQSummary.hvacPlumbing.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Internal Approval Workflow Strip */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-0.5">
                  Internal Approval Status:
                </span>
                <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded ${
                  selectedOption.internalApprovalStatus === 'CLIENT_SELECTED' ? 'bg-emerald-100 text-emerald-800' :
                  selectedOption.internalApprovalStatus === 'INTERNAL_APPROVED' ? 'bg-purple-100 text-purple-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {selectedOption.internalApprovalStatus.replace(/_/g, ' ')}
                </span>
                {selectedOption.approvedByEstimatorOrLead && (
                  <span className="text-[11px] text-slate-500 ml-2">
                    by {selectedOption.approvedByEstimatorOrLead} on {selectedOption.approvedDate}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedOption.internalApprovalStatus === 'PENDING_INTERNAL_APPROVAL' && (
                  <button
                    onClick={() => handleApproveOptionInternally(selectedOption.id)}
                    className="px-3 py-1.5 rounded bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Approve Internally</span>
                  </button>
                )}
                {selectedOption.internalApprovalStatus === 'INTERNAL_APPROVED' && (
                  <button
                    onClick={() => handleShareWithClient(selectedOption.id)}
                    className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share with Client Portal</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigateTab && onNavigateTab('boq')}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>Transfer Option to BOQ Master</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 3: OPTIONS COMPARISON MATRIX */}
      {activeSubTab === 'comparison' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">4-Option Side-by-Side Comparison Matrix</h3>
            <span className="text-slate-500 text-xs">Architectural, Financial & Timeline Evaluation</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs">
                <tr>
                  <th className="p-3">Evaluation Parameter</th>
                  {aiOptions.map(o => (
                    <th key={o.id} className="p-3 font-bold text-slate-900">
                      {o.optionCode}: {o.optionName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr>
                  <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Architectural Style</td>
                  {aiOptions.map(o => (
                    <td key={o.id} className="p-3 text-slate-800">{o.architecturalStyle}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Estimated Budget Range</td>
                  {aiOptions.map(o => (
                    <td key={o.id} className="p-3 font-bold font-mono text-[#004a99]">
                      ₹{(o.budgetRangeMin / 100000).toFixed(0)}L - ₹{(o.budgetRangeMax / 100000).toFixed(0)}L
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Timeline (Weeks)</td>
                  {aiOptions.map(o => (
                    <td key={o.id} className="p-3 text-slate-800 font-bold">{o.estimatedTimelineWeeks} Weeks</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Primary Flooring Spec</td>
                  {aiOptions.map(o => (
                    <td key={o.id} className="p-3 text-slate-600">{o.materialRecommendations[0]?.specification}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Sustainability Highlights</td>
                  {aiOptions.map(o => (
                    <td key={o.id} className="p-3 text-emerald-700 text-[11px]">{o.sustainabilityFeatures[0]}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Internal Sign-off</td>
                  {aiOptions.map(o => (
                    <td key={o.id} className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        o.internalApprovalStatus === 'CLIENT_SELECTED' ? 'bg-emerald-100 text-emerald-800' :
                        o.internalApprovalStatus === 'INTERNAL_APPROVED' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.internalApprovalStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
